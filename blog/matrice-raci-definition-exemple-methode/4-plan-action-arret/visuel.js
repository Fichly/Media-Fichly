// Blog · Matrice RACI · « Un exemple : le plan d'action après un arrêt subi » (visuel prévu par l'article)
// Mécanique : la matrice de l'article se remplit dans l'ordre de la méthode. D'abord un A par ligne, posé en
// réponse à « à qui va-t-on le demander dans trois semaines ? » (chaque ligne reçoit sa coche), puis les R,
// puis les C et les I. Enfin, un trait relie les A : un seul par ligne, et il change de colonne selon la tâche.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const COLX = k => 491 + 142 * k;
  const RY = k => 292 + 58 * k;
  const HEADS = [['Chef', 'd’équipe'], ['Technicien', 'maintenance'], ['Responsable', 'production'], ['Responsable', 'qualité'], ['Responsable', 'amélioration', 'continue']];
  const TASKS = [
    'Relever les faits et les temps d’arrêt',
    'Animer l’analyse de cause',
    'Décider des actions retenues',
    'Modifier le standard de démarrage',
    'Former les équipes au nouveau standard',
    'Vérifier l’efficacité au jalon',
  ];
  const M = [
    ['R', 'C', 'A', 'I', 'I'],
    ['C', 'C', 'A', 'I', 'R'],
    ['C', 'C', 'A', 'C', 'R'],
    ['R', 'C', 'I', 'A', 'C'],
    ['A', 'I', 'I', 'C', 'R'],
    ['I', 'I', 'A', 'C', 'R'],
  ];
  // Chronologie
  const TA = k => 2.9 + 0.6 * k;            // A de la ligne k
  const PH_R = 6.8, PH_CI = 8.0, PH_READ = 9.4;
  const CAPS = [
    [1.6, '1. Les A d’abord', `Si cette tâche n’est pas faite dans trois semaines, à qui va-t-on le demander${NB}?`],
    [PH_R - 0.1, '2. Puis les R', 'Qui réalise la tâche, seul ou avec d’autres ?'],
    [PH_CI - 0.1, '3. Enfin les C et les I', 'Un C seulement si son avis peut changer la décision. Sinon, I.'],
    [PH_READ, 'Lecture', 'La qualité répond du standard, le chef d’équipe de la formation.'],
  ];
  const CHUTE_T = PH_READ + 2.2;

  function cell(parent, cx, cy, L, r = 20) {
    const g = el('g', {}, parent);
    const st = { A: [C.blue, C.blue, C.white], R: [C.pLav, C.pLav, C.blue], C: [C.white, C.ink, C.ink], I: ['none', 'none', C.ink] }[L];
    el('circle', { cx, cy, r, fill: st[0], stroke: st[1], 'stroke-width': L === 'C' ? 2 : 0 }, g);
    const tx = text(g, cx, cy + r * 0.4, L, { size: r * 1.1, weight: 800, fill: st[2], anchor: 'middle' });
    if (L === 'I') tx.setAttribute('opacity', 0.5);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Un A par ligne,', 'posé en premier.', { size: 48 });
    G.blogChapeau('Plan d’action après un arrêt subi : six tâches, cinq fonctions, une question par ligne.');

    G.card(40, 176, 1120, 584);
    // Grille (fixe)
    for (let k = 0; k <= 6; k++) el('line', { x1: 64, y1: RY(k) - 29, x2: 1136, y2: RY(k) - 29, stroke: C.line, 'stroke-width': k === 0 ? 3 : 1.5 });
    for (let c = 0; c < 5; c++) el('line', { x1: COLX(c) - 71, y1: 200, x2: COLX(c) - 71, y2: RY(5) + 29, stroke: C.line, 'stroke-width': 1.5 });

    S.heads = el('g');
    text(S.heads, 80, 250, 'Tâche', { size: 18, weight: 700, fill: C.ink });
    HEADS.forEach((lines, c) => lines.forEach((s, i) => {
      const y = 250 - 21 * (lines.length - 1 - i);
      fit(text(S.heads, COLX(c), y, s, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' }), COLX(c) + 70, `en-tête ${c}`, COLX(c) - 70);
    }));
    // Tâches
    S.tasks = TASKS.map((s, k) => {
      const g = el('g');
      const probe = G.para(g, 80, 0, s, 320, { size: 17, weight: 700, fill: C.ink, lh: 1.2 });
      probe.t.setAttribute('transform', `translate(0 ${probe.n === 1 ? RY(k) + 6 : RY(k) - 5})`);
      return g;
    });
    // Surlignage de la ligne en cours
    S.band = el('rect', { x: 50, y: 0, width: 1100, height: 56, rx: 10, fill: C.pLav, opacity: 0 });
    G.svg.insertBefore(S.band, S.tasks[0]);
    // Trait qui relie les A (sous les lettres)
    const aPts = M.map((row, k) => [COLX(row.indexOf('A')), RY(k)]);
    S.zig = el('path', { d: 'M ' + aPts.map(p => p.join(' ')).join(' L '), fill: 'none', stroke: C.lightBlue, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    S.zigLen = S.zig.getTotalLength();
    // Lettres
    S.cells = [];
    M.forEach((row, k) => row.forEach((L, c) => S.cells.push({ k, c, L, g: cell(G.svg, COLX(c), RY(k), L) })));
    // Coches : un A par ligne
    S.checks = M.map((row, k) => { const g = el('g'); G.check(g, 58, RY(k), 11); return g; });

    // Légende de la phase (texte variable) et légende des lettres
    S.capG = el('g');
    S.capPill = el('rect', { y: 632, height: 32, rx: 16, fill: C.blue }, S.capG);
    S.capName = text(S.capG, 0, 654, '', { size: 18, weight: 700, fill: C.white });
    S.cap = text(S.capG, 0, 655, '', { size: 19, weight: 500, fill: C.ink });
    S.legend = el('g');
    let lx = 64;
    [['A', 'rend des comptes'], ['R', 'réalise'], ['C', 'donne un avis'], ['I', 'est informé']].forEach(([L, s]) => {
      cell(S.legend, lx + 15, 712, L, 15);
      const tx = text(S.legend, lx + 38, 718, s, { size: 18, weight: 500, fill: C.ink });
      lx += 38 + measure(tx).width + 36;
    });

    S.chute = G.blogChute('Chaque ligne porte exactement un A, et il change de colonne.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    pop(S.heads, t, 1.7, 700, 230);
    S.tasks.forEach((g, k) => rise(g, t, 1.85 + 0.1 * k, 0.35));
    rise(S.legend, t, 2.3, 0.35);

    // Ligne en cours pendant la pose des A
    let bandK = -1;
    if (live) for (let k = 0; k < 6; k++) if (t >= TA(k) - 0.1 && t < TA(k) + 0.5) bandK = k;
    S.band.setAttribute('opacity', bandK >= 0 ? 0.9 : 0);
    if (bandK >= 0) S.band.setAttribute('y', RY(bandK) - 28);

    S.cells.forEach(cl => {
      let t0;
      const ord = S.cells.filter(x => x.L === cl.L).indexOf(cl);
      if (cl.L === 'A') t0 = TA(cl.k) + 0.2;
      else if (cl.L === 'R') t0 = PH_R + 0.08 * ord;
      else t0 = PH_CI + 0.05 * S.cells.filter(x => x.L === 'C' || x.L === 'I').indexOf(cl);
      pop(cl.g, t, t0, COLX(cl.c), RY(cl.k), 0.3);
      // Lecture : les A des lignes 4 et 5 (qualité, chef d'équipe) ressortent
      if (cl.L === 'A' && (cl.k === 3 || cl.k === 4) && live && t >= PH_READ + 0.9) pulse(cl.g, t, PH_READ + 0.9 + 0.4 * (cl.k - 3), COLX(cl.c), RY(cl.k), 0.2, 0.45);
    });
    S.checks.forEach((g, k) => pop(g, t, TA(k) + 0.45, 58, RY(k)));

    // Trait des A
    const zq = live ? easeInOut(prog(t, PH_READ, 0.8)) : 1;
    S.zig.setAttribute('stroke-dasharray', `${S.zigLen} ${S.zigLen}`);
    S.zig.setAttribute('stroke-dashoffset', S.zigLen * (1 - zq));
    S.zig.setAttribute('opacity', 0.7 * o0);

    // Légende de la phase
    let cap = CAPS[3];
    if (live) CAPS.forEach(c => { if (t >= c[0]) cap = c; });
    S.capName.textContent = cap[1];
    const w = measure(S.capName).width;
    S.capPill.setAttribute('x', 64); S.capPill.setAttribute('width', w + 28);
    S.capName.setAttribute('x', 78);
    S.cap.textContent = cap[2];
    S.cap.setAttribute('x', 64 + w + 44);
    S.capG.setAttribute('opacity', o0);
    if (live && measure(S.cap).x + measure(S.cap).width > 1140) console.error(`Débordement : légende ${cap[1]}`);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
