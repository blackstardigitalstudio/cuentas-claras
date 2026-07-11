import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES, slugify } from "@/lib/data";
import { formatEuro, formatCompact } from "@/lib/format";
import ranks from "@/data/rankings-es.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";
const pct = Math.round((ranks.debtFree / ranks.debtCount) * 100);

export const metadata: Metadata = {
  title: `¿Qué municipios tienen más deuda en España? Ranking ${ranks.year} (deuda viva oficial)`,
  description: `Ranking de los municipios más endeudados de España en ${ranks.year}, con la deuda viva oficial del Ministerio de Hacienda. ${ranks.topDebt[0].name} lidera con ${formatEuro(ranks.topDebt[0].amount)}. Además, ${ranks.debtFree.toLocaleString("es")} de ${ranks.debtCount.toLocaleString("es")} municipios (${pct}%) no tienen ninguna deuda.`,
  keywords: [
    "municipios más endeudados España",
    "deuda ayuntamiento",
    "ciudades más endeudadas España",
    "deuda viva entidades locales",
    "deuda municipal",
    "qué ayuntamiento debe más",
  ],
  alternates: { canonical: `${SITE}/deuda-municipios/` },
  openGraph: {
    title: `Los municipios más endeudados de España (${ranks.year})`,
    description: `${ranks.topDebt[0].name} lidera con ${formatEuro(ranks.topDebt[0].amount)}. ${pct}% de los municipios no tienen deuda.`,
    url: `${SITE}/deuda-municipios/`,
    type: "website",
  },
};

const esSlugs = new Set(Object.values(COUNTRIES.es.regions).filter((r) => !r.isSample).map((r) => r.slug));

function CityName({ name }: { name: string }) {
  const slug = slugify(name);
  if (esSlugs.has(slug)) {
    return <Link href={`/es/${slug}/`} className="font-medium hover:text-cyan">{name}</Link>;
  }
  return <span className="font-medium">{name}</span>;
}

export default function DeudaPage() {
  const top = ranks.topDebt;
  const max = top[0].amount;

  const faqs = [
    { q: "¿Cuál es la ciudad más endeudada de España?", a: `${top[0].name}, con una deuda viva de ${formatEuro(top[0].amount)} a 31/12/${ranks.year}, seguida de ${top[1].name} (${formatEuro(top[1].amount)}) y ${top[2].name} (${formatEuro(top[2].amount)}).` },
    { q: "¿Cuánta deuda tienen en total los ayuntamientos españoles?", a: `La deuda viva del conjunto de los ayuntamientos suma unos ${formatEuro(ranks.debtTotal)} a 31/12/${ranks.year}, según el Ministerio de Hacienda.` },
    { q: "¿Cuántos municipios no tienen deuda?", a: `${ranks.debtFree.toLocaleString("es")} de ${ranks.debtCount.toLocaleString("es")} municipios (${pct}%) no registran ninguna deuda viva. La deuda se concentra en las grandes ciudades.` },
    { q: "¿Qué es la deuda viva?", a: `Es el dinero que el ayuntamiento aún debe devolver (préstamos y créditos pendientes), medido según el Protocolo de Déficit Excesivo (PDE) del Ministerio de Hacienda. Es un dato oficial y comparable entre municipios.` },
  ];

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: `Municipios más endeudados de España (${ranks.year})`, itemListElement: top.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `${d.name}: ${formatEuro(d.amount)}` })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Deuda de los municipios", item: `${SITE}/deuda-municipios/` } ] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <header className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">🇪🇸 España · {ranks.year}</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            ¿Qué municipios tienen más <span className="neon-text">deuda</span>?
          </h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            Ranking de los municipios más endeudados de España por deuda viva oficial (Ministerio de Hacienda, a
            31/12/{ranks.year}). Dato sorprendente: <span className="text-fg/90 font-medium">{ranks.debtFree.toLocaleString("es")} de {ranks.debtCount.toLocaleString("es")} municipios ({pct}%) no tienen ninguna deuda</span>.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { v: formatCompact(top[0].amount), l: `Más endeudado (${top[0].name})`, c: "#fdba74" },
            { v: formatCompact(ranks.debtTotal), l: "Deuda total (ayuntamientos)", c: "#f472b6" },
            { v: `${pct}%`, l: "Municipios sin deuda", c: "#34d399" },
          ].map((k) => (
            <div key={k.l} className="glass p-4 text-center">
              <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
              <p className="text-[11px] text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Los {top.length} municipios más endeudados</h2>
          <ol className="space-y-1.5">
            {top.map((d, i) => (
              <li key={`${d.name}-${i}`} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate"><CityName name={d.name} /></span>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span className="block h-full rounded-full bg-gradient-to-r from-amber to-magenta" style={{ width: `${Math.max(6, (d.amount / max) * 100)}%` }} />
                  </span>
                </span>
                <span className="tabular text-sm font-semibold text-[#fdba74] shrink-0">{formatEuro(d.amount)}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-3">
            Fuente:{" "}
            <a href={ranks.debtSource.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{ranks.debtSource.name}</a>
          </p>
        </section>

        {ranks.debtPerCapita && ranks.debtPerCapita.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg md:text-xl font-semibold mb-1">Los que más deben por habitante</h2>
            <p className="text-[11px] text-cyan/70 mb-4">La deuda repartida entre los vecinos — más justo para comparar ciudades grandes y pequeñas (municipios de más de {ranks.debtPerCapitaMinPop.toLocaleString("es")} habitantes).</p>
            <ol className="space-y-1.5">
              {ranks.debtPerCapita.slice(0, 20).map((d, i) => (
                <li key={d.name} className="glass flex items-center gap-3 px-3 py-2.5">
                  <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium"><CityName name={d.name} /></span>
                    <span className="text-[10px] text-muted">{formatCompact(d.debt)} · {d.pop.toLocaleString("es")} hab.</span>
                  </span>
                  <span className="tabular text-right shrink-0">
                    <span className="block text-sm font-semibold text-[#fdba74]">{formatEuro(d.perCapita)}</span>
                    <span className="block text-[10px] text-muted">por habitante</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-[11px] text-muted mt-3">Deuda: {ranks.debtSource.name}. Población: INE, padrón a 1/1/2025.</p>
          </section>
        )}

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
          <Link href="/sueldos-alcaldes/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
            Ver los sueldos de los alcaldes →
          </Link>
          <Link href="/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            Mapa interactivo
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
