// Briques communes des scènes du « TRS en 3 minutes » (DA Fichly, panneau de contrôle, une idée par cadre)
import type React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, KO_SVG, OK_SVG } from "./fichly";

export const FPS = 30;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const at = (s: number) => Math.round(s * FPS);
export const fade = (frame: number, start: number, dur = 8) => interpolate(frame, [start, start + dur], [0, 1], clamp);
export const pop = (frame: number, start: number) =>
  spring({ frame: frame - start, fps: FPS, config: { damping: 12, stiffness: 190, mass: 0.6 } });
export const settle = (frame: number, start: number) =>
  spring({ frame: frame - start, fps: FPS, config: { damping: 15, stiffness: 120 } });
export const pulse = (frame: number, period = 30) => 0.5 + 0.5 * Math.cos((frame / period) * 2 * Math.PI);

// Le widget : une carte du panneau de contrôle, au centre de l'image
export const CARD = { x: 160, y: 150, w: 1600, h: 780 };
export const IN = { x: 70, w: 1460 }; // zone utile à l'intérieur de la carte

// Fond papier, ruban et logo : ils restent fixes pendant les fondus entre scènes
// `brand` (0 → 1) fait apparaître le ruban et le logo, une fois que l'intro les a posés à leur place
export const Decor: React.FC<{ brand?: number }> = ({ brand = 1 }) => (
  <>
    <Img src={staticFile("paper.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 18, display: "flex", opacity: brand }}>
      {C.ribbon.map((c) => (
        <i key={c} style={{ flex: 1, background: c }} />
      ))}
    </div>
    <Img src={staticFile("fichly-logo.png")} style={{ position: "absolute", right: 46, bottom: 36, width: 142, opacity: brand }} />
  </>
);

export const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, color: C.ink }}>{children}</div>
);

export const Eyebrow: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, start);
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: 56,
        background: C.blue,
        color: "#ffffff",
        borderRadius: 999,
        padding: "10px 26px",
        fontWeight: 700,
        fontSize: 30,
        lineHeight: 1,
        whiteSpace: "nowrap",
        transformOrigin: "left center",
        scale: interpolate(p, [0, 1], [0.6, 1]),
        opacity: fade(frame, start, 4),
      }}
    >
      {text}
    </div>
  );
};

export const Badge: React.FC<{ kind: "ok" | "ko"; size?: number; bg?: string }> = ({ kind, size = 36, bg }) => (
  <span
    style={{
      display: "inline-block",
      verticalAlign: "middle",
      width: size,
      height: size,
      borderRadius: "50%",
      flex: "none",
      backgroundColor: bg ?? (kind === "ok" ? C.green : C.red),
      backgroundImage: kind === "ok" ? OK_SVG : KO_SVG,
      backgroundSize: "100%",
    }}
  />
);

// Texte écrit à la machine : la place est réservée dès le départ
export const Typed: React.FC<{ text: string; start: number; cps?: number }> = ({ text, start, cps = 30 }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / FPS) * cps)));
  return (
    <span style={{ whiteSpace: "pre" }}>
      {text.slice(0, n)}
      <span style={{ color: "transparent" }}>{text.slice(n)}</span>
    </span>
  );
};

export const Widget: React.FC<{
  title: React.ReactNode;
  light?: "green" | "red" | "none";
  enter?: boolean;
  children: React.ReactNode;
}> = ({ title, light = "green", enter = false, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        background: C.card,
        border: `2px solid ${C.line}`,
        borderRadius: 32,
        opacity: enter ? fade(frame, 0, 10) : 1,
        translate: enter ? `0px ${interpolate(frame, [0, 16], [30, 0], { ...clamp, easing: OUT })}px` : undefined,
      }}
    >
      <div style={{ position: "absolute", left: IN.x, top: 46, display: "flex", alignItems: "center", gap: 18 }}>
        {light === "none" ? null : (
          <i
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: light === "red" ? C.red : C.green,
              boxShadow: light === "red" ? `0 0 0 ${6 + 10 * (1 - pulse(frame, 12))}px rgba(241,105,105,.3)` : "none",
            }}
          />
        )}
        <span style={{ fontWeight: 700, fontSize: 32, color: C.ink, whiteSpace: "nowrap" }}>{title}</span>
      </div>
      <span
        style={{
          position: "absolute",
          right: IN.x,
          top: 44,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          borderRadius: 999,
          padding: "10px 22px",
          background: C.pLav,
          color: C.blue,
          fontWeight: 700,
          fontSize: 24,
        }}
      >
        <i style={{ width: 14, height: 14, borderRadius: "50%", background: C.green, opacity: 0.35 + 0.65 * pulse(frame) }} />
        En direct
      </span>
      <div style={{ position: "absolute", left: IN.x, right: IN.x, top: 128, height: 2, background: C.line }} />
      {children}
    </div>
  );
};

// Accolade sous une rangée de blocs
export const Brace: React.FC<{ from: number; to: number; top: number; color: string; label: string; opacity: number }> = ({
  from,
  to,
  top,
  color,
  label,
  opacity,
}) => (
  <div style={{ position: "absolute", left: IN.x + from, top, width: to - from, opacity }}>
    <div
      style={{
        height: 14,
        borderLeft: `4px solid ${color}`,
        borderRight: `4px solid ${color}`,
        borderBottom: `4px solid ${color}`,
        borderRadius: "0 0 8px 8px",
      }}
    />
    <div style={{ marginTop: 12, textAlign: "center", fontWeight: 700, fontSize: 30, color, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);

export const Sub: React.FC<{ text: string; opacity?: number }> = ({ text, opacity = 1 }) => (
  <div style={{ position: "absolute", left: IN.x, top: 170, fontWeight: 600, fontSize: 28, color: C.blue, opacity }}>{text}</div>
);
