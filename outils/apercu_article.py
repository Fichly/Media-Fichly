"""Aperçu d'un article de blog avec ses visuels animés placés dans le texte.

    python3 outils/apercu_article.py blog/<article>

Lit blog/<article>/article.html (le texte de l'article) et blog/<article>/visuels.json
(pour chaque visuel : id, phrase après laquelle il se place, rôle, texte alt),
et écrit apercus/blog/<article>.html. Les vidéos sont liées en relatif vers
livrables/blog/<article>/ (page légère, à ouvrir depuis le dépôt cloné).
Sous chaque visuel, une note rappelle à quoi il sert dans l'article.
"""
import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def figure(v, n, rel):
    esc = lambda s: html.escape(s, quote=True)
    return f"""
<figure class="visuel">
  <video autoplay muted loop playsinline preload="auto" width="1200" height="860" aria-label="{esc(v['alt'])}" poster="{rel}/{v['id']}.png" src="{rel}/{v['id']}.mp4"></video>
  <figcaption><span class="num">Visuel {n}</span> <code>{esc(v['id'])}</code><br>{esc(v['role'])}</figcaption>
</figure>
"""


def main(folder):
    folder = ROOT / folder
    name = folder.name
    rel = f"../../livrables/blog/{name}"
    body = (folder / 'article.html').read_text(encoding='utf-8')
    visuels = json.loads((folder / 'visuels.json').read_text(encoding='utf-8'))
    # Insertion du dernier au premier pour garder les positions valables
    placed = []
    for n, v in enumerate(visuels, 1):
        i = body.find(v['apres'])
        if i < 0:
            sys.exit(f"Phrase introuvable pour {v['id']} : {v['apres']}")
        end = body.find('</p>', i) + len('</p>')
        placed.append((end, n, v))
    for end, n, v in sorted(placed, key=lambda x: -x[0]):
        body = body[:end] + figure(v, n, rel) + body[end:]

    page = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aperçu · {html.escape(name)}</title>
<style>
  :root {{ --ink: #23235a; --blue: #4a4aa0; --muted: #6b6b8a; --line: #e2e2ee; --bg: #fbfbf9; --note: #ececf5; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: var(--bg); color: var(--ink); font: 17px/1.65 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }}
  main {{ max-width: 780px; margin: 0 auto; padding: 32px 16px 64px; }}
  .bandeau {{ background: var(--note); border-radius: 12px; padding: 12px 16px; font-size: 14px; color: var(--muted); margin-bottom: 24px; }}
  h1 {{ font-size: 34px; line-height: 1.2; color: var(--blue); }}
  h2 {{ font-size: 26px; line-height: 1.25; margin-top: 48px; color: var(--blue); }}
  h3 {{ font-size: 20px; margin-top: 28px; }}
  a {{ color: var(--blue); }}
  table {{ border-collapse: collapse; width: 100%; font-size: 15px; margin: 16px 0; }}
  th, td {{ border: 1px solid var(--line); padding: 8px 10px; text-align: left; vertical-align: top; }}
  th {{ background: var(--note); }}
  div[role=region] {{ overflow-x: auto; }}
  .visuel {{ margin: 28px 0; }}
  .visuel video {{ display: block; width: 100%; height: auto; border-radius: 14px; border: 1px solid var(--line); background: #f3f3f3; }}
  .visuel figcaption {{ margin-top: 8px; font-size: 13.5px; line-height: 1.5; color: var(--muted); border-left: 3px solid var(--blue); padding-left: 10px; }}
  .visuel .num {{ font-weight: 700; color: var(--blue); }}
  .visuel code {{ font-size: 12.5px; }}
</style>
</head>
<body>
<main>
  <p class="bandeau"><a href="index.html">← Tous les articles</a> · Aperçu de travail : l'article tel qu'il sera lu, avec chaque visuel animé à l'endroit prévu. La note sous chaque visuel (à ne pas publier) rappelle ce qu'il doit faire comprendre.</p>
{body}
</main>
</body>
</html>
"""
    out = ROOT / 'apercus' / 'blog' / f'{name}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding='utf-8')
    print('→', out.relative_to(ROOT), f"{out.stat().st_size / 1e6:.2f} Mo")


if __name__ == '__main__':
    main(sys.argv[1])
