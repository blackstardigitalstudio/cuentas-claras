import type { Metadata } from "next";
import { COUNTRIES, type CountryCode } from "@/lib/data";
import { formatEuro } from "@/lib/format";
import RankingClient from "./RankingClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "¿Qué ciudad gasta más dinero público? El ranking",
  description:
    "¿Qué ciudad gasta más dinero público? Ranking de los ayuntamientos de España e Italia por gasto e ingresos, con datos oficiales. Classifica della spesa pubblica dei comuni di Spagna e Italia.",
  keywords: [
    "ranking gasto público",
    "qué ayuntamiento gasta más",
    "comparativa presupuestos municipales",
    "ciudades que más gastan España",
    "classifica spesa pubblica comuni",
    "quale comune spende di più",
  ],
  alternates: { canonical: `${SITE}/ranking/` },
  openGraph: {
    title: "Ranking del gasto público municipal · España e Italia",
    description: "¿Qué ciudad gasta más? Ranking de ayuntamientos por gasto e ingresos, con datos oficiales.",
    url: `${SITE}/ranking/`,
    type: "website",
    images: [{ url: "/og-ranking.png", width: 1200, height: 630, alt: "El ranking del dinero público — España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "El ranking del dinero público", description: "¿Qué ciudad gasta más? Con datos oficiales.", images: ["/og-ranking.png"] },
};

function ranked(p: CountryCode) {
  return Object.values(COUNTRIES[p].regions)
    .filter((r) => !r.isSample)
    .sort((a, b) => b.gastos - a.gastos);
}

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Gasto público de los municipios españoles",
  lang: "es",
  url: `https://www.cuentas-clara.com/ranking/`,
  source: FONTI.haciendaDeuda,
  about: "Gasto público de los municipios españoles",
});

export default function RankingPage() {
  const top = [
    ...ranked("es").map((r) => ({ r, pais: "es" as const })),
    ...ranked("it").map((r) => ({ r, pais: "it" as const })),
  ]
    .sort((a, b) => b.r.gastos - a.r.gastos)
    .slice(0, 20);
  // FAQ dalle domande vere, con i numeri presi dalla classifica stessa.
  const es1 = ranked("es")[0];
  const it1 = ranked("it")[0];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      es1 && { q: "¿Qué ciudad española gasta más dinero público?", a: `${es1.name}, con ${formatEuro(es1.gastos)} de gasto en su último presupuesto publicado.` },
      it1 && { q: "¿Qué ciudad italiana gasta más?", a: `${it1.name}, con ${formatEuro(it1.gastos)} de gasto según SIOPE (Contaduría General del Estado italiano).` },
      { q: "¿Gastar más significa gastar peor?", a: "No. Una ciudad grande gasta más porque tiene más gente y más servicios. Para comparar de verdad hay que mirar el gasto por habitante, que también tienes en esta web." },
      { q: "¿De dónde salen estas cifras?", a: "De los presupuestos oficiales de cada ayuntamiento (Ministerio de Hacienda en España, SIOPE en Italia). Cada ciudad enlaza a su fuente en su ficha." },
    ].filter(Boolean).map((f) => ({ "@type": "Question", name: f!.q, acceptedAnswer: { "@type": "Answer", text: f!.a } })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Ranking", item: `${SITE}/ranking/` },
    ],
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ranking del gasto público municipal (España e Italia)",
    itemListElement: top.map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.r.name,
      url: `${SITE}/${x.pais}/${x.r.slug}/`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <RankingClient />
    </>
  );
}
