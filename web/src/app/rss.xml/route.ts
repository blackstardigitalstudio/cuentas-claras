import { buildFeed } from "@/lib/rss";

// Feed RSS spagnolo. Statico: si rigenera a ogni build (il cron aggiorna le
// notizie ogni 2 ore e rilancia il deploy).
export const dynamic = "force-static";

export function GET() {
  return new Response(buildFeed("es"), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
