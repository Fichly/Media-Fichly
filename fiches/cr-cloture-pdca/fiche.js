// Fiche LinkedIn · Clément Raymond · jeudi 22 octobre 2026
// Post : « La plupart des problèmes qui reviennent avaient été correctement analysés. »
// Premier commentaire du post (Buffer) : notre article sur la méthode PDCA → encart.
// Le visuel est la pièce maîtresse : l'enregistreur du taux de défauts. Le résultat est un curseur relié
// par un élastique à son ancienne position. La solution (un poids) le tire vers le bas, on clôt le sujet,
// le calendrier défile ; un nouvel opérateur, une autre équipe, une urgence de production tirent sur
// l'élastique, la solution lâche et le curseur revient en claquant. On rejoue : les quatre vérifications
// deviennent quatre épingles, l'élastique tire encore, le résultat tient, le « A » du PDCA s'allume.
// Style propre : l'élastique (tension, claquement, ressort amorti) sur un papier d'enregistreur qui défile.
// Image t = 0 = état final. Boucle de 14 s.
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
  const soft = p => p - 0.6 * Math.sin(2 * Math.PI * p) / (2 * Math.PI);   // départ et arrivée adoucis
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const backP = p => (p <= 0 ? 0 : p >= 1 ? 1 : back(p));
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const damp = (u, a, w) => (u <= 0 ? 0 : Math.exp(-a * u) * Math.sin(w * u));   // oscillation amortie
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const mod = (a, n) => ((a % n) + n) % n;
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  const scaleAt = (k, x, y) => (k === 1 ? '' : `translate(${f2(x)} ${f2(y)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-x)} ${f2(-y)})`);
  // Invisible = display none (boucle stable au contrôle cmp)
  const show = (n, o) => {
    if (o <= 0.002) { n.setAttribute('display', 'none'); return; }
    n.setAttribute('display', 'inline');
    n.setAttribute('opacity', f2(Math.min(1, o)));
  };
  const NB = ' ';
  const pct = v => `${v.toFixed(1).replace('.', ',')}${NB}%`;
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', GRID = '#e4e4ef', TICK = '#a3a3c2', DASH = '#b6b6d4', RED_SOFT = '#c25b5b';
  const OFF_TITLE = '#a9a9c6', OFF_SUB = '#c0c0d8';
  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const K = 58, BASE = 960;                         // 58 px par point de pourcentage, 0 % au sol du papier
  const yOf = v => BASE - v * K;
  const V_OLD = 6.2, V_NEW = 1.4;                   // taux de défauts avant / après (inventés)
  const Y_OLD = yOf(V_OLD);
  const NOW_X = 640, PW = 150, PH = 66, NIB = 8;    // le curseur
  const PEN_X = NOW_X - PW / 2 - NIB;               // pointe du curseur = bout du tracé
  const PAPER_X0 = 120;
  const M_END = 10.5, M_LEFT = -0.4;                // fenêtre du papier sur l'image finale (mois)
  const PXM = (PEN_X - PAPER_X0) / (M_END - M_LEFT);
  const TAG_X = 732, TAG_Y = [668, 716, 764], TAG_H = 40, PULL = [20, 27, 34];
  const CAL = { x: 812, y: 428, w: 84, h: 78 };
  const WHEEL = { cx: 950, cy: 467, r1: 42, r0: 13 };
  const PANEL = { x: 92, y: 1006, w: 896, h: 120 };
  const STAMP = { x: 856, y: 878 };
  const CREW = { x: 752, y: 952, gap: 34 };          // le groupe de travail qui a trouvé la solution
  const QUOTE = { x: 728, y: 646, w: 270, h: 140 };
  const PIN_POS = [[-57, -19], [57, -19], [-57, 19], [57, 19]];

  // ---------- Chronologie (s) ----------
  const DURATION = 14, END = DURATION - 0.001;
  const T_OUT = 1.2, OUT_DUR = 0.3, T_IN = 1.5, IN_DUR = 0.25;
  const T_ALERT = 1.9;                                   // la cause est trouvée
  const T_P = 1.85, T_D = 2.65, T_C = 3.55;              // P, D, C s'allument
  const W_IN = [2.55, 7.8], W_DROP = [6.72, 12.1];       // poids « Solution » : accroché, puis il lâche
  const T_PULL = [3.3, 8.2], PULL_DUR = [0.7, 0.65];     // la solution tire le curseur vers le bas
  const T_STAMP1 = 4.3, T_SKIP = 4.45;                   // « sujet clos », le A est sauté
  const TAGS1 = [5.6, 5.95, 6.3], TAGS2 = [11.05, 11.38, 11.71], HOOK = 0.18;
  const T_SNAP = W_DROP[0];
  const T_QUOTE = [7.0, 8.9];
  const T_PIN = [9.0, 9.33, 9.66, 9.99], PIN_FALL = 0.2;
  const T_A = 12.35, T_STAMP2 = 12.38;
  const PILLS = [
    [1.6, `1${NB}·${NB}La cause est trouvée`, 'b'],
    [2.45, `2${NB}·${NB}L’action est mise en place`, 'b'],
    [3.25, `3${NB}·${NB}Les résultats s’améliorent`, 'b'],
    [4.2, `4${NB}·${NB}On clôt le sujet`, 'b'],
    [4.9, 'Trois mois plus tard…', 'b'],
    [6.75, 'Le problème revient', 'r'],
    [7.75, `Avant de clôturer${NB}: quatre vérifications`, 'b'],
    [10.3, 'Trois mois plus tard…', 'b'],
    [12.4, 'Le résultat tient', 'g'],
  ];

  // Mois du calendrier en fonction du temps : [t, mois, adouci]
  const MK = [[1.5, 0], [3.3, 0.55], [4.1, 1.4], [4.95, 2.1], [5.6, 5.1, 1], [6.72, 5.3], [7.8, 5.5], [8.2, 5.7],
    [8.85, 6.45], [10.35, 7.55], [11.0, 10.1, 1], [12.4, 10.5]];
  function mOf(s) {
    if (s <= MK[0][0]) return MK[0][1];
    for (let i = 1; i < MK.length; i++) if (s < MK[i][0]) {
      const p = (s - MK[i - 1][0]) / (MK[i][0] - MK[i - 1][0]);
      return lerp(MK[i - 1][1], MK[i][1], MK[i][2] ? soft(p) : p);
    }
    return MK[MK.length - 1][1];
  }

  // Valeur du curseur (taux de défauts, %)
  const CREEP = 0.4, V_SNAP0 = V_NEW + 3 * CREEP;
  const SA = 10, SW = 17;                                // ressort amorti du claquement
  const spring = u => (u > 1 ? V_OLD : V_OLD - (V_OLD - V_SNAP0) * Math.exp(-SA * u) * (Math.cos(SW * u) + SA / SW * Math.sin(SW * u)));
  function dropV(s, k) {
    const t0 = T_PULL[k], d = PULL_DUR[k];
    if (s < t0 + d) return lerp(V_OLD, V_NEW, easeInOut(prog(s, t0, d)));
    return V_NEW - 0.09 * Math.sin(Math.PI * prog(s, t0 + d, 0.22));   // petit tassement en bas
  }
  function value(s) {
    if (s < T_PULL[0]) return V_OLD;
    if (s < TAGS1[0] + HOOK) return dropV(s, 0);
    if (s < T_SNAP) { let v = V_NEW; TAGS1.forEach(ta => { v += CREEP * backP(prog(s, ta + HOOK, 0.25)); }); return v; }
    if (s < T_PULL[1]) return spring(s - T_SNAP);
    return dropV(s, 1);
  }

  // ---------- Petits éléments ----------
  const pt = (cx, cy, r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  function sector(cx, cy, r0, r1, a0, a1) {
    const [x0, y0] = pt(cx, cy, r1, a0), [x1, y1] = pt(cx, cy, r1, a1);
    const [x2, y2] = pt(cx, cy, r0, a1), [x3, y3] = pt(cx, cy, r0, a0);
    const lg = a1 - a0 > 180 ? 1 : 0;
    return `M ${f2(x0)} ${f2(y0)} A ${r1} ${r1} 0 ${lg} 1 ${f2(x1)} ${f2(y1)} L ${f2(x2)} ${f2(y2)} A ${r0} ${r0} 0 ${lg} 0 ${f2(x3)} ${f2(y3)} Z`;
  }
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
  const halo = (n, color = FRAME_BG) => { [['stroke', color], ['stroke-width', 6], ['stroke-linejoin', 'round'], ['paint-order', 'stroke']].forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  const checkMark = (parent, cx, cy, r) => {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: C.green, stroke: C.white, 'stroke-width': 2.5 }, g);
    const k = r / 10;
    el('path', { d: `M ${f2(cx - 4.5 * k)} ${f2(cy + 0.3 * k)} L ${f2(cx - 1.2 * k)} ${f2(cy + 3.6 * k)} L ${f2(cx + 4.8 * k)} ${f2(cy - 3 * k)}`, fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  };
  const ICONS = {
    op(g) {
      el('circle', { cx: 0, cy: -4, r: 4.6, fill: C.white }, g);
      el('path', { d: 'M -8 8 C -8 0.5, 8 0.5, 8 8 Z', fill: C.white }, g);
    },
    team(g) {
      el('circle', { cx: 5, cy: -5, r: 3.6, fill: C.white, 'fill-opacity': 0.75 }, g);
      el('path', { d: 'M -1 6 C -1 -0.5, 11 -0.5, 11 6 Z', fill: C.white, 'fill-opacity': 0.75 }, g);
      el('circle', { cx: -3, cy: -3, r: 4.2, fill: C.white, stroke: C.teal, 'stroke-width': 1.6 }, g);
      el('path', { d: 'M -10.5 9 C -10.5 1.5, 4.5 1.5, 4.5 9 Z', fill: C.white, stroke: C.teal, 'stroke-width': 1.6 }, g);
    },
    alert(g) { text(g, 0, 7, '!', { size: 20, weight: 800, fill: C.white, anchor: 'middle' }); },
  };
  function stampShape(parent, label, { ink, bg }) {
    const g = el('g', {}, parent);
    const outer = el('rect', { y: -26, height: 52, rx: 10, fill: bg, stroke: ink, 'stroke-width': 3 }, g);
    const inner = el('rect', { y: -20, height: 40, rx: 7, fill: 'none', stroke: ink, 'stroke-width': 1.5 }, g);
    const tx = text(g, 0, 6.5, label, { size: 17, weight: 800, fill: ink, anchor: 'middle' });
    tx.setAttribute('letter-spacing', 1.2);
    const w = tx.getBBox().width + 38;
    outer.setAttribute('x', f2(-w / 2)); outer.setAttribute('width', f2(w));
    inner.setAttribute('x', f2(-w / 2 + 6)); inner.setAttribute('width', f2(w - 12));
    fit(tx, w / 2 - 10, `tampon ${label}`, -w / 2 + 10);
    // Le tampon est posé (incliné) à droite du curseur : il doit rester dans le cadre
    if (STAMP.x + w / 2 + 6 > FRAME.x + FRAME.w - 16 || STAMP.x - w / 2 - 6 < NOW_X + PW / 2 + 4)
      console.error(`Débordement : tampon ${label} (${Math.round(STAMP.x - w / 2)} → ${Math.round(STAMP.x + w / 2)})`);
    return { g, w };
  }

  // ---------- Données dérivées ----------
  let TRACE = [], T_CLAC = 0, PEAK = [0, 0];
  const CROSS = [], FLIP = [];
  function precompute() {
    // Tracé de l'enregistreur : l'historique à 6,2 %, puis la valeur du curseur au fil des mois
    TRACE = [[PEN_X - 13 * PXM, Y_OLD], [PEN_X, Y_OLD]];
    let lx = PEN_X, ly = Y_OLD;
    for (let s = T_IN; s <= END + 1e-9; s += 0.004) {
      const x = PEN_X + mOf(s) * PXM, y = yOf(value(s));
      if (Math.abs(x - lx) < 0.3 && Math.abs(y - ly) < 0.3) continue;
      TRACE.push([x, y]); lx = x; ly = y;
    }
    // Instant du claquement (le curseur retrouve l'ancienne position) et sommet du rebond
    for (let s = T_SNAP; s < T_SNAP + 1; s += 0.001) if (value(s) >= V_OLD) { T_CLAC = s; break; }
    let best = Infinity;
    for (let s = T_SNAP; s < T_SNAP + 1; s += 0.002) { const y = yOf(value(s)); if (y < best) { best = y; PEAK = [PEN_X + mOf(s) * PXM, y]; } }
    // Pages du calendrier : instant de passage de chaque mois, durée de la page qui se tourne
    for (let k = 1; k <= 11; k++) for (let s = T_IN; s <= END; s += 0.002) if (mOf(s) >= k) { CROSS[k] = s; break; }
    for (let k = 1; k <= 11; k++) if (CROSS[k] !== undefined) FLIP[k] = Math.min(0.2, CROSS[k + 1] !== undefined ? CROSS[k + 1] - CROSS[k] - 0.01 : 0.2);
  }

  const S = { tags: [], hooks: [], pins: [], items: [], monthLabels: [] };

  function build() {
    D.template({ author: 'clement' });
    D.title('L’analyse, oui.', 'La clôture, non.');
    D.chapeau('La plupart des problèmes qui reviennent avaient été bien analysés.');

    // Explication courte au-dessus du visuel : comment le lire
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Le ', 0], ['curseur', C.blue], [', c’est le résultat. L’', 0], ['élastique', C.tRed], [' le rattache à l’ancienne méthode.', 0]]);
    line(384, [['Les ', 0], ['épingles', C.blue], [', ce sont les ', 0], ['quatre vérifications', C.blue], [' à faire avant de clôturer.', 0]]);

    precompute();

    const defs = el('defs');
    const cpPaper = el('clipPath', { id: 'paper' }, defs);
    el('rect', { x: PAPER_X0, y: 530, width: PEN_X - PAPER_X0, height: 470 }, cpPaper);
    const cpW = el('clipPath', { id: 'weight' }, defs);
    el('rect', { x: NOW_X - 90, y: 540, width: 180, height: 456 }, cpW);
    const sh = el('filter', { id: 'soft', x: '-30%', y: '-40%', width: '160%', height: '190%' }, defs);
    el('feDropShadow', { dx: 0, dy: 5, stdDeviation: 6, 'flood-color': C.ink, 'flood-opacity': 0.16 }, sh);

    // ----- Cadre et repères fixes du graphique -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    fit(text(D.svg, 92, 526, `Taux de défauts${NB}·${NB}ligne 1`, { size: 17, weight: 700, fill: MUTED }), 520, 'titre du graphique');
    [2, 4, 6].forEach(v => {
      el('line', { x1: PAPER_X0, y1: yOf(v), x2: PEN_X, y2: yOf(v), stroke: GRID, 'stroke-width': 2 });
      fit(text(D.svg, 110, yOf(v) + 6, `${v}${NB}%`, { size: 16, weight: 500, fill: TICK, anchor: 'end' }), 112, `graduation ${v}`, 64);
    });
    el('line', { x1: PAPER_X0, y1: BASE, x2: PEN_X, y2: BASE, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });

    S.scene = el('g');

    // ----- Papier de l'enregistreur (défile vers la gauche) -----
    const paperClip = el('g', { 'clip-path': 'url(#paper)' }, S.scene);
    S.paper = el('g', {}, paperClip);
    for (let mu = -13; mu <= 12; mu++) {
      const x = PEN_X + mu * PXM;
      el('line', { x1: f2(x), y1: BASE + 2, x2: f2(x), y2: BASE + 9, stroke: TICK, 'stroke-width': 2, 'stroke-linecap': 'round' }, S.paper);
      if (mod(mu, 2) === 0) {
        const cx = PEN_X + (mu + 0.5) * PXM;
        const n = text(S.paper, f2(cx), BASE + 27, MONTHS[mod(mu, 12)], { size: 15, weight: 500, fill: MUTED, anchor: 'middle' });
        fit(n, cx + PXM, `mois de l'axe ${mu}`, cx - PXM);   // tient dans ses deux mois ; fondu aux bords du papier
        S.monthLabels.push({ n, x: cx, hw: n.getBBox().width / 2 });
      }
    }
    const pd = TRACE.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ');
    const last = TRACE[TRACE.length - 1];
    el('path', { d: `M ${pd} L ${last[0].toFixed(1)} ${BASE} L ${TRACE[0][0].toFixed(1)} ${BASE} Z`, fill: C.blue, 'fill-opacity': 0.06 }, S.paper);
    el('path', { d: `M ${pd}`, fill: 'none', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, S.paper);
    S.backLabel = halo(text(S.paper, f2(PEAK[0] - 13), 579, 'Le problème revient', { size: 17, weight: 800, fill: C.tRed, anchor: 'end' }));
    {
      const b = S.backLabel.getBBox(), sx = -M_END * PXM;
      if (b.x + sx < PAPER_X0 + 6) console.error(`Débordement : étiquette du rebond sur l'image finale (${Math.round(b.x + sx)})`);
    }

    // ----- Ancienne position : contour fantôme, clou de l'élastique -----
    el('rect', { x: NOW_X - PW / 2, y: Y_OLD - PH / 2, width: PW, height: PH, rx: 14, fill: 'none', stroke: DASH, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, S.scene);
    fit(text(S.scene, NOW_X + PW / 2 + 12, Y_OLD + 6, 'Ancienne méthode', { size: 17, weight: 700, fill: RED_SOFT }), 1000, 'ancienne méthode');

    // ----- L'élastique -----
    S.band = el('path', { d: '', fill: 'none', stroke: C.red, 'stroke-width': 4.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, S.scene);
    el('circle', { cx: NOW_X, cy: Y_OLD, r: 7, fill: C.ink }, S.scene);
    el('circle', { cx: NOW_X - 2, cy: Y_OLD - 2, r: 2.2, fill: C.white, 'fill-opacity': 0.7 }, S.scene);

    // ----- Ce qui tire sur l'élastique -----
    [['op', C.violet, 'Nouvel opérateur'], ['team', C.teal, 'Autre équipe'], ['alert', C.red, 'Urgence de production']].forEach(([icon, color, label], i) => {
      const y = TAG_Y[i];
      const hook = el('g', {}, S.scene);
      const hl = el('line', { x1: TAG_X, y1: y, x2: TAG_X, y2: y, stroke: MUTED, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, hook);
      const ring = el('circle', { cx: 0, cy: y, r: 5.5, fill: 'none', stroke: MUTED, 'stroke-width': 2.5 }, hook);
      const g = el('g', {}, S.scene);
      const r = el('rect', { x: TAG_X, y: y - TAG_H / 2, height: TAG_H, rx: TAG_H / 2, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      el('circle', { cx: TAG_X + 22, cy: y, r: 14, fill: color }, g);
      ICONS[icon](el('g', { transform: `translate(${TAG_X + 22} ${y})` }, g));
      const tx = text(g, TAG_X + 44, y + 6, label, { size: 17, weight: 700, fill: C.ink });
      r.setAttribute('width', tx.getBBox().width + 60);
      fit(r, 1000, `étiquette ${label}`);
      S.tags.push(g);
      S.hooks.push({ g: hook, hl, ring });
    });

    // ----- Le groupe de travail : la solution vit dans leur tête -----
    S.crew = { g: el('g', {}, S.scene), heads: [] };
    [C.teal, C.violet, C.yellow].forEach((color, j) => {
      const hx = CREW.x + j * CREW.gap, hy = CREW.y;
      const h = el('g', {}, S.crew.g);
      el('circle', { cx: hx, cy: hy, r: 15, fill: color }, h);
      el('circle', { cx: hx, cy: hy - 4.5, r: 5, fill: C.white }, h);
      el('path', { d: `M ${hx - 8.5} ${hy + 9.5} C ${hx - 8.5} ${hy + 2}, ${hx + 8.5} ${hy + 2}, ${hx + 8.5} ${hy + 9.5} Z`, fill: C.white }, h);
      S.crew.heads.push({ n: h, cx: hx, cy: hy });
    });
    S.crew.label = text(S.crew.g, CREW.x + 2 * CREW.gap + 26, CREW.y + 6, 'Groupe de travail', { size: 16, weight: 700, fill: MUTED });
    fit(S.crew.label, FRAME.x + FRAME.w - 24, 'groupe de travail');

    // ----- Le poids « Solution » (accroché sous le curseur) -----
    const wClip = el('g', { 'clip-path': 'url(#weight)' }, S.scene);
    S.weight = el('g', {}, wClip);
    el('line', { x1: 0, y1: PH / 2, x2: 0, y2: 43, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.weight);
    el('circle', { cx: 0, cy: 47.5, r: 5, fill: 'none', stroke: C.ink, 'stroke-width': 2.5 }, S.weight);
    el('path', { d: 'M -46 53 L 46 53 L 57 93 L -57 93 Z', fill: C.blue, stroke: C.blue, 'stroke-width': 7, 'stroke-linejoin': 'round' }, S.weight);
    el('circle', { cx: -36, cy: 70, r: 6, fill: C.yellow }, S.weight);
    el('rect', { x: -38.5, y: 76, width: 5, height: 5, rx: 1.2, fill: C.white }, S.weight);
    fit(text(S.weight, 11, 79, 'Solution', { size: 17, weight: 800, fill: C.white, anchor: 'middle' }), 52, 'poids Solution', -30);

    // ----- Le curseur -----
    S.puck = el('g', {}, S.scene);
    S.alert = el('rect', { x: -PW / 2, y: -PH / 2, width: PW, height: PH, rx: 14, fill: 'none', stroke: C.red, 'stroke-width': 3 }, S.puck);
    S.puckBody = el('g', { filter: 'url(#soft)' }, S.puck);
    S.puckRect = el('rect', { x: -PW / 2, y: -PH / 2, width: PW, height: PH, rx: 14, fill: C.white, stroke: C.red, 'stroke-width': 3.5 }, S.puckBody);
    S.nib = el('path', { d: `M ${-PW / 2 + 1} -8 L ${-PW / 2 - NIB} 0 L ${-PW / 2 + 1} 8 Z`, fill: C.red }, S.puckBody);
    S.val = text(S.puck, 0, 9, pct(V_OLD), { size: 26, weight: 800, fill: C.tRed, anchor: 'middle' });
    fit(S.val, 40, 'valeur du curseur', -40);
    // Les épingles (numérotées comme les vérifications)
    PIN_POS.forEach(([ox, oy], k) => {
      const g = el('g', {}, S.puck);
      const shadow = el('ellipse', { cx: ox + 3, cy: oy + 4, rx: 10, ry: 7, fill: C.ink, opacity: 0.22 }, g);
      const ripple = el('circle', { cx: ox, cy: oy, r: 11, fill: 'none', stroke: C.blue, 'stroke-width': 2.5 }, g);
      const head = el('g', {}, g);
      el('circle', { cx: 0, cy: 0, r: 11, fill: C.blue, stroke: C.white, 'stroke-width': 2 }, head);
      text(head, 0, 5.4, String(k + 1), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      S.pins.push({ g, shadow, ripple, head, ox, oy });
    });

    // ----- Claquement -----
    S.clac = el('g', {}, S.scene);
    S.clacLines = [];
    [-1, 1].forEach(sd => [-62, -38, -14].forEach(a => {
      S.clacLines.push({ n: el('line', { stroke: C.red, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, S.clac), sd, a });
    }));

    // ----- Tampons -----
    S.stamp1 = stampShape(S.scene, 'SUJET CLOS', { ink: C.blue, bg: '#eeeef8' });
    S.stamp2 = stampShape(S.scene, 'STANDARD À JOUR', { ink: C.tGreen, bg: C.pGreen });

    // ----- Pourquoi ? -----
    S.quote = el('g', {}, S.scene);
    el('rect', { x: QUOTE.x, y: QUOTE.y, width: QUOTE.w, height: QUOTE.h, rx: 18, fill: C.pRed, stroke: C.red, 'stroke-width': 2.5 }, S.quote);
    const qh = text(S.quote, QUOTE.x + 18, QUOTE.y + 34, `Pourquoi${NB}?`, { size: 16, weight: 800, fill: RED_SOFT });
    qh.setAttribute('letter-spacing', 0.6);
    [`«${NB}La solution vivait`, 'dans la tête de ceux', `qui l’avaient trouvée.${NB}»`].forEach((l, i) =>
      fit(text(S.quote, QUOTE.x + 18, QUOTE.y + 68 + i * 27, l, { size: 19, weight: 800, fill: C.tRed }), QUOTE.x + QUOTE.w - 10, `pourquoi ligne ${i + 1}`));

    // ----- Calendrier -----
    S.cal = el('g', {}, S.scene);
    const cx = CAL.x + CAL.w / 2;
    el('rect', { x: CAL.x, y: CAL.y, width: CAL.w, height: CAL.h, rx: 10, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.cal);
    el('path', { d: `M ${CAL.x} ${CAL.y + 10} Q ${CAL.x} ${CAL.y} ${CAL.x + 10} ${CAL.y} H ${CAL.x + CAL.w - 10} Q ${CAL.x + CAL.w} ${CAL.y} ${CAL.x + CAL.w} ${CAL.y + 10} V ${CAL.y + 24} H ${CAL.x} Z`, fill: C.red }, S.cal);
    [CAL.x + 22, CAL.x + CAL.w - 22].forEach(x => el('rect', { x: x - 3.5, y: CAL.y - 7, width: 7, height: 16, rx: 3.5, fill: C.ink }, S.cal));
    S.calText = text(S.cal, cx, CAL.y + 59, MONTHS[0], { size: 21, weight: 800, fill: C.ink, anchor: 'middle' });
    MONTHS.forEach(m => {
      S.calText.textContent = m;
      const b = S.calText.getBBox();
      if (b.x < CAL.x + 5 || b.x + b.width > CAL.x + CAL.w - 5) console.error(`Débordement : calendrier ${m}`);
    });
    fit(S.calText, CAL.x + CAL.w - 5, 'mois du calendrier', CAL.x + 5);
    S.flip = el('g', {}, S.cal);
    S.flipPage = el('path', { d: `M ${CAL.x + 1} ${CAL.y + 24} H ${CAL.x + CAL.w - 1} V ${CAL.y + CAL.h - 10} Q ${CAL.x + CAL.w - 1} ${CAL.y + CAL.h - 1} ${CAL.x + CAL.w - 10} ${CAL.y + CAL.h - 1} H ${CAL.x + 10} Q ${CAL.x + 1} ${CAL.y + CAL.h - 1} ${CAL.x + 1} ${CAL.y + CAL.h - 10} Z`, fill: C.white, stroke: CARD_LINE, 'stroke-width': 1.5 }, S.flip);
    S.flipText = text(S.flip, cx, CAL.y + 59, '', { size: 21, weight: 800, fill: C.ink, anchor: 'middle' });

    // ----- Roue PDCA -----
    const { cx: wx, cy: wy, r0, r1 } = WHEEL;
    S.wheel = el('g', {}, S.scene);
    const SEG = [[2, 88], [92, 178], [182, 268], [272, 358]];
    SEG.forEach(([a0, a1]) => el('path', { d: sector(wx, wy, r0, r1, a0, a1), fill: C.pLav }, S.wheel));
    S.seg = SEG.slice(0, 3).map(([a0, a1]) => el('path', { d: sector(wx, wy, r0, r1, a0, a1), fill: C.blue }, S.wheel));
    S.aQuart = [0, 1, 2, 3].map(k => el('path', { d: sector(wx, wy, r0, r1, 272 + 21.5 * k, 272 + 21.5 * (k + 1)), fill: '#cfe6c4' }, S.wheel));
    S.aFull = el('path', { d: sector(wx, wy, r0, r1, 272, 358), fill: C.green }, S.wheel);
    S.aDash = el('path', { d: sector(wx, wy, r0 + 1.5, r1 - 1.5, 274, 356), fill: 'none', stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, S.wheel);
    S.letters = ['P', 'D', 'C', 'A'].map((L, i) => {
      const [lx, ly] = pt(wx, wy, (r0 + r1) / 2, 45 + 90 * i);
      const n = text(S.wheel, f2(lx), f2(ly + 6), L, { size: 17, weight: 800, fill: MUTED, anchor: 'middle' });
      fit(n, wx + r1, `roue ${L}`, wx - r1);
      return n;
    });
    S.glow = el('circle', { cx: wx, cy: wy, r: r1, fill: 'none', stroke: C.green, 'stroke-width': 4 }, S.wheel);

    // ----- Les quatre vérifications -----
    el('rect', { x: PANEL.x, y: PANEL.y, width: PANEL.w, height: PANEL.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S.scene);
    const ITEMS = [
      ['Résultat tenu dans la durée', 'Quelques semaines de suivi, pas quelques jours'],
      ['Méthode écrite dans le standard', 'Pas dans le compte rendu de réunion'],
      ['Toutes les équipes formées', 'Y compris hors du groupe de travail'],
      ['Postes similaires examinés', 'De la ligne 1 aux lignes 2 et 3'],
    ];
    ITEMS.forEach(([title, sub], k) => {
      const x0 = PANEL.x + 20 + (k % 2) * 452, row = Math.floor(k / 2);
      const ty = PANEL.y + 36 + row * 56, cyD = ty - 1 + 10;
      const disc = el('circle', { cx: x0 + 17, cy: cyD, r: 17, fill: C.pLav }, S.scene);
      const num = text(S.scene, x0 + 17, cyD + 6, String(k + 1), { size: 17, weight: 800, fill: MUTED, anchor: 'middle' });
      const tt = text(S.scene, x0 + 48, ty, title, { size: 18, weight: 800, fill: OFF_TITLE });
      const st = text(S.scene, x0 + 48, ty + 22, sub, { size: 16, weight: 500, fill: OFF_SUB });
      const right = k % 2 ? PANEL.x + PANEL.w - 14 : x0 + 446;
      fit(tt, right, `vérification ${k + 1}`); fit(st, right, `vérification ${k + 1} détail`);
      const chk = checkMark(S.scene, x0 + 31, cyD - 13, 9);
      S.items.push({ disc, num, tt, st, chk, cx: x0 + 31, cy: cyD - 13 });
    });

    // ----- Pastilles d'étape -----
    S.pills = PILLS.map(([, label, k]) => {
      const st = k === 'g' ? { bg: C.pGreen, fg: C.tGreen, icon: true } : k === 'r' ? { bg: C.pRed, fg: C.tRed } : { bg: C.blue, fg: C.white };
      const g = pillShape(S.scene, 92, FRAME.y + 46, label, st);
      fit(g, CAL.x - 20, `pastille ${label}`);
      return g;
    });

    D.encart(['Clôturer pour de bon', 'Notre article sur le PDCA', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_IN;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : prog(t, T_IN, IN_DUR);
    const s = final ? END : t;
    S.scene.setAttribute('opacity', f2(fade));

    // Papier qui défile et mois de l'axe
    const m = mOf(s);
    const shift = -m * PXM;
    S.paper.setAttribute('transform', `translate(${f2(shift)} 0)`);
    S.monthLabels.forEach(l => {
      const x = l.x + shift;
      show(l.n, clamp((x - l.hw - PAPER_X0 - 3) / 10) * clamp((PEN_X - 10 - x - l.hw) / 14));
    });
    show(S.backLabel, prog(s, T_SNAP + 0.15, 0.3));

    // Curseur : valeur, secousses
    const v = value(s);
    let dx = 4 * damp(s - T_CLAC, 12, 46), dy = 0;
    T_PIN.forEach(tp => { const p = prog(s, tp + PIN_FALL, 0.14); if (p > 0 && p < 1) dy += 2.5 * Math.sin(Math.PI * p); });
    TAGS2.forEach(ta => { dy -= 6 * damp(s - ta - HOOK, 9, 30); });
    dy -= 4 * damp(s - W_DROP[1], 9, 30);
    W_IN.forEach(tw => { dy += 3 * damp(s - tw - 0.3, 10, 26); });
    const px = NOW_X + dx, py = yOf(v) + dy;
    const cp = clamp((V_OLD - v) / (V_OLD - V_NEW));
    S.puck.setAttribute('transform', `translate(${f2(px)} ${f2(py)})`);
    const stroke = mix(C.red, C.green, cp);
    S.puckRect.setAttribute('stroke', stroke);
    S.nib.setAttribute('fill', stroke);
    S.val.textContent = pct(v);
    S.val.setAttribute('fill', mix(C.tRed, C.tGreen, cp));
    const pa = prog(s, T_ALERT, 0.55);
    show(S.alert, pa > 0 && pa < 1 ? 0.85 * (1 - pa) : 0);
    const ga = 16 * easeOut(pa);
    [['x', -PW / 2 - ga], ['y', -PH / 2 - ga], ['width', PW + 2 * ga], ['height', PH + 2 * ga], ['rx', 14 + ga]].forEach(([k, val]) => S.alert.setAttribute(k, f2(val)));

    // Étiquettes qui tirent sur l'élastique
    const pass2 = s >= TAGS2[0] - 0.05;
    const TA = pass2 ? TAGS2 : TAGS1;
    const tags = TA.map((ta, i) => {
      const pin = prog(s, ta, 0.3);
      let o = clamp(pin / 0.5), hp = easeOut(prog(s, ta + 0.1, HOOK - 0.1));
      let d = PULL[i] * backP(prog(s, ta + HOOK, 0.24)) + 3 * damp(s - ta - HOOK - 0.24, 8, 26);
      if (!pass2 && s >= T_SNAP) { d = 0; hp *= 1 - easeOut(prog(s, T_SNAP, 0.16)); o *= 1 - prog(s, T_SNAP + 0.05, 0.22); }
      return { o, slide: 36 * (1 - easeOut(pin)), hp, d, y: TAG_Y[i] };
    });

    // L'élastique : deux brins du clou au curseur, tirés vers la droite par les crochets
    const len = py - Y_OLD;
    const st = clamp(len / (yOf(V_NEW) - Y_OLD));
    const hw = lerp(8, 4.5, st);
    const act = tags.filter(g => g.hp >= 0.999 && g.d > 0.01 && py - PH / 2 > g.y + 4);
    if (len < 6) S.band.setAttribute('display', 'none');
    else {
      S.band.setAttribute('display', 'inline');
      const down = act.map(g => `L ${f2(NOW_X - hw + g.d)} ${g.y}`).reverse().join(' ');
      const up = act.map(g => `L ${f2(NOW_X + hw + g.d)} ${g.y}`).join(' ');
      S.band.setAttribute('d', `M ${f2(NOW_X - hw)} ${f2(py)} ${down} L ${f2(NOW_X - hw)} ${f2(Y_OLD)} A ${f2(hw)} ${f2(hw)} 0 0 1 ${f2(NOW_X + hw)} ${f2(Y_OLD)} ${up} L ${f2(NOW_X + hw)} ${f2(py)}`);
      S.band.setAttribute('stroke-width', f2(lerp(5, 3.6, st)));
    }
    tags.forEach((g, i) => {
      show(S.tags[i], g.o);
      S.tags[i].setAttribute('transform', g.slide > 0.01 ? `translate(${f2(g.slide)} 0)` : '');
      const x0 = TAG_X + g.slide;
      const on = act.includes(g);
      const bx = (on ? NOW_X + hw + g.d : NOW_X + 8) + 4;
      const xe = lerp(x0, bx, g.hp);
      const h = S.hooks[i];
      show(h.g, g.o * (g.hp > 0.01 ? 1 : 0));
      h.hl.setAttribute('x1', f2(x0));
      h.hl.setAttribute('x2', f2(xe));
      show(h.ring, on ? 1 : 0);
      h.ring.setAttribute('cx', f2(xe));
    });

    // Groupe de travail : il arrive avec la solution, puis ses membres partent un à un
    const ck = s >= W_IN[1] - 0.1 ? 1 : 0;
    const TL = ck ? TAGS2 : TAGS1;
    const ci = prog(s, W_IN[ck] - 0.1, 0.35);
    show(S.crew.g, clamp(ci / 0.5));
    S.crew.g.setAttribute('transform', ci < 1 ? `translate(${f2(30 * (1 - easeOut(ci)))} 0)` : '');
    S.crew.heads.forEach((h, j) => {
      const p = prog(s, TL[j] + HOOK + 0.05, 0.35);
      show(h.n, 1 - p);
      h.n.setAttribute('transform', p > 0 ? `translate(0 ${f2(16 * easeIn(p))}) ${scaleAt(1 - 0.3 * p, h.cx, h.cy)}` : '');
    });
    show(S.crew.label, 1 - prog(s, TL[2] + HOOK + 0.15, 0.3));

    // Poids « Solution »
    const wk = s >= W_IN[1] ? 1 : 0;
    const tin = W_IN[wk], tdr = W_DROP[wk];
    let wo = 0, wy = py, wr = 0, wdx = 0;
    if (s >= tin) {
      const p = prog(s, tin, 0.38);
      wo = clamp(p / 0.35);
      wy = py + 80 * (1 - backP(p));
      if (s >= tdr - 0.25 && s < tdr) wdx = (wk ? 1.2 : 2.4) * Math.sin((s - tdr) * 70) * prog(s, tdr - 0.25, 0.15);
      if (s >= tdr) { const u = s - tdr; wy = yOf(value(tdr)) + 1300 * u * u; wr = 25 * u; wo *= 1 - prog(u, 0.1, 0.22); }
    }
    show(S.weight, wo);
    S.weight.setAttribute('transform', `translate(${f2(px + wdx)} ${f2(wy)})` + (wr ? ` rotate(${f2(wr)} 0 74)` : ''));

    // Épingles : elles tombent, se plantent, le résultat est fixé
    S.pins.forEach((pn, k) => {
      const tp = T_PIN[k];
      if (s < tp) { pn.g.setAttribute('display', 'none'); return; }
      pn.g.setAttribute('display', 'inline');
      const q = easeIn(prog(s, tp, PIN_FALL));
      const imp = prog(s, tp + PIN_FALL, 0.14);
      const sq = imp > 0 && imp < 1 ? 1 - 0.12 * Math.sin(Math.PI * imp) : 1;
      const ks = (1 + 0.35 * (1 - q)) * sq;
      const hx = pn.ox + Math.sign(pn.ox) * 24 * (1 - q), hy = pn.oy - 64 * (1 - q);
      pn.head.setAttribute('transform', `translate(${f2(hx)} ${f2(hy)})` + (ks !== 1 ? ` scale(${f2(ks)})` : ''));
      pn.shadow.setAttribute('rx', f2(6 + 4 * q));
      pn.shadow.setAttribute('ry', f2(4 + 3 * q));
      pn.shadow.setAttribute('opacity', f2(0.08 + 0.14 * q));
      const rp = prog(s, tp + PIN_FALL, 0.32);
      show(pn.ripple, rp > 0 && rp < 1 ? 0.55 * (1 - rp) : 0);
      pn.ripple.setAttribute('r', f2(11 + 14 * easeOut(rp)));
    });

    // Claquement contre l'ancienne position
    const pc = prog(s, T_CLAC, 0.32);
    show(S.clac, pc > 0 && pc < 1 ? 1 - easeIn(pc) : 0);
    S.clacLines.forEach(({ n, sd, a }) => {
      const ax = NOW_X + sd * (PW / 2 - 6), ay = Y_OLD - PH / 2 + 4;
      const ang = (sd * (90 + a)) * Math.PI / 180;
      const ra = 10 + 16 * easeOut(pc), rb = ra + 14 * (1 - 0.5 * pc);
      n.setAttribute('x1', f2(ax + ra * Math.sin(ang))); n.setAttribute('y1', f2(ay - ra * Math.cos(ang)));
      n.setAttribute('x2', f2(ax + rb * Math.sin(ang))); n.setAttribute('y2', f2(ay - rb * Math.cos(ang)));
    });

    // Tampons
    const stamp = (stp, t0, tOut) => {
      if (s < t0) { stp.g.setAttribute('display', 'none'); return; }
      const p = prog(s, t0, 0.16);
      let o = clamp(p / 0.3), ddy = 0;
      const k = 1 + 0.12 * (1 - easeIn(p)), dropY = -26 * (1 - easeIn(p));
      const ps = prog(s, t0 + 0.16, 0.3);
      const shx = ps > 0 && ps < 1 ? 4 * Math.sin(ps * Math.PI * 4) * (1 - ps) : 0;
      if (tOut !== null && s >= tOut) { const q = prog(s, tOut, 0.25); o *= 1 - q; ddy = 30 * easeIn(q); }
      show(stp.g, o);
      stp.g.setAttribute('transform', `translate(${f2(STAMP.x + shx)} ${f2(STAMP.y + ddy + dropY)}) rotate(-6) scale(${f2(k)})`);
    };
    stamp(S.stamp1, T_STAMP1, T_SNAP + 0.02);
    stamp(S.stamp2, T_STAMP2, null);

    // Pourquoi ?
    const qi = prog(s, T_QUOTE[0], 0.3), qo = prog(s, T_QUOTE[1], 0.25);
    show(S.quote, qi * (1 - qo));
    S.quote.setAttribute('transform', qi < 1 ? `translate(0 ${f2(10 * (1 - easeOut(qi)))})` : '');

    // Calendrier : la page du mois précédent se tourne
    const mi = Math.floor(m + 1e-9);
    S.calText.textContent = MONTHS[mod(mi, 12)];
    const fp = CROSS[mi] !== undefined ? prog(s, CROSS[mi], FLIP[mi]) : 1;
    if (fp > 0 && fp < 1) {
      S.flip.setAttribute('display', 'inline');
      S.flipText.textContent = MONTHS[mod(mi - 1, 12)];
      const k = Math.max(0.001, 1 - easeIn(fp));
      S.flip.setAttribute('transform', `translate(0 ${CAL.y + 24}) scale(1 ${f2(k)}) translate(0 ${-(CAL.y + 24)})`);
      S.flipPage.setAttribute('fill', mix(C.white, '#e6e6f2', fp));
      show(S.flipText, clamp((k - 0.45) / 0.3));
    } else S.flip.setAttribute('display', 'none');

    // Roue PDCA
    [T_P, T_D, T_C].forEach((tx, i) => {
      const p = prog(s, tx, 0.3);
      show(S.seg[i], clamp(p / 0.4));
      S.seg[i].setAttribute('transform', scaleAt(popScale(p), WHEEL.cx, WHEEL.cy));
      S.letters[i].setAttribute('fill', p >= 0.4 ? C.white : MUTED);
    });
    S.aQuart.forEach((n, k) => {
      const p = prog(s, T_PIN[k] + PIN_FALL, 0.25);
      show(n, clamp(p / 0.4));
      n.setAttribute('transform', scaleAt(popScale(p), WHEEL.cx, WHEEL.cy));
    });
    const pA = prog(s, T_A, 0.35);
    show(S.aFull, clamp(pA / 0.4));
    S.aFull.setAttribute('transform', scaleAt(pA > 0 && pA < 1 ? 0.85 + 0.15 * back(pA) + 0.08 * Math.sin(Math.PI * pA) : 1, WHEEL.cx, WHEEL.cy));
    S.letters[3].setAttribute('fill', pA >= 0.4 ? C.white : MUTED);
    let od = 0;
    if (s >= T_SKIP) {
      const u = s - T_SKIP;
      od = u < 0.6 ? (Math.floor(u / 0.15) % 2 === 0 ? 1 : 0.2) : 1;
      od *= 1 - prog(s, T_PIN[0] + PIN_FALL, 0.2);
    }
    show(S.aDash, od);
    const pg = prog(s, T_A + 0.05, 0.5);
    show(S.glow, pg > 0 && pg < 1 ? 0.7 * (1 - pg) : 0);
    S.glow.setAttribute('r', f2(WHEEL.r1 + 14 * easeOut(pg)));

    // Vérifications cochées une à une
    S.items.forEach((it, k) => {
      const p = prog(s, T_PIN[k] + PIN_FALL, 0.25);
      it.disc.setAttribute('fill', mix(C.pLav, C.blue, p));
      it.num.setAttribute('fill', mix(MUTED, C.white, p));
      it.tt.setAttribute('fill', mix(OFF_TITLE, C.ink, p));
      it.st.setAttribute('fill', mix(OFF_SUB, MUTED, p));
      const pk = prog(s, T_PIN[k] + PIN_FALL + 0.05, 0.3);
      show(it.chk, clamp(pk / 0.4));
      it.chk.setAttribute('transform', scaleAt(popScale(pk), it.cx, it.cy));
    });

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.12 : 0);
      const b = i + 1 < PILLS.length ? PILLS[i + 1][0] : Infinity;
      const o = prog(s, a, 0.25) * (1 - prog(s, b, 0.14));
      const dy = 8 * (1 - prog(s, a, 0.25));
      show(g, o);
      g.setAttribute('transform', dy > 0.01 ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
