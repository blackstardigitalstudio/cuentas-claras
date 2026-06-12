// Ejecuta todos los ETL de ciudades de forma independiente.
// Si uno falla (p. ej. el portal bloquea el runner de CI), no aborta los demás
// y SIEMPRE termina con código 0: el build conserva los JSON ya commiteados.

import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scripts = [
  "etl-barcelona.mjs",
  "etl-valencia.mjs",
  "etl-vitoria.mjs",
  "etl-sevilla.mjs",
  "etl-malaga.mjs",
  "etl-gobierto.mjs",
  "etl-milano.mjs",
  "etl-news.mjs",
];

let ok = 0;
for (const f of scripts) {
  const r = spawnSync(process.execPath, [join(__dirname, f)], { stdio: "inherit" });
  if (r.status === 0) ok++;
  else console.error(`\n⚠️  ETL falló: ${f} — se conserva el dataset commiteado.\n`);
}
console.log(`ETL completado: ${ok}/${scripts.length} ciudades actualizadas.`);
process.exit(0);
