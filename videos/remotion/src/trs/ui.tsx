// Briques communes des scènes du « TRS en 3 minutes » (DA Fichly, panneau de contrôle, une idée par cadre)
import type React from "react";
import { createContext, useContext } from "react";
import { Easing, Img, interpolate, interpolateColors, spring, staticFile, useCurrentFrame } from "remotion";
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
export const rise = (frame: number, start: number, px = 14, dur = 12) => interpolate(frame, [start, start + dur], [px, 0], { ...clamp, easing: OUT });
// Compteur qui défile jusqu'à sa valeur, et son affichage à la française (virgule décimale)
export const count = (frame: number, start: number, end: number, to: number, from = 0) =>
  interpolate(frame, [start, end], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
export const fr = (v: number, decimals = 0) => v.toFixed(decimals).replace(".", ",");
export const mix = (p: number, a: string, b: string) => interpolateColors(p, [0, 1], [a, b]);

// Image de la vidéo entière, lue depuis n'importe quel composant d'une scène :
// chaque séquence déclare son point de départ, les repères T(…) restent ceux de la vidéo
export const FrameOffset = createContext(0);
export const useFrame = () => useCurrentFrame() + useContext(FrameOffset);

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

export const Eyebrow: React.FC<{ text: string; start: number; end?: number }> = ({ text, start, end }) => {
  const frame = useFrame();
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
        opacity: fade(frame, start, 4) * (end === undefined ? 1 : 1 - fade(frame, end, 6)),
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
  const frame = useFrame();
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
  light?: "green" | "red" | "yellow" | "none";
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
              background: light === "red" ? C.red : light === "yellow" ? C.yellow : C.green,
              boxShadow:
                light === "red"
                  ? `0 0 0 ${6 + 10 * (1 - pulse(frame, 12))}px rgba(241,105,105,.3)`
                  : light === "yellow"
                    ? `0 0 0 ${4 + 6 * (1 - pulse(frame, 18))}px rgba(230,184,57,.3)`
                    : "none",
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

// Pastille de texte : arrive avec un léger ressort sur le mot qui la nomme
export const Pill: React.FC<{
  start: number;
  bg: string;
  fg: string;
  badge?: "ok" | "ko";
  badgeBg?: string;
  size?: number;
  dashed?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ start, bg, fg, badge, badgeBg, size = 28, dashed, style, children }) => {
  const frame = useFrame();
  const p = pop(frame, start);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        borderRadius: 999,
        padding: `${Math.round(size * 0.4)}px ${Math.round(size * 0.85)}px`,
        background: bg,
        color: fg,
        border: dashed ? `3px dashed ${dashed}` : undefined,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        whiteSpace: "nowrap",
        opacity: fade(frame, start, 4),
        scale: interpolate(p, [0, 1], [0.6, 1]),
        ...style,
      }}
    >
      {badge ? <Badge kind={badge} size={Math.round(size * 1.15)} bg={badgeBg} /> : null}
      {children}
    </span>
  );
};

// La ligne de résultat : « 12 h ÷ 14 h = 85,7 % de disponibilité »
export const Equation: React.FC<{
  top: number;
  left?: number;
  lhs: React.ReactNode;
  lhsAt: number;
  value: string;
  valueAt: number;
  label?: string;
  labelAt?: number;
  color?: string;
}> = ({ top, left = IN.x, lhs, lhsAt, value, valueAt, label, labelAt, color = C.blue }) => {
  const frame = useFrame();
  const big = pop(frame, valueAt);
  return (
    <div style={{ position: "absolute", left, top, display: "flex", alignItems: "baseline", gap: 26, whiteSpace: "nowrap" }}>
      <span style={{ fontWeight: 700, fontSize: 64, color: C.ink, opacity: fade(frame, lhsAt, 6), translate: `0px ${rise(frame, lhsAt)}px` }}>
        {lhs}
      </span>
      <span
        style={{
          fontWeight: 800,
          fontSize: 150,
          lineHeight: 1,
          color,
          fontVariantNumeric: "tabular-nums",
          opacity: fade(frame, valueAt, 4),
          scale: interpolate(big, [0, 1], [0.7, 1]),
          transformOrigin: "left 70%",
          display: "inline-block",
        }}
      >
        {value}
      </span>
      {label ? <span style={{ fontWeight: 600, fontSize: 34, color, opacity: fade(frame, labelAt ?? valueAt + 6, 8) }}>{label}</span> : null}
    </div>
  );
};

// Une rangée de blocs : chaque bloc a un poids (1 = présent, 0 = retiré) ; les présents se resserrent
export const rowLayout = (weights: number[], width: number, gap: number, slots = weights.length) => {
  const bw = (width - (slots - 1) * gap) / slots;
  let x = 0;
  return weights.map((wt) => {
    const r = { x, w: bw * wt };
    x += (bw + gap) * wt;
    return r;
  });
};

// Un bloc d'une heure, à la manière des blocs SMED des tuiles Fichly
export const HourBlock: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  bg: string;
  fg?: string;
  dashed?: string;
  hour?: string;
  tag?: string;
  opacity?: number;
  scale?: number;
  dy?: number;
}> = ({ x, y, w, h, bg, fg = "#ffffff", dashed, hour, tag, opacity = 1, scale = 1, dy = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: IN.x + x,
      top: y,
      width: w,
      height: h,
      borderRadius: 14,
      background: bg,
      border: dashed ? `3px dashed ${dashed}` : "none",
      boxSizing: "border-box",
      color: fg,
      overflow: "hidden",
      opacity,
      scale,
      translate: `0px ${dy}px`,
    }}
  >
    {hour ? <span style={{ position: "absolute", left: 10, top: 8, fontSize: 18, fontWeight: 600, opacity: 0.85 }}>{hour}</span> : null}
    {tag ? <span style={{ position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center", fontSize: 20, fontWeight: 700 }}>{tag}</span> : null}
  </div>
);
