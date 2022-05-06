import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface BalanceMsgProps {
  /** token name */
  name: string;
  /** UI's label */
  label: string;
  /** token amount */
  amount: number;
}

/**
 * Component for showing the user's balance.
 *
 * @component
 * @example
 * return (
 *    <BalanceMsg
 *        name="CREW"
 *        label="Available Balance"
 *        amount={1000}  />
 * )
 */
const BalanceMsg = ({ name, label, amount }: BalanceMsgProps) => {
  return (
    <Box>
      <Typography>{label}</Typography>
      <TokenContainer>
        <Amount>{amount}</Amount>
        <Typography>{name}</Typography>
      </TokenContainer>
    </Box>
  );
};

const TokenContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  margin-top: ${theme.spacing(1)}
`
);

const Amount = styled(Typography)(
  ({ theme }) => `
  font-weight: 700;
  margin-right: 0.5rem;
`
);

export default BalanceMsg;
