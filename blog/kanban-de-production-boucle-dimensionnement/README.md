# Visuels animés · article « Kanban de production : dimensionner la boucle et calculer le nombre de cartes »

Trois visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Article court (environ 2 600 mots) : trois visuels, un par mécanisme clé (la boucle, le calcul, les leviers).
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.

Fichiers dans `livrables/blog/kanban-de-production-boucle-dimensionnement/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, affiche de la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-boucle-kanban` | « Comment fonctionne une boucle kanban en atelier ? », après « Le temps qui sépare l'étape 2 de l'étape 5… » | On suit une carte : dernière pièce, elle se détache (point de commande, un événement), attend le relevé, fait la queue chez le fournisseur, qui prépare la quantité inscrite ; le bac plein revient. La ligne consomme le bac suivant sans s'arrêter. En bas, le délai de boucle se remplit : la préparation n'en est qu'un segment. |
| 2 | `2-calcul-des-cartes` | « Exemple de dimensionnement », après « Le calcul donne N = (60 × 4 × 1,2) / 120… » | Pendant les 4 h du délai, la ligne consomme 60 pièces par heure : 240 pièces, deux bacs. La marge ajoute 48 pièces (2,4 bacs), l'arrondi donne 3 bacs, donc 3 cartes, 360 pièces au plus et 6 h de couverture, plus longue que le délai. |
| 3 | `3-les-leviers` | Même section, après le tableau, après « Le délai de boucle est le seul levier qui réduit le stock sans contrepartie. » | Ce que le tableau ne montre pas : le besoin calculé, puis les bacs entiers qui le couvrent. Délai de 2 h : un bac de moins ; bacs de 60 : 5 cartes pour 300 pièces ; marge de 40 % : 2,8 s'arrondit aussi à 3, aucun gain. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`. L'article n'a pas d'image existante.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/2-calcul-des-cartes.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/2-calcul-des-cartes.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/2-calcul-des-cartes.gif" alt="…" width="1200" height="860" loading="lazy">`.

## Aperçu

`apercus/blog/kanban-de-production-boucle-dimensionnement.html`. Régénérer avec
`python3 outils/apercu_article.py blog/kanban-de-production-boucle-dimensionnement`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/kanban-de-production-boucle-dimensionnement/<id> stills 0 4 8   # images de contrôle dans controle/
outils/rendu_limite.sh blog/kanban-de-production-boucle-dimensionnement/<id> gif 20         # GIF, MP4 et PNG dans livrables/
```

## Hypothèses à connaître

- Boucle kanban : une seule carte suivie (les autres cartes de la boucle ne sont pas représentées) ; deux cartes déjà en file
  chez le fournisseur pour figurer la file d'attente amont. Les proportions des quatre segments du délai de boucle sont
  illustratives (l'article ne les chiffre pas).
- Calcul et leviers : tous les chiffres sont ceux de l'article (D = 60 pièces/h, T = 4 h, marge 20 %, Q = 120 ; variantes
  2 h, bacs de 60, marge 40 %). Les quotients non arrondis 1,2, 4,8 et 2,8 sont calculés à partir de ses formules
  (le tableau de l'article ne donne que le résultat arrondi). Le mot « marge » remplace α dans la formule affichée
  (la police ne contient pas l'alphabet grec).

## Point d'attention sur le texte

L'exemple de dimensionnement contient un marqueur non rempli : « une ligne d'assemblage en [secteur] ». À compléter ou
supprimer dans l'article avant publication (le visuel n'en dépend pas).
