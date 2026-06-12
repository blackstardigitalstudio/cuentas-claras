// Avisa a los buscadores (IndexNow: Bing, Yandex, Seznam… y cada vez más Google)
// de que las páginas existen/cambiaron → indexación más rápida.
// Lee el sitemap del sitio en vivo y envía todas las URLs.

const SITE = process.env.SITE_URL || "https://cuentas-claras-3cg.pages.dev";
const KEY = "7f3c1e9a2b4d6f8091a2b3c4d5e6f7a8";

async function main() {
  const sm = await fetch(`${SITE}/sitemap.xml`, { headers: { "user-agent": "CuentasClarasIndexNow/1.0" } });
  if (!sm.ok) throw new Error(`sitemap ${sm.status}`);
  const xml = await sm.text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) throw new Error("sin URLs en el sitemap");

  const host = new URL(SITE).host;
  const body = { host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList };
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow: enviadas ${urlList.length} URLs de ${host} → HTTP ${r.status}`);
}
main().catch((e) => { console.error("IndexNow ERROR:", e.message); process.exit(1); });
