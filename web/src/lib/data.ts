// ---------------------------------------------------------------------------
// Modelo de datos de Cuentas Claras
//
// ⚠️ INTEGRIDAD: los importes de este fichero son DATOS DE EJEMPLO generados de
// forma determinista, etiquetados con `isSample: true`. NO son cifras oficiales.
// Se sustituirán por los datos reales del Ministerio de Hacienda en la fase ETL
// (ver /data y README). La interfaz muestra siempre un aviso visible mientras
// `DATA_IS_SAMPLE` sea true.
// ---------------------------------------------------------------------------

import provincesGeo from "@/data/spain-provinces.json";
import barcelonaReal from "@/data/real/barcelona.json";

export const DATA_YEAR = 2024;
export const DATA_IS_SAMPLE = true;
export const DATA_SOURCE_URL =
  "https://datos.gob.es/es/catalogo/e05188501-presupuestos-y-liquidaciones-de-las-entidades-locales-datos-individuales";

export type CategoryDatum = {
  key: string;
  label: string;
  color: string;
  amount: number; // en euros
};

export type RegionData = {
  name: string;
  slug: string;
  ingresos: number;
  gastos: number;
  ingresosByCat: CategoryDatum[];
  gastosByCat: CategoryDatum[];
  gastosByEconomic?: CategoryDatum[];
  year: number;
  isSample: boolean;
  source?: { name: string; url: string };
  basis?: string;
  isCity?: boolean;
};

// Categorías de GASTO — clasificación por programas (lenguaje ciudadano)
export const GASTO_CATS: { key: string; label: string; color: string; weight: number }[] = [
  { key: "social", label: "Protección y promoción social", color: "#f472b6", weight: 0.18 },
  { key: "basicos", label: "Servicios públicos básicos", color: "#22d3ee", weight: 0.27 },
  { key: "preferente", label: "Sanidad, educación y cultura", color: "#a3e635", weight: 0.21 },
  { key: "economico", label: "Actuaciones económicas", color: "#fbbf24", weight: 0.14 },
  { key: "general", label: "Administración y deuda", color: "#818cf8", weight: 0.2 },
];

// Categorías de INGRESO — clasificación económica (lenguaje ciudadano)
export const INGRESO_CATS: { key: string; label: string; color: string; weight: number }[] = [
  { key: "directos", label: "Impuestos directos (IBI, IAE…)", color: "#34d399", weight: 0.3 },
  { key: "indirectos", label: "Impuestos indirectos", color: "#2dd4bf", weight: 0.06 },
  { key: "tasas", label: "Tasas y otros ingresos", color: "#38bdf8", weight: 0.16 },
  { key: "transfer", label: "Transferencias del Estado", color: "#a78bfa", weight: 0.4 },
  { key: "patrim", label: "Ingresos patrimoniales", color: "#fb923c", weight: 0.08 },
];

// Hash determinista (sin Math.random) para generar muestras estables.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // 0..1
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildRegion(name: string): RegionData {
  const seed = hash(name);
  // "Presupuesto" base de ejemplo: entre ~40M€ y ~6.000M€ según el hash.
  const base = 40_000_000 + Math.pow(seed, 3) * 6_000_000_000;
  const gastos = Math.round(base);
  const superavit = 0.9 + hash(name + "i") * 0.25; // 0.90..1.15
  const ingresos = Math.round(base * superavit);

  const split = (
    total: number,
    cats: { key: string; label: string; color: string; weight: number }[],
    salt: string
  ): CategoryDatum[] => {
    const noisy = cats.map((c) => ({
      ...c,
      w: c.weight * (0.7 + hash(name + salt + c.key) * 0.6),
    }));
    const sum = noisy.reduce((a, c) => a + c.w, 0);
    return noisy.map((c) => ({
      key: c.key,
      label: c.label,
      color: c.color,
      amount: Math.round((c.w / sum) * total),
    }));
  };

  return {
    name,
    slug: slugify(name),
    ingresos,
    gastos,
    ingresosByCat: split(ingresos, INGRESO_CATS, "ing"),
    gastosByCat: split(gastos, GASTO_CATS, "gas"),
    year: DATA_YEAR,
    isSample: DATA_IS_SAMPLE,
  };
}

const PROVINCE_NAMES: string[] = (provincesGeo as { features: { properties: { name: string } }[] }).features
  .map((f) => f.properties.name)
  .sort((a, b) => a.localeCompare(b, "es"));

export const REGIONS: Record<string, RegionData> = Object.fromEntries(
  PROVINCE_NAMES.map((n) => [n, buildRegion(n)])
);

// Sustituye provincias por datos REALES de ciudades cuando estén disponibles.
// (Por ahora Barcelona, con datos del Ajuntament de Barcelona 2024.)
const REAL_CITIES = [barcelonaReal];
for (const c of REAL_CITIES) {
  REGIONS[c.provincia] = {
    name: `${c.name} (ciudad)`,
    slug: c.slug,
    ingresos: c.ingresos,
    gastos: c.gastos,
    ingresosByCat: c.ingresosByCat as CategoryDatum[],
    gastosByCat: c.gastosByCat as CategoryDatum[],
    gastosByEconomic: c.gastosByEconomic as CategoryDatum[],
    year: c.year,
    isSample: false,
    source: c.source,
    basis: c.basis,
    isCity: true,
  };
}

export const REAL_REGION_NAMES = REAL_CITIES.map((c) => c.provincia);

export const REGION_LIST = Object.values(REGIONS).sort((a, b) => b.gastos - a.gastos);

export const TOTALS = {
  ingresos: REGION_LIST.reduce((a, r) => a + r.ingresos, 0),
  gastos: REGION_LIST.reduce((a, r) => a + r.gastos, 0),
  count: REGION_LIST.length,
};
