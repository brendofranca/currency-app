export const CurrencyFormatter = (value, currency) => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return 'Invalid value';
  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 5
  });
};
