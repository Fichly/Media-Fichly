// Fiche LinkedIn · page Fichly · mardi 6 octobre 2026 (Buffer 6abd186c9d430e1223909485)
// Post : « Valeur ajoutée ou non-valeur ajoutée ? Sur le papier, la distinction paraît simple. »
// Exercice : classer 10 activités d'atelier en VA, NVA nécessaire, NVA. « Les réponses sont sur la fiche,
// avec la question qui permet de trancher à chaque fois. »
// Premier commentaire du post (Buffer) : nos fiches Lean → encart.
// Le visuel EST la fiche : trois colonnes, les 10 activités posées chacune dans la sienne, et sous chaque
// carte la question qui tranche. En bas à gauche, la carte « Pour trancher » (le fond du paquet).
// Style propre : le jeu de cartes distribué. Les cartes sont ramassées dans le paquet, puis distribuées
// une à une (arc, petite rotation, ombre portée en l'air, tassement à la pose). Deux cartes hésitent
// entre deux colonnes (le désaccord du post) avant de tomber. Image t = 0 = état final. Boucle de 12,5 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit, measure } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const fr = s => s.replace(/ ([?:!%»;])/g, NB + '$1').replace(/« /g, '«' + NB);
  // Invisible : display="none" ; sinon opacité
  const vis = (n, o) => {
    if (o <= 0.001) { n.setAttribute('display', 'none'); return; }
    n.removeAttribute('display');
    n.setAttribute('opacity', o >= 0.999 ? 1 : f2(o));
  };
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', NEUTRAL = '#d9d9ea', MAT_LINE = '#c4c4dc', SOFT = '#dcdcf3';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const COL_X = [78, 390, 702], COL_W = 300;
  const PANEL_Y = 484, PANEL_B = 1130, VA_B = 850;
  const SLOT_Y = [588, 724, 860, 996];
  const CW = 280, CH = 66;
  const MAT = { x: 78, y: 862, w: 300, h: 268 };
  const DECK = { x: 88 + CW / 2, y: 950 + CH / 2 };      // centre de la carte du dessus du paquet
  const JX = [0, 1.5, -1.2, 2, -1.6, 1, -2, 0.6, -0.8, 1.6];
  const JR = [0, -1.3, 1.1, -0.7, 1.5, -1.1, 0.9, -1.5, 0.7, -0.9];
  const PILL_Y = 448;

  // ---------- Contenu : les trois cases du post, les dix activités dans l'ordre du post ----------
  const COLS = [
    { label: 'VA', def: ['Le produit est transformé,', 'et le client paie pour ça.'], tint: C.pGreen, color: C.green, ink: C.tGreen, icon: 'check' },
    { label: 'NVA nécessaire', def: ['Non payée, mais on ne peut pas', 'la supprimer aujourd’hui.'], tint: C.pYellow, color: C.yellow, ink: C.tYellow, icon: 'warn' },
    { label: 'NVA', def: ['Ni payée, ni nécessaire.'], tint: C.pRed, color: C.red, ink: C.tRed, icon: 'cross' },
  ];
  // hes : la carte hésite entre deux colonnes (pair) au-dessus du point at, puis tombe dans col
  const CARDS = [
    { name: ['Usiner une pièce'], col: 0, q: 'La pièce est-elle transformée ?', a: 'Oui, et le client paie pour ça.' },
    { name: ['Changer de série'], col: 1, q: 'Peut-on produire sans régler ?', a: 'Non : on le réduit (SMED).' },
    { name: ['Déplacer une palette', 'vers le poste suivant'], col: 2, q: 'Le produit en a-t-il besoin ?', a: 'Non : c’est l’implantation.', hes: { pair: [1, 2], at: [696, 800] } },
    { name: ['Contrôler une pièce', 'en fin de ligne'], col: 1, q: 'Le procédé est-il fiable à 100 % ?', a: 'Pas encore : on le garde.' },
    { name: ['Retoucher une soudure'], col: 2, q: 'Le client paierait-il deux fois ?', a: 'Non : c’est un défaut corrigé.' },
    { name: ['Attendre la validation', 'du chef d’équipe'], col: 2, q: 'Un standard clair l’éviterait-il ?', a: 'Oui : c’est de l’attente.' },
    { name: ['Assembler deux', 'sous-ensembles'], col: 0, q: 'Le produit prend-il forme ?', a: 'Oui : le client achète l’ensemble.' },
    { name: ['Ressaisir un bon de', 'production dans l’ERP'], col: 2, q: 'L’info existe-t-elle déjà ?', a: 'Oui : on la saisit deux fois.' },
    { name: ['Nettoyer la machine', 'en fin de poste'], col: 1, q: 'Peut-on l’arrêter sans risque ?', a: 'Non : pannes, défauts, sécurité.' },
    { name: ['Emballer pour le client'], col: 1, q: 'Le produit est-il transformé ?', a: 'Non : il est seulement protégé.', hes: { pair: [0, 1], at: [384, 1074] } },
  ];
  const fill = [0, 0, 0];
  CARDS.forEach(c => { c.slot = fill[c.col]++; });
  const N = CARDS.length;

  // ---------- Chronologie (s) ----------
  const DURATION = 12.5;
  const T_OUT = 1.2;                                   // l'état final se défait
  const G0 = 1.3, G_STEP = 0.045, G_FL = 0.4;          // ramassage : la dernière carte part la première
  const T_DEAL = 2.2, STEP = 0.5, FL = 0.44;           // distribution
  const HOVER_IN = 0.42, SWAY = 1.05, DROP = 0.36, SWAY_A = 40;
  const SCHED = [];
  {
    let tt = T_DEAL;
    CARDS.forEach((c, i) => {
      const s = { lift: tt, gather: G0 + G_STEP * (N - 1 - i) };
      if (c.hes) { s.hover = tt + HOVER_IN; s.decide = s.hover + SWAY; s.land = s.decide + DROP; tt = s.land + 0.08; }
      else { s.land = tt + FL; tt += STEP; }
      SCHED.push(s);
    });
  }
  const HES = CARDS.map((c, i) => (c.hes ? i : -1)).filter(i => i >= 0);
  const T_LAST = SCHED[N - 1].land;
  const T_RULE = T_LAST + 0.15;                        // la carte « Pour trancher » réapparaît
  const T_FIN = T_LAST + 0.05;                         // pastille finale
  // Pastilles : [index, entrée, sortie]
  const PILL_WIN = [
    [1, 1.95, SCHED[HES[0]].hover],
    [2, SCHED[HES[0]].hover + 0.16, SCHED[HES[0]].decide],
    [1, SCHED[HES[0]].decide + 0.16, SCHED[HES[1]].hover],
    [3, SCHED[HES[1]].hover + 0.16, SCHED[HES[1]].decide],
  ];

  // ---------- Géométrie des cartes ----------
  const slotC = i => ({ x: COL_X[CARDS[i].col] + 10 + CW / 2, y: SLOT_Y[CARDS[i].slot] + CH / 2, r: 0 });
  const deckC = i => ({ x: DECK.x + JX[i], y: DECK.y + 3 * i, r: JR[i] });
  const bez = (a, b, s, h) => {
    const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - h;
    const u = 1 - s;
    return { x: u * u * a.x + 2 * u * s * mx + s * s * b.x, y: u * u * a.y + 2 * u * s * my + s * s * b.y };
  };
  const sgn = v => (v < 0 ? -1 : 1);
  // Vol d'une carte de a vers b (u : 0 → 1) ; altitude 0 aux deux bouts
  function fly(a, b, u, arc) {
    const s = easeInOut(u), dist = Math.hypot(b.x - a.x, b.y - a.y), dir = sgn(b.x - a.x);
    const p = bez(a, b, s, arc + 0.12 * dist);
    const alt = Math.sin(Math.PI * s);
    return { x: p.x, y: p.y, r: lerp(a.r, b.r, s) + dir * 9 * alt, k: 1 + 0.08 * alt, sy: 1, alt };
  }
  // Pose : tassement et petite oscillation qui s'amortit
  function settle(st, tau, dir) {
    if (tau < 0.16) { const q = Math.sin(Math.PI * tau / 0.16); st.sy = 1 - 0.07 * q; st.k = 1 + 0.025 * q; }
    if (tau < 0.32) st.r = -dir * 3 * Math.exp(-tau * 9) * Math.sin(tau * 2 * Math.PI / 0.2);
    return st;
  }

  // État de la carte i à l'instant t
  function cardState(i, t) {
    const c = CARDS[i], s = SCHED[i], S0 = slotC(i), DK = deckC(i);
    if (t < s.gather) return { ...S0, k: 1, sy: 1, alt: 0, z: 0, zk: i, stripe: 1, stripeO: 1 };
    if (t < s.gather + G_FL) {
      const u = prog(t, s.gather, G_FL);
      return { ...fly(S0, DK, u, 40), z: 2, zk: s.gather, stripe: 1, stripeO: 1 - u };
    }
    if (t < s.lift) return { ...DK, k: 1, sy: 1, alt: 0, z: 1, zk: -i, stripe: 0, stripeO: 0 };
    const done = (from, tau) => settle({ ...S0, k: 1, sy: 1, alt: 0, z: 0, zk: i, stripe: easeOut(prog(tau, 0.02, 0.2)), stripeO: 1 }, tau, sgn(S0.x - from.x));
    if (!c.hes) {
      if (t < s.land) return { ...fly(DK, S0, prog(t, s.lift, FL), 50), z: 2, zk: s.lift, stripe: 0, stripeO: 0 };
      return done(DK, t - s.land);
    }
    // Hésitation : monte jusqu'au-dessus de la frontière, balance d'une colonne à l'autre, puis tombe
    const H = { x: c.hes.at[0], y: c.hes.at[1], r: 0 };
    const air = { z: 2, zk: s.lift, stripe: 0, stripeO: 0, hes: true };
    if (t < s.hover) {
      const u = prog(t, s.lift, HOVER_IN), q = easeInOut(u), dir = sgn(H.x - DK.x);
      const p = bez(DK, H, q, 40 + 0.1 * Math.hypot(H.x - DK.x, H.y - DK.y));
      const alt = Math.sin(Math.PI / 2 * q);
      return { x: p.x, y: p.y, r: lerp(DK.r, 0, q) + dir * 7 * Math.sin(Math.PI * q), k: 1 + 0.08 * alt, sy: 1, alt, ...air, hesO: q };
    }
    if (t < s.decide) {
      const tau = t - s.hover, off = -SWAY_A * Math.sin(3 * Math.PI * tau / SWAY);
      return { x: H.x + off, y: H.y - 6 * Math.sin(Math.PI * tau / SWAY), r: 6 * off / SWAY_A, k: 1.08, sy: 1, alt: 1, ...air, off, hesO: 1 };
    }
    if (t < s.land) {
      const u = prog(t, s.decide, DROP), q = easeInOut(u), dir = sgn(S0.x - H.x);
      const p = bez(H, S0, q, 24);
      const alt = Math.cos(Math.PI / 2 * q);
      return { x: p.x, y: p.y, r: dir * 6 * Math.sin(Math.PI * q), k: 1 + 0.08 * alt, sy: 1, alt, ...air, hesO: 1 - prog(u, 0.6, 0.4) };
    }
    return done(H, t - s.land);
  }

  // ---------- Petits éléments ----------
  function icon(parent, kind, cx, cy, k = 1) {
    const g = el('g', { transform: `translate(${cx} ${cy})` }, parent);
    const inner = el('g', k === 1 ? {} : { transform: `scale(${k})` }, g);
    if (kind === 'check') {
      el('circle', { cx: 0, cy: 0, r: 14, fill: C.green }, inner);
      el('path', { d: 'M -6.5 0.5 L -2 5 L 7 -4.5', fill: 'none', stroke: C.white, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inner);
    } else if (kind === 'warn') {
      el('path', { d: 'M 0 -12.5 L 13.5 10 L -13.5 10 Z', fill: C.yellow, stroke: C.yellow, 'stroke-width': 5, 'stroke-linejoin': 'round' }, inner);
      el('rect', { x: -1.9, y: -5.5, width: 3.8, height: 9, rx: 1.9, fill: C.white }, inner);
      el('circle', { cx: 0, cy: 6.8, r: 2.2, fill: C.white }, inner);
    } else {
      el('circle', { cx: 0, cy: 0, r: 14, fill: C.red }, inner);
      el('path', { d: 'M -5 -5 L 5 5 M 5 -5 L -5 5', fill: 'none', stroke: C.white, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, inner);
    }
    return inner;
  }
  function pillShape(parent, x, cy, label, { bg, fg, check = false, size = 20, h = 40 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const iw = check ? 30 : 0;
    const tx = text(g, x + 20 + iw, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', measure(tx).width + 40 + iw);
    if (check) {
      el('circle', { cx: x + 31, cy, r: 12, fill: C.green }, g);
      el('path', { d: `M ${x + 25.5} ${cy + 0.5} L ${x + 29.5} ${cy + 4.5} L ${x + 36.5} ${cy - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return g;
  }
  function chip(parent, edge, cy, label, col, side) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: cy - 16, height: 32, rx: 16, fill: C.white, stroke: col.color, 'stroke-width': 2.5 }, g);
    const tx = text(g, 0, cy + 6, label, { size: 17, weight: 800, fill: col.ink, anchor: 'middle' });
    const w = measure(tx).width + 30;
    const x0 = side < 0 ? edge - w : edge;
    r.setAttribute('x', f2(x0));
    r.setAttribute('width', f2(w));
    tx.setAttribute('x', f2(x0 + w / 2));
    return { g, cx: x0 + w / 2, cy };
  }

  const S = { cards: [], qs: [], chips: [], heads: [], panels: [] };

  function build() {
    D.template({ author: null });
    D.title(fr('Valeur ajoutée ou pas ?'), 'Le corrigé.', 1020);
    D.chapeau('Sur le papier, la distinction paraît simple.');

    // Explication courte au-dessus du visuel : comment le lire
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, bold]) => { const sp = el('tspan', bold ? { 'font-weight': 700, fill: C.blue } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Les ', 0], ['10 activités', 1], [' de l’exercice, chacune posée dans ', 0], ['sa colonne', 1], ['.', 0]]);
    line(384, [[fr('Sous chaque carte : '), 0], ['la question qui permet de trancher', 1], ['.', 0]]);

    const defs = el('defs');
    const soft = el('filter', { id: 'soft', x: '-25%', y: '-60%', width: '150%', height: '240%' }, defs);
    el('feGaussianBlur', { stdDeviation: 7 }, soft);

    // ----- Cadre, colonnes -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    COLS.forEach((col, c) => {
      const x = COL_X[c];
      S.panels.push(el('rect', { x, y: PANEL_Y, width: COL_W, height: (c === 0 ? VA_B : PANEL_B) - PANEL_Y, rx: 20, fill: col.tint }));
      S.heads.push(icon(D.svg, col.icon, x + 34, PANEL_Y + 32));
      fit(text(D.svg, x + 58, PANEL_Y + 40, col.label, { size: 22, weight: 800, fill: col.ink }), x + COL_W - 14, `colonne ${c + 1} titre`);
      col.def.forEach((d, k) => fit(text(D.svg, x + 18, PANEL_Y + 66 + 21 * k, fr(d), { size: 16, weight: 500, fill: C.ink }), x + COL_W - 12, `colonne ${c + 1} définition ${k + 1}`, x + 12));
    });

    // ----- Le tapis du paquet, et la carte « Pour trancher » (le fond du paquet) -----
    S.mat = el('g');
    el('rect', { x: MAT.x + 1.5, y: MAT.y + 1.5, width: MAT.w - 3, height: MAT.h - 3, rx: 20, fill: C.white, 'fill-opacity': 0.5, stroke: MAT_LINE, 'stroke-width': 2.5, 'stroke-dasharray': '9 7' }, S.mat);
    S.matLabel = text(D.svg, MAT.x + MAT.w / 2, MAT.y + MAT.h - 34, 'Le paquet', { size: 17, weight: 700, fill: MUTED, anchor: 'middle' });

    S.rule = el('g');
    el('rect', { x: MAT.x, y: MAT.y, width: MAT.w, height: MAT.h, rx: 20, fill: C.blue }, S.rule);
    const RX = MAT.x + 20, RMAX = MAT.x + MAT.w - 16;
    const rl = [];
    const rt = (y, str, opts, x = RX) => { const n = text(S.rule, x, y, fr(str), opts); fit(n, RMAX, `règle ${str}`, MAT.x + 12); rl.push(n); return n; };
    rt(MAT.y + 40, 'Pour trancher', { size: 20, weight: 800, fill: C.white });
    rt(MAT.y + 72, 'Le produit est-il transformé,', { size: 16, weight: 500, fill: SOFT });
    rt(MAT.y + 94, 'et le client le paie-t-il ?', { size: 16, weight: 500, fill: SOFT });
    const ans = (y, kind, str) => { const g = el('g', {}, S.rule); icon(g, kind, RX + 9, y - 6, 0.68); const n = text(g, RX + 28, y, fr(str), { size: 17, weight: 700, fill: C.white }); fit(n, RMAX, `règle ${str}`); rl.push(g); };
    ans(MAT.y + 122, 'check', 'Oui : VA');
    const sep = el('line', { x1: RX, y1: MAT.y + 140, x2: RMAX - 4, y2: MAT.y + 140, stroke: C.white, 'stroke-opacity': 0.25, 'stroke-width': 2 }, S.rule);
    rl.push(sep);
    rt(MAT.y + 168, 'Sinon, peut-on la supprimer', { size: 16, weight: 500, fill: SOFT });
    rt(MAT.y + 190, 'aujourd’hui ?', { size: 16, weight: 500, fill: SOFT });
    ans(MAT.y + 218, 'warn', 'Non : NVA nécessaire');
    ans(MAT.y + 246, 'cross', 'Oui : NVA');
    S.ruleLines = rl;

    // ----- Questions (sous les cartes) -----
    const qLayer = el('g');
    CARDS.forEach((c, i) => {
      const x = COL_X[c.col] + 18, top = SLOT_Y[c.slot] + CH;
      const cp = el('clipPath', { id: `q${i}` }, defs);
      const r1 = el('rect', { x: x - 6, y: top + 6, height: 24, width: 0 }, cp);
      const r2 = el('rect', { x: x - 6, y: top + 30, height: 24, width: 0 }, cp);
      const g = el('g', { 'clip-path': `url(#q${i})` }, qLayer);
      const qn = text(g, x, top + 24, fr(c.q), { size: 16, weight: 500, fill: C.ink });
      const an = text(g, x, top + 46, fr(c.a), { size: 16, weight: 700, fill: COLS[c.col].ink });
      const xm = COL_X[c.col] + COL_W - 10;
      fit(qn, xm, `question ${i + 1}`, x - 1);
      fit(an, xm, `réponse ${i + 1}`, x - 1);
      S.qs.push({ g, r1, r2, w1: measure(qn).width + 14, w2: measure(an).width + 14 });
    });

    // ----- Désaccord : deux étiquettes au-dessus de la carte qui hésite (sous les cartes) -----
    const chipLayer = el('g');

    // ----- Les cartes -----
    S.layer = el('g');
    CARDS.forEach((c, i) => {
      const g = el('g', {}, S.layer);
      const shadow = el('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 12, fill: C.ink, filter: 'url(#soft)' }, g);
      const body = el('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 12, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, g);
      el('rect', { x: -CW / 2 + 10, y: -CH / 2 + 12, width: 6, height: CH - 24, rx: 3, fill: NEUTRAL }, g);
      const stripe = el('rect', { x: -CW / 2 + 10, y: -CH / 2 + 12, width: 6, height: CH - 24, rx: 3, fill: COLS[c.col].color }, g);
      const two = c.name.length === 2;
      c.name.forEach((s, k) => {
        const n = text(g, -CW / 2 + 28, two ? -5 + 23 * k : 6.5, fr(s), { size: 18, weight: 700, fill: C.ink });
        fit(n, CW / 2 - 12, `carte ${i + 1} ligne ${k + 1}`, -CW / 2 + 20);
      });
      S.cards.push({ g, shadow, body, stripe });
    });

    HES.forEach(i => {
      const { pair, at } = CARDS[i].hes;
      const cy = at[1] - CH / 2 - 38;
      S.chips.push({
        i,
        L: chip(chipLayer, at[0] - 6, cy, `${COLS[pair[0]].label}${NB}?`, COLS[pair[0]], -1),
        R: chip(chipLayer, at[0] + 6, cy, `${COLS[pair[1]].label}${NB}?`, COLS[pair[1]], 1),
        win: pair.indexOf(CARDS[i].col),
      });
    });

    // ----- Pastilles d'étape -----
    const px = 92;
    S.pFinal = pillShape(D.svg, px, PILL_Y, '10 activités classées', { bg: C.pGreen, fg: C.tGreen, check: true });
    // Compteur : « Carte n / 10 », le numéro roule
    S.pCount = el('g');
    const cr = el('rect', { x: px, y: PILL_Y - 20, height: 40, rx: 20, fill: C.blue }, S.pCount);
    const tc = text(S.pCount, px + 20, PILL_Y + 7.2, 'Carte', { size: 20, weight: 700, fill: C.white });
    const nx = px + 20 + measure(tc).width + 7;
    const cpN = el('clipPath', { id: 'num' }, defs);
    el('rect', { x: nx - 3, y: PILL_Y - 15, width: 40, height: 30 }, cpN);
    const ng = el('g', { 'clip-path': 'url(#num)' }, S.pCount);
    S.nA = text(ng, nx, PILL_Y + 7.2, '1', { size: 20, weight: 800, fill: C.white });
    S.nB = text(ng, nx, PILL_Y + 7.2, '2', { size: 20, weight: 800, fill: C.white });
    S.nOf = text(S.pCount, nx + 20, PILL_Y + 7.2, `/${NB}10`, { size: 20, weight: 700, fill: SOFT });
    S.nRect = cr;
    S.nX = nx;
    S.nOfW = measure(S.nOf).width;
    // Largeur des numéros 1 à 10 (le « / 10 » suit le numéro qui roule)
    S.nW = [];
    for (let k = 1; k <= N; k++) { S.nA.textContent = String(k); S.nW[k] = measure(S.nA).width; }
    S.pHes = HES.map(i => {
      const [a, b] = CARDS[i].hes.pair;
      const p = pillShape(D.svg, px, PILL_Y, fr(`Désaccord : ${COLS[a].label} ou ${COLS[b].label} ?`), { bg: C.pYellow, fg: C.tYellow });
      fit(p, FRAME.x + FRAME.w - 20, `pastille désaccord ${i + 1}`);
      return p;
    });
    S.pillList = [S.pFinal, S.pCount, ...S.pHes];

    D.encart(['Aller plus loin', 'Nos fiches Lean', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    // Cartes : état, puis ordre d'empilement (posées, paquet, en l'air)
    const states = CARDS.map((_, i) => cardState(i, t));
    states.forEach((st, i) => {
      const c = S.cards[i];
      const sc = st.k === 1 && st.sy === 1 ? '' : ` scale(${st.k.toFixed(3)} ${(st.k * st.sy).toFixed(3)})`;
      c.g.setAttribute('transform', `translate(${f2(st.x)} ${f2(st.y)})` + (Math.abs(st.r) > 0.005 ? ` rotate(${f2(st.r)})` : '') + sc);
      c.shadow.setAttribute('x', f2(-CW / 2 + 2 + 8 * st.alt));
      c.shadow.setAttribute('y', f2(-CH / 2 + 4 + 18 * st.alt));
      c.shadow.setAttribute('opacity', f2(0.07 + 0.2 * st.alt));
      vis(c.stripe, st.stripeO);
      if (st.stripe < 1) c.stripe.setAttribute('transform', `scale(1 ${Math.max(0.001, st.stripe).toFixed(3)})`); else c.stripe.removeAttribute('transform');
      const hb = st.hes ? st.hesO : 0;
      c.body.setAttribute('stroke', hb > 0.5 ? C.yellow : CARD_LINE);
      c.body.setAttribute('stroke-width', hb > 0.5 ? 3 : 2);
    });
    states.map((st, i) => [st.z, st.zk, i]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
      .forEach(([, , i]) => S.layer.appendChild(S.cards[i].g));

    // Questions : s'effacent au ramassage, s'écrivent sous la carte une fois posée
    S.qs.forEach((q, i) => {
      const s = SCHED[i];
      let w1, w2, o = 1;
      if (t < s.gather) { w1 = q.w1; w2 = q.w2; o = 1 - prog(t, T_OUT, 0.12); }
      else { w1 = q.w1 * easeInOut(prog(t, s.land + 0.06, 0.32)); w2 = q.w2 * easeInOut(prog(t, s.land + 0.3, 0.28)); }
      q.r1.setAttribute('width', f2(w1));
      q.r2.setAttribute('width', f2(w2));
      vis(q.g, w1 > 0.5 ? o : 0);
    });

    // Colonnes : l'icône d'en-tête bat quand une carte s'y pose ; contour pendant un désaccord
    COLS.forEach((col, c) => {
      let k = 1;
      CARDS.forEach((cd, i) => { if (cd.col === c) { const p = prog(t, SCHED[i].land, 0.34); if (p > 0 && p < 1) k = Math.max(k, 1 + 0.25 * Math.sin(Math.PI * p)); } });
      if (k > 1) S.heads[c].setAttribute('transform', `scale(${k.toFixed(3)})`); else S.heads[c].removeAttribute('transform');
      let glow = 0;
      HES.forEach(i => {
        const s = SCHED[i];
        if (CARDS[i].hes.pair.includes(c) && t >= s.hover && t < s.land + 0.2) {
          const o = prog(t, s.hover, 0.2) * (1 - prog(t, s.land, 0.2));
          glow = Math.max(glow, o * (0.6 + 0.4 * Math.sin(2 * Math.PI * (t - s.hover) / 0.5)));
        }
      });
      const p = S.panels[c];
      if (glow > 0.01) { p.setAttribute('stroke', col.color); p.setAttribute('stroke-width', f2(1.5 + 2.5 * glow)); }
      else { p.removeAttribute('stroke'); p.removeAttribute('stroke-width'); }
    });

    // Étiquettes du désaccord
    S.chips.forEach(ch => {
      const s = SCHED[ch.i], st = states[ch.i];
      [ch.L, ch.R].forEach((cp, side) => {
        const pin = prog(t, s.hover - 0.05 + 0.1 * side, 0.3);
        if (t < s.hover - 0.05 || t > s.decide + 0.3) { vis(cp.g, 0); return; }
        let e = 0;
        if (t < s.decide) e = clamp((side ? 1 : -1) * (st.off || 0) / SWAY_A);
        else e = side === ch.win ? 1 : 0;
        // Décision : la perdante s'efface aussitôt, la gagnante un instant après (avant que la carte n'arrive)
        const out = side === ch.win ? 1 - prog(t, s.decide + 0.06, 0.14) : 1 - prog(t, s.decide, 0.12);
        const k = popScale(pin) * (1 + 0.08 * e);
        cp.g.setAttribute('transform', `translate(${f2(cp.cx)} ${f2(cp.cy)}) scale(${k.toFixed(3)}) translate(${f2(-cp.cx)} ${f2(-cp.cy)})`);
        vis(cp.g, clamp(pin / 0.4) * (0.5 + 0.5 * e) * out);
      });
    });

    // Tapis, étiquette du paquet, carte « Pour trancher »
    const ruleOut = 1 - prog(t, T_OUT, 0.16);
    const pr = prog(t, T_RULE, 0.42);
    const ruleO = t < T_RULE ? ruleOut : clamp(pr / 0.35);
    const kr = t < T_RULE ? 1 - 0.03 * prog(t, T_OUT, 0.16) : popScale(pr);
    const rcx = MAT.x + MAT.w / 2, rcy = MAT.y + MAT.h / 2;
    S.rule.setAttribute('transform', kr === 1 ? '' : `translate(${rcx} ${rcy}) scale(${kr.toFixed(3)}) translate(${-rcx} ${-rcy})`);
    vis(S.rule, ruleO);
    S.ruleLines.forEach((n, k) => vis(n, t < T_RULE ? 1 : prog(t, T_RULE + 0.18 + 0.06 * k, 0.22)));
    vis(S.mat, t < T_RULE ? prog(t, T_OUT + 0.05, 0.25) : 1 - prog(t, T_RULE + 0.1, 0.2));
    vis(S.matLabel, prog(t, T_OUT + 0.2, 0.25) * (1 - prog(t, SCHED[N - 1].lift + 0.1, 0.2)));

    // Compteur de la pastille : nombre de cartes déjà parties du paquet
    let n = 1, tl = -1;
    SCHED.forEach((s, i) => { if (t >= s.lift && i > 0) { n = i + 1; tl = s.lift; } });
    const roll = tl < 0 ? 1 : easeOut(prog(t, tl, 0.22));
    S.nB.textContent = String(n);
    S.nA.textContent = String(Math.max(1, n - 1));
    S.nB.setAttribute('transform', roll >= 1 ? '' : `translate(0 ${f2(24 * (1 - roll))})`);
    vis(S.nB, roll < 1 ? roll : 1);
    S.nA.setAttribute('transform', `translate(0 ${f2(-24 * roll)})`);
    vis(S.nA, roll < 1 ? 1 - roll : 0);
    const nw = lerp(S.nW[Math.max(1, n - 1)], S.nW[n], roll);
    S.nOf.setAttribute('x', f2(S.nX + nw + 7));
    S.nRect.setAttribute('width', f2(S.nX + nw + 7 + S.nOfW + 20 - 92));

    // Pastilles d'étape : l'ancienne sort (0,14 s) avant que la nouvelle entre
    const op = S.pillList.map(() => ({ o: 0, dy: 0 }));
    op[0].o = t < T_FIN ? 1 - prog(t, T_OUT, 0.14) : prog(t, T_FIN, 0.25);
    op[0].dy = t < T_FIN ? 0 : 8 * (1 - easeOut(prog(t, T_FIN, 0.25)));
    PILL_WIN.forEach(([k, a, b]) => {
      const o = prog(t, a, 0.22) * (1 - prog(t, b, 0.14));
      if (o > op[k].o) { op[k].o = o; op[k].dy = 8 * (1 - easeOut(prog(t, a, 0.22))); }
    });
    S.pillList.forEach((g, k) => {
      vis(g, op[k].o);
      if (op[k].dy > 0.01) g.setAttribute('transform', `translate(0 ${f2(op[k].dy)})`); else g.removeAttribute('transform');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
