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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cuentas-claras-3cg.pages.dev"),
  title: {
    default: "Cuentas Claras — ¿A dónde va el dinero público en España?",
    template: "%s · Cuentas Claras",
  },
  description:
    "Visualización clara e interactiva de los ingresos y gastos de los ayuntamientos españoles, con datos oficiales del Ministerio de Hacienda. Explora el mapa de España por provincia y categoría.",
  keywords: [
    "presupuesto municipal",
    "gasto público España",
    "transparencia",
    "datos abiertos",
    "ingresos ayuntamientos",
    "a dónde va mi dinero",
  ],
  openGraph: {
    title: "Cuentas Claras — ¿A dónde va el dinero público?",
    description:
      "Mapa interactivo de los presupuestos públicos de España. Ingresos y gastos por provincia y categoría, con datos oficiales.",
    locale: "es_ES",
    type: "website",
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
        <div className="aurora" aria-hidden />
        <div className="grid-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
