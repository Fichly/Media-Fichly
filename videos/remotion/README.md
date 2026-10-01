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
- `src/trs/Cadre04.tsx` : cadre 04 de la planche v3 en **panneau de contrôle** (composition `TRS-04-Disponibilite-v3`, 14 s) : vue atelier avec la presse et ses voyants, journal des arrêts écrit à la machine, journée de 14 h balayée par une tête de lecture, arrêts qui tombent dans la cascade des temps, jauge « en direct » jusqu'à 85,7 %. Langage de mouvement repris des tuiles animées Fichly (références du 1er octobre 2026). Rendu de travail : `videos/essais/panneau-04/04-panneau-de-controle.mp4`.
