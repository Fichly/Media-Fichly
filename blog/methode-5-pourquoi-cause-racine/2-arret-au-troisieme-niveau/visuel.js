// Blog · 5 pourquoi · section « Pourquoi la chaîne des 5 pourquoi s'arrête-t-elle au troisième niveau ? »
// Mécanique : chaque pourquoi élargit le périmètre de la réponse. Niveau 1 dans la technique, niveau 2 dans le poste,
// niveau 3 encore dans la salle (le périmètre des présents). Le 4e désigne une décision prise ailleurs : la flèche
// bute sur le mur de la salle, la porte reste fermée (autorisation implicite que personne n'a donnée), et les analyses
// finissent sur « manque de rigueur », « oubli », « inattention ». Boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const CY = 628;                       // ligne de la chaîne
  const Z = [                           // zones emboîtées, de l'intérieur vers l'extérieur
    { x: 100, y: 470, w: 236, h: 246, name: '1 · La technique', sub: 'un réglage, une pièce, une machine', lx: 118, ly: 504, lw: 200 },
    { x: 80, y: 318, w: 488, h: 418, name: '2 · Le poste', sub: 'un contrôle, une procédure appliquée ou non', lx: 100, ly: 354, lw: 440 },
    { x: 60, y: 196, w: 754, h: 548, name: '3 · La salle', sub: 'le dernier niveau où la réponse tient dans le périmètre des présents', lx: 80, ly: 232, lw: 700 },
  ];
  const BX = [218, 452, 690];           // pastilles des niveaux 1 à 3
  const WALL = 814;
  const DOOR = { y0: CY - 52, y1: CY + 52 };
  const L4 = 910;

  function person(parent, cx, floor, fill = C.violet) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 52, r: 12, fill }, g);
    el('path', { d: `M ${cx - 20} ${floor} L ${cx - 20} ${floor - 18} Q ${cx - 20} ${floor - 35} ${cx} ${floor - 35} Q ${cx + 20} ${floor - 35} ${cx + 20} ${floor - 18} L ${cx + 20} ${floor} Z`, fill }, g);
    return g;
  }
  function padlock(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - 10} ${cy - 4} L ${cx - 10} ${cy - 13} A 10 10 0 0 1 ${cx + 10} ${cy - 13} L ${cx + 10} ${cy - 4}`, fill: 'none', stroke: C.ink, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    el('rect', { x: cx - 16, y: cy - 5, width: 32, height: 26, rx: 6, fill: C.yellow }, g);
    el('circle', { cx, cy: cy + 6, r: 3.5, fill: C.ink }, g);
    return g;
  }
  function badge(parent, cx, n, fill = C.blue) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: CY, r: 24, fill }, g);
    text(g, cx, CY + 8, String(n), { size: 23, weight: 700, fill: C.white, anchor: 'middle' });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('On s’arrête', 'au 3e niveau.');
    G.blogChapeau('Le 3e niveau est le dernier où la réponse tient dans le périmètre des gens présents.');
    G.card(40, 176, 1120, 584);

    // Zones fixes (le décor ne s'efface pas)
    const fills = [C.pLav, '#f4f4fa', C.card];
    [...Z].reverse().forEach((z, k) => {
      const i = Z.length - 1 - k;
      el('rect', { x: z.x, y: z.y, width: z.w, height: z.h, rx: 22, fill: fills[i], stroke: i === 2 ? 'none' : C.line, 'stroke-width': 2 });
    });
    // Mur de la salle, avec une porte
    const wall = `M ${WALL} ${DOOR.y0} L ${WALL} 218 Q ${WALL} 196 ${WALL - 22} 196 L 82 196 Q 60 196 60 218 L 60 722 Q 60 744 82 744 L ${WALL - 22} 744 Q ${WALL} 744 ${WALL} 722 L ${WALL} ${DOOR.y1}`;
    S.wall = el('path', { d: wall, fill: 'none', stroke: C.blue, 'stroke-width': 4, 'stroke-dasharray': '12 8', 'stroke-linecap': 'round' });
    S.door = el('rect', { x: WALL - 5, y: DOOR.y0, width: 10, height: DOOR.y1 - DOOR.y0, rx: 5, fill: C.blue });

    // Étiquettes des zones
    S.labels = Z.map((z, i) => {
      const g = el('g');
      text(g, z.lx, z.ly, z.name, { size: 21, weight: 700, fill: C.blue });
      const p = G.para(g, z.lx, z.ly + 26, z.sub, z.lw, { size: 17, weight: 500, fill: C.ink, lh: 1.25 });
      fit(p.t, z.lx + z.lw + 4, `sous-titre zone ${i + 1}`);
      return g;
    });
    // Ailleurs
    S.out = el('g');
    text(S.out, 846, 230, '4 · Ailleurs', { size: 21, weight: 700, fill: C.violet });
    const po = G.para(S.out, 846, 256, 'une décision prise par quelqu’un d’autre, souvent plus haut', 290, { size: 17, weight: 500, fill: C.ink, lh: 1.25 });
    fit(po.t, 1140, 'sous-titre ailleurs');
    person(S.out, 912, 384);
    person(S.out, 1060, 384);
    text(S.out, 912, 410, 'responsable', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
    text(S.out, 1060, 410, 'service voisin', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });

    // Chaîne : pastilles et segments
    S.badges = BX.map((x, i) => badge(G.svg, x, i + 1));
    S.segs = [0, 1].map(i => {
      const g = el('g');
      const a = G.arrow(g, `M ${BX[i] + 30} ${CY} L ${BX[i + 1] - 30} ${CY}`, { width: 4, head: 10 });
      text(g, (BX[i] + BX[i + 1]) / 2, CY - 14, 'pourquoi ?', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
      return { g, a };
    });
    // Le 4e pourquoi : il bute sur le mur
    S.try = el('g');
    S.tryLine = el('line', { x1: BX[2] + 30, y1: CY, x2: BX[2] + 30, y2: CY, stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.try);
    S.tryHead = el('path', { d: 'M -10 -9 L 0 0 L -10 9', fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.try);
    S.tryLab = text(S.try, (BX[2] + WALL) / 2 + 4, CY - 14, 'pourquoi ?', { size: 16, weight: 700, fill: C.tRed, anchor: 'middle' });
    S.ghost = el('g');
    el('line', { x1: WALL + 16, y1: CY, x2: L4 - 30, y2: CY, stroke: C.violet, 'stroke-width': 3, 'stroke-dasharray': '6 6', 'stroke-linecap': 'round' }, S.ghost);
    el('circle', { cx: L4, cy: CY, r: 24, fill: 'none', stroke: C.violet, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, S.ghost);
    text(S.ghost, L4, CY + 8, '4', { size: 23, weight: 700, fill: C.violet, anchor: 'middle' });
    S.lock = padlock(G.svg, WALL, CY - 78);

    // Pourquoi personne ne passe la porte
    S.why = el('g');
    const wp = G.para(S.why, 846, 468, 'Continuer, c’est mettre en cause une décision : une autorisation que personne n’a donnée.', 290, { size: 17, weight: 700, fill: C.tRed, lh: 1.25 });
    fit(wp.t, 1140, 'autorisation');
    S.whyN = wp.n;

    // Là où les analyses finissent
    S.tagHead = el('g');
    const th = text(S.tagHead, 690, 430, 'On s’arrête sur :', { size: 17, weight: 700, fill: C.tRed, anchor: 'middle' });
    fit(th, WALL - 8, 'titre des étiquettes', 572);
    S.tags = ['manque de rigueur', 'oubli', 'inattention'].map((s, i) => {
      const g = el('g');
      G.pill(g, 690, 466 + 40 * i, s, { size: 17, h: 32, pad: 14, bg: C.pRed, fg: C.tRed, icon: 'cross', anchor: 'middle' });
      return g;
    });

    S.chute = G.blogChute('Ce n’est pas l’atelier : c’est le niveau où l’on s’arrête.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  const T = { b: [2.2, 3.4, 4.6], seg: [2.9, 4.1], hit: 5.4, lock: 5.8, out: 6.3, why: 7.2, tags: 8.3, chute: 9.6 };

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Pastilles et zones : le périmètre s'élargit à chaque pourquoi
    S.badges.forEach((b, i) => pop(b, t, T.b[i], BX[i], CY));
    S.labels.forEach((l, i) => pop(l, t, T.b[i] + 0.15, Z[i].lx + 60, Z[i].ly));
    S.segs.forEach((s, i) => {
      if (!live) { s.a.draw(1); s.g.setAttribute('opacity', o); return; }
      const q = prog(t, T.seg[i], 0.4);
      s.a.draw(q);
      s.g.setAttribute('opacity', q > 0 ? 1 : 0);
    });

    // Le 4e pourquoi part, bute sur le mur, recule un peu
    const x0 = BX[2] + 30, xw = WALL - 14;
    let xe = xw, sh = 0;
    if (live) {
      const p = prog(t, T.hit - 0.45, 0.45);
      xe = x0 + (xw - x0) * easeOut(p);
      const s = t - T.hit;
      if (s > 0 && s < 0.4) sh = -7 * Math.sin(s * 45) * (1 - s / 0.4);
      S.try.setAttribute('opacity', p > 0 ? 1 : 0);
    } else S.try.setAttribute('opacity', o);
    S.tryLine.setAttribute('x2', xe + sh);
    S.tryHead.setAttribute('transform', `translate(${xe + sh + 2} ${CY})`);
    S.tryLab.setAttribute('opacity', live ? clamp(prog(t, T.hit - 0.2, 0.3)) : 1);

    // Mur et porte : flash rouge au choc
    const flash = live && t >= T.hit && t < T.hit + 0.6 ? Math.sin(Math.PI * (t - T.hit) / 0.6) : 0;
    S.door.setAttribute('fill', flash > 0.3 ? C.red : C.blue);
    S.wall.setAttribute('stroke', flash > 0.3 ? C.red : C.blue);
    pop(S.lock, t, T.lock, WALL, CY - 72);
    pop(S.out, t, T.out, 990, 330);
    const go = live ? clamp(prog(t, T.out + 0.3, 0.4)) : o;
    S.ghost.setAttribute('opacity', go);
    pop(S.why, t, T.why, 990, 500);

    // Les formulations sur lesquelles les analyses s'arrêtent
    pop(S.tagHead, t, T.tags, 690, 425);
    S.tags.forEach((g, i) => pop(g, t, T.tags + 0.25 + 0.2 * i, 690, 466 + 40 * i));

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
