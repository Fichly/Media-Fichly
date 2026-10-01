// Cadre 19 « Pour aller plus loin » · une idée : se former (Green Belt, éligible au CPF) et garder les fiches sur le terrain.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, Eyebrow, fade, OUT, Pill, rise, Scene } from "../ui";
import { T, useG } from "./timeline";

const Card: React.FC<{ f: number; x: number; at: number; children: React.ReactNode }> = ({ f, x, at, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 160,
      width: 760,
      height: 560,
      background: C.card,
      border: `2px solid ${C.line}`,
      borderRadius: 32,
      opacity: fade(f, at, 10),
      translate: `0px ${interpolate(f, [at, at + 16], [30, 0], { ...clamp, easing: OUT })}px`,
    }}
  >
    {children}
  </div>
);

// La ceinture verte, nouée
const Ceinture: React.FC = () => (
  <svg viewBox="0 0 260 200" width={250} style={{ position: "absolute", right: 44, top: 330 }}>
    <rect x="0" y="70" width="260" height="56" rx="14" fill={C.green} />
    <rect x="104" y="56" width="52" height="84" rx="12" fill={C.green} stroke={C.card} strokeWidth="8" />
    <path d="M118 140 L 96 196 L 124 186 L 132 140 Z" fill={C.green} />
    <path d="M142 140 L 164 196 L 136 186 L 128 140 Z" fill={C.green} />
  </svg>
);

// Trois fiches en éventail, aux couleurs du ruban
const Fiches: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const open = interpolate(f, [at, at + 18], [0, 1], { ...clamp, easing: OUT });
  const cards = [
    { title: "VSM", band: C.ribbon[1], angle: -14 },
    { title: "5S", band: C.ribbon[3], angle: 0 },
    { title: "DMAIC", band: C.ribbon[0], angle: 14 },
  ];
  return (
    <div style={{ position: "absolute", left: 395, top: 210, width: 340, height: 290 }}>
      {cards.map((c, i) => (
        <div
          key={c.title}
          style={{
            position: "absolute",
            left: 90 + (i - 1) * 62 * open,
            top: 20,
            width: 170,
            height: 236,
            borderRadius: 16,
            background: C.blue,
            boxShadow: "0 10px 24px rgba(35,35,90,.18)",
            rotate: `${c.angle * open}deg`,
            transformOrigin: "50% 100%",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 22, background: c.band }} />
          <div style={{ padding: "16px 16px 0", color: "#ffffff", fontWeight: 800, fontSize: 30 }}>{c.title}</div>
          {[0, 1, 2].map((l) => (
            <div key={l} style={{ margin: "12px 16px 0", height: 10, width: 120 - l * 26, borderRadius: 5, background: "rgba(255,255,255,.45)" }} />
          ))}
          <div style={{ position: "absolute", left: 16, bottom: 14, color: "#ffffff", fontWeight: 700, fontSize: 18, opacity: 0.8 }}>fichly</div>
        </div>
      ))}
    </div>
  );
};

export const SeFormer: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  return (
    <Scene>
      <Eyebrow text="Pour aller plus loin" start={T(235.1)} />

      <Card f={f} x={160} at={T(236.08)}>
        <span
          style={{
            position: "absolute",
            left: 44,
            top: 44,
            borderRadius: 999,
            padding: "10px 24px",
            background: C.blue,
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 26,
          }}
        >
          Formation
        </span>
        <div style={{ position: "absolute", left: 44, top: 140, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.ink }}>Lean</div>
        <div style={{ position: "absolute", left: 44, top: 210, fontWeight: 800, fontSize: 76, lineHeight: 1.1, color: C.tGreen }}>Green Belt</div>
        <Ceinture />
        <div style={{ position: "absolute", left: 44, top: 470 }}>
          <Pill start={T(238.2)} bg={C.pGreen} fg={C.tGreen} badge="ok" size={32}>
            Éligible au CPF
          </Pill>
        </div>
      </Card>

      <Card f={f} x={1000} at={T(239.22)}>
        <span
          style={{
            position: "absolute",
            left: 44,
            top: 44,
            borderRadius: 999,
            padding: "10px 24px",
            background: C.blue,
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 26,
          }}
        >
          Decks de fiches
        </span>
        <div style={{ position: "absolute", left: 44, top: 140, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.ink }}>
          Les fiches
          <br />
          du Lean
        </div>
        <Fiches f={f} at={T(239.6)} />
        <div style={{ position: "absolute", left: 44, top: 470 }}>
          <Pill start={T(240.94)} bg={C.pLav} fg={C.blue} size={32}>
            Au quotidien, sur le terrain
          </Pill>
        </div>
      </Card>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 790,
          textAlign: "center",
          fontWeight: 700,
          fontSize: 42,
          color: C.blue,
          opacity: fade(f, T(242.72), 8),
          translate: `0px ${rise(f, T(242.72), 16)}px`,
        }}
      >
        Tous les liens sont en description ↓
      </div>
    </Scene>
  );
};
