// I "dati del giorno" per Instagram, calcolati dagli STESSI dati del sito.
//
// Niente numeri scritti a mano: ogni post nasce da src/lib/data.ts (bilanci
// ufficiali, stipendi dei sindaci, debito) e porta con sé la fonte della singola
// città. Se il dato del sito cambia, cambia anche il post.
//
// Ogni fatto è scritto con le regole di vendita e di voce del progetto:
// prima la domanda che fa riconoscere il problema, poi il numero, poi cosa vuol
// dire nella vita vera. Niente confronti con altri siti, niente indignazione:
// il numero e la fonte.

import { COUNTRIES, type CountryCode, type RegionData } from "@/lib/data";

export type Fatto = {
  id: string;
  paese: CountryCode;
  // le tre slide del carosello
  domanda: string; // slide 1: il problema, in forma di domanda
  numero: string; // slide 2: la cifra, già scritta per gli umani
  sottoNumero: string; // slide 2: di cosa è la cifra
  traduzione: string; // slide 3: cosa vuol dire nella vita vera
  fonte: { name: string; url: string };
  anno: number | null;
  url: string; // la pagina del sito che lo spiega (va in bio / didascalia)
  hashtag: string[];
};

const SITO = "https://www.cuentas-clara.com";

function reali(p: CountryCode): RegionData[] {
  const visti = new Set<string>();
  return Object.values(COUNTRIES[p].regions).filter((r) => {
    if (r.isSample || visti.has(r.slug)) return false;
    visti.add(r.slug);
    return true;
  });
}

const fmt = (p: CountryCode) => (n: number, dec = 0) =>
  new Intl.NumberFormat(p === "it" ? "it-IT" : "es-ES", { maximumFractionDigits: dec, minimumFractionDigits: dec, useGrouping: "always" }).format(n);

// 1.234.567.890 -> "1.235 milioni" / "1.235 millones"; sotto il milione resta intero.
function soldi(p: CountryCode, n: number): string {
  const f = fmt(p);
  if (n >= 1e9 && p === "it") return `${f(n / 1e9, 1)} miliardi €`; // in spagnolo si dice "1.874 millones"
  if (n >= 1e6) return `${f(n / 1e6, 0)} ${p === "it" ? "milioni" : "millones"} €`;
  return `${f(n)} €`;
}

function paginaCitta(p: CountryCode, slug: string) {
  return `${SITO}/${p}/${slug}/`;
}

function maxBy(arr: RegionData[], f: (r: RegionData) => number | null | undefined) {
  let best: RegionData | null = null;
  let bv = -Infinity;
  for (const r of arr) {
    const v = f(r);
    if (v != null && Number.isFinite(v) && v > bv) {
      bv = v;
      best = r;
    }
  }
  return best ? { r: best, v: bv } : null;
}

function fattiPaese(p: CountryCode): Fatto[] {
  const it = p === "it";
  const t = (es: string, itx: string) => (it ? itx : es);
  const f = fmt(p);
  const a = reali(p);
  const out: Fatto[] = [];
  const tagPaese = it ? ["soldipubblici", "comuni", "italia"] : ["dineropublico", "ayuntamientos", "espana"];

  // Il sindaco che prende di più. ATTENZIONE ai pari merito: in Italia l'indennità
  // la fissa la legge per fascia di abitanti, quindi le grandi città prendono
  // tutte la stessa cifra. Dire "il più pagato è Bologna" sarebbe falso.
  const sal = maxBy(a, (r) => r.mayorSalary?.amount);
  if (sal && sal.r.mayorSalary) {
    const m = sal.r.mayorSalary;
    const pari = a
      .filter((r) => r.mayorSalary?.amount === sal.v)
      .sort((x, y) => (y.poblacion ?? y.gastos) - (x.poblacion ?? x.gastos))
      .map((r) => r.name);
    const mese = f(Math.round(sal.v / 12));
    const elenco = pari.length > 4 ? `${pari.slice(0, 4).join(", ")}…` : pari.join(", ");
    out.push({
      id: `${p}-sindaco-record`,
      paese: p,
      domanda:
        pari.length > 1
          ? t("¿Cuánto cobra el alcalde de una gran ciudad?", "Quanto prende il sindaco di una grande città?")
          : t("¿Cuánto cobra el alcalde que más cobra de España?", "Quanto prende il sindaco più pagato d'Italia?"),
      numero: `${f(sal.v)} €`,
      sottoNumero: t(`al año, brutos · ${elenco}`, `all'anno, lordi · ${elenco}`),
      traduzione:
        pari.length > 1
          ? t(
              `Es la misma cifra en ${pari.length} ciudades: la fija la ley, no el ayuntamiento. Dividido en 12 meses, son ${mese} € brutos al mes.`,
              `È la stessa cifra in ${pari.length} città: la fissa la legge, non il comune. Diviso per 12 mesi, sono ${mese} € lordi al mese.`,
            )
          : t(
              `Dividido en 12 meses, son unos ${mese} € brutos al mes. Es el sueldo más alto entre las ciudades que seguimos.`,
              `Diviso per 12 mesi, sono circa ${mese} € lordi al mese. È lo stipendio più alto tra le città che seguiamo.`,
            ),
      fonte: m.source,
      anno: null,
      url: pari.length > 1 ? `${SITO}/${it ? "stipendi-sindaci" : "sueldos-alcaldes"}/` : paginaCitta(p, sal.r.slug),
      hashtag: [...tagPaese, it ? "sindaco" : "alcalde", it ? "stipendi" : "sueldos"],
    });
  }

  // Chi spende di più per ogni abitante
  const spc = maxBy(a, (r) => (r.poblacion && r.gastos > 0 ? r.gastos / r.poblacion : null));
  if (spc) {
    out.push({
      id: `${p}-spesa-abitante-record`,
      paese: p,
      domanda: t("¿Cuánto gasta tu ayuntamiento por cada vecino?", "Quanto spende il tuo comune per ogni abitante?"),
      numero: `${f(spc.v)} €`,
      sottoNumero: t(`por vecino en un año · ${spc.r.name}`, `per abitante in un anno · ${spc.r.name}`),
      traduzione: t(
        `Es el récord entre las ciudades que seguimos. Una familia de 4 «pesa» ${f(spc.v * 4)} € en el presupuesto.`,
        `È il record tra le città che seguiamo. Una famiglia di 4 persone «pesa» ${f(spc.v * 4)} € sul bilancio.`,
      ),
      fonte: spc.r.source ?? { name: "", url: "" },
      anno: spc.r.year,
      url: paginaCitta(p, spc.r.slug),
      hashtag: [...tagPaese, it ? "bilancio" : "presupuesto"],
    });
  }

  // Il debito più grande
  const deb = maxBy(a, (r) => (r.debt && r.debt.amount > 0 ? r.debt.amount : null));
  if (deb && deb.r.debt) {
    const pc = deb.r.poblacion ? deb.v / deb.r.poblacion : null;
    out.push({
      id: `${p}-debito-record`,
      paese: p,
      domanda: t("¿Qué ciudad debe más dinero en España?", "Quale città ha più debiti in Italia?"),
      numero: soldi(p, deb.v),
      sottoNumero: t(`de deuda · ${deb.r.name}`, `di debito · ${deb.r.name}`),
      traduzione: pc
        ? t(
            `Repartido entre sus vecinos, son ${f(pc)} € cada uno. Bebés incluidos.`,
            `Diviso tra i suoi abitanti, sono ${f(pc)} € a testa. Neonati compresi.`,
          )
        : t("Es lo que todavía tiene que devolver de préstamos pedidos en los últimos años.", "È quello che deve ancora restituire di mutui e prestiti presi negli anni."),
      fonte: deb.r.debt.source,
      anno: deb.r.debt.year,
      url: paginaCitta(p, deb.r.slug),
      hashtag: [...tagPaese, it ? "debito" : "deuda"],
    });
  }

  // Quante città non devono un euro
  const zero = a.filter((r) => r.debt && r.debt.amount === 0);
  const conDebito = a.filter((r) => r.debt);
  if (zero.length && conDebito.length) {
    const esempio = zero.find((r) => r.debt?.source?.url) ?? zero[0];
    out.push({
      id: `${p}-zero-debito`,
      paese: p,
      domanda: t("¿Tu ayuntamiento tiene deudas?", "Il tuo comune ha debiti?"),
      numero: f(zero.length),
      sottoNumero: t(`ciudades de ${conDebito.length} no deben ni un euro`, `città su ${conDebito.length} non devono un euro`),
      traduzione: t(
        `Se puede. ${esempio.name} es una de ellas. Busca la tuya en la web.`,
        `Si può fare. ${esempio.name} è una di queste. Cerca la tua sul sito.`,
      ),
      fonte: esempio.debt!.source,
      anno: esempio.debt!.year,
      url: `${SITO}/${it ? "record-soldi-pubblici" : "records"}/`,
      hashtag: [...tagPaese, it ? "debito" : "deuda"],
    });
  }

  return out.filter((x) => x.fonte.url);
}

export function tuttiIFatti(): Fatto[] {
  return [...fattiPaese("it"), ...fattiPaese("es")];
}
