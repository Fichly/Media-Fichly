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

# Le TRS en 3 minutes — storyboard (v2)

## Changes from v1

- « Je veux que l'on pousse à la fin des animations notre formation au lean Green Belt éligible au CPF et nos decks de fiches pour se former » (1er octobre 2026) : le cadre 12 renvoie vers la formation Green Belt (page « Formation Lean Management Green Belt CPF ») et les decks de fiches (« 40 outils du Lean à portée de main », guides en 20 fiches) ; l'article passe dans la description YouTube.
- « je veux la DA fichly » (1er octobre 2026) : la charte bold-poster est remplacée par la direction artistique Fichly (`frame.md` réécrit depuis le gabarit des fiches). Récit, script et découpage inchangés.

## Still open

- Lancement de la voix off (une prise ≈ 2 800 crédits ElevenLabs avec la nouvelle fin) : en attente de l'accord.
- Visuels HD des decks : `cdn.shopify.com` est bloqué dans l'environnement ; la planche utilise l'encart `guides-fichly.png` (basse définition) en attendant des packshots.

## Décisions

- **Message** : le TRS retrouve le temps perdu entre ce que la machine devait produire et les pièces bonnes qu'elle a livrées, et c'est sa décomposition, pas le chiffre, qui dit où agir.
- **Public et arc** : responsables de production, méthodes, maintenance et apprenants Lean. Arc d'enquête (story-explainer) avec, au milieu, une suite ordonnée de trois témoins sur le même décor (process).
- **Format** : 1920×1080, environ 180 s, voix off oui (Emilie - Podcast Host, ElevenLabs), musique non en version 1, sous-titres en fichier `.srt` (rien d'incrusté, donc pas de bande réservée en bas d'image).
- **Fil conducteur** : le **ruban des 16 heures** (16 cases d'une heure, le motif de l'article) épinglé au tableau d'enquête. Il apparaît au cadre 03, se fait annoter par chaque témoin (04 à 06), se recompose en verdict (07) et revient piégé au cadre 10. Un **fil rouge** relie la pièce à conviction au mystère (01) ; les contours bleus et pastilles ✓ / ✗ de la DA désignent ensuite les indices.
- **Charte** (`frame.md`, DA Fichly reprise du gabarit des fiches) : fond papier `#f3f3f3` + `paper.png`, bleu de marque `#4a4aa0`, encre `#23235a`, cartes blanches `#fdfdfb` arrondies à filet `#e2e2ee`, bandes pastel avec pastilles ✓ vertes / ✗ rouges, pastilles numérotées bleues, pictos machine et cartons, ruban six couleurs en bas et logo fichly. Poppins seule (titres 800, bandes et pilules 700, texte 500). Titre en deux temps : ligne bleue, puis ligne blanche dans le bandeau bleu. Codage des pertes : disponibilité rouge `#f16969`, performance jaune `#e6b839`, qualité violet `#aa76b2`, temps utile vert `#8cc978`.
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

- scene: Titre « Le TRS, / l'outil d'enquête. », chapeau « Taux de rendement synthétique » ; trois bandes : ✗ « Une note des équipes », ✓ « Le relevé de ce qui s'est perdu », « Et surtout : il dit où chercher. » ; à droite, schéma « devait produire → pertes → pièces bonnes ».
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

- scene: Titre « 16 h d'ouverture, / 14 h requises. » ; sur une carte blanche, le ruban de 16 cases bleues ; les cases de 6 h et 14 h (maintenance prévue) pâlissent et tombent ; chapeau « Temps requis = ouverture − arrêts planifiés ».
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

- scene: Le ruban de 14 cases : deux virent au rouge « Arrêt » ; pilules ✓ « 12 h de fonctionnement » et ✗ « 2 h d'arrêts subis » ; bande rouge pâle du témoin n° 1 « Disponibilité » avec ✗ Pannes, Manques matière, Réglages imprévus ; « 85,7 % » en rouge foncé.
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

- scene: Le ruban de 12 cases, celle de 11 h entourée de jaune ; la loupe bleue montre les micro-arrêts en encoches jaunes ; carte « 720 attendues / 680 produites », pilule « 40 pièces manquent » ; bande jaune pâle du témoin n° 2 « Performance » ; « 94,4 % » en jaune foncé.
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

- scene: 68 cases bleues (1 case = 10 pièces) ; trois virent au violet et le tampon violet « Non conforme » s'abat ; « 650 » et pilule ✓ « pièces bonnes, sur 680 » ; bande lavande du témoin n° 3 « Qualité » ; « 95,6 % » en violet.
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

- scene: Les trois taux en pilules de leur couleur, reliés par « × » ; « TRS = » puis le grand bandeau bleu « 77 % » ; dessous, la barre des 14 h recomposée (10 h 50 utiles en vert, 2 h d'arrêts, 40 min de cadence, 30 min de rebuts) et la pilule ✓ « Les 3 h 10 sont retrouvées ».
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

- scene: Titre « Où partent / les points ? » ; trois cartes pastel numérotées : Disponibilité −14,3, Performance −5,6, Qualité −4,4 points ; un contour bleu se dessine autour de la première et la pilule « Premier chantier » s'y accroche.
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

- scene: Titre « Le « bon TRS » / n'existe pas. » ; bande rouge pâle « Les grilles qui circulent » avec trois lignes ✗ (< 50 % mauvais, 60 à 70 % correct, > 85 % excellent) ; carte « Votre ligne, mois après mois », courbe de 61 à 68 et pilule ✓ « À règles de calcul constantes ».
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

- scene: Titre « Le tour de / passe-passe. » ; retour du ruban de 14 cases : la case rouge de 17 h pâlit, devient « Maint. » et tombe hors du temps requis ; « 77 % » barré → bandeau « 83 % » ; pilule ✗ « Même machine, même arrêt ».
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

## Frame 11 — Affaire classée

- scene: Titre grand format « Affaire / classée. » ; la machine du cadre 01 reçoit une pastille ✓ ; bande lavande avec la pilule « La règle à garder en tête » : « TRS = temps utile ÷ temps requis. » et « Il ne juge pas les équipes : il dit où chercher. »
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
