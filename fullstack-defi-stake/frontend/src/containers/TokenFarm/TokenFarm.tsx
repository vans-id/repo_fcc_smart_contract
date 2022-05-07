import React, { useState } from 'react';
import { useEthers } from '@usedapp/core';
import { styled } from '@mui/material/styles';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Placeholder from '../../components/Placeholder';
import { Tab, Box, Typography, Paper } from '@mui/material';
import { Token } from '../../utils/helper';
import Unstake from './Unstake';

interface TokenFarmProps {
  /** @typedef {import('../../utils/helper').Token} Token */
  supportedTokens: Array<Token>;
}

const TokenFarm = ({ supportedTokens }: TokenFarmProps) => {
  const [selectedToken, setSelectedToken] = useState(0);

  const { account } = useEthers();

  const isConnected = account !== undefined;

  /**
   * update tab state with the currently selected tab
   * @param {React.ChangeEvent<{}>} e JS event object
   * @param {string} newValue latest selected tab value
   */
  const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedToken(parseInt(newValue));
  };

  return (
    <FarmContainer>
      <FarmCard elevation={0}>
        <FarmHeader variant='h5'>Total Deposit</FarmHeader>
        <Box>
          <TabContext value={selectedToken.toString()}>
            <TabList
              centered
              onChange={handleChange}
              aria-label='stake from tabs'
            >
              {supportedTokens.map((token, i) => (
                <Tab label={token.name} value={i.toString()} key={i} />
              ))}
            </TabList>
            {isConnected ? (
              supportedTokens.map((token, i) => (
                <TabPanel
                  value={i.toString()}
                  key={i}
                  style={{ padding: '2rem 0 0' }}
                >
                  <Unstake token={token} />
                </TabPanel>
              ))
            ) : (
              <Placeholder />
            )}
          </TabContext>
        </Box>
      </FarmCard>
    </FarmContainer>
  );
};

const FarmContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`
);
const FarmHeader = styled(Typography)(
  ({ theme }) => `
  margin-bottom: 0.5rem;
`
);
const FarmSubheader = styled(Typography)(
  ({ theme }) => `
  margin-bottom: 2rem;
  color: ${theme.palette.grey[700]}
`
);
const FarmCard = styled(Paper)(
  ({ theme }) => `
  width: 100%;
  padding: ${theme.spacing(4)};
  border-radius: 1.2rem;
`
);

export default TokenFarm;
