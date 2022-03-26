from brownie import network, config, interface, accounts
from scripts.helpful_scripts import get_account
from scripts.get_weth import get_weth
from web3 import Web3


AMOUNT = Web3.toWei(0.1, "ether")
# AMOUNT = 10 ** 17


def main():
    """Main Driver"""

    # account = accounts[0]
    account = get_account()
    erc20_address = config["networks"][network.show_active()]["weth_token"]

    if network.show_active() in ["mainnet-fork"]:
        get_weth()

    lending_pool = get_lending_pool()

    approve_erc20(AMOUNT, lending_pool.address, erc20_address, account)

    print("Depositing...")
    tx = lending_pool.deposit(
        erc20_address, AMOUNT, account.address, 0, {"from": account}
    )
    tx.wait(1)
    print("Deposited!")

    borrowable_eth, total_debt = get_borrowable_data(lending_pool, account)
    dai_eth_price = get_asset_price(
        config["networks"][network.show_active()]["dai_eth_price_feed"]
    )
    amount_dai_to_borrow = (1 / dai_eth_price) * (borrowable_eth * 0.95)

    print(f"Borrowing {amount_dai_to_borrow} DAI")

    dai_address = config["networks"][network.show_active()]["dai_token"]

    borrow_tx = lending_pool.borrow(
        dai_address,
        Web3.toWei(amount_dai_to_borrow, "ether"),
        1,
        0,
        account.address,
        {"from": account},
    )
    borrow_tx.wait(1)

    print("Borrowed some DAI")
    get_borrowable_data(lending_pool, account)

    # repay_all(Web3.toWei(amount_dai_to_borrow, "ether"), lending_pool, account)

    print("Finished deposit, borrow, and repay with Aave, Brownie, and Chainlink")


def repay_all(amount, lending_pool, account):
    """"""

    approve_erc20(
        Web3.toWei(amount, "ether"),
        lending_pool,
        config["networks"][network.show_active()]["dai_token"],
        {"from": account},
    )
    repay_tx = lending_pool.repay(
        config["networks"][network.show_active()]["dai_token"],
        amount,
        1,
        account.address,
        {"from": account},
    )
    repay_tx.wait(1)

    print("Debt has been repayed")


def get_asset_price(price_feed_address):
    """
    Get DAI/ETH price

    Parameters
    --------
    price_feed_address: Address
        DAI/ETH price feed address

    Returns
    --------
    converted_latest_price
    """
    dai_eth_price_feed = interface.AggregatorV3Interface(price_feed_address)
    latest_price = dai_eth_price_feed.latestRoundData()[1]
    converted_latest_price = Web3.fromWei(latest_price, "ether")
    print(f"The DAI/ETH price is {converted_latest_price}")

    return float(converted_latest_price)


def get_borrowable_data(lending_pool, account):
    """
    Gather borrowable data

    Parameters
    --------
    lending_pool: Contract
        Lending Pool Smart Contract
    account: Address
        User's account

    Returns
    --------
    (available_borrow_eth, total_debt_eth)
    """

    (
        total_colateral_eth,
        total_debt_eth,
        available_borrow_eth,
        current_liquidation_threshhold,
        ltv,
        health_factor,
    ) = lending_pool.getUserAccountData(account.address)

    available_borrow_eth = Web3.fromWei(available_borrow_eth, "ether")
    total_colateral_eth = Web3.fromWei(total_colateral_eth, "ether")
    total_debt_eth = Web3.fromWei(total_debt_eth, "ether")

    print(f"You have {total_colateral_eth} worth of ETH deposited")
    print(f"You have {total_debt_eth} worth of ETH borrowed")
    print(f"You can borrow {available_borrow_eth} worth of ETH")

    return (float(available_borrow_eth), float(total_debt_eth))


def approve_erc20(amount, spender, erc20_address, account):
    """
    Approve sending out ERC20 Tokens

    Parameters
    --------
    amount: int
        Tokens given to the address
    spender: address
        Lending Pool address
    erc20_address: address
        Token address
    account: address
        Token sender address

    Returns
    --------
    Boolean
    """

    print("Approving ERC20 Token...")

    erc20 = interface.IERC20(erc20_address)

    tx = erc20.approve(spender, amount, {"from": account})
    tx.wait(1)

    print("ERC20 Token Approved")

    return tx


def get_lending_pool():
    """
    Get lending pool address from ILendingPoolAddressesProvider and ILendingPool

    Returns
    --------
    LendingPoolAddress
    """

    lending_pool_addresses_provider = interface.ILendingPoolAddressesProvider(
        config["networks"][network.show_active()]["lending_pool_addresses_provider"]
    )
    lending_pool_address = lending_pool_addresses_provider.getLendingPool()
    lending_pool = interface.ILendingPool(lending_pool_address)
    return lending_pool
