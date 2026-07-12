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

export default function SiteSearch() {
  const { locale } = useLocale();
  const router = useRouter();
  const index = useMemo(() => buildIndex(locale), [locale]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

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

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xl mx-auto" onBlur={(e) => { if (!boxRef.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <div className="flex items-center gap-2 glass px-4 py-3 focus-within:border-cyan transition">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted shrink-0" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          data-claro="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active].href); }
            else if (e.key === "Escape") setOpen(false);
          }}
          placeholder={locale === "it" ? "Cerca la tua città, un club, una sezione…" : "Busca tu ciudad, un club, una sección…"}
          className="flex-1 bg-transparent outline-none text-fg placeholder:text-muted/70 text-base"
          aria-label={locale === "it" ? "Cerca" : "Buscar"}
        />
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full glass overflow-hidden py-1 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
          {results.map((r, i) => (
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
