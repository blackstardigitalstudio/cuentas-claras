"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { formatCompact } from "@/lib/format";

// Formateadores por clave (evita pasar funciones a través del límite RSC).
const FORMATTERS: Record<string, (n: number) => string> = {
  compact: formatCompact,
  int: (n) => new Intl.NumberFormat("es-ES").format(Math.round(n)),
};

/**
 * Cifra formateada. En un sitio sobre dinero público la cifra correcta debe
 * estar SIEMPRE visible (SEO, sin JS, durante la hidratación). El movimiento lo
 * aportan los contenedores (Reveal / panel animado), no el propio número.
 */
export function CountUp({
  value,
  kind = "compact",
  className,
}: {
  value: number;
  kind?: "compact" | "int";
  className?: string;
  duration?: number;
}) {
  return <span className={className}>{FORMATTERS[kind](value)}</span>;
}

/**
 * Reveal — entrada suave al hacer scroll (fade + leve translate).
 * Stagger opcional con `delay`. Respeta reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: reduce || inView ? 1 : 0,
        transform: reduce || inView ? "none" : "translateY(16px)",
        transition: reduce ? "none" : `opacity .6s ease ${delay}s, transform .6s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
