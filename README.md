# Python & JavaScript 体系的ステップアップ学習Webアプリケーション

ブラウザ単体で即座に動作する、AI連携・実力診断・パーソナライズ教科書・対話型コーディング演習Webアプリケーションです。

---

## 🌟 主な機能

1. **実力診断アセスメント (Assessment Engine)**
   - 基礎文法からアルゴリズム、可視化まで全8問で現在の実力を精密判定。
   - 解答時間、ヒント利用回数、模範解答閲覧をリアルタイム計測し、自力解決度（ノーヒント達成率）を算出。
2. **分野別スキルレーダーチャート (Skill Radar Analytics)**
   - 基本文法・型、制御構文、データ構造、標準ライブラリ、可視化、アルゴリズムの6軸レーダーチャート。
   - AIアドバイザーによるパーソナライズ総評と推奨単元の自動提示。
3. **体系的ステップアップ教科書 (Textbook Curriculum)**
   - 全8章（9単元）のインタラクティブ教科書。
   - 丁寧なHTML解説、重要ポイントカード、対話型サンプル実行、スマートインデント対応演習エディタを完備。
4. **4択クイズ & コーディング演習**
   - Brythonによるブラウザ上でのPythonコード即時実行・自動テスト採点。
   - Gemini 3.7 Flash によるAI問題自動生成。
5. **JSコーディングチャレンジ**
   - JavaScriptのアルゴリズム・データ操作問題集。

---

## 📁 ディレクトリ構成

```text
book/
├── index.html                 # メイン学習アプリケーション (SPA)
├── js/
│   └── app.js                 # アプリケーションロジック・Brython・評価エンジン
├── css/
│   └── style.css              # カスタムスタイル
├── challenges/                # JavaScript コーディングチャレンジ
│   ├── index.html
│   ├── app.js
│   └── style.css
├── backend/                   # (オプション) Django REST Framework バックエンド
│   ├── ai_service/            # Gemini 3.7 Flash API 連携
│   ├── assessment/            # 実力診断・採点API
│   ├── curriculum/            # 教科書進捗API
│   ├── book_server/           # Django 設定
│   ├── manage.py
│   └── requirements.txt
└── README.md
```

---

## 🚀 使い方

### 1. ブラウザで開くだけ (サーバー不要・完全動作)
`index.html` をお好みのブラウザ（Chrome, Edge等）でダブルクリックして開くだけで、実力診断、教科書学習、演習エディタ、4択クイズなど全機能が即座に動作します（GitHub Pagesでもそのまま公開可能です）。

### 2. (オプション) Django バックエンドを動かす場合
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```
