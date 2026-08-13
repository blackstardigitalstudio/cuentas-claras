import type { Metadata } from "next";
import { formatEuro } from "@/lib/format";
import ranks from "@/data/rankings-es.json";
import SueldosClient from "./SueldosClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: `¿Cuánto cobra tu alcalde? Ranking oficial ${ranks.year}`,
  description: `Ranking de los alcaldes que más cobran en España en ${ranks.year}, con datos oficiales del ISPA. El alcalde de Madrid encabeza con ${formatEuro(ranks.topSalaries[0].amount)}/año. La media de los ${ranks.salaryReporting.toLocaleString("es")} ayuntamientos que declaran es ${formatEuro(ranks.salaryAvg)}/año.`,
  keywords: [
    "cuánto cobra un alcalde",
    "sueldo alcalde España",
    "alcaldes que más cobran",
    "sueldo alcalde Madrid",
    "retribuciones alcaldes",
    "cuánto gana un alcalde",
  ],
  alternates: { canonical: `${SITE}/sueldos-alcaldes/` },
  openGraph: {
    title: `¿Cuánto cobra un alcalde en España? Sueldos ${ranks.year}`,
    description: `Ranking oficial de los alcaldes que más cobran. Media: ${formatEuro(ranks.salaryAvg)}/año.`,
    url: `${SITE}/sueldos-alcaldes/`,
    type: "website",
    images: [{ url: "/og-sueldos.png", width: 1200, height: 630, alt: "¿Cuánto cobra tu alcalde? — datos oficiales" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánto cobra tu alcalde?", description: "Ranking oficial de los alcaldes que más cobran.", images: ["/og-sueldos.png"] },
};

const top = ranks.topSalaries;
const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuál es el alcalde que más cobra de España?", a: `El alcalde de ${top[0].name}, con ${formatEuro(top[0].amount)} brutos al año (${ranks.year}).` },
    { q: "¿Cuánto cobra un alcalde de media en España?", a: `La media de los ${ranks.salaryReporting.toLocaleString("es")} ayuntamientos que declaran al ISPA es ${formatEuro(ranks.salaryAvg)} brutos al año.` },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: `Alcaldes que más cobran en España (${ranks.year})`, itemListElement: top.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: `${s.name}: ${formatEuro(s.amount)}` })) };
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Sueldos de alcaldes", item: `${SITE}/sueldos-alcaldes/` }] };

export default function SueldosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SueldosClient />
    </>
  );
}
