// JavaScript Coding Challenge Data Module
const challenges = [
  {
    id: "sum",
    title: "1. 2つの数値の足し算",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `2つの引数 \`a\` と \`b\` を受け取り、その合計を返す関数 \`sum\` を作成してください。

【引数】
- \`a\` (Number): 1つ目の数値
- \`b\` (Number): 2つ目の数値

【戻り値】
- Number: 2つの数値の合計

【解答例の構成】
\`\`\`javascript
function sum(a, b) {
  // ここにコードを記述してください
}
\`\`\`
`,
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
    description: `数値の配列 \`arr\` を受け取り、その配列内の最大値を返す関数 \`findMax\` を作成してください。
配列が空の場合は \`null\` を返してください。

【引数】
- \`arr\` (Array of Numbers): 数値の配列

【戻り値】
- Number または null: 配列内の最大値、または null

【解答例の構成】
\`\`\`javascript
function findMax(arr) {
  // ここにコードを記述してください
}
\`\`\`
`,
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
    description: `与えられた文字列 \`str\` を反転させた新しい文字列を返す関数 \`reverseString\` を作成してください。

【引数】
- \`str\` (String): 元の文字列

【戻り値】
- String: 反転した文字列

【解答例の構成】
\`\`\`javascript
function reverseString(str) {
  // ここにコードを記述してください
}
\`\`\`
`,
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

let currentChallengeIndex = 0;

// DOM Elements
const challengeListContainer = document.getElementById("challenge-list");
const challengeTitle = document.getElementById("challenge-title");
const challengeDifficulty = document.getElementById("challenge-difficulty");
const challengeDescription = document.getElementById("challenge-description");

const codeEditor = document.getElementById("code-editor");
const lineNumbersContainer = document.getElementById("line-numbers-container");
const editorBackdrop = document.getElementById("editor-backdrop");

const formatBtn = document.getElementById("format-btn");
const resetBtn = document.getElementById("reset-btn");
const runBtn = document.getElementById("run-btn");

const resultContainer = document.getElementById("result-container");
const resultBadge = document.getElementById("result-badge");
const testCasesResults = document.getElementById("test-cases-results");

// Initialize Application
function init() {
  renderChallengeList();
  selectChallenge(0);
  setupEditorListeners();
}

// Render problem selection list
function renderChallengeList() {
  challengeListContainer.innerHTML = challenges
    .map(
      (ch, idx) => `
    <button
      class="challenge-item-btn text-left w-full px-4 py-3 rounded-lg border text-sm font-semibold transition-all flex justify-between items-center gap-2 ${
        idx === currentChallengeIndex
          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
      }"
      data-index="${idx}"
    >
      <span>${ch.title}</span>
      <span class="text-xs px-2 py-0.5 rounded-full ${
        idx === currentChallengeIndex ? "bg-slate-800 text-slate-300" : ch.difficultyColor
      }">${ch.difficulty}</span>
    </button>
  `
    )
    .join("");

  // Add click handlers
  document.querySelectorAll(".challenge-item-btn").forEach((btn) => {
    btn.onclick = (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"));
      selectChallenge(idx);
    };
  });
}

// Select a challenge
function selectChallenge(index) {
  currentChallengeIndex = index;
  const ch = challenges[index];

  // Update selection style
  renderChallengeList();

  // Render text
  challengeTitle.textContent = ch.title.split(". ")[1]; // remove numbering for header
  challengeDifficulty.innerHTML = `<span class="text-xs font-bold px-2.5 py-1 rounded-full ${ch.difficultyColor}">${ch.difficulty}</span>`;
  challengeDescription.textContent = ch.description;

  // Load template code
  const savedCode = localStorage.getItem(`js_challenge_${ch.id}`);
  codeEditor.value = savedCode !== null ? savedCode : ch.template;

  // Reset test results panel
  resultContainer.classList.add("hidden");

  // Sync decorator
  updateEditorDecorations();
}

// Sync decorations (line numbers and indent guides)
function updateEditorDecorations() {
  if (!codeEditor || !lineNumbersContainer || !editorBackdrop) return;

  const text = codeEditor.value;
  const lines = text.split("\n");

  // 1. Line numbers
  const lineCount = lines.length;
  let lineNumbersHtml = "";
  for (let i = 1; i <= lineCount; i++) {
    lineNumbersHtml += `<div class="editor-line">${i}</div>`;
  }
  lineNumbersContainer.innerHTML = lineNumbersHtml;

  // 2. Indentation guides
  let backdropHtml = "";
  lines.forEach((line) => {
    const cleanLine = line.replace(/\t/g, "    ");
    const leadingSpacesMatch = cleanLine.match(/^( +)/);
    const leadingSpacesCount = leadingSpacesMatch ? leadingSpacesMatch[1].length : 0;
    const guideCount = Math.floor(leadingSpacesCount / 4);
    const extraSpacesCount = leadingSpacesCount % 4;

    let lineMarkup = "";
    // Indent guides
    for (let i = 0; i < guideCount; i++) {
      lineMarkup += `<span class="indent-guide">    </span>`;
    }
    // Remaining extra spaces
    if (extraSpacesCount > 0) {
      lineMarkup += " ".repeat(extraSpacesCount);
    }

    // Escape code text
    const remainingText = cleanLine.slice(leadingSpacesCount);
    lineMarkup += escapeHtml(remainingText);

    backdropHtml += `<div class="editor-line">${lineMarkup}</div>`;
  });
  editorBackdrop.innerHTML = backdropHtml;

  // Sync scroll
  editorBackdrop.scrollTop = codeEditor.scrollTop;
  editorBackdrop.scrollLeft = codeEditor.scrollLeft;
  lineNumbersContainer.scrollTop = codeEditor.scrollTop;
}

// Helpers
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setupEditorListeners() {
  // Sync scroll
  codeEditor.addEventListener("scroll", () => {
    editorBackdrop.scrollTop = codeEditor.scrollTop;
    editorBackdrop.scrollLeft = codeEditor.scrollLeft;
    lineNumbersContainer.scrollTop = codeEditor.scrollTop;
  });

  // Sync input changes
  codeEditor.addEventListener("input", () => {
    const ch = challenges[currentChallengeIndex];
    localStorage.setItem(`js_challenge_${ch.id}`, codeEditor.value);
    updateEditorDecorations();
  });

  // Editor keyboard events
  codeEditor.addEventListener("keydown", function (e) {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const value = this.value;

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift + Tab: Unindent 4 spaces
        const before = value.substring(0, start);
        const after = value.substring(end);
        const lineStart = before.lastIndexOf("\n") + 1;
        const line = value.substring(lineStart, start);

        if (line.startsWith("    ")) {
          this.value = before.substring(0, lineStart) + line.substring(4) + after;
          this.selectionStart = this.selectionEnd = start - 4;
        }
      } else {
        // Tab: Indent 4 spaces
        this.value = value.substring(0, start) + "    " + value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
      }
      localStorage.setItem(`js_challenge_${challenges[currentChallengeIndex].id}`, this.value);
      updateEditorDecorations();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const beforeCursor = value.substring(0, start);
      const afterCursor = value.substring(end);
      const lastNewline = beforeCursor.lastIndexOf("\n");
      const currentLine = beforeCursor.substring(lastNewline + 1);

      // Auto indent calculation
      const match = currentLine.match(/^( +)/);
      let indent = match ? match[1] : "";

      // Add extra indent if line ends with open brace
      if (currentLine.trim().endsWith("{")) {
        indent += "    ";
      }

      this.value = beforeCursor + "\n" + indent + afterCursor;
      this.selectionStart = this.selectionEnd = start + 1 + indent.length;

      localStorage.setItem(`js_challenge_${challenges[currentChallengeIndex].id}`, this.value);
      updateEditorDecorations();
    }
  });

  // Format Button
  formatBtn.onclick = () => {
    const value = codeEditor.value;
    const lines = value.split("\n");
    let indentLevel = 0;
    const formatted = lines
      .map((line) => {
        let trimmed = line.trim();
        if (trimmed.startsWith("}")) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const indent = "    ".repeat(indentLevel);
        const result = indent + trimmed;

        if (trimmed.endsWith("{")) {
          indentLevel++;
        }
        return result;
      })
      .join("\n");

    codeEditor.value = formatted;
    localStorage.setItem(`js_challenge_${challenges[currentChallengeIndex].id}`, formatted);
    updateEditorDecorations();
  };

  // Reset Button
  resetBtn.onclick = () => {
    if (confirm("コードを初期状態にリセットしますか？")) {
      const ch = challenges[currentChallengeIndex];
      codeEditor.value = ch.template;
      localStorage.setItem(`js_challenge_${ch.id}`, ch.template);
      updateEditorDecorations();
    }
  };

  // Run Test Button
  runBtn.onclick = runJavaScriptTests;
}

// Deep Equality check helper
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  
  return false;
}

// dynamic JS evaluation engine
function runJavaScriptTests() {
  const ch = challenges[currentChallengeIndex];
  const userCode = codeEditor.value;
  
  let userFunction;
  let compileError = null;

  try {
    // Dynamically compile user code in a function block
    // We expect the user code to declare the function (e.g. `function sum(a, b)...`)
    // and we return it so we can execute it directly.
    const compiler = new Function(userCode + `\nreturn ${ch.functionName};`);
    userFunction = compiler();
    
    if (typeof userFunction !== "function") {
      throw new Error(`関数 '${ch.functionName}' が定義されていないか、正しくエクスポートされていません。`);
    }
  } catch (err) {
    compileError = err.message;
  }

  // Execute test cases
  const results = [];
  let allPass = true;

  if (compileError) {
    allPass = false;
    // Push a global compile/eval error test case
    results.push({
      inputLabel: "コンパイル・実行エラー",
      expected: "正常実行",
      actual: compileError,
      pass: false,
      error: true
    });
  } else {
    ch.testCases.forEach((tc) => {
      try {
        // We clone the inputs so that user functions modifying objects in place don't break expected values
        const inputsClone = JSON.parse(JSON.stringify(tc.input));
        const actual = userFunction(...inputsClone);
        const pass = deepEqual(actual, tc.expected);
        
        if (!pass) allPass = false;
        
        results.push({
          inputLabel: tc.inputLabel,
          expected: tc.expected,
          actual: actual,
          pass: pass,
          error: false
        });
      } catch (runErr) {
        allPass = false;
        results.push({
          inputLabel: tc.inputLabel,
          expected: tc.expected,
          actual: `エラー: ${runErr.message}`,
          pass: false,
          error: true
        });
      }
    });
  }

  // Display results
  renderTestResults(results, allPass);
}

// Display results in UI
function renderTestResults(results, allPass) {
  // Update badge status
  if (allPass) {
    resultBadge.textContent = "合格";
    resultBadge.className = "text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800";
  } else {
    resultBadge.textContent = "不合格";
    resultBadge.className = "text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800";
  }

  // Draw cases details
  testCasesResults.innerHTML = results
    .map(
      (res) => `
    <div class="border rounded-lg p-3 text-sm transition-all ${
      res.pass ? "bg-emerald-50/40 border-emerald-100" : "bg-rose-50/40 border-rose-100"
    }">
      <div class="flex justify-between items-center mb-2">
        <span class="font-mono font-bold text-slate-700">${escapeHtml(res.inputLabel)}</span>
        <span class="text-xs font-bold px-2 py-0.5 rounded ${
          res.pass ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
        }">
          ${res.pass ? "PASS" : "FAIL"}
        </span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-white p-2.5 rounded border border-slate-100 shadow-inner">
        <div>
          <span class="text-slate-400 block mb-0.5">期待値 (Expected):</span>
          <span class="text-slate-800 font-medium">${formatValue(res.expected)}</span>
        </div>
        <div>
          <span class="text-slate-400 block mb-0.5">実際の戻り値 (Actual):</span>
          <span class="${res.pass ? "text-slate-800" : "text-rose-600"} font-medium">${formatValue(res.actual)}</span>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  resultContainer.classList.remove("hidden");
  resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// JSON format for objects/arrays for printing values nicely
function formatValue(val) {
  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (typeof val === "string") return `"${val}"`;
  if (typeof val === "object" || Array.isArray(val)) {
    return JSON.stringify(val);
  }
  return val.toString();
}

// Start app
window.onload = init;
