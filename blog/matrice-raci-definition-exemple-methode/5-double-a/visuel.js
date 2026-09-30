// Blog · Matrice RACI · section « Deux personnes se déclarent A sur la même tâche : comment trancher ? »
// Mécanique : trois fois la même ligne à deux A (« Modifier le standard », production et qualité), trois sorties.
// 1. La tâche cache deux tâches : la ligne se coupe en deux, chaque A trouve sa ligne.
// 2. L'un des deux est R ou C : la question de contrôle est posée, un A se retourne en C.
// 3. Le désaccord est hiérarchique : les deux A disparaissent, la case reste vide avec deux noms et une date.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = { bands: [] };
  const TOPS = [176, 372, 568], BH = 184;
  const CP = 780, CQ = 920;                   // colonnes production, qualité
  const ROW = { x: 352, w: 640, h: 44 };
  const CASES = [
    { title: ['La tâche cache', 'deux tâches'], how: 'Coupez la ligne en deux.' },
    { title: ['L’un des deux', 'est R, ou C'], how: 'Posez la question de contrôle.' },
    { title: ['Le désaccord est', 'hiérarchique'], how: 'Case A vide, deux noms, une date : on remonte.' },
  ];
  const B = k => 2.7 + 2.9 * k;              // début de la résolution du cas k
  const CHUTE_T = B(2) + 2.6;

  function cell(parent, cx, cy, L) {
    const g = el('g', {}, parent);
    const st = { A: [C.blue, C.white], C: [C.white, C.ink], R: [C.pLav, C.blue] }[L];
    el('circle', { cx, cy, r: 20, fill: st[0], stroke: L === 'C' ? C.ink : st[0], 'stroke-width': 2 }, g);
    text(g, cx, cy + 8, L, { size: 22, weight: 800, fill: st[1], anchor: 'middle' });
    return g;
  }
  function ring(cx, cy, col) { return el('circle', { cx, cy, r: 26, fill: 'none', stroke: col, 'stroke-width': 3.5 }); }
  const scaleAt = (g, cx, cy, sx, sy = sx) => g.setAttribute('transform', sx === 1 && sy === 1 ? '' : `translate(${cx} ${cy}) scale(${sx} ${sy}) translate(${-cx} ${-cy})`);

  function build() {
    G.templateBlog();
    G.blogTitle('Deux A,', 'trois façons de trancher.', { size: 48 });
    G.blogChapeau('Jamais un problème de matrice : une organisation floue qui devient visible.');

    CASES.forEach((cs, k) => {
      const T = TOPS[k], y0 = T + 104;
      const L = { T, y0 };
      G.card(40, T, 1120, BH);
      L.head = el('g');
      G.badgeNum(L.head, 84, T + 44, k + 1, 18);
      cs.title.forEach((s, i) => text(L.head, 114, T + 38 + 24 * i, s, { size: 20, weight: 700, fill: C.ink }));
      G.para(L.head, 66, T + 118, cs.how, 262, { size: 18, weight: 500, fill: C.blue, lh: 1.3 });
      text(L.head, CP, T + 36, 'Production', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      text(L.head, CQ, T + 36, 'Qualité', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });

      // La ligne à deux A (état de départ, identique pour les trois cas)
      L.row0 = el('g');
      el('rect', { x: ROW.x, y: y0 - ROW.h / 2, width: ROW.w, height: ROW.h, rx: 10, fill: C.white, stroke: C.line, 'stroke-width': 2 }, L.row0);
      text(L.row0, ROW.x + 16, y0 + 6, 'Modifier le standard', { size: 18, weight: 700, fill: C.ink });
      L.aP = cell(G.svg, CP, y0, 'A');
      L.aQ = cell(G.svg, CQ, y0, 'A');
      L.rP = ring(CP, y0, C.red);
      L.rQ = ring(CQ, y0, C.red);

      if (k === 0) {
        // Deux lignes : écrire (production), valider (qualité)
        L.rows = [[T + 76, 'Écrire le nouveau standard'], [T + 132, 'Valider qu’il est applicable']].map(([y, s]) => {
          const g = el('g');
          el('rect', { x: ROW.x, y: y - ROW.h / 2 + 2, width: ROW.w, height: ROW.h - 4, rx: 10, fill: C.white, stroke: C.line, 'stroke-width': 2 }, g);
          fit(text(g, ROW.x + 16, y + 6, s, { size: 18, weight: 700, fill: C.ink }), CP - 30, `ligne ${s}`);
          return { g, y };
        });
        L.gP = ring(CP, T + 76, C.green); L.gQ = ring(CQ, T + 132, C.green);
        [L.aP, L.aQ, L.rP, L.rQ, L.gP, L.gQ].forEach(n => G.svg.appendChild(n));   // lettres au-dessus des lignes
      } else if (k === 1) {
        L.cP = cell(G.svg, CP, y0, 'C');
        L.q = el('g');
        text(L.q, ROW.x + 16, T + 158, `Si elle n’est pas faite dans trois semaines, qui se le verra reprocher${NB}?`, { size: 17, weight: 700, fill: C.violet });
        L.gQ = ring(CQ, y0, C.green);
      } else {
        L.slot = el('g');
        el('circle', { cx: (CP + CQ) / 2, cy: y0, r: 20, fill: 'none', stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, L.slot);
        text(L.slot, (CP + CQ) / 2, y0 + 7, 'A', { size: 20, weight: 800, fill: C.tRed, anchor: 'middle' }).setAttribute('opacity', 0.45);
        L.note = el('g');
        text(L.note, ROW.x + 16, T + 158, 'A à trancher : production ou qualité, décision avant le 15/10', { size: 17, weight: 700, fill: C.tRed });
        L.up = el('g');
        G.arrow(L.up, `M 1060 ${y0 + 16} L 1060 ${y0 - 26}`, { stroke: C.tRed, width: 3.5, head: 9 });
        text(L.up, 1060, y0 + 40, 'remonté', { size: 17, weight: 700, fill: C.tRed, anchor: 'middle' });
      }
      S.bands.push(L);
    });

    S.chute = G.blogChute('Mieux vaut une case A vide et datée qu’un double A.', { y: 810 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    S.bands.forEach((L, k) => {
      const b = B(k);
      rise(L.head, t, 1.7 + 0.15 * k, 0.35);
      const q = live ? prog(t, b + 0.5, 0.8) : 1;       // avancement de la résolution
      const e = easeInOut(q);
      const appear = live ? clamp(prog(t, 1.9 + 0.15 * k, 0.3)) : 1;
      // Anneaux rouges : le conflit, puis il disparaît
      const redO = live ? appear * (1 - clamp(prog(t, b + 0.4, 0.3))) : 0;
      [L.rP, L.rQ].forEach(r => r.setAttribute('opacity', redO));
      if (live && t >= b && t < b + 0.5) { pulse(L.aP, t, b, CP, L.y0, 0.15, 0.4); pulse(L.aQ, t, b, CQ, L.y0, 0.15, 0.4); }

      if (k === 0) {
        // La ligne se coupe en deux
        L.row0.setAttribute('opacity', (live ? appear : o0) * (1 - e));
        L.rows.forEach((r, i) => {
          const dy = (L.y0 - r.y) * (1 - e);
          r.g.setAttribute('transform', dy ? `translate(0 ${dy})` : '');
          r.g.setAttribute('opacity', (live ? e : o0));
        });
        L.aP.setAttribute('transform', `translate(0 ${(L.rows[0].y - L.y0) * e})`);
        L.aQ.setAttribute('transform', `translate(0 ${(L.rows[1].y - L.y0) * e})`);
        [L.aP, L.aQ].forEach(a => a.setAttribute('opacity', live ? appear : o0));
        const g = live ? clamp(prog(t, b + 1.4, 0.3)) : o0;
        L.gP.setAttribute('opacity', g); L.gQ.setAttribute('opacity', g);
      } else if (k === 1) {
        // La question de contrôle, puis le A de la production se retourne en C
        L.row0.setAttribute('opacity', live ? appear : o0);
        rise(L.q, t, b + 0.3, 0.35);
        const f = live ? prog(t, b + 1.1, 0.5) : 1;
        L.aQ.setAttribute('opacity', live ? appear : o0);
        L.aP.setAttribute('opacity', (live ? appear : o0) * (f < 0.5 ? 1 : 0));
        L.cP.setAttribute('opacity', (live ? 1 : o0) * (f < 0.5 ? 0 : 1));
        scaleAt(L.aP, CP, L.y0, f < 0.5 ? Math.max(0.001, 1 - 2 * f) : 1, 1);
        scaleAt(L.cP, CP, L.y0, f >= 0.5 ? Math.max(0.001, 2 * f - 1) : 1, 1);
        L.gQ.setAttribute('opacity', live ? clamp(prog(t, b + 1.7, 0.3)) : o0);
      } else {
        // Les deux A s'effacent : case vide, deux noms, une date, on remonte
        L.row0.setAttribute('opacity', live ? appear : o0);
        const out = live ? clamp(prog(t, b + 0.6, 0.4)) : 1;
        [[L.aP, CP], [L.aQ, CQ]].forEach(([a, cx]) => {
          a.setAttribute('opacity', (live ? appear : o0) * (1 - out));
          a.setAttribute('transform', out > 0 && out < 1 ? `translate(${((CP + CQ) / 2 - cx) * easeOut(out)} 0)` : '');
        });
        pop(L.slot, t, b + 1.0, (CP + CQ) / 2, L.y0);
        rise(L.note, t, b + 1.3, 0.35);
        pop(L.up, t, b + 1.7, 1060, L.y0);
      }
    });
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
