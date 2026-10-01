# Vidéos motion design des articles : cadrage

Date : 1er octobre 2026. Objet : choisir la bonne manière de produire des vidéos pédagogiques en motion design, avec voix off, à partir des articles Fichly, pour YouTube : d'abord en horizontal (16:9), puis en vertical (9:16). Premier cas : « Qu'est-ce que le TRS ».

Ce document précède la production. Il ne contient ni script ni storyboard ; il fixe la méthode, l'outil et les décisions à prendre.

---

## 1. Ce que disent les sources

**Charlie Hills (X, 26 septembre 2026).** Opus 5.5 sait enfin produire du motion graphique. Sa méthode tient en trois points :
1. un seul mouvement à la fois, par exemple un graphique qui se transforme ;
2. montrer une référence et nommer chacun de ses états ;
3. demander du HTML et du SVG, puis corriger tour par tour.

**Muhammed Sevimli, montaj** ([github.com/muhammedsevimli/montaj](https://github.com/muhammedsevimli/montaj)). C'est une bibliothèque de 260 vidéos de lancement, filtrables par style, tempo et technique, avec un générateur de prompt. Ce qui nous sert surtout, c'est sa méthode en 6 étapes, adaptée d'une note de Rexan Wong :

| # | Étape | Ce qui arrive si on la saute |
|---|---|---|
| 1 | Choisir une ou deux **références** à imiter, plutôt que décrire un style | L'IA revient à son rendu par défaut : texte centré, dégradé, fondus. Toutes les vidéos se ressemblent. |
| 2 | Un **moteur de rendu** par code, qui sort directement un MP4 | On obtient une page HTML à filmer soi-même, et chaque correction oblige à tout refaire. |
| 3 | De **vrais composants** plutôt que des boîtes dessinées | Les interfaces sonnent faux, et toute la vidéo paraît bon marché. |
| 4 | **Tout le contexte**, puis **trois storyboards** | Couleurs et ton devinés ; on corrige une idée au lieu d'en choisir une. |
| 5 | **Une image fixe par scène** avant d'animer, avec sa phrase de rôle (« que doit comprendre le spectateur à ce moment ? ») | On découvre qu'une scène est fausse après l'animation, et chaque correction coûte un rendu complet. |
| 6 | Des **notes de réalisateur** en vocabulaire caméra, une fois le rendu prêt | Une note vague comme « fais mieux » produit des changements au hasard. |

**HyperFrames (HeyGen, licence Apache 2.0)** ([github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)). C'est le moteur conseillé par montaj pour le montage rapide. Il fournit une compétence Claude Code `/faceless-explainer`, conçue pour notre cas : transformer un article en vidéo pédagogique sans visage, avec voix off. Elle déroule ce parcours : brief → système graphique → storyboard et script → audio et timings mot à mot → plan visuel par scène → construction de chaque scène → contrôles → rendu.

---

## 2. Ce qui fait la qualité

L'outil compte moins que la méthode. Voici les huit leviers, du plus au moins décisif.

1. **Le script et la voix d'abord, l'animation ensuite.** Dans une vidéo pédagogique, c'est la voix qui donne le tempo. On produit la voix off, on récupère l'instant où chaque mot est prononcé, puis on cale les apparitions sur ces mots. On anime sur la voix, et non l'inverse.
2. **Une vidéo n'est pas l'article lu à voix haute.** L'article TRS fait environ 4 300 mots et une vidéo de 4 minutes en compte environ 600. On extrait une thèse, trois à cinq idées qui y mènent, un exemple chiffré et une conclusion. On réordonne, on fusionne, on coupe. L'échec le plus courant consiste à paraphraser l'article dans l'ordre.
3. **Des références choisies, pas un style décrit** (étape 1 de montaj). Pour chaque série, on retient une ou deux vidéos de référence, et l'on nomme leurs états, leur tempo et leurs transitions.
4. **Un système graphique Fichly propre à la vidéo, et une bibliothèque de pictos Lean.** C'est notre équivalent des « vrais composants ». Le système reprend la palette, Poppins, le fond papier, le ruban six couleurs et le bandeau de titre. Les pictos (machine, opérateur, carton, stock, convoyeur, chrono, andon) sont dessinés une fois et réutilisés d'une vidéo à l'autre. On en a déjà le début dans `outils/gabarit.js` et `fiches/cr-occupee-a-100/fiche.js`.
5. **Les principes de l'apprentissage multimédia** (Mayer) :
   - une idée par scène ;
   - signaler à l'écran ce que dit la voix au moment où elle le dit ;
   - ne pas écrire à l'écran la phrase que la voix prononce, seulement les mots-clés et les chiffres ;
   - un même décor qui évolue plutôt que des écrans qui changent sans cesse ;
   - un cas concret suivi du début à la fin, par exemple une machine sur 8 heures.
6. **Storyboard, puis images fixes, puis animation** (étapes 4 et 5 de montaj). On valide trois pistes de storyboard, puis une image fixe par scène avec sa phrase de rôle. Corriger une image fixe prend quelques secondes ; corriger un rendu prend plusieurs minutes.
7. **Des notes de réalisateur précises** (étape 6). Le lexique ci-dessous sert à donner ces notes ; chaque terme existe dans GSAP ou dans HyperFrames.
8. **Le son.** Une musique discrète qui s'efface sous la voix, quelques bruitages sur les apparitions, et un volume normalisé autour de −14 LUFS pour YouTube.

### Lexique pour les notes de réalisateur

| Terme | En anglais | Exemple de note |
|---|---|---|
| Zoom avant | push in | « Approche-toi de la barre du temps utile en 0,8 s, sortie douce, à 1,15x. » |
| Zoom arrière | pull out | « À la fin, recule à 0,85x pour montrer toute la cascade. » |
| Coupe franche | hard cut | « Supprime la transition entre la scène 3 et la scène 4. » |
| Raccord de forme | match cut | « La barre des 8 h devient la jauge de la machine, au même endroit. » |
| Volet | mask reveal | « Ouvre le titre de gauche à droite en 0,5 s. » |
| Panoramique filé | whip pan | « Passe à la scène suivante par un filé horizontal de 0,25 s. » |
| Cascade | stagger | « Fais entrer les trois pertes à 80 ms d'écart. » |
| Dépassement | overshoot | « Les étiquettes dépassent de 8 % puis se posent. » |
| Sortie douce | ease out | « Toutes les entrées en `expo.out`. » |
| Rampe de vitesse | speed ramp | « Les 0,2 premières secondes vite, puis ralentis à 0,3x. » |
| Tenue | hold | « Garde la formule 1,2 s à l'écran avant de passer. » |
| Parallaxe | parallax | « Fais défiler l'atelier du fond à 0,4x la vitesse du premier plan. » |
| Calage sur la voix | VO sync | « La perte "Arrêts" se détache sur le mot "panne". » |

---

## 3. Le choix de l'outil

| | **HyperFrames** (recommandé) | Remotion | Notre chaîne actuelle (SVG + Playwright) |
|---|---|---|---|
| Écriture des scènes | HTML + CSS + GSAP, proche de ce qu'on fait déjà | React | SVG + JavaScript (`draw(t)`) |
| Voix off, musique, mixage | Oui : pistes audio, mixage, effacement de la musique sous la voix | Oui | Non |
| Sous-titres | Oui, avec habillage personnalisable | Oui | Non |
| Contrôles automatiques | `check` : débordements de texte, contraste, erreurs d'exécution ; planche contact | Non | Contrôle maison des débordements |
| Blocs prêts à l'emploi | Environ 400, calés sur la timeline (compteurs, graphiques, sous-titres karaoké…) | Écosystème React | Non |
| Accompagnement Claude Code | 21 compétences, dont `/faceless-explainer` | Compétences de la communauté | Aucun |
| Licence | Apache 2.0, aucun seuil | Gratuit jusqu'à 3 personnes, sinon licence entreprise (à partir de 100 $/mois environ) | Interne |
| Formats | 1920×1080, 1080×1920, 1080×1080 | Tous | 1080×1350 aujourd'hui |

Je recommande HyperFrames pour plusieurs raisons. Il rend ce que notre chaîne actuelle ne sait pas faire : son, sous-titres, transitions, contrôles et prévisualisation. Il reste en HTML, ce qui permet de transposer notre charte telle quelle. Sa licence est libre, et son parcours `/faceless-explainer` correspond exactement à notre besoin. Remotion n'apporterait un plus que si l'on voulait réutiliser des composants React, et il nous ferait probablement payer une licence. Motion Canvas et Manim, très bons pour les vidéos d'explication, ont moins d'outillage autour de Claude ; Manim a en plus un rendu très « mathématique ».

Notre chaîne actuelle reste en place pour les fiches LinkedIn. Le modèle « chaque image est calculée pour un instant t » est le même, et la charte se transposera d'un outil à l'autre.

---

## 4. Test réalisé : la cascade des temps du TRS

Dossier : `videos/essais/trs-cascade/`. Rendu : `videos/essais/trs-cascade/renders/test-trs.mp4` (9 s, 1920×1080, 30 i/s, 670 Ko).

Ce que le test montre :
- HyperFrames 0.8.104 s'installe et rend dans l'environnement cloud, avec le Chromium déjà présent (`HYPERFRAMES_BROWSER_PATH`) et ffmpeg.
- **Vitesse** : 9 s de vidéo rendues en 15,5 s. Une vidéo de 4 minutes se rendrait donc en 7 minutes environ.
- La charte passe telle quelle : Poppins, palette, bandeau de titre, ruban, logo.
- `hyperframes check` est passé : aucune erreur, mise en page correcte sur 9 instants, 44 textes sur 44 conformes au contraste WCAG AA. La planche contact a, elle, servi à repérer et corriger un « g » coupé par le bandeau.
- La mécanique de Charlie Hills fonctionne : une ligne se duplique, descend, puis sa perte se détache, jusqu'au compteur final (TRS = 62,5 %).

Ce que le test ne montre pas encore :
- **la qualité finale.** Le rendu reste générique, faute de référence, de storyboard et de voix, c'est-à-dire précisément les étapes 1, 4, 5 et 6 de montaj ;
- **la voix off et le calage sur les mots**, qui demandent les accès décrits en section 9 ;
- **le vertical.**

---

## 5. Voix off

- **Fournisseur recommandé : ElevenLabs.** C'est la meilleure qualité en français, et le compte est déjà connecté à Claude. L'API `text-to-speech/…/with-timestamps` renvoie l'audio et l'instant de chaque caractère dans le même appel, d'où l'on tire les timings mot à mot pour caler l'animation et les sous-titres.
- **Trois options de voix**, qui sont un choix de marque :
  - (a) une voix française de la bibliothèque ElevenLabs ;
  - (b) un clone de la voix de Hugo ou de Clément (ElevenLabs Professional Voice Clone : 30 min à 2 h d'enregistrement propre). Les auteurs des articles parleraient eux-mêmes dans les vidéos ;
  - (c) un vrai enregistrement, qu'on transcrit ensuite pour récupérer les timings.
- **Solution de repli :** Kokoro, une voix locale gratuite. Elle ne propose qu'une voix française, de qualité moindre, et ne convient qu'aux brouillons.

---

## 6. Horizontal, puis vertical

- **Master 16:9** en 1920×1080 à 30 i/s, d'une durée de 3 à 5 minutes, avec un fichier de sous-titres `.srt` à téléverser sur YouTube (indexé, activable par le spectateur).
- **Le vertical 9:16 (1080×1920) n'est pas un recadrage.** Chaque scène est recomposée : les éléments s'empilent au lieu de s'aligner, et les textes grossissent. On garde la même voix et les mêmes pictos.
- **Pour les Shorts** (jusqu'à 3 minutes) : un montage court de 45 à 60 s centré sur une seule idée, par exemple « Le TRS en 60 secondes : la cascade des temps ». Les sous-titres y sont incrustés, car la plupart des Shorts sont regardés sans le son. Le Short renvoie vers la vidéo longue et vers l'article.

---

## 7. La chaîne complète, appliquée au TRS

```
videos/trs/
  veille/
    sources.md        articles Fichly (via Shopify) + vidéos YouTube : titre, chaîne, vues, durée, angle, transcription
    synthese.md       ce que disent les vidéos existantes, ce qui leur manque, notre angle
  BRIEF.md            public, durée, ton, références visuelles, voix
  SCRIPT.md           voix off (environ 600 mots pour 4 min)
  STORYBOARD.md       scène par scène : rôle, visuel, mouvements, mots de la voix qui déclenchent chaque apparition
  storyboard.html     planche des images fixes, à valider avant d'animer
  audio/              voix off, timings mot à mot, musique, bruitages
  compositions/       une scène = un fichier HTML
  renders/            trs-16x9.mp4, trs-9x16.mp4, trs.srt
```

| Étape | Ce qu'on produit | Validation par Fichly |
|---|---|---|
| 1. Veille | L'article TRS et ses articles liés (TRS/TRG/TRE, TPM, MTBF/MTTR, SMED) via Shopify ; les 10 à 15 vidéos YouTube les plus vues sur le TRS, avec leur transcription | Valider l'angle de la synthèse |
| 2. Script | Thèse, 3 à 5 idées, un exemple chiffré, une conclusion, un renvoi vers l'article et les fiches Lean | Valider le texte, mot à mot |
| 3. Storyboard | Trois pistes, puis une image fixe par scène avec sa phrase de rôle | Choisir une piste, valider les images |
| 4. Voix off | Une ou plusieurs prises ElevenLabs, avec timings | Choisir la voix et la prise |
| 5. Animation | Les scènes calées sur la voix, puis des tours de notes de réalisateur | Notes en vocabulaire caméra |
| 6. Rendu | MP4 16:9 + `.srt`, puis déclinaison 9:16 et Short | Valider avant publication |

**Une piste d'accroche à éprouver pendant la veille :** « Votre machine tourne toute la journée. Pourtant, sur 8 heures, elle n'en produit que 5 de bonnes. » Elle prolonge le post LinkedIn de Clément du 6 octobre (« Machine à 100 %, le stock grossit. »).

**Ce que la veille récupère des vidéos YouTube :** leur angle, leur structure, leurs exemples, leurs erreurs et ce qui leur manque. On n'en reprend ni le texte ni les images.

---

## 8. Les 10 ressources d'interface partagées

jiro.build, shadcn/ui, Aceternity, Magic UI, Motion Primitives, Uiverse, 21st.dev, Spline, Unicorn Studio, component.gallery.

Ces bibliothèques sont faites pour des sites et des applications. Leurs animations tournent en temps réel : framer-motion, CSS, WebGL. Or un rendu vidéo calcule chaque image pour un instant précis. Repris tels quels, ces composants sautent ou figent au rendu. On s'en sert donc comme sources d'idées, et on refait l'effet choisi en GSAP, calé sur la timeline.

| Ressource | Utilité pour nos vidéos |
|---|---|
| 21st.dev, shadcn/ui | Utiles si une scène montre un logiciel, par exemple un tableau de bord de suivi du TRS chez un partenaire logiciel (le CTA de l'article). On reprend alors leurs composants pour que l'interface fasse vraie (étape 3 de montaj). |
| Magic UI, Motion Primitives, Aceternity, jiro.build | Idées d'effets de texte, de compteurs et de liaisons animées, à refaire en GSAP. Le catalogue HyperFrames contient déjà des équivalents calés sur la timeline (`count-up`, `number-wheel`, `animated-bar-chart`, `caption-pill-karaoke`…). |
| Spline | Une machine ou un atelier en 3D, éventuellement. À exporter en séquence d'images, car l'environnement cloud n'a pas de carte graphique. Pas prioritaire. |
| Unicorn Studio | Effets WebGL pour des fonds ou des transitions. Même limite. Pas prioritaire. |
| Uiverse, component.gallery | Peu utiles pour expliquer des concepts Lean. |

Pour le Lean, aucune de ces bibliothèques ne fournit de visuels d'atelier. Notre bibliothèque de pictos Fichly (section 2, point 4) reste à construire, et c'est elle qui donnera leur identité aux vidéos.

---

## 9. Accès à ouvrir dans l'environnement cloud

L'environnement bloque aujourd'hui `x.com`, `www.youtube.com`, `fichly.com`, `api.elevenlabs.io`, `huggingface.co` et `cdn.jsdelivr.net`. Les registres npm et PyPI ainsi que `raw.githubusercontent.com` sont ouverts.

| Besoin | Réglage | Sans ce réglage |
|---|---|---|
| Voix off et timings mot à mot | Domaine `api.elevenlabs.io` + variable `ELEVENLABS_API_KEY` | Générer la voix depuis le connecteur ElevenLabs, télécharger le MP3 à la main, le déposer dans le dépôt, et trouver un autre moyen d'obtenir les timings |
| Recherche et transcriptions YouTube | Domaines `youtube.com` et `www.youtube.com` (pour `yt-dlp`) | Recherche web seulement : titres trouvés au hasard, aucune transcription |
| Transcription locale (facultatif) | Domaine `huggingface.co` | Pas de transcription d'un enregistrement réel (option voix c) |

Ces réglages se font dans les paramètres de l'environnement : menu de l'environnement cloud dans la barre de titre de la session, puis Modifier, Accès réseau et Variables d'environnement. Ils s'appliquent à la session suivante.

---

## 10. Décisions à prendre

1. **Outil :** HyperFrames (recommandé), Remotion, ou la chaîne actuelle étendue.
2. **Voix :** bibliothèque ElevenLabs, clone de Hugo ou de Clément, ou vrai enregistrement.
3. **Direction visuelle :** trois pistes à comparer sur la même scène :
   - (A) « Fiche Fichly animée », dans la continuité des fiches LinkedIn : fond papier, barres, pictos à plat ;
   - (B) « Éditorial crème » : titres plus éditoriaux, illustrations au trait, rythme posé ;
   - (C) « Atelier illustré » : un atelier en vue isométrique, avec une machine et un opérateur qu'on suit d'une scène à l'autre.
4. **Format long :** durée cible (3, 4 ou 5 minutes), vouvoiement (comme dans les articles), présence d'une musique.
5. **Accès** de la section 9.
