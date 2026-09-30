# Visuels animés · article « Diagramme de Pareto : construire un classement de causes qui tient »

Quatre visuels au format blog (1200 × 860) pour un article court (2 787 mots), charte des fiches : papier, bandeau six
couleurs, Poppins, palette Fichly. Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut.
Le mouvement porte le fond : les barres se trient, s'empilent, changent de hauteur, se reclassent.

Fichiers dans `livrables/blog/diagramme-de-pareto-methode-exemple/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-trier-et-cumuler` | Exemple de calcul, étape 5, après « Trois causes sur six couvrent 82 % des arrêts… » | Les barres arrivent dans l'ordre du relevé et se trient ; chacune s'empile ensuite sur le cumul précédent (même échelle, 200 arrêts = 100 %), le point se pose : 44, 67, 82, 91, 97, 100 %. Lecture : 50 % des causes pour 82 % des arrêts, pas 20/80. |
| 2 | `2-trois-unites` | Occurrences, temps d'arrêt ou coût, après « Trois unités, trois causes différentes en tête… » | Les six mêmes barres passent d'un diagramme à l'autre, changent de hauteur puis se reclassent : bourrage en tête en occurrences, panne du convoyeur en minutes, réglage de la dateuse en coût. |
| 3 | `3-categorie-trop-large` | La qualité du relevé, après « Un même niveau de détail… » | « Défaut qualité » arrive en tête parce qu'il contient quatre sujets. Ramenés au niveau de détail des autres causes, ils se rangent parmi elles et la vis de réglage desserrée passe en tête. |
| 4 | `4-second-pareto` | Les erreurs, après « Un diagramme de Pareto n'a de valeur que comparé à lui-même… » | Boucle PDCA : on cible la première barre, on agit, vingt jours passent, on retrace (même unité, même durée) ; l'ancien tracé reste en pointillés, la barre retombe, le nouveau classement désigne la cible suivante. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

Poids : GIF 1,02 / 0,89 / 0,79 / 0,95 Mo ; MP4 0,53 à 0,65 Mo.

Images existantes : aucune dans l'inventaire. Le tableau de l'exemple de calcul et celui des trois unités restent
dans l'article : les visuels 1 et 2 montrent le tri, le cumul et le reclassement, que les tableaux ne montrent pas.
Pas de visuel pour la courbe plate (section « Quand la règle des 80/20 ne s'applique pas ») : trois lectures
successives, mieux servies par le texte.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/2-trois-unites.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/2-trois-unites.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/2-trois-unites.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/diagramme-de-pareto-methode-exemple.html`, régénéré avec
`python3 outils/apercu_article.py blog/diagramme-de-pareto-methode-exemple`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/diagramme-de-pareto-methode-exemple/<id> stills 0 5 10   # images de contrôle dans controle/
outils/rendu_limite.sh blog/diagramme-de-pareto-methode-exemple/<id> gif 20          # GIF, MP4 et PNG dans livrables/
```

## Hypothèses

- Trier et cumuler (visuel 1) : chiffres de l'article (jeu de données construit pour la démonstration, 200 arrêts en
  vingt jours) ; seul l'ordre d'arrivée des barres avant le tri est illustratif.
- Trois unités (visuel 2) : parts du tableau de l'article. Seules les trois causes qui prennent la tête sont en
  couleur, les trois autres en gris.
- Catégorie trop large (visuel 3) : relevé entièrement illustratif (défaut qualité 60 = étiquette décalée 20, film mal
  soudé 16, date illisible 14, étui écrasé 10 ; vis de réglage desserrée 34 ; capteur encrassé 22 ; courroie usée 14).
  Seul le couple « défaut qualité » / « vis de réglage desserrée » vient de l'article.
- Second Pareto (visuel 4) : premier relevé de l'article ; second relevé illustratif (bourrage 88 puis 24, autres
  causes inchangées), d'où le changement de bobine film en cible suivante.
