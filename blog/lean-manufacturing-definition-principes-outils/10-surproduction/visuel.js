// Blog · Lean Manufacturing · section « Les gaspillages : ce que le Lean cherche à supprimer »
// Mécanique, carte 1 : la machine produit trop tôt, la pile grossit ; chaque conséquence citée par l'article
// (transportée, stockée, reprise si le besoin change, masque les problèmes) allume les gaspillages qu'elle entraîne,
// jusqu'à ce que les sept autres soient allumés.
// Carte 2 : Mura (charge irrégulière) → les pics dépassent la capacité → Muri (surcharge) → défauts et attentes.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const FLOOR = 330;
  const CHIP = { x: 384, w: 306, h: 44 };
  const CHIPS = [
    { s: 'transportée', cy: 258, to: [0] },
    { s: 'stockée', cy: 318, to: [1, 2, 3] },
    { s: 'reprise si le besoin change', cy: 378, to: [4] },
    { s: 'masque les problèmes', cy: 438, to: [5, 6] },
  ];
  const MUDA = ['Transports', 'Stocks', 'Attentes', 'Mouvements inutiles', 'Étapes inutiles', 'Défauts', 'Compétences non utilisées'];
  const BX = 822, BY = k => 248 + 40 * k;
  // Pile de cartons (pyramide 3-2-1) à la sortie de la machine
  const PILE = [[220, 0], [250, 0], [280, 0], [235, 1], [265, 1], [250, 2]].map(([x, r]) => ({ x, y: FLOOR - 14 - 28 * r }));
  // Carte 2 : charge journalière (Mura), capacité
  const LOAD = [52, 96, 38, 122, 60, 30, 112, 44, 88, 56];
  const CH = { x: 78, base: 736, bw: 26, gap: 10, cap: 78 };

  // ---------- Chronologie ----------
  const PILE_T = k => 2.2 + 0.32 * k;
  const CHIP_T = i => 3.4 + 1.15 * i;          // lien pile → conséquence
  const BADGE_T = i => CHIP_T(i) + 0.6;        // liens conséquence → gaspillages
  const ALL_T = CHIP_T(3) + 1.5;               // les sept autres
  const BAR_T = k => 9.1 + 0.14 * k;
  const MURI_T = 10.9, MUDA2_T = 11.9;
  const CHUTE_T = 13.2;

  function build() {
    G.templateBlog();
    G.blogTitle('Un gaspillage', 'en fabrique sept.');
    G.blogChapeau('Huit familles de gaspillages (muda), et deux autres formes de perte : Mura et Muri.');

    // ----- Carte 1 : surproduction → les sept autres -----
    G.card(40, 176, 1120, 348);
    const head = (x, s) => text(G.svg, x, 214, s, { size: 18, weight: 600, fill: C.ink });
    head(66, 'La cause');
    head(CHIP.x, 'Une pièce produite trop tôt est…');
    head(BX, 'Les sept autres gaspillages');

    S.src = el('g');
    const m = G.machine(S.src, 66, FLOOR - 77, 0.62);
    S.gauge = m.gauge;
    el('line', { x1: 66, y1: FLOOR + 2, x2: 306, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, S.src);
    text(S.src, 66, 368, 'Surproduction', { size: 22, weight: 700, fill: C.tRed });
    text(S.src, 66, 394, 'des pièces produites', { size: 18, weight: 500, fill: C.ink });
    text(S.src, 66, 416, 'avant d’être demandées', { size: 18, weight: 500, fill: C.ink });
    S.pile = PILE.map(p => ({ ...p, g: G.carton(G.svg, p.x, p.y, 0.84) }));

    // Liens pile → conséquences
    S.links1 = CHIPS.map(c => G.arrow(G.svg, `M 312 ${FLOOR - 30} C 350 ${FLOOR - 30} 340 ${c.cy} ${CHIP.x - 6} ${c.cy}`, { stroke: C.red, width: 3, head: 9 }));
    // Conséquences
    S.chips = CHIPS.map((c, i) => {
      const g = el('g');
      el('rect', { x: CHIP.x, y: c.cy - CHIP.h / 2, width: CHIP.w, height: CHIP.h, rx: 12, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, g);
      fit(text(g, CHIP.x + 16, c.cy + 7, c.s, { size: 19, weight: 700, fill: C.tYellow }), CHIP.x + CHIP.w - 8, `conséquence ${i}`);
      return g;
    });
    // Liens conséquences → gaspillages
    S.links2 = CHIPS.map(c => c.to.map(k => G.arrow(G.svg, `M ${CHIP.x + CHIP.w + 4} ${c.cy} C ${CHIP.x + CHIP.w + 60} ${c.cy} ${BX - 60} ${BY(k)} ${BX - 8} ${BY(k)}`, { stroke: C.red, width: 2.5, head: 8 })));
    // Gaspillages : gris, puis allumés
    S.badges = MUDA.map((s, k) => {
      const off = el('g');
      G.pill(off, BX, BY(k), s, { size: 18, h: 32, pad: 14, bg: C.pLav, fg: C.ink });
      const on = el('g');
      const p = G.pill(on, BX, BY(k), s, { size: 18, h: 32, pad: 14, bg: C.red, fg: C.white });
      fit(p.g, 1140, `gaspillage ${k}`);
      return { off, on, cx: BX + p.w / 2, w: p.w };
    });

    // ----- Carte 2 : Mura → Muri → défauts et attentes -----
    G.card(40, 540, 1120, 220);
    S.mura = el('g');
    text(S.mura, 66, 578, 'Mura', { size: 22, weight: 800, fill: C.blue });
    text(S.mura, 136, 578, 'charge irrégulière', { size: 19, weight: 600, fill: C.ink });
    const capY = CH.base - CH.cap;
    el('line', { x1: CH.x - 8, y1: CH.base + 1, x2: CH.x + 10 * (CH.bw + CH.gap), y2: CH.base + 1, stroke: C.line, 'stroke-width': 3 }, S.mura);
    S.bars = LOAD.map((h, k) => {
      const x = CH.x + k * (CH.bw + CH.gap);
      const g = el('g');
      el('rect', { x, y: CH.base - Math.min(h, CH.cap), width: CH.bw, height: Math.min(h, CH.cap), rx: 3, fill: C.lightBlue }, g);
      if (h > CH.cap) el('rect', { x, y: CH.base - h, width: CH.bw, height: h - CH.cap, rx: 3, fill: C.red }, g);
      return { g, x, h };
    });
    S.cap = el('g');
    el('line', { x1: CH.x - 8, y1: capY, x2: CH.x + 10 * (CH.bw + CH.gap) - 2, y2: capY, stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, S.cap);
    text(S.cap, CH.x + 10 * (CH.bw + CH.gap) + 4, capY + 6, 'capacité', { size: 17, weight: 600, fill: C.ink });

    S.arrowA = G.arrow(G.svg, 'M 536 668 L 588 668', { width: 4, head: 11 });
    S.muri = el('g');
    text(S.muri, 606, 578, 'Muri', { size: 22, weight: 800, fill: C.blue });
    text(S.muri, 670, 578, 'surcharge', { size: 19, weight: 600, fill: C.ink });
    const mm = G.machine(S.muri, 606, 606, 0.5);
    S.muriGauge = mm.gauge; S.muriLight = mm.lights[1];
    // Charge du poste : barre qui déborde de la capacité
    el('rect', { x: 710, y: 606, width: 22, height: 62, rx: 4, fill: C.pLav }, S.muri);
    S.muriFill = el('rect', { x: 710, y: 606, width: 22, height: 62, rx: 4, fill: C.red }, S.muri);
    el('line', { x1: 704, y1: 620, x2: 738, y2: 620, stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, S.muri);
    G.para(S.muri, 606, 698, 'postes surchargés aux pics', 190, { size: 17, weight: 500, fill: C.ink, lh: 1.25 });

    S.arrowB = G.arrow(G.svg, 'M 808 668 L 860 668', { width: 4, head: 11 });
    S.muda2 = el('g');
    const d1 = G.pill(S.muda2, 878, 604, 'Défauts', { size: 18, h: 32, pad: 14, bg: C.red, fg: C.white });
    G.pill(S.muda2, 878 + d1.w + 10, 604, 'Attentes', { size: 18, h: 32, pad: 14, bg: C.red, fg: C.white });
    const pr = G.para(S.muda2, 878, 652, 'un poste surchargé produit des défauts et des attentes', 256, { size: 17, weight: 500, fill: C.ink, lh: 1.3 });
    fit(pr.t, 1140, 'texte muda carte 2');

    S.chute = G.blogChute('La surproduction fabrique les sept autres gaspillages.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;

    // La machine produit : la pile grossit
    pop(S.src, t, 1.8, 150, 300);
    S.pile.forEach((p, k) => {
      let y = p.y, x = p.x, o = o0;
      if (live) {
        const q = prog(t, PILE_T(k), 0.3);
        x = 182 + (p.x - 182) * easeOut(q);
        y = p.y - 30 * Math.sin(Math.PI * q);
        o = q > 0 ? 1 : 0;
      }
      p.g.setAttribute('transform', `translate(${x} ${y})`);
      p.g.setAttribute('opacity', o);
    });
    const producing = live && t >= PILE_T(0) - 0.3 && t < PILE_T(5) + 0.3;
    S.gauge.setAttribute('fill', producing ? C.yellow : C.green);

    // Conséquences, puis gaspillages allumés
    CHIPS.forEach((c, i) => {
      const l1 = S.links1[i];
      l1.draw(live ? easeInOut(prog(t, CHIP_T(i), 0.4)) : 1);
      l1.g.setAttribute('opacity', o0);
      pop(S.chips[i], t, CHIP_T(i) + 0.3, CHIP.x + CHIP.w / 2, c.cy);
      S.links2[i].forEach((a, j) => {
        a.draw(live ? easeInOut(prog(t, BADGE_T(i) + 0.08 * j, 0.4)) : 1);
        a.g.setAttribute('opacity', o0);
      });
      c.to.forEach((k, j) => {
        const b = S.badges[k];
        const tOn = BADGE_T(i) + 0.08 * j + 0.4;
        b.on.setAttribute('opacity', live ? clamp(prog(t, tOn, 0.2)) : o0);
        b.off.setAttribute('opacity', live ? 1 : o0);
        if (live && t >= tOn && t < tOn + 0.7) pulse(b.on, t, tOn, b.cx, BY(k), 0.1, 0.4);
        else if (live && t >= ALL_T && t < ALL_T + 0.8) pulse(b.on, t, ALL_T + 0.05 * k, b.cx, BY(k), 0.08, 0.4);
        else if (live && (k === 2 || k === 5) && t >= MUDA2_T + 0.3) pulse(b.on, t, MUDA2_T + 0.3, b.cx, BY(k), 0.12, 0.45);
        else b.on.setAttribute('transform', '');
      });
    });

    // Carte 2 : les jours arrivent, les pics dépassent la capacité
    pop(S.mura, t, 8.7, 250, 660);
    S.bars.forEach((b, k) => {
      let s = 1, o = o0;
      if (live) { const q = prog(t, BAR_T(k), 0.3); s = Math.max(0.001, easeOut(q)); o = q > 0 ? 1 : 0; }
      b.g.setAttribute('transform', s === 1 ? '' : `translate(0 ${CH.base}) scale(1 ${s}) translate(0 ${-CH.base})`);
      b.g.setAttribute('opacity', o);
    });
    rise(S.cap, t, 8.9, 0.3);
    S.arrowA.draw(live ? easeInOut(prog(t, MURI_T - 0.5, 0.4)) : 1);
    S.arrowA.g.setAttribute('opacity', o0);
    pop(S.muri, t, MURI_T, 690, 650);
    const over = !live || t >= MURI_T + 0.3;
    const fq = live ? easeOut(prog(t, MURI_T + 0.3, 0.5)) : 1;
    const fh = 20 + 56 * fq;
    S.muriFill.setAttribute('y', 668 - fh);
    S.muriFill.setAttribute('height', fh);
    S.muriFill.setAttribute('fill', fh > 48 ? C.red : C.lightBlue);
    S.muriGauge.setAttribute('fill', over ? C.red : C.green);
    S.muriLight.setAttribute('fill', over ? C.red : C.green);
    S.arrowB.draw(live ? easeInOut(prog(t, MUDA2_T - 0.5, 0.4)) : 1);
    S.arrowB.g.setAttribute('opacity', o0);
    pop(S.muda2, t, MUDA2_T, 1000, 640);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
