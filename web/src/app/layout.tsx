import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MascotGuide from "@/components/MascotGuide";
import ShareHighlight from "@/components/ShareHighlight";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  alternates: {
    canonical: "/",
    // Feed RSS: permettono a lettori e giornalisti di seguire gli aggiornamenti
    // senza dover tornare sul sito (e agli aggregatori di ripubblicarci).
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "Cuentas Claras — dinero público (ES)" },
        { url: "/rss-it.xml", title: "Cuentas Claras — soldi pubblici (IT)" },
      ],
    },
  },
  title: {
    default: "Cuentas Claras — ¿A dónde va el dinero público en España e Italia?",
    template: "%s · Cuentas Claras",
  },
  description:
    "Ingresos y gastos reales de los ayuntamientos de España e Italia, con datos oficiales y desglose detallado. Mapa interactivo por provincia y categoría.",
  keywords: [
    "presupuesto municipal",
    "gasto público España",
    "transparencia",
    "datos abiertos",
    "ingresos ayuntamientos",
    "a dónde va mi dinero",
    "bilancio comunale",
    "spesa pubblica Italia",
    "dove vanno i soldi pubblici",
  ],
  openGraph: {
    title: "Cuentas Claras — ¿A dónde va el dinero público?",
    description:
      "Mapa interactivo de los presupuestos públicos de España e Italia. Ingresos y gastos por provincia y categoría, con datos oficiales.",
    url: SITE,
    siteName: "Cuentas Claras",
    locale: "es_ES",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Cuentas Claras — ¿A dónde va el dinero público? España e Italia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cuentas Claras — ¿A dónde va el dinero público?",
    description: "Presupuestos públicos de España e Italia en un mapa claro. Datos oficiales, ranking y escándalos del dinero público.",
    images: ["/og.png"],
  },
  verification: {
    google: "-85GSAaHegAcbda2Gmr-MzlgOHtpeP5JlQfLxoHnTrw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Cuentas Claras",
                  url: SITE,
                  inLanguage: ["es", "it"],
                  description:
                    "Visualización clara de los presupuestos públicos de los ayuntamientos de España e Italia: ingresos y gastos con datos oficiales.",
                },
                { "@type": "Organization", name: "Cuentas Claras", url: SITE },
              ],
            }),
          }}
        />
        <div className="aurora" aria-hidden />
        <div className="grid-overlay" aria-hidden />
        {children}
        <ShareHighlight />
        <MascotGuide />
      </body>
    </html>
  );
}
