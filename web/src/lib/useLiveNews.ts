"use client";

import newsData from "@/data/news.json";

export type NewsItem = { title: string; source: string; url: string; date: string | null };
type NewsMap = Record<string, NewsItem[]>;

const STATIC = newsData as NewsMap;

// El sitio es estático: las noticias se regeneran con frecuencia (cron horario en
// .github/workflows/deploy.yml, que reejecuta el ETL desde los runners de GitHub,
// donde las fuentes de prensa SÍ responden). En cada visita se sirven los últimos
// titulares publicados. No es streaming al segundo —imposible en hosting estático
// gratuito sin una API de pago—, pero sí "siempre la última publicación".
export function useLiveNews(): { data: NewsMap; live: boolean } {
  return { data: STATIC, live: false };
}
