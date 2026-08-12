#!/usr/bin/env python3
"""
Auto Git Commit & Push GUI Tool (Flet Modern UI Edition)
Flet (Flutter for Python) を活用したモダン・高精細なGit自動化デスクトップアプリ
"""

import datetime
import json
import os
import subprocess
import sys
import threading
import time
import tkinter as tk
from tkinter import filedialog
import flet as ft

# ==========================================
# Windows 高DPI (スケーリング・拡大率) 対応 (プロセス全体)
# ==========================================
if sys.platform == "win32":
    try:
        import ctypes
        # Process Per Monitor DPI Aware (Windows 8.1 / 10 / 11)
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

# 履歴設定ファイルのパス
HISTORY_FILE = os.path.expanduser("~/.git_auto_commit_history.json")


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


def load_history():
    """履歴データ (dir -> url, url -> dir) の読み込み"""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
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


def main(page: ft.Page):
    page.title = "Git Auto Commit & Push"
    page.theme_mode = ft.ThemeMode.DARK
    page.padding = 20
    page.spacing = 14
    page.window.width = 860
    page.window.height = 880
    page.window.min_width = 720
    page.window.min_height = 650
    page.scroll = ft.ScrollMode.AUTO

    # Flet テーマカラーの設定
    page.theme = ft.Theme(
        color_scheme_seed="indigo",
        visual_density=ft.VisualDensity.COMFORTABLE,
    )

    # Flet ダイアログ表示・開閉ヘルパー関数 (互換性担保)
    def open_dialog(dialog):
        page.dialog = dialog
        dialog.open = True
        page.update()

    def close_dialog(dialog):
        if page.dialog:
            page.dialog.open = False
            page.update()

    # アプリの状態データ
    history = load_history()
    target_dir = [os.path.abspath(sys.argv[1] if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]) else os.getcwd())]
    current_branch = ["main"]
    remote_url = ["未設定"]
    is_watching = [False]

    # -------------------------------------------------------------
    # ログ出力関数
    # -------------------------------------------------------------
    log_list_view = ft.ListView(expand=True, spacing=6, padding=10, auto_scroll=True)

    def log(message: str, level: str = "INFO"):
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        text_color = "grey300"
        icon = ft.Icons.INFO_OUTLINED
        icon_color = "blue400"

        if level == "RUN":
            icon = ft.Icons.PLAY_ARROW_ROUNDED
            icon_color = "indigo400"
        elif level == "SUCCESS" or level == "OK":
            icon = ft.Icons.CHECK_CIRCLE_ROUNDED
            icon_color = "green400"
            text_color = "green200"
        elif level == "ERROR":
            icon = ft.Icons.ERROR_ROUNDED
            icon_color = "red400"
            text_color = "red200"
        elif level == "WARNING":
            icon = ft.Icons.WARNING_ROUNDED
            icon_color = "amber400"
            text_color = "amber200"

        log_item = ft.Container(
            content=ft.Row(
                [
                    ft.Icon(name=icon, color=icon_color, size=16),
                    ft.Text(f"[{timestamp}]", size=12, color="grey500", weight=ft.FontWeight.BOLD),
                    ft.Text(message, size=12, color=text_color, selectable=True, expand=True),
                ],
                tight=True,
                spacing=8,
            ),
            padding=ft.Padding(4, 2, 4, 2),
            border_radius=4,
        )
        log_list_view.controls.append(log_item)
        try:
            page.update()
        except Exception:
            pass

    def clear_log(e=None):
        log_list_view.controls.clear()
        page.update()

    # -------------------------------------------------------------
    # 履歴保存＆コンボボックス同期
    # -------------------------------------------------------------
    def record_pair_history(directory, url):
        if not directory:
            return
        norm_dir = os.path.abspath(directory)
        if "dir_to_url" not in history:
            history["dir_to_url"] = {}
        if "url_to_dir" not in history:
            history["url_to_dir"] = {}

        if url and url != "未設定":
            history["dir_to_url"][norm_dir] = url
            history["url_to_dir"][url] = norm_dir

        save_history(history)
        update_history_dropdown()

    def update_history_dropdown():
        dir_to_url = history.get("dir_to_url", {})
        options = []
        for d, u in dir_to_url.items():
            folder_name = os.path.basename(d) or d
            repo_name = u.split("/")[-1].replace(".git", "") if u else "未設定"
            options.append(ft.dropdown.Option(key=d, text=f"{folder_name}  ➔  {repo_name}  ({d})"))

        history_dropdown.options = options
        if target_dir[0] in dir_to_url:
            history_dropdown.value = target_dir[0]
        try:
            page.update()
        except Exception:
            pass

    # -------------------------------------------------------------
    # UI要素の参照
    # -------------------------------------------------------------
    branch_chip = ft.Container(
        content=ft.Row(
            [
                ft.Icon(ft.Icons.MERGE_TYPE_ROUNDED, size=14, color="indigo100"),
                ft.Text("branch: main", size=12, weight=ft.FontWeight.BOLD, color="indigo100"),
            ],
            spacing=4,
        ),
        bgcolor="indigo900",
        padding=ft.Padding(10, 4, 10, 4),
        border_radius=12,
    )

    repo_path_text = ft.Text(f"対象: {target_dir[0]}", size=13, color="grey300", weight=ft.FontWeight.W_500, overflow=ft.TextOverflow.ELLIPSIS)
    remote_url_text = ft.Text("コミット先URL (origin): 未設定", size=13, color="grey400", overflow=ft.TextOverflow.ELLIPSIS)

    file_list_column = ft.Column(spacing=4)
    file_status_card_title = ft.Text("未コミットの変更ファイル", size=14, weight=ft.FontWeight.BOLD)

    commit_msg_input = ft.TextField(
        hint_text="コミットメッセージを入力（空欄の場合は自動で現在日時が適用されます）",
        border_color="bluegrey700",
        focused_border_color="indigo400",
        text_size=14,
        content_padding=14,
        expand=True,
    )

    push_btn_inner_row = ft.Row(
        [
            ft.Icon(ft.Icons.ROCKET_LAUNCH_ROUNDED, size=18),
            ft.Text("今すぐコミット & Push 実行", size=14, weight=ft.FontWeight.BOLD),
        ],
        alignment=ft.MainAxisAlignment.CENTER,
    )

    btn_push = ft.FilledButton(
        content=push_btn_inner_row,
        style=ft.ButtonStyle(
            color="white",
            bgcolor="indigo600",
            shape=ft.RoundedRectangleBorder(radius=8),
            padding=ft.Padding(16, 16, 16, 16),
        ),
        on_click=lambda e: on_manual_push_click(),
    )

    interval_dropdown = ft.Dropdown(
        options=[
            ft.dropdown.Option("1分"),
            ft.dropdown.Option("3分"),
            ft.dropdown.Option("5分"),
            ft.dropdown.Option("10分"),
            ft.dropdown.Option("30分"),
        ],
        value="5分",
        width=100,
        text_size=13,
        content_padding=8,
    )

    watch_switch = ft.Switch(
        label="自動同期を開始",
        value=False,
        active_color="green400",
        on_change=lambda e: toggle_watch_mode(),
    )

    watch_status_text = ft.Text("ステータス: 停止中", size=12, color="grey400")

    # -------------------------------------------------------------
    # ステータス更新 & Git処理
    # -------------------------------------------------------------
    def refresh_status():
        curr_dir = target_dir[0]
        repo_path_text.value = f"対象: {curr_dir}"

        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=curr_dir)
        if not is_git:
            branch_chip.content.controls[1].value = "git未初期化"
            branch_chip.bgcolor = "red900"
            remote_url_text.value = "コミット先URL (origin): 未設定"
            remote_url[0] = "未設定"

            file_list_column.controls = [
                ft.Container(
                    content=ft.Row(
                        [
                            ft.Icon(ft.Icons.WARNING_AMBER_ROUNDED, color="amber400", size=18),
                            ft.Text("選択されたフォルダはGitリポジトリではありません。(URL変更時またはPush時に自動初期化可能)", color="amber200", size=13),
                        ],
                        spacing=8,
                    ),
                    padding=10,
                    bgcolor="bluegrey900",
                    border_radius=6,
                )
            ]
            update_history_dropdown()
            page.update()
            return

        # ブランチ名取得
        _, branch, _ = run_git_command(["rev-parse", "--abbrev-ref", "HEAD"], cwd=curr_dir)
        current_branch[0] = branch or "main"
        branch_chip.content.controls[1].value = f"branch: {current_branch[0]}"
        branch_chip.bgcolor = "indigo900"

        # リモートURL取得
        ok_url, url_out, _ = run_git_command(["remote", "get-url", "origin"], cwd=curr_dir)
        if ok_url and url_out:
            remote_url[0] = url_out
            remote_url_text.value = f"コミット先URL (origin): {remote_url[0]}"
            record_pair_history(curr_dir, remote_url[0])
        else:
            remote_url[0] = "未設定"
            saved_url = history.get("dir_to_url", {}).get(curr_dir)
            if saved_url:
                run_git_command(["remote", "add", "origin", saved_url], cwd=curr_dir)
                remote_url[0] = saved_url
                remote_url_text.value = f"コミット先URL (origin): {remote_url[0]} (履歴から自動セット)"
                log(f"✨ 保存されていたURL ({saved_url}) をリモートoriginに自動適用しました！", "SUCCESS")
            else:
                remote_url_text.value = "コミット先URL (origin): 未設定 (右の「URL変更」から設定可能)"

        # 未コミットファイルのチェック
        _, status_out, _ = run_git_command(["status", "--porcelain"], cwd=curr_dir)
        file_list_column.controls.clear()

        if status_out.strip():
            lines = status_out.strip().splitlines()
            for line in lines:
                status_code = line[:2].strip()
                file_name = line[3:].strip()
                badge_color = "blue400"
                if "M" in status_code:
                    badge_color = "amber400"
                elif "A" in status_code or "?" in status_code:
                    badge_color = "green400"
                elif "D" in status_code:
                    badge_color = "red400"

                file_item = ft.Container(
                    content=ft.Row(
                        [
                            ft.Container(
                                content=ft.Text(status_code if status_code else "M", size=10, weight=ft.FontWeight.BOLD, color="black"),
                                bgcolor=badge_color,
                                padding=ft.Padding(6, 2, 6, 2),
                                border_radius=4,
                            ),
                            ft.Text(file_name, size=13, color="grey200", font_family="Consolas"),
                        ],
                        spacing=10,
                    ),
                    padding=ft.Padding(8, 4, 8, 4),
                )
                file_list_column.controls.append(file_item)
        else:
            file_list_column.controls = [
                ft.Container(
                    content=ft.Row(
                        [
                            ft.Icon(ft.Icons.CHECK_ROUNDED, color="green400", size=18),
                            ft.Text("変更されたファイルはありません (Working tree clean)", color="green300", size=13),
                        ],
                        spacing=8,
                    ),
                    padding=10,
                    bgcolor="bluegrey900",
                    border_radius=6,
                )
            ]

        update_history_dropdown()
        page.update()

    # -------------------------------------------------------------
    # 自動 git init ダイアログハンドラ
    # -------------------------------------------------------------
    def ensure_git_repo():
        curr_dir = target_dir[0]
        is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=curr_dir)
        if not is_git:
            def on_confirm(e):
                close_dialog(dlg)
                ok_init, _, err_init = run_git_command(["init"], cwd=curr_dir)
                if ok_init:
                    run_git_command(["branch", "-M", "main"], cwd=curr_dir)
                    log(f"Gitリポジトリを初期化しました (git init): {curr_dir}", "SUCCESS")
                    refresh_status()
                else:
                    log(f"Git初期化失敗: {err_init}", "ERROR")

            dlg = ft.AlertDialog(
                title=ft.Text("Git初期化の確認"),
                content=ft.Text(f"選択されたフォルダはまだGit管理されていません。\n\n対象フォルダ:\n{curr_dir}\n\nこのフォルダで 'git init' を実行しますか？"),
                actions=[
                    ft.TextButton("キャンセル", on_click=lambda e: close_dialog(dlg)),
                    ft.FilledButton("Git初期化を実行", on_click=on_confirm, style=ft.ButtonStyle(bgcolor="indigo600", color="white")),
                ],
            )
            open_dialog(dlg)
            return False
        return True

    # -------------------------------------------------------------
    # フォルダ選択 (高画質ネイティブダイアログ) / URL変更 / 履歴選択
    # -------------------------------------------------------------
    def select_folder_native(e=None):
        def _pick():
            # スレッド内でも高DPI有効化を確保
            if sys.platform == "win32":
                try:
                    import ctypes
                    ctypes.windll.shcore.SetProcessDpiAwareness(2)
                except Exception:
                    pass

            root = tk.Tk()
            root.withdraw()
            root.attributes("-topmost", True)
            chosen = filedialog.askdirectory(
                title="コミット対象フォルダの選択",
                initialdir=target_dir[0],
            )
            root.destroy()
            if chosen:
                target_dir[0] = os.path.abspath(chosen)
                log(f"操作対象フォルダを変更しました: {target_dir[0]}", "INFO")
                refresh_status()

        threading.Thread(target=_pick, daemon=True).start()

    def on_history_selected(e):
        selected_path = e.control.value or history_dropdown.value
        if selected_path and os.path.exists(selected_path):
            target_dir[0] = os.path.abspath(selected_path)
            log(f"過去の履歴からリポジトリを選択しました: {target_dir[0]}", "INFO")

            # 保存されていたURLがあれば取得してリモートに自動適用
            saved_url = history.get("dir_to_url", {}).get(target_dir[0])
            is_git, _, _ = run_git_command(["rev-parse", "--is-inside-work-tree"], cwd=target_dir[0])
            if is_git and saved_url:
                ok_curr, curr_url, _ = run_git_command(["remote", "get-url", "origin"], cwd=target_dir[0])
                if not ok_curr:
                    run_git_command(["remote", "add", "origin", saved_url], cwd=target_dir[0])
                    log(f"✨ 履歴からリモートURL ({saved_url}) を登録しました！", "SUCCESS")
                elif curr_url != saved_url:
                    run_git_command(["remote", "set-url", "origin", saved_url], cwd=target_dir[0])
                    log(f"✨ 履歴からリモートURL ({saved_url}) を自動変更適用しました！", "SUCCESS")

            refresh_status()

    history_dropdown = ft.Dropdown(
        hint_text="選択してください...",
        border_color="bluegrey700",
        focused_border_color="indigo400",
        text_size=13,
        content_padding=10,
        expand=True,
    )
    history_dropdown.on_change = on_history_selected

    def change_remote_url():
        if not ensure_git_repo():
            return

        url_input = ft.TextField(
            label="新しいGitHubリポジトリURL",
            value=remote_url[0] if remote_url[0] != "未設定" else "https://github.com/",
            autofocus=True,
        )

        def save_url(e):
            new_url = url_input.value.strip()
            close_dialog(dlg)
            if new_url:
                curr_dir = target_dir[0]
                ok_check, _, _ = run_git_command(["remote", "get-url", "origin"], cwd=curr_dir)
                if ok_check:
                    ok, _, err = run_git_command(["remote", "set-url", "origin", new_url], cwd=curr_dir)
                else:
                    ok, _, err = run_git_command(["remote", "add", "origin", new_url], cwd=curr_dir)

                if ok:
                    log(f"コミット先URLを変更しました: {new_url}", "SUCCESS")
                    record_pair_history(curr_dir, new_url)
                    refresh_status()
                else:
                    log(f"URL変更失敗: {err}", "ERROR")

        dlg = ft.AlertDialog(
            title=ft.Text("コミット先URLの変更"),
            content=ft.Container(content=url_input, width=450),
            actions=[
                ft.TextButton("キャンセル", on_click=lambda e: close_dialog(dlg)),
                ft.FilledButton("保存", on_click=save_url, style=ft.ButtonStyle(bgcolor="indigo600", color="white")),
            ],
        )
        open_dialog(dlg)

    # -------------------------------------------------------------
    # コミット & Push スレッド
    # -------------------------------------------------------------
    def on_manual_push_click():
        if not ensure_git_repo():
            return

        msg = commit_msg_input.value.strip()
        btn_push.disabled = True
        push_btn_inner_row.controls[0] = ft.ProgressRing(width=16, height=16, stroke_width=2, color="white")
        page.update()

        threading.Thread(target=run_commit_push_worker, args=(msg,), daemon=True).start()

    def run_commit_push_worker(custom_message):
        curr_dir = target_dir[0]
        try:
            log(f"[{curr_dir}] の変更をチェック中...")

            _, status_out, _ = run_git_command(["status", "--porcelain"], cwd=curr_dir)
            has_changes = bool(status_out.strip())

            if has_changes:
                log("git add . を実行中...", "RUN")
                ok, _, err = run_git_command(["add", "."], cwd=curr_dir)
                if not ok:
                    log(f"git add 失敗: {err}", "ERROR")
                    return
            else:
                log("変更ファイルなし。空コミット (--allow-empty) で記録します。", "INFO")

            msg = custom_message if custom_message else f"Auto commit: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            commit_args = ["commit", "-m", msg]
            if not has_changes:
                commit_args.append("--allow-empty")

            log(f"git commit -m '{msg}' を実行中...", "RUN")
            ok, out, err = run_git_command(commit_args, cwd=curr_dir)
            if not ok:
                log(f"git commit 失敗: {err}", "ERROR")
                return

            log(f"コミット成功: {out.splitlines()[0] if out else ''}", "OK")

            log(f"git push origin {current_branch[0]} を実行中...", "RUN")
            ok, out, err = run_git_command(["push", "origin", current_branch[0]], cwd=curr_dir)
            if not ok:
                ok, out, err = run_git_command(["push", "-u", "origin", current_branch[0]], cwd=curr_dir)

            if not ok and "fetch first" in err:
                log("リモートに既存の履歴があります。自動統合を試みます (pull --allow-unrelated-histories)...", "RUN")
                ok_pull, _, _ = run_git_command(["pull", "origin", current_branch[0], "--allow-unrelated-histories", "--no-edit"], cwd=curr_dir)
                if ok_pull:
                    ok, out, err = run_git_command(["push", "origin", current_branch[0]], cwd=curr_dir)

            if ok:
                log("🎉 GitHubへの Push が正常に完了しました！", "SUCCESS")
                record_pair_history(curr_dir, remote_url[0])
                commit_msg_input.value = ""
            else:
                log(f"Push失敗: {err}", "ERROR")

        finally:
            btn_push.disabled = False
            push_btn_inner_row.controls[0] = ft.Icon(ft.Icons.ROCKET_LAUNCH_ROUNDED, size=18)
            refresh_status()

    # -------------------------------------------------------------
    # 自動監視スレッド
    # -------------------------------------------------------------
    def toggle_watch_mode():
        if not ensure_git_repo():
            watch_switch.value = False
            page.update()
            return

        if is_watching[0]:
            is_watching[0] = False
            watch_switch.label = "自動同期を開始"
            watch_status_text.value = "ステータス: 停止中"
            log("自動同期（監視モード）を停止しました。", "INFO")
        else:
            is_watching[0] = True
            watch_switch.label = "自動同期を停止"
            interval_str = interval_dropdown.value
            minutes = int(interval_str.replace("分", ""))
            interval_sec = minutes * 60

            watch_status_text.value = f"ステータス: 稼働中 ({interval_str}間隔)"
            log(f"自動同期（監視モード）を開始しました (対象: {target_dir[0]}, 間隔: {interval_str})", "INFO")
            threading.Thread(target=watch_loop, args=(interval_sec,), daemon=True).start()

        page.update()

    def watch_loop(interval_sec):
        while is_watching[0]:
            run_commit_push_worker("")
            for _ in range(interval_sec):
                if not is_watching[0]:
                    break
                time.sleep(1)

    # -------------------------------------------------------------
    # レイアウトの組み立て (マテリアルデザイン3 カード)
    # -------------------------------------------------------------
    page.add(
        # 1. ヘッダーカード
        ft.Card(
            content=ft.Container(
                content=ft.Column(
                    [
                        ft.Row(
                            [
                                ft.Row(
                                    [
                                        ft.Icon(ft.Icons.AUTO_AWESOME_ROUNDED, color="indigo400", size=24),
                                        ft.Text("Git Auto Commit & Push", size=18, weight=ft.FontWeight.BOLD),
                                    ],
                                    spacing=8,
                                ),
                                branch_chip,
                            ],
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                        ),
                        ft.Divider(height=1, color="bluegrey800"),
                        ft.Row(
                            [
                                ft.Text("過去の履歴から切替:", size=13, weight=ft.FontWeight.W_500, color="grey300"),
                                history_dropdown,
                            ],
                            alignment=ft.MainAxisAlignment.START,
                        ),
                        ft.Row(
                            [
                                ft.Icon(ft.Icons.FOLDER_ROUNDED, size=16, color="indigo300"),
                                repo_path_text,
                                ft.OutlinedButton(
                                    "フォルダ参照",
                                    icon=ft.Icons.FOLDER_OPEN_ROUNDED,
                                    on_click=select_folder_native,
                                ),
                            ],
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                        ),
                        ft.Row(
                            [
                                ft.Icon(ft.Icons.LINK_ROUNDED, size=16, color="indigo300"),
                                remote_url_text,
                                ft.OutlinedButton(
                                    "URL変更",
                                    icon=ft.Icons.EDIT_ROUNDED,
                                    on_click=lambda e: change_remote_url(),
                                ),
                            ],
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                        ),
                    ],
                    spacing=12,
                ),
                padding=16,
            ),
            elevation=2,
        ),

        # 2. 未コミット変更ファイルカード
        ft.Card(
            content=ft.Container(
                content=ft.Column(
                    [
                        ft.Row(
                            [
                                ft.Row(
                                    [
                                        ft.Icon(ft.Icons.INSERT_DRIVE_FILE_OUTLINED, size=18, color="indigo300"),
                                        file_status_card_title,
                                    ],
                                    spacing=8,
                                ),
                                ft.IconButton(
                                    icon=ft.Icons.REFRESH_ROUNDED,
                                    tooltip="ステータス更新",
                                    on_click=lambda e: refresh_status(),
                                ),
                            ],
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                        ),
                        file_list_column,
                    ],
                    spacing=10,
                ),
                padding=16,
            ),
            elevation=2,
        ),

        # 3. 手動コミット＆Pushカード
        ft.Card(
            content=ft.Container(
                content=ft.Column(
                    [
                        ft.Text("コミットメッセージ", size=14, weight=ft.FontWeight.BOLD),
                        commit_msg_input,
                        btn_push,
                    ],
                    spacing=12,
                ),
                padding=16,
            ),
            elevation=2,
        ),

        # 4. 自動監視カード
        ft.Card(
            content=ft.Container(
                content=ft.Column(
                    [
                        ft.Row(
                            [
                                ft.Row(
                                    [
                                        ft.Icon(ft.Icons.TIMER_OUTLINED, size=18, color="indigo300"),
                                        ft.Text("自動同期 (定期監視)", size=14, weight=ft.FontWeight.BOLD),
                                    ],
                                    spacing=8,
                                ),
                                ft.Row(
                                    [
                                        ft.Text("間隔:", size=13),
                                        interval_dropdown,
                                        watch_switch,
                                    ],
                                    spacing=12,
                                ),
                            ],
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                        ),
                        watch_status_text,
                    ],
                    spacing=8,
                ),
                padding=16,
            ),
            elevation=2,
        ),

        # 5. ログ表示カード
        ft.Card(
            content=ft.Container(
                content=ft.Column(
                    [
                        ft.Row(
                            [
                                ft.Row(
                                    [
                                        ft.Icon(ft.Icons.TERMINAL_ROUNDED, size=18, color="indigo300"),
                                        ft.Text("実行ログ", size=14, weight=ft.FontWeight.BOLD),
                                    ],
                                    spacing=8,
                                ),
                                ft.IconButton(
                                    icon=ft.Icons.DELETE_SWEEP_ROUNDED,
                                    tooltip="ログクリア",
                                    on_click=clear_log,
                                ),
                            ],
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                        ),
                        ft.Container(
                            content=log_list_view,
                            bgcolor="black",
                            border_radius=8,
                            height=160,
                            padding=4,
                        ),
                    ],
                    spacing=8,
                ),
                padding=16,
            ),
            elevation=2,
        ),
    )

    # 初期化ステータスロード
    refresh_status()


if __name__ == "__main__":
    ft.app(target=main)
