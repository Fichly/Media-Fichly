// Visuel 1 · Kaizen : définition, méthode et mise en pratique en atelier (section « Les 5 principes du kaizen »)
// Brief : pente montée par petites marches avec cales « standard », contre une pente sans cales.
// Mécanique : deux pentes identiques. À gauche, trois petits pas puis un changement d'équipe : tout redescend.
// À droite, cinq petits pas, chacun calé par un standard : le gain tient.
(() => {
  const G = window.Gabarit, A = window.Article;
  const { C, el, text, fit, prog, easeInOut, clamp } = G;

  const P = [2.6, 3.5, 4.4, 5.3, 6.2]; // poussées
  const PUSH = 0.55, STEP = 85, U0 = 20, BLOCK = 52;
  const SLIDE = 5.6, SLIDE_DUR = 0.9;
  const S = {};

  function panel(parent, x, { ok, head, sub }) {
    const g = el('g', {}, parent);
    G.card(x, 150, 550, 600, g);
    const ic = el('g', {}, g);
    (ok ? G.check : G.cross)(ic, x + 52, 200, 18);
    fit(text(g, x + 82, 210, head, { size: 28, weight: 800, fill: ok ? C.tGreen : C.tRed }), x + 530, head);
    fit(text(g, x + 34, 248, sub, { size: 20, weight: 500, fill: C.ink }), x + 530, sub);
    // Pente : triangle, surface bleue
    const ax = x + 50, ay = 655, bx = x + 500, by = 380;
    const ramp = el('g', {}, parent);
    el('path', { d: `M ${ax} ${ay} L ${bx} ${ay} L ${bx} ${by} Z`, fill: C.pLav }, ramp);
    el('line', { x1: ax, y1: ay, x2: bx, y2: by, stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, ramp);
    el('line', { x1: ax - 10, y1: ay, x2: bx + 10, y2: ay, stroke: C.line, 'stroke-width': 3 }, ramp);
    const deg = Math.atan2(ay - by, bx - ax) * 180 / Math.PI;
    const holder = el('g', {}, parent);
    const frame = el('g', { transform: `translate(${ax} ${ay}) rotate(${-deg})` }, holder);
    return { g, ramp, holder, frame };
  }

  function build() {
    const root = A.template('Le standard est la cale du kaizen',
      'Chaque amélioration écrite dans le standard empêche de redescendre la pente.');

    S.L = panel(root, 40, { ok: false, head: 'Sans standard', sub: 'Les petits pas glissent au premier changement.' });
    S.R = panel(root, 610, { ok: true, head: 'Avec standard', sub: 'Chaque petit pas est calé avant le suivant.' });

    // Cales (à droite) : derrière chaque nouvelle position du bloc
    S.wedges = P.map((_, k) => {
      const u = U0 + STEP * (k + 1);
      const g = el('g', {}, S.R.frame);
      el('path', { d: `M ${u - 36} 0 L ${u - 1} 0 L ${u - 1} -32 Z`, fill: C.yellow, stroke: C.tYellow, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
      text(g, u - 19, 22, 'standard', { size: 14, weight: 700, fill: C.tYellow, anchor: 'middle' });
      return { g, cx: u - 12, cy: -12 };
    });

    const block = frame => {
      const g = el('g', {}, frame);
      el('rect', { x: 0, y: -BLOCK, width: BLOCK, height: BLOCK, rx: 9, fill: C.blue }, g);
      el('rect', { x: 9, y: -BLOCK + 9, width: BLOCK - 18, height: 6, rx: 3, fill: C.white, opacity: 0.35 }, g);
      return g;
    };
    // Fantôme du point le plus haut atteint, et flèche de la glissade
    const top = U0 + 3 * STEP;
    S.ghost = el('g', {}, S.L.frame);
    el('rect', { x: top, y: -BLOCK, width: BLOCK, height: BLOCK, rx: 9, fill: 'none', stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', opacity: 0.6 }, S.ghost);
    S.arrow = el('g', {}, S.L.frame);
    el('path', { d: `M ${top - 14} -78 L ${U0 + BLOCK + 22} -78`, fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.arrow);
    el('path', { d: `M ${U0 + BLOCK + 36} -90 L ${U0 + BLOCK + 20} -78 L ${U0 + BLOCK + 36} -66`, fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.arrow);
    S.blockL = block(S.L.frame);
    S.blockR = block(S.R.frame);

    // Changement d'équipe : étiquette au point le plus haut atteint à gauche
    S.event = el('g', {}, root);
    G.pill(S.event, 300, 400, 'Changement d’équipe', { size: 18, h: 34, bg: C.pYellow, fg: C.tYellow, anchor: 'middle' });

    S.endL = el('g', {}, root);
    G.pill(S.endL, 315, 712, 'Retour au point de départ', { size: 20, bg: C.pRed, fg: C.tRed, icon: 'cross', anchor: 'middle' });
    S.endR = el('g', {}, root);
    G.pill(S.endR, 885, 712, 'Le gain tient, on repart de plus haut', { size: 20, bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' });
  }

  const climbed = (tt, n) => P.slice(0, n).reduce((u, p) => u + STEP * easeInOut(prog(tt, p, PUSH)), U0);

  function draw(t) {
    const tt = A.T(t);
    A.show(S.L.g, tt, 1.6, { dx: -30, dy: 0 });
    A.show(S.R.g, tt, 1.75, { dx: 30, dy: 0 });
    A.show(S.L.ramp, tt, 1.95);
    A.show(S.R.ramp, tt, 2.05);
    A.show(S.L.holder, tt, 2.2);
    A.show(S.R.holder, tt, 2.2);

    // Gauche : trois pas, puis tout glisse (accélération façon gravité)
    const top = climbed(1e9, 3);
    const fall = prog(tt, SLIDE, SLIDE_DUR);
    const uL = clamp(climbed(tt, 3) - (top - U0) * fall * fall, U0, top);
    S.blockL.setAttribute('transform', `translate(${uL} 0)`);
    S.blockR.setAttribute('transform', `translate(${climbed(tt, 5)} 0)`);
    S.wedges.forEach((w, k) => A.show(w.g, tt, P[k] + PUSH - 0.05, { scale: true, cx: w.cx, cy: w.cy, dur: 0.35 }));

    A.show(S.ghost, tt, SLIDE, { dy: 0, dur: 0.2 });
    A.show(S.arrow, tt, SLIDE + 0.3, { dx: 20, dy: 0, dur: 0.6 });
    A.show(S.event, tt, P[3] - 0.05, { scale: true, cx: 300, cy: 400 });
    A.show(S.endL, tt, SLIDE + SLIDE_DUR + 0.2);
    A.show(S.endR, tt, P[4] + PUSH + 0.5);
  }

  A.start({ duration: 11, build, draw });
})();
