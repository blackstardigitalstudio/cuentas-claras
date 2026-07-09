"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { scaleLinear } from "d3-scale";
import { interpolateHcl } from "d3-interpolate";
import { COUNTRIES, type Country } from "@/lib/data";
import worldGeo from "@/data/world.geo.json";

type Feat = { type: "Feature"; properties: { name: string }; geometry: GeoJSON.Geometry };

function coloredFC(country: Country) {
  const feats = country.geo.features as Feat[];
  const vals = feats.map((f) => country.regions[f.properties.name]?.gastos ?? 0);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const color = scaleLinear<string>()
    .domain([min, min + (max - min) * 0.45, min + (max - min) * 0.78, max])
    .range(["#15304a", "#22d3ee", "#818cf8", "#f472b6"])
    .interpolate(interpolateHcl);
  return {
    type: "FeatureCollection",
    features: feats.map((f) => ({
      ...f,
      properties: { ...f.properties, __name: f.properties.name, __color: color(country.regions[f.properties.name]?.gastos ?? 0) },
    })),
  } as GeoJSON.FeatureCollection;
}

function colorScaleFor(country: Country) {
  const feats = country.geo.features as Feat[];
  const vals = feats.map((f) => country.regions[f.properties.name]?.gastos ?? 0);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return scaleLinear<string>()
    .domain([min, min + (max - min) * 0.45, min + (max - min) * 0.78, max])
    .range(["#15304a", "#22d3ee", "#818cf8", "#f472b6"])
    .interpolate(interpolateHcl);
}

// Centroide approssimato (media dei vertici) — sufficiente per posizionare un nodo.
function centroid(geom: GeoJSON.Geometry): [number, number] | null {
  let sx = 0, sy = 0, n = 0;
  const walk = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === "number") {
      sx += c[0] as number; sy += c[1] as number; n++;
    } else if (Array.isArray(c)) c.forEach(walk);
  };
  walk((geom as { coordinates: unknown }).coordinates);
  return n ? [sx / n, sy / n] : null;
}

// Nodi luminosi pulsanti sulle città con più spesa (stile dashboard globale).
function placeMarkers(
  map: maplibregl.Map,
  country: Country,
  store: maplibregl.Marker[],
  onSelect: (name: string) => void
) {
  try {
    store.forEach((m) => m.remove());
    store.length = 0;
    const feats = country.geo.features as Feat[];
    const color = colorScaleFor(country);
    // Usa direttamente le feature geo (nome sempre coerente con le regioni) e tieni
    // solo quelle con dati reali; poi i 10 comuni con più spesa → nodi pulsanti.
    const top = feats
      .map((f) => ({ f, r: country.regions[f.properties.name] }))
      .filter((x) => x.r && !x.r.isSample && x.r.gastos > 0)
      .sort((a, b) => b.r.gastos - a.r.gastos)
      .slice(0, 10);
    for (const { f, r } of top) {
      const c = centroid(f.geometry);
      if (!c) continue;
      const el = document.createElement("div");
      el.className = "cc-pulse";
      el.style.setProperty("--cc", color(r.gastos));
      el.title = `${r.name} · ${Math.round(r.gastos / 1e6)} M€`;
      el.innerHTML = '<span class="cc-pulse-ring"></span><span class="cc-pulse-ring r2"></span><span class="cc-pulse-dot"></span>';
      el.addEventListener("click", (ev) => { ev.stopPropagation(); onSelect(f.properties.name); });
      store.push(new maplibregl.Marker({ element: el }).setLngLat(c).addTo(map));
    }
  } catch {
    /* i nodi sono decorativi: un errore non deve rompere la mappa */
  }
}

function bounds(country: Country): [[number, number], [number, number]] {
  let minX = 180, minY = 90, maxX = -180, maxY = -90;
  const walk = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === "number") {
      const [x, y] = c as number[];
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    } else if (Array.isArray(c)) c.forEach(walk);
  };
  (country.geo.features as Feat[]).forEach((f) => walk((f.geometry as { coordinates: unknown }).coordinates));
  return [[minX, minY], [maxX, maxY]];
}

// L'altro paese attivo (per ora ES↔IT): si mostra colorato ma attenuato, così
// sulla mappa-mondo si vedono SEMPRE entrambe le zone attive.
function otherOf(country: Country): Country {
  return COUNTRIES[country.code === "es" ? "it" : "es"];
}

export default function RegionMapGL({
  country,
  selected,
  onSelect,
}: {
  country: Country;
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // init once
  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: { version: 8, sources: {}, layers: [{ id: "bg", type: "background", paint: { "background-color": "#05070f" } }] },
      center: [-3.5, 42],
      zoom: 4.2,
      minZoom: 1.6, // no se puede alejar hasta perder el mapa (el mundo llena la vista)
      maxZoom: 8,
      attributionControl: false,
      dragRotate: false, // sin rotación: nunca "giras y no ves nada"
      pitchWithRotate: false,
      maxPitch: 0,
    });
    map.touchZoomRotate.disableRotation();
    map.dragRotate.disable();
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }), "top-right");

    map.on("load", () => {
      // Backdrop del mondo: tutti i paesi in scuro (per ora solo ES/IT sono attive).
      map.addSource("world", { type: "geojson", data: worldGeo as unknown as GeoJSON.FeatureCollection });
      map.addLayer({ id: "world-fill", type: "fill", source: "world", paint: { "fill-color": "#0c1730", "fill-opacity": 0.9 } });
      map.addLayer({ id: "world-line", type: "line", source: "world", paint: { "line-color": "#1c2c50", "line-width": 0.5 } });

      // L'altra zona attiva (colorata ma attenuata, non interattiva): si vede
      // sempre insieme a quella attiva → "tutto il mondo, per ora due zone".
      try {
        map.addSource("regions-other", { type: "geojson", data: coloredFC(otherOf(country)) });
        map.addLayer({ id: "fill-other", type: "fill", source: "regions-other", paint: { "fill-color": ["get", "__color"], "fill-opacity": 0.32 } });
        map.addLayer({ id: "line-other", type: "line", source: "regions-other", paint: { "line-color": "#05070f", "line-width": 0.4 } });
      } catch {
        /* la seconda zona è decorativa: un errore non deve rompere la mappa */
      }

      map.addSource("regions", { type: "geojson", data: coloredFC(country) });
      map.addLayer({ id: "fill", type: "fill", source: "regions", paint: { "fill-color": ["get", "__color"], "fill-opacity": 0.85 } });
      map.addLayer({ id: "fill-hover", type: "fill", source: "regions", paint: { "fill-color": "#ffffff", "fill-opacity": 0.12 }, filter: ["==", "__name", ""] });
      map.addLayer({ id: "line", type: "line", source: "regions", paint: { "line-color": "#05070f", "line-width": 0.5 } });
      map.addLayer({ id: "sel", type: "line", source: "regions", paint: { "line-color": "#ffffff", "line-width": 2, "line-blur": 0.4 }, filter: ["==", "__name", selected ?? ""] });
      // Inquadratura stretta sul paese attivo (bella piena); l'altra zona resta
      // attenuata e si vede facendo zoom-out (mappa-mondo).
      map.fitBounds(bounds(country), { padding: 24, duration: 0 });

      map.on("click", "fill", (e) => {
        const n = e.features?.[0]?.properties?.__name;
        if (n) onSelectRef.current(String(n));
      });
      let hovered = "";
      map.on("mousemove", "fill", (e) => {
        const n = String(e.features?.[0]?.properties?.__name ?? "");
        if (n !== hovered) { hovered = n; map.setFilter("fill-hover", ["==", "__name", n]); }
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "fill", () => { hovered = ""; map.setFilter("fill-hover", ["==", "__name", ""]); map.getCanvas().style.cursor = ""; });

      placeMarkers(map, country, markersRef.current, (n) => onSelectRef.current(n));
    });

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // country change → swap data + refit
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource("regions") as maplibregl.GeoJSONSource | undefined;
      if (!src) return;
      src.setData(coloredFC(country));
      const other = map.getSource("regions-other") as maplibregl.GeoJSONSource | undefined;
      if (other) other.setData(coloredFC(otherOf(country)));
      map.fitBounds(bounds(country), { padding: 24, duration: 800 });
      placeMarkers(map, country, markersRef.current, (n) => onSelectRef.current(n));
    };
    if (map.isStyleLoaded() && map.getSource("regions")) apply();
    else map.once("idle", apply);
  }, [country]);

  // selected highlight
  useEffect(() => {
    const map = mapRef.current;
    if (map && map.getLayer("sel")) map.setFilter("sel", ["==", "__name", selected ?? ""]);
  }, [selected]);

  return <div ref={ref} className="w-full h-[420px] md:h-[480px] rounded-xl overflow-hidden" aria-label="Mapa interactivo (zoom, paneo y rotación)" />;
}
