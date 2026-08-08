import type { Metadata } from "next";
import EurocopaClient from "./EurocopaClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Premios de la Eurocopa: ¿cuánto ganó España?",
  description:
    "¿Cuánto se gana en la Eurocopa? España cobró hasta 28,25 mln € por ganar la Euro 2024, sobre un total de 331 millones repartidos entre las 24 selecciones. Cifras oficiales UEFA. Montepremi Europei: quanto guadagna chi vince.",
  keywords: [
    "premios Eurocopa",
    "cuánto ganó España Eurocopa 2024",
    "premio Eurocopa campeón",
    "montante Eurocopa UEFA",
    "montepremi Europei",
    "quanto guadagna chi vince gli Europei",
    "premi UEFA Europei",
    "premios Euro 2028",
  ],
  alternates: {
    canonical: `${SITE}/eurocopa/`,
    languages: { "es-ES": `${SITE}/eurocopa/`, "it-IT": `${SITE}/premi-europei/` },
  },
  openGraph: {
    title: "Premios de la Eurocopa (UEFA)",
    description: "España ganó hasta 28,25 mln € en la Euro 2024; total 331 millones entre 24 selecciones. Cifras oficiales UEFA.",
    url: `${SITE}/eurocopa/`,
    type: "article",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Premios de la Eurocopa" }],
  },
  twitter: { card: "summary_large_image", title: "Premios de la Eurocopa", description: "Cuánto ganó España y cada selección, con cifras oficiales de la UEFA.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto ganó España al ganar la Eurocopa 2024?", a: "Hasta 28,25 millones de euros: 9,25 por participar, más victorias y rondas, y 8 millones por ganar la final. Cifras oficiales UEFA." },
    { q: "¿Cuál es el premio total de la Eurocopa?", a: "331 millones de euros, repartidos entre las 24 selecciones (Euro 2024)." },
    { q: "¿Cuándo es la próxima Eurocopa?", a: "La Euro 2028, en Reino Unido e Irlanda. La UEFA todavía no ha comunicado los premios." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: "Eurocopa", item: `${SITE}/eurocopa/` }] };

export default function EurocopaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <EurocopaClient />
    </>
  );
}
