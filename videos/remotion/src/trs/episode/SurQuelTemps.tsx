// Cadre 17 « Sur quel temps ? » · une idée : devant un taux, demander toujours sur quel temps il est calculé.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, Eyebrow, fade, IN, OUT, pop, rise, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

const TILES = [
  { name: "TRS", pct: "77 %", den: "÷ 14 h requises" },
  { name: "TRG", pct: "68 %", den: "÷ 16 h d'ouverture" },
  { name: "TRE", pct: "45 %", den: "÷ 24 h de la journée" },
];
const TW = 440;
const GAP = (IN.w - 3 * TW) / 2;

export const SurQuelTemps: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const mark = interpolate(f, [T(224.84), T(224.84) + 10], [0, 100], { ...clamp, easing: OUT });
  return (
    <Scene>
      <Eyebrow text="Sur quel temps ?" start={T(221.98)} />
      <Widget title="Devant un taux qu'on vous annonce" light="none">
        {TILES.map((t, i) => {
          const at = T(222.1) + i * 4;
          const p = pop(f, at);
          return (
            <div
              key={t.name}
              style={{
                position: "absolute",
                left: IN.x + i * (TW + GAP),
                top: 180,
                width: TW,
                height: 330,
                borderRadius: 26,
                background: C.pLav,
                opacity: fade(f, at, 5),
                scale: interpolate(p, [0, 1], [0.85, 1]),
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 30,
                  top: 28,
                  borderRadius: 999,
                  padding: "8px 24px",
                  background: C.blue,
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 32,
                }}
              >
                {t.name}
              </span>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 100,
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: 120,
                  lineHeight: 1,
                  color: C.blue,
                }}
              >
                {t.pct}
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 32,
                    color: C.ink,
                    padding: "4px 14px",
                    borderRadius: 10,
                    background: `linear-gradient(90deg, ${C.yellow} ${mark}%, transparent ${mark}%)`,
                  }}
                >
                  {t.den}
                </span>
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 580,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 64,
            color: C.ink,
            opacity: fade(f, T(224.0), 8),
            translate: `0px ${rise(f, T(224.0), 16)}px`,
          }}
        >
          Sur quel temps est-il calculé ?
        </div>
      </Widget>
    </Scene>
  );
};
