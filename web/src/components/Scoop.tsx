"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import NewsCover from "./NewsCover";
import { useLiveNews } from "@/lib/useLiveNews";
import { cityLink } from "@/lib/cityLink";

// Rincón scoop: titulares duros (corrupción/fraude). `full` = página dedicada
// (todos + aviso legal); por defecto = adelanto en la portada (3 + CTA).
export default function Scoop({ full = false }: { full?: boolean }) {
  const { locale, m } = useLocale();
  const { data, live } = useLiveNews();
  const all = data[`${locale}_scoop`] || data["es_scoop"] || [];
  const items = full ? all : all.slice(0, 3);

  const fmt = new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
            {live && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#ff7a7a] border border-[rgba(255,107,107,0.4)] rounded-full px-2 py-0.5">
                {m.news.liveOn}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted mt-1 max-w-2xl">{m.scoop.subtitle}</p>
        </div>
        {!full && all.length > 3 && (
          <Link
            href="/escandalos"
            className="shrink-0 text-sm font-medium px-4 py-2 rounded-full text-[#ff7a7a] border border-[rgba(255,107,107,0.45)] bg-[rgba(255,107,107,0.1)] hover:bg-[rgba(255,107,107,0.18)] transition"
          >
            {m.scoop.seeAll} →
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted mt-6">{m.scoop.empty}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {items.map((n, i) => {
            const city = cityLink(n.title);
            return (
              <article
                key={i}
                className="glass overflow-hidden flex flex-col group transition duration-200 hover:border-[rgba(255,107,107,0.5)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              >
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
          })}
        </div>
      )}

      {full && (
        <p className="mt-8 text-[11px] leading-relaxed text-muted/70 max-w-4xl border-t border-[var(--panel-border)] pt-5">
          {m.scoop.disclaimer}
        </p>
      )}
    </section>
  );
}
