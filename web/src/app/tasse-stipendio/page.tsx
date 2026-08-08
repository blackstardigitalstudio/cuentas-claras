import type { Metadata } from "next";
import StipendioClient from "./StipendioClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA. Il rovescio della medaglia dei soldi pubblici: da dove
// arrivano. Nasce dalle domande PAA ("quante tasse ti tolgono dallo stipendio").
export const metadata: Metadata = {
  title: "Stipendio: il 47% se ne va in tasse. Dove finisce?",
  description:
    "Quante tasse si pagano davvero sullo stipendio? In Italia il 47,1% di quello che costi alla tua azienda finisce allo Stato tra IRPEF e contributi: siamo il quarto Paese OCSE, contro una media del 34,9%. E la fetta più grossa in busta paga non la vedi nemmeno.",
  keywords: [
    "quante tasse si pagano sullo stipendio",
    "quante tasse ti tolgono dallo stipendio",
    "cuneo fiscale Italia",
    "scaglioni IRPEF",
    "trattenute busta paga",
    "percentuale tasse stipendio",
    "costo del lavoro Italia",
    "contributi busta paga",
  ],
  alternates: {
    canonical: `${SITE}/tasse-stipendio/`,
    languages: { "it-IT": `${SITE}/tasse-stipendio/`, "es-ES": `${SITE}/impuestos-sueldo/` },
  },
  openGraph: {
    title: "Stipendio: il 47% se ne va in tasse. Dove finisce?",
    description: "Il conto completo di IRPEF e contributi, con i dati OCSE. E la parte che in busta paga non vedi.",
    url: `${SITE}/tasse-stipendio/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Le tasse sullo stipendio in Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "Stipendio: il 47% se ne va in tasse", description: "Il conto completo di IRPEF e contributi, con i dati OCSE.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quante tasse ti tolgono dallo stipendio?", a: "Sommando IRPEF e contributi (i tuoi e quelli dell'azienda), in Italia lo Stato incassa il 47,1% del costo totale del lavoro: quarto Paese OCSE, contro una media del 34,9%. Fonte: OCSE, Taxing Wages 2024." },
    { q: "Come funzionano gli scaglioni IRPEF?", a: "A scaglioni: 23% fino a 28.000 €, 35% da 28.001 a 50.000 €, 43% oltre. Se guadagni 30.000 € non paghi il 35% su tutto: paghi il 23% sui primi 28.000 e il 35% solo sui 2.000 rimanenti." },
    { q: "Perché in busta paga non vedo tutte le tasse?", a: "Perché una parte grossa la paga l'azienda prima ancora di arrivare al tuo lordo, e in busta paga non compare." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Tasse sullo stipendio", item: `${SITE}/tasse-stipendio/` }] };

export default function TasseStipendioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <StipendioClient locale="it" />
    </>
  );
}
