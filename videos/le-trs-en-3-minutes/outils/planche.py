#!/usr/bin/env python3
"""Planche v3 du « TRS en 3 minutes » : génère storyboard.html à partir de outils/planche.css.

Usage (depuis le dossier du projet) : python3 outils/planche.py
Le cadre 16:9 est dessiné en unités cqw : 1 cqw = 19,2 px dans l'image finale en 1920×1080.
Les positions et tailles reprennent donc directement celles du montage Remotion.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_CSS = (ROOT / "outils" / "planche.css").read_text(encoding="utf-8")

EXTRA_CSS = """
  /* ── v3 : fil d'enquête ── */
  .track { right: 2.4cqw; top: 3.2cqw; display: flex; gap: .45cqw; }
  .track > span { display: inline-flex; align-items: center; gap: .45cqw; border-radius: 999px; padding: .3cqw .85cqw .3cqw .3cqw; font-weight: 700; font-size: 1.05cqw; line-height: 1; white-space: nowrap; background: var(--white); color: var(--blue); border: .1cqw solid var(--line); }
  .track > span > i { display: inline-grid; place-items: center; width: 1.55cqw; height: 1.55cqw; border-radius: 50%; font-style: normal; font-size: .85cqw; background: var(--pLav); color: var(--blue); }
  .track > span.done { background: var(--pGreen); color: var(--tGreen); border-color: var(--pGreen); }
  .track > span.done > i { background: var(--green) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'%3E%3Cpath d='M16 27 L23 34 L37 19' fill='none' stroke='white' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 100% no-repeat; }
  .track > span.now { background: var(--blue); color: var(--white); border-color: var(--blue); }
  .track > span.now > i { background: var(--white); color: var(--blue); }
  .track > span.todo { color: #6b6b9a; }
  .dots { display: inline-flex; gap: .25cqw; margin-left: .2cqw; }
  .dots b { width: .55cqw; height: .55cqw; border-radius: 50%; background: currentColor; opacity: .35; }
  .dots b.on { opacity: 1; }

  /* ── v3 : la cascade des temps ── */
  .bar, .seg, .ghost, .hl, .loss { position: absolute; }
  .bar { height: 4.4cqw; border-radius: .6cqw; display: flex; align-items: center; padding-left: 1.1cqw; font-weight: 700; font-size: 1.3cqw; white-space: nowrap; background: var(--blue); color: var(--white); overflow: hidden; }
  .bar.open { background: var(--card); color: var(--blue); border: .14cqw solid var(--blue); }
  .bar.utile { background: var(--green); color: var(--tGreen); }
  .bar i { position: absolute; top: 0; bottom: 0; background: var(--yellow); }
  .seg { height: 4.4cqw; border-radius: .6cqw; display: grid; place-items: center; font-weight: 700; font-size: 1.15cqw; white-space: nowrap; }
  .seg.plan { background: var(--pLav); color: var(--blue); outline: .14cqw dashed var(--blue); outline-offset: -.14cqw; }
  .seg.dispo { background: var(--red); color: var(--ink); }
  .seg.perf { background: var(--yellow); }
  .seg.qual { background: var(--violet); }
  .loss { height: 4.4cqw; display: flex; align-items: center; font-weight: 700; font-size: 1.1cqw; white-space: nowrap; }
  .ghost { height: 4.4cqw; border-radius: .6cqw; border: .14cqw dashed rgba(74, 74, 160, .35); color: rgba(74, 74, 160, .6); display: flex; align-items: center; padding-left: 1.1cqw; font-weight: 600; font-size: 1.2cqw; }
  .hl { border-radius: .9cqw; }

  /* ── v3 : fiches, fractions, astuces ── */
  .hd { position: absolute; left: 0; right: 0; top: 0; height: 6cqw; display: flex; align-items: center; gap: 1cqw; padding: 0 2cqw; border-radius: 1.15cqw 1.15cqw 0 0; }
  .sec { position: absolute; left: 2cqw; font-weight: 600; font-size: 1.05cqw; color: var(--blue); white-space: nowrap; }
  .frac { display: inline-grid; text-align: center; line-height: 1.15; vertical-align: middle; }
  .frac > span { display: block; white-space: nowrap; padding: 0 .25em; }
  .frac > span:first-child { border-bottom: .1em solid currentColor; padding-bottom: .1em; }
  .frac > span:last-child { padding-top: .1em; }
  .strike { position: relative; display: inline-block; }
  .strike::after { content: ""; position: absolute; left: -10%; right: -10%; top: 50%; height: .16em; border-radius: 1em; background: var(--red); transform: rotate(-18deg); }
  .eq { font-weight: 800; color: var(--blue); }
  .tip { position: absolute; left: 2cqw; right: 2cqw; border: .14cqw dashed var(--blue); border-radius: .9cqw; background: var(--white); padding: .8cqw 1cqw; display: flex; gap: .8cqw; align-items: flex-start; font-weight: 500; font-size: 1.15cqw; line-height: 1.4; }
  .tip .pill { font-size: 1.05cqw; padding: .35cqw .8cqw; background: var(--blue); color: var(--white); }
  .term { display: inline-flex; flex-direction: column; align-items: center; gap: .2cqw; }
  .term b { font-weight: 800; color: var(--ink); line-height: 1; }
  .term small { font-weight: 600; font-size: 1cqw; color: var(--blue); }
  .road { display: flex; align-items: center; gap: .6cqw; }
  .road .pill { font-size: 1.15cqw; padding: .35cqw .9cqw .35cqw .35cqw; background: var(--white); color: var(--blue); border: .1cqw solid var(--line); }
  .road .pill .b { width: 1.7cqw; height: 1.7cqw; font-size: .95cqw; }
  .chip.ped { background: var(--pLav); border-color: var(--pLav); }
  .chip.same { color: #6b6b85; border-color: #c9c9d9; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .note + .note { margin-top: -4px; }
  .vo { background: var(--pLav); border-radius: 10px; padding: 10px 12px; margin: 6px 0 10px; font-size: 13px; line-height: 1.6; }
  .vo s { color: #6b6b85; }
"""

PALETTE_RIBBON = ["#f16969", "#75bec0", "#aa76b2", "#8cc978", "#e0cf35", "#74a3d6"]
RIBBON = '<div class="ribbon6">' + "".join(f'<i style="background:{c}"></i>' for c in PALETTE_RIBBON) + "</div>"
LOGO = '<img class="logo" src="public/fichly-logo.png" alt="fichly">'


def arrow(size=1.8, color="#4a4aa0"):
    return (f'<svg viewBox="0 0 24 24" style="width:{size}cqw; height:{size}cqw; flex:none;">'
            f'<path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="{color}" stroke-width="3" '
            'stroke-linecap="round" stroke-linejoin="round"/></svg>')


def badge(kind, extra=""):
    return f'<span class="b {kind}"{extra}></span>'


def num(n, style=""):
    return f'<span class="b num" style="{style}">{n}</span>'


def pill(text, bg, fg, style="", mark=None):
    m = badge(f"{mark} sm") if mark else ""
    return f'<span class="pill" style="background:{bg}; color:{fg}; {style}">{m}{text}</span>'


def frac(n, d, size, color="var(--ink)", weight=700):
    return (f'<span class="frac" style="font-size:{size}cqw; color:{color}; font-weight:{weight};">'
            f"<span>{n}</span><span>{d}</span></span>")


# ── Fil d'enquête : les quatre étapes annoncées au cadre 02 ──
STEPS = ["Le temps", "Les 3 témoins", "Le verdict", "Fausses pistes", "Les cousins"]


def track(now, witness=None):
    out = []
    for i, s in enumerate(STEPS):
        if i < now:
            cls, mark = "done", ""
        elif i == now:
            cls, mark = "now", str(i + 1)
        else:
            cls, mark = "todo", str(i + 1)
        dots = ""
        if i == 1 and witness:
            dots = '<span class="dots">' + "".join(
                f'<b class="{"on" if k < witness else ""}"></b>' for k in range(3)) + "</span>"
        out.append(f'<span class="{cls}"><i>{mark}</i>{s}{dots}</span>')
    return '<div class="track">' + "".join(out) + "</div>"


# ── La cascade des temps (carte de gauche, cadres 03 à 07) ──
K, X0, H = 3.0, 2.0, 4.4                    # 1 h = 3 cqw ; barres de 4,4 cqw
TOPS = [4.6, 11.8, 19.0, 26.2, 33.4]
CARD_L, CARD_T, CARD_W, CARD_H = 3.2, 8.2, 57.0, 41.6
ROWS = [
    dict(txt="Temps d'ouverture · 16 h", val=16, cls="open"),
    dict(txt="Temps requis · 14 h", val=14, loss=(2, "plan", "2 h", "prévues", "var(--blue)")),
    dict(txt="Temps de fonctionnement · 12 h", val=12, loss=(2, "dispo", "−2 h", "arrêts", "var(--tRed)"),
         ghost="Témoin n° 1 · ?"),
    dict(txt="Temps net · 11 h 20", val=11 + 1 / 3, loss=(2 / 3, "perf", "", "−40 min · lenteurs", "var(--tYellow)"),
         ghost="Témoin n° 2 · ?"),
    dict(txt="Temps utile · 10 h 50", val=10 + 5 / 6, cls="utile",
         loss=(0.5, "qual", "", "−30 min · rebuts", "var(--ink)"), ghost="Témoin n° 3 · ?"),
]
TICKS = [(28.2, .3), (29.5, .5), (30.6, .25), (31.8, .4), (33.0, .3), (34.1, .45), (35.2, .3)]


def cascade(shown, hl=None, ticks=False, hide_labels=(), brace=False):
    hl = hl or {}
    p = ['<div class="lbl" style="position:absolute; left:2cqw; top:1.2cqw; font-size:1.15cqw; color:var(--blue);">'
         "La cascade des temps · une journée de la presse</div>"]
    for i, r in enumerate(ROWS):
        t = TOPS[i]
        if i < shown:
            if i in hl:
                p.append(f'<div class="hl" style="left:.8cqw; top:{t - .7:.2f}cqw; width:55.4cqw; '
                         f'height:{H + 1.4:.2f}cqw; background:{hl[i]};"></div>')
            w = r["val"] * K
            cls = r.get("cls", "")
            inner = r["txt"]
            if ticks and i == 2:
                inner += "".join(f'<i style="left:{x}cqw; width:{wd}cqw;"></i>' for x, wd in TICKS)
            bw = w - (.1 if "loss" in r else 0)
            p.append(f'<div class="bar {cls}" style="left:{X0}cqw; top:{t}cqw; width:{bw:.2f}cqw;">{inner}</div>')
            if "loss" in r:
                h, scls, inside, label, color = r["loss"]
                p.append(f'<div class="seg {scls}" style="left:{X0 + w + .1:.2f}cqw; top:{t}cqw; '
                         f'width:{h * K - .2:.2f}cqw;">{inside}</div>')
                if i not in hide_labels:
                    p.append(f'<div class="loss" style="left:{X0 + (r["val"] + h) * K + .7:.2f}cqw; top:{t}cqw; '
                             f'color:{color};">{label}</div>')
        elif "ghost" in r:
            p.append(f'<div class="ghost" style="left:{X0}cqw; top:{t}cqw; width:{16 * K:.2f}cqw;">{r["ghost"]}</div>')
    if brace:
        # écart entre le temps requis (14 h) et le temps utile (10 h 50) : les 3 h 10
        xr, xu = (X0 + 14 * K) * 10, (X0 + (10 + 5 / 6) * K) * 10
        yb = (TOPS[4] + H + .8) * 10
        p.append(f'<svg style="position:absolute; left:0; top:0; width:{CARD_W}cqw; height:{CARD_H}cqw;" '
                 f'viewBox="0 0 {CARD_W * 10:.0f} {CARD_H * 10:.0f}">'
                 f'<path d="M{xr:.1f} {(TOPS[1] + H) * 10:.1f} V{yb:.1f}" stroke="#4a4aa0" stroke-width="2.6" '
                 'stroke-dasharray="7 6" fill="none"/>'
                 f'<path d="M{xu:.1f} {(TOPS[4] + H) * 10:.1f} V{yb:.1f} H{xr:.1f} V{yb - 8:.1f} '
                 f'M{(xu + xr) / 2:.1f} {yb:.1f} v7" stroke="#a83434" stroke-width="3.4" fill="none" '
                 'stroke-linecap="round" stroke-linejoin="round"/></svg>')
        p.append(f'<div class="lbl" style="position:absolute; left:{(xu + xr) / 20 - 5.2:.2f}cqw; top:{TOPS[4] + H + 1.9:.2f}cqw; '
                 'font-size:1.15cqw; font-weight:700; color:var(--tRed);">3 h 10 perdues</div>')
    return (f'<div class="card" style="left:{CARD_L}cqw; top:{CARD_T}cqw; width:{CARD_W}cqw; height:{CARD_H}cqw;">'
            + "".join(p) + "</div>")


# ── La fiche de droite (cadres 03 à 07) ──
PANEL = 'left:63.4cqw; top:8.2cqw; width:33.4cqw; height:41.6cqw;'


def panel(*children):
    return f'<div class="card" style="{PANEL}">' + "".join(children) + "</div>"


def hd(bg, mark, title, fg="var(--ink)"):
    return f'<div class="hd" style="background:{bg};">{mark}<span class="ttl" style="color:{fg};">{title}</span></div>'


def sec(top, text):
    return f'<div class="sec" style="top:{top}cqw;">{text}</div>'


def at(top, html, left=2, extra=""):
    return f'<div style="position:absolute; left:{left}cqw; top:{top}cqw; {extra}">{html}</div>'


def causes(top, items, bg, fg):
    return at(top, "".join(pill(c, bg, fg, "font-size:1.25cqw;", "ko") for c in items),
              extra="right:2cqw; display:flex; flex-wrap:wrap; gap:.6cqw;")


def calc(top, words, nums):
    return at(top, frac(*words, 1.15, "var(--ink)", 600) + '<span class="eq" style="font-size:2cqw;">=</span>'
              + frac(*nums, 2.1), extra="display:flex; align-items:center; gap:.8cqw;")


def result(top, text, color):
    return at(top, f'<span class="stat" style="font-size:5.4cqw; color:{color};">'
                   f'<span style="font-size:.55em; color:var(--blue); vertical-align:.2em;">= </span>{text}</span>')


def nb(text):
    """Espaces insécables : un nombre reste collé à son unité, « = » au nombre qui suit."""
    return re.sub(r"(\d) ", "\\1\u00a0", text).replace(" = ", "\u00a0=\u00a0")


def tip(top, label, text):
    text = nb(text)
    return f'<div class="tip" style="top:{top}cqw;"><span class="pill">{label}</span><span>{text}</span></div>'


CLOCK = ('<span class="b num"><svg viewBox="0 0 24 24" style="width:62%;"><circle cx="12" cy="12" r="8.5" fill="none" '
         'stroke="#fff" stroke-width="2.6"/><path d="M12 7.5V12l3.2 2" fill="none" stroke="#fff" stroke-width="2.6" '
         'stroke-linecap="round"/></svg></span>')


# ── Cadres ──
F01 = r"""      <div class="eyebrow">Dossier n° 01 · Presse, ligne 2</div>
      <div class="t1" style="left:3.2cqw; top:8.6cqw;">Il manque plus de</div>
      <div class="band" style="left:2.4cqw; top:14cqw;">3 heures.</div>
      <div style="left:3.2cqw; top:23.6cqw; font-weight:700; font-size:2.6cqw; color:var(--blue);">Où sont-elles passées ?</div>
      <div class="pill" style="left:3.2cqw; top:29.6cqw; background:var(--pLav); color:var(--blue);">2 équipes · 16 h d'ouverture</div>
      <div class="card" style="left:60cqw; top:7.5cqw; width:32cqw; height:36cqw; transform:rotate(3deg); padding:1.6cqw;">
        <div style="position:relative; height:26cqw; background:var(--pLav); border-radius:.8cqw; display:grid; place-items:center;">
          <svg viewBox="0 0 180 124" style="width:62%;"><rect width="180" height="124" rx="16" fill="#4a4aa0"/><rect x="16" y="16" width="104" height="40" rx="8" fill="#fff"/><rect x="26" y="30" width="84" height="12" rx="6" fill="#8cc978"/><circle cx="148" cy="26" r="8" fill="#74a3d6"/><circle cx="148" cy="50" r="8" fill="#f16969"/><rect x="16" y="72" width="148" height="36" rx="8" fill="#fff" fill-opacity=".14"/><rect x="30" y="80" width="18" height="20" rx="4" fill="#fff" fill-opacity=".35"/><rect x="64" y="80" width="18" height="20" rx="4" fill="#fff" fill-opacity=".35"/><rect x="98" y="80" width="18" height="20" rx="4" fill="#fff" fill-opacity=".35"/><rect x="132" y="80" width="18" height="20" rx="4" fill="#fff" fill-opacity=".35"/></svg>
        </div>
        <div style="margin-top:1.4cqw; font-weight:700; font-size:1.5cqw; color:var(--ink);">Pièce à conviction : la presse</div>
      </div>
      <div style="left:75cqw; top:6.4cqw; width:1.8cqw; height:1.8cqw; border-radius:50%; background:var(--red);"></div>
      <svg style="left:0; top:0; width:100cqw; height:56.25cqw;" viewBox="0 0 1920 1080"><path d="M1458 140 C 1300 120, 1040 250, 870 320" fill="none" stroke="#f16969" stroke-width="4" stroke-linecap="round"/></svg>
      """
F12 = r"""      <div class="eyebrow">Et maintenant ?</div>
      <div class="t1" style="left:3.2cqw; top:8.6cqw;">Pour aller plus loin,</div>
      <div class="band" style="left:2.4cqw; top:14cqw;">formez-vous.</div>
      <!-- carte formation -->
      <div class="card" style="left:3.2cqw; top:24cqw; width:45cqw; height:23cqw;">
        <span class="pill" style="position:absolute; left:2cqw; top:2cqw; background:var(--blue); color:var(--white);">Formation</span>
        <div class="ttl" style="position:absolute; left:2cqw; top:6cqw; font-size:2.3cqw;">Lean Management</div>
        <div class="ttl" style="position:absolute; left:2cqw; top:9cqw; font-size:2.3cqw; color:var(--tGreen);">Green Belt</div>
        <span class="pill" style="position:absolute; left:2cqw; top:14.6cqw; background:var(--pGreen); color:var(--tGreen); font-size:1.6cqw;"><span class="b ok sm"></span>Éligible au CPF</span>
        <!-- ceinture verte -->
        <svg style="position:absolute; right:2cqw; top:5cqw; width:13cqw;" viewBox="0 0 260 200"><rect x="0" y="70" width="260" height="56" rx="14" fill="#8cc978"/><rect x="104" y="56" width="52" height="84" rx="12" fill="#8cc978" stroke="#fdfdfb" stroke-width="8"/><path d="M118 140 L 96 196 L 124 186 L 132 140 Z" fill="#8cc978"/><path d="M142 140 L 164 196 L 136 186 L 128 140 Z" fill="#8cc978"/></svg>
      </div>
      <!-- carte decks -->
      <div class="card" style="left:51.4cqw; top:24cqw; width:45cqw; height:23cqw;">
        <span class="pill" style="position:absolute; left:2cqw; top:2cqw; background:var(--blue); color:var(--white);">Decks de fiches</span>
        <div class="ttl" style="position:absolute; left:2cqw; top:6cqw; font-size:2.1cqw;">40 outils du Lean</div>
        <div class="ttl" style="position:absolute; left:2cqw; top:9cqw; font-size:2.1cqw; color:var(--blue);">à portée de main</div>
        <span class="pill" style="position:absolute; left:2cqw; top:14.6cqw; background:var(--pLav); color:var(--blue); font-size:1.5cqw;">+ les guides en 20 fiches</span>
        <img src="public/guides-fichly.png" alt="Decks de fiches Fichly" style="position:absolute; right:1.4cqw; bottom:1.6cqw; width:17cqw;">
      </div>
      <div class="lbl" style="left:3.2cqw; top:49.6cqw; font-size:1.5cqw; color:var(--blue);">Tous les liens en description</div>
      """


def f02():
    road = ('<div class="road" style="left:3.2cqw; top:47.2cqw;">'
            '<span class="lbl" style="font-size:1.15cqw; color:var(--blue);">Le plan :</span>'
            + arrow(1.4).join(f'<span class="pill">{num(i + 1)}{s}</span>' for i, s in enumerate(STEPS))
            + "</div>")
    band = ('<div class="bandp row" style="left:3.2cqw; top:{t}cqw; width:52cqw; height:5.6cqw; padding:0 1.6cqw; '
            'background:{bg};">{inner}</div>')
    return "".join([
        '<div class="eyebrow">L\'outil d\'enquête</div>',
        '<div class="t1" style="left:3.2cqw; top:8.6cqw;">Le TRS,</div>',
        '<div class="band" style="left:2.4cqw; top:14cqw;">l\'outil d\'enquête.</div>',
        '<div class="chapeau" style="left:3.2cqw; top:22.2cqw;">Taux de rendement synthétique</div>',
        band.format(t=27, bg="var(--pRed)", inner=badge("ko") + '<span style="font-weight:700; font-size:1.8cqw; color:var(--tRed);">Une note des équipes</span>'),
        band.format(t=33.4, bg="var(--pGreen)", inner=badge("ok") + '<span style="font-weight:700; font-size:1.8cqw; color:var(--tGreen);">Le relevé de ce qui s\'est perdu</span>'),
        band.format(t=39.8, bg="var(--pLav)", inner=pill("Et surtout", "var(--blue)", "var(--white)") + '<span style="font-weight:700; font-size:1.8cqw; color:var(--ink);">il dit où chercher.</span>'),
        # en une image : l'écart entre deux barres, aperçu de la cascade
        '<div class="card" style="left:60cqw; top:21cqw; width:33cqw; height:22.6cqw;">',
        '<div class="bar" style="left:2.4cqw; top:2.4cqw; width:28.2cqw; height:3.8cqw; font-size:1.15cqw;">Ce que la machine devait produire</div>',
        '<div style="position:absolute; right:2.4cqw; top:7.4cqw;">' + pill("Tout ce qui s'est perdu", "var(--pRed)", "var(--tRed)", "font-size:1.2cqw;", "ko") + "</div>",
        '<div class="bar utile" style="left:2.4cqw; top:11.4cqw; width:18.6cqw; height:3.8cqw; font-size:1.15cqw;">Les pièces bonnes</div>',
        '<div style="position:absolute; left:21.3cqw; top:11.4cqw; width:9.3cqw; height:3.8cqw; border-radius:.6cqw; background:var(--pRed); outline:.14cqw dashed var(--red); outline-offset:-.14cqw;"></div>',
        '<div class="lbl" style="position:absolute; left:2.4cqw; top:17.6cqw; font-size:1.25cqw; color:var(--blue);">Le TRS mesure cet écart, et dit d\'où il vient.</div>',
        "</div>",
        road,
    ])


def f03():
    eq = ('<span class="term"><b style="font-size:2.6cqw;">16 h</b><small>ouverture</small></span>'
          '<span class="eq" style="font-size:2.4cqw; margin-top:-1.4cqw;">−</span>'
          '<span class="term"><b style="font-size:2.6cqw;">2 h</b><small>prévues</small></span>'
          '<span class="eq" style="font-size:2.4cqw; margin-top:-1.4cqw;">=</span>'
          '<span class="term"><b style="font-size:2.6cqw; color:var(--blue);">14 h</b><small>requises</small></span>')
    return "".join([
        '<div class="eyebrow">Pièce n° 1 · Le temps</div>', track(0),
        cascade(2, hl={1: "var(--pLav)"}),
        panel(hd("var(--blue)", CLOCK.replace("b num", "b num\" style=\"background:var(--white);").replace("#fff", "#4a4aa0"),
                 "Le temps requis", "var(--white)"),
              sec(7.4, "Le calcul"),
              at(9.4, eq, extra="display:flex; align-items:center; gap:.9cqw;"),
              at(15.4, pill("Maintenance prévue : on la retire", "var(--pLav)", "var(--blue)", "font-size:1.2cqw;")),
              at(19.4, '<span class="ttl" style="font-size:1.8cqw;">Le dénominateur du TRS</span>'),
              at(22.4, "La durée où la machine devait produire. Tout part de là.",
                 extra="right:2cqw; font-weight:500; font-size:1.3cqw; line-height:1.45;"),
              tip(28.6, "À suivre", "Chaque témoin va retirer sa part de temps perdu.")),
    ])


def witness(n, eyebrow, pastel, tone, title, seen, words, nums, value, loss, box, stat=None):
    return "".join([
        f'<div class="eyebrow">{eyebrow}</div>', track(1, n),
        cascade(2 + n, hl={1 + n: pastel}, ticks=(n == 2)),
        panel(hd(pastel, num(n), title),
              sec(7.4, "Ce qu'il a vu"),
              causes(9.2, seen, pastel, tone),
              sec(15.6, "Le calcul, en mots puis en chiffres"),
              calc(17.2, words, nums),
              result(23.2, value, stat or tone),
              at(30.2, pill(f"Perte : {loss}", pastel, tone, "font-size:1.3cqw;")),
              tip(33.6, *box)),
    ])


def f04():
    return witness(1, "Témoin n° 1", "var(--pRed)", "var(--tRed)", "Disponibilité",
                   ["Pannes", "Manques matière", "Réglages imprévus"],
                   ("Temps de fonctionnement", "Temps requis"), ("12 h", "14 h"), "85,7 %", "2 h",
                   ("En clair", "Le temps où la machine devait tourner… et ne tournait pas."))


def f05():
    return witness(2, "Témoin n° 2", "var(--pYellow)", "var(--tYellow)", "Performance",
                   ["Micro-arrêts", "Cadence lente"],
                   ("Pièces produites", "Pièces attendues"), ("680", "720"), "94,4 %", "40 min",
                   ("Astuce", "À 60 pièces/h, 1 pièce = 1 minute. Les 40 pièces manquantes = 40 min."))


def f06():
    return witness(3, "Témoin n° 3", "var(--pLav)", "var(--ink)", "Qualité",
                   ["Rebuts", "Retouches"],
                   ("Pièces bonnes", "Pièces produites"), ("650", "680"), "95,6 %", "30 min",
                   ("Astuce", "Même règle : 30 pièces non conformes = 30 min. Une retouche consomme le temps deux fois."),
                   stat="var(--violet)")


def f07():
    x = '<span class="eq" style="font-size:1.8cqw;">×</span>'
    rates = (pill("85,7 %", "var(--pRed)", "var(--tRed)", "font-size:1.3cqw;") + x
             + pill("94,4 %", "var(--pYellow)", "var(--tYellow)", "font-size:1.3cqw;") + x
             + pill("95,6 %", "var(--pLav)", "var(--ink)", "font-size:1.3cqw;"))
    fr = (frac('<span class="strike">12 h</span>', "14 h", 1.45, "var(--tRed)") + x
          + frac('<span class="strike">11 h 20</span>', '<span class="strike">12 h</span>', 1.45, "var(--tYellow)") + x
          + frac("10 h 50", '<span class="strike">11 h 20</span>', 1.45, "var(--ink)"))
    return "".join([
        '<div class="eyebrow">Reconstitution</div>', track(2),
        cascade(5, hl={1: "var(--pLav)", 4: "var(--pGreen)"}, hide_labels=(3, 4), brace=True),
        panel(hd("var(--blue)", num("×", "background:var(--white); color:var(--blue);"), "On multiplie", "var(--white)"),
              sec(7.4, "Les 3 témoins"),
              at(9.2, rates, extra="display:flex; align-items:center; gap:.5cqw;"),
              sec(13.4, "Les mêmes, en temps : ça se simplifie"),
              at(15.2, fr, extra="display:flex; align-items:center; gap:.5cqw;"),
              at(21.4, '<span class="eq" style="font-size:2cqw;">=</span>' + frac("10 h 50", "14 h", 2.1, "var(--tGreen)")
                 + frac("temps utile", "temps requis", 1.05, "var(--blue)", 600),
                 extra="display:flex; align-items:center; gap:.8cqw;"),
              at(28.0, '<span class="band" style="position:static; display:inline-block; font-size:3.6cqw;">TRS = 77 %</span>', left=1.6),
              at(34.6, pill("Les 3 h 10 sont retrouvées", "var(--pGreen)", "var(--tGreen)", "font-size:1.3cqw;", "ok"))),
    ])


def f08():
    rows = [("Disponibilité", "var(--red)", "var(--tRed)", 120, "2 h"),
            ("Performance", "var(--yellow)", "var(--tYellow)", 40, "40 min"),
            ("Qualité", "var(--violet)", "var(--ink)", 30, "30 min")]
    k = 40 / 120
    p = []
    for i, (name, col, tone, mins, lab) in enumerate(rows):
        t = 2.4 + i * 6.2
        p.append(f'<div class="row" style="position:absolute; left:2cqw; top:{t + .9:.1f}cqw;">{num(i + 1)}'
                 f'<span class="ttl" style="font-size:1.6cqw;">{name}</span></div>')
        p.append(f'<div class="bar" style="left:22cqw; top:{t}cqw; width:{mins * k:.2f}cqw; background:{col};"></div>')
        p.append(f'<div class="stat" style="position:absolute; left:{22 + mins * k + 1:.2f}cqw; top:{t + .9:.1f}cqw; '
                 f'font-size:2.4cqw; color:{tone};">{lab}</div>')
    p.append('<div style="position:absolute; left:1cqw; top:1.2cqw; width:68.4cqw; height:6.8cqw; '
             'border:.3cqw solid var(--blue); border-radius:1.1cqw;"></div>')
    p.append(at(2.6, pill("Premier chantier", "var(--blue)", "var(--white)", "font-size:1.4cqw;"), left=71.4))
    p.append('<div class="lbl" style="position:absolute; left:71.4cqw; top:7.4cqw; font-size:1.05cqw; color:var(--blue);">Ce qu\'a vu le témoin n° 1 :</div>')
    p.append(at(9.2, "".join(pill(c, "var(--pRed)", "var(--tRed)", "font-size:1.15cqw;") for c in
                             ["Pannes", "Réglages imprévus", "Manques matière"]),
                left=71.4, extra="display:flex; flex-direction:column; align-items:flex-start; gap:.5cqw;"))
    p.append('<div class="lbl" style="position:absolute; left:2cqw; top:21.2cqw; font-size:1.3cqw; font-weight:500;">'
             '2 h + 40 min + 30 min = <b style="color:var(--blue); font-weight:800;">3 h 10</b> : '
             'les heures s\'additionnent, les pourcentages non.</div>')
    return "".join([
        '<div class="eyebrow">Le vrai verdict</div>', track(2),
        '<div class="t1" style="left:3.2cqw; top:8.6cqw;">Où sont passées</div>',
        '<div class="band" style="left:2.4cqw; top:14cqw;">les 3 h 10 ?</div>',
        '<div style="left:31cqw; top:15.7cqw;">' + pill(num("?", "width:2.2cqw; height:2.2cqw; background:var(--white); color:var(--blue);") + "À votre avis ?",
                                                          "var(--pLav)", "var(--blue)", "font-size:1.8cqw; padding:.5cqw 1.4cqw .5cqw .5cqw;") + "</div>",
        '<div class="card" style="left:3.2cqw; top:24cqw; width:93.6cqw; height:24.6cqw;">' + "".join(p) + "</div>",
    ])


def f09():
    rule = lambda t: (f'<div class="row" style="margin-top:1.1cqw;">{badge("ko")}'
                      f'<span style="font-weight:700; font-size:1.8cqw; color:var(--tRed);">{t}</span></div>')
    return "".join([
        '<div class="eyebrow">Fausse piste n° 1</div>', track(3),
        '<div class="t1" style="left:3.2cqw; top:8.6cqw;">Le « bon TRS »</div>',
        '<div class="band" style="left:2.4cqw; top:14cqw;">n\'existe pas.</div>',
        '<div class="bandp" style="left:3.2cqw; top:25cqw; width:42cqw; height:24cqw; background:var(--pRed); padding:1.8cqw 2cqw;">'
        + pill("Idée reçue : un seuil universel", "var(--white)", "var(--tRed)", "font-size:1.35cqw;", "ko")
        + rule("&lt; 50 % : mauvais") + rule("60 à 70 % : correct") + rule("&gt; 85 % : excellent")
        + '<div style="margin-top:2cqw; font-weight:500; font-size:1.35cqw; line-height:1.4;"><b style="color:var(--tRed);">Pourquoi ?</b> '
          "Chaque site a ses règles de calcul : le même atelier peut afficher 68 % ou 85 %.</div></div>",
        '<div class="card" style="left:48.6cqw; top:25cqw; width:44cqw; height:24cqw;">',
        at(1.6, pill("La bonne comparaison", "var(--pGreen)", "var(--tGreen)", "font-size:1.35cqw;", "ok")),
        '<div class="ttl" style="position:absolute; left:2cqw; top:4.9cqw; font-size:1.7cqw;">Votre ligne, contre elle-même</div>',
        '<svg style="position:absolute; left:2cqw; top:8.2cqw; width:40cqw; height:8.6cqw;" viewBox="0 0 400 86" preserveAspectRatio="none">'
        '<line x1="0" y1="84" x2="400" y2="84" stroke="#e2e2ee" stroke-width="3"/>'
        '<polyline points="12,78 75,72 140,66 205,52 270,42 335,28 388,14" fill="none" stroke="#4a4aa0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
        '<circle cx="12" cy="78" r="8" fill="#4a4aa0"/><circle cx="388" cy="14" r="9" fill="#8cc978"/></svg>',
        '<div class="stat" style="position:absolute; left:2cqw; top:17.3cqw; font-size:1.9cqw; color:var(--blue);">61 %</div>',
        '<div class="lbl" style="position:absolute; left:18cqw; top:17.6cqw; font-size:1.1cqw; color:var(--blue);">en six mois</div>',
        '<div class="stat" style="position:absolute; right:2cqw; top:4.6cqw; font-size:1.9cqw; color:var(--tGreen);">68 %</div>',
        at(20.9, pill("À règles de calcul constantes", "var(--pGreen)", "var(--tGreen)", "font-size:1.3cqw;", "ok")),
        "</div>",
    ])


def f10():
    k = 2.2

    def col(x, head, req_h, moved, pct, band):
        p = [at(1.8, head, left=x)]
        req = f'<div class="bar" style="left:{x}cqw; top:5.4cqw; width:{req_h * k - .1:.2f}cqw; height:3.8cqw; font-size:1.2cqw;">Temps requis · {req_h} h</div>'
        p.append(req)
        sx = x + req_h * k + .1
        if moved:
            p.append(f'<div class="seg plan" style="left:{sx:.2f}cqw; top:5.4cqw; width:{k - .2:.2f}cqw; height:3.8cqw;"></div>')
            p.append(f'<div class="loss" style="left:{sx + k + .4:.2f}cqw; top:5.4cqw; height:3.8cqw; color:var(--blue);">« planifiée »</div>')
        else:
            p.append(f'<div class="bar" style="left:{sx - k:.2f}cqw; top:5.4cqw; width:{k - .2:.2f}cqw; height:3.8cqw; background:var(--red); padding:0;"></div>')
            p.append(f'<div class="loss" style="left:{sx + .4:.2f}cqw; top:5.4cqw; height:3.8cqw; color:var(--tRed);">1 h de panne</div>')
        p.append(f'<div class="bar utile" style="left:{x}cqw; top:10.2cqw; width:{(10 + 5 / 6) * k:.2f}cqw; height:3.8cqw; font-size:1.2cqw;">Temps utile · 10 h 50</div>')
        if moved:
            p.append(f'<div class="loss" style="left:{x + (10 + 5 / 6) * k + .8:.2f}cqw; top:10.2cqw; height:3.8cqw; color:var(--tGreen); gap:.5cqw;">{badge("ok sm")}inchangé</div>')
        stat = (f'<span class="band" style="position:static; display:inline-block; font-size:3.2cqw;">{pct}</span>' if band
                else f'<span class="stat" style="font-size:3.2cqw; color:var(--ink);">{pct}</span>')
        p.append(at(15.4, f'<span class="txt" style="font-weight:700;">10 h 50 ÷ {req_h} h =</span>' + stat, left=x,
                    extra="display:flex; align-items:center; gap:1cqw;"))
        return "".join(p)

    return "".join([
        '<div class="eyebrow">Fausse piste n° 2</div>', track(3),
        '<div class="t1" style="left:3.2cqw; top:8.6cqw;">Le tour de</div>',
        '<div class="band" style="left:2.4cqw; top:14cqw;">passe-passe.</div>',
        '<div class="card" style="left:3.2cqw; top:23.4cqw; width:93.6cqw; height:25.4cqw;">',
        col(2, pill("Avant", "var(--pLav)", "var(--blue)", "font-size:1.3cqw;"), 14, False, "77 %", False),
        at(8.4, arrow(3), left=44.6),
        col(50, pill("Après : la panne est requalifiée", "var(--pRed)", "var(--tRed)", "font-size:1.3cqw;"), 13, True, "83 %", True),
        at(21, pill("Même machine : 4 h d'arrêt, 650 pièces bonnes. Seul le dénominateur a bougé.", "var(--pRed)", "var(--tRed)", "font-size:1.35cqw;", "ko")),
        "</div>",
    ])


def f10b():
    k, x0 = 2.0, 19.0                      # 1 h = 2 cqw ; 24 h = 48 cqw
    utile = (10 + 5 / 6) * k
    rows = [("TRS", "Synthétique · OEE", 14, "Temps requis", [], "77 %", True),
            ("TRG", "Global · OOE", 16, "Temps d'ouverture", [(14, 2, "")], "68 %", False),
            ("TRE", "Économique · TEEP", 24, "Temps total", [(14, 2, ""), (16, 8, "atelier fermé")], "45 %", False)]
    p = []
    for i, (sig, sub, den, _name, extra, pct, band) in enumerate(rows):
        t = 2.6 + i * 6.2
        p.append(f'<div style="position:absolute; left:2cqw; top:{t - .2:.1f}cqw; line-height:1.1;">'
                 f'<div class="stat" style="font-size:2.3cqw; color:var(--blue);">{sig}</div>'
                 f'<div class="lbl" style="font-size:1cqw; margin-top:.25cqw; color:var(--blue);">{sub}</div></div>')
        p.append(f'<div class="bar open" style="left:{x0}cqw; top:{t}cqw; width:{14 * k:.2f}cqw; padding:0;"></div>')
        for start, h, lab in extra:
            p.append(f'<div class="seg plan" style="left:{x0 + start * k + .1:.2f}cqw; top:{t}cqw; width:{h * k - .2:.2f}cqw; '
                     f'font-size:1.05cqw;">{lab}</div>')
        p.append(f'<div class="bar utile" style="left:{x0}cqw; top:{t}cqw; width:{utile:.2f}cqw; font-size:1.2cqw;">10 h 50</div>')
        p.append(f'<div class="loss" style="left:69.4cqw; top:{t}cqw; color:var(--ink); font-size:1.4cqw;">÷ {den} h</div>')
        res = (f'<span class="band" style="position:static; display:inline-block; font-size:2.6cqw; padding:.3cqw .9cqw .5cqw;">{pct}</span>'
               if band else f'<span class="stat" style="font-size:2.6cqw; color:var(--ink);">{pct}</span>')
        p.append(at(t + .2, res, left=77.4))
    legend = ('<div class="row" style="position:absolute; left:2cqw; top:21.2cqw; gap:1.4cqw; font-weight:600; font-size:1.15cqw;">'
              '<span class="row" style="gap:.5cqw;"><i style="display:inline-block; width:2.2cqw; height:1.3cqw; border-radius:.3cqw; background:var(--green);"></i>Temps utile, le même partout</span>'
              '<span class="row" style="gap:.5cqw;"><i style="display:inline-block; width:2.2cqw; height:1.3cqw; border-radius:.3cqw; border:.14cqw solid var(--blue);"></i>Temps requis</span>'
              '<span class="row" style="gap:.5cqw;"><i style="display:inline-block; width:2.2cqw; height:1.3cqw; border-radius:.3cqw; background:var(--pLav); outline:.14cqw dashed var(--blue); outline-offset:-.14cqw;"></i>Arrêts planifiés, puis atelier fermé</span>'
              '</div>')
    return "".join([
        '<div class="eyebrow">Les cousins du TRS</div>', track(4),
        '<div class="t1" style="left:3.2cqw; top:8.6cqw;">Même temps utile,</div>',
        '<div class="band" style="left:2.4cqw; top:14cqw;">trois dénominateurs.</div>',
        '<div style="left:66cqw; top:15.4cqw;">' + pill("TRE ≤ TRG ≤ TRS", "var(--pLav)", "var(--blue)", "font-size:1.6cqw;") + "</div>",
        '<div class="card" style="left:3.2cqw; top:23.4cqw; width:93.6cqw; height:25.6cqw;">' + "".join(p) + legend + "</div>",
    ])


def f11():
    pts = [("TRS = temps utile <span style=\"color:var(--blue)\">÷ temps requis</span>", ""),
           ("= <span style=\"color:var(--tRed)\">Disponibilité</span> × <span style=\"color:var(--tYellow)\">Performance</span>"
            " × <span style=\"color:var(--violet)\">Qualité</span>", ""),
           ("Il ne juge pas les équipes : <span style=\"color:var(--blue)\">il dit où chercher.</span>", "")]
    rows = "".join(f'<div class="row" style="position:absolute; left:2.4cqw; top:{5.6 + i * 4.6:.1f}cqw;">{num(i + 1)}'
                   f'<span style="font-weight:700; font-size:1.9cqw; color:var(--ink); white-space:nowrap;">{t}</span></div>'
                   for i, (t, _) in enumerate(pts))
    machine = ('<svg viewBox="0 0 180 124" style="width:100%;"><rect width="180" height="124" rx="16" fill="#4a4aa0"/>'
               '<rect x="16" y="16" width="104" height="40" rx="8" fill="#fff"/><rect x="26" y="30" width="84" height="12" rx="6" fill="#8cc978"/>'
               '<circle cx="148" cy="26" r="8" fill="#74a3d6"/><circle cx="148" cy="50" r="8" fill="#8cc978"/>'
               '<rect x="16" y="72" width="148" height="36" rx="8" fill="#fff" fill-opacity=".14"/>'
               '<rect x="30" y="80" width="18" height="20" rx="4" fill="#fff" fill-opacity=".35"/><rect x="64" y="80" width="18" height="20" rx="4" fill="#fff" fill-opacity=".35"/>'
               '<rect x="98" y="80" width="18" height="20" rx="4" fill="#fff" fill-opacity=".35"/><rect x="132" y="80" width="18" height="20" rx="4" fill="#fff" fill-opacity=".35"/></svg>')
    return "".join([
        '<div class="eyebrow">Fin de l\'enquête</div>', track(5),
        '<div class="t1" style="left:3.2cqw; top:9cqw; font-size:6.4cqw;">Affaire</div>',
        '<div class="band" style="left:2.4cqw; top:16.4cqw; font-size:6.4cqw; border-radius:1cqw;">classée.</div>',
        '<div class="card" style="left:3.2cqw; top:29cqw; width:66cqw; height:20cqw;">',
        at(1.8, pill("À retenir", "var(--blue)", "var(--white)"), left=2.4),
        rows, "</div>",
        f'<div style="left:74cqw; top:17cqw; width:20cqw;">{machine}</div>',
        '<span class="b ok" style="left:90cqw; top:15cqw; width:5cqw; height:5cqw;"></span>',
    ])


# ── Fiches de la planche ──
CELLS = [
    ("Acte I · Le mystère", [
        ("frame-01", F01, "01 · L'affaire", "0–12 s",
         "<b>Ce qui bouge d'abord :</b> gros plan sur la machine du polaroïd, puis un seul recul découvre le tableau et la punaise rouge. « Il manque plus de » s'écrit, le bandeau « 3 heures. » s'ouvre de gauche à droite, puis le fil rouge relie la photo au bandeau. Fondu vers 02.",
         None, ["entrée : cut"], "inchangé"),
        ("frame-02", None, "02 · L'outil", "12–29 s",
         "<b>Ce qui bouge d'abord :</b> le titre et son bandeau, puis les trois bandes sur leurs mots (✗ « note », ✓ « relevé », « il dit où chercher »). À droite, sur « entre… et », deux barres se posent : ce que la machine devait produire, puis les pièces bonnes ; l'écart se hachure en rouge. En fin de cadre, le plan de l'enquête se pose en quatre étapes.",
         "<b>Pourquoi :</b> l'écart entre deux barres annonce la cascade avant qu'on la détaille, et le plan dit au spectateur où l'on va. Ce plan revient ensuite en haut à droite de chaque cadre (le fil d'enquête).",
         ["entrée : crossfade", "procédé : annoncer le plan"], None),
    ]),
    ("Acte II · Le dossier et les trois témoins", [
        ("frame-03", None, "03 · Le temps requis", "29–46 s",
         "<b>Ce qui bouge d'abord :</b> la barre de 16 h se pose, la tranche de 2 h « prévues » se détache en pointillés, et la barre de 14 h se forme dessous sur « il en reste quatorze ». Les trois lignes à venir attendent en pointillés. À droite, 16 h − 2 h = 14 h s'écrit terme par terme.",
         "<b>Pourquoi :</b> un seul schéma pour toute l'enquête. Le spectateur voit dès maintenant la place des trois témoins : chacun va ajouter une marche.",
         ["entrée : push-slide left", "procédé : un schéma qui se construit"], None),
        ("frame-04", None, "04 · Disponibilité", "46–60 s",
         "<b>Ce qui bouge d'abord :</b> la ligne 3 s'allume en rouge pâle. Les trois causes se posent sur leur nom, la tranche « −2 h » se détache sur « deux heures d'arrêts subis » et la barre de 12 h se forme. La fraction s'écrit en mots, puis en chiffres, et 85,7 % monte.",
         "<b>Pourquoi :</b> la formule est montrée en mots avant les chiffres. La pilule « Perte : 2 h » a la couleur de la marche dans la cascade.",
         ["entrée : push-slide left", "procédé : en mots, puis en chiffres"], None),
        ("frame-05", None, "05 · Performance", "60–79 s",
         "<b>Ce qui bouge d'abord :</b> sur « micro-arrêts de quelques secondes », des encoches jaunes apparaissent dans la barre de 12 h : la perte se cache dans le temps où la machine tourne. Puis la ligne 4 se forme, 680 pièces sur 720, 94,4 %. L'astuce arrive en dernier.",
         "<b>Pourquoi :</b> l'astuce « 1 pièce = 1 minute » convertit les pièces en temps. La cascade garde une seule unité, l'heure.",
         ["entrée : push-slide left", "procédé : une seule unité"], None),
        ("frame-06", None, "06 · Qualité", "79–95 s",
         "<b>Ce qui bouge d'abord :</b> la ligne 5 se forme : la tranche violette de 30 min se détache et la barre verte du temps utile se pose, seule partie qui a donné des pièces bonnes. 650 sur 680, 95,6 %.",
         "<b>Pourquoi :</b> même règle qu'au cadre 05 et même place pour chaque élément de la fiche : le spectateur sait où regarder.",
         ["entrée : push-slide left", "procédé : même fiche pour chaque témoin"], None),
    ]),
    ("Acte III · Le verdict", [
        ("frame-07", None, "07 · Reconstitution", "95–112 s",
         "<b>Ce qui bouge d'abord :</b> les trois taux glissent en ligne sur « fois performance, fois qualité », et le bandeau « TRS = 77 % » s'ouvre. <b>Cadre tenu</b> sur 77 %. Sur « quatorze heures… dix heures cinquante », les fractions s'écrivent, 12 h puis 11 h 20 se barrent : il reste 10 h 50 sur 14 h. Dans la cascade, les lignes 2 et 5 s'allument et l'accolade mesure l'écart, 3 h 10.",
         "<b>Pourquoi :</b> c'est le déclic de la vidéo. Le produit des trois taux, c'est simplement le temps utile divisé par le temps requis.",
         ["entrée : cut", "procédé : le déclic"], None),
        ("frame-08", None, "08 · Le vrai verdict", "112–128 s",
         "<b>Ce qui bouge d'abord :</b> les trois tranches de perte quittent la cascade et s'alignent en barres. Sur « À votre avis ? », la voix laisse une pause d'une seconde et demie avant la réponse. La barre de 2 h se cercle de bleu, la pilule « Premier chantier » s'y accroche et les causes du cadre 04 reviennent. La somme se pose en bas.",
         "<b>Pourquoi :</b> une question posée avant la réponse fait mieux retenir. Et les heures s'additionnent (2 h + 40 min + 30 min = 3 h 10), les points non (14,3 + 5,6 + 4,4 = 24,3, pas 23). <b>Retouche de la voix à valider</b>, voir plus bas.",
         ["entrée : cut", "procédé : question avant la réponse"], None),
        ("frame-09", None, "09 · Le « bon TRS »", "128–141 s",
         "<b>Ce qui bouge d'abord :</b> à gauche, l'idée reçue ✗ : ses trois seuils tombent un à un sur « ne veulent rien dire ». À droite, la bonne comparaison ✓ : la courbe de la ligne se trace de 61 à 68 % sur « propre historique », puis la pilule « À règles de calcul constantes ».",
         "<b>Pourquoi :</b> l'erreur et la bonne pratique côte à côte, avec les mêmes codes ✗ / ✓ que le reste de la vidéo. 61 et 68 % viennent de l'article (repère 1).",
         ["entrée : cut", "procédé : idée reçue contre bonne pratique"], None),
        ("frame-10", None, "10 · Le tour de passe-passe", "141–155 s",
         "<b>Ce qui bouge d'abord :</b> la colonne « Avant » reprend la cascade en deux barres : 77 %. Sur « requalifiez », l'heure de panne rouge passe en pointillés « planifiée » et sort du temps requis : 13 h. La barre verte ne bouge pas. 77 % devient 83 %, puis la pilule ✗ arrive sur « pas une minute de plus ».",
         "<b>Pourquoi :</b> un avant / après sur le même schéma. On voit que seul le dénominateur a changé (rappel du cadre 03).",
         ["entrée : crossfade", "procédé : avant / après"], None),
        ("frame-10b", None, "10 bis · Les cousins : TRG et TRE", "≈ 15 s, après 10",
         "<b>Ce qui bouge d'abord :</b> les trois barres partent du même vert, 10 h 50, qui ne bouge plus. Sur « seize heures d'ouverture », la ligne TRG s'allonge des 2 h prévues et son taux descend à 68 %. Sur « vingt-quatre heures », la ligne TRE s'allonge encore de l'atelier fermé et tombe à 45 %. La pilule « TRE ≤ TRG ≤ TRS » se pose en dernier.",
         "<b>Pourquoi :</b> même numérateur, trois dénominateurs : c'est la suite logique du piège du cadre 10. 68 % vient de l'article ; 45 % est calculé avec ses chiffres (10 h 50 sur 24 h). Nouveau cadre et nouvelle ligne de voix à valider.",
         ["entrée : cut", "procédé : même numérateur, trois dénominateurs"], "nouveau"),
        ("frame-11", None, "11 · Affaire classée", "155–167 s",
         "<b>Ce qui bouge d'abord :</b> « Affaire » s'écrit, le bandeau « classée. » claque, la pastille ✓ se pose sur la machine (rappel du cadre 01) et le fil d'enquête se coche en entier. La carte « À retenir » déroule ses trois points sur la voix.",
         "<b>Pourquoi :</b> un résumé en trois points, juste avant la fin, aide à garder l'essentiel.",
         ["entrée : cut", "procédé : à retenir en 3 points"], None),
        ("frame-12", F12, "12 · Se former avec Fichly", "167–182 s",
         "<b>Ce qui bouge d'abord :</b> le titre et son bandeau. Sur « formation Lean Green Belt », la carte de gauche monte, puis la ceinture verte se noue et la pilule ✓ « Éligible au CPF » claque sur « CPF ». Sur « decks de fiches », la carte de droite monte et les decks glissent en éventail. « Tous les liens en description » se pose en dernier.",
         None, ["entrée : crossfade"], "inchangé"),
    ]),
]

BUILDERS = {"frame-02": f02, "frame-03": f03, "frame-04": f04, "frame-05": f05, "frame-06": f06,
            "frame-07": f07, "frame-08": f08, "frame-09": f09, "frame-10": f10, "frame-10b": f10b, "frame-11": f11}

INFO = """
  <div class="info">
    <h3>Les procédés pédagogiques</h3>
    <ul>
      <li><b>Un seul schéma, la cascade des temps.</b> Elle se construit du cadre 03 au 07, une marche par témoin, au lieu d'un décor neuf à chaque cadre. Elle revient au 08 (les pertes) et au 10 (le piège).</li>
      <li><b>Le plan annoncé</b> au cadre 02, puis rappelé en haut à droite de chaque cadre : on sait toujours où l'on en est.</li>
      <li><b>Une couleur par famille</b>, partout la même : rouge disponibilité, jaune performance, violet qualité, vert temps utile.</li>
      <li><b>En mots, puis en chiffres :</b> chaque fraction dit ce qu'elle compare avant le calcul.</li>
      <li><b>Une seule unité :</b> l'astuce « 1 pièce = 1 minute » ramène les pièces en heures.</li>
      <li><b>Le déclic</b> (07) : les fractions se simplifient, le TRS est le temps utile divisé par le temps requis.</li>
      <li><b>Une question avant la réponse</b> (08), <b>l'idée reçue face à la bonne pratique</b> (09), <b>un avant / après</b> (10), <b>à retenir en 3 points</b> (11).</li>
    </ul>
  </div>

  <div class="info">
    <h3>Voix : retouches proposées</h3>
    <p><b>Ligne 8 (recommandée)</b>, pour parler en heures comme l'écran :</p>
    <div class="vo"><s>Regardez où partent les points : quatorze virgule trois en disponibilité, cinq virgule six en performance, quatre virgule quatre en qualité.</s><br>Reprenons nos trois heures dix. À votre avis, où est passée la plus grosse part ? … Deux heures en arrêts. Quarante minutes en lenteurs, trente en rebuts.</div>
    <p><b>Lignes 5 et 6 (au choix)</b>, pour dire l'astuce à voix haute :</p>
    <div class="vo">5 : « Les quarante qui manquent, <b>soit quarante minutes</b> ? Des micro-arrêts… »<br>6 : « …trente sont rebutées ou retouchées : <b>encore trente minutes</b>. »</div>
    <p><b>Ligne 10 bis (nouvelle, TRG et TRE)</b>, environ 15 s :</p>
    <div class="vo">Le dénominateur fait donc le chiffre. Gardez les mêmes dix heures cinquante, mais rapportez-les aux seize heures d'ouverture : c'est le TRG, soixante-huit pour cent. Aux vingt-quatre heures de la journée : le TRE, quarante-cinq pour cent. Même machine, trois questions différentes.</div>
    <p>Le reste du script ne change pas. Rien n'est enregistré tant que vous n'avez pas validé.</p>
  </div>

  <div class="info">
    <h3>Le langage de mouvement</h3>
    <p>D'après la référence envoyée le 1er octobre (les 16 tuiles animées : Andon, SMED, 5 pourquoi, TRS en temps réel…) :</p>
    <ul>
      <li><b>Tout est « en direct » :</b> les compteurs défilent, la jauge se remplit, la couleur suit la valeur (rouge quand c'est bas, jaune puis vert quand ça monte).</li>
      <li><b>Les heures sont des blocs :</b> elles se soulèvent, changent de couleur et glissent d'une ligne à l'autre, comme les blocs du SMED.</li>
      <li><b>Le texte s'écrit à la machine</b>, une ligne après l'autre, comme les 5 pourquoi ; la pastille de la ligne en cours est pleine.</li>
      <li><b>Les cases en pointillés</b> attendent leur contenu ; une pilule numérotée dit l'étape en cours.</li>
      <li><b>Au cadre 07,</b> la jauge « TRS en temps réel » : les trois taux se remplissent, puis l'aiguille monte jusqu'à 77 %.</li>
    </ul>
  </div>

  <div class="info">
    <h3>Les enchaînements</h3>
    <p>Trois types seulement : coupe franche (cut), fondu enchaîné (crossfade) et glissement vers la gauche pour la suite des témoins (push-slide left). Pendant les glissements de 03 à 06, la cascade reste en place : seule la fiche de droite change.</p>
    <div class="seams">
      <span>01 cut</span><span>02 crossfade</span><span class="x">03 push ←</span><span class="x">04 push ←</span><span class="x">05 push ←</span><span class="x">06 push ←</span><span>07 cut</span><span>08 cut</span><span>09 cut</span><span>10 crossfade</span><span>11 cut</span><span>12 crossfade</span>
    </div>
  </div>
"""


def cell_html(fid, inner, name, time, note, why, chips, same):
    chip_html = "".join(f'<span class="chip{" ped" if c.startswith("procédé") else ""}">{c}</span>' for c in chips)
    if same:
        chip_html += f'<span class="chip same">{same}</span>'
    why_html = f'\n    <p class="note">{why}</p>' if why else ""
    return f"""
  <div class="cell">
    <div class="f" id="{fid}">
      {inner}
      {RIBBON}
      {LOGO}
    </div>
    <div class="meta"><span>{name}</span><span class="r">{fid} · {time}</span></div>
    <p class="note">{note}</p>{why_html}
    <div class="chips">{chip_html}</div>
  </div>
"""


def build():
    acts = []
    for act, cells in CELLS:
        body = "".join(cell_html(fid, inner if inner is not None else BUILDERS[fid](), *rest)
                       for fid, inner, *rest in cells)
        if act.startswith("Acte III"):
            body += INFO
        acts.append(f'<div class="act">{act}</div>\n<div class="grid">{body}</div>\n')
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Le TRS en 3 minutes — storyboard v3</title>
<link rel="stylesheet" href="public/fonts.css">
<style>
{BASE_CSS}{EXTRA_CSS}
</style>
</head>
<body>
<div class="sheet">
<header>
  <div>
    <h1>Le TRS en 3 minutes<br><span>storyboard v3, la pédagogie</span></h1>
    <p>Une enquête en 12 cadres, dans la DA Fichly. Nouveauté : un seul schéma, la cascade des temps, se construit sous les yeux du spectateur du cadre 03 au 07. Images fixes du moment clé de chaque cadre, sans mouvement.</p>
  </div>
  <div class="tag">1920×1080 · environ 3 min · 12 cadres · voix Emilie · Remotion</div>
</header>
<div class="changes"><b>Changements depuis la v2 :</b> « Ok gardons remotion. J'aimerais que l'on travaille un peu plus les planches maintenant. Apporter une vraie touche pédagogique » : la cascade des temps devient le fil conducteur ; chaque témoin a la même fiche (ce qu'il a vu, le calcul en mots puis en chiffres, la perte) ; plan de l'enquête au 02 et fil d'enquête en haut à droite ; déclic au 07 ; verdict en heures et question au 08 ; à retenir au 11. Les cadres 01 et 12 ne changent pas.<br><b>Avant :</b> DA Fichly (v2), fin de vidéo sur la formation Green Belt et les decks de fiches.</div>
{"".join(acts)}
</div>
</body>
</html>
"""


if __name__ == "__main__":
    out = ROOT / "storyboard.html"
    out.write_text(build(), encoding="utf-8")
    print("écrit :", out.relative_to(ROOT))
