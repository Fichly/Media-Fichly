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

### Ce que fait le scénario Make (version 2.1, testée)

1. Tally envoie la réponse au hook 4410784.
2. **Garde** : la réponse n'est traitée que si l'e-mail est présent, la case de consentement cochée, et si elle vient de la nouvelle version du formulaire, c'est-à-dire qu'elle contient la question « Qu'attendez-vous de cette formation ? ». Les réponses de l'ancienne version, dont le consentement ne couvre pas les 4 e-mails de suivi, n'entrent pas dans la séquence.
3. Brevo cherche le contact. L'adresse est mise en minuscules et nettoyée de ses espaces. Le scénario ne continue que si Brevo répond « contact absent ». Toute autre erreur est relancée, pour ne jamais traiter un contact existant comme nouveau.
4. **Création ou mise à jour en une seule étape**, donc jamais de doublon, même en cas de double clic :
   - prénom, nom, entreprise et `TITRE_JOB` déjà présents sont **conservés**, puisque la saisie existante est plus précise ;
   - `WB_BESOIN` prend la réponse la plus récente ;
   - `WB_DATE_INSCRIPTION` garde la première inscription (date de Paris) ;
   - l'opt-in n'est écrit que si la case newsletter est cochée, et un opt-in déjà donné n'est jamais retiré ;
   - le bloc UTM du premier contact est gardé tel quel s'il existe, sinon c'est celui de la réponse qui est écrit (jamais de mélange source / medium) ;
   - `ASSET_DERNIER = white_belt` et `DATE_DERNIERE_INTERACTION` prennent la date de la réponse.
5. Ajout à la liste 49 seulement si le contact n'y est pas déjà. C'est cet ajout qui déclenche la séquence.
6. En cas d'erreur Brevo : 3 nouvelles tentatives à 15 minutes d'intervalle, puis la réponse est gardée en « exécution incomplète » dans Make. Rien n'est perdu en silence, et les inscriptions suivantes ne sont pas bloquées.
7. Pensez à activer dans Make (Profil → Notifications) l'alerte sur les avertissements et les exécutions incomplètes, puis jetez un œil à l'onglet « Exécutions incomplètes » du scénario pendant les premiers jours.

Les résultats des 21 cas de test sont dans [make/RESULTATS_TESTS.md](make/RESULTATS_TESTS.md).

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
5. **Faire une inscription test** avec une adresse à vous, en ajoutant `?utm_source=test&utm_medium=test&utm_campaign=test&utm_content=test` au lien du formulaire. Ensuite je relis la réponse dans Make. Je remplace la lecture par libellé de la question « Qu'attendez-vous de cette formation ? » par son identifiant, qui n'existe qu'après publication, et je vérifie les clés `utm_medium` et `utm_content`.
6. **Activer d'abord le workflow Brevo.** Le déclencheur « ajouté à une liste » ne rattrape pas les contacts ajoutés avant son activation. Si Make tourne en premier, les premiers inscrits ne reçoivent jamais la séquence.
7. **Activer ensuite le scénario Make 9905705.** Attention : tant que le scénario est inactif, les réponses Tally s'accumulent dans la file du hook et seront toutes traitées à l'activation. Videz la file si elle ne contient que des tests.
8. **Refaire une inscription test** et vérifier l'arrivée de E0, la fiche contact et la présence dans la liste 49.

Une personne déjà présente dans la liste 49 qui se réinscrit voit sa fiche mise à jour, mais la séquence ne repart pas. C'est voulu : elle ne reçoit pas deux fois les mêmes e-mails.

## 4. Points à trancher

- **Robots** : sans protection, une soumission automatique créerait un contact et lui enverrait la séquence. Activez la protection anti-spam de Tally avant la publication. Je n'ai pas ajouté de filtre « devinette » dans Make, qui risquerait d'écarter de vrais inscrits.
- **Contacts désinscrits** : un contact désinscrit de Brevo qui s'inscrit à la White Belt reste désinscrit. Le scénario ne réabonne jamais personne. Il entre dans la liste 49, mais Brevo ne lui enverra probablement pas la séquence. À surveiller dans les premiers jours.
- **Réinscription** : une personne déjà dans la liste 49 qui refait le formulaire ne reçoit pas de nouvel e-mail d'accès. Elle est quand même redirigée vers la formation en fin de formulaire. Si vous voulez lui renvoyer l'accès, je peux ajouter l'envoi du template 206 dans ce cas précis.
- **Table « Votre fonction » → `TITRE_JOB`** : « Direction » donne « Président / PDG / Gérant / Dirigeant » (13), alors que « Directeur des opérations/industriel » (8) existe aussi. « Qualité ou HSE » donne « Responsable Qualité » (21). À valider.
- **Taille d'entreprise et niveau Lean** : ces deux réponses ne sont pas enregistrées dans Brevo. Il faudrait deux attributs, à créer avec votre accord.
- **Traçabilité du consentement** : `INSCRIT_WHITEBELT` et `WB_DATE_INSCRIPTION` attestent l'inscription par la nouvelle version du formulaire, donc l'accord pour les 4 e-mails. Si vous voulez une preuve plus explicite, on peut ajouter un attribut date dédié.
