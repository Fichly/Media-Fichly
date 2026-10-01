// Fiche LinkedIn · Hugo Duc · mercredi 7 octobre 2026
// Post : « Certains gaspillages ont un budget. D'autres ont un poste de travail. Parfois même un responsable. »
// Premier commentaire du post (Buffer) : toutes les ressources Lean du site → encart.
// Le visuel est la pièce maîtresse : l'organigramme de l'atelier. Les quatre contournements du post
// y prennent place et reçoivent leur tampon officiel (budget, poste, créneau, responsable) : tout
// semble organisé. Puis la loupe passe et chaque carte se retourne : derrière, la cause qu'elle
// compense, qui attend toujours (sablier qui coule).
// Style propre : l'organigramme et les cartes qui se retournent. Image t = 0 = état final. Boucle de 13 s.
(() => {
  const D = window.DA;
  const { C, el, text, fit } = D;

  // ---------- Outils de mouvement de cette fiche ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (t, s, d) => clamp((t - s) / d);
  const lerp = (a, b, p) => a + (b - a) * p;
  const easeIn = p => p * p;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const easeInOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const popScale = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * back(p));
  const mod = (a, n) => ((a % n) + n) % n;
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', RED_SOFT = '#c25b5b';

  // ---------- Mise en page ----------
  const FRAME = { x: 60, y: 410, w: 960, h: 740 };
  const NODE = { cx: 540, y: 500, w: 250, h: 62 };
  const BUS_Y = 606, CARD_Y = 642, CW = 210, CH = 440;
  const CX = [195, 425, 655, 885];

  const ITEMS = [
    { icon: 'stock', name: ['Le stock', 'tampon'], detail: 'entre deux ateliers', stamp: 'BUDGÉTÉ', head: ['Stock tampon'], cause: ['Le problème', 'qu’il absorbe'] },
    { icon: 'retouche', name: ['Le poste', 'de retouche'], detail: 'en bout de ligne', stamp: 'POSTE DÉDIÉ', head: ['Poste de retouche'], cause: ['Les défauts', 'qu’il répare'] },
    { icon: 'reunion', name: ['La réunion', 'de crise'], detail: 'chaque semaine', stamp: 'PLANIFIÉE', head: ['Réunion de crise'], cause: ['L’urgence', 'devenue', 'hebdomadaire'] },
    { icon: 'chariot', name: ['Le chariot', 'de dépannage'], detail: `«${NB}au cas où${NB}»`, stamp: 'RESPONSABLE', head: ['Chariot', 'de dépannage'], cause: ['L’appro qui', 'ne suit pas'] },
  ];

  // ---------- Chronologie (s) ----------
  const DURATION = 13;
  const T_OUT = 1.2, OUT_DUR = 0.3;                 // l'image finale s'efface, puis tout se reconstruit
  const T_P = [1.6, 5.9, 9.6];                      // pastilles d'étape
  const T_NODE = 1.7, T_LINES = 1.95, LINES_DUR = 0.45;
  const T_CARD = [2.35, 2.6, 2.85, 3.1];
  const T_STAMP = [3.75, 4.15, 4.55, 4.95];
  const T_OK = 5.35;                                // « tout est organisé »
  const T_FLIP = [6.5, 7.3, 8.1, 8.9], FLIP = 0.5;
  const T_LENS_IN = 6.0, T_LENS_OUT = 9.5;
  const SAND = DURATION / 4;                        // sablier : 3,25 s par retournement (boucle exacte)

  // ---------- Pictos (blancs sur le disque bleu, repère centré, échelle 1) ----------
  const ICONS = {
    stock(g) {
      const boxes = [[-11, 7], [11, 7], [0, -13]].map(([x, y]) => {
        const b = el('g', {}, g);
        el('rect', { x: x - 10, y: y - 10, width: 20, height: 20, rx: 4, fill: C.white }, b);
        el('line', { x1: x - 5, y1: y - 3, x2: x + 5, y2: y - 3, stroke: C.blue, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, b);
        return b;
      });
      return u => boxes.forEach((b, k) => {   // les cartons tombent un par un
        const p = prog(u, 0.15 + 0.12 * k, 0.28);
        b.setAttribute('transform', p >= 1 ? '' : `translate(0 ${f2(-26 * (1 - easeIn(p)))})`);
        b.setAttribute('opacity', f2(clamp(p * 3)));
      });
    },
    retouche(g) {
      const w = el('g', {}, g);
      const r = el('g', { transform: 'rotate(45)' }, w);
      el('rect', { x: -4.5, y: -6, width: 9, height: 30, rx: 4.5, fill: C.white }, r);
      el('circle', { cx: 0, cy: -12, r: 12, fill: C.white }, r);
      el('rect', { x: -4.5, y: -27, width: 9, height: 14, rx: 2, fill: C.blue }, r);
      return u => {                            // deux petits coups de clé
        const k = Math.max(0, Math.sin(Math.PI * clamp((u - 0.2) / 0.3))) + Math.max(0, Math.sin(Math.PI * clamp((u - 0.55) / 0.3)));
        w.setAttribute('transform', k ? `rotate(${f2(-24 * k)})` : '');
      };
    },
    reunion(g) {
      el('rect', { x: -19, y: -14, width: 38, height: 32, rx: 6, fill: C.white }, g);
      [-10, 10].forEach(x => el('rect', { x: x - 2.5, y: -21, width: 5, height: 11, rx: 2.5, fill: C.white, stroke: C.blue, 'stroke-width': 2 }, g));
      let red;
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
        const isRed = r === 1 && c === 2;
        const n = el('rect', { x: -13 + c * 10, y: -1 + r * 9, width: 6, height: 6, rx: 1.5, fill: isRed ? C.red : C.blue }, g);
        if (isRed) red = n;
      }
      return u => {                            // la case de crise clignote
        const p = prog(u, 0.2, 0.8);
        red.setAttribute('opacity', p > 0 && p < 1 && Math.floor(p * 4) % 2 === 0 ? 0.15 : 1);
      };
    },
    chariot(g) {
      const c = el('g', {}, g);
      el('path', { d: 'M -24 -18 L -18 -11', stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round' }, c);
      el('path', { d: 'M -18 -11 L 19 -11 L 14 7 L -13 7 Z', fill: C.white, 'stroke-linejoin': 'round', stroke: C.white, 'stroke-width': 3 }, c);
      [-8, 0, 8].forEach(x => el('line', { x1: x, y1: -6, x2: x, y2: 2, stroke: C.blue, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, c));
      const wheels = [-8, 9].map(x => {
        const w = el('g', {}, c);
        el('circle', { cx: 0, cy: 0, r: 4.5, fill: C.white }, w);
        el('line', { x1: -2.5, y1: 0, x2: 2.5, y2: 0, stroke: C.blue, 'stroke-width': 1.6 }, w);
        return { w, x };
      });
      return u => {                            // il arrive en roulant
        const p = easeOut(prog(u, 0.15, 0.5));
        const dx = -22 * (1 - p);
        c.setAttribute('transform', dx ? `translate(${f2(dx)} 0)` : '');
        wheels.forEach(({ w, x }) => w.setAttribute('transform', `translate(${x} 15) rotate(${f2(dx * 9)})`));
      };
    },
  };

  // Sablier rouge qui coule (dos des cartes) ; renvoie une fonction d'animation
  function hourglass(parent, cx, cy, id, k = 1.25) {
    const g = el('g', { transform: `translate(${cx} ${cy}) scale(${k})` }, parent);
    const body = el('g', {}, g);
    const defs = D.svg.querySelector('defs');
    const cpT = el('clipPath', { id: `${id}t` }, defs), cpB = el('clipPath', { id: `${id}b` }, defs);
    const topR = el('rect', { x: -30, y: -32, width: 60, height: 32 }, cpT);
    const botR = el('rect', { x: -30, y: 32, width: 60, height: 0 }, cpB);
    el('path', { d: 'M -20 -34 C -20 -12, -4 -6, -4 0 C -4 6, -20 12, -20 34 L 20 34 C 20 12, 4 6, 4 0 C 4 -6, 20 -12, 20 -34 Z', fill: C.white, stroke: C.tRed, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, body);
    el('path', { d: 'M -17 -32 C -17 -12, -3 -6, -3 0 L 3 0 C 3 -6, 17 -12, 17 -32 Z', fill: C.red, 'clip-path': `url(#${id}t)` }, body);
    el('path', { d: 'M -3 0 C -3 6, -17 12, -17 32 L 17 32 C 17 12, 3 6, 3 0 Z', fill: C.red, 'clip-path': `url(#${id}b)` }, body);
    const stream = el('line', { x1: 0, y1: 0, x2: 0, y2: 30, stroke: C.red, 'stroke-width': 2.5 }, body);
    el('rect', { x: -26, y: -41, width: 52, height: 8, rx: 4, fill: C.tRed }, body);
    el('rect', { x: -26, y: 33, width: 52, height: 8, rx: 4, fill: C.tRed }, body);
    const FLOW = SAND - 0.55;
    return (t, off) => {
      const u = mod(t + off, SAND);
      const p = clamp(u / FLOW);
      topR.setAttribute('y', f2(-32 + 32 * p));
      topR.setAttribute('height', f2(32 * (1 - p) + 0.01));
      botR.setAttribute('y', f2(32 - 32 * p));
      botR.setAttribute('height', f2(32 * p + 0.01));
      stream.setAttribute('opacity', u < FLOW ? 1 : 0);
      const r = u >= FLOW ? 180 * easeInOut(prog(u, FLOW, SAND - FLOW)) : 0;   // on le retourne : ça recommence
      body.setAttribute('transform', r ? `rotate(${f2(r)})` : '');
    };
  }

  function pillShape(parent, x, cy, label, { bg, fg, size = 21, h = 42 }) {
    const g = el('g', {}, parent);
    const r = el('rect', { x, y: cy - h / 2, height: h, rx: h / 2, fill: bg }, g);
    const tx = text(g, x + 20, cy + size * 0.36, label, { size, weight: 700, fill: fg });
    r.setAttribute('width', tx.getBBox().width + 40);
    return g;
  }
  const centered = (parent, cx, y, lines, step, opts) => lines.map((l, i) => text(parent, cx, y + i * step, l, { ...opts, anchor: 'middle' }));

  const S = { cards: [] };

  function build() {
    D.template({ author: 'hugo' });
    D.title('Certains gaspillages', 'ont un budget.');
    D.chapeau('Un poste de travail. Parfois même un responsable.');

    // Explication courte au-dessus du visuel
    const line = (y, parts) => {
      const t = el('text', { x: 62, y, 'font-family': 'Poppins', 'font-size': 22, 'font-weight': 500, fill: C.ink });
      parts.forEach(([str, bold]) => { const sp = el('tspan', bold ? { 'font-weight': 700, fill: C.blue } : {}, t); sp.textContent = str; });
      fit(t, 1020, `explication ${y}`);
    };
    line(352, [['Chacun de ces dispositifs a été créé pour ', 0], ['compenser un problème', 1], ['.', 0]]);
    line(384, [['Avec le temps, on ne voit plus le problème : on voit ', 0], ['une organisation', 1], ['.', 0]]);

    const defs = el('defs');
    const lift = el('filter', { id: 'lift', x: '-30%', y: '-20%', width: '160%', height: '150%' }, defs);
    el('feDropShadow', { dx: 0, dy: 10, stdDeviation: 9, 'flood-color': C.ink, 'flood-opacity': 0.2 }, lift);

    // ----- Cadre du visuel -----
    el('rect', { x: FRAME.x, y: FRAME.y, width: FRAME.w, height: FRAME.h, rx: 26, fill: FRAME_BG, stroke: C.line, 'stroke-width': 2 });
    S.scene = el('g');

    // Liens de l'organigramme (tracés depuis le haut)
    const lines = el('g', {}, S.scene);
    const seg = (d, len) => el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': len, 'stroke-dashoffset': len }, lines);
    S.trunk = { n: seg(`M ${NODE.cx} ${NODE.y + NODE.h} V ${BUS_Y}`, BUS_Y - NODE.y - NODE.h), len: BUS_Y - NODE.y - NODE.h };
    S.busL = { n: seg(`M ${NODE.cx} ${BUS_Y} H ${CX[0]}`, NODE.cx - CX[0]), len: NODE.cx - CX[0] };
    S.busR = { n: seg(`M ${NODE.cx} ${BUS_Y} H ${CX[3]}`, CX[3] - NODE.cx), len: CX[3] - NODE.cx };
    S.drops = CX.map(cx => ({ n: seg(`M ${cx} ${BUS_Y} V ${CARD_Y}`, CARD_Y - BUS_Y), len: CARD_Y - BUS_Y }));
    // Liens rouges qui remplacent les bleus quand la carte se retourne
    S.redDrops = CX.map(cx => el('path', { d: `M ${cx} ${BUS_Y + 2} V ${CARD_Y}`, stroke: C.red, 'stroke-width': 4, 'stroke-dasharray': '7 6', opacity: 0 }, lines));

    // Nœud « L'atelier »
    S.node = el('g', {}, S.scene);
    el('rect', { x: NODE.cx - NODE.w / 2, y: NODE.y, width: NODE.w, height: NODE.h, rx: 16, fill: C.blue }, S.node);
    text(S.node, NODE.cx, NODE.y + 40, 'L’atelier', { size: 26, weight: 800, fill: C.white, anchor: 'middle' });
    // Pastille « tout est organisé » à droite du nœud
    S.ok = el('g', {}, S.scene);
    const okx = NODE.cx + NODE.w / 2 + 16, oky = NODE.y + NODE.h / 2;
    const okr = el('rect', { x: okx, y: oky - 19, height: 38, rx: 19, fill: C.pGreen }, S.ok);
    el('circle', { cx: okx + 22, cy: oky, r: 11, fill: C.green }, S.ok);
    el('path', { d: `M ${okx + 16.5} ${oky + 0.5} L ${okx + 20.5} ${oky + 4.5} L ${okx + 27.5} ${oky - 3.5}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.ok);
    const okt = text(S.ok, okx + 42, oky + 6.5, 'Tout est organisé', { size: 18, weight: 700, fill: C.tGreen });
    okr.setAttribute('width', okt.getBBox().width + 58);
    fit(okr, FRAME.x + FRAME.w - 16, 'pastille organisé');

    // ----- Les quatre cartes -----
    ITEMS.forEach((it, i) => {
      const cx = CX[i], x0 = cx - CW / 2, y0 = CARD_Y;
      const g = el('g', {}, S.scene);
      // Recto : le dispositif, tel qu'on le voit
      const front = el('g', {}, g);
      el('rect', { x: x0, y: y0, width: CW, height: CH, rx: 22, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, front);
      el('rect', { x: x0 + 18, y: y0, width: CW - 36, height: 7, rx: 3.5, fill: C.blue }, front);
      el('circle', { cx, cy: y0 + 98, r: 50, fill: C.blue }, front);
      const ig = el('g', { transform: `translate(${cx} ${y0 + 98}) scale(1.5)` }, front);
      const anim = ICONS[it.icon](ig);
      centered(front, cx, y0 + 200, it.name, 30, { size: 24, weight: 800, fill: C.ink }).forEach((n, k) => fit(n, x0 + CW - 12, `carte ${i + 1} nom ${k + 1}`, x0 + 12));
      fit(text(front, cx, y0 + 266, it.detail, { size: 17, weight: 500, fill: MUTED, anchor: 'middle' }), x0 + CW - 12, `carte ${i + 1} détail`, x0 + 12);
      // Tampon officiel
      const stamp = el('g', {}, front);
      const sg = el('g', {}, stamp);
      el('rect', { x: -84, y: -27, width: 168, height: 54, rx: 10, fill: C.blue, 'fill-opacity': 0.06, stroke: C.blue, 'stroke-width': 3 }, sg);
      el('rect', { x: -78, y: -21, width: 156, height: 42, rx: 7, fill: 'none', stroke: C.blue, 'stroke-width': 1.5 }, sg);
      const st = text(sg, 0, 6.5, it.stamp, { size: 17, weight: 800, fill: C.blue, anchor: 'middle' });
      st.setAttribute('letter-spacing', 1.2);
      fit(st, 80, `tampon ${i + 1}`, -80);
      // Verso : la cause qu'il compense
      const backG = el('g', {}, g);
      el('rect', { x: x0, y: y0, width: CW, height: CH, rx: 22, fill: C.pRed, stroke: C.red, 'stroke-width': 2.5 }, backG);
      centered(backG, cx, y0 + 46, it.head, 22, { size: 17, weight: 800, fill: C.tRed }).forEach((n, k) => fit(n, x0 + CW - 12, `verso ${i + 1} titre ${k + 1}`, x0 + 12));
      el('line', { x1: x0 + 26, y1: y0 + 92, x2: x0 + CW - 26, y2: y0 + 92, stroke: C.red, 'stroke-opacity': 0.35, 'stroke-width': 2 }, backG);
      text(backG, cx, y0 + 128, 'compense', { size: 16, weight: 700, fill: RED_SOFT, anchor: 'middle' }).setAttribute('letter-spacing', 1);
      centered(backG, cx, y0 + 168, it.cause, 30, { size: 22, weight: 800, fill: C.tRed }).forEach((n, k) => fit(n, x0 + CW - 12, `verso ${i + 1} cause ${k + 1}`, x0 + 12));
      const sand = hourglass(backG, cx, y0 + 322, `sand${i}`);
      text(backG, cx, y0 + 404, 'attend toujours', { size: 17, weight: 800, fill: C.tRed, anchor: 'middle' });
      // Voile pendant le retournement
      const shade = el('rect', { x: x0, y: y0, width: CW, height: CH, rx: 22, fill: C.ink, opacity: 0 }, g);
      S.cards.push({ g, front, backG, stamp, sg, shade, anim, sand, cx, cy: y0 + CH / 2, sy: y0 + 352 });
    });

    // Loupe
    S.lens = el('g', {}, S.scene);
    el('line', { x1: 24, y1: 24, x2: 50, y2: 50, stroke: C.blue, 'stroke-width': 12, 'stroke-linecap': 'round' }, S.lens);
    el('circle', { cx: 0, cy: 0, r: 34, fill: C.white, 'fill-opacity': 0.35, stroke: C.blue, 'stroke-width': 7 }, S.lens);
    el('path', { d: 'M -18 -6 A 19 19 0 0 1 -5 -19', fill: 'none', stroke: C.white, 'stroke-width': 5, 'stroke-linecap': 'round' }, S.lens);

    // Pastilles d'étape (dans le cadre, en haut à gauche)
    const PY = FRAME.y + 46;
    S.pills = [
      pillShape(D.svg, 92, PY, 'Ce qu’on voit : une organisation', { bg: C.blue, fg: C.white }),
      pillShape(D.svg, 92, PY, 'Qu’est-ce que ça compense ?', { bg: C.blue, fg: C.white }),
      pillShape(D.svg, 92, PY, '4 causes qui attendent toujours', { bg: C.pRed, fg: C.tRed }),
    ];
    S.pills.forEach((p, i) => fit(p, NODE.cx + NODE.w / 2 + 300, `pastille ${i + 1}`));

    D.encart(['Aller plus loin', 'Toutes nos ressources Lean', '(lien en commentaire)']);
  }

  // ---------- Dessin à l'instant t ----------
  function draw(t) {
    const final = t < T_OUT + OUT_DUR;                 // image finale (qui s'efface à partir de T_OUT)
    const fade = final ? 1 - prog(t, T_OUT, OUT_DUR) : 1;
    S.scene.setAttribute('opacity', f2(fade));

    // Nœud et liens
    const pn = final ? 1 : prog(t, T_NODE, 0.4);
    const kn = popScale(pn);
    S.node.setAttribute('transform', kn === 1 ? '' : `translate(${NODE.cx} ${NODE.y + NODE.h / 2}) scale(${f2(kn)}) translate(${-NODE.cx} ${-(NODE.y + NODE.h / 2)})`);
    S.node.setAttribute('opacity', f2(final ? 1 : clamp(pn / 0.4)));
    const lp = final ? 1 : easeInOut(prog(t, T_LINES, LINES_DUR));
    const part = (o, a, b) => o.n.setAttribute('stroke-dashoffset', f2(o.len * (1 - clamp((lp - a) / (b - a)))));
    part(S.trunk, 0, 0.3); part(S.busL, 0.3, 0.75); part(S.busR, 0.3, 0.75);
    S.drops.forEach(d => part(d, 0.75, 1));

    // Pastille « tout est organisé » : après les tampons, jusqu'au premier retournement
    const okIn = final ? 0 : prog(t, T_OK, 0.35), okOut = prog(t, T_FLIP[0], 0.3);
    const kok = popScale(okIn) * (1 - easeIn(okOut));
    S.ok.setAttribute('opacity', f2(clamp(okIn / 0.4) * (1 - okOut)));
    const okc = NODE.cx + NODE.w / 2 + 110, oky = NODE.y + NODE.h / 2;
    S.ok.setAttribute('transform', kok >= 1 ? '' : `translate(${okc} ${oky}) scale(${f2(Math.max(kok, 0.001))}) translate(${-okc} ${-oky})`);

    // Cartes
    S.cards.forEach((c, i) => {
      let o = 1, k = 1, sx = 1, lift = 0, shade = 0, showBack = true, dx = 0;
      if (!final) {
        const pc = prog(t, T_CARD[i], 0.4);
        k = popScale(pc);
        o = clamp(pc / 0.4);
        const pf = prog(t, T_FLIP[i], FLIP);
        showBack = pf >= 0.5;
        if (pf > 0 && pf < 1) { sx = Math.max(0.001, Math.abs(Math.cos(Math.PI * pf))); lift = -12 * Math.sin(Math.PI * pf); shade = 0.18 * Math.sin(Math.PI * pf); }
        // Secousse du tampon qui frappe
        const ps = prog(t, T_STAMP[i] + 0.16, 0.3);
        if (ps > 0 && ps < 1) dx = 4 * Math.sin(ps * Math.PI * 4) * (1 - ps);
      }
      c.g.setAttribute('opacity', f2(o));
      const tf = [];
      if (dx || lift) tf.push(`translate(${f2(dx)} ${f2(lift)})`);
      if (k !== 1 || sx !== 1) tf.push(`translate(${c.cx} ${c.cy}) scale(${f2(k * sx)} ${f2(k)}) translate(${-c.cx} ${-c.cy})`);
      c.g.setAttribute('transform', tf.join(' '));
      if (lift) c.g.setAttribute('filter', 'url(#lift)'); else c.g.removeAttribute('filter');
      c.front.setAttribute('display', showBack ? 'none' : 'inline');
      c.backG.setAttribute('display', showBack ? 'inline' : 'none');
      c.shade.setAttribute('opacity', f2(shade));
      c.anim(final ? 9 : t - T_CARD[i]);
      c.sand(t, 0.8 * i);
      // Tampon : il s'abat sur la carte
      const pst = final ? 1 : prog(t, T_STAMP[i], 0.18);
      const ks = pst <= 0 ? 0.001 : 1 + 0.8 * (1 - easeIn(pst));
      c.stamp.setAttribute('opacity', f2(final ? 1 : clamp(pst / 0.35)));
      c.stamp.setAttribute('transform', `translate(${c.cx} ${c.sy}) rotate(-7) scale(${f2(ks)})`);
      // Lien rouge quand la carte est retournée (il remplace le lien bleu)
      const red = final ? 1 : prog(t, T_FLIP[i] + 0.25, 0.3);
      S.redDrops[i].setAttribute('opacity', f2(red));
      S.drops[i].n.setAttribute('opacity', f2(1 - red));
    });

    // Loupe : arrive, s'arrête sur chaque carte (qui se retourne), puis repart
    let lx = CX[0] - 190, lo = 0;
    if (!final && t >= T_LENS_IN) {
      lo = 1;
      if (t < T_FLIP[0]) lx = lerp(CX[0] - 190, CX[0], easeOut(prog(t, T_LENS_IN, T_FLIP[0] - T_LENS_IN - 0.05)));
      else if (t < T_LENS_OUT) {
        lx = CX[3];
        for (let i = 0; i < 3; i++) {
          if (t < T_FLIP[i + 1]) { lx = lerp(CX[i], CX[i + 1], easeInOut(prog(t, T_FLIP[i] + 0.42, T_FLIP[i + 1] - T_FLIP[i] - 0.47))); break; }
        }
      } else { const p = prog(t, T_LENS_OUT, 0.35); lx = CX[3] + 150 * easeIn(p); lo = 1 - p; }
      lo *= clamp((t - T_LENS_IN) / 0.2);
    }
    const ly = CARD_Y + 118 + (lo ? 4 * Math.sin(t * Math.PI * 2 / 0.8) : 0);
    S.lens.setAttribute('transform', `translate(${f2(lx + 12)} ${f2(ly)})`);
    S.lens.setAttribute('opacity', f2(lo));

    // Pastilles d'étape : l'ancienne sort avant que la nouvelle entre
    S.pills.forEach((g, i) => {
      const a = T_P[i] + (i ? 0.12 : 0);
      let o;
      if (i === 2) o = final ? fade : prog(t, a, 0.25);
      else o = final ? 0 : prog(t, a, 0.25) * (1 - prog(t, T_P[i + 1], 0.14));
      const dy = final ? 0 : 8 * (1 - prog(t, a, 0.25));
      g.setAttribute('opacity', f2(o));
      g.setAttribute('transform', dy ? `translate(0 ${f2(dy)})` : '');
    });
  }

  D.start({ duration: DURATION, build, draw });
})();
