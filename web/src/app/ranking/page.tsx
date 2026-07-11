import type { Metadata } from "next";
import { COUNTRIES, type CountryCode } from "@/lib/data";
import RankingClient from "./RankingClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Ranking del gasto público municipal · España e Italia",
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

export default function RankingPage() {
  const top = [
    ...ranked("es").map((r) => ({ r, pais: "es" as const })),
    ...ranked("it").map((r) => ({ r, pais: "it" as const })),
  ]
    .sort((a, b) => b.r.gastos - a.r.gastos)
    .slice(0, 20);
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <RankingClient />
    </>
  );
}
