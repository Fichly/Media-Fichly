"""Compare les articles en ligne sur Shopify aux corps préparés par integrer_shopify.py.

    python3 outils/verifier_shopify.py <dossier des corps préparés> <export1.json> [export2.json …]

Les exports sont des réponses de l'API (data.articles.nodes avec handle et body). La comparaison se fait
après normalisation des entités HTML (Shopify réécrit par exemple &#x27; en apostrophe).
"""
import html
import json
import sys
from pathlib import Path


def main(dossier, exports):
    live = {}
    for f in exports:
        for a in json.loads(Path(f).read_text(encoding='utf-8'))['data']['articles']['nodes']:
            live[a['handle']] = a['body']
    ok = 0
    for p in sorted(Path(dossier).glob('*.html')):
        h = p.stem
        if h not in live:
            print('?', h, ': absent des exports')
            continue
        same = html.unescape(live[h]) == html.unescape(p.read_text(encoding='utf-8'))
        ok += same
        print('✓' if same else '✗', h, '' if same else f': différent ({len(live[h])} car. en ligne, {p.stat().st_size} octets préparés)')
    print(ok, 'articles identiques sur', len(list(Path(dossier).glob('*.html'))))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2:])
