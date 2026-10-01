// Fiche LinkedIn · Clément Raymond · mercredi 14 octobre 2026
// Post : « Dans un projet DMAIC, on retient surtout Analyze et Improve. […] Plus une erreur arrive tôt
// dans un projet, plus elle se paie tard. »
// Premier commentaire du post : la plaquette des formations Lean → encart.
// Le visuel est la pièce maîtresse : la trajectoire du projet. Les cinq phases D-M-A-I-C sont des jalons
// entre le départ et la cible « Ce que le client ressent ». En Define et en Measure, les quatre erreurs
// du post faussent l'angle de départ, cran par cran (rapporteur, compteur d'angle). Analyze, Improve et
// Control sont parfaitement menées (coches vertes), mais l'écart s'élargit à chaque phase (cotes) et la
// flèche manque la cible de loin. Retour au départ : les trois questions du post, posées avant de quitter
// Measure, ramènent l'angle à 0° ; la trajectoire rejouée touche la cible.
// Style propre : la trajectoire qui dérive. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  const backP = p => (p <= 0 ? 0 : p >= 1 ? 1 : back(p));
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const bump = (t, s, d) => { const p = prog(t, s, d); return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0; };
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const k3 = v => Math.max(0.001, v).toFixed(3);
  const about = (cx, cy, k) => (k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${k3(k)}) translate(${f2(-cx)} ${f2(-cy)})`);
  const rad = d => d * Math.PI / 180;
  const NB = ' ';
  // Opacité ; à 0, l'élément sort du rendu (display none) : rendu stable d'une image à l'autre
  const op = (node, v) => {
    const o = clamp(Number(v));
    node.setAttribute('opacity', o >= 0.999 ? 1 : f2(o));
    if (o <= 0.0005) node.setAttribute('display', 'none'); else node.removeAttribute('display');
  };
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', DASH = '#b6b6d4', SEP = '#e4e4ef';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const FIELD = { x: 84, y: 500, w: 912, h: 362 };
  const PANEL = { x: 84, y: 878, w: 912, h: 248 };
  const SX = 112, YI = 646;                 // départ du projet et ligne visée
  const COLS = [
    { k: 'D', name: 'Define', x0: 124, x1: 234 },
    { k: 'M', name: 'Measure', x0: 234, x1: 344 },
    { k: 'A', name: 'Analyze', x0: 344, x1: 494 },
    { k: 'I', name: 'Improve', x0: 494, x1: 644 },
    { k: 'C', name: 'Control', x0: 644, x1: 794 },
  ].map(c => ({ ...c, cx: (c.x0 + c.x1) / 2 }));
  const DISC_Y = 528, NAME_Y = 564;
  const BAND = { y0: 582, y1: 848 };
  const TX = 905, TR = 54;                  // la cible : « Ce que le client ressent »
  const L = 64, PEN = 6;                    // longueur de la flèche, pointe enfoncée dans le plan de la cible
  const ANG = 12;                           // angle faussé (4 erreurs × 3°)
  const yAt = (x, a) => YI + (x - SX) * Math.tan(rad(a));
  const X1 = TX + PEN;
  const YM = yAt(X1, ANG);                  // point d'impact de la trajectoire faussée
  const CUTS = [344, 494, 644, 794];        // cotes d'écart à la sortie de chaque phase

  const ERRORS = [
    ['Un problème mal défini', 'Define'],
    ['Une solution déguisée en problème', 'Define'],
    ['Un indicateur qui ne mesure pas le bon effet', 'Measure'],
    ['Un système de mesure jamais vérifié', 'Measure'],
  ];
  const CHECKS = [
    `Le problème est-il formulé sans solution dedans${NB}?`,
    `L’indicateur suivi est-il celui que le client ressent${NB}?`,
    `La mesure donne-t-elle le même résultat quand deux personnes la font${NB}?`,
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION;
  const T_OUT = 1.2, OUT_DUR = 0.3, T_IN = T_OUT + OUT_DUR;   // l'état final s'efface, puis tout se reconstruit
  const T_ERR = [1.95, 2.4, 2.85, 3.3], ERR_DA = 3, TICK = 0.12;   // les erreurs faussent l'angle, cran par cran
  const T_L1 = 4.05, FL1 = 1.85, T_HIT1 = T_L1 + FL1;               // premier vol : la dérive
  const T_LIFT = 6.95, PULL = 0.22, CARRY = 0.62, T_LAND = T_LIFT + PULL + CARRY;
  const T_CHK = [7.55, 8.3, 9.05], CHK_DA = [6, 3, 3], CHK_TICK = 0.45;
  const T_L2 = 9.95, FL2 = 1.0, T_HIT2 = T_L2 + FL2;              // vol rejoué : sur la cible
  const PILLS = [
    [1.6, `1${NB}·${NB}Une petite erreur d’angle`, 'b'],
    [3.9, `2${NB}·${NB}Des phases parfaitement menées`, 'b'],
    [6.0, `3${NB}·${NB}La cible est manquée`, 'r'],
    [7.25, `4${NB}·${NB}Corriger avant de quitter Measure`, 'b'],
    [11.0, 'Angle corrigé, cible atteinte', 'g'],
  ];

  // Angle de la flèche (degrés) : + 3° par erreur, puis − 6°, − 3°, − 3° par question validée
  function angleAt(s, needle = true) {
    const e = needle ? backP : easeInOut;
    let a = 0;
    T_ERR.forEach(te => { a += ERR_DA * e(prog(s, te + TICK, 0.32)); });
    T_CHK.forEach((tc, i) => { a -= CHK_DA[i] * e(prog(s, tc + CHK_TICK, 0.32)); });
    return a;
  }
  // Vol : la pointe part du rapporteur et file jusqu'au plan de la cible (légère accélération)
  const FPOW = 1.3;
  const X0 = a => SX + L * Math.cos(rad(a));
  const tipAt = (p, a) => { const x = lerp(X0(a), X1, Math.pow(p, FPOW)); return [x, yAt(x, a)]; };
  const passT = (x, T, FL, a) => T + FL * Math.pow(clamp((x - X0(a)) / (X1 - X0(a))), 1 / FPOW);
  const wobble = dt => (dt <= 0 || dt >= 0.8 ? 0 : 5 * Math.exp(-dt * 6) * Math.sin(dt * Math.PI * 2 * 5.5));

  // Position de la flèche : pointe (x, y), angle a, échelle k, soulevée ou non
  function arrowAt(s) {
    const cs = a => Math.cos(rad(a)), sn = a => Math.sin(rad(a));
    const rest = (a, k = 1, lifted = false) => ({ x: SX + L * cs(a), y: YI + L * sn(a), a, k, lifted });
    if (s < T_L1) return { ...rest(angleAt(s), popScale(prog(s, T_IN, 0.32))), o: clamp(prog(s, T_IN, 0.12)) };
    if (s < T_HIT1) { const [x, y] = tipAt(prog(s, T_L1, FL1), ANG); return { x, y, a: ANG, k: 1, o: 1 }; }
    if (s < T_LIFT) return { x: X1, y: YM, a: ANG + wobble(s - T_HIT1), k: 1, o: 1 };
    const xp = X1 - 30 * cs(ANG), yp = YM - 30 * sn(ANG) - 8;
    if (s < T_LIFT + PULL) {
      const q = easeOut(prog(s, T_LIFT, PULL));
      return { x: lerp(X1, xp, q), y: lerp(YM, yp, q), a: ANG, k: 1 + 0.08 * q, o: 1, lifted: true };
    }
    if (s < T_LAND) {
      const q = easeInOut(prog(s, T_LIFT + PULL, CARRY)), r = rest(ANG);
      return { x: lerp(xp, r.x, q), y: lerp(yp, r.y, q) - 92 * Math.sin(Math.PI * q), a: ANG - 7 * Math.sin(Math.PI * q), k: 1.08, o: 1, lifted: true };
    }
    if (s < T_L2) { const q = prog(s, T_LAND, 0.2); return { ...rest(angleAt(s), 1.08 - 0.08 * easeOut(q), q < 1), o: 1 }; }
    if (s < T_HIT2) { const [x, y] = tipAt(prog(s, T_L2, FL2), 0); return { x, y, a: 0, k: 1, o: 1 }; }
    return { x: X1, y: YI, a: wobble(s - T_HIT2), k: 1, o: 1 };
  }

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
  function checkDisc(parent, r = 13) {
    const g = el('g', {}, parent);
    el('circle', { cx: 0, cy: 0, r, fill: C.green, stroke: C.white, 'stroke-width': 3 }, g);
    el('path', { d: 'M -5.5 0.5 L -1.5 4.5 L 6 -4', fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  const cote = (x, ya, yb) => `M ${f2(x - 6)} ${f2(ya)} H ${f2(x + 6)} M ${f2(x)} ${f2(ya)} V ${f2(yb)} M ${f2(x - 6)} ${f2(yb)} H ${f2(x + 6)}`;

  const S = {};

  function build() {
    D.template({ author: 'clement' });
    D.title('Erreur tôt,', 'payée tard.');
    D.chapeau('Les erreurs qui coûtent le plus cher se font en Define et en Measure.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Une ', 0], ['petite erreur d’angle', C.tRed], [` au départ${NB}: l’écart `, 0], ['grandit à chaque phase', C.blue], ['.', 0]]);
    line(384, [['Trois ', 0], ['questions avant de quitter Measure', C.blue], [' remettent la flèche ', 0], ['sur la cible', C.tGreen], ['.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-40%', y: '-80%', width: '180%', height: '260%' }, defs);
    el('feDropShadow', { dx: 0, dy: 9, stdDeviation: 6, 'flood-color': C.ink, 'flood-opacity': 0.25 }, lift);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Le terrain : phases, cible, ligne visée -----
    el('rect', { x: FIELD.x, y: FIELD.y, width: FIELD.w, height: FIELD.h, rx: 18, fill: C.card, stroke: CARD_LINE, 'stroke-width': 2 });
    el('rect', { x: COLS[0].x0, y: BAND.y0, width: COLS[1].x1 - COLS[0].x0, height: BAND.y1 - BAND.y0, rx: 12, fill: C.pLav, 'fill-opacity': 0.6 });
    [COLS[1].x0, ...CUTS].forEach(x => el('line', { x1: x, y1: BAND.y0 + 6, x2: x, y2: BAND.y1 - 6, stroke: SEP, 'stroke-width': 2, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }));
    // Plan de la cible
    el('line', { x1: TX, y1: BAND.y0 + 6, x2: TX, y2: BAND.y1 - 6, stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '5 7', 'stroke-linecap': 'round' });

    // Noms des phases (pastilles de lettre posées plus haut, au-dessus de tout)
    COLS.forEach(c => fit(text(D.svg, c.cx, NAME_Y, c.name, { size: 16, weight: 700, fill: C.ink, anchor: 'middle' }), c.x1 - 3, `phase ${c.name}`, c.x0 + 3));
    [['Ce que le client', 526], ['ressent', 548]].forEach(([s, y]) => fit(text(D.svg, TX, y, s, { size: 16, weight: 800, fill: C.tGreen, anchor: 'middle' }), FIELD.x + FIELD.w - 6, 'cible titre', COLS[4].x1 + 4));

    // Zone des phases du départ
    fit(text(D.svg, (COLS[0].x0 + COLS[1].x1) / 2, BAND.y1 - 16, 'avant de quitter Measure', { size: 15, weight: 700, fill: MUTED, anchor: 'middle' }), COLS[1].x1 - 6, 'zone départ', COLS[0].x0 + 6);

    // Rapporteur au départ : un quart de disque posé sur la ligne visée, un cran tous les 3°
    const R = 92;
    const pt = (a, r) => [SX + r * Math.cos(rad(a)), YI + r * Math.sin(rad(a))];
    const [qx, qy] = pt(90, R);
    el('path', { d: `M ${SX} ${YI} L ${SX + R} ${YI} A ${R} ${R} 0 0 1 ${f2(qx)} ${f2(qy)} Z`, fill: C.white, stroke: C.lightBlue, 'stroke-width': 2.2, 'stroke-linejoin': 'round' });
    el('path', { d: `M ${SX + R - 24} ${YI} A ${R - 24} ${R - 24} 0 0 1 ${SX} ${YI + R - 24}`, fill: 'none', stroke: C.lightBlue, 'stroke-opacity': 0.45, 'stroke-width': 1.5 });
    for (let a = 3; a <= 87.01; a += 3) {
      const major = a % 15 === 0;
      const [x1, y1] = pt(a, R - (major ? 16 : 9)), [x2, y2] = pt(a, R - 2);
      el('line', { x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), stroke: major ? C.lightBlue : DASH, 'stroke-width': major ? 2.4 : 1.5, 'stroke-linecap': 'round' });
    }
    S.R = R;
    S.wedge = el('path', { fill: C.red, 'fill-opacity': 0.22 });
    S.wedgeArc = el('path', { fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round' });

    // Ligne visée (pointillés) : du départ au centre de la cible
    el('line', { x1: SX, y1: YI, x2: TX, y2: YI, stroke: DASH, 'stroke-width': 3, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' });
    el('circle', { cx: SX, cy: YI, r: 7, fill: C.blue });

    // La cible
    S.target = el('circle', { cx: TX, cy: YI, r: TR, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2.5 });
    el('circle', { cx: TX, cy: YI, r: 41, fill: C.pGreen });
    el('circle', { cx: TX, cy: YI, r: 28, fill: C.green });
    el('circle', { cx: TX, cy: YI, r: 15, fill: C.white });
    el('circle', { cx: TX, cy: YI, r: 7, fill: C.tGreen });
    S.ripple = el('circle', { cx: TX, cy: YI, r: TR, fill: 'none', stroke: C.green, 'stroke-width': 4, display: 'none' });

    // ----- La dérive : fantôme, cotes, impact -----
    S.ghost = el('line', { x1: SX, y1: YI, x2: f2(TX), y2: f2(yAt(TX, ANG)), stroke: C.red, 'stroke-width': 3.5, 'stroke-dasharray': '9 8', 'stroke-linecap': 'round' });
    S.cotes = CUTS.map(x => ({ x, y: yAt(x, ANG), n: el('path', { fill: 'none', stroke: C.red, 'stroke-width': 2.5, 'stroke-linecap': 'round' }) }));
    S.bigCote = el('path', { fill: 'none', stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' });
    S.ecart = text(D.svg, TX + 13, (YI + TR + YM) / 2 + 6, 'écart', { size: 17, weight: 800, fill: C.tRed });
    fit(S.ecart, FIELD.x + FIELD.w - 6, 'écart');
    S.miss = el('g');
    el('path', { d: 'M -8 -8 L 8 8 M 8 -8 L -8 8', fill: 'none', stroke: C.red, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, S.miss);

    // Traces : la dérive (premier vol), la trajectoire rejouée
    S.trail1 = el('line', { x1: SX, y1: YI, x2: SX, y2: YI, stroke: C.blue, 'stroke-width': 4.5, 'stroke-linecap': 'round' });
    S.trail2 = el('line', { x1: SX, y1: YI, x2: SX, y2: YI, stroke: C.blue, 'stroke-width': 4.5, 'stroke-linecap': 'round' });

    // Coches « menée » sur la trajectoire (A, I, C), au premier vol puis au vol rejoué
    S.chk1 = COLS.slice(2).map(c => ({ g: checkDisc(D.svg), x: c.cx, y: yAt(c.cx, ANG), t: passT(c.cx + 42, T_L1, FL1, ANG) }));
    S.chk2 = COLS.slice(2).map(c => ({ g: checkDisc(D.svg), x: c.cx, y: YI, t: passT(c.cx + 42, T_L2, FL2, 0) }));

    // Éclat de l'impact manqué (petits traits qui partent du point d'impact)
    S.burst = el('g', { display: 'none' });
    S.burstLines = [-62, -24, 24, 62, 118, 242].map(d => ({ d, n: el('line', { stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.burst) }));

    // Alerte à l'impact
    S.alert = el('g');
    el('circle', { cx: 0, cy: 0, r: 15, fill: C.red }, S.alert);
    text(S.alert, 0, 8, '!', { size: 22, weight: 800, fill: C.white, anchor: 'middle' });

    // La flèche (repère : pointe en 0, vers +x)
    S.arrow = el('g');
    S.arrowIn = el('g', {}, S.arrow);
    el('line', { x1: -L + 2, y1: 0, x2: -14, y2: 0, stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, S.arrowIn);
    el('path', { d: 'M 0 0 L -21 -10 L -15 0 L -21 10 Z', fill: C.blue, stroke: C.blue, 'stroke-width': 2, 'stroke-linejoin': 'round' }, S.arrowIn);
    [-1, 1].forEach(k => el('path', { d: `M ${-L + 20} ${k * 2} L ${-L + 8} ${k * 11} L ${-L - 4} ${k * 11} L ${-L + 6} ${k * 2} Z`, fill: C.lightBlue, 'stroke-linejoin': 'round' }, S.arrowIn));

    // Pastilles de lettre des phases : bleu, rouge (erreur), vert (menée / vérifiée)
    const passA = COLS.map(c => passT(c.cx, T_L1, FL1, ANG)), passB = COLS.map(c => passT(c.cx, T_L2, FL2, 0));
    S.discs = COLS.map((c, i) => {
      const g = el('g');
      const circ = el('circle', { cx: c.cx, cy: DISC_Y, r: 17, fill: C.blue }, g);
      text(g, c.cx, DISC_Y + 7, c.k, { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
      let ev = [[T_IN, C.blue]];
      if (i === 0) ev.push([T_ERR[0] + TICK, C.red], [T_CHK[0] + CHK_TICK, C.green]);
      else if (i === 1) ev.push([T_ERR[2] + TICK, C.red], [T_CHK[2] + CHK_TICK, C.green]);
      else ev.push([passA[i], C.green], [T_LIFT + 0.25, C.blue], [passB[i], C.green]);
      return { g, circ, cx: c.cx, ev };
    });

    // ----- Le panneau du bas : les quatre erreurs, puis les trois questions -----
    el('rect', { x: PANEL.x, y: PANEL.y, width: PANEL.w, height: PANEL.h, rx: 18, fill: C.card, stroke: CARD_LINE, 'stroke-width': 2 });
    el('line', { x1: PANEL.x + 24, y1: PANEL.y + 50, x2: PANEL.x + PANEL.w - 24, y2: PANEL.y + 50, stroke: C.line, 'stroke-width': 2 });
    const HY = PANEL.y + 33;
    S.hErr = text(D.svg, PANEL.x + 24, HY, `En Define et en Measure, ce qui fausse l’angle`, { size: 16, weight: 700, fill: MUTED });
    S.hChk = text(D.svg, PANEL.x + 24, HY, `Avant de quitter Measure, trois questions évitent l’essentiel${NB}:`, { size: 16, weight: 700, fill: MUTED });
    [S.hErr, S.hChk].forEach((n, i) => fit(n, PANEL.x + PANEL.w - 24, `en-tête panneau ${i + 1}`));

    const RIGHT = PANEL.x + PANEL.w - 24;
    S.errs = ERRORS.map(([label, phase], i) => {
      const cy = PANEL.y + 78 + i * 46;
      const g = el('g');
      const num = el('g', {}, g);
      el('circle', { cx: PANEL.x + 38, cy, r: 14, fill: C.red }, num);
      text(num, PANEL.x + 38, cy + 6, String(i + 1), { size: 16, weight: 800, fill: C.white, anchor: 'middle' });
      const tx = text(g, PANEL.x + 66, cy + 7, label, { size: 19, weight: 700, fill: C.ink });
      const chip = el('g', {}, g);
      const ct = text(chip, RIGHT - 14, cy + 5.5, phase, { size: 15, weight: 700, fill: C.blue, anchor: 'end' });
      const cw = ct.getBBox().width + 28;
      el('rect', { x: RIGHT - cw, y: cy - 13, width: cw, height: 26, rx: 13, fill: C.pLav }, chip).after(ct);
      fit(tx, RIGHT - cw - 16, `erreur ${i + 1}`);
      return { g, num, cx: PANEL.x + 38, cy };
    });

    S.chks = CHECKS.map((label, i) => {
      const cy = PANEL.y + 92 + i * 60;
      const g = el('g');
      const box = el('g', {}, g);
      el('rect', { x: PANEL.x + 24, y: cy - 16, width: 32, height: 32, rx: 8, fill: C.green }, box);
      el('path', { d: `M ${PANEL.x + 32} ${cy + 0.5} L ${PANEL.x + 37.5} ${cy + 6} L ${PANEL.x + 48} ${cy - 5.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, box);
      const cp = el('clipPath', { id: `wipe${i}` }, defs);
      const cr = el('rect', { x: PANEL.x + 66, y: cy - 22, width: 0, height: 44 }, cp);
      const tx = text(g, PANEL.x + 72, cy + 7, label, { size: 20, weight: 700, fill: C.ink });
      tx.setAttribute('clip-path', `url(#wipe${i})`);
      fit(tx, RIGHT, `question ${i + 1}`);
      return { g, box, cr, w: tx.getBBox().width + 12, cx: PANEL.x + 40, cy };
    });

    // ----- Compteur d'angle et pastilles d'étape -----
    const PY = FRAME.y + 46;
    const wg = el('g');
    const wl = text(wg, 0, PY + 6, 'Erreur d’angle au départ', { size: 16, weight: 700, fill: MUTED });
    S.angle = text(wg, 0, PY + 8, '0°', { size: 24, weight: 800, fill: C.ink, anchor: 'end' });
    const W_RIGHT = FRAME.x + FRAME.w - 30, VAL_W = 58;
    const ww = 20 + wl.getBBox().width + 14 + VAL_W + 20;
    el('rect', { x: W_RIGHT - ww, y: PY - 23, width: ww, height: 46, rx: 23, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, wg).parentNode.insertBefore(wg.lastChild, wg.firstChild);
    wl.setAttribute('x', W_RIGHT - ww + 20);
    S.angle.setAttribute('x', W_RIGHT - 20);
    S.widgetLeft = W_RIGHT - ww;

    S.pills = PILLS.map(([, label, k]) => pillShape(D.svg, 92, PY, label,
      k === 'g' ? { bg: C.pGreen, fg: C.tGreen, icon: true } : k === 'r' ? { bg: C.pRed, fg: C.tRed } : { bg: C.blue, fg: C.white }));
    S.pills.forEach((p, i) => fit(p, S.widgetLeft - 16, `pastille ${i + 1}`));

    D.encart(['Se former au Lean', 'Nos formations Lean', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_IN;                    // jusqu'à T_IN : l'état final (qui s'efface à partir de T_OUT)
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const s = final ? END : t;                 // temps de séquence (final = fin)

    // Rapporteur : le secteur rouge suit l'angle de la flèche
    const a = angleAt(s);
    if (a > 0.05) {
      const r = S.R - 2, ex = SX + r * Math.cos(rad(a)), ey = YI + r * Math.sin(rad(a));
      S.wedge.setAttribute('d', `M ${SX} ${YI} L ${SX + r} ${YI} A ${r} ${r} 0 0 1 ${f2(ex)} ${f2(ey)} Z`);
      S.wedgeArc.setAttribute('d', `M ${SX + r + 7} ${YI} A ${r + 7} ${r + 7} 0 0 1 ${f2(SX + (r + 7) * Math.cos(rad(a)))} ${f2(YI + (r + 7) * Math.sin(rad(a)))}`);
      op(S.wedge, 1);
      op(S.wedgeArc, 1);
    } else { op(S.wedge, 0); op(S.wedgeArc, 0); }

    // Compteur d'angle
    const av = Math.round(angleAt(s, false) * 2) / 2;
    S.angle.textContent = `${String(Math.max(0, av)).replace('.', ',')}°`;
    S.angle.setAttribute('fill', s >= T_CHK[2] + CHK_TICK + 0.2 ? C.tGreen : av > 0 ? C.tRed : C.ink);

    // Pastilles de lettre des phases
    S.discs.forEach(d => {
      let col = C.blue, tc = -9;
      d.ev.forEach(([te, c]) => { if (s >= te) { col = c; tc = te; } });
      d.circ.setAttribute('fill', col);
      d.g.setAttribute('transform', about(d.cx, DISC_Y, 1 + 0.22 * bump(s, tc, 0.32)));
    });

    // Flèche
    const ar = arrowAt(s);
    op(S.arrow, ar.o * fade);
    S.arrow.setAttribute('transform', `translate(${f2(ar.x)} ${f2(ar.y)}) rotate(${f2(ar.a)})`);
    S.arrowIn.setAttribute('transform', ar.k === 1 ? '' : `translate(${-L / 2} 0) scale(${k3(ar.k)}) translate(${L / 2} 0)`);
    if (ar.lifted) S.arrow.setAttribute('filter', 'url(#lift)'); else S.arrow.removeAttribute('filter');

    // Trace du premier vol : bleue en vol, rouge à l'impact, puis elle devient le fantôme en pointillés
    const tail = (x, y, ang) => [x - 14 * Math.cos(rad(ang)), y - 14 * Math.sin(rad(ang))];
    if (s >= T_L1 && s < T_LIFT + 0.3) {
      const [x2, y2] = s < T_LIFT ? tail(ar.x, ar.y, ANG) : tail(X1, YM, ANG);
      S.trail1.setAttribute('x2', f2(Math.max(SX, x2)));
      S.trail1.setAttribute('y2', f2(Math.max(YI, y2)));
      S.trail1.setAttribute('stroke', s < T_HIT1 + 0.05 ? C.blue : C.red);
      op(S.trail1, 1 - prog(s, T_LIFT, 0.3));
    } else op(S.trail1, 0);
    op(S.ghost, prog(s, T_LIFT, 0.3) * fade);

    // Trace rejouée
    if (s >= T_L2) {
      const [x2] = tail(s < T_HIT2 ? ar.x : X1, YI, 0);
      S.trail2.setAttribute('x2', f2(Math.max(SX, x2)));
      op(S.trail2, fade);
    } else op(S.trail2, 0);

    // Cotes d'écart : elles se tracent quand la flèche passe la sortie de chaque phase
    const ghostOp = s >= T_LIFT ? lerp(1, 0.55, prog(s, T_LIFT, 0.3)) : 1;
    S.cotes.forEach(c => {
      const tp = passT(c.x, T_L1, FL1, ANG);
      if (s < tp) { op(c.n, 0); return; }
      const g = easeOut(prog(s, tp, 0.2));
      c.n.setAttribute('d', cote(c.x, YI, YI + (c.y - YI) * g));
      op(c.n, ghostOp * fade);
    });
    // Grande cote à la cible et mot « écart »
    const pb = prog(s, T_HIT1 + 0.15, 0.3);
    if (pb > 0) {
      const y0 = YI + TR + 6, y1 = YM - 12;
      S.bigCote.setAttribute('d', cote(TX, y0, y0 + (y1 - y0) * easeOut(pb)));
      op(S.bigCote, fade);
    } else op(S.bigCote, 0);
    const pe = prog(s, T_HIT1 + 0.4, 0.3);
    op(S.ecart, clamp(pe / 0.4) * fade);
    S.ecart.setAttribute('transform', about(TX + 34, (YI + TR + YM) / 2, popScale(pe)));
    // Croix à l'impact, une fois la flèche retirée
    const pm = prog(s, T_LIFT + 0.12, 0.3);
    op(S.miss, clamp(pm / 0.4) * fade);
    S.miss.setAttribute('transform', `translate(${f2(TX)} ${f2(YM)}) scale(${k3(popScale(pm))})`);

    // Éclat à l'impact manqué
    const pk = prog(s, T_HIT1, 0.36);
    if (pk > 0 && pk < 1) {
      const r0 = 10 + 14 * easeOut(pk), r1 = r0 + 10 * (1 - pk);
      S.burstLines.forEach(({ d, n }) => {
        const c = Math.cos(rad(d)), sn = Math.sin(rad(d));
        n.setAttribute('x1', f2(X1 + r0 * c)); n.setAttribute('y1', f2(YM + r0 * sn));
        n.setAttribute('x2', f2(X1 + r1 * c)); n.setAttribute('y2', f2(YM + r1 * sn));
      });
      op(S.burst, 1 - easeIn(pk));
    } else op(S.burst, 0);

    // Alerte qui pulse tant que la flèche est plantée hors cible
    const pa = prog(s, T_HIT1 + 0.1, 0.3), pz = prog(s, T_LIFT - 0.15, 0.2);
    const ka = popScale(pa) * (1 - easeIn(pz)) * (pa >= 1 ? 1 + 0.1 * Math.sin((s - T_HIT1) * Math.PI * 2 / 0.6) : 1);
    op(S.alert, clamp(pa / 0.4) * (1 - pz));
    S.alert.setAttribute('transform', `translate(${TX + 46} ${f2(YM)}) scale(${k3(ka)})`);

    // Coches « menée »
    const tick = (c, o) => {
      const p = prog(s, c.t, 0.3);
      op(c.g, clamp(p / 0.4) * o);
      c.g.setAttribute('transform', `translate(${f2(c.x)} ${f2(c.y)}) scale(${k3(popScale(p))})`);
    };
    S.chk1.forEach(c => tick(c, 1 - prog(s, T_LIFT, 0.25)));
    S.chk2.forEach(c => tick(c, fade));

    // La cible : contour vert une fois touchée, onde au moment de l'impact
    const hit = s >= T_HIT2;
    S.target.setAttribute('stroke', hit ? C.green : CARD_LINE);
    S.target.setAttribute('stroke-width', hit ? 3.5 : 2.5);
    const pr = prog(s, T_HIT2, 0.6);
    if (pr > 0 && pr < 1) { S.ripple.setAttribute('r', f2(TR + 34 * easeOut(pr))); op(S.ripple, 0.9 * (1 - pr)); } else op(S.ripple, 0);

    // Panneau : en-têtes, erreurs, questions
    op(S.hErr, prog(s, T_IN + 0.05, 0.25) * (1 - prog(s, T_LIFT, 0.15)));
    op(S.hChk, prog(s, T_LIFT + 0.3, 0.25) * fade);
    S.errs.forEach((e, i) => {
      const pin = prog(s, T_ERR[i], 0.3), pout = prog(s, T_LIFT + 0.05 * i, 0.22);
      op(e.g, pin * (1 - pout));
      const dx = -20 * (1 - easeOut(pin)) - 18 * easeIn(pout);
      e.g.setAttribute('transform', dx ? `translate(${f2(dx)} 0)` : '');
      e.num.setAttribute('transform', about(e.cx, e.cy, popScale(prog(s, T_ERR[i], 0.35))));
    });
    S.chks.forEach((c, i) => {
      const pin = prog(s, T_CHK[i], 0.32);
      op(c.g, clamp(pin / 0.3) * fade);
      c.box.setAttribute('transform', about(c.cx, c.cy, popScale(pin)));
      c.cr.setAttribute('width', f2(c.w * easeInOut(prog(s, T_CHK[i] + 0.08, 0.38))));
    });

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const at = PILLS[i][0] + (i ? 0.12 : 0);
      const nx = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      const o = (i === PILLS.length - 1 ? prog(s, at, 0.25) * fade : prog(s, at, 0.25) * (1 - prog(s, nx, 0.14)));
      const dy = 8 * (1 - prog(s, at, 0.25));
      op(g, o);
      g.setAttribute('transform', dy > 0.01 ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
