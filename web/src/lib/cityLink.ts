import { COUNTRIES, type CountryCode } from "./data";

// Índice de ciudades reales (las que tienen página con desglose) por país.
// Lo usamos para enlazar un titular a la ficha de su ciudad ("clicca e torni
// al desglose total"). Se prueban los nombres más largos primero.
type Entry = { name: string; slug: string; pais: CountryCode };

const ENTRIES: Entry[] = (["es", "it"] as CountryCode[])
  .flatMap((p) =>
    Object.values(COUNTRIES[p].regions)
      .filter((r) => !r.isSample)
      .map((r) => ({ name: r.name, slug: r.slug, pais: p }))
  )
  .sort((a, b) => b.name.length - a.name.length);

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Devuelve la ciudad mencionada en el titular (con frontera de palabra para no
// confundir, p. ej., "León" dentro de "Napoleón"), o null.
export function cityLink(title: string): Entry | null {
  const t = norm(title);
  for (const e of ENTRIES) {
    const n = norm(e.name);
    if (n.length < 4) continue;
    const re = new RegExp(`(^|[^a-z0-9])${escapeRe(n)}([^a-z0-9]|$)`);
    if (re.test(t)) return e;
  }
  return null;
}
