"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import ScoopSection from "./ScoopSection";

// Cuerpo de la página /escandalos: cabecera + los 4 filones temáticos + aviso legal.
export default function ScoopBoard() {
  const { m } = useLocale();
  return (
    <>
      <header className="pt-8">
        <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#ff7a7a]">{m.scoop.eyebrow}</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-2 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff5252] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff5252]" />
          </span>
          {m.scoop.title}
        </h1>
        <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">{m.scoop.subtitle}</p>
      </header>

      <ScoopSection theme="scoop" />
      <ScoopSection theme="funds" />
      <ScoopSection theme="verdicts" />
      <ScoopSection theme="waste" />
      <ScoopSection theme="investigations" />
      <ScoopSection theme="nepotism" />
      <ScoopSection theme="sanctions" />

      <p className="mt-12 text-[11px] leading-relaxed text-muted/70 max-w-4xl border-t border-[var(--panel-border)] pt-5">
        {m.scoop.disclaimer}
      </p>
    </>
  );
}
