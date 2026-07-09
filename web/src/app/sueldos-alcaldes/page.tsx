import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES, slugify } from "@/lib/data";
import { formatEuro } from "@/lib/format";
import ranks from "@/data/rankings-es.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: `¿Cuánto cobra un alcalde en España? Sueldos ${ranks.year} (ranking oficial)`,
  description: `Ranking de los alcaldes que más cobran en España en ${ranks.year}, con datos oficiales del ISPA. El alcalde de Madrid encabeza con ${formatEuro(ranks.topSalaries[0].amount)}/año. La media de los ${ranks.salaryReporting.toLocaleString("es")} ayuntamientos que declaran es ${formatEuro(ranks.salaryAvg)}/año.`,
  keywords: [
    "cuánto cobra un alcalde",
    "sueldo alcalde España",
    "alcaldes que más cobran",
    "sueldo alcalde Madrid",
    "retribuciones alcaldes",
    "cuánto gana un alcalde",
  ],
  alternates: { canonical: `${SITE}/sueldos-alcaldes/` },
  openGraph: {
    title: `¿Cuánto cobra un alcalde en España? Sueldos ${ranks.year}`,
    description: `Ranking oficial de los alcaldes que más cobran. Media: ${formatEuro(ranks.salaryAvg)}/año.`,
    url: `${SITE}/sueldos-alcaldes/`,
    type: "website",
  },
};

const esSlugs = new Set(Object.values(COUNTRIES.es.regions).filter((r) => !r.isSample).map((r) => r.slug));

function CityName({ name }: { name: string }) {
  const slug = slugify(name);
  if (esSlugs.has(slug)) {
    return (
      <Link href={`/es/${slug}/`} className="font-medium hover:text-cyan">
        {name}
      </Link>
    );
  }
  return <span className="font-medium">{name}</span>;
}

export default function SueldosPage() {
  const top = ranks.topSalaries;
  const max = top[0].amount;

  const faqs = [
    { q: "¿Cuál es el alcalde que más cobra de España?", a: `El alcalde de ${top[0].name}, con ${formatEuro(top[0].amount)} brutos al año (${ranks.year}), seguido de ${top[1].name} (${formatEuro(top[1].amount)}) y ${top[2].name} (${formatEuro(top[2].amount)}).` },
    { q: "¿Cuánto cobra un alcalde de media en España?", a: `La retribución media de los ${ranks.salaryReporting.toLocaleString("es")} ayuntamientos que declaran sus datos al ISPA es de ${formatEuro(ranks.salaryAvg)} brutos al año. Pero hay enormes diferencias según el tamaño del municipio.` },
    { q: "¿Todos los alcaldes cobran un sueldo?", a: `No. ${ranks.salaryZero.toLocaleString("es")} alcaldes declaran una retribución de 0 € y ${ranks.salarySinDedic.toLocaleString("es")} ejercen sin dedicación exclusiva (cobran solo por asistencia a plenos o nada), sobre todo en municipios pequeños.` },
    { q: "¿De dónde salen estos datos?", a: `Del ISPA (Información Salarial de los Puestos de la Administración) del Ministerio de Hacienda y Función Pública, ejercicio ${ranks.year}. Es información oficial y verificable.` },
  ];

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: `Alcaldes que más cobran en España (${ranks.year})`, itemListElement: top.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: `${s.name}: ${formatEuro(s.amount)}` })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Sueldos de alcaldes", item: `${SITE}/sueldos-alcaldes/` } ] };

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
            ¿Cuánto cobra un <span className="neon-text">alcalde</span> en España?
          </h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            Ranking de los alcaldes que más cobran, con datos oficiales del ISPA (Ministerio de Hacienda). La media de
            los {ranks.salaryReporting.toLocaleString("es")} ayuntamientos que declaran es{" "}
            <span className="text-fg/90 font-medium">{formatEuro(ranks.salaryAvg)}/año</span> — pero {ranks.salaryZero.toLocaleString("es")} alcaldes
            cobran 0 €.
          </p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { v: formatEuro(ranks.topSalaries[0].amount), l: `Máximo (${ranks.topSalaries[0].name})`, c: "#a5b4fc" },
            { v: formatEuro(ranks.salaryAvg), l: "Media declarada", c: "#22d3ee" },
            { v: ranks.salaryZero.toLocaleString("es"), l: "Alcaldes que cobran 0 €", c: "#f472b6" },
          ].map((k) => (
            <div key={k.l} className="glass p-4 text-center">
              <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
              <p className="text-[11px] text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Los {top.length} alcaldes que más cobran</h2>
          <ol className="space-y-1.5">
            {top.map((s, i) => (
              <li key={`${s.name}-${i}`} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate"><CityName name={s.name} /></span>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${Math.max(6, (s.amount / max) * 100)}%` }} />
                  </span>
                  {s.prov && <span className="text-[10px] text-muted">{s.prov}{s.dedic ? ` · ${s.dedic}` : ""}</span>}
                </span>
                <span className="tabular text-sm font-semibold text-[#a5b4fc] shrink-0">{formatEuro(s.amount)}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-3">
            Fuente:{" "}
            <a href={ranks.salarySource.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{ranks.salarySource.name}</a>
          </p>
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
            Ver la deuda de los municipios →
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
