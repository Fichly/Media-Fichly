# Modèle pilote : lead magnet → Tally → Brevo → nurturing

La White Belt sert de modèle. Pour un nouveau lead magnet (template, guide, webinaire…), on reprend les mêmes briques et les mêmes conventions de nommage. Dans les exemples, `XX` est le code court du lead magnet (`WB` pour la White Belt).

## Le flux

```
Tally (formulaire)  →  Make (hook + scénario)  →  Brevo (contact + attributs)  →  liste « XX — Inscrits »  →  workflow Brevo (E0 … E4)
```

Un seul déclencheur, l'ajout à la liste. La personnalisation passe par un attribut « besoin », qui choisit le dernier e-mail.

## 1. Formulaire Tally

- **Page 1** : visuel d'en-tête (1440 × 810, charte Fichly), promesse en une phrase, programme.
- **Champs cachés** : `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
- **Page 2** : prénom, nom, e-mail professionnel, entreprise, fonction (liste fermée), puis **une question de qualification à 4 réponses**. Elle alimente l'attribut `XX_BESOIN`, et chaque réponse correspond à une suite commerciale (découvrir, équipe, formation, accompagnement).
- **Consentement** obligatoire, qui décrit précisément les e-mails à venir (nombre, durée, contenu).
- **Page de remerciement** avec la suite immédiate et l'annonce de l'e-mail d'accès.
- L'e-mail d'accès part de Brevo (E0). **L'e-mail au répondant de Tally reste désactivé.**

## 2. Brevo

- **Attributs** : `INSCRIT_XX` (booléen), `XX_DATE_INSCRIPTION` (date), `XX_BESOIN` (catégorie 1 à 4). Les attributs `UTM_*`, `TITRE_JOB`, `ENTREPRISE`, `OPT_IN`, `ASSET_DERNIER` et `DATE_DERNIERE_INTERACTION` sont communs, on ne les recrée pas.
- **Liste** : `XX — Inscrits` dans le dossier 37.
- **Templates** : `XX · E0 · Accès`, puis `XX · E1 · J+2 · <sujet>` et ainsi de suite. Expéditeur `{"name": "Hugo de Fichly", "id": 5}`. Avec l'id seul, le nom de l'expéditeur reste vide.
- **Liens** : `utm_source=brevo&utm_medium=email&utm_campaign=<xx>-nurturing&utm_content=e0…e4`. Pas de bit.ly, pas de lien vers raw.githubusercontent.com. Les images sont hébergées dans la galerie Brevo.

## 3. Make

Dupliquer le scénario **9905705 « White Belt Lean · Tally → Brevo »**, puis :

1. créer un hook Tally sur le nouveau formulaire (connexion Tally 8194360) et le brancher sur le module 1 ;
2. remplacer les identifiants de champs (`question_…`) : la structure du formulaire publié s'affiche dans le module Tally ;
3. adapter les attributs (`INSCRIT_XX`, `XX_DATE_INSCRIPTION`, `XX_BESOIN`, `ASSET_DERNIER`) et la liste ;
4. garder la logique « contact existant » : premier contact conservé pour les UTM et la date, opt-in jamais retiré ;
5. laisser le scénario inactif jusqu'au test de bout en bout.

## 4. Séquence

| E-mail | Délai | Rôle |
| --- | --- | --- |
| E0 | immédiat | accès, programme, une ressource offerte |
| E1 | J+2 | un outil à tester sur le terrain |
| E2 | J+5 | un deuxième outil |
| E3 | J+9 | choisir le bon outil |
| E4 | J+14 | la suite selon `XX_BESOIN` (4 variantes) |

**Règles d'écriture** : français, vouvoiement, « Bonjour, » sans prénom, signature « Hugo, Fichly ». Paragraphes de 2 à 4 phrases, 150 à 300 mots. Objet de 50 caractères au plus, sans point d'exclamation. Un visuel au plus par e-mail. Rien d'inventé : pas de témoignage, de chiffre ni de cas client absent des sources.

**Forme** : chaque e-mail doit donner envie d'être lu. Une illustration utile dans la charte Fichly, une hiérarchie nette, des blocs pastel pour l'essentiel et un bouton clair. Le rendu est vérifié sur mobile (375 px) et sur ordinateur avant tout envoi.

## 5. Mise en ligne

Suivre la section 3 de [CHECKLIST_AUTOMATION.md](CHECKLIST_AUTOMATION.md) : remplacer les liens provisoires, désactiver l'e-mail Tally, publier, faire une inscription test, activer Make, activer le workflow, puis refaire une inscription test.
