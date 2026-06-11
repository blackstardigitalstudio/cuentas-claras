"use client";

import { motion } from "motion/react";
import type { RegionData } from "@/lib/data";
import { formatCompact, formatEuro, formatPct } from "@/lib/format";
import { useMessages } from "@/i18n/LocaleProvider";

function Bar({
  label,
  total,
  accent,
  cats,
}: {
  label: string;
  total: number;
  accent: string;
  cats: { key: string; label: string; color: string; amount: number }[];
}) {
  const sorted = [...cats].sort((a, b) => b.amount - a.amount);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium" style={{ color: accent }}>
          {label}
        </span>
        <span className="tabular text-sm font-semibold" style={{ color: accent }}>
          {formatCompact(total)}
        </span>
      </div>
      <div className="flex h-9 w-full rounded-lg overflow-hidden ring-1 ring-white/10">
        {sorted.map((c, i) => {
          const pct = total > 0 ? (c.amount / total) * 100 : 0;
          return (
            <motion.div
              key={c.key}
              title={`${c.label}: ${formatEuro(c.amount)} (${formatPct(c.amount / total)})`}
              className="h-full flex items-center justify-center overflow-hidden whitespace-nowrap"
              style={{ background: c.color, color: "#05070f" }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
            >
              {pct >= 11 && (
                <span className="px-1 text-[11px] font-semibold tabular">{Math.round(pct)}%</span>
              )}
            </motion.div>
          );
        })}
      </div>
      {/* Leyenda compacta de los mayores segmentos */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {sorted.slice(0, 5).map((c) => (
          <span key={c.key} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: c.color }} />
            {c.label.replace(/\s*\(.*?\)/, "")}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FlowBars({ region }: { region: RegionData }) {
  const m = useMessages();
  return (
    <div className="space-y-5">
      <Bar label={m.panel.income} total={region.ingresos} accent="#34d399" cats={region.ingresosByCat} />
      <Bar label={m.panel.expense} total={region.gastos} accent="#f472b6" cats={region.gastosByCat} />
    </div>
  );
}
