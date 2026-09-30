# Visuels animés · article « Green Belt Lean Six Sigma : programme, prix et CPF 2026 »

Deux visuels au format blog (1200 × 860), charte des fiches : papier, bandeau six couleurs, Poppins, palette Fichly.
Chaque visuel démarre et finit sur l'image complète, et la boucle se referme sans saut.

Fichiers dans `livrables/blog/green-belt-lean-six-sigma/` : `<id>.mp4` (à privilégier), `<id>.gif` (repli)
et `<id>.png` (image fixe, sert d'affiche pour la vidéo).

| # | Fichier | Où le placer | Ce que le mouvement fait comprendre |
|---|---------|--------------|-------------------------------------|
| 1 | `1-dmaic-sur-un-cas` | Le Green Belt au quotidien, après « Prenons un cas courant… » | Le changement de série de 40 minutes traverse les cinq étapes : périmètre, mesure au chronomètre, cause trouvée avec l'équipe, outils rangés au poste (la part rouge disparaît), standard figé et aiguille du TRS qui monte. |
| 2 | `2-six-jours-un-projet` | Le programme, après « La formation dure 6 jours (42 heures), répartis dans le temps… » | Les jours s'allument par blocs (3, 2, 1) ; entre les blocs, c'est le projet dans l'entreprise qui avance étape par étape, jusqu'à la soutenance devant le jury. |

Les textes alternatifs (attribut `alt` / `aria-label`) sont dans `visuels.json`.

## Images existantes de l'article

Aucune image de contenu (seulement la photo de l'auteur). Pas de visuel sur la place de la Green Belt parmi les
ceintures : l'escalier animé existe dans `quelle-formation-lean-management-certifiante-choisir/2-quatre-ceintures`
et peut être réutilisé après « La place de la Green Belt parmi les ceintures ».

## Intégration Shopify

Même méthode que les autres articles : fichiers dans Contenu › Fichiers, balise `<video autoplay muted loop playsinline
preload="metadata" width="1200" height="860" poster="….png" aria-label="…">` avec la source `….mp4`, GIF en repli.
Extrait complet dans `blog/lean-manufacturing-definition-principes-outils/README.md`.

## Aperçu

`apercus/blog/green-belt-lean-six-sigma.html` ; régénérer avec `python3 outils/apercu_article.py blog/green-belt-lean-six-sigma`.

## Re-rendre un visuel

```
outils/rendu_limite.sh blog/green-belt-lean-six-sigma/<id> stills 0 4 8   # contrôle
outils/rendu_limite.sh blog/green-belt-lean-six-sigma/<id> gif 20        # livrables
```

## Hypothèses

- DMAIC sur un cas : l'article donne « une quarantaine de minutes » et « une nouvelle organisation des outils ».
  La part de recherche des outils (45 % de la barre), la cause formulée (« les outils sont loin de la ligne »), la
  durée après amélioration (sans chiffre) et la position de l'aiguille du TRS (sans valeur) sont illustratives.
- Six jours, un projet : la répartition des étapes DMAIC entre les sessions (définir et mesurer après le 1er bloc,
  analyser, améliorer, contrôler après le 2e) et l'échelle de temps sont illustratives ; l'article dit « plusieurs
  semaines » entre le premier jour et la certification.

## Points d'attention (texte de l'article)

- Durée : 6 jours (42 h) ici, 5 jours dans les articles « Quelle formation Lean », « Financement » et « Responsable
  amélioration continue ».
- Prix : 1 500 € HT en distanciel et 2 500 € en présentiel ici, 3 000 € dans le texte de l'article financement.
- Salaire : 38 000 à 55 000 € ici pour un responsable amélioration continue, 38 000 à plus de 85 000 € dans la fiche métier.
