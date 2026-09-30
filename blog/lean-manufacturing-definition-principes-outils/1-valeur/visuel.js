// Blog · Lean Manufacturing · section « Qu'est-ce que le Lean Manufacturing ? Définition »
// Mécanique : la commande passe par six opérations ; le client regarde chacune et se demande s'il la paierait.
// Usiner, assembler, emballer : oui (vert). Déplacer une palette, attendre une validation, reprendre une pièce
// ratée : non (rouge). Les opérations sans valeur tombent dans la zone rouge, leur place reste vide dans le parcours.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const TW = 148, TH = 132, TY = 292, PITCH = 158;
  const SX = k => 64 + PITCH * k;
  const DROP_DY = 602 - TY;
  const CLIENT = { cx: 1085, floor: 424 };
  const RAIL_Y = 452;
  const OPS = [
    { lines: ['Usiner'], ok: true, icon: 'machine' },
    { lines: ['Déplacer une', 'palette'], ok: false, icon: 'palette' },
    { lines: ['Attendre une', 'validation'], ok: false, icon: 'sablier' },
    { lines: ['Assembler'], ok: true, icon: 'assembler' },
    { lines: ['Reprendre une', 'pièce ratée'], ok: false, icon: 'reprise' },
    { lines: ['Emballer'], ok: true, icon: 'carton' },
  ];

  // ---------- Pictos (centrés sur cx, cy) ----------
  const ICONS = {
    machine: (g, cx, cy) => G.machine(g, cx - 36, cy - 25, 0.4),
    palette: (g, cx, cy) => {
      el('rect', { x: cx - 34, y: cy + 16, width: 68, height: 7, rx: 2, fill: C.ink }, g);
      [-30, -3, 24].forEach(dx => el('rect', { x: cx + dx, y: cy + 23, width: 6, height: 6, fill: C.ink }, g));
      G.carton(g, cx - 15, cy + 2, 0.85); G.carton(g, cx + 15, cy + 2, 0.85); G.carton(g, cx, cy - 25, 0.85);
      [[-6, 18], [6, 12]].forEach(([dy, w]) => el('line', { x1: cx - 44 - w, y1: cy + dy, x2: cx - 42, y2: cy + dy, stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round' }, g));
    },
    sablier: (g, cx, cy) => {
      el('rect', { x: cx - 22, y: cy - 30, width: 44, height: 6, rx: 3, fill: C.blue }, g);
      el('rect', { x: cx - 22, y: cy + 24, width: 44, height: 6, rx: 3, fill: C.blue }, g);
      el('path', { d: `M ${cx - 16} ${cy - 24} L ${cx + 16} ${cy - 24} L ${cx + 3} ${cy} L ${cx + 16} ${cy + 24} L ${cx - 16} ${cy + 24} L ${cx - 3} ${cy} Z`, fill: C.white, stroke: C.blue, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      el('path', { d: `M ${cx - 9} ${cy - 16} L ${cx + 9} ${cy - 16} L ${cx} ${cy - 5} Z`, fill: C.yellow }, g);
      el('path', { d: `M ${cx - 12} ${cy + 22} L ${cx + 12} ${cy + 22} L ${cx} ${cy + 11} Z`, fill: C.yellow }, g);
    },
    assembler: (g, cx, cy) => {
      el('rect', { x: cx - 33, y: cy - 17, width: 30, height: 34, rx: 6, fill: C.blue }, g);
      el('rect', { x: cx - 5, y: cy - 7, width: 12, height: 14, rx: 2, fill: C.blue }, g);
      el('rect', { x: cx + 5, y: cy - 17, width: 30, height: 34, rx: 6, fill: C.lightBlue }, g);
    },
    reprise: (g, cx, cy) => {
      G.carton(g, cx - 4, cy + 6, 1.15);
      G.cross(g, cx + 18, cy - 14, 11);
      G.arrow(g, `M ${cx - 30} ${cy + 4} A 26 26 0 0 1 ${cx - 12} ${cy - 24}`, { width: 3, head: 7 });
    },
    carton: (g, cx, cy) => {
      el('rect', { x: cx - 30, y: cy - 22, width: 60, height: 46, rx: 6, fill: C.yellow }, g);
      el('rect', { x: cx - 5, y: cy - 22, width: 10, height: 46, fill: C.white, 'fill-opacity': 0.75 }, g);
      el('line', { x1: cx - 30, y1: cy - 8, x2: cx + 30, y2: cy - 8, stroke: C.tYellow, 'stroke-width': 2, 'stroke-opacity': 0.4 }, g);
    },
  };

  function person(parent, cx, floor, k = 1.2) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 62 * k, r: 14 * k, fill: C.blue }, g);
    el('path', { d: `M ${cx - 24 * k} ${floor} L ${cx - 24 * k} ${floor - 22 * k} Q ${cx - 24 * k} ${floor - 42 * k} ${cx} ${floor - 42 * k} Q ${cx + 24 * k} ${floor - 42 * k} ${cx + 24 * k} ${floor - 22 * k} L ${cx + 24 * k} ${floor} Z`, fill: C.blue }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('La valeur,', 'vue par le client.');
    G.blogChapeau(`Une opération a de la valeur si le client accepterait de la payer en la voyant.`);

    G.card(40, 176, 1120, 584);
    // Zone rouge (fond fixe) : ce que le client ne paierait pas
    el('rect', { x: 64, y: 524, width: 1072, height: 222, rx: 18, fill: C.pRed });

    S.head = el('g');
    G.pill(S.head, 64, 226, 'Le parcours de la commande', { size: 19, h: 34 });

    // Rail du flux, jusqu'au client
    S.rail = G.arrow(G.svg, `M ${SX(0)} ${RAIL_Y} L ${CLIENT.cx - 40} ${RAIL_Y}`, { stroke: C.line, width: 5, head: 12 });

    // Client et sa question
    S.client = el('g');
    person(S.client, CLIENT.cx, CLIENT.floor);
    text(S.client, CLIENT.cx, CLIENT.floor + 30, 'Client', { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });
    S.bubble = el('g');
    el('rect', { x: 944, y: 204, width: 206, height: 52, rx: 16, fill: C.blue }, S.bubble);
    el('path', { d: `M ${CLIENT.cx - 10} 255 L ${CLIENT.cx} 286 L ${CLIENT.cx + 12} 255 Z`, fill: C.blue }, S.bubble);
    fit(text(S.bubble, 1047, 238, `Je paierais ça${NB}?`, { size: 20, weight: 700, fill: C.white, anchor: 'middle' }), 1146, 'bulle', 948);

    // Places vides laissées par les opérations sans valeur
    S.ghosts = OPS.map((o, k) => o.ok ? null : el('rect', { x: SX(k), y: TY, width: TW, height: TH, rx: 16, fill: 'none', stroke: C.red, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', opacity: 0 }));

    // Opérations : groupe externe (chute), groupe interne (apparition)
    S.ops = OPS.map((o, k) => {
      const x = SX(k), cx = x + TW / 2;
      const outer = el('g');
      const inner = el('g', {}, outer);
      const box = el('rect', { x, y: TY, width: TW, height: TH, rx: 16, fill: C.white, stroke: C.line, 'stroke-width': 2.5 }, inner);
      ICONS[o.icon](inner, cx, TY + 50);
      const ly = o.lines.length === 1 ? [TY + 111] : [TY + 101, TY + 122];
      o.lines.forEach((s, i) => fit(text(inner, cx, ly[i], s, { size: 18, weight: 700, fill: C.ink, anchor: 'middle' }), x + TW - 2, `libellé ${k}`, x + 2));
      const verdict = el('g', {}, outer);
      (o.ok ? G.check : G.cross)(verdict, cx, TY, 19);
      return { ...o, k, x, cx, outer, inner, box, verdict };
    });

    // Regard du client vers l'opération observée
    S.sight = S.ops.map(o => {
      const x0 = CLIENT.cx - 20, y0 = CLIENT.floor - 78;
      const p = el('path', { d: `M ${x0} ${y0} Q ${(x0 + o.cx) / 2} 150 ${o.cx} ${TY - 26}`, fill: 'none', stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '6 6', 'stroke-linecap': 'round', opacity: 0 });
      return p;
    });

    // La commande qui circule
    S.piece = G.carton(G.svg, 0, 0, 0.9);

    // Légendes
    S.okLabel = el('g');
    G.pill(S.okLabel, 64, 490, 'Le client paierait : valeur', { size: 19, h: 34, bg: C.pGreen, fg: C.tGreen, icon: 'check' });
    S.noLabel = el('g');
    const nl = text(S.noLabel, 88, 560, 'Le client ne paierait pas', { size: 21, weight: 700, fill: C.tRed });
    fit(text(S.noLabel, 1112, 560, 'des ressources consommées sans valeur pour lui', { size: 18, weight: 500, fill: C.tRed, anchor: 'end' }), 1112, 'légende rouge', measure(nl).x + measure(nl).width + 20);

    S.chute = G.blogChute('La valeur se définit du point de vue du client.', { y: 806 });
  }

  // ---------- Chronologie ----------
  const TA = k => 3.5 + 0.95 * k;          // la commande arrive sous l'opération k
  const TV = k => TA(k) + 0.4;             // verdict du client
  const DELIVER = TA(5) + 0.95;            // arrivée chez le client
  const RED = OPS.map((o, k) => k).filter(k => !OPS[k].ok);
  const DROP = k => 9.7 + 0.25 * RED.indexOf(k);
  const DROP_D = 0.65;

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    pop(S.head, t, 1.7, 200, 226);
    pop(S.client, t, 2.2, CLIENT.cx, CLIENT.floor - 40);
    pop(S.bubble, t, 2.5, 1047, 230);
    S.rail.draw(live ? easeInOut(prog(t, 2.5, 0.6)) : 1);
    S.rail.g.setAttribute('opacity', o0);

    S.ops.forEach((op, k) => {
      pop(op.inner, t, 1.8 + 0.1 * k, op.cx, TY + TH / 2);
      const judged = !live || t >= TV(k);
      op.box.setAttribute('fill', judged ? (op.ok ? C.pGreen : C.white) : C.white);
      op.box.setAttribute('stroke', judged ? (op.ok ? C.green : C.red) : C.line);
      op.box.setAttribute('stroke-width', judged ? 3.5 : 2.5);
      pop(op.verdict, t, TV(k), op.cx, TY);
      // Chute des opérations sans valeur
      let dy = 0;
      if (!op.ok) {
        dy = live ? DROP_DY * easeInOut(prog(t, DROP(k), DROP_D)) : DROP_DY;
        const g = S.ghosts[k];
        g.setAttribute('opacity', live ? clamp(prog(t, DROP(k) + 0.1, 0.3)) : o0);
      }
      op.outer.setAttribute('transform', dy ? `translate(0 ${dy})` : '');
      // Regard du client pendant le jugement
      S.sight[k].setAttribute('opacity', live ? G.window01(t, TA(k) - 0.1, TV(k) + 0.35, 0.15) : 0);
      if (live && t >= TV(k) - 0.1 && t < TV(k) + 0.5) pulse(S.bubble, t, TV(k) - 0.1, 1047, 230, 0.06, 0.35);
    });

    // La commande avance le long du rail, s'arrête sous chaque opération, puis part chez le client
    let px = null;
    if (live && t >= TA(0) - 0.6 && t < DELIVER + 0.3) {
      const stops = [SX(0) + 14, ...S.ops.map(o => o.cx), CLIENT.cx - 46];
      const times = [TA(0) - 0.6, ...S.ops.map((o, k) => TA(k)), DELIVER];
      px = stops[stops.length - 1];
      for (let i = 0; i < stops.length - 1; i++) {
        const a = times[i + 1] - 0.5;
        if (t < a) { px = stops[i]; break; }
        if (t < times[i + 1]) { px = stops[i] + (stops[i + 1] - stops[i]) * easeInOut(prog(t, a, 0.5)); break; }
      }
      S.piece.setAttribute('transform', `translate(${px} ${RAIL_Y - 2})`);
      S.piece.setAttribute('opacity', Math.min(clamp(prog(t, TA(0) - 0.6, 0.25)), 1 - clamp(prog(t, DELIVER, 0.3))));
    } else S.piece.setAttribute('opacity', 0);

    rise(S.noLabel, t, DROP(RED[0]) - 0.2, 0.4);
    rise(S.okLabel, t, DROP(RED[2]) + DROP_D + 0.2, 0.4);
    rise(S.chute, t, 11.9, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
