"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import ShareFact from "@/components/ShareFact";

// Dati UFFICIALI OCSE — rapporto "Taxing Wages", anno 2024, lavoratore single
// senza figli con salario medio. Il "cuneo fiscale" è la quota del COSTO DEL
// LAVORO che finisce allo Stato (imposte + contributi di azienda e lavoratore).
const CUNEO = [
  { flag: "🇧🇪", nameEs: "Bélgica", nameIt: "Belgio", v: 52.6 },
  { flag: "🇩🇪", nameEs: "Alemania", nameIt: "Germania", v: 47.9 },
  { flag: "🇫🇷", nameEs: "Francia", nameIt: "Francia", v: 47.2 },
  { flag: "🇮🇹", nameEs: "Italia", nameIt: "Italia", v: 47.1, mine: true },
  { flag: "🇪🇸", nameEs: "España", nameIt: "Spagna", v: 40.6, mine: true },
  { flag: "🌍", nameEs: "Media OCDE", nameIt: "Media OCSE", v: 34.9, avg: true },
];
// Spagna 2024: come si divide quel 40,6% (OCSE). Mostra la parte "invisibile".
const ES_SPLIT = [
  { esL: "Cotizaciones que paga la EMPRESA", itL: "Contributi che paga l'AZIENDA", v: 23.4, hidden: true },
  { esL: "IRPF (el que ves en la nómina)", itL: "IRPF (quello che vedi in busta paga)", v: 12.3, hidden: false },
  { esL: "Cotizaciones que pagas TÚ", itL: "Contributi che paghi TU", v: 5.0, hidden: false },
];
// Scaglioni IRPEF italiani in vigore (3 aliquote).
const IRPEF = [
  { r: "Fino a 28.000 €", a: 23 },
  { r: "Da 28.001 a 50.000 €", a: 35 },
  { r: "Oltre 50.000 €", a: 43 },
];

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const max = CUNEO[0].v;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/money.jpg"
          alt={t("Monedas de euro", "Monete da un euro")}
          kicker={t("💼 Impuestos sobre el sueldo · datos OCDE", "💼 Tasse sullo stipendio · dati OCSE")}
          title={t("TU SUELDO:", "IL TUO STIPENDIO:")}
          highlight={t("¿CUÁNTO SE QUEDA EL ESTADO?", "QUANTO SE NE PRENDE LO STATO?")}
          stat={t("40,6%", "47,1%")}
          statLabel={t("de lo que cuestas a tu empresa", "di quello che costi alla tua azienda")}
          accent="#f43f5e"
          accent2="#fbbf24"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Miras la nómina y ves lo que te quitan. Pero la mayor parte no aparece ahí: se paga antes, y nunca la ves. Aquí está la cuenta completa.",
            "Guardi la busta paga e vedi quello che ti tolgono. Ma la parte più grossa lì non c'è: si paga prima, e non la vedi mai. Qui c'è il conto completo.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "Tu empresa no gasta en ti lo que pone en tu contrato: gasta bastante más. Antes de llegar a tu «bruto» ya ha pagado unas cotizaciones que tú no ves en ninguna parte. Luego, de ese bruto, te descuentan tus cotizaciones y el IRPF. Lo que sobra es lo que te llega.",
            "La tua azienda non spende per te quello che c'è scritto nel contratto: spende parecchio di più. Prima ancora di arrivare al tuo «lordo» ha già pagato dei contributi che tu non vedi da nessuna parte. Poi, da quel lordo, ti tolgono i tuoi contributi e l'IRPEF. Quello che avanza è quello che ti arriva.",
          )}</p>
          <p>{t(
            "Sumando todo, en España el Estado se queda con el 40,6% de lo que costáis a la empresa. En Italia, el 47,1%.",
            "Sommando tutto, in Italia lo Stato si prende il 47,1% di quello che costi all'azienda. In Spagna il 40,6%.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* Il confronto internazionale */}
      <section className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold">📊 {t("Cuánto se queda el Estado, país por país", "Quanto se ne prende lo Stato, Paese per Paese")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">
          {t(
            "Porcentaje del coste laboral que va a impuestos y cotizaciones. Trabajador soltero sin hijos con salario medio, 2024.",
            "Percentuale del costo del lavoro che va in tasse e contributi. Lavoratore single senza figli con stipendio medio, 2024.",
          )}
        </p>
        <ol className="space-y-1.5">
          {CUNEO.map((c) => (
            <li key={c.nameEs} className={`glass flex items-center gap-3 px-3 py-2.5 ${c.mine ? "border-cyan/30" : ""}`}>
              <span className="text-base shrink-0">{c.flag}</span>
              <span className="flex-1 min-w-0">
                <span className={`block truncate text-sm ${c.mine ? "font-semibold" : c.avg ? "italic text-muted" : "font-medium"}`}>
                  {it ? c.nameIt : c.nameEs}
                </span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${(c.v / max) * 100}%`, background: c.avg ? "#64748b" : c.mine ? "linear-gradient(90deg,#f43f5e,#fbbf24)" : "#475569" }} />
                </span>
              </span>
              <span className={`tabular text-sm font-semibold shrink-0 ${c.mine ? "text-[#fbbf24]" : "text-muted"}`}>
                {c.v.toLocaleString(it ? "it" : "es", { minimumFractionDigits: 1 })}%
              </span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">
          {t("Fuente: OCDE, informe «Taxing Wages» (2024). Italia es el cuarto país de la OCDE con más carga.", "Fonte: OCSE, rapporto «Taxing Wages» (2024). L'Italia è il quarto Paese OCSE per carico fiscale sul lavoro.")}
        </p>
      </section>

      {/* La parte invisibile */}
      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold">🫥 {t("La parte que nunca ves", "La parte che non vedi mai")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Cómo se reparte ese 40,6% en España (OCDE, 2024).", "Come si divide quel 40,6% in Spagna (OCSE, 2024).")}</p>
        <div className="space-y-2">
          {ES_SPLIT.map((r) => (
            <div key={r.esL} className="glass px-3 py-2.5 flex items-center gap-3">
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium">{it ? r.itL : r.esL}</span>
                <span className="mt-1 block h-2 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${(r.v / 23.4) * 100}%`, background: r.hidden ? "#f43f5e" : "#fbbf24" }} />
                </span>
                {r.hidden && (
                  <span className="text-[10px] text-[#f43f5e]">{t("no aparece en tu nómina", "in busta paga non c'è")}</span>
                )}
              </span>
              <span className="tabular text-sm font-semibold shrink-0" style={{ color: r.hidden ? "#f43f5e" : "#fbbf24" }}>{r.v.toLocaleString(it ? "it" : "es", { minimumFractionDigits: 1 })}%</span>
            </div>
          ))}
        </div>
        <div className="glass p-4 mt-3 border border-[#f43f5e]/25">
          <p className="text-sm">
            {t(
              "Fíjate: la parte más grande — el 23,4% — la paga la empresa antes de que tú veas nada. Por eso mucha gente cree que le quitan menos de lo que realmente se paga por su trabajo.",
              "Guarda bene: la fetta più grossa — il 23,4% — la paga l'azienda prima che tu veda qualcosa. Ecco perché in tanti credono che gli tolgano meno di quanto in realtà si paga sul loro lavoro.",
            )}
          </p>
          <ShareFact
            className="mt-2"
            lang={it ? "it" : "es"}
            text={t(
              "💼 En España el Estado se queda con el 40,6% de lo que cuestas a tu empresa. Y la parte más grande (23,4%) la paga la empresa: en tu nómina no aparece. 👀 Datos OCDE",
              "💼 In Italia lo Stato si prende il 47,1% di quello che costi alla tua azienda. E la fetta più grossa la paga l'azienda: in busta paga non la vedi. 👀 Dati OCSE",
            )}
          />
        </div>
      </section>

      {/* Scaglioni IRPEF — solo versione italiana, è la tabella che si cerca */}
      {it && (
        <section className="mt-10">
          <h2 className="text-lg md:text-xl font-semibold">🇮🇹 Gli scaglioni IRPEF</h2>
          <p className="text-[11px] text-cyan/70 mb-4">L&apos;aliquota non si applica a tutto lo stipendio: sale solo sulla parte che supera ogni soglia.</p>
          <ol className="space-y-1.5">
            {IRPEF.map((s) => (
              <li key={s.r} className="glass flex items-center justify-between gap-3 px-3 py-2.5">
                <span className="text-sm font-medium">{s.r}</span>
                <span className="tabular text-sm font-semibold text-[#fbbf24]">{s.a}%</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-3">
            Attenzione all&apos;errore più comune: se guadagni 30.000 € non paghi il 35% su tutto. Paghi il 23% sui primi
            28.000 e il 35% solo sui 2.000 che restano.
          </p>
        </section>
      )}

      <div className="mt-8 glass p-4 border border-amber-400/25">
        <p className="text-xs text-amber-200/90">
          ⚠️ {t(
            "Por qué no te damos «el neto de 1.500 € brutos»: depende de tu situación (deducciones, hijos, comunidad, tramos autonómicos). Cualquier cifra exacta sería mentira para casi todo el mundo. Lo que sí es cierto y comparable es el porcentaje de arriba.",
            "Perché non ti diamo «il netto di 1.500 € lordi»: dipende dalla tua situazione (detrazioni, figli, addizionali regionali e comunali). Una cifra secca sarebbe sbagliata per quasi tutti. Quello che invece è certo e confrontabile è la percentuale qui sopra.",
          )}
        </p>
      </div>

      <ShareBar className="mt-8" lang={it ? "it" : "es"} text={t(
        "💼 De lo que cuestas a tu empresa, el Estado se queda el 40,6% en España y el 47,1% en Italia (media OCDE: 34,9%). Y la mayor parte no aparece en tu nómina. 👀",
        "💼 Di quello che costi alla tua azienda, lo Stato si prende il 47,1% in Italia e il 40,6% in Spagna (media OCSE: 34,9%). E la parte più grossa in busta paga non la vedi. 👀",
      )} />

      {/* FAQ dalle domande PAA reali */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quante tasse ti tolgono dallo stipendio?", a: "Molte più di quelle che vedi. Sommando IRPEF e contributi (i tuoi e quelli dell'azienda), in Italia lo Stato incassa il 47,1% del costo totale del tuo lavoro: siamo il quarto Paese OCSE, contro una media del 34,9%. Fonte: OCSE, Taxing Wages 2024." },
                { q: "Che percentuale di tasse si paga sullo stipendio?", a: "Dipende da cosa conti. Sul lordo in busta paga ti tolgono i contributi (circa il 9%) e poi l'IRPEF (23%, 35% o 43% a scaglioni). Ma sul costo totale del lavoro, contando anche la parte pagata dall'azienda, si arriva al 47,1%." },
                { q: "Quanto è il netto di 1.500 euro lordi?", a: "Non esiste una risposta valida per tutti, e diffida di chi te la dà secca: il netto cambia secondo detrazioni, figli a carico e addizionali regionali e comunali, che variano da comune a comune. Per una stima precisa serve un calcolo sulla tua situazione." },
                { q: "Perché in busta paga non vedo tutto?", a: "Perché una parte grossa la paga l'azienda prima ancora di arrivare al tuo lordo, e in busta paga non compare. In Spagna, dove l'OCSE dà il dettaglio, è il 23,4% del costo del lavoro: più del doppio di quello che paga il lavoratore." },
                { q: "Come funzionano gli scaglioni IRPEF?", a: "A scaglioni, non tutto insieme: 23% fino a 28.000 €, 35% da 28.001 a 50.000 €, 43% oltre. Se guadagni 30.000 € non paghi il 35% su tutto: paghi il 23% sui primi 28.000 e il 35% solo sui 2.000 rimanenti." },
              ]
            : [
                { q: "¿Cuánto se queda el Estado de mi sueldo?", a: "El 40,6% de lo que le cuestas a tu empresa, sumando IRPF y cotizaciones (las tuyas y las suyas). La media de la OCDE es el 34,9%. Fuente: OCDE, Taxing Wages 2024." },
                { q: "¿Por qué en mi nómina no lo veo todo?", a: "Porque la parte más grande la paga la empresa antes de llegar a tu bruto: el 23,4% del coste laboral. Tú ves el IRPF (12,3%) y tus cotizaciones (5%), pero no esa parte. Datos OCDE 2024." },
                { q: "¿Cuánto me van a quitar de 1.500 € brutos?", a: "No hay una respuesta válida para todos, y desconfía de quien te la dé cerrada: el neto cambia según deducciones, hijos y el tramo autonómico de tu comunidad. Para una cifra exacta hace falta calcularlo sobre tu caso." },
                { q: "¿España está por encima o por debajo de la media?", a: "Por encima: 40,6% frente al 34,9% de media en la OCDE. Aun así, por debajo de Italia (47,1%), Francia (47,2%), Alemania (47,9%) y Bélgica (52,6%)." },
                { q: "¿Adónde va ese dinero?", a: "Al bote común del Estado: pensiones (la mayor partida), sanidad, educación, y los intereses de la deuda. Las cotizaciones sociales financian sobre todo las pensiones de quienes ya están jubilados." },
              ]
          ).map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href={it ? "/spesa-pensioni/" : "/gasto-pensiones/"} className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("¿Adónde van tus cotizaciones? →", "Dove finiscono i tuoi contributi? →")}
        </Link>
        <Link href={it ? "/spesa-sanita/" : "/gasto-sanidad/"} className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("El dinero de la sanidad", "I soldi della sanità")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function StipendioClient({ locale }: { locale?: "es" | "it" }) {
  return (
    <LocaleProvider force={locale}>
      <Inner />
    </LocaleProvider>
  );
}
