// Genera le immagini AI delle copertine notizie (una per tema) con Pollinations
// (gratis, senza chiave) e le salva in web/public/covers/*.jpg (self-hosted).
// Esecuzione locale una tantum:  cd web && node scripts/gen-covers.mjs
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "covers");
mkdirSync(outDir, { recursive: true });

const base =
  ", dark navy background color #05070f, glowing neon cyan violet and magenta light, cinematic dramatic lighting, futuristic data dashboard aesthetic, high detail, sharp, no text, no words, no letters, no watermark, no signature";
const topics = {
  justice: "glowing neon scales of justice made of light, financial corruption and courtroom concept" + base,
  money: "a glowing neon euro currency symbol made of light with floating luminous coins, public money and budget concept" + base,
  city: "a glowing neon classical government city hall building with columns, civic administration concept" + base,
  funds: "a glowing neon euro coin encircled by a ring of twelve European Union stars, public funds concept" + base,
  data: "an abstract glowing neon financial data visualization, luminous bar charts line graphs and connected network nodes" + base,
};

for (const [name, prompt] of Object.entries(topics)) {
  const url =
    "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) +
    `?width=768&height=432&nologo=true&model=flux&seed=${name.length * 13 + 7}`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(120000) });
    const buf = Buffer.from(await r.arrayBuffer());
    writeFileSync(join(outDir, `${name}.jpg`), buf);
    console.log(`OK ${name} (${(buf.length / 1024) | 0} KB)`);
  } catch (e) {
    console.log(`FAIL ${name}: ${e.message}`);
  }
}
