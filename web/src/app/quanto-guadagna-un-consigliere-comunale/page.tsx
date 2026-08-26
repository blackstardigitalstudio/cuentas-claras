import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import { articleLd, FONTI } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Quanto guadagna un consigliere comunale? Caso per caso",
  description:
    "Quanto guadagna un consigliere comunale in Italia? Non ha uno stipendio fisso: prende un «gettone di presenza» per ogni seduta. Ti spieghiamo facile come funziona e dove vedere lo stipendio del sindaco.",
  keywords: ["quanto guadagna un consigliere comunale", "gettone di presenza consiglieri", "stipendio consigliere comunale", "indennità consiglieri"],
  alternates: { canonical: `${SITE}/quanto-guadagna-un-consigliere-comunale/` },
  openGraph: { title: "Quanto guadagna un consigliere comunale?", description: "Il gettone di presenza spiegato facile.", url: `${SITE}/quanto-guadagna-un-consigliere-comunale/`, type: "article" },
};

// Dati strutturati con la CITAZIONE della fonte: è così che i motori con
// l'AI sanno da dove vengono i nostri numeri, e ci citano invece di riassumerci.
const artLd = articleLd({
  headline: (metadata.title as string) || "Gettone di presenza dei consiglieri comunali",
  lang: "it",
  url: `https://www.cuentas-clara.com/quanto-guadagna-un-consigliere-comunale/`,
  source: FONTI.tuel,
  about: "Gettone di presenza dei consiglieri comunali",
});

export default function ConsigliereePage() {
  const faqs = [
    { q: "Quanto guadagna un consigliere comunale?", a: "Il consigliere comunale NON ha uno stipendio fisso. Prende un «gettone di presenza»: una piccola somma per ogni seduta del consiglio o delle commissioni a cui partecipa. L'importo lo fissa la legge/il regolamento del comune e varia con la dimensione del comune: di solito da poche decine a poco più di cento euro a seduta, con un tetto mensile." },
    { q: "Perché non ha uno stipendio?", a: "Perché il consigliere comunale è una carica non professionale: si presume continui il suo lavoro normale. Viene «rimborsato» solo per il tempo in cui partecipa alle sedute, con il gettone di presenza." },
    { q: "E il sindaco e gli assessori?", a: "Loro sì hanno un'indennità di funzione (una specie di stipendio), fissata per legge in base alla popolazione del comune. Su Cuentas Claras puoi vedere lo stipendio del sindaco di ogni comune, con la fonte ufficiale." },
    { q: "Chi decide l'importo del gettone?", a: "È stabilito da norme nazionali (con importi base per fascia di popolazione) e dal regolamento del singolo comune, entro i limiti di legge." },
  ];
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Quanto guadagna un consigliere comunale", item: `${SITE}/quanto-guadagna-un-consigliere-comunale/` }] };

  const punti = [
    { t: "Gettone di presenza", d: "Il consigliere prende una somma per ogni seduta a cui partecipa (consiglio comunale, commissioni). Nessuna seduta, nessun gettone.", c: "#22d3ee" },
    { t: "Niente stipendio fisso", d: "A differenza di sindaco e assessori, il consigliere non ha un'indennità mensile: solo i gettoni delle sedute.", c: "#f472b6" },
    { t: "Importo per fascia", d: "Quanto vale un gettone dipende dalla dimensione del comune e dal regolamento: da poche decine a poco più di cento euro a seduta, con un tetto mensile.", c: "#a5b4fc" },
  ];

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <article className="pt-8">
          <HeroBanner priority as="h1" src="/photos/money.jpg" alt="Monete da euro" kicker="🇮🇹 Spiegato facile" title="QUANTO GUADAGNA UN" highlight="CONSIGLIERE COMUNALE?" accent="#a5b4fc" accent2="#22d3ee" />
          <p className="text-sm md:text-base text-muted mt-3">
            Sorpresa: il consigliere comunale <span className="text-fg/90">non ha uno stipendio</span>. Prende solo un
            «gettone» per ogni seduta a cui va. Ecco come funziona:
          </p>

          <div className="space-y-3 mt-6">
            {punti.map((c) => (
              <div key={c.t} className="glass p-4 relative overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${c.c},transparent)` }} />
                <p className="font-semibold" style={{ color: c.c }}>{c.t}</p>
                <p className="text-sm text-muted mt-1">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="glass p-5 mt-8">
            <p className="text-sm text-muted">
              Chi prende invece un compenso ogni mese sono il <span className="text-fg/90">sindaco</span> e gli
              <span className="text-fg/90"> assessori</span> (l'indennità, fissata per legge in base agli abitanti).
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/spesa-comuni/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
              Vedi la spesa dei comuni →
            </Link>
            <Link href="/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
              Cerca il tuo comune
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
