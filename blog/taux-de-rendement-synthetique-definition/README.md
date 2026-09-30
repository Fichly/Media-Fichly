# Visuels animés · article « TRS (Taux de Rendement Synthétique) : définition, exemples et calculs »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut. Le mouvement montre le mécanisme
décrit par le texte.

Fichiers dans `livrables/blog/taux-de-rendement-synthetique-definition/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli) et `<id>.png`
(image fixe, affiche de la vidéo). Poids des GIF : `1-convention-temps-requis` 0,96 Mo, `2-calcul-pas-a-pas` 0,87 Mo, `3-micro-arrets-invisibles` 0,97 Mo, `4-meme-trs-trois-chantiers` 1,02 Mo.

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-convention-temps-requis` | Formule du temps requis, après l'encadré « Le point qui décide de tout » | Une heure de panne récurrente change de case : le temps requis passe de 14 h à 13 h, le TRS de 77 % à 83 %, la machine reste arrêtée 4 h et livre 650 pièces conformes. |
| 2 | `2-calcul-pas-a-pas` | Calcul pas à pas, après « Sur 14 heures requises, la ligne a produit l'équivalent de 10 h 50… » (avant le tableau) | Une seule barre de 14 h qui rétrécit : chaque taux retire une tranche de ce qui reste, il reste 10 h 50 (77 %). La plus grosse tranche, la disponibilité, désigne le chantier. |
| 3 | `3-micro-arrets-invisibles` | Les six grandes pertes, après « Les micro-arrêts durent quelques secondes… » | L'équipe se déroule : la panne part au rapport, les micro-arrêts et les rebuts de démarrage n'y entrent jamais, mais le TRS les compte et les micro-arrêts dépassent la panne. |
| 4 | `4-meme-trs-trois-chantiers` | Ce qu'un TRS autorise à décider, après « Un TRS ne se contemple pas… » | Trois lignes à 77 % : le chiffre seul ne dit pas où agir ; ouvert en trois taux, chacun désigne une décision différente (maintenance, poste, réglage). |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

L'article n'a pas d'image de contenu (seule la photo de l'auteur, conservée). Les quatre visuels sont des créations.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article, à l'endroit indiqué :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/2-calcul-pas-a-pas.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/2-calcul-pas-a-pas.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/2-calcul-pas-a-pas.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/taux-de-rendement-synthetique-definition.html` : l'article complet avec chaque visuel à sa place et, dessous, une note (à ne pas publier)
sur ce qu'il doit faire comprendre. Régénérer avec `python3 outils/apercu_article.py blog/taux-de-rendement-synthetique-definition`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/taux-de-rendement-synthetique-definition/<id> stills 0 4.5   # images de contrôle dans controle/
outils/rendu_limite.sh blog/taux-de-rendement-synthetique-definition/<id> gif 20        # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Tous les chiffres du cas de référence viennent de l'article (16 h d'ouverture, 2 h planifiées, 2 h d'arrêts subis,
  60 pièces/h, 680 produites, 650 conformes, TRS 77 %, 14,3 / 5,6 / 4,4 points).
- Convention du temps requis : l'article ne chiffre pas la requalification. Hypothèse du visuel : 1 h des 2 h d'arrêts
  subis est une panne récurrente passée en « planifié ». 10 h 50 / 13 h = 83 % est calculé à partir de là.
- Micro-arrêts : exemple illustratif sur une équipe de 8 h (1 panne de 25 min, 40 micro-arrêts de 45 s soit 30 min,
  12 pièces rebutées au démarrage), positions tirées au hasard de façon déterministe. L'épaisseur des traits de
  micro-arrêts sur la frise est exagérée pour rester visible.
- Même TRS, trois chantiers : la ligne A est le cas de référence. Les lignes B (95,0 / 85,0 / 95,4 %) et C
  (94,0 / 96,0 / 85,3 %) sont des profils construits pour donner aussi 77 %, ils ne sont pas dans l'article.
