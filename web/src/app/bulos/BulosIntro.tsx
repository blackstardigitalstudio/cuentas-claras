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
          kicker={it ? "Fact-check · 🇮🇹 🇪🇸 · dati ufficiali" : "Fact-check · 🇪🇸 🇮🇹 · datos oficiales"}
          title={it ? "BUFALE SUI SOLDI PUBBLICI," : "BULOS DEL DINERO PÚBLICO,"}
          highlight={it ? "SMONTATE" : "DESMONTADOS"}
          accent="#22d3ee"
          accent2="#34d399"
        />
      </div>
      <header className="pt-5">
        <p className="text-sm md:text-base text-muted max-w-2xl">
          {it
            ? "Andiamo controcorrente: qui niente panico, ci sono i dati. Bufale virali su stipendi, tasse, aiuti e fondi europei, già verificate da fact-checker indipendenti, con la cifra vera e il link alla verifica originale."
            : "Vamos al revés del ruido: aquí no hay pánico, hay datos. Bulos virales sobre sueldos, impuestos, ayudas y fondos europeos, ya verificados por fact-checkers independientes, con la cifra real y el enlace a la verificación original."}
        </p>
        <p className="text-[11px] text-muted mt-3">
          {it
            ? "Cuentas Claras raccoglie e collega le verifiche di terzi (Maldita.es, Newtral, Pagella Politica, AGI…). Il merito è di ogni verificatore; tocca la fonte per leggere l'analisi completa."
            : "Cuentas Claras recopila y enlaza verificaciones de terceros (Maldita.es, Newtral, Pagella Politica, AGI…). El crédito es de cada verificador; toca la fuente para leer el análisis completo."}
        </p>
      </header>
    </>
  );
}
