import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { formatEuro, formatCompact } from "@/lib/format";
import ranks from "@/data/rankings-it.json";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Quanto spende il tuo comune? Classifica dei comuni italiani (dati ufficiali)",
  description: `Quali comuni italiani spendono di più — in totale e per abitante — con dati ufficiali SIOPE (RGS-MEF). Roma guida con ${formatEuro(ranks.topSpending[0].gastos)}. In testa alla spesa per abitante: ${ranks.topPerCapita[0].name} (${formatEuro(ranks.topPerCapita[0].perCapita)}/abitante).`,
  keywords: [
    "quanto spende il comune",
    "spesa comuni italiani",
    "comuni che spendono di più",
    "spesa pubblica per abitante",
    "bilancio comuni italiani",
    "stipendio sindaco Italia",
  ],
  alternates: { canonical: `${SITE}/spesa-comuni/` },
  openGraph: {
    title: "Quanto spende il tuo comune? Classifica dei comuni italiani",
    description: `Comuni che spendono di più, in totale e per abitante. Dati ufficiali SIOPE.`,
    url: `${SITE}/spesa-comuni/`,
    type: "website",
  },
};

export default function SpesaComuniPage() {
  const top = ranks.topSpending;
  const maxT = top[0].gastos;
  const pc = ranks.topPerCapita;
  const maxPC = pc[0].perCapita;

  const faqs = [
    { q: "Qual è il comune italiano che spende di più?", a: `${top[0].name}, con ${formatEuro(top[0].gastos)} di spesa nel ${ranks.year} (dati di cassa SIOPE), seguito da ${top[1].name} (${formatEuro(top[1].gastos)}) e ${top[2].name} (${formatEuro(top[2].gastos)}).` },
    { q: "Quale comune spende di più per abitante?", a: `${pc[0].name}, con circa ${formatEuro(pc[0].perCapita)} di spesa per abitante all'anno, davanti a ${pc[1].name} (${formatEuro(pc[1].perCapita)}) e ${pc[2].name} (${formatEuro(pc[2].perCapita)}). La spesa per abitante è più giusta per confrontare comuni di dimensioni diverse.` },
    { q: "Quanto guadagna il sindaco in Italia?", a: `L'indennità del sindaco è fissata per legge in base alla popolazione: da circa ${formatEuro(2208 * 12)}/anno nei comuni piccoli fino a ${formatEuro(ranks.salaryTop)}/anno nelle grandi città metropolitane (Roma, Milano, Napoli, Torino…). La trovi nella scheda di ogni comune.` },
    { q: "Da dove vengono questi dati?", a: "Dai dati di cassa SIOPE della Ragioneria Generale dello Stato (MEF): pagamenti effettivi dei comuni. Solo dati ufficiali e verificabili." },
  ];

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", name: `Comuni italiani che spendono di più (${ranks.year})`, itemListElement: top.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.name}: ${formatEuro(c.gastos)}` })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Spesa dei comuni", item: `${SITE}/spesa-comuni/` }] };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <header className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">🇮🇹 Italia · {ranks.year}</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            Quanto spende il tuo <span className="neon-text">comune</span>?
          </h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            Quali comuni italiani spendono di più — in totale e <span className="text-fg/90">per abitante</span> — con dati
            ufficiali (SIOPE, Ragioneria dello Stato). In parole semplici: quanti soldi passano dalle casse del tuo comune.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { v: formatCompact(top[0].gastos), l: `Spende di più (${top[0].name})`, c: "#f472b6" },
            { v: `${formatEuro(pc[0].perCapita)}`, l: `Più per abitante (${pc[0].name})`, c: "#22d3ee" },
            { v: ranks.count.toLocaleString("it"), l: "Comuni con dati reali", c: "#34d399" },
          ].map((k) => (
            <div key={k.l} className="glass p-4 text-center">
              <p className="tabular text-lg md:text-2xl font-semibold" style={{ color: k.c }}>{k.v}</p>
              <p className="text-[11px] text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-lg md:text-xl font-semibold mb-1">I comuni che spendono di più</h2>
          <p className="text-[11px] text-cyan/70 mb-4">Spesa totale in un anno (le grandi città in testa, è normale: hanno più abitanti).</p>
          <ol className="space-y-1.5">
            {top.map((c, i) => (
              <li key={c.slug} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <Link href={`/it/${c.slug}/`} className="block truncate font-medium hover:text-cyan">{c.name}</Link>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span className="block h-full rounded-full bg-gradient-to-r from-cyan to-magenta" style={{ width: `${Math.max(3, (c.gastos / maxT) * 100)}%` }} />
                  </span>
                </span>
                <span className="tabular text-sm font-semibold text-magenta shrink-0">{formatCompact(c.gastos)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-lg md:text-xl font-semibold mb-1">Chi spende di più per abitante</h2>
          <p className="text-[11px] text-cyan/70 mb-4">La spesa divisa per gli abitanti — più giusto per confrontare comuni grandi e piccoli.</p>
          <ol className="space-y-1.5">
            {pc.slice(0, 20).map((c, i) => (
              <li key={c.slug} className="glass flex items-center gap-3 px-3 py-2.5">
                <span className="tabular text-sm text-muted w-7 shrink-0 text-right">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <Link href={`/it/${c.slug}/`} className="block truncate font-medium hover:text-cyan">{c.name}</Link>
                  <span className="text-[10px] text-muted">{formatCompact(c.gastos)} · {c.pop.toLocaleString("it")} ab.</span>
                </span>
                <span className="tabular text-right shrink-0">
                  <span className="block text-sm font-semibold text-cyan">{formatEuro(c.perCapita)}</span>
                  <span className="block text-[10px] text-muted">per abitante</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-muted mt-3">Fonte: <a href={ranks.spendingSource.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">{ranks.spendingSource.name}</a> · Popolazione ISTAT.</p>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-3">Domande frequenti</h2>
          <div className="space-y-2.5">
            {faqs.map((f, i) => (
              <details key={i} className="glass p-4" {...(i === 0 ? { open: true } : {})}>
                <summary className="font-medium cursor-pointer marker:text-cyan">{f.q}</summary>
                <p className="text-sm text-muted mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <nav className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="px-5 py-2.5 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
            Cerca la tua città →
          </Link>
          <Link href="/deuda-municipios/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            Deuda de España
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
