"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { formatCompact } from "@/lib/format";

// Formateadores por clave (evita pasar funciones a través del límite RSC).
const FORMATTERS: Record<string, (n: number) => string> = {
  compact: formatCompact,
  int: (n) => new Intl.NumberFormat("es-ES").format(Math.round(n)),
};

/**
 * CountUp — anima un número subiendo desde 0 cuando entra en viewport.
 * El motion "tiene sentido": el valor se construye ante el usuario.
 * Respeta prefers-reduced-motion (muestra el valor final al instante).
 */
export function CountUp({
  value,
  kind = "compact",
  className,
  duration = 1.4,
}: {
  value: number;
  kind?: "compact" | "int";
  className?: string;
  duration?: number;
}) {
  const format = FORMATTERS[kind];
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  // Inicial = valor final: el HTML pre-renderizado (SEO / sin JS) muestra la
  // cifra real. La animación desde 0 es solo un realce en el cliente.
  const [display, setDisplay] = useState(value);
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || reduce || animated.current) return;
    animated.current = true;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
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
