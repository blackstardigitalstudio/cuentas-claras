// ---------------------------------------------------------------------------
// ETL Sevilla — datos REALES del presupuesto municipal 2024, leídos del PDF.
// Fuente: Ayuntamiento de Sevilla (presupuestos municipales 2024).
//   Ingresos: tabla "Estado de Ingresos" por capítulo (informe económico).
//   Gastos:   tabla por capítulo de la memoria. El documento trae DOS tablas
//             (consolidado y entidad); elegimos la que CUADRA con el total de
//             ingresos → así no confundimos ente. Verificación = seguridad.
// Solo clasificación económica por capítulo.
// ---------------------------------------------------------------------------

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFileSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { PDFParse } = require(join(__dirname, "..", "web", "node_modules", "pdf-parse"));

const YEAR = 2024;
const BASE = "https://www.sevilla.org/ayuntamiento/unidad-organica/servicio-de-gestion-presupuestaria/presupuestos-municipales/presupuesto-2024/archivos/";
const INGRESOS_PDF = BASE + "03-informe-economico-financiero-2024-report.pdf";
const GASTOS_PDF = BASE + "01-memoria-2024-report.pdf";

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

const esNum = (s) => parseFloat(String(s).replace(/\./g, "").replace(",", ".")) || 0;

async function pdfText(url) {
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; CuentasClarasETL/1.0)" } });
  if (!r.ok) throw new Error(`PDF ${r.status} ${url}`);
  const { text } = await new PDFParse({ data: Buffer.from(await r.arrayBuffer()) }).getText();
  return text;
}

function chapterCats(byCap, capMap) {
  return Object.entries(byCap)
    .filter(([k]) => capMap[k])
    .map(([k, a]) => ({ key: "c" + k, label: capMap[k][0], color: capMap[k][1], amount: Math.round(a) }))
    .sort((a, b) => b.amount - a.amount);
}

async function main() {
  // --- INGRESOS: filas con 3 importes (2023, 2024, incremento) → 2024 = el 2º ---
  const itxt = await pdfText(INGRESOS_PDF);
  const ing = {};
  for (const line of itxt.split(/\r?\n/)) {
    const m = line.match(/^\s*([1-9])\s+\D.*?([\d.]+,\d{2})\s+([\d.]+,\d{2})\s+([\d.]+,\d{2})/);
    if (m) ing[m[1]] = esNum(m[3]); // 2024
  }
  const ingresosByCat = chapterCats(ing, ING_CAP);
  const ingresos = ingresosByCat.reduce((a, c) => a + c.amount, 0);

  // --- GASTOS: la memoria trae varias tablas de 9 capítulos con 1 importe.
  // Detectamos cada tabla (cuando el capítulo baja, empieza otra) y elegimos
  // la que más se acerca al total de ingresos (= entidad Ayuntamiento). ---
  const gtxt = await pdfText(GASTOS_PDF);
  const tables = [];
  let cur = {};
  let lastCap = 0;
  for (const line of gtxt.split(/\r?\n/)) {
    const m = line.match(/^\s*([1-9])\s+(?:Gastos|Personal|Bienes|Transferencias|Inversiones|Pasivos|Activos|Fondo)\D*?([\d.]+,\d{2})\s*$/i);
    if (!m) continue;
    const cap = +m[1];
    if (cap <= lastCap) {
      if (Object.keys(cur).length) tables.push(cur);
      cur = {};
    }
    cur[m[1]] = esNum(m[2]);
    lastCap = cap;
  }
  if (Object.keys(cur).length) tables.push(cur);
  // elige la tabla cuyo total más se acerca al total de ingresos
  const sum = (t) => Object.values(t).reduce((a, b) => a + b, 0);
  const best = tables.sort((a, b) => Math.abs(sum(a) - ingresos) - Math.abs(sum(b) - ingresos))[0] || {};
  const gastosByCat = chapterCats(best, GAS_CAP);
  const gastos = gastosByCat.reduce((a, c) => a + c.amount, 0);

  if (ingresos < 100_000_000 || gastos < 100_000_000) throw new Error(`Totales sospechosos (ing=${ingresos}, gas=${gastos})`);
  // Coherencia: en un presupuesto, ingresos ≈ gastos (tolerancia 5%).
  if (Math.abs(ingresos - gastos) / ingresos > 0.05)
    throw new Error(`Ingresos y gastos no cuadran (${ingresos} vs ${gastos}); posible tabla equivocada.`);

  const out = {
    id: "sevilla", name: "Sevilla", provincia: "Sevilla", country: "es", slug: "sevilla",
    year: YEAR, isSample: false, basis: "Presupuesto 2024 (clasificación económica, leído del PDF oficial)",
    source: { name: "Ayuntamiento de Sevilla · Presupuestos municipales", url: "https://www.sevilla.org/ayuntamiento/unidad-organica/servicio-de-gestion-presupuestaria/presupuestos-municipales/presupuesto-2024" },
    ingresos, gastos, ingresosByCat, gastosByCat,
  };
  mkdirSync(join(__dirname, "..", "web", "src", "data", "real"), { recursive: true });
  writeFileSync(join(__dirname, "..", "web", "src", "data", "real", "sevilla.json"), JSON.stringify(out, null, 2));

  console.log("Sevilla", YEAR, "(PDF)");
  console.log("  Ingresos:", ingresos.toLocaleString("es"), "€  | gastos:", gastos.toLocaleString("es"), "€");
  console.log("  (tablas de gasto detectadas:", tables.length, "→ elegida total", Math.round(sum(best)).toLocaleString("es"), ")");
  gastosByCat.slice(0, 4).forEach((c) => console.log("   ", c.label, (c.amount / 1e6 | 0) + "M€"));
}

main().catch((e) => {
  console.error("ETL Sevilla ERROR:", e.message);
  process.exit(1);
});
