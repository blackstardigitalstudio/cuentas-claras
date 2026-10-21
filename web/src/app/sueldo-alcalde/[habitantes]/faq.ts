import { nEu } from "@/data/fasce-sindaci";

// Una sola fuente para las FAQ: la página las pinta y el JSON-LD las repite
// palabra por palabra (es lo que citan los buscadores con IA).
// Las preguntas van escritas como las teclea la gente en Google:
// "cuánto cobra un alcalde de un pueblo de 500 habitantes".
//
// Neto: NO damos cifra. El IRPF en España cambia según la comunidad autónoma
// y la situación de cada persona; un número exacto sería inventado (§0).
// Al mes: solo la división del tope anual, dicha como división.

const eur = (n: number) => `${nEu(n)} €`;

export function lugar(hab: number): string {
  return hab <= 5000 ? "un pueblo" : "un municipio";
}

export function faqTramo(p: {
  habitantes: number;
  tope: number | null;
  tramoLabel: string;
  real: { mediana: number; n: number } | null;
}): { q: string; a: string }[] {
  const hab = nEu(p.habitantes);
  const donde = lugar(p.habitantes);

  if (p.tope === null) {
    return [
      {
        q: `¿Cuánto cobra un alcalde de ${donde} de ${hab} habitantes?`,
        a: "Por ley no puede tener dedicación exclusiva: en municipios de menos de 1.000 habitantes no está permitida. Como mucho cobra una dedicación parcial, por las horas que dedica, o solo asistencias por cada pleno al que va. Muchos no cobran nada del ayuntamiento.",
      },
      {
        q: `¿El alcalde de un pueblo de ${hab} habitantes cobra sueldo?`,
        a: "Solo si el pleno le aprueba una dedicación parcial. Si no, únicamente recibe asistencias por acudir a los plenos. En España uno de cada tres alcaldes no cobra sueldo del ayuntamiento.",
      },
      {
        q: "¿Quién decide el sueldo del alcalde?",
        a: "El pleno del ayuntamiento, dentro de los límites que fija la Ley de Presupuestos Generales del Estado según los habitantes del municipio.",
      },
    ];
  }

  return [
    {
      q: `¿Cuánto cobra un alcalde de ${donde} de ${hab} habitantes?`,
      a: `Como máximo ${eur(p.tope)} brutos al año: es el tope que fija la ley para municipios ${p.tramoLabel}.` +
        (p.real
          ? ` En la práctica la mitad de los alcaldes de este tamaño cobra ${eur(p.real.mediana)} o menos, según las retribuciones oficiales de ${nEu(p.real.n)} municipios.`
          : ""),
    },
    {
      q: "¿Y cuánto es al mes?",
      a: `El tope es anual. Si el ayuntamiento lo reparte en 14 pagas, salen unos ${eur(p.tope / 14)} brutos por paga; si lo reparte en 12, unos ${eur(p.tope / 12)}. Es el máximo: muchos alcaldes cobran menos.`,
    },
    {
      q: "¿Y en neto, cuánto le queda?",
      a: "No damos una cifra neta porque sería inventarla. Al bruto se le quita el IRPF, que cambia según la comunidad autónoma y la situación personal de cada alcalde (hijos, otros ingresos). Dos alcaldes con el mismo bruto pueden cobrar netos distintos.",
    },
    {
      q: "¿Ese tope es lo que cobran de verdad?",
      a: "No. La ley solo fija el máximo; por debajo decide cada ayuntamiento en un pleno. Por eso dos municipios del mismo tamaño pueden pagar cantidades muy distintas, y algunos alcaldes no cobran nada.",
    },
    {
      q: "¿Todos los alcaldes cobran sueldo?",
      a: "No. El alcalde solo cobra si el pleno le aprueba una dedicación, exclusiva o parcial. Si no, únicamente percibe asistencias por acudir a los plenos. En España uno de cada tres alcaldes no cobra sueldo del ayuntamiento.",
    },
    {
      q: "¿Quién decide el sueldo del alcalde?",
      a: "El pleno del ayuntamiento, dentro del tope máximo que fija la Ley de Presupuestos Generales del Estado según los habitantes del municipio.",
    },
  ];
}
