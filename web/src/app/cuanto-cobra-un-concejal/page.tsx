import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import { articleLd, FONTI } from "@/lib/jsonld";
import { TRAMOS_ES, FUENTE_ES, nEu } from "@/data/fasce-sindaci";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  // CTR 1,3% (468 impr / 6 clic, ott 2026): il titolo non aveva un numero e
  // la description non diceva che esiste un tetto. Il tetto (116.160 €, oltre
  // 500.000 abitanti) è quello della Ley 31/2022 PGE 2023 art. 18 (TRAMOS_ES).
  title: "¿Cuánto cobra un concejal? De 0 € a 116.160 € al año",
  description:
    "¿Tu concejal cobra sueldo o solo por pleno? Hay tres casos y un tope legal según los habitantes. Mira cuánto puede cobrar en tu municipio.",
  keywords: ["cuánto cobra un concejal", "sueldo concejal", "retribuciones concejales", "dedicación exclusiva concejal", "dietas concejales"],
  alternates: { canonical: `${SITE}/cuanto-cobra-un-concejal/` },
  openGraph: { title: "¿Cuánto cobra un concejal?", description: "Cómo funciona el sueldo de los concejales, explicado fácil.", url: `${SITE}/cuanto-cobra-un-concejal/`, type: "article" },
};

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Retribuciones de los concejales",
  lang: "es",
  url: `https://www.cuentas-clara.com/cuanto-cobra-un-concejal/`,
  source: [FONTI.lbrl, FONTI.ley31],
  about: "Retribuciones de los concejales",
});

export default function ConcejalPage() {
  const faqs = [
    { q: "¿Cuánto cobra un concejal?", a: "Depende del ayuntamiento y de si tiene dedicación. No hay una cifra única: la fija el pleno de cada ayuntamiento, con topes según el tamaño del municipio. Un concejal sin dedicación puede cobrar solo unos euros por pleno; uno con dedicación exclusiva cobra un sueldo que en las grandes ciudades ronda decenas de miles de euros al año." },
    { q: "¿Todos los concejales cobran un sueldo?", a: "No. Solo los que tienen dedicación exclusiva o parcial (reconocida por el pleno) cobran una retribución fija. El resto cobra únicamente por asistir a plenos y comisiones (una cantidad por sesión) y, muchas veces, poco o nada." },
    { q: "¿Y el alcalde?", a: "El alcalde suele tener dedicación exclusiva y una retribución más alta, también fijada por el pleno con topes legales. En Cuentas Claras puedes ver el sueldo real del alcalde de cada ciudad, con la fuente oficial." },
    {
      q: "¿Cuánto es lo máximo que puede cobrar un concejal?",
      a: `Depende de los habitantes. La ley pone un tope al año por cargo: ${nEu(TRAMOS_ES[1].tope ?? 0)} € de 1.000 a 5.000 habitantes y hasta ${nEu(TRAMOS_ES[TRAMOS_ES.length - 1].tope ?? 0)} € en los municipios de más de 500.000. Por debajo de 1.000 habitantes no hay dedicación exclusiva. Fuente: ${FUENTE_ES.name}.`,
    },
    { q: "¿Quién decide cuánto cobran?", a: "El pleno del ayuntamiento, dentro de los límites máximos que marca la ley (Ley de Bases de Régimen Local y los topes anuales de los Presupuestos Generales del Estado según la población)." },
  ];
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Cuánto cobra un concejal", item: `${SITE}/cuanto-cobra-un-concejal/` }] };

  const casos = [
    { t: "Dedicación exclusiva", d: "El concejal deja su otro trabajo y se dedica solo al ayuntamiento. Cobra un sueldo fijo (retribución), como cualquier empleo. Es lo que más cobra.", c: "#a5b4fc" },
    { t: "Dedicación parcial", d: "Se dedica al ayuntamiento a tiempo parcial. Cobra un sueldo proporcional, menor que el de dedicación exclusiva.", c: "#22d3ee" },
    { t: "Sin dedicación (por asistencia)", d: "Sigue con su trabajo normal y solo cobra por asistir a plenos y comisiones: una cantidad por sesión que decide el ayuntamiento. Suele ser poco.", c: "#f472b6" },
  ];

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <article className="pt-8">
          <HeroBanner priority as="h1" src="/photos/money.jpg" alt="Monedas de euro" kicker="🇪🇸 Explicado fácil" title="¿CUÁNTO COBRA UN" highlight="CONCEJAL?" accent="#a5b4fc" accent2="#22d3ee" />
          <p className="text-sm md:text-base text-muted mt-3">
            No hay una cifra única: depende del ayuntamiento y, sobre todo, de si el concejal tiene «dedicación». Hay tres
            casos. En cristiano, así funciona:
          </p>

          <div className="space-y-3 mt-6">
            {casos.map((c) => (
              <div key={c.t} className="glass p-4 relative overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${c.c},transparent)` }} />
                <p className="font-semibold" style={{ color: c.c }}>{c.t}</p>
                <p className="text-sm text-muted mt-1">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="glass p-5 mt-8">
            <p className="text-sm text-muted">
              La cantidad exacta la decide el <span className="text-fg/90">pleno de cada ayuntamiento</span>, con topes
              legales según la población. Por eso dos concejales de dos ciudades pueden cobrar cosas muy distintas.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sueldos-alcaldes/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
              Ver el sueldo de los alcaldes →
            </Link>
            <Link href="/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
              Buscar tu ciudad
            </Link>
          </div>

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

          <section className="mt-12">
            <h2 className="text-lg font-semibold mb-3">El tope legal, según los habitantes</h2>
            <p className="text-sm text-muted mb-3">Es lo máximo al año que puede cobrar un cargo del ayuntamiento (alcalde o concejal). Cada pleno decide cuánto, sin pasar de aquí.</p>
            <ul className="glass p-4 space-y-1.5 text-sm">
              {TRAMOS_ES.map((t) => (
                <li key={t.min} className="flex justify-between gap-3">
                  <span className="text-muted">{t.label}</span>
                  <span className="font-medium tabular-nums">{t.tope === null ? "sin dedicación exclusiva" : `${nEu(t.tope)} €`}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted mt-2">
              Fuente: <a href={FUENTE_ES.url} target="_blank" rel="noopener" className="underline hover:text-cyan">{FUENTE_ES.name}</a>.
            </p>
          </section>

          <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
            <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
          </footer>
        </article>
      </LocaleProvider>
    </main>
  );
}
