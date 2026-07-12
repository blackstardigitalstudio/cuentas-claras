"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Cifras OFICIALES de la FIFA (World Cup 2026). En dólares, como las publica la FIFA.
const usd = (m: number) => `${m} mln $`;
const PRIZE = [
  { es: "Campeón", it: "Campione", amount: 50, tier: "1º" },
  { es: "Subcampeón", it: "Finalista", amount: 33, tier: "2º" },
  { es: "Tercero", it: "Terzo", amount: 29, tier: "3º" },
  { es: "Cuarto", it: "Quarto", amount: 27, tier: "4º" },
  { es: "Cuartos de final", it: "Quarti di finale", amount: 19, tier: "5º-8º" },
  { es: "Octavos de final", it: "Ottavi di finale", amount: 15, tier: "9º-16º" },
  { es: "Fase de grupos", it: "Fase a gironi", amount: 11, tier: "17º-32º" },
  { es: "Eliminados", it: "Eliminati", amount: 9, tier: "33º-48º" },
];

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const max = PRIZE[0].amount;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/spain-stadium.jpg"
          alt={t("Estadio del Mundial", "Stadio dei Mondiali")}
          kicker={t("🏆 Mundial 2026 · cifras oficiales FIFA", "🏆 Mondiali 2026 · cifre ufficiali FIFA")}
          title={t("EL MUNDIAL 2026:", "I MONDIALI 2026:")}
          highlight={t("CUÁNTO SE GANA", "QUANTO SI GUADAGNA")}
          stat="50 mln $"
          statLabel={t("para el campeón (récord histórico)", "per chi vince (record storico)")}
          accent="#fdd663"
          accent2="#34d399"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Cuánto reparte la FIFA en el Mundial 2026: el premio para el campeón, para cada selección y el montante total. Solo cifras oficiales de la FIFA (en dólares, como las publica).",
            "Quanto distribuisce la FIFA ai Mondiali 2026: il premio per chi vince, per ogni nazionale e il montepremi totale. Solo cifre ufficiali FIFA (in dollari, come le pubblica).",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "La FIFA paga a las federaciones (no a los jugadores). Cada selección que llega al Mundial cobra un mínimo por participar; cuanto más lejos llega, más gana. El campeón se lleva el premio gordo.",
            "La FIFA paga alle federazioni (non ai giocatori). Ogni nazionale che arriva al Mondiale prende un minimo per partecipare; più va avanti, più guadagna. Chi vince si prende il premio grosso.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { v: "50 mln $", l: t("Para el campeón", "A chi vince"), c: "#fdd663" },
          { v: "655 mln $", l: t("Montante total (premios)", "Montepremi totale"), c: "#34d399" },
          { v: "10,5 mln $", l: t("Mínimo por selección", "Minimo per nazionale"), c: "#22d3ee" },
        ].map((k) => (
          <div key={k.l} className="glass p-4 text-center">
            <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
            <p className="text-[11px] text-muted mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      {/* Premios por posición */}
      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold">🏆 {t("Cuánto gana cada selección", "Quanto guadagna ogni nazionale")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("Premio de la FIFA según hasta dónde llega en el torneo (48 selecciones).", "Premio FIFA in base a quanto va avanti nel torneo (48 nazionali).")}</p>
        <ol className="space-y-1.5">
          {PRIZE.map((p) => (
            <li key={p.tier} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-[11px] text-muted w-12 shrink-0">{p.tier}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate font-medium">{it ? p.it : p.es}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-[#fdd663] to-green" style={{ width: `${Math.max(10, (p.amount / max) * 100)}%` }} />
                </span>
              </span>
              <span className="tabular text-sm font-semibold text-[#fdd663] shrink-0">{usd(p.amount)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">{t("Además, cada selección recibe 1,5 mln $ para gastos de preparación. Fuente: ", "In più, ogni nazionale riceve 1,5 mln $ per le spese di preparazione. Fonte: ")}
          <a href="https://inside.fifa.com/organisation/fifa-council/media-releases/council-approves-record-breaking-world-cup-2026-financial-contribution" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">FIFA</a>.
        </p>
      </section>

      <ShareBar className="mt-6" text={t("🏆 El campeón del Mundial 2026 gana 50 millones de $ de la FIFA (total 655 mln). 👀 Cifras oficiales", "🏆 Chi vince i Mondiali 2026 guadagna 50 milioni di $ dalla FIFA (totale 655 mln). 👀 Cifre ufficiali")} />

      {/* vs 2022 */}
      <section className="mt-10 glass p-5">
        <h2 className="text-lg font-semibold mb-2">📈 {t("Mucho más que en 2022", "Molto più che nel 2022")}</h2>
        <p className="text-sm text-muted">
          {t(
            "El montante total sube de 440 mln $ en el Mundial de Catar 2022 a 655 mln $ en 2026 (+49%). El premio al campeón pasa de 42 mln $ (Argentina) a 50 mln $.",
            "Il montepremi totale sale da 440 mln $ del Mondiale di Qatar 2022 a 655 mln $ nel 2026 (+49%). Il premio a chi vince passa da 42 mln $ (Argentina) a 50 mln $.",
          )}
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanto guadagna chi vince il Mondiale 2026?", a: "La federazione campione riceve 50 milioni di dollari dalla FIFA, il premio più alto di sempre (era 42 mln $ per l'Argentina nel 2022)." },
                { q: "Qual è il montepremi totale dei Mondiali 2026?", a: "655 milioni di dollari di premi, più 72 milioni (1,5 mln a squadra) per le spese di preparazione: in tutto 727 milioni di dollari, ripartiti tra le 48 nazionali." },
                { q: "Quanto prende una squadra eliminata subito?", a: "Almeno 10,5 milioni di dollari: 9 milioni di premio (33º-48º posto) più 1,5 milioni per la preparazione." },
                { q: "La FIFA paga i giocatori?", a: "No: la FIFA paga le federazioni. Poi ogni federazione decide quanto girare a giocatori e staff." },
              ]
            : [
                { q: "¿Cuánto gana el que gana el Mundial 2026?", a: "La federación campeona recibe 50 millones de dólares de la FIFA, el premio más alto de la historia (fueron 42 mln $ para Argentina en 2022)." },
                { q: "¿Cuál es el montante total del Mundial 2026?", a: "655 millones de dólares en premios, más 72 millones (1,5 mln por equipo) para gastos de preparación: en total 727 millones de dólares, repartidos entre las 48 selecciones." },
                { q: "¿Cuánto cobra una selección eliminada pronto?", a: "Al menos 10,5 millones de dólares: 9 millones de premio (puesto 33º-48º) más 1,5 millones para la preparación." },
                { q: "¿La FIFA paga a los jugadores?", a: "No: la FIFA paga a las federaciones. Luego cada federación decide cuánto da a jugadores y cuerpo técnico." },
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
        <Link href="/futbol-mundial/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("🌍 El dinero del fútbol mundial →", "🌍 I soldi del calcio mondiale →")}
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

export default function MundialCopaClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
