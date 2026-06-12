"use client";

import { motion } from "motion/react";
import type { RegionData } from "@/lib/data";
import { formatCompact, formatEuro, formatPct } from "@/lib/format";
import { useMessages } from "@/i18n/LocaleProvider";

const CX = 70, CY = 70, RO = 62, RI = 38;

function polar(r: number, a: number): [number, number] {
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}
function arcPath(ro: number, ri: number, a0: number, a1: number): string {
  const [x1, y1] = polar(ro, a0);
  const [x2, y2] = polar(ro, a1);
  const [x3, y3] = polar(ri, a1);
  const [x4, y4] = polar(ri, a0);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x1},${y1} A${ro},${ro} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${ri},${ri} 0 ${large} 0 ${x4},${y4} Z`;
}

function Donut({
  title,
  accent,
  total,
  cats,
}: {
  title: string;
  accent: string;
  total: number;
  cats: { key: string; label: string; color: string; amount: number }[];
}) {
  const data = [...cats].sort((a, b) => b.amount - a.amount).filter((c) => c.amount > 0);
  let a = -Math.PI / 2;
  const segs = data.map((c) => {
    const frac = total > 0 ? c.amount / total : 0;
    const a0 = a;
    const a1 = a + Math.min(frac, 0.9999) * 2 * Math.PI;
    a = a1;
    return { ...c, d: arcPath(RO, RI, a0, a1), frac };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 140 140" className="w-[128px] h-[128px] shrink-0">
        {segs.map((s, i) => (
          <motion.path
            key={s.key}
            d={s.d}
            fill={s.color}
            stroke="#05070f"
            strokeWidth={1}
            style={{ filter: `drop-shadow(0 0 4px ${s.color}80)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <title>{`${s.label}: ${formatEuro(s.amount)} (${formatPct(s.frac)})`}</title>
          </motion.path>
        ))}
        <text x={CX} y={CY - 4} textAnchor="middle" className="tabular" fill={accent} fontSize="15" fontWeight="600">
          {formatCompact(total)}
        </text>
        <text x={CX} y={CY + 13} textAnchor="middle" fill="#8a97c0" fontSize="9">
          {title}
        </text>
      </svg>

      <ul className="flex-1 space-y-1 min-w-0">
        {segs.slice(0, 5).map((s) => (
          <li key={s.key} className="flex items-center justify-between gap-2 text-[12px]">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="truncate text-fg/85">{s.label.replace(/\s*\(.*?\)/, "")}</span>
            </span>
            <span className="tabular text-muted shrink-0">{formatPct(s.frac)}</span>
          </li>
        ))}
        {segs.length > 5 && <li className="text-[11px] text-muted pl-4">+{segs.length - 5}…</li>}
      </ul>
    </div>
  );
}

export default function Donuts({ region }: { region: RegionData }) {
  const m = useMessages();
  return (
    <div className="space-y-5">
      <Donut title={m.panel.income} accent="#34d399" total={region.ingresos} cats={region.ingresosByCat} />
      <div className="border-t border-[var(--panel-border)]" />
      <Donut title={m.panel.expense} accent="#f472b6" total={region.gastos} cats={region.gastosByCat} />
    </div>
  );
}
