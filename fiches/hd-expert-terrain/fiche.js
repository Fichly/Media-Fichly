// Fiche LinkedIn · Hugo Duc · lundi 19 octobre 2026
// Post : « Dans une résolution de problème, la personne la plus compétente sur la méthode n'est pas toujours
// la mieux placée pour trouver la cause. »
// Premier commentaire du post (Buffer) : toutes les ressources Lean du site → encart.
// Le visuel est la pièce maîtresse : le plan et le calque. Le plan technique du process, sur papier
// quadrillé, tel qu'il a été conçu : l'expert le passe au viseur, tout est conforme, la cause reste
// introuvable, l'équipe valide ou se tait. Puis un calque se pose dessus, tel qu'il fonctionne, et
// l'équipe l'annote à la main, trait par trait (la matière du lundi matin, le réglage retouché « au
// feeling », la pièce mise de côté). Les causes s'allument aux endroits annotés. Quand on retire le
// calque (début de boucle), elles disparaissent : invisibles sur le plan seul.
// Style propre : le plan et le calque (tracés mécaniques puis tracés à main levée, stylo qui écrit).
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
  const smooth = p => p * p * (3 - 2 * p);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const f1 = v => (Math.abs(v) < 1e-3 ? 0 : v).toFixed(1);
  const rad = d => d * Math.PI / 180;
  const NB = ' ';

  // Couleurs propres au plan (teintes de la charte)
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa';
  const PLAN_BG = '#edf0fb', GRID_MIN = '#dfe4f6', GRID_MAJ = '#cbd3f0', SPEC = '#6d74b5', AXIS = '#8d95cf';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const SHEET = { x: 88, y: 494, w: 904, h: 634 };          // le plan (bas 1128)
  const INNER = { x: 98, y: 504, w: 884, h: 614 };          // cadre intérieur du plan
  const CAL = { x: 104, y: 510, w: 872, h: 512 };           // le calque (bas 1022)
  const CAL_C = [CAL.x + CAL.w / 2, CAL.y + CAL.h / 2];
  const CAL_ROT = -0.5;                                     // posé à la main, pas tout à fait droit
  const BOX = { w: 150, h: 116, y: 690 };
  const BX = [140, 366, 592, 818];
  const FLOW_Y = BOX.y + BOX.h / 2;                         // 748
  const CART = { x: 98, y: 1038, w: 240, h: 80 };           // cartouche du plan (bas gauche)
  const PILL_Y = FRAME.y + 42;
  const AV_X = [870, 918, 966], AV_Y = PILL_Y, AV_R = 20;   // l'équipe, en haut à droite
  const AV_COL = [C.teal, C.violet, C.yellow];

  const STEPS = [
    { icon: 'matiere', op: 'OP 10', name: 'Matière', spec: 'selon spécification' },
    { icon: 'reglage', op: 'OP 20', name: 'Réglage', spec: 'fiche de réglage' },
    { icon: 'production', op: 'OP 30', name: 'Production', spec: 'cadence nominale' },
    { icon: 'controle', op: 'OP 40', name: 'Contrôle', spec: 'selon la gamme' },
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_LIFT = 1.2, LIFT_UP = 0.18, LIFT_SLIDE = 0.45;   // on retire le calque
  const T_SEQ = T_LIFT + LIFT_UP + LIFT_SLIDE + 0.02;      // le plan seul
  const T_P1 = 1.9, T_P2 = 4.35;                            // pastilles 1 et 2 (la 3e : après les causes)
  const T_X_IN = 1.98, STOP = [2.25, 2.55, 2.85, 3.15], T_X_TAG = 3.42, T_X_OUT = 3.9;
  const T_B1 = [3.45, 3.58, 3.71], T_ST1 = 3.5;           // l'équipe valide, ou se tait
  const T_OFF = 4.35;                                      // fin de l'analyse présentée
  const T_DROP = 4.45, DROP = 0.8, T_LAND = T_DROP + DROP; // le calque se pose
  const T_TAPE = [T_LAND + 0.02, T_LAND + 0.1];
  const T_ST2 = 5.36;                                      // chacun cherche
  const T_PEN_IN = 5.24, T_ANN = 5.42;
  let T_LIGHT = [], T_P3 = 0, T_PEN_OUT = 0, T_PIECE = 0, T_HOP = 0, T_CRATE = 0;
  const A_T = [];                                          // [début, fin] de chaque annotation

  // ---------- Pictos du plan (traits bleus, repère centré) ----------
  const line = (g, d, w = 2.2) => el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const ICONS = {
    matiere(g) {
      [[-7.5, 4], [7.5, 4], [0, -9]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 7, fill: 'none', stroke: C.blue, 'stroke-width': 2.2 }, g));
      [[-7.5, 4], [7.5, 4], [0, -9]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 2, fill: C.blue }, g));
      line(g, 'M -18 13.5 H 18');
    },
    reglage(g) {
      el('circle', { cx: 0, cy: 2, r: 14, fill: 'none', stroke: C.blue, 'stroke-width': 2.2 }, g);
      [-150, -120, -90, -60, -30].forEach(a => line(g, `M ${f1(18 * Math.cos(rad(a)))} ${f1(2 + 18 * Math.sin(rad(a)))} L ${f1(21.5 * Math.cos(rad(a)))} ${f1(2 + 21.5 * Math.sin(rad(a)))}`, 2));
      line(g, `M 0 2 L ${f1(10 * Math.cos(rad(-60)))} ${f1(2 + 10 * Math.sin(rad(-60)))}`, 2.6);
      el('circle', { cx: 0, cy: 2, r: 2.6, fill: C.blue }, g);
    },
    production(g) {
      const n = 8, step = 2 * Math.PI / n, R = 15, r = 11;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = i * step;
        [[r, -0.5], [r, -0.24], [R, -0.15], [R, 0.15], [r, 0.24]].forEach(([rr, k]) => pts.push([rr * Math.cos(a + k * step), rr * Math.sin(a + k * step)]));
      }
      line(g, 'M ' + pts.map(p => p.map(f1).join(' ')).join(' L ') + ' Z');
      el('circle', { cx: 0, cy: 0, r: 4.5, fill: 'none', stroke: C.blue, 'stroke-width': 2.2 }, g);
    },
    controle(g) {
      el('rect', { x: -19, y: -13, width: 38, height: 7, rx: 1.5, fill: 'none', stroke: C.blue, 'stroke-width': 2.2 }, g);
      line(g, 'M -19 -6 V 13 L -12 6 V -6');
      line(g, 'M 3 -15 H 10 V -4 M 4 -6 V 10 L 10 4 V -6');
      [-3, 0, 3].forEach(k => line(g, `M ${12 + k * 2.4} -13 V -10`, 1.4));
    },
  };

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    const w = tx.getBBox().width + 40 + iw;
    r.setAttribute('width', w);
    if (icon) {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.green }, g);
      el('path', { d: `M ${x + 25.5} ${cy + 0.5} L ${x + 29.5} ${cy + 4.5} L ${x + 36.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return { g, w, r };
  }
  function avatar(parent, cx, cy, color, r = AV_R) {
    const g = el('g', {}, parent);
    const k = r / 25;
    el('circle', { cx, cy, r: r + 2.5, fill: C.white }, g);
    el('circle', { cx, cy, r, fill: color }, g);
    el('circle', { cx, cy: cy - 6 * k, r: 7.5 * k, fill: C.white }, g);
    el('path', { d: `M ${f1(cx - 12.5 * k)} ${f1(cy + 14 * k)} C ${f1(cx - 12.5 * k)} ${f1(cy + 3 * k)}, ${f1(cx + 12.5 * k)} ${f1(cy + 3 * k)}, ${f1(cx + 12.5 * k)} ${f1(cy + 14 * k)} Z`, fill: C.white }, g);
    return g;
  }
  const scaleAt = (n, cx, cy, k) => n.setAttribute('transform', k === 1 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`);

  // ---------- Tracés à main levée (sur le calque) ----------
  let HW = 0;
  const SLANT = -9;
  // Écriture manuscrite : Poppins penché, chaque lettre légèrement tournée, révélée par un masque qui
  // avance avec la pointe du stylo.
  function hand(parent, x, y, str, { size = 22, rot = 0, weight = 500, fill = C.tRed, seed = 1, right = null } = {}) {
    const g = el('g', {}, parent);
    const inner = el('g', {}, g);
    const t = text(inner, 0, 0, str, { size, weight, fill });
    t.setAttribute('rotate', Array.from({ length: str.length }, (_, i) => f1(2.6 * Math.sin(i * 2.7 + seed * 1.9))).join(' '));
    const b = t.getBBox();
    if (right !== null) x = right - b.x - b.width;   // aligné à droite
    g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${rot}) skewX(${SLANT})`);
    const id = `hw${HW++}`;
    const cp = el('clipPath', { id }, S.defs);
    const r = el('rect', { x: f2(b.x - 6), y: f2(b.y - 8), width: 0, height: f2(b.height + 16) }, cp);
    inner.setAttribute('clip-path', `url(#${id})`);
    const tan = Math.tan(rad(SLANT)), c = Math.cos(rad(rot)), s = Math.sin(rad(rot));
    const map = (lx, ly) => { const sx = lx + ly * tan; return [x + sx * c - ly * s, y + sx * s + ly * c]; };
    const n = str.length;
    return {
      g, t, w: b.width, left: x + b.x, right: x + b.x + b.width,
      show(p) { r.setAttribute('width', f2(p <= 0 ? 0 : p >= 1 ? b.width + 14 : (b.width + 12) * p + 4)); },
      tip(p) { const [px, py] = map(b.x + b.width * p, -size * 0.32); return [px, py + 2.2 * Math.sin(p * n * 1.4)]; },
    };
  }
  // Trait qui se dessine (stroke-dashoffset)
  function stroke(parent, d, { color = C.red, width = 3.4 } = {}) {
    const n = el('path', { d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
    const len = n.getTotalLength();
    n.setAttribute('stroke-dasharray', `${f2(len + 2)} ${f2(len + 2)}`);
    return {
      n, len,
      show(p) { n.setAttribute('stroke-dashoffset', f2((len + 2) * (1 - p))); n.setAttribute('visibility', p > 0 ? 'visible' : 'hidden'); },
      tip(p) { const q = n.getPointAtLength(len * clamp(p)); return [q.x, q.y]; },
    };
  }
  // Plusieurs traits enchaînés par le même geste (parts : [objet, poids dans la durée])
  function chain(parts) {
    const tot = parts.reduce((a, [, w]) => a + w, 0);
    const bounds = [];
    let acc = 0;
    parts.forEach(([o, w]) => { bounds.push([acc / tot, (acc + w) / tot, o]); acc += w; });
    return {
      show(p) { bounds.forEach(([a, b, o]) => o.show(clamp((p - a) / (b - a)))); },
      tip(p) { for (const [a, b, o] of bounds) if (p <= b) return o.tip(clamp((p - a) / (b - a))); return bounds[bounds.length - 1][2].tip(1); },
    };
  }
  // Boucle à main levée : ne se referme pas pile, légère spirale
  function loopPath(cx, cy, rx, ry, a0, sweep, seed = 0) {
    const N = Math.ceil(sweep / (Math.PI / 36)), pts = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, a = a0 + sweep * u;
      const k = 1 + 0.03 * Math.sin(3 * a + seed) + 0.06 * u;
      pts.push([cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)]);
    }
    return 'M ' + pts.map(p => p.map(f1).join(' ')).join(' L ');
  }
  // Flèche à main levée : tige courbe (quadratique) puis pointe
  function arrow(parent, x1, y1, cx, cy, x2, y2, opts) {
    const shaft = stroke(parent, `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, opts);
    const a = Math.atan2(y2 - cy, x2 - cx), L = 14;
    const p1 = [x2 - L * Math.cos(a - 0.5), y2 - L * Math.sin(a - 0.5)], p2 = [x2 - L * Math.cos(a + 0.5), y2 - L * Math.sin(a + 0.5)];
    const head = stroke(parent, `M ${f1(p1[0])} ${f1(p1[1])} L ${x2} ${y2} L ${f1(p2[0])} ${f1(p2[1])}`, opts);
    return chain([[shaft, 4], [head, 1]]);
  }
  // Ligne qui ondule un peu (rature, soulignement)
  function wavy(x1, y1, x2, y2, amp = 1.6, waves = 3, seed = 0) {
    const N = 24, pts = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      pts.push([lerp(x1, x2, u), lerp(y1, y2, u) + amp * Math.sin(u * waves * 2 * Math.PI + seed)]);
    }
    return 'M ' + pts.map(p => p.map(f1).join(' ')).join(' L ');
  }
  // Numéro entouré à la main (le chiffre, puis le cercle)
  function numberMark(parent, cx, cy, digit, seed) {
    const d = hand(parent, cx - 6, cy + 7.5, digit, { size: 21, weight: 700, seed });
    const c = stroke(parent, loopPath(cx, cy, 15, 14, -2.2, 2 * Math.PI + 0.5, seed), { width: 2.8 });
    return chain([[d, 1], [c, 2]]);
  }

  const S = { ops: [], ticks: [], b1: [], b2: [], rings: [], lights: [] };

  function build() {
    D.template({ author: 'hugo' });
    D.title('Le plan ne montre', 'pas les causes.');
    D.chapeau('Elles apparaissent quand on pose la question au poste.');

    // Explication courte au-dessus du visuel
    const expl = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    expl(352, [['Le ', 0], ['plan', C.blue], [`${NB}: le process `, 0], ['tel qu’il a été conçu', C.blue], [', celui que connaît l’expert.', 0]]);
    expl(384, [['Le ', 0], ['calque', C.tRed], [`${NB}: le process `, 0], ['tel qu’il fonctionne', C.tRed], [', annoté par l’équipe au poste.', 0]]);

    S.defs = el('defs');
    const cpF = el('clipPath', { id: 'frameClip' }, S.defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cpF);
    const cpG = el('clipPath', { id: 'gridClip' }, S.defs);
    el('rect', { x: INNER.x, y: INNER.y, width: INNER.w, height: INNER.h }, cpG);
    const blur = el('filter', { id: 'blur', x: '-20%', y: '-20%', width: '140%', height: '150%' }, S.defs);
    el('feGaussianBlur', { stdDeviation: 12 }, blur);
    const blurS = el('filter', { id: 'blurS', x: '-50%', y: '-50%', width: '200%', height: '200%' }, S.defs);
    el('feGaussianBlur', { stdDeviation: 3 }, blurS);
    const glow = el('radialGradient', { id: 'glow' }, S.defs);
    [[0, 0.72], [0.5, 0.34], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': C.yellow, 'stop-opacity': a }, glow));
    // L'ombre du calque ne se voit qu'autour de la feuille (pas à travers)
    const mask = el('mask', { id: 'calShadow', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1080, height: 1350 }, S.defs);
    el('rect', { x: -400, y: -400, width: 1880, height: 2150, fill: C.white }, mask);
    el('rect', { x: CAL.x, y: CAL.y, width: CAL.w, height: CAL.h, rx: 4, fill: '#000' }, mask);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Le plan : papier quadrillé, double cadre, repères, cartouche -----
    el('rect', { x: SHEET.x, y: SHEET.y, width: SHEET.w, height: SHEET.h, rx: 8, fill: PLAN_BG });
    const grid = el('g', { 'clip-path': 'url(#gridClip)' });
    for (let x = INNER.x + 20; x < INNER.x + INNER.w; x += 20) el('line', { x1: x, y1: INNER.y, x2: x, y2: INNER.y + INNER.h, stroke: (x - INNER.x) % 100 ? GRID_MIN : GRID_MAJ, 'stroke-width': (x - INNER.x) % 100 ? 1 : 1.4 }, grid);
    for (let y = INNER.y + 20; y < INNER.y + INNER.h; y += 20) el('line', { x1: INNER.x, y1: y, x2: INNER.x + INNER.w, y2: y, stroke: (y - INNER.y) % 100 ? GRID_MIN : GRID_MAJ, 'stroke-width': (y - INNER.y) % 100 ? 1 : 1.4 }, grid);
    el('rect', { x: SHEET.x, y: SHEET.y, width: SHEET.w, height: SHEET.h, rx: 8, fill: 'none', stroke: C.blue, 'stroke-opacity': 0.35, 'stroke-width': 2 });
    el('rect', { x: INNER.x, y: INNER.y, width: INNER.w, height: INNER.h, fill: 'none', stroke: C.blue, 'stroke-opacity': 0.75, 'stroke-width': 1.6 });
    // Repères de centrage au milieu de chaque bord
    [[INNER.x + INNER.w / 2, INNER.y, 0, 1], [INNER.x + INNER.w / 2, INNER.y + INNER.h, 0, -1], [INNER.x, INNER.y + INNER.h / 2, 1, 0], [INNER.x + INNER.w, INNER.y + INNER.h / 2, -1, 0]]
      .forEach(([x, y, ux, uy]) => el('path', { d: `M ${x} ${y} l ${ux * 12} ${uy * 12} M ${x - uy * 6} ${y - ux * 6} l ${uy * 12} ${ux * 12}`, stroke: C.blue, 'stroke-opacity': 0.6, 'stroke-width': 1.6, fill: 'none' }));

    // Étapes du process (traits nets, flèches pleines)
    STEPS.forEach((st, i) => {
      const bx = BX[i], by = BOX.y, cx = bx + BOX.w / 2;
      el('rect', { x: bx, y: by, width: BOX.w, height: BOX.h, rx: 5, fill: '#fbfcff', stroke: C.blue, 'stroke-width': 2.5 });
      const op = text(D.svg, bx + 10, by + 19, st.op, { size: 12, weight: 800, fill: AXIS });
      op.setAttribute('letter-spacing', 1);
      ICONS[st.icon](el('g', { transform: `translate(${cx} ${by + 40})` }));
      fit(text(D.svg, cx, by + 84, st.name, { size: 21, weight: 800, fill: C.blue, anchor: 'middle' }), bx + BOX.w - 6, `étape ${i + 1} nom`, bx + 6);
      fit(text(D.svg, cx, by + 105, st.spec, { size: 14, weight: 500, fill: SPEC, anchor: 'middle' }), bx + BOX.w - 5, `étape ${i + 1} spéc`, bx + 5);
      if (i < 3) {
        const x1 = bx + BOX.w + 8, x2 = BX[i + 1] - 6;
        el('line', { x1, y1: FLOW_Y, x2: x2 - 10, y2: FLOW_Y, stroke: C.blue, 'stroke-width': 2.5 });
        el('path', { d: `M ${x2} ${FLOW_Y} L ${x2 - 13} ${FLOW_Y - 6.5} L ${x2 - 13} ${FLOW_Y + 6.5} Z`, fill: C.blue });
      }
    });

    // Cartouche (en bas à droite, hors du calque)
    el('rect', { x: CART.x, y: CART.y, width: CART.w, height: CART.h, fill: '#f8f9fe', stroke: C.blue, 'stroke-width': 1.6 });
    el('line', { x1: CART.x, y1: CART.y + 28, x2: CART.x + CART.w, y2: CART.y + 28, stroke: C.blue, 'stroke-width': 1.2 });
    el('line', { x1: CART.x + 172, y1: CART.y, x2: CART.x + 172, y2: CART.y + 28, stroke: C.blue, 'stroke-width': 1.2 });
    const ct = text(D.svg, CART.x + 12, CART.y + 19, 'PLAN DU PROCESS', { size: 12, weight: 800, fill: C.blue });
    ct.setAttribute('letter-spacing', 1.2);
    fit(ct, CART.x + 166, 'cartouche titre', CART.x);
    fit(text(D.svg, CART.x + 206, CART.y + 19, `Rév.${NB}C`, { size: 12, weight: 700, fill: AXIS, anchor: 'middle' }), CART.x + CART.w - 4, 'cartouche rév', CART.x + 174);
    fit(text(D.svg, CART.x + 12, CART.y + 62, 'tel qu’il a été conçu', { size: 19, weight: 700, fill: C.blue }), CART.x + CART.w - 8, 'cartouche conçu', CART.x);

    // Légende du plan (bas droite, hors du calque)
    const LY = CART.y + 50, LR = INNER.x + INNER.w - 16;
    const lg2 = text(D.svg, LR, LY, 'Flux prévu', { size: 15, weight: 700, fill: C.blue, anchor: 'end' });
    const ax = lg2.getBBox().x - 12;
    el('line', { x1: ax - 40, y1: LY - 5, x2: ax - 10, y2: LY - 5, stroke: C.blue, 'stroke-width': 2.5 });
    el('path', { d: `M ${ax} ${LY - 5} L ${ax - 12} ${LY - 11} L ${ax - 12} ${LY + 1} Z`, fill: C.blue });
    const lg1 = text(D.svg, ax - 70, LY, 'Opération', { size: 15, weight: 700, fill: C.blue, anchor: 'end' });
    const bxl = lg1.getBBox().x - 40;
    el('rect', { x: bxl, y: LY - 15, width: 30, height: 20, rx: 3, fill: '#fbfcff', stroke: C.blue, 'stroke-width': 2 });
    const lg3 = text(D.svg, bxl, LY - 28, 'LÉGENDE', { size: 11, weight: 800, fill: AXIS });
    lg3.setAttribute('letter-spacing', 1.4);
    fit(lg1, LR, 'légende opération', CART.x + CART.w + 20);

    // ----- L'analyse de l'expert, sur le plan seul -----
    S.expert = el('g');
    S.trail = el('line', { x1: BX[0] + BOX.w / 2, y1: 660, x2: BX[0] + BOX.w / 2, y2: 660, stroke: C.blue, 'stroke-width': 1.6, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round' }, S.expert);
    STEPS.forEach((_, i) => {
      const cx = BX[i] + BOX.w / 2;
      const tick = el('g', {}, S.expert);
      el('line', { x1: cx, y1: 654, x2: cx, y2: 666, stroke: C.blue, 'stroke-width': 1.6 }, tick);
      const k = el('g', {}, tick);
      const kx = BX[i] + BOX.w - 2, ky = BOX.y + 2;
      el('circle', { cx: kx, cy: ky, r: 12, fill: C.blue, stroke: PLAN_BG, 'stroke-width': 2.5 }, k);
      el('path', { d: `M ${kx - 5.5} ${ky + 0.5} L ${kx - 1.5} ${ky + 4.5} L ${kx + 5.5} ${ky - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, k);
      S.ticks.push({ g: tick, k, kx, ky });
    });
    // « Cause : introuvable sur le plan »
    S.tag = el('g', {}, S.expert);
    const TX = 548, TY = 574;
    const tr = el('rect', { x: TX, y: TY - 20, height: 40, rx: 20, fill: C.white, stroke: C.blue, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, S.tag);
    el('circle', { cx: TX + 22, cy: TY, r: 12.5, fill: C.blue }, S.tag);
    text(S.tag, TX + 22, TY + 6.5, '?', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
    const tt = text(S.tag, TX + 44, TY + 6.5, `Cause${NB}: introuvable sur le plan`, { size: 18, weight: 700, fill: C.blue });
    tr.setAttribute('width', f2(tt.getBBox().width + 62));
    fit(tr, INNER.x + INNER.w - 12, 'étiquette cause introuvable');
    S.tagC = [TX + (tt.getBBox().width + 62) / 2, TY];
    // Viseur de l'expert
    S.cross = el('g', {}, S.expert);
    el('circle', { cx: 0, cy: 0, r: 12, fill: C.white, 'fill-opacity': 0.6, stroke: C.blue, 'stroke-width': 2.5 }, S.cross);
    el('path', { d: 'M -21 0 H -6 M 6 0 H 21 M 0 -21 V -6 M 0 6 V 21', stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.cross);
    el('circle', { cx: 0, cy: 0, r: 2.4, fill: C.blue }, S.cross);
    const xr = el('rect', { x: 16, y: -42, height: 24, rx: 12, fill: C.blue }, S.cross);
    const xt = text(S.cross, 28, -25, 'L’expert', { size: 14, weight: 700, fill: C.white });
    xr.setAttribute('width', f2(xt.getBBox().width + 24));

    // ----- Le calque (dans le cadre : il entre et sort par les bords) -----
    const calClip = el('g', { 'clip-path': 'url(#frameClip)' });
    S.cal = el('g', {}, calClip);
    S.calShadow = el('rect', { x: CAL.x, y: CAL.y, width: CAL.w, height: CAL.h, rx: 4, fill: C.ink, filter: 'url(#blur)', mask: 'url(#calShadow)', opacity: 0 }, S.cal);
    el('rect', { x: CAL.x, y: CAL.y, width: CAL.w, height: CAL.h, rx: 4, fill: C.card, 'fill-opacity': 0.6, stroke: '#c6c6d8', 'stroke-width': 1.5 }, S.cal);
    // Ruban adhésif aux coins du haut
    S.tapes = [[CAL.x + 14, CAL.y + 4, -38], [CAL.x + CAL.w - 14, CAL.y + 4, 38]].map(([x, y, a]) => {
      const g = el('g', {}, S.cal);
      el('rect', { x: -36, y: -12, width: 72, height: 24, rx: 2, fill: C.yellow, 'fill-opacity': 0.42 }, g);
      el('path', { d: 'M -36 -12 l 4 6 l -4 6 l 4 6 l -4 6 M 36 -12 l -4 6 l 4 6 l -4 6 l 4 6', fill: 'none', stroke: C.white, 'stroke-opacity': 0.7, 'stroke-width': 1.4 }, g);
      return { g, x, y, a };
    });

    // Les causes qui s'allument (sous les traits)
    const LIGHTS = [[BX[0] + BOX.w / 2, FLOW_Y + 6, 118], [BX[1] + BOX.w / 2, FLOW_Y + 40, 92], [800, 890, 86]];
    const lightLayer = el('g', {}, S.cal);
    LIGHTS.forEach(([cx, cy, r]) => {
      const g = el('g', {}, lightLayer);
      const glowC = el('circle', { cx, cy, r, fill: 'url(#glow)' }, g);
      const ping = el('circle', { cx, cy, r: 30, fill: 'none', stroke: C.yellow, 'stroke-width': 3 }, g);
      S.lights.push({ g, glowC, ping, cx, cy, r });
    });

    const ink = el('g', {}, S.cal);
    const ops = [];
    const add = (obj, dur, gap, ease = smooth) => ops.push({ obj, dur, gap, ease, ann: A_T.length - 1 });

    // 1 · la matière du lundi matin : on entoure l'étape
    A_T.push([]);
    const e1 = stroke(ink, loopPath(BX[0] + BOX.w / 2, FLOW_Y + 2, 106, 84, -2.5, 2 * Math.PI + 0.55, 0.7), { width: 3.6 });
    const n1 = numberMark(ink, 136, 588, '1', 1);
    const l1a = hand(ink, 160, 596, 'La matière, le lundi matin,', { rot: -1.2, seed: 2 });
    const l1b = hand(ink, 166, 628, 'se comporte différemment', { rot: -0.8, seed: 3 });
    add(e1, 0.34, 0); add(n1, 0.15, 0.08); add(l1a, 0.34, 0.05, p => p); add(l1b, 0.32, 0.04, p => p);

    // 2 · le réglage retouché « au feeling » : on rature la fiche de réglage
    A_T.push([]);
    const sx = BX[1] + BOX.w / 2;
    const s2 = stroke(ink, wavy(sx - 66, BOX.y + 99, sx + 64, BOX.y + 98, 1.8, 3.5, 0.4), { width: 3.2 });
    const s2b = stroke(ink, wavy(sx + 60, BOX.y + 103, sx - 62, BOX.y + 104, 1.4, 3, 1.3), { width: 2.6 });
    const n2 = numberMark(ink, 532, 588, '2', 4);
    const l2a = hand(ink, 556, 596, `Réglage retouché «${NB}au feeling${NB}»`, { rot: -1, seed: 5 });
    const l2b = hand(ink, 562, 628, 'après chaque changement de série', { rot: -0.6, seed: 6 });
    const a2 = arrow(ink, 584, 642, 530, 646, BX[1] + BOX.w - 14, BOX.y - 6, { width: 3.2 });
    add(chain([[s2, 3], [s2b, 2]]), 0.22, 0.1); add(n2, 0.15, 0.08); add(l2a, 0.36, 0.05, p => p); add(l2b, 0.36, 0.04, p => p); add(a2, 0.2, 0.05);

    // 3 · la pièce mise de côté : un détour hors du flux, vers une caisse dessinée
    A_T.push([]);
    const pieceLayer = el('g', {}, S.cal);
    S.piece = el('g', {}, pieceLayer);
    S.pieceShadow = el('ellipse', { cx: 0, cy: 16, rx: 20, ry: 4, fill: C.ink, opacity: 0, filter: 'url(#blurS)' }, S.piece);
    S.pieceBody = el('g', {}, S.piece);
    el('rect', { x: -22, y: -12, width: 44, height: 24, rx: 5, fill: C.lightBlue, stroke: C.ink, 'stroke-width': 2.2 }, S.pieceBody);
    el('circle', { cx: 0, cy: 0, r: 5, fill: C.white, stroke: C.ink, 'stroke-width': 1.8 }, S.pieceBody);
    el('line', { x1: -15, y1: -5, x2: -15, y2: 5, stroke: C.ink, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, S.pieceBody);
    el('line', { x1: 15, y1: -5, x2: 15, y2: 5, stroke: C.ink, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, S.pieceBody);
    const crate = el('g', {}, S.cal);
    S.crateFill = el('path', { d: 'M 754 870 L 846 868 L 842 922 L 758 924 Z', fill: '#fbfbf8' }, crate);
    const d3 = arrow(ink, 784, 768, 778, 818, 798, 852, { width: 3.4 });
    const c3 = stroke(crate, 'M 752 871 L 847 868 L 842 923 L 757 924 Z', { width: 3.2 });
    const c3b = stroke(crate, 'M 760 890 L 840 888 M 759 907 L 839 906', { width: 2.4 });
    const n3 = numberMark(ink, 330, 894, '3', 7);
    const l3a = hand(ink, 354, 902, `La pièce qu’on met de côté${NB}:`, { rot: -0.9, seed: 8 });
    const l3b = hand(ink, 360, 934, 'on sait qu’elle posera problème', { rot: -0.5, seed: 9 });
    add(d3, 0.28, 0.1); add(chain([[c3, 3], [c3b, 1]]), 0.28, 0.04); add(n3, 0.15, 0.08); add(l3a, 0.34, 0.05, p => p); add(l3b, 0.34, 0.04, p => p);

    // Le titre du calque, écrit d'avance, au-dessus du cartouche du plan
    const lab = hand(ink, CAL.x + 18, CAL.y + CAL.h - 18, 'tel qu’il fonctionne', { size: 24, rot: -1.4, seed: 10 });
    lab.show(1);

    // « cause » : étiquettes posées quand la cause s'allume
    S.causeTags = [[BX[0] + BOX.w / 2, 856], [BX[1] + BOX.w / 2, 856], [904, 898]].map(([cx, cy]) => {
      const g = el('g', {}, S.cal);
      const r = el('rect', { y: cy - 13, height: 26, rx: 13, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, g);
      const t = text(g, cx, cy + 5.5, 'CAUSE', { size: 14, weight: 800, fill: C.tYellow, anchor: 'middle' });
      t.setAttribute('letter-spacing', 1.4);
      const w = t.getBBox().width + 26;
      r.setAttribute('x', f2(cx - w / 2));
      r.setAttribute('width', f2(w));
      return { g, cx, cy };
    });

    // Le stylo (au-dessus de tout, sur le calque)
    S.penShadow = el('ellipse', { cx: 0, cy: 0, rx: 22, ry: 6, fill: C.ink, opacity: 0, filter: 'url(#blurS)' }, S.cal);
    S.pen = el('g', {}, S.cal);
    const pb = el('g', { transform: 'rotate(-52)' }, S.pen);
    el('path', { d: 'M 0 0 L 13 -4.5 L 13 4.5 Z', fill: C.red }, pb);
    el('rect', { x: 12, y: -6, width: 8, height: 12, rx: 1.5, fill: C.ink }, pb);
    el('rect', { x: 19, y: -8, width: 58, height: 16, rx: 4, fill: C.white, stroke: C.ink, 'stroke-width': 2 }, pb);
    el('rect', { x: 62, y: -8.5, width: 18, height: 17, rx: 4, fill: C.red }, pb);
    el('rect', { x: 30, y: -3, width: 26, height: 6, rx: 3, fill: C.red, 'fill-opacity': 0.25 }, pb);

    // Contrôles des textes manuscrits (bornes dans le calque, sans chevauchement entre notes)
    const hw = [[l1a, 'note 1a', 530], [l1b, 'note 1b', 530], [l2a, 'note 2a', CAL.x + CAL.w - 10], [l2b, 'note 2b', CAL.x + CAL.w - 10], [l3a, 'note 3a', 748], [l3b, 'note 3b', 748], [lab, 'titre du calque', 380]];
    hw.forEach(([h, label, maxR]) => { if (h.right > maxR || h.left < CAL.x + 8) console.error(`Débordement : ${label} (${Math.round(h.left)} → ${Math.round(h.right)})`); });

    // Planning des gestes
    let tc = T_ANN;
    ops.forEach(o => { o.t0 = tc + o.gap; tc = o.t0 + o.dur; const a = A_T[o.ann]; if (a.length === 0) a.push(o.t0); a[1] = tc; });
    S.ops = ops;
    T_PIECE = A_T[2][0] - 0.06;
    T_CRATE = ops[ops.indexOf(ops.find(o => o.ann === 2)) + 1].t0 + 0.28;  // fin du dessin de la caisse
    T_HOP = T_CRATE + 0.02;
    T_PEN_OUT = tc + 0.05;
    T_LIGHT = [0, 1, 2].map(k => tc + 0.18 + 0.16 * k);
    T_P3 = T_LIGHT[2] + 0.15;

    // ----- L'équipe, en haut à droite (présence) -----
    S.team = el('g');
    AV_X.forEach((cx, i) => {
      const ring = el('circle', { cx, cy: AV_Y, r: AV_R + 6, fill: 'none', stroke: C.red, 'stroke-width': 3, opacity: 0 }, S.team);
      S.rings.push(ring);
      avatar(S.team, cx, AV_Y, AV_COL[i]);
    });
    AV_X.forEach((cx, i) => {
      const bx = cx + 15, by = AV_Y + 14;
      // Analyse présentée : on valide (✓) ou on se tait (…)
      const b1 = el('g', {}, S.team);
      if (i === 1) {
        el('circle', { cx: bx, cy: by, r: 10, fill: '#b6b6d4', stroke: C.white, 'stroke-width': 2.5 }, b1);
        [-4, 0, 4].forEach(k => el('circle', { cx: bx + k, cy: by, r: 1.5, fill: C.white }, b1));
      } else {
        el('circle', { cx: bx, cy: by, r: 10, fill: C.green, stroke: C.white, 'stroke-width': 2.5 }, b1);
        el('path', { d: `M ${bx - 4.5} ${by + 0.5} L ${bx - 1.2} ${by + 3.8} L ${bx + 4.5} ${by - 2.8}`, fill: 'none', stroke: C.white, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b1);
      }
      S.b1.push({ g: b1, bx, by });
      // Analyse menée avec : chacun cherche (son numéro d'annotation)
      const b2 = el('g', {}, S.team);
      el('circle', { cx: bx, cy: by, r: 10.5, fill: C.red, stroke: C.white, 'stroke-width': 2.5 }, b2);
      text(b2, bx, by + 4.5, String(i + 1), { size: 13, weight: 800, fill: C.white, anchor: 'middle' });
      S.b2.push({ g: b2, bx, by });
    });
    const SX = AV_X[0] - AV_R - 16;
    S.st1 = text(S.team, SX, AV_Y + 6.5, 'Chacun valide, ou se tait.', { size: 18, weight: 700, fill: MUTED, anchor: 'end' });
    S.st2 = text(S.team, SX, AV_Y + 6.5, 'Chacun cherche.', { size: 18, weight: 700, fill: C.tRed, anchor: 'end' });

    // ----- Pastilles d'étape -----
    S.pills = [
      pillShape(D.svg, 92, PILL_Y, `1${NB}·${NB}Analyse présentée à l’équipe`, { bg: C.blue, fg: C.white }),
      pillShape(D.svg, 92, PILL_Y, `2${NB}·${NB}Analyse menée avec l’équipe`, { bg: C.blue, fg: C.white }),
      pillShape(D.svg, 92, PILL_Y, 'Les causes étaient sur le terrain', { bg: C.pGreen, fg: C.tGreen, icon: true }),
    ];
    S.pills.forEach((p, i) => fit(p.g, 1000, `pastille ${i + 1}`));
    // Pastille et texte d'état de l'équipe ne doivent jamais se toucher
    const pillRight = Math.max(...S.pills.map(p => 92 + p.w));
    [S.st1, S.st2].forEach((n, i) => { if (n.getBBox().x < pillRight + 16) console.error(`Chevauchement : pastille / état de l'équipe ${i + 1}`); });

    D.encart(['Aller plus loin', 'Toutes nos ressources Lean', '(lien en commentaire)']);
  }

  // ---------- Le stylo : où est sa pointe à l'instant t ----------
  const PEN_HOME = [1090, 880];
  function penAt(t) {
    const ops = S.ops;
    if (t < T_PEN_IN || t > T_PEN_OUT + 0.45) return null;
    const lifted = (a, b, q) => ({ x: lerp(a[0], b[0], easeInOut(q)), y: lerp(a[1], b[1], easeInOut(q)), l: Math.sin(Math.PI * q) });
    if (t < ops[0].t0) {
      const q = prog(t, T_PEN_IN, ops[0].t0 - T_PEN_IN);
      const p = lifted(PEN_HOME, ops[0].obj.tip(0), q);
      p.l = Math.max(p.l, 1 - q); p.o = clamp(q / 0.3);
      return p;
    }
    for (let i = 0; i < ops.length; i++) {
      const o = ops[i];
      if (t <= o.t0 + o.dur) { const [x, y] = o.obj.tip(o.ease(prog(t, o.t0, o.dur))); return { x, y, l: 0, o: 1 }; }
      const nx = ops[i + 1];
      if (nx && t < nx.t0) return { ...lifted(o.obj.tip(1), nx.obj.tip(0), prog(t, o.t0 + o.dur, nx.t0 - o.t0 - o.dur)), o: 1 };
    }
    const q = prog(t, T_PEN_OUT, 0.45);
    const p = lifted(ops[ops.length - 1].obj.tip(1), PEN_HOME, q);
    p.l = Math.max(p.l, q); p.o = 1 - prog(q, 0.6, 0.4);
    return p;
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_SEQ;                     // état final (le calque se retire à partir de T_LIFT)
    const out = final ? prog(t, T_LIFT, 0.15) : 0;

    // ----- Le calque : posé, retiré, puis reposé -----
    let dx = 0, dy = 0, rot = 0, sc = 1, sh = 0, op = 1;
    if (final) {
      const a = prog(t, T_LIFT, LIFT_UP), b = prog(t, T_LIFT + LIFT_UP, LIFT_SLIDE);
      sc = 1 + 0.014 * easeOut(a); sh = easeOut(a);
      const q = easeIn(b);
      dx = 1000 * q; dy = -40 * q; rot = 3 * q;
    } else if (t < T_DROP) op = 0;
    else if (t < T_LAND) {
      const p = prog(t, T_DROP, DROP), damp = 1 - p;
      dy = -80 * (1 - easeOut(p));
      dx = 18 * Math.sin(2 * Math.PI * 1.2 * p) * damp;
      rot = -3.5 * Math.cos(2 * Math.PI * 1.2 * p) * damp;
      sc = 1 + 0.05 * (1 - easeOut(p));
      sh = 1 - easeIn(p);
      op = clamp(p / 0.2);
    } else {
      const p = prog(t, T_LAND, 0.2);
      if (p < 1) sc = 1 - 0.006 * Math.sin(Math.PI * p);
    }
    S.cal.setAttribute('opacity', f2(op));
    S.cal.setAttribute('transform', `translate(${f2(dx)} ${f2(dy)}) translate(${CAL_C[0]} ${CAL_C[1]}) rotate(${f2(CAL_ROT + rot)}) scale(${sc.toFixed(4)}) translate(${-CAL_C[0]} ${-CAL_C[1]})`);
    S.calShadow.setAttribute('opacity', f2(0.32 * sh));
    S.calShadow.setAttribute('y', f2(CAL.y + 20 * sh));
    S.tapes.forEach((tp, i) => {
      const p = final ? 1 : prog(t, T_TAPE[i], 0.22);
      const k = p <= 0 ? 0.001 : 1 + 0.25 * (1 - easeOut(p));
      tp.g.setAttribute('opacity', f2(final ? 1 : clamp(p / 0.3)));
      tp.g.setAttribute('transform', `translate(${tp.x} ${tp.y}) rotate(${tp.a}) scale(${f2(k)})`);
    });

    // ----- Les gestes de l'équipe -----
    S.ops.forEach(o => o.obj.show(final ? 1 : o.ease(prog(t, o.t0, o.dur))));
    const cf = final ? 1 : prog(t, T_CRATE - 0.06, 0.15);
    S.crateFill.setAttribute('opacity', f2(cf));

    // La pièce : posée sur le flux, puis mise de côté (arc, ombre, tassement à l'arrivée)
    const P0 = [780, FLOW_Y], P1 = [800, 852];
    let px = P1[0], py = P1[1], pk = 1, sxk = 1, syk = 1, po = 1, air = 0, pr = -13;
    if (!final) {
      const pin = prog(t, T_PIECE, 0.3);
      if (pin <= 0) po = 0;
      const u = prog(t, T_HOP, 0.5);
      if (u <= 0) { px = P0[0]; py = P0[1]; pk = popScale(pin); pr = 0; }
      else if (u < 1) {
        const q = easeInOut(u);
        px = lerp(P0[0], P1[0], q); py = lerp(P0[1], P1[1], q) - 58 * Math.sin(Math.PI * q);
        pk = 1 + 0.1 * Math.sin(Math.PI * q); air = Math.sin(Math.PI * q); pr = -13 * q;
      } else {
        const v = (t - T_HOP - 0.5) / 0.16;
        if (v < 1) { const s = Math.sin(Math.PI * v); syk = 1 - 0.14 * s; sxk = 1 + 0.08 * s; }
      }
    }
    S.piece.setAttribute('opacity', f2(po));
    S.piece.setAttribute('transform', `translate(${f2(px)} ${f2(py)})`);
    S.pieceBody.setAttribute('transform', `translate(0 12) scale(${f2(pk * sxk)} ${f2(pk * syk)}) translate(0 -12)` + (air ? ` translate(0 ${f2(-6 * air)})` : '') + (pr ? ` rotate(${f2(pr)})` : ''));
    S.pieceShadow.setAttribute('opacity', f2(0.3 * air));

    // Le stylo
    const pen = final ? null : penAt(t);
    if (pen) {
      S.pen.setAttribute('opacity', f2(pen.o));
      S.pen.setAttribute('transform', `translate(${f2(pen.x)} ${f2(pen.y - 10 * pen.l)})` + (pen.l ? ` scale(${f2(1 + 0.05 * pen.l)})` : ''));
      S.penShadow.setAttribute('opacity', f2(0.25 * pen.l * pen.o));
      S.penShadow.setAttribute('transform', `translate(${f2(pen.x + 22)} ${f2(pen.y + 6)})`);
    } else {
      S.pen.setAttribute('opacity', 0);
      S.penShadow.setAttribute('opacity', 0);
    }

    // Les causes s'allument
    S.lights.forEach((L, k) => {
      const p = final ? 1 : prog(t, T_LIGHT[k], 0.35);
      L.glowC.setAttribute('opacity', f2(p));
      scaleAt(L.glowC, L.cx, L.cy, popScale(p));
      const pp = final ? 1 : prog(t, T_LIGHT[k], 0.75);
      L.ping.setAttribute('r', f2(30 + (L.r - 10) * easeOut(pp)));
      L.ping.setAttribute('opacity', f2(pp > 0 && pp < 1 ? 0.9 * (1 - pp) : 0));
    });
    S.causeTags.forEach((c, k) => {
      const p = final ? 1 : prog(t, T_LIGHT[k] + 0.1, 0.35);
      c.g.setAttribute('opacity', f2(clamp(p / 0.4)));
      scaleAt(c.g, c.cx, c.cy, popScale(p));
    });

    // ----- L'analyse de l'expert (plan seul) -----
    const eo = final ? 0 : clamp((t - T_P1 + 0.05) / 0.2) * (1 - prog(t, T_OFF, 0.2));
    S.expert.setAttribute('opacity', f2(eo));
    // Le viseur : entre, s'arrête sur chaque étape, puis cherche la cause
    const stopX = BX.map(x => x + BOX.w / 2);
    let cxp = stopX[0] - 90, cyp = 660, co = 0;
    if (!final && t >= T_X_IN) {
      co = clamp((t - T_X_IN) / 0.15) * (1 - prog(t, T_X_OUT, 0.2));
      if (t < STOP[0]) cxp = lerp(stopX[0] - 90, stopX[0], easeOut(prog(t, T_X_IN, STOP[0] - T_X_IN)));
      else if (t < STOP[3]) {
        for (let i = 0; i < 3; i++) if (t < STOP[i + 1]) { cxp = lerp(stopX[i], stopX[i + 1], easeInOut(prog(t, STOP[i] + 0.08, STOP[i + 1] - STOP[i] - 0.08))); break; }
      } else if (t < T_X_TAG) {
        const q = easeInOut(prog(t, STOP[3] + 0.08, T_X_TAG - STOP[3] - 0.08));
        cxp = lerp(stopX[3], 600, q); cyp = lerp(660, 646, q);
      } else {
        const w = prog(t, T_X_TAG, 0.45);
        cxp = 600 + 14 * Math.sin(w * Math.PI * 2) * (1 - w); cyp = 646 + 6 * Math.sin(w * Math.PI * 4) * (1 - w);
      }
    }
    S.cross.setAttribute('transform', `translate(${f2(cxp)} ${f2(cyp)})`);
    S.cross.setAttribute('opacity', f2(co));
    // Le tracé de mesure qui suit le viseur, jusqu'à la dernière étape
    S.trail.setAttribute('x2', f2(clamp(cxp, stopX[0], stopX[3])));
    S.trail.setAttribute('opacity', !final && t >= STOP[0] ? 1 : 0);
    S.ticks.forEach((k, i) => {
      const p = final ? 0 : prog(t, STOP[i] + 0.03, 0.3);
      k.g.setAttribute('opacity', f2(clamp(p / 0.3)));
      scaleAt(k.k, k.kx, k.ky, popScale(p));
    });
    const pt = final ? 0 : prog(t, T_X_TAG, 0.35);
    S.tag.setAttribute('opacity', f2(clamp(pt / 0.4)));
    scaleAt(S.tag, S.tagC[0], S.tagC[1], popScale(pt));

    // ----- L'équipe -----
    S.b1.forEach((b, i) => {
      const p = final ? 0 : prog(t, T_B1[i], 0.3) * (1 - prog(t, T_OFF, 0.12));
      b.g.setAttribute('opacity', f2(clamp(p / 0.4)));
      scaleAt(b.g, b.bx, b.by, t < T_OFF ? popScale(p) : Math.max(p, 0.001));
    });
    S.b2.forEach((b, i) => {
      const p = final ? 1 - out : prog(t, A_T[i][0], 0.3);
      b.g.setAttribute('opacity', f2(clamp(p / 0.4)));
      scaleAt(b.g, b.bx, b.by, final ? Math.max(p, 0.001) : popScale(p));
      const on = !final && t >= A_T[i][0] - 0.05 && t < A_T[i][1] + 0.15;
      S.rings[i].setAttribute('opacity', on ? f2(0.55 + 0.45 * Math.cos((t - A_T[i][0]) * Math.PI * 2 / 0.6)) : 0);
    });
    S.st1.setAttribute('opacity', f2(final ? 0 : prog(t, T_ST1, 0.25) * (1 - prog(t, T_OFF, 0.12))));
    S.st2.setAttribute('opacity', f2(final ? 1 - out : prog(t, T_ST2, 0.25)));

    // ----- Pastilles d'étape : l'ancienne sort avant que la nouvelle entre -----
    const T_PILL = [T_P1, T_P2, T_P3];
    S.pills.forEach((p, i) => {
      const a = T_PILL[i] + (i ? 0.12 : 0);
      let o;
      if (i === 2) o = final ? 1 - out : prog(t, a, 0.25);
      else o = final ? 0 : prog(t, a, 0.25) * (1 - prog(t, T_PILL[i + 1], 0.12));
      const dyp = final ? 0 : 8 * (1 - prog(t, a, 0.25));
      p.g.setAttribute('opacity', f2(o));
      p.g.setAttribute('transform', dyp ? `translate(0 ${f2(dyp)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
