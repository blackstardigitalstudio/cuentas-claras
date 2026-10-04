// Genera i caroselli Instagram "Il numero del giorno / El dato del día".
//
//   cd web && node scripts/gen-instagram.mjs            -> tutti i fatti
//   cd web && node scripts/gen-instagram.mjs it-debito-record es-zero-debito
//
// Ogni post sono 3 slide 1080x1350 (il formato verticale che Instagram mostra
// più grande nel feed):
//   1. la DOMANDA  -> il problema in cui chi scorre si riconosce
//   2. il NUMERO   -> la risposta, enorme
//   3. COSA VUOL DIRE nella vita vera + la FONTE ufficiale
// più la didascalia pronta da incollare (didascalia.txt) e un'anteprima delle 3
// slide affiancate, per rivederle in un colpo d'occhio.
//
// I numeri NON si scrivono qui: arrivano da scripts/instagram/fatti.ts, che li
// calcola dagli stessi dati del sito. Niente si pubblica da solo: i file vanno
// rivisti da Matteo e caricati a mano.
//
// Font: Geist (lo stesso del sito, licenza OFL) in scripts/instagram/fonts, così
// gira uguale su Windows e su GitHub Actions. resvg non disegna le emoji: nelle
// slide niente emoji, solo testo.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

const QUI = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(QUI, "..");
const OUT = path.join(WEB, "..", "instagram");
const W = 1080;
const H = 1350;

const font = (f) => fs.readFileSync(path.join(QUI, "instagram", "fonts", f));
const FONTS = [
  { name: "Geist", data: font("Geist-400.ttf"), weight: 400, style: "normal" },
  { name: "Geist", data: font("Geist-600.ttf"), weight: 600, style: "normal" },
  { name: "Geist", data: font("Geist-800.ttf"), weight: 800, style: "normal" },
  { name: "Geist Mono", data: font("GeistMono-500.ttf"), weight: 500, style: "normal" },
];

// Colori del sito (globals.css)
const C = { bg: "#05070f", fg: "#e8edff", muted: "#8a97c0", cyan: "#22d3ee", indigo: "#818cf8", magenta: "#f472b6" };

// "13.800 €" non deve mai spezzarsi su due righe: spazio indivisibile prima di €.
const esc = (s) => String(s).replace(/ €/g, " €").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ------------------------------------------------------------ dati
async function caricaFatti() {
  const tmp = path.join(WEB, ".instagram-fatti.mjs");
  await build({
    stdin: { contents: `export { tuttiIFatti } from "./scripts/instagram/fatti";`, resolveDir: WEB, loader: "ts" },
    bundle: true,
    platform: "node",
    format: "esm",
    outfile: tmp,
    tsconfig: path.join(WEB, "tsconfig.json"),
    logLevel: "error",
  });
  try {
    const mod = await import(pathToFileURL(tmp).href + `?t=${Date.now()}`);
    return mod.tuttiIFatti();
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

// ------------------------------------------------------------ slide
const TESTI = {
  it: { serie: "Il numero del giorno", scorri: "Scorri", fonte: "Fonte", cta: "Cerca la tua città su", anno: "Dati" },
  es: { serie: "El dato del día", scorri: "Desliza", fonte: "Fuente", cta: "Busca tu ciudad en", anno: "Datos" },
};

// Cornice comune: sfondo con i bagliori del sito, marchio in alto, piede in basso.
function cornice(p, n, corpo, glow = "cyan") {
  const T = TESTI[p];
  const g = glow === "magenta" ? "rgba(244,114,182,0.20)" : "rgba(34,211,238,0.20)";
  const pallini = [1, 2, 3]
    .map((i) => `<div style="display:flex;width:${i === n ? 34 : 12}px;height:12px;border-radius:9999px;background:${i === n ? C.cyan : "rgba(232,237,255,0.22)"};margin-left:10px;"></div>`)
    .join("");
  return `
<div style="display:flex;flex-direction:column;width:100%;height:100%;background:${C.bg};background-image:radial-gradient(900px 700px at 85% -5%, ${g}, transparent), radial-gradient(800px 700px at -10% 110%, rgba(129,140,248,0.18), transparent);padding:84px 84px 72px;font-family:Geist;color:${C.fg};">
  <div style="display:flex;align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;">
      <div style="display:flex;width:20px;height:20px;border-radius:9999px;background:${C.cyan};box-shadow:0 0 24px ${C.cyan};"></div>
      <div style="display:flex;margin-left:18px;font-size:30px;font-weight:800;letter-spacing:3px;">CUENTAS CLARAS</div>
    </div>
    <div style="display:flex;font-family:'Geist Mono';font-size:26px;color:${C.muted};border:2px solid rgba(138,151,192,0.35);border-radius:9999px;padding:8px 22px;">${p === "it" ? "ITALIA" : "ESPAÑA"}</div>
  </div>
  <div style="display:flex;flex-direction:column;flex:1;justify-content:center;">${corpo}</div>
  <div style="display:flex;align-items:center;justify-content:space-between;">
    <div style="display:flex;font-size:28px;color:${C.muted};">${esc(T.serie)}</div>
    <div style="display:flex;align-items:center;">${pallini}</div>
  </div>
</div>`;
}

// Il testo grande si adatta alla lunghezza: una domanda corta urla, una lunga
// resta leggibile senza uscire dalla slide.
const misuraDomanda = (s) => (s.length <= 32 ? 112 : s.length <= 48 ? 98 : 84);
// La cifra si misura sulla sua larghezza stimata (le cifre di Geist 800 sono
// larghe ~0,62 em, punti e virgole ~0,3), così riempie la slide senza uscire.
function misuraCifra(s) {
  const em = [...s].reduce((t, c) => t + (/[0-9]/.test(c) ? 0.62 : 0.3), 0);
  return Math.min(280, Math.floor(860 / Math.max(em, 1)));
}

function slideDomanda(f) {
  const T = TESTI[f.paese];
  return cornice(
    f.paese,
    1,
    `<div style="display:flex;font-size:${misuraDomanda(f.domanda)}px;font-weight:800;line-height:1.04;letter-spacing:-2px;">${esc(f.domanda)}</div>
     <div style="display:flex;align-items:center;margin-top:64px;font-size:34px;font-weight:600;color:${C.cyan};">${esc(T.scorri)}<div style="display:flex;margin-left:16px;font-size:40px;">→</div></div>`,
  );
}

function slideNumero(f) {
  // "3,4 miliardi €" -> cifra "3,4" enorme, "miliardi €" sotto più piccolo;
  // "165.600 €" -> cifra enorme, "€" accanto.
  const [cifra, ...resto] = f.numero.split(" ");
  const unita = resto.join(" ");
  const size = misuraCifra(cifra);
  const glow = `color:${C.cyan};text-shadow:0 0 60px rgba(34,211,238,0.55);font-weight:800;line-height:1;`;
  const unitaHtml = !unita
    ? ""
    : unita === "€"
      ? `<div style="display:flex;margin-left:24px;margin-bottom:${Math.round(size * 0.1)}px;font-size:${Math.round(size * 0.42)}px;${glow}">€</div>`
      : "";
  const sottoUnita = unita && unita !== "€" ? `<div style="display:flex;margin-top:18px;font-size:96px;letter-spacing:-2px;${glow}">${esc(unita)}</div>` : "";
  return cornice(
    f.paese,
    2,
    `<div style="display:flex;align-items:flex-end;"><div style="display:flex;font-size:${size}px;letter-spacing:-6px;${glow}">${esc(cifra)}</div>${unitaHtml}</div>${sottoUnita}
     <div style="display:flex;margin-top:40px;font-size:46px;font-weight:600;line-height:1.25;color:${C.fg};">${esc(f.sottoNumero)}</div>`,
    "magenta",
  );
}

function slideSignificato(f) {
  const T = TESTI[f.paese];
  const sito = f.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const fonte = f.anno ? `${f.fonte.name} · ${T.anno} ${f.anno}` : f.fonte.name;
  return cornice(
    f.paese,
    3,
    `<div style="display:flex;font-size:60px;font-weight:600;line-height:1.22;letter-spacing:-1px;">${esc(f.traduzione)}</div>
     <div style="display:flex;flex-direction:column;margin-top:64px;padding-top:36px;border-top:2px solid rgba(138,151,192,0.25);">
       <div style="display:flex;font-family:'Geist Mono';font-size:24px;color:${C.muted};letter-spacing:2px;">${esc(T.fonte.toUpperCase())}</div>
       <div style="display:flex;margin-top:12px;font-size:30px;line-height:1.35;color:${C.fg};opacity:0.85;">${esc(fonte)}</div>
     </div>
     <div style="display:flex;flex-direction:column;margin-top:56px;">
       <div style="display:flex;font-size:32px;color:${C.muted};">${esc(T.cta)}</div>
       <div style="display:flex;margin-top:6px;font-size:40px;font-weight:800;color:${C.cyan};">${esc(sito)}</div>
     </div>`,
  );
}

async function png(markup, w = W, h = H) {
  const svg = await satori(html(markup), { width: w, height: h, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: "width", value: w } }).render().asPng();
}

// ------------------------------------------------------------ didascalia
function didascalia(f) {
  const it = f.paese === "it";
  const T = TESTI[f.paese];
  const fonte = f.anno ? `${f.fonte.name} (${T.anno.toLowerCase()} ${f.anno})` : f.fonte.name;
  return [
    f.domanda,
    "",
    `${f.numero} ${f.sottoNumero}`,
    "",
    f.traduzione,
    "",
    `${T.fonte}: ${fonte}`,
    it ? "Il link alla fonte e la tua città: link in bio." : "El enlace a la fuente y tu ciudad: enlace en la bio.",
    "",
    f.hashtag.map((h) => `#${h}`).join(" "),
    "",
    "Made in Italy 🇮🇹",
  ].join("\n");
}

// ------------------------------------------------------------ main
const scelti = process.argv.slice(2);
const fatti = (await caricaFatti()).filter((f) => !scelti.length || scelti.includes(f.id));
if (!fatti.length) {
  console.error("[instagram] nessun fatto trovato", scelti.length ? `per: ${scelti.join(", ")}` : "");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
for (const f of fatti) {
  const dir = path.join(OUT, f.id);
  fs.mkdirSync(dir, { recursive: true });
  const slide = [await png(slideDomanda(f)), await png(slideNumero(f)), await png(slideSignificato(f))];
  slide.forEach((b, i) => fs.writeFileSync(path.join(dir, `${i + 1}.png`), b));
  fs.writeFileSync(path.join(dir, "didascalia.txt"), didascalia(f) + "\n", "utf8");
  fs.writeFileSync(path.join(dir, "fonte.txt"), `${f.fonte.name}\n${f.fonte.url}\n\nPagina del sito: ${f.url}\n`, "utf8");

  // anteprima: le 3 slide affiancate, piccole (SVG diretto in resvg: veloce)
  const pw = 360, ph = 450, gap = 24;
  const aw = pw * 3 + gap * 4, ah = ph + gap * 2;
  const imgs = slide.map((b, i) => `<image x="${gap + i * (pw + gap)}" y="${gap}" width="${pw}" height="${ph}" href="data:image/png;base64,${b.toString("base64")}"/>`).join("");
  const svgA = `<svg xmlns="http://www.w3.org/2000/svg" width="${aw}" height="${ah}"><rect width="100%" height="100%" fill="#11131c"/>${imgs}</svg>`;
  fs.writeFileSync(path.join(dir, "anteprima.png"), new Resvg(svgA).render().asPng());
  console.log(`[instagram] ${f.id}: 3 slide + didascalia -> instagram/${f.id}/`);
}
console.log(`[instagram] fatto: ${fatti.length} post in ${OUT}`);
