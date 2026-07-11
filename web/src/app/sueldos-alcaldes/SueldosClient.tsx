"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import { COUNTRIES, slugify } from "@/lib/data";
import { formatEuro } from "@/lib/format";
import ranks from "@/data/rankings-es.json";

const esSlugs = new Set(Object.values(COUNTRIES.es.regions).filter((r) => !r.isSample).map((r) => r.slug));

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
        { q: "Quanto guadagna in media un sindaco in Spagna?", a: `La retribuzione media dei ${nf(ranks.salaryReporting)} comuni che comunicano i dati all'ISPA è di ${formatEuro(ranks.salaryAvg)} lordi all'anno. Ma ci sono enormi differenze a seconda della dimensione del comune.` },
        { q: "Tutti i sindaci prendono uno stipendio?", a: `No. ${nf(ranks.salaryZero)} sindaci dichiarano una retribuzione di 0 € e ${nf(ranks.salarySinDedic)} operano senza incarico esclusivo (prendono solo il gettone di presenza o nulla), soprattutto nei comuni piccoli.` },
        { q: "Da dove arrivano questi dati?", a: `Dall'ISPA (Información Salarial de los Puestos de la Administración) del Ministero delle Finanze spagnolo, esercizio ${ranks.year}. È informazione ufficiale e verificabile.` },
      ]
    : [
        { q: "¿Cuál es el alcalde que más cobra de España?", a: `El alcalde de ${top[0].name}, con ${formatEuro(top[0].amount)} brutos al año (${ranks.year}), seguido de ${top[1].name} (${formatEuro(top[1].amount)}) y ${top[2].name} (${formatEuro(top[2].amount)}).` },
        { q: "¿Cuánto cobra un alcalde de media en España?", a: `La retribución media de los ${nf(ranks.salaryReporting)} ayuntamientos que declaran sus datos al ISPA es de ${formatEuro(ranks.salaryAvg)} brutos al año. Pero hay enormes diferencias según el tamaño del municipio.` },
        { q: "¿Todos los alcaldes cobran un sueldo?", a: `No. ${nf(ranks.salaryZero)} alcaldes declaran una retribución de 0 € y ${nf(ranks.salarySinDedic)} ejercen sin dedicación exclusiva (cobran solo por asistencia a plenos o nada), sobre todo en municipios pequeños.` },
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
          {it ? (
            <>Classifica dei sindaci spagnoli più pagati, con dati ufficiali dell'ISPA (Ministero delle Finanze). La media dei {nf(ranks.salaryReporting)} comuni che dichiarano è <span className="text-fg/90 font-medium">{formatEuro(ranks.salaryAvg)}/anno</span> — ma {nf(ranks.salaryZero)} sindaci prendono 0 €.</>
          ) : (
            <>Ranking de los alcaldes que más cobran, con datos oficiales del ISPA (Ministerio de Hacienda). La media de los {nf(ranks.salaryReporting)} ayuntamientos que declaran es <span className="text-fg/90 font-medium">{formatEuro(ranks.salaryAvg)}/año</span> — pero {nf(ranks.salaryZero)} alcaldes cobran 0 €.</>
          )}
        </p>
      </header>

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
