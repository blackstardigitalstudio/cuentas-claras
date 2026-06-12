// ---------------------------------------------------------------------------
// ETL Barcelona — datos REALES de ejecución presupuestaria
// Fuente: Open Data BCN (CKAN), Ajuntament de Barcelona.
//   Gastos  -> "Obligat" (obligaciones reconocidas = gasto ejecutado real)
//   Ingresos-> "Drets_Liquidats" (derechos liquidados = ingreso real)
//
// Self-contained: descarga los CSV del portal (para que el cron de CI pueda
// reconstruir con los datos más recientes). Si la descarga falla, lanza error
// y el workflow conserva el barcelona.json ya existente.
//
// Los CSV no usan comillas y algunas etiquetas internas contienen comas, así
// que parseamos de forma robusta: códigos al inicio + importes (con punto
// decimal) al final, y el área de gasto por regex sobre nombres sin acentos.
// ---------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const YEAR = 2024;

const SOURCES = {
  despeses:
    "https://opendata-ajuntament.barcelona.cat/data/dataset/bc2c4827-3e71-4492-b248-82234ee03b84/resource/3d17980c-bbbe-47b9-81bd-745fa81e61a4/download/2024_od14_pressupost-despeses.csv",
  ingressos:
    "https://opendata-ajuntament.barcelona.cat/data/dataset/76b0ec9e-61fd-4aad-ab6b-3f1bbe3e8f55/resource/4f7adf32-17b5-41c6-83c1-e49198bc34c9/download/2024_od15_pressupost-ingressos.csv",
};

// Capítulos económicos -> etiqueta ciudadana (es) + color neón
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
// Áreas de gasto (clasificación por programas) -> etiqueta + color
const AREAS = {
  "0": ["Deuda pública", "#f87171"],
  "1": ["Servicios públicos básicos", "#22d3ee"],
  "2": ["Protección y promoción social", "#f472b6"],
  "3": ["Sanidad, educación y cultura", "#a3e635"],
  "4": ["Actuaciones económicas", "#fbbf24"],
  "9": ["Administración general", "#818cf8"],
};
const AREA_NAMES =
  "DEUTE PUBLIC|SERVEIS PUBLICS BASICS|ACTUACIONS DE PROTECCIO I PROMOCIO SOCIAL|PRODUCCIO DE BENS PUBLICS DE CARACTER PREFERENT|ACTUACIONS DE CARACTER ECONOMIC|ACTUACIONS DE CARACTER GENERAL";
const AREA_RE = new RegExp(`,([012349]),(?:${AREA_NAMES}),`);
// Captura también el código de POLÍTICA (2 dígitos) que sigue al nombre de área.
const AREA_POL_RE = new RegExp(`,([012349]),(?:${AREA_NAMES}),(\\d{2}),`);

// Políticas de gasto (clasificación por programas, Orden EHA/3565/2008) -> etiqueta.
const POLITICAS = {
  "00": "Otras (sin desglosar)",
  "01": "Deuda pública",
  "13": "Seguridad y movilidad ciudadana",
  "15": "Vivienda y urbanismo",
  "16": "Bienestar comunitario (limpieza, agua, alumbrado…)",
  "17": "Medio ambiente",
  "21": "Pensiones",
  "22": "Otras prestaciones sociales",
  "23": "Servicios sociales y promoción social",
  "24": "Fomento del empleo",
  "31": "Sanidad",
  "32": "Educación",
  "33": "Cultura",
  "34": "Deporte",
  "41": "Agricultura y pesca",
  "42": "Industria y energía",
  "43": "Comercio y turismo",
  "44": "Transporte público",
  "45": "Infraestructuras",
  "46": "Investigación y desarrollo",
  "49": "Otras actuaciones económicas",
  "91": "Órganos de gobierno",
  "92": "Servicios de carácter general",
  "93": "Administración financiera y tributaria",
  "94": "Transferencias a otras administraciones",
};

// "ADMINISTRACIO GENERAL" -> "Administració general" (capitaliza solo la inicial).
const sentence = (s) => {
  s = String(s || "").trim().toLowerCase();
  return s ? s[0].toUpperCase() + s.slice(1) : s;
};

// Quita acentos y pasa a mayúsculas para que los nombres de área casen siempre.
function norm(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
}

function parseNum(s) {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

// Árbol de gasto funcional: cada nodo { amount, label, color, kids }.
function bump(container, code, label, color, amount) {
  const n = container[code] || (container[code] = { amount: 0, label, color, kids: {} });
  n.amount += amount;
  if (!n.label && label) n.label = label;
  return n;
}
// Convierte el árbol a CategoryDatum recursivo. Solo anida si hay >1 hijo
// (evita cadenas redundantes donde un nivel repite al padre).
function toCats(container, prefix) {
  return Object.entries(container)
    .map(([code, n]) => {
      const children = toCats(n.kids, `${prefix}${code}-`);
      return {
        key: `${prefix}${code}`,
        label: n.label,
        color: n.color,
        amount: Math.round(n.amount),
        ...(children.length > 1 ? { children } : {}),
      };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

function aggregate(text, { amountFromEnd, capMap, withArea }) {
  const lines = text.split(/\r?\n/);
  const byCap = {};
  const forest = {}; // código de área -> nodo raíz del árbol funcional
  let total = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const tok = line.split(",");
    const cap = tok[0];
    if (!capMap[cap]) continue;
    const amount = parseNum(tok[tok.length - amountFromEnd]);
    if (!amount) continue;
    total += amount;
    byCap[cap] = (byCap[cap] || 0) + amount;
    if (withArea) {
      const nline = norm(line);
      const m = nline.match(AREA_RE);
      const area = m ? m[1] : "9";
      const color = (AREAS[area] || AREAS["9"])[1];
      const aNode = bump(forest, area, (AREAS[area] || AREAS["9"])[0], color, amount);
      if (m) {
        // Tras el nombre de área, campos sin comas:
        //   {pol 2d},{txt},{grupo 3d},{txt},{programa 4d},{txt},{subprograma 5d},{txt},…amounts
        // Split seguro; anidamos TODOS los niveles disponibles (2→5).
        const seg = nline.slice(m.index + m[0].length).split(",");
        const pol = seg[0];
        if (/^\d{2}$/.test(pol) && pol[0] === area) {
          let node = bump(aNode.kids, pol, POLITICAS[pol] || `Política ${pol}`, color, amount);
          // Niveles 3-5: grupo de programa (3d), programa (4d), subprograma (5d).
          const deeper = [
            [seg[2], seg[3], 3],
            [seg[4], seg[5], 4],
            [seg[6], seg[7], 5],
          ];
          for (const [code, label, len] of deeper) {
            if (!code || !new RegExp(`^\\d{${len}}$`).test(code)) break;
            node = bump(node.kids, code, sentence(label) || `Código ${code}`, color, amount);
          }
        }
      }
    }
  }
  const cats = Object.entries(byCap)
    .map(([k, amount]) => ({ key: "c" + k, label: capMap[k][0], color: capMap[k][1], amount: Math.round(amount) }))
    .sort((a, b) => b.amount - a.amount);
  const areas = toCats(forest, "a");
  return { total: Math.round(total), cats, areas };
}

async function fetchCsv(url, cacheName) {
  // Algunos CDN/portales devuelven una página interstitial a peticiones sin
  // User-Agent (lo que rompía la descarga en el runner de CI). Simulamos un
  // navegador y validamos que el contenido es realmente el CSV esperado.
  const r = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; CuentasClarasETL/1.0; +https://github.com/blackstardigitalstudio/cuentas-claras)",
      accept: "text/csv,application/octet-stream,*/*",
    },
  });
  if (!r.ok) throw new Error(`Descarga falló (${r.status}) para ${cacheName}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const text = buf.toString("utf8");
  if (!text.startsWith("Codi_Capitol")) {
    throw new Error(
      `Contenido inesperado en ${cacheName} (no es el CSV esperado). Primeros 80 chars: ${text.slice(0, 80)}`
    );
  }
  const rawDir = join(__dirname, "raw");
  mkdirSync(rawDir, { recursive: true });
  writeFileSync(join(rawDir, cacheName), buf); // cache para depurar
  return text;
}

async function main() {
  const despesesTxt = await fetchCsv(SOURCES.despeses, "bcn-2024-despeses.csv");
  const ingressosTxt = await fetchCsv(SOURCES.ingressos, "bcn-2024-ingressos.csv");

  // Gastos: Obligat = 3º importe desde el final (…,Obligat,Pag_Efectuat,Oblig_Pendent_Pag)
  const gas = aggregate(despesesTxt, { amountFromEnd: 3, capMap: GAS_CAP, withArea: true });
  // Ingresos: Drets_Liquidats = 2º importe desde el final (…,Drets_Liquidats,Recaptat_Liquidat)
  const ing = aggregate(ingressosTxt, { amountFromEnd: 2, capMap: ING_CAP, withArea: false });

  const out = {
    id: "barcelona",
    name: "Barcelona",
    provincia: "Barcelona",
    slug: "barcelona",
    year: YEAR,
    isSample: false,
    basis: "Ejecución: obligaciones reconocidas (gasto) y derechos liquidados (ingreso)",
    source: {
      name: "Ajuntament de Barcelona · Open Data BCN",
      url: "https://opendata-ajuntament.barcelona.cat/data/ca/dataset/pressupost-despeses",
    },
    ingresos: ing.total,
    gastos: gas.total,
    ingresosByCat: ing.cats,
    gastosByCat: gas.areas, // vista funcional: "a dónde va"
    gastosByEconomic: gas.cats, // vista económica: "en qué forma se gasta"
  };

  // Validación: nunca sobrescribir con datos absurdos (descarga fallida que
  // devuelve 200 con HTML/interstitial se parsea a 0). Si pasa, lanzamos error
  // y el workflow conserva el barcelona.json bueno ya commiteado.
  const MIN_PLAUSIBLE = 100_000_000; // Barcelona ronda los 3.700 M€
  if (out.ingresos < MIN_PLAUSIBLE || out.gastos < MIN_PLAUSIBLE) {
    throw new Error(
      `Totales sospechosos (ingresos=${out.ingresos}, gastos=${out.gastos}). ` +
        `Probable fallo de descarga; NO se sobrescribe barcelona.json.`
    );
  }

  const outDir = join(__dirname, "..", "web", "src", "data", "real");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "barcelona.json"), JSON.stringify(out, null, 2));

  console.log("Barcelona", YEAR, "actualizado");
  console.log("  Ingresos:", out.ingresos.toLocaleString("es"), "€");
  console.log("  Gastos:  ", out.gastos.toLocaleString("es"), "€");
  gas.areas.forEach((a) => console.log("   ", a.label, a.amount.toLocaleString("es"), "€"));
}

main().catch((e) => {
  console.error("ETL Barcelona ERROR:", e.message);
  process.exit(1);
});
