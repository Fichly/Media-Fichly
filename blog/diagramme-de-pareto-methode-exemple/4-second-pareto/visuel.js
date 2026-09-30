// Blog · Diagramme de Pareto · section « Les erreurs qui faussent un diagramme de Pareto »
// Mécanique : la boucle PDCA autour du Pareto. Plan : on cible la première barre. Do : actions, vingt jours passent.
// Check : second Pareto, même unité, même durée ; l'ancien tracé reste en pointillés, la barre du bourrage retombe.
// Act : le nouveau classement se trie, une autre cause passe en tête et devient la cible suivante.
// Données : premier relevé de l'article (occurrences sur vingt jours). Hypothèse : second relevé illustratif
// (bourrage 88 → 24, autres causes inchangées).
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const CAUSES = [
    { name: 'Bourrage en sortie d’étiqueteuse', v0: 88, v1: 24 },
    { name: 'Changement de bobine film', v0: 46, v1: 46 },
    { name: 'Réglage de la dateuse', v0: 30, v1: 30 },
    { name: 'Manque de cartons au poste', v0: 18, v1: 18 },
    { name: 'Arrêt sur capteur de sécurité', v0: 12, v1: 12 },
    { name: 'Panne du convoyeur', v0: 6, v1: 6 },
  ];
  const ORDER1 = CAUSES.map((c, i) => i).sort((a, b) => CAUSES[b].v1 - CAUSES[a].v1);
  const CH = { x0: 80, slot: 124, bw: 80, base: 660, k: 4.0 };
  const sx = j => CH.x0 + CH.slot * (j + 0.5);
  const WHEEL = { cx: 1000, cy: 440, r: 110 };
  const PHASES = [
    { key: 'Plan', txt: ['Cibler la', 'première barre'] },
    { key: 'Do', txt: ['Agir sur', 'le bourrage'] },
    { key: 'Check', txt: ['Second Pareto :', 'même unité, même durée'] },
    { key: 'Act', txt: ['Nouveau classement :', 'viser la barre suivante'] },
  ];
  const T = { axes: 1.8, bars: 2.0, wheel: 2.9, plan: 3.4, do: 5.0, days: 5.4, check: 7.4, ghost: 7.5, grow: 7.9, delta: 9.0, act: 10.2, sort: 10.5, next: 11.5, chute: 12.4 };
  const PH_T = [T.plan, T.do, T.check, T.act];
  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Même unité,', 'même durée.');
    G.blogChapeau('Un second Pareto après les actions : la seule preuve que la première barre a baissé.');
    G.card(40, 176, 1120, 584);

    // Légende et axe
    S.axes = el('g');
    el('line', { x1: CH.x0, y1: CH.base, x2: CH.x0 + 6 * CH.slot, y2: CH.base, stroke: C.ink, 'stroke-width': 2.5 }, S.axes);
    text(S.axes, CH.x0, 214, 'Arrêts, en occurrences', { size: 16, weight: 700, fill: C.ink });
    S.leg = el('g');
    el('rect', { x: 846, y: 200, width: 26, height: 18, rx: 4, fill: 'none', stroke: C.blue, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, S.leg);
    text(S.leg, 880, 215, 'Relevé 1 : vingt jours', { size: 16, weight: 500, fill: C.ink });
    fit(S.leg.lastChild, 1150, 'légende 1');
    S.leg2 = el('g');
    el('rect', { x: 846, y: 228, width: 26, height: 18, rx: 4, fill: C.blue }, S.leg2);
    fit(text(S.leg2, 880, 243, 'Relevé 2 : vingt jours de plus', { size: 16, weight: 700, fill: C.ink }), 1150, 'légende 2');

    // Barres : fantôme (relevé 1) et barre pleine
    S.bars = CAUSES.map((c, i) => {
      const g = el('g');
      const h0 = c.v0 * CH.k, h1 = c.v1 * CH.k;
      const ghost = el('rect', { x: -CH.bw / 2, y: CH.base - h0, width: CH.bw, height: h0, rx: 5, fill: 'none', stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, g);
      const bar = el('rect', { x: -CH.bw / 2, width: CH.bw, rx: 5, fill: C.blue }, g);
      const val = text(g, 0, 0, '', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      const lab = G.para(g, 0, CH.base + 22, c.name, CH.slot - 8, { size: 15, weight: 500, fill: C.ink, anchor: 'middle', lh: 1.2 });
      if (lab.n > 3) console.error(`Étiquette sur ${lab.n} lignes : ${c.name}`);
      return { g, ghost, bar, val, h0, h1, i, j0: i, j1: ORDER1.indexOf(i) };
    });
    // Cible, actions, écart
    S.target = el('g');
    G.pill(S.target, sx(0), CH.base - 88 * CH.k - 42, 'cible', { size: 16, h: 30, pad: 12, bg: C.red, fg: C.white, anchor: 'middle' });
    S.action = el('g');
    G.pill(S.action, sx(1) + 10, 330, 'Actions sur le bourrage', { size: 17, h: 34, bg: C.pYellow, fg: C.tYellow });
    S.daysBar = el('g');
    el('rect', { x: sx(1) + 10, y: 362, width: 250, height: 10, rx: 5, fill: C.line }, S.daysBar);
    S.daysFill = el('rect', { x: sx(1) + 10, y: 362, width: 0, height: 10, rx: 5, fill: C.yellow }, S.daysBar);
    S.daysTxt = text(S.daysBar, sx(1) + 270, 372, '', { size: 16, weight: 700, fill: C.tYellow });
    S.delta = el('g');
    const dA = text(S.delta, -22, 0, '88', { size: 18, weight: 800, fill: C.ink, anchor: 'middle' });
    const dB = text(S.delta, 26, 0, '24', { size: 18, weight: 800, fill: C.tGreen, anchor: 'middle' });
    G.arrow(S.delta, 'M -8 -6 L 10 -6', { width: 2.5, head: 6, stroke: C.tGreen });
    S.next = el('g');
    G.pill(S.next, sx(0), CH.base - 46 * CH.k - 50, 'cible suivante', { size: 16, h: 30, pad: 12, bg: C.red, fg: C.white, anchor: 'middle' });

    // Roue PDCA
    S.wheel = el('g');
    S.quads = PHASES.map((ph, k) => {
      const a0 = -90 + 90 * k, a1 = a0 + 90;
      const p = a => [WHEEL.cx + WHEEL.r * Math.cos(a * Math.PI / 180), WHEEL.cy + WHEEL.r * Math.sin(a * Math.PI / 180)];
      const [x0, y0] = p(a0 + 2), [x1, y1] = p(a1 - 2);
      const path = el('path', { d: `M ${WHEEL.cx} ${WHEEL.cy} L ${x0} ${y0} A ${WHEEL.r} ${WHEEL.r} 0 0 1 ${x1} ${y1} Z`, fill: C.pLav }, S.wheel);
      const am = (a0 + 45) * Math.PI / 180;
      const lab = text(S.wheel, WHEEL.cx + 64 * Math.cos(am), WHEEL.cy + 64 * Math.sin(am) + 7, ph.key, { size: 20, weight: 800, fill: C.blue, anchor: 'middle' });
      return { path, lab };
    });
    el('circle', { cx: WHEEL.cx, cy: WHEEL.cy, r: 24, fill: C.white }, S.wheel);
    G.arrow(S.wheel, `M ${WHEEL.cx - 10} ${WHEEL.cy - WHEEL.r - 14} A ${WHEEL.r + 14} ${WHEEL.r + 14} 0 0 1 ${WHEEL.cx + WHEEL.r + 12} ${WHEEL.cy - 22}`, { width: 3, head: 9, stroke: C.blue });
    S.caps = PHASES.map((ph, k) => {
      const g = el('g');
      ph.txt.forEach((l, m) => fit(text(g, WHEEL.cx, 606 + 26 * m, l, { size: 18, weight: 700, fill: m ? C.ink : C.blue, anchor: 'middle' }), 1150, `phase ${k}`, 830));
      return g;
    });

    S.chute = G.blogChute('Un Pareto n’a de valeur que comparé à lui-même.', { y: 808 });
  }

  const phaseAt = t => (t < FADE_END ? 3 : PH_T.filter(s => t >= s).length - 1);

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.axes.setAttribute('opacity', live ? clamp(prog(t, T.axes, 0.3)) : o);
    pop(S.leg, t, T.axes + 0.1, 990, 209);
    S.leg2.setAttribute('opacity', live ? clamp(prog(t, T.grow, 0.3)) : o);

    // Barres
    const gh = live ? clamp(prog(t, T.ghost, 0.3)) : 1;   // relevé 1 devient pointillé
    const sp = live ? easeInOut(prog(t, T.sort, 0.8)) : 1;
    S.bars.forEach(b => {
      const c = CAUSES[b.i];
      const r0 = live ? easeOut(prog(t, T.bars + 0.1 * b.j0, 0.45)) : 1;
      const r1 = live ? easeInOut(prog(t, T.grow + 0.08 * b.j0, 0.6)) : 1;
      let h;
      if (!live || t >= T.grow) h = b.h1 * r1;                 // second relevé qui pousse
      else h = b.h0 * r0;                                      // premier relevé
      // Le fantôme n'est visible que là où la barre a baissé
      b.ghost.setAttribute('opacity', gh * (c.v0 !== c.v1 ? 1 : 0));
      b.bar.setAttribute('y', CH.base - Math.max(0.01, h));
      b.bar.setAttribute('height', Math.max(0.01, h));
      b.bar.setAttribute('opacity', live && t >= T.ghost && t < T.grow ? 1 - gh : 1);
      b.bar.setAttribute('fill', b.i === 0 && (!live || t >= T.grow) ? C.green : C.blue);
      const v = !live || t >= T.grow ? c.v1 : c.v0;
      b.val.textContent = b.i === 0 && (!live || t >= T.delta) ? '' : String(v);
      b.val.setAttribute('y', CH.base - (!live || t >= T.grow ? b.h1 * r1 : b.h0 * r0) - 8);
      b.val.setAttribute('opacity', live && t >= T.ghost && t < T.grow + 0.5 ? 0 : 1);
      const x = sx(b.j0) + (sx(b.j1) - sx(b.j0)) * sp;
      const lift = live ? 26 * Math.sin(Math.PI * clamp((t - T.sort) / 0.8)) * (b.j0 !== b.j1 ? 1 : 0) : 0;
      b.g.setAttribute('transform', `translate(${x} ${-lift})`);
      b.g.setAttribute('opacity', live ? clamp(prog(t, T.bars + 0.1 * b.j0, 0.25)) : o);
    });
    // Cible (Plan), actions et jours (Do), écart (Check), cible suivante (Act)
    S.target.setAttribute('opacity', live ? window01(t, T.plan + 0.2, T.check, 0.3) : 0);
    S.action.setAttribute('opacity', live ? window01(t, T.do + 0.1, T.check + 0.3, 0.3) : 0);
    S.daysBar.setAttribute('opacity', live ? window01(t, T.days - 0.1, T.check + 0.3, 0.3) : 0);
    const dp = live ? prog(t, T.days, 1.6) : 1;
    S.daysFill.setAttribute('width', 250 * dp);
    S.daysTxt.textContent = `${Math.round(20 * dp)}${NB}jours`;
    const b0 = S.bars[0];
    const bx = sx(b0.j0) + (sx(b0.j1) - sx(b0.j0)) * sp;
    S.delta.setAttribute('transform', `translate(${bx} ${CH.base - b0.h1 - 12})`);
    S.delta.setAttribute('opacity', live ? clamp(prog(t, T.delta, 0.3)) : o);
    const nx = sx(0), ny = CH.base - 46 * CH.k - 50;
    pop(S.next, t, T.next, nx, ny);

    // Roue
    pop(S.wheel, t, T.wheel, WHEEL.cx, WHEEL.cy);
    const ph = phaseAt(t);
    S.quads.forEach((q, k) => {
      const on = k === ph && (!live || t >= T.plan);
      q.path.setAttribute('fill', on ? C.blue : C.pLav);
      q.lab.setAttribute('fill', on ? C.white : C.blue);
    });
    S.caps.forEach((g, k) => g.setAttribute('opacity', live ? window01(t, PH_T[k] + 0.1, k < 3 ? PH_T[k + 1] : 99, 0.25) : (k === 3 ? o : 0)));
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
