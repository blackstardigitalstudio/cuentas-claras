import type { Metadata } from "next";
import StipendioClient from "../tasse-stipendio/StipendioClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versión ESPAÑOLA. De dónde sale el dinero público: del trabajo.
export const metadata: Metadata = {
  title: "Sueldo: el 40,6% se va en impuestos. ¿Adónde va?",
  description:
    "¿Cuánto se queda el Estado de tu sueldo? El 40,6% de lo que le cuestas a tu empresa, entre IRPF y cotizaciones, frente al 34,9% de media en la OCDE. Y la parte más grande —el 23,4%— la paga la empresa: en tu nómina no aparece. Datos oficiales de la OCDE.",
  keywords: [
    "cuánto se queda el Estado de mi sueldo",
    "cuña fiscal España",
    "impuestos sobre el salario",
    "cotizaciones sociales empresa trabajador",
    "cuánto me quitan de la nómina",
    "IRPF nómina",
    "coste laboral España",
    "presión fiscal sobre el trabajo",
  ],
  alternates: {
    canonical: `${SITE}/impuestos-sueldo/`,
    languages: { "es-ES": `${SITE}/impuestos-sueldo/`, "it-IT": `${SITE}/tasse-stipendio/` },
  },
  openGraph: {
    title: "Sueldo: el 40,6% se va en impuestos. ¿Adónde va?",
    description: "La cuenta completa de IRPF y cotizaciones, con datos de la OCDE. Y la parte que no ves en tu nómina.",
    url: `${SITE}/impuestos-sueldo/`,
    type: "article",
    locale: "es_ES",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Los impuestos sobre el sueldo en España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "Sueldo: el 40,6% se va en impuestos", description: "La cuenta completa de IRPF y cotizaciones, con datos OCDE.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto se queda el Estado de mi sueldo?", a: "El 40,6% de lo que le cuestas a tu empresa, sumando IRPF y cotizaciones (las tuyas y las suyas). La media de la OCDE es el 34,9%. Fuente: OCDE, Taxing Wages 2024." },
    { q: "¿Por qué en mi nómina no lo veo todo?", a: "Porque la parte más grande la paga la empresa antes de llegar a tu bruto: el 23,4% del coste laboral. Tú ves el IRPF (12,3%) y tus cotizaciones (5%), pero no esa parte." },
    { q: "¿España está por encima de la media?", a: "Sí: 40,6% frente al 34,9% de la OCDE. Aun así, por debajo de Italia (47,1%), Francia (47,2%), Alemania (47,9%) y Bélgica (52,6%)." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Impuestos sobre el sueldo", item: `${SITE}/impuestos-sueldo/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Impuestos sobre el salario",
  lang: "es",
  url: `https://www.cuentas-clara.com/impuestos-sueldo/`,
  source: FONTI.ocse,
  about: "Impuestos sobre el salario",
});

export default function ImpuestosSueldoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <StipendioClient locale="es" />
    </>
  );
}
