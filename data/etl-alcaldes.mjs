// ETL — nomi ufficiali dei sindaci spagnoli (mandato in corso).
//
// PERCHÉ ESISTE: la Search Console mostrava 775 impressioni con ZERO clic su
// ricerche col NOME del sindaco (es. "tania baños martos": 499 impressioni in
// posizione 3, nessun clic). Le nostre schede città dicevano "alcalde" decine di
// volte senza mai nominarlo: Google ci mostrava per pertinenza sul comune, ma
// chi cercava la persona non trovava risposta nel titolo e passava oltre.
//
// FONTE UFFICIALE: Ministerio de Política Territorial y Memoria Democrática,
// "Cargos Representativos Locales" — elenco dei sindaci della legislatura in
// corso, scaricabile sotto le condizioni di riuso di datos.gob.es.
//   https://concejales.redsara.es/consulta/getAlcaldesLegislatura
//
// SCELTA DELIBERATA: NON salviamo il partito. È un dato ufficiale e legittimo,
// ma questo sito vive di neutralità sui soldi pubblici; l'affiliazione politica
// sposterebbe la conversazione altrove e non serve a rispondere alle ricerche,
// che sono sul nome della persona. Se un giorno servirà, è una colonna in più.
//
// Uso:  cd web && node ../data/etl-alcaldes.mjs

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const XLSX = require(join(__dirname, "..", "web", "node_modules", "xlsx"));

const URL_OFICIAL = "https://concejales.redsara.es/consulta/getAlcaldesLegislatura";
const FUENTE = {
  name: "Ministerio de Política Territorial · Cargos Representativos Locales (mandato 2023-2027)",
  url: "https://concejales.redsara.es/consulta",
};
const SALIDA = join(__dirname, "..", "web", "src", "data", "real", "alcaldes-es.json");

const slugify = (n) =>
  n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Il registro scrive i nomi in forma catalogata: articolo in coda
// ("Ejido, El" · "Vall d'Uixó, la") e doppio nome nelle lingue coufficiali
// ("Alacant/Alicante" · "Elx/Elche"). I nostri slug usano la forma corrente.
// Qui generiamo tutte le varianti plausibili così il match non dipende da come
// il ministero ha deciso di scrivere quel nome.
function varianti(nombre) {
  const out = new Set();
  const base = [nombre];
  if (nombre.includes("/")) {
    const [a, b] = nombre.split("/").map((x) => x.trim());
    base.push(a, b);
    out.add(a + " " + b); // "elx-elche"
    out.add(b + " " + a); // "elche-elx"
  }
  for (const b of base) {
    const s = b.trim();
    out.add(s);
    const m = s.match(/^(.+),\s*(el|la|los|las|l'|a|o|els|les|es|sa)$/i);
    if (m) {
      const art = m[2];
      out.add(art.endsWith("'") ? art + m[1] : art + " " + m[1]);
      out.add(m[1]);
    }
  }
  return [...out].map(slugify).filter(Boolean);
}

// Il file mescola MAIUSCOLE e Maiuscole/minuscole. Uniformiamo per la lettura,
// tenendo minuscole le particelle e rispettando trattini e apostrofi.
const MINUSCOLE = new Set(["de", "del", "la", "las", "los", "y", "i", "da", "do", "dos", "das", "van", "von", "der", "el", "lo"]);
function nomePulito(s) {
  const parole = s.toLowerCase().split(/\s+/).filter(Boolean);
  return parole
    .map((p, i) => {
      if (i > 0 && MINUSCOLE.has(p)) return p;
      return p.replace(/(^|[-'’])([a-záéíóúüñç])/g, (_, sep, c) => sep + c.toUpperCase());
    })
    .join(" ");
}

async function main() {
  console.log("[alcaldes] scarico l'elenco ufficiale…");
  const res = await fetch(URL_OFICIAL, { headers: { "User-Agent": "Mozilla/5.0 (CuentasClaras ETL)" } });
  if (!res.ok) throw new Error(`download fallito: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(`[alcaldes] ricevuti ${Math.round(buf.length / 1024)} KB`);

  const wb = XLSX.read(buf, { type: "buffer" });
  const filas = XLSX.utils.sheet_to_json(wb.Sheets["Alcaldes"], { header: 1, raw: false }).slice(6);

  // slug -> record, con le varianti di nome
  const porSlug = new Map();
  for (const f of filas) {
    if (!f || !f[1] || !f[4]) continue;
    const nombre = nomePulito([f[4], f[5], f[6]].filter(Boolean).join(" "));
    const rec = { nombre, desde: f[8] || null, ine: f[0] || null };
    for (const v of varianti(String(f[1]))) if (!porSlug.has(v)) porSlug.set(v, rec);
  }

  // teniamo solo i comuni che il sito copre davvero
  const pop = JSON.parse(fs.readFileSync(join(__dirname, "..", "web", "src", "data", "real", "es-population.json"), "utf8"));
  const salida = {};
  const mancanti = [];
  for (const slug of Object.keys(pop)) {
    const r = porSlug.get(slug);
    if (r) salida[slug] = r;
    else mancanti.push(slug);
  }

  const total = Object.keys(salida).length;
  fs.writeFileSync(SALIDA, JSON.stringify({ fuente: FUENTE, alcaldes: salida }, null, 1) + "\n", "utf8");
  console.log(`[alcaldes] ${total}/${Object.keys(pop).length} comuni agganciati -> ${SALIDA}`);
  if (mancanti.length) console.log(`[alcaldes] senza sindaco (${mancanti.length}): ${mancanti.join(", ")}`);

  // Se il match crolla, qualcosa è cambiato nel file del ministero: meglio
  // accorgersene subito che pubblicare schede senza nome.
  if (total < Object.keys(pop).length * 0.9) {
    console.error("[alcaldes] ERRORE: agganciato meno del 90% dei comuni. Controlla il formato del file ufficiale.");
    process.exit(1);
  }
}

main().catch((e) => { console.error("[alcaldes]", e.message); process.exit(1); });
