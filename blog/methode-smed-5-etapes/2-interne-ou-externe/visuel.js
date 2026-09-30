// Blog · SMED · section « Opérations internes et externes : la distinction clé »
// Mécanique : les huit tâches du tableau de l'article, mélangées comme dans un changement réel, sont toutes faites
// machine arrêtée. Chaque tâche passe la question « exige-t-elle vraiment l'arrêt ? » : les externes sortent vers
// les zones « machine en marche » (avant l'arrêt pour préparer, après pour ranger), la zone d'arrêt se resserre.
// Même travail, arrêt plus court. Rendu déterministe : window.FICHE.draw(t), boucle de 13 s, image complète à t = 0.
(() => {
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_START, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const TOP = 196, BOT = 742;
  const CW = 260, CHh = 92;
  const ROW = r => 286 + 112 * r;
  // Zones [x0, x1] : départ (tout à l'arrêt) et arrivée (tri fait)
  const Z0 = [[64, 316], [326, 886], [896, 1136]];
  const Z1 = [[64, 404], [414, 754], [764, 1136]];
  // Tâches : [libellé, externe ?, position de départ (col, rang), zone et rang d'arrivée]
  const TASKS = [
    ['Démonter et monter l’outillage', false, [0, 0], [1, 0]],
    ['Préparer et contrôler l’outillage suivant', true, [1, 0], [0, 0]],
    ['Régler les paramètres sur la machine', false, [0, 1], [1, 1]],
    ['Approvisionner la matière et les composants', true, [1, 1], [0, 2]],
    ['Préchauffer le moule ou l’outil', true, [0, 2], [0, 1]],
    ['Purger, nettoyer l’intérieur de la machine', false, [1, 2], [1, 2]],
    ['Réaliser les premiers essais', false, [0, 3], [1, 3]],
    ['Ranger l’outillage de la série précédente', true, [1, 3], [2, 0]],
  ];
  const VERD_T = k => 2.9 + 0.6 * k;
  const MOVE_T = 8.1, MOVE_D = 1.35, CHUTE_T = 10.2;

  const S = {};

  // Avancement du tri (0 = départ, 1 = arrivée) : l'image complète est l'arrivée ; pendant l'effacement on revient au départ
  function sortP(t) {
    if (t < FADE_START) return 1;
    if (t < FADE_END) return 1 - easeInOut(prog(t, FADE_START, FADE_END - FADE_START));
    return easeInOut(prog(t, MOVE_T + 0.3, 0.9));
  }
  const lerp = (a, b, p) => a + (b - a) * p;
  const zoneAt = (i, p) => [lerp(Z0[i][0], Z1[i][0], p), lerp(Z0[i][1], Z1[i][1], p)];

  function build() {
    G.templateBlog();
    G.blogTitle('Interne', 'ou externe ?');
    G.blogChapeau('Pour chaque tâche : exige-t-elle vraiment que la machine soit arrêtée ?');

    G.card(40, 176, 1120, 584);
    const ZC = [[C.pGreen, C.tGreen, 'Machine en marche'], [C.pRed, C.tRed, 'Machine arrêtée'], [C.pGreen, C.tGreen, 'Machine en marche']];
    S.zones = ZC.map(([bg, fg, n], i) => {
      const r = el('rect', { y: TOP, height: BOT - TOP, rx: 18, fill: bg });
      const t1 = text(G.svg, 0, TOP + 36, n, { size: 20, weight: 700, fill: fg, anchor: 'middle' });
      const t2 = text(G.svg, 0, TOP + 62, '', { size: 17, weight: 500, fill: C.ink, anchor: 'middle' });
      return { r, t1, t2, i };
    });

    // Les internes d'abord (dessous), les externes ensuite : elles passent par-dessus en sortant
    const order = TASKS.map((_, k) => k).sort((a, b) => TASKS[a][1] - TASKS[b][1]);
    S.cards = [];
    order.forEach(k => { const [lab, ext] = TASKS[k];
      const g = el('g');
      el('rect', { x: 0, y: 0, width: CW, height: CHh, rx: 12, fill: C.white, stroke: C.line, 'stroke-width': 2 }, g);
      const stripe = el('rect', { x: 0, y: 0, width: 9, height: CHh, rx: 4, fill: C.line }, g);
      G.para(g, 22, 30, lab, CW - 36, { size: 17, weight: 600, fill: C.ink, lh: 1.25 });
      const chip = el('g', {}, g);
      const cp = G.pill(chip, 0, 72, ext ? 'externe' : 'interne', { size: 15, h: 26, pad: 10, bg: ext ? C.green : C.red, fg: C.white });
      cp.g.setAttribute('transform', `translate(${CW - 12 - cp.w} 0)`);
      S.cards.push({ g, stripe, chip, ext, k, j: TASKS.slice(0, k).filter(x => x[1]).length });
    });

    S.chute = G.blogChute('Interne = machine arrêtée. Externe = machine en marche.', { y: 806 });
  }

  // Position d'une carte selon l'avancement du tri
  function cardPos(k, p) {
    const [, , [c0, r0], [z1, r1]] = TASKS[k];
    const x0 = c0 === 0 ? 340 : 612, y0 = ROW(r0);
    const zc = (Z1[z1][0] + Z1[z1][1]) / 2;
    const x1 = zc - CW / 2, y1 = ROW(r1);
    return { x: lerp(x0, x1, p), y: lerp(y0, y1, p) };
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const p = sortP(t);

    // Zones et compteurs de tâches
    const counts = p >= 0.5 ? [3, 4, 1] : [0, 8, 0];
    const sub = ['série A', 'changement', 'série B'];
    S.zones.forEach(z => {
      const [a, b] = zoneAt(z.i, p);
      z.r.setAttribute('x', a);
      z.r.setAttribute('width', b - a);
      z.t1.setAttribute('x', (a + b) / 2);
      z.t2.setAttribute('x', (a + b) / 2);
      const n = counts[z.i];
      z.t2.textContent = `${sub[z.i]} · ${n}${NB}tâche${n > 1 ? 's' : ''}`;
      z.t1.setAttribute('opacity', z.i === 1 || b - a > 250 ? 1 : 1);
    });

    S.cards.forEach(c => {
      // Tâche mouvante : les externes glissent vers leur zone, les internes se regroupent (léger décalage)
      const pk = live ? (c.ext ? easeInOut(prog(t, MOVE_T + 0.1 * c.j, 0.85)) : p) : p;
      const pos = cardPos(c.k, pk);
      let s = 1;
      const vt = VERD_T(c.k);
      if (live && t >= vt - 0.05 && t < vt + 0.5) { const q = prog(t, vt, 0.4); s = 1 + 0.05 * Math.sin(Math.PI * q); }
      const cx = pos.x + CW / 2, cy = pos.y + CHh / 2;
      c.g.setAttribute('transform', `translate(${pos.x} ${pos.y})` + (s !== 1 ? ` translate(${CW / 2} ${CHh / 2}) scale(${s}) translate(${-CW / 2} ${-CHh / 2})` : ''));
      c.g.setAttribute('opacity', live ? clamp(prog(t, 1.9 + 0.07 * c.k, 0.3)) : o);
      const judged = !live || t >= vt;
      c.stripe.setAttribute('fill', judged ? (c.ext ? C.green : C.red) : C.line);
      const cq = live ? prog(t, vt, 0.3) : 1;
      const cs = cq <= 0 ? 0.001 : cq >= 1 ? 1 : 0.6 + 0.4 * back(cq);
      c.chip.setAttribute('opacity', clamp(cq / 0.4));
      c.chip.setAttribute('transform', cs === 1 ? '' : `translate(${CW - 50} 72) scale(${cs}) translate(${-(CW - 50)} -72)`);
    });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 13, build, draw });
})();
