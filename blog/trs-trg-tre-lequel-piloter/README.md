# Visuels animés · article « TRS, TRG, TRE : lequel piloter et pourquoi »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, la boucle se referme sans saut. Le mouvement montre le mécanisme
décrit par le texte.

Fichiers dans `livrables/blog/trs-trg-tre-lequel-piloter/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli) et `<id>.png`
(image fixe, affiche de la vidéo). Poids des GIF : `1-cascade-temps-etat` 0,82 Mo, `2-changements-de-serie-trg` 0,94 Mo, `3-piege-comparaison-sites` 0,76 Mo, `4-lequel-piloter` 0,91 Mo.

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-cascade-temps-etat` | La cascade des temps d'état, à la place de l'image `trs-trg-tre-temps-etat-fichly.png` (après « Les trois taux se lisent directement sur ce schéma : ») | La cascade se construit marche par marche, chaque marche retire une famille de pertes ; les mêmes 10 h 50 utiles rapportées à 14 h, 16 h et 24 h donnent 77 %, 68 % et 45 %. |
| 2 | `2-changements-de-serie-trg` | Le TRG, après « C'est l'indicateur qui rend visible le coût réel d'un changement de format long… » | 2 h de changements de série en plus : le temps requis fond, le TRS reste à 77 %, le TRG tombe à 58 % et la ligne livre 93 pièces de moins. |
| 3 | `3-piege-comparaison-sites` | Le piège de la comparaison, après « Deux sites du même groupe annoncent 82 % et 71 %… » | Le classement désigne B ; ramené sur le même dénominateur, A tombe à 61 %, le classement s'inverse et l'étiquette « doit progresser » change de site. |
| 4 | `4-lequel-piloter` | Alors, lequel piloter ?, après le paragraphe d'introduction | Un projecteur se pose là où se perd le temps (machine, entre les productions, heures qui dorment) : la zone désigne le taux qui la voit et qui s'en saisit. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes

- `trs-trg-tre-temps-etat-fichly.png` (cascade des temps d'état avec les formules) : **refaite en animé** par
  `1-cascade-temps-etat`, à retirer de l'article une fois la vidéo posée.
- Photo de l'auteur (FAQ) : conservée.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article, à l'endroit indiqué :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/1-cascade-temps-etat.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/1-cascade-temps-etat.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/1-cascade-temps-etat.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/trs-trg-tre-lequel-piloter.html` : l'article complet avec chaque visuel à sa place et, dessous, une note (à ne pas publier)
sur ce qu'il doit faire comprendre. Régénérer avec `python3 outils/apercu_article.py blog/trs-trg-tre-lequel-piloter`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/trs-trg-tre-lequel-piloter/<id> stills 0 4.5   # images de contrôle dans controle/
outils/rendu_limite.sh blog/trs-trg-tre-lequel-piloter/<id> gif 20        # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Cascade : chiffres de l'article (24 h, 16 h, 14 h, 12 h, 680 et 650 pièces à 60 pièces/h). Les 11 h 20 de temps net
  (680 pièces à 60/h) et le découpage des pertes (40 min de cadence, 30 min de rebuts) en sont déduits.
- Changements de série : hypothèse de 2 h de changements de série ajoutés par jour, rendement de la ligne inchangé
  sur le temps requis (d'où TRS constant à 77 %, TRG 9 h 17 / 16 h = 58 %, 557 pièces conformes).
- Comparaison entre sites : l'article donne 82 % (TRS généreux) et 71 % (TRG). Hypothèses du visuel : 16 h d'ouverture
  sur les deux sites, 4 h d'arrêts planifiés sortis par A (temps requis 12 h), temps utile A 9 h 50, B 11 h 22 ;
  d'où A à 61 % sur la même base.
- Lequel piloter : journée de référence (8 h de nuit, 2 h planifiées, 3 h 10 de pertes machine, 10 h 50 utiles).
