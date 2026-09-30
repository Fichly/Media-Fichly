// Blog · Kanban de production · section « Exemple de dimensionnement, pas à pas »
// Mécanique : le calcul N = D × T × (1 + marge) / Q rendu visible. Pendant que la carte fait le tour (4 h),
// la ligne consomme 60 pièces par heure : les bacs se remplissent de ce qu'il faut avoir d'avance (240 pièces, 2 bacs),
// la marge de 20 % ajoute 48 pièces (2,4 bacs), et comme une demi-carte n'existe pas, on arrondit à 3 bacs, 3 cartes.
// Puis le stock maximal (360 pièces) et la couverture (6 h, plus longue que le délai de 4 h).
// Chiffres de l'article. Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const AX = { x0: 96, px: 92, y: 266 };           // 0 → 6 h
  const HX = h => AX.x0 + AX.px * h;
  const BACS = [115, 295, 475].map(x => ({ x, y: 384, w: 150, h: 176 }));
  const INNER = 168;                               // hauteur utile d'un bac (120 pièces)
  const T = { run0: 2.6, run1: 6.6, f1: 6.8, marge: 7.2, f2: 8.1, f3: 8.8, round: 9.6, cards: 10.0, f4: 10.5, stock: 11.2, couv: 11.8, chute: 12.6 };
  const PALE = '#f3e3a6';

  const S = {};

  function kanban(parent, k = 1) {
    const g = el('g', {}, parent);
    const i = el('g', { transform: `scale(${k})` }, g);
    el('rect', { x: -11, y: -14, width: 22, height: 28, rx: 4, fill: C.white, stroke: C.tGreen, 'stroke-width': 2.5 }, i);
    el('rect', { x: -11, y: -14, width: 22, height: 8, rx: 3, fill: C.tGreen }, i);
    el('line', { x1: -6, y1: 1, x2: 6, y2: 1, stroke: C.tGreen, 'stroke-width': 2, 'stroke-linecap': 'round' }, i);
    el('line', { x1: -6, y1: 7, x2: 3, y2: 7, stroke: C.tGreen, 'stroke-width': 2, 'stroke-linecap': 'round' }, i);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Combien', 'de cartes ?');
    G.blogChapeau('Exemple de l’article : 60 pièces par heure, délai de 4 h, marge de 20 %, bacs de 120.');
    const defs = G.svg.querySelector('defs') || el('defs');
    const pat = el('pattern', { id: 'marge', width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { width: 10, height: 10, fill: C.yellow }, pat);
    el('rect', { width: 4, height: 10, fill: C.white, opacity: 0.6 }, pat);

    // ----- Carte gauche : les bacs se remplissent pendant le délai -----
    G.card(40, 176, 660, 584);
    text(G.svg, 64, 210, 'Ce que la ligne consomme pendant que la carte fait le tour', { size: 19, weight: 700, fill: C.ink });
    el('line', { x1: HX(0), y1: AX.y, x2: HX(6), y2: AX.y, stroke: C.line, 'stroke-width': 3 });
    for (let h = 0; h <= 6; h++) {
      el('line', { x1: HX(h), y1: AX.y - 6, x2: HX(h), y2: AX.y + 6, stroke: C.ink, 'stroke-width': 2, opacity: 0.5 });
      text(G.svg, HX(h), AX.y + 26, `${h}${NB}h`, { size: 16, weight: 600, fill: C.ink, anchor: 'middle' });
    }
    // Délai de boucle (trace de la carte) et couverture
    S.trail = el('rect', { x: HX(0), y: AX.y - 22, height: 12, rx: 6, fill: C.blue });
    S.trailLab = text(G.svg, HX(4) + 10, AX.y - 11, 'délai de boucle : 4 h', { size: 16, weight: 700, fill: C.blue });
    S.card = kanban(G.svg, 1);
    S.couv = el('g');
    el('rect', { x: HX(0), y: AX.y + 38, width: HX(6) - HX(0), height: 12, rx: 6, fill: C.green }, S.couv);
    text(S.couv, HX(6), AX.y + 72, 'couverture : 6 h', { size: 16, weight: 700, fill: C.tGreen, anchor: 'end' });

    // Bacs
    S.bacs = BACS.map((b, i) => {
      el('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 10, fill: C.white, stroke: C.blue, 'stroke-width': 3 });
      const full = el('rect', { x: b.x + 4, width: b.w - 8, rx: 6, fill: C.yellow });
      const marge = el('rect', { x: b.x + 4, width: b.w - 8, rx: 6, fill: 'url(#marge)' });
      const pale = el('rect', { x: b.x + 4, width: b.w - 8, rx: 6, fill: PALE, stroke: C.yellow, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
      const n = text(G.svg, b.x + b.w / 2, b.y + b.h / 2 + 12, '', { size: 32, weight: 800, fill: C.ink, anchor: 'middle' });
      text(G.svg, b.x + b.w / 2, b.y + b.h + 28, `bac ${i + 1}`, { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
      const card = kanban(G.svg, 1.4);
      card.setAttribute('transform', `translate(${b.x + 22} ${b.y + 4})`);
      return { ...b, full, marge, pale, n, card };
    });
    S.margeLab = el('g');
    G.pill(S.margeLab, BACS[2].x + BACS[2].w / 2, BACS[2].y - 22, 'marge : 48', { size: 16, h: 28, pad: 10, bg: C.yellow, fg: C.ink, anchor: 'middle' });
    // Accolade sous les bacs
    S.brace = el('path', { fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    S.braceLab = text(G.svg, 370, 664, '', { size: 19, weight: 700, fill: C.blue, anchor: 'middle' });
    S.half = el('g');
    G.para(S.half, 370, 706, 'Une demi-carte n’existe pas : on arrondit à l’entier supérieur.', 580, { size: 17, weight: 600, fill: C.ink, anchor: 'middle', lh: 1.3 });
    // Pièces consommées à chaque heure
    S.chips = [1, 2, 3, 4].map(h => {
      const g = el('g');
      G.pill(g, 0, 0, '+60', { size: 16, h: 26, pad: 9, bg: C.pYellow, fg: C.tYellow, anchor: 'middle' });
      return { g, h };
    });

    // ----- Carte droite : le calcul -----
    G.card(716, 176, 444, 584);
    text(G.svg, 740, 214, 'Le calcul', { size: 22, weight: 700, fill: C.ink });
    fit(text(G.svg, 740, 248, 'N = D × T × (1 + marge) / Q', { size: 20, weight: 700, fill: C.blue }), 1140, 'formule');
    const line = (y, lab, val, opt = {}) => {
      const g = el('g');
      text(g, 740, y, lab, { size: 17, weight: 500, fill: C.ink });
      fit(text(g, 740, y + 32, val, { size: opt.size || 25, weight: 800, fill: opt.fill || C.ink }), 1140, lab);
      return g;
    };
    S.f = [
      line(298, 'Consommation pendant le délai', `60 × 4 = 240 pièces`),
      line(366, 'Plus la marge de 20 %', `240 × 1,2 = 288 pièces`),
      line(434, 'En bacs de 120 pièces', `288 ÷ 120 = 2,4`),
      line(502, 'Arrondi à l’entier supérieur', `3 cartes`, { size: 32, fill: C.tGreen }),
    ];
    S.div = el('line', { x1: 740, y1: 572, x2: 1136, y2: 572, stroke: C.line, 'stroke-width': 3 });
    S.stock = line(604, 'Stock maximal de la boucle', `3 × 120 = 360 pièces`, { fill: C.blue });
    S.couvF = line(672, 'Couverture', `360 ÷ 60 = 6 h`, { fill: C.tGreen });

    S.chute = G.blogChute('Un dimensionnement sans la couverture est incomplet.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    // La carte fait le tour : 0 → 4 h
    const h = live ? 4 * prog(t, T.run0, T.run1 - T.run0) : 4;
    S.trail.setAttribute('width', Math.max(0.001, HX(h) - HX(0)));
    S.trail.setAttribute('opacity', live ? (t >= T.run0 ? 1 : 0) : o);
    S.trailLab.setAttribute('opacity', live ? clamp(prog(t, T.run1, 0.3)) : o);
    S.card.setAttribute('transform', `translate(${HX(h)} ${AX.y - 17})`);
    S.card.setAttribute('opacity', live ? window01(t, T.run0 - 0.2, T.run1 + 0.3, 0.2) : 0);
    pop(S.couv, t, T.couv, HX(3), AX.y + 50);

    // Remplissage : 240 pièces pendant le délai, puis la marge, puis l'arrondi
    const pieces = 60 * h;
    const marge = live ? 48 * easeInOut(prog(t, T.marge, 0.8)) : 48;
    const rnd = live ? easeInOut(prog(t, T.round, 0.6)) : 1;
    S.bacs.forEach((b, i) => {
      const base = i < 2 ? clamp((pieces - 120 * i) / 120) : 0;
      const mg = i === 2 ? marge / 120 : 0;
      const pl = i === 2 ? (1 - 0.4) * rnd : 0;
      const set = (r, from, lv) => { const hh = INNER * lv; r.setAttribute('y', b.y + b.h - 4 - INNER * from - hh); r.setAttribute('height', Math.max(0.001, hh)); r.setAttribute('opacity', lv > 0 ? o : 0); };
      set(b.full, 0, base);
      set(b.marge, 0, mg);
      set(b.pale, mg, pl);
      let n = i < 2 ? Math.round(120 * base) : Math.round(marge);
      if (i === 2 && rnd > 0) n = Math.round(48 + 72 * rnd);
      b.n.textContent = n > 0 ? String(n) : '';
      b.n.setAttribute('opacity', o);
      pop(b.card, t, T.cards + 0.15 * i, b.x + 22, b.y + 4);
      b.card.setAttribute('transform', (b.card.getAttribute('transform') || '') + ` translate(${b.x + 22} ${b.y + 4})`);
    });
    S.margeLab.setAttribute('opacity', live ? window01(t, T.marge + 0.3, T.round - 0.1, 0.2) : 0);

    // Accolade : 2,4 bacs puis 3 bacs
    const b0 = BACS[0].x, bw = BACS[2].x + BACS[2].w * (live && rnd < 1 ? 0.4 + 0.6 * rnd : 1);
    const by = 616;
    S.brace.setAttribute('d', `M ${b0} ${by - 8} L ${b0} ${by} L ${bw} ${by} L ${bw} ${by - 8} M ${(b0 + bw) / 2} ${by} L ${(b0 + bw) / 2} ${by + 8}`);
    const bo = live ? clamp(prog(t, T.f3 - 0.3, 0.3)) : o;
    S.brace.setAttribute('opacity', bo);
    S.braceLab.textContent = live && t < T.round ? `288 pièces = 2,4 bacs` : `3 bacs, 3 cartes, 360 pièces au plus`;
    S.braceLab.setAttribute('x', (b0 + bw) / 2);
    S.braceLab.setAttribute('opacity', bo);
    rise(S.half, t, T.round, 0.4, 8);

    // Pièces consommées heure par heure
    S.chips.forEach(c => {
      const tc = T.run0 + (T.run1 - T.run0) * c.h / 4;
      const q = live ? prog(t, tc - 0.15, 0.6) : 1;
      const bi = c.h <= 2 ? 0 : 1;
      const x0 = HX(c.h), x1 = BACS[bi].x + BACS[bi].w / 2;
      const x = x0 + (x1 - x0) * easeInOut(q), y = AX.y + 22 + (BACS[bi].y + 30 - AX.y - 22) * easeInOut(q);
      c.g.setAttribute('transform', `translate(${x} ${y})`);
      c.g.setAttribute('opacity', live && q > 0 && q < 1 ? Math.min(1, q * 5, (1 - q) * 4) : 0);
    });

    // Calcul
    [T.f1, T.f2, T.f3, T.f4].forEach((tf, i) => rise(S.f[i], t, tf, 0.4, 10));
    S.div.setAttribute('opacity', live ? clamp(prog(t, T.stock - 0.2, 0.3)) : o);
    rise(S.stock, t, T.stock, 0.4, 10);
    rise(S.couvF, t, T.couv, 0.4, 10);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
