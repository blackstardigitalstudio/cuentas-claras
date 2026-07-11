import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { CLUBS, type ClubMetrics } from "../../web/src/data/futbol";

export const FPS = 30;
export const DURATION = 16 * FPS; // 16 s

const SITE = "cuentas-clara.com";
const eur = (n: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const GREEN = "#34d399";
const ORANGE = "#fdba74";
const INK = "#eaf1ff";
const MUTE = "#93a4c8";

const FONT = "Arial, 'Segoe UI', system-ui, sans-serif";

/* Número que sube (count-up) con easing. */
const CountEuro: React.FC<{ value: number; delay?: number }> = ({ value, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <>{eur(Math.round(value * p))}</>;
};

const ROW_START = 46; // frame en el que empiezan a entrar las tarjetas
const ROW_STAGGER = 12;

const StatRow: React.FC<{ label: string; value: number; hint: string; accent: string; index: number }> = ({ label, value, hint, accent, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = ROW_START + index * ROW_STAGGER;
  const enter = spring({ frame: frame - start, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [50, 0]);
  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${y}px)`,
        background: "rgba(120,160,255,0.06)",
        border: `2px solid ${accent}55`,
        borderRadius: 28,
        padding: "30px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span style={{ fontSize: 38, color: MUTE, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 84, color: accent, fontWeight: 900, fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>
        <CountEuro value={value} delay={start} />
      </span>
      <span style={{ fontSize: 28, color: "rgba(147,164,200,0.75)" }}>{hint}</span>
    </div>
  );
};

export const ClubVideo: React.FC<{ slug: string }> = ({ slug }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c: ClubMetrics | undefined = CLUBS[slug];
  if (!c) return <AbsoluteFill style={{ background: "#060810" }} />;

  const rows: { label: string; value: number; hint: string; accent: string }[] = [];
  if (c.revenue) rows.push({ label: "Ingresos / año", value: c.revenue, hint: "lo que factura el club", accent: GREEN });
  if (c.wageBill) rows.push({ label: "Salarios", value: c.wageBill, hint: "coste de la plantilla", accent: CYAN });
  if (c.limite) rows.push({ label: "Límite salarial", value: c.limite, hint: "tope LaLiga en plantilla", accent: VIOLET });
  if (c.debt) rows.push({ label: `Deuda (${c.debt.kind})`, value: c.debt.amount, hint: `a ${c.debt.year}`, accent: ORANGE });

  const league = c.league === "laliga" ? "LaLiga · España" : "Serie A · Italia";

  // Intro / título del club.
  const titleIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const kicker = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Outro CTA.
  const outroStart = DURATION - 3 * fps;
  const outro = spring({ frame: frame - outroStart, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "linear-gradient(160deg,#060810 0%,#0b1226 100%)", color: INK }}>
      {/* Glow */}
      <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 12%, rgba(34,211,238,0.16), transparent 70%)" }} />
      {/* Barra neón superior */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: `linear-gradient(90deg, ${GREEN}, ${CYAN}, ${VIOLET})` }} />

      {/* Marca */}
      <div style={{ position: "absolute", top: 70, left: 70, right: 70, display: "flex", justifyContent: "space-between", opacity: kicker }}>
        <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: 4, color: "#7dd3fc" }}>CUENTAS CLARAS</span>
        <span style={{ fontSize: 30, color: MUTE }}>datos oficiales</span>
      </div>

      {/* Título del club */}
      <div style={{ position: "absolute", top: 210, left: 70, right: 70, opacity: titleIn, transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)` }}>
        <div style={{ fontSize: 40, color: CYAN, fontWeight: 700, marginBottom: 10 }}>Las cuentas del</div>
        <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 1.02, background: `linear-gradient(90deg,${CYAN},${VIOLET})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{c.name}</div>
        <div style={{ fontSize: 36, color: MUTE, marginTop: 12 }}>{league}</div>
      </div>

      {/* Stats */}
      <div style={{ position: "absolute", top: 620, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 24 }}>
        {rows.map((r, i) => (
          <StatRow key={r.label} {...r} index={i} />
        ))}
      </div>

      {/* CTA final */}
      <div style={{ position: "absolute", bottom: 120, left: 70, right: 70, opacity: outro, transform: `translateY(${interpolate(outro, [0, 1], [24, 0])}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 34, color: MUTE, marginBottom: 12 }}>Todos los números, con su fuente oficial:</div>
        <div style={{ fontSize: 52, fontWeight: 800, color: INK }}>
          {SITE}<span style={{ color: CYAN }}>/futbol/{slug}</span>
        </div>
      </div>

      {/* Nota integridad */}
      <div style={{ position: "absolute", bottom: 54, left: 0, right: 0, textAlign: "center", fontSize: 24, color: "rgba(147,164,200,0.6)" }}>
        Solo cifras oficiales · sin valores de mercado · Made in Italy
      </div>
    </AbsoluteFill>
  );
};
