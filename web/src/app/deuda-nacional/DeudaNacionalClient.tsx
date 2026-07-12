"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Cifras OFICIALES (cierre 2025). ES: Banco de España — 1,699 billones € = 100,8% PIB.
// IT: Istat / Banca d'Italia — 3.095,5 miliardi € = 137,1% PIL. Per cápita = deuda ÷
// población (aprox., ES ~48,8 M hab; IT ~58,9 M ab).
const DEBT = [
  { code: "es", flag: "🇪🇸", nameEs: "España", nameIt: "Spagna", totalEs: "1,7 billones €", totalIt: "1.699 miliardi €", pct: 100.8, perCapita: "~35.000 €", accent: "#a5b4fc" },
  { code: "it", flag: "🇮🇹", nameEs: "Italia", nameIt: "Italia", totalEs: "3,1 billones €", totalIt: "3.095 miliardi €", pct: 137.1, perCapita: "~53.000 €", accent: "#34d399" },
];
const EU_LIMIT = 60; // regla europea (Maastricht): 60% del PIB.
const SCALE = 150; // tope del gráfico de barras (% PIB)

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const t = (es: string, itx: string) => (it ? itx : es);

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/money.jpg"
          alt={t("Monedas de euro", "Monete da un euro")}
          kicker={t("🏦 Deuda pública · cifras oficiales", "🏦 Debito pubblico · cifre ufficiali")}
          title={t("¿CUÁNTO DEBE", "QUANTO DEVE")}
          highlight={t("EL ESTADO?", "LO STATO?")}
          stat={t("1,7 billones €", "3.095 miliardi €")}
          statLabel={t("lo que debe España (2025)", "quanto deve l'Italia (2025)")}
          accent="#fdba74"
          accent2="#f472b6"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Cuánto debe el Estado en España e Italia, con cifras oficiales. La deuda que tiene el país entero, y cuánto toca por habitante.",
            "Quanto deve lo Stato in Spagna e Italia, con cifre ufficiali. Il debito dell'intero Paese, e quanto tocca a ogni abitante.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "La deuda pública es todo lo que el Estado ha pedido prestado y aún no ha devuelto. Es como una hipoteca gigante del país entero. Cada año paga intereses (con tus impuestos) y a veces pide más prestado para llegar a fin de mes.",
            "Il debito pubblico è tutto ciò che lo Stato ha preso in prestito e non ha ancora restituito. È come un mutuo gigante di tutto il Paese. Ogni anno paga interessi (con le tue tasse) e a volte chiede altri prestiti per arrivare a fine mese.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* Dos países */}
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {DEBT.map((d) => (
          <div key={d.code} className="glass p-5 relative overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${d.accent},transparent)` }} />
            <p className="text-sm font-semibold">{d.flag} {it ? d.nameIt : d.nameEs}</p>
            <p className="tabular text-3xl font-bold mt-2" style={{ color: d.accent }}>{it ? d.totalIt : d.totalEs}</p>
            <p className="text-[11px] text-muted">{t("lo que debe (2025)", "quanto deve (2025)")}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-white/5 py-2">
                <p className="tabular font-semibold" style={{ color: d.accent }}>{d.pct.toLocaleString(it ? "it" : "es")}%</p>
                <p className="text-[10px] text-muted">{t("del PIB", "del PIL")}</p>
              </div>
              <div className="rounded-xl bg-white/5 py-2">
                <p className="tabular font-semibold" style={{ color: d.accent }}>{d.perCapita}</p>
                <p className="text-[10px] text-muted">{t("por habitante", "per abitante")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* % del PIB vs límite UE */}
      <section className="mt-8">
        <h2 className="text-lg md:text-xl font-semibold">📊 {t("Deuda sobre el PIB (y el límite europeo)", "Debito sul PIL (e il limite europeo)")}</h2>
        <p className="text-[11px] text-cyan/70 mb-4">{t("El PIB es todo lo que produce el país en un año. La regla europea dice: no más del 60%.", "Il PIL è tutto ciò che il Paese produce in un anno. La regola europea dice: non oltre il 60%.")}</p>
        <div className="space-y-3">
          {DEBT.map((d) => (
            <div key={d.code}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{d.flag} {it ? d.nameIt : d.nameEs}</span>
                <span className="tabular font-semibold" style={{ color: d.accent }}>{d.pct.toLocaleString(it ? "it" : "es")}%</span>
              </div>
              <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
                <span className="block h-full rounded-full" style={{ width: `${(d.pct / SCALE) * 100}%`, background: `linear-gradient(90deg, ${d.accent}, #f472b6)` }} />
                {/* línea del límite UE (60%) */}
                <span className="absolute top-0 bottom-0 w-px bg-amber-300" style={{ left: `${(EU_LIMIT / SCALE) * 100}%` }} />
              </div>
            </div>
          ))}
          <p className="text-[11px] text-amber-200/80">▏ {t("La línea amarilla es el límite europeo: 60% del PIB. Los dos países están muy por encima.", "La linea gialla è il limite europeo: 60% del PIL. I due Paesi sono molto sopra.")}</p>
        </div>
      </section>

      <ShareBar className="mt-6" text={t("🏦 España debe 1,7 billones € (100,8% del PIB, ~35.000 € por habitante). Italia, 3.095 miles de millones (137,1%). El límite europeo es 60%. 👀 Cifras oficiales", "🏦 L'Italia deve 3.095 miliardi € (137,1% del PIL, ~53.000 € a testa). La Spagna, 1.699 miliardi (100,8%). Il limite europeo è 60%. 👀 Cifre ufficiali")} />

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanto deve lo Stato italiano?", a: "A fine 2025 il debito pubblico italiano era di 3.095 miliardi di euro, pari al 137,1% del PIL: il secondo più alto dell'Unione Europea dopo la Grecia. Sono circa 53.000 € per ogni abitante. Fonte: Istat / Banca d'Italia / Eurostat." },
                { q: "Quanto deve la Spagna?", a: "A fine 2025 il debito pubblico spagnolo era di 1.699 miliardi di euro (100,8% del PIL), circa 35.000 € per abitante. Fonte: Banco de España." },
                { q: "È un male avere debito?", a: "Un po' di debito è normale. Il problema è quando è troppo: gli interessi da pagare ogni anno si mangiano una fetta del bilancio, soldi che non vanno a scuole, sanità o strade. La regola europea è non superare il 60% del PIL." },
                { q: "Chi presta questi soldi allo Stato?", a: "Investitori che comprano i titoli di Stato (BTP in Italia): banche, fondi, risparmiatori e altri Paesi. Lo Stato promette di restituire con gli interessi." },
              ]
            : [
                { q: "¿Cuánto debe España?", a: "A cierre de 2025 la deuda pública española era de 1,7 billones de euros (1.699 miles de millones), el 100,8% del PIB: unos 35.000 € por habitante. Fuente: Banco de España." },
                { q: "¿Cuánto debe Italia?", a: "A cierre de 2025 la deuda pública italiana era de 3.095 miles de millones de euros, el 137,1% del PIB: la segunda más alta de la UE tras Grecia. Unos 53.000 € por habitante. Fuente: Istat / Banca d'Italia / Eurostat." },
                { q: "¿Es malo tener deuda?", a: "Un poco de deuda es normal. El problema es cuando es demasiada: los intereses que hay que pagar cada año se comen una parte del presupuesto, dinero que no va a colegios, sanidad o carreteras. La regla europea es no pasar del 60% del PIB." },
                { q: "¿Quién presta ese dinero al Estado?", a: "Inversores que compran deuda del Estado (bonos): bancos, fondos, ahorradores y otros países. El Estado promete devolverlo con intereses." },
              ]
          ).map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-muted mt-6">
        {t("Fuentes: ", "Fonti: ")}
        <a href="https://www.bde.es/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Banco de España</a>
        {" · "}
        <a href="https://www.bancaditalia.it/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Banca d'Italia</a>
        {" · Eurostat. "}
        {t("Cierre 2025.", "Chiusura 2025.")}
      </p>

      <nav className="mt-8 flex flex-wrap gap-3">
        <Link href="/deuda-municipios/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("La deuda de los municipios →", "Il debito dei comuni →")}
        </Link>
        <Link href="/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("Buscar tu ciudad", "Cerca la tua città")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function DeudaNacionalClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
