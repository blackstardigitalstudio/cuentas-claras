import type { Metadata } from "next";
import MundialCopaClient from "./MundialCopaClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Mundial 2026: 50 mln $ al campeón. ¿Y los demás?",
  description:
    "¿Cuánto gana el que gana el Mundial 2026? El campeón se lleva 50 millones de dólares de la FIFA, sobre un total de 655 millones repartidos entre las 48 selecciones. Cifras oficiales. Montepremi Mondiali 2026: quanto guadagna chi vince.",
  keywords: [
    "premios Mundial 2026",
    "cuánto gana el ganador del Mundial",
    "premio campeón Mundial FIFA",
    "montante Mundial 2026",
    "montepremi Mondiali 2026",
    "quanto guadagna chi vince il Mondiale",
    "premio Coppa del Mondo 2026",
    "premi FIFA Mondiali",
  ],
  alternates: {
    canonical: `${SITE}/mundial-2026/`,
    languages: { "es-ES": `${SITE}/mundial-2026/`, "it-IT": `${SITE}/premi-mondiali-2026/` },
  },
  openGraph: {
    title: "Premios del Mundial 2026: cuánto gana el campeón (FIFA)",
    description: "El campeón se lleva 50 mln $; total 655 mln $ entre 48 selecciones. Cifras oficiales de la FIFA.",
    url: `${SITE}/mundial-2026/`,
    type: "article",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Premios del Mundial 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Premios del Mundial 2026", description: "Cuánto gana el campeón y cada selección, con cifras oficiales de la FIFA.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto gana el que gana el Mundial 2026?", a: "La federación campeona recibe 50 millones de dólares de la FIFA, el premio más alto de la historia (42 mln $ en 2022)." },
    { q: "¿Cuál es el montante total del Mundial 2026?", a: "655 millones de dólares en premios, más 72 millones para preparación: en total 727 millones, repartidos entre las 48 selecciones." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: "Mundial 2026", item: `${SITE}/mundial-2026/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Premios del Mundial 2026",
  lang: "es",
  url: `https://www.cuentas-clara.com/mundial-2026/`,
  source: FONTI.fifa,
  about: "Premios del Mundial 2026",
});

export default function MundialCopaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MundialCopaClient />
    </>
  );
}
