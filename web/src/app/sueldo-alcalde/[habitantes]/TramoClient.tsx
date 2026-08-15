"use client";

import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import ShareFact from "@/components/ShareFact";
import { FUENTE_ES, TAGLIE_ES, nEu } from "@/data/fasce-sindaci";

export type Municipio = { name: string; slug: string; poblacion: number; anual: number };

export type Real = { n: number; mediana: number; media: number; aCero: number } | null;

export type Props = {
  habitantes: number;
  tramoLabel: string;
  tope: number | null;
  nota?: string;
  real: Real;
  municipios: Municipio[];
  municipiosExactos: boolean;
};

const eur = (n: number) => `${nEu(n)} €`;

export default function TramoClient(p: Props) {
  const hab = nEu(p.habitantes);
  const bajoTope = p.tope && p.real ? Math.round(((p.tope - p.real.mediana) / p.tope) * 100) : null;

  return (
    <LocaleProvider force="es">
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <SiteNav />

        <header className="pt-8">
          <p className="text-xs uppercase tracking-widest text-cyan/70">🏛️ Sueldo del alcalde · tope legal y realidad</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2 leading-tight">
            ¿Cuánto cobra el alcalde de un pueblo de <span className="neon-text">{hab} habitantes</span>?
          </h1>

          {/* La respuesta, entera y en la primera frase. */}
          <div className="glass p-5 mt-5 border border-cyan/30">
            {p.tope === null ? (
              <>
                <p className="text-base md:text-lg">
                  En un municipio de <b className="text-fg">{hab} habitantes</b> el alcalde{" "}
                  <b className="text-cyan">no puede tener dedicación exclusiva</b>: la ley no lo permite por debajo de
                  1.000 habitantes.
                </p>
                <p className="text-sm text-muted mt-2">
                  Como mucho puede tener <b className="text-fg/90">dedicación parcial</b> (cobra por las horas que
                  dedica) o solo <b className="text-fg/90">asistencias</b>: una cantidad por cada pleno al que va. Muchos
                  alcaldes de pueblos así <b className="text-fg/90">no cobran nada</b>.
                </p>
                <ShareFact
                  className="mt-3"
                  lang="es"
                  text={`🏛️ ¿Cuánto cobra el alcalde de un pueblo de ${hab} habitantes? Por ley NO puede tener dedicación exclusiva: como mucho parcial o por asistencias. Muchos no cobran nada. 👀`}
                />
              </>
            ) : (
              <>
                <p className="text-base md:text-lg">
                  Un alcalde de un municipio de <b className="text-fg">{hab} habitantes</b> puede cobrar como máximo{" "}
                  <b className="text-cyan text-xl">{eur(p.tope)} al año</b>
                  {p.real && <> — pero la mitad de ellos cobra <b className="text-fg">{eur(p.real.mediana)} o menos</b>.</>}
                </p>
                <p className="text-sm text-muted mt-2">
                  {eur(p.tope)} es el <b className="text-fg/90">tope legal</b> para municipios {p.tramoLabel}, no lo que
                  se cobra de verdad. Cada ayuntamiento decide por debajo de ese techo.
                </p>
                <ShareFact
                  className="mt-3"
                  lang="es"
                  text={
                    p.real
                      ? `🏛️ La ley deja a un alcalde de ${hab} habitantes cobrar hasta ${eur(p.tope)} al año. En la realidad la mitad cobra ${eur(p.real.mediana)} o menos. 👀`
                      : `🏛️ Un alcalde de un municipio de ${hab} habitantes puede cobrar como máximo ${eur(p.tope)} al año (Ley 31/2022). 👀`
                  }
                />
              </>
            )}
          </div>
        </header>

        {/* El dato propio: tope contra realidad. Esto no lo tiene nadie más. */}
        {p.real && p.tope && (
          <section className="mt-8">
            <h2 className="text-lg md:text-xl font-semibold">📊 Lo que permite la ley y lo que se cobra</h2>
            <p className="text-[11px] text-cyan/70 mb-4">
              Calculado por nosotros sobre {p.real.n} municipios españoles de este tamaño con la retribución oficial
              declarada. No es una estimación: son sueldos reales.
            </p>
            <div className="glass p-4 space-y-2.5">
              {[
                { l: "Tope que permite la ley", v: eur(p.tope), c: "#f43f5e" },
                { l: "La mitad de los alcaldes cobra esto o menos", v: eur(p.real.mediana), c: "#22d3ee" },
                { l: "Media de los que hemos medido", v: eur(p.real.media), c: "#a5b4fc" },
              ].map((r) => (
                <div key={r.l} className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-muted">{r.l}</span>
                  <span className="tabular font-semibold shrink-0" style={{ color: r.c }}>{r.v}</span>
                </div>
              ))}
              {bajoTope !== null && bajoTope > 0 && (
                <p className="text-sm pt-2 border-t border-[var(--panel-border)]">
                  Es decir: el alcalde típico de un municipio así cobra un{" "}
                  <b className="text-green">{bajoTope}% menos</b> de lo que la ley le permitiría.
                </p>
              )}
              {p.real.aCero > 0 && (
                <p className="text-sm text-amber-200/90">
                  Y {p.real.aCero === 1 ? "hay 1 alcalde" : `hay ${p.real.aCero} alcaldes`} de este tamaño que{" "}
                  <b>no cobra nada</b> del ayuntamiento.
                </p>
              )}
            </div>
          </section>
        )}

        <div className="mt-8">
          <SimpleExplainer title="En cristiano" by="te lo explica Claro">
            <p>
              La ley no dice lo que cobra tu alcalde. Dice lo <b className="text-fg/90">máximo</b> que puede cobrar,
              según cuánta gente vive en el pueblo. Por debajo de ese techo decide cada ayuntamiento, y por eso dos
              pueblos del mismo tamaño pueden pagar cosas muy distintas.
            </p>
            <p>
              <b className="text-fg/90">Lo que casi nadie sabe:</b> el alcalde no cobra por ser alcalde. Cobra si el
              pleno le aprueba una <b className="text-fg/90">dedicación</b> — exclusiva o parcial. Si no se la aprueban,
              solo cobra <b className="text-fg/90">asistencias</b> por ir a los plenos. Uno de cada tres alcaldes en
              España no cobra sueldo del ayuntamiento.
            </p>
          </SimpleExplainer>
        </div>

        {p.municipios.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg md:text-xl font-semibold">
              {p.municipiosExactos ? "🏙️ Municipios reales de este tamaño" : "🏙️ Los municipios más pequeños que tenemos"}
            </h2>
            <p className="text-[11px] text-cyan/70 mb-4">
              {p.municipiosExactos
                ? "Sueldos oficiales declarados al ISPA. Pincha para ver también las cuentas del ayuntamiento."
                : `En nuestro archivo los municipios con cuentas publicadas empiezan sobre los 10.000 habitantes, así que para ${hab} no tenemos un ejemplo real. Estos son los más pequeños que cubrimos.`}
            </p>
            <ul className="space-y-1.5">
              {p.municipios.map((m) => (
                <li key={m.slug}>
                  <Link href={`/es/${m.slug}/`} className="glass flex items-center gap-3 px-3 py-2.5 hover:border-cyan transition">
                    <span className="flex-1 min-w-0">
                      <span className="block truncate font-medium">{m.name}</span>
                      <span className="block text-[11px] text-muted">{nEu(m.poblacion)} habitantes</span>
                    </span>
                    <span className="tabular text-sm font-semibold text-cyan shrink-0">
                      {m.anual > 0 ? `${eur(m.anual)}/año` : "sin sueldo"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-3">¿Tu pueblo es de otro tamaño?</h2>
          <div className="flex flex-wrap gap-2">
            {TAGLIE_ES.filter((t) => t !== p.habitantes).map((t) => (
              <Link
                key={t}
                href={`/sueldo-alcalde/${t}-habitantes/`}
                className="px-3.5 py-1.5 rounded-full text-sm border border-[var(--panel-border)] text-muted hover:text-fg hover:border-cyan transition"
              >
                {nEu(t)} habitantes
              </Link>
            ))}
          </div>
        </section>

        <ShareBar
          className="mt-8"
          lang="es"
          text={
            p.tope
              ? `🏛️ ¿Cuánto cobra el alcalde de un pueblo de ${hab} habitantes? La ley deja hasta ${eur(p.tope)} al año, pero lo que se cobra de verdad es otra cosa. 👀`
              : `🏛️ En un pueblo de ${hab} habitantes el alcalde no puede tener dedicación exclusiva por ley. Muchos no cobran nada. 👀`
          }
        />

        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Preguntas frecuentes</h2>
          <div className="space-y-2.5">
            {[
              {
                q: `¿Cuánto cobra el alcalde de un pueblo de ${hab} habitantes?`,
                a: p.tope === null
                  ? `En municipios de menos de 1.000 habitantes el alcalde no puede tener dedicación exclusiva. Como mucho dedicación parcial, o solo asistencias por cada pleno. Muchos no cobran nada del ayuntamiento.`
                  : `Como máximo ${eur(p.tope)} al año: es el tope que fija la ley para municipios ${p.tramoLabel}.` +
                    (p.real ? ` En la práctica la mitad de los alcaldes de este tamaño cobra ${eur(p.real.mediana)} o menos.` : ""),
              },
              {
                q: "¿Ese tope es lo que cobran de verdad?",
                a: "No. La ley solo fija el máximo; por debajo decide cada ayuntamiento en un pleno. Por eso dos municipios del mismo tamaño pueden pagar cantidades muy distintas, y algunos alcaldes no cobran nada.",
              },
              {
                q: "¿Todos los alcaldes cobran sueldo?",
                a: "No. El alcalde solo cobra si el pleno le aprueba una dedicación, exclusiva o parcial. Si no, únicamente percibe asistencias por acudir a los plenos. En España uno de cada tres alcaldes no cobra sueldo del ayuntamiento.",
              },
              {
                q: "¿Quién decide el sueldo del alcalde?",
                a: "El pleno del ayuntamiento, dentro del tope máximo que fija la Ley de Presupuestos Generales del Estado según los habitantes del municipio.",
              },
            ].map((f, i) => (
              <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
                <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
                <p className="text-sm text-muted mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 glass p-4">
          <p className="text-[11px] text-muted">
            <b className="text-fg/80">Fuentes.</b> Topes:{" "}
            <a href={FUENTE_ES.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{FUENTE_ES.name}</a>.
            Retribuciones reales: MTDFP · ISPA (Información Salarial de Puestos de la Administración), ejercicio 2024.
            Las medianas y medias de esta página las hemos calculado nosotros sobre esos datos oficiales.
          </p>
        </section>

        <nav className="mt-8 flex flex-wrap gap-3">
          <Link href="/sueldos-alcaldes/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
            El ranking de todos los alcaldes →
          </Link>
          <Link href="/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            Las cuentas de tu ayuntamiento
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Hecho en Italia 🇮🇹</p>
        </footer>
      </main>
    </LocaleProvider>
  );
}
