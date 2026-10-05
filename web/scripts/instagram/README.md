# Il numero del giorno / El dato del día — kit Instagram

Caroselli verticali (3 slide 1080×1350) con i **dati ufficiali del sito**:

1. **La domanda** — il problema in cui chi scorre si riconosce
2. **Il numero** — la risposta, enorme
3. **Cosa vuol dire** nella vita vera + la **fonte** + dove trovare la tua città

```bash
cd web
node scripts/gen-instagram.mjs                     # tutti i post
node scripts/gen-instagram.mjs es-debito-record    # solo alcuni
```

Escono in `instagram/<id>/` (fuori da git): `1.png` `2.png` `3.png`,
`didascalia.txt` da incollare, `fonte.txt` col link ufficiale, `anteprima.png`.

## Regole

- **I numeri non si scrivono a mano.** Li calcola `fatti.ts` dagli stessi dati
  del sito (`src/lib/data.ts`), con la fonte della singola città. Un fatto senza
  fonte viene scartato.
- **Attenti ai pari merito.** In Italia l'indennità del sindaco la fissa la legge:
  10 città prendono la stessa cifra. `fatti.ts` lo riconosce e lo dice.
- **Niente si pubblica da solo.** Matteo rivede ogni post e lo carica lui.
- Solo dati nostri: niente titoli o foto di giornali altrui (diritti d'autore).
- Nelle slide niente emoji (resvg non le disegna); nella didascalia sì.
- Font: Geist (lo stesso del sito, licenza OFL) in `fonts/`, così gira uguale
  anche su GitHub Actions.

Per aggiungere un formato nuovo: una funzione in `fatti.ts` che restituisce
`{ domanda, numero, sottoNumero, traduzione, fonte, url }`. Il resto è automatico.

Made in Italy 🇮🇹
