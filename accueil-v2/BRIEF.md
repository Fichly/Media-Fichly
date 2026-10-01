# Brief : accueil Fichly V2 moderne + vidéo motion du hero

Demande d'Hugo Duc (fondateur, propriétaire de la marque) :
1. « Je veux que ce soit le plus moderne possible. Que ça respecte les bonnes pratiques. »
2. « Je veux une vidéo motion en haut de la home page qui présente Fichly, avec nos trois têtes dedans. »
3. Objectif de fond inchangé (V1 de la maquette) : qu'on comprenne la différence entre les **fiches** et les **formations**.

Langue : français. Le visiteur est vouvoyé, la marque dit « nous ».

### Retour d'Hugo (prioritaire sur le reste du brief)

> « Je trouve que notre proposition n'est pas assez claire. On présente que les fiches aujourd'hui en home page, mais on mérite de présenter les deux offres dès le départ. »

Critères d'acceptation, vérifiés par capture du premier écran sans défiler :
- À 1440 × 900 **et** à 390 × 844, le visiteur voit sans défiler les **deux** offres nommées (« Les fiches », « Les formations »), chacune avec une promesse d'une ligne et son bouton. Les annotations de maquette sont désactivées pour ce contrôle, et la barre de maquette ne compte pas.
- Les deux offres ont le **même poids visuel** (taille, contraste, position) : aucune ne passe pour secondaire. Le H1 annonce les deux.
- La vidéo ne doit **pas** repousser les offres sous la ligne de flottaison : sur ordinateur, offres à côté de la vidéo ou superposées proprement ; sur mobile, une version compacte des deux offres (par exemple deux cartes côte à côte ou un sélecteur à deux onglets) avant ou juste sous une vidéo de hauteur limitée.
- Le menu présente aussi les deux offres au même niveau.
- La vidéo elle-même consacre un temps équivalent aux fiches et aux formations.

## Règles d'écriture (non négociables)

- Aucun tiret cadratin (—) ni demi-cadratin utilisé comme tiret. Virgules, parenthèses, deux-points.
- Virgule décimale, euro collé : `49,90€`, `1 500€` (espace fine insécable pour les milliers acceptée).
- Guillemets français « … » dans le texte.
- Titres en casse de phrase ; une expression en italique indigo par titre au plus.
- Phrases courtes, verbe d'action d'abord pour les boutons (« Explorer les fiches »).
- Emoji : seulement 🔥 🎁 🇫🇷 👉, avec parcimonie, jamais dans la vidéo.
- **N'invente aucun fait** : chiffre, prix, durée, citation, nom, logo, date. Tout ce qui est affiché doit venir de la liste ci-dessous. Ce qui manque s'écrit « À compléter » et va dans les notes de maquette.

## Faits sourcés (thème Shopify en ligne, 1er octobre 2026)

### Marque
- Fichly, « Le LEAN ACCESSIBLE ». « Comprendre vite, agir mieux. »
- Mission (page d'accueil) : « rendre le savoir industriel accessible à toutes et tous ». Fichly propose « des fiches pédagogiques concrètes et des formations pratiques ».
- Preuves : 4,8/5 ; « +70 000 professionnels conquis » (accueil, À propos : « deux experts suivis par +70 000 professionnels ») ; les pages formation disent « 80 000+ professionnels nous suivent » (incohérence à signaler, garder +70 000 sur l'accueil) ; « 9 sur 10 recommandent nos formations » ; organisme certifié Qualiopi (actions de formation).
- Logos clients de l'accueil : Thales, Decathlon, Safran, KPMG, Dassault, Suez (fichiers image côté boutique ; dans la maquette on les écrit en texte).

### Les trois têtes (page À propos)
| Personne | Rôle affiché | Ce qu'il dit (extraits exacts) | Photo locale | LinkedIn |
|---|---|---|---|---|
| Hugo Duc | Co-Fondateur | « Je suis entrepreneur dans l'âme. Ce que j'aime : créer, tester, transmettre. » ; « rendre l'apprentissage vivant, utile et actionnable » | `assets/auteurs/hugo-duc.png` (122 px, déjà recadrée en cercle, fond transparent) | https://www.linkedin.com/in/hugo-duc/ |
| Clément Boniol | Co-Fondateur | « transformer la complexité en clarté, sans jamais sacrifier l'élégance » ; « Chaque fiche, chaque pictogramme est pensé pour vous aider à comprendre plus vite, retenir plus longtemps, appliquer plus sereinement. » | **aucune photo dans le dépôt** (le CDN Shopify est bloqué depuis la session) : utiliser un médaillon provisoire (initiales « CB » sur fond de couleur de la charte) remplaçable par un fichier `assets/auteurs/clement-boniol.png` de même format, sans autre changement de code | https://www.linkedin.com/in/clement-boniol/ |
| Clément Raymond | Associé | « Quand j'ai découvert Fichly, j'intervenais comme formateur sur leurs programmes. » ; « dépoussiérer la formation pro » ; « construire des formats qui donnent envie de comprendre, envie de faire, envie de progresser » | `assets/auteurs/clement-raymond.png` (124 px, cercle, fond transparent) | https://www.linkedin.com/in/cl%C3%A9ment-raymond-286a48a2/ |

Phrase d'ensemble de la page À propos : « Hugo Duc et Clément Boniol sont suivis chaque jour par des milliers de professionnels sur LinkedIn, grâce à leurs contenus clairs, visuels et profondément ancrés dans la réalité du terrain. »
Lecture fidèle des rôles : Clément Boniol pense les fiches et leurs pictogrammes (design), Clément Raymond vient de la formation (formateur), Hugo Duc crée et transmet (fiches, formations, accompagnement terrain).
Les photos sources sont petites (122-124 px) : les afficher au plus à ~130 px CSS de diamètre sur le site, et au plus ~170 px dans une vidéo 1080p (au-delà c'est flou). Signaler dans les notes qu'il faut des photos HD.

### Les fiches (produits actifs)
| Produit | Format | Prix | Catégorie / couleur |
|---|---|---|---|
| 40 outils du Lean à portée de main | L'essentiel, 40 fiches | 49,90€ | Lean Management, `cat-blue` |
| 40 outils de la QSE à portée de main | L'essentiel, 40 fiches | 49,90€ | QSE, `cat-green` |
| 40 outils de la Gestion de projet à portée de main | L'essentiel, 40 fiches | 49,90€ | Gestion de projet, `cat-yellow` |
| 40 outils des Achats à portée de main | L'essentiel, 40 fiches | 49,90€ | Achats, `cat-purple` |
| Le guide du 5S en 20 fiches | Le guide, 20 fiches | 29,90€ | 5S, `cat-lime` |
| Le guide de la VSM en 20 fiches | Le guide, 20 fiches | 29,90€ | VSM, `cat-teal` |
| Le Guide de la résolution de problèmes (DMAIC) | Le guide, 20 fiches | 29,90€ | DMAIC, `cat-coral` |
| Pack Lean Management (-22%) | Pack | 109,90€ | Lean |

- Fiches imprimées en France. « Un outil = une fiche claire et concise. » Recto : concepts clés, définition, visuel, quand l'utiliser, exemple. Verso : « Comment mettre en place » et bonnes pratiques. Bonus : 15+ templates.
- L'essentiel = vue d'ensemble d'un métier (initiation / synthèse). Le guide = aller plus loin sur un outil (approfondissement).
- Avantages : un outil = une fiche ; apprentissage visuel et synthétique (« parfait pour les esprits visuels, et les gens pressés ») ; conçu par des experts, éprouvé en réunion, coaching et formation ; format nomade.

### Les formations (pages du thème)
| Niveau | Promesse | Durée | Format | Prix | Financement | Validation |
|---|---|---|---|---|---|---|
| White Belt | Comprendre les bases du Lean. | À compléter | À compléter | À compléter | À compléter | À compléter |
| Yellow Belt | Devenir acteur de l'amélioration continue. Sans prérequis. | 3 jours, 21 h, 80 % de pratique | Présentiel inter (Lyon, Bordeaux, Paris) ou intra | 1 500€ HT / participant ; intra sur mesure | OPCO | Attestation Yellow Belt ; QCM final |
| Green Belt | Piloter un projet d'amélioration (DMAIC). | 6 jours, 42 h, 80 % de pratique | Distanciel ou présentiel (Lyon, Bordeaux, Paris) | 1 500€ en distanciel (CPF) ; présentiel inter 2 500€ (page tarifs) ou 2 900€ HT (carte hero) : incohérence à signaler, n'afficher que « dès 1 500€ » | CPF, OPCO, France Travail | Certification RS7114 |
| Black Belt | Mener les projets de transformation à fort impact ; coacher les Green et Yellow Belts. Prérequis Green Belt. | 9 jours, 72 h | Présentiel inter | 4 500€ HT / participant | OPCO | « Certification Black Belt incluse » |

- Pack Lean offert : Green et Black Belt (« valeur +150€ ») ; Yellow Belt : « 40 fiches Lean offertes » / « valeur +49€ ».
- Rendez-vous : « Réserver 30 min d'échange » → https://calendar.app.google/r2FZHTjKzBM6W2Mf6 ; « Sans engagement · réponse sous 24h ».
- Catalogue : https://lean.fichly.com/r/wQZ8d7 ; sessions : /pages/nos-sessions-de-formation.
- Financement : CPF (salarié, la Green Belt distanciel à 1 500€ entre dans le plafond CPF 2026 des certifications RS, sous conditions), OPCO (entreprise), France Travail (CPF + AIF selon situation).
- Intra-entreprise partout en France, cas adapté, devis sous 48 h.

### Avis (réels, page d'accueil) et avis de la page Green Belt (à vérifier)
- Yann D., Responsable industrialisation : « C'est un peu comme un album Panini. […] Pour les novices, ces fiches sont indispensables pour débuter dans l'industrie. »
- Séverine G., Formatrice industrie : « J'ai reçu les fiches. Super pratique, un grand merci pour votre travail à toutes et à tous pour la réalisation de ces fiches. »
- Laurence H., Manager de transition : « je viens de recevoir les 40 fiches […] pour me guider dans la résolution de problèmes. Hâte de les utiliser sur le terrain. »
- Clément B., Consultant Lean : « C'est exactement le support qu'il manquait : un format pratique, complémentaire à une formation, et facile à emporter partout pour garder en tête les principaux concepts Lean et les partager avec les équipes. »
- Page Green Belt (réalité à confirmer) : Camille D., Responsable production : « J'ai piloté mon premier projet DMAIC pendant la formation. Trois mois après, les gains étaient mesurables sur ma ligne. » ; Sophie R., Responsable qualité : « 80 % de pratique, ce n'est pas un slogan. On manipule les outils sur un cas réel, on ne subit pas des slides. »

## Charte (design system Fichly)

- Police unique : **Montserrat** (fichiers locaux : `assets/fonts/montserrat/montserrat.css`, variable 100-900, romain et italique). Ne jamais retaper le logo : `assets/fichly-logo.png` (179 × 60 env., anthracite + point indigo, fond transparent).
- Couleurs : indigo `#3c4499` (signature, CTA, point du logo), indigo-700 `#2e3576`, indigo-100 `#e4e5f3`, indigo-050 `#f3f4fb` ; encre `#2c2c2c`, `#4a4a4a`, `#6b6b6b` ; filets `#e5e5e5` ; surface `#f7f7f7` ; blanc dominant ; nuit (bloc formation) `#151b43`.
- Teintes de catégorie (aplats, jamais du texte) : bleu `#74a3d6`, vert `#8cc978`, jaune `#e6b839`, violet `#aa76b2`, sarcelle `#75bec0`, corail `#f16969`, citron `#e0cf35`, rouille `#b35a23` ; teintes douces `-100` : `#e3ecf6`, `#e8f4e3`, `#faf0d7`, `#f0e5f2`, `#e3f2f2`, `#fce5e5`, `#f8f5d7`, `#f2e2d5`.
- **Liseré signature** (ordre) : indigo, vert, corail, jaune, bleu, rouille. Signe les blocs Fichly.
- Corail réservé aux promos / erreurs. Liens et boutons indigo. Aplats uniquement, pas de dégradés, pas de verre, pas de `backdrop-filter`.
- Rayons : 6 / 10 / 14 / 20 px, pilules 999 px. Ombres douces (`0 4px 12px rgba(44,44,44,.06)`). Nav blanche fixe avec filet bas. Pied de page sombre `#2c2c2c` texte blanc.
- Le point indigo sert de puce et de séparateur (« 4h • 12 participants »).
- Repères visuels de la V1 de la maquette à garder : **fiches = fond clair + boîtes colorées**, **formations = fond nuit + ceintures** (White, Yellow, Green, Black).

## Contrats de fichiers

```
accueil-v2/
  BRIEF.md                          ce fichier
  video/index.html                  scène de la vidéo (SVG), ?format=16x9 (1920×1080) ou ?format=4x5 (1080×1350)
  video/hero.js                     window.HERO = { ready: Promise, duration: s, width, height, draw(t) }, déterministe
  video/storyboard.json             scènes : début, fin, textes affichés (sert de transcription sur la page)
  media/fichly-hero-16x9-av1.mp4    AV1 (libsvtav1), sans piste audio
  media/fichly-hero-16x9.mp4        H.264 High, yuv420p, faststart, sans audio
  media/fichly-hero-4x5-av1.mp4     idem en 1080×1350
  media/fichly-hero-4x5.mp4
  media/fichly-hero-16x9-poster.{avif,webp,jpg}   image d'affiche (cadre le plus représentatif)
  media/fichly-hero-4x5-poster.{avif,webp,jpg}
  maquette-accueil-v2.source.html   page source (marqueurs {{…}} pour les petites images en base64)
  build.py                          génère maquette-accueil-v2.html (inline des petites images), vérifie les fichiers média
  maquette-accueil-v2.html          page publiée (les vidéos restent des fichiers à côté : chemins relatifs media/…)
  INTEGRATION-SHOPIFY.md            comment porter le hero vidéo et la page dans le thème (Liquid, réglages, perf, SEO)
outils/rendu-hero.js                rendu image par image (Playwright + ffmpeg) de video/, ne modifie pas outils/rendu.js
controle/                           captures de contrôle (ignoré par git)
```

Outils disponibles : Node + Playwright (`require('playwright')`, Chromium déjà installé), ffmpeg avec libx264, libsvtav1, libaom-av1, libvpx-vp9. 4 cœurs. Réseau : Google Fonts et npm/cdnjs probablement accessibles, `www.fichly.com` et `cdn.shopify.com` bloqués.
