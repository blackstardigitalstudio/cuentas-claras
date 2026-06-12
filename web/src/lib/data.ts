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
import italyGeo from "@/data/italy-provinces.json";
import barcelonaReal from "@/data/real/barcelona.json";
import valenciaReal from "@/data/real/valencia.json";
import vitoriaReal from "@/data/real/vitoria.json";
import sevillaReal from "@/data/real/sevilla.json";
import malagaReal from "@/data/real/malaga.json";
import milanoReal from "@/data/real/milano.json";

export const DATA_YEAR = 2024;
export const DATA_IS_SAMPLE = true;
export const DATA_SOURCE_URL =
  "https://datos.gob.es/es/catalogo/e05188501-presupuestos-y-liquidaciones-de-las-entidades-locales-datos-individuales";

export type CategoryDatum = {
  key: string;
  label: string;
  color: string;
  amount: number; // en euros
  children?: CategoryDatum[]; // nivel de detalle (subcategorías)
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

// Subcategorías de ejemplo por área de gasto (para el desglose en la demo).
const GASTO_SUB: Record<string, string[]> = {
  social: ["Servicios sociales", "Fomento del empleo", "Otras prestaciones"],
  basicos: ["Seguridad y movilidad", "Vivienda y urbanismo", "Limpieza y alumbrado", "Medio ambiente"],
  preferente: ["Educación", "Cultura", "Deporte", "Sanidad"],
  economico: ["Comercio y turismo", "Transporte público", "Infraestructuras"],
  general: ["Órganos de gobierno", "Administración", "Deuda e intereses"],
};

type CatSet = {
  gasto: { key: string; label: string; color: string; weight: number }[];
  ingreso: { key: string; label: string; color: string; weight: number }[];
  sub: Record<string, string[]>;
};
const CATS_ES: CatSet = { gasto: GASTO_CATS, ingreso: INGRESO_CATS, sub: GASTO_SUB };

function buildRegion(name: string, C: CatSet = CATS_ES): RegionData {
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

  // Añade subcategorías de ejemplo a cada área de gasto (desglose).
  const withSub = (cats: CategoryDatum[]): CategoryDatum[] =>
    cats.map((c) => {
      const labels = C.sub[c.key];
      if (!labels) return c;
      const noisy = labels.map((l, i) => ({ l, w: 0.5 + hash(name + c.key + i) }));
      const wsum = noisy.reduce((a, x) => a + x.w, 0);
      let acc = 0;
      const children = noisy.map((x, i) => {
        const amt = i === noisy.length - 1 ? c.amount - acc : Math.round((x.w / wsum) * c.amount);
        acc += amt;
        return { key: `${c.key}-${i}`, label: x.l, color: c.color, amount: amt };
      });
      return { ...c, children };
    });

  return {
    name,
    slug: slugify(name),
    ingresos,
    gastos,
    ingresosByCat: split(ingresos, C.ingreso, "ing"),
    gastosByCat: withSub(split(gastos, C.gasto, "gas")),
    year: DATA_YEAR,
    isSample: DATA_IS_SAMPLE,
  };
}

// Categorías de ejemplo en italiano (para las provincias italianas de muestra).
const CATS_IT: CatSet = {
  gasto: [
    { key: "social", label: "Diritti sociali e famiglia", color: "#f472b6", weight: 0.18 },
    { key: "basicos", label: "Servizi pubblici di base", color: "#22d3ee", weight: 0.27 },
    { key: "preferente", label: "Istruzione, cultura e sanità", color: "#a3e635", weight: 0.21 },
    { key: "economico", label: "Sviluppo economico e trasporti", color: "#fbbf24", weight: 0.14 },
    { key: "general", label: "Amministrazione e debito", color: "#818cf8", weight: 0.2 },
  ],
  ingreso: [
    { key: "directos", label: "Imposte (IMU, IRPEF…)", color: "#34d399", weight: 0.3 },
    { key: "indirectos", label: "Imposte indirette", color: "#2dd4bf", weight: 0.06 },
    { key: "tasas", label: "Tasse e tariffe", color: "#38bdf8", weight: 0.16 },
    { key: "transfer", label: "Trasferimenti dallo Stato", color: "#a78bfa", weight: 0.4 },
    { key: "patrim", label: "Entrate patrimoniali", color: "#fb923c", weight: 0.08 },
  ],
  sub: {
    social: ["Servizi sociali", "Politiche per il lavoro", "Altre prestazioni"],
    basicos: ["Sicurezza e mobilità", "Urbanistica e abitazioni", "Pulizia e illuminazione", "Ambiente"],
    preferente: ["Istruzione", "Cultura", "Sport", "Sanità"],
    economico: ["Commercio e turismo", "Trasporti", "Infrastrutture"],
    general: ["Organi di governo", "Amministrazione", "Debito e interessi"],
  },
};

type RealCity = {
  name: string;
  provincia: string;
  slug: string;
  ingresos: number;
  gastos: number;
  ingresosByCat: CategoryDatum[];
  gastosByCat: CategoryDatum[];
  gastosByEconomic?: CategoryDatum[];
  year: number;
  basis?: string;
  source?: { name: string; url: string };
};

type GeoFC = { features: { properties: { name: string } }[] };

function buildCountry(geo: GeoFC, cats: CatSet, reals: RealCity[]) {
  const names = geo.features.map((f) => f.properties.name).sort((a, b) => a.localeCompare(b, "es"));
  const regions: Record<string, RegionData> = Object.fromEntries(names.map((n) => [n, buildRegion(n, cats)]));
  for (const c of reals) {
    regions[c.provincia] = {
      name: c.name,
      slug: c.slug,
      ingresos: c.ingresos,
      gastos: c.gastos,
      ingresosByCat: c.ingresosByCat,
      gastosByCat: c.gastosByCat,
      gastosByEconomic: c.gastosByEconomic,
      year: c.year,
      isSample: false,
      source: c.source,
      basis: c.basis,
      isCity: true,
    };
  }
  return {
    regions,
    list: Object.values(regions).sort((a, b) => b.gastos - a.gastos),
    realNames: reals.map((c) => c.provincia),
  };
}

export type CountryCode = "es" | "it";
export type Country = {
  code: CountryCode;
  mapKind: "spain" | "italy";
  defaultRegion: string;
  geo: GeoFC;
  regions: Record<string, RegionData>;
  list: RegionData[];
  realNames: string[];
};

const ES = buildCountry(provincesGeo as GeoFC, CATS_ES, [
  barcelonaReal as RealCity,
  valenciaReal as RealCity,
  vitoriaReal as RealCity,
  sevillaReal as RealCity,
  malagaReal as RealCity,
]);
const IT = buildCountry(italyGeo as GeoFC, CATS_IT, [milanoReal as RealCity]);

export const COUNTRIES: Record<CountryCode, Country> = {
  es: { code: "es", mapKind: "spain", defaultRegion: "Barcelona", geo: provincesGeo as GeoFC, ...ES },
  it: { code: "it", mapKind: "italy", defaultRegion: "Milano", geo: italyGeo as GeoFC, ...IT },
};

// Compatibilidad (la portada usa España).
export const REGIONS = ES.regions;
export const REGION_LIST = ES.list;
export const REAL_REGION_NAMES = ES.realNames;
export const TOTALS = {
  ingresos: ES.list.reduce((a, r) => a + r.ingresos, 0),
  gastos: ES.list.reduce((a, r) => a + r.gastos, 0),
  count: ES.list.length,
};
