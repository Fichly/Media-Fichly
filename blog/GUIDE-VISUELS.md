# Guide · visuels animés des articles de blog Fichly

Méthode commune à tous les articles. Référence complète : `blog/lean-manufacturing-definition-principes-outils/`
(8 visuels, code dans chaque sous-dossier, rendus dans `livrables/blog/…`).

## 1. Le principe : la forme sert le fond

Un visuel ne fait pas apparaître des blocs les uns après les autres : **le mouvement montre le mécanisme**
que le texte explique. Exemples tirés de l'article Lean Manufacturing :

- loi de Little : les cartons entre les machines disparaissent, les machines ne changent pas, la barre du délai raccourcit ;
- flux poussé / tiré : deux lignes simulées côte à côte, même client ; les stocks montent d'un côté, la carte kanban remonte de l'autre ;
- le stock cache les problèmes : le niveau d'eau baisse, un rocher apparaît, le bateau s'arrête, on le traite, on repart ;
- 5S sans routine : même chantier sur deux postes, six mois passent, l'un revient à son état initial, l'autre tient.

Questions à se poser pour chaque visuel : qu'est-ce qui **change** ? Qu'est-ce qui **reste pareil** et qu'il faut
montrer immobile (le débit, les machines) ? Quel **avant / après** le lecteur doit-il retenir ?

## 2. Choisir les visuels d'un article

1. Lire `blog/<article>/article.html` en entier, et l'entrée de l'article dans `blog/inventaire.json`
   (sections, images existantes : fichier, texte alt, section).
2. Les images existantes ne sont pas visibles depuis le conteneur (CDN Shopify bloqué) : leur texte alt, leur nom
   et leur section disent ce qu'elles montrent. Pour chacune : la **refaire en animé** si le concept gagne au
   mouvement (même idée, mieux expliquée), sinon la laisser et le dire dans le README.
3. **Créer** un visuel là où un concept clé n'en a pas.
4. Nombre : 4 à 6 pour un article de méthode (≥ 3 500 mots), 3 à 4 pour un article court, 2 à 3 pour un article
   formation / métier / financement. Mieux vaut 3 visuels qui expliquent que 6 qui décorent.
5. Ne pas recopier un tableau de l'article : le visuel doit apporter ce que le tableau ne montre pas.
6. Fidélité : chiffres, termes et exemples de l'article. Toute hypothèse ajoutée (répartition, cadences de
   simulation, échelle illustrative) est signalée dans le README de l'article, section « Hypothèses ».

## 3. Format et charte (gabarit `outils/gabarit.js`, ne pas le modifier)

- Page 1200 × 860 : copier `index.html` d'un visuel de référence (il charge `../../../outils/gabarit.js` et `visuel.js`).
- `G.templateBlog()` : papier, bandeau six couleurs, logo en haut à droite (le titre doit finir avant x ≈ 1010).
- `G.blogTitle('Début en bleu,', 'fin encadrée.')` : une ligne, taille 50 (48 si long). ~30 caractères au total.
- `G.blogChapeau(str)` : une ligne, ≤ 1140 px (~90 caractères).
- Zone de contenu y 176 → 760. `G.card(x, y, w, h)` pour les cartes.
- `G.blogChute(str, { y: 800 à 812 })` : la phrase à retenir, ≤ ~65 caractères, tirée de l'article autant que possible.
- Palette `G.C` (blue, green, yellow, red, lightBlue, teal, violet, pastels pGreen / pRed / pLav / pYellow,
  textes tGreen / tRed / tYellow, ink). Vert = ce qui va bien / valeur, rouge = problème / attente.
- Helpers : `text`, `para` (retour à la ligne auto), `pill`, `badgeNum`, `check`, `cross`, `arrow` (avec `draw(q)`
  pour la dessiner), `machine`, `carton`, `card`, `clipRect`, `fit` / `noOverlap` (contrôles), `pop`, `slide`,
  `rise`, `pulse`, `window01`, `prog`, `easeInOut`, `easeOut`, `back`.
- Texte ≥ 15 px (≥ 17 px pour ce qui doit se lire sur mobile). Pas de glyphes spéciaux dans le SVG (→, ✓, ✗) :
  les dessiner (`G.arrow`, `G.check`, `G.cross`). Espace insécable (`' '`) avant `? : ; %` et dans `4 320`.

## 4. Animation

- Chronologie imposée : 0 → 1,2 s image complète (sert d'affiche), effacement 1,2 → 1,6 s (`G.FADE_END`),
  reconstruction, puis tenue jusqu'à la fin. **L'état final doit être exactement l'état à t = 0** : la boucle
  se referme sans saut. Durée 12 à 19 s.
- `pop`, `slide`, `rise` gèrent seuls l'effacement et l'état final. Pour un élément animé à la main :
  si `t < FADE_END`, afficher l'état final (× `fadeOut(t)` pendant l'effacement).
- Pièges déjà rencontrés :
  - `pulse()` ne remet l'échelle à 1 que s'il est appelé après sa fenêtre : garder la condition d'appel ouverte
    au moins 0,3 s après la fin de la pulsation (ou l'appeler sans condition) ;
  - deux helpers ne doivent pas écrire `transform` sur le même groupe au même moment ;
  - garder les grands fonds de carte **immobiles** pendant l'effacement (seul le contenu s'efface) : sinon le GIF
    double de poids ;
  - pas de mouvement continu sur toute la durée (roulis, rotation) : le limiter à une fenêtre, ou le rendre
    périodique sur la durée de la boucle ;
  - simulation : calculer les événements au chargement (déterministe), figer sur l'état de fin pour t < FADE_END.

## 5. Fichiers et commandes

```
blog/<article>/
  article.html            texte (copie Shopify, ne pas modifier)
  visuels.json            [{ id, section, apres, role, alt }] dans l'ordre de l'article
  README.md               tableau des visuels (où, ce que le mouvement fait comprendre) + Hypothèses
  <n>-<slug>/index.html   copie de la page de référence (titre <title> adapté)
  <n>-<slug>/visuel.js    le visuel
livrables/blog/<article>/<n>-<slug>.mp4 | .gif | .png     (produits par le rendu)
apercus/blog/<article>.html                                (produit par apercu_article.py)
```

- `apres` : un extrait **exact** d'un paragraphe `<p>` de `article.html` ; le visuel est inséré après ce paragraphe.
- `alt` : description complète de ce que montre le visuel (état final + mécanisme), une ou deux phrases.
- Contrôle : `outils/rendu_limite.sh blog/<article>/<id> stills 0 3 5 8` puis regarder les PNG de `controle/`
  (outil Read). Corriger chevauchements, débordements (le rendu sort en code 2 et affiche `✗ Débordement …`).
- Rendu final : `outils/rendu_limite.sh blog/<article>/<id> gif 20` (GIF visé ≤ 2,5 Mo).
- Raccord de boucle : première et dernière image du GIF identiques, à part un mouvement continu voulu.
- Aperçu : `python3 outils/apercu_article.py blog/<article>`.
- Ne pas modifier `outils/`, ni les dossiers des autres articles. Ne pas faire de commit.
