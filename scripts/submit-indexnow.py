"""
IndexNow URL 提交脚本
用法:
  python scripts/submit-indexnow.py --all
  python scripts/submit-indexnow.py --url <URL>
  python scripts/submit-indexnow.py --file <path>
  python scripts/submit-indexnow.py --recent [天数]
  python scripts/submit-indexnow.py --dry-run

环境变量:
  INDEXNOW_KEY     IndexNow API 密钥（必填）
  INDEXNOW_HOST    站点域名（默认 upxuu.com）
  INDEXNOW_BASE   站点基础 URL（默认 https://upxuu.com）
"""

import argparse
import json
import os
import subprocess
import sys
import io
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).resolve().parent.parent

def get_config():
    key = os.environ.get("INDEXNOW_KEY")
    if not key:
        print("\033[91m[ERROR] 请设置环境变量 INDEXNOW_KEY\033[0m")
        print("  set INDEXNOW_KEY=your_key_here")
        sys.exit(1)
    return {
        "host": os.environ.get("INDEXNOW_HOST", "upxuu.com"),
        "key": key,
        "keyLocation": f"https://{os.environ.get('INDEXNOW_HOST', 'upxuu.com')}/{key}.txt",
        "baseUrl": os.environ.get("INDEXNOW_BASE", "https://upxuu.com"),
    }

API_URL = "https://api.indexnow.org/indexnow"

def log(msg, color=""):
    print(f"{color}{msg}\033[0m" if color else msg)

def info(msg):
    log(f"  {msg}", "")

def ok(msg):
    log(f"  \033[92m[OK] {msg}\033[0m")

def fail(msg):
    log(f"  \033[91m[FAIL] {msg}\033[0m")

def scan_all_posts():
    posts_dir = BASE_DIR / "src/content/posts"
    config = get_config()
    urls = []
    for f in sorted(posts_dir.rglob("*.md")):
        if f.parent.name == "talk":
            continue
        slug = f.stem
        urls.append(f"{config['baseUrl']}/posts/{slug}/")
    return urls

def scan_recent(days=7):
    config = get_config()
    posts_dir = "src/content/posts"
    since = f"{days} days ago"
    try:
        result = subprocess.run(
            ["git", "log", f"--since={since}", "--diff-filter=AM",
             "--name-only", "--format=", "--", f"{posts_dir}/*.md"],
            capture_output=True, text=True, cwd=BASE_DIR
        )
        files = set(result.stdout.strip().splitlines())
        urls = []
        for f in files:
            f = f.strip()
            if not f or f.startswith("talk/"):
                continue
            slug = Path(f).stem
            urls.append(f"{config['baseUrl']}/posts/{slug}/")
        return urls
    except Exception as e:
        fail(f"Git 命令失败: {e}")
        sys.exit(1)

def collect_urls(args):
    config = get_config()
    urls = []
    if args.all:
        urls = scan_all_posts()
        info(f"扫描到 {len(urls)} 篇文章")
    elif args.url:
        raw = args.url
        if raw.startswith("http://") or raw.startswith("https://"):
            urls = [raw]
        else:
            slug = raw.strip("/")
            urls = [f"{config['baseUrl']}/posts/{slug}/"]
    elif args.file:
        path = Path(args.file)
        if not path.exists():
            fail(f"文件不存在: {path}")
            sys.exit(1)
        urls = [line.strip() for line in path.read_text().splitlines() if line.strip()]
        info(f"从文件读取 {len(urls)} 条 URL")
    elif args.recent:
        days = args.recent if isinstance(args.recent, int) else 7
        urls = scan_recent(days)
        info(f"最近 {days} 天有 {len(urls)} 篇文章变更")
    return urls

def submit_batch(urls, dry_run=False):
    if not urls:
        return
    config = get_config()
    payload = {
        "host": config["host"],
        "key": config["key"],
        "keyLocation": config["keyLocation"],
        "urlList": urls,
    }
    if dry_run:
        info("\033[93m[Dry Run] 将提交以下 URL:\033[0m")
        for u in urls:
            info(f"  {u}")
        return
    data = json.dumps(payload).encode("utf-8")
    req = Request(API_URL, data=data, headers={
        "Content-Type": "application/json; charset=utf-8",
        "Host": "api.indexnow.org",
    })
    try:
        resp = urlopen(req, timeout=30)
        body = resp.read().decode()
        ok(f"IndexNow ({resp.status} {body.strip()})")
    except HTTPError as e:
        body = e.read().decode()
        fail(f"IndexNow ({e.code}) {body}")
    except URLError as e:
        fail(f"IndexNow 网络错误: {e.reason}")

def main():
    parser = argparse.ArgumentParser(
        description="IndexNow URL 提交工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--all", action="store_true", help="提交所有文章")
    group.add_argument("--url", type=str, help="单个 URL 或 slug")
    group.add_argument("--file", type=str, help="从文件读取 URL 列表")
    group.add_argument("--recent", nargs="?", const=7, type=int,
                       help="提交最近 N 天 git 变更的文章（默认 7 天）")
    parser.add_argument("--dry-run", action="store_true", help="模拟运行，不发送请求")
    args = parser.parse_args()

    urls = collect_urls(args)
    if not urls:
        info("没有需要提交的 URL")
        return

    urls = list(dict.fromkeys(urls))
    CHUNK = 10000
    total = len(urls)
    chunks = [urls[i:i + CHUNK] for i in range(0, total, CHUNK)]

    print()
    log("\033[1mIndexNow 提交开始\033[0m")
    log("-" * 50)
    info(f"URL 数量:  {total}")
    info(f"分片:     {len(chunks)}")
    log("-" * 50)

    for i, chunk in enumerate(chunks, 1):
        if len(chunks) > 1:
            info(f"第 {i}/{len(chunks)} 片 ({len(chunk)} 条)")
        submit_batch(chunk, dry_run=args.dry_run)

    log("-" * 50)
    ok("全部完成" if not args.dry_run else "模拟完成")
    print()

if __name__ == "__main__":
    main()
