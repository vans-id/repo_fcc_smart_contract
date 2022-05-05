import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material'

interface BalanceMsgProps {
  label: string,
  amount: number,
  tokenImgSrc: string
}

const BalanceMsgContainer = styled(Box)(({ theme }) => `
  display: inline-grid;
  grid-template-columns: auto auto auto;
  gap: ${theme.spacing(1)};
  align-items: center;
`)

const Amount = styled(Typography)(({ theme }) => `
  font-weight: 700;
  font-size: 1rem;
`)

/** 
 * Component for showing the user's balance.
 * 
 * @component
 * @example
 * return (
 *    <BalanceMsg 
 *        label="CREW" 
 *        amount={1000}
 *        tokenImgSrc="./src/image.png"  />
 * )
 */
const BalanceMsg = ({label, amount, tokenImgSrc}: BalanceMsgProps) => {
  return (
    <BalanceMsgContainer>
      <Typography>{label}</Typography>
      <Amount>{amount}</Amount>
      <Avatar 
        alt="token logo"
        src={tokenImgSrc}
        sx={{ width: 32, height: 32 }} 
      />
    </BalanceMsgContainer>
  )
}

export default BalanceMsg