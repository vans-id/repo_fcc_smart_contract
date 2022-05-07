import { useEthers, useTokenBalance } from '@usedapp/core';
import { Token } from '../../utils/helper';
import { formatUnits } from '@ethersproject/units';
import BalanceMsg from '../../components/BalanceMsg';

interface WalletBalanceProps {
  /** @typedef {import('../../utils/helper').Token} Token */
  token: Token;
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
 * return <WalletBalance token={token} />
 */
const WalletBalance = ({
  token: { image, address, name },
}: WalletBalanceProps) => {
  const { account } = useEthers();
  const tokenBalance = useTokenBalance(address, account);
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;

  return (
    <BalanceMsg
      name={name}
      label={`Available balance`}
      amount={formattedTokenBalance}
    />
  );
};

export default WalletBalance;
