# Visuels animés · article « Quelle formation Lean Management choisir ? »

Trois visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.

Fichiers dans `livrables/blog/quelle-formation-lean-management-certifiante-choisir/` : `<id>.mp4` (à privilégier),
`<id>.gif` (repli) et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-lean-ou-six-sigma` | Lean vs Lean Six Sigma, après « C'est pour cette raison que l'on parle souvent de Lean Six Sigma… » | Même objectif, deux cibles : à gauche les stocks disparaissent et le délai raccourcit sans toucher à la transformation ; à droite la dispersion se resserre autour d'une cible et de limites immobiles, les défauts rentrent. |
| 2 | `2-quatre-ceintures` | Types de formations, après le dernier paragraphe Black Belt (« Cette certification atteste d'une capacité… ») | Un participant monte les quatre marches ; sa place change : il comprend, participe à un chantier piloté par un Green Belt, pilote l'équipe, puis accompagne plusieurs Green Belts. Durées (1, 3, 5, 7 jours) et gains visés (50 000 € ou plus, plus de 100 000 €). |
| 3 | `3-partir-de-sa-situation` | Comment identifier la formation, après « La formation Lean Black Belt s'adresse à ceux qui souhaitent… » | Chaque situation trace son chemin vers la ou les ceintures conseillées par l'article ; deux situations ont deux options. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes de l'article

| Image | Section | Décision |
|-------|---------|----------|
| `formations-lean-management---fichly` | Pourquoi faire une formation | Laissée : présentation des formations, pas de mécanisme à animer. |
| `la-maison-du-lean` | Qu'est-ce que le lean management | Laissée. Si on veut l'animer, la maison Toyota animée existe déjà (`lean-manufacturing-definition-principes-outils/4-maison-toyota`). |
| `formation-yellow-belt…`, `formation-green-belt…`, `formation-black-belt…` | Sections Yellow, Green, Black Belt | Laissées (visuels de présentation des formations). Le visuel 2 récapitule les quatre niveaux en mouvement juste après la Black Belt ; on peut retirer les trois images si on préfère un seul visuel. |
| `solutions-de-financement…` | Financement | Laissée. Le visuel `financement-formation-lean-tous-les-dispositifs-2026/1-chaque-statut-son-montage` peut la remplacer. |

## Intégration Shopify

Même méthode que les autres articles : déposer les fichiers dans Contenu › Fichiers, puis insérer une balise
`<video autoplay muted loop playsinline preload="metadata" width="1200" height="860" poster="….png" aria-label="…">`
avec la source `….mp4` ; si l'éditeur retire la balise `<video>`, utiliser le GIF dans une balise `<img>`.
Voir `blog/lean-manufacturing-definition-principes-outils/README.md` pour l'extrait complet.

## Aperçu

`apercus/blog/quelle-formation-lean-management-certifiante-choisir.html` : l'article avec chaque visuel à sa place.
Régénérer avec `python3 outils/apercu_article.py blog/quelle-formation-lean-management-certifiante-choisir`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/quelle-formation-lean-management-certifiante-choisir/<id> stills 0 4 8   # contrôle
outils/rendu_limite.sh blog/quelle-formation-lean-management-certifiante-choisir/<id> gif 20        # livrables
```

## Hypothèses

- Lean ou Six Sigma : l'article ne donne aucun chiffre. Les stocks (4, 6 et 3 cartons ramenés à 1), les 36 pièces
  mesurées et les 6 hors tolérance au départ sont illustratifs ; pas d'échelle sur le délai ni sur les mesures.
- Quatre ceintures : les durées sont celles de la section « Les formations Lean Management chez Fichly » (Yellow 3 j,
  Green 5 j, Black 7 j) et « en une journée » pour la White Belt. Les pictogrammes d'équipe (taille des équipes,
  trois Green Belts accompagnés) sont illustratifs. Seuls les niveaux Green et Black portent des gains chiffrés, comme dans l'article.
- Partir de sa situation : l'ordre des situations diffère de l'article (projet d'entreprise en premier) pour que les
  chemins ne se croisent pas ; les correspondances sont celles de l'article.

## Points d'attention (texte de l'article)

- La FAQ décrit la White Belt comme « une formation de 3 jours pour devenir équipier » ; le corps de l'article dit
  « en une journée » (et l'article financement : 1 jour, intra uniquement). Le visuel suit le corps : 1 jour.
- Durée de la Green Belt : 5 jours ici, 6 jours (42 h) dans l'article `green-belt-lean-six-sigma`.
- La liste des financements cite le FNE-Formation, que l'article financement 2026 dit suspendu depuis fin 2024.
