from brownie import accounts, config, SimpleStorage, network


def deploy_storage():

    account = get_account()
    simple_storage = SimpleStorage.deploy({"from": account})
    stored_value = simple_storage.retrieve()
    print(stored_value)

    transaction = simple_storage.store(15, {"from": account})
    transaction.wait(1)
    new_stored_value = simple_storage.retrieve()
    print(new_stored_value)


def get_account():
    # account = accounts.load("freecodecamp-account")
    # print(account)
    # account = accounts.add(config["wallets"]["from_key"])
    if network.show_active() == "development":
        return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key"])


def main():
    deploy_storage()
