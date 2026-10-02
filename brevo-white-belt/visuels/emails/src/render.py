# Rend les illustrations des emails : src/<clé>.js → PNG 1200 px quantifié (palette 128 couleurs, sans tramage) dans visuels/emails/.
# Pictogramme du bandeau (PICTOS) : python3 render.py greenbelt → visuels/emails/greenbelt.png, 144 × 102 (3× l'affichage maximal
# 48 × 34), fond transparent, PNG RGBA (type 6) ramené à 64 couleurs au plus (FASTOCTREE sans tramage, alpha compris) : ≤ 6 Ko.
# « render.py greenbelt » rend le pictogramme seul : les 8 illustrations ne sont ni relues ni réécrites.
# Usage : python3 render.py [clé ...]   (sans argument : les 8 illustrations et le pictogramme)
import os, pathlib, subprocess, sys, tempfile
from PIL import Image
SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC.parent
FONTS = SRC.parents[3] / "assets" / "fonts"
KEYS = ["e0", "e1", "e2", "e3", "e4-decouvrir", "e4-equipe", "e4-formation", "e4-accompagnement"]
PICTOS = ["greenbelt"]                     # pictogrammes à fond transparent
TMP = pathlib.Path(os.environ.get("ILLUS_TMP", tempfile.gettempdir())) / "illus-raw"
TMP.mkdir(parents=True, exist_ok=True)
HEAD = "".join(f"@font-face{{font-family:Poppins;font-weight:{w};src:url({FONTS}/poppins-latin-{w}-normal.woff2) format('woff2')}}" for w in (400, 500, 600, 700, 800))

def render(key):
    page = TMP / f"{key}.html"
    page.write_text(f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>{HEAD} html,body{{margin:0}} svg{{display:block}}</style>'
                    f'<script src="{SRC}/common.js"></script></head><body><svg id="s" xmlns="http://www.w3.org/2000/svg"></svg>'
                    f'<script src="{SRC}/{key}.js"></script></body></html>', encoding="utf-8")
    raw = TMP / f"{key}-raw.png"
    alpha = key in PICTOS
    r = subprocess.run(["node", str(SRC / "render.js"), str(page), str(raw)] + (["--transparent"] if alpha else []), capture_output=True, text=True)
    print(key, r.stdout.strip(), r.stderr.strip()[:300])
    if alpha:
        return save_rgba(key, raw)
    im = Image.open(raw).convert("RGB")
    q = im.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    dst = OUT / f"{key}.png"
    q.save(dst, optimize=True)
    print(f"  → {dst.name} {im.size[0]}×{im.size[1]} {os.path.getsize(dst) // 1024} Ko")

def save_rgba(key, raw):
    """PNG RGBA quantifié : 64 couleurs au plus (alpha compris), remises en RGBA pour garder un PNG type 6 (bords anticrénelés propres
    sur tous les fonds, Outlook compris)."""
    im = Image.open(raw).convert("RGBA")
    q = im.quantize(colors=64, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).convert("RGBA")
    dst = OUT / f"{key}.png"
    q.save(dst, optimize=True)
    print(f"  → {dst.name} {im.size[0]}×{im.size[1]} RGBA, {len(q.getcolors(1 << 16))} couleurs, {os.path.getsize(dst)} octets")

for k in sys.argv[1:] or KEYS + PICTOS:
    render(k)
