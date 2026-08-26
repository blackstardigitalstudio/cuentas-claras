import type { Metadata } from "next";
import EurocopaClient from "../eurocopa/EurocopaClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sui premi degli Europei.
export const metadata: Metadata = {
  title: "Europei: quanto prende ogni nazionale, turno per turno",
  description:
    "Quanto si guadagna agli Europei di calcio? Una nazionale prende 9,25 milioni di euro solo per partecipare e chi vince arriva fino a 28,25 milioni (come la Spagna a Euro 2024). Il montepremi totale è di 331 milioni. Cifre ufficiali UEFA.",
  keywords: [
    "montepremi Europei calcio",
    "quanto guadagna chi vince gli Europei",
    "premi UEFA Europei",
    "montepremi Euro 2024",
    "premi Euro 2028",
    "quanto si guadagna agli Europei",
    "premio nazionale Europei",
    "montepremi campionato europeo",
  ],
  alternates: {
    canonical: `${SITE}/premi-europei/`,
    languages: { "it-IT": `${SITE}/premi-europei/`, "es-ES": `${SITE}/eurocopa/` },
  },
  openGraph: {
    title: "Europei di calcio: quanto guadagna chi vince",
    description: "9,25 mln € solo per partecipare, fino a 28,25 mln € per chi vince. Montepremi totale 331 mln. Cifre UEFA.",
    url: `${SITE}/premi-europei/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Montepremi Europei di calcio" }],
  },
  twitter: { card: "summary_large_image", title: "Europei: quanto guadagna chi vince?", description: "Il montepremi degli Europei, con cifre ufficiali UEFA.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto guadagna chi vince gli Europei?", a: "Fino a 28,25 milioni di euro: 9,25 per partecipare, più le vittorie (1 milione l'una), gli ottavi (1,5), i quarti (2,5), la semifinale (4) e 8 milioni per aver vinto la finale. È quanto ha preso la Spagna a Euro 2024." },
    { q: "Quanto si prende solo per partecipare agli Europei?", a: "9,25 milioni di euro a nazionale. Poi si aggiungono 1 milione per ogni vittoria nei gironi e 500.000 € per ogni pareggio." },
    { q: "Quando sono i prossimi Europei?", a: "Euro 2028, nel Regno Unito e in Irlanda. La UEFA non ha ancora comunicato la ripartizione dei premi." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Calcio", item: `${SITE}/calcio/` }, { "@type": "ListItem", position: 3, name: "Premi Europei", item: `${SITE}/premi-europei/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Premi degli Europei di calcio",
  lang: "it",
  url: `https://www.cuentas-clara.com/premi-europei/`,
  source: FONTI.uefa,
  about: "Premi degli Europei di calcio",
});

export default function PremiEuropeiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <EurocopaClient locale="it" />
    </>
  );
}
