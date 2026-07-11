import type { Metadata } from "next";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import ScoopBoard from "@/components/ScoopBoard";
import newsData from "@/data/news.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Escándalos del dinero público · corrupción, fraude y despilfarro (España e Italia)",
  description:
    "Corrupción, fraude, fondos europeos, sentencias y despilfarro del dinero público en España e Italia. Titulares de medios, con enlace a la fuente.",
  keywords: [
    "corrupción dinero público",
    "malversación fondos públicos",
    "escándalos ayuntamiento",
    "fraude dinero público",
    "despilfarro dinero público",
    "fondos europeos irregularidades",
    "corruzione fondi pubblici",
    "danno erariale",
    "scandali appalti comune",
    "sprechi soldi pubblici",
    "fondi PNRR irregolarità",
  ],
  alternates: { canonical: `${SITE}/escandalos/` },
  openGraph: {
    title: "Escándalos del dinero público · España e Italia",
    description:
      "Corrupción, fraude, fondos europeos, sentencias y despilfarro según los medios. Casos recientes, con enlace a la fuente.",
    url: `${SITE}/escandalos/`,
    type: "website",
  },
};

type NewsItem = { title: string; source: string; url: string; date: string | null };
const NEWS = newsData as Record<string, NewsItem[]>;

// ItemList con los titulares (idioma por defecto ES) para datos estructurados.
const top = ["es_scoop", "es_funds", "es_verdicts", "es_waste", "es_salaries", "es_works", "es_subsidies", "es_nepotism", "es_sanctions", "es_investigations"]
  .flatMap((k) => NEWS[k] || [])
  .slice(0, 30);

export default function EscandalosPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Escándalos del dinero público (España e Italia)",
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
      { "@type": "ListItem", position: 2, name: "Escándalos", item: `${SITE}/escandalos/` },
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
            name: "Escándalos del dinero público · España e Italia",
            url: `${SITE}/escandalos/`,
            inLanguage: ["es", "it"],
            isPartOf: { "@type": "WebSite", name: "Cuentas Claras", url: SITE },
            description:
              "Recopilación de titulares de medios sobre corrupción, fraude, fondos europeos, sentencias y despilfarro del dinero público en España e Italia.",
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <LocaleProvider>
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
