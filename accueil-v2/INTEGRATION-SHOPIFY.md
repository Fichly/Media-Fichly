# Accueil V2 : intégration dans le thème Shopify

La maquette (`accueil-v2/maquette-accueil-v2.html`) est une page autonome. Ce document dit comment porter le hero vidéo et la page dans le thème (base Sleek, Montserrat), sans casser le thème en ligne.

## 0. Règles de sécurité

- Travailler sur une **copie** du thème en ligne (Boutique en ligne > Thèmes > Dupliquer), jamais sur le thème publié.
- Créer de nouvelles sections (`fichly-hero-video`, `fichly-choisir`, `fichly-parcours`…) plutôt que modifier celles de Sleek.
- Les prix ne s'écrivent pas en dur : ils viennent des produits (`product.price | money`) ou des réglages de section pour les formations.

## 1. Les fichiers vidéo

| Fichier | Rôle | Poids |
|---|---|---|
| `media/fichly-hero-16x9-av1.mp4` | ordinateur, AV1 | 0,54 Mo |
| `media/fichly-hero-16x9.mp4` | ordinateur, H.264 High 4.0 (repli universel) | 0,67 Mo |
| `media/fichly-hero-4x5-av1.mp4` | mobile, AV1 | 0,51 Mo |
| `media/fichly-hero-4x5.mp4` | mobile, H.264 High 4.0 | 0,63 Mo |
| `media/fichly-hero-*-poster.{avif,webp,jpg}` | affiche (image LCP) | 30 à 160 Ko |

Re-rendu après un changement (photo de Clément Boniol, texte) : `node outils/rendu-hero.js all`.

Deux façons de les servir :

- **A. Fichiers du thème (recommandé ici)** : déposer les 4 MP4 et les 6 affiches dans `assets/` de la copie du thème. On garde nos encodages AV1 + H.264 et l'ordre des sources. Chaque fichier fait moins de 1 Mo.
- **B. Vidéo hébergée par Shopify** (réglage de type `video`) : pratique pour changer la vidéo depuis l'éditeur, mais Shopify ré-encode le fichier (pas d'AV1 garanti). Le code ci-dessous gère les deux : si une vidéo est choisie dans l'éditeur, elle est utilisée, sinon les fichiers du thème.

## 2. Section `sections/fichly-hero-video.liquid`

```liquid
{%- liquid
  assign v_desktop = section.settings.video_desktop
  assign v_mobile = section.settings.video_mobile
-%}
<section class="fh" aria-labelledby="fh-titre-{{ section.id }}">
  <div class="page-width">
    <h1 id="fh-titre-{{ section.id }}">{{ section.settings.titre }}</h1>
    <p class="fh-lede">{{ section.settings.chapo }}</p>

    <div class="fh-stage">
      {%- for block in section.blocks -%}
        {%- render 'fichly-porte', block: block -%}
      {%- endfor -%}

      <figure class="fh-film" id="fh-film-{{ section.id }}" data-state="poster">
        <picture>
          <source media="(max-width: 700px)" type="image/avif" srcset="{{ 'fichly-hero-4x5-poster.avif' | asset_url }}">
          <source media="(max-width: 700px)" type="image/webp" srcset="{{ 'fichly-hero-4x5-poster.webp' | asset_url }}">
          <source media="(max-width: 700px)" srcset="{{ 'fichly-hero-4x5-poster.jpg' | asset_url }}">
          <source type="image/avif" srcset="{{ 'fichly-hero-16x9-poster.avif' | asset_url }}">
          <source type="image/webp" srcset="{{ 'fichly-hero-16x9-poster.webp' | asset_url }}">
          <img src="{{ 'fichly-hero-16x9-poster.jpg' | asset_url }}" width="1920" height="1080"
               fetchpriority="high" alt="{{ section.settings.alt_affiche | escape }}">
        </picture>
        <video muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback
               aria-label="{{ section.settings.label_video | escape }}" aria-describedby="fh-desc-{{ section.id }}">
          {%- if v_mobile != blank -%}
            {%- for s in v_mobile.sources -%}{%- if s.format == 'mp4' -%}
              <source media="(max-width: 700px)" src="{{ s.url }}" type="{{ s.mime_type }}">
            {%- break -%}{%- endif -%}{%- endfor -%}
          {%- else -%}
            <source media="(max-width: 700px)" src="{{ 'fichly-hero-4x5-av1.mp4' | asset_url }}" type='video/mp4; codecs="av01.0.08M.08"'>
            <source media="(max-width: 700px)" src="{{ 'fichly-hero-4x5.mp4' | asset_url }}" type='video/mp4; codecs="avc1.640028"'>
          {%- endif -%}
          {%- if v_desktop != blank -%}
            {%- for s in v_desktop.sources -%}{%- if s.format == 'mp4' -%}
              <source src="{{ s.url }}" type="{{ s.mime_type }}">
            {%- break -%}{%- endif -%}{%- endfor -%}
          {%- else -%}
            <source src="{{ 'fichly-hero-16x9-av1.mp4' | asset_url }}" type='video/mp4; codecs="av01.0.08M.08"'>
            <source src="{{ 'fichly-hero-16x9.mp4' | asset_url }}" type='video/mp4; codecs="avc1.640028"'>
          {%- endif -%}
        </video>
        <button class="fh-btn" type="button" hidden>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>Lire la vidéo</span>
        </button>
      </figure>

      <div class="fh-meta">
        <span>{{ section.settings.legende }}</span>
        <details><summary>Ce que montre la vidéo</summary><p id="fh-desc-{{ section.id }}">{{ section.settings.transcription }}</p></details>
      </div>
    </div>
  </div>
</section>

{{ 'fichly-hero-video.css' | asset_url | stylesheet_tag }}
<script src="{{ 'fichly-hero-video.js' | asset_url }}" defer></script>

{% schema %}
{
  "name": "Fichly : hero vidéo",
  "tag": "div",
  "settings": [
    { "type": "text", "id": "titre", "label": "Titre (H1)", "default": "Des fiches et des formations pour un Lean accessible." },
    { "type": "textarea", "id": "chapo", "label": "Chapeau", "default": "Seul avec nos fiches, ou accompagné en formation : choisissez votre façon d'apprendre le Lean." },
    { "type": "video", "id": "video_desktop", "label": "Vidéo ordinateur (facultatif)", "info": "Vide : fichiers AV1 + H.264 du thème." },
    { "type": "video", "id": "video_mobile", "label": "Vidéo mobile 4:5 (facultatif)" },
    { "type": "text", "id": "alt_affiche", "label": "Texte alternatif de l'affiche", "default": "Hugo Duc, Clément Boniol et Clément Raymond, les trois têtes de Fichly." },
    { "type": "text", "id": "label_video", "label": "Libellé de la vidéo", "default": "Vidéo de présentation de Fichly, muette, 18 secondes" },
    { "type": "text", "id": "legende", "label": "Légende", "default": "Hugo, Clément et Clément vous présentent Fichly en 18 secondes." },
    { "type": "textarea", "id": "transcription", "label": "Transcription (accessibilité)" }
  ],
  "blocks": [
    {
      "type": "porte",
      "name": "Porte (offre)",
      "limit": 2,
      "settings": [
        { "type": "select", "id": "style", "label": "Style", "options": [ { "value": "fiches", "label": "Fiches (clair)" }, { "value": "formations", "label": "Formations (nuit)" } ], "default": "fiches" },
        { "type": "text", "id": "kicker", "label": "Sur-titre", "default": "Les fiches" },
        { "type": "text", "id": "titre", "label": "Titre", "default": "J'ai besoin d'un outil, maintenant." },
        { "type": "textarea", "id": "texte", "label": "Texte" },
        { "type": "text", "id": "prix", "label": "Ligne de prix" },
        { "type": "text", "id": "chiffre", "label": "Chiffre clé" },
        { "type": "text", "id": "bouton", "label": "Bouton", "default": "Explorer les fiches" },
        { "type": "url", "id": "lien", "label": "Lien du bouton" }
      ]
    }
  ],
  "presets": [ { "name": "Fichly : hero vidéo", "blocks": [ { "type": "porte" }, { "type": "porte", "settings": { "style": "formations", "kicker": "Les formations", "titre": "Je veux être formé et certifié.", "bouton": "Voir les formations" } } ] }
  ]
}
{% endschema %}
```

Points d'attention :

- La première porte se place avant la vidéo et la seconde après dans le HTML ; la grille CSS de la maquette (`grid-template-areas: "f v t"`) les met de part et d'autre de la vidéo. Reprendre le CSS de `.stage`, `.door`, `.film`, `.film-btn` de la maquette dans `assets/fichly-hero-video.css`, en remplaçant `--indigo` etc. par les variables du thème si elles existent.
- Reprendre le script de la maquette (bloc « Vidéo du hero ») dans `assets/fichly-hero-video.js` : lecture seulement si la vidéo est visible, pause hors écran et onglet caché, bouton pause, pas de lecture automatique si `prefers-reduced-motion: reduce`.
- `asset_url` sert les fichiers depuis le CDN Shopify avec cache long ; changer le nom du fichier (ou laisser Shopify ajouter `?v=`) à chaque nouvelle version.
- Pour l'option B, ne pas utiliser `video_tag` tel quel : il ajoute ses propres attributs (contrôles natifs, préchargement) et ne permet pas le fondu depuis l'affiche ni la source mobile.

## 3. Le reste de la page

| Bloc de la maquette | Dans le thème |
|---|---|
| Menu « Les fiches » / « Les formations » | Navigation de l'en-tête (Boutique en ligne > Navigation). Le sous-titre de chaque entrée demande un petit ajustement du snippet de menu de Sleek. |
| Fiche ou formation ? | Nouvelle section `fichly-choisir` : 5 blocs « situation » (texte, type fiche / formation / entreprise, produit ou page liés). Les prix des fiches viennent du produit lié. |
| Grille bento des fiches | Section collection existante ou nouvelle `fichly-bento` qui lit la collection `toutes-les-fiches` ; le premier produit prend la grande case. |
| Parcours des ceintures | Peut reprendre la section `gb-parcours` des pages formation, enrichie des durées, prix et financements (réglages de bloc, pas de prix en dur dans le code). |
| Les trois têtes | Métaobjet `auteur` (déjà prévu pour les articles V2) : nom, rôle, photo, citation, LinkedIn. |
| FAQ | `<details name="faq">` : accordéon natif, rien à charger. |

## 4. Référencement et partage

À mettre dans `layout/theme.liquid` (une seule fois, pas dans la section) :

```liquid
{%- if request.page_type == 'index' -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "{{ shop.url }}/#organisation",
      "name": "Fichly",
      "url": "{{ shop.url }}",
      "logo": {{ settings.logo | image_url: width: 512 | prepend: 'https:' | json }},
      "slogan": "Le Lean accessible",
      "founder": [
        { "@type": "Person", "name": "Hugo Duc", "sameAs": "https://www.linkedin.com/in/hugo-duc/" },
        { "@type": "Person", "name": "Clément Boniol", "sameAs": "https://www.linkedin.com/in/clement-boniol/" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "{{ shop.url }}/#site",
      "url": "{{ shop.url }}",
      "name": "Fichly",
      "inLanguage": "fr-FR",
      "publisher": { "@id": "{{ shop.url }}/#organisation" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "{{ shop.url }}/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
</script>
{%- endif -%}
```

- Vérifier que le thème n'émet pas déjà un `Organization` (Sleek en génère parfois un) : n'en garder qu'un.
- `settings.logo` est un nom de réglage courant mais à vérifier dans `config/settings_schema.json` de Sleek.
- Les pages formation portent déjà leur `Course` : ne pas le répéter sur l'accueil.
- Titre et description de l'accueil : Boutique en ligne > Préférences. Proposition : titre « Fichly : fiches et formations Lean (Green Belt CPF) », description « Des fiches pour agir seul dès demain, des formations Lean certifiantes pour être accompagné. Organisme Qualiopi, Green Belt éligible CPF. » (moins de 160 caractères).
- Image de partage (Open Graph) : l'affiche 16:9 de la vidéo, recadrée en 1200 × 630, convient.

## 5. Budget et contrôle

- LCP visé : moins de 2,5 s en 4G sur mobile, avec l'affiche comme élément LCP (≈ 30 Ko en AVIF).
- CLS : 0 (ratios fixés sur la vidéo et les cartes).
- JavaScript propre à la page : quelques Ko, chargé en `defer`.
- Vérifier avec PageSpeed Insights sur l'aperçu de la copie du thème, mobile et ordinateur, avant publication.
- Accessibilité : passer axe DevTools ou Lighthouse sur l'aperçu ; contrôler au clavier le menu, le bouton pause et le sélecteur.
