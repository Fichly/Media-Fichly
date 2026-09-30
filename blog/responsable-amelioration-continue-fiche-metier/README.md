# Visuels animés · article « Responsable amélioration continue : métier, salaire 2026 »

Deux visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.

Fichiers dans `livrables/blog/responsable-amelioration-continue-fiche-metier/` : `<id>.mp4` (à privilégier),
`<id>.gif` (repli) et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-six-missions-un-but` | Les missions au quotidien, après « Sa réussite ultime se voit quand les équipes proposent… » | Les six missions tournent en boucle ; sur le tableau, les améliorations portées par le responsable (bleu) laissent la place à celles des équipes (vert) : le but de fond des six missions. |
| 2 | `2-parcours-et-salaire` | Comment devenir responsable AC, après « Le poste se rejoint rarement en sortie d'école… » | Le parcours se remplit étape par étape jusqu'au poste ; un curseur d'expérience fait apparaître les fourchettes de salaire (début, confirmé, senior) autour de la médiane de 50 000 €, puis les trois leviers. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes de l'article

L'inventaire n'en signale aucune, mais l'article contient une infographie après l'introduction des missions
(`Responsable_amelioration_continue_salaire_Hugo_Duc_-_Fichly.png`, légende « Le métier … en un coup d'œil : missions,
formation, salaire et expérience »). Laissée : c'est une synthèse fixe. Le visuel 2 reprend parcours et salaire en
mouvement ; on peut garder les deux. Son attribut `alt` est vide dans le code : à renseigner.

## Intégration Shopify

Même méthode que les autres articles : fichiers dans Contenu › Fichiers, balise `<video autoplay muted loop playsinline
preload="metadata" width="1200" height="860" poster="….png" aria-label="…">` avec la source `….mp4`, GIF en repli.
Extrait complet dans `blog/lean-manufacturing-definition-principes-outils/README.md`.

## Aperçu

`apercus/blog/responsable-amelioration-continue-fiche-metier.html` ; régénérer avec
`python3 outils/apercu_article.py blog/responsable-amelioration-continue-fiche-metier`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/responsable-amelioration-continue-fiche-metier/<id> stills 0 4 8   # contrôle
outils/rendu_limite.sh blog/responsable-amelioration-continue-fiche-metier/<id> gif 20        # livrables
```

## Hypothèses

- Six missions : l'article ne chiffre pas la part des améliorations proposées par les équipes. Les 24 améliorations
  et leur répartition (1 sur 6 venant des équipes au début, 5 sur 6 à la fin) sont illustratives, comme les deux
  tours de boucle.
- Parcours et salaire : les étapes du parcours sont dans l'ordre de l'article, sans date. Les fourchettes sont
  celles du tableau (38-45 k€, 45-60 k€, 60-85 k€ et plus) placées sur un axe de 0 à 12 ans d'expérience ; la
  flèche au-dessus de 85 000 € traduit « et plus ». Les données Glassdoor et Indeed ne sont pas reprises.

## Points d'attention (texte de l'article)

- L'article Green Belt situe le même poste « le plus souvent entre 38 000 et 55 000 € », alors que cette fiche
  donne 38 000 à plus de 85 000 € (Glassdoor 25e-75e percentile : 42 900 à 64 750 €). À harmoniser.
- L'encart de fin annonce une Green Belt de 5 jours ; l'article Green Belt parle de 6 jours (42 h).
