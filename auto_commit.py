#!/usr/bin/env python3
"""
Git Auto Commit & Push Pro (PySide6 Modern Desktop Edition)
洗練されたモダンUI・ライト/ダークテーマ・スマートファイル除外設定を備えたGit自動化ツール
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
                if "theme" not in data:
                    data["theme"] = "dark"
                return data
        except Exception:
            pass
    return {"dir_to_url": {}, "url_to_dir": {}, "theme": "dark"}


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
                    if path.startswith('"') and path.endswith('"'):
                        path = path[1:-1]
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
        selected_files = self.kwargs.get("selected_files", None)

        try:
            self.log_signal.emit(f"[{os.path.basename(curr_dir)}] の変更ステータスを確認中...", "INFO")

            _, status_out, _ = run_git_command(["status", "--porcelain"], cwd=curr_dir)
            has_changes = bool(status_out.strip())

            if has_changes:
                if selected_files is not None and len(selected_files) > 0:
                    self.log_signal.emit(f"選択された {len(selected_files)} 件のファイルをステージング中...", "RUN")
                    ok, _, err = run_git_command(["add", "--"] + selected_files, cwd=curr_dir)
                else:
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
# QSS スタイルシート (ダーク & ライトテーマ定義)
# =====================================================================
DARK_STYLE = """
QWidget {
    background-color: #0f172a;
    color: #f8fafc;
    font-size: 12px;
    selection-background-color: #4f46e5;
    selection-color: #ffffff;
}

QMainWindow {
    background-color: #0f172a;
}

QFrame.CardFrame {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
}

QLabel.HeaderTitle {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
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

QTableWidget::indicator {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1.5px solid #64748b;
    background-color: #0f172a;
}

QTableWidget::indicator:checked {
    background-color: #6366f1;
    border-color: #818cf8;
}

QHeaderView::section {
    background-color: #1e293b;
    color: #94a3b8;
    padding: 6px 8px;
    border: none;
    border-bottom: 1px solid #334155;
    font-weight: 600;
    font-size: 11px;
}

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

LIGHT_STYLE = """
QWidget {
    background-color: #f1f5f9;
    color: #0f172a;
    font-size: 12px;
    selection-background-color: #4f46e5;
    selection-color: #ffffff;
}

QMainWindow {
    background-color: #f1f5f9;
}

QFrame.CardFrame {
    background-color: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
}

QLabel.HeaderTitle {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
}

QLabel.CardTitle {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
}

QLabel.MutedLabel {
    color: #64748b;
    font-size: 12px;
    font-weight: 500;
}

QLabel.Badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
}

QLineEdit {
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 6px 10px;
    color: #0f172a;
    font-size: 12px;
}

QLineEdit:focus {
    border: 1px solid #4f46e5;
    background-color: #ffffff;
}

QLineEdit:disabled {
    background-color: #e2e8f0;
    color: #94a3b8;
}

QComboBox {
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 5px 10px;
    color: #0f172a;
    font-size: 12px;
    min-height: 18px;
}

QComboBox:hover {
    border: 1px solid #94a3b8;
}

QComboBox:focus {
    border: 1px solid #4f46e5;
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
    border-top: 5px solid #64748b;
    margin-right: 6px;
}

QComboBox QAbstractItemView {
    background-color: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    color: #0f172a;
    selection-background-color: #4f46e5;
    selection-color: #ffffff;
    padding: 4px;
    outline: none;
}

QPushButton {
    background-color: #e2e8f0;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 6px 12px;
    font-weight: 600;
    font-size: 12px;
}

QPushButton:hover {
    background-color: #cbd5e1;
    border-color: #94a3b8;
}

QPushButton:pressed {
    background-color: #cbd5e1;
}

QPushButton:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    border-color: #e2e8f0;
}

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
    background-color: #4338ca;
}

QPushButton.PrimaryButton:pressed {
    background-color: #3730a3;
}

QPushButton.PrimaryButton:disabled {
    background-color: #cbd5e1;
    color: #64748b;
}

QPushButton.TagButton {
    background-color: #f8fafc;
    color: #475569;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 500;
}

QPushButton.TagButton:hover {
    background-color: #e2e8f0;
    color: #0f172a;
    border-color: #4f46e5;
}

QPushButton.IconButton {
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 500;
    color: #334155;
}

QPushButton.IconButton:hover {
    background-color: #e2e8f0;
    border-color: #94a3b8;
    color: #0f172a;
}

QTableWidget {
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    gridline-color: #e2e8f0;
    color: #0f172a;
    font-size: 12px;
}

QTableWidget::item {
    padding: 4px 6px;
    border-bottom: 1px solid #e2e8f0;
}

QTableWidget::indicator {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1.5px solid #94a3b8;
    background-color: #ffffff;
}

QTableWidget::indicator:checked {
    background-color: #4f46e5;
    border-color: #4338ca;
}

QHeaderView::section {
    background-color: #f1f5f9;
    color: #475569;
    padding: 6px 8px;
    border: none;
    border-bottom: 1px solid #cbd5e1;
    font-weight: 600;
    font-size: 11px;
}

QTextEdit.ConsoleEdit {
    background-color: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    color: #0f172a;
    font-family: "Consolas", "Cascadia Code", monospace;
    font-size: 11px;
    line-height: 1.35;
    padding: 6px;
}

QCheckBox {
    color: #334155;
    font-size: 12px;
    spacing: 6px;
}

QCheckBox::indicator {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #94a3b8;
    background-color: #ffffff;
}

QCheckBox::indicator:checked {
    background-color: #4f46e5;
    border-color: #4338ca;
}

QProgressBar {
    border: 1px solid #cbd5e1;
    border-radius: 3px;
    background-color: #f1f5f9;
    text-align: center;
    color: transparent;
    height: 4px;
}

QProgressBar::chunk {
    background-color: #10b981;
    border-radius: 2px;
}

QScrollBar:vertical {
    background: transparent;
    width: 8px;
    margin: 0px;
}

QScrollBar::handle:vertical {
    background: #cbd5e1;
    min-height: 20px;
    border-radius: 4px;
}

QScrollBar::handle:vertical:hover {
    background: #94a3b8;
}

QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
    height: 0px;
}
"""


# =====================================================================
# .gitignore 除外設定ダイアログ (スマート正規化付き)
# =====================================================================
class GitIgnoreDialog(QDialog):
    def __init__(self, target_dir, parent=None):
        super().__init__(parent)
        self.target_dir = target_dir
        self.setWindowTitle("除外ファイル設定 (.gitignore)")
        self.setMinimumWidth(500)
        self.setMinimumHeight(420)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(16, 16, 16, 16)
        layout.setSpacing(10)

        desc = QLabel(
            "コミット対象外にするファイルやフォルダのパターンを入力してください。\n"
            "※ .py と入力した場合は自動的に *.py に補正され、すでにコミット履歴にあるファイルも追跡解除されます。"
        )
        desc.setProperty("class", "MutedLabel")
        layout.addWidget(desc)

        # プリセット提案
        preset_row = QHBoxLayout()
        preset_row.setSpacing(6)
        preset_lbl = QLabel("クイック追加:")
        preset_lbl.setProperty("class", "MutedLabel")
        preset_row.addWidget(preset_lbl)

        presets = [
            ("*.py", "*.py"),
            (".env", ".env"),
            ("*.log", "*.log"),
            ("__pycache__/", "__pycache__/"),
            ("node_modules/", "node_modules/"),
            (".DS_Store", ".DS_Store"),
            ("*.tmp", "*.tmp"),
        ]
        for name, pattern in presets:
            btn = QPushButton(f"+ {name}")
            btn.setProperty("class", "TagButton")
            btn.clicked.connect(lambda _, p=pattern: self._add_pattern(p))
            preset_row.addWidget(btn)

        preset_row.addStretch()
        layout.addLayout(preset_row)

        self.text_edit = QTextEdit()
        self.text_edit.setPlaceholderText(
            "# 除外パターンの例:\n*.py\n.env\n*.log\nnode_modules/\n__pycache__/\n*.tmp\n"
        )
        self.text_edit.setFont(QFont("Consolas", 10))
        layout.addWidget(self.text_edit)

        # 既存 .gitignore の読み込み
        gitignore_path = os.path.join(self.target_dir, ".gitignore")
        if os.path.exists(gitignore_path):
            try:
                with open(gitignore_path, "r", encoding="utf-8") as f:
                    self.text_edit.setPlainText(f.read())
            except Exception as e:
                print(f"Error reading .gitignore: {e}")

        bbox = QDialogButtonBox(QDialogButtonBox.Save | QDialogButtonBox.Cancel)
        bbox.button(QDialogButtonBox.Save).setText("保存して適用")
        bbox.button(QDialogButtonBox.Cancel).setText("キャンセル")
        bbox.accepted.connect(self._save_and_close)
        bbox.rejected.connect(self.reject)
        layout.addWidget(bbox)

    def _add_pattern(self, pattern):
        curr = self.text_edit.toPlainText()
        lines = [line.strip() for line in curr.splitlines()]
        if pattern not in lines:
            if curr and not curr.endswith("\n"):
                self.text_edit.append(pattern)
            else:
                self.text_edit.insertPlainText(pattern + "\n")

    def _save_and_close(self):
        raw_text = self.text_edit.toPlainText()
        normalized_lines = []

        for line in raw_text.splitlines():
            s = line.strip()
            if not s or s.startswith("#"):
                normalized_lines.append(line)
                continue

            known_dotfiles = {".env", ".gitignore", ".ds_store", ".gitattributes", ".eslintrc", ".prettierrc"}
            if s.startswith(".") and s.lower() not in known_dotfiles and "*" not in s and "/" not in s:
                normalized_lines.append(f"*{s}")
            else:
                normalized_lines.append(s)

        content = "\n".join(normalized_lines) + "\n"
        gitignore_path = os.path.join(self.target_dir, ".gitignore")
        try:
            with open(gitignore_path, "w", encoding="utf-8") as f:
                f.write(content)
            self.accept()
        except Exception as e:
            QMessageBox.critical(self, "エラー", f".gitignore の保存に失敗しました:\n{e}")


# =====================================================================
# メインウィンドウ
# =====================================================================
class GitAutoCommitWindow(QMainWindow):
    def __init__(self, initial_dir=None):
        super().__init__()
        self.setWindowTitle("Git Auto Commit & Push")
        
        # 余裕を持った快適なサイズ設定
        self.setMinimumSize(660, 620)
        self.resize(740, 760)

        # 履歴ロード
        self.history = load_history()
        self.current_theme = self.history.get("theme", "dark")

        # 状態
        self.target_dir = os.path.abspath(initial_dir or os.getcwd())
        self.current_branch = "main"
        self.remote_url = "未設定"
        self.is_git_repo = False
        self.is_committing = False
        self.is_auto_sync_active = False
        self.current_files = []

        # 自動同期タイマー
        self.sync_interval_sec = 300
        self.seconds_remaining = 300
        self.auto_sync_timer = QTimer(self)
        self.auto_sync_timer.timeout.connect(self._on_timer_tick)

        self._init_ui()
        self._setup_tray_icon()
        self._apply_theme(self.current_theme)
        self.refresh_status()

    def _init_ui(self):
        main_scroll = QScrollArea()
        main_scroll.setWidgetResizable(True)
        main_scroll.setFrameShape(QFrame.NoFrame)

        container = QWidget()
        main_layout = QVBoxLayout(container)
        main_layout.setContentsMargins(12, 12, 12, 12)
        main_layout.setSpacing(10)

        # =========================================================
        # 1. ヘッダー (タイトル・状態・テーマ切替・履歴・対象・URL)
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

        self.btn_theme = QPushButton("テーマ: Dark")
        self.btn_theme.setProperty("class", "IconButton")
        self.btn_theme.clicked.connect(self.toggle_theme)
        top_row.addWidget(self.btn_theme)

        self.status_pill = QLabel("● 準備完了")
        self.status_pill.setProperty("class", "Badge")
        top_row.addWidget(self.status_pill)

        self.branch_badge = QLabel("branch: main")
        self.branch_badge.setProperty("class", "Badge")
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
        # 2. 変更ファイル一覧 (広々とした快適な表示領域)
        # =========================================================
        changes_card = QFrame()
        changes_card.setProperty("class", "CardFrame")
        changes_layout = QVBoxLayout(changes_card)
        changes_layout.setContentsMargins(12, 10, 12, 10)
        changes_layout.setSpacing(8)

        changes_top = QHBoxLayout()
        self.changes_title = QLabel("変更ファイル一覧 (0件)")
        self.changes_title.setProperty("class", "CardTitle")
        changes_top.addWidget(self.changes_title)

        changes_top.addStretch()

        self.btn_select_all = QPushButton("全選択 / 解除")
        self.btn_select_all.setProperty("class", "TagButton")
        self.btn_select_all.clicked.connect(self.toggle_select_all_files)
        changes_top.addWidget(self.btn_select_all)

        btn_gitignore = QPushButton("除外設定 (.gitignore)...")
        btn_gitignore.setProperty("class", "IconButton")
        btn_gitignore.clicked.connect(self.open_gitignore_dialog)
        changes_top.addWidget(btn_gitignore)

        btn_refresh = QPushButton("更新")
        btn_refresh.setProperty("class", "IconButton")
        btn_refresh.clicked.connect(self.refresh_status)
        changes_top.addWidget(btn_refresh)
        changes_layout.addLayout(changes_top)

        # 広々としたテーブル (高さ 180px〜360px)
        self.files_table = QTableWidget(0, 3)
        self.files_table.setHorizontalHeaderLabels(["選択", "状態", "ファイルパス"])
        self.files_table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeToContents)
        self.files_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.ResizeToContents)
        self.files_table.horizontalHeader().setSectionResizeMode(2, QHeaderView.Stretch)
        self.files_table.verticalHeader().setVisible(False)
        self.files_table.verticalHeader().setDefaultSectionSize(28)
        self.files_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.files_table.setMinimumHeight(180)
        self.files_table.cellClicked.connect(self._on_table_cell_clicked)
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

    def _on_table_cell_clicked(self, row, col):
        """セルクリックで行のチェックボックスを反転"""
        item = self.files_table.item(row, 0)
        if item and item.flags() & Qt.ItemIsUserCheckable:
            # 0列目をクリックした場合はQtが自動反転するため二重反転を防ぐ
            if col != 0:
                new_state = Qt.Unchecked if item.checkState() == Qt.Checked else Qt.Checked
                item.setCheckState(new_state)

    # =========================================================
    # テーマ管理 (Dark / Light)
    # =========================================================
    def toggle_theme(self):
        new_theme = "light" if self.current_theme == "dark" else "dark"
        self._apply_theme(new_theme)

    def _apply_theme(self, theme_name):
        self.current_theme = theme_name
        self.history["theme"] = theme_name
        save_history(self.history)

        if theme_name == "light":
            QApplication.instance().setStyleSheet(LIGHT_STYLE)
            self.btn_theme.setText("テーマ: Light")
        else:
            QApplication.instance().setStyleSheet(DARK_STYLE)
            self.btn_theme.setText("テーマ: Dark")

        self._update_badges_color()

    def _update_badges_color(self):
        if not self.is_git_repo:
            self.status_pill.setText("● 未初期化")
            self.status_pill.setStyleSheet("background-color: #7f1d1d; color: #fca5a5; border: 1px solid #dc2626;")
            self.branch_badge.setText("branch: -")
            self.branch_badge.setStyleSheet("background-color: #450a0a; color: #fca5a5; border: 1px solid #7f1d1d;")
        else:
            self.branch_badge.setText(f"branch: {self.current_branch}")
            if self.current_theme == "light":
                self.branch_badge.setStyleSheet("background-color: #e0e7ff; color: #3730a3; border: 1px solid #a5b4fc;")
                if self.is_auto_sync_active:
                    self.status_pill.setText("● 自動同期中")
                    self.status_pill.setStyleSheet("background-color: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;")
                else:
                    self.status_pill.setText("● 準備完了")
                    self.status_pill.setStyleSheet("background-color: #e2e8f0; color: #334155; border: 1px solid #cbd5e1;")
            else:
                self.branch_badge.setStyleSheet("background-color: #1e1b4b; color: #a5b4fc; border: 1px solid #4338ca;")
                if self.is_auto_sync_active:
                    self.status_pill.setText("● 自動同期中")
                    self.status_pill.setStyleSheet("background-color: #064e3b; color: #34d399; border: 1px solid #059669;")
                else:
                    self.status_pill.setText("● 準備完了")
                    self.status_pill.setStyleSheet("background-color: #1e293b; color: #94a3b8; border: 1px solid #334155;")

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

        is_light = (self.current_theme == "light")
        if is_light:
            color_map = {
                "INFO": "#475569",
                "RUN": "#4338ca",
                "SUCCESS": "#047857",
                "OK": "#047857",
                "WARNING": "#b45309",
                "ERROR": "#b91c1c",
            }
            tag_bg = {
                "INFO": "#e2e8f0",
                "RUN": "#e0e7ff",
                "SUCCESS": "#d1fae5",
                "OK": "#d1fae5",
                "WARNING": "#fef3c7",
                "ERROR": "#fee2e2",
            }.get(level.upper(), "#e2e8f0")
        else:
            color_map = {
                "INFO": "#94a3b8",
                "RUN": "#818cf8",
                "SUCCESS": "#34d399",
                "OK": "#34d399",
                "WARNING": "#fbbf24",
                "ERROR": "#f87171",
            }
            tag_bg = {
                "INFO": "#1e293b",
                "RUN": "#1e1b4b",
                "SUCCESS": "#064e3b",
                "OK": "#064e3b",
                "WARNING": "#451a03",
                "ERROR": "#4c0519",
            }.get(level.upper(), "#1e293b")

        color = color_map.get(level.upper(), "#0f172a" if is_light else "#e2e8f0")

        html = f"""
        <div style="margin: 2px 0;">
            <span style="color: {'#94a3b8' if is_light else '#64748b'}; font-size: 10px;">[{now_str}]</span>
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
    # フォルダ & URL & 除外設定操作
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

    def open_gitignore_dialog(self):
        if not self.ensure_git_repo():
            return
        dlg = GitIgnoreDialog(self.target_dir, self)
        if dlg.exec() == QDialog.Accepted:
            self.log(".gitignore を更新しました。", "SUCCESS")
            self._apply_gitignore_untrack()
            self.refresh_status()

    def _apply_gitignore_untrack(self):
        """すでにGit管理下にあるファイルが .gitignore に追加された場合、ローカルファイルを消さずにGit追跡のみ解除"""
        curr_dir = self.target_dir
        ok, out, _ = run_git_command(["ls-files"], cwd=curr_dir)
        if ok and out.strip():
            tracked_files = out.strip().splitlines()
            ignored_untrack = []
            for tf in tracked_files:
                if tf == ".gitignore":
                    continue
                ok_ign, _, _ = run_git_command(["check-ignore", "-q", tf], cwd=curr_dir)
                if ok_ign:
                    ignored_untrack.append(tf)

            if ignored_untrack:
                for item in ignored_untrack:
                    run_git_command(["rm", "--cached", "-r", "--", item], cwd=curr_dir)
                self.log(
                    f".gitignore に該当する追跡ファイル ({len(ignored_untrack)}件: {', '.join(ignored_untrack[:3])}) をGit追跡から除外しました。(ローカルファイルは保持されています)",
                    "SUCCESS",
                )

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
    # ステータス更新 & ファイル一覧
    # =========================================================
    def refresh_status(self):
        self.folder_path_edit.setText(self.target_dir)

        if self.is_git_repo:
            self._apply_gitignore_untrack()

        self.worker = GitWorker("status", self.target_dir)
        self.worker.log_signal.connect(self.log)
        self.worker.status_updated_signal.connect(self._on_status_updated)
        self.worker.start()

    @Slot(dict)
    def _on_status_updated(self, data):
        self.is_git_repo = data.get("is_git", False)
        self.current_branch = data.get("branch", "main")
        self.remote_url = data.get("remote_url", "未設定")
        self.current_files = data.get("files", [])

        self._update_badges_color()

        if not self.is_git_repo:
            saved_url = self.history.get("dir_to_url", {}).get(self.target_dir)
            if saved_url:
                self.remote_url_edit.setText(f"{saved_url} (保存済み・Git未初期化)")
                self.remote_url = saved_url
            else:
                self.remote_url_edit.setText("未設定 (Git初期化後に設定可能)")

            self.changes_title.setText("変更ファイル一覧 (Git未初期化)")
            self.files_table.setRowCount(1)
            item_check = QTableWidgetItem("")
            item_status = QTableWidgetItem("-")
            item_status.setTextAlignment(Qt.AlignCenter)
            item_path = QTableWidgetItem("Gitリポジトリではありません。[Push実行] 時に自動初期化できます。")
            item_path.setForeground(QColor("#fca5a5"))
            self.files_table.setItem(0, 0, item_check)
            self.files_table.setItem(0, 1, item_status)
            self.files_table.setItem(0, 2, item_path)
            return

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

        num_changes = len(self.current_files)
        if num_changes > 0:
            self.changes_title.setText(f"変更ファイル一覧 ({num_changes}件)")
            self.files_table.setRowCount(num_changes)

            for row, f in enumerate(self.current_files):
                code = f["code"]
                path = f["path"]

                # チェックボックス
                chk_item = QTableWidgetItem()
                chk_item.setFlags(Qt.ItemIsUserCheckable | Qt.ItemIsEnabled)
                chk_item.setCheckState(Qt.Checked)

                # バッジ色設定
                is_light = (self.current_theme == "light")
                if is_light:
                    if "M" in code:
                        badge_bg, badge_fg = "#fef3c7", "#b45309"
                    elif "A" in code or "?" in code:
                        badge_bg, badge_fg = "#d1fae5", "#047857"
                    elif "D" in code:
                        badge_bg, badge_fg = "#fee2e2", "#b91c1c"
                    else:
                        badge_bg, badge_fg = "#e2e8f0", "#475569"
                else:
                    if "M" in code:
                        badge_bg, badge_fg = "#78350f", "#fcd34d"
                    elif "A" in code or "?" in code:
                        badge_bg, badge_fg = "#064e3b", "#6ee7b7"
                    elif "D" in code:
                        badge_bg, badge_fg = "#7f1d1d", "#fca5a5"
                    else:
                        badge_bg, badge_fg = "#334155", "#ffffff"

                item_code = QTableWidgetItem(code)
                item_code.setTextAlignment(Qt.AlignCenter)
                item_code.setBackground(QColor(badge_bg))
                item_code.setForeground(QColor(badge_fg))

                item_path = QTableWidgetItem(path)
                item_path.setFont(QFont("Consolas", 10))

                self.files_table.setItem(row, 0, chk_item)
                self.files_table.setItem(row, 1, item_code)
                self.files_table.setItem(row, 2, item_path)
        else:
            self.changes_title.setText("変更ファイル一覧 (0件 - クリーン)")
            self.files_table.setRowCount(1)
            item_check = QTableWidgetItem("")
            item_status = QTableWidgetItem("OK")
            item_status.setTextAlignment(Qt.AlignCenter)
            item_status.setForeground(QColor("#10b981"))
            item_path = QTableWidgetItem("変更されたファイルはありません (Working tree clean)")
            item_path.setForeground(QColor("#10b981"))
            self.files_table.setItem(0, 0, item_check)
            self.files_table.setItem(0, 1, item_status)
            self.files_table.setItem(0, 2, item_path)

        self.update_history_dropdown()

    def toggle_select_all_files(self):
        """ファイル一覧の全選択 / 全解除"""
        row_count = self.files_table.rowCount()
        if row_count == 0:
            return

        first_item = self.files_table.item(0, 0)
        if not first_item or first_item.flags() & Qt.ItemIsUserCheckable == 0:
            return

        target_state = Qt.Unchecked if first_item.checkState() == Qt.Checked else Qt.Checked
        for row in range(row_count):
            item = self.files_table.item(row, 0)
            if item and item.flags() & Qt.ItemIsUserCheckable:
                item.setCheckState(target_state)

    def _get_selected_files_list(self):
        """チェックされたファイルのパスリストを取得"""
        selected = []
        for row in range(self.files_table.rowCount()):
            chk_item = self.files_table.item(row, 0)
            path_item = self.files_table.item(row, 2)
            if chk_item and chk_item.checkState() == Qt.Checked and path_item:
                selected.append(path_item.text())
        return selected

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

        selected_files = self._get_selected_files_list()
        if len(self.current_files) > 0 and len(selected_files) == 0 and not allow_empty:
            QMessageBox.information(self, "案内", "コミット対象のファイルが選択されていません。\nファイルにチェックを入れるか、「変更なしでもコミット履歴を残す」にチェックを入れてください。")
            return

        self.is_committing = True
        self.btn_commit_push.setEnabled(False)
        self.btn_commit_push.setText("処理中...")
        self.status_pill.setText("● 処理中...")
        self.status_pill.setStyleSheet(
            "background-color: #1e1b4b; color: #818cf8; border: 1px solid #4338ca;"
        )

        pass_files = selected_files if len(selected_files) < len(self.current_files) else None

        self.commit_worker = GitWorker(
            "commit_push",
            self.target_dir,
            message=msg,
            allow_empty=allow_empty,
            branch=self.current_branch,
            selected_files=pass_files,
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
            self._update_badges_color()
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
            self._update_badges_color()
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
    
    base_font = QFont("Segoe UI", 9)
    if not base_font.exactMatch() and sys.platform == "win32":
        base_font = QFont("Yu Gothic UI", 9)
    app.setFont(base_font)

    initial_dir = sys.argv[1] if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]) else os.getcwd()
    window = GitAutoCommitWindow(initial_dir)
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
