# Guida lampo: far entrare Cuentas Claras su Google e Bing

Questa è l'unica parte che **devi fare tu** (serve il tuo login Google e il dominio
comprato). Il resto — sitemap, dati strutturati, IndexNow, 162 pagine — è già pronto
nel sito. Segui i passi in ordine; in tutto ~10 minuti.

> Prerequisito: aver comprato il dominio e averlo connesso a **Cloudflare Pages**
> (Pages → il progetto `cuentas-claras` → Custom domains → Set up a custom domain).
> Da qui in poi chiamo il tuo dominio `TUODOMINIO` (es. `cuentasclaras.com`).

---

## 0. Una cosa che faccio io appena hai il dominio
Dimmi il dominio definitivo e aggiorno nel codice `NEXT_PUBLIC_SITE_URL`, così
**sitemap, canonical, Open Graph e IndexNow** puntano al dominio giusto e ridisplego.
Senza questo, Google indicizzerebbe l'URL provvisorio `.pages.dev`. **Fallo prima** di
inviare la sitemap.

---

## 1. Google Search Console (il passo che mette le pagine su Google)

1. Vai su **https://search.google.com/search-console** e accedi col tuo Google.
2. **Aggiungi proprietà** → scegli **"Dominio"** (colonna di sinistra, non "Prefisso URL").
   Scrivi `TUODOMINIO` (senza `https://`, senza `www`). Copre tutto: http/https, www e non-www.
3. Google ti dà un record **TXT** da mettere nel DNS. Siccome il DNS è su **Cloudflare**:
   - Cloudflare → il tuo dominio → **DNS → Records → Add record**.
   - Type `TXT`, Name `@`, Content = la stringa `google-site-verification=...` che ti ha dato Google.
   - Salva, torna su Search Console e premi **Verifica** (di solito immediato; a volte 5-30 min).
4. Verificata la proprietà → menu **Sitemap** → in "Aggiungi una nuova sitemap" scrivi
   `sitemap.xml` e premi **Invia**. (URL completo: `https://TUODOMINIO/sitemap.xml`.)
   È questo che dice a Google le 162 pagine da indicizzare.
5. (Opzionale ma utile) menu **Controllo URL** in alto → incolla `https://TUODOMINIO/` →
   **Richiedi indicizzazione** della home. Fai lo stesso per 3-4 città importanti
   (es. `/es/madrid`, `/es/barcelona`, `/it/milano`). Accelera la prima scansione.

> Tempi reali: la verifica è immediata, ma **comparire nei risultati richiede
> giorni/settimane** — Google deve scansionare e valutare. È normale per ogni sito nuovo.
> Nessuno può saltare questo passaggio: diffida di chi promette "primo in un giorno".

---

## 2. Bing Webmaster Tools (Bing + assistenti AI che usano Bing)

1. Vai su **https://www.bing.com/webmasters** e accedi.
2. **Importa da Google Search Console** (il bottone "Import"): riusa la verifica e la
   sitemap già fatte. In 1 clic sei a posto.
3. Se preferisci manuale: Aggiungi sito `https://TUODOMINIO`, verifica con record DNS
   (stessa logica del punto 1), poi **Sitemaps → Submit** `https://TUODOMINIO/sitemap.xml`.

> **IndexNow è già attivo** nel sito (chiave pubblicata + ping settimanale dopo ogni
> deploy): Bing e Yandex vengono avvisati in automatico ad ogni aggiornamento. Non devi
> fare nulla in più.

---

## 3. Dopo: come si sale davvero (autorità)
La SEO tecnica è completa; da qui conta la **reputazione**. Le azioni a maggior resa,
già pronte come testi in [LAUNCH.md](LAUNCH.md):
- Pubblicare su **Product Hunt**, **Hacker News (Show HN)**, Reddit (r/spain, r/italy,
  r/dataisbeautiful), Menéame.
- Backlink di qualità da open data / giornalismo dati: **datos.gob.es**, **Civio**,
  **Spaghetti Open Data**, sezioni dati dei media.
- Ogni link serio da questi siti accelera il posizionamento più di qualsiasi trucco.

---

## Checklist
- [ ] Dominio comprato e connesso a Cloudflare Pages
- [ ] (io) `NEXT_PUBLIC_SITE_URL` aggiornato + redeploy
- [ ] GSC: proprietà Dominio verificata (TXT su Cloudflare)
- [ ] GSC: sitemap `sitemap.xml` inviata
- [ ] GSC: richiesta indicizzazione home + 3-4 città
- [ ] Bing: importato da GSC
- [ ] Diffusione: almeno 2-3 post/backlink dalla lista di LAUNCH.md

_Made in Italy_ 🇮🇹
