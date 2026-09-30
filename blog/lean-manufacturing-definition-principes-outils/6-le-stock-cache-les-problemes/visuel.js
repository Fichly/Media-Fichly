// Blog · Lean Manufacturing · fin de la section « Juste-à-temps et jidoka »
// Mécanique : la rivière des stocks. Le niveau d'eau est le stock, le bateau la production, les rochers les problèmes.
// Le juste-à-temps baisse le niveau : un rocher apparaît, le bateau s'arrête (andon rouge), on traite la cause
// avec l'outil qui répond (jidoka), le rocher s'aplanit, on repart, on baisse encore.
// Rendu déterministe : window.FICHE.draw(t), boucle de 19 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const RIVER = { x0: 196, x1: 1140 };
  const BED = 700;
  const LEVELS = [362, 440, 512, 582];
  const FLAT = 655;                    // sommet d'un rocher traité, sous le niveau final
  const ROCK_FILL = '#a3a3c8';
  const ROCKS = [
    { x: 890, w: 220, peak: 405, label: 'Pannes', tool: 'TPM', lx: 60 },
    { x: 660, w: 230, peak: 477, label: 'Changements de série longs', tool: 'SMED', lx: 95 },
    { x: 430, w: 210, peak: 547, label: 'Défauts récurrents', tool: 'Poka-yoke', lx: 60 },
  ];
  // Chronologie : pour chaque rocher, baisse du niveau, arrivée du bateau, choc, traitement, reprise
  const STEPS = [
    { lower: 4.1, from: 5.0, hit: null, treat: null, resume: 7.9, exit: 8.8 },
    { lower: 8.9, from: 9.8, hit: null, treat: null, resume: 12.2, exit: 13.3 },
    { lower: 13.4, from: 14.3, hit: null, treat: null, resume: 16.1, exit: 17.0 },
  ];
  const PASS0 = { from: 2.0, to: 4.0 };
  const LOWER_D = 0.8, SPEED = 460, FINAL_X = 720;
  const CHUTE_T = 16.6;

  const S = {};

  // Bord gauche du rocher à la hauteur y (pour le choc)
  function leftEdge(r, y) {
    const h = BED - r.peak;
    const pts = [[r.x - r.w / 2, BED], [r.x - r.w * 0.28, r.peak + h * 0.35], [r.x - r.w * 0.08, r.peak]];
    for (let i = 0; i < 2; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1];
      if (y <= ya && y >= yb) return xa + (xb - xa) * (ya - y) / (ya - yb);
    }
    return pts[2][0];
  }

  function rockPath(r) {
    const h = BED - r.peak;
    const P = [
      [r.x - r.w / 2, BED + 30], [r.x - r.w / 2, BED], [r.x - r.w * 0.28, r.peak + h * 0.35], [r.x - r.w * 0.08, r.peak],
      [r.x + r.w * 0.14, r.peak + 10], [r.x + r.w * 0.32, r.peak + h * 0.38], [r.x + r.w / 2, BED], [r.x + r.w / 2, BED + 30],
    ];
    return 'M ' + P.map(p => p.join(' ')).join(' L ') + ' Z';
  }

  function boat(parent) {
    const g = el('g', {}, parent);
    el('line', { x1: 38, y1: -14, x2: 38, y2: -62, stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    const light = el('circle', { cx: 38, cy: -66, r: 9, fill: C.green, stroke: C.white, 'stroke-width': 2.5 }, g);
    G.carton(g, -30, -28, 0.8);
    G.carton(g, -2, -28, 0.8);
    G.carton(g, -16, -52, 0.8);
    el('path', { d: 'M -64 -15 L 64 -15 L 48 15 L -48 15 Z', fill: C.blue, 'stroke-linejoin': 'round', stroke: C.blue, 'stroke-width': 4 }, g);
    text(g, 0, 7, 'Production', { size: 15, weight: 700, fill: C.white, anchor: 'middle' });
    return { g, light };
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le stock cache', 'les problèmes.');
    G.blogChapeau('Le juste-à-temps baisse le niveau. Le jidoka oblige à traiter ce qui apparaît.');

    G.card(40, 176, 1120, 580);
    const clip = G.clipRect(42, 178, 1116, 576);
    const scene = el('g', { 'clip-path': clip.url });
    S.scene = scene;

    // Légendes du haut
    S.caps = [
      'Beaucoup de stock : tout passe, les problèmes restent cachés.',
      'Chaque baisse de stock fait apparaître un problème : c’est le but.',
    ].map((s, i) => {
      const t = text(G.svg, 70, 218, s, { size: 23, weight: 700, fill: C.ink });
      fit(t, 1130, `légende ${i}`);
      return t;
    });
    S.legJ = el('g');
    const pj = G.pill(S.legJ, 70, 258, 'Juste-à-temps', { size: 19, h: 34, bg: C.blue, fg: C.white });
    text(S.legJ, 70 + pj.w + 12, 265, 'on baisse le stock', { size: 19, weight: 500, fill: C.ink });
    S.legK = el('g');
    const kt = text(S.legK, 1130, 265, 'on s’arrête et on traite la cause', { size: 19, weight: 500, fill: C.ink, anchor: 'end' });
    const kp = G.pill(S.legK, 0, 258, 'Jidoka', { size: 19, h: 34, bg: C.green, fg: C.white });
    kp.g.setAttribute('transform', `translate(${measure(kt).x - 12 - kp.w} 0)`);
    S.legKc = { x: measure(kt).x - 12 - kp.w / 2, y: 258 };

    // Lit de la rivière, rochers, eau
    el('path', { d: `M ${RIVER.x0} ${BED + 6} Q ${RIVER.x0 + 200} ${BED - 8} ${RIVER.x0 + 420} ${BED + 2} T ${RIVER.x1} ${BED} L ${RIVER.x1} 760 L ${RIVER.x0} 760 Z`, fill: C.pYellow }, scene);
    S.rocks = ROCKS.map(r => {
      const g = el('g', {}, scene);
      el('path', { d: rockPath(r), fill: ROCK_FILL, stroke: ROCK_FILL, 'stroke-width': 10, 'stroke-linejoin': 'round' }, g);
      el('path', { d: `M ${r.x - r.w * 0.1} ${r.peak + 22} L ${r.x + r.w * 0.06} ${r.peak + 30}`, stroke: C.white, 'stroke-opacity': 0.5, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      return { ...r, g };
    });
    S.water = el('rect', { x: RIVER.x0, y: LEVELS[0], width: RIVER.x1 - RIVER.x0, height: BED + 60 - LEVELS[0], fill: C.lightBlue, 'fill-opacity': 0.84 }, scene);
    S.surface = el('line', { x1: RIVER.x0, y1: LEVELS[0], x2: RIVER.x1, y2: LEVELS[0], stroke: C.lightBlue, 'stroke-width': 5 }, scene);
    el('line', { x1: RIVER.x0, y1: 300, x2: RIVER.x0, y2: 760, stroke: C.line, 'stroke-width': 4 }, scene);

    // Niveau de départ (pointillés) et flèche du juste-à-temps
    S.start = el('g', {}, scene);
    el('line', { x1: RIVER.x0, y1: LEVELS[0], x2: RIVER.x1, y2: LEVELS[0], stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, S.start);
    text(S.start, RIVER.x1 - 12, LEVELS[0] - 10, 'stock de départ', { size: 17, weight: 600, fill: C.blue, anchor: 'end' });
    S.jit = el('g', {}, scene);
    S.jitLine = el('line', { x1: 130, y1: LEVELS[0], x2: 130, y2: LEVELS[0], stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, S.jit);
    S.jitHead = el('path', { d: 'M 118 -12 L 130 0 L 142 -12', fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.jit);
    S.jitTicks = LEVELS.map(y => el('line', { x1: 112, y1: y, x2: 148, y2: y, stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.35 }, S.jit));
    text(S.jit, 130, 735, 'Stock', { size: 19, weight: 700, fill: C.blue, anchor: 'middle' });

    // Bateau (découpé sur la rivière : il entre par la gauche)
    const bclip = G.clipRect(RIVER.x0 + 2, 178, RIVER.x1 - RIVER.x0 - 2, 578);
    S.boat = boat(el('g', { 'clip-path': bclip.url }, scene));

    // Étiquettes des rochers et outils (au-dessus de l'eau pour rester lisibles)
    S.tags = S.rocks.map((r, i) => {
      const lab = el('g');
      const lp = G.pill(lab, 0, 0, r.label, { size: 17, h: 30, pad: 12, bg: C.pRed, fg: C.tRed, icon: 'cross' });
      lp.g.setAttribute('transform', `translate(${-lp.w / 2} 0)`);
      const tool = el('g');
      const tp = G.pill(tool, 0, 0, r.tool, { size: 17, h: 30, pad: 12, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
      tp.g.setAttribute('transform', `translate(${-tp.w / 2} 0)`);
      return { lab, tool, lw: lp.w };
    });

    S.chute = G.blogChute('Juste-à-temps et jidoka ne fonctionnent qu’ensemble.', { y: 812 });

    // Points de choc
    STEPS.forEach((s, i) => {
      const lvl = LEVELS[i + 1];
      const r = ROCKS[i];
      const xHit = leftEdge(r, lvl + 12) - 52;
      s.xHit = xHit;
      s.hit = s.from + (xHit - 120) / SPEED;
      s.treat = s.hit + 0.35;
    });
  }

  // ---------- Chronologie ----------
  function level(t) {
    if (t < FADE_END) return LEVELS[3];
    let y = LEVELS[0];
    STEPS.forEach((s, i) => { if (t >= s.lower) y = LEVELS[i] + (LEVELS[i + 1] - LEVELS[i]) * easeInOut(prog(t, s.lower, LOWER_D)); });
    return y;
  }
  // Position du bateau : x et secousse
  function boatX(t) {
    if (t < FADE_END) return { x: FINAL_X, stop: false };
    if (t < PASS0.from) return { x: 120, stop: false };
    if (t < STEPS[0].from) return { x: 120 + (1240 - 120) * prog(t, PASS0.from, PASS0.to - PASS0.from), stop: false };
    for (let i = 0; i < STEPS.length; i++) {
      const s = STEPS[i], next = STEPS[i + 1];
      const end = next ? next.from : Infinity;
      if (t >= end) continue;
      if (t < s.hit) return { x: 120 + SPEED * (t - s.from), stop: false };
      if (t < s.resume) return { x: s.xHit, stop: true, since: t - s.hit };
      const target = next ? 1240 : FINAL_X;
      const p = prog(t, s.resume, s.exit - s.resume);
      return { x: s.xHit + (target - s.xHit) * (next ? p : easeOut(p)), stop: false };
    }
    return { x: FINAL_X, stop: false };
  }

  function draw(t) {
    const live = t >= FADE_END;
    const lv = level(t);
    const o = fading(t) ? fadeOut(t) : 1;
    S.scene.setAttribute('opacity', o);
    S.water.setAttribute('y', lv);
    S.water.setAttribute('height', BED + 60 - lv);
    S.surface.setAttribute('y1', lv);
    S.surface.setAttribute('y2', lv);

    // Légende du haut : avant / après la première baisse
    const c1 = live ? clamp(prog(t, STEPS[0].lower, 0.4)) : 1;
    S.caps[0].setAttribute('opacity', live ? (1 - c1) * clamp(prog(t, 1.7, 0.3)) : 0);
    S.caps[1].setAttribute('opacity', c1 * o);
    pop(S.legJ, t, 1.9, 200, 258);
    pop(S.legK, t, 2.05, S.legKc.x, S.legKc.y);

    // Niveau de départ et flèche
    const dropped = LEVELS[0] - lv;
    S.start.setAttribute('opacity', clamp(-dropped / 20));
    S.jitLine.setAttribute('y2', lv);
    S.jitHead.setAttribute('transform', `translate(0 ${lv})`);
    S.jitHead.setAttribute('opacity', clamp(-dropped / 20));
    S.jitTicks.forEach((tk, i) => tk.setAttribute('opacity', lv >= LEVELS[i] - 0.5 ? 0.9 : 0.35));
    STEPS.forEach(s => { if (t >= s.lower && t < s.lower + LOWER_D + 0.3) pulse(S.legJ, t, s.lower, 200, 258, 0.07, LOWER_D); });

    // Rochers : s'aplanissent une fois traités
    S.rocks.forEach((r, i) => {
      const s = STEPS[i];
      const f = live ? easeInOut(prog(t, s.treat + 0.3, 0.8)) : 1;
      const peak = r.peak + (FLAT - r.peak) * f;
      const k = (BED - peak) / (BED - r.peak);
      r.g.setAttribute('transform', k === 1 ? '' : `translate(0 ${BED}) scale(1 ${k}) translate(0 ${-BED})`);
      // Étiquette du problème : apparaît quand le rocher sort de l'eau, suit son sommet
      const tag = S.tags[i];
      const ly = peak - 26;
      const shown = live ? prog(t, s.lower + LOWER_D * 0.7, 0.3) : 1;
      const sc = shown <= 0 ? 0.001 : shown >= 1 ? 1 : 0.6 + 0.4 * G.back(shown);
      tag.lab.setAttribute('transform', `translate(${r.x + r.lx} ${ly}) scale(${sc})`);
      tag.lab.setAttribute('opacity', o * clamp(shown / 0.4));
      const ts = live ? prog(t, s.treat, 0.35) : 1;
      const tsc = ts <= 0 ? 0.001 : ts >= 1 ? 1 : 0.6 + 0.4 * G.back(ts);
      tag.tool.setAttribute('transform', `translate(${r.x + r.lx} ${ly + 38}) scale(${tsc})`);
      tag.tool.setAttribute('opacity', o * clamp(ts / 0.4));
      if (live && t >= s.treat && t < s.treat + 0.8) pulse(S.legK, t, s.treat, S.legKc.x, S.legKc.y, 0.08, 0.45);
    });

    // Bateau : glisse, heurte, andon rouge, repart
    const b = boatX(t);
    let dx = 0, dy = 0;
    if (b.stop && b.since < 0.3) dx = -8 * Math.sin(b.since * 40) * (1 - b.since / 0.3);
    // Roulis périodique sur la durée de la boucle (15 oscillations en 19 s) : raccord sans saut
    if (!b.stop) dy = 2.2 * Math.sin(2 * Math.PI * 15 * t / 19);
    S.boat.g.setAttribute('transform', `translate(${b.x + dx} ${lv + dy})`);
    S.boat.light.setAttribute('fill', b.stop ? C.red : C.green);
    S.boat.light.setAttribute('r', b.stop && b.since < 0.6 ? 9 + 3 * Math.sin(Math.PI * b.since / 0.6) : 9);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 19, build, draw });
})();
