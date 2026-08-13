"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import LangSwitch from "./LangSwitch";
import { useLocale } from "@/i18n/LocaleProvider";

// Barra superior fija. Resalta la página en la que estás (más fácil orientarse).
export default function SiteNav() {
  const { m, locale } = useLocale();
  const it = locale === "it";
  const pathname = usePathname();
  const base = "px-2.5 py-1.5 rounded-full transition whitespace-nowrap";

  const items: { href: string; label: ReactNode; show: string; anchor?: boolean }[] = [
    { href: "/#explorar", label: m.nav.map, show: "hidden sm:inline-block", anchor: true },
    { href: "/ranking", label: it ? "Classifica" : "Ranking", show: "hidden sm:inline-block" },
    { href: "/records", label: <>🏆 {it ? "Record" : "Récords"}</>, show: "hidden lg:inline-block" },
    { href: "/sueldos-alcaldes", label: it ? "Stipendi" : "Sueldos", show: "hidden md:inline-block" },
    { href: "/deuda-municipios", label: it ? "Debito" : "Deuda", show: "hidden md:inline-block" },
    { href: "/spesa-comuni", label: it ? "Spesa comuni" : "Gasto Italia", show: "hidden lg:inline-block" },
    { href: "/#noticias", label: m.nav.news, show: "hidden sm:inline-block", anchor: true },
    { href: it ? "/bufale-soldi-pubblici" : "/bulos", label: it ? "Bufale" : "Bulos", show: "hidden sm:inline-block" },
    { href: it ? "/calcio" : "/futbol", label: <>⚽ {it ? "Calcio" : "Fútbol"}</>, show: "hidden sm:inline-block" },
  ];
  const isActive = (href: string) => !href.startsWith("/#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 backdrop-blur-md bg-[rgba(5,7,15,0.72)] border-b border-[var(--panel-border)]">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="neon-text font-semibold tracking-tight shrink-0">
          Cuentas Claras
        </Link>
        <nav className="flex items-center gap-1 sm:gap-1.5 text-sm min-w-0">
          {items.map((x) => {
            const active = isActive(x.href);
            const cls = `${x.show} ${base} ${active ? "text-fg bg-[rgba(120,160,255,0.14)] font-medium" : "text-muted hover:text-fg"}`;
            return x.anchor ? (
              <a key={x.href} href={x.href} className={cls}>{x.label}</a>
            ) : (
              <Link key={x.href} href={x.href} className={cls} aria-current={active ? "page" : undefined}>{x.label}</Link>
            );
          })}
          <Link
            href={it ? "/scandali-soldi-pubblici" : "/escandalos"}
            aria-current={isActive(it ? "/scandali-soldi-pubblici" : "/escandalos") ? "page" : undefined}
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
