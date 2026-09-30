// Blog · SMED · « Étape 4 : Réduire les opérations internes restantes »
// Mécanique : l'image de Shingo. À gauche, un boulon descend tour après tour ; la jauge de serrage reste à zéro
// jusqu'au dernier tour, les tours d'avant sont du temps perdu. À droite, une bride à came serre en un quart de tour.
// Dix tours : nombre illustratif. Rendu déterministe : window.FICHE.draw(t), boucle de 13 s, image complète à t = 0.
(() => {
  document.fonts.load('600 30px Poppins');
  const G = window.Gabarit;
  const { C, el, text, measure, fit, prog, easeInOut, easeOut, back, clamp, FADE_END, fading, fadeOut, pop, rise, pulse, window01 } = G;
  const NB = ' ';

  const PANELS = [{ x: 40, bolt: true }, { x: 610, bolt: false }];
  const PW = 550;
  const TURNS = 10, T0 = 2.6, TD = 0.6;           // un tour toutes les 0,6 s
  const CAM = [2.6, 3.15];
  const Y_START = 300, Y_END = 440, PITCH = (Y_END - Y_START) / TURNS;
  const RES_T = [T0 + TURNS * TD + 0.2, 3.5], CHUTE_T = 9.5;
  const BASE_FILL = '#dadaea';

  const S = { panels: [] };

  // Tours effectués (0 → 10) à l'instant t
  // Pendant l'effacement, le boulon se dévisse et le levier remonte (retour à l'état de départ sans saut)
  const back01 = t => 1 - easeInOut(prog(t, G.FADE_START, FADE_END - G.FADE_START));
  const turnsAt = t => (t < FADE_END ? TURNS * back01(t) : TURNS * prog(t, T0, TURNS * TD));
  const camAt = t => (t < FADE_END ? back01(t) : easeInOut(prog(t, CAM[0], CAM[1] - CAM[0])));

  function hexPath(r) {
    const p = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; p.push(`${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`); }
    return 'M ' + p.join(' L ') + ' Z';
  }

  function build() {
    G.templateBlog();
    G.blogTitle('Seul le dernier', 'tour serre.');
    G.blogChapeau('Un boulon ne serre qu’au dernier tour de filet : les tours d’avant sont du temps perdu.');

    PANELS.forEach(P => {
      const x0 = P.x, cx = x0 + 220;
      const L = { x0, cx, bolt: P.bolt };
      G.card(x0, 176, PW, 584);
      G.pill(G.svg, x0 + 28, 212, P.bolt ? 'Boulon classique' : 'Serrage fonctionnel : bride à came', { size: 20, h: 36, bg: P.bolt ? C.pRed : C.pGreen, fg: P.bolt ? C.tRed : C.tGreen });

      if (P.bolt) {
        // Tige filetée (derrière la bride et l'outil)
        L.shank = el('g');
        el('rect', { x: cx - 11, y: 0, width: 22, height: 140, fill: '#a7a7c6' }, L.shank);
        for (let y = 6; y < 140; y += 10) el('line', { x1: cx - 11, y1: y + 4, x2: cx + 11, y2: y - 2, stroke: C.white, 'stroke-width': 2, opacity: 0.7 }, L.shank);
      }
      // Outil et bride (fixes)
      el('rect', { x: cx - 150, y: 468, width: 300, height: 124, rx: 10, fill: BASE_FILL });
      text(G.svg, cx, 540, 'Outil', { size: 18, weight: 600, fill: C.ink, anchor: 'middle' }).setAttribute('opacity', 0.7);
      if (P.bolt) [cx - 12, cx + 12].forEach(x => el('line', { x1: x, y1: 470, x2: x, y2: 590, stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: 0.35 }));
      el('rect', { x: cx - 110, y: 440, width: 220, height: 28, rx: 6, fill: C.teal });
      text(G.svg, cx + (P.bolt ? 62 : -58), 460, 'Bride', { size: 16, weight: 700, fill: C.white, anchor: 'middle' });

      if (P.bolt) {
        L.head = el('g');
        el('rect', { x: cx - 30, y: -26, width: 60, height: 26, rx: 4, fill: C.ink }, L.head);
        el('rect', { x: cx - 36, y: -5, width: 72, height: 5, rx: 2, fill: '#6b6b8a' }, L.head);
        L.face = el('rect', { y: -24, width: 5, height: 18, rx: 2, fill: C.white, opacity: 0.6 }, L.head);
        // Vue de dessus : l'écrou tourne
        L.dial = el('g');
        el('circle', { cx: 0, cy: 0, r: 40, fill: C.pLav }, L.dial);
        L.hex = el('g', {}, L.dial);
        el('path', { d: hexPath(30), fill: C.ink }, L.hex);
        el('circle', { cx: 0, cy: 0, r: 11, fill: '#a7a7c6' }, L.hex);
        el('line', { x1: 0, y1: -12, x2: 0, y2: -27, stroke: C.yellow, 'stroke-width': 5, 'stroke-linecap': 'round' }, L.hex);
        L.dial.setAttribute('transform', `translate(${x0 + 460} 346)`);
        text(G.svg, x0 + 460, 408, 'vue de dessus', { size: 15, weight: 500, fill: C.ink, anchor: 'middle' });
        L.count = text(G.svg, x0 + 460, 280, '', { size: 24, weight: 800, fill: C.tRed, anchor: 'middle' });
      } else {
        // Bride à came : support, levier, came
        el('rect', { x: cx - 22, y: 392, width: 44, height: 48, rx: 6, fill: C.ink });
        L.lever = el('g');
        el('rect', { x: -9, y: -150, width: 18, height: 150, rx: 9, fill: C.blue }, L.lever);
        el('rect', { x: -12, y: -154, width: 24, height: 34, rx: 10, fill: C.red }, L.lever);
        el('circle', { cx: 0, cy: 0, r: 18, fill: C.blue }, L.lever);
        el('circle', { cx: 0, cy: 0, r: 6, fill: C.white }, L.lever);
        L.pivot = { x: cx, y: 404 };
        L.arc = G.arrow(G.svg, `M ${cx + 40} ${404 - 150} A 150 150 0 0 1 ${cx + 150} ${404 - 40}`, { stroke: C.tGreen, width: 3, head: 10, dash: '7 6' });
        text(G.svg, x0 + 446, 302, 'Un quart de tour', { size: 22, weight: 800, fill: C.tGreen, anchor: 'middle' });
      }

      // Jauge de serrage
      text(G.svg, x0 + 28, 638, 'Serrage', { size: 19, weight: 700, fill: C.ink });
      el('rect', { x: x0 + 130, y: 622, width: 390, height: 22, rx: 11, fill: C.line });
      L.gauge = el('rect', { x: x0 + 130, y: 622, height: 22, rx: 11, fill: C.green });
      // Bande des gestes : un segment par tour
      L.segs = Array.from({ length: TURNS }, (_, i) => el('rect', { x: x0 + 28 + 50 * i, y: 664, width: 46, height: 26, rx: 6, fill: 'none', stroke: C.line, 'stroke-width': 2 }));
      L.res = el('g');
      if (P.bolt) {
        const r = text(L.res, x0 + 28, 726, '9 tours pour rien, ', { size: 20, weight: 700, fill: C.tRed });
        text(L.res, measure(r).x + measure(r).width + 4, 726, '1 tour qui serre', { size: 20, weight: 700, fill: C.tGreen });
      } else {
        text(L.res, x0 + 28, 726, 'Un seul geste, et il serre', { size: 20, weight: 700, fill: C.tGreen });
      }
      S.panels.push(L);
    });

    S.chute = G.blogChute('Remplacer les boulons par des serrages fonctionnels.', { y: 806 });
  }

  function draw(t) {
    const live = t >= FADE_END;
    const o = fading(t) ? fadeOut(t) : 1;
    const n = turnsAt(t);

    S.panels.forEach((L, pi) => {
      let tight;
      if (L.bolt) {
        const yh = Y_START + PITCH * n;
        L.head.setAttribute('transform', `translate(0 ${yh})`);
        L.shank.setAttribute('transform', `translate(0 ${yh})`);
        // Reflet qui glisse sur la tête (rotation vue de côté)
        const ph = (n % 1) * 2 * Math.PI;
        L.face.setAttribute('x', L.cx - 2.5 + 24 * Math.sin(ph));
        L.face.setAttribute('opacity', 0.6 * Math.abs(Math.cos(ph / 2)) + 0.1);
        L.hex.setAttribute('transform', `rotate(${(n * 360) % 360})`);
        L.count.textContent = n >= TURNS ? `${TURNS}${NB}tours` : `Tour ${Math.min(TURNS, Math.floor(n) + 1)} sur ${TURNS}`;
        L.count.setAttribute('opacity', live ? (t >= T0 ? 1 : 0) : o);
        if (!live) L.count.textContent = `${TURNS}${NB}tours`;
        tight = clamp(n - (TURNS - 1));
        L.segs.forEach((s, i) => {
          const done = n >= i + 1 - 1e-9;
          s.setAttribute('fill', done ? (i === TURNS - 1 ? C.green : C.red) : 'none');
          s.setAttribute('stroke', done ? 'none' : C.line);
          s.setAttribute('opacity', done ? o : 1);
        });
      } else {
        const c = camAt(t);
        L.lever.setAttribute('transform', `translate(${L.pivot.x} ${L.pivot.y}) rotate(${90 * c})`);
        L.arc.draw(live ? c : 1);
        L.arc.g.setAttribute('opacity', o);
        tight = c;
        L.segs.forEach((s, i) => {
          const done = i === 0 && c >= 1;
          s.setAttribute('fill', done ? C.green : 'none');
          s.setAttribute('stroke', done ? 'none' : C.line);
          s.setAttribute('stroke-dasharray', i === 0 ? '' : '5 5');
          s.setAttribute('opacity', done ? o : 1);
        });
      }
      L.gauge.setAttribute('width', Math.max(0.001, 390 * tight));
      L.gauge.setAttribute('opacity', o);
      rise(L.res, t, RES_T[pi], 0.4, 10);
    });
    rise(S.chute, t, CHUTE_T, 0.45);
  }

  G.start({ duration: 13, build, draw });
})();
