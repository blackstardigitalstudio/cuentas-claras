"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import NewsCover from "./NewsCover";
import { useLiveNews } from "@/lib/useLiveNews";
import { cityLink } from "@/lib/cityLink";

export default function News() {
  const { locale, m } = useLocale();
  const { data, live } = useLiveNews();
  const items = (data[locale] || data.es || []).slice(0, 6);
  if (!items.length) return null;

  const fmt = new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <section id="noticias" className="mt-16 scroll-mt-20">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
        {m.news.title}
        {live && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-green border border-[rgba(52,211,153,0.4)] rounded-full px-2 py-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green" />
            </span>
            {m.news.liveOn}
          </span>
        )}
      </h2>
      <p className="text-sm text-muted mt-1 mb-5 max-w-2xl">{m.news.subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((n, i) => {
          const city = cityLink(n.title);
          return (
            <article
              key={i}
              className="glass overflow-hidden flex flex-col group transition duration-200 hover:border-[rgba(34,211,238,0.45)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="block relative">
                <NewsCover title={n.title} />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--panel)] to-transparent" />
                <span className="absolute top-2.5 left-2.5 text-[11px] font-medium text-fg/95 bg-black/35 backdrop-blur-sm rounded-full px-2.5 py-1 max-w-[80%] truncate">
                  {n.source || "—"}
                </span>
              </a>
              <div className="p-4 flex flex-col gap-2 flex-1">
                {n.date && <span className="tabular text-[11px] text-muted">{fmt.format(new Date(n.date))}</span>}
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="group/sl">
                  <p className="text-sm leading-snug text-fg/90 group-hover/sl:text-fg line-clamp-3">{n.title}</p>
                </a>
                <div className="mt-auto pt-1 flex items-center justify-between gap-2 flex-wrap">
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-cyan/80 hover:text-cyan">
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
        })}
      </div>
    </section>
  );
}
