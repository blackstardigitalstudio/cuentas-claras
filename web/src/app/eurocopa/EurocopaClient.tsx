"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Cifras OFICIALES de la UEFA — EURO 2024 (la última disputada, ganada por España).
// En euros. Fuente: UEFA (sistema de reparto confirmado).
const eur = (m: number, it: boolean) => `${m.toLocaleString(it ? "it" : "es", { maximumFractionDigits: 2 })} mln €`;

const STAGES = [
  { es: "Octavos de final", it: "Ottavi di finale", amount: 1.5, tier: "R16" },
  { es: "Cuartos de final", it: "Quarti di finale", amount: 2.5, tier: "QF" },
  { es: "Semifinales", it: "Semifinali", amount: 4, tier: "SF" },
  { es: "Subcampeón (jugar la final)", it: "Finalista (giocare la finale)", amount: 5, tier: "2º" },
  { es: "Ganar la Eurocopa", it: "Vincere gli Europei", amount: 8, tier: "🏆" },
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
          src="/photos/spain-stadium.jpg"
          alt={t("Estadio de la Eurocopa", "Stadio degli Europei")}
          kicker={t("🏆 Eurocopa · cifras oficiales UEFA", "🏆 Europei · cifre ufficiali UEFA")}
          title={t("LA EUROCOPA:", "GLI EUROPEI:")}
          highlight={t("CUÁNTO SE GANA", "QUANTO SI GUADAGNA")}
          stat="28,25 mln €"
          statLabel={t("lo máximo — lo ganó España (2024)", "il massimo — l'ha preso la Spagna (2024)")}
          accent="#fbbf24"
          accent2="#f43f5e"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Cuánto reparte la UEFA en la Eurocopa: lo que cobra una selección por participar, por ganar y por cada ronda. Cifras oficiales de la Euro 2024 (la última, ganada por España).",
            "Quanto distribuisce la UEFA agli Europei: quanto prende una nazionale per partecipare, per vincere e per ogni turno. Cifre ufficiali di Euro 2024 (l'ultima, vinta dalla Spagna).",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "La UEFA paga a las federaciones (no a los jugadores). Cada selección cobra un fijo por participar; luego suma dinero por cada victoria y por cada ronda que supera. El campeón se lleva el premio gordo.",
            "La UEFA paga alle federazioni (non ai giocatori). Ogni nazionale prende un fisso per partecipare; poi accumula soldi per ogni vittoria e per ogni turno superato. Chi vince si prende il premio grosso.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { v: "28,25 mln €", l: t("Máximo (campeón)", "Massimo (campione)"), c: "#fbbf24" },
          { v: "9,25 mln €", l: t("Solo por participar", "Solo per partecipare"), c: "#34d399" },
          { v: "331 mln €", l: t("Reparte la UEFA (total)", "Distribuisce la UEFA (totale)"), c: "#f43f5e" },
        ].map((k) => (
          <div key={k.l} className="glass p-4 text-center">
            <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
            <p className="text-[11px] text-muted mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      {/* Fase de grupos */}
      <section className="mt-8 glass p-5">
        <h2 className="text-lg font-semibold mb-2">💶 {t("La fase de grupos (24 selecciones)", "La fase a gironi (24 nazionali)")}</h2>
        <p className="text-sm text-muted">
          {t(
            "Cada selección recibe 9,25 mln € solo por participar. Además, 1 mln € por cada victoria en la fase de grupos y 500.000 € por cada empate. A partir de ahí, se suma un bono por cada ronda que se supera.",
            "Ogni nazionale riceve 9,25 mln € solo per partecipare. In più, 1 mln € per ogni vittoria nella fase a gironi e 500.000 € per ogni pareggio. Da lì in poi, si aggiunge un bonus per ogni turno superato.",
          )}
        </p>
      </section>

      {/* Premios por fase eliminatoria */}
      <section className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold">🏆 {t("Cuánto gana por cada ronda", "Quanto guadagna per ogni turno")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Bono de la UEFA por avanzar en la eliminatoria (se suma a la fase de grupos). Euro 2024.", "Bonus UEFA per avanzare negli scontri diretti (si somma alla fase a gironi). Euro 2024.")}</p>
        <ol className="space-y-1.5">
          {STAGES.map((p) => (
            <li key={p.tier} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-[11px] text-muted w-16 shrink-0">{p.tier}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{it ? p.it : p.es}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-[#fbbf24] to-[#f43f5e]" style={{ width: `${Math.max(8, (p.amount / max) * 100)}%` }} />
                </span>
              </span>
              <span className="tabular text-sm font-semibold text-[#fbbf24] shrink-0">{eur(p.amount, it)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">{t("Un empate en la fase de grupos vale 500.000 €. Fuente: reparto oficial UEFA (Euro 2024). ", "Un pareggio nella fase a gironi vale 500.000 €. Fonte: ripartizione ufficiale UEFA (Euro 2024). ")}
          <a href="https://www.uefa.com/uefaeuro/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">UEFA</a>.
        </p>
      </section>

      <ShareBar className="mt-6" text={t("🏆 España ganó hasta 28,25 mln € por conquistar la Eurocopa 2024. La UEFA repartió 331 mln € entre las 24 selecciones. 👀 Cifras oficiales", "🏆 La Spagna ha guadagnato fino a 28,25 mln € vincendo Euro 2024. La UEFA ha distribuito 331 mln € tra le 24 nazionali. 👀 Cifre ufficiali")} />

      {/* Euro 2028 */}
      <section className="mt-10 glass p-5">
        <h2 className="text-lg font-semibold mb-2">🔮 {t("¿Y la próxima Eurocopa?", "E i prossimi Europei?")}</h2>
        <p className="text-sm text-muted">
          {t(
            "La próxima Eurocopa es la Euro 2028, en Reino Unido e Irlanda. La UEFA todavía no ha publicado su reparto de premios; en cuanto sea oficial, actualizaremos esta página. Las cifras de arriba son las de la Euro 2024, la última disputada.",
            "I prossimi Europei sono Euro 2028, nel Regno Unito e in Irlanda. La UEFA non ha ancora pubblicato la ripartizione dei premi; appena sarà ufficiale, aggiorneremo questa pagina. Le cifre qui sopra sono quelle di Euro 2024, l'ultima disputata.",
          )}
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanto ha guadagnato la Spagna vincendo Euro 2024?", a: "Fino a 28,25 milioni di euro: 9,25 per partecipare, più le vittorie (1 mln l'una), gli ottavi (1,5), i quarti (2,5), la semifinale (4) e 8 milioni per aver vinto la finale. Cifre ufficiali UEFA." },
                { q: "Qual è il montepremi totale degli Europei?", a: "331 milioni di euro, ripartiti tra le 24 nazionali (Euro 2024), come a Euro 2020." },
                { q: "Quanto si prende solo per partecipare agli Europei?", a: "9,25 milioni di euro a nazionale. Poi si aggiungono 1 milione per ogni vittoria nei gironi e 500.000 € per ogni pareggio." },
                { q: "Quando sono i prossimi Europei?", a: "Euro 2028, nel Regno Unito e in Irlanda. La UEFA non ha ancora comunicato i premi." },
              ]
            : [
                { q: "¿Cuánto ganó España al ganar la Eurocopa 2024?", a: "Hasta 28,25 millones de euros: 9,25 por participar, más las victorias (1 mln cada una), los octavos (1,5), los cuartos (2,5), la semifinal (4) y 8 millones por ganar la final. Cifras oficiales UEFA." },
                { q: "¿Cuál es el premio total de la Eurocopa?", a: "331 millones de euros, repartidos entre las 24 selecciones (Euro 2024), lo mismo que en la Euro 2020." },
                { q: "¿Cuánto se cobra solo por participar en la Eurocopa?", a: "9,25 millones de euros por selección. Luego se suman 1 millón por cada victoria en la fase de grupos y 500.000 € por cada empate." },
                { q: "¿Cuándo es la próxima Eurocopa?", a: "La Euro 2028, en Reino Unido e Irlanda. La UEFA todavía no ha comunicado los premios." },
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
        <Link href="/champions-league/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("🏆 Los premios de la Champions →", "🏆 I premi della Champions →")}
        </Link>
        <Link href="/mundial-2026/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("El Mundial 2026 (FIFA)", "I Mondiali 2026 (FIFA)")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function EurocopaClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
