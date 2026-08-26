"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import ShareFact from "@/components/ShareFact";

// Cifre UFFICIALI.
// 🇮🇹 Istat: spesa per pensioni 2024 = 364.132 milioni € (+4,9% sul 2023).
//    Inps: 17,7 milioni di pensionati; pensione media di vecchiaia 1.359,53 €/mese.
// 🇪🇸 Seguridad Social / Moncloa: gasto en pensiones 2025 = 189.598 M€ (nómina
//    mensual + due mensilità extra); 10,4 mln di pensioni a 9,4 mln di persone;
//    pensione media di sistema 1.317,7 €/mese, di vecchiaia 1.512,7 €.
const IT_TOT = 364132; // milioni €
const ES_TOT = 189598; // milioni €
const IT_SANITA = 148522; // per il confronto: quanto costa la sanità in Italia

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const volte = (IT_TOT / IT_SANITA).toFixed(1).replace(".", ",");

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/money.jpg"
          alt={t("Monedas de euro", "Monete da un euro")}
          kicker={t("👴 Pensiones · la mayor factura pública", "👴 Pensioni · la spesa pubblica più grande")}
          title={t("PENSIONES:", "PENSIONI:")}
          highlight={t("¿QUIÉN LAS PAGA?", "CHI LE PAGA?")}
          stat={t("189.598 M€", "364 miliardi €")}
          statLabel={t("al año, solo en pensiones", "all'anno, solo di pensioni")}
          accent="#fbbf24"
          accent2="#f43f5e"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Es la factura pública más grande que existe: más que la sanidad, más que la educación. Aquí ves cuánto cuesta, cuánta gente la cobra y —lo más importante— de dónde sale ese dinero.",
            "È la bolletta pubblica più grande che c'è: più della sanità, più della scuola. Qui vedi quanto costa, quanta gente la prende e — soprattutto — da dove escono quei soldi.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "Aquí está el malentendido más común: tus cotizaciones NO están guardadas en una hucha con tu nombre. El dinero que descuentan de tu nómina hoy se usa hoy mismo para pagar la pensión de los que ya están jubilados. Y cuando te toque a ti, te pagarán los que estén trabajando entonces.",
            "Ecco l'equivoco più diffuso: i tuoi contributi NON sono in un salvadanaio con il tuo nome sopra. I soldi che ti tolgono dalla busta paga oggi servono oggi stesso a pagare la pensione di chi è già in pensione. E quando toccherà a te, te la pagherà chi lavorerà allora.",
          )}</p>
          <p>{t(
            "Por eso importa cuánta gente trabaja y cuánta está jubilada: es una cadena, no una cuenta de ahorro.",
            "Ecco perché conta quanta gente lavora e quanta è in pensione: è una catena, non un libretto di risparmio.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* I due Paesi */}
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {[
          {
            flag: "🇮🇹", name: "Italia", year: "2024",
            tot: t("364.132 M€", "364,1 miliardi €"),
            people: t("17,7 millones de pensionistas", "17,7 milioni di pensionati"),
            media: "1.359,53 €", mediaLab: t("pensión media de jubilación (al mes)", "pensione media di vecchiaia (al mese)"),
            src: "Istat / Inps", srcUrl: "https://www.istat.it/statistiche-per-tema/settori/assistenza-e-previdenza/", accent: "#34d399",
          },
          {
            flag: "🇪🇸", name: t("España", "Spagna"), year: "2025",
            tot: t("189.598 M€", "189,6 miliardi €"),
            people: t("9,4 millones de pensionistas", "9,4 milioni di pensionati"),
            media: "1.512,7 €", mediaLab: t("pensión media de jubilación (al mes)", "pensione media di vecchiaia (al mese)"),
            src: "Seguridad Social", srcUrl: "https://www.seg-social.es/wps/portal/wss/internet/EstadisticasPresupuestosEstudios", accent: "#a5b4fc",
          },
        ].map((c) => (
          <div key={c.name} className="glass p-5 relative overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${c.accent},transparent)` }} />
            <p className="text-sm font-semibold">{c.flag} {c.name} <span className="text-muted font-normal">· {c.year}</span></p>
            <p className="tabular text-2xl font-bold mt-2" style={{ color: c.accent }}>{c.tot}</p>
            <p className="text-[11px] text-muted">{t("de gasto en pensiones al año", "di spesa per pensioni all'anno")}</p>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-muted">{t("Cuánta gente la cobra", "Quanti la prendono")}</span>
                <span className="font-medium text-right">{c.people}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted">{c.mediaLab}</span>
                <span className="tabular font-semibold" style={{ color: c.accent }}>{c.media}</span>
              </div>
            </div>
            <p className="text-[10px] text-muted/70 mt-2">{t("Fuente", "Fonte")}: {c.srcUrl ? <a href={c.srcUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{c.src}</a> : c.src}</p>
          </div>
        ))}
      </div>

      {/* Il confronto che colpisce */}
      <section className="mt-8 glass p-5 border border-amber-400/25">
        <h2 className="text-lg font-semibold mb-2">😮 {t("Para que te hagas una idea", "Per farti un'idea")}</h2>
        <p className="text-sm text-muted">
          {t(
            `En Italia las pensiones cuestan ${volte} veces más que toda la sanidad pública: 364.132 M€ frente a 148.522 M€. Es, con diferencia, la mayor partida de gasto público del país.`,
            `In Italia le pensioni costano ${volte} volte tutta la sanità pubblica: 364,1 miliardi contro 148,5. È di gran lunga la voce di spesa pubblica più grande del Paese.`,
          )}
        </p>
        <ShareFact
          className="mt-2"
          lang={it ? "it" : "es"}
          text={t(
            "👴 Italia se gasta 364.132 M€ al año en pensiones: 2,5 veces todo el gasto sanitario público. Es la mayor factura del Estado. 👀 Datos oficiales",
            "👴 L'Italia spende 364 miliardi l'anno di pensioni: 2,5 volte tutta la sanità pubblica. È la voce più grande del bilancio dello Stato. 👀 Dati ufficiali",
          )}
        />
      </section>

      <ShareBar className="mt-8" lang={it ? "it" : "es"} text={t(
        "👴 Las pensiones son la mayor factura pública: 189.598 M€ al año en España, 364.132 M€ en Italia. Y tus cotizaciones no están en una hucha: pagan las pensiones de hoy. 👀",
        "👴 Le pensioni sono la spesa pubblica più grande: 364 miliardi l'anno in Italia, 189,6 in Spagna. E i tuoi contributi non sono in un salvadanaio: pagano le pensioni di oggi. 👀",
      )} />

      {/* FAQ dalle domande PAA reali */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanto spende l'Italia ogni anno per le pensioni?", a: "364.132 milioni di euro nel 2024, cioè oltre 364 miliardi, in crescita del 4,9% sull'anno prima. È la voce di spesa pubblica più grande che c'è: più del doppio della sanità. Fonte: Istat." },
                { q: "Quanti sono i pensionati in Italia?", a: "Circa 17,7 milioni di persone. La pensione media di vecchiaia è di 1.359,53 € lordi al mese, con importi più alti al Nord. Fonte: Inps." },
                { q: "Che percentuale del PIL spendiamo per le pensioni?", a: "Intorno al 15-16% del PIL, a seconda di come si contano le voci: è la percentuale più alta tra i Paesi OCSE. Pesano l'età media alta e il numero di pensionati rispetto a chi lavora." },
                { q: "Chi paga le pensioni?", a: "Chi lavora oggi. I contributi che ti tolgono dalla busta paga non finiscono in un salvadanaio con il tuo nome: pagano le pensioni di chi è già in pensione adesso. La tua la pagherà chi lavorerà quando toccherà a te." },
                { q: "Quanto si prende di pensione in media?", a: "In Italia la pensione media di vecchiaia è 1.359,53 € lordi al mese (Inps). In Spagna è 1.512,7 € al mese, e la media di tutte le pensioni è 1.317,7 € (Seguridad Social)." },
              ]
            : [
                { q: "¿Cuánto gasta España en pensiones al año?", a: "189.598 millones de euros en 2025, sumando la nómina mensual y las dos pagas extra. Contando también las clases pasivas se superan los 200.000 millones. Fuente: Seguridad Social." },
                { q: "¿Cuántos pensionistas hay en España?", a: "9,4 millones de personas, que cobran 10,4 millones de pensiones (hay quien cobra más de una). La pensión media de jubilación es de 1.512,7 € al mes y la media del sistema, 1.317,7 €. Fuente: Seguridad Social." },
                { q: "¿Quién paga las pensiones?", a: "Los que trabajan hoy. Las cotizaciones que te descuentan de la nómina no van a una hucha con tu nombre: pagan las pensiones de los que ya están jubilados. La tuya la pagarán los que trabajen cuando te toque." },
                { q: "¿Cuánto se gasta en pensiones comparado con la sanidad?", a: "Mucho más. En España las pensiones cuestan 189.598 M€ frente a los 101.739 M€ de la sanidad pública: casi el doble. En Italia la diferencia es aún mayor, 2,5 veces." },
                { q: "¿Cuánto es la pensión media?", a: "1.317,7 € al mes de media en el conjunto del sistema, y 1.512,7 € si hablamos solo de las pensiones de jubilación, que cobran dos de cada tres pensionistas. Datos de la Seguridad Social." },
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
        <Link href={it ? "/spesa-sanita/" : "/gasto-sanidad/"} className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("El dinero de la sanidad →", "I soldi della sanità →")}
        </Link>
        <Link href={it ? "/debito-pubblico/" : "/deuda-nacional/"} className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("¿Cuánto debe el Estado?", "Quanto deve lo Stato?")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function PensioniClient({ locale }: { locale?: "es" | "it" }) {
  return (
    <LocaleProvider force={locale}>
      <Inner />
    </LocaleProvider>
  );
}
