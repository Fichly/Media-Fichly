# Visuels animés · article « Obeya : à quoi sert vraiment une salle de pilotage visuel »

Trois visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins,
palette Fichly. Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.
Article court (environ 2 700 mots) : trois visuels, chacun sur un mécanisme que le texte explique.
L'article n'avait aucune image existante (voir `blog/inventaire.json`).

Fichiers dans `livrables/blog/obeya-salle-pilotage-visuel/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-cinq-zones` | Quelles zones afficher, après « L'ordre n'est pas décoratif… » (juste après le tableau des zones) | L'ordre des zones est l'ordre de la réunion : l'équipe, debout, avance devant le mur de la zone 1 à la zone 5, la barre des 15 minutes avance au même pas, chaque zone s'anime quand on la lit, et la séance se termine sur une décision écrite en zone 5. |
| 2 | `2-sans-rituel` | À quelle fréquence, après « … ne produit aucune décision. L'affichage est le support, la fréquence est le mécanisme. » | Même mur, douze semaines. Sans créneau fixe, la salle s'éteint d'elle-même : date figée, échéances dépassées, seuil franchi sans réaction, zéro décision (les signes de la section « Obeya morte »). Avec une séance par semaine, tout bouge et une décision s'écrit à chaque séance. |
| 3 | `3-war-room-obeya` | Obeya, oobeya, war room, après « La distinction qui compte oppose l'Obeya à la war room… » | La war room naît avec l'incident et se dissout quand il est réglé, c'est sa réussite ; l'Obeya reste du premier au dernier mois, ses trois rythmes continuent, crise ou pas. La chute rappelle qu'une Obeya qui se dissout est un échec. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.
Le tableau de correspondance des termes (Obeya, oobeya, war room…) et le tableau des rythmes restent en texte :
le visuel 3 montre ce qu'ils ne montrent pas (la durée de vie de chaque salle), sans les recopier.

## Intégration Shopify

Même balisage que les autres articles : `<video autoplay muted loop playsinline>` avec le PNG en `poster`
et le texte alternatif en `aria-label`, ou le GIF en repli si l'éditeur retire la balise `<video>`.

## Aperçu

`apercus/blog/obeya-salle-pilotage-visuel.html`, régénéré par
`python3 outils/apercu_article.py blog/obeya-salle-pilotage-visuel`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/obeya-salle-pilotage-visuel/<id> stills 0 4 8   # images de contrôle dans controle/
outils/rendu_limite.sh blog/obeya-salle-pilotage-visuel/<id> gif 20          # GIF, MP4 et PNG dans livrables/
```

## Hypothèses

- Cinq zones : les 15 minutes sont réparties à parts égales entre les cinq zones (3 minutes chacune) pour
  la lecture ; l'article donne 10 à 15 minutes pour le point quotidien, sans répartition. Le contenu des
  zones (courbes, jalons, échéances « 15/10 », « 17/10 »…) est schématique.
- Sans rituel : douze semaines simulées, une décision par séance côté créneau fixe (l'article demande
  « une décision minimum »), d'où 12 contre 0. La salle sans créneau a une séance d'inauguration en
  semaine 1, puis plus rien (l'article : « installées, photographiées, puis désertées »). Les échéances
  (S3, S4, S5, repoussées de trois semaines à chaque séance) et la courbe de l'indicateur sont illustratives.
- War room / Obeya : durée de la crise (environ six semaines sur six mois) et forme de la courbe d'incident
  illustratives. Les trois rythmes reprennent ceux de l'article (quotidien, hebdomadaire, mensuel), placés
  sur une frise de six mois à raison d'environ 22 jours ouvrés par mois.
