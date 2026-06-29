import type { Lang } from "./i18n";

/**
 * Valuta-model — spejler appen (app/lib/i18n.dart). Beløb omregnes IKKE;
 * kun symbol og tusind-separator skifter, så "en million" altid forbliver
 * en million uanset valuta.
 */
export type Currency = {
  code: string;
  symbol: string;
  flag: string;
  prefix: boolean; // symbol før tallet?
  sep: string; // tusind-separator
  name: { da: string; en: string };
};

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", flag: "🇺🇸", prefix: true, sep: ",", name: { da: "US-dollar", en: "US dollar" } },
  { code: "EUR", symbol: "€", flag: "🇪🇺", prefix: true, sep: ".", name: { da: "Euro", en: "Euro" } },
  { code: "GBP", symbol: "£", flag: "🇬🇧", prefix: true, sep: ",", name: { da: "Britiske pund", en: "British pound" } },
  { code: "DKK", symbol: "kr.", flag: "🇩🇰", prefix: false, sep: ".", name: { da: "Danske kroner", en: "Danish krone" } },
  { code: "SEK", symbol: "kr", flag: "🇸🇪", prefix: false, sep: ".", name: { da: "Svenske kroner", en: "Swedish krona" } },
  { code: "NOK", symbol: "kr", flag: "🇳🇴", prefix: false, sep: ".", name: { da: "Norske kroner", en: "Norwegian krone" } },
  { code: "CHF", symbol: "CHF", flag: "🇨🇭", prefix: true, sep: ".", name: { da: "Schweizerfranc", en: "Swiss franc" } },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", prefix: true, sep: ",", name: { da: "Japanske yen", en: "Japanese yen" } },
  { code: "CAD", symbol: "CA$", flag: "🇨🇦", prefix: true, sep: ",", name: { da: "Canadiske dollar", en: "Canadian dollar" } },
  { code: "AUD", symbol: "A$", flag: "🇦🇺", prefix: true, sep: ",", name: { da: "Australske dollar", en: "Australian dollar" } },
  { code: "INR", symbol: "₹", flag: "🇮🇳", prefix: true, sep: ",", name: { da: "Indiske rupee", en: "Indian rupee" } },
];

export const DEFAULT_CURRENCY: Currency =
  CURRENCIES.find((c) => c.code === "DKK") ?? CURRENCIES[0];

export function currencyFromCode(code?: string | null): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY;
}

/** Standard-valuta ud fra sprog, kun når brugeren ikke selv har valgt. */
export function defaultCurrencyForLang(lang: Lang): Currency {
  return lang === "en" ? currencyFromCode("USD") : currencyFromCode("DKK");
}

/** Grupperet tal uden symbol, fx "1,000,000" / "1.000.000". */
export function formatNum(n: number, c: Currency): string {
  const v = Math.round(n);
  const neg = v < 0;
  const digits = Math.abs(v).toString();
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += c.sep;
    out += digits[i];
  }
  return (neg ? "-" : "") + out;
}

/** Fuldt beløb med symbol, fx "$1,000,000" / "1.000.000 kr." */
export function formatMoney(n: number, c: Currency): string {
  const number = formatNum(Math.abs(n), c);
  const sign = n < 0 ? "-" : "";
  if (c.prefix) {
    const last = c.symbol[c.symbol.length - 1];
    const space = /[A-Za-z]/.test(last) ? " " : "";
    return `${sign}${c.symbol}${space}${number}`;
  }
  return `${sign}${number} ${c.symbol}`;
}
