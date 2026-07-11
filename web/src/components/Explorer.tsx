"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import RegionPanel from "./RegionPanel";

// MapLibre usa WebGL → solo cliente (sin SSR).
const RegionMapGL = dynamic(() => import("./RegionMapGL"), {
  ssr: false,
  loading: () => <div className="w-full h-[420px] md:h-[480px] rounded-xl bg-[var(--bg-2)] animate-pulse" />,
});
import { COUNTRIES, type CountryCode } from "@/lib/data";
import { formatCompact } from "@/lib/format";
import { useLocale } from "@/i18n/LocaleProvider";

export default function Explorer() {
  const { locale, m } = useLocale();
  const [country, setCountry] = useState<CountryCode>("es");
  const C = COUNTRIES[country];
  const [selected, setSelected] = useState<string>(C.defaultRegion);

  const region = C.regions[selected] ?? C.list[0];

  const switchCountry = (code: CountryCode) => {
    setCountry(code);
    setSelected(COUNTRIES[code].defaultRegion);
  };

  return (
    <div id="explorar" className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start min-w-0">
      {/* Mapa + controles */}
      <div className="glass p-4 sm:p-5 md:p-6 min-w-0 overflow-hidden">
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

        <RegionMapGL country={C} selected={selected} onSelect={setSelected} />

        {/* Leyenda SÚPER BÁSICA del mapa: qué significan los puntos y los colores */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan" />
            </span>
            {locale === "it" ? "punti che brillano = città che spendono di più" : "puntos que brillan = ciudades que más gastan"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-14 rounded-full" style={{ background: "linear-gradient(90deg,#15304a,#22d3ee,#818cf8,#f472b6)" }} />
            {locale === "it" ? "colore = livello di spesa" : "color = nivel de gasto"}
          </span>
          <span className="text-cyan/80">👆 {locale === "it" ? "tocca la tua città per vedere i conti" : "toca tu ciudad para ver sus cuentas"}</span>
        </div>

        {/* Top spesa — barre orizzontali stile dashboard ("consumption by region") */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs uppercase tracking-widest text-green">
              ● {m.explorer.withReal} <span className="text-muted">({C.realNames.length})</span>
            </p>
            <p className="text-[11px] uppercase tracking-widest text-muted">{m.explorer.topSpending}</p>
          </div>
          <ul className="space-y-1">
            {(() => {
              const rows = [...C.realNames]
                .map((key) => ({ key, r: C.regions[key] }))
                .filter((x) => x.r && x.r.gastos > 0)
                .sort((a, b) => b.r.gastos - a.r.gastos)
                .slice(0, 8);
              const max = rows[0]?.r.gastos || 1;
              return rows.map(({ key, r }, i) => (
                <li key={key}>
                  <button
                    onClick={() => setSelected(key)}
                    className={`w-full text-left flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition ${
                      selected === key ? "bg-[rgba(34,211,238,0.1)]" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="tabular text-[11px] text-muted w-4 shrink-0 text-right">{i + 1}</span>
                    <span className="text-xs text-fg/85 w-20 sm:w-28 shrink-0 truncate">{r.name}</span>
                    <span className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-cyan to-magenta"
                        style={{ width: `${Math.max(6, (r.gastos / max) * 100)}%`, boxShadow: "0 0 8px rgba(34,211,238,0.45)" }}
                      />
                    </span>
                    <span className="tabular text-[11px] text-fg/90 w-14 shrink-0 text-right">{formatCompact(r.gastos)}</span>
                  </button>
                </li>
              ));
            })()}
          </ul>
        </div>
      </div>

      {/* Panel de detalle */}
      <RegionPanel region={region} />
    </div>
  );
}
