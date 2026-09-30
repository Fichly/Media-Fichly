// Blog · 5 pourquoi · section « Quand une réponse en contient deux : brancher l'analyse »
// Mécanique : une réponse contient un « et » ; on n'arbitre pas, on ouvre deux chaînes. Chacune descend jusqu'à son
// propre critère d'arrêt (3 niveaux d'un côté, 6 de l'autre). On arbitre à la fin, sur la part des occurrences
// expliquée (70 / 30 : hypothèse illustrative), et la branche B est notée, pas effacée.
// Refait en animé l'image existante « 5 pourquoi - Chaîne causale ». Boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const CX = 395;
  const BR = [
    { x: 190, n: 3, color: C.lightBlue, name: 'Branche A', share: 70 },
    { x: 600, n: 6, color: C.violet, name: 'Branche B', share: 30 },
  ];
  const NODE_Y = i => 406 + 56 * i;
  const P = { x: 764, w: 372 };           // panneau de la règle
  const T = {
    pb: 1.8, why: 2.2, ans: 2.5, et: 2.95, split: 3.5, heads: 3.8,
    node0: 4.5, step: 0.5, rule: [2.9, 4.4, 8.0], bars: 8.3, decA: 9.4, decB: 9.8, chute: 10.8,
  };
  const stopT = b => T.node0 + T.step * (b.n - 1) + 0.45;

  function build() {
    G.templateBlog();
    G.blogTitle('Une réponse,', 'deux branches.');
    G.blogChapeau('Si une réponse contient un « et », ouvrez deux chaînes. Arbitrez à la fin.');
    G.card(40, 176, 1120, 584);

    // Problème et première question
    S.pb = el('g');
    G.pill(S.pb, CX, 206, 'Un défaut qui revient', { size: 19, h: 36, bg: C.pRed, fg: C.tRed, icon: 'cross', anchor: 'middle' });
    S.why = el('g');
    S.whyA = G.arrow(S.why, `M ${CX} 226 L ${CX} 246`, { width: 3, head: 8 });
    text(S.why, CX + 14, 242, 'pourquoi ?', { size: 16, weight: 700, fill: C.blue });

    // La réponse qui en contient deux
    S.ans = el('g');
    el('rect', { x: CX - 230, y: 250, width: 460, height: 54, rx: 14, fill: C.white, stroke: C.line, 'stroke-width': 2 }, S.ans);
    const parts = [['Réponse :', C.ink, 500], ['cause A', C.lightBlue, 700], ['et', C.ink, 800], ['cause B', C.violet, 700]];
    const nodes = parts.map(([s, f, w]) => text(S.ans, 0, 285, s, { size: 21, weight: w, fill: f }));
    const gap = 10;
    const widths = nodes.map(n => measure(n).width);
    let x = CX - (widths.reduce((a, b) => a + b, 0) + gap * 3) / 2;
    nodes.forEach((n, i) => { n.setAttribute('x', x); if (i === 2) S.etX = x + widths[i] / 2; x += widths[i] + gap; });
    S.etHl = el('rect', { x: S.etX - widths[2] / 2 - 7, y: 262, width: widths[2] + 14, height: 32, rx: 8, fill: C.yellow, opacity: 0.45 });
    S.ans.insertBefore(S.etHl, nodes[0]);

    // Bifurcation, têtes de branches
    S.split = BR.map(b => {
      const g = el('g');
      const a = G.arrow(g, `M ${CX} 307 C ${CX} 322 ${b.x} 318 ${b.x} 334`, { width: 3, head: 8 });
      return { g, a };
    });
    S.heads = BR.map(b => {
      const g = el('g');
      G.pill(g, b.x, 352, b.name, { size: 18, h: 32, pad: 14, bg: b.color, fg: C.white, anchor: 'middle' });
      return g;
    });

    // Nœuds de chaque branche
    S.br = BR.map((b, j) => {
      const g = el('g');
      const nodes = [];
      for (let i = 0; i < b.n; i++) {
        const ng = el('g', {}, g);
        if (i > 0) el('line', { x1: b.x, y1: NODE_Y(i - 1) + 18, x2: b.x, y2: NODE_Y(i) - 18, stroke: b.color, 'stroke-width': 3, 'stroke-linecap': 'round' }, ng);
        else el('line', { x1: b.x, y1: 370, x2: b.x, y2: NODE_Y(0) - 18, stroke: b.color, 'stroke-width': 3, 'stroke-linecap': 'round' }, ng);
        el('circle', { cx: b.x, cy: NODE_Y(i), r: 16, fill: b.color }, ng);
        text(ng, b.x, NODE_Y(i) + 5.5, String(i + 1), { size: 16, weight: 700, fill: C.white, anchor: 'middle' });
        nodes.push(ng);
      }
      const stop = el('g', {}, g);
      const yl = NODE_Y(b.n - 1);
      if (j === 0) {
        G.check(stop, b.x + 40, yl, 12);
        text(stop, b.x + 60, yl + 6, `mécanisme atteint en ${b.n} niveaux`, { size: 17, weight: 700, fill: C.tGreen });
      } else {
        G.check(stop, b.x - 40, yl, 12);
        const tt = text(stop, b.x - 60, yl + 6, `mécanisme atteint en ${b.n} niveaux`, { size: 17, weight: 700, fill: C.tGreen, anchor: 'end' });
        fit(tt, b.x, 'arrêt B', 60);
      }
      return { g, nodes, stop };
    });
    S.noted = el('g');
    G.pill(S.noted, BR[1].x + 62, 352, 'notée', { size: 17, h: 30, pad: 12, bg: C.pLav, fg: C.blue });

    // ----- Panneau : la règle en trois points -----
    S.rules = [
      'Un « et » : ouvrez deux chaînes, sans arbitrer.',
      'Suivez chaque branche jusqu’à son propre arrêt.',
      'Arbitrez à la fin, sur la part des occurrences expliquée.',
    ].map((s, i) => {
      const g = el('g');
      const y = 196 + 84 * i;
      const bg = el('rect', { x: P.x, y, width: P.w, height: 72, rx: 14, fill: C.pLav }, g);
      G.badgeNum(g, P.x + 28, y + 36, i + 1, 16);
      const p = G.para(g, P.x + 54, y + 30, s, P.w - 68, { size: 17, weight: 500, fill: C.ink, lh: 1.25 });
      p.t.setAttribute('transform', `translate(0 ${p.n === 1 ? 11 : 0})`);
      fit(p.t, P.x + P.w - 8, `règle ${i + 1}`);
      return { g, bg, y };
    });

    // Barres : part des occurrences expliquée
    S.barHead = text(G.svg, P.x, 476, 'Part des occurrences expliquée', { size: 17, weight: 700, fill: C.ink });
    S.bars = BR.map((b, i) => {
      const g = el('g');
      const y = 492 + 46 * i;
      text(g, P.x, y + 23, i ? 'B' : 'A', { size: 19, weight: 700, fill: b.color });
      el('rect', { x: P.x + 26, y, width: 290, height: 32, rx: 8, fill: C.pLav }, g);
      const bar = el('rect', { x: P.x + 26, y, width: 0, height: 32, rx: 8, fill: b.color }, g);
      const val = text(g, P.x + 26 + 290 + 10, y + 23, '', { size: 18, weight: 700, fill: C.ink });
      return { g, bar, val, share: b.share };
    });
    S.decA = el('g');
    G.pill(S.decA, P.x, 610, 'A : on la traite d’abord', { size: 18, h: 36, pad: 14, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
    S.decB = el('g');
    G.pill(S.decB, P.x, 658, 'B : notée, pas effacée', { size: 18, h: 36, pad: 14, bg: C.pLav, fg: C.blue });

    S.chute = G.blogChute('Une branche abandonnée sans trace revient six mois plus tard.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!»])/g, ' $1').replace(/« /g, '« ');
    });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.pb, t, T.pb, CX, 206);
    const qw = live ? prog(t, T.why, 0.3) : 1;
    S.whyA.draw(qw);
    S.why.setAttribute('opacity', live ? (qw > 0 ? 1 : 0) : o);
    pop(S.ans, t, T.ans, CX, 277);
    if (live && t >= T.et && t < T.et + 0.8) pulse(S.etHl, t, T.et, S.etX, 278, 0.35, 0.5);
    S.etHl.setAttribute('opacity', live && t >= T.et && t < T.et + 0.5 ? 0.8 : 0.45);

    // Bifurcation : on ouvre deux chaînes
    S.split.forEach((s, i) => {
      const q = live ? prog(t, T.split + 0.08 * i, 0.35) : 1;
      s.a.draw(q);
      s.g.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
    });
    S.heads.forEach((h, i) => pop(h, t, T.heads + 0.1 * i, BR[i].x, 352));

    // Les deux branches descendent chacune à son rythme jusqu'à leur arrêt
    S.br.forEach((b, j) => {
      b.nodes.forEach((ng, i) => pop(ng, t, T.node0 + T.step * i, BR[j].x, NODE_Y(i)));
      pop(b.stop, t, stopT(BR[j]), BR[j].x + (j ? -120 : 120), NODE_Y(BR[j].n - 1));
      // Branche B : estompée une fois notée (elle reste visible)
      const dim = live ? 1 - 0.45 * (j === 1 ? clamp(prog(t, T.decB, 0.4)) : 0) : (j === 1 ? 0.55 : 1);
      b.g.setAttribute('opacity', dim);
    });
    pop(S.noted, t, T.decB + 0.15, BR[1].x + 95, 352);

    // Panneau : la règle, point par point
    S.rules.forEach((r, i) => {
      pop(r.g, t, T.rule[i] - 0.3, P.x + P.w / 2, r.y + 36);
      const on = live && t >= T.rule[i] && t < (i < 2 ? T.rule[i + 1] : T.decB + 0.6);
      r.bg.setAttribute('fill', on ? C.pYellow : C.pLav);
    });
    S.barHead.setAttribute('opacity', live ? clamp(prog(t, T.bars - 0.3, 0.3)) : o);
    S.bars.forEach((b, i) => {
      const p = live ? easeInOut(prog(t, T.bars + 0.15 * i, 0.8)) : 1;
      const v = b.share * p;
      b.bar.setAttribute('width', Math.max(0.001, 290 * v / 100));
      b.val.textContent = `${Math.round(v)} %`;
      b.g.setAttribute('opacity', live ? clamp(prog(t, T.bars - 0.3, 0.3)) : o);
    });
    pop(S.decA, t, T.decA, P.x + 120, 610);
    pop(S.decB, t, T.decB, P.x + 110, 658);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
