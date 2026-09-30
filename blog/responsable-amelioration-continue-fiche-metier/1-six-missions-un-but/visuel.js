// Blog · Responsable amélioration continue · section « Les missions au quotidien »
// Mécanique : les six missions tournent en boucle autour du responsable (deux tours). À droite, le tableau des
// améliorations se remplit : au début, presque toutes sont portées par le responsable (bleu) ; à force de former
// et d'outiller, ce sont les équipes qui les proposent (vert). C'est le but de fond des six missions.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  const RING = { cx: 340, cy: 474, r: 140 };
  const MISSIONS = ['Auditer, diagnostiquer', 'Piloter les projets', 'Déployer les plans d’action', 'Former et embarquer les équipes', 'Mesurer la performance', 'Ancrer la culture'];
  const ANG = k => (-90 + 60 * k) * Math.PI / 180;
  const NODE = k => ({ x: RING.cx + RING.r * Math.cos(ANG(k)), y: RING.cy + RING.r * Math.sin(ANG(k)) });
  const LOOP = { t0: 2.7, t1: 11.7, turns: 2 };
  // Qui propose chaque amélioration (dans l'ordre d'arrivée) : R = le responsable, E = les équipes
  const IDEAS = 'RRRERR' + 'RERERE' + 'EERERE' + 'EEEERE';
  const GRID = { x: 700, y: 300, w: 60, h: 50, gx: 12, gy: 14, cols: 6 };
  const IDEA_T = k => 3.0 + k * 0.36;
  const TAG_T = 12.1, CHUTE_T = 12.7;

  function person(parent, x, y, k = 1, body = C.blue) {
    const g = el('g', { transform: `translate(${x} ${y}) scale(${k})` }, parent);
    el('circle', { cx: 0, cy: -15, r: 9, fill: body }, g);
    el('rect', { x: -13, y: -3, width: 26, height: 22, rx: 9, fill: body }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Six missions,', 'un seul but.');
    G.blogChapeau('Il outille et forme les équipes, jusqu’à ce qu’elles proposent seules des améliorations.');

    // ---------- Les six missions ----------
    G.card(40, 176, 600, 560);
    text(G.svg, 64, 214, 'Les six missions, en boucle', { size: 19, weight: 700, fill: C.blue });
    el('circle', { cx: RING.cx, cy: RING.cy, r: RING.r, fill: 'none', stroke: C.line, 'stroke-width': 6 });
    // Sens de rotation : petites pointes entre les missions
    S.ringMarks = el('g');
    for (let k = 0; k < 6; k++) {
      const a = ANG(k) + Math.PI / 6, x = RING.cx + RING.r * Math.cos(a), y = RING.cy + RING.r * Math.sin(a);
      const d = a + Math.PI / 2, h = 8;
      el('path', { d: `M ${x - h * Math.cos(d - 0.6)} ${y - h * Math.sin(d - 0.6)} L ${x} ${y} L ${x - h * Math.cos(d + 0.6)} ${y - h * Math.sin(d + 0.6)}`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.5 }, S.ringMarks);
    }
    S.center = el('g');
    person(S.center, RING.cx, RING.cy - 8, 1.3);
    text(S.center, RING.cx, RING.cy + 44, 'Le responsable', { size: 16, weight: 700, fill: C.ink, anchor: 'middle' });
    text(S.center, RING.cx, RING.cy + 64, 'amélioration continue', { size: 15, weight: 500, fill: C.ink, anchor: 'middle' });
    S.comet = el('circle', { r: 9, fill: C.blue, opacity: 0 });
    S.nodes = MISSIONS.map((m, k) => {
      const p = NODE(k);
      const g = el('g');
      const on = el('circle', { cx: p.x, cy: p.y, r: 28, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
      const num = text(g, p.x, p.y + 8, String(k + 1), { size: 22, weight: 800, fill: C.blue, anchor: 'middle' });
      // Libellé à l'extérieur de l'anneau
      const side = k === 0 ? 'top' : k === 3 ? 'bottom' : k < 3 ? 'right' : 'left';
      const lab = el('g', {}, g);
      if (side === 'top') text(lab, p.x, p.y - 42, m, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      else if (side === 'bottom') text(lab, p.x, p.y + 56, m, { size: 17, weight: 700, fill: C.ink, anchor: 'middle' });
      else if (side === 'right') G.para(lab, p.x + 40, p.y - 4, m, 130, { size: 17, weight: 700, fill: C.ink, lh: 1.2 });
      else G.para(lab, p.x - 40, p.y - 4, m, 130, { size: 17, weight: 700, fill: C.ink, anchor: 'end', lh: 1.2 });
      fit(lab, 630, `mission ${k}`, 50);
      return { g, on, num, p };
    });

    // ---------- Le tableau des améliorations ----------
    G.card(660, 176, 500, 560);
    text(G.svg, 684, 214, 'Qui propose les améliorations ?', { size: 19, weight: 700, fill: C.blue });
    S.legend = el('g');
    el('rect', { x: 684, y: 236, width: 18, height: 18, rx: 4, fill: C.blue }, S.legend);
    text(S.legend, 710, 251, 'le responsable', { size: 16, weight: 600, fill: C.ink });
    el('rect', { x: 876, y: 236, width: 18, height: 18, rx: 4, fill: C.green }, S.legend);
    text(S.legend, 902, 251, 'les équipes', { size: 16, weight: 600, fill: C.ink });
    // Emplacements vides, puis les idées
    const rows = IDEAS.length / GRID.cols;
    for (let k = 0; k < IDEAS.length; k++) {
      const c = k % GRID.cols, r = Math.floor(k / GRID.cols);
      el('rect', { x: GRID.x + c * (GRID.w + GRID.gx), y: GRID.y + r * (GRID.h + GRID.gy), width: GRID.w, height: GRID.h, rx: 8, fill: 'none', stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '5 4' });
    }
    S.ideas = IDEAS.split('').map((w, k) => {
      const c = k % GRID.cols, r = Math.floor(k / GRID.cols);
      const x = GRID.x + c * (GRID.w + GRID.gx), y = GRID.y + r * (GRID.h + GRID.gy);
      const g = el('g');
      el('rect', { x, y, width: GRID.w, height: GRID.h, rx: 8, fill: w === 'E' ? C.green : C.blue }, g);
      el('line', { x1: x + 12, y1: y + 18, x2: x + GRID.w - 12, y2: y + 18, stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, g);
      el('line', { x1: x + 12, y1: y + 32, x2: x + GRID.w - 26, y2: y + 32, stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, g);
      return { g, cx: x + GRID.w / 2, cy: y + GRID.h / 2 };
    });
    // Repères de temps à droite des lignes
    S.timeMarks = el('g');
    G.arrow(S.timeMarks, `M 1146 ${GRID.y + 4} L 1146 ${GRID.y + rows * (GRID.h + GRID.gy) - GRID.gy - 4}`, { width: 2.5, head: 7, stroke: C.ink });
    text(S.timeMarks, 684, GRID.y + rows * (GRID.h + GRID.gy) + 18, 'au début en haut, avec le temps en bas', { size: 15, weight: 500, fill: C.ink });
    S.tag = el('g');
    G.pill(S.tag, 910, 650, 'Les équipes proposent elles-mêmes', { size: 18, h: 40, pad: 18, bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' });

    S.chute = G.blogChute('La réussite : des équipes qui proposent sans attendre la consigne.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    rise(S.center, t, 1.75, 0.35, 8);
    S.ringMarks.setAttribute('opacity', o);
    // La boucle : une comète fait deux tours, chaque mission s'allume à son passage
    const lp = live ? prog(t, LOOP.t0, LOOP.t1 - LOOP.t0) : 1;
    const turn = lp * LOOP.turns * 6;             // en nombre de missions parcourues
    const a = (-90 + 60 * turn) * Math.PI / 180;
    S.comet.setAttribute('cx', RING.cx + RING.r * Math.cos(a));
    S.comet.setAttribute('cy', RING.cy + RING.r * Math.sin(a));
    S.comet.setAttribute('opacity', live && lp > 0 && lp < 1 ? 1 : 0);
    S.nodes.forEach((n, k) => {
      pop(n.g, t, 1.85 + 0.08 * k, n.p.x, n.p.y, 0.35);
      // Distance (en missions) depuis le dernier passage de la comète
      let act = 0;
      if (live && lp > 0 && lp < 1) {
        const since = ((turn - k) % 6 + 6) % 6;
        act = turn >= k ? clamp(1 - since / 0.9) : 0;
      }
      n.on.setAttribute('fill', act > 0.02 ? C.blue : C.white);
      n.on.setAttribute('fill-opacity', act > 0.02 ? 0.25 + 0.75 * act : 1);
      n.num.setAttribute('fill', act > 0.5 ? C.white : C.blue);
    });

    rise(S.legend, t, 1.9, 0.35, 8);
    S.ideas.forEach((d, k) => pop(d.g, t, IDEA_T(k), d.cx, d.cy, 0.3));
    rise(S.timeMarks, t, 2.1, 0.35, 8);
    pop(S.tag, t, TAG_T, 910, 650, 0.4);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
