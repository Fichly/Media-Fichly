// La première minute du « TRS en 3 minutes » : accroche, titre, l'outil, le temps requis, la disponibilité.
// Script v2 (videos/le-trs-en-3-minutes/SCRIPT.md, lignes 1 à 4), un cadre = une idée, fondus courts entre les cadres.
import type React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Composition } from "remotion";
import { C } from "../fichly";
import { at, Decor, FPS } from "../ui";
import { S01_DURATION, S01Affaire } from "./S01Affaire";
import { S02_DURATION, S02Outil } from "./S02Outil";
import { S03_DURATION, S03TempsRequis } from "./S03TempsRequis";
import { S04_DURATION, S04Disponibilite } from "./S04Disponibilite";
import { Titre, TITRE_DURATION } from "./Titre";

const CROSS = at(0.4);
const SCENES: [React.FC, number][] = [
  [S01Affaire, S01_DURATION],
  [Titre, TITRE_DURATION],
  [S02Outil, S02_DURATION],
  [S03TempsRequis, S03_DURATION],
  [S04Disponibilite, S04_DURATION],
];
const TOTAL = SCENES.reduce((sum, [, d]) => sum + d, 0) - CROSS * (SCENES.length - 1);

export const Minute1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#f3f3f3", color: C.ink }}>
    <Decor />
    <TransitionSeries>
      {SCENES.flatMap(([Scene, duration], i) => [
        ...(i > 0
          ? [<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: CROSS })} />]
          : []),
        <TransitionSeries.Sequence key={`s${i}`} durationInFrames={duration} premountFor={FPS}>
          <Scene />
        </TransitionSeries.Sequence>,
      ])}
    </TransitionSeries>
  </AbsoluteFill>
);

export const Minute1Composition: React.FC = () => (
  <Composition id="TRS-Minute-1" component={Minute1} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
