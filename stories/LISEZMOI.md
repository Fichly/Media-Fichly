# Stories des outils : vidéos verticales de 15 s

Une story par outil du deck « 40 outils du Lean », jouée dans la rangée de bulles sous l'image produit de `/products/fiches-lean`. Les mêmes fichiers servent en Reels, Shorts, TikTok et LinkedIn.

## Fabriquer une story

```sh
mkdir stories/<id> && cp stories/gabarit.html stories/<id>/index.html   # puis écrire stories/<id>/scene.js
NODE_PATH=$(npm root -g) node outils/rendu.js stories/<id> stills 0 2 4 6 8 10 12 14.8   # images de contrôle dans controle/
NODE_PATH=$(npm root -g) node outils/rendu.js stories/<id> story                       # vidéos dans livrables/stories/
```

Aperçu en direct dans un navigateur : `stories/<id>/index.html?play`, ou une image fixe avec `?t=7.5`.

Le mode `story` produit :

| Fichier | Usage |
|---|---|
| `<id>.mp4` | maître 1080 × 1920, 30 i/s, H.264, sans piste son |
| `<id>-720.mp4` | version web 720 × 1280, environ 0,5 Mo, pour la page produit |
| `<id>-720.webm` | même version en VP9, pour les navigateurs qui ne lisent pas le H.264 |
| `<id>.jpg` | affiche (attribut `poster`), image à `poster` secondes |
| `<id>-bulle.png` | vignette ronde de la bulle, 240 × 240 |

Le rendu échoue (code 2) si un texte déborde de la fiche ou de la zone du mécanisme.

## Ce que le moteur pose tout seul

`stories/moteur.js` dessine le décor commun, identique d'une story à l'autre :

- fond pâle de la famille, liseré six couleurs en haut ;
- fiche blanche (x 56 → 1024, y 200 → 1700), bandeau à la couleur de la famille, nom de l'outil visible dès la première image.

Chronologie quand la scène déclare `fiche` (cas de toutes les stories actuelles) :

- **0 → 0,3 s** : l'aperçu numérique de la fiche du deck (vignette Canva), plein cadre ;
- **0,3 → 0,7 s** : la fiche se retourne et laisse place à la fiche animée ;
- **0,75 → 3,2 s** : l'accroche, au centre de la zone du mécanisme, qui s'efface en fondu à 2,95 s ;
- **3,2 → 11,2 s** : le mécanisme, dessiné par la scène dans `ZONE` (x 100 → 980, y 600 → 1400) ;
- **11,2 → 12,9 s** : « À retenir », surligné en jaune pâle, au bas de la fiche ;
- **12,9 → 13,6 s** : le liseré se remplit au bas de la fiche ;
- **13,6 → 14,1 s** : la fiche se retourne de nouveau sur l'aperçu de la fiche imprimée ;
- **14,05 → 15,0 s** : étiquette « Fiche n° X du deck » (ou `fiche.legende`). Logo et « Une fiche du deck 40 outils du Lean » en pied.

Sans `fiche`, l'accroche entre à 0,45 s et sort à 2,8 s, le mécanisme commence à 3,0 s, « À retenir » à 11,5 s et le liseré à 14,0 s.

Les 200 px du haut et les 220 px du bas restent libres : le lecteur y pose ses barres de progression et son bouton.

## Écrire une scène

```js
Story.scene({
  famille: 1,                         // 1 à 6, dans l'ordre du liseré ; 0 = le deck entier
  outil: '5 Pourquoi',
  titre: ['5 Pourquoi'],              // une ou deux lignes
  accroche: { lignes: ['La même panne', 'revient chaque lundi.'], accent: 1 },  // ligne en italique indigo
  retenir: 'On s’arrête sur une cause qu’on peut traiter.',   // 12 mots au plus, 3 lignes au plus
  fiche: { recto: '../../assets/produit/canva/page-023.png', numero: 9 },  // aperçu de la fiche du deck, ouvre et ferme la story
  poster: 10.5,                       // image de l'affiche (0 avec une fiche : l'affiche montre la fiche)
  bulle: { x: 100, y: 560, s: 880 },  // carré de la vignette, facultatif (avec une fiche : le haut de la fiche)
  build(S, A, root) { /* crée les nœuds SVG dans root, garde-les dans S */ },
  anim(t, S, A) { /* fixe l'état de CHAQUE nœud animé pour l'instant t */ },
});
```

`anim` doit être une fonction pure du temps : pour un même `t`, la même image, quel que soit l'ordre des appels. Pas de `requestAnimationFrame`, pas d'état accumulé, pas de `Math.random()`.

### Boîte à outils `A`

| Fonction | Rôle |
|---|---|
| `el(tag, attrs, parent)`, `text(parent, x, y, str, { size, weight, fill, anchor, italic, ls })` | créer des nœuds |
| `wrap(parent, x, y, str, maxW, opts, lineH)` | texte sur plusieurs lignes |
| `box`, `pill`, `arrow`, `check`, `cross`, `clock` | formes de base |
| `show(g, t, start, { dur, from: 'up' \| 'down' \| 'left' \| 'right' \| 'pop' \| 'fade', d, cx, cy, out })` | apparition (et disparition avec `out`) |
| `stroke(path, t, start, dur)` | tracé progressif |
| `grow(rect, t, start, dur, full, { vertical, base })` | barre qui pousse |
| `count(textNode, t, start, dur, from, to, fmt)` | compteur |
| `prog`, `lerp`, `easeOut`, `easeInOut`, `back`, `clamp` | temps et courbes |
| `fit(node, maxRight, label, minLeft)`, `inZone(node, label)` | contrôles de débordement |
| `C`, `FAM`, `RIBBON`, `ZONE`, `CARD`, `T` | palette, familles, géométrie, chronologie |

## Règles d'écriture

- Une seule idée : le geste de l'outil, pas sa définition.
- Accroche de 8 mots au plus. Dans le mécanisme, 6 libellés au plus, de 4 mots au plus, chacun visible au moins 1,5 s. 35 mots au plus sur toute la vidéo, hors nom de l'outil et pied.
- Textes de 34 px au moins (lisibles sur un téléphone).
- Couleur de la famille en aplat, indigo pour l'accent, corail pour le problème, vert pour le résolu. Une couleur ne porte jamais seule un sens : on ajoute une coche, une croix ou un mot.
- Aucun chiffre présenté comme réel s'il ne vient pas d'un article Fichly ; un exemple chiffré doit se lire comme un exemple.
- Typographie française : espace insécable avant `;` `:` `!` `?`, guillemets « ».
