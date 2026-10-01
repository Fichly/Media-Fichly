# Points à vérifier dans les articles

Relevés en produisant les visuels. Les textes des articles n'ont pas été modifiés : ces points sont à
trancher puis à corriger dans Shopify. Les hypothèses propres à chaque visuel (chiffres ajoutés pour
l'exemple, répartitions, cadences) sont dans la section « Hypothèses » du README de chaque article.

## Incohérences entre articles

- **Prix de la Green Belt** : 3 000 € dans le texte de l'article Financement, 2 500 € dans son propre
  tableau, 1 500 € à distance / 2 500 € en présentiel dans l'article Green Belt. Aucun visuel n'affiche de prix.
- **Durée de la Green Belt** : 5 jours dans trois articles, 6 jours (42 h) dans l'article Green Belt.
- **Durée de la White Belt** : 1 jour dans le corps de « Quelle formation », 3 jours dans sa FAQ
  (le visuel retient 1 jour).
- **FNE-Formation** : présenté comme disponible dans « Qualiopi » et « Quelle formation », suspendu
  depuis fin 2024 selon l'article Financement (le visuel Qualiopi ne le montre pas).
- **Salaire** : 38 à 55 k€ dans l'article Green Belt, 38 à 85 k€ et plus dans la fiche métier.
- **SMED, exemple Toyota** : « quelques mois » dans le corps, « plusieurs années d'itérations » dans la FAQ.
- **MTBF / MTTR** : l'article dit que les deux machines ont « la même disponibilité » ; le calcul donne
  92 % et 91 % (le visuel dit « quasi identiques »).

## Textes incomplets

- **Kanban de production** : « ligne d'assemblage en [secteur] ».
- **VSM** : l'exemple chiffré contient encore des champs à remplir ([secteur], [C/T poste 1]…) ;
  le visuel n'utilise que les chiffres rédigés.

## Après l'intégration dans Shopify (1er octobre 2026)

Les 109 visuels animés sont dans les 27 articles et les anciennes illustrations ont été retirées
(photos de l'auteur gardées). Les emplacements `VISUEL-A-CREER` d'Ishikawa, QQOQCCP, RACI et AMDEC
sont remplacés. Restent à trancher à la main :

- **Intégrations externes gardées** : le GIF Giphy de l'article SMED et la vidéo YouTube de
  « Quelle formation ». Ce ne sont pas des illustrations Fichly : à garder ou à retirer selon le choix éditorial.
- **5 Pourquoi** : la bannière « Audit » (image sans lien) a été retirée avec les anciennes images.
  À remettre sous forme de vrai bouton si elle servait d'appel à l'action.
- **Image de partage (JSON-LD)** : le champ `image` pointe encore vers une ancienne image dans 9 articles
  (5S, Green Belt, Lean Manufacturing, Muda, MTBF / MTTR, SMED, TPM, TRS, VSM) et vaut `VISUEL-A-CREER`
  dans 4 brouillons (AMDEC, Ishikawa, QQOQCCP, RACI). Les anciennes images restent en ligne dans
  Contenu › Fichiers, donc rien n'est cassé ; mettre l'URL du PNG du visuel principal quand c'est possible.
- **Photo de l'auteur** : `src="REMPLACER-PAR-PHOTO-HUGO"` dans la carte auteur de VSM (publié) et des
  brouillons AMDEC, Ishikawa, QQOQCCP et RACI ; la photo de l'article Financement est intégrée en base64
  avec un en-tête qui semble abîmé (à remplacer par Photo_Hugo_Duc.png).
- **Commentaires internes** : « A REMPLACER / VERIFIER AVANT PUBLICATION » dans le code de Financement,
  de la fiche métier et de plusieurs brouillons. Invisibles pour le lecteur, mais à nettoyer.
