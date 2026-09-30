"""Index des visuels de blog : blog/README.md et apercus/blog/index.html.

    python3 outils/index_blog.py

Lit blog/inventaire.json (articles Shopify) et blog/<article>/visuels.json.
"""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load():
    inv = json.loads((ROOT / 'blog' / 'inventaire.json').read_text(encoding='utf-8'))
    for a in inv:
        f = ROOT / 'blog' / a['handle'] / 'visuels.json'
        a['visuels'] = json.loads(f.read_text(encoding='utf-8')) if f.exists() else []
        a['rendus'] = [v for v in a['visuels'] if (ROOT / 'livrables' / 'blog' / a['handle'] / f"{v['id']}.mp4").exists()]
    return inv


def readme(inv):
    done = [a for a in inv if a['rendus']]
    n = sum(len(a['rendus']) for a in inv)
    rows = []
    for a in sorted(inv, key=lambda a: (not a['publie'], a['titre'].lower())):
        h = a['handle']
        statut = 'publié' if a['publie'] else 'brouillon'
        vis = str(len(a['rendus'])) if a['rendus'] else '—'
        ap = f"[aperçu](../apercus/blog/{h}.html)" if a['rendus'] else ''
        rows.append(f"| [{a['titre']}]({a['url']}) | {statut} | {vis} | [dossier]({h}/) · [fichiers](../livrables/blog/{h}/) | {ap} |")
    return f"""# Visuels animés du blog Fichly

{len(done)} articles sur {len(inv)} ont leurs visuels, {n} visuels au total.
Méthode et conventions : [GUIDE-VISUELS.md](GUIDE-VISUELS.md). Inventaire Shopify : [inventaire.json](inventaire.json).
Incohérences relevées dans les textes et images à retirer : [POINTS-A-VERIFIER.md](POINTS-A-VERIFIER.md).

Pour chaque article :
- `blog/<article>/README.md` : où placer chaque visuel, ce qu'il fait comprendre, hypothèses, code d'intégration ;
- `blog/<article>/visuels.json` : placement et texte alternatif de chaque visuel ;
- `livrables/blog/<article>/` : les fichiers à mettre en ligne (`.mp4` à privilégier, `.gif` en repli, `.png` en affiche) ;
- `apercus/blog/<article>.html` : l'article complet avec les visuels en place (ouvrir depuis le dépôt cloné).

Vue d'ensemble avec les vignettes : [apercus/blog/index.html](../apercus/blog/index.html).

| Article | Statut | Visuels | Fichiers | Aperçu |
|---|---|---|---|---|
""" + '\n'.join(rows) + """

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article, à l'endroit indiqué :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/<visuel>.png" aria-label="<texte alt>"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/<visuel>.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>` : `<img src="…/<visuel>.gif" alt="<texte alt>" width="1200" height="860" loading="lazy">`.

## Re-rendre ou ajouter un visuel

```
outils/rendu_limite.sh blog/<article>/<visuel> stills 0 4 8   # images de contrôle dans controle/
outils/rendu_limite.sh blog/<article>/<visuel> gif 20        # GIF, MP4 et PNG dans livrables/
python3 outils/apercu_article.py blog/<article>              # aperçu de l'article
python3 outils/index_blog.py                                 # cet index
```
"""


def page(inv):
    esc = lambda s: html.escape(s, quote=True)
    cards = []
    for a in sorted(inv, key=lambda a: (not a['publie'], a['titre'].lower())):
        if not a['rendus']:
            continue
        h = a['handle']
        thumbs = ''.join(f'<img src="../../livrables/blog/{h}/{v["id"]}.png" alt="{esc(v["alt"])}" loading="lazy">' for v in a['rendus'])
        statut = 'publié' if a['publie'] else 'brouillon'
        cards.append(f"""<section><h2><a href="{h}.html">{esc(a['titre'])}</a></h2>
<p class="meta">{statut} · {len(a['rendus'])} visuels · <a href="{h}.html">aperçu de l'article</a> · <a href="../../livrables/blog/{h}/">fichiers</a></p>
<div class="grid">{thumbs}</div></section>""")
    missing = [a['titre'] for a in inv if not a['rendus']]
    rest = f"<p class='meta'>Sans visuels pour l'instant : {esc(', '.join(missing))}.</p>" if missing else ''
    return f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visuels du blog Fichly</title>
<style>
  body {{ margin: 0; background: #f4f4f8; color: #23235a; font: 16px/1.5 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }}
  main {{ max-width: 1200px; margin: 0 auto; padding: 32px 16px 64px; }}
  h1 {{ color: #4a4aa0; margin: 0 0 4px; }}
  h2 {{ font-size: 20px; margin: 32px 0 2px; }} h2 a {{ color: #4a4aa0; text-decoration: none; }}
  .meta {{ color: #6b6b8a; font-size: 14px; margin: 0 0 10px; }} .meta a {{ color: #4a4aa0; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }}
  .grid img {{ width: 100%; height: auto; border-radius: 10px; border: 1px solid #e2e2ee; background: #fff; }}
</style></head><body><main>
<h1>Visuels animés du blog Fichly</h1>
<p class="meta">Image complète de chaque visuel. Cliquer sur un article pour le voir en entier, visuels animés en place.</p>
{''.join(cards)}
{rest}
</main></body></html>
"""


if __name__ == '__main__':
    inv = load()
    (ROOT / 'blog' / 'README.md').write_text(readme(inv), encoding='utf-8')
    out = ROOT / 'apercus' / 'blog' / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page(inv), encoding='utf-8')
    print('→ blog/README.md, apercus/blog/index.html ·', sum(1 for a in inv if a['rendus']), 'articles avec visuels')
