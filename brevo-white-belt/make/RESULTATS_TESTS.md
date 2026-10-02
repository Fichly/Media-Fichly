# Résultats des tests du scénario Make White Belt (harnais 9905753, réponses Tally simulées, 2 octobre 2026)

## Version 1

| Cas | Entrée | Attendu | Obtenu (Brevo) | Résultat |
| --- | --- | --- | --- | --- |
| T1 | nouveau contact complet, Chef d’équipe, besoin « équipe », newsletter oui, 4 UTM | création, liste 49, TITRE_JOB 12, WB_BESOIN 2, OPT_IN oui, date 2026-10-02, UTM | id 20334, liste [49], tous les attributs conformes | OK |
| T2 | même adresse, Direction, besoin « formation », newsletter non, autres UTM, 05/10 | mise à jour : nom, TITRE_JOB 13, WB_BESOIN 3 ; UTM, date et opt-in conservés | LASTNAME Test-Bis, 13, 3, OPT_IN oui, UTM linkedin…, date 2026-10-02, pas d’erreur liste | OK |
| T3 | nouveau contact minimal : pas d’UTM, pas de besoin, Autre, newsletter non | création sans erreur, TITRE_JOB 24, WB_BESOIN vide, OPT_IN non | id 20335, 24, pas de WB_BESOIN ni d’UTM, OPT_IN non | OK |
| T4 | libellé de question avec espace insécable avant « ? », besoin « accompagnement » | WB_BESOIN 4 via la variante insécable | id 20336, WB_BESOIN 4, TITRE_JOB 23 | OK |
| T5 | adresse existante en majuscules (Hugo.Duc+WBTEST-1@…) | contact existant trouvé, pas de doublon | mise à jour de 20334 (TITRE_JOB 21, WB_BESOIN 1), opt-in conservé | OK |
| T6 | contact sans opt-in ni UTM qui se réinscrit avec newsletter et UTM | OPT_IN passe à oui, UTM renseignés (vides avant) | OPT_IN oui, UTM_SOURCE newsletter, UTM_MEDIUM email, TITRE_JOB 10 | OK |

## Version 2 (upsert, garde, conservation des données, relances)

| Cas | Entrée | Attendu | Obtenu (Brevo) | Résultat |
| --- | --- | --- | --- | --- |
| V1 (1er essai) | nouveau contact complet, réponse à 22:30 UTC | liste 49, date de Paris | attributs justes (date 2026-10-03), mais **pas dans la liste 49** : le filtre `array:notcontain` rejette un contact sans liste | ÉCHEC → filtre remplacé par `if(contains(ifempty(listIds; emptyarray); 49); "oui"; "non") = non` |
| V7 | nouveau contact, fonction absente, libellé avec espace fine U+202F | création, liste 49, WB_BESOIN 4, pas de TITRE_JOB | id 20339, [49], WB_BESOIN 4, pas de TITRE_JOB, pas d'erreur | OK |
| V1 | même réponse, contact existant hors liste | ajout à la liste 49, attributs inchangés | [49], TITRE_JOB 12, WB_BESOIN 2, UTM linkedin…, date 2026-10-03 | OK |
| V2 | même personne : «  Hugo.Duc+WBTEST-10@Fichly.com  », tout en majuscules, Autre, besoin 3, newsletter non, autres UTM, 08/10 | même contact, prénom/nom/entreprise/fonction conservés, WB_BESOIN 3, opt-in conservé, UTM et date d'inscription conservés, dernière interaction 2026-10-08, pas d'erreur liste | exactement cela (id 20338, aucun doublon) | OK |
| V3 | contact avec bloc UTM partiel (source + medium) qui revient avec 4 autres UTM | bloc conservé tel quel, pas de mélange | UTM_SOURCE newsletter, UTM_MEDIUM email, CAMPAIGN/CONTENT vides | OK |
| V4 | contact existant hors liste (TITRE_JOB 8, « Hugo Duc », « Entreprise Avant », UTM audit) qui s'inscrit en « hugo duc », Direction | TITRE_JOB 8, prénom/nom/entreprise conservés, UTM audit, ajouté à la liste 49 | exactement cela, WB_DATE_INSCRIPTION 2026-10-09 | OK |
| V5 | consentement non coché | aucun contact | 404 : aucun contact | OK |
| V6 | réponse de l'ancienne version (pas de question « Qu'attendez-vous ») | aucun contact | 404 : aucun contact | OK |
| V8 | e-mail absent | rien, sans erreur | exécution réussie, rien écrit | OK |

| V9 | contact désinscrit (emailBlacklisted, TITRE_JOB 17) qui coche la newsletter | reste désinscrit, données conservées | emailBlacklisted toujours vrai, TITRE_JOB 17, prénom conservé, OPT_IN vrai, liste 49 | OK (voir la note sur les désinscrits dans la checklist) |
| V10 | adresse refusée par Brevo (« pas-un-email ») | erreur relancée et gardée, rien de perdu | exécution terminée en avertissement, 1 exécution incomplète stockée avec relances | OK |

## Nettoyage

- Les 7 contacts de test créés pendant les tests (ids 20334 à 20340) ont été supprimés. La liste 49 est revenue à 0 contact.
- Le scénario harnais 9905753 a été désactivé puis supprimé. Il se recrée depuis `blueprint_harnais_test.json`, avec l'entrée de scénario `payload` (texte).
- Le scénario réel 9905705 est en version 2, **inactif**. La file du hook 4410784 est vide.

## Encore à tester après la publication du formulaire

Une vraie soumission Tally doit confirmer, sur la structure publiée, la clé de la question « Qu’attendez-vous de cette formation ? » et les clés `utm_medium` / `utm_content`, qui n'ont jamais été observées dans une sortie réelle.
