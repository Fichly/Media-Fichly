// Blog · Lean Manufacturing · section « Juste-à-temps et jidoka : les deux piliers du système Toyota »
// Image fixe : la maison telle que l'article la décrit. Fondations : stabilité et standards ; toit : satisfaction
// du client ; piliers : juste-à-temps et jidoka, avec leur définition et leurs outils (tableau de l'article).
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit } = G;

  const PILLARS = [
    { x: 250, name: 'Juste-à-temps', color: C.teal, def: 'Produire la bonne pièce, en bonne quantité, au bon moment.',
      tools: ['Kanban', 'Flux tiré', 'Takt time', 'SMED', 'Lissage de la charge'] },
    { x: 630, name: 'Jidoka', color: C.violet, def: 'Arrêter la production dès qu’une anomalie apparaît.',
      tools: ['Andon', 'Poka-yoke', 'Autocontrôle', 'Résolution de problèmes'] },
  ];
  const PW = 320, PY = 268, PH = 384;

  G.image(() => {
    G.templateBlog();
    G.blogTitle('La maison', 'Toyota.');

    // Toit
    el('path', { d: 'M 200 255 L 600 132 L 1000 255 Z', fill: C.blue, 'stroke-linejoin': 'round', stroke: C.blue, 'stroke-width': 8 });
    text(G.svg, 600, 238, 'Satisfaction du client', { size: 30, weight: 700, fill: C.white, anchor: 'middle' });

    PILLARS.forEach(p => {
      el('rect', { x: p.x, y: PY, width: PW, height: PH, rx: 14, fill: p.color });
      text(G.svg, p.x + PW / 2, PY + 54, p.name, { size: 32, weight: 800, fill: C.white, anchor: 'middle' });
      const d = G.para(G.svg, p.x + PW / 2, PY + 98, p.def, PW - 36, { size: 22, weight: 600, fill: C.white, anchor: 'middle', lh: 1.3 });
      fit(d.t, p.x + PW - 12, `définition ${p.name}`, p.x + 12);
      // Outils en pastilles, sur plusieurs lignes centrées
      const rows = [[]];
      let w = 0;
      p.tools.forEach(t => {
        const probe = G.pill(G.svg, 0, -200, t, { size: 21, h: 38, pad: 15, bg: C.white, fg: C.ink });
        probe.g.remove();
        if (w + probe.w > PW - 30 && rows[rows.length - 1].length) { rows.push([]); w = 0; }
        rows[rows.length - 1].push({ t, w: probe.w });
        w += probe.w + 10;
      });
      rows.forEach((r, k) => {
        const total = r.reduce((a, b) => a + b.w, 0) + 10 * (r.length - 1);
        let x = p.x + PW / 2 - total / 2;
        r.forEach(c => { G.pill(G.svg, x, PY + 258 + k * 48, c.t, { size: 21, h: 38, pad: 15, bg: C.white, fg: C.ink }); x += c.w + 10; });
      });
      text(G.svg, p.x + PW / 2, PY + 214, 'Outils', { size: 20, weight: 700, fill: C.white, anchor: 'middle' });
    });

    // Fondations
    el('rect', { x: 210, y: PY + PH + 12, width: 780, height: 78, rx: 14, fill: C.ink });
    text(G.svg, 600, PY + PH + 62, 'Stabilité et standards', { size: 30, weight: 700, fill: C.white, anchor: 'middle' });

    G.blogChute('Deux piliers posés sur la stabilité, au service du client.', { y: 808 });
  });
})();
