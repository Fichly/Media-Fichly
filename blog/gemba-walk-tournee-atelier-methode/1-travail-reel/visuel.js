// Blog · Gemba · section « Qu'est-ce que le gemba, et le gemba walk ? »
// Mécanique : à gauche, le tableau de bord dit « 2 h d'arrêt machine » et rien d'autre.
// À droite, vue de dessus du poste : la fiche décrit un trajet droit vers le rack ; un chariot est garé dans l'allée,
// l'opérateur le contourne à chaque carton. L'observateur, à un endroit fixe, compte les détours, demande pourquoi,
// obtient la raison et écrit l'écart. Le travail prescrit et le travail réel se superposent sous nos yeux.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const P0 = { x: 624, y: 350 }, P1 = { x: 982, y: 350 };
  const CART = { cx: 804, cy: 350, w: 88, h: 62 };
  const REAL = `M ${P0.x} ${P0.y} C 690 ${P0.y} 700 440 764 440 L 846 440 C 910 440 920 ${P1.y} ${P1.x} ${P1.y}`;
  const OBS = { x: 548, y: 528 };
  const GREY = '#b8b8d2';

  // Trois allers-retours au rack
  const CYC = k => 3.0 + 1.9 * k;
  const GO = 0.8, PICK = 0.2;
  const Q_T = CYC(3) + 0.1, A_T = Q_T + 1.0;
  const NOTE_T = A_T + 1.0;
  const CHUTE_T = NOTE_T + 1.9;

  function topPerson(parent, fill) {
    const g = el('g', {}, parent);
    el('ellipse', { cx: 0, cy: 0, rx: 22, ry: 12, fill, opacity: 0.55 }, g);
    el('circle', { cx: 0, cy: 0, r: 11, fill }, g);
    return g;
  }
  function bubble(parent, x, y, w, s, tail, fill = C.white, fg = C.ink) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: w, height: 44, rx: 14, fill, stroke: C.blue, 'stroke-width': 2.5 }, g);
    el('path', { d: tail, fill, stroke: C.blue, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    el('rect', { x: x + 12, y: y + 30, width: 40, height: 12, fill }, g);   // masque le trait de la queue sur le bord
    const tx = text(g, x + w / 2, y + 29, s, { size: 19, weight: 700, fill: fg, anchor: 'middle' });
    fit(tx, x + w - 8, `bulle ${s}`, x + 8);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Travail prescrit,', 'travail réel.');
    G.blogChapeau('Le gemba walk compare le travail tel qu’il se fait au travail tel qu’il est décrit.');

    // ----- Carte gauche : le tableau de bord -----
    G.card(40, 176, 360, 584);
    S.dash = el('g');
    text(S.dash, 64, 216, 'Le tableau de bord', { size: 22, weight: 700, fill: C.ink });
    el('rect', { x: 64, y: 240, width: 312, height: 210, rx: 18, fill: C.pRed }, S.dash);
    text(S.dash, 220, 290, 'Arrêt machine', { size: 21, weight: 600, fill: C.tRed, anchor: 'middle' });
    text(S.dash, 220, 398, `2${NB}h`, { size: 92, weight: 800, fill: C.tRed, anchor: 'middle' });
    S.blind = el('g');
    S.blindBox = el('rect', { x: 64, y: 474, width: 312, height: 262, rx: 18, fill: 'none', stroke: GREY, 'stroke-width': 3, 'stroke-dasharray': '9 7' }, S.blind);
    text(S.blind, 220, 552, 'Le détour', { size: 21, weight: 700, fill: C.ink, anchor: 'middle' }).setAttribute('opacity', 0.55);
    text(S.blind, 220, 580, 'à chaque carton', { size: 21, weight: 700, fill: C.ink, anchor: 'middle' }).setAttribute('opacity', 0.55);
    S.blindTag = el('g', {}, S.blind);
    G.pill(S.blindTag, 220, 646, 'n’apparaît nulle part', { size: 18, h: 34, bg: C.pLav, fg: C.ink, anchor: 'middle' });

    // ----- Carte droite : le gemba, vu de dessus -----
    G.card(416, 176, 744, 584);
    S.head = el('g');
    text(S.head, 440, 216, 'Au gemba, vu de dessus', { size: 22, weight: 700, fill: C.ink });
    S.countG = el('g');
    S.countBg = el('rect', { y: 196, height: 32, rx: 16, fill: C.pRed }, S.countG);
    S.count = text(S.countG, 0, 219, '', { size: 18, weight: 700, fill: C.tRed });

    S.plan = el('g');
    // Poste (machine vue de dessus)
    el('rect', { x: 452, y: 300, width: 116, height: 100, rx: 14, fill: C.blue }, S.plan);
    el('rect', { x: 468, y: 316, width: 60, height: 36, rx: 6, fill: C.white }, S.plan);
    el('circle', { cx: 548, cy: 330, r: 7, fill: C.green }, S.plan);
    text(S.plan, 510, 426, 'Poste', { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
    // Rack de cartons
    el('rect', { x: 1010, y: 270, width: 104, height: 160, rx: 10, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, S.plan);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) G.carton(S.plan, 1040 + c * 44, 294 + r * 37, 0.9);
    text(S.plan, 1062, 456, 'Rack', { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
    // Trajet décrit par la fiche (sous le chariot)
    S.presc = el('g');
    el('line', { x1: P0.x + 26, y1: P0.y, x2: P1.x - 24, y2: P1.y, stroke: C.tGreen, 'stroke-width': 3.5, 'stroke-dasharray': '9 7', 'stroke-linecap': 'round' }, S.presc);
    text(S.presc, CART.cx, 300, 'tel que décrit', { size: 18, weight: 700, fill: C.tGreen, anchor: 'middle' });
    // Chariot garé dans l'allée
    S.cart = el('g');
    el('rect', { x: CART.cx - CART.w / 2, y: CART.cy - CART.h / 2, width: CART.w, height: CART.h, rx: 8, fill: GREY }, S.cart);
    el('rect', { x: CART.cx - CART.w / 2 + 8, y: CART.cy - CART.h / 2 + 8, width: CART.w - 16, height: CART.h - 16, rx: 5, fill: 'none', stroke: C.white, 'stroke-width': 2.5 }, S.cart);
    el('line', { x1: CART.cx + CART.w / 2, y1: CART.cy - 18, x2: CART.cx + CART.w / 2 + 12, y2: CART.cy - 18, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.cart);
    el('line', { x1: CART.cx + CART.w / 2 + 12, y1: CART.cy - 18, x2: CART.cx + CART.w / 2 + 12, y2: CART.cy + 18, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.cart);
    el('line', { x1: CART.cx + CART.w / 2, y1: CART.cy + 18, x2: CART.cx + CART.w / 2 + 12, y2: CART.cy + 18, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.cart);
    // Trajet réel (se dessine au premier passage)
    S.real = el('path', { d: REAL, fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round' });
    S.realLen = S.real.getTotalLength();
    S.realLab = text(G.svg, CART.cx, 474, 'tel qu’il se fait', { size: 18, weight: 700, fill: C.tRed, anchor: 'middle' });
    // Opérateur et carton porté
    S.op = el('g');
    S.carry = G.carton(S.op, 0, -26, 0.8);
    topPerson(S.op, C.blue);
    // Observateur, à un endroit fixe, avec sa feuille
    S.obs = el('g');
    const ob = topPerson(S.obs, C.violet);
    ob.setAttribute('transform', `translate(${OBS.x} ${OBS.y})`);
    el('rect', { x: OBS.x + 14, y: OBS.y - 30, width: 22, height: 28, rx: 3, fill: C.white, stroke: C.violet, 'stroke-width': 2.5 }, S.obs);
    text(S.obs, OBS.x, OBS.y + 38, 'Observateur', { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
    // Question, puis raison donnée par l'opérateur
    S.q = bubble(G.svg, 592, 506, 244, `Pourquoi ce détour${NB}?`, `M 604 540 L 578 546 L 616 548 Z`);
    S.a = bubble(G.svg, 444, 238, 300, 'Il n’a pas d’autre place.', `M ${P0.x - 16} 281 L ${P0.x - 4} 318 L ${P0.x + 8} 281 Z`, C.pLav, C.blue);

    // Écart écrit
    S.note = el('g');
    el('rect', { x: 440, y: 590, width: 696, height: 150, rx: 18, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, S.note);
    G.pill(S.note, 464, 624, 'Écart écrit', { size: 18, h: 32, bg: C.blue, fg: C.white });
    S.n1 = text(S.note, 464, 674, 'Le chariot est contourné à chaque carton.', { size: 21, weight: 700, fill: C.ink });
    S.n2 = text(S.note, 464, 712, 'Raison : il n’a pas d’emplacement prévu.', { size: 21, weight: 500, fill: C.ink });
    fit(S.n1, 1120, 'écart ligne 1'); fit(S.n2, 1120, 'écart ligne 2');

    S.chute = G.blogChute('Une tournée sert à trouver cette raison, pas à la rappeler.', { y: 806 });
  }

  // Position de l'opérateur à l'instant t : 0 = au poste, 1 = au rack (le long du trajet réel)
  function trip(t) {
    for (let k = 0; k < 3; k++) {
      const c = CYC(k);
      if (t >= c && t < c + GO) return { s: easeInOut(prog(t, c, GO)), carry: false, k };
      if (t >= c + GO && t < c + GO + PICK) return { s: 1, carry: true, k };
      if (t >= c + GO + PICK && t < c + 2 * GO + PICK) return { s: 1 - easeInOut(prog(t, c + GO + PICK, GO)), carry: true, k };
    }
    return { s: 0, carry: false, k: -1 };
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    pop(S.dash, t, 1.7, 220, 345);
    pop(S.blind, t, 1.9, 220, 605);
    pop(S.head, t, 1.8, 560, 210);
    pop(S.plan, t, 2.0, 780, 360);
    pop(S.cart, t, 2.2, CART.cx, CART.cy);
    pop(S.obs, t, 2.4, OBS.x, OBS.y);
    rise(S.presc, t, 2.5, 0.35);

    // Opérateur : trois allers-retours, toujours par le détour
    const tr = live ? trip(t) : { s: 0, carry: false, k: -1 };
    const pt = S.real.getPointAtLength(S.realLen * tr.s);
    const pOp = prog(t, 2.2, 0.3);
    S.op.setAttribute('transform', `translate(${pt.x} ${pt.y})` + (live && pOp < 1 ? ` scale(${Math.max(0.001, pOp)})` : ''));
    S.op.setAttribute('opacity', live ? clamp(pOp / 0.4) : o0);
    S.carry.setAttribute('opacity', tr.carry ? 1 : 0);
    // Le trajet réel se dessine au premier aller
    const drawn = live ? (t < CYC(0) ? 0 : t < CYC(0) + GO ? tr.s : 1) : 1;
    S.real.setAttribute('stroke-dasharray', `${S.realLen} ${S.realLen}`);
    S.real.setAttribute('stroke-dashoffset', S.realLen * (1 - drawn));
    S.real.setAttribute('opacity', o0);
    rise(S.realLab, t, CYC(0) + GO, 0.35);

    // Compteur de détours (un par carton attrapé)
    let n = 3;
    if (live) { n = 0; for (let k = 0; k < 3; k++) if (t >= CYC(k) + GO) n++; }
    S.count.textContent = `détours observés${NB}: ${n}`;
    const cw = measure(S.count).width;
    S.count.setAttribute('x', 1136 - 14 - cw);
    S.countBg.setAttribute('x', 1136 - 28 - cw);
    S.countBg.setAttribute('width', cw + 28);
    S.countG.setAttribute('opacity', live ? clamp(prog(t, 2.6, 0.3)) : o0);
    if (live && t >= CYC(0) + GO) pulse(S.countG, t, CYC(Math.max(0, n - 1)) + GO, 1136 - cw / 2 - 14, 212, 0.1, 0.35);
    else S.countG.setAttribute('transform', '');

    // Question, raison, écart écrit
    pop(S.q, t, Q_T, 714, 528);
    pop(S.a, t, A_T, 594, 260);
    rise(S.note, t, NOTE_T, 0.45);
    S.n1.setAttribute('opacity', live ? clamp(prog(t, NOTE_T + 0.3, 0.3)) : 1);
    S.n2.setAttribute('opacity', live ? clamp(prog(t, NOTE_T + 0.8, 0.3)) : 1);

    // Ce que le tableau de bord ne montre pas
    const hl = !live || t >= NOTE_T + 1.2;
    S.blindBox.setAttribute('stroke', hl ? C.red : GREY);
    if (live && t >= NOTE_T + 1.2) pulse(S.blind, t, NOTE_T + 1.2, 220, 605, 0.05, 0.45);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
