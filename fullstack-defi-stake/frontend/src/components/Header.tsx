import { Box, Button, AppBar, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useEthers } from '@usedapp/core'

/** 
 * Component for showing the Header.
 * 
 * @component
 * @example
 * return (
 *    <Header />
 * )
 */
const Header = () => {
  const {activateBrowserWallet, account, deactivate} = useEthers()
  const isConnected = account !== undefined

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Amogus
          </Typography>
           {isConnected ? (
            <Button variant='outlined' onClick={deactivate}>Disconnect</Button>
           ) : (
            <Button variant='contained' onClick={activateBrowserWallet}>Connect</Button>
           )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header