// Fiche LinkedIn · Hugo Duc · mercredi 14 octobre 2026
// Post : « Quand je découvrais un standard contourné dans un atelier, ma première réaction a longtemps été la mauvaise. »
// Premier commentaire du post (Buffer) : « Retrouvez nos fiches Lean sur ce lien » → encart.
// Le visuel est la pièce maîtresse : un chemin de désir, vu de dessus. L'allée balisée (le standard) fait
// un détour ; l'opérateur coupe par la pelouse et la trace se creuse à chaque passage. Le long du détour,
// quatre panneaux disent ce que la règle n'a pas prévu. Une barrière ? Le raccourci file se cacher
// derrière la haie. Laisser faire ? Chacun trace le sien. On le regarde avec l'opérateur : le raccourci
// est pavé pierre à pierre, balisé, et devient le standard v2 ; l'ancienne allée n'est plus qu'un contour.
// Style propre : le chemin de désir (vue de dessus, trace qui se creuse, pavés qui tombent un à un).
// Image t = 0 = état final. Boucle de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const lerpPt = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
  const qbez = (a, c, b, p) => lerpPt(lerpPt(a, c, p), lerpPt(c, b, p), p);
  const easeIn = p => p * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const linear = p => p;
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const wobble = (u, amp, freq, damp) => (u <= 0 ? 0 : amp * Math.sin(u * freq * 2 * Math.PI) * Math.exp(-damp * u));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';

  // ---------- Couleurs de la scène (dérivées de la charte) ----------
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => '#' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p)).toString(16).padStart(2, '0')).join('');
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', DASH = '#b6b6d4', RED_SOFT = '#c25b5b';
  const LAWN = mix(C.green, C.white, 0.55), TUFT = mix(C.green, C.white, 0.08);
  const BUSH_HI = mix(C.green, C.white, 0.38), BUSH_LINE = mix(C.green, C.tGreen, 0.35);
  const SOIL = mix(C.tYellow, C.pYellow, 0.55);
  const PAVE = '#f7f6fa', PAVE_EDGE = '#d2d1e3', JOINT = '#e0dfec';
  const GHOST = mix(C.tGreen, LAWN, 0.4);

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const PILL_Y = 456;
  const LAWN_R = { x: 92, y: 494, w: 896, h: 560 };
  const CHIP_Y = 1070, CHIP_H = 56;
  const PS = [150, 800], PE = [930, 800];             // plots « Début » et « Fin »
  const TOP = 552;                                    // branche haute de l'allée
  const ALLEE = `M 150 800 V 600 A 48 48 0 0 1 198 ${TOP} H 882 A 48 48 0 0 1 930 600 V 800`;
  const ALLEE_OUT = `M 130 800 V 600 A 68 68 0 0 1 198 ${TOP - 20} H 882 A 68 68 0 0 1 950 600 V 800`;
  const ALLEE_IN = `M 170 800 V 600 A 28 28 0 0 1 198 ${TOP + 20} H 882 A 28 28 0 0 1 910 600 V 800`;
  const D_SC = 'M 150 800 C 300 840, 470 846, 600 830 S 840 800, 930 800';          // le raccourci
  const D_HR = 'M 930 800 C 930 905, 870 985, 760 985 L 330 985 C 225 985, 150 905, 150 800'; // derrière la haie
  const D_RA = 'M 150 800 C 240 690, 380 700, 520 730 C 650 760, 820 660, 930 800';  // chacun le sien
  const D_RB = 'M 150 800 C 180 890, 320 915, 460 905 C 600 895, 880 950, 930 800';
  const D_RC = 'M 150 800 C 300 850, 380 900, 500 880 C 620 860, 760 880, 930 800';
  const D_RD = 'M 150 800 C 330 755, 470 760, 560 800 C 650 840, 760 760, 930 800';
  const SIGN_X = [269, 450, 630, 811], SIGN_Y = 600, SIGN_W = 162, SIGN_H = 64;
  const SIGNS = [
    ['Plus long', 'que sa méthode'],
    ['Outil absent', 'ou pièce, ou info'],
    ['Cas non prévu', 'vu chaque semaine'],
    ['Écrit de loin', 'sans tenir le poste'],
  ];
  const BX = 790;                                     // barrière, en travers du raccourci
  const HEDGE_Y = 978;
  const BUSHES = [[318, 30], [366, 34], [420, 31], [472, 35], [526, 32], [580, 35], [634, 31], [688, 34], [740, 31], [786, 28]];
  const OFF = 58;                                     // arrêt des jetons au bord des plots
  const PAIR_OFF = 92;                                // l'opérateur et le manager, côte à côte
  const ROFF = 66;                                    // départs et arrivées de « chacun sa version »
  const TOK_R = 17;

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2, OUT_DUR = 0.25, END = 99;
  const T_PAD = [1.45, 1.53], T_ALLEE = 1.56, ALLEE_DUR = 0.55, T_PLATE = 2.0, T_OP = 2.15;
  const PASSES = [[2.4, 2.9], [2.95, 3.27], [3.31, 3.56], [3.6, 3.8], [3.84, 4.02]];
  const T_ROLL = 4.05, ROLL_DUR = 0.45, COUNT_MAX = 30;
  const T_HUD = 2.35, T_HUD_OUT = 5.5;
  const T_SIGN = [4.4, 4.6, 4.8, 5.0], SIGN_DROP = 0.3;
  const T_BAR = 5.5, T_APPROACH = 5.8, T_BUMP = 6.0, T_RECOIL = 6.2, T_FADE_TRACE = 6.05;
  const T_HR = [6.3, 6.95], T_HIDDEN = 6.72;
  const T_LIFT = 7.1;
  const RUN = 0.6;
  const T_WATCH = 8.35;
  const WALK1 = [8.55, 9.05], WALK2 = [9.6, 9.95];
  const T_BUBBLE = 9.02, T_YES = 9.3, T_BUBBLE_OUT = 9.58;
  const T_PAVE = 9.95, PAVE_STEP = 0.036, PAVE_DROP = 0.18, N_PAVE = 15;
  const T_GHOST = 10.05, T_PLATE2 = 10.15, T_EDGES = 10.5, T_V2 = 10.75;
  const T_CHIP = [6.95, 8.24, 10.9];
  const PILLS = [
    [1.45, `1${NB}·${NB}Le standard fait un détour`, 'b'],
    [2.35, `2${NB}·${NB}L’opérateur coupe par l’herbe`, 'b'],
    [4.35, `3${NB}·${NB}Ce que la règle n’a pas prévu`, 'b'],
    [5.5, `4${NB}·${NB}On rappelle la règle`, 'b'],
    [7.1, `5${NB}·${NB}On laisse faire`, 'b'],
    [8.35, `6${NB}·${NB}On le regarde avec l’opérateur`, 'b'],
    [10.0, `Meilleur${NB}? On l’écrit, il remplace l’ancien`, 'g'],
  ];
  const CHIPS = [
    { ok: false, title: 'Rappeler la règle', sub: 'le contournement se cache' },
    { ok: false, title: 'Laisser faire', sub: 'chacun sa version' },
    { ok: true, title: 'Le regarder avec l’opérateur', sub: 'on l’écrit, ou on corrige la cause' },
  ];
  // Jetons « chacun sa version » : couleur, tracé, départ
  const CREW = [
    { key: 'teal', color: C.teal, d: D_RA, pop: 7.15, go: 7.4 },
    { key: 'yellow', color: C.yellow, d: D_RC, pop: 7.21, go: 7.5 },
    { key: 'lightBlue', color: C.lightBlue, d: D_RB, pop: 7.27, go: 7.6 },
  ];
  const GO_BLUE = 7.3;

  const S = {};
  const R = {};

  // ---------- Géométrie des tracés ----------
  function route(d, defs) {
    const n = el('path', { d }, defs);
    const len = n.getTotalLength();
    const at = sl => { const p = n.getPointAtLength(clamp(sl, 0, len)); return [p.x, p.y]; };
    const u = (v, o0 = OFF, o1 = OFF) => at(lerp(o0, len - o1, v));
    const normal = sl => { const a = at(sl - 1.5), b = at(sl + 1.5); const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1; return [-dy / m, dx / m]; };
    const angle = sl => { const a = at(sl - 1.5), b = at(sl + 1.5); return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; };
    return { d, len, at, u, normal, angle };
  }
  // Masque qui révèle un tracé depuis son origine (longueur visible en px)
  let maskN = 0;
  function reveal(defs, d, width, cap = 'round') {
    const id = `rv${maskN++}`;
    const m = el('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1080, height: 1350 }, defs);
    const p = el('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': width, 'stroke-linecap': cap, 'stroke-linejoin': 'round' }, m);
    const len = p.getTotalLength();
    p.setAttribute('stroke-dasharray', `${f2(len)} ${f2(len + 4 * width)}`);
    return {
      url: `url(#${id})`, len,
      set(shown) { p.setAttribute('stroke-dashoffset', f2(len - clamp(shown, 0, len))); p.setAttribute('opacity', shown > 0.5 ? 1 : 0); },
    };
  }

  // ---------- Petits éléments ----------
  const scaleAbout = (n, cx, cy, k, extra = '') => n.setAttribute('transform', (k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`) + extra);
  function mark(parent, cx, cy, kind, r = 12) {   // pastille ✓ ou ✗ dessinée
    const k = r / 12;
    el('circle', { cx, cy, r, fill: kind === 'ok' ? C.green : C.red }, parent);
    const d = kind === 'ok'
      ? `M ${f2(cx - 5.5 * k)} ${f2(cy + 0.5 * k)} L ${f2(cx - 1.5 * k)} ${f2(cy + 4.5 * k)} L ${f2(cx + 5.5 * k)} ${f2(cy - 3.5 * k)}`
      : `M ${f2(cx - 4.2 * k)} ${f2(cy - 4.2 * k)} L ${f2(cx + 4.2 * k)} ${f2(cy + 4.2 * k)} M ${f2(cx + 4.2 * k)} ${f2(cy - 4.2 * k)} L ${f2(cx - 4.2 * k)} ${f2(cy + 4.2 * k)}`;
    el('path', { d, fill: 'none', stroke: C.white, 'stroke-width': 3.2 * Math.min(1, k + 0.1), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  function pillShape(parent, x, cy, label, { bg, fg, icon = null, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) mark(g, x + 31, cy, icon);
    return g;
  }
  function token(parent, color) {
    const g = el('g', {}, parent);
    const sh = el('ellipse', { cx: 2, cy: 6, rx: 16, ry: 8, fill: C.ink, opacity: 0.2 }, g);
    const body = el('g', {}, g);
    el('circle', { cx: 0, cy: 0, r: TOK_R, fill: color, stroke: C.white, 'stroke-width': 3 }, body);
    el('circle', { cx: 0, cy: -4.5, r: 5.2, fill: C.white }, body);
    el('path', { d: 'M -9 9.5 C -9 2, 9 2, 9 9.5 Z', fill: C.white }, body);
    return { g, sh, body };
  }
  function placeToken(tk, x, y, o, k = 1, bob = 0) {
    tk.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})` + (k !== 1 ? ` scale(${f2(Math.max(k, 0.001))})` : ''));
    tk.g.setAttribute('opacity', f2(o));
    tk.body.setAttribute('transform', bob ? `translate(0 ${f2(-bob)})` : '');
    tk.sh.setAttribute('transform', bob ? `scale(${f2(1 - bob * 0.04)})` : '');
  }
  // Trajectoire par segments [t0, t1, f(p) → [x, y], easing, longueur marchée (px)]
  function follow(segs, s) {
    let seg = segs[0];
    for (const sg of segs) if (s >= sg[0]) seg = sg;
    const p = clamp((s - seg[0]) / Math.max(1e-6, seg[1] - seg[0]));
    const e = (seg[3] || easeInOut)(p);
    const [x, y] = seg[2](e);
    const walked = seg[4] || 0;
    const bob = p > 0 && p < 1 && walked ? 2.6 * Math.abs(Math.sin(Math.PI * e * walked / 30)) : 0;
    return { x, y, bob, moving: p > 0 && p < 1 };
  }

  function build() {
    D.template({ author: 'hugo' });
    D.title('Standard contourné,', 'autant le lire.');
    D.chapeau('Aujourd’hui, je cherche d’abord ce que la règle n’a pas prévu.');

    // Explication courte au-dessus du visuel : comment le lire
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['L’allée, c’est le ', 0], ['standard', C.blue], ['. La trace dans l’herbe, c’est le ', 0], ['contournement', C.blue], ['.', 0]]);
    line(384, [['Plus elle se creuse, plus elle montre ', 0], ['où le standard ne tient pas face au réel', C.blue], ['.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-60%', y: '-60%', width: '220%', height: '220%' }, defs);
    el('feDropShadow', { dx: 0, dy: 8, stdDeviation: 6, 'flood-color': C.ink, 'flood-opacity': 0.22 }, lift);
    const cpLawn = el('clipPath', { id: 'lawn' }, defs);
    el('rect', { x: LAWN_R.x, y: LAWN_R.y, width: LAWN_R.w, height: LAWN_R.h, rx: 22 }, cpLawn);

    R.SC = route(D_SC, defs); R.HR = route(D_HR, defs); R.RD = route(D_RD, defs);
    CREW.forEach(c => { c.r = route(c.d, defs); });
    R.AL = route(ALLEE, defs);
    // Point de contact avec la barrière, milieu du raccourci
    let sc = 0;
    for (let sl = 0; sl < R.SC.len; sl += 0.5) if (R.SC.at(sl)[0] <= BX + 9 + TOK_R + 2) sc = sl;
    R.contact = sc;
    let sb = 0;
    for (let sl = 0; sl < R.SC.len; sl += 0.5) if (R.SC.at(sl)[0] <= BX) sb = sl;
    R.BY = R.SC.at(sb)[1];
    R.mid = R.SC.len / 2;
    R.MID = R.SC.at(R.mid);

    // ----- Cadre et pelouse -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    el('rect', { x: LAWN_R.x, y: LAWN_R.y, width: LAWN_R.w, height: LAWN_R.h, rx: 22, fill: LAWN });
    // Touffes d'herbe (grille décalée, pseudo-aléatoire fixe)
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const tufts = el('g', { 'clip-path': 'url(#lawn)' });
    for (let r = 0; r < 9; r++) for (let c = 0; c < 15; c++) {
      const x = LAWN_R.x + 30 + c * 60 + (r % 2) * 30 + (rnd() - 0.5) * 30, y = LAWN_R.y + 26 + r * 62 + (rnd() - 0.5) * 28;
      const k = 0.85 + rnd() * 0.45, a = (rnd() - 0.5) * 24;
      el('path', { d: 'M -4.5 2.5 L -2.5 -3.5 M 0 2.5 L 0 -5 M 4.5 2.5 L 2.5 -3.5', transform: `translate(${f2(x)} ${f2(y)}) rotate(${f2(a)}) scale(${f2(k)})`, fill: 'none', stroke: TUFT, 'stroke-width': 2, 'stroke-linecap': 'round' }, tufts);
    }

    // ----- Scène basse (sous la haie) -----
    S.low = el('g');
    // Le raccourci : la trace dans l'herbe
    S.traceMask = reveal(defs, D_SC, 56);
    const tr = el('g', { mask: S.traceMask.url }, S.low);
    S.traceHalo = el('path', { d: D_SC, fill: 'none', stroke: SOIL, 'stroke-width': 50, 'stroke-linecap': 'round', 'stroke-opacity': 0 }, tr);
    S.traceCore = el('path', { d: D_SC, fill: 'none', stroke: LAWN, 'stroke-width': 16, 'stroke-linecap': 'round' }, tr);
    // La trace cachée, derrière la haie
    S.hiddenMask = reveal(defs, D_HR, 30);
    S.hidden = el('g', { mask: S.hiddenMask.url }, S.low);
    el('path', { d: D_HR, fill: 'none', stroke: SOIL, 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-dasharray': '11 9', 'stroke-opacity': 0.8 }, S.hidden);
    // Chacun sa version
    [...CREW, { color: C.blue, d: D_RD, r: R.RD, key: 'blue' }].forEach(c => {
      c.mask = reveal(defs, c.d, 20);
      c.trace = el('g', { mask: c.mask.url }, S.low);
      el('path', { d: c.d, fill: 'none', stroke: c.color, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-opacity': 0.8 }, c.trace);
      if (c.key === 'blue') R.blueTrace = c;
    });

    // L'allée officielle (le standard) et son contour fantôme
    S.ghost = el('g', {}, S.low);
    [ALLEE_OUT, ALLEE_IN].forEach(d => el('path', { d, fill: 'none', stroke: GHOST, 'stroke-width': 2.6, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, S.ghost));
    S.alleeMask = reveal(defs, ALLEE, 48, 'butt');
    S.allee = el('g', { mask: S.alleeMask.url }, S.low);
    el('path', { d: ALLEE, fill: 'none', stroke: C.yellow, 'stroke-width': 40 }, S.allee);
    el('path', { d: ALLEE, fill: 'none', stroke: PAVE, 'stroke-width': 32 }, S.allee);
    el('path', { d: ALLEE, fill: 'none', stroke: JOINT, 'stroke-width': 32, 'stroke-dasharray': '2.5 24' }, S.allee);

    // Le nouveau standard : pavé pierre à pierre, puis balisé
    S.paveMask = reveal(defs, D_SC, 48, 'butt');
    S.edgeMask = reveal(defs, D_SC, 48, 'butt');
    el('path', { d: D_SC, fill: 'none', stroke: PAVE_EDGE, 'stroke-width': 40, mask: S.paveMask.url }, S.low);
    el('path', { d: D_SC, fill: 'none', stroke: C.yellow, 'stroke-width': 40, mask: S.edgeMask.url }, S.low);
    const np = el('g', { mask: S.paveMask.url }, S.low);
    el('path', { d: D_SC, fill: 'none', stroke: PAVE, 'stroke-width': 32 }, np);
    el('path', { d: D_SC, fill: 'none', stroke: JOINT, 'stroke-width': 32, 'stroke-dasharray': '2.5 24' }, np);
    // Pavés qui tombent
    S.pavers = [];
    for (let i = 0; i < N_PAVE; i++) {
      const sl = lerp(34, R.SC.len - 34, i / (N_PAVE - 1));
      const [x, y] = R.SC.at(sl), a = R.SC.angle(sl);
      const sh = el('rect', { x: -14, y: -17, width: 28, height: 34, rx: 7, fill: C.ink, opacity: 0 }, S.low);
      const g = el('g', {}, S.low);
      const st = el('rect', { x: -14, y: -17, width: 28, height: 34, rx: 7, fill: PAVE, stroke: PAVE_EDGE, 'stroke-width': 2 }, g);
      S.pavers.push({ g, sh, st, x, y, a, sl, land: T_PAVE + i * PAVE_STEP + PAVE_DROP });
    }

    // Plots de départ et d'arrivée
    S.pads = [[PS, 'Début'], [PE, 'Fin']].map(([[cx, cy], label]) => {
      const g = el('g', {}, S.low);
      el('rect', { x: cx - 42, y: cy - 25, width: 84, height: 50, rx: 16, fill: PAVE, stroke: C.yellow, 'stroke-width': 4 }, g);
      const tx = text(g, cx, cy + 6, label, { size: 17, weight: 800, fill: C.ink, anchor: 'middle' });
      fit(tx, cx + 36, `plot ${label}`, cx - 36);
      return { g, cx, cy };
    });

    // Les quatre panneaux, le long du détour
    S.signs = SIGNS.map(([title, sub], i) => {
      const cx = SIGN_X[i];
      const g = el('g', {}, S.low);
      const sh = el('rect', { x: cx - SIGN_W / 2 + 3, y: SIGN_Y + 7, width: SIGN_W, height: SIGN_H, rx: 12, fill: C.ink, opacity: 0.12 }, g);
      const board = el('g', {}, g);
      el('line', { x1: cx, y1: TOP + 16, x2: cx, y2: SIGN_Y, stroke: C.tYellow, 'stroke-width': 4, 'stroke-linecap': 'round' }, board);
      el('rect', { x: cx - SIGN_W / 2, y: SIGN_Y, width: SIGN_W, height: SIGN_H, rx: 12, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 3 }, board);
      el('circle', { cx, cy: SIGN_Y, r: 13, fill: C.yellow, stroke: C.white, 'stroke-width': 2.5 }, board);
      text(board, cx, SIGN_Y + 5.5, String(i + 1), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      fit(text(board, cx, SIGN_Y + 36, title, { size: 17, weight: 800, fill: C.ink, anchor: 'middle' }), cx + SIGN_W / 2 - 8, `panneau ${i + 1} titre`, cx - SIGN_W / 2 + 8);
      fit(text(board, cx, SIGN_Y + 55, sub, { size: 14, weight: 500, fill: C.tYellow, anchor: 'middle' }), cx + SIGN_W / 2 - 8, `panneau ${i + 1} détail`, cx - SIGN_W / 2 + 8);
      return { g, sh, board, cx };
    });

    // Plaque de l'allée : « Le standard », puis « Ancien standard »
    const plate = (label, bg, fg, stroke) => {
      const g = el('g', {}, S.low);
      const r = el('rect', { y: TOP - 17, height: 34, rx: 17, fill: bg, stroke: stroke || 'none', 'stroke-width': 2, 'stroke-dasharray': stroke ? '6 5' : 'none' }, g);
      const tx = text(g, 540, TOP + 6, label, { size: 17, weight: 800, fill: fg, anchor: 'middle' });
      const w = tx.getBBox().width + 34;
      r.setAttribute('x', f2(540 - w / 2)); r.setAttribute('width', f2(w));
      fit(tx, 700, `plaque ${label}`, 380);
      return g;
    };
    S.plate1 = plate('Le standard', C.blue, C.white);
    S.plate2 = plate('Ancien standard', FRAME_BG, MUTED, DASH);

    // Pastille « Standard v2 » sur le nouveau chemin
    S.v2 = el('g', {}, S.low);
    const [mx, my] = R.MID;
    const v2r = el('rect', { y: my - 19, height: 38, rx: 19, fill: C.pGreen, stroke: C.white, 'stroke-width': 3 }, S.v2);
    const v2t = text(S.v2, 0, my + 6.5, 'Standard v2', { size: 19, weight: 800, fill: C.tGreen });
    const v2w = v2t.getBBox().width + 66;
    v2r.setAttribute('x', f2(mx - v2w / 2)); v2r.setAttribute('width', f2(v2w));
    v2t.setAttribute('x', f2(mx - v2w / 2 + 48));
    mark(S.v2, mx - v2w / 2 + 25, my, 'ok', 12);
    fit(v2t, 988, 'pastille v2');

    // Jetons : l'opérateur, ses collègues, le manager
    S.crew = CREW.map(c => ({ ...c, tk: token(S.low, c.color) }));
    // Traînée de vitesse : dégradé qui suit le jeton (opaque contre lui, transparent au bout)
    S.streakG = el('linearGradient', { id: 'streakG', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    el('stop', { offset: 0, 'stop-color': C.blue, 'stop-opacity': 0.5 }, S.streakG);
    el('stop', { offset: 1, 'stop-color': C.blue, 'stop-opacity': 0 }, S.streakG);
    S.streak = el('path', { d: 'M 0 0', fill: 'none', stroke: 'url(#streakG)', 'stroke-width': 20, 'stroke-linecap': 'butt', 'stroke-linejoin': 'round', opacity: 0 }, S.low);
    S.op = token(S.low, C.blue);
    S.mg = token(S.low, C.violet);
    // Loupe du manager
    S.lens = el('g', {}, S.low);
    el('line', { x1: 8, y1: 8, x2: 17, y2: 17, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, S.lens);
    el('circle', { cx: 0, cy: 0, r: 11, fill: C.white, 'fill-opacity': 0.55, stroke: C.ink, 'stroke-width': 3.5 }, S.lens);

    // ----- La haie (décor fixe, au-dessus des jetons qui passent derrière) -----
    BUSHES.forEach(([x, r], i) => el('ellipse', { cx: x + 5, cy: HEDGE_Y + 10 + (i % 2) * 4, rx: r, ry: r * 0.8, fill: C.ink, opacity: 0.1 }));
    BUSHES.forEach(([x, r], i) => {
      const y = HEDGE_Y + (i % 2 ? 5 : -3);
      el('circle', { cx: x, cy: y, r, fill: C.green, stroke: BUSH_LINE, 'stroke-width': 2 });
      el('circle', { cx: x - r * 0.28, cy: y - r * 0.3, r: r * 0.42, fill: BUSH_HI, opacity: 0.7 });
    });

    // ----- Scène haute -----
    S.high = el('g');
    // Barrière (vue de dessus) et son disque d'interdiction
    S.barShadow = el('rect', { x: BX - 10, y: R.BY - 66, width: 20, height: 132, rx: 6, fill: C.ink, opacity: 0 }, S.high);
    S.barrier = el('g', {}, S.high);
    el('rect', { x: BX - 9, y: R.BY - 62, width: 18, height: 124, rx: 5, fill: C.white, stroke: C.red, 'stroke-width': 2 }, S.barrier);
    for (let k = 0; k < 7; k += 2) el('rect', { x: BX - 8, y: R.BY - 61 + k * 17.4, width: 16, height: 17.4, fill: C.red }, S.barrier);
    [-66, 66].forEach(dy => el('circle', { cx: BX, cy: R.BY + dy, r: 8, fill: C.ink }, S.barrier));
    el('circle', { cx: BX, cy: R.BY - 88, r: 15, fill: C.red, stroke: C.white, 'stroke-width': 3 }, S.barrier);
    el('rect', { x: BX - 8, y: R.BY - 90.5, width: 16, height: 5, rx: 2, fill: C.white }, S.barrier);
    // Choc contre la barrière : étincelles au-dessus et au-dessous du point de contact
    S.impact = el('g', {}, S.high);
    S.impactC = [BX + 9, R.SC.at(R.contact)[1]];
    [-80, -50, 50, 80].forEach(a => {
      const rad = a * Math.PI / 180, ca = Math.cos(rad), sa = Math.sin(rad), [ix, iy] = S.impactC;
      el('line', { x1: f2(ix + 25 * ca), y1: f2(iy + 25 * sa), x2: f2(ix + 36 * ca), y2: f2(iy + 36 * sa), stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.impact);
    });
    // Badge « caché » au-dessus de la haie
    S.hide = el('g', {}, S.high);
    const hx = 545, hy = 918;
    const hr = el('rect', { y: hy - 17, height: 34, rx: 17, fill: C.pRed, stroke: C.white, 'stroke-width': 2.5 }, S.hide);
    const ht = text(S.hide, 0, hy + 6, 'caché', { size: 17, weight: 800, fill: C.tRed });
    const hw = ht.getBBox().width + 62;
    hr.setAttribute('x', f2(hx - hw / 2)); hr.setAttribute('width', f2(hw));
    ht.setAttribute('x', f2(hx - hw / 2 + 46));
    const ex = hx - hw / 2 + 25;
    el('path', { d: `M ${ex - 11} ${hy} Q ${ex} ${hy - 10} ${ex + 11} ${hy} Q ${ex} ${hy + 10} ${ex - 11} ${hy} Z`, fill: 'none', stroke: C.tRed, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, S.hide);
    el('circle', { cx: ex, cy: hy, r: 3.2, fill: C.tRed }, S.hide);
    el('line', { x1: ex - 9, y1: hy + 9, x2: ex + 9, y2: hy - 9, stroke: C.tRed, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, S.hide);
    S.hideC = [hx, hy];
    // Bulle de décision au-dessus de l'opérateur et du manager
    S.bubble = el('g', {}, S.high);
    const by = my - 76, bh = 44;
    const bR = el('rect', { y: by - bh / 2, height: bh, rx: 14, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.bubble);
    el('path', { d: `M ${mx - 10} ${by + bh / 2 - 1} L ${mx} ${by + bh / 2 + 11} L ${mx + 10} ${by + bh / 2 - 1} Z`, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2, 'stroke-linejoin': 'round' }, S.bubble);
    el('rect', { x: mx - 12, y: by + bh / 2 - 4, width: 24, height: 4, fill: C.white }, S.bubble);
    S.q1 = text(S.bubble, mx, by + 6.5, `Meilleur que le standard${NB}?`, { size: 18, weight: 800, fill: C.ink, anchor: 'middle' });
    S.q2 = el('g', {}, S.bubble);
    const q2t = text(S.q2, 0, by + 6.5, `Oui${NB}: on l’écrit`, { size: 18, weight: 800, fill: C.tGreen });
    const q2w = q2t.getBBox().width + 32;
    q2t.setAttribute('x', f2(mx - q2w / 2 + 32));
    S.q2mark = el('g', {}, S.q2);
    mark(S.q2mark, mx - q2w / 2 + 11, by, 'ok', 11);
    S.q2c = [mx - q2w / 2 + 11, by];
    const bw = Math.max(S.q1.getBBox().width, q2w) + 40;
    bR.setAttribute('x', f2(mx - bw / 2)); bR.setAttribute('width', f2(bw));
    fit(S.q1, mx + bw / 2 - 12, 'bulle question', mx - bw / 2 + 12);
    fit(q2t, mx + bw / 2 - 12, 'bulle réponse', mx - bw / 2 + 12);
    S.bubbleC = [mx, by + bh / 2 + 10];

    // Compteur de passages (en haut à droite du cadre)
    S.hud = el('g', {}, S.high);
    const HX1 = 988, HX0 = 790;
    el('rect', { x: HX0, y: PILL_Y - 21, width: HX1 - HX0, height: 42, rx: 21, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.hud);
    [[HX0 + 22, PILL_Y + 3, -14], [HX0 + 33, PILL_Y - 4, 12]].forEach(([x, y, a]) => {
      const fp = el('g', { transform: `translate(${x} ${y}) rotate(${a})` }, S.hud);
      el('ellipse', { cx: 0, cy: 1.5, rx: 3.6, ry: 5.6, fill: SOIL }, fp);
      el('circle', { cx: 0, cy: -6.8, r: 2.4, fill: SOIL }, fp);
    });
    fit(text(S.hud, HX0 + 50, PILL_Y + 6, 'Passages', { size: 17, weight: 500, fill: MUTED }), HX1 - 62, 'compteur libellé');
    const cpN = el('clipPath', { id: 'odo' }, defs);
    el('rect', { x: HX1 - 60, y: PILL_Y - 17, width: 48, height: 34 }, cpN);
    const odo = el('g', { 'clip-path': 'url(#odo)' }, S.hud);
    S.n0 = text(odo, HX1 - 18, PILL_Y + 8, '0', { size: 22, weight: 800, fill: C.ink, anchor: 'end' });
    S.n1 = text(odo, HX1 - 18, PILL_Y + 8, '1', { size: 22, weight: 800, fill: C.ink, anchor: 'end' });

    // ----- Pastilles d'étape (dans le cadre, en haut à gauche) -----
    S.pills = PILLS.map(([, label, k], i) => {
      const p = pillShape(D.svg, 92, PILL_Y, label, k === 'g' ? { bg: C.pGreen, fg: C.tGreen, icon: 'ok' } : { bg: C.blue, fg: C.white });
      fit(p, 790, `pastille ${i + 1}`);
      return p;
    });

    // ----- Les trois réponses, en bas du cadre -----
    const natural = CHIPS.map(c => {
      const a = text(D.svg, 0, -100, c.title, { size: 17, weight: 800 }), b = text(D.svg, 0, -100, c.sub, { size: 15, weight: 500 });
      const w = Math.max(a.getBBox().width, b.getBBox().width);
      a.remove(); b.remove();
      return 52 + w + 18;
    });
    const GAP = 12, extra = (LAWN_R.w - 2 * GAP - natural.reduce((a, b) => a + b, 0)) / 3;
    if (extra < 0) console.error(`Débordement : réponses (${Math.round(-extra * 3)} px de trop)`);
    let cx0 = LAWN_R.x;
    S.chips = CHIPS.map((c, i) => {
      const w = natural[i] + extra, x = cx0;
      cx0 += w + GAP;
      const ghost = el('rect', { x: x + 1, y: CHIP_Y + 1, width: w - 2, height: CHIP_H - 2, rx: 16, fill: 'none', stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '7 6' });
      const g = el('g');
      el('rect', { x, y: CHIP_Y, width: w, height: CHIP_H, rx: 16, fill: c.ok ? C.pGreen : C.pRed, stroke: c.ok ? C.green : C.red, 'stroke-width': c.ok ? 2.5 : 2 }, g);
      mark(g, x + 28, CHIP_Y + CHIP_H / 2, c.ok ? 'ok' : 'x', 13);
      fit(text(g, x + 52, CHIP_Y + 25, c.title, { size: 17, weight: 800, fill: c.ok ? C.tGreen : C.tRed }), x + w - 10, `réponse ${i + 1} titre`);
      fit(text(g, x + 52, CHIP_Y + 45, c.sub, { size: 15, weight: 500, fill: c.ok ? C.tGreen : RED_SOFT }), x + w - 10, `réponse ${i + 1} détail`);
      return { g, ghost, cx: x + w / 2, cy: CHIP_Y + CHIP_H / 2 };
    });

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- Trajectoires des jetons ----------
  const pair = (sl, side) => { const [x, y] = R.SC.at(sl), [nx, ny] = R.SC.normal(sl); return [x + side * 16 * nx, y + side * 16 * ny]; };
  function opSegs() {
    const SC = R.SC, HR = R.HR, RD = R.RD;
    const segs = [[0, 0, () => SC.u(0), linear]];
    PASSES.forEach(([a, b], i) => segs.push([a, b, p => SC.u(i % 2 ? 1 - p : p), easeInOut, SC.len - 2 * OFF]));
    const recoilAt = R.contact + 34;
    segs.push([T_APPROACH, T_BUMP, p => SC.at(lerp(SC.len - OFF, R.contact, p)), easeIn, SC.len - OFF - R.contact]);
    segs.push([T_BUMP, T_RECOIL, p => SC.at(lerp(R.contact, recoilAt, p)), easeOut, 0]);
    segs.push([T_RECOIL + 0.02, T_HR[0], p => lerpPt(SC.at(recoilAt), HR.u(0), p), easeInOut, 60]);
    segs.push([T_HR[0], T_HR[1], p => HR.u(p, OFF, ROFF), easeInOut, HR.len - OFF - ROFF]);
    segs.push([T_LIFT, T_LIFT + 0.18, p => qbez(HR.u(1, OFF, ROFF), [232, 858], RD.u(0, ROFF, ROFF), p), easeInOut, 90]);
    segs.push([GO_BLUE, GO_BLUE + RUN, p => RD.u(p, ROFF, ROFF), easeInOut, RD.len - 2 * ROFF]);
    segs.push([T_WATCH, WALK1[0] - 0.02, p => lerpPt(RD.u(1, ROFF, ROFF), pair(SC.len - PAIR_OFF, 1), p), easeInOut, 30]);
    segs.push([WALK1[0], WALK1[1], p => pair(lerp(SC.len - PAIR_OFF, R.mid, p), 1), easeInOut, R.mid - PAIR_OFF]);
    segs.push([WALK2[0], WALK2[1], p => pair(lerp(R.mid, PAIR_OFF, p), 1), easeInOut, R.mid - PAIR_OFF]);
    return segs;
  }
  let OP = null, MG = null;
  function mgSegs() {
    const SC = R.SC;
    return [
      [0, 0, () => pair(SC.len - PAIR_OFF, -1), linear],
      [WALK1[0], WALK1[1], p => pair(lerp(SC.len - PAIR_OFF, R.mid, p), -1), easeInOut, R.mid - PAIR_OFF],
      [WALK2[0], WALK2[1], p => pair(lerp(R.mid, PAIR_OFF, p), -1), easeInOut, R.mid - PAIR_OFF],
    ];
  }
  // Nombre de passages (fractionnaire pendant chaque passage)
  const count = s => PASSES.reduce((a, [p0, p1]) => a + prog(s, p0, p1 - p0), 0) + (COUNT_MAX - PASSES.length) * easeInOut(prog(s, T_ROLL, ROLL_DUR));

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    if (!OP) { OP = opSegs(); MG = mgSegs(); }
    const final = t < T_OUT + OUT_DUR;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const s = final ? END : t;
    S.low.setAttribute('opacity', f2(fade));
    S.high.setAttribute('opacity', f2(fade));
    const SC = R.SC;

    // Plots
    S.pads.forEach((p, i) => {
      const pp = prog(s, T_PAD[i], 0.35);
      scaleAbout(p.g, p.cx, p.cy, popScale(pp));
      p.g.setAttribute('opacity', f2(clamp(pp / 0.4)));
    });

    // Allée officielle : se dessine, puis ne reste qu'un contour fantôme (l'herbe repousse dessous)
    S.alleeMask.set(S.alleeMask.len * easeInOut(prog(s, T_ALLEE, ALLEE_DUR)));
    const gh = easeInOut(prog(s, T_GHOST, 0.45));
    S.allee.setAttribute('opacity', f2(1 - gh));
    S.ghost.setAttribute('opacity', f2(gh));

    // Plaque de l'allée : l'ancienne sort, la nouvelle entre
    const p1 = prog(s, T_PLATE, 0.35), p1o = prog(s, T_PLATE2, 0.14);
    scaleAbout(S.plate1, 540, TOP, popScale(p1));
    S.plate1.setAttribute('opacity', f2(clamp(p1 / 0.4) * (1 - p1o)));
    const p2 = prog(s, T_PLATE2 + 0.14, 0.3);
    scaleAbout(S.plate2, 540, TOP, popScale(p2));
    S.plate2.setAttribute('opacity', f2(clamp(p2 / 0.4)));

    // La trace du raccourci : se creuse à chaque passage, s'efface derrière la barrière, revient
    const c = count(s);
    const k = 0.14 + 0.86 * Math.pow(clamp(c / COUNT_MAX), 0.65);
    const fm = 1 - 0.86 * prog(s, T_FADE_TRACE, 0.4) + 0.86 * prog(s, T_WATCH, 0.3);
    const kk = clamp(k * fm);
    S.traceCore.setAttribute('stroke', mix(LAWN, SOIL, kk));
    S.traceCore.setAttribute('stroke-width', f2(14 + 9 * k));
    S.traceHalo.setAttribute('stroke-opacity', f2(0.26 * kk));
    const pp1 = prog(s, PASSES[0][0], PASSES[0][1] - PASSES[0][0]);
    S.traceMask.set(pp1 >= 1 ? SC.len : pp1 <= 0 ? 0 : lerp(OFF, SC.len - OFF, easeInOut(pp1)) + TOK_R);

    // Opérateur
    const op = follow(OP, s);
    const opIn = prog(s, T_OP, 0.35);
    placeToken(S.op, op.x, op.y, clamp(opIn / 0.4), popScale(opIn), op.bob);
    // Traînée pendant les passages rapides (accéléré)
    const fast = PASSES.findIndex(([a, b]) => s > a && s < b);
    if (fast >= 2) {
      const pts = [0, 1, 2, 3, 4, 5, 6].map(i => (i ? follow(OP, Math.max(PASSES[fast][0], s - 0.012 * i)) : op));
      const tail = pts[pts.length - 1];
      S.streak.setAttribute('d', `M ${pts.map(g => `${f2(g.x)} ${f2(g.y)}`).join(' L ')}`);
      [['x1', op.x], ['y1', op.y], ['x2', tail.x + (tail.x === op.x ? 1 : 0)], ['y2', tail.y]].forEach(([k, v]) => S.streakG.setAttribute(k, f2(v)));
      S.streak.setAttribute('opacity', f2(0.55 + 0.15 * fast));
    } else S.streak.setAttribute('opacity', 0);

    // Trace cachée (derrière la haie)
    const ph = prog(s, T_HR[0], T_HR[1] - T_HR[0]);
    S.hiddenMask.set(ph >= 1 ? R.HR.len : ph <= 0 ? 0 : lerp(OFF, R.HR.len - ROFF, easeInOut(ph)) + TOK_R);
    S.hidden.setAttribute('opacity', f2(1 - prog(s, T_LIFT, 0.3)));

    // Chacun sa version : trois collègues, puis l'opérateur
    const crewOut = prog(s, T_WATCH, 0.3);
    S.crew.forEach(cw => {
      const pr = prog(s, cw.go, RUN), e = easeInOut(pr);
      const [x, y] = cw.r.u(e, ROFF, ROFF);
      const pin = prog(s, cw.pop, 0.26);
      const bob = pr > 0 && pr < 1 ? 2.6 * Math.abs(Math.sin(Math.PI * e * (cw.r.len - 2 * ROFF) / 30)) : 0;
      placeToken(cw.tk, x, y, clamp(pin / 0.4) * (1 - crewOut), popScale(pin) * (1 - 0.5 * easeIn(crewOut)), bob);
      cw.mask.set(pr >= 1 ? cw.r.len : pr <= 0 ? 0 : lerp(ROFF, cw.r.len - ROFF, e) + TOK_R);
      cw.trace.setAttribute('opacity', f2(1 - crewOut));
    });
    const pb = prog(s, GO_BLUE, RUN);
    R.blueTrace.mask.set(pb >= 1 ? R.RD.len : pb <= 0 ? 0 : lerp(ROFF, R.RD.len - ROFF, easeInOut(pb)) + TOK_R);
    R.blueTrace.trace.setAttribute('opacity', f2(1 - crewOut));

    // Manager et sa loupe
    const mg = follow(MG, s);
    const mIn = prog(s, T_WATCH + 0.13, 0.3);
    placeToken(S.mg, mg.x, mg.y, clamp(mIn / 0.4), popScale(mIn), mg.bob);
    const lo = prog(s, WALK1[0] - 0.1, 0.2) * (1 - prog(s, WALK2[1] - 0.1, 0.2));
    const pause = prog(s, WALK1[1], WALK2[0] - WALK1[1]);
    const sweep = pause > 0 && pause < 1 ? 12 * Math.sin(pause * Math.PI * 3) : 0;
    S.lens.setAttribute('transform', `translate(${f2(mg.x - 44 + sweep)} ${f2(mg.y - 10 - mg.bob)})`);
    S.lens.setAttribute('opacity', f2(lo));

    // Bulle de décision
    const qb = prog(s, T_BUBBLE, 0.3), qo = prog(s, T_BUBBLE_OUT, 0.16);
    scaleAbout(S.bubble, S.bubbleC[0], S.bubbleC[1], popScale(qb) * (1 - 0.25 * qo));
    S.bubble.setAttribute('opacity', f2(clamp(qb / 0.4) * (1 - qo)));
    S.q1.setAttribute('opacity', f2(1 - prog(s, T_YES, 0.1)));              // la question sort…
    const qy = prog(s, T_YES + 0.12, 0.18);                                   // …puis la réponse entre
    S.q2.setAttribute('opacity', f2(clamp(qy / 0.4)));
    scaleAbout(S.q2mark, S.q2c[0], S.q2c[1], popScale(qy));

    // Pavés qui tombent un à un, puis le balisage jaune : il devient le standard
    let front = 0;
    S.pavers.forEach((pv, i) => {
      const q = prog(s, pv.land - PAVE_DROP, PAVE_DROP);
      const u = s - pv.land;
      if (u >= 0) front = i === N_PAVE - 1 ? SC.len : pv.sl + (SC.len - 68) / (N_PAVE - 1) / 2;
      const o = clamp(q / 0.3) * (1 - prog(u, 0.08, 0.16));
      const sq = u >= 0 && u < 0.1 ? 1 - 0.12 * Math.sin(Math.PI * u / 0.1) : 1;
      const sc = q < 1 ? 1.7 - 0.7 * easeIn(q) : sq;
      const dy = -26 * (1 - easeIn(q));
      pv.g.setAttribute('opacity', f2(o));
      pv.g.setAttribute('transform', `translate(${f2(pv.x)} ${f2(pv.y + dy)}) rotate(${f2(pv.a)}) scale(${f2(sc)})`);
      pv.sh.setAttribute('opacity', f2(q > 0 && q < 1 ? 0.2 * q : 0));
      pv.sh.setAttribute('transform', `translate(${f2(pv.x + 3)} ${f2(pv.y + 5)}) rotate(${f2(pv.a)}) scale(${f2(1 + 0.35 * (1 - q))})`);
    });
    S.paveMask.set(front);
    S.edgeMask.set(SC.len * easeInOut(prog(s, T_EDGES, 0.35)));
    const pv2 = prog(s, T_V2, 0.35);
    scaleAbout(S.v2, R.MID[0], R.MID[1], popScale(pv2));
    S.v2.setAttribute('opacity', f2(clamp(pv2 / 0.4)));

    // Panneaux plantés le long du détour (chute, puis oscillation amortie)
    S.signs.forEach((sg, i) => {
      const q = prog(s, T_SIGN[i], SIGN_DROP), u = s - T_SIGN[i] - SIGN_DROP;
      const dy = -18 * (1 - easeIn(q)), kz = 1 + 0.12 * (1 - easeIn(q));
      const rot = wobble(u, 5, 2.4, 6);
      const sy = u > 0 && u < 0.14 ? 1 - 0.06 * Math.sin(Math.PI * u / 0.14) : 1;
      const pcx = sg.cx, pcy = SIGN_Y + SIGN_H / 2;
      sg.g.setAttribute('opacity', f2(clamp(q / 0.3)));
      sg.board.setAttribute('transform', `translate(0 ${f2(dy)})` + (kz !== 1 ? ` translate(${pcx} ${pcy}) scale(${f2(kz)}) translate(${-pcx} ${-pcy})` : '')
        + (rot ? ` rotate(${f2(rot)} ${sg.cx} ${TOP + 16})` : '') + (sy !== 1 ? ` translate(${sg.cx} ${TOP + 16}) scale(1 ${f2(sy)}) translate(${-sg.cx} ${-(TOP + 16)})` : ''));
      sg.sh.setAttribute('opacity', f2(0.12 * easeIn(q)));
    });

    // Barrière : tombe, encaisse le choc, puis se lève et s'en va
    const pB = prog(s, T_BAR, 0.25), pL = prog(s, T_LIFT, 0.28);
    const kB = (pB < 1 ? 1.25 - 0.25 * easeIn(pB) : 1) + 0.2 * easeIn(pL);
    const shake = wobble(s - T_BUMP, 3, 3, 7);
    S.barrier.setAttribute('transform', `translate(${BX} ${f2(R.BY)}) rotate(${f2(shake)}) scale(${f2(kB)}) translate(${-BX} ${f2(-R.BY)})`);
    S.barrier.setAttribute('opacity', f2(clamp(pB / 0.3) * (1 - pL)));
    const lifted = 1 - (pB < 1 ? easeIn(pB) : 1) + easeIn(pL);
    S.barShadow.setAttribute('opacity', f2(0.16 * clamp(pB / 0.3) * (1 - pL)));
    S.barShadow.setAttribute('transform', `translate(${f2(4 + 16 * lifted)} ${f2(6 + 22 * lifted)})`);
    const pi = prog(s, T_BUMP, 0.28);
    S.impact.setAttribute('opacity', f2(pi > 0 && pi < 1 ? 1 - easeIn(pi) : 0));
    scaleAbout(S.impact, S.impactC[0], S.impactC[1], 0.75 + 0.45 * easeOut(pi));

    // Badge « caché »
    const ph2 = prog(s, T_HIDDEN, 0.3), ph2o = prog(s, T_LIFT, 0.18);
    scaleAbout(S.hide, S.hideC[0], S.hideC[1], popScale(ph2));
    S.hide.setAttribute('opacity', f2(clamp(ph2 / 0.4) * (1 - ph2o)));

    // Compteur de passages : les chiffres roulent
    const hIn = prog(s, T_HUD, 0.3), hOut = prog(s, T_HUD_OUT, 0.25);
    S.hud.setAttribute('opacity', f2(clamp(hIn / 0.4) * (1 - hOut)));
    S.hud.setAttribute('transform', hIn < 1 ? `translate(0 ${f2(8 * (1 - easeOut(hIn)))})` : '');
    const cc = Math.min(c, COUNT_MAX), n = Math.floor(cc + 1e-6), fr = cc - n;
    const roll = n >= COUNT_MAX ? 0 : easeInOut(clamp((fr - 0.55) / 0.45));
    S.n0.textContent = String(n); S.n1.textContent = String(n + 1);
    S.n0.setAttribute('transform', roll ? `translate(0 ${f2(-30 * roll)})` : '');
    S.n1.setAttribute('transform', `translate(0 ${f2(30 * (1 - roll))})`);
    S.n1.setAttribute('opacity', roll ? 1 : 0);

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.12 : 0);
      const b = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      const o = final ? (i === PILLS.length - 1 ? fade : 0) : prog(t, a, 0.25) * (1 - prog(t, b, 0.14));
      const dy = final ? 0 : 8 * (1 - prog(t, a, 0.25));
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });

    // Les trois réponses : tamponnées une à une, contour fantôme avant
    S.chips.forEach((ch, i) => {
      const q = final ? 1 : prog(t, T_CHIP[i], 0.32);
      const o = final ? fade : clamp(q / 0.35);
      const kq = q <= 0 ? 1.1 : q >= 1 ? 1 : 1.1 - 0.1 * easeOut(q) + 0.025 * Math.sin(Math.PI * q);
      ch.g.setAttribute('opacity', f2(o));
      ch.g.setAttribute('transform', `translate(${f2(ch.cx)} ${f2(ch.cy)}) rotate(${f2(-2.5 * (1 - easeOut(q)))}) scale(${f2(kq)}) translate(${f2(-ch.cx)} ${f2(-ch.cy)})`);
      ch.ghost.setAttribute('opacity', f2(final ? 1 - fade : 1 - clamp(q / 0.35)));
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
