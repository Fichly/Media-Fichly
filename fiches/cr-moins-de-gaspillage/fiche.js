// Fiche LinkedIn · Clément Raymond · mercredi 7 octobre 2026
// Post : « Réduire les gaspillages ne veut pas dire réduire les effectifs. »
// Premier commentaire du post (Buffer) : guide des 8 gaspillages → encart bas gauche.
// Mécanique : les gaspillages retirés d'une journée deviennent du temps libéré ; ce même temps
// part dans deux colonnes. Tâche supprimée : il est réinvesti et l'équipe continue de signaler.
// Personne supprimée : un poste part et plus personne ne signale rien.
// Rendu déterministe : window.FICHE.draw(t), t en secondes, boucle de 14 s.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, noOverlap, prog, easeInOut, easeOut, back, clamp, invEaseInOut, FADE_START, FADE_END, fading, fadeOut, pop, rise } = G;
  const svg = () => G.svg;

  // ---------- Pictos ----------
  function hourglass(parent, cx, cy) {
    el('path', {
      d: `M ${cx - 8} ${cy - 11} H ${cx + 8} M ${cx - 8} ${cy + 11} H ${cx + 8}
          M ${cx - 6} ${cy - 11} C ${cx - 6} ${cy - 3}, ${cx + 6} ${cy + 3}, ${cx + 6} ${cy + 11}
          M ${cx + 6} ${cy - 11} C ${cx + 6} ${cy - 3}, ${cx - 6} ${cy + 3}, ${cx - 6} ${cy + 11}`,
      fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round',
    }, parent);
  }
  // Aller-retour ⇄
  function allerRetour(parent, cx, cy) {
    el('path', {
      d: `M ${cx - 11} ${cy - 5} H ${cx + 10} M ${cx + 4} ${cy - 11} L ${cx + 10} ${cy - 5} L ${cx + 4} ${cy + 1}
          M ${cx + 11} ${cy + 6} H ${cx - 10} M ${cx - 4} ${cy} L ${cx - 10} ${cy + 6} L ${cx - 4} ${cy + 12}`,
      fill: 'none', stroke: C.white, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, parent);
  }
  function resaisie(parent, cx, cy) {
    el('rect', { x: cx - 11, y: cy - 12, width: 15, height: 19, rx: 3, fill: 'none', stroke: C.white, 'stroke-width': 2.6 }, parent);
    el('rect', { x: cx - 4, y: cy - 6, width: 15, height: 19, rx: 3, fill: C.red, stroke: C.white, 'stroke-width': 2.6 }, parent);
    el('path', { d: `M ${cx} ${cy + 1} H ${cx + 7} M ${cx} ${cy + 6} H ${cx + 5}`, stroke: C.white, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, parent);
  }
  // Boucle ↻ (on recommence) : arc de 290° et pointe de flèche tangente
  function loopIcon(parent, cx, cy, r = 11, color = C.tGreen) {
    const g = el('g', {}, parent);
    const a0 = -40 * Math.PI / 180, a1 = a0 + 290 * Math.PI / 180;
    const P = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = P(a0), [x1, y1] = P(a1);
    el('path', { d: `M ${x0} ${y0} A ${r} ${r} 0 1 1 ${x1} ${y1}`, fill: 'none', stroke: color, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, g);
    const tx = -Math.sin(a1), ty = Math.cos(a1); // tangente (sens horaire)
    const nx = Math.cos(a1), ny = Math.sin(a1);
    const tip = [x1 + tx * 4, y1 + ty * 4];
    el('path', {
      d: `M ${tip[0] - tx * 7 + nx * 5.5} ${tip[1] - ty * 7 + ny * 5.5} L ${tip[0]} ${tip[1]} L ${tip[0] - tx * 7 - nx * 5.5} ${tip[1] - ty * 7 - ny * 5.5}`,
      fill: 'none', stroke: color, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, g);
    return g;
  }
  // Silhouette : tête et buste, pieds sur la ligne y
  function person(parent, x, y, color, ghost = false) {
    const g = el('g', {}, parent);
    const body = `M ${x - 26} ${y} V ${y - 18} Q ${x - 26} ${y - 38} ${x - 8} ${y - 38} H ${x + 8} Q ${x + 26} ${y - 38} ${x + 26} ${y - 18} V ${y} Z`;
    const style = ghost
      ? { fill: 'none', stroke: C.tRed, 'stroke-width': 2.6, 'stroke-dasharray': '6 5' }
      : { fill: color };
    el('path', { d: body, ...style }, g);
    el('circle', { cx: x, cy: y - 56, r: 15, ...style }, g);
    return g;
  }
  // Bulle au-dessus d'une tête : « ! » jaune (on signale) ou « … » grise (on se tait)
  function bubble(parent, x, y, kind) {
    const g = el('g', {}, parent);
    const fill = kind === 'signal' ? C.yellow : '#dcdce6';
    el('rect', { x: x - 20, y: y - 16, width: 40, height: 32, rx: 11, fill }, g);
    el('path', { d: `M ${x - 12} ${y + 12} L ${x - 17} ${y + 24} L ${x - 2} ${y + 14} Z`, fill }, g);
    if (kind === 'signal') text(g, x, y + 9, '!', { size: 25, weight: 800, fill: C.ink, anchor: 'middle' });
    else [-9, 0, 9].forEach(dx => el('circle', { cx: x + dx, cy: y, r: 2.8, fill: '#8f8fa8' }, g));
    return g;
  }
  // Bloc « Temps libéré » : hachures bleues, bord pointillé
  function freedBlock(parent, x, y, w, h) {
    const g = el('g', {}, parent);
    el('rect', { x, y, width: w, height: h, rx: 10, fill: '#e4e8f6' }, g);
    el('rect', { x, y, width: w, height: h, rx: 10, fill: 'url(#hatch)' }, g);
    el('rect', { x: x + 1.25, y: y + 1.25, width: w - 2.5, height: h - 2.5, rx: 9, fill: 'none', stroke: C.blue, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, g);
    const lbl = text(g, x + w / 2, y + h / 2 + 7.5, 'Temps libéré', { size: 21, weight: 700, fill: C.blue, anchor: 'middle' });
    return { g, lbl };
  }
  const arrowDown = (parent, cx, y0, y1, color) => {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx} ${y0} V ${y1} M ${cx - 8} ${y1 - 8} L ${cx} ${y1} L ${cx + 8} ${y1 - 8}`, fill: 'none', stroke: color, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  };
  const scaleAt = (g, s, cx, cy) => g.setAttribute('transform', s === 1 ? '' : `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`);
  // Opacité pendant l'image livrée (1) et l'effacement ; null ensuite (l'animation décide)
  const before = t => (t < FADE_START ? 1 : fading(t) ? fadeOut(t) : null);

  // ---------- Mise en page ----------
  const BAR_X = 230, BAR_W = 754, BAR_H = 44;
  const Y_AVANT = 392, Y_APRES = 462;
  // La journée : travail utile (vert) et trois gaspillages (rouge), largeurs en px
  const SEGS = [
    { w: 120 }, { w: 104, waste: 'Attente', icon: hourglass }, { w: 150 },
    { w: 104, waste: 'Déplacement', icon: allerRetour }, { w: 110 },
    { w: 104, waste: 'Ressaisie', icon: resaisie }, { w: 66 },
  ];
  const FREED_W = SEGS.filter(s => s.waste).reduce((a, s) => a + s.w, 0);
  const FREED_X = BAR_X + BAR_W - FREED_W;
  const COLS = [
    { x: 60, bg: C.pGreen, fg: C.tGreen, n: 1, head: 'Supprimer une tâche inutile' },
    { x: 552, bg: C.pRed, fg: C.tRed, n: 2, head: 'Supprimer une personne' },
  ].map(c => ({ ...c, w: 468, cx: c.x + 234 }));
  const COL_TOP = 596, COL_BOT = 1046;
  const Y_FREED = 664, FEET = 962, Y_BUBBLE = 862;
  const TEAM_DX = [-162, -54, 54, 162];
  const TEAM_COLORS = [C.blue, C.teal, C.violet, C.lightBlue];

  const S = {};

  function build() {
    G.template({ author: 'clement' });
    G.title('Moins de gaspillage,', 'pas moins de gens.');
    G.chapeau('Signaler un gaspillage, c’est signaler du temps libéré.');

    const defs = svg().querySelector('defs') || el('defs');
    const pat = el('pattern', { id: 'hatch', width: 14, height: 14, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { x: 0, y: 0, width: 5, height: 14, fill: C.blue, 'fill-opacity': 0.13 }, pat);

    // ----- Carte 1 : la journée, avant et après -----
    G.card(60, 330, 960, 204);
    text(svg(), 96, Y_AVANT + 30, 'Avant', { size: 23, weight: 700, fill: C.ink });
    text(svg(), 96, Y_APRES + 30, 'Après', { size: 23, weight: 700, fill: C.ink });

    // Barre « Avant », révélée de gauche à droite par une découpe
    S.sweep = G.clipRect(BAR_X - 2, Y_AVANT - 4, BAR_W + 4, BAR_H + 8);
    S.avant = el('g', { 'clip-path': S.sweep.url });
    S.labels = [];
    let x = BAR_X;
    SEGS.forEach((s, i) => {
      s.ax = x;
      x += s.w;
      const fill = s.waste ? C.red : C.green;
      el('rect', { x: s.ax + 2, y: Y_AVANT, width: s.w - 4, height: BAR_H, rx: 10, fill }, S.avant);
      if (s.waste) {
        s.icon(S.avant, s.ax + s.w / 2, Y_AVANT + BAR_H / 2);
        const g = el('g');
        const lb = text(g, s.ax + s.w / 2, 372, s.waste, { size: 20, weight: 700, fill: C.tRed, anchor: 'middle' });
        fit(lb, 1000, `gaspillage ${s.waste}`, 80);
        S.labels.push({ g, cx: s.ax + s.w / 2, f: (s.ax + s.w / 2 - BAR_X) / BAR_W });
      }
    });

    // Barre « Après » : copie de la journée ; les gaspillages en sortent, le travail utile se resserre à gauche
    let px = BAR_X, wk = 0;
    S.moves = SEGS.map((s, i) => {
      const g = el('g');
      const fill = s.waste ? C.red : C.green;
      el('rect', { x: 2, y: 0, width: s.w - 4, height: BAR_H, rx: 10, fill }, g);
      if (s.waste) s.icon(g, s.w / 2, BAR_H / 2);
      const tx = s.waste ? s.ax : px;
      if (!s.waste) px += s.w;
      return { g, waste: !!s.waste, k: s.waste ? wk++ : -1, ax: s.ax, tx, w: s.w };
    });
    // Le temps libéré s'ouvre à droite, au rythme où le travail utile se resserre
    S.freedClip = G.clipRect(FREED_X, Y_APRES - 4, FREED_W + 4, BAR_H + 8);
    S.freedA = freedBlock(svg(), FREED_X + 2, Y_APRES, FREED_W - 4, BAR_H);
    S.freedA.g.setAttribute('clip-path', S.freedClip.url);

    // ----- Même gain, deux suites -----
    S.split = el('g');
    const [L, R] = [COLS[0].cx, COLS[1].cx];
    el('path', {
      d: `M ${L} 592 V 577 Q ${L} 565 ${L + 12} 565 H ${R - 12} Q ${R} 565 ${R} 577 V 592
          M ${L - 7} 585 L ${L} 592 L ${L + 7} 585 M ${R - 7} 585 L ${R} 592 L ${R + 7} 585`,
      fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, S.split);
    const sp = G.pill(S.split, 540, 565, 'Même gain sur le papier', { size: 20, h: 36, bg: C.blue, fg: C.white, anchor: 'middle' });
    fit(sp.tx, R - 20, 'pilule même gain', L + 20);

    // ----- Les deux colonnes -----
    COLS.forEach((c, ci) => {
      el('rect', { x: c.x, y: COL_TOP, width: c.w, height: COL_BOT - COL_TOP, rx: 24, fill: c.bg });
      // En-tête : pastille numérotée + intitulé du post
      c.head_g = el('g');
      const ht = text(c.head_g, 0, 644, c.head, { size: 23, weight: 700, fill: c.fg });
      const hw = 38 + 12 + measure(ht).width;
      const hx = c.cx - hw / 2;
      G.badgeNum(c.head_g, hx + 19, 636, c.n, 19);
      ht.setAttribute('x', hx + 50);
      fit(ht, c.x + c.w - 16, `en-tête colonne ${c.n}`, c.x + 16);

      // Le même temps libéré, au même format que dans la barre
      c.freed = freedBlock(svg(), c.cx - (FREED_W - 4) / 2, Y_FREED, FREED_W - 4, BAR_H);
      c.arrow = arrowDown(svg(), c.cx, 716, 740, c.fg);

      // Équipe de quatre
      c.team = TEAM_DX.map((dx, k) => {
        const outer = el('g');
        const ghost = ci === 1 && k === 3 ? person(outer, c.cx + dx, FEET, null, true) : null;
        const inner = el('g', {}, outer);
        person(inner, c.cx + dx, FEET, TEAM_COLORS[k]);
        return { outer, inner, ghost, x: c.cx + dx };
      });
      c.bubbles = c.team
        .filter(m => !m.ghost)
        .map(m => ({ g: bubble(svg(), m.x + 22, Y_BUBBLE, ci === 0 ? 'signal' : 'silence'), x: m.x + 22 }));
    });

    // Colonne 1 : le temps libéré est réinvesti
    const c1 = COLS[0];
    const dest = [['Plus de volume', 'Formation'], ['Plus d’amélioration', 'Polyvalence']];
    c1.dest = [];
    dest.forEach((row, r) => {
      const cy = 766 + 46 * r;
      const probe = row.map(l => G.pill(svg(), 0, cy, l, { size: 20, h: 38, pad: 14, bg: C.white, fg: C.tGreen, icon: 'check' }));
      const total = probe.reduce((a, p) => a + p.w, 0) + 10;
      probe.forEach(p => p.g.remove());
      let x0 = c1.cx - total / 2;
      row.forEach(l => {
        const p = G.pill(svg(), x0, cy, l, { size: 20, h: 38, pad: 14, bg: C.white, fg: C.tGreen, icon: 'check' });
        fit(p.tx, c1.x + c1.w - 14, `destination ${l}`, c1.x + 14);
        c1.dest.push({ g: p.g, cx: x0 + p.w / 2, cy });
        x0 += p.w + 10;
      });
    });
    // Colonne 2 : le temps libéré devient un poste en moins
    const c2 = COLS[1];
    c2.cut = el('g');
    const cp = G.pill(c2.cut, c2.cx, 789, 'Un poste en moins', { size: 23, h: 46, pad: 20, bg: C.white, fg: C.tRed, icon: 'cross', anchor: 'middle' });
    fit(cp.tx, c2.x + c2.w - 14, 'pilule poste en moins', c2.x + 14);

    // La suite, en une ligne par colonne
    const caption = (c, label, icon) => {
      const g = el('g');
      const tx = text(g, 0, 1014, label, { size: 23, weight: 700, fill: c.fg });
      const w = 30 + 10 + measure(tx).width;
      const x0 = c.cx - w / 2;
      tx.setAttribute('x', x0 + 40);
      const ig = icon(g, x0 + 15, 1006);
      fit(tx, c.x + c.w - 14, `légende colonne ${c.n}`, c.x + 14);
      return { g, ig, icx: x0 + 15 };
    };
    c1.caption = caption(c1, 'On cherche le prochain.', (g, x, y) => loopIcon(g, x, y));
    c2.caption = caption(c2, 'On n’en trouvera plus.', (g, x, y) => { const k = el('g', {}, g); G.cross(k, x, y, 14); return k; });

    // Les copies qui volent vers les colonnes passent au premier plan
    COLS.forEach(c => { c.fly = freedBlock(svg(), FREED_X + 2, Y_APRES, FREED_W - 4, BAR_H); });

    S.chute = G.chute('Avant de lancer une démarche, décidez ce que devient', 'le temps libéré. Et dites-le.');
    G.encart(['Les 8 gaspillages', 'Notre guide complet', '(lien en commentaire)']);

    noOverlap(c1.dest[1].g, c1.team[3].outer, 'destinations / équipe');
    S.cols = COLS;
  }

  // ================= Animation =================
  const T = {
    sweep: 1.7, sweepD: 0.9,       // la journée se dessine
    drop: 2.85,                    // elle se recopie sur la ligne « Après »
    remove: 3.45,                  // les gaspillages en sortent
    pack: 3.95, packD: 0.75,       // le travail utile se resserre, le temps libéré s'ouvre
    split: 5.0, heads: 5.15,       // même gain, deux colonnes
    fly: 5.35, flyD: 0.95,         // le temps libéré part dans les colonnes
    team: 6.3,                     // les équipes
    dest: 6.9,                     // colonne 1 : réinvesti
    cut: 7.85, leave: 8.4,         // colonne 2 : un poste en moins, quelqu'un part
    signal: 9.35, cap1: 10.2,      // colonne 1 : on continue de signaler
    silence: 10.75, cap2: 11.25,   // colonne 2 : silence
    chute: 11.8,
  };

  function draw(t) {
    const b = before(t);
    const cols = S.cols;

    // --- La journée « Avant » ---
    S.avant.setAttribute('opacity', b ?? 1);
    const sw = b !== null ? 1 : easeInOut(prog(t, T.sweep, T.sweepD));
    S.sweep.rect.setAttribute('width', (BAR_W + 4) * sw);
    S.labels.forEach(l => pop(l.g, t, T.sweep + T.sweepD * invEaseInOut(l.f) - 0.05, l.cx, 365));

    // --- « Après » : copie de la journée, les gaspillages sortent, le travail utile se resserre ---
    const pk = b !== null ? 1 : easeInOut(prog(t, T.pack, T.packD));
    let edge = FREED_X;
    S.moves.forEach((m, i) => {
      let x = m.tx, y = Y_APRES, o, s = 1;
      if (b !== null) o = m.waste ? 0 : b;
      else {
        const pd = prog(t, T.drop + 0.04 * i, 0.45);
        y = Y_AVANT + (Y_APRES - Y_AVANT) * easeInOut(pd);
        o = pd <= 0 ? 0 : 1;
        if (m.waste) {
          const pr = prog(t, T.remove + 0.12 * m.k, 0.35);
          s = 1 - 0.55 * easeInOut(pr);
          y -= 8 * easeOut(pr);
          o *= 1 - pr;
        } else x = m.ax + (m.tx - m.ax) * pk;
      }
      if (i === S.moves.length - 1) edge = x + m.w;
      const sc = s === 1 ? '' : ` translate(${m.w / 2} ${BAR_H / 2}) scale(${s}) translate(${-m.w / 2} ${-BAR_H / 2})`;
      m.g.setAttribute('transform', `translate(${x} ${y})${sc}`);
      m.g.setAttribute('opacity', o);
    });
    S.freedClip.rect.setAttribute('x', edge);
    S.freedClip.rect.setAttribute('width', Math.max(0, BAR_X + BAR_W + 4 - edge));
    S.freedA.g.setAttribute('opacity', b ?? (t >= T.pack ? 1 : 0));
    const lp = b !== null ? 1 : easeOut(prog(t, T.pack + T.packD - 0.15, 0.4));
    S.freedA.lbl.setAttribute('transform', lp >= 1 ? '' : `translate(0 ${10 * (1 - lp)})`);
    S.freedA.lbl.setAttribute('opacity', b ?? lp);

    // --- Même gain, deux suites ---
    pop(S.split, t, T.split, 540, 565, 0.4);
    cols.forEach((c, ci) => {
      pop(c.head_g, t, T.heads + 0.15 * ci, c.cx, 636);

      // Le bloc descend de la barre, puis glisse vers sa colonne
      const p = prog(t, T.fly + 0.15 * ci, T.flyD);
      const arrived = b !== null || p >= 1;
      c.freed.g.setAttribute('opacity', b ?? (arrived ? 1 : 0));
      if (b === null && p > 0 && p < 1) {
        const ey = easeInOut(clamp(p / 0.7)), ex = easeInOut(clamp((p - 0.2) / 0.8));
        const dx = (c.cx - (FREED_W - 4) / 2 - (FREED_X + 2)) * ex;
        const dy = (Y_FREED - Y_APRES) * ey;
        c.fly.g.setAttribute('transform', `translate(${dx} ${dy})`);
        c.fly.g.setAttribute('opacity', 1);
      } else c.fly.g.setAttribute('opacity', 0);

      // L'équipe
      c.team.forEach((m, k) => pop(m.outer, t, T.team + 0.07 * k + 0.1 * ci, m.x, FEET - 30, 0.4));
      pop(c.arrow, t, ci === 0 ? T.dest - 0.25 : T.cut - 0.25, c.cx, 728, 0.3);
    });

    // --- Colonne 1 : le temps libéré est réinvesti ---
    const c1 = cols[0], c2 = cols[1];
    c1.dest.forEach((d, k) => {
      let o, s = 1, dx = 0, dy = 0;
      if (b !== null) o = b;
      else {
        const p = prog(t, T.dest + 0.13 * k, 0.5);
        const e = easeOut(p);
        dx = (c1.cx - d.cx) * (1 - e);
        dy = (Y_FREED + BAR_H / 2 - d.cy) * (1 - e);
        s = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.5 + 0.5 * back(p);
        o = clamp(p / 0.3);
      }
      d.g.setAttribute('transform', s === 1 && dx === 0 ? '' : `translate(${dx} ${dy}) translate(${d.cx} ${d.cy}) scale(${s}) translate(${-d.cx} ${-d.cy})`);
      d.g.setAttribute('opacity', o);
    });

    // --- Colonne 2 : un poste en moins, quelqu'un s'en va ---
    pop(c2.cut, t, T.cut, c2.cx, 789, 0.4);
    const leaver = c2.team[3];
    const lv = b !== null ? 1 : easeInOut(prog(t, T.leave, 0.75));
    leaver.inner.setAttribute('transform', lv === 0 ? '' : `translate(${46 * lv} 0)`);
    leaver.inner.setAttribute('opacity', 1 - lv);
    leaver.ghost.setAttribute('opacity', b !== null ? 1 : easeOut(prog(t, T.leave + 0.3, 0.5)));

    // --- La suite ---
    c1.bubbles.forEach((bb, k) => pop(bb.g, t, T.signal + 0.18 * k, bb.x - 12, Y_BUBBLE + 20, 0.4));
    rise(c1.caption.g, t, T.cap1, 0.45);
    const rot = b !== null ? 0 : 360 * easeInOut(prog(t, T.cap1 + 0.25, 0.9));
    c1.caption.ig.setAttribute('transform', rot % 360 === 0 ? '' : `rotate(${rot} ${c1.caption.icx} 1006)`);
    c2.bubbles.forEach((bb, k) => rise(bb.g, t, T.silence + 0.12 * k, 0.5, 10));
    rise(c2.caption.g, t, T.cap2, 0.45);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
