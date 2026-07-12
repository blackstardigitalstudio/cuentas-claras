"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Condivisione "a evidenziazione": l'utente seleziona una frase che gli piace
// e appare un pulsante flottante per postarla sui suoi social, con la citazione
// + il link alla nostra pagina. Ogni lettore diventa un backlink automatico.
// Indipendente dalla lingua: legge <html lang>. Su mobile la condivisione nativa
// apre anche Instagram. Non serve nessuna dipendenza esterna.

const MIN = 12; // caratteri minimi perché valga la pena condividere
const MAX_QUOTE = 220; // taglio per non superare il limite di un tweet

type Pos = { x: number; y: number };

function insideShareable(node: Node | null): boolean {
  let el = node instanceof Element ? node : node?.parentElement;
  while (el) {
    const tag = el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || (el as HTMLElement).isContentEditable) return false;
    if (el.getAttribute("data-no-share") !== null) return false;
    if (tag === "NAV" || tag === "BUTTON" || tag === "A") return false;
    if (tag === "MAIN" || tag === "ARTICLE") return true;
    el = el.parentElement;
  }
  return true; // default: consenti (le pagine sono quasi tutte contenuto)
}

export default function ShareHighlight() {
  const [it, setIt] = useState(false);
  const [quote, setQuote] = useState("");
  const [pos, setPos] = useState<Pos | null>(null);
  const [hint, setHint] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIt(document.documentElement.lang === "it");
    // Suggerimento una tantum per far scoprire la funzione (chiave del backlink).
    try {
      if (!localStorage.getItem("cc-sharehl-hint")) {
        const tm = setTimeout(() => setHint(true), 3500);
        return () => clearTimeout(tm);
      }
    } catch { /* noop */ }
  }, []);

  const dismissHint = useCallback(() => {
    setHint(false);
    try { localStorage.setItem("cc-sharehl-hint", "1"); } catch { /* noop */ }
  }, []);

  const hide = useCallback(() => {
    setPos(null);
    setQuote("");
  }, []);

  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    const onSelect = () => {
      clearTimeout(tm);
      // setTimeout (non rAF): affidabile anche su mobile e in tab non a fuoco.
      tm = setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
          // non nascondere se il click è dentro la nostra barra
          if (barRef.current && document.activeElement && barRef.current.contains(document.activeElement)) return;
          hide();
          return;
        }
        const raw = sel.toString().replace(/\s+/g, " ").trim();
        if (raw.length < MIN) { hide(); return; }
        if (!insideShareable(sel.anchorNode)) { hide(); return; }
        const range = sel.getRangeAt(0);
        const r = range.getBoundingClientRect();
        if (!r || (r.width === 0 && r.height === 0)) { hide(); return; }
        const q = raw.length > MAX_QUOTE ? raw.slice(0, MAX_QUOTE - 1).trimEnd() + "…" : raw;
        setQuote(q);
        setPos({ x: Math.min(Math.max(r.left + r.width / 2, 120), window.innerWidth - 120), y: r.top });
        setHint(false); // ha già capito come si fa
      }, 10);
    };
    document.addEventListener("selectionchange", onSelect);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      clearTimeout(tm);
      document.removeEventListener("selectionchange", onSelect);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [hide]);

  // Hint una tantum: pillola discreta in basso, si chiude da sola o al primo uso.
  const hintEl = hint && !pos ? (
    <button
      onClick={dismissHint}
      className="cc-sharehl-hint fixed z-[65] left-1/2 -translate-x-1/2 bottom-5 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-[#0b1020]/95 backdrop-blur px-4 py-2 text-xs text-fg shadow-[0_8px_30px_rgba(0,0,0,.5)]"
    >
      <span aria-hidden>✍️</span>
      {it ? "Evidenzia una frase per condividerla sui social" : "Selecciona una frase para compartirla en tus redes"}
      <span className="text-muted" aria-hidden>✕</span>
    </button>
  ) : null;

  if (!pos || !quote) return hintEl;

  const url = window.location.href.split("?")[0];
  const enc = encodeURIComponent;
  // Messaggio: la citazione tra virgolette + firma. Il link lo aggiunge la rete
  // (parametro url) così l'anteprima con la nostra OG image resta pulita.
  const msg = `«${quote}» — ${it ? "vía Cuentas Claras" : "vía Cuentas Claras"}`;

  const links: { name: string; label: string; href: string; bg: string }[] = [
    { name: "X", label: "X", href: `https://twitter.com/intent/tweet?text=${enc(msg)}&url=${enc(url)}`, bg: "#000" },
    { name: "WhatsApp", label: "WhatsApp", href: `https://wa.me/?text=${enc(msg + " " + url)}`, bg: "#25D366" },
    { name: "Facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(msg)}`, bg: "#1877F2" },
    { name: "Telegram", label: "Telegram", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(msg)}`, bg: "#229ED9" },
  ];

  const canNative = typeof navigator !== "undefined" && !!(navigator as Navigator).share;
  const native = async () => {
    try { await (navigator as Navigator).share({ title: "Cuentas Claras", text: msg, url }); } catch { /* cancelado */ }
    hide();
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${msg} ${url}`); } catch { /* noop */ }
    hide();
  };

  return (
    <div
      ref={barRef}
      role="toolbar"
      aria-label={it ? "Condividi la frase selezionata" : "Compartir la frase seleccionada"}
      onMouseDown={(e) => e.preventDefault()} // non perdere la selezione al click
      className="cc-sharehl fixed z-[70] -translate-x-1/2 -translate-y-full"
      style={{ left: pos.x, top: pos.y - 10 }}
    >
      <div className="flex items-center gap-1 rounded-full border border-[var(--panel-border)] bg-[#0b1020]/95 backdrop-blur px-1.5 py-1 shadow-[0_8px_30px_rgba(0,0,0,.5)]">
        <span className="pl-2 pr-1 text-[10px] font-semibold uppercase tracking-widest text-cyan/80 hidden sm:inline">
          {it ? "Condividi" : "Compartir"}
        </span>
        {canNative && (
          <button
            onClick={native}
            aria-label={it ? "Condividi" : "Compartir"}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>
          </button>
        )}
        {links.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setTimeout(hide, 0)}
            aria-label={l.label}
            title={l.label}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-[11px] font-bold hover:brightness-125 transition"
            style={{ background: l.bg }}
          >
            {l.name === "X" ? "𝕏" : l.name[0]}
          </a>
        ))}
        <button
          onClick={copy}
          aria-label={it ? "Copia" : "Copiar"}
          title={it ? "Copia il link" : "Copiar el enlace"}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--panel-border)] text-muted hover:text-fg hover:border-cyan transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        </button>
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 top-full -mt-px h-0 w-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[#0b1020]/95" aria-hidden />
    </div>
  );
}
