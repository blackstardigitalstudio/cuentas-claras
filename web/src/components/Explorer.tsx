"use client";

import { useState } from "react";
import RegionMap from "./RegionMap";
import RegionPanel from "./RegionPanel";
import { COUNTRIES, type CountryCode } from "@/lib/data";
import { formatCompact } from "@/lib/format";
import { useMessages } from "@/i18n/LocaleProvider";

export default function Explorer() {
  const m = useMessages();
  const [country, setCountry] = useState<CountryCode>("es");
  const C = COUNTRIES[country];
  const [selected, setSelected] = useState<string>(C.defaultRegion);

  const region = C.regions[selected] ?? C.list[0];

  const switchCountry = (code: CountryCode) => {
    setCountry(code);
    setSelected(COUNTRIES[code].defaultRegion);
  };

  return (
    <div id="explorar" className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
      {/* Mapa + controles */}
      <div className="glass p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Selector de país */}
          <div className="inline-flex rounded-full border border-[var(--panel-border)] overflow-hidden text-sm">
            {(["es", "it"] as CountryCode[]).map((code) => (
              <button
                key={code}
                onClick={() => switchCountry(code)}
                aria-pressed={country === code}
                className={`px-3.5 py-1.5 transition ${
                  country === code ? "bg-[rgba(34,211,238,0.15)] text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {code === "es" ? `🇪🇸 ${m.explorer.spain}` : `🇮🇹 ${m.explorer.italy}`}
              </button>
            ))}
          </div>

          <label className="text-sm text-muted flex items-center gap-2">
            {m.explorer.province}
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="bg-[var(--bg-2)] border border-[var(--panel-border)] rounded-lg px-3 py-1.5 text-fg text-sm focus:outline-none focus:border-cyan max-w-[180px]"
            >
              {Object.entries(C.regions)
                .sort(([, a], [, b]) => a.name.localeCompare(b.name, "es"))
                .map(([key, r]) => (
                  <option key={key} value={key}>
                    {r.name}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <RegionMap country={C} selected={selected} onSelect={setSelected} />

        {/* Ciudades con datos reales */}
        <div className="mt-4">
          <p className="text-xs uppercase tracking-widest text-green mb-2">
            ● {m.explorer.withReal} <span className="text-muted">({C.realNames.length})</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {[...C.realNames]
              .sort((a, b) => C.regions[b].gastos - C.regions[a].gastos)
              .slice(0, 10)
              .map((name) => (
              <button
                key={name}
                onClick={() => setSelected(name)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  selected === name
                    ? "border-green text-fg bg-[rgba(52,211,153,0.14)]"
                    : "border-[rgba(52,211,153,0.4)] text-green hover:bg-[rgba(52,211,153,0.08)]"
                }`}
              >
                {C.regions[name].name} · <span className="tabular">{formatCompact(C.regions[name].gastos)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ranking rápido */}
        <div className="mt-4">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">{m.explorer.topSpending}</p>
          <div className="flex flex-wrap gap-2">
            {C.list.slice(0, 6).map((r) => (
              <button
                key={r.slug}
                onClick={() => setSelected(r.name)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  region === r
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
