// Blog · Obeya · section « Quelles zones afficher dans une Obeya ? »
// Mécanique : le mur porte les cinq zones ; l'équipe, debout, les lit de gauche à droite. Le groupe se déplace
// devant le mur, la barre de temps avance au même rythme (15 minutes), chaque zone s'anime quand on la lit,
// et la séance se termine sur une décision écrite en zone 5.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const PW = 204, PG = 10, PY = 196, PH = 280;
  const PX = k => 70 + k * (PW + PG);
  const BAR = { x: PX(0), w: PX(4) + PW - PX(0), y: 500, h: 14 };
  const FLOOR = 726;
  const ZONES = [
    ['L’objectif', 'et son écart'],
    ['Le plan et', 'son avancement'],
    ['Les problèmes', 'ouverts'],
    ['Les indicateurs'],
    ['Les décisions', 'à prendre'],
  ];
  // Chronologie de la séance
  const M0 = 3.3, ZD = 1.9;                 // début de la lecture, durée par zone
  const ZT = k => M0 + ZD * k;
  const M1 = ZT(5);
  const CHUTE_T = M1 + 0.6;

  function person(parent, cx, floor, k = 1, fill = C.blue) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 62 * k, r: 14 * k, fill }, g);
    el('path', { d: `M ${cx - 24 * k} ${floor} L ${cx - 24 * k} ${floor - 22 * k} Q ${cx - 24 * k} ${floor - 42 * k} ${cx} ${floor - 42 * k} Q ${cx + 24 * k} ${floor - 42 * k} ${cx + 24 * k} ${floor - 22 * k} L ${cx + 24 * k} ${floor} Z`, fill }, g);
    return g;
  }
  const line = (g, x1, y1, x2, y2, stroke, w = 3, extra = {}) => el('line', { x1, y1, x2, y2, stroke, 'stroke-width': w, 'stroke-linecap': 'round', ...extra }, g);

  // ---------- Contenu de chaque zone (x0 = bord gauche du panneau) ----------
  const CONTENT = [
    (g, x0, Z) => {   // objectif : cible, situation du jour, écart
      line(g, x0 + 18, 450, x0 + 190, 450, C.line, 3);
      line(g, x0 + 18, 300, x0 + 150, 300, C.tGreen, 3, { 'stroke-dasharray': '8 6' });
      text(g, x0 + 156, 306, 'cible', { size: 16, weight: 700, fill: C.tGreen });
      el('path', { d: `M ${x0 + 22} 430 L ${x0 + 52} 418 L ${x0 + 78} 424 L ${x0 + 104} 400 L ${x0 + 128} 392`, fill: 'none', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
      el('circle', { cx: x0 + 128, cy: 392, r: 6, fill: C.blue }, g);
      Z.gap = el('g', {}, g);
      G.arrow(Z.gap, `M ${x0 + 150} 386 L ${x0 + 150} 312`, { stroke: C.red, width: 3, head: 8 });
      text(Z.gap, x0 + 158, 358, 'écart', { size: 16, weight: 700, fill: C.tRed });
      Z.pulse = [Z.gap, x0 + 160, 350];
    },
    (g, x0, Z) => {   // plan : jalons, fait / glisse, date du jour
      const rows = [[290, 20, 84, C.green], [330, 40, 110, C.green], [370, 96, 168, C.red], [410, 132, 186, C.pLav]];
      rows.forEach(([y, a, b, c]) => {
        el('rect', { x: x0 + 18, y: y - 9, width: 170, height: 18, rx: 6, fill: C.line, opacity: 0.6 }, g);
        el('rect', { x: x0 + a, y: y - 9, width: b - a, height: 18, rx: 6, fill: c }, g);
      });
      G.arrow(g, `M ${x0 + 70} 370 L ${x0 + 92} 370`, { stroke: C.red, width: 2.5, head: 6 });
      Z.today = el('g', {}, g);
      line(Z.today, x0 + 118, 268, x0 + 118, 428, C.ink, 2.5, { 'stroke-dasharray': '5 4' });
      text(Z.today, x0 + 118, 452, 'aujourd’hui', { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
      Z.pulse = [Z.today, x0 + 118, 360];
    },
    (g, x0, Z) => {   // problèmes : un par ligne, un responsable, une échéance
      Z.rows = [296, 352, 408].map((y, i) => {
        const r = el('g', {}, g);
        el('rect', { x: x0 + 18, y: y - 12, width: 88, height: 8, rx: 4, fill: C.ink, opacity: 0.35 }, r);
        el('rect', { x: x0 + 18, y: y + 4, width: 64, height: 8, rx: 4, fill: C.ink, opacity: 0.2 }, r);
        el('circle', { cx: x0 + 126, cy: y, r: 12, fill: [C.teal, C.violet, C.lightBlue][i] }, r);
        el('circle', { cx: x0 + 126, cy: y - 3, r: 4.5, fill: C.white }, r);
        el('path', { d: `M ${x0 + 118} ${y + 8} Q ${x0 + 126} ${y} ${x0 + 134} ${y + 8}`, fill: C.white }, r);
        text(r, x0 + 144, y + 6, ['15/10', '17/10', '22/10'][i], { size: 16, weight: 700, fill: C.ink });
        return { r, y };
      });
      text(g, x0 + 104, 452, 'un nom, une date', { size: 16, weight: 600, fill: C.ink, anchor: 'middle' });
    },
    (g, x0, Z) => {   // indicateurs : trois courbes, tendance et seuil
      Z.alert = null;
      [[300, [6, 2, 8, 4, 10, 8]], [364, [4, 6, 3, 7, 5, 9]], [428, [10, 8, 9, 5, 3, -6]]].forEach(([y, v], i) => {
        line(g, x0 + 18, y - 18, x0 + 188, y - 18, C.red, 2, { 'stroke-dasharray': '5 4', opacity: 0.8 });
        const pts = v.map((d, j) => `${x0 + 22 + j * 30} ${y - d * 2.4}`);
        el('path', { d: 'M ' + pts.join(' L '), fill: 'none', stroke: i === 2 ? C.red : C.blue, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
        if (i === 2) Z.alert = el('circle', { cx: x0 + 172, cy: y + 14.4, r: 7, fill: C.red }, g);
      });
      Z.pulse = [Z.alert, x0 + 172, 442];
    },
    (g, x0, Z) => {   // décisions : ce qui attend un arbitrage, qui tranche, avant quand
      Z.cards = [[270, 'à trancher'], [362, 'à trancher']].map(([y, s], i) => {
        const c = el('g', {}, g);
        const box = el('rect', { x: x0 + 18, y, width: 170, height: 78, rx: 8, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, c);
        el('rect', { x: x0 + 32, y: y + 16, width: 104, height: 8, rx: 4, fill: C.ink, opacity: 0.35 }, c);
        el('rect', { x: x0 + 32, y: y + 32, width: 78, height: 8, rx: 4, fill: C.ink, opacity: 0.2 }, c);
        const lab = text(c, x0 + 32, y + 64, s, { size: 16, weight: 700, fill: C.tYellow });
        return { c, box, lab, y };
      });
      // La décision écrite pendant la séance (sur la première carte)
      const d = Z.cards[0];
      Z.done = el('g', {}, g);
      el('rect', { x: x0 + 18, y: d.y, width: 170, height: 78, rx: 8, fill: C.pGreen, stroke: C.green, 'stroke-width': 2.5 }, Z.done);
      Z.pen = el('path', { d: `M ${x0 + 32} ${d.y + 22} Q ${x0 + 50} ${d.y + 12} ${x0 + 66} ${d.y + 22} T ${x0 + 100} ${d.y + 22} T ${x0 + 134} ${d.y + 22}`, fill: 'none', stroke: C.tGreen, 'stroke-width': 3, 'stroke-linecap': 'round' }, Z.done);
      Z.penLen = Z.pen.getTotalLength();
      text(Z.done, x0 + 32, d.y + 64, 'tranchée', { size: 16, weight: 700, fill: C.tGreen });
      Z.check = el('g', {}, Z.done);
      G.check(Z.check, x0 + 166, d.y + 50, 14);
    },
  ];

  function build() {
    G.templateBlog();
    G.blogTitle('Cinq zones,', 'lues dans l’ordre.');
    G.blogChapeau('On lit l’écart, le plan, les problèmes, les indicateurs, puis ce qu’il faut trancher.');

    G.card(40, 176, 1120, 584);
    // Panneaux du mur (fonds fixes)
    ZONES.forEach((z, k) => el('rect', { x: PX(k), y: PY, width: PW, height: PH, rx: 14, fill: C.white, stroke: C.line, 'stroke-width': 2.5 }));
    S.zones = ZONES.map((lines, k) => {
      const x0 = PX(k), Z = { x0 };
      Z.g = el('g');
      G.badgeNum(Z.g, x0 + 25, 226, k + 1, 14);
      const ly = lines.length === 1 ? [232] : [222, 244];
      lines.forEach((s, i) => fit(text(Z.g, x0 + 47, ly[i], s, { size: 17, weight: 700, fill: C.ink }), x0 + PW - 4, `titre zone ${k + 1}`));
      CONTENT[k](Z.g, x0, Z);
      Z.frame = el('rect', { x: x0 - 3, y: PY - 3, width: PW + 6, height: PH + 6, rx: 16, fill: 'none', stroke: C.blue, 'stroke-width': 5, opacity: 0 });
      return Z;
    });

    // Barre de temps de la séance
    S.bar = el('g');
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: 7, fill: C.pLav }, S.bar);
    S.barClip = G.clipRect(BAR.x, BAR.y - 2, BAR.w, BAR.h + 4);
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: 7, fill: C.blue, 'clip-path': S.barClip.url }, S.bar);
    for (let k = 1; k < 5; k++) el('rect', { x: PX(k) - PG / 2 - 1.5, y: BAR.y, width: 3, height: BAR.h, fill: C.card }, S.bar);
    text(S.bar, BAR.x, BAR.y + 40, '0 min', { size: 17, weight: 600, fill: C.ink });
    text(S.bar, BAR.x + BAR.w, BAR.y + 40, `15${NB}min, debout`, { size: 17, weight: 700, fill: C.blue, anchor: 'end' });
    S.clock = el('g');
    const cx = BAR.x + BAR.w / 2;
    text(S.clock, cx, BAR.y + 40, 'à heure fixe, dans l’ordre des zones', { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });

    // L'équipe, debout devant le mur
    S.team = el('g');
    [-93, -31, 31, 93].forEach((dx, i) => person(S.team, dx, FLOOR, 1.32, [C.blue, C.teal, C.violet, C.lightBlue][i]));
    el('line', { x1: -132, y1: FLOOR + 2, x2: 132, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.team);

    // Règle de fin de séance (à gauche, libérée quand l'équipe arrive en zone 5)
    S.rule = el('g');
    G.check(S.rule, 88, 652, 17);
    const r1 = text(S.rule, 116, 646, 'Une décision minimum,', { size: 21, weight: 700, fill: C.tGreen });
    const r2 = text(S.rule, 116, 674, 'écrite au mur avant de sortir.', { size: 21, weight: 700, fill: C.tGreen });
    fit(r2, PX(4) - 130, 'règle');

    S.chute = G.blogChute('L’ordre des zones, c’est l’ordre de la réunion.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    // Zone lue à l'instant t (-1 avant la séance, 5 après)
    const zi = !live ? 5 : t < M0 ? -1 : Math.min(5, Math.floor((t - M0) / ZD));

    S.zones.forEach((Z, k) => {
      pop(Z.g, t, 1.75 + 0.12 * k, Z.x0 + PW / 2, PY + PH / 2);
      Z.frame.setAttribute('opacity', live ? G.window01(t, ZT(k), ZT(k + 1) - 0.05, 0.2) : 0);
      const t0 = ZT(k) + 0.35;
      if (Z.pulse && Z.pulse[0] && live && t >= t0 && t < t0 + 0.9) pulse(Z.pulse[0], t, t0, Z.pulse[1], Z.pulse[2], 0.18, 0.5);
      else if (Z.pulse && Z.pulse[0]) Z.pulse[0].setAttribute('transform', '');
    });
    // Zone 3 : chaque ligne ressort à son tour (nom, date)
    S.zones[2].rows.forEach((r, i) => {
      const t0 = ZT(2) + 0.3 + 0.45 * i;
      if (live && t >= t0 && t < t0 + 0.6) pulse(r.r, t, t0, PX(2) + 104, r.y, 0.1, 0.4);
      else r.r.setAttribute('transform', '');
    });
    // Zone 5 : la première décision est tranchée et écrite
    const Z5 = S.zones[4];
    const wd = ZT(4) + 0.4;
    Z5.done.setAttribute('opacity', live ? clamp(prog(t, wd, 0.25)) : 1);
    Z5.pen.setAttribute('stroke-dasharray', `${Z5.penLen} ${Z5.penLen}`);
    Z5.pen.setAttribute('stroke-dashoffset', live ? Z5.penLen * (1 - easeInOut(prog(t, wd + 0.1, 0.7))) : 0);
    pop(Z5.check, t, wd + 0.85, PX(4) + 166, Z5.cards[0].y + 50);
    if (!live) Z5.check.setAttribute('opacity', 1);

    // Barre de temps
    pop(S.bar, t, 2.4, BAR.x + BAR.w / 2, BAR.y + 20);
    pop(S.clock, t, 2.6, BAR.x + BAR.w / 2, BAR.y + 34);
    const fw = live ? BAR.w * clamp((t - M0) / (M1 - M0)) : BAR.w;
    S.barClip.rect.setAttribute('width', Math.max(0.001, fw));

    // L'équipe avance devant le mur, zone par zone
    const cxAt = k => PX(k) + PW / 2;
    let tx = cxAt(4);
    if (live) {
      tx = cxAt(0);
      for (let k = 1; k < 5; k++) {
        const q = easeInOut(prog(t, ZT(k) - 0.3, 0.6));
        if (q > 0) tx = cxAt(k - 1) + (cxAt(k) - cxAt(k - 1)) * q;
      }
    }
    const ts = live ? prog(t, 2.2, 0.35) : 1;
    const s = ts <= 0 ? 0.001 : ts >= 1 ? 1 : 0.6 + 0.4 * G.back(ts);
    S.team.setAttribute('transform', `translate(${tx} 0)` + (s === 1 ? '' : ` translate(0 ${FLOOR}) scale(${s}) translate(0 ${-FLOOR})`));
    S.team.setAttribute('opacity', live ? clamp(ts / 0.4) : o0);

    rise(S.rule, t, wd + 1.1, 0.45);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
