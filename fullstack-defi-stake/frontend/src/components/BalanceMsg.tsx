import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface BalanceMsgProps {
  /** token name */
  symbol: string;
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
const BalanceMsg = ({ symbol, label, amount }: BalanceMsgProps) => {
  return (
    <BalanceContainer>
      <Typography variant='body2'>{label}</Typography>
      <TokenContainer>
        <Amount>{amount}</Amount>
        <Typography>{symbol}</Typography>
      </TokenContainer>
    </BalanceContainer>
  );
};

const BalanceContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`
);

const TokenContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
`
);

const Amount = styled(Typography)(
  ({ theme }) => `
  margin-right: 0.25rem;
`
);

export default BalanceMsg;
