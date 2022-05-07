import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

/**
 * Component placeholder if metamask is not connected.
 *
 * @component
 */
const Placeholder = () => {
  return (
    <PlaceholderContainer>
      <Typography variant='h6' component='span'>
        Please connect your Metamask account
      </Typography>
    </PlaceholderContainer>
  );
};

const PlaceholderContainer = styled(Box)(
  ({ theme }) => `
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: 150px;
`
);

export default Placeholder;
