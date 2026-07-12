import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRIES, type CountryCode, type RegionData } from "@/lib/data";
import { formatCompact, formatEuro, formatPct } from "@/lib/format";
import { CMP_ES, CMP_IT, comparePairsFor } from "@/data/compare-lists";
import SimpleExplainer from "@/components/SimpleExplainer";
import ShareBar from "@/components/ShareBar";
import cityOg from "@/data/city-og.json";

const CITY_OG = new Set(cityOg as string[]);

const PAISES: CountryCode[] = ["es", "it"];
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export function generateStaticParams() {
  const seen = new Set<string>();
  const out: { pais: string; ciudad: string }[] = [];
  for (const p of PAISES) {
    for (const r of Object.values(COUNTRIES[p].regions)) {
      const key = `${p}/${r.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ pais: p, ciudad: r.slug });
    }
  }
  return out;
}

function find(pais: string, ciudad: string): { country: CountryCode; r: RegionData } | null {
  if (pais !== "es" && pais !== "it") return null;
  // Puede haber dos regiones con el mismo slug (p.ej. provincia "Roma" de muestra
  // y la ciudad real "roma" con datos oficiales): gana SIEMPRE el dato real.
  const matches = Object.values(COUNTRIES[pais].regions).filter((x) => x.slug === ciudad);
  const r = matches.find((x) => !x.isSample) || matches[0];
  return r ? { country: pais, r } : null;
}

type Props = { params: Promise<{ pais: string; ciudad: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pais, ciudad } = await params;
  const f = find(pais, ciudad);
  if (!f) return {};
  const { r } = f;
  const es = pais === "es";
  const title = es
    ? `Presupuesto de ${r.name} ${r.year}: ingresos y gastos`
    : `Bilancio di ${r.name} ${r.year}: entrate e spese`;
  const extra = es
    ? `${r.mayorSalary ? ` Sueldo del alcalde: ${formatCompact(r.mayorSalary.amount)}/año.` : ""}${r.debt ? ` Deuda viva: ${r.debt.amount > 0 ? formatCompact(r.debt.amount) : "sin deuda"}.` : ""}`
    : `${r.mayorSalary ? ` Stipendio del sindaco: ${formatCompact(r.mayorSalary.amount)}/anno.` : ""}${r.debt ? ` Debito: ${r.debt.amount > 0 ? formatCompact(r.debt.amount) : "nessuno"}.` : ""}`;
  const description = (es
    ? `Ingresos ${formatCompact(r.ingresos)} y gastos ${formatCompact(r.gastos)} de ${r.name} en ${r.year}. Desglose detallado por capítulo y por área del gasto público. Datos ${r.isSample ? "de ejemplo" : "oficiales"}.`
    : `Entrate ${formatCompact(r.ingresos)} e spese ${formatCompact(r.gastos)} di ${r.name} nel ${r.year}. Dettaglio per capitolo e per missione della spesa pubblica. Dati ${r.isSample ? "di esempio" : "ufficiali"}.`) + extra;
  return {
    title,
    description,
    alternates: { canonical: `/${pais}/${ciudad}` },
    openGraph: {
      title,
      description,
      type: "article",
      locale: es ? "es_ES" : "it_IT",
      // Tarjeta social propia de la ciudad cuando existe (ciudades más buscadas).
      ...(CITY_OG.has(ciudad) ? { images: [{ url: `/og/city/${ciudad}.png`, width: 1200, height: 630, alt: title }] } : {}),
    },
    ...(CITY_OG.has(ciudad) ? { twitter: { card: "summary_large_image" as const, images: [`/og/city/${ciudad}.png`] } } : {}),
    // Las fichas con cifras de ejemplo no se indexan (evita contenido "thin"/placeholder
    // en Google), pero sí se siguen sus enlaces salientes.
    ...(r.isSample ? { robots: { index: false, follow: true } } : {}),
  };
}

function Row({ c, total }: { c: { label: string; color: string; amount: number; children?: unknown[] }; total: number }) {
  return (
    <li className="py-1.5 border-b border-[var(--panel-border)]/50">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
          {c.label}
        </span>
        <span className="tabular text-muted">
          {formatEuro(c.amount)} <span className="text-cyan/70">· {formatPct(c.amount / total)}</span>
        </span>
      </div>
    </li>
  );
}

export default async function CityPage({ params }: Props) {
  const { pais, ciudad } = await params;
  const f = find(pais, ciudad);
  if (!f) notFound();
  const { r } = f;
  const es = pais === "es";
  const others = Object.values(COUNTRIES[pais as CountryCode].regions)
    .filter((x) => x.slug !== r.slug && !x.isSample)
    .sort((a, b) => b.gastos - a.gastos)
    .slice(0, 24);

  // Enlaces a las páginas de comparación "X vs Y" en las que participa esta ciudad
  // (solo si está en la lista de comparaciones). Fija los enlaces internos hacia
  // esas páginas, que si no quedarían huérfanas.
  const cmpList = es ? CMP_ES : CMP_IT;
  const cmpBase = es ? "comparar" : "confronta";
  const nameBySlug = new Map<string, string>();
  for (const x of Object.values(COUNTRIES[pais as CountryCode].regions)) {
    if (!x.isSample && !nameBySlug.has(x.slug)) nameBySlug.set(x.slug, x.name);
  }
  const comparePairs = comparePairsFor(cmpList, r.slug).map((pair) => {
    const [x, y] = pair.split("-vs-");
    const other = x === r.slug ? y : x;
    return { pair, name: nameBySlug.get(other) || other };
  });

  // Pilares temáticos (accesos a las páginas de mayor búsqueda), por país.
  const pillars = es
    ? [
        { href: "/records/", t: "🏆 Récords del dinero público" },
        { href: "/sueldos-alcaldes/", t: "Sueldos de alcaldes" },
        { href: "/deuda-municipios/", t: "Deuda municipal" },
        { href: "/ranking/", t: "Ranking de gasto" },
        { href: "/gasto-por-habitante/", t: "Gasto por habitante" },
        { href: "/comparar/", t: "Comparar ciudades" },
        { href: "/en-que-se-gasta-el-dinero-publico/", t: "¿En qué se gasta?" },
        { href: "/cuanto-cobra-un-concejal/", t: "¿Cuánto cobra un concejal?" },
        { href: "/bulos/", t: "Bulos, desmontados" },
        { href: "/futbol/", t: "El dinero del fútbol" },
      ]
    : [
        { href: "/records/", t: "🏆 Record dei soldi pubblici" },
        { href: "/spesa-comuni/", t: "La spesa dei comuni" },
        { href: "/ranking/", t: "Classifica di spesa" },
        { href: "/confronta/", t: "Confronta comuni" },
        { href: "/sueldos-alcaldes/", t: "Stipendi dei sindaci" },
        { href: "/dove-vanno-i-soldi-pubblici/", t: "Dove vanno i soldi" },
        { href: "/quanto-guadagna-un-consigliere-comunale/", t: "Stipendio del consigliere" },
        { href: "/deuda-municipios/", t: "Debito dei comuni" },
        { href: "/bulos/", t: "Bufale, smontate" },
        { href: "/futbol/", t: "I soldi del calcio" },
      ];

  // FAQ con le domande che la gente cerca davvero, costruite dai dati reali della città.
  const topG = [...r.gastosByCat].sort((a, b) => b.amount - a.amount).slice(0, 3);
  const topI = [...r.ingresosByCat].sort((a, b) => b.amount - a.amount)[0];
  const bal = r.ingresos - r.gastos;
  const subj = `${r.isCity ? (es ? "el Ayuntamiento de " : "il Comune di ") : ""}${r.name}`;
  const gList = topG.map((c) => `${c.label} (${formatPct(c.amount / r.gastos)})`).join(", ");
  const faqs = es
    ? [
        {
          q: `¿Cuánto ingresa y cuánto gasta ${subj} en ${r.year}?`,
          a: `En ${r.year}, ${r.name} tiene unos ingresos de ${formatEuro(r.ingresos)} y unos gastos de ${formatEuro(r.gastos)}, ${bal === 0 ? "con un presupuesto equilibrado (ingresos = gastos)" : `con un ${bal > 0 ? "superávit" : "déficit"} de ${formatCompact(Math.abs(bal))}`}.`,
        },
        { q: `¿En qué se gasta el dinero público en ${r.name}?`, a: `Las principales áreas de gasto son: ${gList}.` },
        r.mayorSalary && {
          q: `¿Cuánto cobra el alcalde de ${r.name}?`,
          a: `El alcalde de ${r.name} percibe ${formatEuro(r.mayorSalary.amount)} brutos al año${r.mayorSalary.dedicacion ? ` (${r.mayorSalary.dedicacion})` : ""}. Fuente: ${r.mayorSalary.source.name}.`,
        },
        r.debt && {
          q: `¿Cuánta deuda tiene ${r.name}?`,
          a: r.debt.amount > 0
            ? `La deuda viva del Ayuntamiento de ${r.name} asciende a ${formatEuro(r.debt.amount)} a 31/12/${r.debt.year}. Fuente: Ministerio de Hacienda (deuda viva de las entidades locales).`
            : `El Ayuntamiento de ${r.name} no registra deuda viva a 31/12/${r.debt.year}. Fuente: Ministerio de Hacienda (deuda viva de las entidades locales).`,
        },
        topI && {
          q: `¿De dónde vienen los ingresos de ${r.name}?`,
          a: `La mayor fuente de ingresos es ${topI.label}, que supone ${formatPct(topI.amount / r.ingresos)} del total.`,
        },
        {
          q: `¿Los datos del presupuesto de ${r.name} son oficiales?`,
          a: r.isSample
            ? `Por ahora son cifras de ejemplo, a la espera de publicar los datos oficiales de ${r.name}.`
            : `Sí. Proceden de ${r.source?.name || "fuentes oficiales"}${r.basis ? ` (${r.basis})` : ""}, y verificamos que ingresos y gastos cuadren.`,
        },
      ].filter(Boolean as unknown as (x: unknown) => x is { q: string; a: string })
    : [
        {
          q: `Quanto incassa e quanto spende ${subj} nel ${r.year}?`,
          a: `Nel ${r.year}, ${r.name} ha entrate per ${formatEuro(r.ingresos)} e spese per ${formatEuro(r.gastos)}, ${bal === 0 ? "con un bilancio in pareggio (entrate = spese)" : `con un ${bal > 0 ? "avanzo" : "disavanzo"} di ${formatCompact(Math.abs(bal))}`}.`,
        },
        { q: `Dove vanno i soldi pubblici a ${r.name}?`, a: `Le principali aree di spesa sono: ${gList}.` },
        r.mayorSalary && {
          q: `Quanto guadagna il sindaco di ${r.name}?`,
          a: `Il sindaco di ${r.name} percepisce un'indennità di funzione di ${formatEuro(r.mayorSalary.amount)} lordi all'anno, come stabilito dalla legge (L. 234/2021 e DM Interno 30/05/2022). L'importo è ridotto del 50% se il sindaco è un lavoratore dipendente non in aspettativa.`,
        },
        r.debt && {
          q: `Quanto debito ha il Comune di ${r.name}?`,
          a: r.debt.amount > 0
            ? `Il debito residuo del Comune di ${r.name} è di ${formatEuro(r.debt.amount)} al 31/12/${r.debt.year}.`
            : `Il Comune di ${r.name} non registra debito residuo al 31/12/${r.debt.year}.`,
        },
        topI && {
          q: `Da dove arrivano le entrate di ${r.name}?`,
          a: `La principale fonte di entrate è ${topI.label}, pari al ${formatPct(topI.amount / r.ingresos)} del totale.`,
        },
        {
          q: `I dati di bilancio di ${r.name} sono ufficiali?`,
          a: r.isSample
            ? `Per ora sono dati di esempio, in attesa di pubblicare i dati ufficiali di ${r.name}.`
            : `Sì. Provengono da ${r.source?.name || "fonti ufficiali"}${r.basis ? ` (${r.basis})` : ""}, e verifichiamo che entrate e spese quadrino.`,
        },
      ].filter(Boolean as unknown as (x: unknown) => x is { q: string; a: string });

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: es ? `Presupuesto de ${r.name} ${r.year}` : `Bilancio di ${r.name} ${r.year}`,
    description: es
      ? `Ingresos y gastos del ${r.isCity ? "ayuntamiento" : "ámbito"} de ${r.name} en ${r.year}, con desglose por capítulo y área.`
      : `Entrate e spese del comune di ${r.name} nel ${r.year}, con dettaglio per capitolo e missione.`,
    creator: { "@type": "Organization", name: "Cuentas Claras" },
    spatialCoverage: r.name,
    temporalCoverage: String(r.year),
    measurementTechnique: r.basis || (r.isSample ? "ejemplo" : "datos oficiales"),
    variableMeasured: [
      { "@type": "PropertyValue", name: es ? "Ingresos" : "Entrate", value: r.ingresos, unitText: "EUR" },
      { "@type": "PropertyValue", name: es ? "Gastos" : "Spese", value: r.gastos, unitText: "EUR" },
    ],
  };

  // Breadcrumb coherente: el nivel intermedio apunta a la landing del país
  // (Italia tiene /italia; España usa la portada). Nombre y URL cuadran.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      ...(es
        ? []
        : [{ "@type": "ListItem", position: 2, name: "Italia", item: `${SITE}/italia/` }]),
      { "@type": "ListItem", position: es ? 2 : 3, name: r.name, item: `${SITE}/${pais}/${r.slug}/` },
    ],
  };

  return (
    <main lang={pais} className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-fg neon-text font-semibold">
          Cuentas Claras
        </Link>{" "}
        <span className="opacity-50">/ {r.name}</span>
      </nav>

      <header>
        <p className="text-xs uppercase tracking-widest text-cyan/80">
          {pais === "es" ? "🇪🇸 España" : "🇮🇹 Italia"} · {r.isCity ? (es ? "Ayuntamiento" : "Comune") : es ? "Provincia" : "Provincia"}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mt-1">
          {es ? "Presupuesto de" : "Bilancio di"} <span className="neon-text">{r.name}</span> {r.year}
        </h1>
        <p className="text-sm mt-2">
          {r.isSample ? (
            <span className="text-amber">{es ? "⚠️ Cifras de ejemplo (pendiente de datos oficiales)" : "⚠️ Dati di esempio (in attesa di dati ufficiali)"}</span>
          ) : (
            <span className="text-green">
              ● {es ? "Datos reales" : "Dati reali"} {r.year}
              {r.source && (
                <>
                  {" · "}
                  <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
                    {r.source.name}
                  </a>
                </>
              )}
            </span>
          )}
        </p>
      </header>

      <div className="mt-5">
        <SimpleExplainer
          title={es ? "En cristiano" : "In parole semplici"}
          by={es ? "te lo explica Claro" : "te lo spiega Claro"}
          moreLabel={es ? "Explícamelo un poco mejor" : "Spiegamelo un po' meglio"}
          more={
            es ? (
              <>
                <p>Un ayuntamiento no busca ganar dinero: recauda para dar servicios. Lo ideal es que lo que entra y lo que sale <span className="text-fg/80">cuadren</span> (ni gastar de más ni de menos).</p>
                <p>La <span className="text-fg/80">deuda</span> no es mala en sí — es como una hipoteca — mientras el ayuntamiento pueda devolverla. Cada cifra de esta página viene de una fuente oficial; abre las secciones de abajo para ver el detalle.</p>
              </>
            ) : (
              <>
                <p>Un Comune non deve guadagnare: incassa per offrire servizi. L'ideale è che ciò che entra e ciò che esce siano <span className="text-fg/80">in pareggio</span> (senza spendere troppo né troppo poco).</p>
                <p>Il <span className="text-fg/80">debito</span> non è di per sé un male — è come un mutuo — finché il Comune riesce a restituirlo. Ogni cifra di questa pagina viene da una fonte ufficiale; apri le sezioni qui sotto per il dettaglio.</p>
              </>
            )
          }
        >
          <p>
            {es
              ? `Imagina ${r.isCity ? "el ayuntamiento de " : ""}${r.name} como una familia: cada año le entra dinero (de tus impuestos y del Estado) y lo gasta en cosas para el pueblo — colegios, calles, limpieza, ayudas…`
              : `Immagina ${r.isCity ? "il Comune di " : ""}${r.name} come una famiglia: ogni anno gli entrano dei soldi (dalle tue tasse e dallo Stato) e li spende in cose per la città — scuole, strade, pulizia, aiuti…`}
          </p>
          <ul className="space-y-1">
            <li>💶 <b>{es ? "Lo que entra" : "Ciò che entra"}</b>: {formatCompact(r.ingresos)} {es ? "al año" : "all'anno"}</li>
            <li>💸 <b>{es ? "Lo que gasta" : "Ciò che spende"}</b>: {formatCompact(r.gastos)} {es ? "al año" : "all'anno"}{r.poblacion && r.poblacion > 0 ? <span className="text-muted"> — {es ? "unos" : "circa"} {formatEuro(Math.round(r.gastos / r.poblacion))} {es ? "por habitante" : "per abitante"}</span> : null}</li>
            {r.debt ? (
              <li>🏦 <b>{es ? "Lo que aún debe" : "Ciò che deve ancora"}</b> ({es ? "como una hipoteca" : "come un mutuo"}): {r.debt.amount > 0 ? formatCompact(r.debt.amount) : es ? "nada, sin deuda" : "niente, nessun debito"}</li>
            ) : null}
            {r.mayorSalary ? (
              <li>👤 <b>{es ? "Lo que cobra quien lo dirige" : "Quanto guadagna chi lo amministra"}</b>: {formatEuro(r.mayorSalary.amount)}{es ? "/año" : "/anno"}</li>
            ) : null}
          </ul>
        </SimpleExplainer>
      </div>
      <section className="grid grid-cols-2 gap-3 mt-3">
        <div className="glass p-4">
          <p className="text-xs text-muted">{es ? "Ingresos" : "Entrate"} {r.year}</p>
          <p className="tabular text-2xl font-semibold text-green mt-1">{formatEuro(r.ingresos)}</p>
          <p className="text-[11px] text-muted/70 mt-0.5">{es ? "el dinero que entra (impuestos, tasas, ayudas)" : "i soldi che entrano (tasse, tariffe, aiuti)"}</p>
        </div>
        <div className="glass p-4">
          <p className="text-xs text-muted">{es ? "Gastos" : "Spese"} {r.year}</p>
          <p className="tabular text-2xl font-semibold text-magenta mt-1">{formatEuro(r.gastos)}</p>
          <p className="text-[11px] text-muted/70 mt-0.5">{es ? "el dinero que gasta en servicios" : "i soldi che spende in servizi"}</p>
        </div>
      </section>

      {(r.debt || r.mayorSalary) && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {r.debt && (
            <div className="glass p-4 border border-[rgba(251,146,60,0.28)]">
              <p className="text-xs text-muted">{es ? "Deuda viva" : "Debito residuo"} · 31/12/{r.debt.year}</p>
              <p className="tabular text-2xl font-semibold text-[#fdba74] mt-1">
                {r.debt.amount > 0 ? formatEuro(r.debt.amount) : es ? "Sin deuda" : "Nessun debito"}
              </p>
              <p className="text-[11px] text-muted/70">
                {es ? "lo que aún debe devolver (préstamos)" : "quello che deve ancora restituire (mutui)"}
                {r.poblacion && r.debt.amount > 0 ? <span className="text-[#fdba74]"> · ≈ {formatEuro(Math.round(r.debt.amount / r.poblacion))} {es ? "por habitante" : "per abitante"}</span> : null}
              </p>
              <a href={r.debt.source.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted underline hover:text-fg">
                {r.debt.source.name}
              </a>
            </div>
          )}
          {r.mayorSalary && (
            <div className="glass p-4 border border-[rgba(129,140,248,0.28)]">
              <p className="text-xs text-muted">{es ? "Sueldo del alcalde" : "Stipendio del sindaco"} · {r.year}</p>
              <p className="tabular text-2xl font-semibold text-[#a5b4fc] mt-1">
                {formatEuro(r.mayorSalary.amount)}<span className="text-sm text-muted font-normal">{es ? "/año" : "/anno"}</span>
              </p>
              <p className="text-[11px] text-muted">
                {r.mayorSalary.dedicacion || (es ? "Indemnización de función (por ley)" : "Indennità di funzione (di legge)")} ·{" "}
                <a href={r.mayorSalary.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
                  {r.mayorSalary.source.name}
                </a>
              </p>
            </div>
          )}
        </section>
      )}

      <ShareBar
        className="mt-6"
        lang={es ? "es" : "it"}
        text={`🏛️ ${r.name}: ${es ? "gasta" : "spende"} ${formatCompact(r.gastos)}${r.mayorSalary ? ` · ${es ? "el alcalde cobra" : "il sindaco guadagna"} ${formatEuro(r.mayorSalary.amount)}` : ""} 👀 ${es ? "datos oficiales" : "dati ufficiali"}`}
      />

      <details data-claro="detail" className="mt-8 glass p-4 sm:p-5 group">
        <summary className="font-semibold cursor-pointer marker:text-cyan flex items-center gap-2 select-none">
          <span className="transition-transform group-open:rotate-90 text-cyan">›</span>
          {es ? "Ver el desglose completo (de dónde viene y a dónde va)" : "Vedi il dettaglio completo (da dove arrivano e dove vanno)"}
        </summary>
        <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">{es ? "¿De dónde viene el dinero?" : "Da dove arrivano i soldi?"}</h2>
          <ul className="text-sm">
            {[...r.ingresosByCat].sort((a, b) => b.amount - a.amount).map((c) => (
              <Row key={c.key} c={c} total={r.ingresos} />
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">{es ? "¿A dónde va el gasto?" : "Dove va la spesa?"}</h2>
          <ul className="text-sm">
            {[...r.gastosByCat].sort((a, b) => b.amount - a.amount).map((c) => (
              <li key={c.key}>
                <Row c={c} total={r.gastos} />
                {c.children && c.children.length > 1 && (
                  <ul className="ml-5 mb-1">
                    {[...c.children].sort((a, b) => b.amount - a.amount).slice(0, 6).map((sc) => (
                      <li key={sc.key} className="flex justify-between text-[12px] text-muted py-0.5">
                        <span>· {sc.label}</span>
                        <span className="tabular">{formatEuro(sc.amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        </div>
      </details>

      <p className="mt-8">
        <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
          {es ? "Ver en el mapa interactivo →" : "Vedi sulla mappa interattiva →"}
        </Link>
      </p>

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-3">{es ? "Preguntas frecuentes" : "Domande frequenti"}</h2>
        <div className="space-y-2.5">
          {faqs.map((f, i) => (
            <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
              <p className="text-sm text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {comparePairs.length > 0 && (
        <nav className="mt-12 pt-6 border-t border-[var(--panel-border)]">
          <h2 className="text-sm font-medium text-muted mb-1">{es ? `Compara ${r.name} con otra ciudad` : `Confronta ${r.name} con un'altra città`}</h2>
          <p className="text-xs text-muted/70 mb-3">{es ? "Ingresos, gastos, deuda y sueldo del alcalde, uno al lado del otro." : "Entrate, spese, debito e stipendio del sindaco, fianco a fianco."}</p>
          <div className="flex flex-wrap gap-2">
            {comparePairs.map(({ pair, name }) => (
              <Link key={pair} href={`/${cmpBase}/${pair}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">
                {es ? "vs " : "vs "}{name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <nav className="mt-12 pt-6 border-t border-[var(--panel-border)]">
        <h2 className="text-sm font-medium text-muted mb-3">{es ? "Temas más buscados" : "Temi più cercati"}</h2>
        <div className="flex flex-wrap gap-2">
          {pillars.map((p) => (
            <Link key={p.href} href={p.href} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">
              {p.t}
            </Link>
          ))}
        </div>
      </nav>

      {others.length > 0 && (
        <nav className="mt-10 pt-6 border-t border-[var(--panel-border)]">
          <h2 className="text-sm font-medium text-muted mb-3">{es ? "Otras ciudades con datos reales" : "Altre città con dati reali"}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {others.map((o) => (
              <Link key={o.slug} href={`/${pais}/${o.slug}`} className="text-cyan/80 hover:text-fg">
                {o.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </main>
  );
}
