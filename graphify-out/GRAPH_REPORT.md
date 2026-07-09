# Graph Report - sito web soldi  (2026-07-09)

## Corpus Check
- 73 files · ~524,467 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 375 nodes · 525 edges · 37 communities (29 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `79b50de6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LocaleProvider.tsx
- data.ts
- page.tsx
- devDependencies
- compilerOptions
- etl-barcelona.mjs
- dependencies
- Guida lampo: far entrare Cuentas Claras su Google e Bing
- Kit de lanzamiento · Cuentas Claras
- etl-vitoria.mjs
- Home.tsx
- etl-sevilla.mjs
- etl-gobierto.mjs
- etl-malaga.mjs
- etl-news.mjs
- Cuentas Claras 🇪🇸
- etl-bologna.mjs
- etl-milano.mjs
- etl-valencia.mjs
- Despliegue gratuito · Cuentas Claras
- gen-og.mjs
- NewsCover.tsx
- SpainMap.tsx
- Política de seguridad · Cuentas Claras
- layout.tsx
- README.md
- d3-composite-projections.d.ts
- etl-all.mjs
- CLAUDE.md
- AGENTS.md
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 16 edges
2. `compilerOptions` - 16 edges
3. `formatCompact()` - 15 edges
4. `formatEuro()` - 11 edges
5. `Kit de lanzamiento · Cuentas Claras` - 11 edges
6. `useMessages()` - 10 edges
7. `formatPct()` - 9 edges
8. `scripts` - 8 edges
9. `COUNTRIES` - 8 edges
10. `aggregate()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Section()` --calls--> `formatCompact()`  [EXTRACTED]
  web/src/app/ranking/page.tsx → web/src/lib/format.ts
- `BubbleFlow()` --calls--> `useMessages()`  [EXTRACTED]
  web/src/components/BubbleFlow.tsx → web/src/i18n/LocaleProvider.tsx
- `Home()` --calls--> `useLocale()`  [EXTRACTED]
  web/src/components/Home.tsx → web/src/i18n/LocaleProvider.tsx
- `SiteNav()` --calls--> `useMessages()`  [EXTRACTED]
  web/src/components/SiteNav.tsx → web/src/i18n/LocaleProvider.tsx
- `generateMetadata()` --calls--> `formatCompact()`  [EXTRACTED]
  web/src/app/[pais]/[ciudad]/page.tsx → web/src/lib/format.ts

## Import Cycles
- None detected.

## Communities (37 total, 8 thin omitted)

### Community 0 - "LocaleProvider.tsx"
Cohesion: 0.09
Nodes (29): metadata, NEWS, NewsItem, top, LangSwitch(), News(), Scoop(), ScoopBoard() (+21 more)

### Community 1 - "data.ts"
Cohesion: 0.08
Nodes (26): metadata, ranked(), RankingPage(), Section(), bounds(), coloredFC(), Feat, RegionMapGL() (+18 more)

### Community 2 - "page.tsx"
Cohesion: 0.13
Nodes (26): cities, ItaliaPage(), metadata, totalGastos, CityPage(), find(), generateMetadata(), PAISES (+18 more)

### Community 3 - "devDependencies"
Cohesion: 0.07
Nodes (29): devDependencies, eslint, eslint-config-next, @resvg/resvg-js, satori, satori-html, tailwindcss, @tailwindcss/postcss (+21 more)

### Community 4 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "etl-barcelona.mjs"
Cohesion: 0.17
Nodes (16): aggregate(), AREA_POL_RE, AREA_RE, AREAS, bump(), __dirname, fetchCsv(), GAS_CAP (+8 more)

### Community 6 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, d3, d3-composite-projections, d3-geo, d3-hierarchy, d3-interpolate, d3-sankey, d3-scale (+6 more)

### Community 7 - "Guida lampo: far entrare Cuentas Claras su Google e Bing"
Cohesion: 0.15
Nodes (11): 0. Una cosa che faccio io appena hai il dominio, 1. Google Search Console (il passo che mette le pagine su Google), 2. Bing Webmaster Tools (Bing + assistenti AI che usano Bing), 3. Dopo: come si sale davvero (autorità), Checklist, Guida lampo: far entrare Cuentas Claras su Google e Bing, 0. Pasos imprescindibles (una vez), 1. Product Hunt / directorios (+3 more)

### Community 8 - "Kit de lanzamiento · Cuentas Claras"
Cohesion: 0.17
Nodes (11): 1. Product Hunt (lanzamiento), 2. Hacker News (Show HN), 3. Reddit (valor primero, sin tono publicitario), 4. X / Twitter (hilo), 5. LinkedIn, 6-bis. Emails LISTOS PARA ENVIAR (personalizados por medio), 6. Email a periodistas de datos / comunidades (backlinks de calidad), 7-bis. DÓNDE PUBLICAR — enlaces directos, por prioridad (+3 more)

### Community 9 - "etl-vitoria.mjs"
Cohesion: 0.22
Nodes (10): AREAS, __dirname, GAS_CAP, ING_CAP, loadOds(), main(), num(), POLITICAS (+2 more)

### Community 10 - "Home.tsx"
Cohesion: 0.27
Nodes (9): motion, Home(), IconCity(), IconLayers(), IconRefresh(), realGastos, CountUp(), FORMATTERS (+1 more)

### Community 11 - "etl-sevilla.mjs"
Cohesion: 0.27
Nodes (9): chapterCats(), __dirname, esNum(), GAS_CAP, ING_CAP, main(), { PDFParse }, pdfText() (+1 more)

### Community 12 - "etl-gobierto.mjs"
Cohesion: 0.31
Nodes (8): AREAS, build(), CITIES, __dirname, ING_CAP, latestYear(), main(), S3()

### Community 13 - "etl-malaga.mjs"
Cohesion: 0.28
Nodes (8): cats(), __dirname, esNum(), GAS_CAP, ING_CAP, main(), { PDFParse }, require

### Community 14 - "etl-news.mjs"
Cohesion: 0.31
Nodes (8): decodeEntities(), __dirname, FEEDS, fetchFeed(), LOC, main(), SCOOP_THEMES, tag()

### Community 15 - "Cuentas Claras 🇪🇸"
Cohesion: 0.22
Nodes (8): Arquitectura, Cuentas Claras 🇪🇸, Desarrollo, Estado del proyecto, Fuentes de datos (oficiales), Posicionamiento honesto sobre los datos, Qué es, Stack

### Community 16 - "etl-bologna.mjs"
Cohesion: 0.39
Nodes (7): aggregate(), __dirname, main(), PALETTE, records(), sentence(), years()

### Community 17 - "etl-milano.mjs"
Cohesion: 0.36
Nodes (7): C, colorFor(), __dirname, main(), num(), PALETTE, sentence()

### Community 18 - "etl-valencia.mjs"
Cohesion: 0.36
Nodes (7): __dirname, fetchCsv(), GAS_CAP, ING_CAP, main(), num(), stripBom()

### Community 19 - "Despliegue gratuito · Cuentas Claras"
Cohesion: 0.29
Nodes (6): 1. Hosting gratuito — comparativa, 2. Dominio gratuito, 3. Comando local, Alternativa sin secrets: integración Git de Cloudflare, Cloudflare Pages vía GitHub Actions — pasos (el actual), Despliegue gratuito · Cuentas Claras

### Community 20 - "gen-og.mjs"
Cohesion: 0.29
Nodes (6): arial, arialBd, __dirname, markup, outDir, png

### Community 21 - "NewsCover.tsx"
Cohesion: 0.38
Nodes (5): hashStr(), NewsCover(), PALETTE, Topic, topicOf()

### Community 22 - "SpainMap.tsx"
Cohesion: 0.33
Nodes (6): color, Feature, max, min, SpainMap(), values

### Community 23 - "Política de seguridad · Cuentas Claras"
Cohesion: 0.40
Nodes (4): Alcance, Medidas activas, Política de seguridad · Cuentas Claras, Reportar una vulnerabilidad

### Community 24 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 25 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **193 isolated node(s):** `__dirname`, `scripts`, `__dirname`, `SOURCES`, `ING_CAP` (+188 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `Home.tsx`, `devDependencies`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `motion` connect `Home.tsx` to `dependencies`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `__dirname`, `scripts`, `__dirname` to the rest of the system?**
  _194 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LocaleProvider.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0919661733615222 - nodes in this community are weakly interconnected._
- **Should `data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08021390374331551 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13446969696969696 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._