"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import NewsCover from "./NewsCover";
import newsData from "@/data/news.json";

type NewsItem = { title: string; source: string; url: string; date: string | null };
const NEWS = newsData as Record<string, NewsItem[]>;

export default function News() {
  const { locale, m } = useLocale();
  const items = (NEWS[locale] || NEWS.es || []).slice(0, 6);
  if (!items.length) return null;

  const fmt = new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="mt-16">
      <h2 className="text-xl md:text-2xl font-semibold">{m.news.title}</h2>
      <p className="text-sm text-muted mt-1 mb-5 max-w-2xl">{m.news.subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((n, i) => (
          <a
            key={i}
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass overflow-hidden flex flex-col group transition duration-200 hover:border-[rgba(34,211,238,0.45)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            <div className="relative">
              <NewsCover title={n.title} />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--panel)] to-transparent" />
              <span className="absolute top-2.5 left-2.5 text-[11px] font-medium text-fg/95 bg-black/35 backdrop-blur-sm rounded-full px-2.5 py-1 max-w-[80%] truncate">
                {n.source || "—"}
              </span>
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              {n.date && <span className="tabular text-[11px] text-muted">{fmt.format(new Date(n.date))}</span>}
              <p className="text-sm leading-snug text-fg/90 group-hover:text-fg line-clamp-3">{n.title}</p>
              <span className="text-[12px] text-cyan/80 mt-auto pt-1 group-hover:text-cyan">{m.news.readMore} →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
