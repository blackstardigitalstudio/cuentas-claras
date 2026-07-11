"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Mascot from "./Mascot";

// Claro te acompaña "de la mano": compañero flotante con bocadillo que cambia
// según la página, un mini-tour la primera vez, saludo distinto cada día y un
// saltito al abrir. Cerrar = se queda de botón; "no mostrar más" lo oculta.

type Lang = "es" | "it";

const TOUR: Record<Lang, string[]> = {
  it: [
    "Ciao! Sono Claro 👋 Ti faccio fare un giro velocissimo, dura un attimo.",
    "Cerca la tua città nella barra qui sopra 🔎 e vedrai i suoi conti veri.",
    "Non capisci un numero? Apri il riquadro «In parole semplici»: te lo spiego io, facile facile.",
    "Qui è tutto ufficiale e verificato. Buona esplorazione! 🎉",
  ],
  es: [
    "¡Hola! Soy Claro 👋 Te hago un tour rapidísimo, dura un momento.",
    "Busca tu ciudad en la barra de arriba 🔎 y verás sus cuentas reales.",
    "¿No entiendes un número? Abre la caja «En cristiano»: te lo explico yo, muy fácil.",
    "Aquí todo es oficial y verificado. ¡Buena exploración! 🎉",
  ],
};

const HOME_TIPS: Record<Lang, string[]> = {
  it: [
    "Ciao! Sono Claro 👋 Ti spiego i conti pubblici in parole semplici. Cerca la tua città!",
    "Bentornato! Vuoi sapere quanto spende la tua città? Cercala qui sopra 🔎",
    "Curiosità del giorno: sai quanto guadagna il tuo sindaco? Dai un'occhiata 😊",
    "I conti pubblici non devono essere noiosi. Te li spiego io, facile facile!",
  ],
  es: [
    "¡Hola! Soy Claro 👋 Te explico las cuentas públicas fácil. ¡Busca tu ciudad!",
    "¡Bienvenido de nuevo! ¿Cuánto gasta tu ciudad? Búscala arriba 🔎",
    "Curiosidad del día: ¿sabes cuánto cobra tu alcalde? Échale un ojo 😊",
    "Las cuentas públicas no tienen por qué ser aburridas. ¡Te las explico yo!",
  ],
};

function contextTip(path: string, lang: Lang): string {
  const it = lang === "it";
  if (/^\/(es|it)\/[^/]+/.test(path)) return it ? "Questi sono i conti della tua città: cosa incassa, cosa spende e quanto deve. Apri «In parole semplici» 👇" : "Estas son las cuentas de tu ciudad: lo que ingresa, gasta y debe. Abre «En cristiano» 👇";
  if (path.startsWith("/deuda")) return it ? "Il debito è come il mutuo di casa: soldi da restituire. Un po' è normale, tranquillo! 😉" : "La deuda es como la hipoteca: dinero a devolver. ¡Algo es normal, tranquilo! 😉";
  if (path.startsWith("/sueldos")) return it ? "Lo stipendio del sindaco lo fissa la legge, in base a quanti abitanti ha la città." : "El sueldo del alcalde lo fija la ley, según el tamaño de la ciudad.";
  if (path.startsWith("/ranking")) return it ? "Qui vedi chi spende di più. Tocca una città per i dettagli!" : "Aquí ves quién gasta más. ¡Toca una ciudad para el detalle!";
  if (path.startsWith("/records")) return it ? "I primati: chi paga di più il sindaco, chi ha più debito… curiosità vere!" : "Los récords: quién paga más a su alcalde, quién debe más… ¡datos reales!";
  if (path.startsWith("/futbol")) return it ? "Anche il calcio ha i suoi conti! Ricavi, ingaggi e debiti dei club. ⚽" : "¡El fútbol también tiene cuentas! Ingresos, salarios y deuda de los clubes. ⚽";
  if (path.startsWith("/escandalos")) return it ? "Notizie vere sui soldi pubblici, sempre con la fonte. Niente accuse!" : "Noticias reales sobre el dinero público, siempre con su fuente.";
  if (path.startsWith("/bulos")) return it ? "Bufale smontate con i dati veri. Non farti fregare! 🕵️" : "Bulos desmontados con datos reales. ¡Que no te engañen! 🕵️";
  if (path.startsWith("/comparar") || path.startsWith("/confronta")) return it ? "Due città a confronto, fianco a fianco. Chi spende e deve di più?" : "Dos ciudades comparadas, lado a lado. ¿Quién gasta y debe más?";
  const arr = HOME_TIPS[lang];
  const day = new Date().getDate();
  return arr[day % arr.length];
}

export default function MascotGuide() {
  const pathname = usePathname() || "/";
  const [lang, setLang] = useState<Lang>("es");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [hop, setHop] = useState(false);
  const [tourStep, setTourStep] = useState(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("cc-mascot-off") === "1") { setHidden(true); return; }
    setHidden(false);
    const read = () => setLang(document.documentElement.lang === "it" ? "it" : "es");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    const tourDone = window.localStorage.getItem("cc-mascot-tour-done") === "1";
    const onHome = window.location.pathname === "/" || window.location.pathname === "";
    const t = setTimeout(() => { if (!tourDone && onHome) setTourStep(0); setOpen(true); }, 1600);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);

  const doHop = () => { setHop(true); setTimeout(() => setHop(false), 620); };
  const toggle = () => { setOpen((o) => !o); doHop(); };
  const endTour = () => { setTourStep(-1); try { window.localStorage.setItem("cc-mascot-tour-done", "1"); } catch {} };
  const nextTour = () => { doHop(); if (tourStep + 1 < TOUR[lang].length) setTourStep((s) => s + 1); else endTour(); };
  const turnOff = () => { setOpen(false); setHidden(true); try { window.localStorage.setItem("cc-mascot-off", "1"); } catch {} };

  if (hidden) return null;
  const inTour = tourStep >= 0;
  const steps = TOUR[lang];

  return (
    <div className="fixed z-[60] right-3 bottom-3 sm:right-5 sm:bottom-5 flex flex-col items-end gap-2 pointer-events-none">
      {open && (
        <div className="mascot-bubble-in pointer-events-auto relative max-w-[80vw] sm:max-w-xs glass px-4 py-3 rounded-2xl rounded-br-sm shadow-[0_18px_50px_-18px_rgba(0,0,0,0.75)]">
          <button onClick={() => (inTour ? endTour() : setOpen(false))} aria-label={lang === "it" ? "Chiudi" : "Cerrar"} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0b1226] border border-[var(--panel-border)] text-muted hover:text-fg text-sm leading-none">×</button>

          {inTour ? (
            <>
              <p className="text-sm text-fg/90 leading-snug">{steps[tourStep]}</p>
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1" aria-hidden="true">
                  {steps.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === tourStep ? "w-4 bg-cyan" : "w-1.5 bg-white/20"}`} />
                  ))}
                </span>
                <button onClick={nextTour} className="text-xs font-semibold text-[#05070f] bg-gradient-to-r from-cyan to-violet rounded-full px-3 py-1.5 hover:brightness-110">
                  {tourStep + 1 < steps.length ? (lang === "it" ? "Avanti →" : "Siguiente →") : (lang === "it" ? "Iniziamo!" : "¡Vamos!")}
                </button>
              </div>
              <button onClick={endTour} className="mt-1.5 text-[11px] text-muted/70 hover:text-muted underline">{lang === "it" ? "salta il tour" : "saltar el tour"}</button>
            </>
          ) : (
            <>
              <p className="text-sm text-fg/90 leading-snug">{contextTip(pathname, lang)}</p>
              <button onClick={turnOff} className="mt-2 text-[11px] text-muted/70 hover:text-muted underline">{lang === "it" ? "non mostrarmi più" : "no mostrar más"}</button>
            </>
          )}
        </div>
      )}

      <button onClick={toggle} aria-label={lang === "it" ? "Claro, il tuo aiutante" : "Claro, tu ayudante"} className="pointer-events-auto mascot-bob rounded-full drop-shadow-[0_8px_24px_rgba(34,211,238,0.35)]">
        <span className={`inline-block ${hop ? "mascot-hop" : ""}`}>
          <Mascot size={72} wave={open && !inTour && pathname === "/"} />
        </span>
      </button>
    </div>
  );
}
