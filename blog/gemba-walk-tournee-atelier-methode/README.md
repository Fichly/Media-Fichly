# Visuels animés · article « Gemba et gemba walk : ce qu'on regarde vraiment quand on descend en atelier »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins,
palette Fichly. Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.
Article court (environ 2 300 mots), mais porté par trois angles (la sortie écrite, la trame minutée,
l'effet observateur) plus la définition : un visuel par mécanisme. L'article n'avait aucune image existante.

Fichiers dans `livrables/blog/gemba-walk-tournee-atelier-methode/` : `<id>.mp4` (à privilégier), `<id>.gif`
(repli) et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-travail-reel` | Qu'est-ce que le gemba, après « Cet écart porte un nom… Une tournée sert à trouver cette raison, pas à la rappeler. » | Travail prescrit et travail réel superposés : la fiche décrit un trajet droit, l'opérateur contourne un chariot à chaque carton. Le tableau de bord ne voit que les 2 h d'arrêt ; l'observateur compte les détours, demande pourquoi, obtient la raison et écrit l'écart. |
| 2 | `2-constat-ecrit` | Ce qu'une tournée doit produire, après « Trois à cinq constats par tournée suffisent… » | Le constat se construit élément par élément : ce qu'on écrit souvent est barré et remplacé (le fait, le lieu exact, l'heure, un porteur nommé, une échéance). Trois constats relus au passage suivant se referment ; la liste de quinze lignes n'est jamais relue. |
| 3 | `3-trame-30-minutes` | La trame, après « Une tournée se prépare en cinq minutes… » (avant le tableau) | La frise minutée pilote la scène : l'observateur relit, reste immobile le temps d'un cycle, suit une pièce de poste en poste, pose ses questions, restitue et se fait corriger, remonte écrire. |
| 4 | `4-effet-observateur` | L'effet observateur, après « Le phénomène est documenté… vous le réduirez. » (avant les trois leviers) | Le responsable entre, l'atelier bascule (cadence, protections, fiche officielle), il sort, tout revient. Une visite par trimestre crée un grand écart, un passage hebdomadaire le fait fondre. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.
Les tableaux de l'article (correspondances des termes, trois raisons de descendre, trame minutée) restent en
texte : le visuel 3 reprend les durées de la trame mais montre ce que le tableau ne montre pas, où se trouve
l'observateur et ce qu'il fait à chaque moment.

## Intégration Shopify

Même balisage que les autres articles : `<video autoplay muted loop playsinline>` avec le PNG en `poster`
et le texte alternatif en `aria-label`, ou le GIF en repli si l'éditeur retire la balise `<video>`.

## Aperçu

`apercus/blog/gemba-walk-tournee-atelier-methode.html`, régénéré par
`python3 outils/apercu_article.py blog/gemba-walk-tournee-atelier-methode`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/gemba-walk-tournee-atelier-methode/<id> stills 0 4 8   # contrôle dans controle/
outils/rendu_limite.sh blog/gemba-walk-tournee-atelier-methode/<id> gif 20          # GIF, MP4 et PNG
```

## Hypothèses

- Travail réel : le chariot contourné et les 2 h d'arrêt viennent de l'article (« En résumé ») ; la raison
  donnée par l'opérateur (« Il n'a pas d'autre place ») et l'implantation vue de dessus sont illustratives.
- Constat écrit : « le bac de rebuts déborde », « en production », « la maintenance » sont les exemples de
  l'article ; « Ligne 2, poste 4 », « Mardi, 10 h 40 », « Julie M., cheffe d'équipe » et « Vendredi » sont
  des valeurs d'exemple inventées (aucune usine ni personne réelle).
- Trame : les durées sont celles du tableau de l'article (5 min avant, 30 min sur le terrain découpées
  5 / 10 / 10 / 5, 10 min après). Les deux questions affichées font partie des huit questions de l'article ;
  l'échange de restitution (« Si j'ai bien compris… », « Pas tout à fait. ») est illustratif.
- Effet observateur : l'article dit qu'une visite trimestrielle est un événement et un passage hebdomadaire
  un décor, sans chiffrer l'écart. La hauteur des barres (un grand écart par trimestre, un écart qui décroît
  de semaine en semaine) est une échelle illustrative, sans unité.
