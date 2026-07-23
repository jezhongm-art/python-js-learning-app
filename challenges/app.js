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
// 1. CHALLENGE DATABASE
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
    description: `2つの引数 \`a\` と \`b\` を受け取り、その合計を返す関数 \`sum\` を作成してください。

### 引数
- \`a\` (Number): 1つ目の数値
- \`b\` (Number): 2つ目の数値

### 戻り値
- Number: 2つの数値の合計`,
    template: `function sum(a, b) {\n    // ここにコードを記述してください\n    \n}`,
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

### 引数
- \`arr\` (Array of Numbers): 数値の配列

### 戻り値
- Number または null: 配列内の最大値、または \`null\``,
    template: `function findMax(arr) {\n    // ここにコードを記述してください\n    \n}`,
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

### 引数
- \`str\` (String): 元の文字列

### 戻り値
- String: 反転した文字列`,
    template: `function reverseString(str) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "reverseString",
    testCases: [
      { input: ["hello"], expected: "olleh", inputLabel: 'reverseString("hello")' },
      { input: ["JavaScript"], expected: "tpircSavaJ", inputLabel: 'reverseString("JavaScript")' },
      { input: ["a"], expected: "a", inputLabel: 'reverseString("a")' },
      { input: [""], expected: "", inputLabel: 'reverseString("")' }
    ]
  },
  {
    id: "is-even",
    title: "4. 偶数判定",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `整数 \`n\` を受け取り、偶数であれば \`true\`、奇数であれば \`false\` を返す関数 \`isEven\` を作成してください。

### 引数
- \`n\` (Number): 判定する整数

### 戻り値
- Boolean: 偶数なら \`true\`、奇数なら \`false\``,
    template: `function isEven(n) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "isEven",
    testCases: [
      { input: [4], expected: true, inputLabel: "isEven(4)" },
      { input: [7], expected: false, inputLabel: "isEven(7)" },
      { input: [0], expected: true, inputLabel: "isEven(0)" },
      { input: [-2], expected: true, inputLabel: "isEven(-2)" }
    ]
  },
  {
    id: "sum-array",
    title: "5. 配列の合計",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `数値の配列 \`arr\` を受け取り、そのすべての要素の合計を返す関数 \`sumArray\` を作成してください。
空の配列が渡された場合は \`0\` を返してください。

### 引数
- \`arr\` (Array of Numbers): 数値の配列

### 戻り値
- Number: 要素の合計値`,
    template: `function sumArray(arr) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "sumArray",
    testCases: [
      { input: [[1, 2, 3, 4]], expected: 10, inputLabel: "sumArray([1, 2, 3, 4])" },
      { input: [[-1, 1]], expected: 0, inputLabel: "sumArray([-1, 1])" },
      { input: [[]], expected: 0, inputLabel: "sumArray([])" },
      { input: [[42]], expected: 42, inputLabel: "sumArray([42])" }
    ]
  },
  {
    id: "count-char",
    title: "6. 特定文字のカウント",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `文字列 \`str\` と1文字の文字列 \`char\` を受け取り、\`str\` の中に \`char\` が何回出現するかをカウントして返す関数 \`countChar\` を作成してください。

### 引数
- \`str\` (String): 検索対象の文字列
- \`char\` (String): カウントする1文字

### 戻り値
- Number: 出現回数`,
    template: `function countChar(str, char) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "countChar",
    testCases: [
      { input: ["hello world", "l"], expected: 3, inputLabel: 'countChar("hello world", "l")' },
      { input: ["javascript", "a"], expected: 2, inputLabel: 'countChar("javascript", "a")' },
      { input: ["abc", "z"], expected: 0, inputLabel: 'countChar("abc", "z")' },
      { input: ["", "a"], expected: 0, inputLabel: 'countChar("", "a")' }
    ]
  },
  {
    id: "fizz-buzz",
    title: "7. FizzBuzz配列の生成",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `整数 \`n\` を受け取り、1から \`n\` までの数値に対する FizzBuzz の結果を配列として返す関数 \`fizzBuzz\` を作成してください。

- 3の倍数のときは \`"Fizz"\`
- 5の倍数のときは \`"Buzz"\`
- 3と5の公倍数のときは \`"FizzBuzz"\`
- それ以外のときはそのままの数値（Number型）

### 引数
- \`n\` (Number): 最大値となる整数

### 戻り値
- Array: FizzBuzzの条件に従って変換された要素のリスト`,
    template: `function fizzBuzz(n) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "fizzBuzz",
    testCases: [
      { input: [5], expected: [1, 2, "Fizz", 4, "Buzz"], inputLabel: "fizzBuzz(5)" },
      { input: [15], expected: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"], inputLabel: "fizzBuzz(15)" },
      { input: [1], expected: [1], inputLabel: "fizzBuzz(1)" }
    ]
  },
  {
    id: "is-palindrome",
    title: "8. 回文判定",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `文字列 \`str\` を受け取り、それが回文（前から読んでも後ろから読んでも同じ文字列）であれば \`true\`、そうでなければ \`false\` を返す関数 \`isPalindrome\` を作成してください。
※大文字・小文字は区別し、空白も1文字として扱います。

### 引数
- \`str\` (String): 判定対象の文字列

### 戻り値
- Boolean: 回文であれば \`true\`、そうでなければ \`false\``,
    template: `function isPalindrome(str) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "isPalindrome",
    testCases: [
      { input: ["racecar"], expected: true, inputLabel: 'isPalindrome("racecar")' },
      { input: ["hello"], expected: false, inputLabel: 'isPalindrome("hello")' },
      { input: ["a"], expected: true, inputLabel: 'isPalindrome("a")' },
      { input: [""], expected: true, inputLabel: 'isPalindrome("")' }
    ]
  },
  {
    id: "remove-duplicates",
    title: "9. 配列の重複除去",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `配列 \`arr\` を受け取り、重複する要素を取り除いた新しい配列を返す関数 \`removeDuplicates\` を作成してください。
元の要素の出現順序は維持してください。

### 引数
- \`arr\` (Array): 任意の要素を含む配列

### 戻り値
- Array: 重複が除去された新しい配列`,
    template: `function removeDuplicates(arr) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "removeDuplicates",
    testCases: [
      { input: [[1, 2, 2, 3, 3, 4]], expected: [1, 2, 3, 4], inputLabel: "removeDuplicates([1, 2, 2, 3, 3, 4])" },
      { input: [["a", "b", "a", "c"]], expected: ["a", "b", "c"], inputLabel: 'removeDuplicates(["a", "b", "a", "c"])' },
      { input: [[1, 1, 1]], expected: [1], inputLabel: "removeDuplicates([1, 1, 1])" },
      { input: [[]], expected: [], inputLabel: "removeDuplicates([])" }
    ]
  },
  {
    id: "count-words",
    title: "10. 単語数のカウント",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `半角スペースで区切られた英語の文章 \`str\` を受け取り、含まれる単語の数を返す関数 \`countWords\` を作成してください。
※連続するスペースや、先頭・末尾のスペースは無視して正しく単語数だけをカウントしてください。

### 引数
- \`str\` (String): 英語の文章

### 戻り値
- Number: 含まれる単語の数`,
    template: `function countWords(str) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "countWords",
    testCases: [
      { input: ["hello world"], expected: 2, inputLabel: 'countWords("hello world")' },
      { input: ["  javascript  is   fun  "], expected: 3, inputLabel: 'countWords("  javascript  is   fun  ")' },
      { input: ["single"], expected: 1, inputLabel: 'countWords("single")' },
      { input: [""], expected: 0, inputLabel: 'countWords("")' },
      { input: ["   "], expected: 0, inputLabel: 'countWords("   ")' }
    ]
  },
  {
    id: "factorial",
    title: "11. 階乗の計算",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `非負の整数 \`n\` を受け取り、その階乗（n!）を返す関数 \`factorial\` を作成してください。
※0の階乗は 1 とします。

### 引数
- \`n\` (Number): 非負の整数

### 戻り値
- Number: \`n\` の階乗`,
    template: `function factorial(n) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "factorial",
    testCases: [
      { input: [5], expected: 120, inputLabel: "factorial(5)" },
      { input: [3], expected: 6, inputLabel: "factorial(3)" },
      { input: [0], expected: 1, inputLabel: "factorial(0)" },
      { input: [1], expected: 1, inputLabel: "factorial(1)" }
    ]
  },
  {
    id: "fibonacci",
    title: "12. フィボナッチ数列",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `非負の整数 \`n\` を受け取り、フィボナッチ数列の \`n\` 番目の数値を返す関数 \`fibonacci\` を作成してください。
※0番目は 0、1番目は 1、それ以降は前の2つの数の和とします。

### 引数
- \`n\` (Number): 取得したい位置のインデックス

### 戻り値
- Number: フィボナッチ数列の \`n\` 番目の数値`,
    template: `function fibonacci(n) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "fibonacci",
    testCases: [
      { input: [0], expected: 0, inputLabel: "fibonacci(0)" },
      { input: [1], expected: 1, inputLabel: "fibonacci(1)" },
      { input: [5], expected: 5, inputLabel: "fibonacci(5)" },
      { input: [10], expected: 55, inputLabel: "fibonacci(10)" }
    ]
  },
  {
    id: "is-anagram",
    title: "13. アナグラム判定",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `2つの文字列 \`str1\` と \`str2\` を受け取り、それらがアナグラム（文字の並び替えで一致する）であれば \`true\`、そうでなければ \`false\` を返す関数 \`isAnagram\` を作成してください。

### 引数
- \`str1\` (String): 1つ目の文字列
- \`str2\` (String): 2つ目の文字列

### 戻り値
- Boolean: アナグラムであれば \`true\`、そうでなければ \`false\``,
    template: `function isAnagram(str1, str2) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "isAnagram",
    testCases: [
      { input: ["listen", "silent"], expected: true, inputLabel: 'isAnagram("listen", "silent")' },
      { input: ["hello", "world"], expected: false, inputLabel: 'isAnagram("hello", "world")' },
      { input: ["rat", "car"], expected: false, inputLabel: 'isAnagram("rat", "car")' },
      { input: ["", ""], expected: true, inputLabel: 'isAnagram("", "")' }
    ]
  },
  {
    id: "chunk-array",
    title: "14. 配列のチャンク分割",
    difficulty: "上級",
    difficultyColor: "bg-rose-100 text-rose-800",
    description: `配列 \`arr\` と整数 \`size\` を受け取り、配列を \`size\` ごとの小さな配列（チャンク）に分割した二次元配列を返す関数 \`chunkArray\` を作成してください。

### 引数
- \`arr\` (Array): 分割する元の配列
- \`size\` (Number): チャンクの最大サイズ (1以上)

### 戻り値
- Array: チャンク化された二次元配列`,
    template: `function chunkArray(arr, size) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "chunkArray",
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]], inputLabel: "chunkArray([1, 2, 3, 4, 5], 2)" },
      { input: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]], inputLabel: "chunkArray([1, 2, 3, 4], 2)" },
      { input: [[1, 2], 3], expected: [[1, 2]], inputLabel: "chunkArray([1, 2], 3)" },
      { input: [[], 2], expected: [], inputLabel: "chunkArray([], 2)" }
    ]
  },
  {
    id: "invert-object",
    title: "15. オブジェクトの反転",
    difficulty: "上級",
    difficultyColor: "bg-rose-100 text-rose-800",
    description: `オブジェクト \`obj\` を受け取り、そのキーと値を反転させた新しいオブジェクトを返す関数 \`invertObject\` を作成してください。
※値はすべて文字列または数値として一意であると仮定して構いません。

### 引数
- \`obj\` (Object): 反転対象のオブジェクト

### 戻り値
- Object: キーと値が反転した新しいオブジェクト`,
    template: `function invertObject(obj) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "invertObject",
    testCases: [
      { input: [{ a: "1", b: "2" }], expected: { "1": "a", "2": "b" }, inputLabel: 'invertObject({ a: "1", b: "2" })' },
      { input: [{ name: "Alice", age: 25 }], expected: { "Alice": "name", "25": "age" }, inputLabel: 'invertObject({ name: "Alice", age: 25 })' },
      { input: [{}], expected: {}, inputLabel: "invertObject({})" }
    ]
  },
  {
    id: "create-button",
    title: "16. DOMの生成 (ボタン作成)",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `JavaScriptの **DOM API** の練習です。
ボタンのテキスト \`text\` を受け取り、\`document.createElement\` を使って \`<button>\` 要素を作成してください。
さらに、そのボタンに \`"primary-btn"\` というクラス名を付与し、最後に作成した要素の **\`outerHTML\`（HTML文字列）** を返す関数 \`createButton\` を作成してください。

### 引数
- \`text\` (String): ボタンのテキスト内容

### 戻り値
- String: 生成されたボタン要素のHTML文字列 (\`outerHTML\`)`,
    template: `function createButton(text) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "createButton",
    testCases: [
      { input: ["送信"], expected: '<button class="primary-btn">送信</button>', inputLabel: 'createButton("送信")' },
      { input: ["Click"], expected: '<button class="primary-btn">Click</button>', inputLabel: 'createButton("Click")' }
    ]
  },
  {
    id: "create-list",
    title: "17. 動的リストの構築 (DOM操作)",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `文字列の配列 \`items\` を受け取り、\`document.createElement\` を使って \`<ul>\` 要素を作成してください。
配列の各要素を \`<li>\` 要素として作成し、\`<ul>\` に \`appendChild\` で追加してください。
最後に作成した \`<ul>\` 要素の **\`outerHTML\`** を返す関数 \`createList\` を作成してください。

### 引数
- \`items\` (Array of Strings): リストアイテムの配列

### 戻り値
- String: 生成されたリスト要素のHTML文字列 (\`outerHTML\`)`,
    template: `function createList(items) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "createList",
    testCases: [
      { input: [["りんご", "みかん"]], expected: "<ul><li>りんご</li><li>みかん</li></ul>", inputLabel: 'createList(["りんご", "みかん"])' },
      { input: [[]], expected: "<ul></ul>", inputLabel: "createList([])" },
      { input: [["A", "B", "C"]], expected: "<ul><li>A</li><li>B</li><li>C</li></ul>", inputLabel: 'createList(["A", "B", "C"])' }
    ]
  },
  {
    id: "update-element",
    title: "18. DOM要素の内容更新",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `HTML文字列 \`htmlStr\` と新しいテキスト \`newText\` を受け取る関数 \`updateElement\` を作成してください。

関数内で \`document.createElement("div")\` を使って一時的なラッパー要素を作成し、そこに \`innerHTML\` を使って \`htmlStr\` を流し込みます。
その後、流し込んだ要素（\`firstChild\` などで取得）の \`textContent\` を \`newText\` に書き換え、更新後の要素の **\`outerHTML\`** を返してください。

### 引数
- \`htmlStr\` (String): 元となる単一のHTML要素の文字列
- \`newText\` (String): 書き換える新しいテキスト

### 戻り値
- String: テキストが書き換えられた要素のHTML文字列 (\`outerHTML\`)`,
    template: `function updateElement(htmlStr, newText) {\n    // ここにコードを記述してください\n    // ヒント: divなどの一時要素を作って innerHTML を使いましょう。\n}`,
    functionName: "updateElement",
    testCases: [
      { input: ["<span>古いテキスト</span>", "新しいテキスト"], expected: "<span>新しいテキスト</span>", inputLabel: 'updateElement("<span>古いテキスト</span>", "新しいテキスト")' },
      { input: ["<h1 class='title'>Hello</h1>", "Bye"], expected: '<h1 class="title">Bye</h1>', inputLabel: 'updateElement("<h1 class=\'title\'>Hello</h1>", "Bye")' }
    ]
  },
  {
    id: "dom-text-change",
    title: "19. 実戦DOM操作: テキストの書き換え",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `画面上にある \`<h1 id="greeting">Hello World</h1>\` 要素のテキスト（\`textContent\`）を \`"こんにちは、JavaScript!"\` に書き換える関数 \`updateGreeting\` を作成してください。

### ヒント
- \`document.getElementById("greeting")\` や \`document.querySelector("#greeting")\` を使用します。`,
    template: `function updateGreeting() {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "updateGreeting",
    htmlFixture: `<h1 id="greeting">Hello World</h1>`,
    testCases: [
      { input: [], domCheck: 'document.querySelector("#greeting").textContent', expected: "こんにちは、JavaScript!", inputLabel: 'updateGreeting() -> #greeting.textContent' }
    ]
  },
  {
    id: "dom-toggle-class",
    title: "20. 実戦DOM操作: クラスの追加・判定",
    difficulty: "初級",
    difficultyColor: "bg-emerald-100 text-emerald-800",
    description: `IDが \`"submit-btn"\` のボタン要素にクラス名 \`"active"\` を追加する関数 \`activateButton\` を作成してください。

### ヒント
- \`element.classList.add("active")\` を使用します。`,
    template: `function activateButton() {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "activateButton",
    htmlFixture: `<button id="submit-btn" class="btn">送信する</button>`,
    testCases: [
      { input: [], domCheck: 'document.querySelector("#submit-btn").classList.contains("active")', expected: true, inputLabel: 'activateButton() -> #submit-btn has class "active"' }
    ]
  },
  {
    id: "dom-append-list",
    title: "21. 実戦DOM操作: 動的リスト(ul/li)の生成",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `文字列の配列 \`items\` を受け取り、IDが \`"item-list"\` の \`<ul>\` 要素の中に、各要素を \`<li>\` タグとして追加する関数 \`renderList(items)\` を作成してください。

### 引数
- \`items\` (Array of Strings): リストに追加する文字列の配列`,
    template: `function renderList(items) {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "renderList",
    htmlFixture: `<ul id="item-list"></ul>`,
    testCases: [
      { input: [["りんご", "みかん", "バナナ"]], domCheck: 'Array.from(document.querySelectorAll("#item-list li")).map(li => li.textContent)', expected: ["りんご", "みかん", "バナナ"], inputLabel: 'renderList(["りんご", "みかん", "バナナ"])' },
      { input: [["A", "B"]], domCheck: 'Array.from(document.querySelectorAll("#item-list li")).map(li => li.textContent)', expected: ["A", "B"], inputLabel: 'renderList(["A", "B"])' }
    ]
  },
  {
    id: "dom-calc-form",
    title: "22. 実戦DOM操作: フォーム計算結果の表示",
    difficulty: "中級",
    difficultyColor: "bg-amber-100 text-amber-800",
    description: `ID \`"num1"\` と \`"num2"\` の \`<input>\` 要素に入力された数値を取得・加算し、ID \`"result"\` の要素にその合計値をセットする関数 \`calculateTotal()\` を作成してください。

### ヒント
- \`input\` の値は文字列（\`value\`）で取得されるため、\`Number(val)\` で数値に変換してください。`,
    template: `function calculateTotal() {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "calculateTotal",
    htmlFixture: `<div class="flex gap-2 items-center"><input id="num1" value="100" class="border p-1 rounded w-20"> + <input id="num2" value="200" class="border p-1 rounded w-20"> = <span id="result" class="font-bold"></span></div>`,
    testCases: [
      { input: [], domCheck: 'document.querySelector("#result").textContent', expected: "300", inputLabel: 'calculateTotal() -> #result.textContent' }
    ]
  },
  {
    id: "dom-remove-ad",
    title: "23. 実戦DOM操作: 特定要素の削除",
    difficulty: "上級",
    difficultyColor: "bg-rose-100 text-rose-800",
    description: `クラス名 \`"ad-banner"\` を持つ要素を画面（DOM）から削除する関数 \`removeAds()\` を作成してください。

### ヒント
- \`element.remove()\` を使用します。`,
    template: `function removeAds() {\n    // ここにコードを記述してください\n    \n}`,
    functionName: "removeAds",
    htmlFixture: `<div id="content"><div class="ad-banner bg-amber-100 p-2 rounded mb-2 text-xs">広告: 限定セール中！</div><p>大切な本文です。</p></div>`,
    testCases: [
      { input: [], domCheck: 'document.querySelector(".ad-banner")', expected: null, inputLabel: 'removeAds() -> .ad-banner element removed' }
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
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`,
    hasKey: !!key,
  };
}

/**
 * Call Gemini API as an SSE stream.
 */
async function callGeminiStream(systemPrompt, userPromptOrContents, onChunk) {
  const cfg = getGeminiConfig();
  const streamUrl = cfg.url.replace(":generateContent", ":streamGenerateContent") + "&alt=sse";

  if (!cfg.hasKey) {
    apiKeyPanel.classList.remove("hidden");
    throw new Error("Gemini APIキーが設定されていません。画面右上の「APIキー」ボタンから設定してください。");
  }

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
  easy:   ["DOM要素テキスト変更", "DOM要素のクラス追加・削除", "FizzBuzz", "文字列カウント", "偶数/奇数判定", "配列の合計"],
  medium: ["DOMリスト(ul/li)動的生成", "DOMフォーム入力の計算・表示", "フィボナッチ数列", "素数判定", "配列の重複除去", "文字列の回文チェック"],
  hard:   ["DOM要素の動的削除・置換", "メモ化再帰", "クロージャカウンタ", "Promiseチェーン", "カスタムイテレータ"],
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
    easy:   "初心者向け。基本的な演算子やループ、条件分岐、または単純なDOM要素のテキスト書き換えやクラス操作。",
    medium: "中級者向け。配列メソッド（map, filter, reduce）、文字列操作、またはDOMリスト生成やフォーム値の取得・動的計算。",
    hard:   "上級者向け。クロージャ、再帰、非同期処理、またはDOMノードの動的追加・削除・要素置換が必要な本格的な問題。",
  }[difficulty];

  const systemPrompt = `あなたはJavaScriptプログラミングの試験問題設計の専門家です。
指定された難易度とテーマに厳密に合致した、ブラウザ上で動的テスト可能なコーディング問題（関数の戻り値判定問題、またはHTML DOM操作問題）を1問設計してください。
必ず指定のJSONスキーマに従ったレスポンスを返してください。`;

  // プロンプトを強化し、テンプレートに必ず改行を含めるよう指示
  const userPrompt = `難易度: ${meta.label}
テーマ: ${topic}
難易度設計基準: ${diffConstraint}

以下のJSONスキーマで問題を1問生成してください。
アルゴリズム関数問題、またはHTMLのDOM操作問題（htmlFixtureとdomCheckを含む問題）のいずれかを設計してください。
DOM操作問題の場合は、必ず htmlFixture（例: '<h1 id="title">Old Title</h1>'）と、各testCaseに domCheck（例: 'document.querySelector("#title").textContent'）を含めてください。
testCasesは4件以上（またはDOM問題の場合は1〜4件の検証）を含めること。
functionNameは英語のキャメルケースで、descriptionはHTMLタグ（<p>,<code>,<ul>,<li>,<h3>）を使用してください。
【必須】templateは必ず関数の開き波括弧の後に改行(\\n)を入れた3行以上の複数行コードにしてください。`;

  const schema = {
    type: "OBJECT",
    properties: {
      title:        { type: "STRING", description: "課題のタイトル（日本語）" },
      functionName: { type: "STRING", description: "実装すべき関数名（英語キャメルケース）" },
      description:  { type: "STRING", description: "HTML形式の詳細な問題説明" },
      template:     { type: "STRING", description: "初期コードテンプレート。必ず改行(\\n)を入れた複数行で指定（例: 'function foo() {\\n    // ここにコードを記述してください\\n    \\n}'）" },
      htmlFixture:  { type: "STRING", description: "DOM操作問題の場合、操作対象となる初期HTMLコード。関数問題の場合は空文字列" },
      testCases: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            input:      { type: "ARRAY", items: {}, description: "関数への引数リスト" },
            expected:   { description: "期待される戻り値、またはDOM操作後の期待値" },
            domCheck:   { type: "STRING", description: "DOM操作問題の場合、操作後のDOM状態を取得して検証するJavaScript評価式（例: 'document.querySelector(\"#title\").textContent'）。関数問題の場合は空文字列" },
            inputLabel: { type: "STRING", description: "テストの表示ラベル（例: updateTitle() -> #title.textContent）" },
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
    const cleanFnName = parsed.functionName ? parsed.functionName.replace(/[^\w$]/g, "") : "solution";

    let cleanTestCases = Array.isArray(parsed.testCases) ? parsed.testCases : [];
    cleanTestCases = cleanTestCases.map((tc, idx) => {
      let input = tc.input;
      if (!Array.isArray(input)) {
        input = input === undefined || input === null ? [] : [input];
      }
      let label = tc.inputLabel;
      if (!label) {
        try {
          label = `${cleanFnName}(${input.map((x) => JSON.stringify(x)).join(", ")})`;
        } catch (e) {
          label = `${cleanFnName}(ケース ${idx + 1})`;
        }
      }
      return {
        input,
        expected: tc.expected,
        inputLabel: label,
      };
    });

    const newId = `ai-${Date.now()}`;
    const newChallenge = {
      id:              newId,
      title:           `[AI] ${parsed.title}`,
      difficulty:      meta.label,
      difficultyColor: meta.color,
      description:     parsed.description ? parsed.description.replace(/\\n/g, "\n") : "",
      htmlFixture:     parsed.htmlFixture ? parsed.htmlFixture.replace(/\\n/g, "\n") : "",
      template:        cleanTemplate,
      functionName:    cleanFnName,
      testCases:       cleanTestCases,
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
// 8. AI CODING COACH（省略化JSON履歴・高速マルチターン対応）
// ============================================================
let jsCoachHistoryLogs = [];

function summarizeCoachAdvice(text) {
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
これは連続する指導セッションです。過去の指導履歴（JSON形式）を参照し、生徒の進歩を認めつつ、次のステップを指導してください。

【絶対ルール】
1. 解答コードをそのまま提示することは絶対に禁止です。
2. 「何を使えばよいか」「なぜ現在の実装が問題か」を論理的に説明してください。
3. ヒントはステップ形式で提示し、学習者が自分で気づけるよう誘導してください。
4. コードの一部のみを示す場合も、完全な解答にならないようにしてください。
5. 日本語で、親しみやすいトーンで回答してください。
6. 過去の指導からコードが改善されている場合は、具体的にどこが良くなったかを褒めてから、次の改善点を指摘してください。`;

  let userPrompt = "";

  if (jsCoachHistoryLogs.length === 0) {
    userPrompt = `【課題タイトル】${ch.title}

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
  } else {
    const historyJson = JSON.stringify(jsCoachHistoryLogs, null, 2);
    userPrompt = `【課題タイトル】${ch.title}
【問題説明】
${ch.description.replace(/<[^>]+>/g, "")}

【これまでの指導履歴（JSON形式・省サイズ）】:
\`\`\`json
${historyJson}
\`\`\`

【ユーザーの最新コード】:
\`\`\`javascript
${userCode}
\`\`\`

【現在のテスト実行結果】:
${testResultSummary}

これまでの指導履歴（JSON）と現在の最新コードを比較し、生徒のコードの改善点を具体的に褒めた上で、次に修正すべきポイントやヒントを簡潔にMarkdown形式でアドバイスしてください。`;
  }

  try {
    let aiResponseText = "";
    await callGeminiStream(systemPrompt, userPrompt, (fullText) => {
      aiResponseText = fullText;
      aiCoachContent.innerHTML = DOMPurify.sanitize(marked.parse(fullText));
    });

    // 指導履歴に省略化JSONオブジェクトとして記録
    jsCoachHistoryLogs.push({
      turn: jsCoachHistoryLogs.length + 1,
      submittedCode: userCode.length > 250 ? userCode.slice(0, 247) + "..." : userCode,
      adviceSummary: summarizeCoachAdvice(aiResponseText),
      testResult: lastTestResults ? `${lastTestResults.filter(r => r.pass).length}/${lastTestResults.length} PASS` : "未実行"
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

  const domFixtureContainer = document.getElementById("dom-fixture-container");
  const sandboxArea = document.getElementById("sandbox-area");
  if (ch.htmlFixture && domFixtureContainer && sandboxArea) {
    domFixtureContainer.classList.remove("hidden");
    sandboxArea.innerHTML = ch.htmlFixture;
  } else if (domFixtureContainer) {
    domFixtureContainer.classList.add("hidden");
  }

  const savedCode = localStorage.getItem(`js_challenge_${ch.id}`);
  codeEditor.value = savedCode !== null ? savedCode : ch.template;

  resultContainer.classList.add("hidden");
  aiCoachPanel.classList.add("hidden");
  aiReviewPanel.classList.add("hidden");
  stdoutContainer.classList.add("hidden");
  stdoutTerminal.textContent = "";
  // 問題切り替え時にコーチ会話履歴（JSONログ）をリセット
  jsCoachHistoryLogs = [];

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

      const domFixtureContainer = document.getElementById("dom-fixture-container");
      const sandboxArea = document.getElementById("sandbox-area");
      if (ch.htmlFixture && sandboxArea) {
        sandboxArea.innerHTML = ch.htmlFixture;
      }
    }
  };

  // Run tests
  runBtn.onclick = runJavaScriptTests;
}

// ============================================================
// 13. TEST EXECUTION ENGINE
// ============================================================
function normalizeStringQuote(str) {
  if (typeof str !== "string") return str;
  let s = str.trim();
  while (
    (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) ||
    (s.length >= 2 && s.startsWith("'") && s.endsWith("'"))
  ) {
    try {
      const parsed = JSON.parse(s);
      if (typeof parsed === "string" && parsed !== s) {
        s = parsed;
      } else {
        s = s.slice(1, -1);
      }
    } catch (e) {
      s = s.slice(1, -1);
    }
  }
  return s;
}

function isErrorExpected(expected) {
  if (typeof expected !== "string") return false;
  const s = expected.trim();
  const errorNames = [
    "Error",
    "TypeError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "URIError",
    "EvalError",
  ];
  if (errorNames.includes(s)) return true;
  if (
    s.endsWith("Error") ||
    s.startsWith("Error:") ||
    s.startsWith("エラー:")
  )
    return true;
  return false;
}

function deepEqual(a, b) {
  if (a === b) return true;

  // 数値比較（浮動小数点数の微小誤差の許容）
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-9;
  }

  // 文字列比較（二重引用符の正規化）
  if (typeof a === "string" && typeof b === "string") {
    const cleanA = normalizeStringQuote(a);
    const cleanB = normalizeStringQuote(b);
    return cleanA === cleanB;
  }

  // 型不一致の処理（AI生成のexpectedが文字列化されたJSONやプリミティブの場合）
  if (typeof a !== typeof b) {
    if (typeof b === "string") {
      const cleanB = normalizeStringQuote(b);
      if (typeof a === "string" && a === cleanB) return true;
      if (typeof a === "number" && !isNaN(Number(cleanB)) && a === Number(cleanB)) return true;
      if (typeof a === "boolean" && (cleanB === "true" || cleanB === "false")) return a === (cleanB === "true");

      try {
        const parsedB = JSON.parse(cleanB);
        return deepEqual(a, parsedB);
      } catch (e) {}
    }

    if (typeof a === "string") {
      const cleanA = normalizeStringQuote(a);
      if (typeof b === "string" && cleanA === b) return true;
      if (typeof b === "number" && !isNaN(Number(cleanA)) && Number(cleanA) === b) return true;
      if (typeof b === "boolean" && (cleanA === "true" || cleanA === "false")) return (cleanA === "true") === b;

      try {
        const parsedA = JSON.parse(cleanA);
        return deepEqual(parsedA, b);
      } catch (e) {}
    }

    return false;
  }

  if (a == null || b == null) return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }

  if (typeof a === "object") {
    const kA = Object.keys(a), kB = Object.keys(b);
    if (kA.length !== kB.length) return false;
    return kA.every((k) => kB.includes(k) && deepEqual(a[k], b[k]));
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
    // 1. 指定された functionName で関数の取り出しを試みる
    if (ch.functionName) {
      const cleanFnName = ch.functionName.replace(/[^\w$]/g, "");
      if (cleanFnName) {
        try {
          const compiler = new Function(userCode + `\nreturn typeof ${cleanFnName} !== 'undefined' ? ${cleanFnName} : undefined;`);
          userFunction = compiler();
        } catch (e) {}
      }
    }

    // 2. 見つからない場合、userCode 内で宣言された関数名を抽出して取り出しを試みる
    if (typeof userFunction !== "function") {
      const fnMatches = [...userCode.matchAll(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g)];
      const varMatches = [...userCode.matchAll(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:function|\([^)]*\)\s*=>|\w+\s*=>)/g)];
      const candidates = [...fnMatches.map(m => m[1]), ...varMatches.map(m => m[1])];

      for (const fnName of candidates) {
        try {
          const compiler = new Function(userCode + `\nreturn ${fnName};`);
          const fn = compiler();
          if (typeof fn === "function") {
            userFunction = fn;
            break;
          }
        } catch (e) {}
      }
    }

    // 3. アロー関数や無名関数の直接 return 評価を試みる
    if (typeof userFunction !== "function") {
      try {
        const compiler = new Function(`return (${userCode.trim()});`);
        const fn = compiler();
        if (typeof fn === "function") {
          userFunction = fn;
        }
      } catch (e) {}
    }

    if (typeof userFunction !== "function") {
      const targetName = ch.functionName ? `'${ch.functionName}'` : "解答関数";
      throw new Error(`関数 ${targetName} が定義されていないか、正しく取得できませんでした。`);
    }
  } catch (err) {
    compileError = err.message;
  }

  const results  = [];
  let   allPass  = true;

  if (compileError) {
    allPass = false;
    results.push({ inputLabel: "コンパイル・実行エラー", expected: "正常実行", actual: compileError, pass: false, error: true });
  } else {
    const testCases = Array.isArray(ch.testCases) ? ch.testCases : [];
    const sandboxArea = document.getElementById("sandbox-area");

    testCases.forEach((tc, idx) => {
      // DOM操作問題の場合、各テストケース実行前にHTMLフィクスチャを初期化
      if (ch.htmlFixture && sandboxArea) {
        sandboxArea.innerHTML = ch.htmlFixture;
      }

      let args;
      try {
        args = typeof structuredClone === "function" ? structuredClone(tc.input) : JSON.parse(JSON.stringify(tc.input));
      } catch (e) {
        try {
          args = JSON.parse(JSON.stringify(tc.input));
        } catch (e2) {
          args = tc.input;
        }
      }
      if (!Array.isArray(args)) {
        args = args === undefined || args === null ? [] : [args];
      }

      const inputLabel = tc.inputLabel || `テストケース ${idx + 1}`;

      try {
        let actual = userFunction(...args);

        // DOM操作問題で domCheck または selector/property が指定されている場合、DOMから実際の評価値を取得
        if (tc.domCheck) {
          try {
            const domCheckFn = new Function(`return (${tc.domCheck});`);
            actual = domCheckFn();
          } catch (domErr) {
            actual = `DOM検証エラー: ${domErr.message}`;
          }
        } else if (tc.selector && tc.property) {
          const el = sandboxArea ? sandboxArea.querySelector(tc.selector) : document.querySelector(tc.selector);
          actual = el ? el[tc.property] : null;
        }

        const pass = deepEqual(actual, tc.expected);
        if (!pass) allPass = false;
        results.push({ inputLabel, expected: tc.expected, actual, pass, error: false });
      } catch (runErr) {
        const errType = runErr.name || "Error";
        const errMsg = runErr.message || String(runErr);
        const actualErrStr = `${errType}: ${errMsg}`;
        const isExpErr = isErrorExpected(tc.expected);

        let pass = false;
        if (isExpErr) {
          const expStr = String(tc.expected).trim();
          if (expStr === errType || expStr === "Error" || actualErrStr.includes(expStr) || errMsg.includes(expStr)) {
            pass = true;
          }
        }

        if (!pass) allPass = false;
        results.push({
          inputLabel,
          expected: tc.expected,
          actual: `エラー: ${actualErrStr}`,
          pass,
          error: !pass
        });
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
