# Visuels animés · article « Lean Manufacturing »

Huit visuels au format blog (1200 × 860, ratio des images d'article Fichly), charte des fiches :
papier, bandeau six couleurs, Poppins, palette Fichly. Chaque visuel démarre et finit sur l'image
complète, et la boucle se referme sans saut. Le mouvement porte le fond : on voit le mécanisme se produire,
on ne se contente pas de faire apparaître des blocs.

Fichiers dans `livrables/blog/lean-manufacturing/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-outils-sans-routine` | Lean Manufacturing / Lean Management, après « En pratique, les deux premiers sont indissociables… » | Même chantier 5S sur deux postes : sans routine, les outils quittent leur place et la courbe retombe en six mois ; avec routine, l'écart est vu et traité, ça tient. |
| 2 | `2-cinq-principes` | Les 5 principes, après le paragraphe d'introduction | L'ordre (chacun prépare le suivant), la question de chaque principe, la boucle du 5e vers le 1er, le socle du respect des personnes. |
| 3 | `3-flux-pousse-flux-tire` | Principe 4 « Tirer le flux », après « La question à poser » | Deux lignes identiques, même client : en poussé les stocks montent à 15 pièces, en tiré la carte kanban remonte et l'encours ne dépasse jamais 4. |
| 4 | `4-maison-toyota` | Juste-à-temps et jidoka, après « souvent représenté sous la forme d'une maison » | La maison se construit dans l'ordre où elle tient : fondations, piliers, toit. Chaque pilier se déplie avec ses outils ; l'andon passe au rouge. |
| 5 | `5-le-stock-cache-les-problemes` | Même section, après « Les deux piliers ne fonctionnent qu'ensemble… » | Le juste-à-temps baisse le niveau, un problème apparaît, le bateau s'arrête (jidoka), on le traite avec l'outil qui répond, on baisse encore. |
| 6 | `6-partir-du-probleme` | Les outils, après « Les outils Lean sont nombreux, et c'est un piège… » (avant le tableau) | Chaque observation va chercher son outil dans la boîte ; ceux qu'aucun problème n'appelle y restent. |
| 7 | `7-demarche-flux-pilote` | Par où commencer, après le paragraphe d'introduction | On écarte le flux le plus problématique, on choisit un pilote, puis les 5 étapes transforment ce flux sous nos yeux. |
| 8 | `8-exemple-chiffre` | Exemple chiffré, après « Le résultat. » (avant le tableau) | Mêmes machines, même débit : seuls les cartons entre les postes disparaissent, la barre du délai passe de 9 à 4 jours, les 42 minutes restent. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/8-exemple-chiffre.png"
         aria-label="Exemple chiffré : mêmes machines et même débit de 50 pièces par jour ; l'encours passe de 450 à 200 pièces et le temps de traversée de 9 à 4 jours, les 42 minutes de transformation restant identiques."
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/8-exemple-chiffre.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/8-exemple-chiffre.gif" alt="…" width="1200" height="860" loading="lazy">`.
Les MP4 pèsent 0,5 à 1 Mo, les GIF 0,8 à 2,5 Mo.

## Aperçu

`apercus/apercu-lean-manufacturing.html` : l'article complet avec chaque visuel à sa place et, dessous,
une note (à ne pas publier) sur ce qu'il doit faire comprendre. Régénérer avec
`python3 outils/apercu_article.py blog/lean-manufacturing`.

## Re-rendre un visuel

```
node outils/rendu.js blog/lean-manufacturing/<id> stills 0 4.5   # images de contrôle dans controle/
node outils/rendu.js blog/lean-manufacturing/<id> gif 20        # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Exemple chiffré : l'article donne 450 puis 200 pièces au total. La répartition entre les postes est
  une hypothèse du visuel : 100 / 250 / 100 avant, 100 / 25 / 75 après (stock tampon supprimé entre
  tournage et fraisage, lots plus petits après le fraisage). 1 carton = 25 pièces.
- Flux poussé / tiré : cadences simulées (poste A toutes les 0,5 s, poste B toutes les 0,8 s, client toutes
  les 1,2 s) ; les chiffres 15 et 4 sont ceux de la simulation, pas de l'article.
- Outils sans routine : courbe illustrative, sans échelle chiffrée.
