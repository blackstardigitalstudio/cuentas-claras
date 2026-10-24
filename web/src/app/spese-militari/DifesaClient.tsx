"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import ShareFact from "@/components/ShareFact";
import ScoopSection from "@/components/ScoopSection";
import { FONTI } from "@/lib/jsonld";
import {
  ANNI, IT_SERIE, ES_SERIE, PIL, MILITARI, ABITANTI, VOCI, PIANO_ES, PIANO_ES_TOTALE, SIPRI, OBIETTIVO,
  FAQ_IT, FAQ_ES, ultimo, penultimo, aTesta, type Voci,
} from "./dati";

// Spesa militare (difesa, armi, soldati) di Italia e Spagna. Cifre NATO, SIPRI e
// La Moncloa: il dettaglio delle fonti è in ./dati.ts.

const mld = (milioni: number, it: boolean) =>
  it ? `${(milioni / 1000).toLocaleString("it", { maximumFractionDigits: 1 })} miliardi €` : `${milioni.toLocaleString("es", { maximumFractionDigits: 0 })} M€`;
const eur = (n: number, it: boolean) => `${n.toLocaleString(it ? "it" : "es")} €`;

const IT_TOT = ultimo(IT_SERIE);
const ES_TOT = ultimo(ES_SERIE);
const IT_SALTO = IT_TOT - penultimo(IT_SERIE);
const ES_SALTO = ES_TOT - penultimo(ES_SERIE);
const MAX = Math.max(...IT_SERIE, ...ES_SERIE);

function Fonte({ f, label }: { f: { url: string }; label: string }) {
  return <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{label}</a>;
}

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);

  // Dove vanno i soldi: dalla percentuale NATO ai milioni (calcolo semplice, dichiarato).
  const voci = (v: Voci, tot: number) => [
    { k: t("Personas: sueldos y pensiones", "Persone: stipendi e pensioni"), sub: t("militares y civiles", "militari e civili"), p: v.persone, m: (tot * v.persone) / 100, c: "#a5b4fc" },
    { k: t("Armas y equipo", "Armi e mezzi"), sub: t("aviones, barcos, blindados, investigación", "aerei, navi, blindati, ricerca"), p: v.armi, m: (tot * v.armi) / 100, c: "#f43f5e" },
    { k: t("Funcionamiento y misiones", "Funzionamento e missioni"), sub: t("combustible, mantenimiento, operaciones, lo no desglosado", "carburante, manutenzione, operazioni, il non dettagliato"), p: v.altro, m: (tot * v.altro) / 100, c: "#fbbf24" },
    { k: t("Cuarteles y bases", "Caserme e basi"), sub: t("obras e infraestructura OTAN", "lavori e infrastrutture NATO"), p: v.infra, m: (tot * v.infra) / 100, c: "#34d399" },
  ];

  const paesi = [
    { cls: "country-es", flag: "🇪🇸", name: t("España", "Spagna"), tot: ES_TOT, pil: PIL.es[2025], testa: aTesta(ES_TOT, ABITANTI.es), mil: MILITARI.es, accent: "#fbbf24" },
    { cls: "country-it", flag: "🇮🇹", name: "Italia", tot: IT_TOT, pil: PIL.it[2025], testa: aTesta(IT_TOT, ABITANTI.it), mil: MILITARI.it, accent: "#f43f5e" },
  ];

  const faq = it ? FAQ_IT : FAQ_ES;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/money.jpg"
          alt={t("Dinero público para defensa", "Soldi pubblici per la difesa")}
          kicker={t("🪖 Defensa y armamento · cifras oficiales", "🪖 Difesa e armi · cifre ufficiali")}
          title={t("EL GASTO MILITAR:", "LE SPESE MILITARI:")}
          highlight={t("¿ADÓNDE VA EL DINERO?", "DOVE FINISCONO I SOLDI?")}
          stat={it ? mld(IT_TOT, true) : mld(ES_TOT, false)}
          statLabel={t("en defensa en 2025", "per la difesa nel 2025")}
          accent="#f43f5e"
          accent2="#fbbf24"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Se habla de guerra, de rearme y del 5% de la OTAN. Pero ¿cuánto dinero público va de verdad a ejércitos y armas? Aquí lo tienes, año a año, con la fuente.",
            "Si parla di guerra, di riarmo e del 5% della NATO. Ma quanti soldi pubblici vanno davvero a eserciti e armi? Eccoli qui, anno per anno, con la fonte.",
          )}
        </p>
      </header>

      <div className="mt-5" data-claro="explainer">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "El gasto en defensa no son solo tanques y aviones. La parte más grande suele ser la gente: el sueldo de cada soldado y la pensión de quien ya se ha jubilado.",
            "La spesa per la difesa non sono solo carri armati e aerei. La fetta più grossa di solito sono le persone: lo stipendio di ogni soldato e la pensione di chi ha smesso.",
          )}</p>
          <p>{t(
            "Luego están las armas, el combustible, el mantenimiento y las misiones en el extranjero. La OTAN lo suma todo con la misma regla para todos los países. Por eso sus cifras son más altas que el presupuesto del Ministerio de Defensa.",
            "Poi ci sono le armi, il carburante, la manutenzione e le missioni all'estero. La NATO somma tutto con la stessa regola per tutti i Paesi. Per questo i suoi numeri sono più alti del bilancio del Ministero della Difesa.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* I due Paesi */}
      <div className="country-flip gap-3 mt-6 sm:grid sm:grid-cols-2">
        {paesi.map((c) => (
          <div key={c.name} className={`${c.cls} glass p-5 relative overflow-hidden`}>
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${c.accent},transparent)` }} />
            <p className="text-sm font-semibold">{c.flag} {c.name} <span className="text-muted font-normal">· 2025</span></p>
            <p className="tabular text-2xl font-bold mt-2" style={{ color: c.accent }}>{mld(c.tot, it)}</p>
            <p className="text-[11px] text-muted">{t("de gasto en defensa (estimación OTAN)", "di spesa per la difesa (stima NATO)")}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/5 py-2">
                <p className="tabular font-semibold" style={{ color: c.accent }}>{c.pil}</p>
                <p className="text-[10px] text-muted">{t("del PIB", "del PIL")}</p>
              </div>
              <div className="rounded-xl bg-white/5 py-2">
                <p className="tabular font-semibold" style={{ color: c.accent }}>~{eur(c.testa, it)}</p>
                <p className="text-[10px] text-muted">{t("por habitante", "a testa")}</p>
              </div>
              <div className="rounded-xl bg-white/5 py-2">
                <p className="tabular font-semibold" style={{ color: c.accent }}>{Math.round(c.mil * 1000).toLocaleString(it ? "it" : "es")}</p>
                <p className="text-[10px] text-muted">{t("militares", "militari")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Il salto di un anno: la notizia vera */}
      <div className="glass p-4 mt-3 border border-rose-400/25">
        <p className="text-sm">
          {t(
            `En un solo año, de 2024 a 2025, España sumó ${mld(ES_SALTO, false)} más en defensa. Italia, ${mld(IT_SALTO, false)} más. Nunca habían subido tanto de golpe.`,
            `In un anno solo, dal 2024 al 2025, l'Italia ha messo ${mld(IT_SALTO, true)} in più nella difesa. La Spagna ${mld(ES_SALTO, true)} in più. Non erano mai saliti così tanto di colpo.`,
          )}
        </p>
        <ShareFact
          className="mt-2"
          lang={it ? "it" : "es"}
          text={t(
            `🪖 España gastó ${ES_TOT.toLocaleString("es")} M€ en defensa en 2025: ${ES_SALTO.toLocaleString("es")} M€ más que el año anterior. En 2014 eran ${ES_SERIE[0].toLocaleString("es")} M€. 👀 Datos OTAN`,
            `🪖 L'Italia ha speso 45,3 miliardi € per la difesa nel 2025: 12,6 miliardi in più dell'anno prima. Nel 2014 erano 18,4. 👀 Dati NATO`,
          )}
        />
      </div>

      {/* Anno per anno: la gente cerca "ultimi 10 anni" / "por años" */}
      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold">📈 {t("Año a año, desde 2014", "Anno per anno, dal 2014")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">
          {t(
            `Millones de euros de cada año. En 2014 España gastaba el ${PIL.es[2014]} del PIB e Italia el ${PIL.it[2014]}. Hoy, las dos rondan el 2%.`,
            `Miliardi di euro di ogni anno. Nel 2014 l'Italia spendeva l'${PIL.it[2014]} del PIL e la Spagna lo ${PIL.es[2014]}. Oggi tutte e due sono intorno al 2%.`,
          )}
        </p>
        <div className="flex gap-4 text-[11px] text-muted mb-2">
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded-full bg-[#f43f5e]" /> Italia</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded-full bg-[#fbbf24]" /> {t("España", "Spagna")}</span>
        </div>
        <ol className="space-y-1.5">
          {ANNI.map((anno, i) => (
            <li key={anno} className="glass flex items-center gap-3 px-3 py-2">
              <span className="tabular text-sm text-muted w-10 shrink-0">{anno}</span>
              <span className="flex-1 min-w-0 space-y-1">
                <span className="flex items-center gap-2">
                  <span className="block h-2 rounded-full bg-[#f43f5e]" style={{ width: `${(IT_SERIE[i] / MAX) * 100}%` }} />
                  <span className="tabular text-[11px] text-muted shrink-0">{mld(IT_SERIE[i], it)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="block h-2 rounded-full bg-[#fbbf24]" style={{ width: `${(ES_SERIE[i] / MAX) * 100}%` }} />
                  <span className="tabular text-[11px] text-muted shrink-0">{mld(ES_SERIE[i], it)}</span>
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">
          {t("Fuente: ", "Fonte: ")}<Fonte f={FONTI.nato} label={t("OTAN, Defence Expenditure of NATO Countries (2014-2025)", "NATO, Defence Expenditure of NATO Countries (2014-2025)")} />
          {t(". Precios de cada año. 2024 y 2025 son estimaciones de la OTAN.", ". Prezzi di ogni anno. 2024 e 2025 sono stime della NATO.")}
        </p>
      </section>

      {/* Dove vanno i soldi */}
      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold">🧾 {t("¿En qué se gasta?", "Per cosa si spende?")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Reparto del gasto de 2025, según la OTAN.", "Come si divide la spesa del 2025, secondo la NATO.")}</p>
        <div className="country-flip gap-4 sm:grid sm:grid-cols-2">
          {[
            { cls: "country-es", flag: "🇪🇸", name: t("España", "Spagna"), rows: voci(VOCI.es[2025], ES_TOT) },
            { cls: "country-it", flag: "🇮🇹", name: "Italia", rows: voci(VOCI.it[2025], IT_TOT) },
          ].map((p) => (
            <div key={p.name} className={`${p.cls} glass p-4`}>
              <p className="text-sm font-semibold mb-3">{p.flag} {p.name}</p>
              <ul className="space-y-3">
                {p.rows.map((r) => (
                  <li key={r.k}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium">{r.k}</span>
                      <span className="tabular text-sm font-semibold shrink-0" style={{ color: r.c }}>{mld(Math.round(r.m), it)}</span>
                    </div>
                    <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <span className="block h-full rounded-full" style={{ width: `${r.p}%`, background: r.c }} />
                    </span>
                    <span className="text-[11px] text-muted">{r.sub} · {r.p.toLocaleString(it ? "it" : "es")}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Il trucco: dove è finito il salto */}
      <section className="mt-10 glass p-5 border border-amber-400/25">
        <h2 className="text-lg font-semibold mb-2">🔍 {t("El truco: ¿de dónde sale el salto?", "Il trucco: da dove esce il salto?")}</h2>
        <div className="country-flip gap-4">
          <div className="country-es text-sm text-muted space-y-2">
            <p className="font-semibold text-fg">🇪🇸 {t("España", "Spagna")}</p>
            <p>{t(
              `El salto viene de un plan de ${PIANO_ES_TOTALE.toLocaleString("es")} M€ aprobado en abril de 2025, sin pasar por el Congreso. Solo uno de cada cinco euros va a armas nuevas. Casi otro tanto va a emergencias como inundaciones e incendios.`,
              `Il salto arriva da un piano da ${(PIANO_ES_TOTALE / 1000).toLocaleString("it", { maximumFractionDigits: 1 })} miliardi approvato ad aprile 2025, senza passare dal Parlamento. Solo un euro su cinque va in armi nuove. Quasi altrettanto va alle emergenze, come alluvioni e incendi.`,
            )}</p>
            <ul className="space-y-1.5 pt-1">
              {PIANO_ES.map((r) => (
                <li key={r.es} className="flex items-baseline justify-between gap-2">
                  <span>{it ? r.it : r.es}</span>
                  <span className="tabular font-semibold text-amber-300 shrink-0">{mld(Math.round(r.v), it)} · {r.p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="country-it text-sm text-muted space-y-2">
            <p className="font-semibold text-fg">🇮🇹 Italia</p>
            <p>{t(
              `De 2024 a 2025 la partida «funcionamiento y lo no desglosado» pasó de ${mld(Math.round((IT_SERIE[10] * VOCI.it[2024].altro) / 100), false)} a ${mld(Math.round((IT_TOT * VOCI.it[2025].altro) / 100), false)}. Es el cajón más grande del aumento, y la OTAN no explica qué hay dentro.`,
              `Dal 2024 al 2025 il cassetto «funzionamento e non dettagliato» è passato da ${mld(Math.round((IT_SERIE[10] * VOCI.it[2024].altro) / 100), true)} a ${mld(Math.round((IT_TOT * VOCI.it[2025].altro) / 100), true)}. È il pezzo più grosso dell'aumento, e la NATO non dice cosa c'è dentro.`,
            )}</p>
            <p>{t(
              "El Gobierno anunció que contaría como defensa gastos que antes no lo eran. Y el SIPRI cuenta que Italia intentó meter en la cuenta hasta el puente sobre el estrecho de Mesina.",
              "Il governo aveva annunciato che avrebbe contato come difesa spese che prima non lo erano. E il SIPRI racconta che l'Italia ha provato a metterci dentro perfino il Ponte sullo Stretto.",
            )}</p>
          </div>
        </div>
        <p className="text-[11px] text-muted mt-3">
          {t("Fuentes: ", "Fonti: ")}<Fonte f={FONTI.nato} label={t("OTAN (tablas 8a y 8b)", "NATO (tabelle 8a e 8b)")} />, <Fonte f={FONTI.sipri} label="SIPRI 2025" />, <Fonte f={FONTI.moncloaDefensa} label={t("La Moncloa, Plan de Seguridad y Defensa", "La Moncloa, Piano per la sicurezza e la difesa")} />, <a href="https://www.ilpost.it/2025/04/17/italia-spesa-militare-2-per-cento-pil/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Il Post</a>.
          {t(" El cuadro del plan no suma 100%: incluye un ajuste negativo del 5% sobre programas anteriores.", " Le voci del piano non fanno 100%: c'è un taglio del 5% su programmi già avviati.")}
        </p>
      </section>

      {/* Il 5% NATO */}
      <section className="mt-10 glass p-5 border border-cyan/25">
        <h2 className="text-lg font-semibold mb-2">🎯 {t("¿Y el 5% de la OTAN?", "E il 5% della NATO?")}</h2>
        <p className="text-sm text-muted">{t(
          "En junio de 2025 los países de la OTAN prometieron llegar al 5% del PIB en 2035. Un 3,5% para defensa pura. Un 1,5% para cosas relacionadas: carreteras y puentes útiles al ejército, ciberseguridad, industria.",
          "Nel giugno 2025 i Paesi NATO hanno promesso di arrivare al 5% del PIL entro il 2035. Il 3,5% per la difesa vera. L'1,5% per cose collegate: strade e ponti utili all'esercito, sicurezza informatica, industria.",
        )}</p>
        <div className="country-flip gap-2 mt-3 sm:grid sm:grid-cols-2">
          <div className="country-es rounded-xl bg-white/5 p-3">
            <p className="text-sm font-semibold">🇪🇸 {t("España", "Spagna")}</p>
            <p className="text-sm text-muted">{t("Con el 3,5%:", "Con il 3,5%:")} <span className="tabular font-semibold text-fg">~{mld(OBIETTIVO.es.core, it)}</span> {t("al año", "l'anno")}</p>
            <p className="text-sm text-muted">{t("España pidió flexibilidad: dice que con un 2,1% cumple lo que le toca.", "La Spagna ha chiesto flessibilità: dice che con il 2,1% fa la sua parte.")}</p>
          </div>
          <div className="country-it rounded-xl bg-white/5 p-3">
            <p className="text-sm font-semibold">🇮🇹 Italia</p>
            <p className="text-sm text-muted">{t("Con el 3,5%:", "Con il 3,5%:")} <span className="tabular font-semibold text-fg">~{mld(OBIETTIVO.it.core, it)}</span> {t("al año", "l'anno")}</p>
            <p className="text-sm text-muted">{t("Con el 5%:", "Con il 5%:")} <span className="tabular font-semibold text-fg">~{mld(OBIETTIVO.it.tot, it)}</span></p>
          </div>
        </div>
        <p className="text-[11px] text-muted mt-3">{t(
          "Cálculo nuestro: el PIB de 2025 que se deduce de los datos OTAN, por el porcentaje. Sirve para hacerse una idea, no es una cifra oficial.",
          "Calcolo nostro: il PIL 2025 che si ricava dai dati NATO, per la percentuale. Serve a farsi un'idea, non è una cifra ufficiale.",
        )}</p>
      </section>

      {/* Nel mondo */}
      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold mb-2">🌍 {t("¿Y en el mundo?", "E nel mondo?")}</h2>
        <p className="text-sm text-muted">{t(
          `En 2025 el mundo gastó ${SIPRI.mondo.toLocaleString("es")} mil millones de dólares en armas y ejércitos, el récord de siempre. Italia es el país número ${SIPRI.itPosto} que más gasta. España, el ${SIPRI.esPosto}: la que más subió de los grandes, un 50% en un año.`,
          `Nel 2025 il mondo ha speso ${SIPRI.mondo.toLocaleString("it")} miliardi di dollari in armi ed eserciti, il record di sempre. L'Italia è il ${SIPRI.itPosto}° Paese che spende di più. La Spagna il ${SIPRI.esPosto}°: quella che è salita di più tra i grandi, +50% in un anno.`,
        )}</p>
        {!it && (
          <p className="text-sm text-muted mt-2">
            {`¿Y Marruecos? Según el SIPRI gastó ${SIPRI.maroccoMld.toLocaleString("es")} mil millones de dólares en 2025. España, ${SIPRI.esMld.toLocaleString("es")} mil millones: unas seis veces más.`}
          </p>
        )}
        <p className="text-[11px] text-muted mt-2">{t("Fuente: ", "Fonte: ")}<Fonte f={FONTI.sipri} label="SIPRI, Trends in World Military Expenditure 2025" />{t(". El SIPRI cuenta con un método propio: sus cifras no coinciden del todo con las de la OTAN.", ". Il SIPRI usa un metodo suo: i suoi numeri non coincidono del tutto con quelli NATO.")}</p>
      </section>

      <ShareBar className="mt-8" lang={it ? "it" : "es"} text={t(
        `🪖 España gastó ${ES_TOT.toLocaleString("es")} M€ en defensa en 2025, el triple que en 2014. Y solo uno de cada cinco euros del nuevo plan va a armas. 👀 Datos oficiales`,
        "🪖 L'Italia ha speso 45,3 miliardi per la difesa nel 2025: due volte e mezzo il 2014. E 12,6 miliardi in più in un anno solo. 👀 Dati ufficiali",
      )} />

      {/* Le notizie su guerra e armi (titoli dei giornali, aggiornati ogni 2 ore) */}
      <ScoopSection theme="defense" max={4} badge={t("Noticia", "Notizia")} />
      <p className="text-[11px] text-muted mt-2">{t(
        "Titulares de los medios, con el enlace a la fuente. Se actualizan solos varias veces al día.",
        "Titoli dei giornali, con il link alla fonte. Si aggiornano da soli più volte al giorno.",
      )}</p>

      {/* FAQ dalle ricerche vere (suggerimenti di Google) */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {faq.map((f, i) => (
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
        <Link href={it ? "/spesa-sanita/" : "/gasto-sanidad/"} className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("¿Y en sanidad cuánto?", "E per la sanità quanto?")}
        </Link>
        <Link href={it ? "/scandali-soldi-pubblici/" : "/escandalos/"} className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("Todas las noticias", "Tutte le notizie")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function DifesaClient({ locale }: { locale?: "es" | "it" }) {
  return (
    <LocaleProvider force={locale}>
      <Inner />
    </LocaleProvider>
  );
}
