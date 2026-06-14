import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES, type CountryCode } from "@/lib/data";
import { formatCompact, formatEuro } from "@/lib/format";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Ranking del gasto público municipal · España e Italia",
  description:
    "¿Qué ciudad gasta más dinero público? Ranking de los ayuntamientos de España e Italia por gasto e ingresos, con datos oficiales. Classifica della spesa pubblica dei comuni di Spagna e Italia.",
  keywords: [
    "ranking gasto público",
    "qué ayuntamiento gasta más",
    "comparativa presupuestos municipales",
    "ciudades que más gastan España",
    "classifica spesa pubblica comuni",
    "quale comune spende di più",
  ],
  alternates: { canonical: `${SITE}/ranking/` },
  openGraph: {
    title: "Ranking del gasto público municipal · España e Italia",
    description: "¿Qué ciudad gasta más? Ranking de ayuntamientos por gasto e ingresos, con datos oficiales.",
    url: `${SITE}/ranking/`,
    type: "website",
  },
};

function ranked(p: CountryCode) {
  return Object.values(COUNTRIES[p].regions)
    .filter((r) => !r.isSample)
    .sort((a, b) => b.gastos - a.gastos);
}

function Section({ pais, title, flag }: { pais: CountryCode; title: string; flag: string }) {
  const rows = ranked(pais);
  if (!rows.length) return null;
  const max = rows[0].gastos;
  return (
    <section className="mt-10">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        {flag} {title} <span className="text-muted font-normal text-sm">· {rows.length}</span>
      </h2>
      <ol className="space-y-1.5">
        {rows.map((r, i) => (
          <li key={r.slug}>
            <Link
              href={`/${pais}/${r.slug}/`}
              className="glass flex items-center gap-3 px-3 py-2.5 hover:border-[rgba(34,211,238,0.45)] transition group"
            >
              <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium group-hover:text-fg">{r.name}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-cyan to-magenta"
                    style={{ width: `${Math.max(4, (r.gastos / max) * 100)}%` }}
                  />
                </span>
              </span>
              <span className="text-right shrink-0">
                <span className="tabular block text-sm font-semibold text-magenta">{formatCompact(r.gastos)}</span>
                <span className="tabular block text-[11px] text-green">{formatCompact(r.ingresos)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function RankingPage() {
  const top = [
    ...ranked("es").map((r) => ({ r, pais: "es" as const })),
    ...ranked("it").map((r) => ({ r, pais: "it" as const })),
  ]
    .sort((a, b) => b.r.gastos - a.r.gastos)
    .slice(0, 20);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Ranking", item: `${SITE}/ranking/` },
    ],
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ranking del gasto público municipal (España e Italia)",
    itemListElement: top.map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.r.name,
      url: `${SITE}/${x.pais}/${x.r.slug}/`,
    })),
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <LocaleProvider>
        <SiteNav />
        <header className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">España · Italia</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            Ranking del <span className="neon-text">gasto público</span>
          </h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            ¿Qué ciudad gasta más dinero público? Ayuntamientos de España e Italia ordenados por gasto (en magenta) e
            ingresos (en verde), con datos oficiales. <span className="text-fg/80">Classifica della spesa pubblica dei comuni.</span>{" "}
            Toca una ciudad para ver el desglose completo.
          </p>
        </header>

        <Section pais="es" title="España" flag="🇪🇸" />
        <Section pais="it" title="Italia" flag="🇮🇹" />

        <p className="mt-10">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block"
          >
            Ver el mapa interactivo →
          </Link>
        </p>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p>
            <span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹
          </p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
