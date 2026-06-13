// ---------------------------------------------------------------------------
// ETL Noticias — titulares REALES sobre dinero público por país.
// Fuente: Google News RSS (agrega medios registrados; cada ítem enlaza al
// medio original, con nombre de fuente y fecha → verificable por el lector).
// Se ejecuta en build; el sitio se regenera periódicamente (no es tiempo real).
// ---------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAX_PER_COUNTRY = 8;

const FEEDS = {
  es: {
    q: "gasto público ayuntamiento OR presupuesto municipal OR transparencia cuentas",
    hl: "es",
    gl: "ES",
    ceid: "ES:es",
  },
  it: {
    q: "spesa pubblica comune OR bilancio comunale OR Corte dei Conti enti locali",
    hl: "it",
    gl: "IT",
    ceid: "IT:it",
  },
};

// "Rincón scoop": titulares duros sobre corrupción, fraude y mala gestión del
// dinero público. Son TITULARES DE MEDIOS (cada uno enlaza a su fuente); el sitio
// no acusa a nadie y respeta la presunción de inocencia (aviso en la página).
const SCOOP_FEEDS = {
  es: {
    q: 'corrupción ayuntamiento OR "malversación de caudales públicos" OR "fraude fondos públicos" OR "alcalde detenido" OR "dinero público" juzgado',
    hl: "es",
    gl: "ES",
    ceid: "ES:es",
  },
  it: {
    q: 'corruzione comune OR "peculato fondi pubblici" OR "scandalo appalti" OR "arresto sindaco" OR "danno erariale" Corte dei Conti',
    hl: "it",
    gl: "IT",
    ceid: "IT:it",
  },
};
const MAX_SCOOP = 12;

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}
function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`));
  return m ? decodeEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : "";
}

async function fetchFeed(loc, cfg, max = MAX_PER_COUNTRY) {
  const url =
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(cfg.q) +
    `&hl=${cfg.hl}&gl=${cfg.gl}&ceid=${cfg.ceid}`;
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; CuentasClarasNews/1.0)" } });
  if (!r.ok) throw new Error(`News ${loc} HTTP ${r.status}`);
  const xml = await r.text();
  if (!xml.includes("<item>")) throw new Error(`News ${loc}: sin items`);
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  const out = [];
  for (const block of items) {
    let title = tag(block, "title");
    const source = tag(block, "source");
    const link = tag(block, "link");
    const pub = tag(block, "pubDate");
    if (!title || !link) continue;
    // Google News añade " - Fuente" al final del título: lo quitamos.
    if (source && title.endsWith(" - " + source)) title = title.slice(0, -(source.length + 3)).trim();
    const date = pub ? new Date(pub).toISOString() : null;
    out.push({ title, source, url: link, date });
    if (out.length >= max) break;
  }
  if (!out.length) throw new Error(`News ${loc}: 0 titulares válidos`);
  return out;
}

async function main() {
  const news = {};
  for (const [loc, cfg] of Object.entries(FEEDS)) {
    news[loc] = await fetchFeed(loc, cfg);
    console.log(`Noticias ${loc}: ${news[loc].length} titulares`);
    news[loc].slice(0, 2).forEach((n) => console.log("   -", n.title.slice(0, 70), "·", n.source));
  }
  // Rincón scoop (corrupción / fraude). No es crítico: si falla, se conserva el resto.
  for (const [loc, cfg] of Object.entries(SCOOP_FEEDS)) {
    try {
      news[`${loc}_scoop`] = await fetchFeed(loc, cfg, MAX_SCOOP);
      console.log(`Scoop ${loc}: ${news[`${loc}_scoop`].length} titulares`);
    } catch (e) {
      console.log(`Scoop ${loc}: falló (${e.message})`);
    }
  }
  const outDir = join(__dirname, "..", "web", "src", "data");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "news.json"), JSON.stringify(news, null, 2));
}

main().catch((e) => {
  console.error("ETL Noticias ERROR:", e.message);
  process.exit(1);
});
