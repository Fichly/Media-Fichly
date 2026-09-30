// Fiche LinkedIn · Hugo Duc · lundi 5 octobre 2026
// Post : « Quand je découvre un atelier… Je choisis une pièce. Et je la suis. »
// Premier commentaire du post (Buffer) : article cartographie des flux (VSM) → encart bas gauche.
// Mécanique : le parcours de la pièce (4 attentes, une transformation), puis le temps passé dans l'usine.
// Rendu déterministe : window.FICHE.draw(t), t en secondes, boucle de 12 s.
(() => {
  const W = 1080, H = 1350;
  const DURATION = 12;

  // Palette de la charte (valeurs de C) + bandeau six couleurs du gabarit LinkedIn
  const C = {
    blue: '#4a4aa0', green: '#8cc978', yellow: '#e6b839', red: '#f16969',
    lightBlue: '#74a3d6', teal: '#75bec0', violet: '#aa76b2',
    pGreen: '#e6f3df', pRed: '#fde6e6', pLav: '#ececf5',
    tGreen: '#2f5a1f', tRed: '#a83434',
    ink: '#23235a', card: '#fdfdfb', line: '#e2e2ee', white: '#ffffff',
  };
  const RIBBON = ['#f16969', '#75bec0', '#aa76b2', '#8cc978', '#e0cf35', '#74a3d6'];
  const ENCART_BLACK = '#000000'; // première ligne des encarts Fichly

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
  const checks = [];
  const fit = (node, maxRight, label, minLeft = 0) => checks.push({ node, maxRight, minLeft, label });

  // ---------- Easing ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.3; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };

  // Image complète jusqu'à 1,2 s, effacement du contenu en 0,4 s, puis reconstruction.
  const FADE_START = 1.2, FADE_END = 1.6;
  const fading = t => t >= FADE_START && t < FADE_END;
  const fadeOut = t => 1 - prog(t, FADE_START, FADE_END - FADE_START);

  function pop(g, t, start, cx, cy, dur = 0.35) {
    let s = 1, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      s = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p);
      o = clamp(p / 0.4);
    }
    g.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`);
    g.setAttribute('opacity', o);
  }
  function slide(g, t, start, dur = 0.45, dx = -140) {
    let x = 0, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      x = p >= 1 ? 0 : dx * (1 - easeOut(p));
      o = clamp(p / 0.5);
    }
    g.setAttribute('transform', x === 0 ? '' : `translate(${x} 0)`);
    g.setAttribute('opacity', o);
  }
  function rise(g, t, start, dur = 0.4, dy = 18) {
    let y = 0, o = 1;
    if (fading(t)) o = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, start, dur);
      y = p >= 1 ? 0 : dy * (1 - easeOut(p));
      o = clamp(p / 0.6);
    }
    g.setAttribute('transform', y === 0 ? '' : `translate(0 ${y})`);
    g.setAttribute('opacity', o);
  }

  // ---------- Pictos ----------
  function check(parent, cx, cy, r, bg) {
    el('circle', { cx, cy, r, fill: bg }, parent);
    const k = r / 26;
    el('path', {
      d: `M ${cx - 10 * k} ${cy + 1 * k} L ${cx - 3 * k} ${cy + 8 * k} L ${cx + 11 * k} ${cy - 7 * k}`,
      fill: 'none', stroke: C.white, 'stroke-width': 5 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, parent);
  }
  function cross(parent, cx, cy, r, bg) {
    el('circle', { cx, cy, r, fill: bg }, parent);
    const d = 8.5 * r / 26;
    el('path', {
      d: `M ${cx - d} ${cy - d} L ${cx + d} ${cy + d} M ${cx + d} ${cy - d} L ${cx - d} ${cy + d}`,
      fill: 'none', stroke: C.white, 'stroke-width': 5 * r / 26, 'stroke-linecap': 'round',
    }, parent);
  }
  // Chronomètre : renvoie l'aiguille pour l'animer
  function stopwatch(parent, cx, cy, k = 1) {
    const g = el('g', { transform: `translate(${cx} ${cy}) scale(${k})` }, parent);
    el('circle', { cx: 0, cy: 0, r: 22, fill: C.pRed }, g);
    el('rect', { x: -3.5, y: -16, width: 7, height: 4.5, rx: 1.5, fill: C.tRed }, g);
    el('line', { x1: 8.5, y1: -8.5, x2: 11, y2: -11, stroke: C.tRed, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    el('circle', { cx: 0, cy: 2, r: 11.5, fill: 'none', stroke: C.tRed, 'stroke-width': 3 }, g);
    const hand = el('line', { x1: 0, y1: 2, x2: 0, y2: -5.5, stroke: C.tRed, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
    el('circle', { cx: 0, cy: 2, r: 1.8, fill: C.tRed }, g);
    return { hand };
  }
  function pill(parent, x, cy, label, { size = 21, bg = C.pLav, fg = C.blue, h = 36, pad = 16 } = {}) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, x + pad, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    const w = measure(tx).width + pad * 2;
    r.setAttribute('width', w);
    return { g, w, tx };
  }

  // ---------- Gabarit LinkedIn : fond, bandeau, logo, badge auteur (Hugo Duc par défaut) ----------
  function template() {
    el('rect', { x: 0, y: 0, width: W, height: H, fill: '#f3f3f3' });
    el('image', { href: '../../assets/paper.png', x: 0, y: 0, width: W, height: H });
    RIBBON.forEach((c, i) => el('rect', { x: i * 180, y: 1332, width: 180, height: 18, fill: c }));
    el('image', { href: '../../assets/fichly-logo.png', x: 884, y: 1228, width: 178, height: 94 });
    el('image', { href: '../../assets/auteurs/hugo-duc.png', x: 891, y: 43, width: 125, height: 125 });
    text(svg, 952, 210, 'Hugo', { size: 23, weight: 400, fill: C.blue, anchor: 'middle' });
    text(svg, 952, 243, 'Duc', { size: 23, weight: 700, fill: C.blue, anchor: 'middle' });
  }

  // Encart bas gauche : visuel des guides + appel vers le premier commentaire du post
  function encart(lines) {
    const g = el('g');
    el('image', { href: '../../assets/encarts/guides-fichly.png', x: 14, y: 1215, width: 262, height: 117 }, g);
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
  }

  // ---------- Scène ----------
  const S = {};

  function build() {
    template();

    // Titre : ligne 1 bleue, ligne 2 blanche dans le cadre bleu (keyTitle). 840 px max (badge).
    const t1 = text(svg, 62, 122, 'Suivez une pièce,', { size: 72, weight: 800, fill: C.blue });
    fit(t1, 900, 'titre ligne 1');
    const kb = el('rect', { x: 44, y: 157, height: 82, rx: 12, fill: C.blue });
    const t2 = text(svg, 68, 216, 'elle attend.', { size: 72, weight: 800, fill: C.white });
    kb.setAttribute('width', measure(t2).width + 48);
    fit(kb, 900, 'cadre keyTitle');

    // Chapeau
    const chap = text(svg, 62, 304, 'Du quai de réception jusqu’à l’expédition, chronomètre en main.', { size: 26, weight: 500, fill: C.blue });
    fit(chap, 1020, 'chapeau');

    // ----- Carte 1 : le parcours de la pièce -----
    el('rect', { x: 60, y: 330, width: 960, height: 386, rx: 24, fill: C.card, stroke: C.line, 'stroke-width': 2 });
    const RAIL_X = 108;
    const Y = [372, 422, 472, 522, 572, 622, 672]; // départ, 4 attentes, transformation, arrivée
    S.Y = Y;
    el('line', { x1: RAIL_X, y1: Y[0], x2: RAIL_X, y2: Y[6], stroke: C.line, 'stroke-width': 5, 'stroke-linecap': 'round' });
    S.railOn = el('line', { x1: RAIL_X, y1: Y[0], x2: RAIL_X, y2: Y[6], stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' });
    S.nodes = Y.map(y => el('circle', { cx: RAIL_X, cy: y, r: 7, fill: C.card, stroke: C.line, 'stroke-width': 3.5 }));

    S.rows = [];
    {
      const g = el('g');
      const p = pill(g, 140, Y[0], 'Quai de réception');
      S.rows.push({ g, cx: 140 + p.w / 2, cy: Y[0] });
    }
    const waits = [
      'Elle attend dans un stock.',
      'Elle attend un chariot.',
      'Elle attend qu’une machine se libère.',
      'Elle attend un contrôle.',
    ];
    S.watches = [];
    waits.forEach((label, i) => {
      const cy = Y[i + 1];
      const g = el('g');
      el('circle', { cx: 160, cy, r: 20, fill: C.blue }, g);
      text(g, 160, cy + 7.5, String(i + 1), { size: 21, weight: 700, fill: C.white, anchor: 'middle' });
      const tx = text(g, 194, cy + 9, label, { size: 26, weight: 700, fill: C.ink });
      fit(tx, 935, `attente ${i + 1}`);
      S.watches.push(stopwatch(g, 974, cy, 0.92));
      S.rows.push({ g, cx: 560, cy });
    });
    {
      const cy = Y[5];
      const g = el('g');
      check(g, 160, cy, 20, C.green);
      const tx = text(g, 194, cy + 9, 'De temps en temps, quelqu’un la transforme.', { size: 26, weight: 700, fill: C.tGreen });
      fit(tx, 995, 'transformation');
      S.rows.push({ g, cx: 560, cy });
    }
    {
      const g = el('g');
      const p = pill(g, 140, Y[6], 'Expédition');
      S.rows.push({ g, cx: 140 + p.w / 2, cy: Y[6] });
    }
    // La pièce
    S.token = el('g');
    el('rect', { x: -13, y: -13, width: 26, height: 26, rx: 7, fill: C.blue }, S.token);
    el('circle', { cx: 0, cy: 0, r: 4.5, fill: C.white }, S.token);

    // ----- Carte 2 : le temps passé dans l'usine -----
    el('rect', { x: 60, y: 730, width: 960, height: 166, rx: 24, fill: C.card, stroke: C.line, 'stroke-width': 2 });
    S.head = el('g');
    const hd = text(S.head, 100, 772, 'Le temps passé dans l’usine', { size: 26, weight: 700, fill: C.ink });
    fit(hd, 980, 'titre carte 2');

    const BAR = { x: 100, y: 788, w: 880, h: 36 };
    S.BAR = BAR;
    const defs = el('defs');
    const cp = el('clipPath', { id: 'barClip' }, defs);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: BAR.h / 2 }, cp);
    const cf = el('clipPath', { id: 'fillClip' }, defs);
    S.fillRect = el('rect', { x: BAR.x, y: BAR.y - 10, width: BAR.w, height: BAR.h + 20 }, cf);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: BAR.h / 2, fill: C.pLav });
    const outer = el('g', { 'clip-path': 'url(#barClip)' });
    S.fill = el('g', { 'clip-path': 'url(#fillClip)' }, outer);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, fill: C.red }, S.fill);
    // Minutes où la pièce est transformée : quelques fines tranches (un sens, pas de valeurs)
    S.slivers = [0.2, 0.52, 0.81].map(f => {
      const x = BAR.x + f * BAR.w;
      const g = el('g', {}, S.fill);
      el('rect', { x: x - 9, y: BAR.y, width: 18, height: BAR.h, fill: C.card }, g);
      el('rect', { x: x - 6, y: BAR.y, width: 12, height: BAR.h, fill: C.green }, g);
      return { g, x, f };
    });

    S.legend = el('g');
    el('circle', { cx: 109, cy: 858, r: 9, fill: C.red }, S.legend);
    const l1 = text(S.legend, 126, 866, 'Elle attend', { size: 22, weight: 500, fill: C.ink });
    const l2x = measure(l1).x + measure(l1).width + 36;
    el('circle', { cx: l2x + 9, cy: 858, r: 9, fill: C.green }, S.legend);
    const l2 = text(S.legend, l2x + 26, 866, 'Elle est transformée', { size: 22, weight: 500, fill: C.ink });
    const l3 = text(S.legend, 980, 866, 'Un total presque dérisoire', { size: 22, weight: 700, fill: C.tGreen, anchor: 'end' });
    const b2 = measure(l2), b3 = measure(l3);
    if (b2.x + b2.width + 24 > b3.x) console.error(`Chevauchement : légende (${Math.round(b2.x + b2.width)} > ${Math.round(b3.x - 24)})`);

    // ----- Bandeaux : bonne et mauvaise lecture -----
    S.good = el('g');
    el('rect', { x: 60, y: 910, width: 960, height: 64, rx: 20, fill: C.pGreen }, S.good);
    check(S.good, 110, 942, 22, C.green);
    const g1 = text(S.good, 150, 951.5, 'Un chronomètre, oui. Sur la pièce.', { size: 26, weight: 700, fill: C.tGreen });
    fit(g1, 1000, 'bandeau ✓');

    S.bad = el('g');
    el('rect', { x: 60, y: 986, width: 960, height: 64, rx: 20, fill: C.pRed }, S.bad);
    cross(S.bad, 110, 1018, 22, C.red);
    const r1 = text(S.bad, 150, 1027.5, 'Pas sur les personnes.', { size: 26, weight: 700, fill: C.tRed });
    fit(r1, 1000, 'bandeau ✗');

    // ----- Chute -----
    S.chute = el('g');
    const c1 = text(S.chute, 62, 1108, 'Avant d’aller plus vite sur les opérations,', { size: 30, weight: 700, fill: C.blue });
    const c2 = text(S.chute, 62, 1148, 'il faut regarder tout le temps qui les sépare.', { size: 30, weight: 700, fill: C.blue });
    fit(c1, 1020, 'chute ligne 1');
    fit(c2, 1020, 'chute ligne 2');

    // ----- Encart (fixe) : premier commentaire = article VSM -----
    encart(['Cartographier ses flux', 'Notre article sur la VSM', '(lien en commentaire)']);

    // Contrôle des débordements
    for (const { node, maxRight, minLeft, label } of checks) {
      const b = measure(node);
      if (b.x + b.width > maxRight + 0.5 || b.x < minLeft - 0.5)
        console.error(`Débordement : ${label} (${Math.round(b.x)} → ${Math.round(b.x + b.width)}, bornes ${minLeft} → ${maxRight})`);
    }
  }

  // ---------- Chronologie ----------
  // Arrivée de la pièce sur chaque étape (s). Elle attend sur les étapes 1 à 4.
  const ARRIVE = [1.85, 2.4, 2.95, 3.5, 4.05, 4.55, 5.05];
  const MOVE = 0.28;
  const BAR_START = 5.65, BAR_DUR = 0.9;

  function tokenY(t) {
    const Y = S.Y;
    if (t < FADE_END) return Y[6];
    for (let i = 1; i < ARRIVE.length; i++) {
      const a = ARRIVE[i];
      if (t < a - MOVE) return Y[i - 1];
      if (t < a) return Y[i - 1] + (Y[i] - Y[i - 1]) * easeInOut(prog(t, a - MOVE, MOVE));
    }
    return Y[6];
  }

  function draw(t) {
    t = ((t % DURATION) + DURATION) % DURATION;
    const Y = S.Y;

    // Étapes du parcours, dans l'ordre du post
    S.rows.forEach((r, i) => pop(r.g, t, ARRIVE[i] - (i === 0 ? 0.15 : 0), r.cx, r.cy));

    // Pièce : pop au départ, glisse d'étape en étape, pulsation à la transformation
    const ty = tokenY(t);
    let ts = 1, to = 1;
    if (fading(t)) to = fadeOut(t);
    else if (t >= FADE_END) {
      const p = prog(t, ARRIVE[0], 0.3);
      ts = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p);
      to = clamp(p / 0.4);
      const q = prog(t, ARRIVE[5], 0.3);
      if (q > 0 && q < 1) ts *= 1 + 0.22 * Math.sin(Math.PI * q);
    }
    S.token.setAttribute('transform', `translate(108 ${ty})` + (ts === 1 ? '' : ` scale(${ts})`));
    S.token.setAttribute('opacity', to);

    // Rail parcouru
    S.railOn.setAttribute('y2', ty);
    S.railOn.setAttribute('opacity', t >= FADE_END && t < ARRIVE[0] ? 0 : to);
    S.nodes.forEach((n, i) => n.setAttribute('stroke', !fading(t) && to > 0 && ty >= Y[i] - 0.5 ? C.blue : C.line));

    // Chronomètres : un tour d'aiguille pendant que la pièce attend
    S.watches.forEach((w, i) => {
      const p = t >= FADE_END ? easeInOut(prog(t, ARRIVE[i + 1], 0.5)) : 1;
      w.hand.setAttribute('transform', `rotate(${p >= 1 ? 45 : 45 + 360 * p} 0 2)`);
    });

    // Carte 2 : titre, puis la barre se remplit de gauche à droite
    pop(S.head, t, 5.4, 290, 764);
    let fw = S.BAR.w, fo = 1;
    if (fading(t)) fo = fadeOut(t);
    else if (t >= FADE_END) { fw = S.BAR.w * easeInOut(prog(t, BAR_START, BAR_DUR)); fo = fw > 0 ? 1 : 0; }
    S.fillRect.setAttribute('width', Math.max(0.001, fw));
    S.fill.setAttribute('opacity', fo);
    S.slivers.forEach(s => {
      let k = 1;
      if (t >= FADE_END) {
        const p = prog(t, BAR_START + BAR_DUR * invEaseInOut(s.f), 0.3);
        k = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.5 + 0.5 * back(p);
      }
      const cy = S.BAR.y + S.BAR.h / 2;
      s.g.setAttribute('transform', k === 1 ? '' : `translate(${s.x} ${cy}) scale(1 ${k}) translate(${-s.x} ${-cy})`);
    });
    rise(S.legend, t, 6.65, 0.35, 10);

    // Bandeaux qui glissent depuis la gauche, puis la chute
    slide(S.good, t, 7.0);
    slide(S.bad, t, 7.4);
    rise(S.chute, t, 7.85, 0.45);
  }

  function invEaseInOut(y) {
    let lo = 0, hi = 1;
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (easeInOut(m) < y) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  const ready = (async () => {
    await Promise.all([400, 500, 700, 800].map(w => document.fonts.load(`${w} 30px Poppins`)));
    await document.fonts.ready;
    build();
    const imgs = [...svg.querySelectorAll('image')];
    await Promise.all(imgs.map(i => new Promise(res => {
      const im = new Image(); im.onload = im.onerror = res; im.src = new URL(i.getAttribute('href'), location.href).href;
    })));
    draw(0);
  })();

  window.FICHE = { width: W, height: H, duration: DURATION, draw, ready };
})();
