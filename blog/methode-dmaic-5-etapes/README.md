# Visuels animés · article « Méthode DMAIC : les 5 étapes »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins,
palette Fichly. Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut.
Le mouvement montre le mécanisme : la grille qui bascule vers une méthode, les portes qui ne s'ouvrent
qu'avec un livrable, la dérive qu'on voit ou qu'on ne voit pas, l'entonnoir de l'enquête.

Fichiers dans `livrables/blog/methode-dmaic-5-etapes/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-pdca-ou-dmaic` | Pourquoi DMAIC et pas PDCA, après « La règle de lecture est simple… » | La grille devient cinq interrupteurs. Chaque réponse bascule vers PDCA ou DMAIC, les compteurs montent, la méthode est choisie dès la troisième réponse du même côté : 3 contre 2 pour les outils cherchés (PDCA), 5 contre 0 pour le rebut à 7 % (DMAIC). |
| 2 | `2-phases-et-livrables` | Les 5 étapes, après « Voici la vue d'ensemble. Le tableau se lit comme un contrat… » | Le contrat : une solution déguisée (« Il manque un contrôle ») bute sur la première porte. Puis chaque phase produit son livrable, le sponsor valide, la porte s'ouvre, le projet passe. |
| 3 | `3-prouver-que-ca-tient` | Les 5 étapes, phase 5 « Contrôler », après « Un standard écrit, un indicateur suivi… » | Même projet, même gain (7 % → 2 %). Un curseur balaie six mois : sans Contrôler, le taux remonte vers 6 % (effet de projet) ; avec standard, indicateur et revue hebdomadaire, un écart est vu à la revue suivante, corrigé, et le gain tient. |
| 4 | `4-exemple-rebut` | Exemple concret, après « Un atelier d'usinage, une famille de pièces… » (avant le tableau) | L'entonnoir de l'enquête : écart 7 % / 2 %, rebuts triés par défaut (un seul fait 80 %), puis par machine et par moment (deux machines, début de poste) ; « les deux machines dérivent » est écarté, la cause est la mise en chauffe non standardisée ; le standard efface ces rebuts, les audits hebdomadaires ramènent le taux sous 2 %. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

Aucune image dans l'article (hors photo de l'auteur) : les quatre visuels sont des créations.

## Non illustré

- « DMAIC, PDCA, 8D, QRQC, A3 : la carte des méthodes » : le tableau suffit (durées et situations), et le choix
  PDCA / DMAIC est déjà animé par `1-pdca-ou-dmaic`.
- « Qui pilote un projet DMAIC » : le rôle du sponsor (il valide les passages de phase) apparaît dans `2-phases-et-livrables`.

## Intégration Shopify

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/2-phases-et-livrables.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/2-phases-et-livrables.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF : `<img src="…/2-phases-et-livrables.gif" alt="…" width="1200" height="860" loading="lazy">`.
Poids : voir les fichiers (MP4 autour de 0,6 à 0,8 Mo, GIF sous 2,5 Mo).

## Aperçu

`apercus/blog/methode-dmaic-5-etapes.html` : l'article complet avec chaque visuel à sa place et une note
(à ne pas publier). Régénérer avec `python3 outils/apercu_article.py blog/methode-dmaic-5-etapes`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/methode-dmaic-5-etapes/<id> stills 0 5 9   # images de contrôle dans controle/
outils/rendu_limite.sh blog/methode-dmaic-5-etapes/<id> gif 20         # GIF, MP4 et PNG dans livrables/
```

## Hypothèses

- Grille PDCA / DMAIC : les deux problèmes et leurs réponses sont des hypothèses du visuel. « Outils cherchés en début
  de poste » reprend l'exemple de l'article PDCA (3 réponses PDCA, 2 DMAIC) ; « Rebut à 7 % au lieu de 2 % » reprend
  l'exemple de cet article (5 réponses DMAIC).
- Phases et livrables : livrables et rôle du sponsor tirés de l'article ; « Il manque un contrôle » reprend l'exemple
  de réponse déguisée de la phase Définir.
- Prouver que ça tient : courbes illustratives, sans données. Dérive jusqu'à 6 % sans Contrôler ; avec Contrôler, un
  écart vers 2,9 % en semaine 5, vu à la revue de la semaine 6, surveillance de 2 mois (comme l'audit de l'exemple),
  1,8 % à six mois.
- Exemple rebut : 7 %, 2 %, 80 %, deux machines en début de poste, mise en chauffe, audit hebdomadaire pendant deux mois
  et « sous 2 % » viennent de l'article. Hypothèses du visuel : 40 rebuts dessinés, 5 types de défauts (d'où « divisé
  par cinq »), 5 machines, répartition des rebuts dans la grille (25 sur 32 dans les deux cellules chaudes), courbe
  semaine par semaine (3 % la première semaine, 1,8 % à la fin).
