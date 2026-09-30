# Visuels animés · article « Méthode des 5 pourquoi »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins,
palette Fichly. Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut.
Le mouvement montre le mécanisme décrit par le texte : la bifurcation sur un mot, le mur du 3e niveau,
la relève qui fait revenir le défaut, les branches qui descendent chacune à leur rythme.

Fichiers dans `livrables/blog/methode-5-pourquoi-cause-racine/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-deux-chaines` | Deux exemples, après « Les deux chaînes sont identiques jusqu'au deuxième niveau… » (après le tableau) | Un tronc commun jusqu'au niveau 2, puis la bifurcation sur un seul mot (un qui / un quoi). À gauche, arrêt : les niveaux 4 et 5 restent en pointillés. À droite, la chaîne descend jusqu'au mécanisme. Les deux conclusions arrivent côte à côte. |
| 2 | `2-arret-au-troisieme-niveau` | Pourquoi la chaîne s'arrête au troisième niveau, après « Le premier niveau reste dans la technique… » | Chaque pourquoi élargit le périmètre (technique, poste, salle). Le 4e bute sur le mur de la salle : la réponse désigne une décision prise ailleurs (responsable, service voisin), et les analyses finissent sur « manque de rigueur », « oubli », « inattention ». |
| 3 | `3-test-de-la-releve` | Le test de la relève, après « Le test fonctionne parce qu'il déplace la question… » | On remplace l'opérateur par un collègue équivalent. Il suit le mode opératoire à la lettre, le contrôle n'y est pas, le défaut revient. « L'opérateur ne l'a pas fait » est raturé, la chaîne redémarre sur « Le contrôle ne figure pas dans le mode opératoire ». |
| 4 | `4-brancher-l-analyse` | Brancher l'analyse, après « La règle tient en trois points. » (juste avant la liste) | La règle en trois temps : le « et » ouvre deux chaînes sans arbitrer ; chacune descend jusqu'à son propre arrêt (3 et 6 niveaux) ; on arbitre à la fin sur la part des occurrences, la branche B est notée et reste visible. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

- `Qu_est-ce_que_le_5_Pourquoi_-_CTA_Audit_-_Fichly.png` (section « Qu'est-ce que la méthode des 5 pourquoi ? ») :
  d'après son nom, un visuel d'appel à l'action (audit). Laissée telle quelle : ce n'est pas un concept à animer.
- `5_pourquoi_-_Chaine_causale.png` (section « Quand une réponse en contient deux : brancher l'analyse ») :
  refaite en animé par `4-brancher-l-analyse` (même idée, avec l'ordre de la règle). À remplacer par la vidéo,
  ou à garder en tête de section si l'image montre autre chose qu'une chaîne qui se divise (non visible depuis le conteneur).

## Non illustré

« Contre-mesure ou action corrective » : la distinction occurrence / récurrence est claire dans le texte et
son mécanisme (le problème qui revient ou non) est déjà montré dans les visuels des articles PDCA (la roue qui
redescend sans standard) et DMAIC (effet de projet sans phase Contrôler).

## Intégration Shopify

Même balisage que pour l'article Lean Manufacturing :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/1-deux-chaines.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/1-deux-chaines.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF : `<img src="…/1-deux-chaines.gif" alt="…" width="1200" height="860" loading="lazy">`.
Poids : MP4 0,6 à 0,7 Mo, GIF 0,74 à 1,03 Mo.

## Aperçu

`apercus/blog/methode-5-pourquoi-cause-racine.html` : l'article complet avec chaque visuel à sa place et une note
(à ne pas publier) sur ce qu'il doit faire comprendre. Régénérer avec
`python3 outils/apercu_article.py blog/methode-5-pourquoi-cause-racine`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/methode-5-pourquoi-cause-racine/<id> stills 0 5 9   # images de contrôle dans controle/
outils/rendu_limite.sh blog/methode-5-pourquoi-cause-racine/<id> gif 20         # GIF, MP4 et PNG dans livrables/
```

## Hypothèses

- Deux chaînes, test de la relève : textes des niveaux repris mot pour mot du tableau de l'article. Le problème de
  départ est formulé « Un défaut qui revient sur un même équipement » (l'article : « un défaut qui revient
  régulièrement sur un même équipement »).
- Arrêt au 3e niveau : les zones (technique, poste, salle, ailleurs) et les formulations d'arrêt viennent de l'article ;
  les deux personnages « responsable » et « service voisin » illustrent « une décision prise ailleurs ».
- Test de la relève : les trois étapes du mode opératoire (monter l'outil, régler la machine, lancer la série)
  sont illustratives ; l'article dit seulement que le contrôle n'y est écrit nulle part.
- Brancher l'analyse : l'article ne donne pas d'exemple de réponse double, d'où « cause A et cause B ». La répartition
  70 % / 30 % des occurrences est une hypothèse du visuel ; les profondeurs 3 et 6 niveaux sont celles de l'article.
