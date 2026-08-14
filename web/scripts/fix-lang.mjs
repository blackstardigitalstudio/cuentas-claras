// Corregge l'attributo lang dell'HTML statico dopo l'export.
//
// PERCHÉ SERVE: il layout radice di App Router è uno solo, quindi ogni pagina
// esce con <html lang="es"> — anche quelle italiane. Google legge l'HTML
// statico, e gli screen reader pure: una pagina italiana che si dichiara
// spagnola è sbagliata. L'alternativa "pulita" (due root layout con route
// group) vorrebbe dire spostare centinaia di cartelle e rischiare gli URL già
// indicizzati. Questo passaggio ottiene lo stesso risultato senza toccarli.
//
// COME CAPISCE LA LINGUA: legge og:locale, che ogni pagina italiana dichiara da
// sé nei propri metadata. Nessuna lista di percorsi da tenere aggiornata a mano:
// se domani nasce una pagina italiana, basta che abbia locale: "it_IT" e questo
// script la sistema da solo.
//
// Gira in automatico dopo `npm run build` (script "postbuild" in package.json).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");

if (!fs.existsSync(OUT)) {
  console.log("[fix-lang] cartella out/ assente: salto (build non esportata).");
  process.exit(0);
}

let visitate = 0;
let corrette = 0;
let giaCorrette = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "_next") walk(p);
      continue;
    }
    if (!e.name.endsWith(".html")) continue;
    visitate++;

    const html = fs.readFileSync(p, "utf8");
    if (!/og:locale"\s+content="it_IT"/.test(html)) continue;

    if (/<html\s+lang="it"/.test(html)) { giaCorrette++; continue; }

    const fixed = html.replace(/<html(\s+)lang="es"/, `<html$1lang="it"`);
    if (fixed === html) continue;

    fs.writeFileSync(p, fixed, "utf8");
    corrette++;
  }
}

walk(OUT);

console.log(`[fix-lang] ${visitate} pagine lette · ${corrette} passate a lang="it"` + (giaCorrette ? ` · ${giaCorrette} già a posto` : ""));

// Rete di sicurezza: se non ha corretto NIENTE vuol dire che qualcosa è
// cambiato (il marcatore og:locale, o il tag <html>) e il difetto sta
// tornando dentro senza che nessuno se ne accorga. Meglio far fallire il
// build che pubblicare 400 pagine italiane dichiarate spagnole.
if (corrette + giaCorrette === 0) {
  console.error('[fix-lang] ERRORE: nessuna pagina italiana trovata. Controlla che le pagine IT dichiarino openGraph.locale = "it_IT".');
  process.exit(1);
}
