import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import Header from './containers/Header';
import { getSupportedTokens } from './utils/helper';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import TokenPage from './pages/TokenPage';
import HomePage from './pages/HomePage';
import { useEffect, useState } from 'react';
import CustomAlert from './components/CustomAlert';

const AppContainer = styled(Box)(
  ({ theme }) => `
  background: #F2F4F6;
  min-height: 100vh;
  padding-bottom: 40vh;
`
);

function App() {
  const [showNetworkError, setShowNetworkError] = useState(false);

  const { chainId, error } = useEthers();

  /**
   * function to change `showNetworkError` state on trigger
   * @param {React.SyntheticEvent | React.MouseEvent} e the event object
   * @param {string?} reason main cause of the error
   */
  const handleCloseNetworkError = (
    e?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowNetworkError(false);
  };
  /**
   * observe the error from useEthers and conditionally show a notification
   */
  useEffect(() => {
    if (error && error.name === 'UnsupportedChainIdError') {
      setShowNetworkError(true);
    } else {
      setShowNetworkError(false);
    }
  }, [error, showNetworkError]);

  return (
    <AppContainer>
      <BrowserRouter>
        <Header />
        <Container maxWidth='sm'>
          <Routes>
            <Route index element={<HomePage />} />
            {getSupportedTokens(chainId).map((token, i) => (
              <Route
                key={i}
                path={`/${token.symbol}`}
                element={<TokenPage token={token} />}
              />
            ))}
            {/* <Route path='*' element={<NoPage />} /> */}
          </Routes>

          <CustomAlert
            open={showNetworkError}
            onClose={handleCloseNetworkError}
            severity='warning'
            message='You gotta connect to the Kovan or Rinkeby network!'
          />
        </Container>
      </BrowserRouter>
    </AppContainer>
  );
}

export default App;
