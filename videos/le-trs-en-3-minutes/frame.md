---
version: 1
name: Fichly — Frame (vidéo 16:9)
description: >
  Direction artistique Fichly transposée au cadre vidéo 1920×1080. Source : le gabarit des fiches
  LinkedIn Fichly (`outils/gabarit.js`, palette C, composants title / chapeau / pill / card / check /
  cross / badgeNum / encart / ruban) et les visuels livrés (`livrables/*.png`). Les atomes sont repris
  tels quels ; la composition est réécrite pour le 16:9. Le mouvement est hors du champ de ce fichier.
unit: le cadre — 1920×1080 ; 9:16 décrit plus bas
principle: atomes sacrés · composition libre · les chiffres viennent du script

colors:
  canvas: "#f3f3f3"        # fond papier (gabarit : rect #f3f3f3 + paper.png)
  blue: "#4a4aa0"          # couleur de marque : titres, bandeau, pastilles numérotées, machine
  ink: "#23235a"           # texte courant
  white: "#ffffff"
  card: "#fdfdfb"          # fond des cartes
  line: "#e2e2ee"          # filet des cartes
  green: "#8cc978"         # ok, temps utile
  yellow: "#e6b839"        # cartons, famille performance
  red: "#f16969"           # ko, pertes, famille disponibilité
  violet: "#aa76b2"        # famille qualité
  lightBlue: "#74a3d6"
  teal: "#75bec0"
  pGreen: "#e6f3df"        # bandes pastel
  pRed: "#fde6e6"
  pLav: "#ececf5"
  pYellow: "#f8f3d9"
  tGreen: "#2f5a1f"        # texte sur bande pastel
  tRed: "#a83434"
  tYellow: "#7a5806"
  ribbon: ["#f16969", "#75bec0", "#aa76b2", "#8cc978", "#e0cf35", "#74a3d6"]

typography:
  # Une seule famille : Poppins (400 / 500 / 600 / 700 / 800), polices locales public/fonts/.
  title:      { fontFamily: "Poppins", cqw: 4.6, weight: 800, lineHeight: 1.0, color: "blue" }
  title-band: { fontFamily: "Poppins", cqw: 4.6, weight: 800, lineHeight: 1.0, color: "white", on: "blue band" }
  hero:       { fontFamily: "Poppins", cqw: 8.0, weight: 800, lineHeight: 1.0, color: "blue" }
  stat:       { fontFamily: "Poppins", cqw: 9.5, weight: 800, lineHeight: 1.0, color: "family text tone" }
  chapeau:    { fontFamily: "Poppins", cqw: 1.75, weight: 500, lineHeight: 1.35, color: "blue" }
  card-title: { fontFamily: "Poppins", cqw: 2.1, weight: 700, lineHeight: 1.2, color: "ink" }
  body:       { fontFamily: "Poppins", cqw: 1.55, weight: 500, lineHeight: 1.4, color: "ink" }
  band-text:  { fontFamily: "Poppins", cqw: 1.75, weight: 700, lineHeight: 1.35, color: "family text tone" }
  pill:       { fontFamily: "Poppins", cqw: 1.4, weight: 700, lineHeight: 1.0 }
  chute:      { fontFamily: "Poppins", cqw: 2.2, weight: 700, lineHeight: 1.3, color: "blue" }
  label:      { fontFamily: "Poppins", cqw: 1.05, weight: 600, lineHeight: 1.0, color: "ink", note: "heures du ruban, légendes ; jamais porteur de sens seul" }

components:
  title-block:
    description: "La signature Fichly : ligne 1 en bleu 800, ligne 2 en blanc 800 dans un bandeau bleu (rx 0,75cqw) dont la largeur suit le texte (+2,5cqw)."
  chapeau:
    description: "Une ligne bleue 500 sous le titre."
  card:
    fill: "{colors.card}"
    border: "0,1cqw solid {colors.line}"
    radius: "1,25cqw (24 px à 1920)"
    description: "La carte blanche des fiches : le plateau sur lequel vivent les schémas (ici, le tableau d'enquête)."
  band:
    radius: "1,25cqw"
    variants: "pRed + tRed (ko, pertes) · pGreen + tGreen (ok) · pLav + ink (règle, définition) · pYellow + tYellow (performance)"
    description: "Bande pastel pleine largeur ; une pastille ✓ / ✗ ou numérotée à gauche, texte 700."
  pill:
    radius: "hauteur / 2"
    description: "Étiquette pastel, texte 700 de la même famille, icône ✓ / ✗ facultative. Variante pleine : fond bleu, texte blanc (« La règle à garder en tête »)."
  badge-check: { fill: "{colors.green}", glyph: "✓ blanc", description: "Pastille ronde ok." }
  badge-cross: { fill: "{colors.red}", glyph: "✗ blanc", description: "Pastille ronde ko." }
  badge-num:   { fill: "{colors.blue}", glyph: "chiffre blanc 700", description: "Pastille ronde numérotée." }
  machine:
    description: "Picto machine du gabarit : corps bleu arrondi, écran blanc avec jauge verte, deux voyants (bleu clair, vert), touches blanches translucides."
  carton: { fill: "{colors.yellow}", description: "Carré jaune arrondi avec un trait blanc : une pièce / un lot." }
  hand-arrow:
    description: "Flèche ou soulignement tracé à la main (trait 3 px, bouts ronds) : flèche bleue, double soulignement vert sous le lien."
  ribbon:
    description: "Les six couleurs du ruban, pleine largeur, 18 px en bas du cadre. Fixe, sur tous les cadres."
  logo:
    description: "Logo fichly en bas à droite, au-dessus du ruban. Fixe."

families:
  # Codage couleur des trois pertes du TRS, constant sur toute la vidéo
  disponibilite: { accent: "{colors.red}", band: "{colors.pRed}", text: "{colors.tRed}" }
  performance:   { accent: "{colors.yellow}", band: "{colors.pYellow}", text: "{colors.tYellow}" }
  qualite:       { accent: "{colors.violet}", band: "{colors.pLav}", text: "{colors.ink}", numeral: "{colors.violet}" }
  utile:         { accent: "{colors.green}", band: "{colors.pGreen}", text: "{colors.tGreen}" }
---

# Fichly — Frame (vidéo 16:9)

## Overview

La vidéo parle comme une fiche Fichly : un titre en deux temps (bleu, puis blanc dans le bandeau
bleu), une phrase bleue dessous, puis un schéma simple posé sur une carte blanche, sur fond papier.
Les verdicts arrivent en bandes pastel avec leur pastille ✓ ou ✗. Couleurs franches mais douces,
coins arrondis, aucune ombre, une seule famille de caractères (Poppins). Le ton est celui de la
marque : du jeu, du terrain, zéro PowerPoint ronflant.

## The Frame

- **Format** : 1920×1080 ; tailles en `cqw` (px ÷ 1920 × 100). Le fond est `canvas` + `paper.png`
  étiré en `cover`.
- **Marges** : 3,2cqw à gauche et à droite, 3,4cqw en haut ; la zone utile s'arrête au-dessus du
  ruban (18 px) et du logo (bas droite).
- **Chrome fixe** : ruban six couleurs en bas, logo fichly en bas à droite. Rien d'autre.
- **Un seul moment fort par cadre** : un titre, un chiffre ou un verdict domine ; le reste est à
  au moins trois fois moins de surface.

## Colors

`blue` porte la marque (titres, bandeau, pastilles numérotées, machine). `ink` est le texte
courant. Les pastels ne servent qu'aux bandes et pilules, toujours avec leur ton de texte (`tRed`
sur `pRed`, `tGreen` sur `pGreen`, `tYellow` sur `pYellow`, `ink` sur `pLav`). Le codage des
familles de pertes ne change jamais : disponibilité rouge, performance jaune, qualité violet, temps
utile vert. Les couleurs du ruban ne servent pas de texte.

## Typography

Poppins uniquement. Titres 800, chiffres 800, texte de bandes et pilules 700, chapeau et texte
courant 500. Aucune ligne porteuse de sens sous 1,4cqw. Les chiffres affichés sont ceux du script ;
la phrase que dit la voix n'est jamais recopiée à l'écran (mots-clés et chiffres seulement).

## Depth & Surface

À plat. La profondeur vient de la carte blanche sur papier et des bandes pastel. Pas d'ombre
portée, pas de dégradé, pas de contour épais (filet `line` 2 px sur les cartes).

## Composition Rules

### Do

- Ouvrir les cadres clés sur le bloc titre Fichly (ligne bleue + bandeau blanc).
- Poser les schémas sur une carte blanche arrondie.
- Dire ok / ko avec les pastilles ✓ vertes et ✗ rouges, dans des bandes pastel.
- Garder le codage couleur des familles de pertes sur toute la vidéo.
- Laisser respirer : 40 % de vide au moins sur les cadres de verdict.

### Don't

- Pas d'autre police que Poppins, pas de couleur hors palette.
- Pas d'ombre, pas de dégradé, pas de coin carré sur les cartes et bandes.
- Pas de puces rondes par défaut : pastilles ✓ / ✗ / numérotées.
- Pas de photo d'usine, pas d'icône générique : les pictos du gabarit (machine, carton).

## Aspect-Ratio Behavior

| Élément | 16:9 | 9:16 |
| --- | --- | --- |
| Bloc titre | en haut à gauche | en haut, plein largeur, 2 lignes max |
| Carte schéma | pleine largeur sous le titre | pleine largeur, schéma empilé |
| Bandes ✓ / ✗ | une à trois, pleine largeur ou côte à côte | empilées |
| Chiffre fort | à droite du schéma | sous le schéma |

## Numerals & Claims

Aucun chiffre inventé : tous viennent du cas de référence de l'article (voir `BRIEF.md`).
