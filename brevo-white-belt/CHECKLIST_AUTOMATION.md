# White Belt Lean : la séquence automatique

En service depuis le 2 octobre 2026. Tout passe par Make : aucun workflow Brevo, rien à régler à la main dans Brevo.

```
Tally ODOB5p → Make « Tally → Brevo » → contact + liste 49 + E0
                Make « Séquence E1 → E4 », chaque jour à 9 h → E1 … E4
```

## 1. Ce qui est en place

| Brique | Où | Identifiant | État |
| --- | --- | --- | --- |
| Formulaire « White Belt Lean en 1 h, gratuite » | Tally | `ODOB5p`, https://tally.so/r/ODOB5p | publié |
| Hook Tally → Make | Make | hook `4410784` | attaché au formulaire |
| Scénario « White Belt Lean · Tally → Brevo » | Make, dossier « Séquences Templates » | `9905705` | **actif**, à chaque réponse |
| Scénario « White Belt Lean · Séquence E1 → E4 » | Make, même dossier | `9906436` | **actif**, chaque jour à 9 h (Paris) |
| Scénario « Brevo · appel API (Claude) » | Make | `9905546` | outil de lecture et de vérification |
| Liste « White Belt — Inscrits » | Brevo, dossier 37 | liste `49` | 2 contacts de test, séquence terminée |
| Attributs `INSCRIT_WHITEBELT`, `WB_DATE_INSCRIPTION`, `WB_BESOIN`, `WB_ETAPE`, `WB_DERNIER_ENVOI`, `UTM_*` | Brevo | | créés |
| 8 templates de la séquence | Brevo | `206` à `213` | actifs |
| Code `WHITEBELT15` | Shopify | 15 % sur la collection « Toutes les fiches » | actif, sans date de fin |

### Templates

| Template | Nom | Envoi |
| --- | --- | --- |
| 206 | WB · E0 · Accès | à l'inscription |
| 207 | WB · E1 · J+2 · Suivre un flux | 2 jours après E0 |
| 208 | WB · E2 · J+5 · Grille d'observation | 3 jours après E1 |
| 209 | WB · E3 · J+9 · Quel outil | 4 jours après E2 |
| 210 | WB · E4 · J+14 · Découvrir | 5 jours après E3, besoin 1 ou non renseigné |
| 211 | WB · E4 · J+14 · Équipe | 5 jours après E3, besoin 2 |
| 212 | WB · E4 · J+14 · Formation | 5 jours après E3, besoin 3 |
| 213 | WB · E4 · J+14 · Accompagnement | 5 jours après E3, besoin 4 |

## 2. Le scénario d'inscription (9905705)

1. Tally envoie la réponse au hook 4410784.
2. **Garde** : la réponse n'est traitée que si l'e-mail est présent, la case de consentement cochée, et si elle vient de la nouvelle version du formulaire, c'est-à-dire qu'elle contient la question « Qu'attendez-vous de cette formation ? ». Les réponses de l'ancienne version, dont le consentement ne couvre pas les 4 e-mails de suivi, n'entrent pas dans la séquence.
3. Brevo cherche le contact. L'adresse est mise en minuscules et nettoyée de ses espaces. Le scénario ne continue que si Brevo répond « contact absent ». Toute autre erreur est relancée, pour ne jamais traiter un contact existant comme nouveau.
4. **Création ou mise à jour en une seule étape**, donc jamais de doublon, même en cas de double clic :
   - le **prénom saisi dans le formulaire** remplace celui de Brevo, puisque c'est lui qui apparaît dans « Bonjour … » (décision du 2 octobre) ;
   - nom, entreprise et `TITRE_JOB` déjà présents sont **conservés** ;
   - `WB_BESOIN` prend la réponse la plus récente ;
   - `WB_DATE_INSCRIPTION` garde la première inscription (date de Paris) ;
   - l'opt-in n'est écrit que si la case newsletter est cochée, et un opt-in déjà donné n'est jamais retiré ;
   - le bloc UTM du premier contact est gardé tel quel s'il existe, sinon c'est celui de la réponse qui est écrit (jamais de mélange source / medium) ;
   - `ASSET_DERNIER = white_belt` et `DATE_DERNIERE_INTERACTION` prennent la date de la réponse.
5. Si le contact n'est pas encore dans la liste 49 : ajout à la liste, envoi immédiat de **E0** (réponse à hugo.duc@fichly.com), puis `WB_ETAPE = 0` et `WB_DERNIER_ENVOI` = l'heure d'envoi. Une personne déjà dans la liste voit sa fiche mise à jour, sans nouvel e-mail.
6. En cas d'erreur Brevo : 3 nouvelles tentatives à 15 minutes d'intervalle, puis la réponse est gardée en « exécution incomplète » dans Make. Rien n'est perdu en silence, et les inscriptions suivantes ne sont pas bloquées.

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

## 3. La séquence E1 → E4 (9906436)

Chaque jour à 9 h, heure de Paris, le scénario relit les contacts de la liste 49 modifiés dans les 20 derniers jours. Pour chacun, il envoie l'e-mail suivant si les trois conditions sont réunies :

- le contact n'est pas désinscrit ;
- `WB_ETAPE` vaut 0, 1, 2 ou 3 (4 = séquence terminée) ;
- le délai est écoulé, compté en jours calendaires à Paris depuis `WB_DERNIER_ENVOI` : 2 jours après E0, 3 après E1, 4 après E2, 5 après E3.

Après chaque envoi, `WB_ETAPE` avance d'un cran et `WB_DERNIER_ENVOI` prend l'heure d'envoi. Après E3, le template de E4 dépend de `WB_BESOIN` : 2 → 211, 3 → 212, 4 → 213, sinon 210.

Une personne inscrite le lundi reçoit donc E1 le mercredi à 9 h, E2 le samedi, E3 le mercredi suivant et E4 le lundi d'après.

**Où voir l'avancement d'un inscrit** : fiche contact Brevo, attribut `WB_ETAPE` (0 = E0 reçu … 4 = E4 reçu). Les envois sont dans Brevo → Transactionnel → Logs, tag `white-belt-nurturing`.

**Erreurs** : 3 nouvelles tentatives à 15 minutes d'intervalle, puis exécution incomplète dans Make. Si l'envoi échoue, l'étape n'avance pas et l'e-mail repart le lendemain.

**Limites connues** :
- si l'envoi réussit mais que la mise à jour de `WB_ETAPE` échoue malgré les 3 relances, le même e-mail repartirait le lendemain. C'est peu probable, mais une exécution incomplète sur le module « Update a Contact » est le signal à surveiller ;
- le scénario lit 1 000 contacts par passage au plus, ce qui suffit tant qu'il y a moins de 1 000 inscriptions en 20 jours.

### Mode test

`python3 make/build_sequence.py test` génère une variante avec des délais de 2, 3, 4 et 5 **minutes** et un passage chaque minute : toute la séquence arrive en une quinzaine de minutes. `python3 make/build_sequence.py prod` régénère la version réelle. Demandez-moi la bascule : je mets le scénario à jour dans Make, puis je le remets en mode réel après le test. Le mode test ne doit jamais rester actif, car tout vrai inscrit recevrait alors la séquence complète en un quart d'heure.

## 4. Suivi

- L'e-mail au répondant de Tally est désactivé depuis le 2 octobre : l'accès part uniquement de Brevo (E0).
- Dans Make (Profil → Notifications), activez l'alerte sur les avertissements et les exécutions incomplètes, puis jetez un œil à l'onglet « Exécutions incomplètes » des deux scénarios pendant les premiers jours.
- Le test de bout en bout du 2 octobre et les 21 cas de test du scénario d'inscription sont dans [make/RESULTATS_TESTS.md](make/RESULTATS_TESTS.md).

## 5. Points à trancher

- **Case newsletter** : elle est facultative, alors que tous les inscrits recevront L'Atelier une fois les deux bases connectées. Soit on la retire et on mentionne L'Atelier dans la case de consentement, soit on ne connecte que les inscrits qui l'ont cochée (`OPT_IN = oui`).
- **Robots** : sans protection, une soumission automatique créerait un contact et lui enverrait la séquence. Activez la protection anti-spam de Tally. Je n'ai pas ajouté de filtre « devinette » dans Make, qui risquerait d'écarter de vrais inscrits.
- **Contacts désinscrits** : un contact désinscrit de Brevo qui s'inscrit à la White Belt reste désinscrit, le scénario ne réabonne jamais personne. Il reçoit E0, l'accès qu'il vient de demander, mais pas E1 à E4.
- **Réinscription** : une personne déjà dans la liste 49 qui refait le formulaire ne reçoit pas de nouvel e-mail d'accès. Elle est quand même redirigée vers la formation en fin de formulaire. Si vous voulez lui renvoyer l'accès, je peux ajouter l'envoi du template 206 dans ce cas précis.
- **Table « Votre fonction » → `TITRE_JOB`** : « Direction » donne « Président / PDG / Gérant / Dirigeant » (13), alors que « Directeur des opérations/industriel » (8) existe aussi. « Qualité ou HSE » donne « Responsable Qualité » (21). À valider.
- **Taille d'entreprise et niveau Lean** : ces deux réponses ne sont pas enregistrées dans Brevo. Il faudrait deux attributs (par exemple `TAILLE_ENTREPRISE` et `NIVEAU_LEAN`), à créer avec votre accord.
- **Traçabilité du consentement** : `INSCRIT_WHITEBELT` et `WB_DATE_INSCRIPTION` attestent l'inscription par la nouvelle version du formulaire, donc l'accord pour les 4 e-mails. Si vous voulez une preuve plus explicite, on peut ajouter un attribut date dédié.
- **Contacts de test** : hugo.duc@outlook.com et contact@fichly.com sont dans la liste 49 avec `WB_ETAPE = 4`. Ils ne recevront plus rien. Je les laisse, sauf avis contraire.
