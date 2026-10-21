import ranks from "@/data/rankings-es.json";
import { BASE_IT, FASCE_IT, lordoMensileIT, nEu } from "@/data/fasce-sindaci";

// Una sola fuente para las FAQ de /sueldos-politicos/ y /stipendi-politici/:
// la página las pinta y el JSON-LD las repite palabra por palabra.
// La primera pregunta es la que la gente teclea tal cual en Google
// («cuanto cobra un politico en españa»: 81 impresiones, 0 clics).
// Todas las cifras ya están en el sitio, con su fuente:
// cargos del Gobierno → Portal de Transparencia 2025; alcaldes → ISPA;
// parlamentarios italianos → Camera/Senato; sindaci → DM Interno 30/05/2022.

const es = (n: number) => `${nEu(n)} €`;
const itn = es;

const madrid = ranks.topSalaries[0];
const sindacoMin = lordoMensileIT(FASCE_IT[0]);

export type Faq = { q: string; a: string };

export const RISPOSTA_ES =
  `Depende del cargo. El presidente del Gobierno cobra 95.944 € brutos al año; un ministro, 79.415 €; un diputado, 3.366,99 € brutos al mes de base (Congreso, 2026), más indemnizaciones. ` +
  `Un alcalde cobra de media ${es(ranks.salaryAvg)} al año, pero uno de cada tres no cobra nada.`;

export const RISPOSTA_IT =
  `Dipende dalla carica. Un parlamentare prende 10.435 € lordi al mese (circa 125.220 € l'anno), più 3.503 € al mese di diaria per le spese. ` +
  `Un sindaco prende quello che fissa la legge: da ${itn(sindacoMin)} lordi al mese nei comuni più piccoli a ${itn(BASE_IT)} in una città metropolitana.`;

export const FAQ_ES: Faq[] = [
  {
    q: "¿Cuánto cobra un político en España?",
    a: `${RISPOSTA_ES} El que más cobra entre los alcaldes es el de ${madrid.name}: ${es(madrid.amount)} (${ranks.year}).`,
  },
  {
    q: "¿Cuánto cobra el presidente del Gobierno?",
    a: "95.944 € brutos al año (2025), según el Portal de Transparencia. Como además es diputado por Madrid, le corresponde la indemnización para gastos del Congreso: 1.032,38 € al mes (2026).",
  },
  {
    q: "¿Hay alcaldes que cobran más que el presidente del Gobierno?",
    a: `Sí. En ${ranks.year} el alcalde de ${madrid.name} cobró ${es(madrid.amount)}, el de ${ranks.topSalaries[1].name} ${es(ranks.topSalaries[1].amount)} y el de ${ranks.topSalaries[2].name} ${es(ranks.topSalaries[2].amount)}. El presidente del Gobierno, 95.944 €.`,
  },
  {
    q: "¿Cuánto gana un diputado en España?",
    a: "3.366,99 € brutos al mes de base (dato del Congreso, 2026). A eso se suma una indemnización para gastos: 2.162,85 € al mes si es de fuera de Madrid, 1.032,38 € si es de Madrid.",
  },
  {
    q: "¿Cuánto gana un parlamentario en Italia?",
    a: "La indemnización es de 10.435 € brutos al mes (unos 125.220 € al año). Además: una dieta de 3.503 €/mes y otros reembolsos para gastos (no son sueldo).",
  },
  {
    q: "¿De dónde sale este dinero?",
    a: "De tus impuestos. Los sueldos de los altos cargos se publican oficialmente: Portal de Transparencia en España (y el ISPA para los alcaldes); Cámara y Senado en Italia.",
  },
];

export const FAQ_IT: Faq[] = [
  {
    q: "Quanto guadagna un politico in Italia?",
    a: `${RISPOSTA_IT} Il Presidente della Repubblica ha un assegno di 239.182 € l'anno.`,
  },
  {
    q: "Quanto guadagna un parlamentare italiano?",
    a: "L'indennità è di 10.435 € lordi al mese (circa 125.220 € l'anno). In più: diaria di 3.503 € al mese e altri rimborsi per le spese, che non sono stipendio.",
  },
  {
    q: "Quanto guadagna il Presidente della Repubblica?",
    a: "L'assegno è di 239.182 € lordi l'anno. Dal 2022 il presidente Mattarella lo ha ridotto di sua scelta a 179.836 €, pari alla sua pensione da professore.",
  },
  {
    q: "Quanto guadagna un sindaco in Italia?",
    a: `Lo decide la legge in base agli abitanti, non il comune: da ${itn(sindacoMin)} lordi al mese nei comuni fino a 3.000 abitanti a ${itn(BASE_IT)} per il sindaco di una città metropolitana. Se il sindaco continua a lavorare da dipendente, prende la metà.`,
  },
  {
    q: "Quanto guadagna il presidente del Governo spagnolo?",
    a: "95.944 € lordi l'anno (2025), secondo il Portale della Trasparenza: meno di un parlamentare italiano. Essendo anche deputato eletto a Madrid, riceve il rimborso spese del Congreso: 1.032,38 € al mese (2026).",
  },
  {
    q: "Quanto guadagna un deputato in Spagna?",
    a: "3.366,99 € lordi al mese di base (dato del Congreso, 2026). A questo si aggiunge un rimborso spese: 2.162,85 € al mese se è eletto fuori Madrid, 1.032,38 € se è eletto a Madrid.",
  },
  {
    q: "Da dove escono questi soldi?",
    a: "Dalle tue tasse. Gli stipendi delle alte cariche sono pubblicati ufficialmente: Portale della Trasparenza in Spagna; Camera e Senato in Italia; per i sindaci, il decreto del Ministero dell'Interno.",
  },
];

export const faqLd = (faq: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
