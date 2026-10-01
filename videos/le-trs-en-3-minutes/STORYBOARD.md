---
format: 1920x1080
duration: 180s
message: "Le TRS retrouve le temps perdu entre ce que la machine devait produire et les pièces bonnes qu'elle a livrées, et c'est sa décomposition, pas le chiffre, qui dit où agir."
arc: "story-explainer with process — Mystère → L'outil d'enquête → Pièce du dossier (le temps requis) → Trois témoins (disponibilité, performance, qualité) → Reconstitution (77 %) → Le vrai verdict (la décomposition) → Deux fausses pistes → Affaire classée → L'article"
audience: "Responsables de production, techniciens méthodes et maintenance, personnes en formation Lean (francophones, vouvoiement)"
mode: collaborative
language: fr
music: none
---

# Le TRS en 3 minutes — storyboard (v3, montage complet v4)

## Montage complet (v4, 1er octobre 2026)

« Fait moi l'animation complète avec cet audio maintenant » : la prise complète fournie (ElevenLabs, Emilie - Podcast Host, modèle v4, vitesse 1,12, stabilité 46 %, similarité 75 %, 4 min 04) est dans `audio/v4/trs-complet.mp3`, avec les temps de chaque mot dans `audio/v4/trs-complet.words.json` (Whisper small). Elle suit le script, à un détail près : la ligne 3 devient une question (« Alors, la façon la plus simple de le calculer ? On compare… »).

Montage Remotion : `videos/remotion/src/trs/episode/` (composition `TRS-en-3-minutes`, calage dans `timeline.ts`). Rendu : `livrables/le-trs-en-3-minutes.mp4` (1920×1080, 30 i/s, 4 min 09). Une seule prise, 19 cadres d'une idée chacun, fondus de 10 images pendant que la voix continue. Temps ci-dessous en secondes de la prise (la vidéo ajoute 2 s de logo au début).

| Cadre | Prise | L'idée à l'écran |
| --- | --- | --- |
| 1. Intro | 0 → 6,8 | Le logo s'écrit puis rejoint son coin ; « Le TRS en 3 minutes. » |
| 2. Le constat | 6,8 → 19,7 | La presse a tourné 16 h, il manque plus de 3 h. |
| 3. La méthode simple | 19,7 → 27,3 | Pièces bonnes ÷ pièces possibles au temps de cycle idéal. |
| 4. Notre cas | 27,3 → 48,05 | 650 ÷ 840 = 77 %, mais où sont passées les 3 heures ? |
| 5. Les temps d'états | 48,05 → 72,4 | Chaque marche retire une famille de pertes. |
| 6. Le temps requis | 72,4 → 80 | 16 blocs d'une heure ; les 2 h de maintenance sortent : 14 h. |
| 7. Marche 1 · disponibilité | 80 → 97,3 | Deux heures passent au rouge et sortent : 12 h ÷ 14 h = 85,7 %. |
| 8. Marche 2 · performance | 97,3 → 113,4 | 680 pièces sorties sur 720 attendues, l'écart en jaune : 94,4 %. |
| 9. Marche 3 · qualité | 113,4 → 125,1 | 68 cases de 10 pièces, 3 au violet : 650 ÷ 680 = 95,6 %. |
| 10. Le TRS, reconstitué | 125,1 → 134,8 | Les trois taux se multiplient, la jauge monte à 77 %, comme la méthode simple. |
| 11. Le verdict | 134,8 → 147,95 | Sur 14 h, 10 h 50 utiles ; 2 h d'arrêts, 40 min de lenteurs, 30 min de rebuts ; premier chantier cerclé. |
| 12. Fausse piste n° 1 | 147,95 → 156,8 | Pas de « bon TRS » universel : la courbe de la presse, mois après mois (valeurs d'illustration jusqu'aux 77 %). |
| 13. Fausse piste n° 2 | 156,8 → 168,1 | Une panne rebaptisée « maintenance planifiée » sort du temps requis : 83 %, sans une pièce de plus. |
| 14. TRS, TRG, TRE | 168,1 → 180,1 | Même numérateur (10 h 50), « divisé par quel temps ? ». |
| 15. Le TRG | 180,1 → 204,9 | Comparateur : TRS ÷ 14 h = 77 % ; TRG ÷ 16 h = 68 %, la maintenance compte comme perte. |
| 16. Le TRE | 204,9 → 221,85 | L'échelle passe à 24 h ; les 8 h de fermeture, puis « 8 h de capacité libre » : 45 %. |
| 17. Sur quel temps ? | 221,85 → 226,2 | Les trois taux côte à côte, leurs dénominateurs surlignés. |
| 18. À retenir | 226,2 → 234,95 | TRS = temps utile ÷ temps requis ; il ne juge personne, il montre où chercher. |
| 19. Pour aller plus loin | 234,95 → fin | Formation Lean Green Belt (éligible au CPF), decks de fiches ; liens en description ; le logo s'écrit à nouveau. |


## Changes from v3 (en attente de validation)

- « Ok, le texte est pas assez naturel… Je veux un texte humain du style "Dans notre cas la machine a tourné X h, ce qui nous donne, une fois enlevés les arrêts non planifiés…" » et « pas trop d'animation par frame. On ne sait pas où regarder. Une frame = une idée que l'on montre » (1er octobre 2026) : `SCRIPT.md` passe en version 2, sur un ton parlé, redécoupée en **14 cadres, une idée chacun** (l'idée et ce qu'on montre sont notés à chaque ligne). Elle intègre le verdict en heures et le TRG / TRE.
- Règle de mise en scène : **un cadre = une idée = un seul élément à regarder**, au plus trois temps forts posés sur la voix ; plus de panneaux côte à côte, plus de fil d'enquête en haut à droite. Le panneau de contrôle reste le décor : un widget au centre (voyant, « En direct »).
- Cadre 04 refait sur cette règle (`videos/remotion/src/trs/Cadre04.tsx`, voix `audio/04-disponibilite-v2.mp3`). Les sections « Frame » ci-dessous décrivent encore la v3 ; elles seront réécrites sur les 14 cadres une fois le script v2 validé.

## Changes from v2

- « Ok gardons remotion. J'aimerais que l'on travaille un peu plus les planches maintenant. Apporter une vraie touche pédagogique » (1er octobre 2026) : la planche v3 (`storyboard.html`, générée par `outils/planche.py`, image `storyboard-v3.png`) remplace le ruban des heures par un schéma unique, la **cascade des temps**, qui se construit du cadre 03 au 07. Chaque témoin a la même fiche (ce qu'il a vu, le calcul en mots puis en chiffres, la perte en temps, une astuce). Plan de l'enquête au cadre 02, fil d'enquête en haut à droite des cadres 03 à 11, déclic au 07 (les fractions se simplifient en temps utile ÷ temps requis), verdict en heures avec une question au 08, idée reçue contre bonne pratique au 09, avant / après au 10, « À retenir » en 3 points au 11. Cadres 01 et 12 inchangés. Moteur de rendu : Remotion (`videos/remotion/`).
- Référence de mouvement envoyée le 1er octobre 2026 (« je veux des animations comme ça… quali comme ça ») : les 16 tuiles animées Fichly (Andon, SMED, 5 pourquoi, TRS en temps réel…). Le langage de mouvement en découle (voir `## Video direction`).

## Changes from v1 (rappel de la v2)

- « Je veux que l'on pousse à la fin des animations notre formation au lean Green Belt éligible au CPF et nos decks de fiches pour se former » (1er octobre 2026) : le cadre 12 renvoie vers la formation Green Belt (page « Formation Lean Management Green Belt CPF ») et les decks de fiches (« 40 outils du Lean à portée de main », guides en 20 fiches) ; l'article passe dans la description YouTube.
- « je veux la DA fichly » (1er octobre 2026) : la charte bold-poster est remplacée par la direction artistique Fichly (`frame.md` réécrit depuis le gabarit des fiches). Récit, script et découpage inchangés.

## Still open

- **Montage complet v4** : à relire sur `livrables/le-trs-en-3-minutes.mp4`. Durée 4 min 09 pour un titre « en 3 minutes ». Logo animé à partir d'un tracé vectoriel redessiné d'après le PNG : à remplacer par le fichier vectoriel officiel. Ensuite : sous-titres `.srt` (les temps des mots sont prêts) et version 9:16.
- Première minute v3 (`audio/v3/bloc1.mp3`, rendu `videos/essais/minute-1/trs-minute-1.mp4`) : remplacée par le montage complet ; ses pastilles de titre ne s'affichaient pas (corrigé dans le montage complet).

- **Ligne 8 du script (recommandée)** : parler en heures plutôt qu'en points, pour coller à l'écran du cadre 08. Proposition : « Mais le verdict, ce n'est pas le chiffre. Reprenons nos trois heures dix. À votre avis, où est passée la plus grosse part ? … Deux heures en arrêts. Quarante minutes en lenteurs, trente en rebuts. Le premier chantier est tout trouvé : la disponibilité. » En attente de validation ; `SCRIPT.md` garde la version actuelle.
- **Cadre 10 bis, TRG et TRE (nouveau)** : nouvelle ligne de voix d'environ 15 s, la vidéo passe à environ 3 min 15. À valider, ou à compenser en resserrant d'autres lignes.
- **Lignes 5 et 6 (au choix)** : dire l'astuce à voix haute (« soit quarante minutes », « encore trente minutes »).

- Lancement de la voix off (une prise ≈ 2 800 crédits ElevenLabs avec la nouvelle fin) : en attente de l'accord.
- Visuels HD des decks : `cdn.shopify.com` est bloqué dans l'environnement ; la planche utilise l'encart `guides-fichly.png` (basse définition) en attendant des packshots.

## Décisions

- **Message** : le TRS retrouve le temps perdu entre ce que la machine devait produire et les pièces bonnes qu'elle a livrées, et c'est sa décomposition, pas le chiffre, qui dit où agir.
- **Public et arc** : responsables de production, méthodes, maintenance et apprenants Lean. Arc d'enquête (story-explainer) avec, au milieu, une suite ordonnée de trois témoins sur le même décor (process).
- **Format** : 1920×1080, environ 180 s, voix off oui (Emilie - Podcast Host, ElevenLabs), musique non en version 1, sous-titres en fichier `.srt` (rien d'incrusté, donc pas de bande réservée en bas d'image).
- **Fil conducteur (v3)** : la **cascade des temps** de l'article (ouverture 16 h → requis 14 h → fonctionnement 12 h → net 11 h 20 → utile 10 h 50), sur une carte à gauche. Elle apparaît au cadre 03 avec trois lignes en pointillés qui attendent les témoins, gagne une marche par témoin (04 à 06), se lit en entier au 07 (accolade des 3 h 10), lâche ses pertes au 08 et revient simplifiée en avant / après au 10. Échelle : 1 h = 3 cqw. Les heures sont des blocs d'une heure qui se déplacent d'une ligne à l'autre.
- **Fil d'enquête** : les quatre étapes annoncées au cadre 02 (Le temps · Les 3 témoins · Le verdict · Fausses pistes) restent en haut à droite des cadres 03 à 11 : faite ✓, en cours en bleu plein, à venir en blanc. Un **fil rouge** relie la pièce à conviction au mystère (01) ; les contours bleus et pastilles ✓ / ✗ de la DA désignent ensuite les indices.
- **Charte** (`frame.md`, DA Fichly reprise du gabarit des fiches) : fond papier `#f3f3f3` + `paper.png`, bleu de marque `#4a4aa0`, encre `#23235a`, cartes blanches `#fdfdfb` arrondies à filet `#e2e2ee`, bandes pastel avec pastilles ✓ vertes / ✗ rouges, pastilles numérotées bleues, pictos machine et cartons, ruban six couleurs en bas et logo fichly. Poppins seule (titres 800, bandes et pilules 700, texte 500). Titre en deux temps : ligne bleue, puis ligne blanche dans le bandeau bleu. Codage des pertes : disponibilité rouge `#f16969`, performance jaune `#e6b839`, qualité violet `#aa76b2`, temps utile vert `#8cc978`.
- **Procédés pédagogiques (v3)** : un seul schéma qui se construit ; plan annoncé puis rappelé ; une couleur par famille ; chaque formule en mots, puis en chiffres ; une seule unité, l'heure (astuce 1 pièce = 1 minute) ; question avant la réponse (08) ; idée reçue contre bonne pratique (09) ; avant / après (10) ; à retenir en 3 points (11).
- **Interdits** : pas de diaporama (chaque cadre fait évoluer le même tableau, on n'empile pas des cartes neuves) ; pas d'économiseur d'écran (chaque mouvement montre une perte ou un chiffre nommé par la voix) ; pas de formule A × P × Q avant la reconstitution (cadre 07) ; pas d'usine en photo de banque d'images ; pas de couleur hors palette Fichly, pas d'ombre ni de dégradé ; pas de chiffres inventés (tous viennent du cas de référence de l'article).
- **Cadre tenu** : au cadre 07, « 77 % » se pose et reste immobile pendant que la voix prononce « dix heures cinquante ».
- **Vérité** : tous les chiffres sont ceux du cas de référence de l'article Fichly (16 h d'ouverture, 2 h planifiées, 14 h requises, 2 h d'arrêts subis, 60 pièces/h, 720 attendues, 680 produites, 650 conformes, TRS 77 %, 10 h 50 utiles ; requalification : 13 h requises, 83 %). La machine est une illustration, pas un site réel.

## Frame 1 — L'affaire des trois heures

- scene: Gros plan sur la machine Fichly d'un polaroïd épinglé (punaise rouge), puis recul : titre « Il manque plus de / 3 heures. », « Où sont-elles passées ? », pilule « 2 équipes · 16 h d'ouverture » ; un fil rouge relie la photo au bandeau.
- voiceover: "Cette machine a tourné toute la journée. Deux équipes, seize heures d'ouverture. Pourtant, il manque plus de trois heures de production. Où sont-elles passées ?"
- duration: 12s
- transition_in: cut
- status: built
- src: compositions/frames/01-affaire.html
- type: hook
- persuasion: Rhetorical question + Stakes / consequence
- beat: Curiosity + intrigue
- blueprint: zoom-out-workspace-reveal

narrativeRole: Ouvre le mystère que toute la vidéo va résoudre : une machine occupée qui perd pourtant plus de trois heures.
keyMessage: Une machine qui tourne n'est pas une machine qui produit ; il manque du temps, et on va le retrouver.

## Frame 2 — L'outil d'enquête

- scene: Titre « Le TRS, / l'outil d'enquête. », chapeau « Taux de rendement synthétique » ; trois bandes : ✗ « Une note des équipes », ✓ « Le relevé de ce qui s'est perdu », « Et surtout : il dit où chercher. » ; à droite, deux barres (« Ce que la machine devait produire », « Les pièces bonnes ») et l'écart hachuré ✗ « Tout ce qui s'est perdu » ; en bas, le plan de l'enquête en quatre étapes.
- voiceover: "Pour mener l'enquête, les ateliers ont un outil : le TRS, le taux de rendement synthétique. Ce n'est pas une note. C'est le relevé de tout ce qui s'est perdu entre ce que la machine devait produire et les pièces bonnes. Et il dit où chercher."
- duration: 17s
- transition_in: crossfade
- status: built
- src: compositions/frames/02-outil.html
- type: product_intro
- persuasion: Concept announcement + Subtractive framing (ce que le TRS n'est pas)
- beat: Orientation + anticipation
- blueprint: kinetic-type-beats

narrativeRole: Nomme le concept et pose la promesse de la vidéo dès le deuxième cadre : le TRS chiffre les pertes et indique où agir.
keyMessage: Le TRS n'est pas une note des équipes, c'est le relevé de ce qui s'est perdu, et il dit où chercher.

## Frame 3 — Première pièce du dossier : le temps

- scene: Carte de gauche : la cascade des temps, barre « Temps d'ouverture · 16 h », puis « Temps requis · 14 h » et la tranche en pointillés « 2 h prévues » ; trois lignes en pointillés « Témoin n° 1, 2, 3 · ? ». Fiche de droite (bandeau bleu « Le temps requis ») : 16 h − 2 h = 14 h avec les mots sous les nombres, « Maintenance prévue : on la retire », « Le dénominateur du TRS », encadré « À suivre ».
- voiceover: "Première pièce du dossier : le temps. Seize heures d'ouverture. On retire les deux heures de maintenance prévues : il en reste quatorze. C'est le temps requis, celui où la machine devait produire. Tout part de là."
- duration: 17s
- transition_in: push-slide LEFT
- status: built
- src: compositions/frames/03-temps-requis.html
- type: feature_showcase
- persuasion: Frame-then-fill + Worked example with real numbers
- beat: Focus + clarity
- blueprint: grid-card-assemble

narrativeRole: Installe le décor commun aux cadres suivants (le ruban) et le dénominateur du TRS, le temps requis.
keyMessage: On mesure par rapport au temps requis : l'ouverture moins les arrêts planifiés, ici 14 heures.

## Frame 4 — Témoin n° 1 : la disponibilité

- scene: La cascade gagne la ligne « Temps de fonctionnement · 12 h » et la tranche rouge « −2 h arrêts » (ligne surlignée en rouge pâle). Fiche « 1 Disponibilité » : ✗ Pannes, Manques matière, Réglages imprévus ; fraction en mots (temps de fonctionnement ÷ temps requis) puis en chiffres (12 h ÷ 14 h) ; « = 85,7 % » en rouge foncé ; « Perte : 2 h » ; encadré « En clair ».
- voiceover: "Premier témoin : la disponibilité. Pannes, manques matière, réglages imprévus : deux heures d'arrêts subis. La machine a tourné douze heures sur quatorze. Disponibilité : 85,7 %."
- duration: 14s
- transition_in: push-slide LEFT
- status: built
- src: compositions/frames/04-disponibilite.html
- type: feature_showcase
- persuasion: Progressive disclosure + Worked example with real numbers
- beat: Comprehension

narrativeRole: Premier niveau de perte : le temps où la machine devait tourner et ne tournait pas.
keyMessage: La disponibilité compare le temps où la machine a tourné au temps requis : 12 h sur 14, 85,7 %.

## Frame 5 — Témoin n° 2 : la performance

- scene: La cascade gagne « Temps net · 11 h 20 » et la tranche jaune « −40 min · lenteurs » ; des encoches jaunes (micro-arrêts) apparaissent dans la barre de 12 h. Fiche « 2 Performance » : ✗ Micro-arrêts, Cadence lente ; pièces produites ÷ pièces attendues = 680 ÷ 720 ; « = 94,4 % » ; « Perte : 40 min » ; astuce « 1 pièce = 1 minute ».
- voiceover: "Deuxième témoin, plus discret : la performance. À soixante pièces par heure, douze heures devaient en donner sept cent vingt. La machine en a fait six cent quatre-vingts. Les quarante qui manquent ? Des micro-arrêts de quelques secondes et une cadence un peu lente. Personne ne les déclare. Performance : 94,4 %."
- duration: 19s
- transition_in: push-slide LEFT
- status: built
- src: compositions/frames/05-performance.html
- type: feature_showcase
- persuasion: Concretization (la loupe rend visible l'invisible) + Worked example with real numbers
- beat: Surprise + aha
- blueprint: dataviz-countup

narrativeRole: Révèle la perte que personne ne voit : les micro-arrêts et la cadence, qui n'apparaissent sur aucun rapport d'arrêt.
keyMessage: La performance compare les pièces produites aux pièces possibles pendant que la machine tournait : 680 sur 720, 94,4 %.

## Frame 6 — Témoin n° 3 : la qualité

- scene: La cascade gagne « Temps utile · 10 h 50 » en vert et la tranche violette « −30 min · rebuts ». Fiche « 3 Qualité » : ✗ Rebuts, Retouches ; pièces bonnes ÷ pièces produites = 650 ÷ 680 ; « = 95,6 % » en violet ; « Perte : 30 min » ; astuce « 30 pièces = 30 min ».
- voiceover: "Troisième témoin : la qualité. Sur six cent quatre-vingts pièces, trente sont rebutées ou retouchées. Une retouche, c'est du temps consommé deux fois. Il reste six cent cinquante pièces bonnes. Qualité : 95,6 %."
- duration: 16s
- transition_in: push-slide LEFT
- status: built
- src: compositions/frames/06-qualite.html
- type: feature_showcase
- persuasion: Progressive disclosure + Causal chain (retouche → temps consommé deux fois)
- beat: Comprehension + recognition

narrativeRole: Dernier niveau de perte : les pièces produites qui ne sont pas bonnes du premier coup.
keyMessage: La qualité compare les pièces bonnes du premier coup aux pièces produites : 650 sur 680, 95,6 %.

## Frame 7 — Reconstitution : 77 %

- scene: Cascade complète : lignes 2 et 5 surlignées, guide en pointillés et accolade rouge « 3 h 10 perdues ». Fiche « On multiplie » : 85,7 % × 94,4 % × 95,6 %, puis les mêmes en temps (12 h/14 h × 11 h 20/12 h × 10 h 50/11 h 20), les termes qui se simplifient barrés ; « = 10 h 50 / 14 h » (temps utile ÷ temps requis) ; bandeau « TRS = 77 % » ; pilule ✓ « Les 3 h 10 sont retrouvées ».
- voiceover: "Reconstitution. On multiplie les trois témoignages : disponibilité, fois performance, fois qualité. Soixante-dix-sept pour cent. Sur quatorze heures requises, la machine a produit l'équivalent de dix heures cinquante de pièces bonnes. Les trois heures dix sont retrouvées."
- duration: 17s
- transition_in: cut
- status: built
- src: compositions/frames/07-reconstitution.html
- type: social_proof
- persuasion: Distillation + Statistical proof (compteur jusqu'à 77 %) + Callback (les trois heures du cadre 01)
- beat: Satisfaction + aha
- blueprint: dataviz-countup

narrativeRole: Résout le mystère du cadre 01 en chiffres et fait apparaître la formule seulement maintenant, quand le spectateur l'a déjà vue se construire.
keyMessage: TRS = disponibilité × performance × qualité = 77 % : 10 h 50 utiles sur 14 h requises, les 3 h 10 sont retrouvées.

## Frame 8 — Le vrai verdict : la décomposition

- scene: Titre « Où sont passées / les 3 h 10 ? » et pilule « À votre avis ? » ; carte : trois barres en heures (1 Disponibilité 2 h, 2 Performance 40 min, 3 Qualité 30 min), la première cerclée de bleu avec la pilule « Premier chantier » et les causes du témoin n° 1 ; en bas, « 2 h + 40 min + 30 min = 3 h 10 : les heures s'additionnent, les pourcentages non ».
- voiceover: "Mais le verdict, ce n'est pas le chiffre. Regardez où partent les points : quatorze virgule trois en disponibilité, cinq virgule six en performance, quatre virgule quatre en qualité. Le premier chantier est tout trouvé : la disponibilité."
- duration: 16s
- transition_in: cut
- status: built
- src: compositions/frames/08-verdict.html
- type: benefit_highlight
- persuasion: Common-belief vs reality (le niveau contre la répartition)
- beat: Conviction
- blueprint: grid-card-assemble

narrativeRole: Porte la deuxième moitié du message : c'est la décomposition qui dit où agir, pas le pourcentage final.
keyMessage: Regardez la répartition des pertes plutôt que le 77 % : ici, le premier chantier est la disponibilité.

## Frame 9 — Fausse piste n° 1 : le « bon TRS »

- scene: Titre « Le « bon TRS » / n'existe pas. » ; bande rouge pâle ✗ « Idée reçue : un seuil universel » (< 50 % mauvais, 60 à 70 % correct, > 85 % excellent) et « Pourquoi ? Chaque site a ses règles de calcul : le même atelier peut afficher 68 % ou 85 % » ; carte ✓ « La bonne comparaison » : « Votre ligne, contre elle-même », courbe de 61 à 68 % en six mois, pilule ✓ « À règles de calcul constantes ».
- voiceover: "Attention aux fausses pistes. Il n'existe pas de « bon TRS » universel : les grilles qui circulent ne veulent rien dire. Comparez une ligne à son propre historique, avec des règles de calcul qui ne bougent pas."
- duration: 13s
- transition_in: cut
- status: built
- src: compositions/frames/09-bon-trs.html
- type: pain_point
- persuasion: Common-belief vs reality + Counterexample
- beat: Skepticism → recognition
- blueprint: kinetic-type-beats

narrativeRole: Désamorce l'idée reçue la plus répandue (un seuil universel) et donne la seule comparaison valable.
keyMessage: Un TRS ne se compare pas à une grille : il se compare à son propre historique, à règles constantes.

## Frame 10 — Fausse piste n° 2 : le tour de passe-passe

- scene: Titre « Le tour de / passe-passe. » ; carte avant / après : « Avant », temps requis 14 h dont 1 h de panne en rouge, temps utile 10 h 50, 10 h 50 ÷ 14 h = 77 % ; « Après : la panne est requalifiée », temps requis 13 h et l'heure en pointillés « planifiée », temps utile ✓ inchangé, 10 h 50 ÷ 13 h = bandeau « 83 % » ; pilule ✗ « Même machine : 4 h d'arrêt, 650 pièces bonnes. Seul le dénominateur a bougé. »
- voiceover: "Et méfiez-vous du tour de passe-passe. Requalifiez une heure de panne en maintenance planifiée : le temps requis tombe à treize heures, et le TRS grimpe à quatre-vingt-trois pour cent. La machine, elle, n'a pas tourné une minute de plus."
- duration: 14s
- transition_in: crossfade
- status: built
- src: compositions/frames/10-passe-passe.html
- type: pain_point
- persuasion: Counterexample (here is when it breaks) + Demonstration
- beat: Unease

narrativeRole: Montre le piège qui décide de tout : la frontière entre arrêt planifié et arrêt subi est une convention, qu'on peut tordre.
keyMessage: Requalifier une panne en arrêt planifié fait monter le TRS sans rien améliorer : écrivez la règle et ne la changez pas.

## Frame 10 bis — Les cousins du TRS : TRG et TRE

- scene: Titre « Même temps utile, / trois dénominateurs. » et pilule « TRE ≤ TRG ≤ TRS » ; carte en trois lignes (1 h = 2 cqw), le même vert « 10 h 50 » au départ de chaque barre : TRS (Synthétique · OEE) sur le temps requis, ÷ 14 h, bandeau « 77 % » ; TRG (Global · OOE) avec en plus les 2 h d'arrêts planifiés en pointillés, ÷ 16 h, 68 % ; TRE (Économique · TEEP) avec en plus 8 h « atelier fermé », ÷ 24 h, 45 % ; légende en bas.
- voiceover: "Le dénominateur fait donc le chiffre. Gardez les mêmes dix heures cinquante, mais rapportez-les aux seize heures d'ouverture : c'est le TRG, soixante-huit pour cent. Aux vingt-quatre heures de la journée : le TRE, quarante-cinq pour cent. Même machine, trois questions différentes."
- duration: 15s
- transition_in: cut
- status: built
- src: compositions/frames/10b-cousins.html
- type: comparison
- persuasion: Same numerator, three denominators + Callback (le dénominateur du cadre 03 et le piège du cadre 10)
- beat: Clarity

narrativeRole: Demande du 1er octobre 2026 (« Je veux aussi que l'on aborde la notion de TRG et TRE ») : situe le TRS parmi ses deux cousins, juste après le piège du dénominateur.
keyMessage: TRS, TRG et TRE ont le même numérateur, le temps utile ; seul le dénominateur change (temps requis, temps d'ouverture, temps total), donc TRE ≤ TRG ≤ TRS. Vérité : 68 % (TRG) vient de l'article ; 45 % (TRE) est calculé avec ses chiffres (10 h 50 sur 24 h).

## Frame 11 — Affaire classée

- scene: Titre grand format « Affaire / classée. » ; la machine du cadre 01 reçoit une pastille ✓ ; le fil d'enquête est coché en entier ; carte « À retenir » en trois points : TRS = temps utile ÷ temps requis ; = Disponibilité × Performance × Qualité ; il ne juge pas les équipes, il dit où chercher.
- voiceover: "Affaire classée. Le TRS, c'est le temps utile divisé par le temps requis. Il ne juge pas les équipes : il retrouve le temps perdu, et vous dit où chercher en premier."
- duration: 12s
- transition_in: cut
- status: built
- src: compositions/frames/11-affaire-classee.html
- type: branding
- persuasion: Callback (le dossier du cadre 01) + Distillation
- beat: Now I get it
- blueprint: titlecard-reveal

narrativeRole: Referme l'enquête ouverte au cadre 01 et condense le message en une phrase à retenir.
keyMessage: Le TRS = temps utile ÷ temps requis ; il ne juge pas les équipes, il dit où chercher.

## Frame 12 — Se former avec Fichly

- scene: Titre « Pour aller plus loin, / formez-vous. » ; deux cartes blanches côte à côte : à gauche « Formation · Lean Management Green Belt » avec une ceinture verte et la pilule ✓ « Éligible au CPF » ; à droite « Decks de fiches · 40 outils du Lean à portée de main » avec les decks Fichly et la pilule « Imprimés en France » ; dessous « Tous les liens en description » et le logo fichly.
- voiceover: "Pour aller plus loin, formez-vous : notre formation Lean Green Belt est éligible au CPF. Et pour garder les outils sous la main, nos decks de fiches vous suivent sur le terrain. Tous les liens sont en description."
- duration: 15s
- transition_in: crossfade
- status: built
- src: compositions/frames/12-se-former.html
- type: cta
- persuasion: Direct address + Frame-then-fill (l'enquête continue en formation et sur le terrain)
- beat: Resolve + anticipation
- blueprint: titlecard-reveal

narrativeRole: Transforme la compréhension en passage à l'action : se former au Lean (Green Belt, éligible au CPF) et garder les outils sur le terrain (decks de fiches).
keyMessage: Pour aller plus loin : la formation Lean Green Belt éligible au CPF et les decks de fiches Fichly, liens en description.

## Video direction

Référence de mouvement : les 16 tuiles animées Fichly envoyées le 1er octobre 2026 (Andon, SMED, 5 pourquoi, TRS en temps réel…). Même DA (`frame.md`), même grammaire de mouvement, réalisée en Remotion.

- **En direct** : les compteurs défilent jusqu'à leur valeur sur le mot de la voix ; une jauge ou une barre se remplit avec une couleur qui suit la valeur (rouge quand c'est bas, puis jaune, puis vert) ; une pastille « En direct » respire.
- **Des blocs d'une heure** : dans la cascade, les heures sont des blocs. Ils se soulèvent, changent de couleur et glissent d'une ligne à l'autre (comme les blocs SMED), le total se décompte en même temps (14 h → 12 h).
- **Texte à la machine** : causes et définitions s'écrivent caractère par caractère, ligne après ligne (comme les 5 pourquoi) ; la pastille de la ligne en cours est pleine, celles déjà dites passent au contour.
- **Cases en pointillés** : les lignes à venir de la cascade attendent en pointillés ; une pilule numérotée dit l'étape en cours.
- **Ressorts courts** : les pastilles et les pilules arrivent avec un léger dépassement (ressort amorti) ; les cartes glissent de quelques pixels en fondu ; rien ne tourne en rond sans raison.
- **Une seule chose bouge à la fois**, sur le mot qui la nomme ; entre deux mots, de petits mouvements de vie (curseur, pastille « En direct ») évitent l'image figée.
- **Jauge au cadre 07** : la tuile « TRS en temps réel » sert de modèle : les trois taux se remplissent un à un, puis l'arc monte jusqu'à 77 %.

