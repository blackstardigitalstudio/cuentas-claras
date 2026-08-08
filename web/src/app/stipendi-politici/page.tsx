import type { Metadata } from "next";
import PoliticosClient from "../sueldos-politicos/PoliticosClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sugli stipendi dei politici. Stesso contenuto,
// ma con URL e metadati in italiano: è l'unico modo perché Google la mostri a
// chi cerca in italiano (il testo tradotto lato client Google non lo vede).
export const metadata: Metadata = {
  title: "Quanto guadagna un parlamentare? 10.435 € più diaria",
  description:
    "Quanto guadagna un politico in Italia e in Spagna? L'indennità di un parlamentare italiano è di 10.435 € lordi al mese (circa 125.220 € l'anno), più 3.503 € di diaria. Il Presidente della Repubblica 239.182 €. Cifre ufficiali di Camera e Senato.",
  keywords: [
    "quanto guadagna un parlamentare",
    "stipendio parlamentari",
    "indennità parlamentare",
    "quanto guadagna un deputato",
    "stipendio senatore",
    "quanto guadagna il presidente della repubblica",
    "stipendi politici italiani",
    "quanto guadagna un politico",
  ],
  alternates: {
    canonical: `${SITE}/stipendi-politici/`,
    languages: { "it-IT": `${SITE}/stipendi-politici/`, "es-ES": `${SITE}/sueldos-politicos/` },
  },
  openGraph: {
    title: "Quanto guadagna un parlamentare? 10.435 € al mese",
    description: "Gli stipendi dei politici italiani e spagnoli, con cifre ufficiali.",
    url: `${SITE}/stipendi-politici/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stipendi dei politici in Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "Quanto guadagna un parlamentare?", description: "Stipendi ufficiali dei politici italiani e spagnoli.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto guadagna un parlamentare italiano?", a: "L'indennità è di 10.435 € lordi al mese (circa 125.220 € l'anno). In più: diaria di 3.503 € al mese e altri rimborsi per le spese, che non sono stipendio. Fonte: Camera e Senato." },
    { q: "Quanto guadagna il Presidente della Repubblica?", a: "L'assegno è di 239.182 € lordi l'anno. Il presidente Mattarella lo ha ridotto volontariamente a 179.836 €." },
    { q: "Quanto guadagna il presidente del Governo spagnolo?", a: "95.944 € lordi l'anno (2025), secondo il Portale della Trasparenza spagnolo: meno di un parlamentare italiano." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Stipendi dei politici", item: `${SITE}/stipendi-politici/` }] };

export default function StipendiPoliticiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PoliticosClient locale="it" />
    </>
  );
}
