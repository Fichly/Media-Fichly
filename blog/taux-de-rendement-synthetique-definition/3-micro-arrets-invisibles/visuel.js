// Blog · TRS · section « Les six grandes pertes derrière un TRS »
// Mécanique : une équipe de 8 h se déroule. La panne, visible, part au rapport d'arrêts. Les micro-arrêts
// (quelques secondes, réglés au poste) et les rebuts de démarrage (vécus comme normaux) n'y entrent jamais,
// mais le TRS les compte : cumulés, les micro-arrêts pèsent plus lourd que la panne.
// Hypothèses illustratives : 1 panne de 25 min, 40 micro-arrêts de 45 s (30 min), 12 pièces rebutées au démarrage.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const X0 = 190, X1 = 1120, PXM = (X1 - X0) / 480, TY = 298, TH = 42;
  const xm = m => X0 + m * PXM;
  const PANNE = { a: 250, d: 25 };
  const START = 6;                           // montée en régime : 6 premières minutes
  const MICRO_S = 45, N_MICRO = 40;
  const CUR0 = 2.6, CUR1 = 10.6;             // le curseur parcourt les 8 h
  const tOf = m => CUR0 + (CUR1 - CUR0) * m / 480;
  const PXMIN = 12;                          // échelle des barres du TRS : 12 px par minute

  // Micro-arrêts : positions pseudo-aléatoires déterministes, hors panne et hors démarrage
  const MICRO = (() => {
    let s = 7;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const out = [];
    while (out.length < N_MICRO) {
      const m = 12 + rnd() * 462;
      if (m > PANNE.a - 8 && m < PANNE.a + PANNE.d + 8) continue;
      if (out.some(o => Math.abs(o - m) < 5)) continue;
      out.push(m);
    }
    return out.sort((a, b) => a - b);
  })();

  function build() {
    G.templateBlog();
    G.blogTitle('Ce que le relevé', 'ne voit pas.');
    G.blogChapeau('Une équipe de 8 h : une panne déclarée, et des dizaines d’arrêts de quelques secondes.');

    // ----- Carte 1 : le déroulé de l'équipe -----
    G.card(40, 176, 1120, 280);
    S.head = el('g');
    text(S.head, 70, 216, 'Déroulé de l’équipe', { size: 22, weight: 700, fill: C.ink });
    const leg = [[C.green, 'production'], [C.red, 'arrêt'], [C.violet, 'rebuts de démarrage']];
    let lx = 1130;
    for (let i = leg.length - 1; i >= 0; i--) {
      const tt = text(S.head, lx, 216, leg[i][1], { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
      const b = measure(tt);
      el('rect', { x: b.x - 24, y: 201, width: 16, height: 16, rx: 4, fill: leg[i][0] }, S.head);
      lx = b.x - 40;
    }

    S.machG = el('g');
    S.mach = G.machine(S.machG, 70, 290, 0.5);

    // Frise : fond vert (production) révélé par le curseur, événements par-dessus
    const clip = G.clipRect(X0, TY - 2, 0, TH + 4);
    S.clip = clip.rect;
    S.track = el('g');
    el('rect', { x: X0, y: TY, width: X1 - X0, height: TH, rx: 8, fill: C.pLav }, S.track);
    S.tl = el('g', { 'clip-path': clip.url });
    el('rect', { x: X0, y: TY, width: X1 - X0, height: TH, rx: 8, fill: C.green }, S.tl);
    el('rect', { x: X0, y: TY, width: START * PXM + 4, height: TH, rx: 8, fill: C.violet }, S.tl);
    el('rect', { x: xm(PANNE.a), y: TY, width: PANNE.d * PXM, height: TH, fill: C.red }, S.tl);
    S.ticks = MICRO.map(m => el('rect', { x: xm(m) - 1.5, y: TY, width: 3, height: TH, fill: C.red }, S.tl));

    S.axis = el('g');
    for (let h = 0; h <= 8; h++) {
      el('line', { x1: X0 + h * 60 * PXM, y1: TY + TH + 4, x2: X0 + h * 60 * PXM, y2: TY + TH + 12, stroke: '#b9b9d0', 'stroke-width': 2 }, S.axis);
      text(S.axis, X0 + h * 60 * PXM, TY + TH + 32, `${h}${NB}h`, { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });
    }
    S.cursor = el('line', { x1: X0, y1: TY - 12, x2: X0, y2: TY + TH + 12, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });

    // Légendes sur la frise
    S.cPanne = el('g');
    G.pill(S.cPanne, xm(PANNE.a + PANNE.d / 2), 272, `Panne : 25${NB}min`, { size: 18, h: 32, pad: 12, bg: C.red, fg: C.white, anchor: 'middle' });
    el('path', { d: `M ${xm(PANNE.a + PANNE.d / 2) - 7} 287 L ${xm(PANNE.a + PANNE.d / 2)} 295 L ${xm(PANNE.a + PANNE.d / 2) + 7} 287 Z`, fill: C.red }, S.cPanne);
    S.cMicro = el('g');
    const m0 = MICRO[1];
    const cm = G.pill(S.cMicro, X0, 272, `Micro-arrêts : 45${NB}s, réglés au poste`, { size: 17, h: 32, pad: 12, bg: C.pRed, fg: C.tRed });
    el('path', { d: `M ${xm(m0) - 7} 287 L ${xm(m0)} 295 L ${xm(m0) + 7} 287 Z`, fill: C.pRed }, S.cMicro);
    fit(cm.g, xm(PANNE.a) - 90, 'légende micro-arrêts');
    S.cStart = el('g');
    text(S.cStart, X0, 422, `Démarrage : 12 premières pièces rebutées, « c’est normal »`, { size: 18, weight: 700, fill: '#6d3f75' });

    // ----- Carte 2 gauche : le rapport d'arrêts -----
    G.card(40, 472, 540, 288);
    S.rep = el('g');
    text(S.rep, 70, 514, 'Rapport d’arrêts de l’équipe', { size: 22, weight: 700, fill: C.ink });
    el('rect', { x: 64, y: 532, width: 492, height: 206, rx: 14, fill: C.white, stroke: C.line, 'stroke-width': 2 }, S.rep);
    [590, 652].forEach(y => el('line', { x1: 84, y1: y, x2: 536, y2: y, stroke: C.line, 'stroke-width': 2 }, S.rep));
    const row = (y, ok, label, value, fg) => {
      const g = el('g');
      (ok ? G.check : G.cross)(g, 100, y - 7, 13);
      text(g, 124, y, label, { size: 20, weight: 700, fill: fg });
      text(g, 536, y, value, { size: 20, weight: 500, fill: fg, anchor: 'end' });
      return g;
    };
    S.r1 = row(568, true, 'Panne', `25${NB}min`, C.ink);
    S.r2 = row(630, false, 'Micro-arrêts', 'non déclarés', C.tRed);
    S.r3 = row(692, false, 'Rebuts de démarrage', 'non comptés', C.tRed);

    // ----- Carte 2 droite : ce que compte le TRS -----
    G.card(600, 472, 560, 288);
    S.trs = el('g');
    text(S.trs, 630, 514, 'Ce que compte le TRS', { size: 22, weight: 700, fill: C.ink });
    text(S.trs, 630, 556, 'Panne', { size: 19, weight: 700, fill: C.ink });
    S.pBar = el('rect', { x: 630, y: 568, width: 25 * PXMIN, height: 26, rx: 6, fill: C.red });
    S.pVal = text(G.svg, 630 + 25 * PXMIN + 12, 588, '', { size: 19, weight: 700, fill: C.tRed });
    S.mLab = text(G.svg, 630, 630, '', { size: 19, weight: 700, fill: C.ink });
    S.mBar = el('rect', { x: 630, y: 642, width: 0, height: 26, rx: 6, fill: C.red });
    S.mVal = text(G.svg, 630, 662, '', { size: 19, weight: 700, fill: C.tRed });
    S.ref = el('line', { x1: 630 + 25 * PXMIN, y1: 560, x2: 630 + 25 * PXMIN, y2: 676, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '5 5' });
    S.rb = el('g');
    text(S.rb, 630, 718, 'Rebuts de démarrage', { size: 19, weight: 700, fill: C.ink });
    text(S.rb, 630, 744, '12 pièces, comptées en qualité', { size: 19, weight: 500, fill: '#6d3f75' });

    S.chute = G.blogChute('Personne ne les déclare. Le TRS, lui, les compte.', { y: 810 });
  }

  // ---------- Chronologie ----------
  const END_T = 11.0, CHUTE_T = 12.4;
  const minuteAt = t => (t < FADE_END ? 480 : 480 * clamp((t - CUR0) / (CUR1 - CUR0)));

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const m = minuteAt(t);

    pop(S.head, t, 1.8, 600, 210);
    pop(S.machG, t, 2.0, 115, 321);
    S.track.setAttribute('opacity', o * (live ? clamp(prog(t, 2.1, 0.3)) : 1));
    S.axis.setAttribute('opacity', o * (live ? clamp(prog(t, 2.2, 0.3)) : 1));
    S.clip.setAttribute('width', m * PXM);
    S.tl.setAttribute('opacity', o);
    const running = live && t >= CUR0 - 0.2 && t < CUR1 + 0.3;
    S.cursor.setAttribute('x1', xm(m));
    S.cursor.setAttribute('x2', xm(m));
    S.cursor.setAttribute('opacity', running ? 1 : 0);

    // Voyant de la machine : rouge pendant la panne et un bref instant à chaque micro-arrêt
    const inPanne = m >= PANNE.a && m < PANNE.a + PANNE.d;
    const flash = live && MICRO.some(mm => t >= tOf(mm) && t < tOf(mm) + 0.14);
    S.mach.lights[1].setAttribute('fill', running && (inPanne || flash) ? C.red : C.green);

    // Légendes de la frise
    const show = (g, t0, cx, cy) => pop(g, t, t0, cx, cy);
    show(S.cStart, tOf(START) + 0.1, 400, 416);
    show(S.cMicro, tOf(MICRO[1]) + 0.05, 330, 272);
    show(S.cPanne, tOf(PANNE.a) + 0.1, xm(PANNE.a + PANNE.d / 2), 272);

    // Rapport : seule la panne y entre
    pop(S.rep, t, 2.3, 310, 600);
    pop(S.r1, t, tOf(PANNE.a + PANNE.d) + 0.1, 300, 562);
    pop(S.r2, t, END_T, 300, 624);
    pop(S.r3, t, END_T + 0.3, 300, 686);

    // TRS : panne, micro-arrêts cumulés, rebuts de démarrage
    pop(S.trs, t, 2.5, 880, 560);
    const n = live ? MICRO.filter(mm => t >= tOf(mm)).length : N_MICRO;
    const pm = clamp(m - PANNE.a, 0, PANNE.d);
    S.pBar.setAttribute('width', Math.max(0.001, pm * PXMIN));
    S.pVal.textContent = `${Math.round(pm)}${NB}min`;
    S.pVal.setAttribute('x', 630 + pm * PXMIN + 12);
    S.pBar.setAttribute('opacity', o * (live ? clamp(prog(t, 2.6, 0.3)) : 1));
    S.pVal.setAttribute('opacity', o * (live ? (pm > 0 ? 1 : 0) : 1));
    S.mLab.textContent = `Micro-arrêts : ${n} × 45${NB}s`;
    const mins = n * MICRO_S / 60;
    S.mBar.setAttribute('width', Math.max(0.001, mins * PXMIN));
    S.mVal.textContent = `${Math.round(mins)}${NB}min`;
    S.mVal.setAttribute('x', 630 + mins * PXMIN + 12);
    const mo = o * (live ? clamp(prog(t, 2.6, 0.3)) : 1);
    [S.mLab, S.mBar, S.mVal].forEach(e => e.setAttribute('opacity', mo));
    S.ref.setAttribute('opacity', o * (live ? clamp(prog(t, END_T + 0.6, 0.3)) : 1));
    if (live && t >= END_T + 0.6 && t < END_T + 1.4) pulse(S.mBar, t, END_T + 0.7, 630, 655, 0.06, 0.5);
    pop(S.rb, t, tOf(START) + 0.2, 760, 730);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
