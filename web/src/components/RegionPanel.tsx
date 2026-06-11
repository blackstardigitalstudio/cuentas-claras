"use client";

import { motion } from "motion/react";
import type { RegionData } from "@/lib/data";
import { formatCompact, formatEuro, formatPct } from "@/lib/format";
import Sankey from "./Sankey";

export default function RegionPanel({ region }: { region: RegionData }) {
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
            {region.isCity ? "Ayuntamiento" : "Provincia"}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mt-1">{region.name}</h2>
        </div>
        {region.isSample ? (
          <span className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-full border border-[rgba(251,191,36,0.4)] text-amber bg-[rgba(251,191,36,0.08)]">
            Ejemplo {region.year}
          </span>
        ) : (
          <span className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-full border border-[rgba(52,211,153,0.4)] text-green bg-[rgba(52,211,153,0.08)]">
            ● Datos reales {region.year}
          </span>
        )}
      </div>
      {region.source && (
        <p className="text-[11px] text-muted mt-2">
          Fuente:{" "}
          <a href={region.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
            {region.source.name}
          </a>
          {region.basis ? ` · ${region.basis}` : ""}
        </p>
      )}

      {/* Ingresos / Gastos */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-2xl p-4 bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.25)]">
          <p className="text-xs text-muted">Ingresos</p>
          <p className="tabular text-xl md:text-2xl font-semibold text-green mt-1">
            {formatCompact(region.ingresos)}
          </p>
        </div>
        <div className="rounded-2xl p-4 bg-[rgba(244,114,182,0.08)] border border-[rgba(244,114,182,0.25)]">
          <p className="text-xs text-muted">Gastos</p>
          <p className="tabular text-xl md:text-2xl font-semibold text-magenta mt-1">
            {formatCompact(region.gastos)}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted mt-2 tabular">
        Saldo:{" "}
        <span className={positivo ? "text-green" : "text-amber"}>
          {positivo ? "+" : ""}
          {formatCompact(balance)} {positivo ? "(superávit)" : "(déficit)"}
        </span>
      </p>

      {/* Sankey */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted mb-1">Sigue el euro: del ingreso al gasto</h3>
        <Sankey region={region} />
      </div>

      {/* Desglose del gasto */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-muted mb-3">¿A dónde va el gasto?</h3>
        <ul className="space-y-2.5">
          {[...region.gastosByCat]
            .sort((a, b) => b.amount - a.amount)
            .map((c) => (
              <li key={c.key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                    {c.label}
                  </span>
                  <span className="tabular text-muted">
                    {formatPct(c.amount / region.gastos)}
                  </span>
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
              </li>
            ))}
        </ul>
      </div>

      {/* Vista económica: en qué forma se gasta (personal, inversión, etc.) */}
      {region.gastosByEconomic && region.gastosByEconomic.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted mb-3">¿En qué forma se gasta?</h3>
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
