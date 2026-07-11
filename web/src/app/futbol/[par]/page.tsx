import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CLUBS, CLUB_COMPARE_SLUGS, type ClubMetrics } from "@/data/futbol";
import { formatEuro } from "@/lib/format";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export function generateStaticParams() {
  const list = CLUB_COMPARE_SLUGS.filter((s) => CLUBS[s]);
  const out: { par: string }[] = [];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) out.push({ par: `${list[i]}-vs-${list[j]}` });
  return out;
}

function parse(par: string): { a: ClubMetrics; b: ClubMetrics } | null {
  const idx = par.indexOf("-vs-");
  if (idx < 0) return null;
  const a = CLUBS[par.slice(0, idx)];
  const b = CLUBS[par.slice(idx + 4)];
  return a && b ? { a, b } : null;
}

type Props = { params: Promise<{ par: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { par } = await params;
  const p = parse(par);
  if (!p) return {};
  const t = `${p.a.name} vs ${p.b.name}: presupuesto, ingresos y deuda`;
  return {
    title: `${t} (comparativa financiera, datos oficiales)`,
    description: `Compara ${p.a.name} y ${p.b.name}: límite salarial, ingresos, salarios y deuda, con datos oficiales (LaLiga, Deloitte, bilanci). Solo cifras verificables.`,
    alternates: { canonical: `${SITE}/futbol/${par}/` },
    openGraph: { title: t, description: "Comparativa financiera con datos oficiales.", type: "article" },
  };
}

export default async function ClubComparePage({ params }: Props) {
  const { par } = await params;
  const p = parse(par);
  if (!p) notFound();
  const { a, b } = p;

  const rows: { label: string; av: string; bv: string; hint?: string }[] = [];
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

  const flag = (l: string) => (l === "laliga" ? "🇪🇸" : "🇮🇹");

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
        <Link href="/futbol/" className="px-4 py-2 rounded-full text-sm font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">Ver todo el dinero del fútbol →</Link>
      </div>

      <p className="text-[11px] text-muted mt-8">Fuentes oficiales: LaLiga (límite de coste de plantilla), Deloitte Football Money League y bilanci de los clubes. Solo cifras verificables; los huecos (—) son datos que ese club no publica en ese apartado.</p>
    </main>
  );
}
