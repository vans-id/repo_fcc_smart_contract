from brownie import accounts, network, config, LinkToken, VRFCoordinatorMock, Contract
from web3 import Web3

LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["hardhat", "development", "ganache", "mainnet-fork"]
OPENSEA_URL = "https://testnets.opensea.io/assets/{}/{}"
BREED_MAPPING = {0: "PUG", 1: "SHIBA_INU", 2: "ST_BERNARD"}

contract_to_mock = {"link_token": LinkToken, "vrf_coordinator": VRFCoordinatorMock}


def get_breed(breed_number):
    """
    Map number to breeding

    Parameters
    --------
    breed_number: number
        number that representing the breed

    Returns
    --------
    Breed: string
    """
    return BREED_MAPPING[breed_number]


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


def get_contract(contract_name):
    """This function will grab the contract addresses from brownie config if defined. Otherwise, it'll deploy a mock version of that contract and return that mock contract

    Parameters
    ----------
    contract_name: string
        name of the contract

    Returns
    ----------
    brownie.network.contract.ProjectContract:
        The most recently deployed version of selected contract
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


def deploy_mocks():
    """
    Deploy Mock to a testnet
    """

    print(f"The active network is {network.show_active()}")
    print("Deploying mocks...")

    account = get_account()

    print("Deploying Mock LinkToken...")

    link_token = LinkToken.deploy({"from": account})

    print(f"Link Token deployed to {link_token.address}")
    print("Deploying Mock VRF Coordinator...")

    vrf_coordinator = VRFCoordinatorMock.deploy(link_token.address, {"from": account})

    print(f"VRFCoordinator deployed to {vrf_coordinator.address}")
    print("All done!")


def fund_with_link(
    contract_address, account=None, link_token=None, amount=Web3.toWei(1, "ether")
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

    Returns
    ----------
    tx: link Token transaction
    """

    account = account if account else get_account()
    link_token = link_token if link_token else get_contract("link_token")

    funding_tx = link_token.transfer(contract_address, amount, {"from": account})
    funding_tx.wait(1)

    print(f"Funded {contract_address}")
    return funding_tx
