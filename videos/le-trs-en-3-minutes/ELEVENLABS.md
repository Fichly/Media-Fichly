# Texte à coller dans ElevenLabs · Le TRS en 3 minutes
Script v3 (`SCRIPT.md`), voix « Emilie - Podcast Host ». Demande du 1er octobre 2026 : « Parfois la voix est un peu robotique… la voix est un peu rapide parfois. Donne-moi tout le texte des 3 minutes avec les différents effets. »
Trois blocs, à générer chacun d'une traite (le montage suit ce découpage, sans silence entre les cadres) : bloc 1 = lignes 1 à 5 (la première minute), bloc 2 = lignes 6 à 11, bloc 3 = lignes 12 à 16. Faites 2 ou 3 prises par bloc et gardez la meilleure.
Pourquoi c'était robotique : la voix était générée en `eleven_multilingual_v2`, sans aucune indication de jeu. Les balises d'effets entre crochets ne fonctionnent qu'en **Eleven v3** (ou v4) ; en v2 elles seraient lues à voix haute.
## Version recommandée : Eleven v3, avec effets
### Bloc 1 - Intro, constat, méthode simple, temps d'états (la première minute) (lignes 1 à 5, 1478 caractères)

```text
[warmly] Aujourd'hui, on va comprendre ce qu'est le TRS : le taux de rendement synthétique. [short pause] Et tout ça, en trois minutes.

Pour commencer, regardez cette presse. Elle a tourné toute la journée, en deux équipes : seize heures. [short pause] Et pourtant, le soir, il manque plus de trois heures de production. [curious] Où sont-elles passées ? [warmly] C'est justement à ça que sert le TRS.

[thoughtfully] Alors, la façon la plus simple de le calculer ? On compare les pièces bonnes à ce que la machine aurait dû produire... à son temps de cycle idéal.

Notre presse est faite pour sortir une pièce par minute. [slowly] Sur les quatorze heures où elle devait produire, la maintenance prévue mise à part, ça fait huit cent quarante pièces. Elle en a sorti six cent cinquante bonnes. Six cent cinquante sur huit cent quarante : [short pause] son TRS est de soixante-dix-sept pour cent. [warmly] C'est un bon point de départ... mais ce chiffre ne dit pas où sont passées nos trois heures.

[thoughtfully] Pour le savoir, on découpe la journée en temps d'états. [slowly] On part du temps total : les vingt-quatre heures de la journée. On enlève les heures où l'atelier est fermé : c'est le temps d'ouverture. Puis les arrêts prévus : il reste le temps requis. Puis les arrêts subis : c'est le temps de fonctionnement. Puis les ralentissements : le temps net. Et enfin, les pièces mauvaises : il reste le temps utile. [warmly] Chaque marche retire une famille de pertes.
```
### Bloc 2 - Décomposition : temps requis, les trois marches, produit, verdict (lignes 6 à 11, 1490 caractères)

```text
[warmly] Appliquons ça à notre presse. [slowly] Seize heures d'ouverture, moins deux heures de maintenance prévue : [short pause] il reste quatorze heures de temps requis.

[warmly] Première marche : les arrêts. Dans notre cas, la presse s'est arrêtée deux heures sans que ce soit prévu : une panne, un manque de matière, un réglage. [slowly] Une fois ces arrêts non planifiés enlevés, elle a tourné douze heures sur quatorze. Ce qui nous donne... une disponibilité de 85,7 %.

Deuxième marche : la vitesse. [slowly] À une pièce par minute, en douze heures, elle aurait dû en sortir sept cent vingt. Elle en a sorti six cent quatre-vingts. Des micro-arrêts, une cadence un peu lente... que personne ne note. [short pause] Sa performance est donc de 94,4 %.

Troisième marche : la qualité. [slowly] Sur ces six cent quatre-vingts pièces, trente sont parties au rebut ou en retouche. Il en reste six cent cinquante bonnes, [short pause] soit une qualité de 95,6 %.

[slowly] On multiplie les trois : disponibilité, fois performance, fois qualité. [short pause] [satisfied] Et on retombe sur nos soixante-dix-sept pour cent ! [warmly] Sauf que maintenant, on sait d'où ils viennent.

[thoughtfully] Sur ses quatorze heures, la presse a produit l'équivalent de dix heures cinquante de pièces bonnes. [curious] Les trois heures dix qui manquent ? [slowly] Deux heures en arrêts... quarante minutes en lenteurs... trente en rebuts. [confidently] Le premier chantier est tout trouvé... les ARRÊTS.
```
### Bloc 3 - Fausses pistes, cousins, à retenir, se former (lignes 12 à 16, 1036 caractères)

```text
[seriously] Attention aux fausses pistes. [thoughtfully] Il n'existe pas de bon TRS universel. Comparez votre ligne à elle-même, mois après mois, avec les mêmes règles de calcul.

[mischievously] Et méfiez-vous du tour de passe-passe. Rebaptisez une heure de panne en maintenance planifiée... le temps requis tombe à treize heures, [short pause] et le TRS grimpe à quatre-vingt-trois pour cent. [amused] Sans une seule pièce de plus.

[warmly] C'est d'ailleurs ce qui le distingue de ses deux cousins. [slowly] Rapportez les dix heures cinquante au temps d'ouverture, seize heures : c'est le TRG... soixante-huit pour cent. Et au temps total, vingt-quatre heures : c'est le TRE... quarante-cinq pour cent.

À retenir : le TRS, c'est le temps utile divisé par le temps requis. [pause] [warmly] Il ne juge personne... il vous montre où chercher en premier.

Pour aller plus loin, notre formation Lean Green Belt est éligible au CPF. Et nos decks de fiches gardent les outils sous la main. [short pause] Tous les liens sont en description.
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
### Bloc 3 - Fausses pistes, cousins, à retenir, se former (lignes 12 à 16, 963 caractères)

```text
Attention aux fausses pistes. Il n'existe pas de bon TRS universel. Comparez votre ligne à elle-même... mois après mois, avec les mêmes règles de calcul.
Et méfiez-vous du tour de passe-passe. Rebaptisez une heure de panne en maintenance planifiée... le temps requis tombe à treize heures, et le TRS grimpe à quatre-vingt-trois pour cent. <break time="0.6s" /> Sans une SEULE pièce de plus.
C'est d'ailleurs ce qui le distingue de ses deux cousins. Rapportez les dix heures cinquante au temps d'ouverture, seize heures. C'est le TRG... soixante-huit pour cent. Et au temps total, vingt-quatre heures. C'est le TRE... quarante-cinq pour cent.
<break time="0.6s" /> À retenir : le TRS, c'est le temps utile... divisé par le temps requis. Il ne juge personne — il vous montre où chercher en premier.
Pour aller plus loin, notre formation Lean Green Belt est éligible au CPF. Et nos decks de fiches gardent les outils sous la main. Tous les liens sont en description.
```

## Vérifications faites

Toutes les remarques « bloquant » et « important » ont été appliquées. Les remarques « mineur » aussi, car elles améliorent toutes le naturel. Vérification par script contre SCRIPT.md (version 3) : 93 nombres (entiers en lettres et pourcentages à virgule), identiques et dans le même ordre, dans les deux versions. Le brouillon v2 annonçait 98 avec un autre décompte, mais le constat est le même. En comparant mot à mot, ligne par ligne, seuls les mots de liaison ajoutés diffèrent du script : « Alors » (l.3) et « Et » (l.14) en v3 ; « Eh bien » (l.2), « Alors » (l.3), « donc » (l.11) et « Et » (l.14) en v2. Il n'y a aucun crochet en v2 et aucune balise <break> en v3.

VERSION v3
- Ligne 7 : j'ai retiré le [short pause] placé après un point, qui faisait un double blanc. La phrase devient « Ce qui nous donne... une disponibilité de 85,7 % ».
- Ligne 8 : j'ai retiré le [warmly], qui ne couvrait que 4 mots et répétait le même enchaînement que les lignes 7 et 9. « six cent quatre-vingts : des micro-arrêts » devient « six cent quatre-vingts. Des micro-arrêts, une cadence un peu lente... que personne ne note. », pour qu'on n'entende plus « 680 micro-arrêts ».
- Ligne 9 : j'ai retiré le [warmly], pour la même raison.
- Ligne 10 : [excited] devient [satisfied], parce que [excited] accélérait sur le chiffre clé. La note « Si [excited] accélère » est supprimée.
- Ligne 11 : [warmly] devient [confidently], et « les arrêts » devient « les ARRÊTS ». C'est la seule majuscule d'emphase de la v3.
- Ligne 12 : [cautiously] devient [seriously].
- Ligne 13 : j'ai retiré le [slowly], qui coupait la malice au moment de la chute. J'ai ajouté un [short pause] avant « et le TRS grimpe ». [chuckles], qui est un bruit, devient [amused], qui est une manière de dire.
- Ligne 15 : j'ai retiré le [slowly] en double, déjà actif depuis la ligne 14. [softly] devient [warmly], pour éviter le quasi-chuchotement, difficile à égaliser au montage.
- Ligne 16 : j'ai retiré le [warmly] de tête, qui doublait désormais celui de la ligne 15.
- Arbitrage entre deux remarques : avec ces corrections, le [slowly] de la ligne 8 suit directement celui de la ligne 7, donc il est lui aussi redondant. Je l'ai gardé volontairement comme filet de sécurité sur les chiffres, comme le demandait la remarque sur la ligne 8. En ligne 15, où il n'y a pas de chiffre, je l'ai retiré.
- La correction v2 de la ligne 14 (un point après chaque durée) n'est pas reportée en v3, où [slowly] tient déjà le débit sur ce passage.
- Nouvelles longueurs : bloc 1 = 1 478 caractères, bloc 2 = 1 490, bloc 3 = 1 036, tous sous 2 500. Les chiffres de la remarque (1 493 et 1 043) ont encore bougé avec les autres corrections. Nombre de balises : 12, 17 et 10, au maximum 4 par ligne.

VERSION v2
- Ligne 1 : « TRS... le taux » devient « TRS : le taux ». C'est une définition, pas une hésitation.
- Ligne 5 : j'ai retiré les virgules après « Puis », qui hachaient l'énumération.
- Ligne 10 : « soixante-dix-sept pour cent ! » prend un point d'exclamation pour marquer la révélation.
- Ligne 13 : « planifiée... Le temps requis » devient « planifiée... le temps requis », en minuscule, pour garder l'hypothèse ironique en une seule phrase.
- Ligne 14 : un point après chaque durée (« seize heures. C'est le TRG... », « vingt-quatre heures. C'est le TRE... ») pour reprendre son souffle sur la phrase la plus chargée en chiffres.
- Note corrigée : en ligne 16, aucun « Et » n'a été ajouté. Le « et » du script ouvre simplement une nouvelle phrase. Le seul « Et » ajouté est celui de la ligne 14.
- Longueurs : 1 370, 1 347 et 963 caractères. Balises `<break time="0.6s" />` : 1, 2 et 2.

COMMUN AUX DEUX VERSIONS
- Le repli des pourcentages est donné pour les trois valeurs (85,7 %, 94,4 %, 95,6 %), et non plus seulement pour 85,7 %.
- Ajout des replis de prononciation pour « TRE » et « Lean ».
- Présentation à l'utilisateur : chaque bloc v2 doit être affiché dans un bloc de code (```text … ```), avec des guillemets droits non échappés (`<break time="0.6s" />`). Dans le texte courant, la balise doit être écrite entre accents graves, sinon le Markdown peut la faire disparaître.
