import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import { COUNTRIES } from "@/lib/data";
import { formatCompact } from "@/lib/format";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

const realGastos = COUNTRIES.es.realNames.reduce((s, n) => s + (COUNTRIES.es.regions[n]?.gastos || 0), 0);
const cityCount = COUNTRIES.es.realNames.length;

export const metadata: Metadata = {
  title: "¿En qué se gasta el dinero de tu ayuntamiento?",
  description:
    "¿A dónde va el dinero público de tu ayuntamiento? Las grandes áreas de gasto (servicios básicos, protección social, educación y cultura, deuda…) explicadas en palabras sencillas, con datos oficiales de cientos de ciudades.",
  keywords: [
    "en qué se gasta el dinero público",
    "a dónde va el dinero público",
    "gasto público España",
    "en qué gasta el ayuntamiento",
    "presupuesto municipal explicado",
  ],
  alternates: { canonical: `${SITE}/en-que-se-gasta-el-dinero-publico/` },
  openGraph: { title: "¿En qué se gasta el dinero público en España?", description: "Las áreas de gasto de tu ayuntamiento, explicadas fácil y con datos oficiales.", url: `${SITE}/en-que-se-gasta-el-dinero-publico/`, type: "article" },
};

const AREAS = [
  { t: "Servicios públicos básicos", d: "Lo del día a día: recogida de basura, limpieza, alumbrado, agua, calles, seguridad y movilidad, urbanismo, parques.", c: "#22d3ee" },
  { t: "Protección y promoción social", d: "Ayudas a personas y familias, servicios sociales, dependencia, fomento del empleo, vivienda social.", c: "#f472b6" },
  { t: "Educación, cultura y deporte", d: "Colegios (mantenimiento), bibliotecas, museos, fiestas, instalaciones deportivas, sanidad local.", c: "#a3e635" },
  { t: "Actuaciones económicas", d: "Comercio y turismo, transporte público, infraestructuras que ayudan a la economía local.", c: "#fbbf24" },
  { t: "Administración y deuda", d: "El coste de gestionar el ayuntamiento (personal, oficinas) y devolver los préstamos con sus intereses.", c: "#818cf8" },
];

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Áreas del gasto público municipal",
  lang: "es",
  url: `https://www.cuentas-clara.com/en-que-se-gasta-el-dinero-publico/`,
  source: FONTI.haciendaDeuda,
  about: "Áreas del gasto público municipal",
});

export default function GuiaGastoPage() {
  const faqs = [
    { q: "¿En qué se gasta el dinero público de un ayuntamiento?", a: "Sobre todo en servicios públicos básicos (basura, limpieza, agua, calles, seguridad), protección social (ayudas, dependencia), educación-cultura-deporte, actuaciones económicas (transporte, turismo) y administración y deuda. En la ficha de cada ciudad puedes ver el reparto exacto." },
    { q: "¿De dónde sale el dinero que gasta el ayuntamiento?", a: "De los impuestos y tasas que pagas (IBI, IAE, basuras, plusvalía…) y de las transferencias que le manda el Estado y la comunidad autónoma. Los ingresos suelen ir casi parejos a los gastos." },
    { q: "¿Cómo sé en qué se gasta el dinero MI ciudad?", a: "Busca tu ciudad en Cuentas Claras: verás cuánto ingresa, cuánto gasta, cuánta deuda tiene, cuánto cobra el alcalde y el desglose del gasto por áreas, con la fuente oficial." },
    { q: "¿Son datos oficiales?", a: "Sí. Vienen de los presupuestos y liquidaciones oficiales (Ministerio de Hacienda y portales de datos abiertos de cada ayuntamiento). Nada inventado." },
  ];
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "En qué se gasta el dinero público", item: `${SITE}/en-que-se-gasta-el-dinero-publico/` }] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <article className="pt-8">
          <HeroBanner priority as="h1" src="/photos/money.jpg" alt="Monedas de euro" kicker="🇪🇸 Guía · explicado fácil" title="¿EN QUÉ SE GASTA EL" highlight="DINERO PÚBLICO?" accent="#22d3ee" accent2="#a78bfa" />
          <p className="text-sm md:text-base text-muted mt-3">
            Tu ayuntamiento cobra dinero (de tus impuestos y del Estado) y lo gasta en servicios para tu ciudad. Aquí
            ves <span className="text-fg/90">a dónde va ese dinero</span>, en fácil. Ya tenemos el gasto de{" "}
            <span className="text-fg/90">{cityCount} ciudades</span> ({formatCompact(realGastos)} en total).
          </p>

          <h2 className="text-lg md:text-xl font-semibold mt-8 mb-3">Las 5 grandes áreas de gasto</h2>
          <div className="space-y-3">
            {AREAS.map((a) => (
              <div key={a.t} className="glass p-4 relative overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${a.c},transparent)` }} />
                <p className="font-semibold" style={{ color: a.c }}>{a.t}</p>
                <p className="text-sm text-muted mt-1">{a.d}</p>
              </div>
            ))}
          </div>

          <div className="glass p-5 mt-8">
            <h2 className="text-base font-semibold">¿Y de dónde sale ese dinero?</h2>
            <p className="text-sm text-muted mt-2">
              De dos sitios: <span className="text-green">tus impuestos y tasas</span> (IBI, basuras, IAE, plusvalía…) y
              el <span className="text-green">dinero que le manda</span> el Estado y la comunidad. En un ayuntamiento
              sano, lo que entra y lo que sale van casi iguales.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
              Ver el gasto de mi ciudad →
            </Link>
            <Link href="/deuda-municipios/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
              Ranking de deuda
            </Link>
            <Link href="/gasto-por-habitante/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
              Gasto por habitante
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
