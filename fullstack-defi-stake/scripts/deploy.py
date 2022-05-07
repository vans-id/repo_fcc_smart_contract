import json, os
import shutil
from brownie import CrewmateToken, TokenFarm, network, config
from web3 import Web3
from scripts.helpful_scripts import get_account, get_contract
import yaml

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_crewmate_token(is_update=False):
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

    if is_update:
        update_front_end()

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


def update_front_end():
    """Sending config in JSON Format and build folder"""

    copy_folders_to_front_end("./build", "./frontend/src/chain-info")

    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)

    print("Frontend updated...")


def copy_folders_to_front_end(src, dest):
    """Copy folder to frontend.
    If folder exist, delete it first before copying

    Parameters
    --------
    src: string
        the source folder path that want to be copied
    dest: string
        copied destination path folder
    """
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_crewmate_token(is_update=True)
