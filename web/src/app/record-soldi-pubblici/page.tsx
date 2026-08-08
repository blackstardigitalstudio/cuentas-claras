import type { Metadata } from "next";
import RecordsClient from "../records/RecordsClient";
import { buildRecordsData } from "../records/records-data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina dei record sui soldi pubblici.
export const metadata: Metadata = {
  title: "Quale sindaco guadagna di più? E quale città deve di più?",
  description:
    "I record dei soldi pubblici in Italia e Spagna con dati ufficiali: il sindaco più pagato, la città più indebitata, quella che spende di più e la spesa più alta per abitante. Ogni record porta alla scheda della città, con la fonte.",
  keywords: [
    "sindaco più pagato",
    "città più indebitata",
    "comune che spende di più",
    "record spesa pubblica",
    "quale comune ha più debiti",
    "stipendio sindaco più alto",
    "record soldi pubblici",
    "spesa per abitante comuni",
  ],
  alternates: {
    canonical: `${SITE}/record-soldi-pubblici/`,
    languages: { "it-IT": `${SITE}/record-soldi-pubblici/`, "es-ES": `${SITE}/records/` },
  },
  openGraph: {
    title: "I record dei soldi pubblici (Italia e Spagna)",
    description: "Il sindaco più pagato, la città più indebitata e altro, con dati ufficiali.",
    url: `${SITE}/record-soldi-pubblici/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-records.png", width: 1200, height: 630, alt: "I record dei soldi pubblici — Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "I record dei soldi pubblici", description: "Il sindaco più pagato, la città più indebitata e altro.", images: ["/og-records.png"] },
};

export default function RecordSoldiPubbliciPage() {
  const data = buildRecordsData();
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Record dei soldi pubblici", item: `${SITE}/record-soldi-pubblici/` }] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <RecordsClient data={data} locale="it" />
    </>
  );
}
