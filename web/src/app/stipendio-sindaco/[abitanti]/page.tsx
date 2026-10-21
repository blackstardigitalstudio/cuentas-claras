import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COUNTRIES } from "@/lib/data";
import {
  TAGLIE_IT,
  fasciaPerAbitanti,
  lordoMensileIT,
  lordoAnnuoIT,
  irpefLorda,
  FONTE_IT,
  RUOLI_IT,
  serveRuoloIT,
  euro,
  nEu,
  BASE_IT,
} from "@/data/fasce-sindaci";
import FasciaClient, { type Comune } from "./FasciaClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

// Una pagina per ogni dimensione di comune che la gente digita davvero su
// Google ("stipendio sindaco 10.000 abitanti", "5000 abitanti"…). La domanda è
// sempre agganciata alla dimensione del PROPRIO comune, non generica.
export function generateStaticParams() {
  return TAGLIE_IT.map((t) => ({ abitanti: `${t}-abitanti` }));
}

function parse(slug: string): number | null {
  const m = slug.match(/^(\d+)-abitanti$/);
  if (!m) return null;
  const n = Number(m[1]);
  return TAGLIE_IT.includes(n) ? n : null;
}

const eur = euro;

// Comuni reali di quella taglia, con lo stipendio vero del sindaco: è il pezzo
// che nessun altro sito ha, e il motivo per cui una pagina così merita il clic.
function comuniDellaTaglia(ab: number): { comuni: Comune[]; esatti: boolean } {
  const f = fasciaPerAbitanti(ab);
  const tutti = Object.values(COUNTRIES.it.regions).filter((r) => !r.isSample && r.poblacion && r.mayorSalary);
  const map = (rs: typeof tutti): Comune[] =>
    rs.slice(0, 8).map((r) => ({ name: r.name, slug: r.slug, poblacion: r.poblacion!, annuo: r.mayorSalary!.amount }));

  const dentro = tutti
    .filter((r) => r.poblacion! >= f.min && (f.max === null || r.poblacion! <= f.max))
    .sort((a, b) => Math.abs(a.poblacion! - ab) - Math.abs(b.poblacion! - ab));
  if (dentro.length) return { comuni: map(dentro), esatti: true };

  // L'archivio italiano parte da ~40.000 abitanti: sotto quella soglia non
  // esiste un esempio reale. Meglio dirlo e mostrare i piu' piccoli che
  // copriamo, che lasciare un buco muto.
  const piuPiccoli = [...tutti].sort((a, b) => a.poblacion! - b.poblacion!);
  return { comuni: map(piuPiccoli), esatti: false };
}

type Props = { params: Promise<{ abitanti: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { abitanti } = await params;
  const ab = parse(abitanti);
  if (!ab) return {};
  const f = fasciaPerAbitanti(ab);
  const mese = lordoMensileIT(f);
  const anno = lordoAnnuoIT(f);
  const n = nEu(ab);
  return {
    // Numero + domanda aperta. Il title parte con le parole che la gente
    // digita ("stipendio sindaco 15.000 abitanti"); il netto resta la domanda
    // che Google non chiude nello snippet. Sopra i 50.000 c'e' il caso
    // capoluogo, quindi "da": la cifra e' il minimo, non l'unica.
    title: `Stipendio sindaco ${n} abitanti: ${serveRuoloIT(ab) ? "da " : ""}${eur(mese)}, e netto?`,
    description:
      `Stipendio del sindaco di un comune di ${n} abitanti: ${eur(mese)} lordi al mese, ${eur(anno)} l'anno, fissati per legge.` +
      (serveRuoloIT(ab)
        ? ` Se il comune è capoluogo sale (fino a ${eur(Math.round(BASE_IT * 0.8))} al mese per un capoluogo di regione).`
        : "") +
      ` Quanto gli resta in tasca? Il netto con il calcolo in chiaro e i comuni veri di questa dimensione.`,
    keywords: [
      `stipendio sindaco ${n} abitanti`,
      `quanto guadagna un sindaco con ${n} abitanti`,
      `stipendio sindaco comune di ${n} abitanti`,
      `stipendio netto sindaco ${n} abitanti`,
      `indennità sindaco ${n} abitanti`,
      "quanto guadagna un sindaco netto",
      "stipendio sindaco piccolo comune",
      "indennità di funzione sindaco",
      "tabella stipendi sindaci",
    ],
    alternates: { canonical: `${SITE}/stipendio-sindaco/${ab}-abitanti/` },
    openGraph: {
      title: `Sindaco di ${n} abitanti: quanto guadagna davvero?`,
      description: `${eur(mese)} lordi al mese per legge. Più la stima al netto e i comuni veri di questa dimensione.`,
      url: `${SITE}/stipendio-sindaco/${ab}-abitanti/`,
      type: "article",
      locale: "it_IT",
      images: [{ url: "/og-sueldos.png", width: 1200, height: 630, alt: `Stipendio del sindaco di un comune di ${n} abitanti` }],
    },
    twitter: { card: "summary_large_image", title: `Sindaco di ${n} abitanti: quanto guadagna?`, description: `${eur(mese)} lordi al mese, per legge.`, images: ["/og-sueldos.png"] },
  };
}

export default async function StipendioSindacoPage({ params }: Props) {
  const { abitanti } = await params;
  const ab = parse(abitanti);
  if (!ab) notFound();

  const f = fasciaPerAbitanti(ab);
  const lordoMese = lordoMensileIT(f);
  const lordoAnno = lordoAnnuoIT(f);
  const irpef = irpefLorda(lordoAnno);
  const nettoStimato = lordoAnno - irpef;
  const { comuni, esatti } = comuniDellaTaglia(ab);
  const ruoli = serveRuoloIT(ab) ? RUOLI_IT.map((r) => ({ ...r, lordoMese: Math.round((BASE_IT * r.pct) / 100) })) : [];
  const n = nEu(ab);

  // FAQ identiche a quelle mostrate: e' cosi' che i motori con l'AI le citano.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { q: `Quanto guadagna il sindaco di un comune di ${n} abitanti?`, a: `${eur(lordoMese)} lordi al mese, cioè ${eur(lordoAnno)} lordi all'anno. È il ${f.pct}% del trattamento dei Presidenti di Regione (13.800 € al mese), la percentuale che la legge assegna ai comuni ${f.label}.` },
      { q: `E al netto quanto prende il sindaco di un comune di ${n} abitanti?`, a: `Circa ${eur(Math.round(nettoStimato / 12))} al mese (${eur(nettoStimato)} l'anno), togliendo l'IRPEF secondo gli scaglioni 2026: 23% fino a 28.000 €, 33% fino a 50.000 €, 43% oltre. È una stima: il netto vero cambia con le addizionali del proprio comune e con le detrazioni personali.` },
      ...(ruoli.length
        ? [{
            q: `E se il comune di ${n} abitanti è capoluogo?`,
            a: `La cifra sale: ${ruoli.map((r) => `${r.label} ${eur(r.lordoMese)} al mese (${r.pct}%)`).join("; ")}. I ${eur(lordoMese)} valgono per un comune di questa dimensione che non è capoluogo.`,
          }]
        : []),
      { q: "Il sindaco prende sempre tutta l'indennità?", a: "No. Se resta al suo lavoro da dipendente senza chiedere l'aspettativa, l'indennità è dimezzata. Molti sindaci di piccoli comuni prendono quindi la metà della cifra di legge." },
      { q: "Chi decide quanto guadagna un sindaco?", a: "La legge, non il comune. L'importo è una percentuale fissa del trattamento dei Presidenti di Regione, stabilita in base agli abitanti dalla L. 234/2021 e dal DM Interno del 30/05/2022, a regime dal 2024." },
      { q: "Un sindaco prende la tredicesima?", a: "No. L'indennità di funzione si prende per 12 mensilità: non è uno stipendio da dipendente e non ha tredicesima né TFR." },
    ].map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Quanto guadagna il sindaco di un comune di ${n} abitanti`,
    inLanguage: "it",
    isPartOf: { "@type": "WebSite", name: "Cuentas Claras", url: SITE },
    citation: { "@type": "CreativeWork", name: FONTE_IT.name, url: FONTE_IT.url },
    about: { "@type": "Thing", name: "Indennità di funzione dei sindaci italiani" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Stipendi dei sindaci", item: `${SITE}/stipendi-sindaci/` },
      { "@type": "ListItem", position: 3, name: `Comune di ${n} abitanti`, item: `${SITE}/stipendio-sindaco/${ab}-abitanti/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FasciaClient
        abitanti={ab}
        fasciaLabel={f.label}
        pct={f.pct}
        lordoMese={lordoMese}
        lordoAnno={lordoAnno}
        irpef={irpef}
        nettoStimato={nettoStimato}
        comuni={comuni}
        ruoli={ruoli}
        comuniEsatti={esatti}
      />
    </>
  );
}
