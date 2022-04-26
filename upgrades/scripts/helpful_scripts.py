from brownie import accounts, network, config
import eth_utils

LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["hardhat", "development", "ganache", "mainnet-fork"]


def get_account(index=None, id=None):
    """
    Get an account to deploy contract

    Parameters
    --------
    index: number, optional
        index for brownie account
    id: number, optional
        ID for given account

    Returns
    --------
    Account
    """
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])


def encode_function_data(initializer=None, *args):
    """
    Encodes the function call so we can work with an initializer

    Parameters
    --------
    initializer: [brownie.network.contract.ContractTx], optional
        The initializer function we want to call. Example: `box.store`.
        Defaults to None.

    args: Any, optional
        The arguments to pass to the initializer function

    Returns
    --------
    [bytes]: Return the encoded bytes
    """
    if len(args) == 0 or not initializer:
        return eth_utils.to_bytes(hexstr="0x")
    return initializer.encode_input(*args)


def upgrade(
    account,
    proxy,
    new_implementation_address,
    proxy_admin_contract=None,
    initializer=None,
    *args
):
    """
    Upgrade Contract to the next version

    Parameters
    --------
    account: address
        User Account to pay the gas fee

    proxy: address
        Proxy Contract Address

    new_implementation_address: address
        The new version of the Contract Address

    proxy_admin_contract: address, optional
        `ProxyAdmin` contract

    initializer: address, optional
        Initial Contract

    args: Any, optional
        Other arguments to pass to the `encode_function_data` function

    Returns
    --------
    [Transaction]: Return the transaction
    """
    transaction = None
    if proxy_admin_contract:
        if initializer:
            encoded_function_call = encode_function_data(initializer, *args)
            transaction = proxy_admin_contract.upgradeAndCall(
                proxy.address,
                new_implementation_address,
                encoded_function_call,
                {"from": account},
            )
        else:
            transaction = proxy_admin_contract.upgrade(
                proxy.address, new_implementation_address, {"from": account}
            )
    else:
        if initializer:
            encoded_function_call = encode_function_data(initializer, *args)
            transaction = proxy.upgradeToAndCall(
                new_implementation_address, encoded_function_call, {"from": account}
            )
        else:
            transaction = proxy.upgradeTo(new_implementation_address, {"from": account})

    return transaction
