# Texte à coller dans ElevenLabs · Le TRS en 3 minutes

Script v3 (`SCRIPT.md`, 17 lignes), voix « Emilie - Podcast Host ». Demandes du 1er octobre 2026 : « Parfois la voix est un peu robotique… la voix est un peu rapide parfois. Donne-moi tout le texte des 3 minutes avec les différents effets », puis « la partie sur le TRG et TRE, je veux qu'on prenne le temps d'expliquer à quoi ça correspond concrètement par rapport au TRS » et la nouvelle phrase sur les decks.

Trois blocs, à générer chacun d'une traite (le montage suit ce découpage, sans silence entre les cadres) : bloc 1 = lignes 1 à 5 (la première minute), bloc 2 = lignes 6 à 11, bloc 3 = lignes 12 à 17. Un paragraphe = une ligne du script = un cadre. Faites 2 ou 3 prises par bloc et gardez la meilleure.

Pourquoi c'était robotique : la voix était générée en `eleven_multilingual_v2`, sans aucune indication de jeu. Les balises d'effets entre crochets ne fonctionnent qu'en **Eleven v3** (ou v4) ; en v2, elles seraient lues à voix haute.

## Version recommandée : Eleven v3, avec effets

### Bloc 1 - Intro, constat, méthode simple, temps d'états (la première minute) (lignes 1 à 5, 1478 caractères, 12 effets)

```text
[warmly] Aujourd'hui, on va comprendre ce qu'est le TRS : le taux de rendement synthétique. [short pause] Et tout ça, en trois minutes.

Pour commencer, regardez cette presse. Elle a tourné toute la journée, en deux équipes : seize heures. [short pause] Et pourtant, le soir, il manque plus de trois heures de production. [curious] Où sont-elles passées ? [warmly] C'est justement à ça que sert le TRS.

[thoughtfully] Alors, la façon la plus simple de le calculer ? On compare les pièces bonnes à ce que la machine aurait dû produire... à son temps de cycle idéal.

Notre presse est faite pour sortir une pièce par minute. [slowly] Sur les quatorze heures où elle devait produire, la maintenance prévue mise à part, ça fait huit cent quarante pièces. Elle en a sorti six cent cinquante bonnes. Six cent cinquante sur huit cent quarante : [short pause] son TRS est de soixante-dix-sept pour cent. [warmly] C'est un bon point de départ... mais ce chiffre ne dit pas où sont passées nos trois heures.

[thoughtfully] Pour le savoir, on découpe la journée en temps d'états. [slowly] On part du temps total : les vingt-quatre heures de la journée. On enlève les heures où l'atelier est fermé : c'est le temps d'ouverture. Puis les arrêts prévus : il reste le temps requis. Puis les arrêts subis : c'est le temps de fonctionnement. Puis les ralentissements : le temps net. Et enfin, les pièces mauvaises : il reste le temps utile. [warmly] Chaque marche retire une famille de pertes.
```

### Bloc 2 - Décomposition : temps requis, les trois marches, produit, verdict (lignes 6 à 11, 1490 caractères, 17 effets)

```text
[warmly] Appliquons ça à notre presse. [slowly] Seize heures d'ouverture, moins deux heures de maintenance prévue : [short pause] il reste quatorze heures de temps requis.

[warmly] Première marche : les arrêts. Dans notre cas, la presse s'est arrêtée deux heures sans que ce soit prévu : une panne, un manque de matière, un réglage. [slowly] Une fois ces arrêts non planifiés enlevés, elle a tourné douze heures sur quatorze. Ce qui nous donne... une disponibilité de 85,7 %.

Deuxième marche : la vitesse. [slowly] À une pièce par minute, en douze heures, elle aurait dû en sortir sept cent vingt. Elle en a sorti six cent quatre-vingts. Des micro-arrêts, une cadence un peu lente... que personne ne note. [short pause] Sa performance est donc de 94,4 %.

Troisième marche : la qualité. [slowly] Sur ces six cent quatre-vingts pièces, trente sont parties au rebut ou en retouche. Il en reste six cent cinquante bonnes, [short pause] soit une qualité de 95,6 %.

[slowly] On multiplie les trois : disponibilité, fois performance, fois qualité. [short pause] [satisfied] Et on retombe sur nos soixante-dix-sept pour cent ! [warmly] Sauf que maintenant, on sait d'où ils viennent.

[thoughtfully] Sur ses quatorze heures, la presse a produit l'équivalent de dix heures cinquante de pièces bonnes. [curious] Les trois heures dix qui manquent ? [slowly] Deux heures en arrêts... quarante minutes en lenteurs... trente en rebuts. [confidently] Le premier chantier est tout trouvé... les ARRÊTS.
```

### Bloc 3 - Fausses pistes, TRG et TRE, à retenir, se former (lignes 12 à 17, 2027 caractères, 16 effets)

```text
[seriously] Attention aux fausses pistes. [thoughtfully] Il n'existe pas de bon TRS universel. Comparez votre ligne à elle-même, mois après mois, avec les mêmes règles de calcul.

[mischievously] Et méfiez-vous du tour de passe-passe. Rebaptisez une heure de panne en maintenance planifiée... le temps requis tombe à treize heures, [short pause] et le TRS grimpe à quatre-vingt-trois pour cent. [amused] Sans une seule pièce de plus.

[thoughtfully] Vous l'avez vu : tout dépend du temps par lequel on divise. Et c'est exactement ce qui distingue le TRS de deux autres taux : le TRG et le TRE. Les trois partent des mêmes dix heures cinquante de pièces bonnes. [slowly] Le TRS les divise par les quatorze heures où la machine devait produire... soixante-dix-sept pour cent. Il juge la machine quand on lui demande de produire. Le TRG, lui, compte aussi les arrêts prévus comme des pertes, comme nos deux heures de maintenance. On divise donc par les seize heures d'ouverture... soixante-huit pour cent. Il regarde la machine sur tout le temps où l'atelier est ouvert. [mischievously] Et avec lui, pas de tour de passe-passe : panne ou maintenance, l'heure est perdue quand même.

[thoughtfully] Le TRE va encore plus loin : il compte aussi les heures où l'atelier est fermé. [slowly] On divise par les vingt-quatre heures de la journée... quarante-cinq pour cent. Il regarde la machine sur toute la journée. [warmly] Et il montre ce qui reste à prendre : ces huit heures de fermeture, c'est de la capacité encore libre... pour une troisième équipe, par exemple. [confidently] Alors, devant un taux qu'on vous annonce, demandez toujours sur quel temps il est calculé.

[slowly] À retenir : le TRS, c'est le temps utile divisé par le temps requis. [pause] [warmly] Il ne juge personne... il vous montre où chercher en premier.

Pour aller plus loin, notre formation Lean Green Belt est éligible au CPF. Et nos decks de fiches sur le Lean vous aident au quotidien, sur le terrain. [short pause] Tous les liens sont en description.
```

## Les effets utilisés (v3)

| Effet | Ce qu'il fait |
|---|---|
| `[warmly]` | Ton chaleureux et souriant, celui d'une collègue qui explique. C'est la couleur de base de la voix off. |
| `[thoughtfully]` | Ton posé et réfléchi, pour lancer une explication (« Alors, la façon la plus simple… », « Pour le savoir… »). |
| `[curious]` | Vraie intonation de question, avec une légère tension (« Où sont-elles passées ? », « Les trois heures dix qui manquent ? »). |
| `[slowly]` | Ralentit le débit. Placé sur les passages chiffrés et les énumérations, c'est la principale parade contre la voix trop rapide. |
| `[satisfied]` | Satisfaction posée sur la révélation (« on retombe sur nos soixante-dix-sept pour cent ! »), sans accélérer ni monter dans les aigus. |
| `[confidently]` | Assurance pour la conclusion de la démonstration (« Le premier chantier est tout trouvé… les ARRÊTS »). |
| `[seriously]` | Ton sérieux et franc de mise en garde (« Attention aux fausses pistes »), sans hésitation. |
| `[mischievously]` | Ton malicieux et complice pour le tour de passe-passe (renommer une panne en maintenance planifiée). |
| `[amused]` | Léger amusement dans la voix sur la chute « Sans une seule pièce de plus », sans éclat de rire. |
| `[short pause]` | Courte pause avant un résultat ou une chute (14 h, 77 %, 94,4 %, 95,6 %, « et le TRS grimpe… »). |
| `[pause]` | Pause un peu plus longue, juste avant la phrase de conclusion « Il ne juge personne ». |
| `... (points de suspension, ponctuation)` | Pas une balise : ils créent un petit temps suspendu avant un résultat et ralentissent les énumérations (« Deux heures en arrêts... quarante minutes en lenteurs... »). |
| `ARRÊTS (majuscules)` | Pas une balise : léger accent d'insistance sur ce mot. Une seule majuscule d'emphase dans toute la version v3. |

## Réglages et solutions de repli

Rappel général : les balises entre crochets ne sont pas lues à voix haute en Eleven v3, et chacune s'applique jusqu'à la balise suivante. Collez chaque bloc en entier, en une seule génération par bloc. Faites 2 ou 3 prises par bloc et gardez la meilleure, car la v3 change un peu à chaque génération.

VERSION RECOMMANDÉE : Eleven v3 (blocs « v3 »)
- Modèle : Eleven v3, voix « Emilie - Podcast Host », en français.
- Stability : « Natural » (position du milieu). « Creative » est plus expressif mais peut dériver : accélération, rire, changement de timbre. « Robust » est plus stable, mais suit moins bien les balises et sonne plus monotone, donc plus robotique.
- Speed (vitesse) : si votre interface propose ce curseur pour la v3, baissez-le un peu, vers 0,90. Je n'ai pas pu vérifier qu'il existe pour ce modèle. S'il n'y est pas, ce sont [slowly], les pauses et la ponctuation qui ralentissent le débit.
- Style et Speaker boost : selon le modèle, ces réglages peuvent ne pas apparaître en v3. S'ils sont là, laissez Style à 0 ou presque et activez Speaker boost.
- Lignes vides : gardez-les entre les paragraphes, elles donnent une petite respiration à chaque changement de cadre. Si un blanc est trop long au montage, remplacez la ligne vide par un simple retour à la ligne.

VERSION DE SECOURS : Eleven Multilingual v2 (blocs « v2 », le modèle utilisé jusqu'ici)
- N'utilisez que les blocs v2 : en v2, les crochets seraient lus à voix haute.
- Speed : environ 0,90 à 0,95. C'est le réglage le plus direct contre le débit trop rapide.
- Stability : environ 45 à 50 %. Plus haut, la voix devient monotone et robotique. Plus bas, elle devient instable et peut accélérer.
- Similarity : environ 75 %.
- Style : partez de 0 et montez par petits pas, jusqu'à 15 % environ, si la voix reste plate. Au-delà de 20 %, elle peut se déformer ou accélérer.
- Speaker boost : activé.
- Pauses : les balises `<break time="0.6s" />` sont déjà placées (1 dans le bloc 1, 2 dans le bloc 2, 2 dans le bloc 3). N'en ajoutez pas, car trop de `<break>` font accélérer la v2 ou créent des artefacts. Vérifiez qu'elles sont collées avec des guillemets droits, sans barre oblique inverse.
- Gardez les retours à la ligne simples entre les lignes du script.
Ces valeurs sont des suggestions de départ, pas des chiffres tirés du guide ElevenLabs. Les noms et l'emplacement des curseurs peuvent varier selon le modèle et la version de l'interface.

SI UNE PRISE NE VA PAS
- Pourcentage à virgule qui bute : utilisez l'arrondi parlé, le repli prévu par le script. « presque quatre-vingt-six pour cent » pour 85,7 % (ligne 7), « un peu plus de quatre-vingt-quatorze pour cent » pour 94,4 % (ligne 8), « presque quatre-vingt-seize pour cent » pour 95,6 % (ligne 9). L'écran garde le chiffre exact.
- « TRE » lu comme un mot (« tre ») au lieu d'être épelé : remplacez-le par « T.R.E. » dans ce bloc seulement.
- « Lean » prononcé « lé-anne » : remplacez-le par « Lîne » (ce texte n'apparaît pas à l'écran).
- Mot en majuscules épelé lettre par lettre (ARRÊTS, SEULE) : remettez-le en minuscules.
- v3, [satisfied] trop exubérant ou trop rapide sur les 77 % (ligne 10) : remplacez-le par [warmly].
- v3, [amused] qui produit un rire trop long (ligne 13) : supprimez-le. [mischievously] reste alors actif.
- v3, [slowly] qui traîne trop sur l'énumération des temps d'états (ligne 5) : remplacez-le par [thoughtfully].
- v2, fin de bloc qui s'accélère encore : baissez Speed à 0,90 avant de toucher au texte.

## Version de secours : Eleven Multilingual v2, sans crochets

À n'utiliser qu'avec le modèle v2. Les pauses `<break time="0.6s" />` sont déjà placées : n'en ajoutez pas.

### Bloc 1 - Intro, constat, méthode simple, temps d'états (la première minute) (lignes 1 à 5, 1370 caractères)

```text
Aujourd'hui, on va comprendre ce qu'est le TRS : le taux de rendement synthétique. Et tout ça — en trois minutes.
Pour commencer, regardez cette presse. Elle a tourné toute la journée, en deux équipes. Seize heures. Et pourtant, le soir... il manque plus de trois heures de production. Où sont-elles passées ? Eh bien, c'est justement à ça que sert le TRS.
Alors, la façon la plus simple de le calculer ? On compare les pièces bonnes à ce que la machine aurait dû produire, à son temps de cycle idéal.
Notre presse est faite pour sortir une pièce par minute. Sur les quatorze heures où elle devait produire — la maintenance prévue mise à part — ça fait huit cent quarante pièces. Elle en a sorti six cent cinquante bonnes. Six cent cinquante, sur huit cent quarante. <break time="0.6s" /> Son TRS est de soixante-dix-sept pour cent. C'est un bon point de départ. Mais ce chiffre ne dit pas où sont passées nos trois heures.
Pour le savoir, on découpe la journée en temps d'états. On part du temps total : les vingt-quatre heures de la journée. On enlève les heures où l'atelier est fermé : c'est le temps d'ouverture. Puis les arrêts prévus — il reste le temps requis. Puis les arrêts subis — c'est le temps de fonctionnement. Puis les ralentissements — le temps net. Et enfin, les pièces mauvaises... il reste le temps utile. Chaque marche retire une famille de pertes.
```

### Bloc 2 - Décomposition : temps requis, les trois marches, produit, verdict (lignes 6 à 11, 1347 caractères)

```text
Appliquons ça à notre presse. Seize heures d'ouverture... moins deux heures de maintenance prévue. Il reste quatorze heures de temps requis.
Première marche : les arrêts. Dans notre cas, la presse s'est arrêtée deux heures sans que ce soit prévu. Une panne, un manque de matière, un réglage. Une fois ces arrêts non planifiés enlevés, elle a tourné douze heures sur quatorze. Ce qui nous donne... une disponibilité de 85,7 %.
Deuxième marche : la vitesse. À une pièce par minute, en douze heures, elle aurait dû en sortir sept cent vingt. Elle en a sorti six cent quatre-vingts. Des micro-arrêts, une cadence un peu lente... que personne ne note. Sa performance est donc de 94,4 %.
Troisième marche : la qualité. Sur ces six cent quatre-vingts pièces, trente sont parties au rebut, ou en retouche. Il en reste six cent cinquante bonnes. Soit une qualité de 95,6 %.
On multiplie les trois. Disponibilité... fois performance... fois qualité. <break time="0.6s" /> Et on retombe sur nos soixante-dix-sept pour cent ! Sauf que maintenant — on sait d'où ils viennent.
Sur ses quatorze heures, la presse a produit l'équivalent de dix heures cinquante de pièces bonnes. <break time="0.6s" /> Les trois heures dix qui manquent ? Deux heures en arrêts. Quarante minutes en lenteurs. Trente en rebuts. Le premier chantier est donc tout trouvé... les ARRÊTS.
```

### Bloc 3 - Fausses pistes, TRG et TRE, à retenir, se former (lignes 12 à 17, 1877 caractères)

```text
Attention aux fausses pistes. Il n'existe pas de bon TRS universel. Comparez votre ligne à elle-même... mois après mois, avec les mêmes règles de calcul.
Et méfiez-vous du tour de passe-passe. Rebaptisez une heure de panne en maintenance planifiée... le temps requis tombe à treize heures, et le TRS grimpe à quatre-vingt-trois pour cent. <break time="0.6s" /> Sans une SEULE pièce de plus.
Vous l'avez vu : tout dépend du temps par lequel on divise. Et c'est exactement ce qui distingue le TRS de deux autres taux : le TRG et le TRE. Les trois partent des mêmes dix heures cinquante de pièces bonnes. Le TRS les divise par les quatorze heures où la machine devait produire... soixante-dix-sept pour cent. Il juge la machine quand on lui demande de produire. Le TRG, lui, compte aussi les arrêts prévus comme des pertes, comme nos deux heures de maintenance. On divise donc par les seize heures d'ouverture... soixante-huit pour cent. Il regarde la machine sur tout le temps où l'atelier est ouvert. Et avec lui, pas de tour de passe-passe : panne ou maintenance, l'heure est perdue quand même.
Le TRE va encore plus loin : il compte aussi les heures où l'atelier est fermé. On divise par les vingt-quatre heures de la journée... quarante-cinq pour cent. Il regarde la machine sur toute la journée. Et il montre ce qui reste à prendre : ces huit heures de fermeture, c'est de la capacité encore libre... pour une troisième équipe, par exemple. Alors, devant un taux qu'on vous annonce, demandez toujours sur quel temps il est calculé.
<break time="0.6s" /> À retenir : le TRS, c'est le temps utile... divisé par le temps requis. Il ne juge personne — il vous montre où chercher en premier.
Pour aller plus loin, notre formation Lean Green Belt est éligible au CPF. Et nos decks de fiches sur le Lean vous aident au quotidien, sur le terrain. Tous les liens sont en description.
```

## Vérifications faites

- **Chiffres et mots :** une fois les effets, les pauses et la ponctuation retirés, chaque bloc reprend mot pour mot le texte de `SCRIPT.md`, à quelques mots de liaison près (« Alors » en ligne 3, plus « Eh bien » en ligne 2 et « donc » en ligne 11 dans la version v2). La règle des nombres est tenue : entiers en toutes lettres, pourcentages à virgule en chiffres.
- **Syntaxe ElevenLabs :** aucune balise entre crochets dans la version v2, aucun `<break>` dans la version v3. Au plus 4 effets par ligne du script, au plus 2 `<break>` par bloc. Tous les blocs font moins de 2 500 caractères.
- **TRG et TRE (lignes 14 et 15), relus contre l'article :** les définitions sont celles du tableau OEE / OOE / TEEP de l'article. TRS = temps utile ÷ temps requis (77 %). TRG = temps utile ÷ temps d'ouverture : il compte les arrêts prévus comme des pertes (68 %, chiffre de l'article). TRE = temps utile ÷ temps total, 10 h 50 sur 24 h (45 %, calculé avec les chiffres de l'article). L'article réservant l'arbitrage d'un investissement au TRS, le texte ne présente pas le TRE comme « l'indicateur pour acheter une machine ». Il en reste au constat : les 8 h de fermeture, c'est de la capacité encore libre.
- **Enchaînements :** « À retenir » (ligne 16) reprend `[slowly]` en tête, puisque la ligne 15 se termine désormais sur `[confidently]`.
