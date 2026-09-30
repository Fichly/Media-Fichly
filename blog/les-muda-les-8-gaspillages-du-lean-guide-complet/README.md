# Visuels animés · article « Les MUDA : les 8 gaspillages du Lean, guide complet »

Quatre visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut. Le mouvement montre le
mécanisme : le tri du test de la facture, les pics de charge qui font tomber les gaspillages, le signe de chaque
famille sur le terrain, les MUDA qui traversent le calcul du TRS sans s'y arrêter.

Fichiers dans `livrables/blog/les-muda-les-8-gaspillages-du-lean-guide-complet/` : `<id>.mp4` (à privilégier), `<id>.gif`
(repli) et `<id>.png` (image fixe, affiche de la vidéo). L'article n'avait aucune image.

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-test-de-la-facture` | Définition, après « Le test de la facture. Prenez une opération… » | Huit opérations passent une à une devant le client : il paie (découpe, assemblage, contrôle final exigé), il refuse (trajet du chariot, attente, reprise : MUDA, barrés), ou c'est obligatoire sans valeur (contrôle réglementaire, traçabilité : la barre raccourcit, on réduit sans supprimer). |
| 2 | `2-mura-muri-muda` | Muda, Mura, Muri, après « L'ordre compte. Le Mura produit du Muri… » | Même volume sur huit semaines : en charge irrégulière, chaque pic au-dessus de la capacité fait tomber défauts, attentes et stocks tampons ; on les supprime, ils reviennent au pic suivant. En charge lissée, rien ne tombe. |
| 3 | `3-huit-muda-au-poste` | La liste, après « Voici les huit familles, dans l'ordre où elles se repèrent… » | Chaque vignette rejoue le signe de sa famille : la pile monte alors que la commande reste à 4, l'opérateur attend, le chariot fait des allers-retours, l'opérateur part à l'armoire, le stock porte un « ? », la pièce repasse trois contrôles, les reprises tombent dans leur bac attitré, la boîte à idées reste fermée. |
| 4 | `4-muda-dans-le-trs` | Indicateurs, après « Voici où les huit familles se logent dans ce calcul… » (avant le tableau) | La cascade du TRS de l'exemple sert de tamis : attentes, mouvements, étapes inutiles et défauts se logent dans les pertes ; surproduction, stocks, transports et compétences traversent tout et tombent « nulle part ». |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Intégration Shopify

Déposer les fichiers dans Contenu › Fichiers, puis dans l'éditeur HTML de l'article :

```html
<figure>
  <video autoplay muted loop playsinline preload="metadata" width="1200" height="860"
         poster="https://cdn.shopify.com/…/1-test-de-la-facture.png"
         aria-label="(texte alt de visuels.json)"
         style="width:100%;height:auto;border-radius:12px">
    <source src="https://cdn.shopify.com/…/1-test-de-la-facture.mp4" type="video/mp4">
  </video>
</figure>
```

Si l'éditeur retire la balise `<video>`, utiliser le GIF :
`<img src="…/1-test-de-la-facture.gif" alt="…" width="1200" height="860" loading="lazy">`.
Les MP4 pèsent 0,6 à 0,7 Mo, les GIF 0,9 à 1 Mo.

## Aperçu

`apercus/blog/les-muda-les-8-gaspillages-du-lean-guide-complet.html` : l'article complet avec chaque visuel à sa place et
une note (à ne pas publier) sur ce qu'il doit faire comprendre. Régénérer avec
`python3 outils/apercu_article.py blog/les-muda-les-8-gaspillages-du-lean-guide-complet`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/les-muda-les-8-gaspillages-du-lean-guide-complet/<id> stills 0 4 8   # contrôle dans controle/
outils/rendu_limite.sh blog/les-muda-les-8-gaspillages-du-lean-guide-complet/<id> gif 20        # GIF, MP4 et PNG
```

## Hypothèses à connaître

- Test de la facture : les huit opérations viennent de l'article (définition et non-valeurs ajoutées nécessaires) ;
  leur enchaînement dans un même processus est illustratif. La barre qui raccourcit (de 200 à 110 px) est schématique.
- Mura, Muri, Muda : profil de charge inventé (55 à 135 % de la capacité, moyenne 92,5 % dans les deux ateliers),
  trois jetons par pic (un défaut, une attente, un stock tampon) ; l'image de l'éponge reprend « essuyer le sol sans
  fermer le robinet ».
- Huit MUDA : valeurs d'exemple dans les vignettes (commande de 4, trois contrôles C1 à C3) illustratives ; les signes
  sont ceux de l'article, raccourcis pour tenir sur deux lignes.
- MUDA dans le TRS : chiffres et correspondances de l'article (14 h, 12 h, 680 sur 720, 650 sur 680, TRS 77 %) ;
  seule l'échelle des barres (840 pièces possibles = 616 px) est un choix du visuel.
