// Gabarit commun des cartes du deck « Les outils du lean ».
// Dessine, au tracé main levée (rough.js), les éléments présents sur toutes les cartes :
// aplat du titre, pilule et ceinture du niveau, flèche du QR, guillemets, surlignages, renvois,
// soulignés de rubrique, filets, pied, numéros d'étape, coches. Ajuste aussi la taille du titre.
// Les illustrations propres à une carte sont déclarées dans sa fiche.js avec Carte.dessin(nom, fn)
// et appelées sur chaque <svg data-dessin="nom">.
//
// Graines : chaque tracé reçoit une graine fixe tirée de l'élément lui-même (data-graine,
// ou à défaut un hachage de son rôle et de son texte). Ajouter un élément ne change donc pas
// le dessin des autres, et le pied ou la pilule sont tracés pareil sur toutes les cartes.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  let C = {};
  const couleurs = () => {
    const css = getComputedStyle(document.body), V = n => css.getPropertyValue(n).trim();
    C = {
      famille: V('--famille'), teinte: V('--famille-teinte'), doux: V('--famille-doux'),
      ceinture: V('--ceinture'), indigo: V('--indigo'), encre: V('--encre'),
      marine: V('--marine'), gris: V('--gris'), papier: V('--papier'), blanc: '#FFFFFF',
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
  // suite de graines locale à un dessin : g() renvoie base, base+1, …
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
  function note(svg, x, y, t, o = {}) {
    const n = el('text', { x, y, 'font-family': 'Caveat', 'font-weight': o.graisse || 700, 'font-size': o.taille || 14,
      fill: o.couleur || C.encre, 'text-anchor': o.ancre || 'middle' }, svg);
    n.textContent = t;
    return n;
  }
  function pointe(x, y, ang, l = 6, couleur = C.encre, ep = 1.4) {
    const a1 = ang + 2.6, a2 = ang - 2.6;
    return `<path d="M${P([x + l * Math.cos(a1), y + l * Math.sin(a1)])} L${P([x, y])} L${P([x + l * Math.cos(a2), y + l * Math.sin(a2)])}" fill="none" stroke="${couleur}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const trait = (d, couleur = C.encre, ep = 1.3, extra = '') =>
    `<path d="${d}" fill="none" stroke="${couleur}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;

  // définitions partagées : grain riso, tremblé, trames
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
      <filter id="tremble-aplat" x="-10%" y="-40%" width="120%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="5" result="w"/>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <pattern id="trame" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
        <circle cx="1.8" cy="1.8" r="1.05" fill="${C.famille}"/>
      </pattern>
      <pattern id="trame-marine" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
        <circle cx="1.6" cy="1.6" r=".8" fill="${C.marine}"/>
      </pattern>
    </defs>`);
  }

  // ---------- Titre : échelle de tailles selon la longueur, 2 lignes au plus ----------
  function ajusteTitre(h) {
    const tailles = (h.dataset.tailles || '42 32 26').split(/\s+/).map(Number);
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
  function coche(svg) {
    frag(svg, `<circle cx="8" cy="8.5" r="6.5" fill="${C.famille}" filter="url(#grain)"/>` +
      trait('M4.6 8.6 L7.1 11.1 L11.8 5.6', C.encre, 1.4));
  }
  function guillemets(svg) {
    const q = 'M4 17 C4 9 9 4 14 2.5 L15.5 5.5 C12 7.5 10.5 10 10.5 12 C13.5 12 15.5 14 15.5 17.5 C15.5 21 12.5 23.5 9.5 23.5 C6 23.5 4 20.5 4 17 Z';
    frag(svg, `<g filter="url(#grain)" transform="translate(1.6 1.3)"><path d="${q}" fill="${C.famille}"/><path d="${q}" transform="translate(13 0)" fill="${C.famille}"/></g>
      <g fill="none" stroke="${C.encre}" stroke-width="1" filter="url(#tremble)"><path d="${q}"/><path d="${q}" transform="translate(13 0)"/></g>`);
  }
  // rectangle arrondi au léger tremblé (aplat du titre, comme sur les visuels LinkedIn)
  function rectArrondi(w, h, r) {
    return `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
  }

  function habille(face) {
    const deco = face.querySelector('.deco'), rd = rough.svg(deco);
    const cote = face.classList.contains('recto') ? 'recto' : 'verso';

    face.querySelectorAll('.titre > svg').forEach(s => {
      const w = s.parentNode.offsetWidth, h = s.parentNode.offsetHeight;
      frag(s, `<path d="${rectArrondi(w, h, Math.min(7, h * .16))}" fill="${C.indigo}" filter="url(#tremble-aplat)"/>`);
    });
    face.querySelectorAll('.niveau svg.fond').forEach(s => {
      const w = s.parentNode.offsetWidth, h = s.parentNode.offsetHeight, rr = h / 2;
      ajoute(s, rough.svg(s).path(`M${rr} 0 H${w - rr} A${rr} ${rr} 0 0 1 ${w - rr} ${h} H${rr} A${rr} ${rr} 0 0 1 ${rr} 0 Z`,
        R(graineDe(s, 'pilule') || 7, { fill: C.papier, fillStyle: 'solid', stroke: C.marine, strokeWidth: 1, roughness: .6 })));
    });
    face.querySelectorAll('svg.ceinture').forEach(ceinture);
    face.querySelectorAll('svg[data-guillemets]').forEach(guillemets);

    // flèche de la légende vers le QR : part du début de la légende, vise le bas du QR
    const leg = face.querySelector('.qr-legende'), qr = face.querySelector('.qr');
    if (leg && qr) {
      const L = boite(face, leg), Q = boite(face, qr);
      const a = [L.x - 4, L.y + L.h * .6], b = [Q.x - 3, Q.y + Q.h * .7];
      const c = [a[0] - 3, b[1] + 6];
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
    // renvois : trait de marqueur dans la couleur de la famille citée, sous le nom
    face.querySelectorAll('.renvoi').forEach(n => {
      const c = getComputedStyle(n).getPropertyValue('--c').trim();
      const range = document.createRange(); range.selectNodeContents(n.firstChild);
      const b = boite(face, { getBoundingClientRect: () => range.getBoundingClientRect() });
      ajoute(deco, rd.polygon([[b.x + 1, b.y + b.h * .64], [b.x + b.w, b.y + b.h * .6], [b.x + b.w - 1, b.y + b.h * .92], [b.x + 1.5, b.y + b.h * .95]],
        R(graineDe(n, 'renvoi'), { fill: alpha(c, .75), fillStyle: 'solid', stroke: 'none', roughness: .35 })));
    });
    // soulignés des titres de rubrique
    face.querySelectorAll('.h').forEach(n => {
      const b = boite(face, n);
      ajoute(deco, rd.curve([[b.x, b.y + b.h + 1.5], [b.x + b.w * .5, b.y + b.h], [b.x + b.w + 3, b.y + b.h + 1]],
        R(graineDe(n, 'h'), { stroke: C.famille, strokeWidth: 2.2, roughness: .6 })));
    });
    // filets : un seul trait, fin
    face.querySelectorAll('svg.filet').forEach(s => {
      const w = s.clientWidth;
      ajoute(s, rough.svg(s).line(1, 3, w - 1, 3, R(graineDe(s, 'filet-' + cote), { stroke: alpha(C.marine, .45), strokeWidth: .8, roughness: 1, bowing: 1.2 })));
    });
    // pied : filet indigo et pastille du numéro, même graine sur toutes les cartes
    face.querySelectorAll('.pied > svg').forEach(s => {
      const w = s.clientWidth, rs = rough.svg(s), cy = 11, r = 11, pied = s.parentNode;
      const xf = pied.querySelector('.famille').offsetWidth + 9, xo = w - pied.querySelector('.outil').offsetWidth - 9;
      ajoute(s, rs.line(xf, cy, w / 2 - r - 3, cy, R(21, { stroke: C.indigo, strokeWidth: 1, roughness: .5, bowing: .25 })));
      ajoute(s, rs.line(w / 2 + r + 3, cy, xo, cy, R(23, { stroke: C.indigo, strokeWidth: 1, roughness: .5, bowing: .25 })));
      el('circle', { cx: w / 2 + 1, cy: cy + .8, r, fill: C.famille, filter: 'url(#grain)' }, s);
      ajoute(s, rs.circle(w / 2, cy, 2 * r, R(22, { stroke: C.encre, strokeWidth: .9, roughness: .4 })));
    });
    // verso : numéros d'étape manuscrits sur pastille décalée
    face.querySelectorAll('svg[data-num]').forEach(s => {
      const n = s.dataset.num, rs = rough.svg(s);
      el('circle', { cx: 19.5, cy: 21, r: 15.5, fill: C.famille, filter: 'url(#grain)' }, s);
      ajoute(s, rs.circle(17.5, 19, 31, R(500 + 7 * n, { strokeWidth: 1.1, roughness: 1 })));
      el('text', { x: 18.5, y: 31, 'text-anchor': 'middle', 'font-family': 'Caveat', 'font-weight': 700, 'font-size': 36, fill: C.encre }, s).textContent = n;
    });
    face.querySelectorAll('svg[data-coche]').forEach(coche);
    // illustrations de la carte (fiche.js)
    face.querySelectorAll('svg[data-dessin]').forEach(s => {
      const f = DESSINS[s.dataset.dessin];
      if (!f) return console.error(`Dessin inconnu : ${s.dataset.dessin}`);
      f(s, { graine: graineDe(s, 'dessin-' + s.dataset.dessin), face });
    });
  }

  // le corps ne doit pas déborder sur le pied
  function controle(face) {
    const corps = face.querySelector('.corps'); if (!corps) return;
    const bas = corps.getBoundingClientRect().bottom;
    const der = [...corps.children].reduce((m, k) => Math.max(m, k.getBoundingClientRect().bottom), 0);
    if (der > bas + 0.5) console.error(`${face.classList.contains('recto') ? 'recto' : 'verso'} : le corps déborde de ${(der - bas).toFixed(1)} px sur le pied`);
  }

  const DESSINS = {};
  window.Carte = {
    get C() { return C; }, hache, graineDe, R, suite, el, frag, ajoute, alpha, boite, P, rad, note, pointe, trait,
    dessin(nom, f) { DESSINS[nom] = f; },
  };
  window.FICHE = {
    ready: document.fonts.ready.then(() => {
      try {
        couleurs();
        definitions();
        document.querySelectorAll('.titre').forEach(ajusteTitre);
        document.querySelectorAll('.face').forEach(f => {
          const e = f.querySelector('.entete');
          if (e) f.style.setProperty('--bandeau', e.offsetHeight + 'px');
        });
        document.querySelectorAll('.face').forEach(habille);
        document.querySelectorAll('.face').forEach(controle);
      } catch (e) {
        console.error('Dessin : ' + (e && e.stack || e));
      }
    }),
  };
})();
