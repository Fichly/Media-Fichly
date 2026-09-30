# Visuels animés · article « Méthode SMED : les 5 étapes expliquées »

Cinq visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut. Le mouvement montre le mécanisme :
les tâches qui sortent de l'arrêt, la bande d'arrêt qui se resserre, le boulon qui ne serre qu'au dernier tour.

Fichiers dans `livrables/blog/methode-smed-5-etapes/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-plus-souvent-pas-plus-vite` | « Pourquoi réduire vos temps de changement de série ? », après « 👉 Le SMED ne sert pas à produire plus vite… » | Même machine, même demande, une semaine simulée côte à côte : changement de 2 h, trois grandes séries, le stock monte ; changement de 20 min, chaque référence chaque jour, moins d'arrêt au total et un stock moyen divisé par 4,5. |
| 2 | `2-interne-ou-externe` | « Opérations internes et externes », après « Sur le terrain, la question à se poser… » | Les huit tâches du tableau, toutes faites machine arrêtée, passent la question une à une ; les externes sortent vers « machine en marche », la zone d'arrêt se resserre. Même travail, arrêt plus court. |
| 3 | `3-cinq-etapes` | « Les 5 étapes de la méthode SMED », après « Dans ses écrits, Shigeo Shingo… » | Un même changement suivi étape par étape : on chronomètre et on classe, les externes sortent, la chauffe et le réglage passent avant l'arrêt, l'interne rétrécit, la préparation ne déborde plus. L'arrêt passe de 52 à 13 min, l'historique garde chaque palier. |
| 4 | `4-dernier-tour-de-filet` | Étape 4, après « Certaines tâches resteront internes… » | L'image de Shingo : le boulon descend tour après tour, la jauge de serrage reste vide jusqu'au dernier ; la bride à came serre en un quart de tour. |
| 5 | `5-presse-toyota` | « Exemple : la presse de 1 000 tonnes de Toyota », après « L'exemple fondateur vient de Shigeo Shingo… » | Les durées de l'exemple sur une même échelle : 4 h, 90 min (sous les 2 h de Volkswagen), puis moins de 3 min ; un zoom sur les 10 premières minutes rend lisible le « single minute ». |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes (8) : ce qui est refait, ce qui reste

| Image actuelle | Section | Décision |
|----------------|---------|----------|
| `fichly-smed-etape-2-separer-interne-externe.png` | Opérations internes et externes | Refaite en animé : `2-interne-ou-externe`. Retirer l'image fixe. |
| `fichly-smed-5-etapes-diminution.png` (52 → 13 min) | Les 5 étapes, introduction | Refaite en animé : `3-cinq-etapes` (mêmes bornes 52 et 13 min). Retirer l'image fixe. |
| `7_SMED_etape_1.png`, `2_SMED_etape_2.png`, `5_SMED_etape_3.png` | Étapes 1, 2, 3 | Regroupées dans `3-cinq-etapes`, qui montre chaque étape agir sur le même changement. Les retirer, ou les garder comme rappels si on veut une image par étape (non visibles depuis le conteneur : à vérifier). |
| `6_SMED_etape_4.png` | Étape 4 | Remplacée par `4-dernier-tour-de-filet`, placé dans le même paragraphe (l'image est en tête de ce `<p>`). |
| `1_SMED_5_etapes.png` | Fin de l'étape 5 (récapitulatif) | Doublon de `3-cinq-etapes` : à retirer. |
| `9_SMED_6_erreurs.png` | Les 6 erreurs | Gardée : une liste d'erreurs ne gagne rien au mouvement. |

L'embed GIPHY (arrêt au stand de Formule 1) est laissé tel quel.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/3-cinq-etapes.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/3-cinq-etapes.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/3-cinq-etapes.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/methode-smed-5-etapes.html` : l'article complet avec chaque visuel à sa place (les images fixes existantes
y apparaissent encore, puisque `article.html` n'est pas modifié). Régénérer avec
`python3 outils/apercu_article.py blog/methode-smed-5-etapes`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/methode-smed-5-etapes/<id> stills 0 4 8   # images de contrôle dans controle/
outils/rendu_limite.sh blog/methode-smed-5-etapes/<id> gif 20         # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Plus souvent : semaine de 5 jours de 8 h, trois références, un carton toutes les 2 h de production, un carton de chaque
  référence enlevé chaque soir ; changement de 2 h (repris de l'introduction de l'article) contre 20 min après SMED
  (valeur illustrative). Les chiffres affichés (3 et 15 séries, 6,3 et 1,4 cartons de stock moyen) sortent de cette simulation.
- Interne ou externe : les huit tâches et leur classement sont ceux du tableau de l'article ; l'ordre de départ (mélangé) est illustratif.
- Cinq étapes : seules les bornes 52 et 13 min viennent de l'image existante. Le découpage en tâches et les paliers intermédiaires
  (41, 25, 15 min) sont des hypothèses, choisis pour respecter l'article : l'étape 3 donne le plus gros gain, les étapes 1 à 3
  l'essentiel (52 → 25 min), l'étape 5 supprime le débordement de la préparation (2 min).
- Dernier tour de filet : dix tours, nombre illustratif.
- Presse Toyota : chiffres de l'article (4 h, 2 h chez Volkswagen, 90 min, moins de 3 min) ; la barre finale est tracée à 2,9 min.

## Point d'attention sur le texte

L'exemple dit que l'équipe atteint les 3 minutes « quelques mois plus tard », la FAQ parle de « plusieurs années d'itérations ».
Le visuel n'affiche aucune durée de chantier ; à harmoniser dans l'article.
