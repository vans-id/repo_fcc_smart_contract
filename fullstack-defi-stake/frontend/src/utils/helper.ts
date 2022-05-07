import { constants } from 'ethers';

import AmogusImage from '../assets/amogus.png';
import EthImage from '../assets/eth.png';
import DaiImage from '../assets/dai.png';
import brownieConfig from '../brownie-config.json';
import helperConfig from '../helper-config.json';
import networkMapping from '../chain-info/deployments/map.json';

/**
 * @typedef Token
 * @property {string} image token image url
 * @property {string} address token contract address
 * @property {string} name token name
 */
export type Token = {
  image: string;
  address: string;
  name: string;
};

/**
 * Our single central location to store info on support tokens.
 * This is the only place you'll need to add a new token to get it to display in the UI!
 *
 * Modularize the addresses like with `dappTokenAddress`
 * To make it chain agnostic
 */

/**
 * Function that returns list of supported tokens for the app
 *
 * @param {number|undefined} chainId - the network chain ID
 * @return {Array<Token>} - the supported tokens
 */
export const getSupportedTokens = (chainId: number | undefined) => {
  const networkName = chainId ? helperConfig[chainId] : 'ganache';

  const crewmateTokenAddress = chainId
    ? networkMapping[String(chainId)]['CrewmateToken'][0]
    : constants.AddressZero;
  const wethTokenAddress = chainId
    ? brownieConfig['networks'][networkName]['weth_token']
    : constants.AddressZero;
  const fauTokenAddress = chainId
    ? brownieConfig['networks'][networkName]['fau_token']
    : constants.AddressZero;

  const SUPPORTED_TOKENS: Array<Token> = [
    { image: AmogusImage, address: crewmateTokenAddress, name: 'CREW' },
    { image: EthImage, address: wethTokenAddress, name: 'WETH' },
    { image: DaiImage, address: fauTokenAddress, name: 'DAI' },
  ];

  return SUPPORTED_TOKENS;
};
