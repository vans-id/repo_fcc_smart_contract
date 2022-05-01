from brownie import CrewmateToken, TokenFarm, network, config
from web3 import Web3
from scripts.helpful_scripts import get_account, get_contract

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_crewmate_token():
    """Deploy token farm contract and crewmate token

    Returns
    --------
    token_farm
        Token Farm for Defi Smart Contract
    crewmate_token
        Reward Token for staking in defi
    """

    account = get_account()
    crewmate_token = CrewmateToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        crewmate_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    tx = crewmate_token.transfer(
        token_farm.address,
        crewmate_token.totalSupply() - KEPT_BALANCE,
        {"from": account},
    )
    tx.wait(1)

    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_of_allowed_tokens = {
        crewmate_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }
    add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)

    return token_farm, crewmate_token


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    """Add tokens to be able to stake

    Parameters
    --------
    token_farm: address
        Defi smart contract address
    dict_of_allowed_tokens: dict
        Allowed tokens in dictionary data structure
    account: address
        Owner account to deploy smart contract

    Returns
    --------
    token_farm
        Token Farm for Defi Smart Contract
    crewmate_token
        Reward Token for staking in defi
    """

    for token in dict_of_allowed_tokens:
        add_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(
            token.address, dict_of_allowed_tokens[token], {"from": account}
        )
        set_tx.wait(1)
    return token_farm


def main():
    deploy_token_farm_and_crewmate_token()
