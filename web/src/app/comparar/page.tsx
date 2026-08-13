import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES } from "@/lib/data";
import { CMP_ES } from "@/data/compare-lists";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Dos ciudades cara a cara: ¿cuál gasta y debe más?",
  description:
    "Compara dos ciudades de España lado a lado: cuánto ingresan, gastan y deben, y cuánto cobra su alcalde. Datos oficiales. Elige dos ciudades y mira sus cuentas juntas.",
  keywords: ["comparar ciudades", "comparar presupuestos ayuntamientos", "comparativa gasto municipios", "comparar deuda ciudades"],
  alternates: { canonical: `${SITE}/comparar/` },
  openGraph: { title: "Comparar presupuestos de ciudades", description: "Dos ciudades, sus cuentas lado a lado, con datos oficiales.", url: `${SITE}/comparar/`, type: "website" },
};

function nameFor(slug: string): string {
  const m = Object.values(COUNTRIES.es.regions).filter((r) => r.slug === slug);
  return (m.find((r) => !r.isSample) || m[0])?.name || slug;
}

export default function CompararIndex() {
  const pairs: { pair: string; label: string }[] = [];
  for (let i = 0; i < CMP_ES.length; i++)
    for (let j = i + 1; j < CMP_ES.length; j++)
      pairs.push({ pair: `${CMP_ES[i]}-vs-${CMP_ES[j]}`, label: `${nameFor(CMP_ES[i])} vs ${nameFor(CMP_ES[j])}` });

  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Comparar ciudades", item: `${SITE}/comparar/` }] };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <article className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">🇪🇸 Comparativas · datos oficiales</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">Comparar <span className="neon-text">presupuestos</span> de ciudades</h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            Dos ciudades, sus cuentas una al lado de la otra: quién <span className="text-fg/90">ingresa</span>, <span className="text-fg/90">gasta</span> y <span className="text-fg/90">debe</span> más, y cuánto cobra su alcalde. Todo con datos oficiales. Elige una comparación:
          </p>

          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Todas las comparaciones</h2>
            <div className="flex flex-wrap gap-2">
              {pairs.map((p) => (
                <Link key={p.pair} href={`/comparar/${p.pair}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] text-cyan/80 hover:text-fg hover:border-cyan transition">
                  {p.label}
                </Link>
              ))}
            </div>
          </section>

          <nav className="mt-10 pt-6 border-t border-[var(--panel-border)] flex flex-wrap gap-2">
            {[
              { href: "/sueldos-alcaldes/", t: "Sueldos de alcaldes" },
              { href: "/deuda-municipios/", t: "Deuda municipal" },
              { href: "/ranking/", t: "Ranking de gasto" },
              { href: "/gasto-por-habitante/", t: "Gasto por habitante" },
            ].map((p) => (
              <Link key={p.href} href={p.href} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">{p.t}</Link>
            ))}
          </nav>

          <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
            <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
          </footer>
        </article>
      </LocaleProvider>
    </main>
  );
}
