import type { Metadata } from "next";
import ProfesionesClient from "../sueldos-profesiones/ProfesionesClient";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sugli stipendi dei mestieri pubblici.
export const metadata: Metadata = {
  title: "Quanto guadagna un medico? 60.000 € (e un infermiere?)",
  description:
    "Quanto guadagna un medico, un infermiere, un insegnante o un poliziotto in Italia? Un medico del SSN parte da circa 60.000 € lordi l'anno, un infermiere ~28.000 €, un insegnante ~30.000 €. Sono stipendi tipici (variano per regione e anzianità), con la fonte.",
  keywords: [
    "quanto guadagna un medico",
    "stipendio infermiere",
    "quanto guadagna un insegnante",
    "stipendio poliziotto",
    "stipendio medico ospedaliero",
    "quanto guadagna un primario",
    "stipendi statali",
    "stipendio dipendenti pubblici",
  ],
  alternates: {
    canonical: `${SITE}/stipendi-professioni/`,
    languages: { "it-IT": `${SITE}/stipendi-professioni/`, "es-ES": `${SITE}/sueldos-profesiones/` },
  },
  openGraph: {
    title: "Quanto guadagna un medico, un prof o un poliziotto?",
    description: "Stipendi tipici dei mestieri pagati con soldi pubblici, in Italia e Spagna, con la fonte.",
    url: `${SITE}/stipendi-professioni/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Stipendi delle professioni pubbliche" }],
  },
  twitter: { card: "summary_large_image", title: "Quanto guadagna un medico o un insegnante?", description: "Stipendi tipici delle professioni pubbliche, con la fonte.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto guadagna un medico in Italia?", a: "Un medico del SSN parte da circa 60.000 € lordi l'anno, sale a 80.000 € e oltre con l'anzianità, e i primari arrivano a circa 110.000 €. Varia molto secondo regione, anzianità e ruolo." },
    { q: "Quanto guadagna un infermiere?", a: "Intorno a 28.000 € lordi l'anno (CCNL Sanità: base circa 25.000 € più le voci accessorie). Cresce con l'anzianità." },
    { q: "Quanto guadagna un insegnante?", a: "Circa 30.000 € lordi l'anno per un insegnante di ruolo, con aumenti legati all'anzianità di servizio." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Stipendi delle professioni", item: `${SITE}/stipendi-professioni/` }] };

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Stipendi dei mestieri pubblici",
  lang: "it",
  url: `https://www.cuentas-clara.com/stipendi-professioni/`,
  source: FONTI.ocse,
  about: "Stipendi dei mestieri pubblici",
});

export default function StipendiProfessioniPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ProfesionesClient locale="it" />
    </>
  );
}
