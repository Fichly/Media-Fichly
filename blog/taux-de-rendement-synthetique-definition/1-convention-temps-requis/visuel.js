// Blog · TRS · section « Quelle est la formule du temps requis du TRS ? », encadré « Le point qui décide de tout »
// Mécanique : la journée de référence en 16 cases d'une heure. Une heure de panne récurrente est requalifiée
// en maintenance planifiée : la case change de famille, le temps requis passe de 14 h à 13 h, le TRS de 77 % à 83 %.
// La machine reste arrêtée 4 h et livre toujours 650 pièces conformes : rien n'a changé dans l'atelier.
// Hypothèse : 1 h des 2 h d'arrêts subis est une panne récurrente (l'article ne chiffre pas la requalification).
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const S = {};
  const TW = 60, STEP = 66.6, X0 = 70, TY = 298, TH = 60;
  const tx = i => X0 + i * STEP;
  // Familles des 16 cases (état initial) : 0-1 planifié, 2-3 subi, 4 et 1/6 de 5 cadence et rebuts, le reste utile
  const KIND = i => (i < 2 ? 'plan' : i < 4 ? 'subi' : i === 4 ? 'perte' : i === 5 ? 'mixte' : 'utile');
  const COL = { plan: C.lightBlue, subi: C.red, perte: C.yellow, utile: C.green };
  const TU = 10 + 50 / 60;

  function bracket(parent, x0, x1, y, dir = 1, stroke = C.blue) {
    return el('path', { d: `M ${x0} ${y + 10 * dir} L ${x0} ${y} L ${x1} ${y} L ${x1} ${y + 10 * dir}`, fill: 'none', stroke, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le TRS monte,', 'l’atelier non.');
    G.blogChapeau('Même journée, mêmes arrêts : une panne récurrente passe en maintenance planifiée.');

    // ----- Carte 1 : la journée en cases d'une heure -----
    G.card(40, 176, 1120, 296);
    S.legend = el('g');
    el('rect', { x: 70, y: 201, width: 22, height: 22, rx: 5, fill: C.green }, S.legend);
    text(S.legend, 102, 219, '1 case = 1 heure', { size: 18, weight: 600, fill: C.ink });

    const defs = G.svg.querySelector('defs') || el('defs');
    S.tiles = Array.from({ length: 16 }, (_, i) => {
      const g = el('g');
      const k = KIND(i);
      const cp = el('clipPath', { id: `tile${i}` }, defs);
      el('rect', { x: tx(i), y: TY, width: TW, height: TH, rx: 9 }, cp);
      const inner = el('g', { 'clip-path': `url(#tile${i})` }, g);
      let main;
      if (k === 'mixte') {
        el('rect', { x: tx(i), y: TY, width: TW, height: TH, fill: C.green }, inner);
        el('rect', { x: tx(i), y: TY, width: TW / 6, height: TH, fill: C.yellow }, inner);
      } else main = el('rect', { x: tx(i), y: TY, width: TW, height: TH, fill: COL[k] }, inner);
      return { g, main, cx: tx(i) + TW / 2 };
    });
    // Contour pointillé de la case requalifiée (ex-panne)
    S.exPanne = el('rect', { x: tx(2) + 2, y: TY + 2, width: TW - 4, height: TH - 4, rx: 8, fill: 'none', stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '6 5' });

    // Accolade du temps d'ouverture (fixe) et du temps requis (se raccourcit)
    S.open = el('g');
    const ob = bracket(S.open, tx(0), tx(15) + TW, 226);
    const ot = text(S.open, 600, 214, `Temps d’ouverture : 16${NB}h`, { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    S.req = el('g');
    S.reqPath = bracket(S.req, tx(2), tx(15) + TW, 280, 1, C.ink);
    S.reqText = text(S.req, 0, 268, '', { size: 20, weight: 700, fill: C.ink, anchor: 'middle' });

    // Étiquettes des familles (changent après la requalification)
    S.labels = el('g');
    S.lPlan = [text(S.labels, 0, 384, 'Planifiés', { size: 18, weight: 700, fill: C.blue, anchor: 'middle' }),
      text(S.labels, 0, 406, '', { size: 18, weight: 500, fill: C.blue, anchor: 'middle' }),
      text(S.labels, 0, 427, `dont 1${NB}h de panne`, { size: 17, weight: 600, fill: C.tRed, anchor: 'middle' })];
    S.lSubi = [text(S.labels, 0, 384, 'Subis', { size: 18, weight: 700, fill: C.tRed, anchor: 'middle' }),
      text(S.labels, 0, 406, '', { size: 18, weight: 500, fill: C.tRed, anchor: 'middle' })];
    S.lPerte = [text(S.labels, tx(4) + 44, 384, 'Cadence,', { size: 18, weight: 700, fill: C.tYellow, anchor: 'middle' }),
      text(S.labels, tx(4) + 44, 406, 'rebuts', { size: 18, weight: 700, fill: C.tYellow, anchor: 'middle' }),
      text(S.labels, tx(4) + 44, 427, `1${NB}h${NB}10`, { size: 18, weight: 500, fill: C.tYellow, anchor: 'middle' })];
    S.utile = el('g');
    const ux0 = tx(5) + TW / 6, ux1 = tx(15) + TW;
    bracket(S.utile, ux0, ux1, 372, -1, C.tGreen);
    text(S.utile, (ux0 + ux1) / 2, 400, `Temps utile : 10${NB}h${NB}50`, { size: 20, weight: 700, fill: C.tGreen, anchor: 'middle' });
    text(S.utile, (ux0 + ux1) / 2, 426, '650 pièces conformes à 60 pièces par heure', { size: 18, weight: 500, fill: C.tGreen, anchor: 'middle' });

    // Bulle de la requalification
    S.bubble = el('g', { opacity: 0 });
    const bp = G.pill(S.bubble, 70, 250, 'Panne requalifiée en arrêt planifié', { size: 19, h: 40, bg: C.blue, fg: C.white });
    el('path', { d: `M ${tx(2) + 20} 269 L ${tx(2) + 30} 284 L ${tx(2) + 40} 269 Z`, fill: C.blue }, S.bubble);
    fit(bp.g, 1130, 'bulle');

    // ----- Carte 2 : le calcul et ce qui ne change pas -----
    G.card(40, 488, 1120, 272);
    S.head = el('g');
    text(S.head, 70, 532, 'TRS = temps utile ÷ temps requis', { size: 24, weight: 700, fill: C.ink });
    const line = (y, label, formula, res, fill) => {
      const g = el('g');
      const a = text(g, 70, y, label, { size: 22, weight: 600, fill: C.ink });
      const b = text(g, 70 + 210, y, formula, { size: 25, weight: 500, fill: C.ink });
      const r = text(g, measure(b).x + measure(b).width + 10, y, res, { size: 30, weight: 800, fill });
      return { g, r };
    };
    S.before = line(596, 'Avant', `10${NB}h${NB}50 ÷ 14${NB}h =`, `77${NB}%`, C.ink);
    S.after = line(664, 'Après', `10${NB}h${NB}50 ÷ 13${NB}h =`, `83${NB}%`, C.tGreen);
    S.plus = el('g');
    const rb = measure(S.after.r);
    G.pill(S.plus, rb.x + rb.width + 16, 654, '+ 6 points', { size: 19, h: 34, bg: C.pGreen, fg: C.tGreen });
    S.note = text(G.svg, 70, 722, 'La panne est sortie du dénominateur. Elle n’a pas disparu.', { size: 20, weight: 500, fill: C.tRed });
    fit(S.note, 680, 'note');

    // Compteurs immobiles
    const stat = (y, label, value) => {
      const g = el('g');
      el('rect', { x: 700, y, width: 430, height: 104, rx: 18, fill: C.pLav }, g);
      text(g, 726, y + 40, label, { size: 20, weight: 600, fill: C.blue });
      text(g, 726, y + 84, value, { size: 34, weight: 800, fill: C.blue });
      const pg = el('g', {}, g);
      const p = G.pill(pg, 1108, y + 70, 'inchangé', { size: 18, h: 32, pad: 12, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
      p.g.setAttribute('transform', `translate(${-p.w} 0)`);
      return { g, pg, cy: y + 52, pcx: 1108 - p.w / 2, pcy: y + 70 };
    };
    S.stop = stat(512, 'Machine à l’arrêt', `4${NB}h`);
    S.good = stat(630, 'Pièces conformes', '650');

    S.chute = G.blogChute('Écrivez la convention, datez-la, et ne la changez pas.', { y: 810 });
  }

  // ---------- Chronologie ----------
  const TILE_T = i => 1.8 + 0.05 * i;
  const LAB_T = 2.7, OPEN_T = 3.1, REQ_T = 3.6, UT_T = 4.2;
  const HEAD_T = 4.9, BEFORE_T = 5.3, STAT_T = 5.8;
  const BUB = [6.9, 9.7];
  const FLIP = 7.7, FLIP_D = 0.5;
  const SHIFT = 8.5, SHIFT_D = 0.8;
  const AFTER_T = 9.9, COUNT_D = 0.6;
  const KEEP_T = 11.0, CHUTE_T = 12.0;

  // 0 = avant, 1 = après la requalification (état final et image t = 0)
  const flipDone = t => t < FADE_END || t >= FLIP + FLIP_D / 2;
  const shiftP = t => (t < FADE_END ? 1 : easeInOut(prog(t, SHIFT, SHIFT_D)));

  function draw(t) {
    const live = t >= FADE_END;
    S.tiles.forEach((tl, i) => {
      if (i !== 2) { pop(tl.g, t, TILE_T(i), tl.cx, TY + TH / 2); return; }
      // Case requalifiée : pop, puis retournement (échelle horizontale) avec changement de couleur à mi-course
      pop(tl.g, t, TILE_T(i), tl.cx, TY + TH / 2);
      const done = flipDone(t);
      tl.main.setAttribute('fill', done ? COL.plan : COL.subi);
      if (live && t >= FLIP && t < FLIP + FLIP_D) {
        const sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * prog(t, FLIP, FLIP_D))));
        tl.g.setAttribute('transform', `translate(${tl.cx} 0) scale(${sx} 1) translate(${-tl.cx} 0)`);
      } else if (live && t >= 6.9 && t < 7.6) pulse(tl.g, t, 7.0, tl.cx, TY + TH / 2, 0.12, 0.5);
    });
    const o = fading(t) ? fadeOut(t) : 1;
    S.exPanne.setAttribute('opacity', o * (flipDone(t) ? (live ? clamp(prog(t, FLIP + FLIP_D, 0.3)) : 1) : 0));

    pop(S.legend, t, 2.4, 150, 212);
    pop(S.open, t, OPEN_T, 600, 220);

    // Temps requis : le bord gauche glisse d'une case
    const sp = shiftP(t);
    const x0 = tx(2) + (tx(3) - tx(2)) * sp, x1 = tx(15) + TW;
    S.reqPath.setAttribute('d', `M ${x0} 290 L ${x0} 280 L ${x1} 280 L ${x1} 290`);
    const trNow = 14 - sp;
    const hrs = live && t < SHIFT + SHIFT_D * 0.5 ? 14 : 13;
    S.reqText.textContent = `Temps requis : ${hrs}${NB}h`;
    S.reqText.setAttribute('x', (x0 + x1) / 2);
    pop(S.req, t, REQ_T, (x0 + x1) / 2, 276);

    // Étiquettes des familles
    const after = flipDone(t) && (!live || t >= FLIP + FLIP_D);
    const nPlan = after ? 3 : 2;
    const planCx = (tx(0) + tx(nPlan - 1) + TW) / 2, subiCx = (tx(nPlan) + tx(3) + TW) / 2;
    S.lPlan.forEach(n => n.setAttribute('x', planCx));
    S.lSubi.forEach(n => n.setAttribute('x', subiCx));
    S.lPlan[1].textContent = `${nPlan}${NB}h`;
    S.lSubi[1].textContent = `${4 - nPlan}${NB}h`;
    S.lPlan[2].setAttribute('opacity', after ? 1 : 0);
    pop(S.labels, t, LAB_T, 300, 400);
    pop(S.utile, t, UT_T, 760, 400);

    // Bulle
    S.bubble.setAttribute('opacity', live ? window01(t, BUB[0], BUB[1]) : 0);

    // Carte 2
    pop(S.head, t, HEAD_T, 260, 525);
    rise(S.before.g, t, BEFORE_T);
    rise(S.after.g, t, AFTER_T);
    const cp = live ? prog(t, AFTER_T + 0.2, COUNT_D) : 1;
    S.after.r.textContent = `${Math.round(100 * TU / (14 - easeOut(cp)))}${NB}%`;
    pop(S.plus, t, AFTER_T + COUNT_D + 0.25, 1000, 654);
    rise(S.note, t, AFTER_T + COUNT_D + 0.6);

    [S.stop, S.good].forEach((s, i) => {
      pop(s.g, t, STAT_T + 0.15 * i, 915, s.cy);
      if (live && t >= KEEP_T + 0.2 * i - 0.05 && t < KEEP_T + 0.2 * i + 0.8) pulse(s.g, t, KEEP_T + 0.2 * i, 915, s.cy, 0.05, 0.5);
      const po = fading(t) ? fadeOut(t) : live ? clamp(prog(t, KEEP_T + 0.2 * i, 0.3)) : 1;
      s.pg.setAttribute('opacity', po);
    });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
