import news from "@/data/news.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

type Item = { title: string; source: string; url: string; date: string };

// Escapa i caratteri che romperebbero l'XML.
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// Raccoglie tutte le notizie di una lingua (tutti i filoni), le deduplica per URL
// e le ordina dalla più recente.
function itemsFor(lang: "es" | "it"): Item[] {
  const all: Item[] = [];
  const seen = new Set<string>();
  for (const [key, list] of Object.entries(news as Record<string, Item[]>)) {
    if (!key.startsWith(lang)) continue;
    if (!Array.isArray(list)) continue;
    for (const n of list) {
      if (!n?.url || seen.has(n.url)) continue;
      seen.add(n.url);
      all.push(n);
    }
  }
  return all
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50);
}

/** Feed RSS delle notizie sui soldi pubblici, per lingua. */
export function buildFeed(lang: "es" | "it"): string {
  const it = lang === "it";
  const title = it ? "Cuentas Claras — soldi pubblici, notizie" : "Cuentas Claras — dinero público, noticias";
  const desc = it
    ? "Notizie verificate su bilanci, sprechi e stipendi pubblici in Italia e Spagna. Ogni notizia rimanda alla testata originale."
    : "Noticias verificadas sobre presupuestos, despilfarro y sueldos públicos en España e Italia. Cada noticia enlaza al medio original.";
  const page = `${SITE}/escandalos/`;
  const self = `${SITE}/${it ? "rss-it.xml" : "rss.xml"}`;
  const items = itemsFor(lang);
  const built = items[0]?.date ? new Date(items[0].date).toUTCString() : undefined;

  const body = items
    .map((n) => {
      const d = new Date(n.date);
      const pub = isNaN(d.getTime()) ? "" : `\n      <pubDate>${d.toUTCString()}</pubDate>`;
      return `    <item>
      <title>${esc(n.title)}</title>
      <link>${esc(n.url)}</link>
      <guid isPermaLink="true">${esc(n.url)}</guid>
      <source url="${esc(page)}">${esc(n.source)}</source>${pub}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(title)}</title>
    <link>${esc(page)}</link>
    <description>${esc(desc)}</description>
    <language>${it ? "it-IT" : "es-ES"}</language>${built ? `\n    <lastBuildDate>${built}</lastBuildDate>` : ""}
    <atom:link href="${esc(self)}" rel="self" type="application/rss+xml" />
${body}
  </channel>
</rss>
`;
}
