import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES, type CountryCode, type RegionData } from "@/lib/data";
import { formatCompact, formatEuro, formatPct } from "@/lib/format";

const PAISES: CountryCode[] = ["es", "it"];

export function generateStaticParams() {
  const seen = new Set<string>();
  const out: { pais: string; ciudad: string }[] = [];
  for (const p of PAISES) {
    for (const r of Object.values(COUNTRIES[p].regions)) {
      const key = `${p}/${r.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ pais: p, ciudad: r.slug });
    }
  }
  return out;
}

function find(pais: string, ciudad: string): { country: CountryCode; r: RegionData } | null {
  if (pais !== "es" && pais !== "it") return null;
  const r = Object.values(COUNTRIES[pais].regions).find((x) => x.slug === ciudad);
  return r ? { country: pais, r } : null;
}

type Props = { params: Promise<{ pais: string; ciudad: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pais, ciudad } = await params;
  const f = find(pais, ciudad);
  if (!f) return {};
  const { r } = f;
  const es = pais === "es";
  const title = es
    ? `Presupuesto de ${r.name} ${r.year}: ingresos y gastos`
    : `Bilancio di ${r.name} ${r.year}: entrate e spese`;
  const description = es
    ? `Ingresos ${formatCompact(r.ingresos)} y gastos ${formatCompact(r.gastos)} de ${r.name} en ${r.year}. Desglose detallado por capítulo y por área del gasto público. Datos ${r.isSample ? "de ejemplo" : "oficiales"}.`
    : `Entrate ${formatCompact(r.ingresos)} e spese ${formatCompact(r.gastos)} di ${r.name} nel ${r.year}. Dettaglio per capitolo e per missione della spesa pubblica. Dati ${r.isSample ? "di esempio" : "ufficiali"}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${pais}/${ciudad}` },
    openGraph: { title, description, type: "article", locale: es ? "es_ES" : "it_IT" },
  };
}

function Row({ c, total }: { c: { label: string; color: string; amount: number; children?: unknown[] }; total: number }) {
  return (
    <li className="py-1.5 border-b border-[var(--panel-border)]/50">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
          {c.label}
        </span>
        <span className="tabular text-muted">
          {formatEuro(c.amount)} <span className="text-cyan/70">· {formatPct(c.amount / total)}</span>
        </span>
      </div>
    </li>
  );
}

export default async function CityPage({ params }: Props) {
  const { pais, ciudad } = await params;
  const f = find(pais, ciudad);
  if (!f) notFound();
  const { r } = f;
  const es = pais === "es";
  const others = Object.values(COUNTRIES[pais as CountryCode].regions)
    .filter((x) => x.slug !== r.slug && !x.isSample)
    .sort((a, b) => b.gastos - a.gastos)
    .slice(0, 24);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: es ? `Presupuesto de ${r.name} ${r.year}` : `Bilancio di ${r.name} ${r.year}`,
    description: es
      ? `Ingresos y gastos del ${r.isCity ? "ayuntamiento" : "ámbito"} de ${r.name} en ${r.year}, con desglose por capítulo y área.`
      : `Entrate e spese del comune di ${r.name} nel ${r.year}, con dettaglio per capitolo e missione.`,
    creator: { "@type": "Organization", name: "Cuentas Claras" },
    spatialCoverage: r.name,
    temporalCoverage: String(r.year),
    measurementTechnique: r.basis || (r.isSample ? "ejemplo" : "datos oficiales"),
    variableMeasured: [
      { "@type": "PropertyValue", name: es ? "Ingresos" : "Entrate", value: r.ingresos, unitText: "EUR" },
      { "@type": "PropertyValue", name: es ? "Gastos" : "Spese", value: r.gastos, unitText: "EUR" },
    ],
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-fg neon-text font-semibold">
          Cuentas Claras
        </Link>{" "}
        <span className="opacity-50">/ {r.name}</span>
      </nav>

      <header>
        <p className="text-xs uppercase tracking-widest text-cyan/80">
          {pais === "es" ? "🇪🇸 España" : "🇮🇹 Italia"} · {r.isCity ? (es ? "Ayuntamiento" : "Comune") : es ? "Provincia" : "Provincia"}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mt-1">
          {es ? "Presupuesto de" : "Bilancio di"} <span className="neon-text">{r.name}</span> {r.year}
        </h1>
        <p className="text-sm mt-2">
          {r.isSample ? (
            <span className="text-amber">{es ? "⚠️ Cifras de ejemplo (pendiente de datos oficiales)" : "⚠️ Dati di esempio (in attesa di dati ufficiali)"}</span>
          ) : (
            <span className="text-green">
              ● {es ? "Datos reales" : "Dati reali"} {r.year}
              {r.source && (
                <>
                  {" · "}
                  <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
                    {r.source.name}
                  </a>
                </>
              )}
            </span>
          )}
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 mt-6">
        <div className="glass p-4">
          <p className="text-xs text-muted">{es ? "Ingresos" : "Entrate"} {r.year}</p>
          <p className="tabular text-2xl font-semibold text-green mt-1">{formatEuro(r.ingresos)}</p>
        </div>
        <div className="glass p-4">
          <p className="text-xs text-muted">{es ? "Gastos" : "Spese"} {r.year}</p>
          <p className="tabular text-2xl font-semibold text-magenta mt-1">{formatEuro(r.gastos)}</p>
        </div>
      </section>

      <section className="mt-8 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">{es ? "¿De dónde viene el dinero?" : "Da dove arrivano i soldi?"}</h2>
          <ul className="text-sm">
            {[...r.ingresosByCat].sort((a, b) => b.amount - a.amount).map((c) => (
              <Row key={c.key} c={c} total={r.ingresos} />
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">{es ? "¿A dónde va el gasto?" : "Dove va la spesa?"}</h2>
          <ul className="text-sm">
            {[...r.gastosByCat].sort((a, b) => b.amount - a.amount).map((c) => (
              <li key={c.key}>
                <Row c={c} total={r.gastos} />
                {c.children && c.children.length > 1 && (
                  <ul className="ml-5 mb-1">
                    {[...c.children].sort((a, b) => b.amount - a.amount).slice(0, 6).map((sc) => (
                      <li key={sc.key} className="flex justify-between text-[12px] text-muted py-0.5">
                        <span>· {sc.label}</span>
                        <span className="tabular">{formatEuro(sc.amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-8">
        <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {es ? "Ver en el mapa interactivo →" : "Vedi sulla mappa interattiva →"}
        </Link>
      </p>

      {others.length > 0 && (
        <nav className="mt-12 pt-6 border-t border-[var(--panel-border)]">
          <h2 className="text-sm font-medium text-muted mb-3">{es ? "Otras ciudades con datos reales" : "Altre città con dati reali"}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {others.map((o) => (
              <Link key={o.slug} href={`/${pais}/${o.slug}`} className="text-cyan/80 hover:text-fg">
                {o.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </main>
  );
}
