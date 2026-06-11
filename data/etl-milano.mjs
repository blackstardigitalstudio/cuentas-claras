// ---------------------------------------------------------------------------
// ETL Milano — dati REALI del bilancio comunale (Rendiconto 2024).
// Fonte: Open Data Comune di Milano (CKAN), dataset ds2956 (2023-2027).
//   USCITE  -> per MISSIONE (classificazione funzionale) + figli per programma
//   ENTRATE -> per titolo (Livello 1)
//   Importo: "Rendiconto 2024" (esecuzione reale, ultimo anno chiuso)
// CSV separato da ';' (le virgole stanno DENTRO i testi → split per ';' è sicuro).
// ---------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const YEAR = 2024;
const CSV_URL =
  "https://dati.comune.milano.it/dataset/329db64c-7c7d-473e-8896-d4e29eccae99/resource/5ab0cc4f-2119-4ed8-a40b-f4a6f95e6054/download/ds2956_peg-2023-2027_od.csv";

// Índices de columna (CSV de 29 campos, ';')
const C = { tipo: 0, missioneDesc: 2, programmaDesc: 4, liv1Desc: 6, rend2024: 22 };

const PALETTE = [
  "#22d3ee", "#f472b6", "#a3e635", "#818cf8", "#fbbf24", "#34d399", "#fb7185", "#38bdf8",
  "#c084fc", "#2dd4bf", "#f59e0b", "#a78bfa", "#fb923c", "#4ade80", "#e879f9", "#94a3b8",
];
function colorFor(i) {
  return PALETTE[i % PALETTE.length];
}
function sentence(s) {
  s = (s || "").trim().toLowerCase();
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
function num(s) {
  const n = parseFloat(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

async function main() {
  const r = await fetch(CSV_URL, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; CuentasClarasETL/1.0)", accept: "text/csv,*/*" },
  });
  if (!r.ok) throw new Error(`Descarga falló (${r.status})`);
  const text = Buffer.from(await r.arrayBuffer()).toString("utf8");
  if (!text.startsWith("Tipo;")) throw new Error(`Contenido inesperado: ${text.slice(0, 60)}`);

  const lines = text.split(/\r?\n/);
  const ent = {}; // titolo -> amount
  const speseMis = {}; // missione -> amount
  const speseProg = {}; // missione -> { programma -> amount }
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const c = lines[i].split(";");
    if (c.length < 23) continue;
    const amount = num(c[C.rend2024]);
    if (!amount) continue;
    const tipo = c[C.tipo];
    if (tipo === "ENTRATE") {
      const k = sentence(c[C.liv1Desc]) || "Otras entradas";
      ent[k] = (ent[k] || 0) + amount;
    } else if (tipo === "USCITE") {
      const mis = sentence(c[C.missioneDesc]) || "Otros";
      speseMis[mis] = (speseMis[mis] || 0) + amount;
      const prog = sentence(c[C.programmaDesc]) || mis;
      speseProg[mis] = speseProg[mis] || {};
      speseProg[mis][prog] = (speseProg[mis][prog] || 0) + amount;
    }
  }

  const ingresosByCat = Object.entries(ent)
    .map(([label, amount], i) => ({ key: "e" + i, label, color: colorFor(i), amount: Math.round(amount) }))
    .sort((a, b) => b.amount - a.amount);

  const gastosByCat = Object.entries(speseMis)
    .map(([label, amount], i) => {
      const color = colorFor(i);
      const children = Object.entries(speseProg[label] || {})
        .map(([l, a], j) => ({ key: `m${i}-${j}`, label: l, color, amount: Math.round(a) }))
        .sort((a, b) => b.amount - a.amount);
      return { key: "m" + i, label, color, amount: Math.round(amount), ...(children.length > 1 ? { children } : {}) };
    })
    .sort((a, b) => b.amount - a.amount);

  const ingresos = ingresosByCat.reduce((a, c) => a + c.amount, 0);
  const gastos = gastosByCat.reduce((a, c) => a + c.amount, 0);

  if (ingresos < 100_000_000 || gastos < 100_000_000) {
    throw new Error(`Totales sospechosos (entrate=${ingresos}, uscite=${gastos}).`);
  }

  const out = {
    id: "milano",
    name: "Milano",
    provincia: "Milano",
    country: "it",
    slug: "milano",
    year: YEAR,
    isSample: false,
    basis: "Rendiconto 2024 (esecuzione reale)",
    source: {
      name: "Comune di Milano · Open Data",
      url: "https://dati.comune.milano.it/dataset/ds2956_ammcomunale-bilancio-rendiconto-previsioni-triennale-2023-2027",
    },
    ingresos,
    gastos,
    ingresosByCat,
    gastosByCat,
  };

  const outDir = join(__dirname, "..", "web", "src", "data", "real");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "milano.json"), JSON.stringify(out, null, 2));

  console.log("Milano", YEAR, "(Rendiconto)");
  console.log("  Entrate:", ingresos.toLocaleString("it"), "€");
  console.log("  Uscite: ", gastos.toLocaleString("it"), "€");
  console.log("  Missioni principali:");
  gastosByCat.slice(0, 6).forEach((m) => console.log("    ", m.label, (m.amount / 1e6 | 0) + "M€"));
}

main().catch((e) => {
  console.error("ETL Milano ERROR:", e.message);
  process.exit(1);
});
