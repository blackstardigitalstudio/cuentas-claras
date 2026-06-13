"use client";

import { useEffect, useState } from "react";
import newsData from "@/data/news.json";

export type NewsItem = { title: string; source: string; url: string; date: string | null };
type NewsMap = Record<string, NewsItem[]>;

const STATIC = newsData as NewsMap;

// Noticias en vivo: arranca con el news.json del build (bueno para SEO y primer
// pintado) y, en cliente, refresca desde /api/news (función edge de Cloudflare)
// al montar y cada 90 s. Si /api/news no existe (p. ej. GitHub Pages) o falla,
// se mantiene el respaldo estático.
export function useLiveNews(): { data: NewsMap; live: boolean } {
  const [data, setData] = useState<NewsMap>(STATIC);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/news", { cache: "no-store" });
        if (!r.ok) return;
        const j = (await r.json()) as NewsMap & { error?: string };
        if (alive && j && !j.error && typeof j === "object") {
          setData((prev) => ({ ...prev, ...j }));
          setLive(true);
        }
      } catch {
        /* respaldo estático */
      }
    };
    load();
    const id = setInterval(load, 90_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return { data, live };
}
