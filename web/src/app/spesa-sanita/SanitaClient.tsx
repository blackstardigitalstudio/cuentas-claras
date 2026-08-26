"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import ShareFact from "@/components/ShareFact";

// Cifre UFFICIALI.
// 🇪🇸 Ministerio de Sanidad — Estadística de Gasto Sanitario Público (EGSP) 2024:
//    101.739 M€, 6,4% del PIB, 2.084 € per abitante. Con il dettaglio per comunità.
// 🇮🇹 Documento di Finanza Pubblica 2026: spesa sanitaria prevista 148.522 M€,
//    6,4% del PIL; Fondo Sanitario Nazionale 143,1 mld.
// Anni diversi (Spagna consuntivo 2024, Italia previsione 2026): indicato sempre.
const ES_TOTAL = 101739; // milioni €
const ES_PC = 2084;
const IT_TOTAL = 148522; // milioni €
const IT_PC = 2521; // 148.522 mln / ~58,9 mln abitanti
const PCT_PIL = "6,4%";

// Spesa pubblica per abitante, per comunità autonoma (Spagna, 2024).
const ES_REGIONI = [
  { n: "País Vasco", v: 2332 },
  { n: "Asturias", v: 2322 },
  { n: "Extremadura", v: 2246 },
  { n: "Comunitat Valenciana", v: 1867 },
  { n: "Madrid", v: 1779 },
  { n: "Andalucía", v: 1658 },
];

const mld = (milioni: number, it: boolean) =>
  it ? `${(milioni / 1000).toLocaleString("it", { maximumFractionDigits: 1 })} miliardi €` : `${milioni.toLocaleString("es")} M€`;
const eur = (n: number, it: boolean) => `${n.toLocaleString(it ? "it" : "es")} €`;

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const maxR = ES_REGIONI[0].v;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/justice.jpg"
          alt={t("Hospital público", "Ospedale pubblico")}
          kicker={t("🏥 Sanidad pública · cifras oficiales", "🏥 Sanità pubblica · cifre ufficiali")}
          title={t("LA SANIDAD:", "LA SANITÀ:")}
          highlight={t("¿ADÓNDE VA EL DINERO?", "DOVE FINISCONO I SOLDI?")}
          stat={t(`${ES_TOTAL.toLocaleString("es")} M€`, "148,5 miliardi €")}
          statLabel={t("gasto público al año", "spesa pubblica all'anno")}
          accent="#34d399"
          accent2="#22d3ee"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "La sanidad es la mayor factura pública que pagas. Aquí ves cuánto cuesta de verdad, cuánto toca por persona y por qué en algunas regiones se gasta mucho más que en otras.",
            "La sanità è la bolletta pubblica più grossa che paghi. Qui vedi quanto costa davvero, quanto tocca a testa e perché in certe zone si spende molto più che in altre.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "No pagas al médico cuando vas: lo pagas todo el año con tus impuestos. Ese dinero va a un bote común y de ahí salen hospitales, ambulancias, sueldos y medicinas. Cuando alguien dice «la sanidad es gratis» quiere decir esto: ya está pagada.",
            "Non paghi il medico quando ci vai: lo paghi tutto l'anno con le tasse. Quei soldi finiscono in un salvadanaio comune e da lì escono ospedali, ambulanze, stipendi e medicine. Quando si dice «la sanità è gratis» si intende questo: è già pagata.",
          )}</p>
          <p>{t(
            "Y ojo a un detalle: una parte de la sanidad NO la paga el Estado, la pagas tú directamente de tu bolsillo (dentista, gafas, privado, medicinas). Esa parte no aparece en estas cifras.",
            "E attenzione a un dettaglio: una parte della sanità NON la paga lo Stato, la paghi tu direttamente di tasca tua (dentista, occhiali, visite private, medicine). Quella parte in queste cifre non c'è.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* I due Paesi */}
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {[
          { flag: "🇪🇸", name: t("España", "Spagna"), total: mld(ES_TOTAL, it), pc: ES_PC, year: "2024", note: t("dato definitivo", "dato definitivo"), accent: "#a5b4fc" },
          { flag: "🇮🇹", name: "Italia", total: mld(IT_TOTAL, it), pc: IT_PC, year: "2026", note: t("previsión", "previsione"), accent: "#34d399" },
        ].map((c) => (
          <div key={c.name} className="glass p-5 relative overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${c.accent},transparent)` }} />
            <p className="text-sm font-semibold">{c.flag} {c.name} <span className="text-muted font-normal">· {c.year}</span></p>
            <p className="tabular text-2xl font-bold mt-2" style={{ color: c.accent }}>{c.total}</p>
            <p className="text-[11px] text-muted">{t("de gasto sanitario público", "di spesa sanitaria pubblica")} ({c.note})</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-white/5 py-2">
                <p className="tabular font-semibold" style={{ color: c.accent }}>{PCT_PIL}</p>
                <p className="text-[10px] text-muted">{t("del PIB", "del PIL")}</p>
              </div>
              <div className="rounded-xl bg-white/5 py-2">
                <p className="tabular font-semibold" style={{ color: c.accent }}>{eur(c.pc, it)}</p>
                <p className="text-[10px] text-muted">{t("por habitante", "per abitante")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-4 mt-3 border border-cyan/25">
        <p className="text-sm">
          {t(
            "Curioso: los dos países dedican exactamente la misma parte de su economía a la sanidad pública — el 6,4%.",
            "Curioso: i due Paesi dedicano alla sanità pubblica esattamente la stessa fetta della loro economia — il 6,4%.",
          )}
        </p>
        <ShareFact
          className="mt-2"
          lang={it ? "it" : "es"}
          text={t(
            `🏥 España gasta ${ES_TOTAL.toLocaleString("es")} M€ al año en sanidad pública: ${ES_PC} € por habitante, el 6,4% del PIB. 👀 Datos oficiales`,
            `🏥 L'Italia spende 148,5 miliardi € l'anno per la sanità pubblica: circa ${IT_PC.toLocaleString("it")} € per abitante, il 6,4% del PIL. 👀 Dati ufficiali`,
          )}
        />
      </div>

      {/* Spagna: il dettaglio per regione — dato ricco e molto cercato */}
      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold">🇪🇸 {t("Cuánto se gasta en tu comunidad", "Quanto si spende in ogni comunità (Spagna)")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Gasto sanitario público por habitante, 2024. La diferencia entre la primera y la última supera los 670 €.", "Spesa sanitaria pubblica per abitante, 2024. Tra la prima e l'ultima ballano oltre 670 €.")}</p>
        <ol className="space-y-1.5">
          {ES_REGIONI.map((r, i) => (
            <li key={r.n} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-sm text-muted w-6 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium text-sm">{r.n}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-green to-cyan" style={{ width: `${(r.v / maxR) * 100}%` }} />
                </span>
              </span>
              <span className="tabular text-sm font-semibold text-green shrink-0">{eur(r.v, it)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">
          {t("Fuente: ", "Fonte: ")}<a href="https://www.sanidad.gob.es/estadEstudios/estadisticas/inforRecopilaciones/gastoSanitario2005/home.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{t("Ministerio de Sanidad, Estadística de Gasto Sanitario Público 2024", "Ministero della Salute spagnolo, Statistica della spesa sanitaria pubblica 2024")}</a>{t(". Se muestran las tres comunidades que más y las tres que menos gastan por habitante.", ". Mostrate le tre comunità che spendono di più e le tre che spendono di meno per abitante.")}
        </p>
      </section>

      {/* Quello che paghi di tasca tua */}
      <section className="mt-10 glass p-5 border border-amber-400/25">
        <h2 className="text-lg font-semibold mb-2">💸 {t("Y lo que pagas de tu bolsillo", "E quello che paghi di tasca tua")}</h2>
        <p className="text-sm text-muted">
          {t(
            "Las cifras de arriba son solo la parte pública. En España el gasto sanitario privado (dentista, gafas, seguros, medicinas) es alrededor del 26% del total. En Italia las familias se dejan directamente más de 40.000 millones de euros al año, y el gasto público cubre el 73% del total, por debajo del 80% de media europea.",
            "Le cifre qui sopra sono solo la parte pubblica. In Italia le famiglie tirano fuori dalle proprie tasche oltre 40 miliardi di euro l'anno, e la spesa pubblica copre il 73% del totale, sotto la media europea dell'80%. In Spagna la spesa sanitaria privata è circa il 26% del totale.",
          )}
        </p>
        <p className="text-[11px] text-muted mt-2">
          {t("Fuentes: ", "Fonti: ")}<a href="https://www.istat.it/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Istat</a>, <a href="https://www.upbilancio.it/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Ufficio parlamentare di bilancio</a>, <a href="https://www.sanidad.gob.es/estadEstudios/estadisticas/inforRecopilaciones/gastoSanitario2005/home.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{t("Ministerio de Sanidad (España)", "Ministero della Salute spagnolo")}</a>.
        </p>
      </section>

      <ShareBar className="mt-8" lang={it ? "it" : "es"} text={t(
        "🏥 España e Italia dedican la misma parte de su economía a la sanidad pública: el 6,4% del PIB. Pero una parte grande la pagas tú de tu bolsillo. 👀 Datos oficiales",
        "🏥 Italia e Spagna dedicano alla sanità pubblica la stessa fetta di economia: il 6,4% del PIL. Ma una bella parte la paghi tu di tasca tua. 👀 Dati ufficiali",
      )} />

      {/* FAQ dalle domande vere */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanto spende l'Italia per la sanità in un anno?", a: "Circa 148,5 miliardi di euro di spesa pubblica nel 2026 (previsione del Documento di Finanza Pubblica), pari al 6,4% del PIL. Il Fondo Sanitario Nazionale vale 143,1 miliardi. Fanno circa 2.500 € per abitante." },
                { q: "Quanto costa la sanità a ogni cittadino?", a: "Circa 2.500 € all'anno a testa in Italia e 2.084 € in Spagna, contando solo la parte pubblica. Non è un conto che ti arriva a casa: lo paghi durante l'anno con le tasse." },
                { q: "Quante tasse si pagano per la sanità?", a: "Non esiste una «tassa della sanità» separata: i soldi arrivano dal calderone generale delle tasse (IRPEF, IVA e le altre) e da lì lo Stato assegna il Fondo Sanitario alle Regioni, che gestiscono ospedali e servizi." },
                { q: "Se spendiamo tanto, perché ci sono le liste d'attesa?", a: "Perché in confronto agli altri Paesi europei spendiamo meno: la spesa pubblica copre il 73% del totale contro una media UE dell'80%. Il resto lo mettono le famiglie di tasca propria — oltre 40 miliardi l'anno." },
                { q: "Perché una regione spende più di un'altra?", a: "Perché la sanità la gestiscono le Regioni (in Spagna le comunità autonome). Pesano l'età della popolazione, il territorio e le scelte locali. In Spagna tra la prima e l'ultima ballano oltre 670 € per abitante." },
              ]
            : [
                { q: "¿Cuánto gasta España en sanidad al año?", a: "101.739 millones de euros de gasto público en 2024, el 6,4% del PIB: unos 2.084 € por habitante. Fuente: Ministerio de Sanidad (Estadística de Gasto Sanitario Público)." },
                { q: "¿Cuánto cuesta la sanidad a cada ciudadano?", a: "Unos 2.084 € al año por habitante en España y unos 2.500 € en Italia, contando solo la parte pública. No es una factura que te llegue a casa: la pagas durante el año con tus impuestos." },
                { q: "¿Qué comunidad gasta más en sanidad?", a: "País Vasco (2.332 € por habitante), seguido de Asturias (2.322 €) y Extremadura (2.246 €). Las que menos: Andalucía (1.658 €), Madrid (1.779 €) y la Comunitat Valenciana (1.867 €). Datos de 2024." },
                { q: "¿Por qué una comunidad gasta más que otra?", a: "Porque la sanidad la gestionan las comunidades autónomas (en Italia, las regiones). Influyen la edad de la población, el territorio y las decisiones de cada gobierno autonómico. Entre la primera y la última hay más de 670 € por habitante." },
                { q: "¿La sanidad es gratis?", a: "No: ya está pagada. La pagas todo el año con tus impuestos. Además, una parte la pagas directamente de tu bolsillo (dentista, gafas, seguros, medicinas): en España es alrededor del 26% del gasto sanitario total." },
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
        <Link href={it ? "/debito-pubblico/" : "/deuda-nacional/"} className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("¿Cuánto debe el Estado? →", "Quanto deve lo Stato? →")}
        </Link>
        <Link href={it ? "/stipendi-professioni/" : "/sueldos-profesiones/"} className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("¿Cuánto gana un médico?", "Quanto guadagna un medico?")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function SanitaClient({ locale }: { locale?: "es" | "it" }) {
  return (
    <LocaleProvider force={locale}>
      <Inner />
    </LocaleProvider>
  );
}
