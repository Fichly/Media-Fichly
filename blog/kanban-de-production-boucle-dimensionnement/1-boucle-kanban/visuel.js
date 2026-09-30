// Blog · Kanban de production · section « Comment fonctionne une boucle kanban en atelier ? »
// Mécanique : la boucle en cinq temps, suivie par une carte. Le poste aval vide son bac : la carte se détache
// (point de commande), attend au point de collecte jusqu'au relevé, fait la queue chez le fournisseur, qui prépare
// la quantité inscrite, puis le bac plein revient avec sa carte. Pendant ce temps la ligne consomme le bac suivant :
// elle ne s'arrête pas. En bas, le délai de boucle se remplit ; la préparation n'en est qu'une partie.
// Proportions du délai : illustratives. Rendu déterministe : window.FICHE.draw(t), boucle de 18 s, image complète à t = 0.
(() => {
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  // Positions
  const MACH = { x: 100, y: 300, k: 0.9 };
  const OUT = { x: 320, y: 392 };                 // bac en sortie du fournisseur
  const USE = { x: 910, y: 430 }, WAIT = { x: 1010, y: 430 };
  const BOX = { x: 560, y: 226, w: 170, h: 74 };
  const SLOT_BOX = { x: 645, y: 276 };
  const RAIL = [140, 172, 204].map(x => ({ x, y: 262 }));
  const CARD_ON_BAC = { dx: -22, dy: -4 };
  // Chronologie
  const T = { empty: 3.6, swap: 3.9, toBox: 3.8, inBox: 4.8, releve: 6.2, toRail: 7.0, q1: 6.9, q2: 7.7, slide: 7.8, prod: 8.4, full: 10.4, arrive: 12.6, note: 13.2, chute: 14.0 };
  const SEGS = [
    { a: T.empty, b: T.releve, lab: 'Attente au point de collecte', c: C.lightBlue },
    { a: T.releve, b: T.prod, lab: 'File d’attente amont', c: C.yellow, fg: C.ink },
    { a: T.prod, b: T.full, lab: 'Préparation', c: C.teal },
    { a: T.full, b: T.arrive, lab: 'Transport', c: C.violet },
  ];
  const BAR = { x: 64, y: 666, w: 1072, h: 38 };
  const TOT = T.arrive - T.empty;
  const CAPS = [
    [0, 'La ligne consomme le bac en cours.'],
    [T.empty, '2. Dernière pièce consommée : la carte se détache. C’est le point de commande.'],
    [T.inBox, '3. La carte attend au point de collecte, relevé à intervalle fixe.'],
    [T.releve + 0.3, '4. Le fournisseur prépare la quantité inscrite, et rien d’autre.'],
    [T.full, '5. Le conteneur plein revient avec sa carte.'],
    [T.arrive, '1. Il arrive au poste, carte attachée : la ligne n’a jamais attendu.'],
  ];
  const BADGES = [
    { n: 1, x: 1125, y: 474, t: T.arrive },
    { n: 2, x: 872, y: 336, t: T.empty },
    { n: 3, x: 560, y: 226, t: T.inBox },
    { n: 4, x: 112, y: 234, t: T.releve + 0.3 },
    { n: 5, x: 640, y: 526, t: T.full },
  ];

  const S = {};

  function kanban(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -11, y: -14, width: 22, height: 28, rx: 4, fill: C.white, stroke: C.tGreen, 'stroke-width': 2.5 }, g);
    el('rect', { x: -11, y: -14, width: 22, height: 8, rx: 3, fill: C.tGreen }, g);
    el('line', { x1: -6, y1: 1, x2: 6, y2: 1, stroke: C.tGreen, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    el('line', { x1: -6, y1: 7, x2: 3, y2: 7, stroke: C.tGreen, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // Bac : contenant ouvert, niveau de pièces
  function bac(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -32, y: -18, width: 64, height: 38, rx: 6, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
    const fill = el('rect', { x: -27, width: 54, rx: 3, fill: C.yellow }, g);
    const set = lv => { const h = 30 * clamp(lv); fill.setAttribute('y', 16 - h); fill.setAttribute('height', Math.max(0.001, h)); };
    set(1);
    return { g, set };
  }
  function person(parent, cx, floor) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 62, r: 14, fill: C.blue }, g);
    el('path', { d: `M ${cx - 24} ${floor} L ${cx - 24} ${floor - 22} Q ${cx - 24} ${floor - 42} ${cx} ${floor - 42} Q ${cx + 24} ${floor - 42} ${cx + 24} ${floor - 22} L ${cx + 24} ${floor} Z`, fill: C.blue }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('La carte part,', 'le bac revient.');
    G.blogChapeau('La carte ne part qu’une fois la dernière pièce consommée. Le bac revient plein.');

    // ----- Carte du haut : la boucle -----
    G.card(40, 176, 1120, 428);
    // Chemins : carte (pointillés) et bac plein (trait plein)
    G.arrow(G.svg, `M ${USE.x} 392 L ${USE.x} 262 L ${BOX.x + BOX.w + 8} 262`, { stroke: C.tGreen, width: 3, dash: '7 6' });
    G.arrow(G.svg, `M ${BOX.x - 6} 262 L 236 262`, { stroke: C.tGreen, width: 3, dash: '7 6' });
    text(G.svg, 400, 250, 'la carte', { size: 17, weight: 600, fill: C.tGreen, anchor: 'middle' });
    G.arrow(G.svg, `M ${OUT.x} 420 L ${OUT.x} 526 L 1125 526 L 1125 430 L 1052 430`, { stroke: C.blue, width: 3.5 });
    text(G.svg, 470, 514, 'le bac plein, carte attachée', { size: 17, weight: 600, fill: C.blue, anchor: 'middle' });

    // Fournisseur
    S.mach = G.machine(G.svg, MACH.x, MACH.y, MACH.k);
    text(G.svg, 181, 440, 'Fournisseur', { size: 20, weight: 700, fill: C.ink, anchor: 'middle' });
    text(G.svg, 181, 462, 'poste amont', { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });
    el('line', { x1: 124, y1: 278, x2: 222, y2: 278, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.5 });
    // Point de collecte
    el('rect', { x: BOX.x, y: BOX.y, width: BOX.w, height: BOX.h, rx: 12, fill: C.pLav, stroke: C.blue, 'stroke-width': 2 });
    text(G.svg, BOX.x + BOX.w / 2, BOX.y + 22, 'Point de collecte', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
    S.clock = el('g');
    el('circle', { cx: 628, cy: 199, r: 15, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, S.clock);
    S.hand = el('line', { x1: 628, y1: 199, x2: 628, y2: 189, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, S.clock);
    text(G.svg, 652, 205, 'relevé à heure fixe', { size: 15, weight: 600, fill: C.blue });
    // Poste aval
    el('rect', { x: 870, y: 450, width: 220, height: 12, rx: 5, fill: C.ink, opacity: 0.85 });
    el('rect', { x: 884, y: 462, width: 9, height: 58, fill: C.ink, opacity: 0.6 });
    el('rect', { x: 1067, y: 462, width: 9, height: 58, fill: C.ink, opacity: 0.6 });
    person(G.svg, 826, 520);
    text(G.svg, 980, 492, 'Poste aval', { size: 20, weight: 700, fill: C.ink, anchor: 'middle' });
    text(G.svg, 980, 513, 'consommateur', { size: 16, weight: 500, fill: C.ink, anchor: 'middle' });

    // Badges des étapes
    S.badges = BADGES.map(b => { const g = el('g'); G.badgeNum(g, b.x, b.y, b.n, 16); return { ...b, g }; });

    // Légende de l'étape
    el('rect', { x: 64, y: 560, width: 1072, height: 34, rx: 12, fill: C.pLav });
    S.cap = text(G.svg, 80, 584, '', { size: 18, weight: 600, fill: C.ink });
    CAPS.forEach(([, s], i) => { S.cap.textContent = s; if (80 + S.cap.getComputedTextLength() > 1124) console.error(`Débordement : légende ${i}`); });

    // Objets mobiles : bacs X (en cours au départ), Y (en attente puis en cours), Z (nouveau) ; cartes
    S.X = bac(G.svg); S.Y = bac(G.svg); S.Z = bac(G.svg);
    S.cardY = kanban(G.svg);
    S.Q = [kanban(G.svg), kanban(G.svg)];
    S.F = kanban(G.svg);
    S.cmd = el('g');
    G.pill(S.cmd, 940, 364, 'Point de commande', { size: 17, h: 30, pad: 12, bg: C.yellow, fg: C.ink });

    // ----- Carte du bas : le délai de boucle -----
    G.card(40, 616, 1120, 144);
    const h1 = text(G.svg, 64, 650, 'Délai de boucle', { size: 22, weight: 700, fill: C.ink });
    text(G.svg, measure(h1).x + measure(h1).width + 12, 650, 'de la carte détachée (2) au bac revenu (5)', { size: 18, weight: 500, fill: C.ink });
    el('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: 8, fill: C.pLav, opacity: 0.7 });
    const cl = G.clipRect(BAR.x, BAR.y, 0, BAR.h);
    S.barClip = cl.rect;
    S.bar = el('g', { 'clip-path': cl.url });
    let x = BAR.x;
    S.segX = [];
    SEGS.forEach(s => {
      const w = BAR.w * (s.b - s.a) / TOT;
      el('rect', { x: x + 1, y: BAR.y, width: w - 2, height: BAR.h, rx: 6, fill: s.c }, S.bar);
      fit(text(S.bar, x + w / 2, BAR.y + 25, s.lab, { size: 16, weight: 700, fill: s.fg || C.white, anchor: 'middle' }), x + w, s.lab, x);
      S.segX.push([x, w]);
      x += w;
    });
    S.note = el('g');
    const [px, pw] = S.segX[2];
    el('path', { d: `M ${px + 4} ${BAR.y + BAR.h + 6} L ${px + 4} ${BAR.y + BAR.h + 12} L ${px + pw - 4} ${BAR.y + BAR.h + 12} L ${px + pw - 4} ${BAR.y + BAR.h + 6}`, fill: 'none', stroke: C.tRed, 'stroke-width': 2.5 }, S.note);
    text(S.note, px + pw / 2, BAR.y + BAR.h + 32, 'souvent le seul temps compté', { size: 16, weight: 700, fill: C.tRed, anchor: 'middle' });

    S.chute = G.blogChute('Le point de commande est un événement, pas un niveau de stock.', { y: 806 });
  }

  const lerp = (a, b, p) => a + (b - a) * p;
  // Chemin du bac plein : sortie fournisseur → sol → remontée → attente au poste
  const RET = [[OUT.x, OUT.y], [OUT.x, 526], [1125, 526], [1125, 430], [WAIT.x, WAIT.y]];
  function along(pts, p) {
    const seg = [];
    let tot = 0;
    for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(d); tot += d; }
    let d = p * tot;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) { const q = seg[i] ? clamp(d / seg[i]) : 1; return { x: lerp(pts[i][0], pts[i + 1][0], q), y: lerp(pts[i][1], pts[i + 1][1], q) }; }
      d -= seg[i];
    }
  }
  // Chemin de la carte : bac en cours → haut → point de collecte
  const UP = [[USE.x + CARD_ON_BAC.dx, USE.y + CARD_ON_BAC.dy], [USE.x, 262], [SLOT_BOX.x + 40, 262], [SLOT_BOX.x, SLOT_BOX.y]];
  const LEFT = [[SLOT_BOX.x, SLOT_BOX.y], [BOX.x - 20, 262], [RAIL[2].x, RAIL[2].y]];
  const place = (g, x, y, o) => { g.setAttribute('transform', `translate(${x} ${y})`); g.setAttribute('opacity', o); };

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Bac Y : en attente puis en cours ; niveau qui baisse lentement (même valeur à la fin et à t = 0)
    const lvY = live ? 1 - 0.38 * prog(t, 4.4, 13.0) : 0.62;
    const py = live ? easeInOut(prog(t, T.swap, 0.5)) : 1;
    const Yp = { x: lerp(WAIT.x, USE.x, py), y: USE.y };
    S.Y.set(lvY);
    place(S.Y.g, Yp.x, Yp.y, live ? clamp(prog(t, 1.9, 0.3)) : o);
    place(S.cardY, Yp.x + CARD_ON_BAC.dx, Yp.y + CARD_ON_BAC.dy, live ? clamp(prog(t, 1.9, 0.3)) : o);

    // Bac X : se vide, puis s'efface
    S.X.set(0.25 * (1 - prog(t, 2.6, T.empty - 2.6)));
    place(S.X.g, USE.x - 14 * prog(t, T.empty + 0.2, 0.3), USE.y, live ? clamp(prog(t, 1.8, 0.3)) * (1 - clamp(prog(t, T.empty + 0.2, 0.4))) : 0);

    // Bac Z : apparaît vide chez le fournisseur, se remplit, revient
    let Zp = { x: WAIT.x, y: WAIT.y }, zo = o, zl = 1;
    if (live) {
      zo = clamp(prog(t, T.prod, 0.3));
      zl = prog(t, T.prod + 0.3, T.full - T.prod - 0.4);
      Zp = t < T.full ? { x: OUT.x, y: OUT.y } : along(RET, easeInOut(prog(t, T.full, T.arrive - T.full)));
    }
    S.Z.set(zl);
    place(S.Z.g, Zp.x, Zp.y, zo);

    // Carte F : sur X, se détache, collecte, relevé, file d'attente, sur Z
    let Fp, fo = o;
    if (!live) Fp = { x: Zp.x + CARD_ON_BAC.dx, y: Zp.y + CARD_ON_BAC.dy };
    else {
      fo = clamp(prog(t, 1.8, 0.3));
      if (t < T.toBox) Fp = { x: USE.x + CARD_ON_BAC.dx, y: USE.y + CARD_ON_BAC.dy - 16 * easeOut(prog(t, T.empty, 0.2)) };
      else if (t < T.inBox) Fp = along(UP, easeInOut(prog(t, T.toBox, T.inBox - T.toBox)));
      else if (t < T.releve) Fp = { x: SLOT_BOX.x, y: SLOT_BOX.y };
      else if (t < T.slide) Fp = along(LEFT, easeInOut(prog(t, T.releve, T.toRail - T.releve)));
      else if (t < T.prod) Fp = { x: lerp(RAIL[2].x, RAIL[0].x, easeInOut(prog(t, T.slide, 0.3))), y: RAIL[0].y };
      else {
        const q = easeInOut(prog(t, T.prod, 0.4));
        const dst = { x: Zp.x + CARD_ON_BAC.dx, y: Zp.y + CARD_ON_BAC.dy };
        Fp = q < 1 ? { x: lerp(RAIL[0].x, dst.x, q), y: lerp(RAIL[0].y, dst.y, q) - 30 * Math.sin(Math.PI * q) } : dst;
      }
    }
    place(S.F, Fp.x, Fp.y, fo);
    // Cartes déjà en file chez le fournisseur
    S.Q.forEach((q, i) => {
      const tq = i === 0 ? T.q1 : T.q2;
      const qx = i === 0 ? RAIL[0].x : lerp(RAIL[1].x, RAIL[0].x, easeInOut(prog(t, T.q1 + 0.1, 0.3)));
      place(q, qx, RAIL[0].y + 30 * easeOut(prog(t, tq, 0.3)), live ? clamp(prog(t, 1.9, 0.3)) * (1 - clamp(prog(t, tq, 0.3))) : 0);
    });
    // Fournisseur occupé
    const busy = live && t >= T.q1 && t < T.full;
    S.mach.lights[1].setAttribute('fill', busy ? C.yellow : C.green);

    // Horloge du point de collecte : un tour pendant l'attente, relevé à T.releve
    const ang = live ? 360 * easeInOut(prog(t, T.inBox, T.releve - T.inBox)) : 0;
    S.hand.setAttribute('transform', `rotate(${ang} 628 199)`);
    if (live && t >= T.releve && t < T.releve + 0.6) pulse(S.clock, t, T.releve, 628, 199, 0.18, 0.4);

    // Point de commande
    S.cmd.setAttribute('opacity', live ? window01(t, T.empty, T.empty + 1.5, 0.15) : 0);
    if (live && t >= T.empty && t < T.empty + 0.6) pulse(S.cmd, t, T.empty, 1030, 364, 0.1, 0.4);

    // Badges : celui de l'étape en cours pulse
    S.badges.forEach(b => {
      b.g.setAttribute('opacity', live ? (t >= 1.8 ? 1 : 0) : 1);
      if (live && t >= b.t && t < b.t + 0.8) pulse(b.g, t, b.t, b.x, b.y, 0.3, 0.5);
    });

    // Légende
    let cap = CAPS[CAPS.length - 1];
    if (live) CAPS.forEach(c => { if (t >= Math.max(c[0], 1.9)) cap = c; });
    S.cap.textContent = cap[1];
    S.cap.setAttribute('opacity', live ? clamp(prog(t, 1.9, 0.3)) : o);

    // Délai de boucle
    const bq = live ? clamp((t - T.empty) / TOT) : 1;
    S.barClip.setAttribute('width', Math.max(0.001, BAR.w * bq));
    S.bar.setAttribute('opacity', o);
    rise(S.note, t, T.note, 0.4, 8);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 18, build, draw });
})();
