# Visuels animés · article « MTBF et MTTR : les deux indicateurs qui expliquent votre disponibilité »

Cinq visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut. Le mouvement montre le mécanisme
décrit par le texte.

Fichiers dans `livrables/blog/mtbf-mttr-indicateurs-disponibilite/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli) et `<id>.png`
(image fixe, affiche de la vidéo). Poids des GIF : `1-frise-mtbf-mttr` 0,88 Mo, `2-disponibilite-cycle` 0,80 Mo, `3-courbe-en-baignoire` 0,90 Mo, `4-quatre-horodatages` 0,76 Mo, `5-quadrants-mtbf-mttr` 1,16 Mo.

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-frise-mtbf-mttr` | Différence entre MTBF et MTTR, après « C'est un indicateur de maintenabilité… » (remplace `3_MTBF.png` et `1_MTTR.png`) | Sur la même frise de 14 h, les marches s'alignent et se partagent en 3 (MTBF 4 h), les arrêts s'alignent et se partagent en 3 (MTTR 40 min) : deux questions opposées. |
| 2 | `2-disponibilite-cycle` | Le raccord avec le TRS, après « Ce dernier chiffre est exactement le rapport… » (remplace `2_MTBF_MTTR_disponibilite.png`) | Le cycle moyen 4 h + 40 min donne 85,7 % ; recopié trois fois, il reconstruit les 14 h requises et 12 / 14 redonne 85,7 % : les deux chemins se contrôlent. |
| 3 | `3-courbe-en-baignoire` | Le seuil universel n'existe pas, après « … C'est la courbe en baignoire. » (remplace `Courbe_en_baignoire.png`) | Le curseur parcourt la vie de l'équipement : pannes serrées, espacées, serrées ; le MTBF de chaque période s'allonge puis se raccourcit. |
| 4 | `4-quatre-horodatages` | Étape 3 du calcul, après « Dans la plupart des ateliers… le plus petit des trois… » | Un arrêt d'un seul bloc ne dit rien ; les quatre horodatages le découpent en trois morceaux, et l'intervention, premier réflexe, est le plus petit. |
| 5 | `5-quadrants-mtbf-mttr` | Le croisement en quatre cas, après « Le premier, qui tombe toutes les 4 heures… » (remplace `4_MTBF_ou_MTTR_sur_quoi_agir.png`) | Deux machines aux frises opposées ont presque la même disponibilité, puis chacune rejoint son quadrant et le service qui s'en saisit. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

- `3_MTBF.png` et `1_MTTR.png` : **refaites ensemble** dans `1-frise-mtbf-mttr` (la même frise sert aux deux questions).
  Placer la vidéo après le paragraphe du MTTR et retirer les deux images.
- `2_MTBF_MTTR_disponibilite.png` : **refaite** par `2-disponibilite-cycle`, placée quelques paragraphes plus bas, là où
  l'article donne les chiffres (4 h, 40 min, 85,7 %). Retirer l'image de sa place actuelle.
- `Courbe_en_baignoire.png` : **refaite** par `3-courbe-en-baignoire`, même emplacement.
- `4_MTBF_ou_MTTR_sur_quoi_agir.png` : **refaite** par `5-quadrants-mtbf-mttr`, placée après le tableau, là où l'article
  décrit les deux machines. Le tableau des quatre cas reste la référence détaillée.
- Photo de l'auteur : conservée.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article, à l'endroit indiqué :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/2-disponibilite-cycle.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/2-disponibilite-cycle.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/2-disponibilite-cycle.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/mtbf-mttr-indicateurs-disponibilite.html` : l'article complet avec chaque visuel à sa place et, dessous, une note (à ne pas publier)
sur ce qu'il doit faire comprendre. Régénérer avec `python3 outils/apercu_article.py blog/mtbf-mttr-indicateurs-disponibilite`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/mtbf-mttr-indicateurs-disponibilite/<id> stills 0 4.5   # images de contrôle dans controle/
outils/rendu_limite.sh blog/mtbf-mttr-indicateurs-disponibilite/<id> gif 20        # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Frise MTBF / MTTR : l'article donne les totaux (14 h requises, 12 h de marche, 2 h d'arrêt, 3 pannes). Les durées
  individuelles sont une hypothèse : marches de 3 h 10, 4 h 20, 2 h 50 et 1 h 40 ; arrêts de 30, 55 et 35 min.
- Disponibilité : chiffres de l'article (MTBF 4 h, MTTR 40 min, 85,7 %) ; le découpage de la journée en trois cycles
  moyens égaux est une représentation (3 × 4 h 40 = 14 h).
- Courbe en baignoire : forme et nombre de pannes illustratifs, sans échelle.
- Quatre horodatages : découpage illustratif 13 / 17 / 10 min et heures 10 h 12 à 10 h 52 ; le total de 40 min reprend
  le MTTR du cas de référence.
- Quadrants : disponibilités calculées en heures calendaires, 4 / 4 h 20 = 92 % pour la machine 1, 504 h / 552 h = 91 %
  pour la machine 2 (3 semaines = 504 h, 2 jours = 48 h). L'article dit « la même disponibilité » : le visuel affiche
  « quasi identiques ». Les frises sont à deux échelles différentes (24 h et 23 jours), indiquées sous chacune.
