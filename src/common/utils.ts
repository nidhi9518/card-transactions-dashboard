export const formatCurrency = (amount: number, currency = "EUR") => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(amount);
};