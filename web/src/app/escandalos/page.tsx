import type { Metadata } from "next";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import Scoop from "@/components/Scoop";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cuentas-claras-3cg.pages.dev";

export const metadata: Metadata = {
  title: "Escándalos del dinero público · España e Italia",
  description:
    "Corrupción, fraude y mala gestión de fondos públicos en España e Italia. Titulares recientes de medios, con enlace a la fuente. Scandali, corruzione e sprechi del denaro pubblico in Spagna e Italia.",
  keywords: [
    "corrupción dinero público",
    "malversación fondos públicos",
    "escándalos ayuntamiento",
    "fraude dinero público",
    "corruzione fondi pubblici",
    "danno erariale",
    "scandali appalti comune",
  ],
  alternates: { canonical: `${SITE}/escandalos` },
  openGraph: {
    title: "Escándalos del dinero público · España e Italia",
    description:
      "Corrupción, fraude y mala gestión de fondos públicos según los medios. Casos recientes, con enlace a la fuente.",
    url: `${SITE}/escandalos`,
    type: "website",
  },
};

export default function EscandalosPage() {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Escándalos del dinero público · España e Italia",
            url: `${SITE}/escandalos`,
            inLanguage: ["es", "it"],
            isPartOf: { "@type": "WebSite", name: "Cuentas Claras", url: SITE },
            description:
              "Recopilación de titulares de medios sobre corrupción, fraude y mala gestión de fondos públicos en España e Italia.",
          }),
        }}
      />
      <LocaleProvider>
        <SiteNav />
        <Scoop full />

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p>
            <span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹
          </p>
        </footer>
      </LocaleProvider>
    </main>
  );
}
