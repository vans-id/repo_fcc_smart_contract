from brownie import network
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
)
from scripts.deploy import deploy_token_farm_and_crewmate_token
import pytest


def test_stake_and_issue_correct_amounts(amount_staked):
    """Integration test for `issueTokens` works as follows:

    - stake Crewmate Token
    - get `starting_balance`, `price_feed_contract`, and `amount_token_to_issue`
    - call and confirm transaction
    - assert user's balance is correct

    Parameters
    --------
    amount_staked: integer
        Staked amount in Wei
    """
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for integration testing!")
    token_farm, crewmate_token = deploy_token_farm_and_crewmate_token()
    account = get_account()

    crewmate_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, crewmate_token.address, {"from": account})
    starting_balance = crewmate_token.balanceOf(account.address)
    price_feed_contract = get_contract("dai_usd_price_feed")
    (_, price, _, _, _) = price_feed_contract.latestRoundData()

    amount_token_to_issue = (
        price / 10 ** price_feed_contract.decimals()
    ) * amount_staked

    issue_tx = token_farm.issueTokens({"from": account})
    issue_tx.wait(1)

    assert (
        crewmate_token.balanceOf(account.address)
        == amount_token_to_issue + starting_balance
    )
