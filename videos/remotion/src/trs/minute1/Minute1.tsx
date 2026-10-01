// La première minute du « TRS en 3 minutes » (script v3, lignes 1 à 5) : logo, intro, constat, méthode simple, temps d'états.
// Une seule prise de voix continue ; les cadres changent pendant qu'elle parle (fondus de XF images), sans silence entre eux.
import type React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "../fichly";
import { at, clamp, Decor, FPS } from "../ui";
import { Constat } from "./Constat";
import { Formule } from "./Formule";
import { Intro } from "./Intro";
import { NotreCas } from "./NotreCas";
import { TempsEtats } from "./TempsEtats";
import { CUTS, HANDOFF, VO_START, XF } from "./timeline";

const SCENES: [React.FC<{ o: number }>, number, number][] = [
  [Intro, 0, CUTS.constat],
  [Constat, CUTS.constat, CUTS.formule],
  [Formule, CUTS.formule, CUTS.cas],
  [NotreCas, CUTS.cas, CUTS.etats],
  [TempsEtats, CUTS.etats, CUTS.fin],
];

// Le cadre suivant apparaît en fondu par-dessus le précédent, qui reste opaque dessous : pas de creux pendant le fondu
const Fader: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

export const Minute1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f3f3", color: C.ink }}>
      <Decor brand={interpolate(f, [HANDOFF, HANDOFF + 2], [0, 1], clamp)} />
      {SCENES.map(([Scene, start, end], i) => {
        const from = i === 0 ? 0 : start - XF / 2;
        const to = i === SCENES.length - 1 ? end : end + XF / 2;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from} premountFor={FPS}>
            <Fader first={i === 0}>
              <Scene o={from} />
            </Fader>
          </Sequence>
        );
      })}
      <Audio src={staticFile("audio/v3/bloc1.mp3")} from={at(VO_START)} premountFor={FPS} />
    </AbsoluteFill>
  );
};

export const Minute1Composition: React.FC = () => (
  <Composition id="TRS-Minute-1" component={Minute1} durationInFrames={CUTS.fin} fps={FPS} width={1920} height={1080} />
);
