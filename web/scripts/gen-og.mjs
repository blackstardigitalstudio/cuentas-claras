// Genera la imagen social (OG) del sitio: web/public/og.png (1200x630).
// Se ejecuta EN LOCAL una sola vez (las fuentes salen de C:\Windows\Fonts) y el
// PNG resultante se commitea como asset estático → cero dependencias en runtime.
//   cd web && node scripts/gen-og.mjs

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 1200, H = 630;

const arial = readFileSync("C:/Windows/Fonts/arial.ttf");
const arialBd = readFileSync("C:/Windows/Fonts/arialbd.ttf");

const markup = html(`
<div style="display:flex;flex-direction:column;width:100%;height:100%;background:#05070f;background-image:radial-gradient(900px 500px at 80% -10%, rgba(34,211,238,0.22), transparent), radial-gradient(800px 500px at 0% 120%, rgba(129,140,248,0.22), transparent);padding:64px 72px;font-family:Arial;">
  <div style="display:flex;align-items:center;gap:16px;">
    <div style="display:flex;width:18px;height:18px;border-radius:9999px;background:#22d3ee;"></div>
    <div style="display:flex;font-size:30px;font-weight:700;color:#e8edff;letter-spacing:2px;">CUENTAS CLARAS</div>
  </div>

  <div style="display:flex;flex-direction:column;margin-top:48px;">
    <div style="display:flex;font-size:74px;font-weight:700;color:#e8edff;line-height:1.05;">¿A dónde va</div>
    <div style="display:flex;font-size:74px;font-weight:700;color:#22d3ee;line-height:1.05;">el dinero público?</div>
    <div style="display:flex;font-size:38px;color:#8a97c0;margin-top:20px;">Dove vanno i soldi pubblici · España e Italia</div>
  </div>

  <div style="display:flex;gap:18px;margin-top:auto;">
    <div style="display:flex;font-size:26px;color:#34d399;border:2px solid rgba(52,211,153,0.45);border-radius:9999px;padding:10px 26px;">Datos oficiales</div>
    <div style="display:flex;font-size:26px;color:#818cf8;border:2px solid rgba(129,140,248,0.45);border-radius:9999px;padding:10px 26px;">Mapa · Ranking</div>
    <div style="display:flex;font-size:26px;color:#f472b6;border:2px solid rgba(244,114,182,0.45);border-radius:9999px;padding:10px 26px;">Escándalos · en vivo</div>
  </div>
</div>
`);

const svg = await satori(markup, {
  width: W,
  height: H,
  fonts: [
    { name: "Arial", data: arial, weight: 400, style: "normal" },
    { name: "Arial", data: arialBd, weight: 700, style: "normal" },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
const outDir = join(__dirname, "..", "public");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "og.png"), png);
console.log(`OG image escrita: web/public/og.png (${(png.length / 1024) | 0} KB)`);
