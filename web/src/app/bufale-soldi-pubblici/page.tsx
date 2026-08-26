import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import BulosIntro from "../bulos/BulosIntro";
import bulos from "@/data/bulos.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

type Bulo = {
  lang: string; claim: string; verdict: string; reality: string; topic: string;
  source: { name: string; url: string }; date: string;
};
const ITEMS = bulos as Bulo[];

// Versione ITALIANA della pagina sulle bufale sui soldi pubblici.
export const metadata: Metadata = {
  title: `${ITEMS.length} bufale sui soldi pubblici. A quale hai creduto?`,
  description:
    "Prima di condividere, controlla. Le bufale che girano di più sui soldi pubblici — stipendi, tasse, aiuti, fondi europei, debito — smontate una per una con il dato vero e il link a chi le ha verificate.",
  keywords: [
    "bufale soldi pubblici",
    "fake news tasse",
    "fact checking soldi pubblici",
    "bufale stipendi politici",
    "35 euro migranti bufala",
    "fake news fondi europei",
    "bulos dinero público",
    "fact check dinero público",
  ],
  alternates: {
    canonical: `${SITE}/bufale-soldi-pubblici/`,
    languages: { "it-IT": `${SITE}/bufale-soldi-pubblici/`, "es-ES": `${SITE}/bulos/` },
  },
  openGraph: {
    title: "Bufale sui soldi pubblici, smontate con i dati",
    description: "Le bufale che girano di più sui soldi pubblici, con il dato vero e la fonte di chi le ha verificate.",
    url: `${SITE}/bufale-soldi-pubblici/`,
    type: "website",
    locale: "it_IT",
  },
};

// Colore del verdetto (neutro, non di parte): rosso = falso, ambra = ingannevole, grigio = senza prove.
function verdictColor(v: string): string {
  const t = v.toLowerCase();
  if (t.startsWith("fals")) return "#ff6b6b";
  if (t.includes("prueba") || t.includes("prove")) return "#94a3b8";
  return "#fbbf24";
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
        <span className="text-[11px] text-muted">{es ? "🇪🇸" : "🇮🇹"} · {b.date}</span>
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


export default function BufalePage() {
  const esItems = ITEMS.filter((b) => b.lang === "es");
  const itItems = ITEMS.filter((b) => b.lang === "it");

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
      { "@type": "ListItem", position: 2, name: "Bufale", item: `${SITE}/bufale-soldi-pubblici/` },
    ],
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider force="it">
        <SiteNav />
        <BulosIntro />

        <div className="country-flip mt-8">
          <div className="country-es">
            <section>
              <h2 className="text-lg md:text-xl font-semibold mb-4">🇪🇸 Spagna</h2>
              <div className="space-y-3">
                {esItems.map((b, i) => <Card key={`es-${i}`} b={b} />)}
              </div>
            </section>
          </div>
          <div className="country-it">
            <section className="mt-10">
              <h2 className="text-lg md:text-xl font-semibold mb-4">🇮🇹 Italia</h2>
              <div className="space-y-3">
                {itItems.map((b, i) => <Card key={`it-${i}`} b={b} />)}
              </div>
            </section>
          </div>
        </div>

        <nav className="mt-10 flex flex-wrap gap-3">
          <Link href="/italia/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
            Vedi i dati veri →
          </Link>
          <Link href="/scandali-soldi-pubblici/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            Scandali verificati
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
