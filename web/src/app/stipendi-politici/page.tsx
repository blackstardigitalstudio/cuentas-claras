import type { Metadata } from "next";
import PoliticosClient from "../sueldos-politicos/PoliticosClient";
import { articleLd, FONTI } from "@/lib/jsonld";
import { FAQ_IT, RISPOSTA_IT, faqLd } from "../sueldos-politicos/faq";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sugli stipendi dei politici. Stesso contenuto,
// ma con URL e metadati in italiano: è l'unico modo perché Google la mostri a
// chi cerca in italiano (il testo tradotto lato client Google non lo vede).
export const metadata: Metadata = {
  title: "Quanto guadagna un politico in Italia? Deputato: 10.435 €",
  description:
    "Quanto guadagna un politico in Italia? Un parlamentare 10.435 € lordi al mese più la diaria; un sindaco da 2.208 € a 13.800 €, secondo gli abitanti. E il tuo? Cifre ufficiali.",
  keywords: [
    "quanto guadagna un parlamentare",
    "stipendio parlamentari",
    "indennità parlamentare",
    "quanto guadagna un deputato",
    "stipendio senatore",
    "quanto guadagna il presidente della repubblica",
    "stipendi politici italiani",
    "quanto guadagna un politico",
    "quanto guadagna un politico in Italia",
    "quanto guadagna un sindaco",
  ],
  alternates: {
    canonical: `${SITE}/stipendi-politici/`,
    languages: { "it-IT": `${SITE}/stipendi-politici/`, "es-ES": `${SITE}/sueldos-politicos/` },
  },
  openGraph: {
    title: "Quanto guadagna un politico in Italia?",
    description: "Parlamentare 10.435 € lordi al mese, sindaco da 2.208 € a 13.800 €. Cifre ufficiali.",
    url: `${SITE}/stipendi-politici/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stipendi dei politici in Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "Quanto guadagna un politico in Italia?", description: "Stipendi ufficiali dei politici italiani e spagnoli.", images: ["/og.png"] },
};

const faqJsonLd = faqLd(FAQ_IT);
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Stipendi dei politici", item: `${SITE}/stipendi-politici/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Trattamento economico dei parlamentari",
  lang: "it",
  url: `https://www.cuentas-clara.com/stipendi-politici/`,
  source: [FONTI.tuel, FONTI.dmInterno],
  about: "Trattamento economico dei parlamentari",
});

export default function StipendiPoliticiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PoliticosClient locale="it" faq={FAQ_IT} risposta={RISPOSTA_IT} />
    </>
  );
}
