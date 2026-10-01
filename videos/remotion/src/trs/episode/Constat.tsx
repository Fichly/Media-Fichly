// Cadre 2 « Le constat » · une idée : la presse a tourné 16 h, et il manque plus de 3 heures.
import type React from "react";
import { interpolate } from "remotion";
import { C } from "../fichly";
import { clamp, Eyebrow, fade, IN, pop, Scene, Widget } from "../ui";
import { T, useG } from "./timeline";

// La presse : elle frappe en continu, les pièces sortent à droite
const Presse: React.FC<{ f: number }> = ({ f }) => {
  const stroke = 0.5 - 0.5 * Math.cos((f / 22) * 2 * Math.PI);
  return (
    <svg viewBox="0 0 460 520" width={460} height={520} style={{ position: "absolute", left: IN.x + 10, top: 190 }}>
      <rect x="40" y="20" width="380" height="90" rx="22" fill={C.blue} />
      <rect x="70" y="44" width="200" height="40" rx="10" fill="#ffffff" />
      <rect x="84" y="56" width={60 + 110 * ((f % 90) / 90)} height="16" rx="8" fill={C.green} />
      <circle cx="372" cy="64" r="18" fill={C.green} />
      <rect x="60" y="110" width="44" height="300" rx="12" fill={C.blue} />
      <rect x="356" y="110" width="44" height="300" rx="12" fill={C.blue} />
      <rect x="196" y="110" width="68" height={40 + 90 * stroke} fill={C.blue} opacity=".85" />
      <rect x="150" y={150 + 90 * stroke} width="160" height="56" rx="10" fill="#ffffff" stroke={C.blue} strokeWidth="6" />
      <rect x="120" y="330" width="220" height="40" rx="10" fill={C.pLav} stroke={C.blue} strokeWidth="6" />
      <rect x="20" y="410" width="420" height="60" rx="16" fill={C.blue} />
      {[0, 1, 2].map((k) => {
        const t = ((f + k * 30) % 90) / 90;
        return <rect key={k} x={200 + 230 * t} y="300" width="56" height="30" rx="7" fill={C.yellow} opacity={t < 0.8 ? 1 : (1 - t) / 0.2} />;
      })}
    </svg>
  );
};

const Big: React.FC<{ f: number; at: number; top: number; color: string; value: string; unit: string; shake?: boolean }> = ({
  f,
  at,
  top,
  color,
  value,
  unit,
  shake,
}) => {
  const p = pop(f, at);
  const dx = shake ? interpolate(f, [at, at + 3, at + 6, at + 9], [0, -8, 6, 0], clamp) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 640,
        top,
        display: "flex",
        alignItems: "baseline",
        gap: 22,
        translate: `${dx}px 0px`,
        opacity: fade(f, at, 4),
        scale: interpolate(p, [0, 1], [0.7, 1]),
        transformOrigin: "left center",
      }}
    >
      <span style={{ fontWeight: 800, fontSize: 140, lineHeight: 1, color }}>{value}</span>
      <span style={{ fontWeight: 600, fontSize: 36, color }}>{unit}</span>
    </div>
  );
};

export const Constat: React.FC<{ o: number }> = ({ o }) => {
  const f = useG(o);
  const q = pop(f, T(16.12));
  const trs = pop(f, T(18.94));
  return (
    <Scene>
      <Eyebrow text="Pour commencer" start={T(7.0)} />
      <Widget title="Presse · ligne 2" enter>
        <Presse f={f} />
        <div style={{ position: "absolute", left: 640, top: 190, fontWeight: 600, fontSize: 30, color: C.blue, opacity: fade(f, T(9.62)) }}>
          Toute la journée, en 2 équipes
        </div>
        <Big f={f} at={T(11.58)} top={236} color={C.blue} value="16 h" unit="d'ouverture" />
        <div style={{ position: "absolute", left: 640, top: 430, fontWeight: 700, fontSize: 44, color: C.ink, opacity: fade(f, T(14.0)) }}>
          Il manque plus de
        </div>
        <Big f={f} at={T(14.6)} top={488} color={C.tRed} value="3 h" unit="de production" shake />
        <div style={{ position: "absolute", left: 640, top: 668, display: "flex", gap: 18, alignItems: "center" }}>
          <span
            style={{
              borderRadius: 999,
              padding: "14px 30px",
              background: C.pLav,
              color: C.blue,
              fontWeight: 700,
              fontSize: 38,
              whiteSpace: "nowrap",
              opacity: fade(f, T(16.12), 4),
              scale: interpolate(q, [0, 1], [0.6, 1]),
            }}
          >
            Où sont-elles passées ?
          </span>
          <span
            style={{
              borderRadius: 999,
              padding: "14px 30px",
              background: C.blue,
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 38,
              opacity: fade(f, T(18.94), 4),
              scale: interpolate(trs, [0, 1], [0.6, 1]),
            }}
          >
            → le TRS
          </span>
        </div>
      </Widget>
    </Scene>
  );
};
