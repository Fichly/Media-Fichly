// Blog · QQOQCCP · section « Comment cadrer un problème en vingt minutes » (image à créer)
// Mécanique : la phrase vague du départ reste en haut ; chaque question, posée dans l'ordre de l'article (Quoi et Où
// avant Qui), envoie son morceau à sa place dans la phrase de problème, souligné de sa couleur. Le Pourquoi ne produit
// pas de morceau : il repasse sur chaque réponse (une coche par question). À la fin, la phrase vague est barrée.
// Phrase : gabarit de l'article, champs à remplir laissés en cases pointillées.
// Hypothèse : rattachement de « en équipe [équipe] » au Comment et de « au contrôle final » au Qui (choix du visuel).
// Rendu déterministe : window.FICHE.draw(t), boucle de 18 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const Q = [
    { name: 'Quoi', color: C.red },
    { name: 'Qui', color: C.teal },
    { name: 'Où', color: C.violet },
    { name: 'Quand', color: C.green },
    { name: 'Comment', color: C.yellow },
    { name: 'Combien', color: C.lightBlue },
    { name: 'Pourquoi', color: C.blue },
  ];
  // Morceaux de la phrase, dans l'ordre de lecture ; q = indice de la question qui le produit
  const FRAGS = [
    { q: 3, s: 'Depuis [date de première observation],' },
    { q: 0, s: 'le défaut [type de défaut] apparaît' },
    { q: 5, s: 'sur [part des pièces concernées] des pièces de la référence [référence],' },
    { q: 2, s: 'au poste de conditionnement,' },
    { q: 4, s: 'en équipe [équipe].' },
    { q: 1, s: 'Il est constaté par [fonction qui constate] au contrôle final.' },
  ];
  const ORDER = [0, 2, 3, 5, 4, 1];               // ordre des questions posées
  const FIRE = q => 3.5 + 1.05 * ORDER.indexOf(q);
  const P_T = 10.0, CHECK_T = k => P_T + 0.35 + 0.3 * k;
  const STRIKE_T = 12.3, FOOT_T = 12.6, CHUTE_T = 13.4;
  const TILE = { w: 142, h: 56, y: 318, x0: 64, gap: 12 };
  const TEXT = { x0: 86, x1: 1114, y0: 484, lh: 60, size: 25 };
  const S = {};

  const tileX = i => TILE.x0 + i * (TILE.w + TILE.gap);

  function build() {
    G.templateBlog();
    G.blogTitle('Du problème vague', 'à la phrase.');
    G.blogChapeau('Sept questions, et chacune produit un morceau de la phrase de problème.');
    G.card(40, 176, 1120, 584);

    // Phrase vague du départ
    S.vague = el('g');
    const av = G.pill(S.vague, 64, 223, 'Avant', { size: 18, h: 34, bg: C.pRed, fg: C.tRed });
    S.vagueTxt = text(S.vague, 64 + av.w + 16, 231, `« On a un problème qualité sur la ligne de conditionnement.${NB}»`, { size: 22, weight: 700, fill: C.tRed });
    fit(S.vagueTxt, 1130, 'phrase vague');
    const vb = measure(S.vagueTxt);
    S.strike = el('line', { x1: vb.x - 4, y1: 223, x2: vb.x + vb.width + 4, y2: 223, stroke: C.red, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, S.vague);
    S.strikeLen = vb.width + 8;
    S.strike.setAttribute('stroke-dasharray', `${S.strikeLen} ${S.strikeLen}`);

    // Tuiles des sept questions
    S.tiles = Q.map((q, i) => {
      const g = el('g');
      const x = tileX(i);
      const bg = el('rect', { x, y: TILE.y - TILE.h / 2, width: TILE.w, height: TILE.h, rx: 14, fill: q.color }, g);
      const lab = text(g, x + TILE.w / 2, TILE.y + 7, q.name, { size: 20, weight: 800, fill: C.white, anchor: 'middle' });
      fit(lab, x + TILE.w - 6, `tuile ${q.name}`, x + 6);
      const badge = el('g', {}, g);
      G.check(badge, x + TILE.w - 6, TILE.y - TILE.h / 2 + 4, 12, C.green);
      el('circle', { cx: x + TILE.w - 6, cy: TILE.y - TILE.h / 2 + 4, r: 12, fill: 'none', stroke: C.white, 'stroke-width': 2.5 }, badge);
      return { g, bg, lab, badge, x, cx: x + TILE.w / 2 };
    });
    S.pNote = text(G.svg, tileX(6) + TILE.w, 370, 'vérifie chaque réponse', { size: 15, weight: 700, fill: C.blue, anchor: 'end' });
    fit(S.pNote, 1150, 'note Pourquoi');

    // Carte de la phrase de problème
    S.card = el('g');
    el('rect', { x: 60, y: 388, width: 1080, height: 356, rx: 20, fill: C.white, stroke: C.line, 'stroke-width': 2 }, S.card);
    G.pill(S.card, 86, 420, 'Après : la phrase de problème', { size: 18, h: 34, bg: C.pGreen, fg: C.tGreen });

    // Mise en page de la phrase : mots et champs, coupés à la largeur
    const probe = text(G.svg, 0, -999, '', { size: TEXT.size, weight: 500 });
    const probeF = text(G.svg, 0, -999, '', { size: 20, weight: 500 });
    const wWord = s => { probe.textContent = s; return probe.getComputedTextLength(); };
    const wField = s => { probeF.textContent = s; return probeF.getComputedTextLength() + 20; };
    const SP = wWord('a a') - wWord('aa');
    let x = TEXT.x0, line = 0;
    S.frags = FRAGS.map((f, fi) => {
      const g = el('g');
      const toks = [];
      f.s.split(/(\[[^\]]+\])/).filter(Boolean).forEach(part => {
        if (part.startsWith('[')) toks.push({ field: part.slice(1, -1) });
        else part.split(' ').filter(Boolean).forEach(w => toks.push({ word: w, attach: /^[,.]/.test(w) && part.startsWith(w) }));
      });
      const segs = [];
      toks.forEach((tk, ti) => {
        const w = tk.field ? wField(tk.field) : wWord(tk.word);
        const gap = tk.attach || (x === TEXT.x0) ? (tk.attach ? 1 : 0) : SP;
        if (x + gap + w > TEXT.x1 && !tk.attach) { line++; x = TEXT.x0; }
        else x += gap;
        const y = TEXT.y0 + line * TEXT.lh;
        if (tk.field) {
          el('rect', { x, y: y - 26, width: w, height: 36, rx: 9, fill: C.pLav, stroke: Q[f.q].color, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, g);
          text(g, x + 10, y - 1, tk.field, { size: 20, weight: 500, fill: C.blue });
        } else text(g, x, y, tk.word, { size: TEXT.size, weight: 500, fill: C.ink });
        let sg = segs[segs.length - 1];
        if (!sg || sg.line !== line) { sg = { line, x0: x, x1: x + w, y }; segs.push(sg); } else sg.x1 = x + w;
        x += w;
      });
      // Soulignement de la couleur de la question
      const unders = segs.map(sg => el('rect', { x: sg.x0, y: sg.y + 14, width: sg.x1 - sg.x0, height: 4, rx: 2, fill: Q[f.q].color }, g));
      const bb = { x: segs[0].x0, y: segs[0].y - 24, x1: segs[0].x1 };
      return { ...f, g, segs, unders, first: segs[0], cx: (segs[0].x0 + segs[0].x1) / 2 };
    });
    probe.remove(); probeF.remove();
    if (line > 3) console.error(`Phrase sur ${line + 1} lignes`);

    // Liens tuile → morceau
    S.links = S.frags.map(f => {
      const tx = S.tiles[f.q].cx, fy = f.first.y - 30;
      const d = `M ${tx} ${TILE.y + TILE.h / 2 + 4} C ${tx} ${TILE.y + 110} ${f.cx} ${fy - 60} ${f.cx} ${fy}`;
      return G.arrow(G.svg, d, { stroke: Q[f.q].color, width: 3, head: 9 });
    });

    S.foot = text(G.svg, 86, 718, 'Écrite, datée, chiffrée : compréhensible par quelqu’un qui n’était pas dans la pièce.', { size: 17, weight: 500, fill: C.ink });
    fit(S.foot, 1120, 'pied de carte');
    S.chute = G.blogChute('Le livrable n’est pas le tableau, c’est la phrase de problème.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    pop(S.vague, t, 1.8, 400, 223);
    const sp = live ? easeOut(prog(t, STRIKE_T, 0.4)) : 1;
    S.strike.setAttribute('stroke-dashoffset', S.strikeLen * (1 - sp));
    S.vagueTxt.setAttribute('opacity', 1 - 0.45 * sp);

    // Tuiles : pâles tant que la question n'est pas posée
    S.tiles.forEach((tl, i) => {
      pop(tl.g, t, 2.3 + 0.07 * i, tl.cx, TILE.y);
      const tf = i === 6 ? P_T : FIRE(i);
      const on = !live || t >= tf;
      tl.bg.setAttribute('fill', on ? Q[i].color : C.pLav);
      tl.lab.setAttribute('fill', on ? C.white : C.blue);
      if (live && t >= tf - 0.1 && t < tf + 0.6) pulse(tl.g, t, tf, tl.cx, TILE.y, 0.1, 0.4);
      // Coche du Pourquoi sur chacune des six questions
      if (i < 6) {
        const k = [0, 1, 2, 3, 4, 5].indexOf(i);
        const pc = live ? prog(t, CHECK_T(k), 0.3) : 1;
        const s = pc <= 0 ? 0.001 : pc >= 1 ? 1 : 0.6 + 0.4 * G.back(pc);
        const bx = tl.x + TILE.w - 6, by = TILE.y - TILE.h / 2 + 4;
        tl.badge.setAttribute('transform', `translate(${bx} ${by}) scale(${s}) translate(${-bx} ${-by})`);
        tl.badge.setAttribute('opacity', pc > 0 ? 1 : 0);
      } else tl.badge.setAttribute('opacity', 0);
    });
    S.pNote.setAttribute('opacity', live ? clamp(prog(t, P_T + 0.2, 0.3)) : o);

    pop(S.card, t, 2.9, 600, 560);

    // Morceaux : apparaissent quand leur question est posée ; le Pourquoi les fait pulser
    S.frags.forEach((f, fi) => {
      const tf = FIRE(f.q);
      const pa = live ? prog(t, tf + 0.35, 0.3) : 1;
      f.g.setAttribute('opacity', fading(t) ? o : clamp(pa / 0.6));
      const dy = live ? 10 * (1 - easeOut(pa)) : 0;
      const k = f.q;
      const tc = CHECK_T(k);
      f.g.setAttribute('transform', dy ? `translate(0 ${dy})` : '');
      f.unders.forEach(u => u.setAttribute('height', live && t >= tc && t < tc + 0.4 ? 7 : 4));
      // Lien : se dessine, puis s'efface
      const L = S.links[fi];
      const q = live ? easeInOut(prog(t, tf, 0.4)) : 0;
      L.draw(q);
      L.g.setAttribute('opacity', live ? 1 - clamp(prog(t, tf + 1.0, 0.3)) : 0);
    });

    rise(S.foot, t, FOOT_T, 0.4);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 18, build, draw });
})();
