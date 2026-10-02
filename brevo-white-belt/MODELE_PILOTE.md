# Modèle pilote : lead magnet → Tally → Brevo → nurturing

La White Belt sert de modèle. Pour un nouveau lead magnet (template, guide, webinaire…), on reprend les mêmes briques et les mêmes conventions de nommage. Dans les exemples, `XX` est le code court du lead magnet (`WB` pour la White Belt).

## Le flux

```
Tally (formulaire)  →  Make « Tally → Brevo »  →  contact + liste « XX — Inscrits » + E0
                        Make « Séquence E1 → E4 », chaque jour à 9 h  →  E1 … E4
```

Tout passe par Make : l'API Brevo ne permet pas de créer un workflow d'automation, et rien ne se règle à la main dans Brevo. La personnalisation passe par un attribut « besoin », qui choisit le dernier e-mail.

## 1. Formulaire Tally

- **Page 1** : visuel d'en-tête (1440 × 810, charte Fichly), promesse en une phrase, programme.
- **Champs cachés** : `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
- **Page 2** : prénom, nom, e-mail professionnel, entreprise, fonction (liste fermée), puis **une question de qualification à 4 réponses**. Elle alimente l'attribut `XX_BESOIN`, et chaque réponse correspond à une suite commerciale (découvrir, équipe, formation, accompagnement).
- **Consentement** obligatoire, qui décrit précisément les e-mails à venir (nombre, durée, contenu).
- **Page de remerciement** avec la suite immédiate et l'annonce de l'e-mail d'accès.
- L'e-mail d'accès part de Brevo (E0). **L'e-mail au répondant de Tally reste désactivé.**

## 2. Brevo

- **Attributs** : `INSCRIT_XX` (booléen), `XX_DATE_INSCRIPTION` (date), `XX_BESOIN` (catégorie 1 à 4), `XX_ETAPE` (nombre, dernier e-mail envoyé) et `XX_DERNIER_ENVOI` (date et heure). Les attributs `UTM_*`, `TITRE_JOB`, `ENTREPRISE`, `OPT_IN`, `ASSET_DERNIER` et `DATE_DERNIERE_INTERACTION` sont communs, on ne les recrée pas.
- **Liste** : `XX — Inscrits` dans le dossier 37.
- **Templates** : `XX · E0 · Accès`, puis `XX · E1 · J+2 · <sujet>` et ainsi de suite. Expéditeur `{"name": "Hugo de Fichly", "id": 5}`. Avec l'id seul, le nom de l'expéditeur reste vide.
- **Liens** : `utm_source=brevo&utm_medium=email&utm_campaign=<xx>-nurturing&utm_content=e0…e4`. Pas de bit.ly, pas de lien vers raw.githubusercontent.com. Les images sont hébergées dans la galerie Brevo.

## 3. Make

Deux scénarios, générés par `make/build_blueprint.py` et `make/build_sequence.py` (connexion Brevo 7809870) :

1. **Inscription**, sur le modèle de 9905705 « White Belt Lean · Tally → Brevo » : créer un hook Tally sur le nouveau formulaire (connexion Tally 8194360), remplacer les identifiants de champs (`question_…`, lus sur une vraie réponse au formulaire publié), adapter les attributs, la liste et le template de E0 ;
2. garder la logique « contact existant » : premier contact conservé pour les UTM et la date, opt-in jamais retiré, E0 envoyé seulement à l'entrée dans la liste ;
3. **Séquence**, sur le modèle de 9906436 « White Belt Lean · Séquence E1 → E4 » : adapter la liste, les templates, les délais et la table besoin → E4 ;
4. tester d'abord la séquence en mode test (délais en minutes, `build_sequence.py test`), puis repasser en mode réel (`build_sequence.py prod`, chaque jour à 9 h).

## 4. Séquence

| E-mail | Délai | Rôle |
| --- | --- | --- |
| E0 | immédiat | accès, programme, une ressource offerte |
| E1 | J+2 | un outil à tester sur le terrain |
| E2 | J+5 | un deuxième outil |
| E3 | J+9 | choisir le bon outil |
| E4 | J+14 | la suite selon `XX_BESOIN` (4 variantes) |

**Règles d'écriture** : français, vouvoiement, « Bonjour Prénom, » (« Bonjour, » si le prénom manque), signature « Hugo, Fichly ». Paragraphes de 2 à 4 phrases, 150 à 300 mots. Objet de 50 caractères au plus, sans point d'exclamation. Un visuel au plus par e-mail. Rien d'inventé : pas de témoignage, de chiffre ni de cas client absent des sources.

**Forme** : chaque e-mail doit donner envie d'être lu. Une illustration utile dans la charte Fichly, une hiérarchie nette, des blocs pastel pour l'essentiel et un bouton clair. Le rendu est vérifié sur mobile (375 px) et sur ordinateur avant tout envoi.

## 5. Mise en ligne

Dans cet ordre : remplacer les liens provisoires, désactiver l'e-mail au répondant de Tally, publier le formulaire, activer les deux scénarios (séquence en mode test), faire une inscription test et recevoir E0 à E4, puis repasser la séquence en mode réel. Le détail de la White Belt est dans [CHECKLIST_AUTOMATION.md](CHECKLIST_AUTOMATION.md).
