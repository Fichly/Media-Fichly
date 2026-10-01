# Visuels des articles du blog

Un dossier par article (handle Shopify), un sous-dossier par visuel : `index.html` + `visuel.js`, sur le gabarit `outils/gabarit-article.js` (1200 × 860, comme les GIF de l'article Ishikawa).

Rendu : `node outils/rendu.js articles-v2/visuels/<handle>/<n>-<nom> gif 15` → `livrables/articles/fichly-<handle>-<n>-<nom>.gif`, `.mp4` et `.png` (image complète, t = 0). Contrôle : `… stills 0 4.5` → `controle/`.

Chaque visuel remplace le commentaire `<!-- VISUEL n : … -->` du corps de l'article, en `<img … width="1200" height="860" loading="lazy">`, comme dans l'article Ishikawa.

## Kaizen : définition, méthode et mise en pratique en atelier

`kaizen-definition-methode-amelioration-continue` · brouillon créé le 1er octobre 2026

| Visuel | Emplacement | Texte alternatif |
|---|---|---|
| `1-standard-cale` (couverture proposée) | VISUEL 1, section « Les 5 principes du kaizen » | Deux pentes identiques. Sans standard, le bloc monte de trois petits pas puis redescend au point de départ au premier changement d'équipe. Avec standard, chaque petit pas est calé par une cale « standard » et le bloc arrive en haut. |
| `2-chantier-et-quotidien` | VISUEL 2, fin de la section « Kaizen quotidien ou chantier kaizen » | Courbe de performance d'un poste sur six mois. Elle saute pendant un chantier kaizen de cinq jours. Sans suite, le gain s'érode jusqu'au niveau de départ. Avec un kaizen quotidien, le gain tient et progresse par petites marches. |

## Management visuel : rendre les écarts visibles pour décider plus vite

`management-visuel-outils-exemples` · brouillon créé le 1er octobre 2026

| Visuel | Emplacement | Texte alternatif |
|---|---|---|
| `1-trois-niveaux` | VISUEL 1, section « Les 3 niveaux » | Trois niveaux empilés du management visuel : l'état du poste, la performance, puis les écarts et les actions. La plupart des dispositifs s'arrêtent au deuxième niveau. Le troisième fait la différence : un nom, une date. |
| `2-chaine-ecart-action` | VISUEL 2, étape 4 « Relier chaque rouge à une action » | La chaîne en quatre cartes : un indicateur avec sa cible, un écart en rouge, une décision prise au point d'équipe, une action avec un nom et une date. Si l'écart revient, l'action devient une analyse de cause par les 5 Pourquoi. |
| `3-tableau-rempli` (couverture proposée) | VISUEL 3, après le tableau « Exemple de tableau d'équipe » | Tableau d'équipe rempli du lundi au jeudi sur cinq rubriques. Deux cases rouges, le délai de mercredi et la qualité de jeudi, sont reliées chacune à une ligne d'action : l'écart, l'action, qui et pour quand. |
