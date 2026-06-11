"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, MESSAGES, type Locale, type Messages } from "./messages";

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; m: Messages };

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Inicial = ES (coincide con el HTML pre-renderizado → sin hydration mismatch).
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Tras hidratar: respeta la preferencia guardada o el idioma del navegador.
  useEffect(() => {
    const saved = window.localStorage.getItem("cc-locale") as Locale | null;
    if (saved === "es" || saved === "it") {
      setLocaleState(saved);
    } else if (navigator.language?.toLowerCase().startsWith("it")) {
      setLocaleState("it");
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem("cc-locale", l);
    } catch {}
    document.documentElement.lang = l;
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
