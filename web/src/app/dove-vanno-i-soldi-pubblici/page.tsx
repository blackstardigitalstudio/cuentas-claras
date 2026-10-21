import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import { COUNTRIES } from "@/lib/data";
import { formatCompact } from "@/lib/format";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

const realGastos = COUNTRIES.it.realNames.reduce((s, n) => s + (COUNTRIES.it.regions[n]?.gastos || 0), 0);
const cityCount = COUNTRIES.it.realNames.length;

export const metadata: Metadata = {
  title: "Dove finiscono i soldi del tuo Comune?",
  description:
    "Dove va il denaro pubblico del tuo Comune? Le grandi aree di spesa (servizi di base, sociale, istruzione e cultura, debito…) spiegate in parole semplici, con i dati ufficiali dei bilanci dei comuni.",
  keywords: [
    "dove vanno i soldi pubblici",
    "dove va il denaro pubblico",
    "spesa pubblica Italia",
    "in cosa spende il comune",
    "bilancio comunale spiegato",
  ],
  alternates: {
    canonical: `${SITE}/dove-vanno-i-soldi-pubblici/`,
    languages: { "es-ES": `${SITE}/en-que-se-gasta-el-dinero-publico/`, "it-IT": `${SITE}/dove-vanno-i-soldi-pubblici/` },
  },
  openGraph: { title: "Dove vanno i soldi pubblici in Italia?", description: "Le aree di spesa del tuo Comune, spiegate facile e con dati ufficiali.", url: `${SITE}/dove-vanno-i-soldi-pubblici/`, type: "article", locale: "it_IT" },
};

const AREE = [
  { t: "Servizi pubblici di base", d: "La vita di tutti i giorni. Rifiuti, pulizia, luce, acqua e strade. Poi sicurezza, traffico, urbanistica e parchi.", c: "#22d3ee" },
  { t: "Diritti sociali e famiglia", d: "Aiuti a chi ha bisogno e alle famiglie. Servizi sociali e cura di chi non è autosufficiente. Poi lavoro e casa.", c: "#f472b6" },
  { t: "Istruzione, cultura e sport", d: "La cura delle scuole. Poi biblioteche, musei, eventi e campi sportivi.", c: "#a3e635" },
  { t: "Sviluppo economico e trasporti", d: "Negozi e turismo. Bus e trasporto pubblico. Le opere che aiutano il lavoro in città.", c: "#fbbf24" },
  { t: "Amministrazione e debito", d: "Quanto costa far andare il Comune: personale e uffici. E i mutui da ridare, con gli interessi.", c: "#818cf8" },
];

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Missioni della spesa pubblica comunale",
  lang: "it",
  url: `https://www.cuentas-clara.com/dove-vanno-i-soldi-pubblici/`,
  source: FONTI.siope,
  about: "Missioni della spesa pubblica comunale",
});

export default function GuidaSpesaPage() {
  const faqs = [
    { q: "In cosa spende i soldi un Comune?", a: "Soprattutto in servizi di base: rifiuti, pulizia, acqua, strade, sicurezza. Poi aiuti sociali, scuola, cultura e sport. Poi trasporti e turismo. Infine uffici e debito. Nella scheda di ogni comune vedi le cifre esatte." },
    { q: "Da dove arrivano i soldi che spende il Comune?", a: "Dalle tasse e tariffe che paghi: IMU, TARI, addizionale IRPEF. E dai soldi che mandano Stato e Regione (i trasferimenti). Di solito entrate e uscite vanno quasi pari." },
    { q: "Come faccio a sapere in cosa spende il MIO comune?", a: "Cerca il tuo comune su Cuentas Claras. Vedi quanto incassa e quanto spende. Vedi quanto prende il sindaco e la spesa per abitante. Sempre con la fonte ufficiale." },
    { q: "Sono dati ufficiali?", a: "Sì. Vengono dai dati di cassa SIOPE della Ragioneria Generale dello Stato (MEF). E dai bilanci ufficiali dei comuni. Niente stime. Niente numeri inventati." },
  ];
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Dove vanno i soldi pubblici", item: `${SITE}/dove-vanno-i-soldi-pubblici/` }] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <article className="pt-8">
          <HeroBanner priority as="h1" src="/photos/money.jpg" alt="Monete da euro" kicker="🇮🇹 Guida · spiegato facile" title="DOVE VANNO I" highlight="SOLDI PUBBLICI?" accent="#22d3ee" accent2="#a78bfa" />
          <p className="text-sm md:text-base text-muted mt-3">
            Il tuo Comune incassa soldi dalle tue tasse e dallo Stato. Poi li spende in servizi per la città. Qui vedi
            <span className="text-fg/90"> dove vanno questi soldi</span>, spiegato facile. Abbiamo già la spesa di{" "}
            <span className="text-fg/90">{cityCount} comuni</span> ({formatCompact(realGastos)} in totale).
          </p>

          <h2 className="text-lg md:text-xl font-semibold mt-8 mb-3">Le 5 grandi aree di spesa</h2>
          <div className="space-y-3">
            {AREE.map((a) => (
              <div key={a.t} className="glass p-4 relative overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${a.c},transparent)` }} />
                <p className="font-semibold" style={{ color: a.c }}>{a.t}</p>
                <p className="text-sm text-muted mt-1">{a.d}</p>
              </div>
            ))}
          </div>

          <div className="glass p-5 mt-8">
            <h2 className="text-base font-semibold">E da dove arrivano questi soldi?</h2>
            <p className="text-sm text-muted mt-2">
              Da due fonti. La prima sono <span className="text-green">le tue tasse e tariffe</span>: IMU, TARI, addizionale IRPEF.
              La seconda sono i <span className="text-green">soldi che gli manda</span> lo Stato e la Regione. In un comune
              in salute, quello che entra e quello che esce vanno quasi pari.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
              Vedi la spesa del mio comune →
            </Link>
            <Link href="/spesa-comuni/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
              Classifica della spesa
            </Link>
          </div>

          <section className="mt-12">
            <h2 className="text-lg font-semibold mb-3">Domande frequenti</h2>
            <div className="space-y-2.5">
              {faqs.map((f, i) => (
                <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
                  <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
                  <p className="text-sm text-muted mt-2">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
            <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
          </footer>
        </article>
      </LocaleProvider>
    </main>
  );
}
