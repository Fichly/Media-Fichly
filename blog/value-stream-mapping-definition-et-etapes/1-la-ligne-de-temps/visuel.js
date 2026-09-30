// Blog · Value Stream Mapping · section « Une VSM, ou cartographie des flux, c'est quoi exactement »
// Mécanique : les deux flux superposés, puis la ligne de temps que la pièce dessine en avançant. La commande part du
// client et remonte de droite à gauche en haut ; la pièce avance de gauche à droite en bas. Chaque attente dans un
// stock trace un long segment bas (en jours), chaque passage en machine un court segment haut (en minutes).
// Totaux : 5 minutes de valeur ajoutée, 3 jours de traversée (chiffres de l'introduction de l'article).
// Hypothèse : répartition par poste (1 + 3 + 1 min ; 1 + 1,5 + 0,5 j), segments non proportionnels (comme sur une VSM).
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  // ---------- Symboles VSM ----------
  function factory(parent, cx, by, w = 92, h = 58) {
    const g = el('g', {}, parent);
    const L = cx - w / 2, R = cx + w / 2, t = by - h, m = by - h * 0.55;
    el('path', { d: `M ${L} ${by} L ${L} ${m} L ${L + w / 3} ${t} L ${L + w / 3} ${m} L ${L + 2 * w / 3} ${t} L ${L + 2 * w / 3} ${m} L ${R} ${t} L ${R} ${by} Z`, fill: C.white, stroke: C.blue, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function triangle(parent, cx, by, s = 50) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - s / 2} ${by} L ${cx} ${by - s * 0.88} L ${cx + s / 2} ${by} Z`, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    text(g, cx, by - 9, 'I', { size: 20, weight: 800, fill: C.tYellow, anchor: 'middle' });
    return g;
  }
  function pushArrow(parent, x1, x2, y) {
    const g = el('g', {}, parent);
    const hx = x2 - 16;
    el('rect', { x: x1, y: y - 7, width: hx - x1, height: 14, fill: C.ink }, g);
    for (let x = x1 + 5; x < hx - 6; x += 12) el('rect', { x, y: y - 5, width: 5, height: 10, fill: C.white }, g);
    el('path', { d: `M ${hx} ${y - 14} L ${x2} ${y} L ${hx} ${y + 14} Z`, fill: C.ink }, g);
    return g;
  }
  function zigzag(x1, x2, y) {
    const m = (x1 + x2) / 2;
    const d = Math.sign(x2 - x1);
    return `M ${x1} ${y} L ${m - 10 * d} ${y} L ${m + 8 * d} ${y - 18} L ${m + 8 * d} ${y} L ${x2} ${y}`;
  }
  function doc(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -13, y: -16, width: 26, height: 32, rx: 3, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, g);
    [-7, -1, 5].forEach(dy => el('line', { x1: -7, y1: dy, x2: 7, y2: dy, stroke: C.blue, 'stroke-width': 2, 'stroke-linecap': 'round' }, g));
    return g;
  }

  // ---------- Géométrie ----------
  const SEG = [
    { kind: 'low', x0: 80, x1: 280, lab: `1${NB}j` },
    { kind: 'high', x0: 280, x1: 360, lab: `1${NB}min`, post: 'Poste 1' },
    { kind: 'low', x0: 360, x1: 560, lab: `1,5${NB}j` },
    { kind: 'high', x0: 560, x1: 640, lab: `3${NB}min`, post: 'Poste 2' },
    { kind: 'low', x0: 640, x1: 840, lab: `0,5${NB}j` },
    { kind: 'high', x0: 840, x1: 920, lab: `1${NB}min`, post: 'Poste 3' },
  ];
  const YH = 624, YL = 684;            // niveaux haut (transformation) et bas (attente) de la ligne de temps
  const PY = 408, PH = 54, DH = 48;     // boîtes processus et données
  const TRI_BY = 470;
  // Chronologie de la pièce : durée de chaque segment
  const DUR = [1.3, 0.45, 1.7, 0.45, 0.8, 0.45];
  const T_PIECE = 4.9, JUMP = 0.3;
  const segT = [];
  { let t = T_PIECE; SEG.forEach((s, i) => { segT.push({ t0: t, t1: t + DUR[i] }); t += DUR[i] + JUMP; }); }
  const T_OUT = segT[5].t1 + 0.05, T_TOT = T_OUT + 0.6, CHUTE_T = T_TOT + 1.1;
  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Le temps où', 'il ne se passe rien.', { size: 48 });
    G.blogChapeau('Flux d’information en haut, flux physique en bas, ligne de temps tout en bas.');
    G.card(40, 176, 1120, 584);

    // ----- Flux d'information -----
    S.info = el('g');
    factory(S.info, 110, 280);
    text(S.info, 110, 304, 'Fournisseur', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
    factory(S.info, 1080, 280);
    text(S.info, 1080, 304, 'Client', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
    el('rect', { x: 510, y: 214, width: 180, height: 52, rx: 8, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, S.info);
    text(S.info, 600, 247, 'Planification', { size: 19, weight: 700, fill: C.blue, anchor: 'middle' });
    S.arrCmd = G.arrow(S.info, zigzag(1022, 700, 240), { width: 2.5 });
    S.arrPrev = G.arrow(S.info, zigzag(500, 166, 240), { width: 2.5 });
    text(S.info, 950, 226, 'commandes', { size: 16, weight: 500, fill: C.blue, anchor: 'middle' });
    text(S.info, 250, 226, 'prévisions', { size: 16, weight: 500, fill: C.blue, anchor: 'middle' });
    S.arrOF = [320, 600, 880].map(x => G.arrow(S.info, `M 600 268 Q ${x} 290 ${x} ${PY - 8}`, { width: 2, head: 9 }));
    text(S.info, 614, 340, 'ordres de fabrication', { size: 16, weight: 500, fill: C.blue });

    // ----- Flux physique -----
    S.phys = el('g');
    S.tris = [180, 460, 740].map(cx => triangle(S.phys, cx, TRI_BY));
    S.boxes = SEG.filter(s => s.kind === 'high').map((s, i) => {
      const cx = (s.x0 + s.x1) / 2;
      const g = el('g', {}, S.phys);
      el('rect', { x: cx - 64, y: PY, width: 128, height: PH, rx: 6, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
      text(g, cx, PY + 34, s.post, { size: 19, weight: 700, fill: C.blue, anchor: 'middle' });
      el('rect', { x: cx - 64, y: PY + PH + 6, width: 128, height: DH, rx: 4, fill: C.white, stroke: C.line, 'stroke-width': 2 }, g);
      text(g, cx, PY + PH + 37, `C/T ${s.lab}`, { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
      return { g, cx };
    });
    S.push = [pushArrow(S.phys, 386, 432, 440), pushArrow(S.phys, 666, 712, 440)];
    S.inArrow = G.arrow(S.phys, 'M 110 312 Q 110 440 150 446', { width: 2.5, head: 9 });
    S.outArrow = G.arrow(S.phys, 'M 946 440 Q 1080 440 1080 316', { width: 2.5, head: 9 });

    // ----- Ligne de temps -----
    S.tlLab = el('g');
    text(S.tlLab, 80, 594, 'Ligne de temps', { size: 19, weight: 700, fill: C.ink });
    fit(text(S.tlLab, 80, 624, 'haut : transformée', { size: 16, weight: 700, fill: C.tGreen }), 270, 'légende haut');
    fit(text(S.tlLab, 80, 646, 'bas : en attente', { size: 16, weight: 700, fill: C.tRed }), 270, 'légende bas');
    const pts = [];
    SEG.forEach(s => { const y = s.kind === 'high' ? YH : YL; pts.push([s.x0, y], [s.x1, y]); });
    S.segs = SEG.map((s, i) => {
      const y = s.kind === 'high' ? YH : YL;
      const line = el('line', { x1: s.x0, y1: y, x2: s.x0, y2: y, stroke: s.kind === 'high' ? C.green : C.red, 'stroke-width': 6, 'stroke-linecap': 'round' });
      const conn = i ? el('line', { x1: s.x0, y1: YH, x2: s.x0, y2: YL, stroke: C.ink, 'stroke-width': 2, opacity: 0.5 }) : null;
      const lab = text(G.svg, (s.x0 + s.x1) / 2, s.kind === 'high' ? YH - 14 : YL + 30, s.lab, { size: 19, weight: 700, fill: s.kind === 'high' ? C.tGreen : C.tRed, anchor: 'middle' });
      return { ...s, y, line, conn, lab };
    });
    // Totaux
    S.tot = el('g');
    el('line', { x1: 940, y1: 590, x2: 940, y2: 716, stroke: C.line, 'stroke-width': 2 }, S.tot);
    text(S.tot, 960, YH - 10, 'Valeur ajoutée', { size: 17, weight: 500, fill: C.tGreen });
    text(S.tot, 960, YH + 20, `5${NB}minutes`, { size: 24, weight: 800, fill: C.tGreen });
    text(S.tot, 960, YL - 4, 'Délai de traversée', { size: 17, weight: 500, fill: C.tRed });
    text(S.tot, 960, YL + 26, `3${NB}jours`, { size: 24, weight: 800, fill: C.tRed });

    // Pièce et commande en mouvement
    S.order = doc(G.svg);
    S.piece = G.carton(G.svg, 0, 0, 0.8);

    S.chute = G.blogChute('Un tableur additionne, une carte fait voir une proportion.', { y: 806 });
  }

  // Position de la pièce : dans le triangle pendant l'attente, dans la boîte pendant la transformation
  function piecePos(i) {
    const s = SEG[i];
    const cx = (s.x0 + s.x1) / 2;
    return s.kind === 'low' ? { x: cx, y: TRI_BY - 60 } : { x: cx, y: PY - 20 };
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;

    // Flux d'information : les symboles, puis la commande qui remonte
    S.info.setAttribute('opacity', fo * (live ? clamp(prog(t, 1.7, 0.4)) : 1));
    S.arrCmd.draw(live ? easeInOut(prog(t, 2.2, 0.7)) : 1);
    S.arrPrev.draw(live ? easeInOut(prog(t, 2.95, 0.7)) : 1);
    S.arrOF.forEach((a, i) => a.draw(live ? easeInOut(prog(t, 3.6 + 0.1 * i, 0.5)) : 1));
    // Document de commande : du client à la planification, puis vers le fournisseur
    let ox = 0, oy = 240, oo = 0;
    if (live && t >= 2.2 && t < 3.75) {
      if (t < 2.9) ox = 1022 + (700 - 1022) * easeInOut(prog(t, 2.2, 0.7));
      else if (t < 2.95) ox = 700;
      else { ox = 500 + (166 - 500) * easeInOut(prog(t, 2.95, 0.7)); }
      oy = 212;
      oo = Math.min(clamp((t - 2.2) / 0.15), clamp((3.75 - t) / 0.15));
    }
    S.order.setAttribute('transform', `translate(${ox} ${oy})`);
    S.order.setAttribute('opacity', oo);

    // Flux physique
    S.tris.forEach((g, i) => pop(g, t, 4.0 + 0.12 * i, [180, 460, 740][i], TRI_BY - 20));
    S.boxes.forEach((b, i) => pop(b.g, t, 4.06 + 0.12 * i, b.cx, PY + 50));
    S.push.forEach((g, i) => g.setAttribute('opacity', fo * (live ? clamp(prog(t, 4.4 + 0.1 * i, 0.3)) : 1)));
    S.inArrow.draw(live ? easeInOut(prog(t, 4.3, 0.4)) : 1);
    S.outArrow.draw(live ? easeInOut(prog(t, T_OUT - 0.1, 0.4)) : 1);
    S.phys.setAttribute('opacity', fo);

    // Ligne de temps dessinée par la pièce
    S.tlLab.setAttribute('opacity', fo * (live ? clamp(prog(t, T_PIECE - 0.3, 0.3)) : 1));
    S.segs.forEach((s, i) => {
      const { t0, t1 } = segT[i];
      const p = live ? prog(t, t0, t1 - t0) : 1;
      s.line.setAttribute('x2', s.x0 + (s.x1 - s.x0) * p);
      s.line.setAttribute('opacity', fo * (live && t < t0 ? 0 : 1));
      if (s.conn) s.conn.setAttribute('opacity', 0.5 * fo * (live && t < t0 ? 0 : 1));
      s.lab.setAttribute('opacity', fo * (live ? clamp(prog(t, t1 - 0.1, 0.25)) : 1));
    });

    // La pièce
    let px = 0, py = 0, po = 0;
    if (live && t >= T_PIECE - 0.4 && t < T_OUT + 0.5) {
      po = 1;
      const first = segT[0];
      if (t < first.t0) { const q = easeInOut(prog(t, T_PIECE - 0.4, 0.4)); px = 110 + (180 - 110) * q; py = 316 + (TRI_BY - 60 - 316) * q; po = clamp((t - T_PIECE + 0.4) / 0.15); }
      else {
        for (let i = 0; i < SEG.length; i++) {
          const { t0, t1 } = segT[i];
          const a = piecePos(i);
          if (t >= t0 && t < t1) { px = a.x; py = a.y; break; }
          if (t >= t1 && (i === SEG.length - 1 || t < segT[i + 1].t0)) {
            const b = i === SEG.length - 1 ? { x: 1080, y: 330 } : piecePos(i + 1);
            const q = easeInOut(prog(t, t1, i === SEG.length - 1 ? 0.5 : JUMP));
            px = a.x + (b.x - a.x) * q; py = a.y + (b.y - a.y) * q - 30 * Math.sin(Math.PI * q);
            if (i === SEG.length - 1) po = 1 - clamp((t - T_OUT) / 0.5);
            break;
          }
        }
      }
      // Petite secousse en machine
      const hi = SEG.findIndex((s, i) => s.kind === 'high' && t >= segT[i].t0 && t < segT[i].t1);
      if (hi >= 0) py += -3 * Math.abs(Math.sin((t - segT[hi].t0) * 30));
    }
    S.piece.setAttribute('transform', `translate(${px} ${py})`);
    S.piece.setAttribute('opacity', po);

    pop(S.tot, t, T_TOT, 1040, 650);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
