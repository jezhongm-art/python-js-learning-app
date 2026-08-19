from django.core.management.base import BaseCommand
from assessment.models import AssessmentProblem
from curriculum.models import Chapter, Lesson, LessonExercise

class Command(BaseCommand):
    help = '実力診断問題および教科書カリキュラムの初期マスターデータを投入します'

    def handle(self, *args, **options):
        self.stdout.write("マスターデータの初期化を開始します...")

        # ----------------------------------------------------
        # 1. 実力調査アセスメント問題マスター (レベル1〜4)
        # ----------------------------------------------------
        AssessmentProblem.objects.all().delete()

        assessment_problems = [
            # レベル1: 基礎・入門
            {
                'level': 1,
                'category': 'basic',
                'order': 1,
                'title': '1. 数値の四則演算と丸め処理',
                'description': '<p>2つの数値 <code>a</code>, <code>b</code> を受け取り、その平均値（(a + b) / 2）を計算して小数点第1位まで四捨五入した数値（<code>round(avg, 1)</code>）を返す関数 <code>calc_average(a, b)</code> を実装してください。</p>',
                'template': "def calc_average(a, b):\n    # ここにコードを書いてください\n    pass\n",
                'test_cases': [
                    {'input': 'calc_average(10, 20)', 'expected': 15.0},
                    {'input': 'calc_average(5, 6)', 'expected': 5.5},
                    {'input': 'calc_average(1, 2)', 'expected': 1.5},
                ],
                'hint_1': '平均値は <code>(a + b) / 2</code> で求められます。',
                'hint_2': 'Pythonの組み込み関数 <code>round(value, 1)</code> を使うと小数点第1位に丸められます。',
                'model_answer': "def calc_average(a, b):\n    avg = (a + b) / 2\n    return round(avg, 1)\n",
                'model_answer_explanation': '(a + b) で合計を求め、2で割って平均値を算出した後、round(..., 1) で小数点以下1桁に整形して返します。',
                'weight': 10
            },
            {
                'level': 1,
                'category': 'basic',
                'order': 2,
                'title': '2. 文字列の連結とフォーマット',
                'description': '<p>ユーザー名 <code>name</code> (文字列) と 年齢 <code>age</code> (整数) を受け取り、<code>"私の名前は{name}で、{age}歳です。"</code> という挨拶文字列を返す関数 <code>format_greeting(name, age)</code> を実装してください。</p>',
                'template': "def format_greeting(name, age):\n    # ここにコードを書いてください\n    pass\n",
                'test_cases': [
                    {'input': 'format_greeting("田中", 25)', 'expected': "私の名前は田中で、25歳です。"},
                    {'input': 'format_greeting("Alice", 18)', 'expected': "私の名前はAliceで、18歳です。"},
                ],
                'hint_1': 'Python 3.6以降で使える f-string (<code>f"..."</code>) を使うと綺麗に書けます。',
                'hint_2': '<code>return f"私の名前は{name}で、{age}歳です。"</code> のように変数を埋め込みます。',
                'model_answer': "def format_greeting(name, age):\n    return f\"私の名前は{name}で、{age}歳です。\"\n",
                'model_answer_explanation': 'f-string（フォーマット済み文字列リテラル）を用いることで、変数を波括弧 {} の中に直接記述して読みやすく連結できます。',
                'weight': 10
            },

            # レベル2: 制御構文・リスト
            {
                'level': 2,
                'category': 'control',
                'order': 3,
                'title': '3. 条件分岐によるFizzBuzz判定',
                'description': '<p>整数 <code>n</code> を受け取り、15の倍数なら <code>"FizzBuzz"</code>、3の倍数なら <code>"Fizz"</code>、5の倍数なら <code>"Buzz"</code>、それ以外なら数値を文字列にしたもの（<code>str(n)</code>）を返す関数 <code>fizzbuzz_single(n)</code> を実装してください。</p>',
                'template': "def fizzbuzz_single(n):\n    # ここにコードを書いてください\n    pass\n",
                'test_cases': [
                    {'input': 'fizzbuzz_single(15)', 'expected': "FizzBuzz"},
                    {'input': 'fizzbuzz_single(9)', 'expected': "Fizz"},
                    {'input': 'fizzbuzz_single(10)', 'expected': "Buzz"},
                    {'input': 'fizzbuzz_single(7)', 'expected': "7"},
                ],
                'hint_1': '15の倍数（3と5の両方の倍数）の判定を一番最初に行うのがポイントです。',
                'hint_2': '<code>n % 15 == 0</code> -> <code>n % 3 == 0</code> -> <code>n % 5 == 0</code> -> <code>str(n)</code> の順で if-elif-else を組み立てます。',
                'model_answer': "def fizzbuzz_single(n):\n    if n % 15 == 0:\n        return \"FizzBuzz\"\n    elif n % 3 == 0:\n        return \"Fizz\"\n    elif n % 5 == 0:\n        return \"Buzz\"\n    else:\n        return str(n)\n",
                'model_answer_explanation': '条件分岐は上から順に評価されるため、最も狭い条件（15の倍数）から先に判定します。',
                'weight': 10
            },
            {
                'level': 2,
                'category': 'control',
                'order': 4,
                'title': '4. ループと偶数の合計算出',
                'description': '<p>整数のリスト <code>numbers</code> を受け取り、その中の<b>偶数のみ</b>を合計した数値を返す関数 <code>sum_even_numbers(numbers)</code> を実装してください。偶数がない場合やリストが空の場合は <code>0</code> を返してください。</p>',
                'template': "def sum_even_numbers(numbers):\n    # ここにコードを書いてください\n    pass\n",
                'test_cases': [
                    {'input': 'sum_even_numbers([1, 2, 3, 4, 5, 6])', 'expected': 12},
                    {'input': 'sum_even_numbers([1, 3, 5])', 'expected': 0},
                    {'input': 'sum_even_numbers([])', 'expected': 0},
                    {'input': 'sum_even_numbers([10, -2, 4])', 'expected': 12},
                ],
                'hint_1': 'forループでリストを1つずつ取り出し、<code>num % 2 == 0</code> で判定します。',
                'hint_2': 'リスト内包表記 <code>sum([x for x in numbers if x % 2 == 0])</code> でも1行で書けます。',
                'model_answer': "def sum_even_numbers(numbers):\n    return sum(x for x in numbers if x % 2 == 0)\n",
                'model_answer_explanation': 'ジェネレータ式またはforループで偶数条件 (x % 2 == 0) のみを抽出し、組み込み関数 sum() で合計を求めます。',
                'weight': 10
            },

            # レベル3: データ構造・実用標準ライブラリ
            {
                'level': 3,
                'category': 'data_structure',
                'order': 5,
                'title': '5. 辞書による単語カウント集計',
                'description': '<p>単語のリスト <code>words</code> を受け取り、各単語の出現回数を辞書形式（例: <code>{"apple": 2, "banana": 1}</code>）で集計して返す関数 <code>count_words(words)</code> を実装してください。</p>',
                'template': "def count_words(words):\n    # ここにコードを書いてください\n    pass\n",
                'test_cases': [
                    {'input': 'count_words(["apple", "banana", "apple", "orange", "banana", "apple"])', 'expected': '{"apple": 3, "banana": 2, "orange": 1}'},
                    {'input': 'count_words(["python"])', 'expected': '{"python": 1}'},
                    {'input': 'count_words([])', 'expected': '{}'},
                ],
                'hint_1': '空の辞書 <code>counts = {}</code> を用意し、単語が辞書にあるか確認しながらカウントします。',
                'hint_2': '<code>collections.Counter(words)</code> を使って <code>dict(Counter(words))</code> としても作成できます。',
                'model_answer': "from collections import Counter\n\ndef count_words(words):\n    return dict(Counter(words))\n",
                'model_answer_explanation': 'collections.Counter を利用すると、リスト内の要素の出現頻度を高速かつ安全にカウントして辞書化できます。',
                'weight': 15
            },
            {
                'level': 3,
                'category': 'library',
                'order': 6,
                'title': '6. datetime による経過日数計算',
                'description': '<p><code>datetime</code> モジュールを用いて、2つの日付文字列 <code>d1</code>, <code>d2</code> (形式: "YYYY-MM-DD") を受け取り、2つの日付の間の日数差（絶対値の整数）を返す関数 <code>calc_days_between(d1, d2)</code> を実装してください。</p>',
                'template': "import datetime\n\ndef calc_days_between(d1, d2):\n    # ここにコードを書いてください\n    pass\n",
                'test_cases': [
                    {'input': 'calc_days_between("2026-08-01", "2026-08-20")', 'expected': 19},
                    {'input': 'calc_days_between("2026-01-01", "2026-01-01")', 'expected': 0},
                    {'input': 'calc_days_between("2026-12-31", "2026-01-01")', 'expected': 364},
                ],
                'hint_1': '<code>datetime.date.fromisoformat(d1)</code> または <code>datetime.datetime.strptime()</code> で日付オブジェクトに変換します。',
                'hint_2': '日付同士を引き算すると <code>timedelta</code> オブジェクトが得られ、<code>abs((date1 - date2).days)</code> で日数が取得できます。',
                'model_answer': "import datetime\n\ndef calc_days_between(d1, d2):\n    date1 = datetime.date.fromisoformat(d1)\n    date2 = datetime.date.fromisoformat(d2)\n    return abs((date1 - date2).days)\n",
                'model_answer_explanation': 'datetime.date.fromisoformat で YYYY-MM-DD 文字列を日付オブジェクト化し、差分の .days プロパティを abs() で絶対値にして返します。',
                'weight': 15
            },
            {
                'level': 3,
                'category': 'library',
                'order': 7,
                'title': '7. re (正規表現) によるメールアドレス判定',
                'description': '<p><code>re</code> モジュールを用いて、文字列 <code>email</code> が一般的なメールアドレス形式（ユーザー名@ドメイン.拡張子）と完全一致していれば <code>True</code>、不正なら <code>False</code> を返す関数 <code>validate_email(email)</code> を実装してください。</p>',
                'template': "import re\n\ndef validate_email(email):\n    # ここにコードを書いてください\n    pass\n",
                'test_cases': [
                    {'input': 'validate_email("user@example.com")', 'expected': True},
                    {'input': 'validate_email("dev.test@company.co.jp")', 'expected': True},
                    {'input': 'validate_email("invalid-address")', 'expected': False},
                    {'input': 'validate_email("user@domain")', 'expected': False},
                ],
                'hint_1': '正規表現パターン <code>r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"</code> を作成します。',
                'hint_2': '<code>bool(re.match(pattern, email))</code> で完全一致判定を行います。',
                'model_answer': "import re\n\ndef validate_email(email):\n    pattern = r\"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$\"\n    return bool(re.match(pattern, email))\n",
                'model_answer_explanation': 're.match() を用いて先頭から末尾まで (@ やドットを含む) メールアドレスの正規表現パターンと照合し、bool値で返します。',
                'weight': 15
            },

            # レベル4: 可視化・アルゴリズム・設計
            {
                'level': 4,
                'category': 'plot',
                'order': 8,
                'title': '8. Matplotlib による月別売上折れ線グラフ',
                'description': '<p><code>matplotlib.pyplot</code> を用いて、月別売上の折れ線グラフを描画してください。<br/>月データ <code>months = ["4月", "5月", "6月"]</code>、売上データ <code>sales = [120, 150, 180]</code> を指定し、タイトルを <code>"売上推移"</code> として <code>plt.show()</code> してください。</p>',
                'problem_type': 'plot',
                'template': "import matplotlib.pyplot as plt\n\nmonths = [\"4月\", \"5月\", \"6月\"]\nsales = [120, 150, 180]\n\n# ここにグラフ描画コードを書いてください\n\n",
                'test_cases': [
                    {'check': 'type', 'expected': 'line', 'input_label': "グラフ種別が 'line' (折れ線)"},
                    {'check': 'title', 'expected': '売上推移', 'input_label': "タイトルが '売上推移'"},
                    {'check': 'labels', 'expected': ['4月', '5月', '6月'], 'input_label': "X軸ラベルが ['4月', '5月', '6月']"},
                    {'check': 'first_dataset_data', 'expected': [120, 150, 180], 'input_label': "データ配列が [120, 150, 180]"}
                ],
                'hint_1': '折れ線グラフは <code>plt.plot(x, y)</code> で描画します。',
                'hint_2': 'タイトル設定は <code>plt.title("売上推移")</code>、描画完了は <code>plt.show()</code> を呼び出します。',
                'model_answer': "import matplotlib.pyplot as plt\n\nmonths = [\"4月\", \"5月\", \"6月\"]\nsales = [120, 150, 180]\n\nplt.plot(months, sales)\nplt.title(\"売上推移\")\nplt.show()\n",
                'model_answer_explanation': 'plt.plot() に X 軸データと Y 軸データを渡し、plt.title() でタイトルを設定した後に plt.show() で出力します。',
                'weight': 15
            },
        ]

        for p_data in assessment_problems:
            AssessmentProblem.objects.create(**p_data)
        self.stdout.write(self.style.SUCCESS(f"実力診断問題: {len(assessment_problems)}件を投入しました。"))

        # ----------------------------------------------------
        # 2. 教科書カリキュラムマスター (第1章〜第8章)
        # ----------------------------------------------------
        Chapter.objects.all().delete()

        chapters_data = [
            {
                'order': 1,
                'title': '第1章: Pythonの第一歩と基本データ型',
                'subtitle': '変数・数値・文字列・四則演算のマスター',
                'icon': 'sparkles',
                'category': 'basic',
                'target_level': 1,
                'summary': 'Pythonの基本思想、変数の定義、数値型(int, float)、文字列型(str)の操作とf-stringによる美しい文字列フォーマットを学びます。',
                'lessons': [
                    {
                        'order': 1,
                        'title': '1.1 変数宣言と数値の計算',
                        'reading_time_minutes': 3,
                        'content_html': """
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
""",
                        'key_takeaways': ['代入記号 = で変数を定義', '除算 / は常に float 型を返す', '// は商、% は余りを計算'],
                        'example_code': "a = 17\nb = 5\nprint('商:', a // b)\nprint('余り:', a % b)",
                        'exercise': {
                            'title': '台形の面積計算',
                            'description': '<p>上底 <code>top</code>、下底 <code>bottom</code>、高さ <code>height</code> を受け取り、台形の面積 <code>(top + bottom) * height / 2</code> を計算して返す関数 <code>calc_trapezoid_area(top, bottom, height)</code> を実装してください。</p>',
                            'template': "def calc_trapezoid_area(top, bottom, height):\n    # ここにコードを書いてください\n    pass\n",
                            'test_cases': [
                                {'input': 'calc_trapezoid_area(3, 5, 4)', 'expected': 16.0},
                                {'input': 'calc_trapezoid_area(10, 20, 5)', 'expected': 75.0},
                            ],
                            'solution_code': "def calc_trapezoid_area(top, bottom, height):\n    return (top + bottom) * height / 2\n",
                            'explanation': '台形の公式 (上底 + 下底) * 高さ / 2 をそのまま計算式にして返します。'
                        }
                    },
                    {
                        'order': 2,
                        'title': '1.2 文字列の操作と f-string',
                        'reading_time_minutes': 4,
                        'content_html': """
<h3>文字列の埋め込みとスライス</h3>
<p>Python 3.6以降の標準である <code>f-string</code> (フォーマット済み文字列) を使うと、変数を直感的に埋め込めます。</p>
<pre><code class="language-python">item = "りんご"
count = 3
price = 150
message = f"{item}が{count}個で合計{count * price}円です。"
print(message)</code></pre>
""",
                        'key_takeaways': ['f"..." 内で {変数} や {式} を評価可能', 'len(str) で文字列の長さを取得'],
                        'example_code': "name = 'Python'\nprint(f'Hello, {name}!')",
                        'exercise': {
                            'title': '商品ラベルの生成',
                            'description': '<p>商品名 <code>product</code> と 単価 <code>price</code> を受け取り、<code>"【商品】{product} : ￥{price}"</code> というラベル文字列を返す関数 <code>make_price_label(product, price)</code> を実装してください。</p>',
                            'template': "def make_price_label(product, price):\n    # ここにコードを書いてください\n    pass\n",
                            'test_cases': [
                                {'input': 'make_price_label("ノートPC", 85000)', 'expected': "【商品】ノートPC : ￥85000"},
                                {'input': 'make_price_label("マウス", 2400)', 'expected': "【商品】マウス : ￥2400"},
                            ],
                            'solution_code': "def make_price_label(product, price):\n    return f\"【商品】{product} : ￥{price}\"\n",
                            'explanation': 'f-string で変数を埋め込んで指定のフォーマットを作成します。'
                        }
                    }
                ]
            },
            {
                'order': 2,
                'title': '第2章: 条件分岐とループ処理の極意',
                'subtitle': 'if文・for文・while文による柔軟な制御',
                'icon': 'arrows-split',
                'category': 'control',
                'target_level': 2,
                'summary': 'プログラムに知性を与える条件分岐 (if-elif-else) と、反復処理 (for, while, range) の基礎から応用までを習得します。',
                'lessons': [
                    {
                        'order': 1,
                        'title': '2.1 if-elif-else による複数条件分岐',
                        'reading_time_minutes': 4,
                        'content_html': """
<h3>条件分岐の組み立て</h3>
<p>Pythonはインデント（字下げ・半角スペース4つ）でブロックを表現します。</p>
<pre><code class="language-python">score = 85
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"</code></pre>
""",
                        'key_takeaways': ['コロン : の後にインデントで処理を書く', '論理演算子 and, or, not で複合条件'],
                        'example_code': "age = 20\nif age >= 18:\n    print('成人')\nelse:\n    print('未成年')",
                        'exercise': {
                            'title': '年齢区分判定プログラム',
                            'description': '<p>年齢 <code>age</code> を受け取り、12歳以下なら <code>"child"</code>、13〜19歳なら <code>"teen"</code>、20〜64歳なら <code>"adult"</code>、65歳以上なら <code>"senior"</code> を返す関数 <code>get_age_category(age)</code> を実装してください。</p>',
                            'template': "def get_age_category(age):\n    # ここにコードを書いてください\n    pass\n",
                            'test_cases': [
                                {'input': 'get_age_category(10)', 'expected': "child"},
                                {'input': 'get_age_category(15)', 'expected': "teen"},
                                {'input': 'get_age_category(30)', 'expected': "adult"},
                                {'input': 'get_age_category(70)', 'expected': "senior"},
                            ],
                            'solution_code': "def get_age_category(age):\n    if age <= 12:\n        return \"child\"\n    elif age <= 19:\n        return \"teen\"\n    elif age <= 64:\n        return \"adult\"\n    else:\n        return \"senior\"\n",
                            'explanation': '年齢の範囲を if-elif-else で段階的に判定して対応する文字列を返します。'
                        }
                    }
                ]
            },
            {
                'order': 3,
                'title': '第3章: 関数設計とスコープ',
                'subtitle': '再利用可能なモジュール化と引数・戻り値',
                'icon': 'code',
                'category': 'basic',
                'target_level': 2,
                'summary': 'defによる関数定義、デフォルト引数、可変長引数(*args, **kwargs)、ローカル・グローバルスコープを学びます。',
                'lessons': [
                    {
                        'order': 1,
                        'title': '3.1 関数の基本とデフォルト引数',
                        'reading_time_minutes': 4,
                        'content_html': "<p>関数を使うことで同じ処理をまとめ、コードを綺麗に保ちます。</p>",
                        'key_takeaways': ['def 関数名(引数): で定義', 'return で戻り値を返す'],
                        'example_code': "def add(a, b=10):\n    return a + b\nprint(add(5))",
                        'exercise': {
                            'title': '割引計算関数',
                            'description': '<p>定価 <code>price</code> と 割引率 <code>discount</code> (0.0〜1.0) を受け取り、割引後の整数金額（<code>int(price * (1 - discount))</code>）を返す関数 <code>apply_discount(price, discount)</code> を実装してください。</p>',
                            'template': "def apply_discount(price, discount):\n    # ここにコードを書いてください\n    pass\n",
                            'test_cases': [
                                {'input': 'apply_discount(1000, 0.2)', 'expected': 800},
                                {'input': 'apply_discount(500, 0.1)', 'expected': 450},
                            ],
                            'solution_code': "def apply_discount(price, discount):\n    return int(price * (1 - discount))\n",
                            'explanation': '定価に (1 - 割引率) を掛けて int() で端数を切り捨てて返します。'
                        }
                    }
                ]
            },
            {
                'order': 4,
                'title': '第4章: 高度なデータ構造 (辞書・集合・内包表記)',
                'subtitle': '高速なデータ検索・操作・フィルタリング',
                'icon': 'database',
                'category': 'data_structure',
                'target_level': 3,
                'summary': 'キーと値で管理する辞書 (dict)、重複を許さない集合 (set)、そしてPythonらしい簡潔なリスト内包表記を極めます。',
                'lessons': [
                    {
                        'order': 1,
                        'title': '4.1 辞書操作とリスト内包表記',
                        'reading_time_minutes': 5,
                        'content_html': """
<h3>リスト内包表記の威力</h3>
<p>forループを使わずに1行で新しいリストを生成できます。</p>
<pre><code class="language-python"># 1〜10の偶数の2乗リスト
squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(squares) # [4, 16, 36, 64, 100]</code></pre>
""",
                        'key_takeaways': ['[式 for 変数 in イテラブル if 条件] で簡潔に記述', '辞書の .get(key, default) で安全に値取得'],
                        'example_code': "data = {'apple': 100, 'banana': 200}\nprint(data.get('orange', 0))",
                        'exercise': {
                            'title': '指定文字数以上の単語フィルタリング',
                            'description': '<p>単語リスト <code>words</code> と 最小文字数 <code>min_len</code> を受け取り、文字数が <code>min_len</code> 以上の単語のみを大文字に変換したリストを返す関数 <code>filter_and_upper_words(words, min_len)</code> を実装してください。</p>',
                            'template': "def filter_and_upper_words(words, min_len):\n    # ここにコードを書いてください\n    pass\n",
                            'test_cases': [
                                {'input': 'filter_and_upper_words(["cat", "elephant", "dog", "tiger"], 4)', 'expected': ["ELEPHANT", "TIGER"]},
                                {'input': 'filter_and_upper_words(["a", "bb"], 3)', 'expected': []},
                            ],
                            'solution_code': "def filter_and_upper_words(words, min_len):\n    return [w.upper() for w in words if len(w) >= min_len]\n",
                            'explanation': 'リスト内包表記で len(w) >= min_len の条件を満たす単語を w.upper() で大文字化して集めます。'
                        }
                    }
                ]
            },
            {
                'order': 5,
                'title': '第5章: 実用標準ライブラリの徹底活用',
                'subtitle': 'datetime, math, re, collections, itertools',
                'icon': 'puzzle-piece',
                'category': 'library',
                'target_level': 3,
                'summary': '実務開発に直結する日付操作(datetime)、正規表現(re)、要素集計(collections.Counter)、組み合わせ(itertools)を学びます。',
                'lessons': [
                    {
                        'order': 1,
                        'title': '5.1 datetime と re による実務データ処理',
                        'reading_time_minutes': 5,
                        'content_html': "<p>日時計算や文字列からの情報抽出は、実務で最も頻繁に遭遇するタスクです。</p>",
                        'key_takeaways': ['datetime.date と timedelta による日付演算', 're.findall や re.sub による正規表現抽出・置換'],
                        'example_code': "import re\ntext = 'ID: A123, B456'\nprint(re.findall(r'[A-Z][0-9]{3}', text))",
                        'exercise': {
                            'title': '郵便番号の抽出とハイフン統一',
                            'description': '<p><code>re</code> モジュールを用いて、文章 <code>text</code> から日本の7桁郵便番号（<code>123-4567</code> または <code>1234567</code>）をすべて抽出し、すべて <code>"XXX-XXXX"</code> 形式に正規化したリストを返す関数 <code>extract_and_format_zipcodes(text)</code> を実装してください。</p>',
                            'template': "import re\n\ndef extract_and_format_zipcodes(text):\n    # ここにコードを書いてください\n    pass\n",
                            'test_cases': [
                                {'input': 'extract_and_format_zipcodes("〒100-0001 東京都、〒1500042 渋谷区")', 'expected': ["100-0001", "150-0042"]},
                                {'input': 'extract_and_format_zipcodes("郵便番号なし")', 'expected': []},
                            ],
                            'solution_code': "import re\n\ndef extract_and_format_zipcodes(text):\n    matches = re.findall(r'(\\d{3})-?(\\d{4})', text)\n    return [f\"{m[0]}-{m[1]}\" for m in matches]\n",
                            'explanation': '(\\d{3})-?(\\d{4}) で3桁と4桁をグループキャプチャし、f"{m[0]}-{m[1]}" でハイフン付きに成形します。'
                        }
                    }
                ]
            },
            {
                'order': 6,
                'title': '第6章: データ可視化とグラフ描画 (Matplotlib)',
                'subtitle': '折れ線・棒グラフ・散布図・円グラフ',
                'icon': 'chart-bar',
                'category': 'plot',
                'target_level': 3,
                'summary': 'データを視覚的に伝えるグラフ描画スキル。matplotlib.pyplot を使った各種グラフの作成とスタイリングを習得します。',
                'lessons': [
                    {
                        'order': 1,
                        'title': '6.1 基本的なグラフ描画のフロー',
                        'reading_time_minutes': 4,
                        'content_html': "<p>plt.plot(折れ線), plt.bar(棒グラフ), plt.scatter(散布図), plt.pie(円グラフ) の基本構文を理解します。</p>",
                        'key_takeaways': ['import matplotlib.pyplot as plt でインポート', 'plt.title(), plt.xlabel(), plt.ylabel() でラベル付け', 'plt.show() で描画完了'],
                        'example_code': "import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [10, 20, 15])\nplt.title('Sample')\nplt.show()",
                        'exercise': {
                            'title': '売上個数の棒グラフ作成',
                            'description': '<p><code>plt.bar()</code> を用いて、果物 <code>fruits = ["りんご", "みかん", "バナナ"]</code> と 売上個数 <code>counts = [80, 120, 60]</code> の棒グラフを描画し、タイトルを <code>"果物売上"</code> として <code>plt.show()</code> してください。</p>',
                            'template': "import matplotlib.pyplot as plt\n\nfruits = [\"りんご\", \"みかん\", \"バナナ\"]\ncounts = [80, 120, 60]\n\n# ここに棒グラフを描画するコードを書いてください\n\n",
                            'test_cases': [
                                {'check': 'type', 'expected': 'bar', 'input_label': "グラフ種別が 'bar' (棒グラフ)"},
                                {'check': 'title', 'expected': '果物売上', 'input_label': "タイトルが '果物売上'"},
                                {'check': 'labels', 'expected': ['りんご', 'みかん', 'バナナ'], 'input_label': "ラベルが果物一覧"},
                                {'check': 'first_dataset_data', 'expected': [80, 120, 60], 'input_label': "データ配列が [80, 120, 60]"}
                            ],
                            'solution_code': "import matplotlib.pyplot as plt\n\nfruits = [\"りんご\", \"みかん\", \"バナナ\"]\ncounts = [80, 120, 60]\n\nplt.bar(fruits, counts)\nplt.title(\"果物売上\")\nplt.show()\n",
                            'explanation': 'plt.bar(fruits, counts) でカテゴリ棒グラフを生成し、plt.title("果物売上") を付与して show() します。'
                        }
                    }
                ]
            },
            {
                'order': 7,
                'title': '第7章: オブジェクト指向とクラス設計',
                'subtitle': 'クラス定義・カプセル化・特殊メソッド',
                'icon': 'cube',
                'category': 'algorithm',
                'target_level': 4,
                'summary': 'classによるデータと振る舞いのカプセル化、__init__コンストラクタ、プロパティデコレータ(@property)、継承を学びます。',
                'lessons': [
                    {
                        'order': 1,
                        'title': '7.1 クラスの基本とインスタンス化',
                        'reading_time_minutes': 5,
                        'content_html': "<p>クラスを使うことで、状態（属性）と振る舞い（メソッド）を1つの型として定義できます。</p>",
                        'key_takeaways': ['__init__(self, ...) で初期化', 'self はインスタンス自身を参照'],
                        'example_code': "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f'{self.name} says Woof!'",
                        'exercise': {
                            'title': '銀行口座クラスの設計',
                            'description': '<p>初期残高 <code>balance</code> を保持し、預金 <code>deposit(amount)</code> と 引出 <code>withdraw(amount)</code> (残高不足時は False、成功時は True を返す)、残高照会 <code>get_balance()</code> を備えた <code>BankAccount</code> クラスを実装してください。</p>',
                            'template': "class BankAccount:\n    def __init__(self, initial_balance=0):\n        # ここにコードを書いてください\n        pass\n",
                            'setup_code': "def test_bank():\n    acc = BankAccount(100)\n    acc.deposit(50)\n    w1 = acc.withdraw(30)\n    w2 = acc.withdraw(200)\n    return (acc.get_balance(), w1, w2)",
                            'test_cases': [
                                {'input': 'test_bank()', 'expected': '(120, True, False)'}
                            ],
                            'solution_code': "class BankAccount:\n    def __init__(self, initial_balance=0):\n        self.balance = initial_balance\n    def deposit(self, amount):\n        self.balance += amount\n    def withdraw(self, amount):\n        if self.balance >= amount:\n            self.balance -= amount\n            return True\n        return False\n    def get_balance(self):\n        return self.balance\n",
                            'explanation': '初期残高を self.balance に保持し、各メソッドで加減算と条件チェックを行います。'
                        }
                    }
                ]
            },
            {
                'order': 8,
                'title': '第8章: 実践アルゴリズムと効率化',
                'subtitle': '二分探索・再帰・デコレータ・計算量最適化',
                'icon': 'lightning',
                'category': 'algorithm',
                'target_level': 4,
                'summary': '本格的なアルゴリズム設計、再帰関数、メモ化(キャッシュ)、そして計算量(O記法)を意識したプロフェッショナルなコーディングを学びます。',
                'lessons': [
                    {
                        'order': 1,
                        'title': '8.1 二分探索 (Binary Search) の実装',
                        'reading_time_minutes': 5,
                        'content_html': "<p>ソート済みリストから O(log N) の高速さで目的の値を探索する二分探索を学びます。</p>",
                        'key_takeaways': ['中央値 (mid) とターゲットを比較', '探索範囲を毎ステップ半分に絞り込む'],
                        'example_code': "# 二分探索の基本構造\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
                        'exercise': {
                            'title': '二分探索関数の完成',
                            'description': '<p>昇順ソート済みリスト <code>sorted_list</code> と 検索値 <code>target</code> を受け取り、存在すればそのインデックス（0始まり）、存在しなければ <code>-1</code> を返す関数 <code>binary_search(sorted_list, target)</code> を実装してください。</p>',
                            'template': "def binary_search(sorted_list, target):\n    # ここにコードを書いてください\n    pass\n",
                            'test_cases': [
                                {'input': 'binary_search([1, 3, 5, 7, 9, 11], 7)', 'expected': 3},
                                {'input': 'binary_search([10, 20, 30, 40], 10)', 'expected': 0},
                                {'input': 'binary_search([2, 4, 6, 8], 5)', 'expected': -1},
                            ],
                            'solution_code': "def binary_search(sorted_list, target):\n    left, right = 0, len(sorted_list) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_list[mid] == target:\n            return mid\n        elif sorted_list[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n",
                            'explanation': 'leftとrightのポインタを中央値との大小関係に応じて更新し、高速に対象インデックスを見つけます。'
                        }
                    }
                ]
            }
        ]

        total_lessons_count = 0
        for ch_data in chapters_data:
            lessons_data = ch_data.pop('lessons', [])
            chapter = Chapter.objects.create(**ch_data)
            for l_data in lessons_data:
                exercise_data = l_data.pop('exercise', None)
                lesson = Lesson.objects.create(chapter=chapter, **l_data)
                total_lessons_count += 1
                if exercise_data:
                    LessonExercise.objects.create(lesson=lesson, **exercise_data)

        self.stdout.write(self.style.SUCCESS(f"教科書カリキュラム: 全{len(chapters_data)}章 (レッスン{total_lessons_count}件) を投入しました。"))
        self.stdout.write(self.style.SUCCESS("マスターデータ初期化がすべて正常に完了しました！"))
