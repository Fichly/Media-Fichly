// Fiche LinkedIn · Hugo Duc · lundi 12 octobre 2026
// Post : « Un Gemba Walk peut durer une heure, croiser toute l'équipe… …et ne rien apprendre à personne. »
// Premier commentaire du post (Buffer) : « Retrouvez nos fiches Lean sur ce lien » → encart.
// Le visuel est la pièce maîtresse : un écran partagé, deux visites du même atelier en simultané, avec le
// même chrono qui tourne des deux côtés. À gauche, on traverse : les traces de pas couvrent tout l'atelier,
// on salue toute l'équipe, on remarque un bac mal rangé, on note deux actions de rangement… appris : 0.
// À droite, on s'arrête devant un poste : les pas s'arrêtent, les trois questions arrivent une à une et
// font surgir ce qu'aucun tableau ne remonte (un arrangement, une attente, une information qui manque).
// Style propre : l'écran partagé synchronisé (deux mini-plans, traces de pas qui se dessinent).
// Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  // Marche : on accélère, on avance à vitesse constante, on ralentit (profil de vitesse trapézoïdal)
  const trap = (u, a) => {
    u = clamp(u);
    const v = 1 / (1 - a);
    if (u < a) return 0.5 * v * u * u / a;
    if (u > 1 - a) return 1 - 0.5 * v * (1 - u) * (1 - u) / a;
    return v * (u - a / 2);
  };
  const turn = (a, b, p) => a + (b - a) * easeInOut(clamp(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', DASH = '#b6b6d4', GREY = '#d4d4e4';
  const FLOOR = '#f6f6fa', AISLE = '#ebebf4', WALL = '#cfcfe3', BENCH_LINE = '#c6c6dc', PIECE = '#b3b3d2';
  const BIN_LINE = '#4f80b8', STEP_L = '#8d8db8', NOTE_BG = '#f7f7fb';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const PANEL = { y: 428, w: 450, h: 704 };
  const SIDE_X = [80, 550];                 // panneau gauche (la promenade) et droit (le vrai Gemba)
  const IN_W = 418;                         // largeur utile d'un panneau (marges de 16 px)
  const PLAN = { y: 494, h: 220 };
  const HEAD_CY = 462;
  const BLOCK = { y: 1030, h: 82, w0: 108 };

  // ---------- Le même atelier des deux côtés (repère du plan : 418 × 220) ----------
  const BW = 84, BH = 28, TOP_Y = 20, BOT_Y = 156;
  const BENCHES = [[82, TOP_Y, 1], [209, TOP_Y, 2], [336, TOP_Y, 3], [82, BOT_Y, 4], [209, BOT_Y, 5]];
  const SHELF_CX = 336, SLOTS = [312, 336, 360];
  const BIN = { x: 352, y: 118, a: 22 };    // le bac sorti de son emplacement (le 3e)
  const OPS = [
    { x: 82, y: 64, a: -90, color: C.teal },
    { x: 209, y: 64, a: -90, color: C.violet },
    { x: 336, y: 64, a: -90, color: C.yellow },
    { x: 82, y: 141, a: 90, color: C.lightBlue },
    { x: 209, y: 141, a: 90, color: C.green },
  ];
  const AVATAR_ORDER = [0, 3, 1, 4, 2];     // ordre des saluts (le long de l'allée)
  const STOP = { x: 209, y: 95 };           // devant le poste 2 (à droite)
  const STEP = 15;                          // pas
  const LEFT_PTS = [[-18, 92], [400, 92], [400, 203], [18, 203], [18, 118], [-22, 118]];
  const R_IN_PTS = [[-18, 95], [209, 95]];
  const R_OUT_PTS = [[209, 95], [209, 114], [-22, 114]];
  const L_STOP_X = 384;                     // on s'arrête devant le bac

  const QUESTIONS = [
    { q: [`«${NB}Montre-moi comment tu sais`, `que ta pièce est bonne.${NB}»`], label: 'Un arrangement', icon: 'detour' },
    { q: [`«${NB}Qu’est-ce que tu fais quand`, `il te manque quelque chose${NB}?${NB}»`], label: 'Une attente', icon: 'clock' },
    { q: [`«${NB}Qu’est-ce qui a changé depuis la`, `dernière fois que je suis passé${NB}?${NB}»`], label: 'Une information qui manque', icon: 'doc' },
  ];
  const ACTIONS = ['Ranger le bac', 'Marquer son emplacement'];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION;
  const T_OUT = 1.2, OUT_DUR = 0.3, T_RESET = T_OUT + OUT_DUR;   // l'image finale s'efface
  const T_GO = 1.7, T_HOUR = 10.5;                                // le chrono : 0 → 1 h des deux côtés
  // Gauche : l'allée d'un trait, arrêt devant le bac, puis le reste du tour
  const T_LSTOP = 4.35, T_LGO = 4.95, T_LEND = 10.45;
  const T_BIN = 4.4, T_CARD = 4.62, T_ACT = [4.98, 5.38];
  // Droite : droit au poste, on y reste, on repart
  const T_RARR = 3.0, T_RTURN = 9.1, T_ROUT = 9.25, T_REND = 10.45;
  const QT = [
    { ask: 3.3, talk: null, disc: 5.55 },
    { ask: 6.05, talk: [6.55, 7.1], disc: 7.25 },
    { ask: 7.75, talk: [8.25, 8.75], disc: 8.9 },
  ];
  const T_PIECE = [3.95, 5.45];             // « Montre-moi… » : l'opérateur montre sa pièce
  const T_V = 10.6;                         // verdict
  const BUBBLE = 0.75;

  // ---------- Chemins ----------
  function makePath(pts, r) {
    const P = [];
    const add = (x, y) => {
      if (!P.length) { P.push({ x, y, s: 0 }); return; }
      const q = P[P.length - 1], d = Math.hypot(x - q.x, y - q.y);
      if (d > 1e-6) P.push({ x, y, s: q.s + d });
    };
    const line = (a, b) => {
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 3));
      for (let k = 1; k <= n; k++) add(lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n));
    };
    const quad = (a, c, b) => {
      for (let k = 1; k <= 16; k++) {
        const u = k / 16;
        add((1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]);
      }
    };
    let cur = pts[0];
    add(cur[0], cur[1]);
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      if (i === pts.length - 1) { line(cur, p); break; }
      const n = pts[i + 1];
      const l1 = Math.hypot(p[0] - cur[0], p[1] - cur[1]), l2 = Math.hypot(n[0] - p[0], n[1] - p[1]);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const a = [p[0] - (p[0] - cur[0]) / l1 * rr, p[1] - (p[1] - cur[1]) / l1 * rr];
      const b = [p[0] + (n[0] - p[0]) / l2 * rr, p[1] + (n[1] - p[1]) / l2 * rr];
      line(cur, a); quad(a, p, b); cur = b;
    }
    return { P, len: P[P.length - 1].s };
  }
  function at(path, s) {
    const P = path.P;
    s = clamp(s, 0, path.len);
    let lo = 0, hi = P.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m].s <= s) lo = m; else hi = m; }
    const a = P[lo], b = P[hi];
    const u = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0;
    return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), a: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI };
  }
  // Instant où la distance parcourue atteint s (fonction croissante)
  function tWhen(fn, s, t0, t1) {
    let lo = t0, hi = t1;
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (fn(m) >= s) hi = m; else lo = m; }
    return hi;
  }

  const LP = makePath(LEFT_PTS, 18), RIN = makePath(R_IN_PTS, 18), ROUT = makePath(R_OUT_PTS, 16);
  const S_STOP = L_STOP_X - LEFT_PTS[0][0];
  const sLeft = t => {
    if (t <= T_GO) return 0;
    if (t < T_LSTOP) return S_STOP * trap((t - T_GO) / (T_LSTOP - T_GO), 0.12);
    if (t < T_LGO) return S_STOP;
    if (t < T_LEND) return S_STOP + (LP.len - S_STOP) * trap((t - T_LGO) / (T_LEND - T_LGO), 0.08);
    return LP.len;
  };
  const sIn = t => RIN.len * trap((t - T_GO) / (T_RARR - T_GO), 0.18);
  const sOut = t => ROUT.len * trap((t - T_ROUT) / (T_REND - T_ROUT), 0.15);
  // Saluts : quand le visiteur arrive à hauteur de chaque opérateur
  const GREET = OPS.map(o => tWhen(sLeft, o.x - 18 - LEFT_PTS[0][0], T_GO, T_LSTOP));
  const T_HELLO = Math.min(...GREET);

  const minutes = s => 60 * clamp((s - T_GO) / (T_HOUR - T_GO));
  const hm = m => { const k = Math.round(m); return `${Math.floor(k / 60)}${NB}h${NB}${String(k % 60).padStart(2, '0')}`; };

  // ---------- Petits éléments ----------
  // Une personne sur le plan (pastille avatar, centrée en 0)
  function person(parent, color, r = 12, ring = 2.5) {
    const g = el('g', {}, parent);
    const body = el('g', {}, g);
    el('circle', { cx: 0, cy: 0, r, fill: color, stroke: C.white, 'stroke-width': ring }, body);
    el('circle', { cx: 0, cy: -r * 0.24, r: r * 0.3, fill: C.white }, body);
    el('path', { d: `M ${-r * 0.5} ${r * 0.56} C ${-r * 0.5} ${r * 0.12}, ${r * 0.5} ${r * 0.12}, ${r * 0.5} ${r * 0.56} Z`, fill: C.white }, body);
    return { g, body };
  }
  // Trace de pas (semelle + talon), orientée vers +x
  function footprint(parent, color) {
    const g = el('g', {}, parent);
    el('ellipse', { cx: 3, cy: 0, rx: 5.3, ry: 3.5, fill: color }, g);
    el('circle', { cx: -4.8, cy: 0, r: 2.7, fill: color }, g);
    return g;
  }
  // Avatar de face (carnet)
  function avatar(parent, cx, cy, color, r = 14) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: color }, g);
    el('circle', { cx, cy: cy - r * 0.24, r: r * 0.3, fill: C.white }, g);
    el('path', { d: `M ${cx - r * 0.5} ${cy + r * 0.56} C ${cx - r * 0.5} ${cy + r * 0.12}, ${cx + r * 0.5} ${cy + r * 0.12}, ${cx + r * 0.5} ${cy + r * 0.56} Z`, fill: C.white }, g);
    return g;
  }
  function stopwatch(parent, cx, cy) {
    const g = el('g', { transform: `translate(${cx} ${cy})` }, parent);
    el('rect', { x: -2.8, y: -14, width: 5.6, height: 4, rx: 1.5, fill: C.blue }, g);
    el('circle', { cx: 0, cy: 0, r: 9.5, fill: C.white, stroke: C.blue, 'stroke-width': 2.6 }, g);
    const hand = el('line', { x1: 0, y1: 0, x2: 0, y2: -6, stroke: C.blue, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
    el('circle', { cx: 0, cy: 0, r: 1.7, fill: C.blue }, g);
    return hand;
  }
  // Pastille d'étape ; anchor 'end' : alignée à droite sur x
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, anchor = 'start', size = 19, h = 38 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, 0, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    const iw = icon ? 28 : 0;
    const w = tx.getBBox().width + 36 + iw;
    const x0 = anchor === 'end' ? x - w : x;
    r.setAttribute('x', x0);
    r.setAttribute('width', w);
    tx.setAttribute('x', x0 + 18 + iw);
    if (icon) {
      el('circle', { cx: x0 + 28, cy, r: 11, fill: C.green }, g);
      el('path', { d: `M ${x0 + 23} ${cy + 0.5} L ${x0 + 26.8} ${cy + 4.2} L ${x0 + 33.2} ${cy - 3.4}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return { g, x0, w };
  }
  // Bulle de dialogue sur le plan : la queue pointe en (x, y), la bulle part à droite (dir 1) ou à gauche (−1)
  function bubble(parent, x, y, label, { bg = C.white, fg = C.blue, size = 13, dir = 1 } = {}) {
    const g = el('g', { filter: 'url(#soft)' }, parent);
    el('path', { d: `M ${x} ${y} L ${x + 7 * dir} ${y - 4.5} L ${x + 7 * dir} ${y + 4.5} Z`, fill: bg }, g);
    const r = el('rect', { y: y - 11, height: 22, rx: 11, fill: bg }, g);
    const tx = text(g, 0, y + size * 0.36, label, { size, weight: 800, fill: fg });
    const w = tx.getBBox().width + 16;
    const rx0 = dir > 0 ? x + 5 : x - 5 - w;
    r.setAttribute('x', rx0);
    r.setAttribute('width', w);
    tx.setAttribute('x', rx0 + 8);
    return { g, w, tx };
  }
  const ICONS = {
    detour(g) {   // un contournement
      el('path', { d: 'M -5.5 5 V -0.5 C -5.5 -6, 4.5 -6, 4.5 -0.5 V 3', fill: 'none', stroke: C.white, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
      el('path', { d: 'M 1.3 1.2 L 4.5 4.6 L 7.7 1.2', fill: 'none', stroke: C.white, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    },
    clock(g) {    // une attente
      el('circle', { cx: 0, cy: 0, r: 5.8, fill: 'none', stroke: C.white, 'stroke-width': 2 }, g);
      el('path', { d: 'M 0 -3 V 0 L 2.4 1.8', fill: 'none', stroke: C.white, 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    },
    doc(g) {      // une information qui manque
      el('rect', { x: -4.6, y: -6, width: 9.2, height: 12, rx: 1.6, fill: 'none', stroke: C.white, 'stroke-width': 1.9 }, g);
      el('line', { x1: -2, y1: -2.4, x2: 2, y2: -2.4, stroke: C.white, 'stroke-width': 1.7, 'stroke-linecap': 'round' }, g);
      el('line', { x1: -2, y1: 1, x2: 0, y2: 1, stroke: C.white, 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-dasharray': '1 2' }, g);
    },
  };
  const popTf = (k, cx, cy) => (k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`);

  const S = { sides: [] };

  // ---------- Le plan de l'atelier (identique des deux côtés) ----------
  function buildPlan(side, px) {
    const g = el('g', { transform: `translate(${px} ${PLAN.y})` });
    const W = IN_W, H = PLAN.h;
    el('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: FLOOR, stroke: WALL, 'stroke-width': 2 }, g);
    el('rect', { x: 1, y: 80, width: W - 2, height: 48, fill: AISLE }, g);
    [80, 128].forEach(y => el('line', { x1: 8, y1: y, x2: W - 8, y2: y, stroke: C.yellow, 'stroke-width': 2.5, 'stroke-dasharray': '10 7', 'stroke-linecap': 'round' }, g));
    // L'entrée (ouverture dans le mur, à gauche)
    el('rect', { x: -2, y: 84, width: 5, height: 40, fill: AISLE }, g);
    [84, 124].forEach(y => el('line', { x1: -3, y1: y, x2: 6, y2: y, stroke: WALL, 'stroke-width': 3, 'stroke-linecap': 'round' }, g));
    // Postes
    side.benches = BENCHES.map(([cx, y, n]) => {
      const x0 = cx - BW / 2;
      const r = el('rect', { x: x0, y, width: BW, height: BH, rx: 6, fill: C.white, stroke: BENCH_LINE, 'stroke-width': 2 }, g);
      fit(text(g, x0 + 9, y + 18.5, `Poste ${n}`, { size: 12, weight: 700, fill: MUTED }), x0 + 60, `poste ${n}`, x0 + 4);
      const pc = el('rect', { x: x0 + 63, y: y + 8, width: 12, height: 12, rx: 2.5, fill: PIECE }, g);
      return { r, pc, cx, y };
    });
    // Étagère des bacs : deux bacs à leur place, le troisième emplacement est vide
    el('rect', { x: SHELF_CX - BW / 2, y: BOT_Y, width: BW, height: BH, rx: 6, fill: '#e7e7f2', stroke: BENCH_LINE, 'stroke-width': 2 }, g);
    SLOTS.slice(0, 2).forEach(x => el('rect', { x: x - 10, y: BOT_Y + 7, width: 20, height: 14, rx: 3, fill: C.lightBlue, stroke: BIN_LINE, 'stroke-width': 1.5 }, g));
    el('rect', { x: SLOTS[2] - 10, y: BOT_Y + 7, width: 20, height: 14, rx: 3, fill: 'none', stroke: DASH, 'stroke-width': 1.6, 'stroke-dasharray': '3 2.5' }, g);
    // Le bac sorti de son emplacement, dans l'allée
    const bin = el('g', { transform: `translate(${BIN.x} ${BIN.y}) rotate(${BIN.a})` }, g);
    el('rect', { x: -10, y: -7, width: 20, height: 14, rx: 3, fill: C.lightBlue, stroke: BIN_LINE, 'stroke-width': 1.5 }, bin);
    el('line', { x1: -5, y1: -2, x2: 5, y2: -2, stroke: BIN_LINE, 'stroke-width': 1.5, 'stroke-linecap': 'round' }, bin);

    const below = el('g', {}, g);        // traces de pas, anneau, actions
    const clip = el('g', { 'clip-path': `url(#plan${side.key})` }, g);   // le visiteur passe la porte
    const above = el('g', {}, g);        // opérateurs, bulles, alertes
    side.ops = OPS.map(o => {
      const p = person(above, o.color, 11);
      p.o = o;
      return p;
    });
    side.walker = person(clip, C.blue, 11.5, 3);
    side.walker.g.setAttribute('filter', 'url(#soft)');
    return { g, below, clip, above };
  }

  function buildSide(i) {
    const key = i ? 'R' : 'L';
    const x = SIDE_X[i], x0 = x + 16, x1 = x + 16 + IN_W;
    const side = { key, x, x0, x1 };
    S.sides.push(side);

    el('rect', { x, y: PANEL.y, width: PANEL.w, height: PANEL.h, rx: 20, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    const cp = el('clipPath', { id: `plan${key}` }, S.defs);
    el('rect', { x: 0, y: 0, width: IN_W, height: PLAN.h, rx: 14 }, cp);
    const plan = buildPlan(side, x0);
    side.plan = plan;

    // Chrono (contre la séparation de l'écran)
    const cg = el('g');
    const box = el('rect', { y: HEAD_CY - 18, height: 36, rx: 18, fill: C.pLav }, cg);
    const ct = text(cg, 0, HEAD_CY + 7, hm(60), { size: 19, weight: 800, fill: C.ink });
    const cw = 50 + ct.getBBox().width + 14;
    const bx = i ? x + 12 : x + PANEL.w - 12 - cw;
    box.setAttribute('x', bx);
    box.setAttribute('width', cw);
    ct.setAttribute('x', bx + 50);
    side.hand = stopwatch(cg, bx + 26, HEAD_CY + 1);
    side.chrono = ct;
    side.chronoG = cg;
    side.chronoC = [bx + cw / 2, HEAD_CY];
    fit(ct, bx + cw - 4, `chrono ${key}`, bx + 40);
    const pillMax = i ? x1 : bx - 12, pillMin = i ? bx + cw + 12 : x0;

    // Pastilles d'étape (la dernière : l'état final)
    const steps = i
      ? [[T_GO, 'On va au poste'], [QT[0].ask, `Question 1${NB}/${NB}3`], [QT[1].ask, `Question 2${NB}/${NB}3`], [QT[2].ask, `Question 3${NB}/${NB}3`], [T_RTURN, 'On repart'], [T_V, 'On s’arrête au poste', 'ok']]
      : [[T_GO, 'On traverse l’atelier'], [T_HELLO, 'On salue'], [T_BIN, 'On remarque un bac'], [T_ACT[0], 'On note 2 actions'], [T_RTURN, 'On repart'], [T_V, 'On traverse l’atelier', 'ko']];
    side.pills = steps.map(([t, label, kind], k) => {
      const style = kind === 'ok' ? { bg: C.pGreen, fg: C.tGreen, icon: true } : kind === 'ko' ? { bg: C.pRed, fg: C.tRed } : { bg: C.blue, fg: C.white };
      const p = pillShape(D.svg, i ? x1 : x0, HEAD_CY, label, { ...style, anchor: i ? 'end' : 'start' });
      fit(p.g, pillMax, `pastille ${key}${k + 1}`, pillMin);
      return { g: p.g, t };
    });

    // Bloc du bas : compteur « appris », puis le verdict
    const bg = el('g');
    side.blockBase = el('rect', { x: x0, y: BLOCK.y, width: BLOCK.w0, height: BLOCK.h, rx: 16, fill: C.pLav }, bg);
    side.blockTint = el('rect', { x: x0, y: BLOCK.y, width: BLOCK.w0, height: BLOCK.h, rx: 16, fill: i ? C.pGreen : C.pRed, opacity: 0 }, bg);
    side.blockSep = el('line', { x1: x0 + BLOCK.w0, y1: BLOCK.y + 16, x2: x0 + BLOCK.w0, y2: BLOCK.y + BLOCK.h - 16, stroke: i ? C.green : C.red, 'stroke-opacity': 0.45, 'stroke-width': 2, opacity: 0 }, bg);
    const cx = x0 + BLOCK.w0 / 2;
    side.count = el('g', {}, bg);
    text(side.count, cx, BLOCK.y + 27, 'appris', { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
    const dcp = el('clipPath', { id: `digits${key}` }, S.defs);
    el('rect', { x: x0, y: BLOCK.y + 33, width: BLOCK.w0, height: 46 }, dcp);
    const dg = el('g', { 'clip-path': `url(#digits${key})` }, side.count);
    side.digA = text(dg, cx, BLOCK.y + 70, '0', { size: 38, weight: 800, fill: C.ink, anchor: 'middle' });
    side.digB = text(dg, cx, BLOCK.y + 70, '0', { size: 38, weight: 800, fill: C.ink, anchor: 'middle' });
    side.countC = [cx, BLOCK.y + BLOCK.h / 2];
    const verdict = i ? ['Ce qu’aucun tableau', 'ne remonte.'] : ['Agréable, mais', 'une promenade.'];
    side.verdict = el('g', {}, bg);
    verdict.forEach((l, k) => fit(text(side.verdict, x0 + BLOCK.w0 + 20, BLOCK.y + 36 + k * 28, l, { size: 20, weight: 800, fill: i ? C.tGreen : C.tRed }), x1 - 12, `verdict ${key}${k + 1}`));
    return side;
  }

  // ---------- Les traces de pas ----------
  function prints(side, path, s0, s1, fn, t0, t1, color, phase = 0) {
    const list = [];
    for (let k = 0, s = s0; s <= s1 + 1e-6; k++, s += STEP) {
      const p = at(path, s);
      const sd = (k + phase) % 2 ? 1 : -1;
      const x = p.x - Math.sin(p.a * Math.PI / 180) * sd * 5.2, y = p.y + Math.cos(p.a * Math.PI / 180) * sd * 5.2;
      const g = footprint(side.plan.below, color);
      list.push({ g, x, y, a: p.a, t: tWhen(fn, s, t0, t1) });
    }
    return list;
  }

  function build() {
    D.template({ author: 'hugo' });
    D.title('Un Gemba Walk,', `ou une promenade${NB}?`);
    D.chapeau('Il peut durer une heure, croiser toute l’équipe… et ne rien apprendre.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [[`Même atelier, même heure${NB}: à gauche `, 0], ['on traverse', C.tRed], [', à droite ', 0], ['on s’arrête au poste', C.tGreen], ['.', 0]]);
    line(384, [['Le compteur ne garde que ce qu’on ', 0], ['n’aurait pas pu apprendre depuis son bureau', C.blue], ['.', 0]]);

    S.defs = el('defs');
    const soft = el('filter', { id: 'soft', x: '-40%', y: '-60%', width: '180%', height: '220%' }, S.defs);
    el('feDropShadow', { dx: 0, dy: 2, stdDeviation: 2.2, 'flood-color': C.ink, 'flood-opacity': 0.2 }, soft);
    const lift = el('filter', { id: 'lift', x: '-80%', y: '-80%', width: '260%', height: '260%' }, S.defs);
    el('feDropShadow', { dx: 0, dy: 5, stdDeviation: 3, 'flood-color': C.ink, 'flood-opacity': 0.3 }, lift);

    // ----- Cadre du visuel : l'écran partagé -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    const L = buildSide(0), R = buildSide(1);
    // Repère de synchronisation entre les deux chronos
    S.sync = el('g');
    el('circle', { cx: 540, cy: HEAD_CY, r: 13, fill: C.blue, stroke: C.white, 'stroke-width': 3 }, S.sync);
    [-3, 3].forEach(dy => el('line', { x1: 535, y1: HEAD_CY + dy, x2: 545, y2: HEAD_CY + dy, stroke: C.white, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, S.sync));

    // ----- Gauche : la promenade -----
    L.prints = prints(L, LP, 24, LP.len - 24, sLeft, T_GO, T_LEND + 0.01, STEP_L);
    L.hellos = OPS.map((o, k) => {
      const dir = o.x > 300 ? -1 : 1;
      const b = bubble(L.plan.above, o.x + 14 * dir, o.y, `Salut${NB}!`, { dir });
      b.c = [o.x + 14 * dir, o.y];
      fit(b.tx, IN_W - 10, `salut ${k + 1}`, 10);
      return b;
    });
    // Le bac remarqué : alerte, flèche « ranger le bac », marquage de l'emplacement
    L.alert = el('g', {}, L.plan.above);
    el('circle', { cx: 0, cy: 0, r: 9.5, fill: C.red, stroke: C.white, 'stroke-width': 2 }, L.alert);
    text(L.alert, 0, 5, '!', { size: 14, weight: 800, fill: C.white, anchor: 'middle' });
    L.alertC = [323, 116];
    const ad = `M ${BIN.x - 6} ${BIN.y + 13} Q ${BIN.x - 18} ${BIN.y + 34} ${SLOTS[2] - 2} ${BOT_Y + 3}`;
    L.arrow = el('path', { d: ad, fill: 'none', stroke: C.blue, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, L.plan.below);
    L.arrowLen = L.arrow.getTotalLength();
    L.arrowHead = el('path', { d: `M ${SLOTS[2] - 8} ${BOT_Y - 4} L ${SLOTS[2] - 2} ${BOT_Y + 3} L ${SLOTS[2] + 4} ${BOT_Y - 4}`, fill: 'none', stroke: C.blue, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, L.plan.below);
    L.mark = el('rect', { x: SLOTS[2] - 13, y: BOT_Y + 4, width: 26, height: 20, rx: 3, fill: 'none', stroke: C.yellow, 'stroke-width': 3 }, L.plan.above);
    L.markLen = 2 * (26 + 20);

    // Carnet de gauche
    const lx = L.x0;
    text(D.svg, lx, 752, 'Toute l’équipe croisée', { size: 15, weight: 700, fill: MUTED });
    L.avatars = AVATAR_ORDER.map((oi, k) => {
      const cx = lx + 16 + k * 36;
      avatar(D.svg, cx, 782, GREY);
      const on = avatar(D.svg, cx, 782, OPS[oi].color);
      return { on, cx, oi };
    });
    L.met = text(D.svg, L.x1, 789, `5${NB}/${NB}5`, { size: 20, weight: 800, fill: C.ink, anchor: 'end' });
    fit(L.met, L.x1, 'croisés', lx + 200);
    text(D.svg, lx, 836, 'Ce qu’on rapporte', { size: 15, weight: 700, fill: MUTED });
    L.sk = el('g');
    el('rect', { x: lx, y: 848, width: IN_W, height: 44, rx: 12, fill: 'none', stroke: DASH, 'stroke-width': 1.8, 'stroke-dasharray': '6 5' }, L.sk);
    el('circle', { cx: lx + 24, cy: 870, r: 11, fill: C.pLav }, L.sk);
    el('rect', { x: lx + 46, y: 864, width: 150, height: 12, rx: 6, fill: C.pLav }, L.sk);
    L.actSk = ACTIONS.map((a, k) => {
      const cy = 922 + k * 40;
      const g = el('g');
      el('rect', { x: lx + 44, y: cy - 9, width: 18, height: 18, rx: 4.5, fill: C.pLav }, g);
      el('rect', { x: lx + 74, y: cy - 6, width: [120, 210][k], height: 12, rx: 6, fill: C.pLav }, g);
      return g;
    });
    L.card = el('g');
    el('rect', { x: lx, y: 848, width: IN_W, height: 44, rx: 12, fill: NOTE_BG, stroke: CARD_LINE, 'stroke-width': 2 }, L.card);
    L.cardIcon = el('g', {}, L.card);
    el('circle', { cx: lx + 24, cy: 870, r: 11, fill: C.red }, L.cardIcon);
    text(L.cardIcon, lx + 24, 875.5, '!', { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
    fit(text(L.card, lx + 46, 876.5, `«${NB}Bac mal rangé${NB}»`, { size: 18, weight: 800, fill: C.ink }), L.x1 - 12, 'bac mal rangé');
    L.acts = ACTIONS.map((a, k) => {
      const cy = 922 + k * 40;
      const g = el('g');
      const elbow = el('path', { d: `M ${lx + 24} ${cy - (k ? 40 : 30)} V ${cy - 6} Q ${lx + 24} ${cy} ${lx + 30} ${cy} H ${lx + 38}`, fill: 'none', stroke: DASH, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
      const box = el('rect', { x: lx + 44, y: cy - 9, width: 18, height: 18, rx: 4.5, fill: C.white, stroke: C.blue, 'stroke-width': 2.4 }, g);
      const tx = text(g, lx + 74, cy + 6, a, { size: 17, weight: 700, fill: C.ink });
      fit(tx, L.x1 - 12, `action ${k + 1}`);
      return { g, elbow, box, tx, cy };
    });

    // ----- Droite : le vrai Gemba -----
    R.prints = prints(R, RIN, 24, RIN.len - 14, sIn, T_GO, T_RARR + 0.01, C.blue);
    R.stand = [-1, 1].map(sd => {
      const g = footprint(R.plan.below, C.blue);
      return { g, x: STOP.x + sd * 5.4, y: STOP.y + 3, a: -90 };
    });
    R.outPrints = prints(R, ROUT, 12, ROUT.len - 24, sOut, T_ROUT, T_REND + 0.01, C.blue, 1);
    // Le poste où l'on s'arrête : cadre bleu ; le temps passé devant : un anneau qui se remplit
    const b2 = R.benches[1];
    R.focus = el('rect', { x: b2.cx - BW / 2, y: b2.y, width: BW, height: BH, rx: 6, fill: 'none', stroke: C.blue, 'stroke-width': 2.6, opacity: 0 }, R.plan.below);
    el('circle', { cx: STOP.x, cy: STOP.y, r: 18, fill: 'none', stroke: DASH, 'stroke-width': 1.6, 'stroke-dasharray': '3 3' }, R.plan.below);
    R.ringLen = 2 * Math.PI * 18;
    R.ring = el('circle', { cx: STOP.x, cy: STOP.y, r: 18, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': f2(R.ringLen), 'stroke-dashoffset': f2(R.ringLen), transform: `rotate(-90 ${STOP.x} ${STOP.y})` }, R.plan.below);
    // Bulles : la question du visiteur, l'explication de l'opérateur
    R.ask = el('g', {}, R.plan.above);
    const ab = el('g', { filter: 'url(#soft)' }, R.ask);
    el('path', { d: `M ${STOP.x - 14} ${STOP.y - 9} L ${STOP.x - 24} ${STOP.y - 13} L ${STOP.x - 20} ${STOP.y - 5} Z`, fill: C.blue }, ab);
    el('rect', { x: STOP.x - 50, y: STOP.y - 32, width: 30, height: 26, rx: 13, fill: C.blue }, ab);
    text(R.ask, STOP.x - 35, STOP.y - 13, '?', { size: 17, weight: 800, fill: C.white, anchor: 'middle' });
    R.askC = [STOP.x - 18, STOP.y - 10];
    const op2 = OPS[1];
    R.talk = el('g', {}, R.plan.above);
    const tb = el('g', { filter: 'url(#soft)' }, R.talk);
    el('path', { d: `M ${op2.x + 15} ${op2.y} L ${op2.x + 22} ${op2.y - 4.5} L ${op2.x + 22} ${op2.y + 4.5} Z`, fill: C.white }, tb);
    el('rect', { x: op2.x + 20, y: op2.y - 11, width: 40, height: 22, rx: 11, fill: C.white }, tb);
    R.dots = [0, 1, 2].map(k => el('circle', { cx: op2.x + 30 + k * 10, cy: op2.y, r: 3, fill: MUTED }, R.talk));
    R.talkC = [op2.x + 15, op2.y];
    R.spark = el('circle', { cx: op2.x, cy: op2.y, r: 12, fill: 'none', stroke: C.green, 'stroke-width': 3 }, R.plan.above);
    // La pièce que l'opérateur montre (sur le poste 2)
    R.piece = el('rect', { x: -6, y: -6, width: 12, height: 12, rx: 2.5, fill: C.lightBlue, stroke: BIN_LINE, 'stroke-width': 1.4 }, R.plan.above);
    R.pieceFrom = [BENCHES[1][0] - BW / 2 + 69, TOP_Y + 14];
    R.pieceTo = [op2.x + 30, op2.y + 2];

    // Carnet de droite : les questions qui font avancer, et ce qu'elles font surgir
    const rx = R.x0;
    text(D.svg, rx, 752, 'Les questions qui font avancer', { size: 15, weight: 700, fill: MUTED });
    R.rows = QUESTIONS.map((q, k) => {
      const y0 = 764 + k * 84;
      // Squelette de la ligne (avant la question) : pastille et deux barres
      const sk = el('g');
      el('circle', { cx: rx + 13, cy: y0 + 12, r: 12.5, fill: C.pLav }, sk);
      text(sk, rx + 13, y0 + 17, String(k + 1), { size: 14, weight: 800, fill: DASH, anchor: 'middle' });
      el('rect', { x: rx + 36, y: y0 + 6, width: [300, 290, 330][k], height: 11, rx: 5.5, fill: C.pLav }, sk);
      el('rect', { x: rx + 36, y: y0 + 28, width: [230, 280, 320][k], height: 11, rx: 5.5, fill: C.pLav }, sk);
      const g = el('g');
      el('circle', { cx: rx + 13, cy: y0 + 12, r: 12.5, fill: C.blue }, g);
      text(g, rx + 13, y0 + 17, String(k + 1), { size: 14, weight: 800, fill: C.white, anchor: 'middle' });
      q.q.forEach((l, j) => fit(text(g, rx + 36, y0 + 17 + j * 22, l, { size: 17, weight: 700, fill: C.ink }), R.x1, `question ${k + 1} ligne ${j + 1}`));
      const ghost = el('rect', { x: rx + 36, y: y0 + 47, width: 150, height: 28, rx: 14, fill: 'none', stroke: DASH, 'stroke-width': 1.8, 'stroke-dasharray': '6 5' });
      // La découverte : la pastille d'icône surgit, puis l'étiquette se déroule
      const chip = el('g');
      const ccp = el('clipPath', { id: `chip${k}` }, S.defs);
      const cclip = el('rect', { x: rx + 30, y: y0 + 43, width: 40, height: 36 }, ccp);
      const body = el('g', { 'clip-path': `url(#chip${k})` }, chip);
      const cr = el('rect', { x: rx + 36, y: y0 + 47, height: 28, rx: 14, fill: C.pGreen }, body);
      const ct = text(body, rx + 67, y0 + 66.5, q.label, { size: 15, weight: 700, fill: C.tGreen });
      const cw = ct.getBBox().width + 45;
      cr.setAttribute('width', cw);
      fit(cr, R.x1, `découverte ${k + 1}`);
      const ic = el('g', {}, chip);
      el('circle', { cx: rx + 50, cy: y0 + 61, r: 10, fill: C.green }, ic);
      ICONS[q.icon](el('g', { transform: `translate(${rx + 50} ${y0 + 61})` }, ic));
      return { sk, g, ghost, chip, ic, cclip, cw, y0, ic0: [rx + 50, y0 + 61], x0: rx + 30 };
    });
    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  const place = (n, x, y, a, k = 1) => n.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(a)})` + (k !== 1 ? ` scale(${f2(Math.max(k, 0.001))})` : ''));

  function drawPrints(list, s, fade, op) {
    list.forEach(p => {
      const u = s - p.t;
      if (u < 0) { p.g.setAttribute('opacity', 0); return; }
      const k = u < 0.14 ? 0.5 + 0.5 * easeOut(u / 0.14) : 1;
      const o = lerp(1, op, prog(u, 0.15, 1.2));
      p.g.setAttribute('opacity', f2(o * clamp(u / 0.06) * fade));
      place(p.g, p.x, p.y, p.a, k);
    });
  }
  // Le visiteur : apparaît à l'entrée, se balance à chaque pas quand il marche
  function walkerAt(w, x, y, a, s, d, moving) {
    place(w.g, x, y, 0, popScale(prog(s, T_GO, 0.35)));
    w.body.setAttribute('transform', moving ? `rotate(${f2(9 * moving * Math.sin(Math.PI * d / STEP))})` : '');
  }
  function drawPills(side, s, final, fade) {
    const n = side.pills.length;
    side.pills.forEach((p, i) => {
      const a = p.t + (i ? 0.14 : 0);
      let o;
      if (i === n - 1) o = final ? fade : prog(s, a, 0.25);
      else o = final ? 0 : prog(s, a, 0.25) * (1 - prog(s, side.pills[i + 1].t, 0.14));
      const dy = final ? 0 : 8 * (1 - prog(s, a, 0.25));
      p.g.setAttribute('opacity', f2(o));
      p.g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }
  // Compteur qui roule : valeur avant/après et instant du changement
  function drawCount(side, s, final, fade, value, tChange, color) {
    const p = final ? 1 : prog(s, tChange, 0.32);
    const [from, to] = value;
    if (p > 0 && p < 1 && from !== to) {
      const q = easeInOut(p);
      side.digA.textContent = String(from); side.digB.textContent = String(to);
      side.digA.setAttribute('transform', `translate(0 ${f2(-40 * q)})`);
      side.digB.setAttribute('transform', `translate(0 ${f2(40 * (1 - q))})`);
      side.digA.setAttribute('opacity', f2(1 - q));
      side.digB.setAttribute('opacity', f2(q));
    } else {
      side.digA.textContent = String(p >= 1 ? to : from);
      side.digA.setAttribute('transform', '');
      side.digA.setAttribute('opacity', 1);
      side.digB.setAttribute('opacity', 0);
    }
    [side.digA, side.digB].forEach(d => d.setAttribute('fill', color));
    const bump = p > 0 && p < 1 && from !== to ? 1 + 0.07 * Math.sin(Math.PI * p) : 1;
    side.count.setAttribute('transform', popTf(bump, side.countC[0], side.countC[1]));
    side.count.setAttribute('opacity', f2(final ? fade : prog(s, T_RESET, 0.2)));
  }
  function drawBlock(side, s, final, fade, t) {
    // à l'effacement : le texte part d'abord, puis le bloc se replie sur le compteur
    const pv = final ? 1 - easeInOut(prog(t, T_OUT + 0.1, OUT_DUR - 0.1)) : easeInOut(prog(s, T_V, 0.45));
    const w = lerp(BLOCK.w0, IN_W, pv);
    [side.blockBase, side.blockTint].forEach(r => r.setAttribute('width', f2(w)));
    side.blockTint.setAttribute('opacity', f2(pv));
    side.blockSep.setAttribute('opacity', f2(pv));
    const pt = final ? 1 : prog(s, T_V + 0.25, 0.35);
    side.verdict.setAttribute('opacity', f2(pt * (final ? 1 - prog(t, T_OUT, 0.14) : 1)));
    side.verdict.setAttribute('transform', pt >= 1 ? '' : `translate(${f2(-14 * (1 - easeOut(pt)))} 0)`);
  }

  function draw(t) {
    const final = t < T_RESET;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const s = final ? END : t;
    const [L, R] = S.sides;

    // ----- Chronos synchronisés -----
    const m = minutes(s);
    S.sides.forEach(sd => {
      sd.chrono.textContent = hm(m);
      sd.chrono.setAttribute('opacity', f2(final ? fade : prog(t, T_RESET, 0.2)));
      sd.hand.setAttribute('transform', `rotate(${f2(m * 36)})`);
      const pe = final ? 0 : prog(s, T_HOUR, 0.4);
      const k = pe > 0 && pe < 1 ? 1 + 0.08 * Math.sin(Math.PI * pe) : 1;
      sd.chronoG.setAttribute('transform', popTf(k, sd.chronoC[0], sd.chronoC[1]));
    });

    // ----- Gauche : la promenade -----
    drawPrints(L.prints, s, fade, 0.75);
    {
      const d = sLeft(s), p = at(LP, d);
      let a = p.a;
      const binA = Math.atan2(BIN.y - STOP.y, BIN.x - L_STOP_X) * 180 / Math.PI;
      if (s >= T_LSTOP - 0.05 && s < T_LGO + 0.2) a = s < T_LGO - 0.2 ? turn(0, binA, prog(s, T_LSTOP - 0.05, 0.25)) : turn(binA, 0, prog(s, T_LGO - 0.2, 0.3));
      const v = (sLeft(s + 0.02) - d) / 0.02;
      const moving = clamp(v / 120);
      const vis = !final && s >= T_GO && s < T_LEND + 0.05;
      walkerAt(L.walker, p.x, p.y, a, s, d, moving);
      L.walker.g.setAttribute('opacity', vis ? 1 : 0);
    }
    // Opérateurs : un petit sursaut quand on les salue ; les bulles « Salut ! »
    L.ops.forEach((op, k) => {
      const pg = final ? 1 : prog(s, GREET[k], 0.3);
      const kk = pg > 0 && pg < 1 ? 1 + 0.18 * Math.sin(Math.PI * pg) : 1;
      place(op.g, op.o.x, op.o.y, 0, kk);
      const b = L.hellos[k];
      const pb = final ? 1 : prog(s, GREET[k], BUBBLE);
      const kb = pb >= 1 || pb <= 0 ? 0.001 : popScale(clamp(pb * BUBBLE / 0.28));
      b.g.setAttribute('opacity', f2(pb > 0 && pb < 1 ? clamp(pb * BUBBLE / 0.1) * (1 - prog(pb, 0.8, 0.2)) : 0));
      b.g.setAttribute('transform', popTf(kb, b.c[0], b.c[1]));
    });
    // Avatars croisés et compteur « 5 / 5 »
    let met = 0;
    L.avatars.forEach(av => {
      const pa = final ? 1 : prog(s, GREET[av.oi] + 0.1, 0.3);
      if (final || s >= GREET[av.oi] + 0.1) met++;
      av.on.setAttribute('opacity', f2(clamp(pa / 0.4) * fade + (final ? 0 : 0)));
      av.on.setAttribute('transform', popTf(popScale(pa), av.cx, 782));
    });
    L.met.textContent = `${met}${NB}/${NB}5`;
    L.met.setAttribute('opacity', f2(final ? fade : prog(t, T_RESET, 0.2)));
    // Le bac : alerte qui pulse, carte du carnet, deux actions
    {
      const pa = final ? 1 : prog(s, T_BIN, 0.3);
      let k = popScale(pa);
      if (!final && pa >= 1) k *= 1 + 0.14 * Math.sin(Math.PI * 2 * (s - T_BIN - 0.3) / 0.5) * (1 - prog(s, T_BIN + 0.3, 1.5));
      L.alert.setAttribute('transform', `translate(${L.alertC[0]} ${L.alertC[1]}) scale(${f2(Math.max(k, 0.001))})`);
      L.alert.setAttribute('opacity', f2(clamp(pa / 0.3) * fade));
      const pc0 = final ? 1 : prog(s, T_CARD, 0.35);
      L.card.setAttribute('opacity', f2(clamp(pc0 / 0.3) * fade));
      L.card.setAttribute('transform', popTf(pc0 >= 1 ? 1 : 0.94 + 0.06 * back(pc0), L.x0 + IN_W / 2, 870));
      L.cardIcon.setAttribute('transform', popTf(popScale(final ? 1 : prog(s, T_CARD + 0.08, 0.35)), L.x0 + 24, 870));
      L.sk.setAttribute('opacity', f2(final ? prog(t, T_OUT + 0.15, 0.15) : 1 - prog(s, T_CARD, 0.2)));
      L.acts.forEach((a, k2) => {
        const p = final ? 1 : prog(s, T_ACT[k2], 0.35);
        L.actSk[k2].setAttribute('opacity', f2(final ? prog(t, T_OUT + 0.15, 0.15) : 1 - prog(s, T_ACT[k2], 0.2)));
        a.g.setAttribute('opacity', f2(clamp(p / 0.4) * fade));
        a.g.setAttribute('transform', p >= 1 ? '' : `translate(${f2(-16 * (1 - easeOut(p)))} 0)`);
        const pc = final ? 1 : prog(s, T_ACT[k2] + 0.1, 0.4);
        a.box.setAttribute('transform', popTf(popScale(pc), L.x0 + 53, a.cy));
      });
      const pr = final ? 1 : easeInOut(prog(s, T_ACT[0] + 0.1, 0.45));
      L.arrow.setAttribute('stroke-dasharray', f2(L.arrowLen));
      L.arrow.setAttribute('stroke-dashoffset', f2(L.arrowLen * (1 - pr)));
      L.arrow.setAttribute('opacity', f2(fade));
      L.arrowHead.setAttribute('opacity', f2((pr > 0.92 ? 1 : 0) * fade));
      const pm = final ? 1 : easeInOut(prog(s, T_ACT[1] + 0.1, 0.45));
      L.mark.setAttribute('stroke-dasharray', f2(L.markLen));
      L.mark.setAttribute('stroke-dashoffset', f2(L.markLen * (1 - pm)));
      L.mark.setAttribute('opacity', f2((pm > 0 ? 1 : 0) * fade));
    }
    drawCount(L, s, final, fade, [0, 0], Infinity, final || s >= T_V ? C.tRed : C.ink);

    // ----- Droite : le vrai Gemba -----
    drawPrints(R.prints, s, fade, 0.7);
    drawPrints(R.outPrints, s, fade, 0.7);
    R.stand.forEach(p => {
      const u = s - T_RARR - 0.05;
      p.g.setAttribute('opacity', f2(u < 0 ? 0 : clamp(u / 0.1) * fade * 0.85));
      place(p.g, p.x, p.y, p.a, u < 0.14 ? 0.5 + 0.5 * easeOut(clamp(u / 0.14)) : 1);
    });
    {
      let x, y, a, moving = 0, d = 0;
      if (s < T_RARR) { d = sIn(s); const p = at(RIN, d); x = p.x; y = p.y; a = p.a; moving = clamp((sIn(s + 0.02) - d) / 0.02 / 120); }
      else if (s < T_ROUT) {
        x = STOP.x; y = STOP.y;
        a = s < T_RTURN ? turn(0, -90, prog(s, T_RARR, 0.25)) : turn(-90, 90, prog(s, T_RTURN, 0.22));
      } else { d = sOut(s); const p = at(ROUT, d); x = p.x; y = p.y; a = p.a; moving = clamp((sOut(s + 0.02) - d) / 0.02 / 120); }
      const vis = !final && s >= T_GO && s < T_REND + 0.05;
      walkerAt(R.walker, x, y, a, s, d, moving);
      R.walker.g.setAttribute('opacity', vis ? 1 : 0);
    }
    // L'anneau : le temps passé devant le poste
    const pr = final ? 1 : prog(s, T_RARR, T_ROUT - T_RARR);
    R.ring.setAttribute('stroke-dashoffset', f2(R.ringLen * (1 - pr)));
    R.ring.setAttribute('opacity', f2((final || s >= T_RARR ? 1 : 0) * fade));
    R.focus.setAttribute('opacity', f2(final ? fade : prog(s, T_RARR, 0.3)));
    // Opérateurs (l'opérateur du poste 2 se tourne vers le visiteur)
    R.ops.forEach((op, k) => {
      let kk = 1;
      if (k === 1 && !final) QT.forEach(q => { const p = prog(s, q.disc, 0.3); if (p > 0 && p < 1) kk = 1 + 0.2 * Math.sin(Math.PI * p); });
      place(op.g, op.o.x, op.o.y, 0, kk);
    });
    // Bulles « ? » et « … », étincelle de la découverte
    let ka = 0.001, oa = 0, ot = 0, ks = 0, os = 0;
    if (!final) QT.forEach(q => {
      const p = prog(s, q.ask, 0.8);
      if (p > 0 && p < 1) { ka = popScale(clamp(p * 0.8 / 0.28)); oa = clamp(p * 0.8 / 0.08) * (1 - prog(p, 0.8, 0.2)); }
      if (q.talk && s >= q.talk[0] && s < q.talk[1]) ot = clamp((s - q.talk[0]) / 0.12) * (1 - prog(s, q.talk[1] - 0.12, 0.12));
      const pd = prog(s, q.disc, 0.45);
      if (pd > 0 && pd < 1) { ks = 12 + 9 * easeOut(pd); os = 0.9 * (1 - pd); }
    });
    R.ask.setAttribute('opacity', f2(oa));
    R.ask.setAttribute('transform', popTf(ka, R.askC[0], R.askC[1]));
    R.talk.setAttribute('opacity', f2(ot));
    R.dots.forEach((dt, k) => dt.setAttribute('transform', `translate(0 ${f2(ot ? -3.5 * Math.max(0, Math.sin(s * Math.PI * 2 / 0.5 - k * 0.9)) : 0)})`));
    R.spark.setAttribute('r', f2(ks || 12));
    R.spark.setAttribute('opacity', f2(os));
    // « Montre-moi » : la pièce quitte le poste, se montre, y retourne
    {
      let px = R.pieceFrom[0], py = R.pieceFrom[1], lifted = false, k = 1, rot = 0;
      if (!final && s >= T_PIECE[0] && s < T_PIECE[1]) {
        const go = easeInOut(prog(s, T_PIECE[0], 0.4)), ret = easeInOut(prog(s, T_PIECE[1] - 0.35, 0.35));
        const q = go * (1 - ret);
        px = lerp(R.pieceFrom[0], R.pieceTo[0], q);
        py = lerp(R.pieceFrom[1], R.pieceTo[1], q) - 12 * Math.sin(Math.PI * q);
        lifted = q > 0.02;
        k = 1 + 0.55 * Math.min(1, q * 2);
        rot = 14 * Math.sin((s - T_PIECE[0]) * Math.PI * 2 / 0.9) * go * (1 - ret);
      }
      R.piece.setAttribute('transform', `translate(${f2(px)} ${f2(py)}) rotate(${f2(rot)}) scale(${f2(k)})`);
      if (lifted) R.piece.setAttribute('filter', 'url(#lift)'); else R.piece.removeAttribute('filter');
      R.piece.setAttribute('opacity', lifted ? 1 : 0);
      R.benches[1].pc.setAttribute('opacity', lifted ? 0 : 1);
    }
    // Carnet de droite : questions, puis ce qu'elles font surgir
    R.rows.forEach((r, k) => {
      const q = QT[k];
      const pq = final ? 1 : prog(s, q.ask + 0.1, 0.35);
      r.g.setAttribute('opacity', f2(clamp(pq / 0.5) * fade));
      r.g.setAttribute('transform', pq >= 1 ? '' : `translate(${f2(18 * (1 - easeOut(pq)))} 0)`);
      r.sk.setAttribute('opacity', f2(final ? prog(t, T_OUT + 0.15, 0.15) : 1 - prog(s, q.ask + 0.1, 0.25)));
      const pi = final ? 1 : prog(s, q.disc, 0.32), pw = final ? 1 : easeOut(prog(s, q.disc + 0.18, 0.4));
      r.chip.setAttribute('opacity', f2((pi > 0 ? 1 : 0) * fade));
      r.ic.setAttribute('transform', popTf(popScale(pi), r.ic0[0], r.ic0[1]));
      r.cclip.setAttribute('width', f2(lerp(40, r.cw + 12, pw)));
      r.ghost.setAttribute('opacity', f2(final ? 0 : clamp(pq / 0.5) * (1 - prog(s, q.disc + 0.18, 0.2))));
    });
    let n = 0, tc = Infinity;
    QT.forEach(q => { if (s >= q.disc + 0.3) { n++; tc = q.disc + 0.3; } });
    const from = Math.max(0, n - 1);
    drawCount(R, s, final, fade, final ? [3, 3] : [n ? from : 0, n], n ? tc : Infinity, n || final ? C.tGreen : C.ink);

    // ----- Pastilles, verdicts, repère de synchronisation -----
    S.sides.forEach(sd => { drawPills(sd, s, final, fade); drawBlock(sd, s, final, fade, t); });
  }

  D.start({ duration: DURATION, build, draw });
})();
