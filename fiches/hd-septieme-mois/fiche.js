// Fiche LinkedIn · Hugo Duc · vendredi 23 octobre 2026
// Post : « Pourquoi autant de démarches Lean s'essoufflent au bout de 6 mois ? … je la construirais pour le septième. »
// Premier commentaire du post (Buffer) : toutes les ressources Lean du site → encart.
// Le visuel est la pièce maîtresse : la courbe d'énergie de la démarche sur 12 mois, en aires empilées,
// qui se trace en direct derrière un curseur. En bas, la base (ce que l'organisation a construit) ; au-dessus,
// hachurées, trois couches d'énergie empruntée : le pilote Lean ou le consultant, le sponsor, la nouveauté.
// Aux 5e, 6e et 7e mois, elles sont rendues une à une et la courbe s'effondre sur une base très fine.
// On rembobine (la première course reste en fantôme pointillé), les cinq points du post épaississent la base
// un par un, puis on rejoue : l'énergie empruntée part au même moment, et cette fois la courbe tient.
// Style propre : la courbe qui se trace en direct (curseur, compteur de mois qui roule, rembobinage, fantôme).
// L'image t = 0 est l'état final (PNG). Boucle exacte de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const smooth = p => p * p * (3 - 2 * p);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const win = (t, a, b, fin = 0.25, fout = 0.2) => prog(t, a, fin) * (1 - prog(t, b, fout));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', COL_BG = '#ebebf6', COL_HI = '#dcdcf0';

  // Trajectoire du curseur : interpolation monotone (il accélère et ralentit sans à-coup, sans reculer)
  function track(keys) {
    const n = keys.length, T = keys.map(k => k[0]), V = keys.map(k => k[1]);
    const d = [];
    for (let i = 0; i < n - 1; i++) d.push((V[i + 1] - V[i]) / (T[i + 1] - T[i]));
    const g = V.map((_, i) => (i === 0 || i === n - 1 || d[i - 1] * d[i] <= 0 ? 0 : 2 / (1 / d[i - 1] + 1 / d[i])));
    const f = t => {
      if (t <= T[0]) return V[0];
      if (t >= T[n - 1]) return V[n - 1];
      let i = 0;
      while (t >= T[i + 1]) i++;
      const h = T[i + 1] - T[i], s = (t - T[i]) / h, s2 = s * s, s3 = s2 * s;
      return (2 * s3 - 3 * s2 + 1) * V[i] + (s3 - 2 * s2 + s) * h * g[i] + (-2 * s3 + 3 * s2) * V[i + 1] + (s3 - s2) * h * g[i + 1];
    };
    f.at = v => { let a = T[0], b = T[n - 1]; for (let k = 0; k < 40; k++) { const c = (a + b) / 2; if (f(c) < v) a = c; else b = c; } return (a + b) / 2; };
    return f;
  }

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const PY = FRAME.y + 46;                         // rangée des pastilles et du compteur
  const X0 = 120, X1 = 984, PXM = (X1 - X0) / 12;  // 12 mois
  const AXIS = 1030, PXU = 5;                      // sol du graphique, px par unité d'énergie
  const xOf = m => X0 + m * PXM;
  const yOf = u => AXIS - u * PXU;
  const COL_TOP = 526, CUR_TOP = 572;

  // ---------- Données : énergie de la démarche (unités arbitraires) ----------
  const SOCLE = 5, BAND = 8;                       // base fine du premier essai ; cinq points de 8 chacun
  const fall = (m, a) => 1 - smooth(clamp((m - a) / 0.7));
  // Du bas vers le haut. end : mois où la couche est entièrement rendue.
  const LAYERS = [
    { key: 'pilote', label: 'Pilote Lean ou consultant', v: m => 16 * fall(m, 5.3), end: 6.0,
      bg: '#f1e7f3', stripe: C.violet, ink: '#6e4277', lm: 2.45,
      chip: 'L’accompagnement se termine', cu: 31 },
    { key: 'sponsor', label: 'Sponsor', v: m => 15 * fall(m, 4.4), end: 5.1,
      bg: C.pYellow, stripe: C.yellow, ink: C.tYellow, lm: 2.45,
      chip: 'Le sponsor passe à un autre sujet', cu: 46 },
    { key: 'nouveaute', label: 'Nouveauté', v: m => (10 + 4 * smooth(clamp(m / 0.8)) - 6 * smooth(clamp((m - 1.2) / 5))) * fall(m, 6.1), end: 6.8,
      bg: '#e2f1f1', stripe: C.teal, ink: '#2c6a6c', lm: 2.1,
      chip: 'La nouveauté n’en est plus une', cu: 16 },
  ];
  const STEP = 0.05, NS = Math.round(12 / STEP) + 1;
  const MS = Array.from({ length: NS }, (_, i) => i * STEP);
  const borrowed = m => LAYERS.reduce((a, L) => a + L.v(m), 0);

  const BAND_FILL = ['#4a4aa0', '#5258aa', '#5a66b4', '#6274bd', '#6a82c6'];
  const SOCLE_FILL = '#363681';
  const POINTS = [
    'Les managers animent',
    'Moins de chantiers, au standard',
    'Indicateurs utiles à l’équipe',
    'Règle de relance des routines',
    'Destination du temps libéré',
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2, OUT_DUR = 0.3, T_A = 1.5;          // l'image finale s'efface, le premier essai commence
  const mA = track([[1.65, 0], [2.65, 4.2], [4.5, 7.0], [5.25, 12]]);   // pensée pour le premier mois
  const T_HOLD = 5.25, T_RW = 6.6, RW_END = 7.05;       // constat, puis rembobinage
  const mR = track([[T_RW, 12], [RW_END, 0]]);
  const T_BAND = k => 7.12 + 0.32 * k, BAND_DUR = 0.42, CPS = 75;
  const B0 = 9.0, T_END = 10.95;
  const mB = track([[B0, 0], [9.6, 4.2], [10.5, 7.0], [T_END, 12]]);   // construite pour le septième
  LAYERS.forEach(L => { L.tA = mA.at(L.end); L.tB = mB.at(L.end); });
  const NOUV = LAYERS[2];
  const T_P2 = mA.at(4.4), T_P5 = NOUV.tB;
  const PILLS = [
    { label: `1${NB}·${NB}Pensée pour le premier mois`, a: T_A, b: T_P2 },
    { label: `2${NB}·${NB}L’énergie empruntée est rendue`, a: T_P2, b: T_HOLD + 0.05 },
    { label: 'L’essoufflement révèle ce qui manquait', kind: 'alert', a: T_HOLD + 0.05, b: T_RW },
    { label: `3${NB}·${NB}Construite pour le septième mois`, a: T_RW, b: T_P5 },
    { label: 'Au septième mois, la courbe tient', kind: 'ok', a: T_P5, b: Infinity },
  ];

  const mAt = t => {
    if (t < T_A) return 12;                 // état final
    if (t < T_HOLD) return mA(t);
    if (t < T_RW) return 12;
    if (t < RW_END) return mR(t);
    if (t < T_END) return mB(t);
    return 12;
  };
  const actOf = t => (t < T_A ? 'F' : t < T_RW ? 'A' : t < RW_END ? 'R' : 'B');
  const monthIdx = m => Math.min(12, Math.floor(m + 1e-9) + 1);

  // ---------- Petits éléments ----------
  const halo = (n, color, w = 6) => { [['stroke', color], ['stroke-width', w], ['stroke-linejoin', 'round'], ['paint-order', 'stroke']].forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  function pillShape(parent, x, cy, label, { bg, fg, icon, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon === 'ok') {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.green }, g);
      el('path', { d: `M ${x + 25.5} ${cy + 0.5} L ${x + 29.5} ${cy + 4.5} L ${x + 36.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    } else if (icon === 'alert') {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.red }, g);
      text(g, x + 31, cy + 6.5, '!', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
    }
    return g;
  }
  // Pastille « rendue » : la phrase du post, avec une flèche de retour à la couleur de la couche
  function chipShape(parent, x, cy, label, color) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - 17, height: 34, rx: 17, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
    const cx = x + 19;
    el('circle', { cx, cy, r: 11, fill: color }, g);
    el('path', { d: `M ${cx + 5} ${cy + 5} V ${cy + 0.5} Q ${cx + 5} ${cy - 4} ${cx + 0.5} ${cy - 4} H ${cx - 5} M ${cx - 1.5} ${cy - 7.5} L ${cx - 5.2} ${cy - 4} L ${cx - 1.5} ${cy - 0.5}`, fill: 'none', stroke: C.white, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const tx = text(g, x + 38, cy + 5.8, label, { size: 16, weight: 700, fill: C.ink });
    r.setAttribute('width', tx.getBBox().width + 54);
    return g;
  }
  // Texte tapé : affiche les n premiers caractères
  function typed(parent, x, y, str, opts) {
    const n = text(parent, x, y, str, opts);
    n.full = str;
    n.show = k => { n.textContent = str.slice(0, Math.max(0, Math.min(str.length, k))); };
    return n;
  }
  // Polyligne (sous-chemins coupés là où keep est faux)
  function polyline(pts, keep = () => true) {
    let d = '', on = false;
    pts.forEach(([x, y], i) => {
      if (!keep(i)) { on = false; return; }
      d += `${on ? 'L' : 'M'} ${f2(x)} ${f2(y)} `;
      on = true;
    });
    return d.trim();
  }

  const S = {};

  function build() {
    D.template({ author: 'hugo' });
    D.title('Le Lean se joue', 'au septième mois.');
    D.chapeau('Une démarche se prépare pour le jour où plus personne ne la pousse.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['En hachuré, l’', 0], ['énergie empruntée', C.blue], ['. En bleu plein, ce que l’organisation a ', 0], ['construit', C.blue], ['.', 0]]);
    line(384, [['Quand l’énergie empruntée est ', 0], ['rendue', C.tRed], [', la courbe ne tient que sur sa ', 0], ['base', C.blue], ['.', 0]]);

    const defs = el('defs');
    LAYERS.forEach(L => {
      const p = el('pattern', { id: `hatch-${L.key}`, patternUnits: 'userSpaceOnUse', width: 12, height: 12, patternTransform: 'rotate(45)' }, defs);
      el('rect', { x: 0, y: 0, width: 12, height: 12, fill: L.bg }, p);
      el('rect', { x: 0, y: 0, width: 4.5, height: 12, fill: L.stripe, 'fill-opacity': 0.42 }, p);
    });
    const clip = id => el('rect', { x: X0 - 2, y: FRAME.y, width: 0, height: FRAME.h }, el('clipPath', { id }, defs));
    S.liveClip = clip('live');
    S.socleClip = clip('socle');
    S.ghostClip = clip('ghost');

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // Colonne du septième mois (fond)
    el('rect', { x: xOf(6), y: COL_TOP, width: PXM, height: AXIS - COL_TOP, rx: 12, fill: COL_BG });
    S.colHi = el('rect', { x: xOf(6), y: COL_TOP, width: PXM, height: AXIS - COL_TOP, rx: 12, fill: COL_HI, opacity: 0 });
    const cl = el('text', { x: xOf(6.5), y: COL_TOP + 24, 'font-family': 'Poppins', 'font-size': 16, 'font-weight': 800, fill: C.blue, 'text-anchor': 'middle' });
    [['7', {}], ['e', { 'font-size': 11, dy: -6 }], [`${NB}mois`, { dy: 6 }]].forEach(([s, a]) => { const sp = el('tspan', a, cl); sp.textContent = s; });
    fit(cl, xOf(7) - 4, 'repère septième mois', xOf(6) + 4);

    // ----- Courbe -----
    S.content = el('g');
    const socleG = el('g', { 'clip-path': 'url(#socle)' }, S.content);
    el('rect', { x: X0, y: yOf(SOCLE) + 1, width: X1 - X0, height: SOCLE * PXU - 1, fill: SOCLE_FILL }, socleG);
    S.bands = BAND_FILL.map(fill => ({ rect: el('rect', { x: X0, y: 0, width: X1 - X0, height: 0, fill }, S.content) }));

    // Fantôme : le premier essai, en pointillés
    const ghostG = el('g', { 'clip-path': 'url(#ghost)' }, S.content);
    S.ghost = el('path', { d: polyline(MS.map(m => [xOf(m), yOf(SOCLE + borrowed(m))])), fill: 'none', stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '8 7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ghostG);

    // Énergie empruntée (chemins relatifs à la base, translatés selon son épaisseur)
    const liveG = el('g', { 'clip-path': 'url(#live)' }, S.content);
    S.live = el('g', {}, liveG);
    const cum = MS.map(() => 0);
    const tops = [];
    LAYERS.forEach(L => {
      const lo = cum.slice(), hi = MS.map((m, i) => cum[i] + L.v(m));
      let last = 0;
      MS.forEach((m, i) => { if (hi[i] - lo[i] > 1e-3) last = i; });
      const n = Math.min(NS - 1, last + 1);
      const up = [], dn = [];
      for (let i = 0; i <= n; i++) { up.push(`${f2(xOf(MS[i]))} ${f2(-hi[i] * PXU)}`); dn.push(`${f2(xOf(MS[i]))} ${f2(-lo[i] * PXU)}`); }
      el('path', { d: `M ${up.join(' L ')} L ${dn.reverse().join(' L ')} Z`, fill: `url(#hatch-${L.key})` }, S.live);
      tops.push({ L, hi, lo });
      MS.forEach((_, i) => { cum[i] = hi[i]; });
    });
    tops.slice(0, 2).forEach(({ L, hi, lo }) => el('path', {
      d: polyline(MS.map((m, i) => [xOf(m), -hi[i] * PXU]), i => hi[i] - lo[i] > 0.05),
      fill: 'none', stroke: L.stripe, 'stroke-width': 2.5, 'stroke-linejoin': 'round',
    }, S.live));
    el('path', { d: polyline(MS.map((m, i) => [xOf(m), -cum[i] * PXU])), fill: 'none', stroke: C.ink, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, S.live);

    // Noms des couches empruntées (dans la couche, révélés au passage du curseur)
    S.layerLabels = el('g', {}, S.content);
    S.labels = tops.map(({ L, hi, lo }) => {
      const i = Math.round(L.lm / STEP);
      const n = halo(text(S.layerLabels, xOf(L.lm), -(hi[i] + lo[i]) / 2 * PXU + 6, L.label, { size: 17, weight: 800, fill: L.ink, anchor: 'middle' }), L.bg, 7);
      const b = n.getBBox();
      fit(n, X1 - 8, `couche ${L.key}`, X0 + 8);
      return { n, mEnd: (b.x + b.width - X0) / PXM };
    });

    // Les cinq points : étiquettes tapées dans les bandes
    const LX = xOf(7.35);
    S.bands.forEach((b, k) => {
      const g = el('g', {}, S.content);
      const badge = el('g', {}, g);
      el('circle', { cx: 0, cy: 0, r: 12, fill: C.white }, badge);
      text(badge, 0, 5.5, String(k + 1), { size: 15, weight: 800, fill: BAND_FILL[k], anchor: 'middle' });
      b.badge = badge;
      b.lab = typed(g, LX + 22, 6, POINTS[k], { size: 16, weight: 700, fill: C.white });
      b.caret = el('rect', { x: 0, y: -10, width: 2.5, height: 19, rx: 1, fill: C.white, opacity: 0 }, g);
      b.g = g;
      fit(b.lab, X1 - 8, `point ${k + 1}`);
      b.lx = LX;
    });

    // ----- Axes -----
    el('line', { x1: X0, y1: AXIS, x2: X1 + 4, y2: AXIS, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });
    el('path', { d: `M ${X0} ${AXIS} V ${CUR_TOP - 30} M ${X0 - 6} ${CUR_TOP - 22} L ${X0} ${CUR_TOP - 30} L ${X0 + 6} ${CUR_TOP - 22}`, fill: 'none', stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    fit(text(D.svg, X0 + 16, CUR_TOP - 22, 'Énergie de la démarche', { size: 16, weight: 700, fill: MUTED }), xOf(5.5), 'axe énergie');
    for (let k = 1; k <= 12; k++) {
      const hot = k === 7;
      text(D.svg, xOf(k - 0.5), AXIS + 30, String(k), { size: 17, weight: hot ? 800 : 500, fill: hot ? C.blue : MUTED, anchor: 'middle' });
    }
    text(D.svg, X0 - 10, AXIS + 30, 'Mois', { size: 16, weight: 700, fill: MUTED, anchor: 'end' });

    // Légende
    const leg = el('g');
    const LY = AXIS + 78;
    let lx = 0;
    const legText = s => { const t = text(leg, lx, LY + 6, s, { size: 17, weight: 500, fill: C.ink }); lx += t.getBBox().width; };
    LAYERS.forEach((L, i) => el('rect', { x: lx + i * 11, y: LY - 10, width: 11, height: 20, fill: `url(#hatch-${L.key})` }, leg));
    el('rect', { x: 0, y: LY - 10, width: 33, height: 20, rx: 5, fill: 'none', stroke: CARD_LINE, 'stroke-width': 1.5 }, leg);
    lx += 43; legText('Énergie empruntée'); lx += 34;
    el('rect', { x: lx, y: LY - 10, width: 33, height: 20, rx: 5, fill: BAND_FILL[0] }, leg);
    lx += 43; legText('Ce que l’organisation construit'); lx += 34;
    el('line', { x1: lx + 2, y1: LY, x2: lx + 34, y2: LY, stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '8 7', 'stroke-linecap': 'round' }, leg);
    lx += 44; legText('Pensée pour le premier mois');
    leg.setAttribute('transform', `translate(${f2(540 - lx / 2)} 0)`);
    if (lx > 900) console.error(`Débordement : légende (${Math.round(lx)} px)`);

    // ----- Curseur (sous les pastilles ; les points de mesure passent au-dessus) -----
    S.cursor = el('g', { opacity: 0 });
    el('line', { x1: 0, y1: CUR_TOP, x2: 0, y2: AXIS, stroke: C.ink, 'stroke-width': 2, 'stroke-opacity': 0.55 }, S.cursor);
    S.curTip = el('path', { d: `M -7 ${CUR_TOP - 9} H 7 L 0 ${CUR_TOP} Z`, fill: C.ink, 'stroke-linejoin': 'round' }, S.cursor);
    // Pendant le rembobinage : badge « retour rapide » sur le curseur
    S.rw = el('g', { opacity: 0 }, S.cursor);
    el('rect', { x: -21, y: CUR_TOP + 6, width: 42, height: 24, rx: 12, fill: C.ink }, S.rw);
    [-1, 9].forEach(dx => el('path', { d: `M ${dx - 9} ${CUR_TOP + 18} L ${dx} ${CUR_TOP + 12} V ${CUR_TOP + 24} Z`, fill: C.white, 'stroke-linejoin': 'round' }, S.rw));

    // ----- Premier essai : pastilles « rendue », constat -----
    S.chips = LAYERS.map(L => {
      const x = xOf(L.end + 0.08), cy = yOf(L.cu);
      const g = chipShape(D.svg, x, cy, L.chip, L.stripe);
      fit(g, X1 - 40, `pastille rendue ${L.key}`);
      return { g, x, cy, L };
    });
    S.pulse = el('rect', { x: X0 - 3, y: yOf(SOCLE) - 3, width: X1 - X0 + 6, height: SOCLE * PXU + 4, rx: 6, fill: 'none', stroke: C.red, 'stroke-width': 3, opacity: 0 });
    S.hold = el('g', { opacity: 0 });
    const hx = X1 - 4;
    const h1 = text(S.hold, hx, 706, 'Ce que l’organisation', { size: 19, weight: 800, fill: C.blue, anchor: 'end' });
    const h2 = text(S.hold, hx, 731, 'a réellement construit', { size: 19, weight: 800, fill: C.blue, anchor: 'end' });
    [h1, h2].forEach((n, i) => fit(n, X1, `constat ${i + 1}`, xOf(7.6)));
    const AX = X1 - 22, AL = yOf(SOCLE) - 8 - 748;
    S.arrow = el('path', { d: `M ${AX} 748 V ${yOf(SOCLE) - 8}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': AL + 4, 'stroke-dashoffset': AL + 4 }, S.hold);
    S.arrowHead = el('path', { d: `M ${AX - 7} ${yOf(SOCLE) - 17} L ${AX} ${yOf(SOCLE) - 8} L ${AX + 7} ${yOf(SOCLE) - 17}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, S.hold);
    S.arrowLen = AL + 4;

    // Points de mesure
    S.ring = el('circle', { cx: 0, cy: 0, r: 8, fill: 'none', 'stroke-width': 3, opacity: 0 });
    S.baseDot = el('circle', { cx: 0, cy: 0, r: 6, fill: C.white, stroke: SOCLE_FILL, 'stroke-width': 3, opacity: 0 });
    S.dot = el('circle', { cx: 0, cy: 0, r: 8, fill: C.white, stroke: C.ink, 'stroke-width': 3.5, opacity: 0 });

    // ----- Compteur de mois -----
    const CN = { x: 832, y: PY - 29, w: 156, h: 58 };
    el('rect', { x: CN.x, y: CN.y, width: CN.w, height: CN.h, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    const icx = CN.x + 30, icy = PY;
    el('circle', { cx: icx, cy: icy, r: 17, fill: C.blue });
    el('rect', { x: icx - 9, y: icy - 6, width: 18, height: 15, rx: 3, fill: C.white });
    el('rect', { x: icx - 9, y: icy - 6, width: 18, height: 4.5, rx: 1.5, fill: C.lightBlue });
    [-5, 0, 5].forEach(dx => [2, 6].forEach(dy => el('rect', { x: icx + dx - 1.6, y: icy + dy - 1.6, width: 3.2, height: 3.2, rx: 0.8, fill: C.blue })));
    [-4.5, 4.5].forEach(dx => el('line', { x1: icx + dx, y1: icy - 10, x2: icx + dx, y2: icy - 5, stroke: C.white, 'stroke-width': 2.4, 'stroke-linecap': 'round' }));
    text(D.svg, CN.x + 56, CN.y + 22, 'Mois', { size: 14, weight: 700, fill: MUTED });
    const cp = el('clipPath', { id: 'digits' }, defs);
    el('rect', { x: CN.x + 54, y: CN.y + 26, width: 46, height: 28 }, cp);
    const dg = el('g', { 'clip-path': 'url(#digits)' });
    S.numA = text(dg, CN.x + 94, CN.y + 49, '12', { size: 24, weight: 800, fill: C.ink, anchor: 'end' });
    S.numB = text(dg, CN.x + 94, CN.y + 49, '12', { size: 24, weight: 800, fill: C.ink, anchor: 'end' });
    S.numY = CN.y + 49;
    fit(text(D.svg, CN.x + 100, CN.y + 49, `/${NB}12`, { size: 17, weight: 700, fill: MUTED }), CN.x + CN.w - 8, 'compteur');

    // ----- Pastilles d'étape -----
    S.pills = PILLS.map(p => {
      const style = p.kind === 'ok' ? { bg: C.pGreen, fg: C.tGreen, icon: 'ok' } : p.kind === 'alert' ? { bg: C.pRed, fg: C.tRed, icon: 'alert' } : { bg: C.blue, fg: C.white };
      const g = pillShape(D.svg, 92, PY, p.label, style);
      fit(g, CN.x - 16, `pastille ${p.label}`);
      return g;
    });

    D.encart(['Aller plus loin', 'Toutes nos ressources Lean', '(lien en commentaire)']);
  }

  // Compteur qui roule : on cherche le dernier changement de mois dans les 0,14 s écoulées
  const ROLL = 0.14;
  function counter(t) {
    const n = monthIdx(mAt(t));
    for (let k = 1; k <= 14; k++) {
      const np = monthIdx(mAt(t - k * 0.01));
      if (np !== n) return { n, prev: np, p: clamp((k - 0.5) * 0.01 / ROLL) };
    }
    return { n, prev: n, p: 1 };
  }
  // Petit rebond du point de mesure quand une couche finit de partir
  const bounce = (t, t0, amp) => { const u = t - t0; return u <= 0 || u > 0.7 ? 0 : amp * Math.exp(-u / 0.13) * Math.sin(u * Math.PI * 2 / 0.26); };

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const act = actOf(t);
    const m = mAt(t);
    const fade = act === 'F' ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    S.content.setAttribute('opacity', f2(fade));

    // Les cinq bandes : elles gonflent une à une (petit dépassement, puis elles se posent)
    let base = SOCLE;
    S.bands.forEach((b, k) => {
      let inf = 0, chars = 0, badge = 0;
      if (act === 'F') { inf = 1; chars = 99; badge = 1; }
      else if (act === 'B') {
        const p = prog(t, T_BAND(k), BAND_DUR);
        inf = p <= 0 ? 0 : back(p);
        chars = Math.floor((t - T_BAND(k) - 0.16) * CPS);
        badge = prog(t, T_BAND(k) + 0.06, 0.3);
      }
      const h = BAND * inf;
      const yTop = yOf(base + h), yBot = yOf(base);
      b.rect.setAttribute('y', f2(yTop + 1));
      b.rect.setAttribute('height', f2(Math.max(0, yBot - yTop - 2)));
      b.rect.setAttribute('opacity', h > 0.05 ? 1 : 0);
      const cy = (yTop + yBot) / 2;
      b.g.setAttribute('transform', `translate(0 ${f2(cy)})`);
      b.g.setAttribute('opacity', h > 0.05 ? 1 : 0);
      const ks = popScale(badge);
      b.badge.setAttribute('transform', `translate(${f2(b.lx)} 0)` + (ks !== 1 ? ` scale(${f2(ks)})` : ''));
      b.badge.setAttribute('opacity', f2(clamp(badge / 0.3)));
      b.lab.show(chars);
      const typing = act === 'B' && chars > 0 && chars < b.lab.full.length + 4;
      if (typing) {
        const bb = b.lab.getBBox();
        b.caret.setAttribute('x', f2(bb.x + bb.width + 2));
      }
      b.caret.setAttribute('opacity', typing && (chars < b.lab.full.length || Math.floor(t / 0.13) % 2 === 0) ? 1 : 0);
      base += h;
    });

    // Énergie empruntée, révélée par le curseur ; la base est translatée selon son épaisseur
    const yBase = yOf(base);
    S.live.setAttribute('transform', `translate(0 ${f2(yBase)})`);
    S.layerLabels.setAttribute('transform', `translate(0 ${f2(yBase)})`);
    const reveal = xOf(m) - X0 + 2 + (m >= 11.999 ? 6 : 0);
    S.liveClip.setAttribute('width', f2(reveal));
    S.socleClip.setAttribute('width', f2(act === 'A' && t < T_HOLD ? reveal : X1 - X0 + 8));
    if (act === 'R') {
      S.ghostClip.setAttribute('x', f2(xOf(m)));
      S.ghostClip.setAttribute('width', f2(X1 + 8 - xOf(m)));
    } else {
      S.ghostClip.setAttribute('x', X0 - 2);
      S.ghostClip.setAttribute('width', f2(act === 'A' ? 0 : X1 - X0 + 10));
    }
    S.labels.forEach(({ n, mEnd }) => n.setAttribute('opacity', f2(clamp((m - mEnd) / 0.5))));

    // Colonne du septième mois : s'allume quand le curseur la traverse
    const drawing = (act === 'A' && t < T_HOLD) || (act === 'B' && t >= B0 && t < T_END);
    S.colHi.setAttribute('opacity', f2(drawing ? clamp((m - 5.9) / 0.15) * clamp((7.1 - m) / 0.15) : 0));

    // Curseur et points de mesure
    const cOp = Math.max(win(t, T_A + 0.05, T_HOLD + 0.02, 0.12, 0.2), win(t, T_RW - 0.02, RW_END, 0.1, 0.15), win(t, B0 - 0.12, T_END, 0.12, 0.2));
    const dOp = act === 'R' ? 0 : cOp;
    const cx = xOf(m);
    S.cursor.setAttribute('transform', `translate(${f2(cx)} 0)`);
    S.cursor.setAttribute('opacity', f2(cOp));
    S.rw.setAttribute('opacity', act === 'R' ? 1 : 0);
    S.curTip.setAttribute('opacity', act === 'R' ? 0 : 1);
    const inA = act === 'A' || act === 'R';
    let by = 0;
    LAYERS.forEach((L, i) => { by += bounce(t, inA ? L.tA : L.tB, i === 2 ? 9 : 5); });
    const gap = borrowed(m);
    S.dot.setAttribute('cx', f2(cx));
    S.dot.setAttribute('cy', f2(yOf(base + gap) + by));
    S.dot.setAttribute('opacity', f2(dOp));
    S.baseDot.setAttribute('cx', f2(cx));
    S.baseDot.setAttribute('cy', f2(yBase));
    S.baseDot.setAttribute('opacity', f2(dOp * clamp((gap - 1.5) / 2)));
    // Atterrissage final : rouge au premier essai, vert quand la courbe tient
    const t0 = inA ? NOUV.tA : NOUV.tB;
    const pr = act === 'F' ? 0 : prog(t, t0, 0.55);
    S.ring.setAttribute('cx', f2(xOf(NOUV.end)));
    S.ring.setAttribute('cy', f2(yBase));
    S.ring.setAttribute('r', f2(8 + 18 * easeOut(pr)));
    S.ring.setAttribute('stroke', inA ? C.red : C.green);
    S.ring.setAttribute('opacity', f2(pr > 0 && pr < 1 ? 0.8 * (1 - pr) : 0));

    // Premier essai : la phrase du post quand chaque couche est rendue
    S.chips.forEach(({ g, x, cy, L }) => {
      const p = inA ? prog(t, L.tA, 0.35) : 0;
      const o = clamp(p / 0.4) * (1 - prog(t, T_RW, 0.15));
      const k = popScale(p);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', k === 1 ? '' : `translate(${f2(x)} ${f2(cy)}) scale(${f2(k)}) translate(${f2(-x)} ${f2(-cy)})`);
    });
    // Constat : ce que l'organisation a réellement construit
    const ph = inA ? prog(t, T_HOLD + 0.2, 0.3) * (1 - prog(t, T_RW, 0.15)) : 0;
    S.hold.setAttribute('opacity', f2(ph));
    const pa = easeInOut(inA ? prog(t, T_HOLD + 0.35, 0.45) : 0);
    S.arrow.setAttribute('stroke-dashoffset', f2(S.arrowLen * (1 - pa)));
    S.arrowHead.setAttribute('opacity', pa > 0.97 ? 1 : 0);
    const pu = inA ? win(t, T_HOLD + 0.15, T_RW, 0.2, 0.15) : 0;
    S.pulse.setAttribute('opacity', f2(pu * (0.55 + 0.45 * Math.cos((t - T_HOLD - 0.15) * Math.PI * 2 / 0.8))));

    // Compteur de mois
    const c = counter(t);
    const e = easeOut(c.p), dir = c.n > c.prev ? 1 : -1;
    S.numA.textContent = String(c.n);
    S.numA.setAttribute('y', f2(S.numY + dir * (1 - e) * 26));
    S.numB.textContent = String(c.prev);
    S.numB.setAttribute('y', f2(S.numY - dir * e * 26));
    S.numB.setAttribute('opacity', c.p >= 1 ? 0 : 1);

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const P = PILLS[i];
      const a = P.a + (i ? 0.12 : 0);
      let o, dy;
      if (act === 'F') { o = i === PILLS.length - 1 ? 1 - prog(t, T_OUT, 0.2) : 0; dy = 0; }
      else { o = prog(t, a, 0.25) * (1 - prog(t, P.b, 0.14)); dy = 8 * (1 - prog(t, a, 0.25)); }
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
