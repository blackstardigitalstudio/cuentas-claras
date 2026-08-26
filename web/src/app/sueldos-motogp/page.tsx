import type { Metadata } from "next";
import MotogpClient from "../stipendi-motogp/MotogpClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versión ESPAÑOLA de la página sobre el dinero de MotoGP.
// Los sueldos NO son oficiales → se muestran como estimaciones etiquetadas.
// El único dato seguro es el salario mínimo desde 2027.
export const metadata: Metadata = {
  title: "Un piloto de MotoGP cobra 12 mln €. ¿Y el último?",
  description:
    "¿Cuánto gana un piloto de MotoGP? Las estimaciones hablan de unos 12 millones de euros al año para Marc Márquez y Fabio Quartararo, y 7 millones para Bagnaia. Desde 2027 habrá un salario mínimo garantizado de 500.000 €. Estimaciones de prensa etiquetadas, más el único dato seguro.",
  keywords: [
    "cuánto gana un piloto de MotoGP",
    "sueldos pilotos MotoGP",
    "cuánto gana Marc Márquez",
    "cuánto gana Bagnaia",
    "piloto mejor pagado MotoGP",
    "salario mínimo MotoGP",
    "sueldo Quartararo",
    "contratos MotoGP",
  ],
  alternates: {
    canonical: `${SITE}/sueldos-motogp/`,
    languages: { "es-ES": `${SITE}/sueldos-motogp/`, "it-IT": `${SITE}/stipendi-motogp/` },
  },
  openGraph: {
    title: "¿Cuánto gana un piloto de MotoGP?",
    description: "Las estimaciones de sueldos (hasta ~12 mln €) y el salario mínimo garantizado desde 2027.",
    url: `${SITE}/sueldos-motogp/`,
    type: "article",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Cuánto gana un piloto de MotoGP" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánto gana un piloto de MotoGP?", description: "Estimaciones de sueldos y salario mínimo desde 2027.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Quién es el piloto mejor pagado de MotoGP?", a: "Según las estimaciones de la prensa especializada, Marc Márquez (Ducati) y Fabio Quartararo (Yamaha), ambos en torno a los 12 millones de euros al año. Son estimaciones: los equipos no publican los sueldos." },
    { q: "¿Cuánto gana Bagnaia en Ducati?", a: "Las estimaciones hablan de unos 7 millones de euros por temporada para Francesco Bagnaia. No es una cifra oficial, pero coincide entre varias fuentes especializadas." },
    { q: "¿Cuál es el sueldo mínimo en MotoGP?", a: "Desde 2027 entra en vigor un salario mínimo garantizado de 500.000 € al año para todos los pilotos a tiempo completo, novatos incluidos. Lo decide el campeonato, así que es un dato seguro." },
    { q: "¿Por qué no hay cifras oficiales de los sueldos de los pilotos?", a: "Porque los contratos entre piloto y equipo son privados y nadie está obligado a publicarlos, al contrario que el dinero público, que por ley debe ser transparente." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "MotoGP", item: `${SITE}/sueldos-motogp/` }] };


export default function SueldosMotogpPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MotogpClient locale="es" />
    </>
  );
}
