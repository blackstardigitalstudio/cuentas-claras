"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, MESSAGES, type Locale, type Messages } from "./messages";

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; m: Messages };

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children, force }: { children: React.ReactNode; force?: Locale }) {
  // Inicial = ES (coincide con el HTML pre-renderizado → sin hydration mismatch).
  // Con `force`, la página tiene idioma FIJO: se pre-renderiza en ese idioma y no
  // autodetecta. Es lo que permite tener URLs italianas que Google vea en italiano.
  const [locale, setLocaleState] = useState<Locale>(force ?? DEFAULT_LOCALE);

  // Tras hidratar: respeta la preferencia guardada o el idioma del navegador.
  useEffect(() => {
    if (force) return; // idioma fijo por URL: no autodetectar ni leer preferencia
    const saved = window.localStorage.getItem("cc-locale") as Locale | null;
    if (saved === "es" || saved === "it") {
      setLocaleState(saved);
    } else if (navigator.language?.toLowerCase().startsWith("it")) {
      setLocaleState("it");
    }
  }, [force]);

  // Mantén <html lang> sincronizado con el idioma activo (autodetección o toggle),
  // por accesibilidad y SEO.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem("cc-locale", l);
    } catch {}
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, m: MESSAGES[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale debe usarse dentro de <LocaleProvider>");
  return ctx;
}

/** Acceso directo a los mensajes del idioma actual. */
export function useMessages(): Messages {
  return useLocale().m;
}
