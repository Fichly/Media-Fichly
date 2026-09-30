// Blog · Takt time · section « Takt time et temps de cycle : la comparaison qui décide »
// Mécanique : quatre postes, temps de cycle empilés par tâches, ligne du takt à 95 s. La moyenne (89,5 s) passe sous
// le takt et rassure ; mais le poste 3 à 108 s dépasse, et c'est lui qui fixe la cadence de sortie. Première voie,
// la moins chère : équilibrer. Une tâche de 14 s quitte le goulot pour le poste 4, en avance : 94 s et 92 s, tout
// passe sous le takt. Les deux autres voies (réduire le cycle, ouvrir du temps) restent listées par coût croissant.
// Hypothèses : cycles des postes 1, 2, 4 (82, 90, 78 s) et découpage en tâches illustratifs ; 95 s et 108 s viennent de l'article.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = '\u00a0';

  const Y0 = 676, PXS = 3.55;                // 0 s en y = 676, 3,55 px par seconde
  const ys = s => Y0 - s * PXS;
  const BW = 90;
  const POSTS = [
    { cx: 250, tasks: [30, 28, 24] },
    { cx: 380, tasks: [34, 30, 26] },
    { cx: 510, tasks: [40, 30, 24, 14] },
    { cx: 640, tasks: [28, 26, 24] },
  ];
  const TAKT = 95, AVG = 89.5;
  const MOVE = { from: 2, to: 3, k: 3, t: 7.4, d: 1.1 };   // la tâche de 14 s du poste 3 va au poste 4
  const T_BARS = 1.8, T_TAKT = 3.3, T_AVG = 4.1, T_GOUL = 5.2, T_LIST = 6.4, T_OK = MOVE.t + MOVE.d + 0.1;
  const CHUTE_T = 11.6;
  const S = {};

  const sum = a => a.reduce((x, y) => x + y, 0);

  function build() {
    G.templateBlog();
    G.blogTitle('Le goulot décide,', 'pas la moyenne.', { size: 48 });
    G.blogChapeau('Seule lecture utile : le cycle du poste le plus lent contre le takt time.');

    G.card(40, 176, 690, 582);
    G.card(750, 176, 410, 582);
    S.axis = el('line', { x1: 64, y1: Y0 + 2, x2: 706, y2: Y0 + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });

    // Barres : tâches empilées
    S.posts = POSTS.map((p, i) => {
      const g = el('g');
      text(g, p.cx, Y0 + 32, `Poste ${i + 1}`, { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
      let acc = 0;
      const blocks = p.tasks.map(d => {
        const y1 = ys(acc + d), h = d * PXS - 3;
        acc += d;
        const r = el('rect', { x: p.cx - BW / 2, y: y1, width: BW, height: h, rx: 6, fill: C.lightBlue });
        return { r, d, y: y1, h };
      });
      const val = text(G.svg, p.cx, Y0 + 58, '', { size: 21, weight: 800, fill: C.ink, anchor: 'middle' });
      return { ...p, g, blocks, val };
    });
    // Tâche déplacée : fantôme pointillé à son ancienne place
    const mb = S.posts[MOVE.from].blocks[MOVE.k];
    S.ghost = el('rect', { x: POSTS[MOVE.from].cx - BW / 2, y: mb.y, width: BW, height: mb.h, rx: 6, fill: 'none', stroke: C.tGreen, 'stroke-width': 2, 'stroke-dasharray': '5 4' });
    S.moveLab = text(G.svg, 0, 0, '14 s', { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
    // Dépassement du goulot (au-dessus du takt)
    S.over = el('g');
    el('rect', { x: POSTS[2].cx - BW / 2 - 4, y: ys(108) - 2, width: BW + 8, height: (108 - TAKT) * PXS + 1, rx: 6, fill: C.red }, S.over);
    text(S.over, POSTS[2].cx, ys(108) + 30, '+13 s', { size: 20, weight: 800, fill: C.white, anchor: 'middle' });
    S.overLab = el('g');

    // Lignes takt et moyenne
    S.takt = el('g');
    S.taktA = G.arrow(S.takt, `M 64 ${ys(TAKT)} L 706 ${ys(TAKT)}`, { stroke: C.blue, width: 3, head: 0.001, dash: '10 7' });
    S.taktA.head.remove();
    G.pill(S.takt, 64, ys(TAKT) - 26, 'Takt 95 s', { size: 18, h: 30, pad: 12, bg: C.blue, fg: C.white });
    S.avg = el('g');
    const al = el('line', { x1: 64, y1: ys(AVG), x2: 706, y2: ys(AVG), stroke: C.violet, 'stroke-width': 3, 'stroke-dasharray': '3 6', 'stroke-linecap': 'round' }, S.avg);
    S.avgLab = el('g');
    text(S.avgLab, 64, ys(AVG) + 26, 'Moyenne', { size: 18, weight: 700, fill: C.violet });
    text(S.avgLab, 64, ys(AVG) + 48, '89,5 s', { size: 18, weight: 700, fill: C.violet });
    S.avgCross = el('g');
    G.cross(S.avgCross, 170, ys(AVG) + 20, 11);

    // Carte de droite : lecture et trois voies
    S.read = el('g');
    text(S.read, 778, 222, 'Le poste 3 met 108 s,', { size: 22, weight: 700, fill: C.tRed });
    text(S.read, 778, 250, 'le takt en laisse 95.', { size: 22, weight: 700, fill: C.tRed });
    G.para(S.read, 778, 284, `La moyenne passe, la ligne ne livre pas${NB}: le goulot fixe la cadence de sortie.`, 356, { size: 18, weight: 500, fill: C.ink, lh: 1.35 });
    S.listHead = text(G.svg, 778, 396, 'Trois voies, par coût croissant', { size: 20, weight: 700, fill: C.blue });
    fit(S.listHead, 1140, 'titre liste');
    const ITEMS = [
      ['Équilibrer la ligne', 'déplacer des tâches du goulot vers les postes en avance'],
      ['Réduire le cycle du poste', 'fiabiliser l’équipement par une TPM'],
      ['Ouvrir du temps', 'le takt augmente, et cela se paie'],
    ];
    S.items = ITEMS.map(([a, b], i) => {
      const y = 440 + i * 100;
      const g = el('g');
      const bg = el('rect', { x: 764, y: y - 30, width: 382, height: 88, rx: 16, fill: C.pGreen, opacity: 0 }, g);
      G.badgeNum(g, 792, y - 6, i + 1, 16);
      fit(text(g, 820, y, a, { size: 19, weight: 700, fill: C.ink }), 1100, `voie ${i}`);
      G.para(g, 820, y + 24, b, 316, { size: 17, weight: 500, fill: C.ink, lh: 1.3 });
      for (let k = 0; k <= i; k++) el('circle', { cx: 1128 - k * 14, cy: y - 6, r: 5.5, fill: C.yellow }, g);
      return { g, bg, y };
    });

    S.chute = G.blogChute('C’est le goulot qui fixe la cadence de sortie.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;
    const mv = live ? easeInOut(prog(t, MOVE.t, MOVE.d)) : 1;
    S.axis.setAttribute('opacity', 1);

    // Barres qui montent, puis la tâche qui change de poste
    S.posts.forEach((p, i) => {
      const t0 = T_BARS + 0.2 * i;
      const gr = live ? easeOut(prog(t, t0, 0.6)) : 1;
      p.g.setAttribute('opacity', fo * (live ? clamp(prog(t, t0, 0.3)) : 1));
      p.blocks.forEach((b, k) => {
        let x = p.cx - BW / 2, y = b.y;
        const isMove = i === MOVE.from && k === MOVE.k;
        // croissance : le bloc descend depuis sous l'axe (masqué par l'opacité), empilé dans l'ordre
        const kk = p.blocks.length;
        const bp = live ? clamp((gr * kk) - k) : 1;
        let o = fo * clamp(bp * 3);
        y = y + (1 - easeOut(bp)) * 30;
        if (isMove) {
          const to = POSTS[MOVE.to];
          const top = ys(sum(POSTS[MOVE.to].tasks) + b.d);
          const x1 = to.cx - BW / 2;
          x = x + (x1 - x) * mv;
          y = y + (top - y) * mv - 70 * Math.sin(Math.PI * mv);
          b.r.setAttribute('fill', mv > 0 ? C.green : C.lightBlue);
          S.moveLab.setAttribute('x', x + BW / 2);
          S.moveLab.setAttribute('y', y + b.h / 2 + 6);
          S.moveLab.setAttribute('opacity', o * clamp(mv * 4));
        }
        b.r.setAttribute('x', x);
        b.r.setAttribute('y', y);
        b.r.setAttribute('opacity', o);
      });
      // Valeur au-dessus de la barre
      let v = sum(p.tasks);
      if (i === MOVE.from) v -= 14 * mv;
      if (i === MOVE.to) v += 14 * mv;
      const vr = Math.round(v);
      p.val.textContent = `${vr} s`;
      p.val.setAttribute('fill', vr > TAKT ? C.tRed : (i === MOVE.from || i === MOVE.to) && mv >= 1 ? C.tGreen : C.ink);
      p.val.setAttribute('opacity', fo * (live ? clamp(prog(t, t0 + 0.5, 0.3)) : 1));
    });
    S.ghost.setAttribute('opacity', fo * (live ? clamp(prog(t, MOVE.t + MOVE.d, 0.3)) : 1));

    // Takt puis moyenne
    const tk = live ? easeInOut(prog(t, T_TAKT, 0.6)) : 1;
    S.taktA.draw(tk);
    S.takt.setAttribute('opacity', fo * (live ? clamp(prog(t, T_TAKT, 0.2)) : 1));
    S.avg.setAttribute('opacity', fo * (live ? clamp(prog(t, T_AVG, 0.3)) : 1) * (live && t < T_GOUL + 0.6 ? 1 : 0.55));
    pop(S.avgLab, t, T_AVG + 0.2, 100, ys(AVG) + 36);
    pop(S.avgCross, t, T_GOUL + 0.5, 170, ys(AVG) + 20);

    // Goulot : dépassement souligné, puis résorbé par l'équilibrage
    const ov = live ? clamp(prog(t, T_GOUL, 0.3)) * (1 - clamp(prog(t, MOVE.t + 0.5, 0.4))) : 0;
    S.over.setAttribute('opacity', fo * ov);
    S.overLab.setAttribute('opacity', fo * ov);
    if (live && t >= T_GOUL && t < T_GOUL + 0.8) pulse(S.over, t, T_GOUL + 0.1, POSTS[2].cx, ys(101), 0.1, 0.45); else S.over.setAttribute('transform', '');

    // Carte de droite
    pop(S.read, t, T_GOUL + 0.2, 950, 260);
    const lo = fo * (live ? clamp(prog(t, T_LIST, 0.3)) : 1);
    S.listHead.setAttribute('opacity', lo);
    S.items.forEach((it, i) => {
      pop(it.g, t, T_LIST + 0.2 + 0.15 * i, 954, it.y + 10);
      if (i === 0) it.bg.setAttribute('opacity', live ? clamp(prog(t, MOVE.t - 0.4, 0.3)) : 1);
    });
    if (live && t >= T_OK && t < T_OK + 0.8) pulse(S.items[0].g, t, T_OK, 954, 450, 0.05, 0.45);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
