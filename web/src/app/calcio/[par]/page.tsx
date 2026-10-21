import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MATCH_PAIRS, nextMatchForPair } from "@/data/partite";
import { pairMetadata, parsePair } from "@/lib/partitaMeta";
import ParClient from "../../futbol/[par]/ParClient";

// Versione italiana delle coppie che si affrontano nelle prossime giornate
// (LaLiga e Serie A): stesso confronto di /futbol/A-vs-B/, ma in italiano.
export function generateStaticParams() {
  return MATCH_PAIRS.map((par) => ({ par }));
}

type Props = { params: Promise<{ par: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { par } = await params;
  return pairMetadata(par, true) ?? {};
}

export default async function CalcioPartitaPage({ params }: Props) {
  const { par } = await params;
  if (!MATCH_PAIRS.includes(par) || !parsePair(par)) notFound();
  return <ParClient par={par} locale="it" match={nextMatchForPair(par)} />;
}
