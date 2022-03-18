from brownie import Lottery, network, config
import time

from scripts.helpful_scripts import fund_with_link, get_account, get_contract


def deploy_lottery():
    """Deploys Lottery and fullfill it's requirements"""

    account = get_account()

    lottery = Lottery.deploy(
        get_contract("eth_usd_price_feed").address,
        get_contract("vrf_coordinator").address,
        get_contract("link_token").address,
        config["networks"][network.show_active()]["fee"],
        config["networks"][network.show_active()]["keyhash"],
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )

    print("Deployed lottery!")

    return lottery


def start_lottery():
    """Opens the lottery

    Change the state to OPEN
    """
    account = get_account()
    lottery = Lottery[-1]

    starting_tx = lottery.startLottery({"from": account})
    starting_tx.wait(1)

    print("Lottery has been started!")


def enter_lottery():
    """Enter the lottery with the given account

    Added 1 Gwei to entrance fee due to slippage
    """
    account = get_account()
    lottery = Lottery[-1]
    value = lottery.getEntranceFee() + 2_0000_0000

    tx = lottery.enter({"from": account, "value": value})
    tx.wait(1)

    print("You have entered the lottery")


def end_lottery():
    """Ends the lottery. Funded the contract before could end the lottery"""

    account = get_account()
    lottery = Lottery[-1]

    tx = fund_with_link(lottery.address)
    tx.wait(1)

    ending_transaction = lottery.endLottery({"from": account})
    ending_transaction.wait(1)

    time.sleep(60)

    print(f"{lottery.recentWinner()} is the new winner!")


def main():
    deploy_lottery()
    start_lottery()
    enter_lottery()
    end_lottery()
