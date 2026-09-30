// Blog · QQOQCCP · section « Comment cadrer un problème en vingt minutes », étape 3
// Mécanique : présenté comme septième case, le Pourquoi semble livrer la cause : faux, ce n'est pas son rôle.
// La ligne quitte le tableau et devient une colonne ; le Pourquoi repasse sur chacune des six réponses, une à une.
// Deux ne tiennent pas (périmètre choisi par habitude, grandeur retenue parce qu'elle était disponible) : elles sont réécrites.
// Hypothèse : réponses de départ illustratives (« toute la ligne », « nombre d'arrêts ») ; champs à remplir en cases pointillées.
// Rendu déterministe : window.FICHE.draw(t), boucle de 18 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const ROWS = [
    { q: 'Quoi', a: 'Défaut [type de défaut], référence [référence]', why: 'pourquoi ce défaut ?' },
    { q: 'Qui', a: '[fonction qui constate], au contrôle final', why: 'pourquoi cette fonction ?' },
    { q: 'Où', a: 'Toute la ligne de conditionnement', why: 'pourquoi ce périmètre ?', bad: 'choisi par habitude', fix: 'Poste de conditionnement' },
    { q: 'Quand', a: 'Depuis [date de première observation]', why: 'pourquoi cette date de départ ?' },
    { q: 'Comment', a: 'En équipe [équipe]', why: 'pourquoi ces circonstances ?' },
    { q: 'Combien', a: 'Nombre d’arrêts de la ligne', why: 'pourquoi cette grandeur ?', bad: 'retenue parce que disponible', fix: '[part des pièces concernées] des pièces' },
  ];
  const X = { q: 72, a: 212, why: 790, icon: 1112 };
  const ROW_Y = k => 268 + 64 * k;            // centre de la rangée
  const T = { rows: 1.9, cross: 3.3, lift: 4.4, first: 5.3, note: 13.4, chute: 14.0 };
  // Départ du passage sur chaque rangée (1,1 s, 1,8 s pour une rangée réécrite)
  const START = [];
  { let t0 = T.first; ROWS.forEach(r => { START.push(t0); t0 += r.bad ? 1.8 : 1.1; }); }
  const END_SCAN = START[5] + 1.8;
  const S = {};

  // Ligne de texte avec champs à remplir ([...] en cases pointillées), sans retour à la ligne
  function richLine(parent, x, y, str, { size = 18, weight = 500, fill = C.ink } = {}) {
    const g = el('g', {}, parent);
    let cx = x;
    str.split(/(\[[^\]]+\])/).filter(Boolean).forEach(part => {
      if (part.startsWith('[')) {
        const tx = text(g, cx + 8, y, part.slice(1, -1), { size: size - 2, weight: 500, fill: C.blue });
        const w = measure(tx).width + 16;
        const r = el('rect', { x: cx, y: y - size + 1, width: w, height: size + 11, rx: 7, fill: C.pLav, stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' });
        g.insertBefore(r, tx);
        cx += w;
      } else {
        // Espaces de début et de fin gérées à la main (le SVG les écrase)
        const sp = size * 0.28, s = part.trim();
        if (part.startsWith(' ')) cx += sp;
        if (s) { const tx = text(g, cx, y, s, { size, weight, fill }); cx += measure(tx).width; }
        if (part.endsWith(' ')) cx += sp;
      }
    });
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le Pourquoi,', 'sur chaque ligne.');
    G.blogChapeau('Il ne livre pas la cause : il vérifie que chacune des six réponses tient.');
    G.card(40, 176, 1120, 584);

    // En-têtes
    S.head = el('g');
    text(S.head, X.q, 212, 'Question', { size: 17, weight: 700, fill: C.ink });
    text(S.head, X.a, 212, 'Réponse', { size: 17, weight: 700, fill: C.ink });
    S.colHead = el('g');
    G.pill(S.colHead, X.why, 206, `Pourquoi${NB}?`, { size: 19, h: 36, bg: C.blue, fg: C.white });
    S.colSub = el('g');
    text(S.colSub, X.why + 150, 213, 'posé à chaque ligne', { size: 17, weight: 700, fill: C.blue });

    // Bandeau qui suit la rangée examinée
    S.band = el('rect', { x: 52, y: 0, width: 1096, height: 58, rx: 14, fill: C.pLav, opacity: 0 });

    // Rangées
    S.rows = ROWS.map((r, k) => {
      const y = ROW_Y(k);
      const g = el('g');
      el('line', { x1: 60, y1: y + 32, x2: 1140, y2: y + 32, stroke: C.line, 'stroke-width': 1.5 }, g);
      text(g, X.q, y + 7, r.q, { size: 19, weight: 700, fill: C.blue });
      const old = richLine(g, X.a, y + 7, r.a);
      fit(old, X.why - 16, `réponse ${r.q}`);
      let neu = null, strike = null;
      if (r.fix) {
        neu = richLine(g, X.a, y + 7, r.fix, { weight: 700, fill: C.tGreen });
        fit(neu, X.why - 16, `réponse réécrite ${r.q}`);
        const b = measure(old);
        strike = el('line', { x1: b.x - 2, y1: y + 1, x2: b.x + b.width + 2, y2: y + 1, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      }
      const why = el('g', {}, g);
      fit(text(why, X.why, y - 3, r.why.replace(' ?', `${NB}?`), { size: 16, weight: 500, fill: C.blue }), X.icon - 18, `question ${r.q}`);
      const ok = text(why, X.why, y + 20, r.fix ? 'réécrite' : 'tient', { size: 16, weight: 700, fill: C.tGreen });
      const bad = r.bad ? text(why, X.why, y + 20, r.bad, { size: 16, weight: 700, fill: C.tRed }) : null;
      if (bad) fit(bad, X.icon - 18, `constat ${r.q}`);
      const icOk = el('g', {}, g); G.check(icOk, X.icon, y, 14, C.green);
      const icBad = el('g', {}, g); if (r.bad) G.cross(icBad, X.icon, y, 14, C.red);
      return { ...r, g, y, old, neu, strike, why, ok, bad, icOk, icBad };
    });

    // Septième ligne trompeuse : « Pourquoi : la cause ? »
    S.p7 = el('g');
    const y7 = ROW_Y(6);
    el('rect', { x: 52, y: y7 - 29, width: 1096, height: 58, rx: 14, fill: C.pRed }, S.p7);
    S.p7lab = text(S.p7, X.q, y7 + 7, 'Pourquoi', { size: 19, weight: 700, fill: C.blue });
    text(S.p7, X.a, y7 + 7, `la cause${NB}?`, { size: 19, weight: 700, fill: C.tRed });
    S.p7no = el('g', {}, S.p7);
    text(S.p7no, X.why, y7 + 7, 'ce n’est pas son rôle', { size: 18, weight: 700, fill: C.tRed });
    G.cross(S.p7no, X.icon, y7, 14, C.red);

    G.svg.appendChild(S.colHead);   // au-dessus de la septième ligne pendant l'envol

    S.note = el('g');
    text(S.note, X.q, 740, 'La cause se cherche après, avec les 5 pourquoi.', { size: 18, weight: 700, fill: C.ink });
    S.chute = G.blogChute('Le Pourquoi valide les six autres réponses.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.head, t, 1.8, 300, 212);
    S.rows.forEach((r, k) => {
      rise(r.g, t, T.rows + 0.1 * k, 0.35);
      const t0 = START[k];
      const whyO = live ? clamp(prog(t, t0 + 0.3, 0.25)) : 1;
      r.why.setAttribute('opacity', whyO);
      const verdict = live ? t >= t0 + 0.7 : true;
      const fixed = r.fix ? (live ? t >= t0 + 1.3 : true) : true;
      // Constat : « tient », ou défaut repéré puis réponse réécrite
      r.ok.setAttribute('opacity', verdict && fixed ? 1 : 0);
      if (r.bad) r.bad.setAttribute('opacity', verdict && !fixed ? 1 : 0);
      const ic = live ? prog(t, t0 + 0.7, 0.3) : 1;
      const icS = ic <= 0 ? 0.001 : ic >= 1 ? 1 : 0.6 + 0.4 * G.back(ic);
      r.icOk.setAttribute('transform', `translate(${X.icon} ${r.y}) scale(${fixed ? icS : 0.001}) translate(${-X.icon} ${-r.y})`);
      r.icOk.setAttribute('opacity', verdict && fixed ? 1 : 0);
      r.icBad.setAttribute('transform', `translate(${X.icon} ${r.y}) scale(${icS}) translate(${-X.icon} ${-r.y})`);
      r.icBad.setAttribute('opacity', verdict && !fixed ? 1 : 0);
      if (r.fix) {
        const sw = live ? prog(t, t0 + 1.0, 0.25) : 1;       // barre
        const nw = live ? prog(t, t0 + 1.3, 0.35) : 1;       // nouvelle réponse
        r.strike.setAttribute('opacity', sw * (1 - nw));
        r.old.setAttribute('opacity', 1 - nw);
        r.neu.setAttribute('opacity', nw);
        r.neu.setAttribute('transform', `translate(${12 * (1 - easeOut(nw))} 0)`);
      }
    });

    // Bandeau de la rangée examinée
    let bandY = null;
    if (live) START.forEach((s, k) => { if (t >= s && t < (START[k + 1] || END_SCAN)) bandY = ROW_Y(k); });
    const bo = live ? window01(t, T.first, END_SCAN, 0.3) : 0;
    S.band.setAttribute('opacity', bo);
    if (bandY !== null) {
      const k = START.findIndex((s, i) => t >= s && t < (START[i + 1] || END_SCAN));
      const prevY = k > 0 ? ROW_Y(k - 1) : ROW_Y(0);
      const y = prevY + (bandY - prevY) * easeInOut(prog(t, START[k], 0.3));
      S.band.setAttribute('y', y - 29);
    }

    // Septième ligne : apparaît, est refusée, puis se lève pour devenir la colonne
    const p7in = live ? prog(t, T.rows + 0.7, 0.35) : 0;
    const lift = live ? prog(t, T.lift, 0.7) : 1;
    S.p7.setAttribute('opacity', live ? clamp(p7in / 0.5) * (1 - clamp(prog(t, T.lift + 0.3, 0.5))) : 0);
    S.p7lab.setAttribute('opacity', live && t < T.lift + 0.3 ? 1 : 0);
    S.p7no.setAttribute('opacity', live ? clamp(prog(t, T.cross, 0.3)) : 0);
    if (live && t >= T.cross - 0.1 && t < T.cross + 0.6) pulse(S.p7no, t, T.cross, X.icon, ROW_Y(6), 0.15, 0.45);
    // L'en-tête de colonne naît de l'envol de la ligne
    const ch = live ? prog(t, T.lift + 0.3, 0.6) : 1;
    // Trajet en L : le long de la septième ligne vers la droite, puis vers le haut de la colonne
    const fx = (X.q - X.why) * (1 - easeOut(clamp(ch * 1.4))), fy = (ROW_Y(6) - 206) * (1 - Math.pow(ch, 2.2));
    S.colHead.setAttribute('transform', `translate(${fx} ${fy})`);
    S.colHead.setAttribute('opacity', live ? (t >= T.lift + 0.3 ? 1 : 0) : o);
    S.colSub.setAttribute('opacity', live ? clamp(prog(t, T.lift + 0.95, 0.3)) : o);

    rise(S.note, t, T.note, 0.4);
    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 18, build, draw });
})();
