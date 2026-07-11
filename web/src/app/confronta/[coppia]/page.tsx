import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES, type RegionData } from "@/lib/data";
import { formatEuro, formatCompact } from "@/lib/format";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

const TOP = [
  "roma", "milano", "napoli", "torino", "palermo", "genova", "bologna", "firenze", "bari", "catania",
  "venezia", "verona", "messina", "padova", "trieste", "brescia", "prato", "taranto", "modena", "parma",
];

function findBySlug(slug: string): RegionData | null {
  const matches = Object.values(COUNTRIES.it.regions).filter((r) => r.slug === slug);
  return matches.find((r) => !r.isSample) || matches[0] || null;
}

export function generateStaticParams() {
  const out: { coppia: string }[] = [];
  for (let i = 0; i < TOP.length; i++) for (let j = i + 1; j < TOP.length; j++) out.push({ coppia: `${TOP[i]}-vs-${TOP[j]}` });
  return out;
}

function parse(coppia: string): { a: RegionData; b: RegionData } | null {
  const idx = coppia.indexOf("-vs-");
  if (idx < 0) return null;
  const a = findBySlug(coppia.slice(0, idx));
  const b = findBySlug(coppia.slice(idx + 4));
  return a && b ? { a, b } : null;
}

type Props = { params: Promise<{ coppia: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { coppia } = await params;
  const p = parse(coppia);
  if (!p) return {};
  const t = `${p.a.name} vs ${p.b.name}: bilancio, spesa e stipendio del sindaco`;
  return {
    title: `${t} (confronto con dati ufficiali)`,
    description: `Confronta ${p.a.name} e ${p.b.name}: entrate, spese, spesa per abitante e stipendio del sindaco, con dati ufficiali. ${p.a.name} spende ${formatCompact(p.a.gastos)} e ${p.b.name} ${formatCompact(p.b.gastos)}.`,
    alternates: { canonical: `${SITE}/confronta/${coppia}/` },
    openGraph: { title: t, description: `Entrate, spese, spesa per abitante e stipendio del sindaco a confronto.`, type: "article" },
  };
}

const perCap = (r: RegionData, v?: number) => (r.poblacion && v ? Math.round(v / r.poblacion) : null);

export default async function ConfrontaPage({ params }: Props) {
  const { coppia } = await params;
  const p = parse(coppia);
  if (!p) notFound();
  const { a, b } = p;

  const rows: { label: string; av: string; bv: string }[] = [
    { label: "Spese (quanto spende)", av: formatEuro(a.gastos), bv: formatEuro(b.gastos) },
    { label: "Entrate (quanto incassa)", av: formatEuro(a.ingresos), bv: formatEuro(b.ingresos) },
  ];
  if (a.poblacion || b.poblacion) rows.push({ label: "Abitanti", av: a.poblacion ? a.poblacion.toLocaleString("it") : "—", bv: b.poblacion ? b.poblacion.toLocaleString("it") : "—" });
  const apcG = perCap(a, a.gastos), bpcG = perCap(b, b.gastos);
  if (apcG || bpcG) rows.push({ label: "Spesa per abitante", av: apcG ? formatEuro(apcG) : "—", bv: bpcG ? formatEuro(bpcG) : "—" });
  if (a.debt || b.debt) rows.push({ label: "Debito", av: a.debt ? formatEuro(a.debt.amount) : "—", bv: b.debt ? formatEuro(b.debt.amount) : "—" });
  if (a.mayorSalary || b.mayorSalary) rows.push({ label: "Stipendio del sindaco (anno)", av: a.mayorSalary ? formatEuro(a.mayorSalary.amount) : "—", bv: b.mayorSalary ? formatEuro(b.mayorSalary.amount) : "—" });

  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `Chi spende di più, ${a.name} o ${b.name}?`, acceptedAnswer: { "@type": "Answer", text: `${a.gastos >= b.gastos ? a.name : b.name} spende di più: ${formatEuro(Math.max(a.gastos, b.gastos))} contro ${formatEuro(Math.min(a.gastos, b.gastos))}.` } },
    ],
  };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: `${a.name} vs ${b.name}`, item: `${SITE}/confronta/${coppia}/` }] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-fg neon-text font-semibold">Cuentas Claras</Link>{" "}
        <span className="opacity-50">/ {a.name} vs {b.name}</span>
      </nav>

      <header>
        <p className="text-xs uppercase tracking-widest text-cyan/80">🇮🇹 Confronto · dati ufficiali</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-1">
          <span className="neon-text">{a.name}</span> vs <span className="neon-text">{b.name}</span>
        </h1>
        <p className="text-sm text-muted mt-2">Entrate, spese, spesa per abitante e stipendio del sindaco, uno accanto all'altro. In parole semplici: chi incassa e spende di più.</p>
      </header>

      <div className="glass mt-6 overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] text-sm">
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
        <Link href={`/it/${a.slug}/`} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">Scheda di {a.name}</Link>
        <Link href={`/it/${b.slug}/`} className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--panel-border)] hover:border-cyan transition">Scheda di {b.name}</Link>
        <Link href="/" className="px-4 py-2 rounded-full text-sm font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">Confronta un'altra città →</Link>
      </div>

      <p className="text-[11px] text-muted mt-8">Dati ufficiali (SIOPE · Ragioneria dello Stato; stipendio sindaco per legge; popolazione ISTAT). Ogni cifra rimanda alla fonte nella scheda della città.</p>
    </main>
  );
}
