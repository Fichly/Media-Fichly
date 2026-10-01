// Cadre 04 « La disponibilité » · une idée : 12 h de marche sur 14 h requises.
// Voix : public/audio/v2/04-disponibilite.mp3 (repères : videos/le-trs-en-3-minutes/audio/v2/04-disponibilite.words.json)
import type React from "react";
import { Audio } from "@remotion/media";
import { Easing, interpolate, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { C, KO_SVG } from "../fichly";
import { at, Brace, clamp, Eyebrow, fade, FPS, IN, pop, Scene, settle, Sub, Widget } from "../ui";

const VO = 0.3;
const cue = (t: number) => at(VO + t);
export const S04_DURATION = at(19);

const B1 = cue(4.24); // « deux heures » : deux blocs passent au rouge
const B2 = cue(8.2); // « une fois ces arrêts non planifiés enlevés » : ils sortent de la journée
const COUNT = [cue(14.16), cue(15.9)]; // « 85,7 % »

const ROW = { y: 250, h: 130 };
const BW = IN.w / 14;
const RED = [3, 9]; // les deux heures d'arrêt (position illustrative)

const Block: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const k = RED.indexOf(i);
  const isRed = k >= 0;
  const j = isRed ? 12 + k : i - RED.filter((r) => r < i).length;
  const red = isRed ? fade(frame, B1 + k * 4, 6) : 0;
  const bump = isRed ? interpolate(frame, [B1 + k * 4, B1 + k * 4 + 5, B1 + k * 4 + 11], [1, 1.07, 1], clamp) : 1;
  const out = isRed ? fade(frame, B2 + k * 4, 12) : 0;
  const move = settle(frame, B2 + 10 + (isRed ? 0 : j));
  const badge = isRed ? pop(frame, B1 + k * 4 + 3) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: IN.x + interpolate(move, [0, 1], [i * BW, j * BW]),
        top: ROW.y - 70 * out,
        width: BW - 12,
        height: ROW.h,
        borderRadius: 18,
        background: interpolateColors(red, [0, 1], [C.blue, C.red]),
        opacity: 1 - out,
        scale: bump,
        display: "grid",
        placeItems: "center",
      }}
    >
      {isRed ? (
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: C.ink,
            backgroundImage: KO_SVG,
            backgroundSize: "100%",
            opacity: Math.min(1, badge),
            scale: interpolate(badge, [0, 1], [0.4, 1]),
          }}
        />
      ) : null}
    </div>
  );
};

export const S04Disponibilite: React.FC = () => {
  const frame = useCurrentFrame();
  const stopped = frame >= B1 && frame < B2;
  const after = fade(frame, B2 + 24, 10);
  const v = interpolate(frame, COUNT, [0, 85.7], { ...clamp, easing: Easing.out(Easing.cubic) });
  const statIn = fade(frame, COUNT[0] - 4, 6);
  const top = ROW.y + ROW.h + 22;
  return (
    <Scene>
      <Eyebrow text="Témoin n° 1 · la disponibilité" start={cue(0)} />
      <Widget title="Presse · ligne 2" light={stopped ? "red" : "green"}>
        <Sub text="Les 14 heures requises" />
        {[12, 13].map((j) => (
          <div
            key={j}
            style={{
              position: "absolute",
              left: IN.x + j * BW,
              top: ROW.y,
              width: BW - 12,
              height: ROW.h,
              borderRadius: 18,
              border: `4px dashed ${C.red}`,
              boxSizing: "border-box",
              background: C.pRed,
              opacity: after,
            }}
          />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <Block key={i} i={i} />
        ))}
        <Brace from={0} to={14 * BW - 12} top={top} color={C.blue} label="14 h requises" opacity={1 - after} />
        <Brace from={0} to={12 * BW - 12} top={top} color={C.blue} label="12 h de marche" opacity={after} />
        <Brace from={12 * BW} to={14 * BW - 12} top={top} color={C.tRed} label="2 h d'arrêt" opacity={after} />

        <div style={{ position: "absolute", left: IN.x, top: 560, display: "flex", alignItems: "baseline", gap: 28, whiteSpace: "nowrap" }}>
          <span style={{ fontWeight: 700, fontSize: 64, color: C.ink }}>
            <span style={{ opacity: fade(frame, cue(10.8), 6) }}>12 h</span>
            <span style={{ opacity: fade(frame, cue(11.5), 6) }}> ÷ 14 h</span>
          </span>
          <span style={{ fontWeight: 800, fontSize: 64, color: C.blue, opacity: statIn }}>=</span>
          <span style={{ fontWeight: 800, fontSize: 150, lineHeight: 1, color: C.tRed, fontVariantNumeric: "tabular-nums", opacity: statIn }}>
            {v.toFixed(1).replace(".", ",")} %
          </span>
          <span style={{ fontWeight: 600, fontSize: 32, color: C.blue, opacity: fade(frame, COUNT[1], 8) }}>de disponibilité</span>
        </div>
      </Widget>
      <Audio src={staticFile("audio/v2/04-disponibilite.mp3")} from={at(VO)} premountFor={FPS} />
    </Scene>
  );
};
