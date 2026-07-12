import type { Metadata } from "next";
import PoliticosClient from "./PoliticosClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "¿Cuánto cobra un político? Sueldos oficiales en España e Italia",
  description:
    "¿Cuánto gana el presidente del Gobierno, un ministro o un diputado en España? ¿Y un parlamentario en Italia? El presidente español cobra 95.944 €/año y un parlamentario italiano 10.435 €/mes. Cifras oficiales. Quanto guadagna un politico.",
  keywords: [
    "cuánto cobra un político",
    "sueldo presidente del Gobierno",
    "cuánto gana un diputado",
    "sueldo ministro España",
    "quanto guadagna un parlamentare",
    "stipendio deputato senatore",
    "indennità parlamentare",
    "sueldos políticos oficiales",
  ],
  alternates: { canonical: `${SITE}/sueldos-politicos/` },
  openGraph: {
    title: "¿Cuánto cobra un político? España e Italia",
    description: "Presidente 95.944 €/año en España; parlamentario 10.435 €/mes en Italia. Cifras oficiales.",
    url: `${SITE}/sueldos-politicos/`,
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Sueldos de los políticos en España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánto cobra un político?", description: "Sueldos oficiales de los políticos de España e Italia.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto cobra el presidente del Gobierno de España?", a: "95.944 € brutos al año (2025), según el Portal de Transparencia. Además percibe 14 pagas de 1.032 € como diputado." },
    { q: "¿Cuánto gana un parlamentario en Italia?", a: "La indemnización es de 10.435 € brutos al mes (unos 125.220 € al año), más una dieta de 3.503 €/mes y otros reembolsos para gastos." },
    { q: "¿Cuánto gana un diputado en España?", a: "3.050,62 € brutos al mes de base (unos 55.804 € al año), más dietas y otras indemnizaciones." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Sueldos de políticos", item: `${SITE}/sueldos-politicos/` }] };

export default function PoliticosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PoliticosClient />
    </>
  );
}
