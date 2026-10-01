// Intro : le logo Fichly s'écrit, son ruban se pose, puis tous deux rejoignent leur place ; le titre se construit sur la voix.
// Voix : « Aujourd'hui, on va comprendre ce qu'est le TRS, le taux de rendement synthétique. Et tout ça, en trois minutes. »
import type React from "react";
import { Easing, interpolate } from "remotion";
import { C } from "../fichly";
import { LogoFichly } from "../LogoFichly";
import { clamp, fade, OUT, pop, Scene, Typed } from "../ui";
import { HANDOFF, T, useG } from "./timeline";

const FLY = [52, HANDOFF]; // le logo et le ruban glissent vers leur place
const BIG = { x: 580, y: 300, w: 760 };
const SMALL = { x: 1920 - 46 - 142, y: 1080 - 36 - (142 * 470) / 890, w: 142 };

export const Intro: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const draw = interpolate(f, [3, 34], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const dot = pop(f, 32);
  const fly = interpolate(f, FLY, [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ribbon = interpolate(f, [34, 50], [0, 1], { ...clamp, easing: OUT });
  const title = pop(f, T(1.52));
  const wipe = interpolate(f, [T(4.1), T(4.1) + 14], [0, 100], { ...clamp, easing: OUT });
  const lerp = (a: number, b: number) => a + (b - a) * fly;
  return (
    <Scene>
      {f < HANDOFF + 2 ? (
        <>
          <LogoFichly
            width={lerp(BIG.w, SMALL.w)}
            draw={draw}
            dot={dot}
            style={{ position: "absolute", left: lerp(BIG.x, SMALL.x), top: lerp(BIG.y, SMALL.y) }}
          />
          <div
            style={{
              position: "absolute",
              left: lerp(BIG.x, 0),
              top: lerp(BIG.y + 440, 1080 - 18),
              width: lerp(BIG.w, 1920) * ribbon,
              height: lerp(16, 18),
              display: "flex",
              borderRadius: lerp(8, 0),
              overflow: "hidden",
            }}
          >
            {C.ribbon.map((c) => (
              <i key={c} style={{ flex: 1, background: c }} />
            ))}
          </div>
        </>
      ) : null}

      {/* le titre, sur la voix */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 190,
            lineHeight: 1,
            letterSpacing: -2,
            color: C.blue,
            opacity: fade(f, T(1.52), 6),
            scale: interpolate(title, [0, 1], [0.85, 1]),
          }}
        >
          Le TRS
        </div>
        <div
          style={{
            marginTop: 26,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: 1,
            color: "#ffffff",
            background: C.blue,
            borderRadius: 26,
            padding: "14px 46px 30px",
            clipPath: `inset(0 ${100 - wipe}% 0 0 round 26px)`,
          }}
        >
          en 3 minutes.
        </div>
        <div style={{ marginTop: 40, fontWeight: 600, fontSize: 40, color: C.blue }}>
          <Typed text="Taux de rendement synthétique" start={T(2.36)} cps={30} />
        </div>
      </div>
    </Scene>
  );
};
