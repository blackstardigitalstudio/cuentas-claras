"use client";

import Link from "next/link";
import Explorer from "@/components/Explorer";
import News from "@/components/News";
import Scoop from "@/components/Scoop";
import SiteNav from "@/components/SiteNav";
import { CountUp, Reveal } from "@/components/Motion";
import { useLocale } from "@/i18n/LocaleProvider";
import { DATA_SOURCE_URL, COUNTRIES, type CountryCode } from "@/lib/data";

// Cifra de impacto, real: gasto público total que el sitio tiene desglosado
// (suma de las ciudades con datos reales de España e Italia).
const realGastos = (["es", "it"] as CountryCode[]).reduce(
  (sum, p) => sum + COUNTRIES[p].realNames.reduce((s, n) => s + (COUNTRIES[p].regions[n]?.gastos || 0), 0),
  0
);
const realCities = COUNTRIES.es.realNames.length + COUNTRIES.it.realNames.length;
const mappedProvinces = COUNTRIES.es.list.length + COUNTRIES.it.list.length;

// Iconos en línea (estilo Lucide, sin emoji) para la franja de impacto.
const IconCity = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="3" x2="21" y1="22" y2="22" /><line x1="6" x2="6" y1="18" y2="11" /><line x1="10" x2="10" y1="18" y2="11" />
    <line x1="14" x2="14" y1="18" y2="11" /><line x1="18" x2="18" y1="18" y2="11" /><polygon points="12 2 20 7 4 7" />
  </svg>
);
const IconLayers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </svg>
);
const IconRefresh = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M8 16H3v5" />
  </svg>
);

export default function Home() {
  const { locale, m } = useLocale();
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />

      {/* Aviso de integridad de datos */}
      <div className="mt-5 flex justify-center">
        <div className="text-center text-[12px] text-muted bg-[rgba(120,160,255,0.06)] border border-[var(--panel-border)] rounded-full px-4 py-1.5 inline-flex items-center gap-2">
          <span className="text-green">● {m.banner.real}</span>
          <span className="opacity-50">·</span>
          <span className="text-amber/90">{m.banner.sample}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="text-center pt-10 md:pt-16 pb-10">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-cyan/80 mb-4">{m.hero.eyebrow}</p>
        <h1 className="title-glow text-4xl md:text-6xl font-bold leading-[1.05] inline-block">
          {m.hero.titleA}
          <span className="neon-text">{m.hero.highlight}</span>
          {m.hero.titleB}
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted max-w-2xl mx-auto">{m.hero.subtitle}</p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <a
            href="#explorar"
            className="px-6 py-3 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition shadow-[0_0_30px_-6px_var(--cyan)]"
          >
            {m.hero.cta1}
          </a>
          <a
            href={DATA_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-medium border border-[var(--panel-border)] text-muted hover:text-fg transition"
          >
            {m.hero.cta2}
          </a>
        </div>
      </section>

      {/* Franja de impacto: una cifra grande y real (gasto público desglosado) */}
      <Reveal>
        <section className="glass relative overflow-hidden px-5 py-8 md:px-10 md:py-10 mb-12 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] max-w-full rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_60%)]" />
          <p className="relative text-[11px] md:text-xs uppercase tracking-[0.25em] text-muted">{m.impact.lead}</p>
          <p className="relative mt-2 tabular font-bold neon-text leading-none text-5xl sm:text-6xl md:text-7xl">
            <CountUp value={realGastos} kind="compact" />
          </p>
          <p className="relative mt-2 text-sm md:text-base text-muted">{m.impact.analyzed}</p>

          <div className="relative mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {[
              { Icon: IconCity, value: <CountUp value={realCities} kind="int" />, label: m.impact.cities },
              { Icon: IconLayers, value: "5", label: m.impact.levels },
              { Icon: IconRefresh, value: <CountUp value={mappedProvinces} kind="int" />, label: m.impact.provinces },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-[var(--panel-border)] bg-[rgba(120,160,255,0.04)] px-2 py-4 flex flex-col items-center gap-1.5">
                <s.Icon className="w-5 h-5 text-cyan/90" aria-hidden="true" />
                <span className="tabular text-2xl md:text-3xl font-semibold text-fg leading-none">{s.value}</span>
                <span className="text-[11px] md:text-xs text-muted leading-tight">{s.label}</span>
              </div>
            ))}
          </div>

          <p className="relative mt-6 inline-flex items-center gap-2 text-[11px] text-green">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
            </span>
            {m.impact.weekly}
          </p>
        </section>
      </Reveal>

      {/* Explorador */}
      <Explorer />

      {/* Cómo funciona */}
      <section className="mt-16 grid md:grid-cols-3 gap-4">
        {[
          { t: m.how.t1, d: m.how.d1 },
          { t: m.how.t2, d: m.how.d2 },
          { t: m.how.t3, d: m.how.d3 },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 0.1}>
            <div className="glass p-5 h-full">
              <h3 className="font-semibold mb-2">{c.t}</h3>
              <p className="text-sm text-muted">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Rincón scoop: escándalos (adelanto + enlace a la página dedicada) */}
      <Scoop />

      {/* Noticias */}
      <News />

      {/* Metodología y fuentes (confianza + SEO) */}
      <section className="mt-16 glass p-6 md:p-7">
        <h2 className="text-xl md:text-2xl font-semibold">
          {locale === "it" ? "Sui dati: fonti, verità e aggiornamenti" : "Sobre los datos: fuentes, veracidad y actualizaciones"}
        </h2>
        {locale === "it" ? (
          <div className="text-sm text-muted mt-3 space-y-3 max-w-3xl">
            <p>
              <strong className="text-fg">Cuentas Claras</strong> mostra entrate e spese reali dei comuni di{" "}
              <strong className="text-fg">Spagna</strong> e <strong className="text-fg">Italia</strong> con dati ufficiali, in
              linguaggio chiaro. Copre tutte le 50 province spagnole e città italiane come Milano e Bologna, con il dettaglio
              della spesa pubblica per capitolo e per area/missione.
            </p>
            <p>
              <strong className="text-fg">Fonti ufficiali:</strong> Ministero delle Finanze spagnolo (via Gobierto/INE), portali
              open data dei comuni (Barcellona, València, Vitoria, Comune di Milano, Comune di Bologna) e bilanci ufficiali. Ogni
              città indica la fonte e l'anno.
            </p>
            <p>
              <strong className="text-fg">Veri e verificati:</strong> per ogni città controlliamo la quadratura (entrate ≈ uscite)
              e non pubblichiamo mai cifre non verificabili. <strong className="text-fg">Sempre aggiornati:</strong> il sito si
              rigenera automaticamente ogni settimana con gli ultimi dati pubblicati. Non è "tempo reale" (i bilanci escono per
              periodi), ma è sempre l'ultima pubblicazione ufficiale.
            </p>
          </div>
        ) : (
          <div className="text-sm text-muted mt-3 space-y-3 max-w-3xl">
            <p>
              <strong className="text-fg">Cuentas Claras</strong> muestra los ingresos y gastos reales de los ayuntamientos de{" "}
              <strong className="text-fg">España</strong> e <strong className="text-fg">Italia</strong> con datos oficiales, en
              lenguaje claro. Cubre las 50 provincias españolas y ciudades italianas como Milán y Bolonia, con el desglose del
              gasto público por capítulo y por área/misión.
            </p>
            <p>
              <strong className="text-fg">Fuentes oficiales:</strong> Ministerio de Hacienda (vía Gobierto/INE), portales de datos
              abiertos de los ayuntamientos (Barcelona, València, Vitoria-Gasteiz, Comune di Milano, Comune di Bologna) y
              presupuestos oficiales. Cada ciudad indica su fuente y año.
            </p>
            <p>
              <strong className="text-fg">Veraces y verificados:</strong> en cada ciudad comprobamos el cuadre (ingresos ≈ gastos)
              y nunca publicamos cifras no verificables. <strong className="text-fg">Siempre actualizados:</strong> el sitio se
              regenera automáticamente cada semana con los últimos datos publicados. No es "tiempo real" (los presupuestos se
              publican por periodos), pero siempre es la última publicación oficial.
            </p>
          </div>
        )}
      </section>

      {/* Directorio de ciudades (enlaces internos para SEO + navegación) */}
      <section className="mt-16">
        <h2 className="text-xl md:text-2xl font-semibold">{locale === "it" ? "Tutte le città" : "Todas las ciudades"}</h2>
        <p className="text-sm text-muted mt-1 mb-5">
          {locale === "it"
            ? "Apri la pagina di ogni città per il dettaglio di entrate e spese."
            : "Abre la página de cada ciudad para el detalle de ingresos y gastos."}
        </p>
        <div className="space-y-4">
          {(["es", "it"] as CountryCode[]).map((p) => (
            <div key={p}>
              <h3 className="text-xs uppercase tracking-widest text-cyan/80 mb-2">
                {p === "es" ? "🇪🇸 España" : "🇮🇹 Italia"}
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
                {Object.values(COUNTRIES[p].regions)
                  .filter((r) => !r.isSample)
                  .sort((a, b) => a.name.localeCompare(b.name, "es"))
                  .map((r) => (
                    <Link key={r.slug} href={`/${p}/${r.slug}`} className="text-cyan/75 hover:text-fg transition">
                      {r.name}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            <span className="neon-text font-semibold">Cuentas Claras</span> · {m.footer.data}{" "}
            <a href={DATA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
              Ministerio de Hacienda
            </a>
          </p>
          <p>{m.footer.tagline} · Made in Italy 🇮🇹</p>
        </div>
        {/* Disclaimer legal (texto pequeño) */}
        <p className="mt-6 text-[11px] leading-relaxed text-muted/70 max-w-4xl">{m.footer.disclaimer}</p>
      </footer>
    </main>
  );
}
