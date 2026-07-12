"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import {
  CLUBS, CLUB_COMPARE_SLUGS, CLUB_PAGE_SLUGS, type ClubMetrics,
  LALIGA_LCPD_SOURCE, LALIGA_LCPD_SEASON, REVENUE_SOURCE, REVENUE_SEASON, SERIE_A_SOURCE, SERIE_A_SEASON,
} from "@/data/futbol";
import { formatEuro, formatCompact } from "@/lib/format";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";
const flag = (l: string) => (l === "laliga" ? "🇪🇸" : "🇮🇹");

function parsePair(par: string): { a: ClubMetrics; b: ClubMetrics } | null {
  const idx = par.indexOf("-vs-");
  if (idx < 0) return null;
  const a = CLUBS[par.slice(0, idx)];
  const b = CLUBS[par.slice(idx + 4)];
  return a && b ? { a, b } : null;
}

const kindLabel = (k: string, it: boolean) => (k === "bruta" ? (it ? "lordo" : "bruta") : k === "neta" ? (it ? "netto" : "neta") : it ? "cassa" : "caja");

function ClubDetail({ c, slug }: { c: ClubMetrics; slug: string }) {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);

  const rows: { label: string; value: string; hint?: string; accent?: string }[] = [];
  if (c.revenue) rows.push({ label: t("Ingresos (al año)", "Ricavi (all'anno)"), value: formatEuro(c.revenue), hint: t("lo que factura el club en una temporada", "quanto incassa il club in una stagione") });
  if (c.wageBill) rows.push({ label: t("Salarios de jugadores", "Stipendi dei giocatori"), value: formatEuro(c.wageBill), hint: t("coste bruto de la plantilla", "costo lordo della rosa") });
  if (c.limite) rows.push({ label: t("Límite salarial (LaLiga)", "Tetto salariale (LaLiga)"), value: formatEuro(c.limite), hint: t(`tope de gasto en plantilla ${LALIGA_LCPD_SEASON}`, `tetto di spesa per la rosa ${LALIGA_LCPD_SEASON}`) });
  if (typeof c.net === "number") rows.push({ label: t("Resultado del año", "Risultato dell'anno"), value: `${c.net >= 0 ? "+" : "−"}${formatEuro(Math.abs(c.net))}`, hint: c.net >= 0 ? t("beneficio", "utile") : t("pérdidas", "perdita"), accent: c.net >= 0 ? "#34d399" : "#f87171" });
  if (c.debt) rows.push({ label: `${t("Deuda", "Debito")} (${kindLabel(c.debt.kind, it)})`, value: formatEuro(c.debt.amount), hint: `${t("a", "al")} ${c.debt.year}`, accent: "#fdba74" });

  const faqs: { q: string; a: string }[] = [];
  if (c.revenue) faqs.push(it ? { q: `Quanto incassa il ${c.name}?`, a: `Il ${c.name} incassa ${formatEuro(c.revenue)} all'anno (stagione ${c.league === "laliga" ? REVENUE_SEASON : SERIE_A_SEASON}), secondo ${c.league === "laliga" ? REVENUE_SOURCE.name : SERIE_A_SOURCE.name}.` } : { q: `¿Cuánto ingresa el ${c.name}?`, a: `El ${c.name} ingresa ${formatEuro(c.revenue)} al año (temporada ${c.league === "laliga" ? REVENUE_SEASON : SERIE_A_SEASON}), según ${c.league === "laliga" ? REVENUE_SOURCE.name : SERIE_A_SOURCE.name}.` });
  if (c.debt) faqs.push(it ? { q: `Quanto debito ha il ${c.name}?`, a: `Il ${c.name} ha un debito di ${formatEuro(c.debt.amount)} (${kindLabel(c.debt.kind, true)}) al ${c.debt.year}. Fonte: ${c.debt.source.name}.` } : { q: `¿Cuánta deuda tiene el ${c.name}?`, a: `El ${c.name} tiene una deuda de ${formatEuro(c.debt.amount)} (${c.debt.kind}) a ${c.debt.year}. Fuente: ${c.debt.source.name}.` });
  if (c.limite) faqs.push(it ? { q: `Qual è il tetto salariale del ${c.name}?`, a: `La LaLiga fissa il tetto salariale del ${c.name} a ${formatEuro(c.limite)} per il ${LALIGA_LCPD_SEASON}.` } : { q: `¿Cuál es el límite salarial del ${c.name}?`, a: `LaLiga fija el límite de coste de plantilla del ${c.name} en ${formatEuro(c.limite)} para ${LALIGA_LCPD_SEASON}.` });
  if (c.wageBill) faqs.push(it ? { q: `Quanto spende il ${c.name} in stipendi?`, a: `Il ${c.name} destina ${formatEuro(c.wageBill)} all'anno agli stipendi dei giocatori (monte ingaggi lordo).` } : { q: `¿Cuánto gasta el ${c.name} en salarios?`, a: `El ${c.name} destina ${formatEuro(c.wageBill)} al año a los salarios de sus jugadores (monte ingaggi bruto).` });

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: c.name, item: `${SITE}/futbol/${slug}/` }] };

  const compareLinks: { pair: string; name: string }[] = [];
  if (CLUB_COMPARE_SLUGS.includes(slug)) {
    const list = CLUB_COMPARE_SLUGS.filter((s) => CLUBS[s]);
    const i = list.indexOf(slug);
    for (let j = 0; j < list.length; j++) {
      if (j === i) continue;
      const [a, b] = i < j ? [list[i], list[j]] : [list[j], list[i]];
      compareLinks.push({ pair: `${a}-vs-${b}`, name: CLUBS[list[j]].name });
    }
  }
  const sources = [
    c.limite && LALIGA_LCPD_SOURCE,
    c.revenue && (c.league === "laliga" ? REVENUE_SOURCE : SERIE_A_SOURCE),
    c.wageBill && SERIE_A_SOURCE,
    c.debt && c.debt.source,
  ].filter(Boolean) as { name: string; url: string }[];
  const uniqSources = Array.from(new Map(sources.map((s) => [s.url, s])).values());
  const heroImg = c.league === "laliga" ? "/photos/spain-stadium.jpg" : "/photos/italy-stadium.jpg";
  const parts = [c.revenue && `${t("ingresa", "incassa")} ${formatCompact(c.revenue)}`, c.debt && `${t("deuda", "debito")} ${formatCompact(c.debt.amount)}`].filter(Boolean);
  const shareMsg = `⚽ ${c.name}: ${parts.join(", ")} — ${t("datos oficiales", "dati ufficiali")} 👀`;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className="text-sm text-muted pt-6 mb-4">
        <Link href="/" className="hover:text-fg neon-text font-semibold">Cuentas Claras</Link>{" "}
        <Link href="/futbol/" className="opacity-70 hover:text-fg">/ {t("Fútbol", "Calcio")}</Link>{" "}
        <span className="opacity-50">/ {c.name}</span>
      </nav>

      <HeroBanner
        as="h1"
        src={heroImg}
        alt={c.name}
        kicker={`${flag(c.league)} ${c.league === "laliga" ? "LaLiga" : "Serie A"} · ${t("cuentas oficiales", "conti ufficiali")}`}
        title={t("LAS CUENTAS DEL", "I CONTI DEL")}
        highlight={c.name.toUpperCase()}
        stat={c.revenue ? formatCompact(c.revenue) : c.debt ? formatCompact(c.debt.amount) : undefined}
        statLabel={c.revenue ? t("de ingresos al año", "di ricavi all'anno") : c.debt ? t("de deuda", "di debito") : undefined}
        accent="#34d399"
        accent2="#22d3ee"
      />

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}
          moreLabel={t("¿Qué significa cada número?", "Cosa vuol dire ogni numero?")}
          more={
            <ul className="space-y-1.5">
              <li>💶 <b>{t("Ingresos", "Ricavi")}</b> — {t("lo que el club recauda en un año: TV, entradas, patrocinios, premios.", "quanto il club incassa in un anno: TV, biglietti, sponsor, premi.")}</li>
              <li>💸 <b>{t("Salarios", "Stipendi")}</b> — {t("el coste total de la plantilla (bruto). No son sueldos de jugadores concretos.", "il costo totale della rosa (lordo). Non sono gli stipendi dei singoli giocatori.")}</li>
              <li>📊 <b>{t("Límite salarial", "Tetto salariale")}</b> — {t("el máximo que LaLiga deja gastar en plantilla. Solo LaLiga.", "il massimo che la LaLiga permette di spendere per la rosa. Solo LaLiga.")}</li>
              <li>🏦 <b>{t("Deuda", "Debito")}</b> — {t("lo que el club aún debe. «neta» = menos la caja; «bruta» = todo.", "quello che il club deve ancora. «netto» = meno la cassa; «lordo» = tutto.")}</li>
            </ul>
          }>
          <p>{t(
            `Cuánto ingresa, cuánto paga y cuánto debe el ${c.name}. Solo datos oficiales; no el sueldo de cada jugador.`,
            `Quanto incassa, quanto paga e quanto deve il ${c.name}. Solo dati ufficiali; non lo stipendio dei singoli.`,
          )}</p>
        </SimpleExplainer>
      </div>

      <div className="glass mt-4 divide-y divide-[var(--panel-border)]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <span className="text-sm text-muted">{r.label}{r.hint ? <span className="block text-[11px] text-muted/60">{r.hint}</span> : null}</span>
            <span className="tabular text-xl font-semibold" style={r.accent ? { color: r.accent } : undefined}>{r.value}</span>
          </div>
        ))}
      </div>

      <ShareBar className="mt-5" text={shareMsg} />

      {compareLinks.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-medium text-muted mb-3">{t(`Compara al ${c.name} con otro club`, `Confronta il ${c.name} con un altro club`)}</h2>
          <div className="flex flex-wrap gap-2">
            {compareLinks.map((l) => (
              <Link key={l.pair} href={`/futbol/${l.pair}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">vs {l.name}</Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/futbol/" className="px-4 py-2 rounded-full text-sm font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">{t("Ver todo el dinero del fútbol →", "Vedi tutti i soldi del calcio →")}</Link>
      </div>

      <p className="text-[11px] text-muted mt-8">
        {t("Fuentes oficiales: ", "Fonti ufficiali: ")}
        {uniqSources.map((s, i) => (
          <span key={s.url}>{i > 0 ? " · " : ""}<a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{s.name}</a></span>
        ))}
        . {t("Solo cifras verificables.", "Solo cifre verificabili.")}
      </p>
    </main>
  );
}

function Comparison({ a, b, par }: { a: ClubMetrics; b: ClubMetrics; par: string }) {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);

  const rows: { label: string; av: string; bv: string }[] = [];
  if (a.limite || b.limite) rows.push({ label: t("Límite salarial (LaLiga)", "Tetto salariale (LaLiga)"), av: a.limite ? formatEuro(a.limite) : "—", bv: b.limite ? formatEuro(b.limite) : "—" });
  if (a.revenue || b.revenue) rows.push({ label: t("Ingresos (al año)", "Ricavi (all'anno)"), av: a.revenue ? formatEuro(a.revenue) : "—", bv: b.revenue ? formatEuro(b.revenue) : "—" });
  if (a.wageBill || b.wageBill) rows.push({ label: t("Salarios de jugadores", "Stipendi dei giocatori"), av: a.wageBill ? formatEuro(a.wageBill) : "—", bv: b.wageBill ? formatEuro(b.wageBill) : "—" });
  if (a.debt || b.debt) rows.push({ label: t("Deuda", "Debito"), av: a.debt ? formatEuro(a.debt.amount) : "—", bv: b.debt ? formatEuro(b.debt.amount) : "—" });

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [(a.revenue && b.revenue) ? { "@type": "Question", name: `¿Quién ingresa más, ${a.name} o ${b.name}?`, acceptedAnswer: { "@type": "Answer", text: `${a.revenue >= b.revenue ? a.name : b.name}, con ${formatEuro(Math.max(a.revenue, b.revenue))} de ingresos frente a ${formatEuro(Math.min(a.revenue, b.revenue))}.` } } : null].filter(Boolean) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: `${SITE}/futbol/${par}/` }] };
  const clubHref = (c: ClubMetrics) => (CLUB_PAGE_SLUGS.includes(c.slug) ? `/futbol/${c.slug}/` : "/futbol/");

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-fg neon-text font-semibold">Cuentas Claras</Link>{" "}
        <Link href="/futbol/" className="opacity-70 hover:text-fg">/ {t("Fútbol", "Calcio")}</Link>{" "}
        <span className="opacity-50">/ {a.name} vs {b.name}</span>
      </nav>
      <header>
        <p className="text-xs uppercase tracking-widest text-cyan/80">⚽ {t("Comparativa financiera · datos oficiales", "Confronto finanziario · dati ufficiali")}</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-1">
          {flag(a.league)} <span className="neon-text">{a.name}</span> vs {flag(b.league)} <span className="neon-text">{b.name}</span>
        </h1>
        <p className="text-sm text-muted mt-2">{t("Los dos clubes, lado a lado: quién ingresa, paga y debe más. Solo datos oficiales.", "I due club, fianco a fianco: chi incassa, paga e deve di più. Solo dati ufficiali.")}</p>
      </header>

      <div className="glass mt-6 overflow-hidden">
        <div className="grid grid-cols-[1.3fr_1fr_1fr] text-sm">
          <div className="px-3 py-2.5" />
          <div className="px-3 py-2.5 font-semibold text-center border-l border-[var(--panel-border)]">{a.name}</div>
          <div className="px-3 py-2.5 font-semibold text-center border-l border-[var(--panel-border)]">{b.name}</div>
          {rows.map((r) => (
            <div key={r.label} className="contents">
              <div className="px-3 py-2.5 text-muted border-t border-[var(--panel-border)]">{r.label}</div>
              <div className="px-3 py-2.5 tabular text-center border-t border-l border-[var(--panel-border)]">{r.av}</div>
              <div className="px-3 py-2.5 tabular text-center border-t border-l border-[var(--panel-border)]">{r.bv}</div>
            </div>
          ))}
        </div>
      </div>

      <ShareBar className="mt-5" text={`⚽ ${a.name} vs ${b.name} — ${t("¿quién ingresa y debe más?", "chi incassa e deve di più?")} 👀 ${t("datos oficiales", "dati ufficiali")}`} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={clubHref(a)} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">{t("Cuentas de", "Conti di")} {a.name}</Link>
        <Link href={clubHref(b)} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">{t("Cuentas de", "Conti di")} {b.name}</Link>
        <Link href="/futbol/" className="px-4 py-2 rounded-full text-sm font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">{t("Todo el dinero del fútbol →", "Tutti i soldi del calcio →")}</Link>
      </div>

      <p className="text-[11px] text-muted mt-8">{t("Fuentes oficiales: LaLiga (límite de coste de plantilla), Deloitte Football Money League y bilanci de los clubes. Solo cifras verificables; los huecos (—) son datos que ese club no publica en ese apartado.", "Fonti ufficiali: LaLiga (tetto salariale), Deloitte Football Money League e bilanci dei club. Solo cifre verificabili; i trattini (—) sono dati che il club non pubblica in quella voce.")}</p>
    </main>
  );
}

export default function ParClient({ par }: { par: string }) {
  const pair = parsePair(par);
  return (
    <LocaleProvider>
      {pair ? <Comparison a={pair.a} b={pair.b} par={par} /> : CLUBS[par] ? <ClubDetail c={CLUBS[par]} slug={par} /> : null}
    </LocaleProvider>
  );
}
