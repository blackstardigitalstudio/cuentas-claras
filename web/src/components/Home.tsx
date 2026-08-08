"use client";

import Link from "next/link";
import Explorer from "@/components/Explorer";
import News from "@/components/News";
import Scoop from "@/components/Scoop";
import SiteNav from "@/components/SiteNav";
import SiteSearch from "@/components/SiteSearch";
import { CLUBS, CLUB_PAGE_SLUGS } from "@/data/futbol";
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

      {/* Hero: título corto + buscador (única CTA primaria). Sin muros de texto. */}
      <section className="text-center pt-10 md:pt-14 pb-8">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-cyan/80 mb-4">{m.hero.eyebrow}</p>
        <h1 className="title-glow text-4xl md:text-6xl font-bold leading-[1.05] inline-block">
          {m.hero.titleA}
          <span className="neon-text">{m.hero.highlight}</span>
          {m.hero.titleB}
        </h1>

        <div className="mt-7">
          <p className="text-sm font-semibold text-fg/90 mb-2">
            👇 {locale === "it" ? "Scrivi la tua città e premi «Cerca»" : "Escribe tu ciudad y pulsa «Buscar»"}
          </p>
          <SiteSearch />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted">{locale === "it" ? "Oppure:" : "O prueba:"}</span>
            {[
              { href: "/es/madrid/", label: "Madrid" },
              { href: "/es/barcelona/", label: "Barcelona" },
              { href: "/it/roma/", label: "Roma" },
              { href: "/it/milano/", label: "Milano" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--panel-border)] text-muted hover:text-fg hover:border-cyan transition">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fútbol — tarjeta destacada, en primer plano */}
      <Reveal>
        <Link href="/futbol/" className="block mt-8 group relative overflow-hidden rounded-2xl border border-[var(--panel-border)] aspect-[16/10] sm:aspect-[21/8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/spain-stadium.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070f] via-[#05070f]/75 to-[#05070f]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-transparent to-transparent" />
          <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-green via-cyan to-violet" />
          <div className="absolute inset-0 flex flex-col justify-center p-5 sm:p-8 max-w-[88%]">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-green mb-2">
              ⚽ {locale === "it" ? "In primo piano" : "Destacado"}
            </span>
            <h2 className="font-black uppercase leading-[0.92] tracking-tight text-2xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]">
              {locale === "it" ? "I soldi del " : "El dinero del "}
              <span style={{ background: "linear-gradient(90deg,#34d399,#22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{locale === "it" ? "calcio" : "fútbol"}</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-2 max-w-lg">
              {locale === "it"
                ? "Ricavi, ingaggi, tetto salariale e debiti dei club — LaLiga, Serie A e il calcio mondiale. Solo dati ufficiali."
                : "Ingresos, salarios, límite salarial y deuda de los clubes — LaLiga, Serie A y el fútbol mundial. Solo datos oficiales."}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">
              {locale === "it" ? "Scopri" : "Descubrir"} <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </Link>
      </Reveal>

      {/* Rejilla de accesos: tarjetas clicables, poco texto, fácil de escanear. */}
      <section className="mt-8 mb-12">
        <p className="text-xs uppercase tracking-widest text-cyan/70 mb-3">{locale === "it" ? "Esplora" : "Explora"}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: locale === "it" ? "/stipendi-sindaci/" : "/sueldos-alcaldes/", emoji: "🏛️", accent: "#a5b4fc", es: "Sueldos de alcaldes", it: "Stipendi dei sindaci", subEs: "quién cobra más", subIt: "quanto prende il tuo" },
            { href: locale === "it" ? "/stipendi-politici/" : "/sueldos-politicos/", emoji: "🏛️", accent: "#818cf8", es: "Sueldos de políticos", it: "Stipendi dei politici", subEs: "presidente, ministros…", subIt: "presidente, ministri…" },
            { href: locale === "it" ? "/stipendi-professioni/" : "/sueldos-profesiones/", emoji: "💼", accent: "#22d3ee", es: "¿Cuánto gana un médico?", it: "Quanto guadagna un medico?", subEs: "médico, profe, policía…", subIt: "medico, prof, poliziotto…" },
            { href: "/deuda-municipios/", emoji: "🏦", accent: "#fdba74", es: "Deuda municipal", it: "Debito dei comuni", subEs: "quién debe más", subIt: "chi deve di più" },
            { href: locale === "it" ? "/debito-pubblico/" : "/deuda-nacional/", emoji: "🏛️", accent: "#f472b6", es: "¿Cuánto debe España?", it: "Quanto deve lo Stato?", subEs: "la deuda del país", subIt: "il debito del Paese" },
            { href: locale === "it" ? "/fondi-europei-pnrr/" : "/fondos-europeos/", emoji: "🇪🇺", accent: "#60a5fa", es: "El dinero de Europa", it: "I soldi dell'Europa", subEs: "Next Generation / fondos", subIt: "PNRR / Next Generation" },
            { href: "/ranking/", emoji: "📊", accent: "#22d3ee", es: "Ranking de gasto", it: "Classifica di spesa", subEs: "quién gasta más", subIt: "chi spende di più" },
            { href: locale === "it" ? "/record-soldi-pubblici/" : "/records/", emoji: "🏆", accent: "#34d399", es: "Récords", it: "Record", subEs: "los extremos", subIt: "gli estremi" },
            { href: locale === "it" ? "/confronta/" : "/comparar/", emoji: "⚖️", accent: "#c084fc", es: "Comparar", it: "Confronta", subEs: "ciudad vs ciudad", subIt: "città vs città" },
            { href: "/bulos/", emoji: "📰", accent: "#f472b6", es: "Bulos", it: "Bufale", subEs: "verificados", subIt: "smontate" },
            { href: locale === "it" ? "/calcio/" : "/futbol/", emoji: "⚽", accent: "#4ade80", es: "Fútbol", it: "Calcio", subEs: "clubes y ligas", subIt: "club e leghe" },
            { href: locale === "it" ? "/soldi-giocatori/" : "/jugadores/", emoji: "💸", accent: "#38bdf8", es: "Jugadores", it: "Giocatori", subEs: "fichajes y sueldos", subIt: "trasferimenti" },
          ].map((c, i) => (
            <Reveal key={c.href} delay={(i % 4) * 0.06}>
              <Link
                href={c.href}
                className="glass h-full p-4 flex flex-col gap-1 group relative overflow-hidden hover:-translate-y-0.5 transition duration-200 cursor-pointer"
                style={{ borderColor: `${c.accent}33` }}
              >
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }} />
                <span className="text-2xl leading-none" aria-hidden="true">{c.emoji}</span>
                <span className="font-semibold text-sm mt-1 group-hover:text-fg transition" style={{ color: c.accent }}>{locale === "it" ? c.it : c.es}</span>
                <span className="text-[11px] text-muted">{locale === "it" ? c.subIt : c.subEs}</span>
              </Link>
            </Reveal>
          ))}
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
              { Icon: IconCity, value: <CountUp value={realCities} kind="int" />, label: m.impact.cities, accent: "#22d3ee" },
              { Icon: IconLayers, value: "5", label: m.impact.levels, accent: "#818cf8" },
              { Icon: IconRefresh, value: <CountUp value={mappedProvinces} kind="int" />, label: m.impact.provinces, accent: "#f472b6" },
            ].map((s, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border bg-[rgba(120,160,255,0.04)] px-2 py-4 flex flex-col items-center gap-1.5"
                style={{ borderColor: `${s.accent}40` }}
              >
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }} />
                <s.Icon className="w-5 h-5" style={{ color: s.accent, filter: `drop-shadow(0 0 6px ${s.accent}99)` }} aria-hidden="true" />
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

      {/* Más temas buscados: enlaces a guías y páginas pilar (evita huérfanas + SEO) */}
      <section className="mt-8">
        <p className="text-xs uppercase tracking-widest text-cyan/70 mb-3">
          {locale === "it" ? "Altri temi cercati" : "Más temas buscados"}
        </p>
        <div className="flex flex-wrap gap-2">
          {(locale === "it"
            ? [
                { href: "/premi-mondiali-2026/", t: "🏆 I premi dei Mondiali 2026" },
                { href: "/premi-champions-league/", t: "🏆 I premi della Champions" },
                { href: "/premi-europei/", t: "🏅 I premi degli Europei" },
                { href: "/soldi-giocatori/", t: "⚽ I soldi dei giocatori" },
                { href: "/record-soldi-pubblici/", t: "🏆 I record dei soldi pubblici" },
                { href: "/stipendi-politici/", t: "🏛️ Quanto guadagna un parlamentare" },
                { href: "/debito-pubblico/", t: "🏦 Il debito pubblico italiano" },
                { href: "/fondi-europei-pnrr/", t: "🇪🇺 PNRR: dove sono finiti i soldi" },
                { href: "/tasse-benzina/", t: "⛽ Quante tasse paghi sulla benzina" },
                { href: "/stipendi-sindaci/", t: "🏛️ Quanto guadagna il tuo sindaco" },
                { href: "/stipendi-motogp/", t: "🏍️ Quanto guadagna un pilota MotoGP" },
                { href: "/spesa-comuni/", t: "La spesa dei comuni" },
                { href: "/ranking/", t: "Classifica di spesa" },
                { href: "/dove-vanno-i-soldi-pubblici/", t: "Dove vanno i soldi pubblici" },
                { href: "/quanto-guadagna-un-consigliere-comunale/", t: "Quanto guadagna un consigliere" },
                { href: "/confronta/", t: "Confronta due comuni" },
                { href: "/confronta/roma-vs-milano/", t: "Roma vs Milano" },
                { href: "/confronta/milano-vs-napoli/", t: "Milano vs Napoli" },
                { href: "/futbol/inter-vs-juventus/", t: "Inter vs Juventus" },
              ]
            : [
                { href: "/mundial-2026/", t: "🏆 Los premios del Mundial 2026" },
                { href: "/champions-league/", t: "🏆 Los premios de la Champions" },
                { href: "/eurocopa/", t: "🏅 Los premios de la Eurocopa" },
                { href: "/jugadores/", t: "⚽ El dinero de los jugadores" },
                { href: "/records/", t: "🏆 Los récords del dinero público" },
                { href: "/gasto-por-habitante/", t: "Gasto por habitante" },
                { href: "/ranking/", t: "Ranking de gasto" },
                { href: "/en-que-se-gasta-el-dinero-publico/", t: "¿En qué se gasta el dinero público?" },
                { href: "/cuanto-cobra-un-concejal/", t: "¿Cuánto cobra un concejal?" },
                { href: "/comparar/", t: "Comparar dos ciudades" },
                { href: "/comparar/madrid-vs-barcelona/", t: "Madrid vs Barcelona" },
                { href: "/comparar/valencia-vs-sevilla/", t: "Valencia vs Sevilla" },
                { href: "/futbol/real-madrid-vs-fc-barcelona/", t: "Real Madrid vs Barça" },
              ]
          ).map((c) => (
            <Link key={c.href} href={c.href} className="px-3.5 py-1.5 rounded-full text-sm border border-[var(--panel-border)] text-muted hover:text-fg hover:border-cyan transition">
              {c.t}
            </Link>
          ))}
        </div>
      </section>

      {/* Sección equipos / squadre: las cuentas de cada club */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">{locale === "it" ? "⚽ Le squadre" : "⚽ Los equipos"}</h2>
          <Link href="/futbol/" className="shrink-0 text-sm font-medium text-cyan hover:text-fg transition whitespace-nowrap">
            {locale === "it" ? "Tutto il calcio →" : "Todo el fútbol →"}
          </Link>
        </div>
        <Link href="/futbol-mundial/" className="glass p-4 mb-4 flex items-center justify-between gap-3 group hover:border-cyan transition">
          <span>
            <span className="block font-semibold">🌍 {locale === "it" ? "I soldi del calcio mondiale" : "El dinero del fútbol mundial"}</span>
            <span className="block text-xs text-muted">{locale === "it" ? "Quale lega e quale club incassano di più al mondo" : "Qué liga y qué club ingresan más del mundo"}</span>
          </span>
          <span className="text-cyan text-lg shrink-0 transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
        {(["laliga", "seriea"] as const).map((lg) => {
          const clubs = CLUB_PAGE_SLUGS.filter((s) => CLUBS[s].league === lg);
          if (!clubs.length) return null;
          return (
            <div key={lg} className="mb-4">
              <h3 className="text-xs uppercase tracking-widest text-cyan/70 mb-2">{lg === "laliga" ? "🇪🇸 LaLiga" : "🇮🇹 Serie A"}</h3>
              <div className="flex flex-wrap gap-2">
                {clubs.map((s) => (
                  <Link key={s} href={`/futbol/${s}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] text-muted hover:text-fg hover:border-cyan transition">
                    {CLUBS[s].name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

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

      {/* Metodología y fuentes (confianza + SEO). Plegado por defecto: menos muro de texto. */}
      <details className="mt-16 glass p-6 md:p-7">
        <summary className="text-xl md:text-2xl font-semibold cursor-pointer marker:text-cyan">
          {locale === "it" ? "Sui dati: fonti, verità e aggiornamenti" : "Sobre los datos: fuentes, veracidad y actualizaciones"}
        </summary>
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
      </details>

      {/* FAQ (preguntas que la gente busca) + datos estructurados FAQPage */}
      {(() => {
        const faqs =
          locale === "it"
            ? [
                { q: "Dove vanno i soldi pubblici del mio comune?", a: "Ogni comune incassa (imposte, tasse, trasferimenti) e spende in aree come servizi di base, sociale, istruzione o amministrazione. Su Cuentas Claras cerchi la tua città sulla mappa e vedi il dettaglio completo, fino al singolo programma." },
                { q: "Da dove arrivano i dati e sono affidabili?", a: "Da fonti ufficiali: Ministero delle Finanze spagnolo (via Gobierto/INE) e portali open data comunali. Verifichiamo che entrate e spese quadrino e non inventiamo mai cifre." },
                { q: "Ogni quanto si aggiornano?", a: "I bilanci escono per periodi; il sito si rigenera automaticamente e le notizie si aggiornano ogni poche ore." },
                { q: "È gratis?", a: "Sì, totalmente gratis e senza registrazione." },
                { q: "Quali città posso consultare?", a: "Le 50 province spagnole e città italiane come Milano e Bologna, e continuiamo ad aggiungerne." },
              ]
            : [
                { q: "¿A dónde va el dinero público de mi ciudad?", a: "Cada ayuntamiento recauda (impuestos, tasas, transferencias) y gasta en áreas como servicios básicos, social, educación o administración. En Cuentas Claras buscas tu ciudad en el mapa y ves el desglose completo, hasta el detalle por programa." },
                { q: "¿De dónde salen los datos y son fiables?", a: "De fuentes oficiales: Ministerio de Hacienda (vía Gobierto/INE) y portales de datos abiertos municipales. Verificamos que ingresos y gastos cuadren y nunca inventamos cifras." },
                { q: "¿Cada cuánto se actualizan?", a: "Los presupuestos se publican por periodos; el sitio se regenera automáticamente y las noticias se refrescan cada pocas horas." },
                { q: "¿Es gratis?", a: "Sí, totalmente gratis y sin registro." },
                { q: "¿Qué ciudades puedo consultar?", a: "Las 50 provincias españolas y ciudades italianas como Milán y Bolonia, y seguimos añadiendo." },
              ];
        const faqLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        };
        return (
          <section className="mt-16">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <h2 className="text-xl md:text-2xl font-semibold">{locale === "it" ? "Domande frequenti" : "Preguntas frecuentes"}</h2>
            <div className="mt-5 space-y-2.5 max-w-3xl">
              {faqs.map((f, i) => (
                <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
                  <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
                  <p className="text-sm text-muted mt-2">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Directorio de ciudades (enlaces internos para SEO + navegación) */}
      <section className="mt-16">
        <h2 className="text-xl md:text-2xl font-semibold">{locale === "it" ? "Tutte le città" : "Todas las ciudades"}</h2>
        <p className="text-sm text-muted mt-1 mb-5">
          {locale === "it"
            ? "Apri la pagina di ogni città per il dettaglio di entrate e spese."
            : "Abre la página de cada ciudad para el detalle de ingresos y gastos."}
        </p>
        <div className="space-y-4">
          {((locale === "it" ? ["it", "es"] : ["es", "it"]) as CountryCode[]).map((p) => (
            <div key={p}>
              <h3 className="text-xs uppercase tracking-widest text-cyan/80 mb-2">
                {p === "es" ? (
                  "🇪🇸 España"
                ) : (
                  <Link href="/italia" className="hover:text-fg transition">
                    🇮🇹 Italia →
                  </Link>
                )}
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
