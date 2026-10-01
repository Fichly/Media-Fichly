"""Prépare le nouveau corps HTML des articles Shopify : visuels animés insérés, anciennes illustrations retirées.

    python3 outils/integrer_shopify.py <articles.json> <dossier de sortie>

<articles.json> : liste [{id, handle, body}] telle que renvoyée par l'API (corps actuels).
Pour chaque article ayant un blog/<handle>/visuels.json :
  - chaque visuel est inséré après le paragraphe qui contient sa phrase « apres » (GIF hébergé sur le CDN
    Shopify, fichier fichly-<handle>-<id>.gif déposé dans Contenu › Fichiers) ;
  - toutes les anciennes images sont retirées, sauf les photos de l'auteur (liste GARDER) ;
  - un bloc <figure> d'ancienne illustration (image ou vidéo) part en entier, légende comprise ;
  - un paragraphe vidé par le retrait disparaît avec l'image.
Les intégrations externes (<iframe> YouTube, Giphy) ne sont pas touchées.
Écrit <sortie>/<handle>.html et affiche un rapport par article. N'envoie rien à Shopify.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CDN = 'https://cdn.shopify.com/s/files/1/0880/5515/2985/files/'
GARDER = {'Photo_Hugo_Duc.png', 'REMPLACER-PAR-PHOTO-HUGO', 'hugo-duc.jpg', '', 'Z'}


def visuel_html(handle, v):
    # Guillemets échappés, apostrophes laissées telles quelles (Shopify les normalise ainsi)
    alt = html.escape(v['alt'], quote=False).replace('"', '&quot;')
    src = f"{CDN}fichly-{handle}-{v['id']}.gif"
    return (f'\n<p class="fichly-visuel" style="text-align:center;">'
            f'<img src="{src}" alt="{alt}" width="1200" height="860" loading="lazy" '
            f'style="width:100%;height:auto;max-width:1200px;border-radius:12px;"></p>\n')


def bloc_image(body, m):
    """Zone à retirer pour l'image m : le paragraphe entier s'il ne contient qu'elle, sinon la balise seule."""
    start, end = m.start(), m.end()
    p0 = body.rfind('<p', 0, start)
    p1 = body.find('</p>', end)
    if p0 >= 0 and p1 >= 0 and body.rfind('</p>', 0, start) < p0:
        inner = body[body.find('>', p0) + 1:p1]
        reste = re.sub(r'<img\b[^>]*>|<br\s*/?>|&nbsp;|\s', '', inner.replace(m.group(0), '', 1))
        if not re.sub(r'<[^>]+>', '', reste):
            return p0, p1 + len('</p>')
    # Image en tête de paragraphe : son <br> part avec elle ; au milieu d'un texte, le <br> reste (pas de phrases collées)
    debut = p0 >= 0 and not re.sub(r'<[^>]+>|\s|&nbsp;', '', body[body.find('>', p0) + 1:start])
    br = re.match(r'\s*<br\s*/?>', body[end:]) if debut else None
    return start, end + (br.end() if br else 0)


def integrer(article):
    handle, body = article['handle'], article['body']
    vis = json.loads((ROOT / 'blog' / handle / 'visuels.json').read_text(encoding='utf-8'))
    edits, rapport = [], {'inseres': 0, 'retires': [], 'gardes': [], 'introuvables': []}
    for v in vis:
        i = body.find(v['apres'])
        if i < 0:
            rapport['introuvables'].append(v['id'])
            continue
        j = body.find('</p>', i)
        edits.append((j + 4, j + 4, visuel_html(handle, v)))
        rapport['inseres'] += 1
    # Blocs <figure> d'anciennes illustrations (image ou vidéo) : retirés en entier, légende comprise
    figures = []
    for f in re.finditer(r'<figure\b.*?</figure>', body, re.S):
        medias = re.findall(r'<(?:img|video|source)\b[^>]*src="([^"]*)"', f.group(0))
        if medias and not any(x.split('/')[-1].split('?')[0] in GARDER for x in medias):
            figures.append((f.start(), f.end()))
            edits.append((f.start(), f.end(), ''))
            rapport['retires'].append('figure : ' + medias[0].split('/')[-1].split('?')[0])
    for m in re.finditer(r'<img\b[^>]*>', body):
        if any(a <= m.start() < b for a, b in figures):
            continue
        src = (re.search(r'src="([^"]*)"', m.group(0)) or [None, ''])[1]
        fn = src.split('/')[-1].split('?')[0]
        if fn in GARDER:
            rapport['gardes'].append(fn or '(src vide)')
            continue
        a, b = bloc_image(body, m)
        # Légende seule juste après l'image (<figure> sans média) : elle part avec l'image
        leg = re.match(r'\s*<figure>\s*<figcaption>.*?</figcaption>\s*</figure>', body[b:], re.S)
        if leg:
            b += leg.end()
        edits.append((a, b, ''))
        rapport['retires'].append(fn)
    # Application de la fin vers le début (insertions après un retrait au même endroit)
    for a, b, rep in sorted(edits, key=lambda e: (e[0], e[1]), reverse=True):
        body = body[:a] + rep + body[b:]
    return body, rapport


if __name__ == '__main__':
    arts = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    for a in sorted(arts, key=lambda a: a['handle']):
        if not (ROOT / 'blog' / a['handle'] / 'visuels.json').exists():
            print('—', a['handle'], ': pas de visuels')
            continue
        body, r = integrer(a)
        (out / f"{a['handle']}.html").write_text(body, encoding='utf-8')
        print(f"{'✓' if not r['introuvables'] else '!'} {a['handle']} : +{r['inseres']} visuels, −{len(r['retires'])} images"
              + (f", introuvables : {r['introuvables']}" if r['introuvables'] else '')
              + f" · {len(a['body'])} → {len(body)} car.")
