import { useEthers, useTokenBalance } from '@usedapp/core'
import { Token } from '../Main'
import {formatUnits} from "@ethersproject/units"
import BalanceMsg from '../BalanceMsg'

interface WalletBalanceProps {
  /**
   * single token object
   */
  token: Token
}

/** 
 * Component for getting the user's balance.
 * 
 * @component
 * @example
 * const token: Token = {
 *    image: "./src/image.png",
 *    address: "0x00",
 *    name: "CREW"
 * }
 * return (
 *    <WalletBalance token={token} />
 * )
 */
const WalletBalance = ({token: { image, address, name }}: WalletBalanceProps) => {
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(address, account)
  const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

  return (
    <BalanceMsg label={`Available ${name} balance`} amount={formattedTokenBalance} tokenImgSrc={image}  />
  )
}

export default WalletBalance