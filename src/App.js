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
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(null);
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

      setRates([{ currency: initialTarget, rate: data.rate }]); // Ensure rates include the target currency
      setLastUpdated(moment(data.lastUpdated).format('DD/MM/YYYY HH:mm:ss'));
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
    return (rates || []).reduce((acc, { currency, rate }) => {
      acc[currency] = amount * rate;
      return acc;
    }, {});
  }, [rates, amount]);

  return (
    <Container maxWidth="sm" sx={{ padding: 4 }}>
      <Paper elevation={1} variant="elevation" sx={{ p: 2, mt: 1 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Currency Converter
          </Typography>
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
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
          <Grid sx={{ marginTop: 2 }}>
            {CURRENCY_OPTIONS.filter(option => (rates || []).some(rate => rate.currency === option.value)).map(option => {
              const rate = (rates || []).find(rate => rate.currency === option.value)?.rate || 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={option.value}>
                  <Paper variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{option.label}</Typography>
                      <Typography variant="body2">{CurrencyFormatter(rate, option.value)}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {CurrencyFormatter(amount, base)} = {CurrencyFormatter(convertedAmounts[option.value] || 0, option.value)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          <Box display="flex" alignItems="center" sx={{ opacity: 0.6, mt: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <strong>Last updated:</strong> {lastUpdated} <strong>Source:</strong> Exchange Rate API
              {apiStatus ? (
                <CheckCircleIcon color="success" sx={{ ml: 1 }} />
              ) : (
                <ErrorIcon color="error" sx={{ ml: 1 }} />
              )}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
