// Blog · Types de maintenance · section « Quels sont les 3 types de maintenance préventive ? »
// Mécanique : une seule courbe d'usure, le temps avance (curseur), et chaque type de maintenance intervient
// à son moment : la systématique à l'échéance (l'organe est encore bon), la prévisionnelle à la date déduite
// de la pente, la conditionnelle au franchissement du seuil, la corrective à la panne.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const AX = { x0: 350, x1: 1120 };
  const CH = { top: 236, bot: 418 };             // état 100 % → 0 %
  const X = u => AX.x0 + (AX.x1 - AX.x0) * u;
  const U0 = 0.3, UF = 0.92, EXP = 2.2, SEUIL = 0.55;
  const state = u => (u <= U0 ? 1 : u >= UF ? 0 : 1 - Math.pow((u - U0) / (UF - U0), EXP));
  const Y = s => CH.bot - (CH.bot - CH.top) * s;
  const UC = U0 + (UF - U0) * Math.pow(1 - SEUIL, 1 / EXP);      // franchissement réel du seuil
  const US = 0.26;                                              // échéance du calendrier
  const MEAS = [0.36, 0.42, 0.48, 0.54];                        // relevés (historique)
  const UP = 0.64;                                              // date déduite de la pente
  const LANES = [
    { y: 494, name: 'Corrective', trig: 'la panne', col: C.tRed, u: UF, lab: 'panne, on répare après', side: 'left' },
    { y: 560, name: 'Systématique', trig: 'une date', col: C.blue, u: US, lab: 'échéance fixe', side: 'left' },
    { y: 626, name: 'Conditionnelle', trig: 'un seuil', col: C.blue, u: UC, lab: 'seuil franchi', side: 'right' },
    { y: 692, name: 'dont prévisionnelle', trig: 'une tendance', col: C.blue, u: UP, lab: 'date déduite de la pente', side: 'left', indent: 22 },
  ];
  // Temps : le curseur parcourt l'axe de T0 à T1
  const T0 = 2.9, T1 = 12.9, CHUTE_T = 13.3;
  const uAt = t => (t < FADE_END ? 1 : clamp((t - T0) / (T1 - T0)));
  const tOf = u => T0 + (T1 - T0) * u;
  const TREND_T = tOf(MEAS[3]) + 0.1;

  const S = {};

  function wrench(parent, cx, cy, fill) {
    const g = el('g', { transform: `translate(${cx} ${cy}) rotate(-45)` }, parent);
    el('rect', { x: -3.5, y: -4, width: 7, height: 20, rx: 3, fill }, g);
    el('path', { d: 'M -9 -10 A 10 10 0 1 0 9 -10 L 4 -10 L 4 -4 L -4 -4 L -4 -10 Z', fill }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le moment', 'de la décision.');
    G.blogChapeau('Le même organe s’use. Chaque type de maintenance intervient à un autre moment.');

    G.card(40, 176, 1120, 576);

    // ----- Courbe d'usure -----
    S.axes = el('g');
    text(S.axes, 64, 262, 'État de', { size: 19, weight: 700, fill: C.ink });
    text(S.axes, 64, 286, 'l’organe', { size: 19, weight: 700, fill: C.ink });
    text(S.axes, 64, 316, 'sans intervention', { size: 16, weight: 500, fill: C.ink });
    el('line', { x1: AX.x0, y1: CH.bot + 2, x2: AX.x1, y2: CH.bot + 2, stroke: C.line, 'stroke-width': 3 }, S.axes);
    el('line', { x1: AX.x0, y1: CH.top - 16, x2: AX.x0, y2: CH.bot + 2, stroke: C.line, 'stroke-width': 3 }, S.axes);
    text(S.axes, AX.x0 - 10, CH.top + 6, 'neuf', { size: 16, weight: 600, fill: C.ink, anchor: 'end' });
    text(S.axes, AX.x0 - 10, CH.bot + 6, 'hors service', { size: 16, weight: 600, fill: C.ink, anchor: 'end' });
    text(S.axes, AX.x1, CH.bot - 10, 'temps', { size: 16, weight: 600, fill: C.ink, anchor: 'end' });
    // seuil d'alerte
    el('line', { x1: AX.x0, y1: Y(SEUIL), x2: AX.x1, y2: Y(SEUIL), stroke: C.yellow, 'stroke-width': 3, 'stroke-dasharray': '9 7' }, S.axes);
    text(S.axes, AX.x0 + 10, Y(SEUIL) - 10, 'seuil d’alerte', { size: 16, weight: 700, fill: C.tYellow });

    const pts = [];
    for (let u = 0; u <= UF + 1e-6; u += 0.004) pts.push(`${X(u).toFixed(1)} ${Y(state(u)).toFixed(1)}`);
    const clip = G.clipRect(AX.x0 - 8, CH.top - 30, 0, CH.bot - CH.top + 60);
    S.clip = clip.rect;
    S.curve = el('g', { 'clip-path': clip.url });
    el('path', { d: 'M ' + pts.join(' L '), fill: 'none', stroke: C.ink, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.curve);

    // Relevés et tendance (prévisionnelle)
    S.meas = MEAS.map(u => el('circle', { cx: X(u), cy: Y(state(u)), r: 6.5, fill: C.lightBlue, stroke: C.white, 'stroke-width': 2 }));
    // Pente prolongée : la dégradation observée, prolongée jusqu'au seuil (pointillés, un peu au-dessus de la courbe)
    const tp = [];
    for (let u = MEAS[3] + 0.01; u <= UC + 1e-6; u += 0.004) tp.push(`${X(u).toFixed(1)} ${(Y(state(u)) - 15).toFixed(1)}`);
    S.trend = G.arrow(G.svg, 'M ' + tp.join(' L '), { stroke: C.lightBlue, width: 3.5, dash: '7 6', head: 9 });
    // Date planifiée sur le couloir prévisionnel (anneau pointillé, avant l'intervention)
    S.plan = el('circle', { cx: X(UP), cy: LANES[3].y, r: 21, fill: 'none', stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' });
    S.trendLab = el('g');
    text(S.trendLab, X(MEAS[1]) - 4, Y(state(MEAS[1])) - 30, 'relevés', { size: 16, weight: 700, fill: C.lightBlue, anchor: 'middle' });
    text(S.trendLab, X(UC) + 16, Y(SEUIL) - 22, 'pente prolongée', { size: 16, weight: 700, fill: C.lightBlue });

    // Panne (fin de courbe)
    S.fail = el('g');
    G.cross(S.fail, X(UF), Y(0), 13);

    // ----- Couloirs : un par type -----
    S.lanes = LANES.map((L, i) => {
      const g = el('g');
      const ind = L.indent || 0;
      if (i === 1) el('line', { x1: 64, y1: L.y - 36, x2: AX.x1, y2: L.y - 36, stroke: C.line, 'stroke-width': 2 }, g);
      text(g, 64 + ind, L.y - 4, L.name, { size: 19, weight: 700, fill: i === 0 ? C.tRed : C.ink });
      const tg = text(g, 64 + ind, L.y + 19, 'déclencheur : ', { size: 16, weight: 500, fill: C.ink });
      const ts = el('tspan', { 'font-weight': 700, fill: L.col }, tg);
      ts.textContent = L.trig;
      el('line', { x1: AX.x0, y1: L.y, x2: AX.x1, y2: L.y, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      // Guide vertical : du point de la courbe au couloir
      const L2 = { ...L, g };
      const yc = L.u === US ? Y(1) : L.u === UP ? Y(state(UP)) : L.u === UC ? Y(SEUIL) : Y(0);
      L2.guide = el('line', { x1: X(L.u), y1: yc + 10, x2: X(L.u), y2: L.y - 16, stroke: i === 0 ? C.red : C.blue, 'stroke-width': 2, 'stroke-dasharray': '4 5', opacity: 0.8 });
      // Marqueur d'intervention
      L2.mark = el('g');
      el('circle', { cx: X(L.u), cy: L.y, r: 16, fill: i === 0 ? C.red : C.blue }, L2.mark);
      wrench(L2.mark, X(L.u), L.y, C.white);
      const lx = L.side === 'right' ? X(L.u) + 26 : X(L.u) - 26;
      fit(text(L2.mark, lx, L.y + 6, L.lab, { size: 17, weight: 700, fill: i === 0 ? C.tRed : C.blue, anchor: L.side === 'right' ? 'start' : 'end' }), AX.x1 + 30, `étiquette ${i}`, AX.x0);
      L2.cx = X(L.u);
      return L2;
    });

    // Systématique : la durée de vie encore disponible au moment de l'échéance
    S.left = el('g');
    const ly = LANES[1].y;
    el('rect', { x: X(US) + 22, y: ly - 7, width: X(UF) - X(US) - 22, height: 14, rx: 7, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, S.left);
    el('line', { x1: X(UF), y1: ly - 14, x2: X(UF), y2: ly + 14, stroke: C.yellow, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.left);
    const bl = text(S.left, (X(US) + X(UF)) / 2 + 11, ly + 32, 'durée de vie encore disponible, remplacée quand même', { size: 16, weight: 700, fill: C.tYellow, anchor: 'middle' });
    const bb = measure(bl);
    S.left.insertBefore(el('rect', { x: bb.x - 6, y: bb.y - 1, width: bb.width + 12, height: bb.height + 2, fill: C.card }, S.left), bl);

    S.cursor = el('line', { x1: 0, y1: CH.top - 20, x2: 0, y2: 716, stroke: C.blue, 'stroke-width': 2, opacity: 0 });

    S.chute = G.blogChute('Ce qui les distingue n’est pas la technologie, c’est le moment.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const u = uAt(t);

    const ao = live ? clamp(prog(t, 1.75, 0.35)) : o;
    S.axes.setAttribute('opacity', ao);
    S.lanes.forEach((L, i) => {
      L.g.setAttribute('opacity', live ? clamp(prog(t, 2.0 + 0.12 * i, 0.35)) : o);
      const tu = tOf(L.u);
      L.guide.setAttribute('opacity', live ? 0.8 * clamp(prog(t, tu, 0.25)) : 0.8 * o);
      pop(L.mark, t, tu, L.cx, L.y);
      if (live && t >= tu + 0.35 && t < tu + 1.1) pulse(L.mark, t, tu + 0.35, L.cx, L.y, 0.1, 0.45);
    });

    // Courbe tracée au fil du temps
    S.clip.setAttribute('width', live ? Math.max(0.001, X(u) - AX.x0 + 8) : X(1) - AX.x0 + 16);
    S.curve.setAttribute('opacity', o);
    S.meas.forEach((m, k) => m.setAttribute('opacity', live ? clamp(prog(t, tOf(MEAS[k]), 0.2)) : o));
    S.trend.draw(live ? prog(t, TREND_T, 0.5) : 1);
    S.trend.g.setAttribute('opacity', o);
    S.trendLab.setAttribute('opacity', live ? clamp(prog(t, TREND_T + 0.3, 0.3)) : o);
    S.plan.setAttribute('opacity', live ? clamp(prog(t, TREND_T + 0.5, 0.3)) : o);
    pop(S.fail, t, tOf(UF), X(UF), Y(0));
    S.left.setAttribute('opacity', live ? clamp(prog(t, tOf(US) + 0.5, 0.4)) : o);

    // Curseur du temps
    const co = live && t < T1 + 0.4 ? Math.min(clamp(prog(t, T0 - 0.3, 0.3)), clamp((T1 + 0.4 - t) / 0.4)) : 0;
    S.cursor.setAttribute('x1', X(u));
    S.cursor.setAttribute('x2', X(u));
    S.cursor.setAttribute('opacity', co * 0.6);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
