import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  alternates: { canonical: "/" },
  title: {
    default: "Cuentas Claras — ¿A dónde va el dinero público en España e Italia?",
    template: "%s · Cuentas Claras",
  },
  description:
    "Visualización clara e interactiva de los ingresos y gastos reales de los ayuntamientos de España e Italia, con datos oficiales y desglose detallado del gasto. Mapa interactivo por provincia y categoría.",
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
      </body>
    </html>
  );
}
