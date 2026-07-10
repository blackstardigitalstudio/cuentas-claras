// ---------------------------------------------------------------------------
// ETL Gobierto — CIUDADES GRANDES NO CAPITALES (2º nivel de cobertura).
// Mismo origen y lógica que etl-gobierto.mjs, pero para municipios que NO son
// capital de provincia (Móstoles, L'Hospitalet, Jerez…). Se guardan aparte y
// se enganchan al modelo por SLUG (no por provincia), para no chocar con la
// capital que ya ocupa esa provincia en el mapa.
//   INE tomado del fichero oficial de Hacienda (provincia+municipio) → exacto.
// Escribe: web/src/data/real/extra-cities.json
// ---------------------------------------------------------------------------

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFileSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const S3 = (ine) => `https://gobierto-populate-production.s3.eu-west-1.amazonaws.com/gobierto_budgets/${parseInt(ine, 10)}/data/bubbles.json`;

// Nombre · INE (de Hacienda) · provincia. Solo grandes municipios no capital.
const CITIES = [
  { name: "Móstoles", ine: "28092", provincia: "Madrid" },
  { name: "Alcalá de Henares", ine: "28005", provincia: "Madrid" },
  { name: "Fuenlabrada", ine: "28058", provincia: "Madrid" },
  { name: "Leganés", ine: "28074", provincia: "Madrid" },
  { name: "Getafe", ine: "28065", provincia: "Madrid" },
  { name: "Alcorcón", ine: "28007", provincia: "Madrid" },
  { name: "L'Hospitalet de Llobregat", ine: "08101", provincia: "Barcelona" },
  { name: "Badalona", ine: "08015", provincia: "Barcelona" },
  { name: "Terrassa", ine: "08279", provincia: "Barcelona" },
  { name: "Sabadell", ine: "08187", provincia: "Barcelona" },
  { name: "Jerez de la Frontera", ine: "11020", provincia: "Cádiz" },
  { name: "Cartagena", ine: "30016", provincia: "Murcia" },
  { name: "Lorca", ine: "30024", provincia: "Murcia" },
  { name: "Marbella", ine: "29069", provincia: "Málaga" },
  { name: "Dos Hermanas", ine: "41038", provincia: "Sevilla" },
  { name: "Elche/Elx", ine: "03065", provincia: "Alacant/Alicante" },
  { name: "Torrejón de Ardoz", ine: "28148", provincia: "Madrid" },
  { name: "Alcobendas", ine: "28006", provincia: "Madrid" },
  { name: "Las Rozas de Madrid", ine: "28127", provincia: "Madrid" },
  { name: "Pozuelo de Alarcón", ine: "28115", provincia: "Madrid" },
  { name: "Rivas-Vaciamadrid", ine: "28123", provincia: "Madrid" },
  { name: "Parla", ine: "28106", provincia: "Madrid" },
  { name: "Mataró", ine: "08121", provincia: "Barcelona" },
  { name: "Santa Coloma de Gramenet", ine: "08245", provincia: "Barcelona" },
  { name: "Cornellà de Llobregat", ine: "08073", provincia: "Barcelona" },
  { name: "Sant Cugat del Vallès", ine: "08205", provincia: "Barcelona" },
  { name: "El Prat de Llobregat", ine: "08169", provincia: "Barcelona" },
  { name: "Rubí", ine: "08184", provincia: "Barcelona" },
  { name: "Manresa", ine: "08113", provincia: "Barcelona" },
  { name: "Torrent", ine: "46244", provincia: "València/Valencia" },
  { name: "Gandia", ine: "46131", provincia: "València/Valencia" },
  { name: "Paterna", ine: "46190", provincia: "València/Valencia" },
  { name: "Sagunto", ine: "46220", provincia: "València/Valencia" },
  { name: "Torrevieja", ine: "03133", provincia: "Alacant/Alicante" },
  { name: "Orihuela", ine: "03099", provincia: "Alacant/Alicante" },
  { name: "Benidorm", ine: "03031", provincia: "Alacant/Alicante" },
  { name: "Algeciras", ine: "11004", provincia: "Cádiz" },
  { name: "San Fernando", ine: "11031", provincia: "Cádiz" },
  { name: "El Puerto de Santa María", ine: "11027", provincia: "Cádiz" },
  { name: "Chiclana de la Frontera", ine: "11015", provincia: "Cádiz" },
  { name: "Vélez-Málaga", ine: "29094", provincia: "Málaga" },
  { name: "Mijas", ine: "29070", provincia: "Málaga" },
  { name: "Fuengirola", ine: "29054", provincia: "Málaga" },
  { name: "Torremolinos", ine: "29901", provincia: "Málaga" },
  { name: "Estepona", ine: "29051", provincia: "Málaga" },
  { name: "Molina de Segura", ine: "30027", provincia: "Murcia" },
  { name: "Barakaldo", ine: "48013", provincia: "Bizkaia/Vizcaya" },
  { name: "Getxo", ine: "48044", provincia: "Bizkaia/Vizcaya" },
  { name: "Santiago de Compostela", ine: "15078", provincia: "A Coruña" },
  { name: "Ferrol", ine: "15036", provincia: "A Coruña" },
  { name: "Reus", ine: "43123", provincia: "Tarragona" },
  { name: "Roquetas de Mar", ine: "04079", provincia: "Almería" },
  { name: "El Ejido", ine: "04902", provincia: "Almería" },
  { name: "San Cristóbal de La Laguna", ine: "38023", provincia: "Santa Cruz De Tenerife" },
  { name: "Telde", ine: "35026", provincia: "Las Palmas" },
  { name: "Mérida", ine: "06083", provincia: "Badajoz" },
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

  const byCapI = {};
  for (const b of bubbles.filter((b) => b.budget_category === "income" && b.area_name === "economic")) {
    const cap = String(b.id)[0];
    if (ING_CAP[cap]) byCapI[cap] = (byCapI[cap] || 0) + val(b);
  }
  const ingresosByCat = Object.entries(byCapI).map(([k, a]) => ({ key: "i" + k, label: ING_CAP[k][0], color: ING_CAP[k][1], amount: Math.round(a) })).sort((x, y) => y.amount - x.amount);

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
  if (!Number.isFinite(ingresos) || !Number.isFinite(gastos)) throw new Error("valores no finitos");
  if (ingresos < 20_000_000 || gastos < 20_000_000) throw new Error(`totales bajos (${ingresos}/${gastos})`);
  // Integridad: ingresos y gastos deben cuadrar razonablemente (presupuesto equilibrado).
  const ratio = ingresos / gastos;
  if (ratio < 0.6 || ratio > 1.6) throw new Error(`ingresos/gastos descuadran (${ratio.toFixed(2)})`);

  const slug = city.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: city.ine, name: city.name, provincia: city.provincia, country: "es", slug,
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
      console.log(`✓ ${c.name.padEnd(26)} ${(data.gastos / 1e6 | 0)}M€  (${data.year})  in/out=${(data.ingresos / data.gastos).toFixed(2)}`);
    } catch (e) {
      console.log(`· ${c.name.padEnd(26)} — ${e.message}`);
    }
  }
  if (out.length < 3) throw new Error(`Muy pocas ciudades (${out.length}); no se sobrescribe.`);
  mkdirSync(join(__dirname, "..", "web", "src", "data", "real"), { recursive: true });
  writeFileSync(join(__dirname, "..", "web", "src", "data", "real", "extra-cities.json"), JSON.stringify(out, null, 1));
  console.log(`\nGobierto extra: ${out.length} ciudades no capital añadidas.`);
}
main().catch((e) => { console.error("ETL Gobierto extra ERROR:", e.message); process.exit(1); });
