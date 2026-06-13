import { CURRENCIES } from "../constants/currencies";

export const formatCurrency = (amount, currencyCode) => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  if (!currency) return `$${amount.toFixed(2)}`;

  return `${currency.symbol}${amount.toFixed(2)}`;
};

export const getCurrencySymbol = (currencyCode) => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  return currency ? currency.symbol : "$";
};
