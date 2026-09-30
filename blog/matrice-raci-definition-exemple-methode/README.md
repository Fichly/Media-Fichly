# Visuels animés · article « Matrice RACI : définition, exemple et méthode de construction en une réunion »

Cinq visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins,
palette Fichly. Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.
Article de méthode (environ 4 950 mots) : cinq visuels, chacun sur un mécanisme du texte.

Fichiers dans `livrables/blog/matrice-raci-definition-exemple-methode/` : `<id>.mp4` (à privilégier), `<id>.gif`
(repli, 0,7 à 1,1 Mo) et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-un-seul-a` | Introduction, après le premier paragraphe (« … je croyais que c'était l'autre… ») | Trois actions de la même réunion, trois semaines qui passent : sans A et avec deux A, rien ne bouge (les deux garants se renvoient la tâche) ; avec un seul A, la barre avance jusqu'à « faite ». |
| 2 | `2-garant-pas-approbateur` | Les quatre lettres, après « Approuver, c'est signer à la fin… » | Même tâche, même blocage : l'approbateur attend au bout pour signer, rien ne se débloque, rien à signer ; le garant accompagne la tâche, relance, arbitre, débloque, rend compte. |
| 3 | `3-lire-les-colonnes` | Étape 6, après « Le contrôle final se fait à la verticale… » | La matrice passe le contrôle des lignes, puis la lecture bascule à la verticale : colonne pleine de A, colonne de I, colonne vide. |
| 4 | `4-plan-action-arret` | Exemple du plan d'action, **à la place** de `<p><img src="VISUEL-A-CREER" …></p>` (après le tableau) | La matrice de l'article se remplit dans l'ordre de la méthode : les A d'abord (un par ligne, coche), puis les R, puis les C et les I ; un trait relie les A, qui changent de colonne (qualité pour le standard, chef d'équipe pour la formation). |
| 5 | `5-double-a` | Deux personnes se déclarent A, après « Troisième cas… » | Trois fois la même ligne à deux A, trois sorties : la ligne se coupe en deux ; la question de contrôle retourne un A en C ; en désaccord hiérarchique, case A vide, deux noms, une date, on remonte. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`, dans l'ordre de lecture.

## Image existante

L'inventaire listait un seul visuel, à créer : `VISUEL-A-CREER` (« Matrice RACI d'un plan d'action après un arrêt
subi, six tâches en lignes et cinq fonctions en colonnes, avec une seule case A mise en évidence par ligne »).
C'est le visuel 4, en animé. À la publication, remplacer le paragraphe `<p><img src="VISUEL-A-CREER" …></p>` par
la vidéo, et le champ `"image": "VISUEL-A-CREER"` du JSON-LD par l'URL du PNG `4-plan-action-arret.png`.
Dans l'aperçu, le visuel apparaît juste après ce paragraphe (l'image cassée du marqueur reste visible au-dessus).

## Intégration Shopify

Même balisage que les autres articles : `<video autoplay muted loop playsinline>` avec le PNG en `poster`
et le texte alternatif en `aria-label`, ou le GIF en repli si l'éditeur retire la balise `<video>`.

## Aperçu

`apercus/blog/matrice-raci-definition-exemple-methode.html`, régénéré par
`python3 outils/apercu_article.py blog/matrice-raci-definition-exemple-methode`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/matrice-raci-definition-exemple-methode/<id> stills 0 4 8   # contrôle dans controle/
outils/rendu_limite.sh blog/matrice-raci-definition-exemple-methode/<id> gif 20          # GIF, MP4 et PNG
```

## Hypothèses

- Un seul A : les trois tâches reprennent l'exemple de l'article ; la répartition des lettres sur chaque ligne
  et le rythme d'avancement sont illustratifs (seul compte le nombre de A).
- Garant / approbateur : tâche « Modifier le standard », blocage placé en semaine 2 et durées sur trois semaines
  illustratifs ; les quatre verbes (relance, arbitre, débloque, rend compte) sont ceux de l'article.
- Lire les colonnes : matrice inventée pour la démonstration (tâches de fonctionnement courant citées par
  l'article : déclarer un rebut, arrêter la ligne sur un doute, appeler la maintenance…). Les colonnes
  « Méthodes » et « Achats » et la répartition (5 A sur 7 pour la production) sont des hypothèses.
- Plan d'action : lettres et fonctions exactement celles du tableau de l'article ; seul l'ordre d'apparition
  (A, puis R, puis C et I) vient de la méthode en six étapes.
- Double A : le couple production / qualité et le partage « écrire / valider » suivent l'exemple de l'article ;
  le choix de la production comme C au cas 2 et la date « 15/10 » au cas 3 sont illustratifs.
