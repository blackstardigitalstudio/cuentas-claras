import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { formatEuro, formatCompact } from "@/lib/format";
import {
  LALIGA_LCPD, LALIGA_LCPD_SEASON, LALIGA_LCPD_SOURCE,
  CLUB_REVENUE, REVENUE_SEASON, REVENUE_SOURCE, CLUB_DEBT,
  SERIE_A, SERIE_A_SEASON, SERIE_A_SOURCE, LEAGUES, LEAGUE_SOURCE,
  CLUBS, CLUB_COMPARE_SLUGS, CLUB_PAGE_SLUGS,
} from "@/data/futbol";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "El dinero del fútbol: presupuestos, ingresos y deuda de los clubes (datos oficiales)",
  description:
    `Cuánto puede gastar cada club de LaLiga (límite de coste de plantilla oficial ${LALIGA_LCPD_SEASON}), ingresos (Deloitte) y deuda de los grandes clubes de España e Italia. Solo datos oficiales y verificables. Real Madrid lidera con ${formatEuro(LALIGA_LCPD[0].amount)} de límite salarial.`,
  keywords: [
    "límite salarial LaLiga",
    "límite de coste de plantilla",
    "cuánto puede gastar el Barça",
    "presupuesto Real Madrid",
    "deuda del Barcelona",
    "ingresos clubes fútbol",
    "bilancio Juventus",
    "debito Inter",
  ],
  alternates: { canonical: `${SITE}/futbol/` },
  openGraph: {
    title: "El dinero del fútbol · datos oficiales (LaLiga + Serie A)",
    description: `Límite salarial LaLiga ${LALIGA_LCPD_SEASON}, ingresos y deuda de los grandes clubes. Solo datos oficiales.`,
    url: `${SITE}/futbol/`,
    type: "website",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "El dinero del fútbol — LaLiga y Serie A, datos oficiales" }],
  },
  twitter: { card: "summary_large_image", title: "El dinero del fútbol", description: "Ingresos, salarios, límite salarial y deuda de los clubes. Datos oficiales.", images: ["/og-futbol.png"] },
};

const flag = (c: "es" | "it") => (c === "es" ? "🇪🇸" : "🇮🇹");

export default function FutbolPage() {
  const maxL = LALIGA_LCPD[0].amount;
  const revenues = [...CLUB_REVENUE].sort((a, b) => b.amount - a.amount);
  const maxR = revenues[0].amount;
  const debts = [...CLUB_DEBT].sort((a, b) => (a.kind === "caja" ? -1 : b.amount - a.amount));
  const maxD = Math.max(...CLUB_DEBT.filter((d) => d.kind !== "caja").map((d) => d.amount));

  const faqs = [
    { q: "¿Cuál es el club de LaLiga que más puede gastar en su plantilla?", a: `El Real Madrid, con un límite de coste de plantilla de ${formatEuro(LALIGA_LCPD[0].amount)} en ${LALIGA_LCPD_SEASON}, seguido del FC Barcelona (${formatEuro(LALIGA_LCPD[1].amount)}) y el Atlético de Madrid (${formatEuro(LALIGA_LCPD[2].amount)}). Es el tope que fija LaLiga, no lo que efectivamente gastan.` },
    { q: "¿Qué es el límite de coste de plantilla de LaLiga?", a: "Es el gasto máximo que LaLiga autoriza a cada club para su plantilla deportiva (salarios, fichajes amortizados, etc.), según sus ingresos y deudas. Lo publica LaLiga de forma oficial cada temporada." },
    { q: "¿Qué club de fútbol ingresa más en España e Italia?", a: `El Real Madrid, con unos ${formatCompact(revenues[0].amount)} de ingresos en ${REVENUE_SEASON} (Deloitte Football Money League), único club del mundo por encima de los 1.000 M€. En Italia lidera el Inter (${formatCompact(CLUB_REVENUE.find((c) => c.club === "Inter")!.amount)}).` },
    { q: "¿Qué club tiene más deuda?", a: `Por deuda financiera bruta, el FC Barcelona (${formatCompact(1451000000)}, la mayor de Europa). En Italia, la Juventus lidera la deuda financiera neta (${formatCompact(302800000)}). Datos de las cuentas anuales / bilanci 2024/25.` },
    { q: "¿De dónde salen estos datos?", a: "Solo de fuentes oficiales y verificables: el límite salarial lo publica LaLiga; los ingresos, la Deloitte Football Money League (sobre cuentas auditadas); la deuda, las cuentas anuales / bilanci de cada club. No usamos valores de mercado ni sueldos estimados de jugadores." },
  ];

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: `Límite de coste de plantilla LaLiga ${LALIGA_LCPD_SEASON}`, itemListElement: LALIGA_LCPD.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.club}: ${formatEuro(c.amount)}` })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <header className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">⚽ LaLiga · Serie A · datos oficiales</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            El dinero del <span className="neon-text">fútbol</span>
          </h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            Cuánto puede gastar cada club, cuánto ingresa y cuánta deuda tiene — en España e Italia, solo con{" "}
            <span className="text-fg/90">datos oficiales</span> (LaLiga, Deloitte, cuentas anuales / bilanci).{" "}
            <span className="text-fg/70">Nada de valores de mercado ni sueldos estimados.</span>
          </p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { v: formatCompact(LALIGA_LCPD[0].amount), l: `Límite salarial máximo (${LALIGA_LCPD[0].club})`, c: "#a5b4fc" },
            { v: formatCompact(revenues[0].amount), l: `Más ingresos (${revenues[0].club})`, c: "#34d399" },
            { v: formatCompact(1451000000), l: "Más deuda (FC Barcelona)", c: "#fdba74" },
          ].map((k) => (
            <div key={k.l} className="glass p-4 text-center">
              <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
              <p className="text-[11px] text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        {/* LaLiga LCPD */}
        <section className="mt-10">
          <h2 className="text-lg md:text-xl font-semibold">🇪🇸 Límite de coste de plantilla · LaLiga {LALIGA_LCPD_SEASON}</h2>
          <p className="text-[11px] text-cyan/70 mb-4">Cuánto puede gastar cada club en su plantilla (tope oficial de LaLiga).</p>
          <ol className="space-y-1.5">
            {LALIGA_LCPD.map((c, i) => (
              <li key={c.club} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-medium">{c.club}</span>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${Math.max(2, (c.amount / maxL) * 100)}%` }} />
                  </span>
                </span>
                <span className="tabular text-sm font-semibold text-[#a5b4fc] shrink-0">{formatEuro(c.amount)}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-3">Fuente: <a href={LALIGA_LCPD_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{LALIGA_LCPD_SOURCE.name}</a></p>
        </section>

        {/* Ingresos */}
        <section className="mt-12">
          <h2 className="text-lg md:text-xl font-semibold">💶 Ingresos de los clubes · {REVENUE_SEASON}</h2>
          <p className="text-[11px] text-cyan/70 mb-4">Ricavi dei club (España e Italia), Deloitte Football Money League.</p>
          <ol className="space-y-1.5">
            {revenues.map((c, i) => (
              <li key={c.club} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="text-base shrink-0">{flag(c.country)}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-medium">{c.club}</span>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span className="block h-full rounded-full bg-gradient-to-r from-green to-cyan" style={{ width: `${Math.max(4, (c.amount / maxR) * 100)}%` }} />
                  </span>
                </span>
                <span className="tabular text-sm font-semibold text-green shrink-0">{formatCompact(c.amount)}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-3">Fuente: <a href={REVENUE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{REVENUE_SOURCE.name}</a></p>
        </section>

        {/* Deuda */}
        <section className="mt-12">
          <h2 className="text-lg md:text-xl font-semibold">🧾 Deuda de los clubes · 2024/25</h2>
          <p className="text-[11px] text-cyan/70 mb-1">Lo que deben los clubes, según sus cuentas anuales / bilanci.</p>
          <p className="text-[11px] text-muted mb-4">En cristiano: <span className="text-fg/80">deuda neta</span> = lo que deben menos el dinero que tienen guardado · <span className="text-fg/80">bruta</span> = todo lo que deben · <span className="text-green">caja positiva</span> = tienen más dinero que deudas.</p>
          <ol className="space-y-1.5">
            {debts.map((d) => (
              <li key={d.club} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="text-base shrink-0">{flag(d.country)}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-medium">{d.club}</span>
                  {d.kind !== "caja" && (
                    <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <span className="block h-full rounded-full bg-gradient-to-r from-amber to-magenta" style={{ width: `${Math.max(3, (d.amount / maxD) * 100)}%` }} />
                    </span>
                  )}
                  <a href={d.source.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted/80 underline hover:text-fg">{d.source.name}</a>
                </span>
                <span className={`tabular text-sm font-semibold shrink-0 ${d.kind === "caja" ? "text-green" : "text-[#fdba74]"}`}>
                  {d.kind === "caja" ? "Caja positiva" : formatCompact(d.amount)}
                  <span className="block text-[10px] text-muted font-normal text-right">{d.kind === "bruta" ? "bruta" : d.kind === "neta" ? "neta" : `+${formatCompact(d.amount)}`}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Serie A: ricavi + monte ingaggi (tutte le 20 squadre) */}
        <section className="mt-12">
          <h2 className="text-lg md:text-xl font-semibold">🇮🇹 Serie A · ricavi e stipendi · {SERIE_A_SEASON}</h2>
          <p className="text-[11px] text-cyan/70 mb-4">Quanto incassa ogni club (ricavi da bilancio) e quanto paga di stipendi ai giocatori. Tutte le 20 squadre.</p>
          <ol className="space-y-1.5">
            {SERIE_A.map((c, i) => {
              const pct = Math.round((c.wageBill / c.revenue) * 100);
              return (
                <li key={c.club} className="glass flex items-center gap-3 px-3 py-2.5">
                  <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium">{c.club}</span>
                    <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <span className="block h-full rounded-full bg-gradient-to-r from-green to-cyan" style={{ width: `${Math.max(4, (c.revenue / SERIE_A[0].revenue) * 100)}%` }} />
                    </span>
                    <span className="text-[10px] text-muted">stipendi giocatori {formatCompact(c.wageBill)} · {pct}% dei ricavi</span>
                  </span>
                  <span className="tabular text-sm font-semibold text-green shrink-0">{formatCompact(c.revenue)}</span>
                </li>
              );
            })}
          </ol>
          <p className="text-[11px] text-muted mt-3">Fonte: <a href={SERIE_A_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{SERIE_A_SOURCE.name}</a></p>
        </section>

        {/* Confronto tra campionati */}
        <section className="mt-12">
          <h2 className="text-lg md:text-xl font-semibold">💰 Quanto incassano i campionati · {SERIE_A_SEASON}</h2>
          <p className="text-[11px] text-cyan/70 mb-4">Ricavi totali di ogni grande campionato. In parole semplici: quanti soldi girano in tutto il torneo.</p>
          <ol className="space-y-1.5">
            {LEAGUES.map((l, i) => (
              <li key={l.league} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-medium">{l.league}</span>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${Math.max(4, (l.revenue / LEAGUES[0].revenue) * 100)}%` }} />
                  </span>
                  <span className="text-[10px] text-muted">{l.wageToRevenue}% dei ricavi va in stipendi · {l.net >= 0 ? "utile" : "perdita"} {formatCompact(Math.abs(l.net))}</span>
                </span>
                <span className="tabular text-sm font-semibold text-[#a5b4fc] shrink-0">{formatCompact(l.revenue)}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-2">La LaLiga (€4,8 mld) incassa più della Serie A (€4,0 mld) ed è quasi in pareggio; la Serie A perde di più. Fonte: <a href={LEAGUE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{LEAGUE_SOURCE.name}</a></p>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-3">Las cuentas de cada club</h2>
          <p className="text-sm text-muted mb-4">Ingresos, salarios, límite salarial y deuda, club por club — solo cifras oficiales.</p>
          <div className="flex flex-wrap gap-2">
            {CLUB_PAGE_SLUGS.map((s) => (
              <Link key={s} href={`/futbol/${s}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">
                {CLUBS[s].name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-3">Comparativas: club vs club</h2>
          <p className="text-sm text-muted mb-4">Dos clubes, uno al lado del otro (ingresos, salarios, límite salarial y deuda) — solo con cifras oficiales.</p>
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
              <Link key={slug} href={`/futbol/${slug}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">
                {label}
              </Link>
            ))}
          </div>

          {/* Directorio completo: todas las comparaciones (enlaces internos → nada huérfano) */}
          <details className="glass p-4 mt-4">
            <summary className="font-medium cursor-pointer marker:text-cyan text-sm">Todas las comparaciones (club vs club)</summary>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(() => {
                const list = CLUB_COMPARE_SLUGS.filter((s) => CLUBS[s]);
                const out: { pair: string; label: string }[] = [];
                for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
                  out.push({ pair: `${list[i]}-vs-${list[j]}`, label: `${CLUBS[list[i]].name} vs ${CLUBS[list[j]].name}` });
                }
                return out.map((c) => (
                  <Link key={c.pair} href={`/futbol/${c.pair}/`} className="text-[12px] px-2 py-1 rounded-md border border-[var(--panel-border)] text-cyan/75 hover:text-fg hover:border-cyan transition">
                    {c.label}
                  </Link>
                ));
              })()}
            </div>
          </details>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-3">Preguntas frecuentes</h2>
          <div className="space-y-2.5">
            {faqs.map((f, i) => (
              <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
                <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
                <p className="text-sm text-muted mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <nav className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
            Ver el dinero público →
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
