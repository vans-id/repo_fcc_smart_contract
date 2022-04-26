from brownie import (
    Contract,
    network,
    Box,
    BoxV2,
    ProxyAdmin,
    TransparentUpgradeableProxy,
)
from scripts.helpful_scripts import get_account, encode_function_data, upgrade


def main():
    account = get_account()
    print(f"Deploying to {network.show_active()}")

    box = Box.deploy({"from": account})

    proxy_admin = ProxyAdmin.deploy({"from": account})
    initializer = box.store, 1

    box_encoded_initializer_function = encode_function_data()

    proxy = TransparentUpgradeableProxy.deploy(
        box.address,
        proxy_admin.address,
        box_encoded_initializer_function,
        {"from": account, "gas_limit": 1_000_000},
    )
    print(f"proxy deployed to {proxy}, you now can upgrade to v2!")

    proxy_box = Contract.from_abi("Box", proxy.address, Box.abi)
    proxy_box.store(1, {"from": account})
    print(proxy_box.retrieve())

    box_v2 = BoxV2.deploy({"from": account})
    upgrade_tx = upgrade(account, proxy, box_v2.address, proxy_admin)
    upgrade_tx.wait(1)

    print("proxy has been upgraded")
    proxy_box = Contract.from_abi("BoxV2", proxy.address, BoxV2.abi)
    proxy_box.increment({"from": account})
    print(proxy_box.retrieve())
