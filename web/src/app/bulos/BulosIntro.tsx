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
            ? "Niente panico: qui ci sono i dati. Sono le bufale che girano su stipendi, tasse, aiuti e fondi europei. Gli esperti le hanno già smontate. Per ognuna trovi la cifra vera e il link alla verifica."
            : "Nada de pánico: aquí hay datos. Son los bulos que corren sobre sueldos, impuestos, ayudas y fondos europeos. Los expertos ya los han desmontado. En cada uno ves la cifra real y el enlace a la comprobación."}
        </p>
        <p className="text-[11px] text-muted mt-3">
          {it
            ? "Le verifiche non sono nostre. Le fanno altri: Maldita.es, Newtral, Pagella Politica, AGI… Noi le raccogliamo e le colleghiamo. Il merito è loro. Tocca la fonte per leggere tutto."
            : "Las comprobaciones no son nuestras. Las hacen otros: Maldita.es, Newtral, Pagella Politica, AGI… Nosotros las reunimos y las enlazamos. El mérito es suyo. Toca la fuente para leerlo todo."}
        </p>
      </header>
    </>
  );
}
