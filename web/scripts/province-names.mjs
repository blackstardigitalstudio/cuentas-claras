// Estrae solo i NOMI delle province dai GeoJSON (Spagna e Italia).
//
// PERCHÉ SERVE: lib/data.ts è importato da quasi ogni pagina. Se importa i
// GeoJSON interi (7+ MB di coordinate), quelle coordinate finiscono nel
// JavaScript che ogni visitatore scarica ed esegue, anche dove la mappa non c'è.
// A data.ts bastano i nomi: questo file li tiene in un JSON piccolo. Le
// coordinate le carica solo la mappa (RegionMapGL), che parte in modo pigro.
//
// Gira in automatico prima di `npm run build` (script "prebuild").

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "data");
const names = (file) =>
  JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")).features.map((f) => f.properties.name);

const out = { es: names("spain-provinces.json"), it: names("italy-provinces.json") };
fs.writeFileSync(path.join(dir, "province-names.json"), JSON.stringify(out) + "\n");
console.log(`province-names: ${out.es.length} ES, ${out.it.length} IT`);
