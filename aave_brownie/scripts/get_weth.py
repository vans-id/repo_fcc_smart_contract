from brownie import interface, network, config, accounts
from scripts.helpful_scripts import get_account


def main():
    """
    Runs the get_weth function to get WETH
    """
    get_weth()


def get_weth():
    """
    Mints WETH by depositing ETH
    """

    # account = accounts[0]
    account = get_account()
    weth = interface.WethInterface(
        config["networks"][network.show_active()]["weth_token"]
    )

    tx = weth.deposit({"from": account, "value": 0.1 * 10 ** 18})
    tx.wait(1)

    print("Received 0.1 WETH")

    return tx
