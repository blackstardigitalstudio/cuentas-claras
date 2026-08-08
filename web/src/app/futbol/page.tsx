import type { Metadata } from "next";
import { formatEuro, formatCompact } from "@/lib/format";
import { LALIGA_LCPD, LALIGA_LCPD_SEASON, REVENUE_SEASON, CLUB_REVENUE } from "@/data/futbol";
import FutbolClient from "./FutbolClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "El dinero del fútbol: quién ingresa y quién debe más",
  description:
    `Cuánto puede gastar cada club de LaLiga (límite de coste de plantilla oficial ${LALIGA_LCPD_SEASON}), ingresos (Deloitte) y deuda de los grandes clubes de España e Italia. Solo datos oficiales y verificables. Real Madrid lidera con ${formatEuro(LALIGA_LCPD[0].amount)} de límite salarial.`,
  keywords: [
    "límite salarial LaLiga",
    "límite de coste de plantilla",
    "cuánto puede gastar el Barça",
    "presupuesto Real Madrid",
    "deuda del Barcelona",
    "ingresos clubes fútbol",
    "bilancio Juventus",
    "debito Inter",
  ],
  alternates: {
    canonical: `${SITE}/futbol/`,
    languages: { "es-ES": `${SITE}/futbol/`, "it-IT": `${SITE}/calcio/` },
  },
  openGraph: {
    title: "El dinero del fútbol · datos oficiales (LaLiga + Serie A)",
    description: `Límite salarial LaLiga ${LALIGA_LCPD_SEASON}, ingresos y deuda de los grandes clubes. Solo datos oficiales.`,
    url: `${SITE}/futbol/`,
    type: "website",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "El dinero del fútbol — LaLiga y Serie A, datos oficiales" }],
  },
  twitter: { card: "summary_large_image", title: "El dinero del fútbol", description: "Ingresos, salarios, límite salarial y deuda de los clubes. Datos oficiales.", images: ["/og-futbol.png"] },
};

const revenues = [...CLUB_REVENUE].sort((a, b) => b.amount - a.amount);

const faqs = [
  { q: "¿Cuál es el club de LaLiga que más puede gastar en su plantilla?", a: `El Real Madrid, con un límite de coste de plantilla de ${formatEuro(LALIGA_LCPD[0].amount)} en ${LALIGA_LCPD_SEASON}, seguido del FC Barcelona (${formatEuro(LALIGA_LCPD[1].amount)}) y el Atlético de Madrid (${formatEuro(LALIGA_LCPD[2].amount)}). Es el tope que fija LaLiga, no lo que efectivamente gastan.` },
  { q: "¿Qué es el límite de coste de plantilla de LaLiga?", a: "Es el gasto máximo que LaLiga autoriza a cada club para su plantilla deportiva (salarios, fichajes amortizados, etc.), según sus ingresos y deudas. Lo publica LaLiga de forma oficial cada temporada." },
  { q: "¿Qué club de fútbol ingresa más en España e Italia?", a: `El Real Madrid, con unos ${formatCompact(revenues[0].amount)} de ingresos en ${REVENUE_SEASON} (Deloitte Football Money League), único club del mundo por encima de los 1.000 M€. En Italia lidera el Inter (${formatCompact(CLUB_REVENUE.find((c) => c.club === "Inter")!.amount)}).` },
  { q: "¿Qué club tiene más deuda?", a: `Por deuda financiera bruta, el FC Barcelona (${formatCompact(1451000000)}, la mayor de Europa). En Italia, la Juventus lidera la deuda financiera neta (${formatCompact(302800000)}). Datos de las cuentas anuales 2024/25.` },
  { q: "¿De dónde salen estos datos?", a: "Solo de fuentes oficiales y verificables: el límite salarial lo publica LaLiga; los ingresos, la Deloitte Football Money League (sobre cuentas auditadas); la deuda, las cuentas anuales de cada club. No usamos valores de mercado ni sueldos estimados de jugadores." },
];

const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: `Límite de coste de plantilla LaLiga ${LALIGA_LCPD_SEASON}`, itemListElement: LALIGA_LCPD.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.club}: ${formatEuro(c.amount)}` })) };
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }] };

export default function FutbolPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FutbolClient />
    </>
  );
}
