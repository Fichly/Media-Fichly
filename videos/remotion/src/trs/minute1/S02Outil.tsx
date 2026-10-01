// Cadre 02 « L'outil » · une idée : le TRS mesure l'écart entre ce que la machine devait produire et les pièces bonnes.
// Voix : public/audio/v2/02-outil.mp3 (repères : videos/le-trs-en-3-minutes/audio/v2/02-outil.words.json)
import type React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../fichly";
import { at, Badge, clamp, Eyebrow, fade, FPS, IN, OUT, pop, Scene, Typed, Widget } from "../ui";

const VO = 0.3;
const cue = (t: number) => at(VO + t);
export const S02_DURATION = at(12.8);

const GOOD = 1124; // les pièces bonnes : 10 h 50 sur 14 h, à l'échelle de la barre
const BAR_H = 120;
const Y1 = 230;
const Y2 = 410;

const Slot: React.FC<{ y: number; w: number }> = ({ y, w }) => (
  <div style={{ position: "absolute", left: IN.x, top: y, width: w, height: BAR_H, borderRadius: 18, border: `3px dashed ${C.line}`, boxSizing: "border-box" }} />
);

export const S02Outil: React.FC = () => {
  const frame = useCurrentFrame();
  const g1 = interpolate(frame, [cue(8.06), cue(8.06) + 18], [0, IN.w], { ...clamp, easing: OUT });
  const g2 = interpolate(frame, [cue(9.26), cue(9.26) + 18], [0, GOOD], { ...clamp, easing: OUT });
  const gapAt = cue(10.6);
  const gap = pop(frame, gapAt);
  return (
    <Scene>
      <Eyebrow text="L'outil d'enquête" start={cue(1.48)} />
      <Widget title={<><Typed text="Le TRS" start={cue(1.58)} cps={14} /><Typed text=" · taux de rendement synthétique" start={cue(2.54)} cps={24} /></>} enter>
        <Slot y={Y1} w={IN.w} />
        <Slot y={Y2} w={IN.w} />
        <div
          style={{
            position: "absolute",
            left: IN.x,
            top: Y1,
            width: g1,
            height: BAR_H,
            borderRadius: 18,
            background: C.blue,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            paddingLeft: 34,
            boxSizing: "border-box",
            fontWeight: 700,
            fontSize: 38,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <span style={{ opacity: fade(frame, cue(8.06) + 6) }}>Ce que la machine devait produire</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: IN.x,
            top: Y2,
            width: g2,
            height: BAR_H,
            borderRadius: 18,
            background: C.green,
            color: C.tGreen,
            display: "flex",
            alignItems: "center",
            paddingLeft: 34,
            boxSizing: "border-box",
            fontWeight: 700,
            fontSize: 38,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <span style={{ opacity: fade(frame, cue(9.26) + 6) }}>Les pièces bonnes</span>
        </div>
        {/* l'écart : tout ce qui s'est perdu */}
        <div
          style={{
            position: "absolute",
            left: IN.x + GOOD + 12,
            top: Y2,
            width: IN.w - GOOD - 12,
            height: BAR_H,
            borderRadius: 18,
            background: C.pRed,
            border: `4px dashed ${C.red}`,
            boxSizing: "border-box",
            opacity: fade(frame, gapAt, 6),
            scale: interpolate(gap, [0, 1], [0.92, 1]),
          }}
        />
        <div
          style={{
            position: "absolute",
            right: IN.x,
            top: Y2 + BAR_H + 20,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontWeight: 700,
            fontSize: 36,
            color: C.tRed,
            opacity: fade(frame, gapAt + 4, 6),
          }}
        >
          <Badge kind="ko" size={40} />
          Tout ce qui s'est perdu
        </div>
        <div style={{ position: "absolute", left: IN.x, top: 650, fontWeight: 700, fontSize: 50, color: C.ink, opacity: fade(frame, gapAt + 16, 8) }}>
          Le TRS mesure <span style={{ color: C.tRed }}>cet écart</span>.
        </div>
      </Widget>
      <Audio src={staticFile("audio/v2/02-outil.mp3")} from={at(VO)} premountFor={FPS} />
    </Scene>
  );
};
