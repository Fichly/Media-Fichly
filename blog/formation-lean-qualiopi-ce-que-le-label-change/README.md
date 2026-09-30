# Visuels animés · article « QUALIOPI formation Lean : ce que le label change »

Trois visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.

Fichiers dans `livrables/blog/formation-lean-qualiopi-ce-que-le-label-change/` : `<id>.mp4` (à privilégier),
`<id>.gif` (repli) et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-le-label-ouvre-les-financements` | Pourquoi QUALIOPI est obligatoire, après « La question que tout le monde se pose… » | Même formation, deux organismes qui peuvent tous deux former : pour le certifié, les portes des financements s'ouvrent et la facture est prise en charge ; pour l'autre, elles résistent et l'entreprise paie tout. |
| 2 | `2-ce-que-l-audit-controle` | Ce que QUALIOPI garantit, après « Voici le point que la plupart des articles évitent… » | La loupe de l'auditeur coche le cadre (avant, pendant, après la formation) puis bute sur le bord du périmètre : les questions de fond restent ouvertes, à vérifier soi-même. |
| 3 | `3-verifier-l-attestation` | Comment vérifier, après « QUALIOPI se décline par catégorie d'action… » | Quatre organismes, un même logo : l'attestation, sa validité puis son périmètre en arrêtent trois ; le dernier est finançable, et il reste à juger sa formation. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes de l'article

Une seule image : la photo de l'auteur (encart « Écrit par Hugo Duc »). Laissée telle quelle.

## Intégration Shopify

Même méthode que les autres articles : fichiers dans Contenu › Fichiers, balise `<video autoplay muted loop playsinline
preload="metadata" width="1200" height="860" poster="….png" aria-label="…">` avec la source `….mp4`, GIF en repli.
Extrait complet dans `blog/lean-manufacturing-definition-principes-outils/README.md`.

## Aperçu

`apercus/blog/formation-lean-qualiopi-ce-que-le-label-change.html` ; régénérer avec
`python3 outils/apercu_article.py blog/formation-lean-qualiopi-ce-que-le-label-change`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/formation-lean-qualiopi-ce-que-le-label-change/<id> stills 0 4 8   # contrôle
outils/rendu_limite.sh blog/formation-lean-qualiopi-ce-que-le-label-change/<id> gif 20        # livrables
```

## Hypothèses

- Le label ouvre les financements : la part « prise en charge » (80 % de la facture) et le « reste éventuel » sont
  illustratifs ; l'article dit seulement que le label donne accès aux financements (tout ou partie).
  Les portes montrées sont CPF, OPCO et plan de développement des compétences : le FNE-Formation du tableau de
  l'article est volontairement absent (voir points d'attention).
- Ce que l'audit contrôle : les pièces du cadre viennent de « Ce qui est réellement contrôlé » et du critère 4
  (moyens et encadrement) ; les questions de fond viennent de « Ce qui échappe à l'audit ». Leur répartition
  avant / pendant / après est un choix de présentation.
- Vérifier l'attestation : les quatre organismes et leur motif d'arrêt sont fictifs, construits sur les trois
  vérifications de l'article (attestation, validité, périmètre « actions de formation »).

## Points d'attention (texte de l'article)

- Le tableau des 4 dispositifs, la FAQ et l'encart final citent le FNE-Formation comme financement accessible ;
  l'article `financement-formation-lean-tous-les-dispositifs-2026` indique qu'il est suspendu depuis fin 2024 et non
  rétabli en 2026. À harmoniser (les visuels ne le montrent pas).
