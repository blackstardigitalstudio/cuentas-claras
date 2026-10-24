"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import {
  CLUBS, CLUB_COMPARE_SLUGS, CLUB_PAGE_SLUGS, type ClubMetrics,
  srcName, LALIGA_LCPD_SOURCE, LALIGA_LCPD_SEASON, LALIGA_LCPD_NOTE, REVENUE_SOURCE, REVENUE_SEASON, SERIE_A_SOURCE, SERIE_A_SEASON,
} from "@/data/futbol";
import { type Partita, compLabel, longDate, shortName, sourceName } from "@/data/partite";
import { formatEuro, formatCompact } from "@/lib/format";
import { articleLd } from "@/lib/jsonld";

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
  if (c.revenue) faqs.push(it ? { q: `Quanto incassa il ${c.name}?`, a: `Il ${c.name} incassa ${formatEuro(c.revenue)} all'anno (stagione ${c.league === "laliga" ? REVENUE_SEASON : SERIE_A_SEASON}), secondo ${srcName(c.league === "laliga" ? REVENUE_SOURCE : SERIE_A_SOURCE, true)}.` } : { q: `¿Cuánto ingresa el ${c.name}?`, a: `El ${c.name} ingresa ${formatEuro(c.revenue)} al año (temporada ${c.league === "laliga" ? REVENUE_SEASON : SERIE_A_SEASON}), según ${c.league === "laliga" ? REVENUE_SOURCE.name : SERIE_A_SOURCE.name}.` });
  if (c.debt) faqs.push(it ? { q: `Quanto debito ha il ${c.name}?`, a: `Il ${c.name} ha un debito di ${formatEuro(c.debt.amount)} (${kindLabel(c.debt.kind, true)}) al ${c.debt.year}. Fonte: ${srcName(c.debt.source, true)}.` } : { q: `¿Cuánta deuda tiene el ${c.name}?`, a: `El ${c.name} tiene una deuda de ${formatEuro(c.debt.amount)} (${c.debt.kind}) a ${c.debt.year}. Fuente: ${c.debt.source.name}.` });
  if (c.limite) faqs.push(it ? { q: `Qual è il tetto salariale del ${c.name}?`, a: `La LaLiga fissa il tetto salariale del ${c.name} a ${formatEuro(c.limite)} per il ${LALIGA_LCPD_SEASON}.` } : { q: `¿Cuál es el límite salarial del ${c.name}?`, a: `LaLiga fija el límite de coste de plantilla del ${c.name} en ${formatEuro(c.limite)} para ${LALIGA_LCPD_SEASON}.` });
  if (c.wageBill) faqs.push(it ? { q: `Quanto spende il ${c.name} in stipendi?`, a: `Il ${c.name} destina ${formatEuro(c.wageBill)} all'anno agli stipendi dei giocatori (monte ingaggi lordo).` } : { q: `¿Cuánto gasta el ${c.name} en salarios?`, a: `El ${c.name} destina ${formatEuro(c.wageBill)} al año a los salarios de sus jugadores (masa salarial bruta).` });

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
  // La citazione delle fonti nei dati strutturati: i motori con l'AI ci citano invece di riassumerci.
  const artLd = articleLd({ headline: c.name, lang: it ? "it" : "es", url: `${SITE}/futbol/${slug}/`, source: uniqSources, about: t("Cuentas de los clubes de fútbol", "Conti dei club di calcio") });
  const heroImg = c.league === "laliga" ? "/photos/spain-stadium.jpg" : "/photos/italy-stadium.jpg";
  const parts = [c.revenue && `${t("ingresa", "incassa")} ${formatCompact(c.revenue, locale)}`, c.debt && `${t("deuda", "debito")} ${formatCompact(c.debt.amount, locale)}`].filter(Boolean);
  const shareMsg = `⚽ ${c.name}: ${parts.join(", ")} — ${t("datos oficiales", "dati ufficiali")} 👀`;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {artLd.citation.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />}
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
        stat={c.revenue ? formatCompact(c.revenue, locale) : c.debt ? formatCompact(c.debt.amount, locale) : undefined}
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

      {faqs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
          <div className="space-y-2.5">
            {faqs.map((f) => (
              <div key={f.q} className="glass p-4">
                <h3 className="font-medium">{f.q}</h3>
                <p className="text-sm text-muted mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · {t("Hecho en Italia", "Made in Italy")} 🇮🇹</p>
      </footer>
    </main>
  );
}

function Comparison({ a, b, par, itPage, match }: { a: ClubMetrics; b: ClubMetrics; par: string; itPage: boolean; match: Partita | null }) {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  // La pagina italiana vive sotto /calcio/: link e breadcrumb restano in italiano.
  const hub = itPage ? "/calcio/" : "/futbol/";
  const self = `${hub}${par}/`;
  const onlyLimit = !((a.revenue && b.revenue) || (a.debt && b.debt)) && !!(a.limite && b.limite);

  // Ogni riga dice la stagione e, per il debito, il tipo (bruto/netto/cassa) e
  // la data: Barça pubblica il lordo, Real Madrid il netto. Senza etichetta il
  // confronto sembrava 1.451 M€ contro 12 M€ sulla stessa misura, e non lo è.
  const revSeason = (c: ClubMetrics) => (c.league === "laliga" ? REVENUE_SEASON : SERIE_A_SEASON);
  const season = revSeason(a);
  const debtHint = (c: ClubMetrics) => (c.debt ? `${kindLabel(c.debt.kind, it)} · ${t("a", "al")} ${c.debt.year}` : undefined);
  const rows: { label: string; hint?: string; av: string; bv: string; ah?: string; bh?: string }[] = [];
  if (a.limite || b.limite) rows.push({ label: t("Límite salarial (LaLiga)", "Tetto salariale (LaLiga)"), hint: LALIGA_LCPD_SEASON, av: a.limite ? formatEuro(a.limite) : "—", bv: b.limite ? formatEuro(b.limite) : "—" });
  if (a.revenue || b.revenue) rows.push({ label: t("Ingresos (al año)", "Ricavi (all'anno)"), hint: revSeason(a) === revSeason(b) ? revSeason(a) : undefined, av: a.revenue ? formatEuro(a.revenue) : "—", bv: b.revenue ? formatEuro(b.revenue) : "—" });
  if (a.wageBill || b.wageBill) rows.push({ label: t("Salarios de jugadores", "Stipendi dei giocatori"), hint: SERIE_A_SEASON, av: a.wageBill ? formatEuro(a.wageBill) : "—", bv: b.wageBill ? formatEuro(b.wageBill) : "—" });
  if (a.debt || b.debt) rows.push({ label: t("Deuda", "Debito"), av: a.debt ? formatEuro(a.debt.amount) : "—", bv: b.debt ? formatEuro(b.debt.amount) : "—", ah: debtHint(a), bh: debtHint(b) });

  const faqs: { q: string; a: string }[] = [];
  if (match) {
    const h = shortName(match.home), w = shortName(match.away), d = longDate(match.kickoff, it);
    faqs.push({
      q: t(`¿Cuándo se juega el ${h}-${w}?`, `Quando si gioca ${h}-${w}?`),
      a: t(
        `El ${d} (hora peninsular). Es la jornada ${match.round} de ${match.comp === "laliga" ? "LaLiga" : "la Serie A"}. Fuente: ${sourceName(match)}.`,
        `${d.charAt(0).toUpperCase()}${d.slice(1)} (ora italiana). È la ${match.round}ª giornata di ${match.comp === "laliga" ? "LaLiga" : "Serie A"}. Fonte: ${sourceName(match)}.`,
      ),
    });
  }
  if (a.limite && b.limite) {
    const [hi, lo] = a.limite >= b.limite ? [a, b] : [b, a];
    faqs.push({
      q: t(`¿Quién puede gastar más en su plantilla, ${a.name} o ${b.name}?`, `Chi può spendere di più per la rosa, ${a.name} o ${b.name}?`),
      a: t(
        `${hi.name}. LaLiga le deja gastar hasta ${formatEuro(hi.limite!)} en su plantilla en la temporada ${LALIGA_LCPD_SEASON}. Al ${lo.name}, ${formatEuro(lo.limite!)}. Fuente: ${LALIGA_LCPD_SOURCE.name}.`,
        `${hi.name}. La LaLiga gli permette di spendere fino a ${formatEuro(hi.limite!)} per la rosa nella stagione ${LALIGA_LCPD_SEASON}. Al ${lo.name}, ${formatEuro(lo.limite!)}. Fonte: ${srcName(LALIGA_LCPD_SOURCE, true)}.`,
      ),
    });
  }
  if (a.revenue && b.revenue) {
    const [hi, lo] = a.revenue >= b.revenue ? [a, b] : [b, a];
    faqs.push({
      q: t(`¿Quién ingresa más, ${a.name} o ${b.name}?`, `Chi incassa di più, ${a.name} o ${b.name}?`),
      a: t(
        `${hi.name}, con ${formatEuro(hi.revenue!)} de ingresos frente a ${formatEuro(lo.revenue!)} del ${lo.name} (temporada ${season}).`,
        `${hi.name}, con ${formatEuro(hi.revenue!)} di ricavi contro ${formatEuro(lo.revenue!)} del ${lo.name} (stagione ${season}).`,
      ),
    });
  }
  if (a.debt && b.debt) {
    const da = a.debt, db = b.debt;
    const q = t(`¿Quién tiene más deuda, ${a.name} o ${b.name}?`, `Chi ha più debito, ${a.name} o ${b.name}?`);
    if (da.kind === db.kind && da.kind !== "caja") {
      const [hi, lo] = da.amount >= db.amount ? [a, b] : [b, a];
      faqs.push({
        q,
        a: t(
          `${hi.name}: ${formatEuro(hi.debt!.amount)} de deuda ${kindLabel(da.kind, false)} frente a ${formatEuro(lo.debt!.amount)} del ${lo.name}. Fuentes: ${da.source.name}; ${db.source.name}.`,
          `${hi.name}: ${formatEuro(hi.debt!.amount)} di debito ${kindLabel(da.kind, true)} contro ${formatEuro(lo.debt!.amount)} del ${lo.name}. Fonti: ${srcName(da.source, true)}; ${srcName(db.source, true)}.`,
        ),
      });
    } else {
      faqs.push({
        q,
        a: t(
          `No se pueden comparar tal cual, porque cada club publica una medida distinta. ${a.name}: ${formatEuro(da.amount)} (${kindLabel(da.kind, false)}, a ${da.year}). ${b.name}: ${formatEuro(db.amount)} (${kindLabel(db.kind, false)}, a ${db.year}). La deuda neta ya resta el dinero que el club tiene en caja; la bruta no. Fuentes: ${da.source.name}; ${db.source.name}.`,
          `Non si possono confrontare così come sono, perché ogni club pubblica una misura diversa. ${a.name}: ${formatEuro(da.amount)} (${kindLabel(da.kind, true)}, al ${da.year}). ${b.name}: ${formatEuro(db.amount)} (${kindLabel(db.kind, true)}, al ${db.year}). Il debito netto toglie già i soldi in cassa; quello lordo no. Fonti: ${srcName(da.source, true)}; ${srcName(db.source, true)}.`,
        ),
      });
    }
  }
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: t("Fútbol", "Calcio"), item: `${SITE}${hub}` }, { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: `${SITE}${self}` }] };
  const clubHref = (c: ClubMetrics) => (CLUB_PAGE_SLUGS.includes(c.slug) ? `/futbol/${c.slug}/` : hub);
  const sources = [
    match && { name: t(`${sourceName(match)} · calendario oficial`, `${sourceName(match)} · calendario ufficiale`), url: match.source },
    (a.limite || b.limite) && LALIGA_LCPD_SOURCE,
    ((a.revenue && a.league === "laliga") || (b.revenue && b.league === "laliga")) && REVENUE_SOURCE,
    (a.league === "seriea" || b.league === "seriea") && SERIE_A_SOURCE,
    a.debt && a.debt.source,
    b.debt && b.debt.source,
  ].filter(Boolean) as { name: string; url: string }[];
  const uniqSources = Array.from(new Map(sources.map((s) => [s.url, s])).values());
  const artLd = articleLd({ headline: `${a.name} vs ${b.name}`, lang: it ? "it" : "es", url: `${SITE}${self}`, source: uniqSources, about: t("Cuentas de los clubes de fútbol", "Conti dei club di calcio") });
  const filialNote = [a.slug, b.slug].some((s) => s === "real-sociedad" || s === "rc-celta");

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {artLd.citation.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />}
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-fg neon-text font-semibold">Cuentas Claras</Link>{" "}
        <Link href={hub} className="opacity-70 hover:text-fg">/ {t("Fútbol", "Calcio")}</Link>{" "}
        <span className="opacity-50">/ {a.name} vs {b.name}</span>
      </nav>
      <header>
        <p className="text-xs uppercase tracking-widest text-cyan/80">⚽ {t("Comparativa financiera · datos oficiales", "Confronto finanziario · dati ufficiali")}</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-1">
          {flag(a.league)} <span className="neon-text">{a.name}</span> vs {flag(b.league)} <span className="neon-text">{b.name}</span>
        </h1>
        <p className="text-sm text-muted mt-2">{onlyLimit
          ? t("Los dos clubes, lado a lado: cuánto les deja gastar LaLiga en la plantilla. Solo datos oficiales.", "I due club, fianco a fianco: quanto la LaLiga gli lascia spendere per la rosa. Solo dati ufficiali.")
          : t("Los dos clubes, lado a lado: quién ingresa, paga y debe más. Solo datos oficiales.", "I due club, fianco a fianco: chi incassa, paga e deve di più. Solo dati ufficiali.")}</p>
      </header>

      {match && (
        <a href={match.source} target="_blank" rel="noopener noreferrer" className="glass mt-5 flex min-h-[44px] items-center gap-3 px-4 py-3 hover:border-cyan transition">
          <span aria-hidden className="text-xl">📅</span>
          <span className="text-sm">
            <b className="text-fg">{t(`Se juegan el ${longDate(match.kickoff, false)}`, `Si giocano ${longDate(match.kickoff, true)}`)}</b>
            <span className="block text-[12px] text-muted">{shortName(match.home)}-{shortName(match.away)} · {compLabel(match, it)} · {t("hora peninsular · fuente:", "ora italiana · fonte:")} {sourceName(match)} ↗</span>
          </span>
        </a>
      )}

      <div className="glass mt-6 overflow-hidden">
        <div className="grid grid-cols-[1.3fr_1fr_1fr] text-sm">
          <div className="px-3 py-2.5" />
          <div className="px-3 py-2.5 font-semibold text-center border-l border-[var(--panel-border)]">{a.name}</div>
          <div className="px-3 py-2.5 font-semibold text-center border-l border-[var(--panel-border)]">{b.name}</div>
          {rows.map((r) => (
            <div key={r.label} className="contents">
              <div className="px-3 py-2.5 text-muted border-t border-[var(--panel-border)]">
                {r.label}
                {r.hint && <span className="block text-[11px] opacity-70">{r.hint}</span>}
              </div>
              <div className="px-3 py-2.5 tabular text-center border-t border-l border-[var(--panel-border)]">
                {r.av}
                {r.ah && <span className="block text-[11px] text-muted">{r.ah}</span>}
              </div>
              <div className="px-3 py-2.5 tabular text-center border-t border-l border-[var(--panel-border)]">
                {r.bv}
                {r.bh && <span className="block text-[11px] text-muted">{r.bh}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {faqs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
          <div className="space-y-2.5">
            {faqs.map((f, i) => (
              <details key={f.q} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
                <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
                <p className="text-sm text-muted mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <ShareBar className="mt-5" text={`⚽ ${a.name} vs ${b.name} — ${onlyLimit ? t("¿quién puede gastar más?", "chi può spendere di più?") : t("¿quién ingresa y debe más?", "chi incassa e deve di più?")} 👀 ${t("datos oficiales", "dati ufficiali")}`} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={clubHref(a)} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">{t("Cuentas de", "Conti di")} {a.name}</Link>
        <Link href={clubHref(b)} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">{t("Cuentas de", "Conti di")} {b.name}</Link>
        <Link href={hub} className="px-4 py-2 rounded-full text-sm font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">{t("Todo el dinero del fútbol →", "Tutti i soldi del calcio →")}</Link>
      </div>

      <p className="text-[11px] text-muted mt-8">
        {t("Fuentes oficiales: ", "Fonti ufficiali: ")}
        {uniqSources.map((s, i) => (
          <span key={s.url}>{i > 0 ? " · " : ""}<a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{s.name}</a></span>
        ))}
        . {t("Solo cifras verificables; los huecos (—) son datos que ese club no publica en ese apartado.", "Solo cifre verificabili; i trattini (—) sono dati che il club non pubblica in quella voce.")}
        {filialNote && <> {t(LALIGA_LCPD_NOTE.es, LALIGA_LCPD_NOTE.it)}</>}
      </p>
      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · {t("Hecho en Italia", "Made in Italy")} 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function ParClient({ par, locale, match = null }: { par: string; locale?: "es" | "it"; match?: Partita | null }) {
  const pair = parsePair(par);
  return (
    <LocaleProvider force={locale}>
      {pair ? <Comparison a={pair.a} b={pair.b} par={par} itPage={locale === "it"} match={match} /> : CLUBS[par] ? <ClubDetail c={CLUBS[par]} slug={par} /> : null}
    </LocaleProvider>
  );
}
