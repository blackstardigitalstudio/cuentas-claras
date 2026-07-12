"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Cifras OFICIALES de la UEFA — Champions League 2025/26 (nuevo formato de 36
// clubes). En euros. Fuente: UEFA (reparto confirmado ago. 2025).
const eur = (m: number, it: boolean) => `${m.toLocaleString(it ? "it" : "es", { maximumFractionDigits: 2 })} mln €`;

// Bonus por fase de la eliminatoria (además de lo de la fase liga).
const STAGES = [
  { es: "Playoff (repesca)", it: "Playoff (spareggio)", amount: 1, tier: "PO" },
  { es: "Octavos de final", it: "Ottavi di finale", amount: 11, tier: "R16" },
  { es: "Cuartos de final", it: "Quarti di finale", amount: 12.5, tier: "QF" },
  { es: "Semifinales", it: "Semifinali", amount: 15, tier: "SF" },
  { es: "Jugar la final", it: "Giocare la finale", amount: 18.5, tier: "FIN" },
  { es: "Ganar la Champions", it: "Vincere la Champions", amount: 6.5, tier: "🏆" },
];

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const max = Math.max(...STAGES.map((s) => s.amount));

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/italy-stadium.jpg"
          alt={t("Estadio de Champions League", "Stadio di Champions League")}
          kicker={t("🏆 Champions League 2025/26 · cifras oficiales UEFA", "🏆 Champions League 2025/26 · cifre ufficiali UEFA")}
          title={t("LA CHAMPIONS:", "LA CHAMPIONS:")}
          highlight={t("CUÁNTO SE GANA", "QUANTO SI GUADAGNA")}
          stat="18,62 mln €"
          statLabel={t("solo por participar (por club)", "solo per partecipare (per club)")}
          accent="#60a5fa"
          accent2="#a78bfa"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Cuánto reparte la UEFA en la Champions League 2025/26: lo que cobra un club solo por participar, por cada victoria y por cada ronda. Solo cifras oficiales de la UEFA.",
            "Quanto distribuisce la UEFA in Champions League 2025/26: quanto prende un club solo per partecipare, per ogni vittoria e per ogni turno. Solo cifre ufficiali UEFA.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "La UEFA paga a los clubes de dos formas: una parte fija por estar (y por ganar partidos en la fase liga) y otra por cuánto avanzan en la eliminatoria. Cuanto más lejos llegas, más cobras. El bote total es enorme.",
            "La UEFA paga ai club in due modi: una parte fissa per esserci (e per vincere partite nella fase campionato) e un'altra in base a quanto avanzano negli scontri diretti. Più vai avanti, più incassi. Il montepremi totale è enorme.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { v: "18,62 mln €", l: t("Solo por participar", "Solo per partecipare"), c: "#60a5fa" },
          { v: "2,1 mln €", l: t("Por cada victoria", "Per ogni vittoria"), c: "#34d399" },
          { v: "2.467 M€", l: t("Reparte la UEFA (total)", "Distribuisce la UEFA (totale)"), c: "#a78bfa" },
        ].map((k) => (
          <div key={k.l} className="glass p-4 text-center">
            <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
            <p className="text-[11px] text-muted mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      {/* Fase liga */}
      <section className="mt-8 glass p-5">
        <h2 className="text-lg font-semibold mb-2">💶 {t("La fase liga (36 clubes)", "La fase campionato (36 club)")}</h2>
        <p className="text-sm text-muted">
          {t(
            "Cada club recibe 18,62 mln € solo por entrar. Además, 2,1 mln € por cada victoria y 700.000 € por cada empate. Y un bono por la clasificación final de la fase liga: desde 275.000 € (último) hasta 9,9 mln € (primero).",
            "Ogni club riceve 18,62 mln € solo per entrare. In più, 2,1 mln € per ogni vittoria e 700.000 € per ogni pareggio. E un bonus in base alla classifica finale della fase campionato: da 275.000 € (ultimo) fino a 9,9 mln € (primo).",
          )}
        </p>
      </section>

      {/* Premios por fase eliminatoria */}
      <section className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold">🏆 {t("Cuánto gana en cada ronda", "Quanto guadagna in ogni turno")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Bono de la UEFA por avanzar en la eliminatoria (se suma a la fase liga).", "Bonus UEFA per avanzare negli scontri diretti (si somma alla fase campionato).")}</p>
        <ol className="space-y-1.5">
          {STAGES.map((p) => (
            <li key={p.tier} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-[11px] text-muted w-16 shrink-0">{p.tier}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{it ? p.it : p.es}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-[#60a5fa] to-violet" style={{ width: `${Math.max(8, (p.amount / max) * 100)}%` }} />
                </span>
              </span>
              <span className="tabular text-sm font-semibold text-[#60a5fa] shrink-0">{eur(p.amount, it)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">{t("Fuente: reparto oficial UEFA 2025/26. Final en Budapest, 30/05/2026. ", "Fonte: ripartizione ufficiale UEFA 2025/26. Finale a Budapest, 30/05/2026. ")}
          <a href="https://www.uefa.com/uefachampionsleague/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">UEFA</a>.
        </p>
      </section>

      <ShareBar className="mt-6" text={t("🏆 En la Champions 2025/26 un club gana 18,62 mln € solo por participar, 2,1 mln € por victoria y hasta 25 mln € por ganar la final. 👀 Cifras oficiales UEFA", "🏆 In Champions 2025/26 un club guadagna 18,62 mln € solo per partecipare, 2,1 mln € a vittoria e fino a 25 mln € vincendo la finale. 👀 Cifre ufficiali UEFA")} />

      {/* nuevo formato */}
      <section className="mt-10 glass p-5">
        <h2 className="text-lg font-semibold mb-2">📈 {t("El nuevo formato paga más", "Il nuovo formato paga di più")}</h2>
        <p className="text-sm text-muted">
          {t(
            "Desde 2024/25 la Champions tiene 36 clubes y una «fase liga» única (antes eran 32 en grupos). El bote subió a 2.467 millones de euros solo para la Champions, de un total de 3.317 millones que la UEFA reparte entre todas sus competiciones.",
            "Dal 2024/25 la Champions ha 36 club e un'unica «fase campionato» (prima erano 32 a gironi). Il montepremi è salito a 2.467 milioni di euro solo per la Champions, su un totale di 3.317 milioni che la UEFA distribuisce tra tutte le sue competizioni.",
          )}
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanto guadagna chi vince la Champions League 2025/26?", a: "Solo per la finale, 25 milioni di euro (18,5 per giocarla + 6,5 per vincerla). Ma sommando la partecipazione (18,62 mln), le vittorie (2,1 mln l'una) e tutti i turni precedenti, un club vincitore può superare i 100 milioni di euro. Cifre ufficiali UEFA." },
                { q: "Quanto si prende solo per giocare la Champions?", a: "18,62 milioni di euro per club (36 club nella nuova fase campionato), più 2,1 milioni per ogni vittoria e 700.000 € per ogni pareggio." },
                { q: "Quanto distribuisce la UEFA in totale?", a: "2.467 milioni di euro solo per la Champions League, su un totale di 3.317 milioni tra tutte le competizioni europee (Champions, Europa League, Conference)." },
                { q: "Quanto danno per ogni turno?", a: "Ottavi 11 mln €, quarti 12,5 mln €, semifinali 15 mln €, finale 18,5 mln € e altri 6,5 mln € per chi vince." },
              ]
            : [
                { q: "¿Cuánto gana el ganador de la Champions League 2025/26?", a: "Solo por la final, 25 millones de euros (18,5 por jugarla + 6,5 por ganarla). Pero sumando la participación (18,62 mln), las victorias (2,1 mln cada una) y todas las rondas previas, un club campeón puede superar los 100 millones de euros. Cifras oficiales UEFA." },
                { q: "¿Cuánto se cobra solo por jugar la Champions?", a: "18,62 millones de euros por club (36 clubes en la nueva fase liga), más 2,1 millones por cada victoria y 700.000 € por cada empate." },
                { q: "¿Cuánto reparte la UEFA en total?", a: "2.467 millones de euros solo para la Champions League, de un total de 3.317 millones entre todas las competiciones europeas (Champions, Europa League, Conference)." },
                { q: "¿Cuánto dan por cada ronda?", a: "Octavos 11 mln €, cuartos 12,5 mln €, semifinales 15 mln €, final 18,5 mln € y otros 6,5 mln € por ganarla." },
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
        <Link href="/eurocopa/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("🏆 Los premios de la Eurocopa →", "🏆 I premi degli Europei →")}
        </Link>
        <Link href="/futbol/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("Los clubes (LaLiga, Serie A)", "I club (LaLiga, Serie A)")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function ChampionsClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
