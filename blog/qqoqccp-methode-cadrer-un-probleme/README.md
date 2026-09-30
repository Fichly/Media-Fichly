# Visuels animés · article « QQOQCCP (ou QQOQCP) : cadrer un problème en sept questions »

Trois visuels au format blog (1200 × 860) pour un article court (3 457 mots), charte des fiches : papier, bandeau six
couleurs, Poppins, palette Fichly. Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut.

Fichiers dans `livrables/blog/qqoqccp-methode-cadrer-un-probleme/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-sans-combien` | QQOQCP ou QQOQCCP, après « L'absence du second C n'est donc pas une faute d'orthographe… » | Deux problèmes cadrés sans Combien : la balance penche du côté de la voix la plus forte. Le second C s'insère dans le sigle et dans les fiches, les chiffres tombent dans les plateaux, la balance bascule ; six mois plus tard, le même Combien dit si c'est mieux. |
| 2 | `2-du-vague-a-la-phrase` | Comment cadrer un problème en vingt minutes, après le paragraphe d'introduction (**remplace l'image `VISUEL-A-CREER`** qui suit) | Chaque question, posée dans l'ordre de l'article (Quoi et Où avant Qui), envoie son morceau à sa place dans la phrase de problème, souligné de sa couleur. Le Pourquoi ne produit rien : il coche chaque question. La phrase vague du départ est barrée. |
| 3 | `3-le-pourquoi-sur-chaque-ligne` | Même section, étape 3, après « Reprenez les six réponses une à une… » | La septième ligne « Pourquoi : la cause ? » est refusée et devient une colonne. Le Pourquoi repasse sur chaque réponse : quatre tiennent, le périmètre choisi par habitude et la grandeur retenue parce que disponible sont réécrits. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

Poids : GIF 1,01 / 1,10 / 0,97 Mo ; MP4 0,57 à 0,75 Mo.

## Image existante

L'inventaire prévoit une image à créer (`VISUEL-A-CREER`, « les sept questions du QQOQCCP reliées chacune au morceau
de phrase qu'elle produit ») : c'est `2-du-vague-a-la-phrase`. À l'intégration, supprimer le paragraphe
`<p><img src="VISUEL-A-CREER" …></p>` qui suit l'introduction de la section. L'image `VISUEL-A-CREER` des données
structurées (`"image"` du JSON-LD) peut pointer vers `2-du-vague-a-la-phrase.png`.

Pas de visuel pour le tableau des sept questions (il se lit mieux en tableau), ni pour Quintilien et le vocabulaire anglais.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/2-du-vague-a-la-phrase.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/2-du-vague-a-la-phrase.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/2-du-vague-a-la-phrase.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/qqoqccp-methode-cadrer-un-probleme.html`, régénéré avec
`python3 outils/apercu_article.py blog/qqoqccp-methode-cadrer-un-probleme`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/qqoqccp-methode-cadrer-un-probleme/<id> stills 0 5 10   # images de contrôle dans controle/
outils/rendu_limite.sh blog/qqoqccp-methode-cadrer-un-probleme/<id> gif 20          # GIF, MP4 et PNG dans livrables/
```

## Hypothèses

- Sans Combien (visuel 1) : valeurs illustratives (problème A 2 % des pièces, problème B 7 %, B à 3 % six mois plus
  tard) et voix la plus forte placée du côté de A. Les réponses aux six autres questions sont figurées par des barres grises.
- Du vague à la phrase (visuel 2) : la phrase est le gabarit de l'article, champs laissés à remplir (cases pointillées).
  Le rattachement des morceaux aux questions est un choix du visuel : « en équipe [équipe] » au Comment,
  « au contrôle final » au Qui avec la fonction qui constate.
- Le Pourquoi sur chaque ligne (visuel 3) : réponses de départ illustratives (« toute la ligne de conditionnement »,
  « nombre d'arrêts de la ligne »), réécrites en « poste de conditionnement » et « part des pièces concernées »
  d'après la phrase de problème de l'article ; les questions autres que périmètre, date de départ et grandeur de
  mesure sont formulées par le visuel.
