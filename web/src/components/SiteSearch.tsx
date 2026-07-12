"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { COUNTRIES, type CountryCode } from "@/lib/data";
import { CLUBS, CLUB_PAGE_SLUGS } from "@/data/futbol";

type Entry = { label: string; sub: string; href: string };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Índice de búsqueda: ciudades reales + clubes + secciones. Se construye una vez.
function buildIndex(locale: "es" | "it"): Entry[] {
  const out: Entry[] = [];
  const seen = new Set<string>();
  for (const p of ["es", "it"] as CountryCode[]) {
    for (const r of Object.values(COUNTRIES[p].regions)) {
      if (r.isSample) continue;
      const href = `/${p}/${r.slug}/`;
      if (seen.has(href)) continue;
      seen.add(href);
      out.push({ label: r.name, sub: p === "es" ? (locale === "it" ? "Città · Spagna" : "Ciudad · España") : (locale === "it" ? "Città · Italia" : "Ciudad · Italia"), href });
    }
  }
  for (const s of CLUB_PAGE_SLUGS) out.push({ label: CLUBS[s].name, sub: locale === "it" ? "Club · calcio" : "Club · fútbol", href: `/futbol/${s}/` });
  const secLabel = locale === "it" ? "Sezione" : "Sección";
  const sections: Entry[] = (locale === "it"
    ? [
        ["Stipendi dei sindaci", "/sueldos-alcaldes/"],
        ["Debito dei comuni", "/deuda-municipios/"],
        ["Classifica di spesa", "/ranking/"],
        ["I record dei soldi pubblici", "/records/"],
        ["I soldi del calcio", "/futbol/"],
        ["Scandali e notizie", "/escandalos/"],
        ["Confronta due comuni", "/confronta/"],
      ]
    : [
        ["Sueldos de alcaldes", "/sueldos-alcaldes/"],
        ["Deuda de los municipios", "/deuda-municipios/"],
        ["Ranking de gasto", "/ranking/"],
        ["Los récords del dinero público", "/records/"],
        ["El dinero del fútbol", "/futbol/"],
        ["Escándalos y noticias", "/escandalos/"],
        ["Comparar dos ciudades", "/comparar/"],
      ]
  ).map(([label, href]) => ({ label, sub: secLabel, href }));
  return [...sections, ...out];
}

// Ciudades "populares" que se muestran nada más pinchar (sin escribir), para que
// el usuario vea al instante dónde pulsar y pueda elegir de un vistazo.
const POPULAR_SLUGS = ["madrid", "barcelona", "valencia", "sevilla", "roma", "milano", "napoli", "torino"];

export default function SiteSearch() {
  const { locale } = useLocale();
  const router = useRouter();
  const index = useMemo(() => buildIndex(locale), [locale]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sugerencias por defecto (al pinchar sin escribir): ciudades populares + secciones clave.
  const defaults = useMemo(() => {
    const byHref = (suffix: string) => index.find((e) => e.href.endsWith(`/${suffix}/`) && (e.href.startsWith("/es/") || e.href.startsWith("/it/")));
    const cities = POPULAR_SLUGS.map((s) => byHref(s)).filter(Boolean) as Entry[];
    return cities.slice(0, 6);
  }, [index]);

  const results = useMemo(() => {
    const nq = norm(q.trim());
    if (nq.length < 2) return [];
    const scored = index
      .map((e) => {
        const nl = norm(e.label);
        if (!nl.includes(nq)) return null;
        return { e, score: nl.startsWith(nq) ? 0 : 1 };
      })
      .filter(Boolean) as { e: Entry; score: number }[];
    scored.sort((a, b) => a.score - b.score || a.e.label.length - b.e.label.length);
    return scored.slice(0, 8).map((s) => s.e);
  }, [q, index]);

  // Lo que se muestra en el desplegable: resultados si hay búsqueda; si no, populares.
  const showing = results.length ? results : defaults;
  const showingDefaults = results.length === 0;

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xl mx-auto text-left" onBlur={(e) => { if (!boxRef.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <div className="flex items-center gap-2 glass pl-4 pr-1.5 py-1.5 focus-within:border-cyan border-2 border-[var(--panel-border)] transition cursor-text" onClick={() => inputRef.current?.focus()}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan shrink-0" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          data-claro="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, showing.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter" && showing[active]) { e.preventDefault(); go(showing[active].href); }
            else if (e.key === "Escape") setOpen(false);
          }}
          placeholder={locale === "it" ? "Scrivi qui la tua città…" : "Escribe aquí tu ciudad…"}
          className="flex-1 bg-transparent outline-none text-fg placeholder:text-muted/70 text-base py-2"
          aria-label={locale === "it" ? "Cerca la tua città" : "Busca tu ciudad"}
        />
        <button
          type="button"
          onClick={() => { if (showing[active]) go(showing[active].href); else inputRef.current?.focus(); }}
          className="shrink-0 h-10 px-4 rounded-full text-sm font-semibold text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition"
        >
          {locale === "it" ? "Cerca" : "Buscar"}
        </button>
      </div>
      {open && showing.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full glass overflow-hidden py-1 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
          {showingDefaults && (
            <li className="px-4 pt-1.5 pb-1 text-[11px] uppercase tracking-widest text-cyan/70 font-semibold">
              {locale === "it" ? "Città popolari — o scrivi il nome" : "Ciudades populares — o escribe el nombre"}
            </li>
          )}
          {showing.map((r, i) => (
            <li key={r.href}>
              <Link
                href={r.href}
                onClick={() => go(r.href)}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition ${i === active ? "bg-[rgba(120,160,255,0.12)] text-fg" : "text-muted hover:text-fg"}`}
              >
                <span className="font-medium">{r.label}</span>
                <span className="text-[11px] text-muted/70 shrink-0">{r.sub}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
