from brownie import network, exceptions
import pytest
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
    INITIAL_PRICE_FEED_VALUE,
)
from scripts.deploy import deploy_token_farm_and_crewmate_token


def test_set_price_feed_contract():
    """
    Test `setPriceFeedContract` function as follows:

    - Only for local testing
    - assert price feed is correct
    - assert only owner can call this function
    """
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    account = get_account()
    non_owner = get_account(index=1)
    token_farm, crewmate_token = deploy_token_farm_and_crewmate_token()

    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        crewmate_token.address, price_feed_address, {"from": account}
    )

    assert (
        token_farm.tokenPriceFeedMapping(crewmate_token.address) == price_feed_address
    )

    # with pytest.raises(exceptions.VirtualMachineError):
    #     token_farm.setPriceFeedContract(
    #         crewmate_token.address, price_feed_address, {"from": non_owner}
    #     )


def test_stake_tokens(amount_staked):
    """
    Test `stakeTokens` function function as follows:

    - Only for local testing
    - assert staking balance is equal to amount staked
    - assert user's token is staked
    - assert user's address added to stakers list

    Parameters
    --------
    amount_staked: integer
        Staked amount in Wei

    Returns
    --------
    token_farm
        Defi Smart Contract Address
    crewmate_token
        Reward token address
    """

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    account = get_account()
    token_farm, crewmate_token = deploy_token_farm_and_crewmate_token()

    crewmate_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, crewmate_token.address, {"from": account})

    assert (
        token_farm.stakingBalance(crewmate_token.address, account.address)
        == amount_staked
    )
    assert token_farm.uniqueTokenStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address

    return token_farm, crewmate_token


def test_issue_tokens(amount_staked):
    """
    Test `issueTokens` function function as follows:

    - Only for local testing
    - Require `test_stake_tokens`
    - assert staked balance is correct

    Staking 1 `crewmate_token` == in price to 1 `ETH`.
    Should get 2000 `crewmate_token` in reward since the price
    of `ETH` is $2000
    """

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    account = get_account()
    token_farm, crewmate_token = test_stake_tokens(amount_staked)
    starting_balance = crewmate_token.balanceOf(account.address)

    token_farm.issueTokens({"from": account})

    assert (
        crewmate_token.balanceOf(account.address)
        == starting_balance + INITIAL_PRICE_FEED_VALUE
    )
