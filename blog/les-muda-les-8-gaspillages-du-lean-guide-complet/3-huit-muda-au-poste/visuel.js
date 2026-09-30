// Blog · Les MUDA · section « Quels sont les 8 MUDA ? La liste, un par un »
// Mécanique : huit vignettes dans l'ordre de l'article, chacune rejoue le signe qui trahit le gaspillage sur le
// terrain : la pile d'en-cours monte alors que la commande reste à 4, l'opérateur attend devant une machine qui
// tourne, le chariot trace des allers-retours, l'opérateur quitte son poste pour l'armoire, le stock porte un « ? »,
// la pièce déjà validée repasse trois contrôles, les reprises tombent dans leur bac attitré, la boîte à idées
// reçoit une idée et reste fermée. Noms français et anglais, signes tirés de l'article.
// Rendu déterministe : window.FICHE.draw(t), boucle de 14 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const COLS = [40, 322, 604, 886], ROWS = [180, 474], TW = 272, TH = 284;
  const T0 = 1.8, STEP = 0.9, ANIM = 1.05;
  const CHUTE_T = T0 + STEP * 8 + 0.8;
  const S = { tiles: [] };

  // ---------- Pictos ----------
  function person(parent, cx, floor, k = 1, fill = C.blue) {
    const g = el('g', {}, parent);
    el('circle', { cx, cy: floor - 46 * k, r: 10 * k, fill }, g);
    el('path', { d: `M ${cx - 17 * k} ${floor} L ${cx - 17 * k} ${floor - 16 * k} Q ${cx - 17 * k} ${floor - 32 * k} ${cx} ${floor - 32 * k} Q ${cx + 17 * k} ${floor - 32 * k} ${cx + 17 * k} ${floor - 16 * k} L ${cx + 17 * k} ${floor} Z`, fill }, g);
    return g;
  }
  function forklift(parent) {
    const g = el('g', {}, parent);
    el('rect', { x: -22, y: -20, width: 32, height: 20, rx: 4, fill: C.lightBlue }, g);
    el('path', { d: 'M -15 -20 L -15 -34 L 2 -34 L 6 -20', fill: 'none', stroke: C.lightBlue, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    el('path', { d: 'M 16 -38 L 16 0 L 30 0', fill: 'none', stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    G.carton(g, 26, -12, 0.55);
    el('circle', { cx: -12, cy: 2, r: 6, fill: C.ink }, g);
    el('circle', { cx: 5, cy: 2, r: 6, fill: C.ink }, g);
    return g;
  }
  const floorLine = (g, x1, x2, y) => el('line', { x1, y1: y, x2, y2: y, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);

  // ---------- Vignettes (dessin + animation p de 0 à 1, 1 = état final) ----------
  const TILES = [
    { fr: 'Surproduction', en: 'overproduction', sign: ['Les en-cours grossissent,', 'la commande n’a pas bougé.'], make(g, x, y) {
      const fl = y + 200; floorLine(g, x + 20, x + 252, fl);
      G.machine(g, x + 26, fl - 50, 0.4);
      const tag = el('g', {}, g);
      G.pill(tag, x + 196, y + 82, 'Commande : 4', { size: 16, h: 30, pad: 10, bg: C.pLav, fg: C.blue, anchor: 'middle' });
      const boxes = [];
      for (let i = 0; i < 8; i++) { const c = i % 3, r = Math.floor(i / 3); boxes.push(G.carton(g, x + 160 + c * 30 + (r % 2) * 15, fl - 15 - r * 30, 0.84)); }
      return p => boxes.forEach((b, i) => b.setAttribute('opacity', clamp(p * 8 - i)));
    } },
    { fr: 'Attentes', en: 'waiting', sign: ['Debout devant une machine', 'qui tourne, sans rien à faire.'], make(g, x, y) {
      const fl = y + 200; floorLine(g, x + 20, x + 252, fl);
      const m = G.machine(g, x + 34, fl - 62, 0.5);
      person(g, x + 160, fl, 1);
      const ck = el('g', {}, g);
      const cx = x + 214, cy = y + 94;
      el('circle', { cx, cy, r: 24, fill: C.white, stroke: C.red, 'stroke-width': 3 }, ck);
      el('line', { x1: cx, y1: cy, x2: cx, y2: cy - 15, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, ck);
      const hand = el('line', { x1: cx, y1: cy, x2: cx, y2: cy - 19, stroke: C.red, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, ck);
      return p => { hand.setAttribute('transform', `rotate(${360 * 2 * easeInOut(p)} ${cx} ${cy})`); m.lights[1].setAttribute('fill', p > 0 && p < 1 && Math.floor(p * 10) % 2 ? C.yellow : C.green); };
    } },
    { fr: 'Transports', en: 'transportation', sign: ['Un flux qui dessine des', 'allers-retours dans l’atelier.'], make(g, x, y) {
      const fl = y + 200; floorLine(g, x + 20, x + 252, fl);
      el('rect', { x: x + 22, y: fl - 58, width: 30, height: 58, rx: 4, fill: C.pLav, stroke: C.blue, 'stroke-width': 2 }, g);
      el('rect', { x: x + 220, y: fl - 58, width: 30, height: 58, rx: 4, fill: C.pLav, stroke: C.blue, 'stroke-width': 2 }, g);
      text(g, x + 37, fl - 64, 'A', { size: 16, weight: 800, fill: C.blue, anchor: 'middle' });
      text(g, x + 235, fl - 64, 'B', { size: 16, weight: 800, fill: C.blue, anchor: 'middle' });
      const trace = [0, 1, 2].map(i => { const yy = fl - 62 - i * 16, d = i % 2 ? `M ${x + 200} ${yy} L ${x + 72} ${yy}` : `M ${x + 72} ${yy} L ${x + 200} ${yy}`; const a = G.arrow(g, d, { stroke: C.red, width: 2.5, head: 8, dash: '6 5' }); a.g.setAttribute('opacity', 0); return a.g; });
      const fk = forklift(g);
      return p => {
        const legs = 4, q = p * legs, leg = Math.min(legs - 1, Math.floor(q)), f = easeInOut(q - leg);
        const a = x + 78, b = x + 190;
        const fx = p >= 1 ? a : leg % 2 === 0 ? a + (b - a) * f : b + (a - b) * f;
        fk.setAttribute('transform', `translate(${fx} ${fl - 4})` + ((leg % 2 === 1 && p < 1) ? ` scale(-1 1)` : ''));
        trace.forEach((tr, i) => tr.setAttribute('opacity', p >= (i + 1) / 3.2 ? 1 : 0));
      };
    } },
    { fr: 'Mouvements', en: 'motion', sign: ['L’opérateur quitte son poste,', 'sans que ce soit prévu.'], make(g, x, y) {
      const fl = y + 200; floorLine(g, x + 20, x + 252, fl);
      G.machine(g, x + 24, fl - 56, 0.45);
      const cab = el('g', {}, g);
      el('rect', { x: x + 206, y: fl - 104, width: 46, height: 104, rx: 5, fill: C.white, stroke: C.blue, 'stroke-width': 2.5 }, cab);
      [0, 1, 2].forEach(i => el('line', { x1: x + 212, y1: fl - 76 + i * 26, x2: x + 246, y2: fl - 76 + i * 26, stroke: C.blue, 'stroke-width': 2 }, cab));
      const steps = [0, 1, 2, 3, 4].map(i => el('ellipse', { cx: x + 126 + i * 16, cy: fl + 10, rx: 5, ry: 3, fill: C.red, opacity: 0 }, g));
      const op = person(g, 0, 0, 0.95);
      return p => {
        const out = p < 0.5 ? easeInOut(p * 2) : 1 - easeInOut((p - 0.5) * 2);
        op.setAttribute('transform', `translate(${x + 116 + (x + 186 - x - 116) * out} ${fl})`);
        steps.forEach((s, i) => s.setAttribute('opacity', p >= 0.1 + i * 0.08 ? 1 : 0));
      };
    } },
    { fr: 'Stocks', en: 'inventory', sign: ['Personne ne sait à quelle', 'commande il correspond.'], make(g, x, y) {
      const fl = y + 200; floorLine(g, x + 20, x + 252, fl);
      const boxes = [];
      [[70, 0], [100, 0], [130, 0], [160, 0], [85, 1], [115, 1], [145, 1], [100, 2], [130, 2]].forEach(([dx, r]) => boxes.push(G.carton(g, x + dx, fl - 22 - r * 30, 0.84)));
      el('rect', { x: x + 50, y: fl - 8, width: 128, height: 8, rx: 2, fill: C.tYellow }, g);
      const tag = el('g', {}, g);
      el('line', { x1: x + 186, y1: fl - 60, x2: x + 206, y2: y + 110, stroke: C.ink, 'stroke-width': 2 }, tag);
      el('circle', { cx: x + 214, cy: y + 94, r: 22, fill: C.pRed, stroke: C.red, 'stroke-width': 2.5 }, tag);
      text(tag, x + 214, y + 104, '?', { size: 28, weight: 800, fill: C.tRed, anchor: 'middle' });
      return p => { boxes.forEach((b, i) => b.setAttribute('opacity', clamp(p * 12 - i))); const q = clamp((p - 0.7) / 0.3); const s = q <= 0 ? 0.001 : q >= 1 ? 1 : 0.6 + 0.4 * back(q); tag.setAttribute('transform', s === 1 ? '' : `translate(${x + 214} ${y + 94}) scale(${s}) translate(${-x - 214} ${-y - 94})`); tag.setAttribute('opacity', clamp(q * 3)); };
    } },
    { fr: 'Étapes inutiles', en: 'overprocessing', sign: ['Une opération justifiée', 'seulement par l’habitude.'], make(g, x, y) {
      const fl = y + 200; floorLine(g, x + 20, x + 252, fl);
      const xs = [x + 66, x + 136, x + 206];
      xs.forEach((cx, i) => {
        el('rect', { x: cx - 28, y: fl - 44, width: 56, height: 44, rx: 5, fill: C.pLav, stroke: C.blue, 'stroke-width': 2 }, g);
        text(g, cx, fl - 16, `C${i + 1}`, { size: 16, weight: 800, fill: C.blue, anchor: 'middle' });
      });
      const checks = xs.map(cx => { const k = el('g', {}, g); G.check(k, cx, y + 92, 13); return k; });
      const piece = G.carton(g, 0, 0, 0.8);
      return p => {
        const q = p * 3, i = Math.min(2, Math.floor(q));
        const px = p >= 1 ? xs[2] : xs[0] + (xs[2] - xs[0]) * easeInOut(p);
        piece.setAttribute('transform', `translate(${px} ${fl - 60})`);
        checks.forEach((k, j) => k.setAttribute('opacity', p >= (j + 0.6) / 3 || p >= 1 ? 1 : 0));
      };
    } },
    { fr: 'Rebuts et défauts', en: 'defects', sign: ['Un bac de reprise à sa place', 'attitrée depuis des années.'], make(g, x, y) {
      const fl = y + 200; floorLine(g, x + 20, x + 252, fl);
      G.machine(g, x + 24, fl - 56, 0.45);
      el('rect', { x: x + 140, y: fl - 4, width: 104, height: 8, fill: 'none', stroke: C.yellow, 'stroke-width': 3, 'stroke-dasharray': '8 5' }, g);
      const bin = el('g', {}, g);
      el('path', { d: `M ${x + 146} ${fl - 56} L ${x + 238} ${fl - 56} L ${x + 230} ${fl - 2} L ${x + 154} ${fl - 2} Z`, fill: C.red }, bin);
      text(bin, x + 192, fl - 22, 'Reprises', { size: 16, weight: 700, fill: C.white, anchor: 'middle' });
      const drops = [0, 1, 2].map(i => G.carton(g, 0, 0, 0.6, C.red));
      g.appendChild(bin);
      return p => drops.forEach((d, i) => {
        const q = clamp(p * 3 - i);
        const sx = x + 110, sy = fl - 50, ex = x + 172 + i * 20, ey = fl - 50;
        const e = easeInOut(q);
        d.setAttribute('transform', `translate(${sx + (ex - sx) * e} ${sy + (ey - sy) * e - 40 * Math.sin(Math.PI * q)})`);
        d.setAttribute('opacity', q > 0 ? 1 : 0);
      });
    } },
    { fr: 'Compétences', en: 'skills, non-utilized talent', sign: ['Une boîte à idées jamais', 'ouverte, sans réponse.'], make(g, x, y) {
      const fl = y + 200; floorLine(g, x + 20, x + 252, fl);
      person(g, x + 60, fl, 1);
      const box = el('g', {}, g);
      el('rect', { x: x + 150, y: fl - 104, width: 90, height: 70, rx: 6, fill: C.white, stroke: C.blue, 'stroke-width': 3 }, box);
      el('rect', { x: x + 172, y: fl - 90, width: 46, height: 6, rx: 3, fill: C.ink }, box);
      text(box, x + 195, fl - 56, 'Idées', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
      el('line', { x1: x + 195, y1: fl - 34, x2: x + 195, y2: fl, stroke: C.blue, 'stroke-width': 4 }, box);
      const web = el('path', { d: `M ${x + 150} ${fl - 104} Q ${x + 170} ${fl - 96} ${x + 176} ${fl - 104} M ${x + 150} ${fl - 104} L ${x + 168} ${fl - 88} M ${x + 150} ${fl - 86} Q ${x + 160} ${fl - 92} ${x + 164} ${fl - 104}`, fill: 'none', stroke: C.ink, 'stroke-width': 1.5, opacity: 0 }, g);
      const idea = el('g', {}, g);
      el('rect', { x: -14, y: -10, width: 28, height: 20, rx: 3, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, idea);
      el('circle', { cx: 0, cy: -1, r: 4, fill: C.yellow }, idea);
      return p => {
        const q = clamp(p / 0.7), e = easeInOut(q);
        const sx = x + 60, sy = fl - 70, ex = x + 195, ey = fl - 92;
        idea.setAttribute('transform', `translate(${sx + (ex - sx) * e} ${sy + (ey - sy) * e - 40 * Math.sin(Math.PI * q)}) scale(${1 - 0.5 * e})`);
        idea.setAttribute('opacity', q < 1 ? 1 : 0);
        web.setAttribute('opacity', clamp((p - 0.7) / 0.3));
      };
    } },
  ];

  function build() {
    G.templateBlog();
    G.blogTitle('Huit gaspillages,', 'huit signes.');
    G.blogChapeau('Chaque MUDA, son nom anglais et le signe qui le trahit sur le terrain.');
    TILES.forEach((T, i) => {
      const x = COLS[i % 4], y = ROWS[Math.floor(i / 4)];
      G.card(x, y, TW, TH);
      const g = el('g');
      G.badgeNum(g, x + 34, y + 34, i + 1, 17);
      const nm = text(g, x + 60, y + 32, T.fr, { size: 20, weight: 800, fill: C.ink });
      fit(nm, x + TW - 10, `nom ${i}`);
      fit(text(g, x + 60, y + 54, T.en, { size: 16, weight: 500, fill: C.blue }), x + TW - 10, `anglais ${i}`);
      const anim = T.make(g, x, y);
      T.sign.forEach((s, j) => fit(text(g, x + 20, y + 238 + j * 22, s, { size: 16, weight: 500, fill: C.tRed }), x + TW - 10, `signe ${i}.${j}`));
      S.tiles.push({ g, anim });
    });
    S.chute = G.blogChute('Reconnaître un gaspillage sur le papier ne suffit pas.', { y: 808 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;
    S.tiles.forEach((tl, i) => {
      const t0 = T0 + STEP * i;
      tl.g.setAttribute('opacity', fo * (live ? clamp(prog(t, t0, 0.25)) : 1));
      tl.anim(live ? prog(t, t0 + 0.2, ANIM) : 1);
    });
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 14, build, draw });
})();
