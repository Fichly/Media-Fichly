// Blog · Takt time · section « Takt time et temps de cycle : la comparaison qui décide »
// Mécanique : un seul métronome (takt 95 s, le client prend une pièce à chaque battement) et trois postes qui ne
// diffèrent que par leur temps de cycle. Une tête de lecture fait avancer le temps : à 70 s les pièces sortent avant
// le battement et s'accumulent (stock) ; à 95 s chaque pièce sort sur le battement ; à 108 s chaque pièce sort
// après le battement et l'écart grandit de 13 s par pièce, jusqu'à 1 h 44 sur 480 pièces.
// Hypothèse : cycle 70 s pour le cas « bien inférieur au takt » (l'article ne le chiffre pas).
// Rendu déterministe : window.FICHE.draw(t), boucle de 16 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = '\u00a0';

  const TAKT = 95, WIN = 790;
  const X = s => 330 + s * (1110 - 330) / WIN;
  const SIM0 = 2.8, SIM1 = 11.3;
  const simSec = t => (t < FADE_END ? WIN : t < SIM0 ? 0 : Math.min(WIN, WIN * (t - SIM0) / (SIM1 - SIM0)));
  const TICKS = Array.from({ length: Math.floor(WIN / TAKT) }, (_, i) => TAKT * (i + 1));
  const LANES = [
    { y: 322, c: 70, kind: 'fast', pill: 'Cycle 70 s', sub: 'plus vite que le takt', bg: C.pYellow, fg: C.tYellow, end: ['Sur la journée :', '171 pièces de trop'] },
    { y: 466, c: 95, kind: 'ok', pill: 'Cycle 95 s', sub: 'calé sur la demande', bg: C.pGreen, fg: C.tGreen, end: ['Protégez la stabilité :', 'un aléa fait basculer'] },
    { y: 610, c: 108, kind: 'slow', pill: 'Cycle 108 s', sub: 'poste le plus lent', bg: C.pRed, fg: C.tRed, end: ['Sur 480 pièces :', `1${NB}h${NB}44 de retard`] },
  ];
  const END_T = 11.6, CHUTE_T = 12.5;
  const S = {};

  function build() {
    G.templateBlog();
    G.blogTitle('Stock ou retard,', 'selon le cycle.');
    G.blogChapeau(`Même demande, même takt de 95 s : seul le temps de cycle du poste change.`);

    G.card(40, 176, 1120, 582);

    // Métronome : battements numérotés, lignes de takt à travers les trois postes
    S.metro = el('g');
    G.pill(S.metro, 64, 218, 'Takt 95 s', { size: 20, h: 36, bg: C.blue, fg: C.white });
    fit(text(S.metro, 64, 256, '1 pièce prise par battement', { size: 16, weight: 500, fill: C.ink }), 318, 'métronome');
    S.grid = el('g');
    TICKS.forEach(s => el('line', { x1: X(s), y1: 240, x2: X(s), y2: 680, stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '4 5', opacity: 0.45 }, S.grid));
    S.beats = TICKS.map((s, i) => { const g = el('g'); G.badgeNum(g, X(s), 222, i + 1, 15); return g; });
    el('line', { x1: X(0), y1: 206, x2: X(0), y2: 680, stroke: C.line, 'stroke-width': 3 });

    S.lanes = LANES.map((L, li) => {
      const g = el('g');
      if (li) el('line', { x1: 64, y1: L.y - 64, x2: 1136, y2: L.y - 64, stroke: C.line, 'stroke-width': 2 }, g);
      G.pill(g, 64, L.y - 26, L.pill, { size: 20, h: 36, bg: L.bg, fg: L.fg });
      text(g, 64, L.y + 8, L.sub, { size: 17, weight: 500, fill: C.ink });
      el('line', { x1: X(0), y1: L.y + 20, x2: 1130, y2: L.y + 20, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.35 }, g);
      const num = text(G.svg, 64, L.y + 44, '', { size: 21, weight: 800, fill: L.fg });
      const end = el('g');
      fit(text(end, 64, L.y + 42, L.end[0], { size: 17, weight: 500, fill: L.fg }), 318, `fin ${li}`);
      fit(text(end, 64, L.y + 64, L.end[1], { size: 19, weight: 800, fill: L.fg }), 318, `fin ${li}`);
      // Pièces : une par cycle
      const pieces = [];
      for (let k = 1; L.c * k <= WIN; k++) {
        const pg = el('g');
        const box = G.carton(pg, X(L.c * k), L.y + 4, 0.62);
        const tick = el('g', {}, pg);
        G.check(tick, X(L.c * k) + 12, L.y - 12, 7);
        pieces.push({ k, s: L.c * k, g: pg, box, tick });
      }
      // Écarts de retard (poste lent)
      const gaps = [];
      if (L.kind === 'slow') {
        pieces.forEach(p => {
          const a = X(TAKT * p.k);
          const r = el('rect', { x: a, y: L.y + 26, width: 0, height: 12, rx: 3, fill: C.red });
          const lab = text(G.svg, a, L.y + 58, `${13 * p.k} s`, { size: 16, weight: 700, fill: C.tRed });
          gaps.push({ k: p.k, a, r, lab });
        });
      }
      return { ...L, g, num, end, pieces, gaps };
    });

    // Tête de lecture
    S.head = el('g');
    el('line', { x1: 0, y1: 244, x2: 0, y2: 680, stroke: C.blue, 'stroke-width': 3 }, S.head);
    el('path', { d: 'M -8 238 L 8 238 L 0 250 Z', fill: C.blue }, S.head);

    S.foot = el('g');
    const f1 = text(S.foot, 330, 722, 'L’écart au takt grandit à chaque pièce :', { size: 19, weight: 500, fill: C.ink });
    const f2 = text(S.foot, measure(f1).x + measure(f1).width + 8, 722, `13 s × 480 = 6${NB}240 s, soit 1${NB}h${NB}44.`, { size: 19, weight: 700, fill: C.tRed });
    fit(f2, 1136, 'pied');

    S.chute = G.blogChute('Un takt se subit. Ce qui se pilote, c’est le temps de cycle.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const fo = fading(t) ? fadeOut(t) : 1;
    const s = simSec(t);
    pop(S.metro, t, 1.7, 150, 250);
    const gridO = fo * (live ? clamp(prog(t, 2.0, 0.4)) : 1);
    S.grid.setAttribute('opacity', gridO);
    S.beats.forEach((b, i) => {
      pop(b, t, 1.9 + 0.05 * i, X(TICKS[i]), 222);
      // Battement : pulse quand la tête de lecture passe
      const tb = SIM0 + (SIM1 - SIM0) * TICKS[i] / WIN;
      if (live && t >= tb && t < tb + 0.6) pulse(b, t, tb, X(TICKS[i]), 222, 0.25, 0.35);
    });
    S.head.setAttribute('transform', `translate(${X(s)} 0)`);
    S.head.setAttribute('opacity', live && t >= SIM0 - 0.3 && t < SIM1 + 0.3 ? clamp(prog(t, SIM0 - 0.3, 0.3)) * (1 - prog(t, SIM1, 0.3)) : 0);

    S.lanes.forEach((L, li) => {
      pop(L.g, t, 2.1 + 0.2 * li, 180, L.y);
      const consumed = TICKS.filter(x => x <= s).length;
      let stock = 0;
      L.pieces.forEach(p => {
        const landed = s >= p.s;
        const pl = live ? clamp((s - p.s) / 14) : 1;
        // Livrée : au battement k (ou à sa sortie si elle est en retard)
        const due = Math.max(TAKT * p.k, p.s);
        const delivered = s >= due;
        if (landed && !delivered) stock++;
        const drop = landed ? (1 - easeOut(pl)) * -30 : 0;
        p.box.setAttribute('transform', `translate(${X(p.s)} ${L.y + 4 + drop})`);
        p.g.setAttribute('opacity', fo * (landed ? clamp(pl * 2) : 0) * (delivered ? 0.45 : 1));
        p.tick.setAttribute('opacity', delivered ? 1 : 0);
      });
      L.gaps.forEach(gp => {
        const a = TAKT * gp.k, b = 108 * gp.k;
        const w = clamp((s - a) / (b - a)) * (X(b) - X(a));
        gp.r.setAttribute('width', Math.max(0.001, w));
        gp.r.setAttribute('opacity', fo * (s > a ? 1 : 0));
        gp.lab.setAttribute('opacity', fo * (s >= b ? 1 : 0));
      });
      // Compteur à gauche : remplacé par la projection sur la journée en fin de simulation
      const endO = live ? clamp(prog(t, END_T + 0.2 * li, 0.35)) : 1;
      if (L.kind === 'fast') L.num.textContent = `Stock : ${stock} pièce${stock > 1 ? 's' : ''}`;
      else if (L.kind === 'ok') L.num.textContent = 'Ni stock, ni retard';
      else {
        const late = L.pieces.filter(p => s >= p.s).length;
        L.num.textContent = `Retard : ${13 * late} s`;
      }
      L.num.setAttribute('opacity', fo * (live ? clamp(prog(t, SIM0, 0.3)) * (1 - endO) : 0));
      L.end.setAttribute('opacity', fo * endO);
    });

    rise(S.foot, t, END_T + 0.5, 0.4);
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 16, build, draw });
})();
