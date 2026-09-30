# Visuels animés · article « Types de maintenance : laquelle choisir pour quel équipement »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Article court (3 354 mots) : quatre visuels, un par idée qui gagne au mouvement. Chaque visuel démarre et finit sur
l'image complète, la boucle se referme sans saut.

Fichiers dans `livrables/blog/types-de-maintenance-comment-choisir/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-cout-arret-decide` | Comment choisir, après « La règle qui en découle tient en une phrase… » | Même analyse vibratoire, même poids sur deux balances : seul le coût d'arrêt change. Le convoyeur redondant ne fait pas basculer la balance (corrective), la machine goulot la fait basculer (la surveillance se paie). |
| 2 | `2-systematique-duree-de-vie` | Préventive systématique, après « La règle de bon sens… » | Huit exemplaires s'usent, l'échéance se cale sur le plus faible : durée de vie régulière, 7 % jeté ; dispersée (même moyenne), 45 % jeté en bon état, payé deux fois. |
| 3 | `3-quatre-declencheurs` | Les 3 types de préventive, après « Deuxièmement, ce qui distingue réellement… » | Une seule courbe d'usure, le temps avance : la systématique intervient à l'échéance (organe encore bon), la prévisionnelle à la date déduite de la pente, la conditionnelle au seuil, la corrective à la panne. La prévisionnelle est dessinée comme sous-ensemble de la conditionnelle. |
| 4 | `4-arrets-subis-arrets-choisis` | Plan de maintenance, après « Un bon plan de maintenance ne réduit pas le nombre d'interventions… » | Même nombre d'interventions : cinq des six quittent la production pour un créneau programmé, la jauge des arrêts non planifiés chute ; l'arrêt subi traîne ses suites (aval désorganisé, urgence, non-qualité au redémarrage). |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

- `3_Types_de_maintenance.png` (début de la section « Comment choisir… », alt vide) : **à remplacer**. Son sujet (les
  types) est repris et expliqué en mouvement par le visuel 2 ; la section 1 reçoit le visuel 1, qui porte son vrai
  sujet (l'arbitrage par le coût d'arrêt).
- `1_Analyses_conditionnelles.png` (section conditionnelle, alt vide) : **conservée**. D'après son nom, elle liste les
  analyses (vibrations, température, huile…) : un inventaire, que le mouvement n'expliquerait pas mieux.
- `2_5_niveaux_de_maintenance.png` (section plan de maintenance, alt vide) : **conservée**. Les niveaux sont une
  question distincte que l'article renvoie à un autre article ; le visuel 4 est placé plus haut dans la même section.
  Penser à lui donner un texte alt.

## Hypothèses

- Visuel 1 : poids des blocs illustratifs, sans chiffres ; « machine goulot » est l'exemple opposé au convoyeur
  redondant de l'article (l'article parle d'« un équipement qui devient goulot »). Le verdict « conditionnelle » suppose
  une dégradation mesurable (analyse vibratoire).
- Visuel 2 : forme de la courbe d'usure, position du seuil, des relevés, de l'échéance et de la date déduite : illustratives.
- Visuel 3 : durées de vie des huit exemplaires inventées (moyenne identique dans les deux cas, 99,4 unités) ; les
  pourcentages 7 % et 45 % sont calculés sur ces valeurs, pas tirés de l'article. Échéance = plus faible durée de vie − 3.
- Visuel 4 : positions et durées illustratives (intervention 0,5 jour, suites 0,45 jour, 20 jours d'ouverture) ;
  une intervention reste subie avec le plan. Jauge sans chiffre, faute de valeur cible universelle (l'article le dit).

## Aperçu et re-rendu

- Aperçu : `apercus/blog/types-de-maintenance-comment-choisir.html` (régénérer avec
  `python3 outils/apercu_article.py blog/types-de-maintenance-comment-choisir`).
- Contrôle : `outils/rendu_limite.sh blog/types-de-maintenance-comment-choisir/<id> stills 0 5 8`
- Rendu : `outils/rendu_limite.sh blog/types-de-maintenance-comment-choisir/<id> gif 20`

Intégration Shopify : même balise `<video autoplay muted loop playsinline>` que l'article Lean Manufacturing
(voir `blog/lean-manufacturing-definition-principes-outils/README.md`), GIF en repli.
