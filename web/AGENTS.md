<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Cuentas Claras — convenzioni di progetto (LEGGI PRIMA DI LAVORARE)

Sito bilingue (ES/IT) che mostra i **soldi pubblici reali** dei comuni di Spagna e
Italia (entrate/spese/debito/stipendi sindaci) + una sezione **calcio-finanza**.
Next.js 16 App Router, **static export** (`output: "export"`, `trailingSlash: true`),
Tailwind v4, TypeScript. Hosting: Cloudflare Pages via GitHub Actions.

## 0. Regola d'oro: SOLO dati veri e ufficiali (non negoziabile)
- Pubblica **solo dati ufficiali e verificabili**. Cita sempre la fonte (link).
- **Mai inventare numeri.** Se un dato non è verificabile, NON si pubblica.
- Bilanci comunali: **entrate ≈ spese**; se i dati non quadrano o sono sospetti, si scartano.
- Città "di esempio" (`isSample`): `noindex` + **fuori dal sitemap**.
- **Calcio — attenzione:** i **stipendi dei singoli giocatori NON sono ufficiali**
  (solo stime di stampa). Non presentarli mai come fatto. Se si citano, vanno
  etichettati come «estimación / stima (no oficial)» **con attribuzione alla fonte**.
  Sono invece verificabili e OK: **traspasi/fichajes** (annunciati dai club),
  **clausole di rescissione**, durata contratto, e i **limiti salariali di club**
  (LaLiga LCPD, ufficiali e aggregati, non per-giocatore).

## 1. Architettura bilingue (pattern obbligatorio per ogni pagina)
- `page.tsx` = **server component**: esporta `metadata` + inietta JSON-LD; renderizza un
  client `*Client.tsx`.
- `*Client.tsx` = **client component**: `"use client"`, avvolto in `<LocaleProvider>`,
  usa `useLocale()`.
- Helper di traduzione **ES-FIRST**: `const t = (es: string, itx: string) => (it ? itx : es);`
  dove `const it = locale === "it";`. **Lo spagnolo è sempre il primo argomento.**
- `LocaleProvider`: default ES; legge `localStorage 'cc-locale'` poi `navigator.language`;
  imposta `document.documentElement.lang`. Layout ha `<html lang="es">` e title template
  `%s · Cuentas Claras` (NON aggiungere il suffisso "· Cuentas Claras" nei title delle pagine:
  lo aggiunge il template → altrimenti esce doppio).
- Ordine "Italia-first" per utenti IT dove serve: classe `.country-flip`
  (`html[lang="it"] .country-flip .country-it{order:-1}`).

## 2. Componenti condivisi (riusare, non reinventare)
- `HeroBanner` — foto + gradiente + titolo neon + stat. Props: `src, alt, kicker, title,
  highlight, stat, statLabel, accent, accent2, as, priority`. Usa `priority` sulle pagine chiave.
- `SimpleExplainer` — il box di **Claro** ("En cristiano" / "In parole semplici"), metodo
  Feynman. Props: `title, by, children, more, moreLabel`.
- `ShareBar` — barra di condivisione (X/WhatsApp/Facebook/Telegram/nativa/copia) con messaggio
  pre-riempito. Legge la lingua da `lang` prop o `<html lang>`. L'URL si risolve in `useEffect`
  (così punta alla pagina concreta e non alla home, e niente hydration mismatch).
- `ShareHighlight` — **condivisione a evidenziazione** (montata globale nel layout): l'utente
  seleziona una frase → barra flottante per postarla. Obiettivo: backlink automatici.
- `MascotGuide` + `Mascot` — la mascotte **Claro** (compagno flottante + aiuto contestuale).
  In `MascotGuide` l'helper è **IT-first**: `const T = (itx, es) => (it ? itx : es)` (opposto a `t`!).
- Marcatori DOM per l'aiuto di Claro: `data-claro="explainer" | "detail" | "search"`.

## 2-bis. ⚠️ REGOLA CRITICA: ogni pagina tematica va fatta in DUE lingue
Il testo tradotto lato client **Google non lo vede**: legge solo l'HTML statico e i
`metadata`. Una pagina con metadata solo in spagnolo è **invisibile** a chi cerca in
italiano (nell'agosto 2026 questo costava all'Italia l'80% del traffico potenziale).

Quindi, per ogni nuovo tema, si creano **due pagine** con URL propri:
- `page.tsx` spagnolo → `<XClient />` (default ES)
- `page.tsx` italiano con **URL italiano** → `<XClient locale="it" />`

Entrambe con: metadata nella propria lingua, `alternates.canonical` proprio,
`languages: { "es-ES": …, "it-IT": … }` (**hreflang**, così non sono doppioni),
JSON-LD nella propria lingua, voce nel sitemap, e link interni che puntano alla
versione giusta (`locale === "it" ? "/url-it/" : "/url-es/"`).

Il meccanismo è la prop **`force`** di `LocaleProvider`: fissa la lingua e disattiva
l'autodetezione, così l'HTML statico esce già tradotto. I client accettano
`{ locale?: "es" | "it" }` e lo passano a `<LocaleProvider force={locale}>`.

Coppie esistenti: `/sueldos-politicos/`↔`/stipendi-politici/` ·
`/sueldos-profesiones/`↔`/stipendi-professioni/` · `/deuda-nacional/`↔`/debito-pubblico/` ·
`/fondos-europeos/`↔`/fondi-europei-pnrr/` · `/jugadores/`↔`/soldi-giocatori/` ·
`/champions-league/`↔`/premi-champions-league/` · `/eurocopa/`↔`/premi-europei/` ·
`/mundial-2026/`↔`/premi-mondiali-2026/` · `/futbol/`↔`/calcio/` ·
`/records/`↔`/record-soldi-pubblici/`.

## 2-ter. Titoli: la formula che porta clic (verificata sui dati GSC)
**Numero + domanda aperta**, sotto i ~58 caratteri (oltre, Google taglia; ricorda che
il layout aggiunge " · Cuentas Claras").
- ✅ `"Presupuesto de X 2025: ¿en qué se gastan 51 M€?"` → CTR 9-14%
- ✅ `"A vs B: quién ingresa y debe más"` → CTR 7-15%
- ❌ `"España ganó 28,25 millones €"` → 1% (dà la risposta completa: nessuno clicca)

Il numero serve per credibilità e per rispondere alla ricerca; la domanda lascia
aperta la curiosità. Media del sito senza formula: ~1%.

## 3. SEO (hub-and-spoke) — checklist per OGNI pagina nuova
1. `metadata` completo (title, description, keywords ES+IT, `alternates.canonical`, OG, twitter).
2. JSON-LD: `FAQPage` (dalle FAQ) + `BreadcrumbList`. Iniettati dal `page.tsx` server.
3. **Aggiungere la rotta a `src/app/sitemap.ts`** con la barra finale `/` (trailingSlash).
4. Collegare la pagina da/verso l'hub pertinente (niente pagine orfane): home, `/futbol`, pagine
   sorelle, ecc.
5. Coppie di confronto: unica fonte `src/data/compare-lists.ts` (`CMP_ES`, `CMP_IT`,
   `comparePairsFor()`).
6. FAQ costruite dalle **query reali** (Google Search Console) — vedi memoria `gsc-baseline-strategy`.

## 4. Immagini
- CSP `img-src 'self' data: blob:` → le immagini devono essere **self-hosted** in
  `web/public/photos/` (foto Unsplash, licenza libera, **senza loghi**). Niente hotlink esterni.
- Generazione OG/PNG: `@resvg/resvg-js` + `esbuild`. **resvg non renderizza le emoji** → nei PNG
  usare € o testo, non ⚽/🇮🇹 (le emoji vanno bene solo nell'HTML renderizzato dal browser).

## 5. Deploy (il push diretto su `main` è bloccato dal classifier)
```
git checkout -b <branch> main
git add -A && git commit -m "..."
git push -u origin <branch>
gh pr create --title "..." --body "..."
gh pr merge <branch> --merge --delete-branch
git checkout main && git pull
gh workflow run deploy.yml --ref main
```
Il cron (ogni 2h) esegue anche `npm run etl:news`. Firma i commit con
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## 6. Build su Windows
```
cd web && NODE_OPTIONS=--max-old-space-size=8192 npx next build
```
`next.config.ts`: `experimental { workerThreads: false, cpus: 1 }`. Deve prerenderizzare
tutte le pagine statiche senza errori.

## 7. Verifica (preview)
Usare gli strumenti Browser (preview_start name "web"). Gli screenshot vanno spesso in timeout
per le animazioni `aurora` → verificare con `javascript_tool` / `read_page` / `read_console_messages`.
`<li>` annidati e mismatch di hydration si vedono in console: vanno risolti.

## 8. Sezioni calcio-premi (pattern consolidato)
Pagine `mundial-2026`, `champions-league`, `eurocopa`: HeroBanner + SimpleExplainer + KPI +
lista per fase (tier universali: `PO/R16/QF/SF/FIN/🏆`) + ShareBar + sezione "vs" + FAQ.
Cifre **ufficiali** (FIFA/UEFA) con link alla fonte. Tutte interconnesse + nel sitemap + in home.

## 9. Made in Italy 🇮🇹
Ogni pagina/README/documento porta la dicitura "Made in Italy".
