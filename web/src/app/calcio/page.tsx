import type { Metadata } from "next";
import FutbolClient from "../futbol/FutbolClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina hub sui soldi del calcio.
export const metadata: Metadata = {
  title: "I soldi del calcio: chi incassa e chi deve di più",
  description:
    "Quanto incassa, paga e deve ogni club di Serie A e LaLiga? Ricavi, monte ingaggi, tetto salariale e debiti, con dati ufficiali dai bilanci depositati. Niente valori di mercato né stipendi stimati.",
  keywords: [
    "bilanci Serie A",
    "ricavi club Serie A",
    "monte ingaggi Serie A",
    "debiti Juventus",
    "quanto incassa l'Inter",
    "fatturato club calcio",
    "soldi del calcio",
    "conti dei club di calcio",
  ],
  alternates: {
    canonical: `${SITE}/calcio/`,
    languages: { "it-IT": `${SITE}/calcio/`, "es-ES": `${SITE}/futbol/` },
  },
  openGraph: {
    title: "I soldi del calcio: Serie A e LaLiga",
    description: "Ricavi, stipendi e debiti di ogni club, con dati ufficiali.",
    url: `${SITE}/calcio/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "I soldi del calcio: Serie A e LaLiga" }],
  },
  twitter: { card: "summary_large_image", title: "I soldi del calcio", description: "Ricavi, stipendi e debiti dei club di Serie A e LaLiga.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quale club di calcio incassa di più in Italia?", a: "L'Inter, con circa 552,6 milioni di euro di ricavi nella stagione 2024/25, davanti a Juventus (439,8 milioni) e Milan (438,6 milioni). Dati dai bilanci depositati." },
    { q: "Quale club ha più debito?", a: "Per debito finanziario lordo il FC Barcelona, il più alto d'Europa. In Italia la Juventus guida il debito finanziario netto. Dati dai bilanci 2024/25." },
    { q: "Da dove arrivano questi dati?", a: "Solo da fonti ufficiali e verificabili: il tetto salariale dalla LaLiga, i ricavi dalla Deloitte Football Money League, il debito dai bilanci di ogni club. Niente valori di mercato né stipendi stimati dei giocatori." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Calcio", item: `${SITE}/calcio/` }] };

export default function CalcioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FutbolClient locale="it" />
    </>
  );
}
