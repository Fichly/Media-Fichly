// Blog · Value Stream Mapping · « Étape 7 : concevoir l'état futur et le plan d'action »
// Refait en animé l'image fichly-vsm-simplifiee.png (préparation, impression, découpe, poinçonnage et contrôle,
// conditionnement, avec stocks et déplacements). Mécanique : la carte de l'état actuel devient la seconde carte,
// l'état futur ; des éclairs kaizen y marquent les chantiers, et chaque éclair descend dans le plan d'action où il
// devient une ligne avec un responsable et une échéance.
// Hypothèses : chantiers choisis selon l'ordre d'attaque de l'article (changement de série, stock le plus long, poste
// qui donne le rythme), responsables et échéances illustratifs (dans l'horizon de trois à six mois de l'article).
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const POSTS = ['Préparation', 'Impression', 'Découpe', ['Poinçonnage', 'et contrôle'], 'Conditionnement'];
  const BX = [66, 288, 510, 732, 954], BW = 168, BY = 316, BH = 66;
  const GAPS = [0, 1, 2, 3].map(i => (BX[i] + BW + BX[i + 1]) / 2);
  const ROW_Y = [598, 652, 706];
  const KZ = [
    { x: 302, y: 298, lab: 'SMED', action: 'Changement de série plus court à l’impression', who: 'Méthodes', when: 'Mois 2' },
    { x: GAPS[2], y: 262, lab: 'FIFO', action: 'Enchaîner découpe et poinçonnage, sans stock', who: 'Chef d’atelier', when: 'Mois 4' },
    { x: 1090, y: 292, lab: 'Takt', action: 'Faire rythmer le conditionnement par le client', who: 'Resp. production', when: 'Mois 6' },
  ];
  const T_KZ = [3.9, 5.9, 7.9], FLY = 0.75;
  const CHUTE_T = 11.2;
  const S = {};

  function burstPath(cx, cy, r1, r2, n = 12) {
    let d = '';
    for (let i = 0; i < 2 * n; i++) {
      const r = i % 2 ? r2 : r1, a = Math.PI * i / n - Math.PI / 2;
      d += `${i ? 'L' : 'M'} ${cx + r * Math.cos(a) * 1.3} ${cy + r * Math.sin(a)} `;
    }
    return d + 'Z';
  }
  function burst(parent, lab, k = 1) {
    const g = el('g', {}, parent);
    el('path', { d: burstPath(0, 0, 38 * k, 23 * k), fill: C.yellow, stroke: C.red, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    if (lab) g.lab = text(g, 0, 6 * k, lab, { size: 17 * k, weight: 800, fill: C.ink, anchor: 'middle' });
    return g;
  }
  function triangle(parent, cx, by, s = 42) {
    const g = el('g', {}, parent);
    el('path', { d: `M ${cx - s / 2} ${by} L ${cx} ${by - s * 0.88} L ${cx + s / 2} ${by} Z`, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    text(g, cx, by - 7, 'I', { size: 17, weight: 800, fill: C.tYellow, anchor: 'middle' });
    return g;
  }
  function forklift(parent, cx, cy) {
    const g = el('g', {}, parent);
    el('rect', { x: cx - 18, y: cy - 10, width: 26, height: 16, rx: 3, fill: C.lightBlue }, g);
    el('path', { d: `M ${cx - 12} ${cy - 10} L ${cx - 12} ${cy - 22} L ${cx + 2} ${cy - 22} L ${cx + 6} ${cy - 10}`, fill: 'none', stroke: C.lightBlue, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    el('path', { d: `M ${cx + 12} ${cy - 24} L ${cx + 12} ${cy + 6} L ${cx + 24} ${cy + 6}`, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    el('circle', { cx: cx - 11, cy: cy + 8, r: 5, fill: C.ink }, g);
    el('circle', { cx: cx + 4, cy: cy + 8, r: 5, fill: C.ink }, g);
    return g;
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Chaque éclair,', 'une ligne du plan.');
    G.blogChapeau('Sur l’état futur, chaque chantier devient une action, un responsable, une date.');

    // ----- Carte : la ligne -----
    G.card(40, 176, 1120, 296);
    S.pillA = el('g');
    G.pill(S.pillA, 64, 214, 'État actuel : ce qui se passe', { size: 19, h: 34, bg: C.pLav, fg: C.ink });
    S.pillF = el('g');
    G.pill(S.pillF, 64, 214, 'État futur : la seconde carte', { size: 19, h: 34, bg: C.blue, fg: C.white });

    S.boxes = POSTS.map((n, i) => {
      const g = el('g');
      el('rect', { x: BX[i], y: BY, width: BW, height: BH, rx: 7, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, g);
      if (Array.isArray(n)) {
        text(g, BX[i] + BW / 2, BY + 29, n[0], { size: 18, weight: 700, fill: C.blue, anchor: 'middle' });
        text(g, BX[i] + BW / 2, BY + 51, n[1], { size: 18, weight: 700, fill: C.blue, anchor: 'middle' });
      } else fit(text(g, BX[i] + BW / 2, BY + 41, n, { size: 17, weight: 700, fill: C.blue, anchor: 'middle' }), BX[i] + BW - 4, `poste ${i}`, BX[i] + 4);
      return g;
    });
    S.stocks = GAPS.map(x => { const g = el('g'); triangle(g, x, BY + BH - 4, 38); return g; });
    S.moves = [GAPS[1], GAPS[2]].map(x => {
      const g = el('g');
      const a = G.arrow(g, `M ${x - 70} ${BY - 4} Q ${x} ${BY - 44} ${x + 70} ${BY - 4}`, { width: 2.5, dash: '6 6', head: 9, stroke: C.lightBlue });
      forklift(g, x, BY - 50);
      return g;
    });
    S.legend = el('g');
    triangle(S.legend, 80, 446, 26);
    text(S.legend, 100, 446, 'stock', { size: 16, weight: 500, fill: C.ink });
    forklift(S.legend, 190, 438);
    text(S.legend, 222, 446, 'déplacement', { size: 16, weight: 500, fill: C.ink });

    // Éclairs sur la carte
    S.kz = KZ.map(k => { const g = el('g'); burst(g, k.lab); g.setAttribute('transform', `translate(${k.x} ${k.y})`); return { ...k, g }; });

    // ----- Plan d'action -----
    G.card(40, 488, 1120, 270);
    S.head = el('g');
    text(S.head, 64, 530, 'Plan d’action', { size: 22, weight: 700, fill: C.ink });
    const cols = [['Chantier', 70], ['Action', 204], ['Responsable', 760], ['Échéance', 1000]];
    cols.forEach(([c, x]) => text(S.head, x, 562, c, { size: 16, weight: 700, fill: C.blue }));
    el('line', { x1: 64, y1: 572, x2: 1136, y2: 572, stroke: C.line, 'stroke-width': 2 }, S.head);
    S.rows = KZ.map((k, i) => {
      const y = ROW_Y[i];
      const g = el('g');
      if (i < 2) el('line', { x1: 64, y1: y + 27, x2: 1136, y2: y + 27, stroke: C.line, 'stroke-width': 1.5 }, g);
      fit(text(g, 204, y + 6, k.action, { size: 18, weight: 500, fill: C.ink }), 740, `action ${i}`);
      const who = el('g');
      G.pill(who, 760, y, k.who, { size: 16, h: 30, pad: 12, bg: C.pLav, fg: C.blue });
      const when = el('g');
      G.pill(when, 1000, y, k.when, { size: 16, h: 30, pad: 12, bg: C.pGreen, fg: C.tGreen });
      const icon = el('g');
      burst(icon, '', 0.45).setAttribute('transform', `translate(90 ${y})`);
      text(icon, 118, y + 6, k.lab, { size: 17, weight: 800, fill: C.ink });
      return { g, who, when, icon, y };
    });
    // Éclair en vol (de la carte vers la ligne du plan)
    S.fly = KZ.map(k => { const g = el('g', { opacity: 0 }); burst(g, k.lab); return g; });

    S.chute = G.blogChute('Sans cette seconde carte, la VSM reste un diagnostic.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;

    S.boxes.forEach((g, i) => pop(g, t, 1.75 + 0.15 * i, BX[i] + BW / 2, BY + BH / 2));
    S.stocks.forEach((g, i) => pop(g, t, 2.3 + 0.1 * i, GAPS[i], BY + 40));
    S.moves.forEach((g, i) => pop(g, t, 2.6 + 0.12 * i, [GAPS[1], GAPS[2]][i], BY - 30));
    pop(S.legend, t, 2.7, 160, 440);
    // Étiquette : état actuel puis état futur
    const fut = live ? clamp(prog(t, 3.3, 0.35)) : 1;
    S.pillA.setAttribute('opacity', live ? clamp(prog(t, 1.7, 0.3)) * (1 - fut) : 0);
    S.pillF.setAttribute('opacity', fo * fut);
    if (live && t >= 3.3 && t < 4.0) pulse(S.pillF, t, 3.35, 200, 214, 0.06, 0.4);
    else S.pillF.setAttribute('transform', '');

    pop(S.head, t, 3.5, 300, 545);

    KZ.forEach((k, i) => {
      const t0 = T_KZ[i];
      // Éclair sur la carte
      const p = live ? prog(t, t0, 0.4) : 1;
      const s = p <= 0 ? 0.001 : p >= 1 ? 1 : 0.5 + 0.5 * back(p);
      S.kz[i].g.setAttribute('transform', `translate(${k.x} ${k.y}) scale(${s}) rotate(${(1 - clamp(p)) * -30})`);
      S.kz[i].g.setAttribute('opacity', fo * clamp(p * 3));
      // Copie qui descend dans le plan
      const f = live ? prog(t, t0 + 0.55, FLY) : 1;
      const fe = easeInOut(f);
      const x = k.x + (90 - k.x) * fe, y = k.y + (ROW_Y[i] - k.y) * fe - 50 * Math.sin(Math.PI * f);
      const sc = 1 + (0.45 - 1) * fe;
      S.fly[i].firstChild.nextSibling && S.fly[i].querySelector('text').setAttribute('opacity', 1 - fe);
      S.fly[i].setAttribute('transform', `translate(${x} ${y}) scale(${sc})`);
      S.fly[i].setAttribute('opacity', live && f > 0 && f < 1 ? 1 : 0);
      // Ligne du plan
      const r = S.rows[i];
      const landed = t0 + 0.55 + FLY;
      r.icon.setAttribute('opacity', fo * (live ? (t >= landed ? 1 : 0) : 1));
      r.g.setAttribute('opacity', fo * (live ? clamp(prog(t, landed - 0.1, 0.35)) : 1));
      pop(r.who, t, landed + 0.3, 830, r.y);
      pop(r.when, t, landed + 0.5, 1040, r.y);
    });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
