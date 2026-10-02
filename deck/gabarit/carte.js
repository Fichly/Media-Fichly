// Gabarit commun v2 des cartes du deck « Les outils du lean ».
// Pose les icônes Style Fichly (Icones), ajuste le titre, puis dessine au tracé main levée (rough.js,
// graines fixes) les éléments présents sur toutes les cartes : aplat du titre, pilule et ceinture du niveau,
// flèche du QR, guillemets, surlignages, traits de marqueur des renvois, numéros d'étape, pied.
// Les illustrations propres à une carte sont déclarées dans sa fiche.js avec Carte.dessin(nom, fn)
// et appelées sur chaque <svg data-dessin="nom">.
//
// Graines : chaque tracé reçoit une graine fixe tirée de l'élément lui-même (data-graine,
// ou à défaut un hachage de son rôle et de son texte). Ajouter un élément ne change donc pas
// le dessin des autres, et le pied ou la pilule sont tracés pareil sur toutes les cartes.
//
// Contrôles (console.error, donc rendu.js sort en erreur) : corps qui déborde sur le pied,
// encre hors de la zone tranquille de 5 mm (tracés SVG, images, fonds et bordures, et pas seulement le texte),
// titre sur plus de 2 lignes, dessin inconnu.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const MM = 96 / 25.4, ZONE = 5 * MM;
  let C = {};
  const couleurs = () => {
    const css = getComputedStyle(document.body), V = n => css.getPropertyValue(n).trim();
    C = {
      famille: V('--famille'), teinte: V('--famille-teinte'), doux: V('--famille-doux'), pale: V('--famille-pale'),
      ceinture: V('--ceinture'), indigo: V('--indigo'), encre: V('--encre'), marine: V('--marine'), gris: V('--gris'),
      papier: V('--papier'), corail: V('--corail'), corailTexte: V('--corail-texte'), grisObjet: V('--gris-objet'),
      vert: V('--vert'), bleu: V('--bleu'), blanc: '#FFFFFF',
    };
    return C;
  };

  // ---------- Utilitaires ----------
  // hachage FNV-1a d'une chaîne, ramené à une graine rough.js (entier positif)
  function hache(s) {
    let h = 2166136261;
    for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); }
    return (h >>> 0) % 2147483646 + 1;
  }
  const graineDe = (n, role) => n && n.dataset && n.dataset.graine ? +n.dataset.graine : hache(role + '|' + (n ? n.textContent.trim() : ''));
  // options rough.js avec une graine donnée
  const R = (seed, o) => Object.assign({ seed, roughness: 0.9, bowing: 0.8, stroke: C.encre, strokeWidth: 1.2, disableMultiStroke: true }, o);
  const suite = base => { let s = base; return () => s++; };
  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function frag(parent, markup) {
    const doc = new DOMParser().parseFromString(`<svg xmlns="${NS}">${markup}</svg>`, 'image/svg+xml');
    [...doc.documentElement.childNodes].forEach(c => parent.appendChild(document.importNode(c, true)));
  }
  const ajoute = (svg, noeud) => (svg.appendChild(noeud), noeud);
  const alpha = (hex, a) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  };
  function boite(face, n) {
    const F = face.getBoundingClientRect(), r = n.getBoundingClientRect();
    return { x: r.left - F.left, y: r.top - F.top, w: r.width, h: r.height };
  }
  const P = p => `${(+p[0]).toFixed(2)} ${(+p[1]).toFixed(2)}`;
  const rad = d => d * Math.PI / 180;
  function pointe(x, y, ang, l = 6, couleur = C.encre, ep = 1.4) {
    const a1 = ang + 2.6, a2 = ang - 2.6;
    return `<path d="M${P([x + l * Math.cos(a1), y + l * Math.sin(a1)])} L${P([x, y])} L${P([x + l * Math.cos(a2), y + l * Math.sin(a2)])}" fill="none" stroke="${couleur}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const trait = (d, couleur = C.encre, ep = 1.3, extra = '') =>
    `<path d="${d}" fill="none" stroke="${couleur}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  // le <svg> prend sa taille CSS comme repère : 1 unité = 1 px CSS, les tailles de texte sont réelles
  function repere(svg) {
    const r = svg.getBoundingClientRect(), W = +r.width.toFixed(2), H = +r.height.toFixed(2);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    return [W, H];
  }

  // définitions partagées : grain riso, tremblé
  function definitions() {
    const defs = el('svg', { width: 0, height: 0, style: 'position:absolute;width:0;height:0', 'aria-hidden': 'true' });
    document.body.appendChild(defs);
    frag(defs, `<defs>
      <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="t"/>
        <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.05" result="a"/>
        <feComposite in="SourceGraphic" in2="a" operator="in"/>
      </filter>
      <filter id="tremble" x="-6%" y="-6%" width="112%" height="112%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="9" result="w"/>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="1.3" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="tremble-perso" x="-4%" y="-4%" width="108%" height="108%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" result="w"/>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="0.9" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="tremble-aplat" x="-10%" y="-40%" width="120%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="5" result="w"/>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>`);
  }

  // ---------- Icônes Style Fichly : <span class="ic" data-icone="nom" data-accent="vert" data-papier="#…"> ----------
  function poseIcones() {
    document.querySelectorAll('.ic[data-icone]').forEach(n => {
      const t = +(n.dataset.taille || Math.round(n.getBoundingClientRect().width) || 20);
      // accent « famille » : la couleur de la famille de la carte (data-famille), pour décliner sans retoucher le HTML
      const a = n.dataset.accent, accent = a === 'famille' ? C.famille : a || undefined;
      n.innerHTML = Icones.svg(n.dataset.icone, { taille: t, accent, papier: n.dataset.papier || C.papier, titre: '', quart: n.dataset.quart });
    });
  }

  // ---------- Niveau : le libellé suit data-niveau (« Yellow Belt », « Green Belt »…) ----------
  const NIVEAUX = { white: 'White Belt', yellow: 'Yellow Belt', orange: 'Orange Belt', green: 'Green Belt', blue: 'Blue Belt', brown: 'Brown Belt', black: 'Black Belt' };
  function libelleNiveau() {
    const nom = NIVEAUX[document.body.dataset.niveau];
    if (!nom) return console.error(`Niveau inconnu : data-niveau="${document.body.dataset.niveau}"`);
    document.querySelectorAll('.niveau > span:last-child').forEach(n => { n.textContent = nom; });
  }

  // ---------- Titre : échelle de tailles selon la longueur, 2 lignes au plus ----------
  function ajusteTitre(h) {
    const tailles = (h.dataset.tailles || '38 32 26 22').split(/\s+/).map(Number);
    const dispo = h.parentNode.clientWidth;
    h.classList.remove('deux-lignes');
    for (const t of tailles) {
      h.style.fontSize = t + 'px';
      if (h.scrollWidth <= dispo + 0.5 && h.offsetWidth <= dispo + 0.5) return;
    }
    h.classList.add('deux-lignes');
    const lignes = h.querySelector('span').getClientRects().length;
    if (lignes > 2) console.error(`Titre trop long : « ${h.textContent.trim()} » tient sur ${lignes} lignes`);
  }

  // ---------- Pièces communes ----------
  function ceinture(svg) {
    frag(svg, `<g filter="url(#tremble)">
      <path d="M1.5 6 Q15 3.8 28.5 6 L28.5 10 Q15 7.8 1.5 10 Z" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="1" stroke-linejoin="round"/>
      <path d="M14 10.5 L9.5 16.2 L12.6 16.6 L15.4 11.2 Z M16 10.5 L19.8 16.2 L22.6 15.2 L17.6 10.4 Z" fill="${C.ceinture}" stroke="${C.encre}" stroke-width=".9" stroke-linejoin="round"/>
      <rect x="12" y="3.6" width="6" height="8" rx="1.6" fill="${C.ceinture}" stroke="${C.encre}" stroke-width="1"/></g>`);
  }
  function guillemets(svg) {
    const q = 'M4 17 C4 9 9 4 14 2.5 L15.5 5.5 C12 7.5 10.5 10 10.5 12 C13.5 12 15.5 14 15.5 17.5 C15.5 21 12.5 23.5 9.5 23.5 C6 23.5 4 20.5 4 17 Z';
    frag(svg, `<g filter="url(#grain)" transform="translate(1.6 1.3)"><path d="${q}" fill="${C.famille}"/><path d="${q}" transform="translate(13 0)" fill="${C.famille}"/></g>
      <g fill="none" stroke="${C.encre}" stroke-width="1" filter="url(#tremble)"><path d="${q}"/><path d="${q}" transform="translate(13 0)"/></g>`);
  }
  // rectangle arrondi (aplat du titre, comme sur les visuels LinkedIn)
  function rectArrondi(w, h, r) {
    return `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
  }

  function habille(face) {
    const deco = face.querySelector('.deco'), rd = rough.svg(deco);

    face.querySelectorAll('.titre > svg').forEach(s => {
      const w = s.parentNode.offsetWidth, h = s.parentNode.offsetHeight;
      frag(s, `<path d="${rectArrondi(w, h, Math.min(7, h * .16))}" fill="${C.indigo}" filter="url(#tremble-aplat)"/>`);
    });
    // pilule du niveau : un seul tracé continu (fond papier et contour sur le même chemin, donc calés),
    // tremblé léger par le filtre ; le tracé reste dans la boîte (inset 1 px), donc dans la zone tranquille
    face.querySelectorAll('.niveau svg.fond').forEach(s => {
      const w = s.parentNode.offsetWidth - 2, h = s.parentNode.offsetHeight - 2, rr = h / 2;
      const d = `M${rr + 1} 1 H${w - rr + 1} A${rr} ${rr} 0 0 1 ${w - rr + 1} ${h + 1} H${rr + 1} A${rr} ${rr} 0 0 1 ${rr + 1} 1 Z`;
      frag(s, `<path d="${d}" fill="${C.papier}" stroke="${C.marine}" stroke-width="1.1" filter="url(#tremble)"/>`);
    });
    face.querySelectorAll('svg.ceinture').forEach(ceinture);
    face.querySelectorAll('svg[data-guillemets]').forEach(guillemets);

    // flèche de la légende « Templates du deck » vers le QR
    const leg = face.querySelector('.qr-legende'), qr = face.querySelector('.qr');
    if (leg && qr) {
      const L = boite(face, leg), Q = boite(face, qr);
      const a = [L.x + L.w + 3, L.y + L.h * .62], b = [Q.x - 3, Q.y + Q.h * .5];
      const c = [(a[0] + b[0]) / 2, a[1] + 12];
      const ang = Math.atan2(b[1] - c[1], b[0] - c[0]);
      frag(deco, `<g filter="url(#tremble)">${trait(`M${P(a)} Q${P(c)} ${P(b)}`, C.encre, 1.3)}${pointe(b[0], b[1], ang, 5.5, C.encre, 1.3)}</g>`);
    }

    // surligneur sous les mots-clés (une trace par ligne de texte)
    face.querySelectorAll('.surligne').forEach(n => {
      const seed = graineDe(n, 'surligne'), F = face.getBoundingClientRect();
      [...n.getClientRects()].forEach((rect, i) => {
        const x = rect.left - F.left, y = rect.top - F.top, w = rect.width, h = rect.height;
        ajoute(deco, rd.polygon([[x - 2, y + h * .52], [x + w + 4, y + h * .47], [x + w + 2, y + h * .9], [x, y + h * .95]],
          R(seed + i, { fill: alpha(C.famille, .6), fillStyle: 'solid', stroke: 'none', roughness: 1.1 })));
      });
    });
    // question clé des étapes (verso) : surlignage feutre famille sous la moitié basse du texte
    face.querySelectorAll('.question').forEach(n => {
      const seed = graineDe(n, 'question');
      [...n.getClientRects()].forEach((r, i) => {
        const b = boite(face, { getBoundingClientRect: () => r });
        ajoute(deco, rd.polygon([[b.x - 2, b.y + b.h * .5], [b.x + b.w + 3, b.y + b.h * .44], [b.x + b.w + 2, b.y + b.h * .96], [b.x - 1, b.y + b.h]],
          R(seed + i, { fill: alpha(C.famille, .38), fillStyle: 'solid', stroke: 'none', roughness: .6 })));
      });
    });
    // renvois : trait de marqueur dans la couleur de la famille citée, sous le nom
    face.querySelectorAll('.renvoi .nom').forEach(n => {
      const c = getComputedStyle(n).getPropertyValue('--c').trim() || C.famille;
      [...n.getClientRects()].forEach((r, i) => {
        const b = boite(face, { getBoundingClientRect: () => r });
        ajoute(deco, rd.polygon([[b.x - .5, b.y + b.h * .62], [b.x + b.w + 1, b.y + b.h * .58], [b.x + b.w, b.y + b.h * .92], [b.x + 1, b.y + b.h * .95]],
          R(graineDe(n, 'renvoi') + i, { fill: alpha(c, .72), fillStyle: 'solid', stroke: 'none', roughness: .35 })));
      });
    });
    // pied, symétrique : famille ——— (11) ——— outil, © centré dessous ; mêmes graines sur toutes les cartes
    face.querySelectorAll('.pied > svg').forEach(s => {
      const w = s.clientWidth, rs = rough.svg(s), cy = 9, r = 11, pied = s.parentNode;
      const xf = pied.querySelector('.famille').offsetWidth + 8;
      const xo = w - pied.querySelector('.outil').offsetWidth - 8;
      ajoute(s, rs.line(xf, cy, w / 2 - r - 3, cy, R(21, { stroke: C.indigo, strokeWidth: .9, roughness: .5, bowing: .25 })));
      ajoute(s, rs.line(w / 2 + r + 3, cy, xo, cy, R(23, { stroke: C.indigo, strokeWidth: .9, roughness: .5, bowing: .25 })));
      el('circle', { cx: w / 2 + 1, cy: cy + .8, r, fill: C.famille, filter: 'url(#grain)' }, s);
      ajoute(s, rs.circle(w / 2, cy, 2 * r, R(22, { stroke: C.encre, strokeWidth: .9, roughness: .4 })));
    });
    // verso : numéros d'étape manuscrits sur pastille décalée (repère 25 × 26)
    face.querySelectorAll('svg[data-num]').forEach(s => {
      const n = s.dataset.num, rs = rough.svg(s);
      s.setAttribute('viewBox', '0 0 25 26');
      el('circle', { cx: 13.4, cy: 13.8, r: 11.2, fill: C.famille, filter: 'url(#grain)' }, s);
      ajoute(s, rs.circle(12, 12.6, 22.4, R(500 + 7 * n, { strokeWidth: 1.1, roughness: .9 })));
      el('text', { x: 12.4, y: 19.6, 'text-anchor': 'middle', 'font-family': 'Caveat', 'font-weight': 700, 'font-size': 21, fill: C.encre }, s).textContent = n;
    });
    // illustrations de la carte (fiche.js)
    face.querySelectorAll('svg[data-dessin]').forEach(s => {
      const f = DESSINS[s.dataset.dessin];
      if (!f) return console.error(`Dessin inconnu : ${s.dataset.dessin}`);
      f(s, { graine: graineDe(s, 'dessin-' + s.dataset.dessin), face });
    });
  }

  // ---------- Contrôles ----------
  const nomCote = face => face.classList.contains('recto') ? 'recto' : 'verso';
  const etiquette = n => (n.getAttribute && n.getAttribute('class') ? '.' + n.getAttribute('class').trim().split(/\s+/).join('.') : n.tagName.toLowerCase());
  // le corps ne doit pas déborder sur le pied
  function controleCorps(face) {
    const corps = face.querySelector('.corps'); if (!corps) return;
    const bas = corps.getBoundingClientRect().bottom;
    const der = [...corps.children].reduce((m, k) => Math.max(m, k.getBoundingClientRect().bottom), 0);
    if (der > bas + 0.5) console.error(`${nomCote(face)} : le corps déborde de ${(der - bas).toFixed(1)} px sur le pied`);
    // réserve : place libre au-delà de l'air minimal entre blocs (--air ; le corps répartit le reste en space-between)
    const cs = getComputedStyle(corps), air = (parseFloat(cs.rowGap) || 0) * (corps.children.length - 1);
    const plein = air + [...corps.children].reduce((t, k) => {
      const m = getComputedStyle(k); return t + k.getBoundingClientRect().height + parseFloat(m.marginTop) + parseFloat(m.marginBottom);
    }, 0);
    face.dataset.reserve = (corps.clientHeight - plein).toFixed(1);
    if (corps.clientHeight - plein < 6) console.warn(`${nomCote(face)} : réserve de ${(corps.clientHeight - plein).toFixed(1)} px seulement, voir le repli « serre » de carte.css`);
  }
  // toute l'encre (tracés SVG, images, fonds, bordures) reste à 5 mm du bord, sauf data-bleed / data-nocheck
  function controleZone(face) {
    const F = face.getBoundingClientRect(), vus = new Set();
    const hors = (r, m = 0) => r.width + r.height > 0 &&
      (r.left - m < F.left + ZONE - .5 || r.right + m > F.right - ZONE + .5 || r.top - m < F.top + ZONE - .5 || r.bottom + m > F.bottom - ZONE + .5);
    const signale = (n, quoi) => {
      const hote = n.closest('svg') && n.closest('svg').parentElement && n.tagName !== 'IMG' ? n.closest('svg').parentElement : n;
      if (vus.has(hote)) return; vus.add(hote);
      console.error(`${nomCote(face)} : ${quoi} dans la zone tranquille de 5 mm : ${etiquette(hote)}`);
    };
    face.querySelectorAll('path,circle,ellipse,rect,line,polyline,polygon,text,img').forEach(n => {
      if (n.closest('[data-bleed],[data-nocheck],defs')) return;
      // demi-épaisseur du trait, ramenée en px CSS par la matrice de l'élément
      const cs = getComputedStyle(n), m = n.getScreenCTM ? n.getScreenCTM() : null;
      const sw = cs.stroke && cs.stroke !== 'none' ? (parseFloat(cs.strokeWidth) || 0) * (m ? Math.hypot(m.a, m.b) : 1) : 0;
      if (hors(n.getBoundingClientRect(), sw / 2)) signale(n, 'tracé');
    });
    face.querySelectorAll('*').forEach(n => {
      if (n instanceof SVGElement || n.closest('[data-bleed],[data-nocheck]')) return;
      const cs = getComputedStyle(n);
      const fond = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none';
      const bord = ['Top', 'Right', 'Bottom', 'Left'].some(c => parseFloat(cs['border' + c + 'Width']) > 0);
      if ((fond || bord) && hors(n.getBoundingClientRect())) signale(n, 'fond ou bordure');
    });
  }

  const DESSINS = {};
  window.Carte = {
    get C() { return C; }, hache, graineDe, R, suite, el, frag, ajoute, alpha, boite, P, rad, pointe, trait, repere,
    dessin(nom, f) { DESSINS[nom] = f; },
  };
  window.FICHE = {
    ready: document.fonts.ready.then(() => {
      try {
        couleurs();
        definitions();
        libelleNiveau();
        poseIcones();
        document.querySelectorAll('.titre').forEach(ajusteTitre);
        document.querySelectorAll('.face').forEach(f => {
          const e = f.querySelector('.entete, .entete-verso');
          if (e) f.style.setProperty('--bandeau', e.offsetHeight + 'px');
        });
        document.querySelectorAll('.face').forEach(habille);
        document.querySelectorAll('.face').forEach(f => { controleCorps(f); controleZone(f); });
      } catch (e) {
        console.error('Dessin : ' + (e && e.stack || e));
      }
    }),
  };
})();
