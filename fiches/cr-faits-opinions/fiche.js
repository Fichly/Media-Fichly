// Fiche LinkedIn · Clément Raymond · mardi 13 octobre 2026
// Post : « Une réunion de résolution qui dure une heure sans décision a rarement un problème d'animation.
// Elle a un problème de matière première. »
// Premier commentaire du post (Buffer) : toutes nos ressources Lean → encart.
// Le visuel est la pièce maîtresse : le tableau d'enquête. Les trois phrases de la réunion sont épinglées
// comme des pistes, reliées à la cause par des fils rouges, et la jauge « la salle y croit » de chacune
// monte pendant le débat. Puis la règle : un tampon « Qu'est-ce qui nous permet de le dire ? » passe sur
// chaque piste, et le fil se détend. Le fait du post arrive comme une preuve datée, punaisée en vert, son
// fil bien tendu. Les pistes sont reclassées (Opinion, Interprétation) et deviennent des fiches
// « Hypothèse à vérifier », avec un nom et une date.
// Style propre : le tableau d'enquête (liège, punaises, fils, tampon). Image t = 0 = état final.
// Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeIn = p => p * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  // Oscillation amortie (fiche qui se balance sous sa punaise, fil pincé) : nulle hors de sa fenêtre
  const wob = (t, t0, amp, period = 0.6, decay = 4.5, len = 1.5) => {
    const u = t - t0;
    return u <= 0 || u >= len ? 0 : amp * Math.exp(-decay * u) * Math.sin(2 * Math.PI * u / period);
  };
  // Ressort 0 → 1 avec dépassement (le fil qui se détend)
  const spring = u => (u <= 0 ? 0 : u >= 1.6 ? 1 : 1 - Math.exp(-5 * u) * Math.cos(2 * Math.PI * u / 0.62));
  const NB = ' ';

  const MUTED = '#7b7ba6', WOOD = '#dcc493', WOOD_LINE = '#c9ad78', CORK = '#f0e4c6';
  const SPECKS = ['#e3cd9d', '#f8efda', '#d6bb86'];
  const THREAD = '#dc5757', PAPER_LINE = '#f3c9c9', TRACK = '#ececf5';
  const VIOLET_SOFT = '#f3e8f5', VIOLET_INK = '#7c4787';
  const RIM = { [C.red]: '#c34a4a', [C.green]: '#5c984a', [C.blue]: '#34347c', [C.yellow]: '#b08720' };
  const STAMP_DARK = '#34347c';

  // ---------- Mise en page : le tableau de liège occupe toute la zone libre ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };            // cadre en bois
  const BOARD = { x: 70, y: 420, w: 940, h: 720 };            // liège
  const CW = 284, XS = [90, 398, 706];                        // trois colonnes de fiches
  const TOP_Y = 496, TOP_H = 184, BOT_Y = 786, BOT_H = 330, PIN_DY = 18;
  const PILL_Y = FRAME.y + 46;

  // ---------- Contenu (formulations du post) ----------
  const KINDS = {
    fait: { label: 'Fait', bg: C.pGreen, fg: C.tGreen },
    interp: { label: 'Interprétation', bg: C.pLav, fg: C.blue },
    opinion: { label: 'Opinion', bg: VIOLET_SOFT, fg: VIOLET_INK },
  };
  const LEADS = [
    { quote: [`«${NB}Ça arrive surtout`, `avec l’équipe de nuit.${NB}»`], kind: 'opinion', conv: [40, 75], who: 'Karim', when: 'jeudi', angle: -1.1 },
    { quote: [`«${NB}C’est la matière`, 'du nouveau', `fournisseur.${NB}»`], kind: 'interp', conv: [55, 90], who: 'Julie', when: 'jeudi', angle: 0.8 },
    { quote: [`«${NB}Depuis le changement`, 'de réglage, ça ne', `marche plus.${NB}»`], kind: 'interp', conv: [45, 80], who: 'Marc', when: 'vendredi', angle: -0.7 },
  ];
  const QUESTION = ['Qu’est-ce qui nous', `permet de le dire${NB}?`];
  const FACT_LINES = [`entre 2${NB}h et 4${NB}h, mardi,`, 'sur la ligne 3.'];
  const RULE_LINE = `Sinon${NB}: hypothèse à vérifier.`;

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2, OUT_DUR = 0.3;                 // l'image finale s'efface, puis le tableau se reconstruit
  const IN_DUR = 0.3, PIN_AT = 0.27, PIN_DUR = 0.2; // fiche posée, puis punaise enfoncée
  const T_CAUSE = 1.6;
  const T_LEAD = [1.88, 2.1, 2.32];
  const T_THREAD = T_LEAD.map(t => t + 0.5), THREAD_DUR = 0.3;
  const RISE_DUR = 0.34;
  const RISES = [[0, 2.95], [1, 3.22], [2, 3.49], [0, 3.76], [1, 4.03], [2, 4.3]];   // [piste, début] : le débat
  const T_RULE = 4.72;
  const T_STAMP_IN = 5.0, PRESS = [5.38, 6.0, 6.55, 7.1], DESC = 0.13, HOLD = 0.09, LIFT = 0.13;
  const T_STAMP_OUT = PRESS[3] + HOLD + LIFT, STAMP_OUT_DUR = 0.34;
  const T_SLACK = [1, 2, 3].map(i => PRESS[i] + HOLD); // le fil de la piste se détend quand le tampon se relève
  const T_FACT = 7.7, FACT_IN = 0.42;
  const T_COUNT = T_FACT + 0.45, COUNT_DUR = 0.55;
  const T_FTYPE = T_FACT + 0.7, FACT_CPS = 52;
  const T_GREEN = T_FACT + 1.0, GREEN_DUR = 0.36;
  const T_FAIT = T_GREEN + 0.3, T_CHECK = T_FAIT + 0.12;
  const T_RLINE = 9.4, RULE_CPS = 60;
  const T_RECLASS = [9.5, 9.95, 10.4];
  const NAME_CPS = 30;
  const T_PILL = [1.55, 4.8, 7.62, 9.3, 11.45];

  // ---------- Petits éléments ----------
  const vis = (n, o) => {
    if (o <= 0.001) { n.setAttribute('display', 'none'); return false; }
    n.removeAttribute('display');
    if (o >= 0.999) n.removeAttribute('opacity'); else n.setAttribute('opacity', f2(o));
    return true;
  };
  const setTf = (n, s) => { if (s) n.setAttribute('transform', s); else n.removeAttribute('transform'); };
  const rot = (x, y, a, ox, oy) => {
    const r = a * Math.PI / 180, dx = x - ox, dy = y - oy;
    return [ox + dx * Math.cos(r) - dy * Math.sin(r), oy + dx * Math.sin(r) + dy * Math.cos(r)];
  };
  const checkMark = (parent, cx, cy, r) => {
    el('circle', { cx, cy, r, fill: C.green }, parent);
    el('path', { d: `M ${cx - r * 0.45} ${cy + r * 0.04} L ${cx - r * 0.12} ${cy + r * 0.37} L ${cx + r * 0.46} ${cy - r * 0.3}`, fill: 'none', stroke: C.white, 'stroke-width': r * 0.27, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  };

  function pillShape(label, { bg, fg, icon = false, size = 21, h = 42 }) {
    const g = el('g', {}, S.pillLayer);
    const x = XS[0], cy = PILL_Y;
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) checkMark(g, x + 31, cy, 12);
    fit(g, BOARD.x + BOARD.w - 20, `pastille ${label}`);
    return g;
  }

  // Punaise : tête ronde, reflet, ombre portée sur le liège
  function makePin(x, y, color) {
    const g = el('g', {}, S.pinLayer);
    el('circle', { cx: 2.6, cy: 3.6, r: 10, fill: C.ink, opacity: 0.2 }, g);
    el('circle', { cx: 0, cy: 0, r: 10.5, fill: color, stroke: RIM[color], 'stroke-width': 1.6 }, g);
    el('circle', { cx: -3.3, cy: -3.4, r: 3.3, fill: C.white, opacity: 0.6 }, g);
    return { g, x, y };
  }

  // Fiche de papier punaisée (elle pivote autour de sa punaise du haut)
  function makeCard(x0, y0, h, angle, pinColor, { swing = true, extraPins = [] } = {}) {
    const g = el('g', { filter: 'url(#paper)' }, S.cardLayer);
    el('rect', { x: x0, y: y0, width: CW, height: h, rx: 7, fill: C.white }, g);
    const c = { g, x0, y0, w: CW, h, cx: x0 + CW / 2, cy: y0 + h / 2, px: x0 + CW / 2, py: y0 + PIN_DY, angle, swing };
    c.pins = [makePin(c.px, c.py, pinColor), ...extraPins.map(([x, y, col]) => makePin(x, y, col))];
    return c;
  }
  function placeCard(c, { dx = 0, dy = 0, k = 1, a = 0, lifted = false, o = 1 }) {
    if (!vis(c.g, o)) return;
    const parts = [];
    if (dx || dy) parts.push(`translate(${f2(dx)} ${f2(dy)})`);
    if (k !== 1) parts.push(`translate(${f2(c.cx)} ${f2(c.cy)}) scale(${k.toFixed(4)}) translate(${f2(-c.cx)} ${f2(-c.cy)})`);
    const ang = c.angle + a;
    if (Math.abs(ang) > 1e-4) parts.push(`rotate(${ang.toFixed(3)} ${c.px} ${c.py})`);
    setTf(c.g, parts.join(' '));
    c.g.setAttribute('filter', lifted ? 'url(#lift)' : 'url(#paper)');
  }
  // Entrée d'une fiche : elle arrive soulevée (ombre), se pose, la punaise s'enfonce, elle se balance
  function cardAt(c, s, t0, { dur = IN_DUR, fromX = 0, fromY = -34, turn = 0, pinAt = PIN_AT, extra = 0 } = {}) {
    const p = prog(s, t0, dur);
    if (p <= 0) { vis(c.g, 0); c.pins.forEach(pn => vis(pn.g, 0)); return false; }
    const q = easeOut(p);
    let a = turn * (1 - q) + extra;
    if (c.swing) a += wob(s, t0 + pinAt + PIN_DUR * 0.6, 2.2, 0.55, 5.5, 0.9);
    placeCard(c, { dx: fromX * (1 - q), dy: fromY * (1 - q), k: 1 + 0.06 * (1 - q), a, lifted: p < 1, o: clamp(p / 0.25) });
    c.pins.forEach((pn, j) => {
      const pp = prog(s, t0 + pinAt + 0.08 * j, PIN_DUR);
      if (!vis(pn.g, clamp(pp / 0.35))) return;
      const k = lerp(1.9, 1, easeOut(pp));
      setTf(pn.g, `translate(${pn.x} ${pn.y})` + (k !== 1 ? ` scale(${k.toFixed(3)})` : ''));
    });
    return true;
  }

  // Empreinte du tampon : cadre double, encre bleue, légèrement de travers
  function makeImprint(parent, cx, cy, label) {
    const g = el('g', {}, parent);
    const inner = el('g', { transform: `rotate(-4 ${cx} ${cy})` }, g);
    el('rect', { x: cx - 118, y: cy - 36, width: 236, height: 72, rx: 9, fill: C.blue, 'fill-opacity': 0.05, stroke: C.blue, 'stroke-width': 3 }, inner);
    el('rect', { x: cx - 112, y: cy - 30, width: 224, height: 60, rx: 6, fill: 'none', stroke: C.blue, 'stroke-width': 1.4 }, inner);
    QUESTION.forEach((l, i) => fit(text(inner, cx, cy - 7 + 24 * i, l, { size: 18, weight: 800, fill: C.blue, anchor: 'middle' }), cx + 108, `${label} ligne ${i + 1}`, cx - 108));
    return g;
  }
  function makeChip(parent, x, cy, kind, label) {
    const k = KINDS[kind];
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - 14, height: 28, rx: 14, fill: k.bg }, g);
    const tx = text(g, x + 13, cy + 6, k.label, { size: 16, weight: 800, fill: k.fg });
    r.setAttribute('width', tx.getBBox().width + 26);
    fit(g, x + 200, label);
    return { g, x, cy };
  }
  const setCaret = (caret, node, size, on) => {
    if (!vis(caret, on ? 1 : 0)) return;
    const b = node.getBBox();
    caret.setAttribute('x', f2(node.textContent ? b.x + b.width + 2 : Number(node.getAttribute('x'))));
    caret.setAttribute('y', f2(Number(node.getAttribute('y')) - size * 0.8));
  };

  // Tampon encreur, vu de trois quarts (origine : milieu du caoutchouc)
  function makeStamp() {
    const g = el('g', {}, S.stampLayer);
    const b = el('g', { transform: 'scale(0.9)' }, g);
    el('ellipse', { cx: 0, cy: -100, rx: 42, ry: 23, fill: C.ink }, b);
    el('ellipse', { cx: -13, cy: -108, rx: 16, ry: 7, fill: C.white, opacity: 0.2 }, b);
    el('rect', { x: -15, y: -84, width: 30, height: 46, fill: C.ink }, b);
    el('rect', { x: -62, y: -45, width: 124, height: 13, rx: 6, fill: STAMP_DARK }, b);
    el('rect', { x: -120, y: -36, width: 240, height: 30, rx: 7, fill: C.blue }, b);
    el('rect', { x: -110, y: -31, width: 96, height: 5, rx: 2.5, fill: C.white, opacity: 0.22 }, b);
    el('rect', { x: -114, y: -9, width: 228, height: 9, rx: 2, fill: STAMP_DARK }, b);
    return g;
  }

  // Fil tendu entre deux punaises (Q : sa flèche, positive = vers le bas)
  function makeThread(color, w = 3) {
    const sh = el('path', { fill: 'none', stroke: C.ink, 'stroke-opacity': 0.16, 'stroke-width': w, 'stroke-linecap': 'round', transform: 'translate(1.5 3)' }, S.threadLayer);
    const n = el('path', { fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, S.threadLayer);
    return { sh, n };
  }
  function setThread(th, a, b, off, { draw = 1, dash = false, o = 1 }) {
    if (!vis(th.n, o) || !vis(th.sh, o)) { vis(th.n, 0); vis(th.sh, 0); return; }
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
    let nx = -dy / len, ny = dx / len;
    if (ny < 0 || (Math.abs(ny) < 1e-6 && nx < 0)) { nx = -nx; ny = -ny; }
    if (Math.abs(ny) < 0.05) { nx = Math.abs(nx); }
    const mx = (a[0] + b[0]) / 2 + nx * off * 2, my = (a[1] + b[1]) / 2 + ny * off * 2;
    const d = `M ${f2(a[0])} ${f2(a[1])} Q ${f2(mx)} ${f2(my)} ${f2(b[0])} ${f2(b[1])}`;
    [th.n, th.sh].forEach(p => {
      p.setAttribute('d', d);
      if (draw < 1) {
        p.setAttribute('stroke-dasharray', f2(len + 2));
        p.setAttribute('stroke-dashoffset', f2((len + 2) * (1 - draw)));
      } else if (dash) {
        p.setAttribute('stroke-dasharray', '11 8');
        p.removeAttribute('stroke-dashoffset');
      } else {
        p.removeAttribute('stroke-dasharray');
        p.removeAttribute('stroke-dashoffset');
      }
    });
  }

  const S = { leads: [] };

  function build() {
    D.template({ author: 'clement' });
    D.title('L’opinion oriente,', 'le fait tranche.');
    D.chapeau('Une réunion d’une heure sans décision manque de matière première.');

    // Explication courte au-dessus du visuel : comment le lire
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Chaque ', 0], ['piste', C.blue], [' défendue en réunion est épinglée et reliée à ', 0], ['la cause', C.blue], [' par un fil.', 0]]);
    line(384, [['Une règle les trie : le ', 0], ['fait', C.tGreen], [' tranche, le reste devient une ', 0], ['hypothèse à vérifier', C.blue], ['.', 0]]);

    const defs = el('defs');
    const paper = el('filter', { id: 'paper', x: '-10%', y: '-10%', width: '120%', height: '125%' }, defs);
    el('feDropShadow', { dx: 0, dy: 3, stdDeviation: 2.6, 'flood-color': '#5a4520', 'flood-opacity': 0.22 }, paper);
    const lift = el('filter', { id: 'lift', x: '-30%', y: '-30%', width: '160%', height: '180%' }, defs);
    el('feDropShadow', { dx: 0, dy: 14, stdDeviation: 10, 'flood-color': '#3a2c12', 'flood-opacity': 0.26 }, lift);
    const cp = el('clipPath', { id: 'board' }, defs);
    el('rect', { x: BOARD.x, y: BOARD.y, width: BOARD.w, height: BOARD.h, rx: 18 }, cp);

    // ----- Le tableau : cadre en bois et liège moucheté (fixe) -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: WOOD });
    el('rect', { x: FRAME.x + 1, y: FRAME.y + 1, width: FRAME.w - 2, height: FRAME.h - 2, rx: 25, fill: 'none', stroke: WOOD_LINE, 'stroke-width': 2 });
    el('rect', { x: BOARD.x, y: BOARD.y, width: BOARD.w, height: BOARD.h, rx: 18, fill: CORK, stroke: WOOD_LINE, 'stroke-width': 2 });
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const specks = SPECKS.map(() => []);
    for (let i = 0; i < 520; i++) {
      const x = BOARD.x + 10 + rnd() * (BOARD.w - 20), y = BOARD.y + 10 + rnd() * (BOARD.h - 20), r = 0.9 + rnd() * 1.7;
      specks[Math.floor(rnd() * 3)].push(`M ${f2(x - r)} ${f2(y)} a ${f2(r)} ${f2(r)} 0 1 0 ${f2(2 * r)} 0 a ${f2(r)} ${f2(r)} 0 1 0 ${f2(-2 * r)} 0`);
    }
    specks.forEach((ds, i) => el('path', { d: ds.join(' '), fill: SPECKS[i] }));

    // ----- Calques de la scène -----
    S.scene = el('g', { 'clip-path': 'url(#board)' });
    S.cardLayer = el('g', {}, S.scene);
    S.threadLayer = el('g', {}, S.scene);
    S.pinLayer = el('g', {}, S.scene);
    S.stampLayer = el('g', {}, S.scene);
    S.pillLayer = el('g');

    // ----- La cause (en haut, au centre) : deux punaises, celle du bas reçoit les fils des pistes -----
    const HUB = [XS[1] + CW / 2, TOP_Y + 164];
    S.cause = makeCard(XS[1], TOP_Y, TOP_H, 0, C.blue, { swing: false, extraPins: [[HUB[0], HUB[1], C.blue]] });
    S.hub = HUB;
    {
      const c = S.cause;
      const t1 = text(c.g, c.cx, c.y0 + 50, 'LA CAUSE DES REBUTS', { size: 16, weight: 800, fill: MUTED, anchor: 'middle' });
      t1.setAttribute('letter-spacing', 1);
      fit(t1, c.x0 + CW - 14, 'titre cause', c.x0 + 14);
      el('circle', { cx: c.cx, cy: c.y0 + 104, r: 34, fill: C.red }, c.g);
      text(c.g, c.cx, c.y0 + 120, '?', { size: 44, weight: 800, fill: C.white, anchor: 'middle' });
    }

    // ----- La règle (en haut à gauche) -----
    S.rule = makeCard(XS[0], TOP_Y, TOP_H, -1.4, C.yellow);
    {
      const c = S.rule;
      const t1 = text(c.g, c.cx, c.y0 + 48, 'LA RÈGLE', { size: 16, weight: 800, fill: MUTED, anchor: 'middle' });
      t1.setAttribute('letter-spacing', 1.5);
      c.imp = makeImprint(c.g, c.cx, c.y0 + 100, 'règle');
      c.impC = rot(c.cx, c.y0 + 100, c.angle, c.px, c.py);
      const w = 232;
      c.line = text(c.g, c.cx - w / 2, c.y0 + 170, RULE_LINE, { size: 16, weight: 700, fill: C.tYellow });
      fit(c.line, c.x0 + CW - 14, 'règle sinon', c.x0 + 14);
      c.lineX = c.cx - c.line.getBBox().width / 2;
      c.line.setAttribute('x', f2(c.lineX));
      c.caret = el('rect', { width: 2.5, height: 17, rx: 1, fill: C.tYellow }, c.g);
    }

    // ----- Le fait (en haut à droite) : preuve datée, punaisée en vert -----
    S.fact = makeCard(XS[2], TOP_Y, TOP_H, 1.2, C.green);
    {
      const c = S.fact;
      c.border = el('rect', { x: c.x0 + 1.25, y: c.y0 + 1.25, width: CW - 2.5, height: TOP_H - 2.5, rx: 6, fill: 'none', stroke: C.green, 'stroke-width': 2.5 }, c.g);
      c.chip = makeChip(c.g, c.x0 + 16, c.y0 + 50, 'fait', 'étiquette fait');
      c.check = el('g', {}, c.g);
      checkMark(c.check, c.x0 + CW - 32, c.y0 + 50, 14);
      c.checkC = [c.x0 + CW - 32, c.y0 + 50];
      const xn = c.x0 + 16 + 50;
      c.count = text(c.g, xn, c.y0 + 112, '14', { size: 44, weight: 800, fill: C.tGreen, anchor: 'end' });
      fit(c.count, xn + 1, 'compteur 14', c.x0 + 14);
      c.unit = text(c.g, xn + 10, c.y0 + 112, 'pièces rebutées', { size: 20, weight: 800, fill: C.ink });
      fit(c.unit, c.x0 + CW - 14, 'pièces rebutées');
      c.lines = FACT_LINES.map((l, i) => {
        const n = text(c.g, c.x0 + 16, c.y0 + 144 + 26 * i, l, { size: 18, weight: 500, fill: C.ink });
        fit(n, c.x0 + CW - 14, `fait ligne ${i + 1}`);
        return n;
      });
      c.caret = el('rect', { width: 2.5, height: 18, rx: 1, fill: C.tGreen }, c.g);
    }

    // ----- Les trois pistes (en bas) -----
    LEADS.forEach((L, i) => {
      const c = makeCard(XS[i], BOT_Y, BOT_H, L.angle, C.red);
      const x0 = c.x0, y0 = c.y0, xr = x0 + CW - 16;
      el('line', { x1: x0 + 14, y1: y0 + 74, x2: x0 + CW - 14, y2: y0 + 74, stroke: PAPER_LINE, 'stroke-width': 2 }, c.g);
      c.label = text(c.g, x0 + 16, y0 + 56, `PISTE ${i + 1}`, { size: 16, weight: 800, fill: MUTED });
      c.label.setAttribute('letter-spacing', 1.5);
      c.chip = makeChip(c.g, x0 + 16, y0 + 50, L.kind, `étiquette piste ${i + 1}`);
      // Bulle : quelqu'un défend la piste
      c.bubble = el('g', {}, c.g);
      const bx = xr - 40, by = y0 + 38;
      el('path', { d: `M ${bx + 6} ${by} H ${bx + 34} Q ${bx + 40} ${by} ${bx + 40} ${by + 6} V ${by + 18} Q ${bx + 40} ${by + 24} ${bx + 34} ${by + 24} H ${bx + 16} L ${bx + 9} ${by + 31} L ${bx + 10} ${by + 24} H ${bx + 6} Q ${bx} ${by + 24} ${bx} ${by + 18} V ${by + 6} Q ${bx} ${by} ${bx + 6} ${by} Z`, fill: C.blue }, c.bubble);
      [0, 1, 2].forEach(k => el('circle', { cx: bx + 11 + 9 * k, cy: by + 12, r: 2.6, fill: C.white }, c.bubble));
      c.bubbleC = [bx + 20, by + 24];
      // Citation
      const n = L.quote.length, first = y0 + 115 - (n - 2) * 14;
      L.quote.forEach((q, k) => fit(text(c.g, x0 + 16, first + 28 * k, q, { size: 20, weight: 700, fill: C.ink }), xr + 4, `piste ${i + 1} ligne ${k + 1}`));
      // Jauge : la salle y croit
      fit(text(c.g, x0 + 16, y0 + 196, 'La salle y croit', { size: 16, weight: 500, fill: MUTED }), xr - 60, `jauge ${i + 1}`);
      c.val = text(c.g, xr, y0 + 196, `90${NB}%`, { size: 18, weight: 800, fill: C.blue, anchor: 'end' });
      el('rect', { x: x0 + 16, y: y0 + 206, width: CW - 32, height: 10, rx: 5, fill: TRACK }, c.g);
      c.bar = el('rect', { x: x0 + 16, y: y0 + 206, width: 0, height: 10, rx: 5, fill: C.blue }, c.g);
      // Empreinte du tampon (zone basse)
      c.imp = makeImprint(c.g, c.cx, y0 + 278, `empreinte piste ${i + 1}`);
      c.impC = rot(c.cx, y0 + 278, c.angle, c.px, c.py);
      // Fiche « Hypothèse à vérifier » : bandeau, puis un nom et une date
      const cpId = `band${i}`;
      const cpb = el('clipPath', { id: cpId }, defs);
      c.bandClip = el('rect', { x: x0 + 16, y: y0 + 238, width: CW - 32, height: 40 }, cpb);
      c.band = el('g', { 'clip-path': `url(#${cpId})` }, c.g);
      el('rect', { x: x0 + 16, y: y0 + 240, width: CW - 32, height: 36, rx: 8, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 1.5 }, c.band);
      el('circle', { cx: x0 + 35, cy: y0 + 256, r: 6.5, fill: 'none', stroke: C.tYellow, 'stroke-width': 2.6 }, c.band);
      el('line', { x1: x0 + 40, y1: y0 + 261, x2: x0 + 45, y2: y0 + 266, stroke: C.tYellow, 'stroke-width': 3, 'stroke-linecap': 'round' }, c.band);
      fit(text(c.band, x0 + 56, y0 + 264, 'Hypothèse à vérifier', { size: 17, weight: 800, fill: C.tYellow }), xr, `bandeau ${i + 1}`);
      // Nom et date
      const ny = y0 + 308;
      c.whoIcon = el('g', {}, c.g);
      el('circle', { cx: x0 + 25, cy: ny - 11, r: 4.6, fill: C.ink }, c.whoIcon);
      el('path', { d: `M ${x0 + 17} ${ny + 1} C ${x0 + 17} ${ny - 7}, ${x0 + 33} ${ny - 7}, ${x0 + 33} ${ny + 1} Z`, fill: C.ink }, c.whoIcon);
      c.who = text(c.g, x0 + 41, ny, L.who, { size: 17, weight: 700, fill: C.ink });
      const wx = x0 + 41 + c.who.getBBox().width + 24;
      c.whenIcon = el('g', {}, c.g);
      el('rect', { x: wx, y: ny - 16, width: 17, height: 16, rx: 3, fill: 'none', stroke: C.ink, 'stroke-width': 2.2 }, c.whenIcon);
      el('line', { x1: wx, y1: ny - 11, x2: wx + 17, y2: ny - 11, stroke: C.ink, 'stroke-width': 2.2 }, c.whenIcon);
      [wx + 5, wx + 12].forEach(x => el('line', { x1: x, y1: ny - 19, x2: x, y2: ny - 14, stroke: C.ink, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, c.whenIcon));
      c.when = text(c.g, wx + 26, ny, L.when, { size: 17, weight: 700, fill: C.ink });
      fit(c.when, xr, `date piste ${i + 1}`);
      c.caret = el('rect', { width: 2.5, height: 17, rx: 1, fill: C.ink }, c.g);
      c.thread = makeThread(THREAD);
      c.L = L;
      S.leads.push(c);
    });

    // Fil vert : le fait est relié à la cause (punaise du haut)
    S.green = makeThread(C.green, 4);
    S.stamp = makeStamp();

    // Pastilles d'étape (dans le cadre, en haut à gauche)
    S.pills = [
      pillShape(`1${NB}·${NB}Chacun défend sa piste`, { bg: C.blue, fg: C.white }),
      pillShape(`2${NB}·${NB}«${NB}Qu’est-ce qui nous permet de le dire${NB}?${NB}»`, { bg: C.blue, fg: C.white }),
      pillShape(`3${NB}·${NB}Le fait${NB}: observé, daté, mesurable`, { bg: C.blue, fg: C.white }),
      pillShape(`4${NB}·${NB}Sans réponse${NB}: une hypothèse à vérifier`, { bg: C.blue, fg: C.white }),
      pillShape('1 fait, 3 hypothèses à vérifier', { bg: C.pGreen, fg: C.tGreen, icon: true }),
    ];

    D.encart(['Aller plus loin', 'Toutes nos ressources Lean', '(lien en commentaire)']);
  }

  // ---------- Tampon : position à l'instant s ----------
  function stampState(s) {
    if (s < T_STAMP_IN || s > T_STAMP_OUT + STAMP_OUT_DUR) return null;
    const tg = [S.rule.impC, ...S.leads.map(c => c.impC)].map(([x, y]) => [x, y + 36]);
    const KH = 1.1;
    const hov = i => [tg[i][0], tg[i][1] - (i ? 38 : 20)];   // au-dessus de la règle : plus bas (la pastille est juste au-dessus)
    const st = { x: 0, y: 0, k: KH, sx: 1, sy: 1, lifted: true };
    const set = ([x, y], k) => { st.x = x; st.y = y; st.k = k; };
    if (s < PRESS[0] - DESC) {
      const q = easeOut(prog(s, T_STAMP_IN, PRESS[0] - DESC - T_STAMP_IN));
      const [hx, hy] = hov(0);
      set([lerp(hx - 430, hx, q), hy], KH);
      return st;
    }
    for (let i = 0; i < PRESS.length; i++) {
      const p0 = PRESS[i];
      if (s < p0) {                                          // descente
        const q = easeIn(prog(s, p0 - DESC, DESC));
        set([tg[i][0], lerp(hov(i)[1], tg[i][1], q)], lerp(KH, 1, q));
        return st;
      }
      if (s < p0 + HOLD) {                                   // impact : il s'écrase un peu
        const q = Math.sin(Math.PI * prog(s, p0, HOLD));
        set(tg[i], 1);
        st.sx = 1 + 0.035 * q; st.sy = 1 - 0.07 * q; st.lifted = false;
        return st;
      }
      if (s < p0 + HOLD + LIFT) {                            // il se relève
        const q = easeOut(prog(s, p0 + HOLD, LIFT));
        set([tg[i][0], lerp(tg[i][1], hov(i)[1], q)], lerp(1, KH, q));
        return st;
      }
      if (i + 1 < PRESS.length && s < PRESS[i + 1] - DESC) { // vers la piste suivante, en arc
        const a = p0 + HOLD + LIFT, q = easeInOut(prog(s, a, PRESS[i + 1] - DESC - a));
        const [ax, ay] = hov(i), [bx, by] = hov(i + 1);
        set([lerp(ax, bx, q), lerp(ay, by, q) - 28 * Math.sin(Math.PI * q)], KH);
        return st;
      }
    }
    const q = easeIn(prog(s, T_STAMP_OUT, STAMP_OUT_DUR));     // il sort par la droite
    const [hx, hy] = hov(3);
    set([lerp(hx, hx + 480, q), lerp(hy, hy - 70, q)], KH);
    return st;
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT_DUR;               // image finale (qui s'efface à partir de T_OUT)
    const s = final ? DURATION : t;                   // l'image finale est la fin de l'animation
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    vis(S.scene, fade);
    const blink = Math.floor(s / 0.26) % 2 === 0;

    // La cause
    cardAt(S.cause, s, T_CAUSE);

    // Les pistes
    S.leads.forEach((c, i) => {
      const L = c.L;
      const rises = RISES.filter(r => r[0] === i).map(r => r[1]);
      const extra = wob(s, PRESS[i + 1], 1.6, 0.48, 6, 0.85);   // le coup de tampon la fait balancer
      if (!cardAt(c, s, T_LEAD[i], { extra })) { setThread(c.thread, [0, 0], [1, 1], 0, { o: 0 }); return; }

      // Jauge : elle monte à chaque prise de parole
      let v = 0;
      rises.forEach((r, k) => { const p = prog(s, r, RISE_DUR); if (p > 0) v = lerp(k ? L.conv[k - 1] : 0, L.conv[k], easeInOut(p)); });
      c.val.textContent = `${Math.round(v)}${NB}%`;
      if (vis(c.bar, v > 0.2 ? 1 : 0)) c.bar.setAttribute('width', f2((CW - 32) * v / 100));
      let bo = 0, bk = 1;
      rises.forEach(r => {
        const u = s - r;
        if (u > 0 && u < 0.75) { const pin = prog(u, 0, 0.2); bo = clamp(pin / 0.4) * (1 - prog(u, 0.55, 0.2)); bk = popScale(pin); }
      });
      if (vis(c.bubble, bo)) setTf(c.bubble, bk === 1 ? '' : `translate(${c.bubbleC[0]} ${c.bubbleC[1]}) scale(${f2(bk)}) translate(${-c.bubbleC[0]} ${-c.bubbleC[1]})`);

      // Empreinte : révélée quand le tampon se relève, effacée au reclassement
      const tr = T_RECLASS[i];
      vis(c.imp, 0.92 * prog(s, PRESS[i + 1] + HOLD, 0.1) * (1 - prog(s, tr, 0.2)));

      // Reclassement : « PISTE n » sort, l'étiquette entre ; puis le bandeau, puis le nom et la date
      vis(c.label, 1 - prog(s, tr, 0.15));
      const pc = prog(s, tr + 0.2, 0.25);
      if (vis(c.chip.g, clamp(pc / 0.35))) {
        const k = popScale(pc);
        setTf(c.chip.g, k === 1 ? '' : `translate(${c.chip.x} ${c.chip.cy}) scale(${f2(k)}) translate(${-c.chip.x} ${-c.chip.cy})`);
      }
      const pb = prog(s, tr + 0.25, 0.3);
      if (vis(c.band, pb > 0 ? 1 : 0)) c.bandClip.setAttribute('width', f2((CW - 32) * easeOut(pb)));
      const t0 = tr + 0.58, nw = L.who.length, nd = L.when.length;
      const n = Math.floor((s - t0) * NAME_CPS);
      const nWho = clamp(n, 0, nw), nWhen = clamp(n - nw - 2, 0, nd);
      vis(c.whoIcon, s >= t0 ? 1 : 0);
      vis(c.whenIcon, n >= nw + 2 ? 1 : 0);
      c.who.textContent = L.who.slice(0, nWho);
      c.when.textContent = L.when.slice(0, nWhen);
      const typing = s >= t0 && n < nw + 2 + nd + 4;
      setCaret(c.caret, nWhen > 0 || n >= nw + 2 ? c.when : c.who, 17, typing && (n < nw + 2 + nd || blink));

      // Fil : se dessine, vibre quand on défend la piste, se détend quand personne ne peut répondre
      const pd = prog(s, T_THREAD[i], THREAD_DUR);
      if (pd <= 0) { setThread(c.thread, [0, 0], [1, 1], 0, { o: 0 }); return; }
      const slackU = s - T_SLACK[i];
      let off = wob(s, T_THREAD[i] + THREAD_DUR, 6, 0.22, 6, 1);
      rises.forEach(r => { off += wob(s, r + 0.04, 9, 0.2, 6, 1); });
      if (slackU > 0) off = 22 * spring(slackU) + wob(s, PRESS[i + 1], 4, 0.2, 6, 1);
      setThread(c.thread, [c.px, c.py], S.hub, off, { draw: easeInOut(pd), dash: slackU > 0 });
    });

    // La règle : posée, puis tamponnée la première ; sa dernière ligne s'écrit au reclassement
    {
      const c = S.rule;
      if (cardAt(c, s, T_RULE)) {
        vis(c.imp, 0.92 * prog(s, PRESS[0] + HOLD, 0.1));
        const n = Math.max(0, Math.floor((s - T_RLINE) * RULE_CPS));
        vis(c.line, s >= T_RLINE ? 1 : 0);
        c.line.textContent = RULE_LINE.slice(0, n);
        setCaret(c.caret, c.line, 16, s >= T_RLINE && n < RULE_LINE.length + 5 && (n < RULE_LINE.length || blink));
      }
    }

    // Le fait : il arrive de la droite, punaise verte, compteur qui roule, texte tapé, fil vert tendu
    {
      const c = S.fact;
      if (cardAt(c, s, T_FACT, { dur: FACT_IN, fromX: 330, fromY: -24, turn: 7, pinAt: FACT_IN - 0.02 })) {
        const pc = prog(s, T_COUNT, COUNT_DUR);
        c.count.textContent = String(Math.round(14 * easeOut(pc)));
        const n = Math.max(0, Math.floor((s - T_FTYPE) * FACT_CPS));
        const l0 = FACT_LINES[0].length;
        c.lines[0].textContent = FACT_LINES[0].slice(0, n);
        c.lines[1].textContent = FACT_LINES[1].slice(0, Math.max(0, n - l0));
        const total = l0 + FACT_LINES[1].length;
        setCaret(c.caret, n > l0 ? c.lines[1] : c.lines[0], 18, s >= T_FTYPE && n < total + 4 && (n < total || blink));
        const pf = prog(s, T_FAIT, 0.25);
        if (vis(c.chip.g, clamp(pf / 0.35))) {
          const k = popScale(pf);
          setTf(c.chip.g, k === 1 ? '' : `translate(${c.chip.x} ${c.chip.cy}) scale(${f2(k)}) translate(${-c.chip.x} ${-c.chip.cy})`);
        }
        const pk = prog(s, T_CHECK, 0.25);
        if (vis(c.check, clamp(pk / 0.35))) {
          const k = popScale(pk), [x, y] = c.checkC;
          setTf(c.check, k === 1 ? '' : `translate(${x} ${y}) scale(${f2(k)}) translate(${-x} ${-y})`);
        }
        vis(c.border, prog(s, T_FACT + FACT_IN, 0.25));
      }
      const pg = prog(s, T_GREEN, GREEN_DUR);
      if (pg <= 0) setThread(S.green, [0, 0], [1, 1], 0, { o: 0 });
      else setThread(S.green, [c.px, c.py], [S.cause.px, S.cause.py], wob(s, T_GREEN + GREEN_DUR, 5, 0.22, 6, 1), { draw: easeInOut(pg) });
    }

    // Tampon
    const st = stampState(s);
    if (vis(S.stamp, st ? 1 : 0)) {
      setTf(S.stamp, `translate(${f2(st.x)} ${f2(st.y)}) scale(${(st.k * st.sx).toFixed(4)} ${(st.k * st.sy).toFixed(4)})`);
      S.stamp.setAttribute('filter', st.lifted ? 'url(#lift)' : 'url(#paper)');
    }

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = T_PILL[i] + (i ? 0.12 : 0);
      let o = prog(s, a, 0.25);
      if (i < S.pills.length - 1) o *= 1 - prog(s, T_PILL[i + 1], 0.14);
      o *= fade;
      if (vis(g, o)) { const dy = 8 * (1 - prog(s, a, 0.25)); setTf(g, dy > 0.004 ? `translate(0 ${f2(dy)})` : ''); }
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
