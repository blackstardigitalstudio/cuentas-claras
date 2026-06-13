"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { RegionData } from "@/lib/data";
import { formatCompact, formatEuro, formatPct } from "@/lib/format";
import { CountUp } from "./Motion";
import BubbleFlow from "./BubbleFlow";
import { useMessages } from "@/i18n/LocaleProvider";

type Cat = { key: string; label: string; color: string; amount: number; children?: Cat[] };

// Rama recursiva del gasto: soporta cualquier profundidad (área→política→grupo→programa→subprograma).
// Cada nodo gestiona su propio estado abierto/cerrado.
function GastoBranch({ node, parent, total, siblingMax, depth }: { node: Cat; parent: number; total: number; siblingMax: number; depth: number }) {
  const [open, setOpen] = useState(false);
  const hasKids = !!node.children && node.children.length > 0;
  const top = depth === 0;
  const pct = top ? (total > 0 ? node.amount / total : 0) : parent > 0 ? node.amount / parent : 0;
  const width = siblingMax > 0 ? (node.amount / siblingMax) * 100 : 0;
  const childMax = hasKids ? Math.max(...node.children!.map((c) => c.amount)) : 0;
  return (
    <li>
      <button
        type="button"
        onClick={() => hasKids && setOpen(!open)}
        aria-expanded={hasKids ? open : undefined}
        className={`w-full text-left ${hasKids ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className={`flex items-center justify-between ${top ? "text-sm mb-1" : "text-xs mb-0.5"}`}>
          <span className="flex items-center gap-2 min-w-0">
            {top && <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: node.color }} />}
            <span className={top ? "" : "text-fg/80 truncate"}>{node.label}</span>
            {hasKids && (
              <span className={`text-muted ${top ? "text-xs" : "text-[10px]"} shrink-0 transition-transform ${open ? "rotate-90" : ""}`}>›</span>
            )}
          </span>
          <span className="tabular text-muted shrink-0">{formatPct(pct)}</span>
        </div>
        <div className={`${top ? "h-2" : "h-1.5"} rounded-full bg-white/5 overflow-hidden`}>
          <div
            className="h-full rounded-full"
            style={{ background: node.color, opacity: top ? 1 : 0.6, width: `${width}%`, boxShadow: top ? `0 0 10px ${node.color}` : "none" }}
          />
        </div>
        <p className={`tabular ${top ? "text-[11px]" : "text-[10px]"} text-muted mt-0.5`}>{formatEuro(node.amount)}</p>
      </button>

      {hasKids && open && (
        <ul className="mt-1.5 ml-3 pl-3 border-l border-[var(--panel-border)] space-y-1.5">
          {[...node.children!]
            .sort((a, b) => b.amount - a.amount)
            .map((ch) => (
              <GastoBranch key={ch.key} node={ch} parent={node.amount} total={total} siblingMax={childMax} depth={depth + 1} />
            ))}
        </ul>
      )}
    </li>
  );
}

export default function RegionPanel({ region }: { region: RegionData }) {
  const m = useMessages();
  const balance = region.ingresos - region.gastos;
  const positivo = balance >= 0;
  const maxCat = Math.max(...region.gastosByCat.map((c) => c.amount));

  return (
    <motion.div
      key={region.slug}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass p-5 sm:p-6 md:p-7 min-w-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            {region.isCity ? m.panel.municipality : m.panel.province}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mt-1">{region.name}</h2>
        </div>
        {region.isSample ? (
          <span className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-full border border-[rgba(251,191,36,0.4)] text-amber bg-[rgba(251,191,36,0.08)]">
            {m.panel.sample} {region.year}
          </span>
        ) : (
          <span className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-full border border-[rgba(52,211,153,0.4)] text-green bg-[rgba(52,211,153,0.08)]">
            ● {m.panel.real} {region.year}
          </span>
        )}
      </div>
      {region.source && (
        <p className="text-[11px] text-muted mt-2">
          {m.panel.source}{" "}
          <a href={region.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
            {region.source.name}
          </a>
          {region.basis ? ` · ${region.basis}` : ""}
        </p>
      )}

      {/* Ingresos / Gastos */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-2xl p-4 bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.25)]">
          <p className="text-xs text-muted">{m.panel.income}</p>
          <p className="tabular text-xl md:text-2xl font-semibold text-green mt-1">
            <CountUp value={region.ingresos} kind="compact" duration={1.1} />
          </p>
        </div>
        <div className="rounded-2xl p-4 bg-[rgba(244,114,182,0.08)] border border-[rgba(244,114,182,0.25)]">
          <p className="text-xs text-muted">{m.panel.expense}</p>
          <p className="tabular text-xl md:text-2xl font-semibold text-magenta mt-1">
            <CountUp value={region.gastos} kind="compact" duration={1.1} />
          </p>
        </div>
      </div>
      <p className="text-xs text-muted mt-2 tabular">
        {m.panel.balance}{" "}
        <span className={positivo ? "text-green" : "text-amber"}>
          {positivo ? "+" : ""}
          {formatCompact(balance)} {positivo ? m.panel.surplus : m.panel.deficit}
        </span>
      </p>

      {/* Entradas y salidas: composición clara en dos barras */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted mb-3">{m.panel.sankeyTitle}</h3>
        <BubbleFlow region={region} />
      </div>

      {/* Desglose del gasto */}
      <div className="mt-4">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-muted">{m.panel.whereGoes}</h3>
          <p className="text-[11px] text-cyan/60">{m.panel.whereGoesHint}</p>
        </div>
        <ul className="space-y-2.5">
          {[...region.gastosByCat]
            .sort((a, b) => b.amount - a.amount)
            .map((c) => (
              <GastoBranch key={c.key} node={c} parent={region.gastos} total={region.gastos} siblingMax={maxCat} depth={0} />
            ))}
        </ul>
      </div>

      {/* Vista económica: en qué forma se gasta (personal, inversión, etc.) */}
      {region.gastosByEconomic && region.gastosByEconomic.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted mb-3">{m.panel.howSpent}</h3>
          <div className="flex flex-wrap gap-2">
            {[...region.gastosByEconomic]
              .sort((a, b) => b.amount - a.amount)
              .map((c) => (
                <div
                  key={c.key}
                  className="flex items-center gap-2 text-xs rounded-full px-3 py-1.5 border border-[var(--panel-border)]"
                >
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span>{c.label}</span>
                  <span className="tabular text-muted">{formatPct(c.amount / region.gastos)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
