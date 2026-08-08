"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import SimpleExplainer from "@/components/SimpleExplainer";
import { COUNTRIES, slugify } from "@/lib/data";
import { formatEuro, formatCompact } from "@/lib/format";
import ranks from "@/data/rankings-es.json";

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

  const faqs = it
    ? [
        { q: "Qual è la città più indebitata di Spagna?", a: `${top[0].name}, con un debito residuo di ${formatEuro(top[0].amount)} al 31/12/${ranks.year}, seguita da ${top[1].name} (${formatEuro(top[1].amount)}) e ${top[2].name} (${formatEuro(top[2].amount)}).` },
        { q: "Quanto debito hanno in totale i comuni spagnoli?", a: `Il debito residuo dell'insieme dei comuni somma circa ${formatEuro(ranks.debtTotal)} al 31/12/${ranks.year}, secondo il Ministero delle Finanze spagnolo.` },
        { q: "Quanti comuni non hanno debito?", a: `${nf(ranks.debtFree)} comuni su ${nf(ranks.debtCount)} (${pct}%) non registrano alcun debito residuo. Il debito è concentrato nelle grandi città.` },
        { q: "È un male che un comune abbia debito?", a: "Non sempre: come un mutuo, il debito serve per grandi investimenti (scuole, strade). Il problema è quando è troppo rispetto a quanto il comune incassa." },
        { q: "Perché alcune città devono più di altre?", a: "Dipende dalla dimensione, dagli investimenti fatti e dalla gestione passata. Le grandi città concentrano quasi tutto il debito; molti comuni piccoli ne hanno zero." },
        { q: "Cos'è il debito residuo?", a: `Sono i soldi che il comune ha preso in prestito e non ha ancora finito di restituire — come il mutuo di casa. In Europa lo misurano tutti allo stesso modo, così i comuni si possono confrontare davvero.` },
      ]
    : [
        { q: "¿Cuál es la ciudad más endeudada de España?", a: `${top[0].name}, con una deuda viva de ${formatEuro(top[0].amount)} a 31/12/${ranks.year}, seguida de ${top[1].name} (${formatEuro(top[1].amount)}) y ${top[2].name} (${formatEuro(top[2].amount)}).` },
        { q: "¿Cuánta deuda tienen en total los ayuntamientos españoles?", a: `La deuda viva del conjunto de los ayuntamientos suma unos ${formatEuro(ranks.debtTotal)} a 31/12/${ranks.year}, según el Ministerio de Hacienda.` },
        { q: "¿Cuántos municipios no tienen deuda?", a: `${nf(ranks.debtFree)} de ${nf(ranks.debtCount)} municipios (${pct}%) no registran ninguna deuda viva. La deuda se concentra en las grandes ciudades.` },
        { q: "¿Es malo que un ayuntamiento tenga deuda?", a: "No siempre: como una hipoteca, la deuda sirve para grandes inversiones (colegios, calles). El problema es cuando es demasiada frente a lo que el ayuntamiento ingresa." },
        { q: "¿Por qué unas ciudades deben más que otras?", a: "Depende del tamaño, de las inversiones hechas y de la gestión pasada. Las grandes ciudades concentran casi toda la deuda; muchos municipios pequeños tienen cero." },
        { q: "¿Qué es la deuda viva?", a: `Es el dinero que el ayuntamiento pidió prestado y todavía no ha terminado de devolver — como una hipoteca. En toda Europa se mide igual, así que los municipios se pueden comparar de verdad. El dato lo publica el Ministerio de Hacienda.` },
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
          kicker={it ? `🇪🇸 Spagna · dati ufficiali · ${ranks.year}` : `🇪🇸 España · datos oficiales · ${ranks.year}`}
          title={it ? "QUALI COMUNI HANNO PIÙ" : "¿QUÉ MUNICIPIOS TIENEN MÁS"}
          highlight={it ? "DEBITO?" : "DEUDA?"}
          stat={formatCompact(top[0].amount)}
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
          { v: formatCompact(top[0].amount), l: it ? `Più indebitata (${top[0].name})` : `Más endeudado (${top[0].name})`, c: "#fdba74" },
          { v: formatCompact(ranks.debtTotal), l: it ? "Debito totale (comuni)" : "Deuda total (ayuntamientos)", c: "#f472b6" },
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
                  <span className="text-[10px] text-muted">{formatCompact(d.debt)} · {nf(d.pop)} {it ? "ab." : "hab."}</span>
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
