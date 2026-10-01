// Fiche LinkedIn · page Fichly · jeudi 29 octobre 2026 (Buffer 6abe5d970c33e408f7a93e87)
// Post : « Une démarche Lean s'arrête rarement officiellement. Elle s'essouffle, et on s'en rend compte tard. »
// Sept signaux à vérifier sur une zone, la lecture du résultat (0–1 / 2–3 / 4+), « refaites-la dans un mois ».
// Premier commentaire du post : la checklist « 7 signaux d'essoufflement » → encart.
// Le visuel EST la fiche : à gauche la checklist des sept signaux, chacun avec sa question à poser et deux
// colonnes à cocher (Mois 1, Mois 2) ; à côté, la jauge de diagnostic en trois zones et la lecture du résultat.
// Style propre : la jauge de diagnostic. Le curseur passe la checklist sur une zone d'exemple ; à chaque
// signal coché l'aiguille monte d'un cran (ressort amorti), la zone atteinte s'éclaire et affiche sa consigne.
// Un mois plus tard, les coches sont recopiées en pointillés et revérifiées une à une : l'aiguille redescend
// en laissant son fantôme. Image t = 0 = état final (la fiche remplie de l'exemple). Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  // Ressort amorti, parti du repos : 0 → 1 avec un léger dépassement (environ 20 %)
  const spring = u => {
    if (u <= 0) return 0;
    if (u >= 3) return 1;
    const z = 0.42, w = 15, wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * u) * (Math.cos(wd * u) + (z * w / wd) * Math.sin(wd * u));
  };
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(p)).toString(16).padStart(2, '0')).join(''); };
  // Invisible = display none (pas d'opacité 0)
  const show = (n, o) => {
    if (o <= 0.001) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    n.setAttribute('opacity', o >= 0.999 ? 1 : f2(o));
    return true;
  };
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', BOX_LINE = '#c4c4dc', Q_INK = '#3d3d6e';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 750 };
  const LP = { x: 76, x1: 680 };                       // checklist
  const ROW_Y0 = 482, ROW_H = 87, PITCH = (1140 - ROW_Y0 - ROW_H) / 6;
  const rowY = i => ROW_Y0 + i * PITCH;
  const BX = [588, 644];                               // colonnes Mois 1 et Mois 2
  const boxCY = i => rowY(i) + 58;
  const G = { cx: 848, cy: 636, r: 118, bw: 26 };      // jauge
  const CARD = { x: 692, w: 312, y0: 784, h: 114, gap: 7 };
  const cardY = z => CARD.y0 + z * (CARD.h + CARD.gap);

  // ---------- Contenu (post) ----------
  const SIGNALS = [
    { title: 'Les routines glissent', q: ['Les routines ont-elles été décalées, écourtées', `ou annulées plus d’une fois cette semaine${NB}?`] },
    { title: 'Les actions vieillissent', q: ['La plus ancienne action ouverte du tableau', `a-t-elle plus d’un mois${NB}?`] },
    { title: 'Les problèmes remontés diminuent', q: ['Remonte-t-on moins de problèmes, sans que', `les résultats s’améliorent${NB}?`] },
    { title: 'Les standards n’ont pas bougé', q: ['Les standards sont-ils inchangés depuis', `le lancement de la démarche${NB}?`] },
    { title: 'Les indicateurs sont commentés, plus décidés', q: ['En réunion, constate-t-on l’écart sans', `en sortir avec une action${NB}?`] },
    { title: 'Le pilote Lean porte tout', q: ['Les routines sautent-elles quand', `le pilote Lean est absent${NB}?`] },
    { title: 'Les idées viennent toujours des mêmes personnes', q: ['La participation se resserre-t-elle', `autour d’un petit noyau${NB}?`] },
  ];
  const ZONES = [
    { range: '0 ou 1 signal', label: 'La démarche tient.', advice: ['Continuez à observer.'], col: C.green, ink: C.tGreen, pale: C.pGreen, icon: 'ok' },
    { range: '2 ou 3 signaux', label: 'Elle fatigue.', advice: ['Traitez d’abord ce qui touche', 'aux routines ou aux actions.'], col: C.yellow, ink: C.tYellow, pale: C.pYellow, icon: 'warn' },
    { range: '4 signaux ou plus', label: 'Pas encore autonome.', advice: ['Le sujet n’est plus l’outil,', 'c’est le système de management.'], col: C.red, ink: C.tRed, pale: C.pRed, icon: 'no' },
  ];
  const ZONE_SPAN = [[0, 1.5], [1.5, 3.5], [3.5, 7]];
  const zoneOf = n => (n <= 1 ? 0 : n <= 3 ? 1 : 2);

  // Zone d'exemple : signaux présents au mois 1, puis un mois plus tard (routines et actions traitées)
  const P1 = [1, 1, 0, 0, 1, 1, 0];
  const P2 = [0, 0, 0, 0, 1, 1, 0];
  const FINAL = 2;

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION - 0.001;
  const T_OUT = 1.2;                                   // l'état final se vide (coches, aiguille, consignes)
  const T1 = 1.95, ST1 = 0.6, MK1 = 0.42, MV1 = 0.2;   // passage 1 : départ, pas par signal, coche, trajet
  const T2 = 7.35, ST2 = 0.48, MK2 = 0.34, MV2 = 0.18; // passage 2, un mois plus tard
  const r1 = i => T1 + ST1 * i, m1 = i => r1(i) + MK1;
  const r2 = i => T2 + ST2 * i, m2 = i => r2(i) + MK2;
  const END1 = r1(6) + ST1, END2 = r2(6) + ST2;
  const T_GREEN = 1.75;                                // consigne verte (score 0)
  const T_COPY = 6.5, COPY_STEP = 0.1, GLIDE = 0.45;   // recopie des coches en pointillés
  const T_PILL = [1.6, 6.3, 10.85];                    // pastilles : passage 1, passage 2, état final
  const T_TREND = 10.75;
  const COPIED = P1.map((v, i) => (v ? i : -1)).filter(i => i >= 0);

  // Crans de l'aiguille : [instant, variation]
  const STEPS = [[1.25, -2]];
  P1.forEach((v, i) => { if (v) STEPS.push([m1(i) + 0.04, 1]); });
  P1.forEach((v, i) => { if (v && !P2[i]) STEPS.push([m2(i) + 0.04, -1]); });
  const score = s => STEPS.reduce((a, [t, d]) => a + d * spring(s - t), FINAL);
  // Compteur entier (change quand l'aiguille passe) et changements de zone
  const COUNT = [];
  { let n = FINAL; STEPS.forEach(([t, d]) => { COUNT.push({ t: t + 0.1, from: n, to: n + d }); n += d; }); }
  const ZCH = [];
  COUNT.forEach(c => { if (zoneOf(c.from) !== zoneOf(c.to)) ZCH.push({ t: c.t + 0.05, from: zoneOf(c.from), to: zoneOf(c.to) }); });
  const REVEAL = [T_GREEN, ...[1, 2].map(z => ZCH.find(c => c.to === z && c.t > T_OUT).t + 0.05)];
  // Petits « +1 » / « −1 » près du compteur
  const FLOATS = STEPS.slice(1).map(([t, d]) => ({ t, d }));
  const FLOAT_DUR = 0.45;
  const T_GHOST = STEPS.find(([tt, d]) => d < 0 && tt > T2)[0];   // l'aiguille quitte le score du mois 1

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, size = 19, h = 40 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, x + 20, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40);
    return { g, r };
  }
  const CHECK = 'M -7 0.5 L -2 5.5 L 7.5 -5';
  const CHECK_LEN = 22;
  const pt = (s, r) => { const a = Math.PI - s * Math.PI / 7; return [G.cx + r * Math.cos(a), G.cy - r * Math.sin(a)]; };
  const arc = (a, b, r) => { const [x0, y0] = pt(a, r), [x1, y1] = pt(b, r); return `M ${f2(x0)} ${f2(y0)} A ${r} ${r} 0 0 1 ${f2(x1)} ${f2(y1)}`; };
  const NEEDLE = 'M -20 -4.5 L 0 -7 L 112 -1.4 L 112 1.4 L 0 7 L -20 4.5 Z';
  const needleRot = s => `translate(${G.cx} ${G.cy}) rotate(${f2(s * 180 / 7 - 180)})`;

  const S = { rows: [], cards: [], floats: [], ripples: [] };

  function build() {
    D.template({ author: null });
    D.title('Les 7 signaux', 'd’essoufflement', 1020);
    D.chapeau('Une démarche Lean s’arrête rarement officiellement. Elle s’essouffle.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, bold]) => { const sp = el('tspan', bold ? { 'font-weight': 700, fill: C.blue } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Sur une zone que vous connaissez, ', 0], ['chaque signal présent', 1], [' fait monter l’aiguille.', 0]]);
    line(384, [['Refaites-la ', 0], ['dans un mois', 1], [`${NB}: c’est `, 0], ['la tendance', 1], [' qui compte, plus que le score.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-60%', y: '-60%', width: '220%', height: '220%' }, defs);
    el('feDropShadow', { dx: 0, dy: 4, stdDeviation: 3.5, 'flood-color': C.ink, 'flood-opacity': 0.3 }, lift);
    const soft = el('filter', { id: 'soft', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    el('feGaussianBlur', { stdDeviation: 7 }, soft);
    const cpD = el('clipPath', { id: 'digits' }, defs);
    el('rect', { x: 760, y: 660, width: 64, height: 41 }, cpD);

    // ----- Cadre de la fiche -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Checklist -----
    S.heads = ['Mois 1', 'Mois 2'].map((l, k) => {
      const n = text(D.svg, BX[k], 466, l.replace(' ', NB), { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
      fit(n, k ? 676 : BX[1] - 26, `en-tête ${l}`, k ? BX[0] + 26 : 560);
      const bar = el('rect', { x: BX[k] - 22, y: 472, width: 44, height: 3, rx: 1.5, fill: C.blue });
      return { n, bar };
    });
    SIGNALS.forEach((sg, i) => {
      const y0 = rowY(i);
      const card = el('rect', { x: LP.x, y: y0, width: LP.x1 - LP.x, height: ROW_H, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
      el('circle', { cx: LP.x + 32, cy: y0 + 21, r: 15, fill: C.blue });
      text(D.svg, LP.x + 32, y0 + 27, String(i + 1), { size: 16, weight: 800, fill: C.white, anchor: 'middle' });
      fit(text(D.svg, LP.x + 60, y0 + 28, sg.title, { size: 19, weight: 800, fill: C.ink }), LP.x1 - 14, `signal ${i + 1}`);
      sg.q.forEach((l, k) => fit(text(D.svg, LP.x + 60, y0 + 53 + k * 20, l, { size: 17, weight: 500, fill: Q_INK }), BX[0] - 14 - 12, `question ${i + 1} ligne ${k + 1}`));
      const cy = boxCY(i);
      const boxes = BX.map(bx => el('rect', { x: bx - 14, y: cy - 14, width: 28, height: 28, rx: 7, fill: C.white, stroke: BOX_LINE, 'stroke-width': 2.2 }));
      // Coches pleines (Mois 1, Mois 2)
      const checks = BX.map((bx, k) => {
        if (!(k ? P2[i] : P1[i])) return null;
        const g = el('g', {});
        el('rect', { x: -14, y: -14, width: 28, height: 28, rx: 7, fill: C.red }, g);
        const path = el('path', { d: CHECK, fill: 'none', stroke: C.white, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        return { g, path, bx };
      });
      // Coche fantôme recopiée dans Mois 2
      let ghost = null;
      if (P1[i]) {
        const g = el('g', {});
        el('rect', { x: -14, y: -14, width: 28, height: 28, rx: 7, fill: C.white, stroke: C.red, 'stroke-width': 2.2, 'stroke-dasharray': '4 3.2' }, g);
        el('path', { d: CHECK, fill: 'none', stroke: C.red, 'stroke-opacity': 0.55, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        ghost = { g };
      }
      S.rows.push({ card, boxes, checks, ghost, cy });
    });

    // Ondes de clic
    const addRipple = (t, bx, cy) => S.ripples.push({ t, bx, cy, n: el('circle', { cx: bx, cy, r: 16, fill: 'none', stroke: C.red, 'stroke-width': 2.5 }) });
    P1.forEach((v, i) => { if (v) addRipple(m1(i), BX[0], boxCY(i)); });
    P2.forEach((v, i) => { if (v) addRipple(m2(i), BX[1], boxCY(i)); });

    // ----- Jauge -----
    S.halos = ZONE_SPAN.map(([a, b], z) => el('path', { d: arc(a, b, G.r), fill: 'none', stroke: ZONES[z].col, 'stroke-width': 34, filter: 'url(#soft)' }));
    S.arcs = ZONE_SPAN.map(([a, b], z) => el('path', { d: arc(a, b, G.r), fill: 'none', stroke: ZONES[z].col, 'stroke-width': G.bw }));
    [1.5, 3.5].forEach(sv => { const [x0, y0] = pt(sv, G.r - G.bw / 2 - 1), [x1, y1] = pt(sv, G.r + G.bw / 2 + 1); el('line', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1), stroke: FRAME_BG, 'stroke-width': 3.5 }); });
    for (let k = 0; k <= 7; k++) {
      const [x0, y0] = pt(k, G.r + G.bw / 2 + 3), [x1, y1] = pt(k, G.r + G.bw / 2 + 10);
      el('line', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1), stroke: MUTED, 'stroke-width': 2.2, 'stroke-linecap': 'round' });
      const [nx, ny] = pt(k, 151);
      fit(text(D.svg, f2(nx), f2(ny + 5.5), String(k), { size: 15, weight: 700, fill: MUTED, anchor: 'middle' }), 1010, `graduation ${k}`, 686);
    }
    // Aiguille fantôme (le score du mois 1) et son repère
    S.ghostNeedle = el('path', { d: NEEDLE, fill: C.pRed, 'fill-opacity': 0.5, stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '6 4', 'stroke-linejoin': 'round', transform: needleRot(4) });
    const [lx, ly] = pt(4, 50);
    S.ghostLabel = text(D.svg, f2(lx + 10), f2(ly + 5), `Mois${NB}1`, { size: 15, weight: 700, fill: C.tRed });
    // Aiguille et moyeu
    S.needle = el('path', { d: NEEDLE, fill: C.ink });
    el('circle', { cx: G.cx, cy: G.cy, r: 14, fill: C.ink });
    el('circle', { cx: G.cx, cy: G.cy, r: 5, fill: C.white });

    // Compteur qui roule
    const probe = text(D.svg, 0, 0, '4', { size: 40, weight: 800 });
    const wd = probe.getBBox().width; probe.remove();
    const probe2 = text(D.svg, 0, 0, 'signaux', { size: 19, weight: 700 });
    const wl = probe2.getBBox().width; probe2.remove();
    S.xd = Math.round(G.cx - (wd + 8 + wl) / 2 + wd);
    const dg = el('g', { 'clip-path': 'url(#digits)' });
    S.dA = text(dg, S.xd, 694, '', { size: 40, weight: 800, fill: C.ink, anchor: 'end' });
    S.dB = text(dg, S.xd, 694, '', { size: 40, weight: 800, fill: C.ink, anchor: 'end' });
    S.unit = text(D.svg, S.xd + 8, 694, 'signaux', { size: 19, weight: 700, fill: C.ink });
    fit(S.unit, 990, 'unité du compteur', 700);
    FLOATS.forEach(f => {
      const n = text(D.svg, S.xd + 8 + wl + 16, 690, f.d > 0 ? '+1' : '−1', { size: 20, weight: 800, fill: f.d > 0 ? C.tRed : C.tGreen });
      fit(n, 1000, 'cran');
      S.floats.push({ ...f, n });
    });
    // Tendance
    S.trend = el('g');
    const tr = el('rect', { y: 728 - 16, height: 32, rx: 16, fill: C.pGreen }, S.trend);
    const tt = text(S.trend, G.cx + 9, 728 + 6, `Tendance${NB}: de 4 à 2 en un mois`, { size: 16, weight: 700, fill: C.tGreen, anchor: 'middle' });
    const tb = tt.getBBox();
    tr.setAttribute('x', f2(tb.x - 34)); tr.setAttribute('width', f2(tb.width + 50));
    el('path', { d: `M ${f2(tb.x - 16)} 721 V 735 M ${f2(tb.x - 21.5)} 730 L ${f2(tb.x - 16)} 735.5 L ${f2(tb.x - 10.5)} 730`, fill: 'none', stroke: C.tGreen, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.trend);
    fit(tr, 1004, 'pastille tendance', 692);

    // ----- Lecture du résultat -----
    const lh = text(D.svg, CARD.x + 4, 772, 'COMMENT LIRE LE RÉSULTAT', { size: 15, weight: 700, fill: MUTED });
    lh.setAttribute('letter-spacing', 1.2);
    fit(lh, 1004, 'en-tête lecture', 692);
    ZONES.forEach((zn, z) => {
      const x0 = CARD.x, y0 = cardY(z);
      const g = el('g');
      el('rect', { x: x0, y: y0, width: CARD.w, height: CARD.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      const lit = el('rect', { x: x0, y: y0, width: CARD.w, height: CARD.h, rx: 16, fill: zn.pale, stroke: zn.col, 'stroke-width': 2.5 }, g);
      el('circle', { cx: x0 + 26, cy: y0 + 24, r: 11, fill: zn.col }, g);
      const ix = x0 + 26, iy = y0 + 24;
      if (zn.icon === 'ok') el('path', { d: `M ${ix - 5} ${iy + 0.5} L ${ix - 1.5} ${iy + 4} L ${ix + 5} ${iy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      if (zn.icon === 'warn') { el('line', { x1: ix, y1: iy - 5.5, x2: ix, y2: iy + 1.5, stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g); el('circle', { cx: ix, cy: iy + 5.8, r: 1.7, fill: C.white }, g); }
      if (zn.icon === 'no') el('path', { d: `M ${ix - 4.5} ${iy - 4.5} L ${ix + 4.5} ${iy + 4.5} M ${ix + 4.5} ${iy - 4.5} L ${ix - 4.5} ${iy + 4.5}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round' }, g);
      fit(text(g, x0 + 46, y0 + 30, zn.range, { size: 16, weight: 800, fill: zn.ink }), x0 + CARD.w - 14, `zone ${z} seuil`);
      fit(text(g, x0 + 16, y0 + 57, zn.label, { size: 19, weight: 800, fill: C.ink }), x0 + CARD.w - 14, `zone ${z} lecture`);
      const cp = el('clipPath', { id: `adv${z}` }, defs);
      const wipe = el('rect', { x: x0 + 10, y: y0 + 64, width: CARD.w - 20, height: 46 }, cp);
      const adv = el('g', { 'clip-path': `url(#adv${z})` }, g);
      zn.advice.forEach((l, k) => fit(text(adv, x0 + 16, y0 + 81 + k * 20, l, { size: 16, weight: 500, fill: C.ink }), x0 + CARD.w - 10, `zone ${z} consigne ${k + 1}`));
      S.cards.push({ g, lit, wipe, cx: x0 + CARD.w / 2, cy: y0 + CARD.h / 2 });
    });

    // ----- Curseur et coches qui se déplacent (au-dessus de tout) -----
    S.rows.forEach(r => {
      r.checks.forEach(c => { if (c) D.svg.appendChild(c.g); });
      if (r.ghost) D.svg.appendChild(r.ghost.g);
    });
    S.pointer = el('g', { filter: 'url(#lift)' });
    el('path', { d: 'M 0 0 L 0 23 L 6.2 17.6 L 10.4 27 L 14.6 25.2 L 10.5 16 L 18.5 16 Z', fill: C.white, stroke: C.ink, 'stroke-width': 2, 'stroke-linejoin': 'round' }, S.pointer);

    // ----- Pastilles d'étape -----
    const PY = 452;
    S.pills = [
      pillShape(D.svg, 84, PY, `1${NB}·${NB}Mois 1${NB}: on vérifie les 7 signaux`, { bg: C.blue, fg: C.white }),
      pillShape(D.svg, 84, PY, `2${NB}·${NB}Un mois plus tard, même zone`, { bg: C.blue, fg: C.white }),
      pillShape(D.svg, 84, PY, `Exemple${NB}: même zone, à un mois d’écart`, { bg: C.pLav, fg: C.blue }),
    ];
    S.pills.forEach((p, i) => fit(p.r, BX[0] - 34, `pastille ${i + 1}`));

    D.encart(['Faire durer sa démarche', 'Notre checklist 7 signaux', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function countAt(s) {
    let n = FINAL, roll = null;
    for (const c of COUNT) {
      if (s >= c.t) { n = c.to; if (s < c.t + 0.26) roll = { c, p: (s - c.t) / 0.26 }; }
    }
    return { n, roll };
  }
  // Intensité d'éclairage de chaque zone (fondu enchaîné à chaque changement)
  function zoneLight(s) {
    const I = [0, 0, 0];
    let last = null;
    for (const c of ZCH) if (s >= c.t) last = c;
    if (!last) { I[zoneOf(FINAL)] = 1; return { I, last }; }
    const p = easeInOut(prog(s, last.t, 0.25));
    I[last.to] += p; I[last.from] += 1 - p;
    return { I, last };
  }

  function draw(t) {
    const s = t < T_OUT ? END : t;           // avant l'effacement : l'état final

    // Aiguille (ressort amorti, crans superposés)
    const raw = score(s);
    const sc = raw < 0 ? -0.3 * raw : raw;          // butée du zéro : l'aiguille rebondit
    S.needle.setAttribute('transform', needleRot(sc));
    const gIn = s < 5 ? 1 - prog(s, T_OUT, 0.2) : prog(s, T_GHOST, 0.3);
    show(S.ghostNeedle, gIn * 0.85);
    show(S.ghostLabel, s < 5 ? 1 - prog(s, T_OUT, 0.15) : prog(s, T_GHOST + 0.22, 0.3));

    // Zones de la jauge et cartes de lecture
    const { I, last } = zoneLight(s);
    S.arcs.forEach((a, z) => a.setAttribute('opacity', f2(0.36 + 0.64 * I[z])));
    S.halos.forEach((h, z) => {
      const pulse = last && last.to === z ? Math.sin(Math.PI * prog(s, last.t, 0.7)) : 0;
      show(h, I[z] * (0.22 + 0.4 * pulse));
    });
    S.cards.forEach((c, z) => {
      show(c.lit, I[z]);
      const pk = last && last.to === z ? Math.sin(Math.PI * prog(s, last.t, 0.35)) : 0;
      const k = 1 + 0.035 * pk;
      c.g.setAttribute('transform', Math.abs(k - 1) < 1e-3 ? '' : `translate(${c.cx} ${c.cy}) scale(${k.toFixed(3)}) translate(${-c.cx} ${-c.cy})`);
      const w = s < REVEAL[z] ? 1 - easeInOut(prog(s, T_OUT, 0.25)) : easeOut(prog(s, REVEAL[z], 0.4));
      c.wipe.setAttribute('width', f2(Math.max(0.001, (CARD.w - 20) * w)));
    });

    // Compteur
    const { n, roll } = countAt(s);
    const ink = v => ZONES[zoneOf(v)].ink;
    if (roll) {
      const dir = roll.c.to > roll.c.from ? 1 : -1, p = easeInOut(roll.p);
      S.dA.textContent = String(roll.c.from); S.dB.textContent = String(roll.c.to);
      S.dA.setAttribute('y', f2(694 - dir * 40 * p)); S.dB.setAttribute('y', f2(694 + dir * 40 * (1 - p)));
      S.dA.setAttribute('fill', ink(roll.c.from)); S.dB.setAttribute('fill', ink(roll.c.to));
      show(S.dB, 1);
    } else {
      S.dA.textContent = String(n); S.dA.setAttribute('y', 694); S.dA.setAttribute('fill', ink(n));
      show(S.dB, 0);
    }
    const nu = roll && roll.p < 0.5 ? roll.c.from : n;        // l'unité suit le chiffre le plus visible
    S.unit.textContent = nu <= 1 ? 'signal' : 'signaux';
    S.unit.setAttribute('fill', ink(nu));
    S.floats.forEach(f => {
      const p = prog(s, f.t, FLOAT_DUR);
      if (show(f.n, p > 0 && p < 1 ? clamp(p / 0.12) * (1 - prog(p, 0.55, 0.45)) : 0)) f.n.setAttribute('y', f2(690 - 24 * easeOut(p)));
    });
    // Tendance
    const pt0 = s < 5 ? 1 - prog(s, T_OUT, 0.2) : prog(s, T_TREND, 0.35);
    const kt = s < 5 ? 1 : popScale(pt0);
    if (show(S.trend, s < 5 ? pt0 : clamp(pt0 / 0.4))) S.trend.setAttribute('transform', kt === 1 ? '' : `translate(${G.cx} 728) scale(${f2(kt)}) translate(${-G.cx} -728)`);

    // En-têtes de colonnes : la colonne en cours est soulignée
    const hOn = [prog(s, T1 - 0.25, 0.2) * (1 - prog(s, END1 + 0.05, 0.2)), prog(s, T2 - 0.35, 0.2) * (1 - prog(s, END2 + 0.05, 0.2))];
    S.heads.forEach((h, k) => { h.n.setAttribute('fill', mix(MUTED, C.blue, hOn[k])); show(h.bar, hOn[k]); });

    // Lignes de la checklist : surbrillance pendant la vérification
    S.rows.forEach((r, i) => {
      const on1 = prog(s, r1(i) + 0.04, 0.12) * (1 - prog(s, r1(i) + ST1 + 0.02, 0.12));
      const on2 = prog(s, r2(i) + 0.04, 0.12) * (1 - prog(s, r2(i) + ST2 + 0.02, 0.12));
      const on = Math.max(on1, on2);
      r.card.setAttribute('stroke', mix(CARD_LINE, C.blue, on));
      r.card.setAttribute('stroke-width', f2(2 + 0.6 * on));
      r.card.setAttribute('fill', mix(C.white, '#f6f6fd', on));
      [on1, on2].forEach((o, k) => {
        r.boxes[k].setAttribute('stroke', mix(BOX_LINE, C.blue, o));
        r.boxes[k].setAttribute('fill', mix(C.white, C.pLav, o));
      });

      // Coches pleines
      r.checks.forEach((c, k) => {
        if (!c) return;
        const m = k ? m2(i) : m1(i);
        const order = k ? 4 + (i === 5 ? 1 : 0) : COPIED.indexOf(i);
        let o, sc2 = 1, d = 0;
        if (s < m) {                                   // effacement de l'état final
          const e = prog(s, T_OUT + 0.035 * order, 0.2);
          o = 1 - e; sc2 = 1 - 0.35 * easeInOut(e);
        } else {
          const pf = prog(s, m, 0.1);
          o = pf; sc2 = 1 + 0.18 * Math.sin(Math.PI * prog(s, m, 0.25));
          d = 1 - easeOut(prog(s, m + 0.05, 0.18));
        }
        if (show(c.g, o)) {
          c.g.setAttribute('transform', `translate(${c.bx} ${r.cy})` + (Math.abs(sc2 - 1) > 1e-3 ? ` scale(${sc2.toFixed(3)})` : ''));
          if (d > 0) { c.path.setAttribute('stroke-dasharray', CHECK_LEN); c.path.setAttribute('stroke-dashoffset', f2(CHECK_LEN * d)); }
          else { c.path.removeAttribute('stroke-dasharray'); c.path.removeAttribute('stroke-dashoffset'); }
        }
      });

      // Coche fantôme : recopiée de Mois 1 vers Mois 2, puis revérifiée
      if (r.ghost) {
        const k = COPIED.indexOf(i);
        const tg = T_COPY + COPY_STEP * k, ma = m2(i);
        let o = 0, x = BX[1], y = r.cy, sk = 1, lifted = false;
        if (s >= tg && s < ma + 0.3) {
          const p = prog(s, tg, GLIDE), q = easeInOut(p);
          x = lerp(BX[0], BX[1], q);
          y = r.cy - 16 * Math.sin(Math.PI * q);
          lifted = p > 0 && p < 1;
          sk = lifted ? 1 + 0.08 * Math.sin(Math.PI * q) : 1;
          o = clamp(p / 0.15);
          if (s >= ma) {
            if (P2[i]) o = 0;                          // confirmée : la coche pleine la remplace
            else { const e = prog(s, ma, 0.25); o *= 1 - e; sk = 1 - 0.4 * easeInOut(e); }
          }
        }
        if (show(r.ghost.g, o)) {
          r.ghost.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})` + (Math.abs(sk - 1) > 1e-3 ? ` scale(${sk.toFixed(3)})` : ''));
          if (lifted) r.ghost.g.setAttribute('filter', 'url(#lift)'); else r.ghost.g.removeAttribute('filter');
        }
      }
    });

    // Ondes de clic
    S.ripples.forEach(rp => {
      const p = prog(s, rp.t, 0.4);
      if (show(rp.n, p > 0 && p < 1 ? 0.7 * (1 - p) : 0)) rp.n.setAttribute('r', f2(16 + 16 * easeOut(p)));
    });

    // Curseur : va de case en case, marque une pause, clique
    let po = 0, px = 0, py = 0, click = 0;
    [[T1, ST1, MV1, r1, m1, BX[0], END1, P1], [T2, ST2, MV2, r2, m2, BX[1], END2, P1]].forEach(([T, ST, MV, rr, mm, bx, E, P]) => {
      if (s < T - 0.2 || s >= E + 0.25) return;
      const tgt = i => [bx + 5, boxCY(i) + 5];
      const entry = [bx + 30, boxCY(0) - 62];
      let pos = entry;
      for (let i = 0; i < 7; i++) {
        if (s < rr(i)) break;
        const from = i ? tgt(i - 1) : entry;
        const q = easeInOut(prog(s, rr(i), MV));
        pos = [lerp(from[0], tgt(i)[0], q), lerp(from[1], tgt(i)[1], q)];
        if (P[i]) click = Math.max(click, Math.sin(Math.PI * prog(s, mm(i), 0.16)));
      }
      [px, py] = pos;
      po = prog(s, T - 0.2, 0.18) * (1 - prog(s, E + 0.02, 0.2));
    });
    if (show(S.pointer, po)) S.pointer.setAttribute('transform', `translate(${f2(px)} ${f2(py)})` + (click > 1e-3 ? ` scale(${(1 - 0.12 * click).toFixed(3)})` : ''));

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    const pills = [
      prog(s, T_PILL[0] + 0.16, 0.25) * (1 - prog(s, T_PILL[1], 0.14)),
      prog(s, T_PILL[1] + 0.16, 0.25) * (1 - prog(s, T_PILL[2], 0.14)),
      s < 5 ? 1 - prog(s, T_OUT, 0.14) : prog(s, T_PILL[2] + 0.16, 0.25),
    ];
    S.pills.forEach((p, i) => {
      const a = i < 2 || s >= 5 ? T_PILL[i] + 0.16 : -1;
      const dy = a < 0 ? 0 : 8 * (1 - prog(s, a, 0.25));
      if (show(p.g, pills[i])) p.g.setAttribute('transform', dy > 1e-3 ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
