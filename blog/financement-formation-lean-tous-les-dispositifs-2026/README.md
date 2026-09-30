# Visuels animés · article « Financement formation Lean : tous les dispositifs 2026 »

Deux visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.

Fichiers dans `livrables/blog/financement-formation-lean-tous-les-dispositifs-2026/` : `<id>.mp4` (à privilégier),
`<id>.gif` (repli) et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-chaque-statut-son-montage` | Quel financement selon votre situation, après « Une règle simple traverse ce tableau… » (sous le tableau) | Même formation, trois statuts : les dispositifs viennent s'empiler dans la barre du coût, dans l'ordre de l'article, et ce qui reste est le reste à charge (0 €, 150 €, 0 €). Le FNE-Formation reste barré dans la réserve. |
| 2 | `2-l-accord-avant-le-jour-1` | Exemple du chef d'équipe, après « Le délai à anticiper : comptez quelques semaines… » | Un curseur de temps balaie deux déroulés identiques jusqu'à l'instruction ; en haut la formation attend l'accord écrit (reste à charge 0 €), en bas elle démarre avant et n'est plus finançable. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes de l'article

Une seule image : la photo de l'auteur (encart « Écrit par Hugo Duc »). Laissée telle quelle.
Le tableau « Quel dispositif selon votre belt » n'a pas été animé : il dit surtout qui paie selon le coût,
ce que le visuel 1 montre déjà par statut.

## Intégration Shopify

Même méthode que les autres articles : fichiers dans Contenu › Fichiers, balise `<video autoplay muted loop playsinline
preload="metadata" width="1200" height="860" poster="….png" aria-label="…">` avec la source `….mp4`, GIF en repli.
Extrait complet dans `blog/lean-manufacturing-definition-principes-outils/README.md`.

## Aperçu

`apercus/blog/financement-formation-lean-tous-les-dispositifs-2026.html` ; régénérer avec
`python3 outils/apercu_article.py blog/financement-formation-lean-tous-les-dispositifs-2026`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/financement-formation-lean-tous-les-dispositifs-2026/<id> stills 0 4 8   # contrôle
outils/rendu_limite.sh blog/financement-formation-lean-tous-les-dispositifs-2026/<id> gif 20        # livrables
```

## Hypothèses

- Chaque statut a son montage : la barre représente le coût pédagogique sans montant (voir points d'attention).
  Les parts de chaque dispositif sont illustratives (OPCO 68 % / entreprise 32 % ; CPF 62 % / employeur 32 % /
  150 € ; CPF 58 % / AIF 42 %). La part de 150 € (6 % de la barre) correspond à l'ordre de grandeur d'une formation
  à 2 500 €. Trois des cinq profils du tableau sont montrés : pour le dirigeant de PME et l'indépendant, l'article
  ne donne pas de reste à charge.
- L'accord avant le jour 1 : l'échelle de temps est illustrative (« quelques semaines » d'instruction, jours de
  formation élargis pour être lisibles). Le déroulé du bas reprend l'erreur n° 1 de la section « Les erreurs à éviter ».

## Points d'attention (texte de l'article)

- Prix de la Green Belt : 3 000 € dans l'introduction, la section Green Belt et l'exemple, mais 2 500 € dans le
  tableau des tarifs (et 1 500 € distanciel / 2 500 € présentiel dans l'article `green-belt-lean-six-sigma`).
  Les visuels n'affichent volontairement aucun prix ; à harmoniser dans le texte.
- Durée de la Green Belt : 5 jours ici, 6 jours (42 h) dans l'article Green Belt.
- La case « Tarif inter » de la White Belt est vide dans le tableau (formation en intra uniquement) : ajouter « sur devis » ou un tiret.
