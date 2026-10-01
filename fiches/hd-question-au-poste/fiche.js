// Fiche LinkedIn · Hugo Duc · vendredi 9 octobre 2026
// Post : « La question la plus utile que je connaisse pour trouver des gaspillages ne demande aucun outil. »
// Premier commentaire du post (Buffer) : article Lean Manufacturing → encart bas gauche.
// Mécanique : Hugo pose la question (bulle bleue tournée vers sa photo), l'équipe répond (bulles blanches),
// chaque réponse reçoit sa traduction Lean ; la dernière, un problème connu jamais traité, ressort.
// Rendu déterministe : window.FICHE.draw(t), t en secondes, boucle de 12 s.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise } = G;

  // Bulle à coins arrondis avec une queue sur le bord bas (tx = abscisse de la queue)
  function bubblePath(x, y, w, h, r, tx, tail = 16) {
    return [
      `M ${x + r} ${y}`, `H ${x + w - r}`, `Q ${x + w} ${y} ${x + w} ${y + r}`,
      `V ${y + h - r}`, `Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
      `H ${tx + 22}`, `L ${tx - 6} ${y + h + tail}`, `L ${tx} ${y + h}`,
      `H ${x + r}`, `Q ${x} ${y + h} ${x} ${y + h - r}`,
      `V ${y + r}`, `Q ${x} ${y} ${x + r} ${y}`, 'Z',
    ].join(' ');
  }
  // Étoile pleine (badge « celle qui compte »)
  function star(parent, cx, cy, r, fill) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`);
    }
    return el('path', { d: `M ${pts.join(' L ')} Z`, fill, 'stroke-linejoin': 'round' }, parent);
  }
  // Petite flèche « traduit en »
  function arrow(parent, x, cy, color) {
    el('path', { d: `M ${x} ${cy} H ${x + 14} M ${x + 9} ${cy - 5} L ${x + 14} ${cy} L ${x + 9} ${cy + 5}`, fill: 'none', stroke: color, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }

  const ANSWERS = [
    { quote: ['« On attend toujours la même', 'pièce le lundi matin. »'], tag: 'Attente' },
    { quote: ['« L’outil est rangé à l’autre', 'bout de l’atelier. »'], tag: 'Mouvement inutile' },
    { quote: ['« On ressaisit tout ce qu’on a', 'déjà noté sur papier. »'], tag: 'Travail fait deux fois' },
    { quote: ['« On le signale', 'depuis des mois. »'], tag: 'Connu, remonté, jamais traité', key: true },
  ];
  const B = { w: 470, h: 152 };
  const POS = [[60, 540], [550, 540], [60, 712], [550, 712]];

  const S = { answers: [] };

  function build() {
    G.template({ author: 'hugo' });
    G.title('Une question,', 'aucun outil.');
    G.chapeau('À l’équipe, au poste, pas en salle de réunion.');

    // ----- La question d'Hugo : bulle bleue, queue vers sa photo -----
    S.ask = el('g');
    el('path', { d: 'M 60 364 Q 60 336 88 336 H 868 Q 912 318 950 266 Q 948 306 960 336 H 992 Q 1020 336 1020 364 V 452 Q 1020 480 992 480 H 88 Q 60 480 60 452 Z', fill: C.blue }, S.ask);
    S.askText = el('g', {}, S.ask);
    fit(text(S.askText, 100, 397, '« Qu’est-ce qui vous empêche', { size: 40, weight: 800, fill: C.white }), 990, 'question ligne 1');
    fit(text(S.askText, 100, 449, 'de bien travailler ? »', { size: 40, weight: 800, fill: C.white }), 990, 'question ligne 2');
    // Points de saisie, avant que la question s'affiche
    S.dots = el('g', {}, S.ask);
    S.dotList = [0, 1, 2].map(i => el('circle', { cx: 112 + i * 30, cy: 408, r: 9, fill: C.white }, S.dots));

    // ----- Les réponses de l'équipe -----
    S.head = el('g');
    fit(text(S.head, 62, 520, 'Ce que l’équipe répond', { size: 24, weight: 700, fill: C.ink }), 700, 'titre réponses');
    const lp = G.pill(S.head, 1018, 512, 'En langage Lean', { size: 19, h: 34, pad: 16, anchor: 'start' });
    lp.g.setAttribute('transform', `translate(${-lp.w} 0)`);

    ANSWERS.forEach((a, i) => {
      const [x, y] = POS[i];
      const g = el('g');
      const shape = el('path', { d: bubblePath(x, y, B.w, B.h - 16, 24, x + 40), fill: C.card, stroke: a.key ? C.red : C.line, 'stroke-width': a.key ? 3 : 2, 'stroke-linejoin': 'round' }, g);
      a.quote.forEach((line, k) => fit(text(g, x + 28, y + 44 + k * 32, line, { size: 23, weight: 700, fill: C.ink }), x + B.w - 20, `réponse ${i + 1} ligne ${k + 1}`));
      // Traduction Lean
      const tag = el('g');
      const color = a.key ? C.tRed : C.blue;
      arrow(tag, x + 28, y + 108, color);
      const p = G.pill(tag, x + 52, y + 108, a.tag, { size: 18, h: 32, pad: 14, bg: a.key ? C.pRed : C.pLav, fg: color });
      fit(p.g, x + B.w - 16, `réponse ${i + 1} étiquette`);
      g.appendChild(tag);
      const ans = { g, tag, shape, key: !!a.key, cx: x + 34, cy: y + B.h, tx: x + 60, ty: y + 108 };
      if (a.key) {
        // Badge sur le bord haut : souvent celle qui compte le plus
        const badge = el('g');
        const br = el('rect', { y: y - 16, height: 32, rx: 16, fill: C.pYellow }, badge);
        const bt = text(badge, 0, y + 6, 'Souvent celle qui compte le plus', { size: 17, weight: 700, fill: C.tYellow });
        const bw = 14 + 18 + 8 + measure(bt).width + 14, bx0 = x + B.w - 20 - bw;
        br.setAttribute('x', bx0);
        br.setAttribute('width', bw);
        bt.setAttribute('x', bx0 + 40);
        star(badge, bx0 + 23, y, 10, C.yellow);
        ans.bx = bx0 + bw / 2;
        ans.by = y;
        ans.badge = badge;
      }
      S.answers.push(ans);
    });

    // ----- Ce que fait la question -----
    S.two = el('g');
    fit(text(S.two, 62, 904, 'Cette question fait deux choses à la fois', { size: 24, weight: 700, fill: C.ink }), 1020, 'titre effets');
    S.effects = [
      ['Elle fait remonter les gaspillages', 'plus vite que n’importe', 'quelle cartographie.'],
      ['Elle montre à l’équipe que son', 'avis sur son propre travail', 'a de la valeur.'],
    ].map((lines, i) => {
      const x = 60 + i * 490;
      const g = el('g');
      el('rect', { x, y: 922, width: 470, height: 136, rx: 22, fill: C.pGreen }, g);
      G.check(g, x + 44, 962, 20);
      lines.forEach((l, k) => fit(text(g, x + 80, 970 + k * 31, l, { size: 21, weight: 700, fill: C.tGreen }), x + 452, `effet ${i + 1} ligne ${k + 1}`));
      return { g, cx: x + 235, cy: 990 };
    });

    S.chute = G.chute('Ceux qui vivent le gaspillage savent où il se trouve.', 'Encore faut-il leur demander.');
    G.encart(['De la valeur aux gaspillages', 'Notre article sur le Lean', '(lien en commentaire)']);
  }

  // ---------- Chronologie ----------
  const T_ASK = 1.8, T_TYPE = 2.1, T_TEXT = 2.9;
  const T_HEAD = 3.3;
  const T_ANS = [3.6, 4.0, 4.4, 4.8];
  const T_TAG = [5.4, 5.7, 6.0, 6.5];
  const T_BADGE = 7.0;
  const T_TWO = 7.5, T_EFF = [7.75, 8.05];
  const T_CHUTE = 8.5;

  function draw(t) {
    const live = !fading(t) && t >= FADE_END;

    // Question : la bulle sort de la photo, trois points, puis le texte
    pop(S.ask, t, T_ASK, 950, 266, 0.45);
    let dotsOn = 0, textOn = 1;
    if (live) {
      textOn = clamp(prog(t, T_TEXT, 0.25));
      dotsOn = t >= T_TYPE && t < T_TEXT ? 1 : t >= T_TEXT ? 1 - clamp(prog(t, T_TEXT, 0.15)) : 0;
    }
    S.askText.setAttribute('opacity', textOn);
    S.dots.setAttribute('opacity', dotsOn);
    S.dotList.forEach((d, i) => {
      const ph = live ? Math.max(0, Math.sin((t - T_TYPE) * 2 * Math.PI * 1.6 - i * 0.9)) : 0;
      d.setAttribute('cy', 408 - 8 * ph);
    });

    rise(S.head, t, T_HEAD, 0.4, 12);

    // Réponses : chaque bulle sort de sa queue, puis l'étiquette Lean tombe dessus
    S.answers.forEach((a, i) => {
      pop(a.g, t, T_ANS[i], a.cx, a.cy);
      let s = 1, o = 1;
      if (live) {
        const p = prog(t, T_TAG[i], 0.35);
        s = p <= 0 ? 0.001 : p >= 1 ? 1 : 1.25 - 0.25 * back(p);
        o = clamp(p / 0.3);
      }
      a.tag.setAttribute('transform', s === 1 ? '' : `translate(${a.tx} ${a.ty}) scale(${s}) translate(${-a.tx} ${-a.ty})`);
      a.tag.setAttribute('opacity', o);
      if (a.key) {
        const on = !live || t >= T_TAG[i];
        a.shape.setAttribute('stroke', on ? C.red : C.line);
        a.shape.setAttribute('stroke-width', on ? 3 : 2);
        // Petit tremblement quand l'étiquette rouge tombe
        if (live) {
          const p = prog(t, T_TAG[i] + 0.2, 0.45);
          if (p > 0 && p < 1) a.g.setAttribute('transform', `translate(${(7 * Math.sin(p * Math.PI * 5) * (1 - p)).toFixed(2)} 0)`);
        }
        pop(a.badge, t, T_BADGE, a.bx, a.by);
      }
    });

    rise(S.two, t, T_TWO, 0.4, 12);
    S.effects.forEach((e, i) => pop(e.g, t, T_EFF[i], e.cx, e.cy));
    rise(S.chute, t, T_CHUTE, 0.45);
  }

  G.start({ duration: 12, build, draw });
})();
