// Blog · 5S · étape « Seiso, nettoyer : nettoyer pour inspecter »
// Mécanique : la même machine sale, nettoyée deux fois. Le chiffon passe, la saleté disparaît, et sous la saleté
// il y a les mêmes quatre anomalies (capot qui ne ferme plus, vis desserrée, flexible usé, fuite naissante).
// À gauche, un prestataire : zone propre, la fuite est essuyée, le relevé reste vide.
// À droite, l'équipe : chaque anomalie trouvée au passage du chiffon est notée, la liste part en maintenance.
// Rendu déterministe : window.FICHE.draw(t), boucle de 13 s, image complète à t = 0.
(() => {
  // Le gabarit ne précharge pas la graisse 600 : la charger avant la construction (mesures de para / fit justes)
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;

  const PANELS = [{ x: 40, team: false }, { x: 610, team: true }];
  const PW = 550;
  const FLOOR = 474;
  const DY = 30;   // décalage vertical de la scène (machine, saleté, marqueurs)
  const SWEEP = { t: 3.0, d: 5.0, x0: 70, x1: 470 };   // x relatifs au panneau
  const RES_T = [8.4, 8.8], CHUTE_T = 9.6;
  const DIRT = '#a89f86';

  // Anomalies (x, y relatifs au panneau) : [libellé, x, y]
  const ANOM = [
    ['Capot qui ne ferme plus', 236, 240],
    ['Vis desserrée', 292, 434],
    ['Fuite naissante', 334, 494],
    ['Flexible usé', 420, 392],
  ];
  // Taches de saleté (déterministes)
  const BLOBS = [];
  {
    let s = 7;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 26; i++) BLOBS.push({ x: 72 + rnd() * 360, y: 250 + rnd() * 215, rx: 9 + rnd() * 16, ry: 6 + rnd() * 9 });
    for (let i = 0; i < 6; i++) BLOBS.push({ x: 80 + rnd() * 380, y: FLOOR + 10 + rnd() * 14, rx: 18 + rnd() * 20, ry: 4 + rnd() * 3 });
  }

  const S = { panels: [] };

  function machine(g, x0) {
    // Flexible (derrière le corps)
    el('path', { d: `M ${x0 + 322} 300 C ${x0 + 400} 300, ${x0 + 432} 350, ${x0 + 420} 400 S ${x0 + 398} 450, ${x0 + 404} ${FLOOR}`, fill: 'none', stroke: '#6b6b8a', 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
    [[-6, -4], [0, 5], [6, -2]].forEach(([dx, dy]) => el('line', { x1: x0 + 414 + dx, y1: 388 + dy, x2: x0 + 424 + dx, y2: 392 + dy, stroke: C.white, 'stroke-width': 2, 'stroke-linecap': 'round' }, g));
    // Corps
    el('rect', { x: x0 + 60, y: 262, width: 270, height: 208, rx: 16, fill: C.blue }, g);
    // Capot entrouvert (charnière à gauche)
    el('rect', { x: x0 + 76, y: 246, width: 236, height: 16, rx: 5, fill: '#35357f', transform: `rotate(-5 ${x0 + 76} 262)` }, g);
    el('rect', { x: x0 + 84, y: 286, width: 150, height: 56, rx: 8, fill: C.white }, g);
    el('rect', { x: x0 + 98, y: 306, width: 120, height: 14, rx: 7, fill: C.green }, g);
    el('circle', { cx: x0 + 286, cy: 300, r: 9, fill: C.lightBlue }, g);
    el('circle', { cx: x0 + 286, cy: 328, r: 9, fill: C.green }, g);
    el('rect', { x: x0 + 84, y: 362, width: 222, height: 90, rx: 8, fill: C.white, 'fill-opacity': 0.14 }, g);
    [[98, 376], [292, 376], [98, 438]].forEach(([x, y]) => el('circle', { cx: x0 + x, cy: y, r: 5, fill: C.white, 'fill-opacity': 0.5 }, g));
    // Vis desserrée : dépasse, fente de travers
    el('circle', { cx: x0 + 294, cy: 437, r: 7.5, fill: '#23235a', opacity: 0.35 }, g);
    el('circle', { cx: x0 + 292, cy: 434, r: 7.5, fill: '#d9d9ea' }, g);
    el('line', { x1: x0 + 287, y1: 437, x2: x0 + 297, y2: 431, stroke: C.ink, 'stroke-width': 2 }, g);
    // Pieds
    el('rect', { x: x0 + 76, y: 470, width: 20, height: 4, fill: C.ink }, g);
    el('rect', { x: x0 + 294, y: 470, width: 20, height: 4, fill: C.ink }, g);
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Nettoyer', 'pour inspecter.');
    G.blogChapeau('Même machine, même zone propre à la fin. Un seul nettoyage produit une information.');

    PANELS.forEach((P, pi) => {
      const x0 = P.x, team = P.team;
      const L = { x0, team };
      G.card(x0, 176, PW, 584);
      L.head = el('g');
      G.pill(L.head, x0 + 28, 212, team ? 'Nettoyage par l’équipe' : 'Nettoyage par un prestataire', { size: 20, h: 36, bg: team ? C.pGreen : C.pRed, fg: team ? C.tGreen : C.tRed });
      L.scene = el('g', { transform: `translate(0 ${DY})` });
      el('line', { x1: x0 + 24, y1: FLOOR + 2, x2: x0 + PW - 24, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, L.scene);
      machine(L.scene, x0);

      // Fuite : goutte et petite flaque
      L.leak = el('g', {}, L.scene);
      el('path', { d: `M ${x0 + 318} 476 Q ${x0 + 311} 487 ${x0 + 318} 491 Q ${x0 + 325} 487 ${x0 + 318} 476 Z`, fill: C.lightBlue }, L.leak);
      el('ellipse', { cx: x0 + 334, cy: 497, rx: 18, ry: 4, fill: C.lightBlue, opacity: 0.7 }, L.leak);

      // Saleté, découpée par le passage du chiffon
      const cl = G.clipRect(x0, 200, PW, 320);
      L.clip = cl.rect;
      L.dirt = el('g', { 'clip-path': cl.url }, L.scene);
      BLOBS.forEach(b => el('ellipse', { cx: x0 + b.x, cy: b.y, rx: b.rx, ry: b.ry, fill: DIRT, opacity: 0.55 }, L.dirt));
      L.sponge = el('g', {}, L.scene);
      el('rect', { x: -24, y: -15, width: 48, height: 30, rx: 9, fill: C.teal }, L.sponge);
      el('rect', { x: -24, y: 5, width: 48, height: 10, rx: 4, fill: C.green }, L.sponge);

      // Marqueurs d'anomalies (équipe seulement)
      L.marks = team ? ANOM.map(([s, ax, ay], k) => {
        const g = el('g', {}, L.scene);
        el('circle', { cx: x0 + ax, cy: ay, r: 20, fill: 'none', stroke: C.yellow, 'stroke-width': 4 }, g);
        const bx = x0 + ax + (k === 3 ? 30 : k === 2 ? 34 : 26), by = ay - (k === 2 ? 4 : 20);
        el('circle', { cx: bx, cy: by, r: 13, fill: C.yellow }, g);
        text(g, bx, by + 6, String(k + 1), { size: 17, weight: 800, fill: C.ink, anchor: 'middle' });
        return { g, cx: x0 + ax, cy: ay, ax };
      }) : [];

      // Relevé d'anomalies
      text(G.svg, x0 + 28, 572, 'Relevé d’anomalies', { size: 20, weight: 700, fill: C.ink });
      if (team) {
        L.lines = ANOM.map(([s], k) => {
          const g = el('g');
          el('circle', { cx: x0 + 42, cy: 600 + 30 * k, r: 12, fill: C.yellow }, g);
          text(g, x0 + 42, 606 + 30 * k, String(k + 1), { size: 15, weight: 800, fill: C.ink, anchor: 'middle' });
          text(g, x0 + 64, 606 + 30 * k, s, { size: 18, weight: 500, fill: C.ink });
          return g;
        });
      } else {
        L.empty = el('g');
        [0, 1, 2, 3].forEach(k => el('line', { x1: x0 + 30, y1: 612 + 30 * k, x2: x0 + 300, y2: 612 + 30 * k, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, L.empty));
        text(L.empty, x0 + 330, 634, 'rien de noté', { size: 18, weight: 600, fill: C.tRed });
      }
      L.res = el('g');
      const rp = G.pill(L.res, x0 + 28, 732, team ? 'Part en maintenance le jour même' : 'Zone propre, zéro information', { size: 19, h: 38, bg: team ? C.green : C.red, fg: C.white, icon: null });
      S.panels.push(L);
    });

    S.chute = G.blogChute('Chaque anomalie trouvée est notée, pas seulement essuyée.', { y: 806 });
  }

  // Position du chiffon (x relatif au panneau) et hauteur en zigzag
  const sweepX = t => SWEEP.x0 + (SWEEP.x1 - SWEEP.x0) * prog(t, SWEEP.t, SWEEP.d);
  const sweepY = t => 372 + 100 * Math.sin((t - SWEEP.t) * 5.2);

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const sx = sweepX(t);

    S.panels.forEach((L, pi) => {
      pop(L.head, t, 1.75 + 0.15 * pi, L.x0 + 150, 212);
      // Saleté : visible à droite du chiffon
      L.clip.setAttribute('x', live ? L.x0 + sx - 10 : L.x0 + PW);
      L.dirt.setAttribute('opacity', live ? clamp(prog(t, 1.9, 0.4)) : 0);
      L.sponge.setAttribute('opacity', live ? window01(t, SWEEP.t - 0.2, SWEEP.t + SWEEP.d + 0.2, 0.2) : 0);
      L.sponge.setAttribute('transform', `translate(${L.x0 + sx} ${sweepY(t)})`);
      // Fuite : essuyée chez le prestataire, gardée (et notée) par l'équipe
      const leakX = ANOM[2][1];
      if (L.team) L.leak.setAttribute('opacity', 1);
      else L.leak.setAttribute('opacity', live ? (sx < leakX ? 1 : 1 - clamp((sx - leakX) / 20)) : 0);

      L.marks.forEach((m, k) => {
        const tk = SWEEP.t + SWEEP.d * clamp((m.ax - SWEEP.x0 + 12) / (SWEEP.x1 - SWEEP.x0));
        pop(m.g, t, tk, m.cx, m.cy);
        pop(L.lines[k], t, tk + 0.35, L.x0 + 150, 600 + 30 * k);
      });
      if (L.empty) L.empty.setAttribute('opacity', live ? clamp(prog(t, 2.2, 0.3)) : o);
      pop(L.res, t, RES_T[pi], L.x0 + 200, 732);
    });
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 13, build, draw });
})();
