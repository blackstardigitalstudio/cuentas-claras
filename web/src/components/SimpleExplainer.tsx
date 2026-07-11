import type { ReactNode } from "react";
import Mascot from "./Mascot";

// "Método Feynman": Claro explica como a un niño, con una analogía y pocas
// palabras. Lo básico siempre visible; el "explícamelo mejor" profundiza.
export default function SimpleExplainer({
  title,
  by,
  children,
  more,
  moreLabel,
}: {
  title: string;
  by?: string;
  children: ReactNode;
  more?: ReactNode;
  moreLabel?: string;
}) {
  return (
    <aside className="glass p-4 sm:p-5 relative overflow-hidden">
      <span className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-cyan to-violet" aria-hidden="true" />
      <div className="flex gap-3 sm:gap-4">
        <div className="shrink-0 -mt-1 -ml-1" aria-hidden="true">
          <Mascot size={52} className="drop-shadow-[0_4px_14px_rgba(34,211,238,0.35)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan/85 mb-1.5 font-semibold">{title}{by ? <> · <span className="text-muted/80 normal-case tracking-normal">{by}</span></> : null}</p>
          <div className="text-sm sm:text-[15px] text-fg/90 leading-relaxed space-y-2">{children}</div>
          {more && (
            <details className="mt-3 group">
              <summary className="text-xs font-semibold text-cyan cursor-pointer list-none inline-flex items-center gap-1 select-none">
                <span className="transition-transform group-open:rotate-90">›</span> {moreLabel}
              </summary>
              <div className="text-sm text-muted mt-2 leading-relaxed space-y-2">{more}</div>
            </details>
          )}
        </div>
      </div>
    </aside>
  );
}
