"use client";

import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Indennità di funzione dei sindaci italiani: importi UFFICIALI, fissati per legge
// (Legge di Bilancio 2022, a regime dal 2024). Sono una percentuale del trattamento
// dei Presidenti di Regione, pari a 13.800 € lordi al mese.
const BASE = 13800;
const FASCE = [
  { ab: "Fino a 3.000 abitanti", pct: 16 },
  { ab: "Da 3.001 a 5.000", pct: 22 },
  { ab: "Da 5.001 a 10.000", pct: 29 },
  { ab: "Da 10.001 a 30.000", pct: 30 },
  { ab: "Da 30.001 a 50.000", pct: 35 },
  { ab: "Oltre 50.000", pct: 45 },
  { ab: "Capoluogo di provincia fino a 100.000", pct: 70 },
  { ab: "Capoluogo di provincia oltre 100.000 e capoluogo di regione", pct: 80 },
  { ab: "Sindaco di città metropolitana", pct: 100 },
];
const eur = (n: number) => `${n.toLocaleString("it")} €`;

function Inner() {
  const max = BASE;
  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/justice.jpg"
          alt="Palazzo comunale"
          kicker="🏛️ Indennità dei sindaci · importi di legge"
          title="QUANTO GUADAGNA"
          highlight="IL SINDACO?"
          stat="2.208 – 13.800 €"
          statLabel="al mese, secondo gli abitanti del comune"
          accent="#a5b4fc"
          accent2="#22d3ee"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          Quanto prende un sindaco in Italia dipende da quanti abitanti ha il comune: lo dice la legge. Ecco la tabella completa, fascia per fascia.
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title="In parole semplici" by="te lo spiega Claro">
          <p>
            Il sindaco non si decide lo stipendio da solo: lo fissa la legge. Si parte dai 13.800 € al mese di un
            Presidente di Regione e si scende con una percentuale, in base a quanti abitanti ha il comune. Più piccolo
            è il paese, meno prende. In un paese sotto i 3.000 abitanti sono 2.208 € lordi al mese.
          </p>
        </SimpleExplainer>
      </div>

      {/* La tabella per fasce: è esattamente quello che la gente cerca */}
      <section className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold">📊 Quanto guadagna il sindaco per numero di abitanti</h2>
        <p className="text-[11px] text-cyan/70 mb-4">Indennità di funzione, importi lordi al mese (a regime dal 2024).</p>
        <ol className="space-y-1.5">
          {FASCE.map((f) => {
            const amount = Math.round((BASE * f.pct) / 100);
            return (
              <li key={f.ab} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-sm">{f.ab}</span>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${(amount / max) * 100}%` }} />
                  </span>
                  <span className="text-[10px] text-muted">{f.pct}% dell&apos;indennità di un Presidente di Regione</span>
                </span>
                <span className="tabular text-sm font-semibold text-[#a5b4fc] shrink-0">
                  {eur(amount)}<span className="text-[10px] text-muted font-normal">/mese</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="text-[11px] text-muted mt-3">
          Fonte: Legge di Bilancio 2022 (art. 1, commi 583-587), a regime dal 2024. L&apos;indennità è parametrata al
          trattamento economico dei Presidenti di Regione (13.800 € lordi al mese).
        </p>
      </section>

      {/* Le due cose che la gente chiede sempre */}
      <div className="grid sm:grid-cols-2 gap-3 mt-8">
        <div className="glass p-5">
          <h2 className="text-base font-semibold mb-2">💶 E il netto?</h2>
          <p className="text-sm text-muted">
            Gli importi qui sopra sono <b className="text-fg/90">lordi</b>. Il netto dipende dalla situazione fiscale
            personale di ciascuno (aliquote, detrazioni, addizionali), quindi non esiste un numero unico valido per
            tutti: in linea di massima resta poco più della metà. Noi pubblichiamo solo il lordo, che è il dato certo.
          </p>
        </div>
        <div className="glass p-5">
          <h2 className="text-base font-semibold mb-2">✂️ Il taglio del 50%</h2>
          <p className="text-sm text-muted">
            Se il sindaco è un <b className="text-fg/90">lavoratore dipendente che non si è messo in aspettativa</b>,
            l&apos;indennità viene <b className="text-fg/90">dimezzata</b>. È il motivo per cui due sindaci di comuni
            uguali possono prendere cifre molto diverse.
          </p>
        </div>
      </div>

      <ShareBar className="mt-6" lang="it" text="🏛️ Quanto guadagna un sindaco in Italia? Da 2.208 € al mese in un paese sotto i 3.000 abitanti fino a 13.800 € in una città metropolitana. Lo decide la legge, in base agli abitanti. 👀 Importi ufficiali" />

      {/* FAQ costruite sulle domande VERE che la gente fa a Google */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Domande frequenti</h2>
        <div className="space-y-2.5">
          {[
            { q: "Quanto guadagna il sindaco di un piccolo paese?", a: "In un comune fino a 3.000 abitanti l'indennità è di 2.208 € lordi al mese; da 3.001 a 5.000 abitanti sale a 3.036 €. Se il sindaco è un lavoratore dipendente non in aspettativa, l'importo è dimezzato." },
            { q: "Quanto guadagna il sindaco di un paese con 5.000 abitanti?", a: "Un comune con 5.000 abitanti rientra nella fascia 3.001-5.000: l'indennità è di 3.036 € lordi al mese. Superati i 5.000 abitanti si passa a 4.002 € lordi al mese." },
            { q: "Quanto guadagna il sindaco di un comune con 10.000 abitanti?", a: "Da 5.001 a 10.000 abitanti l'indennità è di 4.002 € lordi al mese. Da 10.001 a 30.000 abitanti sale a 4.140 €." },
            { q: "Quanto guadagna il sindaco al mese?", a: "Dipende dagli abitanti del comune: si va da 2.208 € lordi al mese (fino a 3.000 abitanti) a 13.800 € per i sindaci delle città metropolitane. I capoluoghi di regione prendono 11.040 €." },
            { q: "Qual è il sindaco più pagato d'Italia?", a: "I sindaci delle città metropolitane, con 13.800 € lordi al mese: è il massimo previsto dalla legge, pari all'indennità di un Presidente di Regione. Subito sotto i capoluoghi di regione e i capoluoghi di provincia sopra i 100.000 abitanti, con 11.040 €." },
            { q: "Quali sono gli stipendi netti di un sindaco?", a: "Gli importi fissati dalla legge sono lordi. Il netto cambia da persona a persona secondo aliquote, detrazioni e addizionali locali, quindi non esiste una cifra unica: in genere resta poco più della metà del lordo." },
            { q: "Chi decide quanto guadagna un sindaco?", a: "Lo decide la legge, non il comune: l'indennità è una percentuale fissa del trattamento dei Presidenti di Regione (13.800 € lordi al mese), stabilita in base alla popolazione del comune dalla Legge di Bilancio 2022, a regime dal 2024." },
          ].map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href="/italia/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          Cerca il tuo comune →
        </Link>
        <Link href="/stipendi-politici/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          Quanto guadagna un parlamentare
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function SindaciClient() {
  return (
    <LocaleProvider force="it">
      <Inner />
    </LocaleProvider>
  );
}
