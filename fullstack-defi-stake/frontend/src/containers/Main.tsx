import { useEthers } from '@usedapp/core';
import YourWallet from './YourWallet/YourWallet';
import { getSupportedTokens } from '../utils/helper';
import { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import TokenFarm from './TokenFarm/TokenFarm';

/**
 * Component for showing the Main app's container
 *
 * @component
 */
const Main = () => {
  const { chainId, error } = useEthers();
  const [showNetworkError, setShowNetworkError] = useState(false);

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
    <>
      <YourWallet supportedTokens={getSupportedTokens(chainId)} />
      <TokenFarm supportedTokens={getSupportedTokens(chainId)} />

      <Snackbar
        open={showNetworkError}
        autoHideDuration={5000}
        onClose={handleCloseNetworkError}
      >
        <Alert onClose={handleCloseNetworkError} severity='warning'>
          You gotta connect to the Kovan or Rinkeby network!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Main;
