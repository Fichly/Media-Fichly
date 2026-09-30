// Blog · SMED · section « Exemple : la presse de 1 000 tonnes de Toyota »
// Mécanique : les durées de l'article sur une même échelle. Volkswagen (2 h) sert de référence ; la barre Toyota
// part de 4 h, tombe à 90 min en séparant l'interne de l'externe, puis sous les 3 min en convertissant.
// La barre finale est si courte qu'un zoom sur les 10 premières minutes est nécessaire pour la lire (le « single minute »).
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const AX = { x0: 230, x1: 1110, max: 240 };
  const X = m => AX.x0 + (AX.x1 - AX.x0) * m / AX.max;
  const VW = { y: 236, h: 42 }, TY = { y: 330, h: 52 };
  const FINAL = 2.9;                                   // « moins de 3 minutes » (tracé juste sous 3)
  const T = { vw: 1.9, ty: 2.5, p1: 4.1, s1: 4.4, goal: 6.2, p2: 7.3, s2: 7.6, zoom: 9.4, chute: 11.2 };
  const ZB = { x: 64, y: 520, w: 1072, h: 222 };
  const ZX = m => 120 + 96 * m;                         // zoom : 0 → 10 min sur 960 px

  const S = {};

  // Durée affichée de la barre Toyota
  function toyotaAt(t) {
    if (t < FADE_END) return FINAL;
    let m = 240 * easeOut(prog(t, T.ty, 0.9));
    if (t >= T.s1) m = 240 + (90 - 240) * easeInOut(prog(t, T.s1, 1.0));
    if (t >= T.s2) m = 90 + (FINAL - 90) * easeInOut(prog(t, T.s2, 1.2));
    return m;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('De 4 heures', 'à 3 minutes.');
    G.blogChapeau(`Toyota, 1969 : changement d’outillage d’une presse de 1${NB}000 tonnes.`);

    G.card(40, 176, 1120, 584);
    // Axe principal
    el('line', { x1: AX.x0, y1: 412, x2: AX.x1, y2: 412, stroke: C.line, 'stroke-width': 3 });
    [[0, '0'], [60, '1 h'], [120, '2 h'], [180, '3 h'], [240, '4 h']].forEach(([m, s]) => {
      el('line', { x1: X(m), y1: 406, x2: X(m), y2: 418, stroke: C.ink, 'stroke-width': 2, opacity: 0.5 });
      text(G.svg, X(m), 440, s, { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
      if (m) el('line', { x1: X(m), y1: 222, x2: X(m), y2: 404, stroke: C.line, 'stroke-width': 1.5, 'stroke-dasharray': '4 6' });
    });
    // Étiquettes des lignes
    text(G.svg, 64, VW.y + 20, 'Volkswagen', { size: 20, weight: 700, fill: C.ink });
    text(G.svg, 64, VW.y + 42, 'la référence', { size: 16, weight: 500, fill: C.ink });
    text(G.svg, 64, TY.y + 24, 'Toyota', { size: 22, weight: 800, fill: C.tRed });
    text(G.svg, 64, TY.y + 47, 'presse de 1 000 t', { size: 16, weight: 500, fill: C.ink });

    // Volkswagen : 2 h
    S.vw = el('g');
    el('rect', { x: X(0), y: VW.y, width: X(120) - X(0), height: VW.h, rx: 8, fill: C.lightBlue }, S.vw);
    text(S.vw, X(120) + 12, VW.y + 29, '2 h', { size: 22, weight: 800, fill: C.blue });

    // Toyota : fantômes des étapes, barre, valeur
    S.ghost1 = el('g');
    el('rect', { x: X(0), y: TY.y, width: X(240) - X(0), height: TY.h, rx: 8, fill: 'none', stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, S.ghost1);
    text(S.ghost1, X(240) - 12, TY.y + 34, '4 h', { size: 22, weight: 800, fill: C.tRed, anchor: 'end' });
    S.ghost2 = el('g');
    el('rect', { x: X(0), y: TY.y + 6, width: X(90) - X(0), height: TY.h - 12, rx: 7, fill: 'none', stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, S.ghost2);
    text(S.ghost2, X(90) - 12, TY.y + 34, '90 min', { size: 20, weight: 800, fill: C.tRed, anchor: 'end' });
    S.bar = el('rect', { x: X(0), y: TY.y, height: TY.h, rx: 6, fill: C.red });
    S.val = text(G.svg, 0, TY.y + 34, '', { size: 22, weight: 800, fill: C.white, anchor: 'end' });
    S.valOut = text(G.svg, 0, TY.y + 34, 'moins de 3 min', { size: 22, weight: 800, fill: C.tGreen });

    // Objectif de la direction
    S.goal = el('g');
    el('line', { x1: X(3), y1: TY.y - 2, x2: X(3), y2: 302, stroke: C.tGreen, 'stroke-width': 3 }, S.goal);
    G.pill(S.goal, X(3) - 4, 302, 'Objectif fixé : moins de 3 min', { size: 17, h: 30, pad: 12, bg: C.pGreen, fg: C.tGreen });

    // Phases
    S.p1 = el('g');
    const pp1 = G.pill(S.p1, 420, 476, '1. Séparer interne et externe', { size: 18, h: 34, bg: C.blue, fg: C.white });
    S.p2 = el('g');
    G.pill(S.p2, 420 + pp1.w + 14, 476, '2. Convertir l’interne en externe', { size: 18, h: 34, bg: C.green, fg: C.white });

    // Zoom sur les 10 premières minutes
    S.zoom = el('g');
    el('path', { d: `M ${X(0) - 2} ${TY.y + TY.h + 6} L ${ZB.x + 16} ${ZB.y} M ${X(10) + 2} ${TY.y + TY.h + 6} L ${ZB.x + 340} ${ZB.y}`, stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '5 5', fill: 'none' }, S.zoom);
    el('rect', { x: X(0) - 2, y: TY.y - 6, width: X(10) - X(0) + 4, height: TY.h + 12, rx: 4, fill: 'none', stroke: C.blue, 'stroke-width': 2 }, S.zoom);
    el('rect', { x: ZB.x, y: ZB.y, width: ZB.w, height: ZB.h, rx: 18, fill: C.pLav }, S.zoom);
    text(S.zoom, ZB.x + 22, ZB.y + 34, 'Zoom sur les 10 premières minutes', { size: 19, weight: 700, fill: C.blue });
    el('rect', { x: ZX(0), y: ZB.y + 56, width: ZX(FINAL) - ZX(0), height: 46, rx: 8, fill: C.green }, S.zoom);
    text(S.zoom, ZX(FINAL) + 14, ZB.y + 88, 'moins de 3 min', { size: 24, weight: 800, fill: C.tGreen });
    el('line', { x1: ZX(0), y1: ZB.y + 124, x2: ZX(10), y2: ZB.y + 124, stroke: C.ink, 'stroke-width': 2, opacity: 0.5 }, S.zoom);
    for (let m = 0; m <= 10; m++) el('line', { x1: ZX(m), y1: ZB.y + 118, x2: ZX(m), y2: ZB.y + 130, stroke: C.ink, 'stroke-width': 2, opacity: 0.5 }, S.zoom);
    [[0, '0'], [5, '5 min'], [10, '10 min']].forEach(([m, s]) => text(S.zoom, ZX(m), ZB.y + 152, s, { size: 16, weight: 600, fill: C.ink, anchor: 'middle' }));
    el('line', { x1: ZX(10), y1: ZB.y + 48, x2: ZX(10), y2: ZB.y + 114, stroke: C.blue, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, S.zoom);
    text(S.zoom, ZX(10) - 12, ZB.y + 72, 'single minute', { size: 18, weight: 700, fill: C.blue, anchor: 'end' });
    fit(text(S.zoom, ZB.x + 22, ZB.y + 196, 'Single Minute Exchange of Die : un temps à un seul chiffre, sous les 10 minutes.', { size: 18, weight: 500, fill: C.ink }), ZB.x + ZB.w - 16, 'zoom légende');

    S.chute = G.blogChute('Un premier chantier réduit couramment le temps de 30 à 50 %.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Volkswagen
    const vq = live ? easeOut(prog(t, T.vw, 0.6)) : 1;
    S.vw.setAttribute('opacity', live ? clamp(prog(t, T.vw, 0.2)) : o);
    S.vw.querySelector('rect').setAttribute('width', Math.max(0.001, (X(120) - X(0)) * vq));
    S.vw.querySelector('text').setAttribute('opacity', vq >= 1 ? 1 : 0);

    // Toyota
    const m = toyotaAt(t);
    S.bar.setAttribute('width', Math.max(0.001, X(m) - X(0)));
    S.bar.setAttribute('opacity', live ? (t >= T.ty ? 1 : 0) : o);
    const big = m > 30;
    S.val.textContent = m >= 120 ? `${Math.round(m / 60 * 10) / 10}`.replace('.', ',') + `${NB}h` : `${Math.round(m)}${NB}min`;
    S.val.setAttribute('x', X(m) - 12);
    S.val.setAttribute('opacity', live ? (big && t >= T.ty + 0.3 ? 1 : 0) : 0);
    S.valOut.setAttribute('x', X(m) + 14);
    S.valOut.setAttribute('opacity', live ? clamp(prog(t, T.s2 + 1.1, 0.3)) : o);
    S.ghost1.setAttribute('opacity', live ? clamp(prog(t, T.s1 + 0.1, 0.3)) : o);
    S.ghost2.setAttribute('opacity', live ? clamp(prog(t, T.s2 + 0.1, 0.3)) : o);

    pop(S.goal, t, T.goal, X(3) + 110, 302);
    pop(S.p1, t, T.p1, 560, 476);
    pop(S.p2, t, T.p2, 880, 476);

    // Zoom : s'ouvre depuis la zone des 10 premières minutes
    const zq = live ? easeOut(prog(t, T.zoom, 0.7)) : 1;
    const zs = 0.05 + 0.95 * zq;
    const ox = X(5), oy = 412;
    S.zoom.setAttribute('transform', zq >= 1 ? '' : `translate(${ox} ${oy}) scale(${zs}) translate(${-ox} ${-oy})`);
    S.zoom.setAttribute('opacity', live ? clamp(zq / 0.3) : o);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
