// ⏸ NON ATTIVO. Serve solo quando si passerà a MapLibre 6 (vedi memoria
// da-fare-mappa-notizie): il 04/10/2026 il primo tentativo ha lasciato la mappa
// vuota anche con worker e shared pubblicati, quindi si è tornati alla 5.24.
// Per riattivarlo: "prebuild": "node scripts/copia-worker-mappa.mjs" in package.json
// + maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs") in RegionMapGL.tsx,
// e poi VERIFICARE LA MAPPA NEL BROWSER, non solo la compilazione.
//
// Copia il worker di MapLibre nella cartella pubblica PRIMA di ogni build.
//
// PERCHÉ: da MapLibre 6 il "worker" (il processo che disegna le zone della
// mappa) è un file separato, non più incorporato. Se non viene pubblicato, la
// mappa resta vuota: si vedono i puntini ma non le regioni colorate. Successo
// il 04/10/2026 passando dalla 5 alla 6 per chiudere un avviso di sicurezza
// critico (GHSA-jrc7-96c5-q579).
//
// ATTENZIONE: il worker importa "./maplibre-gl-shared.mjs", quindi vanno
// pubblicati TUTTI E DUE, uno accanto all'altro. Copiarne solo uno = mappa vuota.
//
// Li copiamo da node_modules a ogni build invece di tenerne una copia fissa nel
// repository: così sono SEMPRE della stessa versione della libreria. Un worker
// di una versione diversa dalla libreria si rompe in modi strani.
//
// Gira in automatico prima di `npm run build` (script "prebuild").
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(WEB, "node_modules", "maplibre-gl", "dist");
const FILE = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

const versione = JSON.parse(fs.readFileSync(path.join(WEB, "node_modules", "maplibre-gl", "package.json"), "utf8")).version;
for (const nome of FILE) {
  const da = path.join(DIST, nome);
  if (!fs.existsSync(da)) {
    console.error(`[worker-mappa] ERRORE: ${nome} non trovato in node_modules. MapLibre è installato? (npm ci)`);
    process.exit(1);
  }
  fs.copyFileSync(da, path.join(WEB, "public", nome));
}

// Controllo di sicurezza: se una versione futura del worker importasse un file
// in più, ce ne accorgiamo qui invece che con una mappa vuota online.
const importa = [...fs.readFileSync(path.join(DIST, "maplibre-gl-worker.mjs"), "utf8").matchAll(/from\s*["']\.\/([^"']+)["']/g)].map((m) => m[1]);
const mancanti = importa.filter((f) => !FILE.includes(f));
if (mancanti.length) {
  console.error(`[worker-mappa] ERRORE: il worker importa anche ${mancanti.join(", ")} — aggiungerli a FILE in questo script.`);
  process.exit(1);
}
console.log(`[worker-mappa] MapLibre ${versione}: copiati in public/ ${FILE.join(" + ")}`);
