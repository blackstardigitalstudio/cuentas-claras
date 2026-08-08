"use client";

import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// ATTENZIONE: gli ingaggi dei piloti NON sono ufficiali — nessun team li pubblica.
// Quelle qui sotto sono STIME di stampa specializzata, coerenti tra più fonti
// (Money.it, QuiFinanza, OA Sport, Sport e Finanza). Vanno mostrate come stime.
// L'unico dato ufficiale è il salario minimo introdotto dal 2027.
const STIME = [
  { pilota: "Marc Márquez", team: "Ducati", mln: 12 },
  { pilota: "Fabio Quartararo", team: "Yamaha", mln: 12 },
  { pilota: "Francesco Bagnaia", team: "Ducati", mln: 7 },
  { pilota: "Marco Bezzecchi", team: "Aprilia", mln: 1.1 },
];
const MIN_2027 = 500000;
const mln = (n: number) => `${n.toLocaleString("it", { maximumFractionDigits: 1 })} mln €`;

function Inner() {
  const max = STIME[0].mln;
  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/italy-stadium.jpg"
          alt="Circuito di MotoGP"
          kicker="🏍️ MotoGP · i soldi dei piloti"
          title="QUANTO GUADAGNA"
          highlight="UN PILOTA MOTOGP?"
          stat="12 mln €"
          statLabel="i più pagati (stima) — e il minimo?"
          accent="#f43f5e"
          accent2="#fbbf24"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          Quanto prendono davvero i piloti della MotoGP? I team non pubblicano gli ingaggi: quello che gira sono stime.
          Qui te le diamo con la fonte — e ti diciamo l&apos;unico dato certo.
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title="In parole semplici" by="te lo spiega Claro">
          <p>
            Un pilota guadagna in tre modi: l&apos;<b className="text-fg/90">ingaggio</b> che gli paga il team, i
            <b className="text-fg/90"> premi</b> se va forte, e gli <b className="text-fg/90">sponsor</b> personali
            (casco, tuta, immagine). Nessuno di questi numeri è pubblico: i contratti sono privati. Per questo qui
            trovi stime, non certezze — e te lo diciamo chiaramente.
          </p>
        </SimpleExplainer>
      </div>

      {/* L'unico dato UFFICIALE */}
      <section className="mt-8 glass p-5 border border-green/25">
        <h2 className="text-lg font-semibold mb-2">✅ L&apos;unico dato certo: il salario minimo</h2>
        <p className="text-sm text-muted">
          Dal <b className="text-fg/90">2027</b> la MotoGP introduce un <b className="text-fg/90">salario minimo
          garantito di {MIN_2027.toLocaleString("it")} € l&apos;anno</b> per tutti i piloti a tempo pieno, rookie
          compresi. È una misura decisa dal campionato, quindi verificabile: fino a oggi un pilota di fondo griglia
          poteva guadagnare molto meno di così.
        </p>
      </section>

      {/* Le stime, etichettate */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg md:text-xl font-semibold">🏍️ Quanto guadagnano i piloti</h2>
          <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
            stima · non ufficiale
          </span>
        </div>
        <p className="text-[11px] text-cyan/70 mb-4">Ingaggio annuo stimato dalla stampa specializzata. I team non pubblicano i contratti.</p>
        <ol className="space-y-1.5">
          {STIME.map((p, i) => (
            <li key={p.pilota} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-sm text-muted w-6 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{p.pilota} <span className="text-muted font-normal">· {p.team}</span></span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-[#f43f5e] to-[#fbbf24]" style={{ width: `${Math.max(8, (p.mln / max) * 100)}%` }} />
                </span>
              </span>
              <span className="tabular text-sm font-semibold text-[#fbbf24] shrink-0">{mln(p.mln)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">
          Stime coerenti tra più testate specializzate (Money.it, QuiFinanza, OA Sport, Sport e Finanza), stagione 2026.
          Non sono dati ufficiali: nessun team pubblica gli ingaggi.
        </p>
      </section>

      <div className="mt-6 glass p-4 border border-amber-400/25">
        <p className="text-xs text-amber-200/90">
          ⚠️ Perché insistiamo: su questo sito i dati pubblici (bilanci, debiti, indennità dei sindaci) sono ufficiali e
          verificabili. Gli ingaggi sportivi <b>no</b>: girano stime, spesso diverse tra loro. Te li diamo lo stesso
          perché è quello che cerchi, ma con l&apos;etichetta giusta — mai spacciati per certi.
        </p>
      </div>

      <ShareBar className="mt-6" lang="it" text="🏍️ Quanto guadagna un pilota MotoGP? I più pagati arrivano a ~12 milioni € (stima), ma dal 2027 arriva un salario minimo garantito di 500.000 €. 👀" />

      {/* FAQ dalle domande vere di Google */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Domande frequenti</h2>
        <div className="space-y-2.5">
          {[
            { q: "Chi è il pilota più pagato in MotoGP?", a: "Secondo le stime della stampa specializzata, Marc Márquez (Ducati) e Fabio Quartararo (Yamaha), entrambi intorno ai 12 milioni di euro l'anno. Sono stime: i team non pubblicano gli ingaggi." },
            { q: "Quanto guadagna Bagnaia in Ducati?", a: "Le stime parlano di circa 7 milioni di euro a stagione per Francesco Bagnaia. Anche questa non è una cifra ufficiale, ma è coerente tra più fonti specializzate." },
            { q: "Qual è lo stipendio minimo in MotoGP?", a: "Dal 2027 entra in vigore un salario minimo garantito di 500.000 € l'anno per tutti i piloti a tempo pieno, rookie compresi. È una misura del campionato, quindi un dato certo. Prima di allora un pilota di fondo griglia poteva guadagnare molto meno." },
            { q: "Perché non ci sono cifre ufficiali sugli stipendi dei piloti?", a: "Perché i contratti tra pilota e team sono privati e nessuno è obbligato a pubblicarli — al contrario dei soldi pubblici, che per legge devono essere trasparenti. Per questo etichettiamo queste cifre come stime." },
            { q: "Come guadagna un pilota oltre all'ingaggio?", a: "Con i premi legati ai risultati e soprattutto con gli sponsor personali (casco, tuta, immagine), che per i piloti più famosi possono valere quanto l'ingaggio stesso." },
          ].map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href="/soldi-giocatori/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          ⚽ I soldi dei calciatori →
        </Link>
        <Link href="/calcio/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          I conti dei club
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function MotogpClient() {
  return (
    <LocaleProvider force="it">
      <Inner />
    </LocaleProvider>
  );
}
