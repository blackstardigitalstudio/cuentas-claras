// Fasce demografiche degli stipendi dei sindaci — la domanda vera che fa la gente.
//
// PERCHÉ ESISTE QUESTO FILE: su Google quasi nessuno cerca "quanto guadagna un
// sindaco". Cercano "stipendio sindaco 10.000 abitanti", "5000 abitanti",
// "quanto cobra un alcalde de un pueblo de 500 habitantes". La domanda è sempre
// agganciata alla DIMENSIONE del proprio comune. Qui c'è la tabella di legge per
// rispondere a quella domanda esatta, in tutte e due i paesi.
//
// ⚠️ Tutte le cifre qui dentro vengono dalla legge, non da stime.

// ---------------------------------------------------------------- ITALIA

// L'indennità del sindaco è una percentuale del trattamento dei Presidenti di
// Regione (13.800 € lordi al mese), fissata dalla L. 234/2021 e dal DM Interno
// 30/05/2022, a regime dal 2024.
export const BASE_IT = 13800; // € lordi al mese

export type FasciaIT = {
  pct: number;
  min: number;
  max: number | null;
  label: string;
  nota?: string;
};

export const FASCE_IT: FasciaIT[] = [
  { pct: 16, min: 0, max: 3000, label: "fino a 3.000 abitanti" },
  { pct: 22, min: 3001, max: 5000, label: "da 3.001 a 5.000 abitanti" },
  { pct: 29, min: 5001, max: 10000, label: "da 5.001 a 10.000 abitanti" },
  { pct: 30, min: 10001, max: 30000, label: "da 10.001 a 30.000 abitanti" },
  { pct: 35, min: 30001, max: 50000, label: "da 30.001 a 50.000 abitanti" },
  { pct: 45, min: 50001, max: null, label: "oltre 50.000 abitanti", nota: "Se il comune è capoluogo la percentuale sale: vedi sotto." },
];

export function fasciaPerAbitanti(ab: number): FasciaIT {
  return FASCE_IT.find((f) => ab >= f.min && (f.max === null || ab <= f.max)) || FASCE_IT[FASCE_IT.length - 1];
}

export const lordoMensileIT = (f: FasciaIT) => Math.round((BASE_IT * f.pct) / 100);
export const lordoAnnuoIT = (f: FasciaIT) => lordoMensileIT(f) * 12;

// Sopra i 50.000 abitanti la fascia demografica NON basta: se il comune è
// capoluogo la percentuale sale parecchio (70% provincia, 80% regione, 100%
// città metropolitana). Un comune da 100.000 abitanti è quasi sempre
// capoluogo: dire solo "45%" sarebbe sbagliato. Qui sotto i casi da mostrare
// accanto alla cifra base.
export const RUOLI_IT = [
  { pct: 70, label: "capoluogo di provincia fino a 100.000 abitanti" },
  { pct: 80, label: "capoluogo di provincia oltre 100.000 abitanti, o capoluogo di regione" },
  { pct: 100, label: "sindaco di città metropolitana" },
];

export const serveRuoloIT = (ab: number) => ab >= 50001;

// toLocaleString("it") non mette il punto ai numeri di 4 cifre (è corretto per
// la lingua, ma "2208 €" si legge peggio di "2.208 €" e le fonti ufficiali
// scrivono col punto). Qui lo forziamo sempre.
export function nEu(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export const euro = (n: number) => `${nEu(n)} €`;

// IRPEF 2026: tre scaglioni — 23% fino a 28.000 €, 33% da 28.001 a 50.000 €,
// 43% oltre (L. 199/2025, confermata dall'Agenzia delle Entrate).
// ⚠️ È un CALCOLO, non un dato ufficiale sul singolo sindaco: non tiene conto
// delle detrazioni (che alzano il netto) né delle addizionali regionali e
// comunali (che lo abbassano, e cambiano da comune a comune). Va sempre
// presentato come stima, con il metodo in chiaro.
export const SCAGLIONI_IRPEF = [
  { fino: 28000, aliquota: 0.23 },
  { fino: 50000, aliquota: 0.33 },
  { fino: Infinity, aliquota: 0.43 },
];

export function irpefLorda(redditoAnnuo: number): number {
  let imposta = 0;
  let precedente = 0;
  for (const s of SCAGLIONI_IRPEF) {
    if (redditoAnnuo <= precedente) break;
    const quota = Math.min(redditoAnnuo, s.fino) - precedente;
    imposta += quota * s.aliquota;
    precedente = s.fino;
  }
  return Math.round(imposta);
}

// ---------------------------------------------------------------- SPAGNA

// Tope massimo annuo che la legge consente a un alcalde, per abitanti.
// Ley 31/2022 (Presupuestos Generales del Estado 2023), gli ultimi approvati:
// con il bilancio prorogato questi limiti restano il riferimento.
export type TramoES = {
  min: number;
  max: number | null;
  tope: number | null;
  label: string;
  nota?: string;
};

export const TRAMOS_ES: TramoES[] = [
  {
    min: 0,
    max: 999,
    tope: null,
    label: "menos de 1.000 habitantes",
    nota: "En estos municipios el alcalde NO puede tener dedicación exclusiva: como mucho parcial, o solo asistencias por sesión.",
  },
  { min: 1000, max: 5000, tope: 46464.02, label: "de 1.000 a 5.000 habitantes" },
  { min: 5001, max: 10000, tope: 52272.61, label: "de 5.001 a 10.000 habitantes" },
  { min: 10001, max: 20000, tope: 58080.05, label: "de 10.001 a 20.000 habitantes" },
  { min: 20001, max: 50000, tope: 63888.61, label: "de 20.001 a 50.000 habitantes" },
  { min: 50001, max: 75000, tope: 75504.62, label: "de 50.001 a 75.000 habitantes" },
  { min: 75001, max: 150000, tope: 87120.59, label: "de 75.001 a 150.000 habitantes" },
  { min: 150001, max: 300000, tope: 92928.03, label: "de 150.001 a 300.000 habitantes" },
  { min: 300001, max: 500000, tope: 104544.03, label: "de 300.001 a 500.000 habitantes" },
  { min: 500001, max: null, tope: 116160.05, label: "más de 500.000 habitantes" },
];

export function tramoPorHabitantes(hab: number): TramoES {
  return TRAMOS_ES.find((t) => hab >= t.min && (t.max === null || hab <= t.max)) || TRAMOS_ES[TRAMOS_ES.length - 1];
}

// ------------------------------------------------- taglie da generare

// Le dimensioni che la gente digita davvero, lette dai suggerimenti di Google
// ("Ricerche correlate" e "Le persone hanno chiesto anche"), agosto 2026.
export const TAGLIE_IT = [1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000, 30000, 50000, 100000];
export const TAGLIE_ES = [100, 300, 500, 1000, 1500, 3000, 5000, 10000, 20000, 50000, 100000];

export const FONTE_IT = {
  name: "Ministero dell'Interno · DM 30/05/2022 (indennità amministratori locali)",
  url: "https://dait.interno.gov.it/documenti/decreto-fl-30-05-2022-all-a.pdf",
};
export const FONTE_IRPEF = {
  name: "Agenzia delle Entrate · aliquote e calcolo dell'IRPEF",
  url: "https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/aliquote-e-calcolo-dell-irpef",
};
export const FUENTE_ES = {
  name: "Ley 31/2022, de Presupuestos Generales del Estado para 2023 (art. 18)",
  url: "https://www.boe.es/buscar/act.php?id=BOE-A-2022-22128",
};
