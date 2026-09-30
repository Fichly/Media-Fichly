// Blog · Types de maintenance · section « Ce qu'un plan de maintenance change sur la disponibilité »
// Mécanique : quatre semaines de temps d'ouverture. Sans plan, six arrêts subis tombent n'importe quand et traînent
// leurs suites (aval désorganisé, urgence, non-qualité au redémarrage). Avec le plan, cinq des six interventions
// quittent la production et rejoignent un créneau programmé : même nombre d'interventions, beaucoup moins d'arrêts subis.
// Positions et durées illustratives (hypothèse). Rendu déterministe : boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const X0 = 64, X1 = 1136, DAYS = 20, DAY = (X1 - X0) / DAYS;
  const DUR = 0.5, SUITE = 0.45;                         // durée d'une intervention, de ses suites (en jours)
  const LA = { y: 236, h: 54 }, LB = { y: 446, h: 54 };
  const STOPS = [1.6, 3.4, 7.3, 11.7, 13.2, 17.5];       // arrêts subis (jour de survenue)
  const KEEP = 4;                                         // celui qui reste subi avec le plan
  const SLOTS = [0.15, 5.15, 5.15 + DUR, 10.15, 15.15]; // créneaux programmés (début de semaine)
  const T = { run0: 2.7, run1: 4.9, move0: 5.6, step: 0.45, fly: 0.8, chute: 10.6 };
  const GAUGE = { x: 300, w: 330, max: 0.3 };

  const S = {};
  const dx = d => X0 + d * DAY;

  function hatch(parent, x, y, w, h, fill, line) {
    const g = el('g', {}, parent);
    const cp = G.clipRect(x, y, w, h);
    const inner = el('g', { 'clip-path': cp.url }, g);
    el('rect', { x, y, width: w, height: h, fill }, inner);
    for (let k = -h; k < w; k += 9) el('line', { x1: x + k, y1: y + h, x2: x + k + h, y2: y, stroke: line, 'stroke-width': 2.5 }, inner);
    return g;
  }
  function timeline(L, label) {
    const g = el('g');
    el('rect', { x: X0, y: L.y, width: X1 - X0, height: L.h, rx: 10, fill: C.pGreen }, g);
    for (let d = 1; d < DAYS; d++) el('line', { x1: dx(d), y1: L.y + (d % 5 ? 14 : 0), x2: dx(d), y2: L.y + L.h - (d % 5 ? 14 : 0), stroke: C.white, 'stroke-width': d % 5 ? 2 : 5 }, g);
    for (let w = 0; w < 4; w++) text(g, dx(w * 5 + 2.5), L.y + L.h + 22, `semaine ${w + 1}`, { size: 16, weight: 600, fill: C.ink, anchor: 'middle' });
    return g;
  }
  function wrench(parent, cx, cy, fill, k = 1) {
    const g = el('g', { transform: `translate(${cx} ${cy}) rotate(-45) scale(${k})` }, parent);
    el('rect', { x: -3.5, y: -4, width: 7, height: 20, rx: 3, fill }, g);
    el('path', { d: 'M -9 -10 A 10 10 0 1 0 9 -10 L 4 -10 L 4 -4 L -4 -4 L -4 -10 Z', fill }, g);
    return g;
  }
  // Part des arrêts non planifiés (arrêt + suites) dans le temps d'ouverture
  const share = n => n * (DUR + SUITE) / DAYS;

  function build() {
    G.templateBlog();
    G.blogTitle('Arrêts subis,', 'arrêts choisis.');
    G.blogChapeau('Un bon plan ne réduit pas le nombre d’interventions : il les déplace.');
    G.card(40, 176, 1120, 576);

    // ----- Ligne A : sans plan -----
    S.headA = el('g');
    G.pill(S.headA, X0, 212, 'Sans plan', { size: 19, h: 34, bg: C.pRed, fg: C.tRed });
    text(S.headA, X0 + 128, 219, 'quatre semaines de temps d’ouverture', { size: 18, weight: 500, fill: C.ink });
    S.lineA = timeline(LA);
    // ----- Ligne B : avec plan -----
    S.headB = el('g');
    G.pill(S.headB, X0, 422, 'Avec un plan', { size: 19, h: 34, bg: C.pGreen, fg: C.tGreen });
    text(S.headB, X0 + 158, 429, 'mêmes interventions, au créneau programmé', { size: 18, weight: 500, fill: C.ink });
    S.lineB = timeline(LB);
    S.slots = el('g');
    [0.15, 5.15, 10.15, 15.15].forEach((d, i) => el('rect', { x: dx(d) - 3, y: LB.y + 5, width: (i === 1 ? 2 * DUR : DUR) * DAY + 6, height: LB.h - 10, rx: 7, fill: 'none', stroke: C.tGreen, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, S.slots));

    // Fantômes (ligne A) et arrêts mobiles
    S.stops = STOPS.map((d, i) => {
      const suite = hatch(G.svg, dx(d + DUR), LA.y + 4, SUITE * DAY, LA.h - 8, C.pRed, C.red);
      const suiteB = i === KEEP ? hatch(G.svg, dx(d + DUR), LB.y + 4, SUITE * DAY, LB.h - 8, C.pRed, C.red) : null;
      const g = el('g');
      const r = el('rect', { x: -DUR * DAY / 2, y: -(LA.h - 8) / 2, width: DUR * DAY, height: LA.h - 8, rx: 6, fill: C.red }, g);
      wrench(g, 0, 0, C.white, 0.8);
      const k = STOPS.slice(0, i).filter((_, j) => j !== KEEP).length;
      const to = i === KEEP ? d : SLOTS[k];
      return { d, i, suite, suiteB, g, r, from: { x: dx(d) + DUR * DAY / 2, y: LA.y + LA.h / 2 }, to: { x: dx(to) + DUR * DAY / 2, y: LB.y + LB.h / 2 }, keep: i === KEEP, tMove: T.move0 + T.step * (i > KEEP ? i - 1 : i) };
    });
    // un « double » de chaque arrêt reste sur la ligne A (l'état avant)
    S.stopsA = STOPS.map(d => {
      const g = el('g');
      el('rect', { x: dx(d), y: LA.y + 4, width: DUR * DAY, height: LA.h - 8, rx: 6, fill: C.red }, g);
      wrench(g, dx(d) + DUR * DAY / 2, LA.y + LA.h / 2, C.white, 0.8);
      return g;
    });

    // Indicateurs
    const indic = (y, L) => {
      const g = el('g');
      text(g, X0, y + 6, 'Arrêts non planifiés', { size: 18, weight: 700, fill: C.tRed });
      el('rect', { x: GAUGE.x - 20 + 0, y: y - 8, width: GAUGE.w, height: 16, rx: 8, fill: C.pRed, opacity: 0.6 }, g);
      const bar = el('rect', { x: GAUGE.x - 20, y: y - 8, width: 0, height: 16, rx: 8, fill: C.red }, g);
      text(g, GAUGE.x - 20 + GAUGE.w + 14, y + 6, 'du temps d’ouverture', { size: 16, weight: 500, fill: C.ink });
      const cnt = text(g, X1, y + 7, '', { size: 20, weight: 700, fill: C.blue, anchor: 'end' });
      return { g, bar, cnt };
    };
    S.indA = indic(346, LA);
    S.indB = indic(556, LB);
    S.same = el('g');
    const sp = G.pill(S.same, 0, 556, 'inchangé', { size: 16, h: 28, pad: 10, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
    S.sameW = sp.w;

    // Légende : même intervention, même durée
    S.legend = el('g');
    el('line', { x1: X0, y1: 598, x2: X1, y2: 598, stroke: C.line, 'stroke-width': 2 }, S.legend);
    text(S.legend, X0, 634, 'À durée égale, l’arrêt subi coûte davantage :', { size: 19, weight: 700, fill: C.ink });
    const lx = X0, ly = 662;
    el('rect', { x: lx, y: ly, width: DUR * DAY * 1.4, height: 36, rx: 6, fill: C.red }, S.legend);
    wrench(S.legend, lx + DUR * DAY * 0.7, ly + 18, C.white, 0.8);
    hatch(S.legend, lx + DUR * DAY * 1.4, ly, SUITE * DAY * 1.4, 36, C.pRed, C.red);
    const reasons = ['il tombe au mauvais moment', 'il désorganise l’aval', 'il mobilise dans l’urgence', 'non-qualité au redémarrage'];
    reasons.forEach((s, i) => {
      const x = lx + 120 + (i % 2) * 272, y = ly + 12 + Math.floor(i / 2) * 26;
      el('circle', { cx: x, cy: y - 5, r: 4, fill: C.red }, S.legend);
      text(S.legend, x + 12, y, s, { size: 16, weight: 500, fill: C.ink });
    });
    const gx = 800;
    el('rect', { x: gx, y: ly, width: DUR * DAY * 1.4, height: 36, rx: 6, fill: C.green }, S.legend);
    wrench(S.legend, gx + DUR * DAY * 0.7, ly + 18, C.white, 0.8);
    text(S.legend, gx + DUR * DAY * 1.4 + 14, ly + 14, 'arrêt choisi :', { size: 16, weight: 700, fill: C.tGreen });
    text(S.legend, gx + DUR * DAY * 1.4 + 14, ly + 38, 'préparé, au bon moment', { size: 16, weight: 500, fill: C.ink });

    S.chute = G.blogChute('C’est cette bascule qui produit le gain.', { y: 806 });
  }

  const mix = (a, b, p) => {
    const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
    const A = h(a), B = h(b);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',')})`;
  };

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    pop(S.headA, t, 1.75, 200, 212);
    S.lineA.setAttribute('opacity', live ? clamp(prog(t, 1.9, 0.3)) : o);
    pop(S.headB, t, 2.1, 220, 422);
    S.lineB.setAttribute('opacity', live ? clamp(prog(t, 2.25, 0.3)) : o);
    S.slots.setAttribute('opacity', live ? clamp(prog(t, 2.4, 0.3)) : o);
    S.legend.setAttribute('opacity', live ? clamp(prog(t, 2.5, 0.4)) : o);

    // Ligne A : les arrêts surviennent au fil des semaines (balayage)
    const tA = d => T.run0 + (T.run1 - T.run0) * d / DAYS;
    let nA = 0, nB = 0, subB = 0;
    S.stops.forEach((s, i) => {
      const ta = tA(s.d);
      const on = live ? t >= ta : true;
      if (on) nA++;
      S.stopsA[i].setAttribute('opacity', live ? clamp(prog(t, ta, 0.2)) : o);
      s.suite.setAttribute('opacity', live ? clamp(prog(t, ta + 0.15, 0.25)) : o);
      if (live && t >= ta && t < ta + 0.6) pulse(S.stopsA[i], t, ta, s.from.x, s.from.y, 0.18, 0.35);
      else S.stopsA[i].setAttribute('transform', '');

      // Déplacement vers la ligne B
      const p = live ? prog(t, s.tMove, T.fly) : 1;
      const e = easeInOut(p);
      const x = s.from.x + (s.to.x - s.from.x) * e, y = s.from.y + (s.to.y - s.from.y) * e;
      s.g.setAttribute('transform', `translate(${x} ${y})`);
      s.g.setAttribute('opacity', live ? (p > 0 && p < 1 ? 1 : p >= 1 ? 1 : 0) : o);
      s.r.setAttribute('fill', s.keep ? C.red : mix(C.red, C.green, clamp((p - 0.3) / 0.5)));
      if (s.suiteB) s.suiteB.setAttribute('opacity', live ? clamp(prog(t, s.tMove + T.fly, 0.25)) : o);
      if (!live || p >= 1) { nB++; if (s.keep) subB++; }
    });
    // Compteurs et jauges
    const shareA = live ? share(nA) : share(6);
    S.indA.bar.setAttribute('width', Math.max(0.001, GAUGE.w * shareA / GAUGE.max));
    S.indA.cnt.textContent = `${nA}${NB}intervention${nA > 1 ? 's' : ''}`;
    const shareB = live ? share(subB) : share(1);
    S.indB.bar.setAttribute('width', Math.max(0.001, GAUGE.w * shareB / GAUGE.max));
    S.indB.cnt.textContent = nB ? `${nB}${NB}intervention${nB > 1 ? 's' : ''}` : '';
    S.indA.g.setAttribute('opacity', live ? clamp(prog(t, T.run0 - 0.2, 0.3)) : o);
    S.indB.g.setAttribute('opacity', live ? clamp(prog(t, T.move0, 0.3)) : o);
    // « inchangé » à gauche du compteur B, quand les six sont arrivées
    const cb = measure(S.indB.cnt);
    const last = Math.max(...S.stops.map(s => s.tMove)) + T.fly;
    S.same.setAttribute('transform', `translate(${cb.x - 12 - S.sameW} 0)`);
    S.same.setAttribute('opacity', live ? clamp(prog(t, last + 0.1, 0.3)) : o);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
