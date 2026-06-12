// ---------------------------------------------------------------------------
// ETL Gobierto — MUCHAS ciudades a la vez.
// Gobierto Presupuestos Municipales (datos del Min. de Hacienda) publica los
// datos en S3, accesibles por código INE:
//   .../gobierto_budgets/{INE}/data/bubbles.json
// Trae INGRESOS por económico y GASTOS por funcional (política), con valores
// por año y etiquetas. Lo agregamos a nivel de capítulo / área (+ desglose).
// Escribe un único fichero array: web/src/data/real/gobierto-cities.json
// ---------------------------------------------------------------------------

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFileSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Gobierto guarda el código INE SIN ceros a la izquierda (p.ej. 07040 → 7040).
const S3 = (ine) => `https://gobierto-populate-production.s3.eu-west-1.amazonaws.com/gobierto_budgets/${parseInt(ine, 10)}/data/bubbles.json`;

// Ciudades en provincias distintas (las ya añadidas a mano se excluyen).
const CITIES = [
  { name: "Zaragoza", ine: "50297", provincia: "Zaragoza" },
  { name: "Murcia", ine: "30030", provincia: "Murcia" },
  { name: "Palma", ine: "07040", provincia: "Illes Balears" },
  { name: "Bilbao", ine: "48020", provincia: "Bizkaia/Vizcaya" },
  { name: "Valladolid", ine: "47186", provincia: "Valladolid" },
  { name: "Córdoba", ine: "14021", provincia: "Córdoba" },
  { name: "Alicante", ine: "03014", provincia: "Alacant/Alicante" },
  { name: "Gijón", ine: "33024", provincia: "Asturias" },
  { name: "Granada", ine: "18087", provincia: "Granada" },
  { name: "A Coruña", ine: "15030", provincia: "A Coruña" },
  { name: "Vigo", ine: "36057", provincia: "Pontevedra" },
  { name: "Pamplona", ine: "31201", provincia: "Navarra" },
  { name: "Santander", ine: "39075", provincia: "Cantabria" },
  { name: "Donostia / San Sebastián", ine: "20069", provincia: "Gipuzkoa/Guipúzcoa" },
  { name: "Logroño", ine: "26089", provincia: "La Rioja" },
  { name: "Castelló de la Plana", ine: "12040", provincia: "Castelló/Castellón" },
  { name: "Tarragona", ine: "43148", provincia: "Tarragona" },
  { name: "Lleida", ine: "25120", provincia: "Lleida" },
  { name: "Girona", ine: "17079", provincia: "Girona" },
  { name: "Salamanca", ine: "37274", provincia: "Salamanca" },
  { name: "Burgos", ine: "09059", provincia: "Burgos" },
  { name: "León", ine: "24089", provincia: "León" },
  { name: "Albacete", ine: "02003", provincia: "Albacete" },
  { name: "Toledo", ine: "45168", provincia: "Toledo" },
  { name: "Cádiz", ine: "11012", provincia: "Cádiz" },
  { name: "Huelva", ine: "21041", provincia: "Huelva" },
  { name: "Almería", ine: "04013", provincia: "Almería" },
  { name: "Jaén", ine: "23050", provincia: "Jaén" },
  { name: "Cáceres", ine: "10037", provincia: "Cáceres" },
  { name: "Badajoz", ine: "06015", provincia: "Badajoz" },
  { name: "Ourense", ine: "32054", provincia: "Ourense" },
  { name: "Lugo", ine: "27028", provincia: "Lugo" },
  { name: "Huesca", ine: "22125", provincia: "Huesca" },
  { name: "Teruel", ine: "44216", provincia: "Teruel" },
  { name: "Cuenca", ine: "16078", provincia: "Cuenca" },
  { name: "Guadalajara", ine: "19130", provincia: "Guadalajara" },
  { name: "Ciudad Real", ine: "13034", provincia: "Ciudad Real" },
  { name: "Segovia", ine: "40194", provincia: "Segovia" },
  { name: "Ávila", ine: "05019", provincia: "Ávila" },
  { name: "Soria", ine: "42173", provincia: "Soria" },
  { name: "Palencia", ine: "34120", provincia: "Palencia" },
  { name: "Zamora", ine: "49275", provincia: "Zamora" },
  { name: "Las Palmas de Gran Canaria", ine: "35016", provincia: "Las Palmas" },
  { name: "Santa Cruz de Tenerife", ine: "38038", provincia: "Santa Cruz De Tenerife" },
  { name: "Ceuta", ine: "51001", provincia: "Ceuta" },
  { name: "Melilla", ine: "52001", provincia: "Melilla" },
];

const ING_CAP = {
  "1": ["Impuestos directos (IBI, plusvalía…)", "#34d399"], "2": ["Impuestos indirectos (ICIO…)", "#2dd4bf"],
  "3": ["Tasas y precios públicos", "#38bdf8"], "4": ["Transferencias corrientes (Estado/CCAA)", "#a78bfa"],
  "5": ["Ingresos patrimoniales", "#fb923c"], "6": ["Venta de inversiones", "#f59e0b"],
  "7": ["Transferencias de capital", "#c084fc"], "8": ["Activos financieros", "#94a3b8"], "9": ["Pasivos financieros (deuda)", "#f87171"],
};
const AREAS = {
  "0": ["Deuda pública", "#f87171"], "1": ["Servicios públicos básicos", "#22d3ee"], "2": ["Protección y promoción social", "#f472b6"],
  "3": ["Sanidad, educación y cultura", "#a3e635"], "4": ["Actuaciones económicas", "#fbbf24"], "9": ["Administración general", "#818cf8"],
};

function latestYear(bubbles) {
  let y = 0;
  for (const b of bubbles) for (const k of Object.keys(b.values || {})) { const n = +k; if (n > y && b.values[k]) y = n; }
  return String(y || 2024);
}

async function build(city) {
  const r = await fetch(S3(city.ine));
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const bubbles = await r.json();
  if (!Array.isArray(bubbles) || !bubbles.length) throw new Error("vacío");
  const year = latestYear(bubbles);
  const val = (b) => (b.values && b.values[year]) || 0;

  // INGRESOS por capítulo (1er dígito del id económico)
  const byCapI = {};
  for (const b of bubbles.filter((b) => b.budget_category === "income" && b.area_name === "economic")) {
    const cap = String(b.id)[0];
    if (ING_CAP[cap]) byCapI[cap] = (byCapI[cap] || 0) + val(b);
  }
  const ingresosByCat = Object.entries(byCapI).map(([k, a]) => ({ key: "i" + k, label: ING_CAP[k][0], color: ING_CAP[k][1], amount: Math.round(a) })).sort((x, y) => y.amount - x.amount);

  // GASTOS por área (1er dígito de la política), con políticas como hijos
  const byArea = {}, byAreaPol = {};
  for (const b of bubbles.filter((b) => b.budget_category === "expense" && b.area_name === "functional")) {
    const area = String(b.id)[0];
    if (!AREAS[area]) continue;
    const a = val(b);
    byArea[area] = (byArea[area] || 0) + a;
    (byAreaPol[area] = byAreaPol[area] || []).push({ label: b.level_2_es || `Política ${b.id}`, amount: Math.round(a) });
  }
  const gastosByCat = Object.entries(byArea).map(([k, a]) => {
    const children = (byAreaPol[k] || []).map((c, i) => ({ key: `a${k}-${i}`, label: c.label, color: AREAS[k][1], amount: c.amount })).filter((c) => c.amount > 0).sort((x, y) => y.amount - x.amount);
    return { key: "a" + k, label: AREAS[k][0], color: AREAS[k][1], amount: Math.round(a), ...(children.length > 1 ? { children } : {}) };
  }).sort((x, y) => y.amount - x.amount);

  const ingresos = ingresosByCat.reduce((s, c) => s + c.amount, 0);
  const gastos = gastosByCat.reduce((s, c) => s + c.amount, 0);
  if (ingresos < 20_000_000 || gastos < 20_000_000) throw new Error(`totales bajos (${ingresos}/${gastos})`);

  return {
    id: city.ine, name: city.name, provincia: city.provincia, country: "es",
    slug: city.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    year: +year, isSample: false, basis: `Presupuesto ${year} (datos Min. de Hacienda vía Gobierto)`,
    source: { name: "Gobierto Presupuestos Municipales", url: `https://presupuestos.gobierto.es/municipios/${city.ine}/${year}` },
    ingresos, gastos, ingresosByCat, gastosByCat,
  };
}

async function main() {
  const out = [];
  for (const c of CITIES) {
    try {
      const data = await build(c);
      out.push(data);
      console.log(`✓ ${c.name.padEnd(22)} ${(data.gastos / 1e6 | 0)}M€  (${data.year})`);
    } catch (e) {
      console.log(`· ${c.name.padEnd(22)} — ${e.message}`);
    }
  }
  if (out.length < 3) throw new Error(`Muy pocas ciudades (${out.length}); no se sobrescribe.`);
  mkdirSync(join(__dirname, "..", "web", "src", "data", "real"), { recursive: true });
  writeFileSync(join(__dirname, "..", "web", "src", "data", "real", "gobierto-cities.json"), JSON.stringify(out, null, 1));
  console.log(`\nGobierto: ${out.length} ciudades reales añadidas.`);
}
main().catch((e) => { console.error("ETL Gobierto ERROR:", e.message); process.exit(1); });
