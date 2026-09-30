# Visuels animés · article « La méthode PDCA (roue de Deming) »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins,
palette Fichly. Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut.
Le mouvement montre le mécanisme : la roue qui redescend sans cale, l'idée ratée qui touche six postes
ou un seul, les actions qu'on empile sans mesure, le tour de roue de l'exemple.

Fichiers dans `livrables/blog/methode-pdca-roue-de-deming-cycle/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-roue-qui-monte` | Qu'est-ce que la méthode PDCA, après « Imaginez une roue qui monte une pente… » | Un tour P, D, C, A par cran. Sans standard, au premier coup de mou, la roue redescend à son point de départ. Avec une cale posée à chaque Act, elle tient sans effort, et chaque cale laisse un nouveau niveau de référence (effet cliquet). |
| 2 | `2-tester-avant-de-generaliser` | Pourquoi utiliser le PDCA, après « La méthode PDCA impose deux disciplines… » | Même ligne, même fausse bonne idée. Déployée d'un coup : trois mois plus tard, six postes touchés. Testée sur un poste, mesurée, corrigée, puis généralisée : un seul poste touché. |
| 3 | `3-sauter-le-check` | Les 4 étapes, étape Check, après « C'est l'étape que tout le monde saute… » | Les mêmes quatre actions. Sans Check, elles s'empilent et leur effet reste inconnu. Avec Check, l'indicateur tranche : deux actions gardées, deux abandonnées, objectif atteint. |
| 4 | `4-exemple-panneau-d-ombres` | Exemple concret, après « Act. Le test étant concluant… » (avant « Notez la logique ») | Le tour de roue de l'exemple : 8 min mesurées, objectif sous 3 min, panneau d'ombres sur le seul poste pilote, 2 min environ au Check (la barre passe sous l'objectif), généralisation et fiche de poste, puis la roue repart sur le réglage machine. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

Contenu non visible depuis le conteneur (CDN bloqué), jugé d'après le nom et la section :

- `Qu_es-ce_que_le_PDCA_-_Hugo_Duc_1.png` (« Qu'est-ce que la méthode PDCA ? », texte alt vide) : probablement la roue
  PDCA. `1-roue-qui-monte` reprend l'idée en mouvement (la roue, la pente, la cale) ; à mettre à sa place si l'image
  est bien une roue, sinon à placer juste après, au paragraphe « Imaginez une roue… ».
- `5_methodes_de_resolution_de_problemes_Lean_-_Hugo_Duc_-_Fichly.png` (« Les 4 étapes du cycle PDCA ») : une vue
  d'ensemble de cinq méthodes, sans mécanisme à animer. Laissée telle quelle.
- `PDCA_et_DMAIC_-_Clement_Raymond.png` (« PDCA ou DMAIC : lequel choisir ? ») : comparaison. Laissée telle quelle ;
  la grille de choix est animée dans l'article DMAIC (`2-pdca-ou-dmaic`).

## Intégration Shopify

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/1-roue-qui-monte.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/1-roue-qui-monte.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF : `<img src="…/1-roue-qui-monte.gif" alt="…" width="1200" height="860" loading="lazy">`.
Poids : MP4 0,6 à 0,75 Mo, GIF 0,88 à 1,56 Mo.

## Aperçu

`apercus/blog/methode-pdca-roue-de-deming-cycle.html` : l'article complet avec chaque visuel à sa place et une note
(à ne pas publier). Régénérer avec `python3 outils/apercu_article.py blog/methode-pdca-roue-de-deming-cycle`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/methode-pdca-roue-de-deming-cycle/<id> stills 0 5 9   # images de contrôle dans controle/
outils/rendu_limite.sh blog/methode-pdca-roue-de-deming-cycle/<id> gif 20         # GIF, MP4 et PNG dans livrables/
```

## Hypothèses

- La roue qui monte : deux tours réussis et un premier essai raté sont une mise en scène ; l'article dit
  « si vous arrêtez de pousser, elle redescend » et « chaque cycle réussi devient le nouveau niveau de référence ».
- Tester avant de généraliser : six postes, une idée qui se révèle mauvaise puis corrigée, compteur 6 contre 1 :
  illustration. « Trois mois plus tard » et « une semaine » de test viennent de l'article.
- Sauter le Check : quatre actions et leurs effets (baisse, sans effet, baisse, hausse) sont illustratifs, sans échelle.
- Exemple panneau d'ombres : 8 min, objectif sous 3 min, environ 2 min au Check, test d'une semaine, fiche de poste et
  prochain problème (réglage machine) sont ceux de l'article, lui-même illustratif. Hypothèses du visuel : la ligne
  compte 5 postes, et les autres postes atteignent aussi 2 min après généralisation (l'article ne chiffre que le pilote).
