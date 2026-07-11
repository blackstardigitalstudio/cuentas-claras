import type { ElementType } from "react";

// Hero fotográfico "agresivo": foto real + velo oscuro fuerte + titular ENORME
// en mayúsculas con degradado neón + cifra-shock. Sin hooks (server o client).

export default function HeroBanner({
  src,
  alt = "",
  kicker,
  title,
  highlight,
  stat,
  statLabel,
  accent = "#22d3ee",
  accent2 = "#a78bfa",
  as: Tag = "p" as ElementType,
}: {
  src: string;
  alt?: string;
  kicker?: string;
  title: string;
  highlight?: string;
  stat?: string;
  statLabel?: string;
  accent?: string;
  accent2?: string;
  as?: ElementType;
}) {
  return (
    <figure className="relative w-full aspect-[16/10] sm:aspect-[16/6.5] md:aspect-[24/7] overflow-hidden rounded-2xl border border-[var(--panel-border)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
      {/* velos: oscuro a la izquierda (legibilidad) + subida desde abajo + tinte neón */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070f] via-[#05070f]/75 to-[#05070f]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/20 to-transparent" />
      <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{ background: `radial-gradient(80% 90% at 0% 100%, ${accent}, transparent 60%)` }} />
      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, ${accent2}, transparent)` }} />

      <figcaption className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 md:p-9 max-w-[92%]">
        {kicker && (
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-2.5" style={{ color: accent }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-70 motion-safe:animate-ping" style={{ background: accent }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: accent }} />
            </span>
            {kicker}
          </span>
        )}
        <Tag className="font-black uppercase leading-[0.92] tracking-tight text-[26px] sm:text-4xl md:text-5xl drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] text-white">
          {title}
          {highlight && (
            <>
              {" "}
              <span style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{highlight}</span>
            </>
          )}
        </Tag>
        {stat && (
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="tabular font-black text-3xl sm:text-5xl leading-none" style={{ color: accent }}>{stat}</span>
            {statLabel && <span className="text-[12px] sm:text-sm text-white/70 font-medium">{statLabel}</span>}
          </div>
        )}
      </figcaption>
    </figure>
  );
}
