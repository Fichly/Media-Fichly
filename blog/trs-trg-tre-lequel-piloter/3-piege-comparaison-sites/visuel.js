// Blog · TRS, TRG, TRE · section « Le piège de la comparaison entre sites »
// Mécanique : le site A affiche 82 %, le site B 71 % ; le classement désigne B. On révèle les dénominateurs :
// A calcule un TRS en sortant 4 h d'arrêts planifiés, B un TRG sur 16 h d'ouverture. On ramène A sur la même base :
// son taux tombe à 61 %, le classement s'inverse et l'étiquette « doit progresser » change de site.
// Hypothèses : 16 h d'ouverture sur les deux sites, 4 h planifiées sorties par A ; temps utile A 9 h 50, B 11 h 22.
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const S = {};
  const BX = 330, PXH = 630 / 16, RX = 1060;
  const SITES = [
    { name: 'Site A', y0: 176, plan: 4, loss: 12 - 590 / 60, tu: 590 / 60, lossTxt: `2${NB}h${NB}10`, tuTxt: `utile : 9${NB}h${NB}50` },
    { name: 'Site B', y0: 420, plan: 2, loss: 16 - 2 - 682 / 60, tu: 682 / 60, lossTxt: `2${NB}h${NB}38`, tuTxt: `utile : 11${NB}h${NB}22` },
  ];

  function bracketD(x0, x1, y) { return `M ${x0} ${y + 10} L ${x0} ${y} L ${x1} ${y} L ${x1} ${y + 10}`; }

  function build() {
    G.templateBlog();
    G.blogTitle('Deux sites,', 'deux dénominateurs.', { size: 48 });
    G.blogChapeau('Le site A affiche 82 %, le site B 71 %. La réunion demande à B de progresser.');

    S.sites = SITES.map((s, i) => {
      const y0 = s.y0;
      G.card(40, y0, 1120, 230);
      const o = { ...s };
      o.head = el('g');
      G.pill(o.head, 64, y0 + 40, s.name, { size: 21, h: 38, bg: C.blue, fg: C.white });
      o.big = text(G.svg, 64, y0 + 136, '', { size: 66, weight: 800, fill: C.ink });
      o.sub = text(G.svg, 64, y0 + 172, '', { size: 19, weight: 700, fill: C.ink });

      // Barre des 16 h : planifié, autres pertes, temps utile
      const clip = G.clipRect(BX, y0 + 120, 0, 52);
      o.reveal = clip.rect;
      o.bar = el('g', { 'clip-path': clip.url });
      const xs = [BX, BX + s.plan * PXH, BX + (s.plan + s.loss) * PXH, BX + 16 * PXH];
      el('rect', { x: xs[0], y: y0 + 120, width: xs[1] - xs[0], height: 52, fill: C.lightBlue }, o.bar);
      el('rect', { x: xs[1], y: y0 + 120, width: xs[2] - xs[1], height: 52, fill: C.red }, o.bar);
      el('rect', { x: xs[2], y: y0 + 120, width: xs[3] - xs[2], height: 52, fill: C.green }, o.bar);
      el('rect', { x: BX, y: y0 + 120, width: 630, height: 52, rx: 10, fill: 'none', stroke: C.card, 'stroke-width': 6 }, o.bar);
      o.labs = el('g');
      text(o.labs, (xs[0] + xs[1]) / 2, y0 + 153, `${s.plan}${NB}h`, { size: 19, weight: 700, fill: C.white, anchor: 'middle' });
      text(o.labs, (xs[1] + xs[2]) / 2, y0 + 153, s.lossTxt, { size: 18, weight: 700, fill: C.white, anchor: 'middle' });
      text(o.labs, (xs[2] + xs[3]) / 2, y0 + 153, s.tuTxt, { size: 19, weight: 700, fill: C.white, anchor: 'middle' });
      o.xs = xs;

      // Dénominateur
      o.den = el('g');
      o.denPath = el('path', { fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, o.den);
      o.denText = text(o.den, 0, y0 + 96, '', { size: 19, weight: 700, fill: C.ink, anchor: 'middle' });

      // Rang et étiquette
      o.rank = el('g');
      o.rankC = el('circle', { cx: RX, cy: y0 + 110, r: 36, fill: C.blue }, o.rank);
      o.rankT = text(o.rank, RX, y0 + 119, '', { size: 26, weight: 800, fill: C.white, anchor: 'middle' });
      return o;
    });
    // Légende (carte A, en haut à droite)
    S.legend = el('g');
    let lx = 960;
    [[C.green, 'temps utile'], [C.red, 'autres pertes'], [C.lightBlue, 'arrêts planifiés']].forEach(([c, s]) => {
      const tt = text(S.legend, lx, 222, s, { size: 17, weight: 500, fill: C.ink, anchor: 'end' });
      const b = measure(tt);
      el('rect', { x: b.x - 24, y: 207, width: 16, height: 16, rx: 4, fill: c }, S.legend);
      lx = b.x - 40;
    });
    S.flag = el('g');
    const fp = G.pill(S.flag, RX, 0, 'doit progresser', { size: 17, h: 32, pad: 11, bg: C.red, fg: C.white, anchor: 'middle' });
    fit(fp.g, 1150, 'étiquette', 970);

    // Bilan
    G.card(40, 664, 1120, 96);
    S.sum = el('g');
    G.check(S.sum, 86, 705, 16);
    const st = text(S.sum, 114, 713, `Même base de 16${NB}h : B produit 1${NB}h${NB}32 de temps utile de plus que A.`, { size: 23, weight: 700, fill: C.tGreen });
    fit(st, 1140, 'bilan');

    S.chute = G.blogChute('Écrivez le dénominateur à côté du chiffre.', { y: 812 });
  }

  // ---------- Chronologie ----------
  const HEAD_T = 1.8, RANK_T = 2.6, FLAG_T = 3.0;
  const BAR_T = 3.8, BAR_D = 0.8, DEN_T = [5.1, 5.5];
  const BASE = 6.7, BASE_D = 1.0;
  const SWAP = 8.3, SWAP_D = 0.5, FLAG_MOVE = 8.9, FLAG_D = 0.7;
  const SUM_T = 10.0, CHUTE_T = 11.2;

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const base = live ? easeInOut(prog(t, BASE, BASE_D)) : 1;     // A ramené sur 16 h d'ouverture
    const swapped = !live || t >= SWAP + SWAP_D / 2;

    S.sites.forEach((s, i) => {
      pop(s.head, t, HEAD_T + 0.15 * i, 110, s.y0 + 40);
      const bo = o * (live ? clamp(prog(t, HEAD_T + 0.1 + 0.15 * i, 0.3)) : 1);
      // Taux affiché, puis taux sur la même base (A seulement)
      const rate = i === 0 ? 100 * s.tu / (12 + 4 * base) : 100 * s.tu / 16;
      s.big.textContent = `${Math.round(rate)}${NB}%`;
      s.big.setAttribute('opacity', bo);
      s.big.setAttribute('fill', i === 0 && base > 0.5 ? C.tRed : C.ink);
      s.sub.textContent = i === 0 && base >= 1 ? `affichait 82${NB}%` : 'taux affiché';
      s.sub.setAttribute('fill', i === 0 && base >= 1 ? C.tRed : C.ink);
      s.sub.setAttribute('opacity', bo);
      if (i === 0 && live && t >= BASE && t < BASE + BASE_D + 0.6) pulse(s.big, t, BASE + BASE_D, 140, s.y0 + 116, 0.08, 0.45);

      // Barre
      s.reveal.setAttribute('width', live ? Math.max(0.001, 630 * easeInOut(prog(t, BAR_T + 0.15 * i, BAR_D))) : 630);
      s.bar.setAttribute('opacity', o);
      s.labs.setAttribute('opacity', o * (live ? clamp(prog(t, BAR_T + BAR_D + 0.15 * i, 0.3)) : 1));

      // Dénominateur : A exclut ses 4 h planifiées, puis les réintègre
      const x0 = i === 0 ? s.xs[1] + (s.xs[0] - s.xs[1]) * base : s.xs[0];
      const x1 = s.xs[3];
      s.denPath.setAttribute('d', bracketD(x0, x1, s.y0 + 106));
      s.denText.setAttribute('x', (x0 + x1) / 2);
      s.denText.textContent = i === 0 && base < 0.5 ? `dénominateur : 12${NB}h requises (TRS)` : `dénominateur : 16${NB}h d’ouverture`;
      pop(s.den, t, DEN_T[i], (x0 + x1) / 2, s.y0 + 100);

      // Rang : 1er / 2e, retournement au moment de l'inversion
      const first = swapped ? i === 1 : i === 0;
      s.rankT.textContent = first ? '1er' : '2e';
      s.rankC.setAttribute('fill', first ? C.blue : '#b9b9d0');
      pop(s.rank, t, RANK_T + 0.15 * i, RX, s.y0 + 110);
      if (live && t >= SWAP && t < SWAP + SWAP_D) {
        const sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * prog(t, SWAP, SWAP_D))));
        s.rank.setAttribute('transform', `translate(${RX} 0) scale(${sx} 1) translate(${-RX} 0)`);
      }
    });
    pop(S.legend, t, BAR_T + BAR_D, 800, 215);

    // Étiquette « doit progresser » : sous le 2e, elle passe de B à A
    const yB = SITES[1].y0 + 182, yA = SITES[0].y0 + 182;
    const popS = p => (p <= 0 ? 0.001 : p >= 1 ? 1 : 0.6 + 0.4 * G.back(p));
    let fy = yA, fs = 1, fo = o;
    if (live && t < FLAG_MOVE) { const p = prog(t, FLAG_T, 0.35); fy = yB; fs = popS(p); fo = clamp(p / 0.4); }
    else if (live && t < FLAG_MOVE + 0.3) { const p = prog(t, FLAG_MOVE, 0.3); fy = yB; fs = Math.max(0.001, 1 - p); fo = 1 - p; }
    else if (live) { const p = prog(t, FLAG_MOVE + 0.35, 0.35); fs = popS(p); fo = clamp(p / 0.4); }
    S.flag.setAttribute('transform', `translate(0 ${fy})` + (fs === 1 ? '' : ` translate(${RX} 0) scale(${fs}) translate(${-RX} 0)`));
    S.flag.setAttribute('opacity', fo);

    pop(S.sum, t, SUM_T, 600, 705);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
