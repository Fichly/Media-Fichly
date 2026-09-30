// Blog · Lean Manufacturing · section « Exemple chiffré : diviser le délai sans toucher aux machines »
// Mécanique : la loi de Little. Les machines et le débit ne bougent pas ; seul l'encours entre les postes baisse,
// et la barre du temps de traversée raccourcit d'autant. Les 42 minutes de transformation restent les mêmes.
// Hypothèse de répartition (l'article ne donne que le total) : 100 / 250 / 100 pièces avant, 100 / 25 / 75 après.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const FLOOR = 345;
  const PER_BOX = 25;
  const OPS = [
    { x: 80, name: 'Sciage', min: 4 },
    { x: 390, name: 'Tournage', min: 12 },
    { x: 700, name: 'Fraisage', min: 18 },
    { x: 1010, name: 'Ébavurage', min: 8 },
  ];
  const PILES = [
    { cx: 280, before: 4, after: 4, noteAfter: 'en attente' },
    { cx: 590, before: 10, after: 1, noteAfter: 'tampon supprimé' },
    { cx: 900, before: 4, after: 3, noteAfter: 'lots plus petits' },
  ];
  // Barres du temps de traversée : 9 jours = 700 px (même échelle avant et après)
  const BAR = { x: 170, w9: 700, h: 36 };
  const DAY = BAR.w9 / 9;
  const VA = Math.max(6, BAR.w9 * 42 / 4320);

  // Emplacements d'une pile : pyramide 4-3-2-1, remplie par rangée de gauche à droite
  function slots(cx) {
    const out = [];
    for (let r = 0; r < 4; r++) {
      const n = 4 - r;
      for (let i = 0; i < n; i++) out.push({ x: cx + (i - (n - 1) / 2) * 30, y: FLOOR - 15 - 30 * r });
    }
    return out;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Moins d’encours,', 'moins de délai.', { size: 48 });
    G.blogChapeau(`Exemple illustratif : atelier d’usinage, 4 opérations, 50 pièces livrées par jour.`);

    // ----- Carte 1 : l'atelier -----
    G.card(40, 176, 1120, 236);
    el('line', { x1: 64, y1: FLOOR + 2, x2: 1136, y2: FLOOR + 2, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' });

    S.legend = el('g');
    G.carton(S.legend, 80, 205, 0.7);
    text(S.legend, 98, 212, `1 carton = ${PER_BOX} pièces`, { size: 19, weight: 600, fill: C.ink });

    S.debit = el('g');
    const dp = G.pill(S.debit, 1136, 205, `Débit : 50 pièces / jour`, { size: 19, h: 34, bg: C.pLav, fg: C.blue });
    dp.g.setAttribute('transform', `translate(${-dp.w} 0)`);
    S.debitC = { x: 1136 - dp.w / 2, y: 205 };
    S.inchange = el('g');
    G.pill(S.inchange, 1136 - dp.w - 12, 205, 'inchangé', { size: 18, h: 30, pad: 12, bg: C.pGreen, fg: C.tGreen, icon: 'check' }).g
      .setAttribute('transform', 'translate(-128 0)');

    S.ops = OPS.map((o, i) => {
      const g = el('g');
      const m = G.machine(g, o.x, FLOOR - 62, 0.5);
      const cx = o.x + 45;
      fit(text(g, cx, 374, o.name, { size: 20, weight: 700, fill: C.ink, anchor: 'middle' }), 1150, `nom ${i + 1}`, 50);
      text(g, cx, 398, `${o.min}${NB}min`, { size: 19, weight: 500, fill: C.ink, anchor: 'middle' });
      return { g, cx, m };
    });

    // Piles : cartons, fantômes (stock retiré) et compteur
    S.piles = PILES.map((p, j) => {
      const pos = slots(p.cx);
      const ghosts = pos.slice(0, p.before).map(s => {
        const r = el('rect', { x: s.x - 13, y: s.y - 13, width: 26, height: 26, rx: 5, fill: 'none', stroke: C.yellow, 'stroke-width': 2, 'stroke-dasharray': '4 3', opacity: 0 });
        return r;
      });
      const boxes = pos.slice(0, p.before).map(s => ({ g: G.carton(G.svg, s.x, s.y, 0.84), ...s }));
      const label = el('g');
      const count = text(label, p.cx, 374, '', { size: 20, weight: 700, fill: C.tRed, anchor: 'middle' });
      const note = text(label, p.cx, 398, '', { size: 19, weight: 500, fill: C.tRed, anchor: 'middle' });
      return { ...p, pos, ghosts, boxes, label, count, note };
    });

    // Actions du chantier pilote (bulles temporaires au-dessus de l'atelier)
    // Sur deux lignes, juste au-dessus du fraisage (libre à droite de la pile pleine et à gauche du débit)
    S.act1 = el('g', { opacity: 0 });
    const a1 = el('rect', { y: 190, height: 62, rx: 16, fill: C.blue }, S.act1);
    const a1a = text(S.act1, 745, 216, 'Changement de série', { size: 19, weight: 700, fill: C.white, anchor: 'middle' });
    text(S.act1, 745, 240, 'plus court', { size: 19, weight: 700, fill: C.white, anchor: 'middle' });
    const a1w = measure(a1a).width + 32;
    a1.setAttribute('x', 745 - a1w / 2);
    a1.setAttribute('width', a1w);
    el('path', { d: 'M 737 251 L 745 262 L 753 251 Z', fill: C.blue }, S.act1);
    S.act2 = el('g', { opacity: 0 });
    G.pill(S.act2, 590, 205, 'Stock tampon supprimé', { size: 19, h: 34, bg: C.blue, fg: C.white, anchor: 'middle' });

    // ----- Carte 2 : le temps de traversée -----
    G.card(40, 428, 1120, 306);
    S.head = el('g');
    const h1 = text(S.head, 70, 472, 'Temps de traversée', { size: 24, weight: 700, fill: C.ink });
    const h2 = text(S.head, measure(h1).x + measure(h1).width + 8, 472, '= encours ÷ débit', { size: 24, weight: 500, fill: C.ink });
    G.pill(S.head, measure(h2).x + measure(h2).width + 16, 464, 'loi de Little', { size: 18, h: 30, pad: 12 });

    const row = (y, label, days, formula, va) => {
      const g = el('g');
      text(g, 70, y + 26, label, { size: 22, weight: 700, fill: C.ink });
      el('rect', { x: BAR.x, y, width: BAR.w9, height: BAR.h, rx: 8, fill: C.pLav, opacity: 0.55 }, g);
      const clipId = `bar${days}`;
      const cp = el('clipPath', { id: clipId }, G.svg.querySelector('defs') || el('defs'));
      const clip = el('rect', { x: BAR.x, y, width: 0, height: BAR.h, rx: 8 }, cp);
      const fill = el('g', { 'clip-path': `url(#${clipId})` }, g);
      el('rect', { x: BAR.x, y, width: days * DAY, height: BAR.h, fill: C.red }, fill);
      el('rect', { x: BAR.x, y, width: VA, height: BAR.h, fill: C.green }, fill);
      for (let d = 1; d < days; d++) el('rect', { x: BAR.x + d * DAY - 1.5, y, width: 3, height: BAR.h, fill: C.card }, fill);
      const dayLabels = [];
      for (let d = 0; d < days; d++) {
        const tl = text(fill, BAR.x + (d + 0.5) * DAY, y + 25, `j${d + 1}`, { size: 17, weight: 600, fill: C.white, anchor: 'middle' });
        dayLabels.push(tl);
      }
      const f = text(g, 900, y + 27, formula, { size: 25, weight: 700, fill: C.blue });
      fit(f, 1140, `formule ${label}`);
      const vaT = text(g, BAR.x, y + BAR.h + 28, '', { size: 19, weight: 500, fill: C.ink });
      const s1 = el('tspan', { fill: C.tGreen, 'font-weight': 700 }, vaT);
      s1.textContent = va[0];
      const s2 = el('tspan', {}, vaT);
      s2.textContent = va[1];
      fit(vaT, 1140, `valeur ajoutée ${label}`);
      return { g, clip, days, f, vaT };
    };
    S.before = row(506, 'Avant', 9, '450 ÷ 50 = 9 jours', ['42 min transformées', ` sur 4${NB}320 : moins de 1${NB}%`]);
    S.after = row(620, 'Après', 4, '200 ÷ 50 = 4 jours', ['42 min transformées', ` sur 1${NB}920 : un peu plus de 2${NB}%`]);

    S.chute = G.blogChute('Le délai se gagne entre les machines, pas sur les machines.', { y: 796 });
  }

  // ---------- Chronologie ----------
  const OP_T = i => 1.75 + 0.2 * i;
  const DROP0 = 2.7, DROP_STEP = 0.07, DROP = 0.3;
  const HEAD_T = 4.25;
  const BEFORE_T = 4.6, BEFORE_D = 1.6;
  const ACT1 = { t: 6.9, rm: 7.5 };      // changement de série plus court : pile 3, 4 → 3
  const ACT2 = { t: 8.5, rm: 9.0 };      // stock tampon supprimé : pile 2, 10 → 1
  const RM_STEP = 0.08, RM = 0.3;
  const AFTER_T = 10.6, AFTER_D = 0.9;
  const CHUTE_T = 12.0;

  // Rang d'arrivée de chaque carton (pile par pile, du bas vers le haut)
  const order = [];
  PILES.forEach((p, j) => { for (let k = 0; k < p.before; k++) order.push([j, k]); });
  const dropAt = (j, k) => DROP0 + DROP_STEP * order.findIndex(([a, b]) => a === j && b === k);
  // Moment où un carton est retiré (null s'il reste)
  function removeAt(j, k) {
    const p = PILES[j];
    if (k < p.after) return null;
    if (j === 2) return ACT1.rm + RM_STEP * (p.before - 1 - k);
    if (j === 1) return ACT2.rm + RM_STEP * (p.before - 1 - k);
    return null;
  }
  // Nombre de cartons présents dans une pile à l'instant t
  function present(j, t) {
    if (t < FADE_END) return PILES[j].after;
    let n = 0;
    for (let k = 0; k < PILES[j].before; k++) {
      const d = dropAt(j, k), r = removeAt(j, k);
      if (t >= d + DROP * 0.6 && (r === null || t < r + RM * 0.5)) n++;
    }
    return n;
  }

  function draw(t) {
    S.ops.forEach((o, i) => pop(o.g, t, OP_T(i), o.cx, FLOOR - 31));
    pop(S.legend, t, 2.5, 150, 205);
    pop(S.debit, t, 2.5, S.debitC.x, S.debitC.y);

    // Cartons : chute dans la pile, puis retrait (le fantôme pointillé reste)
    S.piles.forEach((p, j) => {
      p.boxes.forEach((b, k) => {
        const r = removeAt(j, k);
        let y = b.y, o = 1, s = 1;
        if (fading(t)) o = fadeOut(t);
        else if (t >= FADE_END) {
          const pd = prog(t, dropAt(j, k), DROP);
          y = b.y - 70 * (1 - easeOut(pd));
          o = clamp(pd / 0.3);
          if (r !== null) { const pr = prog(t, r, RM); o *= 1 - pr; s = 1 - 0.4 * easeOut(pr); }
        } else if (r !== null) o = 0;
        b.g.setAttribute('transform', `translate(${b.x} ${y})` + (s === 1 ? '' : ` scale(${s})`));
        b.g.setAttribute('opacity', o);
        const go = r === null ? 0 : fading(t) ? fadeOut(t) : t < FADE_END ? 1 : clamp(prog(t, r, RM));
        p.ghosts[k].setAttribute('opacity', go);
      });
      // Compteur sous la pile
      const n = present(j, t);
      p.count.textContent = `${n * PER_BOX}${NB}pièces`;
      const changed = t < FADE_END || t >= (j === 2 ? ACT1.rm : j === 1 ? ACT2.rm : Infinity);
      p.note.textContent = changed && p.after !== p.before ? p.noteAfter : 'en attente';
      p.note.setAttribute('fill', changed && p.after !== p.before ? C.tGreen : C.tRed);
      p.label.setAttribute('opacity', fading(t) ? fadeOut(t) : t < FADE_END ? 1 : clamp(prog(t, dropAt(j, 0), 0.3)));
    });

    // Bulles des actions du pilote
    const bubble = (g, a, cx) => {
      const o = t >= a.t && t < a.t + 1.9 ? Math.min(clamp((t - a.t) / 0.25), clamp((a.t + 1.9 - t) / 0.3)) : 0;
      g.setAttribute('opacity', o);
      pulse(g, t, a.t, cx, 205, 0.06, 0.35);
    };
    bubble(S.act1, ACT1, 745);
    bubble(S.act2, ACT2, 590);
    if (t >= ACT1.t) pulse(S.ops[2].g, t, ACT1.t + 0.1, S.ops[2].cx, FLOOR - 31, 0.08, 0.45);

    // Le débit ne bouge pas
    const io = fading(t) ? fadeOut(t) : t < FADE_END ? 1 : clamp(prog(t, AFTER_T - 0.3, 0.3));
    S.inchange.setAttribute('opacity', io);
    if (t >= AFTER_T - 0.3 && t < AFTER_T + 0.5) pulse(S.debit, t, AFTER_T - 0.3, S.debitC.x, S.debitC.y, 0.08, 0.45);

    // Carte 2 : en-tête, puis les barres se remplissent jour après jour
    pop(S.head, t, HEAD_T, 330, 465);
    const bar = (r, t0, d) => {
      let w = r.days * DAY, o = 1;
      if (fading(t)) o = fadeOut(t);
      else if (t >= FADE_END) { w = r.days * DAY * easeInOut(prog(t, t0, d)); o = clamp(prog(t, t0 - 0.35, 0.3)); }
      r.clip.setAttribute('width', Math.max(0.001, w));
      r.g.setAttribute('opacity', o);
      const fo = t < FADE_END ? 1 : clamp(prog(t, t0 + d, 0.3));
      r.f.setAttribute('opacity', fo);
      r.vaT.setAttribute('opacity', fo);
    };
    bar(S.before, BEFORE_T, BEFORE_D);
    bar(S.after, AFTER_T, AFTER_D);

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
