import type { Metadata } from "next";
import MundialCopaClient from "../mundial-2026/MundialCopaClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sui premi dei Mondiali 2026.
export const metadata: Metadata = {
  title: "Mondiali 2026: 50 mln $ a chi vince, e agli altri?",
  description:
    "Quanto si guadagna ai Mondiali 2026? La nazionale campione riceve 50 milioni di dollari dalla FIFA, il premio più alto di sempre. Il montepremi totale è di 655 milioni, e anche chi esce subito prende almeno 10,5 milioni. Cifre ufficiali FIFA.",
  keywords: [
    "montepremi Mondiali 2026",
    "quanto guadagna chi vince il Mondiale",
    "premi FIFA Mondiali 2026",
    "premio Coppa del Mondo",
    "quanto paga la FIFA",
    "montepremi Coppa del Mondo 2026",
    "premi nazionali Mondiale",
    "quanto si guadagna ai Mondiali",
  ],
  alternates: {
    canonical: `${SITE}/premi-mondiali-2026/`,
    languages: { "it-IT": `${SITE}/premi-mondiali-2026/`, "es-ES": `${SITE}/mundial-2026/` },
  },
  openGraph: {
    title: "Mondiali 2026: quanto guadagna chi vince",
    description: "50 milioni di dollari al campione, 655 milioni di montepremi totale. Cifre ufficiali FIFA.",
    url: `${SITE}/premi-mondiali-2026/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Montepremi Mondiali 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Mondiali 2026: 50 mln $ a chi vince", description: "Il montepremi dei Mondiali 2026, con cifre ufficiali FIFA.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto guadagna chi vince il Mondiale 2026?", a: "La federazione campione riceve 50 milioni di dollari dalla FIFA, il premio più alto di sempre (erano 42 milioni per l'Argentina nel 2022)." },
    { q: "Qual è il montepremi totale dei Mondiali 2026?", a: "655 milioni di dollari di premi, più 72 milioni (1,5 milioni a squadra) per le spese di preparazione: in tutto 727 milioni, ripartiti tra le 48 nazionali." },
    { q: "Quanto prende una squadra eliminata subito?", a: "Almeno 10,5 milioni di dollari: 9 milioni di premio (33º-48º posto) più 1,5 milioni per la preparazione." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Calcio", item: `${SITE}/calcio/` }, { "@type": "ListItem", position: 3, name: "Premi Mondiali 2026", item: `${SITE}/premi-mondiali-2026/` }] };

export default function PremiMondialiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MundialCopaClient locale="it" />
    </>
  );
}
