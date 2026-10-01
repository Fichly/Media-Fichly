# Audit du poids des pages fichly.com (articles de blog en priorité)

Date : 2026-10-01. Lecture seule, aucune mutation exécutée.

Sources :
- **Ahrefs Site Audit**, projet « Fichly » (id 10245763), cible `fichly.com/` (sous-domaines). Dernier crawl : **2026-09-28 12:19 UTC**, 350 URL internes, health score 85. Le crawl s'est fait **sans rendu JavaScript** (`is_rendered=false`). Les champs PageSpeed / CrUX (`psi_*`) sont tous `null` : le crawl n'a pas récupéré de données Core Web Vitals.
- **Shopify Admin GraphQL** (lecture seule) : thèmes, fichiers du thème publié, contenu de certains fichiers, applications installées, articles, tailles de fichiers (Files API).

Attention aux dates : les GIF animés actuellement dans les articles ont été créés entre le **2026-09-30 20:53 et le 2026-10-01 10:17 UTC**, donc **après** le crawl Ahrefs. Les poids d'articles mesurés par Ahrefs ne les incluent pas. À la date du crawl, les illustrations des articles étaient des PNG (ex. `1_SMED_5_etapes.png`).

---

## 1. Constats classés par poids / impact estimé

| # | Constat | Chiffres | Portée | Source |
|---|---|---|---|---|
| 1 | **GIF animés dans le corps des articles**, servis en original depuis `cdn.shopify.com/s/files/...` (pas de paramètre `width`, pas de redimensionnement) | 117 GIF = **127,5 Mo** au total ; 650 Ko à 2,52 Mo chacun (médiane 1,02 Mo), tous en 1200×860. **2,0 à 5,4 Mo par article publié**, et **14,45 Mo** pour `lean-manufacturing-definition-principes-outils` (10 GIF) | Articles uniquement | Shopify (articles.body + files.originalSource.fileSize) |
| 2 | **Image à la une (hero) de l'article en pleine résolution** : `image_url: width: article.image.width`, srcset jusqu'à 3200w, et `sizes="min(1600, 100vw)"` (1600 **sans unité**, donc valeur invalide ; la spec HTML traite un `sizes` invalide comme `100vw`). Image en `loading=eager fetchpriority=high`, c'est l'élément LCP | 4 articles publiés ont un hero en 2931×2100 (5S, MUDA, TRS-définition, Financement), plus le VSM (template Bloggle). PNG à width=2931 mesuré par Ahrefs : Financement 2,22 Mo, 5S 2,08 Mo, MUDA 2,07 Mo, TRS 1,65 Mo. Même PNG à width=1100 : 520 à 727 Ko | Articles | Shopify (sections/main-article.liquid) + Ahrefs |
| 3 | **HTML très lourd sur toutes les pages** (≈ 300 Ko non compressé pour un article dont le corps fait ≈ 40 Ko) | Article 5S : HTML **308 567 o** brut / 66 478 o brotli. 45 scripts inline = **158 893 o (52 % du HTML)**, 10 blocs `<style>` = 53 527 o, `<head>` = 135 818 o | Toutes les pages | Ahrefs (raw_html du crawl) |
| 4 | Dans ce HTML : **scripts inline d'applications** chargés partout | Globo PreOrder 41 683 o ; Judge.me ≈ 46 600 o (settings 34 531 + styles 4 685 + 3 215 + scripts 2 495 + 1 729) ; Pandectes GDPR (settings) 13 733 o ; Delivery Estimator 3 430 + 1 702 o ; widget WhatsApp WATI 1 578 o | Toutes les pages | Ahrefs (raw_html) |
| 5 | Dans ce HTML : **JSON-LD `article | structured_data` qui duplique tout le texte de l'article** (`articleBody`) | 25 139 o, dont `articleBody` = 24 239 o. S'ajoutent 2 autres JSON-LD (Article + FAQPage) écrits dans le corps de l'article : **3 blocs Article/FAQ** au total, 29 619 o | Articles | Ahrefs (raw_html) + Shopify (main-article.liquid l. 417) |
| 6 | Dans ce HTML : **bloc `<style data-shopify>` de 40 371 o** (css-variables : 11 `@font-face`, 10 jeux de couleurs scheme-1 à 11, ≈ 836 variables CSS) | 40 371 o inline dans `<head>` | Toutes les pages | Ahrefs (raw_html) + Shopify (snippets/css-variables.liquid) |
| 7 | **Scripts d'apps tierces (app embeds) chargés sur toutes les pages**, y compris les articles qui n'ont pas de produit | 6 JS + 3 CSS depuis `cdn.shopify.com/extensions/...` : EA Email Popups (spin-wheel), Delivery Estimator, PreOrder Globo, Judge.me (×2 JS, ×2 CSS), Shopify Forms. Poids non mesuré (domaine non crawlé) | Toutes les pages | Ahrefs (links_js / links_css) + Shopify (settings_data.json) |
| 8 | **JS/CSS du thème** (Sleek 1.9.1) sur un article | JS : 7 fichiers, 353 832 o bruts (vendor.js 229 750, theme.js 77 274, cart.js 21 920, header.js 15 833…) ; brotli mesuré ≈ 74 Ko hors cart.js. CSS : 8 fichiers, 176 211 o bruts (theme.css 137 493), ≈ 27,7 Ko brotli. Ahrefs signale « CSS file size too large » pour theme.css | Toutes les pages | Shopify (tailles) + Ahrefs (tailles transférées) |
| 9 | **Scripts plateforme Shopify** (via `content_for_header`) | perf-kit 25 954 o, shopify_pay storefront 23 441 o, load_feature 3 285 o, accelerated-checkout CSS 1 605 o (brotli), + preloads.js ×2, shop-js cart-sync, origin_trials, standard-actions (non mesurés) | Toutes les pages | Ahrefs |
| 10 | **CSS bloquant le rendu** : vendor.css, theme.css, custom.css (`stylesheet_tag` dans `<head>`), Judge.me `shopify_v2.css` (media=all), accelerated-checkout CSS, component-article-card.css et section-main-article.css. **`main-ea-spin.css` est inclus deux fois**, une fois en différé (`media=print onload`) et une fois en bloquant | 7 CSS bloquants sur un article | Articles (et similaires ailleurs) | Ahrefs (raw_html) |
| 11 | Cartes « articles liés » : toujours les 3 articles les plus récents (`blog.articles limit: 4`), images PNG `width=1100` avec `sizes="… calc(100vw - 10rem), 100vw"` alors que la grille fait 3 colonnes (md:f-grid-3-cols) | PNG 1100w mesurés : TPM 314 512 o, Types de maintenance 352 292 o, MTBF 267 347 o (≈ 934 Ko pour les 3), en lazy | Articles | Shopify (snippets/card-article.liquid) + Ahrefs |
| 12 | Photo auteur `Photo_Hugo_Duc.png` en original (257×233, 52 579 o) affichée en 96×96 ou 84×84, sans `loading=lazy` | 52,6 Ko | Articles avec encart auteur | Shopify (body) |

---

## 2. Ahrefs Site Audit

### 2.1 Problèmes liés au poids et à la performance (crawl du 2026-09-28)

| Problème | Importance | URL concernées |
|---|---|---|
| Image file size too large | Error | **20** |
| CSS file size too large | Warning | 1 (`theme.css`) |
| Image broken / Page has broken image | Error | 1 / 1 (`/blogs/nos-articles/REMPLACER-PAR-PHOTO-HUGO` en 404, référencée comme image dans l'article VSM) |
| Page size exceeds 2 MB crawl limit | Error | 0 |
| Slow server response for AI crawlers | Warning | 0 |
| JavaScript broken / redirected | — | 0 |

Limite constatée : l'endpoint `site-audit-issues` renvoie au plus 100 lignes, et la catégorie « Usability and performance » (pages lentes, HTML trop lourd, etc.) n'apparaît pas dans ces 100 lignes. Je n'ai pas pu vérifier ces problèmes-là. Les métriques par page ci-dessous viennent de `site-audit-page-explorer`.

### 2.2 Les 20 images signalées « trop lourdes »

Ces tailles sont celles du fichier **servi au crawler Ahrefs en PNG/JPEG**. Le crawler n'a pas obtenu de WebP/AVIF : `Oplit_et_FIchly.avif` et `Evocon_FIchly_TRS_mesurer.webp` lui ont été servis en `image/png`. Un navigateur qui accepte WebP/AVIF reçoit probablement moins (non vérifiable d'ici). Les dimensions en pixels, elles, sont factuelles.

| Image (paramètre width) | Taille | Pages qui la référencent |
|---|---|---|
| `files/Screenshot_2025-12-17_at_17.56.47.png` (w=2338) | 6 112 795 o | 1 (formation-et-conseil, a-propos ou partenaires-logiciels) |
| `files/Kaizen.png` (w=2859) | 4 305 026 o | 1 (idem) |
| `articles/Article_Financements_CPF_OPCO…png` (w=2931) | 2 224 619 o | 1 (article financement) |
| `articles/Article_5S_-_FICHLY.png` (w=2931) | 2 081 583 o | 1 (article 5S) |
| `articles/Les_8_MUDA…png` (w=2931) | 2 068 796 o | 1 (article MUDA) |
| `articles/Qu_est-ce_que_le_TRS_-_Fichly.png` (w=2931) | 1 648 008 o | 1 (article TRS) |
| `files/Pack_Lean_management_-_FIchly…png` (w=1946) | 1 610 941 o | 15 (accueil, collections, produit pack…) |
| `files/Screenshot_2025-12-17_at_18.02.30.png` (w=866) | 1 553 325 o | 1 |
| `files/Screenshot_2025-12-17_at_17.58.22.png` (w=864) | 1 535 495 o | 1 |
| `files/imageproduitdeck5S…png` (w=1946) | 1 521 911 o | 10 |
| `files/Screenshot_2025-12-17_at_17.56.47.png` (w=1100) | 1 516 790 o | 1 |
| `files/4_4c6d6bc0…png` (w=1946) | 1 196 740 o | 1 |
| `files/5.png` (w=1946) | 1 196 159 o | 5 |
| `files/4_f5580096…png` (w=1946) | 1 183 298 o | 1 |
| `files/Screenshot_2025-12-17_at_18.00.25.png` (w=866) | 1 163 724 o | 1 |
| `files/5.png` (w=1500) | 1 156 880 o | 22 |
| `files/4_c93254e3…png` (w=1946) | 1 135 377 o | 1 |
| `files/4_9c702893…png` (w=1946) | 1 133 895 o | 8 |
| `files/Format_compact_5S.png` (w=1946) | 1 027 812 o | 3 |
| `files/DMAIC_Fichly_Packaging_Recto.png` (w=1946) | 1 004 604 o | 10 |

`Kaizen.png` et les `Screenshot_2025-12-17_*` sont référencés par `/pages/formation-et-conseil`, `/pages/a-propos` et `/pages/partenaires-logiciels`.

### 2.3 Les 10 pages les plus lentes (temps de chargement du document HTML par le crawler)

`loading_time` mesure le téléchargement du seul document HTML depuis les serveurs d'Ahrefs. Il n'inclut ni les images ni le JS.

| # | URL | loading_time | TTFB | HTML brotli / brut | JS / CSS / img |
|---|---|---|---|---|---|
| 1 | /products/le-guide-du-5s-en-20-fiches?_pos=5&_sid=2d68f1d48&_ss=r | **14 550 ms** (TTFB 13 ms, valeur isolée) | 13 | 70 698 / 390 316 | 30 / 19 / 34 |
| 2 | /products/le-guide-de-la-resolution-de-problemes-dmaic?_pos=4… | 966 | 19 | 72 563 / 397 288 | 30 / 19 / 34 |
| 3 | /products/le-guide-du-vsm-en-20-fiches?_pos=1… | 867 | 15 | 70 162 / 386 243 | 30 / 19 / 34 |
| 4 | /products/fiches-lean?_pos=2… | 809 | 19 | 71 166 / 390 571 | 30 / 19 / 36 |
| 5 | / (accueil) | 724 | 17 | 64 219 / 395 944 | 24 / 19 / **51** |
| 6 | /products/fiches-lean | 713 | 18 | 71 675 / 391 700 | 30 / 19 / 36 |
| 7 | /products/le-guide-du-5s-en-20-fiches?_pos=5&_sid=659249c67… | 636 | 11 | 70 608 / 390 316 | 30 / 19 / 34 |
| 8 | /products/le-guide-du-5s-en-20-fiches | 623 | 15 | 70 547 / 390 274 | 30 / 19 / 34 |
| 9 | /products/pack-lean-management-green-belt | 619 | 12 | 73 180 / 424 422 | 30 / 19 / 39 |
| 10 | /products/pack-lean-management-green-belt?_pos=1… | 576 | 11 | 73 222 / 424 464 | 30 / 19 / 39 |

Côté blog : `/blogs/nos-articles/trs-trg-tre-lequel-piloter` 320 ms (TTFB 319 ms), `/la-methode-5s-…` 310 ms, `/blogs/nos-articles` 309 ms. Sur beaucoup de pages, le TTFB est de 250 à 490 ms au lieu de 10 à 20 ms, ce qui ressemble à un cache serveur froid : ce n'est pas une question de poids.

### 2.4 Les 10 pages les plus lourdes (HTML brut non compressé, variantes `?_pos` dédoublonnées)

| # | URL | HTML brut | HTML brotli |
|---|---|---|---|
| 1 | /products/pack-lean-management-green-belt | 424 422 | 73 180 |
| 2 | /pages/entreprises | 416 752 | 66 695 |
| 3 | /products/le-guide-de-la-resolution-de-problemes-dmaic | 397 246 | 72 420 |
| 4 | / (accueil) | 395 944 | 64 219 |
| 5 | /products/40-outils-achats | 395 970 | 70 603 |
| 6 | /products/40-outils-de-la-gestion-de-projet | 392 727 | 70 366 |
| 7 | /products/fiches-lean | 391 700 | 71 675 |
| 8 | /products/40-outils-qse | 391 664 | 70 292 |
| 9 | /products/le-guide-du-5s-en-20-fiches | 390 274 | 70 547 |
| 10 | /products/le-guide-du-vsm-en-20-fiches | 387 372 | 70 652 |

En taille compressée, la plus lourde est **`/blogs/nos-articles` avec 81 085 o** (348 764 o brut). Autre cas : `https://lean.fichly.com/r/wQZ8d7` pèse 77 822 o, **servi sans compression**, avec un TTFB de 456 ms et 27 JS.

### 2.5 Articles de blog (crawl du 28/09)

17 articles crawlés : HTML **62,5 à 68,4 Ko** en brotli, **273,8 à 319,9 Ko** brut (le plus lourd : MUDA, 319 949 o). Chaque article charge **21 JS** (22 pour le VSM, 24 pour « quelle-formation… ») et **12 CSS** (11 à 14), avec 9 à 18 images référencées.

À comparer avec l'accueil (24 JS / 19 CSS / 51 images) et les fiches produit (30 JS / 19 CSS / 34 à 39 images).

### 2.6 Ressources JS/CSS internes (tailles transférées en brotli, Ahrefs)

vendor.js 55 914, perf-kit 25 954, shopify_pay storefront 23 441, theme.css 18 145, theme.js 13 062, gb-formation.css 6 536 (7 pages), vendor.css 3 506, load_feature 3 285, facets.js 3 209, custom.css 3 068, section-main-product.css 2 960, header.js 2 721. Les autres font moins de 2,7 Ko. Les fichiers de `cdn.shopify.com` (extensions d'apps) n'ont pas été crawlés, et leur poids est inconnu.

---

## 3. Thème Shopify publié

- **Thème MAIN** : « Fichly — Green Belt (test) », `gid://shopify/OnlineStoreTheme/201996665177`, préfixe `/t/21`, créé le 2026-06-25, mis à jour le 2026-09-24. Base : **Sleek 1.9.1 (FoxEcom)** (`settings_schema.json` et `js-variables.liquid`).
- Il y a 13 thèmes au total, dont un thème non publié « Fichly — Articles V2 (à publier) » (`/t/22`), créé le 2026-10-01. Je ne l'ai pas analysé.

### 3.1 Assets les plus lourds du thème (taille brute, Shopify)

| Fichier | Octets | Chargé sur les pages crawlées ? (Ahrefs) |
|---|---|---|
| assets/vendor.js | 229 750 | oui, 77 pages |
| assets/theme.css | 137 493 | oui, 77 pages |
| assets/photoswipe.js | 91 258 | non vu |
| assets/theme.js | 77 274 | oui, 77 pages |
| assets/gp-global.css (GemPages) | 69 647 | non vu |
| assets/gb-formation.css | 51 168 | oui, 7 pages (formations) |
| assets/pandectes-rules.min.js | 31 369 | non vu dans le HTML statique |
| assets/section-formation-detail.css | 22 172 | non vu |
| assets/cart.js | 21 920 | oui (article 5S) |
| assets/facets.js | 18 017 | 14 pages |
| assets/quick-order-list.js | 17 847 | non vu |
| assets/component-country-flag.css | 17 347 | non vu |
| assets/header.js | 15 833 | oui, 77 pages |
| assets/section-main-product.css | 15 751 | 36 pages |
| assets/custom.css | 15 291 | oui, 77 pages |

Sections et snippets volumineux qui génèrent du HTML : `sections/custom-content.liquid` 106 697 o, `sections/header.liquid` 58 189 o, `sections/main-cart.liquid` 55 719 o, `sections/featured-product.liquid` 53 376 o, `sections/main-product.liquid` 50 267 o, `sections/quick-view.liquid` 47 315 o, `sections/cart-drawer.liquid` 43 310 o. Des restes de constructeurs de pages sont présents : GemPages (layouts `theme.gempages.*`, `gp-head.liquid`, templates `*.gem-*`), PageFly (`pagefly-main-css/js.liquid`, `pagefly-main.css`), EComposer (`ecom_*.liquid`, `layout/ecom.liquid`) et Bloggle (`main-bloggle-*.liquid`, `article.bloggle-custom.json`).

### 3.2 `layout/theme.liquid` : ce qui est chargé sur TOUTES les pages

Dans le `<head>` :
- `vendor.css`, `theme.css`, `custom.css` via `stylesheet_tag: preload: true`. Ce sont des feuilles bloquantes (`rel=stylesheet media=all` dans le HTML servi).
- `render 'css-variables'` : 11 `@font-face` Montserrat (`font-display: swap`) et toutes les variables de couleurs, inline (40 371 o dans le HTML).
- `{{ content_for_header }}` : scripts Shopify (preloads.js ×2, shop-js, load_feature, shopify_pay storefront, origin_trials, perf-kit, analytics inline 6 660 o, captcha-bootstrap 3 429 o, MCP/webmcp), plus les app embeds.
- `vendor.js` et `theme.js` en **defer**.
- `render 'js-variables'` (script inline ≈ 2,1 Ko).
- `shop.metafields.foxtheme.code_head` / `code_body` : **vides** (null) d'après l'API.
- Préchargements : preconnect `cdn.shopify.com`, `fonts.shopifycdn.com` et `shop.app` ; preload des polices Montserrat n5 et n7 (woff2).

Dans le `<body>` :
- Groupe header : barre d'annonce (3 messages en autoplay) et header (menu `menu-refonte`, sticky). `header.js` en defer, `component-custom-card.css` en différé.
- Groupe footer (footer.js).
- Groupe overlay : **cart-drawer** (cart.js defer, cart.css différé ; à panier vide, il affiche la collection `lean-management` avec une image `Carrousel-produit-1.jpg` en `src width=2000` (133 565 o d'après Ahrefs, présente sur 76 pages) mais en srcset 180 à 540w et en lazy), **search-drawer** (search.js, search.css ; « produits recommandés » `fiches-lean` en 150w lazy), **quick-view**, **popup newsletter (désactivé)**, section apps avec le **formulaire Shopify Forms** inline (form_id 668119).
- `quick-view.js` en defer sur toutes les pages. Le bouton quick view est désactivé (`pcard_show_quickview_button=false`), mais le script se charge quand même parce que `pcard_choose_options_actions` n'est pas défini et prend sa valeur par défaut `open_popup` (settings_schema).
- **Widget WhatsApp WATI** : script injecté dynamiquement (async) depuis `https://wati-integration-prod-service.clare.ai/v2/watiWidget.js?18403`, avec l'image `https://www.wati.io/wp-content/uploads/2023/04/Wati-logo.svg`. Ahrefs ne le voit pas dans les ressources (injection JS sans rendu), et son poids est inconnu.

Polices (settings_data.json) : `type_body_font = montserrat_n5`, `type_header_font = montserrat_n7`, sous-titres en poids 600, servies par Shopify (`/cdn/fonts/montserrat/...`). Pas de Google Fonts.

### 3.3 App embeds activés (`config/settings_data.json`, tous `disabled: false`)

| App embed | Vu dans le HTML des articles (Ahrefs) |
|---|---|
| `judge-me-reviews/blocks/judgeme_core` | oui : loader.js (defer), shopify_v2_leex.js (async), shopify_v2.css (bloquant), widget_v3_theme_leex.css (différé), ≈ 46,6 Ko de scripts et styles inline |
| `delivery-estimator/blocks/app-embed-block` | oui : estimator-init.js (defer), config inline 3 430 + 1 702 o |
| `preorder-globo/blocks/app-embed` | oui : globo.preorder.min.js (defer), **script inline de 41 683 o** |
| `forms/blocks/forms` (Shopify Forms) | oui : shopify-forms-loader.js (defer) |
| `ea-email-popup-spin/blocks/app-embed-block` (EA • Email Popups) | oui : main-ea-spin.js (defer), main-ea-spin.css **inclus deux fois (une fois bloquant)** |
| `gdpr-cookie-consent/blocks/banner` (Pandectes) | `window.PandectesSettings` inline (13 733 o). Le paramètre `theme` y vaut encore « Refonte Fichly // WEBPLEASE V3… » (ancien thème). Aucun `<script src>` Pandectes dans le HTML statique |
| `schema-plus-for-seo/blocks/schemaplus_app_embed` | rien d'identifiable dans le HTML. L'app n'apparaît pas dans `appInstallations` |

### 3.4 Applications installées (`appInstallations`, 26)

Pandectes GDPR, Flow, Legal - France, Messaging, Order Printer Pro, Brevo PushOwl, Avalara Tax Compliance, MyBulk, ShipStation, Mondial Relay, Boxtal, Sendcloud, Make, **PageFly**, **GemPages**, Dougs, **Judge.me**, **Loox Reviews**, **Delivery Estimator**, Search & Discovery, Bundles, **PreOrder Globo**, **Forms**, **EA • Email Popups**, Shopify Claude Connector, Shopify ChatGPT MCP.

Les apps en gras ont un lien avec le storefront. **Bloggle n'est plus installée**, mais ses assets sont toujours appelés (voir 4.4). **Loox** est installée en plus de Judge.me, sans app embed ni script vu dans le HTML.

`scriptTags` : **accès refusé** (scope manquant), non vérifié.

---

## 4. Ce qui est chargé EN PLUS sur un article

Template `templates/article.json` → section `main-article` (blocs : titre, contenu, navigation ; `show_related_posts: true`, `image_height: adapt`). Un seul article publié utilise `article.bloggle-custom` (VSM).

### 4.1 Section `main-article.liquid`
- CSS en plus : `component-article-card.css` (176 o bruts), `section-main-article.css` (4 254 o bruts), tous deux bloquants.
- Image hero : `image_url: width: article.image.width` (pleine résolution en `src`), widths `300…3200`, `sizes="min(1600, 100vw)"` (page_width = 1600 sans unité), eager + `fetchpriority=high`.
- `product-share.js` (defer) si le bloc partage est présent (absent du template actuel).
- 3 cartes « articles liés » (`card-article.liquid`) : `image_url: width: 1100`, widths 165 à 1100, lazy, avec un sizes qui déclare la pleine largeur.
- JSON-LD `{{ article | structured_data }}`, qui inclut tout le texte (`articleBody`).

### 4.2 Corps des articles (articles.body, Shopify)
- Chaque article publié contient un bloc `<style>` inline (`.fichly-article…`) de 4,1 à 5,4 Ko et 2 JSON-LD inline (Article + FAQPage, 3 à 4 Ko).
- Illustrations en **GIF animés 1200×860 non redimensionnés**, servies depuis `cdn.shopify.com/s/files/…`. Elles sont en `loading=lazy`, sauf la photo auteur.

| Article publié | Poids des images du corps |
|---|---|
| lean-manufacturing-definition-principes-outils (absent du crawl Ahrefs) | **14,45 Mo** (10 GIF, dont le plus lourd de 2,52 Mo) |
| tpm-total-productive-maintenance | 5,38 Mo (5 GIF) |
| methode-smed-5-etapes | 5,06 Mo (5 GIF) + iframe Giphy |
| value-stream-mapping-definition-et-etapes | 4,90 Mo (5 GIF) + image cassée `REMPLACER-PAR-PHOTO-HUGO` |
| methode-pdca-roue-de-deming-cycle | 4,58 Mo |
| mtbf-mttr-indicateurs-disponibilite | 4,54 Mo |
| types-de-maintenance-comment-choisir | 4,35 Mo |
| les-muda-les-8-gaspillages-du-lean-guide-complet | 3,92 Mo |
| methode-dmaic-5-etapes | 3,89 Mo |
| taux-de-rendement-synthetique-definition | 3,87 Mo |
| quelle-formation-lean-management-certifiante-choisir | 3,75 Mo + iframe YouTube + scripts Bloggle |
| methode-5-pourquoi-cause-racine | 3,69 Mo |
| la-methode-5s-definition-et-exemples | 3,68 Mo |
| trs-trg-tre-lequel-piloter | 3,44 Mo |
| formation-lean-qualiopi-ce-que-le-label-change | 3,14 Mo |
| financement-formation-lean-tous-les-dispositifs-2026 | 2,04 Mo + 1 image en data-URI base64 (4,5 Ko) |
| green-belt-lean-six-sigma | 2,00 Mo |
| responsable-amelioration-continue-fiche-metier | 1,96 Mo |

D'autres fichiers lourds de la médiathèque ne sont plus référencés dans les corps actuels. Par exemple `PDCA_et_DMAIC_-_Clement_Raymond.png` (5,19 Mo, 3375×4219) et des PNG 1080×1350 d'environ 1,1 Mo (`fichly-symboles-vsm.png`…) étaient encore dans les articles au crawl du 28/09.

### 4.3 Estimation pour l'article 5S (assemblage des mesures, formats PNG/GIF tels que mesurés)
- HTML : 66,5 Ko (brotli).
- Hero : 2931×2100 en PNG, entre 638 Ko (1100w) et 2,08 Mo (2931w) selon la largeur choisie par le navigateur.
- GIF du corps : 3,62 Mo (4 fichiers, lazy).
- Cartes liées : ≈ 934 Ko (3 PNG 1100w, lazy).
- Photo auteur : 52,6 Ko.
- JS/CSS internes : ≈ 74 Ko JS + 27,7 Ko CSS (brotli) + 54 Ko de scripts plateforme Shopify, plus les extensions d'apps (non mesurées) et WATI (non mesuré).
- Total : **≈ 5,5 à 6,9 Mo**, dont plus de 95 % d'images.

### 4.4 Restes de Bloggle (app désinstallée)
- `quelle-formation-lean-management-certifiante-choisir` : le corps de l'article contient `https://d2xvgzwm836rzd.cloudfront.net/lazysizes-bloggle.min.js`, `https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.4/min/tiny-slider.js`, `https://d2xvgzwm836rzd.cloudfront.net/bloggle-article-min.js`, `tiny-slider.css` et `blog_styles--50e62f-dc.min.css`, soit **3 JS + 2 CSS externes** sur 2 domaines tiers.
- `value-stream-mapping-definition-et-etapes` utilise le template `article.bloggle-custom` → `main-bloggle-article.liquid`, qui charge `lazysizes-bloggle.min.js` (async) et `article-layout.min.css` depuis cloudfront.

---

## 5. Non vérifié / limites

- Poids réels côté navigateur (WebP/AVIF négociés par le CDN Shopify, conversion éventuelle des GIF) : impossible à tester, car fichly.com et cdn.shopify.com sont bloqués depuis le conteneur.
- Core Web Vitals (LCP, CLS, INP, TBT) : aucune donnée (quota PageSpeed épuisé, champs PSI/CrUX vides dans Ahrefs).
- Poids des scripts d'apps sur `cdn.shopify.com/extensions/…`, du widget WATI, de Pandectes et des scripts plateforme `cdn.shopify.com` : non crawlés par Ahrefs.
- Problèmes Ahrefs de la catégorie « Usability and performance » : hors des 100 lignes renvoyées par l'API.
- `scriptTags` : accès refusé. Les scripts injectés en JS (WATI, Pandectes, PushOwl éventuel) ne sont pas visibles, car le crawl s'est fait sans rendu.
- Le thème non publié « Fichly — Articles V2 (à publier) » n'a pas été analysé.
- Les mesures Ahrefs datent du 28/09 et sont antérieures au passage aux GIF (30/09–01/10).
