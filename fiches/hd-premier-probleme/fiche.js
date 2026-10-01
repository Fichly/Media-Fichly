// Fiche LinkedIn · Hugo Duc · jeudi 15 octobre 2026
// Post : « Quand une équipe démarre la résolution de problèmes, le réflexe est presque toujours le même.
// Attaquer le plus gros problème. »
// Premier commentaire du post (Buffer) : la matrice de décision pour prioriser ses problèmes → encart.
// Le visuel est la pièce maîtresse : une matrice de priorisation où chaque problème est une bulle (taille = coût).
// Le viseur se verrouille d'abord sur la plus grosse bulle : trois badges de difficulté s'y accrochent, la jauge
// tourne trois mois sans victoire, la bulle vire au rouge et la confiance de l'équipe s'effondre. Retour en
// arrière : le viseur se déverrouille, part en haut à droite et choisit une petite bulle ; les trois critères du
// post se cochent, l'anneau se ferme en quelques semaines, victoire ; la confiance monte et le viseur revient
// sur la grosse bulle, « à attaquer ensuite ».
// Style propre : la matrice à bulles et le viseur de sélection. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  // Ressort amorti : les bulles se gonflent, le viseur se verrouille
  const spring = (p, damp = 5.5) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.exp(-damp * p) * Math.cos(9.5 * p));
  const bump = p => (p > 0 && p < 1 ? Math.sin(Math.PI * 3 * p) * (1 - p) : 0);
  const bez = (a, c, b, p) => [0, 1].map(k => (1 - p) * (1 - p) * a[k] + 2 * p * (1 - p) * c[k] + p * p * b[k]);
  const bez3 = (a, c1, c2, b, p) => [0, 1].map(k => (1 - p) ** 3 * a[k] + 3 * p * (1 - p) ** 2 * c1[k] + 3 * p * p * (1 - p) * c2[k] + p ** 3 * b[k]);
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => {
    const A = hex(a), B = hex(b), q = clamp(p);
    return '#' + A.map((v, i) => Math.round(lerp(v, B[i], q)).toString(16).padStart(2, '0')).join('');
  };
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const k3 = v => Math.max(0.001, v).toFixed(3);
  const about = (x, y, k) => (Math.abs(k - 1) < 1e-4 ? '' : `translate(${f2(x)} ${f2(y)}) scale(${k3(k)}) translate(${f2(-x)} ${f2(-y)})`);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', TRACK = '#e3e3f0';
  const LAV = '#dcdcef', LAV_LINE = '#c4c4de', MID = '#d3d3e6';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const X0 = 158, X1 = 984, Y0 = 514, Y1 = 1070;      // la matrice
  const XM = (X0 + X1) / 2, YM = (Y0 + Y1) / 2;      // milieux : 571 · 792
  const PILL_Y = FRAME.y + 46, PILL_MAX = 646;
  const GAUGE = { x: 664, y: 428, w: 324, h: 60 };
  const BIG = { x: 322, y: 700, r: 92 };              // le plus gros problème (haut gauche : dépend des autres)
  const SMALL = { x: 916, y: 582, r: 28 };            // le premier problème (haut droite)
  const OTHERS = [
    { x: 560, y: 948, r: 54 }, { x: 256, y: 968, r: 38 }, { x: 790, y: 884, r: 34 }, { x: 410, y: 1018, r: 24 },
    { x: 905, y: 1000, r: 22 }, { x: 512, y: 866, r: 18 }, { x: 700, y: 1024, r: 16 }, { x: 676, y: 906, r: 22 },
    { x: 362, y: 914, r: 18 }, { x: 842, y: 1034, r: 13 },
  ];
  const RING_A = BIG.r + 12, RING_B = SMALL.r + 12;
  const BOX_A = BIG.r + 16, BOX_B = SMALL.r + 14, BOX_FREE = 18;
  const ARM_A = 22, ARM_B = 13, ARM_FREE = 9;
  const STEM = 150;
  const BADGES = [
    { ang: -30, icon: 'causes', label: 'Causes multiples' },
    { ang: 0, icon: 'services', label: 'Dépend d’autres services' },
    { ang: 30, icon: 'resiste', label: 'Déjà résisté' },
  ];
  const CHECKS = ['Revient souvent, au quotidien', 'Sans attendre trois validations', 'Résultat en quelques semaines'];
  const CHK = { x: 594, head: 652, rows: [686, 720, 754] };
  const TAG_A = { x: BIG.x, cy: BIG.y + BOX_A + 31 };
  const TAG_B = { right: SMALL.x - BOX_B - 16, cy: SMALL.y };
  const ENTRY = [930, 1046];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION;
  const T_OUT = 1.2, OUT = 0.3;                        // l'image finale se dégonfle
  const T_INF = 1.5, INF_STEP = 0.07, INF_DUR = 0.55;  // les bulles se regonflent une à une
  const T_CA0 = 2.0, T_LOCK_A = 2.75;                  // le viseur file vers la plus grosse bulle
  const T_BADGE = [3.0, 3.3, 3.6];
  const T_TIMER0 = 3.95, T_TIMER1 = 5.75, TDUR = T_TIMER1 - T_TIMER0;
  const T_SPEECH = 5.9;
  const T_RW0 = 6.75, T_RW1 = 7.55, A_FROZEN = T_BADGE[0] - 0.02;  // retour en arrière : jusqu'au choix
  const T_CB0 = 7.6, T_LOCK_B = 8.2;                   // le viseur change de cible : en haut à droite
  const T_TINT = 7.95;
  const T_CHECK = [8.4, 8.65, 8.9];
  const T_RING0 = 9.15, T_WIN = 10.05;
  const T_RISE0 = 9.15, T_RISE1 = 10.3;
  const T_C0 = 10.4, T_CW = 10.8, T_LOCK_C = 11.1;    // retour sur la grosse bulle : à attaquer ensuite
  const PILLS = [
    [1.55, `1${NB}·${NB}Attaquer le plus gros`, 'blue'],
    [5.85, 'Trois mois sans victoire visible', 'red'],
    [6.75, 'Retour en arrière', 'undo'],
    [7.6, `2${NB}·${NB}Viser en haut à droite`, 'blue'],
    [10.4, 'Le gros problème viendra ensuite', 'blue'],
  ];

  // Temps de l'histoire du gros problème : il avance, puis il revient en arrière jusqu'au choix
  const storyA = s => (s < T_RW0 ? s : s < T_RW1 ? lerp(T_RW0, A_FROZEN, easeInOut(prog(s, T_RW0, T_RW1 - T_RW0))) : A_FROZEN);

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, icon = null, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon === 'undo') {
      // Flèche « annuler » : un arc qui revient vers la gauche
      el('path', { d: `M ${x + 43} ${cy + 8} C ${x + 43} ${cy - 2}, ${x + 37} ${cy - 7}, ${x + 30} ${cy - 7} H ${x + 23} M ${x + 28} ${cy - 12.5} L ${x + 22.5} ${cy - 7} L ${x + 28} ${cy - 1.5}`, fill: 'none', stroke: fg, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return g;
  }
  function watch(parent, cx, cy, color) {
    el('rect', { x: cx - 2.5, y: cy - 12.5, width: 5, height: 3.5, rx: 1.2, fill: color }, parent);
    el('circle', { cx, cy, r: 8, fill: 'none', stroke: color, 'stroke-width': 2.6 }, parent);
    return el('line', { x1: cx, y1: cy, x2: cx, y2: cy - 5, stroke: color, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, parent);
  }
  function checkDisc(parent, cx, cy, r, fill) {
    el('circle', { cx, cy, r, fill }, parent);
    return el('path', { d: `M ${f2(cx - r * 0.45)} ${f2(cy + r * 0.05)} L ${f2(cx - r * 0.12)} ${f2(cy + r * 0.38)} L ${f2(cx + r * 0.5)} ${f2(cy - r * 0.32)}`, fill: 'none', stroke: C.white, 'stroke-width': Math.max(2.4, r * 0.28), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  // Étiquette arrondie avec picto : align 'center' (x = milieu) ou 'right' (x = bord droit)
  function tag(parent, { x, cy, align = 'center', label, bg, fg, stroke = 'none', icon }) {
    const g = el('g', {}, parent);
    const h = 34;
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2, fill: bg, stroke, 'stroke-width': 2 }, g);
    const tx = text(g, 0, cy + 6, label, { size: 17, weight: 800, fill: fg });
    const w = 46 + tx.getBBox().width + 16;
    const x0 = align === 'center' ? x - w / 2 : x - w;
    r.setAttribute('x', f2(x0));
    r.setAttribute('width', f2(w));
    tx.setAttribute('x', f2(x0 + 46));
    const extra = icon(el('g', { transform: `translate(${f2(x0 + 26)} ${cy})` }, g));
    return { g, tx, x0, w, cx: x0 + w / 2, cy, extra };
  }
  const BADGE_ICONS = {
    causes(g) {   // plusieurs causes qui se rejoignent
      el('path', { d: 'M -7 -6.5 L 3 0 M -7.5 0 L 3 0 M -7 6.5 L 3 0', fill: 'none', stroke: C.white, 'stroke-width': 2.3, 'stroke-linecap': 'round' }, g);
      el('circle', { cx: 5, cy: 0, r: 3, fill: C.white }, g);
    },
    services(g) { // deux maillons : il dépend des autres
      [[-3.3, 2.2], [3.3, -2.2]].forEach(([x, y]) => el('rect', { x: x - 6.2, y: y - 3.5, width: 12.4, height: 7, rx: 3.5, fill: 'none', stroke: C.white, 'stroke-width': 2.3, transform: `rotate(-34 ${x} ${y})` }, g));
    },
    resiste(g) {  // bouclier : il a déjà résisté
      el('path', { d: 'M 0 -8.5 L 6.8 -5.6 V 0.4 C 6.8 4.8, 3.8 7.6, 0 9 C -3.8 7.6, -6.8 4.8, -6.8 0.4 V -5.6 Z', fill: C.white }, g);
    },
  };
  // Les quatre coins du viseur autour de (x, y), demi-côté h, bras a
  const bracketPath = (x, y, h, a) => {
    const L = f2(x - h), R = f2(x + h), T = f2(y - h), B = f2(y + h);
    const la = f2(x - h + a), ra = f2(x + h - a), ta = f2(y - h + a), ba = f2(y + h - a);
    return `M ${L} ${ta} V ${T} H ${la} M ${ra} ${T} H ${R} V ${ta} M ${R} ${ba} V ${B} H ${ra} M ${la} ${B} H ${L} V ${ba}`;
  };
  // Bulle de parole avec sa queue vers le bas (pointe en tipX, tipY)
  const calloutPath = (x, y, w, h, tx, tipX, tipY) => {
    const r = h / 2;
    return `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${tx + 9} L ${tipX} ${tipY} L ${tx - 9} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  };

  const S = {};

  function build() {
    D.template({ author: 'hugo' });
    D.title('Le premier problème,', 'pas le plus gros.');
    D.chapeau('Celui qui prouve à l’équipe que la démarche fonctionne.');

    // Explication courte au-dessus du visuel : comment le lire
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Chaque ', 0], ['bulle', C.blue], [` est un problème${NB}: plus elle est `, 0], ['grosse', C.blue], [', plus il coûte cher.', 0]]);
    line(384, [['Pour démarrer, visez ', 0], ['en haut à droite', C.tGreen], [', pas ', 0], ['la plus grosse bulle', C.tRed], ['.', 0]]);

    const defs = el('defs');
    const cpA = el('clipPath', { id: 'months' }, defs);
    S.monthClip = el('rect', { x: 0, y: TAG_A.cy - 14, width: 10, height: 28 }, cpA);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- La matrice -----
    // Le bon quadrant : contour discret en permanence, il s'allume quand le viseur y entre
    S.tint = el('rect', { x: XM + 5, y: Y0 + 5, width: X1 - XM - 10, height: YM - Y0 - 10, rx: 16, fill: C.pGreen, opacity: 0 });
    S.zone = el('rect', { x: XM + 5, y: Y0 + 5, width: X1 - XM - 10, height: YM - Y0 - 10, rx: 16, fill: 'none', stroke: C.green, 'stroke-width': 2.5, 'stroke-dasharray': '8 7' });
    el('line', { x1: XM, y1: Y0, x2: XM, y2: Y1, stroke: MID, 'stroke-width': 2, 'stroke-dasharray': '6 8' });
    el('line', { x1: X0, y1: YM, x2: X1, y2: YM, stroke: MID, 'stroke-width': 2, 'stroke-dasharray': '6 8' });
    // Axes
    el('path', { d: `M ${X0} ${Y1} V ${Y0 - 6} M ${X0 - 7} ${Y0 + 3} L ${X0} ${Y0 - 6} L ${X0 + 7} ${Y0 + 3}`, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    el('path', { d: `M ${X0} ${Y1} H ${X1 + 6} M ${X1 - 3} ${Y1 - 7} L ${X1 + 6} ${Y1} L ${X1 - 3} ${Y1 + 7}`, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const ylab = el('g', { transform: `translate(${X0 - 22} 0) rotate(-90)` });
    fit(text(ylab, -Y0, 0, 'Revient souvent', { size: 18, weight: 800, fill: C.ink, anchor: 'end' }), -Y0 + 1, 'axe vertical', -YM);
    fit(text(D.svg, X1 + 4, Y1 + 36, 'Traitable par l’équipe, vite', { size: 18, weight: 800, fill: C.ink, anchor: 'end' }), X1 + 6, 'axe horizontal', XM);
    // Légende : la taille dit le coût
    el('circle', { cx: X0 + 6, cy: Y1 + 30, r: 6, fill: LAV, stroke: LAV_LINE, 'stroke-width': 1.5 });
    el('circle', { cx: X0 + 28, cy: Y1 + 30, r: 11, fill: LAV, stroke: LAV_LINE, 'stroke-width': 1.5 });
    fit(text(D.svg, X0 + 48, Y1 + 36, `Taille de la bulle${NB}: ce que coûte le problème`, { size: 16, weight: 500, fill: MUTED }), XM + 40, 'légende');

    // ----- Badges : leurs tiges d'abord (sous les bulles) -----
    const stems = el('g');
    S.badges = BADGES.map(b => {
      const a = b.ang * Math.PI / 180;
      const sx = BIG.x + BIG.r * Math.cos(a), sy = BIG.y + BIG.r * Math.sin(a);
      const ex = BIG.x + STEM * Math.cos(a), ey = BIG.y + STEM * Math.sin(a);
      const len = Math.hypot(ex - sx, ey - sy);
      const stem = el('path', { d: `M ${f2(sx)} ${f2(sy)} L ${f2(ex)} ${f2(ey)}`, fill: 'none', stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': f2(len), 'stroke-dashoffset': f2(len) }, stems);
      return { ...b, stem, len, ex, ey };
    });

    // ----- Bulles -----
    const layer = el('g');
    const mk = b => {
      const g = el('g', {}, layer);
      const c = el('circle', { cx: 0, cy: 0, r: b.r, fill: LAV, stroke: LAV_LINE, 'stroke-width': 2 }, g);
      return { ...b, g, c };
    };
    S.others = OTHERS.map(b => mk(b));
    S.small = mk(SMALL);
    S.smallCheck = el('g', {}, S.small.g);
    checkDisc(S.smallCheck, 0, 0, 13, 'none').setAttribute('stroke-width', 4.2);
    S.big = mk(BIG);
    S.bigLabels = [
      text(S.big.g, 0, -12, 'Le plus gros', { size: 21, weight: 800, fill: C.blue, anchor: 'middle' }),
      text(S.big.g, 0, 14, 'problème', { size: 21, weight: 800, fill: C.blue, anchor: 'middle' }),
      text(S.big.g, 0, 44, `n°${NB}1 sur le TRS`, { size: 15, weight: 700, fill: C.blue, anchor: 'middle' }),
    ];
    fit(S.bigLabels[0], 84, 'bulle ligne 1', -84);
    fit(S.bigLabels[1], 84, 'bulle ligne 2', -84);
    fit(S.bigLabels[2], 74, 'bulle ligne 3', -74);
    // Ordre de gonflement : la plus grosse d'abord, la petite du bon quadrant en dernier
    S.order = [S.big, ...S.others, S.small];

    // ----- Anneaux -----
    const circ = r => 2 * Math.PI * r;
    S.trackA = el('circle', { cx: BIG.x, cy: BIG.y, r: RING_A, fill: 'none', stroke: TRACK, 'stroke-width': 7 });
    S.arcA = el('circle', { cx: BIG.x, cy: BIG.y, r: RING_A, fill: 'none', stroke: C.blue, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-dasharray': `${f2(circ(RING_A) * 0.26)} ${f2(circ(RING_A))}` });
    S.trackB = el('circle', { cx: SMALL.x, cy: SMALL.y, r: RING_B, fill: 'none', stroke: TRACK, 'stroke-width': 6 });
    S.arcB = el('circle', { cx: SMALL.x, cy: SMALL.y, r: RING_B, fill: 'none', stroke: C.green, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': f2(circ(RING_B)), transform: `rotate(-90 ${SMALL.x} ${SMALL.y})` });
    S.circB = circ(RING_B);
    // Éclats de la victoire
    S.rays = Array.from({ length: 8 }, (_, k) => {
      const a = (22.5 + 45 * k) * Math.PI / 180;
      return { a, n: el('line', { stroke: C.green, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }) };
    });

    // ----- Le bon quadrant : les trois critères du post -----
    S.chk = el('g');
    fit(text(S.chk, CHK.x, CHK.head, `Un bon premier problème${NB}:`, { size: 17, weight: 800, fill: C.tGreen }), X1 - 16, 'critères titre', XM);
    S.rows = CHECKS.map((label, i) => {
      const cy = CHK.rows[i];
      const g = el('g', {}, S.chk);
      el('circle', { cx: CHK.x + 11, cy, r: 11, fill: C.white, stroke: '#b9b9d6', 'stroke-width': 2 }, g);
      const on = el('g', {}, g);
      const mark = checkDisc(on, CHK.x + 11, cy, 11, C.green);
      mark.setAttribute('stroke-dasharray', 22);
      const tx = text(g, CHK.x + 32, cy + 6, label, { size: 17, weight: 700, fill: C.ink });
      fit(tx, X1 - 16, `critère ${i + 1}`, XM);
      return { g, on, mark, tx, cy };
    });

    // ----- Badges de difficulté -----
    S.badges.forEach((b, i) => {
      const g = el('g');
      const r = el('rect', { x: b.ex, y: b.ey - 19, height: 38, rx: 19, fill: C.pRed, stroke: C.white, 'stroke-width': 2.5 }, g);
      el('circle', { cx: b.ex + 21, cy: b.ey, r: 13, fill: C.red }, g);
      BADGE_ICONS[b.icon](el('g', { transform: `translate(${f2(b.ex + 21)} ${f2(b.ey)})` }, g));
      const tx = text(g, b.ex + 42, b.ey + 6, b.label, { size: 17, weight: 800, fill: C.tRed });
      r.setAttribute('width', f2(tx.getBBox().width + 58));
      fit(r, SMALL.x - BOX_B - 20, `badge ${i + 1}`, XM - 140);
      b.g = g;
    });

    // ----- Étiquettes -----
    // Sous la grosse bulle : la jauge des mois (compteur qui roule)
    S.tagA = el('g');
    const ra = el('rect', { y: TAG_A.cy - 17, height: 34, rx: 17, fill: C.pRed, stroke: C.white, 'stroke-width': 2.5 }, S.tagA);
    const months = [0, 1, 2, 3].map(n => text(S.tagA, 0, 0, `${n}${NB}mois`, { size: 17, weight: 800, fill: C.tRed }));
    S.mW = months.map(m => m.getBBox().width);
    const mw = Math.max(...S.mW);
    months.forEach(m => m.remove());
    const rest = text(S.tagA, 0, TAG_A.cy + 6, `·${NB}aucune victoire`, { size: 17, weight: 700, fill: C.tRed });
    const rw = rest.getBBox().width;
    const wA = 46 + mw + 8 + rw + 16, xA = TAG_A.x - wA / 2;
    ra.setAttribute('x', f2(xA));
    ra.setAttribute('width', f2(wA));
    S.rest = rest; S.ra = ra; S.xA = xA; S.rw = rw;
    S.handA = watch(S.tagA, xA + 26, TAG_A.cy + 1, C.tRed);
    S.monthClip.setAttribute('x', f2(xA + 44));
    S.monthClip.setAttribute('width', f2(mw + 6));
    const mg = el('g', { 'clip-path': 'url(#months)' }, S.tagA);
    S.mCur = text(mg, xA + 46, TAG_A.cy + 6, '', { size: 17, weight: 800, fill: C.tRed });
    S.mPrev = text(mg, xA + 46, TAG_A.cy + 6, '', { size: 17, weight: 800, fill: C.tRed });
    S.tagAc = [TAG_A.x, TAG_A.cy];
    fit(ra, BIG.x + 160, 'étiquette des mois', X0 + 8);
    // À la fin : la grosse bulle devient « à attaquer ensuite »
    S.tagNext = tag(D.svg, {
      x: TAG_A.x, cy: TAG_A.cy, label: 'À attaquer ensuite', bg: C.blue, fg: C.white,
      icon: g => el('path', { d: 'M -8 0 H 7 M 1.5 -6 L 7.5 0 L 1.5 6', fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g),
    });
    fit(S.tagNext.tx, BIG.x + 160, 'étiquette ensuite', X0 + 8);
    // À gauche de la petite bulle : quelques semaines, puis la victoire
    S.tagWeeks = tag(D.svg, {
      x: TAG_B.right, cy: TAG_B.cy, align: 'right', label: 'quelques semaines', bg: C.white, fg: C.ink, stroke: CARD_LINE,
      icon: g => watch(g, 0, 1, C.blue),
    });
    S.tagWin = tag(D.svg, {
      x: TAG_B.right, cy: TAG_B.cy, align: 'right', label: 'Victoire visible', bg: C.pGreen, fg: C.tGreen, stroke: C.white,
      icon: g => checkDisc(g, 0, 0, 11, C.green),
    });
    [S.tagWeeks, S.tagWin].forEach((tg, i) => { fit(tg.tx, TAG_B.right, `étiquette petite bulle ${i + 1}`, XM + 12); });

    // L'équipe qui décroche
    S.speech = el('g');
    const st = text(S.speech, 0, 557, `«${NB}Ça ne marche pas ici${NB}»`, { size: 17, weight: 800, fill: C.tRed });
    const sw = 16 + 26 + 10 + st.getBBox().width + 20, sx0 = BIG.x + 8 - sw / 2;
    S.speechTip = [BIG.x - 4, BIG.y - BOX_A + 2];
    const sp = el('path', { d: calloutPath(sx0, 529, sw, 42, BIG.x - 14, S.speechTip[0], S.speechTip[1]), fill: C.white, stroke: C.red, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, S.speech);
    S.speech.insertBefore(sp, st);
    st.setAttribute('x', f2(sx0 + 16 + 26 + 10));
    const ax = sx0 + 16 + 13;
    el('circle', { cx: ax, cy: 550, r: 13, fill: C.red }, S.speech);
    el('circle', { cx: ax, cy: 546, r: 4.5, fill: C.white }, S.speech);
    el('path', { d: `M ${ax - 7.5} ${557} C ${ax - 7.5} ${550}, ${ax + 7.5} ${550}, ${ax + 7.5} ${557} Z`, fill: C.white }, S.speech);
    fit(sp, XM - 30, 'bulle de parole', X0 + 10);

    // ----- Jauge de confiance de l'équipe -----
    el('rect', { x: GAUGE.x, y: GAUGE.y, width: GAUGE.w, height: GAUGE.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    const gx = GAUGE.x + 32, gy = GAUGE.y + 31;
    el('circle', { cx: gx, cy: gy, r: 20, fill: C.pLav });
    [[-8.5, C.lightBlue, 3.8], [8.5, C.lightBlue, 3.8], [0, C.blue, 4.8]].forEach(([dx, col, hr]) => {
      el('circle', { cx: gx + dx, cy: gy - 5 + (dx ? 1 : 0), r: hr, fill: col });
      const w = dx ? 6.5 : 8;
      el('path', { d: `M ${gx + dx - w} ${gy + 11} C ${gx + dx - w} ${gy + 1}, ${gx + dx + w} ${gy + 1}, ${gx + dx + w} ${gy + 11} Z`, fill: col });
    });
    fit(text(D.svg, GAUGE.x + 62, GAUGE.y + 24, 'Confiance de l’équipe', { size: 15, weight: 700, fill: MUTED }), GAUGE.x + 240, 'jauge titre');
    S.barW = 168;
    el('rect', { x: GAUGE.x + 62, y: GAUGE.y + 34, width: S.barW, height: 13, rx: 6.5, fill: '#e6e6f2' });
    S.bar = el('rect', { x: GAUGE.x + 62, y: GAUGE.y + 34, width: 10, height: 13, rx: 6.5, fill: C.green });
    S.pct = text(D.svg, GAUGE.x + GAUGE.w - 16, GAUGE.y + 46, '', { size: 22, weight: 800, fill: C.tGreen, anchor: 'end' });

    // ----- Pastilles d'étape -----
    const STY = {
      blue: { bg: C.blue, fg: C.white },
      red: { bg: C.pRed, fg: C.tRed },
      undo: { bg: C.pLav, fg: C.blue, icon: 'undo' },
    };
    S.pills = PILLS.map(([, label, k], i) => {
      const g = pillShape(D.svg, 92, PILL_Y, label, STY[k]);
      fit(g, PILL_MAX, `pastille ${i + 1}`);
      return g;
    });

    // ----- Le viseur de sélection -----
    S.ping = el('path', { d: '', fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0 });
    S.reticle = el('g');
    S.retHalo = el('path', { d: '', fill: 'none', stroke: C.white, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85 }, S.reticle);
    S.ret = el('path', { d: '', fill: 'none', stroke: C.blue, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.reticle);
    S.retDot = el('g', {}, S.reticle);
    el('circle', { cx: 0, cy: 0, r: 7, fill: C.white, opacity: 0.85 }, S.retDot);
    el('circle', { cx: 0, cy: 0, r: 4, fill: C.blue }, S.retDot);

    D.encart(['Prioriser ses problèmes', 'Notre matrice de décision', '(lien en commentaire)']);
  }

  // ---------- Le viseur : position, taille, verrouillage ----------
  // Pendant un trajet, il quitte sa cible en se refermant, file petit, puis s'ouvre à la taille de la suivante.
  // Les trajets arrivent et repartent à l'horizontale ou par le dessous : les coins du viseur passent
  // au-dessus et au-dessous des libellés de la bulle, jamais dessus.
  function travelBox(p, h0, a0, h1, a1, sh, gr) {
    if (p < sh[1]) { const q = easeInOut(prog(p, sh[0], sh[1] - sh[0])); return [lerp(h0, BOX_FREE, q), lerp(a0, ARM_FREE, q)]; }
    if (p > gr[0]) { const q = easeOut(prog(p, gr[0], gr[1] - gr[0])); return [lerp(BOX_FREE, h1, q), lerp(ARM_FREE, a1, q)]; }
    return [BOX_FREE, ARM_FREE];
  }
  const W = [500, 690];                           // point d'approche de la grosse bulle au retour
  // Renvoie { x, y, h, a, o, col }
  function reticle(t, s, sA) {
    const A = [BIG.x, BIG.y], B = [SMALL.x, SMALL.y];
    const snap = (tt, tl) => 1 + 0.06 * bump(prog(tt, tl, 0.22));        // il claque en se verrouillant
    const travel = (pts, t0, t1, box0, arm0, box1, arm1, sh, gr) => {
      const p = easeInOut(prog(s, t0, t1 - t0));
      const [x, y] = bez3(...pts, p);
      const [h, a] = travelBox(p, box0, arm0, box1, arm1, sh, gr);
      return { x, y, h, a, o: 1, col: C.blue };
    };
    if (t < T_OUT + OUT) {                        // image finale : verrouillé sur la grosse bulle, puis il s'efface
      const p = prog(t, T_OUT, OUT);
      return { x: A[0], y: A[1], h: BOX_A + 18 * easeIn(p), a: ARM_A, o: 1 - p, col: C.blue };
    }
    if (s < T_CA0) return { x: ENTRY[0], y: ENTRY[1], h: BOX_FREE, a: ARM_FREE, o: 0, col: C.blue };
    if (s < T_LOCK_A) {                           // arrive par la droite, déjà ouvert
      const r = travel([ENTRY, [900, 760], [640, 700], A], T_CA0, T_LOCK_A, BOX_FREE, ARM_FREE, BOX_A, ARM_A, [0, 0], [0.55, 0.8]);
      return { ...r, o: clamp((s - T_CA0) / 0.15) };
    }
    if (s < T_CB0) {                              // sur la grosse bulle : le temps de l'histoire A pilote la couleur
      const k = snap(sA, T_LOCK_A);
      return { x: A[0], y: A[1], h: BOX_A * k, a: ARM_A, o: 1, col: mix(C.blue, C.red, easeInOut(prog(sA, T_TIMER0, TDUR))) };
    }
    if (s < T_LOCK_B) return travel([A, [560, 700], [700, 540], B], T_CB0, T_LOCK_B, BOX_A, ARM_A, BOX_B, ARM_B, [0.28, 0.48], [0.78, 1]);
    if (s < T_C0) return { x: B[0], y: B[1], h: BOX_B * snap(s, T_LOCK_B), a: ARM_B, o: 1, col: C.blue };
    if (s < T_CW) return travel([B, [880, 480], [520, 480], W], T_C0, T_CW, BOX_B, ARM_B, BOX_FREE, ARM_FREE, [0, 0.25], [1, 1]);
    if (s < T_LOCK_C) return travel([W, [440, 692], [380, 698], A], T_CW, T_LOCK_C, BOX_FREE, ARM_FREE, BOX_A, ARM_A, [0, 0], [0, 0.4]);
    return { x: A[0], y: A[1], h: BOX_A * snap(s, T_LOCK_C), a: ARM_A, o: 1, col: C.blue };
  }

  // ---------- Jauge de confiance ----------
  function confidence(t, s, sA) {
    if (t < T_OUT) return 85;
    if (t < T_OUT + 0.6) return lerp(85, 50, easeInOut(prog(t, T_OUT, 0.6)));
    return 50 - 35 * easeInOut(prog(sA, T_TIMER0, TDUR)) + 35 * easeInOut(prog(s, T_RISE0, T_RISE1 - T_RISE0));
  }
  const gaugeColor = v => (v < 50 ? mix(C.red, C.yellow, (v - 15) / 35) : mix(C.yellow, C.green, (v - 50) / 35));
  const gaugeInk = v => (v < 50 ? mix(C.tRed, C.tYellow, (v - 15) / 35) : mix(C.tYellow, C.tGreen, (v - 50) / 35));

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT;
    const fade = final ? 1 - prog(t, T_OUT, OUT) : 1;
    const s = final ? END : t;
    const sA = storyA(s);

    // Bulles : se dégonflent à la fin de l'image finale, se regonflent une à une (ressort)
    const relA = prog(s, T_CB0 + 0.05, 0.3);            // le viseur quitte la grosse bulle : elle se désélectionne
    const dimA = prog(sA, T_LOCK_A, 0.2) * (1 - relA), dimB = prog(s, T_LOCK_B, 0.3);
    const bigBack = prog(s, T_LOCK_C - 0.1, 0.3);
    const selA = prog(sA, T_LOCK_A, 0.2) * (1 - relA);
    const red = easeInOut(prog(sA, T_TIMER0, TDUR));
    const win = prog(s, T_WIN, 0.25);
    S.order.forEach((b, i) => {
      let k = final ? 1 - easeIn(prog(t, T_OUT, OUT)) : spring(prog(t, T_INF + i * INF_STEP, INF_DUR));
      let o;
      if (b === S.big) {
        // Il encaisse chaque badge (petite secousse), et le verrouillage
        T_BADGE.forEach(tb => { k *= 1 + 0.045 * bump(prog(sA, tb + 0.12, 0.5)); });
        k *= 1 - 0.035 * bump(prog(sA, T_LOCK_A, 0.2));
        k *= 1 - 0.03 * bump(prog(s, T_LOCK_C, 0.45));
        o = 1 - 0.5 * dimB * (1 - bigBack);
        const next = 0.16 * bigBack;
        b.c.setAttribute('fill', mix(mix(mix(LAV, C.blue, next), C.blue, selA), C.red, red));
        b.c.setAttribute('stroke', mix(mix(mix(LAV_LINE, C.blue, 2 * next), C.blue, selA), C.red, red));
        const lc = mix(C.blue, C.white, clamp((selA - 0.3) / 0.12));
        S.bigLabels.forEach(n => n.setAttribute('fill', lc));
      } else if (b === S.small) {
        k *= 1 - 0.06 * bump(prog(s, T_LOCK_B, 0.45));
        k *= 1 + 0.12 * bump(prog(s, T_WIN, 0.55));
        o = 1 - 0.5 * dimA;
        const selB = prog(s, T_LOCK_B, 0.2);
        b.c.setAttribute('fill', mix(mix(LAV, C.blue, selB), C.green, win));
        b.c.setAttribute('stroke', mix(mix(LAV_LINE, C.blue, selB), C.green, win));
        const pc = prog(s, T_WIN + 0.08, 0.35);
        S.smallCheck.setAttribute('opacity', f2(clamp(pc / 0.3)));
        S.smallCheck.setAttribute('transform', `scale(${k3(popScale(pc))})`);
      } else o = 1 - 0.42 * Math.max(dimA, dimB);
      b.g.setAttribute('transform', `translate(${b.x} ${b.y}) scale(${k3(k)})`);
      b.g.setAttribute('opacity', f2(o * (k < 0.02 ? 0 : 1)));
    });

    // Badges de difficulté : la tige se tend, le badge s'accroche (et tout se décroche au retour en arrière)
    S.badges.forEach((b, i) => {
      const ps = prog(sA, T_BADGE[i], 0.14);
      b.stem.setAttribute('stroke-dashoffset', f2(b.len * (1 - ps)));
      b.stem.setAttribute('opacity', ps > 0 ? 1 : 0);
      const pb = prog(sA, T_BADGE[i] + 0.1, 0.32);
      b.g.setAttribute('opacity', f2(clamp(pb / 0.3)));
      b.g.setAttribute('transform', about(b.ex, b.ey, popScale(pb)));
    });

    // Jauge des trois mois : l'anneau tourne sans jamais se fermer, puis s'arrête en rouge
    const pT = prog(sA, T_TIMER0, TDUR);
    const tOn = prog(sA, T_TIMER0, 0.25);
    S.trackA.setAttribute('opacity', f2(tOn));
    S.trackA.setAttribute('stroke', mix(TRACK, C.pRed, red));
    S.arcA.setAttribute('opacity', f2(tOn));
    S.arcA.setAttribute('stroke', mix(C.blue, C.red, red));
    S.arcA.setAttribute('transform', `rotate(${f2(-90 + 3 * 360 * easeInOut(pT))} ${BIG.x} ${BIG.y})`);
    // Compteur des mois (roule d'un cran à chaque mois)
    const m = pT < 1 / 3 ? 1 : pT < 2 / 3 ? 2 : 3;
    const tm = T_TIMER0 + TDUR * (m - 1) / 3;
    const roll = m > 1 ? easeOut(prog(sA, tm, 0.22)) : 1;
    S.mCur.textContent = `${m}${NB}mois`;
    S.mPrev.textContent = `${m - 1}${NB}mois`;
    S.mCur.setAttribute('transform', roll < 1 ? `translate(0 ${f2(20 * (1 - roll))})` : '');
    S.mPrev.setAttribute('transform', `translate(0 ${f2(-20 * roll)})`);
    S.mPrev.setAttribute('opacity', m > 1 && roll < 1 ? 1 : 0);
    const cw = lerp(S.mW[m - 1], S.mW[m], m > 1 ? roll : 1);
    S.rest.setAttribute('x', f2(S.xA + 46 + cw + 6));
    S.ra.setAttribute('width', f2(46 + cw + 6 + S.rw + 16));
    S.handA.setAttribute('transform', `rotate(${f2(3 * 360 * easeInOut(pT))} ${S.handA.getAttribute('x1')} ${S.handA.getAttribute('y1')})`);
    const pa = prog(sA, T_TIMER0, 0.3);
    S.tagA.setAttribute('opacity', f2(clamp(pa / 0.3)));
    S.tagA.setAttribute('transform', about(S.tagAc[0], S.tagAc[1], popScale(pa)));

    // L'équipe décroche
    const psp = prog(sA, T_SPEECH, 0.35);
    S.speech.setAttribute('opacity', f2(clamp(psp / 0.3)));
    S.speech.setAttribute('transform', about(S.speechTip[0], S.speechTip[1], popScale(psp)));

    // Le bon quadrant s'allume quand le viseur y entre
    const tint = final ? 1 : prog(s, T_TINT, 0.35);
    S.tint.setAttribute('opacity', f2(tint * fade));
    S.zone.setAttribute('stroke-opacity', f2((0.45 + 0.55 * tint * fade) * (1 - 0.75 * dimA)));
    S.chk.setAttribute('opacity', f2(tint * fade));
    S.rows.forEach((r, i) => {
      const p = final ? 1 : prog(s, T_CHECK[i], 0.3);
      r.on.setAttribute('opacity', f2(clamp(p / 0.25)));
      r.on.setAttribute('transform', about(CHK.x + 11, r.cy, popScale(p)));
      r.mark.setAttribute('stroke-dashoffset', f2(22 * (1 - easeOut(prog(s, T_CHECK[i] + 0.08, 0.22)))));
      const dx = final ? 0 : 10 * (1 - easeOut(prog(s, T_TINT + 0.08 * i, 0.35)));
      r.g.setAttribute('transform', dx ? `translate(${f2(dx)} 0)` : '');
    });

    // Anneau de la petite bulle : il se ferme en quelques semaines
    const ring = prog(s, T_RING0, T_WIN - T_RING0);
    const rOn = prog(s, T_RING0, 0.2) * fade;
    S.trackB.setAttribute('opacity', f2(rOn));
    S.arcB.setAttribute('opacity', f2(rOn));
    S.arcB.setAttribute('stroke-dashoffset', f2(S.circB * (1 - easeInOut(ring))));
    S.rays.forEach(({ a, n }) => {
      const p = final ? 1 : prog(s, T_WIN, 0.55);
      const r0 = 48 + 12 * easeOut(p), r1 = r0 + 13 * (1 - p) + 2;
      n.setAttribute('x1', f2(SMALL.x + r0 * Math.cos(a))); n.setAttribute('y1', f2(SMALL.y + r0 * Math.sin(a)));
      n.setAttribute('x2', f2(SMALL.x + r1 * Math.cos(a))); n.setAttribute('y2', f2(SMALL.y + r1 * Math.sin(a)));
      n.setAttribute('opacity', p > 0 && p < 1 ? f2(1 - p) : 0);
    });
    // Étiquettes de la petite bulle : « quelques semaines » sort, « victoire visible » entre
    const pw = prog(s, T_RING0, 0.3), pwo = prog(s, T_WIN, 0.14);
    S.tagWeeks.g.setAttribute('opacity', f2(clamp(pw / 0.3) * (1 - pwo)));
    S.tagWeeks.g.setAttribute('transform', about(TAG_B.right, TAG_B.cy, popScale(pw)));
    S.tagWeeks.extra.setAttribute('transform', `rotate(${f2(720 * ring)} 0 1)`);
    const pv = final ? 1 : prog(s, T_WIN + 0.16, 0.35);
    S.tagWin.g.setAttribute('opacity', f2(clamp(pv / 0.3) * fade));
    S.tagWin.g.setAttribute('transform', about(TAG_B.right, TAG_B.cy, popScale(pv)));

    // Grosse bulle, à la fin : « à attaquer ensuite »
    const pn = final ? 1 : prog(s, T_LOCK_C + 0.22, 0.35);
    S.tagNext.g.setAttribute('opacity', f2(clamp(pn / 0.3) * fade));
    S.tagNext.g.setAttribute('transform', about(S.tagNext.cx, S.tagNext.cy, popScale(pn)));

    // Jauge de confiance de l'équipe
    const v = confidence(t, s, sA);
    S.bar.setAttribute('width', f2(Math.max(13, S.barW * v / 100)));
    S.bar.setAttribute('fill', gaugeColor(v));
    S.pct.textContent = `${Math.round(v)}${NB}%`;
    S.pct.setAttribute('fill', gaugeInk(v));

    // Le viseur
    const R = reticle(t, s, sA);
    S.ret.setAttribute('d', bracketPath(R.x, R.y, R.h, R.a));
    S.retHalo.setAttribute('d', bracketPath(R.x, R.y, R.h, R.a));
    S.ret.setAttribute('stroke', R.col);
    S.reticle.setAttribute('opacity', f2(R.o));
    const dot = 1 - clamp((R.h - BOX_FREE) / 14);
    S.retDot.setAttribute('transform', `translate(${f2(R.x)} ${f2(R.y)}) scale(${k3(dot)})`);
    S.retDot.setAttribute('opacity', f2(dot));
    // Onde du verrouillage : un second viseur qui s'écarte et s'efface
    let po = 0;
    [[s, T_LOCK_A, BIG, BOX_A, ARM_A], [s, T_LOCK_B, SMALL, BOX_B, ARM_B], [s, T_LOCK_C, BIG, BOX_A, ARM_A]].forEach(([tt, tl, b, box, arm]) => {
      const p = prog(tt, tl + 0.08, 0.45);
      if (!final && p > 0 && p < 1) {
        po = 0.7 * (1 - p);
        S.ping.setAttribute('d', bracketPath(b.x, b.y, box + 26 * easeOut(p), arm));
      }
    });
    S.ping.setAttribute('opacity', f2(po));
    S.ping.setAttribute('stroke', R.col);

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.12 : 0);
      const b = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      const last = i === PILLS.length - 1;
      const o = final ? (last ? fade : 0) : prog(t, a, 0.25) * (1 - prog(t, b, 0.14));
      const dy = final ? 0 : 8 * (1 - prog(t, a, 0.25));
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
