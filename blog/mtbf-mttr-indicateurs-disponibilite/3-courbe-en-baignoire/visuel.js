// Blog · MTBF et MTTR · sous-section « Le seuil universel n'existe pas » (refait l'image Courbe_en_baignoire)
// Mécanique : un curseur parcourt la vie d'un même équipement. La courbe du taux de défaillance se trace (élevé en
// jeunesse, bas en vie utile, remontée à l'usure), les pannes tombent sur la frise au même rythme, serrées puis
// espacées puis serrées, et le MTBF de chaque période s'allonge ou se raccourcit d'autant.
// Courbe et nombre de pannes illustratifs, sans échelle chiffrée.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const X0 = 150, X1 = 1110, YB = 520, YT = 250;
  const lam = u => 0.85 * Math.exp(-u / 0.07) + 0.12 + 0.8 * Math.exp((u - 1) / 0.08);
  const LMAX = lam(0);
  const xu = u => X0 + u * (X1 - X0);
  const yl = l => YB - (l / LMAX) * (YB - YT - 20);
  const ZONES = [
    { a: 0, b: 0.2, name: 'Jeunesse', sub: 'taux élevé', dx: 18, bg: C.pRed, fg: C.tRed, mt: 'court' },
    { a: 0.2, b: 0.72, name: 'Vie utile', sub: 'taux bas et stable', bg: C.pGreen, fg: C.tGreen, mt: 'long' },
    { a: 0.72, b: 1, name: 'Usure', sub: 'le taux remonte', bg: C.pRed, fg: C.tRed, mt: 'court' },
  ];
  const CUR0 = 2.6, CUR1 = 11.0;
  const tOf = u => CUR0 + (CUR1 - CUR0) * u;

  // Pannes : une chaque fois que l'intégrale du taux franchit un palier (déterministe)
  const FAILS = (() => {
    const out = [];
    const N = 150, du = 0.0005;
    let acc = 0, next = 0.5;
    for (let u = 0; u < 1; u += du) {
      acc += lam(u) * du * N;
      if (acc >= next) { out.push(u); next += 1; }
    }
    return out;
  })();
  // MTBF moyen de chaque période (inverse du taux moyen), en pixels
  ZONES.forEach(z => {
    let s = 0, n = 0;
    for (let u = z.a; u < z.b; u += 0.001) { s += lam(u); n++; }
    z.avg = s / n;
  });
  const KM = 44;   // longueur de la barre MTBF = KM / taux moyen

  function build() {
    G.templateBlog();
    G.blogTitle('La courbe', 'en baignoire.');
    G.blogChapeau('Le même équipement ne donne pas le même MTBF selon son âge.');

    G.card(40, 176, 1120, 584);

    // Fonds des trois périodes
    S.zbg = el('g');
    ZONES.forEach(z => el('rect', { x: xu(z.a), y: YT - 10, width: xu(z.b) - xu(z.a), height: YB - YT + 10, fill: z.bg, opacity: 0.8 }, S.zbg));
    // Axes
    S.axes = el('g');
    el('line', { x1: X0, y1: YB, x2: X1 + 10, y2: YB, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.axes);
    el('line', { x1: X0, y1: YB, x2: X0, y2: YT - 20, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.axes);
    G.arrow(S.axes, `M ${X1} ${YB} L ${X1 + 16} ${YB}`, { stroke: C.ink, width: 3, head: 10 });
    G.arrow(S.axes, `M ${X0} ${YT - 10} L ${X0} ${YT - 26}`, { stroke: C.ink, width: 3, head: 10 });
    text(S.axes, X0 - 12, 222, 'Taux de défaillance', { size: 18, weight: 700, fill: C.ink });
    text(S.axes, X1 + 16, YB + 30, 'Âge de l’équipement', { size: 18, weight: 700, fill: C.ink, anchor: 'end' });

    // Libellés des périodes
    S.zl = ZONES.map(z => {
      const g = el('g');
      const cx = (xu(z.a) + xu(z.b)) / 2 + (z.dx || 0);
      text(g, cx, 282, z.name, { size: 21, weight: 700, fill: z.fg, anchor: 'middle' });
      text(g, cx, 306, z.sub, { size: 17, weight: 500, fill: z.fg, anchor: 'middle' });
      return { g, cx };
    });

    // Courbe (tracée jusqu'au curseur)
    const pts = [];
    for (let u = 0; u <= 1.0001; u += 0.004) pts.push(`${xu(u).toFixed(1)} ${yl(lam(u)).toFixed(1)}`);
    const clip = G.clipRect(X0 - 10, YT - 30, 0, YB - YT + 40);
    S.clip = clip.rect;
    S.curve = el('path', { d: 'M ' + pts.join(' L '), fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'clip-path': clip.url });
    S.dot = el('circle', { r: 8, fill: C.blue, stroke: C.white, 'stroke-width': 3 });
    S.cursor = el('line', { y1: YT - 10, y2: 700, stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' });

    // Frise des pannes
    S.rowF = el('g');
    text(S.rowF, 64, 606, 'Pannes', { size: 19, weight: 700, fill: C.ink });
    el('rect', { x: X0, y: 580, width: X1 - X0, height: 36, rx: 8, fill: C.pLav }, S.rowF);
    S.ticks = FAILS.map(u => el('rect', { x: xu(u) - 2.5, y: 582, width: 5, height: 32, rx: 2, fill: C.red }));

    // MTBF de chaque période
    S.rowM = el('g');
    text(S.rowM, 64, 676, 'MTBF', { size: 19, weight: 700, fill: C.ink });
    S.mt = ZONES.map(z => {
      const cx = (xu(z.a) + xu(z.b)) / 2;
      const w = Math.min(xu(z.b) - xu(z.a) - 30, KM / z.avg);
      const bar = el('rect', { x: cx - w / 2, y: 654, width: w, height: 30, rx: 8, fill: z.mt === 'long' ? C.green : C.red });
      const lab = text(G.svg, cx, 716, `MTBF ${z.mt}`, { size: 19, weight: 700, fill: z.fg, anchor: 'middle' });
      return { bar, lab, cx, w, z };
    });

    S.chute = G.blogChute('Votre référence, c’est votre relevé du mois dernier.', { y: 812 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const u = t < FADE_END ? 1 : clamp((t - CUR0) / (CUR1 - CUR0));

    S.zbg.setAttribute('opacity', o * (live ? clamp(prog(t, 1.9, 0.4)) : 1));
    pop(S.axes, t, 1.75, 600, 400);
    S.zl.forEach((z, i) => pop(z.g, t, tOf(ZONES[i].a) + 0.05, z.cx, 290));

    S.clip.setAttribute('width', xu(u) - X0 + 10);
    S.curve.setAttribute('opacity', o);
    const running = live && t >= CUR0 - 0.1 && t < CUR1 + 0.4;
    S.dot.setAttribute('cx', xu(u));
    S.dot.setAttribute('cy', yl(lam(u)));
    S.dot.setAttribute('opacity', running ? 1 : 0);
    S.cursor.setAttribute('x1', xu(u));
    S.cursor.setAttribute('x2', xu(u));
    S.cursor.setAttribute('opacity', running ? 0.7 : 0);

    S.rowF.setAttribute('opacity', o * (live ? clamp(prog(t, 2.2, 0.3)) : 1));
    S.rowM.setAttribute('opacity', o * (live ? clamp(prog(t, 2.3, 0.3)) : 1));
    S.ticks.forEach((tk, i) => {
      const tf = tOf(FAILS[i]);
      const p = live ? prog(t, tf, 0.18) : 1;
      tk.setAttribute('opacity', o * (p > 0 ? 1 : 0));
      tk.setAttribute('height', 32 * easeOut(p));
      tk.setAttribute('y', 582 + 32 * (1 - easeOut(p)));
    });
    // La barre MTBF d'une période grandit pendant qu'on la traverse
    S.mt.forEach(m => {
      const p = live ? easeInOut(prog(t, tOf(m.z.a), tOf(m.z.b) - tOf(m.z.a))) : 1;
      m.bar.setAttribute('width', Math.max(0.001, m.w * p));
      m.bar.setAttribute('x', m.cx - m.w * p / 2);
      m.bar.setAttribute('opacity', o * (live ? clamp(prog(t, tOf(m.z.a), 0.2)) : 1));
      m.lab.setAttribute('opacity', o * (live ? clamp(prog(t, tOf(m.z.b) - 0.2, 0.3)) : 1));
    });

    rise(S.chute, t, 11.6, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
