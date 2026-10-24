import type { Metadata } from "next";
import DifesaClient from "./DifesaClient";
import { FAQ_IT } from "./dati";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA. Le ricerche vere (suggerimenti di Google, ottobre 2026):
// "spese militari italia 2026", "spesa militare italia pil", "ultimi 10 anni",
// "quanto spende l'italia per la difesa all'anno", "5% pil difesa italia".
export const metadata: Metadata = {
  title: "Spese militari Italia: 45 miliardi. Dove vanno?",
  description:
    "Quanto spende l'Italia per la difesa? 45,3 miliardi di euro nel 2025, il 2,01% del PIL: circa 770 € a testa. Nel 2014 erano 18,4 miliardi. Anno per anno, per cosa si spende e cosa vuol dire il 5% della NATO. Dati ufficiali NATO e SIPRI.",
  keywords: [
    "spese militari italia",
    "spesa militare italia pil",
    "quanto spende l'italia per la difesa",
    "spese militari italia ultimi 10 anni",
    "spese difesa italia 2026",
    "quanto spende l'italia in armi",
    "5% pil difesa italia",
    "riarmo italia",
    "spesa nato italia",
  ],
  alternates: {
    canonical: `${SITE}/spese-militari/`,
    languages: { "it-IT": `${SITE}/spese-militari/`, "es-ES": `${SITE}/gasto-militar/` },
  },
  openGraph: {
    title: "Spese militari Italia: 45 miliardi. Dove vanno?",
    description: "Il 2,01% del PIL, circa 770 € a testa, 12,6 miliardi in più in un anno. Dati ufficiali NATO.",
    url: `${SITE}/spese-militari/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Le spese militari di Italia e Spagna" }],
  },
  twitter: { card: "summary_large_image", title: "Spese militari Italia: 45 miliardi", description: "Dove finiscono i soldi della difesa, con dati ufficiali.", images: ["/og.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ_IT.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }, { "@type": "ListItem", position: 3, name: "Spese militari", item: `${SITE}/spese-militari/` }] };
const artLd = articleLd({
  headline: metadata.title as string,
  lang: "it",
  url: `${SITE}/spese-militari/`,
  source: [FONTI.nato, FONTI.sipri, FONTI.moncloaDefensa],
  about: "Spesa militare e per la difesa",
});

export default function SpeseMilitariPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DifesaClient locale="it" />
    </>
  );
}
