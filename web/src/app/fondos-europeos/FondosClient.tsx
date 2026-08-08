"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Cifras OFICIALES. ES: Plan de Recuperación / Ministerio de Hacienda — hasta 163.000
// M€ (≈80.000 M€ a fondo perdido); recibido ≈71.000 M€. IT: Italia Domani / MEF — PNRR
// 194,4 mld € (71,8 sovvenzioni + 122,6 prestiti); recibido ≈85%. Cierre del fondo: fin 2026.
const FONDS = [
  { code: "es", flag: "🇪🇸", nameEs: "España", nameIt: "Spagna", planEs: "Plan de Recuperación", planIt: "Plan de Recuperación",
    totalEs: "163.000 M€", totalIt: "163 miliardi €", grantsEs: "~80.000 M€", grantsIt: "~80 miliardi €",
    recvEs: "~71.000 M€", recvIt: "~71 miliardi €", pct: 44, accent: "#a5b4fc" },
  { code: "it", flag: "🇮🇹", nameEs: "Italia", nameIt: "Italia", planEs: "PNRR", planIt: "PNRR",
    totalEs: "194.400 M€", totalIt: "194,4 miliardi €", grantsEs: "71.800 M€", grantsIt: "71,8 miliardi €",
    recvEs: "~165.000 M€", recvIt: "~165 miliardi €", pct: 85, accent: "#34d399" },
];

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
          alt={t("Monedas de euro y bandera de la UE", "Monete in euro e bandiera UE")}
          kicker={t("🇪🇺 Fondos europeos · cifras oficiales", "🇪🇺 Fondi europei · cifre ufficiali")}
          title={t("EL DINERO DE EUROPA:", "I SOLDI DELL'EUROPA:")}
          highlight={t("¿ADÓNDE VA?", "DOVE VANNO?")}
          stat={t("163.000 M€", "194,4 miliardi €")}
          statLabel={t("para España (Next Generation)", "per l'Italia (PNRR)")}
          accent="#60a5fa"
          accent2="#fbbf24"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Cuánto dinero manda Europa a España e Italia tras la pandemia, para qué, y cuánto ha llegado ya. Cifras oficiales.",
            "Quanti soldi manda l'Europa a Spagna e Italia dopo la pandemia, per cosa, e quanti sono già arrivati. Cifre ufficiali.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "Tras el COVID, Europa creó un fondo gigante (Next Generation EU) para modernizar los países. Parte es dinero REGALADO (a fondo perdido, no se devuelve) y parte son PRÉSTAMOS (sí se devuelven, pero baratos). Cada país tiene su plan con proyectos que hay que cumplir antes de finales de 2026 para cobrar. En España se llama Plan de Recuperación; en Italia, PNRR.",
            "Dopo il COVID, l'Europa ha creato un fondo gigante (Next Generation EU) per modernizzare i Paesi. Una parte è denaro REGALATO (a fondo perduto, non si restituisce) e una parte sono PRESTITI (si restituiscono, ma a poco prezzo). Ogni Paese ha il suo piano con progetti da realizzare entro fine 2026 per incassare. In Italia si chiama PNRR; in Spagna, Plan de Recuperación.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* Dos países */}
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {FONDS.map((d) => (
          <div key={d.code} className="glass p-5 relative overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${d.accent},transparent)` }} />
            <p className="text-sm font-semibold">{d.flag} {it ? d.nameIt : d.nameEs} <span className="text-muted font-normal">· {it ? d.planIt : d.planEs}</span></p>
            <p className="tabular text-3xl font-bold mt-2" style={{ color: d.accent }}>{it ? d.totalIt : d.totalEs}</p>
            <p className="text-[11px] text-muted">{t("en total (Next Generation)", "in totale (Next Generation)")}</p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted">{t("a fondo perdido (regalado)", "a fondo perduto (regalato)")}</span>
                <span className="tabular font-semibold" style={{ color: d.accent }}>{it ? d.grantsIt : d.grantsEs}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">{t("recibido hasta ahora", "ricevuto finora")}</span>
                  <span className="tabular font-semibold" style={{ color: d.accent }}>{it ? d.recvIt : d.recvEs} · {d.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${d.pct}%`, background: `linear-gradient(90deg, ${d.accent}, #fbbf24)` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted mt-3">
        {t(
          "El fondo europeo (Next Generation EU) reparte en total 672.500 M€ entre todos los países, y se cierra a finales de 2026.",
          "Il fondo europeo (Next Generation EU) distribuisce in tutto 672.500 milioni di € tra tutti i Paesi, e si chiude a fine 2026.",
        )}
      </p>

      <ShareBar className="mt-6" text={t("🇪🇺 Europa manda a España hasta 163.000 M€ (unos 80.000 a fondo perdido) y a Italia 194.400 M€. Hay que gastarlos antes de fin de 2026. 👀 Cifras oficiales", "🇪🇺 L'Europa manda all'Italia 194,4 miliardi € (PNRR) e alla Spagna fino a 163 miliardi. Vanno spesi entro fine 2026. 👀 Cifre ufficiali")} />

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanti soldi riceve l'Italia con il PNRR?", a: "194,4 miliardi di euro: 71,8 a fondo perduto (regalati) e 122,6 in prestiti a basso costo. A oggi l'Italia ha ricevuto circa l'85% delle risorse. Fonte: Italia Domani / MEF." },
                { q: "Quanti soldi riceve la Spagna?", a: "Fino a 163.000 milioni di euro (circa 80.000 a fondo perduto). Finora ne ha ricevuti circa 71.000 milioni. Fonte: Plan de Recuperación / Ministero delle Finanze spagnolo." },
                { q: "Questi soldi vanno restituiti?", a: "Una parte no (le sovvenzioni «a fondo perduto»); l'altra sì (i prestiti, ma a condizioni vantaggiose). Dipende da quanto ogni Paese chiede come prestito." },
                { q: "Entro quando vanno spesi?", a: "Il fondo europeo si chiude a fine 2026: bisogna completare i progetti e presentare le ultime richieste di pagamento entro l'autunno 2026." },
                { q: "Da dove escono questi soldi?", a: "Li mette l'Unione Europea insieme (un debito comune europeo), che poi viene restituito da tutti i Paesi nel tempo." },
              ]
            : [
                { q: "¿Cuánto dinero recibe España de Europa?", a: "Hasta 163.000 millones de euros (unos 80.000 a fondo perdido). Hasta ahora ha recibido unos 71.000 millones. Fuente: Plan de Recuperación / Ministerio de Hacienda." },
                { q: "¿Cuánto recibe Italia con el PNRR?", a: "194.400 millones de euros: 71.800 a fondo perdido (regalados) y 122.600 en préstamos baratos. Ya ha recibido en torno al 85%. Fuente: Italia Domani / MEF." },
                { q: "¿Hay que devolver este dinero?", a: "Una parte no (las subvenciones «a fondo perdido»); la otra sí (los préstamos, pero en condiciones ventajosas). Depende de cuánto pida cada país como préstamo." },
                { q: "¿Hasta cuándo hay plazo para gastarlo?", a: "El fondo europeo se cierra a finales de 2026: hay que completar los proyectos y presentar los últimos pagos antes del otoño de 2026." },
                { q: "¿De dónde sale ese dinero?", a: "Lo pone la Unión Europea en conjunto (una deuda común europea), que luego se devuelve entre todos los países con el tiempo." },
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
        <a href="https://planderecuperacion.gob.es/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Plan de Recuperación (ES)</a>
        {" · "}
        <a href="https://www.italiadomani.gov.it/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Italia Domani (IT)</a>
        {" · "}
        <a href="https://commission.europa.eu/strategy-and-policy/recovery-plan-europe_en" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{t("Comisión Europea", "Commissione Europea")}</a>.
      </p>

      <nav className="mt-8 flex flex-wrap gap-3">
        <Link href="/deuda-nacional/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("¿Cuánto debe el Estado? →", "Quanto deve lo Stato? →")}
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

export default function FondosClient({ locale }: { locale?: "es" | "it" }) {
  return (
    <LocaleProvider force={locale}>
      <Inner />
    </LocaleProvider>
  );
}
