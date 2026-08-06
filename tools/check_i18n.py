"""Check the generated translations.

A dictionary entry in i18n.py that no longer matches does not fail — it simply
does nothing, and the German text ships. That is how point 03's body copy, the
pricing meta description and two section eyebrows stayed German on all three
translated pages without anyone noticing.

Two checks:

  1. LEFTOVER GERMAN — text that appears verbatim on both a German source page
     and a translated page, and looks German. This is the one that matters; it
     exits non-zero.
  2. DEAD ENTRIES — dictionary keys that match no German source page. Reported
     for information only: after a restructuring these pile up, and a dead key
     is usually the twin of a leftover-German bug elsewhere.

Run from the repository root, after tools/i18n.py:

    python3 tools/check_i18n.py
"""
import sys

sys.dont_write_bytecode = True   # importing i18n.py must not leave a __pycache__

import importlib.util  # noqa: E402
import pathlib  # noqa: E402
import re  # noqa: E402
from html.parser import HTMLParser  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = ["index.html"]
LANGS = ["fr", "it", "en"]

# Words that mark a string as German. Brand names, file names built from
# numbers, and product terms that are identical in every language stay out.
GERMAN = re.compile(
    r"\b(und|der|die|das|Ihre|Ihren|Ihrer|Ihnen|nicht|mit|für|auf|ohne|pro|bei"
    r"|wird|werden|läuft|Anschl\w*|Souver\w*|Schweizer|Nutzer|Monat|Daten"
    r"|Datei\w*)\b",
    re.I,
)
MIN_LEN = 10


class TextOnly(HTMLParser):
    """Visible text, with <script>/<style> contents left out."""

    SKIP = {"script", "style"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self.depth += 1

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.depth:
            self.depth -= 1

    def handle_data(self, data):
        if self.depth:
            return
        data = " ".join(data.split())
        if data:
            self.out.append(data)


def texts(path):
    p = TextOnly()
    p.feed(pathlib.Path(path).read_text(encoding="utf-8"))
    return p.out


def load_dict():
    spec = importlib.util.spec_from_file_location("i18n", ROOT / "tools" / "i18n.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)          # main() is behind a __main__ guard
    return mod


def main():
    mod = load_dict()
    german = set()
    for src in SOURCES:
        german |= set(texts(ROOT / src))

    leftovers = {}
    for lang in LANGS:
        for src in SOURCES:
            page = f"{lang}/{src}"
            if not (ROOT / page).exists():
                continue
            hits = {
                t for t in texts(ROOT / page)
                if t in german and len(t) > MIN_LEN and GERMAN.search(t)
            }
            if hits:
                leftovers[page] = sorted(hits)

    dead = [e[0] for e in mod.T
            if not any(mod.build_pattern(e[0]).search(
                (ROOT / s).read_text(encoding="utf-8")) for s in SOURCES)]

    print(f"Wörterbuch: {len(mod.T)} Einträge, davon {len(dead)} ohne Treffer")
    if dead:
        print("  (nur zur Information — meist Reste früherer Umbauten)")
        for d in dead[:10]:
            print("   •", d[:90] + ("…" if len(d) > 90 else ""))
        if len(dead) > 10:
            print(f"   … und {len(dead) - 10} weitere")

    if not leftovers:
        print("\nKein deutscher Text auf den übersetzten Seiten. OK.")
        return 0

    print("\nDEUTSCHER TEXT AUF ÜBERSETZTEN SEITEN:")
    for page, hits in leftovers.items():
        print(f"  {page}")
        for h in hits:
            print("   •", h[:100] + ("…" if len(h) > 100 else ""))
    return 1


if __name__ == "__main__":
    sys.exit(main())
