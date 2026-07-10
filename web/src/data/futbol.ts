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

export function futbolSlug(club: string): string {
  return club.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
