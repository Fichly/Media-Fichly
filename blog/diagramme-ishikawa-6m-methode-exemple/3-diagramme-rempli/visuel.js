// Blog · Diagramme d'Ishikawa · section « Un diagramme d'Ishikawa rempli, branche par branche »
// Mécanique : le diagramme se remplit famille par famille avec les causes relevées en séance (tableau de l'article),
// les trois causes candidates passent en rouge, puis chacune descend dans la liste de vérifications :
// ce qu'on vérifie, qui (un nom), pour quand (une date fixe). Le schéma reste en haut, la liste est le livrable.
// Textes des causes et des vérifications : tableaux de l'article (formulations raccourcies).
// Rendu déterministe : window.FICHE.draw(t), boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;

  const SPINE = { x0: 64, x1: 895, y: 332 };
  const JX = [350, 615, 880];
  const DX = 70, DY = 115;
  const NW = 212, NH = 42;
  const FAM = [
    { name: 'Main d’œuvre', j: 0, up: true }, { name: 'Matière', j: 1, up: true }, { name: 'Matériel', j: 2, up: true },
    { name: 'Méthode', j: 0, up: false }, { name: 'Milieu', j: 1, up: false }, { name: 'Mesure', j: 2, up: false },
  ];
  // row : 0 = près de l'arête, 1 = loin ; cand : rang dans la liste de vérifications
  const NOTES = [
    { txt: 'Nouvel opérateur sur l’équipe de nuit', fam: 0, row: 1 },
    { txt: 'Geste de reprise transmis oralement', fam: 0, row: 0 },
    { txt: 'Changement de lot fournisseur', fam: 1, row: 1, cand: 2 },
    { txt: 'Conditions de stockage avant mise en ligne', fam: 1, row: 0 },
    { txt: 'Usure de l’outil coupant', fam: 2, row: 1 },
    { txt: 'Jeu apparu sur le bridage', fam: 2, row: 0 },
    { txt: 'Deux versions de la gamme en circulation', fam: 3, row: 0, cand: 1 },
    { txt: 'Autocontrôle décrit mais non outillé', fam: 3, row: 1 },
    { txt: 'Éclairage du poste de contrôle', fam: 4, row: 0 },
    { txt: 'Encombrement de la zone de dépose', fam: 4, row: 1 },
    { txt: 'Critère d’acceptation interprété différemment', fam: 5, row: 0, cand: 0 },
    { txt: 'Étalonnage du calibre', fam: 5, row: 1 },
  ];
  const ROWS = [
    { cause: 'Critère d’acceptation interprété différemment', verif: 'Trois contrôleurs mesurent les trois mêmes pièces', qui: 'Responsable qualité', quand: 'Sous une semaine' },
    { cause: 'Deux versions de la gamme en circulation', verif: 'Relevé des documents affichés aux trois postes', qui: 'Référent méthodes', quand: 'Sous une semaine' },
    { cause: 'Changement de lot fournisseur', verif: 'Croisement des dates de rebut et des numéros de lot', qui: 'Approvisionneur', quand: 'Sous deux semaines' },
  ];
  const COLS = [
    { x: 60, w: 300, head: 'Cause candidate' },
    { x: 370, w: 380, head: 'Vérification à mener' },
    { x: 760, w: 200, head: 'Qui (un nom)' },
    { x: 970, w: 170, head: 'Pour quand' },
  ];
  const TAB = { y: 492, hh: 34, rh: 58, gap: 4 };
  const rowY = k => TAB.y + TAB.hh + TAB.gap + k * (TAB.rh + TAB.gap);
  const NOTE_T = i => 3.0 + 0.16 * i;
  const RED_T = k => 5.5 + 0.35 * k;
  const TAB_T = 6.9;
  const ROW_T = k => 7.5 + 1.6 * k;
  const PILL_T = ROW_T(2) + 1.8;
  const CHUTE_T = PILL_T + 0.6;
  const S = {};

  const branchX = (f, y) => JX[f.j] - DX * Math.abs(SPINE.y - y) / DY;
  function slot(fam, row) {
    const f = FAM[fam];
    const cy = f.up ? (row ? 245 : 293) : (row ? 419 : 371);
    const far = f.up ? cy - NH / 2 : cy + NH / 2;
    return { x: branchX(f, far) - 8 - NW, y: cy - NH / 2 };
  }
  function noteBody(parent, str) {
    const g = el('g', {}, parent);
    const r = el('rect', { x: 0, y: 0, width: NW, height: NH, rx: 7, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 1.5 }, g);
    const p = G.para(g, 9, 18, str, NW - 16, { size: 15, weight: 500, fill: C.ink, lh: 1.2 });
    if (p.n === 1) p.t.setAttribute('y', 26);
    if (p.n > 2) console.error(`Note sur ${p.n} lignes : ${str}`);
    fit(p.t, NW - 3, `note « ${str} »`);
    return { g, r, t: p.t };
  }
  // Texte de cellule : une ou deux lignes, centré verticalement dans la rangée
  function cell(parent, x, y, w, str, opts) {
    const p = G.para(parent, x, 0, str, w - 12, { size: 16, weight: 500, fill: C.ink, lh: 1.25, ...opts });
    p.t.setAttribute('y', y + TAB.rh / 2 + (p.n === 1 ? 6 : -4));
    if (p.n > 2) console.error(`Cellule sur ${p.n} lignes : ${str}`);
    fit(p.t, x + w - 4, `cellule « ${str} »`);
    return p.t;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Six branches,', 'trois vérifications.', { size: 48 });
    G.blogChapeau('Un diagramme rempli : les causes candidates en rouge, et ce qu’il faut vérifier.');
    G.card(40, 176, 1120, 584);

    // Effet et arête
    S.effect = el('g');
    el('rect', { x: 906, y: 270, width: 234, height: 124, rx: 18, fill: C.pRed, stroke: C.red, 'stroke-width': 2.5 }, S.effect);
    text(S.effect, 1023, 296, 'Effet', { size: 15, weight: 500, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1023, 325, 'Taux de rebut', { size: 21, weight: 800, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1023, 351, 'en hausse', { size: 21, weight: 800, fill: C.tRed, anchor: 'middle' });
    text(S.effect, 1023, 378, 'référence la plus produite', { size: 15, weight: 500, fill: C.tRed, anchor: 'middle' });
    S.spine = G.arrow(G.svg, `M ${SPINE.x0} ${SPINE.y} L ${SPINE.x1} ${SPINE.y}`, { width: 5, head: 14, stroke: C.ink });
    S.fam = FAM.map(f => {
      const g = el('g');
      const yEnd = f.up ? SPINE.y - DY : SPINE.y + DY;
      const x0 = JX[f.j] - DX, len = Math.hypot(DX, DY);
      const line = el('line', { x1: x0, y1: yEnd, x2: JX[f.j], y2: SPINE.y, stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': `${len} ${len}` }, g);
      const pg = el('g', {}, g);
      const py = f.up ? yEnd - 16 : yEnd + 16;
      G.pill(pg, x0, py, f.name, { size: 17, h: 32, bg: C.pLav, fg: C.blue, anchor: 'middle' });
      return { ...f, g, line, len, pg, px: x0, py };
    });
    S.legend = el('g');
    const lg = G.pill(S.legend, 1023, 426, 'cause candidate', { size: 16, h: 32, pad: 12, bg: C.pRed, fg: C.tRed, anchor: 'middle' });
    lg.g.querySelector('rect').setAttribute('stroke', C.red);
    lg.g.querySelector('rect').setAttribute('stroke-width', 2.5);

    S.notes = NOTES.map((n, i) => {
      const wrap = el('g'), sl = slot(n.fam, n.row), b = noteBody(wrap, n.txt);
      b.g.setAttribute('transform', `translate(${sl.x} ${sl.y})`);
      return { ...n, ...b, wrap, i, slot: sl };
    });

    // Liste de vérifications
    S.tab = el('g');
    el('rect', { x: 52, y: TAB.y, width: 1096, height: TAB.hh, rx: 10, fill: C.blue }, S.tab);
    COLS.forEach((c, i) => fit(text(S.tab, c.x + 6, TAB.y + 23, c.head, { size: 16, weight: 700, fill: C.white }), c.x + c.w, `en-tête ${i}`));
    ROWS.forEach((r, k) => el('rect', { x: 52, y: rowY(k), width: 1096, height: TAB.rh, rx: 10, fill: k % 2 ? C.card : C.pLav, stroke: C.line, 'stroke-width': 1.5 }, S.tab));
    S.rows = ROWS.map((r, k) => {
      const y = rowY(k);
      const c1 = el('g'), c2 = el('g'), c3 = el('g'), c4 = el('g');
      cell(c1, COLS[0].x + 6, y, COLS[0].w, r.cause, { weight: 700, fill: C.tRed });
      cell(c2, COLS[1].x + 6, y, COLS[1].w, r.verif);
      // Qui : pictogramme de personne + fonction ; Pour quand : calendrier + délai
      const px = COLS[2].x + 18, py = y + TAB.rh / 2;
      el('circle', { cx: px, cy: py - 8, r: 6, fill: C.blue }, c3);
      el('path', { d: `M ${px - 10} ${py + 12} L ${px - 10} ${py + 5} Q ${px - 10} ${py - 1} ${px} ${py - 1} Q ${px + 10} ${py - 1} ${px + 10} ${py + 5} L ${px + 10} ${py + 12} Z`, fill: C.blue }, c3);
      cell(c3, COLS[2].x + 36, y, COLS[2].w - 30, r.qui, { weight: 700, fill: C.blue });
      const cx = COLS[3].x + 16;
      el('rect', { x: cx - 10, y: py - 10, width: 20, height: 20, rx: 4, fill: 'none', stroke: C.blue, 'stroke-width': 2.5 }, c4);
      el('rect', { x: cx - 10, y: py - 10, width: 20, height: 6, rx: 2, fill: C.blue }, c4);
      cell(c4, COLS[3].x + 32, y, COLS[3].w - 26, r.quand, { weight: 700, fill: C.blue });
      return { c1, c2, c3, c4, y };
    });
    // Copies volantes des candidates
    S.flyers = S.notes.filter(n => n.cand !== undefined).map(n => {
      const b = noteBody(G.svg, n.txt);
      b.r.setAttribute('fill', C.pRed); b.r.setAttribute('stroke', C.red); b.r.setAttribute('stroke-width', 3); b.t.setAttribute('fill', C.tRed);
      return { ...b, n };
    });

    S.pill = el('g');
    G.pill(S.pill, 1148, 738, 'Écrite avant de quitter la salle', { size: 16, h: 32, pad: 14, bg: C.pGreen, fg: C.tGreen, icon: 'check' }).g.setAttribute('transform', 'translate(-300 0)');
    S.chute = G.blogChute('Le livrable n’est pas le schéma : c’est la liste de vérifications.', { y: 808 });
  }

  function place(g, x, y, s = 1) { g.setAttribute('transform', `translate(${x} ${y})` + (s !== 1 ? ` scale(${s})` : '')); }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.effect, t, 1.8, 1023, 332);
    const qs = live ? easeInOut(prog(t, 2.0, 0.5)) : 1;
    S.spine.draw(qs);
    S.spine.g.setAttribute('opacity', live ? (qs > 0 ? 1 : 0) : o);
    S.fam.forEach((f, i) => {
      const t0 = 2.4 + 0.08 * i;
      const q = live ? easeOut(prog(t, t0, 0.35)) : 1;
      f.line.setAttribute('stroke-dashoffset', f.len * (1 - q));
      f.g.setAttribute('opacity', live ? (q > 0 ? 1 : 0) : o);
      const pp = live ? prog(t, t0 + 0.2, 0.3) : 1;
      const sc = pp <= 0 ? 0.001 : pp >= 1 ? 1 : 0.6 + 0.4 * G.back(pp);
      f.pg.setAttribute('transform', sc === 1 ? '' : `translate(${f.px} ${f.py}) scale(${sc}) translate(${-f.px} ${-f.py})`);
    });

    // Notes : apparaissent famille par famille ; les candidates passent en rouge
    S.notes.forEach(n => {
      const cx = n.slot.x + NW / 2, cy = n.slot.y + NH / 2;
      pop(n.wrap, t, NOTE_T(n.i), cx, cy, 0.3);
      const red = n.cand !== undefined && (!live || t >= RED_T(n.cand));
      n.r.setAttribute('fill', red ? C.pRed : C.pYellow);
      n.r.setAttribute('stroke', red ? C.red : C.yellow);
      n.r.setAttribute('stroke-width', red ? 3 : 1.5);
      n.t.setAttribute('fill', red ? C.tRed : C.ink);
      if (n.cand !== undefined && live && t >= RED_T(n.cand) - 0.1) pulse(n.wrap, t, RED_T(n.cand), cx, cy, 0.12, 0.45);
    });
    pop(S.legend, t, RED_T(0) - 0.1, 1023, 426);

    // Liste : cadre, puis une rangée par candidate
    pop(S.tab, t, TAB_T, 600, 600);
    S.flyers.forEach(f => {
      const k = f.n.cand, t0 = ROW_T(k);
      const p = live ? prog(t, t0, 0.7) : 1;
      const on = live && p > 0 && p < 1;
      f.g.setAttribute('opacity', on ? 1 : 0);
      if (on) {
        const e = easeInOut(p), tx = COLS[0].x - 4, ty = rowY(k) + (TAB.rh - NH) / 2;
        place(f.g, f.n.slot.x + (tx - f.n.slot.x) * e, f.n.slot.y + (ty - f.n.slot.y) * e - 30 * Math.sin(Math.PI * p));
      }
      const R = S.rows[k];
      const show = (g, d) => g.setAttribute('opacity', live ? clamp(prog(t, t0 + d, 0.3)) : o);
      show(R.c1, 0.65);
      show(R.c2, 0.85);
      show(R.c3, 1.1);
      show(R.c4, 1.3);
    });

    pop(S.pill, t, PILL_T, 998, 738);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
