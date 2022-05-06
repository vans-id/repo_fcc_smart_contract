import { useContractFunction, useEthers } from '@usedapp/core';
import TokenFarm from '../chain-info/contracts/TokenFarm.json';
import ERC20 from '../chain-info/contracts/MockERC20.json';
import networkMapping from '../chain-info/deployments/map.json';
import { Contract } from '@ethersproject/contracts';
import { constants, utils } from 'ethers';
import { useState, useEffect } from 'react';
import { APPROVE_TOKENS, STAKE_TOKENS } from '../utils/constants';

/**
 * Hook for approve and stake user's token.
 *
 * @param {string} tokenAddress The selected token address
 * @return {Promise<void>} The stake function
 * @return {TransactionStatus} The transaction status
 */
const useStakeTokens = (tokenAddress: string) => {
  const [amountToStake, setAmountToStake] = useState('0');

  const { chainId } = useEthers();

  const { abi } = TokenFarm;
  const tokenFarmAddress = chainId
    ? networkMapping[String(chainId)]['TokenFarm'][0]
    : constants.AddressZero;
  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface);

  const erc20ABI = ERC20.abi;
  const erc20Interface = new utils.Interface(erc20ABI);
  const erc20Contract = new Contract(tokenAddress, erc20Interface);

  const { send: approveSend, state: approveState } = useContractFunction(
    erc20Contract,
    APPROVE_TOKENS,
    {
      transactionName: APPROVE_TOKENS,
    }
  );

  const { send: stakeSend, state: stakeState } = useContractFunction(
    tokenFarmContract,
    STAKE_TOKENS,
    { transactionName: STAKE_TOKENS }
  );

  const [state, setState] = useState(approveState);

  /**
   * Function to approve user's ERC20 token.
   *
   * @param {string} amount amount to be staked
   * @returns { Promise<void> } transaction object
   */
  const approveAndStake = (amount: string) => {
    setAmountToStake(amount);
    return approveSend(tokenFarmAddress, amount);
  };

  useEffect(() => {
    if (approveState.status === 'Success') {
      stakeSend(amountToStake, tokenAddress);
    }
  }, [approveState, amountToStake, tokenAddress]);

  useEffect(() => {
    if (approveState.status === 'Success') {
      setState(stakeState);
    } else {
      setState(approveState);
    }
  }, [approveState, stakeState]);

  return { approveAndStake, state };
};

export default useStakeTokens;
