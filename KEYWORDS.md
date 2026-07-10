# Ricerca keyword & piano contenuti · Cuentas Claras

> Fonte: Google Autocomplete (segnale reale di domanda), lug 2026. Gratis.
> I tool pro (Ahrefs/Similarweb/Semrush) richiedono che il cliente autorizzi i
> connettori in una sessione interattiva.

## Domanda reale rilevata (alta ricerca)

**🇪🇸 Spagna — template per città (volume alto):**
- `presupuesto ayuntamiento de {ciudad}` ✅ *(già coperto dalle nostre pagine città)*
- `sueldo alcalde de {ciudad}` ⭐ *(altissima domanda — NON abbiamo il dato)*
- `deuda ayuntamiento de {ciudad}` ⭐ *(alta domanda — NON abbiamo il dato)*
- `subvenciones ayuntamiento de {ciudad}`
- Head: `en qué se gasta el dinero público en España`, `gasto público en educación por comunidades autónomas`, `cuánto cobra un concejal`
- Nota: **Canarie** (Las Palmas, Arrecife, Santa Cruz) escono in cima → interesse forte.

**🇮🇹 Italia — template per città:**
- `bilancio comune di {città}` ✅ *(coperto per Milano/Bologna)*
- `stipendio sindaco di {città}` ⭐ *(altissima domanda — NON abbiamo il dato)*
- `debito comune di {città}` ⭐ *(alta domanda — NON abbiamo il dato)*
- `appalti comune di {città}`
- Head: `dove vanno i soldi pubblici`, `quanto guadagna un consigliere comunale`

## Mappa opportunità (priorità)

1. **⭐ Stipendio sindaco / sueldo alcalde** — domanda enorme, dato ufficiale e verificabile
   (portali trasparenza). Da aggiungere per città → traffico grosso, integrity-safe.
2. **⭐ Debito comunale / deuda** — dato ufficiale (Banca d'Italia / Banco de España, MEF).
3. **Coda lunga per città**: una FAQ per città che risponde alle domande esatte che la gente
   cerca ("cuánto gana el alcalde de X", "cuánto debe el ayuntamiento de X", "en qué gasta X").
4. **Head pages**: rafforzare "en qué se gasta el dinero público en España" / "dove vanno i
   soldi pubblici in Italia" (già abbiamo home + /italia; aggiungere una pagina-guida).

## Da decidere col cliente
- **Sezione "notizie mondo / bufale / panico"**: da fare come **fact-check / smonta-bufale**
  sui soldi pubblici (allineato all'identità "dati veri"), NON come clickbait di panico.
- **Espansione mappa a tutto il mondo**: base già pronta (backdrop mondo); si aggiungono
  paesi con dati verificati, uno alla volta.

## Fonti dati verificate (integrate)
- **Deuda viva ES** — Ministerio de Hacienda, "Deuda viva de las EELL" (XLSX, 8.135 comuni, 31/12/2024). Miles de €.
- **Sueldo alcaldes ES** — MTDFP · ISPA (retribuciones alcaldes, ejercicio 2024, XLSX ~6.900 comuni). €/año, con régimen de dedicación.
- **Indennità sindaco IT** — calcolata per legge (L. 234/2021 + DM Interno 30/05/2022): % del parametro €13.800/mese per fascia di popolazione. Metropolitano=100%, capoluogo regione=80%, ecc.
- **Debito IT per comune** — BDAP/OpenBDAP (RGS-MEF): da fare via ETL (nessun file bulk pulito).
- Verifica incrociata 7/7 valori chiave CONFERMATA (Jaén 4ª più indebitata; Vigo/Cáceres deuda≈0; Madrid €110.688; Barcelona €104.000; Valladolid €14.076 "sin dedicación"; Las Palmas −91%).

## Avanzamento (un pezzo alla volta)
- [x] Ricerca keyword iniziale (autocomplete ES/IT)
- [x] Sorgente dati "sueldo alcalde/stipendio sindaco" verificata → 52 città (50 ES ISPA + Milano/Bologna IT per legge)
- [x] Sorgente dati "deuda" ES (Hacienda) → 50 città + card debito nel pannello e nelle schede città
- [x] FAQ città potenziata: "¿Cuánto cobra el alcalde de X?" / "¿Cuánta deuda tiene X?" / "Quanto guadagna il sindaco di X?" (con FAQPage schema)
- [x] Pagine-classifica nazionali (head-term): `/sueldos-alcaldes` (chi guadagna di più) e `/deuda-municipios` (più indebitati; 63% senza debito) — usano TUTTO il dataset ufficiale
- [x] Più città ES (2º livello): 15 grandi comuni NON capoluogo (Móstoles, L'Hospitalet, Jerez, Marbella, Cartagena, Terrassa, Sabadell, Badalona, Elche…) con bilancio Gobierto + debito/stipendio ufficiali. INE preso dal file Hacienda (esatto), validazione entrate≈uscite. Agganciate per slug (schede + ranking + sitemap), non sulla mappa-province.
- [x] Debito comuni IT: Milano (€3,36 mld) + Bologna (€79,1 mln) da Rendiconto 2024 ufficiale → card complete
- [x] Sezione fact-check / smonta-bufale `/bulos`: 11 bufale reali (ES+IT) già verificate da fact-checker seri (Maldita, Newtral, Pagella Politica, AGI), con dato reale + link alla verifica originale + FAQPage schema. Taglio neutro, non partisan.
- [x] Mappa "mondo": backdrop mondo + seconda zona (l'altro paese) colorata attenuata → si vedono entrambe le zone attive; inquadratura stretta sul paese attivo.
- [x] Altre città ES (3º lotto): +39 grandi città (Santiago de Compostela, Algeciras, Torrevieja, Mataró, Reus, Mérida, Benidorm, Fuengirola, Sant Cugat, Torrent, Gandia…) → 106 città reali. Build stabile con `workerThreads:false`.
- [x] Altre città ES (4º lotto): +47 città (Talavera, Ponferrada, Avilés, Irún, Alcoy, Elda, Linares, Motril, Vic, Tortosa, Alzira, Aranjuez, Calvià, Arona, Antequera…) → 153 città reali. ETL legge la lista da `extra-cities-list.json`.
- [x] Altre città ES (5º lotto): +75 città → 228 città reali. (Chi non dichiara stipendio all'ISPA mostra solo il debito — integrità.)
- [x] Altre città ES (6º lotto): +89 città medie (Pinto, Valdemoro, Manises, Cullera, Igualada, Sitges, Martorell, Candelaria, Lalín, Ribeira, Onda, Roses, Balaguer, Carmona…) → **317 città reali** totali. Soglia bilancio ≥20M filtra da sé i comuni troppo piccoli. Matcher esteso agli articoli galiziani (A/O).
- [x] Comuni IT (bilanci): +28 città dai dati di cassa **SIOPE 2025** (RGS-MEF) → Roma (€6,6 mld), Genova, Venezia, Palermo, Catania, Bari, Verona, Padova, Messina, Modena, Parma… → **30 città IT** (con Milano/Bologna). Stipendio sindaco calcolato per legge (RSO); omesso per statuto speciale. Fix integrità: la città reale vince sul campione provinciale con lo stesso slug.
- [ ] Completare i comuni IT mancanti (Torino, Napoli, Firenze, Milano-area…): saltati per instabilità endpoint SIOPE su quelle regioni; da ri-scaricare quando il server è stabile.
- [ ] Debito comuni IT oltre Milano/Bologna (SIOPE non ha il debito; serve BDAP)

_Made in Italy_ 🇮🇹
