// Fiche LinkedIn · Hugo Duc · mercredi 7 octobre 2026
// Post : « Certains gaspillages ont un budget. D'autres ont un poste de travail. Parfois même un responsable. »
// Premier commentaire du post (Buffer) : toutes les ressources Lean du site → encart.
// Style propre : « ça tourne tout seul ». Quatre vignettes vivantes en boucle continue, rien ne s'efface :
// le gaspillage organisé ne s'arrête jamais. Périodes 3, 4 et 6 s : la boucle de 12 s est exacte.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (u, s, d) => clamp((u - s) / d);
  const ease = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const mod = (a, n) => ((a % n) + n) % n;
  const bump = (u, s, d) => { const p = prog(u, s, d); return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0; };
  const tr = (n, x, y, extra = '') => n.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})${extra}`);

  // ---------- Petits objets ----------
  function carton(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -16, y: -14, width: 32, height: 28, rx: 5, fill: C.yellow }, g);
    el('line', { x1: -8, y1: -4, x2: 8, y2: -4, stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function wrench(parent, color = C.white, holeColor = C.blue) {
    const g = el('g', {}, parent);
    const w = el('g', { transform: 'rotate(45)' }, g);
    el('rect', { x: -4.5, y: -6, width: 9, height: 30, rx: 4.5, fill: color }, w);
    el('circle', { cx: 0, cy: -12, r: 12, fill: color }, w);
    el('rect', { x: -4.5, y: -27, width: 9, height: 14, rx: 2, fill: holeColor }, w);
    return g;
  }
  // Atelier / poste : bloc bleu avec un libellé
  function station(parent, x, y, w, h, label, size = 26) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: w, height: h, rx: 12, fill: C.blue }, g);
    if (label) text(g, x + w / 2, y + h / 2 + 9, label, { size, weight: 800, fill: C.white, anchor: 'middle' });
    return g;
  }

  // ---------- Les quatre scènes (repère local : 446 × 140) ----------
  const SW = 446, SH = 140, FLOOR = 122;

  // 1 · Stock tampon : A dépose sur la pile, B reprend sur la pile. La pile ne baisse jamais.
  function sceneStock(g) {
    el('line', { x1: 10, y1: FLOOR, x2: SW - 10, y2: FLOOR, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    const A = station(g, 18, 40, 78, 82, 'A');
    const B = station(g, SW - 96, 40, 78, 82, 'B');
    const cx = SW / 2;
    [[-36, 0], [0, 0], [36, 0], [-18, -30], [18, -30]].forEach(([dx, dy]) => tr(carton(g), cx + dx, FLOOR - 14 + dy));
    const moving = carton(g);
    const P = 3, OFF = 1.35; // à t = 0 : le carton vient de se poser sur la pile
    const top = { x: cx, y: FLOOR - 14 - 60 }, from = { x: 96, y: 72 }, to = { x: SW - 96, y: 72 };
    return t => {
      const u = mod(t + OFF, P);
      let x, y, o = 1;
      if (u < 0.2) { o = 0; x = from.x; y = from.y; }
      else if (u < 1.2) { const p = ease(prog(u, 0.2, 1)); x = from.x + (top.x - from.x) * p; y = from.y + (top.y - from.y) * p - 46 * Math.sin(Math.PI * p); }
      else if (u < 1.6) { x = top.x; y = top.y; }
      else if (u < 2.6) { const p = ease(prog(u, 1.6, 1)); x = top.x + (to.x - top.x) * p; y = top.y + (to.y - top.y) * p - 46 * Math.sin(Math.PI * p); }
      else { o = 0; x = to.x; y = to.y; }
      tr(moving, x, y);
      moving.setAttribute('opacity', o);
      const ka = 1 + 0.06 * bump(u, 0.05, 0.3), kb = 1 + 0.06 * bump(u, 2.5, 0.3);
      A.setAttribute('transform', `translate(57 81) scale(${ka}) translate(-57 -81)`);
      B.setAttribute('transform', `translate(${SW - 57} 81) scale(${kb}) translate(${-(SW - 57)} -81)`);
    };
  }

  // 2 · Poste de retouche : toutes les pièces passent par la retouche, comme une étape normale.
  function sceneRetouche(g) {
    const V = 80, GAP = 80, PATTERN = [true, false, true]; // défaut, bonne, défaut… (12 pièces par boucle)
    el('rect', { x: 8, y: 98, width: SW - 16, height: 14, rx: 7, fill: '#d6d6ea' }, g);
    const belt = el('line', { x1: 16, y1: 105, x2: SW - 16, y2: 105, stroke: C.white, 'stroke-width': 3, 'stroke-dasharray': '10 14', 'stroke-linecap': 'round' }, g);
    const pieces = [];
    for (let j = 0; j < 7; j++) {
      const p = el('g', {}, g);
      el('rect', { x: -15, y: -15, width: 30, height: 30, rx: 7, fill: C.white, stroke: C.line, 'stroke-width': 2 }, p);
      const bad = el('path', { d: 'M -6 -6 L 6 6 M 6 -6 L -6 6', stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round' }, p);
      const good = el('g', {}, p);
      el('rect', { x: -15, y: -15, width: 30, height: 30, rx: 7, fill: C.green }, good);
      el('path', { d: 'M -7 0 L -2 5 L 7 -5', fill: 'none', stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, good);
      pieces.push({ p, bad, good });
    }
    const ST = { x: 182, w: 86 };
    station(g, ST.x, 18, ST.w, 88);
    const w = wrench(g);
    const label = text(g, ST.x + ST.w / 2, 136, 'Retouche', { size: 17, weight: 700, fill: C.blue, anchor: 'middle' });
    return t => {
      const d = V * t;
      belt.setAttribute('stroke-dashoffset', -mod(d, 24));
      const shift = mod(d, GAP), base = Math.floor(d / GAP);
      pieces.forEach((pc, j) => {
        const x = -40 + shift + j * GAP;
        const id = base - j;
        const isBad = PATTERN[mod(id, PATTERN.length)];
        const after = x > ST.x + ST.w / 2;
        tr(pc.p, x, 83);
        pc.good.setAttribute('opacity', after ? 1 : 0);
        pc.bad.setAttribute('opacity', !after && isBad ? 1 : 0);
      });
      // La clé frappe à chaque pièce qui passe sous le poste
      const k = bump(mod(d - (ST.x + ST.w / 2 + 40), GAP) / V, 0, 0.35);
      tr(w, ST.x + ST.w / 2, 58, ` rotate(${(-28 * k).toFixed(2)})`);
    };
  }

  // 3 · Réunion de crise : les semaines défilent, la crise revient chaque lundi.
  function sceneReunion(g, clipId) {
    const CELL = 46, STEP = 52, WEEK = 5 * STEP + 22, P = 3; // une semaine toutes les 3 s
    const strip = el('g', { 'clip-path': `url(#${clipId})` }, g);
    const inner = el('g', {}, strip);
    const DAYS = ['L', 'M', 'M', 'J', 'V'];
    for (let k = -1; k < 3; k++) DAYS.forEach((d, i) => {
      const x = k * WEEK + i * STEP, mon = i === 0;
      el('rect', { x, y: 30, width: CELL, height: 56, rx: 10, fill: mon ? C.red : C.white, stroke: mon ? C.red : C.line, 'stroke-width': 2 }, inner);
      text(inner, x + CELL / 2, 66, mon ? '!' : d, { size: 22, weight: 800, fill: mon ? C.white : C.ink, anchor: 'middle' });
      if (mon) text(inner, x + CELL / 2, 112, 'Crise', { size: 16, weight: 700, fill: C.tRed, anchor: 'middle' });
    });
    // Repère fixe « cette semaine »
    const cur = el('g', {}, g);
    el('path', { d: 'M 108 12 L 122 12 L 115 22 Z', fill: C.blue }, cur);
    return t => {
      const off = -mod(WEEK * t / P, WEEK);
      tr(inner, 92 + off, 0);
    };
  }

  // 4 · Chariot de dépannage : il fait l'aller-retour, rempli « au cas où ».
  function sceneChariot(g) {
    el('line', { x1: 10, y1: FLOOR + 8, x2: SW - 10, y2: FLOOR + 8, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    // Magasin à gauche
    el('rect', { x: 14, y: 24, width: 72, height: 106, rx: 10, fill: C.white, stroke: C.line, 'stroke-width': 2 }, g);
    [52, 88].forEach(y => el('line', { x1: 14, y1: y, x2: 86, y2: y, stroke: C.line, 'stroke-width': 2 }, g));
    [[30, 44], [52, 44], [70, 44], [30, 80], [52, 80], [30, 116], [52, 116], [70, 116]].forEach(([x, y]) => el('rect', { x: x - 8, y: y - 14, width: 16, height: 14, rx: 3, fill: C.yellow }, g));
    // Ligne à droite, en manque
    station(g, SW - 92, 36, 78, 94, 'Ligne', 19);
    const alert = el('g', {}, g);
    el('circle', { cx: SW - 22, cy: 38, r: 15, fill: C.red }, alert);
    text(alert, SW - 22, 46, '!', { size: 22, weight: 800, fill: C.white, anchor: 'middle' });
    // Chariot
    const cart = el('g', {}, g);
    el('path', { d: 'M -46 -42 L -38 -30', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, cart);
    el('path', { d: 'M -38 -30 L 40 -30 L 34 4 L -32 4 Z', fill: C.blue, 'stroke-linejoin': 'round', stroke: C.blue, 'stroke-width': 3 }, cart);
    [[-22, -38], [-4, -38], [14, -38], [-13, -52], [5, -52]].forEach(([x, y]) => el('rect', { x: x - 8, y, width: 16, height: 14, rx: 3, fill: C.yellow }, cart));
    const wheels = [-20, 22].map(x => {
      const wg = el('g', {}, cart);
      el('circle', { cx: 0, cy: 0, r: 8, fill: C.ink }, wg);
      el('line', { x1: -5, y1: 0, x2: 5, y2: 0, stroke: C.white, 'stroke-width': 2 }, wg);
      return { wg, x };
    });
    const extra = el('rect', { x: -8, y: -7, width: 16, height: 14, rx: 3, fill: C.yellow }, g);
    const P = 4, X0 = 140, X1 = 290;
    return t => {
      const u = mod(t + 2.0, P); // à t = 0 : le chariot vient de livrer la ligne
      let x;
      if (u < 0.6) x = X0;
      else if (u < 1.8) x = X0 + (X1 - X0) * ease(prog(u, 0.6, 1.2));
      else if (u < 2.4) x = X1;
      else if (u < 3.6) x = X1 + (X0 - X1) * ease(prog(u, 2.4, 1.2));
      else x = X0;
      tr(cart, x, FLOOR - 4);
      wheels.forEach(w => tr(w.wg, w.x, 4, ` rotate(${(x * 3).toFixed(1)})`));
      // Une pièce du magasin tombe dans le chariot, une autre part vers la ligne
      let ex, ey, eo = 1;
      if (u < 0.6) { const p = ease(prog(u, 0, 0.6)); ex = 70 + (X0 - 70) * p; ey = 44 - 7 + (FLOOR - 4 - 45 - 37) * p - 20 * Math.sin(Math.PI * p); }
      else if (u >= 1.8 && u < 2.4) { const p = ease(prog(u, 1.85, 0.5)); ex = X1 + 23 + (SW - 70 - X1 - 23) * p; ey = FLOOR - 4 - 52 - 24 * Math.sin(Math.PI * p) + 10 * p; eo = 1 - prog(u, 2.25, 0.15); }
      else { eo = 0; ex = 0; ey = 0; }
      tr(extra, ex, ey);
      extra.setAttribute('opacity', eo);
      const k = 1 + 0.18 * bump(mod(t, 1.5), 0, 0.4);
      alert.setAttribute('transform', `translate(${SW - 22} 38) scale(${k.toFixed(3)}) translate(${-(SW - 22)} -38)`);
    };
  }

  // ---------- Sablier qui coule (bloc question), période 6 s ----------
  function hourglass(parent, cx, cy) {
    const g = el('g', {}, parent);
    const body = el('g', {}, g);
    const defs = el('defs', {}, parent);
    const cpTop = el('clipPath', { id: 'hgTop' }, defs);
    const topRect = el('rect', { x: -30, y: -40, width: 60, height: 40 }, cpTop);
    const cpBot = el('clipPath', { id: 'hgBot' }, defs);
    const botRect = el('rect', { x: -30, y: 0, width: 60, height: 40 }, cpBot);
    el('path', { d: 'M -20 -34 C -20 -12, -4 -6, -4 0 C -4 6, -20 12, -20 34 L 20 34 C 20 12, 4 6, 4 0 C 4 -6, 20 -12, 20 -34 Z', fill: C.white, stroke: C.blue, 'stroke-width': 4, 'stroke-linejoin': 'round' }, body);
    el('path', { d: 'M -17 -32 C -17 -12, -3 -6, -3 0 L 3 0 C 3 -6, 17 -12, 17 -32 Z', fill: C.yellow, 'clip-path': 'url(#hgTop)' }, body);
    el('path', { d: 'M -3 0 C -3 6, -17 12, -17 32 L 17 32 C 17 12, 3 6, 3 0 Z', fill: C.yellow, 'clip-path': 'url(#hgBot)' }, body);
    const stream = el('line', { x1: 0, y1: 0, x2: 0, y2: 30, stroke: C.yellow, 'stroke-width': 2.5 }, body);
    el('rect', { x: -27, y: -42, width: 54, height: 8, rx: 4, fill: C.blue }, body);
    el('rect', { x: -27, y: 34, width: 54, height: 8, rx: 4, fill: C.blue }, body);
    tr(g, cx, cy);
    const P = 6, FLOW = 5.2;
    return t => {
      const u = mod(t + 2.4, P);
      const p = clamp(u / FLOW);
      topRect.setAttribute('y', -32 + 32 * p);          // le haut se vide
      topRect.setAttribute('height', 32 * (1 - p) + 0.01);
      botRect.setAttribute('y', 32 - 32 * p);            // le bas se remplit
      botRect.setAttribute('height', 32 * p + 0.01);
      stream.setAttribute('opacity', u < FLOW ? 1 : 0);
      const r = u >= FLOW ? 180 * ease(prog(u, FLOW, P - FLOW)) : 0;  // on le retourne : ça recommence
      body.setAttribute('transform', r ? `rotate(${r.toFixed(2)})` : '');
    };
  }

  const ITEMS = [
    { scene: sceneStock, name: 'Le stock tampon', why: 'Créé pour absorber un problème.', now: 'Le problème est resté. Le stock aussi.' },
    { scene: sceneRetouche, name: 'Le poste de retouche', why: 'Installé pour gérer les défauts.', now: 'Devenu une étape du process.' },
    { scene: sceneReunion, name: 'La réunion de crise', why: 'Créée pour une urgence ponctuelle.', now: 'Toutes les semaines depuis.' },
    { scene: sceneChariot, name: 'Le chariot de dépannage', why: 'Rempli de pièces « au cas où ».', now: 'L’appro ne suit toujours pas.' },
  ];
  const CARD = { w: 470, h: 258 };
  const POS = [[60, 330], [550, 330], [60, 602], [550, 602]];
  const tickers = [];

  function build() {
    D.template({ author: 'hugo' });
    D.title('Certains gaspillages', 'ont un budget.');
    D.chapeau('Un poste de travail. Parfois même un responsable.');

    const defs = el('defs');
    ITEMS.forEach((it, i) => {
      const [x, y] = POS[i];
      el('rect', { x, y, width: CARD.w, height: CARD.h, rx: 24, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      const sx = x + 12, sy = y + 12;
      const cp = el('clipPath', { id: `scene${i}` }, defs);
      el('rect', { x: 0, y: 0, width: SW, height: SH, rx: 16 }, cp);
      const cpStrip = el('clipPath', { id: `strip${i}` }, defs);
      el('rect', { x: 8, y: 0, width: SW - 16, height: SH }, cpStrip);
      const holder = el('g', { transform: `translate(${sx} ${sy})` });
      el('rect', { x: 0, y: 0, width: SW, height: SH, rx: 16, fill: C.pLav }, holder);
      const g = el('g', { 'clip-path': `url(#scene${i})` }, holder);
      tickers.push(it.scene(g, `strip${i}`));
      fit(text(D.svg, x + 24, y + 186, it.name, { size: 24, weight: 700, fill: C.ink }), x + CARD.w - 16, `vignette ${i + 1} nom`);
      fit(text(D.svg, x + 24, y + 212, it.why, { size: 18, weight: 500, fill: C.blue }), x + CARD.w - 16, `vignette ${i + 1} raison`);
      fit(text(D.svg, x + 24, y + 240, it.now, { size: 19, weight: 700, fill: C.tRed }), x + CARD.w - 16, `vignette ${i + 1} aujourd’hui`);
    });

    // La question à poser dans l'atelier, avec un sablier qui coule (la cause attend)
    el('rect', { x: 60, y: 878, width: 960, height: 176, rx: 24, fill: C.blue });
    tickers.push(hourglass(D.svg, 128, 966));
    fit(text(D.svg, 196, 922, 'La question à poser dans l’atelier', { size: 20, weight: 700, fill: '#cfd0ec' }), 990, 'question étiquette');
    fit(text(D.svg, 196, 966, '« Qu’est-ce qu’on a mis en place pour compenser', { size: 28, weight: 700, fill: C.white }), 1000, 'question ligne 1');
    const q2 = el('text', { x: 196, y: 1006, 'font-family': 'Poppins', 'font-size': 28, 'font-weight': 700, fill: C.white });
    [['un problème qu’on n’a ', C.white], ['jamais résolu', C.yellow], [' ? »', C.white]].forEach(([s, f]) => { el('tspan', { fill: f }, q2).textContent = s; });
    fit(q2, 1000, 'question ligne 2');

    fit(text(D.svg, 62, 1110, 'Derrière chaque contournement qui dure,', { size: 30, weight: 700, fill: C.blue }), 1020, 'chute 1');
    fit(text(D.svg, 62, 1150, 'il y a une cause qui attend toujours.', { size: 30, weight: 700, fill: C.blue }), 1020, 'chute 2');

    D.encart(['Aller plus loin', 'Toutes nos ressources Lean', '(lien en commentaire)']);
  }

  D.start({ duration: 12, build, draw: t => tickers.forEach(f => f(t)) });
})();
