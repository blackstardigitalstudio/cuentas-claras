import type { Metadata } from "next";
import FondosClient from "../fondos-europeos/FondosClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sui fondi europei / PNRR.
export const metadata: Metadata = {
  title: "PNRR: 194,4 miliardi all'Italia, dove sono finiti?",
  description:
    "Quanti soldi riceve l'Italia con il PNRR? 194,4 miliardi di euro: 71,8 a fondo perduto e 122,6 in prestiti. A oggi ne è arrivato circa l'85%. Vanno spesi entro fine 2026. Cifre ufficiali di Italia Domani e del MEF.",
  keywords: [
    "PNRR quanti soldi",
    "PNRR miliardi Italia",
    "fondi Next Generation EU",
    "PNRR a che punto siamo",
    "fondi europei Italia",
    "PNRR fondo perduto",
    "Recovery Fund Italia",
    "dove sono finiti i soldi del PNRR",
  ],
  alternates: {
    canonical: `${SITE}/fondi-europei-pnrr/`,
    languages: { "it-IT": `${SITE}/fondi-europei-pnrr/`, "es-ES": `${SITE}/fondos-europeos/` },
  },
  openGraph: {
    title: "PNRR: 194,4 miliardi all'Italia, dove sono finiti?",
    description: "I soldi che l'Europa manda a Italia e Spagna dopo la pandemia. Cifre ufficiali.",
    url: `${SITE}/fondi-europei-pnrr/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PNRR e fondi europei per Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "PNRR: 194,4 miliardi all'Italia", description: "Quanti soldi arrivano dall'Europa e a che punto siamo. Cifre ufficiali.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanti soldi riceve l'Italia con il PNRR?", a: "194,4 miliardi di euro: 71,8 a fondo perduto (regalati) e 122,6 in prestiti a basso costo. A oggi l'Italia ha ricevuto circa l'85% delle risorse. Fonte: Italia Domani / MEF." },
    { q: "Questi soldi vanno restituiti?", a: "Una parte no (le sovvenzioni «a fondo perduto»); l'altra sì (i prestiti, ma a condizioni vantaggiose)." },
    { q: "Entro quando vanno spesi i soldi del PNRR?", a: "Il fondo europeo si chiude a fine 2026: bisogna completare i progetti e presentare le ultime richieste di pagamento entro l'autunno 2026." },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Fondi europei e PNRR", item: `${SITE}/fondi-europei-pnrr/` }] };

export default function FondiEuropeiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FondosClient locale="it" />
    </>
  );
}
