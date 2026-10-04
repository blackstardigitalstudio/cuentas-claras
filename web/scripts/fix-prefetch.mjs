// Rimette a posto i file di PRE-CARICAMENTO di Next dopo l'export.
//
// PERCHÉ SERVE: quando passi col mouse (o col dito) su un link, Next scarica in
// anticipo un pezzetto della pagina di destinazione, così il clic la apre
// all'istante. Quel pezzetto è un file tipo:
//     /ranking/__next.ranking.__PAGE__.txt
//
// Da Next 16.3.3 in poi — la versione che chiude due falle di sicurezza critiche
// (GHSA-2xp9-vwfh-vxw4, GHSA-p293-qw3h-jr36) — l'export scrive quel file in una
// CARTELLA:
//     /ranking/__next.ranking/__PAGE__.txt
// ma il codice del browser continua a chiederlo col nome PIATTO. Su un hosting
// statico come Cloudflare nessuno traduce l'uno nell'altro: risultato, 404 su
// ogni pre-caricamento. La pagina funziona lo stesso (si apre al clic, solo
// senza l'apertura istantanea), ma si riempiono i log di errori e si perde la
// velocità.
//
// COSA FA: per ogni file annidato crea anche la copia col nome piatto. Copia,
// non sposta: se una versione futura di Next tornerà a chiedere quello annidato,
// c'è ancora. Scoperto il 04/10/2026 provando la mappa nel browser dopo
// l'aggiornamento.
//
// Gira in automatico dopo `npm run build` (script "postbuild").

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");

if (!fs.existsSync(OUT)) {
  console.log("[fix-prefetch] cartella out/ assente: salto.");
  process.exit(0);
}

let annidati = 0;
let creati = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Una cartella "__next.<segmento>" è l'inizio di un percorso annidato:
      // la sua cartella madre è quella della pagina.
      if (e.name.startsWith("__next.")) {
        appiattisci(dir, p, e.name);
      } else if (e.name !== "_next") {
        walk(p);
      }
    }
  }
}

// Cerca i __PAGE__.txt sotto "__next.<seg>/..." e crea "__next.<seg>.<...>.__PAGE__.txt"
// accanto, nella cartella della pagina.
function appiattisci(cartellaPagina, radice, nomeRadice) {
  const stack = [[radice, nomeRadice]];
  while (stack.length) {
    const [dir, prefisso] = stack.pop();
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        stack.push([p, prefisso + "." + e.name]);
      } else if (e.name === "__PAGE__.txt") {
        annidati++;
        const piatto = path.join(cartellaPagina, prefisso + ".__PAGE__.txt");
        if (!fs.existsSync(piatto)) {
          fs.copyFileSync(p, piatto);
          creati++;
        }
      }
    }
  }
}

walk(OUT);

console.log(`[fix-prefetch] ${annidati} pre-caricamenti annidati · ${creati} copie col nome piatto create`);

// Se Next tornasse a scrivere i file piatti, non ce ne sarebbero di annidati:
// è un buon segno, non un errore. Lo diciamo e basta.
if (annidati === 0) {
  console.log("[fix-prefetch] nessun file annidato: questa versione di Next scrive già i nomi piatti, il passaggio non serve più.");
}
