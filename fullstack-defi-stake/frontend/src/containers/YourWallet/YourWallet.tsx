import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Tab, Typography } from '@mui/material';
import { Token } from '../../utils/helper';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import WalletBalance from './WalletBalance';
import StakeForm from './StakeForm';

interface YourWalletProps {
  /**
   * Available tokens in the defi
   */
  supportedTokens: Array<Token>;
}

/**
 * Component for showing the user's token from the wallet.
 *
 * @component
 * @example
 * const supportedTokens: Array<Token> = [
 *   {image: "asset/image.png", address: "0x00", name: "CREW" },
 * ]
 * return <YourWallet supportedTokens={supportedTokens} />
 */
const YourWallet = ({ supportedTokens }: YourWalletProps) => {
  const [selectedToken, setSelectedToken] = useState<number>(0);

  const tokenName = supportedTokens[selectedToken].name;

  /**
   * update tab state with the currently selected tab
   * @param   {React.ChangeEvent<{}>} e   JS event object
   * @param   {string} newValue   latest selected tab value
   */
  const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedToken(parseInt(newValue));
  };

  return (
    <WalletContainer>
      <WalletHeader variant='h5'>{`Stake ${tokenName}`}</WalletHeader>
      <WalletSubheader>
        Stake {tokenName} and receive CREW while staking.
      </WalletSubheader>
      <WalletCard elevation={0}>
        <Box>
          <TabContext value={selectedToken.toString()}>
            <TabList onChange={handleChange} aria-label='stake from tabs'>
              {supportedTokens.map((token, i) => (
                <Tab label={token.name} value={i.toString()} key={i} />
              ))}
            </TabList>
            {supportedTokens.map((token, i) => (
              <TabPanel
                value={i.toString()}
                key={i}
                style={{ padding: '2rem 0 0' }}
              >
                <div>
                  <WalletBalance token={token} />
                  <StakeForm token={token} />
                </div>
              </TabPanel>
            ))}
          </TabContext>
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
const WalletHeader = styled(Typography)(
  ({ theme }) => `
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`
);
const WalletSubheader = styled(Typography)(
  ({ theme }) => `
  margin-bottom: 2rem;
  color: ${theme.palette.grey[700]}
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
