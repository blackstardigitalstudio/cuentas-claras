import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES, type RegionData } from "@/lib/data";
import { formatEuro, formatCompact } from "@/lib/format";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Ciudades más buscadas de España para páginas de comparación "X vs Y".
const TOP = [
  "madrid", "barcelona", "valencia", "sevilla", "zaragoza", "malaga", "murcia", "palma",
  "las-palmas-de-gran-canaria", "bilbao", "alicante", "cordoba", "valladolid", "vigo",
  "gijon", "vitoria-gasteiz", "a-coruna", "granada", "elche-elx", "oviedo",
];

function findBySlug(slug: string): RegionData | null {
  const matches = Object.values(COUNTRIES.es.regions).filter((r) => r.slug === slug);
  return matches.find((r) => !r.isSample) || matches[0] || null;
}

export function generateStaticParams() {
  const out: { par: string }[] = [];
  for (let i = 0; i < TOP.length; i++) for (let j = i + 1; j < TOP.length; j++) out.push({ par: `${TOP[i]}-vs-${TOP[j]}` });
  return out;
}

function parse(par: string): { a: RegionData; b: RegionData } | null {
  const idx = par.indexOf("-vs-");
  if (idx < 0) return null;
  const a = findBySlug(par.slice(0, idx));
  const b = findBySlug(par.slice(idx + 4));
  return a && b ? { a, b } : null;
}

type Props = { params: Promise<{ par: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { par } = await params;
  const p = parse(par);
  if (!p) return {};
  const t = `${p.a.name} vs ${p.b.name}: presupuesto, deuda y sueldo del alcalde`;
  return {
    title: `${t} (comparativa con datos oficiales)`,
    description: `Compara ${p.a.name} y ${p.b.name}: ingresos, gastos, deuda y sueldo del alcalde, con datos oficiales. ${p.a.name} gasta ${formatCompact(p.a.gastos)} y ${p.b.name} ${formatCompact(p.b.gastos)}.`,
    alternates: { canonical: `${SITE}/comparar/${par}/` },
    openGraph: { title: t, description: `Ingresos, gastos, deuda y sueldo del alcalde comparados.`, type: "article" },
  };
}

function perCapita(r: RegionData, v?: number) {
  if (!r.poblacion || !v) return null;
  return Math.round(v / r.poblacion);
}

export default async function CompararPage({ params }: Props) {
  const { par } = await params;
  const p = parse(par);
  if (!p) notFound();
  const { a, b } = p;

  const rows: { label: string; av: string; bv: string; hint?: string }[] = [
    { label: "Gastos (lo que gasta)", av: formatEuro(a.gastos), bv: formatEuro(b.gastos) },
    { label: "Ingresos (lo que entra)", av: formatEuro(a.ingresos), bv: formatEuro(b.ingresos) },
  ];
  if (a.debt || b.debt) rows.push({ label: "Deuda (lo que aún debe)", av: a.debt ? formatEuro(a.debt.amount) : "—", bv: b.debt ? formatEuro(b.debt.amount) : "—" });
  if (a.poblacion || b.poblacion) rows.push({ label: "Habitantes", av: a.poblacion ? a.poblacion.toLocaleString("es") : "—", bv: b.poblacion ? b.poblacion.toLocaleString("es") : "—" });
  const apcD = perCapita(a, a.debt?.amount), bpcD = perCapita(b, b.debt?.amount);
  if (apcD || bpcD) rows.push({ label: "Deuda por habitante", av: apcD ? formatEuro(apcD) : "—", bv: bpcD ? formatEuro(bpcD) : "—" });
  const apcG = perCapita(a, a.gastos), bpcG = perCapita(b, b.gastos);
  if (apcG || bpcG) rows.push({ label: "Gasto por habitante", av: apcG ? formatEuro(apcG) : "—", bv: bpcG ? formatEuro(bpcG) : "—" });
  if (a.mayorSalary || b.mayorSalary) rows.push({ label: "Sueldo del alcalde (año)", av: a.mayorSalary ? formatEuro(a.mayorSalary.amount) : "—", bv: b.mayorSalary ? formatEuro(b.mayorSalary.amount) : "—" });

  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `¿Quién gasta más, ${a.name} o ${b.name}?`, acceptedAnswer: { "@type": "Answer", text: `${a.gastos >= b.gastos ? a.name : b.name} gasta más: ${formatEuro(Math.max(a.gastos, b.gastos))} frente a ${formatEuro(Math.min(a.gastos, b.gastos))}.` } },
      { "@type": "Question", name: `¿Quién tiene más deuda, ${a.name} o ${b.name}?`, acceptedAnswer: { "@type": "Answer", text: a.debt && b.debt ? `${a.debt.amount >= b.debt.amount ? a.name : b.name}, con ${formatEuro(Math.max(a.debt.amount, b.debt.amount))} de deuda viva.` : "Los datos de deuda proceden del Ministerio de Hacienda; consulta la ficha de cada ciudad." } },
    ],
  };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: `${a.name} vs ${b.name}`, item: `${SITE}/comparar/${par}/` }] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-fg neon-text font-semibold">Cuentas Claras</Link>{" "}
        <span className="opacity-50">/ {a.name} vs {b.name}</span>
      </nav>

      <header>
        <p className="text-xs uppercase tracking-widest text-cyan/80">🇪🇸 Comparativa · datos oficiales</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-1">
          <span className="neon-text">{a.name}</span> vs <span className="neon-text">{b.name}</span>
        </h1>
        <p className="text-sm text-muted mt-2">Ingresos, gastos, deuda y sueldo del alcalde, uno al lado del otro. En cristiano: quién ingresa, gasta y debe más.</p>
      </header>

      <div className="glass mt-6 overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] text-sm">
          <div className="px-3 py-2.5 text-muted text-xs uppercase tracking-wide" />
          <div className="px-3 py-2.5 font-semibold text-center border-l border-[var(--panel-border)]">{a.name}</div>
          <div className="px-3 py-2.5 font-semibold text-center border-l border-[var(--panel-border)]">{b.name}</div>
          {rows.map((r) => {
            return (
              <div key={r.label} className="contents">
                <div className="px-3 py-2.5 text-muted border-t border-[var(--panel-border)]">{r.label}</div>
                <div className="px-3 py-2.5 tabular text-center border-t border-l border-[var(--panel-border)]">{r.av}</div>
                <div className="px-3 py-2.5 tabular text-center border-t border-l border-[var(--panel-border)]">{r.bv}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/es/${a.slug}/`} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">Ficha de {a.name}</Link>
        <Link href={`/es/${b.slug}/`} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">Ficha de {b.name}</Link>
        <Link href="/" className="px-4 py-2 rounded-full text-sm font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">Comparar otra ciudad →</Link>
      </div>

      <p className="text-[11px] text-muted mt-8">Datos oficiales (Ministerio de Hacienda, ISPA, presupuestos municipales; población INE 2025). Cada cifra enlaza a su fuente en la ficha de la ciudad.</p>
    </main>
  );
}
