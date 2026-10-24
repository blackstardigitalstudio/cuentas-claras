"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import ScoopCard from "./ScoopCard";
import { useLiveNews } from "@/lib/useLiveNews";

// Un filón temático del rincón scoop (corrupción, fondos, sentencias, despilfarro).
// Lee data[`<locale>_<theme>`]. Si hay menos de 2 titulares, no se muestra.
export default function ScoopSection({
  theme,
  max,
  badge,
}: {
  theme: "scoop" | "defense" | "funds" | "verdicts" | "waste" | "nepotism" | "sanctions" | "investigations" | "salaries" | "works" | "subsidies" | "taxes" | "transparency";
  // Fuori dalla pagina scandali: quante card mostrare e che etichetta (non "caso").
  max?: number;
  badge?: string;
}) {
  const { locale, m } = useLocale();
  const { data } = useLiveNews();
  const items = (data[`${locale}_${theme}`] || data[`es_${theme}`] || []).slice(0, max);
  if (items.length < 2) return null;
  // Le notizie su difesa e armi non sono «casi»: etichetta neutra anche nella pagina scandali.
  const label = badge ?? (theme === "defense" ? (locale === "it" ? "Notizia" : "Noticia") : undefined);

  return (
    <section className="mt-12 scroll-mt-20">
      <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
        <span className="inline-block h-4 w-1 rounded-full bg-[#ff5252]" />
        {m.scoop.themes[theme]}
        <span className="text-muted font-normal text-sm">· {items.length}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((n, i) => (
          <ScoopCard key={i} n={n} badge={label} />
        ))}
      </div>
    </section>
  );
}
