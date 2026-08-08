import type { Metadata } from "next";
import ChampionsClient from "../champions-league/ChampionsClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sui premi della Champions League.
export const metadata: Metadata = {
  title: "Champions: 18,62 mln € solo per partecipare, e vincendo?",
  description:
    "Quanto si guadagna in Champions League 2025/26? Un club prende 18,62 milioni di euro solo per partecipare, 2,1 milioni per ogni vittoria e fino a 25 milioni giocando e vincendo la finale. Montepremi totale: 2.467 milioni. Cifre ufficiali UEFA.",
  keywords: [
    "montepremi Champions League",
    "quanto guadagna chi vince la Champions",
    "premi Champions League 2025/26",
    "quanto si guadagna in Champions",
    "premi UEFA Champions League",
    "montepremi Champions per partecipare",
    "quanto paga la UEFA",
    "ricavi Champions League club",
  ],
  alternates: {
    canonical: `${SITE}/premi-champions-league/`,
    languages: { "it-IT": `${SITE}/premi-champions-league/`, "es-ES": `${SITE}/champions-league/` },
  },
  openGraph: {
    title: "Champions League: quanto si guadagna davvero",
    description: "18,62 mln € solo per partecipare, 2,1 mln a vittoria, fino a 25 mln con la finale. Cifre ufficiali UEFA.",
    url: `${SITE}/premi-champions-league/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Montepremi Champions League 2025/26" }],
  },
  twitter: { card: "summary_large_image", title: "Champions: 18,62 mln € solo per partecipare", description: "Il montepremi della Champions League, con cifre ufficiali UEFA.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto guadagna chi vince la Champions League?", a: "Solo per la finale, 25 milioni di euro (18,5 per giocarla più 6,5 per vincerla). Sommando la partecipazione, le vittorie e tutti i turni precedenti, un club vincitore può superare i 100 milioni di euro. Cifre ufficiali UEFA." },
    { q: "Quanto si prende solo per giocare la Champions?", a: "18,62 milioni di euro per club (36 club nella fase campionato), più 2,1 milioni per ogni vittoria e 700.000 € per ogni pareggio." },
    { q: "Quanto distribuisce la UEFA in totale?", a: "2.467 milioni di euro solo per la Champions League, su un totale di 3.317 milioni tra tutte le competizioni europee." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Calcio", item: `${SITE}/calcio/` }, { "@type": "ListItem", position: 3, name: "Premi Champions League", item: `${SITE}/premi-champions-league/` }] };

export default function PremiChampionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ChampionsClient locale="it" />
    </>
  );
}
