// FAQ dei record, costruite dai DATI e non scritte a mano: quando cambia il
// sindaco più pagato o la città più indebitata, le risposte cambiano da sole.
// Mai un numero fermo dentro un testo che poi invecchia.
import { formatEuro } from "@/lib/format";
import { buildRecordsData, type Rec } from "./records-data";

const trova = (rs: Rec[], key: string) => rs.find((r) => r.key === key);

function domande(lang: "es" | "it") {
  const d = buildRecordsData();
  const out: { q: string; a: string }[] = [];
  const es = lang === "es";

  // Spagna
  const sEs = trova(d.es.records, "salary");
  const dEs = trova(d.es.records, "debt");
  const gEs = trova(d.es.records, "spend");
  // Italia
  const sIt = trova(d.it.records, "salary");
  const gIt = trova(d.it.records, "spend");

  if (sEs) out.push(es
    ? { q: "¿Qué alcalde cobra más en España?", a: `El de ${sEs.name}: ${formatEuro(sEs.v)} brutos al año, según la retribución oficial declarada al ISPA. Es el sueldo más alto entre los municipios que publicamos.` }
    : { q: "Quale sindaco guadagna di più in Spagna?", a: `Quello di ${sEs.name}: ${formatEuro(sEs.v)} lordi all'anno, secondo la retribuzione ufficiale dichiarata all'ISPA.` });

  if (dEs) out.push(es
    ? { q: "¿Qué ciudad española debe más dinero?", a: `${dEs.name}, con ${formatEuro(dEs.v)} de deuda viva —lo que todavía le queda por devolver— a 31/12/2024, según el Ministerio de Hacienda.` }
    : { q: "Quale città spagnola ha più debiti?", a: `${dEs.name}, con ${formatEuro(dEs.v)} di debito ancora da restituire al 31/12/2024, secondo il Ministero delle Finanze spagnolo.` });

  if (gEs) out.push(es
    ? { q: "¿Qué ayuntamiento gasta más en España?", a: `${gEs.name}, con ${formatEuro(gEs.v)} de gasto en su último presupuesto publicado.` }
    : { q: "Quale comune spagnolo spende di più?", a: `${gEs.name}, con ${formatEuro(gEs.v)} di spesa nell'ultimo bilancio pubblicato.` });

  if (sIt) out.push(es
    ? { q: "¿Qué alcalde cobra más en Italia?", a: `En Italia el sueldo del alcalde lo fija la ley según los habitantes, no cada ayuntamiento. El máximo es el de las ciudades metropolitanas como ${sIt.name}: ${formatEuro(sIt.v)} brutos al año.` }
    : { q: "Quale sindaco guadagna di più in Italia?", a: `In Italia l'indennità la fissa la legge in base agli abitanti, non il singolo comune. Il massimo è quello delle città metropolitane come ${sIt.name}: ${formatEuro(sIt.v)} lordi all'anno.` });

  if (gIt) out.push(es
    ? { q: "¿Qué municipio italiano gasta más?", a: `${gIt.name}, con ${formatEuro(gIt.v)} de gasto según SIOPE, el sistema de la Contaduría General del Estado italiano.` }
    : { q: "Quale comune italiano spende di più?", a: `${gIt.name}, con ${formatEuro(gIt.v)} di spesa secondo SIOPE, il sistema della Ragioneria Generale dello Stato.` });

  out.push(es
    ? { q: "¿Cuántos municipios no tienen ninguna deuda?", a: `De los que publicamos, ${d.es.noDebt} municipios españoles no deben nada: su deuda viva es cero.` }
    : { q: "Quanti comuni non hanno debiti?", a: `Tra i comuni spagnoli che pubblichiamo, ${d.es.noDebt} non devono niente: il loro debito ancora da restituire è zero.` });

  return out;
}

export function recordsFaqLd(lang: "es" | "it") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: domande(lang).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
