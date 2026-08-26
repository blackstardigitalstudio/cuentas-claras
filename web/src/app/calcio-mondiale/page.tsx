import type { Metadata } from "next";
import { formatCompact } from "@/lib/format";
import { LEAGUES, CLUB_REVENUE } from "@/data/futbol";
import MundialClient from "../futbol-mundial/MundialClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

const leagues = [...LEAGUES].sort((a, b) => b.revenue - a.revenue);
const clubs = [...CLUB_REVENUE].sort((a, b) => b.amount - a.amount);

// Versione ITALIANA della pagina sui soldi del calcio mondiale.
export const metadata: Metadata = {
  title: "La Premier incassa 9,6 miliardi. E gli altri?",
  description: `Qual è il campionato di calcio più ricco del mondo? La ${leagues[0].league}, con ${formatCompact(leagues[0].revenue)} di ricavi, davanti a ${leagues[1].league} (${formatCompact(leagues[1].revenue)}). E il club che incassa di più? Il ${clubs[0].club}, con ${formatCompact(clubs[0].amount)}: l'unico al mondo sopra il miliardo. Dati ufficiali.`,
  keywords: [
    "campionato di calcio più ricco",
    "fatturato Premier League",
    "quale campionato incassa di più",
    "club più ricco del mondo",
    "ricavi Serie A",
    "quanto fattura la Serie A",
    "classifica ricavi club calcio",
    "Deloitte Football Money League",
  ],
  alternates: {
    canonical: `${SITE}/calcio-mondiale/`,
    languages: { "it-IT": `${SITE}/calcio-mondiale/`, "es-ES": `${SITE}/futbol-mundial/` },
  },
  openGraph: {
    title: "I soldi del calcio mondiale: chi incassa di più",
    description: `La ${leagues[0].league} è il campionato più ricco; il ${clubs[0].club} il club che incassa di più. Dati ufficiali.`,
    url: `${SITE}/calcio-mondiale/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "I soldi del calcio mondiale" }],
  },
  twitter: { card: "summary_large_image", title: "I soldi del calcio mondiale", description: "Quale campionato e quale club incassano di più, con dati ufficiali.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Qual è il campionato di calcio più ricco del mondo?", a: `La ${leagues[0].league}, con circa ${formatCompact(leagues[0].revenue)} di ricavi totali, davanti a ${leagues[1].league} (${formatCompact(leagues[1].revenue)}).` },
    { q: "Qual è il club di calcio che incassa di più al mondo?", a: `Il ${clubs[0].club}, con ${formatCompact(clubs[0].amount)} (stagione 2024/25, Deloitte): l'unico club al mondo sopra il miliardo di euro.` },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Calcio", item: `${SITE}/calcio/` }, { "@type": "ListItem", position: 3, name: "Calcio mondiale", item: `${SITE}/calcio-mondiale/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Ricavi dei campionati e dei club di calcio",
  lang: "it",
  url: `https://www.cuentas-clara.com/calcio-mondiale/`,
  source: FONTI.deloitte,
  about: "Ricavi dei campionati e dei club di calcio",
});

export default function CalcioMondialePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MundialClient locale="it" />
    </>
  );
}
