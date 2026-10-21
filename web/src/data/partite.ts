// Calendario de las PRÓXIMAS partidas (LaLiga + Serie A) — SOLO fechas oficiales
// y confirmadas, cada una con su fuente. Calendario delle prossime partite: solo
// date ufficiali, con fonte. Si una jornada no tiene día y hora confirmados, no entra.
//
// Las horas van en UTC (ISO). Se muestran en hora de España / Italia
// (Europe/Madrid = Europe/Rome). Los slugs son los de CLUBS en futbol.ts.

import { CLUBS, canonicalPair } from "./futbol";

export type Partita = {
  comp: "laliga" | "seriea";
  /** jornada / giornata */
  round: number;
  /** saque inicial en UTC (ISO 8601) */
  kickoff: string;
  home: string;
  away: string;
  source: string;
};

const LL10 = "https://www.laliga.com/noticias/horarios-de-la-decima-jornada-de-laliga-ea-sports-2026-27";
const LL11 = "https://www.laliga.com/noticias/horarios-de-la-undecima-jornada-de-laliga-ea-sports-2026-27";
const LL12 = "https://www.laliga.com/noticias/horarios-de-la-duodecima-jornada-de-laliga-ea-sports-2026-27";
// Serie A: date e orari ufficiali pubblicati dai club (3 settembre 2026).
const MILAN = "https://www.acmilan.com/it/news/articoli/comunicati/2026-09-03/serie-a-2026-27-date-e-orari-dalla-6a-alla-12a-giornata";
const JUVE = "https://www.juventus.com/it/news/articoli/serie-a-2026-27-anticipi-e-posticipi-dalla-giornata-sei-alla-dodici";

const ll = (round: number, kickoff: string, home: string, away: string, source: string): Partita => ({ comp: "laliga", round, kickoff, home, away, source });
const sa = (round: number, kickoff: string, home: string, away: string, source: string): Partita => ({ comp: "seriea", round, kickoff, home, away, source });

export const PARTITE: Partita[] = [
  // LaLiga EA Sports 2026/27 · jornada 10
  ll(10, "2026-10-23T19:00:00Z", "deportivo-alaves", "malaga-cf", LL10),
  ll(10, "2026-10-24T12:00:00Z", "rayo-vallecano", "elche-cf", LL10),
  ll(10, "2026-10-24T14:15:00Z", "racing-de-santander", "rcd-espanyol", LL10),
  ll(10, "2026-10-24T16:30:00Z", "valencia-cf", "villarreal-cf", LL10),
  ll(10, "2026-10-24T19:00:00Z", "atletico-de-madrid", "rc-deportivo", LL10),
  ll(10, "2026-10-25T13:00:00Z", "athletic-club", "getafe-cf", LL10),
  ll(10, "2026-10-25T15:15:00Z", "rc-celta", "real-betis", LL10),
  ll(10, "2026-10-25T17:30:00Z", "real-sociedad", "levante-ud", LL10),
  ll(10, "2026-10-25T20:00:00Z", "fc-barcelona", "real-madrid", LL10),
  ll(10, "2026-10-26T20:00:00Z", "sevilla-fc", "ca-osasuna", LL10),
  // jornada 11
  ll(11, "2026-10-30T20:00:00Z", "villarreal-cf", "rcd-espanyol", LL11),
  ll(11, "2026-10-31T13:00:00Z", "levante-ud", "atletico-de-madrid", LL11),
  ll(11, "2026-10-31T15:15:00Z", "rayo-vallecano", "rc-celta", LL11),
  ll(11, "2026-10-31T17:30:00Z", "real-betis", "malaga-cf", LL11),
  ll(11, "2026-10-31T20:00:00Z", "fc-barcelona", "deportivo-alaves", LL11),
  ll(11, "2026-11-01T13:00:00Z", "getafe-cf", "sevilla-fc", LL11),
  ll(11, "2026-11-01T15:15:00Z", "racing-de-santander", "real-madrid", LL11),
  ll(11, "2026-11-01T17:30:00Z", "elche-cf", "valencia-cf", LL11),
  ll(11, "2026-11-01T20:00:00Z", "athletic-club", "real-sociedad", LL11),
  ll(11, "2026-11-02T20:00:00Z", "rc-deportivo", "ca-osasuna", LL11),
  // jornada 12
  ll(12, "2026-11-06T20:00:00Z", "sevilla-fc", "deportivo-alaves", LL12),
  ll(12, "2026-11-07T13:00:00Z", "malaga-cf", "racing-de-santander", LL12),
  ll(12, "2026-11-07T15:15:00Z", "rcd-espanyol", "rc-deportivo", LL12),
  ll(12, "2026-11-07T17:30:00Z", "ca-osasuna", "athletic-club", LL12),
  ll(12, "2026-11-07T20:00:00Z", "valencia-cf", "real-madrid", LL12),
  ll(12, "2026-11-08T13:00:00Z", "elche-cf", "real-betis", LL12),
  ll(12, "2026-11-08T15:15:00Z", "real-sociedad", "rayo-vallecano", LL12),
  ll(12, "2026-11-08T17:30:00Z", "rc-celta", "levante-ud", LL12),
  ll(12, "2026-11-08T17:30:00Z", "villarreal-cf", "getafe-cf", LL12),
  ll(12, "2026-11-08T20:00:00Z", "atletico-de-madrid", "fc-barcelona", LL12),

  // Serie A 2026/27 (solo le partite con data e ora ufficiali dei club)
  sa(8, "2026-10-25T17:00:00Z", "lecce", "juventus", JUVE),
  sa(8, "2026-10-25T19:45:00Z", "udinese", "ac-milan", MILAN),
  sa(9, "2026-10-28T17:30:00Z", "ac-milan", "bologna", MILAN),
  sa(9, "2026-10-28T19:45:00Z", "genoa", "juventus", JUVE),
  sa(10, "2026-10-31T19:45:00Z", "ac-milan", "inter", MILAN),
  sa(10, "2026-11-01T19:45:00Z", "juventus", "ssc-napoli", JUVE),
  sa(11, "2026-11-08T14:00:00Z", "genoa", "ac-milan", MILAN),
  sa(11, "2026-11-08T19:45:00Z", "fiorentina", "juventus", JUVE),
  sa(12, "2026-11-23T19:45:00Z", "juventus", "venezia", JUVE),
];
// Uno slug sbagliato non deve far sparire la partita in silenzio: si ferma la build.
for (const p of PARTITE) {
  if (!CLUBS[p.home] || !CLUBS[p.away]) throw new Error(`partite.ts: squadra sconosciuta in ${p.home}-${p.away}`);
}

export const matchPair = (p: Partita) => canonicalPair(p.home, p.away);

/** Parejas con partido en el calendario (sus páginas quedan aunque el partido ya se haya jugado). */
export const MATCH_PAIRS: string[] = Array.from(new Set(PARTITE.map(matchPair)));

/** Partidos aún por jugar en `now` (en el build: la fecha del build). */
export function upcomingMatches(now: Date = new Date()): Partita[] {
  return PARTITE.filter((p) => Date.parse(p.kickoff) > now.getTime()).sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff));
}

/** El próximo partido entre los dos clubes de la pareja, o null si ya se jugó. */
export function nextMatchForPair(par: string, now: Date = new Date()): Partita | null {
  return upcomingMatches(now).find((p) => matchPair(p) === par) ?? null;
}

// Nombres cortos, como los busca la gente ("Betis Sevilla", "Milan Inter").
const SHORT: Record<string, string> = {
  "fc-barcelona": "Barcelona", "atletico-de-madrid": "Atlético", "athletic-club": "Athletic", "villarreal-cf": "Villarreal",
  "valencia-cf": "Valencia", "sevilla-fc": "Sevilla", "real-betis": "Betis", "rc-celta": "Celta", "ca-osasuna": "Osasuna",
  "deportivo-alaves": "Alavés", "rayo-vallecano": "Rayo", "getafe-cf": "Getafe", "rcd-espanyol": "Espanyol", "elche-cf": "Elche",
  "levante-ud": "Levante", "malaga-cf": "Málaga", "racing-de-santander": "Racing", "rc-deportivo": "Deportivo",
  "ac-milan": "Milan", "ssc-napoli": "Napoli", "as-roma": "Roma",
};
export const shortName = (slug: string) => SHORT[slug] ?? CLUBS[slug]?.name ?? slug;

// --- Fechas en hora de España/Italia, sin depender del idioma del navegador ---
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
const MESE = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const MES_L = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MESE_L = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
const DIA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const GIO = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const DIA_L = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const GIO_L = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

function localParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso));
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const y = n("year"), m = n("month"), d = n("day");
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, wd, time: `${String(n("hour")).padStart(2, "0")}:${String(n("minute")).padStart(2, "0")}` };
}

/** "25 oct" / "25 ott" */
export function shortDate(iso: string, it: boolean): string {
  const p = localParts(iso);
  return `${p.d} ${(it ? MESE : MES)[p.m - 1]}`;
}
/** "dom 25 oct · 21:00" */
export function listDate(iso: string, it: boolean): string {
  const p = localParts(iso);
  return `${(it ? GIO : DIA)[p.wd]} ${p.d} ${(it ? MESE : MES)[p.m - 1]} · ${p.time}`;
}
/** "domingo 25 de octubre a las 21:00" / "domenica 25 ottobre alle 21:00" */
export function longDate(iso: string, it: boolean): string {
  const p = localParts(iso);
  return it ? `${GIO_L[p.wd]} ${p.d} ${MESE_L[p.m - 1]} alle ${p.time}` : `${DIA_L[p.wd]} ${p.d} de ${MES_L[p.m - 1]} a las ${p.time}`;
}

export const compLabel = (p: Partita, it: boolean) =>
  p.comp === "laliga" ? (it ? `LaLiga · ${p.round}ª giornata` : `LaLiga · jornada ${p.round}`) : it ? `Serie A · ${p.round}ª giornata` : `Serie A · jornada ${p.round}`;

/** Título de la página cuando el partido está cerca: fecha + pregunta abierta, máx. 58 caracteres. */
export function matchTitle(p: Partita, it: boolean): string {
  const h = shortName(p.home), a = shortName(p.away), d = shortDate(p.kickoff, it);
  const opts = it
    ? [`${h} vs ${a}, ${d}: chi ha più soldi?`, `${h}-${a}, ${d}: chi ha più soldi?`, `${h}-${a}: chi ha più soldi?`]
    : [`${h} vs ${a}, ${d}: ¿quién tiene más dinero?`, `${h} vs ${a}, ${d}: ¿quién gasta más?`, `${h}-${a}, ${d}: ¿quién gasta más?`];
  return opts.find((t) => t.length <= 58) ?? opts[opts.length - 1];
}

/** Quién publica la fecha: "LaLiga", "AC Milan", "Juventus". */
export const sourceName = (p: Partita) =>
  p.source.includes("laliga.com") ? "LaLiga" : p.source.includes("acmilan.com") ? "AC Milan" : p.source.includes("juventus.com") ? "Juventus" : new URL(p.source).hostname;
