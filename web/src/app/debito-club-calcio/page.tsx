import type { Metadata } from "next";
import { CLUB_DEBT } from "@/data/futbol";
import { formatEuro, formatCompact } from "@/lib/format";
import { articleLd } from "@/lib/jsonld";
import DeudaClubesClient from "../deuda-clubes-futbol/DeudaClubesClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Versione ITALIANA della pagina sul debito dei club.
const RM = CLUB_DEBT.find((c) => c.club === "Real Madrid")!;
const JUVE = CLUB_DEBT.find((c) => c.club === "Juventus")!;

export const metadata: Metadata = {
  title: `La Juve ha ${formatCompact(JUVE.amount)} di debiti. E l'Inter?`,
  description: `Quanti debiti ha davvero il tuo club? La Juventus dichiara ${formatEuro(JUVE.amount)} di indebitamento finanziario netto (${JUVE.year}), l'Inter ${formatEuro(248400000)}, il Milan ${formatEuro(108100000)}. Il Napoli non ha debiti: ha cassa. E il Real Madrid, a sorpresa, solo ${formatEuro(RM.amount)}. Cifre prese dai bilanci pubblicati dai club.`,
  keywords: [
    "quanti debiti ha la Juventus",
    "debito Inter bilancio",
    "debito Milan bilancio",
    "debiti club Serie A",
    "quanti debiti ha il Real Madrid",
    "indebitamento finanziario netto Juventus",
    "bilanci club calcio",
    "debito lordo e netto differenza",
  ],
  alternates: {
    canonical: `${SITE}/debito-club-calcio/`,
    languages: { "it-IT": `${SITE}/debito-club-calcio/`, "es-ES": `${SITE}/deuda-clubes-futbol/` },
  },
  openGraph: {
    title: "Quanti debiti ha davvero il tuo club?",
    description: `Juventus ${formatEuro(JUVE.amount)}, Inter ${formatEuro(248400000)}, Napoli in cassa positiva. Cifre dai bilanci ufficiali.`,
    url: `${SITE}/debito-club-calcio/`,
    type: "article",
    locale: "it_IT",
    images: [{ url: "/og-futbol.png", width: 1200, height: 630, alt: "Debito dei club di calcio" }],
  },
  twitter: { card: "summary_large_image", title: "Quanti debiti ha il tuo club?", description: "Il debito dei grandi club, dai bilanci ufficiali.", images: ["/og-futbol.png"] },
};

const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { q: "Quanti debiti ha la Juventus?", a: `${formatEuro(JUVE.amount)} di indebitamento finanziario netto nel bilancio ${JUVE.year}, pubblicato dalla società stessa.` },
    { q: "Quanti debiti ha l'Inter?", a: `${formatEuro(248400000)} di debito finanziario netto (bilancio 2024/25).` },
    { q: "Quanti debiti ha il Real Madrid?", a: `${formatEuro(RM.amount)} di debito finanziario netto al ${RM.year}. Non sono miliardi: il club ha molta liquidità, che si sottrae dal debito lordo.` },
    { q: "Qual è la differenza fra debito lordo e debito netto?", a: "Il lordo è tutto quello che il club deve. Il netto è quello che deve meno i soldi che ha in banca. Un club può avere un lordo enorme e un netto piccolo se ha molta cassa: per questo confrontare due club con misure diverse non dice niente." },
    { q: "C'è un club senza debiti?", a: `Il Napoli: non ha debito netto ma una posizione finanziaria netta positiva di ${formatEuro(137000000)}. In pratica ha più soldi in cassa di quanti ne debba.` },
  ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Calcio", item: `${SITE}/calcio/` }, { "@type": "ListItem", position: 3, name: "Debito dei club", item: `${SITE}/debito-club-calcio/` }] };

const artLd = articleLd({
  headline: (metadata.title as string) || "Debito dei club di calcio",
  lang: "it",
  url: `${SITE}/debito-club-calcio/`,
  source: CLUB_DEBT.map((c) => c.source),
  about: "Debito finanziario dei club di calcio di Italia e Spagna",
});

export default function DebitoClubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DeudaClubesClient locale="it" />
    </>
  );
}
