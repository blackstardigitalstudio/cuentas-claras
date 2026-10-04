"use client";

// Le notizie della zona toccata sulla mappa.
//
// Sta SUBITO SOTTO la mappa, non nel pannello a destra: sul telefono quel
// pannello finisce in fondo alla pagina, e toccando una provincia non si
// vedrebbe cambiare niente. Così il risultato del tocco compare dove già stai
// guardando.
//
// I dati arrivano da src/data/news-luoghi.json, rigenerato prima di ogni build
// da scripts/luoghi-notizie.mjs (che riconosce il posto dal titolo, con regole
// prudenti: meglio una notizia in meno che una attribuita al paese sbagliato).
// Sono titoli di giornali altrui: si mostrano con la fonte e il link, mai copiati.

import { useMemo, useState } from "react";
import luoghi from "@/data/news-luoghi.json";
import newsData from "@/data/news.json";
import { useLocale } from "@/i18n/LocaleProvider";
import type { CountryCode } from "@/lib/data";

type Voce = { t: string; s: string; u: string; d: string | null; k: string | null };
type Indice = Record<string, Voce[]>;
const DATI = luoghi as unknown as { es: Indice; it: Indice };
const NEWS = newsData as unknown as Record<string, { title: string; source: string; url: string; date: string | null }[]>;

const VISIBILI = 3;

// Il nome della provincia arriva dalla mappa (es. "Massa-Carrara") e dal menu a
// tendina (che a volte lo scrive "Massa-carrara"): si confrontano senza
// maiuscole, accenti e segni.
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");

function trovaProvincia(paese: CountryCode, selezione: string): string | null {
  const indice = DATI[paese];
  const cercato = norm(selezione);
  for (const chiave of Object.keys(indice)) {
    if (norm(chiave) === cercato) return chiave;
    if (chiave.split("/").some((parte) => norm(parte) === cercato)) return chiave;
  }
  return null;
}

// "València/Valencia" -> "Valencia" (in Spagna il nome castigliano è il secondo);
// "Bolzano/Bozen" -> "Bolzano"; "Santa Cruz De Tenerife" -> "Santa Cruz de Tenerife".
function nomeLeggibile(paese: CountryCode, nome: string): string {
  const parti = nome.split("/");
  const scelto = paese === "es" ? parti[parti.length - 1] : parti[0];
  return scelto.replace(/(?<=\s)(De|Di|Del|Della|E|Nell')(?=\s|\p{L})/gu, (m) => m.toLowerCase());
}

// Data fissa sul fuso di Madrid: uguale quando la pagina si genera e quando si
// apre nel browser (una data "relativa" tipo "3 giorni fa" cambierebbe fra i
// due momenti e romperebbe l'idratazione).
function data(iso: string | null, locale: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Madrid" }).format(d);
}

function Freccia() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M5.5 10.5 10.5 5.5M6.5 5.5h4v4" />
    </svg>
  );
}

function Riga({ v, i, locale, tema }: { v: Voce; i: number; locale: string; tema: string | null }) {
  const it = locale === "it";
  // La fonte può essere lunghissima ("Il Fatto Quotidiano - Edizione di…"): tiene
  // al massimo metà riga e si taglia lì. La data viene subito dopo e resta intera;
  // se manca spazio è il tema, l'informazione meno utile, a tagliarsi per ultimo.
  const dopo = [data(v.d, locale), tema].filter(Boolean).join(" · ");
  return (
    <li>
      <a
        href={v.u}
        target="_blank"
        rel="noopener noreferrer"
        className="news-row group flex items-start gap-3 rounded-lg px-2.5 py-3 -mx-2.5"
        style={{ "--d": `${Math.min(i, 3) * 30}ms` } as React.CSSProperties}
      >
        <span className="flex-1 min-w-0">
          <span className="text-[0.9375rem] leading-snug text-fg line-clamp-2 [overflow-wrap:anywhere]" title={v.t}>{v.t}</span>
          <span className="flex mt-1 text-xs text-muted min-w-0">
            <span className="truncate shrink-0 max-w-[55%]" title={v.s}>{v.s}</span>
            {dopo && <span className="truncate min-w-0 whitespace-pre">{v.s ? " · " : ""}{dopo}</span>}
          </span>
        </span>
        <span className="mt-1 shrink-0 text-muted group-hover:text-cyan transition-colors">
          <Freccia />
        </span>
        <span className="sr-only">{it ? "(si apre in una nuova scheda)" : "(se abre en una pestaña nueva)"}</span>
      </a>
    </li>
  );
}

// `provincia` è sempre un nome della mappa. `citta` c'è solo quando hai scelto
// una città che non è capoluogo (Marbella, Giugliano…): le notizie restano quelle
// della sua provincia, e il titolo lo dice chiaro invece di far finta che parlino
// proprio di quel comune.
export default function NewsByPlace({ country, provincia, citta }: { country: CountryCode; provincia: string; citta: string | null }) {
  const { locale, m } = useLocale();
  const it = locale === "it";
  const [tutte, setTutte] = useState(false);

  const chiave = useMemo(() => trovaProvincia(country, provincia), [country, provincia]);
  const voci = chiave ? DATI[country][chiave] : [];
  const nome = nomeLeggibile(country, chiave ?? provincia);
  const diProvincia = !!citta && norm(citta) !== norm(nome);
  const titolo = it
    ? diProvincia ? `Notizie dalla provincia di ${nome}` : `Notizie su ${nome}`
    : diProvincia ? `Noticias de la provincia de ${nome}` : `Noticias de ${nome}`;
  const temi = m.scoop.themes as unknown as Record<string, string>;

  // Quando cambi zona l'elenco torna corto: aprire "tutte" vale per una zona.
  const zona = `${country}-${provincia}`;
  const [visto, setVisto] = useState(zona);
  if (visto !== zona) {
    setVisto(zona);
    setTutte(false);
  }

  // Zona senza notizie: lo diciamo chiaro e mostriamo le ultime del paese, così
  // il tocco non finisce mai nel vuoto.
  const ultime = useMemo(() => {
    if (voci.length) return [];
    const lista = NEWS[country] || [];
    return [...lista]
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 2)
      .map((n) => ({ t: n.title, s: n.source, u: n.url, d: n.date, k: null }) as Voce);
  }, [voci.length, country]);

  const mostrate = tutte ? voci : voci.slice(0, VISIBILI);
  const paese = country === "es" ? (it ? "Spagna" : "España") : "Italia";

  return (
    <section className="mt-5 pt-5 border-t border-[var(--panel-border)]" aria-labelledby="notizie-zona">
      <div aria-live="polite">
        <h3 id="notizie-zona" className="text-base font-semibold text-fg [overflow-wrap:anywhere]">
          {titolo}
        </h3>
        <p className="mt-0.5 text-xs text-muted">
          {voci.length
            ? it
              ? `${voci.length === 1 ? "1 notizia recente" : `${voci.length} notizie recenti`} dai giornali`
              : `${voci.length === 1 ? "1 noticia reciente" : `${voci.length} noticias recientes`} en la prensa`
            : ultime.length
              ? it
                ? `Ancora niente su ${nome}. Intanto, le ultime in ${paese}:`
                : `Todavía nada sobre ${nome}. Mientras, lo último en ${paese}:`
              : it
                ? `Ancora niente su ${nome}. Riprova più tardi: si aggiorna ogni 2 ore.`
                : `Todavía nada sobre ${nome}. Vuelve más tarde: se actualiza cada 2 horas.`}
        </p>
      </div>

      {/* key = la zona: cambiando zona le righe sono elementi nuovi e si vede
          l'entrata (180 ms, vedi .news-row in globals.css). Niente uscita: con
          tocchi rapidi rallenterebbe. */}
      <ul key={zona} className="mt-2 divide-y divide-[var(--panel-border)]">
        {(voci.length ? mostrate : ultime).map((v, i) => (
          <Riga key={v.u || v.t} v={v} i={i} locale={locale} tema={v.k ? temi[v.k] ?? null : null} />
        ))}
      </ul>

      {voci.length > VISIBILI && !tutte && (
        <button
          type="button"
          onClick={() => setTutte(true)}
          className="news-more mt-2 min-h-11 w-full rounded-lg border border-[var(--panel-border)] text-sm font-medium text-fg/90"
        >
          {it ? `Vedi tutte e ${voci.length}` : `Ver las ${voci.length}`}
        </button>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        {it
          ? "Titoli di giornale con il link alla fonte. Si aggiornano ogni 2 ore."
          : "Titulares de prensa con enlace a la fuente. Se actualizan cada 2 horas."}
      </p>
    </section>
  );
}
