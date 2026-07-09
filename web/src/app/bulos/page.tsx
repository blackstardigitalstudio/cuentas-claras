import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import bulos from "@/data/bulos.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

type Bulo = {
  lang: string; claim: string; verdict: string; reality: string; topic: string;
  source: { name: string; url: string }; date: string;
};
const ITEMS = bulos as Bulo[];

export const metadata: Metadata = {
  title: "Bulos sobre el dinero público, desmontados con datos · Cuentas Claras",
  description:
    "Antes de compartir, comprueba. Bulos virales sobre dinero público (sueldos, impuestos, ayudas, fondos europeos, deuda) verificados por fact-checkers independientes, con el dato real y el enlace a la verificación. Bufale sui soldi pubblici smontate con i dati.",
  keywords: [
    "bulos dinero público",
    "fact check dinero público",
    "desmontando bulos",
    "bufale soldi pubblici",
    "fake news tasse",
    "verificación fondos europeos",
  ],
  alternates: { canonical: `${SITE}/bulos/` },
  openGraph: {
    title: "Bulos sobre el dinero público, desmontados con datos",
    description: "Bulos virales sobre dinero público verificados por fact-checkers, con el dato real y la fuente.",
    url: `${SITE}/bulos/`,
    type: "website",
  },
};

// Color del veredicto (neutral, no partidista): rojo = falso, ámbar = engañoso, gris = sin pruebas.
function verdictColor(v: string): string {
  const t = v.toLowerCase();
  if (t.startsWith("fals")) return "#ff6b6b";
  if (t.includes("prueba") || t.includes("prove")) return "#94a3b8";
  return "#fbbf24"; // engañoso / ingannevole / fuori contesto
}

function Card({ b }: { b: Bulo }) {
  const c = verdictColor(b.verdict);
  const es = b.lang === "es";
  return (
    <article className="glass p-4 sm:p-5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border" style={{ color: c, borderColor: `${c}66`, background: `${c}14` }}>
          {b.verdict.toUpperCase()}
        </span>
        <span className="text-[11px] text-muted">{b.lang === "es" ? "🇪🇸" : "🇮🇹"} · {b.date}</span>
      </div>
      <p className="mt-2 font-medium leading-snug">
        <span className="text-muted">{es ? "Se dice: " : "Si dice: "}</span>
        <span className="line-through decoration-[rgba(255,107,107,0.5)] decoration-1">“{b.claim}”</span>
      </p>
      <p className="mt-2 text-sm">
        <span className="text-green font-semibold">{es ? "La realidad: " : "La realtà: "}</span>
        <span className="text-fg/85">{b.reality}</span>
      </p>
      <p className="mt-2 text-[11px] text-muted">
        {es ? "Verificado por " : "Verificato da "}
        <a href={b.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{b.source.name}</a>
      </p>
    </article>
  );
}

export default function BulosPage() {
  const esItems = ITEMS.filter((b) => b.lang === "es");
  const itItems = ITEMS.filter((b) => b.lang === "it");

  // FAQPage: pregunta = el bulo como duda, respuesta = la realidad + fuente. Honesto y con atribución.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ITEMS.map((b) => ({
      "@type": "Question",
      name: (b.lang === "es" ? "¿Es verdad que " : "È vero che ") + b.claim.replace(/\.$/, "") + "?",
      acceptedAnswer: { "@type": "Answer", text: `${b.verdict}. ${b.reality} (${b.lang === "es" ? "Verificado por" : "Verificato da"} ${b.source.name}.)` },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Bulos", item: `${SITE}/bulos/` },
    ],
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <header className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">Fact-check · 🇪🇸 🇮🇹</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            Bulos sobre el <span className="neon-text">dinero público</span>, desmontados
          </h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            Vamos al revés del ruido: aquí no hay pánico, hay <span className="text-fg/90">datos</span>. Bulos virales
            sobre sueldos, impuestos, ayudas y fondos europeos, ya verificados por fact-checkers independientes, con la
            cifra real y el enlace a la verificación original.{" "}
            <span className="text-fg/70">Bufale sui soldi pubblici, smontate con i dati.</span>
          </p>
          <p className="text-[11px] text-muted mt-3">
            Cuentas Claras recopila y enlaza verificaciones de terceros (Maldita.es, Newtral, Pagella Politica, AGI…). El
            crédito es de cada verificador; toca la fuente para leer el análisis completo.
          </p>
        </header>

        <section className="mt-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4">🇪🇸 España</h2>
          <div className="space-y-3">
            {esItems.map((b, i) => <Card key={`es-${i}`} b={b} />)}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg md:text-xl font-semibold mb-4">🇮🇹 Italia</h2>
          <div className="space-y-3">
            {itItems.map((b, i) => <Card key={`it-${i}`} b={b} />)}
          </div>
        </section>

        <nav className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
            Ver los datos reales →
          </Link>
          <Link href="/escandalos" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            Escándalos verificados
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
