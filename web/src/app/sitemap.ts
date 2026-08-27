import type { MetadataRoute } from "next";
import { COUNTRIES, type CountryCode } from "@/lib/data";
import { CLUBS, CLUB_COMPARE_SLUGS, CLUB_PAGE_SLUGS } from "@/data/futbol";
import { CMP_ES, CMP_IT } from "@/data/compare-lists";
import { TAGLIE_IT, TAGLIE_ES } from "@/data/fasce-sindaci";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // El sitio usa trailingSlash:true → las URLs servidas terminan en "/".
  // El sitemap debe listar EXACTAMENTE esas (sin "/" haría un redirect 308 que
  // Google tiene que seguir; con "/" lo indexa directo).
  const lastModified = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/italia/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/ranking/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/sueldos-alcaldes/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/sueldos-politicos/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/sueldos-profesiones/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/deuda-municipios/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/deuda-nacional/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/fondos-europeos/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/spesa-comuni/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/gasto-por-habitante/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/en-que-se-gasta-el-dinero-publico/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/dove-vanno-i-soldi-pubblici/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/cuanto-cobra-un-concejal/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/quanto-guadagna-un-consigliere-comunale/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/records/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/comparar/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/confronta/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/bulos/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/futbol/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/futbol-mundial/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/deuda-clubes-futbol/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/debito-club-calcio/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/mundial-2026/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/champions-league/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/eurocopa/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/jugadores/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/escandalos/`, lastModified, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE}/sueldos-motogp/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    // Una página por cada tamaño de municipio: es como busca la gente de verdad
    // ("cuánto cobra un alcalde de un pueblo de 500 habitantes").
    ...TAGLIE_ES.map((t) => ({
      url: `${SITE}/sueldo-alcalde/${t}-habitantes/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    // Versioni ITALIANE delle pagine tematiche (URL e metadati in italiano, così
    // Google le mostra a chi cerca in italiano). Contenuto equivalente allo
    // spagnolo, collegate tra loro con hreflang.
    { url: `${SITE}/stipendi-politici/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/stipendi-sindaci/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/stipendi-motogp/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    // Una pagina per ogni dimensione di comune: e' cosi' che la gente cerca
    // davvero ("stipendio sindaco 10.000 abitanti"), non in modo generico.
    ...TAGLIE_IT.map((t) => ({
      url: `${SITE}/stipendio-sindaco/${t}-abitanti/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    { url: `${SITE}/calcio-mondiale/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/bufale-soldi-pubblici/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/scandali-soldi-pubblici/`, lastModified, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE}/tasse-benzina/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/spesa-sanita/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/gasto-sanidad/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/spesa-pensioni/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/gasto-pensiones/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/tasse-stipendio/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/impuestos-sueldo/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/stipendi-professioni/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/debito-pubblico/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/fondi-europei-pnrr/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/soldi-giocatori/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/premi-champions-league/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/premi-europei/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/premi-mondiali-2026/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/calcio/`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/record-soldi-pubblici/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
  ];
  // Páginas de comparación "X vs Y" (mismas listas que las rutas /comparar y /confronta).
  const addPairs = (list: string[], base: string) => {
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      urls.push({ url: `${SITE}/${base}/${list[i]}-vs-${list[j]}/`, lastModified, changeFrequency: "monthly", priority: 0.5 });
    }
  };
  addPairs(CMP_ES, "comparar");
  addPairs(CMP_IT, "confronta");

  // Comparaciones de clubes de fútbol (X vs Y).
  const clubs = CLUB_COMPARE_SLUGS.filter((s) => CLUBS[s]);
  for (let i = 0; i < clubs.length; i++) for (let j = i + 1; j < clubs.length; j++) {
    urls.push({ url: `${SITE}/futbol/${clubs[i]}-vs-${clubs[j]}/`, lastModified, changeFrequency: "monthly", priority: 0.5 });
  }
  // Fichas de un solo club.
  for (const s of CLUB_PAGE_SLUGS) urls.push({ url: `${SITE}/futbol/${s}/`, lastModified, changeFrequency: "monthly", priority: 0.6 });

  const seen = new Set<string>();
  for (const p of ["es", "it"] as CountryCode[]) {
    for (const r of Object.values(COUNTRIES[p].regions)) {
      const key = `${p}/${r.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      // Las fichas de ejemplo van con noindex → no las incluimos en el sitemap.
      if (r.isSample) continue;
      urls.push({
        url: `${SITE}/${p}/${r.slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }
  return urls;
}
