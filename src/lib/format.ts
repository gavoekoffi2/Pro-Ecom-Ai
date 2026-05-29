/**
 * Locale + currency formatting, defaulted for West/Central Africa.
 *
 * The product is built first for Togo and the wider francophone Africa
 * region, so the defaults are French formatting and the West African
 * CFA franc (XOF — the currency of the UEMOA: Togo, Bénin, Burkina
 * Faso, Côte d'Ivoire, Mali, Niger, Sénégal, Guinée-Bissau). The CFA
 * franc has no minor unit, so amounts are always whole numbers.
 *
 * Centralised here so every screen (pipelines, deals, dashboard) shows
 * money the same way and a future locale/currency switch is one edit.
 */

export const DEFAULT_LOCALE = "fr-FR";

/** West African CFA franc — displayed as "F CFA". */
export const DEFAULT_CURRENCY = "XOF";

/**
 * Currencies offered in the deal form's dropdown. XOF (Franc CFA) is
 * first because it's the default for the target market; the others
 * cover common cross-border and diaspora cases.
 */
export const CURRENCY_OPTIONS: ReadonlyArray<{ code: string; label: string }> = [
  { code: "XOF", label: "F CFA (XOF)" },
  { code: "XAF", label: "F CFA (XAF)" },
  { code: "GHS", label: "Cedi ghanéen (GHS)" },
  { code: "NGN", label: "Naira (NGN)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "USD", label: "Dollar US (USD)" },
];

/**
 * Format a monetary value. CFA francs (and most African currencies in
 * day-to-day use) are shown without decimals.
 */
export function formatCurrency(
  value: number,
  currency: string = DEFAULT_CURRENCY,
): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency: currency || DEFAULT_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

/**
 * Compact money for charts / metric cards: 1 234 567 → "1,2 M",
 * 12 500 → "12,5 k". Suffix-only so it fits in donut centres and
 * KPI tiles. The currency symbol is appended so the unit stays clear.
 */
export function formatCurrencyShort(
  value: number,
  currency: string = DEFAULT_CURRENCY,
): string {
  const v = Number(value || 0);
  const unit = currencySymbol(currency);
  if (v >= 1_000_000) return `${trim(v / 1_000_000)} M ${unit}`;
  if (v >= 1_000) return `${trim(v / 1_000)} k ${unit}`;
  return `${formatNumber(v)} ${unit}`;
}

/** Locale-aware plain number (thousands grouped with a space in fr-FR). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE).format(Number(value || 0));
}

/** Short date, e.g. "5 mars 2026". */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(DEFAULT_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function trim(n: number): string {
  // 1.0 → "1", 1.5 → "1,5" (fr-FR uses a comma decimal separator).
  return n
    .toFixed(1)
    .replace(/\.0$/, "")
    .replace(".", ",");
}

function currencySymbol(currency: string): string {
  switch ((currency || DEFAULT_CURRENCY).toUpperCase()) {
    case "XOF":
    case "XAF":
      return "F CFA";
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GHS":
      return "₵";
    case "NGN":
      return "₦";
    default:
      return currency;
  }
}
