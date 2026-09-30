// Blog · Les MUDA · section « Où chaque MUDA se cache dans vos indicateurs »
// Mécanique : la cascade du TRS de l'exemple (14 h requises, 2 h d'arrêts subis, 680 pièces sur 720 possibles,
// 650 conformes : TRS 77 %) sert de tamis. Les huit MUDA tombent un par un : les attentes se logent dans la perte de
// disponibilité, mouvements et étapes inutiles dans la perte de performance, les défauts dans la perte de qualité.
// Les quatre autres traversent tout le calcul et tombent dans « nulle part » : surproduction, stocks, transports,
// compétences non utilisées.
// Chiffres et correspondances : ceux de l'article. Échelle des barres : 840 pièces possibles = 616 px.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const BX = 300, K = 616 / 840, BH = 32;
  const ROWS = [
    { y: 318, lab: 'Temps requis', val: `14${NB}h, soit 840 pièces`, keep: 840, loss: 0 },
    { y: 384, lab: 'Disponibilité', val: `12${NB}h sur 14${NB}h`, keep: 720, loss: 120, lossLab: `2${NB}h` },
    { y: 450, lab: 'Performance', val: '680 sur 720 pièces', keep: 680, loss: 40, lossLab: '40' },
    { y: 516, lab: 'Qualité', val: '650 sur 680 pièces', keep: 650, loss: 30, lossLab: '30' },
  ];
  // Les huit familles : point de départ (deux rangées) et destination
  const MUDA = [
    { n: 'Surproduction', dest: { box: 0 }, why: 'fait même monter le TRS' },
    { n: 'Attentes', dest: { row: 1, k: 0 } },
    { n: 'Transports', dest: { box: 2 }, why: 'hors du périmètre mesuré' },
    { n: 'Mouvements', dest: { row: 2, k: 0 } },
    { n: 'Stocks', dest: { box: 1 }, why: 'l’en-cours ne change rien' },
    { n: 'Étapes inutiles', dest: { row: 2, k: 1 } },
    { n: 'Défauts', dest: { row: 3, k: 0 } },
    { n: 'Compétences', dest: { box: 3 }, why: 'aucun indicateur ne le porte' },
  ];
  const ORDER = [1, 3, 5, 6, 0, 4, 2, 7];         // ordre de chute (celles qui se logent d'abord)
  const T_FALL0 = 4.9, T_FALL = 0.55, D_FALL = 0.7;
  const BOX = { y: 600, x0: 64, w: 268 };
  const CHUTE_T = T_FALL0 + T_FALL * 8 + 1.1;
  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Quatre MUDA', 'hors du TRS.');
    G.blogChapeau(`Exemple de l’article, TRS 77${NB}% : où chaque gaspillage se loge-t-il dans le calcul${NB}?`);

    G.card(40, 176, 1120, 400);
    G.card(40, 588, 1120, 170);

    // Cascade
    S.rows = ROWS.map((r, i) => {
      const g = el('g');
      text(g, 64, r.y + 4, r.lab, { size: 19, weight: 700, fill: C.ink });
      text(g, 64, r.y + 26, r.val, { size: 16, weight: 500, fill: C.ink });
      const keep = el('rect', { x: BX, y: r.y - BH / 2, width: 0, height: BH, rx: 6, fill: i ? C.lightBlue : C.pLav }, g);
      const loss = el('rect', { x: BX + r.keep * K + 2, y: r.y - BH / 2, width: 0, height: BH, rx: 6, fill: C.red }, g);
      let ll = null;
      if (r.loss) ll = text(g, BX + (r.keep + r.loss / 2) * K + 1, r.y + 6, r.lossLab, { size: 15, weight: 700, fill: C.white, anchor: 'middle' });
      return { ...r, g, keepR: keep, lossR: loss, ll };
    });
    S.trs = el('g');
    text(S.trs, 1136, 326, `TRS 77${NB}%`, { size: 34, weight: 800, fill: C.blue, anchor: 'end' });
    text(S.trs, 1136, 350, '650 ÷ 840', { size: 16, weight: 500, fill: C.ink, anchor: 'end' });

    // En-tête et légende
    S.legend = el('g');
    text(S.legend, 64, 216, 'Où tombe chaque MUDA ?'.replace(' ?', `${NB}?`), { size: 20, weight: 700, fill: C.ink });
    const l1 = G.pill(S.legend, 560, 210, 'visible dans le TRS', { size: 16, h: 28, pad: 12, bg: C.white, fg: C.blue });
    l1.g.querySelector('rect').setAttribute('stroke', C.red);
    l1.g.querySelector('rect').setAttribute('stroke-width', 2);
    G.pill(S.legend, 560 + l1.w + 14, 210, 'nulle part', { size: 16, h: 28, pad: 12, bg: C.pRed, fg: C.tRed });

    // Boîte « nulle part »
    S.boxHead = el('g');
    text(S.boxHead, 64, 624, 'Nulle part dans le TRS', { size: 20, weight: 800, fill: C.tRed });
    const bh = text(S.boxHead, 300, 624, '4 familles sur 8', { size: 18, weight: 700, fill: C.ink });
    S.boxWhy = [0, 1, 2, 3].map(j => {
      const m = MUDA.find(v => v.dest.box === j);
      const t = text(G.svg, BOX.x0 + j * BOX.w + 4, 720, m.why, { size: 16, weight: j === 0 ? 800 : 500, fill: j === 0 ? C.tRed : C.ink });
      fit(t, BOX.x0 + (j + 1) * BOX.w - 6, `pourquoi ${j}`);
      return t;
    });

    // Jetons
    S.tok = MUDA.map((m, i) => {
      const g = el('g');
      const inner = el('g', {}, g);
      const p = G.pill(inner, 0, 0, m.n, { size: 17, h: 30, pad: 12, bg: C.pLav, fg: C.blue });
      const start = { x: 64 + (i % 4) * 272, y: 252 + Math.floor(i / 4) * 34 };
      let end;
      if (m.dest.box !== undefined) end = { x: BOX.x0 + m.dest.box * BOX.w + 4, y: 676 };
      else {
        const r = ROWS[m.dest.row];
        end = { x: BX + (r.keep + r.loss) * K + 14, y: r.y };
      }
      return { ...m, g, inner, w: p.w, start, end, bgR: inner.querySelector('rect'), tx: inner.querySelector('text') };
    });

    S.chute = G.blogChute('Quatre familles sur huit sont invisibles pour un pilotage au TRS.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;

    S.rows.forEach((r, i) => {
      const t0 = 2.3 + 0.45 * i;
      const w = live ? easeOut(prog(t, t0, 0.5)) : 1;
      r.keepR.setAttribute('width', Math.max(0.001, r.keep * K * w));
      const lw = live ? easeOut(prog(t, t0 + 0.4, 0.3)) : 1;
      r.lossR.setAttribute('width', Math.max(0.001, r.loss * K * lw - (r.loss ? 2 : 0)));
      r.lossR.setAttribute('opacity', r.loss ? 1 : 0);
      if (r.ll) r.ll.setAttribute('opacity', live ? clamp(prog(t, t0 + 0.6, 0.3)) : 1);
      r.g.setAttribute('opacity', fo * (live ? clamp(prog(t, t0, 0.25)) : 1));
    });
    pop(S.trs, t, 4.2, 1070, 330);
    S.legend.setAttribute('opacity', fo * (live ? clamp(prog(t, 1.7, 0.3)) : 1));
    S.boxHead.setAttribute('opacity', fo * (live ? clamp(prog(t, 4.4, 0.3)) : 1));

    // Deux jetons sur la même ligne (performance) : le second se place après le premier
    const perf = S.tok.filter(m => m.dest.row === 2);
    perf[1].end.x = perf[0].end.x + perf[0].w + 10;
    S.tok.forEach((m, i) => {
      const k = ORDER.indexOf(i);
      const t0 = T_FALL0 + T_FALL * k;
      const p = live ? prog(t, t0, D_FALL) : 1;
      const e = easeInOut(p);
      const x = m.start.x + (m.end.x - m.start.x) * e;
      const y = m.start.y + (m.end.y - m.start.y) * (p * p);      // chute : accélère
      m.g.setAttribute('transform', `translate(${x} ${y})`);
      m.g.setAttribute('opacity', fo * (live ? clamp(prog(t, 1.75 + 0.05 * i, 0.3)) : 1));
      const inBox = m.dest.box !== undefined;
      const landed = p >= 1;
      m.bgR.setAttribute('fill', landed ? (inBox ? C.pRed : C.white) : C.pLav);
      m.bgR.setAttribute('stroke', landed && !inBox ? C.red : 'none');
      m.bgR.setAttribute('stroke-width', 2);
      m.tx.setAttribute('fill', landed && inBox ? C.tRed : C.blue);
      if (inBox) S.boxWhy[m.dest.box].setAttribute('opacity', fo * (live ? clamp(prog(t, t0 + D_FALL, 0.3)) : 1));
      if (live && landed && t < t0 + D_FALL + 0.45) pulse(m.inner, t, t0 + D_FALL, m.w / 2, 0, 0.1, 0.35);
      else m.inner.setAttribute('transform', '');
    });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
