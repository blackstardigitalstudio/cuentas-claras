"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import { COUNTRIES, slugify } from "@/lib/data";
import { formatEuro, formatCompact } from "@/lib/format";
import ranks from "@/data/rankings-es.json";
import { buildFaqs } from "./faq";

const pct = Math.round((ranks.debtFree / ranks.debtCount) * 100);
const esSlugs = new Set(Object.values(COUNTRIES.es.regions).filter((r) => !r.isSample).map((r) => r.slug));

function CityName({ name }: { name: string }) {
  const slug = slugify(name);
  if (esSlugs.has(slug)) return <Link href={`/es/${slug}/`} className="font-medium hover:text-cyan">{name}</Link>;
  return <span className="font-medium">{name}</span>;
}

function Inner() {
  const { locale } = useLocale();
  const it = locale === "it";
  const top = ranks.topDebt;
  const max = top[0].amount;
  const nf = (n: number) => n.toLocaleString(it ? "it" : "es");

  const faqs = buildFaqs(it);

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/money.jpg"
          alt={it ? "Moneta da 2 euro" : "Moneda de 2 euros"}
          kicker={it ? `🇪🇸 Spagna · dati ufficiali · ${ranks.year}` : `🇪🇸 España · datos oficiales · ${ranks.year}`}
          title={it ? "QUALI COMUNI HANNO PIÙ" : "¿QUÉ MUNICIPIOS TIENEN MÁS"}
          highlight={it ? "DEBITO?" : "DEUDA?"}
          stat={formatCompact(top[0].amount, locale)}
          statLabel={it ? `la più indebitata (${top[0].name})` : `la más endeudada (${top[0].name})`}
          accent="#fdba74"
          accent2="#f472b6"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {it
            ? "Quali comuni spagnoli devono più soldi? Ecco chi ha più debito, con dati ufficiali."
            : "¿Qué municipios españoles deben más dinero? Estos son los que más deben, con datos oficiales."}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer
          title={it ? "In parole semplici" : "En cristiano"}
          by={it ? "te lo spiega Claro" : "te lo explica Claro"}
          moreLabel={it ? "Spiegamelo un po' meglio" : "Explícamelo un poco mejor"}
          more={
            it ? (
              <p>«Debito residuo» è il termine ufficiale: quanto un comune deve ancora restituire in un dato momento. Per confrontare città grandi e piccole si guarda il <span className="text-fg/80">debito per abitante</span> (il debito diviso tra i cittadini). Fonte: Ministero delle Finanze.</p>
            ) : (
              <p>«Deuda viva» es el término oficial: cuánto debe devolver aún un ayuntamiento en un momento dado. Para comparar ciudades grandes y pequeñas se mira la <span className="text-fg/80">deuda por habitante</span> (la deuda repartida entre los vecinos). Fuente: Ministerio de Hacienda.</p>
            )
          }
        >
          <p>{it
            ? "Il debito è come il mutuo di casa: soldi presi in prestito da restituire. Un po' è normale; il problema è quando è troppo."
            : "La deuda es como la hipoteca de casa: dinero prestado que hay que devolver. Un poco es normal; el problema es cuando es demasiada."}</p>
        </SimpleExplainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { v: formatCompact(top[0].amount, locale), l: it ? `Più indebitata (${top[0].name})` : `Más endeudado (${top[0].name})`, c: "#fdba74" },
          { v: formatCompact(ranks.debtTotal, locale), l: it ? "Debito totale (comuni)" : "Deuda total (ayuntamientos)", c: "#f472b6" },
          { v: `${pct}%`, l: it ? "Comuni senza debito" : "Municipios sin deuda", c: "#34d399" },
        ].map((k) => (
          <div key={k.l} className="glass p-4 text-center">
            <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
            <p className="text-[11px] text-muted mt-1">{k.l}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg md:text-xl font-semibold mb-4">{it ? `I ${top.length} comuni più indebitati` : `Los ${top.length} municipios más endeudados`}</h2>
        <ol className="space-y-1.5">
          {top.map((d, i) => (
            <li key={`${d.name}-${i}`} className="glass flex items-center gap-3 px-3 py-2.5">
              <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="block truncate"><CityName name={d.name} /></span>
                <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-amber to-magenta" style={{ width: `${Math.max(6, (d.amount / max) * 100)}%` }} />
                </span>
              </span>
              <span className="tabular text-sm font-semibold text-[#fdba74] shrink-0">{formatEuro(d.amount)}</span>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-muted mt-3">
          {it ? "Fonte: " : "Fuente: "}
          <a href={ranks.debtSource.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{ranks.debtSource.name}</a>
        </p>
      </section>

      {ranks.debtPerCapita && ranks.debtPerCapita.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg md:text-xl font-semibold mb-1">{it ? "Chi deve di più per abitante" : "Los que más deben por habitante"}</h2>
          <p className="text-[11px] text-cyan/70 mb-4">{it ? `Il debito diviso tra i cittadini — più giusto per confrontare città grandi e piccole (comuni oltre ${nf(ranks.debtPerCapitaMinPop)} abitanti).` : `La deuda repartida entre los vecinos — más justo para comparar ciudades grandes y pequeñas (municipios de más de ${nf(ranks.debtPerCapitaMinPop)} habitantes).`}</p>
          <ol className="space-y-1.5">
            {ranks.debtPerCapita.slice(0, 20).map((d, i) => (
              <li key={d.name} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-medium"><CityName name={d.name} /></span>
                  <span className="text-[10px] text-muted">{formatCompact(d.debt, locale)} · {nf(d.pop)} {it ? "ab." : "hab."}</span>
                </span>
                <span className="tabular text-right shrink-0">
                  <span className="block text-sm font-semibold text-[#fdba74]">{formatEuro(d.perCapita)}</span>
                  <span className="block text-[10px] text-muted">{it ? "per abitante" : "por habitante"}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-3">{it ? "Debito: " : "Deuda: "}{ranks.debtSource.name}. {it ? "Popolazione: INE, censimento al 1/1/2025." : "Población: INE, padrón a 1/1/2025."}</p>
        </section>
      )}

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
        <Link href="/sueldos-alcaldes/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {it ? "Vedi gli stipendi dei sindaci →" : "Ver los sueldos de los alcaldes →"}
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

export default function DeudaClient() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
