/**
 * Python 体系的ステップアップ教科書 マスターデータ (全11章・38単元)
 * 第0章: Python独特の世界観から、基礎・実務・クラス設計・アルゴリズムまでを網羅
 */

const textbookDataChapters = [
  // =========================================================================
  // 第0章: Python独特の世界観と他言語との決定的な違い (3単元)
  // =========================================================================
  {
    id: 0,
    order: 0,
    title: "第0章: Python独特の世界観と他言語との違い",
    subtitle: "インデント構文・動的型付け・Pythonicな思想",
    icon: "academic-cap",
    category: "basic",
    target_level: 1,
    summary: "C/Java/JavaScript等の他言語経験者が最初に戸惑うPython独特の文法ルール、設計思想、そして「Pythonらしい書き方 (Pythonic)」を理解します。",
    lessons: [
      {
        id: 100,
        chapter_id: 0,
        chapter_order: 0,
        chapter_title: "Python独特の世界観と他言語との違い",
        order: 1,
        title: "0.1 波括弧のない世界: インデント構文と構造",
        reading_time_minutes: 5,
        content_html: `
          <h3>Pythonの最大の特徴: インデント (字下げ) でブロックを定義する</h3>
          <p>C言語、Java、JavaScriptなどほとんどの言語では、コードブロックを <code>{}</code> (波括弧) で囲みます。しかし <strong>Pythonには波括弧がありません</strong>。代わりに<strong>インデント（半角スペース4つ）</strong>がコードブロックの境界を示します。</p>

          <h4>他言語との比較</h4>
          <pre><code class="language-python"># --- JavaScript の場合 ---
# if (score >= 80) {
#     console.log("合格");
# } else {
#     console.log("不合格");
# }

# --- Python の場合 ---
score = 85
if score >= 80:       # コロン(:)でブロック開始を宣言
    print("合格")     # インデント(4スペース)=このifブロック内
else:                 # コロン(:)でelseブロック宣言
    print("不合格")   # 同じインデントレベル=elseブロック内

print("処理終了")     # インデント戻し=ブロック外</code></pre>

          <div class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-xs mt-3">
            <strong>重要:</strong> インデントがずれると <code>IndentationError</code> が発生してプログラムが動きません。タブとスペースの混在も禁止です。<strong>常にスペース4つ</strong>を使用してください。
          </div>

          <h4>Pythonにないもの一覧</h4>
          <ul>
            <li><code>{}</code> 波括弧によるブロック定義 → <strong>インデント</strong>で代替</li>
            <li><code>;</code> セミコロン (文末記号) → <strong>改行が文の区切り</strong></li>
            <li><code>var / let / const</code> 変数宣言キーワード → <strong>直接代入するだけ</strong></li>
            <li><code>++</code> / <code>--</code> インクリメント演算子 → <code>x += 1</code> で代用</li>
            <li><code>switch-case</code> 文 → <code>if-elif-else</code> または <code>match-case</code> (3.10+)</li>
          </ul>
        `,
        key_takeaways: [
          "Pythonは波括弧 {} やセミコロン ; を使わず、インデント(4スペース)でブロックを定義する",
          "コロン : がブロック開始の目印。if/for/def/class の行末に必ず付ける",
          "var/let/const は不要。変数名 = 値 で即座に変数が作られる"
        ],
        example_code: "# Pythonのシンプルさを実感\nname = 'Python'\nif name:\n    print(f'{name}は素晴らしい言語です')\n\n# リストのループも極めて簡潔\nfor fruit in ['apple', 'banana', 'cherry']:\n    print(fruit)",
        exercise: {
          id: 100,
          title: "インデント構造の理解チェック",
          description: "<p>引数 <code>x</code> を受け取り、<code>x</code> が正数なら <code>\"positive\"</code>、負数なら <code>\"negative\"</code>、0なら <code>\"zero\"</code> を返す関数 <code>check_sign(x)</code> を、正しいインデントで実装してください。</p>",
          template: "def check_sign(x):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "check_sign(5)", expected: "positive" },
            { input: "check_sign(-3)", expected: "negative" },
            { input: "check_sign(0)", expected: "zero" },
          ],
          solution_code: "def check_sign(x):\n    if x > 0:\n        return \"positive\"\n    elif x < 0:\n        return \"negative\"\n    else:\n        return \"zero\"\n",
          explanation: "if-elif-else の各ブロックが正しくインデントされていることがポイントです。",
        },
      },
      {
        id: 101,
        chapter_id: 0,
        chapter_order: 0,
        chapter_title: "Python独特の世界観と他言語との違い",
        order: 2,
        title: "0.2 動的型付けと万能変数の仕組み",
        reading_time_minutes: 5,
        content_html: `
          <h3>動的型付け (Dynamic Typing) とは</h3>
          <p>JavaやC言語では変数を作るとき <code>int count = 0;</code> のように型を宣言しなければなりませんが、Pythonでは<strong>型宣言が一切不要</strong>です。値を代入した瞬間に型が自動的に決まります。</p>

          <pre><code class="language-python"># 同じ変数に異なる型の値を代入できる（他言語ではエラーになるケースが多い）
x = 42          # int型（整数）
print(type(x))  # <class 'int'>

x = "hello"     # str型（文字列）に変身！
print(type(x))  # <class 'str'>

x = [1, 2, 3]   # list型（リスト）に変身！
print(type(x))  # <class 'list'></code></pre>

          <h4>Python独特の「すべてがオブジェクト」</h4>
          <p>Pythonでは数値 <code>42</code> も文字列 <code>"hello"</code> も、関数すらも<strong>すべてがオブジェクト</strong>です。変数はオブジェクトに貼られた「ラベル（名札）」にすぎません。</p>

          <pre><code class="language-python"># 関数もオブジェクト！変数に代入して使い回せる
def greet(name):
    return f"Hello, {name}!"

say_hello = greet           # 関数オブジェクトを別変数に代入
print(say_hello("World"))   # "Hello, World!"
print(type(greet))          # <class 'function'></code></pre>

          <h4>他言語との型システム比較</h4>
          <table class="w-full text-xs border-collapse mt-2">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-800">
                <th class="border border-slate-300 dark:border-slate-700 p-1.5">特徴</th>
                <th class="border border-slate-300 dark:border-slate-700 p-1.5">Python</th>
                <th class="border border-slate-300 dark:border-slate-700 p-1.5">Java / C</th>
                <th class="border border-slate-300 dark:border-slate-700 p-1.5">JavaScript</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="border border-slate-200 dark:border-slate-700 p-1.5">型宣言</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">不要</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">必須</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">let/const</td></tr>
              <tr><td class="border border-slate-200 dark:border-slate-700 p-1.5">型変更</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">自由</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">不可</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">自由</td></tr>
              <tr><td class="border border-slate-200 dark:border-slate-700 p-1.5">暗黙の型変換</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">厳格 (しない)</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">一部あり</td><td class="border border-slate-200 dark:border-slate-700 p-1.5">大量にある</td></tr>
            </tbody>
          </table>

          <div class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs mt-3">
            <strong>注意:</strong> Pythonは動的型付けですが、JavaScriptのような暗黙の型変換は行いません。<code>"3" + 5</code> は <code>TypeError</code> になります。明示的な変換 <code>int("3") + 5</code> が必要です。
          </div>
        `,
        key_takeaways: [
          "変数は「値への名札（ラベル）」。型宣言は不要で、代入するだけで型が決まる",
          "同じ変数に異なる型の値を再代入できる (動的型付け)",
          "暗黙の型変換はしない。\"3\" + 5 は TypeError になる（JavaScriptとの大きな違い）"
        ],
        example_code: "x = 100\nprint(type(x))  # <class 'int'>\n\nx = 'Python'\nprint(type(x))  # <class 'str'>\n\n# 暗黙変換しない厳格さ\ntry:\n    result = '10' + 5\nexcept TypeError as e:\n    print(f'エラー: {e}')",
        exercise: {
          id: 101,
          title: "type()関数で型を判別する",
          description: "<p>引数 <code>value</code> を受け取り、その型名を文字列で返す関数 <code>get_type_name(value)</code> を実装してください。<br>整数なら <code>\"int\"</code>、文字列なら <code>\"str\"</code>、リストなら <code>\"list\"</code>、それ以外は <code>\"other\"</code> を返してください。</p>",
          template: "def get_type_name(value):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "get_type_name(42)", expected: "int" },
            { input: 'get_type_name("hello")', expected: "str" },
            { input: "get_type_name([1, 2])", expected: "list" },
            { input: "get_type_name(3.14)", expected: "other" },
          ],
          solution_code: "def get_type_name(value):\n    if isinstance(value, int):\n        return \"int\"\n    elif isinstance(value, str):\n        return \"str\"\n    elif isinstance(value, list):\n        return \"list\"\n    else:\n        return \"other\"\n",
          explanation: "isinstance(value, 型) で型判定を行い、対応する文字列を返します。bool は int のサブクラスなので注意が必要です。",
        },
      },
      {
        id: 102,
        chapter_id: 0,
        chapter_order: 0,
        chapter_title: "Python独特の世界観と他言語との違い",
        order: 3,
        title: "0.3 「Pythonらしさ」とは何か: The Zen of Python",
        reading_time_minutes: 5,
        content_html: `
          <h3>Pythonic (パイソニック) という美意識</h3>
          <p>Pythonには「正しいやり方は1つだけあるべき」という哲学があります。ターミナルで <code>import this</code> と入力すると表示される <strong>The Zen of Python（Pythonの禅）</strong> がその精神を表しています。</p>

          <pre><code class="language-python">import this
# Beautiful is better than ugly.       (醜いより美しい方がいい)
# Explicit is better than implicit.    (暗黙より明示的がいい)
# Simple is better than complex.       (複雑より単純がいい)
# Readability counts.                  (読みやすさは正義)</code></pre>

          <h4>他言語では普通だがPythonでは「ダサい」書き方</h4>
          <pre><code class="language-python"># --- ダサい (Non-Pythonic) ---
# リストの要素をインデックスでアクセス
colors = ['red', 'green', 'blue']
i = 0
while i < len(colors):
    print(colors[i])
    i += 1

# --- Pythonic (推奨) ---
for color in colors:
    print(color)

# --- もっとダサい ---
if len(my_list) > 0:    # リストが空でないか判定
    process(my_list)

# --- Pythonic ---
if my_list:              # 空リストは False (Truthy/Falsy の活用)
    process(my_list)</code></pre>

          <h4>Python独特の便利構文まとめ</h4>
          <ul>
            <li><strong>多重代入:</strong> <code>a, b, c = 1, 2, 3</code> (タプルアンパック)</li>
            <li><strong>値の交換:</strong> <code>a, b = b, a</code> (一時変数不要！)</li>
            <li><strong>連続比較:</strong> <code>1 < x < 10</code> (他言語では書けない)</li>
            <li><strong>文字列の乗算:</strong> <code>"Ha" * 3</code> → <code>"HaHaHa"</code></li>
            <li><strong>リストの乗算:</strong> <code>[0] * 5</code> → <code>[0, 0, 0, 0, 0]</code></li>
            <li><strong>in 演算子:</strong> <code>"py" in "python"</code> → <code>True</code></li>
            <li><strong>アンダースコア区切り数値:</strong> <code>1_000_000</code> (100万を読みやすく)</li>
          </ul>
        `,
        key_takeaways: [
          "Pythonには「読みやすく美しいコードこそ正義」という設計哲学がある (The Zen of Python)",
          "a, b = b, a (交換) や 1 < x < 10 (連続比較) など他言語にない便利構文が多数ある",
          "if my_list: のようにTruthy/Falsyを活用し、冗長な len(list) > 0 を避けるのがPythonic"
        ],
        example_code: "# Python独特の便利構文\na, b = 10, 20\na, b = b, a\nprint(f'交換後: a={a}, b={b}')\n\n# 連続比較\nx = 15\nprint(f'{x}は1~20の範囲内: {1 <= x <= 20}')\n\n# 文字列の乗算\nprint('=' * 30)",
        exercise: {
          id: 102,
          title: "Pythonic な値の交換とリスト初期化",
          description: "<p>2つの値 <code>a</code> と <code>b</code> を受け取り、<strong>一時変数を使わずに</strong>交換した結果を <code>(b_value, a_value)</code> タプルで返す関数 <code>swap_values(a, b)</code> と、整数 <code>n</code> を受け取り 0 で初期化された長さ <code>n</code> のリストを返す関数 <code>create_zero_list(n)</code> をそれぞれ1行で実装してください。</p>",
          template: "def swap_values(a, b):\n    # ここにコードを書いてください (1行で！)\n    pass\n\ndef create_zero_list(n):\n    # ここにコードを書いてください (1行で！)\n    pass\n",
          setup_code: "def test_pythonic():\n    s = swap_values(10, 20)\n    z = create_zero_list(5)\n    return (s, z)",
          test_cases: [
            { input: "test_pythonic()", expected: [[20, 10], [0, 0, 0, 0, 0]] },
          ],
          solution_code: "def swap_values(a, b):\n    a, b = b, a\n    return (a, b)\n\ndef create_zero_list(n):\n    return [0] * n\n",
          explanation: "a, b = b, a でPythonic な値の交換を行い、[0] * n でリストの乗算による初期化を行います。",
        },
      },
    ],
  },

  // =========================================================================
  // 第1章: Pythonの第一歩と基本データ型 (4単元)
  // =========================================================================
  {
    id: 1,
    order: 1,
    title: "第1章: Pythonの第一歩と基本データ型",
    subtitle: "変数・数値・文字列・四則演算・型変換のマスター",
    icon: "sparkles",
    category: "basic",
    target_level: 1,
    summary: "Pythonの基本思想、変数の定義、数値型(int, float)、文字列型(str)の操作とf-stringによる美しい文字列フォーマット、型変換を学びます。",
    lessons: [
      {
        id: 1,
        chapter_id: 1,
        chapter_order: 1,
        chapter_title: "Pythonの第一歩と基本データ型",
        order: 1,
        title: "1.1 変数宣言と数値演算・算術の基本",
        reading_time_minutes: 3,
        content_html: `
          <h3>Pythonにおける変数と計算の基礎</h3>
          <p>Pythonでは変数の型宣言（intやletなど）は不要で、値を変数名に代入するだけで自動的に型が決まります。</p>
          <pre><code class="language-python"># 変数の代入と計算
price = 1200
tax_rate = 0.1
total = price * (1 + tax_rate)
print(total) # 1320.0</code></pre>
          <h4>主な算術演算子</h4>
          <ul>
            <li><code>+</code> (加算), <code>-</code> (減算), <code>*</code> (乗算), <code>/</code> (除算・常にfloat型)</li>
            <li><code>//</code> (整数除算・小数点切り捨て), <code>%</code> (余り・剰余), <code>**</code> (べき乗・累乗)</li>
          </ul>
        `,
        key_takeaways: ["代入記号 = で変数を定義", "除算 / は常に float 型を返す", "// は商、% は余りを計算"],
        example_code: "a = 17\nb = 5\nprint('商 (//):', a // b)\nprint('余り (%):', a % b)\nprint('べき乗 (**):', 2 ** 8)",
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
        title: "1.2 文字列操作と f-string フォーマット",
        reading_time_minutes: 4,
        content_html: `
          <h3>文字列の埋め込みとf-string</h3>
          <p>Python 3.6以降の標準である <code>f-string</code> (フォーマット済み文字列リテラル) を使うと、文字列内に <code>{変数名}</code> や <code>{式}</code> を直感的に埋め込めます。</p>
          <pre><code class="language-python">item = "りんご"
count = 3
price = 150
message = f"{item}が{count}個で合計{count * price}円です。"
print(message) # りんごが3個で合計450円です。</code></pre>
          <p>数値の桁揃えや小数点フォーマットも簡単に行えます：<code>f"{price:05d}"</code> (0埋め), <code>f"{3.14159:.2f}"</code> (小数2桁)。</p>
        `,
        key_takeaways: ['f"..." 内で {変数} や {式} を評価可能', "len(str) で文字列の長さを取得", '書式指定子で桁揃えや小数点指定が可能'],
        example_code: "name = 'Python'\nversion = 3.12\nprint(f'Hello, {name} v{version:.1f}!')",
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
      {
        id: 3,
        chapter_id: 1,
        chapter_order: 1,
        chapter_title: "Pythonの第一歩と基本データ型",
        order: 3,
        title: "1.3 文字列メソッドとスライス技法",
        reading_time_minutes: 4,
        content_html: `
          <h3>実務で頻出する文字列メソッド</h3>
          <ul>
            <li><code>s.strip()</code>: 前後の余分な空白や改行を削除</li>
            <li><code>s.split(sep)</code>: 文字列を指定の区切り文字でリストに分割</li>
            <li><code>sep.join(list)</code>: リストの文字列を指定区切り文字で結合</li>
            <li><code>s.replace(old, new)</code>: 部分文字列の置換</li>
          </ul>
          <h4>スライス構文 <code>s[start:stop:step]</code></h4>
          <pre><code class="language-python">text = "PythonCode"
print(text[0:6])   # 'Python'
print(text[:6])    # 'Python' (先頭省略)
print(text[-4:])   # 'Code' (末尾4文字)
print(text[::-1])  # 'edoCnohtyP' (逆順反転)</code></pre>
        `,
        key_takeaways: ["strip()で余分な空白を除去", "split()とjoin()は相互変換の要", "スライス [::-1] で簡単に逆順反転"],
        example_code: "csv_line = ' apple , banana , orange '\nitems = [item.strip() for item in csv_line.split(',')]\nprint(' -> '.join(items))",
        exercise: {
          id: 3,
          title: "ユーザー名の正規化とマスキング",
          description: '<p>前後に空白を含むメールアドレス <code>email</code> (例: <code>"  tanaka@example.com  "</code>) を受け取り、前後の空白を除去した上で、<code>@</code> より前のユーザー名を抽出して返す関数 <code>extract_username(email)</code> を実装してください。</p>',
          template: "def extract_username(email):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'extract_username("  tanaka@example.com  ")', expected: "tanaka" },
            { input: 'extract_username("admin_dev@company.jp")', expected: "admin_dev" },
          ],
          solution_code: "def extract_username(email):\n    cleaned = email.strip()\n    return cleaned.split('@')[0]\n",
          explanation: "strip() で余分な空白を削除し、split('@')[0] でドメイン手前のユーザー名部分を取得します。",
        },
      },
      {
        id: 4,
        chapter_id: 1,
        chapter_order: 1,
        chapter_title: "Pythonの第一歩と基本データ型",
        order: 4,
        title: "1.4 型変換 (キャスト) と真偽値 (bool)",
        reading_time_minutes: 3,
        content_html: `
          <h3>型変換 (Type Casting) と Truthy / Falsy</h3>
          <p>ユーザー入力やファイルから読み込んだデータは多くの場合「文字列(str)」です。計算するには適切な型へ変換する必要があります。</p>
          <pre><code class="language-python">num_str = "42"
num = int(num_str)       # 整数へ変換: 42
f_num = float("3.14")    # 小数へ変換: 3.14
s = str(100)             # 文字列へ変換: "100"</code></pre>
          <h4>Pythonの真偽判定 (Truthy / Falsy)</h4>
          <p>Pythonでは、<code>0</code>、空文字列 <code>""</code>、空リスト <code>[]</code>、空辞書 <code>{}</code>、<code>None</code> はすべて <strong>False (Falsy)</strong> とみなされます。それ以外の値はすべて <strong>True (Truthy)</strong> です。</p>
        `,
        key_takeaways: ["int(), float(), str() で明示的に型変換", "0, 空文字, 空コレクション, None は False とみなされる", "bool(value) で真偽値を取得可能"],
        example_code: "print(bool('hello'))  # True\nprint(bool(''))       # False\nprint(bool([1, 2]))   # True\nprint(bool([]))       # False",
        exercise: {
          id: 4,
          title: "カンマ区切り数値文字列の合計値計算",
          description: '<p>カンマ区切りの数値文字列 <code>csv_numbers</code> (例: <code>"10, 20, 30"</code>) を受け取り、それぞれの数値を整数に変換して合計値を返す関数 <code>sum_csv_numbers(csv_numbers)</code> を実装してください。文字列が空の場合は <code>0</code> を返してください。</p>',
          template: "def sum_csv_numbers(csv_numbers):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'sum_csv_numbers("10, 20, 30")', expected: 60 },
            { input: 'sum_csv_numbers("5, 15, 25, 35")', expected: 80 },
            { input: 'sum_csv_numbers("")', expected: 0 },
          ],
          solution_code: "def sum_csv_numbers(csv_numbers):\n    if not csv_numbers.strip():\n        return 0\n    return sum(int(x.strip()) for x in csv_numbers.split(','))\n",
          explanation: "空文字チェックを行い、split(',') で分割した各要素を int() に変換して sum() で合計します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第2章: 条件分岐とロジック構築の極意 (3単元)
  // =========================================================================
  {
    id: 2,
    order: 2,
    title: "第2章: 条件分岐とロジック構築の極意",
    subtitle: "if文・論理演算子・三項演算子・早期リターン",
    icon: "arrows-split",
    category: "control",
    target_level: 2,
    summary: "プログラムの判断ロジックを構成する if-elif-else、比較演算子と論理演算子、三項演算子、そして実務で推奨される早期リターン設計を学びます。",
    lessons: [
      {
        id: 5,
        chapter_id: 2,
        chapter_order: 2,
        chapter_title: "条件分岐とロジック構築の極意",
        order: 1,
        title: "2.1 if-elif-else による複数条件分岐",
        reading_time_minutes: 4,
        content_html: `
          <h3>条件分岐の組み立てとインデント</h3>
          <p>Pythonは波括弧 <code>{}</code> ではなく、<strong>インデント（半角スペース4つ）</strong> でブロック構造を表現します。</p>
          <pre><code class="language-python">score = 85
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"
print(f"評価: {grade}")</code></pre>
          <p>条件は上から順に評価され、最初に <code>True</code> になったブロックのみが実行されます。</p>
        `,
        key_takeaways: ["コロン : の後にインデントで処理を記述", "elif で複数条件を上から順番に判定", "else はどの条件にも該当しない場合のフォールバック"],
        example_code: "temp = 28\nif temp >= 30:\n    print('真夏日')\nelif temp >= 25:\n    print('夏日')\nelse:\n    print('快適')",
        exercise: {
          id: 5,
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
      {
        id: 6,
        chapter_id: 2,
        chapter_order: 2,
        chapter_title: "条件分岐とロジック構築の極意",
        order: 2,
        title: "2.2 比較演算子と論理演算子 (and, or, not, in)",
        reading_time_minutes: 4,
        content_html: `
          <h3>複合条件の構築</h3>
          <ul>
            <li><code>and</code>: 両方が True のとき True</li>
            <li><code>or</code>: どちらか一方でも True のとき True</li>
            <li><code>not</code>: 真偽を反転 (True → False)</li>
            <li><code>in</code> / <code>not in</code>: コレクションに要素が含まれているか判定</li>
          </ul>
          <pre><code class="language-python">role = "admin"
is_active = True
if role == "admin" and is_active:
    print("管理者アクセス許可")

valid_roles = ["admin", "editor", "moderator"]
if role in valid_roles:
    print("権限あり")</code></pre>
          <p>Pythonでは <code>10 <= x <= 20</code> のような連続比較構文も自然に書けます。</p>
        `,
        key_takeaways: ["and, or, not で複合ロジックを構成", "in 演算子でリストや文字列内の存在確認", "10 <= x <= 20 のような直感的比較が可能"],
        example_code: "score = 75\nattendance = 0.9\nif score >= 60 and attendance >= 0.8:\n    print('合格・単位取得')",
        exercise: {
          id: 6,
          title: "アクセス権限判定関数",
          description: '<p>ユーザー情報辞書 <code>user</code> (例: <code>{"role": "editor", "is_banned": False}</code>) を受け取り、<code>is_banned</code> が <code>False</code> かつ <code>role</code> が <code>"admin"</code> または <code>"editor"</code> の場合にのみ <code>True</code>、それ以外は <code>False</code> を返す関数 <code>can_edit_post(user)</code> を実装してください。</p>',
          template: "def can_edit_post(user):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'can_edit_post({"role": "editor", "is_banned": False})', expected: true },
            { input: 'can_edit_post({"role": "admin", "is_banned": False})', expected: true },
            { input: 'can_edit_post({"role": "admin", "is_banned": True})', expected: false },
            { input: 'can_edit_post({"role": "viewer", "is_banned": False})', expected: false },
          ],
          solution_code: 'def can_edit_post(user):\n    if user.get("is_banned", True):\n        return False\n    return user.get("role") in ["admin", "editor"]\n',
          explanation: "BANされている場合は即座に False を返し、role が許可リストに含まれているかを判定します。",
        },
      },
      {
        id: 7,
        chapter_id: 2,
        chapter_order: 2,
        chapter_title: "条件分岐とロジック構築の極意",
        order: 3,
        title: "2.3 三項演算子 (条件式) と早期リターン設計",
        reading_time_minutes: 4,
        content_html: `
          <h3>三項演算子 (Conditional Expression)</h3>
          <p>シンプルな条件分岐による代入は、1行の三項演算子 <code>[真の時の値] if [条件] else [偽の時の値]</code> で簡潔に書けます。</p>
          <pre><code class="language-python">status = "合格" if score >= 60 else "不合格"</code></pre>
          <h3>実務で推奨される「早期リターン (Early Return)」</h3>
          <p>ネスト（入れ子）が深くなるとコードの可読性が落ちます。不正な条件を先頭で即座に return することで、主要ロジックを平坦に保ちます。</p>
          <pre><code class="language-python"># 推奨: 早期リターン
def process_order(amount, is_member):
    if amount <= 0:
        return 0
    discount = 0.1 if is_member else 0.0
    return int(amount * (1 - discount))</code></pre>
        `,
        key_takeaways: ["A if cond else B で簡潔にインライン代入", "ガード節 (早期リターン) で深いネストを防止", "可読性と保守性を第一に設計"],
        example_code: "def get_fee(is_member):\n    return 500 if is_member else 1000\nprint('料金:', get_fee(True))",
        exercise: {
          id: 7,
          title: "送料計算 (早期リターンと条件式)",
          description: '<p>注文金額 <code>total_price</code> と 会員フラグ <code>is_vip</code> を受け取り、送料を計算して返す関数 <code>calc_shipping_fee(total_price, is_vip)</code> を実装してください。<br>・合計が 5,000円 以上の場合は無料 (0円)<br>・VIP会員 (<code>is_vip == True</code>) の場合は一律無料 (0円)<br>・それ以外は一律 500円 を返します。</p>',
          template: "def calc_shipping_fee(total_price, is_vip):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "calc_shipping_fee(6000, False)", expected: 0 },
            { input: "calc_shipping_fee(3000, True)", expected: 0 },
            { input: "calc_shipping_fee(3000, False)", expected: 500 },
          ],
          solution_code: "def calc_shipping_fee(total_price, is_vip):\n    if is_vip or total_price >= 5000:\n        return 0\n    return 500\n",
          explanation: "無料条件 (VIP または 5000円以上) を先頭で判定して 0 を返し、それ以外は 500 を返します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第3章: ループ処理と反復制御 (3単元)
  // =========================================================================
  {
    id: 3,
    order: 3,
    title: "第3章: ループ処理と反復制御",
    subtitle: "for文・range・while文・enumerate・zip",
    icon: "arrow-path",
    category: "control",
    target_level: 2,
    summary: "反復処理の基礎であるfor文とrange、条件駆動ループのwhile文、そしてPythonで最も美しく実務的なenumerateとzipの活用法を学びます。",
    lessons: [
      {
        id: 8,
        chapter_id: 3,
        chapter_order: 3,
        chapter_title: "ループ処理と反復制御",
        order: 1,
        title: "3.1 forループと range 関数の活用",
        reading_time_minutes: 4,
        content_html: `
          <h3>forループとイテレーション</h3>
          <p>Pythonの <code>for</code> は、シーケンス（リスト、文字列、rangeなど）から要素を1つずつ取り出して処理します。</p>
          <pre><code class="language-python"># リストの反復
fruits = ["apple", "banana", "cherry"]
for f in fruits:
    print(f)</code></pre>
          <h4>range(start, stop, step) 関数</h4>
          <ul>
            <li><code>range(5)</code>: 0, 1, 2, 3, 4 (5回反復)</li>
            <li><code>range(1, 10, 2)</code>: 1, 3, 5, 7, 9 (2ずつ増加)</li>
            <li><code>range(10, 0, -1)</code>: 10, 9, 8, ... 1 (カウントダウン)</li>
          </ul>
        `,
        key_takeaways: ["for 変数 in コレクション: で要素を反復", "range(start, stop) は stop 未満まで反復", "step に負数を指定すると逆順カウントダウン可能"],
        example_code: "total = 0\nfor i in range(1, 11):\n    total += i\nprint('1〜10の合計:', total)",
        exercise: {
          id: 8,
          title: "偶数のみの合計値計算",
          description: "<p>整数 <code>n</code> を受け取り、1 から <code>n</code> までの偶数（2, 4, 6...）の合計値を計算して返す関数 <code>sum_even_numbers(n)</code> を実装してください。</p>",
          template: "def sum_even_numbers(n):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "sum_even_numbers(10)", expected: 30 },
            { input: "sum_even_numbers(6)", expected: 12 },
            { input: "sum_even_numbers(1)", expected: 0 },
          ],
          solution_code: "def sum_even_numbers(n):\n    return sum(x for x in range(2, n + 1, 2))\n",
          explanation: "range(2, n + 1, 2) で2からnまでの偶数を生成し、合計を計算します。",
        },
      },
      {
        id: 9,
        chapter_id: 3,
        chapter_order: 3,
        chapter_title: "ループ処理と反復制御",
        order: 2,
        title: "3.2 whileループと break / continue 反復制御",
        reading_time_minutes: 4,
        content_html: `
          <h3>whileループと反復制御構文</h3>
          <p><code>while 条件:</code> は、条件が <code>True</code> の間ループを継続します。</p>
          <ul>
            <li><code>break</code>: ループをその場で即座に終了して脱出</li>
            <li><code>continue</code>: 現在のイテレーションをスキップして次の周回へスキップ</li>
          </ul>
          <pre><code class="language-python"># break と continue の例
count = 0
while True:
    count += 1
    if count == 3:
        continue # 3のときはスキップ
    if count > 5:
        break    # 5を超えたら終了
    print(count) # 1, 2, 4, 5 が出力される</code></pre>
        `,
        key_takeaways: ["while は条件を満たす限りループ", "break でループ全体から脱出", "continue でその回の処理をスキップ"],
        example_code: "n = 1\nwhile n < 100:\n    n *= 2\nprint('100を超えた最小の2の累乗:', n)",
        exercise: {
          id: 9,
          title: "特定値を超える最初の累乗計算",
          description: "<p>目標値 <code>target</code> を受け取り、底 <code>base</code> を 1 から順に何回掛けたら <code>target</code> 以上になるか（何乗か）の最小の指数（整数）を返す関数 <code>find_min_power(base, target)</code> を実装してください。<br>例: <code>base=2, target=10</code> の場合、2^4 = 16 で 10 以上になるため <code>4</code> を返します。</p>",
          template: "def find_min_power(base, target):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "find_min_power(2, 10)", expected: 4 },
            { input: "find_min_power(3, 20)", expected: 3 },
            { input: "find_min_power(5, 5)", expected: 1 },
          ],
          solution_code: "def find_min_power(base, target):\n    power = 1\n    val = base\n    while val < target:\n        val *= base\n        power += 1\n    return power\n",
          explanation: "掛け合わせた結果が target 以上になるまで while ループで乗算回数をカウントします。",
        },
      },
      {
        id: 10,
        chapter_id: 3,
        chapter_order: 3,
        chapter_title: "ループ処理と反復制御",
        order: 3,
        title: "3.3 enumerate と zip による洗練された反復",
        reading_time_minutes: 4,
        content_html: `
          <h3>Pythonicな反復イディオム</h3>
          <h4>1. enumerate(iterable, start=0)</h4>
          <p>インデックス番号と要素を同時に取得できます。<code>range(len(list))</code> を使う必要がなくなります。</p>
          <pre><code class="language-python">fruits = ["apple", "banana", "orange"]
for i, f in enumerate(fruits, start=1):
    print(f"{i}位: {f}")</code></pre>
          <h4>2. zip(*iterables)</h4>
          <p>複数のリストを同じインデックス同士でペアにして同時に反復します。</p>
          <pre><code class="language-python">names = ["Alice", "Bob", "Charlie"]
scores = [85, 92, 78]
for name, score in zip(names, scores):
    print(f"{name}: {score}点")</code></pre>
        `,
        key_takeaways: ["enumerate(list) で (index, value) を同時取得", "zip(listA, listB) で複数リストを同時並行処理", "range(len(...)) を使わないのがモダンPythonの鉄則"],
        example_code: "users = ['佐藤', '鈴木', '高橋']\nroles = ['管理者', '編集者', '閲覧者']\nfor u, r in zip(users, roles):\n    print(f'{u}様 [{r}]')",
        exercise: {
          id: 10,
          title: "成績順位表の作成",
          description: '<p>生徒名リスト <code>students</code> と 点数リスト <code>scores</code> を受け取り、<code>"1位: 佐藤 (95点)"</code> のようなランキング文字列のリストを返す関数 <code>create_ranking_list(students, scores)</code> を実装してください。（※入力リストはすでに点数降順でソートされている前提とします）</p>',
          template: "def create_ranking_list(students, scores):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'create_ranking_list(["佐藤", "田中", "鈴木"], [95, 88, 72])', expected: ["1位: 佐藤 (95点)", "2位: 田中 (88点)", "3位: 鈴木 (72点)"] },
            { input: 'create_ranking_list(["Alice"], [100])', expected: ["1位: Alice (100点)"] },
          ],
          solution_code: 'def create_ranking_list(students, scores):\n    return [f"{i}位: {st} ({sc}点)" for i, (st, sc) in enumerate(zip(students, scores), start=1)]\n',
          explanation: "zip で生徒名と点数を結合し、enumerate(..., start=1) で1から始まる順位を付けてリストを作成します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第4章: データ構造の完全制覇 (リスト・タプル・辞書・集合) (4単元)
  // =========================================================================
  {
    id: 4,
    order: 4,
    title: "第4章: データ構造の完全制覇 (リスト・タプル・辞書・集合)",
    subtitle: "list・tuple・dict・set の特性と実践的操作",
    icon: "database",
    category: "data_structure",
    target_level: 3,
    summary: "Pythonの主要データ構造4種（リスト・タプル・辞書・集合）の特性、使い分け、および実務で必須の操作メソッドを完全に制覇します。",
    lessons: [
      {
        id: 11,
        chapter_id: 4,
        chapter_order: 4,
        chapter_title: "データ構造の完全制覇",
        order: 1,
        title: "4.1 リスト (list) の操作とソート",
        reading_time_minutes: 5,
        content_html: `
          <h3>リストの変更・検索・ソートメソッド</h3>
          <ul>
            <li><code>.append(x)</code>: 末尾に要素を追加</li>
            <li><code>.insert(i, x)</code>: 指定インデックスに挿入</li>
            <li><code>.pop(i)</code>: 指定位置の要素を取り出して削除（デフォルトは末尾）</li>
            <li><code>.remove(x)</code>: 最初に見つかった値 x を削除</li>
            <li><code>.sort()</code> vs <code>sorted()</code>: 破壊的ソートか新しいリスト生成か</li>
          </ul>
          <pre><code class="language-python">nums = [5, 2, 8, 1, 9]
nums.sort(reverse=True) # 降順ソート
print(nums) # [9, 8, 5, 2, 1]</code></pre>
        `,
        key_takeaways: [".append() と .pop() でスタックやキューの操作が可能", "list.sort() はインプレース破壊的、sorted(list) は非破壊的", "key パラメータでカスタムソート基準を指定可能"],
        example_code: "items = ['apple', 'pie', 'banana']\nitems.sort(key=len)\nprint('文字数順:', items)",
        exercise: {
          id: 11,
          title: "重複を除外しない昇順トップN要素の抽出",
          description: "<p>数値リスト <code>numbers</code> と 整数 <code>n</code> を受け取り、リストを昇順（小さい順）にソートした上で、先頭から <code>n</code> 個の要素を抽出した新しいリストを返す関数 <code>get_top_n_smallest(numbers, n)</code> を実装してください。</p>",
          template: "def get_top_n_smallest(numbers, n):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "get_top_n_smallest([10, 2, 8, 4, 6], 3)", expected: [2, 4, 6] },
            { input: "get_top_n_smallest([99, 5, 12], 1)", expected: [5] },
          ],
          solution_code: "def get_top_n_smallest(numbers, n):\n    return sorted(numbers)[:n]\n",
          explanation: "sorted(numbers) で非破壊的に昇順ソートし、スライス [:n] で先頭 n 個を取り出します。",
        },
      },
      {
        id: 12,
        chapter_id: 4,
        chapter_order: 4,
        chapter_title: "データ構造の完全制覇",
        order: 2,
        title: "4.2 タプル (tuple) とアンパック代入",
        reading_time_minutes: 3,
        content_html: `
          <h3>イミュータブル (変更不能) なタプル</h3>
          <p>タプル <code>(1, 2, 3)</code> は一度作成すると要素の変更や追加ができません。これにより意図しないデータ改ざんを防ぎ、辞書のキーとしても使用できます。</p>
          <h4>多重代入・アンパック (Unpacking)</h4>
          <pre><code class="language-python"># 変数の交換 (Swap)
a, b = 10, 20
a, b = b, a # 一撃で入れ替え可能！

# タプルの展開
point = (3, 7)
x, y = point

# アスタリスクによる残余アンパック
head, *tail = [1, 2, 3, 4, 5]
print(head) # 1
print(tail) # [2, 3, 4, 5]</code></pre>
        `,
        key_takeaways: ["タプルは変更不能 (イミュータブル) な安全データ型", "a, b = b, a で一時変数なしに入れ替え可能", "*rest で残りの要素をまとめて受け取り可能"],
        example_code: "def get_min_max(nums):\n    return min(nums), max(nums)\n\nlow, high = get_min_max([4, 1, 9, 2])\nprint(f'最小: {low}, 最大: {high}')",
        exercise: {
          id: 12,
          title: "座標データのアンパックと距離二乗計算",
          description: "<p>2次元座標のタプル <code>point_a = (x1, y1)</code> と <code>point_b = (x2, y2)</code> を受け取り、2点間のユークリッド距離の二乗 <code>(x1 - x2)**2 + (y1 - y2)**2</code> を計算して返す関数 <code>calc_distance_squared(point_a, point_b)</code> を実装してください。</p>",
          template: "def calc_distance_squared(point_a, point_b):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "calc_distance_squared((0, 0), (3, 4))", expected: 25 },
            { input: "calc_distance_squared((1, 2), (4, 6))", expected: 25 },
          ],
          solution_code: "def calc_distance_squared(point_a, point_b):\n    x1, y1 = point_a\n    x2, y2 = point_b\n    return (x1 - x2)**2 + (y1 - y2)**2\n",
          explanation: "タプルをアンパックして座標変数を取り出し、差の二乗和を計算します。",
        },
      },
      {
        id: 13,
        chapter_id: 4,
        chapter_order: 4,
        chapter_title: "データ構造の完全制覇",
        order: 3,
        title: "4.3 辞書 (dict) の活用と安全な値取得",
        reading_time_minutes: 5,
        content_html: `
          <h3>Key-Value による超高速データ検索</h3>
          <p>辞書はハッシュテーブル構造により、キーの検索・追加が O(1) の高速で行えます。</p>
          <h4>実務での安全な値取得: .get() メソッド</h4>
          <pre><code class="language-python">user = {"name": "Tanaka", "age": 28}

# 存在しないキーを [] で指定すると KeyError が発生してクラッシュする！
# bad: print(user["role"])

# 安全な取得: なければ default 値を返す
role = user.get("role", "guest")
print(role) # 'guest'</code></pre>
          <h4>辞書の反復 (.keys(), .values(), .items())</h4>
          <pre><code class="language-python">for key, value in user.items():
    print(f"{key}: {value}")</code></pre>
        `,
        key_takeaways: [".get(key, default) で KeyError を防ぎ安全に値取得", ".items() で (key, value) をペアでループ処理", "dict は Python 3.7+ で挿入順序が保持される"],
        example_code: "stock = {'apple': 5, 'banana': 2}\nprint(stock.get('orange', 0)) # 在庫0を返す",
        exercise: {
          id: 13,
          title: "商品売上の集計辞書作成",
          description: '<p>売上リスト <code>sales = [("apple", 100), ("banana", 200), ("apple", 150)]</code> を受け取り、商品ごとの合計売上金額をまとめた辞書（例: <code>{"apple": 250, "banana": 200}</code>）を返す関数 <code>aggregate_sales(sales)</code> を実装してください。</p>',
          template: "def aggregate_sales(sales):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'aggregate_sales([("apple", 100), ("banana", 200), ("apple", 150)])', expected: { apple: 250, banana: 200 } },
            { input: 'aggregate_sales([("book", 1200)])', expected: { book: 1200 } },
          ],
          solution_code: "def aggregate_sales(sales):\n    res = {}\n    for item, amount in sales:\n        res[item] = res.get(item, 0) + amount\n    return res\n",
          explanation: "res.get(item, 0) で既存の金額（未登録なら0）を取得し、加算して辞書を更新します。",
        },
      },
      {
        id: 14,
        chapter_id: 4,
        chapter_order: 4,
        chapter_title: "データ構造の完全制覇",
        order: 4,
        title: "4.4 集合 (set) と集合演算 (積・和・差集合)",
        reading_time_minutes: 4,
        content_html: `
          <h3>重複を許さない集合 (set)</h3>
          <p>集合は重複要素を持たず、要素の存在判定が O(1) で極めて高速です。リストから一撃で重複を排除する際にも多用されます。</p>
          <pre><code class="language-python"># 重複削除
raw_tags = ["python", "ai", "web", "python", "ai"]
unique_tags = set(raw_tags)
print(unique_tags) # {'python', 'ai', 'web'}</code></pre>
          <h4>集合演算子</h4>
          <ul>
            <li><code>a | b</code> (和集合 / Union): どちらかに含まれる全要素</li>
            <li><code>a & b</code> (積集合 / Intersection): 両方に共通する要素</li>
            <li><code>a - b</code> (差集合 / Difference): a にあって b にない要素</li>
            <li><code>a ^ b</code> (対称差 / Symmetric Diff): どちらか片方のみにある要素</li>
          </ul>
        `,
        key_takeaways: ["set(list) で瞬時に重複を排除", "積集合 & で共通項抽出、差集合 - で差分抽出", "要素の in チェックがリストに比べて圧倒的に高速"],
        example_code: "frontend = {'HTML', 'CSS', 'JS'}\nfullstack = {'HTML', 'CSS', 'JS', 'Python', 'SQL'}\nprint('バックエンドスキル:', fullstack - frontend)",
        exercise: {
          id: 14,
          title: "共通タグと固有タグの抽出",
          description: "<p>2つのタグリスト <code>tags_a</code> と <code>tags_b</code> を受け取り、両方に共通して存在するタグのソート済みリストを返す関数 <code>find_common_tags(tags_a, tags_b)</code> を実装してください。</p>",
          template: "def find_common_tags(tags_a, tags_b):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'find_common_tags(["python", "django", "aws"], ["docker", "python", "aws"])', expected: ["aws", "python"] },
            { input: 'find_common_tags(["html", "css"], ["python", "ruby"])', expected: [] },
          ],
          solution_code: "def find_common_tags(tags_a, tags_b):\n    common = set(tags_a) & set(tags_b)\n    return sorted(list(common))\n",
          explanation: "set(tags_a) & set(tags_b) で積集合を求め、sorted(list(...)) で昇順ソートして返します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第5章: 内包表記とモダンPython記法 (3単元)
  // =========================================================================
  {
    id: 5,
    order: 5,
    title: "第5章: 内包表記とモダンPython記法",
    subtitle: "リスト/辞書/集合内包表記・lambda式・組み込み関数",
    icon: "bolt",
    category: "data_structure",
    target_level: 3,
    summary: "Python特有の最も強力で表現力豊かな機能である「内包表記（Comprehensions）」と、無名関数lambda、map/filter/sortedによる高速・簡潔な記法を習得します。",
    lessons: [
      {
        id: 15,
        chapter_id: 5,
        chapter_order: 5,
        chapter_title: "内包表記とモダンPython記法",
        order: 1,
        title: "5.1 リスト内包表記と条件フィルタリング",
        reading_time_minutes: 5,
        content_html: `
          <h3>リスト内包表記の基本構造</h3>
          <p><code>[式 for 変数 in イテラブル if 条件]</code> の構文により、数行にわたるforループとappendを1行で高速に実行できます。</p>
          <pre><code class="language-python"># 1〜10の偶数の2乗リスト
# 従来の方法:
# res = []
# for x in range(1, 11):
#     if x % 2 == 0:
#         res.append(x ** 2)

# リスト内包表記 (高速かつ明瞭):
res = [x ** 2 for x in range(1, 11) if x % 2 == 0]
print(res) # [4, 16, 36, 64, 100]</code></pre>
        `,
        key_takeaways: ["[式 for x in list if cond] で変換と抽出を同時実行", "C言語レベルで最適化されるため通常のforループより高速", "ネストは2段階までに抑えるのが可読性のコツ"],
        example_code: "words = ['hello', 'world', 'python']\nuppers = [w.upper() for w in words if len(w) > 4]\nprint(uppers)",
        exercise: {
          id: 15,
          title: "指定文字数以上の単語フィルタリング",
          description: "<p>単語リスト <code>words</code> と 最小文字数 <code>min_len</code> を受け取り、文字数が <code>min_len</code> 以上の単語のみを大文字に変換したリストを返す関数 <code>filter_and_upper_words(words, min_len)</code> をリスト内包表記で実装してください。</p>",
          template: "def filter_and_upper_words(words, min_len):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'filter_and_upper_words(["cat", "elephant", "dog", "tiger"], 4)', expected: ["ELEPHANT", "TIGER"] },
            { input: 'filter_and_upper_words(["a", "bb"], 3)', expected: [] },
          ],
          solution_code: "def filter_and_upper_words(words, min_len):\n    return [w.upper() for w in words if len(w) >= min_len]\n",
          explanation: "リスト内包表記で len(w) >= min_len の条件を満たす単語を w.upper() で大文字化して集めます。",
        },
      },
      {
        id: 16,
        chapter_id: 5,
        chapter_order: 5,
        chapter_title: "内包表記とモダンPython記法",
        order: 2,
        title: "5.2 辞書内包表記・集合内包表記の実務テクニック",
        reading_time_minutes: 4,
        content_html: `
          <h3>辞書・集合の内包表記</h3>
          <h4>1. 辞書内包表記 <code>{k_expr: v_expr for ...}</code></h4>
          <pre><code class="language-python"># リストから検索用インデックス辞書を作成
users = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
user_map = {u["id"]: u["name"] for u in users}
print(user_map) # {1: 'Alice', 2: 'Bob'}</code></pre>
          <h4>2. 集合内包表記 <code>{expr for ...}</code></h4>
          <pre><code class="language-python">emails = ["admin@test.com", "user@test.com", "ADMIN@test.com"]
domains = {e.lower().split("@")[1] for e in emails}
print(domains) # {'test.com'}</code></pre>
        `,
        key_takeaways: ["{k: v for ...} で一撃でマッピング辞書を作成", "キーと値の反転 {v: k for k, v in d.items()} も可能", "集合内包表記で加工後の重複を自動排除"],
        example_code: "prices = {'apple': 100, 'banana': 200, 'orange': 150}\ntaxed = {k: int(v * 1.1) for k, v in prices.items()}\nprint(taxed)",
        exercise: {
          id: 16,
          title: "名前と文字数の辞書マップ生成",
          description: '<p>名前リスト <code>names = ["Alice", "Bob", "Charlie"]</code> を受け取り、名前をキー、その文字数を値とする辞書（例: <code>{"Alice": 5, "Bob": 3, "Charlie": 7}</code>）を辞書内包表記で作成して返す関数 <code>make_name_length_map(names)</code> を実装してください。</p>',
          template: "def make_name_length_map(names):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'make_name_length_map(["Alice", "Bob", "Charlie"])', expected: { Alice: 5, Bob: 3, Charlie: 7 } },
            { input: 'make_name_length_map(["Python"])', expected: { Python: 6 } },
          ],
          solution_code: "def make_name_length_map(names):\n    return {name: len(name) for name in names}\n",
          explanation: "{name: len(name) for name in names} で名前と長さをペアにした辞書を作成します。",
        },
      },
      {
        id: 17,
        chapter_id: 5,
        chapter_order: 5,
        chapter_title: "内包表記とモダンPython記法",
        order: 3,
        title: "5.3 lambda式 (無名関数) とカスタムソート",
        reading_time_minutes: 4,
        content_html: `
          <h3>lambda式 (無名関数) の活用</h3>
          <p>名前をつけずにその場で使い捨てる関数を <code>lambda 引数: 式</code> で定義できます。</p>
          <h4>sorted(..., key=lambda x: ...) による高度ソート</h4>
          <pre><code class="language-python">users = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 95},
    {"name": "Charlie", "score": 70}
]

# score の高い順にソート
sorted_users = sorted(users, key=lambda u: u["score"], reverse=True)
print(sorted_users[0]["name"]) # 'Bob'</code></pre>
        `,
        key_takeaways: ["lambda x: expr で1行の関数を定義", "sorted(list, key=lambda x: ...) で柔軟なソート条件を指定", "複雑な処理になる場合は通常の def 関数を使うのが推奨"],
        example_code: "pairs = [(1, 'one'), (3, 'three'), (2, 'two')]\nprint(sorted(pairs, key=lambda p: p[0]))",
        exercise: {
          id: 17,
          title: "社員データの年齢順ソート",
          description: '<p>社員辞書リスト <code>employees</code> (例: <code>[{"name": "Tanaka", "age": 30}, {"name": "Sato", "age": 24}]</code>) を受け取り、年齢 (<code>age</code>) が若い順（昇順）に並び替えた名前のリスト（例: <code>["Sato", "Tanaka"]</code>）を返す関数 <code>sort_employees_by_age(employees)</code> を実装してください。</p>',
          template: "def sort_employees_by_age(employees):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'sort_employees_by_age([{"name": "Tanaka", "age": 30}, {"name": "Sato", "age": 24}, {"name": "Suzuki", "age": 28}])', expected: ["Sato", "Suzuki", "Tanaka"] },
            { input: 'sort_employees_by_age([{"name": "A", "age": 40}, {"name": "B", "age": 20}])', expected: ["B", "A"] },
          ],
          solution_code: "def sort_employees_by_age(employees):\n    sorted_emp = sorted(employees, key=lambda e: e['age'])\n    return [e['name'] for e in sorted_emp]\n",
          explanation: "sorted(employees, key=lambda e: e['age']) で年齢順ソートし、内包表記で名前を抽出します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第6章: 実務レベルの関数設計と型ヒント (4単元)
  // =========================================================================
  {
    id: 6,
    order: 6,
    title: "第6章: 実務レベルの関数設計と型ヒント",
    subtitle: "引数設計・可変長引数・スコープ・Type Hints",
    icon: "code",
    category: "basic",
    target_level: 3,
    summary: "再利用性の高いモジュール設計、可変長引数(*args, **kwargs)、グローバルとローカルスコープ、そして現代Pythonで必須の型ヒント(Type Hints)を習得します。",
    lessons: [
      {
        id: 18,
        chapter_id: 6,
        chapter_order: 6,
        chapter_title: "実務レベルの関数設計と型ヒント",
        order: 1,
        title: "6.1 関数の基本・デフォルト引数・キーワード引数",
        reading_time_minutes: 4,
        content_html: `
          <h3>柔軟な引数設計と注意点</h3>
          <p>関数引数にはデフォルト値を設定でき、呼び出し時に省略可能です。</p>
          <pre><code class="language-python">def send_email(to, subject, urgent=False):
    prefix = "[URGENT] " if urgent else ""
    return f"To: {to} | Subject: {prefix}{subject}"

# 位置引数とキーワード引数
print(send_email("user@test.com", "メンテナンス通知"))
print(send_email("admin@test.com", "障害発生", urgent=True))</code></pre>
          <div class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs mt-2">
            <strong>⚠️ 重大バグ注意:</strong> デフォルト引数に空リスト <code>[]</code> や辞書 <code>{}</code> などのミュータブル（変更可能）オブジェクトを指定してはいけません！呼び出し間で共有されてしまいます。必ず <code>arg=None</code> とし、関数内で <code>if arg is None: arg = []</code> と初期化します。
          </div>
        `,
        key_takeaways: ["def 関数名(必須引数, オプション引数=初期値):", "デフォルト引数にミュータブル([], {})を指定しない (None初期化を使用)", "キーワード引数で呼び出すと引数順序に依存しない"],
        example_code: "def greet(name, msg='こんにちは'):\n    return f'{name}さん、{msg}！'\nprint(greet('佐藤'))",
        exercise: {
          id: 18,
          title: "安全なリスト追加関数",
          description: '<p>アイテム <code>item</code> と、追加対象のリスト <code>target_list</code> (省略可能・デフォルトは None) を受け取り、<code>target_list</code> に <code>item</code> を追加したリストを返す関数 <code>safe_add_item(item, target_list=None)</code> を実装してください。<code>target_list</code> が省略または None の場合は新しいリストを作成して追加してください。</p>',
          template: "def safe_add_item(item, target_list=None):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'safe_add_item("apple")', expected: ["apple"] },
            { input: 'safe_add_item("banana", ["apple"])', expected: ["apple", "banana"] },
          ],
          solution_code: "def safe_add_item(item, target_list=None):\n    if target_list is None:\n        target_list = []\n    target_list.append(item)\n    return target_list\n",
          explanation: "target_list が None の場合に新しい空リストを割り当てて安全に追加します。",
        },
      },
      {
        id: 19,
        chapter_id: 6,
        chapter_order: 6,
        chapter_title: "実務レベルの関数設計と型ヒント",
        order: 2,
        title: "6.2 可変長引数 (*args, **kwargs) の仕組み",
        reading_time_minutes: 4,
        content_html: `
          <h3>任意の数の引数を受け取る</h3>
          <ul>
            <li><code>*args</code>: 任意個数の位置引数を「タプル」として受け取る</li>
            <li><code>**kwargs</code>: 任意個数のキーワード引数を「辞書」として受け取る</li>
          </ul>
          <pre><code class="language-python">def make_query_url(base_url, *paths, **params):
    # パスの結合
    url = base_url.rstrip("/") + "/" + "/".join(paths)
    # クエリパラメータの結合
    if params:
        query_str = "&".join(f"{k}={v}" for k, v in params.items())
        url += "?" + query_str
    return url

print(make_query_url("https://api.example.com", "v1", "users", page=1, limit=20))
# https://api.example.com/v1/users?page=1&limit=20</code></pre>
        `,
        key_takeaways: ["*args は任意個の位置引数をタプル化", "**kwargs は任意個のキーワード引数を辞書化", "呼び出し側で *list や **dict を渡すと引数をアンパック展開"],
        example_code: "def total_sum(*numbers):\n    return sum(numbers)\nprint('合計:', total_sum(10, 20, 30, 40))",
        exercise: {
          id: 19,
          title: "可変長引数の平均値計算",
          description: "<p>任意個数の数値を受け取り（例: <code>calc_average(10, 20, 30)</code>）、その平均値を返す関数 <code>calc_average(*values)</code> を実装してください。引数が1つも渡されない場合は <code>0.0</code> を返してください。</p>",
          template: "def calc_average(*values):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "calc_average(10, 20, 30)", expected: 20.0 },
            { input: "calc_average(5, 15)", expected: 10.0 },
            { input: "calc_average()", expected: 0.0 },
          ],
          solution_code: "def calc_average(*values):\n    if not values:\n        return 0.0\n    return sum(values) / len(values)\n",
          explanation: "values が空タプルか判定し、要素がある場合は sum(values) / len(values) を返します。",
        },
      },
      {
        id: 20,
        chapter_id: 6,
        chapter_order: 6,
        chapter_title: "実務レベルの関数設計と型ヒント",
        order: 3,
        title: "6.3 変数スコープ (LEGB則) と副作用のない純粋関数",
        reading_time_minutes: 4,
        content_html: `
          <h3>スコープ検索のLEGBルール</h3>
          <p>Pythonは変数を以下の優先順位で探索します：</p>
          <ol>
            <li><strong>L (Local)</strong>: 関数内部のローカル変数</li>
            <li><strong>E (Enclosing)</strong>: 外側の関数のスコープ (クロージャ)</li>
            <li><strong>G (Global)</strong>: モジュール全体のグローバル変数</li>
            <li><strong>B (Built-in)</strong>: Python組み込み関数 (len, print 等)</li>
          </ol>
          <h4>実務の極意: 純粋関数 (Pure Function)</h4>
          <p>グローバル変数を書き換える（副作用のある）関数はバグの温床になります。引数としてデータを受け取り、新しいデータを返す「純粋関数」を心がけます。</p>
        `,
        key_takeaways: ["LEGB (Local -> Enclosing -> Global -> Built-in) の探索順序", "global キーワードの乱用を避け、引数と戻り値でデータをやり取り", "入力に対して常に同じ出力を返す純粋関数がテスト容易性を高める"],
        example_code: "tax = 0.1 # グローバル\ndef calc(p):\n    return p * (1 + tax) # 読み取りは可能だが書き換えは推奨されない",
        exercise: {
          id: 20,
          title: "非破壊的なカート商品追加関数",
          description: "<p>既存のカート辞書 <code>cart = {\"apple\": 2}</code> と、追加する商品名 <code>item</code>、個数 <code>qty</code> を受け取り、元の <code>cart</code> 辞書を変更（破壊）せず、新しいカート辞書を作成して返す純粋関数 <code>add_to_cart_pure(cart, item, qty)</code> を実装してください。</p>",
          template: "def add_to_cart_pure(cart, item, qty):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'add_to_cart_pure({"apple": 2}, "banana", 3)', expected: { apple: 2, banana: 3 } },
            { input: 'add_to_cart_pure({"apple": 2}, "apple", 1)', expected: { apple: 3 } },
          ],
          solution_code: "def add_to_cart_pure(cart, item, qty):\n    new_cart = cart.copy()\n    new_cart[item] = new_cart.get(item, 0) + qty\n    return new_cart\n",
          explanation: "cart.copy() で複製を作ってから更新することで、元の辞書を破壊しない純粋関数になります。",
        },
      },
      {
        id: 21,
        chapter_id: 6,
        chapter_order: 6,
        chapter_title: "実務レベルの関数設計と型ヒント",
        order: 4,
        title: "6.4 型ヒント (Type Hints) による堅牢性の向上",
        reading_time_minutes: 4,
        content_html: `
          <h3>現代Pythonの実務標準: Type Hints</h3>
          <p>Python 3.5以降で導入された型アノテーションにより、エディタの自動補完や静的型チェッカー (mypy) の恩恵を最大限に受けることができます。</p>
          <pre><code class="language-python"># Python 3.9+ のモダンな型ヒント
def calculate_tax(price: int, rate: float = 0.1) -> int:
    return int(price * (1 + rate))

def find_user_emails(users: list[dict[str, str]]) -> list[str]:
    return [u["email"] for u in users if "email" in u]</code></pre>
          <p><code>typing</code> モジュールの <code>Optional[str]</code> (Noneを許容) や <code>Union[int, float]</code> (複数型) も多用されます。</p>
        `,
        key_takeaways: ["引数名: 型, -> 戻り値の型 でアノテーション", "list[str], dict[str, int] でコレクションの内部型を明示", "実行時オーバーヘッドなしで可読性と保守性が劇的に向上"],
        example_code: "def format_price(amount: int) -> str:\n    return f'￥{amount:,}'\nprint(format_price(1000000))",
        exercise: {
          id: 21,
          title: "BMI指数の計算と判定 (型ヒント対応)",
          description: "<p>身長 <code>height_cm: float</code> (cm単位) と 体重 <code>weight_kg: float</code> を受け取り、BMI値 <code>weight_kg / ((height_cm / 100) ** 2)</code> を小数第1位まで（<code>round(bmi, 1)</code>）で計算して返す関数 <code>calc_bmi(height_cm: float, weight_kg: float) -> float</code> を実装してください。</p>",
          template: "def calc_bmi(height_cm: float, weight_kg: float) -> float:\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "calc_bmi(170.0, 65.0)", expected: 22.5 },
            { input: "calc_bmi(160.0, 50.0)", expected: 19.5 },
          ],
          solution_code: "def calc_bmi(height_cm: float, weight_kg: float) -> float:\n    h_m = height_cm / 100.0\n    return round(weight_kg / (h_m ** 2), 1)\n",
          explanation: "身長をメートルに変換し、体重 / (身長^2) を計算して round(..., 1) で丸めます。",
        },
      },
    ],
  },

  // =========================================================================
  // 第7章: 例外処理とファイル・データ入出力 (3単元)
  // =========================================================================
  {
    id: 7,
    order: 7,
    title: "第7章: 例外処理とファイル・データ入出力",
    subtitle: "try-except・with構文・JSONデータ処理",
    icon: "document-text",
    category: "library",
    target_level: 3,
    summary: "実務開発で最も重要なエラー耐性 (try-except-else-finally)、リソースリークを防ぐwith構文、そしてWebや設定ファイルで必須のJSON読み書きをマスターします。",
    lessons: [
      {
        id: 22,
        chapter_id: 7,
        chapter_order: 7,
        chapter_title: "例外処理とファイル・データ入出力",
        order: 1,
        title: "7.1 try-except-else-finally によるエラーハンドリング",
        reading_time_minutes: 5,
        content_html: `
          <h3>堅牢なプログラムのための例外処理</h3>
          <pre><code class="language-python">try:
    # エラーが発生する可能性のある処理
    value = int(user_input)
    result = 100 / value
except ValueError:
    print("数値を入力してください")
except ZeroDivisionError:
    print("0で割ることはできません")
else:
    print(f"計算成功: {result}") # 例外が起きなかった時のみ実行
finally:
    print("クリーンアップ処理")  # 成功・失敗に関わらず必ず実行</code></pre>
          <div class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-xs mt-2">
            <strong>⚠️ 実務の注意点:</strong> 何も特定しない <code>except:</code> (Bare except) や <code>except Exception: pass</code> のようにエラーをもみ消す書き方はバグの特定を困難にするため禁止です。必ず具体的な例外クラスを指定します。
          </div>
        `,
        key_takeaways: ["except SpecificError で想定されるエラーを個別に捕捉", "else は例外が発生しなかった時、finally は必ず実行", "エラーをもみ消さず適切にログやフォールバックを実装"],
        example_code: "def safe_int(val, default=0):\n    try:\n        return int(val)\n    except (ValueError, TypeError):\n        return default",
        exercise: {
          id: 22,
          title: "安全な除算関数 (エラー耐性)",
          description: "<p>割られる数 <code>a</code> と 割る数 <code>b</code> を受け取り、<code>a / b</code> の除算結果を返す関数 <code>safe_divide(a, b)</code> を実装してください。<br>・<code>ZeroDivisionError</code> や 型不一致の <code>TypeError</code> が発生した場合は <code>None</code> を返してください。</p>",
          template: "def safe_divide(a, b):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "safe_divide(10, 2)", expected: 5.0 },
            { input: "safe_divide(10, 0)", expected: null },
            { input: 'safe_divide("10", 2)', expected: null },
          ],
          solution_code: "def safe_divide(a, b):\n    try:\n        return a / b\n    except (ZeroDivisionError, TypeError):\n        return None\n",
          explanation: "try-except で ZeroDivisionError と TypeError を安全に捕捉して None を返します。",
        },
      },
      {
        id: 23,
        chapter_id: 7,
        chapter_order: 7,
        chapter_title: "例外処理とファイル・データ入出力",
        order: 2,
        title: "7.2 with構文による安全なテキスト・ファイル読み書き",
        reading_time_minutes: 4,
        content_html: `
          <h3>コンテキストマネージャ (with 構文)</h3>
          <p>ファイルを扱う際は、必ず <code>with</code> 構文を使用します。途中で例外が発生しても、自動的に <code>file.close()</code> が呼ばれリソースリークを防ぎます。</p>
          <pre><code class="language-python"># ファイルの書き込み
with open("sample.txt", "w", encoding="utf-8") as f:
    f.write("1行目: Python\\n")
    f.write("2行目: 実務開発\\n")

# ファイルの行ごと読み込み (メモリ効率的)
with open("sample.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())</code></pre>
        `,
        key_takeaways: ["with open(...) as f: で確実にファイルをクローズ", "日本語環境では必ず encoding='utf-8' を明示", "大きなファイルは for line in f で1行ずつストリーム読み込み"],
        example_code: "text = 'line1\\nline2\\nline3'\nlines = [l.strip() for l in text.splitlines()]",
        exercise: {
          id: 23,
          title: "ログテキスト行の解析とエラー行抽出",
          description: '<p>複数行のログ文字列 <code>log_data</code> (例: <code>"INFO: start\\nERROR: db timeout\\nINFO: done"</code>) を受け取り、<code>"ERROR:"</code> から始まる行のみを抽出して、余分な空白を除去したリストを返す関数 <code>extract_error_logs(log_data)</code> を実装してください。</p>',
          template: "def extract_error_logs(log_data):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'extract_error_logs("INFO: app start\\nERROR: disk full\\nINFO: step 1\\nERROR: conn fail")', expected: ["ERROR: disk full", "ERROR: conn fail"] },
            { input: 'extract_error_logs("INFO: all good\\nDEBUG: testing")', expected: [] },
          ],
          solution_code: "def extract_error_logs(log_data):\n    return [line.strip() for line in log_data.splitlines() if line.strip().startswith('ERROR:')]\n",
          explanation: "splitlines() で各行に分割し、startswith('ERROR:') を満たす行をリストにして返します。",
        },
      },
      {
        id: 24,
        chapter_id: 7,
        chapter_order: 7,
        chapter_title: "例外処理とファイル・データ入出力",
        order: 3,
        title: "7.3 JSONデータのパースとシリアライズ (jsonモジュール)",
        reading_time_minutes: 4,
        content_html: `
          <h3>Web APIとデータ交換の標準: JSON</h3>
          <p>Pythonの <code>json</code> モジュールで、Python辞書とJSON文字列を相互変換します。</p>
          <ul>
            <li><code>json.loads(str)</code>: JSON文字列 → Pythonオブジェクト (パース)</li>
            <li><code>json.dumps(obj)</code>: Pythonオブジェクト → JSON文字列 (シリアライズ)</li>
          </ul>
          <pre><code class="language-python">import json

data = {"user": "Alice", "skills": ["Python", "Git"], "active": True}

# JSON文字列へ変換 (整形付き)
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)

# 復元
parsed = json.loads(json_str)
print(parsed["skills"][0]) # 'Python'</code></pre>
        `,
        key_takeaways: ["json.loads() で文字列から辞書/リストに変換", "json.dumps(..., ensure_ascii=False) で日本語をエスケープせず出力", "Web API通信や設定ファイル管理の根幹技術"],
        example_code: "import json\nraw = '{\"name\": \"Bob\", \"age\": 25}'\nuser = json.loads(raw)\nprint(f'{user[\"name\"]} ({user[\"age\"]})')",
        exercise: {
          id: 24,
          title: "JSONユーザーリストからの特定ユーザー抽出",
          description: '<p>ユーザー一覧のJSON文字列 <code>json_str</code> (例: <code>\'[{"name": "Alice", "active": true}, {"name": "Bob", "active": false}]\'</code>) を受け取り、<code>"active"</code> が <code>True</code> のユーザー名のみを集めたリストを返す関数 <code>get_active_usernames(json_str)</code> を実装してください。</p>',
          template: "import json\n\ndef get_active_usernames(json_str):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'get_active_usernames(\'[{"name": "Alice", "active": true}, {"name": "Bob", "active": false}, {"name": "Charlie", "active": true}]\')', expected: ["Alice", "Charlie"] },
            { input: 'get_active_usernames(\'[{"name": "Tom", "active": false}]\')', expected: [] },
          ],
          solution_code: "import json\n\ndef get_active_usernames(json_str):\n    users = json.loads(json_str)\n    return [u[\"name\"] for u in users if u.get(\"active\", False)]\n",
          explanation: "json.loads でパースし、リスト内包表記で active == True の name を抽出します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第8章: 実用標準ライブラリの徹底活用 (4単元)
  // =========================================================================
  {
    id: 8,
    order: 8,
    title: "第8章: 実用標準ライブラリの徹底活用",
    subtitle: "datetime・re・collections・math/random",
    icon: "puzzle-piece",
    category: "library",
    target_level: 3,
    summary: "実務開発の現場で「車輪の再発明」を防ぎ、効率的で高速なコードを書くための必修標準ライブラリ群を使いこなします。",
    lessons: [
      {
        id: 25,
        chapter_id: 8,
        chapter_order: 8,
        chapter_title: "実用標準ライブラリの徹底活用",
        order: 1,
        title: "8.1 datetime による実務の日時計算とフォーマット",
        reading_time_minutes: 5,
        content_html: `
          <h3>日付・時刻の操作 (datetime モジュール)</h3>
          <ul>
            <li><code>datetime.now()</code>: 現在日時の取得</li>
            <li><code>dt.strftime("%Y-%m-%d %H:%M:%S")</code>: 日時 → 文字列フォーマット</li>
            <li><code>datetime.strptime(str, format)</code>: 文字列 → 日時オブジェクト</li>
            <li><code>timedelta(days=7, hours=2)</code>: 日時加減算・期間計算</li>
          </ul>
          <pre><code class="language-python">from datetime import datetime, timedelta

now = datetime.now()
one_week_later = now + timedelta(days=7)
print("1週間後:", one_week_later.strftime("%Y/%m/%d"))</code></pre>
        `,
        key_takeaways: ["strftime で文字列表現に変換、strptime で文字列から復元", "timedelta で日数や時間の加算・減算・差分計算", "タイムゾーン (timezone) の意識も実務で重要"],
        example_code: "from datetime import date\nd1 = date(2026, 12, 31)\nd2 = date(2026, 1, 1)\nprint('年間日数:', (d1 - d2).days + 1)",
        exercise: {
          id: 25,
          title: "締切日までの残り日数計算",
          description: '<p>現在の日付文字列 <code>today_str</code> と 締切日の日付文字列 <code>deadline_str</code>（どちらも <code>"YYYY-MM-DD"</code> 形式）を受け取り、締切までの残り日数を整数で返す関数 <code>days_until_deadline(today_str, deadline_str)</code> を実装してください。<br>※すでに締切を過ぎている場合は負の整数を返します。</p>',
          template: "from datetime import datetime\n\ndef days_until_deadline(today_str, deadline_str):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'days_until_deadline("2026-08-01", "2026-08-15")', expected: 14 },
            { input: 'days_until_deadline("2026-10-10", "2026-10-10")', expected: 0 },
            { input: 'days_until_deadline("2026-12-31", "2026-12-25")', expected: -6 },
          ],
          solution_code: "from datetime import datetime\n\ndef days_until_deadline(today_str, deadline_str):\n    fmt = \"%Y-%m-%d\"\n    d1 = datetime.strptime(today_str, fmt)\n    d2 = datetime.strptime(deadline_str, fmt)\n    return (d2 - d1).days\n",
          explanation: "strptime で両方の日付オブジェクトを生成し、引き算して .days を取得します。",
        },
      },
      {
        id: 26,
        chapter_id: 8,
        chapter_order: 8,
        chapter_title: "実用標準ライブラリの徹底活用",
        order: 2,
        title: "8.2 re (正規表現) による文字列パターン抽出・置換",
        reading_time_minutes: 5,
        content_html: `
          <h3>正規表現 (Regular Expression)</h3>
          <p>複雑な文字列パターンの検索・抽出・バリデーション・置換を行います。</p>
          <ul>
            <li><code>re.search(pattern, text)</code>: 最初の一致を検索</li>
            <li><code>re.findall(pattern, text)</code>: 一致するすべての部分をリストで取得</li>
            <li><code>re.sub(pattern, repl, text)</code>: パターンに一致する部分を置換</li>
          </ul>
          <pre><code class="language-python">import re

text = "連絡先: 090-1234-5678, 03-9876-5432"
# 電話番号パターンの抽出
phones = re.findall(r"\d{2,4}-\d{2,4}-\d{4}", text)
print(phones) # ['090-1234-5678', '03-9876-5432']</code></pre>
        `,
        key_takeaways: ["生文字列 r'...' を使ってエスケープシーケンスを安全に記述", "re.findall で条件に合う全データを一括抽出", "re.sub でマスキングや文字の正規化を一撃で処理"],
        example_code: "import re\ntext = 'User123 (Age: 25)'\nprint(re.findall(r'\\d+', text)) # ['123', '25']",
        exercise: {
          id: 26,
          title: "郵便番号の抽出とハイフン統一",
          description: '<p><code>re</code> モジュールを用いて、文章 <code>text</code> から日本の7桁郵便番号（<code>123-4567</code> または <code>1234567</code>）をすべて抽出し、すべて <code>"XXX-XXXX"</code> 形式に正規化したリストを返す関数 <code>extract_and_format_zipcodes(text)</code> を実装してください。</p>',
          template: "import re\n\ndef extract_and_format_zipcodes(text):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'extract_and_format_zipcodes("〒100-0001 東京都、〒1500042 渋谷区")', expected: ["100-0001", "150-0042"] },
            { input: 'extract_and_format_zipcodes("郵便番号なし")', expected: [] },
          ],
          solution_code: "import re\n\ndef extract_and_format_zipcodes(text):\n    matches = re.findall(r'(\\d{3})-?(\\d{4})', text)\n    return [f\"{m[0]}-{m[1]}\" for m in matches]\n",
          explanation: "(\\d{3})-?(\\d{4}) で3桁と4桁をグループキャプチャし、ハイフン付きに成形します。",
        },
      },
      {
        id: 27,
        chapter_id: 8,
        chapter_order: 8,
        chapter_title: "実用標準ライブラリの徹底活用",
        order: 3,
        title: "8.3 collections (Counter, defaultdict) による高度なデータ集計",
        reading_time_minutes: 4,
        content_html: `
          <h3>標準ライブラリ collections の威力</h3>
          <h4>1. collections.Counter</h4>
          <p>要素の出現頻度を一瞬でカウントし、最頻値を取得できます。</p>
          <pre><code class="language-python">from collections import Counter

votes = ["apple", "banana", "apple", "orange", "apple", "banana"]
counts = Counter(votes)
print(counts.most_common(1)) # [('apple', 3)]</code></pre>
          <h4>2. collections.defaultdict</h4>
          <p>初期値を持つ辞書。キーが存在するかチェックするコードが不要になります。</p>
          <pre><code class="language-python">from collections import defaultdict

groups = defaultdict(list)
groups["frontend"].append("React") # KeyError にならない！</code></pre>
        `,
        key_takeaways: ["Counter(list) で要素ごとのカウントを一撃実行", "Counter.most_common(N) で頻出トップNを取得", "defaultdict(list/int) でキー初期化コードを削減"],
        example_code: "from collections import Counter\nwords = 'to be or not to be'.split()\nprint(Counter(words))",
        exercise: {
          id: 27,
          title: "最頻出単語の取得",
          description: "<p>単語リスト <code>words</code> を受け取り、最も出現頻度が高い単語を文字列で返す関数 <code>get_most_frequent_word(words)</code> を <code>collections.Counter</code> を使って実装してください。（※最頻値が複数ある場合は先に見つかったものを1つ返してください）</p>",
          template: "from collections import Counter\n\ndef get_most_frequent_word(words):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: 'get_most_frequent_word(["python", "js", "python", "ruby", "python", "js"])', expected: "python" },
            { input: 'get_most_frequent_word(["dog", "cat", "dog"])', expected: "dog" },
          ],
          solution_code: "from collections import Counter\n\ndef get_most_frequent_word(words):\n    if not words:\n        return \"\"\n    return Counter(words).most_common(1)[0][0]\n",
          explanation: "Counter(words).most_common(1)[0][0] で最頻出の単語名を取得します。",
        },
      },
      {
        id: 28,
        chapter_id: 8,
        chapter_order: 8,
        chapter_title: "実用標準ライブラリの徹底活用",
        order: 4,
        title: "8.4 math と random による数値計算と乱数シミュレーション",
        reading_time_minutes: 4,
        content_html: `
          <h3>数値・統計・乱数処理</h3>
          <h4>1. math モジュール</h4>
          <ul>
            <li><code>math.sqrt(x)</code>: 平方根 (√x)</li>
            <li><code>math.ceil(x)</code>: 切り上げ / <code>math.floor(x)</code>: 切り捨て</li>
            <li><code>math.gcd(a, b)</code>: 最大公約数</li>
          </ul>
          <h4>2. random モジュール</h4>
          <ul>
            <li><code>random.randint(a, b)</code>: a から b までのランダムな整数</li>
            <li><code>random.choice(seq)</code>: シーケンスから1要素をランダム選択</li>
            <li><code>random.sample(seq, k)</code>: 重複なしで k 個をランダム抽出</li>
            <li><code>random.shuffle(seq)</code>: リストの要素をシャッフル</li>
          </ul>
        `,
        key_takeaways: ["math.ceil / math.floor で正確な端数処理", "random.sample で重複のないランダムサンプリング", "シミュレーションやゲーム開発、テストデータ生成の基礎"],
        example_code: "import math\nprint('√16 =', math.sqrt(16))\nprint('切り上げ:', math.ceil(4.2))",
        exercise: {
          id: 28,
          title: "最大公約数と最小公倍数の計算",
          description: "<p>2つの正の整数 <code>a</code> と <code>b</code> を受け取り、その最大公約数 (GCD) と 最小公倍数 (LCM) のタプル <code>(gcd, lcm)</code> を返す関数 <code>calc_gcd_lcm(a, b)</code> を <code>math.gcd</code> を用いて実装してください。<br>※最小公倍数公式: <code>(a * b) // gcd</code></p>",
          template: "import math\n\ndef calc_gcd_lcm(a, b):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "calc_gcd_lcm(12, 18)", expected: [6, 36] },
            { input: "calc_gcd_lcm(7, 5)", expected: [1, 35] },
          ],
          solution_code: "import math\n\ndef calc_gcd_lcm(a, b):\n    g = math.gcd(a, b)\n    l = (a * b) // g\n    return (g, l)\n",
          explanation: "math.gcd で最大公約数を求め、(a * b) // g で最小公倍数を算出します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第9章: オブジェクト指向とクラス設計 (4単元)
  // =========================================================================
  {
    id: 9,
    order: 9,
    title: "第9章: オブジェクト指向とクラス設計",
    subtitle: "クラス定義・カプセル化・継承・特殊メソッド",
    icon: "cube",
    category: "algorithm",
    target_level: 4,
    summary: "データと振る舞いを1つにまとめるオブジェクト指向プログラミング (OOP)。クラスの基本からカプセル化(@property)、継承、特殊メソッドまで本格開発の基盤をマスターします。",
    lessons: [
      {
        id: 29,
        chapter_id: 9,
        chapter_order: 9,
        chapter_title: "オブジェクト指向とクラス設計",
        order: 1,
        title: "9.1 クラス (class) の基本と __init__ コンストラクタ",
        reading_time_minutes: 5,
        content_html: `
          <h3>クラスによるカスタム型の作成</h3>
          <p>クラスは「設計図」、インスタンスは設計図から作られた「実体」です。</p>
          <pre><code class="language-python">class User:
    def __init__(self, name: str, email: str):
        # インスタンス変数の初期化
        self.name = name
        self.email = email
        self.login_count = 0

    def login(self):
        self.login_count += 1
        return f"{self.name} logged in ({self.login_count} times)"

# インスタンス化
u = User("Alice", "alice@example.com")
print(u.login())</code></pre>
          <p><code>self</code> は、メソッドを呼び出したそのインスタンス自身を指す暗黙の第1引数です。</p>
        `,
        key_takeaways: ["__init__(self, ...) でインスタンス属性を初期化", "self.xxx で自身の属性やメソッドにアクセス", "クラスにより関連するデータと処理を1箇所に集約"],
        example_code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f'{self.name}: わん！'\n\npochi = Dog('ポチ')\nprint(pochi.bark())",
        exercise: {
          id: 29,
          title: "銀行口座クラス (BankAccount)",
          description: "<p>初期残高 <code>initial_balance=0</code> を保持し、預金 <code>deposit(amount)</code> と 引出 <code>withdraw(amount)</code> (残高不足時は False、成功時は True を返す)、残高照会 <code>get_balance()</code> を備えた <code>BankAccount</code> クラスを実装してください。</p>",
          template: "class BankAccount:\n    def __init__(self, initial_balance=0):\n        # ここにコードを書いてください\n        pass\n",
          setup_code: "def test_bank():\n    acc = BankAccount(100)\n    acc.deposit(50)\n    w1 = acc.withdraw(30)\n    w2 = acc.withdraw(200)\n    return (acc.get_balance(), w1, w2)",
          test_cases: [
            { input: "test_bank()", expected: [120, true, false] },
          ],
          solution_code: "class BankAccount:\n    def __init__(self, initial_balance=0):\n        self.balance = initial_balance\n    def deposit(self, amount):\n        self.balance += amount\n    def withdraw(self, amount):\n        if self.balance >= amount:\n            self.balance -= amount\n            return True\n        return False\n    def get_balance(self):\n        return self.balance\n",
          explanation: "初期残高を self.balance に保持し、各メソッドで加減算と条件チェックを行います。",
        },
      },
      {
        id: 30,
        chapter_id: 9,
        chapter_order: 9,
        chapter_title: "オブジェクト指向とクラス設計",
        order: 2,
        title: "9.2 カプセル化とプロパティデコレータ (@property)",
        reading_time_minutes: 5,
        content_html: `
          <h3>安全な属性アクセスと @property</h3>
          <p>直接属性を変更させず、バリデーション（検証）を挟むために <code>@property</code> (ゲッター) と <code>@属性名.setter</code> (セッター) を使用します。</p>
          <pre><code class="language-python">class Circle:
    def __init__(self, radius: float):
        self._radius = radius # 慣例として _ でプライベート変数を示す

    @property
    def radius(self) -> float:
        return self._radius

    @radius.setter
    def radius(self, value: float):
        if value < 0:
            raise ValueError("半径は0以上である必要があります")
        self._radius = value

    @property
    def area(self) -> float:
        return 3.14159 * (self._radius ** 2)

c = Circle(5)
print(c.area) # 属性のようにアクセス可能！</code></pre>
        `,
        key_takeaways: ["@property でメソッドを属性アクセスのように呼び出し可能", "@xxx.setter で値の代入時に不正な値をバリデーション", "不正な状態を持たない堅牢なドメインオブジェクトを構築"],
        example_code: "class Product:\n    def __init__(self, price):\n        self._price = price\n    @property\n    def price(self):\n        return self._price\np = Product(500)\nprint('価格:', p.price)",
        exercise: {
          id: 30,
          title: "温度変換クラス (摂氏と華氏のプロパティ連動)",
          description: "<p>摂氏温度 <code>celsius: float</code> を保持し、華氏温度を計算するプロパティ <code>fahrenheit</code>（計算式: <code>celsius * 1.8 + 32</code>）を持つ <code>Temperature</code> クラスを実装してください。<br>※<code>celsius</code> は初期化時に渡され、<code>fahrenheit</code> プロパティで小数値を取得できるようにしてください。</p>",
          template: "class Temperature:\n    def __init__(self, celsius: float):\n        # ここにコードを書いてください\n        pass\n",
          setup_code: "def test_temp():\n    t1 = Temperature(0.0)\n    t2 = Temperature(100.0)\n    return (t1.fahrenheit, t2.fahrenheit)",
          test_cases: [
            { input: "test_temp()", expected: [32.0, 212.0] },
          ],
          solution_code: "class Temperature:\n    def __init__(self, celsius: float):\n        self.celsius = celsius\n    @property\n    def fahrenheit(self) -> float:\n        return self.celsius * 1.8 + 32.0\n",
          explanation: "@property デコレータを使って fahrenheit プロパティを定義し、計算値を返します。",
        },
      },
      {
        id: 31,
        chapter_id: 9,
        chapter_order: 9,
        chapter_title: "オブジェクト指向とクラス設計",
        order: 3,
        title: "9.3 クラスの継承 (Inheritance) と super()",
        reading_time_minutes: 5,
        content_html: `
          <h3>継承によるコードの再利用と機能拡張</h3>
          <p>既存の親クラス（スーパークラス）の機能を継承し、子クラス（サブクラス）で差分のみを追加・オーバーライドします。</p>
          <pre><code class="language-python">class Employee:
    def __init__(self, name: str, base_salary: int):
        self.name = name
        self.base_salary = base_salary

    def get_salary(self) -> int:
        return self.base_salary

class Manager(Employee):
    def __init__(self, name: str, base_salary: int, bonus: int):
        super().__init__(name, base_salary) # 親の初期化を呼び出す
        self.bonus = bonus

    def get_salary(self) -> int: # メソッドのオーバーライド
        return self.base_salary + self.bonus</code></pre>
        `,
        key_takeaways: ["class Child(Parent): で親クラスの属性とメソッドを継承", "super().__init__(...) で親クラスのコンストラクタを実行", "ポリモーフィズム (多態性) の基盤技術"],
        example_code: "class Animal:\n    def speak(self): return '...'\nclass Cat(Animal):\n    def speak(self): return 'にゃー'\nprint(Cat().speak())",
        exercise: {
          id: 31,
          title: "従業員クラスと役職付きクラスの継承設計",
          description: '<p>基本給 <code>base_pay</code> を持つ <code>Staff</code> クラスと、それを継承して役職手当 <code>allowance</code> を加算した給与を返す <code>Manager</code> クラスを実装してください。<br>・<code>Staff</code>: <code>__init__(name, base_pay)</code>, <code>calc_pay() -> base_pay</code><br>・<code>Manager</code>: <code>__init__(name, base_pay, allowance)</code>, <code>calc_pay() -> base_pay + allowance</code></p>',
          template: "class Staff:\n    # ここにコードを書いてください\n    pass\n\nclass Manager(Staff):\n    # ここにコードを書いてください\n    pass\n",
          setup_code: "def test_emp():\n    s = Staff('Tanaka', 200000)\n    m = Manager('Sato', 300000, 50000)\n    return (s.calc_pay(), m.calc_pay())",
          test_cases: [
            { input: "test_emp()", expected: [200000, 350000] },
          ],
          solution_code: "class Staff:\n    def __init__(self, name, base_pay):\n        self.name = name\n        self.base_pay = base_pay\n    def calc_pay(self):\n        return self.base_pay\n\nclass Manager(Staff):\n    def __init__(self, name, base_pay, allowance):\n        super().__init__(name, base_pay)\n        self.allowance = allowance\n    def calc_pay(self):\n        return self.base_pay + self.allowance\n",
          explanation: "Manager クラスで super().__init__ を呼び出して初期化し、calc_pay メソッドをオーバーライドします。",
        },
      },
      {
        id: 32,
        chapter_id: 9,
        chapter_order: 9,
        chapter_title: "オブジェクト指向とクラス設計",
        order: 4,
        title: "9.4 特殊メソッド (__str__, __len__, __eq__)",
        reading_time_minutes: 5,
        content_html: `
          <h3>ダンダーメソッド (Dunder Methods) のカスタマイズ</h3>
          <p>ダブルアンダースコアで囲まれた特殊メソッドを定義すると、Pythonの標準演算子（<code>+</code> や <code>==</code>、<code>len()</code>、<code>print()</code>）の挙動をカスタマイズできます。</p>
          <ul>
            <li><code>__str__(self)</code>: <code>print()</code> や <code>str()</code> で人間が見やすい文字列表現を返す</li>
            <li><code>__repr__(self)</code>: 開発者向けの詳細な文字列表現を返す</li>
            <li><code>__len__(self)</code>: <code>len(obj)</code> で呼ばれる長さを返す</li>
            <li><code>__eq__(self, other)</code>: <code>obj1 == obj2</code> の同値性判定</li>
          </ul>
        `,
        key_takeaways: ["__str__ でオブジェクトの文字列表現をカスタマイズ", "__eq__ でオブジェクト同士の同値比較 (==) を定義", "Python組み込みの関数や演算子と自然に統合できる"],
        example_code: "class Item:\n    def __init__(self, name, price):\n        self.name, self.price = name, price\n    def __str__(self):\n        return f'{self.name} (￥{self.price})'\nprint(Item('本', 1500))",
        exercise: {
          id: 32,
          title: "2次元ベクトルクラス (Vector2D)",
          description: '<p>x座標とy座標を保持する <code>Vector2D</code> クラスを実装してください。<br>・<code>__init__(self, x, y)</code><br>・<code>__str__(self)</code>: <code>"Vector(x, y)"</code> (例: <code>"Vector(3, 4)"</code>) を返す<br>・<code>__eq__(self, other)</code>: x と y の両方が等しい場合に <code>True</code> を返す</p>',
          template: "class Vector2D:\n    # ここにコードを書いてください\n    pass\n",
          setup_code: "def test_vector():\n    v1 = Vector2D(3, 4)\n    v2 = Vector2D(3, 4)\n    v3 = Vector2D(1, 2)\n    return (str(v1), v1 == v2, v1 == v3)",
          test_cases: [
            { input: "test_vector()", expected: ["Vector(3, 4)", true, false] },
          ],
          solution_code: "class Vector2D:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __str__(self):\n        return f\"Vector({self.x}, {self.y})\"\n    def __eq__(self, other):\n        if isinstance(other, Vector2D):\n            return self.x == other.x and self.y == other.y\n        return False\n",
          explanation: "__str__ でフォーマット文字列を返し、__eq__ で x と y の一致を判定します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第10章: 実践アルゴリズムと効率化・最適化 (3単元)
  // =========================================================================
  {
    id: 10,
    order: 10,
    title: "第10章: 実践アルゴリズムと効率化・最適化",
    subtitle: "二分探索・再帰とメモ化・デコレータ",
    icon: "bolt",
    category: "algorithm",
    target_level: 4,
    summary: "実務開発で大きな差がつくアルゴリズムとパフォーマンス最適化。計算量(O記法)、二分探索、再帰関数とlru_cacheによるメモ化、関数デコレータを極めます。",
    lessons: [
      {
        id: 33,
        chapter_id: 10,
        chapter_order: 10,
        chapter_title: "実践アルゴリズムと効率化・最適化",
        order: 1,
        title: "10.1 二分探索 (Binary Search) と計算量 (O記法)",
        reading_time_minutes: 5,
        content_html: `
          <h3>O(N) から O(log N) への劇的短縮</h3>
          <p>線形探索は100万件のデータから探すのに最大100万回かかりますが、ソート済みデータに対する「二分探索」なら<strong>最大20回</strong>の比較で見つけられます。</p>
          <pre><code class="language-python">def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1</code></pre>
        `,
        key_takeaways: ["ソート済みデータに対して探索範囲を毎ステップ半減", "計算量は O(log N) で大規模データに対して圧倒的性能", "left <= right のループ条件とポインタ更新が核心"],
        example_code: "nums = [10, 20, 30, 40, 50]\nprint('30の位置:', binary_search(nums, 30))",
        exercise: {
          id: 33,
          title: "二分探索関数の完成",
          description: "<p>昇順ソート済みリスト <code>sorted_list</code> と 検索値 <code>target</code> を受け取り、存在すればそのインデックス（0始まり）、存在しなければ <code>-1</code> を返す関数 <code>binary_search(sorted_list, target)</code> を実装してください。</p>",
          template: "def binary_search(sorted_list, target):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "binary_search([1, 3, 5, 7, 9, 11], 7)", expected: 3 },
            { input: "binary_search([10, 20, 30, 40], 10)", expected: 0 },
            { input: "binary_search([2, 4, 6, 8], 5)", expected: -1 },
          ],
          solution_code: "def binary_search(sorted_list, target):\n    left, right = 0, len(sorted_list) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_list[mid] == target:\n            return mid\n        elif sorted_list[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n",
          explanation: "中央値 mid と target の大小関係に応じて探索境界を半分に狭めていきます。",
        },
      },
      {
        id: 34,
        chapter_id: 10,
        chapter_order: 10,
        chapter_title: "実践アルゴリズムと効率化・最適化",
        order: 2,
        title: "10.2 再帰関数 (Recursion) とメモ化キャッシュ",
        reading_time_minutes: 5,
        content_html: `
          <h3>再帰と動的計画法・メモ化 (Memoization)</h3>
          <p>関数が自分自身を呼び出す「再帰」は、階乗や木構造（ディレクトリ探索など）の探索に自然な解法を与えます。</p>
          <h4>メモ化による劇的な高速化 (functools.lru_cache)</h4>
          <p>同じ引数での計算結果をキャッシュすることで、指数関数的な計算量を線形 O(N) に短縮します。</p>
          <pre><code class="language-python">from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50)) # 一瞬で 12586269025 を計算！</code></pre>
        `,
        key_takeaways: ["再帰には必ず終了条件 (Base case) を明記", "計算済みの結果を辞書や @lru_cache でメモ化して再利用", "木構造やグラフの探索、分割統治法の基本"],
        example_code: "def fact(n):\n    return 1 if n <= 1 else n * fact(n - 1)\nprint('5! =', fact(5))",
        exercise: {
          id: 34,
          title: "メモ化付きフィボナッチ数計算",
          description: "<p>0以上の整数 <code>n</code> を受け取り、第 <code>n</code> 番目のフィボナッチ数 <code>F(n)</code> (F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)) を計算して返す高速な関数 <code>fibonacci(n)</code> を実装してください。（※n=35 程度でも瞬時に計算できること）</p>",
          template: "def fibonacci(n, memo=None):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "fibonacci(0)", expected: 0 },
            { input: "fibonacci(1)", expected: 1 },
            { input: "fibonacci(10)", expected: 55 },
            { input: "fibonacci(30)", expected: 832040 },
          ],
          solution_code: "def fibonacci(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n in memo:\n        return memo[n]\n    if n <= 0:\n        return 0\n    if n == 1:\n        return 1\n    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)\n    return memo[n]\n",
          explanation: "memo 辞書に計算結果を保持して重複計算を回避し、高速にフィボナッチ数を返します。",
        },
      },
      {
        id: 35,
        chapter_id: 10,
        chapter_order: 10,
        chapter_title: "実践アルゴリズムと効率化・最適化",
        order: 3,
        title: "10.3 デコレータ (Decorator) による共通処理の分離",
        reading_time_minutes: 5,
        content_html: `
          <h3>関数の振る舞いを拡張する @decorator</h3>
          <p>デコレータは、既存の関数を変更することなく、その前後に共通処理（ログ出力、実行時間計測、権限チェック、リトライ処理など）を追加できる高度な機能です。</p>
          <pre><code class="language-python">import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"[{func.__name__}] 実行時間: {elapsed:.4f}秒")
        return result
    return wrapper

@timer
def heavy_process():
    time.sleep(0.1)
    return "Done"

heavy_process()</code></pre>
        `,
        key_takeaways: ["@decorator で関数の前後に横断的関心事 (ログ・認証・計測) を付与", "functools.wraps で元の関数のドキュメントや名前を保護", "Flask や Django などのWebフレームワークで多用される核心技術"],
        example_code: "def debug_log(func):\n    def wrap(*args):\n        return f'Result: {func(*args)}'\n    return wrap\n\n@debug_log\ndef add(a, b): return a + b\nprint(add(2, 3))",
        exercise: {
          id: 35,
          title: "結果を大文字にするデコレータの実装",
          description: '<p>文字列を返す関数に付与することで、その関数の戻り値をすべて大文字（<code>.upper()</code>）に変換して返すデコレータ関数 <code>uppercase_decorator(func)</code> を実装してください。</p>',
          template: "def uppercase_decorator(func):\n    def wrapper(*args, **kwargs):\n        # ここにコードを書いてください\n        pass\n    return wrapper\n",
          setup_code: "@uppercase_decorator\ndef greet(name):\n    return f'hello, {name}'\n\ndef test_dec():\n    return greet('world')",
          test_cases: [
            { input: "test_dec()", expected: "HELLO, WORLD" },
          ],
          solution_code: "def uppercase_decorator(func):\n    def wrapper(*args, **kwargs):\n        res = func(*args, **kwargs)\n        if isinstance(res, str):\n            return res.upper()\n        return res\n    return wrapper\n",
          explanation: "wrapper 内で元の func(*args, **kwargs) を呼び出し、戻り値が文字列なら .upper() して返します。",
        },
      },
    ],
  },
];

// グローバルスコープに公開
if (typeof window !== "undefined") {
  window.textbookDataChapters = textbookDataChapters;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = textbookDataChapters;
}
