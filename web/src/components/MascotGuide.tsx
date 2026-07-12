"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Mascot from "./Mascot";

// Claro NO solo saluda: al hacer clic abre un panel de AYUDA con acciones que
// hacen cosas de verdad (te resalta la explicación, abre el desglose, te lleva
// al buscador) y responde a las dudas de esa página. Bilingüe ES/IT.

type Lang = "es" | "it";
type Item = { icon: string; label: string; answer?: string; act?: () => void };

const TOUR: Record<Lang, string[]> = {
  it: [
    "Ciao! Sono Claro 👋 Ti faccio fare un giro velocissimo, dura un attimo.",
    "Cerca la tua città nella barra qui sopra 🔎 e vedrai i suoi conti veri.",
    "Non capisci un numero? Clicca su di me quando vuoi: ti spiego io, facile facile.",
    "Qui è tutto ufficiale e verificato. Buona esplorazione! 🎉",
  ],
  es: [
    "¡Hola! Soy Claro 👋 Te hago un tour rapidísimo, dura un momento.",
    "Busca tu ciudad en la barra de arriba 🔎 y verás sus cuentas reales.",
    "¿No entiendes un número? Haz clic en mí cuando quieras: te lo explico yo, muy fácil.",
    "Aquí todo es oficial y verificado. ¡Buena exploración! 🎉",
  ],
};

export default function MascotGuide() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("es");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [hop, setHop] = useState(false);
  const [tourStep, setTourStep] = useState(-1);
  const [ans, setAns] = useState(-1);

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
    const greeted = window.sessionStorage.getItem("cc-mascot-greeted") === "1";
    const t = setTimeout(() => {
      if (!tourDone && onHome) { setTourStep(0); setOpen(true); }
      else if (!greeted) { setOpen(true); try { window.sessionStorage.setItem("cc-mascot-greeted", "1"); } catch {} }
    }, 1600);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);

  // Cierra el panel al cambiar de página.
  useEffect(() => { setOpen(false); setAns(-1); }, [pathname]);

  const doHop = () => { setHop(true); setTimeout(() => setHop(false), 620); };
  const toggle = () => { setOpen((o) => !o); setAns(-1); doHop(); };
  const endTour = () => { setTourStep(-1); try { window.localStorage.setItem("cc-mascot-tour-done", "1"); } catch {} };
  const nextTour = () => { doHop(); if (tourStep + 1 < TOUR[lang].length) setTourStep((s) => s + 1); else endTour(); };
  const turnOff = () => { setOpen(false); setHidden(true); try { window.localStorage.setItem("cc-mascot-off", "1"); } catch {} };

  // --- acciones que HACEN cosas ---
  const flash = (el: Element | null) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("cc-flash");
    setTimeout(() => el.classList.remove("cc-flash"), 3200);
    setOpen(false);
  };
  const goExplainer = () => flash(document.querySelector('[data-claro="explainer"]'));
  const openDetail = () => { const d = document.querySelector('[data-claro="detail"]') as HTMLDetailsElement | null; if (d) d.open = true; flash(d); };
  const goSearch = () => { const s = document.querySelector('[data-claro="search"]') as HTMLInputElement | null; if (s) { s.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => s.focus(), 450); } setOpen(false); };
  const nav = (href: string) => { setOpen(false); router.push(href); };

  const it = lang === "it";
  const T = (es: string, itx: string) => (it ? itx : es);

  const intro = (): string => {
    if (/^\/(es|it)\/[^/]+/.test(pathname)) return T("Questa è la scheda della tua città. Posso spiegarti i numeri:", "Esta es la ficha de tu ciudad. Puedo explicarte los números:");
    if (pathname.startsWith("/deuda")) return T("Il debito dei comuni, spiegato:", "La deuda de los municipios, explicada:");
    if (pathname.startsWith("/sueldos")) return T("Gli stipendi dei sindaci, spiegati:", "Los sueldos de los alcaldes, explicados:");
    if (pathname.startsWith("/ranking")) return T("La classifica di spesa, spiegata:", "El ranking de gasto, explicado:");
    if (pathname.startsWith("/records")) return T("I record dei soldi pubblici:", "Los récords del dinero público:");
    if (pathname.startsWith("/futbol")) return T("I soldi del calcio, spiegati:", "El dinero del fútbol, explicado:");
    if (pathname.startsWith("/escandalos")) return T("Gli scandali sui soldi pubblici:", "Los escándalos del dinero público:");
    if (pathname.startsWith("/bulos")) return T("Le bufale, smontate:", "Los bulos, desmontados:");
    return T("Ciao! Come posso aiutarti?", "¡Hola! ¿En qué te ayudo?");
  };

  const items = (): Item[] => {
    const debtA = T("È come il mutuo di casa: soldi che il comune ha preso in prestito e deve ancora restituire. Un po' è normale, il problema è quando è troppo.", "Es como la hipoteca: dinero que el ayuntamiento pidió prestado y aún debe devolver. Algo es normal; el problema es cuando es demasiada.");
    if (/^\/(es|it)\/[^/]+/.test(pathname)) return [
      { icon: "💡", label: T("Spiegami questa pagina", "Explícame esta página"), act: goExplainer },
      { icon: "📊", label: T("Apri il dettaglio dei conti", "Abre el desglose completo"), act: openDetail },
      { icon: "🏦", label: T("Cos'è il «debito»?", "¿Qué es la «deuda»?"), answer: debtA },
      { icon: "🔎", label: T("Cerca un'altra città", "Buscar otra ciudad"), act: () => nav("/") },
    ];
    if (pathname.startsWith("/deuda")) return [
      { icon: "🏦", label: T("Cos'è il debito?", "¿Qué es la deuda?"), answer: debtA },
      { icon: "❓", label: T("Perché alcune città hanno 0 debito?", "¿Por qué hay ciudades sin deuda?"), answer: T("Molti comuni non hanno prestiti in corso, soprattutto i piccoli. Avere 0 debito è un buon segno.", "Muchos ayuntamientos no tienen préstamos pendientes, sobre todo los pequeños. Tener 0 deuda es buena señal.") },
      { icon: "💡", label: T("Spiegami questa pagina", "Explícame esta página"), act: goExplainer },
    ];
    if (pathname.startsWith("/sueldos")) return [
      { icon: "💰", label: T("Perché i sindaci guadagnano diverso?", "¿Por qué cobran distinto?"), answer: T("Lo stipendio dipende per legge dalla dimensione del comune. Nei paesi piccoli spesso è 0 o pochi euro; nelle grandi città è più alto.", "El sueldo depende por ley del tamaño del municipio. En pueblos pequeños suele ser 0 o poco; en grandes ciudades es más alto.") },
      { icon: "💡", label: T("Spiegami questa pagina", "Explícame esta página"), act: goExplainer },
    ];
    if (pathname.startsWith("/ranking")) return [
      { icon: "📊", label: T("Cosa vuol dire?", "¿Qué significa esto?"), act: goExplainer },
      { icon: "❓", label: T("Chi spende di più «sperpera»?", "¿Quien más gasta «derrocha»?"), answer: T("No per forza: le città grandi spendono di più perché hanno più abitanti e più servizi da pagare.", "No por fuerza: las ciudades grandes gastan más porque tienen más habitantes y más servicios que pagar.") },
    ];
    if (pathname.startsWith("/records")) return [
      { icon: "💡", label: T("Cosa sono i record?", "¿Qué son los récords?"), act: goExplainer },
      { icon: "🏦", label: T("Cos'è il debito?", "¿Qué es la deuda?"), answer: debtA },
    ];
    if (pathname.startsWith("/futbol")) return [
      { icon: "⚽", label: T("Cos'è il «tetto salariale»?", "¿Qué es el «límite salarial»?"), answer: T("È il tetto massimo che la LaLiga permette a un club di spendere per la rosa, in base a ricavi e debiti. Non è quanto spende davvero.", "Es el tope máximo que LaLiga permite gastar a un club en su plantilla, según sus ingresos y deudas. No es lo que gasta de verdad.") },
      { icon: "💶", label: T("Cosa sono i «ricavi»?", "¿Qué son los «ingresos»?"), answer: T("I soldi che il club incassa in un anno (biglietti, TV, sponsor). Non è quanto «vale» la squadra.", "El dinero que el club recauda en un año (entradas, TV, patrocinios). No es cuánto «vale» el equipo.") },
    ];
    if (pathname.startsWith("/escandalos")) return [
      { icon: "🕵️", label: T("Come funziona?", "¿Cómo funciona?"), answer: T("Raccolgo notizie vere di giornali sui soldi pubblici, ognuna con la sua fonte. Non accuso nessuno: fino a sentenza, ognuno è innocente.", "Reúno noticias reales de medios sobre el dinero público, cada una con su fuente. No acuso a nadie: hasta sentencia, todos inocentes.") },
      { icon: "🏠", label: T("Torna alla home", "Volver al inicio"), act: () => nav("/") },
    ];
    if (pathname.startsWith("/bulos")) return [
      { icon: "✅", label: T("Come funziona?", "¿Cómo funciona?"), answer: T("Prendo le bufale virali e ti mostro la cifra vera, con il link alla verifica fatta da fact-checker indipendenti.", "Cojo los bulos virales y te muestro la cifra real, con el enlace a la verificación de fact-checkers independientes.") },
      { icon: "🏠", label: T("Torna alla home", "Volver al inicio"), act: () => nav("/") },
    ];
    // home + fallback
    return [
      { icon: "🔎", label: T("Trova la tua città", "Encuentra tu ciudad"), act: goSearch },
      { icon: "❓", label: T("Cos'è questo sito?", "¿Qué es esta web?"), answer: T("Ti mostro, con dati ufficiali, quanto incassa, spende e deve ogni città di Spagna e Italia — e quanto guadagna il sindaco. Tutto spiegato facile.", "Te muestro, con datos oficiales, cuánto ingresa, gasta y debe cada ciudad de España e Italia — y cuánto cobra el alcalde. Todo explicado fácil.") },
      { icon: "🏆", label: T("Mostrami i record", "Enséñame los récords"), act: () => nav("/records/") },
      { icon: "⚽", label: T("Il calcio", "El fútbol"), act: () => nav("/futbol/") },
    ];
  };

  if (hidden) return null;
  const inTour = tourStep >= 0;
  const steps = TOUR[lang];
  const list = items();

  return (
    <div className="fixed z-[60] right-3 bottom-3 sm:right-5 sm:bottom-5 flex flex-col items-end gap-2 pointer-events-none">
      {open && (
        <div className="mascot-bubble-in pointer-events-auto relative w-[86vw] max-w-[20rem] glass px-4 py-3.5 rounded-2xl rounded-br-sm shadow-[0_18px_50px_-18px_rgba(0,0,0,0.75)]">
          <button onClick={() => (inTour ? endTour() : setOpen(false))} aria-label={it ? "Chiudi" : "Cerrar"} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0b1226] border border-[var(--panel-border)] text-muted hover:text-fg text-sm leading-none">×</button>

          {inTour ? (
            <>
              <p className="text-sm text-fg/90 leading-snug">{steps[tourStep]}</p>
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1" aria-hidden="true">
                  {steps.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === tourStep ? "w-4 bg-cyan" : "w-1.5 bg-white/20"}`} />)}
                </span>
                <button onClick={nextTour} className="text-xs font-semibold text-[#05070f] bg-gradient-to-r from-cyan to-violet rounded-full px-3 py-1.5 hover:brightness-110">
                  {tourStep + 1 < steps.length ? (it ? "Avanti →" : "Siguiente →") : (it ? "Iniziamo!" : "¡Vamos!")}
                </button>
              </div>
              <button onClick={endTour} className="mt-1.5 text-[11px] text-muted/70 hover:text-muted underline">{it ? "salta il tour" : "saltar el tour"}</button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Mascot size={26} />
                <p className="text-[13px] font-semibold text-fg">{intro()}</p>
              </div>
              <ul className="mt-1 -mx-1">
                {list.map((item, i) => (
                  <li key={item.label}>
                    <button className="claro-item text-fg/90" onClick={() => (item.act ? item.act() : setAns(ans === i ? -1 : i))}>
                      <span className="shrink-0">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      <span className="text-cyan shrink-0 text-xs">{item.act ? "→" : ans === i ? "−" : "+"}</span>
                    </button>
                    {!item.act && ans === i && <p className="text-[13px] text-muted leading-relaxed px-3 pb-2">{item.answer}</p>}
                  </li>
                ))}
              </ul>
              <button onClick={turnOff} className="mt-1.5 text-[11px] text-muted/70 hover:text-muted underline">{it ? "non mostrarmi più" : "no mostrar más"}</button>
            </>
          )}
        </div>
      )}

      <button onClick={toggle} aria-label={it ? "Claro, il tuo aiutante" : "Claro, tu ayudante"} className="pointer-events-auto mascot-bob rounded-full drop-shadow-[0_8px_24px_rgba(34,211,238,0.35)]">
        <span className={`inline-block ${hop ? "mascot-hop" : ""}`}>
          <Mascot size={72} wave={open && !inTour && pathname === "/"} />
        </span>
      </button>
    </div>
  );
}
