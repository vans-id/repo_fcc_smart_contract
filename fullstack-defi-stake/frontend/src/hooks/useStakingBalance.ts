import { useContractCall, useEthers } from '@usedapp/core';
import TokenFarm from '../chain-info/contracts/TokenFarm.json';
import { utils, BigNumber, constants } from 'ethers';
import networkMapping from '../chain-info/deployments/map.json';

/**
 * Get the staking balance of a certain token by the user in our TokenFarm contract
 *
 * @param {string} address - The contract address of the token
 * @return {BigNumber | undefined} - staked balance of selected token
 */
const useStakingBalance = (address: string): BigNumber | undefined => {
  const { account, chainId } = useEthers();

  const { abi } = TokenFarm;
  const tfContractAddress = chainId
    ? networkMapping[String(chainId)]['TokenFarm'][0]
    : constants.AddressZero;
  const tfInterface = new utils.Interface(abi);

  const [stakingBalance] =
    useContractCall({
      abi: tfInterface,
      address: tfContractAddress,
      method: 'stakingBalance',
      args: [address, account],
    }) ?? [];

  return stakingBalance;
};

export default useStakingBalance;
