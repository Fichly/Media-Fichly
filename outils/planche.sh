#!/bin/sh
# Planche de contrôle : assemble des PNG de controle/ en une rangée réduite.
# sh outils/planche.sh sortie.png img1.png img2.png …
out=$1; shift
n=$#
ins=""; i=0; for f in "$@"; do ins="$ins -i $f"; i=$((i+1)); done
filt=""; i=0; for f in "$@"; do filt="$filt[$i:v]scale=360:-1[v$i];"; i=$((i+1)); done
cat=""; i=0; for f in "$@"; do cat="$cat[v$i]"; i=$((i+1)); done
ffmpeg -y -loglevel error $ins -filter_complex "${filt}${cat}hstack=inputs=$n" "$out"
