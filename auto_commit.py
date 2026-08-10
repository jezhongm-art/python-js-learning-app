#!/usr/bin/env python3
"""
Auto Git Commit & Push GUI Tool
TkinterによるGitコミット・プッシュ自動化デスクトップアプリ
"""

import datetime
import os
import subprocess
import sys
import threading
import time
import tkinter as tk
from tkinter import font as tkfont
from tkinter import messagebox, ttk

# Windows環境での文字コード対策
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass


def run_git_command(args, cwd=None):
    """Gitコマンドを実行し結果を返す"""
    try:
        result = subprocess.run(
            ["git"] + args,
            cwd=cwd or os.getcwd(),
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
    def __init__(self, root):
        self.root = root
        self.root.title("Git 自動コミット & Push ツール")
        self.root.geometry("640 x 680")
        self.root.minsize(580, 550)

        # カラーテーマ設定 (Dark Slate & Indigo)
        self.bg_color = "#0f172a"  # slate-900
        self.card_bg = "#1e293b"  # slate-800
        self.text_color = "#f8fafc"  # slate-50
        self.text_muted = "#94a3b8"  # slate-400
        self.accent_color = "#6366f1"  # indigo-500
        self.accent_hover = "#4f46e5"  # indigo-600
        self.success_color = "#10b981"  # emerald-500
        self.warning_color = "#f59e0b"  # amber-500
        self.error_color = "#ef4444"  # red-500

        self.root.configure(bg=self.bg_color)

        # 状態変数
        self.is_watching = False
        self.watch_thread = None
        self.current_branch = "main"

        # UIコンポーネント構築
        self._setup_styles()
        self._create_widgets()

        # 初期ステータス取得
        self.refresh_status()

    def _setup_styles(self):
        self.style = ttk.Style()
        self.style.theme_use("clam")

        # カスタムスタイル設定
        self.style.configure(".", background=self.bg_color, foreground=self.text_color)
        self.style.configure(
            "TFrame", background=self.bg_color
        )
        self.style.configure(
            "Card.TFrame", background=self.card_bg, relief="flat", borderwidth=0
        )
        self.style.configure(
            "TLabel",
            background=self.bg_color,
            foreground=self.text_color,
            font=("Segoe UI", 9),
        )
        self.style.configure(
            "Card.TLabel",
            background=self.card_bg,
            foreground=self.text_color,
            font=("Segoe UI", 9),
        )
        self.style.configure(
            "Muted.TLabel",
            background=self.card_bg,
            foreground=self.text_muted,
            font=("Segoe UI", 8),
        )
        self.style.configure(
            "Title.TLabel",
            background=self.card_bg,
            foreground=self.text_color,
            font=("Segoe UI", 12, "bold"),
        )

    def _create_widgets(self):
        main_container = ttk.Frame(self.root, padding=16)
        main_container.pack(fill=tk.BOTH, expand=True)

        # ==========================================
        # ヘッダーカード (リポジトリ情報)
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
            fg="#c7d2fe",
            font=("Segoe UI", 8, "bold"),
            padx=8,
            pady=2,
        )
        self.branch_badge.pack(side=tk.RIGHT)

        repo_path = os.getcwd()
        repo_lbl = ttk.Label(
            header_card,
            text=f"リポジトリ: {repo_path}",
            style="Muted.TLabel",
        )
        repo_lbl.pack(anchor=tk.W, pady=(4, 0))

        # ==========================================
        # 変更ファイルステータス
        # ==========================================
        status_card = ttk.Frame(main_container, style="Card.TFrame", padding=14)
        status_card.pack(fill=tk.X, pady=(0, 12))

        status_header = ttk.Frame(status_card, style="Card.TFrame")
        status_header.pack(fill=tk.X, pady=(0, 6))

        ttk.Label(
            status_header, text="未コミットの変更ファイル", style="Title.TLabel"
        ).pack(side=tk.LEFT)

        self.btn_refresh = tk.Button(
            status_header,
            text="更新",
            bg="#334155",
            fg="#f8fafc",
            activebackground="#475569",
            activeforeground="#ffffff",
            font=("Segoe UI", 9, "bold"),
            bd=0,
            padx=10,
            pady=3,
            cursor="hand2",
            command=self.refresh_status,
        )
        self.btn_refresh.pack(side=tk.RIGHT)

        # ファイルリスト表示用テキスト
        self.file_list_text = tk.Text(
            status_card,
            height=4,
            bg="#0f172a",
            fg="#38bdf8",
            font=("Consolas", 9),
            bd=1,
            relief="solid",
            highlightthickness=0,
            padx=8,
            pady=6,
        )
        self.file_list_text.pack(fill=tk.X)

        # ==========================================
        # 手動コミット操作エリア
        # ==========================================
        action_card = ttk.Frame(main_container, style="Card.TFrame", padding=14)
        action_card.pack(fill=tk.X, pady=(0, 12))

        ttk.Label(
            action_card, text="コミットメッセージ", style="Title.TLabel"
        ).pack(anchor=tk.W, pady=(0, 6))

        msg_frame = ttk.Frame(action_card, style="Card.TFrame")
        msg_frame.pack(fill=tk.X, pady=(0, 10))

        self.entry_msg = tk.Entry(
            msg_frame,
            bg="#0f172a",
            fg="#f8fafc",
            insertbackground="#f8fafc",
            font=("Segoe UI", 10),
            bd=1,
            relief="solid",
            highlightthickness=1,
            highlightcolor=self.accent_color,
        )
        self.entry_msg.pack(fill=tk.X, ipady=5)
        self.entry_msg.insert(
            0, ""
        )  # 空欄の場合は自動で "Auto commit: YYYY-MM-DD HH:MM:SS" になります

        ttk.Label(
            action_card,
            text="※ 空欄のままで実行すると、現在日時がメッセージに自動設定されます。",
            style="Muted.TLabel",
        ).pack(anchor=tk.W, pady=(0, 10))

        self.btn_push = tk.Button(
            action_card,
            text="今すぐコミット & Push 実行",
            bg=self.accent_color,
            fg="#ffffff",
            activebackground=self.accent_hover,
            activeforeground="#ffffff",
            font=("Segoe UI", 10, "bold"),
            bd=0,
            pady=8,
            cursor="hand2",
            command=self.on_manual_push_click,
        )
        self.btn_push.pack(fill=tk.X)

        # ==========================================
        # 自動監視設定エリア
        # ==========================================
        watch_card = ttk.Frame(main_container, style="Card.TFrame", padding=14)
        watch_card.pack(fill=tk.X, pady=(0, 12))

        watch_header = ttk.Frame(watch_card, style="Card.TFrame")
        watch_header.pack(fill=tk.X)

        ttk.Label(
            watch_header, text="自動同期 (定期監視)", style="Title.TLabel"
        ).pack(side=tk.LEFT)

        # 間隔選択プルダウン
        ttk.Label(watch_header, text="実行間隔:", style="Card.TLabel").pack(
            side=tk.LEFT, padx=(16, 4)
        )
        self.combo_interval = ttk.Combobox(
            watch_header,
            values=["1分", "3分", "5分", "10分", "30分"],
            width=6,
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
            font=("Segoe UI", 9, "bold"),
            bd=0,
            padx=12,
            pady=4,
            cursor="hand2",
            command=self.toggle_watch_mode,
        )
        self.btn_watch_toggle.pack(side=tk.RIGHT)

        self.watch_status_lbl = ttk.Label(
            watch_card,
            text="ステータス: 停止中",
            style="Muted.TLabel",
        )
        self.watch_status_lbl.pack(anchor=tk.W, pady=(6, 0))

        # ==========================================
        # ログ表示エリア
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
            fg="#94a3b8",
            activebackground="#475569",
            font=("Segoe UI", 8),
            bd=0,
            padx=6,
            pady=1,
            command=self.clear_log,
        )
        btn_clear_log.pack(side=tk.RIGHT)

        self.log_text = tk.Text(
            log_card,
            bg="#020617",
            fg="#cbd5e1",
            font=("Consolas", 8),
            bd=0,
            padx=8,
            pady=6,
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)

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
        """現在のブランチと未コミット変更ファイルの取得"""
        # ブランチ名取得
        _, branch, _ = run_git_command(["rev-parse", "--abbrev-ref", "HEAD"])
        self.current_branch = branch or "main"
        self.branch_badge.config(text=f"branch: {self.current_branch}")

        # 未コミットファイルのチェック
        _, status_out, _ = run_git_command(["status", "--porcelain"])
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
        """「今すぐコミット & Push 実行」ボタンが押された時の処理」"""
        msg = self.entry_msg.get().strip()

        # スレッドで非同期にコミット＆Pushを実行
        self.btn_push.config(state=tk.DISABLED, bg="#475569")
        threading.Thread(
            target=self._run_commit_push_thread, args=(msg,), daemon=True
        ).start()

    def _run_commit_push_thread(self, custom_message):
        try:
            self.log("作業ディレクトリの変更をチェック中...")

            # 変更があるか確認
            _, status_out, _ = run_git_command(["status", "--porcelain"])
            if not status_out.strip():
                self.log("変更されたファイルがないため、処理をスキップしました。", "INFO")
                self.root.after(0, self._finish_push_thread)
                return

            # 1. git add .
            self.log("git add . を実行中...", "RUN")
            ok, _, err = run_git_command(["add", "."])
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
            ok, out, err = run_git_command(["commit", "-m", msg])
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
                ["push", "origin", self.current_branch]
            )
            if not ok:
                # 初回対策 -u
                ok, out, err = run_git_command(
                    ["push", "-u", "origin", self.current_branch]
                )

            if ok:
                self.log("🎉 GitHubへの Push が正常に完了しました！", "SUCCESS")
                self.root.after(
                    0, lambda: self.entry_msg.delete(0, tk.END)
                )  # 入力欄をクリア
            else:
                self.log(f"Push失敗: {err}", "ERROR")

        finally:
            self.root.after(0, self._finish_push_thread)

    def _finish_push_thread(self):
        self.btn_push.config(state=tk.NORMAL, bg=self.accent_color)
        self.refresh_status()

    def toggle_watch_mode(self):
        """自動同期のON/OFF切り替え"""
        if self.is_watching:
            # 停止
            self.is_watching = False
            self.btn_watch_toggle.config(
                text="自動同期を開始", bg=self.success_color
            )
            self.watch_status_lbl.config(text="ステータス: 停止中")
            self.log("自動同期（監視モード）を停止しました。", "INFO")
        else:
            # 開始
            self.is_watching = True
            self.btn_watch_toggle.config(
                text="自動同期を停止", bg=self.error_color
            )

            # 間隔の計算
            interval_str = self.combo_interval.get()
            minutes = int(interval_str.replace("分", ""))
            interval_sec = minutes * 60

            self.watch_status_lbl.config(
                text=f"ステータス: 稼働中 ({interval_str}間隔)"
            )
            self.log(
                f"自動同期（監視モード）を開始しました (間隔: {interval_str})",
                "INFO",
            )

            # スレッド開始
            threading.Thread(
                target=self._watch_loop, args=(interval_sec,), daemon=True
            ).start()

    def _watch_loop(self, interval_sec):
        while self.is_watching:
            # 定期実行
            self._run_commit_push_thread("")
            # カウントダウンしながら待機
            for _ in range(interval_sec):
                if not self.is_watching:
                    break
                time.sleep(1)


def main():
    root = tk.Tk()
    app = GitAutoCommitGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
