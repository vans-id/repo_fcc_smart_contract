import {useState} from 'react'
import { styled } from '@mui/material/styles';
import { Box, Tab, Typography } from '@mui/material'
import { Token } from '../Main'
import {TabContext, TabList, TabPanel} from '@mui/lab';
import WalletBalance from './WalletBalance';

interface YourWalletProps {
  /**
   * Available tokens in the defi
   */
  supportedTokens: Array<Token>
}

const WalletHeader = styled(Typography)(({ theme }) => `
  margin-top: 2rem;
  margin-bottom: 1rem;
`)

/** 
 * Component for showing the user's token from the wallet.
 * 
 * @component
 * @example
 * const supportedTokens: Array<Token> = [
 *   {image: "asset/image.png", address: "0x00", name: "CREW" },
 * ]
 * return (
 *    <YourWallet supportedTokens={supportedTokens} />
 * )
 */
const YourWallet = ({supportedTokens}: YourWalletProps) => {
  const [selectedToken, setSelectedToken] = useState<number>(0)

  /**
   * updated tab state with the currently selected tab
   * @param   {React.ChangeEvent<{}>} e   JS event object
   * @param   {string} newValue   latest selected tab value
   */
  const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedToken(parseInt(newValue))
  }

  return (
    <Box>
      <WalletHeader variant="h4">Your Wallet</WalletHeader>
      <Box>
        <TabContext value={selectedToken.toString()}>
          <TabList onChange={handleChange} aria-label='stake from tabs'>
            {supportedTokens.map((token, i) => (
              <Tab label={token.name} value={i.toString()} key={i} />
            ))}
          </TabList>
          {supportedTokens.map((token, i) => (
            <TabPanel value={i.toString() } key={i} >
              <div>
                <WalletBalance token={token} />
              </div>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Box>
  )
}

export default YourWallet