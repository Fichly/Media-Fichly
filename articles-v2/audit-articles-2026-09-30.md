# Audit des articles du blog Fichly "nos-articles" (lecture seule)

Date : 2026-09-30. Source : Admin GraphQL `article(id)` (title, handle, templateSuffix, isPublished, publishedAt, image, body). Aucune mutation.
Comptes faits a la lecture du HTML brut ; nombres de mots = estimation du texte visible (hors CSS / JSON-LD), +/- 10 %.
Tous les liens internes sont en absolu `https://www.fichly.com/...` sauf mention contraire.

---

## 1. TPM — `tpm-total-productive-maintenance` (1004916867417)
- Template : `article` ; publie (publishedAt 2026-08-31T11:12Z, cree 2026-08-24). Image article : `articles/Article_TPM_-_FIchly_-_Lean_Management.png` (altText null). Auteur : Hugo Duc.
- `<style>` en tete : oui, ~51 lignes / ~56 regles, ~5 Ko. Police `"Helvetica Neue",Helvetica,Arial,sans-serif`, 18px, line-height 1.75, max-width 760px.
  Couleurs : texte #222 / titres #1a1a1a ; accent principal indigo #3b3a9e (liens, CTA, th) ; resume teal #e6f4f4/#75bec0/#3a8a8c ; toc bleu #eef3fa/#74a3d6 ; essentiel jaune #fdf3d6/#e6b839 ; note vert #eef7e8/#8cc978 ; pieges rouge #fbeded/#f16969 ; ko #d63b3b ; ok #4f9f3a ; bordures #dde2e8 ; zebra #f6f8fb ; lien CTA #cdd3ff ; hover #2a2980.
  Regles distinctives : `.fichly-bio` en flex + `.fichly-bio-photo` 96px rond + `.fichly-bio-body` ; `.fichly-essentiel li strong{display:inline}` ; `td.col-oui/.col-non`, `th.th-oui/.th-non` ; FAQ `summary::after "\203A"` rotatif. => **Variante "V3-bio-photo"** (reference).
- Wrapper : `<div class="fichly-article">`. Aucun marqueur de builder. Attributs `style="..."` inline : 0.
- Composants : fichly-resume (.label), fichly-essentiel, fichly-toc, fichly-note (x2), fichly-pieges (+ fichly-ko / fichly-ok), td.col-non (x5), fichly-faq (details/summary/.answer), fichly-cta, fichly-bio (+ -photo, -body), fichly-readmore. Classes definies mais inutilisees : col-oui, th-oui, th-non.
- Ordre : intro <p> -> En resume -> Essentiel a retenir (5 puces) -> Sommaire (ol, 9 ancres #definition #piliers #trs #test #etapes #pieges #outils #anglais #faq, toutes avec id sur H2) -> 9 H2 -> FAQ (6 details) -> CTA -> bio -> A lire aussi (3 liens) -> fin div -> `<p>` JSON-LD.
- H2 : 9 ; H3 : 7 (Etape 1 a 7) ; tableaux : 3 ; images : 4 (3 visuels contenu alt="" + photo bio avec alt) => 3 alt vides.
- H2 : 1 Qu'est-ce que la TPM (Total Productive Maintenance) ? / 2 Quels sont les 8 piliers de la TPM, et dans quel ordre les prendre ? / 3 Comment mesurer la TPM ? Ce qu'elle change sur votre TRS / 4 Votre atelier est-il pret pour la TPM ? Le test en cinq questions / 5 Les 7 etapes de la maintenance autonome / 6 Pourquoi la maintenance autonome s'arrete-t-elle a six mois ? / 7 Les outils qui font tenir une TPM / 8 Le vocabulaire de la TPM en anglais / 9 FAQ : vos questions sur la TPM.
- FAQ : `<details><summary>` dans `.fichly-faq`, 6 questions, texte identique au FAQPage.
- CTA : `/pages/partenaires-logiciels` ("partenaires logiciels de pilotage du TRS") — partenaire, pas formation/produit.
- Bio : oui (photo Photo_Hugo_Duc.png 96x96 + LinkedIn + lien home fichly.com).
- Liens internes /blogs/nos-articles/ : 9 (6 dans le corps + 3 A lire aussi) vers 5 cibles uniques (TRS x3, MUDA x2, 5S x2, PDCA, DMAIC). /products/ : 1 (`fiches-lean`). /pages/ : 1 (`partenaires-logiciels`). Externes : AFNOR NF EN 13306, Legifrance, code.travail.gouv.fr, LinkedIn (target=_blank rel=noopener).
- JSON-LD : oui, Article + FAQPage, **dans un `<p>`**. Incoherences : datePublished "2026-09-04" alors que publie le 2026-08-31 ; dateModified "2026-08-24" anterieur a datePublished ; image JSON-LD `files/fichly-tpm-16-pertes.png` differente de l'image de l'article et d'aucune image du corps (qui utilise `1_16_pertes_TPM.png`).
- H1 dans le corps : non.
- Mots visibles : ~3 900.
- Divers : emojis comme icones (❌ ✅ dans pieges, 👉 dans CTA et bio) ; une image suivie de `<br>` + texte dans le meme `<p>` (section pieges) ; images de contenu sans width/height.

## 2. MTBF/MTTR — `mtbf-mttr-indicateurs-disponibilite` (1004916834649)
- Template : `article` ; publie (2026-08-31T11:01Z, cree 2026-08-24). Image article : `articles/Article_qu_est-ce_que_le_MTBF_et_MTTR_-_FIchly_-_Lean_Management.png` (altText null).
- `<style>` : oui, ~52 lignes, ~5,2 Ko. Meme police/couleurs que TPM. Difference vs TPM : ajoute `.fichly-article img{width:100%;height:auto;display:block;border-radius:10px;margin:1.8em 0;}` et `.fichly-bio-photo img{...;margin:0;border-radius:0;}`. => **Variante "V3-bio-photo + regle img"** (V3b).
- Wrapper `fichly-article` ; aucun builder ; 0 `style=""` inline.
- Composants : resume, essentiel, toc, note (x1), pieges (+ ko/ok avec libelles texte "Erreur" / "A faire", pas d'emoji), faq, cta, bio (photo), readmore. col-oui/col-non/th-oui/th-non definis mais inutilises.
- Ordre : intro -> En resume -> Essentiel (5) -> Sommaire (8 ancres #definitions #disponibilite #calcul #matrice #erreurs #anglais #outils #faq, id presents) -> 8 H2 -> FAQ (6 details) -> CTA -> bio -> A lire aussi (3).
- H2 : 8 ; H3 : 10 ; tableaux : 3 (sans `<thead>`, `<th>` dans la 1re ligne du `<tbody>`) ; images : 6 (5 visuels alt="" + photo bio) => 5 alt vides.
- H2 : 1 Quelle est la difference entre MTBF et MTTR ? / 2 Pourquoi MTBF et MTTR donnent-ils ensemble la disponibilite ? / 3 Comment calculer MTBF et MTTR ? / 4 Lequel suivre : le croisement MTBF et MTTR en quatre cas / 5 Ce qui fausse un MTBF ou un MTTR / 6 Le vocabulaire MTBF, MTTR et MTTF en anglais / 7 Les outils qui prennent le relais apres le MTBF et le MTTR / 8 FAQ : vos questions sur le MTBF et le MTTR.
- FAQ : details/summary, 6 Q, identique au FAQPage.
- CTA : `/pages/partenaires-logiciels` (partenaires logiciels TRS/disponibilite).
- Bio : oui (photo). A lire aussi : TRS, MUDA, DMAIC.
- Liens /blogs/nos-articles/ : 9 (6 corps + 3 readmore), 6 cibles uniques (TRS, MUDA, DMAIC, PDCA, VSM, 5S). /products/ : 1 (fiches-lean). /pages/ : 1. Externes : AFNOR, Legifrance.
- JSON-LD : Article + FAQPage dans `<p>`. datePublished "2026-09-03" (reel 2026-08-31), dateModified "2026-08-24" < datePublished ; image JSON-LD `files/fichly-mtbf-mttr-disponibilite.png` != image article et != visuels du corps.
- H1 : non. Mots : ~3 800.
- Divers : emoji 👉 (CTA, bio).

## 3. Types de maintenance — `types-de-maintenance-comment-choisir` (1004806668633)
- Template : `article` ; publie (2026-08-31T10:50Z, cree 2026-08-17). Image article : `articles/Article_les_Types_de_maintenance_-_Fichly_-_Lean_Management.png` (altText null).
- `<style>` : oui, ~51 lignes, ~5 Ko ; **identique a TPM** (V3a : pas de regle `.fichly-article img`). Police Helvetica Neue, memes couleurs.
- Wrapper `fichly-article` ; aucun builder ; 0 `style=""`.
- Composants utilises : resume, essentiel, toc, faq, cta, bio (photo), readmore. Pas de note ni de pieges (classes definies inutilisees : note, pieges, ko, ok, col-*, th-*).
- Ordre : intro -> En resume -> Essentiel (5) -> Sommaire (10 ancres #arbitrage #norme #corrective #systematique #conditionnelle #previsionnelle #ameliorative #grille #disponibilite #faq, id presents) -> 10 H2 -> FAQ (6) -> CTA -> bio -> A lire aussi (3).
- H2 : 10 ; H3 : 0 ; tableaux : 3 (avec thead ; une cellule `<td></td>` vide) ; images : 4 (3 visuels alt="" + bio) => 3 alt vides.
- H2 : 1 Comment choisir un type de maintenance ? Arbitrer surveillance contre arret / 2 Quels sont les differents types de maintenance ? Les deux familles de la norme NF EN 13306 / 3 Maintenance corrective, ou curative : quand ne rien anticiper est le bon calcul / 4 Maintenance preventive systematique : le calendrier, et ce qu'il coute / 5 Maintenance conditionnelle : le seuil, et ce qu'il faut pouvoir mesurer / 6 Quels sont les 3 types de maintenance preventive ? Conditionnelle, previsionnelle, predictive / 7 La maintenance ameliorative est-elle un type de maintenance ? / 8 Choisir equipement par equipement : criticite, mesurabilite, cout d'arret / 9 Ce qu'un plan de maintenance change sur la disponibilite / 10 FAQ : vos questions sur les types de maintenance.
- FAQ : details/summary, 6 Q. Ecart mineur FAQPage : la 1re reponse du JSON-LD omet "et c'est la source de la confusion".
- CTA : `/pages/formation-lean-green-belt-cpf` (formation Green Belt, 6 j / 42 h, RS7114, code promo FICHLY5).
- Bio : oui (photo). A lire aussi : TRS, 5S, DMAIC.
- Liens /blogs/nos-articles/ : 7 (4 corps + 3 readmore), 3 cibles uniques (TRS, DMAIC, 5S). /products/ : 1 (fiches-lean, "fiches des 40 outils du Lean"). /pages/ : 1 (formation Green Belt). Externes : boutique.afnor.org, inrs.fr.
- JSON-LD : Article + FAQPage dans `<p>`. **Pas de propriete `image`** dans l'Article. datePublished "2026-08-27" (reel 2026-08-31), dateModified "2026-08-24" < datePublished.
- H1 : non. Mots : ~3 300.
- Divers : image 3 collee en milieu de paragraphe (`...aucun sens.<img ...><br>Deux complements...`), sans `<p>` propre ; emoji 👉.

## 4. SMED — `methode-smed-5-etapes` (1004654330201)
- Template : `article` ; publie (publishedAt 2026-08-31T10:14Z, cree 2026-08-05, maj 2026-08-31). Image article : `articles/article-smed-fichly.png` (altText renseigne).
- `<style>` : oui, ~64 lignes, ~7 Ko. Meme police Helvetica Neue / memes couleurs + gris #6b7280. **Variante "V2-author-card + justify"** : `p{text-align:justify !important;hyphens:auto}` + regle de retour a gauche pour toc/cta/bio/author/readmore/faq/legende/li/td/th ; regle `.fichly-article img` ; `.fichly-embed` (iframe ratio 54 %) + `.fichly-legende` ; `.fichly-resume ul/li` ; `.fichly-bio` simple bloc (pas de flex/photo) ; bloc `.fichly-author` (carte flex, border-top 5px #3b3a9e, photo ronde 84px, `.role`, `.fichly-author-link`).
- Wrapper : `<div class="fichly-article" lang="fr">`. Aucun builder ; 0 `style=""`.
- Composants : resume (avec ul 3 puces), essentiel (6), toc, fichly-embed (iframe GIPHY) + fichly-legende, pieges (❌/✅), faq, cta, **fichly-bio (texte) ET fichly-author (carte photo) = double bloc auteur**, readmore. Pas de note.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (9 ancres #definition #pourquoi #internes-externes #etapes #demarrer #exemple #erreurs #outils-complementaires #faq, id presents) -> 9 H2 -> FAQ (7 details) -> CTA -> bio -> author -> A lire aussi (3).
- H2 : 9 ; H3 : 5 (Etape 1-5) ; tableaux : 1 (sans thead) ; images : 9 (2 schemas `fichly-smed-*.png` avec alt descriptif + loading=lazy, 6 visuels `N_SMED_*.png` alt="", photo auteur) => 6 alt vides ; 1 iframe GIPHY.
- H2 : 1 Qu'est-ce que la methode SMED ? / 2 Pourquoi reduire vos temps de changement de serie ? / 3 Operations internes et externes : la distinction cle / 4 Les 5 etapes de la methode SMED / 5 Comment lancer un premier chantier SMED dans votre atelier / 6 Exemple : la presse de 1 000 tonnes de Toyota / 7 Les 6 erreurs qui plombent un chantier SMED / 8 SMED, 5S, TRS, VSM, DMAIC : les outils complementaires / 9 FAQ : vos questions sur la methode SMED.
- FAQ : details/summary, 7 Q = FAQPage.
- CTA : `/pages/formation-lean-green-belt-cpf` (Green Belt, RS7114, CPF/OPCO/France Travail).
- Bio : oui (texte sans photo) + carte auteur avec photo. A lire aussi : TRS, 5S, VSM.
- Liens /blogs/nos-articles/ : 8 (5 corps + 3 readmore), 5 cibles uniques (TRS, 5S, VSM, DMAIC, MUDA). /products/ : 1 (fiches-lean). /pages/ : 1. Externes : Wikipedia (Shingo), global.toyota, giphy.com.
- JSON-LD : Article + FAQPage dans `<p>`. datePublished "2026-08-05" (publishedAt reel 2026-08-31 ; = date de creation), dateModified "2026-08-31" (coherent en ordre). Image JSON-LD = `files/fichly-smed-5-etapes-diminution.png` (visuel du corps) != image article `article-smed-fichly.png`.
- H1 : non. Mots : ~3 300.
- Divers : `<img>` places **a l'interieur de `<strong>`** (etapes 1 et 3) ; suites `<br><br>` / `<br><br><br>` apres images ; 2 `<img>` nus hors `<p>` ; `<br><img><br>` dans le `<p>` d'intro des erreurs ; deux visuels "5 etapes" quasi redondants (`fichly-smed-5-etapes-diminution.png` et `1_SMED_5_etapes.png`) ; emojis 👉 aussi dans le corps (section "Pourquoi"), ❌/✅ ; titre avec "(guide 2026)".

## 5. 5 pourquoi — `methode-5-pourquoi-cause-racine` (1004806635865)
- Template : `article` ; publie (2026-08-31T09:49Z, cree 2026-08-17). Image article : `articles/article-5-pourquoi-fichly.png` (altText renseigne).
- `<style>` : oui, ~55 lignes, ~5 Ko. **Memes regles que TPM (V3a)** mais les regles `.fichly-bio*` sont eclatees sur 5 lignes au lieu d'une (meme contenu, mise en forme differente). Pas de regle `.fichly-article img`.
- Wrapper `fichly-article` ; aucun builder ; 0 `style=""`.
- Composants : resume, essentiel, toc, note (x1, "Le test de la releve"), td.col-non + td.col-oui (1 chacun, seul article du lot a utiliser col-oui), faq, cta, bio (photo), readmore. Pas de pieges.
- Ordre : intro -> En resume -> Essentiel (5) -> Sommaire (9 ancres #deux-chaines #methode #troisieme #test #branches #arret #contre-mesure #anglais #faq) -> 9 H2 -> FAQ (6) -> CTA -> bio -> A lire aussi (3).
- H2 : 9 ; H3 : 0 ; tableaux : 3 (thead ; 2 `<td></td>` vides voulus) ; images : 3 (2 visuels alt="" + bio) => 2 alt vides. Un visuel s'appelle `Qu_est-ce_que_le_5_Pourquoi_-_CTA_Audit_-_Fichly.png` (nom evoquant un CTA "Audit").
- H2 : 1 Deux exemples de 5 pourquoi : l'un aboutit, l'autre s'arrete / 2 Qu'est-ce que la methode des 5 pourquoi ? / 3 Pourquoi la chaine des 5 pourquoi s'arrete-t-elle au troisieme niveau ? / 4 Le test qui distingue une cause racine d'une cause-personne / 5 Quand une reponse en contient deux : brancher l'analyse / 6 Comment savoir qu'un 5 pourquoi est termine ? / 7 Contre-mesure ou action corrective : les deux mots ne sont pas synonymes / 8 Le vocabulaire du 5 Why en anglais / 9 FAQ : vos questions sur les 5 pourquoi.
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : `/pages/formation-lean-green-belt-cpf` (Green Belt, FICHLY5).
- Bio : oui (photo). A lire aussi : DMAIC, PDCA, MUDA.
- Liens /blogs/nos-articles/ : 6 (3 corps + 3 readmore), 3 cibles (DMAIC, PDCA, MUDA). /products/ : 1 (`le-guide-de-la-resolution-de-problemes-dmaic`). /pages/ : 1. Externe : inrs.fr. Ishikawa et QQOQCP cites sans lien (articles en brouillon).
- JSON-LD : Article + FAQPage dans `<p>`. **headline "Les 5 pourquoi : pourquoi on s'arrete au troisieme" != titre reel** ; pas d'`image` ; datePublished "2026-08-28" (reel 08-31), dateModified "2026-08-24" < datePublished.
- H1 : non. Mots : ~3 000.
- Divers : espace avant `</li>` ; emoji 👉.

## 6. TRS/TRG/TRE — `trs-trg-tre-lequel-piloter` (1004803621209)
- Template : `article` ; publie (2026-08-31T09:24Z, cree 2026-08-17). Image article : `articles/article-trs-trg-tre-fichly.png` (altText renseigne).
- **Le corps commence par un commentaire HTML `<!-- ... -->` (~2 Ko) AVANT le `<style>`** : brief editorial interne (title tag, meta description, statut des visuels Canva avec IDs, "EN ATTENTE", "REMPLACER-PAR-PHOTO-HUGO", analyse SERP du 17/08, gaps concurrentiels, raisonnement CTA). Visible dans le code source public.
- `<style>` : oui, ~58 lignes, ~6 Ko. **Variante "V1-author-card"** (plus ancienne) : `.fichly-toc strong` et `.fichly-essentiel strong{display:block}` (selecteurs non enfants, sans le correctif `li strong`) ; `.fichly-bio` simple bloc ; bloc `.fichly-author` (photo 84px, `img` sans `display:block;margin:0`) ; pas de regle `.fichly-article img` ; pas de justify ni embed.
- Wrapper `fichly-article` (sans lang). **Styles inline : 6** (`style="max-width:100%;height:auto;display:block;margin:1.5em auto;border-radius:8px;"` sur l'image + 5 `<p style="text-align: left;">` dans la section TRS).
- Composants : resume, essentiel (6), toc (12), note (x1), pieges (❌/✅), faq, cta, fichly-bio (texte sans photo) + fichly-author (carte) = double bloc auteur, readmore.
- Ordre : [commentaire] -> style -> intro -> En resume -> Essentiel -> Sommaire (12 ancres) -> 12 H2 -> FAQ (7) -> CTA -> bio -> author -> A lire aussi (3).
- H2 : 12 ; H3 : 0 ; tableaux : 2 (sans thead) ; images : 2 balises `<img>` : le schema des temps d'etat (alt descriptif, width/height, loading=lazy) et **la photo de la carte auteur `<img alt="...">` SANS `src`** (image cassee / placeholder non remplace). 0 alt vide.
- H2 : 1 La cascade des temps d'etat : d'ou viennent les trois taux (TRS, TRE, TRG) [le sommaire dit "La cascade des temps : d'ou viennent les trois taux"] / 2 Une seule machine, trois resultats / 3 Le TRS : ce que l'atelier maitrise / 4 Le TRG : ce que l'organisation decide / 5 Le TRE : ce que l'investissement rend / 6 OEE, OOE, TEEP : les equivalents anglais / 7 Le piege de la comparaison entre sites / 8 Pourquoi nous ne donnons pas de seuil cible / 9 Alors, lequel piloter ? / 10 Les erreurs qui faussent vos taux / 11 Les outils Lean qui prennent le relais / 12 FAQ : vos questions sur le TRS, le TRG et le TRE.
- FAQ : details/summary, 7 Q. FAQPage : reponses 4 et 5 tronquees de leur derniere phrase par rapport au visible.
- CTA : `/pages/partenaires-logiciels` (partenaires logiciels de suivi de performance).
- Bio : oui (texte) + carte auteur (photo manquante). A lire aussi : TRS, SMED, MUDA.
- Liens /blogs/nos-articles/ : 7 (4 corps + 3 readmore), 4 cibles (TRS, SMED, MUDA, VSM). /products/ : 1 (fiches-lean). /pages/ : 1. Externe : boutique.afnor.org (NF E60-182).
- JSON-LD : Article + FAQPage dans `<p>`. datePublished/dateModified "2026-08-17" (= creation ; publie le 08-31). Image JSON-LD = schema du corps `files/trs-trg-tre-temps-etat-fichly.png` != image article.
- H1 : non. Mots : ~3 300.
- Divers : `<br>` / `<br><br>` dans essentiel, liste et note ; `<img>` nu hors `<p>` ; emojis 👉 dans le corps (3 "Son proprietaire naturel") + ❌/✅ ; phrase factuelle douteuse dans la section TRS : "on ne compte pas les arrets non-planifies dans le calcul du TRS" (ce sont les arrets planifies qui sont exclus du temps requis, cf. reste de l'article).

## 7. DMAIC — `methode-dmaic-5-etapes` (1004584993113)
- Template : `article` ; publie (2026-07-31T12:12Z, maj 2026-08-28). Image article : `articles/Article_DMAIC_-_FIchly_-_Lean_Management_14a9219b-....png` (altText null).
- `<style>` : oui, ~51 lignes, ~5 Ko ; **identique a TPM (V3a)**. HTML aere (lignes vides entre blocs).
- Wrapper `fichly-article` ; aucun builder ; 0 `style=""`.
- Composants : resume, essentiel (5), toc (12), note (x1 "Transparence"), td.col-oui/col-non (5+5), pieges (❌/✅), faq, cta, bio (photo), readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (12 ancres) -> 12 H2 -> FAQ (6) -> CTA -> bio -> A lire aussi (3) -> fin div -> JSON-LD.
- H2 : 12 ; H3 : 5 (1. Definir ... 5. Controler ; un seul avec id `analyser`) ; tableaux : 7 (tous avec thead) ; **images : 1 seule (photo bio)**, aucun visuel de contenu ; 0 alt vide.
- H2 : 1 C'est quoi la methode DMAIC ? Definition et acronyme / 2 DMAIC, Six Sigma et Lean : qui appartient a qui / 3 Quand le DMAIC est-il le bon outil ? / 4 Pourquoi DMAIC et pas PDCA ? / 5 Les 5 etapes du DMAIC et ce que chaque phase doit produire / 6 Exemple concret : un projet DMAIC en atelier d'usinage / 7 Qui pilote un projet DMAIC, et avec quelle equipe ? / 8 DMAIC, PDCA, 8D, QRQC, A3 : la carte des methodes / 9 DMAIC en anglais : les 5 phases et les sigles / 10 Les erreurs qui font echouer un projet DMAIC / 11 Se former au DMAIC : quel niveau pour quel role / 12 FAQ : vos questions sur le DMAIC.
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : `/pages/formation-lean-green-belt-cpf` (Green Belt, FICHLY5).
- Bio : oui (photo). A lire aussi : PDCA, MUDA, Green Belt.
- Liens /blogs/nos-articles/ : 7 (4 corps + 3 readmore), 5 cibles (PDCA, VSM, MUDA, responsable-amelioration-continue, green-belt). /products/ : 1 (guide DMAIC). /pages/ : 1. Externes : boutique.afnor.org, francecompetences.fr (RS7114), moncompteformation.gouv.fr.
- JSON-LD : Article + FAQPage, **non enveloppe dans un `<p>`** (scripts nus apres la div, seul cas parmi les articles recents). **headline "DMAIC : les 5 etapes, leurs livrables et quand ne pas l'utiliser" != titre reel** ; pas d'`image` ; datePublished 2026-07-31 (coherent), dateModified 2026-08-24.
- H1 : non. Mots : ~3 700.
- Divers : renvoi "notre article sur la methode A3" sans lien (pas d'article A3 dans la liste) ; les 5 pourquoi et le diagramme de causes cites sans lien ; tarifs et reste a charge CPF (1 500 / 2 500 EUR, 150 EUR depuis avril 2026) en dur ; emojis 👉 ❌ ✅.

## 8. PDCA — `methode-pdca-roue-de-deming-cycle` (1004401787225)
- Template : `article` ; publie (2026-07-28T08:42Z, maj 2026-08-24). Image article : `articles/Article_PDCA_-_FIchly_-_Lean_Management_2_690bc790-....png` (altText null).
- **Commentaire HTML `<!-- ... -->` en tete (~1,3 Ko)** avant le style : "A COLLER DANS L'EDITEUR DE CODE SHOPIFY", champs SEO, placeholders "REMPLACER-PAR-PHOTO-HUGO" / "REMPLACER-PAR-LOGO-FICHLY", palette (#f16969 #e6b839 #74a3d6 #75bec0 #aa76b2 #8cc978 #3b3a9e).
- `<style>` : oui, ~58 lignes, ~6 Ko ; **identique a TRS/TRG/TRE (V1-author-card)**.
- Wrapper `fichly-article`. **Styles inline : 5** (4 `<span style="text-decoration: underline;">` dans l'Essentiel + `style="text-align: start;"` sur la photo auteur). **Classes collees depuis l'interface Claude** : 3 `<p dir="ltr" class="font-claude-response-body break-words whitespace-normal">`, 1 `<ul class="[li_&amp;]:mb-0 ... list-disc flex flex-col gap-1 pl-8 mb-3 print:block ...">`, 5 `<li class="font-claude-response-body ... pl-2">` (bloc objectif SMART).
- Composants : resume, essentiel, toc ("Au sommaire"), note (x2), **pieges x4 blocs separes** avec icones texte ✖ / ✔ (pas ❌/✅, et le libelle n'est pas dans le span), table th-oui/th-non + col-oui/col-non, cta, faq, **fichly-author seul (photo = initiales "HD", pas d'image)**, readmore (sans `<p>`). Pas de fichly-bio.
- **Ordre different** : intro -> En resume -> Essentiel -> Sommaire (10 ancres) -> H2 1-9 -> **CTA avant la FAQ** -> H2 FAQ -> FAQ (6) -> carte auteur -> A lire aussi.
- H2 : 10 ; H3 : 8 (Plan/Do/Check/Act + "Outils de la phase ..." x4) ; tableaux : 2 ; images : 3, **toutes alt=""** (dont `PDCA_et_DMAIC_-_Clement_Raymond.png`, nom de fichier portant le nom d'une autre personne) ; pas de photo auteur.
- H2 : 1 Qu'est-ce que la methode PDCA ? / 2 Pourquoi utiliser le PDCA en amelioration continue ? / 3 Quand utiliser le PDCA (et quand l'eviter) ? / 4 Les 4 etapes du cycle PDCA / 5 Un exemple concret de PDCA en atelier / 6 PDCA et roue de Deming : quelle difference ? / 7 PDCA ou DMAIC : lequel choisir ? / 8 Les erreurs courantes a eviter / 9 Les outils du PDCA, etape par etape / 10 FAQ.
- FAQ : details/summary, 6 Q = FAQPage (guillemets retires dans le JSON).
- CTA : **`/pages/formation-et-conseil`** (libelle "formation Green Belt Lean Management", target=_blank) — cible differente des autres articles (`formation-lean-green-belt-cpf`). FICHLY5.
- Bio : non (carte auteur seule, sans photo). A lire aussi : Lean Management, VSM, 5S.
- Liens /blogs/nos-articles/ : 10 (7 corps + 3 readmore), 4 cibles (5S, VSM, TRS, lean-management-et-ses-avantages...). Liens internes du corps en `target="_blank"`. Lien d'ancre interne `#dmaic`. **Aucun lien vers l'article DMAIC** malgre la section "PDCA ou DMAIC" ; 5 pourquoi / Ishikawa / Pareto sans lien. /products/ : 1 (guide DMAIC). /pages/ : 1 (formation-et-conseil). Externes : Wikipedia x2, iso.org.
- JSON-LD : Article + FAQPage dans `<p>`. **`publisher.logo.url` = "REMPLACER-PAR-LOGO-FICHLY"** (placeholder) ; pas d'`image`, pas d'`inLanguage` ; mainEntityOfPage en objet WebPage ; datePublished/dateModified "2026-07-27" (publie le 07-28, modifie le 08-24).
- H1 : non. Mots : ~3 300.
- Divers : gras coupe en milieu de mot (`r<strong>oue de Deming</strong>`) ; chiffre non source "9 demarches sur 10" ; `→` en texte dans le lien LinkedIn.

## 9. Green Belt — `green-belt-lean-six-sigma` (1004388712793)
- Template : `article` ; publie (2026-07-27T11:03Z, maj 2026-09-11). Image article : `articles/Articles_Green_Belt_Six_Sigma_-_Fichly_-_Hugo_Duc_a5c2....png` (altText null).
- **Commentaire HTML en tete (~1,5 Ko)** : champs SEO, "POSITIONNEMENT : Fichly ne propose PAS de Green Belt Six Sigma", "A VERIFIER : lien externe France Competences", palette.
- `<style>` : oui, ~58 lignes, ~6 Ko ; **identique a PDCA / TRS-TRG-TRE (V1-author-card)**.
- Wrapper `fichly-article` ; 0 `style=""` ; aucun builder.
- Composants : resume, essentiel (5), toc ("Au sommaire", 7), note (x1 "en toute transparence"), faq (6 ; **le 5e `<details open="">` est ouvert par defaut**), paragraphe de conclusion, cta, fichly-author (photo `www.fichly.com/cdn/shop/files/hugo-duc.jpg` — autre photo/URL que les articles recents ; `.role` en `<div>` ; "Co-fondateur"), readmore (sans `<p>`, titre "A lire aussi"). Pas de bio, pas de pieges.
- Ordre : intro -> En resume -> Essentiel -> Sommaire -> 7 H2 -> FAQ -> conclusion -> CTA -> carte auteur -> A lire aussi.
- H2 : 7 ; H3 : 5 ; tableaux : 1 ; images : 1 (photo auteur, alt renseigne) ; aucun visuel de contenu.
- H2 : 1 Qu'est-ce que la certification Green Belt Lean Six Sigma ? / 2 Six Sigma ou Lean Management : quelle Green Belt choisir ? / 3 Que fait concretement un Green Belt au quotidien ? (**sans id : le lien de sommaire `#role` est casse**) / 4 Le programme et le deroule de la formation Green Belt / 5 Debouches, metiers et salaire apres une Green Belt / 6 Combien coute une Green Belt et comment la financer ? / 7 Questions frequentes.
- FAQ : details/summary, 6 Q ; FAQPage avec reponses raccourcies par rapport au visible.
- CTA : **formulaire externe Tally `https://tally.so/r/eqPKOk`** ("Reservez votre place a une session Green Belt").
- Bio : non (carte auteur seule). A lire aussi : Quelle formation Lean, Financement, Lean Management.
- Liens /blogs/nos-articles/ : 9 (6 corps + 3 readmore), 6 cibles (quelle-formation, lean-management, TRS, VSM, 5S, financement). Ancre "gaspillages du Lean" pointe vers l'article Lean Management et non vers MUDA. /products/ : 1 (`pack-lean-management-green-belt`). /pages/ : 2 (`formation-lean-green-belt-cpf`, `nos-sessions-de-formation`). Externes : francecompetences, moncompteformation, travail-emploi.gouv.fr (ancre "organisme certifie Qualiopi" vers la home du ministere), tally.so, LinkedIn.
- JSON-LD : Article + FAQPage dans `<p>`. headline "... programme, prix et debouches (2026)" **!= titre reel "... programme, prix et CPF 2026"** ; image `www.fichly.com/cdn/shop/files/Green_Belt_-_Lean_Management_Fichly_Formation_QUALIOPI.png` != image article ; datePublished/dateModified 2026-07-27 (maj reelle 09-11) ; `sameAs` en chaine ; logo `logo-fichly.svg` ; pas d'inLanguage.
- H1 : non. Mots : ~2 700.
- Divers : DMAIC decline "Ameliorer" ici vs "Innover" dans l'article DMAIC ; prix en dur (1 500 EUR HT / 2 500 EUR, reste a charge 150 EUR) ; espace residuel `. </p>` dans le CTA ; `→` texte ; emoji 👉.

## 10. Responsable amelioration continue — `responsable-amelioration-continue-fiche-metier` (1003581866329)
- Template : `article` ; publie (2026-06-07T22:21Z, maj 2026-08-24). Image article : `articles/Article._Blog_Fiche_metier_responsable_amelioration_continue_..._a93ab6df-....png` (altText null).
- **Commentaire HTML en tete, malforme** : il contient un `<!-- INFOGRAPHIE -->` imbrique dont le `-->` ferme le commentaire exterieur ; la ligne de fermeture "=====" n'existe pas. Pas de fuite de texte visible, mais le brief (title tag, meta "salaire (45-85K EUR)", placeholder infographie) est dans le source public.
- `<style>` : oui, ~61 lignes, ~6,3 Ko. **Variante "V1 + figure"** : V1-author-card + `.fichly-article img{max-width:100%;...;margin:0 auto}`, `.fichly-article figure`, `.fichly-article figcaption` (gris #6b7280).
- Wrapper `fichly-article` ; 0 `style=""` ; aucun builder.
- Composants : resume, essentiel, toc ("Au sommaire", 9), note (x1), pieges (icones texte ✗ / ✓ + libelles "A eviter :" / "A privilegier :"), cta, faq, fichly-bio (texte) + fichly-author (initiales "HD", sans photo) = double bloc auteur, readmore (sans `<p>`).
- Ordre : intro -> En resume -> Essentiel -> Sommaire -> H2 1-8 -> **CTA avant la FAQ** -> H2 FAQ -> FAQ (6) -> bio -> carte auteur -> A lire aussi.
- H2 : 9 ; H3 : 6 ; tableaux : 2 ; images : 1 (infographie alt="") => 1 alt vide ; pas de photo auteur.
- H2 : 1 Qu'est-ce qu'un responsable amelioration continue ? / 2 Les missions au quotidien / 3 Quelles competences pour ce metier ? / 4 Quelle formation pour acceder au poste ? / 5 Combien gagne un responsable amelioration continue ? / 6 Comment devenir responsable amelioration continue ? / 7 Les pieges a eviter quand on vise ce poste / 8 Les outils Lean qu'il doit maitriser / 9 FAQ. (Libelles du sommaire differents des H2 : "Qu'est-ce que ce metier ?", "Quel salaire pour ce poste ?", "Comment acceder au poste ?" ; ancres correctes.)
- FAQ : details/summary, 6 Q ; FAQPage raccourci, et 2 questions formulees differemment du visible (Q5, Q6).
- CTA : `/pages/formation-et-conseil` ("formation Green Belt Lean Management") ; texte "**5 jours** de formation certifiante" (vs 6 jours / 42 h partout ailleurs), "presentiel ou intra".
- Bio : oui (texte) + carte auteur. A lire aussi : Lean Management, VSM, TRS.
- Liens /blogs/nos-articles/ : 8 (5 corps + 3 readmore), 4 cibles (lean-management x3, VSM, 5S, TRS). Pas de lien vers Green Belt / DMAIC / SMED pourtant cites. /products/ : 1 (fiches-lean, "deck 40 outils du Lean"). /pages/ : 1. Externes : Glassdoor, Indeed, francetravail.fr/accueil (ancre "fiche metier France Travail" vers la home).
- JSON-LD : Article + FAQPage dans `<p>`. **headline "... fiche metier, salaire et formation" != titre reel "... metier, salaire 2026"** ; pas d'`image` ; logo `https://www.fichly.com/logo-fichly.png` (chemin racine, probablement inexistant) ; datePublished/dateModified 2026-06-08 (maj reelle 08-24).
- H1 : non. Mots : ~2 700.
- Divers : **`<figure>` vide** ne contenant qu'une `<figcaption>`, l'image etant dans un `<p>` au-dessus ; fourchette salaire incoherente entre brief (45-85K) et texte (38-85K) ; `→` texte ; emoji 👉.

## 11. Financement formation — `financement-formation-lean-tous-les-dispositifs-2026` (1003250483545)
- Template : `article` ; publie (2026-05-22T14:19Z, maj 2026-07-27). Image article : `articles/Article_Financements_CPF_OPCO_France_Travail_-_..._02a44dbb-....png` (altText null).
- **2 commentaires HTML** : en tete (~1,2 Ko : handle prevu "financement-formation-lean", "Verifier les slugs internes : /vsm-value-stream-mapping, /trs-taux-de-rendement-synthetique, ... /quelle-formation-lean-choisir, /formation-lean-qualiopi-ce-que-le-label-change", "Verifier les pages programmes : /formations, /formations/white-belt ...", "Visuels a integrer (Anais)") et avant le JSON-LD ("SCHEMA MARKUP ... Remplacez les URL d'image/logo par les votres").
- `<style>` : oui, ~56 lignes, ~6 Ko. **Variante "V1-early"** : identique a V1 mais regles indentees de 2 espaces et **sans `th.th-oui` / `th.th-non`**.
- Wrapper `fichly-article`. **Styles inline : 6** (`<p style="margin: 0;">` x3 dans note/pieges, `style="margin-bottom: 0;"` x2 dans CTA/bio, `style="margin: .3em 0 0;"` carte auteur).
- Composants : resume, **toc en `<nav class="fichly-toc">`**, essentiel, note (x2), pieges (x2 : un bloc "⚠️ FNE-Formation", un bloc ❌/✅), faq, cta, bio (texte), readmore (sans `<p>`), fichly-author.
- **Ordre different** : intro (3 `<p>`) -> En resume -> **Sommaire avant Essentiel** -> Essentiel -> H2 1-6 -> H2 FAQ + FAQ -> H2 "Choisir..." (apres la FAQ) -> CTA -> bio -> A lire aussi -> **carte auteur apres le A lire aussi** -> fin div -> commentaire -> `<p>` JSON-LD.
- H2 : 8 ; H3 : 8 ; tableaux : 2 (une cellule tarif vide pour White Belt) ; images : 1 = **photo auteur en data URI base64 (~5 Ko) manifestement corrompue** (en-tete JPEG invalide `/9j/4BBKRklG...`, fragments repetes) => image cassee ; aucun visuel de contenu.
- H2 : 1 Combien coute une formation Lean ? / 2 Les 4 dispositifs pour financer votre formation Lean en 2026 / 3 Quel financement selon votre situation ? / 4 Quel dispositif selon votre belt (White, Yellow, Green, Black) ? / 5 Exemple : comment un chef d'equipe a finance sa Green Belt / 6 Les erreurs a eviter quand on monte un dossier de financement / 7 FAQ : financement d'une formation Lean / 8 Choisir et financer la bonne formation Lean.
- FAQ : details/summary, 6 Q (+ 1 lien dans une reponse) ; FAQPage **sans accents** ("eligible", "a condition", "delivree"...).
- CTA : **lien coupe en deux** : `<a href=".../formations">f</a><a href=".../pages/formation-et-conseil">ormations Lean certifiantes Fichly</a>` + ". ." double point.
- Bio : oui (texte) + carte auteur. A lire aussi : quelle-formation-lean-choisir, formation-lean-qualiopi-..., vsm-value-stream-mapping.
- Liens /blogs/nos-articles/ : 8 (4 corps + 1 FAQ + 3 readmore), 5 cibles. **Slugs probablement faux** (differents des handles reels vus ailleurs) : `quelle-formation-lean-choisir` (reel : `quelle-formation-lean-management-certifiante-choisir`), `vsm-value-stream-mapping` (reel : `value-stream-mapping-definition-et-etapes`), `trs-taux-de-rendement-synthetique` (reel : `taux-de-rendement-synthetique-definition`) ; `formation-lean-qualiopi-ce-que-le-label-change` a verifier (voir QUALIOPI). Liens vers **`/formations`, `/formations/white-belt`, `/formations/black-belt`** (chemins non Shopify, probablement 404). /pages/ : 1 (formation-et-conseil). /products/ : 0. Externes : moncompteformation, via-competences.fr, francetravail.fr. "lisez notre guide quelle formation Lean choisir" sans lien.
- JSON-LD : Article + FAQPage dans `<p>`. headline "Financement d'une formation Lean : le guide complet par situation" != titre ; **mainEntityOfPage `.../financement-formation-lean` (mauvaise URL)** ; logo `https://www.fichly.com/logo.png` ; pas d'image ni description ; datePublished/dateModified "2026-05-29" alors que publie le 2026-05-22.
- H1 : non. Mots : ~3 200.
- Divers : **tarifs contradictoires** (intro et texte : Green Belt 3 000 EUR, tableau : 2 500 EUR / 5 jours, autres articles : 6 jours / 42 h, 1 500-2 500 EUR) ; tirets cadratins supprimes laissant des phrases bancales ("dispositifs publics CPF, OPCO, France Travail et le bon depend...", "L'OPCO Operateur de Competences est...", "...plus financable vous payez tout") ; auteur "depuis plus de trois ans" ; emojis ⚠️ ❌ ✅ 👉.

## 12. QUALIOPI — `formation-lean-qualiopi-ce-que-le-label-change` (1003250286937)
- Template : `article` ; publie (2026-05-22T14:19Z, meme minute que Financement ; maj 2026-08-24). **Titre avec suffixe de marque "| Fichly"** (affiche en H1 par le theme). Image article : `articles/Article_QUALIOPI_formation_Lean_-_..._9e5e0d23-....png` (altText null).
- **2 commentaires HTML** (brief SEO en tete ; "SCHEMA MARKUP ... Remplacez les URL d'image/auteur par les votres" avant le JSON-LD).
- `<style>` : oui, ~58 lignes, ~6 Ko. **V1 indentee** (= V1 avec indentation 2 espaces ; contrairement a Financement, contient th-oui/th-non).
- Wrapper `fichly-article`. **Styles inline : 5** (`margin-bottom:0` / `margin:0` sur des `<p>` de note, CTA, bio, auteur).
- Composants : resume, toc en `<nav>` (avant Essentiel), essentiel, note (x2, dont une avec `<strong>` hors `<p>`), tableau th-oui/th-non + col-oui/col-non (en-tetes avec ✅ / ❌), pieges (❌/✅), faq, cta, bio (texte), readmore, fichly-author.
- Ordre : intro (3 p) -> En resume -> Sommaire -> Essentiel -> H2 1-8 -> H2 FAQ + FAQ -> H2 "Choisir..." -> CTA -> bio -> A lire aussi -> carte auteur -> commentaire -> JSON-LD.
- H2 : 10 ; H3 : 7 ; tableaux : 2 ; images : 1 = **photo auteur `<img alt="...">` sans `src`** (cassee) ; aucun visuel de contenu.
- H2 : 1 Qu'est-ce que la certification QUALIOPI ? / 2 Pourquoi QUALIOPI est obligatoire pour financer une formation Lean / 3 Les 7 criteres du referentiel QUALIOPI / 4 Ce que QUALIOPI garantit, et ce qu'il ne garantit pas / 5 Comment verifier qu'un organisme est vraiment certifie QUALIOPI / 6 5 questions a poser avant d'engager une formation Lean / 7 Les pieges des formations "QUALIOPI" mal calibrees / 8 Ce qui change pour QUALIOPI en 2026 / 9 FAQ : QUALIOPI et formation Lean / 10 Choisir la bonne formation Lean apres avoir verifie QUALIOPI.
- FAQ : details/summary, 6 Q ; FAQPage sans accents et raccourci.
- CTA : `/pages/formation-et-conseil` (Green Belt) "financable OPCO / CPF / **FNE** / France Travail".
- Bio : oui (texte) + carte auteur. A lire aussi : vsm-value-stream-mapping, MUDA, Financement.
- Liens /blogs/nos-articles/ : 8 (5 corps/FAQ + 3 readmore), 4 cibles ; **`vsm-value-stream-mapping` (x2) et `quelle-formation-lean-choisir` probablement faux** (cf. handles reels). /products/ : 1 (pack-lean-management-green-belt). /pages/ : 1. Lien PDF du certificat Qualiopi (CDN). Externes : legifrance.gouv.fr et francecompetences.fr (pages d'accueil).
- JSON-LD : Article + FAQPage dans `<p>`. headline "... ce que le label change vraiment" != titre ; pas d'image/description ; logo `/logo.png` ; datePublished/dateModified "2026-05-29" (publie le 05-22).
- H1 : non. Mots : ~2 900.
- Divers : **contradiction de fond avec l'article Financement** (publie a la meme minute) : QUALIOPI presente le FNE-Formation comme disponible (resume, essentiel, tableau, note Fichly, FAQ, CTA) alors que Financement affirme qu'il n'existe plus depuis fin 2024 ; emojis 👉 ✅ ❌.

## 13. MUDA — `les-muda-les-8-gaspillages-du-lean-guide-complet` (1002388095321)
- Template : `article` ; publie. **publishedAt 2026-03-06T23:00Z anterieur a createdAt 2026-03-24** (date antidatee) ; maj 2026-08-24. Titre en casse "Title Case" ("Les MUDA : Les 8 Gaspillages Du Lean - Guide complet"). Image article : `articles/Les_8_MUDA_-_Gaspillages_Lean_ecc726a8-....png` (altText null).
- `<style>` : oui, ~51 lignes, ~5 Ko ; **identique a TPM / DMAIC (V3a)** ; HTML aere comme DMAIC (reecriture de la meme generation).
- Wrapper `fichly-article` ; 0 `style=""` ; aucun builder.
- Composants : resume, essentiel (5), toc (11), note (x3), td.col-oui/col-non, pieges (❌/✅), faq, cta, bio (photo), readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (11 ancres) -> 11 H2 -> FAQ (7) -> CTA -> bio -> A lire aussi -> fin div -> JSON-LD.
- H2 : 11 ; H3 : 12 (8 MUDA + 4 etapes) ; tableaux : 5 (un `<th></th>` vide en coin) ; **images : 1 seule (photo bio)**, aucun visuel de contenu.
- H2 : 1 Que veut dire Muda ? Definition et origine du mot / 2 Pourquoi connaitre les 8 MUDA ne suffit-il pas a les voir ? / 3 Muda, Mura, Muri : trois pertes a ne pas confondre / 4 Quels sont les 8 MUDA ? La liste, un par un / 5 Quel est le 8e MUDA, et pourquoi manque-t-il presque partout ? / 6 Les 8 wastes en anglais : TIMWOOD, TIMWOODS, DOWNTIME / 7 Reperer trois MUDA dans votre atelier aujourd'hui / 8 Ou chaque MUDA se cache dans vos indicateurs / 9 Les erreurs qui vident une chasse aux MUDA / 10 Les outils Lean qui prolongent la chasse aux MUDA / 11 FAQ : vos questions sur les MUDA.
- FAQ : details/summary, 7 Q = FAQPage.
- CTA : **produit `/products/fiches-lean` (49,90 EUR)** — seul CTA produit du lot.
- Bio : oui (photo). A lire aussi : 5S, VSM, TRS.
- Liens /blogs/nos-articles/ : 10 (7 corps + 3 readmore), 5 cibles (PDCA, TRS, VSM, 5S, DMAIC). /products/ : 2 (fiches-lean x2). /pages/ : 0. Externes : inrs.fr, afnor.org, travail-emploi.gouv.fr, francecompetences.fr (pages d'accueil).
- JSON-LD : Article + FAQPage, **non enveloppe dans `<p>`** (comme DMAIC). headline "Les 8 MUDA : les gaspillages du Lean et comment les reperer en atelier" != titre ; **image JSON-LD = image de l'article (coherent)** ; datePublished 2026-03-06 / dateModified 2026-08-24 coherents avec Shopify.
- H1 : non. Mots : ~5 200 (le plus long).
- Divers : incoherence interne 3 vs 4 familles invisibles au TRS (resume/essentiel : 3 ; section "indicateurs" : 4) ; emoji 👉 ❌ ✅.

## 14. Quelle formation Lean — `quelle-formation-lean-management-certifiante-choisir` (1002140795225)
- Template : **`null` (template par defaut)** ; publie (publishedAt 2026-03-06T23:00Z, meme horodatage que MUDA ; cree 03-06, maj 03-24). Image article : `articles/article_quelle_formation-lean-management-choisir.png` (altText "Formation Lean Management Fichly " avec espace final).
- **Construit avec Bloggle** : pas de `<style>` fichly. Le corps commence par 3 `<script>` externes (`d2xvgzwm836rzd.cloudfront.net/lazysizes-bloggle.min.js`, `cdnjs .../tiny-slider.js`, `.../bloggle-article-min.js`) + 2 `<link rel=stylesheet>` (tiny-slider.css, `blog_styles--50e62f-dc.min.css` sur cloudfront) + `<div id="bloggy--article">`.
- Classes : bggle--block, bggle_text, bggle_table-of-content table-of-content-v2, bggle--anchor, bggle_title, bggle_text-with-image bggle--v2, bggle_image--container(V2), lazybloggle blog__img, bggle_button, bggle_image, bggle_video / bggle--youtube-container, bggle_faq / faq--container / bggle--question / reponse, utilitaires margin_vertical--*, text--1636212959945, button--1636212963117. **Styles inline : ~9** (encadre sommaire `border:2px solid #5222d0; background:#ebecf0`, 3 H2 `font-weight:700 !important`, 3 img `margin-left:auto`, etc.). Couleurs propres : #5222d0 (violet), #ebecf0. Police : aucune declaree dans le corps (CSS Bloggle / theme).
- Ordre : intro (p separes par `<br>`) -> Sommaire Bloggle (16 liens, ancres numeriques `#1697099703851`...) -> **H2 "L'essentiel a retenir"** (liste) -> H2 ... -> H2 "En resume : votre feuille de route" (en fin) -> video YouTube -> H2 FAQ -> FAQ Bloggle. **Pas d'encadre "En resume" en tete, pas de CTA fichly, pas de bio, pas de carte auteur, pas de "A lire aussi", pas de JSON-LD.**
- H2 : 12 reels + **2 `<h2><br></h2>` vides** ; H3 : 10 (4 belts + 6 questions FAQ) ; tableaux : 1 ; images : 6, toutes avec alt, mais **sans attribut `src`** (uniquement `data-src`/`data-srcset` charges par JS lazysizes) ; 1 iframe YouTube.
- H2 : 1 L'essentiel a retenir / 2 Pourquoi faire une formation Lean Management ? / 3 Qu'est-ce que le lean management concretement ? / 4 Formation Lean management vs Formation Lean Six Sigma : Les differences / 5 Les 5 principes fondamentaux du lean management expliques simplement / 6 Les outils essentiels que vous maitriserez en formation Lean Management / 7 Quels types de formations lean certifiantes choisir ? / 8 Comment identifier la formation lean qui vous correspond ? / 9 Les formations Lean Management chez Fichly / 10 Les solutions de financement pour vos formation Lean management certifiantes / 11 En resume : votre feuille de route vers l'amelioration continue / 12 Questions frequentes sur la formation lean management.
- FAQ : **H3 + `<div class="reponse">` (pas de details/summary)**, 6 Q, pas de FAQPage.
- CTA : bouton Bloggle "Decouvrir les formations Fichly" -> `/pages/formation-et-conseil` (au milieu de l'article) + un lien texte vers la meme page.
- Liens /blogs/nos-articles/ : 2 (VSM, TRS, en target=_blank). /pages/ : 2 (formation-et-conseil x2). /products/ : 0.
- JSON-LD : **aucun**.
- H1 : non. Mots : ~2 300.
- Divers : incoherences de contenu (FAQ : "White Belt = formation de 3 jours pour devenir equipier" vs texte : 1 jour d'initiation ; Green Belt 5 j / Black Belt 7 j vs 6 j / 42 h dans les articles recents ; FNE-Formation presente comme disponible ; les "5 principes" different entre liste et FAQ) ; fautes ("Nous sommes connu", "certfiants", "N'hesitez a nous contacter", doubles espaces) ; `<br>` en masse ; emoji 🚀.

## 15. VSM — `value-stream-mapping-definition-et-etapes` (998863503705)
- Template : **`bloggle-custom`** alors que le corps n'a plus aucune balise Bloggle (reecrit en fichly V1) ; publie (publishedAt 2025-03-22T23:00Z, anterieur a createdAt 2025-03-23 ; maj 2026-08-17). Image article : `articles/Qu_est-ce_que_la_VSM_-_Fichly.png` (altText null).
- `<style>` : oui, ~58 lignes, ~6 Ko ; **V1-author-card** (identique a PDCA / TRS-TRG-TRE / Green Belt). HTML aere.
- Wrapper `fichly-article` ; 0 `style=""` ; aucun builder dans le corps.
- Composants : resume, essentiel, toc (11), note (x1), pieges (❌/✅), faq, cta, bio (texte) + fichly-author, readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (11 ancres) -> 11 H2 -> FAQ (6) -> CTA -> bio -> carte auteur -> A lire aussi -> fin div -> JSON-LD.
- H2 : 11 ; H3 : 8 (abreviations + 7 etapes) ; tableaux : 5 ; images : 3 (2 schemas `fichly-symboles-vsm.png`, `fichly-vsm-simplifiee.png` avec alt descriptif + **photo auteur `src="REMPLACER-PAR-PHOTO-HUGO"`** = image cassee) ; 0 alt vide.
- H2 : 1 Une VSM, ou cartographie des flux, c'est quoi exactement / 2 VSM ou cartographie de processus : ce n'est pas le meme outil / 3 Les six notions a maitriser avant de dessiner / 4 Les symboles de la VSM : le tableau complet / 5 Les 7 etapes pour cartographier un flux reel / 6 Exemple chiffre : un flux de bout en bout / 7 La faire sur une feuille A3, sans logiciel ni modele / 8 Etat futur : ce qu'on change, et dans quel ordre / 9 Les pieges qui transforment une VSM en joli dessin / 10 Les cas ou la VSM ne sert a rien / 11 FAQ : vos questions sur la Value Stream Mapping.
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : **`/pages/formation-yellow-belt-lean-management-fichly`** (Yellow Belt, FICHLY5) — seule occurrence de cette cible.
- Bio : oui (texte) + carte auteur. A lire aussi : MUDA, TRS, 5S.
- Liens /blogs/nos-articles/ : 8 (5 corps + 3 readmore), 6 cibles (TRS, MUDA, **`methode-a3-lean-resolution-probleme`** — pas d'article A3 dans la liste, probablement 404 —, SMED, DMAIC, 5S). /pages/ : 1. /products/ : 0. Externe : boutique.afnor.org (home, pour "NF EN ISO 216").
- JSON-LD : Article + FAQPage, **non enveloppe dans `<p>`**. datePublished "2026-08-24" alors que publie le 2025-03-22 ; dateModified "2026-08-24" posterieur a la derniere maj Shopify (08-17) ; image JSON-LD = schema du corps `fichly-symboles-vsm.png` != image article.
- H1 : non. Mots : ~3 900.
- Divers : **placeholders non remplis visibles par le lecteur** : "un flux de [secteur] a cinq postes", tableau d'exemple entierement en "[C/T poste 1]", "[encours 1]", "[attente 1]"... (14 cellules), "La duree constatee sur les chantiers Fichly est de [duree du chantier]." ; **bug CSS V1** : l'Essentiel contient des `<strong>` dans les `<li>` alors que la regle V1 `.fichly-essentiel strong{display:block;font-size:1.15em}` (sans le correctif `li strong{display:inline}`) les passe en bloc ; cellules `<th> </th>` / `<td> </td>` avec espace insecable ; emoji 👉 ❌ ✅.

## 16. TRS — `taux-de-rendement-synthetique-definition` (998807109977)
- Template : `article` ; publie (publishedAt 2025-03-16T23:00Z, anterieur a createdAt 2025-03-17 ; maj 2026-08-24). Image article : `articles/Qu_est-ce_que_le_TRS_-_Fichly.png` (altText null).
- `<style>` : oui, ~51 lignes, ~5 Ko ; **V3a** (identique a TPM / DMAIC / MUDA). HTML aere.
- Wrapper `fichly-article` ; 0 `style=""` ; aucun builder.
- Composants : resume, essentiel (5), toc (13), note (x3), pieges (❌/✅), faq, cta, bio (photo), readmore. Tableau avec `rowspan`.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (13 ancres) -> 13 H2 -> FAQ (6) -> CTA -> bio -> A lire aussi -> fin div -> JSON-LD.
- H2 : 13 ; H3 : 5 (etapes) ; tableaux : 4 ; **images : 1 (photo bio)**, aucun visuel de contenu.
- H2 : 1 Le TRS : ce que le calcul mesure vraiment / 2 Quelle est la formule du temps requis du TRS ? / 3 Pourquoi calculer son TRS ? / 4 Comment calculer le TRS pas a pas ? / 5 La methode rapide de calcul du TRS, et ce qu'elle masque / 6 Les six grandes pertes derriere un TRS / 7 Quel est un bon TRS ? / 8 OEE, OOE, TEEP : les equivalents anglais / 9 Ce qu'un TRS autorise a decider / 10 Relever les donnees de TRS sans fausser le calcul / 11 Les erreurs qui faussent un calcul de TRS / 12 Les outils qui prennent le relais apres le TRS / 13 FAQ : vos questions sur le calcul du TRS.
- FAQ : details/summary, 6 Q = FAQPage (dont "Comment calculer le taux de service TRS ?").
- CTA : `/pages/partenaires-logiciels`.
- Bio : oui (photo). A lire aussi : MUDA, VSM, DMAIC.
- Liens /blogs/nos-articles/ : 7 (4 corps + 3 readmore), 4 cibles (MUDA, VSM, 5S, DMAIC). **Pas de lien vers l'article TRS/TRG/TRE** (TRG traite en FAQ) ni vers TPM / MTBF / SMED. /products/ : 1 (fiches-lean, 49,90 EUR). /pages/ : 1. Externes : boutique.afnor.org (NF E60-182), afnor.org, norminfo (NF EN 13306).
- JSON-LD : Article + FAQPage, **non enveloppe dans `<p>`**. headline "Calcul du TRS : formule, methode et exemple complet" != titre ; pas d'`image` ; dates coherentes (2025-03-16 / 2026-08-24).
- H1 : non. Mots : ~4 300.
- Divers : emoji 👉 ❌ ✅. Rien de casse.

## 17. 5S — `la-methode-5s-definition-et-exemples` (998359466329)
- Template : `article` ; publie (publishedAt 2025-03-01T23:00Z, anterieur a createdAt 2025-03-04 ; maj 2026-08-24). Image article : `articles/Article_5S_-_FICHLY.png` (altText null).
- `<style>` : oui, ~51 lignes, ~5 Ko ; **V3a**. HTML aere.
- Wrapper `fichly-article` ; 0 `style=""` ; aucun builder.
- Composants : resume, essentiel (5), toc (11), note (x2), **pieges x8 blocs** (1 avec libelles texte "Ce qu'on entend / Ce qui manque", 7 blocs d'une erreur chacun ❌/✅ en 2 `<p>`), tableau grille d'audit th-oui/th-non + col-oui/col-non, faq, cta, bio (photo), readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (11 ancres) -> 11 H2 -> FAQ (6) -> CTA -> bio -> A lire aussi -> fin div -> JSON-LD.
- H2 : 11 ; H3 : 9 ; tableaux : 4 ; **images : 1 (photo bio)**, aucun visuel de contenu.
- H2 : 1 C'est quoi les 5S ? Definition et origine / 2 Le 5S n'est pas du rangement : le malentendu du menage / 3 A quoi sert le 5S, et pourquoi vient-il en premier ? / 4 Quel est l'ordre des 5S ? Les cinq etapes une par une / 5 Un exemple de methode 5S sur une zone d'atelier / 6 La grille d'audit 5S : noter une zone sur vingt points / 7 Pourquoi un 5S retombe-t-il au sixieme mois ? / 8 Les erreurs qui font echouer un 5S / 9 Le vocabulaire du 5S en anglais / 10 Les outils qui prolongent le 5S / 11 FAQ : vos questions sur les 5S.
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : **produit `/products/le-guide-du-5s-en-20-fiches` (29,90 EUR, FICHLY5)**.
- Bio : oui (photo). A lire aussi : DMAIC, PDCA, MUDA.
- Liens /blogs/nos-articles/ : 9 (6 corps + 3 readmore), 4 cibles (MUDA, PDCA, TRS, DMAIC) ; pas de lien vers SMED ni TPM. /products/ : 2 (guide 5S x2). /pages/ : 0. Externes : code.travail.gouv.fr (R4224-18), inrs.fr, norminfo.afnor.org, travail-emploi.gouv.fr.
- JSON-LD : Article + FAQPage, **non enveloppe dans `<p>`**. headline "La methode 5S : definition, les 5 etapes et la grille d'audit" != titre ; image = image de l'article (coherent) ; dates coherentes (2025-03-01 / 2026-08-24).
- H1 : non. Mots : ~5 000.
- Divers : "coup d'oeil" / "mise en oeuvre" (oe au lieu de œ) ; emoji 👉 ❌ ✅. Rien de casse.

---
# BROUILLONS

## 18. [BROUILLON] Lean Manufacturing — `lean-manufacturing-definition-principes-outils` (1006062141785)
- Template : **`null` (template par defaut, pas `article`)** ; brouillon (cree 2026-09-30T20:42Z, maj 20:57Z). Image article : `articles/lean-manufacturing-2-cinq-principes.png` (altText renseigne).
- `<style>` : oui, ~51 lignes, ~5 Ko ; **V3a** (pas de regle img/figure/video). HTML aere.
- Wrapper `fichly-article`. **Styles inline : 24** (8 `<figure style="margin:1.8em 0;">`, 8 `<video style="width:100%;height:auto;border-radius:12px;">`, 8 `<img style="width:100%;height:auto;">`) — compensent l'absence de regles media dans le style V3a.
- **Medias nouveaux** : 8 `<figure><video autoplay muted loop playsinline preload="metadata" poster=".png" aria-label="..."><source .mp4><img .gif (fallback, alt)></video></figure>` (animations). Aucun autre article n'utilise `<video>`.
- Composants : resume, essentiel (5), toc (12), note (x1), pieges (❌/✅), faq, cta, bio (photo), readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (12 ancres) -> 12 H2 -> FAQ (8) -> CTA -> bio -> A lire aussi -> fin div -> JSON-LD.
- H2 : 12 ; H3 : 11 ; tableaux : 4 ; images : 9 `<img>` (8 GIF de repli avec alt + photo bio) ; 8 videos ; 0 alt vide.
- H2 : 1 Qu'est-ce que le Lean Manufacturing ? Definition / 2 Lean Manufacturing, Lean Management, Lean : quelle difference ? / 3 D'ou vient le Lean Manufacturing ? Du systeme Toyota au Lean / 4 Les 5 principes du Lean Manufacturing / 5 Juste-a-temps et jidoka : les deux piliers du systeme Toyota / 6 Les gaspillages : ce que le Lean cherche a supprimer / 7 Les outils du Lean Manufacturing, et quand les utiliser / 8 Par ou commencer : une demarche en 5 etapes / 9 Exemple chiffre : diviser le delai sans toucher aux machines / 10 Les erreurs qui font echouer une demarche Lean Manufacturing / 11 Limites et critiques : ce que le Lean ne doit pas devenir / 12 FAQ : vos questions sur le Lean Manufacturing.
- FAQ : details/summary, 8 Q = FAQPage (liens retires dans le JSON).
- CTA : produit `/products/fiches-lean` (49,90 EUR) + `/pages/templates` ("templates gratuits").
- Bio : oui (photo). A lire aussi : MUDA, VSM, 5S.
- Liens /blogs/nos-articles/ : 16 (13 corps + 3 readmore), **10 cibles** (VSM, PDCA, MUDA, 5S, SMED, TPM, TRS, 5 pourquoi, DMAIC, Green Belt) — le maillage le plus dense du lot. /products/ : 1. /pages/ : 1 (templates). **Aucun lien externe** (ANACT citee sans lien).
- JSON-LD : Article + FAQPage, non enveloppe dans `<p>`. **datePublished/dateModified "2026-10-05" (date future)** ; image `files/lean-manufacturing-2-cinq-principes.png` (poster du corps ; meme visuel que l'image article mais autre URL `articles/...`).
- H1 : non. Mots : ~5 300.
- Divers : emoji 👉 ❌ ✅. Calculs de l'exemple (loi de Little) coherents.

## 19. [BROUILLON] Pareto — `diagramme-de-pareto-methode-exemple` (1005543948633)
- Template : `null` ; brouillon (cree 2026-09-11). **Pas d'image article** (`image: null`).
- **Commentaire HTML "FICHE DE PRODUCTION" en tete (~2,2 Ko)** : donnees Ahrefs (volume, KD, DR des concurrents, "fichly.com (DR 7)"), verdict GO, lien montant obligatoire, title/meta, decisions editoriales, "Gabarit et bloc style repris a l'identique de l'article TPM", "Hugo publie".
- `<style>` : oui, ~51 lignes, ~5 Ko ; **V3a (identique TPM)**, comme annonce.
- Wrapper `<div class="fichly-article" lang="fr">` ; 0 `style=""`. **Apostrophes typographiques ’** dans tout le texte (les autres articles utilisent l'apostrophe droite).
- Composants : resume, essentiel (5), toc (8), note (x1), td.col-oui (x3), pieges (❌/✅), faq, cta, bio (photo), readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (8) -> 8 H2 -> FAQ (5) -> CTA -> bio -> A lire aussi -> fin div -> `<p>` JSON-LD.
- H2 : 8 ; H3 : 5 ; tableaux : 2 ; images : 1 (photo bio) ; aucun visuel.
- H2 : 1 Qu'est-ce qu'un diagramme de Pareto ? / 2 Comment construire un diagramme de Pareto : l'exemple de calcul / 3 Occurrences, temps d'arret ou cout : l'unite qui change tout / 4 La qualite du releve decide de la qualite du classement / 5 Quand la regle des 80/20 ne s'applique pas / 6 Les erreurs qui faussent un diagramme de Pareto / 7 Quels outils prendre apres le diagramme de Pareto / 8 FAQ : vos questions sur le diagramme de Pareto.
- FAQ : details/summary, 5 Q = FAQPage.
- CTA : produit `/products/le-guide-de-la-resolution-de-problemes-dmaic` (libelle "Le guide de la resolution de problemes en 20 fiches").
- Bio : oui (photo). A lire aussi : DMAIC, 5 pourquoi, PDCA.
- Liens /blogs/nos-articles/ : 9 (6 corps + 3 readmore), 6 cibles (TRS, MUDA, PDCA, 5 pourquoi, DMAIC, MTBF/MTTR). /products/ : 2. /pages/ : 0. Externes : gallica.bnf.fr, norminfo (NF EN 13306), inrs.fr (ED 6163), legifrance. Ishikawa cite sans lien.
- JSON-LD : Article + FAQPage **dans un `<p>`** ; pas d'image ; datePublished/dateModified "2026-09-11" (article non publie).
- H1 : non. Mots : ~2 100.
- Divers : chiffres du tableau coherents ; emoji 👉 ❌ ✅.

## 20. [BROUILLON] Gemba — `gemba-walk-tournee-atelier-methode` (1005543915865)
- Template : `null` ; brouillon (cree 2026-09-11). **Pas d'image article.**
- **Commentaire HTML "brief" en tete (~2,8 Ko)** : brief Buffer du 16/09, bascule de mot-cle, releve Ahrefs + DR concurrents, contre-angle, title/meta, decisions ; mentionne explicitement **"Aucun lien vers l'article fantome 'lean management et ses avantages'"** (cible pourtant liee par PDCA, Green Belt et Responsable AC) et "zero tiret cadratin, verifie par grep".
- `<style>` : V3a (identique TPM), ~51 lignes. Wrapper `fichly-article lang="fr"` ; 0 `style=""`.
- Composants : resume, essentiel (5), toc (7), faq, cta, bio (photo), readmore. Pas de note ni de pieges.
- Ordre : intro (2 `<p>`) -> En resume -> Essentiel -> Sommaire (7) -> 7 H2 -> FAQ (5) -> CTA -> bio -> A lire aussi -> `<p>` JSON-LD.
- H2 : 7 ; H3 : 1 ("Les huit questions a poser") ; tableaux : 3 ; images : 1 (photo bio).
- H2 : 1 Qu'est-ce que le gemba, et le gemba walk ? / 2 Gemba, genba, genchi genbutsu : les correspondances / 3 Les trois raisons de faire un gemba walk / 4 Ce qu'une tournee doit produire / 5 La trame d'une tournee de trente minutes / 6 L'effet observateur / 7 FAQ : vos questions sur le gemba.
- FAQ : details/summary, 5 Q = FAQPage.
- CTA : produit `/products/fiches-lean` ("les 40 outils du Lean").
- Bio : oui (photo). A lire aussi : 5S, 5 pourquoi, MUDA.
- Liens /blogs/nos-articles/ : 7 (4 corps + 3 readmore), 5 cibles (5 pourquoi, 5S, PDCA, TRS, MUDA). /products/ : 2 (fiches-lean x2). Externes : anact.fr, code.travail.gouv.fr (L4121-1), inrs.fr.
- JSON-LD : Article + FAQPage dans `<p>` ; pas d'image ; dates 2026-09-11.
- H1 : non. Mots : ~1 900.

## 21. [BROUILLON] Obeya — `obeya-salle-pilotage-visuel` (1005543883097)
- Template : `null` ; brouillon (cree 2026-09-11). **Pas d'image article.**
- **Commentaire HTML brief en tete (~1,7 Ko)** (brief du 18/09, Ahrefs, DR concurrents, title/meta, decisions dont "Aucun lien vers iObeya : partenaire").
- `<style>` : V3a, ~51 lignes. Wrapper `fichly-article lang="fr"` ; 0 `style=""`.
- Composants : resume, essentiel (5), toc (8), note (x1), pieges (❌/✅), faq, cta, bio (photo), readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (8) -> 8 H2 -> FAQ (6) -> CTA -> bio -> A lire aussi -> `<p>` JSON-LD.
- H2 : 8 ; H3 : 0 ; tableaux : 3 ; images : 1 (photo bio).
- H2 : 1 Qu'est-ce qu'une Obeya, et que veut dire le mot ? / 2 Quelles zones afficher dans une Obeya ? / 3 A quelle frequence se tenir devant, et combien de temps ? / 4 Comment savoir qu'une Obeya est morte ? / 5 Comment installer une salle Obeya en quatre temps / 6 Obeya, oobeya, war room : le tableau de correspondance / 7 Les outils qui font tenir une Obeya / 8 FAQ : vos questions sur l'Obeya. (Libelles de sommaire legerement differents des H2, ancres OK.)
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : produit `/products/fiches-lean`.
- Bio : oui (photo). A lire aussi : PDCA, TRS, 5 pourquoi.
- Liens /blogs/nos-articles/ : 8 (5 corps + 3 readmore), 5 cibles (TRS, PDCA, 5 pourquoi, Responsable AC, 5S). /products/ : 2 (fiches-lean x2). Externes : norminfo (NF EN 13306), inrs.fr (home, presentee comme "recommandations d'affichage en production"), anact.fr, travail-emploi.gouv.fr.
- JSON-LD : Article + FAQPage dans `<p>` ; pas d'image ; dates 2026-09-11.
- H1 : non. Mots : ~2 000.

## 22. [BROUILLON] Takt time — `takt-time-calcul-definition` (1005543850329)
- Template : `null` ; brouillon (cree 2026-09-11). **Pas d'image article.**
- **Commentaire HTML "FICHE DE PRODUCTION" (~2,8 Ko)** : Ahrefs, DR concurrents, longueur cible 1 000-1 200 mots, decisions ; precise que la bio et la carte auteur sont "fusionnees dans .fichly-bio" et qu'aucune classe `.fichly-author` n'a ete inventee.
- `<style>` : V3a, ~51 lignes. Wrapper `fichly-article lang="fr"` ; 0 `style=""`.
- Composants : resume, essentiel (4 puces), toc (5), note (x1, formule), td.col-oui/col-non, faq, cta, bio (photo), readmore. Pas de pieges (assume dans le brief).
- Ordre : intro -> En resume -> Essentiel -> Sommaire (5) -> 5 H2 -> FAQ (5) -> CTA -> bio -> A lire aussi -> `<p>` JSON-LD.
- H2 : 5 ; H3 : 1 ; tableaux : 3 ; images : 1 (photo bio).
- H2 : 1 Qu'est-ce que le takt time ? / 2 Comment calculer le takt time ? / 3 Takt time et temps de cycle : la comparaison qui decide / 4 Takt time, cycle time, lead time : le lexique / 5 FAQ : vos questions sur le takt time.
- FAQ : details/summary, 5 Q = FAQPage.
- CTA : `/pages/partenaires-logiciels` (pilotage du TRS).
- Bio : oui (photo). A lire aussi : TRS, VSM, TPM.
- Liens /blogs/nos-articles/ : 7 (4 corps + 3 readmore), 4 cibles (MUDA, TRS, VSM, TPM). /products/ : 1 (fiches-lean). /pages/ : 1. Externes : code.travail.gouv.fr x3 (L3121-1, L3121-16, L3121-27).
- JSON-LD : Article + FAQPage dans `<p>` ; pas d'image ; dates 2026-09-11.
- H1 : non. Mots : ~1 400 (le plus court des brouillons).
- Divers : calculs coherents (95 s ; 13 s x 480 = 1 h 44).

## 23. [BROUILLON] Kanban — `kanban-de-production-boucle-dimensionnement` (1005543817561)
- Template : `null` ; brouillon (cree 2026-09-11). **Pas d'image article.**
- **Commentaire HTML brief (~2,6 Ko)** : Ahrefs, "fichly.com est a DR 7", verdict STOP sur "kanban" puis bascule, title/meta, decisions ("Zero tiret cadratin, zero balise h1, zero JavaScript").
- `<style>` : V3a, ~51 lignes. Wrapper `fichly-article lang="fr"` ; 0 `style=""`.
- Composants : resume, essentiel (5), toc (8), note (x1), td.col-oui/col-non, pieges (❌/✅), faq, cta, bio (photo), readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (8) -> 8 H2 -> FAQ (5) -> CTA -> bio -> A lire aussi -> `<p>` JSON-LD.
- H2 : 8 ; H3 : 0 ; tableaux : 3 ; images : 1 (photo bio).
- H2 : 1 Qu'est-ce qu'un kanban de production ? / 2 Kanban de production ou tableau kanban de projet ? / 3 Comment fonctionne une boucle kanban en atelier ? / 4 Comment calculer le nombre de cartes d'un kanban de production ? / 5 Exemple de dimensionnement, pas a pas / 6 Les erreurs qui font derailler un kanban de production / 7 Les outils qui font tenir un kanban de production / 8 FAQ : vos questions sur le kanban.
- FAQ : details/summary, 5 Q = FAQPage.
- CTA : produit `/products/fiches-lean`.
- Bio : oui (photo). A lire aussi : VSM, SMED, MUDA.
- Liens /blogs/nos-articles/ : 7 (4 corps + 3 readmore), 4 cibles (SMED, PDCA, VSM, MUDA). /products/ : 2. Externes : code.travail.gouv.fr (R4541-9), inrs.fr (manutention), norminfo (NF EN 13306).
- JSON-LD : Article + FAQPage dans `<p>` ; pas d'image ; dates 2026-09-11.
- H1 : non. Mots : ~1 900.
- Divers : **placeholder non rempli dans le texte : "une ligne d'assemblage en [secteur]"** ; calculs coherents.

## 24. [BROUILLON] AMDEC — `amdec-methode-cotation-criticite` (1005421429081)
- Template : `null` ; brouillon (cree 2026-09-04). **Pas d'image article.** Corps de 63,6 Ko (le plus lourd), dont **un commentaire HTML de 18,2 Ko** en tete (titre, title tag, meta, SUMMARY, TAGS, releves Ahrefs "NON REJOUE", "Keywords Explorer en panne", verdict PRUDENCE, bascule d'angle, 8 decisions redactionnelles, concurrents nommes).
- `<style>` : oui, 59 lignes, ~4,6 Ko. **Variante "V1 + justify"** : V1-author-card (selecteurs `.fichly-toc strong` / `.fichly-essentiel strong{display:block}` sans correctif `li strong`, bio simple, carte `.fichly-author`) + `.fichly-article > p{text-align:justify;hyphens:auto}` (sans !important, contrairement a SMED).
- Wrapper `fichly-article lang="fr"` ; 0 `style=""`.
- Composants : resume, essentiel, toc (10), note (x2), pieges (❌/✅), faq, cta, **fichly-bio (texte) + fichly-author** (double bloc auteur), readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (10, ancres OK) -> 10 H2 -> FAQ (6) -> CTA -> bio -> carte auteur -> A lire aussi -> JSON-LD (non enveloppe dans `<p>`).
- H2 : 10 ; H3 : 7 ; tableaux : 5 ; images : 2, **toutes deux a src placeholder** : `src="VISUEL-A-CREER"` (schema des 3 notes, alt renseigne) et `src="REMPLACER-PAR-PHOTO-HUGO"` (carte auteur).
- H2 : 1 AMDEC : definition, sigle et norme de reference / 2 Quels sont les differents types d'AMDEC ? / 3 A quoi sert l'AMDEC moyen en maintenance ? / 4 Comment coter la frequence, la gravite et la detection / 5 A partir de quelle criticite faut-il agir ? / 6 Conduire la seance et sortir trois actions datees / 7 Les erreurs qui vident une AMDEC de son interet / 8 Les outils qui prolongent une AMDEC / 9 Le vocabulaire de l'AMDEC en anglais / 10 FAQ : vos questions sur l'AMDEC.
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : `/pages/partenaires-logiciels` (pilotage du TRS / historique d'arrets).
- Bio : oui (texte) + carte auteur. A lire aussi : MTBF/MTTR, Types de maintenance, TPM.
- Liens /blogs/nos-articles/ : 12, 7 cibles (5 pourquoi, DMAIC, PDCA, MTBF/MTTR, TRS, TPM, Types de maintenance). /products/ : 1 (fiches-lean). /pages/ : 1. Externes : norminfo (NF EN 13306, PR NF EN 60812), Legifrance.
- JSON-LD : Article + FAQPage (bare). **`image: "VISUEL-A-CREER"`** (placeholder) ; datePublished/dateModified "2026-09-10".
- H1 : non. Mots visibles : ~4 800 (tableaux compris).
- Divers : **placeholders non remplis dans le texte visible** : "[nombre d'arrets releves]", "Sur un [famille d'equipement] en [secteur]", "Si votre equipe traite [capacite d'action] actions par trimestre" ; **bug CSS V1** : `<strong>` dans les `<li>` de l'Essentiel rendus en bloc (1,15em) faute du correctif `li strong` ; emoji 👉 ❌ ✅.

## 25. [BROUILLON] QQOQCCP — `qqoqccp-methode-cadrer-un-probleme` (1005421363545)
- Template : `null` ; brouillon (cree 2026-09-04). **Pas d'image article.** Pas de commentaire HTML (commence directement par `<style>`).
- `<style>` : 59 lignes, ~4,6 Ko ; **"V1 + justify"** (identique a AMDEC). HTML aere. Wrapper `fichly-article lang="fr"` ; 0 `style=""`.
- Composants : resume, essentiel (5, `<strong>` dans les `<li>` => bug CSS V1), toc (9), note (x2, dont le gabarit de phrase de probleme), pieges (❌/✅), faq, cta, **fichly-bio (texte) + fichly-author**, readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (9) -> 9 H2 -> FAQ (6) -> CTA -> bio -> carte auteur -> A lire aussi -> JSON-LD (bare).
- H2 : 9 ; H3 : 5 ; tableaux : 3 ; images : 2, **src placeholders** (`VISUEL-A-CREER` avec alt ; `REMPLACER-PAR-PHOTO-HUGO` carte auteur).
- H2 : 1 QQOQCCP : definition et les sept questions / 2 QQOQCP ou QQOQCCP : pourquoi deux graphies / 3 Quelles sont les 7 questions du Quintilien ? / 4 Dans quelles situations appliquer cette methode ? / 5 Comment cadrer un probleme en vingt minutes / 6 Les erreurs qui rendent un QQOQCCP inutile / 7 Ou s'arrete le QQOQCCP et quels outils prennent le relais / 8 Le vocabulaire du QQOQCCP en anglais / 9 FAQ : vos questions sur le QQOQCCP.
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : produit `/products/le-guide-de-la-resolution-de-problemes-dmaic` ("guide ... en 20 fiches").
- Bio : oui (texte) + carte auteur. A lire aussi : 5 pourquoi, DMAIC, PDCA.
- Liens /blogs/nos-articles/ : 8 (5 corps + 3 readmore), 4 cibles (Green Belt, 5 pourquoi x2, DMAIC, PDCA). /products/ : 2. Externes : code.travail.gouv.fr (R4121-1), norminfo (ISO 9000), francecompetences (RS7114). Ishikawa / Pareto / AMDEC cites sans lien.
- JSON-LD : Article + FAQPage (bare) ; **`image: "VISUEL-A-CREER"`** ; dates 2026-09-09.
- H1 : non. Mots : ~3 300.
- Divers : **placeholder non rempli "Posez [duree de la reunion de cadrage] au planning"** ; les crochets de la phrase-gabarit ("[date de premiere observation]", "[type de defaut]"...) sont eux volontaires (champs a remplir par le lecteur) ; emoji 👉 ❌ ✅.

## 26. [BROUILLON] Ishikawa — `diagramme-ishikawa-6m-methode-exemple` (1005421265241)
- Template : `null` ; brouillon (cree 2026-09-04). **Pas d'image article.** Corps 54,9 Ko dont **commentaire HTML de 15,3 Ko** (titre, title tag, meta, SUMMARY, TAGS, analyse mot-cle, "Keywords Explorer en panne", 8 decisions, "Trois web_fetch de concurrents").
- `<style>` : 59 lignes ; **"V1 + justify", octet pour octet identique a AMDEC** (et QQOQCCP). HTML aere. Wrapper `fichly-article lang="fr"` ; 0 `style=""`.
- Composants : resume, essentiel (5, `<strong>` dans les `<li>` => bug CSS V1), toc (10), note (x1), td.col-non (x3), pieges (❌/✅), faq, cta, **fichly-bio (texte) + fichly-author**, readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (10) -> 10 H2 -> FAQ (6) -> CTA -> bio -> carte auteur -> A lire aussi -> JSON-LD (bare).
- H2 : 10 ; H3 : 6 ; tableaux : 4 ; images : 2, **src placeholders** (`VISUEL-A-CREER` diagramme rempli, alt renseigne ; `REMPLACER-PAR-PHOTO-HUGO`).
- H2 : 1 Diagramme d'Ishikawa : definition et principe / 2 5 M, 6 M ou 7 M : quelle variante utiliser chez vous / 3 Quand utiliser le diagramme d'Ishikawa / 4 Mener une seance d'Ishikawa en 6 etapes / 5 Un diagramme d'Ishikawa rempli, branche par branche / 6 Ce qu'on fait du diagramme le lendemain / 7 Les erreurs qui vident une seance d'Ishikawa / 8 Les outils qui prennent le relais / 9 Le vocabulaire de l'Ishikawa en anglais / 10 FAQ : vos questions sur le diagramme d'Ishikawa.
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : produit `/products/le-guide-de-la-resolution-de-problemes-dmaic`.
- Bio : oui (texte) + carte auteur. A lire aussi : DMAIC, 5 pourquoi, PDCA.
- Liens /blogs/nos-articles/ : 9, 4 cibles (5S, 5 pourquoi, DMAIC, PDCA). /products/ : 2. /pages/ : 0. Externes : code.travail.gouv.fr (L4121-2, R4121-1), norminfo (ISO 9000).
- JSON-LD : Article + FAQPage (bare) ; **`image: "VISUEL-A-CREER"`** ; dates 2026-09-08.
- H1 : non. Mots : ~4 100.
- Divers : **placeholders visibles dans l'exemple fil rouge** : "le taux de rebut de la ligne [famille d'equipement], en [secteur], a augmente de [ecart constate] depuis [duree constatee]" ; emoji 👉 ❌ ✅.

## 27. [BROUILLON] RACI — `matrice-raci-definition-exemple-methode` (1005421232473)
- Template : `null` ; brouillon (cree 2026-09-04). **Pas d'image article.** Corps 52,7 Ko dont **commentaire HTML de 13 Ko** (titre, title tag, meta, SUMMARY, mot-cle, decisions).
- `<style>` : 59 lignes ; **"V1 + justify", identique octet pour octet a AMDEC / Ishikawa / QQOQCCP**. HTML aere. Wrapper `fichly-article lang="fr"` ; 0 `style=""`.
- Composants : resume, essentiel (5, `<strong>` dans les `<li>` => bug CSS V1), toc (10), note (x2), pieges (❌/✅), faq, cta, **fichly-bio (texte) + fichly-author**, readmore.
- Ordre : intro -> En resume -> Essentiel -> Sommaire (10) -> 10 H2 -> FAQ (6) -> CTA -> bio -> carte auteur -> A lire aussi -> JSON-LD (bare).
- H2 : 10 ; H3 : 10 ; tableaux : 4 ; images : 2, **src placeholders** (`VISUEL-A-CREER`, `REMPLACER-PAR-PHOTO-HUGO`).
- H2 : 1 Qu'est-ce que la matrice RACI ? / 2 Les quatre lettres de RACI, et celle qui est presque toujours mal traduite / 3 A quoi sert une matrice RACI en production et en amelioration continue ? / 4 Comment faire une matrice RACI en une reunion d'une heure / 5 Deux personnes se declarent A sur la meme tache : comment trancher ? / 6 Quelle est la difference entre RASCI et RACI ? / 7 Les cinq erreurs qui rendent une matrice RACI inutile / 8 Les outils qui completent une matrice RACI / 9 Le vocabulaire du RACI en anglais / 10 FAQ : vos questions sur la matrice RACI.
- FAQ : details/summary, 6 Q = FAQPage.
- CTA : **produit `/products/40-outils-de-la-gestion-de-projet`** (seule occurrence de ce produit).
- Bio : oui (texte) + carte auteur. A lire aussi : 5 pourquoi, PDCA, DMAIC.
- Liens /blogs/nos-articles/ : 9, 5 cibles (5S, 5 pourquoi, DMAIC, PDCA, Responsable AC). /products/ : 2. Externes : code.travail.gouv.fr (L4121-1), norminfo (ISO 9000), economie.gouv.fr (PDF RACI).
- JSON-LD : Article + FAQPage (bare) ; **`image: "VISUEL-A-CREER"`** ; dates 2026-09-07.
- H1 : non. Mots : ~4 100.
- Divers : **placeholders visibles** : "un arret non planifie sur un [famille d'equipement] en [secteur]", "Une relecture au jalon, a [duree constatee]" ; emoji 👉 ❌ ✅.

---
# SYNTHESE TRANSVERSALE

## A. Variantes du bloc `<style>` (police et palette identiques partout : "Helvetica Neue",Helvetica,Arial ; 18px/1.75 ; max-width 760px ; texte #222, titres #1a1a1a ; accent #3b3a9e ; resume #e6f4f4/#75bec0 ; toc #eef3fa/#74a3d6 ; essentiel #fdf3d6/#e6b839 ; note #eef7e8/#8cc978 ; pieges #fbeded/#f16969 ; ko #d63b3b / ok #4f9f3a)
| Variante | Regles distinctives | Articles |
|---|---|---|
| **V1-early** (indentee 2 esp., ~56 l.) | `.fichly-toc strong`, `.fichly-essentiel strong{display:block}` sans correctif li ; bio simple ; carte `.fichly-author` 84px ; **sans th-oui/th-non** | Financement |
| **V1 indentee** (~58 l.) | idem + th-oui/th-non | QUALIOPI |
| **V1** (~58 l., ~6 Ko) | idem, non indentee | PDCA, Green Belt, TRS/TRG/TRE, VSM |
| **V1 + figure** (~61 l.) | V1 + `.fichly-article img{max-width:100%;margin:0 auto}` + figure/figcaption | Responsable AC |
| **V1 + justify** (59 l., 4,55 Ko, octet pour octet identique) | V1 + `.fichly-article > p{text-align:justify;hyphens:auto}` | brouillons AMDEC, QQOQCCP, Ishikawa, RACI |
| **V2** (~64 l., ~7 Ko) | `>strong` + correctif `li strong` ; `p{text-align:justify !important}` + retours a gauche ; regle img ; `.fichly-embed` + `.fichly-legende` ; `.fichly-resume ul/li` ; bio simple + carte author | SMED |
| **V3a** (~51 l., ~5 Ko) | `>strong` + correctif `li strong` ; `.fichly-bio` en flex + `.fichly-bio-photo` 96px + `.fichly-bio-body` ; **pas** de carte author ; pas de regle img | TPM, Types de maintenance, DMAIC, MUDA, TRS, 5S, 5 pourquoi (memes regles, bio eclatee sur 5 lignes), brouillons Lean Manufacturing, Pareto, Gemba, Obeya, Takt, Kanban |
| **V3b** (~52 l.) | V3a + `.fichly-article img{width:100%;border-radius:10px;margin:1.8em 0}` + `bio-photo img{margin:0;border-radius:0}` | MTBF/MTTR |
| Aucun (Bloggle) | CSS/JS Bloggle externes (cloudfront) | Quelle formation Lean |

## B. Squelette commun (generation V3, la plus recente)
intro `<p>` -> `.fichly-resume` ("En resume", `<span class="label">`) -> `.fichly-essentiel` (5 puces) -> `.fichly-toc` ("Sommaire", `<ol>` d'ancres, id sur chaque H2) -> H2 de contenu (definition, calcul/etapes, tableau, note, pieges ❌/✅, vocabulaire anglais, outils lies) -> H2 "FAQ : vos questions sur ..." + `.fichly-faq` en `<details><summary>` + `.answer` -> `.fichly-cta` (fond #3b3a9e, "👉 Decouvrez ...") -> `.fichly-bio` ("Moi, c'est Hugo." + photo 96px + LinkedIn + home) -> `.fichly-readmore` (3 liens) -> fin div -> JSON-LD Article + FAQPage (dans un `<p>` ou non).

## C. Generations
- **G0 Bloggle (mars 2026)** : Quelle formation (builder Bloggle, template par defaut, pas de JSON-LD, FAQ en H3). VSM a garde le template `bloggle-custom` apres reecriture.
- **G1 "V1 carte auteur" (mai-aout 2026)** : Financement, QUALIOPI, Responsable AC, Green Belt, PDCA, TRS/TRG/TRE, VSM + brouillons du 04/09 (AMDEC, QQOQCCP, Ishikawa, RACI). Marqueurs : commentaire brief en tete, "Au sommaire" (4 articles), `<nav>` et sommaire avant l'Essentiel (Financement, QUALIOPI), readmore sans `<p>`, carte `.fichly-author` (photo manquante / initiales / placeholder / base64 casse), bio texte doublonnee, styles inline, CTA `/pages/formation-et-conseil` ou Tally, CTA avant FAQ (PDCA, Resp AC), JSON-LD avec `publisher.logo` / sans accents.
- **G2 SMED (aout 2026)** : transition (justify, embed GIPHY, bio + carte).
- **G3 "V3 bio-photo" (fin aout - sept. 2026)** : DMAIC, MUDA, TRS, 5S, 5 pourquoi, Types de maintenance, MTBF, TPM + brouillons du 11/09 et du 30/09. Squelette B stable, 0 style inline, bio unique avec photo CDN, maillage interne plus dense, CTA partenaires / Green Belt CPF / produits.

## D. Problemes releves (factuel)
1. **Placeholders visibles** : VSM publie ("[secteur]", 14 cellules "[C/T poste n]"..., "[duree du chantier]", photo `REMPLACER-PAR-PHOTO-HUGO`) ; brouillons Kanban, AMDEC, QQOQCCP, Ishikawa, RACI (texte entre crochets, `VISUEL-A-CREER` en src et en JSON-LD image).
2. **Images auteur cassees / absentes** : TRS/TRG/TRE et QUALIOPI (`<img>` sans src), Financement (data URI base64 corrompue), VSM (src placeholder), PDCA et Resp AC (initiales "HD"), Green Belt (autre photo `hugo-duc.jpg`).
3. **Commentaires HTML internes dans le corps** (visibles dans le source public) : TRS/TRG/TRE, PDCA, Green Belt, Resp AC (malforme, commentaire imbrique), Financement (x2), QUALIOPI (x2) ; brouillons Pareto, Gemba, Obeya, Takt, Kanban, AMDEC (18 Ko), Ishikawa (15 Ko), RACI (13 Ko). Contenu : analyses Ahrefs, DR concurrents, "fichly.com DR 7", decisions editoriales.
4. **Liens internes probablement casses** (slugs absents de la liste des handles) : `quelle-formation-lean-choisir`, `vsm-value-stream-mapping`, `trs-taux-de-rendement-synthetique` (Financement, QUALIOPI) ; `/formations`, `/formations/white-belt`, `/formations/black-belt` (Financement) ; `methode-a3-lean-resolution-probleme` (VSM) ; `lean-management-et-ses-avantages-definition-et-outils` (PDCA x3, Green Belt x2, Resp AC x3), qualifie d'"article fantome" dans le brief Gemba. Non verifie en HTTP (pas d'acces reseau au site).
5. **JSON-LD** : dans un `<p>` sur 16 articles ; headline != titre sur 9 (5 pourquoi, DMAIC, Green Belt, Resp AC, Financement, QUALIOPI, MUDA, TRS, 5S) ; datePublished != publication reelle sur 10 (TPM, MTBF, Types, SMED, 5 pourquoi, TRS/TRG/TRE, PDCA, Financement, QUALIOPI, VSM) dont dateModified < datePublished (TPM, MTBF, Types, 5 pourquoi) ; date future 2026-10-05 (Lean Manufacturing) ; image absente (Types, 5 pourquoi, DMAIC, PDCA, Resp AC, Financement, QUALIOPI, TRS, Pareto, Gemba, Obeya, Takt, Kanban) ou differente de l'image article (TPM, MTBF, SMED, TRS/TRG/TRE, Green Belt, VSM) ; `logo: "REMPLACER-PAR-LOGO-FICHLY"` (PDCA) ; mainEntityOfPage faux (Financement) ; FAQPage raccourci ou sans accents (Types, TRS/TRG/TRE, Green Belt, Resp AC, Financement, QUALIOPI) ; aucun JSON-LD (Quelle formation).
6. **Alt vides** : 23 visuels de contenu avec alt="" (TPM 3, MTBF 5, Types 3, SMED 6, 5 pourquoi 2, PDCA 3, Resp AC 1). Quelle formation : 6 `<img>` sans `src` (data-src JS). Aucun visuel de contenu dans DMAIC, MUDA, TRS, 5S, Green Belt, Financement, QUALIOPI et 5 brouillons.
7. **Bug CSS V1** : `<strong>` dans les `<li>` de l'Essentiel rendus en bloc 1,15em (VSM publie ; AMDEC, QQOQCCP, Ishikawa, RACI).
8. **Balisage** : images dans `<strong>` et `<br><br><br>` (SMED), images collees en milieu de `<p>` (Types, TPM), `<figure>` vide (Resp AC), 2 `<h2><br></h2>` vides (Quelle formation), lien coupe "f|ormations" + ". ." (Financement), classes de l'interface Claude collees (PDCA), `<details open>` (Green Belt), ancre de sommaire `#role` sans H2 correspondant (Green Belt), styles inline (TRS/TRG/TRE 6, PDCA 5, Financement 6, QUALIOPI 5, Quelle formation ~9, Lean Manufacturing 24), gras coupe en milieu de mot (PDCA).
9. **Doubles blocs auteur** (bio texte + carte) : SMED, TRS/TRG/TRE, Resp AC, Financement, QUALIOPI, VSM, AMDEC, QQOQCCP, Ishikawa, RACI.
10. **Incoherences de contenu inter-articles** : FNE-Formation "supprime fin 2024" (Financement) vs disponible (QUALIOPI, Quelle formation) ; Green Belt 6 j/42 h, 1 500-2 500 EUR (DMAIC, Green Belt, SMED...) vs 5 jours (Resp AC CTA, Quelle formation, Financement) et 3 000 EUR / 2 500 EUR (Financement) ; DMAIC "Innover" vs "Ameliorer" (Green Belt) ; White Belt 1 j vs 3 j (Quelle formation) ; MUDA : 3 vs 4 familles invisibles au TRS ; TRS/TRG/TRE : "on ne compte pas les arrets non-planifies dans le TRS" (inverse du reste de l'article).
11. **Metadonnees Shopify** : templateSuffix `article` (16 publies) vs `null` (Quelle formation + 10 brouillons) vs `bloggle-custom` (VSM) ; publishedAt anterieur a createdAt (MUDA, VSM, TRS, 5S) ; titre avec "| Fichly" (QUALIOPI) ; titre en Title Case (MUDA) ; image article absente sur 9 brouillons, altText null sur 12 publies.
12. **Emojis comme icones** : 👉 dans ~26 articles (CTA, bio, parfois corps : SMED, TRS/TRG/TRE), ❌/✅ dans les pieges, ⚠️ (Financement), 🚀 (Quelle formation) ; variantes texte ✖/✔ (PDCA), ✗/✓ (Resp AC), "Erreur/A faire" (MTBF).
13. **Aucun H1 dans les corps** (conforme).

## E. Tableau recapitulatif
| # | Article | Tpl | Style | H2 | TOC | FAQ | CTA | Bio | Img / alt vide | Mots |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | TPM | article | V3a | 9 | o | details 6 | pages/partenaires-logiciels | photo | 4 / 3 | ~3 900 |
| 2 | MTBF-MTTR | article | V3b | 8 | o | 6 | partenaires-logiciels | photo | 6 / 5 | ~3 800 |
| 3 | Types maintenance | article | V3a | 10 | o | 6 | formation-lean-green-belt-cpf | photo | 4 / 3 | ~3 300 |
| 4 | SMED | article | V2 | 9 | o | 7 | green-belt-cpf | texte + carte | 9 / 6 (+iframe) | ~3 300 |
| 5 | 5 pourquoi | article | V3a' | 9 | o | 6 | green-belt-cpf | photo | 3 / 2 | ~3 000 |
| 6 | TRS-TRG-TRE | article | V1 + comm. | 12 | o | 7 | partenaires-logiciels | texte + carte (img sans src) | 2 / 0 | ~3 300 |
| 7 | DMAIC | article | V3a | 12 | o | 6 | green-belt-cpf | photo | 1 / 0 | ~3 700 |
| 8 | PDCA | article | V1 + comm. | 10 | o | 6 | formation-et-conseil | carte seule (initiales) | 3 / 3 | ~3 300 |
| 9 | Green Belt | article | V1 + comm. | 7 | o (1 ancre cassee) | 6 | tally.so | carte seule | 1 / 0 | ~2 700 |
| 10 | Resp. AC | article | V1+figure + comm. | 9 | o | 6 | formation-et-conseil | texte + carte (initiales) | 1 / 1 | ~2 700 |
| 11 | Financement | article | V1-early + 2 comm. | 8 | o (nav) | 6 | formation-et-conseil (lien coupe) | texte + carte (base64 casse) | 1 / 0 | ~3 200 |
| 12 | QUALIOPI | article | V1 indentee + 2 comm. | 10 | o (nav) | 6 | formation-et-conseil | texte + carte (img sans src) | 1 / 0 | ~2 900 |
| 13 | MUDA | article | V3a | 11 | o | 7 | produit fiches-lean | photo | 1 / 0 | ~5 200 |
| 14 | Quelle formation | null | aucun (Bloggle) | 12 (+2 vides) | Bloggle | H3 6 | bouton formation-et-conseil | non | 6 / 0 (sans src) | ~2 300 |
| 15 | VSM | bloggle-custom | V1 | 11 | o | 6 | formation-yellow-belt page | texte + carte (placeholder) | 3 / 0 | ~3 900 |
| 16 | TRS | article | V3a | 13 | o | 6 | partenaires-logiciels | photo | 1 / 0 | ~4 300 |
| 17 | 5S | article | V3a | 11 | o | 6 | produit guide 5S | photo | 1 / 0 | ~5 000 |
| 18 | *Lean Manufacturing* | null | V3a (+24 inline) | 12 | o | 8 | fiches-lean + pages/templates | photo | 9 / 0 + 8 video | ~5 300 |
| 19 | *Pareto* | null | V3a + comm. | 8 | o | 5 | produit guide DMAIC | photo | 1 / 0 | ~2 100 |
| 20 | *Gemba* | null | V3a + comm. | 7 | o | 5 | fiches-lean | photo | 1 / 0 | ~1 900 |
| 21 | *Obeya* | null | V3a + comm. | 8 | o | 6 | fiches-lean | photo | 1 / 0 | ~2 000 |
| 22 | *Takt time* | null | V3a + comm. | 5 | o | 5 | partenaires-logiciels | photo | 1 / 0 | ~1 400 |
| 23 | *Kanban* | null | V3a + comm. | 8 | o | 5 | fiches-lean | photo | 1 / 0 | ~1 900 |
| 24 | *AMDEC* | null | V1+justify + comm. 18 Ko | 10 | o | 6 | partenaires-logiciels | texte + carte (placeholder) | 2 / 0 (2 src placeholder) | ~4 800 |
| 25 | *QQOQCCP* | null | V1+justify | 9 | o | 6 | guide DMAIC | texte + carte (placeholder) | 2 / 0 (2 src placeholder) | ~3 300 |
| 26 | *Ishikawa* | null | V1+justify + comm. 15 Ko | 10 | o | 6 | guide DMAIC | texte + carte (placeholder) | 2 / 0 (2 src placeholder) | ~4 100 |
| 27 | *RACI* | null | V1+justify + comm. 13 Ko | 10 | o | 6 | produit 40-outils-gestion-de-projet | texte + carte (placeholder) | 2 / 0 (2 src placeholder) | ~4 100 |
(italique = brouillon ; "Img" compte toutes les balises `<img>`, photo auteur comprise.)
