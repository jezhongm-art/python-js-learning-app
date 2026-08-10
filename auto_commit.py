#!/usr/bin/env python3
"""
Auto Git Commit & Push GUI Tool
TkinterによるGitコミット・プッシュ自動化デスクトップアプリ
(高DPI対応 ＆ 任意フォルダ・リポジトリ・リモートURL変更・自動git init対応版)
"""

import datetime
import os
import subprocess
import sys
import threading
import time
import tkinter as tk
from tkinter import filedialog, messagebox, simpledialog, ttk

# ==========================================
# Windows 高DPI (スケーリング・拡大率) 対応
# ==========================================
if sys.platform == "win32":
    try:
        import ctypes
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except Exception:
        try:
            import ctypes
            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass

# Windows環境での標準出力文字コード対策
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass


def run_git_command(args, cwd=None):
    """Gitコマンドを指定したディレクトリ(cwd)で実行し結果を返す"""
    target_cwd = cwd or os.getcwd()
    try:
        result = subprocess.run(
            ["git"] + args,
            cwd=target_cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        return result.returncode == 0, result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return False, "", str(e)


class GitAutoCommitGUI:
    def __init__(self, root, initial_dir=None):
        self.root = root
        self.root.title("Git 自動コミット & Push ツール")

        # 対象のGitリポジトリフォルダ
        self.target_dir = os.path.abspath(initial_dir or os.getcwd())

        # 視認性向上のための高解像度初期サイズ
        self.root.geometry("820x820")
        self.root.minsize(700, 620)

        # カラーテーマ設定 (ハイコントラスト Slate & Indigo)
        self.bg_color = "#0f172a"       # slate-900
        self.card_bg = "#1e293b"        # slate-800
        self.card_border = "#334155"    # slate-700
        self.text_color = "#ffffff"     # くっきり純白
        self.text_muted = "#cbd5e1"     # slate-300
        self.accent_color = "#6366f1"   # indigo-500
        self.accent_hover = "#4f46e5"   # indigo-600
        self.success_color = "#10b981"  # emerald-500
        self.warning_color = "#f59e0b"  # amber-500
        self.error_color = "#ef4444"    # red-500

        self.root.configure(bg=self.bg_color)

        # フォント設定 (Meiryo / Yu Gothic UI)
        self.font_family = "Yu Gothic UI" if sys.platform == "win32" else "Helvetica"
        self.font_title = (self.font_family, 13, "bold")
        self.font_body = (self.font_family, 10)
        self.font_bold = (self.font_family, 10, "bold")
        self.font_small = (self.font_family, 9)
        self.font_mono = ("Consolas", 10)

        # 状態変数
        self.is_watching = False
        self.watch_thread = None
        self.current_branch = "main"
        self.remote_url = "未設定"

        # UIコンポーネント構築
        self._setup_styles()
        self._create_widgets()

        # 初期ステータス取得
        self.refresh_status()

    def _setup_styles(self):
        self.style = ttk.Style()
        self.style.theme_use("clam")

        self.style.configure(".", background=self.bg_color, foreground=self.text_color)
        self.style.configure("TFrame", background=self.bg_color)
        self.style.configure("Card.TFrame", background=self.card_bg, relief="flat")
        
        self.style.configure("TLabel", background=self.bg_color, foreground=self.text_color, font=self.font_body)
        self.style.configure("Card.TLabel", background=self.card_bg, foreground=self.text_color, font=self.font_body)
        self.style.configure("Muted.TLabel", background=self.card_bg, foreground=self.text_muted, font=self.font_small)
        self.style.configure("Title.TLabel", background=self.card_bg, foreground=self.text_color, font=self.font_title)

        self.style.configure("TCombobox", 
                             fieldbackground="#0f172a", 
                             background=self.card_bg, 
                             foreground="#ffffff", 
                             darkcolor=self.card_border, 
                             lightcolor=self.card_border,
                             selectbackground=self.accent_color,
                             selectforeground="#ffffff",
                             font=self.font_bold)

    def _create_widgets(self):
        main_container = ttk.Frame(self.root, padding=16)
        main_container.pack(fill=tk.BOTH, expand=True)

        # ==========================================
        # 1. ヘッダーカード (リポジトリ選択・URL表示・切り替え)
        # ==========================================
        header_card = ttk.Frame(main_container, style="Card.TFrame", padding=14)
        header_card.pack(fill=tk.X, pady=(0, 12))

        header_top = ttk.Frame(header_card, style="Card.TFrame")
        header_top.pack(fill=tk.X)

        title_lbl = ttk.Label(
            header_top,
            text="Git Auto Commit & Push",
            style="Title.TLabel",
        )
        title_lbl.pack(side=tk.LEFT)

        self.branch_badge = tk.Label(
            header_top,
            text="branch: main",
            bg="#312e81",
            fg="#e0e7ff",
            font=(self.font_family, 9, "bold"),
            padx=10,
            pady=4,
        )
        self.branch_badge.pack(side=tk.RIGHT)

        # フォルダ選択エリア
        repo_frame = ttk.Frame(header_card, style="Card.TFrame")
        repo_frame.pack(fill=tk.X, pady=(8, 4))

        self.repo_lbl = ttk.Label(
            repo_frame,
            text=f"対象フォルダ: {self.target_dir}",
            style="Muted.TLabel",
        )
        self.repo_lbl.pack(side=tk.LEFT, fill=tk.X, expand=True)

        self.btn_select_dir = tk.Button(
            repo_frame,
            text="フォルダ選択...",
            bg="#334155",
            fg="#ffffff",
            activebackground="#475569",
            activeforeground="#ffffff",
            font=self.font_small,
            bd=0,
            padx=10,
            pady=2,
            cursor="hand2",
            command=self.select_directory,
        )
        self.btn_select_dir.pack(side=tk.RIGHT)

        # リモートURL表示・変更エリア
        url_frame = ttk.Frame(header_card, style="Card.TFrame")
        url_frame.pack(fill=tk.X, pady=(4, 0))

        self.url_lbl = ttk.Label(
            url_frame,
            text="コミット先URL (origin): 未設定",
            style="Muted.TLabel",
        )
        self.url_lbl.pack(side=tk.LEFT, fill=tk.X, expand=True)

        self.btn_change_url = tk.Button(
            url_frame,
            text="URL変更...",
            bg="#334155",
            fg="#ffffff",
            activebackground="#475569",
            activeforeground="#ffffff",
            font=self.font_small,
            bd=0,
            padx=10,
            pady=2,
            cursor="hand2",
            command=self.change_remote_url,
        )
        self.btn_change_url.pack(side=tk.RIGHT)

        # ==========================================
        # 2. 変更ファイルステータス
        # ==========================================
        status_card = ttk.Frame(main_container, style="Card.TFrame", padding=14)
        status_card.pack(fill=tk.X, pady=(0, 12))

        status_header = ttk.Frame(status_card, style="Card.TFrame")
        status_header.pack(fill=tk.X, pady=(0, 8))

        ttk.Label(
            status_header, text="未コミットの変更ファイル", style="Title.TLabel"
        ).pack(side=tk.LEFT)

        self.btn_refresh = tk.Button(
            status_header,
            text="手動更新",
            bg="#334155",
            fg="#ffffff",
            activebackground="#475569",
            activeforeground="#ffffff",
            font=self.font_bold,
            bd=0,
            padx=12,
            pady=4,
            cursor="hand2",
            command=self.refresh_status,
        )
        self.btn_refresh.pack(side=tk.RIGHT)

        self.file_list_text = tk.Text(
            status_card,
            height=4,
            bg="#020617",
            fg="#38bdf8",
            font=self.font_mono,
            bd=1,
            relief="solid",
            highlightthickness=1,
            highlightcolor=self.card_border,
            padx=10,
            pady=8,
        )
        self.file_list_text.pack(fill=tk.X)

        # ==========================================
        # 3. 手動コミット操作エリア
        # ==========================================
        action_card = ttk.Frame(main_container, style="Card.TFrame", padding=14)
        action_card.pack(fill=tk.X, pady=(0, 12))

        ttk.Label(
            action_card, text="コミットメッセージ", style="Title.TLabel"
        ).pack(anchor=tk.W, pady=(0, 6))

        msg_frame = ttk.Frame(action_card, style="Card.TFrame")
        msg_frame.pack(fill=tk.X, pady=(0, 8))

        self.entry_msg = tk.Entry(
            msg_frame,
            bg="#0f172a",
            fg="#ffffff",
            insertbackground="#ffffff",
            font=(self.font_family, 11),
            bd=1,
            relief="solid",
            highlightthickness=1,
            highlightcolor=self.accent_color,
        )
        self.entry_msg.pack(fill=tk.X, ipady=6)

        ttk.Label(
            action_card,
            text="※ 空欄のままで実行すると、現在日時（例: Auto commit: YYYY-MM-DD HH:MM:SS）が自動設定されます。",
            style="Muted.TLabel",
        ).pack(anchor=tk.W, pady=(0, 12))

        self.btn_push = tk.Button(
            action_card,
            text="今すぐコミット & Push 実行",
            bg=self.accent_color,
            fg="#ffffff",
            activebackground=self.accent_hover,
            activeforeground="#ffffff",
            font=(self.font_family, 11, "bold"),
            bd=0,
            pady=10,
            cursor="hand2",
            command=self.on_manual_push_click,
        )
        self.btn_push.pack(fill=tk.X)

        # ==========================================
        # 4. 自動監視設定エリア
        # ==========================================
        watch_card = ttk.Frame(main_container, style="Card.TFrame", padding=14)
        watch_card.pack(fill=tk.X, pady=(0, 12))

        watch_header = ttk.Frame(watch_card, style="Card.TFrame")
        watch_header.pack(fill=tk.X)

        ttk.Label(
            watch_header, text="自動同期 (定期監視)", style="Title.TLabel"
        ).pack(side=tk.LEFT)

        ttk.Label(watch_header, text="実行間隔:", style="Card.TLabel").pack(
            side=tk.LEFT, padx=(20, 6)
        )
        self.combo_interval = ttk.Combobox(
            watch_header,
            values=["1分", "3分", "5分", "10分", "30分"],
            width=7,
            state="readonly",
        )
        self.combo_interval.current(2)  # デフォルト5分
        self.combo_interval.pack(side=tk.LEFT)

        self.btn_watch_toggle = tk.Button(
            watch_header,
            text="自動同期を開始",
            bg=self.success_color,
            fg="#ffffff",
            activebackground="#059669",
            activeforeground="#ffffff",
            font=self.font_bold,
            bd=0,
            padx=14,
            pady=5,
            cursor="hand2",
            command=self.toggle_watch_mode,
        )
        self.btn_watch_toggle.pack(side=tk.RIGHT)

        self.watch_status_lbl = ttk.Label(
            watch_card,
            text="ステータス: 停止中",
            style="Muted.TLabel",
        )
        self.watch_status_lbl.pack(anchor=tk.W, pady=(8, 0))

        # ==========================================
        # 5. ログ表示エリア
        # ==========================================
        log_card = ttk.Frame(main_container, style="Card.TFrame", padding=14)
        log_card.pack(fill=tk.BOTH, expand=True)

        log_header = ttk.Frame(log_card, style="Card.TFrame")
        log_header.pack(fill=tk.X, pady=(0, 6))

        ttk.Label(log_header, text="実行ログ", style="Title.TLabel").pack(
            side=tk.LEFT
        )

        btn_clear_log = tk.Button(
            log_header,
            text="ログ消去",
            bg="#334155",
            fg="#cbd5e1",
            activebackground="#475569",
            activeforeground="#ffffff",
            font=self.font_small,
            bd=0,
            padx=8,
            pady=2,
            command=self.clear_log,
        )
        btn_clear_log.pack(side=tk.RIGHT)

        self.log_text = tk.Text(
            log_card,
            bg="#020617",
            fg="#cbd5e1",
            font=self.font_mono,
            bd=1,
            relief="solid",
            highlightthickness=0,
            padx=10,
            pady=8,
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)

    def ensure_git_repo(self):
        """Gitリポジトリ未初期化の場合、確認ダイアログを出して git init を実行"""
        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=self.target_dir)
        if not is_git:
            answer = messagebox.askyesno(
                "Git初期化の確認",
                f"選択されたフォルダはまだGitリポジトリではありません。\n\nフォルダ:\n{self.target_dir}\n\nこのフォルダで 'git init'（Gitリポジトリ初期化）を実行しますか？",
                parent=self.root,
            )
            if answer:
                ok_init, _, err_init = run_git_command(["init"], cwd=self.target_dir)
                if ok_init:
                    run_git_command(["branch", "-M", "main"], cwd=self.target_dir)
                    self.log(f"Gitリポジトリを初期化しました (git init): {self.target_dir}", "SUCCESS")
                    self.refresh_status()
                    return True
                else:
                    self.log(f"Git初期化失敗: {err_init}", "ERROR")
                    return False
            return False
        return True

    def select_directory(self):
        """任意のGitリポジトリ/プロジェクトフォルダを選択"""
        chosen = filedialog.askdirectory(
            title="コミット対象のフォルダを選択",
            initialdir=self.target_dir,
        )
        if chosen:
            self.target_dir = os.path.abspath(chosen)
            self.repo_lbl.config(text=f"対象フォルダ: {self.target_dir}")
            self.log(f"操作対象フォルダを変更しました: {self.target_dir}", "INFO")
            self.refresh_status()

    def change_remote_url(self):
        """リモートURL (origin) を変更（未初期化の場合は自動初期化）"""
        if not self.ensure_git_repo():
            return

        new_url = simpledialog.askstring(
            "コミット先URLの変更",
            "新しいGitHubリポジトリのURLを入力してください:\n(例: https://github.com/ユーザー名/リポジトリ名.git)",
            initialvalue=self.remote_url if self.remote_url != "未設定" else "https://github.com/",
            parent=self.root,
        )
        if new_url and new_url.strip():
            new_url = new_url.strip()
            ok_check, _, _ = run_git_command(["remote", "get-url", "origin"], cwd=self.target_dir)
            if ok_check:
                ok, _, err = run_git_command(["remote", "set-url", "origin", new_url], cwd=self.target_dir)
            else:
                ok, _, err = run_git_command(["remote", "add", "origin", new_url], cwd=self.target_dir)

            if ok:
                self.log(f"コミット先URLを変更しました: {new_url}", "SUCCESS")
                self.refresh_status()
            else:
                self.log(f"URL変更失敗: {err}", "ERROR")

    def log(self, message, level="INFO"):
        """ログ領域への出力メッセージ追加"""
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        prefix = f"[{timestamp}] [{level}] "
        full_msg = f"{prefix}{message}\n"

        self.log_text.insert(tk.END, full_msg)
        self.log_text.see(tk.END)

    def clear_log(self):
        self.log_text.delete("1.0", tk.END)

    def refresh_status(self):
        """選択中ディレクトリのブランチ名・リモートURL・未コミット変更ファイルの取得"""
        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=self.target_dir)
        if not is_git:
            self.branch_badge.config(text="git未初期化", bg="#991b1b", fg="#fecaca")
            self.url_lbl.config(text="コミット先URL (origin): 未設定")
            self.remote_url = "未設定"
            self.file_list_text.config(state=tk.NORMAL)
            self.file_list_text.delete("1.0", tk.END)
            self.file_list_text.insert(tk.END, "⚠️ 選択されたフォルダはGitリポジトリではありません。(URL変更時またはPush時に自動初期化可能)")
            self.file_list_text.config(state=tk.DISABLED)
            return

        _, branch, _ = run_git_command(["rev-parse", "--abbrev-ref", "HEAD"], cwd=self.target_dir)
        self.current_branch = branch or "main"
        self.branch_badge.config(text=f"branch: {self.current_branch}", bg="#312e81", fg="#e0e7ff")

        ok_url, url_out, _ = run_git_command(["remote", "get-url", "origin"], cwd=self.target_dir)
        if ok_url and url_out:
            self.remote_url = url_out
            self.url_lbl.config(text=f"コミット先URL (origin): {self.remote_url}")
        else:
            self.remote_url = "未設定"
            self.url_lbl.config(text="コミット先URL (origin): 未設定 (右のURL変更ボタンで登録できます)")

        _, status_out, _ = run_git_command(["status", "--porcelain"], cwd=self.target_dir)
        self.file_list_text.config(state=tk.NORMAL)
        self.file_list_text.delete("1.0", tk.END)

        if status_out:
            self.file_list_text.insert(tk.END, status_out)
        else:
            self.file_list_text.insert(
                tk.END, "(変更されたファイルはありません。Working tree clean)"
            )

        self.file_list_text.config(state=tk.DISABLED)

    def on_manual_push_click(self):
        """「今すぐコミット & Push 実行」ボタンクリック時の処理"""
        if not self.ensure_git_repo():
            return

        msg = self.entry_msg.get().strip()

        self.btn_push.config(state=tk.DISABLED, bg="#475569")
        threading.Thread(
            target=self._run_commit_push_thread, args=(msg,), daemon=True
        ).start()

    def _run_commit_push_thread(self, custom_message):
        try:
            self.log(f"[{self.target_dir}] の変更をチェック中...")

            _, status_out, _ = run_git_command(["status", "--porcelain"], cwd=self.target_dir)
            if not status_out.strip():
                self.log("変更されたファイルがないため、処理をスキップしました。", "INFO")
                self.root.after(0, self._finish_push_thread)
                return

            # 1. git add .
            self.log("git add . を実行中...", "RUN")
            ok, _, err = run_git_command(["add", "."], cwd=self.target_dir)
            if not ok:
                self.log(f"git add 失敗: {err}", "ERROR")
                self.root.after(0, self._finish_push_thread)
                return

            # 2. git commit
            msg = (
                custom_message
                if custom_message
                else f"Auto commit: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            )
            self.log(f"git commit -m '{msg}' を実行中...", "RUN")
            ok, out, err = run_git_command(["commit", "-m", msg], cwd=self.target_dir)
            if not ok:
                self.log(f"git commit 失敗: {err}", "ERROR")
                self.root.after(0, self._finish_push_thread)
                return
            self.log(
                f"コミット成功: {out.splitlines()[0] if out else ''}", "OK"
            )

            # 3. git push
            self.log(
                f"git push origin {self.current_branch} を実行中...", "RUN"
            )
            ok, out, err = run_git_command(
                ["push", "origin", self.current_branch], cwd=self.target_dir
            )
            if not ok:
                ok, out, err = run_git_command(
                    ["push", "-u", "origin", self.current_branch], cwd=self.target_dir
                )

            if ok:
                self.log("🎉 GitHubへの Push が正常に完了しました！", "SUCCESS")
                self.root.after(
                    0, lambda: self.entry_msg.delete(0, tk.END)
                )
            else:
                self.log(f"Push失敗: {err}", "ERROR")

        finally:
            self.root.after(0, self._finish_push_thread)

    def _finish_push_thread(self):
        self.btn_push.config(state=tk.NORMAL, bg=self.accent_color)
        self.refresh_status()

    def toggle_watch_mode(self):
        """自動同期のON/OFF切り替え"""
        if not self.ensure_git_repo():
            return

        if self.is_watching:
            self.is_watching = False
            self.btn_watch_toggle.config(
                text="自動同期を開始", bg=self.success_color
            )
            self.watch_status_lbl.config(text="ステータス: 停止中")
            self.log("自動同期（監視モード）を停止しました。", "INFO")
        else:
            self.is_watching = True
            self.btn_watch_toggle.config(
                text="自動同期を停止", bg=self.error_color
            )

            interval_str = self.combo_interval.get()
            minutes = int(interval_str.replace("分", ""))
            interval_sec = minutes * 60

            self.watch_status_lbl.config(
                text=f"ステータス: 稼働中 ({interval_str}間隔)"
            )
            self.log(
                f"自動同期（監視モード）を開始しました (対象: {self.target_dir}, 間隔: {interval_str})",
                "INFO",
            )

            threading.Thread(
                target=self._watch_loop, args=(interval_sec,), daemon=True
            ).start()

    def _watch_loop(self, interval_sec):
        while self.is_watching:
            self._run_commit_push_thread("")
            for _ in range(interval_sec):
                if not self.is_watching:
                    break
                time.sleep(1)


def main():
    initial_dir = sys.argv[1] if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]) else None
    root = tk.Tk()
    app = GitAutoCommitGUI(root, initial_dir=initial_dir)
    root.mainloop()


if __name__ == "__main__":
    main()
