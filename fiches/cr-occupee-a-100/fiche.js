// Fiche LinkedIn · Clément Raymond · mardi 6 octobre 2026
// Post : « Une machine occupée à 100 % n'est pas forcément une bonne nouvelle. »
// Premier commentaire du post (Buffer) : article cartographie des flux (VSM) → encart bas gauche.
// Mécanique : l'indicateur dit « 100 % », le flux montre le stock qui grossit entre poste rapide et poste lent.
// Un contenu, quatre scénarios (node outils/rendu.js cr-occupee-a-100 gif 20 --scenario <nom>) :
//   reconstruction · tout s'efface puis revient dans l'ordre de lecture (défaut)
//   revelation     · on ne montre d'abord que l'indicateur « tout va bien », puis un volet révèle le stock
//   camera         · rien ne disparaît : gros plans en coupes (poste rapide, stock, poste lent, ✗, règle)
//   camera-fluide  · même découpage en vrais travellings, à sortir en MP4 (trop lourd en GIF)
//   simulation     · l'atelier tourne une journée : le poste rapide empile, le poste lent absorbe à peine
(() => {
  const G = window.Gabarit;
  const { C, W, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_START, FADE_END, fading, fadeOut, pop, slide, rise } = G;
  const NB = ' ';

  // Machine stylisée : corps bleu, écran avec jauge d'occupation, deux voyants
  function machine(parent, x, y) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: 180, height: 124, rx: 16, fill: C.blue }, g);
    el('rect', { x: x + 16, y: y + 16, width: 104, height: 40, rx: 8, fill: C.white }, g);
    el('rect', { x: x + 26, y: y + 30, width: 84, height: 12, rx: 6, fill: C.pLav }, g);
    const gauge = el('rect', { x: x + 26, y: y + 30, width: 84, height: 12, rx: 6, fill: C.green }, g);
    const lights = [
      el('circle', { cx: x + 148, cy: y + 26, r: 8, fill: C.lightBlue }, g),
      el('circle', { cx: x + 148, cy: y + 50, r: 8, fill: C.green }, g),
    ];
    el('rect', { x: x + 16, y: y + 72, width: 148, height: 36, rx: 8, fill: C.white, 'fill-opacity': 0.14 }, g);
    [0, 1, 2, 3].forEach(i => el('rect', { x: x + 30 + i * 34, y: y + 80, width: 18, height: 20, rx: 4, fill: C.white, 'fill-opacity': 0.35 }, g));
    return { g, gauge, lights };
  }
  const carton = (parent, x, y) => {
    const g = el('g', { transform: `translate(${x} ${y})` }, parent);
    el('rect', { x: -16, y: -16, width: 32, height: 32, rx: 5, fill: C.yellow }, g);
    el('line', { x1: -9, y1: -5, x2: 9, y2: -5, stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  };
  // Place un nœud dans un groupe sans transformation (pour les découpes)
  const wrap = (node, attrs) => {
    const w = el('g', attrs);
    node.parentNode.insertBefore(w, node);
    w.appendChild(node);
    return w;
  };
  // Petite pulsation d'insistance (identité hors de [t0, t0 + dur])
  function pulse(g, t, t0, cx, cy, amp = 0.08, dur = 0.4) {
    const p = prog(t, t0, dur);
    const s = p > 0 && p < 1 ? 1 + amp * Math.sin(Math.PI * p) : 1;
    g.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`);
  }

  const S = {};
  const FLOOR = 530;
  const SLOT0 = { x: 736, y: FLOOR - 16 };
  const FROM = { x: 296, y: FLOOR - 16 };

  function build() {
    G.template({ author: 'clement' });
    S.title = G.title(`Machine à 100${NB}%,`, 'le stock grossit.');

    // Chapeau en deux temps : la lecture de l'indicateur, puis celle du flux
    const c1 = text(svg(), 62, 304, 'Sur l’indicateur, tout va bien.', { size: 26, weight: 500, fill: C.blue });
    const c2 = text(svg(), 62 + measure(c1).width + 7, 304, 'Dans le flux, rien ne va plus vite.', { size: 26, weight: 500, fill: C.blue });
    fit(c2, 1020, 'chapeau');
    S.chap2 = c2;

    // ----- Carte 1 : l'atelier -----
    G.card(60, 330, 960, 310);
    el('line', { x1: 92, y1: FLOOR + 2, x2: 988, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });

    // Simulation : cartons que le poste lent tire du stock (sous le poste et sous la pile)
    S.pulls = [0, 1, 2, 3, 4].map(() => { const g = carton(svg(), SLOT0.x, SLOT0.y); g.setAttribute('opacity', 0); return g; });

    S.stations = [
      { x: 100, name: 'Poste rapide', sub: 'Produit à son rythme' },
      { x: 800, name: 'Poste lent', sub: 'Ne peut pas absorber' },
    ].map(({ x, name, sub }, i) => {
      const cx = x + 90;
      const g = el('g');
      const m = machine(g, x, FLOOR - 126);
      fit(text(g, cx, 570, name, { size: 24, weight: 700, fill: C.ink, anchor: 'middle' }), 1010, `nom poste ${i + 1}`, 70);
      const s = text(g, cx, 600, sub, { size: 21, weight: 500, fill: C.ink, anchor: 'middle' });
      fit(s, 1010, `sous-titre poste ${i + 1}`, 70);
      const pg = el('g');
      const p = G.pill(pg, cx, 372, `Occupée à 100${NB}%`, { bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' });
      fit(p.tx, 1010, `jauge poste ${i + 1}`, 70);
      return { g, pg, gauge: m.gauge, lights: m.lights, cx, sub: s };
    });

    // Sens du flux
    S.flow = el('g');
    S.chevrons = [330, 380, 430, 776].map(x => {
      const g = el('g', {}, S.flow);
      el('path', {
        d: `M ${x - 6} ${FLOOR - 32} L ${x + 4} ${FLOOR - 22} L ${x - 6} ${FLOOR - 12}`,
        fill: 'none', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }, g);
      return { g, x };
    });

    // Le stock : pyramide de cartons devant le poste lent, remplie du bas vers le haut, de droite à gauche
    S.pile = el('g');
    S.boxes = [];
    for (let r = 0; r < 4; r++) {
      for (let k = 5 - r; k >= 0; k--) {
        const sx = 540 + 18 * r + 36 * k + 16, sy = FLOOR - 16 - 36 * r;
        S.boxes.push({ g: carton(S.pile, sx, sy), sx, sy });
      }
    }
    S.stockPill = el('g');
    const sp = G.pill(S.stockPill, 630, 572, 'Le stock grossit', { bg: C.pRed, fg: C.tRed, icon: 'cross', anchor: 'middle' });
    G.noOverlap(sp.tx, S.stations[1].sub, 'étiquette stock / poste lent', 12);

    // Simulation : une journée à l'atelier (horloge)
    S.day = el('g', { opacity: 0 });
    const dp = G.pill(S.day, 540, 372, 'Une journée à l’atelier', { bg: C.pLav, fg: C.blue, anchor: 'middle' });
    const hx = dp.x + dp.w + 22;
    el('circle', { cx: hx, cy: 372, r: 16, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, S.day);
    S.dayHand = el('line', { x1: hx, y1: 372, x2: hx, y2: 361, stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.day);
    S.dayHandC = { x: hx, y: 372 };
    fit(S.day, 765, 'horloge journée', 315);

    // ----- Carte 2 : ce que ça coûte -----
    S.bad = el('g');
    el('rect', { x: 60, y: 656, width: 960, height: 174, rx: 24, fill: C.pRed }, S.bad);
    S.badRows = [
      'Plus d’encours.',
      'Un délai de traversée qui s’allonge.',
      'Des défauts découverts des jours après leur fabrication.',
    ].map((label, i) => {
      const cy = 700 + 46 * i;
      const g = el('g', {}, S.bad);
      G.cross(g, 108, cy, 18);
      fit(text(g, 142, cy + 9, label, { size: 25, weight: 700, fill: C.tRed }), 1000, `conséquence ${i + 1}`);
      return { g, cy };
    });

    // Révélation : la mauvaise lecture, à la place des ✗, avant le volet
    S.belief = el('g', { opacity: 0 });
    el('rect', { x: 60, y: 656, width: 960, height: 174, rx: 24, fill: C.pGreen }, S.belief);
    G.check(S.belief, 116, 743, 28);
    fit(text(S.belief, 164, 735, 'Sur l’indicateur, tout va bien.', { size: 30, weight: 700, fill: C.tGreen }), 1000, 'lecture ✓ 1');
    fit(text(S.belief, 164, 775, 'Les machines sont occupées.', { size: 24, weight: 500, fill: C.ink }), 1000, 'lecture ✓ 2');

    // ----- Carte 3 : la règle -----
    S.rule = el('g');
    el('rect', { x: 60, y: 846, width: 960, height: 188, rx: 24, fill: C.pLav }, S.rule);
    G.pill(S.rule, 100, 884, 'La règle à garder en tête', { bg: C.blue, fg: C.white });
    fit(text(S.rule, 100, 940, 'Un atelier ne produit jamais plus vite', { size: 28, weight: 700, fill: C.ink }), 1000, 'règle ligne 1');
    const r2 = text(S.rule, 100, 978, 'que ', { size: 28, weight: 700, fill: C.ink });
    const hl = el('tspan', { fill: C.blue }, r2);
    hl.textContent = 'son poste le plus lent';
    r2.appendChild(document.createTextNode('.'));
    fit(r2, 1000, 'règle ligne 2');
    fit(text(S.rule, 100, 1014, 'Tout ce qu’on fabrique au-delà finit en stock.', { size: 22, weight: 500, fill: C.ink }), 1000, 'règle ligne 3');
    // Soulignement de « son poste le plus lent » (caméra)
    const probe = text(svg(), 100, 978, 'que ', { size: 28, weight: 700 });
    const ux0 = 100 + probe.getComputedTextLength();
    probe.textContent = 'son poste le plus lent';
    const ux1 = ux0 + probe.getComputedTextLength();
    probe.remove();
    S.underline = el('line', { x1: ux0, y1: 990, x2: ux1, y2: 990, stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 });
    S.underlineLen = ux1 - ux0;

    S.chute = G.chute('Avant de juger une machine sur son occupation,', 'regardez l’encours qui s’accumule juste après elle.');
    G.encart(['Cartographier ses flux', 'Notre article sur la VSM', '(lien en commentaire)']);

    // Révélation : volet. La réalité est découpée à gauche du volet, la mauvaise lecture à droite.
    S.reveal = G.clipRect(0, 0, W, 1350);
    S.beliefClip = G.clipRect(0, 0, W, 1350);
    [S.title.kb, S.title.t2, S.chap2, S.pile, S.stockPill, S.bad, S.rule].forEach(n => wrap(n, { 'clip-path': S.reveal.url }));
    S.realityWraps = [S.title.kb, S.title.t2, S.chap2, S.pile, S.stockPill, S.bad, S.rule].map(n => n.parentNode);
    wrap(S.belief, { 'clip-path': S.beliefClip.url });
    S.wipe = el('rect', { x: -5, y: 150, width: 10, height: 900, rx: 5, fill: C.blue, opacity: 0 });

    // Caméra : contours qui se dessinent autour de chaque étape
    S.outlines = [
      G.outline(66, 346, 248, 270),
      G.outline(514, 374, 262, 228),
      G.outline(768, 346, 248, 270),
    ];
  }
  const svg = () => G.svg;

  // ================= Scénario 1 : reconstruction =================
  const BOX_START = 3.3, BOX_STEP = 0.1, BOX_DUR = 0.35;
  function flyBoxes(t, start, step, dur) {
    S.boxes.forEach((b, i) => {
      let x = b.sx, y = b.sy, o = 1;
      if (fading(t)) o = fadeOut(t);
      else if (t >= FADE_END) {
        const p = prog(t, start + step * i, dur);
        if (p < 1) {
          const e = easeInOut(p);
          x = FROM.x + (b.sx - FROM.x) * e;
          y = FROM.y + (b.sy - FROM.y) * e - 46 * Math.sin(Math.PI * p);
        }
        o = clamp(p / 0.2);
      }
      b.g.setAttribute('transform', `translate(${x} ${y})`);
      b.g.setAttribute('opacity', o);
    });
  }
  function reconstruction(t) {
    S.stations.forEach((s, i) => {
      const t0 = 1.75 + 0.65 * i;
      pop(s.g, t, t0, s.cx, 470);
      pop(s.pg, t, t0 + 0.3, s.cx, 372);
      const p = t >= FADE_END ? easeInOut(prog(t, t0 + 0.3, 0.4)) : 1;
      s.gauge.setAttribute('width', Math.max(0.001, 84 * p));
    });
    pop(S.flow, t, 3.1, 380, FLOOR - 22);
    flyBoxes(t, BOX_START, BOX_STEP, BOX_DUR);
    pop(S.stockPill, t, 5.45, 630, 572);
    slide(S.bad, t, 5.9, 0.4);
    S.badRows.forEach((r, i) => pop(r.g, t, 6.25 + 0.35 * i, 300, r.cy, 0.3));
    slide(S.rule, t, 7.4);
    rise(S.chute, t, 7.9, 0.45);
  }

  // ================= Scénario 2 : révélation =================
  // 0–1,2 s image complète · 1,2–1,6 s la réalité s'efface · l'indicateur « tout va bien » s'installe
  // 4,1–5,2 s un volet balaie de gauche à droite et remplace la mauvaise lecture par le stock et les ✗
  const WIPE = { t: 4.1, d: 1.1 };
  function revelation(t) {
    const realO = fading(t) ? fadeOut(t) : 1;
    S.realityWraps.forEach(w => w.setAttribute('opacity', realO));
    let wx = W;
    if (t >= FADE_END) wx = t < WIPE.t ? 0 : t < WIPE.t + WIPE.d ? 20 + (W - 20) * easeInOut(prog(t, WIPE.t, WIPE.d)) : W + 20;
    S.reveal.rect.setAttribute('width', Math.min(W, Math.max(0, wx)));
    S.beliefClip.rect.setAttribute('x', Math.min(W, wx));
    S.wipe.setAttribute('x', wx - 5);
    S.wipe.setAttribute('opacity', t >= WIPE.t && t < WIPE.t + WIPE.d ? 1 : 0);

    // La mauvaise lecture glisse depuis la gauche
    let bx = 0, bo = 0;
    if (t >= 1.7 && t < WIPE.t + WIPE.d) { const p = prog(t, 1.7, 0.45); bx = -140 * (1 - easeOut(p)); bo = clamp(p / 0.5); }
    S.belief.setAttribute('transform', bx === 0 ? '' : `translate(${bx} 0)`);
    S.belief.setAttribute('opacity', bo);

    // Les jauges retombent pendant l'effacement puis remontent à 100 %
    S.stations.forEach((s, i) => {
      let p = 1;
      if (fading(t)) p = 1 - easeInOut(prog(t, FADE_START, FADE_END - FADE_START));
      else if (t >= FADE_END) p = easeInOut(prog(t, 2.0 + 0.35 * i, 0.6));
      s.gauge.setAttribute('width', Math.max(0.001, 84 * p));
      pulse(s.pg, t, 2.6 + 0.35 * i, s.cx, 372, 0.1);
    });
    pulse(S.belief, t, 3.3, 540, 743, 0.03, 0.45);

    // Après le volet : insistance sur le stock et les ✗, puis la chute
    pulse(S.stockPill, t, 5.35, 630, 572, 0.12);
    S.badRows.forEach((r, i) => pulse(r.g, t, 5.75 + 0.3 * i, 300, r.cy, 0.06));
    rise(S.chute, t, 6.8, 0.45);
  }

  // ================= Scénario 3 : caméra =================
  const FULL = { cx: 540, cy: 675, w: 1080 };
  const P1 = { cx: 250, cy: 605, w: 560 };   // poste rapide (cadré sous le badge)
  const P2 = { cx: 640, cy: 605, w: 560 };   // le stock
  const P3 = { cx: 860, cy: 605, w: 560 };   // poste lent
  const P4 = { cx: 470, cy: 765, w: 820 };   // les ✗
  const P5 = { cx: 470, cy: 960, w: 820 };   // la règle et la chute
  // GIF : gros plans montés en coupes franches (un travelling fait changer toute l'image : trop lourd en GIF)
  const CUTS = [
    { t: 0, ...FULL }, { t: 1.3, ...P1, cut: true },
    { t: 2.4, ...P1 }, { t: 2.4, ...P2, cut: true },
    { t: 3.5, ...P2 }, { t: 3.5, ...P3, cut: true },
    { t: 4.5, ...P3 }, { t: 4.5, ...P4, cut: true },
    { t: 5.8, ...P4 }, { t: 5.8, ...P5, cut: true },
    { t: 7.3, ...P5 }, { t: 7.3, ...FULL, cut: true },
  ];
  // MP4 : vrais travellings entre les plans
  const TRAVEL = [
    { t: 1.2, ...FULL }, { t: 1.8, ...P1 }, { t: 2.6, ...P1 },
    { t: 3.1, ...P2 }, { t: 3.9, ...P2 }, { t: 4.4, ...P3 }, { t: 5.1, ...P3 },
    { t: 5.7, ...P4 }, { t: 6.7, ...P4 }, { t: 7.2, ...P5 }, { t: 8.0, ...P5 }, { t: 8.8, ...FULL },
  ];
  // Temps d'arrivée sur chaque plan (P1, P2, P3, P4, P5) et fin du plan P5
  const makeCamera = (shots, [a1, a2, a3, a4, a5, end5]) => t => {
    G.camera(t, shots);
    S.outlines[0](t, a1 + 0.05, a2 - 0.02);
    S.outlines[1](t, a2 + 0.05, a3 - 0.02);
    S.outlines[2](t, a3 + 0.05, a4 - 0.02);
    pulse(S.stations[0].pg, t, a1 + 0.35, S.stations[0].cx, 372, 0.1);
    pulse(S.stockPill, t, a2 + 0.35, 630, 572, 0.12);
    pulse(S.stations[1].g, t, a3 + 0.35, S.stations[1].cx, 470, 0.05);
    S.badRows.forEach((r, i) => pulse(r.g, t, a4 + 0.15 + 0.3 * i, 300, r.cy, 0.06));
    const u = easeOut(prog(t, a5 + 0.1, 0.5));
    S.underline.setAttribute('stroke-dasharray', S.underlineLen);
    S.underline.setAttribute('stroke-dashoffset', S.underlineLen * (1 - u));
    S.underline.setAttribute('opacity', t >= a5 + 0.1 && t < end5 ? 1 - prog(t, end5 - 0.3, 0.3) : 0);
  };
  const camera = makeCamera(CUTS, [1.3, 2.4, 3.5, 4.5, 5.8, 7.3]);
  const cameraFluide = makeCamera(TRAVEL, [1.8, 3.1, 4.4, 5.7, 7.2, 8.0]);

  // ================= Scénario 4 : simulation =================
  // 1,6–7,6 s : une journée. Le poste rapide sort un carton toutes les 0,3 s, le poste lent en tire un toutes les 1,2 s.
  const SIM = { start: 1.6, end: 7.6 };
  const EMIT = k => 1.9 + 0.3 * k, FLY = 0.45;
  const PULL = j => 2.5 + 1.2 * j;
  function simulation(t) {
    const inSim = t >= SIM.start && t < SIM.end;
    // Les cartons partent du poste rapide
    flyBoxes(t, EMIT(0), 0.3, FLY);
    // Le poste lent en tire un de temps en temps
    S.pulls.forEach((g, j) => {
      const p = prog(t, PULL(j), 0.5);
      const on = t >= SIM.start && p > 0 && p < 1;
      const x = SLOT0.x + (824 - SLOT0.x) * easeInOut(p);
      g.setAttribute('transform', `translate(${x} ${SLOT0.y})`);
      g.setAttribute('opacity', on ? (p < 0.15 ? p / 0.15 : p > 0.55 ? (1 - p) / 0.45 : 1) : 0);
    });
    // Voyants : le poste rapide clignote à chaque carton, le poste lent à chaque carton tiré
    const blink = (t, times, d = 0.15) => times.some(x => t >= x && t < x + d);
    const emits = Array.from({ length: 18 }, (_, k) => EMIT(k));
    const pulls = [0, 1, 2, 3, 4].map(PULL);
    S.stations[0].lights[1].setAttribute('opacity', inSim && blink(t, emits) ? 0.3 : 1);
    S.stations[1].lights[1].setAttribute('opacity', inSim && blink(t, pulls.map(x => x + 0.4), 0.3) ? 0.3 : 1);
    // Le flux avance : chevrons qui défilent (deux tours exacts sur la journée)
    const off = inSim ? ((t - SIM.start) * 50) % 150 : 0;
    S.chevrons.slice(0, 3).forEach(c => {
      const x = 305 + ((c.x - 305 + off) % 150);
      const edge = Math.min(x - 305, 455 - x);
      c.g.setAttribute('transform', off === 0 ? '' : `translate(${x - c.x} 0)`);
      c.g.setAttribute('opacity', off === 0 ? 1 : clamp(edge / 14));
    });
    // Horloge de la journée
    const dO = t < SIM.start ? 0 : t < SIM.start + 0.3 ? prog(t, SIM.start, 0.3) : t < SIM.end - 0.3 ? 1 : t < SIM.end ? 1 - prog(t, SIM.end - 0.3, 0.3) : 0;
    S.day.setAttribute('opacity', dO);
    S.dayHand.setAttribute('transform', `rotate(${720 * prog(t, SIM.start, SIM.end - SIM.start)} ${S.dayHandC.x} ${S.dayHandC.y})`);
    // Les conséquences tombent quand la pile atteint 6, 12, puis 18 cartons
    pop(S.stockPill, t, EMIT(8) + FLY, 630, 572);
    S.badRows.forEach((r, i) => pop(r.g, t, EMIT(5 + 6 * i) + FLY, 300, r.cy, 0.3));
    // Fin de journée : la règle, puis la chute
    slide(S.rule, t, 7.8);
    rise(S.chute, t, 8.25, 0.45);
  }

  // ================= Temps forts de chaque scénario (planche, repères du lecteur) =================
  const AFFICHE = { t: 0, label: 'Affiche : l’image livrée', frame: 0 };
  const BEATS = {
    reconstruction: [
      AFFICHE,
      { t: 1.2, label: `Deux postes occupés à 100${NB}%` },
      { t: 3.1, label: 'Le stock grossit entre les deux' },
      { t: 5.9, label: 'Ce que ça coûte' },
      { t: 7.4, label: 'La règle, puis la chute' },
      { t: 8.4, label: 'Tenue finale, retour à l’affiche' },
    ],
    revelation: [
      AFFICHE,
      { t: 1.2, label: 'Sur l’indicateur, tout va bien' },
      { t: 4.1, label: 'Le volet révèle le stock', frame: 5.3 },
      { t: 5.3, label: 'Ce que ça coûte, puis la chute' },
      { t: 7.3, label: 'Tenue finale, retour à l’affiche' },
    ],
    camera: [
      AFFICHE,
      { t: 1.3, label: 'Gros plan : le poste rapide', frame: 2.2 },
      { t: 2.4, label: 'Gros plan : le stock', frame: 3.3 },
      { t: 3.5, label: 'Gros plan : le poste lent', frame: 4.3 },
      { t: 4.5, label: 'Gros plan : ce que ça coûte', frame: 5.7 },
      { t: 5.8, label: 'Gros plan : la règle', frame: 6.9 },
      { t: 7.3, label: 'Plan large, tenue finale' },
    ],
    'camera-fluide': [
      AFFICHE,
      { t: 1.2, label: 'Travelling : le poste rapide', frame: 2.5 },
      { t: 2.6, label: 'Travelling : le stock', frame: 3.8 },
      { t: 3.9, label: 'Travelling : le poste lent', frame: 5.0 },
      { t: 5.1, label: 'Travelling : ce que ça coûte', frame: 6.6 },
      { t: 6.7, label: 'Travelling : la règle', frame: 7.6 },
      { t: 8.0, label: 'Retour au plan large, tenue finale' },
    ],
    simulation: [
      AFFICHE,
      { t: 1.2, label: 'Une journée : le poste rapide empile', frame: 3.8 },
      { t: 3.85, label: 'Les ✗ tombent quand la pile monte' },
      { t: 7.8, label: 'La règle, puis la chute' },
      { t: 8.7, label: 'Tenue finale, retour à l’affiche' },
    ],
  };

  G.start({ duration: 12, build, beats: BEATS, scenarios: { reconstruction, revelation, camera, 'camera-fluide': cameraFluide, simulation } });
})();
