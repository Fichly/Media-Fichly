// « Le TRS en 3 minutes », épisode complet (script v3, lignes 1 à 17), sur une seule prise de voix continue.
// Les cadres changent pendant que la voix parle (fondus de XF images), sans silence entre eux ; une idée par cadre.
import type React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "../fichly";
import { at, clamp, Decor, FPS, FrameOffset } from "../ui";
import { ARetenir } from "./ARetenir";
import { Comparateur } from "./Comparateur";
import { Constat } from "./Constat";
import { Disponibilite } from "./Disponibilite";
import { FaussePiste1 } from "./FaussePiste1";
import { FaussePiste2 } from "./FaussePiste2";
import { Formule } from "./Formule";
import { Intro } from "./Intro";
import { MemeNumerateur } from "./MemeNumerateur";
import { NotreCas } from "./NotreCas";
import { Outro } from "./Outro";
import { Performance } from "./Performance";
import { Produit } from "./Produit";
import { Qualite } from "./Qualite";
import { SeFormer } from "./SeFormer";
import { SurQuelTemps } from "./SurQuelTemps";
import { TempsEtats } from "./TempsEtats";
import { TempsRequis } from "./TempsRequis";
import { Verdict } from "./Verdict";
import { CUTS, HANDOFF, VO_START, XF } from "./timeline";

const SCENES: [React.FC<{ o: number }>, number, number][] = [
  [Intro, 0, CUTS.constat],
  [Constat, CUTS.constat, CUTS.formule],
  [Formule, CUTS.formule, CUTS.cas],
  [NotreCas, CUTS.cas, CUTS.etats],
  [TempsEtats, CUTS.etats, CUTS.requis],
  [TempsRequis, CUTS.requis, CUTS.dispo],
  [Disponibilite, CUTS.dispo, CUTS.perf],
  [Performance, CUTS.perf, CUTS.qualite],
  [Qualite, CUTS.qualite, CUTS.produit],
  [Produit, CUTS.produit, CUTS.verdict],
  [Verdict, CUTS.verdict, CUTS.piste1],
  [FaussePiste1, CUTS.piste1, CUTS.piste2],
  [FaussePiste2, CUTS.piste2, CUTS.numerateur],
  [MemeNumerateur, CUTS.numerateur, CUTS.comparateur],
  [Comparateur, CUTS.comparateur, CUTS.quelTemps],
  [SurQuelTemps, CUTS.quelTemps, CUTS.retenir],
  [ARetenir, CUTS.retenir, CUTS.former],
  [SeFormer, CUTS.former, CUTS.fin],
  [Outro, CUTS.outro, CUTS.fin],
];

// Le cadre suivant apparaît en fondu par-dessus le précédent, qui reste opaque dessous : pas de creux pendant le fondu
const Fader: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

export const Episode: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f3f3", color: C.ink }}>
      <Decor brand={interpolate(f, [HANDOFF, HANDOFF + 2], [0, 1], clamp)} />
      {SCENES.map(([Scene, start, end], i) => {
        const from = i === 0 ? 0 : start - XF / 2;
        const to = end >= CUTS.fin ? CUTS.fin : end + XF / 2;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from} premountFor={FPS}>
            <FrameOffset.Provider value={from}>
              <Fader first={i === 0}>
                <Scene o={from} />
              </Fader>
            </FrameOffset.Provider>
          </Sequence>
        );
      })}
      <Audio src={staticFile("audio/v4/trs-complet.mp3")} from={at(VO_START)} premountFor={FPS} />
    </AbsoluteFill>
  );
};

export const EpisodeComposition: React.FC = () => (
  <Composition id="TRS-en-3-minutes" component={Episode} durationInFrames={CUTS.fin} fps={FPS} width={1920} height={1080} />
);
