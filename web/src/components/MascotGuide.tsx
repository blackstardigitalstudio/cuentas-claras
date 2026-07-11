"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Mascot from "./Mascot";

// Claro te acompaña "de la mano": un compañero flotante con un bocadillo que
// cambia de consejo según la página. Cierras el bocadillo y Claro se queda como
// botón; "no me muestres más" lo oculta del todo (localStorage).

type Lang = "es" | "it";

function tipFor(path: string, lang: Lang): { text: string; wave?: boolean } {
  const it = lang === "it";
  if (/^\/(es|it)\/[^/]+/.test(path))
    return { text: it ? "Questi sono i conti della tua città: cosa incassa, cosa spende e quanto deve. Apri «In parole semplici» 👇" : "Estas son las cuentas de tu ciudad: lo que ingresa, gasta y debe. Abre «En cristiano» 👇" };
  if (path.startsWith("/deuda")) return { text: it ? "Il debito è come il mutuo di casa: soldi da restituire. Un po' è normale, tranquillo! 😉" : "La deuda es como la hipoteca: dinero a devolver. ¡Algo es normal, tranquilo! 😉" };
  if (path.startsWith("/sueldos")) return { text: it ? "Lo stipendio del sindaco lo fissa la legge, in base a quanti abitanti ha la città." : "El sueldo del alcalde lo fija la ley, según el tamaño de la ciudad." };
  if (path.startsWith("/ranking")) return { text: it ? "Qui vedi chi spende di più. Tocca una città per i dettagli!" : "Aquí ves quién gasta más. ¡Toca una ciudad para el detalle!" };
  if (path.startsWith("/records")) return { text: it ? "I primati: chi paga di più il sindaco, chi ha più debito… curiosità vere!" : "Los récords: quién paga más a su alcalde, quién debe más… ¡datos reales!" };
  if (path.startsWith("/futbol")) return { text: it ? "Anche il calcio ha i suoi conti! Ricavi, ingaggi e debiti dei club. ⚽" : "¡El fútbol también tiene cuentas! Ingresos, salarios y deuda de los clubes. ⚽" };
  if (path.startsWith("/escandalos")) return { text: it ? "Notizie vere sui soldi pubblici, sempre con la fonte. Niente accuse!" : "Noticias reales sobre el dinero público, siempre con su fuente." };
  if (path.startsWith("/bulos")) return { text: it ? "Bufale smontate con i dati veri. Non farti fregare! 🕵️" : "Bulos desmontados con datos reales. ¡Que no te engañen! 🕵️" };
  if (path.startsWith("/comparar") || path.startsWith("/confronta")) return { text: it ? "Due città a confronto, fianco a fianco. Chi spende e deve di più?" : "Dos ciudades comparadas, lado a lado. ¿Quién gasta y debe más?" };
  return { text: it ? "Ciao! Sono Claro 👋 Ti spiego i conti pubblici in parole semplici. Cerca la tua città!" : "¡Hola! Soy Claro 👋 Te explico las cuentas públicas fácil. ¡Busca tu ciudad!", wave: true };
}

export default function MascotGuide() {
  const pathname = usePathname() || "/";
  const [lang, setLang] = useState<Lang>("es");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(true); // oculto hasta comprobar localStorage (evita parpadeo)

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("cc-mascot-off") === "1") { setHidden(true); return; }
    setHidden(false);
    const read = () => setLang(document.documentElement.lang === "it" ? "it" : "es");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    const t = setTimeout(() => setOpen(true), 1600);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);

  if (hidden) return null;
  const tip = tipFor(pathname, lang);

  const turnOff = () => { setOpen(false); setHidden(true); try { window.localStorage.setItem("cc-mascot-off", "1"); } catch {} };

  return (
    <div className="fixed z-[60] right-3 bottom-3 sm:right-5 sm:bottom-5 flex flex-col items-end gap-2 pointer-events-none">
      {open && (
        <div className="mascot-bubble-in pointer-events-auto max-w-[78vw] sm:max-w-xs glass px-4 py-3 rounded-2xl rounded-br-sm shadow-[0_18px_50px_-18px_rgba(0,0,0,0.75)]">
          <button onClick={() => setOpen(false)} aria-label={lang === "it" ? "Chiudi" : "Cerrar"} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0b1226] border border-[var(--panel-border)] text-muted hover:text-fg text-sm leading-none">×</button>
          <p className="text-sm text-fg/90 leading-snug">{tip.text}</p>
          <button onClick={turnOff} className="mt-2 text-[11px] text-muted/70 hover:text-muted underline">
            {lang === "it" ? "non mostrarmi più" : "no mostrar más"}
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={lang === "it" ? "Claro, il tuo aiutante" : "Claro, tu ayudante"}
        className="pointer-events-auto mascot-bob rounded-full transition hover:scale-105 active:scale-95 drop-shadow-[0_8px_24px_rgba(34,211,238,0.35)]"
      >
        <Mascot size={72} wave={open && tip.wave} />
      </button>
    </div>
  );
}
