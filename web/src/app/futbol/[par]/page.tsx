import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLUBS, CLUB_COMPARE_SLUGS, CLUB_PAGE_SLUGS } from "@/data/futbol";
import { MATCH_PAIRS, nextMatchForPair } from "@/data/partite";
import { formatEuro, formatCompact } from "@/lib/format";
import { SITE, pairMetadata, parsePair } from "@/lib/partitaMeta";
import ParClient from "./ParClient";

export function generateStaticParams() {
  const list = CLUB_COMPARE_SLUGS.filter((s) => CLUBS[s]);
  const out: { par: string }[] = [];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) out.push({ par: `${list[i]}-vs-${list[j]}` });
  // Parejas que se enfrentan en las próximas jornadas (calendario oficial en partite.ts).
  const seen = new Set(out.map((o) => o.par));
  for (const p of MATCH_PAIRS) if (!seen.has(p)) out.push({ par: p });
  for (const s of CLUB_PAGE_SLUGS) out.push({ par: s });
  return out;
}

type Props = { params: Promise<{ par: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { par } = await params;
  // Coppie: titolo "A vs B" (con la data se si giocano a breve). Vedi lib/partitaMeta.ts.
  const meta = pairMetadata(par, false);
  if (meta) return meta;
  const c = CLUBS[par];
  if (!c || !CLUB_PAGE_SLUGS.includes(par)) return {};
  return {
    // El número de ingresos delante: es el dato que la gente busca y hace clicar.
    title: c.revenue
      ? `${c.name}: ${formatCompact(c.revenue)} de ingresos, ¿y de deuda?`
      : `${c.name}: ingresos, deuda y límite salarial`,
    description: `Las cuentas del ${c.name} con datos oficiales: ${c.revenue ? `ingresos de ${formatEuro(c.revenue)}, ` : ""}${c.debt ? `deuda de ${formatEuro(c.debt.amount)}, ` : ""}salarios y límite salarial. Solo cifras verificables.`,
    alternates: { canonical: `${SITE}/futbol/${par}/` },
    openGraph: { title: `${c.name}: ingresos, deuda y límite salarial`, description: "Las cuentas del club con datos oficiales.", type: "article", images: [{ url: "/og-futbol.png", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: ["/og-futbol.png"] },
  };
}

export default async function FutbolTokenPage({ params }: Props) {
  const { par } = await params;
  const pair = parsePair(par);
  const isClub = !pair && CLUBS[par] && CLUB_PAGE_SLUGS.includes(par);
  if (!pair && !isClub) notFound();
  return <ParClient par={par} match={pair ? nextMatchForPair(par) : null} />;
}
