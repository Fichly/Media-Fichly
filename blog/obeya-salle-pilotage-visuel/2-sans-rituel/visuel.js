// Blog · Obeya · section « À quelle fréquence se tenir devant, et combien de temps ? »
// Mécanique : deux salles composées à l'identique (mêmes cinq zones). Douze semaines passent.
// À gauche, pas de créneau fixe : après l'inauguration, personne ne vient ; la date de mise à jour vieillit,
// les échéances sont dépassées, l'indicateur sort du seuil sans réaction, aucune décision n'est prise.
// À droite, un créneau fixe chaque semaine : la date suit, les échéances bougent, le seuil franchi déclenche
// une réaction, une décision est écrite à chaque séance. L'affichage est le même ; seule la fréquence change.
// Rendu déterministe : window.FICHE.draw(t), boucle de 15 s, image complète à t = 0.
(() => {
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse } = G;
  const NB = ' ';

  const PANELS = [{ x: 40, rit: false }, { x: 610, rit: true }];
  const PW = 550;
  const ZW = 94, ZY = 240, ZH = 156;
  const ZX = (x0, k) => x0 + 28 + k * 100;
  const AX = { y: 446, l: 40, r: 510 };
  const NW = 12;                              // semaines simulées
  const T0 = 3.0, WK = 0.7;                   // semaine 1 à T0, puis une semaine toutes les 0,7 s
  const TW = w => T0 + WK * (w - 1);
  const weekAt = t => (t < FADE_END ? NW : t < T0 ? 1 : Math.min(NW, 1 + (t - T0) / WK));
  const DUE0 = [3, 4, 5];
  // Indicateur hebdomadaire (seuil = 5)
  const KPI = {
    false: [7, 8, 7, 6, 6, 4, 3.5, 3, 2.5, 3, 2.5, 2],
    true: [7, 8, 7, 8, 7, 4, 6, 7.5, 8, 8, 8.5, 9],
  };
  const ITEMS = {
    false: [[4, 'Plus aucune date à jour'], [5, 'Échéances dépassées'], [7, 'Hors seuil, rien ne bouge'], [9, 'Aucune décision prise']],
    true: [[2, 'Chaque zone datée'], [4, 'Un nom, une date qui bouge'], [7.5, `Hors seuil${NB}: on réagit`], [9, 'Une décision par séance']],
  };
  const CHUTE_T = TW(NW) + 0.5;

  const S = { panels: [] };

  function build() {
    G.templateBlog();
    G.blogTitle('Sans rituel,', 'une salle décorée.');
    G.blogChapeau('Même mur, mêmes cinq zones. Une seule différence : un créneau fixe chaque semaine.');

    PANELS.forEach(P => {
      const x0 = P.x, rit = P.rit;
      const L = { x0, rit };
      G.card(x0, 176, PW, 584);
      L.head = el('g');
      G.pill(L.head, x0 + 24, 210, rit ? 'Créneau fixe, chaque semaine' : 'Pas de créneau fixe', { size: 20, h: 36, bg: rit ? C.pGreen : C.pRed, fg: rit ? C.tGreen : C.tRed });
      // Étiquette de mise à jour (texte variable)
      L.tagG = el('g');
      L.tagBg = el('rect', { y: 196, height: 30, rx: 15 }, L.tagG);
      L.tag = text(L.tagG, 0, 217, '', { size: 17, weight: 700 });

      // Cinq zones (fonds fixes) et leur contenu
      for (let k = 0; k < 5; k++) el('rect', { x: ZX(x0, k), y: ZY, width: ZW, height: ZH, rx: 10, fill: C.white, stroke: C.line, 'stroke-width': 2 });
      L.wall = el('g');
      for (let k = 0; k < 5; k++) text(L.wall, ZX(x0, k) + 10, ZY + 22, String(k + 1), { size: 17, weight: 800, fill: C.blue });
      // Zone 1 : cible, situation, écart
      let zx = ZX(x0, 0);
      el('line', { x1: zx + 8, y1: 290, x2: zx + 66, y2: 290, stroke: C.tGreen, 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, L.wall);
      el('path', { d: `M ${zx + 10} 372 L ${zx + 26} 364 L ${zx + 42} 368 L ${zx + 58} 350`, fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linejoin': 'round' }, L.wall);
      G.arrow(L.wall, `M ${zx + 76} 346 L ${zx + 76} 298`, { stroke: C.red, width: 2.5, head: 6 });
      // Zone 2 : plan
      zx = ZX(x0, 1);
      [[290, 8, 40, C.green], [314, 20, 58, C.green], [338, 44, 78, C.red], [362, 60, 86, C.pLav]].forEach(([y, a, b, c]) => {
        el('rect', { x: zx + 8, y: y - 6, width: 78, height: 12, rx: 4, fill: C.line, opacity: 0.6 }, L.wall);
        el('rect', { x: zx + a, y: y - 6, width: b - a, height: 12, rx: 4, fill: c }, L.wall);
      });
      el('line', { x1: zx + 52, y1: 276, x2: zx + 52, y2: 378, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, L.wall);
      // Zone 3 : problèmes, un nom, une échéance (texte variable)
      zx = ZX(x0, 2);
      L.rows = [292, 330, 368].map((y, i) => {
        const g = el('g', {}, L.wall);
        el('circle', { cx: zx + 20, cy: y, r: 10, fill: [C.teal, C.violet, C.lightBlue][i] }, g);
        el('circle', { cx: zx + 20, cy: y - 2.5, r: 3.5, fill: C.white }, g);
        const d = text(g, zx + 36, y + 6, '', { size: 17, weight: 700, fill: C.ink });
        return { g, d, y, cx: zx + 47 };
      });
      // Zone 4 : indicateur et seuil
      zx = ZX(x0, 3);
      const z4 = zx;
      L.kx = w => z4 + 10 + (w - 1) * (74 / (NW - 1));
      L.ky = v => 384 - v * 9;
      el('line', { x1: zx + 6, y1: L.ky(5), x2: zx + 88, y2: L.ky(5), stroke: C.red, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, L.wall);
      L.kpi = el('path', { fill: 'none', stroke: C.blue, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, L.wall);
      L.kdot = el('circle', { r: 5.5, fill: C.blue }, L.wall);
      // Zone 5 : décisions à prendre
      zx = ZX(x0, 4);
      L.cards = [272, 332].map(y => {
        const g = el('g', {}, L.wall);
        const box = el('rect', { x: zx + 8, y, width: 78, height: 52, rx: 6, fill: C.pYellow, stroke: C.yellow, 'stroke-width': 2 }, g);
        el('rect', { x: zx + 16, y: y + 14, width: 50, height: 7, rx: 3.5, fill: C.ink, opacity: 0.3 }, g);
        el('rect', { x: zx + 16, y: y + 29, width: 36, height: 7, rx: 3.5, fill: C.ink, opacity: 0.2 }, g);
        return { g, box, cx: zx + 47, cy: y + 26 };
      });

      // Frise des semaines et séances tenues
      L.axis = el('g');
      el('line', { x1: x0 + AX.l, y1: AX.y, x2: x0 + AX.r, y2: AX.y, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, L.axis);
      L.prog = el('line', { x1: x0 + AX.l, y1: AX.y, x2: x0 + AX.l, y2: AX.y, stroke: C.blue, 'stroke-width': 4, 'stroke-linecap': 'round' }, L.axis);
      L.tx = w => x0 + AX.l + (w - 1) * ((AX.r - AX.l) / (NW - 1));
      text(L.axis, L.tx(1), AX.y + 30, 'S1', { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
      text(L.axis, L.tx(NW), AX.y + 30, `S${NW}`, { size: 17, weight: 600, fill: C.ink, anchor: 'middle' });
      text(L.axis, (L.tx(1) + L.tx(NW)) / 2, AX.y + 30, rit ? 'une séance par semaine' : 'une inauguration, puis rien', { size: 17, weight: 600, fill: rit ? C.tGreen : C.tRed, anchor: 'middle' });
      L.sessions = [];
      for (let w = 1; w <= NW; w++) {
        if (!rit && w > 1) break;
        L.sessions.push({ w, c: el('circle', { cx: L.tx(w), cy: AX.y, r: 8, fill: rit ? C.blue : C.ink, stroke: C.card, 'stroke-width': 2.5 }) });
      }

      // Liste des signes
      L.items = ITEMS[rit].map(([w, s], i) => {
        const g = el('g');
        const cy = 548 + 50 * i;
        (rit ? G.check : G.cross)(g, x0 + 44, cy, 14);
        fit(text(g, x0 + 68, cy + 7, s, { size: 19, weight: 700, fill: rit ? C.tGreen : C.tRed }), x0 + 360, `signe ${i}`);
        return { g, w, cy };
      });
      // Compteur de décisions
      L.counter = el('g');
      el('rect', { x: x0 + 372, y: 520, width: 154, height: 180, rx: 18, fill: rit ? C.pGreen : C.pRed }, L.counter);
      text(L.counter, x0 + 449, 556, 'décisions', { size: 18, weight: 600, fill: rit ? C.tGreen : C.tRed, anchor: 'middle' });
      text(L.counter, x0 + 449, 578, 'prises', { size: 18, weight: 600, fill: rit ? C.tGreen : C.tRed, anchor: 'middle' });
      L.num = text(L.counter, x0 + 449, 662, '', { size: 64, weight: 800, fill: rit ? C.tGreen : C.tRed, anchor: 'middle' });
      S.panels.push(L);
    });

    S.chute = G.blogChute('Une Obeya sans rituel est une salle décorée.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o0 = fading(t) ? fadeOut(t) : 1;
    const W = weekAt(t);
    const wi = Math.floor(W + 1e-6);

    S.panels.forEach((L, pi) => {
      const rit = L.rit, x0 = L.x0;
      pop(L.head, t, 1.75 + 0.2 * pi, x0 + 150, 210);
      pop(L.wall, t, 1.9 + 0.2 * pi, x0 + PW / 2, ZY + ZH / 2);
      pop(L.axis, t, 2.2 + 0.2 * pi, x0 + PW / 2, AX.y);
      pop(L.counter, t, 2.4 + 0.2 * pi, x0 + 449, 610);

      // Semaine de la dernière mise à jour
      const upd = rit ? wi : 1;
      const stale = !rit && W >= 4;
      L.tag.textContent = `à jour${NB}: S${upd}`;
      L.tag.setAttribute('fill', stale ? C.white : rit ? C.tGreen : C.ink);
      const tw = measure(L.tag).width;
      L.tag.setAttribute('x', x0 + 526 - 12 - tw);
      L.tagBg.setAttribute('x', x0 + 526 - 24 - tw);
      L.tagBg.setAttribute('width', tw + 24);
      L.tagBg.setAttribute('fill', stale ? C.red : rit ? C.pGreen : C.pLav);
      L.tagG.setAttribute('opacity', live ? clamp(prog(t, 2.0 + 0.2 * pi, 0.3)) : o0);
      if (rit && live && t >= T0) pulse(L.tagG, t, TW(wi), x0 + 470, 211, 0.08, 0.3);
      else if (!rit && live && t >= TW(4)) pulse(L.tagG, t, TW(4), x0 + 470, 211, 0.12, 0.4);
      else L.tagG.setAttribute('transform', '');

      // Échéances : figées et dépassées à gauche, repoussées à chaque séance à droite
      L.rows.forEach((r, i) => {
        let due = DUE0[i];
        if (rit) while (due <= wi) due += 3;
        r.d.textContent = `S${due}`;
        const late = !rit && W >= due + 1;
        r.d.setAttribute('fill', late ? C.tRed : C.ink);
        if (rit && live && (wi - DUE0[i]) % 3 === 0 && wi >= DUE0[i]) pulse(r.g, t, TW(wi), r.cx, r.y, 0.14, 0.4);
        else if (!rit && live && W >= due + 1 && W < due + 2) pulse(r.g, t, TW(due + 1), r.cx, r.y, 0.14, 0.4);
        else r.g.setAttribute('transform', '');
      });

      // Indicateur tracé jusqu'à la semaine courante
      const v = KPI[rit];
      const pts = [];
      for (let w = 1; w <= Math.min(W, NW) + 1e-6; w++) pts.push([L.kx(w), L.ky(v[w - 1])]);
      if (W % 1 > 0 && W < NW) {
        const a = Math.floor(W), f = W - a;
        pts.push([L.kx(a + f), L.ky(v[a - 1] + (v[a] - v[a - 1]) * f)]);
      }
      L.kpi.setAttribute('d', 'M ' + pts.map(p => p.join(' ')).join(' L '));
      const last = pts[pts.length - 1];
      L.kdot.setAttribute('cx', last[0]); L.kdot.setAttribute('cy', last[1]);
      const below = L.ky(5) < last[1];
      L.kdot.setAttribute('fill', below ? C.red : C.blue);
      L.kpi.setAttribute('stroke', below && !rit ? C.red : C.blue);

      // Séances : un point par semaine tenue ; à droite, une décision écrite à chaque séance
      L.sessions.forEach(s => s.c.setAttribute('opacity', live ? (t >= TW(s.w) ? 1 : 0) : o0));
      L.prog.setAttribute('x2', L.tx(W));
      const n = rit ? wi : 0;
      L.num.textContent = String(live && t < T0 ? 0 : n);
      if (rit && live && t >= T0) {
        pulse(L.num, t, TW(wi), x0 + 449, 640, 0.12, 0.3);
        const c = L.cards[0];
        const f = G.window01(t, TW(wi), TW(wi) + 0.45, 0.1);
        c.box.setAttribute('fill', f > 0.5 ? C.pGreen : C.pYellow);
        c.box.setAttribute('stroke', f > 0.5 ? C.green : C.yellow);
      } else {
        L.num.setAttribute('transform', '');
        L.cards[0].box.setAttribute('fill', C.pYellow);
        L.cards[0].box.setAttribute('stroke', C.yellow);
      }

      // Signes qui apparaissent au fil des semaines
      L.items.forEach(it => {
        const q = live ? prog(W, it.w, 0.5) : 1;
        const sc = q <= 0 ? 0.001 : q >= 1 ? 1 : 0.6 + 0.4 * back(q);
        const cx = x0 + 44;
        it.g.setAttribute('transform', sc === 1 ? '' : `translate(${cx} ${it.cy}) scale(${sc}) translate(${-cx} ${-it.cy})`);
        it.g.setAttribute('opacity', (live ? clamp(q / 0.4) : 1) * o0);
      });
    });

    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 15, build, draw });
})();
