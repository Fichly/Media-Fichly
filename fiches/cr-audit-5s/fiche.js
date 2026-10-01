// Fiche LinkedIn · Clément Raymond · jeudi 15 octobre 2026
// Post : « Une zone peut obtenir 90 % à son audit 5S… sans que rien n'ait changé dans la façon d'y travailler. »
// Premier commentaire du post : notre checklist d'audit 5S + notre article sur la méthode 5S → encart.
// Le visuel est la pièce maîtresse : l'instantané contre le direct. À gauche, la zone filmée en continu
// (« en direct ») et, dessous, sa note qui se trace. À chaque audit, la zone est préparée juste avant (tout
// se range, ça brille), un flash fige un polaroïd « 90 % » qui part se punaiser à droite, puis la zone se
// dégrade de nouveau : les photos disent toujours 90 %, le direct dit l'inverse. Les cinq signes du post
// passent dans le bandeau du direct. Puis l'audit utile : la zone se dote de signaux (silhouettes des outils,
// repère de niveau, écart qui revient) qui détectent l'écart tout de suite, et chaque écart punaise une action
// ou une modification du standard à la place des photos.
// Style propre : l'instantané contre le direct. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  const damp = (u, a, w = 15, k = 5) => (u > 0 && u < 1.2 ? a * Math.exp(-k * u) * Math.sin(w * u) : 0);
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const show = (n, on) => n.setAttribute('display', on ? 'inline' : 'none');
  const NB = ' ';

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', GRID = '#e6e6f0';
  const WALL = '#eef0f8', FLOOR = '#e1e3ef', FURN = '#b8bad6', STEEL = '#9a9dc6', BOARD_LINE = '#d4d6e8';
  const SIL_LINE = '#a9abd0', CORK_LINE = '#ece0b0', SPOT = '#c6c8de', CARTON = '#ecd9a0', CARTON_LINE = '#c9a94f';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const PILL_Y = 456;
  const BEZ = { x: 84, y: 490, w: 648, h: 424 };       // l'écran du direct
  const SCR = { x: 96, y: 502, w: 624, h: 356 };
  const TICK_Y = 886;                                   // bandeau du direct
  const CH = { x: 84, y: 930, w: 648, h: 196 };        // la note, en direct
  const CORK = { x: 750, y: 490, w: 246, h: 636 };     // le tableau où l'on punaise
  const FLOOR_Y = 768;
  const BOARD = { x: 120, y: 562, w: 284, h: 156 };    // tableau d'outils
  const SLOT_X = [158, 228, 298, 364], TOOL_Y = 640;
  const BIN = { x: 500, y: 618, w: 150, h: 100 };      // bac de pièces (bas : 718)
  const LEVEL_MIN = 0.3;
  const PX0 = 160, PX1 = 708;
  const yOf = n => 1090 - (n - 50) * 1.8;

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION;
  const T_OUT = 1.2, T_CUT = 1.38;                      // l'image finale s'efface, retour en semaine 10
  const T_A = 1.7, CYC = 1.72;                          // trois audits cosmétiques
  const T_B = 6.9;                                      // l'audit utile
  const T_FIN = 11.25;
  const cyc = i => T_A + i * CYC;
  const FLASH = [0, 1, 2].map(i => cyc(i) + 0.95);
  const E1 = 8.0, E2 = 9.12, E3 = 10.18;                // écarts : outil, niveau, outil (2e fois)
  const DIPS = [E1 + 0.25, E2 + 0.33, E3 + 0.25];
  const K_FLY = [E1 + 0.5, E2 + 0.5, E3 + 0.57], FLY = 0.45;
  // Alerte qui pulse au moment où l'écart est détecté : [t, objet]
  const PULSES = [[E1 + 0.18, 'slot'], [E2 + 0.34, 'bin'], [E3 + 0.18, 'slot']];
  const xOf = s => PX0 + (PX1 - PX0) * clamp((s - T_A) / (T_FIN - T_A));

  // ---------- Les objets de la zone ----------
  const HOME = SLOT_X.map(x => ({ x, y: TOOL_Y, r: 0, home: true }));
  const MESSY = [{ x: 190, y: 717, r: 84 }, { x: 252, y: 808, r: -80 }, { x: 352, y: 723, r: 98 }, { x: 404, y: 824, r: 68 }];
  const GONE = { x: 450, y: 420, r: -28 };
  const KF = [0, 1, 2, 3].map(() => []);
  for (let i = 0; i < 3; i++) {
    const c = cyc(i);
    [0, 1, 2, 3].forEach(k => {
      KF[k].push({ t: c + 0.32 + 0.09 * k, d: 0.38, to: HOME[k] });
      KF[k].push({ t: c + 1.12 + 0.07 * (3 - k), d: 0.36, to: MESSY[k] });
    });
  }
  [0, 1, 2, 3].forEach(k => KF[k].push({ t: T_B + 0.25 + 0.1 * k, d: 0.4, to: HOME[k] }));
  KF[3].push({ t: E1, d: 0.32, to: GONE }, { t: E1 + 1.0, d: 0.38, to: HOME[3] }, { t: E3, d: 0.32, to: GONE });

  function toolPose(k, s) {
    let cur = MESSY[k], arr = -9;
    for (const f of KF[k]) {
      if (s < f.t) break;
      const p = (s - f.t) / f.d;
      if (p < 1) {
        const q = easeInOut(p);
        return { x: lerp(cur.x, f.to.x, q), y: lerp(cur.y, f.to.y, q) - 62 * Math.sin(Math.PI * q), r: lerp(cur.r, f.to.r, q), sw: 0, lifted: true };
      }
      cur = f.to; arr = f.t + f.d;
    }
    const u = s - arr;
    const st = { x: cur.x, y: cur.y, r: cur.r, sw: 0, lifted: false };
    if (cur.home) st.sw = damp(u, 9, 16, 5);                                   // il se balance sur son crochet
    else if (cur !== GONE && u < 0.24) st.y -= 7 * Math.sin(Math.PI * u / 0.24); // petit rebond au sol
    return st;
  }
  // Carton dans l'allée et taches au sol (rangés pour l'audit, revenus la semaine suivante)
  const CARTON_IN = 590, CARTON_OUT = 812, CARTON_Y = 846;
  const CARTON_HOME = { x: 300, y: 812, k: 0.88 };              // sa place marquée au sol, sous l'établi
  const T_CARTON = T_B + 0.5, CARTON_DUR = 0.45;
  function cartonPose(s) {
    let x = CARTON_IN;
    for (let i = 0; i < 3; i++) {
      const c = cyc(i);
      if (s >= c + 0.3) x = lerp(CARTON_IN, CARTON_OUT, easeIn(prog(s, c + 0.3, 0.32)));     // caché pour l'audit
      if (s >= c + 1.15) x = lerp(CARTON_OUT, CARTON_IN, back(prog(s, c + 1.15, 0.42)));    // et il revient
    }
    if (s < T_CARTON) return { x, y: CARTON_Y, k: 1, r: (x - CARTON_IN) * 0.03, lifted: false };
    const p = prog(s, T_CARTON, CARTON_DUR), q = easeInOut(p);
    const st = { x: lerp(CARTON_IN, CARTON_HOME.x, q), y: lerp(CARTON_Y, CARTON_HOME.y, q) - 46 * Math.sin(Math.PI * q), k: lerp(1, CARTON_HOME.k, q), r: -5 * Math.sin(Math.PI * q), lifted: p > 0 && p < 1 };
    const u = s - T_CARTON - CARTON_DUR;
    if (u > 0 && u < 0.22) st.y -= 5 * Math.sin(Math.PI * u / 0.22);
    return st;
  }
  const SPOTS = [[186, 840, 20], [452, 846, 14], [686, 834, 15]];
  function spotK(j, s) {
    let k = 1;
    for (let i = 0; i < 3; i++) {
      const c = cyc(i);
      if (s >= c + 0.42 + 0.06 * j) k = 1 - easeInOut(prog(s, c + 0.42 + 0.06 * j, 0.24));
      if (s >= c + 1.22 + 0.08 * j) k = easeOut(prog(s, c + 1.22 + 0.08 * j, 0.3));
    }
    if (s >= T_B + 0.3) k = 1 - easeInOut(prog(s, T_B + 0.3 + 0.05 * j, 0.24));
    return k;
  }
  const SPARKS = [[392, 574, 0], [306, 728, 0.05], [196, 828, 0.1], [646, 612, 0.08]];
  const level = s => (s < E2 ? 0.66 : 0.66 - 0.46 * easeInOut(prog(s, E2, 0.5)));

  // ---------- La note (ce que donnerait un audit à cet instant) ----------
  function note(s) {
    if (s < T_A) return 60;
    if (s < T_B) {
      const i = Math.min(2, Math.floor((s - T_A) / CYC)), u = s - cyc(i);
      const up = easeInOut(prog(u, 0.32, 0.6)), down = easeInOut(prog(u, 1.12, 0.5));
      const n = 60 + 30 * up - 30 * down;
      return n + 1.6 * Math.sin(s * 9.1) * (1 - (n - 60) / 30);
    }
    let n = lerp(60, 86, easeInOut(prog(s, T_B + 0.3, 0.75)));
    DIPS.forEach(d => { n -= 5 * prog(s, d - 0.08, 0.14) * (1 - easeInOut(prog(s, d + 0.22, 0.45))); });
    return n + 0.8 * Math.sin(s * 6.3) * prog(s, T_B + 1, 0.5);
  }

  // ---------- Semaines du direct ----------
  const WEEKS = [];
  for (let i = 0; i < 3; i++) WEEKS.push([cyc(i) + 1.12, 11 + 2 * i], ...(i < 2 ? [[cyc(i + 1), 12 + 2 * i]] : []));
  WEEKS.push([T_B, 16], [E1, 17], [E2, 18], [E3, 19]);
  function weekAt(s) {
    let w = 10, prev = 10, tc = -9;
    for (const [t, v] of WEEKS) if (s >= t) { prev = w; w = v; tc = t; }
    return { w, prev, p: prog(s, tc, 0.22) };
  }

  // ---------- Bandeau du direct et pastilles d'étape ----------
  const Q = `La zone permet-elle de détecter immédiatement un écart${NB}?`;
  const TICKS = [
    [T_A, 'Signe 1', 'La note monte juste avant l’audit'],
    [T_A + 1.03, 'Signe 2', 'Les questions portent sur la propreté, pas sur l’usage'],
    [T_A + 2.06, 'Signe 3', 'L’auditeur ne travaille jamais dans la zone'],
    [T_A + 3.09, 'Signe 4', 'Les écarts ne déclenchent rien'],
    [T_A + 4.12, 'Signe 5', 'Les deux derniers S sont survolés'],
    [T_B, '?', Q],
    [E1, 'ok', 'Un emplacement vide qui signale un outil manquant.'],
    [E2, 'ok', 'Un repère qui montre un niveau anormal.'],
    [E3, 'ok', 'Un écart qui revient deux fois et déclenche une analyse.'],
    [T_FIN, '?', Q],
  ];
  const PILLS = [
    [T_A, `1${NB}·${NB}Audit cosmétique${NB}: on prépare la photo`, 'b'],
    [T_B, `2${NB}·${NB}Audit utile${NB}: la zone détecte l’écart`, 'b'],
    [T_FIN, 'Chaque écart déclenche une action ou modifie le standard', 'g'],
  ];

  // ---------- Polaroïds et fiches d'action (repère local : la punaise) ----------
  const PW = 170, PH = 186;
  const POL_PIN = [{ x: 868, y: 534, r: -3 }, { x: 880, y: 726, r: 2.5 }, { x: 864, y: 918, r: -2 }];
  const POL_STACK = [{ x: 880, y: 630, r: -2.5 }, { x: 866, y: 579, r: 2 }, { x: 873, y: 528, r: -1.5 }];
  const POL_FROM = { x: 408, y: 517, k: 1.75 };
  const CARDS = [
    { y: 816, h: 80, title: 'Outil manquant', chips: [['Action déclenchée', 'g']], from: [364, 630] },
    { y: 906, h: 80, title: 'Niveau anormal', chips: [['Action déclenchée', 'g']], from: [575, 650] },
    { y: 996, h: 112, title: 'Outil manquant ×2', chips: [['Analyse', 'y'], ['Standard modifié', 'b']], from: [364, 630] },
  ];
  const CW = 226;

  // ---------- Pictos ----------
  // Outils : primitives (repère : centre de l'outil, crochet en haut) ; rôle de couleur par primitive
  const TOOLS = [
    [ // clé plate
      ['path', { d: 'M -6 -40 L -6 40 L 6 40 L 6 -40 Z' }, 'steel'],
      ['path', { d: 'M -7 -36 L -16 -46 A 17 17 0 0 1 -6 -66 L -6 -56 L 6 -56 L 6 -66 A 17 17 0 0 1 16 -46 L 7 -36 Z' }, 'steel'],
      ['path', { d: 'M 14 48 A 14 14 0 1 0 -14 48 A 14 14 0 1 0 14 48 Z M 6 48 A 6 6 0 1 1 -6 48 A 6 6 0 1 1 6 48 Z', 'fill-rule': 'evenodd' }, 'steel'],
    ],
    [ // marteau
      ['path', { d: 'M -6 -40 L 6 -40 L 6 58 Q 6 62 0 62 Q -6 62 -6 58 Z' }, 'yellow'],
      ['path', { d: 'M -7 26 L 7 26 L 7 58 Q 7 63 0 63 Q -7 63 -7 58 Z' }, 'tYellow'],
      ['path', { d: 'M -26 -57 Q -26 -62 -21 -62 L 21 -62 Q 26 -62 26 -57 L 26 -43 Q 26 -38 21 -38 L -21 -38 Q -26 -38 -26 -43 Z' }, 'ink'],
    ],
    [ // tournevis
      ['path', { d: 'M -3.5 -58 L 3.5 -58 L 3.5 0 L -3.5 0 Z' }, 'steel'],
      ['path', { d: 'M -5 -64 L 5 -64 L 4 -56 L -4 -56 Z' }, 'steel'],
      ['path', { d: 'M -7 -4 L 7 -4 L 7 8 L -7 8 Z' }, 'steel'],
      ['path', { d: 'M -11 14 Q -11 6 -3 6 L 3 6 Q 11 6 11 14 L 11 54 Q 11 62 3 62 L -3 62 Q -11 62 -11 54 Z' }, 'red'],
    ],
    [ // pince
      ['path', { d: 'M -4 -8 Q -15 24 -16 60', fill: 'none', 'stroke-width': 10, 'stroke-linecap': 'round' }, 'tealS'],
      ['path', { d: 'M 4 -8 Q 15 24 16 60', fill: 'none', 'stroke-width': 10, 'stroke-linecap': 'round' }, 'tealS'],
      ['path', { d: 'M -9 -12 L -5 -60 Q 0 -66 5 -60 L 9 -12 Z' }, 'steel'],
      ['path', { d: 'M 0 -60 L 0 -14', fill: 'none', 'stroke-width': 2 }, 'inkS'],
      ['path', { d: 'M 8 -12 A 8 8 0 1 1 -8 -12 A 8 8 0 1 1 8 -12 Z' }, 'steel'],
    ],
  ];
  const ROLE = { steel: STEEL, yellow: C.yellow, tYellow: C.tYellow, ink: C.ink, red: C.red, tealS: C.teal, inkS: C.ink };
  function tool(parent, k) {
    const g = el('g', {}, parent);
    TOOLS[k].forEach(([tag, a, role]) => {
      const n = el(tag, a, g);
      if (role.endsWith('S')) n.setAttribute('stroke', ROLE[role]); else n.setAttribute('fill', ROLE[role]);
    });
    return g;
  }
  // Silhouette d'un outil sur le tableau : contour (qui se trace) + aplat
  function silhouette(parent, k) {
    const g = el('g', { transform: `translate(${SLOT_X[k]} ${TOOL_Y})` }, parent);
    const outline = [], fillL = [];
    TOOLS[k].forEach(([tag, a, role]) => {
      if (role === 'inkS') return;
      const stroked = role.endsWith('S');
      const n = el(tag, { ...a, fill: 'none', stroke: SIL_LINE, 'stroke-width': (stroked ? Number(a['stroke-width']) : 0) + 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
      n.len = n.getTotalLength();
      n.filled = !stroked;
      outline.push(n);
    });
    const fg = el('g', {}, g);
    TOOLS[k].forEach(([tag, a, role]) => {
      if (role === 'inkS') return;
      const stroked = role.endsWith('S');
      fillL.push(el(tag, stroked ? { ...a, stroke: C.pLav } : { ...a, fill: C.pLav }, fg));
      fillL[fillL.length - 1].stroked = stroked;
    });
    return { g, outline, fillL, fg };
  }
  function camera(parent, cx, cy, k = 1, color = C.ink) {
    const g = el('g', { transform: `translate(${cx} ${cy}) scale(${k})` }, parent);
    el('path', { d: 'M -11 -4 Q -11 -7 -8 -7 L -4 -7 L -2 -10 L 3 -10 L 5 -7 L 8 -7 Q 11 -7 11 -4 L 11 6 Q 11 8 9 8 L -9 8 Q -11 8 -11 6 Z', fill: color }, g);
    el('circle', { cx: 0, cy: 0.5, r: 4.6, fill: C.white }, g);
    el('circle', { cx: 0, cy: 0.5, r: 2.4, fill: color }, g);
    return g;
  }
  const star = (parent, r = 10) => el('path', { d: `M 0 ${-r} Q 1.6 -1.6 ${r} 0 Q 1.6 1.6 0 ${r} Q -1.6 1.6 ${-r} 0 Q -1.6 -1.6 0 ${-r} Z`, fill: C.yellow }, parent);
  function checkIcon(parent, cx, cy, r = 12, bg = C.green) {
    el('circle', { cx, cy, r, fill: bg }, parent);
    el('path', { d: `M ${cx - r * 0.45} ${cy + r * 0.04} L ${cx - r * 0.12} ${cy + r * 0.37} L ${cx + r * 0.47} ${cy - r * 0.3}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  function pin(parent, x, y, color = C.red) {
    const g = el('g', { transform: `translate(${x} ${y})` }, parent);
    el('ellipse', { cx: 1.5, cy: 3.5, rx: 7, ry: 5, fill: C.ink, opacity: 0.18 }, g);
    el('circle', { cx: 0, cy: 0, r: 7.5, fill: color }, g);
    el('circle', { cx: -2.4, cy: -2.4, r: 2.4, fill: C.white, opacity: 0.6 }, g);
    return g;
  }
  // Petite scène figée d'une photo d'audit : la zone, préparée
  function miniScene(parent, x0, y0, w, h) {
    el('rect', { x: x0, y: y0, width: w, height: h, fill: WALL }, parent);
    el('rect', { x: x0, y: y0 + 80, width: w, height: h - 80, fill: FLOOR }, parent);
    el('rect', { x: x0, y: y0 + h - 9, width: w, height: 3, fill: C.yellow }, parent);
    el('rect', { x: x0 + 10, y: y0 + 16, width: 68, height: 44, rx: 3, fill: C.white, stroke: BOARD_LINE, 'stroke-width': 1.2 }, parent);
    [STEEL, C.yellow, C.red, C.teal].forEach((c, k) => el('rect', { x: x0 + 19 + 15 * k, y: y0 + 22, width: 5, height: 32, rx: 2, fill: c }, parent));
    el('rect', { x: x0 + 32, y: y0 + 21, width: 13, height: 6, rx: 1.5, fill: C.ink }, parent);
    el('rect', { x: x0 + 6, y: y0 + 64, width: 78, height: 4, fill: FURN }, parent);
    [x0 + 10, x0 + 78].forEach(x => el('rect', { x, y: y0 + 68, width: 3, height: 20, fill: FURN }, parent));
    el('rect', { x: x0 + 98, y: y0 + 38, width: 40, height: 28, rx: 3, fill: C.white, stroke: FURN, 'stroke-width': 1.2 }, parent);
    el('rect', { x: x0 + 100, y: y0 + 48, width: 36, height: 16, fill: '#c9daee' }, parent);
    el('rect', { x: x0 + 94, y: y0 + 66, width: 48, height: 3, fill: FURN }, parent);
    [x0 + 95, x0 + 138].forEach(x => el('rect', { x, y: y0 + 34, width: 3, height: 54, fill: FURN }, parent));
    const s = el('g', { transform: `translate(${x0 + 80} ${y0 + 18})` }, parent);
    star(s, 7);
  }
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) checkIcon(g, x + 31, cy, 12);
    return g;
  }
  const halo = (n, c = C.white, w = 6) => { [['stroke', c], ['stroke-width', w], ['stroke-linejoin', 'round'], ['paint-order', 'stroke']].forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  // Étiquette rouge au-dessus d'un objet (pointe vers le bas, repère : la pointe)
  function tag(parent, cx, tipY, label) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: tipY - 38, height: 30, rx: 15, fill: C.red }, g);
    const t = text(g, cx, tipY - 17, label, { size: 17, weight: 800, fill: C.white, anchor: 'middle' });
    const w = t.getBBox().width + 30;
    r.setAttribute('x', f2(cx - w / 2));
    r.setAttribute('width', f2(w));
    el('path', { d: `M ${cx - 7} ${tipY - 9} L ${cx} ${tipY - 1} L ${cx + 7} ${tipY - 9} Z`, fill: C.red }, g);
    return { g, w, cx, tipY };
  }

  const S = { tools: [], sils: [], spots: [], sparks: [], pol: [], cards: [], ticks: [], pills: [], cams: [], dots: [] };

  function build() {
    D.template({ author: 'clement' });
    D.title(`90${NB}% à l’audit 5S,`, 'rien n’a changé.');
    D.chapeau('Il mesure l’apparence de la zone, pas sa capacité à rester en ordre.');

    // Explication courte au-dessus du visuel : comment le lire
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Le direct', C.blue], [' filme la zone en continu ; ', 0], ['la photo', C.blue], [' ne la voit que le jour de l’audit.', 0]]);
    line(384, [[`La photo dit toujours 90${NB}%. Un audit utile, lui, `, 0], ['détecte l’écart', C.tGreen], [' et fait changer la zone.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-30%', y: '-30%', width: '160%', height: '170%' }, defs);
    el('feDropShadow', { dx: 0, dy: 9, stdDeviation: 8, 'flood-color': C.ink, 'flood-opacity': 0.24 }, lift);
    const cpScr = el('clipPath', { id: 'scr' }, defs);
    el('rect', { x: SCR.x, y: SCR.y, width: SCR.w, height: SCR.h, rx: 12 }, cpScr);
    const cpTick = el('clipPath', { id: 'tick' }, defs);
    el('rect', { x: SCR.x, y: TICK_Y - 20, width: SCR.w, height: 40 }, cpTick);
    const cpLine = el('clipPath', { id: 'chartLine' }, defs);
    S.lineClip = el('rect', { x: PX0 - 6, y: CH.y, width: 0, height: CH.h }, cpLine);
    const cpMin = el('clipPath', { id: 'minLine' }, defs);
    S.minClip = el('rect', { x: BIN.x, y: BIN.y, width: 0, height: BIN.h }, cpMin);
    const cpLevel = el('clipPath', { id: 'level' }, defs);
    S.levelClip = el('rect', { x: BIN.x + 4, y: BIN.y, width: BIN.w - 8, height: BIN.h - 4 }, cpLevel);
    const cpWeek = el('clipPath', { id: 'week' }, defs);
    el('rect', { x: 580, y: 512, width: 128, height: 30, rx: 15 }, cpWeek);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- La note, en direct (sous l'écran) -----
    el('rect', { x: CH.x, y: CH.y, width: CH.w, height: CH.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    const chTitle = text(D.svg, 104, 960, 'Note de la zone, en direct', { size: 17, weight: 700, fill: MUTED });
    fit(chTitle, CH.x + CH.w - 16, 'titre de la note');
    [[90, true], [60, false]].forEach(([n, strong]) => {
      el('line', { x1: PX0, y1: yOf(n), x2: PX1, y2: yOf(n), stroke: strong ? '#cfe6c6' : GRID, 'stroke-width': 2, 'stroke-dasharray': strong ? '8 6' : 'none' });
      text(D.svg, PX0 - 12, yOf(n) + 6, `${n}${NB}%`, { size: 16, weight: 700, fill: strong ? C.tGreen : MUTED, anchor: 'end' });
    });
    S.divider = el('line', { x1: xOf(T_B), y1: 994, x2: xOf(T_B), y2: 1092, stroke: CARD_LINE, 'stroke-width': 2, 'stroke-dasharray': '5 5' });
    S.labA = text(D.svg, (PX0 + xOf(T_B)) / 2, 1114, 'Audit cosmétique', { size: 16, weight: 700, fill: MUTED, anchor: 'middle' });
    S.labB = text(D.svg, (xOf(T_B) + PX1) / 2, 1114, 'Audit utile', { size: 16, weight: 700, fill: C.tGreen, anchor: 'middle' });
    const pts = [];
    for (let s = T_A; s <= T_FIN + 1e-6; s += 0.025) pts.push(`${f2(xOf(s))} ${f2(yOf(note(s)))}`);
    S.line = el('path', { d: `M ${pts.join(' L ')}`, fill: 'none', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'clip-path': 'url(#chartLine)' });
    S.cams = FLASH.map(f => ({ g: camera(D.svg, xOf(f), yOf(90) - 16, 0.95), f, x: xOf(f), y: yOf(90) - 16 }));
    S.dots = DIPS.map(d => {
      const g = el('g');
      const x = xOf(d + 0.06), y = yOf(note(d + 0.06));
      el('circle', { cx: x, cy: y, r: 7, fill: C.red, stroke: C.white, 'stroke-width': 2.5 }, g);
      return { g, d, x, y };
    });
    S.head = el('g');
    el('circle', { cx: 0, cy: 0, r: 7, fill: C.blue, stroke: C.white, 'stroke-width': 3 }, S.head);
    S.headVal = halo(text(S.head, 13, 6, '', { size: 18, weight: 800, fill: C.ink }));

    // ----- Le tableau où l'on punaise -----
    el('rect', { x: CORK.x, y: CORK.y, width: CORK.w, height: CORK.h, rx: 18, fill: C.pYellow, stroke: CORK_LINE, 'stroke-width': 2 });
    const corkT = text(D.svg, CORK.x + 18, 514, 'Photos d’audit', { size: 17, weight: 800, fill: C.tYellow });
    camera(D.svg, CORK.x + CORK.w - 32, 508, 1, C.tYellow);
    fit(corkT, CORK.x + CORK.w - 50, 'titre photos');
    S.cork2 = text(D.svg, CORK.x + 18, 806, 'Ce qu’il fait changer', { size: 17, weight: 800, fill: C.tYellow });
    fit(S.cork2, CORK.x + CORK.w - 12, 'titre actions');

    // ----- L'écran du direct -----
    el('rect', { x: BEZ.x, y: BEZ.y, width: BEZ.w, height: BEZ.h, rx: 22, fill: C.ink });
    const scr = el('g', { 'clip-path': 'url(#scr)' });
    el('rect', { x: SCR.x, y: SCR.y, width: SCR.w, height: FLOOR_Y - SCR.y, fill: WALL }, scr);
    el('rect', { x: SCR.x, y: FLOOR_Y, width: SCR.w, height: SCR.y + SCR.h - FLOOR_Y, fill: FLOOR }, scr);
    el('line', { x1: SCR.x, y1: FLOOR_Y, x2: SCR.x + SCR.w, y2: FLOOR_Y, stroke: '#cfd1e4', 'stroke-width': 2 }, scr);
    el('rect', { x: SCR.x, y: 848, width: SCR.w, height: 5, fill: C.yellow }, scr);   // marquage au sol
    // Tableau d'outils, crochets, et les silhouettes (audit utile)
    el('rect', { x: BOARD.x, y: BOARD.y, width: BOARD.w, height: BOARD.h, rx: 10, fill: C.white, stroke: BOARD_LINE, 'stroke-width': 2 }, scr);
    S.sils = [0, 1, 2, 3].map(k => silhouette(scr, k));
    SLOT_X.forEach(x => el('circle', { cx: x, cy: BOARD.y + 12, r: 3.2, fill: FURN }, scr));
    // Établi
    el('rect', { x: 108, y: 734, width: 312, height: 12, rx: 3, fill: FURN }, scr);
    [122, 398].forEach(x => el('rect', { x, y: 746, width: 10, height: 66, fill: FURN }, scr));
    // Étagère et bac de pièces
    [484, 664].forEach(x => el('rect', { x, y: 604, width: 8, height: 210, fill: FURN }, scr));
    el('rect', { x: 478, y: 718, width: 200, height: 10, rx: 2, fill: FURN }, scr);
    el('rect', { x: BIN.x, y: BIN.y, width: BIN.w, height: BIN.h, rx: 8, fill: C.white }, scr);
    S.levelG = el('g', { 'clip-path': 'url(#level)' }, scr);
    S.levelFill = el('rect', { x: BIN.x, y: BIN.y, width: BIN.w, height: BIN.h, fill: '#cfe0f2' }, S.levelG);
    S.levelParts = el('g', {}, S.levelG);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 9; c++) el('circle', { cx: BIN.x + 14 + c * 15.5 + (r ? 7.5 : 0), cy: 6 + r * 11, r: 5, fill: C.lightBlue }, S.levelParts);
    S.binBox = el('rect', { x: BIN.x, y: BIN.y, width: BIN.w, height: BIN.h, rx: 8, fill: 'none', stroke: FURN, 'stroke-width': 3 }, scr);
    // Repère de niveau (audit utile) : jauge verte / rouge et ligne mini
    S.gauge = el('g', {}, scr);
    const yMin = BIN.y + BIN.h - 4 - LEVEL_MIN * (BIN.h - 8);
    S.gGreen = el('rect', { x: BIN.x + BIN.w - 16, y: BIN.y + 8, width: 9, height: yMin - BIN.y - 8, rx: 2, fill: C.green }, S.gauge);
    S.gRed = el('rect', { x: BIN.x + BIN.w - 16, y: yMin, width: 9, height: BIN.y + BIN.h - 6 - yMin, rx: 2, fill: C.red }, S.gauge);
    S.minLine = el('line', { x1: BIN.x + 6, y1: yMin, x2: BIN.x + BIN.w - 6, y2: yMin, stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '7 5', 'clip-path': 'url(#minLine)' }, scr);
    S.yMin = yMin;
    // Taches au sol, carton dans l'allée
    S.spots = SPOTS.map(([x, y, r]) => el('ellipse', { cx: 0, cy: 0, rx: r, ry: r * 0.3, fill: SPOT, transform: `translate(${x} ${y})` }, scr));
    // Emplacement marqué au sol (audit utile) : coins jaunes
    S.mark = el('g', {}, scr);
    const mx0 = CARTON_HOME.x - 46, mx1 = CARTON_HOME.x + 46, my = CARTON_HOME.y + 3;
    [[mx0, 1], [mx1, -1]].forEach(([x, d]) => el('path', { d: `M ${x} ${my - 16} V ${my} H ${x + 16 * d}`, fill: 'none', stroke: C.yellow, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.mark));
    S.carton = el('g', {}, scr);
    el('rect', { x: -42, y: -56, width: 84, height: 56, rx: 4, fill: CARTON, stroke: CARTON_LINE, 'stroke-width': 2.5 }, S.carton);
    el('rect', { x: -7, y: -56, width: 14, height: 56, fill: C.yellow, opacity: 0.55 }, S.carton);
    // Les outils
    S.tools = [0, 1, 2, 3].map(k => tool(scr, k));
    // Paillettes de la veille d'audit
    S.sparks = SPARKS.map(([x, y, dt]) => { const g = el('g', {}, scr); star(g, 11); return { g, x, y, dt }; });
    // Étiquettes des signaux
    S.tagTool = tag(scr, SLOT_X[3], BOARD.y - 2, 'Outil manquant');
    S.x2 = el('g', {}, scr);
    el('circle', { cx: 0, cy: 0, r: 16, fill: C.white, stroke: C.red, 'stroke-width': 3 }, S.x2);
    text(S.x2, 0, 6, '×2', { size: 17, weight: 800, fill: C.tRed, anchor: 'middle' });
    S.x2c = [SLOT_X[3] + S.tagTool.w / 2 + 22, BOARD.y - 25];
    S.tagBin = tag(scr, BIN.x + BIN.w / 2, BIN.y - 10, 'Niveau anormal');
    // Alertes qui pulsent (détection immédiate)
    S.pulses = PULSES.map(([, kind]) => {
      const g = el('g', {}, scr);
      const rings = [0, 1].map(() => kind === 'slot'
        ? el('ellipse', { cx: SLOT_X[3], cy: 646, rx: 34, ry: 64, fill: 'none', stroke: C.red, 'stroke-width': 4 }, g)
        : el('rect', { rx: 14, fill: 'none', stroke: C.red, 'stroke-width': 4 }, g));
      return { g, rings, kind };
    });
    // Flash, retour en arrière
    S.flash = el('rect', { x: SCR.x, y: SCR.y, width: SCR.w, height: SCR.h, fill: C.white }, scr);
    S.rewind = el('g', {}, scr);
    el('rect', { x: SCR.x, y: SCR.y, width: SCR.w, height: SCR.h, fill: C.ink, opacity: 0.9 }, S.rewind);
    const rwT = text(S.rewind, 0, 690, 'Retour en semaine 10', { size: 22, weight: 800, fill: C.white, anchor: 'start' });
    const rww = rwT.getBBox().width + 50, rx0 = SCR.x + SCR.w / 2 - rww / 2;
    rwT.setAttribute('x', f2(rx0 + 50));
    [0, 18].forEach(dx => el('path', { d: `M ${rx0 + dx + 18} 668 L ${rx0 + dx} 682 L ${rx0 + dx + 18} 696 Z`, fill: C.white }, S.rewind));
    // Incrustations : « en direct » et semaine
    const live = el('g', {}, scr);
    const lr = el('rect', { x: 110, y: 512, height: 30, rx: 15, fill: C.red }, live);
    S.liveDot = el('circle', { cx: 127, cy: 527, r: 5.5, fill: C.white }, live);
    const lt = text(live, 140, 533, 'EN DIRECT', { size: 15, weight: 800, fill: C.white });
    lt.setAttribute('letter-spacing', 1);
    lr.setAttribute('width', f2(lt.getBBox().width + 44));
    el('rect', { x: 580, y: 512, width: 128, height: 30, rx: 15, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 }, scr);
    const wk = el('g', { 'clip-path': 'url(#week)' }, scr);
    S.wkA = text(wk, 644, 533, '', { size: 16, weight: 800, fill: C.ink, anchor: 'middle' });
    S.wkB = text(wk, 644, 533, '', { size: 16, weight: 800, fill: C.ink, anchor: 'middle' });

    // ----- Bandeau du direct -----
    const tk = el('g', { 'clip-path': 'url(#tick)' });
    S.ticks = TICKS.map(([, chip, label], i) => {
      const g = el('g', {}, tk);
      let x = 106;
      if (chip === '?') {
        el('circle', { cx: x + 13, cy: TICK_Y, r: 13, fill: C.lightBlue }, g);
        text(g, x + 13, TICK_Y + 6, '?', { size: 17, weight: 800, fill: C.white, anchor: 'middle' });
        x += 36;
      } else if (chip === 'ok') {
        checkIcon(g, x + 13, TICK_Y, 13);
        x += 36;
      } else {
        const r = el('rect', { x, y: TICK_Y - 13, height: 26, rx: 13, fill: C.yellow }, g);
        const ct = text(g, x + 11, TICK_Y + 5.5, chip, { size: 15, weight: 800, fill: C.ink });
        const w = ct.getBBox().width + 22;
        r.setAttribute('width', f2(w));
        x += w + 12;
      }
      const t = text(g, x, TICK_Y + 6.5, label, { size: 18, weight: 700, fill: C.white });
      fit(t, SCR.x + SCR.w - 4, `bandeau ${i + 1}`);
      return g;
    });

    // ----- Polaroïds -----
    S.pol = [0, 1, 2].map(i => {
      const g = el('g');
      const body = el('g', {}, g);
      el('rect', { x: -PW / 2, y: 0, width: PW, height: PH, rx: 4, fill: C.white, stroke: '#e2e2ec', 'stroke-width': 1.5 }, body);
      miniScene(body, -PW / 2 + 10, 10, PW - 20, 112);
      text(body, -PW / 2 + 13, 164, `S${10 + 2 * i}`, { size: 19, weight: 700, fill: MUTED });
      const v = text(body, PW / 2 - 12, 167, `90${NB}%`, { size: 30, weight: 800, fill: C.tGreen, anchor: 'end' });
      fit(v, PW / 2 - 8, `polaroïd ${i + 1}`, -PW / 2 + 60);
      const p = pin(g, 0, 6);
      return { g, p, i };
    });

    // ----- Fiches d'action -----
    S.cards = CARDS.map((c, i) => {
      const g = el('g');
      el('rect', { x: -CW / 2, y: 0, width: CW, height: c.h, rx: 12, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 }, g);
      el('rect', { x: -CW / 2, y: 12, width: 5, height: c.h - 24, rx: 2.5, fill: C.red }, g);
      el('circle', { cx: -CW / 2 + 22, cy: 30, r: 6, fill: C.red }, g);
      const tt = text(g, -CW / 2 + 36, 36, c.title, { size: 17, weight: 800, fill: C.ink });
      fit(tt, CW / 2 - 8, `fiche ${i + 1} titre`, -CW / 2);
      c.chips.forEach(([label, kind], j) => {
        const cy = 60 + j * 32;
        const bg = kind === 'g' ? C.pGreen : kind === 'y' ? C.pYellow : C.blue;
        const fg = kind === 'g' ? C.tGreen : kind === 'y' ? C.tYellow : C.white;
        const ax = -CW / 2 + 14;
        el('path', { d: `M ${ax} ${cy} H ${ax + 11} M ${ax + 6} ${cy - 5} L ${ax + 11} ${cy} L ${ax + 6} ${cy + 5}`, fill: 'none', stroke: MUTED, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        const r = el('rect', { x: ax + 18, y: cy - 14, height: 28, rx: 14, fill: bg, stroke: kind === 'y' ? CORK_LINE : 'none', 'stroke-width': 1.5 }, g);
        const t = text(g, ax + 30, cy + 5.5, label, { size: 16, weight: 700, fill: fg });
        r.setAttribute('width', f2(t.getBBox().width + 24));
        fit(r, CW / 2 - 6, `fiche ${i + 1} puce ${j + 1}`, -CW / 2);
      });
      const p = pin(g, 0, 4, C.blue);
      return { g, p, c, i };
    });

    // ----- Pastilles d'étape -----
    S.pills = PILLS.map(([, label, k]) => {
      const g = pillShape(D.svg, 92, PILL_Y, label, k === 'g' ? { bg: C.pGreen, fg: C.tGreen, icon: true } : { bg: C.blue, fg: C.white });
      fit(g, FRAME.x + FRAME.w - 20, `pastille ${label}`);
      return g;
    });

    D.encart(['Auditer sans maquiller', 'Notre checklist 5S', '(liens en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  const winOp = (t, a, b, fin = 0.2, fout = 0.14) => prog(t, a, fin) * (1 - prog(t, b, fout));
  const scaleAt = (k, cx, cy) => (k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`);

  function draw(t) {
    const final = t < T_CUT;                      // image finale (qui s'efface à partir de T_OUT)
    const s = final ? END : t;                    // temps de séquence
    const fade = final ? 1 - prog(t, T_OUT, T_CUT - T_OUT) : 1;
    const inB = s >= T_B;

    // ----- Outils, carton, taches, paillettes -----
    S.tools.forEach((g, k) => {
      const p = toolPose(k, s);
      g.setAttribute('transform', `translate(${f2(p.x)} ${f2(p.y)}) rotate(${f2(p.r)})` + (p.sw ? ` rotate(${f2(p.sw)} 0 -60)` : ''));
      if (p.lifted) g.setAttribute('filter', 'url(#lift)'); else g.removeAttribute('filter');
    });
    const cp = cartonPose(s);
    S.carton.setAttribute('transform', `translate(${f2(cp.x)} ${f2(cp.y)}) rotate(${f2(cp.r)}) scale(${f2(cp.k)})`);
    show(S.carton, cp.x < CARTON_OUT - 1);
    if (cp.lifted) S.carton.setAttribute('filter', 'url(#lift)'); else S.carton.removeAttribute('filter');
    const mk = inB ? easeInOut(prog(s, T_B + 0.3, 0.3)) : 0;
    show(S.mark, mk > 0);
    S.mark.setAttribute('opacity', f2(mk));
    S.mark.setAttribute('transform', scaleAt(0.7 + 0.3 * mk, CARTON_HOME.x, CARTON_HOME.y));
    S.spots.forEach((n, j) => {
      const k = spotK(j, s), [x, y] = SPOTS[j];
      show(n, k > 0.01);
      n.setAttribute('transform', `translate(${x} ${y}) scale(${f2(Math.max(k, 0.01))})`);
    });
    S.sparks.forEach(sp => {
      let on = false, k = 0, rot = 0;
      if (s < T_B) for (let i = 0; i < 3; i++) {
        const p = prog(s, cyc(i) + 0.8 + sp.dt, 0.42);
        if (p > 0 && p < 1) { on = true; k = Math.sin(Math.PI * p); rot = 90 * p; }
      }
      show(sp.g, on);
      if (on) sp.g.setAttribute('transform', `translate(${sp.x} ${sp.y}) rotate(${f2(rot)}) scale(${f2(Math.max(k, 0.01))})`);
    });

    // ----- Signaux : silhouettes, repère de niveau -----
    const drawP = inB ? easeInOut(prog(s, T_B + 0.1, 0.45)) : 0;
    const fillP = inB ? prog(s, T_B + 0.5, 0.2) : 0;
    const away3 = inB && ((s >= E1 + 0.16 && s < E1 + 1.3) || s >= E3 + 0.16);
    const red3 = away3 ? (s >= E3 ? prog(s, E3 + 0.16, 0.12) : prog(s, E1 + 0.16, 0.12) * (1 - prog(s, E1 + 1.18, 0.12))) : 0;
    S.sils.forEach((sl, k) => {
      show(sl.g, drawP > 0);
      if (drawP <= 0) return;
      const flagged = k === 3 && red3 > 0.5;
      sl.outline.forEach(n => {
        if (drawP < 1) { n.setAttribute('stroke-dasharray', f2(n.len + 1)); n.setAttribute('stroke-dashoffset', f2((n.len + 1) * (1 - drawP))); }
        else { n.removeAttribute('stroke-dasharray'); n.removeAttribute('stroke-dashoffset'); }
        n.setAttribute('stroke', flagged ? C.red : SIL_LINE);
        n.setAttribute('fill', n.filled && fillP >= 1 ? (flagged ? C.red : SIL_LINE) : 'none');
      });
      show(sl.fg, fillP > 0);
      sl.fg.setAttribute('opacity', f2(fillP));
      sl.fillL.forEach(n => n.setAttribute(n.stroked ? 'stroke' : 'fill', flagged ? C.pRed : C.pLav));
    });
    const lv = level(s);
    const ly = BIN.y + BIN.h - 4 - lv * (BIN.h - 8);
    S.levelFill.setAttribute('y', f2(ly));
    S.levelParts.setAttribute('transform', `translate(0 ${f2(ly)})`);
    const binRed = inB && lv < LEVEL_MIN;
    S.binBox.setAttribute('stroke', binRed ? C.red : FURN);
    const gp = inB ? prog(s, T_B + 0.6, 0.35) : 0;
    show(S.gauge, gp > 0);
    if (gp > 0) {
      const gb = BIN.y + BIN.h - 6;
      S.gauge.setAttribute('transform', gp >= 1 ? '' : `translate(0 ${f2(gb)}) scale(1 ${f2(Math.max(easeOut(gp), 0.01))}) translate(0 ${f2(-gb)})`);
    }
    const mp = inB ? easeInOut(prog(s, T_B + 0.55, 0.35)) : 0;
    show(S.minLine, mp > 0);
    S.minClip.setAttribute('width', f2(BIN.w * mp));

    // Étiquettes des écarts
    const tIn = inB ? (s >= E3 ? prog(s, E3 + 0.27, 0.3) : prog(s, E1 + 0.3, 0.3)) : 0;
    const tOut = inB && s < E3 ? prog(s, E1 + 1.05, 0.15) : 0;
    show(S.tagTool.g, tIn > 0 && tOut < 1);
    S.tagTool.g.setAttribute('opacity', f2(clamp(tIn / 0.4) * (1 - tOut)));
    S.tagTool.g.setAttribute('transform', scaleAt(popScale(tIn) * (1 - 0.15 * tOut), S.tagTool.cx, S.tagTool.tipY));
    const x2 = inB ? prog(s, E3 + 0.45, 0.32) : 0;
    show(S.x2, x2 > 0);
    S.x2.setAttribute('transform', `translate(${f2(S.x2c[0])} ${f2(S.x2c[1])}) scale(${f2(popScale(x2))})`);
    const tagB = inB ? prog(s, E2 + 0.36, 0.3) : 0;
    show(S.tagBin.g, tagB > 0);
    S.tagBin.g.setAttribute('opacity', f2(clamp(tagB / 0.4)));
    S.tagBin.g.setAttribute('transform', scaleAt(popScale(tagB), S.tagBin.cx, S.tagBin.tipY));

    S.pulses.forEach((pl, i) => {
      const t0 = PULSES[i][0];
      let any = false;
      pl.rings.forEach((r, j) => {
        const p = inB ? prog(s, t0 + 0.2 * j, 0.5) : 0;
        const on = p > 0 && p < 1;
        any = any || on;
        show(r, on);
        if (!on) return;
        const e = easeOut(p);
        r.setAttribute('opacity', f2(0.85 * (1 - p)));
        if (pl.kind === 'slot') r.setAttribute('transform', `translate(${SLOT_X[3]} 646) scale(${f2(1 + 0.4 * e)} ${f2(1 + 0.08 * e)}) translate(${-SLOT_X[3]} -646)`);
        else {   // l'anneau s'écarte du bac sans monter jusqu'à l'étiquette
          const pad = 6 + 12 * e, top = 6 + 2 * e;
          r.setAttribute('x', f2(BIN.x - pad)); r.setAttribute('width', f2(BIN.w + 2 * pad));
          r.setAttribute('y', f2(BIN.y - top)); r.setAttribute('height', f2(BIN.h + top + pad));
        }
      });
      show(pl.g, any);
    });

    // ----- Flash, retour en arrière, incrustations -----
    let fl = 0;
    if (!final) FLASH.forEach(f => { if (s >= f - 0.04 && s < f + 0.32) fl = s < f ? prog(s, f - 0.04, 0.04) : 1 - easeOut(prog(s, f, 0.32)); });
    show(S.flash, fl > 0.005);
    S.flash.setAttribute('opacity', f2(0.94 * fl));
    const rw = t >= T_OUT && t < T_A ? prog(t, T_OUT, 0.15) * (1 - prog(t, 1.52, 0.16)) : 0;
    show(S.rewind, rw > 0.005);
    S.rewind.setAttribute('opacity', f2(rw));
    S.liveDot.setAttribute('opacity', (t % 1) < 0.5 ? 1 : 0.25);
    const wk = weekAt(s);
    if (t >= T_OUT && t < 1.52) { const w = Math.round(lerp(19, 10, prog(t, T_OUT + 0.04, 0.26))); wk.w = w; wk.prev = w; wk.p = 1; }   // rembobinage
    S.wkA.textContent = `Semaine ${wk.prev}`;
    S.wkB.textContent = `Semaine ${wk.w}`;
    const rp = easeInOut(wk.p);
    show(S.wkA, rp < 1);
    S.wkA.setAttribute('transform', `translate(0 ${f2(-24 * rp)})`);
    S.wkB.setAttribute('transform', rp >= 1 ? '' : `translate(0 ${f2(24 * (1 - rp))})`);

    // ----- La note, en direct -----
    const hx = xOf(s);
    const lineOn = s >= T_A;
    S.lineClip.setAttribute('width', f2(lineOn ? Math.max(0.01, hx - PX0 + 8) : 0.01));
    S.line.setAttribute('opacity', f2(fade));
    show(S.line, lineOn);
    const headOn = !final && s >= T_A && s < T_FIN + 0.2;
    show(S.head, headOn);
    if (headOn) {
      S.head.setAttribute('transform', `translate(${f2(hx)} ${f2(yOf(note(s)))})`);
      S.head.setAttribute('opacity', f2(1 - prog(s, T_FIN, 0.2)));
      S.headVal.textContent = `${Math.round(note(s))}${NB}%`;
      S.headVal.setAttribute('opacity', f2(1 - prog(s, T_B - 0.1, 0.2)));
    }
    S.cams.forEach(c => {
      const p = prog(s, c.f, 0.3);
      show(c.g, p > 0);
      c.g.setAttribute('opacity', f2(fade));
      c.g.setAttribute('transform', `translate(${f2(c.x)} ${f2(c.y)}) scale(${f2(0.95 * popScale(p))})`);
    });
    S.dots.forEach(d => {
      const p = prog(s, d.d, 0.3);
      show(d.g, p > 0);
      d.g.setAttribute('opacity', f2(fade));
      d.g.setAttribute('transform', scaleAt(popScale(p), d.x, d.y));
    });
    const dv = inB ? prog(s, T_B, 0.3) : 0;
    show(S.divider, dv > 0); S.divider.setAttribute('opacity', f2(dv * fade));
    show(S.labB, dv > 0); S.labB.setAttribute('opacity', f2(dv * fade));
    const la = s >= T_A ? prog(s, T_A, 0.3) : 0;
    show(S.labA, la > 0); S.labA.setAttribute('opacity', f2(la * fade));

    // ----- Polaroïds : flash → vol → punaise → (audit utile) rangés en pile -----
    S.pol.forEach(({ g, p, i }) => {
      const f0 = FLASH[i] + 0.04, f1 = f0 + 0.5;
      if (s < f0) { show(g, false); return; }
      show(g, true);
      let x, y, r, k = 1, lifted = false;
      const A = POL_PIN[i], B = POL_STACK[i];
      if (s < f1) {
        const q = easeInOut(prog(s, f0, 0.5));
        x = lerp(POL_FROM.x, A.x, q); y = lerp(POL_FROM.y, A.y, q) - 24 * Math.sin(Math.PI * q);
        r = lerp(0, A.r, q) + 7 * Math.sin(Math.PI * q); k = lerp(POL_FROM.k, 1, easeOut(prog(s, f0, 0.5)));
        lifted = true;
      } else {
        const g0 = T_B + 0.05 + 0.08 * (2 - i), q = easeInOut(prog(s, g0, 0.5));
        x = lerp(A.x, B.x, q); y = lerp(A.y, B.y, q) - 26 * Math.sin(Math.PI * q);
        r = lerp(A.r, B.r, q) + damp(s - f1, 6, 13, 4.5); k = lerp(1, 0.8, q);
        lifted = q > 0 && q < 1;
      }
      g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(r)}) scale(${f2(k)})`);
      g.setAttribute('opacity', f2(fade));
      if (lifted) g.setAttribute('filter', 'url(#lift)'); else g.removeAttribute('filter');
      const pp = prog(s, f1 - 0.02, 0.28);
      show(p, pp > 0);
      p.setAttribute('transform', `translate(0 6) scale(${f2(popScale(pp))})`);
    });

    // ----- Fiches d'action : partent de l'étiquette, se punaisent -----
    const c2 = inB ? prog(s, K_FLY[0] + FLY + 0.02, 0.25) : 0;
    show(S.cork2, c2 > 0);
    S.cork2.setAttribute('opacity', f2(c2 * fade));
    S.cards.forEach(({ g, p, c, i }) => {
      const k0 = K_FLY[i], k1 = k0 + FLY;
      if (!inB || s < k0) { show(g, false); return; }
      show(g, true);
      const X = CORK.x + CORK.w / 2, Y = c.y;
      let x = X, y = Y, r = 0, k = 1, lifted = false;
      if (s < k1) {
        const q = easeInOut(prog(s, k0, FLY)), m = 1 - q;
        const [x0, y0] = c.from, x1 = lerp(x0, X, 0.45), y1 = Y;
        x = m * m * x0 + 2 * m * q * x1 + q * q * X; y = m * m * y0 + 2 * m * q * y1 + q * q * Y;
        r = -6 * Math.sin(Math.PI * q); k = lerp(0.4, 1, easeOut(prog(s, k0, FLY)));
        lifted = true;
      } else r = damp(s - k1, 5, 13, 4.5);
      g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(r)}) scale(${f2(k)})`);
      g.setAttribute('opacity', f2(fade * clamp((s - k0) / 0.08)));
      if (lifted) g.setAttribute('filter', 'url(#lift)'); else g.removeAttribute('filter');
      const pp = prog(s, k1 - 0.02, 0.28);
      show(p, pp > 0);
      p.setAttribute('transform', `translate(0 4) scale(${f2(popScale(pp))})`);
    });

    // ----- Bandeau du direct : l'ancien sort, puis le nouveau entre -----
    S.ticks.forEach((g, i) => {
      const a = TICKS[i][0] + (i ? 0.12 : 0), b = i + 1 < TICKS.length ? TICKS[i + 1][0] : Infinity;
      let o, dy;
      if (final) { o = i === TICKS.length - 1 ? fade : 0; dy = 0; }
      else { o = prog(s, a, 0.2) * (1 - prog(s, b, 0.12)); dy = 14 * (1 - easeOut(prog(s, a, 0.2))) - 12 * prog(s, b, 0.12); }
      show(g, o > 0.005);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });

    // ----- Pastilles d'étape -----
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.12 : 0), b = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      let o = final ? (i === PILLS.length - 1 ? fade : 0) : prog(s, a, 0.25) * (1 - prog(s, b, 0.14));
      const dy = final ? 0 : 8 * (1 - prog(s, a, 0.25));
      show(g, o > 0.005);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
