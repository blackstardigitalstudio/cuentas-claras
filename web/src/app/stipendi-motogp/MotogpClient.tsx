"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
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

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const lc = it ? "it" : "es";
  const mln = (n: number) => `${n.toLocaleString(lc, { maximumFractionDigits: 1 })} mln €`;
  const max = STIME[0].mln;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/italy-stadium.jpg"
          alt={t("Circuito de MotoGP", "Circuito di MotoGP")}
          kicker={t("🏍️ MotoGP · el dinero de los pilotos", "🏍️ MotoGP · i soldi dei piloti")}
          title={t("¿CUÁNTO GANA", "QUANTO GUADAGNA")}
          highlight={t("UN PILOTO DE MOTOGP?", "UN PILOTA MOTOGP?")}
          stat="12 mln €"
          statLabel={t("los mejor pagados (estimación) — ¿y el mínimo?", "i più pagati (stima) — e il minimo?")}
          accent="#f43f5e"
          accent2="#fbbf24"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "¿Cuánto cobran de verdad los pilotos de MotoGP? Los equipos no publican los contratos: lo que circula son estimaciones. Aquí te las damos con la fuente — y te decimos el único dato seguro.",
            "Quanto prendono davvero i piloti della MotoGP? I team non pubblicano gli ingaggi: quello che gira sono stime. Qui te le diamo con la fonte — e ti diciamo l'unico dato certo.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>
            {t("Un piloto gana de tres maneras: el ", "Un pilota guadagna in tre modi: l'")}
            <b className="text-fg/90">{t("sueldo", "ingaggio")}</b>
            {t(" que le paga el equipo, los ", " che gli paga il team, i ")}
            <b className="text-fg/90">{t("premios", "premi")}</b>
            {t(" si va rápido, y los ", " se va forte, e gli ")}
            <b className="text-fg/90">{t("patrocinadores", "sponsor")}</b>
            {t(
              " personales (casco, mono, imagen). Ninguno de esos números es público: los contratos son privados. Por eso aquí encuentras estimaciones, no certezas — y te lo decimos claramente.",
              " personali (casco, tuta, immagine). Nessuno di questi numeri è pubblico: i contratti sono privati. Per questo qui trovi stime, non certezze — e te lo diciamo chiaramente.",
            )}
          </p>
        </SimpleExplainer>
      </div>

      {/* L'unico dato UFFICIALE */}
      <section className="mt-8 glass p-5 border border-green/25">
        <h2 className="text-lg font-semibold mb-2">
          {t("✅ El único dato seguro: el salario mínimo", "✅ L'unico dato certo: il salario minimo")}
        </h2>
        <p className="text-sm text-muted">
          {t("Desde ", "Dal ")}
          <b className="text-fg/90">2027</b>
          {t(" MotoGP introduce un ", " la MotoGP introduce un ")}
          <b className="text-fg/90">
            {t(
              `salario mínimo garantizado de ${MIN_2027.toLocaleString("es")} € al año`,
              `salario minimo garantito di ${MIN_2027.toLocaleString("it")} € l'anno`,
            )}
          </b>
          {t(
            " para todos los pilotos a tiempo completo, novatos incluidos. Lo decide el campeonato, así que es verificable: hasta hoy un piloto del fondo de la parrilla podía ganar mucho menos.",
            " per tutti i piloti a tempo pieno, rookie compresi. È una misura decisa dal campionato, quindi verificabile: fino a oggi un pilota di fondo griglia poteva guadagnare molto meno di così.",
          )}
        </p>
      </section>

      {/* Le stime, etichettate */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg md:text-xl font-semibold">{t("🏍️ Cuánto ganan los pilotos", "🏍️ Quanto guadagnano i piloti")}</h2>
          <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
            {t("estimación · no oficial", "stima · non ufficiale")}
          </span>
        </div>
        <p className="text-[11px] text-cyan/70 mb-4">
          {t(
            "Sueldo anual estimado por la prensa especializada. Los equipos no publican los contratos.",
            "Ingaggio annuo stimato dalla stampa specializzata. I team non pubblicano i contratti.",
          )}
        </p>
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
          {t(
            "Estimaciones coincidentes entre varios medios especializados (Money.it, QuiFinanza, OA Sport, Sport e Finanza), temporada 2026. No son datos oficiales: ningún equipo publica los sueldos.",
            "Stime coerenti tra più testate specializzate (Money.it, QuiFinanza, OA Sport, Sport e Finanza), stagione 2026. Non sono dati ufficiali: nessun team pubblica gli ingaggi.",
          )}
        </p>
      </section>

      <div className="mt-6 glass p-4 border border-amber-400/25">
        <p className="text-xs text-amber-200/90">
          {t(
            "⚠️ Por qué insistimos: en esta web los datos públicos (presupuestos, deuda, sueldos de alcaldes) son oficiales y verificables. Los sueldos deportivos ",
            "⚠️ Perché insistiamo: su questo sito i dati pubblici (bilanci, debiti, indennità dei sindaci) sono ufficiali e verificabili. Gli ingaggi sportivi ",
          )}
          <b>{t("no", "no")}</b>
          {t(
            ": circulan estimaciones, a menudo distintas entre sí. Te los damos igual porque es lo que buscas, pero con la etiqueta correcta — nunca como si fueran seguros.",
            ": girano stime, spesso diverse tra loro. Te li diamo lo stesso perché è quello che cerchi, ma con l'etichetta giusta — mai spacciati per certi.",
          )}
        </p>
      </div>

      <ShareBar
        className="mt-6"
        lang={lc}
        text={t(
          "🏍️ ¿Cuánto gana un piloto de MotoGP? Los mejor pagados llegan a ~12 millones € (estimación), pero desde 2027 habrá un salario mínimo garantizado de 500.000 €. 👀",
          "🏍️ Quanto guadagna un pilota MotoGP? I più pagati arrivano a ~12 milioni € (stima), ma dal 2027 arriva un salario minimo garantito di 500.000 €. 👀",
        )}
      />

      {/* FAQ dalle domande vere di Google */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Chi è il pilota più pagato in MotoGP?", a: "Secondo le stime della stampa specializzata, Marc Márquez (Ducati) e Fabio Quartararo (Yamaha), entrambi intorno ai 12 milioni di euro l'anno. Sono stime: i team non pubblicano gli ingaggi." },
                { q: "Quanto guadagna Bagnaia in Ducati?", a: "Le stime parlano di circa 7 milioni di euro a stagione per Francesco Bagnaia. Anche questa non è una cifra ufficiale, ma è coerente tra più fonti specializzate." },
                { q: "Qual è lo stipendio minimo in MotoGP?", a: "Dal 2027 entra in vigore un salario minimo garantito di 500.000 € l'anno per tutti i piloti a tempo pieno, rookie compresi. È una misura del campionato, quindi un dato certo. Prima di allora un pilota di fondo griglia poteva guadagnare molto meno." },
                { q: "Perché non ci sono cifre ufficiali sugli stipendi dei piloti?", a: "Perché i contratti tra pilota e team sono privati e nessuno è obbligato a pubblicarli — al contrario dei soldi pubblici, che per legge devono essere trasparenti. Per questo etichettiamo queste cifre come stime." },
                { q: "Come guadagna un pilota oltre all'ingaggio?", a: "Con i premi legati ai risultati e soprattutto con gli sponsor personali (casco, tuta, immagine), che per i piloti più famosi possono valere quanto l'ingaggio stesso." },
              ]
            : [
                { q: "¿Quién es el piloto mejor pagado de MotoGP?", a: "Según las estimaciones de la prensa especializada, Marc Márquez (Ducati) y Fabio Quartararo (Yamaha), ambos en torno a los 12 millones de euros al año. Son estimaciones: los equipos no publican los sueldos." },
                { q: "¿Cuánto gana Bagnaia en Ducati?", a: "Las estimaciones hablan de unos 7 millones de euros por temporada para Francesco Bagnaia. Tampoco es una cifra oficial, pero coincide entre varias fuentes especializadas." },
                { q: "¿Cuál es el sueldo mínimo en MotoGP?", a: "Desde 2027 entra en vigor un salario mínimo garantizado de 500.000 € al año para todos los pilotos a tiempo completo, novatos incluidos. Lo decide el campeonato, así que es un dato seguro. Hasta entonces un piloto del fondo de la parrilla podía ganar mucho menos." },
                { q: "¿Por qué no hay cifras oficiales de los sueldos de los pilotos?", a: "Porque los contratos entre piloto y equipo son privados y nadie está obligado a publicarlos — al contrario que el dinero público, que por ley debe ser transparente. Por eso etiquetamos estas cifras como estimaciones." },
                { q: "¿Cómo gana un piloto además del sueldo?", a: "Con los premios ligados a los resultados y sobre todo con los patrocinadores personales (casco, mono, imagen), que para los pilotos más famosos pueden valer tanto como el propio sueldo." },
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
        <Link href={it ? "/soldi-giocatori/" : "/jugadores/"} className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("⚽ El dinero de los futbolistas →", "⚽ I soldi dei calciatori →")}
        </Link>
        <Link href={it ? "/calcio/" : "/futbol/"} className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("Las cuentas de los clubes", "I conti dei club")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · {t("Hecho en Italia", "Made in Italy")} 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function MotogpClient({ locale = "it" }: { locale?: "es" | "it" }) {
  return (
    <LocaleProvider force={locale}>
      <Inner />
    </LocaleProvider>
  );
}
