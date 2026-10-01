# Guide · images des articles de blog Fichly

En haut de chaque article : une vidéo motion (à venir). Dans l'article : des **images fixes**, que Google Images
peut indexer.

## 1. L'image fixe d'un visuel

Chaque visuel de `blog/<article>/<n>-<slug>/` est construit pour que son image à t = 0 soit **complète** :
c'est elle qui sert d'image fixe. Référence validée : les 8 visuels de l'article Lean Manufacturing
(`blog/lean-manufacturing-definition-principes-outils/images.json`).

- Une image explique une idée de la section, quand le texte seul ne suffit pas : structure, comparaison,
  avant / après, enchaînement, calcul. Pas d'image pour redire un tableau ou une liste.
- Simple et pédagogique, sans fioriture : chaque élément sert à comprendre.
- L'image complète doit se lire seule, sans le mouvement.

## 2. Fichiers et commandes

```
blog/<article>/images.json        [{ id, section, apres, alt }] : les images retenues, dans l'ordre de l'article
livrables/blog/<article>/<id>.webp   image fixe pour le site (60 à 90 Ko)
livrables/blog/<article>/<id>.png    archive (palette 128 couleurs)
```

- Rendu : `node outils/rendu.js blog/<article>/<id> png` (image à t = 0, sort en code 2 sur un débordement).
- `apres` : extrait exact d'un paragraphe `<p>` de l'article ; l'image est insérée après ce paragraphe.
- `alt` : ce que montre l'image et ce qu'elle explique, en une ou deux phrases, avec les mots de l'article.
- Sur Shopify, le fichier s'appelle `fichly-<article>-<id>.webp` : un nom descriptif aide Google Images.
- Méthode de conception des visuels eux-mêmes : `blog/GUIDE-VISUELS.md`.
