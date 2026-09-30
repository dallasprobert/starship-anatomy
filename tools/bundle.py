"""Build one self-contained HTML file (all scripts inlined, three.js vendored) for offline/desktop use.

    python tools/bundle.py            -> dist/Starship Anatomy.html
Only Google Fonts still load from the web; offline, the page falls back to system fonts.
"""
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
VENDOR = ROOT / "vendor"
OUT = ROOT / "dist" / "Starship Anatomy.html"


def fetch(url):
    VENDOR.mkdir(exist_ok=True)
    cached = VENDOR / url.split("/npm/")[-1].replace("/", "_")
    if not cached.exists():
        with urllib.request.urlopen(url, timeout=60) as r:
            cached.write_bytes(r.read())
    return cached.read_text(encoding="utf-8")


def inline(src):
    code = fetch(src) if src.startswith("http") else (ROOT / src).read_text(encoding="utf-8")
    code = code.replace("</script", r"<\/script")  # never close the inline block early
    return f"<script>/* {src.rsplit('/', 1)[-1]} */\n{code}\n</script>"


page = (ROOT / "index.html").read_text(encoding="utf-8")
page = re.sub(r'<script src="([^"]+)"></script>', lambda m: inline(m.group(1)), page)
head, body = page.split('<header class="topbar">', 1)
html = ('<!doctype html>\n<html lang="en">\n<head>\n' + head.strip() +
        '\n</head>\n<body>\n<header class="topbar">' + body.strip() + '\n</body>\n</html>\n')
OUT.parent.mkdir(exist_ok=True)
OUT.write_text(html, encoding="utf-8")
print(f"wrote {OUT} ({OUT.stat().st_size / 1e6:.2f} MB)")
