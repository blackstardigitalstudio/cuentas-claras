"use client";

import Link from "next/link";
import LangSwitch from "./LangSwitch";
import { useMessages } from "@/i18n/LocaleProvider";

// Barra superior fija, compartida por la portada y la página de escándalos.
export default function SiteNav() {
  const m = useMessages();
  return (
    <header className="sticky top-0 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 backdrop-blur-md bg-[rgba(5,7,15,0.72)] border-b border-[var(--panel-border)]">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="neon-text font-semibold tracking-tight shrink-0">
          Cuentas Claras
        </Link>
        <nav className="flex items-center gap-1 sm:gap-1.5 text-sm min-w-0">
          <a href="/#explorar" className="hidden sm:inline-block px-2.5 py-1.5 rounded-full text-muted hover:text-fg transition whitespace-nowrap">
            {m.nav.map}
          </a>
          <a href="/#noticias" className="hidden sm:inline-block px-2.5 py-1.5 rounded-full text-muted hover:text-fg transition whitespace-nowrap">
            {m.nav.news}
          </a>
          <Link
            href="/escandalos"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium whitespace-nowrap text-[#ff7a7a] border border-[rgba(255,107,107,0.45)] bg-[rgba(255,107,107,0.1)] hover:bg-[rgba(255,107,107,0.18)] transition"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff5252] opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff5252]" />
            </span>
            {m.nav.scoop}
          </Link>
        </nav>
        <LangSwitch />
      </div>
    </header>
  );
}
