"""Aggiorna la deuda viva dei comuni spagnoli (Ministerio de Hacienda) su Cuentas Claras.

Uso (dalla cartella del progetto):
    python tools/aggiorna-deuda/aggiorna_deuda.py 2025            # scrive i file
    python tools/aggiorna-deuda/aggiorna_deuda.py 2025 --prova    # solo controllo, non scrive

Cosa fa:
1. Scarica il file ufficiale dell'anno nuovo e di quello prima (migliaia di euro).
2. Collega ogni comune di city-extras.ts al suo codice INE: cerca nel file dell'anno
   prima la riga con lo stesso importo e lo stesso nome. Se non torna al centesimo, si ferma.
3. Aggiorna city-extras.ts (importo, anno, fonte) e le classifiche in rankings-es.json
   (totale, comuni senza debito, top 30, top 30 per abitante sopra i 20.000 abitanti).
   La popolazione e' quella ufficiale INE (tabella 29005, ultimo anno disponibile).
Il campo "year" di rankings-es.json resta quello degli stipendi (ISPA): il debito usa "debtYear".

Made in Italy
"""
import io
import json
import re
import sys
import unicodedata
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EXTRAS = ROOT / "web/src/data/real/city-extras.ts"
RANKS = ROOT / "web/src/data/rankings-es.json"
URL = "https://www.hacienda.gob.es/CDI/Sist%20Financiacion%20y%20Deuda/InformacionEELLs/{y}/Deuda-viva-ayuntamientos-{y}12.xlsx"
INE = "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/29005?nult=1&tip=AM"
MIN_POP = 20000


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def variants(name):
    """Slug possibili di un nome Hacienda: 'Barrios (Los)' -> los-barrios, 'Alicante/Alacant' -> alicante..."""
    name = name.strip()
    out = {slug(name)}
    m = re.match(r"^(.*)\s*\(([^)]+)\)$", name)
    base, art = (m.group(1).strip(), m.group(2).strip()) if m else (name, "")
    parts = [p.strip() for p in base.split("/")] + [base]
    if len(parts) == 3:  # 'Jávea/Xàbia' -> anche xabia-javea
        out.add(slug(f"{parts[1]} {parts[0]}"))
    for p in parts:
        out.add(slug(p))
        if art:
            out.add(slug(f"{art} {p}"))
            out.add(slug(f"{art}{p}"))  # L'Hospitalet
    return {v for v in out if v}


def leggi_debito(y):
    import openpyxl
    wb = openpyxl.load_workbook(io.BytesIO(get(URL.format(y=y))), read_only=True)
    rows = {}
    for r in wb["Datos"].iter_rows(values_only=True):
        if r[0] == str(y) and r[5] and isinstance(r[7], (int, float)):
            code = f"{r[3]}{r[5]}"
            rows[code] = {"name": r[6].strip(), "amount": round(r[7] * 1000)}
    return rows


def leggi_popolazione():
    pop, anno = {}, None
    for s in json.loads(get(INE)):
        md = s.get("MetaData", [])
        if len(md) < 3 or md[1]["Codigo"] != "0" or md[2]["Codigo"] != "0" or not s["Data"]:
            continue
        code = md[0]["Codigo"]
        if len(code) == 5 and code.isdigit():
            pop[code] = int(s["Data"][0]["Valor"])
            anno = s["Data"][0]["Anyo"]
    return pop, anno


def main():
    y = int(sys.argv[1])
    prova = "--prova" in sys.argv
    prev, new = leggi_debito(y - 1), leggi_debito(y)
    pop, pop_year = leggi_popolazione()
    print(f"File {y-1}: {len(prev)} comuni · file {y}: {len(new)} · popolazione INE {pop_year}: {len(pop)}")

    by_amount = {}
    for code, r in prev.items():
        by_amount.setdefault(r["amount"], []).append(code)

    src = EXTRAS.read_text(encoding="utf-8")
    # Solo i comuni spagnoli (fonte Hacienda): Milano e Bologna hanno il loro rendiconto.
    pat = re.compile(r'"(?P<slug>[a-z0-9-]+)": \{ debt: \{ amount: (?P<amt>\d+), year: ' + str(y - 1) +
                     r', source: \{ name: "(?P<sname>Ministerio de Hacienda[^"]*)", url: "(?P<url>[^"]*)" \} \}')
    es_pop = json.loads((ROOT / "web/src/data/real/es-population.json").read_text(encoding="utf-8"))
    problemi, cambi, out = [], 0, src
    for m in pat.finditer(src):
        s, amt = m["slug"], int(m["amt"])
        cands = [c for c in by_amount.get(amt, []) if s in variants(prev[c]["name"])]
        if len(cands) != 1:
            same = by_amount.get(amt, [])
            cands = same if len(same) == 1 else cands
        if len(cands) > 1 and s in es_pop:  # stesso nome in due province (Mieres): vince la popolazione
            cands = [min(cands, key=lambda c: abs(pop.get(c, 0) - es_pop[s]))]
        if len(cands) != 1:
            problemi.append(f"{s}: {len(cands)} candidati per {amt}")
            continue
        code = cands[0]
        if code not in new:
            problemi.append(f"{s}: codice {code} assente nel file {y}")
            continue
        old = m.group(0)
        rep = (old.replace(f"amount: {amt}, year: {y-1}", f"amount: {new[code]['amount']}, year: {y}")
                  .replace(f"(31/12/{y-1})", f"(31/12/{y})")
                  .replace(f"/{y-1}/Deuda-viva-ayuntamientos-{y-1}12.xlsx", f"/{y}/Deuda-viva-ayuntamientos-{y}12.xlsx"))
        out = out.replace(old, rep, 1)
        cambi += 1
    out = out.replace(f"Deuda viva: Ministerio de Hacienda (31/12/{y-1})", f"Deuda viva: Ministerio de Hacienda (31/12/{y})")
    print(f"city-extras: {cambi} comuni aggiornati, {len(problemi)} problemi")
    for p in problemi:
        print("  !", p)

    ranks = json.loads(RANKS.read_text(encoding="utf-8"))
    vals = list(new.values())
    ranks["debtYear"] = y
    ranks["debtSource"] = {"name": f"Ministerio de Hacienda · Deuda viva de las EELL (31/12/{y})", "url": URL.format(y=y)}
    ranks["debtCount"] = len(vals)
    ranks["debtFree"] = sum(1 for v in vals if v["amount"] == 0)
    ranks["debtTotal"] = sum(v["amount"] for v in vals)
    ranks["topDebt"] = [{"name": v["name"], "amount": v["amount"]} for v in sorted(vals, key=lambda v: -v["amount"])[:30]]
    pc = [{"name": new[c]["name"], "pop": pop[c], "debt": new[c]["amount"], "perCapita": round(new[c]["amount"] / pop[c])}
          for c in new if pop.get(c, 0) >= MIN_POP]
    ranks["debtPerCapita"] = sorted(pc, key=lambda v: -v["perCapita"])[:30]
    ranks["debtPerCapitaMinPop"] = MIN_POP
    ranks["debtPopYear"] = pop_year
    print(f"Totale {ranks['debtTotal']:,} € · senza debito {ranks['debtFree']}/{ranks['debtCount']}")
    print("Top 3:", [(d["name"], d["amount"]) for d in ranks["topDebt"][:3]])
    print("Per abitante top 3:", [(d["name"], d["perCapita"]) for d in ranks["debtPerCapita"][:3]])

    if problemi:
        print("Ci sono problemi: non scrivo niente.")
        sys.exit(1)
    if prova:
        print("Prova: non scrivo niente.")
        return
    EXTRAS.write_text(out, encoding="utf-8")
    RANKS.write_text(json.dumps(ranks, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("Scritti city-extras.ts e rankings-es.json")


if __name__ == "__main__":
    main()
