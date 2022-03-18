from brownie import network
import pytest
from scripts.deploy_lottery import deploy_lottery
from web3 import Web3

from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    fund_with_link,
    get_account,
    get_contract,
)


def test_get_entrance_fee():
    """
    Assure the entranceFee value is valid. Only run this test on development environtment
    """

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    lottery = deploy_lottery()
    entrance_fee = lottery.getEntranceFee()
    expected_fee = Web3.toWei(0.025, "ether")

    assert expected_fee == entrance_fee


def test_cant_enter_unless_started():
    """Assure people can only enter the lottery when it has been opened. Only run this test on development environtment"""

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    lottery = deploy_lottery()

    with pytest.raises(AttributeError):
        lottery.enter({"from": get_account(), "value": lottery.getEntranceFee()})


def test_can_start_and_enter_lottery():
    """Assure player is added after enter the lottery"""

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    lottery = deploy_lottery()
    account = get_account()

    lottery.startLottery({"from": account})
    lottery.enter({"from": account, "value": lottery.getEntranceFee()})

    assert lottery.players(0) == account


def test_can_end_lottery():
    """Assure the lottery can be ended"""

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    lottery = deploy_lottery()
    account = get_account()

    lottery.startLottery({"from": account})
    lottery.enter({"from": account, "value": lottery.getEntranceFee()})

    fund_with_link(lottery)

    lottery.endLottery({"from": account})

    assert lottery.lottery_state() == 2


def test_can_pick_winner_correctly():
    """Assure the lottery is correctly choose a winner(via requestRandomness), pays the winner, and correctly resets the lottery.

    Mocks responses from chainlink node"""

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    lottery = deploy_lottery()
    account = get_account()

    lottery.startLottery({"from": account})
    lottery.enter({"from": account, "value": lottery.getEntranceFee()})
    lottery.enter({"from": get_account(index=1), "value": lottery.getEntranceFee()})
    lottery.enter({"from": get_account(index=2), "value": lottery.getEntranceFee()})

    fund_with_link(lottery)

    transaction = lottery.endLottery({"from": account})
    request_id = transaction.events["RequestedRandomness"]["requestId"]

    STATIC_RNG = 777

    get_contract("vrf_coordinator").callBackWithRandomness(
        request_id, STATIC_RNG, lottery.address, {"from": account}
    )

    acc_balance = account.balance()
    lottery_balance = lottery.balance()

    assert lottery.recentWinner() == account
    assert lottery.balance() == 0
    assert account.balance() == acc_balance + lottery_balance


# def test_get_entrance_fee():
#     """
#     Test if the entranceFee value is valid. Assert value may need to be changed in the future since ETH price fluctuates
#     """
#     account = accounts[0]
#     lottery = Lottery.deploy(
#         config["networks"][network.show_active()]["eth_usd_price_feed"],
#         {"from": account},
#     )

#     assert lottery.getEntranceFee() > Web3.toWei(0.018, "ether")
#     assert lottery.getEntranceFee() < Web3.toWei(0.022, "ether")
