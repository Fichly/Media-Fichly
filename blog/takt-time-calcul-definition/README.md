# Visuels animés · article « Takt time : calculer le rythme imposé par la demande »

Trois visuels au format blog (1200 × 860) pour un article court (≈ 2 000 mots), charte des fiches : papier, bandeau
six couleurs, Poppins, palette Fichly. Chaque visuel démarre et finit sur l'image complète, et la boucle se referme
sans saut. Le mouvement montre le mécanisme : ce qui sort du numérateur et ce qui y reste, l'écart au takt qui se
cumule pièce après pièce, la tâche qui quitte le goulot.

Fichiers dans `livrables/blog/takt-time-calcul-definition/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli) et `<id>.png`
(image fixe, affiche de la vidéo). L'article n'avait aucune image.

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-temps-disponible` | Comment calculer, après « Le calcul paresseux prend les 16 heures brutes… » | La journée de 16 h est une barre : pauses, prise de poste et maintenance planifiée en sortent ; panne, micro-arrêts et changement de série essaient de sortir et retombent. La barre se resserre à 12 h 40 = 45 600 s : 95 s par pièce, contre 120 s pour le calcul paresseux. |
| 2 | `2-plus-vite-moins-vite` | Takt time et temps de cycle, après « Le takt time ne produit une décision qu'en face d'une seconde durée… » (avant le tableau) | Un seul métronome à 95 s, trois temps de cycle : à 70 s les pièces sortent avant le battement et s'empilent, à 95 s elles tombent sur le battement, à 108 s l'écart grandit de 13 s à chaque pièce, jusqu'à 1 h 44 sur 480 pièces. |
| 3 | `3-le-goulot-pas-la-moyenne` | Même section, après « Trois voies, par coût croissant… » | La moyenne des postes (89,5 s) passe sous le takt, le poste 3 à 108 s dépasse et fixe la cadence. Première voie : une tâche de 14 s passe du goulot au poste en avance, toute la ligne passe sous 95 s. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/1-temps-disponible.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/1-temps-disponible.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/1-temps-disponible.gif" alt="…" width="1200" height="860" loading="lazy">`.
Les MP4 pèsent 0,6 à 0,7 Mo, les GIF 0,9 à 1,1 Mo.

## Aperçu

`apercus/blog/takt-time-calcul-definition.html` : l'article complet avec chaque visuel à sa place et une note (à ne pas
publier) sur ce qu'il doit faire comprendre. Régénérer avec `python3 outils/apercu_article.py blog/takt-time-calcul-definition`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/takt-time-calcul-definition/<id> stills 0 4 8   # images de contrôle dans controle/
outils/rendu_limite.sh blog/takt-time-calcul-definition/<id> gif 20        # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Temps disponible : les chiffres (16 h, 1 h 20 de pauses et prise de poste, 2 h de maintenance, 45 600 s, 95 s, 120 s)
  sont ceux de l'article. La place des arrêts dans la journée et la présence d'une panne, de micro-arrêts et d'un
  changement de série sont illustratives : l'article ne les chiffre pas, et ils restent de toute façon dans le calcul.
- Plus vite, moins vite : le cas « cycle bien inférieur au takt » est illustré à 70 s (hypothèse) ; les 171 pièces de trop
  en découlent (45 600 ÷ 70 = 651 pièces pour 480 demandées). 95 s, 108 s, 13 s et 1 h 44 viennent de l'article.
  Le temps de la simulation est accéléré (un battement de 95 s dure moins d'une seconde).
- Le goulot, pas la moyenne : seuls 95 s et 108 s viennent de l'article ; les cycles des postes 1, 2 et 4 (82, 90, 78 s),
  le découpage en tâches et la tâche de 14 s déplacée sont illustratifs.
