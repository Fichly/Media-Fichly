// Blog · TRS, TRG, TRE · section « Alors, lequel piloter ? »
// Mécanique : la journée de 24 h de la ligne de référence, découpée en zones (nuit, arrêts planifiés, pertes machine,
// temps utile). Un projecteur se pose tour à tour sur l'endroit où se perd le temps : dans la machine, entre les
// productions, dans les heures qui dorment. Chaque zone n'entre que dans un dénominateur de plus : elle désigne
// le taux qui la voit (TRS, TRG, TRE) et le service qui doit s'en saisir.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const X0 = 70, PXH = 1060 / 24, BY = 300, BH = 54;
  const xh = h => X0 + h * PXH;
  const ZONES = [
    { a: 0, b: 8, fill: '#c9c9dc', l1: 'Nuit, atelier fermé', l2: `8${NB}h`, fg: C.ink },
    { a: 8, b: 10, fill: C.lightBlue, l1: 'Planifiés', l2: `2${NB}h`, fg: C.blue, dx: -8 },
    { a: 10, b: 10 + 19 / 6, fill: C.red, l1: 'Pertes machine', l2: `3${NB}h${NB}10`, fg: C.tRed, dx: 22 },
    { a: 10 + 19 / 6, b: 24, fill: C.green, l1: 'Temps utile', l2: `10${NB}h${NB}50`, fg: C.tGreen },
  ];
  const RATES = [
    { k: 'TRS', a: 10, y: 276, col: C.blue, zone: 2, pill: 'Pilotez le TRS', where: 'Pertes dans la machine',
      sym: 'Pannes fréquentes, micro-arrêts non tracés, rebuts en série.', owner: 'Responsable de production et équipes de la ligne' },
    { k: 'TRG', a: 8, y: 248, col: '#2f7d80', zone: 1, pill: 'Pilotez le TRG', where: 'Pertes entre les productions',
      sym: 'Le TRS est correct, mais la production ne suit pas.', owner: 'Ordonnancement, supply chain, management de site' },
    { k: 'TRE', a: 0, y: 220, col: '#7b4784', zone: 0, pill: 'Regardez le TRE', where: 'Heures qui dorment',
      sym: `Faut-il investir ? Combien d’heures dorment déjà ?`, owner: 'Direction industrielle et contrôle de gestion' },
  ];

  function build() {
    G.templateBlog();
    G.blogTitle('Un indicateur,', 'un propriétaire.', { size: 48 });
    G.blogChapeau('Où se perd le temps ? La réponse désigne le taux à piloter, et qui s’en saisit.');

    // ----- Carte 1 : la journée de 24 h -----
    G.card(40, 176, 1120, 262);
    const clip = G.clipRect(X0, BY, 0, BH);
    S.reveal = clip.rect;
    S.bar = el('g', { 'clip-path': clip.url });
    ZONES.forEach(z => el('rect', { x: xh(z.a), y: BY, width: (z.b - z.a) * PXH, height: BH, fill: z.fill }, S.bar));
    el('rect', { x: X0, y: BY, width: 1060, height: BH, rx: 10, fill: 'none', stroke: C.card, 'stroke-width': 6 }, S.bar);
    S.zl = el('g');
    ZONES.forEach((z, i) => {
      const cx = xh((z.a + z.b) / 2) + (z.dx || 0);
      const a = text(S.zl, cx, BY + BH + 26, z.l1, { size: 18, weight: 700, fill: z.fg, anchor: 'middle' });
      text(S.zl, cx, BY + BH + 48, z.l2, { size: 18, weight: 500, fill: z.fg, anchor: 'middle' });
    });

    // Dénominateurs emboîtés : TRE (24 h), TRG (16 h), TRS (14 h), même bord droit
    S.br = RATES.map(R => {
      const g = el('g');
      const x0 = xh(R.a), x1 = xh(24);
      const path = el('path', { d: `M ${x0} ${R.y + 8} L ${x0} ${R.y} L ${x1} ${R.y} L ${x1} ${R.y + 8}`, fill: 'none', stroke: R.col, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      text(g, x0 + 6, R.y - 6, `${R.k} : tu / ${Math.round(24 - R.a)}${NB}h`, { size: 17, weight: 700, fill: R.col });
      return { g, path, cx: (x0 + x1) / 2 };
    });

    // Projecteur
    S.spot = el('rect', { y: BY - 7, height: BH + 14, rx: 12, fill: 'none', stroke: C.ink, 'stroke-width': 4.5 });

    // ----- Trois colonnes : où se perd le temps, symptôme, propriétaire -----
    S.cols = RATES.map((R, i) => {
      const x = 40 + i * 380, cx = x + 180;
      G.card(x, 454, 360, 306);
      const g = el('g');
      G.pill(g, x + 24, 490, R.pill, { size: 20, h: 38, bg: R.col, fg: C.white });
      const w = text(g, x + 24, 540, R.where, { size: 20, weight: 700, fill: C.ink });
      fit(w, x + 344, `lieu ${i}`);
      G.para(g, x + 24, 570, R.sym, 312, { size: 18, weight: 500, fill: C.ink, lh: 1.3 });
      el('line', { x1: x + 24, y1: 634, x2: x + 336, y2: 634, stroke: C.line, 'stroke-width': 2 }, g);
      text(g, x + 24, 664, 'Qui s’en saisit', { size: 17, weight: 500, fill: R.col });
      G.para(g, x + 24, 694, R.owner, 312, { size: 19, weight: 700, fill: R.col, lh: 1.3 });
      return { g, cx };
    });

    S.chute = G.blogChute('Choisir l’indicateur, c’est désigner qui se saisit du problème.', { y: 812 });
  }

  // ---------- Chronologie ----------
  const BAR_T = 1.8, BAR_D = 0.8, ZL_T = 2.7, BR_T = [3.4, 3.2, 3.0];
  const STEP = [4.3, 6.9, 9.5], MOVE = 0.55;
  const SPOT_END = 12.0, CHUTE_T = 12.3;

  function spotRect(zi) { const z = ZONES[zi]; return { x: xh(z.a) - 6, w: (z.b - z.a) * PXH + 12 }; }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.reveal.setAttribute('width', live ? Math.max(0.001, 1060 * easeInOut(prog(t, BAR_T, BAR_D))) : 1060);
    S.bar.setAttribute('opacity', o);
    pop(S.zl, t, ZL_T, 600, BY + BH + 36);

    RATES.forEach((R, i) => {
      const b = S.br[i];
      pop(b.g, t, BR_T[i], b.cx, R.y);
      const on = live && t >= STEP[i] && t < STEP[i] + 0.9;
      b.path.setAttribute('stroke-width', on ? 5 : 3);
      pop(S.cols[i].g, t, STEP[i] + 0.35, S.cols[i].cx, 600);
    });

    // Projecteur : pertes machine, puis arrêts planifiés, puis nuit
    let r = null;
    if (live && t >= STEP[0] - 0.2 && t < SPOT_END) {
      r = spotRect(RATES[0].zone);
      for (let i = 1; i < 3; i++) {
        if (t >= STEP[i] - MOVE) {
          const a = spotRect(RATES[i - 1].zone), c = spotRect(RATES[i].zone);
          const p = easeInOut(prog(t, STEP[i] - MOVE, MOVE));
          r = { x: a.x + (c.x - a.x) * p, w: a.w + (c.w - a.w) * p };
        }
      }
    }
    if (r) {
      S.spot.setAttribute('x', r.x);
      S.spot.setAttribute('width', r.w);
      S.spot.setAttribute('opacity', Math.min(clamp(prog(t, STEP[0] - 0.2, 0.25)), clamp((SPOT_END - t) / 0.3)));
    } else S.spot.setAttribute('opacity', 0);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
