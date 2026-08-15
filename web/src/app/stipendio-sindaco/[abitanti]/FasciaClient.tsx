"use client";

import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import ShareFact from "@/components/ShareFact";
import { FONTE_IT, FONTE_IRPEF, TAGLIE_IT, euro, nEu } from "@/data/fasce-sindaci";

export type Comune = { name: string; slug: string; poblacion: number; annuo: number };

export type Props = {
  abitanti: number;
  fasciaLabel: string;
  pct: number;
  lordoMese: number;
  lordoAnno: number;
  irpef: number;
  nettoStimato: number;
  comuni: Comune[];
  ruoli: { pct: number; label: string; lordoMese: number }[];
  comuniEsatti: boolean;
};

const eur = euro;

export default function FasciaClient(p: Props) {
  const ab = nEu(p.abitanti);
  return (
    <LocaleProvider force="it">
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <SiteNav />

        <header className="pt-8">
          <p className="text-xs uppercase tracking-widest text-cyan/70">🏛️ Indennità del sindaco · dato di legge</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2 leading-tight">
            Quanto guadagna il sindaco di un comune con <span className="neon-text">{ab} abitanti</span>?
          </h1>

          {/* LA RISPOSTA, subito e per intero: e' quello che cercava chi arriva
              qui, ed e' il pezzo che i motori con l'AI citano. */}
          <div className="glass p-5 mt-5 border border-cyan/30">
            <p className="text-base md:text-lg">
              Il sindaco di un comune con <b className="text-fg">{ab} abitanti</b> prende{" "}
              <b className="text-cyan text-xl">{eur(p.lordoMese)} lordi al mese</b>, cioè{" "}
              <b className="text-fg">{eur(p.lordoAnno)} lordi all&apos;anno</b>.
            </p>
            <p className="text-sm text-muted mt-2">
              È l&apos;indennità di funzione fissata per legge: il {p.pct}% del trattamento dei Presidenti di Regione
              (13.800 € al mese). Vale per tutti i comuni {p.fasciaLabel}.
            </p>
            <ShareFact
              className="mt-3"
              lang="it"
              text={`🏛️ Il sindaco di un comune con ${ab} abitanti prende ${eur(p.lordoMese)} lordi al mese (${eur(p.lordoAnno)} l'anno). È il ${p.pct}% del trattamento di un Presidente di Regione. 👀`}
            />
          </div>
        </header>

        {/* Sopra i 50.000 abitanti la sola fascia demografica non basta: se il
            comune è capoluogo l'indennità sale parecchio. Tacerlo sarebbe un
            errore, perché un comune di questa taglia spesso è capoluogo. */}
        {p.ruoli.length > 0 && (
          <section className="mt-6 glass p-5 border border-amber-400/30">
            <h2 className="text-base font-semibold mb-1">⚠️ Attenzione: se il comune è capoluogo, cambia tutto</h2>
            <p className="text-sm text-muted mb-3">
              {eur(p.lordoMese)} vale per un comune di questa dimensione che <b className="text-fg/90">non</b> è
              capoluogo. Se lo è, la legge alza la percentuale:
            </p>
            <div className="space-y-2">
              {p.ruoli.map((r) => (
                <div key={r.pct} className="flex items-baseline justify-between gap-3 border-t border-[var(--panel-border)] pt-2">
                  <span className="text-sm">{r.label} <span className="text-muted">({r.pct}%)</span></span>
                  <span className="tabular text-sm font-semibold text-[#fbbf24] shrink-0">{eur(r.lordoMese)}/mese</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6">
          <SimpleExplainer title="In parole semplici" by="te lo spiega Claro">
            <p>
              Il sindaco non si decide lo stipendio da solo. C&apos;è una tabella nazionale: si guarda quanti abitanti
              ha il comune e ne esce una cifra fissa, uguale per tutti i comuni di quella dimensione. Un sindaco di{" "}
              {ab} abitanti a nord prende esattamente come uno di {ab} abitanti a sud.
            </p>
            <p>
              <b className="text-fg/90">Il trucco che quasi nessuno sa:</b> se il sindaco continua a fare il suo lavoro
              da dipendente senza mettersi in aspettativa, l&apos;indennità gli viene <b className="text-fg/90">
              dimezzata</b>. Quindi tanti sindaci prendono la metà di quello che leggi qui sopra.
            </p>
          </SimpleExplainer>
        </div>

        {/* Netto: la domanda piu' cercata dopo il lordo, e quella a cui quasi
            nessuno risponde. Va data come CALCOLO, col metodo in chiaro. */}
        <section className="mt-8">
          <h2 className="text-lg md:text-xl font-semibold">💶 E al netto, quanto resta?</h2>
          <p className="text-[11px] text-amber-300/80 mb-3">
            Stima nostra, non un dato ufficiale: il netto vero dipende dalla persona. Qui sotto trovi il conto passo
            per passo, così puoi rifarlo.
          </p>
          <div className="glass p-4 space-y-2">
            {[
              { l: "Lordo all'anno (dato di legge)", v: eur(p.lordoAnno), c: "#22d3ee" },
              { l: "IRPEF secondo gli scaglioni 2026", v: "− " + eur(p.irpef), c: "#f43f5e" },
              { l: "Resta, prima di addizionali e detrazioni", v: eur(p.nettoStimato), c: "#34d399" },
            ].map((r, i) => (
              <div key={r.l} className={"flex items-baseline justify-between gap-3" + (i === 2 ? " pt-2 border-t border-[var(--panel-border)]" : "")}>
                <span className="text-sm text-muted">{r.l}</span>
                <span className="tabular font-semibold shrink-0" style={{ color: r.c }}>{r.v}</span>
              </div>
            ))}
            <p className="text-sm pt-2">
              Cioè circa <b className="text-green">{eur(Math.round(p.nettoStimato / 12))} al mese</b>.
            </p>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Come l&apos;abbiamo calcolato: IRPEF 2026 al 23% fino a 28.000 €, 33% da 28.001 a 50.000 €, 43% oltre.
            Non abbiamo tolto le <b>addizionali regionali e comunali</b> (dallo 0,5% al 3,3% circa, cambiano da comune
            a comune: abbassano il netto) né aggiunto le <b>detrazioni</b> (lo alzano). Per questo è una stima e non
            una certezza — chi ti dà una cifra netta secca sta indovinando.
          </p>
        </section>

        {/* Il pezzo che nessun altro ha: i comuni VERI di quella taglia. */}
        {p.comuni.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg md:text-xl font-semibold">
              {p.comuniEsatti ? "🏙️ Comuni veri di questa dimensione" : "🏙️ I comuni più piccoli che abbiamo"}
            </h2>
            <p className="text-[11px] text-cyan/70 mb-4">
              {p.comuniEsatti
                ? "Non esempi inventati: sono comuni italiani con i conti pubblicati. Clicca per vedere il bilancio."
                : `Nel nostro archivio i comuni con il bilancio pubblicato partono da circa 40.000 abitanti, quindi per ${ab} abitanti non abbiamo un esempio reale. Questi sono i più piccoli che copriamo.`}
            </p>
            <ul className="space-y-1.5">
              {p.comuni.map((c) => (
                <li key={c.slug}>
                  <Link href={`/it/${c.slug}/`} className="glass flex items-center gap-3 px-3 py-2.5 hover:border-cyan transition">
                    <span className="flex-1 min-w-0">
                      <span className="block truncate font-medium">{c.name}</span>
                      <span className="block text-[11px] text-muted">{nEu(c.poblacion)} abitanti</span>
                    </span>
                    <span className="tabular text-sm font-semibold text-cyan shrink-0">{eur(c.annuo)}/anno</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Le altre taglie: rete interna + copre le ricerche vicine. */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Il tuo comune è di un&apos;altra dimensione?</h2>
          <div className="flex flex-wrap gap-2">
            {TAGLIE_IT.filter((t) => t !== p.abitanti).map((t) => (
              <Link
                key={t}
                href={`/stipendio-sindaco/${t}-abitanti/`}
                className="px-3.5 py-1.5 rounded-full text-sm border border-[var(--panel-border)] text-muted hover:text-fg hover:border-cyan transition"
              >
                {nEu(t)} abitanti
              </Link>
            ))}
          </div>
        </section>

        <ShareBar
          className="mt-8"
          lang="it"
          text={`🏛️ Quanto guadagna il sindaco di un comune con ${ab} abitanti? ${eur(p.lordoMese)} lordi al mese, per legge. E se lavora e non si mette in aspettativa, la metà. 👀`}
        />

        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Domande frequenti</h2>
          <div className="space-y-2.5">
            {[
              {
                q: `Quanto guadagna un sindaco con ${ab} abitanti?`,
                a: `${eur(p.lordoMese)} lordi al mese, cioè ${eur(p.lordoAnno)} lordi all'anno. È il ${p.pct}% del trattamento dei Presidenti di Regione (13.800 € al mese), la percentuale che la legge assegna ai comuni ${p.fasciaLabel}.`,
              },
              {
                q: `E al netto quanto prende?`,
                a: `Circa ${eur(Math.round(p.nettoStimato / 12))} al mese, togliendo l'IRPEF secondo gli scaglioni 2026. È una stima: il netto vero cambia con le addizionali del proprio comune e con le detrazioni personali.`,
              },
              {
                q: "Il sindaco prende sempre tutta l'indennità?",
                a: "No. Se resta al suo lavoro da dipendente senza chiedere l'aspettativa, l'indennità è dimezzata. Molti sindaci di piccoli comuni prendono quindi la metà della cifra di legge.",
              },
              {
                q: "Chi decide quanto guadagna un sindaco?",
                a: "La legge, non il comune. L'importo è una percentuale fissa del trattamento dei Presidenti di Regione, stabilita in base agli abitanti dalla L. 234/2021 e dal DM Interno del 30/05/2022, a regime dal 2024.",
              },
              {
                q: "Un sindaco prende la tredicesima?",
                a: "No. L'indennità di funzione si prende per 12 mensilità: non è uno stipendio da dipendente e non ha tredicesima né TFR.",
              },
            ].map((f, i) => (
              <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
                <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
                <p className="text-sm text-muted mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 glass p-4">
          <p className="text-[11px] text-muted">
            <b className="text-fg/80">Fonti.</b> Indennità:{" "}
            <a href={FONTE_IT.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{FONTE_IT.name}</a>.
            Aliquote IRPEF:{" "}
            <a href={FONTE_IRPEF.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{FONTE_IRPEF.name}</a>.
            I bilanci dei comuni vengono da SIOPE · Ragioneria Generale dello Stato.
          </p>
        </section>

        <nav className="mt-8 flex flex-wrap gap-3">
          <Link href="/stipendi-sindaci/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
            Tutte le fasce e i sindaci veri →
          </Link>
          <Link href="/italia/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            I conti del tuo comune
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </main>
    </LocaleProvider>
  );
}
