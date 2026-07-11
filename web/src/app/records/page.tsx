import type { Metadata } from "next";
import RecordsClient from "./RecordsClient";
import { COUNTRIES, type CountryCode, type RegionData } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cuentas-clara.com";

export const metadata: Metadata = {
  title: "Récords del dinero público: el alcalde mejor pagado y la ciudad más endeudada",
  description:
    "Los récords del dinero público en España e Italia con datos oficiales: el alcalde que más cobra, la ciudad más endeudada, la que más gasta y el mayor gasto por habitante.",
  keywords: ["alcalde mejor pagado", "ciudad más endeudada", "quién gasta más dinero público", "récords gasto municipal", "sindaco più pagato", "città più indebitata"],
  alternates: { canonical: `${SITE}/records/` },
  openGraph: { title: "Récords del dinero público (España e Italia)", description: "El alcalde mejor pagado, la ciudad más endeudada y más, con datos oficiales.", url: `${SITE}/records/`, type: "article" },
};

// --- Cálculo de récords a partir de los datos REALES (nada inventado) ---
export type Rec = { key: string; slug: string; name: string; v: number; kind: "eur" | "eurpc" | "euryear" };

function reals(p: CountryCode): RegionData[] {
  const seen = new Set<string>();
  return Object.values(COUNTRIES[p].regions).filter((r) => {
    if (r.isSample || seen.has(r.slug)) return false;
    seen.add(r.slug);
    return true;
  });
}
function maxBy(arr: RegionData[], f: (r: RegionData) => number | null | undefined) {
  let best: RegionData | null = null, bv = -Infinity;
  for (const r of arr) {
    const v = f(r);
    if (v != null && isFinite(v) && v > bv) { bv = v; best = r; }
  }
  return best ? { r: best, v: bv } : null;
}
function recordsFor(p: CountryCode): Rec[] {
  const a = reals(p);
  const out: Rec[] = [];
  const push = (key: string, res: { r: RegionData; v: number } | null, kind: Rec["kind"]) => {
    if (res) out.push({ key, slug: res.r.slug, name: res.r.name, v: res.v, kind });
  };
  push("salary", maxBy(a, (r) => r.mayorSalary?.amount), "euryear");
  push("debt", maxBy(a, (r) => (r.debt && r.debt.amount > 0 ? r.debt.amount : null)), "eur");
  push("debtpc", maxBy(a, (r) => (r.debt && r.debt.amount > 0 && r.poblacion ? r.debt.amount / r.poblacion : null)), "eurpc");
  push("spend", maxBy(a, (r) => r.gastos), "eur");
  push("spendpc", maxBy(a, (r) => (r.poblacion ? r.gastos / r.poblacion : null)), "eurpc");
  return out;
}
function noDebtCount(p: CountryCode): number {
  return reals(p).filter((r) => r.debt && r.debt.amount === 0).length;
}

export default function RecordsPage() {
  const data = {
    es: { records: recordsFor("es"), noDebt: noDebtCount("es") },
    it: { records: recordsFor("it"), noDebt: noDebtCount("it") },
  };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Cuentas Claras", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Récords", item: `${SITE}/records/` }] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <RecordsClient data={data} />
    </>
  );
}
