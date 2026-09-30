// Blog · 5 pourquoi · section « Le test qui distingue une cause racine d'une cause-personne »
// Mécanique : le test de la relève appliqué à l'arrêt « L'opérateur ne l'a pas fait ». On remplace l'opérateur par
// un collègue de même compétence et de bonne volonté ; il suit le mode opératoire à la lettre, le contrôle n'y figure
// pas, le défaut revient. La réponse n'était pas une cause : la chaîne redémarre sur « Le contrôle ne figure pas dans
// le mode opératoire ». Les étapes du mode opératoire sont illustratives. Boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const FLOOR = 640;
  const OPX = 372;                       // position de l'opérateur au poste
  const MACH = { x: 446, y: FLOOR - 131, k: 1.05 };
  const TRAY = { x: 668, y: FLOOR - 20 };
  const RC = { x: 776, w: 364 };         // colonne de la chaîne
  const BOX_H = 56;
  const SHEET = { x: 70, y: 206, w: 290 };
  const STEPS = ['Monter l’outil', 'Régler la machine', 'Lancer la série'];
  const T = {
    scene: 1.8, chain: 2.2, test: 3.3, out: 4.0, in: 4.6, steps: [5.6, 6.1, 6.6], slot: 7.1,
    make: 7.6, bad: 8.2, answer: 8.9, strike: 9.5, restart: 10.1, chute: 11.8,
  };

  function rich(parent, x, y, segs, maxW, { size = 18, weight = 500, lh = 1.25, fill = C.ink } = {}) {
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
    const nodes = [];
    lines.forEach((ln, i) => {
      const t = text(g, x, y + i * size * lh, '', { size, weight, fill });
      let run = null;
      ln.forEach((o, j) => {
        const s = (j ? ' ' : '') + o.w;
        if (run && run.f === o.f && run.wt === o.wt) run.node.textContent += s;
        else { const ts = el('tspan', { fill: o.f, 'font-weight': o.wt }, t); ts.textContent = s; run = { f: o.f, wt: o.wt, node: ts }; }
      });
      fit(t, x + maxW + 2, `ligne ${ln.map(o => o.w).join(' ').slice(0, 24)}`);
      nodes.push(t);
    });
    return { g, n: lines.length, nodes };
  }
  function box(y, n, segs, { fill = C.white, stroke = C.line, badge = C.blue, dash = null } = {}) {
    const g = el('g');
    const r = el('rect', { x: RC.x, y, width: RC.w, height: BOX_H, rx: 14, fill, stroke, 'stroke-width': 2 }, g);
    if (dash) r.setAttribute('stroke-dasharray', dash);
    el('circle', { cx: RC.x + 28, cy: y + BOX_H / 2, r: 16, fill: badge }, g);
    text(g, RC.x + 28, y + BOX_H / 2 + 6, String(n), { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
    const rt = rich(g, RC.x + 54, 0, segs, RC.w - 68);
    rt.g.setAttribute('transform', `translate(0 ${rt.n === 1 ? y + BOX_H / 2 + 6.5 : y + BOX_H / 2 - 5})`);
    return { g, cy: y + BOX_H / 2, rt };
  }
  function why(y1, y2, label = 'pourquoi ?') {
    const x = RC.x + 28;
    const g = el('g');
    const a = G.arrow(g, `M ${x} ${y1} L ${x} ${y2}`, { width: 3, head: 8 });
    if (label) text(g, x + 14, (y1 + y2) / 2 + 6, label, { size: 16, weight: 700, fill: C.blue });
    return { g, a };
  }
  function showArrow(w, t, t0, d = 0.3) {
    if (t < FADE_END) { w.a.draw(1); w.g.setAttribute('opacity', fading(t) ? fadeOut(t) : 1); return; }
    const q = prog(t, t0, d);
    w.a.draw(q);
    w.g.setAttribute('opacity', q > 0 ? 1 : 0);
  }
  function person(parent, cx, floor, fill) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 92, r: 18, fill }, g);
    el('path', { d: `M ${cx - 30} ${floor} L ${cx - 30} ${floor - 36} Q ${cx - 30} ${floor - 66} ${cx} ${floor - 66} Q ${cx + 30} ${floor - 66} ${cx + 30} ${floor - 36} L ${cx + 30} ${floor} Z`, fill }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le test', 'de la relève.');
    G.blogChapeau('Si la personne était remplacée demain, le problème disparaîtrait-il ?');

    // ----- Carte gauche : le poste -----
    G.card(40, 176, 700, 584);
    el('line', { x1: 64, y1: FLOOR + 2, x2: 716, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });

    // Mode opératoire (le contrôle n'y figure pas)
    S.sheet = el('g');
    const sh = 52 + STEPS.length * 44 + 70;
    el('rect', { x: SHEET.x, y: SHEET.y, width: SHEET.w, height: sh, rx: 14, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, S.sheet);
    el('path', { d: `M ${SHEET.x} ${SHEET.y + 40} L ${SHEET.x} ${SHEET.y + 14} Q ${SHEET.x} ${SHEET.y} ${SHEET.x + 14} ${SHEET.y} L ${SHEET.x + SHEET.w - 14} ${SHEET.y} Q ${SHEET.x + SHEET.w} ${SHEET.y} ${SHEET.x + SHEET.w} ${SHEET.y + 14} L ${SHEET.x + SHEET.w} ${SHEET.y + 40} Z`, fill: C.blue }, S.sheet);
    text(S.sheet, SHEET.x + 16, SHEET.y + 27, 'Mode opératoire', { size: 19, weight: 700, fill: C.white });
    S.rows = STEPS.map((s, i) => {
      const y = SHEET.y + 52 + i * 44;
      const hl = el('rect', { x: SHEET.x + 8, y, width: SHEET.w - 16, height: 36, rx: 8, fill: C.pYellow, opacity: 0 }, S.sheet);
      el('circle', { cx: SHEET.x + 28, cy: y + 18, r: 12, fill: C.lightBlue }, S.sheet);
      text(S.sheet, SHEET.x + 28, y + 23.5, String(i + 1), { size: 15, weight: 700, fill: C.white, anchor: 'middle' });
      text(S.sheet, SHEET.x + 50, y + 24, s, { size: 18, weight: 500, fill: C.ink });
      return hl;
    });
    const ys = SHEET.y + 52 + STEPS.length * 44 + 2;
    S.slot = el('g', {}, S.sheet);
    el('rect', { x: SHEET.x + 8, y: ys, width: SHEET.w - 16, height: 56, rx: 8, fill: C.pRed, stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, S.slot);
    text(S.slot, SHEET.x + 22, ys + 23, 'Contrôle de début de série', { size: 17, weight: 700, fill: C.tRed });
    text(S.slot, SHEET.x + 22, ys + 45, 'écrit nulle part', { size: 17, weight: 500, fill: C.tRed });
    S.slotC = { x: SHEET.x + SHEET.w / 2, y: ys + 28 };

    // Machine et bac de sortie
    S.mach = el('g');
    S.m = G.machine(S.mach, MACH.x, MACH.y, MACH.k);
    el('rect', { x: TRAY.x - 44, y: FLOOR - 8, width: 88, height: 10, rx: 4, fill: C.line }, S.mach);
    // Pièce produite
    S.part = el('g');
    S.partBody = el('rect', { x: -17, y: -17, width: 34, height: 34, rx: 7, fill: C.lightBlue }, S.part);
    el('circle', { cx: 0, cy: 0, r: 6, fill: C.white }, S.part);
    S.partX = el('g', {}, S.part);
    G.cross(S.partX, 17, -17, 11);
    S.badTag = el('g');
    const bt = G.pill(S.badTag, 604, MACH.y - 34, 'réglage hors tolérance', { size: 17, h: 30, pad: 12, bg: C.pRed, fg: C.tRed, anchor: 'middle' });
    fit(bt.g, 732, 'étiquette défaut');

    // Opérateurs
    S.opA = el('g');
    person(S.opA, OPX, FLOOR, C.blue);
    S.opB = el('g');
    person(S.opB, OPX, FLOOR, C.teal);
    S.labA = text(G.svg, OPX, FLOOR + 30, 'Opérateur A', { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
    S.labB = el('g');
    text(S.labB, OPX, FLOOR + 30, 'Opérateur B', { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
    text(S.labB, OPX, FLOOR + 52, 'même compétence, bonne volonté', { size: 17, weight: 500, fill: C.ink, anchor: 'middle' });
    S.swap = el('g');
    G.pill(S.swap, OPX, FLOOR - 128, 'on remplace', { size: 17, h: 30, pad: 12, anchor: 'middle' });

    // ----- Carte droite : la chaîne -----
    G.card(756, 176, 404, 584);
    S.b2 = box(196, 2, [['Le contrôle de début de série n’a pas été fait.']]);
    S.w23 = why(196 + BOX_H + 3, 278 - 4);
    S.b3 = box(278, 3, [['L’opérateur', C.tRed, 700], ['ne l’a pas fait.']]);
    // Barre de rature
    const l3 = measure(S.b3.rt.nodes[0]);
    const sy = 278 + BOX_H / 2 + 6.5 - 6;   // ligne de base de la réponse (une ligne), moins une demi-hauteur d'x
    S.strike = el('line', { x1: l3.x - 4, y1: sy, x2: l3.x + l3.width + 4, y2: sy, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' });
    S.strikeLen = l3.width + 8;

    S.test = el('g');
    el('rect', { x: RC.x, y: 352, width: RC.w, height: 176, rx: 16, fill: C.pLav }, S.test);
    text(S.test, RC.x + 18, 384, 'Test de la relève', { size: 20, weight: 700, fill: C.blue });
    const q = G.para(S.test, RC.x + 18, 412, 'On remplace l’opérateur par un collègue équivalent. Le problème disparaît-il\u00a0?', RC.w - 36, { size: 17, weight: 500, fill: C.ink, lh: 1.25 });
    fit(q.t, RC.x + RC.w - 10, 'question du test');
    S.ans = el('g');
    const ap = G.pill(S.ans, RC.x + 18, 494, 'Non : le défaut revient', { size: 18, h: 34, pad: 14, bg: C.red, fg: C.white, icon: null });
    S.ansC = { x: RC.x + 18 + ap.w / 2, y: 494 };

    S.verdict = el('g');
    const vp = G.para(S.verdict, RC.x, 556, 'Ce n’était pas une cause : un pourquoi de plus.', RC.w, { size: 17, weight: 700, fill: C.tRed, lh: 1.25 });
    fit(vp.t, RC.x + RC.w, 'verdict');
    S.w3n = why(556 + 21 * (vp.n - 1) + 12, 606 - 4, null);
    S.b3n = box(606, 3, [['Le contrôle', C.tGreen, 700], ['ne figure pas dans le mode opératoire.']], { fill: C.pGreen, stroke: C.pGreen });
    S.w34 = why(606 + BOX_H + 3, 690 - 4, 'la chaîne redémarre');
    S.b4 = box(690, 4, [['Pourquoi ?', C.blue, 700]], { dash: '7 6', stroke: C.blue });

    S.chute = G.blogChute('Un autre opérateur ne l’aurait pas fait non plus.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.sheet, t, T.scene, SHEET.x + SHEET.w / 2, 330);
    pop(S.mach, t, T.scene + 0.2, MACH.x + 95, FLOOR - 65);

    // Relève : A sort, B entre
    let ax = 0, ao = 0, bx = 0, bo = o;
    if (live) {
      const pa = prog(t, T.out, 0.5), pb = prog(t, T.in, 0.5);
      const ea = t < T.out ? clamp(prog(t, T.scene + 0.4, 0.3)) : 1 - pa;
      ax = -110 * easeInOut(pa); ao = ea;
      bx = -110 * (1 - easeOut(pb)); bo = pb;
    }
    S.opA.setAttribute('transform', ax ? `translate(${ax} 0)` : '');
    S.opA.setAttribute('opacity', ao);
    S.labA.setAttribute('opacity', live ? ao : 0);
    S.opB.setAttribute('transform', bx ? `translate(${bx} 0)` : '');
    S.opB.setAttribute('opacity', bo);
    S.labB.setAttribute('opacity', live ? clamp(prog(t, T.in + 0.3, 0.3)) : o);
    S.swap.setAttribute('opacity', live ? G.window01(t, T.out - 0.2, T.in + 0.7, 0.25) : 0);

    // B suit le mode opératoire à la lettre : trois étapes, rien pour le contrôle
    S.rows.forEach((r, i) => r.setAttribute('opacity', live ? G.window01(t, T.steps[i], T.steps[i] + 0.55, 0.12) : 0));
    if (live && t >= T.slot && t < T.slot + 0.8) pulse(S.slot, t, T.slot, S.slotC.x, S.slotC.y, 0.06, 0.5);
    else S.slot.removeAttribute('transform');
    const busy = live && t >= T.steps[1] && t < T.make + 0.5;
    S.m.lights[1].setAttribute('fill', busy ? C.yellow : C.green);

    // La pièce sort : défaut
    let px = TRAY.x, po = o, bad = true;
    if (live) {
      const pm = prog(t, T.make, 0.5);
      px = MACH.x + 170 + (TRAY.x - MACH.x - 170) * easeOut(pm);
      po = pm > 0 ? 1 : 0;
      bad = t >= T.bad;
    }
    const py = TRAY.y - 6;
    S.part.setAttribute('transform', `translate(${px} ${py})`);
    S.part.setAttribute('opacity', po);
    S.partBody.setAttribute('fill', bad ? C.red : C.lightBlue);
    S.partX.setAttribute('opacity', bad ? 1 : 0);
    pop(S.badTag, t, T.bad + 0.1, 604, MACH.y - 34);

    // La chaîne
    pop(S.b2.g, t, T.chain, RC.x + RC.w / 2, S.b2.cy);
    showArrow(S.w23, t, T.chain + 0.3);
    pop(S.b3.g, t, T.chain + 0.5, RC.x + RC.w / 2, S.b3.cy);
    pop(S.test, t, T.test, RC.x + RC.w / 2, 440);
    pop(S.ans, t, T.answer, S.ansC.x, S.ansC.y);
    if (live && t >= T.answer + 0.35 && t < T.answer + 1.0) pulse(S.ans, t, T.answer + 0.35, S.ansC.x, S.ansC.y, 0.08, 0.4);
    // Rature de l'ancienne réponse
    const sp = live ? prog(t, T.strike, 0.35) : 1;
    S.strike.setAttribute('stroke-dasharray', `${S.strikeLen} ${S.strikeLen}`);
    S.strike.setAttribute('stroke-dashoffset', S.strikeLen * (1 - sp));
    S.strike.setAttribute('opacity', live ? (sp > 0 ? 1 : 0) : o);
    pop(S.verdict, t, T.strike + 0.2, RC.x + RC.w / 2, 560);
    showArrow(S.w3n, t, T.restart - 0.1, 0.25);
    pop(S.b3n.g, t, T.restart + 0.2, RC.x + RC.w / 2, S.b3n.cy);
    showArrow(S.w34, t, T.restart + 0.7);
    pop(S.b4.g, t, T.restart + 1.0, RC.x + RC.w / 2, S.b4.cy);

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
