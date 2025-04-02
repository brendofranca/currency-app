import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, Paper } from '@mui/material';
import './App.css';

function App() {
  const [base, setBase] = useState('');
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState(1); // New state for amount
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);

  const fetchCurrencyRate = async () => {
    if (!base || !target) {
      setError('Both fields are required.');
      return;
    }

    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080/currency'
        : 'https://currency-api-production-01.up.railway.app/currency';

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

  return (
    <Container maxWidth="sm" sx={{ padding: 4 }}>
      <Paper elevation={1} variant="elevation" sx={{ p: 2, mt: 1 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Currency Converter
          </Typography>
          <TextField
            label="Base Currency (e.g., EUR)"
            variant="outlined"
            fullWidth
            value={base}
            onChange={(e) => setBase(e.target.value)}
            error={!base && error}
            helperText={!base && error ? 'This field is required' : ''}
          />
          <TextField
            label="Target Currency (e.g., USD)"
            variant="outlined"
            fullWidth
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            error={!target && error}
            helperText={!target && error ? 'This field is required' : ''}
          />
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchCurrencyRate}
            sx={{ marginTop: 2 }}
          >
            Convert
          </Button>
          {error && !(!base || !target) && (
            <Alert severity="error" sx={{ marginTop: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {rate !== null && !error && (
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Conversion Rate: 1 {base} = {rate} {target}
            </Typography>
          )}
          {rate !== null && !error && (
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Converted Amount: {amount} {base} = {(amount * rate).toFixed(2)} {target}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
