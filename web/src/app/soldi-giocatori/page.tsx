import type { Metadata } from "next";
import JugadoresClient from "../jugadores/JugadoresClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sui soldi dei giocatori.
export const metadata: Metadata = {
  title: "I soldi dei giocatori: Neymar 222 M€, e gli stipendi?",
  description:
    "Qual è il trasferimento più caro della storia del calcio? Neymar, 222 milioni di euro. Qui i trasferimenti record, le clausole di rescissione più alte (fino a 1.000 milioni) e quanto si stima guadagnino Mbappé, Vinícius e Lamine Yamal — con le fonti.",
  keywords: [
    "trasferimento più caro della storia",
    "quanto guadagna Mbappé",
    "quanto guadagna Lamine Yamal",
    "clausola di rescissione più alta",
    "stipendi calciatori",
    "trasferimenti record calcio",
    "quanto costa un calciatore",
    "ingaggio calciatori",
  ],
  alternates: {
    canonical: `${SITE}/soldi-giocatori/`,
    languages: { "it-IT": `${SITE}/soldi-giocatori/`, "es-ES": `${SITE}/jugadores/` },
  },
  openGraph: {
    title: "I soldi dei giocatori: trasferimenti, clausole e stipendi",
    description: "Il trasferimento più caro (Neymar, 222 mln €), le clausole da 1.000 mln e gli stipendi stimati delle stelle.",
    url: `${SITE}/soldi-giocatori/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "I soldi dei giocatori di calcio" }],
  },
  twitter: { card: "summary_large_image", title: "I soldi dei giocatori di calcio", description: "Trasferimenti record, clausole e stipendi stimati, con le fonti.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Qual è il trasferimento più caro della storia?", a: "Neymar, dal Barcellona al PSG nel 2017, per 222 milioni di euro: il PSG pagò la sua clausola di rescissione. Al secondo posto Mbappé (180 milioni, dal Monaco al PSG nel 2018)." },
    { q: "Quanto guadagna Mbappé o Lamine Yamal?", a: "Non esiste una cifra ufficiale: nessun club pubblica gli stipendi. Le stime di stampa parlano di circa 31 milioni di euro l'anno per Mbappé e circa 16,7 milioni per Lamine Yamal. Sono stime, non dati ufficiali." },
    { q: "Cos'è una clausola di rescissione?", a: "È l'importo scritto nel contratto che un club dovrebbe pagare per portare via il giocatore contro la volontà del suo club. In LaLiga le grandi stelle hanno la clausola massima: 1.000 milioni di euro." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Calcio", item: `${SITE}/calcio/` }, { "@type": "ListItem", position: 3, name: "I soldi dei giocatori", item: `${SITE}/soldi-giocatori/` }] };


export default function SoldiGiocatoriPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <JugadoresClient locale="it" />
    </>
  );
}
