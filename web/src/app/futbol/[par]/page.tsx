import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLUBS, CLUB_COMPARE_SLUGS, CLUB_PAGE_SLUGS, type ClubMetrics } from "@/data/futbol";
import { formatEuro } from "@/lib/format";
import ParClient from "./ParClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export function generateStaticParams() {
  const list = CLUB_COMPARE_SLUGS.filter((s) => CLUBS[s]);
  const out: { par: string }[] = [];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) out.push({ par: `${list[i]}-vs-${list[j]}` });
  for (const s of CLUB_PAGE_SLUGS) out.push({ par: s });
  return out;
}

function parsePair(par: string): { a: ClubMetrics; b: ClubMetrics } | null {
  const idx = par.indexOf("-vs-");
  if (idx < 0) return null;
  const a = CLUBS[par.slice(0, idx)];
  const b = CLUBS[par.slice(idx + 4)];
  return a && b ? { a, b } : null;
}

type Props = { params: Promise<{ par: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { par } = await params;
  const pair = parsePair(par);
  if (pair) {
    const t = `${pair.a.name} vs ${pair.b.name}: presupuesto, ingresos y deuda`;
    return {
      title: `${t} (comparativa financiera, datos oficiales)`,
      description: `Compara ${pair.a.name} y ${pair.b.name}: límite salarial, ingresos, salarios y deuda, con datos oficiales (LaLiga, Deloitte, bilanci). Solo cifras verificables.`,
      alternates: { canonical: `${SITE}/futbol/${par}/` },
      openGraph: { title: t, description: "Comparativa financiera con datos oficiales.", type: "article", images: [{ url: "/og-futbol.png", width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: ["/og-futbol.png"] },
    };
  }
  const c = CLUBS[par];
  if (!c || !CLUB_PAGE_SLUGS.includes(par)) return {};
  return {
    title: `${c.name}: ingresos, deuda y límite salarial (cuentas oficiales)`,
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
  return <ParClient par={par} />;
}
