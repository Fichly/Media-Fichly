// Cadre 03 « Le temps requis » · une idée : 16 h d'ouverture − 2 h prévues = 14 h requises.
// Voix : public/audio/v2/03-temps-requis.mp3 (repères : videos/le-trs-en-3-minutes/audio/v2/03-temps-requis.words.json)
import type React from "react";
import { Audio } from "@remotion/media";
import { interpolate, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { C } from "../fichly";
import { at, Brace, clamp, Eyebrow, fade, FPS, IN, OUT, pop, Scene, settle, Sub, Widget } from "../ui";

const VO = 0.3;
const cue = (t: number) => at(VO + t);
export const S03_DURATION = at(11.0);

const ROW = { y: 250, h: 130 };
const BW = IN.w / 16;
const PLAN = [0, 8]; // les 2 h de maintenance prévue (6 h et 14 h)
const DROP = cue(1.96); // « seize heures »
const MARK = cue(3.3); // « maintenance »
const ASIDE = cue(4.62); // « qu'on met de côté »

const Hour: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const k = PLAN.indexOf(i);
  const planned = k >= 0;
  const j = planned ? 14 + k : i - PLAN.filter((p) => p < i).length;
  const drop = settle(frame, DROP + i * 2);
  const mark = planned ? fade(frame, MARK + k * 4, 6) : 0;
  const move = settle(frame, ASIDE + (planned ? 0 : 4 + j));
  const lift = planned ? -60 * Math.sin(Math.PI * Math.min(1, move)) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: IN.x + interpolate(move, [0, 1], [i * BW, j * BW]),
        top: ROW.y + interpolate(drop, [0, 1], [-50, 0]) + lift,
        width: BW - 10,
        height: ROW.h,
        borderRadius: 16,
        boxSizing: "border-box",
        background: interpolateColors(mark, [0, 1], [C.blue, C.pLav]),
        border: mark > 0.5 ? `4px dashed ${C.blue}` : "none",
        opacity: fade(frame, DROP + i * 2, 4),
      }}
    />
  );
};

export const S03TempsRequis: React.FC = () => {
  const frame = useCurrentFrame();
  const after = fade(frame, ASIDE + 22, 10);
  const res = pop(frame, cue(5.86));
  return (
    <Scene>
      <Eyebrow text="Pièce n° 1 · le temps" start={cue(0)} />
      <Widget title="Presse · ligne 2">
        <Sub text="La journée, heure par heure" />
        {Array.from({ length: 16 }).map((_, i) => (
          <Hour key={i} i={i} />
        ))}
        <Brace from={0} to={16 * BW - 10} top={ROW.y + ROW.h + 22} color={C.blue} label="16 h d'ouverture" opacity={fade(frame, DROP + 20, 8) * (1 - after)} />
        <Brace from={0} to={14 * BW - 10} top={ROW.y + ROW.h + 22} color={C.blue} label="14 h requises" opacity={after} />
        <Brace from={14 * BW} to={16 * BW - 10} top={ROW.y + ROW.h + 22} color={C.blue} label="2 h prévues" opacity={after} />

        <div style={{ position: "absolute", left: IN.x, top: 560, display: "flex", alignItems: "baseline", gap: 28, whiteSpace: "nowrap" }}>
          <span style={{ fontWeight: 700, fontSize: 64, color: C.ink, opacity: fade(frame, cue(5.56), 6) }}>16 h − 2 h =</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 150,
              lineHeight: 1,
              color: C.blue,
              opacity: fade(frame, cue(5.86), 4),
              scale: interpolate(res, [0, 1], [0.7, 1]),
              transformOrigin: "left 70%",
              display: "inline-block",
            }}
          >
            14 h
          </span>
          <span
            style={{
              fontWeight: 600,
              fontSize: 36,
              color: C.blue,
              opacity: fade(frame, cue(6.9), 8),
              translate: `${interpolate(frame, [cue(6.9), cue(6.9) + 12], [-12, 0], { ...clamp, easing: OUT })}px 0px`,
            }}
          >
            de temps requis
          </span>
        </div>
      </Widget>
      <Audio src={staticFile("audio/v2/03-temps-requis.mp3")} from={at(VO)} premountFor={FPS} />
    </Scene>
  );
};
