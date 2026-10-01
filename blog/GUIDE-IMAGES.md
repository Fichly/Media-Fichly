# Guide · images des articles de blog Fichly

En haut de chaque article : une vidéo motion (à venir). Dans l'article : des **images fixes**, simples et
pédagogiques, que Google Images peut indexer. Référence : `blog/lean-manufacturing-definition-principes-outils/images/`.

## 1. Quand mettre une image

- Seulement si elle fait mieux comprendre la section que le texte seul : une structure (maison Toyota),
  une comparaison (flux poussé / tiré), un avant / après, un enchaînement, un calcul.
- Pas d'image pour redire un tableau ou une liste déjà dans l'article.
- Une image = une idée de la section. 3 à 6 images pour un article long, 2 ou 3 pour un article court.

## 2. Simple

- Titre sur une ligne, contenu, chute. Pas de chapeau.
- Peu de mots : environ 35 au maximum hors titre et chute.
- Texte lisible sur téléphone : 21 px minimum, 24 à 32 px pour l'essentiel, chiffres clés en grand.
- 3 à 7 éléments. De l'air entre les blocs.

## 3. Pas de fioriture

- Pas d'icône décorative : une icône seulement si elle identifie un objet (machine, carton, client).
- Pas de cases vides, de pointillés fantômes, de texte barré, ni d'élément qui n'a de sens qu'en mouvement.
- Un avant / après se montre côte à côte ou l'un au-dessus de l'autre, chaque état étiqueté.
- Couleurs : vert = valeur, ce qui va bien ; rouge = problème, gaspillage ; bleu = structure.

## 4. Fidélité

Termes, exemples et chiffres de l'article. Toute hypothèse ajoutée (répartition, échelle) est écrite en tête
du `visuel.js` et dans la section « Hypothèses » du README de l'article.

## 5. Format, fichiers, commandes

- 1200 × 860, gabarit `outils/gabarit.js` : `G.image(() => { G.templateBlog(); G.blogTitle(…); …; G.blogChute(…, { y: 808 }); })`.
  Contenu entre y = 140 et y = 745. Helpers : `card`, `pill`, `para`, `badgeNum`, `check`, `cross`, `arrow`,
  `machine`, `carton`, `person`, `fit` (contrôle des débordements).

```
blog/<article>/images.json                    [{ id, section, apres, alt }] dans l'ordre de l'article
blog/<article>/images/<n>-<slug>/index.html   copie d'une page de référence (chemins ../../../../)
blog/<article>/images/<n>-<slug>/visuel.js
livrables/blog/<article>/images/<id>.webp     pour le site (~60 Ko)
livrables/blog/<article>/images/<id>.png      archive
```

- Rendu : `node outils/rendu.js blog/<article>/images/<id> png` (sort en code 2 sur un débordement).
- Contrôle : regarder l'image en taille réelle, puis réduite à 390 px de large (téléphone).
- `apres` : extrait exact d'un paragraphe `<p>` de l'article ; l'image est insérée après ce paragraphe.
- `alt` : ce que montre l'image et ce qu'elle explique, en une ou deux phrases, avec les mots de l'article.
- Sur Shopify, le fichier s'appelle `fichly-<article>-<id>.webp` : un nom descriptif aide Google Images.
