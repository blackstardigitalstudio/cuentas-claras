// Cloudflare Pages Function — noticias EN VIVO (se ejecuta en el edge en cada
// visita; sin rebuild). El sitio sigue siendo estático: esto solo refresca los
// titulares. Si falla, el front usa el news.json del build como respaldo.
//
// Mismas fuentes y consultas que el ETL (Google News RSS, que agrega medios
// REGISTRADOS; cada ítem enlaza a su fuente). Nada de fuentes anónimas.

const FEEDS = {
  es: { q: "gasto público ayuntamiento OR presupuesto municipal OR transparencia cuentas", hl: "es", gl: "ES", ceid: "ES:es" },
  it: { q: "spesa pubblica comune OR bilancio comunale OR Corte dei Conti enti locali", hl: "it", gl: "IT", ceid: "IT:it" },
};
const SCOOP_FEEDS = {
  es: { q: 'corrupción ayuntamiento OR "malversación de caudales públicos" OR "fraude fondos públicos" OR "alcalde detenido" OR "dinero público" juzgado', hl: "es", gl: "ES", ceid: "ES:es" },
  it: { q: 'corruzione comune OR "peculato fondi pubblici" OR "scandalo appalti" OR "arresto sindaco" OR "danno erariale" Corte dei Conti', hl: "it", gl: "IT", ceid: "IT:it" },
};

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'").replace(/&apos;/g, "'").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}
function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`));
  return m ? decodeEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : "";
}

async function fetchFeed(cfg, max) {
  const url =
    "https://news.google.com/rss/search?q=" + encodeURIComponent(cfg.q) +
    `&hl=${cfg.hl}&gl=${cfg.gl}&ceid=${cfg.ceid}`;
  const r = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; CuentasClarasNews/1.0)" },
    cf: { cacheTtl: 90, cacheEverything: true },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const xml = await r.text();
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  const out = [];
  for (const block of blocks) {
    let title = tag(block, "title");
    const source = tag(block, "source");
    const link = tag(block, "link");
    const pub = tag(block, "pubDate");
    if (!title || !link) continue;
    if (source && title.endsWith(" - " + source)) title = title.slice(0, -(source.length + 3)).trim();
    out.push({ title, source, url: link, date: pub ? new Date(pub).toISOString() : null });
    if (out.length >= max) break;
  }
  return out;
}

export async function onRequest() {
  const out = {};
  await Promise.all([
    ...Object.entries(FEEDS).map(async ([loc, cfg]) => {
      try { out[loc] = await fetchFeed(cfg, 8); } catch { /* respaldo en el front */ }
    }),
    ...Object.entries(SCOOP_FEEDS).map(async ([loc, cfg]) => {
      try { out[`${loc}_scoop`] = await fetchFeed(cfg, 12); } catch { /* respaldo en el front */ }
    }),
  ]);
  const ok = Object.keys(out).length > 0;
  return new Response(JSON.stringify(ok ? out : { error: "no data" }), {
    status: ok ? 200 : 502,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Cache de edge corto = "siempre fresco" sin martillear la fuente.
      "cache-control": "public, max-age=90, s-maxage=90",
    },
  });
}
