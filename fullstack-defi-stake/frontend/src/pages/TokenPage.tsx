import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Token } from '../utils/helper';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import YourWallet from '../containers/YourWallet/YourWallet';
import TokenFarm from '../containers/TokenFarm/TokenFarm';

interface TokenPageProps {
  token: Token;
}

const TokenPage = ({ token }: TokenPageProps) => {
  const [selectedMenu, setSelectedMenu] = useState('0');

  /**
   * update tab state with the currently selected tab
   * @param {React.ChangeEvent<{}>} e JS event object
   * @param {string} newValue latest selected tab value
   */
  const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedMenu(newValue);
  };
  return (
    <PageContainer>
      <PageHeader variant='h5'>Stake {token.name}</PageHeader>
      <PageSubheader>
        Stake {token.symbol} and receive CREW while staking
      </PageSubheader>

      <Box style={{ width: '100%' }}>
        <TabContext value={selectedMenu}>
          <TabList
            centered
            onChange={handleChange}
            aria-label='stake from tabs'
          >
            <Tab label='Stake' value={'0'} />
            <Tab label='Unstake' value={'1'} />
          </TabList>
          <TabPanel value={'0'}>
            <YourWallet token={token} />
          </TabPanel>
          <TabPanel value={'1'}>
            <TokenFarm token={token} />
          </TabPanel>
        </TabContext>
      </Box>
    </PageContainer>
  );
};

const PageContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
`
);
const PageHeader = styled(Typography)(
  ({ theme }) => `
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`
);
const PageSubheader = styled(Typography)(
  ({ theme }) => `
  margin-bottom: 1rem;
  color: ${theme.palette.grey[700]}
`
);

export default TokenPage;
