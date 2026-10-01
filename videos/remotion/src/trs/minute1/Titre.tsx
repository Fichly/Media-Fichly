// Titre de la série, juste après l'accroche : « Le TRS / en 3 minutes. » (titre en deux temps de la DA Fichly)
import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../fichly";
import { at, clamp, fade, OUT, Scene } from "../ui";

export const TITRE_DURATION = at(2.4);

export const Titre: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [8, 24], [0, 100], { ...clamp, easing: OUT });
  return (
    <Scene>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 190,
            lineHeight: 1,
            letterSpacing: -2,
            color: C.blue,
            opacity: fade(frame, 0, 8),
            translate: `0px ${interpolate(frame, [0, 16], [30, 0], { ...clamp, easing: OUT })}px`,
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
      </div>
    </Scene>
  );
};
