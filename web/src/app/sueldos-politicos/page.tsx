import type { Metadata } from "next";
import PoliticosClient from "./PoliticosClient";
import { articleLd, FONTI } from "@/lib/jsonld";
import { FAQ_ES, RISPOSTA_ES, faqLd } from "./faq";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "¿Cuánto cobra un político en España? Presidente: 95.944 €",
  description:
    "¿Cuánto cobra un político en España? Presidente del Gobierno: 95.944 € al año. Diputado: 3.366,99 € al mes de base. ¿Y tu alcalde? Hay alguno que cobra más que el presidente.",
  keywords: [
    "cuánto cobra un político",
    "cuánto cobra un político en España",
    "cuánto cobra un alcalde",
    "sueldo presidente del Gobierno",
    "cuánto gana un diputado",
    "sueldo ministro España",
    "sueldos políticos oficiales",
  ],
  alternates: {
    canonical: `${SITE}/sueldos-politicos/`,
    languages: { "es-ES": `${SITE}/sueldos-politicos/`, "it-IT": `${SITE}/stipendi-politici/` },
  },
  openGraph: {
    title: "¿Cuánto cobra un político en España?",
    description: "Presidente del Gobierno 95.944 € al año; diputado 3.366,99 € al mes de base. Cifras oficiales.",
    url: `${SITE}/sueldos-politicos/`,
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Sueldos de los políticos en España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánto cobra un político en España?", description: "Sueldos oficiales de los políticos de España e Italia.", images: ["/og.png"] },
};

const faqJsonLd = faqLd(FAQ_ES);
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Sueldos de políticos", item: `${SITE}/sueldos-politicos/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Retribuciones de los cargos políticos",
  lang: "es",
  url: `https://www.cuentas-clara.com/sueldos-politicos/`,
  source: [FONTI.ley31, FONTI.ispa],
  about: "Retribuciones de los cargos políticos",
});

export default function PoliticosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PoliticosClient faq={FAQ_ES} risposta={RISPOSTA_ES} />
    </>
  );
}
