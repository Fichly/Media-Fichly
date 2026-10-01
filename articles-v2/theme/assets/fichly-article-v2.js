/* Article Fichly V2 : sommaire, progression, copie du lien, prix des produits cités, test, encart Green Belt. */
(() => {
  const root = document.querySelector('[data-fv2]');
  if (!root) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Décalage sous l'en-tête collant du thème
  const setTop = () => {
    let h = 0;
    document.querySelectorAll('.shopify-section-group-header-group, sticky-header, header.header').forEach(el => {
      const p = getComputedStyle(el).position;
      if (p === 'sticky' || p === 'fixed') h = Math.max(h, el.getBoundingClientRect().bottom);
    });
    root.style.setProperty('--fv2-top', Math.max(0, Math.round(h)) + 24 + 'px');
  };
  setTop();
  addEventListener('resize', setTop);

  // Sommaire : ouvert en colonne sur grand écran, repliable sinon
  const toc = root.querySelector('[data-fv2-toc]');
  const links = toc ? [...toc.querySelectorAll('a[href^="#"]')] : [];
  const heads = links.map(a => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  let wide = null;
  const fit = () => { const w = root.clientWidth >= 980; if (toc && w !== wide) { wide = w; toc.open = w; } };
  fit();
  new ResizeObserver(fit).observe(root);
  links.forEach(a => a.addEventListener('click', () => { if (!wide && toc) toc.open = false; }));

  // Partie en cours, barre de lecture, temps restant
  const content = root.querySelector('.fv2-content');
  const mask = root.querySelector('.fv2-progress span');
  const bar = root.querySelector('.fv2-toc__bar span');
  const left = root.querySelector('[data-fv2-left]');
  const total = left ? Number(left.dataset.total) || 0 : 0;
  const tick = () => {
    const line = parseInt(getComputedStyle(root).getPropertyValue('--fv2-top'), 10) + 90;
    let idx = 0;
    heads.forEach((h, i) => { if (h.getBoundingClientRect().top <= line) idx = i; });
    links.forEach((a, i) => a.classList.toggle('is-current', i === idx));
    if (content) {
      const r = content.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.4 - r.top) / r.height));
      if (mask) mask.style.width = ((1 - p) * 100).toFixed(1) + '%';
      if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
      if (left) { const rest = Math.ceil(total * (1 - p)); left.textContent = rest > 0 ? rest + ' min restantes' : 'Lecture terminée'; }
    }
  };
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { tick(); raf = 0; }); }, { passive: true });
  tick();

  // Copier le lien
  root.querySelectorAll('[data-fv2-copy]').forEach(b => b.addEventListener('click', () => {
    const label = b.querySelector('span') || b;
    const done = t => { label.textContent = t; setTimeout(() => { label.textContent = 'Copier le lien'; }, 2200); };
    try { navigator.clipboard.writeText(b.dataset.fv2Copy).then(() => done('Lien copié'), () => done(b.dataset.fv2Copy)); } catch (e) { done(b.dataset.fv2Copy); }
  }));

  // Produits cités : prix à jour depuis la boutique
  const euros = c => (c / 100).toFixed(2).replace('.', ',') + '€';
  const cache = {};
  const product = h => (cache[h] = cache[h] || fetch('/products/' + h + '.js').then(r => (r.ok ? r.json() : null)).catch(() => null));
  const handleOf = href => { const m = /\/products\/([^/?#"']+)/.exec(href || ''); return m ? m[1] : null; };
  if (content) {
    content.querySelectorAll('a[href*="/products/"]').forEach(a => {
      if (a.querySelector('img') || a.closest('.f-product, .fichly-bio, .fichly-author')) return;
      const h = handleOf(a.getAttribute('href'));
      if (!h) return;
      product(h).then(p => {
        if (!p) return;
        a.classList.add('fv2-pchip');
        const b = document.createElement('b');
        b.textContent = euros(p.price);
        a.appendChild(document.createTextNode(' '));
        a.appendChild(b);
      });
    });
    content.querySelectorAll('.f-product[data-handle]').forEach(box => {
      product(box.dataset.handle).then(p => {
        if (!p) return;
        const link = box.querySelector('a');
        const why = box.querySelector('p');
        box.innerHTML = '';
        if (p.featured_image) { const img = new Image(); img.src = p.featured_image.replace(/(\.\w+)(\?|$)/, '_400x$1$2'); img.alt = ''; img.loading = 'lazy'; box.appendChild(img); }
        const t = document.createElement('div');
        t.innerHTML = (box.dataset.contexte ? '<div class="f-product__ctx"></div>' : '') + '<h3></h3>' + (why ? '<p></p>' : '') + '<div class="f-product__buy"><span class="fv2-price"></span><a class="fv2-btn is-light" style="background:var(--fv2-indigo);color:#fff"></a></div>';
        if (box.dataset.contexte) t.querySelector('.f-product__ctx').textContent = box.dataset.contexte;
        t.querySelector('h3').textContent = p.title;
        if (why) t.querySelector('p').textContent = why.textContent;
        t.querySelector('.fv2-price').textContent = euros(p.price);
        const btn = t.querySelector('a'); btn.href = '/products/' + p.handle; btn.textContent = 'Voir le produit →';
        box.appendChild(t);
        box.classList.add('is-ready');
        if (link) link.remove();
      });
    });

    // Test interactif : Oui / Non, verdict
    content.querySelectorAll('.f-test').forEach(test => {
      const items = [...test.querySelectorAll('li')];
      const seuil = Number(test.dataset.seuil) || items.length;
      const bloq = Number(test.dataset.bloquante) || 0;
      const verdict = document.createElement('div');
      verdict.className = 'fv2-verdict';
      verdict.setAttribute('role', 'status');
      test.appendChild(verdict);
      const vals = items.map(() => '');
      const update = () => {
        const yes = vals.filter(v => v === 'oui').length;
        let state = '', text = '';
        if (bloq && vals[bloq - 1] === 'non') { state = 'ko'; text = test.dataset.ko || ''; }
        else if (vals.includes('')) { text = 'Répondez aux ' + items.length + ' questions pour obtenir le verdict.'; }
        else if (yes >= seuil) { state = 'ok'; text = test.dataset.ok || ''; }
        else { state = 'wait'; text = test.dataset.wait || ''; }
        verdict.dataset.state = state;
        verdict.textContent = yes + '/' + items.length + ' réponses positives. ' + text;
      };
      items.forEach((li, i) => {
        const yn = document.createElement('span');
        yn.className = 'fv2-yn';
        ['oui', 'non'].forEach(v => {
          const b = document.createElement('button');
          b.type = 'button'; b.dataset.v = v; b.textContent = v === 'oui' ? 'Oui' : 'Non'; b.setAttribute('aria-pressed', 'false');
          b.addEventListener('click', () => {
            vals[i] = v;
            yn.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            const hint = li.querySelector('.fv2-hint');
            if (hint) hint.hidden = v !== 'non';
            update();
          });
          yn.appendChild(b);
        });
        li.appendChild(yn);
        if (li.dataset.hint) { const h = document.createElement('span'); h.className = 'fv2-hint'; h.textContent = li.dataset.hint; h.hidden = true; li.appendChild(h); }
      });
      update();
    });
  }

  // Encart Green Belt : l'anneau avance de jour en jour, puis les bénéfices apparaissent (boucle de 14 s)
  const motion = root.querySelector('[data-fv2-motion]');
  if (motion) {
    let days = [];
    try { days = JSON.parse(motion.querySelector('[data-fv2-days]').textContent).map(s => s.split('::').map(x => x.trim())); } catch (e) { days = []; }
    const stops = [...motion.querySelectorAll('.fv2-stop')];
    const chips = [...motion.querySelectorAll('.fv2-chips span')];
    const token = motion.querySelector('[data-fv2-token]'), railOn = motion.querySelector('[data-fv2-railon]');
    const dayN = motion.querySelector('[data-fv2-dayn]'), dayT = motion.querySelector('[data-fv2-dayt]'), count = motion.querySelector('[data-fv2-count]');
    const CYCLE = 14, START = 0.5, STEP = 1.35, MOVE = 0.45, CHIPS = 8.2, FADE = 13.2;
    const ease = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const clamp = v => Math.min(1, Math.max(0, v));
    const pos = i => ((i + 0.5) / 6) * 100;
    let shown = -1;
    const draw = t => {
      let f = 0;
      for (let i = 1; i < 6; i++) { const a = START + i * STEP; f = t >= a ? i : t >= a - MOVE ? i - 1 + ease(clamp((t - (a - MOVE)) / MOVE)) : f; }
      token.style.left = pos(f) + '%';
      railOn.style.width = pos(f) - pos(0) + '%';
      const day = Math.round(f);
      const reset = t >= FADE + 0.2;
      stops.forEach((s, i) => s.classList.toggle('is-on', !reset && i <= f + 0.01));
      if (day !== shown && days[day]) { shown = day; dayN.textContent = days[day][0] || ''; dayT.textContent = days[day][1] || ''; count.textContent = 'Jour ' + (day + 1) + '/6'; }
      const fade = t >= FADE ? 1 - clamp((t - FADE) / 0.6) : 1;
      chips.forEach((c, i) => { const p = ease(clamp((t - CHIPS - i * 0.45) / 0.4)); c.style.opacity = (p * fade).toFixed(3); c.style.transform = 'translateY(' + ((1 - p) * 8).toFixed(1) + 'px)'; });
      token.style.opacity = railOn.style.opacity = fade;
    };
    if (!reduce && days.length === 6) {
      let visible = false, t0 = null, id = 0;
      const loop = now => { if (t0 === null) t0 = now; draw(((now - t0) / 1000) % CYCLE); id = visible ? requestAnimationFrame(loop) : 0; };
      new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !id) id = requestAnimationFrame(loop); }).observe(motion);
    }
  }
})();
