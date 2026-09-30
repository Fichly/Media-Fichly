// Blog · 5S · section « C'est quoi les 5S ? Définition et origine »
// Mécanique : une même zone d'atelier traverse les cinq S dans l'ordre. Le poste, l'établi et la machine ne bougent pas ;
// seuls les objets changent : supprimer (le douteux part en zone d'attente), ranger (chaque outil rejoint sa silhouette),
// nettoyer (la tache disparaît, une fuite apparaît et elle est notée), standardiser (photo de l'état attendu affichée),
// suivre (un passage chaque semaine ; un outil manque, le passage le voit, il revient).
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  // Le gabarit ne précharge pas la graisse 600 : la charger avant la construction (mesures de para / fit justes)
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const FLOOR = 560;
  const BOARD = { x: 90, y: 216, w: 290, h: 150 };
  const BOARD_FILL = '#e6e6f2', SHADOW = '#cbcbe0';
  const BENCH = { x0: 80, x1: 430, y: 440 };
  const MACH = { x: 470, y: FLOOR - 118, k: 0.95 };
  const PHOTO = { x: 452, y: 212, w: 224, h: 156 };
  const WAIT = { x: 64, y: 632, w: 370, h: 114 };
  const WEEK = { x0: 478, dx: 40, y: 694 };

  // Chronologie
  const STEPS = [
    { a: 2.7, d: 4.7 },   // supprimer
    { a: 4.8, d: 6.9 },   // ranger
    { a: 7.0, d: 9.0 },   // nettoyer
    { a: 9.3, d: 11.0 },  // standardiser
    { a: 11.2, d: 99 },   // suivre : ne se termine pas
  ];
  const SIL_T = 5.0;
  const SWEEP = { t: 7.3, d: 1.0 };
  const LEAK_T = 8.05, TAG_T = 8.4;
  const FLASH_T = 9.65, PHOTO_T = 9.8, WHO_T = 10.3;
  const WEEK_T = k => 11.6 + 0.55 * k;
  const GAP = { off: 12.25, on: 13.05 };   // un outil manque au 3e passage, il revient
  const HEAD1_T = 9.05, HEAD2_T = 14.7, CHUTE_T = 15.2;

  const S = {};

  // ---------- Outils (dessinés verticaux, centrés sur 0,0) ----------
  const TOOLS = [
    (g, f) => { el('rect', { x: -5, y: -16, width: 10, height: 58, rx: 4, fill: f || C.yellow }, g); el('rect', { x: -24, y: -36, width: 48, height: 20, rx: 5, fill: f || C.ink }, g); },
    (g, f) => { el('rect', { x: -6, y: -18, width: 12, height: 60, rx: 6, fill: f || C.lightBlue }, g); el('circle', { cx: 0, cy: -26, r: 16, fill: f || C.lightBlue }, g); el('rect', { x: -5, y: -46, width: 10, height: 17, rx: 2, fill: f ? BOARD_FILL : C.card }, g); },
    (g, f) => { el('rect', { x: -3, y: -40, width: 6, height: 42, rx: 2, fill: f || C.ink }, g); el('rect', { x: -10, y: 0, width: 20, height: 42, rx: 7, fill: f || C.red }, g); },
  ];
  const TOOL_POS = [140, 235, 330].map(x => ({ x, y: BOARD.y + 86, r: 0 }));
  const TOOL_MESSY = [{ x: 128, y: 416, r: 90 }, { x: 252, y: 414, r: -90 }, { x: 388, y: 420, r: 90 }];

  function gear(g) {
    el('circle', { cx: 0, cy: 0, r: 17, fill: '#9d9dbd' }, g);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      el('rect', { x: -4, y: -23, width: 8, height: 10, rx: 2, fill: '#9d9dbd', transform: `rotate(${a * 180 / Math.PI})` }, g);
    }
    el('circle', { cx: 0, cy: 0, r: 6, fill: C.card }, g);
  }
  function redTag(g, x, y) {
    const t = el('g', { transform: `translate(${x} ${y}) rotate(12)` }, g);
    el('line', { x1: -8, y1: 4, x2: 0, y2: 12, stroke: C.tRed, 'stroke-width': 2 }, t);
    el('rect', { x: -2, y: -10, width: 22, height: 15, rx: 3, fill: C.red }, t);
    el('circle', { cx: 3, cy: -2.5, r: 2.2, fill: C.card }, t);
    return t;
  }
  // Petite icône « boucle » (suivre ne se termine pas)
  function loopIcon(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 15, fill: C.blue }, g);
    G.arrow(g, `M ${cx + 7} ${cy - 5} A 8 8 0 1 0 ${cx + 7.5} ${cy + 4}`, { stroke: C.white, width: 3, head: 5 });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Trois S se font,', 'deux se tiennent.', { size: 46 });
    G.blogChapeau('Une zone d’atelier, les cinq étapes dans l’ordre, et ce que chacune produit.');

    // ----- Carte gauche : la zone (le décor ne bouge pas) -----
    G.card(40, 176, 680, 584);
    el('rect', { x: 60, y: FLOOR, width: 640, height: 40, fill: C.pYellow, opacity: 0.7 });
    el('line', { x1: 60, y1: FLOOR, x2: 700, y2: FLOOR, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });
    // Panneau à outils (vide au départ, les silhouettes apparaissent au rangement)
    el('rect', { x: BOARD.x, y: BOARD.y, width: BOARD.w, height: BOARD.h, rx: 14, fill: BOARD_FILL });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) el('circle', { cx: BOARD.x + 20 + c * 31, cy: BOARD.y + 22 + r * 53, r: 2, fill: SHADOW, opacity: 0.6 });
    S.sil = el('g');
    TOOLS.forEach((d, i) => { const g = el('g', { transform: `translate(${TOOL_POS[i].x} ${TOOL_POS[i].y})` }, S.sil); d(g, SHADOW); });
    // Établi
    el('rect', { x: BENCH.x0, y: BENCH.y, width: BENCH.x1 - BENCH.x0, height: 14, rx: 6, fill: C.ink, opacity: 0.85 });
    el('rect', { x: BENCH.x0 + 16, y: BENCH.y + 14, width: 10, height: FLOOR - BENCH.y - 14, fill: C.ink, opacity: 0.6 });
    el('rect', { x: BENCH.x1 - 26, y: BENCH.y + 14, width: 10, height: FLOOR - BENCH.y - 14, fill: C.ink, opacity: 0.6 });
    // Marquage au sol (rangement)
    S.marks = el('g');
    [[BENCH.x0 - 6, FLOOR + 8, 1], [BENCH.x1 + 6, FLOOR + 8, -1]].forEach(([x, y, s]) => {
      el('path', { d: `M ${x} ${y + 22} L ${x} ${y} L ${x + 26 * s} ${y}`, fill: 'none', stroke: C.yellow, 'stroke-width': 6, 'stroke-linecap': 'round' }, S.marks);
    });
    // Machine
    G.machine(G.svg, MACH.x, MACH.y, MACH.k);

    // Tache au sol (nettoyer) : découpée par le passage du chiffon
    const sc = G.clipRect(440, FLOOR, 280, 40);
    S.stainClip = sc.rect;
    S.stain = el('g', { 'clip-path': sc.url });
    el('ellipse', { cx: 584, cy: FLOOR + 19, rx: 58, ry: 11, fill: C.tYellow, opacity: 0.35 }, S.stain);
    el('ellipse', { cx: 560, cy: FLOOR + 17, rx: 22, ry: 6, fill: C.tYellow, opacity: 0.3 }, S.stain);
    S.cloth = el('g');
    el('rect', { x: -22, y: -12, width: 44, height: 24, rx: 8, fill: C.teal }, S.cloth);
    el('line', { x1: -12, y1: -2, x2: 12, y2: -2, stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.cloth);
    // Fuite révélée, puis notée
    S.leak = el('g');
    el('path', { d: 'M 622 566 Q 614 578 622 582 Q 630 578 622 566 Z', fill: C.lightBlue }, S.leak);
    el('ellipse', { cx: 622, cy: 590, rx: 13, ry: 3.5, fill: C.lightBlue, opacity: 0.7 }, S.leak);
    S.tag = el('g');
    el('line', { x1: 622, y1: 593, x2: 612, y2: 606, stroke: C.tYellow, 'stroke-width': 2 }, S.tag);
    const tp = G.pill(S.tag, 0, 616, 'Fuite notée', { size: 17, h: 30, pad: 12, bg: C.yellow, fg: C.ink });
    tp.g.setAttribute('transform', `translate(${612 - tp.w / 2} 0)`);

    // Photo de l'état attendu (standardiser)
    S.photo = el('g');
    const P = PHOTO;
    el('rect', { x: P.x, y: P.y, width: P.w, height: P.h, rx: 8, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, S.photo);
    el('rect', { x: P.x + 12, y: P.y + 12, width: P.w - 24, height: 80, rx: 4, fill: C.pLav }, S.photo);
    el('rect', { x: P.x + 22, y: P.y + 20, width: 84, height: 40, rx: 4, fill: BOARD_FILL, stroke: SHADOW }, S.photo);
    [36, 64, 92].forEach(dx => el('rect', { x: P.x + dx - 3, y: P.y + 27, width: 6, height: 26, rx: 2, fill: C.ink, opacity: 0.7 }, S.photo));
    el('rect', { x: P.x + 20, y: P.y + 70, width: 96, height: 5, rx: 2, fill: C.ink, opacity: 0.8 }, S.photo);
    el('rect', { x: P.x + 136, y: P.y + 50, width: 64, height: 42, rx: 6, fill: C.blue }, S.photo);
    el('circle', { cx: P.x + P.w / 2, cy: P.y + 2, r: 6, fill: C.red }, S.photo);
    text(S.photo, P.x + P.w / 2, P.y + 116, 'État attendu', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
    S.who = text(S.photo, P.x + P.w / 2, P.y + 141, `Léa, chaque soir`, { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });
    S.flash = el('rect', { x: 42, y: 178, width: 676, height: 580, rx: 22, fill: C.white, opacity: 0 });

    // Zone d'attente (supprimer)
    S.wait = el('g');
    el('rect', { x: WAIT.x, y: WAIT.y, width: WAIT.w, height: WAIT.h, rx: 14, fill: C.pRed, opacity: 0.55, stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, S.wait);
    text(S.wait, WAIT.x + 18, WAIT.y + 30, 'Zone d’attente, objets datés', { size: 17, weight: 700, fill: C.tRed });

    // Suivi : un passage chaque semaine
    S.weekHead = el('g');
    text(S.weekHead, 452, WAIT.y + 30, 'Un passage par semaine', { size: 17, weight: 700, fill: C.blue });
    S.weeks = Array.from({ length: 6 }, (_, k) => {
      const g = el('g');
      const x = WEEK.x0 + WEEK.dx * k;
      (k === 2 ? G.cross : G.check)(g, x, WEEK.y, 13, k === 2 ? C.red : C.green);
      text(g, x, WEEK.y + 36, `S${k + 1}`, { size: 15, weight: 600, fill: C.ink, anchor: 'middle' });
      return { g, x };
    });

    // Objets de la zone : outils (établi → panneau) et objets douteux (établi → zone d'attente)
    S.objs = [];
    TOOLS.forEach((d, i) => {
      const g = el('g');
      d(el('g', {}, g));
      S.objs.push({ g, from: TOOL_MESSY[i], to: TOOL_POS[i], show: 1.95 + 0.08 * i, move: 5.4 + 0.4 * i });
    });
    const junk = [
      { draw: g => { G.carton(g, 0, 0, 1.2); }, from: { x: 190, y: 421, r: 0 }, to: { x: 120, y: WAIT.y + 80, r: 0 }, move: 3.0 },
      { draw: g => { G.carton(g, -20, 0, 1.2); G.carton(g, 20, 0, 1.2); }, from: { x: 312, y: 421, r: 0 }, to: { x: 236, y: WAIT.y + 80, r: 0 }, move: 3.4 },
      { draw: gear, from: { x: 436, y: FLOOR - 24, r: 0 }, to: { x: 350, y: WAIT.y + 80, r: 0 }, move: 3.8 },
    ];
    junk.forEach((j, i) => {
      const g = el('g');
      j.draw(el('g', {}, g));
      const tag = redTag(g, 14, -26);
      S.objs.push({ g, from: j.from, to: j.to, show: 2.0 + 0.08 * i, move: j.move, tag });
    });

    // ----- Carte droite : les cinq étapes -----
    G.card(736, 176, 424, 584);
    const ROWS = [
      ['Supprimer', 'Seiri', 'Ne reste que ce qui sert'],
      ['Ranger', 'Seiton', 'Une place repérée pour chaque objet'],
      ['Nettoyer', 'Seiso', 'La propreté révèle les anomalies'],
      ['Standardiser', 'Seiketsu', 'L’état attendu, écrit et affiché'],
      ['Suivre', 'Shitsuke', 'Un rythme de vérification, sans fin'],
    ];
    const ROW_Y = [262, 350, 438, 590, 678];
    S.rows = ROWS.map(([n, jp, out], i) => {
      const y = ROW_Y[i];
      const hl = el('rect', { x: 752, y: y - 34, width: 392, height: 78, rx: 14, fill: C.pLav, opacity: 0 });
      const g = el('g');
      G.badgeNum(g, 778, y - 7, i + 1, 17);
      const nt = text(g, 806, y, n, { size: 22, weight: 700, fill: C.ink });
      text(g, measure(nt).x + measure(nt).width + 10, y, jp, { size: 16, weight: 500, fill: C.blue });
      fit(text(g, 806, y + 27, out, { size: 17, weight: 500, fill: C.ink }), 1136, `étape ${i + 1}`);
      const done = el('g');
      if (i < 4) G.check(done, 1122, y - 7, 13);
      else loopIcon(done, 1122, y - 7);
      return { g, hl, done, y };
    });
    S.head1 = el('g');
    G.pill(S.head1, 756, 204, 'Ils se font : la zone change', { size: 17, h: 32, pad: 14, bg: C.pGreen, fg: C.tGreen });
    S.head2 = el('g');
    G.pill(S.head2, 756, 532, 'Ils se tiennent : écrire, vérifier', { size: 17, h: 32, pad: 14, bg: C.blue, fg: C.white });

    S.chute = G.blogChute('Les trois premiers S se font, les deux derniers se tiennent.', { y: 806 });
  }

  const lerp = (a, b, p) => a + (b - a) * p;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Objets : état final (t < FADE_END), sinon apparition en désordre puis déplacement
    S.objs.forEach((ob, i) => {
      let x = ob.to.x, y = ob.to.y, r = ob.to.r, op = o;
      if (live) {
        const p = easeInOut(prog(t, ob.move, 0.6));
        x = lerp(ob.from.x, ob.to.x, p);
        y = lerp(ob.from.y, ob.to.y, p) - 70 * Math.sin(Math.PI * p);
        r = lerp(ob.from.r, ob.to.r, p);
        op = clamp((t - ob.show) / 0.3);
      }
      // L'outil du milieu manque au 3e passage, puis revient
      if (i === 1 && live) op *= 1 - window01(t, GAP.off, GAP.on, 0.2);
      ob.g.setAttribute('transform', `translate(${x} ${y})` + (r ? ` rotate(${r})` : ''));
      ob.g.setAttribute('opacity', op);
      if (ob.tag) ob.tag.setAttribute('opacity', live ? clamp(prog(t, ob.move + 0.55, 0.2)) : 1);
    });
    S.sil.setAttribute('opacity', live ? clamp(prog(t, SIL_T, 0.3)) : o);
    S.marks.setAttribute('opacity', live ? clamp(prog(t, 6.6, 0.3)) : o);
    S.wait.setAttribute('opacity', live ? clamp(prog(t, 2.8, 0.3)) : o);

    // Nettoyage : la tache disparaît sous le chiffon, la fuite apparaît
    const sx = 520 + 140 * prog(t, SWEEP.t, SWEEP.d);
    S.stainClip.setAttribute('x', live ? sx : 720);
    S.stain.setAttribute('opacity', live ? clamp(prog(t, 2.1, 0.3)) : 0);
    const cw = live ? window01(t, SWEEP.t - 0.15, SWEEP.t + SWEEP.d + 0.15, 0.15) : 0;
    S.cloth.setAttribute('opacity', cw);
    S.cloth.setAttribute('transform', `translate(${sx} ${FLOOR + 18 + 4 * Math.sin((t - SWEEP.t) * 18)})`);
    S.leak.setAttribute('opacity', live ? clamp(prog(t, LEAK_T, 0.3)) : o);
    pop(S.tag, t, TAG_T, 612, 616);

    // Standard : flash, photo affichée, nom
    S.flash.setAttribute('opacity', live ? 0.75 * window01(t, FLASH_T, FLASH_T + 0.2, 0.08) : 0);
    pop(S.photo, t, PHOTO_T, PHOTO.x + PHOTO.w / 2, PHOTO.y + PHOTO.h / 2);
    S.who.setAttribute('opacity', live ? clamp(prog(t, WHO_T, 0.3)) : 1);

    // Suivi hebdomadaire
    S.weekHead.setAttribute('opacity', live ? clamp(prog(t, WEEK_T(0) - 0.3, 0.3)) : o);
    S.weeks.forEach((w, k) => {
      pop(w.g, t, WEEK_T(k), w.x, WEEK.y);
    });

    // Liste des étapes
    S.rows.forEach((r, i) => {
      const st = STEPS[i];
      r.g.setAttribute('opacity', live ? (t < st.a ? 0.35 : 1) : 0.35 + 0.65 * o);
      r.hl.setAttribute('opacity', live ? window01(t, st.a, i === 4 ? 14.9 : st.d, 0.2) : 0);
      if (i < 4) pop(r.done, t, st.d - 0.15, 1122, r.y - 7);
      else pop(r.done, t, 14.9, 1122, r.y - 7);
    });
    pop(S.head1, t, HEAD1_T, 900, 204);
    pop(S.head2, t, HEAD2_T, 900, 532);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
