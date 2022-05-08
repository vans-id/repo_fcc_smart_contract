import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DAppProvider, Kovan } from '@usedapp/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDefaultProvider } from 'ethers';
import './index.css';
import { indigo } from '@mui/material/colors';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const lightTheme = createTheme({
  palette: {
    primary: {
      main: indigo.A400,
    },
    secondary: {
      main: indigo.A200,
    },
  },
});

root.render(
  <React.StrictMode>
    <DAppProvider
      config={{
        readOnlyChainId: Kovan.chainId,
        readOnlyUrls: {
          [Kovan.chainId]: getDefaultProvider('kovan'),
        },
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000,
        },
      }}
    >
      <ThemeProvider theme={lightTheme}>
        <App />
      </ThemeProvider>
    </DAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
