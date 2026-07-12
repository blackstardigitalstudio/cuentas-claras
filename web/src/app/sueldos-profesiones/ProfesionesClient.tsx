"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";

// Sueldos TÍPICOS (brutos/año) de profesiones públicas — pagadas con dinero público.
// NO son cifras fijas: varían mucho por comunidad/región, antigüedad y categoría.
// Se muestran como valores típicos con una nota de rango. Fuentes: INE (ES),
// CCNL comparto y contratos públicos (IT).
const PRO_ES = [
  { es: "Médico/a (sanidad pública)", it: "Medico (sanità pubblica)", amount: 54000, noteEs: "de 35.000 a +100.000 según antigüedad", noteIt: "da 35.000 a +100.000 secondo l'anzianità" },
  { es: "Profesor/a (secundaria)", it: "Professore (superiori)", amount: 34000, noteEs: "según la comunidad; sube con trienios y sexenios", noteIt: "secondo la regione; sale con l'anzianità" },
  { es: "Enfermero/a", it: "Infermiere", amount: 29000, noteEs: "medio en el sector público", noteIt: "medio nel settore pubblico" },
  { es: "Policía Nacional", it: "Polizia Nazionale", amount: 29000, noteEs: "al inicio de carrera", noteIt: "a inizio carriera" },
];
const PRO_IT = [
  { es: "Médico/a (SSN)", it: "Medico (SSN)", amount: 60000, noteEs: "al inicio; hasta 80.000+ y jefes ~110.000", noteIt: "all'inizio; fino a 80.000+ e primari ~110.000" },
  { es: "Profesor/a", it: "Insegnante (di ruolo)", amount: 30000, noteEs: "sube con la antigüedad", noteIt: "sale con l'anzianità" },
  { es: "Enfermero/a", it: "Infermiere", amount: 28000, noteEs: "CCNL Sanidad; base ~25.000 + complementos", noteIt: "CCNL Sanità; base ~25.000 + accessori" },
  { es: "Policía", it: "Poliziotto", amount: 28000, noteEs: "al inicio de carrera", noteIt: "a inizio carriera" },
];

function Section({ code, rows }: { code: "es" | "it"; rows: typeof PRO_ES }) {
  const { locale } = useLocale();
  const it = locale === "it";
  const eur = (n: number) => `${n.toLocaleString(it ? "it" : "es")} €`;
  const flag = code === "es" ? "🇪🇸" : "🇮🇹";
  const heading = code === "es" ? (it ? "Spagna" : "España") : "Italia";
  const max = Math.max(...rows.map((r) => r.amount));
  const accent = code === "es" ? "#22d3ee" : "#34d399";
  return (
    <section className="mt-8">
      <h2 className="text-lg md:text-xl font-semibold mb-1">{flag} {heading}</h2>
      <p className="text-[11px] text-cyan/70 mb-4">{it ? "Stipendio tipico lordo all'anno." : "Sueldo típico bruto al año."}</p>
      <ol className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.es} className="glass flex items-center gap-3 px-3 py-2.5">
            <span className="flex-1 min-w-0">
              <span className="block truncate font-medium">{it ? r.it : r.es}</span>
              <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                <span className="block h-full rounded-full" style={{ width: `${Math.max(10, (r.amount / max) * 100)}%`, background: `linear-gradient(90deg, ${accent}, #a78bfa)` }} />
              </span>
              <span className="text-[10px] text-muted">{it ? r.noteIt : r.noteEs}</span>
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
          src="/photos/money.jpg"
          alt={t("Monedas de euro", "Monete da un euro")}
          kicker={t("💼 Sueldos públicos · datos oficiales", "💼 Stipendi pubblici · dati ufficiali")}
          title={t("¿CUÁNTO GANA UN", "QUANTO GUADAGNA UN")}
          highlight={t("MÉDICO O UN PROFESOR?", "MEDICO O UN PROF?")}
          stat={t("54.000 €", "60.000 €")}
          statLabel={t("un médico en la pública (al año)", "un medico all'inizio (all'anno)")}
          accent="#22d3ee"
          accent2="#34d399"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {t(
            "Cuánto gana un médico, un profesor, un enfermero o un policía. Trabajan para todos y cobran con dinero público. Sueldos típicos, con la fuente.",
            "Quanto guadagna un medico, un prof, un infermiere o un poliziotto. Lavorano per tutti e sono pagati con soldi pubblici. Stipendi tipici, con la fonte.",
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer title={t("En cristiano", "In parole semplici")} by={t("te lo explica Claro", "te lo spiega Claro")}>
          <p>{t(
            "Un médico, un profesor o un policía trabajan para el Estado: su sueldo lo pagas tú con tus impuestos. No hay una cifra única: depende de la región, de los años trabajados y del puesto. Aquí ves lo que se cobra de forma típica.",
            "Un medico, un prof o un poliziotto lavorano per lo Stato: il loro stipendio lo paghi tu con le tue tasse. Non c'è una cifra unica: dipende dalla regione, dagli anni di lavoro e dal ruolo. Qui vedi quanto si prende in media.",
          )}</p>
        </SimpleExplainer>
      </div>

      <div className="mt-5 glass p-4 border border-amber-400/25">
        <p className="text-xs text-amber-200/90">
          ⚠️ {t(
            "Estas cifras son TÍPICAS (bruto/año), no fijas: cambian mucho según la comunidad/región, la antigüedad y la categoría. Al empezar se cobra menos; con años de carrera, bastante más.",
            "Queste cifre sono TIPICHE (lordo/anno), non fisse: cambiano molto secondo la regione, l'anzianità e la categoria. All'inizio si prende meno; con gli anni, parecchio di più.",
          )}
        </p>
      </div>

      <Section code="es" rows={PRO_ES} />
      <p className="text-[11px] text-muted mt-3">{t("Fuente: ", "Fonte: ")}
        <a href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177025" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{t("INE (Encuesta de Estructura Salarial) y tablas oficiales", "INE (Indagine sulle retribuzioni) e tabelle ufficiali")}</a>.
      </p>

      <Section code="it" rows={PRO_IT} />
      <p className="text-[11px] text-muted mt-3">{t("Fuente: CCNL (contratos del sector público) y datos oficiales.", "Fonte: CCNL (contratti del settore pubblico) e dati ufficiali.")}</p>

      <ShareBar className="mt-6" text={t("💼 En España un médico de la pública cobra ~54.000 €/año; en Italia empieza en ~60.000 €. Un enfermero, ~28.000-29.000 €. 👀 Sueldos públicos típicos, con fuente", "💼 In Spagna un medico pubblico prende ~54.000 €/anno; in Italia parte da ~60.000 €. Un infermiere, ~28.000-29.000 €. 👀 Stipendi pubblici tipici, con fonte")} />

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t("Preguntas frecuentes", "Domande frequenti")}</h2>
        <div className="space-y-2.5">
          {(it
            ? [
                { q: "Quanto guadagna un medico?", a: "In Italia un medico del SSN parte da circa 60.000 € lordi l'anno, sale a 80.000+ con l'anzianità e i primari arrivano a ~110.000 €. In Spagna la media nella sanità pubblica è circa 54.000 €. Varia molto secondo regione e anzianità." },
                { q: "Quanto guadagna un infermiere?", a: "Intorno a 28.000-29.000 € lordi l'anno sia in Italia (CCNL Sanità, base ~25.000 € + accessori) sia in Spagna (media nel pubblico). Cresce con l'anzianità." },
                { q: "Quanto guadagna un insegnante?", a: "In Italia circa 30.000 € lordi l'anno di ruolo (sale con l'anzianità); in Spagna 30.000-38.000 € secondo la regione, con aumenti per trienni e sexenni." },
                { q: "Da dove escono questi stipendi?", a: "Dalle tue tasse: medici, prof, infermieri e poliziotti sono dipendenti pubblici. Le cifre qui sono tipiche (medie), non fisse. Fonti: INE (ES), CCNL e contratti pubblici (IT)." },
              ]
            : [
                { q: "¿Cuánto gana un médico?", a: "En España la media en la sanidad pública es de unos 54.000 € brutos al año (de 35.000 a más de 100.000 según la antigüedad). En Italia un médico del SSN empieza sobre 60.000 € y los jefes llegan a ~110.000 €. Varía mucho por comunidad/región y antigüedad." },
                { q: "¿Cuánto gana un enfermero?", a: "Alrededor de 28.000-29.000 € brutos al año, tanto en España (media en el sector público) como en Italia (CCNL Sanidad, base ~25.000 € + complementos). Sube con la antigüedad." },
                { q: "¿Cuánto gana un profesor?", a: "En España 30.000-38.000 € brutos al año según la comunidad, con subidas por trienios y sexenios; en Italia unos 30.000 € de funcionario de carrera, que suben con la antigüedad." },
                { q: "¿De dónde salen estos sueldos?", a: "De tus impuestos: médicos, profesores, enfermeros y policías son empleados públicos. Las cifras de aquí son típicas (medias), no fijas. Fuentes: INE (ES), CCNL y contratos públicos (IT)." },
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
        <Link href="/sueldos-politicos/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {t("¿Cuánto cobra un político? →", "Quanto guadagna un politico? →")}
        </Link>
        <Link href="/sueldos-alcaldes/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {t("Los sueldos de los alcaldes", "Gli stipendi dei sindaci")}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function ProfesionesClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
