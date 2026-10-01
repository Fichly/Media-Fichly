// Cadre 5 « Les temps d'états » · une idée : la journée se découpe en marches, chaque marche retire une famille de pertes.
// Les longueurs sont celles de la presse (24, 16, 14, 12, 11 h 20, 10 h 50), sans chiffres : on les découvrira ensuite.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, Eyebrow, fade, IN, OUT, pop, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

const K = IN.w / 24; // 1 h en pixels
const Y0 = 160;
const STEP = 82;
const H = 62;

type Row = {
  name: string;
  hours: number;
  bg: string;
  fg: string;
  border?: string;
  bar: number; // seconde de la prise où la marche apparaît
  loss?: { label: string; bg: string; fg: string; dashed?: string; at: number; inside?: boolean };
};

const ROWS: Row[] = [
  { name: "Temps total", hours: 24, bg: C.card, fg: C.blue, border: C.blue, bar: 51.76 },
  {
    name: "Temps d'ouverture",
    hours: 16,
    bg: C.blue,
    fg: "#ffffff",
    bar: 56.68,
    loss: { label: "atelier fermé", bg: C.pLav, fg: C.blue, dashed: C.blue, at: 55.32, inside: true },
  },
  { name: "Temps requis", hours: 14, bg: C.blue, fg: "#ffffff", bar: 59.9, loss: { label: "arrêts prévus", bg: C.pLav, fg: C.blue, dashed: C.blue, at: 58.36 } },
  { name: "Temps de fonctionnement", hours: 12, bg: C.blue, fg: "#ffffff", bar: 62.58, loss: { label: "arrêts subis", bg: C.red, fg: C.tRed, at: 61.38 } },
  { name: "Temps net", hours: 11 + 1 / 3, bg: C.blue, fg: "#ffffff", bar: 65.48, loss: { label: "ralentissements", bg: C.yellow, fg: C.tYellow, at: 64.34 } },
  { name: "Temps utile", hours: 10 + 5 / 6, bg: C.green, fg: C.tGreen, bar: 68.88, loss: { label: "pièces mauvaises", bg: C.violet, fg: C.ink, at: 67.2 } },
];

export const TempsEtats: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const wrap = T(70.06); // « Chaque marche retire une famille de pertes »
  return (
    <Scene>
      <Eyebrow text="Les temps d'états" start={T(48.24)} />
      <Widget title="La journée, découpée en temps d'états" light="none">
        {ROWS.map((r, i) => {
          const y = Y0 + i * STEP;
          const w = r.hours * K;
          const grow = interpolate(f, [T(r.bar), T(r.bar) + 14], [0, w], { ...clamp, easing: OUT });
          const prev = i > 0 ? ROWS[i - 1].hours * K : 0;
          const l = r.loss;
          const lp = l ? pop(f, T(l.at)) : 0;
          const bump = l ? interpolate(f, [wrap + i * 3, wrap + i * 3 + 5, wrap + i * 3 + 10], [1, 1.12, 1], clamp) : 1;
          return (
            <div key={r.name}>
              {l ? (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: IN.x + w + 6,
                      top: y,
                      width: prev - w - 6,
                      height: H,
                      borderRadius: 12,
                      background: l.bg,
                      border: l.dashed ? `3px dashed ${l.dashed}` : "none",
                      boxSizing: "border-box",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: 26,
                      color: l.fg,
                      opacity: fade(f, T(l.at), 5),
                      scale: interpolate(lp, [0, 1], [0.85, 1]),
                    }}
                  >
                    {l.inside ? l.label : null}
                  </div>
                  {l.inside ? null : (
                    <div
                      style={{
                        position: "absolute",
                        left: IN.x + prev + 16,
                        top: y,
                        height: H,
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 700,
                        fontSize: 28,
                        color: l.fg,
                        whiteSpace: "nowrap",
                        opacity: fade(f, T(l.at), 5),
                        scale: bump,
                        transformOrigin: "left center",
                      }}
                    >
                      − {l.label}
                    </div>
                  )}
                </>
              ) : null}
              <div
                style={{
                  position: "absolute",
                  left: IN.x,
                  top: y,
                  width: grow,
                  height: H,
                  borderRadius: 12,
                  background: r.bg,
                  border: r.border ? `3px solid ${r.border}` : "none",
                  boxSizing: "border-box",
                  color: r.fg,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: Math.min(22, grow),
                  opacity: grow > 8 ? 1 : 0,
                  fontWeight: 700,
                  fontSize: 28,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <span style={{ opacity: fade(f, T(r.bar) + 6, 6) }}>{r.name}</span>
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: IN.x,
            top: 670,
            fontWeight: 700,
            fontSize: 40,
            color: C.ink,
            opacity: fade(f, wrap, 8),
            translate: `0px ${interpolate(f, [wrap, wrap + 12], [12, 0], { ...clamp, easing: OUT })}px`,
          }}
        >
          Chaque marche retire une famille de pertes.
        </div>
      </Widget>
    </Scene>
  );
};
