# Prompt : passer tous les articles du blog Fichly en structure V2

> À copier tel quel dans une nouvelle session Claude Code ouverte sur le dépôt `fichly/media-fichly`, avec le connecteur Shopify actif.

---

Tu travailles pour Hugo Duc, fondateur de Fichly (boutique Shopify `www.fichly.com`, organisme de formation Lean). Ta mission : appliquer la **structure V2 des articles** à tous les articles existants du blog Shopify « Nos articles » et mettre en place ce qu'il faut pour que les **nouveaux articles** sortent directement en V2. Réponds-moi en français.

## 1. Références à lire avant tout

- Maquette validée (référence visuelle et CSS à porter) :
  - `articles-v2/maquette-v2.source.html` : source lisible. Les images y sont remplacées par des marqueurs `{{LOGO}}`, `{{HUGO}}`, `{{X}}`…
  - `articles-v2/maquette-v2.html` : version complète.
  - En ligne : https://claude.ai/artifact/Lutu5jn5xNryvPaVw1nAtu (lis-la avec l'outil Artifact, action `read`).
  - Le tableau « Plan de la structure V2 » en bas de la maquette décrit les 22 blocs : rôle, source du contenu et état actuel.
- Audit des 27 articles au 30 septembre 2026 : `articles-v2/audit-articles-2026-09-30.md`. Il couvre les générations de CSS, les textes à remplir, les notes internes, les liens cassés et les erreurs de données structurées.
- Design system Fichly : https://claude.ai/artifact/NLJzSrno91MypBN7zWTJS2. Lis son `project/README.md` et son `project/tokens.json`.

## 2. État actuel (vérifié le 30 septembre 2026)

- **Thème en ligne** : « Fichly — Green Belt (test) », `gid://shopify/OnlineStoreTheme/201996665177`, basé sur Sleek. Police Montserrat.
- **Gabarit article** : `templates/article.json` → section `main-article` (image pleine largeur, titre, `article.content`, navigation, 3 derniers articles). Date et auteur sont masqués.
- **Suffixes de gabarit** :
  - 16 articles publiés ont le suffixe `article`, qui n'existe pas dans le thème : Shopify retombe sur `article.json`.
  - VSM utilise `bloggle-custom` (application Bloggle).
  - « Quelle formation » et tous les brouillons n'en ont pas.
  - Le blog a le suffixe `ecom-blog`, inexistant lui aussi.
- **Blog** `nos-articles` (`gid://shopify/Blog/110783005017`) : 27 articles, 17 publiés et 10 brouillons.
- **Le design est dans le corps de chaque article.**
  - Un bloc `<style>` de 50 à 70 lignes, en Helvetica, existe en quatre variantes.
  - Les encadrés `.fichly-resume`, `.fichly-essentiel`, `.fichly-toc`, `.fichly-note`, `.fichly-pieges`, `.fichly-cta`, `.fichly-bio`, `.fichly-author`, `.fichly-readmore` et `.fichly-faq` sont en HTML dans le corps.
  - Le JSON-LD est écrit à la main, souvent dans un `<p>`.
  - Certains corps contiennent des commentaires HTML internes.
- **Aucun métachamp article n'existe.**

## 3. Règles de sécurité (non négociables)

1. **Ne modifie jamais le thème en ligne.** Duplique-le (`themeDuplicate`) et travaille sur la copie non publiée. Ne publie un thème qu'avec l'accord explicite d'Hugo.
2. **Sauvegarde avant toute écriture.** Exporte chaque article en JSON dans `articles-v2/sauvegardes/AAAA-MM-JJ/` : id, handle, titre, corps, extrait, suffixe, tags, image et texte alternatif, auteur, dates, statut, champs SEO et métachamps. Commite la sauvegarde avant la première modification.
3. **N'invente aucun contenu.**
   - Ni chiffre, ni citation, ni prix, ni témoignage, ni date.
   - Si une information manque (textes entre crochets, `REMPLACER-…`, `VISUEL-A-CREER`, extrait vide), note-la dans le rapport et demande à Hugo.
   - Ne réécris pas le fond des articles : tu restructures, tu ne rédiges pas.
4. **Ne change ni les handles, ni les URL, ni le statut de publication.** Ne publie aucun brouillon. Garde les `id` existants des intertitres : la Search Console affiche déjà des liens directs vers des sections, comme `#cinq-etapes` et `#definition` sur l'article 5S.
5. **Les prix ne sont jamais écrits en dur.** Le thème les lit dans la boutique.
6. **Procède par petits lots** (3 à 5 articles). Après chaque écriture, relis l'article et vérifie qu'aucun texte n'a été perdu : compare le nombre de mots visibles avant et après, et la liste des intertitres.
7. **Utilise le connecteur Shopify selon son workflow** : `graphql_schema`, puis `validate_graphql_codeblocks`, puis `graphql_query` ou `graphql_mutation`. Vérifie dans le schéma le nom exact des mutations que je cite (`themeDuplicate`, `themeFilesUpsert`, `themePublish`, `articleUpdate`, `metafieldDefinitionCreate`, `metaobjectDefinitionCreate`, `metaobjectCreate`, `metafieldsSet`) avant de t'en servir.
8. **Si `www.fichly.com` n'est pas joignable** depuis ta session, donne à Hugo les liens d'aperçu à ouvrir lui-même. Lis `read_documentation` (topic `environment.network`) pour lui dire comment autoriser le domaine.

## 4. Ce qu'il faut construire dans le thème (sur la copie)

Nouveaux fichiers. Ne touche pas à `main-article.liquid`, qui sert de repli.

- `templates/article.v2.json` → section `main-article-v2`
- `sections/main-article-v2.liquid`
- les snippets `fichly-lisere`, `fichly-auteur`, `fichly-produit`, `fichly-formation`
- `assets/fichly-article-v2.css` : une seule feuille, environ 30 Ko maximum
- `assets/fichly-article-v2.js` : chargé en `defer`, sans bibliothèque externe

### Blocs gérés par le gabarit, dans l'ordre

| # | Bloc | Source |
|---|---|---|
| 1 | En-tête : fil d'Ariane, catégorie, H1, chapeau, auteur, « Mis à jour le », temps de lecture, partage LinkedIn et copie du lien | titre, `fichly.titre_accent` (morceau du titre mis en italique indigo), extrait comme chapeau, `fichly.auteur`, `fichly.date_maj` (sinon `published_at`), `fichly.categorie`. Temps de lecture = mots ÷ 230. |
| 2 | Couverture | image de l'article ; texte alternatif obligatoire |
| 3 | « En résumé » + « L'essentiel à retenir », liseré en tête | `fichly.resume`, `fichly.essentiel` |
| 4 | Sommaire : collant sur ordinateur, repliable sur mobile, liseré en tête, pastille de couleur par partie, partie en cours surlignée, temps restant | **généré en Liquid à partir des H2** pour qu'il soit dans le HTML ; le JS ne gère que le surlignage et la progression |
| 5 | Carte produit sous le sommaire (ordinateur) | premier produit de `fichly.produits` |
| 19 | Encart auteur avec liseré, anneau six couleurs autour de la photo | métaobjet `auteur` |
| 20 | « Les outils de cet article » : 3 produits, plus le pack en option | `fichly.produits` ; pack et texte dans les réglages de la section |
| 21 | « Découvrir nos formations » : Green Belt CPF, fond nuit et liseré, encart animé DMAIC (porter le code de la maquette) | réglages de la section, avec surcharge possible par `fichly.formation` (référence de page). Textes repris de `templates/page.green-belt.json`. |
| 22 | « À lire aussi » : 3 articles de la même catégorie ou partageant un tag | thème |

- Barre de lecture en haut de l'écran : elle découvre le liseré au fil du défilement.
- **Parties en couleur** : le gabarit découpe `article.content` sur les `<h2` (Liquid `split`). Il enveloppe chaque partie dans `<section class="cN">`, N allant de 1 à 6 dans l'ordre du liseré, et ajoute un `id` aux H2 qui n'en ont pas. Au-dessus de chaque H2 : un segment de couleur et « Partie N » (compteur CSS).
- **Données structurées** : retire le `{{ article | structured_data }}` par défaut et génère un seul JSON-LD.
  - Il contient un `Article` (headline = titre, description = `fichly.resume`, image, dates réelles, auteur `Person` avec `sameAs` LinkedIn, `publisher` Fichly avec logo) et un `BreadcrumbList`.
  - **Pas de `FAQPage`** : Google n'affiche plus de résultats enrichis FAQ.

### Couleurs : la signature Fichly

Elles viennent de la maquette et du design system.

- **Le liseré**, dans l'ordre : indigo `#3c4499`, vert `#8cc978`, corail `#f16969`, jaune `#e6b839`, bleu `#74a3d6`, rouille `#b35a23`.
- **Règles** :
  - le liseré signe les blocs Fichly (couverture, résumé, sommaire, auteur, formation, barre de lecture) et jamais les composants de contenu ;
  - une couleur par partie ;
  - les couleurs sont des aplats, jamais du texte ;
  - corail et vert gardent leur sens erreur / à faire ;
  - liens et boutons restent indigo ;
  - encre `#2c2c2c` ;
  - fond de nuit du bloc formation `#151b43`.
- **Police** : celle du thème (Montserrat). Corps à 17 px, colonne de lecture de 680 px.
- Respecter `prefers-reduced-motion`.
- Aucun débordement horizontal à 375 px.

### Composants du corps

C'est le contrat HTML : le rédacteur n'écrit que ce HTML, sans aucun style.

```html
<h2 id="definition">Qu'est-ce que la TPM ?</h2>
<p class="answer">Réponse directe en 1 ou 2 phrases.</p>

<dl class="f-def"><dt>Terme<small>traduction</small></dt><dd>…</dd></dl>
<figure class="f-figure"><img src="…" alt="…"><figcaption><strong>Figure 1.</strong> …</figcaption></figure>
<table>…</table>                                   <!-- le thème l'enveloppe (défilement mobile) et le stylise -->
<div class="f-note"><p><strong>…</strong> …</p></div>      <!-- « Bon à savoir » -->
<ol class="f-steps"><li><h3>Titre</h3><p>…</p></li></ol>
<div class="f-test" data-seuil="4" data-bloquante="5"
     data-ok="…" data-wait="…" data-ko="…">
  <h3>Votre atelier est-il prêt ?</h3>
  <ol><li data-hint="À la place : …">Question ?</li></ol>
</div>
<aside class="f-product" data-handle="fiches-lean" data-contexte="Pour l'étape 3">
  <a href="/products/fiches-lean">40 outils du Lean à portée de main</a><p>Pourquoi ce produit ici.</p>
</aside>
<a class="p-chip" href="/products/le-guide-du-5s-en-20-fiches">Le guide du 5S en 20 fiches</a>
<figure class="f-field" data-auteur="hugo-duc"><blockquote><p>Remarque terrain de l'expert.</p></blockquote></figure>
<ul class="f-dodont"><li><span class="ko">Erreur fréquente</span><span class="ok">À faire</span></li></ul>
<div class="f-faq"><details><summary>Question ?</summary><p>Réponse.</p></details></div>
<ol class="f-sources"><li><a href="…">Titre</a> (éditeur)</li></ol>
```

- `.f-product` et `.p-chip` sont enrichis en JS via `/products/<handle>.js` : visuel ou couleur de catégorie, et prix à jour. Le lien reste dans le HTML si le JS échoue.
- `.f-field` affiche photo, rôle et LinkedIn depuis le métaobjet auteur.
- `.f-test` affiche les boutons Oui/Non et le verdict.

### Champs à créer

- **Métachamps d'article**, namespace `fichly` :
  - `resume` : texte multiligne, 40 à 60 mots ;
  - `essentiel` : liste de textes courts, 4 à 6 points ;
  - `titre_accent` : texte ;
  - `categorie` : texte, avec une liste de choix à valider par Hugo (proposition : Lean Management, Maintenance, Résolution de problèmes, Pilotage, Gestion de projet, Formation) ;
  - `date_maj` : date ;
  - `auteur` : référence de métaobjet ;
  - `produits` : liste de références produit, 3 au plus ;
  - `formation` : référence de page ;
  - `corps_v2` : temporaire, voir §5.
- **Métaobjet `auteur`** : nom, rôle, bio courte, photo, URL LinkedIn, ligne de crédibilité (par exemple « plus de 70 usines formées »). Crée Hugo Duc et Clément Raymond à partir des textes existants (bio des articles, `assets/auteurs/` du dépôt). Pour Clément, demande la bio à Hugo.

## 5. Migration des 27 articles existants

Le corps d'un article est commun à tous les thèmes. Modifier `body` maintenant casserait l'affichage du site en ligne, puisque le CSS est dans le corps. D'où la mise en scène suivante :

- **Option A (préférée)** : le gabarit V2 affiche `fichly.corps_v2` s'il existe, sinon `article.content`. Tu écris le nouveau corps dans ce métachamp, et le site en ligne ne bouge pas. Hugo valide sur l'aperçu du thème copié. Après la publication du thème, tu recopies `corps_v2` dans `body` et tu supprimes le métachamp.
  - **Vérifie d'abord la taille maximale d'un métachamp texte multiligne** dans la doc Shopify (`search_docs_chunks`) face à la taille des corps nettoyés.
- **Option B (repli si A est impossible)** : préparer tous les nouveaux corps en local, puis les écrire en une passe juste après la publication du thème. Le gabarit V2 garde temporairement un CSS de compatibilité pour les anciennes classes `fichly-*`.

**Transformation**, écrite comme un script déterministe dans `articles-v2/outils/`. Il prend la sauvegarde JSON et produit le nouveau corps, les métachamps et un journal des changements. Tu appliques ensuite ses sorties via le connecteur.

- **À retirer** :
  - les blocs `<style>`, les attributs `style=""`, le wrapper `.fichly-article` ;
  - les scripts et attributs Bloggle ;
  - tous les commentaires HTML, ce qui fait disparaître au passage les briefs SEO internes ;
  - tous les JSON-LD et leur `<p>` ;
  - les classes collées depuis l'interface Claude, dans l'article PDCA.
- **À déplacer vers les métachamps ou le gabarit** :
  - `.fichly-resume` → `fichly.resume` ;
  - `.fichly-essentiel` → `fichly.essentiel` ;
  - le sommaire `.fichly-toc` → supprimé, le gabarit le génère ;
  - `.fichly-bio` et `.fichly-author` → supprimés, remplacés par le métaobjet auteur ;
  - `.fichly-readmore` → supprimé, remplacé par « À lire aussi » ;
  - `.fichly-cta` → supprimé, remplacé par le bloc formation. Si ce CTA renvoyait vers un produit, ce produit va dans `fichly.produits`.
- **À convertir en composants V2** :
  - `.fichly-note` → `.f-note` ;
  - `.fichly-pieges` (paires ❌/✅) → `.f-dodont`, sans emojis ;
  - FAQ en `<details>` → `.f-faq` ;
  - tableaux : garder, avec `col-oui`/`col-non` → `ok`/`ko` ;
  - liens `/products/…` du texte → `.p-chip`, ou `.f-product` si c'était un encart.
  - Les URL de la boutique deviennent relatives (`/products/…`, `/blogs/…`).
- **Réponse directe** : ajoute `class="answer"` au premier paragraphe d'une partie seulement s'il répond à la question du H2 en 1 ou 2 phrases. Sinon, ne réécris rien : liste le H2 dans le rapport avec une proposition de réponse, à faire valider par Hugo.
- **Le paragraphe d'introduction reste dans le corps**, avant le premier H2. **L'extrait Shopify** sert de chapeau : s'il est vide, propose-le dans le rapport, ne l'invente pas.
- **Textes alternatifs vides** : télécharge l'image, regarde-la et propose un texte. Ne l'écris qu'après validation, ou marque-la « à valider ».
- **Liens internes** : vérifie chaque lien `/blogs/` et `/pages/` (statut HTTP ou existence du handle) et propose la bonne cible pour les liens cassés. L'audit en liste déjà une partie.
- **Remplis les métachamps** :
  - `categorie` et `produits` : propositions selon le sujet, avec les vrais handles de produits ;
  - `auteur` : Hugo ;
  - `date_maj` : `updatedAt` réel.

**Ordre** :
1. **Pilote** sur l'article TPM (`gid://shopify/Article/1004916867417`).
2. **STOP** : envoie à Hugo le lien d'aperçu (`?preview_theme_id=<id du thème copié>`) et le journal. Attends son accord.
3. Ensuite, les 16 autres articles publiés par lots, puis les 10 brouillons, sans les publier.

## 6. Corrections urgentes à traiter dans la même passe

- **VSM**, mis en lien dans les posts LinkedIn : il contient des textes à remplir (`[C/T poste 1]`… `[attente n]`, `[secteur]`, `[durée du chantier]`) et une photo `REMPLACER-PAR-PHOTO-HUGO`.
  - Demande à Hugo les vraies valeurs de l'exemple chiffré avant tout.
  - Passe-le du gabarit `bloggle-custom` au gabarit V2.
- **Notes internes** visibles dans le code source de pages publiques : TRS-TRG-TRE, PDCA, Green Belt, Responsable amélioration continue, Financement, QUALIOPI. Elles disparaissent avec la transformation. Si la migration complète tarde, propose à Hugo de les retirer tout de suite, seules, après sauvegarde.
- **À signaler à Hugo, sans corriger** :
  - contradictions entre articles (FNE-Formation ; durée et prix de la Green Belt) ;
  - titre QUALIOPI qui contient « | Fichly » ;
  - sur la page Green Belt : prix du présentiel à 2 900 € HT dans la carte de prix contre 2 500 € HT dans le tableau, et liens du parcours vers des pages qui n'existent pas sous ces adresses.

## 7. Publication et nettoyage (avec l'accord d'Hugo uniquement)

1. Rapport final : liste des articles, ce qui a changé, ce qui reste à valider.
2. **STOP** : accord d'Hugo pour publier le thème copié. Garde l'ancien thème, non publié, pour revenir en arrière.
3. Option A : recopie `corps_v2` → `body`, vérifie, puis supprime `corps_v2`.
4. Passe tous les articles sur le suffixe `v2`. Ensuite, fais de V2 le gabarit par défaut : `article.json` reçoit le contenu V2 et l'ancien devient `article.legacy.json`. Ainsi, les nouveaux articles seront en V2 sans réglage.
5. Vérifie en ligne, sur ordinateur et à 375 px :
   - aucune erreur console ;
   - un seul JSON-LD valide par page ;
   - liens et prix corrects ;
   - sommaire et ancres fonctionnels.
6. Retire de l'ancien CSS ce qui ne sert plus. Signale si l'application Bloggle peut être désinstallée.

## 8. Pour les nouveaux articles

- `articles-v2/GUIDE-REDACTION.md` : le contrat HTML du §4 avec un exemple par composant, et les règles du résumé.
  - Le résumé commence par le terme et sa définition, fait 40 à 60 mots, répète le sujet au lieu de « il » ou « elle ».
  - L'essentiel compte 4 à 6 points de moins de 15 mots.
  - Les H2 sont des questions réelles avec une réponse directe.
  - Chaque article a au moins une remarque « Sur le terrain », ses sources, des produits liés et des textes alternatifs.
- Une skill de dépôt `.claude/skills/article-fichly/SKILL.md`. Elle prend un brouillon d'Hugo, le met au format V2, remplit les métachamps et crée l'article **en brouillon** dans Shopify. Elle se termine par la checklist : aucun crochet, aucun commentaire HTML, aucun style, résumé et essentiel remplis, liens vérifiés.

## 9. Git

- Travaille sur une branche dédiée, par exemple `articles-v2`.
- Commite les sauvegardes, les scripts, les journaux, le guide et la skill. Ne commite jamais de jeton ni d'identifiant.
- Pousse la branche et ouvre une PR seulement si Hugo le demande.

## 10. Ce que j'attends de toi au départ

Commence par une passe en lecture seule :
1. sauvegarde de tous les articles ;
2. vérification de la limite de taille des métachamps ;
3. choix entre l'option A et l'option B ;
4. plan détaillé avec les mutations exactes.

Envoie-moi ce plan avant toute écriture sur Shopify.
