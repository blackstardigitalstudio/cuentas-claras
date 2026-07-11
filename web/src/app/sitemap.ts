import type { MetadataRoute } from "next";
import { COUNTRIES, type CountryCode } from "@/lib/data";
import { CLUBS, CLUB_COMPARE_SLUGS } from "@/data/futbol";
import { CMP_ES, CMP_IT } from "@/data/compare-lists";

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
    { url: `${SITE}/deuda-municipios/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/spesa-comuni/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/gasto-por-habitante/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/en-que-se-gasta-el-dinero-publico/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/dove-vanno-i-soldi-pubblici/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/cuanto-cobra-un-concejal/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/quanto-guadagna-un-consigliere-comunale/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/bulos/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/futbol/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/escandalos/`, lastModified, changeFrequency: "hourly", priority: 0.8 },
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
