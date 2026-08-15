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
    // Numero + domanda aperta: il numero dà credibilità, la domanda ("e al
    // netto?") Google non la può chiudere nello snippet.
    title: `Sindaco di ${n} abitanti: ${eur(mese)} al mese. E netti?`,
    description:
      `Quanto guadagna il sindaco di un comune con ${n} abitanti? ${eur(mese)} lordi al mese, cioè ${eur(anno)} l'anno: è l'indennità fissata per legge per i comuni ${f.label}.` +
      (serveRuoloIT(ab)
        ? ` Attenzione: se il comune è capoluogo la cifra sale (fino a ${eur(Math.round(BASE_IT * 0.8))} al mese per un capoluogo di regione).`
        : "") +
      ` Qui trovi anche la stima al netto con il calcolo in chiaro, e i comuni veri di questa dimensione con lo stipendio del loro sindaco.`,
    keywords: [
      `stipendio sindaco ${n} abitanti`,
      `quanto guadagna un sindaco con ${n} abitanti`,
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
      { q: `Quanto guadagna un sindaco con ${n} abitanti?`, a: `${eur(lordoMese)} lordi al mese, cioè ${eur(lordoAnno)} lordi all'anno. È il ${f.pct}% del trattamento dei Presidenti di Regione (13.800 € al mese), la percentuale che la legge assegna ai comuni ${f.label}.` },
      { q: `Quanto guadagna al netto un sindaco di un comune con ${n} abitanti?`, a: `Circa ${eur(Math.round(nettoStimato / 12))} al mese, togliendo l'IRPEF secondo gli scaglioni 2026 (23% fino a 28.000 €, 33% fino a 50.000 €, 43% oltre). È una stima: il netto reale cambia con le addizionali regionali e comunali e con le detrazioni personali.` },
      ...(ruoli.length
        ? [{
            q: `E se il comune di ${n} abitanti è capoluogo?`,
            a: `La percentuale sale: ${ruoli.map((r) => `${r.label} ${eur(r.lordoMese)} al mese (${r.pct}%)`).join("; ")}. La cifra di ${eur(lordoMese)} vale per un comune di questa dimensione che non è capoluogo.`,
          }]
        : []),
      { q: "Il sindaco prende sempre tutta l'indennità?", a: "No. Se resta al suo lavoro da dipendente senza chiedere l'aspettativa, l'indennità è dimezzata." },
      { q: "Chi decide quanto guadagna un sindaco?", a: "La legge, non il comune: è una percentuale fissa del trattamento dei Presidenti di Regione, stabilita in base agli abitanti dalla L. 234/2021 e dal DM Interno del 30/05/2022." },
      { q: "Un sindaco prende la tredicesima?", a: "No: l'indennità di funzione si percepisce per 12 mensilità, senza tredicesima né TFR." },
    ].map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Quanto guadagna il sindaco di un comune con ${n} abitanti`,
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
