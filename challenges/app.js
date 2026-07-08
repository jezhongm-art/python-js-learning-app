// ============================================================
// challenges/app.js  — JavaScript Coding Challenge Application
// Features: built-in problems, AI problem generator, AI coach
// ============================================================

// ============================================================
// 0. THEME TOGGLE (Dark / Light Mode Sync)
// ============================================================
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
const themeToggleText = document.getElementById("theme-toggle-text");

function syncThemeUI() {
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    themeToggleDarkIcon.classList.add("hidden");
    themeToggleLightIcon.classList.remove("hidden");
    themeToggleText.textContent = "ライトモード";
  } else {
    themeToggleDarkIcon.classList.remove("hidden");
    themeToggleLightIcon.classList.add("hidden");
    themeToggleText.textContent = "ダークモード";
  }
}

if (themeToggleBtn) {
  syncThemeUI();
  themeToggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    syncThemeUI();
  });
}

// ============================================================

// ============================================================
// 1. CHALLENGE DATABASE
// ============================================================
const challenges = [
  {
    id: "sum",
    title: "1. 2つの数値の足し算",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `<p>2つの引数 <code>a</code> と <code>b</code> を受け取り、その合計を返す関数 <code>sum</code> を作成してください。</p>
<h3>引数</h3>
<ul><li><code>a</code> (Number): 1つ目の数値</li><li><code>b</code> (Number): 2つ目の数値</li></ul>
<h3>戻り値</h3>
<ul><li>Number: 2つの数値の合計</li></ul>`,
    template: `function sum(a, b) {
    // ここにコードを記述してください
    
}`,
    functionName: "sum",
    testCases: [
      { input: [1, 2], expected: 3, inputLabel: "sum(1, 2)" },
      { input: [-5, 5], expected: 0, inputLabel: "sum(-5, 5)" },
      { input: [10.5, 4.5], expected: 15, inputLabel: "sum(10.5, 4.5)" },
      { input: [0, 0], expected: 0, inputLabel: "sum(0, 0)" }
    ]
  },
  {
    id: "find-max",
    title: "2. 配列内の最大値を取得",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `<p>数値の配列 <code>arr</code> を受け取り、その配列内の最大値を返す関数 <code>findMax</code> を作成してください。<br>配列が空の場合は <code>null</code> を返してください。</p>
<h3>引数</h3>
<ul><li><code>arr</code> (Array of Numbers): 数値の配列</li></ul>
<h3>戻り値</h3>
<ul><li>Number または null: 配列内の最大値、または null</li></ul>`,
    template: `function findMax(arr) {
    // ここにコードを記述してください
    
}`,
    functionName: "findMax",
    testCases: [
      { input: [[1, 5, 3, 9, 2]], expected: 9, inputLabel: "findMax([1, 5, 3, 9, 2])" },
      { input: [[-10, -5, -20]], expected: -5, inputLabel: "findMax([-10, -5, -20])" },
      { input: [[42]], expected: 42, inputLabel: "findMax([42])" },
      { input: [[]], expected: null, inputLabel: "findMax([])" }
    ]
  },
  {
    id: "reverse-string",
    title: "3. 文字列の反転",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `<p>与えられた文字列 <code>str</code> を反転させた新しい文字列を返す関数 <code>reverseString</code> を作成してください。</p>
<h3>引数</h3>
<ul><li><code>str</code> (String): 元の文字列</li></ul>
<h3>戻り値</h3>
<ul><li>String: 反転した文字列</li></ul>`,
    template: `function reverseString(str) {
    // ここにコードを記述してください
    
}`,
    functionName: "reverseString",
    testCases: [
      { input: ["hello"], expected: "olleh", inputLabel: 'reverseString("hello")' },
      { input: ["JavaScript"], expected: "tpircSavaJ", inputLabel: 'reverseString("JavaScript")' },
      { input: ["a"], expected: "a", inputLabel: 'reverseString("a")' },
      { input: [""], expected: "", inputLabel: 'reverseString("")' }
    ]
  }
];

// ============================================================
// 2. STATE
// ============================================================
let currentChallengeIndex = 0;
/** @type {Array<{inputLabel: string, expected: any, actual: any, pass: boolean, error: boolean}> | null} */
let lastTestResults = null;

// ============================================================
// 3. DOM REFERENCES
// ============================================================
const challengeSelect       = document.getElementById("challenge-select");
const codingTypeBadge       = document.getElementById("coding-type-badge");
const challengeTitle        = document.getElementById("challenge-title");
const challengeDifficulty   = document.getElementById("challenge-difficulty");
const challengeDescription  = document.getElementById("challenge-description");

const codeEditor            = document.getElementById("code-editor");
const lineNumbersContainer  = document.getElementById("line-numbers-container");
const editorBackdrop        = document.getElementById("editor-backdrop");

const formatBtn             = document.getElementById("format-btn");
const resetBtn              = document.getElementById("reset-btn");
const runBtn                = document.getElementById("run-btn");

// 追加参照
const aiReviewBtn           = document.getElementById("ai-review-btn");
const aiReviewPanel         = document.getElementById("ai-review-panel");
const aiReviewContent       = document.getElementById("ai-review-content");
const aiReviewCloseBtn      = document.getElementById("ai-review-close-btn");
const stdoutContainer       = document.getElementById("stdout-container");
const stdoutTerminal        = document.getElementById("stdout-terminal");

const resultContainer       = document.getElementById("result-container");
const resultBadge           = document.getElementById("result-badge");
const testCasesResults      = document.getElementById("test-cases-results");

// API key panel
const apiKeyToggleBtn       = document.getElementById("api-key-toggle-btn");
const apiKeyPanel           = document.getElementById("api-key-panel");
const apiKeyInput           = document.getElementById("api-key-input");
const apiKeySaveBtn         = document.getElementById("api-key-save-btn");
const apiKeyClearBtn        = document.getElementById("api-key-clear-btn");
const apiKeyStatus          = document.getElementById("api-key-status");

// AI
const aiGenerateBtn         = document.getElementById("ai-generate-btn");
const aiDifficultySelect    = document.getElementById("ai-difficulty-select");
const aiTopicInput          = document.getElementById("ai-topic-input");
const aiCoachBtn            = document.getElementById("ai-coach-btn");
const aiCoachPanel          = document.getElementById("ai-coach-panel");
const aiCoachContent        = document.getElementById("ai-coach-content");
const aiCoachCloseBtn       = document.getElementById("ai-coach-close-btn");
const aiLoadingScreen       = document.getElementById("ai-loading-screen");
const aiLoadingTitle        = document.getElementById("ai-loading-title");
const aiLoadingDesc         = document.getElementById("ai-loading-desc");

// ============================================================
// 4. INITIALISATION
// ============================================================
function init() {
  setupApiKeyPanel();
  renderChallengeList();
  selectChallenge(0);
  setupEditorListeners();
  setupAiButtons();
}

// ============================================================
// 5. API KEY MANAGEMENT
// ============================================================
function updateKeyStatus() {
  const savedKey = localStorage.getItem("gemini_api_key");
  if (savedKey) {
    apiKeyInput.value = savedKey;
    apiKeyStatus.className = "text-xs flex items-center gap-1 text-emerald-400 font-semibold";
    apiKeyStatus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> APIキー設定済み`;
    apiKeyStatus.classList.remove("hidden");
  } else {
    apiKeyInput.value = "";
    apiKeyStatus.className = "text-xs flex items-center gap-1 text-amber-400 font-semibold";
    apiKeyStatus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> APIキー未設定`;
    apiKeyStatus.classList.remove("hidden");
  }
}

function setupApiKeyPanel() {
  updateKeyStatus();

  apiKeyToggleBtn.onclick = () => {
    apiKeyPanel.classList.toggle("hidden");
  };

  apiKeySaveBtn.onclick = () => {
    const key = apiKeyInput.value.trim();
    if (!key) { alert("APIキーを入力してください。"); return; }
    localStorage.setItem("gemini_api_key", key);
    updateKeyStatus();
    apiKeyPanel.classList.add("hidden");
  };

  apiKeyClearBtn.onclick = () => {
    localStorage.removeItem("gemini_api_key");
    updateKeyStatus();
  };
}

// ============================================================
// 6. GEMINI API — STANDALONE HELPER
// ============================================================
function getGeminiConfig() {
  const key = (localStorage.getItem("gemini_api_key") || "").trim();
  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`,
    hasKey: !!key,
  };
}

/**
 * Call Gemini API as an SSE stream.
 */
async function callGeminiStream(systemPrompt, userPrompt, onChunk) {
  const cfg = getGeminiConfig();
  const streamUrl = cfg.url.replace(":generateContent", ":streamGenerateContent") + "&alt=sse";

  if (!cfg.hasKey) {
    apiKeyPanel.classList.remove("hidden");
    throw new Error("Gemini APIキーが設定されていません。画面右上の「APIキー」ボタンから設定してください。");
  }

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  const response = await fetch(streamUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok)
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);

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
        } catch (e) {}
      }
    }
  }
  return fullText;
}

/**
 * Calls the Gemini API with exponential-back-off retry (up to 5 attempts).
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {boolean} isJson  - request JSON output
 * @param {object|null} responseSchema - optional Gemini response schema
 */
async function callGemini(systemPrompt, userPrompt, isJson = false, responseSchema = null) {
  const cfg = getGeminiConfig();

  if (!cfg.hasKey) {
    apiKeyPanel.classList.remove("hidden");
    throw new Error("Gemini APIキーが設定されていません。画面右上の「APIキー」ボタンから設定してください。");
  }

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  if (isJson) {
    payload.generationConfig = { responseMimeType: "application/json" };
    if (responseSchema) payload.generationConfig.responseSchema = responseSchema;
  }

  let delay = 1000;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(cfg.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 403)
          throw new Error("APIキーが無効か、アクセス権限がありません。");
        if (response.status === 404)
          throw new Error("指定されたモデルが見つかりません。");
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("APIからの応答が空です。");
      return text;
    } catch (err) {
      if (err.message.includes("APIキー") || err.message.includes("404") || attempt === 4) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

function showAiLoader(title, desc) {
  aiLoadingTitle.textContent = title;
  aiLoadingDesc.textContent = desc;
  aiLoadingScreen.classList.remove("hidden");
}

function hideAiLoader() {
  aiLoadingScreen.classList.add("hidden");
}

// ============================================================
// 7. AI CHALLENGE GENERATOR
// ============================================================

// Topic pools per difficulty
const topicPools = {
  easy:   ["FizzBuzz", "文字列カウント", "偶数/奇数判定", "配列の合計", "最小値取得", "文字列の大文字化"],
  medium: ["フィボナッチ数列", "素数判定", "二重ループ", "配列の重複除去", "文字列の回文チェック", "フラット化"],
  hard:   ["メモ化再帰", "クロージャカウンタ", "Promiseチェーン", "カスタムイテレータ", "関数合成", "LRUキャッシュ"],
};

const difficultyMeta = {
  easy:   { label: "初級", color: "bg-emerald-100 text-emerald-800" },
  medium: { label: "中級", color: "bg-amber-100 text-amber-800" },
  hard:   { label: "上級", color: "bg-rose-100 text-rose-800" },
};

async function generateAiChallenge() {
  const difficulty = aiDifficultySelect.value;
  const rawTopic   = aiTopicInput.value.trim();
  const pool       = topicPools[difficulty] || topicPools.medium;
  const topic      = rawTopic || pool[Math.floor(Math.random() * pool.length)];
  const meta       = difficultyMeta[difficulty];

  showAiLoader("✨ AI課題を生成中...", `Gemini AIが「${meta.label}」難易度のJavaScript課題を設計しています。`);

  const diffConstraint = {
    easy:   "初心者向け。基本的な演算子やループ、条件分岐のみ使用。引数・戻り値は単純な Number や String。",
    medium: "中級者向け。配列メソッド（map, filter, reduce）や文字列操作、基本的なアルゴリズムを組み合わせる問題。",
    hard:   "上級者向け。クロージャ、再帰、高階関数、非同期処理、またはデータ構造の設計が必要な本格的な問題。",
  }[difficulty];

  const systemPrompt = `あなたはJavaScriptプログラミングの試験問題設計の専門家です。
指定された難易度とテーマに厳密に合致した、ブラウザ上で動的テスト可能なコーディング問題を1問設計してください。
必ず指定のJSONスキーマに従ったレスポンスを返してください。`;

  // プロンプトを強化し、テンプレートに必ず改行を含めるよう指示
  const userPrompt = `難易度: ${meta.label}
テーマ: ${topic}
難易度設計基準: ${diffConstraint}

以下のJSONスキーマで問題を1問生成してください。
testCasesは4件以上、エッジケース（空配列、0、負数、空文字列など）を必ず含めること。
functionNameは英語のキャメルケースで、descriptionはHTMLタグ（<p>,<code>,<ul>,<li>,<h3>）を使用してください。
【必須】templateは必ず関数の開き波括弧の後に改行(\\n)を入れた3行以上の複数行コードにしてください。`;

  const schema = {
    type: "OBJECT",
    properties: {
      title:        { type: "STRING", description: "課題のタイトル（日本語）" },
      functionName: { type: "STRING", description: "実装すべき関数名（英語キャメルケース）" },
      description:  { type: "STRING", description: "HTML形式の詳細な問題説明" },
      template:     { type: "STRING", description: "初期コードテンプレート。必ず改行(\\n)を入れた複数行で指定（例: 'function foo() {\\n    // ここにコードを記述してください\\n    \\n}'）" },
      testCases: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            input:      { type: "ARRAY", items: {}, description: "関数への引数リスト" },
            expected:   { description: "期待される戻り値" },
            inputLabel: { type: "STRING", description: "テストの表示ラベル（例: sum(1, 2)）" },
          },
          required: ["input", "expected", "inputLabel"],
        },
      },
    },
    required: ["title", "functionName", "description", "template", "testCases"],
  };

  try {
    const jsonText = await callGemini(systemPrompt, userPrompt, true, schema);
    const parsed   = JSON.parse(jsonText);

    // 1. 改行コードの正規化処理
    let cleanTemplate = parsed.template ? parsed.template.replace(/\\n/g, "\n").replace(/\r\n/g, "\n") : "";

    // 2. 万が一AIが1行で生成した場合の自動フォーマット(複数行化)処理の安全装置
    if (!cleanTemplate.includes("\n")) {
      const fnName = parsed.functionName || "solution";
      cleanTemplate = `function ${fnName}() {\n    // ここにコードを記述してください\n    \n}`;
    }

    // 新しい課題オブジェクトを構築
    const newId = `ai-${Date.now()}`;
    const newChallenge = {
      id:              newId,
      title:           `[AI] ${parsed.title}`,
      difficulty:      meta.label,
      difficultyColor: meta.color,
      description:     parsed.description ? parsed.description.replace(/\\n/g, "\n") : "",
      template:        cleanTemplate,
      functionName:    parsed.functionName,
      testCases:       parsed.testCases,
      isAiGenerated:   true,
    };

    // リストの先頭に追加して選択
    challenges.unshift(newChallenge);
    currentChallengeIndex = 0;
    renderChallengeList();
    selectChallenge(0);

    aiTopicInput.value = "";
  } catch (err) {
    alert(`AI課題生成失敗: ${err.message}`);
  } finally {
    hideAiLoader();
  }
}

// ============================================================
// 8. AI CODING COACH
// ============================================================
async function requestAiCoach() {
  const ch       = challenges[currentChallengeIndex];
  const userCode = codeEditor.value;

  if (!userCode.trim()) {
    alert("コードを入力してからAIコーチに相談してください。");
    return;
  }

  let testResultSummary = "テストはまだ実行されていません。";
  if (lastTestResults) {
    const passing = lastTestResults.filter(r => r.pass).length;
    const total   = lastTestResults.length;
    testResultSummary = `テスト結果: ${passing}/${total} 通過\n` +
      lastTestResults.map(r =>
        `- [${r.pass ? "PASS" : "FAIL"}] ${r.inputLabel} → 期待: ${formatValue(r.expected)}, 実際: ${formatValue(r.actual)}${r.error ? " (エラー)" : ""}`
      ).join("\n");
  }

  aiCoachContent.innerHTML = '<span class="animate-pulse text-indigo-500 font-bold">✨ AIコーチがコードを分析し、タイピングしています...</span>';
  aiCoachPanel.classList.remove("hidden");
  aiReviewPanel.classList.add("hidden");
  aiCoachPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const systemPrompt = `あなたはJavaScriptプログラミングを始めたばかりの初心者を優しく指導するプログラミングコーチAIです。

【絶対ルール】
1. 解答コードをそのまま提示することは絶対に禁止です。
2. 「何を使えばよいか」「なぜ現在の実装が問題か」を論理的に説明してください。
3. ヒントはステップ形式で提示し、学習者が自分で気づけるよう誘導してください。
4. コードの一部のみを示す場合も、完全な解答にならないようにしてください。
5. 日本語で、親しみやすいトーンで回答してください。`;

  const userPrompt = `【課題タイトル】${ch.title}

【問題説明】
${ch.description.replace(/<[^>]+>/g, "")}

【期待する関数名】${ch.functionName}

【ユーザーのコード】
\`\`\`javascript
${userCode}
\`\`\`

【テスト実行結果】
${testResultSummary}

上記の情報をもとに、このユーザーへのアドバイスをMarkdown形式で作成してください。`;

  try {
    await callGeminiStream(systemPrompt, userPrompt, (fullText) => {
      aiCoachContent.innerHTML = DOMPurify.sanitize(marked.parse(fullText));
    });
  } catch (err) {
    alert(`AIコーチ取得失敗: ${err.message}`);
  }
}

function setupAiButtons() {
  aiGenerateBtn.onclick = async () => {
    aiGenerateBtn.disabled = true;
    try { await generateAiChallenge(); }
    finally { aiGenerateBtn.disabled = false; }
  };

  aiCoachBtn.onclick = async () => {
    aiCoachBtn.disabled = true;
    try { await requestAiCoach(); }
    finally { aiCoachBtn.disabled = false; }
  };

  // AIレビュー＆模範解答リクエストロジック
  aiReviewBtn.onclick = async () => {
    const ch       = challenges[currentChallengeIndex];
    const userCode = codeEditor.value;

    if (!userCode.trim()) {
      alert("コードを入力してからAIレビューを依頼してください。");
      return;
    }

    aiReviewContent.innerHTML = '<span class="animate-pulse text-purple-500 font-bold">🎓 AIシニアエンジニアがコードを詳細レビュー中です...</span>';
    aiReviewPanel.classList.remove("hidden");
    aiCoachPanel.classList.add("hidden");
    aiReviewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const systemPrompt = `あなたは卓越したJavaScriptシニアフロントエンドエンジニアであり、素晴らしい技術指導者です。
生徒が書いたJavaScriptコード（ES6+）をレビューし、アルゴリズムの効率性、パフォーマンス、可読性、モダンな書き方（スプレッド構文、アロー関数、配列メソッドの使いこなし等）の観点から徹底評価してください。
また、もっとも模範的かつクリーンな「模範解答コード例」と、その時間計算量および空間計算量の解説を提供してください。
解答コードブロックは必ずマークダウン（\`\`\`javascript）で記述してください。`;

    const userPrompt = `【課題タイトル】${ch.title}
【課題説明】: ${ch.description.replace(/<[^>]+>/g, "")}
【期待されるアサーションテスト】: ${JSON.stringify(ch.testCases)}

【生徒が現在書いた解答コード】:
\`\`\`javascript
${userCode}
\`\`\`

この情報を元に、以下の3つの構成でMarkdown形式の丁寧なレビューを日本語で行ってください。
1. **コードの評価・アドバイス**: 良かった点、リファクタリング（洗練）できる箇所、バグやエッジケース（空配列など）への対策。
2. **もっとも洗練された模範解答コード例**: モダンで美しいJavaScriptコード例。
3. **計算量と設計のアプローチ解説**: 計算量（O記法）も交えた技術解説。`;

    try {
      await callGeminiStream(systemPrompt, userPrompt, (fullText) => {
        aiReviewContent.innerHTML = DOMPurify.sanitize(marked.parse(fullText));
      });
    } catch (err) {
      alert(`AIレビュー取得失敗: ${err.message}`);
    }
  };

  aiReviewCloseBtn.onclick = () => {
    aiReviewPanel.classList.add("hidden");
  };

  aiCoachCloseBtn.onclick = () => {
    aiCoachPanel.classList.add("hidden");
  };
}

// ============================================================
// 9. CHALLENGE LIST RENDERING
// ============================================================
function renderChallengeList() {
  challengeSelect.innerHTML = challenges
    .map((ch, idx) => {
      const prefix = ch.isAiGenerated ? "✨ [AI] " : "";
      const title = ch.title.replace(/^\[AI\]\s*/, "").replace(/^\d+\.\s*/, "");
      return `<option value="${idx}">${prefix}${title}</option>`;
    })
    .join("");

  // プルダウン変更時のイベント
  challengeSelect.onchange = (e) => {
    selectChallenge(parseInt(e.target.value, 10));
  };
  
  // 選択状態を同期
  challengeSelect.value = currentChallengeIndex;
}

// ============================================================
// 10. CHALLENGE SELECTION
// ============================================================
function selectChallenge(index) {
  currentChallengeIndex = index;
  lastTestResults = null;
  const ch = challenges[index];

  renderChallengeList();

  const displayTitle = ch.title.replace(/^\d+\.\s*/, "").replace(/^\[AI\]\s*/, "");
  challengeTitle.textContent = displayTitle;
  challengeDifficulty.innerHTML = `<span class="text-xs font-bold px-2.5 py-1 rounded-full ${ch.difficultyColor}">${ch.difficulty}</span>`;

  // バッジの表示切り替え
  if (ch.isAiGenerated) {
    codingTypeBadge.classList.remove("hidden");
  } else {
    codingTypeBadge.classList.add("hidden");
  }

  // ★ここで marked.parse を通すことで、バッククォートの表示バグを直します
  challengeDescription.innerHTML = DOMPurify.sanitize(marked.parse(ch.description));

  const savedCode = localStorage.getItem(`js_challenge_${ch.id}`);
  codeEditor.value = savedCode !== null ? savedCode : ch.template;

  resultContainer.classList.add("hidden");
  aiCoachPanel.classList.add("hidden");
  aiReviewPanel.classList.add("hidden");
  stdoutContainer.classList.add("hidden");
  stdoutTerminal.textContent = "";

  updateEditorDecorations();
}

// ============================================================
// 11. EDITOR DECORATIONS (line numbers + Prism.js Syntax Highlight)
// ============================================================
function updateEditorDecorations() {
  if (!codeEditor || !lineNumbersContainer || !editorBackdrop) return;

  const text = codeEditor.value;
  const lines = text.split("\n");

  // 行番号の更新
  const lineCount = lines.length;
  let lineNumbersHtml = "";
  for (let i = 1; i <= lineCount; i++) {
    lineNumbersHtml += `<div class="editor-line">${i}</div>`;
  }
  lineNumbersContainer.innerHTML = lineNumbersHtml;

  // Prism.js を使ったハイライト生成 (JavaScript用)
  let highlighted = escapeHtml(text);
  try {
    if (window.Prism && window.Prism.languages && window.Prism.languages.javascript) {
      highlighted = window.Prism.highlight(text, window.Prism.languages.javascript, "javascript");
    } else {
      console.warn("Prism.js が読み込まれていないか、JavaScript定義がありません。");
    }
  } catch (err) {
    console.error("ハイライト処理中にエラーが発生しました:", err);
  }

  // 行頭の半角スペース（4つ区切り）を検出し、インデントガイド用のタグに置き換える
  const highlightedLines = highlighted.split("\n");
  const processedLines = highlightedLines.map((line) => {
    const match = line.match(/^( +)/);
    if (match) {
      const spacesCount = match[1].length;
      const indentCount = Math.floor(spacesCount / 4);
      const remainingSpaces = spacesCount % 4;
      let indentHtml = "";
      for (let i = 0; i < indentCount; i++) {
        indentHtml += '<span class="indent-guide">    </span>';
      }
      indentHtml += " ".repeat(remainingSpaces);
      return indentHtml + line.slice(spacesCount);
    }
    return line;
  });
  highlighted = processedLines.join("\n");

  // 末尾が改行の場合に表示がズレないようにダミーの改行を付与
  if (text.endsWith("\n")) highlighted += "<br/>";

  // 生成したHTMLをバックドロップに流し込む
  // 【修正】white-space: pre を強制して改行崩れを防ぎ、background-color: transparent で不要な背景帯を消します
  editorBackdrop.innerHTML = `<code class="language-javascript" style="display: block; white-space: pre !important; background-color: transparent !important; padding: 0 !important; margin: 0 !important; text-shadow: none !important;">${highlighted}</code>`;

  // スクロール同期
  editorBackdrop.scrollTop = codeEditor.scrollTop;
  editorBackdrop.scrollLeft = codeEditor.scrollLeft;
  lineNumbersContainer.scrollTop = codeEditor.scrollTop;
}

// ============================================================
// 12. EDITOR EVENT LISTENERS
// ============================================================
function setupEditorListeners() {
  codeEditor.addEventListener("scroll", () => {
    editorBackdrop.scrollTop       = codeEditor.scrollTop;
    editorBackdrop.scrollLeft      = codeEditor.scrollLeft;
    lineNumbersContainer.scrollTop = codeEditor.scrollTop;
  });

  codeEditor.addEventListener("input", () => {
    const ch = challenges[currentChallengeIndex];
    localStorage.setItem(`js_challenge_${ch.id}`, codeEditor.value);
    updateEditorDecorations();
  });

  codeEditor.addEventListener("keydown", function (e) {
    const { selectionStart: start, selectionEnd: end, value } = this;

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        const before    = value.substring(0, start);
        const after     = value.substring(end);
        const lineStart = before.lastIndexOf("\n") + 1;
        const line      = value.substring(lineStart, start);
        if (line.startsWith("    ")) {
          this.value = before.substring(0, lineStart) + line.substring(4) + after;
          this.selectionStart = this.selectionEnd = start - 4;
        }
      } else {
        this.value = value.substring(0, start) + "    " + value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
      }
      localStorage.setItem(`js_challenge_${challenges[currentChallengeIndex].id}`, this.value);
      updateEditorDecorations();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const beforeCursor = value.substring(0, start);
      const afterCursor  = value.substring(end);
      const currentLine  = beforeCursor.substring(beforeCursor.lastIndexOf("\n") + 1);
      let indent = (currentLine.match(/^( +)/) || ["", ""])[1];
      if (currentLine.trim().endsWith("{")) indent += "    ";
      this.value = beforeCursor + "\n" + indent + afterCursor;
      this.selectionStart = this.selectionEnd = start + 1 + indent.length;
      localStorage.setItem(`js_challenge_${challenges[currentChallengeIndex].id}`, this.value);
      updateEditorDecorations();
    }
  });

  // Format button
  formatBtn.onclick = () => {
    let indentLevel = 0;
    codeEditor.value = codeEditor.value.split("\n").map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
      const result = "    ".repeat(indentLevel) + trimmed;
      if (trimmed.endsWith("{")) indentLevel++;
      return result;
    }).join("\n");
    localStorage.setItem(`js_challenge_${challenges[currentChallengeIndex].id}`, codeEditor.value);
    updateEditorDecorations();
  };

  // Reset button
  resetBtn.onclick = () => {
    if (confirm("コードを初期状態にリセットしますか？")) {
      const ch = challenges[currentChallengeIndex];
      codeEditor.value = ch.template;
      localStorage.setItem(`js_challenge_${ch.id}`, ch.template);
      updateEditorDecorations();
    }
  };

  // Run tests
  runBtn.onclick = runJavaScriptTests;
}

// ============================================================
// 13. TEST EXECUTION ENGINE
// ============================================================
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null || typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === "object") {
    const kA = Object.keys(a), kB = Object.keys(b);
    if (kA.length !== kB.length) return false;
    return kA.every(k => kB.includes(k) && deepEqual(a[k], b[k]));
  }
  return false;
}

function runJavaScriptTests() {
  const ch       = challenges[currentChallengeIndex];
  const userCode = codeEditor.value;

  // console.log の一時的オーバーライド
  let capturedLogs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    const stringified = args.map(arg => {
      if (arg === null) return "null";
      if (arg === undefined) return "undefined";
      if (typeof arg === "object") {
        try { return JSON.stringify(arg); } catch (e) { return String(arg); }
      }
      return String(arg);
    }).join(" ");
    capturedLogs.push(stringified);
    originalLog(...args); // ブラウザのデベロッパーツールにも通常出力
  };

  let userFunction  = null;
  let compileError  = null;

  try {
    const compiler = new Function(userCode + `\nreturn ${ch.functionName};`);
    userFunction   = compiler();
    if (typeof userFunction !== "function")
      throw new Error(`関数 '${ch.functionName}' が定義されていません。`);
  } catch (err) {
    compileError = err.message;
  }

  const results  = [];
  let   allPass  = true;

  if (compileError) {
    allPass = false;
    results.push({ inputLabel: "コンパイル・実行エラー", expected: "正常実行", actual: compileError, pass: false, error: true });
  } else {
    ch.testCases.forEach(tc => {
      try {
        const args   = JSON.parse(JSON.stringify(tc.input));
        const actual = userFunction(...args);
        const pass   = deepEqual(actual, tc.expected);
        if (!pass) allPass = false;
        results.push({ inputLabel: tc.inputLabel, expected: tc.expected, actual, pass, error: false });
      } catch (runErr) {
        allPass = false;
        results.push({ inputLabel: tc.inputLabel, expected: tc.expected, actual: `エラー: ${runErr.message}`, pass: false, error: true });
      }
    });
  }

  // console.log を元の状態に復元
  console.log = originalLog;

  // 標準出力デバッグログの描画
  if (capturedLogs.length > 0) {
    stdoutTerminal.textContent = capturedLogs.join("\n");
    stdoutContainer.classList.remove("hidden");
  } else {
    stdoutContainer.classList.add("hidden");
  }

  lastTestResults = results;
  renderTestResults(results, allPass);
}

// ============================================================
// 14. RESULTS RENDERING
// ============================================================
function renderTestResults(results, allPass) {
  resultBadge.textContent = allPass ? "合格" : "不合格";
  resultBadge.className   = `text-xs font-bold px-3 py-1 rounded-full ${allPass ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`;

  testCasesResults.innerHTML = results.map(res => `
    <div class="border rounded-lg p-3 text-sm ${res.pass ? "bg-emerald-50/40 border-emerald-100" : "bg-rose-50/40 border-rose-100"}">
      <div class="flex justify-between items-center mb-2">
        <span class="font-mono font-bold text-slate-700 truncate">${escapeHtml(res.inputLabel)}</span>
        <span class="text-xs font-bold px-2 py-0.5 rounded shrink-0 ${res.pass ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}">${res.pass ? "PASS" : "FAIL"}</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-white p-2.5 rounded border border-slate-100 shadow-inner">
        <div>
          <span class="text-slate-400 block mb-0.5">期待値 (Expected):</span>
          <span class="text-slate-800 font-medium">${escapeHtml(formatValue(res.expected))}</span>
        </div>
        <div>
          <span class="text-slate-400 block mb-0.5">実際の戻り値 (Actual):</span>
          <span class="${res.pass ? "text-slate-800" : "text-rose-600"} font-medium">${escapeHtml(formatValue(res.actual))}</span>
        </div>
      </div>
    </div>
  `).join("");

  resultContainer.classList.remove("hidden");
  resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ============================================================
// 15. UTILITIES
// ============================================================
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatValue(val) {
  if (val === null)      return "null";
  if (val === undefined) return "undefined";
  if (typeof val === "string") return `"${val}"`;
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

// ============================================================
// BOOT
// ============================================================
window.onload = init;
