// Blog · TRS, TRG, TRE · section « Le TRG : ce que l'organisation décide »
// Mécanique : la journée de référence (16 h d'ouverture). On ajoute 2 h de changements de série, arrêts planifiés :
// le temps requis fond de 14 h à 12 h, le TRS reste à 77 % (le temps est neutralisé), le TRG passe de 68 % à 58 %,
// et la ligne livre 557 pièces conformes au lieu de 650. Le problème n'est pas sur la ligne.
// Hypothèse : + 2 h de changements de série par jour, rendement de la ligne inchangé sur le temps requis.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const BX = 100, PXH = 1000 / 16, BY = 290, BH = 60;
  const TU0 = 650 / 60, TRS = TU0 / 14;
  // Parts du temps requis (proportions constantes) : subis, cadence, rebuts, utile
  const PARTS = [
    { h: 2, fill: C.red }, { h: 40 / 60, fill: C.yellow }, { h: 30 / 60, fill: C.violet }, { h: TU0, fill: C.green },
  ];
  const hm = h => { const m = Math.round(h * 60); return `${Math.floor(m / 60)}${NB}h${m % 60 ? NB + String(m % 60).padStart(2, '0') : ''}`; };

  function build() {
    G.templateBlog();
    G.blogTitle('Le TRS tient,', 'le TRG décroche.');
    G.blogChapeau('Même ligne, même rendement : on ajoute 2 h de changements de série par jour.');

    // ----- Carte 1 : la journée de 16 h -----
    G.card(40, 176, 1120, 296);
    const clip = G.clipRect(BX, BY, 1000, BH);
    S.reveal = clip.rect;
    S.bar = el('g', { 'clip-path': clip.url });
    S.maint = el('rect', { x: BX, y: BY, width: 2 * PXH, height: BH, fill: C.lightBlue }, S.bar);
    S.chg = el('rect', { x: BX + 2 * PXH, y: BY, width: 0, height: BH, fill: C.teal }, S.bar);
    S.parts = PARTS.map(p => el('rect', { x: 0, y: BY, width: 0, height: BH, fill: p.fill }, S.bar));
    S.frame = el('rect', { x: BX, y: BY, width: 1000, height: BH, rx: 10, fill: 'none', stroke: C.card, 'stroke-width': 6 });
    S.tMaint = text(G.svg, BX + PXH, BY + 38, `2${NB}h`, { size: 20, weight: 700, fill: C.white, anchor: 'middle' });
    S.tChg = text(G.svg, 0, BY + 38, `2${NB}h`, { size: 20, weight: 700, fill: C.white, anchor: 'middle' });
    S.tTu = text(G.svg, 0, BY + 38, '', { size: 20, weight: 700, fill: C.white, anchor: 'middle' });

    // Temps requis (au-dessus, se raccourcit) et temps d'ouverture (en dessous, fixe)
    S.req = el('g');
    S.reqPath = el('path', { fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.req);
    S.reqText = text(S.req, 0, 262, '', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    S.open = el('g');
    el('path', { d: `M ${BX} ${BY + BH + 6} L ${BX} ${BY + BH + 16} L ${BX + 1000} ${BY + BH + 16} L ${BX + 1000} ${BY + BH + 6}`, fill: 'none', stroke: '#2f7d80', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.open);
    text(S.open, BX + 500, BY + BH + 44, `Temps d’ouverture (TRG) : 16${NB}h, inchangé`, { size: 20, weight: 700, fill: '#2f7d80', anchor: 'middle' });

    S.plus = el('g');
    G.pill(S.plus, BX + 2 * PXH, 222, `+${NB}2${NB}h de changements de série`, { size: 18, h: 34, bg: C.teal, fg: C.white });

    S.legend = el('g');
    const leg = [[C.lightBlue, 'maintenance'], [C.teal, 'changements de série'], [C.red, 'arrêts subis'], [C.yellow, 'cadence'], [C.violet, 'rebuts'], [C.green, 'temps utile']];
    let lx = 70;
    leg.forEach(([c, s]) => {
      el('rect', { x: lx, y: 432, width: 16, height: 16, rx: 4, fill: c }, S.legend);
      const tt = text(S.legend, lx + 24, 446, s, { size: 17, weight: 500, fill: C.ink });
      lx = measure(tt).x + measure(tt).width + 26;
    });
    fit(S.legend, 1130, 'légende');

    // ----- Carte 2 : les deux taux et la production -----
    G.card(40, 488, 1120, 272);
    const col = (x, title, color) => {
      const g = el('g');
      text(g, x, 530, title, { size: 22, weight: 700, fill: color });
      el('rect', { x, y: 612, width: 300, height: 20, rx: 7, fill: C.pLav }, g);
      const fill = el('rect', { x, y: 612, width: 0, height: 20, rx: 7, fill: color });
      const big = text(G.svg, x, 594, '', { size: 50, weight: 800, fill: color });
      const was = text(g, x, 660, '', { size: 18, weight: 500, fill: C.ink });
      return { g, fill, big, was, x };
    };
    S.cTRS = col(70, 'TRS = tu / tr', C.blue);
    S.cTRG = col(440, 'TRG = tu / to', '#2f7d80');
    S.cTRS.was.textContent = `avant : 77${NB}%`;
    S.cTRG.was.textContent = `avant : 68${NB}%`;
    S.mark = el('line', { x1: 440 + 204, y1: 604, x2: 440 + 204, y2: 640, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '4 3' });
    S.cP = el('g');
    text(S.cP, 810, 530, 'Pièces conformes', { size: 22, weight: 700, fill: C.ink });
    text(S.cP, 810, 660, 'avant : 650', { size: 18, weight: 500, fill: C.ink });
    S.pBig = text(G.svg, 810, 594, '', { size: 50, weight: 800, fill: C.ink });

    const tag = (x, label, ok) => {
      const g = el('g');
      const p = G.pill(g, x, 632, label, { size: 18, h: 34, pad: 12, bg: ok ? C.pGreen : C.pRed, fg: ok ? C.tGreen : C.tRed, icon: ok ? 'check' : null });
      return { g, cx: x + p.w / 2, w: p.w };
    };
    S.okTRS = tag(0, 'tient', true);
    S.okTRS.g.setAttribute('data-x', 0);
    S.koTRG = tag(0, `–${NB}10 points`, false);
    S.koP = tag(0, `–${NB}93 pièces`, false);

    S.why = text(G.svg, 70, 722, 'Le problème n’est pas sur la ligne, il est dans l’ordonnancement.', { size: 22, weight: 700, fill: C.tRed });
    fit(S.why, 1130, 'interprétation');

    S.chute = G.blogChute('Sur le TRS, ce temps est neutralisé. Sur le TRG, il se voit.', { y: 812 });
  }

  // ---------- Chronologie ----------
  const BAR_T = 1.8, BAR_D = 1.0;
  const OPEN_T = 3.0, REQ_T = 3.4, LEG_T = 3.8, COL_T = 4.3;
  const CHG = 6.0, CHG_D = 2.2;
  const TAG_T = 8.5, WHY_T = 9.6, CHUTE_T = 11.0;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const s = live ? easeInOut(prog(t, CHG, CHG_D)) : 1;     // 0 = journée de référence, 1 = + 2 h de changements
    const tr = 14 - 2 * s, k = tr / 14, tu = TU0 * k;

    // Barre
    S.reveal.setAttribute('width', live ? Math.max(0.001, 1000 * easeInOut(prog(t, BAR_T, BAR_D))) : 1000);
    S.bar.setAttribute('opacity', o);
    S.frame.setAttribute('opacity', o);
    S.chg.setAttribute('width', 2 * s * PXH);
    let x = BX + (2 + 2 * s) * PXH;
    const x0 = x;
    PARTS.forEach((p, i) => {
      const w = p.h * k * PXH;
      S.parts[i].setAttribute('x', x);
      S.parts[i].setAttribute('width', w);
      if (i === 3) { S.tTu.setAttribute('x', x + w / 2); S.tTu.textContent = `temps utile : ${hm(tu)}`; }
      x += w;
    });
    const barO = o * (live ? clamp(prog(t, BAR_T + BAR_D, 0.3)) : 1);
    S.tMaint.setAttribute('opacity', barO);
    S.tTu.setAttribute('opacity', barO);
    S.tChg.setAttribute('x', BX + 3 * PXH);
    S.tChg.setAttribute('opacity', o * (live ? clamp((s - 0.7) / 0.3) : 1));

    // Accolades
    S.reqPath.setAttribute('d', `M ${x0} ${BY - 6} L ${x0} ${BY - 16} L ${BX + 1000} ${BY - 16} L ${BX + 1000} ${BY - 6}`);
    S.reqText.setAttribute('x', (x0 + BX + 1000) / 2);
    S.reqText.textContent = `Temps requis (TRS) : ${hm(tr)}`;
    pop(S.req, t, REQ_T, (x0 + BX + 1000) / 2, 262);
    pop(S.open, t, OPEN_T, BX + 500, BY + BH + 30);
    pop(S.legend, t, LEG_T, 600, 440);
    pop(S.plus, t, CHG - 0.4, BX + 2 * PXH + 130, 222);

    // Taux et pièces
    const trg = tu / 16;
    [[S.cTRS, TRS, 0], [S.cTRG, trg, 1]].forEach(([c, v, i]) => {
      pop(c.g, t, COL_T + 0.15 * i, c.x + 150, 600);
      const co = o * (live ? clamp(prog(t, COL_T + 0.15 * i, 0.3)) : 1);
      c.fill.setAttribute('width', 300 * v * (live ? easeOut(prog(t, COL_T + 0.15 * i, 0.6)) : 1));
      c.fill.setAttribute('opacity', co);
      c.big.textContent = `${Math.round(100 * v)}${NB}%`;
      c.big.setAttribute('opacity', co);
      c.was.setAttribute('opacity', live ? clamp(prog(t, CHG + CHG_D, 0.3)) : 1);
    });
    S.mark.setAttribute('opacity', o * (live ? clamp(prog(t, CHG, 0.3)) : 1));
    pop(S.cP, t, COL_T + 0.3, 960, 600);
    S.pBig.textContent = String(Math.round(tu * 60));
    S.pBig.setAttribute('opacity', o * (live ? clamp(prog(t, COL_T + 0.3, 0.3)) : 1));
    S.cP.lastChild.setAttribute('opacity', live ? clamp(prog(t, CHG + CHG_D, 0.3)) : 1);

    // Étiquettes de bilan, placées à droite du grand chiffre
    const place = (tg, bigNode, t0) => {
      const b = G.measure(bigNode);
      const px = b.x + b.width + 18;
      pop(tg.g, t, t0, tg.cx, 632);
      const cur = tg.g.getAttribute('transform') || '';
      tg.g.setAttribute('transform', `translate(${px} -58) ${cur}`);
    };
    place(S.okTRS, S.cTRS.big, TAG_T);
    place(S.koTRG, S.cTRG.big, TAG_T + 0.3);
    place(S.koP, S.pBig, TAG_T + 0.6);

    rise(S.why, t, WHY_T);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
