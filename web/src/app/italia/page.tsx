import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES } from "@/lib/data";
import { formatCompact, formatEuro } from "@/lib/format";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Dove vanno i soldi pubblici dei comuni italiani?",
  description:
    "Entrate e spese reali dei comuni italiani (Milano, Bologna) con dati ufficiali e dettaglio della spesa pubblica per missione. Mappa interattiva, classifica e scandali del denaro pubblico.",
  keywords: [
    "bilancio comunale",
    "spesa pubblica Italia",
    "dove vanno i soldi pubblici",
    "bilancio comune Milano",
    "bilancio comune Bologna",
    "trasparenza conti pubblici",
    "soldi pubblici comuni",
  ],
  alternates: { canonical: `${SITE}/italia/` },
  openGraph: {
    title: "Dove vanno i soldi pubblici dei comuni italiani?",
    description: "Entrate e spese reali dei comuni italiani con dati ufficiali e dettaglio della spesa pubblica.",
    url: `${SITE}/italia/`,
    locale: "it_IT",
    type: "website",
  },
};

const cities = COUNTRIES.it.realNames
  .map((n) => COUNTRIES.it.regions[n])
  .filter(Boolean)
  .sort((a, b) => b.gastos - a.gastos);
const totalGastos = cities.reduce((s, c) => s + c.gastos, 0);

export default function ItaliaPage() {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <LocaleProvider>
        <SiteNav />

        <header className="pt-8 md:pt-12">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">🇮🇹 Trasparenza · Dati pubblici · Italia</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mt-3">
            Dove vanno <span className="neon-text">i soldi pubblici</span> dei comuni italiani?
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted max-w-2xl">
            Entrate e spese reali dei comuni italiani, in linguaggio chiaro, con dati ufficiali e il dettaglio della spesa
            pubblica per missione. Cerca il tuo comune e segui ogni euro.
          </p>
        </header>

        <section className="glass mt-8 px-5 py-6 md:px-8 md:py-7 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted">Spesa pubblica analizzata in Italia</p>
          <p className="tabular neon-text font-bold leading-none text-4xl md:text-6xl mt-2">{formatCompact(totalGastos)}</p>
          <p className="text-sm text-muted mt-2">su {cities.length} comuni con dati reali · aggiornamento continuo</p>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 gap-4">
          {cities.map((c) => (
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

        <section className="mt-12 glass p-6 md:p-7 max-w-3xl">
          <h2 className="text-xl font-semibold">Sui dati italiani: fonti e veridicità</h2>
          <div className="text-sm text-muted mt-3 space-y-3">
            <p>
              <strong className="text-fg">Cuentas Claras</strong> mostra entrate e spese reali dei comuni italiani con dati
              ufficiali, in linguaggio chiaro, con il dettaglio della spesa pubblica per missione e programma.
            </p>
            <p>
              <strong className="text-fg">Fonti ufficiali:</strong> portali open data dei comuni (Comune di Milano, Comune di
              Bologna). Ogni città indica la fonte e l&apos;anno. Per ogni comune verifichiamo la quadratura (entrate ≈ uscite) e
              non pubblichiamo mai cifre non verificabili.
            </p>
            <p>
              <strong className="text-fg">Sempre aggiornati:</strong> il sito si rigenera automaticamente e mostra l&apos;ultima
              pubblicazione ufficiale. Stiamo aggiungendo nuovi comuni man mano che pubblicano dati leggibili e verificabili.
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
