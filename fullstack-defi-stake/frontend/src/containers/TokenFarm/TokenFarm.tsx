import { useEthers } from '@usedapp/core';
import { styled } from '@mui/material/styles';
import Placeholder from '../../components/Placeholder';
import { Box, Typography, Paper } from '@mui/material';
import { Token } from '../../utils/helper';
import Unstake from './Unstake';

interface TokenFarmProps {
  /** @typedef {import('../../utils/helper').Token} Token */
  token: Token;
}

const TokenFarm = ({ token }: TokenFarmProps) => {
  const { account } = useEthers();

  const isConnected = account !== undefined;

  return (
    <FarmContainer>
      <FarmCard elevation={0}>
        <Box>{isConnected ? <Unstake token={token} /> : <Placeholder />}</Box>
      </FarmCard>
    </FarmContainer>
  );
};

const FarmContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
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
