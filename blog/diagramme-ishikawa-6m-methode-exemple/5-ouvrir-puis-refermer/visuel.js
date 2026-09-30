// Blog · Diagramme d'Ishikawa · section « Ce qu'on fait du diagramme le lendemain »
// Mécanique : l'Ishikawa ouvre le champ (douze causes possibles), le vote en garde trois, la vérification sur le terrain
// en écarte deux ; seule la cause avérée quitte le diagramme et les 5 pourquoi descendent sur elle, et sur elle seule,
// jusqu'à la cause racine où une action corrective tient. Le compteur suit la largeur du champ : 12, 3, 1.
// Hypothèse : l'issue des vérifications (critère avéré, gamme et lot écartés) est illustrative, l'article ne la donne pas.
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;

  const SPINE = { x0: 64, x1: 704, y: 470 };
  const JX = [300, 500, 700];
  const DX = 60, DY = 150;
  const CW = 160, CH = 46, BW = 100, BH = 28;
  const FAM = [
    { name: 'Main d’œuvre', j: 0, up: true }, { name: 'Matière', j: 1, up: true }, { name: 'Matériel', j: 2, up: true },
    { name: 'Méthode', j: 0, up: false }, { name: 'Milieu', j: 1, up: false }, { name: 'Mesure', j: 2, up: false },
  ];
  // Candidates (texte) et notes muettes ; res : 1 = avérée, 0 = écartée ; order : ordre des vérifications
  const CANDS = [
    { txt: 'Changement de lot fournisseur', fam: 1, res: 0, order: 1 },
    { txt: 'Deux versions de la gamme', fam: 3, res: 0, order: 0 },
    { txt: 'Critère interprété différemment', fam: 5, res: 1, order: 2 },
  ];
  const T = { notes: 2.8, red: 4.4, stage: 5.6, verif: 6.0, dim: 7.7, fly: 8.2, why: 9.2, root: 12.0, chute: 12.8 };
  const VERIF_T = k => T.verif + 0.5 * k;
  const WHY_T = k => T.why + 0.52 * k;
  const LAD = { cx: 1000, y0: 374, dy: 50, h: 36, w0: 240, dw: 20 };
  const S = {};

  const branchX = (f, y) => JX[f.j] - DX * Math.abs(SPINE.y - y) / DY;
  function rightOf(f, cy, h) {
    const far = f.up ? cy - h / 2 : cy + h / 2;
    return branchX(f, far) - 10;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Ouvrir le champ,', 'puis le refermer.', { size: 48 });
    G.blogChapeau('Les 5 pourquoi prennent le relais sur la cause vérifiée, et sur elle seule.');
    G.card(40, 176, 1120, 584);

    // En-têtes
    S.headL = el('g');
    const pl = G.pill(S.headL, 64, 222, 'Ishikawa', { size: 19, h: 36, bg: C.blue, fg: C.white });
    text(S.headL, 64 + pl.w + 12, 229, 'ouvre le champ', { size: 20, weight: 700, fill: C.blue });
    S.count = text(G.svg, 64, 266, '', { size: 19, weight: 700, fill: C.ink });
    S.headR = el('g');
    G.pill(S.headR, LAD.cx, 222, '5 pourquoi', { size: 19, h: 36, bg: C.green, fg: C.white, anchor: 'middle' });
    text(S.headR, LAD.cx, 254, 'referment sur un point', { size: 18, weight: 700, fill: C.tGreen, anchor: 'middle' });

    // Diagramme
    S.effect = el('g');
    el('rect', { x: 710, y: 428, width: 96, height: 84, rx: 14, fill: C.pRed, stroke: C.red, 'stroke-width': 2.5 }, S.effect);
    text(S.effect, 758, 464, 'Rebut', { size: 17, weight: 800, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 758, 486, 'en hausse', { size: 15, weight: 700, fill: C.tRed, anchor: 'middle' });
    S.spine = G.arrow(G.svg, `M ${SPINE.x0} ${SPINE.y} L ${SPINE.x1} ${SPINE.y}`, { width: 5, head: 14, stroke: C.ink });
    S.fam = FAM.map((f, i) => {
      const g = el('g');
      const yEnd = f.up ? SPINE.y - DY : SPINE.y + DY;
      const x0 = JX[f.j] - DX, len = Math.hypot(DX, DY);
      const line = el('line', { x1: x0, y1: yEnd, x2: JX[f.j], y2: SPINE.y, stroke: i === 5 ? C.green : C.ink, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': `${len} ${len}` }, g);
      const pg = el('g', {}, g);
      const py = f.up ? yEnd - 17 : yEnd + 17;
      G.pill(pg, x0, py, f.name, { size: 17, h: 34, bg: C.pLav, fg: C.blue, anchor: 'middle' });
      return { ...f, g, line, len, pg, px: x0, py };
    });

    // Notes : deux par famille ; une candidate (avec texte) sur Matière, Méthode, Mesure, des notes muettes ailleurs
    S.blanks = [];
    S.cands = [];
    FAM.forEach((f, i) => {
      const cand = CANDS.find(c => c.fam === i);
      const farCy = f.up ? 360 : 580, nearCy = f.up ? 425 : 515;
      // Loin de l'arête : toujours une note muette
      [[farCy, true], [nearCy, !cand]].forEach(([cy, blank]) => {
        if (!blank) return;
        const x = rightOf(f, cy, BH) - BW;
        const g = el('g');
        el('rect', { x, y: cy - BH / 2, width: BW, height: BH, rx: 6, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 1.5 }, g);
        el('line', { x1: x + 12, y1: cy - 3, x2: x + BW - 16, y2: cy - 3, stroke: C.yellow, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
        el('line', { x1: x + 12, y1: cy + 5, x2: x + BW - 40, y2: cy + 5, stroke: C.yellow, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
        S.blanks.push({ g, cx: x + BW / 2, cy, fam: i });
      });
      if (cand) {
        const x = rightOf(f, nearCy, CH) - CW, y = nearCy - CH / 2;
        const ghost = el('rect', { x, y, width: CW, height: CH, rx: 8, fill: 'none', stroke: C.green, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0 });
        const g = el('g');
        const r = el('rect', { x: 0, y: 0, width: CW, height: CH, rx: 8, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 1.5 }, g);
        const p = G.para(g, 9, 19, cand.txt, CW - 16, { size: 15, weight: 500, fill: C.ink, lh: 1.2 });
        fit(p.t, CW - 3, `candidate « ${cand.txt} »`);
        const badge = el('g', {}, g);
        if (cand.res) G.check(badge, CW - 2, 2, 13, C.green); else G.cross(badge, CW - 2, 2, 13, '#9a9ab8');
        S.cands.push({ ...cand, g, r, t: p.t, badge, ghost, x, y, i });
      }
    });
    S.stage = el('g');
    const sp = G.pill(S.stage, 64, 718, 'Vérifié sur le terrain, relu à date fixe', { size: 17, h: 34, bg: C.pLav, fg: C.blue });
    S.link = el('path', { d: '', fill: 'none', stroke: C.green, 'stroke-width': 3, 'stroke-dasharray': '7 6', opacity: 0 });

    // Échelle des 5 pourquoi
    S.whys = [0, 1, 2, 3, 4].map(k => {
      const g = el('g');
      const w = LAD.w0 - LAD.dw * k, y = LAD.y0 + LAD.dy * k;
      el('rect', { x: LAD.cx - w / 2, y: y - LAD.h / 2, width: w, height: LAD.h, rx: LAD.h / 2, fill: C.pGreen, stroke: C.green, 'stroke-width': 2 }, g);
      G.badgeNum(g, LAD.cx - w / 2 + 20, y, k + 1, 13);
      text(g, LAD.cx + 14, y + 6, 'Pourquoi ?', { size: 17, weight: 700, fill: C.tGreen, anchor: 'middle' });
      const a = G.arrow(g, `M ${LAD.cx} ${y - LAD.dy + LAD.h / 2 + 2} L ${LAD.cx} ${y - LAD.h / 2 - 3}`, { width: 3, head: 8, stroke: C.green });
      return { g, y };
    });
    S.root = el('g');
    const ry = LAD.y0 + LAD.dy * 5 - 4;
    G.arrow(S.root, `M ${LAD.cx} ${ry - LAD.dy + LAD.h / 2 + 6} L ${LAD.cx} ${ry - 24}`, { width: 3, head: 8, stroke: C.green });
    el('rect', { x: LAD.cx - 90, y: ry - 20, width: 180, height: 44, rx: 22, fill: C.green }, S.root);
    text(S.root, LAD.cx, ry + 9, 'Cause racine', { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
    text(S.root, LAD.cx, ry + 50, 'l’action corrective tient', { size: 17, weight: 700, fill: C.tGreen, anchor: 'middle' });

    S.chute = G.blogChute('L’Ishikawa ouvre le champ, les 5 pourquoi le referment.', { y: 808 });
  }

  const avered = () => S.cands.find(c => c.res);
  const TOP = { x: LAD.cx - CW / 2, y: 304 - CH / 2 };

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    // Atténuation du diagramme quand on ne garde que la branche avérée
    const dim = live ? clamp(prog(t, T.dim, 0.4)) : 1;

    pop(S.headL, t, 1.8, 150, 222);
    pop(S.effect, t, 1.8, 758, 470);
    const qs = live ? easeInOut(prog(t, 2.0, 0.45)) : 1;
    S.spine.draw(qs);
    S.spine.g.setAttribute('opacity', (live ? (qs > 0 ? 1 : 0) : o) * (1 - 0.75 * dim));
    S.effect.setAttribute('opacity', Number(S.effect.getAttribute('opacity')) * (1 - 0.5 * dim));
    S.fam.forEach((f, i) => {
      const t0 = 2.3 + 0.07 * i;
      const q = live ? easeOut(prog(t, t0, 0.35)) : 1;
      f.line.setAttribute('stroke-dashoffset', f.len * (1 - q));
      f.line.setAttribute('stroke', i === 5 && dim > 0 ? C.green : C.ink);
      const keep = i === 5;
      f.g.setAttribute('opacity', (live ? (q > 0 ? 1 : 0) : o) * (keep ? 1 : 1 - 0.78 * dim));
      const pp = live ? prog(t, t0 + 0.2, 0.3) : 1;
      const sc = pp <= 0 ? 0.001 : pp >= 1 ? 1 : 0.6 + 0.4 * G.back(pp);
      f.pg.setAttribute('transform', sc === 1 ? '' : `translate(${f.px} ${f.py}) scale(${sc}) translate(${-f.px} ${-f.py})`);
    });

    // Notes muettes : apparaissent, s'estompent au vote
    const voted = live ? clamp(prog(t, T.red, 0.5)) : 1;
    S.blanks.forEach((b, k) => {
      pop(b.g, t, T.notes + 0.08 * k, b.cx, b.cy, 0.3);
      if (live && t >= T.notes + 0.08 * k + 0.35 || !live) b.g.setAttribute('opacity', o * (1 - 0.6 * voted) * (1 - 0.6 * dim));
    });

    // Candidates : rouge au vote, badge à la vérification, l'avérée part en haut de l'échelle
    S.cands.forEach((c, k) => {
      const tA = T.notes + 0.08 * (9 + k);
      const red = !live || t >= T.red + 0.25 * k;
      const vt = VERIF_T(c.order);
      const checked = !live || t >= vt;
      const green = c.res && (!live || t >= vt);
      c.r.setAttribute('fill', green ? C.pGreen : red ? C.pRed : C.pYellow);
      c.r.setAttribute('stroke', green ? C.green : red ? C.red : C.yellow);
      c.r.setAttribute('stroke-width', red ? 3 : 1.5);
      c.t.setAttribute('fill', green ? C.tGreen : red ? C.tRed : C.ink);
      // Badge du résultat
      const bp = live ? prog(t, vt, 0.3) : 1;
      const bs = bp <= 0 ? 0.001 : bp >= 1 ? 1 : 0.6 + 0.4 * G.back(bp);
      c.badge.setAttribute('transform', `translate(${CW - 2} 2) scale(${bs}) translate(${-(CW - 2)} -2)`);
      c.badge.setAttribute('opacity', checked ? 1 : 0);
      // Position : dans le diagramme, ou vers le haut de l'échelle pour l'avérée
      let x = c.x, y = c.y, s = 1, op = o;
      if (live) {
        const pa = prog(t, tA, 0.3);
        s = pa <= 0 ? 0.001 : pa >= 1 ? 1 : 0.6 + 0.4 * G.back(pa);
        op = clamp(pa / 0.4);
        if (!c.res) op *= 1 - 0.65 * clamp(prog(t, vt + 0.4, 0.4));
      } else if (!c.res) op = o * 0.35;
      if (c.res) {
        const pf = live ? prog(t, T.fly, 0.7) : 1;
        const e = easeInOut(pf);
        x = c.x + (TOP.x - c.x) * e;
        y = c.y + (TOP.y - c.y) * e - 50 * Math.sin(Math.PI * pf);
        if (live && t >= vt - 0.1 && t < vt + 0.6) { const p = prog(t, vt, 0.45); s = p > 0 && p < 1 ? 1 + 0.12 * Math.sin(Math.PI * p) : s; }
        c.ghost.setAttribute('opacity', live ? clamp(prog(t, T.fly + 0.2, 0.3)) : o);
      }
      c.g.setAttribute('transform', `translate(${x + CW / 2} ${y + CH / 2}) scale(${s}) translate(${-CW / 2} ${-CH / 2})`);
      c.g.setAttribute('opacity', op);
    });

    // Lien entre l'emplacement d'origine et le haut de l'échelle
    const a = avered();
    const lk = live ? clamp(prog(t, T.fly + 0.5, 0.3)) : o;
    S.link.setAttribute('d', `M ${a.x + CW} ${a.y + CH / 2} C 940 ${a.y + CH / 2 + 125} 820 250 ${TOP.x - 8} ${TOP.y + CH / 2}`);
    S.link.setAttribute('opacity', lk);

    // Compteur : largeur du champ
    const n = !live ? 1 : t < T.notes + 0.3 ? 0 : t < T.red + 0.5 ? 12 : t < VERIF_T(2) + 0.3 ? 3 : 1;
    S.count.textContent = n === 12 ? '12 causes possibles' : n === 3 ? '3 causes candidates' : n === 1 ? '1 cause avérée' : '';
    S.count.setAttribute('fill', n === 3 ? C.tRed : n === 1 ? C.tGreen : C.ink);
    S.count.setAttribute('opacity', o);

    pop(S.stage, t, T.stage, 250, 718);
    pop(S.headR, t, T.fly - 0.2, LAD.cx, 240);
    S.whys.forEach((w, k) => pop(w.g, t, WHY_T(k), LAD.cx, w.y));
    pop(S.root, t, T.root, LAD.cx, LAD.y0 + LAD.dy * 5);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
