# Visuels animés · article « Diagramme d'Ishikawa : les 6 M, la méthode et un exemple rempli »

Cinq visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut. Le mouvement porte le fond :
l'arête de poisson se lit dans son sens, les notes se rangent, le champ s'ouvre puis se referme.

Fichiers dans `livrables/blog/diagramme-ishikawa-6m-methode-exemple/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-regards-meme-feuille` | Définition et principe, après « … le support qui met ces regards sur la même feuille. » | L'arête se trace vers l'effet, une branche par famille. Le régleur, le contrôleur et l'opérateur de nuit apportent chacun leurs causes : pendant leur tour, seules leurs deux familles restent allumées. Ensemble : six familles sur six, des hypothèses à vérifier. |
| 2 | `2-seance-six-etapes` | Mener une séance en 6 étapes, après le paragraphe d'introduction | La séance ouvre large puis resserre : notes en vrac sans classement, rangées sur les branches (une cause posée sur deux familles), « le réglage n'est pas bon » creusé d'un cran, vote à trois voix, trois candidates en rouge. |
| 3 | `3-diagramme-rempli` | Un diagramme rempli, après « Effet retenu : … » (**remplace l'image `VISUEL-A-CREER`** du paragraphe suivant) | Le diagramme se remplit avec les causes du tableau, les trois candidates passent en rouge, puis chacune descend dans la liste de vérifications : quoi vérifier, qui (un nom), pour quand (une date). |
| 4 | `4-trois-controleurs` | Même section, après « La branche Mesure illustre ce que la sixième famille apporte… » | Trois contrôleurs, les trois mêmes pièces, vingt minutes : les verdicts divergent pièce par pièce. La branche Mesure s'allume, les cinq autres deviennent inutiles à explorer. |
| 5 | `5-ouvrir-puis-refermer` | Ce qu'on fait du diagramme le lendemain, après « Une fois une vérification positive… » | Le compteur suit la largeur du champ : 12 causes possibles, 3 candidates, 1 avérée. La cause avérée quitte le diagramme et les 5 pourquoi descendent sur elle seule jusqu'à la cause racine. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

Poids : GIF 1,54 / 1,99 / 1,41 / 1,08 / 1,08 Mo ; MP4 0,65 à 1,1 Mo.

## Image existante

L'inventaire ne prévoit qu'une image, encore à créer (`VISUEL-A-CREER`, section « Un diagramme d'Ishikawa rempli ») :
elle est remplacée par `3-diagramme-rempli`, qui montre le même contenu (six branches, candidates en rouge, vérifications
datées en dessous) et ajoute le passage du schéma à la liste. À l'intégration, supprimer le paragraphe
`<p><img src="VISUEL-A-CREER" …></p>` qui suit « Effet retenu ».

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/3-diagramme-rempli.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/3-diagramme-rempli.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/3-diagramme-rempli.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/diagramme-ishikawa-6m-methode-exemple.html` : l'article complet avec chaque visuel à sa place et, dessous,
une note (à ne pas publier) sur ce qu'il doit faire comprendre. Régénérer avec
`python3 outils/apercu_article.py blog/diagramme-ishikawa-6m-methode-exemple`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/diagramme-ishikawa-6m-methode-exemple/<id> stills 0 5 10   # images de contrôle dans controle/
outils/rendu_limite.sh blog/diagramme-ishikawa-6m-methode-exemple/<id> gif 20          # GIF, MP4 et PNG dans livrables/
```

## Hypothèses

- Effet : l'article laisse l'effet en gabarit ([famille d'équipement], [écart constaté]…). Les visuels l'écrivent
  « taux de rebut en hausse, référence la plus produite » (visuels 1, 3, 5) ou reprennent l'exemple de l'étape 1
  « depuis le passage en trois équipes, sur la référence la plus courante » (visuel 2), sans chiffre.
- Regards (visuel 1) : la répartition des causes entre le régleur, le contrôleur et l'opérateur de nuit est
  illustrative ; l'article dit seulement que chaque métier voit des causes que les autres ne voient pas.
- Séance (visuel 2) : répartition des voix illustrative (6, 5, 4, 2 et 1 voix, soit 18 voix pour six participants à
  trois voix) ; « conditions de stockage » posée à la fois sur Matière et Milieu pour illustrer la règle de l'étape 4.
- Causes candidates (visuels 2, 3, 5) : les trois de la liste de vérifications de l'article (critère d'acceptation,
  deux versions de la gamme, changement de lot fournisseur). Libellés des causes raccourcis pour tenir dans les notes.
- Trois contrôleurs (visuel 4) : la grille de verdicts bonne / rebut est illustrative ; l'article dit seulement
  « si les trois verdicts diffèrent ».
- Ouvrir puis refermer (visuel 5) : l'issue des vérifications (critère avéré, gamme et lot écartés) est illustrative,
  et les cinq « pourquoi » sont laissés sans contenu : l'article ne déroule pas cette chaîne.
