// Blog · DMAIC · section « Pourquoi DMAIC et pas PDCA ? »
// Mécanique : la grille de l'article devient cinq interrupteurs. Pour chaque problème, chaque réponse bascule vers
// PDCA ou vers DMAIC ; les compteurs montent, et dès qu'un côté atteint trois réponses la méthode est choisie.
// Problème 1 (outils cherchés en début de poste, exemple de l'article PDCA) : 3 contre 2, PDCA.
// Problème 2 (rebut à 7 % au lieu de 2 %, exemple de cet article) : 5 contre 0, DMAIC.
// Les réponses données aux deux problèmes sont des hypothèses. Boucle de 17 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, clamp, easeOut, easeInOut, FADE_END, fading, fadeOut, pop, rise, pulse } = G;

  const S = {};
  const QS = ['Cause connue ou plausible ?', 'Déjà revenu plusieurs fois ?', 'L’enjeu se chiffre-t-il ?', 'Plusieurs services à embarquer ?', 'Trois mois disponibles ?'];
  const RY = i => 290 + 62 * i;
  const COLS = [
    { cx: 620, title: 'Outils cherchés en début de poste', ans: [['P', 'hypothèse sérieuse'], ['D', 'régulièrement'], ['D', 'en minutes'], ['P', 'une équipe suffit'], ['P', 'cette semaine']] },
    { cx: 968, title: 'Rebut à 7 % au lieu de 2 %', ans: [['D', 'personne ne sait'], ['D', 'régulièrement'], ['D', 'en euros'], ['D', 'plusieurs services'], ['D', 'le sujet le justifie']] },
  ];
  const TW = 324, KW = 184, KOFF = (TW - KW) / 2 - 4;    // piste, bouton, décalage du bouton
  const COL = { P: C.teal, D: C.violet };
  const T = { q: 1.8, cols: 2.2, flip: [[2.8, 0.6], [6.7, 0.6]], chute: 10.4 };
  const flipT = (c, i) => T.flip[c][0] + T.flip[c][1] * i;

  function build() {
    G.templateBlog();
    G.blogTitle('PDCA ou DMAIC :', 'la grille.');
    G.blogChapeau('Cinq questions sur votre problème. Trois réponses d’un côté, et la méthode est choisie.');
    G.card(40, 176, 1120, 584);

    // Questions
    S.qs = QS.map((q, i) => {
      const g = el('g');
      G.badgeNum(g, 82, RY(i), i + 1, 16);
      fit(text(g, 108, RY(i) + 7, q, { size: 20, weight: 700, fill: C.ink }), 452, `question ${i + 1}`);
      return g;
    });
    text(G.svg, 64, 624, 'Réponses', { size: 19, weight: 700, fill: C.ink });
    text(G.svg, 64, 690, 'Méthode', { size: 19, weight: 700, fill: C.ink });

    // Colonnes : un problème chacune
    S.cols = COLS.map((c, ci) => {
      const head = el('g');
      const hp = G.pill(head, c.cx, 222, c.title, { size: 17, h: 38, pad: 12, bg: C.pRed, fg: C.tRed, anchor: 'middle' });
      fit(hp.g, c.cx + 170, `titre ${ci}`, c.cx - 170);
      const tracks = el('g');
      QS.forEach((q, i) => {
        el('rect', { x: c.cx - TW / 2, y: RY(i) - 22, width: TW, height: 44, rx: 22, fill: C.pLav }, tracks);
        text(tracks, c.cx - TW / 2 + 16, RY(i) + 6, 'PDCA', { size: 15, weight: 700, fill: C.teal, anchor: 'start' });
        text(tracks, c.cx + TW / 2 - 16, RY(i) + 6, 'DMAIC', { size: 15, weight: 700, fill: C.violet, anchor: 'end' });
      });
      // Boutons : neutre (?) puis réponse colorée
      const knobs = c.ans.map(([side, a], i) => {
        const g = el('g');
        const bg = el('rect', { x: -KW / 2, y: -18, width: KW, height: 36, rx: 18, fill: COL[side] }, g);
        const lab = text(g, 0, 6, a, { size: 16, weight: 700, fill: C.white, anchor: 'middle' });
        if (measure(lab).width > KW - 16) console.error(`Débordement : bouton ${a}`);
        const q = el('g', {}, g);
        el('rect', { x: -26, y: -18, width: 52, height: 36, rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 2 }, q);
        text(q, 0, 7, '?', { size: 19, weight: 800, fill: C.blue, anchor: 'middle' });
        return { g, bg, lab, q, side, y: RY(i) };
      });
      // Compteurs : 5 pastilles par méthode
      const tally = el('g');
      const dots = { P: [], D: [] };
      [['P', c.cx - 150], ['D', c.cx + 14]].forEach(([s, x0]) => {
        text(tally, x0, 624, s === 'P' ? 'PDCA' : 'DMAIC', { size: 17, weight: 700, fill: COL[s] });
        for (let k = 0; k < 5; k++) dots[s].push(el('circle', { cx: x0 + (s === 'P' ? 62 : 72) + 15 * k, cy: 618, r: 6, fill: C.line }, tally));
      });
      // Verdict
      const win = c.ans.filter(a => a[0] === 'P').length >= 3 ? 'P' : 'D';
      const verdict = el('g');
      const vp = G.pill(verdict, c.cx, 684, win === 'P' ? 'Prenez un PDCA' : 'Le DMAIC est justifié', { size: 20, h: 42, pad: 18, bg: COL[win], fg: C.white, anchor: 'middle', icon: 'check' });
      return { head, tracks, knobs, tally, dots, verdict, win, cx: c.cx };
    });

    S.chute = G.blogChute('Si vous pouvez tester une solution cette semaine, prenez le PDCA.', { y: 808 });

    G.svg.querySelectorAll('text, tspan').forEach(n => {
      if (n.childNodes.length === 1 && n.firstChild.nodeType === 3) n.firstChild.textContent = n.firstChild.textContent.replace(/ ([?:;%!])/g, ' $1');
    });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;

    S.qs.forEach((g, i) => pop(g, t, T.q + 0.08 * i, 250, RY(i)));
    S.cols.forEach((c, ci) => {
      pop(c.head, t, T.cols + 0.15 * ci, c.cx, 222);
      c.tracks.setAttribute('opacity', live ? clamp(prog(t, T.cols + 0.15 * ci, 0.3)) : o);
      const n = { P: 0, D: 0 };
      c.knobs.forEach((k, i) => {
        const tf = flipT(ci, i);
        const p = live ? easeInOut(prog(t, tf, 0.35)) : 1;
        const x = c.cx + (k.side === 'P' ? -1 : 1) * KOFF * p;
        const shown = live ? clamp(prog(t, T.cols + 0.15 * ci + 0.2, 0.3)) : o;
        k.g.setAttribute('transform', `translate(${x} ${k.y})`);
        k.g.setAttribute('opacity', shown);
        // le bouton neutre (?) s'élargit en réponse
        const w = 52 + (KW - 52) * p;
        k.bg.setAttribute('x', -w / 2);
        k.bg.setAttribute('width', w);
        k.lab.setAttribute('opacity', clamp((p - 0.5) / 0.5));
        k.q.setAttribute('opacity', 1 - clamp(p / 0.4));
        if (p >= 1) n[k.side]++;
      });
      ['P', 'D'].forEach(s => c.dots[s].forEach((d, k) => d.setAttribute('fill', k < n[s] ? COL[s] : C.line)));
      c.tally.setAttribute('opacity', live ? clamp(prog(t, T.cols + 0.15 * ci + 0.2, 0.3)) : o);
      // Verdict dès la troisième réponse du même côté
      const tv = (() => { let m = { P: 0, D: 0 }; for (let i = 0; i < 5; i++) { const s = c.knobs[i].side; m[s]++; if (m[s] === 3) return flipT(ci, i) + 0.45; } return 99; })();
      pop(c.verdict, t, tv, c.cx, 684);
      if (live && t >= tv + 0.4 && t < tv + 1.1) pulse(c.verdict, t, tv + 0.4, c.cx, 684, 0.07, 0.4);
    });

    rise(S.chute, t, T.chute, 0.45);
  }

  G.start({ duration: 17, build, draw });
})();
