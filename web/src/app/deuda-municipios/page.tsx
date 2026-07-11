import type { Metadata } from "next";
import { formatEuro } from "@/lib/format";
import ranks from "@/data/rankings-es.json";
import DeudaClient from "./DeudaClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";
const pct = Math.round((ranks.debtFree / ranks.debtCount) * 100);

export const metadata: Metadata = {
  title: `¿Qué municipios tienen más deuda en España? Ranking ${ranks.year} (deuda viva oficial)`,
  description: `Ranking de los municipios más endeudados de España en ${ranks.year}, con la deuda viva oficial del Ministerio de Hacienda. ${ranks.topDebt[0].name} lidera con ${formatEuro(ranks.topDebt[0].amount)}. Además, ${ranks.debtFree.toLocaleString("es")} de ${ranks.debtCount.toLocaleString("es")} municipios (${pct}%) no tienen ninguna deuda.`,
  keywords: [
    "municipios más endeudados España",
    "deuda ayuntamiento",
    "ciudades más endeudadas España",
    "deuda viva entidades locales",
    "deuda municipal",
    "qué ayuntamiento debe más",
  ],
  alternates: { canonical: `${SITE}/deuda-municipios/` },
  openGraph: {
    title: `Los municipios más endeudados de España (${ranks.year})`,
    description: `${ranks.topDebt[0].name} lidera con ${formatEuro(ranks.topDebt[0].amount)}. ${pct}% de los municipios no tienen deuda.`,
    url: `${SITE}/deuda-municipios/`,
    type: "website",
    images: [{ url: "/og-deuda.png", width: 1200, height: 630, alt: "¿Cuánta deuda tiene tu ciudad? — datos oficiales" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánta deuda tiene tu ciudad?", description: "Los municipios más endeudados, con datos oficiales.", images: ["/og-deuda.png"] },
};

const top = ranks.topDebt;
const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuál es la ciudad más endeudada de España?", a: `${top[0].name}, con una deuda viva de ${formatEuro(top[0].amount)} a 31/12/${ranks.year}.` },
    { q: "¿Cuántos municipios no tienen deuda?", a: `${ranks.debtFree.toLocaleString("es")} de ${ranks.debtCount.toLocaleString("es")} municipios (${pct}%) no registran ninguna deuda viva.` },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: `Municipios más endeudados de España (${ranks.year})`, itemListElement: top.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `${d.name}: ${formatEuro(d.amount)}` })) };
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Deuda de los municipios", item: `${SITE}/deuda-municipios/` }] };

export default function DeudaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DeudaClient />
    </>
  );
}
