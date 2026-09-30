// Blog · MTBF et MTTR · section « Quelle est la différence entre MTBF et MTTR ? » (refait les images 3_MTBF et 1_MTTR)
// Mécanique : une frise de 14 h requises se déroule, la machine tombe 3 fois. Les périodes de marche (vert) partent
// dans la carte MTBF, s'alignent bout à bout (12 h) et se partagent en 3 : 4 h. Les arrêts (rouge) partent dans la carte
// MTTR, s'alignent (2 h) et se partagent en 3 : 40 min. Deux questions opposées sur la même frise.
// Hypothèse : durées individuelles des marches (3 h 10, 4 h 20, 2 h 50, 1 h 40) et des arrêts (30, 55, 35 min) ;
// l'article ne donne que les totaux (12 h, 2 h, 3 pannes).
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const X0 = 190, PXH = 940 / 14, FY = 298, FH = 50;
  const xh = h => X0 + h * PXH;
  // Segments de la frise, en heures
  const SEG = [];
  [[190, 'run'], [30, 'stop'], [260, 'run'], [55, 'stop'], [170, 'run'], [35, 'stop'], [100, 'run']].reduce((a, [m, k]) => {
    SEG.push({ a: a / 60, d: m / 60, m, k });
    return a + m;
  }, 0);
  const RUNS = SEG.filter(s => s.k === 'run'), STOPS = SEG.filter(s => s.k === 'stop');
  const fmt = m => (m >= 60 ? `${Math.floor(m / 60)}${NB}h${m % 60 ? NB + String(m % 60).padStart(2, '0') : ''}` : `${m}${NB}min`);
  // Piles d'arrivée : MTBF 12 h sur 480 px, MTTR 2 h sur 480 px
  const ST = { run: { x: 70, y: 548, k: 40 }, stop: { x: 640, y: 548, k: 240 } };
  const CUR0 = 2.3, CUR1 = 6.5;
  const tOf = h => CUR0 + (CUR1 - CUR0) * h / 14;

  function build() {
    G.templateBlog();
    G.blogTitle('MTBF, MTTR :', 'deux questions.');
    G.blogChapeau('La même journée de 14 h requises, 3 pannes : ce que chaque indicateur mesure.');

    // ----- Carte 1 : la frise -----
    G.card(40, 176, 1120, 234);
    S.head = el('g');
    text(S.head, 70, 216, 'Une journée de 14 h requises', { size: 21, weight: 700, fill: C.ink });
    [[C.green, 'marche'], [C.red, 'panne, remise en service']].reduce((lx, [c, s]) => {
      el('rect', { x: lx, y: 201, width: 16, height: 16, rx: 4, fill: c }, S.head);
      const tt = text(S.head, lx + 24, 215, s, { size: 17, weight: 500, fill: C.ink });
      return measure(tt).x + measure(tt).width + 24;
    }, 760);
    S.machG = el('g');
    S.mach = G.machine(S.machG, 70, 292, 0.5);

    S.track = el('rect', { x: X0, y: FY, width: 940, height: FH, rx: 8, fill: C.pLav });
    const clip = G.clipRect(X0, FY - 2, 0, FH + 4);
    S.clip = clip.rect;
    S.fr = el('g', { 'clip-path': clip.url });
    SEG.forEach(s => el('rect', { x: xh(s.a), y: FY, width: s.d * PXH, height: FH, fill: s.k === 'run' ? C.green : C.red }, S.fr));
    S.frame = el('rect', { x: X0, y: FY, width: 940, height: FH, rx: 8, fill: 'none', stroke: C.card, 'stroke-width': 5 });
    S.axis = el('g');
    for (let h = 0; h <= 14; h += 2) {
      el('line', { x1: xh(h), y1: FY + FH + 4, x2: xh(h), y2: FY + FH + 11, stroke: '#b9b9d0', 'stroke-width': 2 }, S.axis);
      text(S.axis, xh(h), FY + FH + 31, `${h}${NB}h`, { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });
    }
    S.cursor = el('line', { y1: FY - 12, y2: FY + FH + 12, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });
    S.segLab = SEG.map(s => {
      const cx = xh(s.a + s.d / 2);
      return s.k === 'run'
        ? text(G.svg, cx, FY + 32, fmt(s.m), { size: 18, weight: 700, fill: C.white, anchor: 'middle' })
        : text(G.svg, cx, FY - 12, fmt(s.m), { size: 17, weight: 700, fill: C.tRed, anchor: 'middle' });
    });

    // ----- Cartes MTBF et MTTR -----
    const box = (x, k, q, color, bg) => {
      G.card(x, 426, 550, 334);
      const g = el('g');
      G.pill(g, x + 30, 462, k, { size: 21, h: 38, bg: color, fg: C.white });
      text(g, x + 30, 510, q, { size: 21, weight: 700, fill: C.ink });
      el('rect', { x: x + 30, y: ST.run.y, width: 480, height: 40, rx: 8, fill: bg }, g);
      return g;
    };
    S.boxR = box(40, 'MTBF', 'Combien de temps ça tient ?', C.blue, C.pLav);
    S.boxS = box(610, 'MTTR', 'Combien de temps on reste à l’arrêt ?', C.red, C.pLav);

    // Copies volantes des segments
    S.fly = SEG.map(s => ({ s, r: el('rect', { x: 0, y: 0, width: 0, height: FH, rx: 4, fill: s.k === 'run' ? C.green : C.red }) }));
    // Position d'arrivée dans la pile
    let acc = { run: 0, stop: 0 };
    S.fly.forEach(f => { f.off = acc[f.s.k]; acc[f.s.k] += f.s.d; });

    const result = (x, st, n, parts, formula, big, qual, up, color) => {
      const g = el('g');
      for (let i = 1; i < n; i++) el('line', { x1: x + 30 + i * 160, y1: st.y - 6, x2: x + 30 + i * 160, y2: st.y + 46, stroke: C.ink, 'stroke-width': 3 }, g);
      for (let i = 0; i < n; i++) text(g, x + 30 + 80 + i * 160, st.y + 27, parts, { size: 18, weight: 700, fill: C.white, anchor: 'middle' });
      const f = el('g');
      const ft = text(f, x + 30, 630, formula, { size: 20, weight: 500, fill: C.ink });
      fit(ft, x + 530, `formule ${big}`);
      const b = el('g');
      text(b, x + 30, 692, big, { size: 40, weight: 800, fill: color });
      const q = el('g');
      const qt = text(q, x + 62, 736, qual, { size: 19, weight: 700, fill: color });
      const ax = x + 42;
      G.arrow(q, up ? `M ${ax} 742 L ${ax} 720` : `M ${ax} 718 L ${ax} 740`, { stroke: color, width: 3.5, head: 8 });
      fit(qt, x + 530, `qualité ${big}`);
      return { g, f, b, q };
    };
    S.resR = result(40, ST.run, 3, `4${NB}h`, `12${NB}h de fonctionnement ÷ 3 pannes = 4${NB}h`, `MTBF = 4${NB}h`, 'Fiabilité : le plus haut possible', true, C.blue);
    S.resS = result(610, ST.stop, 3, `40${NB}min`, `2${NB}h d’arrêt ÷ 3 réparations = 40${NB}min`, `MTTR = 40${NB}min`, 'Maintenabilité : le plus bas possible', false, C.tRed);

    S.chute = G.blogChute('Séparer la fréquence des pannes de la durée des arrêts.', { y: 812 });
  }

  // ---------- Chronologie ----------
  const FLY_R = 7.0, FLY_S = 10.2, FLY_STEP = 0.35, FLY_D = 0.6;
  const CHUTE_T = 13.8;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const h = t < FADE_END ? 14 : 14 * clamp((t - CUR0) / (CUR1 - CUR0));

    pop(S.head, t, 1.8, 600, 210);
    pop(S.machG, t, 1.9, 115, 323);
    S.track.setAttribute('opacity', o * (live ? clamp(prog(t, 2.0, 0.3)) : 1));
    S.axis.setAttribute('opacity', o * (live ? clamp(prog(t, 2.0, 0.3)) : 1));
    S.clip.setAttribute('width', h * PXH);
    S.fr.setAttribute('opacity', o);
    S.frame.setAttribute('opacity', o);
    const running = live && t >= CUR0 - 0.1 && t < CUR1 + 0.3;
    S.cursor.setAttribute('x1', xh(h));
    S.cursor.setAttribute('x2', xh(h));
    S.cursor.setAttribute('opacity', running ? 1 : 0);
    const inStop = STOPS.some(s => h >= s.a && h < s.a + s.d);
    S.mach.lights[1].setAttribute('fill', running && inStop ? C.red : C.green);
    S.segLab.forEach((l, i) => l.setAttribute('opacity', o * (live ? clamp(prog(t, tOf(SEG[i].a + SEG[i].d), 0.25)) : 1)));

    pop(S.boxR, t, 2.4, 315, 500);
    pop(S.boxS, t, 2.55, 885, 500);

    // Vols : chaque segment rejoint sa pile (vert vers MTBF, rouge vers MTTR)
    let iR = 0, iS = 0;
    S.fly.forEach(f => {
      const run = f.s.k === 'run';
      const k = run ? iR++ : iS++;
      const t0 = (run ? FLY_R : FLY_S) + FLY_STEP * k;
      const st = ST[f.s.k], bx = run ? 40 : 610;
      const p = live ? easeInOut(prog(t, t0, FLY_D)) : 1;
      const x = xh(f.s.a) + (bx + 30 + f.off * st.k - xh(f.s.a)) * p;
      const y = FY + (st.y - FY) * p;
      const w = f.s.d * (PXH + (st.k - PXH) * p);
      const hh = FH + (40 - FH) * p;
      f.r.setAttribute('x', x);
      f.r.setAttribute('y', y);
      f.r.setAttribute('width', w);
      f.r.setAttribute('height', hh);
      f.r.setAttribute('opacity', o * (live ? (t >= t0 ? 1 : 0) : 1));
    });

    // Partage en trois, formule, résultat
    [[S.resR, FLY_R + 3 * FLY_STEP + FLY_D + 0.2, 315], [S.resS, FLY_S + 2 * FLY_STEP + FLY_D + 0.2, 885]].forEach(([r, T, cx]) => {
      pop(r.g, t, T, cx, 568);
      rise(r.f, t, T + 0.4);
      pop(r.b, t, T + 0.8, cx - 150, 680);
    });
    pop(S.resR.q, t, 12.9, 240, 730);
    pop(S.resS.q, t, 13.1, 810, 730);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
