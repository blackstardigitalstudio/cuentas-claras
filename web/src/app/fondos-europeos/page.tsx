import type { Metadata } from "next";
import FondosClient from "./FondosClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  // CTR 1,2% (647 impr / 8 clic, ott 2026): mancava la parola che la gente
  // cerca («fondos europeos») e la description mescolava IT e dava già tutto.
  title: "Fondos europeos: 163.000 M€ para España. ¿En qué se van?",
  description:
    "¿Sabes en qué se gasta el dinero de Europa? España puede recibir hasta 163.000 M€ y el plazo acaba a fin de 2026. Mira cuánto llegó y qué falta.",
  keywords: [
    "fondos Next Generation España",
    "cuánto dinero recibe España de Europa",
    "Plan de Recuperación",
    "fondos europeos a fondo perdido",
    "PNRR quanti soldi Italia",
    "fondi Next Generation EU",
    "PNRR miliardi",
    "dinero europeo pandemia",
  ],
  alternates: {
    canonical: `${SITE}/fondos-europeos/`,
    languages: { "es-ES": `${SITE}/fondos-europeos/`, "it-IT": `${SITE}/fondi-europei-pnrr/` },
  },
  openGraph: {
    title: "El dinero de Europa: Next Generation / PNRR",
    description: "España hasta 163.000 M€; Italia 194.400 M€ (PNRR). A gastar antes de fin de 2026. Cifras oficiales.",
    url: `${SITE}/fondos-europeos/`,
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Fondos europeos Next Generation en España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "El dinero de Europa: Next Generation / PNRR", description: "Cuánto recibe España e Italia de los fondos europeos, con cifras oficiales.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto dinero recibe España de Europa?", a: "Hasta 163.000 millones de euros (unos 80.000 a fondo perdido). Hasta ahora ha recibido unos 71.000 millones. Fuente: Plan de Recuperación." },
    { q: "¿Cuánto recibe Italia con el PNRR?", a: "194.400 millones de euros: 71.800 a fondo perdido y 122.600 en préstamos. Ya ha recibido en torno al 85%. Fuente: Italia Domani / MEF." },
    { q: "¿Hay que devolver este dinero?", a: "Una parte no (las subvenciones a fondo perdido); la otra sí (los préstamos, en condiciones ventajosas)." },
    { q: "¿Hasta cuándo hay plazo para gastarlo?", a: "El fondo europeo se cierra a finales de 2026: los proyectos tenían que estar terminados antes del 31 de agosto de 2026 y Europa hace los últimos pagos antes del 31 de diciembre de 2026." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fondos europeos", item: `${SITE}/fondos-europeos/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Fondos Next Generation EU",
  lang: "es",
  url: `https://www.cuentas-clara.com/fondos-europeos/`,
  source: FONTI.comisionUE,
  about: "Fondos Next Generation EU",
});

export default function FondosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FondosClient />
    </>
  );
}
