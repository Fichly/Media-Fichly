// Blog · TPM · section « Quels sont les 8 piliers de la TPM, et dans quel ordre les prendre ? »
// Mécanique : la liste à plat (huit chantiers de front, plus les 5S) se défait ; les 5S descendent former le socle,
// puis les piliers montent dans l'ordre : maintenance autonome et amélioration ciblée d'abord, les quatre suivants
// ensuite, conception et services des années plus tard. Le toit ne se pose qu'à la fin.
// Regroupement des quatre piliers du milieu : hypothèse (l'article ne fixe que le début et la fin).
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const PW = 124, GAP = 8, PX0 = 600 - (8 * PW + 7 * GAP) / 2;
  const PTOP = 262, PBOT = 522;
  const SOCLE = { y: 530, h: 60 };
  const PILLARS = [
    { l: ['Maintenance', 'autonome'], ph: 0 },
    { l: ['Amélioration', 'ciblée'], ph: 0 },
    { l: ['Maintenance', 'planifiée'], ph: 1 },
    { l: ['Formation et', 'compétences'], ph: 1 },
    { l: ['Maintenance', 'de la qualité'], ph: 1 },
    { l: ['Sécurité,', 'santé,', 'environnement'], ph: 1, size: 15 },
    { l: ['Maîtrise de', 'la conception'], ph: 2 },
    { l: ['TPM dans', 'les services'], ph: 2 },
  ];
  const PH = [
    { t: 5.7, fill: C.blue, fg: C.white, lab: ['1. Au démarrage,', 'sur un périmètre restreint'] },
    { t: 7.3, fill: C.lightBlue, fg: C.white, lab: ['2. Ensuite, un pilier après l’autre'] },
    { t: 8.9, fill: C.pLav, fg: C.blue, lab: ['3. Des années plus tard,', 'quand il y a de quoi protéger'] },
  ];
  const T = { flat: 1.85, cross: 2.9, flatOut: 3.9, socle: 4.4, roof: 10.2, chute: 11.4 };
  const px = i => PX0 + i * (PW + GAP);

  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Huit piliers,', 'pas en même temps.', { size: 48 });
    G.blogChapeau('Les 5S d’abord, puis deux piliers sur un périmètre restreint. Le reste vient après.');
    G.card(40, 176, 1120, 576);

    // ----- Liste à plat (phase d'ouverture) -----
    S.flat = el('g');
    const fl = text(S.flat, 600, 262, 'Présentée à plat, la liste laisse croire à huit chantiers de front.', { size: 21, weight: 700, fill: C.ink, anchor: 'middle' });
    fit(fl, 1140, 'liste à plat');
    S.flatPills = [];
    const names = PILLARS.map(p => p.l.join(' '));
    names.push('5S');
    names.forEach((s, i) => {
      const r = Math.floor(i / 3), c = i % 3;
      const g = el('g', {}, S.flat);
      const isS = i === 8;
      const p = G.pill(g, 250 + c * 350, 320 + r * 56, s, { size: 18, h: 38, anchor: 'middle', bg: isS ? C.pYellow : C.pLav, fg: isS ? C.tYellow : C.blue });
      S.flatPills.push({ g, cx: 250 + c * 350, cy: 320 + r * 56, w: p.w });
    });
    S.flatCross = el('g');
    G.cross(S.flatCross, 600, 470, 20);
    text(S.flatCross, 632, 477, 'tout lancer en même temps', { size: 19, weight: 700, fill: C.tRed });

    // ----- Socle 5S -----
    S.socle = el('g');
    el('rect', { x: px(0), y: SOCLE.y, width: px(7) + PW - px(0), height: SOCLE.h, rx: 12, fill: C.yellow }, S.socle);
    text(S.socle, 600, SOCLE.y + 26, '5S : le socle, pas un neuvième pilier', { size: 20, weight: 800, fill: C.ink, anchor: 'middle' });
    text(S.socle, 600, SOCLE.y + 49, 'sur une machine sale, une fuite ne se voit pas', { size: 17, weight: 500, fill: C.ink, anchor: 'middle' });

    // ----- Piliers : montent depuis le socle -----
    S.pillars = PILLARS.map((p, i) => {
      const ph = PH[p.ph];
      const clip = G.clipRect(px(i) - 2, PTOP, PW + 4, PBOT - PTOP);
      const g = el('g', { 'clip-path': clip.url });
      el('rect', { x: px(i), y: PTOP, width: PW, height: PBOT - PTOP + 12, rx: 10, fill: ph.fill, stroke: p.ph === 2 ? C.blue : 'none', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
      p.l.forEach((s, k) => fit(text(g, px(i) + PW / 2, PTOP + 36 + k * 22, s, { size: p.size || 16, weight: p.size ? 600 : 700, fill: ph.fg, anchor: 'middle' }), px(i) + PW - 2, `pilier ${i}`, px(i) + 2));
      return { g, clip: clip.rect, ph: p.ph, k: PILLARS.filter((q, j) => j < i && q.ph === p.ph).length };
    });

    // ----- Toit -----
    S.roof = el('g');
    el('path', { d: `M ${px(0) - 18} ${PTOP - 6} L 600 196 L ${px(7) + PW + 18} ${PTOP - 6} Z`, fill: C.blue, stroke: C.blue, 'stroke-width': 6, 'stroke-linejoin': 'round' }, S.roof);
    text(S.roof, 600, PTOP - 18, 'TPM : supprimer les pertes de l’équipement', { size: 19, weight: 700, fill: C.white, anchor: 'middle' });

    // ----- Frise des phases -----
    S.axis = el('g');
    S.arrow = G.arrow(S.axis, `M ${px(0)} 616 L ${px(7) + PW + 6} 616`, { stroke: C.ink, width: 3, head: 10 });
    S.phases = PH.map((ph, j) => {
      const idx = PILLARS.map((p, i) => (p.ph === j ? i : -1)).filter(i => i >= 0);
      const x0 = px(idx[0]), x1 = px(idx[idx.length - 1]) + PW;
      const g = el('g');
      el('rect', { x: x0, y: 608, width: x1 - x0, height: 16, rx: 8, fill: ph.fill, stroke: j === 2 ? C.blue : 'none', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
      ph.lab.forEach((s, k) => fit(text(g, (x0 + x1) / 2, 652 + k * 23, s, { size: 17, weight: k === 0 ? 700 : 500, fill: C.ink, anchor: 'middle' }), x1 + 30, `phase ${j}`, x0 - 30));
      return { g, cx: (x0 + x1) / 2 };
    });

    S.chute = G.blogChute('Les huit piliers ne se lancent pas ensemble, les 5S d’abord.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Liste à plat : n'existe que pendant l'ouverture
    const fo = live ? Math.min(clamp(prog(t, T.flat, 0.3)), 1 - clamp(prog(t, T.flatOut, 0.4))) : 0;
    S.flat.setAttribute('opacity', fo);
    S.flatCross.setAttribute('opacity', live ? Math.min(clamp(prog(t, T.cross, 0.25)), 1 - clamp(prog(t, T.flatOut, 0.4))) : 0);
    if (live && t >= T.cross && t < T.cross + 0.8) pulse(S.flatCross, t, T.cross, 600, 470, 0.12, 0.4);

    // Socle : le « 5S » de la liste descend et s'élargit
    let so = o, tr = '';
    if (live) {
      const p = easeInOut(prog(t, T.socle, 0.8));
      so = clamp(prog(t, T.socle, 0.25));
      const f = S.flatPills[8];
      const sx = 0.12 + 0.88 * p;
      const cy0 = f.cy, cy1 = SOCLE.y + SOCLE.h / 2;
      const cx = f.cx + (600 - f.cx) * p, cy = cy0 + (cy1 - cy0) * p;
      tr = p >= 1 ? '' : `translate(${cx} ${cy}) scale(${sx} ${0.6 + 0.4 * p}) translate(-600 ${-cy1})`;
    }
    S.socle.setAttribute('transform', tr);
    S.socle.setAttribute('opacity', so);

    // Piliers : montée par phase
    S.pillars.forEach((P, i) => {
      const t0 = PH[P.ph].t + 0.22 * P.k;
      const p = live ? easeOut(prog(t, t0, 0.6)) : 1;
      const h = (PBOT - PTOP) * p;
      P.clip.setAttribute('y', PBOT - h);
      P.clip.setAttribute('height', Math.max(0.001, h));
      P.g.setAttribute('opacity', live ? 1 : o);
    });
    S.phases.forEach((ph, j) => pop(ph.g, t, PH[j].t - 0.2, ph.cx, 640));
    S.arrow.draw(live ? prog(t, PH[0].t - 0.4, 0.6) : 1);
    S.axis.setAttribute('opacity', o);

    // Toit : se pose à la fin
    let ry = 0, ro = o;
    if (live) { const p = prog(t, T.roof, 0.5); ry = -40 * (1 - easeOut(p)); ro = clamp(p / 0.4); }
    S.roof.setAttribute('transform', ry ? `translate(0 ${ry})` : '');
    S.roof.setAttribute('opacity', ro);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
