import type { Metadata } from "next";
import DeudaNacionalClient from "./DeudaNacionalClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "España debe 1,7 billones. ¿Cuánto te toca a ti?",
  description:
    "¿Cuánto debe el Estado? España debe 1,7 billones de euros (100,8% del PIB, ~35.000 € por habitante); Italia 3.095 miles de millones (137,1% del PIB). El límite europeo es el 60%. Cifras oficiales del Banco de España y Banca d'Italia. Quanto deve lo Stato.",
  keywords: [
    "cuánto debe España",
    "deuda pública España",
    "deuda por habitante",
    "cuánto debe Italia",
    "debito pubblico Italia",
    "quanto deve lo Stato",
    "deuda sobre el PIB",
    "debito PIL Italia Spagna",
  ],
  alternates: {
    canonical: `${SITE}/deuda-nacional/`,
    languages: { "es-ES": `${SITE}/deuda-nacional/`, "it-IT": `${SITE}/debito-pubblico/` },
  },
  openGraph: {
    title: "¿Cuánto debe España? ¿Y Italia?",
    description: "Deuda pública: España 1,7 billones € (100,8% PIB); Italia 3.095 mil millones (137,1%). Límite UE 60%. Cifras oficiales.",
    url: `${SITE}/deuda-nacional/`,
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "La deuda pública de España e Italia" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánto debe España? ¿Y Italia?", description: "La deuda pública de España e Italia, con cifras oficiales.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto debe España?", a: "A cierre de 2025 la deuda pública española era de 1,7 billones de euros (100,8% del PIB), unos 35.000 € por habitante. Fuente: Banco de España." },
    { q: "¿Cuánto debe Italia?", a: "A cierre de 2025 la deuda pública italiana era de 3.095 miles de millones de euros (137,1% del PIB), la segunda más alta de la UE tras Grecia. Unos 53.000 € por habitante." },
    { q: "¿Es malo tener deuda?", a: "Un poco es normal; el problema es cuando es demasiada y los intereses se comen parte del presupuesto. La regla europea es no pasar del 60% del PIB." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Deuda pública nacional", item: `${SITE}/deuda-nacional/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Deuda pública de España e Italia",
  lang: "es",
  url: `https://www.cuentas-clara.com/deuda-nacional/`,
  source: [FONTI.bde, FONTI.bankitalia],
  about: "Deuda pública de España e Italia",
});

export default function DeudaNacionalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DeudaNacionalClient />
    </>
  );
}
