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

/** Compacto y legible: "5.926 M€", "812 M€", "47 M€".
 *  En italiano "mil M€" no se entiende: allí es "5,9 mld €", "812 mln €", "47 mila €". */
export function formatCompact(n: number, locale?: string): string {
  const it = locale === "it";
  if (Math.abs(n) >= 1_000_000_000) return it ? `${num1.format(n / 1_000_000_000)} mld €` : `${num1.format(n / 1_000_000_000)} mil M€`;
  if (Math.abs(n) >= 1_000_000) return `${num.format(Math.round(n / 1_000_000))} ${it ? "mln €" : "M€"}`;
  if (Math.abs(n) >= 1_000) return `${num.format(Math.round(n / 1_000))} ${it ? "mila €" : "mil €"}`;
  return eur.format(n);
}

/** Porcentaje: "27 %" */
export function formatPct(fraction: number): string {
  return `${num.format(Math.round(fraction * 100))} %`;
}
