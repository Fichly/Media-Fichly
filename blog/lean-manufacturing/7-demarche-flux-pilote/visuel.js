// Blog · Lean Manufacturing · section « Par où commencer : une démarche en 5 étapes »
// Mécanique : dans l'usine, on écarte le flux le plus problématique et on choisit un flux pilote ;
// puis les cinq étapes transforment ce flux sous nos yeux : suivre la pièce et relever le point de départ,
// réparer les pannes, baisser les encours (chaque baisse fait apparaître un problème, traité), installer la routine.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, slide, pulse } = G;

  const STEPS = [
    { t: 2.3, title: 'Choisir un flux pilote', sub: 'Représentatif, volume régulier, équipe volontaire.' },
    { t: 4.4, title: 'Suivre le produit', sub: 'Relever le point de départ avant d’agir.' },
    { t: 6.9, title: 'Stabiliser', sub: '5S, standards, pannes les plus fréquentes.' },
    { t: 8.9, title: 'Faire circuler', sub: 'Baisser les encours, raccourcir les séries.' },
    { t: 11.3, title: 'Installer la routine', sub: 'Indicateurs au poste, point court, un responsable par écart.' },
  ];
  const STEP_END = 13.3, CHUTE_T = 13.7;
  const MINI = { x0: 150, dx: 100, n: 4, y: [230, 256, 282, 308] };
  const PILOT_ROW = 1, BAD_ROW = 3;
  const FLOOR = 522;
  const ST = [130, 290, 450, 610];
  const PILES = [{ cx: 210, n0: 4, n1: 2 }, { cx: 370, n0: 6, n1: 2 }, { cx: 530, n0: 3, n1: 1 }];
  const BROKEN = [1, 2];                  // postes en panne au départ (réparés à l'étape 3)

  const S = {};

  function slots(cx) {
    const out = [];
    [3, 2, 1].forEach((n, r) => { for (let i = 0; i < n; i++) out.push({ x: cx + (i - (n - 1) / 2) * 24, y: FLOOR - 12 - 24 * r }); });
    return out;
  }
  function bolt(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 13, fill: C.red, stroke: C.white, 'stroke-width': 2.5 }, g);
    el('path', { d: `M ${cx + 2} ${cy - 8} L ${cx - 5} ${cy + 1} L ${cx} ${cy + 1} L ${cx - 2} ${cy + 8} L ${cx + 5} ${cy - 1} L ${cx} ${cy - 1} Z`, fill: C.white }, g);
    return g;
  }
  function stopwatch(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: cy + 2, r: 13, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
    el('rect', { x: cx - 4, y: cy - 16, width: 8, height: 5, rx: 2, fill: C.blue }, g);
    const hand = el('line', { x1: cx, y1: cy + 2, x2: cx, y2: cy - 6, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    return { g, hand };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Un flux pilote,', 'pas toute l’usine.');
    G.blogChapeau('Un flux, une équipe, quelques semaines : la démarche en 5 étapes.');

    // ----- L'usine (miniature) -----
    G.card(40, 176, 690, 160);
    text(G.svg, 64, 206, 'L’usine', { size: 17, weight: 700, fill: C.blue });
    S.rows = MINI.y.map((y, r) => {
      const g = el('g');
      text(g, 64, y + 5, `Flux ${r + 1}`, { size: 15, weight: 600, fill: C.ink });
      el('line', { x1: MINI.x0, y1: y, x2: MINI.x0 + (MINI.n - 1) * MINI.dx, y2: y, stroke: C.line, 'stroke-width': 3 }, g);
      for (let i = 0; i < MINI.n; i++) el('rect', { x: MINI.x0 + i * MINI.dx - 8, y: y - 8, width: 16, height: 16, rx: 4, fill: C.blue, opacity: 0.8 }, g);
      if (r === BAD_ROW) [1, 2, 3].forEach(i => el('circle', { cx: MINI.x0 + i * MINI.dx + 12, cy: y - 9, r: 5, fill: C.red }, g));
      return g;
    });
    S.cursor = el('rect', { x: 56, y: 0, width: 658, height: 24, rx: 12, fill: 'none', stroke: C.blue, 'stroke-width': 3, opacity: 0 });
    S.avoid = el('g');
    const av = G.pill(S.avoid, 0, MINI.y[BAD_ROW], 'À éviter pour commencer', { size: 15, h: 24, pad: 10, bg: C.pRed, fg: C.tRed });
    av.g.setAttribute('transform', `translate(${706 - av.w} 0)`);
    S.avoidC = 706 - av.w / 2;
    S.pilotTag = el('g');
    const pt = G.pill(S.pilotTag, 0, MINI.y[PILOT_ROW], 'Flux pilote', { size: 15, h: 24, pad: 10, bg: C.blue, fg: C.white });
    pt.g.setAttribute('transform', `translate(${706 - pt.w} 0)`);
    S.pilotC = 706 - pt.w / 2;

    // ----- Le flux pilote (détail) -----
    S.detail = el('g');
    el('rect', { x: 40, y: 350, width: 690, height: 406, rx: 24, fill: C.card, stroke: C.blue, 'stroke-width': 2.5 }, S.detail);
    text(S.detail, 64, 384, 'Le flux pilote', { size: 18, weight: 700, fill: C.blue });
    el('line', { x1: 64, y1: FLOOR + 2, x2: 706, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.detail);
    S.machines = ST.map((cx, i) => {
      const m = G.machine(S.detail, cx - 40.5, FLOOR - 56, 0.45);
      const b = bolt(S.detail, cx + 38, FLOOR - 58);
      const ok = el('g', {}, S.detail);
      G.check(ok, cx + 38, FLOOR - 58, 13);
      return { m, b, ok, broken: BROKEN.includes(i) };
    });
    S.piles = PILES.map(p => ({ ...p, boxes: slots(p.cx).slice(0, p.n0).map(s => G.carton(S.detail, s.x, s.y, 0.7)) }));
    // Pièce suivie et chronomètre (étape 2)
    S.token = el('g', {}, S.detail);
    el('rect', { x: -11, y: -11, width: 22, height: 22, rx: 6, fill: C.blue, stroke: C.white, 'stroke-width': 2 }, S.token);
    el('circle', { cx: 0, cy: 0, r: 4, fill: C.white }, S.token);
    S.watch = stopwatch(S.detail, 690, 396);
    // Problème révélé par la baisse d'encours (étape 4)
    S.issue = el('g', {}, S.detail);
    const ip = G.pill(S.issue, ST[2], FLOOR - 92, 'changement de série long', { size: 15, h: 26, pad: 10, bg: C.pRed, fg: C.tRed, icon: 'cross', anchor: 'middle' });
    S.issueOk = el('g', {}, S.detail);
    G.pill(S.issueOk, ST[2], FLOOR - 92, 'SMED : série raccourcie', { size: 15, h: 26, pad: 10, bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' });

    // Relevé du point de départ
    S.releve = el('g', {}, S.detail);
    text(S.releve, 64, 574, 'Le point de départ, relevé avant d’agir', { size: 17, weight: 700, fill: C.ink });
    let x = 64;
    S.chips = ['Temps de traversée', 'Temps de transformation', 'Encours'].map(s => {
      const g = el('g', {}, S.releve);
      const p = G.pill(g, x, 606, s, { size: 16, h: 30, pad: 12, bg: C.pLav, fg: C.blue, icon: 'check' });
      const c = { g, cx: x + p.w / 2 };
      x += p.w + 10;
      return c;
    });
    // Routine (étape 5) : tableau au poste
    S.board = el('g', {}, S.detail);
    el('rect', { x: 64, y: 650, width: 86, height: 76, rx: 10, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, S.board);
    [[80, 26, C.green], [100, 40, C.green], [120, 18, C.yellow]].forEach(([bx, h, c]) => el('rect', { x: bx, y: 712 - h, width: 14, height: h, rx: 3, fill: c }, S.board));
    el('line', { x1: 76, y1: 714, x2: 138, y2: 714, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.board);
    text(S.board, 170, 680, 'Indicateurs affichés au poste', { size: 18, weight: 700, fill: C.ink });
    text(S.board, 170, 708, 'Point court et régulier, un responsable par écart', { size: 17, weight: 500, fill: C.ink });
    S.boardLoop = el('g', {}, S.board);
    G.arrow(S.boardLoop, 'M 612 694 A 26 26 0 1 1 640 720', { width: 3.5, head: 9 });

    // ----- Les 5 étapes -----
    G.card(750, 176, 410, 580);
    el('line', { x1: 786, y1: 232, x2: 786, y2: 648, stroke: C.line, 'stroke-width': 5, 'stroke-linecap': 'round' });
    S.progress = el('line', { x1: 786, y1: 232, x2: 786, y2: 232, stroke: C.green, 'stroke-width': 5, 'stroke-linecap': 'round' });
    S.steps = STEPS.map((s, i) => {
      const cy = 232 + 104 * i;
      const hl = el('rect', { x: 762, y: cy - 34, width: 386, height: 92, rx: 16, fill: C.pLav, opacity: 0 });
      const g = el('g');
      const todo = el('g', {}, g);
      G.badgeNum(todo, 786, cy, i + 1, 18);
      const done = el('g', { opacity: 0 }, g);
      G.check(done, 786, cy, 18);
      fit(text(g, 818, cy + 7, s.title, { size: 21, weight: 700, fill: C.ink }), 1148, `étape ${i + 1}`);
      G.para(g, 818, cy + 34, s.sub, 322, { size: 16, weight: 500, fill: C.ink, lh: 1.25 });
      return { g, hl, todo, done, cy };
    });

    S.chute = G.blogChute('C’est la routine, plus que les outils, qui fait tenir la démarche.', { y: 812 });
  }

  // ---------- Chronologie ----------
  const CUR = [{ t: 2.5, row: 0 }, { t: 2.9, row: BAD_ROW }, { t: 3.5, row: PILOT_ROW }];
  const TOKEN = { t0: 4.6, t1: 6.3 };
  const FIX = [7.2, 7.8];
  const SHRINK = [9.1, 9.5, 9.9];
  const ISSUE = { on: 9.6, fix: 10.4 };

  function tokenX(t) {
    // La pièce avance de poste en poste, et attend devant chaque stock
    const stops = [70, ST[0], PILES[0].cx, ST[1], PILES[1].cx, ST[2], PILES[2].cx, ST[3], 706];
    const n = stops.length - 1;
    const p = prog(t, TOKEN.t0, TOKEN.t1 - TOKEN.t0) * n;
    const k = Math.min(n - 1, Math.floor(p)), f = p - k;
    return stops[k] + (stops[k + 1] - stops[k]) * easeInOut(clamp(f * 1.6));
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    S.rows.forEach((g, r) => rise(g, t, 1.75 + 0.1 * r, 0.35, 8));

    // Étape 1 : le curseur passe sur les flux, écarte le plus problématique, s'arrête sur le pilote
    let cy = MINI.y[PILOT_ROW], co = 1;
    if (live) {
      co = t < CUR[0].t ? 0 : 1;
      for (let i = 0; i < CUR.length; i++) if (t >= CUR[i].t) {
        const a = i ? MINI.y[CUR[i - 1].row] : MINI.y[CUR[0].row];
        cy = a + (MINI.y[CUR[i].row] - a) * easeInOut(prog(t, CUR[i].t, 0.3));
      }
    } else co = o;
    S.cursor.setAttribute('y', cy - 12);
    S.cursor.setAttribute('opacity', co);
    pop(S.avoid, t, CUR[1].t + 0.25, S.avoidC, MINI.y[BAD_ROW]);
    pop(S.pilotTag, t, CUR[2].t + 0.3, S.pilotC, MINI.y[PILOT_ROW]);
    // Le détail du flux pilote s'ouvre depuis sa ligne
    {
      let s = 1, dy = 0, op = o;
      if (live) {
        const p = easeOut(prog(t, 3.95, 0.45));
        s = 0.3 + 0.7 * p; dy = (MINI.y[PILOT_ROW] - 553) * (1 - p); op = clamp(p * 3);
      }
      S.detail.setAttribute('transform', s === 1 ? '' : `translate(385 ${553 + dy}) scale(${s}) translate(-385 -553)`);
      S.detail.setAttribute('opacity', op);
    }

    // Étape 2 : suivre la pièce, relever trois chiffres
    const tokOn = live && t >= TOKEN.t0 - 0.1 && t < TOKEN.t1 + 0.2;
    S.token.setAttribute('opacity', tokOn ? 1 : 0);
    if (tokOn) S.token.setAttribute('transform', `translate(${tokenX(t)} ${FLOOR + 22})`);
    const wa = live ? 720 * prog(t, TOKEN.t0, TOKEN.t1 - TOKEN.t0) : 0;
    S.watch.hand.setAttribute('transform', wa === 0 || wa === 720 ? '' : `rotate(${wa} 690 398)`);
    S.releve.setAttribute('opacity', live ? clamp(prog(t, TOKEN.t1 - 0.2, 0.3)) : 1);
    S.chips.forEach((c, i) => { if (live) pop(c.g, t, TOKEN.t1 + 0.1 + 0.15 * i, c.cx, 606, 0.3); });

    // Étape 3 : les pannes sont traitées
    S.machines.forEach((m, i) => {
      const k = BROKEN.indexOf(i);
      const fixed = k < 0 ? true : live ? t >= FIX[k] : true;
      m.b.setAttribute('opacity', m.broken && !fixed ? 1 : 0);
      if (!m.broken) { m.ok.setAttribute('opacity', 0); return; }
      m.ok.setAttribute('opacity', fixed ? 1 : 0);
      if (fixed && live) pop(m.ok, t, FIX[k], ST[i] + 38, FLOOR - 58, 0.3);
    });

    // Étape 4 : les encours baissent ; la baisse révèle un problème, traité à son tour
    S.piles.forEach((p, j) => p.boxes.forEach((b, k) => {
      const gone = k >= p.n1 && (live ? t >= SHRINK[j] + 0.08 * (p.n0 - 1 - k) : true);
      const q = live && k >= p.n1 ? prog(t, SHRINK[j] + 0.08 * (p.n0 - 1 - k), 0.25) : gone ? 1 : 0;
      b.setAttribute('opacity', 1 - q);
    }));
    const issueO = live ? G.window01(t, ISSUE.on, ISSUE.fix, 0.2) : 0;
    S.issue.setAttribute('opacity', issueO);
    S.issueOk.setAttribute('opacity', live ? clamp(prog(t, ISSUE.fix, 0.25)) : 1);
    if (live && t >= ISSUE.on && t < ISSUE.on + 0.7) pulse(S.issue, t, ISSUE.on, ST[2], FLOOR - 92, 0.1, 0.4);

    // Étape 5 : la routine
    rise(S.board, t, STEPS[4].t + 0.2, 0.4, 12);
    const la = live ? 360 * easeInOut(prog(t, STEPS[4].t + 0.6, 1.0)) : 0;
    S.boardLoop.setAttribute('transform', la === 0 || la === 360 ? '' : `rotate(${la} 626 708)`);

    // Les étapes : surlignage de l'étape en cours, coche quand elle est faite, barre de progression
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

  G.start({ duration: 17, build, draw });
})();
