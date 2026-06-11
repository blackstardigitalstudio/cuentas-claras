"use client";

import { useMemo, useId } from "react";
import {
  sankey,
  sankeyLinkHorizontal,
  type SankeyNodeMinimal,
  type SankeyLinkMinimal,
} from "d3-sankey";
import type { RegionData } from "@/lib/data";
import { formatCompact } from "@/lib/format";

type N = SankeyNodeMinimal<NodeExtra, object> & NodeExtra;
type NodeExtra = { name: string; color: string };

const W = 760;
const H = 360;

export default function Sankey({ region }: { region: RegionData }) {
  const uid = useId().replace(/:/g, "");

  const { nodes, links } = useMemo(() => {
    const nodeDefs: NodeExtra[] = [
      ...region.ingresosByCat.map((c) => ({ name: c.label, color: c.color })),
      { name: "Presupuesto", color: "#e8edff" },
      ...region.gastosByCat.map((c) => ({ name: c.label, color: c.color })),
    ];
    const centerIdx = region.ingresosByCat.length;

    const linkDefs = [
      ...region.ingresosByCat.map((c, i) => ({
        source: i,
        target: centerIdx,
        value: c.amount,
        color: c.color,
      })),
      ...region.gastosByCat.map((c, i) => ({
        source: centerIdx,
        target: centerIdx + 1 + i,
        value: c.amount,
        color: c.color,
      })),
    ];

    const layout = sankey<NodeExtra, object>()
      .nodeWidth(14)
      .nodePadding(14)
      .extent([
        [2, 6],
        [W - 2, H - 6],
      ]);

    const graph = layout({
      nodes: nodeDefs.map((d) => ({ ...d })),
      links: linkDefs.map((d) => ({ ...d })),
    });
    return graph as {
      nodes: N[];
      links: (SankeyLinkMinimal<NodeExtra, object> & { color: string; width?: number })[];
    };
  }, [region]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Diagrama de flujo: de los ingresos al gasto">
      <defs>
        {links.map((l, i) => {
          const s = l.source as N;
          const t = l.target as N;
          return (
            <linearGradient key={i} id={`${uid}-g${i}`} gradientUnits="userSpaceOnUse" x1={s.x1} x2={t.x0}>
              <stop offset="0%" stopColor={(l.source as N).color} stopOpacity={0.85} />
              <stop offset="100%" stopColor={(l.target as N).color} stopOpacity={0.85} />
            </linearGradient>
          );
        })}
      </defs>

      <g fill="none">
        {links.map((l, i) => (
          <path
            key={i}
            d={sankeyLinkHorizontal()(l as never) ?? ""}
            stroke={`url(#${uid}-g${i})`}
            strokeWidth={Math.max(1, l.width ?? 1)}
            strokeOpacity={0.45}
          />
        ))}
      </g>

      <g>
        {nodes.map((n, i) => (
          <g key={i}>
            <rect
              x={n.x0}
              y={n.y0}
              width={(n.x1 ?? 0) - (n.x0 ?? 0)}
              height={Math.max(1, (n.y1 ?? 0) - (n.y0 ?? 0))}
              fill={n.color}
              rx={2}
              style={{ filter: `drop-shadow(0 0 6px ${n.color})` }}
            />
            <text
              x={(n.x0 ?? 0) < W / 2 ? (n.x1 ?? 0) + 6 : (n.x0 ?? 0) - 6}
              y={((n.y0 ?? 0) + (n.y1 ?? 0)) / 2}
              dy="0.32em"
              textAnchor={(n.x0 ?? 0) < W / 2 ? "start" : "end"}
              fontSize={10.5}
              fill="#c8d2f0"
            >
              {n.name === "Presupuesto" ? "" : n.name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
