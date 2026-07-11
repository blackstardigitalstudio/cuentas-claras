// Listas de ciudades usadas para las páginas de comparación "X vs Y".
// Fuente única de verdad: la usan las rutas /comparar y /confronta, el sitemap
// y los enlaces internos de las fichas de ciudad. Así los enlaces nunca apuntan
// a una comparación que no existe.

export const CMP_ES = [
  "madrid", "barcelona", "valencia", "sevilla", "zaragoza", "malaga", "murcia", "palma",
  "las-palmas-de-gran-canaria", "bilbao", "alicante", "cordoba", "valladolid", "vigo",
  "gijon", "vitoria-gasteiz", "a-coruna", "granada", "elche-elx", "oviedo",
];

export const CMP_IT = [
  "roma", "milano", "napoli", "torino", "palermo", "genova", "bologna", "firenze", "bari", "catania",
  "venezia", "verona", "messina", "padova", "trieste", "brescia", "prato", "taranto", "modena", "parma",
];

// Devuelve, para una ciudad dada, los slugs de par ("a-vs-b") en el ORDEN CANÓNICO
// (índice en la lista) de todas sus comparaciones. Vacío si la ciudad no está en la lista.
export function comparePairsFor(list: string[], slug: string): string[] {
  const i = list.indexOf(slug);
  if (i < 0) return [];
  const out: string[] = [];
  for (let j = 0; j < list.length; j++) {
    if (j === i) continue;
    const [a, b] = i < j ? [list[i], list[j]] : [list[j], list[i]];
    out.push(`${a}-vs-${b}`);
  }
  return out;
}
