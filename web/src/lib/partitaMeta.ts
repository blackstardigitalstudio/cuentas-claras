// Metadata delle pagine "A vs B" (calcio). Le usano /futbol/[par]/ (ES) e
// /calcio/[par]/ (IT, solo per le coppie che hanno una partita in calendario).
import type { Metadata } from "next";
import { CLUBS, LALIGA_LCPD_SEASON, REVENUE_SEASON, type ClubMetrics } from "@/data/futbol";
import { MATCH_PAIRS, longDate, matchTitle, nextMatchForPair, shortName } from "@/data/partite";

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export function parsePair(par: string): { a: ClubMetrics; b: ClubMetrics } | null {
  const idx = par.indexOf("-vs-");
  if (idx < 0) return null;
  const a = CLUBS[par.slice(0, idx)];
  const b = CLUBS[par.slice(idx + 4)];
  return a && b ? { a, b } : null;
}

/** Hay algo que comparar: los dos clubes tienen al menos una cifra de la misma medida. */
const hasMoney = (a: ClubMetrics, b: ClubMetrics) => !!((a.revenue && b.revenue) || (a.debt && b.debt));
const onlyLimit = (a: ClubMetrics, b: ClubMetrics) => !hasMoney(a, b) && !!(a.limite && b.limite);

export function pairLanguages(par: string) {
  return MATCH_PAIRS.includes(par) ? { "es-ES": `${SITE}/futbol/${par}/`, "it-IT": `${SITE}/calcio/${par}/` } : undefined;
}

export function pairMetadata(par: string, it: boolean, now: Date = new Date()): Metadata | null {
  const pair = parsePair(par);
  if (!pair) return null;
  const { a, b } = pair;
  const m = nextMatchForPair(par, now);
  const lim = onlyLimit(a, b);

  // Massimo 58 caratteri: se il nome lungo non ci sta, si usa quello corto ("Atlético").
  const fit = (f: (x: string, y: string) => string) => {
    const long = f(a.name, b.name);
    return long.length <= 58 ? long : f(shortName(a.slug), shortName(b.slug));
  };
  let title: string;
  if (m) title = matchTitle(m, it);
  else if (lim) title = fit((x, y) => (it ? `${x} vs ${y}: chi può spendere di più?` : `${x} vs ${y}: ¿quién puede gastar más?`));
  else title = fit((x, y) => (it ? `${x} vs ${y}: chi incassa e deve di più` : `${x} vs ${y}: quién ingresa y debe más`));

  // Prima il dubbio, poi cosa trovi e la stagione.
  let description: string;
  if (m) {
    const h = shortName(m.home), w = shortName(m.away), d = longDate(m.kickoff, it);
    description = it
      ? `${h}-${w} si gioca ${d}. Chi ha più soldi? ${lim ? `Il tetto di spesa ufficiale della LaLiga ${LALIGA_LCPD_SEASON}` : "Ricavi, stipendi e debito ufficiali"}, fianco a fianco.`
      : `El ${h}-${w} se juega el ${d}. ¿Quién tiene más dinero? ${lim ? `El límite de gasto oficial de LaLiga ${LALIGA_LCPD_SEASON}` : "Ingresos, salarios y deuda oficiales"}, lado a lado.`;
  } else if (lim) {
    description = it
      ? `Chi può spendere di più per la rosa, ${a.name} o ${b.name}? Il tetto ufficiale della LaLiga ${LALIGA_LCPD_SEASON}, fianco a fianco.`
      : `¿Quién puede gastar más en su plantilla, ${a.name} o ${b.name}? El límite oficial de LaLiga ${LALIGA_LCPD_SEASON}, lado a lado.`;
  } else {
    const base = it
      ? `Chi deve di più, ${a.name} o ${b.name}? Ricavi, stipendi, tetto salariale e debito della stagione ${REVENUE_SEASON}, fianco a fianco.`
      : `¿Quién debe más, ${a.name} o ${b.name}? Ingresos, salarios, límite salarial y deuda de la temporada ${REVENUE_SEASON}, lado a lado.`;
    const tail = it ? " Solo conti ufficiali." : " Solo cuentas oficiales.";
    description = base.length + tail.length <= 155 ? base + tail : base;
  }

  const path = it ? "calcio" : "futbol";
  const languages = pairLanguages(par);
  return {
    title,
    description,
    alternates: { canonical: `${SITE}/${path}/${par}/`, ...(languages ? { languages } : {}) },
    openGraph: {
      title,
      description: it ? "Confronto con dati ufficiali." : "Comparativa financiera con datos oficiales.",
      type: "article",
      ...(it ? { locale: "it_IT" } : {}),
      images: [{ url: "/og-futbol.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: ["/og-futbol.png"] },
  };
}
