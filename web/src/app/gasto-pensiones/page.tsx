import type { Metadata } from "next";
import PensioniClient from "../spesa-pensioni/PensioniClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versión ESPAÑOLA. La mayor partida de gasto público.
export const metadata: Metadata = {
  title: "Pensiones: 189.598 M€ al año. ¿Quién los paga?",
  description:
    "¿Cuánto gasta España en pensiones? 189.598 millones de euros en 2025 (más de 200.000 con las clases pasivas): la mayor factura pública, casi el doble que la sanidad. Son 9,4 millones de pensionistas y una pensión media de jubilación de 1.512,7 € al mes. Datos oficiales.",
  keywords: [
    "cuánto gasta España en pensiones",
    "gasto en pensiones",
    "cuántos pensionistas hay en España",
    "pensión media España",
    "nómina de pensiones Seguridad Social",
    "quién paga las pensiones",
    "gasto pensiones PIB",
    "pensión media de jubilación",
  ],
  alternates: {
    canonical: `${SITE}/gasto-pensiones/`,
    languages: { "es-ES": `${SITE}/gasto-pensiones/`, "it-IT": `${SITE}/spesa-pensioni/` },
  },
  openGraph: {
    title: "Pensiones: 189.598 M€ al año. ¿Quién los paga?",
    description: "La mayor factura pública de España, casi el doble que la sanidad. Con datos oficiales de la Seguridad Social.",
    url: `${SITE}/gasto-pensiones/`,
    type: "article",
    locale: "es_ES",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "El gasto en pensiones en España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "Pensiones: 189.598 M€ al año", description: "La mayor factura pública de España, con datos oficiales.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto gasta España en pensiones al año?", a: "189.598 millones de euros en 2025, sumando la nómina mensual y las dos pagas extra. Contando las clases pasivas se superan los 200.000 millones. Fuente: Seguridad Social." },
    { q: "¿Cuántos pensionistas hay en España?", a: "9,4 millones de personas, que cobran 10,4 millones de pensiones. La pensión media de jubilación es de 1.512,7 € al mes. Fuente: Seguridad Social." },
    { q: "¿Quién paga las pensiones?", a: "Los que trabajan hoy. Las cotizaciones descontadas de la nómina no van a una hucha personal: pagan las pensiones de los que ya están jubilados." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Gasto en pensiones", item: `${SITE}/gasto-pensiones/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Gasto público en pensiones",
  lang: "es",
  url: `https://www.cuentas-clara.com/gasto-pensiones/`,
  source: FONTI.segSocial,
  about: "Gasto público en pensiones",
});

export default function GastoPensionesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PensioniClient locale="es" />
    </>
  );
}
