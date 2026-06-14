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

// "Rincón scoop": titulares duros sobre el dinero público, por FILONES temáticos.
// Son TITULARES DE MEDIOS (cada uno enlaza a su fuente); el sitio no acusa a nadie
// y respeta la presunción de inocencia (aviso en la página).
const LOC = {
  es: { hl: "es", gl: "ES", ceid: "ES:es" },
  it: { hl: "it", gl: "IT", ceid: "IT:it" },
};
// Clave de tema → consulta por idioma. El tema "scoop" (corrupción) conserva la
// clave `<loc>_scoop` por retro-compatibilidad (es el que usa la portada).
const SCOOP_THEMES = {
  scoop: {
    es: 'corrupción ayuntamiento OR "malversación de caudales públicos" OR "fraude fondos públicos" OR "alcalde detenido"',
    it: 'corruzione comune OR "peculato fondi pubblici" OR "scandalo appalti" OR "arresto sindaco"',
  },
  funds: {
    es: '"fondos europeos" irregularidades OR "fondos Next Generation" OR subvenciones fraude OR adjudicación contrato irregular',
    it: '"fondi PNRR" irregolarità OR "fondi europei" frode OR appalti pubblici indagine OR subappalti irregolari',
  },
  verdicts: {
    es: '"Tribunal de Cuentas" OR condenado corrupción OR "pena de prisión" malversación OR detenido cargo público',
    it: '"Corte dei Conti" condanna OR condannato corruzione OR arrestato sindaco OR "danno erariale" sentenza',
  },
  waste: {
    es: 'despilfarro OR sobrecoste obra pública OR "contrato a dedo" OR gasto polémico ayuntamiento',
    it: "sprechi soldi pubblici OR sprechi comune OR sovrapprezzo appalto OR spreco fondi pubblici",
  },
  nepotism: {
    es: 'enchufismo ayuntamiento OR nepotismo cargo público OR "contratación a dedo" OR enchufe administración',
    it: "parentopoli OR assunzioni clientelari OR concorso pubblico truccato OR nepotismo pubblica amministrazione",
  },
  sanctions: {
    es: 'inhabilitación cargo público OR "Tribunal de Cuentas" multa OR sanción alcalde OR reintegro fondos públicos',
    it: 'interdizione pubblici uffici OR "Corte dei Conti" sanzione OR sindaco multato OR risarcimento danno erariale',
  },
};
const MAX_SCOOP = 10;

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
  // Rincón scoop por filones temáticos. No es crítico: si un feed falla, se omite.
  for (const [theme, q] of Object.entries(SCOOP_THEMES)) {
    for (const loc of ["es", "it"]) {
      try {
        news[`${loc}_${theme}`] = await fetchFeed(loc, { q: q[loc], ...LOC[loc] }, MAX_SCOOP);
        console.log(`Scoop ${loc}/${theme}: ${news[`${loc}_${theme}`].length} titulares`);
      } catch (e) {
        console.log(`Scoop ${loc}/${theme}: falló (${e.message})`);
      }
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
