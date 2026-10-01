// Carrousel LinkedIn (document PDF) · page Fichly · lundi 5 octobre 2026
// Post : « Les 8 gaspillages du Lean se récitent facilement. Les reconnaître dans un atelier, c'est une autre affaire. »
// « Le carrousel reprend chaque gaspillage avec un exemple et la question à poser pour le repérer. »
// Premier commentaire du post (Buffer) : guide complet des 8 gaspillages → encart (couverture et dernière page).
// Dix pages fixes, une par scénario (?scenario=p1 … p10) :
//   p1  la couverture, sommaire des huit avec l'exemple de terrain du post ;
//   p2–p9  un gaspillage par page : la scène de l'exemple du post (pièce maîtresse), puis la question à poser ;
//   p10 la page à garder : par où commencer, et les huit questions sur une grille d'observation.
// Rendu : node outils/rendu.js fy-8-gaspillages stills 0 --scenario pN, puis assemblage en PDF.
(() => {
  const D = window.DA;
  const { C, el, text, fit, measure } = D;
  const NB = ' ';
  const MUTED = '#7b7ba6', FRAME_BG = '#f5f5fa', CARD_LINE = '#dcdcec', STEEL = '#5b5b9a', LIGHT = '#dcdcf0';
  const PAGE = new URLSearchParams(location.search).get('scenario') || 'p1';
  const SWATCH = [C.red, C.teal, C.violet, C.green, C.yellow, C.lightBlue, C.blue, C.red];
  const f2 = v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(2);

  // ---------- Petits outils de dessin ----------
  // Texte à segments : [[texte, style]] ; n : encre, b : gras bleu, r : gras rouge, g : gras vert
  function rich(parent, x, y, segs, { size = 22, anchor = 'start' } = {}) {
    const t = el('text', { x, y, 'font-family': 'Poppins', 'font-size': size, 'text-anchor': anchor }, parent);
    const ST = { n: [500, C.ink], b: [700, C.blue], r: [700, C.tRed], g: [700, C.tGreen] };
    segs.forEach(([s, k = 'n']) => {
      const sp = el('tspan', { 'font-weight': ST[k][0], fill: ST[k][1] }, t);
      sp.textContent = s;
    });
    return t;
  }
  // Étiquette arrondie centrée en (cx, cy)
  function tag(parent, cx, cy, str, { fill = C.pRed, color = C.tRed, size = 18 } = {}) {
    const g = el('g', {}, parent);
    const r = el('rect', { y: f2(cy - size * 0.95), height: f2(size * 1.9), rx: f2(size * 0.95), fill }, g);
    const t = text(g, cx, cy + size * 0.36, str, { size, weight: 700, fill: color, anchor: 'middle' });
    const b = measure(t);
    r.setAttribute('x', f2(b.x - size * 0.8));
    r.setAttribute('width', f2(b.width + size * 1.6));
    return { g, t, r };
  }
  const tagFits = (tg, label, lo = 16, hi = 944) => fit(tg.r, hi, label, lo);
  function arrowHead(parent, x, y, angle, color, s = 13) {
    el('path', { d: `M ${-s} ${-s * 0.75} L 0 0 L ${-s} ${s * 0.75}`, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: `translate(${f2(x)} ${f2(y)}) rotate(${f2(angle)})` }, parent);
  }
  function floor(S, F, x0 = 24, x1 = 936) {
    el('line', { x1: x0, y1: F, x2: x1, y2: F, stroke: '#cfcfe3', 'stroke-width': 4, 'stroke-linecap': 'round' }, S);
  }
  // Machine vue de face, posée sur le sol F ; renvoie le haut du bâti
  function machine(S, x, F, w, h, { light = C.green, panel = true } = {}) {
    const g = el('g', {}, S);
    const top = F - h;
    el('rect', { x: x + 14, y: F - 14, width: 18, height: 14, rx: 3, fill: C.ink }, g);
    el('rect', { x: x + w - 32, y: F - 14, width: 18, height: 14, rx: 3, fill: C.ink }, g);
    el('rect', { x, y: top, width: w, height: h - 12, rx: 16, fill: C.blue }, g);
    if (panel) el('rect', { x: x + 16, y: top + 18, width: w - 32, height: (h - 12) * 0.5, rx: 10, fill: LIGHT }, g);
    if (light) {
      el('rect', { x: x + w - 34, y: top - 14, width: 8, height: 14, fill: C.ink }, g);
      el('circle', { cx: x + w - 30, cy: top - 20, r: 10, fill: light }, g);
    }
    return { g, top };
  }
  // Opérateur debout, pieds en (x, F). arms : 'down' | 'crossed' | liste de tracés (repère du buste)
  function operator(S, x, F, { color = C.teal, arms = 'down', vest = true } = {}) {
    const g = el('g', { transform: `translate(${x} ${F})` }, S);
    [-13, 1].forEach(dx => el('rect', { x: dx, y: -58, width: 12, height: 58, rx: 6, fill: C.ink }, g));
    el('rect', { x: -25, y: -124, width: 50, height: 72, rx: 18, fill: color }, g);
    if (vest) el('rect', { x: -25, y: -94, width: 50, height: 8, fill: C.yellow }, g);
    el('circle', { cx: 0, cy: -148, r: 20, fill: color }, g);
    const arm = d => {
      el('path', { d, fill: 'none', stroke: FRAME_BG, 'stroke-width': 19, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      el('path', { d, fill: 'none', stroke: color, 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    };
    if (arms === 'down') { arm('M -21 -110 L -30 -66'); arm('M 21 -110 L 30 -66'); }
    else if (arms === 'crossed') { arm('M -20 -108 L -10 -84 L 17 -90'); arm('M 20 -108 L 10 -84 L -17 -90'); }
    else arms.forEach(arm);
    return g;
  }
  function crate(S, x, yb, w = 54, h = 40, fill = C.yellow) {
    const g = el('g', {}, S);
    el('rect', { x, y: yb - h, width: w, height: h, rx: 5, fill }, g);
    el('rect', { x: x + w * 0.36, y: yb - h, width: w * 0.28, height: h, fill: '#000', opacity: 0.1 }, g);
    return g;
  }
  // Pile en pyramide : rows = nombre de caisses par rangée, de bas en haut ; centrée en cx
  function pile(S, cx, F, rows, w = 54, h = 40, gap = 4) {
    rows.forEach((n, r) => {
      const x0 = cx - (n * (w + gap) - gap) / 2;
      for (let i = 0; i < n; i++) crate(S, x0 + i * (w + gap), F - r * (h + gap), w, h);
    });
    return F - rows.length * (h + gap) + gap;
  }
  function pallet(S, x, yb, w = 110, color = MUTED) {
    el('rect', { x, y: yb - 16, width: w, height: 7, rx: 2, fill: color }, S);
    [0, 0.5, 1].forEach(k => el('rect', { x: x + k * (w - 16), y: yb - 9, width: 16, height: 9, rx: 2, fill: color }, S));
  }
  function ghost(S, x, y, w, h) {
    el('rect', { x, y, width: w, height: h, rx: 6, fill: 'none', stroke: MUTED, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, S);
  }
  function stopwatch(S, cx, cy, r, color, frac = 0.3) {
    const g = el('g', {}, S);
    el('rect', { x: cx - r * 0.22, y: cy - r * 1.4, width: r * 0.44, height: r * 0.32, rx: 2, fill: color }, g);
    el('circle', { cx, cy, r, fill: C.white, stroke: color, 'stroke-width': r * 0.2 }, g);
    const a = frac * 2 * Math.PI;
    el('line', { x1: cx, y1: cy, x2: f2(cx + Math.sin(a) * r * 0.6), y2: f2(cy - Math.cos(a) * r * 0.6), stroke: color, 'stroke-width': r * 0.17, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function divider(S, x, y0 = 30, y1 = 520) {
    el('line', { x1: x, y1: y0, x2: x, y2: y1, stroke: CARD_LINE, 'stroke-width': 3, 'stroke-dasharray': '9 9', 'stroke-linecap': 'round' }, S);
  }

  // ---------- Les huit scènes (repère du cadre : 960 × 550, origine en haut à gauche) ----------
  const SCENES = {
    // 1 · Surproduction : la machine réglée tourne, la pile grossit, le bon de commande est vide
    surproduction(S) {
      const F = 470;
      floor(S, F);
      const m = machine(S, 60, F, 240, 300, { panel: false });
      el('rect', { x: 84, y: m.top + 26, width: 192, height: 96, rx: 12, fill: C.white }, S);
      fit(text(S, 180, m.top + 60, 'Produites', { size: 18, weight: 500, fill: MUTED, anchor: 'middle' }), 270, 'compteur machine', 90);
      fit(text(S, 180, m.top + 106, `1${NB}200`, { size: 38, weight: 800, fill: C.ink, anchor: 'middle' }), 270, 'compteur valeur', 90);
      el('rect', { x: 84, y: m.top + 138, width: 192, height: 128, rx: 12, fill: LIGHT }, S);
      el('rect', { x: 170, y: m.top + 138, width: 20, height: 60, fill: STEEL }, S);
      el('path', { d: `M 172 ${m.top + 198} L 180 ${m.top + 212} L 188 ${m.top + 198} Z`, fill: STEEL }, S);
      el('rect', { x: 146, y: m.top + 230, width: 68, height: 24, rx: 4, fill: C.yellow }, S);
      // Le pense-bête collé sur la machine
      const pi = el('g', { transform: 'translate(0 -36) rotate(-5 150 166)' }, S);
      el('rect', { x: 74, y: 128, width: 152, height: 76, rx: 4, fill: C.pYellow, stroke: '#e8d98f', 'stroke-width': 2 }, pi);
      el('rect', { x: 128, y: 120, width: 44, height: 14, rx: 2, fill: '#ffffff', opacity: 0.75 }, pi);
      fit(text(pi, 150, 160, 'Tant qu’elle', { size: 19, weight: 700, fill: C.tYellow, anchor: 'middle' }), 222, 'pense-bête 1', 78);
      fit(text(pi, 150, 188, 'est réglée…', { size: 19, weight: 700, fill: C.tYellow, anchor: 'middle' }), 222, 'pense-bête 2', 78);
      // Le convoyeur de sortie
      el('rect', { x: 300, y: 372, width: 186, height: 14, rx: 7, fill: STEEL }, S);
      [318, 466].forEach(x => el('rect', { x, y: 386, width: 10, height: F - 386, fill: STEEL }, S));
      crate(S, 326, 372, 48, 36); crate(S, 404, 372, 48, 36);
      arrowHead(S, 478, 352, 0, MUTED, 10);
      el('line', { x1: 330, y1: 352, x2: 476, y2: 352, stroke: MUTED, 'stroke-width': 3, 'stroke-dasharray': '6 7', 'stroke-linecap': 'round' }, S);
      // La pile qui grossit
      const top = pile(S, 636, F, [6, 5, 4, 3, 2, 1], 46, 36, 4);
      const tg = tag(S, 636, top - 34, 'Aucune commande derrière');
      tagFits(tg, 'étiquette pile', 478, 790);
      // Le bon de commande vide
      el('rect', { x: 794, y: 190, width: 150, height: 254, rx: 12, fill: STEEL }, S);
      el('rect', { x: 804, y: 206, width: 130, height: 226, rx: 6, fill: C.white }, S);
      el('rect', { x: 845, y: 180, width: 48, height: 20, rx: 6, fill: C.ink }, S);
      fit(text(S, 869, 240, 'Commandes', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' }), 932, 'bon de commande', 806);
      [272, 300, 328].forEach(y => el('line', { x1: 822, y1: y, x2: 916, y2: y, stroke: C.line, 'stroke-width': 5, 'stroke-linecap': 'round' }, S));
      text(S, 869, 406, '0', { size: 64, weight: 800, fill: C.red, anchor: 'middle' });
    },

    // 2 · Attente : la personne attend la machine, la pièce attend le contrôle
    attente(S) {
      const F = 470;
      floor(S, F);
      divider(S, 480, 30, 500);
      tagFits(tag(S, 240, 52, 'La personne attend', { fill: C.pYellow, color: C.tYellow }), 'étiquette gauche', 20, 460);
      tagFits(tag(S, 720, 52, 'La pièce attend', { fill: C.pYellow, color: C.tYellow }), 'étiquette droite', 500, 940);
      // La machine en cycle, avec sa jauge
      const m = machine(S, 46, F, 236, 340, { panel: false });
      const cx = 164, cy = m.top + 118, r = 82;
      el('circle', { cx, cy, r, fill: C.white }, S);
      el('circle', { cx, cy, r: r - 9, fill: 'none', stroke: LIGHT, 'stroke-width': 12 }, S);
      const k = 0.72, a = k * 2 * Math.PI;
      el('path', { d: `M ${cx} ${cy - r + 9} A ${r - 9} ${r - 9} 0 1 1 ${f2(cx + Math.sin(a) * (r - 9))} ${f2(cy - Math.cos(a) * (r - 9))}`, fill: 'none', stroke: C.green, 'stroke-width': 12, 'stroke-linecap': 'round' }, S);
      fit(text(S, cx, cy - 8, 'Cycle', { size: 18, weight: 500, fill: MUTED, anchor: 'middle' }), cx + 60, 'jauge 1', cx - 60);
      fit(text(S, cx, cy + 24, `3${NB}min${NB}40`, { size: 24, weight: 800, fill: C.ink, anchor: 'middle' }), cx + 62, 'jauge 2', cx - 62);
      el('rect', { x: 70, y: m.top + 228, width: 188, height: 76, rx: 10, fill: LIGHT }, S);
      [100, 136].forEach(x => el('circle', { cx: x, cy: m.top + 266, r: 11, fill: STEEL }, S));
      el('rect', { x: 168, y: m.top + 257, width: 66, height: 18, rx: 9, fill: C.white }, S);
      // L'opérateur, bras croisés, qui attend
      operator(S, 380, F, { color: C.teal, arms: 'crossed' });
      stopwatch(S, 380, 262, 22, C.yellow, 0.72);
      // La file de pièces devant le contrôle
      el('rect', { x: 516, y: 388, width: 248, height: 10, rx: 5, fill: STEEL }, S);
      [530, 750].forEach(x => el('rect', { x, y: 398, width: 9, height: F - 398, fill: STEEL }, S));
      [524, 584, 644, 704].forEach(x => crate(S, x, 388, 52, 40));
      tagFits(tag(S, 640, 300, `attend depuis 2${NB}h${NB}15`), 'étiquette file', 500, 790);
      el('line', { x1: 640, y1: 318, x2: 640, y2: 340, stroke: C.red, 'stroke-width': 3, 'stroke-linecap': 'round' }, S);
      // Le poste de contrôle, vide
      el('rect', { x: 784, y: 378, width: 150, height: 14, rx: 4, fill: STEEL }, S);
      [796, 916].forEach(x => el('rect', { x, y: 392, width: 10, height: F - 392, fill: STEEL }, S));
      el('rect', { x: 851, y: 252, width: 8, height: 126, fill: MUTED }, S);
      el('rect', { x: 798, y: 226, width: 114, height: 48, rx: 10, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S);
      fit(text(S, 855, 257, 'Contrôle', { size: 18, weight: 700, fill: C.ink, anchor: 'middle' }), 908, 'panneau contrôle', 802);
      el('circle', { cx: 830, cy: 356, r: 13, fill: 'none', stroke: MUTED, 'stroke-width': 4 }, S);
      el('line', { x1: 840, y1: 366, x2: 852, y2: 376, stroke: MUTED, 'stroke-width': 5, 'stroke-linecap': 'round' }, S);
    },

    // 3 · Transport : quatre sauts de palette pour un seul trajet utile
    transport(S) {
      const F = 400;
      floor(S, F);
      const X = [96, 288, 480, 672, 886];
      const LAND = [96, 288, 480, 672, 790];
      const NAMES = ['Quai', 'Zone tampon', 'Magasin', 'Zone tampon', 'Poste'];
      NAMES.forEach((n, i) => fit(text(S, X[i], F + 36, n, { size: 18, weight: 700, fill: C.ink, anchor: 'middle' }), X[i] + 92, `poste ${n}`, X[i] - 92));
      // Quai
      el('rect', { x: 40, y: F - 210, width: 112, height: 210, rx: 6, fill: LIGHT, stroke: STEEL, 'stroke-width': 3 }, S);
      for (let y = F - 186; y < F - 4; y += 26) el('line', { x1: 46, y1: y, x2: 146, y2: y, stroke: '#c4c4e0', 'stroke-width': 3 }, S);
      // Zones tampon : marquage au sol
      [288, 672].forEach(cx => {
        el('rect', { x: cx - 74, y: F - 6, width: 148, height: 6, fill: C.yellow }, S);
        ghost(S, cx - 52, F - 64, 104, 52);
      });
      // Magasin : rayonnage
      [410, 542].forEach(x => el('rect', { x, y: F - 230, width: 8, height: 230, fill: STEEL }, S));
      [F - 156, F - 82].forEach(y => el('rect', { x: 410, y, width: 140, height: 7, fill: STEEL }, S));
      crate(S, 424, F - 156, 50, 38, C.lightBlue); crate(S, 480, F - 156, 50, 38, C.teal);
      ghost(S, 428, F - 66, 104, 52);
      // Poste : la palette arrive enfin
      machine(S, 836, F, 100, 180);
      pallet(S, 752, F, 76, C.ink);
      crate(S, 755, F - 16, 34, 30); crate(S, 791, F - 16, 34, 30);
      // Les quatre sauts
      for (let i = 0; i < 4; i++) {
        const x0 = LAND[i] + 18, x1 = LAND[i + 1] - 18, y0 = F - 86, peak = 112;
        const xm = (x0 + x1) / 2, yc = 2 * peak - y0;
        el('path', { d: `M ${x0} ${y0} Q ${xm} ${yc} ${x1} ${y0}`, fill: 'none', stroke: C.red, 'stroke-width': 4, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, S);
        arrowHead(S, x1, y0, Math.atan2(y0 - yc, x1 - xm) * 180 / Math.PI, C.red, 11);
        el('circle', { cx: xm, cy: peak, r: 19, fill: C.red, stroke: FRAME_BG, 'stroke-width': 4 }, S);
        text(S, xm, peak + 7, String(i + 1), { size: 19, weight: 800, fill: C.white, anchor: 'middle' });
      }
      tagFits(tag(S, 480, 46, `4${NB}déplacements avant d’être utilisée`), 'étiquette sauts', 30, 930);
      // Ce qu'il fallait
      el('line', { x1: 96, y1: F + 92, x2: 866, y2: F + 92, stroke: C.green, 'stroke-width': 4, 'stroke-linecap': 'round' }, S);
      arrowHead(S, 876, F + 92, 0, C.green, 12);
      el('circle', { cx: 96, cy: F + 92, r: 6, fill: C.green }, S);
      tagFits(tag(S, 480, F + 92, 'Un seul trajet suffisait', { fill: C.pGreen, color: C.tGreen }), 'étiquette trajet', 100, 860);
    },

    // 4 · Traitements inutiles : la tolérance trop serrée, le rapport jamais lu
    traitements(S) {
      divider(S, 480, 30, 520);
      tagFits(tag(S, 240, 52, 'Plus précis que demandé', { fill: C.pYellow, color: C.tYellow }), 'étiquette gauche', 20, 460);
      tagFits(tag(S, 720, 52, 'Rempli, jamais lu', { fill: C.pYellow, color: C.tYellow }), 'étiquette droite', 500, 940);
      // La pièce et sa cote
      el('rect', { x: 86, y: 128, width: 112, height: 76, rx: 8, fill: LIGHT, stroke: STEEL, 'stroke-width': 3 }, S);
      el('rect', { x: 196, y: 146, width: 210, height: 40, rx: 6, fill: LIGHT, stroke: STEEL, 'stroke-width': 3 }, S);
      el('line', { x1: 86, y1: 166, x2: 420, y2: 166, stroke: MUTED, 'stroke-width': 1.8, 'stroke-dasharray': '14 5 3 5' }, S);
      el('line', { x1: 196, y1: 232, x2: 406, y2: 232, stroke: MUTED, 'stroke-width': 2.5 }, S);
      [196, 406].forEach(x => el('line', { x1: x, y1: 222, x2: x, y2: 242, stroke: MUTED, 'stroke-width': 2.5 }, S));
      fit(text(S, 301, 262, 'Cote : Ø 20 mm', { size: 17, weight: 700, fill: MUTED, anchor: 'middle' }), 460, 'cote', 150);
      // Les deux tolérances, à la même échelle
      const AX = 280;
      el('line', { x1: AX, y1: 296, x2: AX, y2: 432, stroke: MUTED, 'stroke-width': 2, 'stroke-dasharray': '5 6' }, S);
      fit(text(S, 30, 342, 'Client', { size: 18, weight: 700, fill: C.ink }), 118, 'libellé client', 20);
      el('rect', { x: AX - 150, y: 318, width: 300, height: 34, rx: 9, fill: C.pGreen, stroke: C.green, 'stroke-width': 2.5 }, S);
      fit(text(S, AX, 342, `±${NB}0,1${NB}mm`, { size: 18, weight: 700, fill: C.tGreen, anchor: 'middle' }), AX + 140, 'tolérance client', AX - 140);
      fit(text(S, 30, 412, 'Atelier', { size: 18, weight: 700, fill: C.ink }), 118, 'libellé atelier', 20);
      el('rect', { x: AX - 15, y: 388, width: 30, height: 34, rx: 7, fill: C.blue }, S);
      fit(text(S, AX + 30, 412, `±${NB}0,01${NB}mm`, { size: 18, weight: 700, fill: C.blue }), 460, 'tolérance atelier', AX + 20);
      tagFits(tag(S, 240, 480, '10 fois plus serré que demandé'), 'étiquette tolérance', 20, 462);
      // Le rapport du jour, la plume, et les classeurs que personne n'ouvre
      el('rect', { x: 580, y: 112, width: 196, height: 262, rx: 8, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 }, S);
      el('rect', { x: 562, y: 128, width: 196, height: 262, rx: 8, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2.5 }, S);
      fit(text(S, 580, 164, 'Rapport du jour', { size: 17, weight: 700, fill: C.ink }), 750, 'rapport', 570);
      for (let i = 0; i < 6; i++) {
        const y = 196 + i * 30;
        el('rect', { x: 580, y: y - 12, width: 15, height: 15, rx: 3, fill: 'none', stroke: STEEL, 'stroke-width': 2 }, S);
        el('path', { d: `M ${583} ${y - 5} L ${587} ${y - 1} L ${593} ${y - 9}`, fill: 'none', stroke: C.green, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S);
        el('line', { x1: 606, y1: y - 4, x2: 606 + (i % 2 ? 104 : 126), y2: y - 4, stroke: C.line, 'stroke-width': 6, 'stroke-linecap': 'round' }, S);
      }
      const pen = el('g', { transform: 'translate(744 352) rotate(-38)' }, S);
      el('rect', { x: -6, y: -88, width: 14, height: 84, rx: 5, fill: C.blue }, pen);
      el('path', { d: 'M -6 -4 L 8 -4 L 1 12 Z', fill: C.ink }, pen);
      el('rect', { x: 796, y: 398, width: 140, height: 9, rx: 2, fill: STEEL }, S);
      [C.lightBlue, C.teal, C.violet, C.green, C.yellow].forEach((c, i) => {
        el('rect', { x: 802 + i * 26, y: 262, width: 23, height: 136, rx: 3, fill: c }, S);
        el('rect', { x: 806 + i * 26, y: 286, width: 15, height: 26, rx: 2, fill: C.white, opacity: 0.85 }, S);
      });
      tagFits(tag(S, 720, 480, `Lu par${NB}: personne`), 'étiquette rapport', 500, 944);
    },

    // 5 · Stocks : une pile « au cas où » entre chaque poste
    stocks(S) {
      const F = 440;
      floor(S, F);
      const MX = [30, 290, 550, 810], MW = 120;
      MX.forEach((x, i) => {
        machine(S, x, F, MW, 230);
        fit(text(S, x + MW / 2, F + 36, `Poste ${i + 1}`, { size: 18, weight: 700, fill: C.ink, anchor: 'middle' }), x + MW + 4, `poste ${i + 1}`, x - 4);
      });
      const PILES = [[220, [2, 2, 2, 2, 1], 180], [480, [2, 2, 2, 2, 2, 2], 240], [740, [2, 2, 2], 120]];
      PILES.forEach(([cx, rows, n]) => {
        const top = pile(S, cx, F, rows, 54, 40, 4);
        tagFits(tag(S, cx, top - 34, `«${NB}au cas où${NB}»`, { fill: C.pYellow, color: C.tYellow }), 'étiquette pile', cx - 130, cx + 130);
        fit(text(S, cx, F + 36, `${n}${NB}pièces`, { size: 17, weight: 500, fill: MUTED, anchor: 'middle' }), cx + 66, 'compte pile', cx - 66);
      });
      el('line', { x1: 60, y1: F + 76, x2: 890, y2: F + 76, stroke: C.lightBlue, 'stroke-width': 4, 'stroke-linecap': 'round' }, S);
      arrowHead(S, 900, F + 76, 0, C.lightBlue, 12);
      tagFits(tag(S, 480, F + 76, `540${NB}pièces arrêtées dans le flux`, { fill: C.pRed, color: C.tRed }), 'étiquette total', 70, 880);
    },

    // 6 · Mouvements inutiles : le demi-tour vers le tableau d'outils, à chaque cycle
    mouvements(S) {
      const F = 470;
      floor(S, F);
      // Le tableau d'outils, derrière l'opérateur
      el('rect', { x: 52, y: 150, width: 230, height: 190, rx: 12, fill: C.white, stroke: CARD_LINE, 'stroke-width': 3 }, S);
      fit(text(S, 167, 372, 'Tableau d’outils', { size: 17, weight: 700, fill: MUTED, anchor: 'middle' }), 290, 'tableau', 44);
      // marteau
      el('rect', { x: 92, y: 196, width: 12, height: 116, rx: 5, fill: MUTED }, S);
      el('rect', { x: 74, y: 182, width: 48, height: 24, rx: 5, fill: MUTED }, S);
      // tournevis
      el('rect', { x: 140, y: 182, width: 22, height: 56, rx: 9, fill: MUTED }, S);
      el('rect', { x: 147, y: 236, width: 8, height: 76, rx: 3, fill: MUTED }, S);
      // la clé utile, en rouge
      const key = el('g', { transform: 'translate(226 248)' }, S);
      el('rect', { x: -7, y: -40, width: 14, height: 100, rx: 6, fill: C.red }, key);
      el('circle', { cx: 0, cy: -50, r: 19, fill: C.red }, key);
      el('rect', { x: -7, y: -72, width: 14, height: 26, fill: C.white }, key);
      // L'établi et la pièce
      el('rect', { x: 476, y: 354, width: 330, height: 16, rx: 4, fill: STEEL }, S);
      [492, 780].forEach(x => el('rect', { x, y: 370, width: 12, height: F - 370, fill: STEEL }, S));
      el('rect', { x: 540, y: 314, width: 96, height: 40, rx: 6, fill: LIGHT, stroke: STEEL, 'stroke-width': 3 }, S);
      el('rect', { x: 560, y: 300, width: 56, height: 18, rx: 4, fill: C.yellow }, S);
      // la place qu'aurait la clé, à portée de main
      const gk = el('g', { transform: 'translate(726 330) rotate(90)' }, S);
      el('rect', { x: -7, y: -36, width: 14, height: 76, rx: 6, fill: 'none', stroke: C.green, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, gk);
      el('circle', { cx: 0, cy: -48, r: 16, fill: 'none', stroke: C.green, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, gk);
      tagFits(tag(S, 712, 270, 'Sa place : à portée de main', { fill: C.pGreen, color: C.tGreen, size: 17 }), 'étiquette place', 500, 944);
      // L'opérateur face à l'établi
      operator(S, 406, F, { color: C.violet, arms: ['M 21 -108 L 66 -98 L 112 -104', 'M -21 -110 L -30 -66'] });
      // Le demi-tour
      const cx = 400, cy = 300, r = 88;
      el('path', { d: `M ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx - r} ${cy}`, fill: 'none', stroke: C.red, 'stroke-width': 4.5, 'stroke-dasharray': '11 8', 'stroke-linecap': 'round' }, S);
      arrowHead(S, cx - r, cy + 2, 90, C.red, 12);
      arrowHead(S, cx + r, cy + 2, 90, C.red, 12);
      tagFits(tag(S, cx, cy - r - 30, 'Un demi-tour à chaque cycle'), 'étiquette demi-tour', 20, 700);
      tagFits(tag(S, 480, 50, `400${NB}cycles par jour, 400${NB}demi-tours`, { fill: C.pLav, color: C.blue }), 'étiquette cycles', 20, 940);
    },

    // 7 · Défauts : la retouche inscrite dans la gamme
    defauts(S) {
      const F = 470;
      floor(S, F);
      // La gamme de fabrication
      el('rect', { x: 30, y: 22, width: 452, height: 238, rx: 16, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2.5 }, S);
      fit(text(S, 54, 62, 'Gamme de fabrication', { size: 19, weight: 700, fill: C.ink }), 430, 'gamme titre', 40);
      const STEPS = ['10 · Usinage', '20 · Assemblage', '30 · Contrôle', '40 · Retouche'];
      STEPS.forEach((s, i) => {
        const y = 104 + i * 42;
        if (i === 3) el('rect', { x: 42, y: y - 28, width: 428, height: 40, rx: 10, fill: C.pRed }, S);
        el('circle', { cx: 64, cy: y - 8, r: 7, fill: i === 3 ? C.red : C.green }, S);
        fit(text(S, 84, y, s.replace(/ /g, NB), { size: 20, weight: i === 3 ? 700 : 500, fill: i === 3 ? C.tRed : C.ink }), 300, `étape ${i}`, 60);
      });
      tagFits(tag(S, 348, 218, 'devenue normale', { fill: C.red, color: C.white, size: 16 }), 'étiquette gamme', 230, 466);
      // La ligne : trois postes, puis le convoyeur
      [30, 170, 310].forEach(x => machine(S, x, F, 112, 160));
      el('rect', { x: 422, y: 386, width: 210, height: 12, rx: 6, fill: STEEL }, S);
      [440, 610].forEach(x => el('rect', { x, y: 398, width: 9, height: F - 398, fill: STEEL }, S));
      [432, 482, 532, 582].forEach((x, i) => {
        el('rect', { x, y: 350, width: 40, height: 36, rx: 6, fill: LIGHT, stroke: STEEL, 'stroke-width': 2.5 }, S);
        if (i % 2 === 0) el('circle', { cx: x + 28, cy: 362, r: 6.5, fill: C.red }, S);
      });
      // La retouche en bout de ligne
      el('rect', { x: 650, y: 374, width: 200, height: 16, rx: 4, fill: STEEL }, S);
      [664, 826].forEach(x => el('rect', { x, y: 390, width: 10, height: F - 390, fill: STEEL }, S));
      el('rect', { x: 676, y: 338, width: 40, height: 36, rx: 6, fill: LIGHT, stroke: STEEL, 'stroke-width': 2.5 }, S);
      el('circle', { cx: 704, cy: 350, r: 6.5, fill: C.red }, S);
      el('rect', { x: 760, y: 338, width: 40, height: 36, rx: 6, fill: LIGHT, stroke: STEEL, 'stroke-width': 2.5 }, S);
      el('path', { d: 'M 770 356 L 777 363 L 790 349', fill: 'none', stroke: C.green, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S);
      el('rect', { x: 678, y: 256, width: 150, height: 48, rx: 12, fill: C.red }, S);
      fit(text(S, 753, 288, 'Retouche', { size: 21, weight: 800, fill: C.white, anchor: 'middle' }), 822, 'panneau retouche', 684);
      operator(S, 892, F, { color: C.teal, arms: ['M -21 -108 L -62 -100 L -96 -106', 'M 21 -110 L 30 -66'] });
      // Le lien entre la gamme et la retouche
      el('path', { d: 'M 484 210 C 590 210, 712 200, 744 250', fill: 'none', stroke: C.red, 'stroke-width': 3.5, 'stroke-dasharray': '9 7', 'stroke-linecap': 'round' }, S);
      arrowHead(S, 744, 254, 58, C.red, 10);
    },

    // 8 · Compétences inexploitées : l'équipe sait, la réunion cherche sans elle
    competences(S) {
      const F = 470;
      floor(S, F);
      // La paroi vitrée
      el('rect', { x: 508, y: 90, width: 18, height: F - 90, rx: 4, fill: '#e6e6f5', stroke: CARD_LINE, 'stroke-width': 2 }, S);
      fit(text(S, 254, F + 38, 'L’équipe', { size: 18, weight: 700, fill: MUTED, anchor: 'middle' }), 480, 'côté équipe', 30);
      fit(text(S, 742, F + 38, 'La réunion', { size: 18, weight: 700, fill: MUTED, anchor: 'middle' }), 940, 'côté réunion', 540);
      // L'équipe, à son poste
      machine(S, 26, F, 110, 190);
      [[196, C.teal], [296, C.violet], [396, C.green]].forEach(([x, c]) => operator(S, x, F, { color: c }));
      // La bulle : ils savent
      el('rect', { x: 150, y: 96, width: 330, height: 108, rx: 30, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2.5 }, S);
      el('circle', { cx: 290, cy: 228, r: 11, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2.5 }, S);
      el('circle', { cx: 298, cy: 258, r: 7, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2.5 }, S);
      const bx = 206, by = 150;
      el('circle', { cx: bx, cy: by - 8, r: 24, fill: C.yellow }, S);
      el('rect', { x: bx - 11, y: by + 14, width: 22, height: 14, rx: 4, fill: STEEL }, S);
      el('path', { d: `M ${bx - 7} ${by - 4} L ${bx} ${by + 4} L ${bx + 7} ${by - 4}`, fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S);
      fit(text(S, 244, 142, 'On sait comment', { size: 21, weight: 700, fill: C.ink }), 470, 'bulle 1', 240);
      fit(text(S, 244, 172, 'régler ça.', { size: 21, weight: 700, fill: C.ink }), 470, 'bulle 2', 240);
      // La réunion, de l'autre côté
      el('rect', { x: 612, y: 104, width: 262, height: 150, rx: 12, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2.5 }, S);
      fit(text(S, 743, 140, 'Réunion amélioration', { size: 17, weight: 700, fill: C.ink, anchor: 'middle' }), 868, 'tableau réunion', 618);
      el('line', { x1: 640, y1: 162, x2: 846, y2: 162, stroke: C.line, 'stroke-width': 3 }, S);
      text(S, 743, 236, '?', { size: 64, weight: 800, fill: C.red, anchor: 'middle' });
      operator(S, 668, F, { color: C.blue, vest: false });
      operator(S, 818, F, { color: C.lightBlue, vest: false, arms: 'crossed' });
      el('rect', { x: 584, y: 386, width: 320, height: 16, rx: 4, fill: STEEL }, S);
      [604, 870].forEach(x => el('rect', { x, y: 402, width: 10, height: F - 402, fill: STEEL }, S));
    },
  };

  // ---------- Les huit gaspillages : textes ----------
  const EX = s => [['Sur le terrain', 'b'], [`${NB}: ${s}`]];
  const W8 = [
    { name: 'Surproduction', l2: 'sans commande', scene: 'surproduction',
      def: 'Produire plus, ou plus tôt, que ce que le client demande.',
      ex: [EX(`une série lancée «${NB}tant que la machine est réglée${NB}»,`), [['sans commande derrière. '], ['Le compteur monte, la pile aussi.', 'r']]],
      q: ['Pour quelle commande produit-on', `cette pièce, en ce moment${NB}?`],
      hint: [`Une série lancée «${NB}tant que`, `la machine est réglée${NB}»`] },
    { name: 'Attente', l2: 'le temps mort', scene: 'attente',
      def: 'Des personnes ou des pièces qui attendent au lieu d’avancer.',
      ex: [EX('un opérateur qui patiente devant une machine en cycle.'), [['Une pièce qui attend son contrôle.']]],
      q: ['Qui, ou quoi, attend ici en ce moment,', `et depuis combien de temps${NB}?`],
      hint: ['Un opérateur qui patiente', 'devant une machine en cycle'] },
    { name: 'Transport', l2: 'en trop', scene: 'transport',
      def: 'Déplacer des pièces sans rien leur ajouter.',
      ex: [EX('une palette déplacée plusieurs fois avant d’arriver'), [['au poste qui en a besoin.']]],
      q: ['Combien de fois cette palette a-t-elle', `bougé avant d’être utilisée${NB}?`],
      hint: ['Une palette déplacée', 'plusieurs fois avant le poste'] },
    { name: 'Traitements', l2: 'inutiles', scene: 'traitements',
      def: 'En faire plus que ce que le client demande, ou utilise.',
      ex: [EX('une tolérance plus serrée que ce que le client demande.'), [['Un rapport rempli que personne ne lit.']]],
      q: ['Le client paierait-il pour cette étape', `s’il la voyait${NB}?`],
      hint: ['Un rapport rempli que', 'personne ne lit'] },
    { name: 'Stocks', l2: `«${NB}au cas où${NB}»`, scene: 'stocks',
      def: 'Plus de pièces en attente que le flux n’en a besoin.',
      ex: [EX(`des encours entre chaque poste, «${NB}au cas où${NB}».`), [['Chaque pile cache un problème qu’on ne voit plus.']]],
      q: ['Combien de pièces attendent entre deux', `postes, et pour quelle raison${NB}?`],
      hint: ['Des encours entre chaque', `poste, «${NB}au cas où${NB}»`] },
    { name: 'Mouvements', l2: 'inutiles', scene: 'mouvements',
      def: 'Les gestes et les pas qui n’ajoutent rien à la pièce.',
      ex: [EX('un opérateur qui se retourne à chaque cycle'), [['pour attraper un outil mal placé.']]],
      q: ['Quels gestes, à chaque cycle,', `n’ajoutent rien à la pièce${NB}?`],
      hint: ['Un demi-tour à chaque cycle', 'pour attraper un outil'] },
    { name: 'Défauts', l2: 'devenus normaux', scene: 'defauts',
      def: 'Produire mauvais, puis trier, retoucher ou jeter.',
      ex: [EX('une retouche en bout de ligne devenue'), [['une étape normale du process.']]],
      q: ['Quelle étape disparaîtrait si la pièce', `était bonne du premier coup${NB}?`],
      hint: ['Une retouche devenue', 'une étape normale'] },
    { name: 'Compétences', l2: 'inexploitées', scene: 'competences',
      def: 'Ne pas utiliser ce que savent ceux qui font le travail.',
      ex: [EX('une équipe qui connaît la solution,'), [['mais à qui personne ne la demande.']]],
      q: ['Quand a-t-on demandé à l’équipe', `ce qu’elle changerait${NB}?`],
      hint: ['Une équipe qui connaît', 'la solution, jamais consultée'] },
  ];
  const fullName = w => (w.l2 === 'inutiles' || w.l2 === 'inexploitées' ? `${w.name} ${w.l2}` : w.name);

  // ---------- Mise en page commune ----------
  const FR = { x: 60, y: 410, w: 960 };
  function explain(lines) {
    lines.forEach((segs, i) => fit(rich(D.svg, 62, 352 + i * 32, segs), 1020, `explication ${i + 1}`));
  }
  function frame(h) {
    el('rect', { x: FR.x, y: FR.y, width: FR.w, height: h, rx: 26, fill: FRAME_BG, stroke: CARD_LINE, 'stroke-width': 2 });
    return el('g', { transform: `translate(${FR.x} ${FR.y})` });
  }
  function numSquare(parent, x, y, s, n, color) {
    el('rect', { x, y, width: s, height: s, rx: s * 0.26, fill: color }, parent);
    text(parent, x + s / 2, y + s * 0.5 + s * 0.19, String(n), { size: s * 0.52, weight: 800, fill: C.white, anchor: 'middle' });
  }
  // Flèche « page suivante » dessinée (Poppins n'a pas la flèche →)
  function nextArrow(x, y, color = C.blue) {
    el('line', { x1: x, y1: y, x2: x + 30, y2: y, stroke: color, 'stroke-width': 3.5, 'stroke-linecap': 'round' });
    arrowHead(D.svg, x + 32, y, 0, color, 9);
  }

  // ---------- Pages ----------
  function cover() {
    D.title('Les 8 gaspillages', 'sur le terrain', 1020);
    D.chapeau('Les reconnaître dans un atelier, c’est une autre affaire.');
    explain([
      [['Pour chacun', 'b'], [' : un exemple vu dans un atelier, puis la question à poser']],
      [['pour le repérer. '], ['Faites défiler', 'b']],
    ]);
    const last = D.svg.lastChild;
    nextArrow(measure(last).x + measure(last).width + 12, 376);
    const S = frame(730);
    const CW = 446, CH = 158, GX = 22, GY = 16, X0 = 23, Y0 = 26;
    W8.forEach((w, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = X0 + col * (CW + GX), y = Y0 + row * (CH + GY);
      el('rect', { x, y, width: CW, height: CH, rx: 20, fill: C.card, stroke: CARD_LINE, 'stroke-width': 2 }, S);
      numSquare(S, x + 20, y + 22, 58, i + 1, SWATCH[i]);
      const tx = x + 96;
      fit(text(S, tx, y + 50, fullName(w), { size: 22, weight: 800, fill: C.ink }), x + CW - 12, `sommaire ${i + 1}`, tx);
      w.hint.forEach((h, k) => fit(text(S, tx, y + 88 + k * 27, h, { size: 18, weight: 500, fill: MUTED }), x + CW - 12, `indice ${i + 1}.${k}`, tx));
    });
    D.encart(['Les 8 gaspillages', 'Notre guide complet', '(lien en commentaire)']);
  }

  function wastePage(i) {
    const w = W8[i];
    D.title(`${i + 1}${NB}·${NB}${w.name}`, w.l2, 1020);
    D.chapeau(w.def);
    explain(w.ex);
    const S = frame(550);
    SCENES[w.scene](S);
    // La question à poser
    const QY = 984;
    el('rect', { x: 60, y: QY, width: 960, height: 152, rx: 24, fill: C.white, stroke: CARD_LINE, 'stroke-width': 2 });
    el('rect', { x: 60, y: QY, width: 14, height: 152, rx: 7, fill: C.blue });
    el('circle', { cx: 140, cy: QY + 76, r: 38, fill: C.blue });
    text(D.svg, 140, QY + 94, '?', { size: 50, weight: 800, fill: C.white, anchor: 'middle' });
    fit(text(D.svg, 204, QY + 40, 'LA QUESTION À POSER', { size: 17, weight: 700, fill: C.blue }), 1000, 'question libellé', 200);
    D.svg.lastChild.setAttribute('letter-spacing', 1.5);
    w.q.forEach((s, k) => fit(text(D.svg, 204, QY + 82 + k * 40, s, { size: 30, weight: 700, fill: C.ink }), 1000, `question ${k + 1}`, 200));
    // Où l'on en est
    fit(text(D.svg, 62, 1206, `Gaspillage ${i + 1} sur 8`, { size: 20, weight: 700, fill: C.blue }), 860, 'progression');
    for (let k = 0; k < 8; k++) el('rect', { x: 62 + k * 54, y: 1222, width: 46, height: 10, rx: 5, fill: k === i ? C.blue : k < i ? C.lightBlue : C.line });
    const nx = i < 7 ? `Suivant${NB}: ${i + 2}${NB}·${NB}${fullName(W8[i + 1])}` : `Suivant${NB}: par où commencer`;
    const nt = fit(text(D.svg, 62, 1276, nx, { size: 20, weight: 500, fill: MUTED }), 820, 'suivant');
    const nb = measure(D.svg.lastChild);
    nextArrow(nb.x + nb.width + 14, 1269, MUTED);
  }

  function closing() {
    D.title('Par où', `commencer${NB}?`, 1020);
    D.chapeau(`N’en cherchez pas huit${NB}: choisissez-en un.`);
    explain([
      [['Un gaspillage, un poste, une heure', 'b'], [`${NB}: observez, et cochez chaque fois`]],
      [['que vous le voyez. Les huit questions à poser sont ci-dessous.']],
    ]);
    const S = frame(728);
    // la consigne en tête de grille
    const chips = [['1 gaspillage', C.pLav, C.blue], ['1 poste', C.pLav, C.blue], [`1${NB}heure`, C.pLav, C.blue]];
    let cx = 26;
    chips.forEach(([s, f, c]) => {
      const tg = tag(S, 0, 40, s, { fill: f, color: c, size: 18 });
      const bw = measure(tg.r).width;
      tg.g.setAttribute('transform', `translate(${f2(cx + bw / 2)} 0)`);
      cx += bw + 12;
    });
    fit(text(S, 934, 46, 'Vu', { size: 17, weight: 700, fill: MUTED, anchor: 'end' }), 940, 'colonne vu', 860);
    const RY = 72, RH = 80;
    W8.forEach((w, i) => {
      const y = RY + i * RH;
      el('rect', { x: 16, y, width: 928, height: RH - 8, rx: 16, fill: C.card, stroke: CARD_LINE, 'stroke-width': 2 }, S);
      numSquare(S, 30, y + 15, 42, i + 1, SWATCH[i]);
      const two = w.l2 === 'inutiles' || w.l2 === 'inexploitées';
      if (two) {
        fit(text(S, 88, y + 32, w.name, { size: 19, weight: 800, fill: C.ink }), 320, `grille nom ${i + 1}`, 86);
        fit(text(S, 88, y + 56, w.l2, { size: 19, weight: 800, fill: C.ink }), 320, `grille nom ${i + 1}b`, 86);
      } else fit(text(S, 88, y + 44, w.name, { size: 19, weight: 800, fill: C.ink }), 320, `grille nom ${i + 1}`, 86);
      w.q.forEach((s, k) => fit(text(S, 340, y + 32 + k * 24, s, { size: 18, weight: 500, fill: C.ink }), 880, `grille question ${i + 1}.${k}`, 336));
      // les cases à cocher
      el('rect', { x: 902, y: y + 22, width: 28, height: 28, rx: 6, fill: C.white, stroke: STEEL, 'stroke-width': 2.5 }, S);
    });
    D.encart(['Les 8 gaspillages', 'Notre guide complet', '(lien en commentaire)']);
  }

  const PAGES = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];
  D.start({
    duration: 1,
    build() {
      D.template({ author: null });
      const n = PAGES.indexOf(PAGE);
      if (n < 0) console.error(`Page inconnue : ${PAGE}`);
      if (n === 0) cover();
      else if (n === 9) closing();
      else wastePage(n - 1);
    },
    scenarios: Object.fromEntries(PAGES.map(p => [p, () => {}])),
  });
})();
