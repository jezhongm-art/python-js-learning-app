/**
 * Python 実用ライブラリ学習編 マスターデータ (第11章〜第17章・全20単元)
 * - 第11章: NumPy (数値計算・多次元配列)
 * - 第12章: pandas (データ分析・集計・加工)
 * - 第13章: Matplotlib (データ可視化・グラフ作成)
 * - 第14章: requests (Web API連携・HTTP通信)
 * - 第15章: BeautifulSoup4 (HTML解析・Webスクレイピング)
 * - 第16章: scikit-learn (機械学習入門・モデル構築)
 * - 第17章: 実践横断プロジェクト (ライブラリ連携総合演習)
 *
 * 各単元に runtime_env ('browser' | 'browser_limited' | 'backend_only') を定義
 */

const practicalLibraryChapters = [
  // =========================================================================
  // 第11章: NumPy (数値計算と多次元配列)
  // =========================================================================
  {
    id: 11,
    order: 11,
    title: "第11章: NumPy (数値計算と多次元配列)",
    subtitle: "ndarray・ベクトル化演算・データ集計・ブロードキャスト",
    icon: "calculator",
    category: "library",
    category_group: "library",
    target_level: 2,
    summary: "データサイエンスや機械学習の基盤となる高速数値計算ライブラリNumPy。Python標準リストとの決定的違い、ndarrayの構造、ループなしで一括計算するベクトル化演算をマスターします。",
    lessons: [
      {
        id: 501,
        chapter_id: 11,
        chapter_order: 11,
        chapter_title: "NumPy (数値計算と多次元配列)",
        order: 1,
        title: "11.1 NumPyとは何か & ndarrayの基本構造",
        reading_time_minutes: 6,
        runtime_env: "browser",
        runtime_note: "ブラウザ上でNumPyの配列構造と高速化ロジック（多次元配列・要素型）の等価処理を学習できます。",
        content_html: `
          <h3>なぜPython標準リストではなくNumPyを使うのか？</h3>
          <p>Pythonの標準 <code>list</code> は異なる型を混在できる柔軟性がありますが、要素ごとにオブジェクトのポインタを持つため、大量の数値データを処理する際にメモリ消費が大きく、動作も低速です。</p>
          <p><strong>NumPy (Numerical Python)</strong> は、すべての要素が同一の型（多くは整数や浮動小数点数）で連続したメモリ領域に配置される <strong>ndarray (N-dimensional array: 多次元配列)</strong> を提供します。C言語並みの超高速な数値計算が可能になります。</p>

          <h4>主な配列作成関数</h4>
          <pre><code class="language-python">import numpy as np

# Pythonリストから作成
a = np.array([1, 2, 3, 4, 5])

# 0で満たされた配列 (shape: 2行3列)
zeros = np.zeros((2, 3))

# 1で満たされた配列
ones = np.ones((3, 3))

# 連番配列 (開始, 終了(未満), ステップ)
seq = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]

# 等間隔配列 (開始, 終了(含む), 分割数)
lin = np.linspace(0, 1, 5)  # [0.0, 0.25, 0.5, 0.75, 1.0]</code></pre>

          <h4>ndarrayの重要属性</h4>
          <ul>
            <li><code>.shape</code>: 配列の形状を表すタプル（例: <code>(2, 3)</code> は2行3列）</li>
            <li><code>.ndim</code>: 配列の次元数（1次元, 2次元など）</li>
            <li><code>.size</code>: 配列に含まれる全要素数</li>
            <li><code>.dtype</code>: 要素のデータ型（<code>int64</code>, <code>float64</code> など）</li>
          </ul>

          <div class="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-lg text-xs mt-3">
            <strong>環境メモ:</strong> 通常のPython環境では <code>pip install numpy</code> でインストールして使用します。本プラットフォームでは、NumPyの設計思想とデータ処理の核心ロジックを直感的に学べるように設計されています。
          </div>
        `,
        key_takeaways: [
          "NumPyの核は連続メモリ配置による高速な多次元配列 ndarray",
          "Pythonの標準リストと違い、全要素が同一のデータ型 (dtype) を持つ",
          "np.zeros, np.ones, np.arange, np.linspace で柔軟に初期配列を生成可能",
          "shape (形状), ndim (次元), size (要素数), dtype (型) で配列構造を把握する"
        ],
        example_code: "# 配列の作成と属性の確認（Python等価シミュレーション）\ndef create_matrix_info(rows, cols, fill_value=0):\n    matrix = [[fill_value for _ in range(cols)] for _ in range(rows)]\n    shape = (rows, cols)\n    size = rows * cols\n    return {'matrix': matrix, 'shape': shape, 'size': size}\n\ninfo = create_matrix_info(2, 3, 1)\nprint('生成結果:', info['matrix'])\nprint('形状(shape):', info['shape'])\nprint('要素数(size):', info['size'])",
        exercise: {
          id: 501,
          title: "2次元配列情報の抽出関数",
          description: "<p>2次元リスト（行×列の数値データ）<code>matrix</code> を受け取り、行数と列数をタプル <code>(行数, 列数)</code> で返し、かつ総要素数を計算して <code>{'shape': (行数, 列数), 'size': 総要素数}</code> という辞書を返す関数 <code>get_array_info(matrix)</code> を実装してください。</p>",
          template: "def get_array_info(matrix):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "get_array_info([[1, 2, 3], [4, 5, 6]])", expected: { shape: [2, 3], size: 6 } },
            { input: "get_array_info([[10], [20], [30], [40]])", expected: { shape: [4, 1], size: 4 } },
            { input: "get_array_info([[1, 2], [3, 4], [5, 6]])", expected: { shape: [3, 2], size: 6 } },
          ],
          solution_code: "def get_array_info(matrix):\n    rows = len(matrix)\n    cols = len(matrix[0]) if rows > 0 else 0\n    return {\n        'shape': [rows, cols],\n        'size': rows * cols\n    }\n",
          explanation: "len(matrix) で行数を、len(matrix[0]) で列数を取得し、総要素数は行数×列数で算出します。",
        },
      },
      {
        id: 502,
        chapter_id: 11,
        chapter_order: 11,
        chapter_title: "NumPy (数値計算と多次元配列)",
        order: 2,
        title: "11.2 ベクトル化演算と要素ごとの計算 (Element-wise)",
        reading_time_minutes: 6,
        runtime_env: "browser",
        runtime_note: "ループを書かずに配列全体を一括処理するベクトル化演算の考え方を学習・演習できます。",
        content_html: `
          <h3>forループを追放する「ベクトル化演算」</h3>
          <p>標準Pythonでリストの全要素に2を掛ける場合、<code>[x * 2 for x in data]</code> のようにループを回す必要があります。しかしNumPyでは、配列に対して直接演算子を適用するだけで、<strong>全要素に対して一括（要素ごと: element-wise）に計算</strong>が行われます。</p>

          <pre><code class="language-python">import numpy as np

# スカラーとの演算
prices = np.array([100, 250, 400])
tax_included = prices * 1.1  # 全要素に 1.1 が掛けられる！
print(tax_included)  # [110. 275. 440.]

# 配列同士の演算（同じサイズ）
units_sold = np.array([5, 2, 3])
sales = prices * units_sold  # 各要素同士の積
print(sales)  # [500, 500, 1200]

# 条件抽出 (Boolean Indexing)
temperatures = np.array([28.5, 32.1, 29.8, 35.0, 31.2])
hot_mask = temperatures >= 30.0  # [False, True, False, True, True]
hot_days = temperatures[hot_mask] # 30度以上のデータだけ抽出
print('真夏日:', hot_days)  # [32.1, 35.0, 31.2]</code></pre>
        `,
        key_takeaways: [
          "ベクトル化演算により、forループを書かずに配列全体へ演算を適用できる",
          "スカラーとの計算（配列 * 2）や配列同士の演算（a + b）が直感的に記述可能",
          "Boolean Indexing（条件式でマスクを作成）により、高速なデータ抽出ができる"
        ],
        example_code: "# ベクトル化演算の思想をシミュレート\nprices = [1000, 1500, 2000]\ndiscount_rate = 0.8  # 20%引き\n\n# 内包表記で高速処理\nsale_prices = [int(p * discount_rate) for p in prices]\nprint('セール価格一覧:', sale_prices)",
        exercise: {
          id: 502,
          title: "真夏日のデータ抽出と集計",
          description: "<p>日々の最高気温リスト <code>temps</code> と基準値 <code>threshold</code> を受け取り、基準値以上の気温のみを抽出したリストと、その平均気温を <code>{'hot_temps': [...], 'average': 平均値}</code> で返す関数 <code>filter_hot_days(temps, threshold)</code> を実装してください。（※該当する日が1つもない場合は <code>{'hot_temps': [], 'average': 0.0}</code> を返してください。平均値は小数第1位まで四捨五入してください: <code>round(avg, 1)</code>）</p>",
          template: "def filter_hot_days(temps, threshold):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "filter_hot_days([28.5, 32.0, 29.0, 35.5, 31.0], 30.0)", expected: { hot_temps: [32.0, 35.5, 31.0], average: 32.8 } },
            { input: "filter_hot_days([22.0, 24.5, 23.0], 25.0)", expected: { hot_temps: [], average: 0.0 } },
            { input: "filter_hot_days([30.0, 30.0], 30.0)", expected: { hot_temps: [30.0, 30.0], average: 30.0 } },
          ],
          solution_code: "def filter_hot_days(temps, threshold):\n    hot = [t for t in temps if t >= threshold]\n    if not hot:\n        return {'hot_temps': [], 'average': 0.0}\n    avg = round(sum(hot) / len(hot), 1)\n    return {'hot_temps': hot, 'average': avg}\n",
          explanation: "リスト内包表記で条件合致データを抽出し、sum/len で平均値を計算します。",
        },
      },
      {
        id: 503,
        chapter_id: 11,
        chapter_order: 11,
        chapter_title: "NumPy (数値計算と多次元配列)",
        order: 3,
        title: "11.3 基本統計量の集計と形状変換 (Reshape)",
        reading_time_minutes: 6,
        runtime_env: "browser",
        runtime_note: "データの集計（合計、平均、最大、最小）と多次元データの形状変換ロジックを学習します。",
        content_html: `
          <h3>集計関数と軸 (axis) の概念</h3>
          <p>NumPyでは、多次元配列に対して全体集計を行うだけでなく、<code>axis</code> パラメータを指定して「行ごと」「列ごと」の集計を自在に行えます。</p>

          <pre><code class="language-python">import numpy as np

# 3行2列の成績データ [国語, 数学]
scores = np.array([
    [80, 90],  # 生徒A
    [70, 65],  # 生徒B
    [85, 95],  # 生徒C
])

print(scores.sum())          # 全体合計: 485
print(scores.mean(axis=0))   # 科目ごとの平均 (列方向): [78.33, 83.33]
print(scores.max(axis=1))    # 生徒ごとの最高点 (行方向): [90, 70, 95]

# 形状変換 (reshape)
data = np.arange(12)         # [0, 1, ..., 11] (1次元・12要素)
matrix_3x4 = data.reshape(3, 4)  # 3行4列の2次元配列に変換！</code></pre>
        `,
        key_takeaways: [
          "sum, mean, max, min, std など多彩な高速集計関数が利用可能",
          "axis=0 は列方向（縦）、axis=1 は行方向（横）に沿った集計",
          "reshape() を使って総要素数を保ったまま次元・形状を変換できる"
        ],
        example_code: "# 2次元データの軸別集計シミュレーション\nmatrix = [\n    [10, 20, 30],\n    [40, 50, 60]\n]\n\n# 行ごとの合計 (横方向)\nrow_sums = [sum(row) for row in matrix]\nprint('各行の合計:', row_sums)  # [60, 150]\n\n# 列ごとの合計 (縦方向)\ncol_sums = [sum(matrix[r][c] for r in range(len(matrix))) for c in range(len(matrix[0]))]\nprint('各列の合計:', col_sums)  # [50, 70, 90]",
        exercise: {
          id: 503,
          title: "売上マトリクスの多角集計",
          description: "<p>各店舗の月別売上を表す2次元リスト <code>sales_matrix</code>（各行が店舗、各列が月）を受け取り、全店舗の総合計売上 <code>total</code>、各店舗ごとの合計売上リスト <code>store_totals</code>、各月ごとの合計売上リスト <code>monthly_totals</code> を辞書で返す関数 <code>analyze_sales(sales_matrix)</code> を実装してください。</p>",
          template: "def analyze_sales(sales_matrix):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "analyze_sales([[100, 200], [300, 400]])",
              expected: { total: 1000, store_totals: [300, 700], monthly_totals: [400, 600] }
            },
            {
              input: "analyze_sales([[50, 60, 70], [80, 90, 100]])",
              expected: { total: 450, store_totals: [180, 270], monthly_totals: [130, 150, 170] }
            },
          ],
          solution_code: "def analyze_sales(sales_matrix):\n    store_totals = [sum(row) for row in sales_matrix]\n    num_months = len(sales_matrix[0]) if sales_matrix else 0\n    monthly_totals = [sum(sales_matrix[r][c] for r in range(len(sales_matrix))) for c in range(num_months)]\n    total = sum(store_totals)\n    return {\n        'total': total,\n        'store_totals': store_totals,\n        'monthly_totals': monthly_totals\n    }\n",
          explanation: "行方向の合計（各店舗）と列方向の合計（各月）を内包表記で計算し、全体合計を算出します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第12章: pandas (データ分析と集計)
  // =========================================================================
  {
    id: 12,
    order: 12,
    title: "第12章: pandas (データ分析と集計)",
    subtitle: "Series・DataFrame・groupby・欠損値処理・テーブル加工",
    icon: "table",
    category: "library",
    category_group: "library",
    target_level: 2,
    summary: "実務のデータ分析・CSV操作・ビジネスレポート作成で最も愛用されるライブラリpandas。表形式データ(DataFrame)の操作、グループ集計(groupby)、条件抽出を身につけます。",
    lessons: [
      {
        id: 504,
        chapter_id: 12,
        chapter_order: 12,
        chapter_title: "pandas (データ分析と集計)",
        order: 1,
        title: "12.1 SeriesとDataFrame: テーブルデータの構造",
        reading_time_minutes: 6,
        runtime_env: "browser_limited",
        runtime_note: "ブラウザ上でテーブルデータ（レコード辞書形式）の構造理解と列・行アクセスロジックを学習します。",
        content_html: `
          <h3>pandasの2大データ構造</h3>
          <p>pandasには2つの中心的なデータ構造があります：</p>
          <ol>
            <li><strong>Series (シリーズ)</strong>: ラベル（インデックス）付きの1次元データ配列。表の「1本の列」に相当。</li>
            <li><strong>DataFrame (データフレーム)</strong>: 行と列で構成される2次元テーブル構造。ExcelシートやSQLテーブルと同一の感覚で扱えます。</li>
          </ol>

          <pre><code class="language-python">import pandas as pd

# 辞書からDataFrameを作成
data = {
    '商品名': ['りんご', 'バナナ', 'オレンジ'],
    '価格': [120, 80, 100],
    '在庫': [15, 30, 8]
}
df = pd.DataFrame(data)

# 列の選択
prices = df['価格']  # Seriesが返る

# 行の選択
first_row = df.iloc[0]  # インデックス番号(0番目)で指定
row_by_label = df.loc[0]  # 行ラベルで指定</code></pre>

          <div class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-xs mt-3">
            <strong>実務の鉄則:</strong> CSVファイルを読み込む場合は <code>df = pd.read_csv('sales.csv', encoding='utf-8')</code> の1行で即座にDataFrame化できます。
          </div>
        `,
        key_takeaways: [
          "Seriesは「1列分のデータ」、DataFrameは「複数の列が並んだ2次元の表」",
          "df['列名'] で列を取り出すとSeriesが得られる",
          ".iloc[行番号] で位置指定、.loc[ラベル] で名前指定して行を取り出す"
        ],
        example_code: "# DataFrame相当のテーブル構造シミュレーション\nrecords = [\n    {'name': 'ノートPC', 'price': 85000, 'stock': 5},\n    {'name': 'マウス', 'price': 3000, 'stock': 20},\n    {'name': 'キーボード', 'price': 7000, 'stock': 12}\n]\n\n# 列の抽出\nnames = [r['name'] for r in records]\nprices = [r['price'] for r in records]\nprint('商品名一覧:', names)\nprint('平均価格:', sum(prices) / len(prices))",
        exercise: {
          id: 504,
          title: "テーブルデータからの列抽出と統計",
          description: "<p>テーブルデータ（各行が辞書のリスト）<code>records</code> と、抽出したい数値列の名前 <code>col_name</code> を受け取り、その列の平均値 <code>average</code>（小数第1位まで四捨五入）と最大値 <code>max_val</code> を <code>{'average': 平均値, 'max_val': 最大値}</code> で返す関数 <code>summarize_column(records, col_name)</code> を実装してください。</p>",
          template: "def summarize_column(records, col_name):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "summarize_column([{'name': 'A', 'score': 80}, {'name': 'B', 'score': 90}, {'name': 'C', 'score': 70}], 'score')",
              expected: { average: 80.0, max_val: 90 }
            },
            {
              input: "summarize_column([{'id': 1, 'price': 120}, {'id': 2, 'price': 250}, {'id': 3, 'price': 150}], 'price')",
              expected: { average: 173.3, max_val: 250 }
            },
          ],
          solution_code: "def summarize_column(records, col_name):\n    vals = [r[col_name] for r in records if col_name in r]\n    if not vals:\n        return {'average': 0.0, 'max_val': 0}\n    avg = round(sum(vals) / len(vals), 1)\n    return {'average': avg, 'max_val': max(vals)}\n",
          explanation: "各レコードから指定列の値を取り出し、sum/len で平均を、max() で最大値を求めます。",
        },
      },
      {
        id: 505,
        chapter_id: 12,
        chapter_order: 12,
        chapter_title: "pandas (データ分析と集計)",
        order: 2,
        title: "12.2 条件抽出・並べ替え (sort_values)・欠損値処理",
        reading_time_minutes: 6,
        runtime_env: "browser_limited",
        runtime_note: "データのフィルタリング、ランキング作成、欠損値（None/NaN）の除外ロジックを学習します。",
        content_html: `
          <h3>実務で最も頻出する前処理の3手</h3>
          <p>生データは整っていません。不要なデータを除外し、整列させ、欠損値を手当てする技術が不可欠です。</p>

          <pre><code class="language-python">import pandas as pd

# 1. 複数条件でのフィルタリング (論理演算子: & と | を使用)
# 価格が100円以上 かつ 在庫が10個以上
filtered = df[(df['価格'] >= 100) & (df['在庫'] >= 10)]

# 2. 並べ替え (sort_values)
# 売上金額の大きい順 (降順: ascending=False)
ranked = df.sort_values(by='売上', ascending=False)

# 3. 欠損値 (NaN) の処理
df.isna().sum()          # 各列の欠損値の個数を確認
cleaned = df.dropna()    # 欠損値のある行を丸ごと削除
filled = df.fillna(0)    # 欠損値を0で安全に埋める</code></pre>
        `,
        key_takeaways: [
          "条件抽出は df[(条件A) & (条件B)] のように丸括弧とビット演算子を使う",
          "sort_values(by='列名', ascending=False) でランキング並べ替え",
          "欠損値は dropna() で除外するか、fillna(値) で補完する"
        ],
        example_code: "# 条件抽出とソートのシミュレーション\nproducts = [\n    {'name': 'りんご', 'price': 120, 'stock': 0},\n    {'name': 'バナナ', 'price': 90, 'stock': 15},\n    {'name': 'メロン', 'price': 1500, 'stock': 3},\n    {'name': 'オレンジ', 'price': 100, 'stock': 20}\n]\n\n# 在庫あり(stock > 0)を抽出して価格が高い順にソート\navailable = [p for p in products if p['stock'] > 0]\navailable.sort(key=lambda x: x['price'], reverse=True)\nprint('販売中ランキング:', [p['name'] for p in available])",
        exercise: {
          id: 505,
          title: "在庫あり商品の価格ランキング抽出",
          description: "<p>商品辞書のリスト <code>items</code>（各要素は <code>{'name': str, 'price': int, 'stock': int}</code>）を受け取り、在庫が1個以上（<code>stock > 0</code>）の商品のみを抽出し、価格の降順（高い順）で並べ替えて商品名 <code>name</code> のリストを返す関数 <code>get_top_stocked_products(items)</code> を実装してください。</p>",
          template: "def get_top_stocked_products(items):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "get_top_stocked_products([{'name': 'A', 'price': 100, 'stock': 5}, {'name': 'B', 'price': 300, 'stock': 0}, {'name': 'C', 'price': 200, 'stock': 2}])",
              expected: ["C", "A"]
            },
            {
              input: "get_top_stocked_products([{'name': 'X', 'price': 50, 'stock': 10}, {'name': 'Y', 'price': 500, 'stock': 1}])",
              expected: ["Y", "X"]
            },
          ],
          solution_code: "def get_top_stocked_products(items):\n    valid = [item for item in items if item.get('stock', 0) > 0]\n    valid.sort(key=lambda x: x['price'], reverse=True)\n    return [item['name'] for item in valid]\n",
          explanation: "stock > 0 で抽出し、sort(key=..., reverse=True) で価格降順に整列して商品名を返します。",
        },
      },
      {
        id: 506,
        chapter_id: 12,
        chapter_order: 12,
        chapter_title: "pandas (データ分析と集計)",
        order: 3,
        title: "12.3 グループ化集計 (groupby) とカテゴリ分析",
        reading_time_minutes: 6,
        runtime_env: "browser_limited",
        runtime_note: "SQLのGROUP BYに匹敵する、カテゴリごとの売上・平均などの集約分析を学習します。",
        content_html: `
          <h3>データ集約の王様: groupby</h3>
          <p>「部門別の売上合計は？」「月ごとの平均顧客数は？」といったビジネスの問いに答えるのが <code>groupby()</code> です。</p>

          <pre><code class="language-python">import pandas as pd

# 売上明細データ
# df: [カテゴリ, 商品名, 売上金額]
summary = df.groupby('カテゴリ')['売上金額'].agg(['sum', 'mean', 'count'])
print(summary)
#               sum   mean  count
# カテゴリ
# 家電        350000  70000      5
# 食品         42000   1400     30</code></pre>
        `,
        key_takeaways: [
          "df.groupby('カテゴリ列')['集計対象列'].sum() でグループ集計",
          ".agg(['sum', 'mean', 'count']) で複数の統計量を同時に算出できる",
          "ビジネスレポートやKPI分析の核となる操作"
        ],
        example_code: "# groupby の集計ロジックシミュレーション\nsales = [\n    {'category': '食品', 'amount': 500},\n    {'category': '家電', 'amount': 12000},\n    {'category': '食品', 'amount': 800},\n    {'category': '家電', 'amount': 3000}\n]\n\nresult = {}\nfor s in sales:\n    cat = s['category']\n    result[cat] = result.get(cat, 0) + s['amount']\n\nprint('カテゴリ別売上合計:', result)",
        exercise: {
          id: 506,
          title: "カテゴリ別売上と件数の集計",
          description: "<p>売上レコードのリスト <code>sales_data</code>（各要素は <code>{'category': str, 'amount': int}</code>）を受け取り、カテゴリごとの売上合計 <code>total</code> と件数 <code>count</code> を <code>{カテゴリ名: {'total': 合計, 'count': 件数}}</code> の辞書で返す関数 <code>aggregate_by_category(sales_data)</code> を実装してください。</p>",
          template: "def aggregate_by_category(sales_data):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "aggregate_by_category([{'category': '果物', 'amount': 150}, {'category': '野菜', 'amount': 100}, {'category': '果物', 'amount': 200}])",
              expected: { "果物": { total: 350, count: 2 }, "野菜": { total: 100, count: 1 } }
            },
            {
              input: "aggregate_by_category([{'category': '本', 'amount': 1200}, {'category': '本', 'amount': 800}])",
              expected: { "本": { total: 2000, count: 2 } }
            },
          ],
          solution_code: "def aggregate_by_category(sales_data):\n    res = {}\n    for item in sales_data:\n        cat = item['category']\n        amt = item['amount']\n        if cat not in res:\n            res[cat] = {'total': 0, 'count': 0}\n        res[cat]['total'] += amt\n        res[cat]['count'] += 1\n    return res\n",
          explanation: "カテゴリをキーとする辞書で合計金額と出現件数を積算して返します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第13章: Matplotlib (データの可視化)
  // =========================================================================
  {
    id: 13,
    order: 13,
    title: "第13章: Matplotlib (データの可視化)",
    subtitle: "折れ線グラフ・棒グラフ・散布図・データ分析結果の描画",
    icon: "chart-bar",
    category: "library",
    category_group: "library",
    target_level: 2,
    summary: "数値やテーブルだけでは分からないデータの傾向や相関を可視化するMatplotlib。折れ線グラフ、棒グラフ、散布図の作成からタイトルの設定、装飾までをブラウザ上で実際に描画しながら習得します。",
    lessons: [
      {
        id: 507,
        chapter_id: 13,
        chapter_order: 13,
        chapter_title: "Matplotlib (データの可視化)",
        order: 1,
        title: "13.1 plt.plot() による折れ線グラフとスタイル設定",
        reading_time_minutes: 5,
        runtime_env: "browser",
        runtime_note: "本アプリ内蔵のChart.js連携MockPyplotにより、ブラウザ上で実際に動的なグラフが描画・表示されます！",
        content_html: `
          <h3>データの推移を一目で伝える折れ線グラフ</h3>
          <p>時系列データ（売上の推移、気温の変化など）の表現には <code>plt.plot()</code> を使います。</p>

          <pre><code class="language-python">import matplotlib.pyplot as plt

# データ準備
months = ["4月", "5月", "6月", "7月", "8月"]
sales = [120, 150, 140, 190, 230]

# グラフ描画
plt.plot(months, sales, label="売上推移")
plt.title("月別売上実績 (千円)")
plt.xlabel("月")
plt.ylabel("売上金額")
plt.grid(True)
plt.show()</code></pre>
        `,
        key_takeaways: [
          "plt.plot(x, y) で折れ線グラフを描画",
          "plt.title(), plt.xlabel(), plt.ylabel() でグラフの意図を明確にする",
          "plt.grid(True) で目盛り線を表示して数値を読み取りやすくする"
        ],
        example_code: "# ブラウザ上で即座に実行可能なグラフ描画コード\nimport matplotlib.pyplot as plt\n\ndays = ['月', '火', '水', '木', '金']\nsteps = [6500, 8200, 7100, 9500, 11000]\n\nplt.plot(days, steps, label='歩数')\nplt.title('平日歩数ログ')\nplt.xlabel('曜日')\nplt.ylabel('歩数 (steps)')\nplt.grid(True)\nplt.show()",
        exercise: {
          id: 507,
          title: "気温推移グラフの描画設定関数",
          description: "<p>日付ラベル <code>dates</code> と 気温データ <code>temps</code> を受け取り、折れ線グラフを描画する関数 <code>draw_temp_chart(dates, temps)</code> を実装してください。グラフのタイトルを <code>'週間気温推移'</code>、X軸ラベルを <code>'日付'</code>、Y軸ラベルを <code>'気温 (℃)'</code>、グリッドを有効（<code>True</code>）に設定し、最後に <code>plt.show()</code> を呼び出してください。</p>",
          template: "import matplotlib.pyplot as plt\n\ndef draw_temp_chart(dates, temps):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "draw_temp_chart(['1日', '2日', '3日'], [20, 22, 21])", expected: true },
          ],
          solution_code: "import matplotlib.pyplot as plt\n\ndef draw_temp_chart(dates, temps):\n    plt.plot(dates, temps, label='気温')\n    plt.title('週間気温推移')\n    plt.xlabel('日付')\n    plt.ylabel('気温 (℃)')\n    plt.grid(True)\n    plt.show()\n    return True\n",
          explanation: "plt.plot、title、xlabel、ylabel、grid(True) を順に呼び出して設定します。",
        },
      },
      {
        id: 508,
        chapter_id: 13,
        chapter_order: 13,
        chapter_title: "Matplotlib (データの可視化)",
        order: 2,
        title: "13.2 棒グラフ (plt.bar) とカテゴリ比較の可視化",
        reading_time_minutes: 5,
        runtime_env: "browser",
        runtime_note: "カテゴリごとの比較に最適な棒グラフをブラウザ上で実行・描画できます。",
        content_html: `
          <h3>大小関係を直感的に比較する棒グラフ</h3>
          <p>部署別売上や商品別満足度など、離散的なカテゴリごとの数値を比較するには <code>plt.bar()</code> を使用します。</p>

          <pre><code class="language-python">import matplotlib.pyplot as plt

categories = ["営業1課", "営業2課", "営業3課", "開発部"]
achieve_rates = [105, 92, 118, 100]

plt.bar(categories, achieve_rates)
plt.title("目標達成率比較 (%)")
plt.xlabel("部署名")
plt.ylabel("達成率")
plt.show()</code></pre>
        `,
        key_takeaways: [
          "plt.bar(カテゴリ, 値) で縦棒グラフを作成",
          "カテゴリ間の大小関係やシェアの比較に最適",
          "色の変更や凡例追加も可能"
        ],
        example_code: "import matplotlib.pyplot as plt\n\nlangs = ['Python', 'JS', 'Java', 'C++']\npopularity = [90, 85, 70, 60]\n\nplt.bar(langs, popularity)\nplt.title('プログラミング言語人気度')\nplt.xlabel('言語')\nplt.ylabel('スコア')\nplt.show()",
        exercise: {
          id: 508,
          title: "部門別売上棒グラフの生成",
          description: "<p>部門名リスト <code>depts</code> と売上高リスト <code>revenues</code> を受け取り、棒グラフを描画する関数 <code>draw_bar_chart(depts, revenues)</code> を実装してください。タイトルを <code>'部門別売上実績'</code>、X軸を <code>'部門'</code>、Y軸を <code>'売上 (万円)'</code> に設定して <code>plt.show()</code> を呼び出してください。</p>",
          template: "import matplotlib.pyplot as plt\n\ndef draw_bar_chart(depts, revenues):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "draw_bar_chart(['東日本', '西日本'], [5000, 4200])", expected: true },
          ],
          solution_code: "import matplotlib.pyplot as plt\n\ndef draw_bar_chart(depts, revenues):\n    plt.bar(depts, revenues)\n    plt.title('部門別売上実績')\n    plt.xlabel('部門')\n    plt.ylabel('売上 (万円)')\n    plt.show()\n    return True\n",
          explanation: "plt.bar を呼び出し、各軸ラベルとタイトルを設定して show します。",
        },
      },
      {
        id: 509,
        chapter_id: 13,
        chapter_order: 13,
        chapter_title: "Matplotlib (データの可視化)",
        order: 3,
        title: "13.3 散布図 (plt.scatter) とデータ相関の発見",
        reading_time_minutes: 5,
        runtime_env: "browser",
        runtime_note: "2変数の相関関係をプロットする散布図の作成を学習します。",
        content_html: `
          <h3>2つの変数に関連性はあるか？</h3>
          <p>「気温が上がるとアイスの売上は伸びるか？」「広告費を増やすとアクセス数は増えるか？」といった2変数間の相関を視覚的に捉えるには <code>plt.scatter()</code> を使います。</p>

          <pre><code class="language-python">import matplotlib.pyplot as plt

study_hours = [1, 2, 3, 4, 5, 6, 7]
exam_scores = [55, 60, 65, 75, 80, 85, 95]

plt.scatter(study_hours, exam_scores)
plt.title("勉強時間とテスト点数の相関")
plt.xlabel("勉強時間 (時間)")
plt.ylabel("点数 (点)")
plt.grid(True)
plt.show()</code></pre>
        `,
        key_takeaways: [
          "plt.scatter(x, y) で点の分布をプロット",
          "右上がりの点は正の相関、右下がりは負の相関",
          "機械学習のデータ探索 (EDA) で不可欠な可視化手法"
        ],
        example_code: "import matplotlib.pyplot as plt\n\nx = [10, 15, 20, 25, 30]\ny = [100, 130, 210, 280, 350]\n\nplt.scatter(x, y)\nplt.title('気温と来客数相関')\nplt.xlabel('気温 (℃)')\nplt.ylabel('来客数 (人)')\nplt.grid(True)\nplt.show()",
        exercise: {
          id: 509,
          title: "相関散布図の作成",
          description: "<p>X軸データ <code>x_data</code> と Y軸データ <code>y_data</code> を受け取り、タイトル <code>'相関散布図'</code>、X軸ラベル <code>'X値'</code>、Y軸ラベル <code>'Y値'</code> で散布図を描画する関数 <code>draw_scatter_chart(x_data, y_data)</code> を実装してください。</p>",
          template: "import matplotlib.pyplot as plt\n\ndef draw_scatter_chart(x_data, y_data):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "draw_scatter_chart([1, 2, 3], [10, 20, 30])", expected: true },
          ],
          solution_code: "import matplotlib.pyplot as plt\n\ndef draw_scatter_chart(x_data, y_data):\n    plt.scatter(x_data, y_data)\n    plt.title('相関散布図')\n    plt.xlabel('X値')\n    plt.ylabel('Y値')\n    plt.show()\n    return True\n",
          explanation: "plt.scatter で散布図を作成し、各ラベルを設定して表示します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第14章: requests (Web API連携・HTTP通信)
  // =========================================================================
  {
    id: 14,
    order: 14,
    title: "第14章: requests (Web API連携・HTTP通信)",
    subtitle: "GETリクエスト・JSONデータ取得・APIエラー処理",
    icon: "globe",
    category: "library",
    category_group: "library",
    target_level: 3,
    summary: "Pythonで外部サービスやWeb APIからデータを取得するための定番ライブラリrequests。HTTP通信の仕組み、クエリパラメータの送信、JSONデータのパース、ステータスコードに応じたエラー処理を習得します。",
    lessons: [
      {
        id: 510,
        chapter_id: 14,
        chapter_order: 14,
        chapter_title: "requests (Web API連携・HTTP通信)",
        order: 1,
        title: "14.1 Web APIの仕組みと requests.get() の基本",
        reading_time_minutes: 6,
        runtime_env: "browser_limited",
        runtime_note: "ブラウザ環境のCORS制約を考慮し、APIレスポンス処理とステータス検証の核心ロジックを安全に学習します。",
        content_html: `
          <h3>PythonでWebから情報を引き出す requests</h3>
          <p>天気予報、株価、SNS、ChatGPT APIなど、現代のアプリケーション開発の多くは <strong>Web API (HTTP通信)</strong> を介して行われます。Pythonで最も直感的にHTTPリクエストを送れるライブラリが <code>requests</code> です。</p>

          <pre><code class="language-python">import requests

# GETリクエストの送信
response = requests.get('https://api.example.com/data')

# ステータスコードの確認 (200なら成功)
print('ステータス:', response.status_code)

# テキストとしてのレスポンス取得
print('本文:', response.text)</code></pre>

          <div class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-xs mt-3">
            <strong>ブラウザ実行とCORSの注意点:</strong> ブラウザ上で動作するJavaScript/Brythonから直接外部APIを呼ぶと「CORS制約」によりブロックされる場合があります。そのため実務ではサーバー側（Pythonバックエンド）でrequestsを実行します。
          </div>
        `,
        key_takeaways: [
          "requests.get(url) でWebサーバーからデータを取得する",
          "response.status_code で通信の成否 (200=成功, 404=未検出, 500=障害) を判定",
          "response.text で文字列、response.json() でPython辞書として取得可能"
        ],
        example_code: "# レスポンスオブジェクトの解析ロジック\ndef handle_http_response(status_code, body_text):\n    if status_code == 200:\n        return {'success': True, 'data': body_text}\n    elif status_code == 404:\n        return {'success': False, 'error': 'ページが見つかりません'}\n    else:\n        return {'success': False, 'error': f'HTTPエラー {status_code}'}\n\nres = handle_http_response(200, 'データ取得完了')\nprint(res)",
        exercise: {
          id: 510,
          title: "APIレスポンスのステータス判定関数",
          description: "<p>疑似レスポンス辞書 <code>res</code>（<code>{'status_code': int, 'text': str}</code>）を受け取り、ステータスコードが200なら <code>{'ok': True, 'content': res['text']}</code> を返し、200以外なら <code>{'ok': False, 'content': 'Error'}</code> を返す関数 <code>check_api_response(res)</code> を実装してください。</p>",
          template: "def check_api_response(res):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "check_api_response({'status_code': 200, 'text': 'Hello API'})", expected: { ok: true, content: "Hello API" } },
            { input: "check_api_response({'status_code': 404, 'text': 'Not Found'})", expected: { ok: false, content: "Error" } },
            { input: "check_api_response({'status_code': 500, 'text': 'Server Error'})", expected: { ok: false, content: "Error" } },
          ],
          solution_code: "def check_api_response(res):\n    if res.get('status_code') == 200:\n        return {'ok': True, 'content': res.get('text', '')}\n    return {'ok': False, 'content': 'Error'}\n",
          explanation: "status_code が 200 かどうかを判定して辞書を構築します。",
        },
      },
      {
        id: 511,
        chapter_id: 14,
        chapter_order: 14,
        chapter_title: "requests (Web API連携・HTTP通信)",
        order: 2,
        title: "14.2 クエリパラメータとJSONレスポンスの解析",
        reading_time_minutes: 6,
        runtime_env: "browser_limited",
        runtime_note: "Web APIで標準的に使われるJSONレスポンスの構造化抽出ロジックを学習します。",
        content_html: `
          <h3>params オプションと .json() メソッド</h3>
          <p>検索キーワードや対象都市などを指定してAPIを叩く場合、URLに手動で <code>?city=Tokyo</code> と連結するのではなく、<code>params</code> 辞書を渡すのがベストプラクティスです。URLエンコードも自動で行われます。</p>

          <pre><code class="language-python">import requests

params = {
    'q': 'Python',
    'sort': 'stars',
    'limit': 10
}

response = requests.get('https://api.github.com/search/repositories', params=params)

# JSON文字列を自動的にPythonの辞書/リストにデコード！
data = response.json()
print('総リポジトリ数:', data['total_count'])
for repo in data['items']:
    print(repo['name'], '★', repo['stargazers_count'])</code></pre>
        `,
        key_takeaways: [
          "params={'key': 'val'} で安全かつクリーンにURLパラメータを渡す",
          "response.json() を呼ぶだけで即座にPythonの辞書として操作可能",
          "ネストされた辞書やリストから必要なキーを取り出して加工する"
        ],
        example_code: "# ネストした天気JSONデータの抽出シミュレーション\nweather_payload = {\n    'city': 'Tokyo',\n    'forecast': [\n        {'day': 'today', 'weather': '晴れ', 'temp_max': 26},\n        {'day': 'tomorrow', 'weather': '曇り', 'temp_max': 23}\n    ]\n}\n\nprint('都市:', weather_payload['city'])\nfor f in weather_payload['forecast']:\n    print(f'{f[\"day\"]}: {f[\"weather\"]} (最高 {f[\"temp_max\"]}℃)')",
        exercise: {
          id: 511,
          title: "天気APIデータからの最高気温抽出",
          description: "<p>APIから取得したと想定される天気辞書 <code>api_data</code>（<code>{'city': str, 'forecasts': [{'date': str, 'high': int}, ...]}</code>）を受け取り、予報の中で最も高い最高気温 <code>max_temp</code> と、その日付 <code>hottest_date</code> を <code>{'max_temp': 最高気温, 'hottest_date': 日付}</code> で返す関数 <code>find_hottest_day(api_data)</code> を実装してください。</p>",
          template: "def find_hottest_day(api_data):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "find_hottest_day({'city': 'Tokyo', 'forecasts': [{'date': '2026-07-01', 'high': 28}, {'date': '2026-07-02', 'high': 33}, {'date': '2026-07-03', 'high': 30}]})",
              expected: { max_temp: 33, hottest_date: "2026-07-02" }
            },
            {
              input: "find_hottest_day({'city': 'Sapporo', 'forecasts': [{'date': '2026-01-10', 'high': -2}, {'date': '2026-01-11', 'high': 1}]})",
              expected: { max_temp: 1, hottest_date: "2026-01-11" }
            },
          ],
          solution_code: "def find_hottest_day(api_data):\n    forecasts = api_data.get('forecasts', [])\n    if not forecasts:\n        return {'max_temp': 0, 'hottest_date': ''}\n    hottest = max(forecasts, key=lambda x: x['high'])\n    return {'max_temp': hottest['high'], 'hottest_date': hottest['date']}\n",
          explanation: "max() に key=lambda x: x['high'] を渡して最高気温の辞書を特定します。",
        },
      },
      {
        id: 512,
        chapter_id: 14,
        chapter_order: 14,
        chapter_title: "requests (Web API連携・HTTP通信)",
        order: 3,
        title: "14.3 実務で必須のエラーハンドリング (status_code & 例外)",
        reading_time_minutes: 6,
        runtime_env: "browser_limited",
        runtime_note: "通信タイムアウトやHTTP障害に耐える堅牢なAPI通信コードの書き方を学びます。",
        content_html: `
          <h3>通信は必ず失敗する: raise_for_status と timeout</h3>
          <p>ネットワーク通信は、サーバーダウン、タイムアウト、回線切断など予期せぬ失敗が日常茶飯事です。実務では必ず <strong>タイムアウトの指定</strong> と <strong>例外ハンドリング</strong> を実装します。</p>

          <pre><code class="language-python">import requests

try:
    # タイムアウトを5秒に設定（永遠に待たされるのを防止）
    res = requests.get('https://api.example.com/users', timeout=5)
    
    # 4xxや5xxエラーのときに自動で HTTPError 例外を発生させる
    res.raise_for_status()
    
    users = res.json()
    print('取得成功:', len(users), '人')

except requests.exceptions.Timeout:
    print('エラー: サーバーの応答がタイムアウトしました')
except requests.exceptions.HTTPError as err:
    print(f'HTTPエラー発生: {err}')
except requests.exceptions.RequestException as err:
    print(f'通信エラー全般: {err}')</code></pre>
        `,
        key_takeaways: [
          "timeout=秒数 を必ず設定し、プログラムの無限停止を防ぐ",
          "response.raise_for_status() でエラーレスポンスを例外として検知",
          "requests.exceptions.RequestException で通信エラーを一括捕捉"
        ],
        example_code: "# 通信エラーハンドリングのパターン\ndef safe_request_simulator(status_code, is_timeout=False):\n    try:\n        if is_timeout:\n            raise TimeoutError('Request timed out after 5.0s')\n        if status_code >= 400:\n            raise Exception(f'HTTP {status_code} Error')\n        return {'status': 'ok', 'code': status_code}\n    except TimeoutError as e:\n        return {'status': 'timeout', 'message': str(e)}\n    except Exception as e:\n        return {'status': 'error', 'message': str(e)}\n\nprint(safe_request_simulator(200))\nprint(safe_request_simulator(503))\nprint(safe_request_simulator(0, is_timeout=True))",
        exercise: {
          id: 512,
          title: "安全なAPI呼び出しラッパー関数",
          description: "<p>ステータスコード <code>code</code> と レスポンスデータ <code>data</code> を受け取り、成功（<code>200 <= code < 300</code>）なら <code>{'success': True, 'data': data}</code>、クライアントエラー（<code>400 <= code < 500</code>）なら <code>{'success': False, 'error': 'Client Error'}</code>、サーバーエラー（<code>code >= 500</code>）なら <code>{'success': False, 'error': 'Server Error'}</code> を返す関数 <code>safe_api_wrapper(code, data)</code> を実装してください。</p>",
          template: "def safe_api_wrapper(code, data):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "safe_api_wrapper(200, {'msg': 'ok'})", expected: { success: true, data: { msg: "ok" } } },
            { input: "safe_api_wrapper(404, {})", expected: { success: false, error: "Client Error" } },
            { input: "safe_api_wrapper(502, {})", expected: { success: false, error: "Server Error" } },
          ],
          solution_code: "def safe_api_wrapper(code, data):\n    if 200 <= code < 300:\n        return {'success': True, 'data': data}\n    elif 400 <= code < 500:\n        return {'success': False, 'error': 'Client Error'}\n    elif code >= 500:\n        return {'success': False, 'error': 'Server Error'}\n    return {'success': False, 'error': 'Unknown'}\n",
          explanation: "HTTPステータスコードの範囲に応じて適切な結果辞書を返します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第15章: BeautifulSoup4 (HTML解析とWebスクレイピング)
  // =========================================================================
  {
    id: 15,
    order: 15,
    title: "第15章: BeautifulSoup4 (HTML解析とデータ抽出)",
    subtitle: "HTMLタグ解析・find/select・属性抽出・スクレイピング倫理",
    icon: "code",
    category: "library",
    category_group: "library",
    target_level: 3,
    summary: "Webページから必要なテキストやリンク、価格データを抽出するBeautifulSoup4。HTMLのツリー構造、タグ名やclass名での検索、CSSセレクタの活用、そして実務で厳守すべきスクレイピングのマナーと倫理を学びます。",
    lessons: [
      {
        id: 513,
        chapter_id: 15,
        chapter_order: 15,
        chapter_title: "BeautifulSoup4 (HTML解析とデータ抽出)",
        order: 1,
        title: "15.1 HTMLの基本構造とBeautifulSoupの初期化",
        reading_time_minutes: 6,
        runtime_env: "browser",
        runtime_note: "安全のため外部へのアクセスは行わず、安全なHTML文字列を対象にDOMパース技術を演習します。",
        content_html: `
          <h3>HTMLはタグの入れ子構造（ツリー構造）</h3>
          <p>Webサイトの画面はすべてHTMLで書かれています。<code>&lt;html&gt;</code> の中に <code>&lt;body&gt;</code> があり、その中に <code>&lt;div&gt;</code> や <code>&lt;p&gt;</code> が入る階層構造になっています。この構造を解析して目的のデータを取り出すライブラリが <strong>BeautifulSoup4</strong> です。</p>

          <pre><code class="language-python">from bs4 import BeautifulSoup

html_doc = """
<html>
  <head><title>テストページ</title></head>
  <body>
    <h1 class="main-title">商品一覧</h1>
    <p class="description">最新のアイテムをお届けします。</p>
  </body>
</html>
"""

# HTMLを解析してスープオブジェクトを作成
soup = BeautifulSoup(html_doc, 'html.parser')

# タグに直接アクセス
print(soup.title.text)       # 'テストページ'
print(soup.h1.text)          # '商品一覧'
print(soup.h1['class'])      # ['main-title'] (属性値の取得)</code></pre>
        `,
        key_takeaways: [
          "BeautifulSoup(html_text, 'html.parser') で解析開始",
          "soup.タグ名.text でテキスト内容を抽出",
          "tag['属性名'] で class や href などの属性値を取得"
        ],
        example_code: "# HTML文字列解析の基本パターン\nimport re\n\nhtml = '<html><title>公式ストア</title><body><h1>特価セール</h1></body></html>'\n# タイトルタグ抽出の簡易ロジック\nmatch = re.search(r'<title>(.*?)</title>', html)\nprint('抽出タイトル:', match.group(1) if match else 'なし')",
        exercise: {
          id: 513,
          title: "HTML文字列からのタイトルと見出し抽出",
          description: "<p>HTML文字列 <code>html_str</code> を受け取り、<code>&lt;title&gt;...&lt;/title&gt;</code> のテキストと <code>&lt;h1&gt;...&lt;/h1&gt;</code> のテキストを抽出し、<code>{'title': タイトル, 'h1': 見出し}</code> の辞書で返す関数 <code>extract_page_titles(html_str)</code> を実装してください。（※タグが見つからない場合は空文字 <code>\"\"</code> を設定してください）</p>",
          template: "import re\n\ndef extract_page_titles(html_str):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "extract_page_titles('<html><head><title>マイショップ</title></head><body><h1>おすすめ商品</h1></body></html>')",
              expected: { title: "マイショップ", h1: "おすすめ商品" }
            },
            {
              input: "extract_page_titles('<div><h1>新着情報</h1></div>')",
              expected: { title: "", h1: "新着情報" }
            },
          ],
          solution_code: "import re\n\ndef extract_page_titles(html_str):\n    title_m = re.search(r'<title>(.*?)</title>', html_str, re.DOTALL)\n    h1_m = re.search(r'<h1>(.*?)</h1>', html_str, re.DOTALL)\n    return {\n        'title': title_m.group(1).strip() if title_m else '',\n        'h1': h1_m.group(1).strip() if h1_m else ''\n    }\n",
          explanation: "正規表現で title タグと h1 タグの中身を抽出し、辞書にまとめます。",
        },
      },
      {
        id: 514,
        chapter_id: 15,
        chapter_order: 15,
        chapter_title: "BeautifulSoup4 (HTML解析とデータ抽出)",
        order: 2,
        title: "15.2 要素の検索: find() と find_all()",
        reading_time_minutes: 6,
        runtime_env: "browser",
        runtime_note: "HTML内の複数要素（商品カード・ニュース記事など）の繰り返し抽出ロジックを学習します。",
        content_html: `
          <h3>単一検索の find() と 全件検索の find_all()</h3>
          <p>ページ内に多数ある商品や記事からデータを取得するには、<code>find_all()</code> でリストとして取得し、forループで回します。</p>

          <pre><code class="language-python">from bs4 import BeautifulSoup

soup = BeautifulSoup(html_text, 'html.parser')

# 最初の1件だけ取得
first_price = soup.find('span', class_='price')

# すべての商品要素を取得
products = soup.find_all('div', class_='product-card')
for item in products:
    name = item.find('h3', class_='name').get_text(strip=True)
    price = item.find('span', class_='price').get_text(strip=True)
    link = item.find('a')['href']
    print(f'{name} : {price} ({link})')</code></pre>

          <div class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs mt-3">
            <strong>注意:</strong> Pythonの予約語 <code>class</code> と衝突するため、クラス名で検索するときは <code>class_='クラス名'</code> と末尾にアンダースコアを付けます。
          </div>
        `,
        key_takeaways: [
          "soup.find('タグ', class_='...') で最初の一致要素を取得",
          "soup.find_all('タグ', class_='...') で合致する全要素のリストを取得",
          ".get_text(strip=True) で前後の余分な改行や空白を除去してテキスト取得"
        ],
        example_code: "# 商品リストHTMLのデータ抽出パターン\nimport re\n\nhtml_content = '''\n<div class=\"item\"><span class=\"name\">りんご</span><span class=\"price\">120円</span></div>\n<div class=\"item\"><span class=\"name\">バナナ</span><span class=\"price\">80円</span></div>\n'''\n\nitems = re.findall(r'<div class=\"item\"><span class=\"name\">(.*?)</span><span class=\"price\">(.*?)</span></div>', html_content)\nfor name, price in items:\n    print(f'{name}: {price}')",
        exercise: {
          id: 514,
          title: "商品一覧HTMLからのデータ抽出",
          description: "<p>商品情報を含むHTML文字列 <code>html_doc</code>（各商品が <code>&lt;li class=\"item\"&gt;&lt;span class=\"name\"&gt;商品名&lt;/span&gt;&lt;span class=\"price\"&gt;価格(数値)&lt;/span&gt;&lt;/li&gt;</code> 形式）を受け取り、各商品の <code>{'name': 商品名, 'price': int(価格)}</code> をリストで返す関数 <code>extract_products(html_doc)</code> を実装してください。</p>",
          template: "import re\n\ndef extract_products(html_doc):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "extract_products('<ul><li class=\"item\"><span class=\"name\">ペン</span><span class=\"price\">150</span></li><li class=\"item\"><span class=\"name\">ノート</span><span class=\"price\">280</span></li></ul>')",
              expected: [{ name: "ペン", price: 150 }, { name: "ノート", price: 280 }]
            },
            {
              input: "extract_products('<ul><li class=\"item\"><span class=\"name\">消しゴム</span><span class=\"price\">100</span></li></ul>')",
              expected: [{ name: "消しゴム", price: 100 }]
            },
          ],
          solution_code: "import re\n\ndef extract_products(html_doc):\n    pattern = r'<li class=\"item\">.*?<span class=\"name\">(.*?)</span>.*?<span class=\"price\">(\\d+)</span>.*?</li>'\n    matches = re.findall(pattern, html_doc, re.DOTALL)\n    return [{'name': m[0].strip(), 'price': int(m[1])} for m in matches]\n",
          explanation: "正規表現で商品名と価格の数値を抽出し、辞書のリストに変換して返します。",
        },
      },
      {
        id: 515,
        chapter_id: 15,
        chapter_order: 15,
        chapter_title: "BeautifulSoup4 (HTML解析とデータ抽出)",
        order: 3,
        title: "15.3 CSSセレクタ (select) とスクレイピングの注意点・倫理",
        reading_time_minutes: 6,
        runtime_env: "browser",
        runtime_note: "CSSセレクタによるスマートな抽出と、Webスクレイピングにおける法的・倫理的ルールを学びます。",
        content_html: `
          <h3>Webスクレイピングの3大原則（倫理とマナー）</h3>
          <p>スクレイピングは強力な技術ですが、正しく行わないと相手のサーバーをダウンさせたり、法的なトラブルに発展します。</p>
          <ol>
            <li><strong>利用規約の確認</strong>: サイトの利用規約でスクレイピングが禁止されていないか必ず確認。</li>
            <li><strong>robots.txt の遵守</strong>: <code>https://example.com/robots.txt</code> でクローリング許可範囲を確認。</li>
            <li><strong>サーバー負荷への配慮</strong>: 連続アクセス時は必ず <code>time.sleep(1)</code> 以上（通常は数秒）の間隔を空ける。</li>
          </ol>

          <h4>CSSセレクタ: select() と select_one()</h4>
          <pre><code class="language-python"># CSSセレクタなら複雑な階層も1行で指定可能
# 'ul.ranking > li:nth-child(1)' など
top_item = soup.select_one('div#main-content article.featured h2.title')
links = soup.select('div.nav a.link')</code></pre>
        `,
        key_takeaways: [
          "soup.select('CSSセレクタ') で直感的かつ柔軟に複数要素を抽出",
          "アクセス間隔（time.sleep）を空けてサーバー負荷を最小限に抑える",
          "著作権、利用規約、robots.txt を尊重してスクレイピングを行う"
        ],
        example_code: "# 安全なクローリングの間隔制御\nimport time\n\nurls = ['https://example.com/page1', 'https://example.com/page2']\nfor url in urls:\n    # 実際のスクレイピング処理...\n    print('データ取得完了:', url)\n    # サーバーに負荷をかけないよう必ず待機\n    # time.sleep(1.0)",
        exercise: {
          id: 515,
          title: "ランキングリストの順位と項目抽出",
          description: "<p>ランキングHTML文字列 <code>ranking_html</code>（各項目が <code>&lt;div class=\"rank-item\" data-rank=\"順位\"&gt;項目名&lt;/div&gt;</code> 形式）を受け取り、<code>[{'rank': int(順位), 'item': 項目名}, ...]</code> のリストを返す関数 <code>parse_ranking(ranking_html)</code> を実装してください。</p>",
          template: "import re\n\ndef parse_ranking(ranking_html):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "parse_ranking('<div class=\"rank-item\" data-rank=\"1\">Python</div><div class=\"rank-item\" data-rank=\"2\">JavaScript</div>')",
              expected: [{ rank: 1, item: "Python" }, { rank: 2, item: "JavaScript" }]
            },
            {
              input: "parse_ranking('<div class=\"rank-item\" data-rank=\"1\">ゴールド</div>')",
              expected: [{ rank: 1, item: "ゴールド" }]
            },
          ],
          solution_code: "import re\n\ndef parse_ranking(ranking_html):\n    pattern = r'<div class=\"rank-item\" data-rank=\"(\\d+)\">(.*?)</div>'\n    matches = re.findall(pattern, ranking_html)\n    return [{'rank': int(m[0]), 'item': m[1].strip()} for m in matches]\n",
          explanation: "正規表現で data-rank 属性値とタグ内テキストを抽出して構造化します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第16章: scikit-learn (機械学習入門)
  // =========================================================================
  {
    id: 16,
    order: 16,
    title: "第16章: scikit-learn (機械学習入門)",
    subtitle: "特徴量・モデル学習(fit)・予測(predict)・評価(accuracy)",
    icon: "cpu-chip",
    category: "library",
    category_group: "library",
    target_level: 4,
    summary: "Pythonで機械学習を実装する際の業界標準ライブラリscikit-learn。特徴量(X)と目的変数(y)の準備、データ分割(train_test_split)、モデルの学習(fit)、未知データの予測(predict)、精度評価の王道パイプラインを理解します。",
    lessons: [
      {
        id: 516,
        chapter_id: 16,
        chapter_order: 16,
        chapter_title: "scikit-learn (機械学習入門)",
        order: 1,
        title: "16.1 機械学習の基本概念: 特徴量(X)と目的変数(y)",
        reading_time_minutes: 6,
        runtime_env: "backend_only",
        runtime_note: "scikit-learnは重厚なC拡張のため、本単元ではコードリーディングと前処理パイプライン設計の視点で学習します。",
        content_html: `
          <h3>機械学習とは「データからパターンを学ぶこと」</h3>
          <p>従来のプログラミングでは「人間がルール（if文）を書く」のに対し、機械学習では「大量のデータからコンピュータが自動でルールを学習」します。</p>

          <h4>教師あり学習の2大要素</h4>
          <ul>
            <li><strong>特徴量 (X: Features)</strong>: 予測の手がかりとなるデータ（例: 家の広さ、築年数、駅徒歩分数）。大文字の <code>X</code>（2次元行列）で表記。</li>
            <li><strong>目的変数 (y: Target)</strong>: 予測したい正解ラベル（例: 家賃、病気の有無）。小文字の <code>y</code>（1次元配列）で表記。</li>
          </ul>

          <pre><code class="language-python">from sklearn.datasets import load_iris
import pandas as pd

# 有名なアヤメ (Iris) の花データセット
iris = load_iris()
X = iris.data    # がく片や花びらの長さ・幅 (4つの特徴量)
y = iris.target  # 3種類の花品種 (0, 1, 2)

print('特徴量の形状:', X.shape)  # (150, 4) -> 150サンプル・4特徴量
print('ラベルの形状:', y.shape)  # (150,)</code></pre>
        `,
        key_takeaways: [
          "X は特徴量マトリクス（行がサンプル、列が特徴量）",
          "y は目的変数ベクトル（予測したい答え）",
          "生データから X と y を正確に分離・抽出することが機械学習の第一歩"
        ],
        example_code: "# 生データから特徴量Xと目的変数yを分離する前処理\nraw_samples = [\n    {'age': 25, 'income': 400, 'subscribed': 1},\n    {'age': 45, 'income': 800, 'subscribed': 0},\n    {'age': 32, 'income': 550, 'subscribed': 1}\n]\n\nX = [[s['age'], s['income']] for s in raw_samples]\ny = [s['subscribed'] for s in raw_samples]\nprint('特徴量 X:', X)\nprint('目的変数 y:', y)",
        exercise: {
          id: 516,
          title: "特徴量Xとラベルyの分離前処理",
          description: "<p>辞書レコードのリスト <code>dataset</code> と、目的変数とするキー名 <code>target_col</code> を受け取り、それ以外のキーを特徴量 <code>X</code>（各サンプルの値リストのリスト）、目的変数の値を <code>y</code>（リスト）として <code>{'X': X, 'y': y}</code> を返す関数 <code>split_features_target(dataset, target_col)</code> を実装してください。（※特徴量のキーはアルファベット昇順で並べてください）</p>",
          template: "def split_features_target(dataset, target_col):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "split_features_target([{'a': 1, 'b': 2, 'target': 0}, {'a': 3, 'b': 4, 'target': 1}], 'target')",
              expected: { X: [[1, 2], [3, 4]], y: [0, 1] }
            },
            {
              input: "split_features_target([{'x': 10, 'label': 'cat'}, {'x': 20, 'label': 'dog'}], 'label')",
              expected: { X: [[10], [20]], y: ["cat", "dog"] }
            },
          ],
          solution_code: "def split_features_target(dataset, target_col):\n    if not dataset:\n        return {'X': [], 'y': []}\n    feature_keys = sorted([k for k in dataset[0].keys() if k != target_col])\n    X = [[row[k] for k in feature_keys] for row in dataset]\n    y = [row[target_col] for row in dataset]\n    return {'X': X, 'y': y}\n",
          explanation: "target_col 以外のキーを昇順で抽出し、特徴量マトリクス X とラベル y に分離します。",
        },
      },
      {
        id: 517,
        chapter_id: 16,
        chapter_order: 16,
        chapter_title: "scikit-learn (機械学習入門)",
        order: 2,
        title: "16.2 データの分割とモデルの学習: train_test_split & fit",
        reading_time_minutes: 6,
        runtime_env: "backend_only",
        runtime_note: "機械学習で最も重要な「過学習の防止」と訓練/検証データ分割の原則を学びます。",
        content_html: `
          <h3>過去問を丸暗記させない: 訓練データとテストデータ</h3>
          <p>手元のデータをすべて学習に使ってしまうと、訓練データには100%正解できるのに、未知の実運用データで全く役に立たない <strong>過学習 (Overfitting)</strong> に陥ります。そのため、データを「学習用」と「テスト用」に分割します。</p>

          <pre><code class="language-python">from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# 80%を学習用、20%をテスト用に分割
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# モデルの作成 (ランダムフォレスト分類器)
model = RandomForestClassifier(n_estimators=100)

# 学習実行！ (fit メソッド)
model.fit(X_train, y_train)
print('学習完了！')</code></pre>
        `,
        key_takeaways: [
          "train_test_split でデータを訓練用(train)と評価用(test)に厳格に分離",
          "model.fit(X_train, y_train) でモデルがパターンを自動学習",
          "random_state で再現性を確保する"
        ],
        example_code: "# データセット分割のロジックシミュレーション\ndef simple_split(data, test_ratio=0.25):\n    split_idx = int(len(data) * (1 - test_ratio))\n    return data[:split_idx], data[split_idx:]\n\nitems = [1, 2, 3, 4, 5, 6, 7, 8]\ntrain, test = simple_split(items, 0.25)\nprint('Train:', train)  # [1, 2, 3, 4, 5, 6]\nprint('Test:', test)    # [7, 8]",
        exercise: {
          id: 517,
          title: "訓練データとテストデータのインデックス分割",
          description: "<p>総サンプル数 <code>n</code> と テスト割合 <code>test_ratio</code>（例: <code>0.2</code>）を受け取り、前半の訓練用インデックスリスト <code>train_indices</code> と 後半のテスト用インデックスリスト <code>test_indices</code> を <code>{'train': [...], 'test': [...]}</code> で返す関数 <code>train_test_indices(n, test_ratio)</code> を実装してください。（※訓練サンプル数は <code>int(n * (1 - test_ratio))</code> で切り捨て計算してください）</p>",
          template: "def train_test_indices(n, test_ratio):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "train_test_indices(10, 0.2)", expected: { train: [0, 1, 2, 3, 4, 5, 6, 7], test: [8, 9] } },
            { input: "train_test_indices(5, 0.4)", expected: { train: [0, 1, 2], test: [3, 4] } },
          ],
          solution_code: "def train_test_indices(n, test_ratio):\n    train_count = int(n * (1 - test_ratio))\n    indices = list(range(n))\n    return {\n        'train': indices[:train_count],\n        'test': indices[train_count:]\n    }\n",
          explanation: "int(n * (1 - test_ratio)) で訓練件数を算出し、スライスでインデックスを分割します。",
        },
      },
      {
        id: 518,
        chapter_id: 16,
        chapter_order: 16,
        chapter_title: "scikit-learn (機械学習入門)",
        order: 3,
        title: "16.3 予測 (predict) とモデル精度の評価 (accuracy)",
        reading_time_minutes: 6,
        runtime_env: "backend_only",
        runtime_note: "未知データへの予測実行と正解率（Accuracy）の算出指標を学びます。",
        content_html: `
          <h3>学習済みモデルによる予測と実力測定</h3>
          <p>学習が完了したモデルに未知のテスト用特徴量 <code>X_test</code> を渡し、<code>predict()</code> で予測ラベルを導出します。そして、テスト用正解ラベル <code>y_test</code> と突き合わせて正解率を評価します。</p>

          <pre><code class="language-python">from sklearn.metrics import accuracy_score, classification_report

# テストデータで予測
y_pred = model.predict(X_test)

# 正解率 (Accuracy) の計算
acc = accuracy_score(y_test, y_pred)
print(f'正解率: {acc * 100:.2f}%')

# 詳細な分類レポート (適合率・再現率・F1スコア)
print(classification_report(y_test, y_pred))</code></pre>
        `,
        key_takeaways: [
          "model.predict(X_test) で未知サンプルの予測結果配列を得る",
          "accuracy_score(正解y, 予測y) で正解率（全体のうち正しく当てられた割合）を算出",
          "実務では適合率 (Precision) や再現率 (Recall) も併せて評価する"
        ],
        example_code: "# 正解率 (Accuracy) の計算シミュレーション\ny_true = [1, 0, 1, 1, 0, 1]\ny_pred = [1, 0, 1, 0, 0, 1]  # 4番目だけ予測ミス\n\ncorrect = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp)\naccuracy = correct / len(y_true)\nprint(f'正解数: {correct}/{len(y_true)} (正解率: {accuracy:.2%})')",
        exercise: {
          id: 518,
          title: "正解率 (Accuracy) の計算関数",
          description: "<p>正解ラベルリスト <code>y_true</code> と 予測ラベルリスト <code>y_pred</code> を受け取り、正解率を小数第3位まで四捨五入した数値（0.0〜1.0）として返す関数 <code>calculate_accuracy(y_true, y_pred)</code> を実装してください。（※リストが空の場合は <code>0.0</code> を返してください）</p>",
          template: "def calculate_accuracy(y_true, y_pred):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            { input: "calculate_accuracy([1, 0, 1, 1], [1, 0, 1, 0])", expected: 0.75 },
            { input: "calculate_accuracy(['cat', 'dog', 'cat'], ['cat', 'dog', 'cat'])", expected: 1.0 },
            { input: "calculate_accuracy([1, 2, 3], [3, 2, 1])", expected: 0.333 },
          ],
          solution_code: "def calculate_accuracy(y_true, y_pred):\n    if not y_true or len(y_true) != len(y_pred):\n        return 0.0\n    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)\n    return round(correct / len(y_true), 3)\n",
          explanation: "zip で対応要素を比較し、一致数を総要素数で割って round します。",
        },
      },
    ],
  },

  // =========================================================================
  // 第17章: 実践横断プロジェクト (ライブラリ連携総合演習)
  // =========================================================================
  {
    id: 17,
    order: 17,
    title: "第17章: 実践横断プロジェクト (ライブラリ連携)",
    subtitle: "データ収集・加工・集計・可視化・分析の一気通貫パイプライン",
    icon: "sparkles",
    category: "library",
    category_group: "library",
    target_level: 4,
    summary: "個別のライブラリ単体学習から、実際のシステム開発・実務プロジェクトへのステップアップ。pandasのデータ加工、NumPyの数値演算、Matplotlibの可視化、そしてWebデータ抽出を一貫して繋げる実践パイプラインを開発します。",
    lessons: [
      {
        id: 519,
        chapter_id: 17,
        chapter_order: 17,
        chapter_title: "実践横断プロジェクト (ライブラリ連携)",
        order: 1,
        title: "17.1 【プロジェクト1】売上データ集計からグラフ可視化への一貫パイプライン",
        reading_time_minutes: 7,
        runtime_env: "browser",
        runtime_note: "データ集約（pandas/NumPy流）から可視化（Matplotlib）までをブラウザ上で実行します。",
        content_html: `
          <h3>実務データ分析フローの完成</h3>
          <p>データサイエンティストや業務改善エンジニアの日常業務は、「生ログ・CSV取得」→「pandasでの集約・クレンジング」→「NumPyでの指標計算」→「Matplotlibでのグラフ化」という流れで進行します。</p>

          <h4>一貫パイプラインの構成</h4>
          <ol>
            <li><strong>データ抽出・フィルタリング</strong>: キャンセル注文の除外、有効データの抽出</li>
            <li><strong>グループ集計</strong>: 月別・商品カテゴリ別の売上集計</li>
            <li><strong>成長率・KPI計算</strong>: 前月比、平均顧客単価の算出</li>
            <li><strong>ダッシュボード可視化</strong>: 経営陣に提出する推移グラフの出力</li>
          </ol>
        `,
        key_takeaways: [
          "データ加工 → 計算 → 可視化 のパイプラインを関数化して再利用可能にする",
          "複数のライブラリの得意分野（NumPy: 高速計算, pandas: 表加工, Matplotlib: 可視化）を組み合わせる",
          "実務のデータサイエンス業務の基本ワークフローを体得する"
        ],
        example_code: "# データ集計から可視化データ構築までの統合関数\ndef build_sales_report(orders):\n    # 1. 完了済み注文のみ抽出\n    valid = [o for o in orders if o.get('status') == 'completed']\n    \n    # 2. 月別売上集計\n    monthly = {}\n    for o in valid:\n        m = o['month']\n        monthly[m] = monthly.get(m, 0) + o['amount']\n        \n    # 3. グラフ描画用データの整形\n    months = sorted(monthly.keys())\n    totals = [monthly[m] for m in months]\n    return {'months': months, 'totals': totals, 'grand_total': sum(totals)}\n\nreport = build_sales_report([\n    {'month': '4月', 'amount': 50000, 'status': 'completed'},\n    {'month': '4月', 'amount': 20000, 'status': 'canceled'},\n    {'month': '5月', 'amount': 80000, 'status': 'completed'}\n])\nprint('月別レポート:', report)",
        exercise: {
          id: 519,
          title: "ECサイト売上集計＆グラフデータ生成パイプライン",
          description: "<p>注文レコードのリスト <code>orders</code>（各要素は <code>{'item': str, 'price': int, 'qty': int, 'valid': bool}</code>）を受け取り、有効な注文（<code>valid == True</code>）のみを対象として、売上高（<code>price * qty</code>）を商品別に集計し、商品別売上合計の降順でソートした商品名リスト <code>labels</code> と売上高リスト <code>values</code>、そして全体売上合計 <code>total_sales</code> を <code>{'labels': labels, 'values': values, 'total_sales': total_sales}</code> で返す関数 <code>generate_chart_pipeline(orders)</code> を実装してください。</p>",
          template: "def generate_chart_pipeline(orders):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "generate_chart_pipeline([{'item': 'Tシャツ', 'price': 2000, 'qty': 3, 'valid': True}, {'item': '帽子', 'price': 1500, 'qty': 1, 'valid': False}, {'item': 'Tシャツ', 'price': 2000, 'qty': 2, 'valid': True}, {'item': 'パーカー', 'price': 5000, 'qty': 1, 'valid': True}])",
              expected: { labels: ["Tシャツ", "パーカー"], values: [10000, 5000], total_sales: 15000 }
            },
          ],
          solution_code: "def generate_chart_pipeline(orders):\n    item_totals = {}\n    for o in orders:\n        if o.get('valid'):\n            item = o['item']\n            subtotal = o['price'] * o['qty']\n            item_totals[item] = item_totals.get(item, 0) + subtotal\n    sorted_items = sorted(item_totals.items(), key=lambda x: x[1], reverse=True)\n    labels = [x[0] for x in sorted_items]\n    values = [x[1] for x in sorted_items]\n    return {\n        'labels': labels,\n        'values': values,\n        'total_sales': sum(values)\n    }\n",
          explanation: "valid==True をフィルタリングし、商品ごとに price*qty を加算して降順ソートします。",
        },
      },
      {
        id: 520,
        chapter_id: 17,
        chapter_order: 17,
        chapter_title: "実践横断プロジェクト (ライブラリ連携)",
        order: 2,
        title: "17.2 【プロジェクト2】Webデータ抽出から構造化分析への一貫パイプライン",
        reading_time_minutes: 7,
        runtime_env: "browser",
        runtime_note: "HTML解析（BeautifulSoup技術）とpandas風データ集約を組み合わせた実践パイプラインです。",
        content_html: `
          <h3>スクレイピングからレポート作成までの全自動化</h3>
          <p>Webサイトに掲載されている生データ（製品表、求人情報、競合価格など）をHTMLから自動抽出し、構造化データ（テーブル）に変換して統計レポートを出力する実務自動化パイプラインを構築します。</p>

          <h4>パイプラインの流れ</h4>
          <ol>
            <li><strong>HTMLパース</strong>: テーブルタグやリスト要素からテキストと属性を抽出</li>
            <li><strong>データクレンジング</strong>: 「¥1,200」などの記号・カンマを取り除いて数値型に変換</li>
            <li><strong>pandas/集約</strong>: 平均価格、最高価格、カテゴリ別集計の算出</li>
            <li><strong>サマリー出力</strong>: ビジネス判断に使える辞書・レポート形式で出力</li>
          </ol>
        `,
        key_takeaways: [
          "非構造化データ (HTML) から構造化データ (辞書・リスト) への変換技術",
          "正規表現や文字列メソッドを活用した強固なデータクレンジング",
          "Webスクレイピングとデータ分析を繋ぐエンジニアリング実践力"
        ],
        example_code: "# HTMLテーブルからのクレンジング＆集計パイプライン\nimport re\n\nraw_table_html = '''\n<table>\n  <tr><td>書籍</td><td>¥2,400</td></tr>\n  <tr><td>雑誌</td><td>¥800</td></tr>\n  <tr><td>書籍</td><td>¥1,600</td></tr>\n</table>\n'''\n\nrows = re.findall(r'<tr><td>(.*?)</td><td>¥([0-9,]+)</td></tr>', raw_table_html)\ncleaned = []\nfor cat, price_str in rows:\n    price = int(price_str.replace(',', ''))\n    cleaned.append({'cat': cat, 'price': price})\n\nprint('クレンジング結果:', cleaned)",
        exercise: {
          id: 520,
          title: "HTMLテーブルからの価格クレンジング＆集計関数",
          description: "<p>HTMLテーブル文字列 <code>table_html</code>（<code>&lt;tr&gt;&lt;td class=\"cat\"&gt;カテゴリ&lt;/td&gt;&lt;td class=\"val\"&gt;¥価格(カンマ付き文字列)&lt;/td&gt;&lt;/tr&gt;</code> 形式）を受け取り、価格のカンマと¥記号を除去して整数化し、カテゴリ別の平均価格（小数第1位まで四捨五入）を <code>{カテゴリ: 平均価格}</code> の辞書で返す総合関数 <code>clean_and_aggregate_html(table_html)</code> を実装してください。</p>",
          template: "import re\n\ndef clean_and_aggregate_html(table_html):\n    # ここにコードを書いてください\n    pass\n",
          test_cases: [
            {
              input: "clean_and_aggregate_html('<tr><td class=\"cat\">本</td><td class=\"val\">¥1,500</td></tr><tr><td class=\"cat\">本</td><td class=\"val\">¥2,500</td></tr><tr><td class=\"cat\">文具</td><td class=\"val\">¥300</td></tr>')",
              expected: { "本": 2000.0, "文具": 300.0 }
            },
          ],
          solution_code: "import re\n\ndef clean_and_aggregate_html(table_html):\n    pattern = r'<tr><td class=\"cat\">(.*?)</td><td class=\"val\">[¥￥]?([0-9,]+)</td></tr>'\n    matches = re.findall(pattern, table_html)\n    cat_totals = {}\n    cat_counts = {}\n    for cat, p_str in matches:\n        val = int(p_str.replace(',', ''))\n        cat_totals[cat] = cat_totals.get(cat, 0) + val\n        cat_counts[cat] = cat_counts.get(cat, 0) + 1\n    return {cat: round(cat_totals[cat] / cat_counts[cat], 1) for cat in cat_totals}\n",
          explanation: "正規表現でカテゴリと金額を抽出し、カンマを除去して整数変換し、カテゴリ別平均を計算します。",
        },
      },
    ],
  },
];

// グローバルスコープおよびモジュールへの公開 & 既存 textbookDataChapters との自動統合
if (typeof window !== "undefined") {
  window.practicalLibraryChapters = practicalLibraryChapters;
  if (window.textbookDataChapters && Array.isArray(window.textbookDataChapters)) {
    // 既存データに含まれていない場合のみ安全に追加
    const existingIds = new Set(window.textbookDataChapters.map((ch) => ch.id));
    practicalLibraryChapters.forEach((ch) => {
      if (!existingIds.has(ch.id)) {
        window.textbookDataChapters.push(ch);
      }
    });
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = practicalLibraryChapters;
}
