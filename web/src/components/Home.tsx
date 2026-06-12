"use client";

import Link from "next/link";
import Explorer from "@/components/Explorer";
import News from "@/components/News";
import { CountUp, Reveal } from "@/components/Motion";
import LangSwitch from "@/components/LangSwitch";
import { useLocale } from "@/i18n/LocaleProvider";
import { REGIONS, TOTALS, DATA_SOURCE_URL, COUNTRIES, type CountryCode } from "@/lib/data";

const bcn = REGIONS["Barcelona"];

export default function Home() {
  const { locale, m } = useLocale();
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      {/* Barra superior: marca + idioma */}
      <div className="flex items-center justify-between pt-4">
        <span className="neon-text font-semibold tracking-tight">Cuentas Claras</span>
        <LangSwitch />
      </div>

      {/* Aviso de integridad de datos */}
      <div className="mt-3 flex justify-center">
        <div className="text-center text-[12px] text-muted bg-[rgba(120,160,255,0.06)] border border-[var(--panel-border)] rounded-full px-4 py-1.5 inline-flex items-center gap-2">
          <span className="text-green">● {m.banner.real}</span>
          <span className="opacity-50">·</span>
          <span className="text-amber/90">{m.banner.sample}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="text-center pt-10 md:pt-16 pb-10">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-cyan/80 mb-4">{m.hero.eyebrow}</p>
        <h1 className="title-glow text-4xl md:text-6xl font-bold leading-[1.05] inline-block">
          {m.hero.titleA}
          <span className="neon-text">{m.hero.highlight}</span>
          {m.hero.titleB}
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted max-w-2xl mx-auto">{m.hero.subtitle}</p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <a
            href="#explorar"
            className="px-6 py-3 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition shadow-[0_0_30px_-6px_var(--cyan)]"
          >
            {m.hero.cta1}
          </a>
          <a
            href={DATA_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-medium border border-[var(--panel-border)] text-muted hover:text-fg transition"
          >
            {m.hero.cta2}
          </a>
        </div>
      </section>

      {/* Tira de estadísticas */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {[
          { label: m.stats.provinces, value: TOTALS.count, kind: "int" as const },
          { label: m.stats.income, value: bcn.ingresos, kind: "compact" as const },
          { label: m.stats.expense, value: bcn.gastos, kind: "compact" as const },
          { label: m.stats.realLabel, value: null as number | null, text: "Open Data" },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="glass px-4 py-5 text-center">
              <p className="tabular text-xl md:text-2xl font-semibold neon-text">
                {s.value === null ? s.text : <CountUp value={s.value} kind={s.kind} />}
              </p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Explorador */}
      <Explorer />

      {/* Cómo funciona */}
      <section className="mt-16 grid md:grid-cols-3 gap-4">
        {[
          { t: m.how.t1, d: m.how.d1 },
          { t: m.how.t2, d: m.how.d2 },
          { t: m.how.t3, d: m.how.d3 },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 0.1}>
            <div className="glass p-5 h-full">
              <h3 className="font-semibold mb-2">{c.t}</h3>
              <p className="text-sm text-muted">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Noticias */}
      <News />

      {/* Directorio de ciudades (enlaces internos para SEO + navegación) */}
      <section className="mt-16">
        <h2 className="text-xl md:text-2xl font-semibold">{locale === "it" ? "Tutte le città" : "Todas las ciudades"}</h2>
        <p className="text-sm text-muted mt-1 mb-5">
          {locale === "it"
            ? "Apri la pagina di ogni città per il dettaglio di entrate e spese."
            : "Abre la página de cada ciudad para el detalle de ingresos y gastos."}
        </p>
        <div className="space-y-4">
          {(["es", "it"] as CountryCode[]).map((p) => (
            <div key={p}>
              <h3 className="text-xs uppercase tracking-widest text-cyan/80 mb-2">
                {p === "es" ? "🇪🇸 España" : "🇮🇹 Italia"}
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
                {Object.values(COUNTRIES[p].regions)
                  .filter((r) => !r.isSample)
                  .sort((a, b) => a.name.localeCompare(b.name, "es"))
                  .map((r) => (
                    <Link key={r.slug} href={`/${p}/${r.slug}`} className="text-cyan/75 hover:text-fg transition">
                      {r.name}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted flex flex-col md:flex-row items-center justify-between gap-3">
        <p>
          <span className="neon-text font-semibold">Cuentas Claras</span> · {m.footer.data}{" "}
          <a href={DATA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
            Ministerio de Hacienda
          </a>
        </p>
        <p>{m.footer.tagline} · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}
