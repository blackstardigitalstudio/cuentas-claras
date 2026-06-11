"use client";

import { useMemo, useState } from "react";
import { geoPath, geoMercator } from "d3-geo";
import { geoConicConformalSpain } from "d3-composite-projections";
import { scaleLinear } from "d3-scale";
import { interpolateHcl } from "d3-interpolate";
import type { Country } from "@/lib/data";

const W = 800;
const H = 520;

export default function RegionMap({
  country,
  selected,
  onSelect,
}: {
  country: Country;
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const { paths, borders, color } = useMemo(() => {
    const features = country.geo.features as {
      properties: { name: string };
      geometry: GeoJSON.Geometry;
    }[];

    const values = features.map((f) => country.regions[f.properties.name]?.gastos ?? 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const color = scaleLinear<string>()
      .domain([min, min + (max - min) * 0.45, min + (max - min) * 0.78, max])
      .range(["#15304a", "#22d3ee", "#818cf8", "#f472b6"])
      .interpolate(interpolateHcl);

    const projection =
      country.mapKind === "spain" ? geoConicConformalSpain() : geoMercator();
    projection.fitSize([W, H], country.geo as never);
    const path = geoPath(projection as never);
    const paths = features.map((f) => ({ name: f.properties.name, d: path(f as never) ?? "" }));
    const borders =
      country.mapKind === "spain"
        ? (projection as ReturnType<typeof geoConicConformalSpain>).getCompositionBorders()
        : "";
    return { paths, borders, color };
  }, [country]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto select-none"
      role="img"
      aria-label="Mapa interactivo. Pulsa una provincia para ver sus cuentas."
    >
      <g>
        {paths.map((p) => {
          const v = country.regions[p.name]?.gastos ?? 0;
          const isSel = selected === p.name;
          const isHover = hover === p.name;
          const fill = color(v);
          return (
            <path
              key={p.name}
              d={p.d}
              className={`region-path ${isSel ? "selected" : ""}`}
              style={{ color: fill, fill }}
              opacity={selected && !isSel ? (isHover ? 0.95 : 0.55) : 1}
              onMouseEnter={() => setHover(p.name)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(p.name)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(p.name);
                }
              }}
            >
              <title>{p.name}</title>
            </path>
          );
        })}
      </g>
      {borders && (
        <path d={borders} fill="none" stroke="rgba(120,160,255,0.35)" strokeWidth={0.8} strokeDasharray="3 3" />
      )}
      {hover && (
        <text
          x={W / 2}
          y={H - 8}
          textAnchor="middle"
          className="tabular"
          fill="#e8edff"
          fontSize={15}
          style={{ pointerEvents: "none" }}
        >
          {hover}
        </text>
      )}
    </svg>
  );
}
