# Passation : bulles vidéo et fiche recto verso de la page produit « 40 outils du Lean »

À donner à une autre session Claude Code. **Il ne faut rien recréer.** Tout existe déjà dans le dépôt `fichly/media-fichly`, branche `produits-v2`. Il faut seulement reprendre les blocs ci-dessous dans ton artefact.

- Maquette complète publiée : https://claude.ai/artifact/8PqMcxo4dZ5nv8cVa1Jw73. Pour l'ouvrir, utilise l'outil Artifact, action `read`.
- Source : `produits-v2/maquette-fiches-lean.source.html`.
- Page assemblée : `produits-v2/maquette-fiches-lean.html`, produite par `python3 produits-v2/construire.py`.

## 1. Les fichiers

| Chemin | Rôle |
|---|---|
| `produits-v2/maquette-fiches-lean.source.html` | La page : CSS, HTML et JS dans un seul fichier. Elle contient des marqueurs `{{LOGO}}`, `{{HUGO}}`, `{{GUIDE}}`, `{{STORIES}}`. |
| `produits-v2/construire.py` | Remplace les marqueurs : logo et photo en base64, `guide.json`, `stories.json`. Il ajoute les chemins vidéo quand `livrables/stories/<id>-720.mp4` existe. |
| `produits-v2/guide.json` | Le Guide du deck : 7 familles (id 0 à 6, nom, couleur), les besoins « Je souhaite… » avec leurs outils et numéros de fiche, les 8 fiches recto verso (images et repères `pins`). |
| `produits-v2/stories.json` | Les 7 stories : id, nom, famille, handle de l'article lié, texte de la vidéo pour les lecteurs d'écran. |
| `produits-v2/fiches/*.jpg` | Aperçus Canva des fiches en 375 × 532. Le recto de la fiche n° k est la page 2k+5. |
| `livrables/stories/` | Les vidéos. Pour chaque id : `<id>-720.mp4` (H.264), `<id>-720.webm` (VP9, quand le navigateur ne lit pas le H.264), `<id>.jpg` (affiche), `<id>-bulle.png` (vignette ronde) et `<id>.mp4` (maître 1080 × 1920 pour Reels et LinkedIn). |
| `stories/moteur.js`, `stories/<id>/scene.js`, `outils/rendu.js` | Le moteur des vidéos en motion design. Mode d'emploi dans `stories/LISEZMOI.md`. |

Les 7 ids : `le-deck`, `5-pourquoi`, `obeya`, `pareto`, `vsm`, `smed`, `poka-yoke`.

## 2. Les blocs à reprendre

Dans la source, chaque bloc porte un attribut `data-anno` :

- **1c · Bulles « Les outils en 15 secondes »** : `<section class="bubbles">`, sous la galerie. La rangée `#bubbles` est générée en JS depuis `STORIES`.
- **Lecteur de stories** : `<dialog class="sp-dialog" id="sp">`, plus le JS de la section « Bulles et lecteur de stories ». Il fonctionne ainsi :
  - barres de progression, tap gauche / droite, appui long pour la pause, glisser vers le bas pour fermer, flèches et Échap au clavier ;
  - bouton « Texte » (transcription), pause en mode animations réduites ;
  - pause de 1,2 s sur la dernière image, préchargement de la story suivante seulement ;
  - stories vues mémorisées dans localStorage, bouton « Ajouter au panier » dans le lecteur.
- **1d · Une fiche du deck, recto verso** : `<section class="real">`. Elle contient :
  - les onglets des 8 fiches et la carte qui se retourne en 3D (`.flip`) ;
  - les repères générés depuis `guide.json` (`fiches[nom].pins`, `null` quand une rubrique manque) ;
  - les légendes recto et verso ;
  - le sélecteur « Je souhaite… » (`#besoin`).
- **3 · Toutes les fiches par famille** : générées depuis `guide.json`. Les liens vers les articles viennent de `ARTICLES` (outil → handle Shopify).

Pour chacun de ces blocs, prends le CSS, le HTML et le JS correspondants. Les variables CSS nécessaires sont dans `:root`. Les couleurs de famille sont les classes `.f0` à `.f6`, qui définissent `--sec` et `--sec-soft`.

## 3. Publier avec les vidéos

L'artefact ne charge pas d'images externes, à cause de sa politique de sécurité (CSP). Les vidéos et les fiches passent par le paramètre `files` de l'outil Artifact, aux chemins relatifs qu'utilise la page :

```
"stories/<id>-720.mp4"   : "livrables/stories/<id>-720.mp4"
"stories/<id>-720.webm"  : "livrables/stories/<id>-720.webm"
"stories/<id>.jpg"       : "livrables/stories/<id>.jpg"
"stories/<id>-bulle.png" : "livrables/stories/<id>-bulle.png"
"fiches/page-XXX.jpg"    : "produits-v2/fiches/page-XXX.jpg"   (tous les jpg du dossier)
```

Pour les 7 ids, cela fait 28 fichiers vidéo et image. Avec les fiches, le total est d'environ 6 Mo.

Si ton artefact n'est pas dans ce dépôt, il y a une autre solution : le copier côté serveur depuis l'artefact ci-dessus. Utilise `files` avec `{"artifact": "https://claude.ai/artifact/8PqMcxo4dZ5nv8cVa1Jw73", "path": "stories/vsm-720.mp4"}`, et ainsi de suite pour chaque fichier.

## 4. Règles à garder

- Ne rien inventer : chiffres, prix, avis, formats. Ce qui manque est marqué `<span class="todo">…</span>`, en orange.
- Appeler les images Canva « aperçu numérique », jamais « vraie fiche » ni « photo ». Pas d'image générée par IA pour montrer le produit.
- Points ouverts, à ne pas trancher seul :
  - le deck compte-t-il 40 ou 42 fiches ? (le prix par outil et les numéros en dépendent) ;
  - taux de TVA, format et papier, livraison, retours ;
  - nombre d'avis vérifiés ;
  - prix barré du pack dans Shopify.
- Pour régénérer une vidéo :

  ```
  NODE_PATH=$(npm root -g) node outils/rendu.js stories/<id> story
  ```

  Ne pas lancer `playwright install` : Chromium est déjà là. Les rendus de `smed` et `poka-yoke` datent d'avant le dernier minutage du moteur, et `5-pourquoi` a un texte qui déborde un peu vers 10 s. Leurs scènes sont corrigées, il reste à les re-rendre.
