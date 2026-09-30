"""Aperçu des posts programmés, présentés comme dans un fil d'actualité.

    python3 outils/apercu.py apercus/posts-5-6-octobre.json

Écrit apercus/<nom>.html, autonome (images intégrées) : texte tronqué avec
« …voir plus », visuel animé, barre d'actions et premier commentaire.
"""
import base64
import html
import json
import mimetypes
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def data_uri(rel):
    p = ROOT / rel
    mime = mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    return f"data:{mime};base64,{base64.b64encode(p.read_bytes()).decode()}"


def card(post, i):
    avatar = data_uri(post['photo'])
    esc = lambda s: html.escape(s, quote=True)
    return f"""
  <article class="post">
    <header>
      <img class="avatar" src="{avatar}" alt="">
      <div class="who">
        <strong>{esc(post['auteur'])}</strong>
        <span>Fichly</span>
        <span class="when">{esc(post['quand'])} · 🌐</span>
      </div>
    </header>
    <div class="text" id="t{i}">{esc(post['texte'])}</div>
    <button class="more" data-target="t{i}">…voir plus</button>
    <img class="visual" src="{data_uri(post['visuel'])}" alt="{esc(post['alt'])}">
    <div class="counts"><span></span><span>Premier commentaire publié par Buffer</span></div>
    <nav class="actions"><span>👍 J’aime</span><span>💬 Commenter</span><span>🔁 Republier</span><span>➤ Envoyer</span></nav>
    <div class="comment">
      <img class="avatar sm" src="{avatar}" alt="">
      <div class="bubble"><strong>{esc(post['auteur'])}</strong> <em>Auteur</em><p>{linkify(esc(post['commentaire']))}</p></div>
    </div>
  </article>"""


def linkify(s):
    import re
    return re.sub(r'(https?://\S+)', r'<a href="\1" target="_blank" rel="noopener">\1</a>', s)


def main(src):
    posts = json.loads(Path(src).read_text(encoding='utf-8'))
    cards = '\n'.join(card(p, i) for i, p in enumerate(posts))
    page = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aperçu des posts</title>
<style>
  :root {{ --bg: #f4f2ee; --card: #ffffff; --ink: #1d1d1f; --muted: #666; --line: #e0dfdc; --link: #0a66c2; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.43 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }}
  main {{ max-width: 555px; margin: 0 auto; padding: 24px 16px 48px; }}
  h1 {{ font-size: 16px; font-weight: 600; margin: 0 0 4px; }}
  .note {{ color: var(--muted); margin: 0 0 16px; }}
  .post {{ background: var(--card); border: 1px solid var(--line); border-radius: 8px; margin-bottom: 20px; overflow: hidden; }}
  header {{ display: flex; gap: 8px; padding: 12px 16px 8px; }}
  .avatar {{ width: 48px; height: 48px; border-radius: 50%; flex: none; }}
  .avatar.sm {{ width: 32px; height: 32px; }}
  .who {{ display: flex; flex-direction: column; line-height: 1.3; }}
  .who span {{ color: var(--muted); font-size: 12px; }}
  .text {{ white-space: pre-line; padding: 0 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }}
  .text.open {{ display: block; }}
  .more {{ display: block; margin: 0 16px 8px auto; border: 0; background: none; color: var(--muted); font: inherit; cursor: pointer; padding: 0; }}
  .more:hover {{ color: var(--link); text-decoration: underline; }}
  .visual {{ display: block; width: 100%; height: auto; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }}
  .counts {{ display: flex; justify-content: space-between; color: var(--muted); font-size: 12px; padding: 8px 16px; border-bottom: 1px solid var(--line); }}
  .actions {{ display: flex; justify-content: space-around; padding: 4px 8px; color: var(--muted); font-weight: 600; }}
  .actions span {{ padding: 10px 8px; }}
  .comment {{ display: flex; gap: 8px; padding: 8px 16px 16px; }}
  .bubble {{ background: #f2f2f2; border-radius: 0 8px 8px 8px; padding: 8px 12px; flex: 1; font-size: 13px; }}
  .bubble em {{ font-style: normal; font-size: 11px; background: #555; color: #fff; border-radius: 3px; padding: 0 4px; margin-left: 4px; }}
  .bubble p {{ margin: 4px 0 0; }}
  .bubble a {{ color: var(--link); }}
</style>
</head>
<body>
<main>
  <h1>Aperçu des posts programmés</h1>
  <p class="note">Texte et premier commentaire tels qu’ils sont dans Buffer. Cliquez sur « …voir plus » pour déplier le post.</p>
{cards}
</main>
<script>
  document.querySelectorAll('.more').forEach(b => b.addEventListener('click', () => {{
    const t = document.getElementById(b.dataset.target);
    const open = t.classList.toggle('open');
    b.textContent = open ? 'voir moins' : '…voir plus';
  }}));
</script>
</body>
</html>
"""
    out = ROOT / 'apercus' / (Path(src).stem.replace('posts-', 'apercu-') + '.html')
    out.write_text(page, encoding='utf-8')
    print('→', out.relative_to(ROOT), f"{out.stat().st_size / 1e6:.2f} Mo")


if __name__ == '__main__':
    main(sys.argv[1])
