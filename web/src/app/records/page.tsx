import type { Metadata } from "next";
import RecordsClient from "./RecordsClient";
import { buildRecordsData } from "./records-data";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "¿Qué alcalde cobra más y qué ciudad debe más?",
  description:
    "Los récords del dinero público en España e Italia con datos oficiales: el alcalde que más cobra, la ciudad más endeudada, la que más gasta y el mayor gasto por habitante.",
  keywords: ["alcalde mejor pagado", "ciudad más endeudada", "quién gasta más dinero público", "récords gasto municipal", "sindaco più pagato", "città più indebitata"],
  alternates: {
    canonical: `${SITE}/records/`,
    languages: { "es-ES": `${SITE}/records/`, "it-IT": `${SITE}/record-soldi-pubblici/` },
  },
  openGraph: {
    title: "Récords del dinero público (España e Italia)",
    description: "El alcalde mejor pagado, la ciudad más endeudada y más, con datos oficiales.",
    url: `${SITE}/records/`,
    type: "article",
    images: [{ url: "/og-records.png", width: 1200, height: 630, alt: "Los récords del dinero público — España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "Récords del dinero público", description: "El alcalde mejor pagado, la ciudad más endeudada y más.", images: ["/og-records.png"] },
};

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Récords del dinero público",
  lang: "es",
  url: `https://www.cuentas-clara.com/records/`,
  source: [FONTI.haciendaDeuda, FONTI.ispa],
  about: "Récords del dinero público",
});

export default function RecordsPage() {
  const data = buildRecordsData();
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Récords", item: `${SITE}/records/` }] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <RecordsClient data={data} />
    </>
  );
}
