// Genera un MP4 por cada club con datos ricos (CLUB_PAGE_SLUGS del sitio).
// Bundle una sola vez y renderiza en bucle → mucho más rápido que llamar al CLI
// una vez por club. La lista de clubes se lee del propio sitio (fuente única).
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import esbuild from "esbuild";
import path from "path";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Lee CLUB_PAGE_SLUGS de ../web/src/data/futbol.ts sin duplicar la lista.
function loadSlugs() {
  const r = esbuild.buildSync({ entryPoints: ["../web/src/data/futbol.ts"], bundle: true, format: "cjs", write: false, platform: "node" });
  const mod = { exports: {} };
  new Function("module", "exports", "require", r.outputFiles[0].text)(mod, mod.exports, require);
  return mod.exports.CLUB_PAGE_SLUGS;
}

const only = process.argv.slice(2); // opcional: node render-all.mjs juventus inter
const slugs = loadSlugs().filter((s) => only.length === 0 || only.includes(s));

fs.mkdirSync("out/clubs", { recursive: true });
console.log(`Renderizando ${slugs.length} vídeos de club…`);

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const slug of slugs) {
  const composition = await selectComposition({ serveUrl, id: "ClubVideo", inputProps: { slug } });
  await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: `out/clubs/${slug}.mp4`, inputProps: { slug } });
  console.log("  ✓", slug);
}
console.log("Listo. Vídeos en video/out/clubs/");
