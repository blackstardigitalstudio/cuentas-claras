const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
const num1 = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 });

/** Importe completo en euros: "1.234.567 €" */
export function formatEuro(n: number): string {
  return eur.format(n);
}

/** Compacto y legible: "5.926 M€", "812 M€", "47 M€". */
export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000_000) return `${num1.format(n / 1_000_000_000)} mil M€`;
  if (Math.abs(n) >= 1_000_000) return `${num.format(Math.round(n / 1_000_000))} M€`;
  if (Math.abs(n) >= 1_000) return `${num.format(Math.round(n / 1_000))} mil €`;
  return eur.format(n);
}

/** Porcentaje: "27 %" */
export function formatPct(fraction: number): string {
  return `${num.format(Math.round(fraction * 100))} %`;
}
