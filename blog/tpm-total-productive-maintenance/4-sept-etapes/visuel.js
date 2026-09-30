// Blog · TPM · section « Les 7 étapes de la maintenance autonome »
// Mécanique : l'équipe monte l'escalier marche par marche ; on ne franchit une marche que lorsque la précédente
// tient sans rappel (coche). Les trois premières sont du nettoyage, la quatrième est la plus haute (formation),
// et la courbe des arrêts subis ne bouge qu'à partir de la cinquième. L'équipe s'arrête à la cinquième, bien tenue.
// Courbe des arrêts : allure illustrative, sans échelle (hypothèse). Rendu déterministe : boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const BASE = 656, SX = 64, SW = 106, SG = 3;
  const RISERS = [44, 44, 44, 112, 44, 44, 44];
  const STEPS = [
    ['Nettoyage', 'initial'], ['Sources de', 'salissure'], ['Standard', 'provisoire'], ['Formation à', 'l’inspection'],
    ['Inspection', 'autonome'], ['Standardiser', 'le poste'], ['Gestion', 'autonome'],
  ];
  const tops = []; RISERS.reduce((y, r, i) => (tops[i] = y - r), BASE);
  const sx = i => SX + i * (SW + SG);
  const FILL = i => (i < 3 ? C.lightBlue : i === 3 ? C.blue : i === 4 ? C.green : C.pLav);
  // Montée : arrivée sur la marche k à ARR[k], coche à CHK[k]
  const ARR = [3.7, 5.3, 6.5, 8.05, 9.75];
  const CHK = [4.15, 5.75, 6.95, 9.0, 10.2];
  const HOP = 0.4, HOP4 = 0.6;
  const FLAG_T = 10.65, CHUTE_T = 11.4;
  const CH = { x0: 866, x1: 1128, y0: 330, y1: 560 };
  const ARRETS = [0.82, 0.83, 0.81, 0.82, 0.52];      // arrêts subis après chaque marche (illustratif)
  const cx = k => CH.x0 + (CH.x1 - CH.x0) * k / 6;
  const cy = v => CH.y1 - (CH.y1 - CH.y0) * v;

  const S = {};

  function pawn(parent) {
    const g = el('g', {}, parent);
    el('circle', { cx: 0, cy: -44, r: 11, fill: C.ink }, g);
    el('path', { d: 'M -17 0 L -17 -15 Q -17 -30 0 -30 Q 17 -30 17 -15 L 17 0 Z', fill: C.ink }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Sept marches,', 'dans l’ordre.');
    G.blogChapeau('On ne franchit une étape que lorsque la précédente tient sans rappel.');
    G.card(40, 176, 1120, 576);

    // ----- Escalier -----
    S.steps = STEPS.map((l, i) => {
      const g = el('g');
      const reached = i <= 4;
      el('rect', { x: sx(i), y: tops[i], width: SW, height: BASE - tops[i], rx: 8, fill: FILL(i), stroke: reached ? 'none' : C.blue, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
      const fg = reached ? C.white : C.blue;
      text(g, sx(i) + SW / 2, tops[i] + 29, String(i + 1), { size: 22, weight: 800, fill: fg, anchor: 'middle' });
      l.forEach((s, k) => fit(text(g, sx(i) + SW / 2, BASE + 26 + k * 20, s, { size: 15, weight: 600, fill: reached ? C.ink : C.blue, anchor: 'middle' }), sx(i) + SW + 1, `marche ${i + 1}`, sx(i) - 1));
      return { g, cx: sx(i) + SW / 2 };
    });
    el('line', { x1: 44, y1: BASE + 1, x2: sx(6) + SW + 10, y2: BASE + 1, stroke: C.line, 'stroke-width': 4 });
    // étape 4 : la plus haute
    S.note4 = el('g');
    text(S.note4, sx(3) + SW / 2, tops[3] + 70, 'la marche', { size: 15, weight: 600, fill: C.white, anchor: 'middle' });
    text(S.note4, sx(3) + SW / 2, tops[3] + 89, 'la plus haute', { size: 15, weight: 600, fill: C.white, anchor: 'middle' });
    // accolade des trois premières
    S.brace = el('g');
    const bx0 = sx(0) + 4, bx1 = sx(2) + SW - 4, by = 444;
    el('path', { d: `M ${bx0} ${by + 12} Q ${bx0} ${by} ${bx0 + 12} ${by} L ${(bx0 + bx1) / 2 - 10} ${by} L ${(bx0 + bx1) / 2} ${by - 10} L ${(bx0 + bx1) / 2 + 10} ${by} L ${bx1 - 12} ${by} Q ${bx1} ${by} ${bx1} ${by + 12}`, fill: 'none', stroke: C.lightBlue, 'stroke-width': 3, 'stroke-linejoin': 'round' }, S.brace);
    text(S.brace, (bx0 + bx1) / 2, by - 44, 'Étapes 1 à 3 : du nettoyage,', { size: 17, weight: 700, fill: C.blue, anchor: 'middle' });
    text(S.brace, (bx0 + bx1) / 2, by - 22, 'et c’est voulu', { size: 17, weight: 700, fill: C.blue, anchor: 'middle' });
    // étape 7 : peu de sites
    S.note7 = el('g');
    text(S.note7, sx(6) + SW / 2, tops[6] - 34, 'très peu de sites', { size: 15, weight: 600, fill: C.blue, anchor: 'middle' });
    text(S.note7, sx(6) + SW / 2, tops[6] - 14, 'l’atteignent', { size: 15, weight: 600, fill: C.blue, anchor: 'middle' });

    // Coches « tient sans rappel »
    S.checks = ARR.map((_, k) => { const g = el('g'); G.check(g, sx(k) + SW - 18, tops[k] - 18, 12); return g; });
    S.tip = el('g');
    const tp = G.pill(S.tip, sx(1) + 2, tops[1] - 22, 'tient sans rappel', { size: 16, h: 30, pad: 12, bg: C.pGreen, fg: C.tGreen });

    // Drapeau sur la 5e
    S.flag = el('g');
    const fx = sx(4) + SW - 26, fy = tops[4];
    el('line', { x1: fx, y1: fy, x2: fx, y2: fy - 74, stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, S.flag);
    el('path', { d: `M ${fx} ${fy - 74} L ${fx + 34} ${fy - 64} L ${fx} ${fy - 54} Z`, fill: C.green }, S.flag);
    S.flagLab = el('g');
    text(S.flagLab, sx(4) + SW / 2, fy - 90, 'la cinquième bien tenue', { size: 16, weight: 700, fill: C.tGreen, anchor: 'middle' });

    S.pawn = pawn(G.svg);

    // ----- Courbe des arrêts subis -----
    S.chart = el('g');
    text(S.chart, CH.x0 - 8, 250, 'Arrêts subis', { size: 20, weight: 700, fill: C.tRed });
    text(S.chart, CH.x0 - 8, 274, 'sur la ligne pilote', { size: 16, weight: 500, fill: C.ink });
    el('line', { x1: CH.x0 - 8, y1: CH.y1 + 2, x2: CH.x1 + 8, y2: CH.y1 + 2, stroke: C.line, 'stroke-width': 3 }, S.chart);
    el('line', { x1: CH.x0 - 8, y1: CH.y0 - 20, x2: CH.x0 - 8, y2: CH.y1 + 2, stroke: C.line, 'stroke-width': 3 }, S.chart);
    for (let k = 0; k < 7; k++) text(S.chart, cx(k), CH.y1 + 26, String(k + 1), { size: 16, weight: 700, fill: k <= 4 ? C.ink : C.blue, anchor: 'middle' });
    text(S.chart, CH.x1 + 8, CH.y1 + 50, 'étape', { size: 15, weight: 600, fill: C.ink, anchor: 'end' });
    const pts = ARRETS.map((v, k) => `${cx(k)} ${cy(v)}`);
    const clip = G.clipRect(CH.x0 - 12, CH.y0 - 30, 0, CH.y1 - CH.y0 + 40);
    S.lclip = clip.rect;
    const lg = el('g', { 'clip-path': clip.url }, S.chart);
    el('path', { d: 'M ' + pts.join(' L '), fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, lg);
    S.dots = ARRETS.map((v, k) => el('circle', { cx: cx(k), cy: cy(v), r: 6, fill: C.red, stroke: C.white, 'stroke-width': 2 }));
    S.effect = el('g');
    G.para(S.effect, CH.x0 - 8, 632, 'Un effet mesurable sur les arrêts à partir de l’étape 5, pas avant.', 270, { size: 17, weight: 700, fill: C.tGreen, lh: 1.25 });

    S.chute = G.blogChute('La cinquième bien tenue vaut mieux que la septième affichée.', { y: 806 });
  }

  // Position du pion (sur le dessus de la marche courante), saut parabolique entre deux marches
  function pawnPos(t) {
    const top = k => ({ x: sx(k) + 34, y: tops[k] });
    if (t < FADE_END) return top(4);
    if (t < ARR[0] - HOP) return { x: sx(0) - 2, y: BASE, o: clamp(prog(t, ARR[0] - HOP - 0.6, 0.3)) };
    let a = { x: sx(0) - 2, y: BASE };
    for (let k = 0; k < ARR.length; k++) {
      const d = k === 3 ? HOP4 : HOP;
      const b = top(k);
      if (t < ARR[k] - d) return a;
      if (t < ARR[k]) {
        const p = (t - (ARR[k] - d)) / d;
        return { x: a.x + (b.x - a.x) * easeInOut(p), y: a.y + (b.y - a.y) * p - (k === 3 ? 70 : 40) * Math.sin(Math.PI * p) };
      }
      a = b;
    }
    return a;
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.steps.forEach((s, i) => pop(s.g, t, 1.75 + 0.12 * i, s.cx, BASE - 30));
    S.note4.setAttribute('opacity', live ? clamp(prog(t, ARR[3] - 0.2, 0.3)) : o);
    S.brace.setAttribute('opacity', live ? clamp(prog(t, 2.8, 0.35)) : o);
    S.note7.setAttribute('opacity', live ? clamp(prog(t, 3.0, 0.35)) : o);
    S.chart.setAttribute('opacity', live ? clamp(prog(t, 2.9, 0.35)) : o);

    S.checks.forEach((c, k) => pop(c, t, CHK[k], sx(k) + SW - 18, tops[k] - 18));
    const tipO = live ? Math.min(clamp(prog(t, CHK[0] + 0.1, 0.25)), 1 - clamp(prog(t, ARR[1] - HOP - 0.3, 0.25))) : 0;
    S.tip.setAttribute('opacity', tipO);

    const p = pawnPos(t);
    S.pawn.setAttribute('transform', `translate(${p.x} ${p.y})`);
    S.pawn.setAttribute('opacity', p.o !== undefined ? p.o : o);
    pop(S.flag, t, FLAG_T, sx(4) + SW - 26, tops[4] - 30);
    S.flagLab.setAttribute('opacity', live ? clamp(prog(t, FLAG_T + 0.2, 0.3)) : o);

    // Courbe : un point par marche tenue
    let k = 4;
    if (live) { k = -1; CHK.forEach((c, j) => { if (t >= c) k = j; }); }
    const kf = live ? (k < 0 ? -1 : k - 1 + clamp(prog(t, CHK[Math.max(k, 0)], 0.4))) : 4;
    S.lclip.setAttribute('width', kf <= 0 ? 0.001 : cx(kf) - CH.x0 + 12);
    S.dots.forEach((d, j) => d.setAttribute('opacity', live ? clamp(prog(t, CHK[j], 0.2)) : o));
    S.effect.setAttribute('opacity', live ? clamp(prog(t, CHK[4] + 0.3, 0.35)) : o);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
