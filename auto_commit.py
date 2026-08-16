#!/usr/bin/env python3
"""
Git Auto Commit & Push Pro (PySide6 Modern Desktop Edition)
洗練されたモダンUIと直感的な操作性を備えたGit自動化ツール
"""

import datetime
import json
import os
import subprocess
import sys

from PySide6.QtCore import (
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
    QPainter,
    QPalette,
    QPen,
    QPixmap,
    QTextCursor,
)
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QDialog,
    QDialogButtonBox,
    QFileDialog,
    QFrame,
    QHBoxLayout,
    QHeaderView,
    QLabel,
    QLineEdit,
    QMainWindow,
    QMenu,
    QMessageBox,
    QProgressBar,
    QPushButton,
    QScrollArea,
    QSizePolicy,
    QSystemTrayIcon,
    QTableWidget,
    QTableWidgetItem,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

# 履歴設定ファイルのパス
HISTORY_FILE = os.path.expanduser("~/.git_auto_commit_history.json")


# =====================================================================
# Git コマンド実行エンジン & 履歴管理
# =====================================================================
def run_git_command(args, cwd=None):
    """Gitコマンドを指定したディレクトリで実行"""
    target_cwd = cwd or os.getcwd()
    try:
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
    """履歴データの読み込み"""
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
    log_signal = Signal(str, str)
    status_updated_signal = Signal(dict)
    finished_signal = Signal(bool, str)

    def __init__(self, action_type, target_dir, **kwargs):
        super().__init__()
        self.action_type = action_type
        self.target_dir = target_dir
        self.kwargs = kwargs

    def run(self):
        if self.action_type == "status":
            self._do_status()
        elif self.action_type == "commit_push":
            self._do_commit_push()

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
                    self.log_signal.emit("変更ファイルがないためコミットをスキップしました。", "INFO")
                    self.finished_signal.emit(True, "変更なし (スキップ)")
                    return

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
                ok_push, out_push, err_push = run_git_command(["push", "-u", "origin", branch], cwd=curr_dir)

            # fetch first エラー時の自動 pull
            if not ok_push and ("fetch first" in err_push or "rejected" in err_push):
                self.log_signal.emit("リモートと自動統合中 (pull --allow-unrelated-histories)...", "WARNING")
                ok_pull, _, err_pull = run_git_command(
                    ["pull", "origin", branch, "--allow-unrelated-histories", "--no-edit"],
                    cwd=curr_dir,
                )
                if ok_pull:
                    self.log_signal.emit("自動マージ成功。再Pushを実行中...", "RUN")
                    ok_push, out_push, err_push = run_git_command(["push", "origin", branch], cwd=curr_dir)
                else:
                    self.log_signal.emit(f"自動マージ失敗: {err_pull}", "ERROR")

            if ok_push:
                self.log_signal.emit("GitHubへの Push が正常に完了しました。", "SUCCESS")
                self.finished_signal.emit(True, "Push 成功")
            else:
                self.log_signal.emit(f"Push 失敗: {err_push}", "ERROR")
                self.finished_signal.emit(False, f"Push 失敗: {err_push}")

        except Exception as ex:
            self.log_signal.emit(f"エラー: {ex}", "ERROR")
            self.finished_signal.emit(False, str(ex))


# =====================================================================
# プロフェッショナル・モダン QSS スタイルシート (絵文字排除・洗練されたデザイン)
# =====================================================================
MODERN_STYLE = """
/* 基本ウィンドウ設定 */
QWidget {
    background-color: #0f172a;
    color: #f8fafc;
    font-family: "Segoe UI", "Yu Gothic UI", "Meiryo", -apple-system, sans-serif;
    font-size: 12px;
    selection-background-color: #4f46e5;
    selection-color: #ffffff;
}

QMainWindow {
    background-color: #0f172a;
}

/* カードコンテナ */
QFrame.CardFrame {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
}

/* ラベル類 */
QLabel.HeaderTitle {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.3px;
}

QLabel.CardTitle {
    font-size: 13px;
    font-weight: 600;
    color: #cbd5e1;
}

QLabel.MutedLabel {
    color: #94a3b8;
    font-size: 12px;
    font-weight: 500;
}

QLabel.Badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
}

/* 入力ボックス */
QLineEdit {
    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 6px 10px;
    color: #f8fafc;
    font-size: 12px;
}

QLineEdit:focus {
    border: 1px solid #6366f1;
    background-color: #0b1120;
}

QLineEdit:disabled {
    background-color: #1e293b;
    color: #64748b;
}

/* ドロップダウン (QComboBox) */
QComboBox {
    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 5px 10px;
    color: #f8fafc;
    font-size: 12px;
    min-height: 18px;
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
    width: 24px;
    border-left: none;
}

QComboBox::down-arrow {
    image: none;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #94a3b8;
    margin-right: 6px;
}

QComboBox QAbstractItemView {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #f8fafc;
    selection-background-color: #4f46e5;
    selection-color: #ffffff;
    padding: 4px;
    outline: none;
}

/* ボタンスタイル */
QPushButton {
    background-color: #334155;
    color: #f8fafc;
    border: 1px solid #475569;
    border-radius: 6px;
    padding: 6px 12px;
    font-weight: 600;
    font-size: 12px;
}

QPushButton:hover {
    background-color: #475569;
    border-color: #64748b;
}

QPushButton:pressed {
    background-color: #1e293b;
}

QPushButton:disabled {
    background-color: #1e293b;
    color: #475569;
    border-color: #1e293b;
}

/* アクションボタン (Primary) */
QPushButton.PrimaryButton {
    background-color: #4f46e5;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 9px 16px;
    font-size: 13px;
    font-weight: 600;
}

QPushButton.PrimaryButton:hover {
    background-color: #6366f1;
}

QPushButton.PrimaryButton:pressed {
    background-color: #4338ca;
}

QPushButton.PrimaryButton:disabled {
    background-color: #334155;
    color: #64748b;
}

/* サブアクション / クイックタグ */
QPushButton.TagButton {
    background-color: #0f172a;
    color: #94a3b8;
    border: 1px solid #334155;
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 500;
}

QPushButton.TagButton:hover {
    background-color: #1e293b;
    color: #e2e8f0;
    border-color: #6366f1;
}

QPushButton.IconButton {
    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 500;
    color: #cbd5e1;
}

QPushButton.IconButton:hover {
    background-color: #1e293b;
    border-color: #475569;
    color: #ffffff;
}

/* テーブル */
QTableWidget {
    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 6px;
    gridline-color: #1e293b;
    color: #f1f5f9;
    font-size: 12px;
}

QTableWidget::item {
    padding: 4px 6px;
    border-bottom: 1px solid #1e293b;
}

QHeaderView::section {
    background-color: #1e293b;
    color: #94a3b8;
    padding: 4px 6px;
    border: none;
    border-bottom: 1px solid #334155;
    font-weight: 600;
    font-size: 11px;
}

/* ログコンソール */
QTextEdit.ConsoleEdit {
    background-color: #020617;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #e2e8f0;
    font-family: "Consolas", "Cascadia Code", monospace;
    font-size: 11px;
    line-height: 1.35;
    padding: 6px;
}

/* チェックボックス */
QCheckBox {
    color: #cbd5e1;
    font-size: 12px;
    spacing: 6px;
}

QCheckBox::indicator {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #475569;
    background-color: #0f172a;
}

QCheckBox::indicator:checked {
    background-color: #4f46e5;
    border-color: #6366f1;
}

/* プログレスバー */
QProgressBar {
    border: 1px solid #334155;
    border-radius: 3px;
    background-color: #0f172a;
    text-align: center;
    color: transparent;
    height: 4px;
}

QProgressBar::chunk {
    background-color: #10b981;
    border-radius: 2px;
}

/* スクロールバー */
QScrollBar:vertical {
    background: transparent;
    width: 8px;
    margin: 0px;
}

QScrollBar::handle:vertical {
    background: #334155;
    min-height: 20px;
    border-radius: 4px;
}

QScrollBar::handle:vertical:hover {
    background: #475569;
}

QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
    height: 0px;
}
"""


# =====================================================================
# メインウィンドウ
# =====================================================================
class GitAutoCommitWindow(QMainWindow):
    def __init__(self, initial_dir=None):
        super().__init__()
        self.setWindowTitle("Git Auto Commit & Push")
        
        # コンパクトかつ扱いやすいサイズ
        self.setMinimumSize(640, 580)
        self.resize(700, 680)

        # 履歴ロード
        self.history = load_history()

        # 状態
        self.target_dir = os.path.abspath(initial_dir or os.getcwd())
        self.current_branch = "main"
        self.remote_url = "未設定"
        self.is_git_repo = False
        self.is_committing = False
        self.is_auto_sync_active = False

        # 自動同期タイマー
        self.sync_interval_sec = 300
        self.seconds_remaining = 300
        self.auto_sync_timer = QTimer(self)
        self.auto_sync_timer.timeout.connect(self._on_timer_tick)

        self._init_ui()
        self._setup_tray_icon()
        self.refresh_status()

    def _init_ui(self):
        main_scroll = QScrollArea()
        main_scroll.setWidgetResizable(True)
        main_scroll.setFrameShape(QFrame.NoFrame)
        main_scroll.setStyleSheet("background-color: #0f172a;")

        container = QWidget()
        main_layout = QVBoxLayout(container)
        main_layout.setContentsMargins(12, 12, 12, 12)
        main_layout.setSpacing(10)

        # =========================================================
        # 1. ヘッダー (タイトル・状態・履歴・対象・URL)
        # =========================================================
        header_card = QFrame()
        header_card.setProperty("class", "CardFrame")
        header_layout = QVBoxLayout(header_card)
        header_layout.setContentsMargins(12, 10, 12, 10)
        header_layout.setSpacing(8)

        # トップ行
        top_row = QHBoxLayout()
        top_row.setSpacing(8)

        title_label = QLabel("Git Auto Commit & Push")
        title_label.setProperty("class", "HeaderTitle")
        top_row.addWidget(title_label)

        top_row.addStretch()

        self.status_pill = QLabel("● 準備完了")
        self.status_pill.setProperty("class", "Badge")
        self.status_pill.setStyleSheet(
            "background-color: #064e3b; color: #34d399; border: 1px solid #059669;"
        )
        top_row.addWidget(self.status_pill)

        self.branch_badge = QLabel("branch: main")
        self.branch_badge.setProperty("class", "Badge")
        self.branch_badge.setStyleSheet(
            "background-color: #1e1b4b; color: #a5b4fc; border: 1px solid #4338ca;"
        )
        top_row.addWidget(self.branch_badge)

        header_layout.addLayout(top_row)

        # 履歴選択
        hist_row = QHBoxLayout()
        hist_row.setSpacing(6)
        lbl_hist = QLabel("履歴プリセット:")
        lbl_hist.setProperty("class", "MutedLabel")
        hist_row.addWidget(lbl_hist)

        self.history_combo = QComboBox()
        self.history_combo.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        self.history_combo.currentIndexChanged.connect(self._on_history_preset_selected)
        hist_row.addWidget(self.history_combo)
        header_layout.addLayout(hist_row)

        # フォルダ行
        folder_row = QHBoxLayout()
        folder_row.setSpacing(6)
        lbl_folder = QLabel("対象フォルダ:")
        lbl_folder.setProperty("class", "MutedLabel")
        lbl_folder.setFixedWidth(80)
        folder_row.addWidget(lbl_folder)

        self.folder_path_edit = QLineEdit(self.target_dir)
        self.folder_path_edit.setReadOnly(True)
        folder_row.addWidget(self.folder_path_edit)

        btn_browse = QPushButton("参照...")
        btn_browse.setProperty("class", "IconButton")
        btn_browse.clicked.connect(self.select_folder)
        folder_row.addWidget(btn_browse)

        btn_open_folder = QPushButton("エクスプローラー")
        btn_open_folder.setProperty("class", "IconButton")
        btn_open_folder.clicked.connect(self.open_in_explorer)
        folder_row.addWidget(btn_open_folder)
        header_layout.addLayout(folder_row)

        # リモートURL行
        url_row = QHBoxLayout()
        url_row.setSpacing(6)
        lbl_url = QLabel("リモートURL:")
        lbl_url.setProperty("class", "MutedLabel")
        lbl_url.setFixedWidth(80)
        url_row.addWidget(lbl_url)

        self.remote_url_edit = QLineEdit("未設定")
        self.remote_url_edit.setReadOnly(True)
        url_row.addWidget(self.remote_url_edit)

        btn_change_url = QPushButton("URL変更...")
        btn_change_url.setProperty("class", "IconButton")
        btn_change_url.clicked.connect(self.change_remote_url)
        url_row.addWidget(btn_change_url)

        btn_github = QPushButton("GitHubを開く")
        btn_github.setProperty("class", "IconButton")
        btn_github.clicked.connect(self.open_in_browser)
        url_row.addWidget(btn_github)
        header_layout.addLayout(url_row)

        main_layout.addWidget(header_card)

        # =========================================================
        # 2. 変更ファイル一覧
        # =========================================================
        changes_card = QFrame()
        changes_card.setProperty("class", "CardFrame")
        changes_layout = QVBoxLayout(changes_card)
        changes_layout.setContentsMargins(12, 10, 12, 10)
        changes_layout.setSpacing(6)

        changes_top = QHBoxLayout()
        self.changes_title = QLabel("変更ファイル一覧 (0件)")
        self.changes_title.setProperty("class", "CardTitle")
        changes_top.addWidget(self.changes_title)

        changes_top.addStretch()

        btn_refresh = QPushButton("更新")
        btn_refresh.setProperty("class", "IconButton")
        btn_refresh.clicked.connect(self.refresh_status)
        changes_top.addWidget(btn_refresh)
        changes_layout.addLayout(changes_top)

        self.files_table = QTableWidget(0, 2)
        self.files_table.setHorizontalHeaderLabels(["状態", "ファイルパス"])
        self.files_table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeToContents)
        self.files_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.files_table.verticalHeader().setVisible(False)
        self.files_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.files_table.setMinimumHeight(75)
        self.files_table.setMaximumHeight(110)
        changes_layout.addWidget(self.files_table)

        main_layout.addWidget(changes_card)

        # =========================================================
        # 3. コミット & Push
        # =========================================================
        commit_card = QFrame()
        commit_card.setProperty("class", "CardFrame")
        commit_layout = QVBoxLayout(commit_card)
        commit_layout.setContentsMargins(12, 10, 12, 10)
        commit_layout.setSpacing(8)

        commit_title = QLabel("コミット & Push")
        commit_title.setProperty("class", "CardTitle")
        commit_layout.addWidget(commit_title)

        self.commit_msg_edit = QLineEdit()
        self.commit_msg_edit.setPlaceholderText("コミットメッセージ (空欄時は自動で現在日時が適用されます)")
        self.commit_msg_edit.returnPressed.connect(self.trigger_commit_push)
        commit_layout.addWidget(self.commit_msg_edit)

        # 定型タグ
        tags_layout = QHBoxLayout()
        tags_layout.setSpacing(4)
        lbl_tag = QLabel("定型入力:")
        lbl_tag.setProperty("class", "MutedLabel")
        tags_layout.addWidget(lbl_tag)

        tag_list = [
            ("現在日時", self._insert_timestamp_msg),
            ("feat:", lambda: self._insert_prefix_msg("feat: ")),
            ("fix:", lambda: self._insert_prefix_msg("fix: ")),
            ("docs:", lambda: self._insert_prefix_msg("docs: ")),
            ("style:", lambda: self._insert_prefix_msg("style: ")),
            ("refactor:", lambda: self._insert_prefix_msg("refactor: ")),
        ]
        for name, fn in tag_list:
            btn = QPushButton(name)
            btn.setProperty("class", "TagButton")
            btn.clicked.connect(fn)
            tags_layout.addWidget(btn)

        tags_layout.addStretch()
        commit_layout.addLayout(tags_layout)

        # 実行ボタン & 空コミット許容
        action_row = QHBoxLayout()
        action_row.setSpacing(10)

        self.allow_empty_check = QCheckBox("変更なしでもコミット履歴を残す")
        self.allow_empty_check.setChecked(True)
        action_row.addWidget(self.allow_empty_check)

        action_row.addStretch()

        self.btn_commit_push = QPushButton("コミット & Push 実行")
        self.btn_commit_push.setProperty("class", "PrimaryButton")
        self.btn_commit_push.setCursor(QCursor(Qt.PointingHandCursor))
        self.btn_commit_push.clicked.connect(self.trigger_commit_push)
        action_row.addWidget(self.btn_commit_push)

        commit_layout.addLayout(action_row)
        main_layout.addWidget(commit_card)

        # =========================================================
        # 4. 定期自動同期
        # =========================================================
        auto_card = QFrame()
        auto_card.setProperty("class", "CardFrame")
        auto_layout = QVBoxLayout(auto_card)
        auto_layout.setContentsMargins(12, 10, 12, 10)
        auto_layout.setSpacing(6)

        auto_top = QHBoxLayout()
        auto_title = QLabel("定期自動同期")
        auto_title.setProperty("class", "CardTitle")
        auto_top.addWidget(auto_title)

        auto_top.addStretch()

        lbl_int = QLabel("間隔:")
        lbl_int.setProperty("class", "MutedLabel")
        auto_top.addWidget(lbl_int)

        self.interval_combo = QComboBox()
        self.interval_combo.addItems(["1分", "3分", "5分", "10分", "30分"])
        self.interval_combo.setCurrentText("5分")
        self.interval_combo.currentTextChanged.connect(self._on_interval_changed)
        auto_top.addWidget(self.interval_combo)

        self.btn_toggle_sync = QPushButton("自動同期を開始")
        self.btn_toggle_sync.setStyleSheet(
            "background-color: #065f46; color: #a7f3d0; font-weight: 600;"
        )
        self.btn_toggle_sync.clicked.connect(self.toggle_auto_sync)
        auto_top.addWidget(self.btn_toggle_sync)
        auto_layout.addLayout(auto_top)

        prog_row = QHBoxLayout()
        self.countdown_label = QLabel("状態: 停止中 (手動モード)")
        self.countdown_label.setProperty("class", "MutedLabel")
        prog_row.addWidget(self.countdown_label)

        prog_row.addStretch()

        self.sync_progress_bar = QProgressBar()
        self.sync_progress_bar.setRange(0, 100)
        self.sync_progress_bar.setValue(0)
        self.sync_progress_bar.setFixedWidth(130)
        prog_row.addWidget(self.sync_progress_bar)
        auto_layout.addLayout(prog_row)

        main_layout.addWidget(auto_card)

        # =========================================================
        # 5. 実行ログ
        # =========================================================
        log_card = QFrame()
        log_card.setProperty("class", "CardFrame")
        log_layout = QVBoxLayout(log_card)
        log_layout.setContentsMargins(12, 10, 12, 10)
        log_layout.setSpacing(6)

        log_top = QHBoxLayout()
        log_title = QLabel("実行ログ")
        log_title.setProperty("class", "CardTitle")
        log_top.addWidget(log_title)

        log_top.addStretch()

        self.auto_scroll_check = QCheckBox("自動スクロール")
        self.auto_scroll_check.setChecked(True)
        log_top.addWidget(self.auto_scroll_check)

        btn_copy_log = QPushButton("コピー")
        btn_copy_log.setProperty("class", "IconButton")
        btn_copy_log.clicked.connect(self.copy_log_to_clipboard)
        log_top.addWidget(btn_copy_log)

        btn_clear_log = QPushButton("クリア")
        btn_clear_log.setProperty("class", "IconButton")
        btn_clear_log.clicked.connect(self.clear_log)
        log_top.addWidget(btn_clear_log)
        log_layout.addLayout(log_top)

        self.log_console = QTextEdit()
        self.log_console.setProperty("class", "ConsoleEdit")
        self.log_console.setReadOnly(True)
        self.log_console.setMinimumHeight(110)
        log_layout.addWidget(self.log_console)

        main_layout.addWidget(log_card)

        main_scroll.setWidget(container)
        self.setCentralWidget(main_scroll)

        self.update_history_dropdown()

    def _setup_tray_icon(self):
        """タスクトレイ設定"""
        self.tray_icon = QSystemTrayIcon(self)
        pixmap = QPixmap(32, 32)
        pixmap.fill(Qt.transparent)
        painter = QPainter(pixmap)
        painter.setRenderHint(QPainter.Antialiasing)
        painter.setBrush(QColor("#4f46e5"))
        painter.setPen(Qt.NoPen)
        painter.drawRoundedRect(2, 2, 28, 28, 6, 6)
        painter.setPen(QColor("#ffffff"))
        f = QFont("Segoe UI", 12)
        f.setBold(True)
        painter.setFont(f)
        painter.drawText(QRect(0, 0, 32, 32), Qt.AlignCenter, "G")
        painter.end()

        icon = QIcon(pixmap)
        self.setWindowIcon(icon)
        self.tray_icon.setIcon(icon)
        self.tray_icon.setToolTip("Git Auto Commit & Push")

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
    # ログ出力
    # =========================================================
    @Slot(str, str)
    def log(self, message: str, level: str = "INFO"):
        now_str = datetime.datetime.now().strftime("%H:%M:%S")

        color_map = {
            "INFO": "#94a3b8",
            "RUN": "#818cf8",
            "SUCCESS": "#34d399",
            "OK": "#34d399",
            "WARNING": "#fbbf24",
            "ERROR": "#f87171",
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
            <span style="color: #64748b; font-size: 10px;">[{now_str}]</span>
            <span style="background-color: {tag_bg}; color: {color}; font-weight: 600; padding: 1px 4px; border-radius: 3px; font-size: 10px;">{level.upper()}</span>
            <span style="color: {color}; margin-left: 4px;">{message}</span>
        </div>
        """
        self.log_console.append(html)

        if self.auto_scroll_check.isChecked():
            self.log_console.moveCursor(QTextCursor.MoveOperation.End)

    def clear_log(self):
        self.log_console.clear()

    def copy_log_to_clipboard(self):
        text = self.log_console.toPlainText()
        QApplication.clipboard().setText(text)
        self.log("ログをクリップボードにコピーしました。", "INFO")

    # =========================================================
    # 履歴管理
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
        self.history_combo.addItem("プロジェクトを選択...", "")

        current_idx = 0
        idx = 1
        for d, u in dir_to_url.items():
            folder_name = os.path.basename(d) or d
            repo_name = u.split("/")[-1].replace(".git", "") if u else "未設定"
            display_text = f"{folder_name}  →  {repo_name}  ({d})"
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
        self.log(f"履歴からプロジェクトを選択しました: {self.target_dir}", "INFO")

        saved_url = self.history.get("dir_to_url", {}).get(self.target_dir)
        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=self.target_dir)
        if is_git and saved_url:
            ok_curr, curr_url, _ = run_git_command(["remote", "get-url", "origin"], cwd=self.target_dir)
            if not ok_curr:
                run_git_command(["remote", "add", "origin", saved_url], cwd=self.target_dir)
                self.log(f"リモートURL ({saved_url}) を登録しました。", "SUCCESS")
            elif curr_url != saved_url:
                run_git_command(["remote", "set-url", "origin", saved_url], cwd=self.target_dir)
                self.log(f"リモートURL ({saved_url}) に自動更新しました。", "SUCCESS")

        self.refresh_status()

    # =========================================================
    # フォルダ & URL 操作
    # =========================================================
    def select_folder(self):
        chosen = QFileDialog.getExistingDirectory(
            self,
            "対象フォルダの選択",
            self.target_dir,
            QFileDialog.ShowDirsOnly | QFileDialog.DontResolveSymlinks,
        )
        if chosen:
            self.target_dir = os.path.abspath(chosen)
            self.folder_path_edit.setText(self.target_dir)
            self.log(f"対象フォルダを変更しました: {self.target_dir}", "INFO")
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
            https_url = "https://github.com/" + url.replace("git@github.com:", "").replace(".git", "")
            QDesktopServices.openUrl(QUrl(https_url))
        else:
            QMessageBox.information(self, "案内", "有効なGitHub URLが設定されていません。")

    def change_remote_url(self):
        curr_dir = self.target_dir
        current_val = self.remote_url if (self.remote_url and self.remote_url != "未設定") else "https://github.com/"

        dialog = QDialog(self)
        dialog.setWindowTitle("リモートURLの変更")
        dialog.setMinimumWidth(440)
        d_layout = QVBoxLayout(dialog)
        d_layout.setContentsMargins(14, 14, 14, 14)
        d_layout.setSpacing(10)

        lbl = QLabel("GitHubリポジトリURL (HTTPS / SSH):")
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
                is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=curr_dir)
                if not is_git:
                    if self.ensure_git_repo():
                        is_git = True

                if is_git:
                    ok_check, _, _ = run_git_command(["remote", "get-url", "origin"], cwd=curr_dir)
                    if ok_check:
                        ok, _, err = run_git_command(["remote", "set-url", "origin", new_url], cwd=curr_dir)
                    else:
                        ok, _, err = run_git_command(["remote", "add", "origin", new_url], cwd=curr_dir)

                    if ok:
                        self.log(f"リモートURLを設定しました: {new_url}", "SUCCESS")
                    else:
                        self.log(f"URL設定エラー: {err}", "ERROR")

                self.remote_url = new_url
                self.remote_url_edit.setText(new_url)
                self.record_pair_history(curr_dir, new_url)
                self.refresh_status()

    def ensure_git_repo(self):
        curr_dir = self.target_dir
        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=curr_dir)
        if not is_git:
            res = QMessageBox.question(
                self,
                "Git初期化の確認",
                f"選択されたフォルダはまだGit管理されていません。\n\n対象フォルダ:\n{curr_dir}\n\nこのフォルダで 'git init' を実行しますか？",
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
    # ステータス更新
    # =========================================================
    def refresh_status(self):
        self.folder_path_edit.setText(self.target_dir)

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
            self.status_pill.setText("● 未初期化")
            self.status_pill.setStyleSheet(
                "background-color: #7f1d1d; color: #fca5a5; border: 1px solid #dc2626;"
            )
            self.branch_badge.setText("branch: -")
            self.branch_badge.setStyleSheet(
                "background-color: #450a0a; color: #fca5a5; border: 1px solid #7f1d1d;"
            )

            saved_url = self.history.get("dir_to_url", {}).get(self.target_dir)
            if saved_url:
                self.remote_url_edit.setText(f"{saved_url} (保存済み・Git未初期化)")
                self.remote_url = saved_url
            else:
                self.remote_url_edit.setText("未設定 (Git初期化後に設定可能)")

            self.changes_title.setText("変更ファイル一覧 (Git未初期化)")
            self.files_table.setRowCount(1)
            item_status = QTableWidgetItem("-")
            item_status.setTextAlignment(Qt.AlignCenter)
            item_path = QTableWidgetItem("Gitリポジトリではありません。[Push実行] 時に自動初期化できます。")
            item_path.setForeground(QColor("#fca5a5"))
            self.files_table.setItem(0, 0, item_status)
            self.files_table.setItem(0, 1, item_path)
            return

        # Gitリポジトリ時
        self.branch_badge.setText(f"branch: {self.current_branch}")
        self.branch_badge.setStyleSheet(
            "background-color: #1e1b4b; color: #a5b4fc; border: 1px solid #4338ca;"
        )

        if self.is_auto_sync_active:
            self.status_pill.setText("● 自動同期中")
            self.status_pill.setStyleSheet(
                "background-color: #064e3b; color: #34d399; border: 1px solid #059669;"
            )
        else:
            self.status_pill.setText("● 準備完了")
            self.status_pill.setStyleSheet(
                "background-color: #1e293b; color: #94a3b8; border: 1px solid #334155;"
            )

        if self.remote_url != "未設定":
            self.remote_url_edit.setText(self.remote_url)
            self.record_pair_history(self.target_dir, self.remote_url)
        else:
            saved_url = self.history.get("dir_to_url", {}).get(self.target_dir)
            if saved_url:
                run_git_command(["remote", "add", "origin", saved_url], cwd=self.target_dir)
                self.remote_url = saved_url
                self.remote_url_edit.setText(f"{saved_url} (履歴から自動適用)")
                self.log(f"保存されていたURL ({saved_url}) をリモートoriginに自動適用しました。", "SUCCESS")
            else:
                self.remote_url_edit.setText("未設定 (「URL変更」から設定可能)")

        num_changes = len(files)
        if num_changes > 0:
            self.changes_title.setText(f"変更ファイル一覧 ({num_changes}件)")
            self.files_table.setRowCount(num_changes)

            for row, f in enumerate(files):
                code = f["code"]
                path = f["path"]

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
            self.changes_title.setText("変更ファイル一覧 (0件 - クリーン)")
            self.files_table.setRowCount(1)
            item_status = QTableWidgetItem("OK")
            item_status.setTextAlignment(Qt.AlignCenter)
            item_status.setForeground(QColor("#34d399"))
            item_path = QTableWidgetItem("変更されたファイルはありません (Working tree clean)")
            item_path.setForeground(QColor("#6ee7b7"))
            self.files_table.setItem(0, 0, item_status)
            self.files_table.setItem(0, 1, item_path)

        self.update_history_dropdown()

    # =========================================================
    # コミット & Push
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

        self.is_committing = True
        self.btn_commit_push.setEnabled(False)
        self.btn_commit_push.setText("処理中...")
        self.status_pill.setText("● 処理中...")
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
        self.btn_commit_push.setText("コミット & Push 実行")

        if success:
            self.commit_msg_edit.clear()
            self.record_pair_history(self.target_dir, self.remote_url)
            self.tray_icon.showMessage(
                "Git Auto Commit & Push",
                "コミット & Push が完了しました。",
                QSystemTrayIcon.Information,
                3000,
            )
        else:
            self.tray_icon.showMessage(
                "エラー",
                f"Push処理に失敗しました: {result_msg}",
                QSystemTrayIcon.Warning,
                4000,
            )

        self.refresh_status()

    # =========================================================
    # 自動同期タイマー
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
            self.is_auto_sync_active = False
            self.auto_sync_timer.stop()
            self.btn_toggle_sync.setText("自動同期を開始")
            self.btn_toggle_sync.setStyleSheet(
                "background-color: #065f46; color: #a7f3d0; font-weight: 600;"
            )
            self.countdown_label.setText("状態: 停止中 (手動モード)")
            self.sync_progress_bar.setValue(0)
            self.status_pill.setText("● 準備完了")
            self.status_pill.setStyleSheet(
                "background-color: #1e293b; color: #94a3b8; border: 1px solid #334155;"
            )
            self.log("自動同期を停止しました。", "INFO")
        else:
            self.is_auto_sync_active = True
            interval_str = self.interval_combo.currentText()
            minutes = int(interval_str.replace("分", ""))
            self.sync_interval_sec = minutes * 60
            self.seconds_remaining = self.sync_interval_sec

            self.auto_sync_timer.start(1000)
            self.btn_toggle_sync.setText("自動同期を停止")
            self.btn_toggle_sync.setStyleSheet(
                "background-color: #991b1b; color: #fecaca; font-weight: 600;"
            )
            self.status_pill.setText("● 自動同期中")
            self.status_pill.setStyleSheet(
                "background-color: #064e3b; color: #34d399; border: 1px solid #059669;"
            )
            self.log(
                f"自動同期を開始しました (間隔: {interval_str})",
                "INFO",
            )

    def _on_timer_tick(self):
        if not self.is_auto_sync_active:
            return

        self.seconds_remaining -= 1

        if self.seconds_remaining <= 0:
            self.seconds_remaining = self.sync_interval_sec
            if not self.is_committing:
                self.log("自動同期トリガーを実行します...", "INFO")
                self.trigger_commit_push()

        mins, secs = divmod(self.seconds_remaining, 60)
        self.countdown_label.setText(
            f"稼働中 ({self.interval_combo.currentText()})  次回: {mins:02d}:{secs:02d}"
        )

        elapsed = self.sync_interval_sec - self.seconds_remaining
        pct = int((elapsed / self.sync_interval_sec) * 100)
        self.sync_progress_bar.setValue(pct)


# =====================================================================
# エントリーポイント
# =====================================================================
def main():
    if hasattr(Qt, "HighDpiScaleFactorRoundingPolicy"):
        QApplication.setHighDpiScaleFactorRoundingPolicy(
            Qt.HighDpiScaleFactorRoundingPolicy.PassThrough
        )

    app = QApplication(sys.argv)
    app.setStyleSheet(MODERN_STYLE)

    initial_dir = sys.argv[1] if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]) else os.getcwd()
    window = GitAutoCommitWindow(initial_dir)
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
