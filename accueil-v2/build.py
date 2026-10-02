#!/usr/bin/env python3
"""Génère maquette-accueil-v2.html à partir de la source.

- Inline en base64 les petites images (logo, photos, encart).
- Photo de Clément Boniol : prise dans assets/auteurs/clement-boniol.png si elle existe, sinon médaillon « CB ».
- Transcription de la vidéo : lue dans video/storyboard.json.
- Les vidéos et affiches restent des fichiers à côté (media/…) : le script vérifie qu'ils existent.
Usage : python3 accueil-v2/build.py
"""
import base64, html, json, pathlib, sys

ICI = pathlib.Path(__file__).resolve().parent
ASSETS = ICI.parent / 'assets'
MEDIA = ['fichly-hero-16x9-av1.mp4', 'fichly-hero-16x9.mp4', 'fichly-hero-4x5-av1.mp4', 'fichly-hero-4x5.mp4'] + [
    f'fichly-hero-{f}-poster.{e}' for f in ('16x9', '4x5') for e in ('avif', 'webp', 'jpg')]


def data_uri(path):
    return 'data:image/png;base64,' + base64.b64encode(path.read_bytes()).decode()


def photo(fichier, nom, initiales):
    p = ASSETS / 'auteurs' / fichier
    if p.exists():
        return f'<img src="{data_uri(p)}" alt="{html.escape(nom)}" width="88" height="88" loading="lazy" decoding="async">'
    return f'<span class="ini" role="img" aria-label="{html.escape(nom)}, photo à venir">{initiales}</span>'


def main():
    src = (ICI / 'maquette-accueil-v2.source.html').read_text(encoding='utf-8')
    story = json.loads((ICI / 'video' / 'storyboard.json').read_text(encoding='utf-8'))
    remplacements = {
        '{{LOGO}}': data_uri(ASSETS / 'fichly-logo.png'),
        '{{GUIDES}}': data_uri(ASSETS / 'encarts' / 'guides-fichly.png'),
        '{{PHOTO_HUGO}}': photo('hugo-duc.png', 'Hugo Duc', 'HD'),
        '{{PHOTO_BONIOL}}': photo('clement-boniol.png', 'Clément Boniol', 'CB'),
        '{{PHOTO_RAYMOND}}': photo('clement-raymond.png', 'Clément Raymond', 'CR'),
        '{{TRANSCRIPTION}}': html.escape(story['transcription'], quote=False),
    }
    for k, v in remplacements.items():
        if k not in src:
            sys.exit(f'Marqueur absent de la source : {k}')
        src = src.replace(k, v)
    if '{{' in src:
        sys.exit('Marqueur non remplacé : ' + src[src.index('{{'):src.index('{{') + 40])
    if '—' in src or '–' in src:
        sys.exit('Tiret cadratin ou demi-cadratin trouvé dans la page')
    manquants = [m for m in MEDIA if not (ICI / 'media' / m).exists()]
    if manquants:
        print('⚠ Médias manquants (lancer node outils/rendu-hero.js all) :', ', '.join(manquants))
    out = ICI / 'maquette-accueil-v2.html'
    out.write_text(src, encoding='utf-8')
    poids = sum((ICI / 'media' / m).stat().st_size for m in MEDIA if (ICI / 'media' / m).exists())
    print(f'→ {out.relative_to(ICI.parent)} {out.stat().st_size / 1e3:.0f} Ko (+ médias {poids / 1e6:.2f} Mo)')
    print('Photo de Clément Boniol :', 'trouvée' if (ASSETS / 'auteurs' / 'clement-boniol.png').exists() else 'absente (médaillon CB)')


if __name__ == '__main__':
    main()
