---
name: dottore-cuentas
description: >
  Il CHECK-UP di Cuentas Claras dalla A alla Z: pagine che rispondono, formula SEO (titolo,
  FAQ, citazione della fonte, lingua), fonti ufficiali ancora vive, LEGGIBILITÀ misurata
  (Gulpease per l'italiano, INFLESZ per lo spagnolo: si capisce con la licenza media?),
  parole da burocrate o da AI, dati freschi — più la lettura di Search Console per capire
  cosa funziona, cosa no e quali domande la gente fa a cui non rispondiamo. Finisce con un
  VERDETTO ordinato per gravità e cura da solo ciò che è sicuro. Usala quando l'utente dice
  "doctor", "check up", "controlla il sito", "come va Cuentas Claras", "si capisce?",
  "cosa funziona?", "nuove opportunità", prima e dopo una pubblicazione, e quando gira il
  controllo programmato. Made in Italy.
---

# dottore-cuentas — il check-up dalla A alla Z

Una visita sola, in quest'ordine. **Prima misura, poi verifica, solo dopo cura.**

## 1 · Le misure (lo script, zero token di analisi)

```bash
python tools/doctor-cuentas/dottore_cuentas.py            # visita completa (~2 minuti)
python tools/doctor-cuentas/dottore_cuentas.py --veloce   # senza controllare le fonti
```

Visita il sito **online** — quello che vedono la gente e Google — non la build locale.
Tutte le pagine a tema più un campione dei modelli (schede città, confronti, fasce, club:
se un modello è rotto, lo sono tutte le sue pagine).

| | Cosa controlla | Perché |
|---|---|---|
| A | La pagina risponde | Una pagina sparita perde tutto quello che aveva guadagnato |
| B | Titolo ≤ 58 caratteri · FAQ · citazione della fonte · `lang` giusto · Made in Italy · niente `.html` | È la formula che porta clic e citazioni |
| C | Le fonti ufficiali di `src/lib/jsonld.ts` sono vive | Un link morto smentisce il dato che sostiene |
| D | **Leggibilità**: Gulpease (IT) e INFLESZ (ES) | Il lettore ha la licenza media e 10 secondi |
| E | Parole da AI (*inoltre*, *además*, *scopri come*) e da ufficio | Regola d'oro 14, «humanizer» |
| F | Nomi dei sindaci e notizie non troppo vecchi | |

La doctor globale lo lancia da sola dentro questa cartella (`/doctor`).

### Le soglie di leggibilità (fonti ufficiali, non opinioni)

- **Italiano — indice Gulpease** (Lucisano e Piemontese, Univ. La Sapienza, 1988):
  `89 + (300·frasi − 10·lettere) / parole`. **Sotto 60 è difficile per chi ha la licenza media.**
- **Spagnolo — scala INFLESZ** (Barrio Cantalejo, validata in Spagna sui testi per i pazienti):
  `206,835 − 62,3·(sillabe/parole) − (parole/frasi)`.
  <40 muy difícil · 40-55 algo difícil · **55-65 normal** · 65-80 bastante fácil · >80 muy fácil.

Obiettivo: **Gulpease ≥ 60, INFLESZ ≥ 55** su ogni pagina. Lo script scrive i punteggi in
`tools/doctor-cuentas/ultima-leggibilita.json`, così si confrontano col giro precedente.

## 2 · Verifica PRIMA di curare (non saltarlo mai)

Al primo giro, ottobre 2026, lo script ha dato **tre falsi allarmi**:
- UEFA «fonte morta» → era il sito che rifiuta i programmi; dal browser si apriva.
- La home «algo difícil» → contava il menu a tendina con 724 città come una frase sola.
- Le pagine per fascia «senza hreflang» → sono leggi diverse in IT e ES, non traduzioni.

Ogni segnalazione **grave** si controlla a mano (curl, browser, aprire la pagina) prima di
toccare il codice. Se il falso allarme viene dallo script, **si corregge lo script**, così
non torna. E si annota qui sotto.

La stessa regola vale per i titoli: il controllo «numero + punto interrogativo» bocciava
la pagina migliore del sito (`/premi-europei/`, CTR 15,9%). **Prima di cambiare un titolo
si guarda in Search Console come sta andando quella pagina.** Se converte, non si tocca.

## 3 · Search Console: cosa funziona, cosa no, cosa manca

Property `https://www.cuentas-clara.com/`, account `stellinoxx@gmail.com`, dal browser.
Finestra **28 giorni**, righe portate a **250**.

1. **I numeri di testa** contro il giro prima: clic, impressioni, CTR, posizione media.
   Lo storico sta nelle memorie del progetto (`gsc-checkup-*`).
2. **Pagine**: quale cresce più delle altre? Capire *perché* (titolo? tema? lingua?) e
   replicarlo dove manca. È così che si è scoperto che l'Italia converte 2,5× la Spagna.
3. **Paesi**: Spagna contro Italia, in clic **e** CTR.
4. **I buchi — le opportunità vere.** Query con **0 clic e impressioni alte**: Google ci
   considera già pertinenti, ma non diamo la risposta. Valgono più di qualsiasi ricerca di
   parole chiave a freddo. Raggrupparle per tema e chiedersi: *il dato ce l'abbiamo già?*
   (agosto 2026: il debito del Real Madrid era già in `CLUB_DEBT` e non lo usavamo).
   Scartare quelle fuori tema (es. «presupuesto rehabilitación» = ristrutturazioni, non
   soldi pubblici).

La lista aperta dei buchi sta nella memoria `buchi-domande-scoperte`: aggiornarla.

## 4 · Cura, in ordine di gravità

1. **Grave** — pagine rotte, fonti morte, `lang` sbagliato, citazione autorevole su una
   pagina di stime. Si cura subito.
2. **Da curare** — testi difficili, FAQ mancanti, titoli lunghi, Made in Italy assente.
3. **Note** — si leggono, non sempre si agisce (le parole d'ufficio vanno bene se sono il
   termine che la gente cerca e sono spiegate subito dopo: *deuda viva*, *indennità*).

**Si cura da soli** ciò che è sicuro e reversibile: testi, FAQ, fonti, piedi di pagina.
**Si propone e basta** ciò che cambia la strategia: titoli di pagine che convertono, pagine
nuove su temi nuovi, togliere pagine.

Ogni pagina nuova rispetta le **due regole che non si toccano** di `web/AGENTS.md`:
solo dati veri con la fonte, e si scrive da umani.

### Come si riscrive un testo difficile

Dalla pagina col punteggio più basso. Frasi corte (una idea per frase), prima la scena e poi
il numero, numeri tradotti («6,4% del PIL» → «più di quanto produce il Paese in un anno»),
via le parole da ufficio e da AI. Poi si **rimisura**: se il punteggio non sale, non è
migliorato.

## 5 · Pubblicare e chiudere

Branch → PR → merge → `gh workflow run deploy.yml --ref main` (vedi `web/AGENTS.md` §5).
Dopo il deploy si **rilancia lo script** sul sito online: il verdetto deve migliorare.
Poi pulizia (regola 13): `web/out`, `web/.next`, `web/node_modules` si cancellano, si
ricreano con un comando. Si chiudono le schede del browser aperte.

## 6 · Il resoconto per Matteo

In italiano, corto, da umani: cosa funziona (con i numeri), cosa no, cosa ho curato, cosa
propongo e perché. **Mai un elenco di numeri senza un verdetto.**

## Registro dei falsi allarmi

| Data | Segnalazione | Era | Corretto nello script |
|---|---|---|---|
| 2026-10-04 | UEFA fonte morta | blocco anti-robot | ✅ morta solo con 404/410 |
| 2026-10-04 | Home INFLESZ 44 | menu con 724 città contato come frase | ✅ tolti select/option ed elenchi di nomi |
| 2026-10-04 | Fasce senza hreflang | leggi diverse IT/ES, non traduzioni | ✅ escluse |

Made in Italy 🇮🇹
