#!/usr/bin/env python3
"""
Auto Git Commit & Push Tool
PythonスクリプトによるGitコミット・プッシュ自動化ツール

使い方:
  1. 単発で変更を自動コミット＆プッシュ:
     python auto_commit.py

  2. メッセージを指定してコミット＆プッシュ:
     python auto_commit.py -m "機能追加: AIヒントの改善"

  3. 自動監視モード (5分ごとに変更をチェックして自動同期):
     python auto_commit.py --watch
"""

import argparse
import datetime
import os
import subprocess
import sys
import time

# Windows環境でのコンソール文字化け対策
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass


def run_git_command(args, cwd=None):
    """Gitコマンドを実行し、結果を返すヘルパー関数"""
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


def has_changes():
    """未コミットの変更があるかチェック"""
    success, stdout, _ = run_git_command(["status", "--porcelain"])
    return success and len(stdout.strip()) > 0


def auto_commit_and_push(commit_message=None):
    """git add -> git commit -> git push を一括自動実行"""
    print("[INFO] 作業ディレクトリの変更をチェック中...")

    if not has_changes():
        print("[INFO] 変更されたファイルはありません。コミットをスキップします。")
        return True

    # 1. git add .
    print("[RUN] 変更されたファイルをステージング中 (git add .)...")
    success, _, stderr = run_git_command(["add", "."])
    if not success:
        print(f"[ERROR] git add に失敗しました: {stderr}")
        return False

    # 2. コミットメッセージの作成
    if not commit_message:
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_message = f"Auto commit: {now_str}"

    # 3. git commit
    print(f"[RUN] コミットを作成中: '{commit_message}'...")
    success, stdout, stderr = run_git_command(["commit", "-m", commit_message])
    if not success:
        print(f"[ERROR] git commit に失敗しました: {stderr}")
        return False
    print(f"[OK] コミット完了: {stdout.splitlines()[0] if stdout else ''}")

    # 4. 現在のブランチ名を取得
    _, branch_name, _ = run_git_command(["rev-parse", "--abbrev-ref", "HEAD"])
    branch_name = branch_name or "main"

    # 5. git push
    print(f"[RUN] GitHubへプッシュ中 (git push origin {branch_name})...")
    success, stdout, stderr = run_git_command(["push", "origin", branch_name])
    if not success:
        # 初回で -u を試す
        success, stdout, stderr = run_git_command(["push", "-u", "origin", branch_name])

    if success:
        print("[SUCCESS] GitHubへのアップロード（Push）が成功しました！")
        return True
    else:
        print(f"[WARNING] Push中にエラーが発生しました:\n{stderr}")
        print("[HINT] GitHubへのログイン認証が必要な場合は手動で 'git push' をお試しください。")
        return False


def start_watch_mode(interval_seconds=300):
    """一定間隔で変更を監視し、自動でコミット＆プッシュする常駐モード"""
    print(f"[INFO] 自動同期・監視モードを開始しました (間隔: {interval_seconds}秒)")
    print("停止するには [Ctrl + C] を押してください。\n")

    try:
        while True:
            now = datetime.datetime.now().strftime("%H:%M:%S")
            print(f"[{now}] 定期チェック実行中...")
            auto_commit_and_push()
            print("-" * 50)
            time.sleep(interval_seconds)
    except KeyboardInterrupt:
        print("\n[INFO] 監視モードを停止しました。")


def main():
    parser = argparse.ArgumentParser(description="Git 自動コミット＆プッシュツール")
    parser.add_argument("-m", "--message", type=str, help="コミットメッセージ指定")
    parser.add_argument(
        "--watch", action="store_true", help="常駐監視モード (デフォルト5分ごとに自動同期)"
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=300,
        help="監視モードの間隔（秒単位、デフォルト: 300秒）",
    )

    args = parser.parse_args()

    if args.watch:
        start_watch_mode(interval_seconds=args.interval)
    else:
        auto_commit_and_push(commit_message=args.message)


if __name__ == "__main__":
    main()
