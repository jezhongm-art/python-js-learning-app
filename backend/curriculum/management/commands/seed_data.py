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
        # 2. 教科書カリキュラムマスター (全10章・35レッスン)
        # ----------------------------------------------------
        Chapter.objects.all().delete()

        json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../js/textbook_data.json"))
        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                chapters_data = json.load(f)
        else:
            chapters_data = []

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
