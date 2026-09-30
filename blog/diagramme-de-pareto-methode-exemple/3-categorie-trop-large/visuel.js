// Blog · Diagramme de Pareto · section « La qualité du relevé décide de la qualité du classement »
// Mécanique : un relevé mélange une catégorie large (« défaut qualité ») et des causes précises ; la large arrive en
// tête. On l'ouvre : elle contient quatre sujets. Ramenées au même niveau de détail, ses parts se rangent parmi les
// autres barres et la vis de réglage desserrée passe en tête. Le graphique de gauche avait l'air aussi propre.
// Hypothèse : relevé entièrement illustratif (catégories et valeurs), seul l'exemple « défaut qualité » /
// « vis de réglage desserrée » vient de l'article.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const LIGHT = '#f5a3a3';
  const LEFT = [
    { name: 'Défaut qualité', v: 60, wide: true },
    { name: 'Vis de réglage desserrée', v: 34, id: 'vis' },
    { name: 'Capteur encrassé', v: 22, id: 'cap' },
    { name: 'Courroie usée', v: 14, id: 'cou' },
  ];
  const SUBS = [
    { name: 'Étiquette décalée', v: 20, id: 'eti' },
    { name: 'Film mal soudé', v: 16, id: 'fil' },
    { name: 'Date illisible', v: 14, id: 'dat' },
    { name: 'Étui écrasé', v: 10, id: 'etu' },
  ];
  const RIGHT = ['vis', 'cap', 'eti', 'fil', 'dat', 'cou', 'etu'];
  const ALL = {};
  LEFT.forEach(c => { if (c.id) ALL[c.id] = { ...c, sub: false }; });
  SUBS.forEach(c => { ALL[c.id] = { ...c, sub: true }; });
  const BASE = 556, K = 4.2;
  const L = { x0: 60, slot: 96, bw: 62 };
  const R = { x0: 506, slot: 90, bw: 58 };
  const lx = j => L.x0 + L.slot * (j + 0.5);
  const rx = j => R.x0 + R.slot * (j + 0.5);
  const T = { left: 1.8, bars: 2.1, lead: 2.9, open: 3.7, list: 4.1, fly: 5.4, right: 5.1, lead2: 7.3, note: 8.3, chute: 9.3 };
  const FLY_T = j => T.fly + 0.12 * j;
  const S = {};

  function label(parent, x, str, w) {
    const p = G.para(parent, x, BASE + 22, str, w, { size: 15, weight: 500, fill: C.ink, anchor: 'middle', lh: 1.2 });
    if (p.n > 3) console.error(`Étiquette sur ${p.n} lignes : ${str}`);
    return p;
  }
  function rankPill(parent, x, y) {
    const g = el('g', {}, parent);
    G.pill(g, x, y, '1re', { size: 15, h: 26, pad: 10, bg: C.ink, fg: C.white, anchor: 'middle' });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Trop large,', 'toujours en tête.');
    G.blogChapeau('« Défaut qualité » contient plusieurs sujets : il passe devant, sans rien prouver.');
    G.card(40, 176, 1120, 584);

    // Panneaux
    el('rect', { x: 52, y: 192, width: 410, height: 480, rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 2 });
    el('rect', { x: 480, y: 192, width: 668, height: 480, rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 2 });
    S.headL = el('g');
    G.pill(S.headL, 257, 222, 'Niveaux de détail mélangés', { size: 18, h: 34, bg: C.pRed, fg: C.tRed, anchor: 'middle' });
    el('line', { x1: 70, y1: BASE, x2: 444, y2: BASE, stroke: C.ink, 'stroke-width': 2.5 }, S.headL);
    S.headR = el('g');
    G.pill(S.headR, 814, 222, 'Un seul niveau de détail', { size: 18, h: 34, bg: C.pGreen, fg: C.tGreen, anchor: 'middle' });
    el('line', { x1: 498, y1: BASE, x2: 1130, y2: BASE, stroke: C.ink, 'stroke-width': 2.5 }, S.headR);

    // Graphique de gauche
    S.left = LEFT.map((c, j) => {
      const g = el('g');
      const h = c.v * K, x = lx(j);
      const bar = el('g', {}, g);
      el('rect', { x: x - L.bw / 2, y: BASE - h, width: L.bw, height: h, rx: 5, fill: c.wide ? C.red : C.blue }, bar);
      text(g, x, BASE - h - 8, String(c.v), { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      label(g, x, c.name, L.slot - 6);
      return { ...c, g, bar, x, h };
    });
    // Séparations dans la barre large et liste de ses sujets
    const wide = S.left[0];
    S.open = el('g');
    let acc = 0;
    S.segs = SUBS.map((s, i) => {
      const y1 = BASE - acc * K, y0 = BASE - (acc + s.v) * K;
      acc += s.v;
      if (i < SUBS.length - 1) el('line', { x1: wide.x - L.bw / 2, y1: y0, x2: wide.x + L.bw / 2, y2: y0, stroke: C.white, 'stroke-width': 3 }, S.open);
      return { ...s, yTop: y0, yBot: y1 };
    });
    S.list = el('g');
    text(S.list, 170, 272, 'contient quatre sujets :', { size: 16, weight: 700, fill: C.tRed });
    SUBS.forEach((s, i) => {
      const y = 298 + 25 * i;
      el('rect', { x: 170, y: y - 12, width: 14, height: 14, rx: 3, fill: LIGHT, stroke: C.red, 'stroke-width': 1.5 }, S.list);
      text(S.list, 192, y, `${s.name} (${s.v})`, { size: 15, weight: 500, fill: C.ink });
    });
    el('path', { d: `M 164 286 Q 146 290 ${wide.x + L.bw / 2 + 4} 318`, fill: 'none', stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '4 4' }, S.list);
    S.leadL = rankPill(G.svg, wide.x, BASE - wide.h - 40);

    // Graphique de droite : barres qui arrivent de la gauche
    S.right = RIGHT.map((id, j) => {
      const c = ALL[id];
      const g = el('g');
      const h = c.v * K, x = rx(j);
      const rect = el('rect', { x: -R.bw / 2, y: -h, width: R.bw, height: h, rx: 5, fill: c.sub ? LIGHT : C.blue, stroke: c.sub ? C.red : 'none', 'stroke-width': 1.5 }, g);
      const val = text(g, 0, -h - 8, String(c.v), { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      const lab = el('g');
      label(lab, x, c.name, R.slot - 6);
      // Origine : sa barre à gauche, ou son tronçon dans la barre large
      let from;
      if (c.sub) { const sg = S.segs.find(s => s.id === id); from = { x: wide.x, y: sg.yBot, sx: L.bw / R.bw }; }
      else { const lj = LEFT.findIndex(l => l.id === id); from = { x: lx(lj), y: BASE, sx: L.bw / R.bw }; }
      return { id, g, rect, val, lab, x, h, from, j };
    });
    S.leadR = rankPill(G.svg, rx(0), BASE - 34 * K - 40);

    S.note = text(G.svg, 60, 712, 'Une catégorie n’est pas grosse parce qu’elle pèse lourd, mais parce qu’elle contient plusieurs sujets.', { size: 17, weight: 500, fill: C.ink });
    fit(S.note, 1150, 'note');
    S.chute = G.blogChute('Une catégorie large arrive toujours en tête.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    pop(S.headL, t, T.left, 257, 390);
    S.left.forEach((c, j) => {
      const g0 = live ? easeOut(prog(t, T.bars + 0.1 * j, 0.45)) : 1;
      c.g.setAttribute('opacity', live ? (g0 > 0 ? clamp(g0 * 3) : 0) : o);
      c.bar.setAttribute('transform', g0 === 1 ? '' : `translate(0 ${BASE}) scale(1 ${Math.max(0.001, g0)}) translate(0 ${-BASE})`);
    });
    pop(S.leadL, t, T.lead, S.left[0].x, BASE - S.left[0].h - 40);
    S.open.setAttribute('opacity', live ? clamp(prog(t, T.open, 0.3)) : o);
    rise(S.list, t, T.list, 0.4);

    pop(S.headR, t, T.right, 814, 390);
    S.right.forEach(b => {
      let x = b.x, y = BASE, sx = 1, op = o, lift = 0;
      if (live) {
        const p = prog(t, FLY_T(b.j), 0.8);
        if (p <= 0) op = 0;
        else {
          const e = easeInOut(p);
          x = b.from.x + (b.x - b.from.x) * e;
          y = b.from.y + (BASE - b.from.y) * e;
          sx = b.from.sx + (1 - b.from.sx) * e;
          lift = 60 * Math.sin(Math.PI * p);
          op = 1;
        }
      }
      b.g.setAttribute('transform', `translate(${x} ${y - lift}) scale(${sx} 1)`);
      b.g.setAttribute('opacity', op);
      b.lab.setAttribute('opacity', live ? clamp(prog(t, FLY_T(b.j) + 0.7, 0.3)) : o);
    });
    pop(S.leadR, t, T.lead2, rx(0), BASE - 34 * K - 40);
    rise(S.note, t, T.note, 0.4);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
