# Visuels animés · article « La méthode 5S : définition et exemples »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut. Le mouvement montre le mécanisme :
ce qui change dans la zone, ce qui reste pareil.

Fichiers dans `livrables/blog/la-methode-5s-definition-et-exemples/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-cinq-s-sur-une-zone` | « C'est quoi les 5S ? », après « Retenez la logique de l'enchaînement… » | Une même zone traverse les cinq S dans l'ordre : le douteux part en zone d'attente, chaque outil rejoint sa silhouette, le nettoyage révèle une fuite (notée), la photo de l'état attendu est affichée, puis un passage chaque semaine repère l'outil qui manque. Trois S se font, deux se tiennent. |
| 2 | `2-supprimer-c-est-decider` | Étape Seiri, après « La difficulté est humaine, jamais technique… » | Sans autorité, le tas se déplace de trois mètres (erreur type). Avec celui qui décide et deux critères écrits, chaque objet passe devant la fréquence d'usage et le titulaire et part vers sa destination ; le doute attend en zone datée, au délai il est repris ou il sort. |
| 3 | `3-nettoyer-pour-inspecter` | Étape Seiso, après « D'où la règle qui donne sa valeur à l'étape… » | Même machine sale, même chiffon, même zone propre à la fin. Le prestataire essuie la fuite, le relevé reste vide ; l'équipe note chaque anomalie croisée par le chiffon (capot, vis, fuite, flexible) et la liste part en maintenance. |
| 4 | `4-grille-d-audit` | Grille d'audit, après « La cinquième ligne est celle qui pèse le plus… » (après le tableau) | La même grille remplie à chaque passage, la note sur vingt reportée sur la courbe affichée : un écart sur Ranger devient une action datée et la ligne remonte ; puis un passage saute et la ligne Suivre baisse alors que la zone est impeccable. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

Images existantes : aucune dans l'article (seule l'image de couverture, non concernée).

Non retenu : la section « Pourquoi un 5S retombe-t-il au sixième mois ? » est déjà illustrée par le visuel
`1-outils-sans-routine` de l'article Lean Manufacturing (même chantier 5S sur deux postes, six mois plus tard l'un est
revenu à l'état initial). Il peut être réutilisé tel quel à cet endroit, après « La parade tient en une phrase… »,
plutôt que d'en produire une variante.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/1-cinq-s-sur-une-zone.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/1-cinq-s-sur-une-zone.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/1-cinq-s-sur-une-zone.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/la-methode-5s-definition-et-exemples.html` : l'article complet avec chaque visuel à sa place et, dessous, une note
(à ne pas publier) sur ce qu'il doit faire comprendre. Régénérer avec
`python3 outils/apercu_article.py blog/la-methode-5s-definition-et-exemples`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/la-methode-5s-definition-et-exemples/<id> stills 0 4 8   # images de contrôle dans controle/
outils/rendu_limite.sh blog/la-methode-5s-definition-et-exemples/<id> gif 20         # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Cinq S sur une zone : objets, emplacements et anomalie (une fuite) choisis pour l'illustration ; le prénom « Léa »
  et la fréquence « chaque soir » sur la photo de référence sont fictifs (l'article dit seulement qu'un standard nomme qui fait quoi).
  L'outil qui manque au 3e passage est un exemple d'écart.
- Supprimer : objets, fréquences et titulaires (Léa, Marc, Karim) fictifs ; le délai de la zone d'attente n'est pas chiffré
  (l'article : « un délai fixé à l'avance »).
- Nettoyer : les quatre anomalies sont celles que cite l'article (fuite naissante, flexible usé, vis desserrée, capot qui ne ferme plus).
- Grille d'audit : les notes des passages (16, 19, 17, passage sauté, 18) sont illustratives, pas tirées de l'article ;
  l'action datée (« Karim, jeudi ») est fictive. Les questions des cinq lignes sont celles du tableau de l'article.
