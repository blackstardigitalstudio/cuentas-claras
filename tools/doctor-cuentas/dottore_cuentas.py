# -*- coding: utf-8 -*-
"""
dottore_cuentas.py — il check-up di Cuentas Claras, dalla A alla Z.

Visita il sito VERO (quello online, che vedono la gente e Google), non la
build locale: cosi' non serve compilare e non si rischia di controllare una
versione che nessuno vede.

  A. Le pagine rispondono?                    (errori, pagine sparite)
  B. Sono fatte con la formula che funziona?  (titolo, FAQ, citazione, lingua)
  C. Le fonti ufficiali sono ancora vive?     (un link morto smentisce tutto)
  D. Si capisce?                              (leggibilita' misurata, IT e ES)
  E. Ci sono parole da burocrate o da AI?     (la regola "humanizer")
  F. I dati sono freschi?

Leggibilita', con le formule giuste per ogni lingua:
  - ITALIANO: indice Gulpease (Lucisano e Piemontese, Univ. La Sapienza, 1988)
      G = 89 + (300 * frasi - 10 * lettere) / parole
      sotto 60 -> difficile per chi ha la licenza media
      sotto 80 -> difficile per chi ha la licenza elementare
  - SPAGNOLO: scala INFLESZ (Barrio Cantalejo, validata in Spagna sui testi
      per i pazienti), dalla formula di perspicuita' di Szigriszt-Pazos
      I = 206,835 - 62,3 * (sillabe / parole) - (parole / frasi)
      <40 molto difficile · 40-55 un po' difficile · 55-65 normale
      65-80 abbastanza facile · >80 molto facile

Il nostro lettore e' una persona normale, spesso al telefono, con 10 secondi:
puntiamo a Gulpease >= 60 e INFLESZ >= 55.

Uso:
  python tools/doctor-cuentas/dottore_cuentas.py            # visita completa
  python tools/doctor-cuentas/dottore_cuentas.py --veloce   # senza controllo fonti

Esce 1 se c'e' qualcosa di GRAVE, 0 altrimenti (cosi' la doctor globale e il
workflow programmato sanno se alzare la mano).

Made in Italy
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from html import unescape

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

SITE = "https://www.cuentas-clara.com"
ARGS = set(sys.argv[1:])
QUI = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(QUI, "..", ".."))

GRAVI, CURARE, NOTE = [], [], []


def segna(lista, dove, cosa, cura=""):
    lista.append((dove, cosa, cura))


def scarica(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (dottore Cuentas Claras)"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read().decode("utf-8", errors="replace")


# --------------------------------------------------------------- quali pagine
# Le pagine "a tema" si visitano tutte. Schede citta', confronti e fasce sono
# MODELLI: se uno e' rotto lo sono tutti, quindi ne basta un campione.
CAMPIONE = [
    "/es/madrid/", "/es/la-vall-d-uixo/", "/es/lepe/",
    "/it/roma/", "/it/bologna/", "/it/prato/",
    "/sueldo-alcalde/500-habitantes/", "/sueldo-alcalde/100000-habitantes/",
    "/stipendio-sindaco/5000-abitanti/", "/stipendio-sindaco/100000-abitanti/",
    "/futbol/real-madrid/", "/futbol/real-madrid-vs-fc-barcelona/",
    "/comparar/madrid-vs-barcelona/", "/confronta/roma-vs-milano/",
]

# Pagine dove NON si mette la citazione Article, per scelta: le fonti sono i
# fact-checker o i giornali (gia' linkati voce per voce), oppure sono stime di
# stampa. Mettere li' una fonte autorevole sarebbe una bugia.
SENZA_CITAZIONE = {
    "/bulos/", "/bufale-soldi-pubblici/", "/escandalos/", "/scandali-soldi-pubblici/",
    "/stipendi-motogp/", "/sueldos-motogp/", "/jugadores/", "/soldi-giocatori/",
}

# Pagine che esistono in UNA lingua sola, per motivi scritti in AGENTS.md §2-bis
# (dati che mancano o che cambiano ogni mese). Non sono un errore.
SENZA_COPPIA = {"/tasse-benzina/", "/deuda-municipios/", "/gasto-por-habitante/", "/stipendi-sindaci/",
                "/sueldos-alcaldes/", "/cuanto-cobra-un-concejal/", "/quanto-guadagna-un-consigliere-comunale/",
                "/en-que-se-gasta-el-dinero-publico/", "/dove-vanno-i-soldi-pubblici/", "/ranking/",
                "/spesa-comuni/", "/italia/", "/records/", "/record-soldi-pubblici/"}

# Parole che tradiscono un testo scritto da una macchina. Non c'e' mai un buon
# motivo per lasciarle: si riscrive la frase.
AI_IT = ["inoltre,", "in un mondo sempre più", "non si tratta solo di", "scopri come", "è importante notare",
         "in conclusione,", "nel panorama", "un viaggio", "a 360 gradi", "rivoluzionari"]
AI_ES = ["además,", "en un mundo cada vez más", "no se trata solo de", "descubre cómo", "es importante destacar",
         "en conclusión,", "en el panorama", "un viaje", "revolucionari"]

# Parole da ufficio. ATTENZIONE: alcune restano apposta perché la gente le
# cerca su Google (es. "deuda viva", "indennità di funzione"); vanno pero'
# sempre spiegate subito dopo. Quindi qui sono solo un AVVISO, non un errore.
BURO_IT = ["base imponibile", "erogare", "erogazione", "rimodulare", "in ottemperanza", "trattamento economico",
           "ai sensi del", "debito residuo"]
BURO_ES = ["base imponible", "en virtud de", "a tenor de", "en cumplimiento de lo dispuesto", "prorrogado"]


def pagine_da_visitare():
    try:
        _, xml = scarica(SITE + "/sitemap.xml")
    except Exception as e:
        segna(GRAVI, "sitemap", f"non si scarica ({e})", "il sito e' online? controlla Cloudflare")
        return []
    tutte = [u.replace(SITE, "") for u in re.findall(r"<loc>([^<]+)</loc>", xml)]
    modelli = re.compile(r"^/(es|it|comparar|confronta|futbol|sueldo-alcalde|stipendio-sindaco)/")
    temi = [u for u in tutte if u != "/" and not modelli.match(u)]
    return ["/"] + temi + CAMPIONE


# --------------------------------------------------------------- leggibilita'
def testo_leggibile(html):
    """Il testo che il lettore vede davvero: niente script, menu e piede."""
    # Via anche i menu a tendina: il selettore delle citta' ha 724 nomi, e
    # contarlo come "una frase di 724 parole" faceva sembrare la home illeggibile
    # quando invece e' scritta bene (scoperto al primo giro, ottobre 2026).
    h = re.sub(r"(?is)<(script|style|noscript|svg|nav|footer|select|datalist|option)\b.*?</\1>", " ", html)
    # Ogni blocco (paragrafo, voce di lista, titolo, domanda) e' un'unita' di
    # lettura a se': lo trattiamo come fine frase, senno' un titolo senza punto
    # si incolla alla frase dopo e la fa sembrare lunghissima.
    h = re.sub(r"(?i)</(p|li|h[1-6]|summary|div|dt|dd|td|th|figcaption)>", "\n", h)
    h = re.sub(r"(?s)<[^>]+>", " ", h)
    return unescape(h)


PAROLA = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)*")


def frasi_e_parole(testo):
    righe = [r.strip() for r in testo.split("\n")]
    frasi, parole = 0, []
    for r in righe:
        ws = PAROLA.findall(r)
        if len(ws) < 3:  # pulsanti, etichette, numeri sciolti: non sono frasi
            continue
        maiuscole = sum(1 for w in ws if w[0].isupper())
        if len(ws) >= 8 and maiuscole / len(ws) > 0.7 and not re.search(r"[.!?:;]", r):
            continue  # elenco di nomi (citta', club): si scorre, non si legge
        # Fine frase = punto/esclamativo/interrogativo seguito da spazio o fine,
        # ma NON il punto dentro un numero (1.234 o 6,4).
        pezzi = re.split(r"(?<!\d)[.!?…]+(?=\s|$)|(?<=\d)[.!?…]+(?=\s+[A-ZÀ-Ý¿¡])", r)
        n = sum(1 for p in pezzi if len(PAROLA.findall(p)) >= 1)
        frasi += max(1, n)
        parole.extend(ws)
    return frasi, parole


VOC_FORTI = set("aeoáéóíú")   # í e ú accentate rompono il dittongo: contano come forti
VOC_DEBOLI = set("iuü")


def sillabe_es(parola):
    """Conteggio sillabe spagnolo (approssimato, ~95%): un nucleo per gruppo
    vocalico, con iato fra due vocali forti e dittongo con le deboli."""
    w = parola.lower()
    w = re.sub(r"(?<=[qg])u(?=[eiéí])", "", w)  # que, qui, gue, gui: la u non si pronuncia
    if w.endswith("y") and len(w) > 1:
        w = w[:-1] + "i"
    n, prec = 0, None
    for ch in w:
        if ch in VOC_FORTI:
            if prec is None or prec == "forte":
                n += 1          # inizio sillaba, oppure iato forte+forte
            prec = "forte"      # debole+forte = dittongo: stessa sillaba
        elif ch in VOC_DEBOLI:
            if prec is None:
                n += 1
            prec = prec or "debole"
        else:
            prec = None
    return max(1, n)


def gulpease(testo):
    f, p = frasi_e_parole(testo)
    if len(p) < 60:
        return None
    lettere = sum(len(re.sub(r"['’]", "", w)) for w in p)
    return round(89 + (300 * f - 10 * lettere) / len(p), 1)


def inflesz(testo):
    f, p = frasi_e_parole(testo)
    if len(p) < 60:
        return None
    sil = sum(sillabe_es(w) for w in p)
    return round(206.835 - 62.3 * (sil / len(p)) - (len(p) / f), 1)


def giudizio_it(g):
    if g >= 80: return "facile per tutti"
    if g >= 60: return "si capisce con la licenza media"
    if g >= 40: return "DIFFICILE per chi ha la licenza media"
    return "MOLTO difficile"


def giudizio_es(i):
    if i >= 80: return "muy fácil"
    if i >= 65: return "bastante fácil"
    if i >= 55: return "normal"
    if i >= 40: return "ALGO DIFÍCIL"
    return "MUY DIFÍCIL"


# ------------------------------------------------------------------- visita
def visita_pagina(url, risultati_leggibilita):
    try:
        st, h = scarica(SITE + url)
    except urllib.error.HTTPError as e:
        segna(GRAVI, url, f"risponde {e.code}", "pagina sparita o rotta")
        return
    except Exception as e:
        segna(GRAVI, url, f"non risponde ({type(e).__name__})", "riprovare: se persiste e' rotta")
        return

    lang = (re.search(r'<html[^>]*\blang="([a-z]{2})"', h) or [None, "?"])[1]
    og_it = 'og:locale" content="it_IT"' in h
    titolo = unescape((re.search(r"<title>(.*?)</title>", h, re.S) or [None, ""])[1]).replace(" · Cuentas Claras", "").strip()

    # --- B. la formula
    if og_it and lang != "it":
        segna(GRAVI, url, f'pagina italiana dichiarata lang="{lang}"', "controlla scripts/fix-lang.mjs nel build")
    if len(titolo) > 60:
        segna(CURARE, url, f"titolo di {len(titolo)} caratteri: Google lo taglia", "accorciare sotto i 58")
    if not titolo:
        segna(GRAVI, url, "senza titolo")
    temi = not re.match(r"^/(es|it|comparar|confronta)/", url) and url != "/"
    if temi and '"@type":"FAQPage"' not in h and url not in {"/escandalos/", "/scandali-soldi-pubblici/"}:
        segna(CURARE, url, "senza FAQ nei dati strutturati", "aggiungere FAQPage dalle domande vere")
    if temi and url not in SENZA_CITAZIONE and not url.startswith("/futbol/") \
            and not url.startswith(("/sueldo-alcalde/", "/stipendio-sindaco/")) and '"citation"' not in h:
        segna(CURARE, url, "manca la citazione della fonte (Article)", "articleLd() da src/lib/jsonld.ts")
    if url in SENZA_CITAZIONE and '"citation"' in h:
        segna(GRAVI, url, "ha una citazione autorevole ma e' una pagina di stime/terzi", "toglierla: e' una bugia")
    if temi and url not in SENZA_COPPIA and "hrefLang=" not in h and not url.startswith(("/futbol/", "/sueldo-alcalde/", "/stipendio-sindaco/")):
        segna(NOTE, url, "senza versione nell'altra lingua (hreflang)", "vedi regola §2-bis")
    if "Made in Italy" not in h and "Hecho en Italia" not in h:
        segna(CURARE, url, "manca «Made in Italy»", "aggiungerlo nel piede")
    for link in set(re.findall(r'href="(/[^"#?]*\.html)"', h)):
        segna(CURARE, url, f"link interno con .html: {link}", "URL puliti, regola 12")

    # --- D/E. si capisce?
    testo = testo_leggibile(h)
    basso = testo.lower()
    if lang == "it":
        g = gulpease(testo)
        if g is not None:
            risultati_leggibilita.append((url, "it", g))
            if g < 50:
                segna(CURARE, url, f"Gulpease {g}: {giudizio_it(g)}", "frasi più corte, parole più semplici")
        for w in AI_IT:
            if w in basso:
                segna(CURARE, url, f"frase da AI: «{w}»", "riscrivere da umani")
        buro = [w for w in BURO_IT if w in basso]
        if buro:
            segna(NOTE, url, "parole da ufficio: " + ", ".join(buro), "ok se spiegate subito dopo")
    else:
        i = inflesz(testo)
        if i is not None:
            risultati_leggibilita.append((url, "es", i))
            if i < 45:
                segna(CURARE, url, f"INFLESZ {i}: {giudizio_es(i)}", "frases más cortas, palabras más simples")
        for w in AI_ES:
            if w in basso:
                segna(CURARE, url, f"frase de IA: «{w}»", "reescribir como una persona")
        buro = [w for w in BURO_ES if w in basso]
        if buro:
            segna(NOTE, url, "palabras de oficina: " + ", ".join(buro), "ok si se explican justo después")


# --------------------------------------------------------- C. fonti vive
def fonti_vive():
    """Le fonti ufficiali dichiarate in src/lib/jsonld.ts devono rispondere.
    Ad agosto 2026 la pagina OCSE era morta (404) e nessuno se n'era accorto."""
    f = os.path.join(ROOT, "web", "src", "lib", "jsonld.ts")
    if not os.path.isfile(f):
        segna(NOTE, "fonti", "src/lib/jsonld.ts non trovato")
        return
    urls = sorted(set(re.findall(r'url:\s*"(https?://[^"]+)"', open(f, encoding="utf-8").read())))
    morte, dubbie = [], []
    for u in urls:
        esito = "dubbia"  # finche' non abbiamo una risposta chiara, non giudichiamo
        for metodo in ("HEAD", "GET"):
            try:
                req = urllib.request.Request(u, method=metodo, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0) Chrome/126"})
                with urllib.request.urlopen(req, timeout=20) as r:
                    esito = "viva" if r.status < 400 else "dubbia"
                    break
            except urllib.error.HTTPError as e:
                if e.code in (404, 410):
                    esito = "morta"   # l'unica prova vera che la pagina non c'e' piu'
                    break
                if e.code in (403, 405, 429):
                    esito = "viva"    # il sito blocca i robot, ma la pagina esiste
                    break
            except Exception:
                continue  # connessione rifiutata o lenta: NON e' una prova di morte
        if esito == "morta":
            morte.append(u)
        elif esito == "dubbia":
            dubbie.append(u)
    for u in morte:
        segna(GRAVI, "fonte morta", u, "trovare il nuovo indirizzo ufficiale e correggerlo in jsonld.ts")
    for u in dubbie:
        # Alcuni siti (UEFA) rifiutano la connessione ai programmi: da un browser
        # funzionano. Lo diciamo invece di inventare un "morta".
        segna(NOTE, "fonte non verificabile da qui", u, "aprila dal browser: se si apre e' tutto a posto")
    print(f"   fonti ufficiali controllate: {len(urls)} · morte: {len(morte)} · non verificabili: {len(dubbie)}")


# --------------------------------------------------------- F. dati freschi
def dati_freschi():
    news = os.path.join(ROOT, "web", "src", "data", "news.json")
    if os.path.isfile(news):
        giorni = (time.time() - os.path.getmtime(news)) / 86400
        if giorni > 3:
            segna(NOTE, "notizie", f"news.json in locale ha {giorni:.0f} giorni", "normale se lavori poco qui: online le rinnova il cron ogni 2 ore")
    al = os.path.join(ROOT, "web", "src", "data", "real", "alcaldes-es.json")
    if os.path.isfile(al):
        giorni = (time.time() - os.path.getmtime(al)) / 86400
        if giorni > 120:
            segna(CURARE, "sindaci", f"nomi dei sindaci vecchi di {giorni:.0f} giorni", "cd web && npm run etl:alcaldes")
    else:
        segna(CURARE, "sindaci", "alcaldes-es.json assente", "cd web && npm run etl:alcaldes")


# ------------------------------------------------------------------- main
def main():
    print("== CHECK-UP CUENTAS CLARAS ==")
    print(f"   sito: {SITE}\n")

    pagine = pagine_da_visitare()
    print(f"   pagine da visitare: {len(pagine)} (tutte quelle a tema + un campione dei modelli)")
    leg = []
    for i, u in enumerate(pagine, 1):
        visita_pagina(u, leg)
        if i % 15 == 0:
            print(f"   ... {i}/{len(pagine)}")
        time.sleep(0.15)  # gentili col sito

    if "--veloce" not in ARGS:
        fonti_vive()
    dati_freschi()

    # --- riepilogo leggibilita'
    if leg:
        it = sorted([x for x in leg if x[1] == "it"], key=lambda x: x[2])
        es = sorted([x for x in leg if x[1] == "es"], key=lambda x: x[2])
        print("\n== SI CAPISCE? ==")
        if it:
            media = sum(x[2] for x in it) / len(it)
            print(f"   ITALIANO  Gulpease medio {media:.0f} ({giudizio_it(media)}) su {len(it)} pagine")
            print("   le più difficili: " + " · ".join(f"{u} {g}" for u, _, g in it[:4]))
        if es:
            media = sum(x[2] for x in es) / len(es)
            print(f"   ESPAÑOL   INFLESZ medio {media:.0f} ({giudizio_es(media)}) su {len(es)} pagine")
            print("   las más difíciles: " + " · ".join(f"{u} {g}" for u, _, g in es[:4]))
        with open(os.path.join(QUI, "ultima-leggibilita.json"), "w", encoding="utf-8") as fh:
            json.dump({"data": time.strftime("%Y-%m-%d"), "pagine": [{"url": u, "lingua": l, "punteggio": s} for u, l, s in leg]},
                      fh, ensure_ascii=False, indent=1)

    # --- verdetto
    print("\n== VERDETTO ==")
    for titolo, lista in (("🔴 GRAVE", GRAVI), ("🟠 DA CURARE", CURARE), ("⚪ NOTE", NOTE)):
        if not lista:
            continue
        print(f"\n{titolo} ({len(lista)})")
        for dove, cosa, cura in lista[:40]:
            print(f"  · {dove}  —  {cosa}" + (f"   → {cura}" if cura else ""))
        if len(lista) > 40:
            print(f"  … e altre {len(lista) - 40}")
    if not (GRAVI or CURARE):
        print("\n✅ Sta bene: niente di grave, niente da curare.")
    print("\nMade in Italy")
    sys.exit(1 if GRAVI else 0)


if __name__ == "__main__":
    main()
