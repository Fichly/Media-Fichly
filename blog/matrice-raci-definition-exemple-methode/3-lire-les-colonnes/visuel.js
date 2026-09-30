// Blog · Matrice RACI · étape 6 « Lire les colonnes, pas les lignes »
// Mécanique : une matrice de fonctionnement courant passe le contrôle des lignes (chaque ligne a son A, coche
// verte). Puis la lecture bascule à la verticale : une colonne pleine de A (ne tiendra pas), une colonne qui
// ne contient que des I (rien à faire en réunion), une colonne vide (fonction oubliée, ou colonne inutile).
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const COLX = k => 491 + 142 * k;
  const RY = k => 284 + 48 * k;
  const HEADS = [['Chef', 'd’équipe'], ['Technicien', 'maintenance'], ['Responsable', 'production'], ['Méthodes'], ['Achats']];
  const TASKS = ['Déclarer un rebut', 'Arrêter la ligne sur un doute', 'Appeler la maintenance', 'Relever les temps d’arrêt', 'Modifier le standard', 'Former les équipes', 'Vérifier l’efficacité au jalon'];
  const M = [
    ['R', '', 'A', 'I', ''],
    ['R', 'C', 'A', 'I', ''],
    ['A', 'R', 'I', '', ''],
    ['R', 'C', 'A', 'I', ''],
    ['C', 'R', 'A', 'I', ''],
    ['A', '', 'C', 'I', ''],
    ['R', 'I', 'A', 'I', ''],
  ];
  const NR = M.length, BOT = RY(NR - 1) + 24;
  const VERDICT = [
    { ok: true },
    { ok: true },
    { lines: ['pleine de A :', 'ne tiendra pas'], fg: C.tRed, bg: C.pRed },
    { lines: ['que des I : rien', 'à faire en', 'réunion'], fg: C.tYellow, bg: C.pYellow },
    { lines: ['vide : oubliée,', 'ou inutile'], fg: C.ink, bg: C.pLav },
  ];
  // Chronologie
  const TR = k => 2.8 + 0.36 * k;
  const TC = [6.1, 6.8, 7.5, 8.8, 9.9];
  const CAPS = [
    [1.6, 'Les lignes', 'Chaque ligne porte un seul A : le contrôle habituel est passé.'],
    [TC[0] - 0.2, 'Les colonnes', 'La même matrice, lue à la verticale.'],
  ];
  const CHUTE_T = TC[4] + 1.2;

  function cell(parent, cx, cy, L, r = 18) {
    const g = el('g', {}, parent);
    if (!L) return g;
    const st = { A: [C.blue, C.blue, C.white], R: [C.pLav, C.pLav, C.blue], C: [C.white, C.ink, C.ink], I: ['none', 'none', C.ink] }[L];
    el('circle', { cx, cy, r, fill: st[0], stroke: st[1], 'stroke-width': L === 'C' ? 2 : 0 }, g);
    const tx = text(g, cx, cy + r * 0.4, L, { size: r * 1.1, weight: 800, fill: st[2], anchor: 'middle' });
    if (L === 'I') tx.setAttribute('opacity', 0.5);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Lire les colonnes,', 'pas les lignes.', { size: 48 });
    G.blogChapeau('Le contrôle final se fait à la verticale, et c’est celui que presque personne ne fait.');

    G.card(40, 176, 1120, 584);
    // Surlignages (sous la grille) : ligne ou colonne en cours de lecture
    S.rowBand = el('rect', { x: 50, y: 0, width: 1100, height: 46, rx: 10, fill: C.pLav, opacity: 0 });
    S.colBands = [0, 1, 2, 3, 4].map(c => el('rect', { x: COLX(c) - 68, y: 198, width: 136, height: BOT - 198 + 4, rx: 12, fill: VERDICT[c].ok ? C.pGreen : VERDICT[c].bg, opacity: 0 }));
    for (let k = 0; k <= NR; k++) el('line', { x1: 64, y1: RY(k) - 24, x2: 1136, y2: RY(k) - 24, stroke: C.line, 'stroke-width': k === 0 ? 3 : 1.5 });
    for (let c = 0; c < 5; c++) el('line', { x1: COLX(c) - 71, y1: 200, x2: COLX(c) - 71, y2: BOT, stroke: C.line, 'stroke-width': 1.5 });

    S.heads = el('g');
    text(S.heads, 80, 246, 'Tâche', { size: 18, weight: 700, fill: C.ink });
    HEADS.forEach((lines, c) => lines.forEach((s, i) => {
      const y = 246 - 21 * (lines.length - 1 - i);
      fit(text(S.heads, COLX(c), y, s, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' }), COLX(c) + 70, `en-tête ${c}`, COLX(c) - 70);
    }));
    S.tasks = TASKS.map((s, k) => {
      const g = el('g');
      fit(text(g, 80, RY(k) + 6, s, { size: 17, weight: 700, fill: C.ink }), 410, `tâche ${k}`);
      return g;
    });
    S.cells = [];
    M.forEach((row, k) => row.forEach((L, c) => { if (L) S.cells.push({ k, c, L, g: cell(G.svg, COLX(c), RY(k), L) }); }));
    // Colonne vide : emplacements en pointillés
    S.empty = el('g');
    for (let k = 0; k < NR; k++) el('circle', { cx: COLX(4), cy: RY(k), r: 16, fill: 'none', stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: 0.45 }, S.empty);
    // Anneaux rouges sur les A de la colonne surchargée
    S.rings = [];
    M.forEach((row, k) => { if (row[2] === 'A') S.rings.push(el('circle', { cx: COLX(2), cy: RY(k), r: 22, fill: 'none', stroke: C.red, 'stroke-width': 3.5 })); });
    S.checks = M.map((row, k) => { const g = el('g'); G.check(g, 58, RY(k), 11); return g; });

    // Verdicts sous les colonnes
    S.verdicts = VERDICT.map((v, c) => {
      const g = el('g');
      if (v.ok) G.check(g, COLX(c), BOT + 34, 15);
      else {
        G.cross(g, COLX(c), BOT + 30, 13, v.fg === C.ink ? C.ink : v.fg === C.tYellow ? C.yellow : C.red);
        v.lines.forEach((s, i) => fit(text(g, COLX(c), BOT + 66 + 20 * i, s, { size: 17, weight: 700, fill: v.fg, anchor: 'middle' }), COLX(c) + 71, `verdict ${c}`, COLX(c) - 71));
      }
      return g;
    });

    // Légende de la phase
    S.capG = el('g');
    S.capPill = el('rect', { y: BOT + 26, height: 32, rx: 16, fill: C.blue }, S.capG);
    S.capName = text(S.capG, 0, BOT + 48, '', { size: 18, weight: 700, fill: C.white });
    S.cap = G.para(S.capG, 0, BOT + 88, '', 300, { size: 18, weight: 500, fill: C.ink });

    S.chute = G.blogChute('Le contrôle utile se fait en lisant les colonnes.', { y: 808 });
  }

  function setCaption(cap) {
    S.capName.textContent = cap[1];
    const w = measure(S.capName).width;
    S.capPill.setAttribute('x', 64); S.capPill.setAttribute('width', w + 28);
    S.capName.setAttribute('x', 78);
    // texte sur deux lignes sous la pilule (colonne des tâches)
    const t = S.cap.t;
    while (t.firstChild) t.removeChild(t.firstChild);
    const words = cap[2].split(' ');
    const lines = []; let cur = '';
    const probe = text(G.svg, 0, -999, '', { size: 18, weight: 500 });
    words.forEach(wd => { const tt = cur ? cur + ' ' + wd : wd; probe.textContent = tt; if (probe.getComputedTextLength() > 340 && cur) { lines.push(cur); cur = wd; } else cur = tt; });
    if (cur) lines.push(cur);
    probe.remove();
    lines.forEach((l, i) => { const ts = el('tspan', { x: 64, dy: i ? 23 : 0 }, t); ts.textContent = l; });
    t.setAttribute('y', BOT + 88);
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    pop(S.heads, t, 1.7, 700, 226);
    S.tasks.forEach((g, k) => rise(g, t, 1.8 + 0.07 * k, 0.35));
    S.cells.forEach(cl => pop(cl.g, t, 2.0 + 0.04 * (cl.k * 5 + cl.c) / 2, COLX(cl.c), RY(cl.k), 0.3));

    // Lecture des lignes
    let rk = -1;
    if (live) for (let k = 0; k < NR; k++) if (t >= TR(k) - 0.05 && t < TR(k) + 0.36) rk = k;
    S.rowBand.setAttribute('opacity', rk >= 0 ? 0.9 : 0);
    if (rk >= 0) S.rowBand.setAttribute('y', RY(rk) - 23);
    S.checks.forEach((g, k) => pop(g, t, TR(k) + 0.15, 58, RY(k)));

    // Lecture des colonnes : chaque colonne reste teintée une fois lue
    S.colBands.forEach((b, c) => b.setAttribute('opacity', live ? 0.85 * clamp(prog(t, TC[c], 0.3)) : 0.85 * o0));
    S.verdicts.forEach((g, c) => pop(g, t, TC[c] + 0.4, COLX(c), BOT + 50));
    S.rings.forEach((r, i) => r.setAttribute('opacity', live ? clamp(prog(t, TC[2] + 0.2 + 0.12 * i, 0.2)) : o0));
    S.empty.setAttribute('opacity', live ? clamp(prog(t, TC[4] + 0.1, 0.3)) : o0);
    if (live && t >= TC[2] + 0.2) S.cells.filter(cl => cl.c === 2 && cl.L === 'A').forEach((cl, i) => pulse(cl.g, t, TC[2] + 0.2 + 0.12 * i, COLX(2), RY(cl.k), 0.15, 0.35));
    if (live && t >= TC[3] + 0.1) S.cells.filter(cl => cl.c === 3).forEach((cl, i) => pulse(cl.g, t, TC[3] + 0.1 + 0.08 * i, COLX(3), RY(cl.k), 0.25, 0.35));

    // Légende de la phase
    let cap = CAPS[1];
    if (live) CAPS.forEach(c => { if (t >= c[0]) cap = c; });
    if (S.lastCap !== cap) { setCaption(cap); S.lastCap = cap; }
    S.capG.setAttribute('opacity', o0);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
