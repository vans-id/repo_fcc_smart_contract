from brownie import (
    Contract,
    network,
    config,
    accounts,
    MockV3Aggregator,
    VRFCoordinatorMock,
    LinkToken,
    interface,
)

FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]


def get_account(index=None, id=None):
    """Returns an account based on deploy environtment

    Parameters
    ----------
    index: int, optional
        index for the accounts

    id: str, optional
        account id to load

    Returns
    ----------
    LocalAccount: brownie single account
    """

    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONMENTS
    ):
        return accounts[0]

    return accounts.add(config["wallets"]["from_key"])


contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "vrf_coordinator": VRFCoordinatorMock,
    "link_token": LinkToken,
}


def get_contract(contract_name):
    """This function will grab the contract addresses from brownie config if defined. Otherwise, it'll deploy a mock version of that contract and return that mock contract

    Parameters
    ----------
    contract_name: string
        name of the contract

    Returns
    ----------
    brownie.network.contract.ProjectContract:
        The most recently deployed version of this contract
        Ex: MockV3Aggregator[-1]
    """
    contract_type = contract_to_mock[contract_name]

    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = config["networks"][network.show_active()][contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )

    return contract


DECIMALS = 8
INTIIAL_VALUE = 2000_0000_0000


def deploy_mocks(decimals=DECIMALS, initial_value=INTIIAL_VALUE):
    """Deploy contract for MockV3Aggregator, VRFCoordinatorMock or LinkToken

    Parameters
    ----------
    decimals: int, optional
        decimals parameter for MockV3Aggregator

    initial_value: int, optional
        initial_value parameter for MockV3Aggregator
    """

    account = get_account()

    MockV3Aggregator.deploy(decimals, initial_value, {"from": account})
    link_token = LinkToken.deploy({"from": account})
    VRFCoordinatorMock.deploy(link_token.address, {"from": account})

    print("Deployed")


def fund_with_link(
    contract_address, account=None, link_token=None, amount=10_0000_0000_0000_0000
):
    """Fund existing contract with LINK

    Parameters
    ----------
    contract_address: Address
        contract address want to be funded

    account: LocalAccount, optional
        Brownie account to interact with the contract

    link_token: Contract, optional
        LINK Contract to transfer the token

    amount: integer, optional
        Amount given to transfer
    """

    account = account if account else get_account()
    link_token = link_token if link_token else get_contract("link_token")

    # link_token_contract = interface.LinkTokenInterface(link_token.address)
    # tx = link_token_contract.transfer(contract_address, amount, {"from": account})
    tx = link_token.transfer(contract_address, amount, {"from": account})
    tx.wait(1)

    print("Contract has been funded with LINK")
