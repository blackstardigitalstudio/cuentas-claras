"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Cifras OFICIALES (brutas al año). ES: Portal de Transparencia (retribuciones de
// altos cargos, 2025). IT: Camera/Senato (indennità). Los parlamentarios italianos
// cobran además dieta y reembolsos (no es «sueldo»), que se indican aparte.
const POL_ES = [
  { es: "Presidente del Gobierno", it: "Presidente del Governo", amount: 95944 },
  { es: "Vicepresidente/a", it: "Vicepresidente", amount: 86601 },
  { es: "Ministro/a", it: "Ministro", amount: 79415 },
  { es: "Diputado/a (base)", it: "Deputato (base)", amount: 55804 },
];
const POL_IT = [
  { es: "Presidente de la República", it: "Presidente della Repubblica", amount: 239182 },
  { es: "Parlamentario (indemnización)", it: "Parlamentare (indennità)", amount: 125220 },
];

function Section({ code, rows }: { code: "es" | "it"; rows: { es: string; it: string; amount: number }[] }) {
  const { locale } = useLocale();
  const it = locale === "it";
  const eur = (n: number) => `${n.toLocaleString(it ? "it" : "es")} €`;
  const flag = code === "es" ? "🇪🇸" : "🇮🇹";
  const heading = code === "es" ? (it ? "Spagna" : "España") : "Italia";
  const max = Math.max(...rows.map((r) => r.amount));
  const accent = code === "es" ? "#a5b4fc" : "#34d399";
  return (
    <section className="mt-8">
      <h2 className="text-lg md:text-xl font-semibold mb-1">{flag} {heading}</h2>
      <p className="text-[11px] text-cyan/70 mb-4">{it ? "Retribuzione lorda all'anno." : "Retribución bruta al año."}</p>
      <ol className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.es} className="glass flex items-center gap-3 px-3 py-2.5">
            <span className="flex-1 min-w-0">
              <span className="block truncate font-medium">{it ? r.it : r.es}</span>
              <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                <span className="block h-full rounded-full" style={{ width: `${Math.max(10, (r.amount / max) * 100)}%`, background: `linear-gradient(90deg, ${accent}, #22d3ee)` }} />
              </span>
            </span>
            <span className="tabular text-sm font-semibold shrink-0" style={{ color: accent }}>{eur(r.amount)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

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
          src="/photos/justice.jpg"
          alt={t("Edificio institucional", "Edificio istituzionale")}
          kicker={t("🏛️ Sueldos públicos · cifras oficiales", "🏛️ Stipendi pubblici · cifre ufficiali")}
          title={t("¿CUÁNTO COBRA", "QUANTO GUADAGNA")}
          highlight={t("UN POLÍTICO?", "UN POLITICO?")}
          stat={t("95.944 €", "10.435 €")}
          statLabel={t("al año, el presidente del Gobierno", "al mese, l'indennità di un parlamentare")}
          accent="#a5b4fc"
          accent2="#34d399"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Cuánto cobran los políticos de España e Italia, con cifras oficiales. Lo pagas tú con tus impuestos.",
            "Quanto guadagnano i politici di Spagna e Italia, con cifre ufficiali. Li paghi tu con le tue tasse.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "El sueldo de un político sale de tus impuestos. No es un secreto: está publicado. Aquí lo ves claro, con la fuente oficial. Los sueldos de arriba (presidente, ministros) los fija la ley; los diputados y parlamentarios cobran una cantidad fija cada mes.",
            "Lo stipendio di un politico esce dalle tue tasse. Non è un segreto: è pubblicato. Qui lo vedi chiaro, con la fonte ufficiale. Gli stipendi in alto (presidente, ministri) li fissa la legge; deputati e parlamentari prendono una cifra fissa ogni mese.",
          )}</p>
        </SimpleExplainer>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { v: "95.944 €", l: t("Presidente (España)", "Presidente (Spagna)"), c: "#a5b4fc" },
          { v: "10.435 €", l: t("Parlamentario IT (al mes)", "Parlamentare IT (al mese)"), c: "#34d399" },
          { v: "239.182 €", l: t("Presidente Rep. (Italia)", "Presidente Rep. (Italia)"), c: "#22d3ee" },
        ].map((k) => (
          <div key={k.l} className="glass p-4 text-center">
            <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
            <p className="text-[11px] text-muted mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      <Section code="es" rows={POL_ES} />
      <p className="text-[11px] text-muted mt-3">{t("Fuente: ", "Fonte: ")}
        <a href="https://transparencia.gob.es/transparencia/transparencia_Home/index/PublicidadActiva/PublicidadActivaporMaterias/Altos-cargos/RetribucionesAC.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{t("Portal de Transparencia (España), 2025", "Portale Trasparenza (Spagna), 2025")}</a>.
      </p>

      <Section code="it" rows={POL_IT} />
      <p className="text-[11px] text-muted mt-3">
        {t(
          "La indemnización (sueldo) de un parlamentario italiano es de 10.435 € brutos al mes (≈125.220 €/año). Además cobra una dieta de 3.503 €/mes y otros reembolsos (para gastos, no es sueldo). El presidente Mattarella redujo voluntariamente su asignación a 179.836 €. Fuente: ",
          "L'indennità (stipendio) di un parlamentare italiano è di 10.435 € lordi al mese (≈125.220 €/anno). In più prende una diaria di 3.503 €/mese e altri rimborsi (per le spese, non è stipendio). Il presidente Mattarella ha ridotto volontariamente il suo assegno a 179.836 €. Fonte: ",
        )}
        <a href="https://www.senato.it/composizione/senatori/trattamento-economico" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Senato</a>
        {" / "}
        <a href="https://www.camera.it/" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">Camera</a>.
      </p>

      <ShareBar className="mt-6" text={t("🏛️ El presidente del Gobierno español cobra 95.944 €/año. Un parlamentario italiano: 10.435 €/mes solo de indemnización (≈125.220 €/año). 👀 Cifras oficiales", "🏛️ Il presidente del Governo spagnolo prende 95.944 €/anno. Un parlamentare italiano: 10.435 €/mese solo di indennità (≈125.220 €/anno). 👀 Cifre ufficiali")} />

      {/* Comparación curiosa */}
      <section className="mt-10 glass p-5">
        <h2 className="text-lg font-semibold mb-2">🤔 {t("Un dato curioso", "Un dato curioso")}</h2>
        <p className="text-sm text-muted">
          {t(
            "El presidente del Gobierno de España (95.944 €/año) cobra menos que un parlamentario italiano solo con su indemnización (≈125.220 €/año), sin contar dietas.",
            "Il presidente del Governo spagnolo (95.944 €/anno) guadagna meno di un parlamentare italiano con la sola indennità (≈125.220 €/anno), senza contare le diarie.",
          )}
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanto guadagna il presidente del Governo spagnolo?", a: "95.944 € lordi all'anno (2025), secondo il Portale della Trasparenza. In più riceve 14 mensilità da 1.032 € come deputato." },
                { q: "Quanto guadagna un parlamentare italiano?", a: "L'indennità è di 10.435 € lordi al mese (circa 125.220 € l'anno). In più: diaria di 3.503 € al mese e altri rimborsi per le spese (non sono stipendio)." },
                { q: "Quanto guadagna un deputato in Spagna?", a: "3.050,62 € lordi al mese di base (circa 55.804 € l'anno), più diarie e altre indennità." },
                { q: "Da dove escono questi soldi?", a: "Dalle tue tasse. Gli stipendi delle alte cariche sono pubblicati ufficialmente: Portale della Trasparenza in Spagna; Camera e Senato in Italia." },
              ]
            : [
                { q: "¿Cuánto cobra el presidente del Gobierno?", a: "95.944 € brutos al año (2025), según el Portal de Transparencia. Además percibe 14 pagas de 1.032 € como diputado." },
                { q: "¿Cuánto gana un parlamentario en Italia?", a: "La indemnización es de 10.435 € brutos al mes (unos 125.220 € al año). Además: una dieta de 3.503 €/mes y otros reembolsos para gastos (no son sueldo)." },
                { q: "¿Cuánto gana un diputado en España?", a: "3.050,62 € brutos al mes de base (unos 55.804 € al año), más dietas y otras indemnizaciones." },
                { q: "¿De dónde sale este dinero?", a: "De tus impuestos. Los sueldos de los altos cargos se publican oficialmente: Portal de Transparencia en España; Cámara y Senado en Italia." },
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
        <Link href="/sueldos-alcaldes/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("Los sueldos de los alcaldes →", "Gli stipendi dei sindaci →")}
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

export default function PoliticosClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
