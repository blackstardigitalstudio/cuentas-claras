// ETL — elenco ufficiale di TUTTI i comuni di Spagna e Italia, con la loro
// provincia scritta ESATTAMENTE come sulla mappa del sito.
//
// PERCHÉ: la mappa in home deve mostrare, quando tocchi una zona, le notizie di
// quel posto. Le notizie però non hanno un luogo: hanno solo il titolo. Per
// capire dove sono serve riconoscere nel titolo il nome di un comune e sapere in
// che provincia sta. Con le sole città del sito (≈600) si collegava il 26% delle
// notizie e solo 40 province su 162 ne avevano almeno una.
//
// FONTI UFFICIALI:
//   Spagna — Ministerio de Política Territorial, registro dei sindaci della
//            legislatura (8.131 comuni, con la provincia):
//            https://concejales.redsara.es/consulta/getAlcaldesLegislatura
//   Italia — ISTAT, Elenco dei comuni italiani:
//            https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv
//
// Il nome della provincia di queste fonti NON coincide sempre con quello della
// mappa (che per l'Italia è del 2013: prima delle città metropolitane e della
// riforma sarda). Qui c'è il raccordo. I comuni la cui provincia non si riesce
// ad agganciare vengono SCARTATI e contati, mai assegnati a caso.
//
// Uso:  cd web && node ../data/etl-gazetteer.mjs   (si rifà una volta l'anno)

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const XLSX = require(join(__dirname, "..", "web", "node_modules", "xlsx"));
const OUT = join(__dirname, "gazetteer");
const WEB = join(__dirname, "..", "web");

const FONTE_ES = "https://concejales.redsara.es/consulta/getAlcaldesLegislatura";
const FONTE_IT = "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";

// Normalizzazione per confrontare i nomi: minuscole, niente accenti, niente
// apostrofi, trattini o spazi, e via le paroline che cambiano da una fonte
// all'altra ("Reggio di Calabria" = "Reggio Calabria").
const PAROLINE = /\b(di|de|del|della|nell|e|y|la|las|el|lo|il|a)\b/g;
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, " ").replace(/[-_]/g, " ").replace(PAROLINE, " ")
    .replace(/[^a-z]/g, "");

function indiceMappa(file) {
  const nomi = JSON.parse(fs.readFileSync(join(WEB, "src", "data", file), "utf8")).features.map((f) => f.properties.name);
  const idx = new Map();
  for (const n of nomi) for (const parte of n.split("/")) idx.set(norm(parte), n);
  return { nomi, idx };
}

// "Coruña, A" -> "A Coruña" · "Rioja, La" -> "La Rioja" · "Balears, Illes" -> "Illes Balears"
const raddrizza = (s) => {
  const m = s.trim().match(/^(.+),\s*(a|o|la|las|el|los|illes|les)$/i);
  return m ? `${m[2]} ${m[1]}` : s.trim();
};

function provinciaSulMappa(nomeFonte, mappa, extra = {}) {
  if (extra[nomeFonte]) return extra[nomeFonte];
  const pulito = nomeFonte
    .replace(/^Città metropolitana di\s+/i, "")
    .replace(/^Libero consorzio comunale di\s+/i, "")
    .replace(/^Provincia (autonoma )?di\s+/i, "");
  for (const parte of raddrizza(pulito).split("/")) {
    const hit = mappa.idx.get(norm(raddrizza(parte)));
    if (hit) return hit;
  }
  return null;
}

async function scarica(url, file) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (CuentasClaras ETL)" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(join(OUT, file), buf);
  return buf;
}

// --------------------------------------------------------------- SPAGNA
async function spagna() {
  const file = join(OUT, "_alcaldes.xlsx");
  const buf = fs.existsSync(file) ? fs.readFileSync(file) : await scarica(FONTE_ES, "_alcaldes.xlsx");
  const righe = XLSX.utils.sheet_to_json(XLSX.read(buf, { type: "buffer" }).Sheets["Alcaldes"], { header: 1, raw: false }).slice(6);
  const mappa = indiceMappa("spain-provinces.json");
  const out = [], senza = new Map();
  for (const r of righe) {
    if (!r || !r[1] || !r[2]) continue;
    const prov = provinciaSulMappa(String(r[2]), mappa);
    if (!prov) { senza.set(r[2], (senza.get(r[2]) || 0) + 1); continue; }
    // anche qui il registro scrive "Vall d'Uixó, la": lo raddrizziamo
    for (const nome of String(r[1]).split("/")) out.push([raddrizza(nome), prov]);
  }
  return { out, senza, totale: righe.filter((r) => r && r[1]).length };
}

// --------------------------------------------------------------- ITALIA
// La mappa è del 2013. La Sardegna è stata riorganizzata più volte: le province
// di oggi si riportano a quelle disegnate sulla mappa.
const SARDEGNA = {
  "Sulcis Iglesiente": "Carbonia-Iglesias",
  "Gallura Nord-Est Sardegna": "Olbia-Tempio",
  "Medio Campidano": "Medio Campidano",
  "Ogliastra": "Ogliastra",
  "Città metropolitana di Cagliari": "Cagliari",
};

function csvRighe(testo) {
  // CSV ISTAT: separatore ";", campi tra virgolette che possono andare a capo.
  const righe = []; let campo = "", riga = [], dentro = false;
  for (let i = 0; i < testo.length; i++) {
    const c = testo[i];
    if (dentro) {
      if (c === '"' && testo[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') dentro = false;
      else campo += c;
    } else if (c === '"') dentro = true;
    else if (c === ";") { riga.push(campo); campo = ""; }
    else if (c === "\n") { riga.push(campo.replace(/\r$/, "")); righe.push(riga); riga = []; campo = ""; }
    else campo += c;
  }
  if (campo || riga.length) { riga.push(campo); righe.push(riga); }
  return righe;
}

async function italia() {
  const file = join(OUT, "_comuni.csv");
  const buf = fs.existsSync(file) ? fs.readFileSync(file) : await scarica(FONTE_IT, "_comuni.csv");
  const testo = new TextDecoder("latin1").decode(buf); // ISTAT pubblica in latin1
  const [testa, ...dati] = csvRighe(testo);
  const col = (re) => testa.findIndex((h) => re.test(h.replace(/\s+/g, " ")));
  const iNome = col(/^Denominazione in italiano$/i);
  const iUts = col(/^Denominazione dell'Unità territoriale sovracomunale/i);
  if (iNome < 0 || iUts < 0) throw new Error("colonne ISTAT non trovate: il formato è cambiato");
  const mappa = indiceMappa("italy-provinces.json");
  const out = [], senza = new Map();
  for (const r of dati) {
    if (!r[iNome]) continue;
    const prov = provinciaSulMappa(r[iUts], mappa, SARDEGNA);
    if (!prov) { senza.set(r[iUts], (senza.get(r[iUts]) || 0) + 1); continue; }
    out.push([r[iNome].trim(), prov]);
  }
  return { out, senza, totale: dati.filter((r) => r[iNome]).length };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [paese, fn, file, fonte] of [["Spagna", spagna, "municipios-es.json", FONTE_ES], ["Italia", italia, "comuni-it.json", FONTE_IT]]) {
    const { out, senza, totale } = await fn();
    fs.writeFileSync(join(OUT, file), JSON.stringify({ fonte, generato: new Date().toISOString().slice(0, 10), comuni: out }) + "\n", "utf8");
    console.log(`[gazetteer] ${paese}: ${out.length} nomi agganciati su ${totale} comuni -> ${file}`);
    if (senza.size) console.log(`            scartati (provincia non sulla mappa): ${[...senza].map(([p, n]) => `${p} (${n})`).join(", ")}`);
  }
  // i file grezzi scaricati non servono più
  for (const f of ["_alcaldes.xlsx", "_comuni.csv"]) fs.rmSync(join(OUT, f), { force: true });
}

main().catch((e) => { console.error("[gazetteer]", e.message); process.exit(1); });
