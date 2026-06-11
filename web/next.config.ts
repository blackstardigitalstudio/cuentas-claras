import type { NextConfig } from "next";

// Export estático: genera HTML/CSS/JS puro en /out, sin servidor.
// Permite hosting 100% gratuito (Cloudflare Pages, GitHub Pages, Netlify…).
// La "actualización automática" se hace reconstruyendo el sitio (CI cron),
// no en tiempo real (los presupuestos públicos se publican por periodos).
//
// basePath: vacío para dominio propio o página de usuario (user.github.io).
// Para una "project page" (user.github.io/repositorio) define
// NEXT_PUBLIC_BASE_PATH="/repositorio" en el entorno de build.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
