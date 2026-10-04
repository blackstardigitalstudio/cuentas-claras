// Collega ogni notizia a una PROVINCIA della mappa, leggendo il titolo.
//
// PERCHÉ: in home tocchi una zona di Spagna o Italia e devi vedere le notizie di
// quel posto. Le notizie arrivano (ogni 2 ore, dal cron) solo con titolo, fonte
// e data: il luogo va riconosciuto nel titolo.
//
// Una notizia di corruzione attribuita al posto SBAGLIATO è peggio di una
// notizia senza posto. Il primo tentativo (04/10/2026) collegava il 38% delle
// notizie ma con errori veri: "Carlos Martínez" finiva su Ávila (Martínez è un
// comune), "Fondi per la masseria" su Latina (Fondi è un comune), "La Guardia
// Civil" su Toledo, "via Potenza" sulla provincia di Potenza. Da lì le regole:
//
// DUE LIVELLI DI FIDUCIA
//   A — si accettano sempre (con la maiuscola e a parola intera):
//       · i nomi delle PROVINCE
//       · le CITTÀ che il sito già segue (≈600, comuni medi e grandi)
//       · i nomi di comune COMPOSTI ("Paracuellos de Jarama", "Sant Boi de
//         Llobregat"): quasi mai coincidono con parole normali
//   B — i comuni con un nome di UNA parola, dagli elenchi ufficiali completi
//       (data/gazetteer), si accettano SOLO se il titolo li usa come luogo:
//         · dopo una preposizione: "en Mieres", "sindaco di Segrate"
//         · oppure in apertura seguiti da virgola o due punti:
//           "Viareggio, quanto guadagnano…" (è come i giornali scrivono il posto)
//       e mai se sono un cognome o una parola comune (PAROLE_COMUNI, COGNOMI).
//
// PROTEZIONI COMUNI A TUTTI
//   - province spagnole solo nei titoli spagnoli, italiane solo negli italiani
//     ("como" in spagnolo non è la provincia di Como);
//   - la prima lettera deve essere MAIUSCOLA ("latina" aggettivo ≠ Latina);
//   - mai dopo via, piazza, corso, calle, avenida…: è il nome di una strada;
//   - un nome di comune presente in DUE province si scarta: non sappiamo quale.
//
// Scrive src/data/news-luoghi.json: { es: { provincia: [notizie] }, it: {...} },
// le più recenti prima. Gira in automatico prima di ogni build ("prebuild").
// Per controllare a occhio: node scripts/luoghi-notizie.mjs --mostra

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATI = path.join(WEB, "src", "data");
const GAZ = path.join(WEB, "..", "data", "gazetteer");
const MAX_PER_PROVINCIA = 8;

// Parole e istituzioni che sono anche nomi di comune. Si allunga quando il
// dottore (o un occhio umano) trova un errore.
const PAROLE_COMUNI = new Set([
  // ES
  "Gobierno", "Hacienda", "Justicia", "Fiscalía", "Ayuntamiento", "Diputación", "Estado", "España",
  "Junta", "Consejo", "Tribunal", "Audiencia", "Congreso", "Senado", "Presidente", "Alcalde",
  "Victoria", "Ciudad", "Puerto", "Castillo", "Fuente", "Villa", "Torre", "Mayor", "Real",
  "La Guardia", "Guardia", "Pleno", "Cuentas", "Sanidad", "Educación", "Empleo",
  // IT
  "Comune", "Regione", "Governo", "Stato", "Corte", "Procura", "Ministero", "Sindaco", "Italia",
  "Castello", "Monte", "Torre", "Ponte", "Porto", "Chiesa", "Piano", "Sanità", "Lavoro", "Scuola",
  "Bilancio", "Mezzogiorno", "Fondi", "Arena", "Ponti", "Monteverde", "Valle", "Isola", "Lago",
  "Bagni", "Castelli", "Fiume", "Terme", "Marina", "Riva",
]);

// Cognomi molto diffusi che sono anche nomi di comune: valgono solo per il
// livello B (una parola sola). Sono quelli che hanno fatto sbagliare.
const COGNOMI = new Set([
  // ES (INE: i più frequenti)
  "García", "Martínez", "López", "Sánchez", "González", "Pérez", "Rodríguez", "Fernández", "Gómez",
  "Torres", "Díaz", "Ruiz", "Hernández", "Jiménez", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso",
  "Gutiérrez", "Navarro", "Domínguez", "Vázquez", "Ramos", "Ramírez", "Serrano", "Blanco",
  "Molina", "Morales", "Suárez", "Ortega", "Delgado", "Castro", "Ortiz", "Rubio", "Marín", "Sanz",
  "Núñez", "Iglesias", "Medina", "Garrido", "Cortés", "Santos", "Lozano", "Guerrero", "Cano",
  "Prieto", "Méndez", "Calvo", "Gallego", "Vidal", "Márquez", "Herrera", "Peña", "Flores",
  "Cabrera", "Campos", "Vega", "Fuentes", "Carrasco", "Caballero", "Reyes", "Nieto", "Aguilar",
  "Pascual", "Santana", "Herrero", "Lorenzo", "Montero", "Hidalgo", "Giménez", "Ibáñez", "Ferrer",
  "Durán", "Santiago", "Benítez", "Vicente", "Vargas", "Arias", "Carmona", "Crespo", "Román",
  "Pastor", "Soto", "Velasco", "Soler", "Parra", "Esteban", "Bravo", "Gallardo", "Rojas", "Pardo",
  "Merino", "Franco", "Espinosa", "Izquierdo", "Rivas", "Silva", "Rivera", "Casado", "Arroyo",
  "Redondo", "Camacho", "Otero", "Luque", "Galán", "Montes", "Sierra", "Segura", "Carrillo",
  "Marcos", "Soriano", "Mendoza", "Gálvez", "Toro", "Mora", "Pinto", "Lara", "Moya", "Rey",
  // IT (i più frequenti)
  "Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino",
  "Greco", "Bruno", "Gallo", "Conti", "Costa", "Giordano", "Mancini", "Rizzo", "Lombardi",
  "Moretti", "Barbieri", "Fontana", "Santoro", "Mariani", "Rinaldi", "Caruso", "Ferrara", "Galli",
  "Martini", "Leone", "Longo", "Gentile", "Martinelli", "Vitale", "Lombardo", "Serra", "Coppola",
  "De Santis", "D'Angelo", "Marchetti", "Parisi", "Villa", "Conte", "Ferraro", "Ferri", "Fabbri",
  "Bianco", "Marini", "Grasso", "Valentini", "Messina", "Sala", "De Luca", "Gatti", "Pellegrini",
  "Palumbo", "Sanna", "Farina", "Rizzi", "Monti", "Cattaneo", "Morelli", "Amato", "Silvestri",
  "Mazza", "Testa", "Grassi", "Pellegrino", "Carbone", "Giuliani", "Benedetti", "Barone", "Rossetti",
  "Caputo", "Montanari", "Guerra", "Palmieri", "Bernardi", "Martino", "Fiore", "Ferretti", "Bellini",
  "Basile", "Riva", "Donati", "Piras", "Vitali", "Battaglia", "Sartori", "Neri", "Falcone",
  "Caltagirone", "Donato",
]);

// Strade: "via Potenza" è una via, non la provincia.
const STRADA = /(?:^|[^\p{L}])(via|viale|piazza|piazzale|corso|largo|vicolo|lungomare|calle|avenida|avda|plaza|paseo|carrer|rúa|ronda|travesía|camino)\s*$/iu;
// Preposizioni che dicono "qui": "en Mieres", "di Segrate", "nel Sorano".
const PREPOSIZIONE = /(?:^|[^\p{L}])(en|a|de|del|desde|hasta|di|da|in|nel|nello|nella|al|ad|tra|fra)\s*$/iu;

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Restituisce la posizione del nome nel titolo se c'è (a parola intera, prima
// lettera maiuscola, non dentro un nome di strada), altrimenti -1.
function posizione(titolo, nome) {
  const re = new RegExp("(^|[^\\p{L}])(" + esc(nome) + ")(?![\\p{L}])", "giu");
  let m;
  while ((m = re.exec(titolo))) {
    const inizio = m.index + m[1].length;
    const prima = m[2][0];
    const maiuscola = prima === prima.toUpperCase() && prima !== prima.toLowerCase();
    if (maiuscola && !STRADA.test(titolo.slice(0, inizio))) return inizio;
  }
  return -1;
}

// Livello B: il titolo usa il nome come LUOGO?
function usatoComeLuogo(titolo, nome, inizio) {
  const prima = titolo.slice(0, inizio);
  if (PREPOSIZIONE.test(prima)) return true;
  // in apertura e seguito da virgola o due punti: "Viareggio, quanto guadagnano…"
  if (inizio === 0) {
    const dopo = titolo.slice(nome.length).trimStart();
    if (/^[,:–—-]/.test(dopo)) return true;
  }
  return false;
}

function caricaGazetteer(file) {
  const { comuni } = JSON.parse(fs.readFileSync(path.join(GAZ, file), "utf8"));
  const idx = new Map();
  for (const [nome, prov] of comuni) {
    if (nome.length < 5 || PAROLE_COMUNI.has(nome)) continue;
    if (!idx.has(nome)) idx.set(nome, new Set());
    idx.get(nome).add(prov);
  }
  const unici = [];
  for (const [nome, provs] of idx) if (provs.size === 1) unici.push([nome, [...provs][0]]);
  return unici;
}

const normP = (x) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
function canonico(fileProv) {
  const idx = new Map();
  for (const f of JSON.parse(fs.readFileSync(path.join(DATI, fileProv), "utf8")).features)
    for (const parte of [f.properties.name, ...f.properties.name.split("/")]) idx.set(normP(parte), f.properties.name);
  return (p) => idx.get(normP(p)) || idx.get(normP(p.split("/")[0])) || null;
}

function cittaSeguite(lang) {
  const file = lang === "es" ? ["extra-cities.json", "gobierto-cities.json"] : ["it-extra-cities.json"];
  const out = [];
  for (const f of file) {
    const p = path.join(DATI, "real", f);
    if (!fs.existsSync(p)) continue;
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    const prov = canonico(lang === "es" ? "spain-provinces.json" : "italy-provinces.json");
    for (const c of Array.isArray(j) ? j : Object.values(j)) {
      if (!c || !c.name || !c.provincia) continue;
      const p = prov(c.provincia);
      if (!p) continue; // provincia che non sta sulla mappa: meglio scartare che indovinare
      for (const nome of c.name.split("/")) if (nome.trim().length >= 4) out.push([nome.trim(), p]);
    }
  }
  return out;
}

function provinceMappa(file) {
  const nomi = JSON.parse(fs.readFileSync(path.join(DATI, file), "utf8")).features.map((f) => f.properties.name);
  const voci = [];
  for (const n of nomi) for (const parte of n.split("/")) if (parte.length >= 4 && !PAROLE_COMUNI.has(parte)) voci.push([parte, n]);
  return voci;
}

function prepara(lang, fileProv, fileGaz) {
  const province = provinceMappa(fileProv);
  const seguite = cittaSeguite(lang);
  const nomiA = new Set([...province, ...seguite].map(([n]) => n));
  const gaz = caricaGazetteer(fileGaz).filter(([n]) => !nomiA.has(n));
  const composti = gaz.filter(([n]) => /\s/.test(n));
  const singoli = gaz.filter(([n]) => !/\s/.test(n) && !COGNOMI.has(n));
  // livello A: i nomi più lunghi prima, così "San Sebastián de los Reyes"
  // viene trovato prima di "San Sebastián"
  const A = [...province, ...seguite, ...composti].sort((a, b) => b[0].length - a[0].length);
  return { A, B: singoli };
}

const LINGUE = {
  es: prepara("es", "spain-provinces.json", "municipios-es.json"),
  it: prepara("it", "italy-provinces.json", "comuni-it.json"),
};

function luoghi(titolo, lang) {
  const { A, B } = LINGUE[lang];
  const trovate = new Set();
  let resto = titolo;
  for (const [nome, prov] of A) {
    const i = posizione(resto, nome);
    if (i >= 0) {
      trovate.add(prov);
      resto = resto.slice(0, i) + " ".repeat(nome.length) + resto.slice(i + nome.length);
    }
  }
  for (const [nome, prov] of B) {
    const i = posizione(resto, nome);
    if (i >= 0 && usatoComeLuogo(resto, nome, i)) trovate.add(prov);
  }
  return [...trovate];
}

const news = JSON.parse(fs.readFileSync(path.join(DATI, "news.json"), "utf8"));
const out = { generato: new Date().toISOString(), es: {}, it: {} };
const visti = new Set();
let totale = 0, collegate = 0;

for (const [chiave, lista] of Object.entries(news)) {
  if (!Array.isArray(lista)) continue;
  const lang = chiave.startsWith("it") ? "it" : "es";
  const tema = chiave.includes("_") ? chiave.split("_")[1] : null;
  for (const n of lista) {
    const id = n.url || n.title;
    if (visti.has(id)) continue; // la stessa notizia può stare in più temi
    visti.add(id);
    totale++;
    const provs = luoghi(n.title, lang);
    if (!provs.length) continue;
    collegate++;
    for (const p of provs) (out[lang][p] ||= []).push({ t: n.title, s: n.source, u: n.url, d: n.date, k: tema });
  }
}

for (const lang of ["es", "it"])
  for (const p of Object.keys(out[lang]))
    out[lang][p] = out[lang][p].sort((a, b) => String(b.d || "").localeCompare(String(a.d || ""))).slice(0, MAX_PER_PROVINCIA);

fs.writeFileSync(path.join(DATI, "news-luoghi.json"), JSON.stringify(out) + "\n", "utf8");
const nP = (l) => Object.keys(out[l]).length;
console.log(`[luoghi-notizie] ${collegate}/${totale} notizie collegate a un luogo · province con notizie: ES ${nP("es")} · IT ${nP("it")}`);

if (process.argv.includes("--mostra")) {
  for (const lang of ["es", "it"]) for (const [p, l] of Object.entries(out[lang])) for (const n of l) console.log(`  ${lang} · ${p.padEnd(22)} ⟵ ${n.t.slice(0, 95)}`);
}
