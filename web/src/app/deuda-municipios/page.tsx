import type { Metadata } from "next";
import { formatEuro, formatCompact } from "@/lib/format";
import ranks from "@/data/rankings-es.json";
import DeudaClient from "./DeudaClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";
const pct = Math.round((ranks.debtFree / ranks.debtCount) * 100);

export const metadata: Metadata = {
  // CTR all'0,6% (854 impr / 5 clic, ott 2026): il vecchio titolo non diceva
  // «deuda viva», cioè proprio quello che la gente scrive. La description dava
  // già la risposta (chi è primo): ora la lascia per il clic.
  title: `Deuda viva de los ayuntamientos ${ranks.year}: ¿quién debe más?`,
  description: `¿Tu ayuntamiento debe dinero? Entre todos suman ${formatCompact(ranks.debtTotal)} de deuda viva, pero ${ranks.debtFree.toLocaleString("es")} de ${ranks.debtCount.toLocaleString("es")} no deben nada. Mira el ranking oficial ${ranks.year} de Hacienda.`,
  keywords: [
    "municipios más endeudados España",
    "deuda ayuntamiento",
    "ciudades más endeudadas España",
    "deuda viva entidades locales",
    "deuda viva ayuntamientos",
    "qué es la deuda viva de un ayuntamiento",
    "deuda municipal",
    "qué ayuntamiento debe más",
  ],
  alternates: { canonical: `${SITE}/deuda-municipios/` },
  openGraph: {
    title: `Los municipios más endeudados de España (${ranks.year})`,
    description: `${ranks.topDebt[0].name} lidera con ${formatEuro(ranks.topDebt[0].amount)}. ${pct}% de los municipios no tienen deuda.`,
    url: `${SITE}/deuda-municipios/`,
    type: "website",
    images: [{ url: "/og-deuda.png", width: 1200, height: 630, alt: "¿Cuánta deuda tiene tu ciudad? — datos oficiales" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánta deuda tiene tu ciudad?", description: "Los municipios más endeudados, con datos oficiales.", images: ["/og-deuda.png"] },
};

const top = ranks.topDebt;
const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuál es la ciudad más endeudada de España?", a: `${top[0].name}, con una deuda viva de ${formatEuro(top[0].amount)} a 31/12/${ranks.year}.` },
    { q: "¿Cuántos municipios no tienen deuda?", a: `${ranks.debtFree.toLocaleString("es")} de ${ranks.debtCount.toLocaleString("es")} municipios (${pct}%) no registran ninguna deuda viva.` },
    { q: "¿Qué es la deuda viva de un ayuntamiento?", a: "Es el dinero que el ayuntamiento pidió prestado (a bancos u otras administraciones) y todavía no ha terminado de devolver — como lo que te queda de hipoteca. Se mide a 31 de diciembre. En toda Europa se mide igual, así que los municipios se pueden comparar de verdad. El dato lo publica el Ministerio de Hacienda." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: `Municipios más endeudados de España (${ranks.year})`, itemListElement: top.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `${d.name}: ${formatEuro(d.amount)}` })) };
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Deuda de los municipios", item: `${SITE}/deuda-municipios/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Deuda viva de los municipios españoles",
  lang: "es",
  url: `https://www.cuentas-clara.com/deuda-municipios/`,
  source: FONTI.haciendaDeuda,
  about: "Deuda viva de los municipios españoles",
});

export default function DeudaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DeudaClient />
    </>
  );
}
