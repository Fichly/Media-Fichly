// Cadre 13 « Fausse piste n° 2 » · une idée : rebaptiser une panne en maintenance planifiée fait monter le TRS,
// sans une pièce de plus. L'heure sort du temps requis : 10 h 50 ÷ 13 h = 83 %.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { Brace, clamp, count, Equation, Eyebrow, fade, HourBlock, IN, mix, OUT, Pill, rowLayout, Scene, Widget } from "../ui";
import { HOURS14, STOPS } from "./Disponibilite";
import { ROW } from "./TempsRequis";
import { T, useG } from "./timeline";

const RENAMED = STOPS[1]; // la panne de 17 h

export const FaussePiste2: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const lift = interpolate(f, [T(159.2), T(159.2) + 6, T(159.2) + 12], [0, -22, -14], clamp);
  const flip = interpolate(f, [T(160.6), T(160.6) + 9], [0, 1], clamp);
  const out = interpolate(f, [T(162.36), T(162.36) + 16], [0, 1], { ...clamp, easing: OUT });
  const full = rowLayout(
    HOURS14.map(() => 1),
    IN.w,
    ROW.gap,
  );
  const kept = rowLayout(
    HOURS14.map((_, i) => (i === RENAMED ? 1 - out : 1)),
    IN.w,
    ROW.gap,
  );
  const thirteen = f >= T(163.0);
  const end = kept[HOURS14.length - 1].x + kept[HOURS14.length - 1].w;
  const trs = count(f, T(165.18), T(165.9), 83, 77);
  return (
    <Scene>
      <Eyebrow text="Fausse piste n° 2" start={T(156.96)} />
      <Widget title="Presse · ligne 2 · le tour de passe-passe" light="none">
        {HOURS14.map((h, i) => {
          const isStop = STOPS.includes(i);
          const isRenamed = i === RENAMED;
          const r = isRenamed ? full[i] : kept[i];
          const p = isRenamed ? flip : 0;
          return (
            <HourBlock
              key={h}
              x={r.x}
              y={ROW.y}
              w={r.w}
              h={ROW.h}
              hour={h}
              tag={isStop ? (p > 0.5 ? "Maint." : "Panne") : undefined}
              bg={isStop ? mix(p, C.red, C.pLav) : C.blue}
              fg={isStop ? (p > 0.5 ? C.blue : C.ink) : "#ffffff"}
              dashed={p > 0.5 ? C.blue : undefined}
              opacity={isRenamed ? 1 - out : 1}
              dy={isRenamed ? lift + 90 * out : 0}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: IN.x + full[RENAMED].x + full[RENAMED].w / 2,
            top: ROW.y + ROW.h + 30,
            translate: "-50% 0px",
            opacity: 1 - out,
          }}
        >
          <Pill start={T(159.72)} bg={C.pLav} fg={C.blue} dashed={C.blue}>
            Rebaptisée « maintenance planifiée »
          </Pill>
        </div>
        <Brace
          from={0}
          to={end}
          top={ROW.y + ROW.h + 22}
          color={thirteen ? C.tRed : C.blue}
          label={thirteen ? "Temps requis : 13 h" : "Temps requis : 14 h"}
          opacity={fade(f, T(157.4), 8) * (1 - fade(f, T(159.6), 5)) + fade(f, T(163.0), 6)}
        />

        <Equation
          top={500}
          lhs={
            <>
              10 h 50 ÷ <span style={{ color: thirteen ? C.tRed : C.ink }}>{thirteen ? "13 h" : "14 h"}</span> =
            </>
          }
          lhsAt={T(157.4)}
          value={`${Math.round(trs)} %`}
          valueAt={T(157.6)}
          label="de TRS"
          labelAt={T(157.9)}
        />
        <div style={{ position: "absolute", left: IN.x, top: 680 }}>
          <Pill start={T(166.28)} bg={C.pRed} fg={C.tRed} badge="ko">
            Sans une seule pièce de plus
          </Pill>
        </div>
      </Widget>
    </Scene>
  );
};
