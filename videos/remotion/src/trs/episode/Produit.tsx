// Cadre 10 « Le TRS, reconstitué » · une idée : disponibilité × performance × qualité = les mêmes 77 %.
// Modèle : la tuile Fichly « TRS en temps réel » ; les trois taux se remplissent un à un, puis l'arc monte à 77 %.
// Le reste de chaque piste garde la couleur de sa famille de pertes : on sait d'où viennent les 77 %.
import type React from "react";
import { interpolate, interpolateColors } from "remotion";
import { C } from "../fichly";
import { CARD, clamp, count, Eyebrow, fade, fr, IN, mix, OUT, pop, Pill, Scene, Widget } from "../ui";
import { PV } from "./Qualite";
import { T, useG } from "./timeline";

const RATES = [
  { name: "Disponibilité", value: 85.7, at: 127.18, loss: C.red, pale: C.pRed },
  { name: "Performance", value: 94.4, at: 128.22, loss: C.yellow, pale: C.pYellow },
  { name: "Qualité", value: 95.6, at: 129.42, loss: C.violet, pale: PV },
];
const TRACK = 560;
const G = { cx: 1230, cy: 560, r: 240, w: 44 };

export const Produit: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const trs = count(f, T(130.56), T(131.7), 77);
  const arc = Math.PI * G.r;
  const color = interpolateColors(trs, [0, 50, 62, 74], [C.red, C.red, C.yellow, C.green]);
  return (
    <Scene>
      <Eyebrow text="Le TRS, reconstitué" start={T(125.24)} />
      <Widget title="TRS en temps réel">
        {RATES.map((r, i) => {
          const y = 190 + i * 150;
          const start = T(r.at);
          const v = count(f, start, start + 16, r.value);
          const p = pop(f, start);
          const lit = interpolate(f, [T(133.6) + i * 5, T(133.6) + i * 5 + 8], [0, 1], clamp);
          return (
            <div key={r.name} style={{ position: "absolute", left: IN.x, top: y, opacity: fade(f, start, 5) }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 18, scale: interpolate(p, [0, 1], [0.85, 1]), transformOrigin: "left center" }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: i === 0 ? "transparent" : C.blue,
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: 34,
                    lineHeight: 1,
                  }}
                >
                  {i === 0 ? "" : "×"}
                </span>
                <span style={{ fontWeight: 700, fontSize: 40, color: C.ink }}>{r.name}</span>
              </div>
              <div
                style={{ position: "absolute", left: 64, top: 70, width: TRACK, height: 28, borderRadius: 14, background: mix(lit, r.pale, r.loss) }}
              >
                <div style={{ width: (TRACK * v) / 100, height: 28, borderRadius: 14, background: C.blue }} />
              </div>
              <span
                style={{
                  position: "absolute",
                  left: 64 + TRACK + 28,
                  top: 50,
                  fontWeight: 800,
                  fontSize: 52,
                  color: C.blue,
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {fr(v, 1)} %
              </span>
            </div>
          );
        })}

        {/* la jauge */}
        <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path
            d={`M ${G.cx - G.r} ${G.cy} A ${G.r} ${G.r} 0 0 1 ${G.cx + G.r} ${G.cy}`}
            fill="none"
            stroke={C.pLav}
            strokeWidth={G.w}
            strokeLinecap="round"
          />
          <path
            d={`M ${G.cx - G.r} ${G.cy} A ${G.r} ${G.r} 0 0 1 ${G.cx + G.r} ${G.cy}`}
            fill="none"
            stroke={color}
            strokeWidth={G.w}
            strokeLinecap="round"
            strokeDasharray={arc}
            strokeDashoffset={arc * (1 - trs / 100)}
            opacity={trs > 0.2 ? 1 : 0}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: G.cx - 260,
            width: 520,
            top: G.cy - 170,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 130,
            lineHeight: 1,
            color: C.blue,
            fontVariantNumeric: "tabular-nums",
            opacity: fade(f, T(130.56), 4),
          }}
        >
          {Math.round(trs)} %
        </div>
        <div
          style={{
            position: "absolute",
            left: G.cx - 260,
            width: 520,
            top: G.cy - 20,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 36,
            color: C.blue,
            opacity: fade(f, T(130.9), 6),
          }}
        >
          TRS
        </div>
        <div
          style={{
            position: "absolute",
            left: G.cx,
            top: G.cy + 70,
            translate: `-50% ${interpolate(f, [T(132.26), T(132.26) + 12], [10, 0], { ...clamp, easing: OUT })}px`,
          }}
        >
          <Pill start={T(132.26)} bg={C.pGreen} fg={C.tGreen} badge="ok">
            Comme la méthode simple
          </Pill>
        </div>
      </Widget>
    </Scene>
  );
};
