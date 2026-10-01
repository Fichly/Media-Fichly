# Remotion · vidéos Fichly

Projet Remotion 4.0.532 (scaffold officiel `create-video --blank`) et compétences Claude Code Remotion (`.agents/skills/`, liées dans `.claude/skills/`).

Licence : Remotion est gratuit jusqu'à 3 personnes dans l'entreprise ; au-delà, licence entreprise (https://www.remotion.pro/license).

```bash
npm i
npx remotion studio                       # aperçu interactif
# Environnement cloud : utiliser le Chromium déjà installé
npx remotion render TRS-04-Disponibilite out/04-remotion.mp4 --codec=h264 --crf=18 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

- `src/trs/fichly.ts` : palette et polices Poppins locales de la DA Fichly.
- `src/trs/Temoin1.tsx` : cadre 04 « Témoin n° 1 : la disponibilité » (comparatif HyperFrames / Remotion / Higgsfield), calé sur `public/audio/04-disponibilite.mp3`.
