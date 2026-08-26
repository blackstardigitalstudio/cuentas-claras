import type { Metadata } from "next";
import SanitaClient from "./SanitaClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA. Il capitolo di spesa pubblica più grosso del Paese.
export const metadata: Metadata = {
  title: "Sanità: 148 miliardi l'anno. Dove finiscono?",
  description:
    "Quanto spende l'Italia per la sanità? Circa 148,5 miliardi di euro nel 2026, il 6,4% del PIL: fanno circa 2.500 € per abitante. Ma la spesa pubblica copre solo il 73% del totale — il resto lo mettono le famiglie, oltre 40 miliardi l'anno. Cifre ufficiali.",
  keywords: [
    "quanto spende l'Italia per la sanità",
    "spesa sanitaria Italia",
    "quanto costa la sanità in Italia",
    "spesa sanitaria pro capite",
    "Fondo Sanitario Nazionale",
    "spesa sanitaria PIL",
    "quanto costa la sanità a ogni cittadino",
    "spesa sanitaria pubblica",
  ],
  alternates: {
    canonical: `${SITE}/spesa-sanita/`,
    languages: { "it-IT": `${SITE}/spesa-sanita/`, "es-ES": `${SITE}/gasto-sanidad/` },
  },
  openGraph: {
    title: "Sanità: 148 miliardi l'anno. Dove finiscono?",
    description: "Il 6,4% del PIL, circa 2.500 € per abitante. E quello che paghi di tasca tua. Cifre ufficiali.",
    url: `${SITE}/spesa-sanita/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "La spesa sanitaria in Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "Sanità: 148 miliardi l'anno", description: "Dove finiscono i soldi della sanità, con cifre ufficiali.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto spende l'Italia per la sanità in un anno?", a: "Circa 148,5 miliardi di euro di spesa pubblica nel 2026 (previsione del Documento di Finanza Pubblica), pari al 6,4% del PIL. Il Fondo Sanitario Nazionale vale 143,1 miliardi. Fanno circa 2.500 € per abitante." },
    { q: "Quante tasse si pagano per la sanità?", a: "Non esiste una tassa della sanità separata: i soldi arrivano dal calderone generale delle tasse e da lì lo Stato assegna il Fondo Sanitario alle Regioni, che gestiscono ospedali e servizi." },
    { q: "Se spendiamo tanto, perché ci sono le liste d'attesa?", a: "Perché rispetto agli altri Paesi europei spendiamo meno: la spesa pubblica copre il 73% del totale contro una media UE dell'80%. Il resto lo mettono le famiglie, oltre 40 miliardi l'anno." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Spesa sanitaria", item: `${SITE}/spesa-sanita/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Spesa sanitaria pubblica",
  lang: "it",
  url: `https://www.cuentas-clara.com/spesa-sanita/`,
  source: [FONTI.istat, FONTI.sanidad],
  about: "Spesa sanitaria pubblica",
});

export default function SpesaSanitaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SanitaClient locale="it" />
    </>
  );
}
