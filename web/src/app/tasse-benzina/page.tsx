import type { Metadata } from "next";
import BenzinaClient from "./BenzinaClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Nuovo mondo: le tasse sui carburanti. Sono soldi pubblici a tutti gli effetti
// (accisa + IVA) e la ricerca è enorme. Titolo = la domanda PAA testuale.
export const metadata: Metadata = {
  title: "Quanto guadagna lo Stato su un litro di benzina?",
  description:
    "Su un litro di benzina da 1,80 € quasi 1 € va allo Stato: 0,6729 € di accisa più l'IVA al 22%, che si paga anche sull'accisa. È il 55% di quello che paghi. Ecco il conto completo, fatto davanti a te, con la tabella per ogni prezzo.",
  keywords: [
    "quante tasse ci sono sulla benzina",
    "quanto guadagna lo Stato su un litro di benzina",
    "accise benzina",
    "accisa benzina quanto è",
    "quanto costerebbe la benzina senza accise",
    "tasse carburante",
    "IVA benzina",
    "tabella accise carburanti",
  ],
  alternates: { canonical: `${SITE}/tasse-benzina/` },
  openGraph: {
    title: "Quanto guadagna lo Stato su un litro di benzina?",
    description: "Quasi 1 € su un litro da 1,80 €: accisa più IVA. Il conto completo, fatto davanti a te.",
    url: `${SITE}/tasse-benzina/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Le tasse su un litro di benzina" }],
  },
  twitter: { card: "summary_large_image", title: "Quanto guadagna lo Stato su un litro di benzina?", description: "Quasi 1 € su 1,80 €: il conto completo di accise e IVA.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto guadagna lo Stato su un litro di benzina?", a: "Su un litro pagato 1,80 € lo Stato incassa circa 1,00 €: 0,6729 € di accisa più circa 0,32 € di IVA. È circa il 55% del prezzo." },
    { q: "Quali sono le tasse che si pagano sulla benzina?", a: "Due: l'accisa, una tassa fissa per ogni litro (0,6729 € dal 2026), e l'IVA al 22%. L'IVA si calcola sul prezzo che comprende già l'accisa: paghi una tassa anche sopra un'altra tassa." },
    { q: "Quanto costerebbe la benzina senza le accise?", a: "Un litro pagato 1,80 € costerebbe circa 0,98 €: togliendo l'accisa si risparmia sia l'accisa sia l'IVA calcolata su di essa." },
    { q: "Dove finiscono i soldi delle accise?", a: "Nel bilancio dello Stato, come ogni altra tassa: servono a pagare sanità, scuola, pensioni e interessi sul debito. Non sono vincolati a un uso specifico." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Tasse sulla benzina", item: `${SITE}/tasse-benzina/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Accise e IVA sui carburanti",
  lang: "it",
  url: `https://www.cuentas-clara.com/tasse-benzina/`,
  source: FONTI.irpef,
  about: "Accise e IVA sui carburanti",
});

export default function TasseBenzinaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <BenzinaClient />
    </>
  );
}
