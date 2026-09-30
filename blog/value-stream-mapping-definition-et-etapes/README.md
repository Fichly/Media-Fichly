# Visuels animés · article « Value Stream Mapping : définition et étapes »

Cinq visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut. Le mouvement porte le fond :
on voit le mécanisme se produire (la pièce qui dessine la ligne de temps, le classement qui s'inverse, les nuits qui
disparaissent du ratio), on ne se contente pas de faire apparaître des blocs.

Fichiers dans `livrables/blog/value-stream-mapping-definition-et-etapes/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-la-ligne-de-temps` | « Une VSM, c'est quoi exactement », après « Cette ligne de temps est l'objet de l'exercice… » | Les deux flux superposés : la commande remonte de droite à gauche en haut, la pièce avance de gauche à droite en bas et dessine la ligne de temps (longs segments bas d'attente, courts segments hauts de transformation) : 5 minutes contre 3 jours. |
| 2 | `2-symboles-vsm` | Les symboles, après « Les symboles ne sont pas décoratifs… » (**remplace l'image `fichly-symboles-vsm.png`**) | Chaque symbole fait ce qu'il représente (camion, boîte de données qui se remplit, stock converti en jours, flèche rayée qui pousse, flux tiré depuis le supermarché, kanban qui remonte, information papier ou électronique, lissage, éclair), avec ce qu'on écrit dedans. |
| 3 | `3-etat-futur-plan-action` | Étape 7, après « Une seconde carte, avec des éclairs kaizen… » (**remplace l'image `fichly-vsm-simplifiee.png`**) | La même ligne (préparation, impression, découpe, poinçonnage et contrôle, conditionnement, stocks et déplacements) passe de l'état actuel à l'état futur ; chaque éclair kaizen descend dans le plan d'action et devient une ligne avec un responsable et une échéance. |
| 4 | `4-convention-de-temps` | Exemple chiffré, après « Le chiffre qui déclenche les réactions… » | 300 pièces devant un poste qui en consomme 100 par jour : chaque rangée de 100 devient un jour. Puis les mêmes 3 jours en calendaire (4 320 min, 0,12 %) et en temps ouvré (1 440 min, 0,35 %) : les nuits disparaissent, les 5 minutes ne bougent pas, le ratio triple sans rien changer. |
| 5 | `5-les-plus-longs-pas-les-plus-gros` | État futur, après « L'ordre d'attaque est presque toujours le même… » (avant la liste) | Classés par quantité, A est en tête ; divisés par la consommation du poste suivant, les stocks deviennent des jours et le classement s'inverse : C, le plus petit, est le plus long. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

- `fichly-symboles-vsm.png` : refaite en animé (`2-symboles-vsm`), mêmes symboles que l'image (fournisseur et client,
  processus, boîte de données, stock, flux poussé, flux tiré, information papier et électronique, kanban, lissage,
  opérateur, éclair kaizen), plus le supermarché du tableau. À retirer de l'article si la vidéo est intégrée.
- `fichly-vsm-simplifiee.png` : refaite en animé (`3-etat-futur-plan-action`), même ligne et mêmes icônes de stock et de
  déplacement, avec en plus le passage à l'état futur et au plan d'action que décrit l'étape 7. À retirer si la vidéo est intégrée.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/1-la-ligne-de-temps.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/1-la-ligne-de-temps.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/1-la-ligne-de-temps.gif" alt="…" width="1200" height="860" loading="lazy">`.
Les MP4 pèsent 0,5 à 0,7 Mo, les GIF 0,8 à 1,2 Mo.

## Aperçu

`apercus/blog/value-stream-mapping-definition-et-etapes.html` : l'article complet avec chaque visuel à sa place et, dessous,
une note (à ne pas publier) sur ce qu'il doit faire comprendre. Régénérer avec
`python3 outils/apercu_article.py blog/value-stream-mapping-definition-et-etapes`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/value-stream-mapping-definition-et-etapes/<id> stills 0 4 8   # images de contrôle dans controle/
outils/rendu_limite.sh blog/value-stream-mapping-definition-et-etapes/<id> gif 20        # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Ligne de temps : l'article donne 5 minutes en machine et 3 jours de traversée. La répartition par poste est une
  hypothèse du visuel (1 + 3 + 1 minute, 1 + 1,5 + 0,5 jour) ; les segments ne sont pas à l'échelle, comme sur une VSM.
- Symboles : les valeurs d'exemple écrites dans les symboles (2 livraisons par semaine, Découpe avec 2 opérateurs, C/T 45 s,
  C/O 20 min, disponibilité 85 %, max 3, 20 pièces par carte, ERP, séquence A B A C, SMED) sont illustratives ;
  300 pièces = 3 jours reprend l'exemple de l'article. La ligne « opérateur » n'est pas dans le tableau de l'article
  (le symbole figure sur l'image d'origine).
- État futur : les trois chantiers suivent l'ordre d'attaque de l'article (changement de série, stock entre deux postes,
  poste qui donne le rythme) mais leur placement sur cette ligne, les responsables (Méthodes, Chef d'atelier, Resp. production)
  et les échéances (mois 2, 4, 6, dans l'horizon de trois à six mois) sont illustratifs.
- Convention de temps : 1 carton = 25 pièces ; les 8 heures ouvrées sont dessinées en début de chaque journée (schéma).
- Les plus longs, pas les plus gros : quantités et consommations inventées pour l'illustration (A 600 pièces pour
  600 par jour, B 300 pour 100 par jour comme dans l'article, C 120 pour 20 par jour).
- L'exemple chiffré de l'article contient encore des champs à remplir ([secteur], [C/T poste 1]…) : le visuel 4 n'utilise
  que les chiffres rédigés (300 ÷ 100, 5 minutes, 3 jours, 4 320 et 1 440 minutes, 0,12 et 0,35 %).
