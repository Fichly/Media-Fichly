// Blog · QUALIOPI formation Lean · section « Comment vérifier qu'un organisme est vraiment certifié QUALIOPI »
// Mécanique : quatre organismes affichent le même logo. Chacun avance à son tour vers trois vérifications
// (attestation fournie, en cours de validité, périmètre « actions de formation ») ; chaque vérification en arrête un.
// Seul le dernier passe : son financement est possible, et il reste à juger le contenu.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const S = {};

  const GATES = [
    { x: 420, l: ['1. L’attestation', 'est-elle fournie ?'] },
    { x: 620, l: ['2. Est-elle en cours', 'de validité ?'] },
    { x: 820, l: ['3. Couvre-t-elle les', 'actions de formation ?'] },
  ];
  const ORGS = [
    { n: 'A', stop: 0, why: 'Logo seul, sans attestation : il se copie en deux clics' },
    { n: 'B', stop: 1, why: 'Certification expirée' },
    { n: 'C', stop: 2, why: 'Bilans de compétences seulement : pas de financement' },
    { n: 'D', stop: 3, why: 'Financement possible' },
  ];
  const ROW_Y = i => 300 + 100 * i;
  const START_X = 318, END_X = 900;
  const T0 = i => 2.8 + 1.75 * i, SPEED = 560;       // px / s
  const NOTE_T = T0(3) + 2.1, CHUTE_T = NOTE_T + 0.6;

  function stopX(o) { return o.stop < 3 ? GATES[o.stop].x - 40 : END_X; }
  function arrive(i) { return T0(i) + (stopX(ORGS[i]) - START_X) / SPEED; }

  function build() {
    G.templateBlog();
    G.blogTitle('Vérifier', 'l’attestation.');
    G.blogChapeau('Tous les sites affichent le logo bleu : trois vérifications trient les organismes.');

    // Portes de vérification
    S.gates = GATES.map(g => {
      const head = el('g');
      g.l.forEach((s, r) => text(head, g.x, 200 + r * 21, s, { size: 16, weight: 700, fill: C.blue, anchor: 'middle' }));
      return head;
    });

    S.rows = ORGS.map((o, i) => {
      const cy = ROW_Y(i);
      el('rect', { x: 40, y: cy - 42, width: 1120, height: 84, rx: 20, fill: C.card, stroke: C.line, 'stroke-width': 2 });
      GATES.forEach(g => el('line', { x1: g.x, y1: cy - 50, x2: g.x, y2: cy + 50, stroke: C.blue, 'stroke-width': 3, 'stroke-dasharray': '8 7', opacity: 0.4 }));
      const lab = el('g');
      text(lab, 64, cy + 7, `Organisme ${o.n}`, { size: 19, weight: 700, fill: C.ink });
      G.pill(lab, 200, cy, 'QUALIOPI', { size: 15, h: 28, pad: 12, bg: C.blue, fg: C.white });
      // Jeton de l'organisme qui avance
      const tok = el('g');
      el('circle', { cx: 0, cy: 0, r: 22, fill: C.blue }, tok);
      text(tok, 0, 8, o.n, { size: 21, weight: 800, fill: C.white, anchor: 'middle' });
      const tokBad = el('circle', { cx: 0, cy: 0, r: 22, fill: C.red, opacity: 0 }, tok);
      const tokLetter = text(tok, 0, 8, o.n, { size: 21, weight: 800, fill: C.white, anchor: 'middle' });
      tokLetter.setAttribute('opacity', 0);
      // Marques aux portes franchies ou refusées
      const marks = GATES.map((g, k) => {
        const m = el('g');
        if (k < o.stop) G.check(m, g.x, cy, 13);
        else if (k === o.stop) G.cross(m, g.x, cy, 15);
        return m;
      });
      const res = el('g');
      const ok = o.stop === 3;
      const pr = G.para(res, 950, cy + 5, o.why, 196, { size: 16, weight: 700, fill: ok ? C.tGreen : C.tRed, lh: 1.2 });
      pr.t.setAttribute('transform', `translate(0 ${-(pr.n - 1) * 9.6})`);
      return { lab, tok, tokBad, tokLetter, marks, res, cy, o };
    });

    S.note = el('g');
    el('rect', { x: 40, y: 668, width: 1120, height: 60, rx: 18, fill: C.pLav }, S.note);
    text(S.note, 600, 705, 'Pour l’organisme D, reste l’essentiel : la qualité réelle de la formation.', { size: 19, weight: 700, fill: C.blue, anchor: 'middle' });

    S.chute = G.blogChute('QUALIOPI est un filtre nécessaire, pas suffisant.', { y: 810 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    S.gates.forEach((g, k) => rise(g, t, 1.75 + 0.1 * k, 0.35, 8));

    S.rows.forEach((r, i) => {
      rise(r.lab, t, 1.9 + 0.1 * i, 0.35, 8);
      const sx = stopX(r.o), ta = arrive(i);
      let x = sx;
      // Le jeton ralentit à l'approche de son arrêt
      if (live && t < ta) {
        const p = prog(t, T0(i), ta - T0(i));
        x = START_X + (sx - START_X) * easeOut(p);
      }
      const shake = live && r.o.stop < 3 && t >= ta && t < ta + 0.35 ? 5 * Math.sin((t - ta) * 50) * (1 - (t - ta) / 0.35) : 0;
      r.tok.setAttribute('transform', `translate(${x + shake} ${r.cy})`);
      r.tok.setAttribute('opacity', live ? clamp(prog(t, T0(i) - 0.3, 0.3)) : o);
      const bad = r.o.stop < 3 && (live ? t >= ta : true);
      r.tokBad.setAttribute('opacity', bad ? 1 : 0);
      r.tokLetter.setAttribute('opacity', bad ? 1 : 0);
      // Portes : coche au passage, croix à l'arrêt
      r.marks.forEach((m, k) => {
        if (k > r.o.stop) return;
        const f = (GATES[k].x - START_X) / (sx - START_X);
        const tk = k < r.o.stop ? T0(i) + (ta - T0(i)) * (1 - Math.cbrt(1 - f)) : ta;
        pop(m, t, tk, GATES[k].x, r.cy, 0.3);
      });
      pop(r.res, t, ta + 0.25, 1050, r.cy, 0.35);
    });
    rise(S.note, t, NOTE_T, 0.45, 10);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
