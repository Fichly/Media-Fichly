// Blog · DMAIC · section « Les 5 étapes du DMAIC et ce que chaque phase doit produire »
// Mécanique : le tableau « se lit comme un contrat ». Cinq phases séparées par des portes fermées.
// Une solution déguisée (« Il manque un contrôle en fin de ligne ») tente de sauter à l'action : elle bute sur la
// première porte. Ensuite, chaque phase produit son livrable, le sponsor valide, la porte s'ouvre, le projet passe.
// Boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const CX = [168, 384, 600, 816, 1032];
  const GX = [276, 492, 708, 924];
  const LANE = 530;
  const PH = [
    { k: 'D', name: 'Définir', liv: 'Charte de projet d’une page', icon: 'doc' },
    { k: 'M', name: 'Mesurer', liv: 'Relevé daté, sur une période représentative', icon: 'chart' },
    { k: 'A', name: 'Analyser', liv: 'Cause prouvée par les données', icon: 'loupe' },
    { k: 'I', name: 'Innover', liv: 'Action testée, résultat mesuré', icon: 'test' },
    { k: 'C', name: 'Contrôler', liv: 'Standard, indicateur, fréquence de revue', icon: 'std' },
  ];
  const T = {
    heads: 1.8, gates: 2.3, token: 2.6, sol: 3.0, hit: 3.55, land: 4.1,
    liv0: 4.6, step: 1.5, chute: 11.8,
  };
  const livT = k => T.liv0 + T.step * k;
  const gateT = k => livT(k) + 0.5;
  const moveT = k => livT(k) + 0.8;          // départ vers la phase k + 1

  // Première ligne du livrable : centrée verticalement selon le nombre de lignes (2 ou 3)
  const pp0 = p => (p.liv.length > 34 ? 396 : 406);

  function icon(parent, kind, cx, cy) {
    const g = el('g', {}, parent);
    const ink = { fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (kind === 'doc' || kind === 'std') {
      el('rect', { x: cx - 17, y: cy - 22, width: 34, height: 44, rx: 5, fill: C.white, stroke: C.ink, 'stroke-width': 3 }, g);
      if (kind === 'std') el('rect', { x: cx - 8, y: cy - 27, width: 16, height: 9, rx: 3, fill: C.ink }, g);
      if (kind === 'doc') [-10, -2, 6].forEach((dy, i) => el('line', { x1: cx - 9, y1: cy + dy, x2: cx + (i === 2 ? 3 : 9), y2: cy + dy, ...ink }, g));
      else el('path', { d: `M ${cx - 8} ${cy + 2} L ${cx - 2} ${cy + 8} L ${cx + 9} ${cy - 5}`, ...ink, stroke: C.tGreen, 'stroke-width': 4 }, g);
    } else if (kind === 'chart') {
      el('line', { x1: cx - 22, y1: cy + 20, x2: cx + 22, y2: cy + 20, ...ink }, g);
      [[-15, 18], [-3, 30], [9, 12], [21, 24]].forEach(([dx, h]) => el('rect', { x: cx + dx - 5, y: cy + 17 - h, width: 10, height: h, rx: 2, fill: C.lightBlue }, g));
    } else if (kind === 'loupe') {
      el('circle', { cx: cx - 4, cy: cy - 4, r: 15, fill: C.white, stroke: C.ink, 'stroke-width': 3.5 }, g);
      el('line', { x1: cx + 7, y1: cy + 7, x2: cx + 19, y2: cy + 19, ...ink, 'stroke-width': 5 }, g);
      el('path', { d: `M ${cx - 11} ${cy - 4} L ${cx - 6} ${cy + 1} L ${cx + 3} ${cy - 9}`, ...ink, stroke: C.tGreen, 'stroke-width': 3.5 }, g);
    } else if (kind === 'test') {
      el('line', { x1: cx - 22, y1: cy + 20, x2: cx + 22, y2: cy + 20, ...ink }, g);
      el('rect', { x: cx - 16, y: cy - 20, width: 14, height: 37, rx: 3, fill: C.red }, g);
      el('rect', { x: cx + 4, y: cy + 5, width: 14, height: 12, rx: 3, fill: C.green }, g);
    }
    return g;
  }
  function padlock(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - 8} ${cy - 3} L ${cx - 8} ${cy - 10} A 8 8 0 0 1 ${cx + 8} ${cy - 10} L ${cx + 8} ${cy - 3}`, fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    el('rect', { x: cx - 13, y: cy - 4, width: 26, height: 21, rx: 5, fill: C.yellow }, g);
    return g;
  }
  function folder(parent) {
    const g = el('g', {}, parent);
    el('path', { d: 'M -34 -20 L -34 -28 Q -34 -32 -30 -32 L -12 -32 L -6 -24 L 30 -24 Q 34 -24 34 -20 Z', fill: C.blue }, g);
    el('rect', { x: -34, y: -22, width: 68, height: 46, rx: 6, fill: C.blue }, g);
    text(g, 0, 7, 'Projet', { size: 16, weight: 700, fill: C.white, anchor: 'middle' });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Une phase,', 'un livrable.');
    G.blogChapeau('Tant que le livrable n’est pas là, la phase suivante ne s’ouvre pas.');
    G.card(40, 176, 1120, 584);

    // Colonnes : lettre, nom, emplacement du livrable
    S.cols = PH.map((p, k) => {
      const cx = CX[k];
      const head = el('g');
      el('circle', { cx, cy: 232, r: 30, fill: C.blue }, head);
      text(head, cx, 244, p.k, { size: 32, weight: 800, fill: C.white, anchor: 'middle' });
      text(head, cx, 292, p.name, { size: 21, weight: 700, fill: C.ink, anchor: 'middle' });
      const slot = el('rect', { x: cx - 96, y: 314, width: 192, height: 140, rx: 16, fill: 'none', stroke: C.line, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' });
      const liv = el('g');
      el('rect', { x: cx - 96, y: 314, width: 192, height: 140, rx: 16, fill: C.pLav }, liv);
      icon(liv, p.icon, cx, 350);
      const pp = G.para(liv, cx, pp0(p), p.liv, 178, { size: 17, weight: 500, fill: C.ink, anchor: 'middle', lh: 1.2 });
      if (pp.n > 3) console.error(`Livrable ${p.k} : ${pp.n} lignes`);
      return { head, slot, liv, cx };
    });

    // Portes (fermées), badges de validation
    S.gates = GX.map((x, k) => {
      const bar = el('g');
      el('rect', { x: x - 6, y: 470, width: 12, height: 120, rx: 6, fill: C.blue }, bar);
      padlock(bar, x, 526);
      const ok = el('g');
      G.check(ok, x, LANE, 16);
      return { bar, ok, x };
    });
    // Ligne du projet
    el('line', { x1: 80, y1: LANE + 34, x2: 1120, y2: LANE + 34, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });
    S.token = folder(G.svg);

    // La solution déguisée qui tente de sauter les phases : une pastille rouge, puis son étiquette au sol
    S.sol = el('g');
    el('rect', { x: -20, y: -20, width: 40, height: 40, rx: 12, fill: C.red }, S.sol);
    text(S.sol, 0, 9, '!', { size: 26, weight: 800, fill: C.white, anchor: 'middle' });
    S.solLab = el('g');
    const sp = G.pill(S.solLab, 112, 660, '« Il manque un contrôle »', { size: 17, h: 34, pad: 14, bg: C.pRed, fg: C.tRed });
    S.solLabW = sp.w;
    S.solX = el('g');
    G.cross(S.solX, 0, 0, 13);
    S.solCap = el('g');
    fit(text(S.solCap, 112 + sp.w + 14, 666, 'une solution déguisée en problème : refusée', { size: 17, weight: 700, fill: C.tRed }), 860, 'légende solution');
    S.legend = el('g');
    const lt = text(S.legend, 1136, 666, 'passage validé par le sponsor', { size: 17, weight: 700, fill: C.tGreen, anchor: 'end' });
    G.check(S.legend, measure(lt).x - 18, 660, 11);

    S.chute = G.blogChute('Aucune solution avant que la cause ne soit prouvée.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  function tokenX(t) {
    if (t < FADE_END) return CX[4];
    let x = CX[0];
    for (let k = 0; k < 4; k++) {
      const p = easeInOut(prog(t, moveT(k), 0.5));
      if (p > 0) x = CX[k] + (CX[k + 1] - CX[k]) * p;
    }
    return x;
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    S.cols.forEach((c, k) => {
      pop(c.head, t, T.heads + 0.08 * k, c.cx, 260);
      c.slot.setAttribute('opacity', live ? clamp(prog(t, T.heads + 0.08 * k, 0.3)) : 0);
      pop(c.liv, t, livT(k), c.cx, 380);
      if (live && t >= livT(k) + 0.4 && t < livT(k) + 1.0) pulse(c.head, t, livT(k) + 0.4, c.cx, 260, 0.08, 0.35);
    });

    // Portes : fermées, puis validées et ouvertes une à une
    S.gates.forEach((g, k) => {
      let o1 = o, dy = 0;
      if (live) {
        const pa = clamp(prog(t, T.gates, 0.3));
        const po = prog(t, gateT(k), 0.4);
        o1 = pa * (1 - po);
        dy = -40 * easeOut(po);
        // choc de la solution sur la première porte
      } else o1 = 0;
      const shake = live && k === 0 && t >= T.hit && t < T.hit + 0.35 ? 5 * Math.sin((t - T.hit) * 50) * (1 - (t - T.hit) / 0.35) : 0;
      g.bar.setAttribute('transform', dy || shake ? `translate(${shake} ${dy})` : '');
      g.bar.setAttribute('opacity', o1);
      pop(g.ok, t, gateT(k) + 0.2, g.x, LANE);
    });

    // Projet
    const tx = tokenX(t);
    pop(S.token, t, T.token, tx, LANE);
    const tt = S.token.getAttribute('transform') || '';
    S.token.setAttribute('transform', `${tt} translate(${tx} ${LANE})`);

    // La solution : part vers l'action, bute sur la première porte, retombe au sol
    const land = { x: 84, y: 660 };
    const start = { x: CX[0] + 10, y: 468 }, hit = { x: GX[0] - 28, y: 468 };
    let sx = land.x, sy = land.y, so = o;
    if (live) {
      if (t < T.sol) so = 0;
      else if (t < T.hit) {
        const p = prog(t, T.sol, T.hit - T.sol);
        sx = start.x + (hit.x - start.x) * easeOut(p);
        sy = start.y - 36 * Math.sin(Math.PI * p);
        so = clamp(p / 0.2);
      } else {
        const p = easeInOut(prog(t, T.hit + 0.15, T.land - T.hit - 0.15));
        const s = t - T.hit;
        const rebound = s < 0.15 ? -12 * Math.sin(Math.PI * s / 0.15) : 0;
        sx = hit.x + rebound + (land.x - hit.x) * p;
        sy = hit.y + (land.y - hit.y) * p;
        so = 1;
      }
    }
    S.sol.setAttribute('transform', `translate(${sx} ${sy})`);
    S.sol.setAttribute('opacity', so);
    pop(S.solLab, t, T.land, 112 + S.solLabW / 2, 660);
    const xs = live ? prog(t, T.land + 0.15, 0.3) : 1;
    S.solX.setAttribute('transform', `translate(${112 + S.solLabW - 4} 644) scale(${xs <= 0 ? 0.001 : 0.6 + 0.4 * G.back(xs)})`);
    S.solX.setAttribute('opacity', live ? clamp(xs / 0.4) : o);
    S.solCap.setAttribute('opacity', live ? clamp(prog(t, T.land + 0.3, 0.3)) : o);
    pop(S.legend, t, gateT(0) + 0.3, 1000, 662);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
