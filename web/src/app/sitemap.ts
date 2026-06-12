import type { MetadataRoute } from "next";
import { COUNTRIES, type CountryCode } from "@/lib/data";

export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cuentas-claras-3cg.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
  ];
  const seen = new Set<string>();
  for (const p of ["es", "it"] as CountryCode[]) {
    for (const r of Object.values(COUNTRIES[p].regions)) {
      const key = `${p}/${r.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      urls.push({
        url: `${SITE}/${p}/${r.slug}`,
        changeFrequency: "monthly",
        priority: r.isSample ? 0.4 : 0.7,
      });
    }
  }
  return urls;
}
