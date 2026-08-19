window.brythonTestResult = null;

// ==========================================
// テーマ切り替え (Dark / Light Mode)
// ==========================================
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

// ==========================================
// カスタムモーダル・確認用ダイアログ
// ==========================================
const appModal = document.getElementById("app-modal");
const appModalTitle = document.getElementById("app-modal-title");
const appModalMessage = document.getElementById("app-modal-message");
const appModalClose = document.getElementById("app-modal-close");
const modalIconContainer = document.getElementById("modal-icon-container");

function notify(message, title = "お知らせ", type = "info") {
  appModalTitle.textContent = title;
  appModalMessage.textContent = message;

  if (type === "error") {
    modalIconContainer.className = "p-2 bg-rose-50 text-rose-600 rounded-lg";
    modalIconContainer.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        `;
    appModalClose.className =
      "bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors";
  } else {
    modalIconContainer.className =
      "p-2 bg-indigo-50 text-indigo-600 rounded-lg";
    modalIconContainer.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
    appModalClose.className =
      "bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors";
  }

  appModal.classList.remove("hidden");
}

appModalClose.onclick = () => {
  appModal.classList.add("hidden");
};

// ESCキーでモーダルを閉じる
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!appModal.classList.contains("hidden"))
      appModal.classList.add("hidden");
    if (!confirmModal.classList.contains("hidden")) {
      confirmModal.classList.add("hidden");
      confirmCallback = null;
    }
  }
});

// ==========================================
// セキュリティユーティリティ
// ==========================================
function escapeHtml(str) {
  if (str == null) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function sanitizeHtml(html) {
  if (typeof DOMPurify !== "undefined") {
    return DOMPurify.sanitize(html);
  }
  return escapeHtml(html);
}

const confirmModal = document.getElementById("confirm-modal");
const confirmModalCancel = document.getElementById("confirm-modal-cancel");
const confirmModalOk = document.getElementById("confirm-modal-ok");
let confirmCallback = null;

function askConfirm(options, callback) {
  let title = "確認";
  let message = "操作を続行しますか？";
  let okText = "実行する";
  let cancelText = "キャンセル";
  let type = "info"; // 'info' | 'warning' | 'danger'
  let cb = callback;

  if (typeof options === "function") {
    cb = options;
  } else if (typeof options === "object" && options !== null) {
    title = options.title || title;
    message = options.message || message;
    okText = options.okText || okText;
    cancelText = options.cancelText || cancelText;
    type = options.type || type;
  }

  const titleEl = document.getElementById("confirm-modal-title");
  const msgEl = document.getElementById("confirm-modal-message");
  const okBtn = document.getElementById("confirm-modal-ok");
  const cancelBtn = document.getElementById("confirm-modal-cancel");
  const iconBox = document.getElementById("confirm-modal-icon-box");

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.innerHTML = message;
  if (okBtn) {
    okBtn.textContent = okText;
    if (type === "warning" || type === "danger") {
      okBtn.className = "bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm";
    } else {
      okBtn.className = "bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm";
    }
  }
  if (cancelBtn) cancelBtn.textContent = cancelText;

  if (iconBox) {
    if (type === "warning" || type === "danger") {
      iconBox.className = "p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg shrink-0";
    } else {
      iconBox.className = "p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0";
    }
  }

  confirmCallback = cb;
  if (confirmModal) confirmModal.classList.remove("hidden");
}

if (confirmModalCancel) {
  confirmModalCancel.onclick = () => {
    if (confirmModal) confirmModal.classList.add("hidden");
    confirmCallback = null;
  };
}

if (confirmModalOk) {
  confirmModalOk.onclick = () => {
    if (confirmModal) confirmModal.classList.add("hidden");
    if (confirmCallback) confirmCallback();
    confirmCallback = null;
  };
}

// ==========================================
// APIキー管理ロジック (localStorage連携)
// ==========================================
const apiKeyToggleBtn = document.getElementById("api-key-toggle-btn");
const apiKeyPanel = document.getElementById("api-key-panel");
const apiKeyInput = document.getElementById("api-key-input");
const apiKeySaveBtn = document.getElementById("api-key-save-btn");
const apiKeyClearBtn = document.getElementById("api-key-clear-btn");
const apiKeyStatus = document.getElementById("api-key-status");

apiKeyToggleBtn.onclick = () => {
  apiKeyPanel.classList.toggle("hidden");
};

function updateKeyStatus() {
  const savedKey = localStorage.getItem("gemini_api_key");
  if (savedKey) {
    apiKeyInput.value = savedKey;
    apiKeyStatus.className =
      "text-xs flex items-center gap-1 text-emerald-600 font-semibold";
    apiKeyStatus.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          APIキーが保存されています (Gemini 3.7 Flash で稼働中)
        `;
    apiKeyStatus.classList.remove("hidden");
  } else {
    apiKeyInput.value = "";
    apiKeyStatus.className =
      "text-xs flex items-center gap-1 text-amber-600 font-semibold";
    apiKeyStatus.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          キー未設定 (ローカルでAI機能を使用するには設定が必要です)
        `;
    apiKeyStatus.classList.remove("hidden");
  }
}

apiKeySaveBtn.onclick = () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    notify("有効なAPIキーを入力してください。", "入力エラー", "info");
    return;
  }
  localStorage.setItem("gemini_api_key", key);
  updateKeyStatus();
  notify(
    "APIキーを保存しました！ローカルでAI問題生成が利用できます。",
    "保存成功",
    "info",
  );
  apiKeyPanel.classList.add("hidden");
};

apiKeyClearBtn.onclick = () => {
  localStorage.removeItem("gemini_api_key");
  updateKeyStatus();
  notify(
    "APIキーを削除しました。AI機能の実行が停止します。",
    "クリア完了",
    "info",
  );
};

updateKeyStatus();

// ==========================================
// 進捗 & バッジ管理ロジック (localStorage)
// ==========================================
const PROGRESS_KEY = "python_learning_progress_v2_ultimate";

let learningProgress = {
  totalQuizzesAnswered: 0,
  highestQuizScore: 0,
  completedProblems: [], // タイトルリスト
  aiChallengesCleared: 0,
};

function loadProgress() {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    try {
      learningProgress = { ...learningProgress, ...JSON.parse(saved) };
    } catch (e) {
      console.error("進捗データのパースエラー:", e);
    }
  }
  updateDashboardUI();
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(learningProgress));
  updateDashboardUI();
}

function updateDashboardUI() {
  // 各種ステータスの表示更新
  document.getElementById("stat-quizzes").textContent =
    learningProgress.totalQuizzesAnswered;
  document.getElementById("stat-coding").textContent =
    learningProgress.completedProblems.length;
  document.getElementById("stat-ai-gen").textContent =
    learningProgress.aiChallengesCleared;

  // 条件に基づく称号・バッジ決定
  let rank = "Pythonビギナー";
  let badges = [];

  if (learningProgress.totalQuizzesAnswered > 0) {
    rank = "クイズ挑戦者";
  }
  if (learningProgress.highestQuizScore >= 5) {
    badges.push("爆速クイズ王");
  }
  if (learningProgress.completedProblems.length > 0) {
    rank = "駆け出しプログラマー";
  }
  if (learningProgress.aiChallengesCleared > 0) {
    badges.push("AIチャレンジャー");
  }
  if (learningProgress.completedProblems.length >= 10) {
    rank = "アルゴリズムマスター";
    badges.push("Pythonicエキスパート");
  }

  const badgeString =
    badges.length > 0 ? ` [バッジ: ${badges.join(", ")}]` : "";
  document.getElementById("dashboard-rank").textContent =
    `${rank}${badgeString}`;
}

// 起動時にロード
loadProgress();

// ==========================================
// 配列のシャッフル関数
// ==========================================
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==========================================
// 4択クイズ用データ
// ==========================================
const rawQuizQuestions = [
  {
    question:
      "Pythonで変数名として使用できない（構文エラーになる）命名はどれか？",
    options: ["2nd_value", "_value", "value2", "value_name"],
    correctAnswer: "2nd_value",
  },
  {
    question: "Pythonでべき乗（累乗）の計算を行うための演算子はどれか？",
    options: ["**", "^", "^^", "pow"],
    correctAnswer: "**",
  },
  {
    question: "Pythonで標準出力に文字列を表示する関数はどれか？",
    options: ["print()", "echo()", "log()", "output()"],
    correctAnswer: "print()",
  },
  {
    question: "次のうち、Pythonの整数型を表すキーワードはどれか？",
    options: ["int", "float", "str", "bool"],
    correctAnswer: "int",
  },
  {
    question: "Pythonで文字列を整数に変換する関数はどれか？",
    options: ["int()", "str()", "float()", "bool()"],
    correctAnswer: "int()",
  },
  {
    question:
      "Pythonのif文において、条件が偽（False）の場合にさらに別の条件を検査するためのキーワードはどれか？",
    options: ["elif", "else if", "elseif", "elsif"],
    correctAnswer: "elif",
  },
  {
    question: "組み込み関数 range(5) が生成する整数の範囲はどれか？",
    options: [
      "0 から 4 まで",
      "0 から 5 まで",
      "1 から 5 まで",
      "1 から 4 まで",
    ],
    correctAnswer: "0 から 4 まで",
  },
  {
    question:
      "ループ処理の途中で、それ以降の処理をスキップして次の繰り返し（イテレーション）に進めるためのキーワードはどれか？",
    options: ["continue", "break", "pass", "skip"],
    correctAnswer: "continue",
  },
  {
    question: "Pythonのリストの末尾に要素を追加するメソッドはどれか？",
    options: ["append()", "add()", "insert()", "push()"],
    correctAnswer: "append()",
  },
  {
    question:
      "Pythonでリストの要素をインプレースでソートするメソッドはどれか？",
    options: ["list.sort()", "list.order()", "list.sorted()", "list.arrange()"],
    correctAnswer: "list.sort()",
  },
  {
    question:
      "Pythonで辞書（dictionary）のキーと値のペアを追加または更新するメソッドはどれか？",
    options: ["dict.update()", "dict.add()", "dict.insert()", "dict.append()"],
    correctAnswer: "dict.update()",
  },
  {
    question:
      "Pythonのリストから重複を取り除いて一意の値にするために最も適したデータ構造はどれか？",
    options: ["set", "tuple", "dict", "frozenset"],
    correctAnswer: "set",
  },
  {
    question: "Pythonで関数を定義するキーワードはどれか？",
    options: ["def", "function", "func", "define"],
    correctAnswer: "def",
  },
  {
    question: "Pythonで他のモジュールをインポートするキーワードはどれか？",
    options: ["import", "include", "require", "using"],
    correctAnswer: "import",
  },
  {
    question:
      "Pythonでファイルを読み込みモードで開く際のモード指定文字はどれか？",
    options: ["r", "w", "a", "x"],
    correctAnswer: "r",
  },
  {
    question: "Pythonで例外をキャッチして処理を行うための構文はどれか？",
    options: ["try-except", "try-catch", "catch", "exception"],
    correctAnswer: "try-except",
  },
  {
    question: "Pythonでクラスを定義するキーワードはどれか？",
    options: ["class", "def", "struct", "object"],
    correctAnswer: "class",
  },
  {
    question:
      "Pythonのクラスにおいて、インスタンス作成時に自動的に呼び出される初期化メソッドの名前はどれか？",
    options: ["__init__", "__new__", "constructor", "initialize"],
    correctAnswer: "__init__",
  },
  {
    question:
      "リスト内包表記 [x * 2 for x in range(3)] の結果として正しいリストはどれか？",
    options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "[0, 2, 4, 6]"],
    correctAnswer: "[0, 2, 4]",
  },
  {
    question:
      "辞書やリストなどのオブジェクトの要素数を取得するための組み込み関数はどれか？",
    options: ["len()", "size()", "count()", "length()"],
    correctAnswer: "len()",
  },
  {
    question: "Pythonで論理否定（NOT）を表す演算子はどれか？",
    options: ["not", "!", "~", "None"],
    correctAnswer: "not",
  },
  {
    question: "Pythonで文字列を浮動小数点数に変換する関数はどれか？",
    options: ["float()", "int()", "str()", "parse()"],
    correctAnswer: "float()",
  },
  {
    question:
      "Pythonでループの現在のインデックスを取得するために、組み込み関数 range() と一緒に使う関数はどれか？",
    options: ["enumerate()", "index()", "range()", "zip()"],
    correctAnswer: "enumerate()",
  },
  {
    question: "Pythonでリストの先頭に要素を追加するメソッドはどれか？",
    options: [
      "insert(0, element)",
      "prepend(element)",
      "add_first(element)",
      "push_front(element)",
    ],
    correctAnswer: "insert(0, element)",
  },
  {
    question: "Pythonでリストを逆順にするメソッドはどれか？",
    options: ["reverse()", "reversed()", "sort(reverse=True)", "flip()"],
    correctAnswer: "reverse()",
  },
  {
    question: "Pythonで辞書のすべてのキーを取得するメソッドはどれか？",
    options: ["keys()", "get_keys()", "items()", "values()"],
    correctAnswer: "keys()",
  },
  {
    question: "Pythonで辞書のすべての値を取得するメソッドはどれか？",
    options: ["values()", "get_values()", "items()", "keys()"],
    correctAnswer: "values()",
  },
  {
    question: "Pythonで辞書のキーと値のペアを取得するメソッドはどれか？",
    options: ["items()", "pairs()", "entries()", "get_items()"],
    correctAnswer: "items()",
  },
  {
    question: "Pythonでリストの最後の要素を削除して返すメソッドはどれか？",
    options: ["pop()", "remove_last()", "delete_last()", "pop_last()"],
    correctAnswer: "pop()",
  },
  {
    question: "Pythonでリストから特定の要素を削除するメソッドはどれか？",
    options: ["remove()", "delete()", "pop()", "discard()"],
    correctAnswer: "remove()",
  },
  {
    question: "Pythonでリストの特定の位置の要素を削除するメソッドはどれか？",
    options: ["pop(index)", "remove(index)", "delete(index)", "discard(index)"],
    correctAnswer: "pop(index)",
  },
  {
    question: "Pythonでリストの要素を昇順にソートするメソッドはどれか？",
    options: ["sort()", "sorted()", "order()", "arrange()"],
    correctAnswer: "sort()",
  },
  {
    question: "Pythonでリストの要素を降順にソートするメソッドはどれか？",
    options: [
      "sort(reverse=True)",
      "sorted(reverse=True)",
      "reverse_sort()",
      "descending()",
    ],
    correctAnswer: "sort(reverse=True)",
  },
  {
    question:
      "Pythonでリストの要素をソートした新しいリストを返す関数はどれか？",
    options: ["sorted()", "sort()", "order()", "arrange()"],
    correctAnswer: "sorted()",
  },
  {
    question: "Python'でリストの要素をコピーするメソッドはどれか？",
    options: ["copy()", "clone()", "dup()", "replicate()"],
    correctAnswer: "copy()",
  },
  {
    question: "Pythonでリストの要素をすべて削除するメソッドはどれか？",
    options: ["clear()", "empty()", "remove_all()", "delete_all()"],
    correctAnswer: "clear()",
  },
  {
    question: "Pythonでリストの要素を拡張するメソッドはどれか？",
    options: ["extend()", "append()", "add()", "push()"],
    correctAnswer: "extend()",
  },
  {
    question: "Pythonでリストの要素をカウントするメソッドはどれか？",
    options: ["count()", "len()", "size()", "length()"],
    correctAnswer: "count()",
  },
  {
    question: "Pythonでリストの要素のインデックスを取得するメソッドはどれか？",
    options: ["index()", "find()", "search()", "locate()"],
    correctAnswer: "index()",
  },
  {
    question: "Pythonでリストの要素をスライスするための構文はどれか？",
    options: [
      "list[start:stop]",
      "list.slice(start, stop)",
      "list.sub(start, stop)",
      "list.range(start, stop)",
    ],
    correctAnswer: "list[start:stop]",
  },
  {
    question:
      "Pythonでリストの要素をスライスしてステップを指定する構文はどれか？",
    options: [
      "list[start:stop:step]",
      "list.slice(start, stop, step)",
      "list.sub(start, stop, step)",
      "list.range(start, stop, step)",
    ],
    correctAnswer: "list[start:stop:step]",
  },
  {
    question: "Pythonでリストの要素をスライスして逆順にする構文はどれか？",
    options: ["list[::-1]", "list.reverse()", "list.reversed()", "list.flip()"],
    correctAnswer: "list[::-1]",
  },
  {
    question:
      "Pythonでリストの要素をスライスして最初の要素を取得する構文はどれか？",
    options: ["list[0]", "list.first()", "list.head()", "list[1]"],
    correctAnswer: "list[0]",
  },
  {
    question:
      "Pythonでリストの要素をスライスして最後の要素を取得する構文はどれか？",
    options: ["list[-1]", "list.last()", "list.tail()", "list[len(list)-1]"],
    correctAnswer: "list[-1]",
  },
  {
    question:
      "Pythonでリストの要素をスライスして最後の要素を除いたすべての要素を取得する構文はどれか？",
    options: [
      "list[:-1]",
      "list[0:-1]",
      "list[0:len(list)-1]",
      "list[0:len(list)-1]",
    ],
    correctAnswer: "list[:-1]",
  },
  {
    question:
      "Pythonでリストの要素をスライスして最初の要素を除いたすべての要素を取得する構文はどれか？",
    options: [
      "list[1:]",
      "list[1:len(list)]",
      "list[1:len(list)]",
      "list[1:len(list)]",
    ],
    correctAnswer: "list[1:]",
  },
  {
    question:
      "Pythonでリストの要素をスライスして最初の2つの要素を取得する構文はどれか？",
    options: ["list[:2]", "list[0:2]", "list[0:2]", "list[0:2]"],
    correctAnswer: "list[:2]",
  },
  {
    question:
      "Pythonでリストの要素をスライスして最後の2つの要素を取得する構文はどれか？",
    options: [
      "list[-2:]",
      "list[len(list)-2:len(list)]",
      "list[len(list)-2:len(list)]",
      "list[len(list)-2:len(list)]",
    ],
    correctAnswer: "list[-2:]",
  },
  {
    question: "Pythonでタプル（tuple）を定義するための記号はどれか？",
    options: ["()", "[]", "{}", "<>"],
    correctAnswer: "()",
  },
  {
    question:
      "関数に任意の数のキーワード引数を渡す際に使用される構文はどれか？",
    options: ["**kwargs", "*args", "&&kwargs", "$args"],
    correctAnswer: "**kwargs",
  },
  {
    question:
      "ファイル操作などで、処理終了時に自動でリソースを解放するための構文はどれか？",
    options: ["with", "using", "auto", "finally_auto"],
    correctAnswer: "with",
  },
  {
    question: "Pythonのラムダ（無名関数）を定義するキーワードはどれか？",
    options: ["lambda", "def", "anon", "function"],
    correctAnswer: "lambda",
  },
  {
    question:
      "次のうち、Pythonの組み込みデータ型として存在しないものはどれか？",
    options: ["char", "int", "float", "complex"],
    correctAnswer: "char",
  },
  {
    question:
      "Pythonのリスト内包表記で、条件式が真の場合のみ要素を追加する構文はどれか？",
    options: [
      "[x for x in iterable if x > 3]",
      "[x if x > 3 else 0 for x in iterable]",
      "[x for x in iterable if x > 3 else 0]",
      "[x if x > 3 for x in iterable]",
    ],
    correctAnswer: "[x for x in iterable if x > 3]",
  },
  {
    question:
      "Pythonの辞書（dict）で、キーが存在しない場合にデフォルト値を返すメソッドはどれか？",
    options: ["get()", "set()", "find()", "default()"],
    correctAnswer: "get()",
  },
  {
    question:
      "次のうち、Pythonのイテレータプロトコルを実装するために必要なメソッドを2つ含むものはどれか？",
    options: [
      "__iter__()と__next__()",
      "__getitem__()と__setitem__()",
      "__enter__()と__exit__()",
      "__add__()と__sub__()",
    ],
    correctAnswer: "__iter__()と__next__()",
  },
  {
    question:
      "Pythonのクラス定義において、継承元のクラスを指定するために使用する括弧内の要素はどれか？",
    options: ["親クラス名", "()", "[]", "self"],
    correctAnswer: "親クラス名",
  },
  {
    question:
      "Pythonのジェネレータ式で、値を一つずつ生成するために使用するキーワードはどれか？",
    options: ["yield", "return", "generate", "create"],
    correctAnswer: "yield",
  },
  {
    question:
      "Pythonのクラスメソッドを定義する際に使用するデコレータはどれか？",
    options: ["@classmethod", "@staticmethod", "@abstractmethod", "@property"],
    correctAnswer: "@classmethod",
  },
  {
    question: "次のうち、Pythonの組み込み関数として存在しないものはどれか？",
    options: ["list()", "tuple()", "dict()", "array()"],
    correctAnswer: "array()",
  },
  {
    question:
      "Pythonでリストの要素をランダムにシャッフルするために使用する関数はどれか？",
    options: [
      "random.shuffle()",
      "random.choice()",
      "random.sample()",
      "random.random()",
    ],
    correctAnswer: "random.shuffle()",
  },
  {
    question:
      "次のうち、Pythonの特殊メソッド（マジックメソッド）として正しい形式はどれか？",
    options: ["__init__()", "__start__()", "__display__()", "__delete__()"],
    correctAnswer: "__init__()",
  },
  {
    question:
      "Pythonで辞書のキーのリストを取得するために使用するメソッドはどれか？",
    options: ["keys()", "values()", "items()", "get()"],
    correctAnswer: "keys()",
  },
  {
    question:
      "次のうち、Pythonの標準ライブラリとして提供されていないものはどれか？",
    options: ["os", "sys", "numpy", "random"],
    correctAnswer: "numpy",
  },
  {
    question:
      "Pythonでリストの要素の合計値を計算するために使用する関数はどれか？",
    options: ["sum()", "total()", "aggregate()", "collect()"],
    correctAnswer: "sum()",
  },
  {
    question: "次のうち、Pythonの組み込み関数として存在しないものはどれか？",
    options: ["size()", "len()", "count()", "max()"],
    correctAnswer: "size()",
  },
  {
    question:
      "Pythonで辞書のキーと値をループ処理する際に使用するメソッドはどれか？",
    options: ["items()", "keys()", "values()", "entries()"],
    correctAnswer: "items()",
  },
  {
    question:
      "Pythonのリストから特定の値を持つ要素を削除するために使用するメソッドはどれか？",
    options: ["remove()", "delete()", "erase()", "strip()"],
    correctAnswer: "remove()",
  },
  {
    question: "次のうち、Pythonの文字列メソッドとして存在しないものはどれか？",
    options: ["toupper()", "upper()", "capitalize()", "title()"],
    correctAnswer: "toupper()",
  },
  {
    question: "Pythonでタプルの要素数を取得するために使用する関数はどれか？",
    options: ["len()", "count()", "size()", "length()"],
    correctAnswer: "len()",
  },
  {
    question: "次のうち、Pythonのファイルモードとして存在しないものはどれか？",
    options: ["read", "write", "append", "execute"],
    correctAnswer: "execute",
  },
  {
    question:
      "Pythonで辞書を逆順にループ処理するために使用できるメソッドはどれか？",
    options: [
      "reversed(my_dict.keys())",
      "my_dict.reversed()",
      "my_dict.reverse_keys()",
      "my_dict[::-1]",
    ],
    correctAnswer: "reversed(my_dict.keys())",
  },
  {
    question:
      "Pythonのリスト内包表記で、複数の条件をANDで結合するために使用するキーワードはどれか？",
    options: ["and", "&&", "&", "if"],
    correctAnswer: "and",
  },
  {
    question:
      "次のうち、Pythonの組み込みデータ型として存在しないものはどれか？",
    options: ["set", "tuple", "dictionary", "array"],
    correctAnswer: "array",
  },
  {
    question:
      "Pythonでリストの全要素に対して同じ操作を行うための関数はどれか？",
    options: ["map()", "filter()", "reduce()", "apply()"],
    correctAnswer: "map()",
  },
  {
    question:
      "次のうち、Pythonでオブジェクトの型を確認するために使用する関数はどれか？",
    options: ["type()", "typeof()", "kind()", "identify()"],
    correctAnswer: "type()",
  },
  {
    question: "Pythonでリストを逆順にするメソッドはどれか？",
    options: ["reverse()", "reversed()", "sort_reverse()", "invert()"],
    correctAnswer: "reverse()",
  },
  {
    question:
      "次のうち、Pythonでリストの要素を降順にソートするために使用する関数はどれか？",
    options: [
      "sort(reverse=True)",
      "sort()",
      "sorted(reverse=True)",
      "sorted()",
    ],
    correctAnswer: "sort(reverse=True)",
  },
  {
    question:
      "Pythonの辞書で、キーが存在しない場合にKeyErrorを発生させずにデフォルト値を返すメソッドはどれか？",
    options: ["get(key, default)", "get(key)", "get_or_default(key)", "[]"],
    correctAnswer: "get(key, default)",
  },
  {
    question:
      "Pythonでラムダ式を使用してリストの要素を2倍にするにはどう書くか？",
    options: [
      "list(map(lambda x: x * 2, my_list))",
      "map(lambda x: x * 2, my_list)",
      "list(map(2 * x for x in my_list))",
      "list(map(x + 2 for x in my_list))",
    ],
    correctAnswer: "list(map(lambda x: x * 2, my_list))",
  },
  {
    question:
      "次のうち、Pythonでリストの要素をユニークに（重複を削除して）取得する方法として正しいものはどれか？",
    options: [
      "list(set(my_list))",
      "set(my_list)",
      "unique(my_list)",
      "list(dict.fromkeys(my_list))",
    ],
    correctAnswer: "list(set(my_list))",
  },
  {
    question:
      "Pythonで複数のリストをタプルのリストに変換するにはどの関数を使用するか？",
    options: ["zip()", "zip_longest()", "map()", "cartesian_product()"],
    correctAnswer: "zip()",
  },
  {
    question:
      "次のうち、Pythonでオブジェクトが特定の属性を持っているかを確認するために使用する関数はどれか？",
    options: ["hasattr()", "has_attribute()", "has_attr()", "checkattr()"],
    correctAnswer: "hasattr()",
  },
  {
    question:
      "Pythonのリスト内包表記で、条件式が偽の場合のみ要素を追加するにはどう書くか？",
    options: [
      "[x for x in iterable if not x > 3]",
      "[x if x > 3 else 0 for x in iterable]",
      "[x for x in iterable if x <= 3]",
      "[x for x in iterable if x < 3]",
    ],
    correctAnswer: "[x for x in iterable if not x > 3]",
  },
  {
    question:
      "次のうち、Pythonの標準ライブラリとして提供されているモジュールとして正しいものはどれか？",
    options: ["math", "numpy", "requests", "pandas"],
    correctAnswer: "math",
  },
  {
    question:
      "Pythonでリストの要素を逆順にしたイテレータを取得するにはどの関数を使用するか？",
    options: ["reversed()", "reverse()", "[::-1]", "sorted(reverse=True)"],
    correctAnswer: "reversed()",
  },
  {
    question:
      "次のうち、Pythonでリストの要素のインデックスと値の両方をループ処理するために使用する関数はどれか？",
    options: ["enumerate()", "zip()", "indexed()", "items()"],
    correctAnswer: "enumerate()",
  },
  {
    question:
      "Pythonのリストで、指定した値が出現する回数を数えるにはどのメソッドを使用するか？",
    options: ["count()", "index()", "find()", "includes()"],
    correctAnswer: "count()",
  },
  {
    question:
      "次のうち、Pythonでリストを逆順にする処理として正しいものはどれか？",
    options: [
      "my_list[::-1]",
      "my_list.reverse()",
      "reversed(my_list)",
      "list(reversed(my_list))",
    ],
    correctAnswer: "my_list[::-1]",
  },
  {
    question:
      "Pythonの辞書で、指定した値を持つキーを削除するにはどのメソッドを使用するか？",
    options: ["pop(key)", "remove(key)", "delete(key)", "del()"],
    correctAnswer: "del()",
  },
  {
    question: "次のうち、Pythonの文字列メソッドとして正しいものはどれか？",
    options: ["isalpha()", "isdigit()", "isnumeric()", "isdecimal()"],
    correctAnswer: "isalpha()",
  },
  {
    question:
      "Pythonでリストの要素を昇順にソートするにはどの関数を使用するか？",
    options: [
      "sorted(my_list)",
      "list.sort()",
      "sort(my_list)",
      "order(my_list)",
    ],
    correctAnswer: "sorted(my_list)",
  },
  {
    question: "Pythonでタプルの最初の要素を取得するにはどう書くか？",
    options: [
      "my_tuple[0]",
      "my_tuple.first()",
      "my_tuple.get(0)",
      "my_tuple(0)",
    ],
    correctAnswer: "my_tuple[0]",
  },
  {
    question: "Pythonのタプルはミュータブル（変更可能）か？",
    options: ["はい", "いいえ"],
    correctAnswer: "いいえ",
  },
  {
    question: "Pythonで複数のタプルを連結するにはどの演算子を使用するか？",
    options: ["+", "*", "&", ":"],
    correctAnswer: "+",
  },
  {
    question: "次のうち、Pythonの組み込み関数として存在しないものはどれか？",
    options: ["tuple()", "list()", "dict()", "set()"],
    correctAnswer: "dict()",
  },
  {
    question: "Pythonでタプルの要素数を取得するにはどの関数を使用するか？",
    options: [
      "len(my_tuple)",
      "my_tuple.length()",
      "my_tuple.size()",
      "count(my_tuple)",
    ],
    correctAnswer: "len(my_tuple)",
  },
  {
    question: "Pythonでタプルをリストに変換するにはどの関数を使用するか？",
    options: [
      "list(my_tuple)",
      "my_tuple.to_list()",
      "my_tuple.convert()",
      "list_from_tuple(my_tuple)",
    ],
    correctAnswer: "list(my_tuple)",
  },
  {
    question:
      "Pythonで辞書のキーのリストを取得するにはどのメソッドを使用するか？",
    options: [
      "my_dict.keys()",
      "my_dict.keyslist()",
      "my_dict.keys()",
      "my_dict.keys()",
    ],
    correctAnswer: "my_dict.keys()",
  },
  {
    question:
      "Pythonの辞書で、キーが存在しない場合に KeyError を発生させる操作はどれか？",
    options: [
      "my_dict['key']",
      "my_dict.get('key')",
      "my_dict.get('key', None)",
      "my_dict.find('key')",
    ],
    correctAnswer: "my_dict['key']",
  },
  {
    question: "Pythonで辞書の値を更新するにはどのメソッドを使用するか？",
    options: [
      "my_dict['key'] = value",
      "my_dict.update('key', value)",
      "my_dict.modify('key', value)",
      "my_dict.set('key', value)",
    ],
    correctAnswer: "my_dict['key'] = value",
  },
  {
    question: "Pythonでリストから最大値を見つけるにはどの関数を使用するか？",
    options: [
      "max(my_list)",
      "largest(my_list)",
      "maximum(my_list)",
      "list_max(my_list)",
    ],
    correctAnswer: "max(my_list)",
  },
  {
    question: "Pythonでリストの要素を降順にソートするにはどう書くか？",
    options: [
      "my_list.sort(reverse=True)",
      "sorted(my_list, reverse=True)",
      "my_list.reverse()",
      "sorted(my_list)",
    ],
    correctAnswer: "my_list.sort(reverse=True)",
  },
  {
    question:
      "次のうち、Pythonでイテラブル（反復可能なオブジェクト）に共通する特徴として正しいものはどれか？",
    options: [
      "forループで反復できる",
      "インデックスでアクセスできる",
      "mutableである",
      "要素を追加できる",
    ],
    correctAnswer: "forループで反復できる",
  },
  {
    question:
      "Pythonでリストの要素をフィルタリングするにはどの関数を使用するか？",
    options: ["filter()", "select()", "exclude()", "filter_list()"],
    correctAnswer: "filter()",
  },
  {
    question:
      "Pythonのジェネレータ式で、値を生成する際に使用するキーワードはどれか？",
    options: ["yield", "generate", "return", "create"],
    correctAnswer: "yield",
  },
  {
    question:
      "Pythonの辞書で、キーと値のペアをタプルのリストとして取得するにはどのメソッドを使用するか？",
    options: ["items()", "keys()", "values()", "pairs()"],
    correctAnswer: "items()",
  },
  {
    question:
      "次のうち、Pythonの組み込みデータ型として存在しないものはどれか？",
    options: ["set", "tuple", "dictionary", "array"],
    correctAnswer: "array",
  },
  {
    question:
      "Pythonでタプルから要素をアンパック（取り出し）するにはどう書くか？",
    options: [
      "a, b, c = my_tuple",
      "a, b, c = *my_tuple",
      "[a, b, c] = my_tuple",
      "a, b, c := my_tuple",
    ],
    correctAnswer: "a, b, c = my_tuple",
  },
  {
    question: "Pythonでリストの要素の平均値を計算するにはどう書くか？",
    options: [
      "sum(my_list) / len(my_list)",
      "avg(my_list)",
      "my_list.average()",
      "mean(my_list)",
    ],
    correctAnswer: "sum(my_list) / len(my_list)",
  },
  {
    question:
      "次のうち、Pythonの標準ライブラリとして提供されているモジュールとして正しいものはどれか？",
    options: ["math", "numpy", "requests", "pandas"],
    correctAnswer: "math",
  },
  {
    question: "Pythonでリストを逆順にする処理として正しいものはどれか？",
    options: [
      "my_list[::-1]",
      "my_list.reverse()",
      "reversed(my_list)",
      "list(reversed(my_list))",
    ],
    correctAnswer: "my_list[::-1]",
  },
  {
    question:
      "Pythonで辞書を逆順にループ処理するために使用できるメソッドはどれか？",
    options: [
      "reversed(my_dict.keys())",
      "my_dict.reversed()",
      "my_dict.reverse_keys()",
      "my_dict[::-1]",
    ],
    correctAnswer: "reversed(my_dict.keys())",
  },
  {
    question:
      "Pythonのリスト内包表記で、複数の条件をANDで結合するために使用するキーワードはどれか？",
    options: ["and", "&&", "&", "if"],
    correctAnswer: "and",
  },
  {
    question:
      "Pythonでリストの要素をユニークに（重複を削除して）取得する方法として正しいものはどれか？",
    options: [
      "list(set(my_list))",
      "set(my_list)",
      "unique(my_list)",
      "list(dict.fromkeys(my_list))",
    ],
    correctAnswer: "list(set(my_list))",
  },
  {
    question:
      "Pythonで複数のリストをタプルのリストに変換するにはどの関数を使用するか？",
    options: ["zip()", "zip_longest()", "map()", "cartesian_product()"],
    correctAnswer: "zip()",
  },
  {
    question:
      "次のうち、Pythonでオブジェクトが特定の属性を持っているかを確認するために使用する関数はどれか？",
    options: ["hasattr()", "has_attribute()", "has_attr()", "checkattr()"],
    correctAnswer: "hasattr()",
  },
  {
    question:
      "Pythonのリスト内包表記で、条件式が偽の場合のみ要素を追加するにはどう書くか？",
    options: [
      "[x for x in iterable if not x > 3]",
      "[x if x > 3 else 0 for x in iterable]",
      "[x for x in iterable if x <= 3]",
      "[x for x in iterable if x < 3]",
    ],
    correctAnswer: "[x for x in iterable if not x > 3]",
  },
  {
    question:
      "Pythonでリストの要素のインデックスと値の両方をループ処理するために使用する関数はどれか？",
    options: ["enumerate()", "zip()", "indexed()", "items()"],
    correctAnswer: "enumerate()",
  },
  {
    question:
      "Pythonでリストの要素を降順にソートするにはどの関数を使用するか？",
    options: [
      "sort(reverse=True)",
      "sort()",
      "sorted(reverse=True)",
      "sorted()",
    ],
    correctAnswer: "sort(reverse=True)",
  },
  {
    question:
      "Pythonのリストで、指定した値が出現する回数を数えるにはどのメソッドを使用するか？",
    options: ["count()", "index()", "find()", "includes()"],
    correctAnswer: "count()",
  },
  {
    question: "次のうち、Pythonの組み込み関数として存在しないものはどれか？",
    options: ["tuple()", "list()", "dict()", "set()"],
    correctAnswer: "dict()",
  },
  {
    question: "Pythonでタプルの要素数を取得するにはどの関数を使用するか？",
    options: [
      "len(my_tuple)",
      "my_tuple.length()",
      "my_tuple.size()",
      "count(my_tuple)",
    ],
    correctAnswer: "len(my_tuple)",
  },
  {
    question: "Pythonでタプルをリストに変換するにはどの関数を使用するか？",
    options: [
      "list(my_tuple)",
      "my_tuple.to_list()",
      "my_tuple.convert()",
      "list_from_tuple(my_tuple)",
    ],
    correctAnswer: "list(my_tuple)",
  },
  {
    question:
      "Pythonで辞書のキーのリストを取得するにはどのメソッドを使用するか？",
    options: [
      "my_dict.keys()",
      "my_dict.keyslist()",
      "my_dict.keys()",
      "my_dict.keys()",
    ],
    correctAnswer: "my_dict.keys()",
  },
  {
    question:
      "Pythonの辞書で、キーが存在しない場合に KeyError を発生させる操作はどれか？",
    options: [
      "my_dict['key']",
      "my_dict.get('key')",
      "my_dict.get('key', None)",
      "my_dict.find('key')",
    ],
    correctAnswer: "my_dict['key']",
  },
  {
    question: "Pythonで辞書の値を更新するにはどのメソッドを使用するか？",
    options: [
      "my_dict['key'] = value",
      "my_dict.update('key', value)",
      "my_dict.modify('key', value)",
      "my_dict.set('key', value)",
    ],
    correctAnswer: "my_dict['key'] = value",
  },
];

let quizQuestions = shuffleArray(rawQuizQuestions).map((q) => {
  const shuffledOptions = shuffleArray(q.options);
  const correctIndex = shuffledOptions.indexOf(q.correctAnswer);
  return {
    question: q.question,
    options: shuffledOptions,
    correctIndex: correctIndex,
    correctAnswer: q.correctAnswer,
    isAiGenerated: false,
  };
});

let currentQuizIndex = 0;
let quizScore = 0;
let quizUserAnswers = [];

const quizQuestionContainer = document.getElementById("question-container");
const quizOptionsContainer = document.getElementById("options-container");
const quizNextBtn = document.getElementById("next-btn");
const quizResultContainer = document.getElementById("quiz-result-container");
const quizProgress = document.getElementById("quiz-progress");
const quizTypeBadge = document.getElementById("quiz-type-badge");

// ==========================================
// クイズコントロール logic...
// ==========================================
function showQuizQuestion() {
  const q = quizQuestions[currentQuizIndex];
  quizProgress.textContent = `${currentQuizIndex + 1} / ${quizQuestions.length}`;
  quizQuestionContainer.innerHTML = `<p class="leading-relaxed font-semibold whitespace-pre-wrap">${sanitizeHtml(q.question)}</p>`;

  if (q.isAiGenerated) {
    quizTypeBadge.classList.remove("hidden");
  } else {
    quizTypeBadge.classList.add("hidden");
  }

  quizOptionsContainer.innerHTML = "";
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className =
      "w-full text-left px-5 py-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm";
    btn.onclick = () => selectQuizOption(index);
    quizOptionsContainer.appendChild(btn);
  });
  quizNextBtn.classList.add("hidden");
}

function selectQuizOption(selectedIndex) {
  const q = quizQuestions[currentQuizIndex];
  const buttons = quizOptionsContainer.querySelectorAll("button");

  buttons.forEach((btn, index) => {
    btn.disabled = true;
    btn.className =
      "w-full text-left px-5 py-4 border rounded-lg font-medium transition-all duration-150 focus:outline-none shadow-sm cursor-not-allowed ";
    if (index === q.correctIndex) {
      btn.classList.add(
        "bg-emerald-50",
        "dark:bg-emerald-950/30",
        "border-emerald-500",
        "dark:border-emerald-600",
        "text-emerald-800",
        "dark:text-emerald-300",
      );
    } else if (index === selectedIndex && index !== q.correctIndex) {
      btn.classList.add(
        "bg-rose-50",
        "dark:bg-rose-950/30",
        "border-rose-500",
        "dark:border-rose-600",
        "text-rose-800",
        "dark:text-rose-300",
      );
    } else {
      btn.classList.add(
        "bg-slate-50",
        "dark:bg-slate-800/50",
        "border-slate-200",
        "dark:border-slate-700",
        "text-slate-400",
        "dark:text-slate-500",
      );
    }
  });

  const isCorrect = selectedIndex === q.correctIndex;
  if (isCorrect) quizScore++;
  quizUserAnswers.push({
    question: q.question,
    selectedIndex,
    correctIndex: q.correctIndex,
    isCorrect,
  });
  quizNextBtn.classList.remove("hidden");
}

function nextQuiz() {
  currentQuizIndex++;
  if (currentQuizIndex < quizQuestions.length) {
    showQuizQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById("quiz-container").classList.add("hidden");
  quizResultContainer.classList.remove("hidden");
  const rate = ((quizScore / quizQuestions.length) * 100).toFixed(1);

  // 学習進捗データ更新
  learningProgress.totalQuizzesAnswered += quizQuestions.length;
  if (quizScore > learningProgress.highestQuizScore) {
    learningProgress.highestQuizScore = quizScore;
  }
  // AI生成問題のクイズをクリアした場合
  const hasAiQuestion = quizQuestions.some((q) => q.isAiGenerated);
  if (hasAiQuestion && quizScore >= Math.ceil(quizQuestions.length / 2)) {
    learningProgress.aiChallengesCleared += 1;
  }
  saveProgress();

  if (quizScore >= Math.ceil(quizQuestions.length * 0.8) && typeof window.confetti === "function") {
    window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
  }

  quizResultContainer.innerHTML = `
        <div class="text-center space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">4択クイズ 結果発表</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">お疲れ様でした！全問解答が完了しました。</p>
          <div class="flex justify-center gap-8 mt-4">
            <div class="text-center">
              <span class="block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">${quizScore} / ${quizQuestions.length}</span>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">正解数</span>
            </div>
            <div class="text-center">
              <span class="block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">${rate}%</span>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">正答率</span>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100">回答詳細履歴</h4>
          <div class="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto pr-2">
            ${quizUserAnswers
              .map(
                (ans, idx) => `
              <div class="pt-4 first:pt-0">
                <div class="flex items-start justify-between gap-4">
                  <span class="font-semibold text-slate-700 dark:text-slate-200 text-sm sm:text-base whitespace-pre-wrap">${idx + 1}. ${ans.question}</span>
                  <span class="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${ans.isCorrect ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}">
                    ${ans.isCorrect ? "正解" : "不正解"}
                  </span>
                </div>
                <div class="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p>選択した答え: <span class="font-medium text-slate-800 dark:text-slate-200">${escapeHtml(quizQuestions[idx].options[ans.selectedIndex])}</span></p>
                  <p>正しい答え: <span class="font-medium text-slate-800 dark:text-slate-200">${escapeHtml(quizQuestions[idx].options[ans.correctIndex])}</span></p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        <div class="pt-6 flex justify-center">
          <button onclick="location.reload()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-colors">
            もう一度挑戦する
          </button>
        </div>
      `;
}

quizNextBtn.onclick = nextQuiz;

// ==========================================
// コーディング問題データ定義
// ==========================================
const defaultCodingProblems = [
  {
    title: "1. 文字列の結合",
    difficulty: "初級",
    description:
      "文字列の引数 <code>name</code> を受け取り、<code>'Hello, '</code> と <code>name</code> と <code>'!'</code> を結合した文字列を返す関数 <code>greet(name)</code> を実装してください。",
    template: `def greet(name):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'greet("Alice")', expected: "Hello, Alice!" },
      { input: 'greet("Bob")', expected: "Hello, Bob!" },
      { input: 'greet("")', expected: "Hello, !" },
    ],
  },
  {
    title: "2. 数値の二乗計算",
    difficulty: "初級",
    description:
      "数値 <code>x</code> を受け取り、その二乗を返す関数 <code>square(x)</code> を実装してください。",
    template: `def square(x):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "square(2)", expected: 4 },
      { input: "square(5)", expected: 25 },
      { input: "square(0)", expected: 0 },
      { input: "square(-3)", expected: 9 },
    ],
  },
  {
    title: "3. 偶数判定関数",
    difficulty: "初級",
    description:
      "整数 <code>n</code> を受け取り、<code>n</code> が偶数なら <code>True</code>、奇数なら <code>False</code> を返す関数 <code>is_even(n)</code> を実装してください。",
    template: `def is_even(n):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "is_even(2)", expected: true },
      { input: "is_even(3)", expected: false },
      { input: "is_even(0)", expected: true },
      { input: "is_even(-4)", expected: true },
      { input: "is_even(-7)", expected: false },
    ],
  },
  {
    title: "4. 最大値の取得",
    difficulty: "初級",
    description:
      "2つの数値 <code>a</code> と <code>b</code> を受け取り、大きい方の値を返す関数 <code>get_max(a, b)</code> を実装してください。値が等しい場合はその値を返してください。",
    template: `def get_max(a, b):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "get_max(5, 3)", expected: 5 },
      { input: "get_max(2, 8)", expected: 8 },
      { input: "get_max(4, 4)", expected: 4 },
      { input: "get_max(-1, -5)", expected: -1 },
    ],
  },
  {
    title: "5. リストの合計",
    difficulty: "初級",
    description:
      "数値のリスト <code>numbers</code> を受け取り、その合計を返す関数 <code>sum_list(numbers)</code> を実装してください。リストが空の場合は <code>0</code> を返してください。",
    template: `def sum_list(numbers):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "sum_list([1, 2, 3])", expected: 6 },
      { input: "sum_list([])", expected: 0 },
      { input: "sum_list([-1, 0, 1])", expected: 0 },
      { input: "sum_list([10])", expected: 10 },
    ],
  },
  {
    title: "6. 偶数のカウント",
    difficulty: "初級",
    description:
      "整数のリスト <code>numbers</code> を受け取り、その中に含まれる偶数の個数を返す関数 <code>count_evens(numbers)</code> を実装してください。",
    template: `def count_evens(numbers):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "count_evens([1, 2, 3, 4, 5])", expected: 2 },
      { input: "count_evens([2, 4, 6])", expected: 3 },
      { input: "count_evens([1, 3, 5])", expected: 0 },
      { input: "count_evens([])", expected: 0 },
    ],
  },
  {
    title: "7. 文字列の反転",
    difficulty: "初級",
    description:
      "文字列 <code>s</code> を受け取り、その文字列を反転したものを返す関数 <code>reverse_string(s)</code> を実装してください。",
    template: `def reverse_string(s):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'reverse_string("hello")', expected: "olleh" },
      { input: 'reverse_string("")', expected: "" },
      { input: 'reverse_string("a")', expected: "a" },
      { input: 'reverse_string("12345")', expected: "54321" },
    ],
  },
  {
    title: "8. 特定文字のカウント",
    difficulty: "初級",
    description:
      "文字列 <code>s</code> と特定の文字 <code>char</code> を受け取り、文字列 <code>s</code> の中に <code>char</code> が出現する回数を返す関数 <code>count_char(s, char)</code> を実装してください。",
    template: `def count_char(s, char):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'count_char("hello", "l")', expected: 2 },
      { input: 'count_char("banana", "a")', expected: 3 },
      { input: 'count_char("python", "z")', expected: 0 },
      { input: 'count_char("", "a")', expected: 0 },
    ],
  },
  {
    title: "9. リストの最大値",
    difficulty: "初級",
    description:
      "数値のリスト <code>numbers</code> を受け取り、その中で最大の値を返す関数 <code>get_max_value(numbers)</code> を実装してください。リストが空の場合は <code>None</code> を返してください。",
    template: `def get_max_value(numbers):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "get_max_value([1, 2, 3])", expected: 3 },
      { input: "get_max_value([])", expected: null },
      { input: "get_max_value([-1, -5, -3])", expected: -1 },
      { input: "get_max_value([10])", expected: 10 },
    ],
  },
  {
    title: "10. リストの最小値",
    difficulty: "初級",
    description:
      "数値のリスト <code>numbers</code> を受け取り、その中で最小の値を返す関数 <code>get_min_value(numbers)</code> を実装してください。リストが空の場合は <code>None</code> を返してください。",
    template: `def get_min_value(numbers):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "get_min_value([1, 2, 3])", expected: 1 },
      { input: "get_min_value([])", expected: null },
      { input: "get_min_value([-1, -5, -3])", expected: -5 },
      { input: "get_min_value([10])", expected: 10 },
    ],
  },
  {
    title: "11. リストの平均値",
    difficulty: "中級",
    description:
      "数値のリスト <code>numbers</code> を受け取り、その平均値を返す関数 <code>get_average(numbers)</code> を実装してください。リストが空の場合は <code>0</code> を返してください。",
    template: `def get_average(numbers):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "get_average([1, 2, 3])", expected: 2.0 },
      { input: "get_average([])", expected: 0 },
      { input: "get_average([10, 20, 30])", expected: 20.0 },
      { input: "get_average([5])", expected: 5.0 },
    ],
  },
  {
    title: "12. リストのフィルタリング",
    difficulty: "中級",
    description:
      "数値のリスト <code>numbers</code> と閾値 <code>threshold</code> を受け取り、<code>threshold</code> 以上の値のみを含む新しいリストを返す関数 <code>filter_above(numbers, threshold)</code> を実装してください。",
    template: `def filter_above(numbers, threshold):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "filter_above([1, 2, 3, 4, 5], 3)", expected: [3, 4, 5] },
      { input: "filter_above([1, 2, 3], 5)", expected: [] },
      { input: "filter_above([], 1)", expected: [] },
      { input: "filter_above([10, 20, 30], 10)", expected: [10, 20, 30] },
    ],
  },
  {
    title: "13. リストのフィルタリング（以下）",
    difficulty: "中級",
    description:
      "数値のリスト <code>numbers</code> と閾値 <code>threshold</code> を受け取り、<code>threshold</code> 以下の値のみを含む新しいリストを返す関数 <code>filter_below(numbers, threshold)</code> を実装してください。",
    template: `def filter_below(numbers, threshold):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "filter_below([1, 2, 3, 4, 5], 3)", expected: [1, 2, 3] },
      { input: "filter_below([1, 2, 3], 0)", expected: [] },
      { input: "filter_below([], 1)", expected: [] },
      { input: "filter_below([10, 20, 30], 30)", expected: [10, 20, 30] },
    ],
  },
  {
    title: "14. リストの重複除去",
    difficulty: "中級",
    description:
      "任意の型の要素を持つリスト <code>items</code> を受け取り、重複を除去した新しいリストを返す関数 <code>remove_duplicates(items)</code> を実装してください。順序は元のリストの出現順を維持してください。",
    template: `def remove_duplicates(items):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      {
        input: "remove_duplicates([1, 2, 2, 3, 3, 3])",
        expected: [1, 2, 3],
      },
      {
        input: 'remove_duplicates(["a", "b", "a", "c"])',
        expected: ["a", "b", "c"],
      },
      { input: "remove_duplicates([])", expected: [] },
      { input: "remove_duplicates([1, 1, 1])", expected: [1] },
    ],
  },
  {
    title: "15. 文字列の単語分割",
    difficulty: "中級",
    description:
      "文字列 <code>s</code> を受け取り、空白文字で分割した単語のリストを返す関数 <code>split_words(s)</code> を実装してください。連続する空白は無視し、空文字列の場合は空リストを返してください。",
    template: `def split_words(s):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      {
        input: 'split_words("hello world")',
        expected: ["hello", "world"],
      },
      { input: 'split_words("  a   b  c  ")', expected: ["a", "b", "c"] },
      { input: 'split_words("")', expected: [] },
      { input: 'split_words("single")', expected: ["single"] },
    ],
  },
  {
    title: "16. 文字列の単語数カウント",
    difficulty: "中級",
    description:
      "文字列 <code>s</code> を受け取り、その中に含まれる単語の数を返す関数 <code>count_words(s)</code> を実装してください。単語は空白文字で区切られた連続する非空白文字列とします。",
    template: `def count_words(s):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'count_words("hello world")', expected: 2 },
      { input: 'count_words("  a   b  c  ")', expected: 3 },
      { input: 'count_words("")', expected: 0 },
      { input: 'count_words("single")', expected: 1 },
    ],
  },
  {
    title: "17. 文字列の先頭大文字化",
    difficulty: "中級",
    description:
      "文字列 <code>s</code> を受け取り、各単語の先頭文字を大文字に、それ以外を小文字に変換した文字列を返す関数 <code>capitalize_words(s)</code> を実装してください。単語は空白文字で区切られます。",
    template: `def capitalize_words(s):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      {
        input: 'capitalize_words("hello world")',
        expected: "Hello World",
      },
      { input: 'capitalize_words("  a   b  c  ")', expected: "A B C" },
      { input: 'capitalize_words("")', expected: "" },
      { input: 'capitalize_words("SINGLE")', expected: "Single" },
    ],
  },
  {
    title: "18. 文字列の部分文字列検索",
    difficulty: "中級",
    description:
      "文字列 <code>s</code> と部分文字列 <code>sub</code> を受け取り、<code>s</code> の中に <code>sub</code> が含まれていれば <code>True</code>、そうでなければ <code>False</code> を返す関数 <code>contains_substring(s, sub)</code> を実装してください。",
    template: `def contains_substring(s, sub):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      {
        input: 'contains_substring("hello world", "world")',
        expected: true,
      },
      {
        input: 'contains_substring("hello world", "python")',
        expected: false,
      },
      { input: 'contains_substring("", "a")', expected: false },
      { input: 'contains_substring("abc", "")', expected: true },
    ],
  },
  {
    title: "19. 文字列の部分文字列置換",
    difficulty: "中級",
    description:
      "文字列 <code>s</code>、置換対象の部分文字列 <code>old</code>、新しい部分文字列 <code>new</code> を受け取り、<code>s</code> の中のすべての <code>old</code> を <code>new</code> に置換した新しい文字列を返す関数 <code>replace_substring(s, old, new)</code> を実装してください。",
    template: `def replace_substring(s, old, new):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      {
        input: 'replace_substring("hello world", "world", "python")',
        expected: "hello python",
      },
      {
        input: 'replace_substring("banana", "na", "no")',
        expected: "bonono",
      },
      { input: 'replace_substring("", "a", "b")', expected: "" },
      { input: 'replace_substring("abc", "", "x")', expected: "xaxbxcx" },
    ],
  },
  {
    title: "20. 文字列の先頭・末尾の空白除去",
    difficulty: "初級",
    description:
      "文字列 <code>s</code> を受け取り、先頭と末尾の空白文字を除去した新しい文字列を返す関数 <code>strip_whitespace(s)</code> を実装してください。",
    template: `def strip_whitespace(s):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'strip_whitespace("  hello  ")', expected: "hello" },
      { input: 'strip_whitespace("  a b c  ")', expected: "a b c" },
      { input: 'strip_whitespace("")', expected: "" },
      { input: 'strip_whitespace("no spaces")', expected: "no spaces" },
    ],
  },
  {
    title: "21. FizzBuzzの実装",
    difficulty: "中級",
    description:
      "整数 <code>n</code> を受け取り、1から <code>n</code> までのFizzBuzz結果をリストとして返す関数 <code>fizzbuzz(n)</code> を実装してください。3の倍数で'Fizz'、5の倍数で'Buzz'、15の倍数で'FizzBuzz'、それ以外は数値を文字列にしてリストに追加します。",
    template: `def fizzbuzz(n):\n    # ここにコードを書いてください\n    pass\n`,
    test_cases: [
      { input: "fizzbuzz(5)", expected: "['1', '2', 'Fizz', '4', 'Buzz']" },
      { input: "fizzbuzz(15)[14]", expected: "'FizzBuzz'" },
    ],
  },
  {
    title: "22. 素数判定",
    difficulty: "中級",
    description:
      "整数 <code>n</code> を受け取り、素数であれば <code>True</code>、そうでなければ <code>False</code> を返す関数 <code>is_prime(n)</code> を実装してください。1以下は素数ではありません。",
    template: `def is_prime(n):\n    # ここにコードを書いてください\n    pass\n`,
    test_cases: [
      { input: "is_prime(2)", expected: "True" },
      { input: "is_prime(4)", expected: "False" },
      { input: "is_prime(17)", expected: "True" },
      { input: "is_prime(1)", expected: "False" },
    ],
  },
  {
    title: "23. アナグラム判定",
    difficulty: "中級",
    description:
      "2つの文字列 <code>s1</code> と <code>s2</code> を受け取り、それらがアナグラム（文字の並べ替えで完全に一致する）であれば <code>True</code>、そうでなければ <code>False</code> を返す関数 <code>is_anagram(s1, s2)</code> を実装してください。",
    template: `def is_anagram(s1, s2):\n    # ここにコードを書いてください\n    pass\n`,
    test_cases: [
      { input: 'is_anagram("listen", "silent")', expected: "True" },
      { input: 'is_anagram("hello", "world")', expected: "False" },
      { input: 'is_anagram("triangle", "integral")', expected: "True" },
    ],
  },
  {
    title: "24. フィボナッチ数列",
    difficulty: "上級",
    description:
      "整数 <code>n</code> を受け取り、フィボナッチ数列の <code>n</code> 番目の値を返す関数 <code>fibonacci(n)</code> を実装してください。(例: 0番目は0, 1番目は1, 2番目は1, 3番目は2...)",
    template: `def fibonacci(n):\n    # ここにコードを書いてください\n    pass\n`,
    test_cases: [
      { input: "fibonacci(0)", expected: "0" },
      { input: "fibonacci(1)", expected: "1" },
      { input: "fibonacci(5)", expected: "5" },
      { input: "fibonacci(10)", expected: "55" },
    ],
  },
  {
    title: "25. 最大公約数 (GCD)",
    difficulty: "上級",
    description:
      "2つの正の整数 <code>a</code> と <code>b</code> を受け取り、その最大公約数を返す関数 <code>gcd(a, b)</code> を実装してください。",
    template: `def gcd(a, b):\n    # ここにコードを書いてください\n    pass\n`,
    test_cases: [
      { input: "gcd(12, 18)", expected: "6" },
      { input: "gcd(7, 3)", expected: "1" },
      { input: "gcd(48, 18)", expected: "6" },
    ],
  },
  {
    title: "26. 【対話型CLI】お名前あいさつプログラム",
    type: "cli",
    difficulty: "初級",
    description:
      "<code>input()</code> でユーザーから名前を入力として受け取り、<code>'こんにちは、{名前}さん！'</code> と出力するプログラムを書いてください。",
    template: `# input() で名前を受け取り、あいさつを出力してください
# ここにコードを書いてください

`,
    test_cases: [
      { inputs: ["Alice"], expected: "お名前を入力してください: Alice\nこんにちは、Aliceさん！", match: "contains" },
      { inputs: ["太郎"], expected: "お名前を入力してください: 太郎\nこんにちは、太郎さん！", match: "contains" }
    ],
  },
  {
    title: "27. 【対話型CLI】年齢判定プログラム",
    type: "cli",
    difficulty: "初級",
    description:
      "<code>input()</code> で年齢（整数）を受け取り、18歳以上なら <code>'成人です'</code>、18歳未満なら <code>'未成年です'</code> と出力するプログラムを書いてください。",
    template: `# input() で年齢を受け取り、成人/未成年を判定して出力してください
# ここにコードを書いてください

`,
    test_cases: [
      { inputs: ["20"], expected: "成人です", match: "contains" },
      { inputs: ["15"], expected: "未成年です", match: "contains" },
      { inputs: ["18"], expected: "成人です", match: "contains" }
    ],
  },
  {
    title: "28. 【対話型CLI】簡単足し算計算機",
    type: "cli",
    difficulty: "中級",
    description:
      "<code>input()</code> で2つの整数 <code>a</code> と <code>b</code> を順番に受け取り、<code>'{a} + {b} = {合計}'</code> という形式で出力するプログラムを書いてください。",
    template: `# 2つの整数を入力で受け取り、計算結果を出力してください
# ここにコードを書いてください

`,
    test_cases: [
      { inputs: ["10", "20"], expected: "10 + 20 = 30", match: "contains" },
      { inputs: ["5", "8"], expected: "5 + 8 = 13", match: "contains" }
    ],
  },
  {
    title: "29. 【対話型CLI】BMI診断プログラム",
    type: "cli",
    difficulty: "中級",
    description:
      "<code>input()</code> で身長(cm)と体重(kg)を受け取り、BMI（<code>体重 / (身長/100)**2</code>）を計算して <code>'BMI: {値:.1f}'</code> と出力するプログラムを書いてください。",
    template: `# 身長(cm)と体重(kg)を受け取り、BMIを計算して出力してください
# ここにコードを書いてください

`,
    test_cases: [
      { inputs: ["170", "65"], expected: "BMI: 22.5", match: "contains" },
      { inputs: ["160", "50"], expected: "BMI: 19.5", match: "contains" }
    ],
  },
  {
    title: "30. 【データ可視化】月別売上推移の折れ線グラフ",
    type: "plot",
    difficulty: "初級",
    description:
      "<code>matplotlib.pyplot</code> を用いて、月別売上推移の折れ線グラフを描画してください。<br/>月 <code>months = ['4月', '5月', '6月', '7月']</code>、売上 <code>sales = [120, 150, 180, 220]</code> を指定し、タイトルを <code>'月別売上推移'</code> として <code>plt.show()</code> してください。",
    template: `import matplotlib.pyplot as plt

months = ["4月", "5月", "6月", "7月"]
sales = [120, 150, 180, 220]

# ここに折れ線グラフを描画するコードを書いてください

`,
    test_cases: [
      { check: "type", expected: "line", input_label: "グラフ種別が 'line' (折れ線グラフ)" },
      { check: "title", expected: "月別売上推移", input_label: "タイトルが '月別売上推移'" },
      { check: "labels", expected: ["4月", "5月", "6月", "7月"], input_label: "X軸ラベルが ['4月', '5月', '6月', '7月']" },
      { check: "first_dataset_data", expected: [120, 150, 180, 220], input_label: "データ配列が [120, 150, 180, 220]" }
    ],
  },
  {
    title: "31. 【データ可視化】果物の売上個数の棒グラフ",
    type: "plot",
    difficulty: "初級",
    description:
      "<code>plt.bar()</code> を用いて、果物の売上個数の棒グラフを描画してください。<br/>果物 <code>fruits = ['りんご', 'バナナ', 'みかん']</code>、個数 <code>counts = [45, 60, 30]</code> を指定し、タイトルを <code>'果物売上'</code> として <code>plt.show()</code> してください。",
    template: `import matplotlib.pyplot as plt

fruits = ["りんご", "バナナ", "みかん"]
counts = [45, 60, 30]

# ここに棒グラフを描画するコードを書いてください

`,
    test_cases: [
      { check: "type", expected: "bar", input_label: "グラフ種別が 'bar' (棒グラフ)" },
      { check: "title", expected: "果物売上", input_label: "タイトルが '果物売上'" },
      { check: "labels", expected: ["りんご", "バナナ", "みかん"], input_label: "X軸ラベルが ['りんご', 'バナナ', 'みかん']" },
      { check: "first_dataset_data", expected: [45, 60, 30], input_label: "データ配列が [45, 60, 30]" }
    ],
  },
  {
    title: "32. 【データ可視化】身長と体重の散布図",
    type: "plot",
    difficulty: "中級",
    description:
      "<code>plt.scatter()</code> を用いて、身長と体重の散布図を描画してください。<br/>身長 <code>heights = [160, 170, 175, 180]</code>、体重 <code>weights = [55, 65, 70, 78]</code> を指定し、タイトルを <code>'身長と体重の分布'</code> として <code>plt.show()</code> してください。",
    template: `import matplotlib.pyplot as plt

heights = [160, 170, 175, 180]
weights = [55, 65, 70, 78]

# ここに散布図を描画するコードを書いてください

`,
    test_cases: [
      { check: "type", expected: "scatter", input_label: "グラフ種別が 'scatter' (散布図)" },
      { check: "title", expected: "身長と体重の分布", input_label: "タイトルが '身長と体重の分布'" },
      { check: "datasets_count", expected: 1, input_label: "データセットが1件登録されている" }
    ],
  },
  {
    title: "33. 【データ可視化】満足度アンケートの円グラフ",
    type: "plot",
    difficulty: "中級",
    description:
      "<code>plt.pie()</code> を用いて、アンケート回答割合の円グラフを描画してください。<br/>割合 <code>rates = [50, 30, 20]</code>、ラベル <code>labels = ['満足', '普通', '不満']</code> を指定し、タイトルを <code>'満足度アンケート'</code> として <code>plt.show()</code> してください。",
    template: `import matplotlib.pyplot as plt

rates = [50, 30, 20]
labels = ["満足", "普通", "不満"]

# ここに円グラフを描画するコードを書いてください

`,
    test_cases: [
      { check: "type", expected: "pie", input_label: "グラフ種別が 'pie' (円グラフ)" },
      { check: "title", expected: "満足度アンケート", input_label: "タイトルが '満足度アンケート'" },
      { check: "labels", expected: ["満足", "普通", "不満"], input_label: "ラベルが ['満足', '普通', '不満']" },
      { check: "first_dataset_data", expected: [50, 30, 20], input_label: "データ配列が [50, 30, 20]" }
    ],
  },
  {
    title: "34. 【datetime】2つの日付の日数差分計算",
    difficulty: "初級",
    description:
      "<code>datetime</code> モジュールを用いて、2つの日付文字列 <code>date_str1</code> と <code>date_str2</code> (形式: 'YYYY-MM-DD') を受け取り、その日数の差（絶対値の整数）を返す関数 <code>get_days_diff(date_str1, date_str2)</code> を実装してください。",
    template: `import datetime

def get_days_diff(date_str1, date_str2):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'get_days_diff("2026-08-01", "2026-08-15")', expected: 14 },
      { input: 'get_days_diff("2026-01-01", "2026-01-01")', expected: 0 },
      { input: 'get_days_diff("2026-12-31", "2026-01-01")', expected: 364 },
    ],
  },
  {
    title: "35. 【datetime】指定日数後の日付フォーマット",
    difficulty: "中級",
    description:
      "基準日 <code>base_date_str</code> ('YYYY-MM-DD') と加算日数 <code>days</code> を受け取り、その日数後の日付を <code>'YYYY年MM月DD日'</code> の形式で返す関数 <code>add_days_and_format(base_date_str, days)</code> を実装してください。",
    template: `from datetime import datetime, timedelta

def add_days_and_format(base_date_str, days):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'add_days_and_format("2026-04-01", 10)', expected: "2026年04月11日" },
      { input: 'add_days_and_format("2026-12-25", 7)', expected: "2027年01月01日" },
      { input: 'add_days_and_format("2026-02-20", 10)', expected: "2026年03月02日" },
    ],
  },
  {
    title: "36. 【math】2点間のユークリッド距離",
    difficulty: "初級",
    description:
      "<code>math</code> モジュールを用いて、2次元平面上の2点 <code>p1 = (x1, y1)</code> と <code>p2 = (x2, y2)</code> を受け取り、2点間のユークリッド距離（√((x2-x1)² + (y2-y1)²))を計算して小数点第2位まで四捨五入した数値（<code>round(dist, 2)</code>）を返す関数 <code>calc_distance(p1, p2)</code> を実装してください。",
    template: `import math

def calc_distance(p1, p2):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'calc_distance((0, 0), (3, 4))', expected: 5.0 },
      { input: 'calc_distance((1, 2), (4, 6))', expected: 5.0 },
      { input: 'calc_distance((0, 0), (1, 1))', expected: 1.41 },
    ],
  },
  {
    title: "37. 【re】メールアドレスのバリデーション",
    difficulty: "中級",
    description:
      "<code>re</code> モジュールを用いて、文字列 <code>email</code> が一般的なメールアドレス形式（半角英数字やドット・ハイフンを含むユーザー名 <code>@</code> ドメイン名 <code>.</code> トップレベルドメイン）と完全に一致していれば <code>True</code>、そうでなければ <code>False</code> を返す関数 <code>is_valid_email(email)</code> を実装してください。",
    template: `import re

def is_valid_email(email):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'is_valid_email("user@example.com")', expected: true },
      { input: 'is_valid_email("alice.test@sub.domain.jp")', expected: true },
      { input: 'is_valid_email("invalid-email.com")', expected: false },
      { input: 'is_valid_email("user@domain")', expected: false },
    ],
  },
  {
    title: "38. 【re】テキスト内の電話番号抽出",
    difficulty: "中級",
    description:
      "<code>re</code> モジュールを用いて、文章 <code>text</code> の中に含まれる <code>XXX-XXXX-XXXX</code> または <code>XX-XXXX-XXXX</code> 形式の日本の電話番号をすべて抽出したリストを返す関数 <code>extract_phone_numbers(text)</code> を実装してください。",
    template: `import re

def extract_phone_numbers(text):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'extract_phone_numbers("連絡先は 090-1234-5678 または 03-1234-5678 です")', expected: ["090-1234-5678", "03-1234-5678"] },
      { input: 'extract_phone_numbers("番号はありません")', expected: [] },
      { input: 'extract_phone_numbers("代表: 080-9999-8888")', expected: ["080-9999-8888"] },
    ],
  },
  {
    title: "39. 【collections】Counterによる最頻出要素の抽出",
    difficulty: "中級",
    description:
      "<code>collections.Counter</code> を用いて、リスト <code>items</code> と整数 <code>n</code> を受け取り、最も出現回数が多い上位 <code>n</code> 個の要素をリスト形式（出現頻度降順）で返す関数 <code>get_top_n_items(items, n)</code> を実装してください。",
    template: `from collections import Counter

def get_top_n_items(items, n):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'get_top_n_items(["apple", "banana", "apple", "orange", "banana", "apple"], 2)', expected: ["apple", "banana"] },
      { input: 'get_top_n_items([1, 2, 3, 1, 2, 1], 1)', expected: [1] },
      { input: 'get_top_n_items(["cat", "dog"], 2)', expected: ["cat", "dog"] },
    ],
  },
  {
    title: "40. 【collections】defaultdictによるグループ化",
    difficulty: "中級",
    description:
      "<code>collections.defaultdict</code> を用いて、商品タプルのリスト <code>items</code> (形式: <code>[(カテゴリ, 商品名), ...]</code>) を受け取り、カテゴリ名をキー、そのカテゴリに属する商品名リストを値とする通常の辞書 (<code>dict</code>) を返す関数 <code>group_by_category(items)</code> を実装してください。",
    template: `from collections import defaultdict

def group_by_category(items):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      {
        input: 'group_by_category([("果物", "りんご"), ("野菜", "トマト"), ("果物", "バナナ")])',
        expected: '{"果物": ["りんご", "バナナ"], "野菜": ["トマト"]}',
      },
      {
        input: 'group_by_category([("本", "Python入門"), ("本", "JavaScript入門")])',
        expected: '{"本": ["Python入門", "JavaScript入門"]}',
      },
      { input: 'group_by_category([])', expected: "{}" },
    ],
  },
  {
    title: "41. 【itertools】組み合わせ(Combinations)の全探索",
    difficulty: "上級",
    description:
      "<code>itertools.combinations</code> を用いて、数値リスト <code>numbers</code> と目標値 <code>target_sum</code> を受け取り、合計が <code>target_sum</code> になる2つの数値のペア <code>(a, b)</code> をすべてリストにして返す関数 <code>find_sum_pairs(numbers, target_sum)</code> を実装してください。ペア内の順序は元の出現順とし、重複する同一ペアは省いてください。",
    template: `import itertools

def find_sum_pairs(numbers, target_sum):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "find_sum_pairs([1, 2, 3, 4, 5], 6)", expected: "[(1, 5), (2, 4)]" },
      { input: "find_sum_pairs([10, 20, 30], 50)", expected: "[(20, 30)]" },
      { input: "find_sum_pairs([1, 2, 3], 10)", expected: "[]" },
    ],
  },
  {
    title: "42. 【itertools】累積和の生成",
    difficulty: "初級",
    description:
      "<code>itertools.accumulate</code> を用いて、数値リスト <code>numbers</code> を受け取り、その累積和（各要素までの合計値のリスト）を返す関数 <code>calc_running_totals(numbers)</code> を実装してください。空リストの場合は空リストを返してください。",
    template: `import itertools

def calc_running_totals(numbers):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "calc_running_totals([1, 2, 3, 4, 5])", expected: [1, 3, 6, 10, 15] },
      { input: "calc_running_totals([10, -5, 20])", expected: [10, 5, 25] },
      { input: "calc_running_totals([])", expected: [] },
    ],
  },
  {
    title: "43. 【json】売上JSONデータの集計",
    difficulty: "中級",
    description:
      "<code>json</code> モジュールを用いて、売上データのJSON文字列 <code>json_str</code> (例: <code>'[{\"item\": \"A\", \"price\": 100, \"qty\": 2}, ...]'</code>) を受け取り、全体の合計売上金額 (<code>price * qty</code> の総和) を計算して返す関数 <code>calc_total_sales_from_json(json_str)</code> を実装してください。",
    template: `import json

def calc_total_sales_from_json(json_str):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'calc_total_sales_from_json(\'[{"item": "A", "price": 100, "qty": 2}, {"item": "B", "price": 250, "qty": 3}]\')', expected: 950 },
      { input: 'calc_total_sales_from_json(\'[]\')', expected: 0 },
      { input: 'calc_total_sales_from_json(\'[{"item": "X", "price": 500, "qty": 1}]\')', expected: 500 },
    ],
  },
  {
    title: "44. 【statistics】データセットの統計量計算",
    difficulty: "中級",
    description:
      "<code>statistics</code> モジュールを用いて、数値リスト <code>data</code> を受け取り、平均値 (<code>mean</code>) と 中央値 (<code>median</code>) を計算して <code>{'mean': 平均, 'median': 中央値}</code> の辞書を返す関数 <code>get_stats_summary(data)</code> を実装してください。数値は小数（または整数）のままで構いません。",
    template: `import statistics

def get_stats_summary(data):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: "get_stats_summary([10, 20, 30, 40, 50])", expected: '{"mean": 30.0, "median": 30}' },
      { input: "get_stats_summary([1, 2, 9])", expected: '{"mean": 4.0, "median": 2}' },
      { input: "get_stats_summary([5, 5, 5])", expected: '{"mean": 5.0, "median": 5}' },
    ],
  },
  {
    title: "45. 【urllib.parse】URLクエリパラメータの解析",
    difficulty: "中級",
    description:
      "<code>urllib.parse</code> モジュールを用いて、URL文字列 <code>url</code> を受け取り、そのクエリパラメータ（<code>?key=value&...</code>）を解析して、各パラメータの最初の値を格納した辞書 (<code>{key: value}</code>) を返す関数 <code>parse_query_params(url)</code> を実装してください。クエリがない場合は空の辞書を返してください。",
    template: `from urllib.parse import urlparse, parse_qs

def parse_query_params(url):
    # ここにコードを書いてください
    pass
`,
    test_cases: [
      { input: 'parse_query_params("https://example.com/search?q=python&lang=ja")', expected: '{"q": "python", "lang": "ja"}' },
      { input: 'parse_query_params("https://example.com/item?id=12345")', expected: '{"id": "12345"}' },
      { input: 'parse_query_params("https://example.com/home")', expected: "{}" },
    ],
  },
];

let codingProblems = shuffleArray(defaultCodingProblems);
let currentCodingIndex = 0;
let codingScores = [];

const codingSelect = document.getElementById("coding-select");
const codingChallengeTitle = document.getElementById("coding-challenge-title");
const codingChallengeDifficulty = document.getElementById("coding-challenge-difficulty");
const codingChallengeDescription = document.getElementById("coding-challenge-description");

const codeEditor = document.getElementById("code-editor");
const lineNumbersContainer = document.getElementById("line-numbers-container");
const editorBackdrop = document.getElementById("editor-backdrop");
const runBtn = document.getElementById("run-btn");
const cliInteractiveBtn = document.getElementById("cli-interactive-btn");
const formatBtn = document.getElementById("format-btn");
const codingNextBtn = document.getElementById("coding-next-btn");
const testResults = document.getElementById("test-results");
const codingResultContainer = document.getElementById(
  "coding-result-container",
);
const codingTypeBadge = document.getElementById("coding-type-badge");
const aiHintBtn = document.getElementById("ai-hint-btn");
const aiHintPanel = document.getElementById("ai-hint-panel");
const aiHintContent = document.getElementById("ai-hint-content");

// ツールバー＆ステータスバー関連
const fontSizeDecBtn = document.getElementById("font-size-dec-btn");
const fontSizeIncBtn = document.getElementById("font-size-inc-btn");
const resetCodeBtn = document.getElementById("reset-code-btn");
const copyCodeBtn = document.getElementById("copy-code-btn");
const keyboardShortcutsBtn = document.getElementById("keyboard-shortcuts-btn");
const shortcutsModal = document.getElementById("shortcuts-modal");
const shortcutsModalClose = document.getElementById("shortcuts-modal-close");
const editorCursorPos = document.getElementById("editor-cursor-pos");
const editorCharCount = document.getElementById("editor-char-count");
const editorAutosaveStatus = document.getElementById("editor-autosave-status");

// 出力タブ関連
const tabBtnResults = document.getElementById("tab-btn-results");
const tabBtnStdout = document.getElementById("tab-btn-stdout");
const tabBtnPlot = document.getElementById("tab-btn-plot");
const tabPanelResults = document.getElementById("tab-panel-results");
const tabPanelStdout = document.getElementById("tab-panel-stdout");
const tabPanelPlot = document.getElementById("tab-panel-plot");
const testSummaryBadge = document.getElementById("test-summary-badge");
const stdoutCountBadge = document.getElementById("stdout-count-badge");
const stdoutTerminal = document.getElementById("stdout-terminal");
const plotBadge = document.getElementById("plot-badge");
const chartTypeTag = document.getElementById("chart-type-tag");
const chartPlaceholder = document.getElementById("chart-placeholder");
const pythonChartCanvas = document.getElementById("python-chart-canvas");

let activeChartInstance = null;

function renderPythonChart(chartDataJson) {
  try {
    const data = typeof chartDataJson === "string" ? JSON.parse(chartDataJson) : chartDataJson;
    if (!data || !pythonChartCanvas) return;

    if (activeChartInstance) {
      activeChartInstance.destroy();
      activeChartInstance = null;
    }

    if (chartPlaceholder) chartPlaceholder.classList.add("hidden");
    if (plotBadge) plotBadge.classList.remove("hidden");
    if (chartTypeTag) chartTypeTag.textContent = `${data.type.toUpperCase()} グラフ`;

    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.2)";

    const palette = [
      "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
      "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#3b82f6"
    ];

    const datasets = (data.datasets || []).map((ds, idx) => {
      const color = ds.borderColor || ds.backgroundColor || palette[idx % palette.length];
      if (data.type === "pie") {
        return {
          data: ds.data,
          backgroundColor: palette.slice(0, (ds.data || []).length),
          borderWidth: 2,
          borderColor: isDark ? "#0f172a" : "#ffffff"
        };
      } else if (data.type === "bar") {
        return {
          label: ds.label || `系列 ${idx + 1}`,
          data: ds.data,
          backgroundColor: color,
          borderRadius: 6
        };
      } else if (data.type === "scatter") {
        return {
          label: ds.label || `系列 ${idx + 1}`,
          data: ds.data,
          backgroundColor: color,
          pointRadius: 6,
          pointHoverRadius: 8
        };
      } else {
        return {
          label: ds.label || `系列 ${idx + 1}`,
          data: ds.data,
          borderColor: color,
          backgroundColor: color + "20",
          fill: false,
          tension: 0.3,
          pointRadius: 5
        };
      }
    });

    const config = {
      type: data.type === "scatter" ? "scatter" : (data.type === "pie" ? "pie" : (data.type === "bar" ? "bar" : "line")),
      data: {
        labels: data.labels || [],
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!data.title,
            text: data.title || "",
            color: textColor,
            font: { size: 14, weight: "bold", family: "system-ui, sans-serif" }
          },
          legend: {
            display: data.type === "pie" || (data.datasets && data.datasets.length > 1) || (datasets[0] && !!datasets[0].label),
            labels: { color: textColor }
          }
        },
        scales: data.type === "pie" ? {} : {
          x: {
            title: { display: !!data.xlabel, text: data.xlabel || "", color: textColor },
            ticks: { color: textColor },
            grid: { color: gridColor, display: data.grid !== false }
          },
          y: {
            title: { display: !!data.ylabel, text: data.ylabel || "", color: textColor },
            ticks: { color: textColor },
            grid: { color: gridColor, display: data.grid !== false }
          }
        }
      }
    };

    if (window.Chart) {
      activeChartInstance = new window.Chart(pythonChartCanvas.getContext("2d"), config);
    }
  } catch (err) {
    console.error("グラフ描画エラー:", err);
  }
}

window.render_python_chart = renderPythonChart;

function setActiveOutputTab(tab) {
  const activeBtnClass = ["border-indigo-600", "text-indigo-600", "dark:text-indigo-400", "bg-white", "dark:bg-slate-900", "font-bold"];
  const inactiveBtnClass = ["border-transparent", "text-slate-500", "hover:text-slate-800", "dark:text-slate-400", "dark:hover:text-slate-200", "font-semibold"];

  [
    { name: "results", btn: tabBtnResults, panel: tabPanelResults },
    { name: "stdout", btn: tabBtnStdout, panel: tabPanelStdout },
    { name: "plot", btn: tabBtnPlot, panel: tabPanelPlot }
  ].forEach((t) => {
    if (t.btn) {
      if (t.name === tab) {
        t.btn.classList.add(...activeBtnClass);
        t.btn.classList.remove(...inactiveBtnClass);
      } else {
        t.btn.classList.remove(...activeBtnClass);
        t.btn.classList.add(...inactiveBtnClass);
      }
    }
    if (t.panel) {
      if (t.name === tab) t.panel.classList.remove("hidden");
      else t.panel.classList.add("hidden");
    }
  });
}

window.setActiveOutputTab = setActiveOutputTab;

if (tabBtnResults) tabBtnResults.onclick = () => setActiveOutputTab("results");
if (tabBtnStdout) tabBtnStdout.onclick = () => setActiveOutputTab("stdout");
if (tabBtnPlot) tabBtnPlot.onclick = () => setActiveOutputTab("plot");

// 問題一覧ドロワー関連
const openProblemDrawerBtn = document.getElementById("open-problem-drawer-btn");
const problemDrawer = document.getElementById("problem-drawer");
const problemDrawerClose = document.getElementById("problem-drawer-close");
const problemDrawerBackdrop = document.getElementById("problem-drawer-backdrop");
const drawerSearchInput = document.getElementById("drawer-search-input");
const drawerProblemList = document.getElementById("drawer-problem-list");
const drawerProgressText = document.getElementById("drawer-progress-text");

// 新規追加ボタン＆パネル
const aiReviewBtn = document.getElementById("ai-review-btn");
const aiReviewPanel = document.getElementById("ai-review-panel");
const aiReviewContent = document.getElementById("ai-review-content");

// ==========================================
// エディタフォントサイズ管理
// ==========================================
let currentEditorFontSize = parseInt(localStorage.getItem("py_editor_font_size") || "14", 10);

function applyEditorFontSize(size) {
  currentEditorFontSize = Math.min(24, Math.max(11, size));
  localStorage.setItem("py_editor_font_size", currentEditorFontSize);
  const lh = (currentEditorFontSize * 1.625) / 14 * 1.625;
  const remSize = (currentEditorFontSize / 16).toFixed(4) + "rem";
  const remLineHeight = (currentEditorFontSize * 1.85 / 16).toFixed(4) + "rem";

  [codeEditor, editorBackdrop, lineNumbersContainer].forEach((el) => {
    if (el) {
      el.style.fontSize = remSize;
      el.style.lineHeight = remLineHeight;
    }
  });

  const lines = lineNumbersContainer.querySelectorAll(".editor-line");
  lines.forEach((l) => (l.style.lineHeight = remLineHeight));
  updateEditorDecorations();
}

if (fontSizeDecBtn && fontSizeIncBtn) {
  fontSizeDecBtn.onclick = () => applyEditorFontSize(currentEditorFontSize - 1);
  fontSizeIncBtn.onclick = () => applyEditorFontSize(currentEditorFontSize + 1);
  applyEditorFontSize(currentEditorFontSize);
}

// ==========================================
// 下書き自動保存 (Draft Storage)
// ==========================================
const PYTHON_DRAFTS_KEY = "python_code_drafts_v3";
let autoSaveTimer = null;

function getDraftsMap() {
  try {
    const raw = localStorage.getItem(PYTHON_DRAFTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCurrentDraft() {
  if (!codingProblems[currentCodingIndex]) return;
  const problem = codingProblems[currentCodingIndex];
  const drafts = getDraftsMap();
  drafts[problem.title] = codeEditor.value;
  try {
    localStorage.setItem(PYTHON_DRAFTS_KEY, JSON.stringify(drafts));
    if (editorAutosaveStatus) {
      editorAutosaveStatus.innerHTML = `
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        自動保存済み
      `;
      editorAutosaveStatus.className = "text-emerald-600 dark:text-emerald-400 font-sans font-medium flex items-center gap-1";
    }
  } catch (e) {
    console.warn("下書き保存エラー:", e);
  }
}

function triggerAutoSave() {
  if (editorAutosaveStatus) {
    editorAutosaveStatus.innerHTML = `
      <span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      保存中...
    `;
    editorAutosaveStatus.className = "text-amber-600 dark:text-amber-400 font-sans font-medium flex items-center gap-1";
  }
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(saveCurrentDraft, 400);
}

// ==========================================
// カーソル位置＆文字数ステータス更新
// ==========================================
function updateCursorStatus() {
  if (!codeEditor || !editorCursorPos || !editorCharCount) return;
  const val = codeEditor.value;
  const selStart = codeEditor.selectionStart;
  const linesBefore = val.substring(0, selStart).split("\n");
  const lineNum = linesBefore.length;
  const colNum = linesBefore[linesBefore.length - 1].length + 1;

  editorCursorPos.textContent = `Ln ${lineNum}, Col ${colNum}`;
  editorCharCount.textContent = `${val.length} 文字`;
}

// ==========================================
// Prism.js によるシンタックスハイライト描画
// ==========================================
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

  // Prism.js を使ったハイライト生成
  let highlighted = escapeHtml(text);
  try {
    if (
      window.Prism &&
      window.Prism.languages &&
      window.Prism.languages.python
    ) {
      highlighted = window.Prism.highlight(
        text,
        window.Prism.languages.python,
        "python",
      );
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

  if (text.endsWith("\n")) highlighted += "<br/>";

  editorBackdrop.innerHTML = `<code class="language-python" style="display: block; padding: 0; text-shadow: none;">${highlighted}</code>`;

  editorBackdrop.scrollTop = codeEditor.scrollTop;
  editorBackdrop.scrollLeft = codeEditor.scrollLeft;
  lineNumbersContainer.scrollTop = codeEditor.scrollTop;

  updateCursorStatus();
}

// スクロール同期
codeEditor.addEventListener("scroll", () => {
  editorBackdrop.scrollTop = codeEditor.scrollTop;
  editorBackdrop.scrollLeft = codeEditor.scrollLeft;
  lineNumbersContainer.scrollTop = codeEditor.scrollTop;
});

// 入力イベント
codeEditor.addEventListener("input", () => {
  updateEditorDecorations();
  triggerAutoSave();
});

codeEditor.addEventListener("click", updateCursorStatus);
codeEditor.addEventListener("keyup", updateCursorStatus);

// ==========================================
// スマートキーボード制御 (Tab, Shift+Tab, Enter, 括弧, ショートカット)
// ==========================================
codeEditor.addEventListener("keydown", function (e) {
  const start = this.selectionStart;
  const end = this.selectionEnd;
  const value = this.value;

  // 1. Ctrl + Enter / Cmd + Enter で実行
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    runCodingTests();
    return;
  }

  // 2. Ctrl + S / Cmd + S で手動保存＆フォーマット
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    formatCode();
    saveCurrentDraft();
    notify("コードをフォーマットし、下書きを保存しました！", "保存完了", "info");
    return;
  }

  // 3. Tab & Shift+Tab (複数行インデント/逆インデント対応)
  if (e.key === "Tab") {
    e.preventDefault();
    if (start !== end) {
      // 選択範囲がある場合：選択行全体を一括インデント/アンインデント
      const startPos = value.lastIndexOf("\n", start - 1) + 1;
      let endPos = value.indexOf("\n", end);
      if (endPos === -1) endPos = value.length;

      const selectedBlock = value.substring(startPos, endPos);
      const lines = selectedBlock.split("\n");

      if (e.shiftKey) {
        // 逆インデント
        const newLines = lines.map((l) => {
          if (l.startsWith("    ")) return l.substring(4);
          if (l.startsWith("\t")) return l.substring(1);
          return l.replace(/^ {1,3}/, "");
        });
        const replaced = newLines.join("\n");
        this.value = value.substring(0, startPos) + replaced + value.substring(endPos);
        this.selectionStart = startPos;
        this.selectionEnd = startPos + replaced.length;
      } else {
        // インデント追加
        const newLines = lines.map((l) => "    " + l);
        const replaced = newLines.join("\n");
        this.value = value.substring(0, startPos) + replaced + value.substring(endPos);
        this.selectionStart = startPos;
        this.selectionEnd = startPos + replaced.length;
      }
    } else {
      // 単一カーソル
      if (e.shiftKey) {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const line = value.substring(lineStart, start);
        if (line.startsWith("    ")) {
          this.value = value.substring(0, lineStart) + line.substring(4) + value.substring(start);
          this.selectionStart = this.selectionEnd = Math.max(lineStart, start - 4);
        }
      } else {
        this.value = value.substring(0, start) + "    " + value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
      }
    }
    updateEditorDecorations();
    triggerAutoSave();
    return;
  }

  // 4. Enter によるスマートインデント（コロン後の自動字下げ）
  if (e.key === "Enter") {
    e.preventDefault();
    const beforeCursor = value.substring(0, start);
    const lastNewline = beforeCursor.lastIndexOf("\n");
    const currentLine = beforeCursor.substring(lastNewline + 1);

    const indentMatch = currentLine.match(/^( +)/);
    let indent = indentMatch ? indentMatch[1] : "";

    if (currentLine.trim().endsWith(":")) {
      indent += "    ";
    }

    this.value = value.substring(0, start) + "\n" + indent + value.substring(end);
    this.selectionStart = this.selectionEnd = start + 1 + indent.length;
    updateEditorDecorations();
    triggerAutoSave();
    return;
  }

  // 5. 括弧・引用符のオートクローズ
  const pairs = {
    "(": ")",
    "{": "}",
    "[": "]",
    '"': '"',
    "'": "'",
  };

  if (pairs[e.key] !== undefined) {
    const openChar = e.key;
    const closeChar = pairs[openChar];

    // クォートの場合、直前がエスケープでなければスキップ等の考慮
    if (start !== end) {
      e.preventDefault();
      const selectedText = value.substring(start, end);
      this.value =
        value.substring(0, start) +
        openChar +
        selectedText +
        closeChar +
        value.substring(end);
      this.selectionStart = start + 1;
      this.selectionEnd = end + 1;
      updateEditorDecorations();
      triggerAutoSave();
      return;
    } else {
      // 閉じ記号のオーバータイプスキップ
      if (['"', "'", ")", "]", "}"].includes(openChar) && value.charAt(start) === openChar) {
        e.preventDefault();
        this.selectionStart = this.selectionEnd = start + 1;
        updateEditorDecorations();
        return;
      }
      e.preventDefault();
      this.value = value.substring(0, start) + openChar + closeChar + value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
      updateEditorDecorations();
      triggerAutoSave();
      return;
    }
  }

  // 閉じ括弧単体入力のスキップ
  const closeChars = [")", "}", "]", '"', "'"];
  if (closeChars.includes(e.key)) {
    if (start === end && value.charAt(start) === e.key) {
      e.preventDefault();
      this.selectionStart = this.selectionEnd = start + 1;
      updateEditorDecorations();
      return;
    }
  }

  // Backspace でのペア括弧削除
  if (e.key === "Backspace") {
    if (start === end && start > 0) {
      const charBefore = value.charAt(start - 1);
      const charAfter = value.charAt(start);
      if (pairs[charBefore] === charAfter) {
        e.preventDefault();
        this.value = value.substring(0, start - 1) + value.substring(start + 1);
        this.selectionStart = this.selectionEnd = start - 1;
        updateEditorDecorations();
        triggerAutoSave();
      }
    }
  }
});

// ==========================================
// ツールバーボタンのアクション
// ==========================================
if (resetCodeBtn) {
  resetCodeBtn.onclick = () => {
    const problem = codingProblems[currentCodingIndex];
    if (!problem) return;
    askConfirm({
      title: "コードのリセット確認",
      message: "入力中のコードを破棄し、初期問題テンプレートに戻しますか？<br/><span class='text-xs text-slate-500 mt-1 block'>※ブラウザに保存された下書きも初期状態にリセットされます。</span>",
      okText: "リセットする",
      cancelText: "キャンセル",
      type: "warning"
    }, () => {
      codeEditor.value = problem.template;
      saveCurrentDraft();
      updateEditorDecorations();
      notify("初期コードテンプレートにリセットしました。", "リセット完了", "info");
    });
  };
}

if (copyCodeBtn) {
  copyCodeBtn.onclick = () => {
    navigator.clipboard.writeText(codeEditor.value).then(() => {
      notify("コードをクリップボードにコピーしました！", "コピー成功", "info");
    }).catch(() => {
      notify("クリップボードへのコピーに失敗しました。", "エラー", "error");
    });
  };
}

if (keyboardShortcutsBtn && shortcutsModal && shortcutsModalClose) {
  keyboardShortcutsBtn.onclick = () => shortcutsModal.classList.remove("hidden");
  shortcutsModalClose.onclick = () => shortcutsModal.classList.add("hidden");
  shortcutsModal.onclick = (e) => {
    if (e.target === shortcutsModal) shortcutsModal.classList.add("hidden");
  };
}

function formatCode() {
  const lines = codeEditor.value.split("\n");
  let indentLevel = 0;
  const formattedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed === "") return "";

    if (
      trimmed.startsWith("return ") ||
      trimmed.startsWith("pass") ||
      trimmed.startsWith("elif ") ||
      trimmed.startsWith("else:") ||
      trimmed.startsWith("except ") ||
      trimmed.startsWith("finally:")
    ) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const indented = "    ".repeat(indentLevel) + trimmed;

    if (trimmed.endsWith(":") && !trimmed.startsWith("#")) {
      indentLevel++;
    }

    return indented;
  });

  codeEditor.value = formattedLines.join("\n");
  updateEditorDecorations();
}

formatBtn.onclick = () => {
  formatCode();
  triggerAutoSave();
};

function renderCodingSelect() {
  if (!codingSelect) return;
  codingSelect.innerHTML = codingProblems
    .map((ch, idx) => {
      const isCompleted = learningProgress.completedProblems.includes(ch.title);
      const statusPrefix = isCompleted ? "[済] " : "";
      const prefix = ch.isAiGenerated ? "[AI] " : "";
      const title = ch.title.replace(/^\[AI\]\s*/, "").replace(/^\d+\.\s*/, "");
      return `<option value="${idx}">${statusPrefix}${prefix}${title}</option>`;
    })
    .join("");

  codingSelect.onchange = (e) => {
    currentCodingIndex = parseInt(e.target.value, 10);
    showCodingProblem();
  };
  
  codingSelect.value = currentCodingIndex;
}

// ==========================================
// 問題一覧ドロワー (Problem Drawer)
// ==========================================
let currentDrawerFilter = "all";

function getDifficultyForProblem(problem) {
  if (!problem) return "intermediate";
  if (problem.difficulty) {
    const d = String(problem.difficulty).toLowerCase();
    if (d.includes("初級") || d.includes("beginner") || d.includes("easy")) return "beginner";
    if (d.includes("上級") || d.includes("advanced") || d.includes("hard")) return "advanced";
    if (d.includes("中級") || d.includes("intermediate") || d.includes("medium")) return "intermediate";
  }
  const t = (problem.title || "").toLowerCase();
  if (t.includes("初級") || t.includes("beginner")) return "beginner";
  if (t.includes("上級") || t.includes("advanced")) return "advanced";
  if (t.includes("中級") || t.includes("intermediate")) return "intermediate";
  return "intermediate";
}

function renderProblemDrawer() {
  if (!drawerProblemList) return;
  const searchQuery = (drawerSearchInput ? drawerSearchInput.value.trim().toLowerCase() : "");
  
  const completedCount = codingProblems.filter((p) =>
    learningProgress.completedProblems.includes(p.title)
  ).length;

  if (drawerProgressText) {
    drawerProgressText.textContent = `進捗: ${completedCount} / ${codingProblems.length} 問完了`;
  }

  const filtered = codingProblems.map((p, idx) => ({ ...p, originalIndex: idx })).filter((p) => {
    const isCompleted = learningProgress.completedProblems.includes(p.title);
    const diff = getDifficultyForProblem(p);

    if (currentDrawerFilter === "completed" && !isCompleted) return false;
    if (["beginner", "intermediate", "advanced"].includes(currentDrawerFilter) && diff !== currentDrawerFilter) return false;

    if (searchQuery) {
      const matchTitle = p.title.toLowerCase().includes(searchQuery);
      const matchDesc = p.description.toLowerCase().includes(searchQuery);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    drawerProblemList.innerHTML = `
      <div class="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
        一致する問題が見つかりませんでした。
      </div>
    `;
    return;
  }

  drawerProblemList.innerHTML = filtered
    .map((p) => {
      const isCompleted = learningProgress.completedProblems.includes(p.title);
      const isCurrent = p.originalIndex === currentCodingIndex;
      const cleanTitle = p.title.replace(/^\[AI\]\s*/, "").replace(/^\d+\.\s*/, "");
      const diff = getDifficultyForProblem(p);
      const diffLabel = diff === "beginner" ? "初級" : diff === "advanced" ? "上級" : "中級";
      const diffColor =
        diff === "beginner"
          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
          : diff === "advanced"
            ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
            : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300";

      return `
        <div
          onclick="selectProblemFromDrawer(${p.originalIndex})"
          class="p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
            isCurrent
              ? "bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800"
              : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
          }"
        >
          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                ${p.originalIndex + 1}. ${escapeHtml(cleanTitle)}
              </span>
              ${p.isAiGenerated ? '<span class="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded font-bold">AI</span>' : ""}
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${diffColor}">${diffLabel}</span>
              ${isCompleted ? '<span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">クリア済</span>' : '<span class="text-[10px] text-slate-400">未クリア</span>'}
            </div>
          </div>
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      `;
    })
    .join("");
}

window.selectProblemFromDrawer = function (index) {
  currentCodingIndex = index;
  showCodingProblem();
  if (problemDrawer) problemDrawer.classList.add("hidden");
};

if (openProblemDrawerBtn && problemDrawer && problemDrawerClose && problemDrawerBackdrop) {
  openProblemDrawerBtn.onclick = () => {
    renderProblemDrawer();
    problemDrawer.classList.remove("hidden");
  };
  problemDrawerClose.onclick = () => problemDrawer.classList.add("hidden");
  problemDrawerBackdrop.onclick = () => problemDrawer.classList.add("hidden");

  if (drawerSearchInput) {
    drawerSearchInput.oninput = renderProblemDrawer;
  }

  const filterBtns = document.querySelectorAll(".drawer-filter-btn");
  filterBtns.forEach((btn) => {
    btn.onclick = () => {
      filterBtns.forEach((b) => {
        b.className =
          "drawer-filter-btn px-2.5 py-1 rounded-md font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800";
      });
      btn.className = "drawer-filter-btn px-2.5 py-1 rounded-md font-semibold bg-indigo-600 text-white";
      currentDrawerFilter = btn.getAttribute("data-filter");
      renderProblemDrawer();
    };
  });
}

function showCodingProblem() {
  const problem = codingProblems[currentCodingIndex];
  
  if (codingSelect) renderCodingSelect();

  const displayTitle = problem.title.replace(/^\d+\.\s*/, "").replace(/^\[AI\]\s*/, "");
  codingChallengeTitle.textContent = displayTitle;
  
  const diff = getDifficultyForProblem(problem);
  const diffLabel = diff === "beginner" ? "初級" : diff === "advanced" ? "上級" : "中級";
  const diffColor =
    diff === "beginner"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
      : diff === "advanced"
        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300";

  codingChallengeDifficulty.innerHTML = `<span class="text-xs font-bold px-2.5 py-1 rounded-full ${diffColor}">${diffLabel}</span>`;
  codingChallengeDescription.innerHTML = DOMPurify.sanitize(marked.parse(problem.description));

  if (problem.isAiGenerated) {
    codingTypeBadge.classList.remove("hidden");
  } else {
    codingTypeBadge.classList.add("hidden");
  }

  // CLI問題（input使用）の場合に対話入力ボタンを表示
  if (cliInteractiveBtn) {
    if (problem.type === "cli") {
      cliInteractiveBtn.classList.remove("hidden");
    } else {
      cliInteractiveBtn.classList.add("hidden");
    }
  }

  // 下書きがあれば復元、なければ初期テンプレート (※古い解答コードが残っていた場合は初期テンプレートを優先)
  const drafts = getDraftsMap();
  const savedCode = drafts[problem.title];
  if (savedCode !== undefined && savedCode !== null && !savedCode.includes("plt.plot(months, sales, label=")) {
    codeEditor.value = savedCode;
  } else {
    codeEditor.value = problem.template;
  }

  updateEditorDecorations();
  testResults.innerHTML = `
    <div class="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
      「実行して採点」ボタンを押すと、自動評価テストが開始されます。
    </div>
  `;
  if (testSummaryBadge) {
    testSummaryBadge.textContent = "未実行";
    testSummaryBadge.className = "ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
  }
  if (stdoutCountBadge) stdoutCountBadge.classList.add("hidden");
  if (stdoutTerminal) stdoutTerminal.textContent = "標準出力ログはありません。";

  setActiveOutputTab("results");

  codingNextBtn.classList.add("hidden");
  aiHintPanel.classList.add("hidden");
  aiReviewPanel.classList.add("hidden");
  pyHintHistoryLogs = [];
}

// ==========================================
// Brython 実行エンジン ＆ テスト採点
// ==========================================
function checkPotentialInfiniteLoop(code) {
  const trimmed = code.replace(/\s+/g, "");
  if (
    trimmed.includes("whileTrue:") ||
    trimmed.includes("while1:") ||
    trimmed.includes("whileTrue(") ||
    trimmed.includes("while1(")
  ) {
    return true;
  }
  if (code.includes("while ") || code.includes("while(")) {
    if (!code.includes("break")) {
      return true;
    }
  }
  return false;
}

function runCodingTests() {
  const problem = codingProblems[currentCodingIndex];
  const userCode = codeEditor.value;

  const forbiddenPatterns = [
    "__import__",
    "eval(",
    "exec(",
    "open(",
    "import os",
    "import sys",
    "import subprocess",
    "import socket",
    "import shutil",
    "__subclasses__",
    "__builtins__",
    "__code__",
    "__globals__",
    "getattr",
    "setattr",
    "delattr",
    "compile(",
    "globals(",
    "locals(",
    "__class__",
    "__bases__",
    "__mro__",
  ];

  for (const pattern of forbiddenPatterns) {
    if (userCode.includes(pattern)) {
      setActiveOutputTab("results");
      testResults.innerHTML = `
            <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium">
              セキュリティ制限：安全性に関わる可能性のある表現が検出されたため、検証を中止しました。コードを修正してください。
            </div>`;
      return;
    }
  }

  executePythonTests(userCode, problem);
}

function executePythonTests(userCode, problem) {
  setActiveOutputTab("results");
  runBtn.disabled = true;
  runBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        検証中...
      `;
  testResults.innerHTML = `
        <div class="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm flex items-center gap-2 font-medium">
          コードの安全性を検証しています...
        </div>`;

  const testPayload = JSON.stringify({
    type: problem.type || "function",
    setup_code: problem.setup_code || "",
    test_cases: problem.test_cases || [],
  });

  try {
    let res = null;
    if (typeof window.run_python_tests !== "function") {
      throw new Error(
        "Python環境がまだ初期化されていません。少し待つか、ページを再読み込みしてください。",
      );
    }
    const resultStr = window.run_python_tests(userCode, testPayload);
    if (resultStr) {
      res = JSON.parse(resultStr);
    }
    runBtn.disabled = false;
    runBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          実行して採点
        `;

    // グラフデータのレンダリング
    if (res && res.chart) {
      renderPythonChart(res.chart);
    }

    // 標準出力の処理
    if (res && res.stdout && res.stdout.trim().length > 0) {
      stdoutTerminal.textContent = res.stdout;
      const stdoutLines = res.stdout.trim().split("\n").length;
      stdoutCountBadge.textContent = `${stdoutLines} 行`;
      stdoutCountBadge.classList.remove("hidden");
    } else {
      stdoutTerminal.textContent = "標準出力ログはありません。";
      stdoutCountBadge.classList.add("hidden");
    }

    if (res && res.error) {
      testSummaryBadge.textContent = "エラー";
      testSummaryBadge.className = "ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
      testResults.innerHTML = `
            <div class="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 rounded-lg text-sm">
              <strong class="block font-semibold mb-1">構文エラー / 実行時エラーが発生しました:</strong>
              <code class="block whitespace-pre-wrap bg-rose-100 dark:bg-rose-900/40 p-3 rounded text-xs mt-1 font-mono">${escapeHtml(res.error)}</code>
            </div>`;
      testResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    if (res && Array.isArray(res.tests)) {
      const total = res.tests.length;
      const passed = res.tests.filter((r) => r.pass).length;
      const score = passed / total;

      testSummaryBadge.textContent = `${passed}/${total} 合格`;
      testSummaryBadge.className = `ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
        passed === total
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
      }`;

      const hasStdout = res && res.stdout && res.stdout.trim().length > 0;
      const stdoutLines = hasStdout ? res.stdout.trim().split("\n").length : 0;
      const hasChart = res && res.chart;

      testResults.innerHTML = `
            <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">テスト通過結果: ${passed} / ${total} 通過</span>
                  ${hasStdout ? `<button onclick="setActiveOutputTab('stdout')" class="px-2 py-0.5 rounded text-[11px] bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center gap-1">📝 print出力 (${stdoutLines}行)</button>` : ""}
                  ${hasChart ? `<button onclick="setActiveOutputTab('plot')" class="px-2 py-0.5 rounded text-[11px] bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold transition-colors flex items-center gap-1">📊 グラフ出力を見る</button>` : ""}
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">全テストケースに合格するとクリアとなります</p>
              </div>
              <span class="text-xs font-bold px-3 py-1.5 rounded-full ${passed === total ? "bg-emerald-500 text-white shadow-sm" : "bg-rose-500 text-white"}">
                スコア: ${(score * 100).toFixed(0)}%
              </span>
            </div>
          `;

      res.tests.forEach((r) => {
        const passStyle = r.pass
          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
          : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40";
        const passTag = r.pass
          ? '<span class="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-md">PASS</span>'
          : '<span class="text-[11px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 rounded-md">FAIL</span>';

        // 失敗時のDiff比較ビュー
        let diffHtml = "";
        if (!r.pass) {
          diffHtml = `
            <div class="mt-2.5 pt-2.5 border-t border-rose-200/60 dark:border-rose-900/40 space-y-1.5 text-xs font-mono">
              <div class="diff-block diff-expected p-2 rounded">
                <span class="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">期待される戻り値 (Expected):</span>
                <span class="font-bold">${escapeHtml(r.expected)}</span>
              </div>
              <div class="diff-block diff-actual p-2 rounded">
                <span class="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block">実際の戻り値 (Actual):</span>
                <span class="font-bold">${r.error ? escapeHtml(r.error) : escapeHtml(r.actual ?? "(None / 未定義)")}</span>
              </div>
              <div class="pt-1 flex justify-end">
                <button
                  onclick="askAiAboutTestFailure(${r.index})"
                  class="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  なぜ間違えたかAIに聞く
                </button>
              </div>
            </div>
          `;
        }

        testResults.innerHTML += `
              <div class="test-card p-4 border rounded-xl ${passStyle} space-y-1.5 shadow-sm">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">テストケース ${r.index + 1}</span>
                  ${passTag}
                </div>
                <div class="text-xs font-mono">
                  <span class="opacity-75 text-slate-600 dark:text-slate-400">入力式:</span> <code class="bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">${escapeHtml(r.input)}</code>
                </div>
                ${r.pass ? `<div class="text-xs font-mono"><span class="opacity-75 text-slate-600 dark:text-slate-400">戻り値:</span> <code class="bg-emerald-100/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">${escapeHtml(r.actual)}</code></div>` : diffHtml}
              </div>
            `;
      });

      codingScores[currentCodingIndex] = score;

      // 全テスト合格時の祝賀
      if (score === 1) {
        if (typeof window.confetti === "function") {
          window.confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.65 },
          });
        }
        const pTitle = problem.title;
        if (!learningProgress.completedProblems.includes(pTitle)) {
          learningProgress.completedProblems.push(pTitle);
          if (problem.isAiGenerated) {
            learningProgress.aiChallengesCleared += 1;
          }
          saveProgress();
          if (codingSelect) renderCodingSelect();
        }
      }

      codingNextBtn.classList.remove("hidden");
      testResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  } catch (err) {
    runBtn.disabled = false;
    runBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          実行して採点
        `;
    testResults.innerHTML = `
          <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm">
            <strong class="block font-semibold mb-1">評価システム実行エラー:</strong>
            <span class="block text-xs font-mono bg-rose-100 p-2 rounded mt-1">${escapeHtml(err.message || err)}</span>
          </div>`;
    testResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// 対話型入力（input()）手動テスト実行
if (cliInteractiveBtn) {
  cliInteractiveBtn.onclick = () => {
    const userCode = codeEditor.value;
    if (!userCode.trim()) {
      notify("実行するコードを入力してください。", "warning");
      return;
    }

    saveCurrentDraft();

    if (typeof window.run_python_interactive !== "function") {
      notify("Python実行エンジンを初期化中です。少々お待ちください...", "warning");
      return;
    }

    try {
      const resRaw = window.run_python_interactive(userCode);
      const res = JSON.parse(resRaw);

      if (stdoutTerminal) {
        if (res.error) {
          stdoutTerminal.textContent = (res.stdout ? res.stdout + "\n" : "") + "エラー:\n" + res.error;
        } else if (res.stdout && res.stdout.trim()) {
          stdoutTerminal.textContent = res.stdout;
        } else {
          stdoutTerminal.textContent = "(出力はありませんでした)";
        }
      }

      if (stdoutCountBadge) {
        const lines = (res.stdout || "").trim().split("\n").filter(Boolean).length;
        stdoutCountBadge.textContent = `${lines} 行`;
        stdoutCountBadge.classList.remove("hidden");
      }

      setActiveOutputTab("stdout");

      if (res.error) {
        notify("実行中にエラーが発生しました。標準出力ログを確認してください。", "error");
      } else {
        notify("対話入力による実行が完了しました。標準出力タブをご確認ください。", "success");
      }
    } catch (err) {
      console.error(err);
      notify("対話実行エラー: " + err.message, "error");
    }
  };
}

// 失敗テストケースに対するピンポイントAI相談
window.askAiAboutTestFailure = async function (testIndex) {
  const problem = codingProblems[currentCodingIndex];
  const testCase = problem.test_cases[testIndex];
  const userCode = codeEditor.value;

  aiHintContent.innerHTML =
    '<span class="animate-pulse text-indigo-500 font-bold">AIがこのテストケースの失敗原因を分析しています...</span>';
  aiHintPanel.classList.remove("hidden");
  aiReviewPanel.classList.add("hidden");
  aiHintPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const systemPrompt = `あなたはPython初学者に優しく教える家庭教師AIです。
生徒のコードが特定のテストケースで不合格になりました。
なぜこのテストケース（入力: ${testCase.input}、期待値: ${testCase.expected}）で失敗したのか、コードのどこに着目して直せばよいかを優しく段階的に日本語で解説してください。
直接の答えコードを丸写しさせるのではなく、考え方のヒントを教えてください。`;

  const userPrompt = `【問題】: ${problem.title}
【失敗したテストケース】:
- 呼び出し: ${testCase.input}
- 期待された値: ${testCase.expected}

【生徒の現在のコード】:
\`\`\`python
${userCode}
\`\`\`

失敗した理由と修正の考え方を初心者向けにわかりやすく解説してください。`;

  try {
    let aiResponseText = "";
    await callGeminiStream(systemPrompt, userPrompt, (fullText) => {
      aiResponseText = fullText;
      aiHintContent.innerHTML = sanitizeHtml(marked.parse(fullText));
    });
  } catch (err) {
    notify(`${err.message}`, "AIエラー分析失敗", "error");
  }
};

function nextCodingProblem() {
  currentCodingIndex++;
  if (currentCodingIndex < codingProblems.length) {
    showCodingProblem();
  } else {
    showCodingResult();
  }
}

function showCodingResult() {
  document.getElementById("coding-quiz-container").classList.add("hidden");
  codingResultContainer.classList.remove("hidden");

  const totalScore = codingScores.reduce((a, b) => a + (b || 0), 0);
  const maxScore = codingProblems.length;
  const avgScore = (totalScore / maxScore) * 100;

  if (avgScore >= 80 && typeof window.confetti === "function") {
    window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  }

  codingResultContainer.innerHTML = `
        <div class="text-center space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">コーディングテスト 総合結果</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">お疲れ様でした！全プログラミングミッションが終了しました。</p>
          <div class="flex justify-center gap-8 mt-4">
            <div class="text-center">
              <span class="block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">${totalScore.toFixed(1)} / ${maxScore}</span>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">合計スコア</span>
            </div>
            <div class="text-center">
              <span class="block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">${avgScore.toFixed(0)}%</span>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">総合達成率</span>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100">各設問の個別達成状況</h4>
          <ul class="space-y-2 max-h-96 overflow-y-auto pr-2">
            ${codingScores
              .map(
                (score, i) => `
              <li class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg">
                <span class="font-medium text-slate-700 dark:text-slate-200 text-sm sm:text-base">${escapeHtml(codingProblems[i].title)}</span>
                <span class="text-sm font-bold px-3 py-1 rounded-full ${score === 1 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"}">
                  達成率: ${(score * 100).toFixed(0)}%
                </span>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
        <div class="pt-6 flex justify-center">
          <button onclick="location.reload()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-colors">
            もう一度挑戦する
          </button>
        </div>
      `;
}

runBtn.onclick = runCodingTests;
codingNextBtn.onclick = nextCodingProblem;

// ==========================================
// Gemini 3.7 Flash API 連携ロジック
// ==========================================
const defaultDefaultKey = "";

function getGeminiUrl() {
  const savedKey = localStorage.getItem("gemini_api_key");
  const activeKey = savedKey ? savedKey.trim() : defaultDefaultKey;
  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${activeKey}`,
    hasKey: !!activeKey,
  };
}

async function callGeminiStream(systemPrompt, userPromptOrContents, onChunk) {
  const apiConfig = getGeminiUrl();
  const streamUrl =
    apiConfig.url.replace(":generateContent", ":streamGenerateContent") +
    "&alt=sse";

  if (!apiConfig.hasKey)
    throw new Error("Gemini APIキーが設定されていません。");

  // contentsが配列で渡された場合はマルチターン会話として使用
  const contents = Array.isArray(userPromptOrContents)
    ? userPromptOrContents
    : [{ role: "user", parts: [{ text: userPromptOrContents }] }];

  const payload = {
    contents,
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
          const textPart =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          fullText += textPart;
          if (onChunk) onChunk(fullText);
        } catch (e) {}
      }
    }
  }
  return fullText;
}

async function callGemini(
  systemPrompt,
  userPrompt,
  isJson = false,
  responseSchema = null,
) {
  const apiConfig = getGeminiUrl();

  if (!apiConfig.hasKey) {
    apiKeyPanel.classList.remove("hidden");
    throw new Error(
      "Gemini APIキーが設定されていません。ヘッダーの「APIキー設定」から、ご自身のAPIキーを入力してください。",
    );
  }

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
  };

  if (isJson) {
    payload.generationConfig = {
      responseMimeType: "application/json",
    };
    if (responseSchema) {
      payload.generationConfig.responseSchema = responseSchema;
    }
  }

  let delay = 1000;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(apiConfig.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 403) {
          throw new Error(
            "APIキーが無効であるか、アクセス権限がありません。入力したキーが正しいか確認してください。",
          );
        }
        if (response.status === 404) {
          throw new Error(
            "指定されたGemini 3.7 Flashモデルが見つかりません。APIアクセス権が有効かご確認ください。",
          );
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error("応答内容が空です。");
      }
      return textResponse;
    } catch (error) {
      if (
        error.message.includes("APIキー") ||
        error.message.includes("404") ||
        attempt === 4
      ) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

const aiLoadingScreen = document.getElementById("ai-loading-screen");
const aiLoadingTitle = document.getElementById("ai-loading-title");
const aiLoadingDesc = document.getElementById("ai-loading-desc");

function showAiLoader(title, description) {
  aiLoadingTitle.textContent = title;
  aiLoadingDesc.textContent = description;
  aiLoadingScreen.classList.remove("hidden");
}

function hideAiLoader() {
  aiLoadingScreen.classList.add("hidden");
}

// ==========================================
// トピック＆難易度別生成バンク
// ==========================================
const categorizedQuizTopics = {
  beginner: [
    "変数宣言と不変オブジェクト",
    "if文を用いた条件判定",
    "forループと基本範囲関数(range)",
    "関数の基本戻り値(Noneなど)",
    "リスト(list)の追加・スライス操作",
    "論理演算子(and/or/not)",
    "標準出力(print)とフォーマット文字列(f-string)",
    "文字列メソッド(split, join, replace, upper)",
    "リストとタプル(tuple)の性質の違いと使い分け",
    "型変換(int, float, str, bool)の挙動",
    "演算子の優先順位と計算順序",
    "辞書(dict)の基本的なキー・バリュー操作",
  ],
  intermediate: [
    "リスト内包表記(List Comprehensions)",
    "基本例外処理(try-except-finally)",
    "辞書(dict)と集合(set)の積集合・差集合操作",
    "可変長引数(*args, **kwargs)とアンパック",
    "lambda(無名関数)と組み込み高階関数(map, filter)",
    "コンテキストマネージャとwith文による安全なファイル入出力",
    "標準モジュール(datetime, math)の活用",
    "ジェネレータオブジェクトとyield文によるメモリ節約",
    "正規表現(reモジュール)を用いたパターンマッチング",
    "クラスの継承とsuper()の役割",
    "名前空間と変数のスコープ(LEGBルール)",
    "モジュールとパッケージのインポート仕様",
  ],
  advanced: [
    "クラスの多重継承とメソッド解決順序(MRO)",
    "デコレータ(@decorator)の実装とネスト",
    "特殊メソッド(__str__, __repr__, __call__, __eq__)の実装",
    "カスタムコンテキストマネージャ(__enter__, __exit__)の設計",
    "抽象クラス(abc.ABC)と多態性(Polymorphism)",
    "メタクラス(__metaclass__)の利用と動的クラス生成",
    "非异步処理(asyncioモジュールとasync/await)",
    "特殊デコレータ(@property, @classmethod, @staticmethod)の正確な使い分け",
    "デスクリプタ(Descriptor)プロトコルの理解と実装",
    "Pythonのメモリ管理とガベージコレクション(参照カウント)",
    "GIL(Global Interpreter Lock)の仕組みとマルチスレッドの制約",
    "weakref(弱参照)を用いたキャッシュ機構の理解",
  ],
};

const categorizedCodingTopics = {
  beginner: [
    "【関数】引数を反転して返す文字列処理",
    "【関数】リスト内の偶数値のみのフィルタリングと和の算出",
    "【関数】基本FizzBuzzゲーム関数の実装",
    "【math】mathライブラリを使った2点間距離・平方根・円周計算",
    "【datetime】2つの日付の経過日数差分の計算 (datetime.date)",
    "【itertools】itertools.accumulate による累積和リスト生成",
    "【random】randomモジュールを使ったサイコロ抽選・ランダム選択",
    "【対話CLI】input()で名前を受け取り挨拶するCLIプログラム",
    "【対話CLI】input()で年齢を受け取り成人/未成年判定",
    "【対話CLI】input()で2つの数値を入力して四則演算する計算機",
    "【可視化】Matplotlibで月別売上の折れ線グラフを描画 (plt.plot)",
    "【可視化】Matplotlibで果物の売上個数の棒グラフを描画 (plt.bar)",
  ],
  intermediate: [
    "【re】reモジュールを使ったメールアドレスやURLの正規表現バリデーション",
    "【re】re.findall を使ったテキスト内からの電話番号・郵便番号抽出",
    "【datetime】datetimeとtimedeltaを用いた指定日数後の日付フォーマット変換",
    "【collections】collections.Counter を用いた文章内最頻出単語トップN抽出",
    "【collections】collections.defaultdict を用いたカテゴリ別データグループ化",
    "【collections】collections.deque を用いた固定長ローリングバッファ処理",
    "【json】jsonモジュールを使った売上データのパースと集計処理",
    "【statistics】statisticsモジュールを使った平均・中央値・標準偏差の算出",
    "【urllib.parse】urllib.parse を使ったURLクエリパラメータの辞書化と解析",
    "【base64】base64モジュールを用いた文字列のエンコード/デコード処理",
    "【関数】文章内の単語出現頻度をカウントして辞書で返す関数",
    "【関数】独自例外(ValueError)を適切にraiseする入力値検証",
    "【関数】再帰関数を用いたフィボナッチ数列や最大公約数(GCD)計算",
    "【対話CLI】input()で身長と体重を受け取りBMIを計算・診断するCLI",
    "【対話CLI】input()で買い物金額と所持金を受け取りお釣りを計算するレジCLI",
    "【可視化】Matplotlibで身長と体重の散布図を描画 (plt.scatter)",
    "【可視化】Matplotlibでアンケート回答割合の円グラフを描画 (plt.pie)",
  ],
  advanced: [
    "【itertools】itertools.combinations による合計指定ペアの全探索",
    "【itertools】itertools.permutations や product を用いた順列・直積全列挙",
    "【itertools】itertools.groupby を用いた連続同一要素の圧縮・集計",
    "【functools】functools.lru_cache を用いた再帰計算の高速メモ化",
    "【heapq】heapqモジュールを用いた大規模データからの最小K件の高速抽出",
    "【クラス設計】銀行口座クラス（預金・引出・残高照会・履歴管理）の設計",
    "【クラス設計】二分探索木(BST)や連結リストのクラス実装",
    "【デコレータ】関数の実行時間を計測・キャッシュするカスタムデコレータ",
    "【対話CLI】input()でコマンド（deposit, withdraw, balance）を受け取るATM対話型システム",
    "【可視化】Matplotlibで複数データ系列の比較折れ線グラフ・凡例付き描画",
    "【アルゴリズム】幅優先探索(BFS)または深さ優先探索(DFS)を用いた最短経路探索",
  ],
};

const difficultyLabels = {
  beginner: "初級 (Beginner)",
  intermediate: "中級 (Intermediate)",
  advanced: "上級 (Advanced)",
};

// ==========================================
// AI問題生成処理 (Gemini 3.7 Flash)
// ==========================================
const aiQuizTopicInput = document.getElementById("ai-quiz-topic");
const aiQuizDifficultySelect = document.getElementById("ai-quiz-difficulty");
const aiQuizGenerateBtn = document.getElementById("ai-quiz-generate-btn");

if (aiQuizGenerateBtn) {
  aiQuizGenerateBtn.onclick = async () => {
    if (aiQuizGenerateBtn.disabled) return;
    aiQuizGenerateBtn.disabled = true;
    let topic = aiQuizTopicInput.value.trim();
    let difficulty = aiQuizDifficultySelect.value;

    if (difficulty === "random") {
      const levels = ["beginner", "intermediate", "advanced"];
      difficulty = levels[Math.floor(Math.random() * levels.length)];
    }

    if (!topic) {
      const pool = categorizedQuizTopics[difficulty];
      topic = pool[Math.floor(Math.random() * pool.length)];
    }

    const label = difficultyLabels[difficulty];
    showAiLoader(
      "AIクイズを作成中...",
      `Gemini 3.7 Flashが「${label}」レベルのテーマ「${topic}」に関する深い知識を問うハイクオリティな問題を作成しています。`,
    );

    let difficultyPromptConstraint = "";
    if (difficulty === "beginner") {
      difficultyPromptConstraint =
        "Pythonの基本概念、初級文法、初学者がつまずきやすい落とし穴に焦点を当てた、難しすぎない問題にしてください。";
    } else if (difficulty === "intermediate") {
      difficultyPromptConstraint =
        "標準ライブラリの適切な組み合わせ、リスト内包表記の挙動、エラーを適切にハンドルする作法など、ある程度実務で見かける応用的な問題にしてください。";
    } else {
      difficultyPromptConstraint =
        "Pythonの内部構造、言語仕様(MRO、特殊メソッド、非同期処理の仕組み、デコレータ、メモリ管理)など、熟練者でも一瞬迷うような非常に高い完成度・深さの問題にしてください。";
    }

    const systemPrompt = `あなたは優秀なPythonプログラミング講師です。
提示された難易度レベルに【100%厳格に合致する】、Python知識を問う高品質な4択クイズを日本語で1問作成してください。
安易に正解できる問題ではなく、コードの実行結果を注意深く推測する必要がある問題を作ってください。`;

    const userPrompt = `難易度: ${label}
対象トピック: ${topic}
難易度設計基準: ${difficultyPromptConstraint}

この情報を元に、4択クイズ（問題文、選択肢4つ、その中の1つが完全一致する正解文字列）を1問作成し、指定のJSON形式で返してください。`;

    const quizSchema = {
      type: "OBJECT",
      properties: {
        question: {
          type: "STRING",
          description:
            "クイズの問題文。ソースコードを含む場合はマークダウンのコードブロック(```)等で整形してください。",
        },
        options: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "4つの明確に異なる選択肢テキストのリスト",
        },
        correctAnswer: {
          type: "STRING",
          description:
            "optionsリストの要素のいずれかと一字一句完全に一致する正解のテキスト",
        },
      },
      required: ["question", "options", "correctAnswer"],
    };

    try {
      const jsonText = await callGemini(
        systemPrompt,
        userPrompt,
        true,
        quizSchema,
      );
      const parsedQuiz = JSON.parse(jsonText);

      const shuffledOptions = shuffleArray(parsedQuiz.options);
      const correctIndex = shuffledOptions.indexOf(parsedQuiz.correctAnswer);

      let finalCorrectIndex = correctIndex;
      if (correctIndex === -1) {
        shuffledOptions.push(parsedQuiz.correctAnswer);
        finalCorrectIndex = shuffledOptions.length - 1;
      }

      const newQuestion = {
        question: `[AI生成 - ${label}] ${parsedQuiz.question ? parsedQuiz.question.replace(/\\n/g, "\n") : ""}`,
        options: shuffledOptions,
        correctIndex: finalCorrectIndex,
        correctAnswer: parsedQuiz.correctAnswer,
        isAiGenerated: true,
      };

      quizQuestions = [newQuestion, ...quizQuestions];
      currentQuizIndex = 0;
      quizScore = 0;
      quizUserAnswers = [];

      quizResultContainer.classList.add("hidden");
      document.getElementById("quiz-container").classList.remove("hidden");
      showQuizQuestion();

      aiQuizTopicInput.value = "";
    } catch (err) {
      notify(`${err.message}`, "AIクイズ生成失敗", "error");
    } finally {
      hideAiLoader();
      aiQuizGenerateBtn.disabled = false;
    }
  };
}

// ==========================================
// AIコーディング問題生成処理 (Gemini 3.7 Flash)
// ==========================================
const aiCodingTopicInput = document.getElementById("ai-coding-topic");
const aiCodingDifficultySelect = document.getElementById("ai-coding-difficulty");
const aiCodingTypeSelect = document.getElementById("ai-coding-type");
const aiCodingGenerateBtn = document.getElementById("ai-coding-generate-btn");

if (aiCodingGenerateBtn) {
  aiCodingGenerateBtn.onclick = async () => {
    if (aiCodingGenerateBtn.disabled) return;
    aiCodingGenerateBtn.disabled = true;
    let topic = aiCodingTopicInput.value.trim();
    let difficulty = aiCodingDifficultySelect.value;
    let selectedType = aiCodingTypeSelect ? aiCodingTypeSelect.value : "auto";

    if (difficulty === "random") {
      const levels = ["beginner", "intermediate", "advanced"];
      difficulty = levels[Math.floor(Math.random() * levels.length)];
    }

    if (!topic) {
      const pool = categorizedCodingTopics[difficulty];
      topic = pool[Math.floor(Math.random() * pool.length)];
    }

    const label = difficultyLabels[difficulty];
    showAiLoader(
      "AI課題をビルド中...",
      `Gemini 3.7 Flashが「${label}」難易度に適したテーマ「${topic}」に基づく、自動評価テスト付きコーディング問題を設計しています。`,
    );

    let difficultyPromptConstraint = "";
    if (difficulty === "beginner") {
      difficultyPromptConstraint =
        "初心者向け。基本文法、単純な計算、基本的なループやif条件分岐、初歩的なinput対話や基本グラフ(折れ線/棒グラフ)などを対象とします。";
    } else if (difficulty === "intermediate") {
      difficultyPromptConstraint =
        "中級者向け。データ構造、標準ライブラリ（math, datetime, re, random, collections等）の活用、少し複雑なinput対話計算CLI、散布図や円グラフなどのMatplotlib可視化などを対象とします。";
    } else {
      difficultyPromptConstraint =
        "上級者向け。クラス設計、特殊メソッド、デコレータ、高度アルゴリズム、複数系列グラフのカスタマイズ、複合コマンド対話型システムなどを対象とします。";
    }

    let typeConstraint = "";
    if (selectedType === "function") {
      typeConstraint = "問題タイプは必ず「function」（関数・クラス・アルゴリズム・標準ライブラリ活用）にしてください。";
    } else if (selectedType === "cli") {
      typeConstraint = "問題タイプは必ず「cli」（input() による対話入力と print() による出力検証）にしてください。";
    } else if (selectedType === "plot") {
      typeConstraint = "問題タイプは必ず「plot」（matplotlib.pyplot によるグラフ描画・データ可視化）にしてください。";
    } else {
      typeConstraint = "テーマの内容に応じて、最も適した問題タイプ（'function', 'cli', 'plot' のいずれか）を柔軟に選択してください。";
    }

    const systemPrompt = `あなたは非常に優秀なPython教育試験設計士です。
ユーザーが指定するテーマ・難易度・問題タイプに完全に合致したコーディング問題を1問作成してください。

【問題タイプ（type）と評価ルール】
1. 'function' (通常の関数・クラス・標準ライブラリ問題):
   - 関数の引数と戻り値、またはクラスの動作を検証します。
   - math, datetime, re, random, collections などの標準ライブラリを活用する問題も大歓迎です。
   - test_cases: 各ケースに 'input' (関数呼び出し式: 例 'calc(10, 20)') と 'expected' (期待される戻り値文字列: 例 '30' や '[1, 2]') を設定。

2. 'cli' (input() と print() を使った対話型CLI問題):
   - ユーザーから input() で1つ以上の入力を受け取り、処理結果を print() で標準出力する問題です。
   - template: 出題用の雛形（コメントや書き出しフレームのみ。完成コードは書かないこと）。
   - test_cases: 各ケースに 'inputs' (input()に渡す文字列の配列: 例 ["Alice"]) と 'expected' (標準出力に含まれるべき期待値文字列: 例 "こんにちは、Aliceさん！") と 'match' ("contains" または "exact") を設定。

3. 'plot' (Matplotlibによるグラフ描画問題):
   - matplotlib.pyplot (plt.plot, plt.bar, plt.scatter, plt.pie など) を用いてデータを可視化し、plt.show() する問題です。
   - template: 描画対象データ定義とコメントのみ（例: 'import matplotlib.pyplot as plt\\n\\nmonths = ["4月", "5月", "6月"]\\nsales = [100, 200, 150]\\n# ここにグラフ描画コードを書いてください\\n'）。※plt.plotなどの描画コード自体は生徒に書かせるためtemplateには含めないこと。
   - test_cases: 各ケースに 'check' ('type'|'title'|'labels'|'first_dataset_data'|'datasets_count') と 'expected' (期待値) と 'input_label' (日本語の検証項目名) を設定。
     - check="type": expected="line"|"bar"|"scatter"|"pie"
     - check="title": expected="グラフタイトル文字列"
     - check="labels": expected=["ラベル1", "ラベル2"]
     - check="first_dataset_data": expected=[100, 200, 150]

【重要】
- templateプロパティには「答えそのもの」を絶対に含めないでください。生徒が自力でコードを書くための出題用雛形（関数定義やコメント、初期データ変数定義のみ）にしてください。
- descriptionはHTMLタグ（<p>, <code>, <ul>, <li>, <h3>等）を使用して見やすく記述してください。`;

    const userPrompt = `難易度: ${label}
指定テーマ: ${topic}
難易度規約: ${difficultyPromptConstraint}
タイプ指定: ${typeConstraint}

指定のJSONスキーマに従って、高品質な問題データを出力してください。`;

    const codingSchema = {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "課題のタイトル（例: 【対話型CLI】簡単計算機、日時差分計算関数、月別売上折れ線グラフ）",
        },
        type: {
          type: "STRING",
          description: "問題タイプ: 'function' (関数/標準ライブラリ), 'cli' (input/print対話型), 'plot' (Matplotlibグラフ可視化)",
        },
        difficulty: {
          type: "STRING",
          description: "難易度: '初級', '中級', '上級'",
        },
        description: {
          type: "STRING",
          description: "HTML形式の詳細な問題説明。実装すべき仕様や計算手順を分かりやすく解説。",
        },
        template: {
          type: "STRING",
          description: "出題用スターターコード（複数行）。解答コードそのものは含めず、書き始めの雛形を提供すること。",
        },
        setup_code: {
          type: "STRING",
          description: "テストケース実行前に評価される準備用のPythonコード（不要な場合は空文字列とする）",
        },
        test_cases: {
          type: "ARRAY",
          description: "自動評価用のテストケース一覧（3〜5件）",
          items: {
            type: "OBJECT",
            properties: {
              input: { type: "STRING", description: "関数呼び出し式（function用）" },
              expected: { type: "STRING", description: "期待される戻り値や検証値" },
              inputs: { type: "ARRAY", items: { type: "STRING" }, description: "input()へ渡す入力値の配列（cli用）" },
              match: { type: "STRING", description: "照合モード: 'contains' または 'exact'（cli用）" },
              check: { type: "STRING", description: "グラフ検証項目: 'type'|'title'|'labels'|'first_dataset_data'|'datasets_count'（plot用）" },
              input_label: { type: "STRING", description: "検証項目の日本語説明（plot用）" },
            },
          },
        },
      },
      required: ["title", "type", "difficulty", "description", "template", "test_cases"],
    };

    try {
      const jsonText = await callGemini(
        systemPrompt,
        userPrompt,
        true,
        codingSchema,
      );
      const parsedProblem = JSON.parse(jsonText);

      // 1. タイプと難易度の正規化
      const pType = ["cli", "plot", "function"].includes(parsedProblem.type) ? parsedProblem.type : "function";
      let pDiff = parsedProblem.difficulty || label.slice(0, 2);
      if (!["初級", "中級", "上級"].includes(pDiff)) {
        pDiff = difficulty === "beginner" ? "初級" : difficulty === "advanced" ? "上級" : "中級";
      }

      // 2. 改行コードの正規化処理
      let cleanTemplate = parsedProblem.template
        ? parsedProblem.template.replace(/\\n/g, "\n").replace(/\r\n/g, "\n")
        : "";

      if (!cleanTemplate.includes("\n")) {
        if (pType === "cli") {
          cleanTemplate = `# input() で値を受け取り、処理結果を出力してください\n# ここにコードを書いてください\n`;
        } else if (pType === "plot") {
          cleanTemplate = `import matplotlib.pyplot as plt\n\n# ここにグラフ描画コードを書いてください\n`;
        } else {
          cleanTemplate = `${cleanTemplate}\n    # ここにコードを記述してください\n    pass\n`;
        }
      }

      // 3. テストケースの正規化
      const cleanTestCases = Array.isArray(parsedProblem.test_cases)
        ? parsedProblem.test_cases.map((tc) => {
            if (pType === "cli") {
              return {
                inputs: Array.isArray(tc.inputs) ? tc.inputs.map(String) : [String(tc.input || "")],
                expected: String(tc.expected || ""),
                match: tc.match || "contains",
              };
            } else if (pType === "plot") {
              let exp = tc.expected;
              if (typeof exp === "string") {
                try { exp = JSON.parse(exp); } catch (_) {}
              }
              return {
                check: tc.check || "type",
                expected: exp,
                input_label: tc.input_label || `グラフ検証: ${tc.check || "type"}`,
              };
            } else {
              let exp = tc.expected;
              if (typeof exp === "string") {
                let s = exp.trim();
                while (
                  (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) ||
                  (s.length >= 2 && s.startsWith('"') && s.endsWith('"'))
                ) {
                  s = s.slice(1, -1).trim();
                }
                exp = s;
              }
              return {
                input: tc.input || "",
                expected: exp,
              };
            }
          })
        : [];

      const newProblem = {
        title: `[AI生成 - ${pDiff}] ${parsedProblem.title.replace(/^\[.*?\]\s*/, "")}`,
        type: pType,
        difficulty: pDiff,
        description: parsedProblem.description
          ? parsedProblem.description.replace(/\\n/g, "\n")
          : "",
        template: cleanTemplate,
        setup_code: parsedProblem.setup_code
          ? parsedProblem.setup_code.replace(/\\n/g, "\n")
          : "",
        test_cases: cleanTestCases,
        isAiGenerated: true,
      };

      codingProblems = [newProblem, ...codingProblems];
      currentCodingIndex = 0;
      codingScores = [];

      codingResultContainer.classList.add("hidden");
      document.getElementById("coding-quiz-container").classList.remove("hidden");
      showCodingProblem();

      aiCodingTopicInput.value = "";
      notify(`AI問題「${newProblem.title}」を生成しました`, "success");
    } catch (err) {
      notify(`${err.message}`, "AI課題生成失敗", "error");
    } finally {
      hideAiLoader();
      aiCodingGenerateBtn.disabled = false;
    }
  };
}

// ==========================================
// AIヒント機能（省略化JSON履歴・高速マルチターン対応）
// ==========================================
let pyHintHistoryLogs = [];

function summarizeAdviceText(text) {
  if (!text) return "";
  let clean = text
    .replace(/```[\s\S]*?```/g, "[コード例]")
    .replace(/<[^>]+>/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/[\r\n]+/g, " ")
    .trim();
  if (clean.length > 200) {
    clean = clean.slice(0, 197) + "...";
  }
  return clean;
}

if (aiHintBtn) {
  aiHintBtn.onclick = async () => {
    const problem = codingProblems[currentCodingIndex];
    const userCode = codeEditor.value;

    aiHintContent.innerHTML =
      '<span class="animate-pulse text-indigo-500 font-bold">AIがコードを分析し、タイピングしています...</span>';
    aiHintPanel.classList.remove("hidden");
    aiReviewPanel.classList.add("hidden");
    aiHintPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const systemPrompt = `あなたはプログラミングを始めたばかりの超初心者（forやifの使い方もまだよくわかっていない生徒）に、優しく伴走するPythonの家庭教師AIです。
これは連続する指導セッションです。過去の指導履歴（JSON形式）を参照し、生徒の進歩を認めつつ、次のステップを指導してください。

以下の【絶対ルール】を厳守して指導してください。
1. 直接の解答コード（生徒がコピー＆ペーストしてそのまま動く答え）は絶対に教えてはいけません。
2. 生徒がこの課題を解くために「何を使えばよいか（for, if などの構文や、len() などの基本的な関数）」を優しく教えてください。
3. その構文や関数の「一般的な書き方（構文のテンプレート例）」を、今回の問題に依存しない一般的なプレースホルダーを使った形で親切に教えてあげてください。
4. バグがあれば、何行目で何が起きているかを小学生でもわかるように優しく日本語で解説し、考え方のステップをナビゲートしてください。
5. 過去の指導からコードが改善されている場合は、具体的にどこが良くなったかを褒めてから、次の改善点を指摘してください。`;

    let userPrompt = "";

    if (pyHintHistoryLogs.length === 0) {
      userPrompt = `【問題タイトル】: ${problem.title}
【問題文】: ${problem.description}
【期待するテストケース例】: ${JSON.stringify(problem.test_cases)}

【生徒が現在記述した解答コード】:
\`\`\`python
${userCode}
\`\`\`

この情報を元に、超初心者に向けた丁寧なアドバイスをMarkdown形式の日本語で作成してください。`;
    } else {
      const historyJson = JSON.stringify(pyHintHistoryLogs, null, 2);
      userPrompt = `【問題タイトル】: ${problem.title}
【問題文】: ${problem.description}

【これまでの指導履歴（JSON形式・省サイズ）】:
\`\`\`json
${historyJson}
\`\`\`

【生徒が現在記述した最新の解答コード】:
\`\`\`python
${userCode}
\`\`\`

これまでの指導履歴（JSON）と現在の最新コードを比較し、生徒のコードの改善点を具体的に褒めた上で、次に修正すべきポイントやヒントを簡潔にMarkdown形式でアドバイスしてください。`;
    }

    try {
      let aiResponseText = "";
      await callGeminiStream(systemPrompt, userPrompt, (fullText) => {
        aiResponseText = fullText;
        aiHintContent.innerHTML = sanitizeHtml(marked.parse(fullText));
      });

      // 指導履歴に省略化JSONオブジェクトとして記録
      pyHintHistoryLogs.push({
        turn: pyHintHistoryLogs.length + 1,
        submittedCode: userCode.length > 250 ? userCode.slice(0, 247) + "..." : userCode,
        adviceSummary: summarizeAdviceText(aiResponseText),
      });
    } catch (err) {
      notify(`${err.message}`, "AIヒント取得失敗", "error");
    }
  };
}

// ==========================================
// AIレビュー＆模範解答機能 (事前テスト検証対応)
// ==========================================
if (aiReviewBtn) {
  aiReviewBtn.onclick = async () => {
    const problem = codingProblems[currentCodingIndex];
    const userCode = codeEditor.value;

    aiReviewContent.innerHTML =
      '<span class="animate-pulse text-purple-500 font-bold">AIがコードを分析し、タイピングしています...</span>';
    aiReviewPanel.classList.remove("hidden");
    aiHintPanel.classList.add("hidden");
    aiReviewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // テストケースから評価対象の関数名を特定
    let targetFnName = "solution";
    if (problem.test_cases && problem.test_cases.length > 0 && problem.test_cases[0].input) {
      const match = problem.test_cases[0].input.match(/^([a-zA-Z_]\w*)\s*\(/);
      if (match) targetFnName = match[1];
    }

    const systemPrompt = `あなたはシニアPythonエンジニアであり、素晴らしい技術指導者です。
【最優先絶対ルール】
1. 模範解答コードブロック（\`\`\`python ... \`\`\`）内の関数名は、必ず「${targetFnName}」という名称で正確に定義してください。異なる関数名を使うと自動採点でエラーになります。
2. 提示されたすべてのテストケース（型チェックによるTypeErrorのraise指定を含む）に100%合格する、完全かつ動作可能なコード例を提示してください。
3. コードプレースホルダー（passやTODOなど）を含めず、そのままコピー＆ペーストして採点実行が通る完成コードにしてください。
4. 解答コードブロックは必ずマークダウン（\`\`\`python）で記述してください。`;

    const userPrompt = `【課題タイトル】: ${problem.title}
【課題説明】: ${problem.description}
【検証される関数名】: ${targetFnName}
【期待されるアサーションテスト】: ${JSON.stringify(problem.test_cases)}

【生徒が現在書いた解答コード】:
\`\`\`python
${userCode}
\`\`\`

この情報を元に、以下の3つの構成でMarkdown形式の丁寧なレビューを行ってください。
1. **生徒のコードの評価・アドバイス**: 良かった点、リファクタリングできる点、バグがあればその指摘。
2. **もっとも洗練された模範解答コード例**: 関数名を「${targetFnName}」とし、全テストケースを通るPEP 8適合コード。
3. **計算量と設計のアプローチ解説**: なぜこの模範コードが優れているのか、計算量（O記法）も交えた技術解説。`;

    try {
      let fullText = "";
      await callGeminiStream(systemPrompt, userPrompt, (text) => {
        fullText = text;
        aiReviewContent.innerHTML = sanitizeHtml(marked.parse(text));
      });

      // 模範解答コードの自動バックグラウンド検証
      const codeMatch = fullText.match(/```python\s*([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        const modelCode = codeMatch[1].trim();
        if (window.run_python_tests) {
          const payload = JSON.stringify({
            setup_code: problem.setup_code || "",
            test_cases: problem.test_cases || [],
          });
          const testResRaw = window.run_python_tests(modelCode, payload);
          const testRes = JSON.parse(testResRaw);
          if (testRes && testRes.tests) {
            const passCount = testRes.tests.filter((t) => t.pass).length;
            const totalCount = testRes.tests.length;
            const verifyStatus = document.createElement("div");
            if (passCount === totalCount) {
              verifyStatus.className =
                "mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2";
              verifyStatus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 自動検証結果: この模範解答は全テストケース (${passCount}/${totalCount}) の合格を確認済みです。そのままコピー＆ペーストして実行・採点いただけます。`;
            } else {
              verifyStatus.className =
                "mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2";
              verifyStatus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> 検証結果: テスト合格 (${passCount}/${totalCount})。一部の前提条件に関する調整が必要な場合があります。`;
            }
            aiReviewContent.appendChild(verifyStatus);
          }
        }
      }
    } catch (err) {
      notify(`${err.message}`, "AIレビュー取得失敗", "error");
    }
  };
}

// ==========================================
// Django API クライアント設定 & 共通ヘルパー
// ==========================================
const DJANGO_API_BASE = "http://localhost:8000/api";
let currentUserId = localStorage.getItem("python_learner_id") || `user_${Math.random().toString(36).substring(2, 9)}`;
localStorage.setItem("python_learner_id", currentUserId);

async function apiRequest(endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${DJANGO_API_BASE}${endpoint}`, options);
    if (!res.ok) {
      throw new Error(`APIエラー (${res.status}): ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Django APIへの接続: ${err.message}`);
    return null;
  }
}

// ==========================================
// モード切り替えロジック (5モード対応)
// ==========================================
const modeAssessmentBtn = document.getElementById("mode-assessment");
const modeTextbookBtn = document.getElementById("mode-textbook");
const modeSkillChartBtn = document.getElementById("mode-skill-chart");
const modeCodingBtn = document.getElementById("mode-coding");
const modeQuizBtn = document.getElementById("mode-quiz");

const assessmentMode = document.getElementById("assessment-mode");
const textbookMode = document.getElementById("textbook-mode");
const skillChartMode = document.getElementById("skill-chart-mode");
const codingMode = document.getElementById("coding-mode");
const quizMode = document.getElementById("quiz-mode");

const allModes = [
  { name: "assessment", btn: modeAssessmentBtn, el: assessmentMode },
  { name: "textbook", btn: modeTextbookBtn, el: textbookMode },
  { name: "skill-chart", btn: modeSkillChartBtn, el: skillChartMode },
  { name: "coding", btn: modeCodingBtn, el: codingMode },
  { name: "quiz", btn: modeQuizBtn, el: quizMode },
];

function setActiveMode(modeName) {
  const activeBtnClass = ["bg-white", "text-indigo-700", "shadow-sm", "font-bold"];
  const inactiveBtnClass = ["text-indigo-100", "hover:text-white", "font-semibold"];

  allModes.forEach((m) => {
    if (m.btn) {
      if (m.name === modeName) {
        m.btn.classList.add(...activeBtnClass);
        m.btn.classList.remove(...inactiveBtnClass);
      } else {
        m.btn.classList.remove(...activeBtnClass);
        m.btn.classList.add(...inactiveBtnClass);
      }
    }
    if (m.el) {
      if (m.name === modeName) {
        m.el.classList.remove("hidden");
      } else {
        m.el.classList.add("hidden");
      }
    }
  });

  // モード開始時の初期化
  if (modeName === "textbook") {
    loadTextbookRoadmap();
  } else if (modeName === "skill-chart") {
    loadLatestSkillChart();
  }
}

if (modeAssessmentBtn) modeAssessmentBtn.onclick = () => setActiveMode("assessment");
if (modeTextbookBtn) modeTextbookBtn.onclick = () => setActiveMode("textbook");
if (modeSkillChartBtn) modeSkillChartBtn.onclick = () => setActiveMode("skill-chart");

if (modeCodingBtn) {
  modeCodingBtn.onclick = () => {
    setActiveMode("coding");
    currentCodingIndex = 0;
    codingScores = [];
    codingProblems = shuffleArray(defaultCodingProblems);
    showCodingProblem();
    codingResultContainer.classList.add("hidden");
    document.getElementById("coding-quiz-container").classList.remove("hidden");
  };
}

if (modeQuizBtn) {
  modeQuizBtn.onclick = () => {
    setActiveMode("quiz");
    currentQuizIndex = 0;
    quizScore = 0;
    quizUserAnswers = [];
    showQuizQuestion();
    quizResultContainer.classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");
  };
}

// ==========================================
// 汎用リッチエディタ バインディングヘルパー
// (シンタックスハイライト, 行番号, インデントガイド, フォントサイズ, コピー, Ctrl+Enter)
// ==========================================
function bindRichCodeEditor(config) {
  const {
    textarea,
    backdrop,
    lineNumbers,
    cursorPos,
    charCount,
    fontSizeDecBtn,
    fontSizeIncBtn,
    copyBtn,
    resetBtn,
    onRun,
    getTemplate,
  } = config;

  if (!textarea) return { update: () => {} };

  let currentFontSize = 14;

  function updateBackdropAndLines() {
    const text = textarea.value;

    // 行番号更新
    if (lineNumbers) {
      const lineCount = (text.match(/\n/g) || []).length + 1;
      let html = "";
      for (let i = 1; i <= lineCount; i++) {
        html += `<div class="editor-line">${i}</div>`;
      }
      lineNumbers.innerHTML = html;
      lineNumbers.scrollTop = textarea.scrollTop;
    }

    // Prism.js シンタックスハイライト & インデントガイド更新
    if (backdrop) {
      let highlighted = "";
      try {
        if (window.Prism && window.Prism.languages.python) {
          highlighted = window.Prism.highlight(text, window.Prism.languages.python, "python");
        } else {
          highlighted = escapeHtml(text);
        }
      } catch (err) {
        highlighted = escapeHtml(text);
      }

      // インデントガイドの挿入
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
      if (text.endsWith("\n")) highlighted += "<br/>";

      backdrop.innerHTML = `<code class="language-python" style="display: block; padding: 0; text-shadow: none;">${highlighted}</code>`;
      backdrop.scrollTop = textarea.scrollTop;
      backdrop.scrollLeft = textarea.scrollLeft;
    }

    // ステータス（カーソル位置・文字数）
    updateCursorStatus();
  }

  function updateCursorStatus() {
    const text = textarea.value;
    const pos = textarea.selectionStart || 0;
    const lines = text.substring(0, pos).split("\n");
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;

    if (cursorPos) cursorPos.textContent = `Ln ${lineNum}, Col ${colNum}`;
    if (charCount) charCount.textContent = `${text.length} 文字`;
  }

  // スクロール同期
  textarea.addEventListener("scroll", () => {
    if (backdrop) {
      backdrop.scrollTop = textarea.scrollTop;
      backdrop.scrollLeft = textarea.scrollLeft;
    }
    if (lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  });

  // 入力イベント
  textarea.addEventListener("input", updateBackdropAndLines);
  textarea.addEventListener("click", updateCursorStatus);
  textarea.addEventListener("keyup", updateCursorStatus);

  // スマートキーボード制御 (Tab, Shift+Tab, Enter, Backspace, Ctrl+Enter, 括弧補完)
  textarea.addEventListener("keydown", function (e) {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const value = this.value;

    // 1. Ctrl + Enter / Cmd + Enter で実行
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (typeof onRun === "function") onRun();
      return;
    }

    // 2. Tab & Shift+Tab (4スペースインデント)
    if (e.key === "Tab") {
      e.preventDefault();
      if (start !== end) {
        const startPos = value.lastIndexOf("\n", start - 1) + 1;
        let endPos = value.indexOf("\n", end);
        if (endPos === -1) endPos = value.length;
        const selectedBlock = value.substring(startPos, endPos);
        const lines = selectedBlock.split("\n");

        if (e.shiftKey) {
          const newLines = lines.map((l) => (l.startsWith("    ") ? l.substring(4) : l.replace(/^ {1,3}/, "")));
          const replaced = newLines.join("\n");
          this.value = value.substring(0, startPos) + replaced + value.substring(endPos);
          this.selectionStart = startPos;
          this.selectionEnd = startPos + replaced.length;
        } else {
          const newLines = lines.map((l) => "    " + l);
          const replaced = newLines.join("\n");
          this.value = value.substring(0, startPos) + replaced + value.substring(endPos);
          this.selectionStart = startPos;
          this.selectionEnd = startPos + replaced.length;
        }
      } else {
        if (e.shiftKey) {
          const lineStart = value.lastIndexOf("\n", start - 1) + 1;
          const line = value.substring(lineStart, start);
          if (line.startsWith("    ")) {
            this.value = value.substring(0, lineStart) + line.substring(4) + value.substring(start);
            this.selectionStart = this.selectionEnd = Math.max(lineStart, start - 4);
          }
        } else {
          this.value = value.substring(0, start) + "    " + value.substring(end);
          this.selectionStart = this.selectionEnd = start + 4;
        }
      }
      updateBackdropAndLines();
      updateCursorStatus();
      return;
    }

    // 3. Enter によるスマートインデント（「:」の後の自動字下げ＆インデント継承）
    if (e.key === "Enter") {
      e.preventDefault();
      const beforeCursor = value.substring(0, start);
      const lastNewline = beforeCursor.lastIndexOf("\n");
      const currentLine = beforeCursor.substring(lastNewline + 1);

      const indentMatch = currentLine.match(/^([ \t]+)/);
      let indent = indentMatch ? indentMatch[1] : "";

      // コメント部分を除去した行末がコロン(:)で終わっている場合はさらに4スペース追加
      const lineWithoutComment = currentLine.replace(/#.*$/, "").trim();
      if (lineWithoutComment.endsWith(":")) {
        indent += "    ";
      }

      this.value = value.substring(0, start) + "\n" + indent + value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1 + indent.length;
      updateBackdropAndLines();
      updateCursorStatus();
      return;
    }

    // 4. Backspace (4スペースインデントの一括削除)
    if (e.key === "Backspace" && start === end) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineBeforeCursor = value.substring(lineStart, start);
      if (/^ +$/.test(lineBeforeCursor) && lineBeforeCursor.length > 0 && lineBeforeCursor.length % 4 === 0) {
        e.preventDefault();
        this.value = value.substring(0, start - 4) + value.substring(start);
        this.selectionStart = this.selectionEnd = start - 4;
        updateBackdropAndLines();
        updateCursorStatus();
        return;
      }
    }

    // 5. 自動括弧・クォート補完
    const pairs = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
    if (pairs[e.key] && start === end) {
      e.preventDefault();
      const closeChar = pairs[e.key];
      this.value = value.substring(0, start) + e.key + closeChar + value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
      updateBackdropAndLines();
      updateCursorStatus();
      return;
    }
  });

  // フォントサイズ変更ボタン
  if (fontSizeDecBtn) {
    fontSizeDecBtn.onclick = () => {
      currentFontSize = Math.max(11, currentFontSize - 1);
      textarea.style.fontSize = `${currentFontSize}px`;
      if (backdrop) backdrop.style.fontSize = `${currentFontSize}px`;
      if (lineNumbers) lineNumbers.style.fontSize = `${currentFontSize}px`;
      updateBackdropAndLines();
    };
  }

  if (fontSizeIncBtn) {
    fontSizeIncBtn.onclick = () => {
      currentFontSize = Math.min(24, currentFontSize + 1);
      textarea.style.fontSize = `${currentFontSize}px`;
      if (backdrop) backdrop.style.fontSize = `${currentFontSize}px`;
      if (lineNumbers) lineNumbers.style.fontSize = `${currentFontSize}px`;
      updateBackdropAndLines();
    };
  }

  // コピーボタン
  if (copyBtn) {
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(textarea.value);
        notify("コードをクリップボードにコピーしました", "info");
      } catch (err) {
        notify("コピーに失敗しました", "error");
      }
    };
  }

  // リセットボタン
  if (resetBtn) {
    resetBtn.onclick = () => {
      const tmpl = typeof getTemplate === "function" ? getTemplate() : "";
      if (tmpl !== undefined) {
        textarea.value = tmpl;
        updateBackdropAndLines();
        notify("初期コードにリセットしました", "info");
      }
    };
  }

  return {
    update: updateBackdropAndLines,
    setValue: (val) => {
      textarea.value = val;
      updateBackdropAndLines();
      updateCursorStatus();
    },
  };
}

// ==========================================
// 実力診断アセスメント 標準マスターデータ (8問)
// (完全な模範解答コード・解説・段階的ヒント1/2を完備)
// ==========================================
const defaultAssessmentProblems = [
  {
    id: 1,
    level: 1,
    level_display: "Lv.1",
    category: "basic",
    category_display: "基本文法・型",
    title: "1. 数値の四則演算と丸め処理",
    description: "<p>2つの数値 <code>a</code>, <code>b</code> を受け取り、その平均値（(a + b) / 2）を計算して小数点第1位まで四捨五入した数値（<code>round(avg, 1)</code>）を返す関数 <code>calc_average(a, b)</code> を実装してください。</p>",
    template: "def calc_average(a, b):\n    # ここにコードを書いてください\n    pass\n",
    test_cases: [
      { input: "calc_average(10, 20)", expected: 15.0 },
      { input: "calc_average(5, 6)", expected: 5.5 },
      { input: "calc_average(1, 2)", expected: 1.5 },
    ],
    hint_1: "平均値は <code>(a + b) / 2</code> で求められます。",
    hint_2: "Pythonの組み込み関数 <code>round(value, 1)</code> を使うと小数点第1位に丸められます。",
    model_answer: "def calc_average(a, b):\n    avg = (a + b) / 2\n    return round(avg, 1)\n",
    model_answer_explanation: "(a + b) で合計を求め、2で割って平均値を算出した後、round(..., 1) で小数点以下1桁に整形して返します。",
    weight: 10,
  },
  {
    id: 2,
    level: 1,
    level_display: "Lv.1",
    category: "basic",
    category_display: "基本文法・型",
    title: "2. 文字列の連結とフォーマット",
    description: "<p>ユーザー名 <code>name</code> (文字列) と 年齢 <code>age</code> (整数) を受け取り、<code>\"私の名前は{name}で、{age}歳です。\"</code> という挨拶文字列を返す関数 <code>format_greeting(name, age)</code> を実装してください。</p>",
    template: "def format_greeting(name, age):\n    # ここにコードを書いてください\n    pass\n",
    test_cases: [
      { input: 'format_greeting("田中", 25)', expected: "私の名前は田中で、25歳です。" },
      { input: 'format_greeting("Alice", 18)', expected: "私の名前はAliceで、18歳です。" },
    ],
    hint_1: "Python 3.6以降で使える f-string (<code>f\"...\"</code>) を使うと綺麗に書けます。",
    hint_2: "<code>return f\"私の名前は{name}で、{age}歳です。\"</code> のように変数を埋め込みます。",
    model_answer: "def format_greeting(name, age):\n    return f\"私の名前は{name}で、{age}歳です。\"\n",
    model_answer_explanation: "f-string（フォーマット済み文字列リテラル）を用いることで、変数を波括弧 {} の中に直接記述して読みやすく連結できます。",
    weight: 10,
  },
  {
    id: 3,
    level: 2,
    level_display: "Lv.2",
    category: "control",
    category_display: "制御構文・ループ",
    title: "3. 条件分岐によるFizzBuzz判定",
    description: "<p>整数 <code>n</code> を受け取り、15の倍数なら <code>\"FizzBuzz\"</code>、3の倍数なら <code>\"Fizz\"</code>、5の倍数なら <code>\"Buzz\"</code>、それ以外なら数値を文字列にしたもの（<code>str(n)</code>）を返す関数 <code>fizzbuzz_single(n)</code> を実装してください。</p>",
    template: "def fizzbuzz_single(n):\n    # ここにコードを書いてください\n    pass\n",
    test_cases: [
      { input: "fizzbuzz_single(15)", expected: "FizzBuzz" },
      { input: "fizzbuzz_single(9)", expected: "Fizz" },
      { input: "fizzbuzz_single(10)", expected: "Buzz" },
      { input: "fizzbuzz_single(7)", expected: "7" },
    ],
    hint_1: "15の倍数（3と5の両方の倍数）の判定を一番最初に行うのがポイントです。",
    hint_2: "<code>n % 15 == 0</code> -> <code>n % 3 == 0</code> -> <code>n % 5 == 0</code> -> <code>str(n)</code> の順で if-elif-else を組み立てます。",
    model_answer: "def fizzbuzz_single(n):\n    if n % 15 == 0:\n        return \"FizzBuzz\"\n    elif n % 3 == 0:\n        return \"Fizz\"\n    elif n % 5 == 0:\n        return \"Buzz\"\n    else:\n        return str(n)\n",
    model_answer_explanation: "条件分岐は上から順に評価されるため、最も狭い条件（15の倍数）から先に判定します。",
    weight: 10,
  },
  {
    id: 4,
    level: 2,
    level_display: "Lv.2",
    category: "control",
    category_display: "制御構文・ループ",
    title: "4. ループと偶数の合計算出",
    description: "<p>整数のリスト <code>numbers</code> を受け取り、その中の<b>偶数のみ</b>を合計した数値を返す関数 <code>sum_even_numbers(numbers)</code> を実装してください。偶数がない場合やリストが空の場合は <code>0</code> を返してください。</p>",
    template: "def sum_even_numbers(numbers):\n    # ここにコードを書いてください\n    pass\n",
    test_cases: [
      { input: "sum_even_numbers([1, 2, 3, 4, 5, 6])", expected: 12 },
      { input: "sum_even_numbers([1, 3, 5])", expected: 0 },
      { input: "sum_even_numbers([])", expected: 0 },
      { input: "sum_even_numbers([10, -2, 4])", expected: 12 },
    ],
    hint_1: "forループでリストを1つずつ取り出し、<code>num % 2 == 0</code> で判定します。",
    hint_2: "リスト内包表記 <code>sum([x for x in numbers if x % 2 == 0])</code> でも1行で書けます。",
    model_answer: "def sum_even_numbers(numbers):\n    return sum(x for x in numbers if x % 2 == 0)\n",
    model_answer_explanation: "ジェネレータ式またはforループで偶数条件 (x % 2 == 0) のみを抽出し、組み込み関数 sum() で合計を求めます。",
    weight: 10,
  },
  {
    id: 5,
    level: 3,
    level_display: "Lv.3",
    category: "data_structure",
    category_display: "データ構造",
    title: "5. 辞書による単語カウント集計",
    description: "<p>単語のリスト <code>words</code> を受け取り、各単語の出現回数を辞書形式（例: <code>{\"apple\": 2, \"banana\": 1}</code>）で集計して返す関数 <code>count_words(words)</code> を実装してください。</p>",
    template: "def count_words(words):\n    # ここにコードを書いてください\n    pass\n",
    test_cases: [
      { input: 'count_words(["apple", "banana", "apple", "orange", "banana", "apple"])', expected: '{"apple": 3, "banana": 2, "orange": 1}' },
      { input: 'count_words(["python"])', expected: '{"python": 1}' },
      { input: "count_words([])", expected: "{}" },
    ],
    hint_1: "空の辞書 <code>counts = {}</code> を用意し、単語が辞書にあるか確認しながらカウントします。",
    hint_2: "<code>collections.Counter(words)</code> を使って <code>dict(Counter(words))</code> としても作成できます。",
    model_answer: "from collections import Counter\n\ndef count_words(words):\n    return dict(Counter(words))\n",
    model_answer_explanation: "collections.Counter を利用すると、リスト内の要素の出現頻度を高速かつ安全にカウントして辞書化できます。",
    weight: 15,
  },
  {
    id: 6,
    level: 3,
    level_display: "Lv.3",
    category: "library",
    category_display: "標準ライブラリ",
    title: "6. datetime による経過日数計算",
    description: "<p><code>datetime</code> モジュールを用いて、2つの日付文字列 <code>d1</code>, <code>d2</code> (形式: \"YYYY-MM-DD\") を受け取り、2つの日付の間の日数差（絶対値の整数）を返す関数 <code>calc_days_between(d1, d2)</code> を実装してください。</p>",
    template: "from datetime import datetime\n\ndef calc_days_between(d1, d2):\n    # ここにコードを書いてください\n    pass\n",
    test_cases: [
      { input: 'calc_days_between("2026-01-01", "2026-01-10")', expected: 9 },
      { input: 'calc_days_between("2026-05-15", "2026-05-01")', expected: 14 },
      { input: 'calc_days_between("2026-12-31", "2026-12-31")', expected: 0 },
    ],
    hint_1: "<code>datetime.strptime(date_str, \"%Y-%m-%d\")</code> で文字列を日付オブジェクトに変換します。",
    hint_2: "2つの日付の差分（<code>date2 - date1</code>）から <code>.days</code> を取得し、<code>abs()</code> で絶対値にします。",
    model_answer: "from datetime import datetime\n\ndef calc_days_between(d1, d2):\n    date1 = datetime.strptime(d1, \"%Y-%m-%d\")\n    date2 = datetime.strptime(d2, \"%Y-%m-%d\")\n    return abs((date2 - date1).days)\n",
    model_answer_explanation: "datetime.strptime で文字列を日付型にパースし、差分の timedelta.days を計算して abs() で絶対値の日数を返します。",
    weight: 15,
  },
  {
    id: 7,
    level: 3,
    level_display: "Lv.3",
    category: "plot",
    category_display: "データ可視化",
    title: "7. Matplotlib による月別売上折れ線グラフ描画",
    description: "<p><code>matplotlib.pyplot</code> を用いて、月別売上データ <code>months</code> と <code>sales</code> を折れ線グラフとして描画し、タイトル <code>\"月別売上推移\"</code> を付与して <code>plt.show()</code> で出力するコードを作成してください。</p>",
    template: "import matplotlib.pyplot as plt\n\nmonths = [\"4月\", \"5月\", \"6月\", \"7月\"]\nsales = [120, 180, 240, 200]\n\n# ここにグラフ描画コードを書いてください\n",
    problem_type: "plot",
    test_cases: [
      { check: "type", expected: "line", input_label: "グラフタイプ（折れ線グラフ）" },
      { check: "title", expected: "月別売上推移", input_label: "タイトル検証" },
      { check: "labels", expected: ["4月", "5月", "6月", "7月"], input_label: "X軸ラベル検証" },
      { check: "first_dataset_data", expected: [120, 180, 240, 200], input_label: "売上データ検証" },
    ],
    hint_1: "<code>plt.plot(months, sales, marker='o')</code> で折れ線グラフを描画します。",
    hint_2: "<code>plt.title(\"月別売上推移\")</code> でタイトルを設定し、<code>plt.show()</code> で描画を確定させます。",
    model_answer: "import matplotlib.pyplot as plt\n\nmonths = [\"4月\", \"5月\", \"6月\", \"7月\"]\nsales = [120, 180, 240, 200]\n\nplt.plot(months, sales, marker=\"o\")\nplt.title(\"月別売上推移\")\nplt.show()\n",
    model_answer_explanation: "plt.plot で月別データを折れ線グラフ化し、plt.title でグラフタイトルを付与して plt.show() で描画します。",
    weight: 20,
  },
  {
    id: 8,
    level: 4,
    level_display: "Lv.4",
    category: "algorithm",
    category_display: "アルゴリズム",
    title: "8. 二分探索 (Binary Search) による高速値検索",
    description: "<p>昇順にソートされた整数のリスト <code>arr</code> と 検索したい値 <code>target</code> を受け取り、<b>二分探索（O(log N)）</b>を用いて <code>target</code> が存在するインデックス番号（0始まり）を返す関数 <code>binary_search(arr, target)</code> を実装してください。値が存在しない場合は <code>-1</code> を返してください。</p>",
    template: "def binary_search(arr, target):\n    # ここにコードを書いてください\n    pass\n",
    test_cases: [
      { input: "binary_search([1, 3, 5, 7, 9, 11, 13], 7)", expected: 3 },
      { input: "binary_search([1, 3, 5, 7, 9, 11, 13], 1)", expected: 0 },
      { input: "binary_search([1, 3, 5, 7, 9, 11, 13], 13)", expected: 6 },
      { input: "binary_search([1, 3, 5, 7, 9, 11, 13], 4)", expected: -1 },
    ],
    hint_1: "探索範囲の両端 <code>left = 0, right = len(arr) - 1</code> を持ち、中央インデックス <code>mid = (left + right) // 2</code> を比較します。",
    hint_2: "<code>target</code> が中央値より大きければ <code>left = mid + 1</code>、小さければ <code>right = mid - 1</code> と更新し、見つからなければ <code>-1</code> を返します。",
    model_answer: "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n",
    model_answer_explanation: "ソート済み配列に対して探索範囲を半分ずつ絞り込むことで、O(log N) の計算量で目的の値を高速検索します。",
    weight: 20,
  },
];

// ==========================================
// 1. 実力診断アセスメント (Assessment Engine)
// ==========================================
let assessmentSessionId = null;
let assessmentProblems = [];
let currentAssessmentIndex = 0;
let assessmentTimerInterval = null;
let assessmentQuestionStartTime = null;
let assessmentAttemptCount = 0;

const assessmentIntroCard = document.getElementById("assessment-intro-card");
const assessmentRunnerCard = document.getElementById("assessment-runner-card");
const assessmentStartBtn = document.getElementById("assessment-start-btn");
const assessmentUserNameInput = document.getElementById("assessment-user-name");

const assessmentProgressBadge = document.getElementById("assessment-progress-badge");
const assessmentCategoryBadge = document.getElementById("assessment-category-badge");
const assessmentLevelBadge = document.getElementById("assessment-level-badge");
const assessmentTimerDisplay = document.getElementById("assessment-timer-display");
const assessmentProgressBar = document.getElementById("assessment-progress-bar");

const assessmentProblemTitle = document.getElementById("assessment-problem-title");
const assessmentProblemDesc = document.getElementById("assessment-problem-desc");
const assessmentEditor = document.getElementById("assessment-editor");
const assessmentEditorBackdrop = document.getElementById("assessment-editor-backdrop");
const assessmentLineNumbers = document.getElementById("assessment-line-numbers");
const assessmentCursorPos = document.getElementById("assessment-cursor-pos");
const assessmentCharCount = document.getElementById("assessment-char-count");
const assessmentFontSizeDecBtn = document.getElementById("assessment-font-size-dec-btn");
const assessmentFontSizeIncBtn = document.getElementById("assessment-font-size-inc-btn");
const assessmentCopyCodeBtn = document.getElementById("assessment-copy-code-btn");
const assessmentResetCodeBtn = document.getElementById("assessment-reset-code-btn");

const assessmentHintBtn = document.getElementById("assessment-hint-btn");
const assessmentHintBadge = document.getElementById("assessment-hint-badge");
const assessmentAnswerBtn = document.getElementById("assessment-answer-btn");
const assessmentRunBtn = document.getElementById("assessment-run-btn");

const assessmentHintPanel = document.getElementById("assessment-hint-panel");
const assessmentAnswerPanel = document.getElementById("assessment-answer-panel");
const assessmentModelAnswerCode = document.getElementById("assessment-model-answer-code");
const assessmentModelAnswerExp = document.getElementById("assessment-model-answer-exp");
const assessmentTestResults = document.getElementById("assessment-test-results");

// 実力診断エディタのリッチ機能バインド
const assessmentRichEditor = bindRichCodeEditor({
  textarea: assessmentEditor,
  backdrop: assessmentEditorBackdrop,
  lineNumbers: assessmentLineNumbers,
  cursorPos: assessmentCursorPos,
  charCount: assessmentCharCount,
  fontSizeDecBtn: assessmentFontSizeDecBtn,
  fontSizeIncBtn: assessmentFontSizeIncBtn,
  copyBtn: assessmentCopyCodeBtn,
  resetBtn: assessmentResetCodeBtn,
  onRun: () => {
    if (assessmentRunBtn) assessmentRunBtn.click();
  },
  getTemplate: () => {
    const p = assessmentProblems[currentAssessmentIndex];
    return p ? p.template : "";
  },
});

// 診断開始ボタン
if (assessmentStartBtn) {
  assessmentStartBtn.onclick = async () => {
    const customName = assessmentUserNameInput ? assessmentUserNameInput.value.trim() : "";
    if (customName) currentUserId = customName;

    showAiLoader("診断セッションを作成中...", "実力調査問題セットを読み込んでいます。");

    // API呼び出し
    const startData = await apiRequest("/assessment/start/", "POST", { user_identifier: currentUserId });
    hideAiLoader();

    if (startData && startData.problems && startData.problems.length > 0) {
      assessmentSessionId = startData.session_id;
      // APIから取得した問題にローカルの模範解答・ヒントデータをマージ（安全策）
      assessmentProblems = startData.problems.map((p, idx) => {
        const localP = defaultAssessmentProblems[idx] || {};
        return {
          ...localP,
          ...p,
          model_answer: localP.model_answer || p.model_answer,
          model_answer_explanation: localP.model_answer_explanation || p.model_answer_explanation,
          hint_1: localP.hint_1 || p.hint_1,
          hint_2: localP.hint_2 || p.hint_2,
        };
      });
    } else {
      // API接続失敗時のローカルフォールバック（完全な8問）
      assessmentSessionId = `local_${Date.now()}`;
      assessmentProblems = JSON.parse(JSON.stringify(defaultAssessmentProblems));
    }

    currentAssessmentIndex = 0;
    assessmentLogs = {};
    assessmentIntroCard.classList.add("hidden");
    assessmentRunnerCard.classList.remove("hidden");
    renderAssessmentProblem(0);
  };
}

function renderAssessmentProblem(index) {
  if (index >= assessmentProblems.length) {
    finishAssessment();
    return;
  }

  const p = assessmentProblems[index];
  currentAssessmentIndex = index;
  assessmentAttemptCount = 0;
  assessmentQuestionStartTime = Date.now();

  // ヘッダー情報更新
  if (assessmentProgressBadge) assessmentProgressBadge.textContent = `第 ${index + 1} / ${assessmentProblems.length} 問`;
  if (assessmentCategoryBadge) assessmentCategoryBadge.textContent = p.category_display || p.category || "総合";
  if (assessmentLevelBadge) assessmentLevelBadge.textContent = p.level_display || `Lv.${p.level || 1}`;
  if (assessmentProgressBar) {
    assessmentProgressBar.style.width = `${((index + 1) / assessmentProblems.length) * 100}%`;
  }

  // タイマー開始
  if (assessmentTimerInterval) clearInterval(assessmentTimerInterval);
  assessmentTimerInterval = setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - assessmentQuestionStartTime) / 1000);
    const m = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
    const s = String(elapsedSec % 60).padStart(2, "0");
    if (assessmentTimerDisplay) assessmentTimerDisplay.textContent = `経過: ${m}:${s}`;
  }, 1000);

  // 問題文 & エディタ
  if (assessmentProblemTitle) assessmentProblemTitle.textContent = p.title;
  if (assessmentProblemDesc) assessmentProblemDesc.innerHTML = p.description;
  assessmentRichEditor.setValue(p.template || "");

  // ヒント & 模範解答パネルリセット
  p.currentHintLevel = 0;
  p.modelAnswerViewed = false;
  if (assessmentHintBadge) assessmentHintBadge.textContent = "1/2";
  if (assessmentHintPanel) {
    assessmentHintPanel.classList.add("hidden");
    assessmentHintPanel.innerHTML = "";
  }
  if (assessmentAnswerPanel) assessmentAnswerPanel.classList.add("hidden");
  if (assessmentTestResults) {
    assessmentTestResults.classList.add("hidden");
    assessmentTestResults.innerHTML = "";
  }
}

// ヒント要求ボタン
if (assessmentHintBtn) {
  assessmentHintBtn.onclick = async () => {
    const p = assessmentProblems[currentAssessmentIndex];
    if (!p) return;

    p.currentHintLevel = (p.currentHintLevel || 0) + 1;
    const nextLevel = Math.min(p.currentHintLevel, 2);

    // APIにヒント要求＆ログ記録
    const hintRes = await apiRequest("/assessment/hint/", "POST", {
      session_id: assessmentSessionId,
      problem_id: p.id,
      hint_level: nextLevel,
    });

    const hintText = hintRes && hintRes.hint_text
      ? hintRes.hint_text
      : nextLevel === 1
        ? p.hint_1 || "入出力の型を確認してください。"
        : p.hint_2 || "適切な組み込み関数を活用しましょう。";

    assessmentHintPanel.innerHTML = `
      <div class="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
        <span>ヒント ${nextLevel} (段階的アシスト)</span>
      </div>
      <div>${hintText}</div>
    `;
    assessmentHintPanel.classList.remove("hidden");
    if (assessmentHintBadge) assessmentHintBadge.textContent = nextLevel >= 2 ? "2/2 (最大)" : "2/2";
    notify(`ヒント ${nextLevel} を表示しました (自力スコアに反映されます)`, "info");
  };
}

// 模範解答閲覧ボタン
if (assessmentAnswerBtn) {
  assessmentAnswerBtn.onclick = async () => {
    const p = assessmentProblems[currentAssessmentIndex];
    if (!p) return;

    if (!confirm("模範解答を確認しますか？\n（※この問題の自力解決スコアは参考扱いとなります）")) return;

    p.modelAnswerViewed = true;

    // APIに模範解答閲覧ログ送信
    const ansRes = await apiRequest("/assessment/answer/", "POST", {
      session_id: assessmentSessionId,
      problem_id: p.id,
    });

    const ansCode = (ansRes && ansRes.model_answer) || p.model_answer || p.template;
    const ansExp = (ansRes && ansRes.explanation) || p.model_answer_explanation || "仕様に沿った標準的な実装です。";

    if (assessmentModelAnswerCode) assessmentModelAnswerCode.textContent = ansCode;
    if (assessmentModelAnswerExp) assessmentModelAnswerExp.textContent = ansExp;
    assessmentAnswerPanel.classList.remove("hidden");
    notify("模範解答を表示しました。理解した上でコードを書いてみましょう。", "warning");
  };
}

let assessmentLogs = {};

// 実行・採点ボタン
if (assessmentRunBtn) {
  assessmentRunBtn.onclick = async () => {
    const p = assessmentProblems[currentAssessmentIndex];
    if (!p || !assessmentEditor) return;

    const userCode = assessmentEditor.value;
    assessmentAttemptCount++;
    const elapsedSec = Math.floor((Date.now() - assessmentQuestionStartTime) / 1000);

    showAiLoader("テストケース実行中...", "Brythonランナーで自動検証しています。");

    let runResult = null;
    try {
      if (typeof window.run_python_tests === "function") {
        const payload = JSON.stringify({
          type: p.problem_type || "function",
          setup_code: p.setup_code || "",
          test_cases: p.test_cases || [],
        });
        const rawJson = window.run_python_tests(userCode, payload);
        runResult = JSON.parse(rawJson);
      }
    } catch (err) {
      console.error(err);
    }
    hideAiLoader();

    if (!runResult || runResult.error) {
      assessmentTestResults.innerHTML = `
        <div class="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 rounded-xl text-xs border border-rose-200 dark:border-rose-900/40">
          <b>実行時エラー:</b> ${escapeHtml(runResult ? runResult.error : "Pythonコードの実行に失敗しました。")}
        </div>
      `;
      assessmentTestResults.classList.remove("hidden");
      notify("エラーが発生しました。修正して再試行してください。", "error");
      return;
    }

    const tests = runResult.tests || [];
    const allPassed = tests.length > 0 && tests.every((t) => t.pass);

    if (allPassed) {
      notify(`第 ${currentAssessmentIndex + 1} 問クリア！`, "success");

      // ローカルログに記録
      assessmentLogs[p.id] = {
        problem_id: p.id,
        is_passed: true,
        user_code: userCode,
        duration_seconds: elapsedSec,
        attempt_count: assessmentAttemptCount,
        currentHintLevel: p.currentHintLevel || 0,
        modelAnswerViewed: p.modelAnswerViewed || false,
      };

      // APIに解答送信＆スコア記録
      await apiRequest("/assessment/submit/", "POST", {
        session_id: assessmentSessionId,
        problem_id: p.id,
        is_passed: true,
        user_code: userCode,
        duration_seconds: elapsedSec,
        attempt_count: assessmentAttemptCount,
      });

      // 次の問題へ
      setTimeout(() => {
        renderAssessmentProblem(currentAssessmentIndex + 1);
      }, 800);
    } else {
      const failCount = tests.filter((t) => !t.pass).length;
      assessmentTestResults.innerHTML = `
        <div class="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 rounded-xl text-xs border border-rose-200 dark:border-rose-900/40 space-y-1.5">
          <div class="font-bold">不合格 (${tests.length - failCount} / ${tests.length} ケース通過)</div>
          <div class="text-[11px]">期待値と戻り値が一致していません。ヒントを活用してもう一度確認してみましょう。</div>
        </div>
      `;
      assessmentTestResults.classList.remove("hidden");
      notify("不合格のテストケースがあります。コードを修正してください。", "warning");
    }
  };
}

// ローカル診断メトリクス計算エンジン
function calculateLocalAssessmentMetrics(problems, logs) {
  let totalEarnedScore = 0;
  let totalMaxWeight = 0;
  let passedCount = 0;
  let fullyIndependentCount = 0;

  const categoryMap = {
    basic: { name: "基本文法・型", max: 0, earned: 0 },
    control: { name: "制御構文・ループ", max: 0, earned: 0 },
    data_structure: { name: "データ構造", max: 0, earned: 0 },
    library: { name: "標準ライブラリ", max: 0, earned: 0 },
    plot: { name: "データ可視化", max: 0, earned: 0 },
    algorithm: { name: "アルゴリズム", max: 0, earned: 0 },
  };

  problems.forEach((p) => {
    const w = p.weight || 10;
    const cat = categoryMap[p.category] ? p.category : "basic";
    categoryMap[cat].max += w;
    totalMaxWeight += w;

    const log = logs[p.id] || { is_passed: false, currentHintLevel: 0, modelAnswerViewed: false };
    if (log.is_passed) {
      passedCount++;
      let scoreMultiplier = 1.0;
      if (log.modelAnswerViewed) {
        // 模範解答を見た場合は自力正解とみなさず、参考点(20%)のみ
        scoreMultiplier = 0.2;
      } else if (log.currentHintLevel === 2) {
        scoreMultiplier = 0.5;
      } else if (log.currentHintLevel === 1) {
        scoreMultiplier = 0.8;
      } else {
        fullyIndependentCount++;
      }

      const earned = w * scoreMultiplier;
      totalEarnedScore += earned;
      categoryMap[cat].earned += earned;
    }
  });

  const totalScorePct = totalMaxWeight > 0 ? Math.round((totalEarnedScore / totalMaxWeight) * 100) : 0;
  const selfReliancePct = passedCount > 0 ? Math.round((fullyIndependentCount / passedCount) * 100) : 0;

  const categoryScores = {};
  let minCatScore = 100;
  let minCatKey = "basic";

  Object.entries(categoryMap).forEach(([k, v]) => {
    const pct = v.max > 0 ? Math.round((v.earned / v.max) * 100) : 0;
    categoryScores[k] = { name: v.name, score_pct: pct };
    if (pct < minCatScore) {
      minCatScore = pct;
      minCatKey = k;
    }
  });

  // 推奨章の決定
  let recChapter = 1;
  const catChapterMap = {
    basic: 1,
    control: 2,
    data_structure: 4,
    library: 5,
    plot: 6,
    algorithm: 8,
  };

  if (selfReliancePct < 40 || totalScorePct < 50) {
    recChapter = 1; // 基礎から復習
  } else if (categoryScores[minCatKey]) {
    recChapter = catChapterMap[minCatKey] || 1;
  }

  // AI講評
  let feedback = "";
  if (selfReliancePct === 0 && passedCount > 0) {
    feedback = `すべての問題で模範解答を閲覧しながらクリアしました。解答の解法パターンを把握できた良い機会です。自力でコードを書ける力を養うため、第${recChapter}章から教科書学習でじっくり復習をスタートしましょう。`;
  } else if (selfReliancePct < 50) {
    feedback = `総合スコアは ${totalScorePct}点、自力達成度は ${selfReliancePct}% です。模範解答やヒントを参考にした単元（${categoryScores[minCatKey]?.name || "基礎"}）を補強するため、第${recChapter}章から教科書学習を始めるのが最適です。`;
  } else if (selfReliancePct < 80) {
    feedback = `良好な学習ペースです。総合スコア ${totalScorePct}点、自力達成度 ${selfReliancePct}% を記録しました。弱点分野の第${recChapter}章を教科書で確認しつつ、さらなるスキルアップを目指しましょう。`;
  } else {
    feedback = `素晴らしい自力解決力です！総合スコア ${totalScorePct}点、自力達成度 ${selfReliancePct}% を達成しました。応用的な第${recChapter}章から教科書学習を進めましょう。`;
  }

  return {
    total_score: totalScorePct,
    self_reliance_score: selfReliancePct,
    recommended_chapter: recChapter,
    ai_feedback: feedback,
    category_scores: categoryScores,
  };
}

// 診断完了処理
async function finishAssessment() {
  if (assessmentTimerInterval) clearInterval(assessmentTimerInterval);
  showAiLoader("実力診断結果を集計中...", "総合スコア、自力解決度、6分野レーダーチャートを分析しています。");

  // API完了呼び出し
  const sessionResult = await apiRequest("/assessment/complete/", "POST", {
    session_id: assessmentSessionId,
  });

  hideAiLoader();

  // スキルチャート画面へ遷移して結果を描画
  setActiveMode("skill-chart");
  if (sessionResult && sessionResult.total_score != null) {
    renderSkillChart(sessionResult);
  } else {
    // ローカル評価エンジンで正確に算出
    const localResult = calculateLocalAssessmentMetrics(assessmentProblems, assessmentLogs);
    renderSkillChart(localResult);
  }
}

// ==========================================
// 2. スキルチャート & レーダー描画 (Skill Chart Analytics)
// ==========================================
let radarChartInstance = null;
let latestSessionResult = null;

const skillChartEmpty = document.getElementById("skill-chart-empty");
const skillChartContent = document.getElementById("skill-chart-content");
const gotoAssessmentBtn = document.getElementById("goto-assessment-btn");

const chartTotalScore = document.getElementById("chart-total-score");
const chartRankBadge = document.getElementById("chart-rank-badge");
const chartSelfReliance = document.getElementById("chart-self-reliance");
const chartRecommendedTitle = document.getElementById("chart-recommended-title");
const chartRecommendedDesc = document.getElementById("chart-recommended-desc");
const chartJumpTextbookBtn = document.getElementById("chart-jump-textbook-btn");

const skillRadarCanvas = document.getElementById("skill-radar-canvas");
const chartAiFeedback = document.getElementById("chart-ai-feedback");
const chartCategoryBars = document.getElementById("chart-category-bars");

if (gotoAssessmentBtn) {
  gotoAssessmentBtn.onclick = () => setActiveMode("assessment");
}

function loadLatestSkillChart() {
  if (latestSessionResult) {
    renderSkillChart(latestSessionResult);
  } else {
    if (skillChartEmpty) skillChartEmpty.classList.remove("hidden");
    if (skillChartContent) skillChartContent.classList.add("hidden");
  }
}

function renderSkillChart(data) {
  latestSessionResult = data;
  if (skillChartEmpty) skillChartEmpty.classList.add("hidden");
  if (skillChartContent) skillChartContent.classList.remove("hidden");

  const score = data.total_score || 0;
  const selfReliance = data.self_reliance_score != null ? data.self_reliance_score : 100;
  const recChapter = data.recommended_chapter || 1;

  if (chartTotalScore) chartTotalScore.textContent = score;
  if (chartSelfReliance) chartSelfReliance.textContent = selfReliance;

  // ランク判定
  let rank = "Rank C: 初級・入門レベル";
  let rankClass = "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
  if (score >= 90) {
    rank = "Rank S: プロフェッショナル";
    rankClass = "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300";
  } else if (score >= 75) {
    rank = "Rank A: 実践・応用レベル";
    rankClass = "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300";
  } else if (score >= 60) {
    rank = "Rank B: 基礎完成レベル";
    rankClass = "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300";
  }
  if (chartRankBadge) {
    chartRankBadge.textContent = rank;
    chartRankBadge.className = `inline-block px-3 py-1 rounded-full text-xs font-bold ${rankClass} w-max`;
  }

  // 推奨単元
  const chapterTitles = {
    1: "第1章: Pythonの第一歩と基本データ型",
    2: "第2章: 条件分岐とループ処理の極意",
    3: "第3章: 関数設計とスコープ",
    4: "第4章: 高度なデータ構造 (辞書・集合・内包表記)",
    5: "第5章: 実用標準ライブラリの徹底活用",
    6: "第6章: データ可視化とグラフ描画 (Matplotlib)",
    7: "第7章: オブジェクト指向とクラス設計",
    8: "第8章: 実践アルゴリズムと効率化",
  };
  if (chartRecommendedTitle) chartRecommendedTitle.textContent = chapterTitles[recChapter] || `第${recChapter}章`;
  if (chartJumpTextbookBtn) {
    chartJumpTextbookBtn.onclick = async () => {
      setActiveMode("textbook");
      await loadLessonByChapter(recChapter);
    };
  }

  // AI講評
  if (chartAiFeedback) {
    chartAiFeedback.textContent = data.ai_feedback || "基礎を着実に身につけて、次のステップへ進みましょう。";
  }

  // カテゴリバー描画
  if (chartCategoryBars && data.category_scores) {
    chartCategoryBars.innerHTML = Object.entries(data.category_scores)
      .map(
        ([k, c]) => `
      <div class="space-y-1">
        <div class="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          <span>${c.name}</span>
          <span class="font-bold text-indigo-600 dark:text-indigo-400">${c.score_pct}%</span>
        </div>
        <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div class="bg-indigo-600 h-full rounded-full transition-all duration-500" style="width: ${c.score_pct}%"></div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // 6軸レーダーチャート描画
  if (skillRadarCanvas && window.Chart && data.category_scores) {
    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#cbd5e1" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";

    const labels = [];
    const values = [];
    Object.values(data.category_scores).forEach((c) => {
      labels.push(c.name);
      values.push(c.score_pct);
    });

    if (radarChartInstance) radarChartInstance.destroy();

    radarChartInstance = new window.Chart(skillRadarCanvas.getContext("2d"), {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "習熟度スコア (%)",
            data: values,
            backgroundColor: "rgba(99, 102, 241, 0.25)",
            borderColor: "#6366f1",
            pointBackgroundColor: "#4f46e5",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#4f46e5",
            borderWidth: 2,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: {
              color: textColor,
              font: { size: 11, weight: "bold", family: "system-ui, sans-serif" },
            },
            ticks: {
              display: false,
              min: 0,
              max: 100,
              stepSize: 25,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }
}

// ==========================================
// 3. パーソナライズ教科書学習 (Textbook Curriculum)
// ==========================================
const defaultTextbookChapters = [
  {
    id: 1,
    order: 1,
    title: "第1章: Pythonの第一歩と基本データ型",
    subtitle: "変数・数値・文字列・四則演算のマスター",
    icon: "sparkles",
    category: "basic",
    target_level: 1,
    summary: "Pythonの基本思想、変数の定義、数値型(int, float)、文字列型(str)の操作とf-stringによる美しい文字列フォーマットを学びます。",
    lessons: [
      {
        id: 1,
        chapter_id: 1,
        chapter_order: 1,
        chapter_title: "Pythonの第一歩と基本データ型",
        order: 1,
        title: "1.1 変数宣言と数値の計算",
        reading_time_minutes: 3,
        content_html: `
          <h3>Pythonにおける変数と計算の基礎</h3>
          <p>Pythonでは変数の型宣言（intやletなど）は不要で、値を代入するだけで自動的に型が決まります。</p>
          <pre><code class="language-python"># 変数の代入
price = 1200
tax_rate = 0.1
total = price * (1 + tax_rate)
print(total) # 1320.0</code></pre>
          <h4>主な算術演算子</h4>
          <ul>
            <li><code>+</code> (加算), <code>-</code> (減算), <code>*</code> (乗算), <code>/</code> (除算・小数)</li>
            <li><code>//</code> (整数除算・切り捨て), <code>%</code> (余り・剰余), <code>**</code> (べき乗)</li>
          </ul>
        `,
        key_takeaways: ["代入記号 = で変数を定義", "除算 / は常に float 型を返す", "// は商、% は余りを計算"],
        example_code: "a = 17\nb = 5\nprint('商:', a // b)\nprint('余り:', a % b)",
        exercise: {
          id: 1,
          title: "台形の面積計算",
          description: "<p>上底 <code>top</code>、下底 <code>bottom</code>、高さ <code>height</code> を受け取り、台形の面積 <code>(top + bottom) * height / 2</code> を計算して返す関数 <code>calc_trapezoid_area(top, bottom, height)</code> を実装してください。</p>",
          template: "def calc_trapezoid_area(top, bottom, height):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "calc_trapezoid_area(3, 5, 4)", expected: 16.0 },
            { input: "calc_trapezoid_area(10, 20, 5)", expected: 75.0 },
          ],
          solution_code: "def calc_trapezoid_area(top, bottom, height):\n    return (top + bottom) * height / 2\n",
          explanation: "台形の公式 (上底 + 下底) * 高さ / 2 をそのまま計算式にして返します。",
        },
      },
      {
        id: 2,
        chapter_id: 1,
        chapter_order: 1,
        chapter_title: "Pythonの第一歩と基本データ型",
        order: 2,
        title: "1.2 文字列の操作と f-string",
        reading_time_minutes: 4,
        content_html: `
          <h3>文字列の埋め込みとスライス</h3>
          <p>Python 3.6以降の標準である <code>f-string</code> (フォーマット済み文字列) を使うと、変数を直感的に埋め込めます。</p>
          <pre><code class="language-python">item = "りんご"
count = 3
price = 150
message = f"{item}が{count}個で合計{count * price}円です。"
print(message)</code></pre>
        `,
        key_takeaways: ['f"..." 内で {変数} や {式} を評価可能', "len(str) で文字列の長さを取得"],
        example_code: "name = 'Python'\nprint(f'Hello, {name}!')",
        exercise: {
          id: 2,
          title: "商品ラベルの生成",
          description: '<p>商品名 <code>product</code> と 単価 <code>price</code> を受け取り、<code>"【商品】{product} : ￥{price}"</code> というラベル文字列を返す関数 <code>make_price_label(product, price)</code> を実装してください。</p>',
          template: "def make_price_label(product, price):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'make_price_label("ノートPC", 85000)', expected: "【商品】ノートPC : ￥85000" },
            { input: 'make_price_label("マウス", 2400)', expected: "【商品】マウス : ￥2400" },
          ],
          solution_code: 'def make_price_label(product, price):\n    return f"【商品】{product} : ￥{price}"\n',
          explanation: "f-string で変数を埋め込んで指定のフォーマットを作成します。",
        },
      },
    ],
  },
  {
    id: 2,
    order: 2,
    title: "第2章: 条件分岐とループ処理の極意",
    subtitle: "if文・for文・while文による柔軟な制御",
    icon: "arrows-split",
    category: "control",
    target_level: 2,
    summary: "プログラムに知性を与える条件分岐 (if-elif-else) と、反復処理 (for, while, range) の基礎から応用までを習得します。",
    lessons: [
      {
        id: 3,
        chapter_id: 2,
        chapter_order: 2,
        chapter_title: "条件分岐とループ処理の極意",
        order: 1,
        title: "2.1 if-elif-else による複数条件分岐",
        reading_time_minutes: 4,
        content_html: `
          <h3>条件分岐の組み立て</h3>
          <p>Pythonはインデント（字下げ・半角スペース4つ）でブロックを表現します。</p>
          <pre><code class="language-python">score = 85
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"</code></pre>
        `,
        key_takeaways: ["コロン : の後にインデントで処理を書く", "論理演算子 and, or, not で複合条件"],
        example_code: "age = 20\nif age >= 18:\n    print('成人')\nelse:\n    print('未成年')",
        exercise: {
          id: 3,
          title: "年齢区分判定プログラム",
          description: '<p>年齢 <code>age</code> を受け取り、12歳以下なら <code>"child"</code>、13〜19歳なら <code>"teen"</code>、20〜64歳なら <code>"adult"</code>、65歳以上なら <code>"senior"</code> を返す関数 <code>get_age_category(age)</code> を実装してください。</p>',
          template: "def get_age_category(age):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "get_age_category(10)", expected: "child" },
            { input: "get_age_category(15)", expected: "teen" },
            { input: "get_age_category(30)", expected: "adult" },
            { input: "get_age_category(70)", expected: "senior" },
          ],
          solution_code: 'def get_age_category(age):\n    if age <= 12:\n        return "child"\n    elif age <= 19:\n        return "teen"\n    elif age <= 64:\n        return "adult"\n    else:\n        return "senior"\n',
          explanation: "年齢の範囲を if-elif-else で段階的に判定して対応する文字列を返します。",
        },
      },
    ],
  },
  {
    id: 3,
    order: 3,
    title: "第3章: 関数設計とスコープ",
    subtitle: "再利用可能なモジュール化と引数・戻り値",
    icon: "code",
    category: "basic",
    target_level: 2,
    summary: "defによる関数定義、デフォルト引数、可変長引数(*args, **kwargs)、ローカル・グローバルスコープを学びます。",
    lessons: [
      {
        id: 4,
        chapter_id: 3,
        chapter_order: 3,
        chapter_title: "関数設計とスコープ",
        order: 1,
        title: "3.1 関数の基本とデフォルト引数",
        reading_time_minutes: 4,
        content_html: "<p>関数を使うことで同じ処理をまとめ、コードを綺麗に保ちます。</p>",
        key_takeaways: ["def 関数名(引数): で定義", "return で戻り値を返す"],
        example_code: "def add(a, b=10):\n    return a + b\nprint('結果:', add(5))",
        exercise: {
          id: 4,
          title: "割引計算関数",
          description: "<p>定価 <code>price</code> と 割引率 <code>discount</code> (0.0〜1.0) を受け取り、割引後の整数金額（<code>int(price * (1 - discount))</code>）を返す関数 <code>apply_discount(price, discount)</code> を実装してください。</p>",
          template: "def apply_discount(price, discount):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "apply_discount(1000, 0.2)", expected: 800 },
            { input: "apply_discount(500, 0.1)", expected: 450 },
          ],
          solution_code: "def apply_discount(price, discount):\n    return int(price * (1 - discount))\n",
          explanation: "定価に (1 - 割引率) を掛けて int() で端数を切り捨てて返します。",
        },
      },
    ],
  },
  {
    id: 4,
    order: 4,
    title: "第4章: 高度なデータ構造 (辞書・集合・内包表記)",
    subtitle: "高速なデータ検索・操作・フィルタリング",
    icon: "database",
    category: "data_structure",
    target_level: 3,
    summary: "キーと値で管理する辞書 (dict)、重複を許さない集合 (set)、そしてPythonらしい簡潔なリスト内包表記を極めます。",
    lessons: [
      {
        id: 5,
        chapter_id: 4,
        chapter_order: 4,
        chapter_title: "高度なデータ構造 (辞書・集合・内包表記)",
        order: 1,
        title: "4.1 辞書操作とリスト内包表記",
        reading_time_minutes: 5,
        content_html: `
          <h3>リスト内包表記の威力</h3>
          <p>forループを使わずに1行で新しいリストを生成できます。</p>
          <pre><code class="language-python"># 1〜10の偶数の2乗リスト
squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(squares) # [4, 16, 36, 64, 100]</code></pre>
        `,
        key_takeaways: ["[式 for 変数 in イテラブル if 条件] で簡潔に記述", "辞書の .get(key, default) で安全に値取得"],
        example_code: "data = {'apple': 100, 'banana': 200}\nprint('りんご:', data.get('apple'))",
        exercise: {
          id: 5,
          title: "指定文字数以上の単語フィルタリング",
          description: "<p>単語リスト <code>words</code> と 最小文字数 <code>min_len</code> を受け取り、文字数が <code>min_len</code> 以上の単語のみを大文字に変換したリストを返す関数 <code>filter_and_upper_words(words, min_len)</code> を実装してください。</p>",
          template: "def filter_and_upper_words(words, min_len):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'filter_and_upper_words(["cat", "elephant", "dog", "tiger"], 4)', expected: ["ELEPHANT", "TIGER"] },
            { input: 'filter_and_upper_words(["a", "bb"], 3)', expected: [] },
          ],
          solution_code: "def filter_and_upper_words(words, min_len):\n    return [w.upper() for w in words if len(w) >= min_len]\n",
          explanation: "リスト内包表記で len(w) >= min_len の条件を満たす単語を w.upper() で大文字化して集めます。",
        },
      },
    ],
  },
  {
    id: 5,
    order: 5,
    title: "第5章: 実用標準ライブラリの徹底活用",
    subtitle: "datetime, math, re, collections, itertools",
    icon: "puzzle-piece",
    category: "library",
    target_level: 3,
    summary: "実務開発に直結する日付操作(datetime)、正規表現(re)、要素集計(collections.Counter)、組み合わせ(itertools)を学びます。",
    lessons: [
      {
        id: 6,
        chapter_id: 5,
        chapter_order: 5,
        chapter_title: "実用標準ライブラリの徹底活用",
        order: 1,
        title: "5.1 datetime と re による実務データ処理",
        reading_time_minutes: 5,
        content_html: "<p>日時計算や文字列からの情報抽出は、実務で最も頻繁に遭遇するタスクです。</p>",
        key_takeaways: ["datetime.date と timedelta による日付演算", "re.findall や re.sub による正規表現抽出・置換"],
        example_code: "import re\ntext = 'ID: A123, B456'\nprint(re.findall(r'[A-Z][0-9]{3}', text))",
        exercise: {
          id: 6,
          title: "郵便番号の抽出とハイフン統一",
          description: '<p><code>re</code> モジュールを用いて、文章 <code>text</code> から日本の7桁郵便番号（<code>123-4567</code> または <code>1234567</code>）をすべて抽出し、すべて <code>"XXX-XXXX"</code> 形式に正規化したリストを返す関数 <code>extract_and_format_zipcodes(text)</code> を実装してください。</p>',
          template: "import re\n\ndef extract_and_format_zipcodes(text):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'extract_and_format_zipcodes("〒100-0001 東京都、〒1500042 渋谷区")', expected: ["100-0001", "150-0042"] },
            { input: 'extract_and_format_zipcodes("郵便番号なし")', expected: [] },
          ],
          solution_code: "import re\n\ndef extract_and_format_zipcodes(text):\n    matches = re.findall(r'(\\d{3})-?(\\d{4})', text)\n    return [f\"{m[0]}-{m[1]}\" for m in matches]\n",
          explanation: '(\\d{3})-?(\\d{4}) で3桁と4桁をグループキャプチャし、f"{m[0]}-{m[1]}" でハイフン付きに成形します。',
        },
      },
    ],
  },
  {
    id: 6,
    order: 6,
    title: "第6章: データ可視化とグラフ描画 (Matplotlib)",
    subtitle: "折れ線・棒グラフ・散布図・円グラフ",
    icon: "chart-bar",
    category: "plot",
    target_level: 3,
    summary: "データを視覚的に伝えるグラフ描画スキル。matplotlib.pyplot を使った各種グラフの作成とスタイリングを習得します。",
    lessons: [
      {
        id: 7,
        chapter_id: 6,
        chapter_order: 6,
        chapter_title: "データ可視化とグラフ描画 (Matplotlib)",
        order: 1,
        title: "6.1 基本的なグラフ描画のフロー",
        reading_time_minutes: 4,
        content_html: "<p>plt.plot(折れ線), plt.bar(棒グラフ), plt.scatter(散布図), plt.pie(円グラフ) の基本構文を理解します。</p>",
        key_takeaways: ["import matplotlib.pyplot as plt でインポート", "plt.title(), plt.xlabel(), plt.ylabel() でラベル付け", "plt.show() で描画完了"],
        example_code: "import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [10, 20, 15])\nplt.title('Sample')\nplt.show()",
        exercise: {
          id: 7,
          title: "売上個数の棒グラフ作成",
          description: '<p><code>plt.bar()</code> を用いて、果物 <code>fruits = ["りんご", "みかん", "バナナ"]</code> と 売上個数 <code>counts = [80, 120, 60]</code> の棒グラフを描画し、タイトルを <code>"果物売上"</code> として <code>plt.show()</code> してください。</p>',
          template: "import matplotlib.pyplot as plt\n\nfruits = [\"りんご\", \"みかん\", \"バナナ\"]\ncounts = [80, 120, 60]\n\n# ここに棒グラフを描画するコードを書いてください\n\n",
          problem_type: "plot",
          test_cases: [
            { check: "type", expected: "bar", input_label: "グラフ種別が 'bar' (棒グラフ)" },
            { check: "title", expected: "果物売上", input_label: "タイトルが '果物売上'" },
            { check: "labels", expected: ["りんご", "みかん", "バナナ"], input_label: "ラベルが果物一覧" },
            { check: "first_dataset_data", expected: [80, 120, 60], input_label: "データ配列が [80, 120, 60]" },
          ],
          solution_code: 'import matplotlib.pyplot as plt\n\nfruits = ["りんご", "みかん", "バナナ"]\ncounts = [80, 120, 60]\n\nplt.bar(fruits, counts)\nplt.title("果物売上")\nplt.show()\n',
          explanation: 'plt.bar(fruits, counts) でカテゴリ棒グラフを生成し、plt.title("果物売上") を付与して show() します。',
        },
      },
    ],
  },
  {
    id: 7,
    order: 7,
    title: "第7章: オブジェクト指向とクラス設計",
    subtitle: "クラス定義・カプセル化・特殊メソッド",
    icon: "cube",
    category: "algorithm",
    target_level: 4,
    summary: "classによるデータと振る舞いのカプセル化、__init__コンストラクタ、プロパティデコレータ(@property)、継承を学びます。",
    lessons: [
      {
        id: 8,
        chapter_id: 7,
        chapter_order: 7,
        chapter_title: "オブジェクト指向とクラス設計",
        order: 1,
        title: "7.1 クラスの基本とインスタンス化",
        reading_time_minutes: 5,
        content_html: "<p>クラスを使うことで、状態（属性）と振る舞い（メソッド）を1つの型として定義できます。</p>",
        key_takeaways: ["__init__(self, ...) で初期化", "self はインスタンス自身を参照"],
        example_code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f'{self.name} says Woof!'\n\ndog = Dog('Pochi')\nprint(dog.bark())",
        exercise: {
          id: 8,
          title: "銀行口座クラスの設計",
          description: "<p>初期残高 <code>balance</code> を保持し、預金 <code>deposit(amount)</code> と 引出 <code>withdraw(amount)</code> (残高不足時は False、成功時は True を返す)、残高照会 <code>get_balance()</code> を備えた <code>BankAccount</code> クラスを実装してください。</p>",
          template: "class BankAccount:\n    def __init__(self, initial_balance=0):\n        # ここにコードを書いてください\n        pass\n",
          setup_code: "def test_bank():\n    acc = BankAccount(100)\n    acc.deposit(50)\n    w1 = acc.withdraw(30)\n    w2 = acc.withdraw(200)\n    return (acc.get_balance(), w1, w2)",
          test_cases: [
            { input: "test_bank()", expected: "(120, True, False)" },
          ],
          solution_code: "class BankAccount:\n    def __init__(self, initial_balance=0):\n        self.balance = initial_balance\n    def deposit(self, amount):\n        self.balance += amount\n    def withdraw(self, amount):\n        if self.balance >= amount:\n            self.balance -= amount\n            return True\n        return False\n    def get_balance(self):\n        return self.balance\n",
          explanation: "初期残高を self.balance に保持し、各メソッドで加減算と条件チェックを行います。",
        },
      },
    ],
  },
  {
    id: 8,
    order: 8,
    title: "第8章: 実践アルゴリズムと効率化",
    subtitle: "二分探索・再帰・デコレータ・計算量最適化",
    icon: "lightning",
    category: "algorithm",
    target_level: 4,
    summary: "本格的なアルゴリズム設計、再帰関数、メモ化(キャッシュ)、そして計算量(O記法)を意識したプロフェッショナルなコーディングを学びます。",
    lessons: [
      {
        id: 9,
        chapter_id: 8,
        chapter_order: 8,
        chapter_title: "実践アルゴリズムと効率化",
        order: 1,
        title: "8.1 二分探索 (Binary Search) の実装",
        reading_time_minutes: 5,
        content_html: "<p>ソート済みリストから O(log N) の高速さで目的の値を探索する二分探索を学びます。</p>",
        key_takeaways: ["中央値 (mid) とターゲットを比較", "探索範囲を毎ステップ半分に絞り込む"],
        example_code: "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nprint(binary_search([1, 3, 5, 7, 9], 5))",
        exercise: {
          id: 9,
          title: "二分探索関数の完成",
          description: "<p>昇順ソート済みリスト <code>sorted_list</code> と 検索値 <code>target</code> を受け取り、存在すればそのインデックス（0始まり）、存在しなければ <code>-1</code> を返す関数 <code>binary_search(sorted_list, target)</code> を実装してください。</p>",
          template: "def binary_search(sorted_list, target):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "binary_search([1, 3, 5, 7, 9, 11], 7)", expected: 3 },
            { input: "binary_search([10, 20, 30, 40], 10)", expected: 0 },
            { input: "binary_search([2, 4, 6, 8], 5)", expected: -1 },
          ],
          solution_code: "def binary_search(sorted_list, target):\n    left, right = 0, len(sorted_list) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_list[mid] == target:\n            return mid\n        elif sorted_list[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n",
          explanation: "leftとrightのポインタを中央値との大小関係に応じて更新し、高速に対象インデックスを見つけます。",
        },
      },
    ],
  },
];

let textbookChapters = [];
let currentTextbookLesson = null;

const textbookChaptersTree = document.getElementById("textbook-chapters-tree");
const textbookOverallProgressBar = document.getElementById("textbook-overall-progress-bar");
const textbookProgressText = document.getElementById("textbook-progress-text");

const lessonChapterLabel = document.getElementById("lesson-chapter-label");
const lessonTimeBadge = document.getElementById("lesson-time-badge");
const lessonTitle = document.getElementById("lesson-title");
const lessonContent = document.getElementById("lesson-content");
const lessonTakeawaysList = document.getElementById("lesson-takeaways-list");

const lessonExampleCode = document.getElementById("lesson-example-code");
const lessonExampleOutput = document.getElementById("lesson-example-output");
const lessonRunExampleBtn = document.getElementById("lesson-run-example-btn");

const exerciseTitle = document.getElementById("exercise-title");
const exerciseStatusBadge = document.getElementById("exercise-status-badge");
const exerciseDesc = document.getElementById("exercise-desc");
const exerciseEditor = document.getElementById("exercise-editor");
const exerciseEditorBackdrop = document.getElementById("exercise-editor-backdrop");
const exerciseLineNumbers = document.getElementById("exercise-line-numbers");
const exerciseCursorPos = document.getElementById("exercise-cursor-pos");
const exerciseCharCount = document.getElementById("exercise-char-count");
const exerciseFontSizeDecBtn = document.getElementById("exercise-font-size-dec-btn");
const exerciseFontSizeIncBtn = document.getElementById("exercise-font-size-inc-btn");
const exerciseCopyCodeBtn = document.getElementById("exercise-copy-code-btn");

const exerciseSolutionToggleBtn = document.getElementById("exercise-solution-toggle-btn");
const exerciseSolutionPanel = document.getElementById("exercise-solution-panel");
const exerciseSolutionCode = document.getElementById("exercise-solution-code");
const exerciseSolutionExp = document.getElementById("exercise-solution-exp");
const exerciseTestBtn = document.getElementById("exercise-test-btn");
const exerciseResults = document.getElementById("exercise-results");
const lessonCompleteNextBtn = document.getElementById("lesson-complete-next-btn");

// 教科書演習エディタのリッチ機能バインド
const exerciseRichEditor = bindRichCodeEditor({
  textarea: exerciseEditor,
  backdrop: exerciseEditorBackdrop,
  lineNumbers: exerciseLineNumbers,
  cursorPos: exerciseCursorPos,
  charCount: exerciseCharCount,
  fontSizeDecBtn: exerciseFontSizeDecBtn,
  fontSizeIncBtn: exerciseFontSizeIncBtn,
  copyBtn: exerciseCopyCodeBtn,
  resetBtn: null,
  onRun: () => {
    if (exerciseTestBtn) exerciseTestBtn.click();
  },
  getTemplate: () => {
    return currentTextbookLesson && currentTextbookLesson.exercise ? currentTextbookLesson.exercise.template : "";
  },
});

function getLocalLessonProgress(lessonId) {
  try {
    const raw = localStorage.getItem(`lesson_progress_${lessonId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveLocalLessonProgress(lessonId, data) {
  try {
    localStorage.setItem(`lesson_progress_${lessonId}`, JSON.stringify(data));
  } catch (e) {}
}

async function loadTextbookRoadmap() {
  const data = await apiRequest(`/curriculum/chapters/?user_identifier=${currentUserId}`);
  if (data && data.chapters && data.chapters.length > 0) {
    textbookChapters = data.chapters;
    if (textbookProgressText) {
      textbookProgressText.textContent = `進捗: ${data.completed_lessons} / ${data.total_lessons} 単元 (${data.overall_progress_pct}%)`;
    }
    if (textbookOverallProgressBar) {
      textbookOverallProgressBar.style.width = `${data.overall_progress_pct}%`;
    }
  } else {
    // ローカルマスターデータ（全8章・9レッスン）を採用
    textbookChapters = JSON.parse(JSON.stringify(defaultTextbookChapters));

    let totalLessons = 0;
    let completedLessons = 0;

    textbookChapters.forEach((ch) => {
      let chCompleted = 0;
      ch.lessons.forEach((l) => {
        totalLessons++;
        const prog = getLocalLessonProgress(l.id);
        if (prog && (prog.is_completed || prog.exercise_passed)) {
          l.user_status = { is_completed: true, exercise_passed: prog.exercise_passed };
          completedLessons++;
          chCompleted++;
        } else {
          l.user_status = { is_completed: false, exercise_passed: false };
        }
      });
      ch.total_lessons_count = ch.lessons.length;
      ch.completed_lessons_count = chCompleted;
      ch.is_mastered = chCompleted === ch.lessons.length && ch.lessons.length > 0;
    });

    const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    if (textbookProgressText) {
      textbookProgressText.textContent = `進捗: ${completedLessons} / ${totalLessons} 単元 (${pct}%)`;
    }
    if (textbookOverallProgressBar) {
      textbookOverallProgressBar.style.width = `${pct}%`;
    }
  }

  renderTextbookTree(textbookChapters);

  // 最初の未完了レッスンまたは第1単元を開く
  if (!currentTextbookLesson && textbookChapters.length > 0) {
    let targetLesson = null;
    for (const ch of textbookChapters) {
      for (const l of ch.lessons) {
        if (!l.user_status || !l.user_status.is_completed) {
          targetLesson = l;
          break;
        }
      }
      if (targetLesson) break;
    }
    if (!targetLesson && textbookChapters[0].lessons.length > 0) {
      targetLesson = textbookChapters[0].lessons[0];
    }
    if (targetLesson) loadLesson(targetLesson.id);
  }
}

function renderTextbookTree(chapters) {
  if (!textbookChaptersTree) return;
  textbookChaptersTree.innerHTML = chapters
    .map(
      (ch) => `
    <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-850">
      <div class="p-3 bg-slate-50 dark:bg-slate-800 flex justify-between items-center cursor-pointer select-none">
        <div class="flex items-center gap-2">
          <span class="font-bold text-xs text-slate-800 dark:text-slate-200">${escapeHtml(ch.title)}</span>
          ${ch.is_mastered ? `<span class="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded">マスター済</span>` : ""}
        </div>
        <span class="text-[10px] text-slate-400 font-semibold">${ch.completed_lessons_count || 0}/${ch.total_lessons_count || (ch.lessons ? ch.lessons.length : 0)}</span>
      </div>
      <div class="p-2 space-y-1">
        ${(ch.lessons || [])
          .map((l) => {
            const st = l.user_status || getLocalLessonProgress(l.id) || {};
            let badge = `<span class="text-[10px] text-slate-400">未受講</span>`;
            if (st.is_skipped_by_assessment) {
              badge = `<span class="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded">診断スキップ</span>`;
            } else if (st.is_completed || st.exercise_passed) {
              badge = `<span class="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded">完了</span>`;
            }
            return `
            <button onclick="loadLesson(${l.id})" class="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex justify-between items-center ${currentTextbookLesson && currentTextbookLesson.id === l.id ? "bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}">
              <span class="truncate">${escapeHtml(l.title)}</span>
              ${badge}
            </button>
          `;
          })
          .join("")}
      </div>
    </div>
  `
    )
    .join("");
}

async function loadLesson(lessonId) {
  showAiLoader("単元を読み込み中...", "解説と演習問題を準備しています。");
  let data = await apiRequest(`/curriculum/lessons/${lessonId}/?user_identifier=${currentUserId}`);
  hideAiLoader();

  if (!data) {
    // ローカルマスターデータから該当レッスンを検索
    for (const ch of defaultTextbookChapters) {
      const found = ch.lessons.find((l) => l.id === Number(lessonId));
      if (found) {
        data = JSON.parse(JSON.stringify(found));
        const prog = getLocalLessonProgress(lessonId);
        data.user_progress = prog || { is_completed: false, exercise_passed: false };
        break;
      }
    }
  }

  if (!data) return;
  currentTextbookLesson = data;

  if (lessonChapterLabel) lessonChapterLabel.textContent = `第${data.chapter_order}章: ${data.chapter_title || ""}`;
  if (lessonTimeBadge) lessonTimeBadge.textContent = `読了目安: ${data.reading_time_minutes || 5}分`;
  if (lessonTitle) lessonTitle.textContent = data.title;
  if (lessonContent) lessonContent.innerHTML = data.content_html;

  // 重要ポイント
  if (lessonTakeawaysList) {
    const takeaways = data.key_takeaways || [];
    lessonTakeawaysList.innerHTML = takeaways.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  }

  // サンプルコード
  if (lessonExampleCode) {
    lessonExampleCode.textContent = data.example_code || "# サンプルコードはありません";
    if (window.Prism) {
      window.Prism.highlightElement(lessonExampleCode);
    }
  }
  if (lessonExampleOutput) {
    lessonExampleOutput.classList.add("hidden");
    lessonExampleOutput.innerHTML = "";
  }

  // 演習問題
  const ex = data.exercise;
  if (ex) {
    if (exerciseTitle) exerciseTitle.textContent = ex.title;
    if (exerciseDesc) exerciseDesc.innerHTML = ex.description;
    const initialCode = data.user_progress && data.user_progress.saved_code ? data.user_progress.saved_code : ex.template;
    exerciseRichEditor.setValue(initialCode || "");

    if (exerciseSolutionCode) exerciseSolutionCode.textContent = ex.solution_code || "";
    if (exerciseSolutionExp) exerciseSolutionExp.textContent = ex.explanation || "";
    if (exerciseStatusBadge) {
      const passed = data.user_progress && (data.user_progress.exercise_passed || data.user_progress.is_completed || data.user_progress.is_skipped_by_assessment);
      exerciseStatusBadge.textContent = passed ? "合格・マスター" : "未クリア";
      exerciseStatusBadge.className = `px-2.5 py-0.5 ${passed ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"} text-xs font-bold rounded`;
    }
  }

  if (exerciseSolutionPanel) exerciseSolutionPanel.classList.add("hidden");
  if (exerciseResults) {
    exerciseResults.classList.add("hidden");
    exerciseResults.innerHTML = "";
  }

  // ツリーの選択ハイライトを更新
  renderTextbookTree(textbookChapters);
}

window.loadLesson = loadLesson;

async function loadLessonByChapter(chapterOrder) {
  if (!textbookChapters || textbookChapters.length === 0) {
    await loadTextbookRoadmap();
  }
  const ch = textbookChapters.find((c) => c.order === Number(chapterOrder));
  if (ch && ch.lessons && ch.lessons.length > 0) {
    loadLesson(ch.lessons[0].id);
  }
}

// サンプルコード実行ボタン
if (lessonRunExampleBtn) {
  lessonRunExampleBtn.onclick = () => {
    if (!currentTextbookLesson || !currentTextbookLesson.example_code) return;
    try {
      if (typeof window.run_python_interactive === "function") {
        const res = JSON.parse(window.run_python_interactive(currentTextbookLesson.example_code));
        if (lessonExampleOutput) {
          lessonExampleOutput.textContent = res.stdout || res.error || "（実行完了・出力なし）";
          lessonExampleOutput.classList.remove("hidden");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
}

// 模範解答表示トグル
if (exerciseSolutionToggleBtn) {
  exerciseSolutionToggleBtn.onclick = () => {
    if (exerciseSolutionPanel) {
      exerciseSolutionPanel.classList.toggle("hidden");
    }
  };
}

// 演習課題の実行・採点ボタン
if (exerciseTestBtn) {
  exerciseTestBtn.onclick = async () => {
    if (!currentTextbookLesson || !currentTextbookLesson.exercise) return;
    const ex = currentTextbookLesson.exercise;
    const userCode = exerciseEditor ? exerciseEditor.value : "";

    showAiLoader("演習コードを採点中...", "テストケースを実行しています。");
    let runResult = null;
    try {
      if (typeof window.run_python_tests === "function") {
        const payload = JSON.stringify({
          type: ex.problem_type || "function",
          setup_code: ex.setup_code || "",
          test_cases: ex.test_cases || [],
        });
        const rawJson = window.run_python_tests(userCode, payload);
        runResult = JSON.parse(rawJson);
      }
    } catch (e) {
      console.error(e);
    }
    hideAiLoader();

    if (!runResult || runResult.error) {
      if (exerciseResults) {
        exerciseResults.innerHTML = `<div class="p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 rounded-lg text-xs border border-rose-200">エラー: ${escapeHtml(runResult ? runResult.error : "実行に失敗しました。")}</div>`;
        exerciseResults.classList.remove("hidden");
      }
      return;
    }

    const tests = runResult.tests || [];
    const allPassed = tests.length > 0 && tests.every((t) => t.pass);

    if (allPassed) {
      if (exerciseResults) {
        exerciseResults.innerHTML = `<div class="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs border border-emerald-200 font-bold">全テストケース合格！単元マスターです！</div>`;
        exerciseResults.classList.remove("hidden");
      }
      notify("演習問題合格！単元完了を記録しました。", "success");

      // ローカル保存
      saveLocalLessonProgress(currentTextbookLesson.id, {
        is_completed: true,
        exercise_passed: true,
        saved_code: userCode,
      });

      // APIに進捗保存
      await apiRequest(`/curriculum/lessons/${currentTextbookLesson.id}/complete/`, "POST", {
        user_identifier: currentUserId,
        exercise_passed: true,
        saved_code: userCode,
      });

      // ロードマップ再読込
      loadTextbookRoadmap();
    } else {
      if (exerciseResults) {
        exerciseResults.innerHTML = `<div class="p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 rounded-lg text-xs border border-rose-200">不合格のケースがあります。コードを見直してみましょう。</div>`;
        exerciseResults.classList.remove("hidden");
      }
      notify("テストケースに不一致があります。", "warning");
    }
  };
}

// 単元完了して次へボタン
if (lessonCompleteNextBtn) {
  lessonCompleteNextBtn.onclick = async () => {
    if (!currentTextbookLesson) return;
    const userCode = exerciseEditor ? exerciseEditor.value : "";

    // ローカル保存
    saveLocalLessonProgress(currentTextbookLesson.id, {
      is_completed: true,
      exercise_passed: false,
      saved_code: userCode,
    });

    // 完了登録
    await apiRequest(`/curriculum/lessons/${currentTextbookLesson.id}/complete/`, "POST", {
      user_identifier: currentUserId,
      exercise_passed: false,
      saved_code: userCode,
    });

    notify("単元を完了しました！次のステップへ進みます。", "success");
    await loadTextbookRoadmap();

    // 次の単元を探して移動
    let foundCurrent = false;
    let nextLessonId = null;

    for (const ch of textbookChapters) {
      for (const l of ch.lessons) {
        if (foundCurrent) {
          nextLessonId = l.id;
          break;
        }
        if (l.id === currentTextbookLesson.id) {
          foundCurrent = true;
        }
      }
      if (nextLessonId) break;
    }

    if (nextLessonId) {
      loadLesson(nextLessonId);
    } else {
      notify("おめでとうございます！全カリキュラムを完了しました！", "success");
    }
  };
}

// 初回起動
setActiveMode("assessment");

