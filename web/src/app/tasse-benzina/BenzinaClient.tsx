"use client";

import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import ShareFact from "@/components/ShareFact";

// Accisa strutturale su benzina e gasolio dal 1° gennaio 2026: allineate a
// 672,90 € per 1.000 litri (Legge di Bilancio 2026, art. 30). Il Governo può
// modificarla temporaneamente per decreto, quindi la pagina spiega soprattutto
// il MECCANISMO — che non cambia mai — e mostra il conto per più prezzi.
const ACCISA = 0.6729; // €/litro
const IVA = 0.22;
const PREZZI = [1.7, 1.8, 1.9, 2.0];

const eur = (n: number) => `${n.toFixed(3).replace(".", ",")} €`;
const eur2 = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;
const pct = (n: number) => `${(n * 100).toFixed(1).replace(".", ",")}%`;

// Da un prezzo alla pompa ricava le tre componenti.
function scomponi(prezzo: number) {
  const iva = prezzo * (IVA / (1 + IVA)); // l'IVA è già dentro il prezzo esposto
  const prodotto = prezzo - iva - ACCISA; // ciò che resta: prodotto + margini
  const tasse = iva + ACCISA;
  return { iva, prodotto, tasse, quota: tasse / prezzo };
}

function Inner() {
  const esempio = scomponi(1.8);
  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/money.jpg"
          alt="Monete e carburante"
          kicker="⛽ Accise e IVA · soldi che vanno allo Stato"
          title="QUANTO GUADAGNA LO STATO"
          highlight="SU UN LITRO DI BENZINA?"
          stat="~1 €"
          statLabel="di tasse su un litro da 1,80 €"
          accent="#fbbf24"
          accent2="#f43f5e"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          Fai il pieno e pensi di pagare la benzina. In realtà più della metà di quei soldi non va né al benzinaio né
          al petrolio: va allo Stato. Ecco il conto, fatto davanti a te.
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title="In parole semplici" by="te lo spiega Claro">
          <p>
            Quel numero sul display è fatto di tre pezzi. Uno è il <b className="text-fg/90">carburante vero</b>, con
            dentro chi te lo porta e chi te lo vende. Gli altri due sono tasse: l&apos;
            <b className="text-fg/90">accisa</b>, che è fissa — quasi 70 centesimi su ogni litro, che il prezzo sia alto
            o basso — e l&apos;<b className="text-fg/90">IVA al 22%</b>.
          </p>
          <p>
            E qui c&apos;è il trucco che quasi nessuno conosce: l&apos;IVA la paghi{" "}
            <b className="text-fg/90">anche sull&apos;accisa</b>. Cioè una tassa sopra un&apos;altra tassa. Sembra
            assurdo, ma è così che funziona il conto.
          </p>
        </SimpleExplainer>
      </div>

      {/* Il conto, con esempio concreto */}
      <section className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold">🧾 Com&apos;è fatto un litro da 1,80 €</h2>
        <p className="text-[11px] text-cyan/70 mb-4">Accisa 0,6729 €/litro + IVA 22%. Il resto è prodotto e margini.</p>
        <div className="space-y-2">
          {[
            { l: "Accisa: la tassa fissa su ogni litro", v: ACCISA, c: "#fbbf24", tax: true },
            { l: "IVA 22%: pagata anche sull'accisa", v: esempio.iva, c: "#f43f5e", tax: true },
            { l: "La benzina vera (e chi te la porta)", v: esempio.prodotto, c: "#34d399", tax: false },
          ].map((r) => (
            <div key={r.l} className="glass px-3 py-2.5 flex items-center gap-3">
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium">{r.l}</span>
                <span className="mt-1 block h-2 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${(r.v / 1.8) * 100}%`, background: r.c }} />
                </span>
                <span className="text-[10px] text-muted">{pct(r.v / 1.8)} del prezzo {r.tax ? "· va allo Stato" : "· non è tassa"}</span>
              </span>
              <span className="tabular text-sm font-semibold shrink-0" style={{ color: r.c }}>{eur(r.v)}</span>
            </div>
          ))}
        </div>
        <div className="glass p-4 mt-3 border border-amber-400/30">
          <p className="text-sm">
            <b className="text-amber-200">Totale allo Stato: {eur(esempio.tasse)} su 1,80 €</b>
            <span className="text-muted"> — cioè il {pct(esempio.quota)} di quello che paghi.</span>
          </p>
          <ShareFact
            className="mt-2"
            lang="it"
            text={`⛽ Su un litro di benzina da 1,80 €, circa ${eur2(esempio.tasse)} vanno allo Stato in accise e IVA: il ${pct(esempio.quota)} di quello che paghi. 👀`}
          />
        </div>
      </section>

      {/* Tabella per più prezzi: resta utile anche quando il prezzo cambia */}
      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold">📊 Quanto va allo Stato, a seconda del prezzo</h2>
        <p className="text-[11px] text-cyan/70 mb-4">Il prezzo alla pompa cambia ogni giorno: qui trovi il conto per i valori più comuni.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2 pr-3 font-medium">Prezzo al litro</th>
                <th className="py-2 pr-3 font-medium">Accisa</th>
                <th className="py-2 pr-3 font-medium">IVA</th>
                <th className="py-2 pr-3 font-medium">Totale tasse</th>
                <th className="py-2 font-medium">% del prezzo</th>
              </tr>
            </thead>
            <tbody>
              {PREZZI.map((p) => {
                const s = scomponi(p);
                return (
                  <tr key={p} className="border-t border-[var(--panel-border)]">
                    <td className="py-2.5 pr-3 tabular font-medium">{eur2(p)}</td>
                    <td className="py-2.5 pr-3 tabular text-muted">{eur(ACCISA)}</td>
                    <td className="py-2.5 pr-3 tabular text-muted">{eur(s.iva)}</td>
                    <td className="py-2.5 pr-3 tabular font-semibold text-[#fbbf24]">{eur(s.tasse)}</td>
                    <td className="py-2.5 tabular font-semibold text-[#f43f5e]">{pct(s.quota)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted mt-3">
          Accisa su benzina e gasolio allineata a 672,90 € per 1.000 litri (0,6729 €/litro) dal 1° gennaio 2026, Legge
          di Bilancio 2026 (art. 30). Il Governo può modificarla temporaneamente con un decreto: controlla sempre la
          data. L&apos;IVA sui carburanti è al 22%.
        </p>
      </section>

      <ShareBar className="mt-8" lang="it" text="⛽ Su un litro di benzina da 1,80 €, circa 1 € va allo Stato tra accisa e IVA: il 55% di quello che paghi. E l'IVA si paga anche sull'accisa. 👀 Il conto completo" />

      {/* FAQ dalle domande vere di Google */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Domande frequenti</h2>
        <div className="space-y-2.5">
          {[
            { q: "Quanto guadagna lo Stato su un litro di benzina?", a: `Su un litro pagato 1,80 € lo Stato incassa circa ${eur2(esempio.tasse)}: 0,6729 € di accisa più ${eur2(esempio.iva)} di IVA. È circa il ${pct(esempio.quota)} del prezzo. Più sale il prezzo, più sale l'IVA (che è in percentuale), mentre l'accisa resta fissa.` },
            { q: "Quali sono le tasse che si pagano sulla benzina?", a: "Due: l'accisa, una tassa fissa per ogni litro (0,6729 € dal 2026), e l'IVA al 22%. L'IVA si applica sul prezzo comprensivo di accisa: è di fatto una tassa calcolata anche sopra un'altra tassa." },
            { q: "Quanto costerebbe un litro di benzina senza le accise?", a: `Un litro pagato 1,80 € costerebbe circa ${eur2(1.8 - ACCISA * (1 + IVA))}: togliendo l'accisa si risparmia sia l'accisa stessa sia l'IVA calcolata su di essa.` },
            { q: "Perché l'IVA si paga anche sull'accisa?", a: "Perché l'IVA si calcola sul prezzo finale, e in quel prezzo l'accisa è già dentro. Non è un errore, è proprio il meccanismo. Il lato buono: quando tagliano l'accisa, alla pompa risparmi un po' più di quanto hanno tagliato, perché scende anche l'IVA che ci stava sopra." },
            { q: "Le accise cambiano?", a: "Sì, e anche spesso. Dal 1° gennaio 2026 benzina e gasolio hanno la stessa accisa, 0,6729 € al litro. Ma il Governo può cambiarla con un decreto, a volte per pochi giorni. Qui trovi la cifra di legge: guarda sempre la data." },
            { q: "Dove finiscono i soldi delle accise?", a: "Nel calderone del bilancio dello Stato, come tutte le altre tasse. Non c'è un salvadanaio a parte: servono a pagare sanità, scuola, pensioni e gli interessi sul debito." },
          ].map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href="/debito-pubblico/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          Quanto deve lo Stato? →
        </Link>
        <Link href="/italia/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          I conti del tuo comune
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function BenzinaClient() {
  return (
    <LocaleProvider force="it">
      <Inner />
    </LocaleProvider>
  );
}
