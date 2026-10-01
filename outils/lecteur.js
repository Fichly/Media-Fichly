// Lecteur de relecture des fiches : lecture et pause, curseur image par image, temps forts,
// vitesse, scénario et vue téléphone. Chargé après fiche.js ; inactif au rendu (rendu.js ajoute ?rendu).
// Clavier : Espace lecture/pause · ← → une image · Début Fin · 1 à 9 image clé du temps n (celle de la planche).
// L'adresse garde l'instant à l'arrêt (#t=5.4) : on peut envoyer le lien d'une image précise.
(() => {
  const params = new URLSearchParams(location.search);
  if (params.has('rendu') || !window.FICHE) return;
  const F = window.FICHE;
  const STEP = 1 / F.fps;
  const fmt = s => s.toFixed(2).replace('.', ',');

  const css = `
    body.lecteur { --h: min(calc(100vh - 128px), calc((100vw - 32px) * 1.25)); display: flex; flex-direction: column;
      align-items: center; gap: 12px; padding: 12px 16px; box-sizing: border-box; min-height: 100vh;
      font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #23235a; }
    body.lecteur.telephone { --h: 487.5px; }
    body.lecteur #stage { width: calc(var(--h) * 0.8); height: var(--h); box-shadow: 0 0 0 1px #e2e2ee; }
    #lecteur { width: max(360px, calc(var(--h) * 0.8)); display: grid; gap: 8px; }
    #lecteur .rangee { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    #lecteur button { font: inherit; font-weight: 700; min-width: 40px; height: 34px; border: 0; border-radius: 17px;
      background: #4a4aa0; color: #fff; cursor: pointer; }
    #lecteur button.discret { background: #ececf5; color: #4a4aa0; }
    #lecteur .piste { position: relative; flex: 1; min-width: 160px; padding-top: 12px; }
    #lecteur input[type=range] { width: 100%; margin: 0; accent-color: #4a4aa0; }
    #lecteur .repere { position: absolute; top: 0; width: 14px; margin-left: -7px; height: 12px; border: 0; padding: 0;
      background: none; cursor: pointer; }
    #lecteur .repere::after { content: ''; position: absolute; left: 6px; top: 0; width: 2px; height: 12px; background: #4a4aa0; }
    #lecteur .temps { font-variant-numeric: tabular-nums; min-width: 128px; text-align: right; }
    #lecteur .temps-fort { flex: 1; font-weight: 700; }
    #lecteur select { font: inherit; height: 30px; border-radius: 8px; border: 1px solid #e2e2ee; background: #fff; color: inherit; }
    #lecteur label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
  `;

  function init() {
    document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));
    document.body.classList.add('lecteur');
    const bar = document.createElement('div');
    bar.id = 'lecteur';
    bar.innerHTML = `
      <div class="rangee">
        <button data-k="play" title="Lecture / pause (Espace)">❚❚</button>
        <button data-k="zero" class="discret" title="Revenir au début (Début)">↺</button>
        <div class="piste"><input type="range" min="0" max="${F.duration - STEP}" step="${STEP}" value="0"></div>
        <span class="temps"></span>
      </div>
      <div class="rangee">
        <span class="temps-fort"></span>
        <select data-k="speed" title="Vitesse"><option value="0.25">0,25×</option><option value="0.5">0,5×</option><option value="1" selected>1×</option></select>
        ${F.scenarios.length > 1 ? `<select data-k="scenario" title="Scénario">${F.scenarios.map(n => `<option${n === F.scenario ? ' selected' : ''}>${n}</option>`).join('')}</select>` : ''}
        <label title="Largeur d'un visuel dans le fil LinkedIn sur téléphone (390 px)"><input type="checkbox" data-k="phone"> Vue téléphone</label>
      </div>`;
    document.body.appendChild(bar);
    const $ = k => bar.querySelector(`[data-k="${k}"]`);
    const range = bar.querySelector('input[type=range]');
    const clock = bar.querySelector('.temps');
    const beatLabel = bar.querySelector('.temps-fort');

    let t = 0, playing = true, speed = 1, last = null, drawn = -1;
    const m = location.hash.match(/t=([\d.]+)/);
    if (m) { t = Math.min(Number(m[1]), F.duration - STEP); playing = false; }

    // Repères des temps forts sur le curseur : un clic rejoue le temps depuis son début
    F.beats.forEach((b, i) => {
      if (b.t <= 0) return;
      const r = document.createElement('button');
      r.className = 'repere';
      r.style.left = `${(b.t / F.duration) * 100}%`;
      r.title = `${i + 1} · ${b.label} (${fmt(b.t)} s)`;
      r.addEventListener('click', () => { t = b.t; setPlaying(true); r.blur(); });
      bar.querySelector('.piste').appendChild(r);
    });

    const setPlaying = p => {
      playing = p;
      $('play').textContent = p ? '❚❚' : '▶';
      history.replaceState(null, '', p ? location.pathname + location.search : `#t=${+t.toFixed(3)}`);
    };
    const seek = v => { t = Math.min(Math.max(0, v), F.duration - STEP); setPlaying(false); };

    $('play').addEventListener('click', e => { setPlaying(!playing); e.currentTarget.blur(); });
    $('zero').addEventListener('click', e => { t = 0; setPlaying(true); e.currentTarget.blur(); });
    range.addEventListener('input', () => seek(Number(range.value)));
    $('speed').addEventListener('change', e => { speed = Number(e.target.value); });
    $('phone').addEventListener('change', e => { document.body.classList.toggle('telephone', e.target.checked); e.target.blur(); });
    if ($('scenario')) $('scenario').addEventListener('change', e => {
      const q = new URLSearchParams(location.search);
      q.set('scenario', e.target.value);
      location.search = q;
    });
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' && e.target.type !== 'range' && e.target.type !== 'checkbox') return;
      const n = Number(e.key);
      if (e.key === ' ') setPlaying(!playing);
      else if (e.key === 'ArrowLeft') seek(t - STEP);
      else if (e.key === 'ArrowRight') seek(t + STEP);
      else if (e.key === 'Home') seek(0);
      else if (e.key === 'End') seek(F.duration - STEP);
      else if (n >= 1 && n <= F.beats.length) seek(F.beats[n - 1].frame);
      else return;
      e.preventDefault();
    });

    if (!playing) setPlaying(false);
    const frame = now => {
      if (playing) {
        if (last !== null) t = (t + ((now - last) / 1000) * speed) % F.duration;
        last = now;
      } else last = null;
      if (t !== drawn) {
        F.draw(t);
        drawn = t;
        range.value = t;
        clock.textContent = `${fmt(t)} s / ${fmt(F.duration)} s · image ${Math.round(t / STEP)}`;
        // Sur une image clé, son temps fort (elle peut tomber au début du suivant) ; sinon le temps en cours
        const k = F.beats.findIndex(b => Math.abs(b.frame - t) < 1e-6);
        const i = k >= 0 ? k : F.beats.findIndex(b => t >= b.t && t < b.end);
        beatLabel.textContent = i >= 0 ? `Temps ${i + 1}/${F.beats.length} · ${F.beats[i].label}` : '';
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  F.ready.then(init);
})();
