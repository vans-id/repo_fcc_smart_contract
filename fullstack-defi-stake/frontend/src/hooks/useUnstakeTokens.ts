import { useContractFunction, useEthers } from '@usedapp/core';
import TokenFarm from '../chain-info/contracts/TokenFarm.json';
import { utils, constants } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import networkMapping from '../chain-info/deployments/map.json';
import { UNSTAKE_TOKENS } from '../utils/constants';

/**
 * Expose { send, state } object to facilitate unstaking the user's tokens from the TokenFarm contract
 *
 * @return {Promise<any>} the send function
 * @return {TransactionStatus} the transaction state
 * @return {utils.LogDescription[] | undefined} log events
 * @return {() => void} the reset state function
 */
const useUnstakeTokens = () => {
  const { chainId } = useEthers();

  const { abi } = TokenFarm;
  const tfContractAddress = chainId
    ? networkMapping[String(chainId)]['TokenFarm'][0]
    : constants.AddressZero;

  const tfInterface = new utils.Interface(abi);

  const tfContract = new Contract(tfContractAddress, tfInterface);

  return useContractFunction(tfContract, UNSTAKE_TOKENS, {
    transactionName: UNSTAKE_TOKENS,
  });
};

export default useUnstakeTokens;
