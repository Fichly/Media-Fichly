# Essai HyperFrames : la cascade des temps du TRS

Test de faisabilité du 1er octobre 2026 (voir `videos/CADRAGE-MOTION.md`, section 4) : 9 s, 1920×1080, 30 i/s, charte Fichly, sans voix.

```bash
npm i -g hyperframes@0.8.104        # ou npx hyperframes@0.8.104 …
export HYPERFRAMES_BROWSER_PATH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell   # environnement cloud
npx hyperframes check                # mise en page, contraste, erreurs d'exécution
npx hyperframes snapshot --at 1.2,2.6,4.6,6.3,8.6
npx hyperframes render --quality high --output renders/test-trs.mp4
```

GSAP est servi depuis `public/js/` : le CDN jsdelivr est bloqué dans l'environnement cloud.
