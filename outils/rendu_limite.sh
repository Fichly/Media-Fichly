#!/bin/bash
# Lance outils/rendu.js avec au plus 3 rendus simultanés (plusieurs agents peuvent travailler en parallèle).
# Mêmes arguments que rendu.js : outils/rendu_limite.sh blog/<article>/<visuel> stills 0 4 | gif 20
DIR="$(cd "$(dirname "$0")" && pwd)"
export NODE_PATH="${NODE_PATH:-/opt/node22/lib/node_modules}"
if [ -z "$FFMPEG" ]; then
  F=$(ls /usr/local/lib/python3*/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-* 2>/dev/null | head -1)
  export FFMPEG="${F:-ffmpeg}"
fi
cd "$DIR/.."
while true; do
  for i in 1 2 3; do
    exec 9>"/tmp/fichly-rendu-$i.lock"
    if flock -n 9; then node outils/rendu.js "$@"; exit $?; fi
  done
  sleep 2
done
