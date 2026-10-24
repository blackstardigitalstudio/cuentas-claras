import type { Metadata } from "next";
import Link from "next/link";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";
const ESTUDIO = "https://www.blackstardigitalstudio.com";

export const metadata: Metadata = {
  title: "Quién lo hace: Matteo Stella",
  description:
    "Cuentas Claras lo hace Matteo Stella, desarrollador web italiano en Las Palmas: un proyecto independiente que convierte los datos públicos en páginas que se entienden.",
  alternates: {
    canonical: `${SITE}/quien-lo-hace/`,
    languages: { "es-ES": `${SITE}/quien-lo-hace/`, "it-IT": `${SITE}/chi-lo-fa/` },
  },
  openGraph: {
    title: "Quién hace Cuentas Claras",
    description: "Un proyecto independiente de Matteo Stella, desarrollador web en Las Palmas.",
    url: `${SITE}/quien-lo-hace/`,
    type: "website",
  },
};

export default function QuienLoHacePage() {
  // AboutPage + Person: el mismo @id que el CV, para que Google una a la persona con sus dos webs.
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE}/quien-lo-hace/`,
    inLanguage: "es",
    about: { "@id": `${SITE}/#org` },
    mainEntity: {
      "@type": "Person",
      "@id": `${ESTUDIO}/cv/#matteo-stella`,
      name: "Matteo Stella",
      jobTitle: "Desarrollador web",
      url: `${ESTUDIO}/cv/es/`,
      worksFor: { "@type": "Organization", name: "Blackstar Digital Studio", url: `${ESTUDIO}/` },
      sameAs: ["https://www.linkedin.com/in/matteostella-digital/", "https://github.com/blackstardigitalstudio", `${ESTUDIO}/`],
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Quién lo hace", item: `${SITE}/quien-lo-hace/` },
    ],
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocaleProvider force="es">
        <SiteNav />

        <header className="mt-10">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">¿Quién está detrás de Cuentas Claras?</h1>
          <p className="mt-4 text-lg text-fg/85">
            Los datos públicos existen, pero viven en PDF y hojas de cálculo que casi nadie abre.
            Cuentas Claras los convierte en páginas que se entienden en un minuto, con la fuente de cada cifra.
          </p>
        </header>

        <section className="glass p-5 sm:p-6 mt-8">
          <h2 className="text-xl font-semibold">Lo hago yo: Matteo Stella</h2>
          <p className="mt-3 text-fg/85">
            Soy desarrollador web, italiano, y vivo en Las Palmas de Gran Canaria. Cuentas Claras es un proyecto
            personal e independiente: lo diseño, lo programo y lo actualizo yo.
          </p>
          <p className="mt-3 text-fg/85">
            Cada cifra sale de una fuente oficial de España o de Italia y lleva su enlace, para que la puedas comprobar.
            Si encuentras un error, escríbeme a{" "}
            <a href="mailto:matteo@blackstardigitalstudio.com" className="underline hover:text-fg">matteo@blackstardigitalstudio.com</a>{" "}
            y lo corrijo.
          </p>
        </section>

        <section className="glass p-5 sm:p-6 mt-4">
          <h2 className="text-xl font-semibold">Mi trabajo</h2>
          <p className="mt-3 text-fg/85">
            En mi estudio, Blackstar Digital Studio, hago webs, tiendas online y chatbots para negocios reales,
            con el mismo método: quitar lo que estorba y dejar claro lo que importa.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={`${ESTUDIO}/es`} target="_blank" rel="noopener" className="px-5 py-3 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition inline-block">
              Ver Blackstar Digital Studio →
            </a>
            <a href={`${ESTUDIO}/cv/es/`} target="_blank" rel="noopener" className="px-5 py-3 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
              Mi CV
            </a>
          </div>
        </section>

        <nav className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            ← Volver a los datos
          </Link>
          <Link href="/chi-lo-fa/" hrefLang="it" className="px-5 py-2.5 rounded-full font-medium border border-[var(--panel-border)] hover:border-cyan transition inline-block">
            🇮🇹 In italiano
          </Link>
        </nav>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Hecho en Italia 🇮🇹</p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
