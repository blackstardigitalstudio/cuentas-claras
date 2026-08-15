"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import { COUNTRIES, slugify } from "@/lib/data";
import { formatEuro } from "@/lib/format";
import ranks from "@/data/rankings-es.json";
import { TAGLIE_ES, nEu } from "@/data/fasce-sindaci";

const esSlugs = new Set(Object.values(COUNTRIES.es.regions).filter((r) => !r.isSample).map((r) => r.slug));

// TOPE máximo que la ley permite cobrar a un alcalde, según los habitantes del
// municipio. Ley 31/2022 (Presupuestos Generales del Estado 2023), los últimos
// aprobados: al prorrogarse el presupuesto, estos límites siguen de referencia.
// OJO: es el techo legal, NO lo que se cobra de verdad (ver el contraste abajo).
const TOPES = [
  { hab: "Más de 500.000", max: 116160.05 },
  { hab: "De 300.001 a 500.000", max: 104544.03 },
  { hab: "De 150.001 a 300.000", max: 92928.03 },
  { hab: "De 75.001 a 150.000", max: 87120.59 },
  { hab: "De 50.001 a 75.000", max: 75504.62 },
  { hab: "De 20.001 a 50.000", max: 63888.61 },
  { hab: "De 10.001 a 20.000", max: 58080.05 },
  { hab: "De 5.001 a 10.000", max: 52272.61 },
  { hab: "De 1.000 a 5.000", max: 46464.02 },
];

function CityName({ name }: { name: string }) {
  const slug = slugify(name);
  if (esSlugs.has(slug)) return <Link href={`/es/${slug}/`} className="font-medium hover:text-cyan">{name}</Link>;
  return <span className="font-medium">{name}</span>;
}

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const top = ranks.topSalaries;
  const max = top[0].amount;
  const nf = (n: number) => n.toLocaleString(it ? "it" : "es");

  const faqs = it
    ? [
        { q: "Qual è il sindaco più pagato di Spagna?", a: `Il sindaco di ${top[0].name}, con ${formatEuro(top[0].amount)} lordi all'anno (${ranks.year}), seguito da ${top[1].name} (${formatEuro(top[1].amount)}) e ${top[2].name} (${formatEuro(top[2].amount)}).` },
        { q: "Quanto guadagna in media un sindaco in Spagna?", a: `In media ${formatEuro(ranks.salaryAvg)} lordi all'anno, tra i ${nf(ranks.salaryReporting)} comuni che comunicano i dati. Ma la media dice poco: tra un paesino e una grande città c'è un abisso.` },
        { q: "Quanto guadagna un sindaco al mese?", a: `Circa ${formatEuro(Math.round(ranks.salaryAvg / 12))} lordi al mese in media (i ${formatEuro(ranks.salaryAvg)} annui divisi per 12). Quello di Madrid, il più pagato, arriva a circa ${formatEuro(Math.round(ranks.topSalaries[0].amount / 12))} al mese.` },
        { q: "Quanto guadagna il sindaco di un paesino?", a: `Spesso niente. Su ${nf(ranks.salaryReporting)} comuni che dichiarano, ${nf(ranks.salaryZero)} sindaci prendono 0 € — uno su tre. Nei paesi piccoli il sindaco di solito continua il suo lavoro di sempre e, al massimo, gli pagano le sedute del consiglio.` },
        { q: "Tutti i sindaci prendono uno stipendio?", a: `No. ${nf(ranks.salaryZero)} sindaci dichiarano una retribuzione di 0 € e ${nf(ranks.salarySinDedic)} operano senza incarico esclusivo (prendono solo il gettone di presenza o nulla), soprattutto nei comuni piccoli.` },
        { q: "Da cosa dipende quanto guadagna un sindaco?", a: "Dalla dimensione del comune e dalla «dedizione»: chi si dedica solo al comune (esclusiva) prende uno stipendio fisso; chi no, prende poco o nulla. I tetti li fissa la legge in base agli abitanti." },
        { q: "Quanto guadagna il sindaco di un piccolo paese?", a: "Spesso 0 € o pochi euro: nei comuni piccoli il sindaco di solito continua il suo lavoro normale e prende solo un rimborso per le sedute del consiglio." },
        { q: "Da dove arrivano questi dati?", a: `Dall'ISPA (Información Salarial de los Puestos de la Administración) del Ministero delle Finanze spagnolo, esercizio ${ranks.year}. È informazione ufficiale e verificabile.` },
      ]
    : [
        { q: "¿Cuál es el alcalde que más cobra de España?", a: `El alcalde de ${top[0].name}, con ${formatEuro(top[0].amount)} brutos al año (${ranks.year}), seguido de ${top[1].name} (${formatEuro(top[1].amount)}) y ${top[2].name} (${formatEuro(top[2].amount)}).` },
        { q: "¿Cuánto cobra un alcalde de media en España?", a: `De media, ${formatEuro(ranks.salaryAvg)} brutos al año entre los ${nf(ranks.salaryReporting)} ayuntamientos que dan sus datos. Pero la media dice poco: entre un pueblo pequeño y una gran ciudad hay un abismo.` },
        { q: "¿Cuánto cobra un alcalde al mes?", a: `Unos ${formatEuro(Math.round(ranks.salaryAvg / 12))} brutos al mes de media (los ${formatEuro(ranks.salaryAvg)} anuales repartidos entre 12). El de Madrid, el que más cobra, se va a unos ${formatEuro(Math.round(ranks.topSalaries[0].amount / 12))} al mes.` },
        { q: "¿Cuánto cobra el alcalde de un pueblo pequeño?", a: `Muchas veces, nada. De los ${nf(ranks.salaryReporting)} ayuntamientos que declaran, ${nf(ranks.salaryZero)} alcaldes cobran 0 € — uno de cada tres. En los pueblos pequeños el alcalde suele seguir con su trabajo de siempre y, como mucho, le pagan por ir a los plenos.` },
        { q: "¿Todos los alcaldes cobran un sueldo?", a: `No. ${nf(ranks.salaryZero)} alcaldes cobran 0 €, y ${nf(ranks.salarySinDedic)} no se dedican solo al ayuntamiento: siguen con su trabajo y cobran únicamente por ir a los plenos, o nada. Pasa sobre todo en los pueblos pequeños.` },
        { q: "¿De qué depende cuánto cobra un alcalde?", a: "Del tamaño del municipio y de su «dedicación»: quien se dedica solo al ayuntamiento (exclusiva) cobra un sueldo fijo; quien no, cobra poco o nada. Los topes los fija la ley según la población." },
        { q: "¿Cuánto cobra el alcalde de un pueblo pequeño?", a: "A menudo 0 € o muy poco: en los municipios pequeños el alcalde suele seguir con su trabajo normal y solo cobra por asistir a los plenos." },
        { q: "¿De dónde salen estos datos?", a: `Del ISPA (Información Salarial de los Puestos de la Administración) del Ministerio de Hacienda y Función Pública, ejercicio ${ranks.year}. Es información oficial y verificable.` },
      ];

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/money.jpg"
          alt={it ? "Moneta da 2 euro" : "Moneda de 2 euros"}
          kicker={it ? `🇪🇸 Spagna · stipendi ufficiali · ${ranks.year}` : `🇪🇸 España · sueldos oficiales · ${ranks.year}`}
          title={it ? "QUANTO GUADAGNA UN SINDACO" : "¿CUÁNTO COBRA UN ALCALDE"}
          highlight={it ? "IN SPAGNA?" : "EN ESPAÑA?"}
          stat={formatEuro(top[0].amount)}
          statLabel={it ? "il sindaco più pagato (Madrid)" : "el que más cobra (Madrid)"}
          accent="#a5b4fc"
          accent2="#22d3ee"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {it
            ? "Quanto guadagna un sindaco in Spagna? Ecco chi prende di più, con dati ufficiali."
            : "¿Cuánto cobra un alcalde en España? Estos son los que más cobran, con datos oficiales."}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer
          title={it ? "In parole semplici" : "En cristiano"}
          by={it ? "te lo spiega Claro" : "te lo explica Claro"}
          moreLabel={it ? "Spiegamelo un po' meglio" : "Explícamelo un poco mejor"}
          more={
            it ? (
              <p>Nei paesi piccoli molti sindaci prendono poco o nulla (lavorano senza incarico esclusivo). Nelle grandi città lo stipendio è più alto. È un dato ufficiale, comunicato all'ISPA del Ministero delle Finanze spagnolo.</p>
            ) : (
              <p>En los pueblos pequeños muchos alcaldes cobran poco o nada: siguen con su trabajo de siempre y solo les pagan por ir a los plenos. En las grandes ciudades sí es un sueldo completo. Son datos oficiales, los que cada ayuntamiento declara al Ministerio de Hacienda.</p>
            )
          }
        >
          <p>{it
            ? "Il sindaco è pagato per gestire il comune. Alcuni prendono molto, altri poco, altri niente: dipende dalla grandezza del paese."
            : "El alcalde cobra por llevar el ayuntamiento. Unos cobran mucho, otros poco y otros nada: depende del tamaño del pueblo."}</p>
        </SimpleExplainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { v: formatEuro(ranks.topSalaries[0].amount), l: it ? `Massimo (${ranks.topSalaries[0].name})` : `Máximo (${ranks.topSalaries[0].name})`, c: "#a5b4fc" },
          { v: formatEuro(ranks.salaryAvg), l: it ? "Media dichiarata" : "Media declarada", c: "#22d3ee" },
          { v: nf(ranks.salaryZero), l: it ? "Sindaci che prendono 0 €" : "Alcaldes que cobran 0 €", c: "#f472b6" },
        ].map((k) => (
          <div key={k.l} className="glass p-4 text-center">
            <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
            <p className="text-[11px] text-muted mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold mb-4">{it ? `I ${top.length} sindaci più pagati` : `Los ${top.length} alcaldes que más cobran`}</h2>
        <ol className="space-y-1.5">
          {top.map((s, i) => (
            <li key={`${s.name}-${i}`} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate"><CityName name={s.name} /></span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${Math.max(6, (s.amount / max) * 100)}%` }} />
                </span>
                {s.prov && <span className="text-[10px] text-muted">{s.prov}{s.dedic ? ` · ${s.dedic}` : ""}</span>}
              </span>
              <span className="tabular text-sm font-semibold text-[#a5b4fc] shrink-0">{formatEuro(s.amount)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">
          {it ? "Fonte: " : "Fuente: "}
          <a href={ranks.salarySource.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{ranks.salarySource.name}</a>
        </p>
      </section>

      {/* Tope legal por habitantes: es LA búsqueda ("cuánto cobra el alcalde de un
          pueblo de 500 habitantes"). Va junto al contraste con lo que se cobra
          de verdad, si no da una idea falsa. */}
      <section className="mt-12">
        <h2 className="text-lg md:text-xl font-semibold">
          📊 {it ? "Quanto può guadagnare, secondo gli abitanti" : "Cuánto puede cobrar, según los habitantes"}
        </h2>
        <p className="text-[11px] text-cyan/70 mb-4">
          {it
            ? "Il massimo che la legge permette. Non è quello che prende: è il tetto che non può superare."
            : "El máximo que permite la ley. No es lo que cobra: es el techo que no puede pasar."}
        </p>
        <ol className="space-y-1.5">
          {TOPES.map((t2) => (
            <li key={t2.hab} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium">{t2.hab} {it ? "abitanti" : "habitantes"}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${(t2.max / TOPES[0].max) * 100}%` }} />
                </span>
              </span>
              <span className="tabular text-sm font-semibold text-[#a5b4fc] shrink-0">{formatEuro(Math.round(t2.max))}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">
          {it
            ? "Fonte: Ley 31/2022 (Presupuestos Generales del Estado 2023), gli ultimi approvati. Nei comuni sotto i 1.000 abitanti il sindaco non può avere l'incarico esclusivo: al massimo parziale, con tetti più bassi."
            : "Fuente: Ley 31/2022 (Presupuestos Generales del Estado 2023), los últimos aprobados. En municipios de menos de 1.000 habitantes el alcalde no puede tener dedicación exclusiva: como mucho parcial, con topes más bajos."}
        </p>

        {/* Atajo por tamaño: la gente no busca "cuánto cobra un alcalde", busca
            "de un pueblo de 500 habitantes". Cada ficha lleva a la página que
            responde justo a eso, con el tope Y la mediana real. */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-1">
            {it ? "Quanti abitanti ha il tuo comune?" : "¿Cuántos habitantes tiene tu pueblo?"}
          </p>
          <p className="text-[11px] text-cyan/70 mb-3">
            {it
              ? "Scegli la dimensione: ti diciamo il tetto di legge e quanto prendono davvero i sindaci di quella taglia."
              : "Elige el tamaño: te decimos el tope legal y lo que cobran de verdad los alcaldes de ese tamaño."}
          </p>
          <div className="flex flex-wrap gap-2">
            {TAGLIE_ES.map((t2) => (
              <Link
                key={t2}
                href={`/sueldo-alcalde/${t2}-habitantes/`}
                className="px-3.5 py-2 rounded-full text-sm border border-[var(--panel-border)] text-muted hover:text-fg hover:border-cyan transition"
              >
                {nEu(t2)} {it ? "abitanti" : "habitantes"}
              </Link>
            ))}
          </div>
        </div>

        <div className="glass p-4 mt-3 border border-amber-400/25">
          <p className="text-sm text-amber-200/90">
            ⚠️ {it
              ? `Attenzione a non confondersi: questo è il tetto, non la realtà. La media vera è ${formatEuro(ranks.salaryAvg)} all'anno e ${nf(ranks.salaryZero)} sindaci su ${nf(ranks.salaryReporting)} — uno su tre — prendono 0 €.`
              : `Cuidado con confundirlo: esto es el techo, no la realidad. La media de verdad es ${formatEuro(ranks.salaryAvg)} al año y ${nf(ranks.salaryZero)} alcaldes de ${nf(ranks.salaryReporting)} — uno de cada tres — cobran 0 €.`}
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">{it ? "Domande frequenti" : "Preguntas frecuentes"}</h2>
        <div className="space-y-2.5">
          {faqs.map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href="/deuda-municipios/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {it ? "Vedi il debito dei comuni →" : "Ver la deuda de los municipios →"}
        </Link>
        <Link href="/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
          {it ? "Mappa interattiva" : "Mapa interactivo"}
        </Link>
      </nav>

      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}

export default function SueldosClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
