import type { Metadata } from "next";
import MotogpClient from "./MotogpClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Nuovo verticale: i soldi dei motori. Nasce dalle domande reali di Google
// ("Chi è il più pagato in MotoGP?", "Quanto guadagna Bagnaia in Ducati?").
// Gli ingaggi NON sono ufficiali → mostrati come stime etichettate, come per i
// calciatori. L'unico dato certo è il salario minimo dal 2027.
export const metadata: Metadata = {
  title: "Quanto guadagna un pilota MotoGP? Fino a 12 milioni",
  description:
    "Quanto guadagnano i piloti della MotoGP? Le stime parlano di circa 12 milioni di euro l'anno per Marc Márquez e Fabio Quartararo e 7 milioni per Bagnaia. Dal 2027 arriva un salario minimo garantito di 500.000 €. Stime di stampa etichettate, più l'unico dato certo.",
  keywords: [
    "quanto guadagna un pilota MotoGP",
    "stipendi piloti MotoGP",
    "quanto guadagna Bagnaia",
    "quanto guadagna Marquez",
    "pilota più pagato MotoGP",
    "ingaggi MotoGP",
    "salario minimo MotoGP",
    "stipendio Bezzecchi",
  ],
  alternates: { canonical: `${SITE}/stipendi-motogp/` },
  openGraph: {
    title: "Quanto guadagna un pilota MotoGP?",
    description: "Le stime degli ingaggi (fino a ~12 mln €) e il salario minimo garantito dal 2027.",
    url: `${SITE}/stipendi-motogp/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Quanto guadagna un pilota MotoGP" }],
  },
  twitter: { card: "summary_large_image", title: "Quanto guadagna un pilota MotoGP?", description: "Stime degli ingaggi e salario minimo dal 2027.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Chi è il pilota più pagato in MotoGP?", a: "Secondo le stime della stampa specializzata, Marc Márquez (Ducati) e Fabio Quartararo (Yamaha), entrambi intorno ai 12 milioni di euro l'anno. Sono stime: i team non pubblicano gli ingaggi." },
    { q: "Quanto guadagna Bagnaia in Ducati?", a: "Le stime parlano di circa 7 milioni di euro a stagione per Francesco Bagnaia. Non è una cifra ufficiale, ma è coerente tra più fonti specializzate." },
    { q: "Qual è lo stipendio minimo in MotoGP?", a: "Dal 2027 entra in vigore un salario minimo garantito di 500.000 € l'anno per tutti i piloti a tempo pieno, rookie compresi. È una misura del campionato, quindi un dato certo." },
    { q: "Perché non ci sono cifre ufficiali sugli stipendi dei piloti?", a: "Perché i contratti tra pilota e team sono privati e nessuno è obbligato a pubblicarli, al contrario dei soldi pubblici che per legge devono essere trasparenti." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "MotoGP", item: `${SITE}/stipendi-motogp/` }] };

export default function StipendiMotogpPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MotogpClient />
    </>
  );
}
