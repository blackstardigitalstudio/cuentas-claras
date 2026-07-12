"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import { formatEuro, formatCompact } from "@/lib/format";
import {
  LALIGA_LCPD, LALIGA_LCPD_SEASON, LALIGA_LCPD_SOURCE,
  CLUB_REVENUE, REVENUE_SEASON, REVENUE_SOURCE, CLUB_DEBT,
  SERIE_A, SERIE_A_SEASON, SERIE_A_SOURCE, LEAGUES, LEAGUE_SOURCE,
  CLUBS, CLUB_COMPARE_SLUGS, CLUB_PAGE_SLUGS,
} from "@/data/futbol";

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);

  const maxL = LALIGA_LCPD[0].amount;
  const revenues = [...CLUB_REVENUE].sort((a, b) => b.amount - a.amount);
  const maxR = revenues[0].amount;
  const revenuesEs = revenues.filter((c) => c.country === "es");
  const debts = [...CLUB_DEBT].sort((a, b) => (a.kind === "caja" ? -1 : b.amount - a.amount));
  const maxD = Math.max(...CLUB_DEBT.filter((d) => d.kind !== "caja").map((d) => d.amount));
  const debtsEs = debts.filter((d) => d.country === "es");
  const debtsIt = debts.filter((d) => d.country === "it");
  const kindLabel = (k: string) => (k === "bruta" ? t("bruta", "lorda") : k === "neta" ? t("neta", "netta") : k);
  const cajaLabel = t("Caja positiva", "Cassa positiva");
  const src = t("Fuente: ", "Fonte: ");

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <header className="pt-8">
        <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">⚽ LaLiga · Serie A · {t("datos oficiales", "dati ufficiali")}</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-2">
          {t("El dinero del ", "I soldi del ")}<span className="neon-text">{t("fútbol", "calcio")}</span>
        </h1>
        <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
          {t(
            "Cuánto puede gastar cada club, cuánto ingresa y cuánta deuda tiene — en España e Italia, solo con datos oficiales (LaLiga, Deloitte, cuentas anuales / bilanci). Nada de valores de mercado ni sueldos estimados.",
            "Quanto può spendere ogni club, quanto incassa e quanto debito ha — in Spagna e Italia, solo con dati ufficiali (LaLiga, Deloitte, bilanci). Niente valori di mercato né stipendi stimati.",
          )}
        </p>
      </header>

      <Link href="/futbol-mundial/" className="mt-5 glass p-4 flex items-center justify-between gap-3 group hover:border-cyan transition">
        <span>
          <span className="block font-semibold">🌍 {t("El dinero del fútbol mundial", "I soldi del calcio mondiale")}</span>
          <span className="block text-xs text-muted">{t("Qué liga y qué club ingresan más del mundo", "Quale lega e quale club incassano di più al mondo")} · Premier, Bundesliga, LaLiga, Serie A</span>
        </span>
        <span className="text-cyan text-lg shrink-0 transition-transform group-hover:translate-x-0.5">→</span>
      </Link>

      {/* Premios de las grandes competiciones (alto interés de búsqueda) */}
      <div className="mt-3 grid sm:grid-cols-3 gap-3">
        {[
          { href: "/champions-league/", emoji: "🏆", es: "Premios Champions", it: "Premi Champions", subEs: "18,62 mln € por participar", subIt: "18,62 mln € per partecipare" },
          { href: "/eurocopa/", emoji: "🏅", es: "Premios Eurocopa", it: "Premi Europei", subEs: "España ganó 28,25 mln €", subIt: "La Spagna ha preso 28,25 mln €" },
          { href: "/mundial-2026/", emoji: "🌐", es: "Premios Mundial 2026", it: "Premi Mondiali 2026", subEs: "50 mln $ al campeón", subIt: "50 mln $ a chi vince" },
          { href: "/jugadores/", emoji: "⚽", es: "El dinero de los jugadores", it: "I soldi dei giocatori", subEs: "fichajes, cláusulas y sueldos", subIt: "trasferimenti, clausole e stipendi" },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="glass p-3.5 group hover:border-cyan transition">
            <span className="block text-sm font-semibold">{c.emoji} {t(c.es, c.it)}</span>
            <span className="block text-[11px] text-muted mt-0.5">{t(c.subEs, c.subIt)}</span>
          </Link>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { v: formatCompact(LALIGA_LCPD[0].amount), l: t(`Límite salarial máximo (${LALIGA_LCPD[0].club})`, `Tetto salariale massimo (${LALIGA_LCPD[0].club})`), c: "#a5b4fc" },
          { v: formatCompact(revenues[0].amount), l: t(`Más ingresos (${revenues[0].club})`, `Più ricavi (${revenues[0].club})`), c: "#34d399" },
          { v: formatCompact(1451000000), l: t("Más deuda (FC Barcelona)", "Più debito (FC Barcelona)"), c: "#fdba74" },
        ].map((k) => (
          <div key={k.l} className="glass p-4 text-center">
            <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
            <p className="text-[11px] text-muted mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      {/* Bloques por país; con idioma italiano, Italia se muestra primero (CSS .country-flip). */}
      <div className="country-flip">
        <div className="country-es">
          <section className="mt-12">
            <HeroBanner as="h2" src="/photos/spain-stadium.jpg" alt={t("Estadio de LaLiga (España)", "Stadio della Liga (Spagna)")}
              kicker={t("🇪🇸 España · LaLiga · datos oficiales", "🇪🇸 Spagna · LaLiga · dati ufficiali")}
              title={t("EL DINERO DEL", "I SOLDI DEL")} highlight={t("FÚTBOL ESPAÑOL", "CALCIO SPAGNOLO")}
              stat="1.451 M€" statLabel={t("la mayor deuda de Europa (FC Barcelona)", "il debito più alto d'Europa (FC Barcelona)")}
              accent="#fdba74" accent2="#f472b6" />
          </section>

          {/* LaLiga LCPD */}
          <section className="mt-8">
            <h2 className="text-lg md:text-xl font-semibold">{t("Límite de coste de plantilla", "Tetto salariale")} · LaLiga {LALIGA_LCPD_SEASON}</h2>
            <p className="text-[11px] text-cyan/70 mb-4">{t("Cuánto puede gastar cada club en su plantilla (tope oficial de LaLiga).", "Quanto può spendere ogni club per la rosa (tetto ufficiale della LaLiga).")}</p>
            <ol className="space-y-1.5">
              {LALIGA_LCPD.map((c, i) => (
                <li key={c.club} className="glass flex items-center gap-3 px-3 py-2.5">
                  <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium">{c.club}</span>
                    <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${Math.max(2, (c.amount / maxL) * 100)}%` }} /></span>
                  </span>
                  <span className="tabular text-sm font-semibold text-[#a5b4fc] shrink-0">{formatEuro(c.amount)}</span>
                </li>
              ))}
            </ol>
            <p className="text-[11px] text-muted mt-3">{src}<a href={LALIGA_LCPD_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{LALIGA_LCPD_SOURCE.name}</a></p>
          </section>

          {/* Ingresos ES */}
          <section className="mt-12">
            <h2 className="text-lg md:text-xl font-semibold">💶 {t("Ingresos de los clubes españoles", "Ricavi dei club spagnoli")} · {REVENUE_SEASON}</h2>
            <p className="text-[11px] text-cyan/70 mb-4">{t("Ingresos (Deloitte Football Money League). El Real Madrid es el único club del mundo por encima de 1.000 M€.", "Ricavi (Deloitte Football Money League). Il Real Madrid è l'unico club al mondo sopra il miliardo.")}</p>
            <ol className="space-y-1.5">
              {revenuesEs.map((c, i) => (
                <li key={c.club} className="glass flex items-center gap-3 px-3 py-2.5">
                  <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium">{c.club}</span>
                    <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-green to-cyan" style={{ width: `${Math.max(4, (c.amount / maxR) * 100)}%` }} /></span>
                  </span>
                  <span className="tabular text-sm font-semibold text-green shrink-0">{formatCompact(c.amount)}</span>
                </li>
              ))}
            </ol>
            <p className="text-[11px] text-muted mt-3">{src}<a href={REVENUE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{REVENUE_SOURCE.name}</a></p>
          </section>

          {/* Deuda ES */}
          <section className="mt-12">
            <h2 className="text-lg md:text-xl font-semibold">🧾 {t("Deuda de los clubes españoles", "Debito dei club spagnoli")} · 2024/25</h2>
            <p className="text-[11px] text-muted mb-4">{t("En cristiano: ", "In parole semplici: ")}<span className="text-fg/80">{t("deuda neta", "debito netto")}</span> = {t("lo que deben menos el dinero que tienen guardado", "quello che devono meno la cassa")} · <span className="text-fg/80">{t("bruta", "lordo")}</span> = {t("todo lo que deben", "tutto quello che devono")}.</p>
            <ol className="space-y-1.5">
              {debtsEs.map((d) => (
                <li key={d.club} className="glass flex items-center gap-3 px-3 py-2.5">
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium">{d.club}</span>
                    {d.kind !== "caja" && (<span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-amber to-magenta" style={{ width: `${Math.max(3, (d.amount / maxD) * 100)}%` }} /></span>)}
                    <a href={d.source.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted/80 underline hover:text-fg">{d.source.name}</a>
                  </span>
                  <span className={`tabular text-sm font-semibold shrink-0 ${d.kind === "caja" ? "text-green" : "text-[#fdba74]"}`}>
                    {d.kind === "caja" ? cajaLabel : formatCompact(d.amount)}
                    <span className="block text-[10px] text-muted font-normal text-right">{d.kind === "caja" ? `+${formatCompact(d.amount)}` : kindLabel(d.kind)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>{/* /country-es */}

        <div className="country-it">
          <section className="mt-16">
            <HeroBanner as="h2" src="/photos/italy-stadium.jpg" alt={t("Estadio de Serie A (Italia)", "Stadio di Serie A (Italia)")}
              kicker={t("🇮🇹 Italia · Serie A · datos oficiales", "🇮🇹 Italia · Serie A · dati ufficiali")}
              title={t("EL DINERO DE LA", "I SOLDI DELLA")} highlight="SERIE A"
              stat="−349 mln €" statLabel={t("las pérdidas de la Serie A en un año", "le perdite della Serie A in un anno")}
              accent="#22d3ee" accent2="#a78bfa" />
          </section>

          {/* Serie A */}
          <section className="mt-8">
            <h2 className="text-lg md:text-xl font-semibold">Serie A · {t("ingresos y salarios", "ricavi e stipendi")} · {SERIE_A_SEASON}</h2>
            <p className="text-[11px] text-cyan/70 mb-4">{t("Cuánto ingresa cada club (por cuentas) y cuánto paga en salarios. Los 20 equipos.", "Quanto incassa ogni club (ricavi da bilancio) e quanto paga di stipendi. Tutte le 20 squadre.")}</p>
            <ol className="space-y-1.5">
              {SERIE_A.map((c, i) => {
                const pct = Math.round((c.wageBill / c.revenue) * 100);
                return (
                  <li key={c.club} className="glass flex items-center gap-3 px-3 py-2.5">
                    <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block truncate font-medium">{c.club}</span>
                      <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-green to-cyan" style={{ width: `${Math.max(4, (c.revenue / SERIE_A[0].revenue) * 100)}%` }} /></span>
                      <span className="text-[10px] text-muted">{t("salarios jugadores", "stipendi giocatori")} {formatCompact(c.wageBill)} · {pct}% {t("de los ingresos", "dei ricavi")}</span>
                    </span>
                    <span className="tabular text-sm font-semibold text-green shrink-0">{formatCompact(c.revenue)}</span>
                  </li>
                );
              })}
            </ol>
            <p className="text-[11px] text-muted mt-3">{src}<a href={SERIE_A_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{SERIE_A_SOURCE.name}</a></p>
          </section>

          {/* Debito club italiani */}
          <section className="mt-12">
            <h2 className="text-lg md:text-xl font-semibold">🧾 {t("Deuda de los clubes italianos", "Debito dei club italiani")} · 2024/25</h2>
            <p className="text-[11px] text-muted mb-4">{t("En cristiano: ", "In parole semplici: ")}<span className="text-fg/80">{t("deuda neta", "debito netto")}</span> = {t("lo que deben menos la caja", "quello che devono meno la cassa")} · <span className="text-green">{cajaLabel}</span> = {t("tienen más dinero que deudas", "hanno più soldi che debiti")}.</p>
            <ol className="space-y-1.5">
              {debtsIt.map((d) => (
                <li key={d.club} className="glass flex items-center gap-3 px-3 py-2.5">
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium">{d.club}</span>
                    {d.kind !== "caja" && (<span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-amber to-magenta" style={{ width: `${Math.max(3, (d.amount / maxD) * 100)}%` }} /></span>)}
                    <a href={d.source.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted/80 underline hover:text-fg">{d.source.name}</a>
                  </span>
                  <span className={`tabular text-sm font-semibold shrink-0 ${d.kind === "caja" ? "text-green" : "text-[#fdba74]"}`}>
                    {d.kind === "caja" ? cajaLabel : formatCompact(d.amount)}
                    <span className="block text-[10px] text-muted font-normal text-right">{d.kind === "caja" ? `+${formatCompact(d.amount)}` : kindLabel(d.kind)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>{/* /country-it */}
      </div>{/* /country-flip */}

      {/* Comparación de ligas */}
      <section className="mt-16">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">🌍 <span className="neon-text">{t("España vs Italia", "Spagna vs Italia")}</span></h2>
        <p className="text-sm text-muted mt-1 mb-4">{t("Los dos campeonatos, comparados.", "I due campionati, a confronto.")}</p>
      </section>
      <section className="mt-4">
        <h2 className="text-lg md:text-xl font-semibold">💰 {t("Cuánto ingresan los campeonatos", "Quanto incassano i campionati")} · {SERIE_A_SEASON}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Ingresos totales de cada gran liga. En cristiano: cuánto dinero mueve todo el torneo.", "Ricavi totali di ogni grande campionato. In parole semplici: quanti soldi girano in tutto il torneo.")}</p>
        <ol className="space-y-1.5">
          {LEAGUES.map((l, i) => (
            <li key={l.league} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{l.league}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${Math.max(4, (l.revenue / LEAGUES[0].revenue) * 100)}%` }} /></span>
                <span className="text-[10px] text-muted">{l.wageToRevenue}% {t("de los ingresos en salarios", "dei ricavi in stipendi")} · {l.net >= 0 ? t("beneficio", "utile") : t("pérdida", "perdita")} {formatCompact(Math.abs(l.net))}</span>
              </span>
              <span className="tabular text-sm font-semibold text-[#a5b4fc] shrink-0">{formatCompact(l.revenue)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-2">{t("LaLiga (€4,8 mil M) ingresa más que la Serie A (€4,0 mil M) y casi cuadra; la Serie A pierde más.", "La LaLiga (€4,8 mld) incassa più della Serie A (€4,0 mld) ed è quasi in pareggio; la Serie A perde di più.")} {src}<a href={LEAGUE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{LEAGUE_SOURCE.name}</a></p>
      </section>

      {/* Fichas de club */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">{t("Las cuentas de cada club", "I conti di ogni club")}</h2>
        <p className="text-sm text-muted mb-4">{t("Ingresos, salarios, límite salarial y deuda, club por club — solo cifras oficiales.", "Ricavi, stipendi, tetto salariale e debito, club per club — solo cifre ufficiali.")}</p>
        <div className="flex flex-wrap gap-2">
          {CLUB_PAGE_SLUGS.map((s) => (
            <Link key={s} href={`/futbol/${s}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">{CLUBS[s].name}</Link>
          ))}
        </div>
      </section>

      {/* Comparativas */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">{t("Comparativas: club vs club", "Confronti: club vs club")}</h2>
        <p className="text-sm text-muted mb-4">{t("Dos clubes, uno al lado del otro (ingresos, salarios, límite y deuda) — solo con cifras oficiales.", "Due club, fianco a fianco (ricavi, stipendi, tetto e debito) — solo con cifre ufficiali.")}</p>
        <div className="flex flex-wrap gap-2">
          {[
            ["real-madrid-vs-fc-barcelona", "Real Madrid vs Barcelona"],
            ["fc-barcelona-vs-atletico-de-madrid", "Barcelona vs Atlético"],
            ["inter-vs-juventus", "Inter vs Juventus"],
            ["inter-vs-ac-milan", "Inter vs Milan"],
            ["juventus-vs-as-roma", "Juventus vs Roma"],
            ["real-madrid-vs-inter", "Real Madrid vs Inter"],
            ["fc-barcelona-vs-juventus", "Barcelona vs Juventus"],
            ["ssc-napoli-vs-atalanta", "Napoli vs Atalanta"],
          ].map(([slug, label]) => (
            <Link key={slug} href={`/futbol/${slug}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">{label}</Link>
          ))}
        </div>
        <details className="glass p-4 mt-4">
          <summary className="font-medium cursor-pointer marker:text-cyan text-sm">{t("Todas las comparaciones (club vs club)", "Tutti i confronti (club vs club)")}</summary>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(() => {
              const list = CLUB_COMPARE_SLUGS.filter((s) => CLUBS[s]);
              const out: { pair: string; label: string }[] = [];
              for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) out.push({ pair: `${list[i]}-vs-${list[j]}`, label: `${CLUBS[list[i]].name} vs ${CLUBS[list[j]].name}` });
              return out.map((c) => (
                <Link key={c.pair} href={`/futbol/${c.pair}/`} className="text-[12px] px-2 py-1 rounded-md border border-[var(--panel-border)] text-cyan/75 hover:text-fg hover:border-cyan transition">{c.label}</Link>
              ));
            })()}
          </div>
        </details>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Qual è il club di LaLiga che può spendere di più per la rosa?", a: `Il Real Madrid, con un tetto salariale di ${formatEuro(LALIGA_LCPD[0].amount)} nel ${LALIGA_LCPD_SEASON}, davanti a FC Barcelona (${formatEuro(LALIGA_LCPD[1].amount)}) e Atlético de Madrid (${formatEuro(LALIGA_LCPD[2].amount)}). È il tetto fissato dalla LaLiga, non quello che spendono davvero.` },
                { q: "Cos'è il tetto salariale della LaLiga?", a: "È la spesa massima che la LaLiga autorizza a ogni club per la rosa (stipendi, ammortamenti dei cartellini, ecc.), in base a ricavi e debiti. La LaLiga lo pubblica ufficialmente ogni stagione." },
                { q: "Quale club incassa di più in Spagna e Italia?", a: `Il Real Madrid, con circa ${formatCompact(revenues[0].amount)} di ricavi nel ${REVENUE_SEASON} (Deloitte), unico club al mondo sopra il miliardo. In Italia guida l'Inter (${formatCompact(CLUB_REVENUE.find((c) => c.club === "Inter")!.amount)}).` },
                { q: "Quale club ha più debito?", a: `Per debito finanziario lordo, il FC Barcelona (${formatCompact(1451000000)}, il più alto d'Europa). In Italia la Juventus guida il debito netto (${formatCompact(302800000)}). Dati dai bilanci 2024/25.` },
                { q: "Da dove arrivano questi dati?", a: "Solo da fonti ufficiali e verificabili: il tetto salariale dalla LaLiga; i ricavi dalla Deloitte Football Money League; il debito dai bilanci di ogni club. Niente valori di mercato né stipendi stimati." },
              ]
            : [
                { q: "¿Cuál es el club de LaLiga que más puede gastar en su plantilla?", a: `El Real Madrid, con un límite de coste de plantilla de ${formatEuro(LALIGA_LCPD[0].amount)} en ${LALIGA_LCPD_SEASON}, seguido del FC Barcelona (${formatEuro(LALIGA_LCPD[1].amount)}) y el Atlético de Madrid (${formatEuro(LALIGA_LCPD[2].amount)}). Es el tope que fija LaLiga, no lo que efectivamente gastan.` },
                { q: "¿Qué es el límite de coste de plantilla de LaLiga?", a: "Es el gasto máximo que LaLiga autoriza a cada club para su plantilla deportiva (salarios, fichajes amortizados, etc.), según sus ingresos y deudas. Lo publica LaLiga de forma oficial cada temporada." },
                { q: "¿Qué club de fútbol ingresa más en España e Italia?", a: `El Real Madrid, con unos ${formatCompact(revenues[0].amount)} de ingresos en ${REVENUE_SEASON} (Deloitte), único club del mundo por encima de los 1.000 M€. En Italia lidera el Inter (${formatCompact(CLUB_REVENUE.find((c) => c.club === "Inter")!.amount)}).` },
                { q: "¿Qué club tiene más deuda?", a: `Por deuda financiera bruta, el FC Barcelona (${formatCompact(1451000000)}, la mayor de Europa). En Italia, la Juventus lidera la deuda neta (${formatCompact(302800000)}). Datos de los bilanci 2024/25.` },
                { q: "¿De dónde salen estos datos?", a: "Solo de fuentes oficiales y verificables: el límite salarial lo publica LaLiga; los ingresos, la Deloitte Football Money League; la deuda, las cuentas de cada club. No usamos valores de mercado ni sueldos estimados." },
              ]
          ).map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">{t("Ver el dinero público →", "Vedi i soldi pubblici →")}</Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function FutbolClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
