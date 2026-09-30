// Blog · Lean Manufacturing · section « Juste-à-temps et jidoka : les deux piliers du système Toyota »
// Mécanique : la maison se construit dans l'ordre où elle tient. D'abord les fondations (stabilité, standards),
// puis les deux piliers, puis le toit (le client). Chaque pilier se déplie en une fiche : ce que c'est, les outils.
// Démo jidoka : une anomalie arrive, l'andon passe au rouge, la ligne s'arrête, le problème est traité.
// Rendu déterministe : window.FICHE.draw(t), boucle de 13 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, slide, pulse } = G;

  const H = { cx: 600, roofTop: 200, roofBase: 318, pilTop: 330, pilBot: 632, found: 644, foundH: 64 };
  const PIL = [{ x: 392, w: 156 }, { x: 652, w: 156 }];
  const T = { found: 1.8, pil: [2.45, 2.8], roof: 3.3, link: 3.9, cards: [4.3, 5.2], demo: 7.2, chute: 9.8 };

  const S = {};

  function card(side, title, def, tools, color) {
    const x = side === 0 ? 40 : 850, w = 310, y = 334, h = 342;
    const g = el('g');
    el('rect', { x, y, width: w, height: h, rx: 22, fill: C.card, stroke: C.line, 'stroke-width': 2 }, g);
    el('rect', { x, y, width: w, height: 8, rx: 4, fill: color }, g);
    text(g, x + 22, y + 44, title, { size: 23, weight: 800, fill: C.ink });
    const d = G.para(g, x + 22, y + 78, def, w - 40, { size: 19, weight: 500, fill: C.ink, lh: 1.3 });
    const ty = y + 78 + 19 * 1.3 * (d.n - 1) + 36;
    text(g, x + 22, ty, 'Outils associés', { size: 16, weight: 700, fill: C.blue });
    // Outils en pilules, retour à la ligne automatique
    const pills = [];
    let px = x + 22, py = ty + 30;
    tools.forEach((s, i) => {
      const pg = el('g', {}, g);
      const p = G.pill(pg, px, py, s, { size: 17, h: 30, pad: 12, bg: C.pLav, fg: C.blue });
      if (px + p.w > x + w - 18 && px > x + 22) {
        px = x + 22; py += 38;
        p.g.remove();
        const q = G.pill(pg, px, py, s, { size: 17, h: 30, pad: 12, bg: C.pLav, fg: C.blue });
        pills.push({ g: pg, cx: px + q.w / 2, cy: py });
        px += q.w + 8;
      } else {
        pills.push({ g: pg, cx: px + p.w / 2, cy: py });
        px += p.w + 8;
      }
    });
    if (py + 15 > y + h - 10) console.error(`Débordement : outils ${title}`);
    return { g, pills, x, w };
  }

  // Andon : colonne lumineuse à trois feux
  function andon(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('rect', { x: cx - 3, y: cy + 30, width: 6, height: 26, fill: C.white, 'fill-opacity': 0.8 }, g);
    el('rect', { x: cx - 15, y: cy - 38, width: 30, height: 72, rx: 8, fill: C.white }, g);
    const red = el('circle', { cx, cy: cy - 22, r: 9, fill: C.red, 'fill-opacity': 0.25 }, g);
    el('circle', { cx, cy: cy - 1, r: 9, fill: C.yellow, 'fill-opacity': 0.25 }, g);
    const green = el('circle', { cx, cy: cy + 20, r: 9, fill: C.green }, g);
    return { red, green };
  }
  // Horloge et carte kanban (juste-à-temps)
  function clock(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy, r: 30, fill: C.white }, g);
    el('circle', { cx, cy, r: 3.5, fill: C.ink }, g);
    el('line', { x1: cx, y1: cy, x2: cx + 12, y2: cy, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    const hand = el('line', { x1: cx, y1: cy, x2: cx, y2: cy - 22, stroke: C.teal, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    return hand;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('D’abord le socle,', 'puis les piliers.');
    G.blogChapeau('Le système Toyota : deux piliers posés sur la stabilité, au service du client.');

    // Fondations
    S.found = el('g');
    el('rect', { x: 360, y: H.found, width: 480, height: H.foundH, rx: 14, fill: C.ink }, S.found);
    text(S.found, H.cx, H.found + 30, 'Fondations', { size: 16, weight: 600, fill: C.white, anchor: 'middle' }).setAttribute('fill-opacity', 0.7);
    text(S.found, H.cx, H.found + 54, 'Stabilité et standards', { size: 22, weight: 800, fill: C.white, anchor: 'middle' });

    // Piliers
    S.pils = PIL.map((p, i) => {
      const g = el('g');
      const col = i === 0 ? C.teal : C.violet;
      el('rect', { x: p.x, y: H.pilTop, width: p.w, height: H.pilBot - H.pilTop, rx: 12, fill: col }, g);
      el('rect', { x: p.x - 8, y: H.pilBot - 16, width: p.w + 16, height: 16, rx: 5, fill: col }, g);
      el('rect', { x: p.x - 8, y: H.pilTop, width: p.w + 16, height: 16, rx: 5, fill: col }, g);
      const cx = p.x + p.w / 2;
      const lab = i === 0 ? ['Juste-', 'à-temps'] : ['Jidoka'];
      lab.forEach((l, k) => text(g, cx, H.pilTop + 58 + 30 * k, l, { size: 26, weight: 800, fill: C.white, anchor: 'middle' }));
      const sub = i === 0 ? ['La bonne pièce,', 'au bon moment'] : ['Stop dès', 'qu’une anomalie', 'apparaît'];
      sub.forEach((l, k) => text(g, cx, H.pilTop + (i === 0 ? 132 : 102) + 22 * k, l, { size: 16, weight: 600, fill: C.white, anchor: 'middle' }));
      return { g, cx };
    });
    S.hand = clock(S.pils[0].g, S.pils[0].cx, 552);
    S.andon = andon(S.pils[1].g, S.pils[1].cx, 552);
    S.stop = el('g', { opacity: 0 });
    G.pill(S.stop, S.pils[1].cx + 26, 516, 'STOP', { size: 16, h: 28, pad: 10, bg: C.red, fg: C.white });

    // Toit
    S.roof = el('g');
    el('path', { d: `M ${H.cx} ${H.roofTop} L ${H.cx + 232} ${H.roofBase} L ${H.cx - 232} ${H.roofBase} Z`, fill: C.blue, stroke: C.blue, 'stroke-width': 10, 'stroke-linejoin': 'round' }, S.roof);
    text(S.roof, H.cx, 282, 'Satisfaction du client', { size: 22, weight: 800, fill: C.white, anchor: 'middle' });
    text(S.roof, H.cx, 258, 'Le toit', { size: 15, weight: 600, fill: C.white, anchor: 'middle' }).setAttribute('fill-opacity', 0.7);

    // Lien entre les piliers
    S.link = el('g');
    const ly = 470;
    G.arrow(S.link, `M ${H.cx - 30} ${ly} L ${PIL[0].x + PIL[0].w + 8} ${ly}`, { width: 3, head: 9 });
    G.arrow(S.link, `M ${H.cx + 30} ${ly} L ${PIL[1].x - 8} ${ly}`, { width: 3, head: 9 });
    const lt = text(S.link, H.cx, ly - 16, 'ensemble', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
    el('circle', { cx: H.cx, cy: ly, r: 7, fill: C.blue }, S.link);

    // Fiches des piliers
    S.cards = [
      card(0, 'Juste-à-temps', 'Produire la bonne pièce, en bonne quantité, au bon moment.', ['Kanban', 'Flux tiré', 'Takt time', 'SMED', 'Lissage de la charge'], C.teal),
      card(1, 'Jidoka', 'Arrêter la production dès qu’une anomalie apparaît, pour ne pas fabriquer de défaut.', ['Andon', 'Poka-yoke', 'Autocontrôle', 'Résolution de problèmes'], C.violet),
    ];
    S.conn = [
      el('path', { d: `M 350 500 L ${PIL[0].x - 10} 500`, stroke: C.teal, 'stroke-width': 3, 'stroke-dasharray': '5 5' }),
      el('path', { d: `M 850 500 L ${PIL[1].x + PIL[1].w + 10} 500`, stroke: C.violet, 'stroke-width': 3, 'stroke-dasharray': '5 5' }),
    ];

    S.chute = G.blogChute('Un défaut au poste : une minute. Chez le client : une réclamation.', { y: 800 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // Fondations : montent du sol
    rise(S.found, t, T.found, 0.45, 40);
    // Piliers : poussent depuis les fondations
    S.pils.forEach((p, i) => {
      const q = live ? easeOut(prog(t, T.pil[i], 0.5)) : 1;
      const k = Math.max(0.001, q);
      p.g.setAttribute('transform', q >= 1 ? '' : `translate(0 ${H.pilBot}) scale(1 ${k}) translate(0 ${-H.pilBot})`);
      p.g.setAttribute('opacity', live ? clamp(q * 4) : o);
    });
    // Toit : descend et se pose
    {
      let y = 0, op = o;
      if (live) { const p = prog(t, T.roof, 0.5); y = p >= 1 ? 0 : -60 * (1 - back(p)); op = clamp(p / 0.4); }
      S.roof.setAttribute('transform', y === 0 ? '' : `translate(0 ${y})`);
      S.roof.setAttribute('opacity', op);
    }
    pop(S.link, t, T.link, H.cx, 470);

    // Fiches : glissent depuis le bord, puis les outils apparaissent un à un
    S.cards.forEach((c, i) => {
      slide(c.g, t, T.cards[i], 0.45, i === 0 ? -120 : 120);
      S.conn[i].setAttribute('opacity', live ? clamp(prog(t, T.cards[i] + 0.3, 0.3)) : o);
      c.pills.forEach((p, k) => {
        if (!live) return;
        const q = prog(t, T.cards[i] + 0.45 + 0.1 * k, 0.3);
        const s = q <= 0 ? 0.001 : q >= 1 ? 1 : 0.6 + 0.4 * back(q);
        p.g.setAttribute('transform', s === 1 ? '' : `translate(${p.cx} ${p.cy}) scale(${s}) translate(${-p.cx} ${-p.cy})`);
      });
    });

    // Démo : l'horloge du juste-à-temps tourne, puis l'andon du jidoka passe au rouge et la ligne s'arrête
    const a = live ? 360 * easeInOut(prog(t, T.demo - 0.9, 0.8)) : 0;
    S.hand.setAttribute('transform', a === 0 || a === 360 ? '' : `rotate(${a} ${S.pils[0].cx} 552)`);
    const stopOn = live && t >= T.demo && t < T.demo + 1.5;
    S.andon.red.setAttribute('fill-opacity', stopOn ? 1 : 0.25);
    S.andon.green.setAttribute('fill-opacity', stopOn ? 0.25 : 1);
    S.stop.setAttribute('opacity', stopOn ? 1 : 0);
    if (stopOn) pulse(S.stop, t, T.demo, S.pils[1].cx + 52, 516, 0.15, 0.4);
    if (live && t >= T.demo && t < T.demo + 0.8) pulse(S.cards[1].g, t, T.demo, 1005, 505, 0.03, 0.5);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 13, build, draw });
})();
