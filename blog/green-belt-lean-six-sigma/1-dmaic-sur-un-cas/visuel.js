// Blog · Green Belt Lean Six Sigma · section « Que fait concrètement un Green Belt au quotidien ? »
// Mécanique : le cas de l'article (une quarantaine de minutes perdues à chaque changement de série) traverse les
// cinq étapes. Définir : le périmètre se dessine. Mesurer : le chronomètre remplit la barre du temps de changement.
// Analyser : l'équipe remonte à la cause. Améliorer : les outils sont rangés au poste, la part rouge disparaît.
// Contrôler : le standard est figé et l'aiguille du TRS monte.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  const STEPS = [
    { l: 'D', t: 2.4, title: 'Définir', sub: 'Cadrer le problème, l’objectif, le périmètre.' },
    { l: 'M', t: 4.3, title: 'Mesurer', sub: 'Chronométrer les pertes.' },
    { l: 'A', t: 6.3, title: 'Analyser', sub: 'Remonter aux causes avec l’équipe.' },
    { l: 'I', t: 8.3, title: 'Améliorer', sub: 'Tester une nouvelle organisation des outils.' },
    { l: 'C', t: 10.4, title: 'Contrôler', sub: 'Figer le nouveau standard.' },
  ];
  const STEP_END = 12.4, CHUTE_T = 12.9;
  const BAR = { x: 530, y: 452, w: 540, h: 34, red: 0.45 };
  const FRAME = { x: 488, y: 244, w: 420, h: 130 };
  const MEAS = { t0: 4.6, t1: 5.9 };
  const SHRINK = { t0: 9.1, d: 0.8 };
  const GAUGE = { cx: 1080, cy: 648, r: 46 };
  const NEEDLE = { a0: -150, a1: -45, t: 11.1, d: 0.9 };   // angles (degrés), illustratifs

  function stopwatch(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: cy + 2, r: 15, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
    el('rect', { x: cx - 4, y: cy - 18, width: 8, height: 5, rx: 2, fill: C.blue }, g);
    const hand = el('line', { x1: cx, y1: cy + 2, x2: cx, y2: cy - 8, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    return { g, hand };
  }
  function person(parent, x, y) {
    el('circle', { cx: x, cy: y - 14, r: 8, fill: C.lightBlue }, parent);
    el('rect', { x: x - 11, y: y - 4, width: 22, height: 20, rx: 8, fill: C.lightBlue }, parent);
  }
  function tools(parent, x, y, shadow) {
    const c = k => shadow || k;
    el('rect', { x: x - 4, y: y - 26, width: 8, height: 46, rx: 3, fill: c(C.yellow) }, parent);
    el('rect', { x: x - 18, y: y - 36, width: 36, height: 14, rx: 4, fill: c(C.ink) }, parent);
    el('rect', { x: x + 40, y: y - 16, width: 10, height: 44, rx: 5, fill: c(C.lightBlue) }, parent);
    el('circle', { cx: x + 45, cy: y - 24, r: 12, fill: c(C.lightBlue) }, parent);
    el('rect', { x: x + 86, y: y - 30, width: 6, height: 34, rx: 2, fill: c(C.ink) }, parent);
    el('rect', { x: x + 81, y: y + 2, width: 16, height: 28, rx: 6, fill: c(C.red) }, parent);
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le DMAIC', 'sur un cas réel.');
    G.blogChapeau('Sur la ligne, chaque changement de série fait perdre une quarantaine de minutes.');

    // ---------- Les cinq étapes ----------
    G.card(40, 176, 400, 560);
    el('line', { x1: 78, y1: 232, x2: 78, y2: 648, stroke: C.line, 'stroke-width': 5, 'stroke-linecap': 'round' });
    S.progress = el('line', { x1: 78, y1: 232, x2: 78, y2: 648, stroke: C.green, 'stroke-width': 5, 'stroke-linecap': 'round' });
    S.steps = STEPS.map((s, i) => {
      const cy = 232 + 104 * i;
      const hl = el('rect', { x: 54, y: cy - 34, width: 374, height: 92, rx: 16, fill: C.pLav, opacity: 0 });
      const g = el('g');
      const todo = el('g', {}, g);
      el('circle', { cx: 78, cy, r: 20, fill: C.blue }, todo);
      text(todo, 78, cy + 8, s.l, { size: 21, weight: 800, fill: C.white, anchor: 'middle' });
      const done = el('g', { opacity: 0 }, g);
      G.check(done, 78, cy, 20);
      fit(text(g, 112, cy + 8, s.title, { size: 22, weight: 700, fill: C.ink }), 420, `étape ${i}`);
      G.para(g, 112, cy + 35, s.sub, 300, { size: 16, weight: 500, fill: C.ink, lh: 1.25 });
      return { g, hl, todo, done, cy };
    });

    // ---------- Le cas ----------
    G.card(460, 176, 700, 560);
    // Définir : objectif et périmètre
    S.obj = el('g');
    G.pill(S.obj, 488, 214, 'Objectif : réduire le temps de changement de série', { size: 17, h: 34, pad: 14, bg: C.pLav, fg: C.blue });
    S.line = el('g');
    el('line', { x1: 506, y1: 350, x2: 890, y2: 350, stroke: C.line, 'stroke-width': 5, 'stroke-linecap': 'round' }, S.line);
    G.machine(S.line, 540, 288, 0.5);
    G.machine(S.line, 740, 288, 0.5);
    [650, 682, 714].forEach(x => G.carton(S.line, x, 334, 0.7));
    S.frame = el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 18, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-dasharray': '9 7' });
    S.frameTag = el('g');
    text(S.frameTag, FRAME.x + 14, FRAME.y + FRAME.h - 10 + 32, 'Périmètre : la ligne d’assemblage', { size: 15, weight: 600, fill: C.blue });
    // Améliorer : tableau d'outils au poste
    S.board = el('g');
    el('rect', { x: 942, y: 250, width: 190, height: 108, rx: 12, fill: '#e6e6f2' }, S.board);
    tools(S.board, 978, 310);
    text(S.board, 1037, 396, 'Outils rangés au poste', { size: 15, weight: 600, fill: C.tGreen, anchor: 'middle' });

    // Mesurer : la barre du temps de changement
    S.meas = el('g');
    S.watch = stopwatch(S.meas, 500, BAR.y + 16);
    text(S.meas, BAR.x, BAR.y - 14, 'Temps d’un changement de série', { size: 17, weight: 700, fill: C.ink });
    S.ghost = el('g', {}, S.meas);
    el('rect', { x: BAR.x - 3, y: BAR.y - 3, width: BAR.w + 6, height: BAR.h + 6, rx: 9, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0.45 }, S.ghost);
    S.segRed = el('rect', { y: BAR.y, height: BAR.h, rx: 6, fill: C.red }, S.meas);
    S.segBlue = el('rect', { y: BAR.y, height: BAR.h, rx: 6, fill: C.blue }, S.meas);
    S.total = el('g', {}, S.meas);
    text(S.total, BAR.x + BAR.w, BAR.y - 14, 'environ 40 min', { size: 17, weight: 700, fill: C.tRed, anchor: 'end' });
    S.after = el('g', {}, S.meas);
    text(S.after, BAR.x + BAR.w * (1 - BAR.red) + 10, BAR.y + 23, 'après', { size: 16, weight: 700, fill: C.tGreen });
    S.legend = el('g', {}, S.meas);
    el('rect', { x: BAR.x, y: BAR.y + 50, width: 16, height: 16, rx: 4, fill: C.red }, S.legend);
    text(S.legend, BAR.x + 24, BAR.y + 64, 'recherche des outils', { size: 16, weight: 600, fill: C.ink });
    el('rect', { x: BAR.x + 220, y: BAR.y + 50, width: 16, height: 16, rx: 4, fill: C.blue }, S.legend);
    text(S.legend, BAR.x + 244, BAR.y + 64, 'le changement lui-même', { size: 16, weight: 600, fill: C.ink });

    // Analyser : l'équipe et la cause
    S.team = el('g');
    [506, 536, 566].forEach(x => person(S.team, x, 636));
    S.causeArrow = G.arrow(G.svg, `M ${BAR.x + BAR.w * BAR.red / 2} ${BAR.y + BAR.h + 6} L ${BAR.x + BAR.w * BAR.red / 2} ${BAR.y + 44}`, { width: 3, head: 8, stroke: C.red });
    S.cause = el('g');
    el('rect', { x: 594, y: 590, width: 250, height: 76, rx: 14, fill: C.pRed }, S.cause);
    text(S.cause, 610, 618, 'Cause', { size: 15, weight: 700, fill: C.tRed });
    G.para(S.cause, 610, 642, 'Les outils sont loin de la ligne', 226, { size: 16, weight: 700, fill: C.ink, lh: 1.2 });

    // Contrôler : standard figé et TRS
    S.std = el('g');
    el('rect', { x: 872, y: 598, width: 44, height: 56, rx: 6, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, S.std);
    [0, 1, 2].forEach(r => el('line', { x1: 882, y1: 614 + r * 10, x2: 906, y2: 614 + r * 10, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.std));
    G.check(S.std, 912, 650, 11);
    G.para(S.std, 894, 684, 'Nouveau standard', 120, { size: 15, weight: 600, fill: C.ink, anchor: 'middle', lh: 1.2 });
    S.trs = el('g');
    el('path', { d: `M ${GAUGE.cx - GAUGE.r} ${GAUGE.cy} A ${GAUGE.r} ${GAUGE.r} 0 0 1 ${GAUGE.cx + GAUGE.r} ${GAUGE.cy}`, fill: 'none', stroke: C.line, 'stroke-width': 12, 'stroke-linecap': 'round' }, S.trs);
    el('path', { d: `M ${GAUGE.cx + GAUGE.r * Math.cos(-50 * Math.PI / 180)} ${GAUGE.cy + GAUGE.r * Math.sin(-50 * Math.PI / 180)} A ${GAUGE.r} ${GAUGE.r} 0 0 1 ${GAUGE.cx + GAUGE.r} ${GAUGE.cy}`, fill: 'none', stroke: C.green, 'stroke-width': 12, 'stroke-linecap': 'round' }, S.trs);
    S.needle = el('line', { x1: GAUGE.cx, y1: GAUGE.cy, x2: GAUGE.cx + GAUGE.r - 14, y2: GAUGE.cy, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.trs);
    el('circle', { cx: GAUGE.cx, cy: GAUGE.cy, r: 6, fill: C.ink }, S.trs);
    text(S.trs, GAUGE.cx, GAUGE.cy + 36, 'Le résultat se lit', { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
    text(S.trs, GAUGE.cx, GAUGE.cy + 54, 'dans le TRS', { size: 15, weight: 700, fill: C.ink, anchor: 'middle' });

    S.chute = G.blogChute('Comprendre le problème avant de foncer sur une solution.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    rise(S.line, t, 1.9, 0.4, 10);
    // Définir
    const flen = 2 * (FRAME.w + FRAME.h);
    const fq = live ? easeOut(prog(t, STEPS[0].t + 0.2, 0.6)) : 1;
    S.frame.setAttribute('stroke-dasharray', fq >= 1 ? '9 7' : `${flen} ${flen}`);
    S.frame.setAttribute('stroke-dashoffset', fq >= 1 ? 0 : flen * (1 - fq));
    S.frame.setAttribute('opacity', live ? 1 : o);
    rise(S.frameTag, t, STEPS[0].t + 0.7, 0.35, 8);
    pop(S.obj, t, STEPS[0].t + 1.0, 700, 214, 0.35);

    // Mesurer : le chronomètre tourne, la barre se remplit
    rise(S.meas, t, STEPS[1].t, 0.35, 8);
    const mq = live ? prog(t, MEAS.t0, MEAS.t1 - MEAS.t0) : 1;
    const wa = live ? 720 * mq : 0;
    S.watch.hand.setAttribute('transform', wa === 0 || wa === 720 ? '' : `rotate(${wa} 500 ${BAR.y + 18})`);
    // Améliorer : la part rouge disparaît
    const sq = live ? easeInOut(prog(t, SHRINK.t0, SHRINK.d)) : 1;
    const redW = BAR.w * BAR.red * (1 - sq), blueW = BAR.w * (1 - BAR.red);
    const filled = BAR.w * mq;                        // pendant la mesure, la barre se remplit de gauche à droite
    const rw = Math.min(filled, redW), bw = Math.max(0, Math.min(filled - BAR.w * BAR.red, blueW));
    S.segRed.setAttribute('x', BAR.x);
    S.segRed.setAttribute('width', Math.max(0, rw - 3));
    S.segBlue.setAttribute('x', BAR.x + redW);
    S.segBlue.setAttribute('width', Math.max(0, bw));
    S.total.setAttribute('opacity', live ? clamp(prog(t, MEAS.t1, 0.3)) : 1);
    S.ghost.setAttribute('opacity', live ? clamp(prog(t, SHRINK.t0, 0.3)) : 1);
    S.after.setAttribute('opacity', live ? clamp(prog(t, SHRINK.t0 + SHRINK.d, 0.3)) : 1);
    S.legend.setAttribute('opacity', live ? clamp(prog(t, MEAS.t1, 0.3)) : 1);

    // Analyser
    rise(S.team, t, STEPS[2].t + 0.2, 0.35, 8);
    S.causeArrow.draw(live ? easeOut(prog(t, STEPS[2].t + 0.6, 0.35)) : 1);
    S.causeArrow.g.setAttribute('opacity', live ? (t < SHRINK.t0 ? 1 : 1 - clamp(prog(t, SHRINK.t0, 0.3))) : 0);
    rise(S.cause, t, STEPS[2].t + 0.9, 0.4, 10);
    if (live && t >= STEPS[2].t + 0.4 && t < STEPS[2].t + 1.1) pulse(S.segRed, t, STEPS[2].t + 0.4, BAR.x + BAR.w * BAR.red / 2, BAR.y + BAR.h / 2, 0.08, 0.5);
    else S.segRed.setAttribute('transform', '');

    // Améliorer : tableau d'outils
    pop(S.board, t, STEPS[3].t + 0.3, 1037, 304, 0.4);

    // Contrôler
    pop(S.std, t, STEPS[4].t + 0.3, 894, 626, 0.35);
    rise(S.trs, t, STEPS[4].t + 0.5, 0.35, 8);
    const na = live ? NEEDLE.a0 + (NEEDLE.a1 - NEEDLE.a0) * easeInOut(prog(t, NEEDLE.t, NEEDLE.d)) : NEEDLE.a1;
    S.needle.setAttribute('transform', `rotate(${na} ${GAUGE.cx} ${GAUGE.cy})`);

    // Les étapes
    let done = 0;
    S.steps.forEach((s, i) => {
      const t0 = STEPS[i].t, t1 = i < 4 ? STEPS[i + 1].t : STEP_END;
      rise(s.g, t, 1.8 + 0.08 * i, 0.35, 8);
      s.hl.setAttribute('opacity', live ? G.window01(t, t0 - 0.1, t1 - 0.1, 0.2) : 0);
      const d = live ? clamp(prog(t, t1 - 0.2, 0.2)) : 1;
      s.done.setAttribute('opacity', d * o);
      s.todo.setAttribute('opacity', 1 - d);
      if (d >= 1) done = i + 1;
    });
    S.progress.setAttribute('y2', live ? (done > 1 ? 232 + 104 * (done - 1) : 232) : 648);
    S.progress.setAttribute('opacity', o);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
