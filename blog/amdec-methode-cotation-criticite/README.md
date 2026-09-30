# Visuels animés · article « AMDEC : méthode, cotation de la criticité et plan d'action en atelier »

Cinq visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Article de méthode (5 696 mots) : cinq visuels, du vocabulaire du tableau jusqu'à la recotation. Chaque visuel démarre
et finit sur l'image complète, la boucle se referme sans saut.

Fichiers dans `livrables/blog/amdec-methode-cotation-criticite/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-cause-mode-effet` | Définition, après « Retenez la règle de lecture… » | L'exemple du roulement se produit dans l'ordre : la graisse disparaît et le carter se pollue (cause), le roulement ralentit et se bloque (mode), le tapis s'arrête et l'andon passe au rouge (effet). Chaque colonne dit ce qu'elle porte. |
| 2 | `2-trois-notes-une-multiplication` | Quelle échelle retenir, après « Chaque niveau doit être défini par un fait observable… » (**à la place du placeholder `VISUEL-A-CREER`**) | Trois échelles de 1 à 4 du vert au rouge ; le sélecteur monte au palier que désigne le fait (une occurrence par mois, arrêt de plus d'une journée, signe audible), les trois notes descendent se multiplier : 3 × 3 × 2 = 18, placé sur l'échelle de 1 à 64. Pastille « note haute = on ne voit rien venir » sur D. |
| 3 | `3-seuil-capacite-action` | Seuil de criticité, après « Ce critère a une conséquence qui surprend et qui est saine… » | Les lignes montent dans l'ordre du tableau, se trient (quelques lignes détachées, un long plateau), puis la coupure tombe à la capacité de l'équipe : 3 actions, seuil 32 ; 6 actions, seuil 12. Enfin G = 4 et D = 4 passent en action malgré leur criticité. |
| 4 | `4-une-action-une-note` | Après la séance, après « Une fois les actions réalisées, recotez… » | Chaque action (verbe, nom, date) pointe la note qu'elle attaque ; à la recotation, seule cette note baisse et la criticité suit ; la date de recotation se pose au calendrier. |
| 5 | `5-echelle-figee` | Les erreurs, après « ❌ Modifier l'échelle en cours de séance… » | Deux pannes identiques, lignes 3 et 16 : la grille change à la ligne 15 et le même fait tombe un palier plus bas (18 contre 12) ; grille figée, corrigée après et tout recoté d'un bloc : 12 et 12. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Image existante et placeholders

- `VISUEL-A-CREER` (section « Quelle échelle retenir… ») : **remplacé par le visuel 2**, qui reprend le brief du
  commentaire de l'article (trois colonnes, 1 à 4 du vert au rouge, piège de la non-détection, multiplication,
  « 1 à 64 / 1 à 1 000 », « Le chiffre ne veut rien dire seul, il ne sert qu'à classer ») au format blog 1200 × 860
  et animé, sans l'encart Audit Lean. À l'intégration, remplacer le `<p><img src="VISUEL-A-CREER" …></p>` par la vidéo
  et le champ `image` du JSON-LD par l'URL du PNG. Dans l'aperçu, le placeholder cassé apparaît juste sous le visuel.
- Les placeholders de l'article (`[famille d'équipement]`, `[secteur]`, `[nombre d'arrêts relevés]`,
  `[capacité d'action]`) ne sont **pas** repris dans les visuels : l'exemple du visuel 2 dit « une ligne du tableau »,
  et le visuel 3 montre deux capacités illustratives.

## Hypothèses

- Visuel 2 : paliers de fréquence tirés de l'article ; paliers G 3 (« plus d'une journée ») et G 4 (« une semaine
  d'arrêt ») tirés de l'article, G 1 (« moins d'une heure ») et G 2 (« quelques heures ») ajoutés ; D 1 (capteur avec
  alarme), D 2 (signe audible) et D 4 (casse sans prévenir) tirés de l'article, D 3 (« vu seulement à l'arrêt ») ajouté.
- Visuel 3 : les douze lignes (notes F, G, D) sont inventées ; capacités de 3 et 6 actions par trimestre choisies
  d'après l'article (« trois est un bon ordre de grandeur », « une équipe qui en tient six »), l'article laissant la
  valeur `[capacité d'action]` à fixer. Seuils 32 et 12 = criticité de la 3e et de la 6e ligne de cette liste.
- Visuel 4 : modes « courroie cassée » et « fuite du vérin », noms des responsables et dates sont illustratifs ;
  le roulement bloqué vient de l'article. Les trois lignes reprennent les trois plus critiques du visuel 3 (48, 36, 32).
- Visuel 5 : la grille modifiée (chaque jour / chaque semaine / chaque mois / plus rare) est inventée pour l'exemple ;
  G = 3 et D = 2 identiques sur les deux lignes.

## Aperçu et re-rendu

- Aperçu : `apercus/blog/amdec-methode-cotation-criticite.html` (régénérer avec
  `python3 outils/apercu_article.py blog/amdec-methode-cotation-criticite`).
- Contrôle : `outils/rendu_limite.sh blog/amdec-methode-cotation-criticite/<id> stills 0 5 8`
- Rendu : `outils/rendu_limite.sh blog/amdec-methode-cotation-criticite/<id> gif 20`

Intégration Shopify : même balise `<video autoplay muted loop playsinline>` que l'article Lean Manufacturing
(voir `blog/lean-manufacturing-definition-principes-outils/README.md`), GIF en repli.
