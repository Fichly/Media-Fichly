// Blog · Lean Manufacturing · section « Les 5 principes du Lean Manufacturing »
// Mécanique : les principes s'allument dans l'ordre, chacun avec la question qui permet de le vérifier ;
// une flèche relie chaque principe au suivant, puis le cinquième relance le premier (la boucle).
// Socle : le respect des personnes, condition des cinq.
// Rendu déterministe : window.FICHE.draw(t), boucle de 13 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, slide, pulse } = G;

  const COL = { x0: 60, w: 216, top: 180, bottom: 632 };
  const cxOf = i => COL.x0 + COL.w * (i + 0.5);
  const ICON_Y = 290;
  const P = [
    { name: ['Identifier', 'la valeur'], q: 'Si le client voyait cette opération, accepterait-il de la payer ?' },
    { name: ['Cartographier la', 'chaîne de valeur'], q: 'Sur le temps passé dans l’usine, combien de minutes le produit est-il transformé ?' },
    { name: ['Créer', 'le flux'], q: 'Où le produit s’arrête-t-il, et pourquoi ?' },
    { name: ['Tirer', 'le flux'], q: 'Qu’est-ce qui déclenche la production : une commande réelle ou une prévision ?' },
    { name: ['Viser la', 'perfection'], q: 'Quand avons-nous amélioré ce poste pour la dernière fois, et qui l’a fait ?' },
  ];
  const ON = i => 1.8 + 0.95 * i;      // allumage de chaque principe
  const LOOP_T = 6.75, BAND_T = 8.2, CHUTE_T = 8.8;

  const S = { cols: [] };

  // ---------- Pictos (centrés sur cx, ICON_Y), chacun avec son animation ----------
  function iconValue(g, cx) {
    const cy = ICON_Y;
    el('circle', { cx: cx - 22, cy: cy - 20, r: 14, fill: C.blue }, g);
    el('path', { d: `M ${cx - 48} ${cy + 34} L ${cx - 48} ${cy + 16} Q ${cx - 48} ${cy - 2} ${cx - 22} ${cy - 2} Q ${cx + 4} ${cy - 2} ${cx + 4} ${cy + 16} L ${cx + 4} ${cy + 34} Z`, fill: C.blue }, g);
    const coin = el('g', {}, g);
    el('circle', { cx: cx + 30, cy: cy - 6, r: 22, fill: C.yellow }, coin);
    el('circle', { cx: cx + 30, cy: cy - 6, r: 16, fill: 'none', stroke: C.white, 'stroke-width': 2.5, 'stroke-opacity': 0.7 }, coin);
    text(coin, cx + 30, cy + 2, '€', { size: 22, weight: 800, fill: C.white, anchor: 'middle' });
    return t => pulse(coin, t, 0, cx + 30, cy - 6, 0.18, 0.5);
  }
  function iconMap(g, cx) {
    const cy = ICON_Y;
    const boxes = [-44, 0, 44].map((dx, i) => {
      const b = el('g', {}, g);
      el('rect', { x: cx + dx - 15, y: cy - 30, width: 30, height: 24, rx: 5, fill: C.blue }, b);
      return b;
    });
    const tris = [-22, 22].map(dx => {
      const tr = el('path', { d: `M ${cx + dx} ${cy - 30} L ${cx + dx + 9} ${cy - 14} L ${cx + dx - 9} ${cy - 14} Z`, fill: C.yellow }, g);
      return tr;
    });
    // Ligne de temps (VSM) : plateaux hauts = attente, creux = transformation
    const d = `M ${cx - 62} ${cy + 18} L ${cx - 30} ${cy + 18} L ${cx - 30} ${cy + 34} L ${cx - 14} ${cy + 34} L ${cx - 14} ${cy + 18} L ${cx + 14} ${cy + 18} L ${cx + 14} ${cy + 34} L ${cx + 30} ${cy + 34} L ${cx + 30} ${cy + 18} L ${cx + 62} ${cy + 18}`;
    const line = el('path', { d, fill: 'none', stroke: C.red, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const len = line.getTotalLength();
    line.setAttribute('stroke-dasharray', len);
    return t => {
      boxes.forEach((b, i) => b.setAttribute('opacity', t < 0 ? 1 : clamp(prog(t, 0.08 * i, 0.2))));
      tris.forEach((tr, i) => tr.setAttribute('opacity', t < 0 ? 1 : clamp(prog(t, 0.12 + 0.08 * i, 0.2))));
      line.setAttribute('stroke-dashoffset', t < 0 ? 0 : len * (1 - easeOut(prog(t, 0.2, 0.55))));
    };
  }
  function iconFlow(g, cx) {
    const cy = ICON_Y;
    el('line', { x1: cx - 62, y1: cy + 14, x2: cx + 52, y2: cy + 14, stroke: C.line, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    el('path', { d: `M ${cx + 50} ${cy + 4} L ${cx + 62} ${cy + 14} L ${cx + 50} ${cy + 24}`, fill: 'none', stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const pieces = [0, 1, 2].map(() => {
      const p = el('g', {}, g);
      el('rect', { x: -11, y: -11, width: 22, height: 22, rx: 6, fill: C.blue }, p);
      el('circle', { cx: 0, cy: 0, r: 4, fill: C.white }, p);
      return p;
    });
    return t => {
      // Deux passages (1,33 s), puis les pièces reviennent exactement à leur place de repos
      const off = t < 0 || t >= 4 / 3 ? 0 : (t * 60) % 40;
      pieces.forEach((p, i) => {
        const x = cx - 44 + i * 40 + off;
        p.setAttribute('transform', `translate(${x} ${cy - 6})`);
        p.setAttribute('opacity', clamp((cx + 56 - x) / 16) * clamp((x - cx + 60) / 16));
      });
    };
  }
  function iconPull(g, cx) {
    const cy = ICON_Y;
    el('rect', { x: cx - 64, y: cy + 2, width: 38, height: 30, rx: 6, fill: C.blue }, g);
    el('rect', { x: cx + 26, y: cy + 2, width: 38, height: 30, rx: 6, fill: C.blue }, g);
    const path = el('path', { d: `M ${cx + 45} ${cy - 4} Q ${cx + 45} ${cy - 40} ${cx} ${cy - 40} Q ${cx - 45} ${cy - 40} ${cx - 45} ${cy - 6}`, fill: 'none', stroke: C.tGreen, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, g);
    el('path', { d: `M ${cx - 53} ${cy - 16} L ${cx - 45} ${cy - 6} L ${cx - 37} ${cy - 16}`, fill: 'none', stroke: C.tGreen, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const card = el('g', {}, g);
    el('rect', { x: -9, y: -11, width: 18, height: 22, rx: 3, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, card);
    el('rect', { x: -9, y: -11, width: 18, height: 6, rx: 2, fill: C.blue }, card);
    const len = path.getTotalLength();
    return t => {
      const p = t < 0 ? 1 : easeInOut(prog(t, 0.1, 0.7));
      const pt = path.getPointAtLength(len * p);
      card.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    };
  }
  function iconPdca(g, cx) {
    const cy = ICON_Y - 2, r = 40;
    const wheel = el('g', {}, g);
    const cols = [C.blue, C.teal, C.green, C.yellow];
    const labels = ['P', 'D', 'C', 'A'];
    for (let q = 0; q < 4; q++) {
      const a0 = -Math.PI / 2 + q * Math.PI / 2, a1 = a0 + Math.PI / 2;
      el('path', { d: `M ${cx} ${cy} L ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`, fill: cols[q], stroke: C.card, 'stroke-width': 3 }, wheel);
      const am = (a0 + a1) / 2;
      text(wheel, cx + 23 * Math.cos(am), cy + 23 * Math.sin(am) + 7, labels[q], { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
    }
    // Cale : la roue ne redescend pas
    el('path', { d: `M ${cx - 30} ${cy + 46} L ${cx + 30} ${cy + 46}`, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    return t => {
      const a = t < 0 ? 0 : 360 * easeInOut(prog(t, 0.05, 1.1));
      wheel.setAttribute('transform', a === 0 || a === 360 ? '' : `rotate(${a} ${cx} ${cy})`);
    };
  }
  const ICONS = [iconValue, iconMap, iconFlow, iconPull, iconPdca];

  function build() {
    G.templateBlog();
    G.blogTitle('Les 5 principes,', 'dans l’ordre.');
    G.blogChapeau('Ils se lisent dans l’ordre : chacun prépare le suivant, le dernier relance le premier.');

    P.forEach((p, i) => {
      const x = COL.x0 + COL.w * i + 6, w = COL.w - 12, cx = cxOf(i);
      const frame = el('rect', { x, y: COL.top, width: w, height: COL.bottom - COL.top, rx: 22, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      const glow = el('rect', { x: x - 1, y: COL.top - 1, width: w + 2, height: COL.bottom - COL.top + 2, rx: 23, fill: 'none', stroke: C.blue, 'stroke-width': 4, opacity: 0 });
      const head = el('g');
      G.badgeNum(head, cx, 216, i + 1, 19);
      const icon = el('g');
      const anim = ICONS[i](icon, cx);
      const name = el('g');
      p.name.forEach((l, k) => fit(text(name, cx, 372 + 27 * k, l, { size: 22, weight: 700, fill: C.ink, anchor: 'middle' }), x + w - 6, `nom ${i + 1}`, x + 6));
      const qg = el('g');
      el('line', { x1: cx - 30, y1: 424, x2: cx + 30, y2: 424, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, qg);
      text(qg, cx, 456, 'La question', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
      // Espace insécable : la ponctuation haute reste collée au mot
      const qs = p.q.replace(/ ([?:])/g, '\u00a0$1');
      const q = G.para(qg, cx, 486, qs, w - 22, { size: 18, weight: 500, fill: C.ink, anchor: 'middle', lh: 1.32 });
      if (486 + 18 * 1.32 * (q.n - 1) > COL.bottom - 14) console.error(`Débordement : question ${i + 1} (${q.n} lignes)`);
      S.cols.push({ frame, glow, head, icon, anim, name, qg, cx });
    });

    // Flèches d'enchaînement entre deux principes
    S.links = [0, 1, 2, 3].map(i => {
      const x = COL.x0 + COL.w * (i + 1);
      const g = el('g');
      el('circle', { cx: x, cy: ICON_Y, r: 15, fill: C.blue }, g);
      el('path', { d: `M ${x - 4} ${ICON_Y - 7} L ${x + 3} ${ICON_Y} L ${x - 4} ${ICON_Y + 7}`, fill: 'none', stroke: C.white, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      return { g, x };
    });

    // La boucle : du 5e principe au 1er
    const y = 668, x5 = cxOf(4), x1 = cxOf(0);
    S.loop = G.arrow(G.svg, `M ${x5} ${COL.bottom + 4} L ${x5} ${y - 14} Q ${x5} ${y} ${x5 - 14} ${y} L ${x1 + 14} ${y} Q ${x1} ${y} ${x1} ${y - 14} L ${x1} ${COL.bottom + 8}`, { width: 4, head: 12 });
    S.loopTag = el('g');
    const lt = G.pill(S.loopTag, 600, y, 'chaque amélioration fait apparaître le problème suivant', { size: 18, h: 32, bg: C.blue, fg: C.white, anchor: 'middle' });
    S.loopDot = el('circle', { r: 8, fill: C.yellow, stroke: C.white, 'stroke-width': 2.5, opacity: 0 });

    // Socle : le respect des personnes
    S.band = el('g');
    el('rect', { x: 40, y: 700, width: 1120, height: 58, rx: 18, fill: C.pLav }, S.band);
    const bp = G.pill(S.band, 60, 729, 'La condition', { size: 18, h: 32, bg: C.blue, fg: C.white });
    const bt = text(S.band, 60 + bp.w + 14, 736, 'le respect des personnes : ', { size: 20, weight: 700, fill: C.ink });
    const bt2 = el('tspan', { 'font-weight': 500 }, bt);
    bt2.textContent = 'ceux qui tiennent le poste voient les gaspillages.';
    fit(bt, 1140, 'socle');

    S.chute = G.blogChute('Sans confiance, personne ne signale un gaspillage.', { y: 812 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    S.cols.forEach((c, i) => {
      const t0 = ON(i);
      const o = fading(t) ? fadeOut(t) : 1;
      // Contour bleu pendant que le principe est « actif »
      c.glow.setAttribute('opacity', live ? G.window01(t, t0 - 0.1, t0 + 0.95, 0.15) : 0);
      pop(c.head, t, t0, c.cx, 216);
      pop(c.icon, t, t0 + 0.05, c.cx, ICON_Y);
      c.anim(live ? t - t0 - 0.1 : -1);
      rise(c.name, t, t0 + 0.15, 0.35, 12);
      rise(c.qg, t, t0 + 0.3, 0.4, 12);
    });
    S.links.forEach((l, i) => pop(l.g, t, ON(i) + 0.75, l.x, ICON_Y, 0.3));

    // Boucle : le trait se dessine, un point la parcourt, le premier principe repart
    const lp = live ? easeInOut(prog(t, LOOP_T, 1.0)) : 1;
    S.loop.draw(lp);
    S.loop.g.setAttribute('opacity', fading(t) ? fadeOut(t) : live && t < LOOP_T ? 0 : 1);
    pop(S.loopTag, t, LOOP_T + 0.45, 600, 668, 0.35);
    const dotOn = live && t >= LOOP_T && t < LOOP_T + 1.05;
    S.loopDot.setAttribute('opacity', dotOn ? 1 : 0);
    if (dotOn) {
      const pt = S.loop.path.getPointAtLength(S.loop.len * lp);
      S.loopDot.setAttribute('cx', pt.x);
      S.loopDot.setAttribute('cy', pt.y);
    }
    if (live && t >= LOOP_T + 1.0 && t < LOOP_T + 1.8) {
      S.cols[0].glow.setAttribute('opacity', G.window01(t, LOOP_T + 1.0, LOOP_T + 1.8, 0.15));
      pulse(S.cols[0].head, t, LOOP_T + 1.0, S.cols[0].cx, 216, 0.25, 0.45);
    }

    slide(S.band, t, BAND_T, 0.45);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 13, build, draw });
})();
