"use client";

import { useState } from "react";

// Pulsante "condividi questo dato", agganciato a un numero preciso della pagina.
// Nasce da un problema reale: la condivisione per selezione di testo su mobile
// viene coperta dal menu di sistema (Copia/Traduci) e dal popup di Google
// Traduttore. Qui invece il pulsante è SEMPRE visibile e non richiede selezione:
// un tocco → si apre la condivisione nativa (Instagram, WhatsApp…) o si copia.
export default function ShareFact({ text, lang = "it", className = "" }: { text: string; lang?: "es" | "it"; className?: string }) {
  const [done, setDone] = useState(false);
  const it = lang === "it";

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
    const payload = `${text} ${url}`;
    // 1) Condivisione nativa: su telefono apre direttamente Instagram, WhatsApp, ecc.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Cuentas Claras", text, url });
        return;
      } catch {
        /* l'utente ha annullato: non facciamo nulla */
      }
    }
    // 2) Fallback desktop: copia negli appunti.
    try {
      await navigator.clipboard.writeText(payload);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={it ? "Condividi questo dato" : "Compartir este dato"}
      className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-[11px] font-semibold border border-[var(--panel-border)] text-muted hover:text-fg hover:border-cyan transition cursor-pointer ${className}`}
    >
      {done ? (
        <>✓ {it ? "Copiato" : "Copiado"}</>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
          </svg>
          {it ? "Condividi" : "Compartir"}
        </>
      )}
    </button>
  );
}
