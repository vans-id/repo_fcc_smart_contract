import { useEthers } from '@usedapp/core';
import YourWallet from './YourWallet/YourWallet';
import { getSupportedTokens } from '../utils/helper';

/**
 * Component for showing the Main app's container
 *
 * @component
 */
const Main = () => {
  const { chainId } = useEthers();

  return (
    <>
      <YourWallet supportedTokens={getSupportedTokens(chainId)} />
    </>
  );
};

export default Main;
