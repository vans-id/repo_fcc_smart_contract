import { useEthers } from '@usedapp/core'
import helperConfig from '../helper-config.json'
import networkMapping from '../chain-info/deployments/map.json'
import { constants } from "ethers"
import brownieConfig from '../brownie-config.json'
import AmogusImage from '../assets/amogus.png'
import EthImage from '../assets/eth.png'
import DaiImage from '../assets/dai.png'
import YourWallet from './YourWallet/YourWallet'

export type Token = {
  image: string,
  address: string,
  name: string,
}

/** 
 * Component for showing the Main app's container
 * 
 * @component
 * @example
 * return (
 *    <Main />
 * )
 */
const Main = () => {
  const { chainId, error } = useEthers()
  const networkName = chainId ? helperConfig[chainId] : "dev"
  const crewmateTokenAddress = chainId ? networkMapping[String(chainId)]["CrewmateToken"][0] : constants.AddressZero
  const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
  const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

  const supportedTokens: Array<Token> = [
    {image: AmogusImage, address: crewmateTokenAddress, name: "CREW" },
    {image: EthImage, address: wethTokenAddress, name: "ETH" },
    {image: DaiImage, address: fauTokenAddress, name: "DAI" },
  ]

  return (
    <YourWallet supportedTokens={supportedTokens} />
  )
}

export default Main