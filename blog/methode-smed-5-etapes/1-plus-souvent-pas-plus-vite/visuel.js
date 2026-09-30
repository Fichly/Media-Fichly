// Blog · SMED · section « Pourquoi réduire vos temps de changement de série ? »
// Mécanique : même machine, même demande (trois références, un carton de chacune par jour, enlevé le soir).
// En haut, changement de 2 h : on fait de grandes séries pour amortir le réglage, le stock monte et dort.
// En bas, changement de 20 min : chaque référence chaque jour, le stock reste au ras du sol.
// La semaine est simulée au chargement (déterministe). Boucle de 15 s, image complète à t = 0.
(() => {
  // Le gabarit ne précharge pas la graisse 600 : la charger avant la construction
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const SIM0 = 2.8, SIM_D = 9.2, HOURS = 40;
  const hAt = t => (t < FADE_END ? HOURS : HOURS * prog(t, SIM0, SIM_D));
  const tAt = h => SIM0 + SIM_D * h / HOURS;
  const TL = { x0: 64, x1: 760 };
  const PX = (TL.x1 - TL.x0) / HOURS;
  const REF = [{ n: 'A', c: C.lightBlue }, { n: 'B', c: C.teal }, { n: 'C', c: C.violet }];
  const PILE_X = [846, 916, 986];
  const CLIENT_X = 1086;

  // Plannings : blocs { r (0-2 référence, -1 changement), h0, h1 }
  function plan(long) {
    const b = [];
    if (long) {
      [0, 1, 2].forEach(r => { b.push({ r, h0: 12 * r, h1: 12 * r + 10 }); b.push({ r: -1, h0: 12 * r + 10, h1: 12 * r + 12 }); });
    } else {
      for (let d = 0; d < 5; d++) [0, 1, 2].forEach(r => {
        const s = 8 * d + r * (2 + 1 / 3);
        b.push({ r, h0: s, h1: s + 2 });
        b.push({ r: -1, h0: s + 2, h1: s + 2 + 1 / 3 });
      });
    }
    return b;
  }
  // Simulation : un carton toutes les 2 h de production, un carton de chaque référence enlevé en fin de journée
  function simulate(long) {
    const blocks = plan(long);
    const init = long ? [0, 1, 3] : [0, 0, 0];
    const ev = [];
    blocks.forEach(bk => { if (bk.r >= 0) for (let h = bk.h0 + 2; h <= bk.h1 + 1e-6; h += 2) ev.push({ h, r: bk.r, d: +1 }); });
    for (let d = 1; d <= 5; d++) [0, 1, 2].forEach(r => ev.push({ h: 8 * d, r, d: -1, ship: true }));
    ev.sort((a, b) => a.h - b.h || b.d - a.d);
    // Stock moyen (intégrale sur la semaine)
    const n = init.slice();
    let last = 0, area = 0;
    ev.forEach(e => { area += (n[0] + n[1] + n[2]) * (e.h - last); last = e.h; n[e.r] += e.d; });
    area += (n[0] + n[1] + n[2]) * (HOURS - last);
    const stops = blocks.filter(b => b.r < 0);
    return { blocks, init, ev, avg: area / HOURS, series: blocks.filter(b => b.r >= 0).length, stops, stopH: stops.reduce((a, b) => a + b.h1 - b.h0, 0) };
  }
  const countAt = (L, r, h) => L.sim.init[r] + L.sim.ev.filter(e => e.r === r && e.h <= h).reduce((a, e) => a + e.d, 0);

  const LANES = [
    { y0: 176, long: true, pill: 'Changement de série : 2 h', sub: 'Grandes séries pour amortir le réglage.' },
    { y0: 474, long: false, pill: 'Après SMED : 20 min', sub: 'Chaque référence, chaque jour.' },
  ];
  const S = { lanes: [] };

  function person(parent, cx, floor) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 58, r: 13, fill: C.blue }, g);
    el('path', { d: `M ${cx - 22} ${floor} L ${cx - 22} ${floor - 20} Q ${cx - 22} ${floor - 39} ${cx} ${floor - 39} Q ${cx + 22} ${floor - 39} ${cx + 22} ${floor - 20} L ${cx + 22} ${floor} Z`, fill: C.blue }, g);
    return g;
  }
  const fmt = v => v.toFixed(1).replace('.', ',');

  function build() {
    G.templateBlog();
    G.blogTitle('Plus souvent,', 'pas plus vite.');
    G.blogChapeau('Même machine, même demande : trois références, un carton de chacune par jour.');

    LANES.forEach((ln, li) => {
      const L = { ...ln, sim: simulate(ln.long) };
      const Y0 = ln.y0;
      G.card(40, Y0, 1120, 282);
      const p = G.pill(G.svg, 64, Y0 + 36, ln.pill, { size: 20, h: 36, bg: ln.long ? C.pRed : C.pGreen, fg: ln.long ? C.tRed : C.tGreen });
      text(G.svg, 64 + p.w + 14, Y0 + 43, ln.sub, { size: 19, weight: 500, fill: C.ink });

      // Frise de la semaine
      const ty = Y0 + 72, th = 40;
      L.ty = ty;
      el('rect', { x: TL.x0, y: ty, width: TL.x1 - TL.x0, height: th, rx: 8, fill: C.pLav, opacity: 0.6 });
      const clip = G.clipRect(TL.x0, ty - 4, TL.x1 - TL.x0, th + 8);
      L.clip = clip.rect;
      L.tl = el('g', { 'clip-path': clip.url });
      L.sim.blocks.forEach(bk => {
        const x = TL.x0 + bk.h0 * PX, w = (bk.h1 - bk.h0) * PX;
        el('rect', { x: x + 0.5, y: ty, width: Math.max(1, w - 1), height: th, rx: bk.r < 0 ? 2 : 6, fill: bk.r < 0 ? C.red : REF[bk.r].c }, L.tl);
        if (bk.r >= 0) text(L.tl, x + w / 2, ty + 27, REF[bk.r].n, { size: 19, weight: 700, fill: C.white, anchor: 'middle' });
        else if (w > 30) text(L.tl, x + w / 2, ty + 26, '2 h', { size: 15, weight: 700, fill: C.white, anchor: 'middle' });
      });
      for (let d = 0; d <= 5; d++) el('line', { x1: TL.x0 + 8 * d * PX, y1: ty + th + 4, x2: TL.x0 + 8 * d * PX, y2: ty + th + 12, stroke: C.ink, 'stroke-width': 2, opacity: 0.4 });
      ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].forEach((s, d) => text(G.svg, TL.x0 + (8 * d + 4) * PX, ty + th + 30, s, { size: 17, weight: 600, fill: C.ink, anchor: 'middle' }));
      L.head = el('line', { x1: 0, y1: ty - 8, x2: 0, y2: ty + th + 8, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });

      // Compteurs
      const chip = (x, label, color) => {
        const g = el('g');
        text(g, x, Y0 + 204, label, { size: 17, weight: 500, fill: C.ink });
        const v = text(g, x, Y0 + 246, '', { size: 32, weight: 800, fill: color });
        return { g, v };
      };
      L.cSeries = chip(64, 'Séries lancées', C.blue);
      L.cStop = chip(284, 'Arrêts de changement', C.tRed);
      L.cAvg = chip(524, 'Stock moyen', ln.long ? C.tRed : C.tGreen);

      // Stocks et client
      const floor = Y0 + 232;
      L.floor = floor;
      el('line', { x1: 806, y1: floor + 2, x2: 1136, y2: floor + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });
      text(G.svg, 916, Y0 + 44, 'Stock', { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
      L.piles = REF.map((rf, r) => {
        text(G.svg, PILE_X[r], floor + 26, rf.n, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
        return Array.from({ length: 6 }, (_, i) => G.carton(G.svg, PILE_X[r], floor - 14 - 29 * i, 0.86, rf.c));
      });
      person(G.svg, CLIENT_X, floor);
      text(G.svg, CLIENT_X, floor + 26, 'Client', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      // Cartons enlevés chaque soir
      L.ships = L.sim.ev.filter(e => e.ship).map(e => ({ e, g: G.carton(G.svg, 0, 0, 0.86, REF[e.r].c) }));
      S.lanes.push(L);
    });

    S.chute = G.blogChute('Le SMED sert à produire plus souvent ce que le client attend.', { y: 810 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const h = hAt(t);

    S.lanes.forEach((L, li) => {
      // Frise dessinée au fil de la semaine
      L.clip.setAttribute('width', Math.max(0.001, h * PX));
      L.tl.setAttribute('opacity', o);
      const hx = TL.x0 + h * PX;
      L.head.setAttribute('x1', hx);
      L.head.setAttribute('x2', hx);
      L.head.setAttribute('opacity', live && t >= SIM0 - 0.3 && t < SIM0 + SIM_D + 0.3 ? 1 : 0);

      // Stocks
      REF.forEach((_, r) => {
        const n = live && t < SIM0 ? L.sim.init[r] : countAt(L, r, h);
        const appear = live ? clamp(prog(t, 2.0 + 0.1 * r, 0.3)) : o;
        L.piles[r].forEach((c, i) => c.setAttribute('opacity', i < n ? appear : 0));
      });
      // Cartons enlevés par le client (fin de journée)
      L.ships.forEach(({ e, g }) => {
        const ts = tAt(e.h);
        const p = live ? prog(t, ts, 0.45) : 1;
        const on = live && p > 0 && p < 1;
        g.setAttribute('opacity', on ? 1 : 0);
        if (!on) return;
        const n0 = countAt(L, e.r, e.h - 1e-6);
        const a = { x: PILE_X[e.r], y: L.floor - 14 - 29 * Math.max(0, n0 - 1) }, b = { x: CLIENT_X + 26, y: L.floor - 40 };
        const q = easeInOut(p);
        g.setAttribute('transform', `translate(${a.x + (b.x - a.x) * q} ${a.y + (b.y - a.y) * q - 40 * Math.sin(Math.PI * p)})`);
      });

      // Compteurs
      const started = L.sim.blocks.filter(b => b.r >= 0 && b.h0 < h - 1e-6 || (b.r >= 0 && h >= HOURS)).length;
      const stopH = L.sim.stops.reduce((a, b) => a + clamp(h - b.h0, 0, b.h1 - b.h0), 0);
      const nStops = L.sim.stops.filter(b => h > b.h0 + 1e-6).length;
      const show = live ? (t >= SIM0 ? 1 : 0) : o;
      L.cSeries.v.textContent = String(started);
      L.cStop.v.textContent = L.long ? `${nStops}${NB}×${NB}2${NB}h` : `${nStops}${NB}×${NB}20${NB}min`;
      L.cSeries.g.setAttribute('opacity', show);
      L.cStop.g.setAttribute('opacity', show);
      L.cAvg.v.textContent = `${fmt(L.sim.avg)}${NB}carton${L.sim.avg >= 2 ? 's' : ''}`;
      pop(L.cAvg.g, t, SIM0 + SIM_D + 0.2 + 0.25 * li, 620, L.y0 + 230);
    });
    rise(S.chute, t, SIM0 + SIM_D + 0.9, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
