// Cadre 6 « Le temps requis » · une idée : 16 h d'ouverture − 2 h de maintenance prévue = 14 h de temps requis.
// Les 16 heures sont des blocs ; les deux heures de maintenance sortent, les 14 autres se resserrent (cadre 7 les reprend).
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { Brace, clamp, Equation, Eyebrow, fade, HourBlock, IN, mix, OUT, Pill, rowLayout, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

export const HOURS16 = ["6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h"];
const MAINT = [7, 8]; // 13 h et 14 h : la maintenance prévue
export const ROW = { y: 190, h: 120, gap: 8 };

export const TempsRequis: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const out = interpolate(f, [T(78.1), T(78.1) + 16], [0, 1], { ...clamp, easing: OUT });
  const before = rowLayout(
    HOURS16.map(() => 1),
    IN.w,
    ROW.gap,
  );
  const after = rowLayout(
    HOURS16.map((_, i) => (MAINT.includes(i) ? 1 - out : 1)),
    IN.w,
    ROW.gap,
    interpolate(out, [0, 1], [16, 14]),
  );
  const m0 = before[MAINT[0]].x;
  const m1 = before[MAINT[1]].x + before[MAINT[1]].w;
  return (
    <Scene>
      <Eyebrow text="Notre presse · le temps requis" start={T(72.56)} />
      <Widget title="Presse · ligne 2">
        {HOURS16.map((h, i) => {
          const enter = T(74.5) + i * 1.5;
          const isMaint = MAINT.includes(i);
          const flipAt = T(76.66) + (i - MAINT[0]) * 3;
          const flip = isMaint ? interpolate(f, [flipAt, flipAt + 8], [0, 1], clamp) : 0;
          const r = isMaint ? before[i] : after[i];
          return (
            <HourBlock
              key={h}
              x={r.x}
              y={ROW.y}
              w={r.w}
              h={ROW.h}
              hour={h}
              bg={mix(flip, C.blue, C.pLav)}
              fg={flip > 0.5 ? C.blue : "#ffffff"}
              dashed={flip > 0.5 ? C.blue : undefined}
              opacity={fade(f, enter, 8) * (isMaint ? 1 - out : 1)}
              dy={interpolate(f, [enter, enter + 12], [18, 0], { ...clamp, easing: OUT }) + (isMaint ? 70 * out : 0)}
            />
          );
        })}

        <Brace
          from={0}
          to={IN.w}
          top={ROW.y + ROW.h + 14}
          color={C.blue}
          label="16 h d'ouverture"
          opacity={fade(f, T(75.0), 8) * (1 - fade(f, T(76.5), 6))}
        />
        <div style={{ position: "absolute", left: IN.x + (m0 + m1) / 2, top: ROW.y + ROW.h + 24, translate: "-50% 0px", opacity: 1 - out }}>
          <Pill start={T(76.9)} bg={C.pLav} fg={C.blue} dashed={C.blue}>
            − 2 h de maintenance prévue
          </Pill>
        </div>
        <Brace from={0} to={IN.w} top={ROW.y + ROW.h + 14} color={C.blue} label="Temps requis" opacity={fade(f, T(78.9), 8)} />

        <Equation top={520} lhs="16 h − 2 h =" lhsAt={T(75.9)} value="14 h" valueAt={T(78.46)} label="de temps requis" labelAt={T(79.28)} />
      </Widget>
    </Scene>
  );
};
