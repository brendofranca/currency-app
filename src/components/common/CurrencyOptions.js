import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const CURRENCY_OPTIONS = [
  { value: 'BRL', label: 'Brazilian Real', symbol: 'R$', flag: 'https://flagcdn.com/w320/br.png' },
  { value: 'EUR', label: 'Euro', symbol: '€', flag: 'https://flagcdn.com/w320/eu.png' },
  { value: 'USD', label: 'United States Dollar', symbol: '$', flag: 'https://flagcdn.com/w320/us.png' }
];

const CurrencyOptions = ({ value, onChange, label }) => (
  <FormControl fullWidth variant="outlined" margin="dense" sx={{ height: '56px' }}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={onChange}
      label={label}
      sx={{ height: '100%' }}
    >
      {CURRENCY_OPTIONS.map(option => (
        <MenuItem key={option.value} value={option.value}>
          <img src={option.flag} alt={`${option.value} flag`} width="20" height="15" style={{ marginRight: 8 }} />
          {option.symbol} {option.value} - {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default CurrencyOptions;

export { CURRENCY_OPTIONS };
