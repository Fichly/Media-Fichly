// Fiche LinkedIn · Clément Raymond · jeudi 8 octobre 2026
// Post : « Non-valeur ajoutée nécessaire. » C'est souvent la case où l'on range tout ce qu'on n'a pas
// envie de remettre en question. Trois questions avant d'y ranger une activité.
// Premier commentaire du post (Buffer) : nos fiches Lean → encart.
// Le visuel est la pièce maîtresse : un convoyeur de tri à trois portiques. Les quatre activités du post
// sortent d'un tunnel, toutes étiquetées « NVA nécessaire », et avancent pas à pas. Chaque portique scanne
// une question (pour qui ? à cause de quoi ? jusqu'à quand ?) : voyant, verdict et raison sur l'écran à son
// pied. À la sortie, l'aiguillage remonte dans la case celles qui passent les trois questions et ouvre la
// trappe aux autres, qui tombent dans la colonne « Gaspillage ».
// Style propre : le convoyeur de tri indexé. Image t = 0 = état final. Boucle exacte de 12,5 s.
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
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', IDLE = '#e2e2ee', POST = '#b9b9d6';
  const BELT = '#dcdce9', BELT_DASH = '#a9a9c9', HEAD_SOFT = '#cfd0ec';
  const SCREEN = C.ink, SCREEN_MUTED = '#9a9ac8', SCREEN_LINE = '#4a4a86', LAMP_OFF = '#5c5c94';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 700 };
  const STEP = 216;                        // pas du convoyeur indexé
  const GX = [232, 448, 664];              // portiques
  const AX = 880;                          // aiguillage (= GX[0] + 3 pas)
  const CW = 192, CH = 96;                 // cartes
  const CARD_Y = 682;                      // haut d'une carte posée sur le tapis
  const BELT_Y = 778, BELT_X1 = 776;       // surface du tapis, fin du tapis
  const BEAM = { y: 520, h: 76, w: 204 };
  const HEAD_Y = 596;
  const POSTS = [124, 340, 556, 770];      // montants partagés des portiques
  const SCR = { y: 830, h: 230, w: 202 };  // écrans au pied des portiques
  const BASE_Y = 1072;
  const BIN = { x: 777, w: 206 };
  const CASE = { y: 426, h: 244 }, CASE_SLOT = [466, 568];
  const COL = { y: 812, h: 280 }, COL_SLOT = [954, 852];
  const TUNNEL = { x: 60, x1: 118, y: 664, y1: 800 };

  // ---------- Contenu (le post) ----------
  const QUESTIONS = [
    [`1${NB}·${NB}Nécessaire`, `pour qui${NB}?`],
    [`2${NB}·${NB}Nécessaire`, `à cause de quoi${NB}?`],
    [`3${NB}·${NB}Nécessaire`, `jusqu’à quand${NB}?`],
  ];
  // Ordre sur le convoyeur. Verdicts : choix plausibles (le post ne tranche pas), signalés dans le compte rendu.
  const CARDS = [
    { name: ['Changement', 'de série'], answers: [
      [true, ['Le client :', 'plusieurs produits']],
      [true, ['La diversité,', 'pas un défaut']],
      [true, ['Tant qu’on change', 'de produit']]] },
    { name: ['Contrôle', 'final'], answers: [
      [true, ['Le client,', 'la réglementation']],
      [true, ['Une exigence,', 'pas un défaut']],
      [true, ['Tant que le process', 'ne garantit pas', 'la qualité']]] },
    { name: ['Transport vers', 'le magasin'], answers: [
      [true, ['Le client,', 'pour être livré']],
      [false, ['Compense un', 'flux instable']]] },
    { name: ['Validation par', 'le chef d’équipe'], answers: [
      [false, ['Une habitude', 'interne']]] },
  ];
  const KEPT = CARDS.map(c => c.answers.length === 3 && c.answers.every(a => a[0]));

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5, END = DURATION - 0.001;
  const T_OUT = 1.1, OUT_DUR = 0.3, T0 = T_OUT + OUT_DUR;   // l'état final s'efface, puis tout repart
  const M = [1.45, 2.85, 4.45, 6.3, 8.2, 9.3, 10.45], MOVE = 0.45;   // pas du convoyeur
  const SCAN_OFF = [0.05, 0.25, 0.45], SWEEP = 0.4;
  const LIFT = 0.55, FLAP = 0.12, G_FALL = 3770, BOUNCE = 0.3;
  const PILLS = [
    [T0, `1${NB}·${NB}Toutes étiquetées «${NB}NVA nécessaire${NB}»`],
    [M[1], `2${NB}·${NB}Trois questions, une par portique`],
    [M[3], `3${NB}·${NB}À la sortie, l’aiguillage trie`],
    [11.35, '2 restent dans la case, 2 changent de colonne'],
  ];

  // Scans : la carte i passe sous le portique g après le pas k = i + g ; une carte refusée n'est plus scannée
  const SCANS = [];
  CARDS.forEach((c, i) => c.answers.forEach(([ok, reason], g) => {
    const ts = M[i + g] + MOVE + SCAN_OFF[g];
    SCANS.push({ g, i, ts, tv: ts + SWEEP, ok, reason });
  }));
  const scanOf = (g, i) => SCANS.find(s => s.g === g && s.i === i);
  const T_FAIL = CARDS.map((c, i) => { const s = SCANS.find(x => x.i === i && !x.ok); return s ? s.tv : Infinity; });
  const T_PASS = CARDS.map((c, i) => (KEPT[i] ? scanOf(2, i).tv : Infinity));
  const T_A = CARDS.map((c, i) => M[i + 3] + MOVE + 0.05);   // arrivée à l'aiguillage
  // Chute dans la colonne : la première au fond, la seconde sur elle
  const FALL = CARDS.map((c, i) => {
    if (KEPT[i]) return null;
    const slot = KEPT.slice(0, i).filter(k => !k).length;
    const y1 = COL_SLOT[slot], dur = Math.sqrt(2 * (y1 - CARD_Y) / G_FALL);
    return { slot, y1, t0: T_A[i] + 0.08, dur, land: T_A[i] + 0.08 + dur };
  });
  const LIFTS = CARDS.map((c, i) => (KEPT[i] ? { slot: KEPT.slice(0, i).filter(k => k).length } : null));

  // ---------- Petits éléments ----------
  function pillShape(parent, x, cy, label, { bg, fg, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, x + 20, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40);
    return g;
  }
  const checkMark = (parent, cx, cy, r, color = C.green) => {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r, fill: color }, g);
    const k = r / 11;
    el('path', { d: `M ${f2(cx - 5 * k)} ${f2(cy + 0.5 * k)} L ${f2(cx - 1.2 * k)} ${f2(cy + 4.3 * k)} L ${f2(cx + 5.5 * k)} ${f2(cy - 3.8 * k)}`, fill: 'none', stroke: C.white, 'stroke-width': f2(2.8 * k), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  };
  const show = (n, on) => n.setAttribute('display', on ? 'inline' : 'none');

  const S = { cards: [], gates: [] };

  function build() {
    D.template({ author: 'clement' });
    D.title(`NVA nécessaire${NB}?`, 'Trois questions.');
    D.chapeau('La case où l’on range ce qu’on n’a pas envie de remettre en question.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, color]) => { const sp = el('tspan', color ? { 'font-weight': 700, fill: color } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Chaque activité passe sous ', 0], ['trois portiques', C.blue], [', un par question.', 0]]);
    line(384, [['Trois voyants verts', C.tGreen], [`${NB}: elle reste dans la case. `, 0], ['Un seul rouge', C.tRed], [`${NB}: elle change de colonne.`, 0]]);

    const defs = el('defs');
    const cpF = el('clipPath', { id: 'frame' }, defs);
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26 }, cpF);
    const cpCase = el('clipPath', { id: 'caseBox' }, defs);
    el('rect', { x: BIN.x, y: CASE.y, width: BIN.w, height: CASE.h, rx: 16 }, cpCase);
    const cpCol = el('clipPath', { id: 'colBox' }, defs);
    el('rect', { x: BIN.x, y: COL.y, width: BIN.w, height: COL.h, rx: 16 }, cpCol);
    const cpFlap = el('clipPath', { id: 'flap' }, defs);
    el('rect', { x: 0, y: 0, width: 102, height: 8, rx: 2 }, cpFlap);
    const lift = el('filter', { id: 'lift', x: '-30%', y: '-30%', width: '160%', height: '180%' }, defs);
    el('feDropShadow', { dx: 0, dy: 10, stdDeviation: 8, 'flood-color': C.ink, 'flood-opacity': 0.24 }, lift);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });

    // ----- Bâti des portiques (montants et rail du bas, derrière tout) -----
    POSTS.forEach(x => el('rect', { x: x - 3, y: HEAD_Y - 4, width: 6, height: BASE_Y - HEAD_Y + 4, rx: 2, fill: POST }));
    el('rect', { x: POSTS[0] - 8, y: BASE_Y, width: POSTS[3] - POSTS[0] + 16, height: 8, rx: 4, fill: POST });

    // ----- La case et la colonne -----
    el('rect', { x: BIN.x, y: CASE.y, width: BIN.w, height: CASE.h, rx: 16, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2.5 });
    el('rect', { x: BIN.x, y: CASE.y, width: BIN.w, height: 34, fill: C.yellow, 'clip-path': 'url(#caseBox)' });
    fit(text(D.svg, AX, CASE.y + 24, 'NVA nécessaire', { size: 17, weight: 800, fill: C.ink, anchor: 'middle' }), BIN.x + BIN.w - 8, 'en-tête case', BIN.x + 8);
    S.caseGhost = CASE_SLOT.map(y => el('rect', { x: AX - CW / 2, y, width: CW, height: CH, rx: 14, fill: 'none', stroke: '#e3d39a', 'stroke-width': 2, 'stroke-dasharray': '7 6' }));
    el('rect', { x: BIN.x, y: COL.y, width: BIN.w, height: COL.h, rx: 16, fill: C.pRed, stroke: C.red, 'stroke-width': 2.5 });
    el('rect', { x: BIN.x, y: COL.y + COL.h - 36, width: BIN.w, height: 36, fill: C.red, 'clip-path': 'url(#colBox)' });
    fit(text(D.svg, AX, COL.y + COL.h - 12, 'Gaspillage', { size: 17, weight: 800, fill: C.white, anchor: 'middle' }), BIN.x + BIN.w - 8, 'pied colonne', BIN.x + 8);
    S.colGhost = COL_SLOT.map(y => el('rect', { x: AX - CW / 2, y, width: CW, height: CH, rx: 14, fill: 'none', stroke: '#f2b5b5', 'stroke-width': 2, 'stroke-dasharray': '7 6' }));

    // ----- Tapis : corps, rouleaux, bande pointillée qui avance -----
    el('rect', { x: FRAME.x - 20, y: BELT_Y, width: BELT_X1 - FRAME.x + 20, height: 20, rx: 10, fill: BELT, stroke: '#c4c4dc', 'stroke-width': 2, 'clip-path': 'url(#frame)' });
    S.rollers = [];
    for (let x = 80; x <= BELT_X1 - 16; x += 36) {
      const g = el('g', { transform: `translate(${x} ${BELT_Y + 10})` });
      el('circle', { cx: 0, cy: 0, r: 6, fill: FRAME_BG, stroke: '#a3a3c2', 'stroke-width': 2 }, g);
      const sp = el('path', { d: 'M -4 0 H 4 M 0 -4 V 4', stroke: '#a3a3c2', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, g);
      S.rollers.push(sp);
    }
    S.beltDash = el('line', { x1: FRAME.x, y1: BELT_Y + 2, x2: BELT_X1 - 8, y2: BELT_Y + 2, stroke: BELT_DASH, 'stroke-width': 4, 'stroke-dasharray': '14 10', 'stroke-linecap': 'butt' });

    // ----- Aiguillage : deux volets à hachures, charnières aux bords -----
    el('rect', { x: BIN.x + 2, y: BELT_Y + 8, width: BIN.w - 4, height: 10, rx: 3, fill: '#c4c4dc' });
    S.flaps = [[BIN.x + 1, 1], [BIN.x + BIN.w - 1, -1]].map(([hx, dir]) => {
      const g = el('g', {});
      const inner = el('g', { transform: dir < 0 ? 'translate(-102 0)' : '' }, g);
      const body = el('g', { 'clip-path': 'url(#flap)' }, inner);
      el('rect', { x: 0, y: 0, width: 102, height: 8, fill: C.yellow }, body);
      for (let k = -1; k < 13; k++) el('path', { d: `M ${k * 9} 8 L ${k * 9 + 8} 0 L ${k * 9 + 12} 0 L ${k * 9 + 4} 8 Z`, fill: C.ink }, body);
      return { g, hx, dir };
    });

    // ----- Rayons de scan (derrière les cartes) -----
    S.gates = GX.map((cx, g) => {
      const cone = el('path', { d: `M ${cx - 18} ${HEAD_Y + 18} L ${cx + 18} ${HEAD_Y + 18} L ${cx + CW / 2 + 2} ${CARD_Y} L ${cx - CW / 2 - 2} ${CARD_Y} Z`, fill: C.lightBlue, opacity: 0.2 });
      return { cx, cone };
    });

    // ----- Traces : sous chaque portique, la dernière activité analysée (relie l'écran à sa carte) -----
    S.traces = GX.map((cx, g) => {
      const i = Math.max(...SCANS.filter(sc => sc.g === g).map(sc => sc.i));
      const ok = scanOf(g, i).ok;
      const tg = el('g', {});
      el('rect', { x: cx - CW / 2, y: CARD_Y, width: CW, height: CH, rx: 14, fill: 'none', stroke: ok ? '#a9d39a' : '#f0a9a9', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, tg);
      CARDS[i].name.forEach((l, k) => fit(text(tg, cx, CARD_Y + 45 + 22 * k, l, { size: 17, weight: 700, fill: '#9d9dc2', anchor: 'middle' }), cx + CW / 2 - 10, `trace ${g + 1}`, cx - CW / 2 + 10));
      return { tg, t0: M[CARDS.length + g] + MOVE };
    });

    // ----- Les cartes -----
    const layer = el('g', { 'clip-path': 'url(#frame)' });
    CARDS.forEach((c, i) => {
      const g = el('g', {}, layer);
      el('rect', { x: -CW / 2, y: 0, width: CW, height: CH, rx: 14, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      const x0 = -CW / 2;
      // Étiquette d'origine et étiquette « Gaspillage »
      const mkTag = (label, bg, fg, stroke) => {
        const tg = el('g', {}, g);
        const r = el('rect', { x: x0 + 10, y: 10, height: 24, rx: 12, fill: bg, stroke, 'stroke-width': 1.5 }, tg);
        const tx = text(tg, x0 + 20, 27, label, { size: 15, weight: 700, fill: fg });
        const w = tx.getBBox().width + 20;
        r.setAttribute('width', w);
        fit(tx, x0 + CW - 10, `étiquette ${i + 1}`, x0 + 10);
        return { tg, w, cx: x0 + 10 + w / 2 };
      };
      const tagN = mkTag('NVA nécessaire', C.pYellow, C.tYellow, C.yellow);
      const tagG = mkTag('Gaspillage', C.pRed, C.tRed, C.red);
      const check = checkMark(g, x0 + 10 + tagN.w + 13, 22, 10);
      c.name.forEach((l, k) => fit(text(g, x0 + 12, 58 + k * 22, l, { size: 17, weight: 800, fill: C.ink }), x0 + CW - 24, `carte ${i + 1} ligne ${k + 1}`, x0 + 10));
      // Voyants de la carte : une question chacun
      const lamps = [0, 1, 2].map(k => el('circle', { cx: x0 + CW - 14, cy: 46 + 16 * k, r: 5.5, fill: IDLE }, g));
      S.cards.push({ g, tagN, tagG, check, lamps });
    });

    // ----- Laser de scan (devant les cartes) -----
    S.gates.forEach(gt => {
      gt.laser = el('g', {});
      el('rect', { x: gt.cx - CW / 2 - 4, y: -7, width: CW + 8, height: 14, rx: 7, fill: C.lightBlue, opacity: 0.22 }, gt.laser);
      el('line', { x1: gt.cx - CW / 2 - 4, y1: 0, x2: gt.cx + CW / 2 + 4, y2: 0, stroke: C.lightBlue, 'stroke-width': 3, 'stroke-linecap': 'round' }, gt.laser);
    });

    // ----- Tunnel d'entrée à lanières (devant les cartes qui attendent) -----
    el('rect', { x: TUNNEL.x, y: TUNNEL.y, width: TUNNEL.x1 - TUNNEL.x, height: TUNNEL.y1 - TUNNEL.y, fill: '#e2e2ef', stroke: '#c4c4dc', 'stroke-width': 2 });
    el('rect', { x: TUNNEL.x, y: TUNNEL.y, width: TUNNEL.x1 - TUNNEL.x + 4, height: 12, rx: 4, fill: '#c4c4dc' });
    S.strips = [];
    for (let x = TUNNEL.x + 12; x <= TUNNEL.x1 - 8; x += 10) S.strips.push({ n: el('path', { d: '', stroke: '#b3b3d1', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }), x });

    // ----- Portiques : traverse (question) et tête de scan -----
    GX.forEach((cx, g) => {
      el('rect', { x: cx - BEAM.w / 2, y: BEAM.y, width: BEAM.w, height: BEAM.h, rx: 14, fill: C.blue });
      const a = text(D.svg, cx, BEAM.y + 28, QUESTIONS[g][0], { size: 16, weight: 700, fill: HEAD_SOFT, anchor: 'middle' });
      const b = text(D.svg, cx, BEAM.y + 59, QUESTIONS[g][1], { size: 20, weight: 800, fill: C.white, anchor: 'middle' });
      fit(a, cx + BEAM.w / 2 - 8, `portique ${g + 1} ligne 1`, cx - BEAM.w / 2 + 8);
      fit(b, cx + BEAM.w / 2 - 8, `portique ${g + 1} question`, cx - BEAM.w / 2 + 8);
      el('rect', { x: cx - 28, y: HEAD_Y, width: 56, height: 18, rx: 5, fill: C.ink });
      S.gates[g].headLamp = el('circle', { cx, cy: HEAD_Y + 9, r: 5.5, fill: LAMP_OFF });
    });

    // ----- Écrans au pied des portiques -----
    GX.forEach((cx, g) => {
      const x0 = cx - SCR.w / 2, gt = S.gates[g];
      el('rect', { x: x0, y: SCR.y, width: SCR.w, height: SCR.h, rx: 18, fill: SCREEN });
      gt.halo = el('circle', { cx: x0 + 30, cy: SCR.y + 34, r: 19, fill: C.green, opacity: 0.25 });
      gt.lamp = el('circle', { cx: x0 + 30, cy: SCR.y + 34, r: 12, fill: LAMP_OFF });
      gt.status = text(D.svg, x0 + 52, SCR.y + 41, 'En attente', { size: 18, weight: 800, fill: SCREEN_MUTED });
      el('line', { x1: x0 + 14, y1: SCR.y + 62, x2: x0 + SCR.w - 14, y2: SCR.y + 62, stroke: SCREEN_LINE, 'stroke-width': 2 });
      gt.reason = el('g', {});
      gt.lines = [0, 1, 2].map(k => text(gt.reason, x0 + 13, SCR.y + 94 + 26 * k, '', { size: 17, weight: 700, fill: C.white }));
      gt.tally = CARDS.map((_, j) => el('rect', { x: x0 + 14 + 26 * j, y: SCR.y + 188, width: 18, height: 18, rx: 5, fill: 'none', stroke: SCREEN_LINE, 'stroke-width': 2 }));
      gt.x0 = x0;
    });
    // Contrôle des raisons : chaque ligne doit tenir dans son écran
    SCANS.forEach(sc => sc.reason.forEach((l, k) => {
      const n = S.gates[sc.g].lines[k];
      n.textContent = l;
      const w = n.getBBox().width;
      if (w > SCR.w - 26) console.error(`Débordement : raison « ${l} » (${Math.round(w)} px)`);
      n.textContent = '';
    }));
    ['Ne passe pas', 'Analyse...', 'En attente'].forEach(st => {
      const n = S.gates[0].status; n.textContent = st;
      if (n.getBBox().width > SCR.w - 66) console.error(`Débordement : statut ${st}`);
    });

    // ----- Pastilles d'étape -----
    S.pills = PILLS.map(([, label]) => pillShape(D.svg, 92, FRAME.y + 44, label, { bg: C.blue, fg: C.white }));
    S.pills.forEach((p, i) => fit(p, BIN.x - 16, `pastille ${i + 1}`));

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- État à l'instant s de la séquence ----------
  const beltIndex = s => M.reduce((a, m) => a + easeInOut(prog(s, m, MOVE)), 0);

  // Position d'une carte : { x, y, sx, sy, rot, lifted, op }
  function cardState(i, s, B) {
    const pos = Math.min(3, B - i - 1);
    if (pos < -1.05) return null;
    const st = { x: GX[0] + pos * STEP, y: CARD_Y, sx: 1, sy: 1, rot: 0, lifted: false };
    if (pos < 3) {
      // Petit tangage vers l'avant quand le tapis s'arrête
      M.forEach(m => { const q = prog(s, m + MOVE - 0.06, 0.3); if (q > 0 && q < 1) st.rot += 2.4 * Math.sin(Math.PI * q) * (1 - q); });
      return st;
    }
    if (KEPT[i]) {
      const u = prog(s, T_A[i], LIFT), y1 = CASE_SLOT[LIFTS[i].slot];
      if (u > 0 && u < 1) {
        const q = u < 0.85 ? easeInOut(u / 0.85) : 1;
        st.y = lerp(CARD_Y, y1, q) + (u >= 0.85 ? -5 * Math.sin(Math.PI * (u - 0.85) / 0.15) : 0);
        st.sx = st.sy = 1 + 0.035 * Math.sin(Math.PI * Math.min(1, u / 0.85));
        st.lifted = true;
      } else if (u >= 1) st.y = y1;
    } else {
      const f = FALL[i], u = s - f.t0;
      if (u > 0 && u < f.dur) st.y = CARD_Y + 0.5 * G_FALL * u * u;
      else if (u >= f.dur) {
        st.y = f.y1;
        const q = prog(s, f.land, BOUNCE);
        if (q > 0 && q < 1) {
          if (q < 0.3) { const k = Math.sin(Math.PI * q / 0.3); st.sy = 1 - 0.08 * k; st.sx = 1 + 0.04 * k; }
          else st.y -= 10 * Math.sin(Math.PI * (q - 0.3) / 0.7);
        }
      }
      // Tassement de la carte du dessous quand la suivante tombe dessus
      FALL.forEach((g2, j) => {
        if (j <= i || !g2 || g2.slot !== f.slot + 1) return;
        const q = prog(s, g2.land, 0.24);
        if (q > 0 && q < 1) { const k = Math.sin(Math.PI * q); st.sy = 1 - 0.05 * k; st.sx = 1 + 0.025 * k; }
      });
    }
    return st;
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T0;
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    const s = final ? END : t;
    const B = beltIndex(s);
    const travel = B * STEP;

    // Tapis et rouleaux (7 pas × 216 px : la bande et les rouleaux bouclent exactement)
    S.beltDash.setAttribute('stroke-dashoffset', f2(-(travel % 24)));
    const ang = ((travel / 24) * 90) % 90;
    S.rollers.forEach(r => r.setAttribute('transform', ang ? `rotate(${f2(ang)})` : ''));

    // Lanières du tunnel : elles s'écartent au passage d'une carte
    const push = clamp(M.reduce((a, m, k) => (k < CARDS.length ? a + Math.sin(Math.PI * prog(s, m, MOVE)) : a), 0));
    S.strips.forEach(({ n, x }, k) => {
      const dx = 16 * push * (0.6 + 0.4 * (k / S.strips.length));
      n.setAttribute('d', `M ${x} ${TUNNEL.y + 14} Q ${f2(x + dx * 0.15)} ${TUNNEL.y + 70} ${f2(x + dx)} ${TUNNEL.y1 - 8}`);
    });

    // Cartes
    S.cards.forEach((c, i) => {
      const st = cardState(i, s, B);
      if (!st) { show(c.g, false); return; }
      show(c.g, true);
      c.g.setAttribute('opacity', f2(final ? fade : 1));
      let tf = `translate(${f2(st.x)} ${f2(st.y)})`;
      if (st.rot) tf += ` rotate(${f2(st.rot)} 0 ${CH})`;
      if (st.sx !== 1 || st.sy !== 1) tf += ` translate(0 ${CH}) scale(${st.sx.toFixed(3)} ${st.sy.toFixed(3)}) translate(0 ${-CH})`;
      c.g.setAttribute('transform', tf);
      if (st.lifted) c.g.setAttribute('filter', 'url(#lift)'); else c.g.removeAttribute('filter');
      // Étiquette : « Gaspillage » tamponnée au refus, coche verte après la troisième question
      const failed = s >= T_FAIL[i];
      show(c.tagN.tg, !failed);
      show(c.tagG.tg, failed);
      if (failed) {
        const p = prog(s, T_FAIL[i], 0.26);
        const k = 1 + 0.25 * (1 - easeOut(p));
        c.tagG.tg.setAttribute('transform', p >= 1 ? '' : `translate(${f2(c.tagG.cx)} 22) rotate(${f2(-7 * (1 - p))}) scale(${f2(k)}) translate(${f2(-c.tagG.cx)} -22)`);
      }
      const pc = prog(s, T_PASS[i], 0.35);
      show(c.check, pc > 0);
      const kc = popScale(pc), ccx = Number(c.check.firstChild.getAttribute('cx'));
      c.check.setAttribute('transform', kc === 1 ? '' : `translate(${ccx} 22) scale(${f2(kc)}) translate(${-ccx} -22)`);
      c.lamps.forEach((l, g) => {
        const sc = scanOf(g, i);
        l.setAttribute('fill', sc && s >= sc.tv ? (sc.ok ? C.green : C.red) : IDLE);
      });
    });
    // Contours fantômes : seulement dans la reconstruction, pour les places encore vides
    S.caseGhost.forEach((n, k) => { const i = KEPT.indexOf(true, k ? KEPT.indexOf(true) + 1 : 0); show(n, !final && s < T_A[i] + LIFT); });
    S.colGhost.forEach((n, k) => { const i = FALL.findIndex(f => f && f.slot === k); show(n, !final && s < FALL[i].land); });

    // Traces : elles apparaissent quand la dernière carte a quitté le portique
    S.traces.forEach(({ tg, t0 }) => {
      const p = final ? 1 : prog(s, t0, 0.35);
      show(tg, p > 0);
      tg.setAttribute('opacity', f2(p * (final ? fade : 1)));
    });

    // Aiguillage : les volets s'ouvrent pour laisser tomber les refusées
    let open = 0;
    FALL.forEach(f => { if (!f) return; const a = prog(s, f.t0 - 0.08, FLAP), b = prog(s, f.land + 0.05, 0.2); open = Math.max(open, easeOut(a) * (1 - easeInOut(b))); });
    S.flaps.forEach(({ g, hx, dir }) => g.setAttribute('transform', `translate(${hx} ${BELT_Y})` + (open ? ` rotate(${f2(dir * 86 * open)})` : '')));

    // Portiques : rayon, laser, voyants, écrans
    S.gates.forEach((gt, g) => {
      const list = SCANS.filter(sc => sc.g === g);
      let cur = null, prev = null;
      list.forEach(sc => { if (s >= sc.ts) { prev = cur; cur = sc; } });
      // Rayon et laser pendant le balayage
      const scanning = cur && !final && s < cur.tv + 0.08;
      show(gt.cone, !!scanning);
      show(gt.laser, !!scanning);
      if (scanning) {
        const u = clamp((s - cur.ts) / SWEEP);
        const yy = CARD_Y + 8 + (CH - 16) * (u < 0.5 ? easeInOut(u * 2) : easeInOut(2 - u * 2));
        gt.laser.setAttribute('transform', `translate(0 ${f2(yy)})`);
        gt.cone.setAttribute('opacity', f2(0.2 * clamp((s - cur.ts) / 0.08) * (1 - prog(s, cur.tv, 0.08))));
      }
      // État de l'écran
      let lamp = LAMP_OFF, status = 'En attente', sColor = SCREEN_MUTED, rs = null, rOp = 0, rDy = 0, halo = 0;
      if (cur && s >= cur.tv) {
        lamp = cur.ok ? C.green : C.red; status = cur.ok ? 'Passe' : 'Ne passe pas'; sColor = lamp;
        rs = cur; const p = final ? 1 : prog(s, cur.tv, 0.22); rOp = p; rDy = 8 * (1 - easeOut(p));
        const ph = final ? 1 : prog(s, cur.tv, 0.5); halo = ph >= 1 ? 1 : 0.4 + 0.6 * Math.abs(Math.sin(ph * Math.PI * 2));
      } else if (cur) {
        lamp = Math.floor((s - cur.ts) / 0.1) % 2 ? C.lightBlue : '#3d6f9e';
        status = 'Analyse' + '.'.repeat(1 + Math.floor((s - cur.ts) / 0.12) % 3); sColor = C.lightBlue;
        if (prev && s < cur.ts + 0.12) { rs = prev; rOp = 1 - prog(s, cur.ts, 0.12); }
      }
      const sOp = final ? fade : (cur ? 1 : prog(t, T0, 0.2));
      gt.lamp.setAttribute('fill', lamp);
      gt.headLamp.setAttribute('fill', final && fade < 1 ? LAMP_OFF : lamp);
      gt.lamp.setAttribute('opacity', f2(final ? 0.3 + 0.7 * fade : 1));
      gt.headLamp.setAttribute('opacity', f2(final ? 0.3 + 0.7 * fade : 1));
      show(gt.halo, halo > 0);
      if (halo > 0) { gt.halo.setAttribute('fill', lamp); gt.halo.setAttribute('opacity', f2(0.28 * halo * (final ? fade : 1))); }
      gt.status.textContent = status;
      gt.status.setAttribute('fill', sColor);
      gt.status.setAttribute('opacity', f2(sOp));
      show(gt.reason, !!rs && rOp > 0.001);
      gt.lines.forEach((n, k) => { n.textContent = rs && rs.reason[k] ? rs.reason[k] : ''; });
      if (rs) {
        gt.reason.setAttribute('opacity', f2(rOp * (final ? fade : 1)));
        gt.reason.setAttribute('transform', rDy > 0.01 ? `translate(0 ${f2(rDy)})` : '');
      }
      gt.tally.forEach((r, j) => {
        const sc = scanOf(g, j), on = sc && s >= sc.tv;
        r.setAttribute('fill', on ? (sc.ok ? C.green : C.red) : 'none');
        r.setAttribute('stroke', on ? (sc.ok ? C.green : C.red) : SCREEN_LINE);
        r.setAttribute('opacity', f2(on && final ? fade : 1));
      });
    });

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = PILLS[i][0] + (i ? 0.14 : 0.05);
      const last = i === PILLS.length - 1;
      let o = final ? (last ? fade : 0) : prog(t, a, 0.25) * (last ? 1 : 1 - prog(t, PILLS[i + 1][0], 0.14));
      const dy = final ? 0 : 8 * (1 - prog(t, a, 0.25));
      show(g, o > 0.001);
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy > 0.01 ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
