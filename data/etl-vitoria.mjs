// ---------------------------------------------------------------------------
// ETL Vitoria-Gasteiz — datos REALES de ejecución presupuestaria 2024.
// Fuente: Ayuntamiento de Vitoria-Gasteiz (Open Data), ficheros ODS.
//   Gastos:   Obligado (obligaciones reconocidas), por área/política funcional
//             y por capítulo económico.
//   Ingresos: Derechos Reconocidos Netos, por capítulo económico.
// ODS leído con SheetJS (xlsx). Provincia: Araba/Álava.
// ---------------------------------------------------------------------------

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFileSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const XLSX = require(join(__dirname, "..", "web", "node_modules", "xlsx"));

const YEAR = 2024;
const GASTOS_URL =
  "https://www.vitoria-gasteiz.org/docs/j34/catalogo/02/31/Estado_de_ejecución_de_gastos_IV_trimestre_2024.ods";
const INGRESOS_URL =
  "https://www.vitoria-gasteiz.org/docs/j34/catalogo/02/31/Estado_de_ejecución_de_ingresos_IV_trimestre_2024.ods";

const ING_CAP = {
  "1": ["Impuestos directos (IBI, plusvalía…)", "#34d399"],
  "2": ["Impuestos indirectos (ICIO…)", "#2dd4bf"],
  "3": ["Tasas y precios públicos", "#38bdf8"],
  "4": ["Transferencias corrientes (Estado/CCAA)", "#a78bfa"],
  "5": ["Ingresos patrimoniales", "#fb923c"],
  "6": ["Venta de inversiones", "#f59e0b"],
  "7": ["Transferencias de capital", "#c084fc"],
  "8": ["Activos financieros", "#94a3b8"],
  "9": ["Pasivos financieros (deuda)", "#f87171"],
};
const GAS_CAP = {
  "1": ["Personal", "#f472b6"],
  "2": ["Bienes corrientes y servicios", "#22d3ee"],
  "3": ["Gastos financieros (intereses)", "#f87171"],
  "4": ["Transferencias corrientes", "#a78bfa"],
  "5": ["Fondo de contingencia", "#94a3b8"],
  "6": ["Inversiones reales", "#a3e635"],
  "7": ["Transferencias de capital", "#c084fc"],
  "8": ["Activos financieros", "#64748b"],
  "9": ["Pasivos financieros (amortización deuda)", "#fb7185"],
};
const AREAS = {
  "0": ["Deuda pública", "#f87171"],
  "1": ["Servicios públicos básicos", "#22d3ee"],
  "2": ["Protección y promoción social", "#f472b6"],
  "3": ["Sanidad, educación y cultura", "#a3e635"],
  "4": ["Actuaciones económicas", "#fbbf24"],
  "9": ["Administración general", "#818cf8"],
};
const POLITICAS = {
  "01": "Deuda pública", "13": "Seguridad y movilidad ciudadana", "15": "Vivienda y urbanismo",
  "16": "Bienestar comunitario (limpieza, agua, alumbrado…)", "17": "Medio ambiente",
  "21": "Pensiones", "22": "Otras prestaciones sociales", "23": "Servicios sociales y promoción social",
  "24": "Fomento del empleo", "31": "Sanidad", "32": "Educación", "33": "Cultura", "34": "Deporte",
  "41": "Agricultura y pesca", "42": "Industria y energía", "43": "Comercio y turismo", "44": "Transporte público",
  "45": "Infraestructuras", "46": "Investigación y desarrollo", "49": "Otras actuaciones económicas",
  "91": "Órganos de gobierno", "92": "Servicios de carácter general", "93": "Administración financiera y tributaria",
  "94": "Transferencias a otras administraciones",
};

async function loadOds(url) {
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; CuentasClarasETL/1.0)" } });
  if (!r.ok) throw new Error(`Descarga falló (${r.status}) ${url}`);
  const wb = XLSX.read(Buffer.from(await r.arrayBuffer()), { type: "buffer" });
  const ws = wb.Sheets["CASTELLANO"] || wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });
}
const num = (v) => (typeof v === "number" ? v : parseFloat(String(v || "").replace(",", ".")) || 0);

async function main() {
  // --- GASTOS: [Orgánico, Funcional, Económico, R, Denom, CredIni, CredDef, Obligado] ---
  const grows = await loadOds(GASTOS_URL);
  const byArea = {}, byAreaPol = {}, byCapG = {};
  for (let i = 1; i < grows.length; i++) {
    const row = grows[i];
    const func = String(row[1] ?? "");
    const eco = String(row[2] ?? "");
    const amount = num(row[7]);
    if (!amount || !func) continue;
    const area = func[0];
    const pol = func.slice(0, 2);
    if (AREAS[area]) {
      byArea[area] = (byArea[area] || 0) + amount;
      byAreaPol[area] = byAreaPol[area] || {};
      byAreaPol[area][pol] = (byAreaPol[area][pol] || 0) + amount;
    }
    const cap = eco[0];
    if (GAS_CAP[cap]) byCapG[cap] = (byCapG[cap] || 0) + amount;
  }
  const gastosByCat = Object.entries(byArea)
    .map(([k, amount]) => {
      const children = Object.entries(byAreaPol[k] || {})
        .map(([pol, a]) => ({ key: "p" + pol, label: POLITICAS[pol] || `Política ${pol}`, color: AREAS[k][1], amount: Math.round(a) }))
        .sort((a, b) => b.amount - a.amount);
      return { key: "a" + k, label: AREAS[k][0], color: AREAS[k][1], amount: Math.round(amount), ...(children.length > 1 ? { children } : {}) };
    })
    .sort((a, b) => b.amount - a.amount);
  const gastosByEconomic = Object.entries(byCapG)
    .map(([k, a]) => ({ key: "c" + k, label: GAS_CAP[k][0], color: GAS_CAP[k][1], amount: Math.round(a) }))
    .sort((a, b) => b.amount - a.amount);
  const gastos = gastosByCat.reduce((a, c) => a + c.amount, 0);

  // --- INGRESOS: [Económico, Denom, C.Definitivo, DRN NETOS] ---
  const irows = await loadOds(INGRESOS_URL);
  const byCapI = {};
  for (let i = 1; i < irows.length; i++) {
    const eco = String(irows[i][0] ?? "");
    const amount = num(irows[i][3]);
    if (!amount) continue;
    const cap = eco[0];
    if (ING_CAP[cap]) byCapI[cap] = (byCapI[cap] || 0) + amount;
  }
  const ingresosByCat = Object.entries(byCapI)
    .map(([k, a]) => ({ key: "i" + k, label: ING_CAP[k][0], color: ING_CAP[k][1], amount: Math.round(a) }))
    .sort((a, b) => b.amount - a.amount);
  const ingresos = ingresosByCat.reduce((a, c) => a + c.amount, 0);

  if (gastos < 50_000_000 || ingresos < 50_000_000) {
    throw new Error(`Totales sospechosos (ingresos=${ingresos}, gastos=${gastos}).`);
  }

  const out = {
    id: "vitoria", name: "Vitoria-Gasteiz", provincia: "Araba/Álava", country: "es", slug: "vitoria-gasteiz",
    year: YEAR, isSample: false, basis: "Ejecución 2024 (obligaciones reconocidas / derechos liquidados)",
    source: { name: "Ayuntamiento de Vitoria-Gasteiz · Open Data", url: "https://www.vitoria-gasteiz.org/j34-01w/catalogo/portada" },
    ingresos, gastos, ingresosByCat, gastosByCat, gastosByEconomic,
  };
  const outDir = join(__dirname, "..", "web", "src", "data", "real");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "vitoria.json"), JSON.stringify(out, null, 2));

  console.log("Vitoria-Gasteiz", YEAR);
  console.log("  Ingresos:", ingresos.toLocaleString("es"), "€");
  console.log("  Gastos:  ", gastos.toLocaleString("es"), "€");
  gastosByCat.forEach((a) => console.log("   ", a.label, (a.amount / 1e6 | 0) + "M€"));
}

main().catch((e) => {
  console.error("ETL Vitoria ERROR:", e.message);
  process.exit(1);
});
