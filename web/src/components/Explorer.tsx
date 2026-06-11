"use client";

import { useState } from "react";
import SpainMap from "./SpainMap";
import RegionPanel from "./RegionPanel";
import { REGIONS, REGION_LIST, REAL_REGION_NAMES } from "@/lib/data";
import { formatCompact } from "@/lib/format";
import { useMessages } from "@/i18n/LocaleProvider";

export default function Explorer() {
  const m = useMessages();
  const [selected, setSelected] = useState<string>("Barcelona");
  const region = REGIONS[selected] ?? REGION_LIST[0];

  return (
    <div id="explorar" className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
      {/* Mapa + controles */}
      <div className="glass p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold">{m.explorer.mapTitle}</h2>
          <label className="text-sm text-muted flex items-center gap-2">
            {m.explorer.province}
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="bg-[var(--bg-2)] border border-[var(--panel-border)] rounded-lg px-3 py-1.5 text-fg text-sm focus:outline-none focus:border-cyan"
            >
              {[...REGION_LIST]
                .sort((a, b) => a.name.localeCompare(b.name, "es"))
                .map((r) => (
                  <option key={r.slug} value={r.name}>
                    {r.name}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <SpainMap selected={selected} onSelect={setSelected} />

        {/* Ciudades con datos reales */}
        <div className="mt-4">
          <p className="text-xs uppercase tracking-widest text-green mb-2">● {m.explorer.withReal}</p>
          <div className="flex flex-wrap gap-2">
            {REAL_REGION_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => setSelected(name)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  selected === name
                    ? "border-green text-fg bg-[rgba(52,211,153,0.14)]"
                    : "border-[rgba(52,211,153,0.4)] text-green hover:bg-[rgba(52,211,153,0.08)]"
                }`}
              >
                {REGIONS[name].name} · <span className="tabular">{formatCompact(REGIONS[name].gastos)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ranking rápido */}
        <div className="mt-4">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">
            {m.explorer.topSpending}
          </p>
          <div className="flex flex-wrap gap-2">
            {REGION_LIST.slice(0, 6).map((r) => (
              <button
                key={r.slug}
                onClick={() => setSelected(r.name)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  selected === r.name
                    ? "border-cyan text-fg bg-[rgba(34,211,238,0.12)]"
                    : "border-[var(--panel-border)] text-muted hover:text-fg"
                }`}
              >
                {r.name} · <span className="tabular">{formatCompact(r.gastos)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de detalle */}
      <RegionPanel region={region} />
    </div>
  );
}
