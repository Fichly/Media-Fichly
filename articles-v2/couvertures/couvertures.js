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
  };

  const ARTICLES = {
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
    a.kw.forEach((l, i) => { last = text(left, 66, y, l, { size: 80, weight: 800, fill: C.blue }); fit(last, 670, `mot-clé ${i + 1}`); y += 92; });
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
