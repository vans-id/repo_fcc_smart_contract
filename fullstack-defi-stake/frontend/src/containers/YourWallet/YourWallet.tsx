import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Tab, Typography } from '@mui/material';
import { Token } from '../../utils/helper';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import WalletBalance from './WalletBalance';
import StakeForm from './StakeForm';
import { useEthers } from '@usedapp/core';
import Placeholder from '../../components/Placeholder';

interface YourWalletProps {
  /** @typedef {import('../../utils/helper').Token} Token */
  token: Token;
}

/**
 * Component for showing the user's token from the wallet.
 *
 * @component
 */
const YourWallet = ({ token }: YourWalletProps) => {
  const { account } = useEthers();

  const isConnected = account !== undefined;

  return (
    <WalletContainer>
      <WalletCard elevation={0}>
        <Box>
          {isConnected ? (
            <>
              <Typography variant='button'>Stake</Typography>
              <StakeForm token={token} />
              <WalletBalance token={token} />
            </>
          ) : (
            <Placeholder />
          )}
        </Box>
      </WalletCard>
    </WalletContainer>
  );
};

const WalletContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
`
);
const WalletCard = styled(Paper)(
  ({ theme }) => `
  width: 100%;
  padding: ${theme.spacing(4)};
  border-radius: 1.2rem;
`
);

export default YourWallet;
