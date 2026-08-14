import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { COUNTRIES } from "@/lib/data";
import { CMP_IT } from "@/data/compare-lists";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Due comuni a confronto: chi spende e chi deve di più?",
  description:
    "Confronta due città italiane fianco a fianco: quanto incassano, spendono e devono, e quanto guadagna il sindaco. Dati ufficiali. Scegli due comuni e guarda i conti insieme.",
  keywords: ["confronta comuni", "confronto bilanci comuni", "confronto spesa città", "confronto debito comuni"],
  alternates: { canonical: `${SITE}/confronta/` },
  openGraph: { title: "Confronta i bilanci dei comuni", description: "Due comuni, i conti fianco a fianco, con dati ufficiali.", url: `${SITE}/confronta/`, type: "website", locale: "it_IT" },
};

function nameFor(slug: string): string {
  const m = Object.values(COUNTRIES.it.regions).filter((r) => r.slug === slug);
  return (m.find((r) => !r.isSample) || m[0])?.name || slug;
}

export default function ConfrontaIndex() {
  const pairs: { pair: string; label: string }[] = [];
  for (let i = 0; i < CMP_IT.length; i++)
    for (let j = i + 1; j < CMP_IT.length; j++)
      pairs.push({ pair: `${CMP_IT[i]}-vs-${CMP_IT[j]}`, label: `${nameFor(CMP_IT[i])} vs ${nameFor(CMP_IT[j])}` });

  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Confronta comuni", item: `${SITE}/confronta/` }] };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider>
        <SiteNav />
        <article className="pt-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan/80">🇮🇹 Confronti · dati ufficiali</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">Confronta i <span className="neon-text">bilanci</span> dei comuni</h1>
          <p className="text-sm md:text-base text-muted mt-3 max-w-2xl">
            Due città, i conti uno accanto all'altro: chi <span className="text-fg/90">incassa</span>, <span className="text-fg/90">spende</span> e <span className="text-fg/90">deve</span> di più, e quanto guadagna il sindaco. Tutto con dati ufficiali. Scegli un confronto:
          </p>

          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Tutti i confronti</h2>
            <div className="flex flex-wrap gap-2">
              {pairs.map((p) => (
                <Link key={p.pair} href={`/confronta/${p.pair}/`} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] text-cyan/80 hover:text-fg hover:border-cyan transition">
                  {p.label}
                </Link>
              ))}
            </div>
          </section>

          <nav className="mt-10 pt-6 border-t border-[var(--panel-border)] flex flex-wrap gap-2">
            {[
              { href: "/spesa-comuni/", t: "La spesa dei comuni" },
              { href: "/ranking/", t: "Classifica di spesa" },
              { href: "/dove-vanno-i-soldi-pubblici/", t: "Dove vanno i soldi" },
              { href: "/quanto-guadagna-un-consigliere-comunale/", t: "Stipendio del consigliere" },
            ].map((p) => (
              <Link key={p.href} href={p.href} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">{p.t}</Link>
            ))}
          </nav>

          <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
            <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
          </footer>
        </article>
      </LocaleProvider>
    </main>
  );
}
