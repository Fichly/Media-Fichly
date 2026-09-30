// Blog · 5 pourquoi · section « Deux exemples de 5 pourquoi : l'un aboutit, l'autre s'arrête »
// Mécanique : un tronc commun (niveaux 1 et 2 identiques), puis la bifurcation au 3e niveau sur un seul mot :
// « L'opérateur » (un qui) à gauche, « Le contrôle » (un quoi) à droite. La chaîne de gauche s'arrête,
// les niveaux 4 et 5 restent en pointillés (non creusés) ; celle de droite descend jusqu'au mécanisme.
// Les deux conclusions arrivent côte à côte. Rendu déterministe, boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const BOX_H = 56;
  const ROW = { r1: 246, r2: 328, r3: 418, r4: 500, r5: 582, concl: 664 };
  const TRUNK = { x: 300, w: 600 };
  const LEFT = { x: 70, w: 500 }, RIGHT = { x: 630, w: 500 };
  const cxOf = c => c.x + c.w / 2;

  // Texte sur plusieurs lignes avec des mots colorés : segs = [[texte, couleur?], …]
  function rich(parent, x, y, segs, maxW, { size = 18, weight = 500, lh = 1.25, fill = C.ink } = {}) {
    // Poids 500 ou 700 seulement (polices préchargées : la mesure est juste)
    const words = [];
    segs.forEach(([s, f, wt]) => s.split(' ').forEach(w => { if (w) words.push({ w, f: f || fill, wt: wt || weight }); }));
    const probe = text(parent, 0, -999, '', { size, weight });
    const lines = [];
    let cur = [];
    for (const wd of words) {
      probe.textContent = [...cur, wd].map(o => o.w).join(' ');
      if (probe.getComputedTextLength() > maxW && cur.length) { lines.push(cur); cur = [wd]; } else cur.push(wd);
    }
    if (cur.length) lines.push(cur);
    probe.remove();
    const g = el('g', {}, parent);
    lines.forEach((ln, i) => {
      const t = text(g, x, y + i * size * lh, '', { size, weight, fill });
      let run = null;
      ln.forEach((o, j) => {
        const s = (j ? ' ' : '') + o.w;
        if (run && run.f === o.f && run.wt === o.wt) run.node.textContent += s;
        else { const ts = el('tspan', { fill: o.f, 'font-weight': o.wt }, t); ts.textContent = s; run = { f: o.f, wt: o.wt, node: ts }; }
      });
      fit(t, x + maxW + 2, `ligne ${ln.map(o => o.w).join(' ').slice(0, 24)}`);
    });
    return { g, n: lines.length };
  }

  // Une réponse de la chaîne : pastille du niveau + texte (1 ou 2 lignes)
  function box(col, y, n, segs, { fill = C.white, stroke = C.line, badge = C.blue } = {}) {
    const g = el('g');
    el('rect', { x: col.x, y, width: col.w, height: BOX_H, rx: 14, fill, stroke, 'stroke-width': 2 }, g);
    el('circle', { cx: col.x + 28, cy: y + BOX_H / 2, r: 16, fill: badge }, g);
    text(g, col.x + 28, y + BOX_H / 2 + 6, String(n), { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
    const r = rich(g, col.x + 54, 0, segs, col.w - 70);
    r.g.setAttribute('transform', `translate(0 ${r.n === 1 ? y + BOX_H / 2 + 6.5 : y + BOX_H / 2 - 5})`);
    return { g, cx: cxOf(col), cy: y + BOX_H / 2 };
  }
  // Flèche verticale « pourquoi ? » entre deux réponses
  function why(x, y1, y2, label = true) {
    const g = el('g');
    const a = G.arrow(g, `M ${x} ${y1} L ${x} ${y2}`, { width: 3, head: 8 });
    const l = label ? text(g, x + 12, (y1 + y2) / 2 + 6, 'pourquoi ?', { size: 16, weight: 600, fill: C.blue }) : null;
    return { g, a, l };
  }
  function showArrow(w, t, t0, d = 0.3) {
    if (t < FADE_END) {
      w.a.draw(1);
      w.g.setAttribute('opacity', fading(t) ? fadeOut(t) : 1);
      if (w.l) w.l.setAttribute('opacity', 1);
      return;
    }
    const q = prog(t, t0, d);
    w.a.draw(q);
    w.g.setAttribute('opacity', q > 0 ? 1 : 0);
    if (w.l) w.l.setAttribute('opacity', clamp(q * 2));
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Même défaut,', 'deux analyses.');
    G.blogChapeau('Les deux chaînes sont identiques jusqu’au 2e niveau. Elles divergent sur un seul mot.');
    G.card(40, 176, 1120, 584);

    // Le problème
    S.pb = el('g');
    const pp = G.pill(S.pb, 600, 204, 'Un défaut qui revient sur un même équipement', { size: 19, h: 36, bg: C.pRed, fg: C.tRed, icon: 'cross', anchor: 'middle' });
    S.pbW = pp.w;

    // Tronc commun
    S.w0 = why(600, 224, ROW.r1 - 4);
    S.b1 = box(TRUNK, ROW.r1, 1, [['Le réglage était hors tolérance.']]);
    S.w1 = why(600, ROW.r1 + BOX_H + 3, ROW.r2 - 4);
    S.b2 = box(TRUNK, ROW.r2, 2, [['Le contrôle de début de série n’a pas été fait.']]);

    // Accolade « identiques »
    S.same = el('g');
    el('path', { d: `M 918 ${ROW.r1 + 6} Q 930 ${ROW.r1 + 6} 930 ${ROW.r1 + 20} L 930 ${ROW.r2 + BOX_H - 20} Q 930 ${ROW.r2 + BOX_H - 6} 918 ${ROW.r2 + BOX_H - 6}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.same);
    G.pill(S.same, 946, (ROW.r1 + ROW.r2 + BOX_H) / 2, 'identiques', { size: 18, h: 32, pad: 14 });

    // Bifurcation
    const y0 = ROW.r2 + BOX_H + 3, y1 = ROW.r3 - 4;
    S.split = [cxOf(LEFT), cxOf(RIGHT)].map(x => {
      const g = el('g');
      const a = G.arrow(g, `M 600 ${y0} C 600 ${y0 + 20} ${x} ${y1 - 22} ${x} ${y1}`, { width: 3, head: 8 });
      return { g, a, l: null };
    });
    S.qui = el('g');
    G.pill(S.qui, 214, 402, 'un qui', { size: 18, h: 32, pad: 14, bg: C.red, fg: C.white, anchor: 'middle' });
    S.quoi = el('g');
    G.pill(S.quoi, 986, 402, 'un quoi', { size: 18, h: 32, pad: 14, bg: C.green, fg: C.white, anchor: 'middle' });

    // Branche qui s'arrête
    S.l3 = box(LEFT, ROW.r3, 3, [['L’opérateur', C.tRed, 700], ['ne l’a pas fait.']]);
    S.stop = el('g');
    const sx = cxOf(LEFT);
    el('line', { x1: sx, y1: ROW.r3 + BOX_H + 3, x2: sx, y2: ROW.r4 - 6, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, S.stop);
    el('line', { x1: sx - 16, y1: ROW.r4 - 6, x2: sx + 16, y2: ROW.r4 - 6, stroke: C.red, 'stroke-width': 5, 'stroke-linecap': 'round' }, S.stop);
    const sp = G.pill(S.stop, sx + 30, ROW.r4 - 13, 'Arrêt', { size: 18, h: 32, pad: 14, bg: C.pRed, fg: C.tRed, icon: 'cross' });
    S.ghosts = el('g');
    [ROW.r4 + 12, ROW.r5].forEach((y, i) => {
      el('rect', { x: LEFT.x, y, width: LEFT.w, height: BOX_H - (i ? 0 : 12), rx: 14, fill: 'none', stroke: C.tRed, 'stroke-opacity': 0.45, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, S.ghosts);
    });
    text(S.ghosts, sx, ROW.r4 + 12 + 28 + 6, 'niveau 4 : pas creusé', { size: 17, weight: 600, fill: C.tRed, anchor: 'middle' }).setAttribute('opacity', 0.8);
    text(S.ghosts, sx, ROW.r5 + 34, 'niveau 5 : pas creusé', { size: 17, weight: 600, fill: C.tRed, anchor: 'middle' }).setAttribute('opacity', 0.8);

    // Branche qui continue
    S.r3 = box(RIGHT, ROW.r3, 3, [['Le contrôle', C.tGreen, 700], ['ne figure pas dans le mode opératoire.']]);
    S.w34 = why(cxOf(RIGHT), ROW.r3 + BOX_H + 3, ROW.r4 - 4);
    S.r4 = box(RIGHT, ROW.r4, 4, [['Le mode opératoire n’a pas été revu au changement de gamme.']]);
    S.w45 = why(cxOf(RIGHT), ROW.r4 + BOX_H + 3, ROW.r5 - 4);
    S.r5 = box(RIGHT, ROW.r5, 5, [['Aucune revue de mode opératoire n’est déclenchée par un changement de gamme.']]);

    // Conclusions
    const concl = (col, bg, fg, icon, str) => {
      const g = el('g');
      el('rect', { x: col.x, y: ROW.concl, width: col.w, height: 80, rx: 16, fill: bg }, g);
      (icon === 'check' ? G.check : G.cross)(g, col.x + 30, ROW.concl + 40, 16);
      text(g, col.x + 58, ROW.concl + 26, 'Conclusion', { size: 16, weight: 700, fill: fg });
      rich(g, col.x + 58, ROW.concl + 50, [[str, fg]], col.w - 74, { size: 18, weight: 700, lh: 1.2 });
      return g;
    };
    S.w5c = why(cxOf(RIGHT), ROW.r5 + BOX_H + 3, ROW.concl - 4, false);
    S.cL = concl(LEFT, C.pRed, C.tRed, 'cross', 'Rappeler l’opérateur à ses obligations.');
    S.cR = concl(RIGHT, C.pGreen, C.tGreen, 'check', 'Déclencher une revue de mode opératoire à chaque changement de gamme.');

    S.chute = G.blogChute('Un qui à la place d’un quoi : à partir de ce mot, tout est joué.', { y: 808 });

    // Espaces insécables avant la ponctuation haute
    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  function draw(t) {
    pop(S.pb, t, 1.8, 600, 204);
    showArrow(S.w0, t, 2.1);
    pop(S.b1.g, t, 2.4, S.b1.cx, S.b1.cy);
    showArrow(S.w1, t, 2.8);
    pop(S.b2.g, t, 3.1, S.b2.cx, S.b2.cy);
    pop(S.same, t, 3.5, 960, (ROW.r1 + ROW.r2 + BOX_H) / 2);

    // Bifurcation, puis le mot qui change tout
    S.split.forEach((s, i) => showArrow(s, t, 4.0 + 0.1 * i, 0.4));
    pop(S.l3.g, t, 4.5, S.l3.cx, S.l3.cy);
    pop(S.r3.g, t, 4.7, S.r3.cx, S.r3.cy);
    pop(S.qui, t, 5.1, 214, 402);
    pop(S.quoi, t, 5.3, 986, 402);
    if (t >= 5.6 && t < 6.4) { pulse(S.qui, t, 5.6, 214, 402, 0.12, 0.45); pulse(S.quoi, t, 5.75, 986, 402, 0.12, 0.45); }

    // À gauche : arrêt, les niveaux 4 et 5 restent vides
    pop(S.stop, t, 6.1, cxOf(LEFT), ROW.r4 - 10);
    const go = fading(t) ? fadeOut(t) : t < FADE_END ? 1 : clamp(prog(t, 6.5, 0.5));
    S.ghosts.setAttribute('opacity', go);

    // À droite : on continue jusqu'au mécanisme
    showArrow(S.w34, t, 6.7);
    pop(S.r4.g, t, 7.0, S.r4.cx, S.r4.cy);
    showArrow(S.w45, t, 7.5);
    pop(S.r5.g, t, 7.8, S.r5.cx, S.r5.cy);

    // Conclusions
    pop(S.cL, t, 8.7, cxOf(LEFT), ROW.concl + 40);
    showArrow(S.w5c, t, 8.6, 0.25);
    pop(S.cR, t, 9.0, cxOf(RIGHT), ROW.concl + 40);

    rise(S.chute, t, 10.0, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
