/**
 * Gemini Model Router
 * 
 * 複数Geminiモデル（gemini-3.8-flash, 3.7, 3.6, 3.5）の自動切り替え、
 * レート制限(429)・5xx障害・通信エラー時の自動フォールバック、
 * 指数バックオフ＋ジッター付きリトライ、クールダウン状態管理、
 * 重複リクエスト防止、ストリーミング対応を備えた共通ルーター。
 */

export const GEMINI_CONFIG = {
  // 利用モデル（優先順位順）
  models: [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
  ],
  // リトライ設定
  retry: {
    maxRetriesPerModel: 2, // モデルごとの最大リトライ回数（初回試行 + 最大2回リトライ = 計3回）
    baseDelayMs: 1000,     // 初回バックオフ遅延 (約1秒)
    maxDelayMs: 5000,      // 最大バックオフ遅延 (5秒)
    jitterRatio: 0.3,      // ジッター比率 (±30%のランダム変動)
  },
  // クールダウン設定
  cooldown: {
    baseCooldownMs: 60 * 1000,    // 初回クールダウン: 60秒
    maxCooldownMs: 10 * 60 * 1000, // 最大クールダウン: 10分
    multiplier: 2,                 // 連続失敗時の乗数
  },
  // 一時障害とみなすHTTPステータスコード
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  // 恒久的エラー（モデル切り替え・リトライを行わず即時中断）
  fatalStatuses: [400, 401, 403],
  // タイムアウト設定 (ミリ秒)
  timeoutMs: 45000,
  // デバッグログ出力
  debug: true,
};

export class GeminiModelRouter {
  constructor(config = {}) {
    this.config = {
      ...GEMINI_CONFIG,
      ...config,
      retry: { ...GEMINI_CONFIG.retry, ...(config.retry || {}) },
      cooldown: { ...GEMINI_CONFIG.cooldown, ...(config.cooldown || {}) },
    };

    // 各モデルの状態管理テーブル
    this.modelStates = new Map();
    this._initModelStates();

    // 重複リクエスト防止用のアクティブリクエストロック
    this._activeRequests = new Set();

    // 外部フック（UI通知用など）
    this.onStatusChange = null;
  }

  /**
   * モデル初期化
   */
  _initModelStates() {
    for (const modelId of this.config.models) {
      this.modelStates.set(modelId, {
        id: modelId,
        status: "AVAILABLE", // 'AVAILABLE' | 'COOLDOWN'
        failureCount: 0,
        lastFailureTime: null,
        cooldownUntil: 0,
        lastSuccessTime: null,
        lastErrorReason: null,
      });
    }
  }

  /**
   * デバッグログ出力
   */
  _log(message, ...args) {
    if (this.config.debug) {
      console.log(`[Gemini Router] ${message}`, ...args);
    }
  }

  _warn(message, ...args) {
    console.warn(`[Gemini Router] ${message}`, ...args);
  }

  _error(message, ...args) {
    console.error(`[Gemini Router] ${message}`, ...args);
  }

  /**
   * 保存されているAPIキーを取得
   */
  getApiKey() {
    if (typeof localStorage === "undefined") return "";
    return (localStorage.getItem("gemini_api_key") || "").trim();
  }

  /**
   * 指定モデルが現在利用可能か判定（Cooldown期限切れなら自動復帰）
   */
  isModelAvailable(modelId) {
    const state = this.modelStates.get(modelId);
    if (!state) return false;

    const now = Date.now();
    if (state.status === "COOLDOWN") {
      if (now >= state.cooldownUntil) {
        this.markModelRecovered(modelId);
        return true;
      }
      return false;
    }
    return true;
  }

  /**
   * 利用可能なモデルを優先順位順で取得
   */
  getAvailableModels() {
    const available = [];
    for (const modelId of this.config.models) {
      if (this.isModelAvailable(modelId)) {
        available.push(modelId);
      }
    }
    return available;
  }

  /**
   * 現在最優先で利用可能なモデルを1つ取得
   */
  getAvailableModel() {
    const models = this.getAvailableModels();
    return models.length > 0 ? models[0] : null;
  }

  /**
   * モデルをクールダウン（一時利用不能）状態にする
   */
  markModelUnavailable(modelId, errorReason = "", statusCode = null) {
    const state = this.modelStates.get(modelId);
    if (!state) return;

    state.failureCount += 1;
    state.lastFailureTime = Date.now();
    state.lastErrorReason = errorReason;

    // 404（モデルが存在しない場合）は長期間（30分）除外
    let duration;
    if (statusCode === 404) {
      duration = 30 * 60 * 1000;
    } else {
      duration = Math.min(
        this.config.cooldown.baseCooldownMs *
          Math.pow(this.config.cooldown.multiplier, state.failureCount - 1),
        this.config.cooldown.maxCooldownMs
      );
    }

    state.cooldownUntil = Date.now() + duration;
    state.status = "COOLDOWN";

    this._warn(
      `Marked ${modelId} as COOLDOWN for ${Math.round(duration / 1000)}s. (Reason: ${errorReason || statusCode})`
    );
  }

  /**
   * モデルを復帰（AVAILABLE）状態にする
   */
  markModelRecovered(modelId) {
    const state = this.modelStates.get(modelId);
    if (!state) return;

    const wasCooldown = state.status === "COOLDOWN";
    state.status = "AVAILABLE";
    state.cooldownUntil = 0;
    if (wasCooldown) {
      this._log(`Model recovered: ${modelId} is now AVAILABLE again.`);
    }
  }

  /**
   * モデルでのリクエスト成功を記録
   */
  markModelSuccess(modelId) {
    const state = this.modelStates.get(modelId);
    if (!state) return;

    state.status = "AVAILABLE";
    state.failureCount = 0;
    state.cooldownUntil = 0;
    state.lastSuccessTime = Date.now();
    state.lastErrorReason = null;
  }

  /**
   * 全モデルの状態概要を取得（デバッグ・UI表示用）
   */
  getModelStatus() {
    const now = Date.now();
    const result = {};
    for (const [id, state] of this.modelStates.entries()) {
      const remainingCooldown = Math.max(0, Math.round((state.cooldownUntil - now) / 1000));
      result[id] = {
        status: remainingCooldown > 0 ? "COOLDOWN" : "AVAILABLE",
        failureCount: state.failureCount,
        cooldownRemainingSeconds: remainingCooldown,
        lastSuccessTime: state.lastSuccessTime,
        lastFailureTime: state.lastFailureTime,
        lastErrorReason: state.lastErrorReason,
      };
    }
    return result;
  }

  /**
   * 全モデルの状態をリセット
   */
  reset() {
    this._initModelStates();
    this._activeRequests.clear();
    this._log("All model states and locks reset.");
  }

  /**
   * 指数バックオフ＋ジッター遅延時間の計算
   */
  _calculateBackoffDelay(attempt) {
    const { baseDelayMs, maxDelayMs, jitterRatio } = this.config.retry;
    // 指数バックオフ: baseDelay * 2^attempt
    const expDelay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
    // ジッター: ±(expDelay * jitterRatio * random)
    const jitter = (Math.random() * 2 - 1) * (expDelay * jitterRatio);
    const finalDelay = Math.max(200, Math.round(expDelay + jitter));
    return finalDelay;
  }

  /**
   * 遅延スリープ
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * ユーザー向け通知・状態更新
   */
  _notifyStatus(statusMessage, customCallback) {
    if (typeof customCallback === "function") {
      try {
        customCallback(statusMessage);
      } catch (e) {}
    }
    if (typeof this.onStatusChange === "function") {
      try {
        this.onStatusChange(statusMessage);
      } catch (e) {}
    }
  }

  /**
   * リクエストロックの取得（重複リクエスト防止）
   */
  _acquireLock(requestId) {
    if (this._activeRequests.has(requestId)) {
      throw new Error("同じ処理が既に実行中です。完了するまでお待ちください。");
    }
    this._activeRequests.add(requestId);
  }

  /**
   * リクエストロックの解放
   */
  _releaseLock(requestId) {
    this._activeRequests.delete(requestId);
  }

  /**
   * エラーが一時的な障害（リトライ・フォールバック対象）か判定
   */
  isRetryableError(error, status = null) {
    if (status) {
      if (this.config.retryableStatuses.includes(status)) return true;
      if (status === 404) return true; // 404はモデル非存在のため次モデルへフォールバック
      if (this.config.fatalStatuses.includes(status)) return false;
    }
    if (!error) return false;

    const msg = String(error.message || error).toLowerCase();
    if (
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("rate limit") ||
      msg.includes("resource has been exhausted") ||
      msg.includes("overloaded") ||
      msg.includes("timeout") ||
      msg.includes("aborted") ||
      msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("network error") ||
      msg.includes("500") ||
      msg.includes("502") ||
      msg.includes("503") ||
      msg.includes("504") ||
      msg.includes("408")
    ) {
      return true;
    }
    return false;
  }

  /**
   * エラーが恒久的（APIキー無効やリクエスト形式不正）か判定
   */
  isFatalError(error, status = null) {
    if (status && this.config.fatalStatuses.includes(status)) return true;
    if (!error) return false;

    const msg = String(error.message || error);
    if (
      msg.includes("APIキー") ||
      msg.includes("400") ||
      msg.includes("401") ||
      msg.includes("403") ||
      msg.includes("API_KEY_INVALID") ||
      msg.includes("PERMISSION_DENIED")
    ) {
      return true;
    }
    return false;
  }

  /**
   * 通常コンテンツ生成 (JSON Schema, generationConfig 等対応)
   * 
   * @param {Object} options
   * @param {string} options.systemPrompt
   * @param {string} options.userPrompt
   * @param {boolean} [options.isJson=false]
   * @param {Object} [options.responseSchema=null]
   * @param {Object} [options.generationConfig=null]
   * @param {string} [options.requestId="default_generate"]
   * @param {Function} [options.onStatusChange=null]
   * @returns {Promise<string>} 生成されたテキストレスポンス
   */
  async generate(options) {
    const {
      systemPrompt,
      userPrompt,
      isJson = false,
      responseSchema = null,
      generationConfig = null,
      requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      onStatusChange = null,
    } = options;

    // オフライン判定
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      throw new Error("オフライン状態です。インターネット接続を確認してください。");
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("Gemini APIキーが設定されていません。画面上部の「APIキー設定」から登録してください。");
    }

    this._acquireLock(requestId);

    try {
      return await this._executeWithFallback({
        requestId,
        onStatusChange,
        executeFn: async (modelId) => {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

          const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          };

          if (isJson || generationConfig || responseSchema) {
            payload.generationConfig = {
              ...(generationConfig || {}),
            };
            if (isJson) {
              payload.generationConfig.responseMimeType = "application/json";
            }
            if (responseSchema) {
              payload.generationConfig.responseSchema = responseSchema;
            }
          }

          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

          try {
            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              signal: controller.signal,
            });

            clearTimeout(timer);

            if (!response.ok) {
              const status = response.status;
              let errorBody = "";
              try {
                errorBody = await response.text();
              } catch (_) {}

              if (status === 400 || status === 403 || status === 401) {
                const err = new Error("APIキーが無効であるか、アクセス権限がありません。入力したキーが正しいか確認してください。");
                err.status = status;
                throw err;
              }

              if (status === 404) {
                const err = new Error(`指定されたモデル (${modelId}) が見つかりません。`);
                err.status = 404;
                throw err;
              }

              const err = new Error(`HTTP ${status}: ${response.statusText} ${errorBody ? `(${errorBody.slice(0, 100)})` : ""}`);
              err.status = status;
              throw err;
            }

            const result = await response.json();
            const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textResponse) {
              throw new Error("API応答の内容が空でした。");
            }
            return textResponse;
          } catch (fetchErr) {
            clearTimeout(timer);
            throw fetchErr;
          }
        },
      });
    } finally {
      this._releaseLock(requestId);
    }
  }

  /**
   * ストリーミングコンテンツ生成 (SSE stream)
   * 
   * @param {Object} options
   * @param {string} options.systemPrompt
   * @param {string|Array} options.userPromptOrContents
   * @param {Function} options.onChunk - チャンク受信ごとのコールバック
   * @param {Object} [options.generationConfig=null]
   * @param {string} [options.requestId="default_stream"]
   * @param {Function} [options.onStatusChange=null]
   * @returns {Promise<string>} 生成完了後のフルテキスト
   */
  async generateStream(options) {
    const {
      systemPrompt,
      userPromptOrContents,
      onChunk,
      generationConfig = null,
      requestId = `req_stream_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      onStatusChange = null,
    } = options;

    // オフライン判定
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      throw new Error("オフライン状態です。インターネット接続を確認してください。");
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("Gemini APIキーが設定されていません。画面上部の「APIキー設定」から登録してください。");
    }

    this._acquireLock(requestId);

    // contentsが配列で渡された場合はマルチターン会話として使用
    const contents = Array.isArray(userPromptOrContents)
      ? userPromptOrContents
      : [{ role: "user", parts: [{ text: userPromptOrContents }] }];

    try {
      return await this._executeWithFallback({
        requestId,
        onStatusChange,
        executeFn: async (modelId) => {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?key=${apiKey}&alt=sse`;

          const payload = {
            contents,
            systemInstruction: { parts: [{ text: systemPrompt }] },
          };

          if (generationConfig) {
            payload.generationConfig = generationConfig;
          }

          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

          try {
            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              signal: controller.signal,
            });

            clearTimeout(timer);

            if (!response.ok) {
              const status = response.status;
              let errorBody = "";
              try {
                errorBody = await response.text();
              } catch (_) {}

              if (status === 400 || status === 403 || status === 401) {
                const err = new Error("APIキーが無効であるか、アクセス権限がありません。入力したキーが正しいか確認してください。");
                err.status = status;
                throw err;
              }

              if (status === 404) {
                const err = new Error(`指定されたモデル (${modelId}) が見つかりません。`);
                err.status = 404;
                throw err;
              }

              const err = new Error(`HTTP ${status}: ${response.statusText}`);
              err.status = status;
              throw err;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullText = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");
              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const dataStr = line.replace("data: ", "").trim();
                  if (dataStr === "[DONE]") continue;
                  try {
                    const data = JSON.parse(dataStr);
                    const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                    fullText += textPart;
                    if (onChunk) onChunk(fullText);
                  } catch (_) {}
                }
              }
            }

            if (!fullText) {
              throw new Error("ストリーミング応答が空でした。");
            }
            return fullText;
          } catch (fetchErr) {
            clearTimeout(timer);
            throw fetchErr;
          }
        },
      });
    } finally {
      this._releaseLock(requestId);
    }
  }

  /**
   * 共通の「モデル探索・リトライ・フォールバック」実行ループ
   */
  async _executeWithFallback({ executeFn, onStatusChange, requestId }) {
    // 利用可能モデルのリスト（優先度順）を取得
    let candidateModels = this.getAvailableModels();

    if (candidateModels.length === 0) {
      // 全モデルが一時クールダウン中の場合、最もクールダウン解除が近いモデルを待機または試行
      this._warn("All models are currently in COOLDOWN. Attempting emergency recovery of the primary model.");
      const primaryModel = this.config.models[0];
      this.markModelRecovered(primaryModel);
      candidateModels = [primaryModel];
    }

    this._log(`Request started. Active candidate models: [${candidateModels.join(", ")}]`);

    let lastError = null;
    let fallbackCount = 0;

    for (let mIdx = 0; mIdx < candidateModels.length; mIdx++) {
      const modelId = candidateModels[mIdx];

      if (fallbackCount > 0) {
        this._log(`Fallback: ${modelId}`);
        this._notifyStatus("AIサービスが混雑しているため、別モデルへ切り替えています...", onStatusChange);
      }

      this._log(`Trying: ${modelId}`);

      // モデルごとのリトライループ
      let modelSuccess = false;
      let modelResult = null;
      const maxRetries = this.config.retry.maxRetriesPerModel;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          modelResult = await executeFn(modelId);
          modelSuccess = true;
          this.markModelSuccess(modelId);
          this._log(`Success: ${modelId}`);
          return modelResult;
        } catch (error) {
          lastError = error;
          const status = error.status || null;

          // 恒久的エラー (400, 401, 403等) はリトライもフォールバックも行わず即座に中断
          if (this.isFatalError(error, status)) {
            this._error(`Fatal error detected with ${modelId}: ${error.message}`);
            throw error;
          }

          // 404 (モデルが存在しない) はリトライせず直ちにモデル除外して次へ
          if (status === 404) {
            this._warn(`404 received for ${modelId}. Skipping retries and moving to next model.`);
            this.markModelUnavailable(modelId, "404 Not Found", 404);
            break;
          }

          // 一時的障害（429, 5xx, NetworkError等）か確認
          if (this.isRetryableError(error, status)) {
            if (status === 429) {
              this._warn(`429 received from ${modelId}`);
            } else {
              this._warn(`Temporary error (${status || error.message}) received from ${modelId}`);
            }

            // リトライ回数が残っている場合はバックオフ待機
            if (attempt < maxRetries) {
              const delay = this._calculateBackoffDelay(attempt);
              this._log(
                `Retrying: ${modelId} (attempt ${attempt + 1}/${maxRetries}, backoff ${delay}ms)`
              );
              this._notifyStatus(`モデル ${modelId} で再試行しています (${attempt + 1}/${maxRetries})...`, onStatusChange);
              await this._sleep(delay);
              continue; // 再試行へ
            } else {
              // リトライ上限到達
              this._warn(`Retries exhausted for ${modelId}`);
              this.markModelUnavailable(modelId, error.message, status);
              break; // 次のモデルへフォールバック
            }
          } else {
            // その他の想定外エラー
            this._warn(`Non-retryable error on ${modelId}: ${error.message}`);
            this.markModelUnavailable(modelId, error.message, status);
            break;
          }
        }
      }

      fallbackCount++;
    }

    // 全てのモデルで失敗した場合
    this._error("All Gemini models failed for this request.");
    const finalError = new Error(
      "現在AIサービスに接続できません。しばらくしてから再試行してください。"
    );
    finalError.originalError = lastError;
    throw finalError;
  }
}

// シングルトンインスタンスの作成
export const geminiRouter = new GeminiModelRouter();

// ブラウザのグローバルスコープにも登録（デバッグおよび非モジュールスクリプトからの利用用）
if (typeof window !== "undefined") {
  window.GeminiModelRouter = GeminiModelRouter;
  window.geminiRouter = geminiRouter;
}
