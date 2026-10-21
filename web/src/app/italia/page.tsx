import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES } from "@/lib/data";
import { formatCompact, formatEuro } from "@/lib/format";
import { articleLd, FONTI } from "@/lib/jsonld";
import itExtraCities from "@/data/real/it-extra-cities.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

const cities = COUNTRIES.it.realNames
  .map((n) => COUNTRIES.it.regions[n])
  .filter(Boolean)
  .sort((a, b) => b.gastos - a.gastos);
const totalGastos = cities.reduce((s, c) => s + c.gastos, 0);

// Regione di ogni comune: i comuni SIOPE la portano nel JSON; Milano e Bologna
// arrivano dai portali open data del comune e non ce l'hanno.
const REGIONE: Record<string, string> = {
  milano: "Lombardia",
  bologna: "Emilia-Romagna",
  ...Object.fromEntries((itExtraCities as { slug: string; region?: string }[]).map((c) => [c.slug, c.region ?? ""])),
};
const perRegione = Object.entries(
  cities.reduce<Record<string, typeof cities>>((acc, c) => {
    const r = REGIONE[c.slug] || "Altre";
    (acc[r] ||= []).push(c);
    return acc;
  }, {}),
)
  .map(([r, list]) => [r, [...list].sort((a, b) => a.name.localeCompare(b.name, "it"))] as const)
  .sort(([a], [b]) => a.localeCompare(b, "it"));
const TOP = cities.slice(0, 12);
const nRegioni = perRegione.length;

export const metadata: Metadata = {
  title: "Dove vanno i soldi pubblici dei comuni italiani?",
  description: `Entrate e spese di ${cities.length} comuni italiani, da Roma a Milano e Napoli, con i dati ufficiali SIOPE della Ragioneria dello Stato. Cerca il tuo comune e vedi dove va ogni euro.`,
  keywords: [
    "bilancio comunale",
    "spesa pubblica Italia",
    "dove vanno i soldi pubblici",
    "bilancio comune Milano",
    "bilancio comune Bologna",
    "bilancio comune Roma",
    "spesa comune Napoli",
    "SIOPE comuni",
    "trasparenza conti pubblici",
    "soldi pubblici comuni",
  ],
  alternates: { canonical: `${SITE}/italia/` },
  openGraph: {
    title: "Dove vanno i soldi pubblici dei comuni italiani?",
    description: `Entrate e spese di ${cities.length} comuni italiani con i dati ufficiali SIOPE.`,
    url: `${SITE}/italia/`,
    locale: "it_IT",
    type: "website",
  },
};

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Spesa pubblica dei comuni italiani",
  lang: "it",
  url: `https://www.cuentas-clara.com/italia/`,
  source: FONTI.siope,
  about: "Spesa pubblica dei comuni italiani",
});

export default function ItaliaPage() {
  // FAQ dalle domande vere, con i numeri presi dai comuni mostrati in pagina.
  const primo = cities[0];
  const faq = [
    { q: "Quanti comuni italiani ci sono su Cuentas Claras?", a: `${cities.length} comuni con i conti ufficiali, per una spesa totale di ${formatCompact(totalGastos, "it")}.` },
    primo && { q: "Quale comune italiano spende di più?", a: `${primo.name}, con ${formatEuro(primo.gastos)} di spesa nel ${primo.year}. Fonte: ${primo.source?.name ?? "dati ufficiali del comune"}.` },
    { q: "Da dove vengono i dati dei comuni?", a: "Da SIOPE, il sistema della Ragioneria Generale dello Stato (Ministero dell'Economia) che registra entrate e uscite di ogni comune. Ogni scheda indica la fonte e l'anno." },
    { q: "Come trovo il mio comune?", a: `Apri la tua regione nell'elenco qui sotto: ci sono ${cities.length} comuni in ${nRegioni} regioni. Se il tuo non c'è, non abbiamo ancora dati ufficiali che tornano: preferiamo il buco a un numero inventato.` },
  ].filter((f): f is { q: string; a: string } => Boolean(f));
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` },
    ],
  };
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Dove vanno i soldi pubblici dei comuni italiani?",
    url: `${SITE}/italia/`,
    inLanguage: "it",
    isPartOf: { "@type": "WebSite", name: "Cuentas Claras", url: SITE },
    description:
      "Entrate e spese reali dei comuni italiani con dati ufficiali e dettaglio della spesa pubblica per missione.",
  };

  return (
    <main lang="it" className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <LocaleProvider>
        <SiteNav />

        <header className="pt-8 md:pt-12">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">🇮🇹 Trasparenza · Dati pubblici · Italia</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mt-3">
            Dove vanno <span className="neon-text">i soldi pubblici</span> dei comuni italiani?
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted max-w-2xl">
            Quanto incassa e quanto spende il tuo comune. Dati ufficiali, detti in parole semplici. Vedi la spesa pubblica
            divisa per missione, cioè per area. Cerca il tuo comune e segui ogni euro.
          </p>
        </header>

        <section className="glass mt-8 px-5 py-6 md:px-8 md:py-7 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted">Spesa pubblica analizzata in Italia</p>
          <p className="tabular neon-text font-bold leading-none text-4xl md:text-6xl mt-2">{formatCompact(totalGastos, "it")}</p>
          <p className="text-sm text-muted mt-2">su {cities.length} comuni con dati reali, in {nRegioni} regioni</p>
        </section>

        <h2 className="mt-10 text-xl md:text-2xl font-semibold">I {TOP.length} comuni che spendono di più</h2>
        <section className="mt-4 grid sm:grid-cols-2 gap-4">
          {TOP.map((c) => (
            <Link
              key={c.slug}
              href={`/it/${c.slug}/`}
              className="glass p-5 hover:border-[rgba(34,211,238,0.45)] hover:-translate-y-0.5 transition group"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold group-hover:text-fg">{c.name}</h2>
                <span className="text-[11px] text-green border border-[rgba(52,211,153,0.4)] rounded-full px-2 py-0.5">
                  ● Dati reali {c.year}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <p className="text-xs text-muted">Entrate</p>
                  <p className="tabular text-lg font-semibold text-green">{formatEuro(c.ingresos)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Spese</p>
                  <p className="tabular text-lg font-semibold text-magenta">{formatEuro(c.gastos)}</p>
                </div>
              </div>
              <p className="text-[12px] text-cyan/80 mt-4 group-hover:text-cyan">Vedi il dettaglio completo →</p>
            </Link>
          ))}
        </section>

        <section className="mt-12" aria-labelledby="tutti-comuni">
          <h2 id="tutti-comuni" className="text-xl md:text-2xl font-semibold">Cerca il tuo comune, regione per regione</h2>
          <p className="text-sm text-muted mt-2">Tocca la tua regione: dentro trovi ogni comune con la sua spesa totale.</p>
          <div className="mt-4 space-y-2">
            {perRegione.map(([regione, list]) => (
              <details key={regione} className="glass group/r overflow-hidden">
                <summary className="flex items-center justify-between gap-3 cursor-pointer select-none list-none px-4 min-h-[52px] [&::-webkit-details-marker]:hidden">
                  <span className="font-medium">{regione}</span>
                  <span className="flex items-center gap-2 text-sm text-muted">
                    {list.length} {list.length === 1 ? "comune" : "comuni"}
                    <span aria-hidden className="text-cyan transition-transform group-open/r:rotate-90">›</span>
                  </span>
                </summary>
                <ul className="border-t border-[var(--panel-border)]">
                  {list.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/it/${c.slug}/`}
                        className="flex items-center justify-between gap-3 px-4 min-h-[48px] text-sm hover:bg-white/5 active:bg-white/10 transition-colors"
                      >
                        <span className="text-fg/90">{c.name}</span>
                        <span className="tabular text-muted">{formatCompact(c.gastos, "it")} di spesa</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-wrap gap-3">
          <a href="/#explorar" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">
            Esplora la mappa →
          </a>
          <Link href="/ranking" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] text-muted hover:text-fg transition">
            Classifica della spesa →
          </Link>
          <Link href="/scandali-soldi-pubblici/" className="px-5 py-2.5 rounded-full font-medium text-[#ff7a7a] border border-[rgba(255,107,107,0.45)] bg-[rgba(255,107,107,0.1)] hover:bg-[rgba(255,107,107,0.18)] transition">
            Scandali del denaro pubblico →
          </Link>
        </section>

        <section className="mt-12 max-w-3xl" aria-labelledby="domande">
          <h2 id="domande" className="text-xl md:text-2xl font-semibold">Domande frequenti</h2>
          <div className="mt-4 space-y-3">
            {faq.map((f) => (
              <div key={f.q} className="glass p-5">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="text-sm text-muted mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 glass p-6 md:p-7 max-w-3xl">
          <h2 className="text-xl font-semibold">Sui dati italiani: fonti e veridicità</h2>
          <div className="text-sm text-muted mt-3 space-y-3">
            <p>
              <strong className="text-fg">Cuentas Claras</strong> mostra entrate e spese vere dei comuni italiani. Usa solo
              dati ufficiali, detti in parole semplici. La spesa pubblica è divisa per missione e programma, cioè per area e voce.
            </p>
            <p>
              <strong className="text-fg">Fonti ufficiali:</strong> per quasi tutti i comuni,{" "}
              <a href={FONTI.siope.url} className="text-cyan underline underline-offset-2" rel="noopener" target="_blank">
                SIOPE
              </a>
              , il sistema della Ragioneria Generale dello Stato (Ministero dell&apos;Economia) che registra ogni incasso e ogni
              pagamento dei comuni. Milano e Bologna arrivano dai loro portali di dati aperti. Ogni scheda indica la fonte e
              l&apos;anno. Una cifra che non si può controllare non la pubblichiamo mai.
            </p>
            <p>
              <strong className="text-fg">Sempre aggiornati:</strong> il sito si aggiorna da solo. Mostra sempre gli ultimi
              dati ufficiali usciti. Aggiungiamo nuovi comuni appena pubblicano dati chiari e controllabili.
            </p>
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p>
            <span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹
          </p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
