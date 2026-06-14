"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import NewsCover from "./NewsCover";
import { cityLink } from "@/lib/cityLink";
import type { NewsItem } from "@/lib/useLiveNews";

// Tarjeta de un titular "scoop" (acento rojo). Reutilizada por la portada y la
// página de escándalos. Si el titular menciona una ciudad con datos, añade un
// enlace a su ficha con el desglose total ("interlazado").
export default function ScoopCard({ n }: { n: NewsItem }) {
  const { locale, m } = useLocale();
  const city = cityLink(n.title);
  const fmt = new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <article className="glass overflow-hidden flex flex-col group transition duration-200 hover:border-[rgba(255,107,107,0.5)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
      <a href={n.url} target="_blank" rel="noopener noreferrer" className="block relative">
        <NewsCover title={n.title} />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--panel)] to-transparent" />
        <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#ffd0d0] bg-[rgba(180,30,30,0.55)] backdrop-blur-sm rounded-full px-2.5 py-1">
          {m.scoop.badge}
        </span>
        <span className="absolute top-2.5 right-2.5 text-[11px] font-medium text-fg/95 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 max-w-[55%] truncate">
          {n.source || "—"}
        </span>
      </a>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {n.date && <span className="tabular text-[11px] text-muted">{fmt.format(new Date(n.date))}</span>}
        <a href={n.url} target="_blank" rel="noopener noreferrer" className="group/sl">
          <p className="text-sm leading-snug text-fg/90 group-hover/sl:text-fg line-clamp-3">{n.title}</p>
        </a>
        <div className="mt-auto pt-1 flex items-center justify-between gap-2 flex-wrap">
          <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#ff7a7a]/85 hover:text-[#ff7a7a]">
            {m.news.readMore} →
          </a>
          {city && (
            <Link
              href={`/${city.pais}/${city.slug}`}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full text-cyan border border-[rgba(34,211,238,0.4)] bg-[rgba(34,211,238,0.08)] hover:bg-[rgba(34,211,238,0.16)] transition"
            >
              {city.name} · {m.news.cityCta} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
