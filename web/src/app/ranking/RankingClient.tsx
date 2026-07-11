"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import { COUNTRIES, type CountryCode } from "@/lib/data";
import { formatCompact } from "@/lib/format";

function ranked(p: CountryCode) {
  return Object.values(COUNTRIES[p].regions)
    .filter((r) => !r.isSample)
    .sort((a, b) => b.gastos - a.gastos);
}

function Section({ pais, title, flag }: { pais: CountryCode; title: string; flag: string }) {
  const rows = ranked(pais);
  if (!rows.length) return null;
  const max = rows[0].gastos;
  return (
    <section className="mt-10">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        {flag} {title} <span className="text-muted font-normal text-sm">· {rows.length}</span>
      </h2>
      <ol className="space-y-1.5">
        {rows.map((r, i) => (
          <li key={r.slug}>
            <Link href={`/${pais}/${r.slug}/`} className="glass flex items-center gap-3 px-3 py-2.5 hover:border-[rgba(34,211,238,0.45)] transition group">
              <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium group-hover:text-fg">{r.name}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-magenta" style={{ width: `${Math.max(4, (r.gastos / max) * 100)}%` }} />
                </span>
              </span>
              <span className="text-right shrink-0">
                <span className="tabular block text-sm font-semibold text-magenta">{formatCompact(r.gastos)}</span>
                <span className="tabular block text-[11px] text-green">{formatCompact(r.ingresos)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const top = [
    ...ranked("es").map((r) => ({ r, pais: "es" as const })),
    ...ranked("it").map((r) => ({ r, pais: "it" as const })),
  ].sort((a, b) => b.r.gastos - a.r.gastos)[0];

  const es = <Section key="es" pais="es" title={it ? "Spagna" : "España"} flag="🇪🇸" />;
  const italia = <Section key="it" pais="it" title="Italia" flag="🇮🇹" />;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          as="h1"
          src="/photos/money.jpg"
          alt={it ? "Euro · soldi pubblici" : "Euro · dinero público"}
          kicker={it ? "🇪🇸🇮🇹 Spagna e Italia · dati ufficiali" : "🇪🇸🇮🇹 España e Italia · datos oficiales"}
          title={it ? "CHI SPENDE PIÙ" : "¿QUÉ CIUDAD GASTA MÁS"}
          highlight={it ? "SOLDI PUBBLICI?" : "DINERO PÚBLICO?"}
          stat={formatCompact(top.r.gastos)}
          statLabel={it ? `spende di più (${top.r.name})` : `la que más gasta (${top.r.name})`}
          accent="#22d3ee"
          accent2="#f472b6"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {it
            ? "Quale città spende più soldi pubblici? Comuni di Spagna e Italia ordinati per spesa (in magenta) ed entrate (in verde), con dati ufficiali. Tocca una città per il dettaglio completo."
            : "¿Qué ciudad gasta más dinero público? Ayuntamientos de España e Italia ordenados por gasto (en magenta) e ingresos (en verde), con datos oficiales. Toca una ciudad para ver el desglose completo."}
        </p>
      </header>

      {it ? [italia, es] : [es, italia]}

      <p className="mt-10">
        <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {it ? "Vedi la mappa interattiva →" : "Ver el mapa interactivo →"}
        </Link>
      </p>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function RankingClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
