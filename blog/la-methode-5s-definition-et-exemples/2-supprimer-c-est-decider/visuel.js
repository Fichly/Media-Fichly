// Blog · 5S · étape « Seiri, supprimer : décider de ce qui reste »
// Mécanique : en haut, un tri sans autorité de décision déplace le tas de trois mètres (erreur type de l'article).
// En bas, le tri se fait avec celui qui décide, sur deux critères écrits (fréquence d'usage, titulaire) :
// chaque objet passe devant les critères et part vers sa destination ; le doute va en zone d'attente datée,
// et au délai fixé ce qui n'a pas été repris sort. Critère de sortie : tout ce qui reste a un titulaire et un usage.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  // Le gabarit ne précharge pas la graisse 600 : la charger avant la construction (mesures de para / fit justes)
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;

  const S = {};
  const A = { y: 176, h: 180, floor: 318, x0: 210, x1: 490 };
  const B = { y: 370, h: 390 };
  const BINS = [
    { y: 426, title: 'Reste à portée', crit: 'chaque jour, titulaire connu', bg: C.pGreen, fg: C.tGreen, stroke: C.green },
    { y: 534, title: 'Sort de la zone', crit: 'usage rare, ou sans titulaire', bg: C.pLav, fg: C.blue, stroke: C.lightBlue },
    { y: 642, title: 'Zone d’attente', crit: 'le doute, daté, délai fixé', bg: C.pRed, fg: C.tRed, stroke: C.red, dash: true },
  ];
  const BIN = { x: 600, w: 536, h: 100 };
  const SLOT = k => 936 + 78 * k;
  const EXAM = { x: 440, y: 508 };

  // ---------- Objets (centrés sur 0,0) ----------
  const DRAW = {
    wrench: g => { const r = el('g', { transform: 'rotate(90)' }, g); el('rect', { x: -6, y: -18, width: 12, height: 50, rx: 6, fill: C.lightBlue }, r); el('circle', { cx: 0, cy: -24, r: 14, fill: C.lightBlue }, r); el('rect', { x: -5, y: -42, width: 10, height: 15, rx: 2, fill: C.card }, r); },
    hammer: g => { const r = el('g', { transform: 'rotate(-90)' }, g); el('rect', { x: -5, y: -14, width: 10, height: 48, rx: 4, fill: C.yellow }, r); el('rect', { x: -20, y: -32, width: 40, height: 18, rx: 5, fill: C.ink }, r); },
    carton: g => { G.carton(g, 0, 0, 1.25); },
    gear: g => {
      for (let i = 0; i < 8; i++) el('rect', { x: -4, y: -22, width: 8, height: 10, rx: 2, fill: '#9d9dbd', transform: `rotate(${i * 45})` }, g);
      el('circle', { cx: 0, cy: 0, r: 16, fill: '#9d9dbd' }, g);
      el('circle', { cx: 0, cy: 0, r: 6, fill: C.card }, g);
    },
    jig: g => { el('path', { d: 'M -22 -20 L -6 -20 L -6 6 L 22 6 L 22 20 L -22 20 Z', fill: C.violet }, g); el('circle', { cx: -14, cy: -8, r: 3.5, fill: C.card }, g); el('circle', { cx: 12, cy: 13, r: 3.5, fill: C.card }, g); },
  };
  // Tri : [objet, usage, titulaire, destination (bac), destination finale si différente]
  const ITEMS = [
    { d: 'wrench', use: 'chaque jour', who: 'Léa', bin: 0 },
    { d: 'carton', use: 'une fois par trimestre', who: 'Marc', bin: 1 },
    { d: 'jig', use: 'peut-être utile', who: 'à confirmer', bin: 2, then: 0, thenLabel: 'Délai écoulé : repris par Karim' },
    { d: 'hammer', use: 'chaque jour', who: 'Karim', bin: 0 },
    { d: 'gear', use: 'aucun', who: 'personne', bin: 1 },
    { d: 'carton', use: 'peut-être utile', who: 'à confirmer', bin: 2, then: 1, thenLabel: 'Non repris : il sort de la zone' },
  ];
  const PILE = [[140, 580], [210, 580], [280, 580], [175, 530], [245, 530], [210, 484]];
  const PILE_A = [[-52, 0], [0, 0], [52, 0], [-26, -40], [26, -40]];
  const EX_T = k => 5.0 + 1.05 * k;
  const WAIT_T = 11.6, WAIT_D = 1.3, THEN_T = [13.05, 13.45];
  const CRIT_T = 14.1, CHUTE_T = 14.6;

  // Emplacement final de chaque objet dans les bacs
  const finalSlot = [];
  const interim = [];
  {
    const count = [0, 0, 0];
    ITEMS.forEach((it, k) => { interim[k] = { bin: it.bin, slot: count[it.bin]++ }; });
    const c2 = [0, 0, 0];
    // ordre d'arrivée final : d'abord les objets qui vont directement, puis ceux qui sortent de la zone d'attente
    ITEMS.forEach((it, k) => { if (it.then === undefined) finalSlot[k] = { bin: it.bin, slot: c2[it.bin]++ }; });
    ITEMS.forEach((it, k) => { if (it.then !== undefined) finalSlot[k] = { bin: it.then, slot: c2[it.then]++ }; });
  }
  const slotXY = s => ({ x: SLOT(s.slot), y: BINS[s.bin].y + 52 });

  function build() {
    G.templateBlog();
    G.blogTitle('Supprimer,', 'c’est décider.');
    G.blogChapeau('Le tri se fait sur un critère explicite : la fréquence d’usage et le titulaire.');

    // ----- Carte A : sans autorité -----
    G.card(40, A.y, 1120, A.h);
    S.headA = el('g');
    G.pill(S.headA, 64, 210, 'Sans autorité de décision', { size: 20, h: 36, bg: C.pRed, fg: C.tRed });
    el('line', { x1: 70, y1: A.floor, x2: 600, y2: A.floor, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });
    S.ghostA = el('rect', { x: A.x0 - 82, y: A.floor - 88, width: 164, height: 84, rx: 12, fill: 'none', stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
    S.pileA = el('g');
    const pa = ['carton', 'gear', 'carton', 'jig', 'wrench'];
    PILE_A.forEach(([dx, dy], i) => { const g = el('g', { transform: `translate(${dx} ${A.floor - 22 + dy})` }, S.pileA); DRAW[pa[i]](g); });
    S.dimA = el('g');
    const ay = 342;
    G.arrow(S.dimA, `M 330 ${ay} L ${A.x0} ${ay}`, { width: 3, head: 8, stroke: C.tRed });
    G.arrow(S.dimA, `M 372 ${ay} L ${A.x1} ${ay}`, { width: 3, head: 8, stroke: C.tRed });
    text(S.dimA, 351, ay + 6, '3 m', { size: 17, weight: 700, fill: C.tRed, anchor: 'middle' });
    S.resA = el('g');
    G.cross(S.resA, 660, 262, 15);
    fit(text(S.resA, 688, 270, 'Le même tas, trois mètres plus loin.', { size: 22, weight: 700, fill: C.tRed }), 1136, 'résultat A');
    text(S.resA, 688, 302, 'Personne n’a décidé de ce qui reste.', { size: 19, weight: 500, fill: C.ink });

    // ----- Carte B : avec celui qui décide -----
    G.card(40, B.y, 1120, B.h);
    S.headB = el('g');
    G.pill(S.headB, 64, 402, 'Avec celui qui décide, sur deux critères écrits', { size: 20, h: 36, bg: C.pGreen, fg: C.tGreen });
    S.bins = BINS.map((b, i) => {
      const g = el('g');
      el('rect', { x: BIN.x, y: b.y, width: BIN.w, height: BIN.h, rx: 16, fill: b.bg, stroke: b.stroke, 'stroke-width': 2, ...(b.dash ? { 'stroke-dasharray': '7 6' } : {}) }, g);
      text(g, BIN.x + 20, b.y + 40, b.title, { size: 21, weight: 700, fill: b.fg });
      fit(text(g, BIN.x + 20, b.y + 70, b.crit, { size: 17, weight: 500, fill: C.ink }), 912, `critère ${i}`);
      return g;
    });
    // Délai de la zone d'attente : horloge dont l'arc se remplit
    S.clock = el('g');
    const ck = { x: 1104, y: BINS[2].y + 50, r: 17 };
    el('circle', { cx: ck.x, cy: ck.y, r: ck.r, fill: C.white, stroke: C.red, 'stroke-width': 2 }, S.clock);
    S.clockArc = el('circle', { cx: ck.x, cy: ck.y, r: ck.r - 7, fill: 'none', stroke: C.red, 'stroke-width': 10, transform: `rotate(-90 ${ck.x} ${ck.y})` }, S.clock);
    S.clockLen = 2 * Math.PI * (ck.r - 7);
    S.clockArc.setAttribute('stroke-dasharray', `${S.clockLen} ${S.clockLen}`);
    el('circle', { cx: ck.x, cy: ck.y, r: 2.5, fill: C.tRed }, S.clock);

    // Étiquette de l'objet examiné
    S.tag = el('g');
    el('rect', { x: EXAM.x - 120, y: EXAM.y + 36, width: 240, height: 64, rx: 12, fill: C.white, stroke: C.blue, 'stroke-width': 2 }, S.tag);
    el('path', { d: `M ${EXAM.x - 8} ${EXAM.y + 37} L ${EXAM.x} ${EXAM.y + 28} L ${EXAM.x + 8} ${EXAM.y + 37} Z`, fill: C.blue }, S.tag);
    S.tagUse = text(S.tag, EXAM.x - 104, EXAM.y + 62, '', { size: 17, weight: 500, fill: C.ink });
    S.tagWho = text(S.tag, EXAM.x - 104, EXAM.y + 88, '', { size: 17, weight: 500, fill: C.ink });

    // Critère de sortie (image finale)
    S.crit = el('g');
    el('rect', { x: 64, y: 468, width: 500, height: 274, rx: 16, fill: C.pGreen }, S.crit);
    G.check(S.crit, 96, 506, 16);
    text(S.crit, 124, 513, 'Critère de sortie', { size: 22, weight: 700, fill: C.tGreen });
    G.para(S.crit, 88, 552, 'Tout ce qui reste a un titulaire et un usage identifié.', 450, { size: 20, weight: 500, fill: C.ink, lh: 1.3 });
    el('line', { x1: 88, y1: 606, x2: 540, y2: 606, stroke: C.green, 'stroke-width': 2, opacity: 0.5 }, S.crit);
    [['3 objets restent à portée', C.green], ['3 objets sortent de la zone', C.lightBlue], ['0 objet sans décision', C.red]].forEach(([s, c], i) => {
      el('rect', { x: 88, y: 626 + 36 * i, width: 16, height: 16, rx: 4, fill: c }, S.crit);
      text(S.crit, 116, 640 + 36 * i, s, { size: 19, weight: 600, fill: C.ink });
    });

    // Messages de la zone d'attente
    S.thenMsg = ITEMS.map(it => {
      if (it.then === undefined) return null;
      const g = el('g');
      const p = G.pill(g, 0, 0, it.thenLabel, { size: 17, h: 30, pad: 12, bg: it.then === 0 ? C.green : C.blue, fg: C.white });
      p.g.setAttribute('transform', `translate(${-p.w} 0)`);
      return g;
    });

    // Objets de la carte B
    S.items = ITEMS.map((it, k) => {
      const g = el('g');
      DRAW[it.d](el('g', {}, g));
      return { g, it, k };
    });

    S.chute = G.blogChute('Le tri suppose une autorité sur la zone, pas un balai.', { y: 806 });
  }

  const lerp = (a, b, p) => a + (b - a) * p;
  function flight(a, b, p, h = 50) {
    const e = easeInOut(p);
    return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e) - h * Math.sin(Math.PI * p) };
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // ----- Carte A : le tas glisse de trois mètres -----
    pop(S.headA, t, 1.75, 200, 210);
    const ax = live ? lerp(A.x0, A.x1, easeInOut(prog(t, 2.5, 1.2))) : A.x1;
    S.pileA.setAttribute('transform', `translate(${ax} 0)`);
    S.pileA.setAttribute('opacity', live ? clamp(prog(t, 1.9, 0.3)) : o);
    S.dimA.setAttribute('opacity', live ? clamp(prog(t, 3.5, 0.3)) : o);
    S.ghostA.setAttribute('opacity', live ? clamp(prog(t, 2.9, 0.3)) : o);
    pop(S.resA, t, 3.8, 800, 280);

    // ----- Carte B -----
    pop(S.headB, t, 4.2, 300, 402);
    S.bins.forEach((g, i) => pop(g, t, 4.35 + 0.1 * i, BIN.x + BIN.w / 2, BINS[i].y + 50));
    pop(S.clock, t, 4.55, 1104, BINS[2].y + 50);
    const cq = live ? prog(t, WAIT_T, WAIT_D) : 1;
    S.clockArc.setAttribute('stroke-dashoffset', S.clockLen * (1 - cq));
    S.clockArc.setAttribute('opacity', cq > 0 ? 1 : 0);

    S.items.forEach(({ g, it, k }) => {
      const pile = { x: PILE[k][0], y: PILE[k][1] };
      const mid = slotXY(interim[k]);
      const fin = slotXY(finalSlot[k]);
      let pos = fin, op = o;
      if (live) {
        const T = EX_T(k);
        op = clamp(prog(t, 4.4 + 0.07 * k, 0.3));
        if (t < T) pos = pile;
        else if (t < T + 0.75) pos = flight(pile, EXAM, prog(t, T, 0.4), 30);
        else pos = flight(EXAM, mid, prog(t, T + 0.75, 0.45), 60);
        if (it.then !== undefined) {
          const tt = THEN_T[it.then === 0 ? 0 : 1];
          if (t >= tt) pos = flight(mid, fin, prog(t, tt, 0.5), 60);
        }
      }
      g.setAttribute('transform', `translate(${pos.x} ${pos.y})`);
      g.setAttribute('opacity', op);
    });

    // Étiquette : critères de l'objet examiné
    let cur = -1;
    if (live) ITEMS.forEach((_, k) => { if (t >= EX_T(k) + 0.3 && t < EX_T(k) + 0.85) cur = k; });
    if (cur >= 0) {
      S.tagUse.textContent = `Usage : ${ITEMS[cur].use}`;
      S.tagWho.textContent = `Titulaire : ${ITEMS[cur].who}`;
    }
    S.tag.setAttribute('opacity', cur >= 0 ? Math.min(clamp((t - EX_T(cur) - 0.3) / 0.12), clamp((EX_T(cur) + 0.85 - t) / 0.12)) : 0);

    // Zone d'attente : au délai, repris ou sorti
    S.thenMsg.forEach((g, k) => {
      if (!g) return;
      const first = ITEMS[k].then === 0;
      const tt = THEN_T[first ? 0 : 1];
      g.setAttribute('transform', `translate(${EXAM.x + 120} ${first ? 548 : 590})`);
      g.setAttribute('opacity', live ? window01(t, tt - 0.2, CRIT_T - 0.1, 0.15) : 0);
    });

    pop(S.crit, t, CRIT_T, 314, 605);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
