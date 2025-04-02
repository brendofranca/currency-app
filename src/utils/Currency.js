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

export const formatCurrencyValue = (value) => {
  let numericValue = value.replace(/\D/g, ''); 
  if (numericValue === '') numericValue = '0';
  const parsedValue = parseFloat(numericValue) / 100; 
  return parsedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
};
