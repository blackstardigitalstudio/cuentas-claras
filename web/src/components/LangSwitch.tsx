"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { LOCALES } from "@/i18n/messages";

export default function LangSwitch() {
  const { locale, setLocale } = useLocale();
  return (
    <div
      className="inline-flex items-center rounded-full border border-[var(--panel-border)] overflow-hidden text-xs"
      role="group"
      aria-label="Idioma / Lingua"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-3 py-1.5 transition ${
            locale === l ? "bg-[rgba(34,211,238,0.15)] text-fg" : "text-muted hover:text-fg"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
