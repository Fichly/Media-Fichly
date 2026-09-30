// Blog · Value Stream Mapping · section « État futur : ce qu'on change, et dans quel ordre »
// Mécanique : trois stocks classés par quantité (A, le plus gros, en tête). Chaque quantité est divisée par la
// consommation du poste suivant : les barres se convertissent en jours d'attente et le classement s'inverse.
// C, le plus petit en pièces, est le plus long en jours : c'est lui qu'on attaque. En bas, l'ordre d'attaque de
// l'article, avec le deuxième point (les stocks les plus longs) mis en avant.
// Hypothèses : quantités et consommations illustratives (600 pour 600/j, 300 pour 100/j comme dans l'article, 120 pour 20/j).
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const STOCKS = [
    { name: 'Stock A', q: 600, c: 600, d: 1 },
    { name: 'Stock B', q: 300, c: 100, d: 3 },
    { name: 'Stock C', q: 120, c: 20, d: 6 },
  ];
  const ROW_Y = [262, 378, 494];               // rang 1, 2, 3
  const BX = 360, PX_Q = 1.0, PX_D = 100;      // 600 pièces = 600 px ; 6 jours = 600 px
  const dayRank = [2, 1, 0];                   // A → rang 3, B → rang 2, C → rang 1
  const T_BARS = 1.9, T_QR = 3.0, T_CONS = 4.2, T_CONV = 5.2, D_CONV = 1.0, T_SORT = 6.7, D_SORT = 1.1;
  const T_KZ = 8.1, T_ORDER = 9.0, CHUTE_T = 11.4;
  const S = {};

  function burstPath(cx, cy, r1, r2, n = 12) {
    let d = '';
    for (let i = 0; i < 2 * n; i++) {
      const r = i % 2 ? r2 : r1, a = Math.PI * i / n - Math.PI / 2;
      d += `${i ? 'L' : 'M'} ${cx + r * Math.cos(a) * 1.3} ${cy + r * Math.sin(a)} `;
    }
    return d + 'Z';
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Le plus long,', 'pas le plus gros.');
    G.blogChapeau(`Trois stocks de l’état actuel : lequel attaquer en premier sur l’état futur${NB}?`);

    G.card(40, 176, 1120, 424);
    S.hQ = el('g');
    G.pill(S.hQ, 64, 212, 'Classement par quantité', { size: 19, h: 34, bg: C.pYellow, fg: C.tYellow });
    S.hD = el('g');
    G.pill(S.hD, 64, 212, 'Classement en jours d’attente', { size: 19, h: 34, bg: C.pRed, fg: C.tRed });
    S.formula = el('g');
    text(S.formula, 1136, 219, 'jours = quantité ÷ consommation du poste suivant', { size: 17, weight: 500, fill: C.ink, anchor: 'end' });

    S.rows = STOCKS.map((s, i) => {
      const g = el('g');           // déplacé verticalement lors du tri (origine : y = 0)
      el('path', { d: `M 64 22 L 88 -20 L 112 22 Z`, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      text(g, 88, 16, 'I', { size: 17, weight: 800, fill: C.tYellow, anchor: 'middle' });
      text(g, 128, -4, s.name, { size: 21, weight: 700, fill: C.ink });
      text(g, 128, 22, `${s.q} pièces`, { size: 18, weight: 500, fill: C.ink });
      const cons = text(g, 128, 46, `consommé : ${s.c} / jour`, { size: 16, weight: 500, fill: C.tRed });
      const bar = el('rect', { x: BX, y: -16, width: 0, height: 36, rx: 8, fill: C.yellow }, g);
      const lab = text(g, 0, 10, '', { size: 21, weight: 800, fill: C.ink });
      const qRank = el('g', {}, g);
      el('circle', { cx: 330, cy: 2, r: 15, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, qRank);
      text(qRank, 330, 8, String(i + 1), { size: 16, weight: 800, fill: C.tYellow, anchor: 'middle' });
      const dRank = el('g', {}, g);
      G.badgeNum(dRank, 1110, 2, dayRank[i] + 1, 17);
      return { ...s, i, g, cons, bar, lab, qRank, dRank };
    });
    G.svg.appendChild(S.rows[2].g);
    S.rankHead = el('g');
    text(S.rankHead, 1110, 580, 'rang', { size: 16, weight: 700, fill: C.blue, anchor: 'middle' });
    S.qHead = text(G.svg, 330, 580, 'rang', { size: 16, weight: 700, fill: C.tYellow, anchor: 'middle' });

    S.kz = el('g');
    el('path', { d: burstPath(0, 0, 30, 18), fill: C.yellow, stroke: C.red, 'stroke-width': 3, 'stroke-linejoin': 'round' }, S.kz);
    S.kzLab = el('g');
    G.pill(S.kzLab, 0, 0, 'on attaque celui-ci', { size: 17, h: 30, pad: 12, bg: C.blue, fg: C.white });

    // Ordre d'attaque (article)
    G.card(40, 616, 1120, 142);
    S.order = el('g');
    text(S.order, 64, 652, 'L’ordre d’attaque de l’état futur', { size: 19, weight: 700, fill: C.ink });
    const ITEMS = [['Le poste qui', 'donne le rythme'], ['Les stocks', 'les plus longs'], ['Les changements', 'de série'], ['Le flux', 'd’information']];
    S.items = ITEMS.map(([a, b], i) => {
      const x = 64 + i * 270;
      const g = el('g', {}, S.order);
      const bg = el('rect', { x: x - 8, y: 668, width: 258, height: 78, rx: 14, fill: i === 1 ? C.pGreen : 'none' }, g);
      G.badgeNum(g, x + 18, 707, i + 1, 16);
      text(g, x + 44, 701, a, { size: 18, weight: i === 1 ? 800 : 600, fill: i === 1 ? C.tGreen : C.ink });
      text(g, x + 44, 725, b, { size: 18, weight: i === 1 ? 800 : 600, fill: i === 1 ? C.tGreen : C.ink });
      return { g, bg };
    });

    S.chute = G.blogChute('Pas les plus gros en quantité, les plus longs en jours d’attente.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;
    const conv = live ? easeInOut(prog(t, T_CONV, D_CONV)) : 1;
    const sort = live ? easeInOut(prog(t, T_SORT, D_SORT)) : 1;

    S.hQ.setAttribute('opacity', live ? clamp(prog(t, 1.7, 0.3)) * (1 - clamp(prog(t, T_CONV, 0.3))) : 0);
    S.hD.setAttribute('opacity', fo * (live ? clamp(prog(t, T_CONV + 0.2, 0.3)) : 1));
    S.formula.setAttribute('opacity', fo * (live ? clamp(prog(t, T_CONS - 0.2, 0.3)) : 1));

    S.rows.forEach((r, i) => {
      // Tri : du rang « quantité » (i) au rang « jours »
      const y = ROW_Y[i] + (ROW_Y[dayRank[i]] - ROW_Y[i]) * sort;
      const bump = Math.sin(Math.PI * sort);
      const arc = i === 0 ? 70 * bump : 0;
      r.g.setAttribute('transform', `translate(${arc} ${y})`);
      r.g.setAttribute('opacity', fo * (live ? clamp(prog(t, 1.75 + 0.12 * i, 0.3)) : 1) * (i === 2 ? 1 : 1 - 0.6 * bump));
      // Barre : quantité (jaune) puis jours (rouge)
      const grow = live ? easeOut(prog(t, T_BARS + 0.15 * i, 0.6)) : 1;
      const wq = r.q * PX_Q, wd = r.d * PX_D;
      const w = (wq + (wd - wq) * conv) * grow;
      r.bar.setAttribute('width', Math.max(0.001, w));
      r.bar.setAttribute('fill', conv < 0.5 ? C.yellow : C.red);
      r.lab.setAttribute('x', BX + w + 14);
      r.lab.textContent = conv < 0.5 ? `${r.q} pcs` : `${r.d}${NB}jour${r.d > 1 ? 's' : ''}`;
      r.lab.setAttribute('fill', conv < 0.5 ? C.tYellow : C.tRed);
      r.lab.setAttribute('opacity', (live ? clamp(prog(t, T_BARS + 0.15 * i + 0.4, 0.3)) : 1) * (conv > 0.3 && conv < 0.7 ? 0 : 1));
      r.cons.setAttribute('opacity', live ? clamp(prog(t, T_CONS + 0.2 * i, 0.3)) : 1);
      // Rangs
      const qo = live ? clamp(prog(t, T_QR + 0.1 * i, 0.3)) : 1;
      r.qRank.setAttribute('opacity', qo);
      pop(r.dRank, t, T_SORT + D_SORT + 0.1 * dayRank[i], 1110, 2);
    });
    S.qHead.setAttribute('opacity', fo * (live ? clamp(prog(t, T_QR, 0.3)) : 1));
    S.rankHead.setAttribute('opacity', fo * (live ? clamp(prog(t, T_SORT + D_SORT, 0.3)) : 1));

    // Éclair sur le stock C (rang 1 en jours)
    const kp = live ? prog(t, T_KZ, 0.4) : 1;
    const ks = kp <= 0 ? 0.001 : kp >= 1 ? 1 : 0.5 + 0.5 * back(kp);
    const kx = 88, ky = ROW_Y[0] + 4;
    S.kz.setAttribute('transform', `translate(${kx} ${ky}) scale(${ks}) rotate(${(1 - clamp(kp)) * -30})`);
    S.kz.setAttribute('opacity', fo * clamp(kp * 3));
    const lp = live ? prog(t, T_KZ + 0.3, 0.35) : 1;
    const ls = lp <= 0 ? 0.001 : lp >= 1 ? 1 : 0.6 + 0.4 * back(lp);
    S.kzLab.setAttribute('transform', `translate(420 ${ky - 42}) scale(${ls})`);
    S.kzLab.setAttribute('opacity', fo * clamp(lp * 3));

    pop(S.order, t, T_ORDER, 600, 700);
    S.items.forEach((it, i) => { if (i === 1 && live && t >= T_ORDER + 0.5 && t < T_ORDER + 1.2) pulse(it.g, t, T_ORDER + 0.5, 380, 707, 0.06, 0.45); else it.g.setAttribute('transform', ''); });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
