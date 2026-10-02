# Rend les illustrations des emails : src/<clé>.js → PNG 1200 px quantifié (palette 128 couleurs, sans tramage) dans visuels/emails/.
# Usage : python3 render.py [clé ...]   (sans argument : toutes)
import os, pathlib, subprocess, sys, tempfile
from PIL import Image
SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC.parent
FONTS = SRC.parents[3] / "assets" / "fonts"
KEYS = ["e0", "e1", "e2", "e3", "e4-decouvrir", "e4-equipe", "e4-formation", "e4-accompagnement"]
TMP = pathlib.Path(os.environ.get("ILLUS_TMP", tempfile.gettempdir())) / "illus-raw"
TMP.mkdir(parents=True, exist_ok=True)
HEAD = "".join(f"@font-face{{font-family:Poppins;font-weight:{w};src:url({FONTS}/poppins-latin-{w}-normal.woff2) format('woff2')}}" for w in (400, 500, 600, 700, 800))

def render(key):
    page = TMP / f"{key}.html"
    page.write_text(f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>{HEAD} html,body{{margin:0}} svg{{display:block}}</style>'
                    f'<script src="{SRC}/common.js"></script></head><body><svg id="s" xmlns="http://www.w3.org/2000/svg"></svg>'
                    f'<script src="{SRC}/{key}.js"></script></body></html>', encoding="utf-8")
    raw = TMP / f"{key}-raw.png"
    r = subprocess.run(["node", str(SRC / "render.js"), str(page), str(raw)], capture_output=True, text=True)
    print(key, r.stdout.strip(), r.stderr.strip()[:300])
    im = Image.open(raw).convert("RGB")
    q = im.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    dst = OUT / f"{key}.png"
    q.save(dst, optimize=True)
    print(f"  → {dst.name} {im.size[0]}×{im.size[1]} {os.path.getsize(dst) // 1024} Ko")

for k in sys.argv[1:] or KEYS:
    render(k)
