# Visuels animés · article « TPM (Total Productive Maintenance) : par quoi commencer et ce qui la fait tenir »

Cinq visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Article de méthode (4 419 mots) : cinq visuels, chacun sur un mécanisme que le texte explique. Chaque visuel démarre
et finit sur l'image complète, la boucle se referme sans saut.

Fichiers dans `livrables/blog/tpm-total-productive-maintenance/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-transfert-des-gestes` | Qu'est-ce que la TPM, après « Cette distinction a une conséquence directe sur le périmètre… » | Les quatre gestes (nettoyage, lubrification, inspection, serrage) passent un à un à la production, qui reçoit un créneau au planning ; le service maintenance garde son effectif et récupère la place pour ce que lui seul sait faire ; l'obligation de l'employeur, en bas, ne bouge pas. |
| 2 | `2-piliers-dans-l-ordre` | 8 piliers, après « Les huit piliers sont la présentation canonique… » | La liste à plat (huit chantiers de front) se défait ; les 5S descendent former le socle ; les piliers montent dans l'ordre, le toit se pose à la fin. |
| 3 | `3-pertes-sur-le-trs` | Mesurer la TPM, après « La plupart de ces pertes sont exactement ce que mesure le TRS… » | Chaque perte rejoint le facteur du TRS qu'elle fait baisser ; les quatre pertes que le TRS ne voit pas rebondissent sur le cadre et tombent chez les gaspillages du Lean. Puis les deux règles de lecture : pas de seuil, suivre la part des arrêts subis. |
| 4 | `4-sept-etapes` | Les 7 étapes, après « La maintenance autonome, jishu hozen en japonais… » | L'équipe monte marche par marche, une coche « tient sans rappel » avant chaque saut ; la 4e marche est la plus haute ; la courbe des arrêts subis ne bouge qu'à la 5e, où l'équipe plante son drapeau. |
| 5 | `5-courbe-des-six-mois` | Six mois, après « Voici les cinq causes d'arrêt… » (à la place de l'image) | Même lancement : à gauche, la même anomalie signalée trois fois reste sans réponse, l'opérateur arrête de remplir, la courbe s'effondre ; à droite, le passage hebdomadaire répond, la courbe tient. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

- `2_8_piliers_TPM.png` (section des 8 piliers, alt vide) : **à remplacer** par le visuel 2, qui montre en plus
  l'ordre de lancement et le socle 5S (le point que la présentation à plat fait manquer, selon l'article).
- `1_16_pertes_TPM.png` (section mesure, alt vide) : **conservée**. D'après son nom, elle recense les seize pertes
  du JIPM : un inventaire. Le visuel 3, placé juste après, montre sur quel facteur du TRS pèse chaque perte.
  Penser à lui donner un texte alt.
- `Courbe_des_six_mois.png` (section six mois, alt vide) : **à remplacer** par le visuel 5, qui montre la même
  courbe et la cause numéro un de sa chute (les fiches que personne ne lit). L'image est dans le même `<p>` que la
  phrase « Voici les cinq causes… » : retirer la balise `<img>` et le `<br>` qui la suit.

## Hypothèses

- Visuel 1 : la part du temps du service maintenance prise par les gestes simples et la taille du créneau au planning
  sont illustratives.
- Visuel 2 : l'article ne fixe que le début (maintenance autonome et amélioration ciblée) et la fin (conception et
  services, des années plus tard). Le regroupement des quatre autres piliers en « ensuite, un pilier après l'autre »
  est une hypothèse de présentation, sans ordre entre eux.
- Visuel 3 : le poids de chaque perte dans les jauges est illustratif, sans chiffre (l'article refuse les seuils de TRS).
- Visuel 4 : l'allure de la courbe des arrêts subis (plate jusqu'à l'étape 4, en baisse à l'étape 5) suit le texte,
  sans échelle. L'arrêt de l'équipe à la 5e illustre « la cinquième bien tenue vaut mieux que la septième affichée ».
- Visuel 5 : courbes illustratives ; dates des signalements et des passages simulées (passage hebdomadaire, réponse au
  passage suivant) ; « responsable qui peut décider » reprend « quelqu'un qui peut décider » de l'article.

## Aperçu et re-rendu

- Aperçu : `apercus/blog/tpm-total-productive-maintenance.html` (régénérer avec
  `python3 outils/apercu_article.py blog/tpm-total-productive-maintenance`).
- Contrôle : `outils/rendu_limite.sh blog/tpm-total-productive-maintenance/<id> stills 0 5 8`
- Rendu : `outils/rendu_limite.sh blog/tpm-total-productive-maintenance/<id> gif 20`

Intégration Shopify : même balise `<video autoplay muted loop playsinline>` que l'article Lean Manufacturing
(voir `blog/lean-manufacturing-definition-principes-outils/README.md`), GIF en repli.
