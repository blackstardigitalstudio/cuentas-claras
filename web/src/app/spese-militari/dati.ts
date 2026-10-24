// Spesa militare di Italia e Spagna — SOLO cifre ufficiali, con la fonte.
//
// 🔹 NATO, "Defence Expenditure of NATO Countries (2014-2025)" (FONTI.nato):
//    Tabella 1 (milioni di euro, prezzi correnti), Tabella 3 (% del PIL),
//    Tabella 7 (militari, migliaia), Tabelle 8a/8b (ripartizione per voce).
//    2024 e 2025 sono STIME della NATO: lo diciamo sempre.
//    La NATO usa la stessa definizione per tutti i Paesi: per questo i numeri sono
//    più alti del solo bilancio del Ministero della Difesa (dentro ci sono anche
//    pensioni dei militari, missioni, programmi di armamento pagati da altri ministeri).
// 🔹 SIPRI, Trends in World Military Expenditure 2025 (FONTI.sipri): classifica
//    mondiale, Marocco, nota sul Ponte sullo Stretto.
// 🔹 La Moncloa, Plan Industrial y Tecnológico para la Seguridad y la Defensa
//    (FONTI.moncloaDefensa): i 10.471 M€ in più della Spagna nel 2025, voce per voce.

export const ANNI = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
// Milioni di euro, prezzi correnti (NATO, Tabella 1).
export const IT_SERIE = [18427, 17642, 20226, 21166, 21702, 21042, 26360, 28001, 29901, 31302, 32701, 45315];
export const ES_SERIE = [9508, 10000, 9014, 10528, 11172, 11281, 11240, 12546, 15610, 17451, 22693, 33123];
// % del PIL (NATO, Tabella 3): 2014 e 2025.
export const PIL = { it: { 2014: "1,13%", 2025: "2,01%" }, es: { 2014: "0,92%", 2025: "2,00%" } };
// Militari nel 2025, migliaia (NATO, Tabella 7).
export const MILITARI = { it: 171.2, es: 118.2 };
// Abitanti (milioni) per il conto "a testa": Istat ~58,9 · INE ~49,1 (1/1/2025).
export const ABITANTI = { it: 58.9, es: 49.1 };

// Ripartizione per voce, % del totale (NATO, Tabelle 8a/8b).
// armi = equipaggiamento principale + ricerca su di esso; persone = stipendi e pensioni
// di militari e civili; altro = esercizio, manutenzione, operazioni e spese non ripartite.
export type Voci = { armi: number; persone: number; infra: number; altro: number };
export const VOCI: Record<"it" | "es", Record<2024 | 2025, Voci>> = {
  it: { 2024: { armi: 21.58, persone: 58.42, infra: 2.92, altro: 17.08 }, 2025: { armi: 25.68, persone: 42.85, infra: 1.9, altro: 29.57 } },
  es: { 2024: { armi: 30.79, persone: 38.43, infra: 2.32, altro: 28.46 }, 2025: { armi: 32.29, persone: 27.76, infra: 4.63, altro: 35.32 } },
};

// Spagna: i 10.471 M€ del piano 2025, voce per voce (La Moncloa).
export const PIANO_ES = [
  { es: "Sueldos, preparación y equipo de la tropa", it: "Stipendi, addestramento e dotazione dei soldati", v: 3712.49, p: "35%" },
  { es: "Telecomunicaciones y ciberseguridad", it: "Telecomunicazioni e sicurezza informatica", v: 3262.76, p: "31%" },
  { es: "Armas nuevas: defensa y disuasión", it: "Armi nuove: difesa e deterrenza", v: 1962.98, p: "19%" },
  { es: "Emergencias: inundaciones, incendios", it: "Emergenze: alluvioni, incendi", v: 1751.53, p: "17%" },
  { es: "Misiones en el extranjero", it: "Missioni all'estero", v: 328.74, p: "3%" },
];
export const PIANO_ES_TOTALE = 10471;

// SIPRI 2025 (dollari).
export const SIPRI = { mondo: 2887, itPosto: 12, esPosto: 15, esMld: 40.2, maroccoMld: 6.3 };

// Calcolo NOSTRO, dichiarato: PIL 2025 ricavato dai dati NATO (spesa / % del PIL),
// moltiplicato per il nuovo obiettivo (3,5% "difesa vera" entro il 2035, 5% con il resto).
const pil2025 = (spesa: number, pct: number) => spesa / (pct / 100);
export const OBIETTIVO = {
  it: { core: Math.round((pil2025(45315, 2.01) * 3.5) / 100), tot: Math.round((pil2025(45315, 2.01) * 5) / 100) },
  es: { core: Math.round((pil2025(33123, 2.0) * 3.5) / 100), tot: Math.round((pil2025(33123, 2.0) * 5) / 100) },
};

export const ultimo = (s: number[]) => s[s.length - 1];
export const penultimo = (s: number[]) => s[s.length - 2];
export const aTesta = (milioni: number, abitantiMln: number) => Math.round(milioni / abitantiMln / 10) * 10;

export const FAQ_IT = [
  { q: "Quanto spende l'Italia per la difesa all'anno?", a: "Circa 45,3 miliardi di euro nel 2025, secondo la stima della NATO. È il 2,01% del PIL: circa 770 € per ogni abitante. Nel 2024 erano 32,7 miliardi." },
  { q: "Quanto spende l'Italia per la difesa in percentuale del PIL?", a: "Il 2,01% nel 2025 (stima NATO). Nel 2014 era l'1,13%. È la prima volta che l'Italia arriva al 2% chiesto dalla NATO dal 2014." },
  { q: "Quanto sono cresciute le spese militari negli ultimi 10 anni?", a: "Da 18,4 miliardi nel 2014 a 45,3 miliardi nel 2025: quasi due volte e mezzo. Solo tra il 2024 e il 2025 sono saliti di 12,6 miliardi." },
  { q: "Cosa vuol dire il 5% del PIL per la difesa?", a: "Nel giugno 2025 i Paesi NATO hanno promesso di arrivare al 5% del PIL entro il 2035: 3,5% per la difesa vera e 1,5% per spese collegate (infrastrutture, sicurezza informatica, industria). Per l'Italia il 3,5% vorrebbe dire circa 79 miliardi l'anno, il 5% circa 113. È un nostro calcolo sul PIL 2025." },
  { q: "Quanto costa la difesa a ogni italiano?", a: "Circa 770 € all'anno a testa, neonati compresi. Non è una tassa a parte: esce dal salvadanaio generale delle tasse." },
];

export const FAQ_ES = [
  { q: "¿Cuánto gasta España en defensa al año?", a: "Unos 33.123 millones de euros en 2025, según la estimación de la OTAN. Es el 2,00% del PIB: unos 675 € por habitante. En 2024 eran 22.693 millones." },
  { q: "¿Qué porcentaje del PIB gasta España en defensa?", a: "El 2,00% en 2025 (estimación OTAN). En 2014 era el 0,92%. Es la primera vez que España llega al 2% desde que se pactó en 2014." },
  { q: "¿Cuánto gasta realmente España en defensa?", a: "Depende de quién cuente. El presupuesto del Ministerio de Defensa es solo una parte. La OTAN suma también pensiones militares, misiones y programas de armas que paga Industria. Con esa cuenta, común para todos los países, salen 33.123 millones en 2025." },
  { q: "¿Cuánto gasta España en defensa frente a Marruecos?", a: "Según el SIPRI, España gastó 40.200 millones de dólares en 2025 y Marruecos 6.300 millones: España gasta unas seis veces más." },
  { q: "¿Qué es el 5% del PIB que pide la OTAN?", a: "En junio de 2025 los países de la OTAN prometieron llegar al 5% del PIB en 2035: un 3,5% para defensa pura y un 1,5% para gastos relacionados. España pidió flexibilidad y defiende que con un 2,1% cumple. Para España, el 3,5% serían unos 58.000 millones al año (cálculo nuestro sobre el PIB de 2025)." },
];
