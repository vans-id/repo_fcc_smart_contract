import { Box, Button, AppBar, Toolbar, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEthers } from '@usedapp/core';
import { Link } from 'react-router-dom';

/**
 * Component for showing the Header.
 *
 * @component
 */
const Header = () => {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const isConnected = account !== undefined;

  return (
    <AppbarContainer>
      <Typography
        variant='h6'
        noWrap
        component='div'
        sx={{ mr: 4, display: 'flex' }}
      >
        Amogus
      </Typography>

      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        {MENUS.map((menu) => (
          <Link to={`/${menu}`} style={{ margin: 0, textDecoration: 'none' }}>
            <MenuItem key={menu} onClick={() => {}}>
              {menu}
            </MenuItem>
          </Link>
        ))}
      </Box>

      {isConnected ? (
        <>
          <Chip
            label={
              account?.substring(0, 7) +
              '...' +
              account?.substring(account.length - 6)
            }
            variant='outlined'
            sx={{ mr: 2 }}
          />
          <Button variant='outlined' onClick={deactivate}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant='contained' onClick={activateBrowserWallet}>
          Connect
        </Button>
      )}
    </AppbarContainer>
  );
};

const MENUS = ['crew', 'weth', 'dai'];

const MenuItem = styled(Button)(
  ({ theme }) => `
  display: block;
  color: ${theme.palette.grey[700]};
  margin-right: 0.5rem;
`
);
const AppbarContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: 1rem 10vw;
`;

export default Header;
