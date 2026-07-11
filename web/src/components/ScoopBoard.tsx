"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import ScoopSection from "./ScoopSection";
import HeroBanner from "./HeroBanner";

// Cuerpo de la página /escandalos: cabecera + los 4 filones temáticos + aviso legal.
export default function ScoopBoard() {
  const { m, locale } = useLocale();
  const it = locale === "it";
  return (
    <>
      <div className="pt-6">
        <HeroBanner
          as="h1"
          src="/photos/justice.jpg"
          alt={it ? "Palazzo di giustizia" : "Palacio de justicia"}
          kicker={m.scoop.eyebrow}
          title={it ? "SCANDALI DEI" : "ESCÁNDALOS DEL"}
          highlight={it ? "SOLDI PUBBLICI" : "DINERO PÚBLICO"}
          accent="#ff5252"
          accent2="#f472b6"
        />
        <p className="text-sm md:text-base text-muted mt-4 max-w-2xl">{m.scoop.subtitle}</p>
      </div>

      <ScoopSection theme="scoop" />
      <ScoopSection theme="funds" />
      <ScoopSection theme="verdicts" />
      <ScoopSection theme="waste" />
      <ScoopSection theme="investigations" />
      <ScoopSection theme="salaries" />
      <ScoopSection theme="works" />
      <ScoopSection theme="subsidies" />
      <ScoopSection theme="taxes" />
      <ScoopSection theme="transparency" />
      <ScoopSection theme="nepotism" />
      <ScoopSection theme="sanctions" />

      <p className="mt-12 text-[11px] leading-relaxed text-muted/70 max-w-4xl border-t border-[var(--panel-border)] pt-5">
        {m.scoop.disclaimer}
      </p>
    </>
  );
}
