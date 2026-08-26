import type { Metadata } from "next";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import ScoopBoard from "@/components/ScoopBoard";
import newsData from "@/data/news.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della bacheca degli scandali sui soldi pubblici.
export const metadata: Metadata = {
  title: "Dove sono finiti i soldi? Scandali, caso per caso",
  description:
    "Corruzione, sprechi, danno erariale, fondi PNRR e appalti: i casi sui soldi pubblici in Italia e Spagna, presi dai titoli dei giornali, ognuno con il link alla fonte.",
  keywords: [
    "corruzione fondi pubblici",
    "danno erariale",
    "scandali appalti comune",
    "sprechi soldi pubblici",
    "fondi PNRR irregolarità",
    "malversazione denaro pubblico",
    "inchieste soldi pubblici",
    "corrupción dinero público",
    "despilfarro dinero público",
  ],
  alternates: {
    canonical: `${SITE}/scandali-soldi-pubblici/`,
    languages: { "it-IT": `${SITE}/scandali-soldi-pubblici/`, "es-ES": `${SITE}/escandalos/` },
  },
  openGraph: {
    title: "Scandali sui soldi pubblici · Italia e Spagna",
    description:
      "Corruzione, sprechi, sentenze e fondi europei secondo i giornali. Casi recenti, ognuno con il link alla fonte.",
    url: `${SITE}/scandali-soldi-pubblici/`,
    type: "website",
    locale: "it_IT",
  },
};

type NewsItem = { title: string; source: string; url: string; date: string | null };
const NEWS = newsData as Record<string, NewsItem[]>;

// ItemList con i titoli italiani per i dati strutturati.
const top = ["it_scoop", "it_funds", "it_verdicts", "it_waste", "it_salaries", "it_works", "it_subsidies", "it_taxes", "it_transparency", "it_nepotism", "it_sanctions", "it_investigations"]
  .flatMap((k) => NEWS[k] || [])
  .slice(0, 30);


export default function ScandaliPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Scandali sui soldi pubblici (Italia e Spagna)",
    itemListElement: top.map((n, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: n.title,
      url: n.url,
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Scandali", item: `${SITE}/scandali-soldi-pubblici/` },
    ],
  };

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Scandali sui soldi pubblici · Italia e Spagna",
            url: `${SITE}/scandali-soldi-pubblici/`,
            inLanguage: ["it", "es"],
            isPartOf: { "@type": "WebSite", name: "Cuentas Claras", url: SITE },
            description:
              "Raccolta di titoli di giornale su corruzione, sprechi, danno erariale, appalti e fondi europei legati ai soldi pubblici in Italia e Spagna.",
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <LocaleProvider force="it">
        <SiteNav />
        <ScoopBoard />

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p>
            <span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹
          </p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
