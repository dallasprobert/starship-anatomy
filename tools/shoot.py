"""Headless check + screenshot for the Starship Anatomy page.

Examples:
  python tools/shoot.py --selector "[data-view=raptor3d]" --out shots/raptor3d.png
  python tools/shoot.py --selector "[data-view=raptor3d]" --eval "SX.show('raptor3.otp')" --wait 2500 --out shots/otp.png
  python tools/shoot.py --mobile --selector "#booster" --out shots/booster-mobile.png
  python tools/shoot.py --full --out shots/page.png

Prints console errors/warnings, page errors, view status, unknown part ids and missing facts.
Use --filter raptor3d to show only console lines mentioning that text.
"""
import argparse
import json
import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=(ROOT / "index.html").as_uri())
    ap.add_argument("--out", default=None, help="PNG path (relative to project root)")
    ap.add_argument("--selector", default=None, help="element to scroll to and capture")
    ap.add_argument("--eval", action="append", default=[], help="JS to run after load (repeatable, runs in order)")
    ap.add_argument("--wait", type=int, default=1800, help="ms to wait after scrolling/evals")
    ap.add_argument("--step", type=int, default=90, help="frames to advance via __sx.step before capture")
    ap.add_argument("--width", type=int, default=1440)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--mobile", action="store_true", help="390x844, touch, DPR 2")
    ap.add_argument("--full", action="store_true", help="full-page screenshot")
    ap.add_argument("--viewport", action="store_true", help="capture the viewport instead of the element")
    ap.add_argument("--filter", default=None, help="only print console lines containing this text")
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--init", action="store_true", help="initialise every view first (lazy views otherwise stay empty in long shots)")
    a = ap.parse_args()

    logs, errors = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        if a.mobile:
            ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        else:
            ctx = browser.new_context(viewport={"width": a.width, "height": a.height}, device_scale_factor=1)
        page = ctx.new_page()
        page.on("console", lambda m: logs.append((m.type, m.text)))
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(a.url, wait_until="load", timeout=90000)
        page.wait_for_timeout(800)
        if a.init:
            page.evaluate("window.__sx && window.__sx.initAll()")
            page.wait_for_timeout(1500)
        if a.selector:
            try:
                page.eval_on_selector(a.selector, "el => el.scrollIntoView({block: 'start'})")
                page.evaluate("window.scrollBy(0, -60)")
            except Exception as e:  # noqa: BLE001
                errors.append(f"selector not found: {a.selector} ({e})")
            page.wait_for_timeout(900)
        for js in a.eval:
            try:
                r = page.evaluate(f"(async () => {{ return ({js}); }})()")
                if r is not None and not a.quiet:
                    print("eval ->", json.dumps(r)[:1500])
            except Exception as e:  # noqa: BLE001
                errors.append(f"eval failed: {js[:80]} :: {e}")
            page.wait_for_timeout(250)
        page.wait_for_timeout(a.wait)
        try:
            page.evaluate(f"window.__sx && window.__sx.step({a.step})")
        except Exception as e:  # noqa: BLE001
            errors.append(f"step failed: {e}")
        page.wait_for_timeout(200)
        status = page.evaluate("""() => window.__sx ? {views: __sx.views(), missingParts: __sx.missingParts(), missingFacts: __sx.missingFacts().slice(0, 60),
            docW: document.documentElement.scrollWidth, winW: window.innerWidth} : null""")
        if a.out:
            out = (ROOT / a.out) if not pathlib.Path(a.out).is_absolute() else pathlib.Path(a.out)
            out.parent.mkdir(parents=True, exist_ok=True)
            if a.full:
                page.screenshot(path=str(out), full_page=True)
            elif a.selector and not a.viewport:
                # clip instead of locator.screenshot: live WebGL views never satisfy Playwright's "stable" wait
                box = page.evaluate("""s => { const r = document.querySelector(s).getBoundingClientRect();
                    return {x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height}; }""", a.selector)
                page.screenshot(path=str(out), full_page=True, clip=box)
            else:
                page.screenshot(path=str(out))
            print("shot:", out)
        browser.close()

    def keep(t):
        return not a.filter or a.filter.lower() in t.lower()

    bad = [(t, x) for t, x in logs if t in ("error", "warning") and keep(x)]
    print(f"console errors/warnings: {len(bad)}")
    for t, x in bad[:40]:
        print(f"  [{t}] {x[:400]}")
    errs = [e for e in errors if keep(e)]
    print(f"page errors: {len(errs)}")
    for e in errs[:20]:
        print("  ", e[:600])
    if status:
        print("views:", json.dumps(status["views"]))
        if status["missingParts"]:
            print("unknown part ids referenced by views:", status["missingParts"])
        if status["missingFacts"]:
            print("facts referenced but missing:", status["missingFacts"])
        if status["docW"] > status["winW"] + 1:
            print(f"WARNING horizontal overflow: document {status['docW']}px > window {status['winW']}px")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
