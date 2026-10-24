import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";
const STUDIO = "https://www.blackstardigitalstudio.com";

export const metadata: Metadata = {
  title: "Chi lo fa: Matteo Stella",
  description:
    "Cuentas Claras lo fa Matteo Stella, sviluppatore web italiano a Las Palmas: un progetto indipendente che trasforma i dati pubblici in pagine che si capiscono.",
  alternates: {
    canonical: `${SITE}/chi-lo-fa/`,
    languages: { "es-ES": `${SITE}/quien-lo-hace/`, "it-IT": `${SITE}/chi-lo-fa/` },
  },
  openGraph: {
    title: "Chi fa Cuentas Claras",
    description: "Un progetto indipendente di Matteo Stella, sviluppatore web a Las Palmas.",
    url: `${SITE}/chi-lo-fa/`,
    type: "website",
  },
};

export default function ChiLoFaPage() {
  // AboutPage + Person: stesso @id del CV, così Google collega la persona ai suoi due siti.
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE}/chi-lo-fa/`,
    inLanguage: "it",
    about: { "@id": `${SITE}/#org` },
    mainEntity: {
      "@type": "Person",
      "@id": `${STUDIO}/cv/#matteo-stella`,
      name: "Matteo Stella",
      jobTitle: "Sviluppatore web",
      url: `${STUDIO}/cv/it/`,
      worksFor: { "@type": "Organization", name: "Blackstar Digital Studio", url: `${STUDIO}/` },
      sameAs: ["https://www.linkedin.com/in/matteostella-digital/", "https://github.com/blackstardigitalstudio", `${STUDIO}/`],
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Chi lo fa", item: `${SITE}/chi-lo-fa/` },
    ],
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider force="it">
        <SiteNav />

        <header className="mt-10">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">Chi c&apos;è dietro Cuentas Claras?</h1>
          <p className="mt-4 text-lg text-fg/85">
            I dati pubblici ci sono, ma stanno in PDF e fogli di calcolo che quasi nessuno apre.
            Cuentas Claras li trasforma in pagine che si capiscono in un minuto, con la fonte di ogni cifra.
          </p>
        </header>

        <section className="glass p-5 sm:p-6 mt-8">
          <h2 className="text-xl font-semibold">Lo faccio io: Matteo Stella</h2>
          <p className="mt-3 text-fg/85">
            Sono uno sviluppatore web italiano e vivo a Las Palmas de Gran Canaria. Cuentas Claras è un progetto
            personale e indipendente: lo disegno, lo programmo e lo aggiorno io.
          </p>
          <p className="mt-3 text-fg/85">
            Ogni cifra viene da una fonte ufficiale della Spagna o dell&apos;Italia e ha il suo link, così puoi controllarla.
            Se trovi un errore, scrivimi a{" "}
            <a href="mailto:matteo@blackstardigitalstudio.com" className="underline hover:text-fg">matteo@blackstardigitalstudio.com</a>{" "}
            e lo correggo.
          </p>
        </section>

        <section className="glass p-5 sm:p-6 mt-4">
          <h2 className="text-xl font-semibold">Il mio lavoro</h2>
          <p className="mt-3 text-fg/85">
            Nel mio studio, Blackstar Digital Studio, faccio siti, negozi online e chatbot per attività vere,
            con lo stesso metodo: togliere quello che intralcia e lasciare chiaro quello che conta.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={`${STUDIO}/`} target="_blank" rel="noopener" className="px-5 py-3 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
              Guarda Blackstar Digital Studio →
            </a>
            <a href={`${STUDIO}/cv/it/`} target="_blank" rel="noopener" className="px-5 py-3 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
              Il mio CV
            </a>
          </div>
        </section>

        <nav className="mt-10 flex flex-wrap gap-3">
          <Link href="/italia/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            ← Torna ai dati
          </Link>
          <Link href="/quien-lo-hace/" hrefLang="es" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            🇪🇸 En español
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
