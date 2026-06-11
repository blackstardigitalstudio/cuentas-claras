"use client";

import { useLocale } from "@/i18n/LocaleProvider";
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((n, i) => (
          <a
            key={i}
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass p-4 flex flex-col gap-2 group hover:border-[rgba(34,211,238,0.4)] transition"
          >
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span className="text-cyan/90 font-medium truncate">{n.source || "—"}</span>
              {n.date && <span className="tabular shrink-0">{fmt.format(new Date(n.date))}</span>}
            </div>
            <p className="text-sm leading-snug text-fg/90 group-hover:text-fg line-clamp-4">{n.title}</p>
            <span className="text-[11px] text-cyan/70 mt-auto group-hover:text-cyan">{m.news.readMore} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
