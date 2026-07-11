import type { ReactNode } from "react";

// "Método Feynman": explicar como a un niño, con una analogía y pocas palabras.
// Lo básico siempre visible; el "explícamelo mejor" profundiza sin agobiar.
export default function SimpleExplainer({
  title,
  children,
  more,
  moreLabel,
}: {
  title: string;
  children: ReactNode;
  more?: ReactNode;
  moreLabel?: string;
}) {
  return (
    <aside className="glass p-4 sm:p-5 relative overflow-hidden">
      <span className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-cyan to-violet" aria-hidden="true" />
      <p className="text-[11px] uppercase tracking-[0.2em] text-cyan/85 mb-2 font-semibold">💡 {title}</p>
      <div className="text-sm sm:text-[15px] text-fg/90 leading-relaxed space-y-2">{children}</div>
      {more && (
        <details className="mt-3 group">
          <summary className="text-xs font-semibold text-cyan cursor-pointer list-none inline-flex items-center gap-1 select-none">
            <span className="transition-transform group-open:rotate-90">›</span> {moreLabel}
          </summary>
          <div className="text-sm text-muted mt-2 leading-relaxed space-y-2">{more}</div>
        </details>
      )}
    </aside>
  );
}
