"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Fichajes más caros de la historia (traspaso pagado, en millones de €). Cifras de
// referencia según Transfermarkt y prensa especializada (algunas incluyen variables).
const TRANSFERS = [
  { name: "Neymar", move: "Barcelona → PSG", year: 2017, fee: 222 },
  { name: "Kylian Mbappé", move: "Mónaco → PSG", year: 2018, fee: 180 },
  { name: "Philippe Coutinho", move: "Liverpool → Barcelona", year: 2018, fee: 135 },
  { name: "Ousmane Dembélé", move: "B. Dortmund → Barcelona", year: 2017, fee: 135 },
  { name: "João Félix", move: "Benfica → Atlético", year: 2019, fee: 127 },
  { name: "Enzo Fernández", move: "Benfica → Chelsea", year: 2023, fee: 121 },
  { name: "Antoine Griezmann", move: "Atlético → Barcelona", year: 2019, fee: 120 },
  { name: "Cristiano Ronaldo", move: "Real Madrid → Juventus", year: 2018, fee: 117 },
  { name: "Declan Rice", move: "West Ham → Arsenal", year: 2023, fee: 116 },
  { name: "Moisés Caicedo", move: "Brighton → Chelsea", year: 2023, fee: 116 },
  { name: "Jude Bellingham", move: "B. Dortmund → Real Madrid", year: 2023, fee: 103 },
  { name: "Gareth Bale", move: "Tottenham → Real Madrid", year: 2013, fee: 101 },
];

// Salarios: NO son oficiales. Son estimaciones de prensa, con su fuente. Se muestran
// etiquetados como tal (respondemos a la búsqueda sin presentarlos como dato cierto).
const SALARY_EST = [
  { name: "Kylian Mbappé", club: "Real Madrid", est: "~31 M€", src: "L'Équipe / prensa" },
  { name: "Vinícius Jr.", club: "Real Madrid", est: "~32 M€", src: "L'Équipe" },
  { name: "Lamine Yamal", club: "Barcelona", est: "~16,7 M€", src: "prensa (var. hasta ~20)" },
];

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const maxFee = TRANSFERS[0].fee;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/spain-stadium.jpg"
          alt={t("Estadio de fútbol", "Stadio di calcio")}
          kicker={t("⚽ El dinero de los jugadores", "⚽ I soldi dei giocatori")}
          title={t("JUGADORES:", "GIOCATORI:")}
          highlight={t("¿CUÁNTO CUESTAN?", "QUANTO COSTANO?")}
          stat="222 M€"
          statLabel={t("el fichaje más caro (Neymar, 2017)", "il trasferimento più caro (Neymar, 2017)")}
          accent="#38bdf8"
          accent2="#c084fc"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Cuánto cuesta un jugador: los fichajes más caros de la historia y las cláusulas de rescisión más altas. Y una respuesta honesta a «cuánto gana»: los salarios NO son oficiales, así que los damos como estimaciones de prensa, siempre con su fuente.",
            "Quanto costa un giocatore: i trasferimenti più cari della storia e le clausole di rescissione più alte. E una risposta onesta a «quanto guadagna»: gli stipendi NON sono ufficiali, quindi li diamo come stime di stampa, sempre con la fonte.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "Hay tres cifras que se confunden. El FICHAJE es lo que un club paga a otro por traspasar al jugador (es público). La CLÁUSULA es lo que habría que pagar para llevárselo por la fuerza (está en el contrato). El SUELDO es lo que cobra el jugador… y ese NO lo publica nadie de forma oficial: lo que circula son estimaciones.",
            "Ci sono tre cifre che si confondono. Il TRASFERIMENTO è quanto un club paga a un altro per il cartellino (è pubblico). La CLAUSOLA è quanto servirebbe per portarlo via a forza (è nel contratto). Lo STIPENDIO è quanto guadagna il giocatore… e quello NON lo pubblica nessuno ufficialmente: ciò che circola sono stime.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* Fichajes más caros */}
      <section className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold">💸 {t("Los fichajes más caros de la historia", "I trasferimenti più cari della storia")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Lo que un club pagó a otro por el traspaso, en millones de €.", "Quanto un club ha pagato a un altro per il cartellino, in milioni di €.")}</p>
        <ol className="space-y-1.5">
          {TRANSFERS.map((p, i) => (
            <li key={p.name + i} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-sm text-muted w-6 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{p.name}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-violet" style={{ width: `${Math.max(10, (p.fee / maxFee) * 100)}%` }} />
                </span>
                <span className="text-[10px] text-muted">{p.move} · {p.year}</span>
              </span>
              <span className="tabular text-sm font-semibold text-[#38bdf8] shrink-0">{p.fee} M€</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">{t("Cifras de referencia según ", "Cifre di riferimento secondo ")}
          <a href="https://www.transfermarkt.es/statistik/transferrekorde" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Transfermarkt</a>
          {t(" y prensa especializada (algunas incluyen variables).", " e stampa specializzata (alcune includono bonus).")}
        </p>
      </section>

      {/* Cláusulas */}
      <section className="mt-8 glass p-5">
        <h2 className="text-lg font-semibold mb-2">🔒 {t("Las cláusulas de rescisión más altas", "Le clausole di rescissione più alte")}</h2>
        <p className="text-sm text-muted">
          {t(
            "En LaLiga, las grandes estrellas tienen la cláusula máxima: 1.000 millones de euros. La tienen, por ejemplo, Lamine Yamal, Pedri y Gavi (Barcelona), y también se han fijado cifras astronómicas para proteger a Mbappé y Vinícius (Real Madrid). Es una barrera para que ningún club pueda llevárselos por la fuerza.",
            "In LaLiga le grandi stelle hanno la clausola massima: 1.000 milioni di euro. Ce l'hanno, per esempio, Lamine Yamal, Pedri e Gavi (Barcellona), e cifre astronomiche sono state fissate anche per proteggere Mbappé e Vinícius (Real Madrid). È una barriera perché nessun club possa portarli via a forza.",
          )}
        </p>
      </section>

      {/* Salarios (estimaciones) */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg md:text-xl font-semibold">💶 {t("¿Cuánto ganan?", "Quanto guadagnano?")}</h2>
          <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">{t("estimación · no oficial", "stima · non ufficiale")}</span>
        </div>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Ningún club publica los sueldos. Estas son estimaciones de prensa, con su fuente.", "Nessun club pubblica gli stipendi. Queste sono stime di stampa, con la fonte.")}</p>
        <div className="space-y-1.5">
          {SALARY_EST.map((p) => (
            <div key={p.name} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{p.name} <span className="text-muted font-normal">· {p.club}</span></span>
                <span className="text-[10px] text-muted">{t("fuente", "fonte")}: {p.src}</span>
              </span>
              <span className="tabular text-sm font-semibold text-amber-300 shrink-0">{p.est}<span className="text-[10px] text-muted">/{t("año", "anno")}</span></span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3">
          {t(
            "Importante: son cifras estimadas por medios (L'Équipe y otros), no datos oficiales. Las incluimos porque es lo que la gente busca, pero con la etiqueta clara de «estimación».",
            "Importante: sono cifre stimate dai media (L'Équipe e altri), non dati ufficiali. Le includiamo perché è ciò che la gente cerca, ma con l'etichetta chiara di «stima».",
          )}
        </p>
      </section>

      <ShareBar className="mt-6" text={t("⚽ El fichaje más caro de la historia: Neymar, 222 M€ (2017). Y las cláusulas de las estrellas llegan a 1.000 M€. 👀 Datos y estimaciones con fuente", "⚽ Il trasferimento più caro della storia: Neymar, 222 M€ (2017). E le clausole delle stelle arrivano a 1.000 M€. 👀 Dati e stime con fonte")} />

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Qual è il trasferimento più caro della storia?", a: "Neymar, dal Barcellona al PSG nel 2017, per 222 milioni di euro: il PSG pagò la sua clausola di rescissione. Al secondo posto Mbappé (180 mln, dal Monaco al PSG nel 2018)." },
                { q: "Quanto guadagna Mbappé / Vinícius / Lamine Yamal?", a: "Non esiste una cifra ufficiale (nessun club pubblica gli stipendi). Le stime di stampa parlano di ~31 mln €/anno per Mbappé, ~32 mln per Vinícius e ~16,7 mln per Lamine Yamal. Sono stime, non dati ufficiali." },
                { q: "Cos'è una clausola di rescissione?", a: "È l'importo scritto nel contratto che un club dovrebbe pagare per portare via il giocatore contro la volontà del suo club. In LaLiga le grandi stelle hanno la clausola massima: 1.000 milioni di euro." },
                { q: "Perché non pubblicate gli stipendi come dati certi?", a: "Perché non sono ufficiali. La nostra regola è pubblicare solo dati verificabili; gli stipendi li diamo come stime, sempre etichettate e con la fonte." },
              ]
            : [
                { q: "¿Cuál es el fichaje más caro de la historia?", a: "Neymar, del Barcelona al PSG en 2017, por 222 millones de euros: el PSG pagó su cláusula de rescisión. En segundo lugar, Mbappé (180 mln, del Mónaco al PSG en 2018)." },
                { q: "¿Cuánto gana Mbappé / Vinícius / Lamine Yamal?", a: "No hay una cifra oficial (ningún club publica los sueldos). Las estimaciones de prensa hablan de ~31 mln €/año para Mbappé, ~32 mln para Vinícius y ~16,7 mln para Lamine Yamal. Son estimaciones, no datos oficiales." },
                { q: "¿Qué es una cláusula de rescisión?", a: "Es el importe escrito en el contrato que un club tendría que pagar para llevarse al jugador contra la voluntad de su club. En LaLiga las grandes estrellas tienen la cláusula máxima: 1.000 millones de euros." },
                { q: "¿Por qué no publicáis los sueldos como datos ciertos?", a: "Porque no son oficiales. Nuestra regla es publicar solo datos verificables; los sueldos los damos como estimaciones, siempre etiquetadas y con su fuente." },
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
        <Link href="/futbol/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("⚽ Los clubes (LaLiga, Serie A) →", "⚽ I club (LaLiga, Serie A) →")}
        </Link>
        <Link href="/champions-league/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("Los premios de la Champions", "I premi della Champions")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function JugadoresClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
