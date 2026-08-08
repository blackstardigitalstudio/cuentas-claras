import type { Metadata } from "next";
import PensioniClient from "./PensioniClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA. La voce di spesa pubblica più grande del Paese: più del
// doppio della sanità. Nasce dalle domande PAA reali.
export const metadata: Metadata = {
  title: "Pensioni: 364 miliardi l'anno. Chi li paga?",
  description:
    "Quanto spende l'Italia per le pensioni? 364.132 milioni di euro nel 2024, la voce di spesa pubblica più grande: due volte e mezzo la sanità. Sono 17,7 milioni di pensionati, con una pensione media di vecchiaia di 1.359 € al mese. E i tuoi contributi non sono in un salvadanaio: pagano le pensioni di oggi.",
  keywords: [
    "quanto spende l'Italia per le pensioni",
    "spesa pensionistica Italia",
    "quanto costa il sistema pensionistico",
    "quanti sono i pensionati in Italia",
    "pensione media italiana",
    "spesa pensioni PIL",
    "chi paga le pensioni",
    "quanto incassa l'INPS",
  ],
  alternates: {
    canonical: `${SITE}/spesa-pensioni/`,
    languages: { "it-IT": `${SITE}/spesa-pensioni/`, "es-ES": `${SITE}/gasto-pensiones/` },
  },
  openGraph: {
    title: "Pensioni: 364 miliardi l'anno. Chi li paga?",
    description: "La spesa pubblica più grande d'Italia: 2,5 volte la sanità. Con i dati ufficiali Istat e Inps.",
    url: `${SITE}/spesa-pensioni/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "La spesa per le pensioni in Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "Pensioni: 364 miliardi l'anno", description: "La spesa pubblica più grande d'Italia, spiegata con dati ufficiali.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanto spende l'Italia ogni anno per le pensioni?", a: "364.132 milioni di euro nel 2024, in crescita del 4,9% sull'anno prima. È la voce di spesa pubblica più grande che c'è: più del doppio della sanità. Fonte: Istat." },
    { q: "Quanti sono i pensionati in Italia?", a: "Circa 17,7 milioni di persone. La pensione media di vecchiaia è di 1.359,53 € lordi al mese. Fonte: Inps." },
    { q: "Chi paga le pensioni?", a: "Chi lavora oggi. I contributi trattenuti dalla busta paga non finiscono in un salvadanaio personale: pagano le pensioni di chi è già in pensione adesso." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Spesa per le pensioni", item: `${SITE}/spesa-pensioni/` }] };

export default function SpesaPensioniPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PensioniClient locale="it" />
    </>
  );
}
