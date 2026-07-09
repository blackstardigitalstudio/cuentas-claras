// Genera le immagini AI delle copertine notizie con Pollinations (gratis, senza
// chiave): 3 VARIANTI per tema → più varietà. Salva in web/public/covers/<tema>-<n>.jpg
// (self-hosted). Esecuzione locale:  cd web && node scripts/gen-covers.mjs
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "covers");
mkdirSync(outDir, { recursive: true });

const base =
  ", dark navy background color #05070f, glowing neon cyan violet and magenta light, cinematic dramatic lighting, futuristic data dashboard aesthetic, high detail, sharp, no text, no words, no letters, no watermark, no signature";
const VARIANTS = ["front view, symmetrical composition", "dramatic low angle, shallow depth of field", "wide cinematic shot, floating light particles"];
const topics = {
  justice: "glowing neon scales of justice made of light, financial corruption and courtroom concept",
  money: "a glowing neon euro currency symbol made of light with floating luminous coins, public money and budget concept",
  city: "a glowing neon classical government city hall building with columns, civic administration concept",
  funds: "a glowing neon euro coin encircled by a ring of twelve European Union stars, public funds and PNRR concept",
  data: "an abstract glowing neon financial data visualization, luminous bar charts line graphs and connected network nodes",
  waste: "glowing neon euro coins burning and dissolving into sparks of light, wasted public money and overspending concept",
};

let ok = 0, fail = 0;
for (const [name, prompt] of Object.entries(topics)) {
  for (let v = 0; v < VARIANTS.length; v++) {
    const full = `${prompt}, ${VARIANTS[v]}${base}`;
    const seed = name.length * 100 + v * 37 + 7;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=768&height=432&nologo=true&model=flux&seed=${seed}`;
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(120000) });
      const buf = Buffer.from(await r.arrayBuffer());
      writeFileSync(join(outDir, `${name}-${v + 1}.jpg`), buf);
      console.log(`OK ${name}-${v + 1} (${(buf.length / 1024) | 0} KB)`);
      ok++;
    } catch (e) {
      console.log(`FAIL ${name}-${v + 1}: ${e.message}`);
      fail++;
    }
  }
}
console.log(`\nHecho: ${ok} ok, ${fail} fallidas.`);
