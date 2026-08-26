import type { Metadata } from "next";
import SindaciClient from "./SindaciClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Pagina ITALIANA sull'indennità dei sindaci per fascia di abitanti. Nasce dalle
// ricerche reali: la gente cerca "stipendio sindaco 5000 abitanti", "10.000
// abitanti", "quanto guadagna il sindaco al mese", "stipendio netto sindaco".
export const metadata: Metadata = {
  title: "Quanto guadagna un sindaco? Da 2.208 a 13.800 € al mese",
  description:
    "Quanto guadagna il sindaco del tuo comune? Lo fissa la legge in base agli abitanti: 2.208 € lordi al mese fino a 3.000 abitanti, 3.036 € fino a 5.000, 4.002 € fino a 10.000, fino a 13.800 € per le città metropolitane. Tabella completa per fasce, con la norma di riferimento.",
  keywords: [
    "quanto guadagna un sindaco",
    "stipendio sindaco",
    "indennità sindaco",
    "stipendio sindaco 5000 abitanti",
    "stipendio sindaco 10000 abitanti",
    "quanto guadagna il sindaco di un piccolo paese",
    "stipendio sindaco al mese",
    "sindaco più pagato d'Italia",
  ],
  alternates: { canonical: `${SITE}/stipendi-sindaci/` },
  openGraph: {
    title: "Quanto guadagna un sindaco? La tabella per fasce di abitanti",
    description: "Da 2.208 € al mese nei paesi sotto i 3.000 abitanti a 13.800 € nelle città metropolitane. Importi di legge.",
    url: `${SITE}/stipendi-sindaci/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Quanto guadagna un sindaco in Italia" }],
  },
  twitter: { card: "summary_large_image", title: "Quanto guadagna un sindaco?", description: "La tabella completa per fasce di abitanti, con gli importi di legge.", images: ["/og.png"] },
};

// FAQ costruite sulle domande reali di Google ("Le persone hanno chiesto anche").
const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto guadagna il sindaco di un piccolo paese?", a: "In un comune fino a 3.000 abitanti l'indennità è di 2.208 € lordi al mese; da 3.001 a 5.000 abitanti sale a 3.036 €. Se il sindaco è un lavoratore dipendente non in aspettativa, l'importo è dimezzato." },
    { q: "Quanto guadagna il sindaco di un paese con 5.000 abitanti?", a: "Un comune con 5.000 abitanti rientra nella fascia 3.001-5.000: l'indennità è di 3.036 € lordi al mese. Superati i 5.000 abitanti si passa a 4.002 € lordi al mese." },
    { q: "Quanto guadagna il sindaco al mese?", a: "Dipende dagli abitanti del comune: da 2.208 € lordi al mese (fino a 3.000 abitanti) a 13.800 € per i sindaci delle città metropolitane. I capoluoghi di regione prendono 11.040 €." },
    { q: "Qual è il sindaco più pagato d'Italia?", a: "I sindaci delle città metropolitane, con 13.800 € lordi al mese: è il massimo previsto dalla legge, pari all'indennità di un Presidente di Regione." },
    { q: "Quali sono gli stipendi netti di un sindaco?", a: "Gli importi fissati dalla legge sono lordi. Il netto cambia da persona a persona secondo aliquote, detrazioni e addizionali locali: in genere resta poco più della metà del lordo." },
    { q: "Chi decide quanto guadagna un sindaco?", a: "Lo decide la legge, non il comune: l'indennità è una percentuale fissa del trattamento dei Presidenti di Regione (13.800 € lordi al mese), stabilita in base alla popolazione dalla Legge di Bilancio 2022, a regime dal 2024." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Stipendi dei sindaci", item: `${SITE}/stipendi-sindaci/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Indennità di funzione dei sindaci italiani",
  lang: "it",
  url: `https://www.cuentas-clara.com/stipendi-sindaci/`,
  source: FONTI.dmInterno,
  about: "Indennità di funzione dei sindaci italiani",
});

export default function StipendiSindaciPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SindaciClient />
    </>
  );
}
