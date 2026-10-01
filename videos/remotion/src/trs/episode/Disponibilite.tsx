// Cadre 7 « Marche 1 : la disponibilité » · une idée : 2 h d'arrêts subis enlevées, la presse a tourné 12 h sur 14 = 85,7 %.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { Brace, clamp, count, Equation, Eyebrow, fade, fr, HourBlock, IN, mix, OUT, Pill, rowLayout, Scene, Widget } from "../ui";
import { ROW } from "./TempsRequis";
import { T, useG } from "./timeline";

export const HOURS14 = ["6h", "7h", "8h", "9h", "10h", "11h", "12h", "15h", "16h", "17h", "18h", "19h", "20h", "21h"];
export const STOPS = [2, 9]; // 8 h et 17 h : les arrêts subis

export const Disponibilite: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const out = interpolate(f, [T(90.22), T(90.22) + 16], [0, 1], { ...clamp, easing: OUT });
  const full = rowLayout(
    HOURS14.map(() => 1),
    IN.w,
    ROW.gap,
  );
  const kept = rowLayout(
    HOURS14.map((_, i) => (STOPS.includes(i) ? 1 - out : 1)),
    IN.w,
    ROW.gap,
  );
  const twelve = kept[HOURS14.length - 1].x + kept[HOURS14.length - 1].w;
  const stopped = f >= T(83.56) && f < T(90.5);
  const value = count(f, T(94.3), T(95.9), 85.7);
  return (
    <Scene>
      <Eyebrow text="Marche 1 · la disponibilité" start={T(80.16)} />
      <Widget title="Presse · ligne 2" light={stopped ? "red" : "green"}>
        {/* les 14 h requises restent dessinées : c'est le dénominateur */}
        <div
          style={{
            position: "absolute",
            left: IN.x - 7,
            top: ROW.y - 7,
            width: IN.w + 14,
            height: ROW.h + 14,
            borderRadius: 18,
            border: `3px dashed ${C.blue}`,
            boxSizing: "border-box",
            opacity: fade(f, T(90.4), 8),
          }}
        />
        {HOURS14.map((h, i) => {
          const isStop = STOPS.includes(i);
          const flipAt = T(83.94) + STOPS.indexOf(i) * 5;
          const flip = isStop ? interpolate(f, [flipAt, flipAt + 9], [0, 1], clamp) : 0;
          const bump = isStop ? interpolate(f, [flipAt, flipAt + 5, flipAt + 10], [1, 1.08, 1], clamp) : 1;
          const r = isStop ? full[i] : kept[i];
          return (
            <HourBlock
              key={h}
              x={r.x}
              y={ROW.y}
              w={r.w}
              h={ROW.h}
              hour={h}
              tag={flip > 0.5 ? "Arrêt" : undefined}
              bg={mix(flip, C.blue, C.red)}
              fg={flip > 0.5 ? C.ink : "#ffffff"}
              scale={bump}
              opacity={isStop ? 1 - out : 1}
              dy={isStop ? 70 * out : 0}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: IN.x + twelve,
            width: IN.w - twelve,
            top: ROW.y,
            height: ROW.h,
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 34,
            color: C.tRed,
            opacity: fade(f, T(90.8), 8),
          }}
        >
          − 2 h
        </div>
        <div style={{ position: "absolute", left: IN.x, top: ROW.y + ROW.h + 34, display: "flex", gap: 16, opacity: 1 - out }}>
          <Pill start={T(86.0)} bg={C.pRed} fg={C.tRed} badge="ko">
            Une panne
          </Pill>
          <Pill start={T(86.72)} bg={C.pRed} fg={C.tRed} badge="ko">
            Un manque de matière
          </Pill>
          <Pill start={T(87.82)} bg={C.pRed} fg={C.tRed} badge="ko">
            Un réglage
          </Pill>
        </div>
        <Brace from={0} to={twelve} top={ROW.y + ROW.h + 22} color={C.blue} label="12 h de fonctionnement" opacity={fade(f, T(91.3), 8)} />

        <Equation
          top={520}
          lhs="12 h ÷ 14 h ="
          lhsAt={T(91.46)}
          value={`${fr(value, 1)} %`}
          valueAt={T(94.3)}
          label="de disponibilité"
          labelAt={T(95.3)}
        />
      </Widget>
    </Scene>
  );
};
