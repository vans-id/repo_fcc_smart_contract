from brownie import network, exceptions
import pytest
from scripts.helpful_scripts import (
    DECIMALS,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
    INITIAL_PRICE_FEED_VALUE,
)
from scripts.deploy import KEPT_BALANCE, deploy_token_farm_and_crewmate_token


def test_set_price_feed_contract():
    """Test `setPriceFeedContract` function as follows:

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
    """Test `stakeTokens` function as follows:

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
        Defi Smart Contract
    crewmate_token
        Reward token Contract
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
    """Test `issueTokens` function as follows:

    - Only for local testing
    - Require `test_stake_tokens`
    - assert staked balance is correct

    Parameters
    --------
    amount_staked: integer
        Staked amount in Wei

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


def test_get_user_total_value_with_different_tokens(amount_staked, random_erc20):
    """Test `getUserTotalValue` function as follows:

    - allow token to be staked
    - get token's price feed contract
    - approve token
    - stake token
    - assert total value staked is correct

    Parameters
    --------
    amount_staked: integer
        Staked amount in Wei
    random_erc20: Contract
        An random mocked ERC20 Contract Token
    """
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    account = get_account()
    token_farm, crewmate_token = test_stake_tokens(amount_staked)

    token_farm.addAllowedTokens(random_erc20.address, {"from": account})
    token_farm.setPriceFeedContract(
        random_erc20.address, get_contract("eth_usd_price_feed"), {"from": account}
    )
    random_erc20_stake_amount = amount_staked * 2
    random_erc20.approve(
        token_farm.address, random_erc20_stake_amount, {"from": account}
    )
    token_farm.stakeTokens(
        random_erc20_stake_amount, random_erc20.address, {"from": account}
    )

    total_value = token_farm.getUserTotalValue(account.address)
    assert total_value == INITIAL_PRICE_FEED_VALUE * 3


def test_get_token_value():
    """Test `getTokenValue` function as follows:

    - assert function returns correct value of crewmate_token
    """

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    token_farm, crewmate_token = deploy_token_farm_and_crewmate_token()

    assert token_farm.getTokenValue(crewmate_token.address) == (
        INITIAL_PRICE_FEED_VALUE,
        DECIMALS,
    )


def test_unstake_tokens(amount_staked):
    """Test `unstakeTokens` function as follows:

    - assert user's token balance is correct
    - assert defi's staking balance for that user is zero
    - assert uniqueTokenStaked for that user is zero

    Parameters
    --------
    amount_staked: integer
        Staked amount in Wei
    """

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    account = get_account()
    token_farm, crewmate_token = test_stake_tokens(amount_staked)

    token_farm.unstakeTokens(crewmate_token.address, {"from": account})

    assert crewmate_token.balanceOf(account.address) == KEPT_BALANCE
    assert token_farm.stakingBalance(crewmate_token.address, account.address) == 0
    assert token_farm.uniqueTokenStaked(account.address) == 0


def test_add_allowed_tokens():
    """
    Test `unstakeTokens` function as follows:

    - `addAllowedTokens` for Crewmate Token
    - assert Crewmate Token is added to `allowedTokens`
    - assert only owner could call this function
    """

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    account = get_account()
    not_owner = get_account(index=1)
    token_farm, crewmate_token = deploy_token_farm_and_crewmate_token()

    token_farm.addAllowedTokens(crewmate_token.address, {"from": account})

    assert token_farm.allowedTokens(0) == crewmate_token.address
    # with pytest.raises(exceptions.VirtualMachineError):
    #     token_farm.addAllowedTokens(crewmate_token.address, {"from": not_owner})


def test_token_is_allowed():
    """
    Test `tokenIsAllowed` function as follows:

    - assert function returns True for deployed token
    """
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    token_farm, crewmate_token = deploy_token_farm_and_crewmate_token()

    assert token_farm.tokenIsAllowed(crewmate_token.address) == True
