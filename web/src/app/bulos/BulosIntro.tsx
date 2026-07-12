"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import HeroBanner from "@/components/HeroBanner";

export default function BulosIntro() {
  const { locale } = useLocale();
  const it = locale === "it";
  return (
    <>
      <div className="mt-6">
        <HeroBanner
          priority
          as="h1"
          src="/photos/news.jpg"
          alt={it ? "Giornali" : "Periódicos"}
          kicker={it ? "🕵️ Fact-check · 🇮🇹 🇪🇸 · dati veri" : "🕵️ Fact-check · 🇪🇸 🇮🇹 · datos reales"}
          title={it ? "NON FARTI FREGARE:" : "QUE NO TE ENGAÑEN:"}
          highlight={it ? "LE BUFALE SMONTATE" : "BULOS DESMONTADOS"}
          accent="#ff6b6b"
          accent2="#fdba74"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {it
            ? "Qui niente panico: ci sono i dati. Bufale virali su stipendi, tasse, aiuti e fondi europei. Ognuna già smontata dagli esperti, con la cifra vera e il link alla verifica."
            : "Aquí no hay pánico: hay datos. Bulos virales sobre sueldos, impuestos, ayudas y fondos europeos. Cada uno ya desmontado por expertos, con la cifra real y el enlace a la comprobación."}
        </p>
        <p className="text-[11px] text-muted mt-3">
          {it
            ? "Noi raccogliamo e colleghiamo solo verifiche di altri (Maldita.es, Newtral, Pagella Politica, AGI…). Il merito è loro: tocca la fonte per leggere tutto."
            : "Nosotros solo reunimos y enlazamos verificaciones de otros (Maldita.es, Newtral, Pagella Politica, AGI…). El mérito es suyo: toca la fuente para leer todo."}
        </p>
      </header>
    </>
  );
}
