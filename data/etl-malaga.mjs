// ---------------------------------------------------------------------------
// ETL Málaga — presupuesto consolidado 2024, leído del PDF "Estado consolidado".
// Fuente: Ayuntamiento de Málaga. El PDF trae una tabla con INGRESOS y GASTOS
// por capítulo en la misma fila → muy limpio. Validamos que ingresos≈gastos.
// ---------------------------------------------------------------------------

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFileSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { PDFParse } = require(join(__dirname, "..", "web", "node_modules", "pdf-parse"));

const YEAR = 2024;
const PDF = "https://www.malaga.eu/export/sites/malagaeu/el-ayuntamiento/economia-y-presupuestos/presupuestos/presupuestos-2024/.galleries/Presupuestos-2024-Consolidado/Estadoconsolidado.pdf";

const ING_CAP = {
  "1": ["Impuestos directos (IBI, plusvalía…)", "#34d399"], "2": ["Impuestos indirectos (ICIO…)", "#2dd4bf"],
  "3": ["Tasas y precios públicos", "#38bdf8"], "4": ["Transferencias corrientes (Estado/CCAA)", "#a78bfa"],
  "5": ["Ingresos patrimoniales", "#fb923c"], "6": ["Venta de inversiones", "#f59e0b"],
  "7": ["Transferencias de capital", "#c084fc"], "8": ["Activos financieros", "#94a3b8"], "9": ["Pasivos financieros (deuda)", "#f87171"],
};
const GAS_CAP = {
  "1": ["Personal", "#f472b6"], "2": ["Bienes corrientes y servicios", "#22d3ee"], "3": ["Gastos financieros (intereses)", "#f87171"],
  "4": ["Transferencias corrientes", "#a78bfa"], "5": ["Fondo de contingencia", "#94a3b8"], "6": ["Inversiones reales", "#a3e635"],
  "7": ["Transferencias de capital", "#c084fc"], "8": ["Activos financieros", "#64748b"], "9": ["Pasivos financieros (amortización deuda)", "#fb7185"],
};
const esNum = (s) => parseFloat(String(s).replace(/\./g, "").replace(",", ".")) || 0;
const cats = (by, map) => Object.entries(by).filter(([k]) => map[k]).map(([k, a]) => ({ key: "c" + k, label: map[k][0], color: map[k][1], amount: Math.round(a) })).sort((x, y) => y.amount - x.amount);

async function main() {
  const r = await fetch(PDF, { headers: { "user-agent": "Mozilla/5.0 (compatible; CuentasClarasETL/1.0)" } });
  if (!r.ok) throw new Error(`PDF ${r.status}`);
  const { text } = await new PDFParse({ data: Buffer.from(await r.arrayBuffer()) }).getText();

  const ing = {}, gas = {};
  for (const line of text.split(/\r?\n/)) {
    // fila: <cap> <desc ingreso> <importe ing> <cap> <desc gasto> <importe gasto>
    const m = line.match(/^\s*([1-9])\s+\D.*?([\d.]+,\d{2})\s+[1-9]\s+\D.*?([\d.]+,\d{2})\s*$/);
    if (!m) continue;
    const cap = m[1];
    ing[cap] = (ing[cap] || 0) + esNum(m[2]);
    gas[cap] = (gas[cap] || 0) + esNum(m[3]);
  }
  const ingresosByCat = cats(ing, ING_CAP);
  const gastosByCat = cats(gas, GAS_CAP);
  const ingresos = ingresosByCat.reduce((a, c) => a + c.amount, 0);
  const gastos = gastosByCat.reduce((a, c) => a + c.amount, 0);

  if (ingresos < 100_000_000 || gastos < 100_000_000 || ingresosByCat.length < 5)
    throw new Error(`Totales/estructura sospechosos (ing=${ingresos}, gas=${gastos}, n=${ingresosByCat.length})`);
  if (Math.abs(ingresos - gastos) / ingresos > 0.05)
    throw new Error(`No cuadra (${ingresos} vs ${gastos})`);

  const out = {
    id: "malaga", name: "Málaga", provincia: "Málaga", country: "es", slug: "malaga",
    year: YEAR, isSample: false, basis: "Presupuesto consolidado 2024 (clasificación económica, del PDF oficial)",
    source: { name: "Ayuntamiento de Málaga · Presupuestos", url: "https://www.malaga.eu/el-ayuntamiento/economia-y-presupuestos/presupuestos/presupuestos-2024/" },
    ingresos, gastos, ingresosByCat, gastosByCat,
  };
  mkdirSync(join(__dirname, "..", "web", "src", "data", "real"), { recursive: true });
  writeFileSync(join(__dirname, "..", "web", "src", "data", "real", "malaga.json"), JSON.stringify(out, null, 2));
  console.log("Málaga", YEAR, "→ Ingresos", ingresos.toLocaleString("es"), "€ | Gastos", gastos.toLocaleString("es"), "€ |", ingresosByCat.length, "cap.");
}
main().catch((e) => { console.error("ETL Málaga ERROR:", e.message); process.exit(1); });
