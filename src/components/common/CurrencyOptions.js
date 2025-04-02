import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const CURRENCY_OPTIONS = [
  { value: 'BRL', label: 'Brazilian Real', symbol: 'R$', flag: 'https://flagcdn.com/w320/br.png' },
  { value: 'USD', label: 'United States Dollar', symbol: '$', flag: 'https://flagcdn.com/w320/us.png' },
  { value: 'EUR', label: 'Euro', symbol: '€', flag: 'https://flagcdn.com/w320/eu.png' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥', flag: 'https://flagcdn.com/w320/jp.png' },
  { value: 'GBP', label: 'British Pound', symbol: '£', flag: 'https://flagcdn.com/w320/gb.png' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$', flag: 'https://flagcdn.com/w320/au.png' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$', flag: 'https://flagcdn.com/w320/ca.png' },
  { value: 'CHF', label: 'Swiss Franc', symbol: 'CHF', flag: 'https://flagcdn.com/w320/ch.png' },
  { value: 'CNY', label: 'Chinese Yuan', symbol: '¥', flag: 'https://flagcdn.com/w320/cn.png' },
  { value: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$', flag: 'https://flagcdn.com/w320/hk.png' },
  { value: 'NZD', label: 'New Zealand Dollar', symbol: 'NZ$', flag: 'https://flagcdn.com/w320/nz.png' }
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
