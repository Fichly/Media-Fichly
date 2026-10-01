# Sauvegardes des articles Shopify

- `2026-10-01/` : corps HTML des 27 articles **avant** l'intégration des visuels animés, tels que
  renvoyés par l'API (plus `articles.json` : identifiant, handle, statut publié).
- `2026-10-01-apres/` : corps envoyés à Shopify (visuels insérés, anciennes illustrations retirées).

Pour revenir en arrière sur un article : renvoyer son fichier de `2026-10-01/` avec la mutation
`articleUpdate` (champ `body`). Les anciennes images n'ont pas été supprimées de Contenu › Fichiers.

Les nouveaux corps sont produits par `outils/integrer_shopify.py` et contrôlés par
`outils/verifier_shopify.py`. Les adresses des GIF hébergés sont dans `blog/shopify-fichiers.json`.
