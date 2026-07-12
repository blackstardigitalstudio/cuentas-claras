import type { Metadata } from "next";
import JugadoresClient from "./JugadoresClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "El dinero de los jugadores: fichajes, cláusulas y cuánto ganan",
  description:
    "Los fichajes más caros de la historia (Neymar, 222 mln €), las cláusulas de rescisión más altas (hasta 1.000 mln €) y cuánto se estima que ganan Mbappé, Vinícius o Lamine Yamal. Datos verificables y estimaciones de prensa, siempre con su fuente. I soldi dei giocatori.",
  keywords: [
    "fichaje más caro de la historia",
    "cuánto gana Mbappé",
    "cuánto gana Lamine Yamal",
    "cláusula de rescisión más alta",
    "traspaso récord fútbol",
    "quanto guadagna Mbappé",
    "trasferimento più caro storia",
    "salario jugadores fútbol",
  ],
  alternates: { canonical: `${SITE}/jugadores/` },
  openGraph: {
    title: "El dinero de los jugadores: fichajes, cláusulas y sueldos",
    description: "El fichaje más caro (Neymar, 222 mln €), las cláusulas de 1.000 mln € y cuánto se estima que ganan las estrellas. Con fuentes.",
    url: `${SITE}/jugadores/`,
    type: "article",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "El dinero de los jugadores de fútbol" }],
  },
  twitter: { card: "summary_large_image", title: "El dinero de los jugadores", description: "Fichajes récord, cláusulas y sueldos estimados de las estrellas del fútbol, con fuentes.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuál es el fichaje más caro de la historia?", a: "Neymar, del Barcelona al PSG en 2017, por 222 millones de euros. En segundo lugar, Mbappé (180 mln, del Mónaco al PSG en 2018)." },
    { q: "¿Cuánto gana Mbappé, Vinícius o Lamine Yamal?", a: "No hay cifra oficial: ningún club publica los sueldos. Las estimaciones de prensa hablan de ~31 mln €/año para Mbappé, ~32 mln para Vinícius y ~16,7 mln para Lamine Yamal. Son estimaciones, no datos oficiales." },
    { q: "¿Qué es una cláusula de rescisión?", a: "El importe del contrato que un club tendría que pagar para llevarse al jugador contra la voluntad de su club. En LaLiga las grandes estrellas tienen la cláusula máxima: 1.000 millones de euros." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Fútbol", item: `${SITE}/futbol/` }, { "@type": "ListItem", position: 3, name: "Jugadores", item: `${SITE}/jugadores/` }] };

export default function JugadoresPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <JugadoresClient />
    </>
  );
}
