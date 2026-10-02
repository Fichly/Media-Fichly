"""Construit maquette-fiches-lean.html à partir de la source.

    python3 produits-v2/construire.py

Remplace {{LOGO}} et {{HUGO}} par les images du dépôt, {{GUIDE}} par guide.json (Guide du deck),
et {{STORIES}} par stories.json,
complété des fichiers rendus dans livrables/stories/ (vidéo web, affiche, vignette).
Une story sans vidéo rendue s'affiche « bientôt » dans la rangée de bulles.
Les vidéos sont servies à côté de la page sous stories/ (lien vers livrables/stories).
"""
import base64
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
RENDUS = ROOT / 'livrables' / 'stories'


def data_uri(rel):
    return 'data:image/png;base64,' + base64.b64encode((ROOT / rel).read_bytes()).decode()


stories = json.loads((HERE / 'stories.json').read_text())
for st in stories:
    if (RENDUS / f"{st['id']}-720.mp4").exists():
        st['video'] = f"stories/{st['id']}-720.mp4"
        st['affiche'] = f"stories/{st['id']}.jpg"
        st['bulle'] = f"stories/{st['id']}-bulle.png"
        if not st['texte']:
            raise SystemExit(f"Texte de la vidéo manquant pour {st['id']} (stories.json)")

src = (HERE / 'maquette-fiches-lean.source.html').read_text()
out = (src.replace('{{LOGO}}', data_uri('assets/fichly-logo.png'))
          .replace('{{HUGO}}', data_uri('assets/auteurs/hugo-duc.png'))
          .replace('{{STORIES}}', json.dumps(stories, ensure_ascii=False).replace('</', '<\\/'))
          .replace('{{GUIDE}}', (HERE / 'guide.json').read_text().replace('</', '<\\/')))
assert '{{' not in out
(HERE / 'maquette-fiches-lean.html').write_text(out)
print('maquette-fiches-lean.html', len(out) // 1024, 'Ko,', sum('video' in s for s in stories), 'vidéos')
