// Blog · Les MUDA · section « Que veut dire Muda ? Définition et origine du mot »
// Mécanique : le test de la facture appliqué opération par opération. Huit opérations d'un processus, dans l'ordre ;
// chacune se soulève, reçoit la réponse du client et descend dans sa colonne : il paie (valeur ajoutée, sur la
// facture), il refuse (MUDA), ou elle est obligatoire sans valeur (non-valeur ajoutée nécessaire). Pour finir, les
// MUDA se barrent (on les supprime), les non-valeurs ajoutées nécessaires raccourcissent (on les réduit).
// Opérations tirées de l'article ; leur enchaînement dans un même processus est illustratif.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const OPS = [
    { l: ['Découpe'], full: 'Découpe', k: 0 },
    { l: ['Trajet', 'du chariot'], full: 'Trajet du chariot', k: 1 },
    { l: ['Attente devant', 'la machine'], full: 'Attente devant la machine', k: 1 },
    { l: ['Assemblage'], full: 'Assemblage', k: 0 },
    { l: ['Contrôle', 'réglementaire'], full: 'Contrôle réglementaire', k: 2 },
    { l: ['Reprise d’une', 'pièce mal faite'], full: 'Reprise d’une pièce mal faite', k: 1 },
    { l: ['Traçabilité', 'imposée'], full: 'Traçabilité imposée', k: 2 },
    { l: ['Contrôle final', 'exigé'], full: 'Contrôle final exigé', k: 0 },
  ];
  const CW = 131, CH = 62, CY = 262, CX0 = 55, GAP = 6;
  const cardX = i => CX0 + i * (CW + GAP);
  const COLS = [
    { x: 40, head: 'Il paie', sub: 'valeur ajoutée, sur la facture', bg: C.pGreen, fg: C.tGreen, foot: '' },
    { x: 420, head: 'Il refuse', sub: 'MUDA', bg: C.pRed, fg: C.tRed, foot: 'se supprime' },
    { x: 800, head: 'Obligatoire, sans valeur', sub: 'non-valeur ajoutée nécessaire', bg: C.pYellow, fg: C.tYellow, foot: 'se réduit, ne se supprime pas' },
  ];
  const COLW = 360, LINE_Y0 = 476, LINE_DY = 62;
  const T0 = 1.9, STEP = 0.88, FLY = 0.55;
  const T_END = T0 + STEP * OPS.length + 0.3, CHUTE_T = T_END + 1.4;
  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Le test', 'de la facture.');
    G.blogChapeau(`Une opération après l’autre : le client la paierait-il s’il la voyait${NB}?`);

    // Le processus
    G.card(40, 176, 1120, 176);
    S.q = el('g');
    text(S.q, 64, 214, 'Votre processus, dans l’ordre', { size: 20, weight: 700, fill: C.ink });
    S.ops = OPS.map((o, i) => {
      const g = el('g');
      const x = cardX(i);
      const rect = el('rect', { x, y: CY - CH / 2, width: CW, height: CH, rx: 12, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, g);
      o.l.forEach((s, j) => fit(text(g, x + CW / 2, CY + 6 + (o.l.length === 2 ? (j ? 11 : -11) : 0), s, { size: 15, weight: 700, fill: C.ink, anchor: 'middle' }), x + CW - 1, `op ${i}`, x + 1));
      const ans = el('g', {}, g);
      if (o.k === 0) G.check(ans, x + CW - 6, CY - CH / 2 + 2, 12);
      else if (o.k === 1) G.cross(ans, x + CW - 6, CY - CH / 2 + 2, 12);
      else { el('circle', { cx: x + CW - 6, cy: CY - CH / 2 + 2, r: 12, fill: C.yellow }, ans); el('rect', { x: x + CW - 13, y: CY - CH / 2, width: 14, height: 4, rx: 2, fill: C.white }, ans); }
      const fly = g.cloneNode(true);
      fly.removeChild(fly.lastChild);
      G.svg.appendChild(fly);
      return { ...o, g, ans, x, rect, fly, bg: [C.pGreen, C.pRed, C.pYellow][o.k] };
    });
    S.arrow = G.arrow(G.svg, `M 64 322 L 1136 322`, { width: 2.5, head: 10 });

    // Les trois colonnes
    const slot = [0, 0, 0];
    S.cols = COLS.map((c, j) => {
      G.card(c.x, 368, COLW, 390);
      const g = el('g');
      el('rect', { x: c.x + 16, y: 384, width: COLW - 32, height: 64, rx: 14, fill: c.bg }, g);
      text(g, c.x + 32, 412, c.head, { size: 21, weight: 800, fill: c.fg });
      fit(text(g, c.x + 32, 436, c.sub, { size: 17, weight: 500, fill: c.fg }), c.x + COLW - 20, `sous-titre ${j}`);
      const foot = el('g');
      if (c.foot) {
        if (j === 1) G.cross(foot, c.x + 38, 726, 11); else { el('circle', { cx: c.x + 38, cy: 726, r: 11, fill: C.yellow }, foot); el('rect', { x: c.x + 31, y: 724, width: 14, height: 4, rx: 2, fill: C.white }, foot); }
        fit(text(foot, c.x + 58, 732, c.foot, { size: 18, weight: 700, fill: c.fg }), c.x + COLW - 16, `pied ${j}`);
      } else {
        G.check(foot, c.x + 38, 726, 11);
        text(foot, c.x + 58, 732, 'il accepte de la payer', { size: 18, weight: 700, fill: c.fg });
      }
      return { ...c, g, foot };
    });
    S.lines = OPS.map((o, i) => {
      const c = COLS[o.k];
      const n = slot[o.k]++;
      const y = LINE_Y0 + n * LINE_DY;
      const g = el('g');
      if (o.k === 0 && n) el('line', { x1: c.x + 24, y1: y - 34, x2: c.x + COLW - 24, y2: y - 34, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, g);
      const tx = text(g, c.x + 32, y + 6, o.full, { size: 19, weight: 600, fill: C.ink });
      fit(tx, c.x + COLW - 16, `ligne ${i}`);
      const extra = { g, x: c.x + 32, y, k: o.k };
      if (o.k === 1) extra.strike = el('line', { x1: c.x + 28, y1: y, x2: c.x + 28, y2: y, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' });
      if (o.k === 2) { extra.bar = el('rect', { x: c.x + 32, y: y + 16, width: 200, height: 10, rx: 5, fill: C.yellow }, g); extra.ghost = el('rect', { x: c.x + 32, y: y + 16, width: 200, height: 10, rx: 5, fill: 'none', stroke: C.yellow, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, g); }
      extra.w = 0;
      return extra;
    });
    // Longueur des barrés (mesurée après construction)
    S.lines.forEach((l, i) => { if (l.strike) l.sw = l.g.querySelector('text').getComputedTextLength() + 8; });

    S.chute = G.blogChute('Ce qu’il refuserait de payer est un MUDA.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;
    S.q.setAttribute('opacity', fo * (live ? clamp(prog(t, 1.7, 0.3)) : 1));
    S.arrow.draw(live ? easeInOut(prog(t, 1.7, 0.6)) : 1);
    S.arrow.g.setAttribute('opacity', fo);
    S.cols.forEach((c, j) => { pop(c.g, t, 1.8 + 0.1 * j, c.x + COLW / 2, 416); });

    S.ops.forEach((o, i) => {
      const t0 = T0 + STEP * i;
      const l = S.lines[i];
      let dx = 0, dy = 0, o1 = 1, s = 1;
      if (!live) o1 = 0;                                    // la copie en vol n'existe que pendant le tri
      else {
        const lift = easeOut(prog(t, t0, 0.2));
        dy = -16 * lift;
        const f = prog(t, t0 + 0.3, FLY);
        if (f > 0) {
          const e = easeInOut(f);
          const tx = l.x + 60 - (o.x + CW / 2), ty = l.y - CY;
          dx = tx * e; dy = -16 + (ty + 16) * e;
          s = 1 - 0.35 * e;
          o1 = 1 - clamp((f - 0.75) / 0.25);
        }
        o1 *= clamp(prog(t, 1.75 + 0.05 * i, 0.3));
      }
      const cx = o.x + CW / 2;
      o.fly.setAttribute('transform', `translate(${dx} ${dy}) translate(${cx} ${CY}) scale(${s}) translate(${-cx} ${-CY})`);
      o.fly.setAttribute('opacity', live && t >= t0 ? o1 : 0);
      // Carte restée dans le processus : teintée par la réponse
      const answered = live ? t >= t0 + 0.12 : true;
      o.rect.setAttribute('fill', answered ? o.bg : C.white);
      o.g.setAttribute('opacity', fo * (live ? clamp(prog(t, 1.75 + 0.05 * i, 0.3)) : 1));
      o.ans.setAttribute('opacity', live ? clamp(prog(t, t0 + 0.12, 0.15)) : 1);
      // Ligne dans la colonne
      l.g.setAttribute('opacity', fo * (live ? clamp(prog(t, t0 + 0.3 + FLY * 0.8, 0.2)) : 1));
      if (l.strike) {
        const p = live ? easeOut(prog(t, T_END + 0.1 * i / 3, 0.4)) : 1;
        l.strike.setAttribute('x2', l.x - 4 + l.sw * p);
        l.strike.setAttribute('opacity', fo * (p > 0 ? 1 : 0));
      }
      if (l.bar) {
        const p = live ? easeInOut(prog(t, T_END + 0.3, 0.6)) : 1;
        l.bar.setAttribute('width', 200 - 90 * p);
        l.ghost.setAttribute('opacity', p > 0 ? 1 : 0);
      }
    });
    S.cols.forEach((c, j) => c.foot.setAttribute('opacity', fo * (live ? clamp(prog(t, T_END + 0.2 * j, 0.3)) : 1)));

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
