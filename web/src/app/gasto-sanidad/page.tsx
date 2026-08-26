import type { Metadata } from "next";
import SanitaClient from "../spesa-sanita/SanitaClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versión ESPAÑOLA. El mayor gasto público del país, con el detalle por comunidad.
export const metadata: Metadata = {
  title: "Sanidad: 101.739 M€ al año. ¿Adónde van?",
  description:
    "¿Cuánto gasta España en sanidad? 101.739 millones de euros de gasto público en 2024, el 6,4% del PIB: 2.084 € por habitante. País Vasco es la comunidad que más gasta (2.332 €) y Andalucía la que menos (1.658 €). Cifras oficiales del Ministerio de Sanidad.",
  keywords: [
    "cuánto gasta España en sanidad",
    "gasto sanitario público",
    "gasto sanitario por comunidad",
    "gasto sanitario per cápita",
    "presupuesto sanidad España",
    "gasto sanitario PIB",
    "cuánto cuesta la sanidad",
    "sanidad pública gasto",
  ],
  alternates: {
    canonical: `${SITE}/gasto-sanidad/`,
    languages: { "es-ES": `${SITE}/gasto-sanidad/`, "it-IT": `${SITE}/spesa-sanita/` },
  },
  openGraph: {
    title: "Sanidad: 101.739 M€ al año. ¿Adónde van?",
    description: "El 6,4% del PIB, 2.084 € por habitante, y el detalle por comunidad. Cifras oficiales.",
    url: `${SITE}/gasto-sanidad/`,
    type: "article",
    locale: "es_ES",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "El gasto sanitario en España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "Sanidad: 101.739 M€ al año", description: "Adónde va el dinero de la sanidad, con cifras oficiales.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto gasta España en sanidad al año?", a: "101.739 millones de euros de gasto público en 2024, el 6,4% del PIB: unos 2.084 € por habitante. Fuente: Ministerio de Sanidad (Estadística de Gasto Sanitario Público)." },
    { q: "¿Qué comunidad gasta más en sanidad?", a: "País Vasco (2.332 € por habitante), seguido de Asturias (2.322 €) y Extremadura (2.246 €). Las que menos: Andalucía (1.658 €), Madrid (1.779 €) y la Comunitat Valenciana (1.867 €). Datos de 2024." },
    { q: "¿La sanidad es gratis?", a: "No: ya está pagada. La pagas todo el año con tus impuestos. Además, una parte la pagas directamente de tu bolsillo (dentista, gafas, seguros, medicinas): en España es alrededor del 26% del gasto sanitario total." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Gasto sanitario", item: `${SITE}/gasto-sanidad/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Gasto sanitario público",
  lang: "es",
  url: `https://www.cuentas-clara.com/gasto-sanidad/`,
  source: FONTI.sanidad,
  about: "Gasto sanitario público",
});

export default function GastoSanidadPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SanitaClient locale="es" />
    </>
  );
}
