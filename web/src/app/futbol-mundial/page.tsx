import type { Metadata } from "next";
import { formatCompact } from "@/lib/format";
import { LEAGUES, CLUB_REVENUE } from "@/data/futbol";
import MundialClient from "./MundialClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

const leagues = [...LEAGUES].sort((a, b) => b.revenue - a.revenue);
const clubs = [...CLUB_REVENUE].sort((a, b) => b.amount - a.amount);

export const metadata: Metadata = {
  title: "La Premier ingresa 9,6 mil M€. ¿Y las demás ligas?",
  description: `¿Qué liga es la más rica del mundo? La ${leagues[0].league}, con ${formatCompact(leagues[0].revenue)}. ¿Y el club que más ingresa? El ${clubs[0].club} (${formatCompact(clubs[0].amount)}), único por encima de 1.000 M€. Ingresos de las grandes ligas y clubes, con datos oficiales.`,
  keywords: [
    "liga más rica del mundo",
    "club que más ingresa del mundo",
    "cuánto factura la Premier League",
    "ingresos ligas de fútbol",
    "campionato di calcio più ricco",
    "fatturato Premier League",
    "quale campionato incassa di più",
    "club più ricco del mondo",
  ],
  alternates: {
    canonical: `${SITE}/futbol-mundial/`,
    languages: { "es-ES": `${SITE}/futbol-mundial/`, "it-IT": `${SITE}/calcio-mondiale/` },
  },
  openGraph: {
    title: "El dinero del fútbol mundial · ligas y clubes que más ingresan",
    description: `La ${leagues[0].league} es la liga más rica; el ${clubs[0].club}, el club que más ingresa. Datos oficiales.`,
    url: `${SITE}/futbol-mundial/`,
    type: "article",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "El dinero del fútbol mundial" }],
  },
  twitter: { card: "summary_large_image", title: "El dinero del fútbol mundial", description: "Qué liga y qué club ingresan más, con datos oficiales.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Qué liga de fútbol es la más rica del mundo?", a: `La ${leagues[0].league}, con unos ${formatCompact(leagues[0].revenue)} de ingresos totales, por delante de ${leagues[1].league} (${formatCompact(leagues[1].revenue)}).` },
    { q: "¿Qué club de fútbol ingresa más del mundo?", a: `El ${clubs[0].club}, con ${formatCompact(clubs[0].amount)} (temporada 2024/25, Deloitte), único club del mundo por encima de los 1.000 M€.` },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: "Fútbol mundial", item: `${SITE}/futbol-mundial/` }] };

export default function FutbolMundialPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MundialClient />
    </>
  );
}
