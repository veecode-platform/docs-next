#!/usr/bin/env python3
"""
Exhaustive internal-link checker for the Docusaurus build.

Walks every `index.html` under build/, extracts every internal `href`
(absolute paths starting with `/`), and validates each one with a HEAD
request against a locally-served build.

Why this exists alongside Docusaurus `onBrokenLinks: throw`:
- Docusaurus only validates links it knows are doc references (Markdown
  links with `.md` extension, or absolute paths matching known doc routes).
- Raw HTML hrefs in React components (e.g., custom headers/footers,
  legacy pages) are passed through opaquely. The build never sees them.
- This script catches that second class.

Usage:
    # in one shell: yarn build && yarn serve --port 3001
    # in another:   python3 scripts/check-links.py

Exit code 1 if any broken link is found.
"""
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

BUILD_DIR = os.environ.get("BUILD_DIR", "build")
BASE_URL = os.environ.get("BASE_URL", "http://localhost:3001")
TIMEOUT_SECONDS = 10
PARALLELISM = 20

HREF_RE = re.compile(r'href="([^"]+)"')


def collect_pages(build_dir):
    pages = []
    for root, _, files in os.walk(build_dir):
        for f in files:
            if f == "index.html":
                fpath = os.path.join(root, f)
                url = fpath[len(build_dir):]
                url = url[: -len("/index.html")]
                pages.append((url or "/", fpath))
    return pages


def collect_internal_hrefs(pages):
    links = {}
    for url, fpath in pages:
        with open(fpath, encoding="utf-8") as fh:
            html = fh.read()
        for href in HREF_RE.findall(html):
            if not href.startswith("/"):
                continue
            clean = href.split("#")[0].split("?")[0]
            if not clean:
                continue
            links.setdefault(clean, set()).add(url)
    return links


def check_one(path):
    try:
        encoded = urllib.parse.quote(path, safe="/:%")
        req = urllib.request.Request(BASE_URL + encoded, method="HEAD")
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            return path, resp.status
    except urllib.error.HTTPError as e:
        return path, e.code
    except Exception as e:
        return path, f"ERR:{type(e).__name__}:{e}"


def main():
    if not os.path.isdir(BUILD_DIR):
        print(f"ERROR: build dir not found: {BUILD_DIR}", file=sys.stderr)
        sys.exit(2)

    pages = collect_pages(BUILD_DIR)
    links = collect_internal_hrefs(pages)
    print(f"Pages crawled: {len(pages)}  Unique internal paths: {len(links)}")

    broken = []
    with ThreadPoolExecutor(max_workers=PARALLELISM) as ex:
        futs = {ex.submit(check_one, p): p for p in links}
        for fut in as_completed(futs):
            path, status = fut.result()
            if (isinstance(status, int) and status >= 400) or isinstance(status, str):
                broken.append((path, status))

    if not broken:
        print("OK: no broken internal links")
        return 0

    print(f"\nFOUND {len(broken)} broken internal link(s):")
    for path, status in sorted(broken):
        print(f"  [{status}]  {path}")
        for src in sorted(links[path])[:5]:
            print(f"      linked from: {src}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
