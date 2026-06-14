"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import ScoopCard from "./ScoopCard";
import { useLiveNews } from "@/lib/useLiveNews";

// Adelanto del rincón scoop en la portada: 3 titulares de corrupción + CTA a la
// página dedicada /escandalos (con todos los filones).
export default function Scoop() {
  const { locale, m } = useLocale();
  const { data } = useLiveNews();
  const all = data[`${locale}_scoop`] || data["es_scoop"] || [];
  const items = all.slice(0, 3);
  if (!items.length) return null;

  return (
    <section id="escandalos" className="mt-16 scroll-mt-20">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#ff7a7a]">{m.scoop.eyebrow}</p>
          <h2 className="text-xl md:text-2xl font-semibold mt-1 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff5252] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff5252]" />
            </span>
            {m.scoop.title}
          </h2>
          <p className="text-sm text-muted mt-1 max-w-2xl">{m.scoop.subtitle}</p>
        </div>
        <Link
          href="/escandalos"
          className="shrink-0 text-sm font-medium px-4 py-2 rounded-full text-[#ff7a7a] border border-[rgba(255,107,107,0.45)] bg-[rgba(255,107,107,0.1)] hover:bg-[rgba(255,107,107,0.18)] transition"
        >
          {m.scoop.seeAll} →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {items.map((n, i) => (
          <ScoopCard key={i} n={n} />
        ))}
      </div>
    </section>
  );
}
