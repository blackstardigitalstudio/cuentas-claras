// ---------------------------------------------------------------------------
// ETL València — datos REALES del presupuesto municipal
// Fuente: Open Data VLCi (CKAN), Ajuntament de València.
//   Gastos:   presupuesto-de-gastos.csv (una fila por año, columnas = capítulos)
//   Ingresos: presupuesto-ingresos-por-codigo-economico.csv (se agrega por capítulo)
// Clasificación económica (no funcional). Año: presupuesto inicial.
// ---------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const YEAR = 2025;

const GASTOS_URL =
  "https://opendata.vlci.valencia.es/dataset/e6ed3b3f-7efd-478b-8e45-c8dc3ed15066/resource/40bfee57-c0a0-4d5b-adfc-d36888588066/download/presupuesto-de-gastos.csv";
const INGRESOS_URL =
  "https://opendata.vlci.valencia.es/dataset/72ad8807-4aa4-4806-a59c-b77bfd83dc79/resource/e67b061c-f6c7-4546-9576-840ff8fca29b/download/presupuesto-ingresos-por-codigo-economico.csv";

// Capítulo económico -> etiqueta + color (mismos códigos que Barcelona)
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
// Columnas de gasto (en orden) del CSV de gastos -> capítulo
const GAS_CAP = [
  ["Personal", "#f472b6"],
  ["Bienes corrientes y servicios", "#22d3ee"],
  ["Gastos financieros (intereses)", "#f87171"],
  ["Transferencias corrientes", "#a78bfa"],
  ["Fondo de contingencia", "#94a3b8"],
  ["Inversiones reales", "#a3e635"],
  ["Transferencias de capital", "#c084fc"],
  ["Activos financieros", "#64748b"],
  ["Pasivos financieros (amortización deuda)", "#fb7185"],
];

function stripBom(s) {
  return s.replace(/^﻿/, "");
}
function num(s) {
  const n = parseFloat(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

async function fetchCsv(url, name, expectHeaderIncludes) {
  const r = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; CuentasClarasETL/1.0)", accept: "text/csv,*/*" },
  });
  if (!r.ok) throw new Error(`Descarga falló (${r.status}) para ${name}`);
  const text = stripBom(Buffer.from(await r.arrayBuffer()).toString("utf8"));
  if (!text.includes(expectHeaderIncludes)) {
    throw new Error(`Contenido inesperado en ${name}: ${text.slice(0, 80)}`);
  }
  return text;
}

async function main() {
  // --- GASTOS: una fila por año ---
  const gTxt = await fetchCsv(GASTOS_URL, "gastos", "Total gastos");
  const gLines = gTxt.split(/\r?\n/).filter((l) => l.trim());
  const gRow = gLines.slice(1).map((l) => l.split(";")).find((c) => c[0] === String(YEAR));
  if (!gRow) throw new Error(`No hay fila de gastos para ${YEAR}`);
  const gastosByCat = GAS_CAP.map(([label, color], i) => ({
    key: "g" + (i + 1),
    label,
    color,
    amount: Math.round(num(gRow[i + 1])),
  })).filter((c) => c.amount > 0);
  const gastos = Math.round(num(gRow[10])); // "Total gastos"

  // --- INGRESOS: agregación por capítulo ---
  const iTxt = await fetchCsv(INGRESOS_URL, "ingresos", "Periodo presupuestario");
  const iLines = iTxt.split(/\r?\n/).filter((l) => l.trim());
  const byCap = {};
  for (const line of iLines.slice(1)) {
    const c = line.split(";");
    if (c[0] !== String(YEAR)) continue;
    const cap = String(parseInt(c[1], 10)); // Capítulo
    if (!ING_CAP[cap]) continue;
    byCap[cap] = (byCap[cap] || 0) + num(c[5]); // Valor
  }
  const ingresosByCat = Object.entries(byCap)
    .map(([k, amount]) => ({ key: "i" + k, label: ING_CAP[k][0], color: ING_CAP[k][1], amount: Math.round(amount) }))
    .sort((a, b) => b.amount - a.amount);
  const ingresos = ingresosByCat.reduce((a, c) => a + c.amount, 0);

  // Validación: nunca escribir datos absurdos.
  const MIN = 100_000_000;
  if (gastos < MIN || ingresos < MIN) {
    throw new Error(`Totales sospechosos (ingresos=${ingresos}, gastos=${gastos}). No se sobrescribe.`);
  }

  const out = {
    id: "valencia",
    name: "València",
    provincia: "València/Valencia",
    slug: "valencia",
    year: YEAR,
    isSample: false,
    basis: "Presupuesto inicial (clasificación económica)",
    source: {
      name: "Ajuntament de València · Open Data VLCi",
      url: "https://valencia.opendatasoft.com/explore/dataset/presupuesto-de-gastos/",
    },
    ingresos,
    gastos,
    ingresosByCat,
    gastosByCat: gastosByCat.sort((a, b) => b.amount - a.amount),
  };

  const outDir = join(__dirname, "..", "web", "src", "data", "real");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "valencia.json"), JSON.stringify(out, null, 2));

  console.log("València", YEAR, "actualizado");
  console.log("  Ingresos:", ingresos.toLocaleString("es"), "€");
  console.log("  Gastos:  ", gastos.toLocaleString("es"), "€");
  out.gastosByCat.forEach((c) => console.log("   ", c.label, c.amount.toLocaleString("es"), "€"));
}

main().catch((e) => {
  console.error("ETL València ERROR:", e.message);
  process.exit(1);
});
