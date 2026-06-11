import Explorer from "@/components/Explorer";
import { REGIONS, TOTALS, DATA_SOURCE_URL } from "@/lib/data";
import { formatCompact } from "@/lib/format";

const bcn = REGIONS["Barcelona"];

export default function Home() {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      {/* Aviso de integridad de datos */}
      <div className="mt-4 flex justify-center">
        <div className="text-center text-[12px] text-muted bg-[rgba(120,160,255,0.06)] border border-[var(--panel-border)] rounded-full px-4 py-1.5 inline-flex items-center gap-2">
          <span className="text-green">● Barcelona: datos reales 2024</span>
          <span className="opacity-50">·</span>
          <span className="text-amber/90">resto de provincias: cifras de ejemplo (carga en curso)</span>
        </div>
      </div>

      {/* Hero */}
      <section className="text-center pt-10 md:pt-16 pb-10">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-cyan/80 mb-4">
          Transparencia · Datos públicos · España
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.05]">
          ¿A dónde va <span className="neon-text">el dinero público</span>?
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted max-w-2xl mx-auto">
          Explora de forma clara los <strong className="text-fg">ingresos</strong> y{" "}
          <strong className="text-fg">gastos</strong> de los ayuntamientos españoles.
          Mapa interactivo por provincia y categoría, con datos oficiales.
        </p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <a
            href="#explorar"
            className="px-6 py-3 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition shadow-[0_0_30px_-6px_var(--cyan)]"
          >
            Explorar el mapa
          </a>
          <a
            href={DATA_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-medium border border-[var(--panel-border)] text-muted hover:text-fg transition"
          >
            Fuente oficial
          </a>
        </div>
      </section>

      {/* Tira de estadísticas */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {[
          { label: "Provincias en el mapa", value: String(TOTALS.count) },
          { label: "Barcelona · ingresos 2024", value: formatCompact(bcn.ingresos) },
          { label: "Barcelona · gastos 2024", value: formatCompact(bcn.gastos) },
          { label: "Datos reales", value: "Open Data" },
        ].map((s) => (
          <div key={s.label} className="glass px-4 py-5 text-center">
            <p className="tabular text-xl md:text-2xl font-semibold neon-text">{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Explorador */}
      <Explorer />

      {/* Cómo funciona */}
      <section className="mt-16 grid md:grid-cols-3 gap-4">
        {[
          {
            t: "Datos oficiales",
            d: "Las cifras provienen de las liquidaciones presupuestarias que los ayuntamientos comunican al Ministerio de Hacienda.",
          },
          {
            t: "Siempre actualizado",
            d: "No es 'tiempo real' (los presupuestos se publican por periodos), pero el sitio se regenera al publicarse nuevos datos.",
          },
          {
            t: "Lenguaje claro",
            d: "Traducimos la clasificación técnica a categorías que cualquier ciudadano entiende: educación, social, servicios básicos…",
          },
        ].map((c) => (
          <div key={c.t} className="glass p-5">
            <h3 className="font-semibold mb-2">{c.t}</h3>
            <p className="text-sm text-muted">{c.d}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted flex flex-col md:flex-row items-center justify-between gap-3">
        <p>
          <span className="neon-text font-semibold">Cuentas Claras</span> · Datos:{" "}
          <a href={DATA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">
            Ministerio de Hacienda
          </a>
        </p>
        <p>Hecho con datos públicos, para la ciudadanía · Made in Italy 🇮🇹</p>
      </footer>
    </main>
  );
}
