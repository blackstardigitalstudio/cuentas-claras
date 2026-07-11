// El dinero del fútbol — SOLO datos oficiales / verificables (sin Transfermarkt,
// sin sueldos de jugadores estimados). Fuentes citadas en cada bloque.
// I soldi del calcio — SOLO dati ufficiali/verificabili, con fonte.

export type Src = { name: string; url: string };

// --- LaLiga · Límite de Coste de Plantilla Deportiva (LCPD) — OFICIAL ---
// Cuánto puede gastar cada club en su plantilla. Publicado por LaLiga.
export const LALIGA_LCPD_SOURCE: Src = {
  name: "LaLiga · Límite de Coste de Plantilla Deportiva (oficial)",
  url: "https://www.laliga.com/transparencia/gestion-economica",
};
export const LALIGA_LCPD_SEASON = "2024/25";
export const LALIGA_LCPD: { club: string; amount: number }[] = [
  { club: "Real Madrid", amount: 754894000 },
  { club: "FC Barcelona", amount: 463642000 },
  { club: "Atlético de Madrid", amount: 314281000 },
  { club: "Real Sociedad", amount: 160173000 },
  { club: "Villarreal CF", amount: 135860000 },
  { club: "Real Betis", amount: 108387000 },
  { club: "Athletic Club", amount: 105818000 },
  { club: "Girona FC", amount: 98877000 },
  { club: "Valencia CF", amount: 79998000 },
  { club: "RC Celta", amount: 77570000 },
  { club: "RCD Mallorca", amount: 58841000 },
  { club: "CA Osasuna", amount: 52839000 },
  { club: "Real Valladolid CF", amount: 47037000 },
  { club: "Deportivo Alavés", amount: 46138000 },
  { club: "Rayo Vallecano", amount: 45371000 },
  { club: "UD Las Palmas", amount: 39842000 },
  { club: "Getafe CF", amount: 39172000 },
  { club: "CD Leganés", amount: 34661000 },
  { club: "RCD Espanyol", amount: 7812000 },
  { club: "Sevilla FC", amount: 684000 },
];

// --- Ingresos / Ricavi — Deloitte Football Money League (cuentas 2024/25) ---
export const REVENUE_SOURCE: Src = {
  name: "Deloitte Football Money League 2026 (cuentas 2024/25)",
  url: "https://www.deloitte.com/uk/en/services/consulting-financial/analysis/deloitte-football-money-league.html",
};
export const REVENUE_SEASON = "2024/25";
export const CLUB_REVENUE: { club: string; country: "es" | "it"; amount: number }[] = [
  { club: "Real Madrid", country: "es", amount: 1185000000 },
  { club: "FC Barcelona", country: "es", amount: 975000000 },
  { club: "Inter", country: "it", amount: 538000000 },
  { club: "AC Milan", country: "it", amount: 410000000 },
  { club: "Juventus", country: "it", amount: 402000000 },
  { club: "AS Roma", country: "it", amount: 216300000 },
];

// --- Deuda / Debito de los clubes — cuentas anuales / bilanci 2024/25 ---
// kind: "bruta" (deuda financiera bruta) | "neta" (deuda financiera neta) | "caja" (posición neta positiva)
export const CLUB_DEBT: {
  club: string; country: "es" | "it"; amount: number; kind: "bruta" | "neta" | "caja"; year: string; source: Src;
}[] = [
  { club: "FC Barcelona", country: "es", amount: 1451000000, kind: "bruta", year: "2024/25",
    source: { name: "FC Barcelona · Cuentas anuales (deuda financiera bruta)", url: "https://www.fcbarcelona.es/es/club/organizacion/informacion-economica" } },
  { club: "Real Madrid", country: "es", amount: 12000000, kind: "neta", year: "30/06/2025",
    source: { name: "Real Madrid · Informe Económico (deuda neta)", url: "https://www.realmadrid.com/sobre-el-real-madrid/el-club/organigrama-y-datos-economicos" } },
  { club: "Juventus", country: "it", amount: 302800000, kind: "neta", year: "2024/25",
    source: { name: "Juventus · Bilancio 2024/25 (indebitamento finanziario netto)", url: "https://www.juventus.com/it/club/investor-relations" } },
  { club: "Inter", country: "it", amount: 248400000, kind: "neta", year: "2024/25",
    source: { name: "Inter · Bilancio 2024/25 (debito finanziario netto)", url: "https://www.inter.it/it/societa" } },
  { club: "AS Roma", country: "it", amount: 153400000, kind: "neta", year: "2024/25",
    source: { name: "AS Roma · Bilancio 2024/25 (debito finanziario netto)", url: "https://www.asroma.com/it/societa/investor-relations" } },
  { club: "AC Milan", country: "it", amount: 108100000, kind: "neta", year: "2024/25",
    source: { name: "AC Milan · Bilancio 2024/25 (debito finanziario netto)", url: "https://www.acmilan.com/it/club" } },
  { club: "SSC Napoli", country: "it", amount: 137000000, kind: "caja", year: "2024/25",
    source: { name: "SSC Napoli · Bilancio 2024/25 (posizione finanziaria netta positiva)", url: "https://sscnapoli.it/" } },
];

// --- Serie A: ricavi e monte ingaggi (bilanci 2024/25) ---
// revenue = ricavi da bilancio depositato; wageBill = monte ingaggi lordo giocatori (stima C&F).
export const SERIE_A_SOURCE: Src = {
  name: "Bilanci Serie A 2024/25 · Calcio&Finanza (Football Affairs)",
  url: "https://www.calcioefinanza.it/2026/02/07/analisi-bilanci-serie-a-2024-2025-fatturato-debiti-costi-football-affairs/",
};
export const SERIE_A_SEASON = "2024/25";
export const SERIE_A: { club: string; revenue: number; wageBill: number; net: number }[] = [
  { club: "Inter", revenue: 552600000, wageBill: 141700000, net: 35400000 },
  { club: "Juventus", revenue: 439800000, wageBill: 108400000, net: -58100000 },
  { club: "AC Milan", revenue: 438600000, wageBill: 104300000, net: 3000000 },
  { club: "AS Roma", revenue: 240400000, wageBill: 89700000, net: -53900000 },
  { club: "Atalanta", revenue: 220000000, wageBill: 59200000, net: 37900000 },
  { club: "SSC Napoli", revenue: 188300000, wageBill: 82900000, net: -21400000 },
  { club: "Bologna", revenue: 146700000, wageBill: 36100000, net: 14000000 },
  { club: "Lazio", revenue: 146000000, wageBill: 68200000, net: -17200000 },
  { club: "Fiorentina", revenue: 142400000, wageBill: 61600000, net: -23200000 },
  { club: "Genoa", revenue: 99700000, wageBill: 31300000, net: -33300000 },
  { club: "Torino", revenue: 76100000, wageBill: 46100000, net: 10400000 },
  { club: "Hellas Verona", revenue: 70000000, wageBill: 18000000, net: -4700000 },
  { club: "Udinese", revenue: 69400000, wageBill: 28200000, net: 2900000 },
  { club: "Cagliari", revenue: 63800000, wageBill: 24100000, net: -7700000 },
  { club: "Monza", revenue: 63100000, wageBill: 35000000, net: -48000000 },
  { club: "Lecce", revenue: 55500000, wageBill: 21500000, net: 20200000 },
  { club: "Empoli", revenue: 49900000, wageBill: 20400000, net: -300000 },
  { club: "Como", revenue: 48500000, wageBill: 38100000, net: -105100000 },
  { club: "Venezia", revenue: 43200000, wageBill: 19400000, net: -36500000 },
  { club: "Parma", revenue: 40000000, wageBill: 25200000, net: -63300000 },
];

// --- Confronto tra campionati (2024/25) ---
export const LEAGUE_SOURCE: Src = {
  name: "Bilanci campionati 2024/25 · Calcio&Finanza",
  url: "https://www.calcioefinanza.it/2026/04/19/bilanci-calcio-serie-a-premier-league-bundesliga-liga/",
};
export const LEAGUES: { league: string; revenue: number; wageToRevenue: number; net: number }[] = [
  { league: "Premier League", revenue: 9550000000, wageToRevenue: 54, net: -890000000 },
  { league: "Bundesliga", revenue: 5120000000, wageToRevenue: 41, net: 242000000 },
  { league: "LaLiga", revenue: 4790000000, wageToRevenue: 52, net: -3000000 },
  { league: "Serie A", revenue: 4040000000, wageToRevenue: 49, net: -349000000 },
];

export function futbolSlug(club: string): string {
  return club.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// --- Dataset unificato dei club (per i confronti "X vs Y") ---
export type ClubMetrics = { name: string; slug: string; league: "laliga" | "seriea"; limite?: number; revenue?: number; wageBill?: number; net?: number; debt?: { amount: number; kind: string } };

export const CLUBS: Record<string, ClubMetrics> = (() => {
  const m: Record<string, ClubMetrics> = {};
  const get = (name: string, league: "laliga" | "seriea") => {
    const s = futbolSlug(name);
    return (m[s] = m[s] || { name, slug: s, league });
  };
  for (const c of LALIGA_LCPD) get(c.club, "laliga").limite = c.amount;
  for (const c of CLUB_REVENUE) get(c.club, c.country === "es" ? "laliga" : "seriea").revenue = c.amount;
  for (const c of SERIE_A) { const x = get(c.club, "seriea"); x.revenue = c.revenue; x.wageBill = c.wageBill; x.net = c.net; }
  for (const c of CLUB_DEBT) { const x = get(c.club, c.country === "es" ? "laliga" : "seriea"); x.debt = { amount: c.amount, kind: c.kind }; }
  return m;
})();

// Club destacados para las páginas de comparación (mezcla de LaLiga + Serie A).
export const CLUB_COMPARE_SLUGS = [
  "real-madrid", "fc-barcelona", "atletico-de-madrid", "sevilla-fc", "villarreal-cf", "real-betis", "athletic-club", "real-sociedad", "valencia-cf",
  "inter", "juventus", "ac-milan", "as-roma", "ssc-napoli", "atalanta", "lazio", "fiorentina",
];
