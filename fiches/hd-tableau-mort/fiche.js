// Fiche LinkedIn · Hugo Duc · mercredi 21 octobre 2026
// Post : « Il y a des tableaux de management visuel que je reconnais en dix secondes. Ceux qui sont morts. »
// Premier commentaire du post : « Retrouvez nos fiches Lean sur ce lien » → encart.
// Le visuel est la pièce maîtresse : le tableau de l'équipe, en accéléré. Le calendrier s'effeuille, la date
// de mise à jour vieillit (il y a 3 semaines… 3 mois), le tableau pâlit et prend la poussière, l'équipe passe
// devant sans s'arrêter ; les trois détails du post se signalent un par un. Puis le même tableau reprend vie :
// coup de chiffon, traits de feutre qui s'écrivent, post-it qui se collent, ratures, chiffre corrigé, date du
// jour ; l'équipe s'y arrête.
// Style propre : le tableau qui vieillit, puis se couvre de traces de main. Image t = 0 = état final.
// Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const smooth = p => p * p * (3 - 2 * p);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const RAD = Math.PI / 180;
  const NB = ' ';
  // Hasard reproductible (poussière)
  const rng = (seed => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  })(21102026);

  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec';
  const RIM = '#d3d3e3', SURFACE = '#fcfcfe', PRINT = '#c6c6de', TAPE = '#ebe5cb';
  const DUST = '#8d8778', PALE = '#efece4', FLOOR_C = '#ececf3', WEB = '#a19d92', BACK_LIMB = '#4d4d80';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const FLOOR = 1098, FEET = 1121;
  const B = { x: 92, y: 494, w: 754, h: 432 };            // le tableau (cadre alu)
  const IN = { x: 99, y: 501, w: 740, h: 418 };           // sa surface blanche
  const SHEET = { y: 612, w: 168, h: 190 };
  const SX = [112, 294, 476, 658];
  const BAND = { x: 112, y: 816, w: 714, h: 94 };
  const LEDGE_Y = 924;
  const CAL = { x: 866, y: 618, w: 124 };
  const PAD = { x: 772, y: 878, w: 50, h: 46 };
  const PEN_REST = { x: 512, y: 917, a: 0 };
  const PEN_A = -28;                                      // inclinaison du feutre quand il écrit
  const CART_R = 824, CART_Y = 512, CART_H = 44, YB = 541; // cartouche « Mis à jour le »

  // Les quatre feuilles imprimées (S, Q, D, P)
  const SHEETS = [
    { title: 'Sécurité', value: '0', label: 'accident', bars: [0.56, 0.6, 0.58, 0.62, 0.6, 0.63], target: 0.72 },
    { title: 'Qualité', value: `99${NB}%`, label: 'pièces bonnes', bars: [0.7, 0.72, 0.71, 0.73, 0.72, 0.74], target: 0.66 },
    { title: 'Délais', value: `100${NB}%`, label: 'livré à l’heure', bars: [0.8, 0.82, 0.8, 0.83, 0.82, 0.84], target: 0.76 },
    { title: 'Production', value: '120', label: 'pièces par jour', bars: [0.75, 0.78, 0.76, 0.8, 0.79, 0.8], target: 0.72 },
  ];
  const Q_HAND = [0.66, 0.5, 0.61, 0.43, 0.56, 0.36];     // ce que l'équipe relève à la main
  const COL = { g: [C.green, C.tGreen], y: [C.yellow, C.tYellow], r: [C.red, C.tRed] };
  const FINAL_MAG = ['g', 'y', 'g', 'r'];
  const POSTS = [
    { x: 350, y: 867, rot: -3, fill: C.yellow, lines: [44, 36, 28] },
    { x: 524, y: 865, rot: 2.5, fill: C.teal, lines: [40, 44, 22] },
    { x: 726, y: 867, rot: -1.5, fill: C.yellow, lines: [46, 30, 38] },
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION;
  const T_OUT = 1.2, OUT_DUR = 0.3;                       // l'image finale s'efface (traces, post-it, équipe)
  const T_P = [1.5, 4.0, 5.05, 6.1, 7.25, 8.3, 11.1];   // pastilles d'étape
  // Les semaines passent : le calendrier s'effeuille
  const CAL_D = [0, 3, 7, 10, 14, 17, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 92];
  const CAL_T = [-Infinity, 1.72, 1.88, 2.02, 2.15, 2.27, 2.38, 2.8, 2.93, 3.05, 3.16, 3.27, 3.38, 3.49, 3.6, 3.71, 3.84];
  const FLIP = 0.1, ROLL = 0.16;
  const T_PALE = 1.75, PALE_DUR = 2.3, PALE_MAX = 0.46;
  const T_WEB = 2.55, WEB_DUR = 0.9;
  const T_TILT = 3.0, TILT = 5;
  // Les trois détails
  const T_D1 = 4.05, T_D2 = 5.1, T_D3 = 6.15;
  const T_GHOST = [5.2, 5.32, 5.44, 5.56], T_TAG = 5.72;
  const T_PULSE = 6.25, T_RED = [6.8, 6.9, 7.0, 7.1];
  const T_ANN_OUT = 8.3;
  // Le même tableau reprend vie
  const T_SWEEP = 8.35, SWEEP_DUR = 0.5, T_STRAIGHT = 8.7;
  const T_AGE_OK = 9.68;
  const T_MAG_OK = [9.75, 9.85, 9.95];
  const T_POST = [9.6, 9.8, 10.0], POST_FLY = [0.5, 0.42, 0.32];   // du plus loin au plus proche du bloc
  const PEN_LIFT = 8.8, PEN_HOME = 11.82;
  const MARK_T = { rDate: [9.05, 9.2], date: [9.23, 9.65], rP: [9.85, 9.97], p: [10.0, 10.3], arrow: [10.33, 10.5], q: [10.82, 11.12], tick: [11.32, 11.42] };
  const T_POINT = 11.12;
  const T_HOLD = 11.9;                                    // tout est en place : on tient l'image finale
  const STRIDE = 120;
  const PEOPLE = [
    { color: C.teal, walk: [1.55, 4.55, -70, 1150], team: [9.8, 11.0, -70, 270] },
    { color: C.violet, walk: [4.05, 7.05, 1150, -70], team: [9.5, 11.0, 1150, 630] },
    { color: C.lightBlue, walk: [6.5, 9.5, 1150, -70], team: [9.55, 11.05, -70, 450], pointer: true },
  ];

  // ---------- Dates ----------
  const WD = ['DIM.', 'LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.'];
  const MO = ['JANV.', 'FÉVR.', 'MARS', 'AVR.', 'MAI', 'JUIN', 'JUIL.', 'AOÛT', 'SEPT.', 'OCT.', 'NOV.', 'DÉC.'];
  const dayOf = d => { const x = new Date(2026, 6, 21 + d, 12); return { wd: WD[x.getDay()], day: String(x.getDate()), mo: MO[x.getMonth()] }; };
  const ageOf = d => {
    if (d === 0) return { label: 'aujourd’hui', kind: 'g' };
    const label = d < 7 ? `il y a ${d}${NB}jours` : d < 28 ? `il y a ${Math.floor(d / 7)}${NB}semaine${d >= 14 ? 's' : ''}` : `il y a ${d < 60 ? 1 : d < 90 ? 2 : 3}${NB}mois`;
    return { label, kind: d < 21 ? 'n' : 'r' };
  };
  const AGE_COL = { g: [C.pGreen, C.tGreen], n: [C.pLav, C.blue], r: [C.pRed, C.tRed] };
  // Étiquette d'âge : [instant, libellé, ton] (elle roule à chaque changement)
  const AGE = [{ t: -Infinity, ...ageOf(0) }];
  CAL_D.forEach((d, i) => { if (i && ageOf(d).label !== AGE[AGE.length - 1].label) AGE.push({ t: CAL_T[i] + 0.04, ...ageOf(d) }); });
  AGE.push({ t: T_AGE_OK, ...ageOf(0) });

  // ---------- Chiffres manuscrits (un trait par glyphe, boîte 28 px de haut) ----------
  const GLYPHS = {
    0: { w: 19, d: 'M 10 1.5 C 3.5 1.5, 1.5 9, 1.5 15 C 1.5 22.5, 5 27, 10 27 C 15 27, 18 21, 18 14 C 18 6.5, 15 1.5, 9 2.5' },
    1: { w: 12, d: 'M 2.5 7 L 9 1.5 L 9.5 27.5' },
    2: { w: 19, d: 'M 2 7.5 C 3 3, 6.5 1, 10 1.2 C 14.5 1.5, 17 5, 15.8 9.5 C 14.5 14.5, 7 20, 2 27 L 18.5 26' },
    4: { w: 19, d: 'M 12.5 1.5 L 1.5 19 L 18.5 18.5 M 13.5 9.5 L 13.8 28' },
    '/': { w: 14, d: 'M 13 0.5 L 2 28.5' },
  };
  const INK_W = 3.6;

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.green }, g);
      el('path', { d: `M ${x + 25.5} ${cy + 0.5} L ${x + 29.5} ${cy + 4.5} L ${x + 36.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return g;
  }
  function badge(parent, n) {
    const g = el('g', {}, parent);
    el('circle', { cx: 0, cy: 0, r: 15, fill: C.red, stroke: C.white, 'stroke-width': 3 }, g);
    text(g, 0, 6.5, String(n), { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
    return g;
  }
  const roundRect = (x, y, w, h, r) => `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  const rotPt = (x, y, cx, cy, a) => { const c = Math.cos(a * RAD), s = Math.sin(a * RAD); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };
  // Le feutre : pointe à l'origine, corps vers +x
  function makePen(parent, color) {
    const g = el('g', {}, parent);
    el('path', { d: 'M 0 0 L 10 -4.5 L 10 4.5 Z', fill: color, 'stroke-linejoin': 'round', stroke: color, 'stroke-width': 1.5 }, g);
    el('rect', { x: 9, y: -6, width: 8, height: 12, rx: 2, fill: '#cfcfe0' }, g);
    el('rect', { x: 16, y: -7, width: 56, height: 14, rx: 3, fill: C.white, stroke: '#c4c4d8', 'stroke-width': 1.5 }, g);
    el('rect', { x: 30, y: -7, width: 26, height: 14, fill: color }, g);
    el('rect', { x: 70, y: -7.5, width: 12, height: 15, rx: 4, fill: color }, g);
    return g;
  }
  // Ligne gribouillée (écriture d'un post-it)
  const scribble = (x0, y, len) => { let d = `M ${x0} ${y} q 3 -4 6 0`; for (let k = 6; k < len; k += 6) d += ' t 6 0'; return d; };

  // Personnage (repère aux pieds, tourné vers +x)
  function makePerson(parent, color) {
    const root = el('g', {}, parent);
    el('ellipse', { cx: 0, cy: 0, rx: 30, ry: 5.5, fill: C.ink, opacity: 0.09 }, root);
    const body = el('g', {}, root);
    const limb = (stroke, w) => el('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke, 'stroke-width': w, 'stroke-linecap': 'round' }, body);
    const legB = limb(BACK_LIMB, 13), armB = limb(BACK_LIMB, 11), legF = limb(C.ink, 13);
    el('rect', { x: -21, y: -128, width: 42, height: 72, rx: 17, fill: color }, body);
    const armF = limb(C.ink, 11);
    el('circle', { cx: 0, cy: -150, r: 17, fill: C.ink }, body);
    return { root, body, legB, legF, armB, armF };
  }
  const setLimb = (n, x, y, len, a) => {
    n.setAttribute('x1', x); n.setAttribute('y1', y);
    n.setAttribute('x2', f2(Number(x) + len * Math.sin(a * RAD))); n.setAttribute('y2', f2(y + len * Math.cos(a * RAD)));
  };
  function posePerson(P, { x, dir, ph, amp, point, o }) {
    if (o <= 0.001) { P.root.setAttribute('opacity', 0); return; }
    P.root.setAttribute('opacity', f2(o));
    const bob = -2.5 * amp * Math.abs(Math.sin(ph));
    P.root.setAttribute('transform', `translate(${f2(x)} ${FEET})`);
    P.body.setAttribute('transform', `scale(${dir} 1) translate(0 ${f2(bob)}) rotate(${f2(3 * amp)})`);
    // En marche : vue de profil ; à l'arrêt : de face, bras le long du corps
    const st = 1 - amp, a = 25 * amp * Math.sin(ph), b = 20 * amp * Math.sin(ph);
    setLimb(P.legF, f2(6 * st), -62, 60, a + 2 * st);
    setLimb(P.legB, f2(-6 * st), -62, 60, -a - 2 * st);
    setLimb(P.armB, f2(-24 * st), -114, 48, b - 6 * st);
    setLimb(P.armF, f2(24 * st), -114, 48, lerp(-b + 6 * st, 140, point));
  }
  // Arrivée en marchant : vitesse constante, puis on ralentit et on s'arrête
  const arrive = p => (p < 0.7 ? p / 0.85 : (0.7 + (1 - Math.pow(1 - (p - 0.7) / 0.3, 2)) * 0.15) / 0.85);
  const arriveAmp = p => (p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3);

  const S = {};

  function build() {
    D.template({ author: 'hugo' });
    D.title('Un tableau mort,', 'ça se voit.');
    D.chapeau('Pas besoin de lire les indicateurs. Trois détails suffisent.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [[`Le même tableau, en accéléré${NB}: d’abord `, 0], ['mort', C.tRed], [', trois mois sans mise à jour.', 0]]);
    line(384, [['Puis ', 0], ['vivant', C.tGreen], [`${NB}: il se reconnaît aux `, 0], ['traces de main', C.blue], ['. Feutre, post-it, ratures.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-40%', y: '-40%', width: '180%', height: '200%' }, defs);
    el('feDropShadow', { dx: 0, dy: 8, stdDeviation: 6, 'flood-color': C.ink, 'flood-opacity': 0.22 }, lift);
    const soft = el('filter', { id: 'soft', x: '-10%', y: '-10%', width: '120%', height: '130%' }, defs);
    el('feDropShadow', { dx: 0, dy: 6, stdDeviation: 7, 'flood-color': C.ink, 'flood-opacity': 0.12 }, soft);
    const paper = el('filter', { id: 'paper', x: '-10%', y: '-10%', width: '120%', height: '125%' }, defs);
    el('feDropShadow', { dx: 0, dy: 2, stdDeviation: 2, 'flood-color': C.ink, 'flood-opacity': 0.13 }, paper);
    const cpF = el('clipPath', { id: 'frame' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cpF);
    const cpB = el('clipPath', { id: 'board' }, defs);
    el('rect', { x: IN.x, y: IN.y, width: IN.w, height: IN.h, rx: 6 }, cpB);
    const gr = el('linearGradient', { id: 'sheen', x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    [[0, 0], [0.5, 0.9], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': C.white, 'stop-opacity': a }, gr));

    // ----- Cadre : le mur de l'atelier et le sol -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG });
    el('rect', { x: FRAME.x, y: FLOOR, width: FRAME.w, height: FRAME.y + FRAME.h - FLOOR, fill: FLOOR_C, 'clip-path': 'url(#frame)' });
    el('line', { x1: FRAME.x + 1, y1: FLOOR, x2: FRAME.x + FRAME.w - 1, y2: FLOOR, stroke: C.line, 'stroke-width': 2 });
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: 'none', stroke: C.line, 'stroke-width': 2 });

    // ----- Calendrier à effeuiller, à droite du tableau -----
    const ccx = CAL.x + CAL.w / 2;
    el('path', { d: `M ${CAL.x + 22} ${CAL.y + 4} L ${ccx} ${CAL.y - 24} L ${CAL.x + CAL.w - 22} ${CAL.y + 4}`, fill: 'none', stroke: MUTED, 'stroke-width': 2, 'stroke-linejoin': 'round' });
    el('circle', { cx: ccx, cy: CAL.y - 25, r: 4.5, fill: C.ink });
    const PG = { x: CAL.x + 3, y: CAL.y + 30, w: CAL.w - 6, h: 126 };
    S.PG = PG;
    el('rect', { x: PG.x + 6, y: PG.y + PG.h - 4, width: PG.w - 12, height: 11, rx: 4, fill: '#dedeea' });
    el('rect', { x: PG.x + 3, y: PG.y + PG.h - 4, width: PG.w - 6, height: 7, rx: 4, fill: '#e9e9f2' });
    const makePage = () => {
      const g = el('g');
      el('rect', { x: PG.x, y: PG.y, width: PG.w, height: PG.h, rx: 6, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      const wd = text(g, ccx, PG.y + 32, 'MER.', { size: 15, weight: 700, fill: MUTED, anchor: 'middle' });
      const day = text(g, ccx, PG.y + 87, '28', { size: 50, weight: 800, fill: C.ink, anchor: 'middle' });
      const mo = text(g, ccx, PG.y + 112, 'SEPT.', { size: 16, weight: 800, fill: C.blue, anchor: 'middle' });
      [wd, day, mo].forEach((n, k) => fit(n, PG.x + PG.w - 6, `calendrier ${k}`, PG.x + 6));
      return { g, wd, day, mo, d: null };
    };
    S.page = makePage();
    S.fly = makePage();
    S.flyShade = el('rect', { x: PG.x, y: PG.y, width: PG.w, height: PG.h, rx: 6, fill: C.ink, opacity: 0 }, S.fly.g);
    el('rect', { x: CAL.x, y: CAL.y, width: CAL.w, height: 34, rx: 9, fill: C.blue });
    [CAL.x + 30, CAL.x + CAL.w - 30].forEach(x => el('circle', { cx: x, cy: CAL.y + 17, r: 5, fill: FRAME_BG }));

    // ----- Le tableau -----
    S.board = el('g');
    el('rect', { x: B.x, y: B.y, width: B.w, height: B.h, rx: 12, fill: RIM, filter: 'url(#soft)' }, S.board);
    el('rect', { x: IN.x, y: IN.y, width: IN.w, height: IN.h, rx: 6, fill: SURFACE }, S.board);
    // En-tête : logo, titre, cartouche de mise à jour
    el('rect', { x: 116, y: 517, width: 30, height: 30, rx: 8, fill: C.blue }, S.board);
    [[122.5, 8], [129.5, 13], [136.5, 18]].forEach(([x, h]) => el('rect', { x, y: 540 - h, width: 5, height: h, rx: 1.5, fill: C.white }, S.board));
    const title = text(S.board, 158, YB, 'Tableau de l’équipe', { size: 23, weight: 800, fill: C.ink });
    const cart = el('rect', { y: CART_Y, height: CART_H, rx: 10, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.board);
    const handW = (19 + 12 + 14 + 12 + 19 + 12) * 26 / 28;
    S.pDate = text(S.board, CART_R - 14 - handW - 16, YB, '21/07', { size: 22, weight: 800, fill: C.ink, anchor: 'end' });
    const pdb = S.pDate.getBBox();
    const lab = text(S.board, pdb.x - 8, YB, 'Mis à jour le', { size: 15, weight: 500, fill: MUTED, anchor: 'end' });
    const cartX = lab.getBBox().x - 14;
    cart.setAttribute('x', f2(cartX));
    cart.setAttribute('width', f2(CART_R - cartX));
    D.noOverlap(title, cart, 'titre du tableau / cartouche', 16);
    S.cart = { x: cartX, y: CART_Y, w: CART_R - cartX, h: CART_H, dateX: pdb.x + pdb.width / 2 };
    el('line', { x1: 112, y1: 570, x2: 826, y2: 570, stroke: CARD_LINE, 'stroke-width': 2 }, S.board);

    // Les quatre feuilles imprimées
    S.sheets = SHEETS.map((d, i) => {
      const x = SX[i], y0 = SHEET.y, w = SHEET.w, h = SHEET.h;
      const g = el('g', {}, S.board);
      el('rect', { x, y: y0, width: w, height: h, rx: 4, fill: C.white, stroke: '#e4e4ee', 'stroke-width': 1.5, filter: 'url(#paper)' }, g);
      fit(text(g, x + 14, y0 + 32, d.title, { size: 16, weight: 800, fill: C.ink }), x + w - 44, `feuille ${i + 1} titre`, x);
      const cx0 = x + 14, cw = w - 28, cb = y0 + 118, ch = 62, bw = 15, gap = (cw - 6 * bw) / 5;
      d.bars.forEach((v, k) => el('rect', { x: cx0 + k * (bw + gap), y: cb - v * ch, width: bw, height: v * ch, rx: 2, fill: PRINT }, g));
      el('line', { x1: cx0, y1: cb - d.target * ch, x2: cx0 + cw, y2: cb - d.target * ch, stroke: '#9d9dc2', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, g);
      el('line', { x1: cx0 - 2, y1: cb, x2: cx0 + cw + 2, y2: cb, stroke: '#a9a9c8', 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
      const val = text(g, x + 14, y0 + 158, d.value, { size: 26, weight: 800, fill: C.ink });
      fit(val, x + w - 14, `feuille ${i + 1} valeur`, x);
      fit(text(g, x + 14, y0 + 180, d.label, { size: 14, weight: 500, fill: MUTED }), x + w - 12, `feuille ${i + 1} libellé`, x);
      // Aimant d'état
      const mx = x + w - 24, my = y0 + 27;
      const mag = el('g', { transform: `translate(${mx} ${my})` }, g);
      const mc = el('circle', { cx: 0, cy: 0, r: 12, 'stroke-width': 2 }, mag);
      el('path', { d: 'M -6.5 -3 A 7 7 0 0 1 -2 -7.5', fill: 'none', stroke: C.white, 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.75 }, mag);
      // Ruban adhésif
      el('rect', { x: x + w / 2 - 21, y: y0 - 6, width: 42, height: 13, rx: 2, fill: TAPE, opacity: 0.92, transform: `rotate(${i % 2 ? 3 : -3} ${x + w / 2} ${y0})` }, g);
      return { g, x, y0, w, h, mag, mc, mx, my, val, bars: d.bars.map((v, k) => [cx0 + k * (bw + gap) + bw / 2, cb - v * ch]), cb, ch, pivot: [x + w / 2, y0 + 1] };
    });

    // Bandeau « Problèmes et actions » (imprimé, vide)
    el('rect', { x: BAND.x, y: BAND.y, width: BAND.w, height: BAND.h, rx: 6, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.board);
    text(S.board, BAND.x + 14, BAND.y + 23, 'Problèmes et actions', { size: 14, weight: 700, fill: MUTED });
    [48, 72].forEach(dy => el('line', { x1: BAND.x + 14, y1: BAND.y + dy, x2: BAND.x + BAND.w - 14, y2: BAND.y + dy, stroke: '#ececf4', 'stroke-width': 1.5 }, S.board));

    // ----- Le temps qui passe : voile, poussière, toile d'araignée -----
    S.pale = el('rect', { x: IN.x, y: IN.y, width: IN.w, height: IN.h, fill: PALE, opacity: 0, 'clip-path': 'url(#board)' });
    const dustG = el('g', { 'clip-path': 'url(#board)' });
    // La poussière se pose partout, sauf collée aux textes (elle passerait pour de la ponctuation)
    const avoid = [...S.board.querySelectorAll('text')].map(n => n.getBBox());
    const P4 = S.sheets[3];
    [...P4.g.querySelectorAll('text')].forEach(n => {     // la feuille Production penchera : ses textes aussi
      const b = n.getBBox();
      const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => rotPt(x, y, P4.pivot[0], P4.pivot[1], TILT));
      const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
      avoid.push({ x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) });
    });
    const nearText = (x, y) => avoid.some(b => x > b.x - 12 && x < b.x + b.width + 12 && y > b.y - 4 && y < b.y + b.height + 4);
    S.dust = [];
    for (let k = 0; k < 170; k++) {
      let x, y;
      do { x = IN.x + 6 + rng() * (IN.w - 12); y = IN.y + 6 + rng() * (IN.h - 12); } while (nearText(x, y));
      const r = 1 + 2.4 * Math.pow(rng(), 1.6);
      const n = el('circle', { cx: f2(x), cy: f2(y), r: f2(r), fill: DUST, opacity: 0 }, dustG);
      S.dust.push({ n, x, o: 0.35 + 0.4 * rng(), tr: 1.8 + 4.6 * Math.pow(rng(), 1.4) });
    }
    S.web = el('g', { opacity: 0 });
    const W0 = [B.x + 3, B.y + 3];
    const ANG = [4, 24, 50, 80], RADS = [18, 36, 54], WR = 66;
    const webP = [];
    ANG.forEach(a => webP.push(`M ${W0[0]} ${W0[1]} L ${f2(W0[0] + WR * Math.cos(a * RAD))} ${f2(W0[1] + WR * Math.sin(a * RAD))}`));
    RADS.forEach(r => {
      const pts = ANG.map(a => [W0[0] + r * Math.cos(a * RAD), W0[1] + r * Math.sin(a * RAD)]);
      let d = `M ${f2(pts[0][0])} ${f2(pts[0][1])}`;
      for (let k = 1; k < pts.length; k++) {
        const m = [(pts[k - 1][0] + pts[k][0]) / 2, (pts[k - 1][1] + pts[k][1]) / 2];
        const sag = 0.82;
        d += ` Q ${f2(W0[0] + (m[0] - W0[0]) * sag)} ${f2(W0[1] + (m[1] - W0[1]) * sag)} ${f2(pts[k][0])} ${f2(pts[k][1])}`;
      }
      webP.push(d);
    });
    S.webPaths = webP.map(d => {
      const n = el('path', { d, fill: 'none', stroke: WEB, 'stroke-width': 1.7, 'stroke-linecap': 'round' }, S.web);
      const len = n.getTotalLength();
      n.setAttribute('stroke-dasharray', `${f2(len)} ${f2(len)}`);
      return { n, len };
    });

    // ----- Rebord : feutres et bloc de post-it -----
    el('rect', { x: 104, y: LEDGE_Y, width: 730, height: 12, rx: 5, fill: '#c7c7da' });
    el('rect', { x: 104, y: LEDGE_Y, width: 730, height: 3, rx: 1.5, fill: '#dcdce9' });
    makePen(D.svg, C.red).setAttribute('transform', `translate(606 ${PEN_REST.y})`);
    const pad = el('g');
    [[5, 4], [2.5, 2], [0, 0]].forEach(([dx, dy]) => {
      el('rect', { x: PAD.x + dx, y: PAD.y - dy, width: PAD.w, height: PAD.h, rx: 2, fill: C.yellow, stroke: '#c99d24', 'stroke-width': 1 }, pad);
    });
    el('rect', { x: PAD.x, y: PAD.y, width: PAD.w, height: 9, fill: C.ink, opacity: 0.06 }, pad);
    S.ledgeDust = el('rect', { x: 104, y: LEDGE_Y - 4, width: 730, height: 5, rx: 2.5, fill: DUST, opacity: 0 });

    // ----- Post-it (collés à la main) -----
    S.posts = POSTS.map(p => {
      const g = el('g');
      el('rect', { x: -31, y: -28, width: 62, height: 56, rx: 2, fill: p.fill }, g);
      el('rect', { x: -31, y: -28, width: 62, height: 10, fill: C.ink, opacity: 0.07 }, g);
      p.lines.forEach((len, k) => el('path', { d: scribble(-23, -6 + k * 13, len), fill: 'none', stroke: C.ink, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g));
      return { g, ...p };
    });

    // ----- Traces de feutre (elles s'écrivent) -----
    S.marksG = el('g');
    const ink = (d, parent = S.marksG, w = INK_W) => el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
    const hand = (str, x, yTop, h, rot) => {
      const s = h / 28;
      const g = el('g', { transform: `translate(${x} ${yTop}) rotate(${rot}) scale(${s})` }, S.marksG);
      let ax = 0;
      const nodes = [];
      for (const ch of str) {
        const G = GLYPHS[ch];
        const n = ink(G.d, g, INK_W / s);
        n.setAttribute('transform', `translate(${ax} 0)`);
        nodes.push(n);
        ax += G.w + 3;
      }
      return { nodes, w: (ax - 3) * s };
    };
    const strike = (bb, yb, k) => [
      ink(`M ${f2(bb.x - 1)} ${f2(yb - 6 * k)} C ${f2(bb.x + bb.width * 0.35)} ${f2(yb - 9 * k)}, ${f2(bb.x + bb.width * 0.7)} ${f2(yb - 7 * k)}, ${f2(bb.x + bb.width + 5)} ${f2(yb - 11 * k)}`),
      ink(`M ${f2(bb.x + bb.width + 3)} ${f2(yb - 3 * k)} C ${f2(bb.x + bb.width * 0.6)} ${f2(yb - 1 * k)}, ${f2(bb.x + bb.width * 0.3)} ${f2(yb - 4 * k)}, ${f2(bb.x)} ${f2(yb - 1.5 * k)}`),
    ];
    const M = {};
    M.rDate = strike(pdb, YB, 1);
    const hd = hand('21/10', pdb.x + pdb.width + 16, YB - 22, 26, -3);
    M.date = hd.nodes;
    if (pdb.x + pdb.width + 16 + hd.w > CART_R - 6) console.error('Débordement : date manuscrite');
    const P = S.sheets[3], pv = P.val.getBBox(), pyb = P.y0 + 158;
    M.rP = strike(pv, pyb, 1.25);
    const hp = hand('104', pv.x + pv.width + 13, pyb - 25, 28, -4);
    M.p = hp.nodes;
    if (pv.x + pv.width + 13 + hp.w > P.x + P.w - 6) console.error('Débordement : chiffre corrigé');
    // Flèche du chiffre corrigé vers le post-it d'action (par la droite du libellé)
    const P3 = POSTS[2], ax0 = P.x + P.w - 12, ay0 = pyb + 4, ax1 = P3.x + 24, ay1 = P3.y - 33;
    M.arrow = [
      ink(`M ${f2(ax0)} ${f2(ay0)} C ${f2(ax0 + 4)} ${f2(ay0 + 30)}, ${f2(ax1 + 26)} ${f2(ay1 - 26)}, ${f2(ax1)} ${f2(ay1)}`),
      ink(`M ${f2(ax1 + 1)} ${f2(ay1 - 13)} L ${f2(ax1)} ${f2(ay1)} L ${f2(ax1 + 13)} ${f2(ay1 - 4)}`),
    ];
    const Q = S.sheets[1];
    const qp = Q.bars.map(([bx], k) => [bx, Q.cb - Q_HAND[k] * Q.ch - (k % 2 ? 1.5 : -1)]);
    M.q = [ink(`M ${qp.map(([x, y]) => `${f2(x)} ${f2(y)}`).join(' L ')}`)];
    S.qDot = el('circle', { cx: f2(qp[5][0]), cy: f2(qp[5][1]), r: 5, fill: C.blue }, S.marksG);
    const Sv = S.sheets[0].val.getBBox(), sx = Sv.x + Sv.width + 10, syb = S.sheets[0].y0 + 158;
    M.tick = [ink(`M ${f2(sx)} ${f2(syb - 11)} L ${f2(sx + 6)} ${f2(syb - 3)} L ${f2(sx + 19)} ${f2(syb - 22)}`)];
    S.marks = Object.entries(MARK_T).map(([k, [t0, t1]]) => {
      const segs = M[k].map(n => ({ n, len: n.getTotalLength(), m: n.getCTM() }));
      const total = segs.reduce((a, s) => a + s.len, 0);
      const ptOf = (sg, l) => { const p = sg.n.getPointAtLength(l); return { x: sg.m.a * p.x + sg.m.c * p.y + sg.m.e, y: sg.m.b * p.x + sg.m.d * p.y + sg.m.f }; };
      const last = segs[segs.length - 1];
      return { k, t0, t1, segs, total, ptOf, start: ptOf(segs[0], 0), end: ptOf(last, last.len) };
    });

    // ----- Annotations des trois détails -----
    S.ann = el('g');
    const c = S.cart;
    S.ring1 = el('path', { d: roundRect(c.x, c.y, c.w, c.h, 10), fill: 'none', stroke: C.red, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, S.ann);
    S.ring1Len = S.ring1.getTotalLength();
    S.ghosts = S.sheets.map(sh => el('path', { d: roundRect(sh.x - 6, sh.y0 - 6, sh.w + 12, sh.h + 12, 9), fill: 'none', stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '8 6', opacity: 0 }, S.ann));
    S.magRings = S.sheets.map(() => el('circle', { cx: 0, cy: 0, r: 19, fill: 'none', stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '5 4', opacity: 0 }, S.ann));
    S.pulses = S.sheets.map(() => el('circle', { cx: 0, cy: 0, r: 14, fill: 'none', stroke: C.red, 'stroke-width': 3, opacity: 0 }, S.ann));
    S.tag = el('g', { opacity: 0 }, S.ann);
    const tagR = el('rect', { y: BAND.y + BAND.h / 2 - 20, height: 40, rx: 20, fill: C.pRed, stroke: C.red, 'stroke-width': 2 }, S.tag);
    const tagT = text(S.tag, BAND.x + BAND.w / 2, BAND.y + BAND.h / 2 + 6.5, 'Aucune écriture à la main', { size: 18, weight: 800, fill: C.tRed, anchor: 'middle' });
    const tb = tagT.getBBox();
    tagR.setAttribute('x', f2(tb.x - 22));
    tagR.setAttribute('width', f2(tb.width + 44));
    S.tagC = [BAND.x + BAND.w / 2, BAND.y + BAND.h / 2];
    const m1 = S.sheets[0];
    S.badges = [
      { g: badge(S.ann, 1), x: c.x, y: c.y, t: T_D1 },
      { g: badge(S.ann, 2), x: m1.x, y: m1.y0, t: T_D2 },
      { g: badge(S.ann, 3), x: m1.mx - 20, y: m1.my - 20, t: T_D3 },
    ];

    // Coup de chiffon
    S.sheen = el('rect', { x: 0, y: IN.y, width: 170, height: IN.h, fill: 'url(#sheen)', opacity: 0, 'clip-path': 'url(#board)' });

    // ----- Étiquette d'âge de la mise à jour (au-dessus du tableau) -----
    S.tip = el('g');
    const probe = text(S.tip, 0, 0, '', { size: 16, weight: 800, fill: C.ink });
    let maxW = 0;
    S.tipW = {};
    AGE.forEach(e => { probe.textContent = e.label; S.tipW[e.label] = probe.getBBox().width; maxW = Math.max(maxW, S.tipW[e.label]); });
    probe.remove();
    const TW = 18 + 20 + 9 + maxW + 18, TX = CART_R - TW, TY = 440, TH = 34;
    S.tipBox = el('path', { d: `${roundRect(TX, TY, TW, TH, 17)} M ${f2(c.dateX - 8)} ${TY + TH - 1} L ${f2(c.dateX)} ${TY + TH + 9} L ${f2(c.dateX + 8)} ${TY + TH - 1} Z` }, S.tip);
    S.tipClock = el('g', { transform: `translate(${TX + 28} ${TY + TH / 2})` }, S.tip);
    S.tipClockC = el('circle', { cx: 0, cy: 0, r: 9, fill: 'none', 'stroke-width': 2.4 }, S.tipClock);
    S.tipClockH = el('path', { d: 'M 0 -5 V 0 L 3.5 2.5', fill: 'none', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.tipClock);
    const cpT = el('clipPath', { id: 'tip' }, defs);
    el('rect', { x: TX + 8, y: TY + 2, width: TW - 16, height: TH - 4 }, cpT);
    const tl = el('g', { 'clip-path': 'url(#tip)' }, S.tip);
    // Pendule + libellé centrés dans l'étiquette (le libellé roule à chaque changement)
    S.tipCx = TX + TW / 2;
    S.tipCur = text(tl, TX + 47, TY + 23, 'il y a 3 semaines', { size: 16, weight: 800, fill: C.ink });
    S.tipPrev = text(tl, TX + 47, TY + 23, '', { size: 16, weight: 800, fill: C.ink });
    fit(S.tipCur, TX + TW - 10, 'étiquette d’âge', TX + 40);
    S.tipC = [TX + TW / 2, TY + TH / 2];
    S.tipX0 = TX;

    // ----- L'équipe -----
    const peopleL = el('g', { 'clip-path': 'url(#frame)' });
    S.people = PEOPLE.map(p => ({ ...p, P: makePerson(peopleL, p.color) }));

    // Le feutre qui écrit
    S.pen = makePen(D.svg, C.blue);

    // Pastilles d'étape
    const PILLS = [
      ['Les semaines passent…', 'b'],
      [`1${NB}·${NB}La date de la dernière mise à jour`, 'b'],
      [`2${NB}·${NB}Tout est imprimé`, 'b'],
      [`3${NB}·${NB}Tout est vert (ou tout rouge)`, 'b'],
      [`Mort${NB}: personne ne s’y arrête`, 'r'],
      ['Le même tableau reprend vie', 'b'],
      [`Vivant${NB}: l’équipe s’y arrête`, 'g'],
    ];
    S.pills = PILLS.map(([label, k]) => pillShape(D.svg, 92, FRAME.y + 46, label,
      k === 'g' ? { bg: C.pGreen, fg: C.tGreen, icon: true } : k === 'r' ? { bg: C.pRed, fg: C.tRed } : { bg: C.blue, fg: C.white }));
    S.pills.forEach((p, i) => fit(p, S.tipX0 - 16, `pastille ${i + 1}`));

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  const setPage = (pg, d) => {
    if (pg.d === d) return;
    const x = dayOf(d);
    pg.wd.textContent = x.wd; pg.day.textContent = x.day; pg.mo.textContent = x.mo;
    pg.d = d;
  };
  const sweepX = t => lerp(IN.x - 90, IN.x + IN.w + 90, easeInOut(prog(t, T_SWEEP, SWEEP_DUR)));
  const tiltAt = t => {
    if (t < T_STRAIGHT) { const p = prog(t, T_TILT, 0.5); return TILT * (p <= 0 ? 0 : p >= 1 ? 1 : back(p)); }
    const u = t - T_STRAIGHT;
    return u >= 0.8 ? 0 : TILT * Math.exp(-7 * u) * Math.cos(11 * u);
  };
  // Couleur de chaque aimant : [instant, ton]
  const MAG_EV = [0, 1, 2, 3].map(i => {
    const ev = [[-Infinity, FINAL_MAG[i]], [1.3, 'g'], [T_RED[i], 'r']];
    if (i < 3) ev.push([T_MAG_OK[i], FINAL_MAG[i]]);
    return ev;
  });

  function draw(t) {
    if (t >= T_HOLD) t = 0;                               // tenue de l'état final jusqu'à la boucle
    const out = t < T_OUT + OUT_DUR;                      // image finale, puis effacement court
    const fadeA = out ? 1 - prog(t, T_OUT, OUT_DUR) : 1;   // traces de main, post-it, équipe
    const sw = sweepX(t);
    const swept = t >= T_SWEEP;

    // ----- Calendrier -----
    const LAST = CAL_D.length - 1;
    let idx = 0, flipP = 1, calO = 1;
    if (t < T_OUT) idx = LAST;
    else if (t < CAL_T[1]) {
      const sw2 = T_OUT + 0.13;
      idx = t < sw2 ? LAST : 0;
      calO = t < sw2 ? 1 - prog(t, T_OUT, 0.12) : prog(t, sw2 + 0.02, 0.13);
    } else {
      for (let i = 1; i <= LAST; i++) if (t >= CAL_T[i]) idx = i;
      flipP = prog(t, CAL_T[idx], FLIP);
    }
    setPage(S.page, CAL_D[idx]);
    [S.page.wd, S.page.day, S.page.mo].forEach(n => n.setAttribute('opacity', f2(calO)));
    if (idx >= 1 && flipP < 1 && t >= CAL_T[1]) {
      setPage(S.fly, CAL_D[idx - 1]);
      const k = Math.max(0.001, Math.cos(Math.PI / 2 * flipP));
      S.fly.g.setAttribute('opacity', 1);
      S.fly.g.setAttribute('transform', `translate(0 ${S.PG.y}) scale(1 ${k.toFixed(3)}) translate(0 ${-S.PG.y})`);
      S.flyShade.setAttribute('opacity', f2(0.25 * flipP));
    } else S.fly.g.setAttribute('opacity', 0);

    // ----- Étiquette d'âge (roule à chaque changement) -----
    let ei = AGE.length - 1;
    if (!(t < T_OUT)) { ei = 0; for (let i = 1; i < AGE.length; i++) if (t >= AGE[i].t) ei = i; }
    const e = AGE[ei], ep = AGE[Math.max(0, ei - 1)];
    const ru = ei > 0 && !(t < T_OUT) ? prog(t, e.t, ROLL) : 1;
    const q = easeOut(ru);
    const kind = ru < 0.5 ? ep.kind : e.kind;
    const [bg, fg] = AGE_COL[kind];
    S.tipBox.setAttribute('fill', bg);
    S.tipClockC.setAttribute('stroke', fg);
    S.tipClockH.setAttribute('stroke', fg);
    S.tipClockH.setAttribute('transform', `rotate(${f2(t >= CAL_T[1] && t < CAL_T[LAST] + FLIP ? (t - CAL_T[1]) * 1440 : 0)})`);
    // Position : pendule (20) + 9 + texte, centrés ; la pendule glisse d'une largeur à l'autre
    const lx = w => S.tipCx - (29 + w) / 2;
    const xCur = lx(S.tipW[e.label]), xPrev = lx(S.tipW[ep.label]);
    S.tipClock.setAttribute('transform', `translate(${f2(lerp(xPrev, xCur, ru < 1 ? q : 1) + 10)} ${S.tipC[1]})`);
    S.tipCur.setAttribute('x', f2(xCur + 29));
    S.tipPrev.setAttribute('x', f2(xPrev + 29));
    S.tipCur.textContent = e.label;
    S.tipCur.setAttribute('fill', AGE_COL[e.kind][1]);
    S.tipCur.setAttribute('transform', ru < 1 ? `translate(0 ${f2(24 * (1 - q))})` : '');
    S.tipPrev.textContent = ru < 1 ? ep.label : '';
    S.tipPrev.setAttribute('fill', AGE_COL[ep.kind][1]);
    S.tipPrev.setAttribute('transform', `translate(0 ${f2(-24 * q)})`);
    // Détail 1 : l'étiquette bat
    const beat = !out && t >= T_D1 + 0.4 && t < T_D2 ? Math.pow(Math.sin(Math.PI * ((t - T_D1 - 0.4) / 0.55)), 2) : 0;
    const kt = 1 + 0.06 * beat;
    S.tip.setAttribute('transform', kt === 1 ? '' : `translate(${S.tipC[0]} ${S.tipC[1]}) scale(${kt.toFixed(3)}) translate(${-S.tipC[0]} ${-S.tipC[1]})`);

    // ----- Le temps passe : voile, poussière, toile, feuille qui penche -----
    const paleO = out ? 0 : PALE_MAX * easeInOut(prog(t, T_PALE, PALE_DUR));
    const px0 = swept ? Math.max(IN.x, sw) : IN.x;
    S.pale.setAttribute('x', f2(px0));
    S.pale.setAttribute('width', f2(Math.max(0, IN.x + IN.w - px0)));
    S.pale.setAttribute('opacity', f2(paleO));
    S.dust.forEach(d => {
      const vis = !out && t >= d.tr && !(swept && d.x < sw);
      d.n.setAttribute('opacity', vis ? f2(d.o * prog(t, d.tr, 0.25)) : 0);
    });
    S.ledgeDust.setAttribute('opacity', f2(out ? 0 : 0.5 * prog(t, 2.0, 4)));
    const lx0 = swept ? Math.max(104, sw) : 104;
    S.ledgeDust.setAttribute('x', f2(lx0));
    S.ledgeDust.setAttribute('width', f2(Math.max(0, 834 - lx0)));
    const wp = out ? 0 : prog(t, T_WEB, WEB_DUR);
    S.web.setAttribute('opacity', f2(wp > 0 ? 0.9 * (swept ? 1 - prog(sw, IN.x, 50) : 1) : 0));
    S.webPaths.forEach((w, k) => {
      const p = clamp((wp - (k < 4 ? 0.06 * k : 0.3 + 0.15 * (k - 4))) / 0.35);
      w.n.setAttribute('stroke-dashoffset', f2(w.len * (1 - p)));
    });
    const tilt = out ? 0 : tiltAt(t);
    const PS = S.sheets[3];
    PS.g.setAttribute('transform', Math.abs(tilt) > 0.005 ? `rotate(${f2(tilt)} ${PS.pivot[0]} ${PS.pivot[1]})` : '');
    S.sheen.setAttribute('x', f2(sw - 85));
    S.sheen.setAttribute('opacity', swept && t < T_SWEEP + SWEEP_DUR ? 1 : 0);

    // ----- Aimants : l'ancien ton, puis le nouveau avec un petit « pop » -----
    S.sheets.forEach((sh, i) => {
      let col = FINAL_MAG[i], k = 1;
      if (t >= 1.3) {
        const ev = MAG_EV[i];
        let j = 0;
        for (let n = 1; n < ev.length; n++) if (t >= ev[n][0]) j = n;
        col = ev[j][1];
        if (j > 0 && col !== ev[j - 1][1]) { const p = prog(t, ev[j][0], 0.3); k = p >= 1 ? 1 : 0.65 + 0.35 * back(p); }
      }
      sh.mc.setAttribute('fill', COL[col][0]);
      sh.mc.setAttribute('stroke', COL[col][1]);
      sh.mag.setAttribute('transform', `translate(${sh.mx} ${sh.my})` + (k !== 1 ? ` scale(${f2(Math.max(k, 0.001))})` : ''));
    });

    // ----- Annotations des trois détails -----
    const annO = out ? 0 : 1 - prog(t, T_ANN_OUT, 0.16);
    S.ann.setAttribute('opacity', f2(annO));
    S.ring1.setAttribute('stroke-dasharray', `${f2(S.ring1Len)} ${f2(S.ring1Len)}`);
    S.ring1.setAttribute('stroke-dashoffset', f2(S.ring1Len * (1 - easeInOut(prog(t, T_D1 + 0.06, 0.4)))));
    S.ring1.setAttribute('opacity', t >= T_D1 ? 1 : 0);
    S.badges.forEach(b => {
      const p = prog(t, b.t, 0.35);
      const k = popScale(p);
      b.g.setAttribute('opacity', f2(clamp(p / 0.3)));
      b.g.setAttribute('transform', `translate(${f2(b.x)} ${f2(b.y)}) scale(${f2(Math.max(k, 0.001))})`);
    });
    S.ghosts.forEach((g, i) => {
      const p = prog(t, T_GHOST[i], 0.25);
      const k = 1 + 0.05 * (1 - easeOut(p));
      const sh = S.sheets[i], cx = sh.x + sh.w / 2, cy = sh.y0 + sh.h / 2;
      g.setAttribute('opacity', f2(p));
      g.setAttribute('transform', (i === 3 && Math.abs(tilt) > 0.005 ? `rotate(${f2(tilt)} ${sh.pivot[0]} ${sh.pivot[1]}) ` : '') + `translate(${f2(cx)} ${f2(cy)}) scale(${k.toFixed(3)}) translate(${f2(-cx)} ${f2(-cy)})`);
    });
    S.sheets.forEach((sh, i) => {
      const [mx, my] = i === 3 ? rotPt(sh.mx, sh.my, sh.pivot[0], sh.pivot[1], tilt) : [sh.mx, sh.my];
      S.magRings[i].setAttribute('cx', f2(mx)); S.magRings[i].setAttribute('cy', f2(my));
      S.magRings[i].setAttribute('opacity', f2(prog(t, T_D3 + 0.05 * i, 0.2)));
      const u = t - T_PULSE - 0.04 * i;
      const on = u >= 0 && u < 0.6;
      const v = on ? (u % 0.3) / 0.3 : 0;
      S.pulses[i].setAttribute('cx', f2(mx)); S.pulses[i].setAttribute('cy', f2(my));
      S.pulses[i].setAttribute('r', f2(14 + 16 * easeOut(v)));
      S.pulses[i].setAttribute('opacity', on ? f2(0.85 * (1 - v)) : 0);
    });
    const pt = prog(t, T_TAG, 0.3), ktg = popScale(pt);
    S.tag.setAttribute('opacity', f2(clamp(pt / 0.3)));
    S.tag.setAttribute('transform', `translate(${S.tagC[0]} ${S.tagC[1]}) scale(${f2(Math.max(ktg, 0.001))}) translate(${-S.tagC[0]} ${-S.tagC[1]})`);

    // ----- Post-it : décollés du bloc, ils volent et se collent avec un petit rebond -----
    S.posts.forEach((p, i) => {
      const sx0 = PAD.x + PAD.w / 2, sy0 = PAD.y + PAD.h / 2;
      let x = p.x, y = p.y, rot = p.rot, sx = 1, sy = 1, o = 1, lifted = false;
      if (out) { o = fadeA; y += 16 * (1 - fadeA); rot += 4 * (1 - fadeA); }
      else {
        const u = prog(t, T_POST[i], POST_FLY[i]);
        if (t < T_POST[i]) o = 0;
        else if (u < 1) {
          const q = easeInOut(u);
          x = lerp(sx0, p.x, q); y = lerp(sy0, p.y, q) - 24 * Math.sin(Math.PI * u) - 6 * clamp(u / 0.12);
          rot = lerp(0, p.rot, q) + 9 * Math.sin(Math.PI * u);
          sx = sy = lerp(0.8, 1, q) * (1 + 0.06 * Math.sin(Math.PI * u));
          lifted = true;
        } else {
          const v = prog(t, T_POST[i] + POST_FLY[i], 0.22);
          if (v < 1) { const w = Math.sin(Math.PI * v) * (1 - 0.4 * v); sy = 1 - 0.1 * w; sx = 1 + 0.06 * w; }
        }
      }
      p.g.setAttribute('opacity', f2(o));
      p.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})` + (sx !== 1 || sy !== 1 ? ` scale(${sx.toFixed(3)} ${sy.toFixed(3)})` : ''));
      if (lifted) p.g.setAttribute('filter', 'url(#lift)'); else p.g.removeAttribute('filter');
    });

    // ----- Traces de feutre -----
    S.marksG.setAttribute('opacity', f2(fadeA));
    S.marks.forEach(m => {
      const p = out ? 1 : prog(t, m.t0, m.t1 - m.t0);
      let rest = m.total * p;
      m.segs.forEach(sg => {
        const shown = clamp(rest, 0, sg.len);
        rest -= sg.len;
        // Tracé complet : plus besoin de pointillé (le rendu reste ainsi identique d'une image à l'autre)
        sg.n.setAttribute('stroke-dasharray', shown >= sg.len - 0.01 ? 'none' : `${f2(sg.len)} ${f2(sg.len + 2)}`);
        sg.n.setAttribute('stroke-dashoffset', shown >= sg.len - 0.01 ? 0 : f2(sg.len - shown));
        sg.n.setAttribute('opacity', shown > 0.05 ? 1 : 0);
      });
    });
    const qd = out ? 1 : prog(t, MARK_T.q[1], 0.18);
    S.qDot.setAttribute('opacity', qd > 0 ? 1 : 0);
    S.qDot.setAttribute('r', f2(5 * popScale(qd)));

    // ----- Le feutre -----
    const pen = penAt(t, out);
    S.pen.setAttribute('transform', `translate(${f2(pen.x)} ${f2(pen.y)}) rotate(${f2(pen.a)})`);
    if (pen.lifted) S.pen.setAttribute('filter', 'url(#lift)'); else S.pen.removeAttribute('filter');

    // ----- L'équipe : elle passe sans s'arrêter, puis elle s'arrête -----
    S.people.forEach(pp => {
      const st = { x: 0, dir: 1, ph: 0, amp: 0, point: 0, o: 0 };
      const [t0, t1, x0, x1] = pp.team;
      if (out) Object.assign(st, { x: x1, dir: Math.sign(x1 - x0), o: fadeA, point: pp.pointer ? 1 : 0 });
      else if (t >= pp.walk[0] && t < pp.walk[1]) {
        const [w0, w1, a, b] = pp.walk;
        const x = lerp(a, b, (t - w0) / (w1 - w0));
        Object.assign(st, { x, dir: Math.sign(b - a), ph: 2 * Math.PI * Math.abs(x - a) / STRIDE, amp: 1, o: 1 });
      } else if (t >= t0) {
        const p = prog(t, t0, t1 - t0);
        const x = lerp(x0, x1, arrive(p));
        const point = pp.pointer ? easeInOut(prog(t, T_POINT, 0.3)) : 0;
        Object.assign(st, { x, dir: Math.sign(x1 - x0), ph: 2 * Math.PI * Math.abs(x - x0) / STRIDE, amp: arriveAmp(p), o: 1, point });
      }
      posePerson(pp.P, st);
    });

    // ----- Pastilles d'étape : l'ancienne sort avant que la nouvelle entre -----
    const LASTP = S.pills.length - 1;
    S.pills.forEach((g, i) => {
      let o, dy = 0;
      if (out) o = i === LASTP ? 1 - prog(t, T_OUT, 0.14) : 0;
      else {
        const a = T_P[i] + (i ? 0.16 : 0);
        o = prog(t, a, 0.25) * (i < LASTP ? 1 - prog(t, T_P[i + 1], 0.14) : 1);
        dy = 8 * (1 - prog(t, a, 0.25));
      }
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });

    // Ce qui est invisible n'est pas peint du tout (sinon Chromium varie son anticrénelage d'une image à l'autre)
    D.svg.querySelectorAll('[opacity]').forEach(n => {
      const o = n.getAttribute('opacity');
      n.setAttribute('display', o === '0' || o === '0.00' ? 'none' : 'inline');
    });
  }

  // Le feutre : posé sur le rebord, il écrit chaque trace, puis revient
  function penAt(t, out) {
    if (out || t < PEN_LIFT || t >= PEN_HOME) return { ...PEN_REST, lifted: false };
    const MS = S.marks;
    for (const m of MS) if (t >= m.t0 && t < m.t1) {
      const p = prog(t, m.t0, m.t1 - m.t0);
      let rest = m.total * p, pt = m.end;
      for (const sg of m.segs) { if (rest <= sg.len) { pt = m.ptOf(sg, rest); break; } rest -= sg.len; }
      return { x: pt.x, y: pt.y, a: PEN_A, lifted: true };
    }
    let from, to, t0, t1, a0 = PEN_A, a1 = PEN_A;
    if (t < MS[0].t0) { from = PEN_REST; to = MS[0].start; t0 = PEN_LIFT; t1 = MS[0].t0; a0 = 0; }
    else if (t >= MS[MS.length - 1].t1) { from = MS[MS.length - 1].end; to = PEN_REST; t0 = MS[MS.length - 1].t1; t1 = PEN_HOME; a1 = 0; }
    else for (let i = 0; i + 1 < MS.length; i++) if (t >= MS[i].t1 && t < MS[i + 1].t0) { from = MS[i].end; to = MS[i + 1].start; t0 = MS[i].t1; t1 = MS[i + 1].t0; break; }
    const u = prog(t, t0, t1 - t0), p = easeInOut(u);
    // Petit saut en arc pour les trajets à plat ; à la verticale, le feutre glisse sans monter
    const hop = (Math.abs(to.y - from.y) < 120 ? Math.min(34, 0.1 * Math.abs(to.x - from.x)) : 0) * Math.sin(Math.PI * u);
    return { x: lerp(from.x, to.x, p), y: lerp(from.y, to.y, p) - hop, a: lerp(a0, a1, smooth(u)), lifted: true };
  }

  D.start({ duration: DURATION, build, draw });
})();
