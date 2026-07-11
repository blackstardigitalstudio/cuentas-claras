"use client";

import Link from "next/link";
import { LocaleProvider, useLocale } from "@/i18n/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import HeroBanner from "@/components/HeroBanner";
import { formatEuro } from "@/lib/format";
import type { Rec } from "./page";

type CountryData = { records: Rec[]; noDebt: number };
type Props = { data: { es: CountryData; it: CountryData } };

const LABELS: Record<string, { es: [string, string]; it: [string, string]; emoji: string; accent: string }> = {
  salary: { emoji: "💰", accent: "#a5b4fc", es: ["El alcalde mejor pagado", "cobra al año"], it: ["Il sindaco più pagato", "guadagna all'anno"] },
  debt: { emoji: "🏦", accent: "#fdba74", es: ["La ciudad más endeudada", "de deuda viva"], it: ["La città più indebitata", "di debito residuo"] },
  debtpc: { emoji: "👤", accent: "#f472b6", es: ["Más deuda por habitante", "por habitante"], it: ["Più debito per abitante", "per abitante"] },
  spend: { emoji: "💸", accent: "#22d3ee", es: ["La que más gasta", "de gasto al año"], it: ["Quella che spende di più", "di spesa all'anno"] },
  spendpc: { emoji: "📊", accent: "#34d399", es: ["Más gasto por habitante", "por habitante"], it: ["Più spesa per abitante", "per abitante"] },
};

function value(rec: Rec): string {
  return formatEuro(rec.kind === "eurpc" ? Math.round(rec.v) : rec.v);
}

function CountrySection({ code, cd }: { code: "es" | "it"; cd: CountryData }) {
  const { locale } = useLocale();
  const it = locale === "it";
  const flag = code === "es" ? "🇪🇸" : "🇮🇹";
  const heading = code === "es" ? (it ? "Spagna" : "España") : "Italia";
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-4">{flag} {heading}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {cd.records.map((rec) => {
          const L = LABELS[rec.key];
          const [title, suffix] = it ? L.it : L.es;
          return (
            <Link key={rec.key} href={`/${code}/${rec.slug}/`} className="glass p-4 relative overflow-hidden group" style={{ borderColor: `${L.accent}33` }}>
              <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${L.accent},transparent)` }} />
              <p className="text-xs uppercase tracking-wide" style={{ color: L.accent }}>{L.emoji} {title}</p>
              <p className="text-xl font-bold mt-1 group-hover:text-fg transition">{rec.name}</p>
              <p className="tabular text-2xl font-semibold mt-1" style={{ color: L.accent }}>{value(rec)}</p>
              <p className="text-[11px] text-muted mt-0.5">{suffix}</p>
            </Link>
          );
        })}
      </div>
      {cd.noDebt > 0 && (
        <p className="text-sm text-muted mt-3">
          {it
            ? `Buona notizia: ${cd.noDebt} città con dati reali non hanno alcun debito residuo.`
            : `Buena noticia: ${cd.noDebt} ciudades con datos reales no tienen ninguna deuda viva.`}
        </p>
      )}
    </section>
  );
}

function Inner({ data }: Props) {
  const { locale } = useLocale();
  const it = locale === "it";
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-24">
      <SiteNav />
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/money.jpg"
          alt={it ? "Moneta da 2 euro" : "Moneda de 2 euros"}
          kicker={it ? "🏆 record · dati ufficiali" : "🏆 récords · datos oficiales"}
          title={it ? "I RECORD DEI" : "LOS RÉCORDS DEL"}
          highlight={it ? "SOLDI PUBBLICI" : "DINERO PÚBLICO"}
          accent="#22d3ee"
          accent2="#a78bfa"
        />
      </div>
      <article className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {it
            ? "Chi paga di più il sindaco, chi ha più debito, chi spende di più — i primati tra tutte le città con dati reali. Ogni record porta alla scheda della città, con la fonte ufficiale."
            : "Quién paga más a su alcalde, quién tiene más deuda, quién más gasta — los récords entre todas las ciudades con datos reales. Cada récord lleva a la ficha de la ciudad, con la fuente oficial."}
        </p>

        <CountrySection code="es" cd={data.es} />
        <CountrySection code="it" cd={data.it} />

        <nav className="mt-10 pt-6 border-t border-[var(--panel-border)] flex flex-wrap gap-2">
          {[
            { href: "/sueldos-alcaldes/", t: it ? "Stipendi dei sindaci" : "Sueldos de alcaldes" },
            { href: "/deuda-municipios/", t: it ? "Debito dei comuni" : "Deuda municipal" },
            { href: "/ranking/", t: it ? "Classifica di spesa" : "Ranking de gasto" },
            { href: it ? "/confronta/" : "/comparar/", t: it ? "Confronta comuni" : "Comparar ciudades" },
          ].map((p) => (
            <Link key={p.href} href={p.href} className="px-3 py-1.5 rounded-full text-sm border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition">{p.t}</Link>
          ))}
        </nav>

        <p className="text-[11px] text-muted mt-8">
          {it
            ? "Fonti ufficiali: stipendi da ISPA (ES) e per legge L.234/2021 (IT); debito dal Ministero delle Finanze; spesa dai bilanci comunali. Popolazione INE/ISTAT. Calcolato solo sulle città con dati reali."
            : "Fuentes oficiales: sueldos del ISPA (ES) y por ley L.234/2021 (IT); deuda del Ministerio de Hacienda; gasto de los presupuestos municipales. Población INE/ISTAT. Calculado solo sobre las ciudades con datos reales."}
        </p>

        <footer className="mt-16 pt-8 border-t border-[var(--panel-border)] text-sm text-muted">
          <p><span className="neon-text font-semibold">Cuentas Claras</span> · Made in Italy 🇮🇹</p>
        </footer>
      </article>
    </main>
  );
}

export default function RecordsClient({ data }: Props) {
  return (
    <LocaleProvider>
      <Inner data={data} />
    </LocaleProvider>
  );
}
