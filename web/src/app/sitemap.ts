import type { MetadataRoute } from "next";
import { COUNTRIES, type CountryCode } from "@/lib/data";

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
    { url: `${SITE}/escandalos/`, lastModified, changeFrequency: "hourly", priority: 0.8 },
  ];
  const seen = new Set<string>();
  for (const p of ["es", "it"] as CountryCode[]) {
    for (const r of Object.values(COUNTRIES[p].regions)) {
      const key = `${p}/${r.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      urls.push({
        url: `${SITE}/${p}/${r.slug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: r.isSample ? 0.4 : 0.7,
      });
    }
  }
  return urls;
}
