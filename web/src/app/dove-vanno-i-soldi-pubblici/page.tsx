import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES } from "@/lib/data";
import { formatCompact } from "@/lib/format";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

const realGastos = COUNTRIES.it.realNames.reduce((s, n) => s + (COUNTRIES.it.regions[n]?.gastos || 0), 0);
const cityCount = COUNTRIES.it.realNames.length;

export const metadata: Metadata = {
  title: "Dove vanno i soldi pubblici in Italia? Spiegato facile, con i dati",
  description:
    "Dove va il denaro pubblico del tuo Comune? Le grandi aree di spesa (servizi di base, sociale, istruzione e cultura, debito…) spiegate in parole semplici, con dati ufficiali di centinaia di comuni italiani.",
  keywords: [
    "dove vanno i soldi pubblici",
    "dove va il denaro pubblico",
    "spesa pubblica Italia",
    "in cosa spende il comune",
    "bilancio comunale spiegato",
  ],
  alternates: { canonical: `${SITE}/dove-vanno-i-soldi-pubblici/` },
  openGraph: { title: "Dove vanno i soldi pubblici in Italia?", description: "Le aree di spesa del tuo Comune, spiegate facile e con dati ufficiali.", url: `${SITE}/dove-vanno-i-soldi-pubblici/`, type: "article" },
};

const AREE = [
  { t: "Servizi pubblici di base", d: "La vita di tutti i giorni: raccolta rifiuti, pulizia, illuminazione, acqua, strade, sicurezza e mobilità, urbanistica, parchi.", c: "#22d3ee" },
  { t: "Diritti sociali e famiglia", d: "Aiuti a persone e famiglie, servizi sociali, non autosufficienza, politiche per il lavoro, casa.", c: "#f472b6" },
  { t: "Istruzione, cultura e sport", d: "Scuole (manutenzione), biblioteche, musei, eventi, impianti sportivi.", c: "#a3e635" },
  { t: "Sviluppo economico e trasporti", d: "Commercio e turismo, trasporto pubblico, infrastrutture che aiutano l'economia locale.", c: "#fbbf24" },
  { t: "Amministrazione e debito", d: "Il costo di far funzionare il Comune (personale, uffici) e restituire i mutui con gli interessi.", c: "#818cf8" },
];

export default function GuidaSpesaPage() {
  const faqs = [
    { q: "In cosa spende i soldi un Comune?", a: "Soprattutto in servizi pubblici di base (rifiuti, pulizia, acqua, strade, sicurezza), diritti sociali (aiuti, non autosufficienza), istruzione-cultura-sport, sviluppo economico (trasporti, turismo) e amministrazione e debito. Nella scheda di ogni comune vedi la ripartizione esatta." },
    { q: "Da dove arrivano i soldi che spende il Comune?", a: "Dalle imposte e tariffe che paghi (IMU, TARI, addizionale IRPEF…) e dai trasferimenti dello Stato e della Regione. Le entrate e le uscite di solito vanno quasi pari." },
    { q: "Come faccio a sapere in cosa spende il MIO comune?", a: "Cerca il tuo comune su Cuentas Claras: vedi quanto incassa, quanto spende, quanto guadagna il sindaco e quanto spende per abitante, con la fonte ufficiale." },
    { q: "Sono dati ufficiali?", a: "Sì. Vengono dai dati di cassa SIOPE della Ragioneria Generale dello Stato (MEF) e dai bilanci ufficiali dei comuni. Niente stime, niente numeri inventati." },
  ];
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Dove vanno i soldi pubblici", item: `${SITE}/dove-vanno-i-soldi-pubblici/` }] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <article className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">🇮🇹 Guida · spiegato facile</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            Dove vanno i <span className="neon-text">soldi pubblici</span>?
          </h1>
          <p className="text-sm md:text-base text-muted mt-3">
            Il tuo Comune riceve dei soldi (dalle tue tasse e dallo Stato) e li spende in servizi per la città. Qui ti
            spieghiamo, in parole semplici, <span className="text-fg/90">dove vanno questi soldi</span> — e poi puoi
            vederlo con i dati reali del tuo comune. Abbiamo già la spesa di{" "}
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
              Da due fonti, soprattutto: <span className="text-green">le tue tasse e tariffe</span> (IMU, TARI,
              addizionale IRPEF…) e i <span className="text-green">trasferimenti dello Stato</span> e della Regione. Per
              questo, in un comune in salute, quello che entra e quello che esce vanno quasi pari.
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
