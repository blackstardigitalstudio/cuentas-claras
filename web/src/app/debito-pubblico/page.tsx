import type { Metadata } from "next";
import DeudaNacionalClient from "../deuda-nacional/DeudaNacionalClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sul debito pubblico nazionale.
export const metadata: Metadata = {
  title: "Quanto deve lo Stato? 3.095 miliardi, quanto a testa?",
  description:
    "Quanto è il debito pubblico italiano? A fine 2025 era di 3.095 miliardi di euro, il 137,1% del PIL: il secondo più alto dell'Unione Europea. Sono circa 53.000 € per ogni abitante. Il limite europeo è il 60%. Cifre ufficiali di Istat, Banca d'Italia ed Eurostat.",
  keywords: [
    "debito pubblico italiano",
    "quanto deve lo Stato",
    "debito pubblico Italia 2026",
    "debito pubblico per abitante",
    "rapporto debito PIL Italia",
    "debito pubblico miliardi",
    "quanto debito ha l'Italia",
    "debito pubblico Spagna",
  ],
  alternates: {
    canonical: `${SITE}/debito-pubblico/`,
    languages: { "it-IT": `${SITE}/debito-pubblico/`, "es-ES": `${SITE}/deuda-nacional/` },
  },
  openGraph: {
    title: "Quanto deve lo Stato? Il debito pubblico spiegato",
    description: "Italia 3.095 miliardi € (137,1% del PIL, ~53.000 € a testa). Il limite europeo è il 60%. Cifre ufficiali.",
    url: `${SITE}/debito-pubblico/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Il debito pubblico di Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "Quanto deve lo Stato italiano?", description: "3.095 miliardi €, il 137,1% del PIL. Cifre ufficiali.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto deve lo Stato italiano?", a: "A fine 2025 il debito pubblico italiano era di 3.095 miliardi di euro, pari al 137,1% del PIL: il secondo più alto dell'Unione Europea dopo la Grecia. Sono circa 53.000 € per ogni abitante. Fonte: Istat, Banca d'Italia, Eurostat." },
    { q: "È un male avere debito?", a: "Un po' di debito è normale. Il problema è quando è troppo: gli interessi da pagare ogni anno si mangiano una fetta del bilancio, soldi che non vanno a scuole, sanità o strade. La regola europea è non superare il 60% del PIL." },
    { q: "Chi presta questi soldi allo Stato?", a: "Investitori che comprano i titoli di Stato (i BTP): banche, fondi, risparmiatori e altri Paesi. Lo Stato promette di restituire con gli interessi." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Debito pubblico", item: `${SITE}/debito-pubblico/` }] };

export default function DebitoPubblicoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DeudaNacionalClient locale="it" />
    </>
  );
}
