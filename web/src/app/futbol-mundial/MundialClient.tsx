"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import { formatCompact } from "@/lib/format";
import { LEAGUES, LEAGUE_SOURCE, CLUB_REVENUE, REVENUE_SOURCE, REVENUE_SEASON } from "@/data/futbol";

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const leagues = [...LEAGUES].sort((a, b) => b.revenue - a.revenue);
  const maxL = leagues[0].revenue;
  const clubs = [...CLUB_REVENUE].sort((a, b) => b.amount - a.amount);
  const maxC = clubs[0].amount;
  const richestLeague = leagues[0];
  const worstNet = [...LEAGUES].sort((a, b) => a.net - b.net)[0];
  const flag = (c: "es" | "it") => (c === "es" ? "🇪🇸" : "🇮🇹");

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/spain-stadium.jpg"
          alt={it ? "Stadio di calcio" : "Estadio de fútbol"}
          kicker={it ? "🌍 Calcio mondiale · dati ufficiali" : "🌍 Fútbol mundial · datos oficiales"}
          title={it ? "I SOLDI DEL CALCIO" : "EL DINERO DEL FÚTBOL"}
          highlight={it ? "MONDIALE" : "MUNDIAL"}
          stat={formatCompact(richestLeague.revenue)}
          statLabel={it ? `la ${richestLeague.league}, il campionato più ricco` : `la ${richestLeague.league}, la liga más rica`}
          accent="#34d399"
          accent2="#22d3ee"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {it
            ? "Quali leghe e quali club incassano di più al mondo? Solo dati ufficiali."
            : "¿Qué ligas y qué clubes ingresan más en el mundo? Solo datos oficiales."}
        </p>
      </header>

      <Link href="/mundial-2026/" className="mt-4 glass p-4 flex items-center justify-between gap-3 group hover:border-cyan transition">
        <span>
          <span className="block font-semibold">🏆 {it ? "I premi dei Mondiali 2026" : "Los premios del Mundial 2026"}</span>
          <span className="block text-xs text-muted">{it ? "Quanto guadagna chi vince e ogni nazionale · cifre FIFA" : "Cuánto gana el campeón y cada selección · cifras FIFA"}</span>
        </span>
        <span className="text-cyan text-lg shrink-0 transition-transform group-hover:translate-x-0.5">→</span>
      </Link>

      <div className="mt-5">
        <SimpleExplainer title={it ? "In parole semplici" : "En cristiano"} by={it ? "te lo spiega Claro" : "te lo explica Claro"}>
          <p>{it
            ? "«Ricavi» = i soldi che entrano in un anno (biglietti, TV, sponsor). Non è quanto «vale» la squadra."
            : "«Ingresos» = el dinero que entra en un año (entradas, TV, patrocinios). No es cuánto «vale» el equipo."}</p>
        </SimpleExplainer>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { v: formatCompact(richestLeague.revenue), l: it ? `Lega più ricca (${richestLeague.league})` : `Liga más rica (${richestLeague.league})`, c: "#34d399" },
          { v: formatCompact(clubs[0].amount), l: it ? `Club che incassa di più (${clubs[0].club})` : `Club que más ingresa (${clubs[0].club})`, c: "#22d3ee" },
          { v: `−${formatCompact(Math.abs(worstNet.net))}`, l: it ? `Perde di più (${worstNet.league})` : `La que más pierde (${worstNet.league})`, c: "#f472b6" },
        ].map((k) => (
          <div key={k.l} className="glass p-4 text-center">
            <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
            <p className="text-[11px] text-muted mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      {/* Grandes ligas */}
      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold">🏆 {it ? "Le grandi leghe del mondo" : "Las grandes ligas del mundo"}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{it ? "Ricavi totali di ogni campionato. In parole semplici: quanti soldi girano in tutto il torneo." : "Ingresos totales de cada liga. En cristiano: cuánto dinero mueve todo el campeonato."}</p>
        <ol className="space-y-1.5">
          {leagues.map((l, i) => (
            <li key={l.league} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{l.league}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-green to-cyan" style={{ width: `${Math.max(6, (l.revenue / maxL) * 100)}%` }} />
                </span>
                <span className="text-[10px] text-muted">{it ? `${l.wageToRevenue}% dei ricavi in stipendi · ${l.net >= 0 ? "utile" : "perdita"} ${formatCompact(Math.abs(l.net))}` : `${l.wageToRevenue}% de los ingresos en salarios · ${l.net >= 0 ? "beneficio" : "pérdida"} ${formatCompact(Math.abs(l.net))}`}</span>
              </span>
              <span className="tabular text-sm font-semibold text-green shrink-0">{formatCompact(l.revenue)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">{it ? "Fonte: " : "Fuente: "}<a href={LEAGUE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{LEAGUE_SOURCE.name}</a></p>
      </section>

      {/* Clubes más ricos */}
      <section className="mt-12">
        <h2 className="text-lg md:text-xl font-semibold">💶 {it ? "I club che incassano di più" : "Los clubes que más ingresan"} · {REVENUE_SEASON}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{it ? "Il Real Madrid è l'unico club al mondo sopra il miliardo di euro di ricavi." : "El Real Madrid es el único club del mundo por encima de los 1.000 M€ de ingresos."}</p>
        <ol className="space-y-1.5">
          {clubs.map((c, i) => (
            <li key={c.club} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
              <span className="text-base shrink-0">{flag(c.country)}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{c.club}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${Math.max(6, (c.amount / maxC) * 100)}%` }} />
                </span>
              </span>
              <span className="tabular text-sm font-semibold text-cyan shrink-0">{formatCompact(c.amount)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">{it ? "Fonte: " : "Fuente: "}<a href={REVENUE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{REVENUE_SOURCE.name}</a></p>
      </section>

      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href="/futbol/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {it ? "🇪🇸🇮🇹 Spagna e Italia nel dettaglio →" : "🇪🇸🇮🇹 España e Italia en detalle →"}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function MundialClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
