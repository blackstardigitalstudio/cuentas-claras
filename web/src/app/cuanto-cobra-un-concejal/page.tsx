import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "¿Cuánto cobra un concejal? Cómo funciona el sueldo de los concejales",
  description:
    "¿Cuánto cobra un concejal de un ayuntamiento? Te explicamos fácil los tres casos (dedicación exclusiva, parcial o solo por asistencia a plenos) y dónde ver el sueldo real del alcalde de tu ciudad.",
  keywords: ["cuánto cobra un concejal", "sueldo concejal", "retribuciones concejales", "dedicación exclusiva concejal", "dietas concejales"],
  alternates: { canonical: `${SITE}/cuanto-cobra-un-concejal/` },
  openGraph: { title: "¿Cuánto cobra un concejal?", description: "Cómo funciona el sueldo de los concejales, explicado fácil.", url: `${SITE}/cuanto-cobra-un-concejal/`, type: "article" },
};

export default function ConcejalPage() {
  const faqs = [
    { q: "¿Cuánto cobra un concejal?", a: "Depende del ayuntamiento y de si tiene dedicación. No hay una cifra única: la fija el pleno de cada ayuntamiento, con topes según el tamaño del municipio. Un concejal sin dedicación puede cobrar solo unos euros por pleno; uno con dedicación exclusiva cobra un sueldo que en las grandes ciudades ronda decenas de miles de euros al año." },
    { q: "¿Todos los concejales cobran un sueldo?", a: "No. Solo los que tienen dedicación exclusiva o parcial (reconocida por el pleno) cobran una retribución fija. El resto cobra únicamente por asistir a plenos y comisiones (una cantidad por sesión) y, muchas veces, poco o nada." },
    { q: "¿Y el alcalde?", a: "El alcalde suele tener dedicación exclusiva y una retribución más alta, también fijada por el pleno con topes legales. En Cuentas Claras puedes ver el sueldo real del alcalde de cada ciudad, con la fuente oficial." },
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

          <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
            <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
          </footer>
        </article>
      </LocaleProvider>
    </main>
  );
}
