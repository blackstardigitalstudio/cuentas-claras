"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { RegionData } from "@/lib/data";
import { formatCompact, formatEuro, formatPct } from "@/lib/format";
import { CountUp } from "./Motion";
import Donuts from "./Donuts";
import { useMessages } from "@/i18n/LocaleProvider";

export default function RegionPanel({ region }: { region: RegionData }) {
  const m = useMessages();
  const [openCat, setOpenCat] = useState<string | null>(null);
  const balance = region.ingresos - region.gastos;
  const positivo = balance >= 0;
  const maxCat = Math.max(...region.gastosByCat.map((c) => c.amount));

  return (
    <motion.div
      key={region.slug}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass p-6 md:p-7"
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
        <Donuts region={region} />
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
            .map((c) => {
              const hasKids = !!c.children && c.children.length > 0;
              const isOpen = openCat === c.key;
              return (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={() => hasKids && setOpenCat(isOpen ? null : c.key)}
                    aria-expanded={hasKids ? isOpen : undefined}
                    className={`w-full text-left ${hasKids ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                        {c.label}
                        {hasKids && (
                          <span className={`text-muted text-xs transition-transform ${isOpen ? "rotate-90" : ""}`}>
                            ›
                          </span>
                        )}
                      </span>
                      <span className="tabular text-muted">{formatPct(c.amount / region.gastos)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.amount / maxCat) * 100}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <p className="tabular text-[11px] text-muted mt-0.5">{formatEuro(c.amount)}</p>
                  </button>

                  {hasKids && isOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 ml-4 pl-3 border-l border-[var(--panel-border)] space-y-2"
                    >
                      {[...c.children!]
                        .sort((a, b) => b.amount - a.amount)
                        .map((sc) => (
                          <li key={sc.key}>
                            <div className="flex items-center justify-between text-xs mb-0.5">
                              <span className="text-fg/80">{sc.label}</span>
                              <span className="tabular text-muted">{formatPct(sc.amount / c.amount)}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ background: sc.color, opacity: 0.65, width: `${(sc.amount / c.amount) * 100}%` }}
                              />
                            </div>
                            <p className="tabular text-[10px] text-muted mt-0.5">{formatEuro(sc.amount)}</p>
                          </li>
                        ))}
                    </motion.ul>
                  )}
                </li>
              );
            })}
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
