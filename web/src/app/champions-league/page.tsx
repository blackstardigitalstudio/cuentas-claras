import type { Metadata } from "next";
import ChampionsClient from "./ChampionsClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Premios Champions League 2025/26: cuánto gana el campeón y por partido (UEFA)",
  description:
    "¿Cuánto se gana en la Champions League 2025/26? Un club cobra 18,62 mln € solo por participar, 2,1 mln € por victoria y hasta 25 mln € por ganar la final, con un bote total de 2.467 millones. Cifras oficiales UEFA. Montepremi Champions 2025/26.",
  keywords: [
    "premios Champions League 2025/26",
    "cuánto gana el ganador de la Champions",
    "premio Champions por partido",
    "cuánto se cobra por jugar la Champions",
    "montepremi Champions League",
    "quanto guadagna chi vince la Champions",
    "premi UEFA Champions League",
    "reparto UEFA Champions",
  ],
  alternates: { canonical: `${SITE}/champions-league/` },
  openGraph: {
    title: "Premios Champions League 2025/26 (UEFA)",
    description: "18,62 mln € solo por participar, 2,1 mln € por victoria, hasta 25 mln € por ganar la final. Bote total 2.467 millones. Cifras oficiales UEFA.",
    url: `${SITE}/champions-league/`,
    type: "article",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Premios Champions League 2025/26" }],
  },
  twitter: { card: "summary_large_image", title: "Premios Champions League 2025/26", description: "Cuánto gana el campeón y por partido, con cifras oficiales de la UEFA.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto gana el ganador de la Champions League 2025/26?", a: "Solo por la final, 25 millones de euros (18,5 por jugarla + 6,5 por ganarla). Sumando participación, victorias y rondas previas, un campeón puede superar los 100 millones. Cifras oficiales UEFA." },
    { q: "¿Cuánto se cobra solo por jugar la Champions?", a: "18,62 millones de euros por club, más 2,1 millones por cada victoria y 700.000 € por empate en la fase liga." },
    { q: "¿Cuánto reparte la UEFA en total?", a: "2.467 millones de euros solo para la Champions League, de un total de 3.317 millones entre todas las competiciones europeas." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: "Champions League", item: `${SITE}/champions-league/` }] };

export default function ChampionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ChampionsClient />
    </>
  );
}
