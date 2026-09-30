"""Vérifie les visuels de blog : fichiers, placement, poids, raccord de boucle.

    python3 outils/verifier_blog.py [article …]

Une ligne par article ; les anomalies sont listées en dessous (✗).
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent


def seam(gif):
    """Pixels qui changent nettement entre la dernière et la première image."""
    im = Image.open(gif)
    im.seek(0)
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    im.seek(im.n_frames - 1)
    b = np.asarray(im.convert('RGB')).astype(np.int16)
    return int((np.abs(a - b).max(axis=2) > 40).sum())


def check(handle):
    d = ROOT / 'blog' / handle
    out = ROOT / 'livrables' / 'blog' / handle
    issues = []
    try:
        vis = json.loads((d / 'visuels.json').read_text(encoding='utf-8'))
    except FileNotFoundError:
        return f'—  {handle} : pas de visuels.json', []
    body = (d / 'article.html').read_text(encoding='utf-8')
    sizes = []
    for v in vis:
        i = v['id']
        for k in ('id', 'section', 'apres', 'role', 'alt'):
            if not v.get(k):
                issues.append(f'{i} : champ « {k} » manquant')
        if not (d / i / 'visuel.js').exists():
            issues.append(f'{i} : dossier ou visuel.js manquant')
        pos = body.find(v.get('apres', '\0'))
        if pos < 0:
            issues.append(f'{i} : phrase « apres » introuvable dans article.html')
        elif body.find('</p>', pos) < 0:
            issues.append(f'{i} : pas de </p> après la phrase « apres »')
        for ext in ('mp4', 'gif', 'png'):
            if not (out / f'{i}.{ext}').exists():
                issues.append(f'{i} : {i}.{ext} absent')
        g = out / f'{i}.gif'
        if g.exists():
            mo = g.stat().st_size / 1e6
            sizes.append(mo)
            if mo > 3.0:
                issues.append(f'{i} : GIF lourd ({mo:.2f} Mo)')
            s = seam(g)
            if s > 1500:
                issues.append(f'{i} : raccord de boucle ({s} px changent)')
    # Ordre de lecture et numérotation
    pos = [body.find(v.get('apres', '\0')) for v in vis]
    if pos != sorted(pos):
        issues.append('visuels.json n\'est pas dans l\'ordre de lecture de l\'article')
    nums = [v['id'].split('-')[0] for v in vis]
    if nums != sorted(nums, key=lambda n: int(n) if n.isdigit() else 0):
        issues.append('numéros des visuels hors de l\'ordre de lecture : ' + ', '.join(v['id'] for v in vis))
    readme = (d / 'README.md').read_text(encoding='utf-8') if (d / 'README.md').exists() else ''
    for v in vis:
        if readme and v['id'] not in readme:
            issues.append(f"{v['id']} : absent du README")
    if not (ROOT / 'apercus' / 'blog' / f'{handle}.html').exists():
        issues.append('aperçu absent (python3 outils/apercu_article.py)')
    if not (d / 'README.md').exists():
        issues.append('README.md absent')
    mx = f', GIF max {max(sizes):.2f} Mo' if sizes else ''
    return f"{'✓' if not issues else '!'}  {handle} : {len(vis)} visuels{mx}", issues


if __name__ == '__main__':
    handles = sys.argv[1:] or sorted(p.name for p in (ROOT / 'blog').iterdir() if (p / 'article.html').exists())
    for h in handles:
        line, issues = check(h)
        print(line)
        for x in issues:
            print('   ✗', x)
