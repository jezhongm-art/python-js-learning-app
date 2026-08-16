#!/usr/bin/env python3
"""
Git Auto Commit & Push Pro (PySide6 Modern Edition)
PySide6 (Qt for Python) による高精細・モダン・高機能なGitコミット＆プッシュ自動化ツール
"""

import datetime
import json
import os
import subprocess
import sys
import webbrowser

from PySide6.QtCore import (
    QObject,
    QPoint,
    QRect,
    QSize,
    Qt,
    QThread,
    QTimer,
    QUrl,
    Signal,
    Slot,
)
from PySide6.QtGui import (
    QAction,
    QBrush,
    QColor,
    QCursor,
    QDesktopServices,
    QFont,
    QIcon,
    QLinearGradient,
    QPainter,
    QPainterPath,
    QPalette,
    QPen,
    QPixmap,
)
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QDialog,
    QDialogButtonBox,
    QFileDialog,
    QFrame,
    QGraphicsDropShadowEffect,
    QGridLayout,
    QGroupBox,
    QHBoxLayout,
    QHeaderView,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QMenu,
    QMessageBox,
    QProgressBar,
    QPushButton,
    QScrollArea,
    QSizePolicy,
    QSplitter,
    QSystemTrayIcon,
    QTableWidget,
    QTableWidgetItem,
    QTabWidget,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

# 履歴設定ファイルのパス
HISTORY_FILE = os.path.expanduser("~/.git_auto_commit_history.json")


# =====================================================================
# ユーティリティ & Git コマンド実行エンジン
# =====================================================================
def run_git_command(args, cwd=None):
    """Gitコマンドを指定したディレクトリ(cwd)で同期実行し結果を返す"""
    target_cwd = cwd or os.getcwd()
    try:
        # Windowsでコンソールウィンドウが開かないように設定
        startupinfo = None
        if sys.platform == "win32":
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            startupinfo.wShowWindow = subprocess.SW_HIDE

        result = subprocess.run(
            ["git"] + args,
            cwd=target_cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            startupinfo=startupinfo,
        )
        return result.returncode == 0, result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return False, "", str(e)


def load_history():
    """履歴データ (dir -> url, url -> dir) の読み込み"""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if "dir_to_url" not in data:
                    data["dir_to_url"] = {}
                if "url_to_dir" not in data:
                    data["url_to_dir"] = {}
                return data
        except Exception:
            pass
    return {"dir_to_url": {}, "url_to_dir": {}}


def save_history(history_data):
    """履歴データの保存"""
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"履歴保存エラー: {e}")


# =====================================================================
# 非同期 Git ワーカースレッド (QThread)
# =====================================================================
class GitWorker(QThread):
    """Git コマンドを非同期で実行し、UIをブロックしないワーカースレッド"""

    log_signal = Signal(str, str)  # (message, level)
    status_updated_signal = Signal(dict)  # status dictionary
    finished_signal = Signal(bool, str)  # (success, result_message)

    def __init__(self, action_type, target_dir, **kwargs):
        super().__init__()
        self.action_type = action_type  # 'status', 'commit_push', 'init'
        self.target_dir = target_dir
        self.kwargs = kwargs

    def run(self):
        if self.action_type == "status":
            self._do_status()
        elif self.action_type == "commit_push":
            self._do_commit_push()
        elif self.action_type == "init":
            self._do_init()

    def _do_status(self):
        curr_dir = self.target_dir
        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=curr_dir)

        if not is_git:
            self.status_updated_signal.emit({
                "is_git": False,
                "branch": "未初期化",
                "remote_url": "未設定",
                "files": [],
                "target_dir": curr_dir,
            })
            return

        # ブランチ名取得
        _, branch, _ = run_git_command(["rev-parse", "--abbrev-ref", "HEAD"], cwd=curr_dir)
        branch = branch or "main"

        # リモートURL取得
        ok_url, url_out, _ = run_git_command(["remote", "get-url", "origin"], cwd=curr_dir)
        remote_url = url_out if (ok_url and url_out) else "未設定"

        # 未コミットファイルのチェック
        _, status_out, _ = run_git_command(["status", "--porcelain"], cwd=curr_dir)
        files = []
        if status_out.strip():
            for line in status_out.strip().splitlines():
                if len(line) >= 3:
                    code = line[:2].strip()
                    path = line[3:].strip()
                    files.append({"code": code if code else "M", "path": path})

        self.status_updated_signal.emit({
            "is_git": True,
            "branch": branch,
            "remote_url": remote_url,
            "files": files,
            "target_dir": curr_dir,
        })

    def _do_commit_push(self):
        curr_dir = self.target_dir
        custom_message = self.kwargs.get("message", "")
        allow_empty = self.kwargs.get("allow_empty", True)
        branch = self.kwargs.get("branch", "main")

        try:
            self.log_signal.emit(f"[{os.path.basename(curr_dir)}] の変更ステータスを確認中...", "INFO")

            # 変更の有無を確認
            _, status_out, _ = run_git_command(["status", "--porcelain"], cwd=curr_dir)
            has_changes = bool(status_out.strip())

            if has_changes:
                self.log_signal.emit("git add . を実行中...", "RUN")
                ok, _, err = run_git_command(["add", "."], cwd=curr_dir)
                if not ok:
                    self.log_signal.emit(f"git add 失敗: {err}", "ERROR")
                    self.finished_signal.emit(False, f"git add 失敗: {err}")
                    return
            else:
                if allow_empty:
                    self.log_signal.emit("変更ファイルなし。空コミット (--allow-empty) で記録します。", "INFO")
                else:
                    self.log_signal.emit("変更ファイルがないため、コミットをスキップしました。", "INFO")
                    self.finished_signal.emit(True, "変更なし (スキップ)")
                    return

            # コミットメッセージ構築
            msg = custom_message.strip() if custom_message.strip() else f"Auto commit: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            commit_args = ["commit", "-m", msg]
            if not has_changes and allow_empty:
                commit_args.append("--allow-empty")

            self.log_signal.emit(f"git commit -m '{msg}' を実行中...", "RUN")
            ok, out, err = run_git_command(commit_args, cwd=curr_dir)
            if not ok:
                self.log_signal.emit(f"git commit 失敗: {err}", "ERROR")
                self.finished_signal.emit(False, f"コミット失敗: {err}")
                return

            first_line = out.splitlines()[0] if out else "コミット完了"
            self.log_signal.emit(f"コミット成功: {first_line}", "SUCCESS")

            # Push 実行
            self.log_signal.emit(f"git push origin {branch} を実行中...", "RUN")
            ok_push, out_push, err_push = run_git_command(["push", "origin", branch], cwd=curr_dir)
            if not ok_push:
                # -u をつけて再試行
                ok_push, out_push, err_push = run_git_command(["push", "-u", "origin", branch], cwd=curr_dir)

            # リモートとの不整合 (fetch first) エラーの場合、自動で pull --allow-unrelated-histories
            if not ok_push and ("fetch first" in err_push or "rejected" in err_push):
                self.log_signal.emit("リモートに別のコミット履歴があります。自動統合中 (pull --allow-unrelated-histories)...", "WARNING")
                ok_pull, _, err_pull = run_git_command(
                    ["pull", "origin", branch, "--allow-unrelated-histories", "--no-edit"],
                    cwd=curr_dir,
                )
                if ok_pull:
                    self.log_signal.emit("自動マージ成功。再Push中...", "RUN")
                    ok_push, out_push, err_push = run_git_command(["push", "origin", branch], cwd=curr_dir)
                else:
                    self.log_signal.emit(f"自動マージ失敗: {err_pull}", "ERROR")

            if ok_push:
                self.log_signal.emit("🎉 GitHubへの Push が正常に完了しました！", "SUCCESS")
                self.finished_signal.emit(True, "Push 成功！")
            else:
                self.log_signal.emit(f"Push失敗: {err_push}", "ERROR")
                self.finished_signal.emit(False, f"Push 失敗: {err_push}")

        except Exception as ex:
            self.log_signal.emit(f"予期せぬエラー: {ex}", "ERROR")
            self.finished_signal.emit(False, str(ex))

    def _do_init(self):
        curr_dir = self.target_dir
        self.log_signal.emit(f"git init を実行中: {curr_dir}", "RUN")
        ok, _, err = run_git_command(["init"], cwd=curr_dir)
        if ok:
            run_git_command(["branch", "-M", "main"], cwd=curr_dir)
            self.log_signal.emit(f"Gitリポジトリを初期化しました (mainブランチ)", "SUCCESS")
            self.finished_signal.emit(True, "初期化成功")
        else:
            self.log_signal.emit(f"Git初期化失敗: {err}", "ERROR")
            self.finished_signal.emit(False, f"初期化失敗: {err}")


# =====================================================================
# モダン QSS スタイルシート定義 (Slate & Indigo Dark System)
# =====================================================================
MODERN_DARK_STYLE = """
/* グローバル設定 */
QWidget {
    background-color: #0b0f19;
    color: #f1f5f9;
    font-family: "Segoe UI", "Yu Gothic UI", "Meiryo", sans-serif;
    font-size: 13px;
    selection-background-color: #6366f1;
    selection-color: #ffffff;
}

/* メインウィンドウ背景 */
QMainWindow {
    background-color: #0b0f19;
}

/* カードコンテナ (Frame) */
QFrame.CardFrame {
    background-color: #131c2e;
    border: 1px solid #1e293b;
    border-radius: 12px;
}

QFrame.SubCardFrame {
    background-color: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 8px;
}

/* セクション見出しラベル */
QLabel.CardTitle {
    font-size: 14px;
    font-weight: bold;
    color: #e2e8f0;
    padding-bottom: 2px;
}

QLabel.HeaderTitle {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
}

QLabel.MutedLabel {
    color: #94a3b8;
    font-size: 12px;
}

QLabel.BadgeLabel {
    font-size: 11px;
    font-weight: bold;
    padding: 3px 10px;
    border-radius: 10px;
}

/* 入力フィールド */
QLineEdit {
    background-color: #0b1120;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 8px 12px;
    color: #f8fafc;
    font-size: 13px;
}

QLineEdit:focus {
    border: 1px solid #6366f1;
    background-color: #0f172a;
}

QLineEdit:disabled {
    background-color: #1e293b;
    color: #64748b;
    border: 1px solid #1e293b;
}

/* コンボボックス (ドロップダウン) */
QComboBox {
    background-color: #0b1120;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 6px 12px;
    color: #f8fafc;
    font-size: 13px;
    min-height: 20px;
}

QComboBox:hover {
    border: 1px solid #475569;
}

QComboBox:focus {
    border: 1px solid #6366f1;
}

QComboBox::drop-down {
    subcontrol-origin: padding;
    subcontrol-position: top right;
    width: 28px;
    border-left-width: 0px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}

QComboBox::down-arrow {
    image: none;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #94a3b8;
    margin-right: 8px;
}

QComboBox QAbstractItemView {
    background-color: #131c2e;
    border: 1px solid #334155;
    border-radius: 8px;
    color: #f8fafc;
    selection-background-color: #6366f1;
    selection-color: #ffffff;
    padding: 4px;
    outline: none;
}

/* 標準ボタン */
QPushButton {
    background-color: #1e293b;
    color: #f8fafc;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    font-size: 13px;
}

QPushButton:hover {
    background-color: #334155;
    border-color: #475569;
}

QPushButton:pressed {
    background-color: #0f172a;
}

QPushButton:disabled {
    background-color: #1e293b;
    color: #475569;
    border-color: #1e293b;
}

/* プライマリボタン (アクションボタン - Indigo Gradient) */
QPushButton.PrimaryButton {
    background-color: #4f46e5;
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #6366f1, stop:1 #4f46e5);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: bold;
}

QPushButton.PrimaryButton:hover {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #818cf8, stop:1 #6366f1);
}

QPushButton.PrimaryButton:pressed {
    background-color: #4338ca;
}

QPushButton.PrimaryButton:disabled {
    background: #334155;
    color: #64748b;
}

/* クイックタグ・サジェストボタン */
QPushButton.TagButton {
    background-color: #0f172a;
    color: #94a3b8;
    border: 1px solid #1e293b;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 500;
}

QPushButton.TagButton:hover {
    background-color: #1e293b;
    color: #c7d2fe;
    border-color: #4f46e5;
}

/* アイコンボタンスタイル */
QPushButton.IconButton {
    background-color: transparent;
    border: 1px solid #1e293b;
    border-radius: 6px;
    padding: 5px 10px;
    color: #cbd5e1;
}

QPushButton.IconButton:hover {
    background-color: #1e293b;
    border-color: #334155;
    color: #ffffff;
}

/* 変更ファイル一覧テーブル */
QTableWidget {
    background-color: #0b1120;
    border: 1px solid #1e293b;
    border-radius: 8px;
    gridline-color: #1e293b;
    color: #f1f5f9;
    font-size: 12px;
}

QTableWidget::item {
    padding: 6px;
    border-bottom: 1px solid #131c2e;
}

QTableWidget::item:selected {
    background-color: #1e293b;
    color: #818cf8;
}

QHeaderView::section {
    background-color: #131c2e;
    color: #94a3b8;
    padding: 6px;
    border: none;
    border-bottom: 1px solid #1e293b;
    font-weight: bold;
    font-size: 11px;
}

/* ログコンソール (QTextEdit) */
QTextEdit.ConsoleEdit {
    background-color: #050811;
    border: 1px solid #1e293b;
    border-radius: 8px;
    color: #e2e8f0;
    font-family: "Consolas", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.4;
    padding: 8px;
}

/* チェックボックス */
QCheckBox {
    color: #cbd5e1;
    font-size: 12px;
    spacing: 8px;
}

QCheckBox::indicator {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #334155;
    background-color: #0b1120;
}

QCheckBox::indicator:checked {
    background-color: #4f46e5;
    border-color: #6366f1;
}

QCheckBox::indicator:hover {
    border-color: #6366f1;
}

/* プログレスバー */
QProgressBar {
    border: 1px solid #1e293b;
    border-radius: 4px;
    background-color: #0b1120;
    text-align: center;
    color: transparent;
    height: 6px;
}

QProgressBar::chunk {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #6366f1, stop:1 #10b981);
    border-radius: 3px;
}

/* スクロールバー */
QScrollBar:vertical {
    background: #0b0f19;
    width: 10px;
    margin: 0px;
    border-radius: 5px;
}

QScrollBar::handle:vertical {
    background: #1e293b;
    min-height: 24px;
    border-radius: 5px;
}

QScrollBar::handle:vertical:hover {
    background: #334155;
}

QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
    height: 0px;
}

QScrollBar:horizontal {
    background: #0b0f19;
    height: 10px;
    margin: 0px;
    border-radius: 5px;
}

QScrollBar::handle:horizontal {
    background: #1e293b;
    min-width: 24px;
    border-radius: 5px;
}

QScrollBar::handle:horizontal:hover {
    background: #334155;
}

QScrollBar::add-line:horizontal, QScrollBar::sub-line:horizontal {
    width: 0px;
}

/* スプリッター */
QSplitter::handle {
    background-color: #1e293b;
    height: 2px;
}
"""


# =====================================================================
# メインアプリケーション ウィンドウ
# =====================================================================
class GitAutoCommitWindow(QMainWindow):
    def __init__(self, initial_dir=None):
        super().__init__()
        self.setWindowTitle("Git Auto Commit & Push Pro")
        self.setMinimumSize(820, 800)
        self.resize(880, 880)

        # 履歴データのロード
        self.history = load_history()

        # 状態変数
        self.target_dir = os.path.abspath(initial_dir or os.getcwd())
        self.current_branch = "main"
        self.remote_url = "未設定"
        self.is_git_repo = False
        self.is_committing = False
        self.is_auto_sync_active = False

        # 自動同期用タイマー
        self.sync_interval_sec = 300  # デフォルト5分 (300秒)
        self.seconds_remaining = 300
        self.auto_sync_timer = QTimer(self)
        self.auto_sync_timer.timeout.connect(self._on_timer_tick)

        # UI構築
        self._init_ui()
        self._setup_tray_icon()

        # 初期ステータス取得
        self.refresh_status()

    def _init_ui(self):
        # メインスクロールエリア
        main_scroll = QScrollArea()
        main_scroll.setWidgetResizable(True)
        main_scroll.setFrameShape(QFrame.NoFrame)
        main_scroll.setStyleSheet("background-color: #0b0f19;")

        container = QWidget()
        main_layout = QVBoxLayout(container)
        main_layout.setContentsMargins(18, 18, 18, 18)
        main_layout.setSpacing(14)

        # =========================================================
        # 1. ヘッダーバー (タイトル・ブランチバッジ・状態ステータスピル)
        # =========================================================
        header_card = QFrame()
        header_card.setProperty("class", "CardFrame")
        header_layout = QVBoxLayout(header_card)
        header_layout.setContentsMargins(16, 14, 16, 14)
        header_layout.setSpacing(12)

        header_top_row = QHBoxLayout()
        header_top_row.setSpacing(10)

        # Git ロゴ風タイトル
        title_label = QLabel("⚡ Git Auto Commit & Push")
        title_label.setProperty("class", "HeaderTitle")
        header_top_row.addWidget(title_label)

        header_top_row.addStretch()

        # ステータスピル (状態インジケータ)
        self.status_pill = QLabel("● 準備完了")
        self.status_pill.setProperty("class", "BadgeLabel")
        self.status_pill.setStyleSheet(
            "background-color: #064e3b; color: #34d399; border: 1px solid #059669;"
        )
        header_top_row.addWidget(self.status_pill)

        # ブランチバッジ
        self.branch_badge = QLabel("🌿 main")
        self.branch_badge.setProperty("class", "BadgeLabel")
        self.branch_badge.setStyleSheet(
            "background-color: #1e1b4b; color: #a5b4fc; border: 1px solid #4338ca;"
        )
        header_top_row.addWidget(self.branch_badge)

        header_layout.addLayout(header_top_row)

        # ---------------------------------------------------------
        # 過去の履歴セレクター
        # ---------------------------------------------------------
        history_row = QHBoxLayout()
        history_row.setSpacing(8)

        hist_icon = QLabel("🕒")
        hist_label = QLabel("過去の履歴から切替:")
        hist_label.setProperty("class", "MutedLabel")
        history_row.addWidget(hist_icon)
        history_row.addWidget(hist_label)

        self.history_combo = QComboBox()
        self.history_combo.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        self.history_combo.currentIndexChanged.connect(self._on_history_preset_selected)
        history_row.addWidget(self.history_combo)

        header_layout.addLayout(history_row)

        # ---------------------------------------------------------
        # 対象フォルダ選択行
        # ---------------------------------------------------------
        folder_row = QHBoxLayout()
        folder_row.setSpacing(8)

        folder_icon = QLabel("📁")
        folder_label = QLabel("対象フォルダ:")
        folder_label.setProperty("class", "MutedLabel")
        folder_row.addWidget(folder_icon)
        folder_row.addWidget(folder_label)

        self.folder_path_edit = QLineEdit(self.target_dir)
        self.folder_path_edit.setReadOnly(True)
        folder_row.addWidget(self.folder_path_edit)

        btn_browse = QPushButton("フォルダ参照...")
        btn_browse.setProperty("class", "IconButton")
        btn_browse.clicked.connect(self.select_folder)
        folder_row.addWidget(btn_browse)

        btn_open_folder = QPushButton("📂 開く")
        btn_open_folder.setProperty("class", "IconButton")
        btn_open_folder.setToolTip("エクスプローラーでこのフォルダを開く")
        btn_open_folder.clicked.connect(self.open_in_explorer)
        folder_row.addWidget(btn_open_folder)

        header_layout.addLayout(folder_row)

        # ---------------------------------------------------------
        # リモートURL表示 & 変更行
        # ---------------------------------------------------------
        url_row = QHBoxLayout()
        url_row.setSpacing(8)

        url_icon = QLabel("🔗")
        url_label = QLabel("コミット先URL:")
        url_label.setProperty("class", "MutedLabel")
        url_row.addWidget(url_icon)
        url_row.addWidget(url_label)

        self.remote_url_edit = QLineEdit("未設定")
        self.remote_url_edit.setReadOnly(True)
        url_row.addWidget(self.remote_url_edit)

        btn_change_url = QPushButton("✏️ URL変更...")
        btn_change_url.setProperty("class", "IconButton")
        btn_change_url.clicked.connect(self.change_remote_url)
        url_row.addWidget(btn_change_url)

        self.btn_open_github = QPushButton("🌐 GitHub")
        self.btn_open_github.setProperty("class", "IconButton")
        self.btn_open_github.setToolTip("ブラウザでGitHubリポジトリを開く")
        self.btn_open_github.clicked.connect(self.open_in_browser)
        url_row.addWidget(self.btn_open_github)

        header_layout.addLayout(url_row)
        main_layout.addWidget(header_card)

        # =========================================================
        # 2. 変更ファイル一覧カード
        # =========================================================
        changes_card = QFrame()
        changes_card.setProperty("class", "CardFrame")
        changes_layout = QVBoxLayout(changes_card)
        changes_layout.setContentsMargins(16, 14, 16, 14)
        changes_layout.setSpacing(10)

        changes_top_row = QHBoxLayout()
        self.changes_title = QLabel("📝 未コミットの変更ファイル (0件)")
        self.changes_title.setProperty("class", "CardTitle")
        changes_top_row.addWidget(self.changes_title)

        changes_top_row.addStretch()

        btn_refresh = QPushButton("🔄 ステータス更新")
        btn_refresh.setProperty("class", "IconButton")
        btn_refresh.clicked.connect(self.refresh_status)
        changes_top_row.addWidget(btn_refresh)

        changes_layout.addLayout(changes_top_row)

        # ファイル一覧テーブル
        self.files_table = QTableWidget(0, 2)
        self.files_table.setHorizontalHeaderLabels(["状態", "ファイルパス"])
        self.files_table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeToContents)
        self.files_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.files_table.verticalHeader().setVisible(False)
        self.files_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.files_table.setMinimumHeight(110)
        self.files_table.setMaximumHeight(160)
        changes_layout.addWidget(self.files_table)

        main_layout.addWidget(changes_card)

        # =========================================================
        # 3. コミット & Push 実行カード
        # =========================================================
        commit_card = QFrame()
        commit_card.setProperty("class", "CardFrame")
        commit_layout = QVBoxLayout(commit_card)
        commit_layout.setContentsMargins(16, 14, 16, 14)
        commit_layout.setSpacing(10)

        commit_title = QLabel("🚀 コミット & Push")
        commit_title.setProperty("class", "CardTitle")
        commit_layout.addWidget(commit_title)

        # コミットメッセージ入力
        self.commit_msg_edit = QLineEdit()
        self.commit_msg_edit.setPlaceholderText(
            "コミットメッセージを入力 (空欄の場合は現在日時が自動適用されます)"
        )
        self.commit_msg_edit.returnPressed.connect(self.trigger_commit_push)
        commit_layout.addWidget(self.commit_msg_edit)

        # 定型文クイックサジェストボタン
        quick_tags_layout = QHBoxLayout()
        quick_tags_layout.setSpacing(6)
        quick_tags_layout.addWidget(QLabel("定型文挿入:"))

        tag_options = [
            ("🕒 現在日時", self._insert_timestamp_msg),
            ("✨ feat: 新機能", lambda: self._insert_prefix_msg("feat: ")),
            ("🐛 fix: バグ修正", lambda: self._insert_prefix_msg("fix: ")),
            ("📝 docs: ドキュメント", lambda: self._insert_prefix_msg("docs: ")),
            ("🎨 style: デザイン調整", lambda: self._insert_prefix_msg("style: ")),
            ("♻️ refactor: リファクタ", lambda: self._insert_prefix_msg("refactor: ")),
        ]
        for tag_text, tag_func in tag_options:
            btn_tag = QPushButton(tag_text)
            btn_tag.setProperty("class", "TagButton")
            btn_tag.clicked.connect(tag_func)
            quick_tags_layout.addWidget(btn_tag)

        quick_tags_layout.addStretch()
        commit_layout.addLayout(quick_tags_layout)

        # 空コミット許容チェックボックス
        self.allow_empty_check = QCheckBox("変更ファイルがない場合も空コミットで更新履歴を残す (--allow-empty)")
        self.allow_empty_check.setChecked(True)
        commit_layout.addWidget(self.allow_empty_check)

        # 実行ボタン
        self.btn_commit_push = QPushButton("🚀 今すぐコミット & Push 実行")
        self.btn_commit_push.setProperty("class", "PrimaryButton")
        self.btn_commit_push.setCursor(QCursor(Qt.PointingHandCursor))
        self.btn_commit_push.clicked.connect(self.trigger_commit_push)
        commit_layout.addWidget(self.btn_commit_push)

        main_layout.addWidget(commit_card)

        # =========================================================
        # 4. 自動同期 (定期バックアップ) カード
        # =========================================================
        auto_card = QFrame()
        auto_card.setProperty("class", "CardFrame")
        auto_layout = QVBoxLayout(auto_card)
        auto_layout.setContentsMargins(16, 14, 16, 14)
        auto_layout.setSpacing(10)

        auto_top_row = QHBoxLayout()
        auto_top_row.setSpacing(12)

        auto_icon_title = QLabel("⏱️ 自動同期 (定期監視バックアップ)")
        auto_icon_title.setProperty("class", "CardTitle")
        auto_top_row.addWidget(auto_icon_title)

        auto_top_row.addStretch()

        auto_top_row.addWidget(QLabel("監視間隔:"))
        self.interval_combo = QComboBox()
        self.interval_combo.addItems(["1分", "3分", "5分", "10分", "30分"])
        self.interval_combo.setCurrentText("5分")
        self.interval_combo.currentTextChanged.connect(self._on_interval_changed)
        auto_top_row.addWidget(self.interval_combo)

        self.btn_toggle_sync = QPushButton("▶ 自動同期を開始")
        self.btn_toggle_sync.setStyleSheet(
            "background-color: #065f46; color: #a7f3d0; font-weight: bold;"
        )
        self.btn_toggle_sync.clicked.connect(self.toggle_auto_sync)
        auto_top_row.addWidget(self.btn_toggle_sync)

        auto_layout.addLayout(auto_top_row)

        # カウントダウン & プログレスバー
        progress_row = QHBoxLayout()
        progress_row.setSpacing(10)

        self.countdown_label = QLabel("ステータス: 停止中 (手動コミットモード)")
        self.countdown_label.setProperty("class", "MutedLabel")
        progress_row.addWidget(self.countdown_label)

        progress_row.addStretch()

        self.sync_progress_bar = QProgressBar()
        self.sync_progress_bar.setRange(0, 100)
        self.sync_progress_bar.setValue(0)
        self.sync_progress_bar.setFixedWidth(160)
        progress_row.addWidget(self.sync_progress_bar)

        auto_layout.addLayout(progress_row)
        main_layout.addWidget(auto_card)

        # =========================================================
        # 5. リアルタイム実行ログ カード
        # =========================================================
        log_card = QFrame()
        log_card.setProperty("class", "CardFrame")
        log_layout = QVBoxLayout(log_card)
        log_layout.setContentsMargins(16, 14, 16, 14)
        log_layout.setSpacing(8)

        log_top_row = QHBoxLayout()
        log_title = QLabel("💻 実行ログ (Realtime Console)")
        log_title.setProperty("class", "CardTitle")
        log_top_row.addWidget(log_title)

        log_top_row.addStretch()

        self.auto_scroll_check = QCheckBox("自動スクロール")
        self.auto_scroll_check.setChecked(True)
        log_top_row.addWidget(self.auto_scroll_check)

        btn_copy_log = QPushButton("📋 コピー")
        btn_copy_log.setProperty("class", "IconButton")
        btn_copy_log.clicked.connect(self.copy_log_to_clipboard)
        log_top_row.addWidget(btn_copy_log)

        btn_clear_log = QPushButton("🧹 クリア")
        btn_clear_log.setProperty("class", "IconButton")
        btn_clear_log.clicked.connect(self.clear_log)
        log_top_row.addWidget(btn_clear_log)

        log_layout.addLayout(log_top_row)

        # ログコンソール
        self.log_console = QTextEdit()
        self.log_console.setProperty("class", "ConsoleEdit")
        self.log_console.setReadOnly(True)
        self.log_console.setMinimumHeight(150)
        log_layout.addWidget(self.log_console)

        main_layout.addWidget(log_card)

        main_scroll.setWidget(container)
        self.setCentralWidget(main_scroll)

        # 初期履歴の反映
        self.update_history_dropdown()

    def _setup_tray_icon(self):
        """タスクトレイアイコンの設定"""
        self.tray_icon = QSystemTrayIcon(self)
        pixmap = QPixmap(32, 32)
        pixmap.fill(Qt.transparent)
        painter = QPainter(pixmap)
        painter.setRenderHint(QPainter.Antialiasing)
        painter.setBrush(QColor("#6366f1"))
        painter.setPen(Qt.NoPen)
        painter.drawRoundedRect(2, 2, 28, 28, 6, 6)
        painter.setPen(QColor("#ffffff"))
        painter.setFont(QFont("Segoe UI", 14, QFont.Bold))
        painter.drawText(QRect(0, 0, 32, 32), Qt.AlignCenter, "G")
        painter.end()

        icon = QIcon(pixmap)
        self.setWindowIcon(icon)
        self.tray_icon.setIcon(icon)
        self.tray_icon.setToolTip("Git Auto Commit & Push Pro")

        tray_menu = QMenu()
        show_action = QAction("表示", self)
        show_action.triggered.connect(self.showNormal)
        tray_menu.addAction(show_action)

        sync_action = QAction("今すぐコミット & Push", self)
        sync_action.triggered.connect(self.trigger_commit_push)
        tray_menu.addAction(sync_action)

        tray_menu.addSeparator()
        quit_action = QAction("終了", self)
        quit_action.triggered.connect(QApplication.instance().quit)
        tray_menu.addAction(quit_action)

        self.tray_icon.setContextMenu(tray_menu)
        self.tray_icon.show()

    # =========================================================
    # ログ出力 & クリップボード
    # =========================================================
    @Slot(str, str)
    def log(self, message: str, level: str = "INFO"):
        now_str = datetime.datetime.now().strftime("%H:%M:%S")

        color_map = {
            "INFO": "#94a3b8",      # Slate
            "RUN": "#818cf8",       # Indigo
            "SUCCESS": "#34d399",   # Emerald
            "OK": "#34d399",
            "WARNING": "#fbbf24",   # Amber
            "ERROR": "#f87171",     # Rose
        }
        color = color_map.get(level.upper(), "#e2e8f0")
        tag_bg = {
            "INFO": "#1e293b",
            "RUN": "#1e1b4b",
            "SUCCESS": "#064e3b",
            "OK": "#064e3b",
            "WARNING": "#451a03",
            "ERROR": "#4c0519",
        }.get(level.upper(), "#1e293b")

        html = f"""
        <div style="margin: 2px 0;">
            <span style="color: #64748b; font-size: 11px;">[{now_str}]</span>
            <span style="background-color: {tag_bg}; color: {color}; font-weight: bold; padding: 1px 5px; border-radius: 3px; font-size: 10px;">{level.upper()}</span>
            <span style="color: {color}; margin-left: 4px;">{message}</span>
        </div>
        """
        self.log_console.append(html)

        if self.auto_scroll_check.isChecked():
            cursor = self.log_console.textCursor()
            cursor.movePosition(cursor.End)
            self.log_console.setTextCursor(cursor)

    def clear_log(self):
        self.log_console.clear()

    def copy_log_to_clipboard(self):
        text = self.log_console.toPlainText()
        QApplication.clipboard().setText(text)
        self.log("ログをクリップボードにコピーしました。", "INFO")

    # =========================================================
    # 履歴管理 & 自動補完
    # =========================================================
    def record_pair_history(self, directory, url):
        if not directory:
            return
        norm_dir = os.path.abspath(directory)
        if "dir_to_url" not in self.history:
            self.history["dir_to_url"] = {}
        if "url_to_dir" not in self.history:
            self.history["url_to_dir"] = {}

        if url and url != "未設定":
            self.history["dir_to_url"][norm_dir] = url
            self.history["url_to_dir"][url] = norm_dir

        save_history(self.history)
        self.update_history_dropdown()

    def update_history_dropdown(self):
        self.history_combo.blockSignals(True)
        self.history_combo.clear()

        dir_to_url = self.history.get("dir_to_url", {})
        self.history_combo.addItem("選択してください (過去のプロジェクト一覧)...", "")

        current_idx = 0
        idx = 1
        for d, u in dir_to_url.items():
            folder_name = os.path.basename(d) or d
            repo_name = u.split("/")[-1].replace(".git", "") if u else "未設定"
            display_text = f"📁 {folder_name}  ➔  🔗 {repo_name}  ({d})"
            self.history_combo.addItem(display_text, d)

            if os.path.normpath(d) == os.path.normpath(self.target_dir):
                current_idx = idx
            idx += 1

        self.history_combo.setCurrentIndex(current_idx)
        self.history_combo.blockSignals(False)

    def _on_history_preset_selected(self, index):
        selected_path = self.history_combo.itemData(index)
        if not selected_path:
            return

        if not os.path.exists(selected_path):
            self.log(f"エラー: 選択されたフォルダが存在しません: {selected_path}", "ERROR")
            return

        self.target_dir = os.path.abspath(selected_path)
        self.folder_path_edit.setText(self.target_dir)
        self.log(f"過去の履歴からプロジェクトを選択しました: {self.target_dir}", "INFO")

        # 保存されていたURLがあれば取得してリモートに自動適用
        saved_url = self.history.get("dir_to_url", {}).get(self.target_dir)
        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=self.target_dir)
        if is_git and saved_url:
            ok_curr, curr_url, _ = run_git_command(["remote", "get-url", "origin"], cwd=self.target_dir)
            if not ok_curr:
                run_git_command(["remote", "add", "origin", saved_url], cwd=self.target_dir)
                self.log(f"✨ 履歴からリモートURL ({saved_url}) を登録しました！", "SUCCESS")
            elif curr_url != saved_url:
                run_git_command(["remote", "set-url", "origin", saved_url], cwd=self.target_dir)
                self.log(f"✨ 履歴からリモートURL ({saved_url}) を自動変更適用しました！", "SUCCESS")

        self.refresh_status()

    # =========================================================
    # フォルダ選択 & URL変更 & 外部リンク
    # =========================================================
    def select_folder(self):
        chosen = QFileDialog.getExistingDirectory(
            self,
            "コミット対象フォルダの選択",
            self.target_dir,
            QFileDialog.ShowDirsOnly | QFileDialog.DontResolveSymlinks,
        )
        if chosen:
            self.target_dir = os.path.abspath(chosen)
            self.folder_path_edit.setText(self.target_dir)
            self.log(f"操作対象フォルダを変更しました: {self.target_dir}", "INFO")

            # 履歴に登録済みのURLがあれば補完
            saved_url = self.history.get("dir_to_url", {}).get(self.target_dir)
            if saved_url:
                self.log(f"💡 このフォルダに紐づくGitHub URL ({saved_url}) が見つかりました。", "INFO")

            self.refresh_status()

    def open_in_explorer(self):
        if os.path.exists(self.target_dir):
            if sys.platform == "win32":
                os.startfile(self.target_dir)
            else:
                QDesktopServices.openUrl(QUrl.fromLocalFile(self.target_dir))
        else:
            QMessageBox.warning(self, "警告", f"フォルダが存在しません:\n{self.target_dir}")

    def open_in_browser(self):
        url = self.remote_url
        if url and url.startswith("http"):
            QDesktopServices.openUrl(QUrl(url))
        elif url and url.startswith("git@github.com:"):
            # SSH URLをHTTPS URLに変換
            https_url = "https://github.com/" + url.replace("git@github.com:", "").replace(".git", "")
            QDesktopServices.openUrl(QUrl(https_url))
        else:
            QMessageBox.information(self, "案内", "有効なGitHub URLが設定されていません。")

    def change_remote_url(self):
        if not self.ensure_git_repo():
            return

        current_val = self.remote_url if self.remote_url != "未設定" else "https://github.com/"
        
        # モダンダイアログ
        dialog = QDialog(self)
        dialog.setWindowTitle("コミット先URLの変更")
        dialog.setMinimumWidth(480)
        d_layout = QVBoxLayout(dialog)
        d_layout.setSpacing(12)

        lbl = QLabel("新しいGitHubリポジトリURL (HTTPS または SSH):")
        lbl.setProperty("class", "MutedLabel")
        d_layout.addWidget(lbl)

        url_input = QLineEdit(current_val)
        url_input.selectAll()
        d_layout.addWidget(url_input)

        bbox = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        bbox.button(QDialogButtonBox.Ok).setText("保存")
        bbox.button(QDialogButtonBox.Cancel).setText("キャンセル")
        bbox.accepted.connect(dialog.accept)
        bbox.rejected.connect(dialog.reject)
        d_layout.addWidget(bbox)

        if dialog.exec() == QDialog.Accepted:
            new_url = url_input.text().strip()
            if new_url:
                curr_dir = self.target_dir
                ok_check, _, _ = run_git_command(["remote", "get-url", "origin"], cwd=curr_dir)
                if ok_check:
                    ok, _, err = run_git_command(["remote", "set-url", "origin", new_url], cwd=curr_dir)
                else:
                    ok, _, err = run_git_command(["remote", "add", "origin", new_url], cwd=curr_dir)

                if ok:
                    self.log(f"コミット先URLを変更しました: {new_url}", "SUCCESS")
                    self.record_pair_history(curr_dir, new_url)
                    self.refresh_status()
                else:
                    self.log(f"URL変更失敗: {err}", "ERROR")
                    QMessageBox.critical(self, "エラー", f"URL変更に失敗しました:\n{err}")

    def ensure_git_repo(self):
        """Gitリポジトリでない場合、git init の実行確認ダイアログを表示"""
        curr_dir = self.target_dir
        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=curr_dir)
        if not is_git:
            res = QMessageBox.question(
                self,
                "Gitリポジトリ初期化の確認",
                f"選択されたフォルダはまだGit管理されていません。\n\n対象フォルダ:\n{curr_dir}\n\nこのフォルダで 'git init' を実行してGitリポジトリを作成しますか？",
                QMessageBox.Yes | QMessageBox.No,
                QMessageBox.Yes,
            )
            if res == QMessageBox.Yes:
                ok, _, err = run_git_command(["init"], cwd=curr_dir)
                if ok:
                    run_git_command(["branch", "-M", "main"], cwd=curr_dir)
                    self.log(f"Gitリポジトリを初期化しました (git init): {curr_dir}", "SUCCESS")
                    self.refresh_status()
                    return True
                else:
                    self.log(f"Git初期化失敗: {err}", "ERROR")
                    QMessageBox.critical(self, "エラー", f"Git初期化に失敗しました:\n{err}")
                    return False
            return False
        return True

    # =========================================================
    # ステータス更新 & Git情報取得
    # =========================================================
    def refresh_status(self):
        self.folder_path_edit.setText(self.target_dir)

        # ワーカースレッドでステータス取得
        self.worker = GitWorker("status", self.target_dir)
        self.worker.log_signal.connect(self.log)
        self.worker.status_updated_signal.connect(self._on_status_updated)
        self.worker.start()

    @Slot(dict)
    def _on_status_updated(self, data):
        self.is_git_repo = data.get("is_git", False)
        self.current_branch = data.get("branch", "main")
        self.remote_url = data.get("remote_url", "未設定")
        files = data.get("files", [])

        if not self.is_git_repo:
            self.status_pill.setText("⚠️ Git未初期化")
            self.status_pill.setStyleSheet(
                "background-color: #7f1d1d; color: #fca5a5; border: 1px solid #dc2626;"
            )
            self.branch_badge.setText("branch: 未初期化")
            self.branch_badge.setStyleSheet(
                "background-color: #450a0a; color: #fca5a5; border: 1px solid #7f1d1d;"
            )

            # 履歴に保存済みのURLがあれば表示
            saved_url = self.history.get("dir_to_url", {}).get(self.target_dir)
            if saved_url:
                self.remote_url_edit.setText(f"{saved_url} (保存済み・Git未初期化)")
                self.remote_url = saved_url
            else:
                self.remote_url_edit.setText("未設定 (Git初期化後に設定可能)")

            self.changes_title.setText("📝 未コミットの変更ファイル (Git未初期化)")
            self.files_table.setRowCount(1)
            item_status = QTableWidgetItem("⚠️")
            item_status.setTextAlignment(Qt.AlignCenter)
            item_path = QTableWidgetItem("Gitリポジトリではありません。[Push実行] 時に自動初期化できます。")
            item_path.setForeground(QColor("#fca5a5"))
            self.files_table.setItem(0, 0, item_status)
            self.files_table.setItem(0, 1, item_path)
            return

        # Gitリポジトリの場合
        self.branch_badge.setText(f"🌿 {self.current_branch}")
        self.branch_badge.setStyleSheet(
            "background-color: #1e1b4b; color: #a5b4fc; border: 1px solid #4338ca;"
        )

        if self.is_auto_sync_active:
            self.status_pill.setText("⚡ 自動同期中")
            self.status_pill.setStyleSheet(
                "background-color: #064e3b; color: #34d399; border: 1px solid #059669;"
            )
        else:
            self.status_pill.setText("● 準備完了")
            self.status_pill.setStyleSheet(
                "background-color: #1e293b; color: #94a3b8; border: 1px solid #334155;"
            )

        # リモートURLの自動適用
        if self.remote_url != "未設定":
            self.remote_url_edit.setText(self.remote_url)
            self.record_pair_history(self.target_dir, self.remote_url)
        else:
            saved_url = self.history.get("dir_to_url", {}).get(self.target_dir)
            if saved_url:
                run_git_command(["remote", "add", "origin", saved_url], cwd=self.target_dir)
                self.remote_url = saved_url
                self.remote_url_edit.setText(f"{saved_url} (履歴から自動適用)")
                self.log(f"✨ 保存されていたURL ({saved_url}) をリモートoriginに自動適用しました！", "SUCCESS")
            else:
                self.remote_url_edit.setText("未設定 (右の「URL変更」から設定可能)")

        # ファイル一覧テーブルの更新
        num_changes = len(files)
        if num_changes > 0:
            self.changes_title.setText(f"📝 未コミットの変更ファイル ({num_changes}件)")
            self.files_table.setRowCount(num_changes)

            for row, f in enumerate(files):
                code = f["code"]
                path = f["path"]

                # バッジ色設定
                badge_bg = "#334155"
                badge_fg = "#ffffff"
                if "M" in code:
                    badge_bg = "#78350f"
                    badge_fg = "#fcd34d"
                elif "A" in code or "?" in code:
                    badge_bg = "#064e3b"
                    badge_fg = "#6ee7b7"
                elif "D" in code:
                    badge_bg = "#7f1d1d"
                    badge_fg = "#fca5a5"

                item_code = QTableWidgetItem(code)
                item_code.setTextAlignment(Qt.AlignCenter)
                item_code.setBackground(QColor(badge_bg))
                item_code.setForeground(QColor(badge_fg))

                item_path = QTableWidgetItem(path)
                item_path.setFont(QFont("Consolas", 10))

                self.files_table.setItem(row, 0, item_code)
                self.files_table.setItem(row, 1, item_path)
        else:
            self.changes_title.setText("📝 未コミットの変更ファイル (0件 - クリーン)")
            self.files_table.setRowCount(1)
            item_status = QTableWidgetItem("✓")
            item_status.setTextAlignment(Qt.AlignCenter)
            item_status.setForeground(QColor("#34d399"))
            item_path = QTableWidgetItem("変更されたファイルはありません (Working tree clean)")
            item_path.setForeground(QColor("#6ee7b7"))
            self.files_table.setItem(0, 0, item_status)
            self.files_table.setItem(0, 1, item_path)

        self.update_history_dropdown()

    # =========================================================
    # コミット & Push 実行処理
    # =========================================================
    def _insert_timestamp_msg(self):
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.commit_msg_edit.setText(f"Auto commit: {now_str}")

    def _insert_prefix_msg(self, prefix):
        curr = self.commit_msg_edit.text()
        if not curr.startswith(prefix):
            self.commit_msg_edit.setText(prefix + curr)
        self.commit_msg_edit.setFocus()

    def trigger_commit_push(self):
        if self.is_committing:
            return

        if not self.ensure_git_repo():
            return

        msg = self.commit_msg_edit.text().strip()
        allow_empty = self.allow_empty_check.isChecked()

        # UIロック & ローディング状態
        self.is_committing = True
        self.btn_commit_push.setEnabled(False)
        self.btn_commit_push.setText("⏳ Git処理中 (コミット & Push)...")
        self.status_pill.setText("⏳ 処理中...")
        self.status_pill.setStyleSheet(
            "background-color: #1e1b4b; color: #818cf8; border: 1px solid #4338ca;"
        )

        self.commit_worker = GitWorker(
            "commit_push",
            self.target_dir,
            message=msg,
            allow_empty=allow_empty,
            branch=self.current_branch,
        )
        self.commit_worker.log_signal.connect(self.log)
        self.commit_worker.finished_signal.connect(self._on_commit_push_finished)
        self.commit_worker.start()

    @Slot(bool, str)
    def _on_commit_push_finished(self, success, result_msg):
        self.is_committing = False
        self.btn_commit_push.setEnabled(True)
        self.btn_commit_push.setText("🚀 今すぐコミット & Push 実行")

        if success:
            self.commit_msg_edit.clear()
            self.record_pair_history(self.target_dir, self.remote_url)
            self.tray_icon.showMessage(
                "Git Auto Commit & Push",
                "GitHubへのコミット & Push が完了しました！",
                QSystemTrayIcon.Information,
                3000,
            )
        else:
            self.tray_icon.showMessage(
                "Git Auto Commit & Push エラー",
                f"Push処理に失敗しました: {result_msg}",
                QSystemTrayIcon.Warning,
                4000,
            )

        self.refresh_status()

    # =========================================================
    # 自動同期 (監視モード) タイマー管理
    # =========================================================
    def _on_interval_changed(self, text):
        minutes = int(text.replace("分", ""))
        self.sync_interval_sec = minutes * 60
        self.seconds_remaining = self.sync_interval_sec
        if self.is_auto_sync_active:
            self.log(f"監視間隔を {text} に変更しました。", "INFO")

    def toggle_auto_sync(self):
        if not self.ensure_git_repo():
            return

        if self.is_auto_sync_active:
            # 停止
            self.is_auto_sync_active = False
            self.auto_sync_timer.stop()
            self.btn_toggle_sync.setText("▶ 自動同期を開始")
            self.btn_toggle_sync.setStyleSheet(
                "background-color: #065f46; color: #a7f3d0; font-weight: bold;"
            )
            self.countdown_label.setText("ステータス: 停止中 (手動コミットモード)")
            self.sync_progress_bar.setValue(0)
            self.status_pill.setText("● 準備完了")
            self.status_pill.setStyleSheet(
                "background-color: #1e293b; color: #94a3b8; border: 1px solid #334155;"
            )
            self.log("自動同期（監視モード）を停止しました。", "INFO")
        else:
            # 開始
            self.is_auto_sync_active = True
            interval_str = self.interval_combo.currentText()
            minutes = int(interval_str.replace("分", ""))
            self.sync_interval_sec = minutes * 60
            self.seconds_remaining = self.sync_interval_sec

            self.auto_sync_timer.start(1000)  # 1秒ごとにティック
            self.btn_toggle_sync.setText("⏹ 自動同期を停止")
            self.btn_toggle_sync.setStyleSheet(
                "background-color: #991b1b; color: #fecaca; font-weight: bold;"
            )
            self.status_pill.setText("⚡ 自動同期中")
            self.status_pill.setStyleSheet(
                "background-color: #064e3b; color: #34d399; border: 1px solid #059669;"
            )
            self.log(
                f"自動同期（監視モード）を開始しました (対象: {self.target_dir}, 間隔: {interval_str})",
                "INFO",
            )

    def _on_timer_tick(self):
        if not self.is_auto_sync_active:
            return

        self.seconds_remaining -= 1

        if self.seconds_remaining <= 0:
            self.seconds_remaining = self.sync_interval_sec
            if not self.is_committing:
                self.log("⏰ 定期自動同期トリガーを実行します...", "INFO")
                self.trigger_commit_push()

        # カウントダウン表示更新
        mins, secs = divmod(self.seconds_remaining, 60)
        self.countdown_label.setText(
            f"稼働中 (間隔: {self.interval_combo.currentText()})  次回実行まで: {mins:02d}:{secs:02d}"
        )

        elapsed = self.sync_interval_sec - self.seconds_remaining
        pct = int((elapsed / self.sync_interval_sec) * 100)
        self.sync_progress_bar.setValue(pct)


# =====================================================================
# エントリーポイント
# =====================================================================
def main():
    # 高DPIスケーリング設定
    if hasattr(Qt, "HighDpiScaleFactorRoundingPolicy"):
        QApplication.setHighDpiScaleFactorRoundingPolicy(
            Qt.HighDpiScaleFactorRoundingPolicy.PassThrough
        )

    app = QApplication(sys.argv)
    app.setStyleSheet(MODERN_DARK_STYLE)

    initial_dir = sys.argv[1] if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]) else os.getcwd()
    window = GitAutoCommitWindow(initial_dir)
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
