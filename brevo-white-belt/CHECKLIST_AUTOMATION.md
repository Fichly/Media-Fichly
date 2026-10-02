# White Belt Lean : mise en route de la séquence

Ce qui est déjà en place, ce qui reste à faire à la main dans Brevo, et l'ordre de mise en ligne.
Rien n'est envoyé ni activé à ce stade.

## 1. Ce qui est en place

| Brique | Où | Identifiant | État |
| --- | --- | --- | --- |
| Formulaire Tally « White Belt Lean en 1 h, gratuite » | Tally | `ODOB5p` | modifications en brouillon, non publiées |
| Hook Tally → Make | Make | hook `4410784` | attaché au formulaire |
| Scénario « White Belt Lean · Tally → Brevo » | Make, dossier « Séquences Templates » | scénario `9905705` | **inactif** |
| Liste « White Belt — Inscrits » | Brevo, dossier 37 | liste `49` | vide |
| Attributs `INSCRIT_WHITEBELT`, `WB_DATE_INSCRIPTION`, `WB_BESOIN`, `UTM_SOURCE`, `UTM_MEDIUM`, `UTM_CAMPAIGN`, `UTM_CONTENT` | Brevo | | créés |
| 8 templates de la séquence | Brevo | `206` à `213` | actifs, testés sur hugo.duc@fichly.com |

### Templates

| Template | Nom | Envoi |
| --- | --- | --- |
| 206 | WB · E0 · Accès | à l'inscription |
| 207 | WB · E1 · J+2 · Suivre un flux | J+2 |
| 208 | WB · E2 · J+5 · Grille d'observation | J+5 |
| 209 | WB · E3 · J+9 · Quel outil | J+9 |
| 210 | WB · E4 · J+14 · Découvrir | J+14, besoin 1 ou non renseigné |
| 211 | WB · E4 · J+14 · Équipe | J+14, besoin 2 |
| 212 | WB · E4 · J+14 · Formation | J+14, besoin 3 |
| 213 | WB · E4 · J+14 · Accompagnement | J+14, besoin 4 |

### Ce que fait le scénario Make

1. Tally envoie la réponse au hook 4410784.
2. Brevo cherche le contact par son e-mail.
3. **Nouveau contact** : création avec prénom, nom, entreprise, `TITRE_JOB`, `WB_BESOIN`, `INSCRIT_WHITEBELT = oui`, `WB_DATE_INSCRIPTION`, `OPT_IN` selon la case newsletter, `ASSET_DERNIER = white_belt`, `DATE_DERNIERE_INTERACTION` et les 4 UTM.
4. **Contact existant** : mêmes champs, mais on garde les UTM et la date d'inscription déjà présents (premier contact), et un opt-in déjà donné n'est jamais retiré.
5. Ajout à la liste 49. C'est cet ajout qui déclenche la séquence Brevo.

Correspondance « Votre fonction » → `TITRE_JOB` :

| Tally | Brevo |
| --- | --- |
| Opérateur ou technicien | Technicien / Opérateur (23) |
| Chef d'équipe | Manager (toutes spécialités) (12) |
| Méthodes ou industrialisation | Responsable Méthodes (18) |
| Responsable production | Responsable Production (20) |
| Qualité ou HSE | Responsable Qualité (21) |
| Amélioration continue | Responsable Autres (QHSE, Export, etc.) (14) |
| Direction | Président / PDG / Gérant / Dirigeant (13) |
| Étudiant | Étudiant / Alternant / Apprenti (10) |
| Autre | Divers / Autre (24) |

« Qu'attendez-vous de cette formation ? » → `WB_BESOIN` : Découvrir les bases du Lean = 1, Lancer une démarche avec mon équipe = 2, Me former ou me certifier = 3, Faire accompagner mon site = 4.

« Taille de l'entreprise » et « Votre niveau en Lean » ne sont pas encore enregistrés dans Brevo : il faudrait deux attributs (par exemple `TAILLE_ENTREPRISE` et `NIVEAU_LEAN`). Je ne les ai pas créés sans votre accord.

## 2. Le workflow Brevo à créer (interface uniquement)

L'API Brevo ne permet pas de créer un workflow d'automation : cette étape se fait à la main, en 10 minutes environ.

1. **Automations** → **Créer un workflow** → **Workflow personnalisé**.
2. Nom : `WB · Nurturing White Belt`.
3. **Point d'entrée** : « Un contact est ajouté à une liste » → liste **White Belt — Inscrits (49)**.
4. Paramètres du point d'entrée : un contact n'entre **qu'une seule fois** dans le workflow.
5. **Envoyer un e-mail** → « Utiliser un template existant » → **206 · WB · E0 · Accès**.
   Expéditeur : Hugo de Fichly (hugo.duc@fichly.com).
6. **Délai** : 2 jours.
7. **Envoyer un e-mail** → **207 · WB · E1 · J+2 · Suivre un flux**.
8. **Délai** : 3 jours.
9. **Envoyer un e-mail** → **208 · WB · E2 · J+5 · Grille d'observation**.
10. **Délai** : 4 jours.
11. **Envoyer un e-mail** → **209 · WB · E3 · J+9 · Quel outil**.
12. **Délai** : 5 jours.
13. **Condition** (si / sinon) : attribut de contact `WB_BESOIN` **est égal à** « Lancer une démarche avec mon équipe » (2).
    - Oui → **Envoyer un e-mail** → **211 · WB · E4 · J+14 · Équipe**.
    - Non → nouvelle **Condition** : `WB_BESOIN` est égal à « Me former ou me certifier » (3).
      - Oui → **212 · WB · E4 · J+14 · Formation**.
      - Non → nouvelle **Condition** : `WB_BESOIN` est égal à « Faire accompagner mon site » (4).
        - Oui → **213 · WB · E4 · J+14 · Accompagnement**.
        - Non (besoin 1 ou vide) → **210 · WB · E4 · J+14 · Découvrir**.
14. Facultatif : dans les réglages d'envoi, limiter les envois aux jours ouvrés de 8 h à 18 h.
15. **Enregistrer sans activer.**

## 3. Avant la mise en ligne

Dans cet ordre :

1. **Liens provisoires à remplacer** dans les e-mails : `A-REMPLACER/acces-white-belt` (E0), `A-REMPLACER/lean-en-1-page` et `A-REMPLACER/landing-white-belt`. Donnez-moi les vraies URL : je régénère les e-mails et je mets à jour les templates.
2. **Tally, e-mail au répondant** : il est encore activé (« Votre accès à la White Belt Lean en 1 h »). Avec E0 envoyé par Brevo, l'inscrit recevrait deux e-mails d'accès. À désactiver dans Tally (Paramètres → Notifications → e-mail au répondant).
3. **Case newsletter** : elle est facultative, alors que tous les inscrits recevront L'Atelier une fois les deux bases connectées. Soit on la retire et on mentionne L'Atelier dans la case de consentement, soit on ne connecte que les inscrits qui l'ont cochée (`OPT_IN = oui`). À trancher.
4. **Publier le formulaire Tally** (vous).
5. **Faire une inscription test** avec une adresse à vous. Ensuite je vérifie dans Make la clé exacte de la question « Qu'attendez-vous de cette formation ? ». Elle n'existe qu'après publication. Pour l'instant, le scénario la lit par son libellé.
6. **Activer d'abord le workflow Brevo.** Le déclencheur « ajouté à une liste » ne rattrape pas les contacts ajoutés avant son activation. Si Make tourne en premier, les premiers inscrits ne reçoivent jamais la séquence.
7. **Activer ensuite le scénario Make 9905705.** Attention : tant que le scénario est inactif, les réponses Tally s'accumulent dans la file du hook et seront toutes traitées à l'activation. Videz la file si elle ne contient que des tests.
8. **Refaire une inscription test** et vérifier l'arrivée de E0, la fiche contact et la présence dans la liste 49.

Une personne déjà présente dans la liste 49 qui se réinscrit voit sa fiche mise à jour, mais la séquence ne repart pas. C'est voulu : elle ne reçoit pas deux fois les mêmes e-mails.
