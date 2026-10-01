// Fiche LinkedIn · Clément Raymond · jeudi 29 octobre 2026
// Post : « Un standard sans propriétaire ne disparaît pas. Il reste affiché. Il devient simplement faux. »
// Premier commentaire du post (Buffer) : nos fiches Lean → encart.
// Le visuel est la pièce maîtresse : l'historique de versions d'un standard. En haut, une frise à trois
// pistes (le poste réel, le standard sans propriétaire, le standard avec propriétaire). En dessous, un
// diff ligne à ligne : à gauche le poste réel, à droite le standard affiché (cartouche version, date,
// propriétaire). Sans propriétaire, chaque évolution du poste (nouvel outil, nouvelle référence, réglage de
// l'équipe de nuit) ouvre un écart surligné, le compteur grimpe, les trois conséquences s'inscrivent. On
// rejoue la même année avec un chef d'équipe propriétaire : chaque évolution déclenche une révision
// (v2, v3, v4), un écart remonté est reçu puis décidé (v5), la revue à date fixe passe au poste.
// Style propre : l'historique de versions (diff, frise à pistes, versions qui s'incrémentent).
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
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', ROW_BG = '#f4f4f9';
  const TRACK = '#dcdcec', DASH = '#b6b6d4', TICK = '#a3a3c2', FROZEN = '#8e8eb4', GRID = '#e9e9f2';

  // Visibilité : un élément invisible passe en display none (boucle stable au pixel près)
  function vis(n, o, tf) {
    if (o <= 0.002) { n.setAttribute('display', 'none'); return; }
    n.removeAttribute('display');
    n.setAttribute('opacity', o >= 0.999 ? 1 : f2(o));
    if (tf !== undefined) { if (tf) n.setAttribute('transform', tf); else n.removeAttribute('transform'); }
  }
  const scaleAt = (cx, cy, k) => (Math.abs(k - 1) < 1e-4 ? '' : `translate(${f2(cx)} ${f2(cy)}) scale(${f2(Math.max(k, 0.001))}) translate(${f2(-cx)} ${f2(-cy)})`);

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const PILL_Y = 454;
  const LANE = [524, 562, 600];               // poste réel · sans propriétaire · avec propriétaire
  const LX0 = 262, LX1 = 990;
  const X = m => 278 + m * (696 / 11);        // janvier → décembre 2025
  const LABEL_Y = 503, MONTH_Y = 634;
  const CARD_Y = 652, CARD_H = 314, CW = 430, CX = [84, 566], GUT = 540;
  const ROW_Y0 = 752, ROW_P = 42, ROW_H = 37;
  const rowCy = i => ROW_Y0 + i * ROW_P + ROW_H / 2;
  const VAL_DX = 140;
  const STRIP = { y: 980, h: 150, x: [84, 552], w: 444 };

  // ---------- Contenu ----------
  const ROWS = [
    { label: 'Référence', v: ['C-210', 'C-210 et C-214'] },
    { label: 'Outil', v: ['Clé dynamométrique', 'Visseuse électrique'] },
    { label: 'Serrage', v: [`4${NB}vis, en croix`, `4 ou 6${NB}vis, en croix`] },
    { label: 'Réglage', v: [`Presse à 4,0${NB}bar`, `Presse à 3,6${NB}bar`] },
    { label: 'Contrôle', v: [`Visuel, 1${NB}pièce sur 10`] },
  ];
  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const INITIALS = 'JFMAMJJASOND'.split('');
  const DATES = ['06/01/2025', '10/03/2025', '12/05/2025', '21/07/2025', '15/09/2025'];
  const EVENTS = [                              // évolutions du poste : mois, ligne touchée, picto, libellé
    { m: 2, row: 1, icon: 'outil', label: 'Nouvel outil' },
    { m: 4, row: 0, icon: 'ref', label: 'Nouvelle réf.' },
    { m: 6, row: 3, icon: 'nuit', label: 'Réglage nuit' },
  ];
  const ECART_M = 8, REVUE_M = [3, 7, 11];

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION - 0.001;
  const T_OUT = 1.2, T_IN = 1.45;                // l'état final s'efface, la première année commence
  const P1 = [2.05, 2.75, 3.45];                 // sans propriétaire : outil, référence, réglage de nuit
  const T_CONS = [4.25, 4.55, 4.85];             // les trois conséquences (septembre → décembre)
  const T_RW0 = 5.15, T_RW1 = 5.55;              // on revient en janvier
  const T_OWNER = 5.6, OWNER_DUR = 0.34;         // le chef d'équipe devient propriétaire
  const P2 = [6.15, 7.35, 8.35];                 // les mêmes évolutions, avec propriétaire
  const REV = [6.5, 7.7, 8.7];                   // révisions v2, v3, v4 (rature, puis frappe)
  const T_REVUES = [7.1, 9.25, 10.9];            // revues à date fixe : avril, août, décembre
  const T_FLAG = 9.45, T_RECU = 9.75, T_DECIDE = 10.0, T_V5 = 10.25;
  const T_SWEEP = 10.95, SWEEP_DUR = 0.4;        // la revue de décembre passe ligne à ligne
  const T_RLINES = [5.3, 5.38, 5.46];
  const T_PILLS = [1.6, 4.1, 5.2, 11.45];
  const SW = 0.3, SW_MID = 0.12;                 // changement au poste : l'ancien sort, puis le nouveau entre
  const TY = 0.4, TY_STRIKE = 0.1, TY_START = 0.15;
  const PH = [[T_IN, 0], [1.75, 0], [2.05, 2], [2.45, 2], [2.75, 4], [3.15, 4], [3.45, 6], [3.85, 6], [4.85, 11, 1],
    [T_RW0, 11], [T_RW1, 0], [5.9, 0], [6.15, 2], [6.95, 2], [7.1, 3], [7.15, 3], [7.35, 4], [8.15, 4], [8.35, 6],
    [9.15, 6], [9.25, 7], [9.3, 7], [9.45, 8], [10.65, 8], [10.9, 11]];
  const month = s => {
    if (s <= PH[0][0]) return PH[0][1];
    for (let i = 1; i < PH.length; i++) if (s < PH[i][0]) {
      const a = PH[i - 1], b = PH[i], p = (s - a[0]) / (b[0] - a[0]);
      return lerp(a[1], b[1], b[2] ? p : easeInOut(p));
    }
    return 11;
  };
  // Instant où la tête de lecture repasse un mois pendant le retour en janvier
  const crossing = m => { let a = T_RW0, b = T_RW1; for (let k = 0; k < 40; k++) { const c = (a + b) / 2; if (month(c) > m) a = c; else b = c; } return b; };

  // Historique des valeurs : [instant, variante] par ligne, à gauche (poste) et à droite (standard)
  const LEFT = ROWS.map(() => []), RIGHT = ROWS.map(() => []);
  EVENTS.forEach((e, k) => {
    LEFT[e.row].push([P1[k], 1], [crossing(e.m), 0], [P2[k], 1]);
    RIGHT[e.row].push([REV[k], 1]);
  });
  LEFT[2].push([T_V5 + TY - SW_MID, 1]);         // la décision s'applique au poste et au standard à la fois
  RIGHT[2].push([T_V5, 1]);
  LEFT.forEach(l => l.sort((a, b) => a[0] - b[0]));
  const idxAt = (list, s, d) => { let i = 0; for (const [t, v] of list) if (s >= t + d) i = v; return i; };
  const diffAt = (r, s) => idxAt(LEFT[r], s, SW_MID) !== idxAt(RIGHT[r], s, TY);
  const DIFF = ROWS.map((_, r) => {
    const times = [...LEFT[r].map(([t]) => t + SW_MID), ...RIGHT[r].map(([t]) => t + TY)].sort((a, b) => a - b);
    const iv = []; let on = false, a = 0;
    times.forEach(t => { const st = diffAt(r, t + 1e-6); if (st !== on) { if (st) a = t; else iv.push([a, t]); on = st; } });
    if (on) iv.push([a, Infinity]);
    return iv;
  });
  const hlAt = (r, s) => DIFF[r].reduce((o, [a, b]) => Math.max(o, prog(s, a, 0.15) * (1 - prog(s, b, 0.15))), 0);
  const cntAt = s => ROWS.reduce((n, _, r) => n + (diffAt(r, s) ? 1 : 0), 0);
  const TOG = DIFF.flat(2).filter(Number.isFinite).sort((a, b) => a - b);
  const VER_T = [...REV.map(t => t + TY), T_V5 + TY];
  const verAt = s => 1 + VER_T.filter(t => s >= t).length;
  // Marqueur de la gouttière : = (identique) · ≠ (différence) · ! (écart remonté) · = vert (revu)
  const SWP = ROWS.map((_, r) => T_SWEEP + 0.06 + r * (SWEEP_DUR - 0.12) / 4);
  const gState = (r, s) => (r === 2 && s >= T_FLAG && s < T_V5 + TY ? 'flag' : diffAt(r, s) ? 'neq' : s >= SWP[r] ? 'ok' : 'eq');
  const G_T = ROWS.map((_, r) => [...DIFF[r].flat().filter(Number.isFinite), ...(r === 2 ? [T_FLAG, T_V5 + TY] : []), SWP[r]].sort((a, b) => a - b));
  const T_TICK = [REV[0] + TY + 0.05, T_V5 + TY + 0.05, T_SWEEP + SWEEP_DUR];

  // ---------- Pictos ----------
  const ICON = {
    outil(g, bg) {
      const r = el('g', { transform: 'rotate(45)' }, g);
      el('rect', { x: -2.6, y: -1, width: 5.2, height: 12, rx: 2.6, fill: C.white }, r);
      el('circle', { cx: 0, cy: -4.5, r: 5.8, fill: C.white }, r);
      el('rect', { x: -2.2, y: -11.5, width: 4.4, height: 6.5, rx: 1, fill: bg }, r);
    },
    ref(g, bg) {
      el('path', { d: 'M -7.5 -7.5 H 0.5 L 8 0 L 0 8 L -7.5 0.5 Z', fill: C.white, stroke: C.white, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
      el('circle', { cx: -3.3, cy: -3.3, r: 2, fill: bg }, g);
    },
    nuit(g, bg) {
      el('circle', { cx: -1, cy: 1, r: 8, fill: C.white }, g);
      el('circle', { cx: 3.2, cy: -3, r: 7, fill: bg }, g);
    },
    ecart(g) { text(g, 0, 6, '!', { size: 17, weight: 800, fill: C.ink, anchor: 'middle' }); },
    revue(g) {
      el('rect', { x: -6.5, y: -5, width: 13, height: 11.5, rx: 2.5, fill: 'none', stroke: C.white, 'stroke-width': 2 }, g);
      el('line', { x1: -6.5, y1: -1.4, x2: 6.5, y2: -1.4, stroke: C.white, 'stroke-width': 2 }, g);
      [-3.2, 3.2].forEach(x => el('line', { x1: x, y1: -8, x2: x, y2: -4.2, stroke: C.white, 'stroke-width': 2, 'stroke-linecap': 'round' }, g));
      el('rect', { x: -1.5, y: 1.3, width: 3, height: 3, rx: 0.8, fill: C.white }, g);
    },
    maj(g) {                                   // crayon : on réécrit le standard
      const r = el('g', { transform: 'rotate(45)' }, g);
      el('rect', { x: -2.9, y: -9, width: 5.8, height: 11.4, rx: 1.2, fill: C.white }, r);
      el('path', { d: 'M -2.9 3.6 L 2.9 3.6 L 0 8.4 Z', fill: C.white, stroke: C.white, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, r);
    },
    oeil(g, bg) {
      el('path', { d: 'M -7 0 C -4.5 -4.8, 4.5 -4.8, 7 0 C 4.5 4.8, -4.5 4.8, -7 0 Z', fill: 'none', stroke: C.white, 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, g);
      el('circle', { cx: 0, cy: 0, r: 2.1, fill: C.white }, g);
      el('line', { x1: -6, y1: 6, x2: 6, y2: -6, stroke: bg, 'stroke-width': 4.4, 'stroke-linecap': 'round' }, g);
      el('line', { x1: -6, y1: 6, x2: 6, y2: -6, stroke: C.white, 'stroke-width': 1.9, 'stroke-linecap': 'round' }, g);
    },
    duo(g, bg) {
      [[-3.6, 0], [3.8, 1]].forEach(([x, k]) => {
        el('circle', { cx: x, cy: -3, r: 2.7, fill: C.white, stroke: k ? bg : 'none', 'stroke-width': 1.2 }, g);
        el('path', { d: `M ${x - 4.2} 6.5 C ${x - 4.2} 0.8, ${x + 4.2} 0.8, ${x + 4.2} 6.5 Z`, fill: C.white, stroke: k ? bg : 'none', 'stroke-width': 1.2 }, g);
      });
    },
    audit(g) {
      el('rect', { x: -5.5, y: -6.2, width: 11, height: 13.4, rx: 2, fill: 'none', stroke: C.white, 'stroke-width': 1.8 }, g);
      el('rect', { x: -2.6, y: -8, width: 5.2, height: 3.2, rx: 1, fill: C.white }, g);
      el('path', { d: 'M -2.8 0.8 L -0.6 3 L 3 -1', fill: 'none', stroke: C.white, 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    },
  };
  const disc = (parent, x, y, r, fill, icon) => {
    const g = el('g', {}, parent);
    el('circle', { cx: x, cy: y, r, fill }, g);
    ICON[icon](el('g', { transform: `translate(${x} ${y})` }, g), fill);
    return g;
  };
  function avatar(parent, cx, cy, r, color) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: color }, g);
    el('circle', { cx, cy: cy - r * 0.26, r: r * 0.31, fill: C.white }, g);
    el('path', { d: `M ${f2(cx - r * 0.52)} ${f2(cy + r * 0.58)} C ${f2(cx - r * 0.52)} ${f2(cy + r * 0.1)}, ${f2(cx + r * 0.52)} ${f2(cy + r * 0.1)}, ${f2(cx + r * 0.52)} ${f2(cy + r * 0.58)} Z`, fill: C.white }, g);
    return g;
  }
  const checkPath = (parent, x, y, k, color, w = 3) => el('path', { d: `M ${f2(x - 5.5 * k)} ${f2(y + 0.5 * k)} L ${f2(x - 1.5 * k)} ${f2(y + 4.5 * k)} L ${f2(x + 5.5 * k)} ${f2(y - 3.5 * k)}`, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  function pillShape(parent, x, cy, label, { bg, fg, icon = false, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = icon ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40 + iw);
    if (icon) { el('circle', { cx: x + 31, cy, r: 12, fill: C.green }, g); checkPath(g, x + 31, cy, 1, C.white, 3.2); }
    return g;
  }
  function chip(parent, x, cy, label, { bg, fg, size = 15, h = 26, pad = 12, minW = 0 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: cy - h / 2, height: h, rx: h / 2 > 9 ? 8 : h / 2, fill: bg }, g);
    const tx = text(g, x, cy + size * 0.36, label, { size, weight: 800, fill: fg, anchor: 'middle' });
    const w = Math.max(minW, tx.getBBox().width + 2 * pad);
    r.setAttribute('x', f2(x - w / 2)); r.setAttribute('width', f2(w));
    return { g, w };
  }
  // Vérifie toutes les variantes d'un texte qui change en cours d'animation
  function fitVariants(node, variants, maxRight, label, minLeft = 0) {
    const keep = node.textContent;
    variants.forEach(v => {
      node.textContent = v;
      const b = node.getBBox();
      if (b.x + b.width > maxRight + 0.5 || b.x < minLeft - 0.5) console.error(`Débordement : ${label} « ${v} » (${Math.round(b.x)} → ${Math.round(b.x + b.width)}, bornes ${minLeft} → ${maxRight})`);
    });
    node.textContent = keep;
    fit(node, maxRight, label, minLeft);
  }
  const spans = (parent, x, y, parts, size) => {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'font-weight': 500, fill: C.ink }, parent);
    parts.forEach(([str, color, w = 700]) => { const sp = el('tspan', color ? { 'font-weight': w, fill: color } : {}, t); sp.textContent = str; });
    return t;
  };
  // Défilement vertical d'une valeur (compteur, version, date) dans sa fenêtre
  function roll(a, b, oldStr, newStr, p, y, h, dir = 1) {
    if (p >= 1 || oldStr === newStr) {
      a.textContent = newStr; a.setAttribute('y', f2(y)); b.setAttribute('display', 'none');
      return;
    }
    const q = easeInOut(p);
    a.textContent = oldStr; a.setAttribute('y', f2(y - dir * h * q));
    b.removeAttribute('display'); b.textContent = newStr; b.setAttribute('y', f2(y + dir * h * (1 - q)));
  }

  const S = { layers: [] };
  const layer = () => { const g = el('g'); S.layers.push(g); return g; };

  function build() {
    D.template({ author: 'clement' });
    D.title('Le poste évolue,', 'pas le standard.');
    D.chapeau(`Sans propriétaire, il ne disparaît pas${NB}: il devient simplement faux.`);

    // Explication courte au-dessus du visuel
    const line = (y, parts) => fit(spans(D.svg, 62, y, parts, 22), 1020, `explication ${y}`);
    line(352, [['À gauche, '], ['le poste réel', C.blue], ['. À droite, '], ['le standard affiché', C.blue], ['. '], ['En rouge', C.tRed], [', leurs différences.']]);
    line(384, [['Puis la même année, '], ['avec un propriétaire', C.blue], [`${NB}: chaque évolution déclenche `], ['une révision', C.blue], ['.']]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-80%', y: '-80%', width: '260%', height: '260%' }, defs);
    el('feDropShadow', { dx: 0, dy: 5, stdDeviation: 4, 'flood-color': C.ink, 'flood-opacity': 0.3 }, lift);
    const clip = (id, x, y, w, h) => { const c = el('clipPath', { id }, defs); el('rect', { x, y, width: w, height: h }, c); return `url(#${id})`; };

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Frise : trois pistes, janvier → décembre 2025 -----
    for (let m = 0; m < 12; m++) el('line', { x1: f2(X(m)), y1: 514, x2: f2(X(m)), y2: 614, stroke: GRID, 'stroke-width': 1.5 });
    const LANES = [['Poste réel', C.ink], ['Sans propriétaire', C.tRed], ['Avec propriétaire', C.blue]];
    S.laneLabels = LANES.map(([l, c], i) => { const n = text(D.svg, 88, LANE[i] + 5, l, { size: 15, weight: 700, fill: c }); fit(n, LX0 - 12, `piste ${i + 1}`); return n; });
    LANE.slice(0, 2).forEach(y => el('line', { x1: LX0, y1: y, x2: LX1, y2: y, stroke: TRACK, 'stroke-width': 3, 'stroke-linecap': 'round' }));
    S.ghostLane = el('line', { x1: LX0, y1: LANE[2], x2: LX1, y2: LANE[2], stroke: DASH, 'stroke-width': 2.5, 'stroke-dasharray': '6 7', 'stroke-linecap': 'round' });
    S.lane2 = el('line', { x1: LX0, y1: LANE[2], x2: LX1, y2: LANE[2], stroke: TRACK, 'stroke-width': 3, 'stroke-linecap': 'round' });
    INITIALS.forEach((c, m) => text(D.svg, f2(X(m)), MONTH_Y, c, { size: 15, weight: 500, fill: TICK, anchor: 'middle' }));
    text(D.svg, 88, MONTH_Y, '2025', { size: 15, weight: 700, fill: MUTED });

    const LF = layer();
    // Liens « évolution → révision » (sous les pistes)
    S.conn = [...EVENTS.map(e => e.m), ECART_M].map(m => {
      const y0 = LANE[0] + 15, y1 = LANE[2] - 14, len = y1 - y0;
      return { n: el('line', { x1: f2(X(m)), y1: y0, x2: f2(X(m)), y2: y1, stroke: C.blue, 'stroke-width': 2.5, 'stroke-opacity': 0.55, 'stroke-linecap': 'round' }, LF), len };
    });
    // Parties parcourues
    const prog3 = (y, color) => el('line', { x1: f2(X(0)), y1: y, x2: f2(X(0)), y2: y, stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round' }, LF);
    S.progP = prog3(LANE[0], C.ink);
    S.progS0g = prog3(LANE[1], FROZEN);
    S.progS0r = el('line', { x1: f2(X(2)), y1: LANE[1], x2: f2(X(2)), y2: LANE[1], stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round' }, LF);
    S.progS1 = prog3(LANE[2], C.blue);
    // Tête de lecture
    S.ph = el('g', {}, LF);
    el('line', { x1: 0, y1: 513, x2: 0, y2: 614, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.ph);
    el('path', { d: 'M -6 509 L 6 509 L 0 516 Z', fill: C.ink, 'stroke-linejoin': 'round', stroke: C.ink, 'stroke-width': 2 }, S.ph);

    // Piste « poste réel » : les évolutions (et l'écart remonté, avec propriétaire)
    S.pm = [...EVENTS, { m: ECART_M, icon: 'ecart', label: 'Écart remonté' }].map((e, k) => {
      const x = X(e.m);
      const g = disc(LF, x, LANE[0], 13, k < 3 ? C.blue : C.yellow, e.icon);
      const label = text(LF, f2(x), LABEL_Y, e.label, { size: 15, weight: 700, fill: k < 3 ? C.ink : C.tYellow, anchor: 'middle' });
      fit(label, 996, `frise ${e.label}`, LX0);
      return { g, label, x };
    });
    // Piste « sans propriétaire » : v1 figée, et le numéro de chaque différence ouverte
    S.s0v1 = chip(LF, X(0), LANE[1], 'v1', { bg: FROZEN, fg: C.white, minW: 36, h: 24, pad: 8 }).g;
    S.s0tick = EVENTS.map((e, k) => {
      const g = el('g', {}, LF);
      el('circle', { cx: f2(X(e.m)), cy: LANE[1], r: 11, fill: C.red }, g);
      text(g, f2(X(e.m)), LANE[1] + 5.5, String(k + 1), { size: 15, weight: 800, fill: C.white, anchor: 'middle' });
      return g;
    });
    // Piste « avec propriétaire » : v1 → v5 et les revues à date fixe
    S.s1v = [0, ...EVENTS.map(e => e.m), ECART_M].map((m, k) => chip(LF, X(m), LANE[2], `v${k + 1}`, { bg: C.blue, fg: C.white, minW: 36, h: 24, pad: 8 }).g);
    S.s1r = REVUE_M.map(m => disc(LF, X(m), LANE[2], 11.5, C.teal, 'revue'));

    // ----- Les deux colonnes du diff -----
    const TITLES = ['Poste réel', 'Standard affiché'];
    CX.forEach((x, side) => {
      el('rect', { x, y: CARD_Y, width: CW, height: CARD_H, rx: 20, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
      fit(text(D.svg, x + 20, CARD_Y + 34, TITLES[side], { size: 20, weight: 800, fill: C.ink }), x + 230, `titre ${side}`);
      el('rect', { x: x + 12, y: CARD_Y + 46, width: CW - 24, height: 46, rx: 10, fill: ROW_BG, stroke: CARD_LINE, 'stroke-width': 1.5 });
    });
    // Cartouches : à gauche ce qu'on observe, à droite version, date, propriétaire
    const cell = (x0, x1, label) => {
      if (x0 > CX[0] + 12 && x0 !== CX[1] + 12) el('line', { x1: x0, y1: CARD_Y + 54, x2: x0, y2: CARD_Y + 84, stroke: CARD_LINE, 'stroke-width': 1.5 });
      fit(text(D.svg, x0 + 12, CARD_Y + 63, label, { size: 15, weight: 500, fill: MUTED }), x1 - 6, `cartouche ${label}`);
    };
    const VY = CARD_Y + 85;                                    // ligne de base des valeurs du cartouche
    cell(96, 288, 'Poste'); cell(288, 502, 'Observé en');
    fit(text(D.svg, 108, VY, 'Assemblage 3', { size: 17, weight: 700, fill: C.ink }), 282, 'cartouche poste');
    cell(578, 660, 'Version'); cell(660, 796, 'Date'); cell(796, 984, 'Propriétaire');
    // Lignes du standard : fonds et intitulés
    CX.forEach(x => ROWS.forEach((r, i) => el('rect', { x: x + 12, y: ROW_Y0 + i * ROW_P, width: CW - 24, height: ROW_H, rx: 9, fill: ROW_BG })));

    const LB = layer();
    S.rows = ROWS.map((r, i) => {
      const cy = rowCy(i), y0 = ROW_Y0 + i * ROW_P;
      const hl = (x, fill) => el('rect', { x: x + 12, y: y0, width: CW - 24, height: ROW_H, rx: 9, fill }, LB);
      const L = { hl: hl(CX[0], C.pGreen), flag: hl(CX[0], C.pYellow) };
      const R = { hl: hl(CX[1], C.pRed) };
      L.sign = el('path', { d: `M ${CX[0] + 24} ${cy} H ${CX[0] + 36} M ${CX[0] + 30} ${cy - 6} V ${cy + 6}`, stroke: C.tGreen, 'stroke-width': 3, 'stroke-linecap': 'round' }, LB);
      R.sign = el('path', { d: `M ${CX[1] + 24} ${cy} H ${CX[1] + 36}`, stroke: C.tRed, 'stroke-width': 3, 'stroke-linecap': 'round' }, LB);
      return { L, R, cy };
    });
    CX.forEach(x => ROWS.forEach((r, i) => fit(text(D.svg, x + 42, rowCy(i) + 5.5, r.label, { size: 15, weight: 700, fill: MUTED }), x + VAL_DX - 8, `intitulé ${r.label}`)));

    const LC = layer();
    // Valeurs, rature, curseur de frappe
    S.rows.forEach((row, i) => {
      const vy = row.cy + 6.5;
      row.L.val = text(LC, CX[0] + VAL_DX, vy, ROWS[i].v[0], { size: 18, weight: 700, fill: C.ink });
      row.R.val = text(LC, CX[1] + VAL_DX, vy, ROWS[i].v[0], { size: 18, weight: 700, fill: C.ink });
      fitVariants(row.L.val, ROWS[i].v, CX[0] + CW - 20, `poste ligne ${i + 1}`);
      fitVariants(row.R.val, ROWS[i].v, CX[1] + CW - 20, `standard ligne ${i + 1}`);
      row.w = ROWS[i].v.map(v => { row.R.val.textContent = v; return row.R.val.getBBox().width; });
      row.R.val.textContent = ROWS[i].v[0];
    });
    S.strike = el('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: C.tRed, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, LC);
    S.caret = el('rect', { x: 0, y: 0, width: 2.5, height: 22, rx: 1, fill: C.blue }, LC);
    // Ligne « Réglage » au poste : la marque de l'équipe de nuit
    {
      const row = S.rows[3], g = el('g', {}, LC), cx = CX[0] + CW - 52;
      el('rect', { x: cx - 36, y: row.cy - 13, width: 72, height: 26, rx: 13, fill: C.ink }, g);
      el('circle', { cx: cx - 20, cy: row.cy, r: 6.5, fill: C.white }, g);
      el('circle', { cx: cx - 16.5, cy: row.cy - 3, r: 5.6, fill: C.ink }, g);
      fit(text(g, cx - 8, row.cy + 5.5, 'nuit', { size: 15, weight: 700, fill: C.white }), cx + 34, 'marque nuit');
      row.night = g;
      row.L.val.textContent = ROWS[3].v[1];
      D.noOverlap(row.L.val, g, 'valeur réglage / marque nuit', 8);
      row.L.val.textContent = ROWS[3].v[0];
    }
    // Ligne « Serrage » : l'écart remonté par l'opérateur, puis reçu et décidé par le propriétaire
    {
      const row = S.rows[2];
      const g = el('g', {}, LC), x1 = CX[0] + CW - 18;
      const r = el('rect', { y: row.cy - 13, height: 26, rx: 13, fill: C.yellow }, g);
      const tx = text(g, 0, row.cy + 5.5, 'Impossible', { size: 15, weight: 800, fill: C.ink });
      const w = tx.getBBox().width + 26;
      r.setAttribute('x', x1 - w); r.setAttribute('width', w);
      tx.setAttribute('x', x1 - w + 13);
      row.flagChip = g; row.flagC = [x1 - w / 2, row.cy];
      D.noOverlap(row.L.val, g, 'valeur serrage / écart', 8);
      const rx = CX[1] + CW - 62;
      row.recu = chip(LC, rx, row.cy, 'Reçu', { bg: C.pLav, fg: C.blue, minW: 88 }).g;
      row.decide = chip(LC, rx, row.cy, 'Décidé', { bg: C.pGreen, fg: C.tGreen, minW: 88 }).g;
      D.noOverlap(row.R.val, row.recu, 'valeur serrage / reçu', 8);
      row.chipC = [rx, row.cy];
    }
    // Gouttière du diff
    S.rows.forEach(row => {
      const g = el('g', {}, LC), cy = row.cy;
      const v = {};
      const mk = (fill, draw) => { const s = el('g', {}, g); el('circle', { cx: GUT, cy, r: 13, fill }, s); draw(s); return s; };
      const eq = color => s => el('path', { d: `M ${GUT - 5.5} ${cy - 3} H ${GUT + 5.5} M ${GUT - 5.5} ${cy + 3} H ${GUT + 5.5}`, stroke: color, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, s);
      v.eq = mk(C.pLav, eq(MUTED));
      v.ok = mk(C.pGreen, eq(C.tGreen));
      v.neq = mk(C.red, s => { eq(C.white)(s); el('line', { x1: GUT + 3.5, y1: cy - 7.5, x2: GUT - 3.5, y2: cy + 7.5, stroke: C.white, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, s); });
      v.flag = mk(C.yellow, s => text(s, GUT, cy + 6, '!', { size: 17, weight: 800, fill: C.ink, anchor: 'middle' }));
      row.g = g; row.gv = v;
    });
    // Balayage de la revue de décembre
    S.sweep = el('rect', { x: CX[0] + 8, y: -ROW_H / 2 - 2, width: CX[1] + CW - 8 - CX[0] - 8, height: ROW_H + 4, rx: 11, fill: C.blue, 'fill-opacity': 0.12, stroke: C.blue, 'stroke-opacity': 0.3, 'stroke-width': 2 }, LC);

    // Cartouche du standard : version, date, propriétaire
    const cpV = clip('cpVer', 586, VY - 20, 66, 26), cpD = clip('cpDate', 668, VY - 20, 124, 26);
    const gV = el('g', { 'clip-path': cpV }, LC), gD = el('g', { 'clip-path': cpD }, LC);
    S.verA = text(gV, 590, VY, 'v1', { size: 17, weight: 800, fill: C.blue });
    S.verB = text(gV, 590, VY, 'v2', { size: 17, weight: 800, fill: C.blue });
    S.dateA = text(gD, 672, VY, DATES[0], { size: 17, weight: 700, fill: C.ink });
    S.dateB = text(gD, 672, VY, DATES[1], { size: 17, weight: 700, fill: C.ink });
    fitVariants(S.dateA, DATES, 790, 'cartouche date');
    S.ownerNone = el('g', {}, LC);
    el('circle', { cx: 819, cy: VY - 6, r: 10, fill: 'none', stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '4 3.5' }, S.ownerNone);
    text(S.ownerNone, 838, VY, 'Aucun', { size: 17, weight: 700, fill: MUTED });
    S.ownerAv = el('g', {}, LC);
    avatar(S.ownerAv, 819, VY - 6, 11, C.teal);
    S.ownerName = text(LC, 838, VY, 'Chef d’équipe', { size: 17, weight: 800, fill: C.ink });
    fit(S.ownerName, 980, 'propriétaire');
    // Cartouche du poste : le mois observé suit la tête de lecture
    S.monthTxt = text(LC, 300, VY, 'janv. 2025', { size: 17, weight: 700, fill: C.ink });
    fitVariants(S.monthTxt, MONTHS.map(m => `${m} 2025`), 496, 'mois observé');
    // L'audit qui le trouve « conforme »
    {
      const g = el('g', {}, LC), x1 = CX[1] + CW - 14, cy = CARD_Y + 27;
      const r = el('rect', { y: cy - 15, height: 30, rx: 15, fill: C.pGreen }, g);
      const tx = text(g, 0, cy + 5.5, `Audit${NB}: conforme`, { size: 15, weight: 800, fill: C.tGreen });
      const w = tx.getBBox().width + 50;
      r.setAttribute('x', x1 - w); r.setAttribute('width', w);
      tx.setAttribute('x', x1 - w + 38);
      el('circle', { cx: x1 - w + 20, cy, r: 10, fill: C.green }, g);
      checkPath(g, x1 - w + 20, cy, 0.8, C.white, 2.6);
      S.audit = g; S.auditC = [x1 - w / 2, cy];
      fit(r, x1, 'audit', CX[1] + 226);
    }

    // ----- Bandeau du bas : sans propriétaire / avec propriétaire -----
    el('rect', { x: STRIP.x[0], y: STRIP.y, width: STRIP.w, height: STRIP.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    text(D.svg, STRIP.x[0] + 22, STRIP.y + 31, 'SANS PROPRIÉTAIRE', { size: 15, weight: 800, fill: C.tRed }).setAttribute('letter-spacing', 0.8);
    const LD = layer();
    S.boxGhost = el('rect', { x: STRIP.x[1], y: STRIP.y, width: STRIP.w, height: STRIP.h, rx: 18, fill: 'none', stroke: DASH, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, LD);
    S.boxSolid = el('rect', { x: STRIP.x[1], y: STRIP.y, width: STRIP.w, height: STRIP.h, rx: 18, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, LD);
    S.boxTitle = text(LD, STRIP.x[1] + 22, STRIP.y + 31, 'AVEC PROPRIÉTAIRE', { size: 15, weight: 800, fill: C.blue });
    S.boxTitle.setAttribute('letter-spacing', 0.8);
    const LY = [STRIP.y + 66, STRIP.y + 99, STRIP.y + 132];
    const CONS = [
      ['oeil', [['Les opérateurs '], ['ne le consultent plus', C.tRed]]],
      ['duo', [['Les nouveaux apprennent '], ['avec un collègue', C.tRed]]],
      ['audit', [['L’audit le trouve en place, donc '], ['conforme', C.tRed]]],
    ];
    S.cons = CONS.map(([icon, parts], i) => {
      const g = el('g', {}, LD), x = STRIP.x[0] + 22;
      disc(g, x + 11, LY[i] - 6, 11, C.red, icon);
      fit(spans(g, x + 32, LY[i], parts, 16), STRIP.x[0] + STRIP.w - 14, `conséquence ${i + 1}`);
      return g;
    });
    const RESP = [
      [[['1', C.blue, 800], [`${NB}·${NB}`], ['Le tenir à jour', C.ink]], C.blue, 'maj'],
      [[['2', C.blue, 800], [`${NB}·${NB}`], ['Recevoir les écarts', C.ink], [', et décider']], C.yellow, 'ecart'],
      [[['3', C.blue, 800], [`${NB}·${NB}`], ['Le revoir à date fixe', C.ink], [', au poste']], C.teal, 'revue'],
    ];
    S.resp = RESP.map(([parts, color, icon], i) => {
      const g = el('g', {}, LD), x = STRIP.x[1] + 22, cy = LY[i] - 6;
      el('rect', { x, y: cy - 10, width: 20, height: 20, rx: 5, fill: C.white, stroke: C.blue, 'stroke-width': 2.2 }, g);
      const on = el('rect', { x, y: cy - 10, width: 20, height: 20, rx: 5, fill: C.green, stroke: C.green, 'stroke-width': 2.2 }, g);
      const ck = checkPath(g, x + 10, cy, 0.95, C.white, 2.8);
      const tx = spans(g, x + 32, LY[i], parts, 16);
      const ev = disc(g, STRIP.x[1] + STRIP.w - 30, cy, 11, color, icon);
      fit(tx, STRIP.x[1] + STRIP.w - 50, `responsabilité ${i + 1}`);
      return { g, on, ck, len: 22, ev };
    });

    // ----- Pastilles d'étape et compteur de différences -----
    const PILLS = [
      ['Le poste évolue, le standard reste en v1', { bg: C.blue, fg: C.white }],
      ['Il décrit un travail qui n’existe plus', { bg: C.pRed, fg: C.tRed }],
      ['La même année, avec un propriétaire', { bg: C.blue, fg: C.white }],
      ['Le standard reste juste', { bg: C.pGreen, fg: C.tGreen, icon: true }],
    ];
    S.pills = PILLS.map(([label, o], i) => { const g = pillShape(LD, 88, PILL_Y, label, o); fit(g, 770, `pastille ${i + 1}`); return g; });
    el('rect', { x: 790, y: PILL_Y - 21, width: 202, height: 42, rx: 21, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    fit(text(D.svg, 810, PILL_Y + 6, 'Différences', { size: 16, weight: 700, fill: C.ink }), 936, 'compteur');
    const LE = layer();
    S.cntBox = el('rect', { x: 944, y: PILL_Y - 16, width: 42, height: 32, rx: 16, fill: C.green }, LE);
    const gC = el('g', { 'clip-path': clip('cpCnt', 944, PILL_Y - 16, 42, 32) }, LE);
    S.cntA = text(gC, 965, PILL_Y + 7.5, '0', { size: 21, weight: 800, fill: C.white, anchor: 'middle' });
    S.cntB = text(gC, 965, PILL_Y + 7.5, '0', { size: 21, weight: 800, fill: C.white, anchor: 'middle' });

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_IN;
    const s = final ? END : t;
    const fade = final ? 1 - prog(t, T_OUT, T_IN - T_OUT) : prog(t, T_IN, 0.2);
    S.layers.forEach(g => g.setAttribute('opacity', f2(fade)));
    const M = month(s);
    const xm = X(M);

    // Piste « avec propriétaire » : fantôme en pointillés, puis piste réelle
    const lane2 = final ? 1 - prog(t, T_OUT, T_IN - T_OUT) : prog(s, T_RW0 + 0.1, 0.3);
    vis(S.ghostLane, 1 - lane2);
    vis(S.lane2, lane2);
    S.laneLabels[2].setAttribute('opacity', f2(0.4 + 0.6 * lane2));

    // Parties parcourues des pistes
    const setX2 = (n, x) => n.setAttribute('x2', f2(x));
    setX2(S.progP, xm);
    vis(S.progP, M > 0.02 ? 1 : 0);
    const m0 = s < T_RW0 ? M : 11;
    setX2(S.progS0g, X(Math.min(m0, 2)));
    vis(S.progS0g, m0 > 0.02 ? 1 : 0);
    setX2(S.progS0r, X(Math.max(m0, 2)));
    vis(S.progS0r, m0 > 2.02 ? 1 : 0);
    setX2(S.progS1, xm);
    vis(S.progS1, s >= T_RW1 && M > 0.02 ? 1 : 0);
    vis(S.ph, final ? 0 : 1 - prog(s, T_REVUES[2], 0.25), `translate(${f2(xm)} 0)`);

    // Marqueurs de la frise
    S.pm.forEach((mk, k) => {
      const p = prog(s, k < 3 ? P1[k] : T_FLAG, 0.3);
      let kk = popScale(p);
      if (k < 3) { const pb = prog(s, P2[k], 0.36); if (pb > 0 && pb < 1) kk *= 1 + 0.3 * Math.sin(Math.PI * pb); }
      // Année rejouée : ce qui n'est pas encore atteint par la tête de lecture reste en retrait
      const m = k < 3 ? EVENTS[k].m : ECART_M;
      const ahead = s >= T_RW0 ? lerp(0.35, 1, clamp((M - m + 0.3) / 0.3)) : 1;
      vis(mk.g, clamp(p / 0.3) * ahead, scaleAt(mk.x, LANE[0], kk));
      vis(mk.label, clamp(p / 0.3) * ahead);
    });
    S.s0tick.forEach((g, k) => { const p = prog(s, P1[k] + SW_MID, 0.3); vis(g, clamp(p / 0.3), scaleAt(X(EVENTS[k].m), LANE[1], popScale(p))); });
    S.s1v.forEach((g, k) => {
      const p = prog(s, k ? VER_T[k - 1] : T_RW1, 0.32);
      const m = k ? (k < 4 ? EVENTS[k - 1].m : ECART_M) : 0;
      vis(g, clamp(p / 0.3), scaleAt(X(m), LANE[2], popScale(p)));
    });
    S.s1r.forEach((g, k) => { const p = prog(s, T_REVUES[k], 0.32); vis(g, clamp(p / 0.3), scaleAt(X(REVUE_M[k]), LANE[2], popScale(p))); });
    S.conn.forEach((c, k) => {
      const p = easeInOut(prog(s, k < 3 ? REV[k] : T_V5, TY));
      if (p <= 0) { c.n.setAttribute('display', 'none'); return; }
      c.n.removeAttribute('display');
      if (p >= 1) { c.n.removeAttribute('stroke-dasharray'); c.n.removeAttribute('stroke-dashoffset'); }
      else { c.n.setAttribute('stroke-dasharray', f2(c.len)); c.n.setAttribute('stroke-dashoffset', f2(c.len * (1 - p))); }
    });

    // Lignes du diff
    let strikeOn = false, caretOn = false;
    S.rows.forEach((row, r) => {
      const h = hlAt(r, s);
      vis(row.L.hl, h); vis(row.R.hl, h); vis(row.L.sign, h); vis(row.R.sign, h);
      const fl = r === 2 ? prog(s, T_FLAG, 0.15) * (1 - prog(s, T_V5 + TY, 0.15)) : 0;
      vis(row.L.flag, fl);

      // Poste réel : l'ancienne valeur sort, puis la nouvelle entre
      const ev = LEFT[r];
      let k = -1;
      ev.forEach(([te], i) => { if (s >= te) k = i; });
      let str = ROWS[r].v[0], dy = 0, o = 1, cur = 0;
      if (k >= 0) {
        const [te, to] = ev[k], from = k ? ev[k - 1][1] : 0, u = s - te;
        cur = to; str = ROWS[r].v[to];
        if (u < SW_MID) { const q = u / SW_MID; str = ROWS[r].v[from]; cur = from; dy = -9 * easeIn(q); o = 1 - q; }
        else if (u < SW) { const q = (u - SW_MID) / (SW - SW_MID); dy = 9 * (1 - easeOut(q)); o = q; }
      }
      row.L.val.textContent = str;
      vis(row.L.val, o, dy ? `translate(0 ${f2(dy)})` : '');
      if (row.night) vis(row.night, cur === 1 ? o : 0, dy ? `translate(0 ${f2(dy)})` : '');

      // Standard affiché : rature, effacement, puis la révision se tape
      const evr = RIGHT[r];
      let kr = -1;
      evr.forEach(([te], i) => { if (s >= te) kr = i; });
      let rs = ROWS[r].v[0], ro = 1;
      if (kr >= 0) {
        const [te, to] = evr[kr], from = kr ? evr[kr - 1][1] : 0, u = s - te;
        rs = ROWS[r].v[to];
        if (u < TY_START) {
          rs = ROWS[r].v[from];
          const sp = easeOut(prog(u, 0, TY_STRIKE));
          ro = 1 - prog(u, TY_STRIKE, TY_START - TY_STRIKE);
          const x0 = CX[1] + VAL_DX - 3;
          S.strike.setAttribute('x1', f2(x0)); S.strike.setAttribute('x2', f2(x0 + (row.w[from] + 6) * sp));
          S.strike.setAttribute('y1', f2(row.cy)); S.strike.setAttribute('y2', f2(row.cy));
          vis(S.strike, ro);
          strikeOn = true;
        } else if (u < TY) {
          const full = ROWS[r].v[to], n = Math.ceil(full.length * (u - TY_START) / (TY - TY_START));
          rs = full.slice(0, n);
          row.R.val.textContent = rs;
          const w = rs ? row.R.val.getBBox().width : 0;
          S.caret.setAttribute('x', f2(CX[1] + VAL_DX + w + 2));
          S.caret.setAttribute('y', f2(row.cy - 11));
          vis(S.caret, 1);
          caretOn = true;
        }
      }
      row.R.val.textContent = rs;
      vis(row.R.val, rs ? ro : 0);

      // Gouttière : le marqueur change d'état avec un petit rebond
      const st = gState(r, s);
      let tc = -1;
      for (const tg of G_T[r]) if (tg <= s && gState(r, tg - 1e-4) !== gState(r, tg + 1e-6)) tc = tg;
      const kg = tc >= 0 ? popScale(prog(s, tc, 0.28)) : 1;
      Object.entries(row.gv).forEach(([name, n]) => vis(n, name === st ? 1 : 0, name === st ? scaleAt(GUT, row.cy, kg) : undefined));
    });
    if (!strikeOn) S.strike.setAttribute('display', 'none');
    if (!caretOn) S.caret.setAttribute('display', 'none');

    // Écart remonté (ligne Serrage) : « Impossible » au poste, « Reçu » puis « Décidé » au standard
    const r2 = S.rows[2];
    const pf = prog(s, T_FLAG + 0.05, 0.3);
    vis(r2.flagChip, clamp(pf / 0.3) * (1 - prog(s, T_V5 - 0.08, 0.08)), scaleAt(r2.flagC[0], r2.flagC[1], popScale(pf)));
    const pr = prog(s, T_RECU, 0.3);
    vis(r2.recu, clamp(pr / 0.3) * (1 - prog(s, T_DECIDE, 0.1)), scaleAt(r2.chipC[0], r2.chipC[1], popScale(pr)));
    const pd = prog(s, T_DECIDE + 0.1, 0.3);
    vis(r2.decide, clamp(pd / 0.3) * (1 - prog(s, T_V5 - 0.08, 0.08)), scaleAt(r2.chipC[0], r2.chipC[1], popScale(pd)));

    // Revue de décembre : une bande parcourt les lignes
    const pw = prog(s, T_SWEEP, SWEEP_DUR);
    const swy = lerp(rowCy(0), rowCy(4), easeInOut(pw));
    vis(S.sweep, pw > 0 && pw < 1 ? Math.sin(Math.PI * pw) : 0, `translate(0 ${f2(swy)})`);

    // Cartouche du standard : la version et la date défilent à chaque révision
    const vi = verAt(s);
    let vt = -1;
    VER_T.forEach(tv => { if (s >= tv) vt = tv; });
    const pv = vt >= 0 ? prog(s, vt, 0.3) : 1;
    roll(S.verA, S.verB, `v${Math.max(1, vi - 1)}`, `v${vi}`, pv, CARD_Y + 85, 24);
    roll(S.dateA, S.dateB, DATES[Math.max(0, vi - 2)], DATES[vi - 1], pv, CARD_Y + 85, 24);
    // Propriétaire : « Aucun », puis le badge du chef d'équipe se pose dans le cercle fantôme
    vis(S.ownerNone, 1 - prog(s, T_OWNER - 0.12, 0.1));
    const po = prog(s, T_OWNER, OWNER_DUR);
    const ka = po >= 1 ? 1 : 1 + 0.25 * (1 - easeIn(po));
    vis(S.ownerAv, clamp(po / 0.25), scaleAt(819, CARD_Y + 79, ka));
    if (po > 0 && po < 1) S.ownerAv.setAttribute('filter', 'url(#lift)'); else S.ownerAv.removeAttribute('filter');
    const pn = prog(s, T_OWNER + OWNER_DUR - 0.05, 0.22);
    vis(S.ownerName, pn, pn < 1 ? `translate(${f2(-10 * (1 - easeOut(pn)))} 0)` : '');
    // Cartouche du poste : le mois observé
    S.monthTxt.textContent = `${MONTHS[clamp(Math.floor(M + 0.02), 0, 11)]} 2025`;
    // Audit « conforme », pendant la première année seulement
    const pa = prog(s, T_CONS[2] + 0.05, 0.3);
    vis(S.audit, clamp(pa / 0.3) * (1 - prog(s, T_RW0, 0.12)), scaleAt(S.auditC[0], S.auditC[1], popScale(pa)));

    // Compteur de différences
    const n = cntAt(s);
    let tcn = -1;
    TOG.forEach(x => { if (x <= s && cntAt(x - 1e-4) !== cntAt(x + 1e-6)) tcn = x; });
    const pcn = tcn >= 0 ? prog(s, tcn, 0.25) : 1;
    const prev = tcn >= 0 ? cntAt(tcn - 1e-4) : n;
    roll(S.cntA, S.cntB, String(prev), String(n), pcn, PILL_Y + 7.5, 30, n >= prev ? 1 : -1);
    S.cntBox.setAttribute('fill', (pcn < 0.5 ? prev : n) > 0 ? C.red : C.green);

    // Bandeau du bas
    S.cons.forEach((g, i) => { const p = prog(s, T_CONS[i], 0.3); vis(g, p, p < 1 ? `translate(${f2(-14 * (1 - easeOut(p)))} 0)` : ''); });
    vis(S.boxGhost, 1 - lane2);
    vis(S.boxSolid, lane2);
    S.boxTitle.setAttribute('opacity', f2(0.4 + 0.6 * lane2));
    S.resp.forEach((rp, i) => {
      const p = prog(s, T_RLINES[i], 0.3);
      vis(rp.g, p, p < 1 ? `translate(${f2(-14 * (1 - easeOut(p)))} 0)` : '');
      const pk = prog(s, T_TICK[i], 0.25);
      vis(rp.on, clamp(pk / 0.4));
      if (pk <= 0) rp.ck.setAttribute('display', 'none');
      else {
        rp.ck.removeAttribute('display');
        if (pk >= 1) { rp.ck.removeAttribute('stroke-dasharray'); rp.ck.removeAttribute('stroke-dashoffset'); }
        else { rp.ck.setAttribute('stroke-dasharray', rp.len); rp.ck.setAttribute('stroke-dashoffset', f2(rp.len * (1 - easeOut(pk)))); }
      }
    });

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = T_PILLS[i] + (i ? 0.12 : 0);
      const o = i === S.pills.length - 1 ? prog(s, a, 0.25) : prog(s, a, 0.25) * (1 - prog(s, T_PILLS[i + 1], 0.12));
      const dy = 8 * (1 - prog(s, a, 0.25));
      vis(g, o, dy > 0.01 ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
