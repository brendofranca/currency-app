import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, Paper, InputAdornment, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import moment from './utils/Moment';
import { CurrencyFormatter } from './utils/CurrencyFormatter';
import CurrencyOptions, { CURRENCY_OPTIONS } from './components/common/CurrencyOptions';
import './App.css';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/currency'
    : 'https://currency-api-production-01.up.railway.app/currency';

function App() {
  const [base, setBase] = useState('BRL');
  const [target, setTarget] = useState('EUR');
  const [amount, setAmount] = useState('0,00');
  const [, setRate] = useState(null);
  const [error, setError] = useState(null);
  const [rates, setRates] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [apiStatus, setApiStatus] = useState(false);

  const fetchCurrencyRate = async () => {
    if (!base || !target) {
      setError('Both fields are required.');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${baseUrl}/${base}/${target}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRate(data.rate);
    } catch (error) {
      console.error('Error fetching currency rate:', error);
      setError('Failed to fetch currency rate. Please try again.');
    }
  };

  const fetchRates = useCallback(async () => {
    try {
      const initialBase = base || 'BRL';
      const initialTarget = target || 'EUR';
      const response = await fetch(`${baseUrl}/${initialBase}/${initialTarget}`);
      const data = await response.json();

      setRates([{ currency: initialTarget, rate: data.rate }]);
      setLastUpdated(moment(data.last_update_utc).format('DD/MM/YYYY HH:mm:ss'));
      setApiStatus(true);

      if (!base && !target) {
        setRate(data.rate);
      }
    } catch (error) {
      setApiStatus(false);
      setRates([]);
      setLastUpdated(new Date().toLocaleString());
    }
  }, [base, target]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convertedAmounts = useMemo(() => {
    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (isNaN(numericAmount)) return {}; 
    return (rates || []).reduce((acc, { currency, rate }) => {
      acc[currency] = numericAmount * rate;
      return acc;
    }, {});
  }, [rates, amount]);

  const handleAmountChange = (e) => {
    setAmount(formatCurrencyValue(e.target.value));
  };

  const formatCurrencyValue = (value) => {
    let numericValue = value.replace(/\D/g, ''); 
    if (numericValue === '') numericValue = '0';
    const parsedValue = parseFloat(numericValue) / 100; 
    return parsedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const renderCurrencyOptions = () => (
    <Grid>
      <Grid item xs={12}>
        <CurrencyOptions
          value={base}
          onChange={(e) => setBase(e.target.value)}
          label="Base Currency"
          fullWidth
        />
      </Grid>
      <Grid>
        <CurrencyOptions
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          label="Target Currency"
          fullWidth
        />
      </Grid>
    </Grid>
  );

  const renderConvertedRates = () => (
    <Grid sx={{ marginTop: 2 }}>
      {CURRENCY_OPTIONS.filter(option => (rates || []).some(rate => rate.currency === option.value)).map(option => {
        const rate = (rates || []).find(rate => rate.currency === option.value)?.rate || 0;
        return (
          <Grid item xs={12} sm={6} md={4} key={option.value}>
            <Paper variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{option.label}</Typography>
                <Typography variant="body2">{CurrencyFormatter(1, base)} = {CurrencyFormatter(rate, option.value)}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {CurrencyFormatter(amount.replace(/\./g, '').replace(',', '.'), base)} = {CurrencyFormatter(convertedAmounts[option.value] || 0, option.value)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );

  const renderFooter = () => (
    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ opacity: 0.8, mt: 2, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <strong>Last updated:</strong> {lastUpdated}
      </Typography>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <strong>Source:</strong> 
        <a href="https://www.exchangerate-api.com/" target="_blank" rel="noopener noreferrer">
          Exchange Rate API
        </a>
        {apiStatus ? (
          <CheckCircleIcon color="success" />
        ) : (
          <ErrorIcon color="error" />
        )}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ padding: 4 }}>
      <Paper elevation={1} variant="elevation" sx={{ p: 2, mt: 1 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Currency Converter
          </Typography>
          {renderCurrencyOptions()}
          <TextField
            label="Amount"
            type="text"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={handleAmountChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {CURRENCY_OPTIONS.find(option => option.value === base)?.symbol}
                </InputAdornment>
              ),
            }}
            sx={{ marginTop: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchCurrencyRate}
            fullWidth
          >
            Convert
          </Button>
          {error && (
            <Alert severity="error" sx={{ marginTop: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {renderConvertedRates()}
          {renderFooter()}
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
