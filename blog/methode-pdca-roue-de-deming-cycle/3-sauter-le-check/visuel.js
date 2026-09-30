// Blog · PDCA · section « Les 4 étapes du cycle PDCA », étape Check
// Mécanique : deux équipes lancent les mêmes quatre actions. En haut, sans Check, les actions s'empilent et l'effet
// de chacune reste inconnu. En bas, chaque action est mesurée : l'indicateur baisse (gardée), ne bouge pas ou
// empire (abandonnée). À la fin : 4 actions d'effet inconnu contre 2 gardées et un gain mesuré.
// Effets des actions : hypothèse illustrative, sans échelle. Boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = { lanes: [] };
  const LANES = [{ y0: 176, kind: 'sans' }, { y0: 468, kind: 'avec' }];
  const SX = [390, 530, 670, 810];                 // emplacements des actions
  const CH = { x0: 300, x1: 880 };                 // zone du graphique
  // Niveaux de l'indicateur (décalage depuis le haut de la carte) : plus haut = plus de temps perdu
  const LV = [96, 132, 132, 166, 166];
  const SPIKE = 112;                                // l'action 4 empire, puis est retirée
  const OBJ = 158;
  const KEEP = [true, false, true, false];
  const T = { a0: 2.6, step: 1.6, sum: 9.3, chute: 10.2 };
  const tA = k => T.a0 + T.step * k;

  function build() {
    G.templateBlog();
    G.blogTitle('Sans Check,', 'on empile.');
    G.blogChapeau('Sans mesure, on empile des actions sans savoir lesquelles servent.');

    LANES.forEach((ln, li) => {
      const L = { ...ln };
      const Y0 = ln.y0;
      const avec = ln.kind === 'avec';
      G.card(40, Y0, 1120, 276);
      L.head = el('g');
      const p = G.pill(L.head, 64, Y0 + 38, avec ? 'Avec Check' : 'Sans Check', { size: 22, h: 38, bg: avec ? C.pGreen : C.pRed, fg: avec ? C.tGreen : C.tRed });
      fit(text(L.head, 64 + p.w + 16, Y0 + 46, avec ? 'Chaque action est mesurée avant de conclure.' : 'On enchaîne les actions, sans mesurer.', { size: 21, weight: 500, fill: C.ink }), 1136, `sous-titre ${li}`);


      // Graphique
      L.chart = el('g');
      el('line', { x1: CH.x0, y1: Y0 + 72, x2: CH.x0, y2: Y0 + 196, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, L.chart);
      el('line', { x1: CH.x0, y1: Y0 + 196, x2: CH.x1, y2: Y0 + 196, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, L.chart);
      text(L.chart, CH.x0 + 10, Y0 + 80, 'Indicateur (temps perdu)', { size: 16, weight: 700, fill: C.ink });
      if (avec) {
        el('line', { x1: CH.x0, y1: Y0 + OBJ, x2: CH.x1, y2: Y0 + OBJ, stroke: C.tGreen, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, L.chart);
        text(L.chart, CH.x0 + 8, Y0 + OBJ - 8, 'objectif', { size: 16, weight: 700, fill: C.tGreen });
      } else {
        el('rect', { x: CH.x0 + 8, y: Y0 + 90, width: CH.x1 - CH.x0 - 16, height: 98, rx: 12, fill: C.pLav }, L.chart);
        text(L.chart, (CH.x0 + CH.x1) / 2, Y0 + 150, 'non mesuré', { size: 22, weight: 700, fill: C.blue, anchor: 'middle' });
      }

      // Tracé de l'indicateur (bas) : un morceau par action
      if (avec) {
        L.start = el('line', { x1: CH.x0, y1: Y0 + LV[0], x2: SX[0], y2: Y0 + LV[0], stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round' });
        L.segs = SX.map((x, k) => {
          const g = el('g');
          const nx = k < 3 ? SX[k + 1] : CH.x1 - 10;
          const y0 = Y0 + LV[k], y1 = Y0 + LV[k + 1];
          let spike = null;
          if (k === 3) spike = el('path', { d: `M ${x} ${y0} L ${x} ${Y0 + SPIKE}`, stroke: C.red, 'stroke-width': 4, 'stroke-dasharray': '6 6', 'stroke-linecap': 'round', fill: 'none' }, g);
          const path = el('path', { d: `M ${x} ${y0} L ${x} ${y1} L ${nx} ${y1}`, stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }, g);
          const len = path.getTotalLength();
          return { g, path, len, spike };
        });
      }

      // Cartes des actions
      L.cards = SX.map((x, k) => {
        const g = el('g');
        el('rect', { x: -52, y: -17, width: 104, height: 34, rx: 10, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, g);
        text(g, 0, 6, `Action ${k + 1}`, { size: 17, weight: 700, fill: C.blue, anchor: 'middle' });
        const badge = el('g');
        if (!avec) {
          el('circle', { cx: 0, cy: 0, r: 13, fill: C.lightBlue }, badge);
          text(badge, 0, 6, '?', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
        } else if (KEEP[k]) G.check(badge, 0, 0, 13);
        else G.cross(badge, 0, 0, 13);
        return { g, badge, x };
      });
      L.slotY = Y0 + 230;

      // Bilan (à droite)
      L.sum = el('g');
      el('rect', { x: 944, y: Y0 + 74, width: 192, height: 180, rx: 20, fill: avec ? C.pGreen : C.pRed }, L.sum);
      const fg = avec ? C.tGreen : C.tRed;
      if (avec) {
        text(L.sum, 1040, Y0 + 124, '2 gardées', { size: 22, weight: 700, fill: fg, anchor: 'middle' });
        text(L.sum, 1040, Y0 + 158, '2 abandonnées', { size: 19, weight: 600, fill: fg, anchor: 'middle' });
        text(L.sum, 1040, Y0 + 200, 'gain mesuré', { size: 19, weight: 700, fill: fg, anchor: 'middle' });
        text(L.sum, 1040, Y0 + 226, 'objectif atteint', { size: 17, weight: 500, fill: fg, anchor: 'middle' });
      } else {
        text(L.sum, 1040, Y0 + 124, '4 actions', { size: 22, weight: 700, fill: fg, anchor: 'middle' });
        text(L.sum, 1040, Y0 + 152, 'en place', { size: 19, weight: 500, fill: fg, anchor: 'middle' });
        text(L.sum, 1040, Y0 + 200, 'lesquelles', { size: 19, weight: 700, fill: fg, anchor: 'middle' });
        text(L.sum, 1040, Y0 + 226, 'servent ?', { size: 19, weight: 700, fill: fg, anchor: 'middle' });
      }
      S.lanes.push(L);
    });

    S.chute = G.blogChute('Pas de mesure, pas de conclusion.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    S.lanes.forEach((L, li) => {
      const avec = L.kind === 'avec';
      const d0 = 1.75 + 0.3 * li;
      pop(L.head, t, d0, 200, L.y0 + 38);
      L.chart.setAttribute('opacity', live ? clamp(prog(t, d0 + 0.2, 0.3)) : o);

      // Cartes : en file à gauche, puis chacune rejoint son emplacement
      L.cards.forEach((c, k) => {
        const ta = tA(k);
        const from = { x: 160, y: L.y0 + 96 + 42 * k };
        const slot = { x: c.x, y: L.slotY };
        let x = slot.x, y = slot.y, op = o;
        if (live) {
          const p = prog(t, ta, 0.5);
          const e = easeInOut(p);
          x = from.x + (slot.x - from.x) * e;
          y = from.y + (slot.y - from.y) * e - 40 * Math.sin(Math.PI * p);
          op = clamp(prog(t, d0 + 0.3 + 0.08 * k, 0.3));
        }
        c.g.setAttribute('transform', `translate(${x} ${y})`);
        // Abandonnée : grisée
        const dropped = avec && !KEEP[k] && (!live || t >= ta + 1.1);
        c.g.setAttribute('opacity', op * (dropped ? 0.45 : 1));
        // Pastille : ? (sans Check) ou verdict de la mesure (avec Check)
        const bt = ta + (avec ? 1.0 : 0.6);
        let bs = 1, bo = o;
        if (live) { const p = prog(t, bt, 0.3); bs = p <= 0 ? 0.001 : 0.6 + 0.4 * G.back(p); bo = clamp(p / 0.4); }
        c.badge.setAttribute('transform', `translate(${slot.x + 52} ${slot.y - 17}) scale(${bs})`);
        c.badge.setAttribute('opacity', bo);
      });

      // Tracé de l'indicateur (avec Check)
      if (avec) {
        L.start.setAttribute('opacity', live ? clamp(prog(t, d0 + 0.3, 0.3)) : o);
        L.segs.forEach((s, k) => {
          const ta = tA(k) + 0.55;
          let q = 1;
          if (live) q = easeInOut(prog(t, ta, 0.45));
          s.path.setAttribute('stroke-dasharray', `${s.len * q} ${s.len}`);
          s.g.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
          if (s.spike) {
            // l'action 4 fait monter l'indicateur (trace rouge) : on la retire, le niveau revient
            const sp = live ? clamp(prog(t, ta, 0.2)) : o;
            s.spike.setAttribute('opacity', sp);
          }
        });
      }
      pop(L.sum, t, T.sum + 0.25 * li, 1040, L.y0 + 164);
    });

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
