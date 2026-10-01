// Couvertures des articles du blog (1200 × 860, image de l'article Shopify).
// Une page, un article par URL : index.html?a=<handle>. Rendu : node outils/couverture.js [handle…]
// Gauche : catégorie, mot-clé en grand, sous-titre, auteur. Droite : pictogramme du sujet dans une carte.
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit } = G;
  const W = 1200, H = 860, ASSETS = '../../assets/';
  const RIBBON = ['#f16969', '#75bec0', '#aa76b2', '#8cc978', '#e0cf35', '#74a3d6'];
  const svg = G.svg;
  svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // Zone du pictogramme : carte 440 × 600, centre (920, 425)
  const PX = 700, PY = 125, PW = 440, PH = 600, CX = PX + PW / 2;
  const line = (p, x1, y1, x2, y2, stroke, w = 4, extra = {}) =>
    el('line', { x1, y1, x2, y2, stroke, 'stroke-width': w, 'stroke-linecap': 'round', ...extra }, p);
  const rect = (p, x, y, w, h, fill, extra = {}) => el('rect', { x, y, width: w, height: h, rx: 10, fill, ...extra }, p);
  const person = (p, cx, cy, fill = C.blue, k = 1) => {
    el('circle', { cx, cy: cy - 30 * k, r: 17 * k, fill }, p);
    el('path', { d: `M ${cx - 28 * k} ${cy + 22 * k} Q ${cx - 28 * k} ${cy - 8 * k} ${cx} ${cy - 8 * k} Q ${cx + 28 * k} ${cy - 8 * k} ${cx + 28 * k} ${cy + 22 * k} Z`, fill }, p);
  };
  const arrow = (p, d, color, w = 5) => {
    el('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
  };
  const head = (p, x, y, ang, color, s = 13, w = 5) => {
    const a = ang * Math.PI / 180, b = 0.5;
    arrow(p, `M ${x - s * Math.cos(a - b)} ${y - s * Math.sin(a - b)} L ${x} ${y} L ${x - s * Math.cos(a + b)} ${y - s * Math.sin(a + b)}`, color, w);
  };

  const PICTOS = {
    kaizen(p) {
      const x0 = 760, base = 640, sw = 64, sh = 78;
      for (let k = 0; k < 5; k++) {
        const x = x0 + k * sw, y = base - (k + 1) * sh;
        rect(p, x, y, sw, base - y, C.pLav, { rx: 0 });
        line(p, x, y, x + sw, y, C.blue, 5);
        line(p, x, y, x, y + sh, C.blue, 5);
        el('path', { d: `M ${x + 4} ${y} L ${x + 30} ${y} L ${x + 4} ${y - 24} Z`, fill: C.yellow, stroke: C.tYellow, 'stroke-width': 2, 'stroke-linejoin': 'round' }, p);
      }
      const tx = x0 + 4 * sw + 10, ty = base - 5 * sh;
      rect(p, tx + 4, ty - 50, 46, 46, C.blue, { rx: 8 });
      arrow(p, `M 770 330 C 800 250, 860 205, 960 190`, C.green, 5); head(p, 960, 190, -8, C.green);
      text(p, CX, 690, 'petits pas, chacun calé', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    'management-visuel'(p) {
      rect(p, 745, 180, 350, 250, C.pLav, { stroke: C.line, 'stroke-width': 2, rx: 14 });
      for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
        const red = (r === 1 && k === 3) || (r === 2 && k === 1);
        rect(p, 770 + k * 80, 200 + r * 54, 66, 40, red ? C.red : C.pGreen, { rx: 7, stroke: red ? 'none' : C.green, 'stroke-width': 2 });
      }
      [520, 600].forEach(y => {
        rect(p, 745, y, 350, 56, C.white, { stroke: C.line, 'stroke-width': 2, rx: 12 });
        rect(p, 763, y + 16, 24, 24, C.red, { rx: 5 });
        rect(p, 803, y + 16, 150, 10, C.line, { rx: 5 });
        rect(p, 803, y + 32, 100, 8, C.line, { rx: 4 });
        rect(p, 985, y + 14, 92, 28, C.pGreen, { rx: 14 });
      });
      // Par les interstices : la case rouge du milieu vers la 1re action, celle de droite vers la 2e
      arrow(p, `M 850 328 L 843 328 L 843 480 Q 843 500 823 505 L 775 515`, C.red, 4);
      arrow(p, `M 1076 274 L 1112 274 L 1112 612 Q 1112 628 1097 628`, C.red, 4);
      text(p, CX, 700, 'un écart, une action', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    kanban(p) {
      const bin = (x, full) => {
        el('path', { d: `M ${x} 430 L ${x + 130} 430 L ${x + 115} 540 L ${x + 15} 540 Z`, fill: full ? C.lightBlue : C.pLav, stroke: C.blue, 'stroke-width': 4, 'stroke-linejoin': 'round' }, p);
        if (full) [0, 1, 2].forEach(i => rect(p, x + 22 + i * 32, 400, 26, 34, C.teal, { rx: 5 }));
      };
      bin(745, true); bin(965, false);
      text(p, 810, 585, 'Fournisseur', { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
      text(p, 1030, 585, 'Poste', { size: 18, weight: 700, fill: C.ink, anchor: 'middle' });
      // Carte kanban
      const card = (x, y) => { rect(p, x, y, 74, 96, C.yellow, { rx: 8, stroke: C.tYellow, 'stroke-width': 2 });
        text(p, x + 37, y + 40, 'K', { size: 30, weight: 800, fill: C.white, anchor: 'middle' });
        rect(p, x + 14, y + 58, 46, 7, C.white, { rx: 3, opacity: 0.8 }); rect(p, x + 14, y + 72, 32, 7, C.white, { rx: 3, opacity: 0.8 }); };
      card(882, 190);
      arrow(p, `M 1030 410 C 1030 300, 1000 245, 966 238`, C.blue); head(p, 962, 238, 180, C.blue);
      arrow(p, `M 880 238 C 840 245, 810 300, 810 380`, C.blue); head(p, 810, 384, 90, C.blue);
      arrow(p, `M 880 620 L 960 620`, C.green); head(p, 964, 620, 0, C.green);
      text(p, CX, 690, 'une carte, un bac', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    gemba(p) {
      rect(p, 750, 200, 200, 210, C.pLav, { stroke: C.blue, 'stroke-width': 4, rx: 14 });
      el('circle', { cx: 850, cy: 290, r: 46, fill: 'none', stroke: C.blue, 'stroke-width': 8, 'stroke-dasharray': '14 9' }, p);
      el('circle', { cx: 850, cy: 290, r: 16, fill: C.blue }, p);
      rect(p, 770, 372, 160, 16, C.blue, { rx: 4 });
      person(p, 1035, 330, C.blue, 1.4);
      // Pas
      [[780, 470], [830, 455], [880, 470], [930, 455], [980, 470]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 10, ry: 6, fill: C.lightBlue }, p));
      rect(p, 760, 510, 320, 160, C.white, { stroke: C.line, 'stroke-width': 2, rx: 14 });
      text(p, CX, 702, 'des constats écrits et datés', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
      [0, 1, 2].forEach(i => { G.check(p, 790, 545 + i * 44, 12); rect(p, 815, 539 + i * 44, 170 - i * 30, 12, C.line, { rx: 6 }); rect(p, 1010, 537 + i * 44, 50, 16, C.pYellow, { rx: 8 }); });
    },
    pareto(p) {
      const H0 = [290, 190, 110, 70, 45, 30], base = 620, x0 = 760, bw = 46, gap = 12;
      const tot = H0.reduce((a, b) => a + b, 0);
      let cum = 0; const pts = [];
      H0.forEach((h, i) => {
        const x = x0 + i * (bw + gap);
        rect(p, x, base - h, bw, h, i < 2 ? C.blue : C.lightBlue, { rx: 6 });
        cum += h; pts.push([x + bw / 2, base - 400 * cum / tot]);
      });
      line(p, x0 - 10, base, x0 + 6 * (bw + gap), base, C.ink, 3);
      line(p, x0 - 10, base - 320, x0 + 6 * (bw + gap), base - 320, C.red, 3, { 'stroke-dasharray': '8 7' });
      text(p, x0 + 6 * (bw + gap) - 4, base - 332, '80 %', { size: 18, weight: 800, fill: C.tRed, anchor: 'end' });
      arrow(p, 'M ' + pts.map(q => q.join(' ')).join(' L '), C.yellow, 5);
      pts.forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 7, fill: C.white, stroke: C.yellow, 'stroke-width': 4 }, p));
      text(p, CX, 690, 'les causes qui pèsent', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    obeya(p) {
      rect(p, 740, 180, 360, 270, C.white, { stroke: C.blue, 'stroke-width': 4, rx: 14 });
      const Z = [[760, 200, 150, 110, C.pRed], [920, 200, 160, 110, C.pYellow], [760, 320, 100, 110, C.pGreen], [870, 320, 100, 110, C.pLav], [980, 320, 100, 110, C.pGreen]];
      Z.forEach(([x, y, w, h, f]) => { rect(p, x, y, w, h, f, { rx: 8 }); rect(p, x + 14, y + 16, w - 40, 9, C.line, { rx: 4 }); rect(p, x + 14, y + 34, w - 60, 9, C.line, { rx: 4 }); });
      [800, 875, 950, 1025].forEach((x, i) => person(p, x, 580, i === 1 ? C.lightBlue : C.blue, 1.05));
      text(p, CX, 690, '15 minutes, debout, à heure fixe', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    qqoqccp(p) {
      const Q = ['Quoi ?', 'Qui ?', 'Où ?', 'Quand ?', 'Comment ?', 'Combien ?', 'Pourquoi ?'];
      const cols = [C.red, C.teal, C.violet, C.green, C.lightBlue, C.yellow, C.blue];
      Q.forEach((q, i) => {
        const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
        const x = col ? 1000 : 840, y = 205 + row * 62 + (col ? 31 : 0);
        G.pill(p, x, y, q, { size: 20, h: 44, bg: cols[i], fg: C.white, anchor: 'middle' });
      });
      arrow(p, 'M 840 450 C 840 500, 900 520, 920 545', C.blue); arrow(p, 'M 1000 420 C 1000 500, 940 520, 920 545', C.blue);
      head(p, 920, 550, 90, C.blue);
      rect(p, 750, 575, 340, 92, C.blue, { rx: 14 });
      rect(p, 775, 600, 290, 12, C.white, { rx: 6, opacity: 0.85 }); rect(p, 775, 626, 220, 12, C.white, { rx: 6, opacity: 0.85 });
    },
    raci(p) {
      const L = [['R', 'A', 'C', 'I'], ['A', 'R', 'I', 'C'], ['C', 'I', 'A', 'R'], ['I', 'A', 'R', 'C'], ['R', 'C', 'I', 'A']];
      const x0 = 790, y0 = 250, cw = 74, rh = 72;
      [0, 1, 2, 3].forEach(k => person(p, x0 + k * cw + 33, 215, C.lightBlue, 0.7));
      L.forEach((row, r) => {
        rect(p, 730, y0 + r * rh + 8, 46, 56, C.pLav, { rx: 8 });
        rect(p, 740, y0 + r * rh + 30, 26, 10, C.line, { rx: 5 });
        row.forEach((ch, k) => {
          const isA = ch === 'A';
          rect(p, x0 + k * cw, y0 + r * rh + 8, 66, 56, isA ? C.blue : C.white, { stroke: isA ? 'none' : C.line, 'stroke-width': 2, rx: 10 });
          text(p, x0 + k * cw + 33, y0 + r * rh + 48, ch, { size: 26, weight: 800, fill: isA ? C.white : C.blue, anchor: 'middle' });
        });
      });
      text(p, CX, 690, 'un seul A par ligne', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    amdec(p) {
      const tile = (x, ch, f) => { rect(p, x, 190, 82, 82, f, { rx: 14 }); text(p, x + 41, 245, ch, { size: 38, weight: 800, fill: C.white, anchor: 'middle' }); };
      tile(735, 'F', C.teal); text(p, 838, 245, '×', { size: 34, weight: 800, fill: C.ink, anchor: 'middle' });
      tile(855, 'G', C.red); text(p, 958, 245, '×', { size: 34, weight: 800, fill: C.ink, anchor: 'middle' });
      tile(975, 'D', C.violet);
      text(p, CX, 335, '= criticité', { size: 26, weight: 800, fill: C.blue, anchor: 'middle' });
      [300, 250, 205, 150, 120, 90, 65].forEach((w, i) => rect(p, 760, 370 + i * 44, w, 30, i < 3 ? C.blue : C.lightBlue, { rx: 7, opacity: i < 3 ? 1 : 0.6 }));
      line(p, 745, 501, 1095, 501, C.red, 3, { 'stroke-dasharray': '8 7' });
      text(p, 1095, 492, 'seuil', { size: 17, weight: 800, fill: C.tRed, anchor: 'end' });
      text(p, CX, 702, 'par quoi commencer', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    takt(p) {
      el('circle', { cx: CX, cy: 300, r: 110, fill: C.white, stroke: C.blue, 'stroke-width': 10 }, p);
      rect(p, CX - 18, 168, 36, 22, C.blue, { rx: 5 });
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line(p, CX + 88 * Math.sin(a), 300 - 88 * Math.cos(a), CX + 98 * Math.sin(a), 300 - 98 * Math.cos(a), C.ink, 3); }
      arrow(p, `M ${CX} 300 L ${CX + 60} 260`, C.red, 6);
      text(p, CX, 350, '95 s', { size: 32, weight: 800, fill: C.blue, anchor: 'middle' });
      const B = [150, 175, 215, 160], base = 660, tk = 190;
      B.forEach((h, i) => rect(p, 765 + i * 82, base - h, 60, h, h > tk ? C.red : C.lightBlue, { rx: 7 }));
      line(p, 750, base - tk, 1090, base - tk, C.blue, 3, { 'stroke-dasharray': '8 7' });
      text(p, 1090, base - tk - 10, 'takt', { size: 17, weight: 800, fill: C.blue, anchor: 'end' });
    },
    '5s'(p) {
      // Tableau d'ombres : l'outil manquant se voit d'un regard
      rect(p, 745, 175, 350, 300, C.pLav, { rx: 14 });
      const shadow = { fill: C.white, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 5' };
      const hammer = (x, o) => { rect(p, x - 8, 250, 16, 190, o.fill, { ...o, rx: 6 }); rect(p, x - 38, 205, 76, 44, o.fill, { ...o, rx: 8 }); };
      const driver = (x, o) => { rect(p, x - 15, 205, 30, 92, o.fill, { ...o, rx: 12 }); rect(p, x - 5, 297, 10, 145, o.fill, { ...o, rx: 4 }); };
      const wrench = (x, o) => { rect(p, x - 11, 250, 22, 190, o.fill, { ...o, rx: 8 }); el('circle', { cx: x, cy: 232, r: 30, ...o }, p); };
      hammer(800, shadow); driver(920, shadow); wrench(1040, shadow);
      hammer(800, { fill: C.blue }); wrench(1040, { fill: C.blue });
      driver(920, { fill: 'none', stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '6 5' });
      G.cross(p, 958, 215, 16);
      ['Trier', 'Ranger', 'Nettoyer', 'Standardiser', 'Tenir'].forEach((l, i) => {
        const x = 770 + i * 75;
        el('circle', { cx: x, cy: 535, r: 22, fill: [C.red, C.teal, C.violet, C.green, C.lightBlue][i] }, p);
        text(p, x, 543, 'S', { size: 22, weight: 800, fill: C.white, anchor: 'middle' });
        text(p, x, i % 2 ? 604 : 582, l, { size: 14, weight: 700, fill: C.ink, anchor: 'middle' });
      });
      text(p, CX, 690, 'l’outil manquant se voit', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    trs(p) {
      // Cascade : le temps d'ouverture perd trois fois, il reste le TRS
      const X0 = 750, Wd = 340, rows = [['Temps d’ouverture', 340, C.pLav, C.ink], ['Disponibilité', 290, C.teal, C.white], ['Performance', 240, C.lightBlue, C.white], ['Qualité', 200, C.violet, C.white]];
      rows.forEach(([l, w, f, fg], i) => {
        const y = 180 + i * 84;
        rect(p, X0, y, w, 56, f, { rx: 10 });
        if (i) rect(p, X0 + w + 4, y, rows[i - 1][1] - w - 4, 56, C.pRed, { rx: 10 });
        text(p, X0 + 16, y + 35, l, { size: 19, weight: 700, fill: fg });
      });
      line(p, X0 + 200, 520, X0 + 200, 560, C.blue, 3, { 'stroke-dasharray': '5 5' });
      rect(p, X0, 560, 200, 66, C.blue, { rx: 12 });
      text(p, X0 + 100, 603, 'TRS', { size: 30, weight: 800, fill: C.white, anchor: 'middle' });
      rect(p, X0 + 222, 578, 26, 26, C.pRed, { rx: 6 });
      text(p, X0 + 258, 598, 'pertes', { size: 18, weight: 700, fill: C.tRed });
      text(p, CX, 690, 'trois pertes, un seul taux', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    vsm(p) {
      [770, 885, 1000].forEach((x, i) => {
        rect(p, x, 220, 80, 74, C.pLav, { stroke: C.blue, 'stroke-width': 4, rx: 8 });
        rect(p, x + 14, 240, 52, 9, C.blue, { rx: 4, opacity: 0.5 }); rect(p, x + 14, 258, 36, 9, C.blue, { rx: 4, opacity: 0.5 });
        if (i < 2) {
          el('path', { d: `M ${x + 98} 360 L ${x + 112} 334 L ${x + 126} 360 Z`, fill: C.yellow, stroke: C.tYellow, 'stroke-width': 2 }, p);
          text(p, x + 112, 356, 'I', { size: 14, weight: 800, fill: C.white, anchor: 'middle' });
          arrow(p, `M ${x + 84} 257 L ${x + 108} 257`, C.ink, 4); head(p, x + 112, 257, 0, C.ink, 9, 4);
        }
      });
      // Échelle des temps : longues attentes, courtes transformations
      const y0 = 470, y1 = 540;
      arrow(p, `M 750 ${y1} L 800 ${y1} L 800 ${y0} L 830 ${y0} L 830 ${y1} L 915 ${y1} L 915 ${y0} L 945 ${y0} L 945 ${y1} L 1030 ${y1} L 1030 ${y0} L 1060 ${y0} L 1060 ${y1} L 1090 ${y1}`, C.ink, 4);
      [[775, 'attente'], [872, 'attente'], [988, 'attente']].forEach(([x, l]) => text(p, x, y1 + 30, l, { size: 15, weight: 700, fill: C.tRed, anchor: 'middle' }));
      [815, 930, 1045].forEach(x => text(p, x, y0 - 12, 'VA', { size: 15, weight: 800, fill: C.tGreen, anchor: 'middle' }));
      text(p, CX, 690, 'le temps entre les opérations', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    formation(p) {
      rect(p, 760, 180, 320, 220, C.white, { stroke: C.blue, 'stroke-width': 4, rx: 14 });
      rect(p, 790, 215, 190, 14, C.blue, { rx: 7 }); rect(p, 790, 245, 150, 10, C.line, { rx: 5 }); rect(p, 790, 268, 170, 10, C.line, { rx: 5 }); rect(p, 790, 291, 120, 10, C.line, { rx: 5 });
      el('circle', { cx: 1020, cy: 340, r: 36, fill: C.yellow, stroke: C.tYellow, 'stroke-width': 3 }, p);
      G.check(p, 1020, 340, 18, C.tYellow);
      [['White Belt', C.white, C.ink], ['Yellow Belt', C.yellow, C.white], ['Green Belt', C.green, C.white], ['Black Belt', C.ink, C.white]].forEach(([l, f, fg], i) => {
        rect(p, 760, 440 + i * 56, 320, 42, f, { rx: 21, stroke: C.line, 'stroke-width': 2 });
        text(p, 920, 468 + i * 56, l, { size: 19, weight: 800, fill: fg, anchor: 'middle' });
      });
      text(p, CX, 702, 'quel niveau, pour quel besoin', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    muda(p) {
      const L = ['Surproduction', 'Attentes', 'Transports', 'Traitements', 'Stocks', 'Mouvements', 'Défauts', 'Compétences'];
      L.forEach((l, i) => {
        const x = 745 + (i % 2) * 180, y = 180 + Math.floor(i / 2) * 118;
        rect(p, x, y, 168, 100, i === 0 ? C.pRed : C.white, { stroke: i === 0 ? 'none' : C.line, 'stroke-width': 2, rx: 14 });
        G.badgeNum(p, x + 30, y + 32, i + 1, 17);
        fit(text(p, x + 14, y + 80, l, { size: 17, weight: 700, fill: C.ink }), x + 162, `muda ${l}`);
      });
      text(p, CX, 690, 'huit façons de perdre du temps', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    qualiopi(p) {
      el('path', { d: `M ${CX} 180 L ${CX + 130} 225 L ${CX + 130} 340 Q ${CX + 130} 440 ${CX} 495 Q ${CX - 130} 440 ${CX - 130} 340 L ${CX - 130} 225 Z`, fill: C.blue }, p);
      G.check(p, CX, 335, 58, C.green);
      ['Processus certifié', 'Indicateurs suivis', 'Financements ouverts'].forEach((l, i) => G.pill(p, CX, 535 + i * 48, l, { size: 18, h: 38, bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' }));
      text(p, CX, 702, 'ce que le label garantit', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    financement(p) {
      // Le coût de la formation, découpé entre les financeurs
      el('circle', { cx: CX, cy: 235, r: 50, fill: C.yellow, stroke: C.tYellow, 'stroke-width': 4 }, p);
      text(p, CX, 254, '€', { size: 52, weight: 800, fill: C.white, anchor: 'middle' });
      text(p, 750, 335, 'Coût de la formation', { size: 18, weight: 700, fill: C.ink });
      [['CPF', 150, C.teal, C.white], ['OPCO', 115, C.violet, C.white], ['reste', 75, C.pLav, C.ink]].reduce((x, [l, w, f, fg]) => {
        rect(p, x, 350, w - 4, 70, f, { rx: 10 });
        text(p, x + (w - 4) / 2, 393, l, { size: 19, weight: 800, fill: fg, anchor: 'middle' });
        return x + w;
      }, 750);
      text(p, 750, 480, 'Selon votre situation :', { size: 18, weight: 700, fill: C.ink });
      G.pill(p, 750, 520, 'France Travail', { size: 18, h: 40, bg: C.lightBlue, fg: C.white });
      G.pill(p, 750, 572, 'Plan de développement', { size: 18, h: 40, bg: C.green, fg: C.white });
      text(p, CX, 690, 'qui finance quoi', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    metier(p) {
      // Le responsable devant son tableau de progrès
      rect(p, 850, 185, 240, 230, C.white, { stroke: C.blue, 'stroke-width': 4, rx: 14 });
      line(p, 875, 375, 1065, 375, C.ink, 3); line(p, 875, 375, 875, 215, C.ink, 3);
      line(p, 875, 250, 1065, 250, C.green, 3, { 'stroke-dasharray': '7 6' });
      arrow(p, 'M 885 360 L 925 340 L 960 345 L 995 300 L 1030 285 L 1055 262', C.blue, 5);
      el('circle', { cx: 1055, cy: 262, r: 7, fill: C.blue }, p);
      person(p, 780, 400, C.blue, 1.6);
      rect(p, 745, 440, 70, 48, C.yellow, { rx: 8, stroke: C.tYellow, 'stroke-width': 3 });
      ['Mesurer', 'Animer', 'Former', 'Standardiser'].forEach((l, i) =>
        G.pill(p, i % 2 ? 1010 : 830, 545 + Math.floor(i / 2) * 54, l, { size: 18, h: 40, bg: C.pLav, fg: C.blue, anchor: 'middle' }));
      text(p, CX, 700, 'piloter le progrès au quotidien', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    'green-belt'(p) {
      rect(p, 745, 280, 350, 70, C.green, { rx: 14 });
      el('path', { d: 'M 890 350 L 860 470 L 900 460 L 920 360 Z', fill: C.tGreen }, p);
      el('path', { d: 'M 950 350 L 980 470 L 940 460 L 920 360 Z', fill: C.tGreen }, p);
      rect(p, 885, 268, 70, 94, C.tGreen, { rx: 12 });
      ['D', 'M', 'A', 'I', 'C'].forEach((ch, i) => { rect(p, 752 + i * 70, 530, 58, 58, C.blue, { rx: 12 }); text(p, 781 + i * 70, 570, ch, { size: 28, weight: 800, fill: C.white, anchor: 'middle' }); });
      text(p, CX, 650, 'la méthode DMAIC', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    pdca(p) {
      const cx = 920, cy = 330, r = 130;
      [['P', C.blue, -90], ['D', C.teal, 0], ['C', C.yellow, 90], ['A', C.red, 180]].forEach(([ch, f, a0], i) => {
        const a = a0 * Math.PI / 180, b = (a0 + 90) * Math.PI / 180, m = (a0 + 45) * Math.PI / 180;
        el('path', { d: `M ${cx} ${cy} L ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(b)} ${cy + r * Math.sin(b)} Z`, fill: f, stroke: C.white, 'stroke-width': 6 }, p);
        text(p, cx + 70 * Math.cos(m), cy + 70 * Math.sin(m) + 14, ch, { size: 40, weight: 800, fill: C.white, anchor: 'middle' });
      });
      el('path', { d: 'M 745 640 L 1095 520 L 1095 640 Z', fill: C.pLav }, p);
      line(p, 745, 640, 1095, 520, C.blue, 5);
      el('path', { d: 'M 900 588 L 950 570 L 950 540 Z', fill: C.yellow, stroke: C.tYellow, 'stroke-width': 2 }, p);
      text(p, 1000, 610, 'standard', { size: 16, weight: 800, fill: C.tYellow, anchor: 'middle' });
      text(p, CX, 702, 'chaque tour calé par un standard', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    dmaic(p) {
      [['D', 'Définir', C.blue], ['M', 'Mesurer', C.teal], ['A', 'Analyser', C.violet], ['I', 'Innover', C.green], ['C', 'Contrôler', C.red]].forEach(([ch, l, f], i) => {
        const y = 180 + i * 96;
        el('path', { d: `M 760 ${y} L 1040 ${y} L 1075 ${y + 38} L 1040 ${y + 76} L 760 ${y + 76} L 790 ${y + 38} Z`, fill: f }, p);
        text(p, 830, y + 50, ch, { size: 32, weight: 800, fill: C.white, anchor: 'middle' });
        text(p, 870, y + 47, l, { size: 22, weight: 700, fill: C.white });
      });
      text(p, CX, 702, 'cinq étapes, dans l’ordre', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    smed(p) {
      // Avant / après : le réglage préparé machine en marche raccourcit l'arrêt
      const X0 = 750;
      text(p, X0, 205, 'Avant', { size: 20, weight: 800, fill: C.ink });
      rect(p, X0, 220, 340, 64, C.red, { rx: 10 });
      text(p, X0 + 170, 260, 'arrêt : tout le réglage', { size: 18, weight: 700, fill: C.white, anchor: 'middle' });
      text(p, X0, 355, 'Après', { size: 20, weight: 800, fill: C.ink });
      rect(p, X0, 370, 150, 64, C.teal, { rx: 10 });
      text(p, X0 + 75, 408, 'en marche', { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
      rect(p, X0 + 156, 370, 110, 64, C.red, { rx: 10 });
      text(p, X0 + 211, 408, 'arrêt', { size: 17, weight: 700, fill: C.white, anchor: 'middle' });
      rect(p, X0 + 272, 370, 68, 64, C.teal, { rx: 10 });
      // Durées d'arrêt comparées
      line(p, X0, 470, X0 + 340, 470, C.tRed, 4);
      line(p, X0 + 156, 500, X0 + 266, 500, C.tRed, 4);
      [[X0, 470], [X0 + 340, 470], [X0 + 156, 500], [X0 + 266, 500]].forEach(([x, y]) => line(p, x, y - 10, x, y + 10, C.tRed, 4));
      G.pill(p, CX, 570, 'arrêt raccourci', { size: 20, h: 46, bg: C.pGreen, fg: C.tGreen, icon: 'check', anchor: 'middle' });
      text(p, CX, 690, 'sortir le réglage de l’arrêt', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    'trs-trg-tre'(p) {
      // Même temps utile, trois dénominateurs différents
      [['TRS', 'sur le temps requis', 230, C.blue], ['TRG', 'sur le temps d’ouverture', 290, C.teal], ['TRE', 'sur le temps total', 340, C.violet]].forEach(([k, l, w, f], i) => {
        const y = 215 + i * 140;
        text(p, 750, y, k, { size: 30, weight: 800, fill: f });
        text(p, 830, y - 2, l, { size: 17, weight: 600, fill: C.ink });
        rect(p, 750, y + 18, w, 54, C.pLav, { rx: 10 });
        rect(p, 750, y + 18, 150, 54, C.green, { rx: 10 });
        text(p, 825, y + 52, 'utile', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
      });
      text(p, CX, 690, 'même temps utile, trois bases', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    'cinq-pourquoi'(p) {
      for (let i = 0; i < 5; i++) {
        const x = 760 + i * 42, y = 185 + i * 82;
        G.pill(p, x, y, `${i + 1}. Pourquoi ?`, { size: 19, h: 42, bg: i === 4 ? C.blue : C.pLav, fg: i === 4 ? C.white : C.blue });
        if (i < 4) { arrow(p, `M ${x + 20} ${y + 24} L ${x + 20} ${y + 56} L ${x + 50} ${y + 56}`, C.ink, 3); }
      }
      rect(p, 760, 600, 320, 66, C.red, { rx: 14 });
      text(p, 920, 643, 'cause racine', { size: 24, weight: 800, fill: C.white, anchor: 'middle' });
      arrow(p, 'M 990 595 L 990 560', C.red, 4);
    },
    'types-maintenance'(p) {
      // L'état d'un équipement dans le temps et les quatre déclencheurs
      const P0 = [760, 225], P1 = [905, 230], P2 = [1000, 300], P3 = [1075, 520];
      const bez = t => [0, 1].map(k => (1 - t) ** 3 * P0[k] + 3 * (1 - t) ** 2 * t * P1[k] + 3 * (1 - t) * t * t * P2[k] + t ** 3 * P3[k]);
      line(p, 750, 540, 1095, 540, C.ink, 3); line(p, 750, 540, 750, 200, C.ink, 3);
      text(p, 758, 200, 'état', { size: 15, weight: 700, fill: C.ink });
      el('path', { d: `M ${P0} C ${P1} ${P2} ${P3}`, fill: 'none', stroke: C.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, p);
      const ys = 430;
      line(p, 750, ys, 1095, ys, C.violet, 3, { 'stroke-dasharray': '8 6' });
      let tc = 0; for (let t = 0; t <= 1; t += 0.002) if (bez(t)[1] >= ys) { tc = t; break; }
      const [cx, cy] = bez(tc), [px, py] = bez(tc - 0.22);
      el('circle', { cx, cy, r: 9, fill: C.violet }, p);
      arrow(p, `M ${px} ${py} L ${px + 70} ${py + 95}`, C.green, 3); el('circle', { cx: px, cy: py, r: 9, fill: C.green }, p);
      [800, 880, 960, 1040].forEach(x => el('path', { d: `M ${x - 9} 556 L ${x + 9} 556 L ${x} 541 Z`, fill: C.teal }, p));
      G.cross(p, 1075, 520, 14);
      [['Corrective', C.red], ['Systématique', C.teal], ['Conditionnelle', C.violet], ['Prévisionnelle', C.green]].forEach(([l, f], i) => {
        const x = i % 2 ? 935 : 760, y = 600 + Math.floor(i / 2) * 36;
        el('circle', { cx: x + 8, cy: y - 6, r: 8, fill: f }, p);
        text(p, x + 24, y, l, { size: 17, weight: 700, fill: C.ink });
      });
      text(p, CX, 702, 'quatre façons de déclencher', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    'mtbf-mttr'(p) {
      const S = [[750, 120, 1], [870, 40, 0], [910, 100, 1], [1010, 30, 0], [1040, 55, 1]];
      S.forEach(([x, w, run]) => rect(p, x, 330, w, 70, run ? C.green : C.red, { rx: 0 }));
      line(p, 745, 400, 1100, 400, C.ink, 3);
      const brace = (x0, x1, y, l, f, up) => {
        const d = up ? -1 : 1;
        arrow(p, `M ${x0} ${y} Q ${x0} ${y + 14 * d} ${x0 + 14} ${y + 14 * d} L ${(x0 + x1) / 2 - 10} ${y + 14 * d} L ${(x0 + x1) / 2} ${y + 28 * d} L ${(x0 + x1) / 2 + 10} ${y + 14 * d} L ${x1 - 14} ${y + 14 * d} Q ${x1} ${y + 14 * d} ${x1} ${y}`, f, 3);
        text(p, (x0 + x1) / 2, y + (up ? -40 : 62), l, { size: 26, weight: 800, fill: f, anchor: 'middle' });
      };
      brace(750, 870, 320, 'MTBF', C.tGreen, true);
      brace(870, 910, 410, 'MTTR', C.tRed, false);
      G.pill(p, CX, 600, 'Disponibilité', { size: 22, h: 50, bg: C.blue, fg: C.white, anchor: 'middle' });
      text(p, CX, 690, 'deux temps, une disponibilité', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    tpm(p) {
      el('path', { d: `M 740 300 L ${CX} 190 L 1100 300 Z`, fill: C.blue }, p);
      text(p, CX, 283, 'TRS', { size: 30, weight: 800, fill: C.white, anchor: 'middle' });
      [770, 840, 910, 980, 1050].forEach((x, i) => rect(p, x - 22, 315, 44, 230, [C.teal, C.lightBlue, C.violet, C.green, C.yellow][i], { rx: 6 }));
      rect(p, 740, 560, 360, 56, C.ink, { rx: 10 });
      text(p, CX, 597, '5S et standards', { size: 22, weight: 800, fill: C.white, anchor: 'middle' });
      text(p, CX, 690, 'les piliers, dans l’ordre', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    ishikawa(p) {
      line(p, 750, 420, 995, 420, C.ink, 6);
      head(p, 998, 420, 0, C.ink, 16, 6);
      rect(p, 1008, 382, 86, 76, C.red, { rx: 12 });
      text(p, 1051, 427, 'effet', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
      const M = ['Main d’œuvre', 'Matière', 'Matériel', 'Méthode', 'Milieu', 'Mesure'];
      [835, 910, 985].forEach((x, i) => {
        const up = i % 2 ? 268 : 214, dn = i % 2 ? 572 : 626;
        line(p, x - 60, up + 16, x, 420, C.blue, 4); line(p, x - 60, dn - 16, x, 420, C.blue, 4);
        G.pill(p, x - 60, up, M[i], { size: 15, h: 30, pad: 10, anchor: 'middle' });
        G.pill(p, x - 60, dn, M[i + 3], { size: 15, h: 30, pad: 10, anchor: 'middle' });
      });
      text(p, CX, 700, 'six familles de causes', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
    'lean-manufacturing'(p) {
      el('path', { d: `M 740 300 L ${CX} 180 L 1100 300 Z`, fill: C.blue }, p);
      text(p, CX, 282, 'Client', { size: 26, weight: 800, fill: C.white, anchor: 'middle' });
      rect(p, 760, 315, 120, 250, C.teal, { rx: 10 }); rect(p, 960, 315, 120, 250, C.violet, { rx: 10 });
      const vt = (x, l1, l2) => { text(p, x, 430, l1, { size: 18, weight: 800, fill: C.white, anchor: 'middle' }); text(p, x, 456, l2, { size: 18, weight: 800, fill: C.white, anchor: 'middle' }); };
      vt(820, 'Juste-à-', 'temps'); text(p, 1020, 443, 'Jidoka', { size: 18, weight: 800, fill: C.white, anchor: 'middle' });
      person(p, CX, 470, C.lightBlue, 1.1);
      rect(p, 740, 580, 360, 56, C.ink, { rx: 10 });
      text(p, CX, 617, 'Standards et kaizen', { size: 22, weight: 800, fill: C.white, anchor: 'middle' });
      text(p, CX, 700, 'la maison du Lean', { size: 20, weight: 700, fill: C.blue, anchor: 'middle' });
    },
  };

  const ARTICLES = {
    'la-methode-5s-definition-et-exemples': { tag: '5S', kw: ['Méthode 5S'], sub: ['Définition et exemples', 'pour l’atelier'], picto: '5s' },
    'taux-de-rendement-synthetique-definition': { tag: 'TRS', kw: ['TRS'], sub: ['Taux de rendement synthétique :', 'définition, exemples et calculs'], picto: 'trs' },
    'value-stream-mapping-definition-et-etapes': { tag: 'Flux', kw: ['Value Stream', 'Mapping'], sub: ['Définition et étapes', 'de la cartographie des flux'], picto: 'vsm' },
    'quelle-formation-lean-management-certifiante-choisir': { tag: 'Formation', kw: ['Formation', 'Lean'], sub: ['Quelle formation Lean', 'Management choisir ?'], picto: 'formation' },
    'les-muda-les-8-gaspillages-du-lean-guide-complet': { tag: 'Lean Management', kw: ['Les 8 muda'], sub: ['Les gaspillages du Lean,', 'le guide complet'], picto: 'muda' },
    'formation-lean-qualiopi-ce-que-le-label-change': { tag: 'Formation', kw: ['Qualiopi'], sub: ['Formation Lean : ce que', 'le label change'], picto: 'qualiopi' },
    'financement-formation-lean-tous-les-dispositifs-2026': { tag: 'Formation', kw: ['Financement'], sub: ['Formation Lean : tous', 'les dispositifs 2026'], picto: 'financement' },
    'responsable-amelioration-continue-fiche-metier': { tag: 'Métier', kw: ['Responsable', 'amélioration'], sub: ['continue : le métier', 'et le salaire en 2026'], picto: 'metier' },
    'green-belt-lean-six-sigma': { tag: 'Formation', kw: ['Green Belt'], sub: ['Lean Six Sigma : programme,', 'prix et CPF 2026'], picto: 'green-belt' },
    'methode-pdca-roue-de-deming-cycle': { tag: 'Amélioration continue', kw: ['PDCA'], sub: ['La roue de Deming expliquée', 'avec un exemple concret'], picto: 'pdca' },
    'methode-dmaic-5-etapes': { tag: 'Résolution de problèmes', kw: ['DMAIC'], sub: ['Les 5 étapes expliquées', 'pas à pas'], picto: 'dmaic' },
    'methode-smed-5-etapes': { tag: 'Flux', kw: ['SMED'], sub: ['Les 5 étapes pour réduire', 'les changements de série'], picto: 'smed' },
    'trs-trg-tre-lequel-piloter': { tag: 'TRS', kw: ['TRS, TRG, TRE'], kwSize: 70, sub: ['Lequel piloter', 'et pourquoi'], picto: 'trs-trg-tre' },
    'methode-5-pourquoi-cause-racine': { tag: 'Résolution de problèmes', kw: ['5 Pourquoi'], sub: ['Exemple, étapes', 'et cause racine'], picto: 'cinq-pourquoi' },
    'types-de-maintenance-comment-choisir': { tag: 'Maintenance', kw: ['Types de', 'maintenance'], sub: ['Laquelle choisir pour', 'quel équipement'], picto: 'types-maintenance' },
    'mtbf-mttr-indicateurs-disponibilite': { tag: 'Maintenance', kw: ['MTBF', 'et MTTR'], sub: ['Les deux indicateurs qui', 'expliquent votre disponibilité'], picto: 'mtbf-mttr' },
    'tpm-total-productive-maintenance': { tag: 'Maintenance', kw: ['TPM'], sub: ['Par quoi commencer', 'et ce qui la fait tenir'], picto: 'tpm' },
    'diagramme-ishikawa-6m-methode-exemple': { tag: 'Résolution de problèmes', kw: ['Diagramme', 'd’Ishikawa'], sub: ['Les 6 M, la méthode', 'et un exemple rempli'], picto: 'ishikawa' },
    'lean-manufacturing-definition-principes-outils': { tag: 'Lean Management', kw: ['Lean', 'Manufacturing'], kwSize: 72, sub: ['Définition, principes', 'et outils pour l’atelier'], picto: 'lean-manufacturing' },
    'kaizen-definition-methode-amelioration-continue': { tag: 'Amélioration continue', kw: ['Kaizen'], sub: ['Définition, méthode et mise', 'en pratique en atelier'], picto: 'kaizen' },
    'management-visuel-outils-exemples': { tag: 'Management visuel', kw: ['Management', 'visuel'], sub: ['Rendre les écarts visibles', 'pour décider plus vite'], picto: 'management-visuel' },
    'kanban-de-production-boucle-dimensionnement': { tag: 'Flux', kw: ['Kanban de', 'production'], sub: ['Dimensionner la boucle et', 'calculer le nombre de cartes'], picto: 'kanban' },
    'gemba-walk-tournee-atelier-methode': { tag: 'Pilotage', kw: ['Gemba walk'], sub: ['Ce qu’on regarde vraiment', 'quand on descend en atelier'], picto: 'gemba' },
    'diagramme-de-pareto-methode-exemple': { tag: 'Résolution de problèmes', kw: ['Diagramme', 'de Pareto'], sub: ['Construire un classement', 'de causes qui tient'], picto: 'pareto' },
    'obeya-salle-pilotage-visuel': { tag: 'Pilotage visuel', kw: ['Obeya'], sub: ['À quoi sert vraiment une', 'salle de pilotage visuel'], picto: 'obeya' },
    'qqoqccp-methode-cadrer-un-probleme': { tag: 'Résolution de problèmes', kw: ['QQOQCCP'], sub: ['Cadrer un problème', 'en sept questions'], picto: 'qqoqccp' },
    'matrice-raci-definition-exemple-methode': { tag: 'Gestion de projet', kw: ['Matrice RACI'], sub: ['Définition, exemple et méthode', 'de construction en une réunion'], picto: 'raci' },
    'amdec-methode-cotation-criticite': { tag: 'Maintenance', kw: ['AMDEC'], sub: ['Méthode, cotation de la criticité', 'et plan d’action en atelier'], picto: 'amdec' },
    'takt-time-calcul-definition': { tag: 'Flux', kw: ['Takt time'], sub: ['Calculer le rythme', 'imposé par la demande'], picto: 'takt' },
  };

  function build(a) {
    el('rect', { x: 0, y: 0, width: W, height: H, fill: '#f3f3f3' });
    el('image', { href: ASSETS + 'paper.png', x: 0, y: -170, width: W, height: W * 1350 / 1080, preserveAspectRatio: 'none' });
    RIBBON.forEach((c, i) => el('rect', { x: i * 200, y: H - 14, width: 200, height: 14, fill: c }));
    el('image', { href: ASSETS + 'fichly-logo.png', x: W - 150, y: H - 92, width: 128, height: 68 });

    const left = el('g');
    G.pill(left, 70, 150, a.tag, { size: 20, h: 42, pad: 18, bg: C.pLav, fg: C.blue });
    let y = 280;
    let last;
    a.kw.forEach((l, i) => { last = text(left, 66, y, l, { size: a.kwSize || 80, weight: 800, fill: C.blue }); fit(last, 670, `mot-clé ${i + 1}`); y += (a.kwSize || 80) + 12; });
    // Double soulignement vert sous la dernière ligne du mot-clé
    const b = last.getBBox(), u0 = b.x + 6, u1 = b.x + Math.min(b.width, 420) - 6, uy = b.y + b.height + 2;
    arrow(left, `M ${u0} ${uy} C ${u0 + 60} ${uy - 6}, ${u1 - 120} ${uy - 8}, ${u1} ${uy - 6}`, C.green, 5);
    arrow(left, `M ${u0 + 40} ${uy + 9} C ${u0 + 100} ${uy + 4}, ${u1 - 140} ${uy + 3}, ${u1 - 50} ${uy + 4}`, C.green, 5);
    y += 30;
    a.sub.forEach((l, i) => { fit(text(left, 70, y, l, { size: 32, weight: 600, fill: C.ink }), 670, `sous-titre ${i + 1}`); y += 46; });

    // Auteur
    const clip = G.clipRect(70, 668, 72, 72);
    el('circle', { cx: 106, cy: 704, r: 36, fill: C.pLav });
    el('image', { href: ASSETS + 'auteurs/hugo-duc.png', x: 70, y: 668, width: 72, height: 72, 'clip-path': `url(#${clip.rect.parentNode.id})` });
    clip.rect.setAttribute('rx', 36);
    text(svg, 160, 698, 'Hugo Duc', { size: 23, weight: 700, fill: C.blue });
    text(svg, 160, 728, 'Formateur Lean Management · Fichly', { size: 18, weight: 500, fill: C.ink });

    // Pictogramme
    const p = el('g');
    G.card(PX, PY, PW, PH, p);
    PICTOS[a.picto](p);
  }

  const handle = new URLSearchParams(location.search).get('a') || Object.keys(ARTICLES)[0];
  const ready = (async () => {
    await Promise.all([400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 30px Poppins`)));
    await document.fonts.ready;
    if (!ARTICLES[handle]) { console.error(`Article inconnu : ${handle}`); return; }
    build(ARTICLES[handle]);
    G.checkAll();
    await Promise.all([...svg.querySelectorAll('image')].map(i => new Promise(res => {
      const im = new Image(); im.onload = im.onerror = res; im.src = new URL(i.getAttribute('href'), location.href).href;
    })));
  })();
  window.COUV = { width: W, height: H, ready, handles: Object.keys(ARTICLES) };
})();
