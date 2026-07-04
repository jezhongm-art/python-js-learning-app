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
const challengeListContainer = document.getElementById("challenge-list");
const challengeTitle        = document.getElementById("challenge-title");
const challengeDifficulty   = document.getElementById("challenge-difficulty");
const challengeDescription  = document.getElementById("challenge-description");

const codeEditor            = document.getElementById("code-editor");
const lineNumbersContainer  = document.getElementById("line-numbers-container");
const editorBackdrop        = document.getElementById("editor-backdrop");

const formatBtn             = document.getElementById("format-btn");
const resetBtn              = document.getElementById("reset-btn");
const runBtn                = document.getElementById("run-btn");

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
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    hasKey: !!key,
  };
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

  const userPrompt = `難易度: ${meta.label}
テーマ: ${topic}
難易度設計基準: ${diffConstraint}

以下のJSONスキーマで問題を1問生成してください。
testCasesは4件以上、エッジケース（空配列、0、負数、空文字列など）を必ず含めること。
functionNameは英語のキャメルケースで、descriptionはHTMLタグ（<p>,<code>,<ul>,<li>,<h3>）を使用してください。`;

  const schema = {
    type: "OBJECT",
    properties: {
      title:        { type: "STRING", description: "課題のタイトル（日本語）" },
      functionName: { type: "STRING", description: "実装すべき関数名（英語キャメルケース）" },
      description:  { type: "STRING", description: "HTML形式の詳細な問題説明" },
      template:     { type: "STRING", description: "初期コードテンプレート（function定義のみ、passではなくコメント）" },
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

    // Build the new challenge object
    const newId = `ai-${Date.now()}`;
    const newChallenge = {
      id:              newId,
      title:           `[AI] ${parsed.title}`,
      difficulty:      meta.label,
      difficultyColor: meta.color,
      description:     parsed.description,
      template:        parsed.template,
      functionName:    parsed.functionName,
      testCases:       parsed.testCases,
      isAiGenerated:   true,
    };

    // Prepend to challenges and select it
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

  // Build test result summary for context
  let testResultSummary = "テストはまだ実行されていません。";
  if (lastTestResults) {
    const passing = lastTestResults.filter(r => r.pass).length;
    const total   = lastTestResults.length;
    testResultSummary = `テスト結果: ${passing}/${total} 通過\n` +
      lastTestResults.map(r =>
        `- [${r.pass ? "PASS" : "FAIL"}] ${r.inputLabel} → 期待: ${formatValue(r.expected)}, 実際: ${formatValue(r.actual)}${r.error ? " (エラー)" : ""}`
      ).join("\n");
  }

  showAiLoader("💡 AIコーチが分析中...", "あなたのコードと問題を読み込み、アドバイスを準備しています。");

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
    const advice = await callGemini(systemPrompt, userPrompt, false);
    // Safe rendering with marked + DOMPurify
    aiCoachContent.innerHTML = DOMPurify.sanitize(marked.parse(advice));
    aiCoachPanel.classList.remove("hidden");
    aiCoachPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (err) {
    alert(`AIコーチ取得失敗: ${err.message}`);
  } finally {
    hideAiLoader();
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

  aiCoachCloseBtn.onclick = () => {
    aiCoachPanel.classList.add("hidden");
  };
}

// ============================================================
// 9. CHALLENGE LIST RENDERING
// ============================================================
function renderChallengeList() {
  challengeListContainer.innerHTML = challenges
    .map((ch, idx) => `
      <button
        class="challenge-item-btn text-left w-full px-4 py-3 rounded-lg border text-sm font-semibold transition-all flex justify-between items-center gap-2 ${
          idx === currentChallengeIndex
            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
        }"
        data-index="${idx}"
      >
        <span class="truncate flex items-center gap-1.5">
          ${ch.isAiGenerated ? '<span class="text-emerald-400 text-xs">✨</span>' : ""}
          ${escapeHtml(ch.title)}
        </span>
        <span class="text-xs px-2 py-0.5 rounded-full shrink-0 ${
          idx === currentChallengeIndex ? "bg-slate-800 text-slate-300" : ch.difficultyColor
        }">${ch.difficulty}</span>
      </button>
    `)
    .join("");

  document.querySelectorAll(".challenge-item-btn").forEach(btn => {
    btn.onclick = e => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"));
      selectChallenge(idx);
    };
  });
}

// ============================================================
// 10. CHALLENGE SELECTION
// ============================================================
function selectChallenge(index) {
  currentChallengeIndex = index;
  lastTestResults = null;
  const ch = challenges[index];

  renderChallengeList();

  // Strip numbering like "1. " from the displayed title
  const displayTitle = ch.title.replace(/^\d+\.\s*/, "").replace(/^\[AI\]\s*/, "");
  challengeTitle.textContent = displayTitle;
  challengeDifficulty.innerHTML = `<span class="text-xs font-bold px-2.5 py-1 rounded-full ${ch.difficultyColor}">${ch.difficulty}</span>${ch.isAiGenerated ? '<span class="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">AI生成</span>' : ""}`;

  // Render description as HTML (built-in challenges already use HTML tags)
  challengeDescription.innerHTML = DOMPurify.sanitize(ch.description);

  const savedCode = localStorage.getItem(`js_challenge_${ch.id}`);
  codeEditor.value = savedCode !== null ? savedCode : ch.template;

  resultContainer.classList.add("hidden");
  aiCoachPanel.classList.add("hidden");

  updateEditorDecorations();
}

// ============================================================
// 11. EDITOR DECORATIONS (line numbers + indent guides)
// ============================================================
function updateEditorDecorations() {
  if (!codeEditor || !lineNumbersContainer || !editorBackdrop) return;

  const text  = codeEditor.value;
  const lines = text.split("\n");

  // Line numbers
  lineNumbersContainer.innerHTML = lines
    .map((_, i) => `<div class="editor-line">${i + 1}</div>`)
    .join("");

  // Indentation guides
  let backdropHtml = "";
  lines.forEach(line => {
    const clean = line.replace(/\t/g, "    ");
    const leadMatch = clean.match(/^( +)/);
    const leadCount = leadMatch ? leadMatch[1].length : 0;
    const guides    = Math.floor(leadCount / 4);
    const extra     = leadCount % 4;

    let markup = "";
    for (let i = 0; i < guides; i++) markup += `<span class="indent-guide">    </span>`;
    if (extra > 0) markup += " ".repeat(extra);
    markup += escapeHtml(clean.slice(leadCount));

    backdropHtml += `<div class="editor-line">${markup}</div>`;
  });
  editorBackdrop.innerHTML = backdropHtml;

  editorBackdrop.scrollTop       = codeEditor.scrollTop;
  editorBackdrop.scrollLeft      = codeEditor.scrollLeft;
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
