# 0.01899 ETH
# 18990000000000000 WEI
from brownie import Lottery, accounts, config, network
from web3 import Web3


def test_get_entrance_fee():
    """
    Test if the entranceFee value is valid.
    assert value may need to be changed in the future since
    ETH price fluctuates
    """
    account = accounts[0]
    lottery = Lottery.deploy(
        config["networks"][network.show_active()]["eth_usd_price_feed"],
        {"from": account},
    )

    assert lottery.getEntranceFee() > Web3.toWei(0.018, "ether")
    assert lottery.getEntranceFee() < Web3.toWei(0.022, "ether")
