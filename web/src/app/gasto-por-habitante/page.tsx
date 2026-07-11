import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES, slugify } from "@/lib/data";
import { formatEuro, formatCompact } from "@/lib/format";
import ranks from "@/data/rankings-es.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "¿Qué ciudad gasta más por habitante en España? Ranking (datos oficiales)",
  description: `Gasto público municipal por habitante en España: qué ayuntamientos gastan más por cada vecino. ${ranks.gastoPerCapita?.[0]?.name} encabeza con ${formatEuro(ranks.gastoPerCapita?.[0]?.perCapita || 0)} por habitante. Datos oficiales.`,
  keywords: [
    "gasto por habitante",
    "gasto público municipal",
    "qué ciudad gasta más por habitante",
    "gasto ayuntamiento por vecino",
    "presupuesto por habitante España",
  ],
  alternates: { canonical: `${SITE}/gasto-por-habitante/` },
  openGraph: {
    title: "¿Qué ciudad gasta más por habitante en España?",
    description: "Ranking del gasto municipal por vecino, con datos oficiales.",
    url: `${SITE}/gasto-por-habitante/`,
    type: "website",
  },
};

const esSlugs = new Set(Object.values(COUNTRIES.es.regions).filter((r) => !r.isSample).map((r) => r.slug));
function CityName({ name, slug }: { name: string; slug: string }) {
  const s = slug || slugify(name);
  return esSlugs.has(s) ? <Link href={`/es/${s}/`} className="font-medium hover:text-cyan">{name}</Link> : <span className="font-medium">{name}</span>;
}

export default function GastoPorHabitantePage() {
  const pc = ranks.gastoPerCapita || [];
  const max = pc[0]?.perCapita || 1;

  const faqs = [
    { q: "¿Qué ciudad gasta más por habitante en España?", a: `${pc[0]?.name}, con unos ${formatEuro(pc[0]?.perCapita || 0)} de gasto por habitante al año, seguida de ${pc[1]?.name} (${formatEuro(pc[1]?.perCapita || 0)}) y ${pc[2]?.name} (${formatEuro(pc[2]?.perCapita || 0)}). Suelen ser municipios turísticos, que atienden a mucha más gente de la que está empadronada.` },
    { q: "¿Por qué el gasto por habitante es más justo para comparar?", a: "Porque reparte el gasto total entre los vecinos: así puedes comparar una ciudad grande con una pequeña. El gasto total, en cambio, siempre lo lideran las grandes ciudades por tener más población." },
    { q: "¿Esto significa que gastan mal?", a: "No necesariamente. Un gasto alto por habitante puede deberse a turismo, servicios extra o inversiones puntuales. El dato es solo el punto de partida para mirar en qué se gasta cada euro (en la ficha de cada ciudad)." },
    { q: "¿De dónde salen los datos?", a: "De los presupuestos municipales oficiales (Ministerio de Hacienda / portales de datos abiertos) y la población oficial del INE (padrón 2025)." },
  ];

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: "Ciudades que más gastan por habitante en España", itemListElement: pc.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.name}: ${formatEuro(c.perCapita)}` })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Gasto por habitante", item: `${SITE}/gasto-por-habitante/` }] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <header className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">🇪🇸 España</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            ¿Qué ciudad gasta más <span className="neon-text">por habitante</span>?
          </h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            El gasto municipal repartido entre los vecinos — más justo para comparar ciudades grandes y pequeñas.
            En cristiano: cuánto gasta tu ayuntamiento por cada persona.
          </p>
        </header>

        <section className="mt-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Las que más gastan por habitante</h2>
          <ol className="space-y-1.5">
            {pc.slice(0, 25).map((c, i) => (
              <li key={c.slug || c.name} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate"><CityName name={c.name} slug={c.slug} /></span>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-magenta" style={{ width: `${Math.max(6, (c.perCapita / max) * 100)}%` }} />
                  </span>
                  <span className="text-[10px] text-muted">{formatCompact(c.gastos)} · {c.pop.toLocaleString("es")} hab.</span>
                </span>
                <span className="tabular text-right shrink-0">
                  <span className="block text-sm font-semibold text-cyan">{formatEuro(c.perCapita)}</span>
                  <span className="block text-[10px] text-muted">por habitante</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-3">Gasto: {ranks.gastoSource?.name}. Población: INE, padrón 2025.</p>
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
          <Link href="/deuda-municipios/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
            Ver la deuda por habitante →
          </Link>
          <Link href="/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            Buscar tu ciudad
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
