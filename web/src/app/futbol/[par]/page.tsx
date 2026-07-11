import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CLUBS, CLUB_COMPARE_SLUGS, CLUB_PAGE_SLUGS, type ClubMetrics,
  LALIGA_LCPD_SOURCE, LALIGA_LCPD_SEASON, REVENUE_SOURCE, REVENUE_SEASON, SERIE_A_SOURCE, SERIE_A_SEASON,
} from "@/data/futbol";
import { formatEuro } from "@/lib/format";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export function generateStaticParams() {
  const list = CLUB_COMPARE_SLUGS.filter((s) => CLUBS[s]);
  const out: { par: string }[] = [];
  // Comparaciones "X vs Y".
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) out.push({ par: `${list[i]}-vs-${list[j]}` });
  // Fichas de un solo club.
  for (const s of CLUB_PAGE_SLUGS) out.push({ par: s });
  return out;
}

function parsePair(par: string): { a: ClubMetrics; b: ClubMetrics } | null {
  const idx = par.indexOf("-vs-");
  if (idx < 0) return null;
  const a = CLUBS[par.slice(0, idx)];
  const b = CLUBS[par.slice(idx + 4)];
  return a && b ? { a, b } : null;
}

type Props = { params: Promise<{ par: string }> };
const flag = (l: string) => (l === "laliga" ? "🇪🇸" : "🇮🇹");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { par } = await params;
  const pair = parsePair(par);
  if (pair) {
    const t = `${pair.a.name} vs ${pair.b.name}: presupuesto, ingresos y deuda`;
    return {
      title: `${t} (comparativa financiera, datos oficiales)`,
      description: `Compara ${pair.a.name} y ${pair.b.name}: límite salarial, ingresos, salarios y deuda, con datos oficiales (LaLiga, Deloitte, bilanci). Solo cifras verificables.`,
      alternates: { canonical: `${SITE}/futbol/${par}/` },
      openGraph: { title: t, description: "Comparativa financiera con datos oficiales.", type: "article" },
    };
  }
  const c = CLUBS[par];
  if (!c || !CLUB_PAGE_SLUGS.includes(par)) return {};
  return {
    title: `${c.name}: ingresos, deuda y límite salarial (cuentas oficiales)`,
    description: `Las cuentas del ${c.name} con datos oficiales: ${c.revenue ? `ingresos de ${formatEuro(c.revenue)}, ` : ""}${c.debt ? `deuda de ${formatEuro(c.debt.amount)}, ` : ""}salarios y límite salarial. Solo cifras verificables.`,
    alternates: { canonical: `${SITE}/futbol/${par}/` },
    openGraph: { title: `${c.name}: ingresos, deuda y límite salarial`, description: "Las cuentas del club con datos oficiales.", type: "article" },
  };
}

export default async function FutbolTokenPage({ params }: Props) {
  const { par } = await params;
  const pair = parsePair(par);
  if (pair) return <Comparison a={pair.a} b={pair.b} par={par} />;
  const club = CLUBS[par];
  if (!club || !CLUB_PAGE_SLUGS.includes(par)) notFound();
  return <ClubDetail c={club} slug={par} />;
}

/* ---------- Ficha de un solo club ---------- */
function ClubDetail({ c, slug }: { c: ClubMetrics; slug: string }) {
  const rows: { label: string; value: string; hint?: string; accent?: string }[] = [];
  if (c.revenue) rows.push({ label: "Ingresos (al año)", value: formatEuro(c.revenue), hint: "lo que factura el club en una temporada" });
  if (c.wageBill) rows.push({ label: "Salarios de jugadores", value: formatEuro(c.wageBill), hint: "coste bruto de la plantilla" });
  if (c.limite) rows.push({ label: "Límite salarial (LaLiga)", value: formatEuro(c.limite), hint: `tope de gasto en plantilla ${LALIGA_LCPD_SEASON}` });
  if (typeof c.net === "number") rows.push({ label: "Resultado del año", value: `${c.net >= 0 ? "+" : "−"}${formatEuro(Math.abs(c.net))}`, hint: c.net >= 0 ? "beneficio" : "pérdidas", accent: c.net >= 0 ? "#34d399" : "#f87171" });
  if (c.debt) rows.push({ label: `Deuda (${c.debt.kind})`, value: formatEuro(c.debt.amount), hint: `a ${c.debt.year}`, accent: "#fdba74" });

  const faqs: { q: string; a: string }[] = [];
  if (c.revenue) faqs.push({ q: `¿Cuánto ingresa el ${c.name}?`, a: `El ${c.name} ingresa ${formatEuro(c.revenue)} al año (temporada ${c.league === "laliga" ? REVENUE_SEASON : SERIE_A_SEASON}), según ${c.league === "laliga" ? REVENUE_SOURCE.name : SERIE_A_SOURCE.name}.` });
  if (c.debt) faqs.push({ q: `¿Cuánta deuda tiene el ${c.name}?`, a: `El ${c.name} tiene una deuda de ${formatEuro(c.debt.amount)} (${c.debt.kind}) a ${c.debt.year}. Fuente: ${c.debt.source.name}.` });
  if (c.limite) faqs.push({ q: `¿Cuál es el límite salarial del ${c.name}?`, a: `LaLiga fija el límite de coste de plantilla del ${c.name} en ${formatEuro(c.limite)} para ${LALIGA_LCPD_SEASON}.` });
  if (c.wageBill) faqs.push({ q: `¿Cuánto gasta el ${c.name} en salarios?`, a: `El ${c.name} destina ${formatEuro(c.wageBill)} al año a los salarios de sus jugadores (monte ingaggi bruto).` });

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: c.name, item: `${SITE}/futbol/${slug}/` }] };

  // Comparaciones que incluyen a este club (si está en la lista de comparativas).
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

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-fg neon-text font-semibold">Cuentas Claras</Link>{" "}
        <Link href="/futbol/" className="opacity-70 hover:text-fg">/ Fútbol</Link>{" "}
        <span className="opacity-50">/ {c.name}</span>
      </nav>

      <header>
        <p className="text-xs uppercase tracking-widest text-cyan/80">{flag(c.league)} {c.league === "laliga" ? "LaLiga" : "Serie A"} · cuentas oficiales</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-1">Las cuentas del <span className="neon-text">{c.name}</span></h1>
        <p className="text-sm text-muted mt-2">Ingresos, salarios, límite salarial y deuda del {c.name}, en cristiano y solo con cifras oficiales (nada de valores de mercado ni sueldos estimados).</p>
      </header>

      <div className="glass mt-6 divide-y divide-[var(--panel-border)]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm text-muted">{r.label}{r.hint ? <span className="block text-[11px] text-muted/60">{r.hint}</span> : null}</span>
            <span className="tabular text-lg font-semibold" style={r.accent ? { color: r.accent } : undefined}>{r.value}</span>
          </div>
        ))}
      </div>

      {compareLinks.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-muted mb-3">Compara al {c.name} con otro club</h2>
          <div className="flex flex-wrap gap-2">
            {compareLinks.map((l) => (
              <Link key={l.pair} href={`/futbol/${l.pair}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">vs {l.name}</Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/futbol/" className="px-4 py-2 rounded-full text-sm font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">Ver todo el dinero del fútbol →</Link>
      </div>

      <p className="text-[11px] text-muted mt-8">
        Fuentes oficiales:{" "}
        {uniqSources.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " · " : ""}
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{s.name}</a>
          </span>
        ))}
        . Solo cifras verificables.
      </p>
    </main>
  );
}

/* ---------- Comparación X vs Y ---------- */
function Comparison({ a, b, par }: { a: ClubMetrics; b: ClubMetrics; par: string }) {
  const rows: { label: string; av: string; bv: string }[] = [];
  if (a.limite || b.limite) rows.push({ label: "Límite salarial (LaLiga)", av: a.limite ? formatEuro(a.limite) : "—", bv: b.limite ? formatEuro(b.limite) : "—" });
  if (a.revenue || b.revenue) rows.push({ label: "Ingresos (al año)", av: a.revenue ? formatEuro(a.revenue) : "—", bv: b.revenue ? formatEuro(b.revenue) : "—" });
  if (a.wageBill || b.wageBill) rows.push({ label: "Salarios de jugadores", av: a.wageBill ? formatEuro(a.wageBill) : "—", bv: b.wageBill ? formatEuro(b.wageBill) : "—" });
  if (a.debt || b.debt) rows.push({ label: "Deuda", av: a.debt ? formatEuro(a.debt.amount) : "—", bv: b.debt ? formatEuro(b.debt.amount) : "—" });

  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      (a.revenue && b.revenue) ? { "@type": "Question", name: `¿Quién ingresa más, ${a.name} o ${b.name}?`, acceptedAnswer: { "@type": "Answer", text: `${a.revenue >= b.revenue ? a.name : b.name}, con ${formatEuro(Math.max(a.revenue, b.revenue))} de ingresos frente a ${formatEuro(Math.min(a.revenue, b.revenue))}.` } } : null,
    ].filter(Boolean),
  };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: `${SITE}/futbol/${par}/` }] };
  const clubHref = (c: ClubMetrics) => (CLUB_PAGE_SLUGS.includes(c.slug) ? `/futbol/${c.slug}/` : "/futbol/");

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-fg neon-text font-semibold">Cuentas Claras</Link>{" "}
        <Link href="/futbol/" className="opacity-70 hover:text-fg">/ Fútbol</Link>{" "}
        <span className="opacity-50">/ {a.name} vs {b.name}</span>
      </nav>

      <header>
        <p className="text-xs uppercase tracking-widest text-cyan/80">⚽ Comparativa financiera · datos oficiales</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-1">
          {flag(a.league)} <span className="neon-text">{a.name}</span> vs {flag(b.league)} <span className="neon-text">{b.name}</span>
        </h1>
        <p className="text-sm text-muted mt-2">Límite salarial, ingresos, salarios y deuda, uno al lado del otro. Solo datos oficiales/verificables (sin valores de mercado ni sueldos estimados).</p>
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

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={clubHref(a)} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">Cuentas del {a.name}</Link>
        <Link href={clubHref(b)} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">Cuentas del {b.name}</Link>
        <Link href="/futbol/" className="px-4 py-2 rounded-full text-sm font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">Todo el dinero del fútbol →</Link>
      </div>

      <p className="text-[11px] text-muted mt-8">Fuentes oficiales: LaLiga (límite de coste de plantilla), Deloitte Football Money League y bilanci de los clubes. Solo cifras verificables; los huecos (—) son datos que ese club no publica en ese apartado.</p>
    </main>
  );
}
