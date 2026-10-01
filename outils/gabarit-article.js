// Gabarit des visuels d'article du blog Fichly (1200 × 860, comme les GIF de l'article Ishikawa).
// Charge après gabarit.js, dont il reprend la palette, les helpers SVG et les animations.
// Cadre fixe : fond papier, titre et sous-titre, logo bas droit, bandeau six couleurs.
// Le contenu va dans G.content (calque qui s'efface entre 1,2 et 1,6 s, puis se reconstruit).
// Utilisation : const A = window.Article; A.template('Titre', 'Sous-titre'); … A.start({ duration, build, draw }).
(() => {
  const G = window.Gabarit;
  const { C, el, text, fit, FADE_START, FADE_END, fadeOut } = G;
  const W = 1200, H = 860;
  const ASSETS = '../../../../assets/';
  const RIBBON = ['#f16969', '#75bec0', '#aa76b2', '#8cc978', '#e0cf35', '#74a3d6'];
  const svg = G.svg;
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  let content = null;
  function template(title, subtitle) {
    el('rect', { x: 0, y: 0, width: W, height: H, fill: '#f3f3f3' });
    el('image', { href: ASSETS + 'paper.png', x: 0, y: -170, width: W, height: W * 1350 / 1080, preserveAspectRatio: 'none' });
    RIBBON.forEach((c, i) => el('rect', { x: i * 200, y: H - 14, width: 200, height: 14, fill: c }));
    el('image', { href: ASSETS + 'fichly-logo.png', x: W - 150, y: H - 92, width: 128, height: 68 });
    fit(text(svg, 60, 78, title, { size: 40, weight: 800, fill: C.blue }), W - 60, 'titre');
    if (subtitle) fit(text(svg, 60, 116, subtitle, { size: 22, weight: 500, fill: C.ink }), W - 60, 'sous-titre');
    content = el('g');
    return content;
  }

  // Temps vu par les animations : avant la reconstruction, l'image est complète (état final).
  const T = t => (t < FADE_END ? 1e9 : t);
  function fadeContent(t) {
    content.setAttribute('opacity', t >= FADE_START && t < FADE_END ? fadeOut(t) : 1);
  }

  // Animations d'apparition sur le temps T(t) : opacité, translation, échelle.
  function show(g, tt, start, { dur = 0.4, dx = 0, dy = 14, scale = false, cx = 0, cy = 0 } = {}) {
    const p = G.prog(tt, start, dur);
    const e = G.easeOut(p);
    let tr = '';
    if (p < 1) {
      if (scale) { const s = p <= 0 ? 0.001 : 0.6 + 0.4 * G.back(p); tr = `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`; }
      else tr = `translate(${dx * (1 - e)} ${dy * (1 - e)})`;
    }
    g.setAttribute('transform', tr);
    g.setAttribute('opacity', G.clamp(p / 0.6));
  }
  // Trait qui se dessine (path ou line) ; len = longueur totale
  function draw(node, tt, start, dur = 0.6) {
    const len = node.getTotalLength();
    const p = G.easeInOut(G.prog(tt, start, dur));
    node.setAttribute('stroke-dasharray', `${len} ${len}`);
    node.setAttribute('stroke-dashoffset', len * (1 - p));
    node.setAttribute('opacity', p > 0 ? 1 : 0);
  }

  function start({ duration, build, draw: drawFn }) {
    const ready = (async () => {
      await Promise.all([400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 30px Poppins`)));
      await document.fonts.ready;
      build();
      G.checkAll();
      const imgs = [...svg.querySelectorAll('image')];
      await Promise.all(imgs.map(i => new Promise(res => {
        const im = new Image(); im.onload = im.onerror = res; im.src = new URL(i.getAttribute('href'), location.href).href;
      })));
      drawFn(0);
    })();
    const loop = t => { const u = ((t % duration) + duration) % duration; fadeContent(u); drawFn(u); };
    window.FICHE = { width: W, height: H, duration, draw: loop, ready };
    ready.then(() => loop(0));
  }

  window.Article = { W, H, C, template, T, show, draw, start, get content() { return content; } };
})();
