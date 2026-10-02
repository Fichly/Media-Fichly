"""Finalise les brouillons du blog avant publication, au format attendu par le gabarit V2.

    python3 articles-v2/outils/finaliser_brouillons.py articles-v2/sauvegardes/2026-10-01/brouillons.json sortie/ alts.json handles.json

Entrée : export JSON des articles (data.nodes[] : id, handle, title, body, image, summary).
Sortie : <handle>.html (corps final) et journal.json (changements et contrôles, par article).

Le thème en ligne (section main-article-v2) affiche les corps à classes fichly-* : il garde l'enveloppe
.fichly-article, reprend résumé, essentiel et sommaire, et génère son propre JSON-LD (Article + fil d'Ariane).

Règles appliquées, dans l'ordre :
1. Retire les commentaires HTML (briefs internes, visibles dans le flux du blog et le code source).
   Les commentaires « VISUEL n » sont remplacés par le visuel correspondant quand il existe.
2. Retire les blocs <style> et les JSON-LD écrits à la main : le gabarit V2 porte le style et les données structurées.
3. Remplace les marqueurs restants : photo de l'auteur, textes d'exemple entre crochets.
4. Contrôles : plus aucun crochet, commentaire, style, REMPLACER ni VISUEL-A-CREER ; liens internes connus ;
   texte visible et intertitres identiques à l'original, hors remplacements voulus.
"""
import json
import re
import sys
from pathlib import Path

CDN = 'https://cdn.shopify.com/s/files/1/0880/5515/2985/files/'
PHOTO_HUGO = CDN + 'Photo_Hugo_Duc.png?v=1787604628'
BLOG = 'https://www.fichly.com/blogs/nos-articles/'

# Date de publication (JSON-LD) : maintenant, ou la date du calendrier éditorial pour les articles programmés
PUBLICATION = {
    'management-visuel-outils-exemples': '2026-10-19',
    'kaizen-definition-methode-amelioration-continue': '2026-10-26',
}
AUJOURDHUI = '2026-10-01'

# Visuels d'article remplaçant les commentaires <!-- VISUEL n : … -->
VISUELS = {
    'kaizen-definition-methode-amelioration-continue': ['1-standard-cale', '2-chantier-et-quotidien'],
    'management-visuel-outils-exemples': ['1-trois-niveaux', '2-chaine-ecart-action', '3-tableau-rempli'],
}

# Textes d'exemple restés entre crochets : formulation neutre, sans chiffre inventé
REMPLACEMENTS = {
    'kanban-de-production-boucle-dimensionnement': [
        (" alimentant une ligne d'assemblage en [secteur].", " alimentant une ligne d'assemblage."),
    ],
    'qqoqccp-methode-cadrer-un-probleme': [
        ('Posez [durée de la réunion de cadrage] au planning', 'Posez vingt minutes au planning'),
    ],
    'matrice-raci-definition-exemple-methode': [
        ('sur un [famille d\'équipement] en [secteur].', 'sur une ligne d\'emballage en agroalimentaire.'),
        ('Une relecture au jalon, à [durée constatée], sur les seules lignes qui ont bougé.',
         'Une relecture à chaque jalon, sur les seules lignes qui ont bougé.'),
    ],
    'amdec-methode-cotation-criticite': [
        ('Comptez [nombre d\'arrêts relevés] occurrences du mode sur les douze derniers mois',
         'Comptez les occurrences du mode sur les douze derniers mois'),
        ('Sur un [famille d\'équipement] en [secteur],', 'Sur un motoréducteur de convoyeur en agroalimentaire,'),
        ('Si votre équipe traite [capacité d\'action] actions par trimestre',
         'Si votre équipe peut traiter, par exemple, six actions par trimestre'),
    ],
}
# Crochets laissés volontairement : gabarit de phrase que le lecteur remplit (« champs à remplir par vos soins »)
CROCHETS_VOULUS = {
    'qqoqccp-methode-cadrer-un-probleme': {'[date de première observation]', '[type de défaut]', '[part des pièces concernées]',
                                           '[référence]', '[équipe]', '[fonction qui constate]'},
}

SCRIPT = re.compile(r'<script\b.*?</script>|<style\b.*?</style>', re.S)
# Lu dans l'ordre : un commentaire qui cite « <style> » reste un commentaire
JETONS = re.compile(r'<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>', re.S)


def visible(html):
    """Texte vu par le lecteur : sans commentaires, scripts, styles ni balises (les alt des images ne comptent pas)."""
    html = JETONS.sub(' ', html)
    return ' '.join(re.sub(r'<[^>]+>', ' ', html).split())


def visuel(handle, nom, alts):
    f = f'fichly-{handle}-{nom}.gif'
    alt = alts[f].replace('"', '&quot;')
    return (f'<p class="fichly-visuel" style="text-align:center;"><img src="{CDN}{f}" alt="{alt}" width="1200" height="860" '
            f'loading="lazy" style="width:100%;height:auto;max-width:1200px;border-radius:12px;"></p>')


def finaliser(a, alts, couvertures, handles):
    h, body, log = a['handle'], a['body'], []

    # 1. Commentaires
    def commentaires(html):
        vis = iter(VISUELS.get(h, []))

        def rep(m):
            if not m.group(0).startswith('<!--'):
                return m.group(0)
            c = m.group(0)[4:-3].strip()
            if re.match(r'VISUEL \d', c):
                nom = next(vis)
                log.append(f'visuel inséré : {nom}')
                return visuel(h, nom, alts)
            log.append(f'commentaire retiré ({len(c)} car.) : {c[:60]!r}')
            return ''
        html = JETONS.sub(rep, html)
        return re.sub(r'\n{3,}', '\n\n', html)
    body = commentaires(body)

    # 2. Marqueurs
    if 'REMPLACER-PAR-PHOTO-HUGO' in body:
        body = body.replace('src="REMPLACER-PAR-PHOTO-HUGO"', f'src="{PHOTO_HUGO}"')
        log.append('photo de Hugo Duc branchée')
    for old, new in REMPLACEMENTS.get(h, []):
        assert body.count(old) == 1, (h, old, body.count(old))
        body = body.replace(old, new)
        log.append(f'texte d\'exemple : {old!r} → {new!r}')

    # 2. <style> et JSON-LD écrits à la main
    n_style = len(re.findall(r'<style\b', body))
    body = re.sub(r'<style\b.*?</style>\s*', '', body, flags=re.S)
    n_ld = len(re.findall(r'application/ld\+json', body))
    body = re.sub(r'(<p>\s*)?<script type="application/ld\+json">.*?</script>(\s*</p>)?\s*', '', body, flags=re.S)
    body = re.sub(r'<p>\s*</p>\s*', '', body)
    log.append(f'{n_style} bloc(s) <style> et {n_ld} JSON-LD retirés (portés par le gabarit V2)')
    date = PUBLICATION.get(h, AUJOURDHUI)
    image = a['image']['url'].split('?')[0] if a.get('image') else couvertures[h]

    # 4. Contrôles
    texte = SCRIPT.sub('', body)
    restants = set(re.findall(r'\[[^\]\n<]{1,60}\]', re.sub(r'<[^>]+>', ' ', texte))) - CROCHETS_VOULUS.get(h, set())
    erreurs = []
    if restants: erreurs.append(f'crochets restants : {sorted(restants)}')
    if any(m.group(0).startswith('<!--') for m in JETONS.finditer(body)): erreurs.append('commentaire HTML restant')
    for marq in ('REMPLACER', 'VISUEL-A-CREER', 'VISUEL ATTENDU'):
        if marq in body: erreurs.append(f'marqueur restant : {marq}')
    for lien in sorted(set(re.findall(r'href="https://www\.fichly\.com/blogs/nos-articles/([^"#?]+)', body))):
        if lien.rstrip('/') not in handles: erreurs.append(f'lien vers un article inconnu : {lien}')
    for f in re.findall(r'src="([^"]+)"', body):
        if not f.startswith('https://'): erreurs.append(f'image sans URL : {f}')
    if '<style' in body or 'application/ld+json' in body: erreurs.append('style ou JSON-LD restant')
    if 'class="fichly-article"' not in a['body'] or 'class="fichly-article"' in body:
        pass
    else:
        erreurs.append('enveloppe fichly-article perdue')
    avant, apres = visible(a['body']), visible(body)
    for old, new in REMPLACEMENTS.get(h, []):
        avant = avant.replace(visible(old), visible(new))
    if avant != apres:
        import difflib
        d = [x for x in difflib.ndiff(avant.split(), apres.split()) if x[0] in '+-']
        if any(not x[2:].startswith(('Deux', 'Trois', 'Courbe', 'Tableau', 'La')) for x in d if x[0] == '-'):
            erreurs.append(f'texte visible modifié : {d[:12]}')
        else:
            log.append(f'texte visible : {len(d)} mots ajoutés par les textes alternatifs des visuels')
    if re.findall(r'<h2[^>]*>(.*?)</h2>', a['body'], flags=re.S) != re.findall(r'<h2[^>]*>(.*?)</h2>', body, flags=re.S):
        erreurs.append('intertitres modifiés')
    log.append(f'taille : {len(a["body"])} → {len(body)} caractères')
    return body, {'handle': h, 'publication': date, 'image': image, 'changements': log, 'erreurs': erreurs}


def main(src, out, alts_path, handles_path):
    nodes = json.loads(Path(src).read_text(encoding='utf-8'))['data']['nodes']
    alts = json.loads(Path(alts_path).read_text(encoding='utf-8'))
    handles = set(json.loads(Path(handles_path).read_text(encoding='utf-8')))
    couvertures = {a['handle']: f"{CDN}fichly-{a['handle']}-couverture.png" for a in nodes}
    out = Path(out); out.mkdir(parents=True, exist_ok=True)
    journal = []
    for a in nodes:
        body, j = finaliser(a, alts, couvertures, handles)
        (out / f"{a['handle']}.html").write_text(body, encoding='utf-8')
        journal.append(j)
    (out / 'journal.json').write_text(json.dumps(journal, ensure_ascii=False, indent=1), encoding='utf-8')
    for j in journal:
        print(f"\n## {j['handle']} · {j['publication']} · {'OK' if not j['erreurs'] else 'ERREURS'}")
        for c in j['changements']: print('  -', c[:160])
        for e in j['erreurs']: print('  ✗', e)


if __name__ == '__main__':
    main(*sys.argv[1:5])
