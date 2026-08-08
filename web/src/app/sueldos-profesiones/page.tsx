import type { Metadata } from "next";
import ProfesionesClient from "./ProfesionesClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "¿Cuánto gana un médico, un profesor o un policía? Sueldos públicos",
  description:
    "¿Cuánto gana un médico, un enfermero, un profesor o un policía en España e Italia? Sueldos típicos: médico ~54.000 €, enfermero ~29.000 €, profesor ~34.000 €/año. Trabajan con dinero público. Cifras con fuente (INE, CCNL). Quanto guadagna un medico.",
  keywords: [
    "cuánto gana un médico",
    "cuánto gana un enfermero",
    "cuánto gana un profesor",
    "sueldo policía nacional",
    "quanto guadagna un medico",
    "stipendio infermiere insegnante",
    "sueldos empleados públicos",
    "sueldo funcionario",
  ],
  alternates: {
    canonical: `${SITE}/sueldos-profesiones/`,
    languages: { "es-ES": `${SITE}/sueldos-profesiones/`, "it-IT": `${SITE}/stipendi-professioni/` },
  },
  openGraph: {
    title: "¿Cuánto gana un médico, un profesor o un policía?",
    description: "Sueldos típicos de las profesiones públicas en España e Italia, con fuente.",
    url: `${SITE}/sueldos-profesiones/`,
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Sueldos de las profesiones públicas" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánto gana un médico o un profesor?", description: "Sueldos típicos de las profesiones públicas, con fuente.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto gana un médico?", a: "En España la media en la sanidad pública ronda los 54.000 € brutos al año (de 35.000 a más de 100.000 según antigüedad). En Italia empieza sobre 60.000 € y los jefes llegan a ~110.000 €." },
    { q: "¿Cuánto gana un enfermero?", a: "Alrededor de 28.000-29.000 € brutos al año, tanto en España como en Italia. Sube con la antigüedad." },
    { q: "¿Cuánto gana un profesor?", a: "En España 30.000-38.000 € brutos al año según la comunidad; en Italia unos 30.000 € de funcionario de carrera. Cifras típicas, no fijas." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Sueldos de profesiones públicas", item: `${SITE}/sueldos-profesiones/` }] };

export default function ProfesionesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ProfesionesClient />
    </>
  );
}
