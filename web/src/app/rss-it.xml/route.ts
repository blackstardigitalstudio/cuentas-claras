import { buildFeed } from "@/lib/rss";

// Feed RSS italiano.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildFeed("it"), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
