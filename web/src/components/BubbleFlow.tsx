"use client";

import { useMemo } from "react";
import { pack, hierarchy } from "d3-hierarchy";
import type { RegionData } from "@/lib/data";
import { formatCompact, formatEuro, formatPct } from "@/lib/format";
import { useMessages } from "@/i18n/LocaleProvider";

const SIZE = 230;
type Cat = { key: string; label: string; color: string; amount: number };

function Cluster({ title, accent, total, cats }: { title: string; accent: string; total: number; cats: Cat[] }) {
  const leaves = useMemo(() => {
    const data = cats.filter((c) => c.amount > 0);
    if (!data.length) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root: any = hierarchy({ children: data } as any).sum((d: any) => d.amount || 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pack() as any).size([SIZE, SIZE]).padding(4)(root);
    return root.leaves() as { x: number; y: number; r: number; data: Cat }[];
  }, [cats]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium" style={{ color: accent }}>
          {title}
        </span>
        <span className="tabular text-sm font-semibold" style={{ color: accent }}>
          {formatCompact(total)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-[152px] h-[152px] shrink-0">
          {leaves.map((l, i) => {
            const c = l.data;
            const pct = (c.amount / total) * 100;
            return (
              <g key={c.key}>
                <circle
                  className="bubble-pop"
                  cx={l.x}
                  cy={l.y}
                  r={l.r}
                  fill={c.color}
                  fillOpacity={0.82}
                  stroke={c.color}
                  strokeOpacity={0.55}
                  style={{ filter: `drop-shadow(0 0 6px ${c.color})`, animationDelay: `${i * 60}ms` }}
                >
                  <title>{`${c.label}: ${formatEuro(c.amount)} (${formatPct(c.amount / total)})`}</title>
                </circle>
                {l.r > 19 && (
                  <text
                    x={l.x}
                    y={l.y}
                    textAnchor="middle"
                    dy="0.32em"
                    fontSize={Math.min(l.r * 0.55, 14)}
                    fontWeight={700}
                    fill="#05070f"
                    style={{ pointerEvents: "none" }}
                  >
                    {Math.round(pct)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <ul className="flex-1 space-y-1 min-w-0">
          {[...cats]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map((c) => (
              <li key={c.key} className="flex items-center justify-between gap-2 text-[12px]">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="truncate text-fg/85">{c.label.replace(/\s*\(.*?\)/, "")}</span>
                </span>
                <span className="tabular text-muted shrink-0">{formatPct(c.amount / total)}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default function BubbleFlow({ region }: { region: RegionData }) {
  const m = useMessages();
  return (
    <div className="space-y-5">
      <Cluster title={m.panel.income} accent="#34d399" total={region.ingresos} cats={region.ingresosByCat} />
      <div className="border-t border-[var(--panel-border)]" />
      <Cluster title={m.panel.expense} accent="#f472b6" total={region.gastos} cats={region.gastosByCat} />
    </div>
  );
}
