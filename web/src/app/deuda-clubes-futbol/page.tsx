import type { Metadata } from "next";
import { CLUB_DEBT } from "@/data/futbol";
import { formatEuro, formatCompact } from "@/lib/format";
import { articleLd } from "@/lib/jsonld";
import DeudaClubesClient from "./DeudaClubesClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Esta página nace de un hueco medido en Search Console: las búsquedas sobre la
// DEUDA de los clubes ("qué deuda tiene el Real Madrid", "deuda actual del Real
// Madrid"…) sumaban ~400 impresiones al mes en posición 9-10 con CERO clics.
// Salíamos, pero no respondíamos: la ficha del club lidera con los ingresos, no
// con la deuda, y quien busca deuda no encuentra su número en el snippet.
const RM = CLUB_DEBT.find((c) => c.club === "Real Madrid")!;
const BARSA = CLUB_DEBT.find((c) => c.club === "FC Barcelona")!;

export const metadata: Metadata = {
  // El número sorprende (12 millones, no 1.200) y la pregunta queda abierta.
  title: `Real Madrid: ${formatCompact(RM.amount)} de deuda. ¿Y el Barça?`,
  description: `¿Cuánta deuda tiene el Real Madrid? ${formatEuro(RM.amount)} de deuda financiera neta (${RM.year}), según su propio informe económico. El Barça declara ${formatEuro(BARSA.amount)} de deuda bruta: no es la misma medida, y ahí está el truco. Deuda de los grandes clubes de España e Italia con las cuentas oficiales de cada uno.`,
  keywords: [
    "cuánta deuda tiene el Real Madrid",
    "deuda actual del Real Madrid",
    "qué deuda tiene el Real Madrid",
    "deuda neta Real Madrid",
    "deuda FC Barcelona",
    "deuda clubes de fútbol",
    "quanti debiti ha il Real Madrid",
    "debito Juventus Inter Milan",
  ],
  alternates: {
    canonical: `${SITE}/deuda-clubes-futbol/`,
    languages: { "es-ES": `${SITE}/deuda-clubes-futbol/`, "it-IT": `${SITE}/debito-club-calcio/` },
  },
  openGraph: {
    title: "¿Cuánta deuda tiene de verdad tu club?",
    description: `Real Madrid ${formatEuro(RM.amount)} netos, Barça ${formatEuro(BARSA.amount)} brutos. Cifras de las cuentas oficiales.`,
    url: `${SITE}/deuda-clubes-futbol/`,
    type: "article",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Deuda de los clubes de fútbol" }],
  },
  twitter: { card: "summary_large_image", title: "¿Cuánta deuda tiene tu club?", description: "Deuda de los grandes clubes con las cuentas oficiales.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánta deuda tiene el Real Madrid?", a: `${formatEuro(RM.amount)} de deuda financiera neta a ${RM.year}, según el informe económico publicado por el propio club. No son miles de millones: el Madrid tiene mucha caja, y esa caja se resta de la deuda bruta.` },
    { q: "¿Cuánta deuda tiene el Barça?", a: `${formatEuro(BARSA.amount)} de deuda bruta (${BARSA.year}), según sus cuentas anuales. Es una medida distinta a la del Madrid: la bruta no descuenta el dinero en caja.` },
    { q: "¿Qué diferencia hay entre deuda bruta y deuda neta?", a: "La bruta es todo lo que el club debe. La neta es lo que debe menos el dinero que tiene en el banco. Un club puede tener una bruta enorme y una neta pequeña si tiene mucha caja: por eso comparar dos clubes con medidas distintas no dice nada." },
    { q: "¿Qué club italiano debe más?", a: `De los que publican el dato, la Juventus con ${formatEuro(302800000)} de deuda financiera neta (2024/25), por delante del Inter (${formatEuro(248400000)}) y la Roma (${formatEuro(153400000)}).` },
    { q: "¿Hay algún club sin deuda?", a: `El Nápoles: no tiene deuda neta sino una posición financiera neta positiva de ${formatEuro(137000000)}. Es decir, tiene más dinero en caja del que debe.` },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: "Deuda de los clubes", item: `${SITE}/deuda-clubes-futbol/` }] };

// La citación son las cuentas anuales de cada club: es la fuente real, y son
// varias, así que se declaran todas.
const artLd = articleLd({
  headline: (metadata.title as string) || "Deuda de los clubes de fútbol",
  lang: "es",
  url: `${SITE}/deuda-clubes-futbol/`,
  source: CLUB_DEBT.map((c) => c.source),
  about: "Deuda financiera de los clubes de fútbol de España e Italia",
});

export default function DeudaClubesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DeudaClubesClient />
    </>
  );
}
