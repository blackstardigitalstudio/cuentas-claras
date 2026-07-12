import type { Metadata } from "next";
import FondosClient from "./FondosClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Fondos Next Generation / PNRR: ¿cuánto dinero manda Europa a España e Italia?",
  description:
    "¿Cuánto dinero de Europa recibe España e Italia tras la pandemia? España, hasta 163.000 M€ (unos 80.000 a fondo perdido); Italia, 194.400 M€ con el PNRR. Hay que gastarlo antes de fin de 2026. Cifras oficiales. Quanti soldi riceve l'Italia col PNRR.",
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
  alternates: { canonical: `${SITE}/fondos-europeos/` },
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
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fondos europeos", item: `${SITE}/fondos-europeos/` }] };

export default function FondosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FondosClient />
    </>
  );
}
