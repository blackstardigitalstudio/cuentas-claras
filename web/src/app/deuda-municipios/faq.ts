// Fonte unica delle FAQ di /deuda-municipios/: la pagina visibile (DeudaClient)
// e il JSON-LD (page.tsx) leggono da qui, così Google e le IA vedono le stesse
// domande e le stesse risposte che legge la gente.
import { formatEuro } from "@/lib/format";
import ranks from "@/data/rankings-es.json";

export type Faq = { q: string; a: string };

const pct = Math.round((ranks.debtFree / ranks.debtCount) * 100);
// Hacienda scrive "Barrios (Los)": per chi legge è "Los Barrios".
const nome = (n: string) => n.replace(/^(.*) \((\w+)\)$/, "$2 $1");

export function buildFaqs(it: boolean): Faq[] {
  const top = ranks.topDebt;
  const pc = ranks.debtPerCapita;
  const nf = (n: number) => n.toLocaleString(it ? "it" : "es");
  return it
    ? [
        { q: "Qual è la città più indebitata di Spagna?", a: `${top[0].name}, con un debito residuo di ${formatEuro(top[0].amount)} al 31/12/${ranks.year}, seguita da ${top[1].name} (${formatEuro(top[1].amount)}) e ${top[2].name} (${formatEuro(top[2].amount)}).` },
        { q: "Qual è il comune più indebitato di Spagna per abitante?", a: `${nome(pc[0].name)}: ${formatEuro(pc[0].perCapita)} di debito per ogni abitante al 31/12/${ranks.year}. Seguono ${nome(pc[1].name)} (${formatEuro(pc[1].perCapita)}) e ${nome(pc[2].name)} (${formatEuro(pc[2].perCapita)}). Contiamo solo i comuni oltre ${nf(ranks.debtPerCapitaMinPop)} abitanti.` },
        { q: "Quanto debito hanno in totale i comuni spagnoli?", a: `Il debito residuo dell'insieme dei comuni somma circa ${formatEuro(ranks.debtTotal)} al 31/12/${ranks.year}, secondo il Ministero delle Finanze spagnolo.` },
        { q: "Quanti comuni non hanno debito?", a: `${nf(ranks.debtFree)} comuni su ${nf(ranks.debtCount)} (${pct}%) non registrano alcun debito residuo. Il debito è concentrato nelle grandi città.` },
        { q: "È un male che un comune abbia debito?", a: "Non sempre: come un mutuo, il debito serve per grandi investimenti (scuole, strade). Il problema è quando è troppo rispetto a quanto il comune incassa." },
        { q: "Perché alcune città devono più di altre?", a: "Dipende dalla dimensione, dagli investimenti fatti e dalla gestione passata. Le grandi città concentrano quasi tutto il debito; molti comuni piccoli ne hanno zero." },
        { q: "Cos'è il debito residuo di un comune?", a: "Sono i soldi che il comune ha preso in prestito (da banche o altri enti) e non ha ancora finito di restituire — come il mutuo di casa. Si misura al 31 dicembre." },
      ]
    : [
        { q: "¿Cuál es la ciudad más endeudada de España?", a: `${top[0].name}, con una deuda viva de ${formatEuro(top[0].amount)} a 31/12/${ranks.year}, seguida de ${top[1].name} (${formatEuro(top[1].amount)}) y ${top[2].name} (${formatEuro(top[2].amount)}).` },
        { q: "¿Cuál es el pueblo más endeudado de España por habitante?", a: `${nome(pc[0].name)}: ${formatEuro(pc[0].perCapita)} de deuda por cada vecino a 31/12/${ranks.year}. Le siguen ${nome(pc[1].name)} (${formatEuro(pc[1].perCapita)}) y ${nome(pc[2].name)} (${formatEuro(pc[2].perCapita)}). Contamos solo municipios de más de ${nf(ranks.debtPerCapitaMinPop)} habitantes.` },
        { q: "¿Cuánta deuda tienen en total los ayuntamientos españoles?", a: `La deuda viva del conjunto de los ayuntamientos suma unos ${formatEuro(ranks.debtTotal)} a 31/12/${ranks.year}, según el Ministerio de Hacienda.` },
        { q: "¿Cuántos municipios no tienen deuda?", a: `${nf(ranks.debtFree)} de ${nf(ranks.debtCount)} municipios (${pct}%) no registran ninguna deuda viva. La deuda se concentra en las grandes ciudades.` },
        { q: "¿Es malo que un ayuntamiento tenga deuda?", a: "No siempre: como una hipoteca, la deuda sirve para grandes inversiones (colegios, calles). El problema es cuando es demasiada frente a lo que el ayuntamiento ingresa." },
        { q: "¿Por qué unas ciudades deben más que otras?", a: "Depende del tamaño, de las inversiones hechas y de la gestión pasada. Las grandes ciudades concentran casi toda la deuda; muchos municipios pequeños tienen cero." },
        { q: "¿Qué es la deuda viva de un ayuntamiento?", a: "Es el dinero que el ayuntamiento pidió prestado (a bancos u otras administraciones) y todavía no ha terminado de devolver — como lo que te queda de hipoteca. Se mide a 31 de diciembre. El dato lo publica el Ministerio de Hacienda." },
      ];
}
