// DA Fichly des fiches LinkedIn (1080 × 1350) : uniquement ce qui est commun à toutes les fiches.
//   · le fond : papier, bandeau six couleurs, logo
//   · la tête : titre deux lignes (ligne 2 dans le cadre bleu), badge auteur, chapeau
//   · l'encart bas gauche (guides + appel vers le premier commentaire)
//   · la palette, Poppins, et le contrat de rendu lu par outils/rendu.js (window.FICHE)
// Rien sur la structure ni sur le mouvement : chaque fiche écrit les siens dans son fiche.js.
// Zone libre pour la fiche : ZONE (entre le chapeau et l'encart).
(() => {
  const W = 1080, H = 1350;
  const ASSETS = '../../assets/';
  const ZONE = { x: 0, y: 320, w: W, h: 855 }; // de sous le chapeau jusqu'au-dessus de l'encart

  // Palette de la charte
  const C = {
    blue: '#4a4aa0', green: '#8cc978', yellow: '#e6b839', red: '#f16969',
    lightBlue: '#74a3d6', teal: '#75bec0', violet: '#aa76b2',
    pGreen: '#e6f3df', pRed: '#fde6e6', pLav: '#ececf5', pYellow: '#f8f3d9',
    tGreen: '#2f5a1f', tRed: '#a83434', tYellow: '#7a5806',
    ink: '#23235a', card: '#fdfdfb', line: '#e2e2ee', white: '#ffffff',
  };
  const RIBBON = ['#f16969', '#75bec0', '#aa76b2', '#8cc978', '#e0cf35', '#74a3d6'];
  const ENCART_BLACK = '#000000'; // première ligne des encarts Fichly

  // Badge auteur : author: 'hugo' | 'clement'
  const AUTHORS = {
    hugo: { photo: 'auteurs/hugo-duc.png', x: 892, y: 47, size: 122, first: 'Hugo', last: 'Duc' },
    clement: { photo: 'auteurs/clement-raymond.png', x: 889, y: 45, size: 124, first: 'Clément', last: 'Raymond' },
  };

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('stage');

  function el(tag, attrs = {}, parent = svg) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, { size = 26, weight = 500, fill = C.ink, anchor = 'start' } = {}) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': weight, fill, 'text-anchor': anchor }, parent);
    t.textContent = str;
    return t;
  }
  const measure = node => node.getBBox();

  // Contrôle des débordements : fit() enregistre, vérifié après build() (console.error → rendu.js échoue)
  const checks = [];
  const fit = (node, maxRight, label, minLeft = 0) => checks.push({ node, maxRight, minLeft, label });
  function checkAll() {
    for (const { node, maxRight, minLeft, label } of checks) {
      const b = measure(node);
      if (b.x + b.width > maxRight + 0.5 || b.x < minLeft - 0.5)
        console.error(`Débordement : ${label} (${Math.round(b.x)} → ${Math.round(b.x + b.width)}, bornes ${minLeft} → ${maxRight})`);
    }
  }
  function noOverlap(a, b, label, gap = 0) {
    const A = measure(a), B = measure(b);
    if (A.x + A.width + gap > B.x && A.y < B.y + B.height && B.y < A.y + A.height)
      console.error(`Chevauchement : ${label}`);
  }

  // ---------- Fond ----------
  function template({ author = 'hugo' } = {}) {
    // data-frame : éléments qui ne bougent jamais (une fiche qui zoome peut les laisser hors de sa scène)
    el('rect', { x: 0, y: 0, width: W, height: H, fill: '#f3f3f3', 'data-frame': 1 });
    el('image', { href: ASSETS + 'paper.png', x: 0, y: 0, width: W, height: H, 'data-frame': 1 });
    RIBBON.forEach((c, i) => el('rect', { x: i * 180, y: 1332, width: 180, height: 18, fill: c, 'data-frame': 1 }));
    el('image', { href: ASSETS + 'fichly-logo.png', x: 884, y: 1228, width: 178, height: 94 });
    const a = AUTHORS[author];
    el('image', { href: ASSETS + a.photo, x: a.x, y: a.y, width: a.size, height: a.size });
    text(svg, 952, 210, a.first, { size: 23, weight: 400, fill: C.blue, anchor: 'middle' });
    text(svg, 952, 243, a.last, { size: 23, weight: 700, fill: C.blue, anchor: 'middle' });
  }

  // ---------- Tête ----------
  // Titre deux lignes en 72 px : ligne 1 bleue, ligne 2 blanche dans le cadre bleu.
  function title(line1, line2, maxRight = 900) {
    const t1 = text(svg, 62, 122, line1, { size: 72, weight: 800, fill: C.blue });
    fit(t1, maxRight, 'titre ligne 1');
    const kb = el('rect', { x: 44, y: 157, height: 82, rx: 12, fill: C.blue });
    const t2 = text(svg, 68, 216, line2, { size: 72, weight: 800, fill: C.white });
    kb.setAttribute('width', measure(t2).width + 48);
    fit(kb, maxRight, 'cadre keyTitle');
    return { t1, kb, t2 };
  }
  function chapeau(str) {
    const t = text(svg, 62, 304, str, { size: 26, weight: 500, fill: C.blue });
    fit(t, 1020, 'chapeau');
    return t;
  }

  // ---------- Encart bas gauche ----------
  // lines : [accroche (noir), ce qu'on trouve (bleu), « (lien en commentaire) » (bleu, souligné)]
  function encart(lines) {
    const g = el('g');
    el('image', { href: ASSETS + 'encarts/guides-fichly.png', x: 14, y: 1215, width: 262, height: 117 }, g);
    el('path', { d: 'M 268 1318 C 300 1319, 332 1304, 351 1277', fill: 'none', stroke: C.blue, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, g);
    el('path', { d: 'M 337 1286 L 352 1275 L 354 1293', fill: 'none', stroke: C.blue, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const CX = 512;
    const a = text(g, CX, 1204, lines[0], { size: 26, weight: 700, fill: ENCART_BLACK, anchor: 'middle' });
    const b = text(g, CX, 1235, lines[1], { size: 26, weight: 700, fill: C.blue, anchor: 'middle' });
    const c = text(g, CX, 1270, lines[2], { size: 26, weight: 700, fill: C.blue, anchor: 'middle' });
    const cb = measure(c);
    const x0 = cb.x + 26, x1 = cb.x + cb.width - 6;
    el('path', { d: `M ${x0} 1290 C ${x0 + 44} 1283, ${x0 + 134} 1280, ${x1} 1281`, fill: 'none', stroke: C.green, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, g);
    el('path', { d: `M ${x0 + 36} 1295 C ${x0 + 82} 1291, ${x0 + 152} 1290, ${x1 - 48} 1291`, fill: 'none', stroke: C.green, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, g);
    [a, b, c].forEach((n, i) => fit(n, 870, `encart ligne ${i + 1}`, 290));
    return g;
  }

  // ---------- Contrat de rendu ----------
  // build() construit la scène, draw(t) la pose à l'instant t (déterministe), duration en secondes.
  // scenarios : { nom: draw } ; choisi par l'URL (?scenario=nom), sinon le premier.
  function start({ duration, build, draw, scenarios }) {
    if (scenarios) {
      const wanted = new URLSearchParams(location.search).get('scenario');
      const name = wanted || Object.keys(scenarios)[0];
      if (!scenarios[name]) console.error(`Scénario inconnu : ${name} (${Object.keys(scenarios).join(', ')})`);
      draw = scenarios[name] || Object.values(scenarios)[0];
    }
    const ready = (async () => {
      await Promise.all([400, 500, 700, 800].map(w => document.fonts.load(`${w} 30px Poppins`)));
      await document.fonts.ready;
      build();
      checkAll();
      const imgs = [...svg.querySelectorAll('image')];
      await Promise.all(imgs.map(i => new Promise(res => {
        const im = new Image(); im.onload = im.onerror = res; im.src = new URL(i.getAttribute('href'), location.href).href;
      })));
      draw(0);
    })();
    const loop = t => draw(((t % duration) + duration) % duration);
    window.FICHE = { width: W, height: H, duration, draw: loop, ready };
  }

  window.DA = { W, H, ZONE, C, svg, el, text, measure, fit, noOverlap, template, title, chapeau, encart, start };
})();
