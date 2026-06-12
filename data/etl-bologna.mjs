// ---------------------------------------------------------------------------
// ETL Bologna — dati REALI del bilancio comunale.
// Fonte: Open Data Comune di Bologna (OpenDataSoft).
//   Uscite:  bilancio-di-previsione-previsione-uscite (per MISSIONE + programma)
//   Entrate: bilancio-di-previsione-previsione-entrate (per titolo)
//   Importo: previsioni_di_competenza_primo_anno, anno più recente disponibile.
// ---------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ODS = "https://opendata.comune.bologna.it/api/explore/v2.1/catalog/datasets/";

const PALETTE = ["#22d3ee", "#f472b6", "#a3e635", "#818cf8", "#fbbf24", "#34d399", "#fb7185", "#38bdf8", "#c084fc", "#2dd4bf", "#f59e0b", "#a78bfa", "#fb923c", "#4ade80", "#e879f9", "#94a3b8"];
const sentence = (s) => { s = String(s || "").trim().toLowerCase(); return s ? s[0].toUpperCase() + s.slice(1) : s; };
const AMT = "previsioni_di_competenza_primo_anno";

async function records(id) {
  const r = await fetch(ODS + id + "/exports/json?limit=-1", { headers: { "user-agent": "Mozilla/5.0 (compatible; CuentasClarasETL/1.0)" } });
  if (!r.ok) throw new Error(`${id} HTTP ${r.status}`);
  return r.json();
}
const years = (rows, yf) => new Set(rows.map((x) => +x[yf] || 0).filter(Boolean));

function aggregate(rows, year, yearField, labelField, childField) {
  const by = {}, byChild = {};
  for (const x of rows) {
    if (+x[yearField] !== year) continue;
    const k = sentence(x[labelField]);
    const a = +x[AMT] || 0;
    if (!k || !a) continue;
    by[k] = (by[k] || 0) + a;
    if (childField) {
      byChild[k] = byChild[k] || {};
      const ck = sentence(x[childField]) || k;
      byChild[k][ck] = (byChild[k][ck] || 0) + a;
    }
  }
  return Object.entries(by).map(([label, amount], i) => {
    const color = PALETTE[i % PALETTE.length];
    const children = childField ? Object.entries(byChild[label] || {}).map(([l, a], j) => ({ key: `${i}-${j}`, label: l, color, amount: Math.round(a) })).sort((a, b) => b.amount - a.amount) : [];
    return { key: "k" + i, label, color, amount: Math.round(amount), ...(children.length > 1 ? { children } : {}) };
  }).sort((a, b) => b.amount - a.amount);
}

async function main() {
  const usc = await records("bilancio-di-previsione-previsione-uscite");
  const ent = await records("bilancio-di-previsione-previsione-entrate");
  // año común más reciente (uscite usa 'anno_di_riferimento', entrate otro campo)
  const uY = years(usc, "anno_di_riferimento");
  const eY = years(ent, "anno_di_riferimento_del_bilancio");
  const year = Math.max(0, ...[...uY].filter((y) => eY.has(y)));
  if (!year) throw new Error("sin año común");

  const gastosByCat = aggregate(usc, year, "anno_di_riferimento", "missione0", "programma0");
  const ingresosByCat = aggregate(ent, year, "anno_di_riferimento_del_bilancio", "descrizione_titolo", null);

  const gastos = gastosByCat.reduce((a, c) => a + c.amount, 0);
  const ingresos = ingresosByCat.reduce((a, c) => a + c.amount, 0);
  if (gastos < 100_000_000 || ingresos < 100_000_000) throw new Error(`Totales bajos (${ingresos}/${gastos})`);

  const out = {
    id: "bologna", name: "Bologna", provincia: "Bologna", country: "it", slug: "bologna",
    year, isSample: false, basis: `Bilancio di previsione ${year}`,
    source: { name: "Comune di Bologna · Open Data", url: "https://opendata.comune.bologna.it/explore/dataset/bilancio-di-previsione-previsione-uscite/" },
    ingresos, gastos, ingresosByCat, gastosByCat,
  };
  mkdirSync(join(__dirname, "..", "web", "src", "data", "real"), { recursive: true });
  writeFileSync(join(__dirname, "..", "web", "src", "data", "real", "bologna.json"), JSON.stringify(out, null, 2));
  console.log("Bologna", year, "→ Entrate", ingresos.toLocaleString("it"), "€ | Uscite", gastos.toLocaleString("it"), "€");
  gastosByCat.slice(0, 4).forEach((m) => console.log("   ", m.label, (m.amount / 1e6 | 0) + "M€"));
}
main().catch((e) => { console.error("ETL Bologna ERROR:", e.message); process.exit(1); });
