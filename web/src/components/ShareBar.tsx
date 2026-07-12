"use client";

import { useEffect, useState } from "react";

// Barra de compartir: convierte a cada usuario en publicidad gratis. Mensaje
// pre-rellenado con el dato concreto + enlace. "Compartir" nativo (Web Share)
// abre en móvil todas las apps, Instagram incluida. Independiente del contexto:
// lee el idioma de <html lang> (o del prop), así funciona en cualquier página.
export default function ShareBar({ text, url, lang: langProp, className = "" }: { text: string; url?: string; lang?: "es" | "it"; className?: string }) {
  const [lang, setLang] = useState<"es" | "it">(langProp || "es");
  useEffect(() => {
    if (langProp) return;
    if (typeof document !== "undefined") setLang(document.documentElement.lang === "it" ? "it" : "es");
  }, [langProp]);
  const it = lang === "it";
  const [copied, setCopied] = useState(false);
  const [canNative, setCanNative] = useState(true);

  // URL de la página: se resuelve tras el montaje (window solo existe en cliente).
  // Así SSR y primer render de cliente coinciden (sin hydration mismatch) y, una
  // vez montado, el enlace apunta a la página concreta y no a la home.
  const [shareUrl, setShareUrl] = useState(url || "https://www.cuentas-clara.com/");
  useEffect(() => {
    if (url) return;
    if (typeof window !== "undefined") setShareUrl(window.location.href.split("?")[0]);
  }, [url]);
  const enc = encodeURIComponent;
  const msg = text;

  const native = async () => {
    if (typeof navigator !== "undefined" && (navigator as Navigator).share) {
      try { await (navigator as Navigator).share({ title: "Cuentas Claras", text: msg, url: shareUrl }); } catch { /* cancelado */ }
    } else setCanNative(false);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${msg} ${shareUrl}`); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* noop */ }
  };

  const btn = "inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold border border-[var(--panel-border)] hover:border-cyan hover:text-fg transition text-muted";
  const links: { name: string; href: string; bg: string }[] = [
    { name: "X", href: `https://twitter.com/intent/tweet?text=${enc(msg)}&url=${enc(shareUrl)}`, bg: "#000" },
    { name: "WhatsApp", href: `https://wa.me/?text=${enc(msg + " " + shareUrl)}`, bg: "#25D366" },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`, bg: "#1877F2" },
    { name: "Telegram", href: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(msg)}`, bg: "#229ED9" },
  ];

  return (
    <div className={`glass p-3.5 sm:p-4 ${className}`}>
      <p className="text-[11px] uppercase tracking-widest text-cyan/80 font-semibold mb-2.5">
        📣 {it ? "Condividi questo dato" : "Comparte este dato"}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {canNative && (
          <button onClick={native} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-semibold text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>
            {it ? "Condividi" : "Compartir"}
          </button>
        )}
        {links.map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className={btn} aria-label={l.name}>
            <span className="w-2 h-2 rounded-full" style={{ background: l.bg }} /> {l.name}
          </a>
        ))}
        <button onClick={copy} className={btn} aria-label={it ? "Copia link" : "Copiar enlace"}>
          {copied ? (it ? "✓ Copiato" : "✓ Copiado") : (it ? "Copia link" : "Copiar enlace")}
        </button>
      </div>
    </div>
  );
}
