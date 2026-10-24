import type { Metadata } from "next";
import DifesaClient from "../spese-militari/DifesaClient";
import { FAQ_ES } from "../spese-militari/dati";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versión ESPAÑOLA. Búsquedas reales (sugerencias de Google, octubre 2026):
// "gasto militar españa 2026", "gasto en defensa españa por años", "pib",
// "cuánto gasta realmente españa en defensa", "españa vs marruecos".
export const metadata: Metadata = {
  title: "Gasto militar en España: 33.123 M€, ¿en qué se va?",
  description:
    "¿Cuánto gasta España en defensa? 33.123 millones de euros en 2025, el 2,00% del PIB: unos 675 € por habitante. En 2014 eran 9.508 millones. Año a año, en qué se gasta, el plan de 10.471 M€ y qué supone el 5% de la OTAN. Datos OTAN, SIPRI y La Moncloa.",
  keywords: [
    "cuánto cobra un militar en españa",
    "gasto militar españa",
    "gasto en defensa españa",
    "cuánto gasta españa en defensa",
    "gasto en defensa españa por años",
    "gasto militar españa pib",
    "presupuesto defensa españa 2026",
    "gasto militar españa vs marruecos",
    "5% pib defensa españa",
    "rearme españa",
  ],
  alternates: {
    canonical: `${SITE}/gasto-militar/`,
    languages: { "es-ES": `${SITE}/gasto-militar/`, "it-IT": `${SITE}/spese-militari/` },
  },
  openGraph: {
    title: "Gasto militar en España: 33.123 M€, ¿en qué se va?",
    description: "El 2,00% del PIB, el triple que en 2014. Y solo uno de cada cinco euros del nuevo plan va a armas. Datos oficiales.",
    url: `${SITE}/gasto-militar/`,
    type: "article",
    locale: "es_ES",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "El gasto militar de España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "Gasto militar en España: 33.123 M€", description: "Adónde va el dinero de la defensa, con datos oficiales.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ_ES.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Gasto militar", item: `${SITE}/gasto-militar/` }] };
const artLd = articleLd({
  headline: metadata.title as string,
  lang: "es",
  url: `${SITE}/gasto-militar/`,
  source: [FONTI.nato, FONTI.moncloaDefensa, FONTI.sipri, FONTI.sepg2025, FONTI.rd248],
  about: "Gasto militar y en defensa",
});

export default function GastoMilitarPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DifesaClient />
    </>
  );
}
