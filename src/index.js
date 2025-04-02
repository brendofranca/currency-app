import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import App from './App';
import ScrollToTop from './ScrollToTop';
import reportWebVitals from './reportWebVitals';
import theme from './theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/poppins';
import './index.css';
import { AuthProvider } from './hooks/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <AuthProvider>
            <App />
          </AuthProvider>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals(console.log);
