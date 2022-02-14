from brownie import SimpleStorage, accounts


def test_deploy():
    # arrange
    account = accounts[0]
    simple_storage = SimpleStorage.deploy({"from": account})

    # act
    starting_value = simple_storage.retrieve()
    expected = 0

    # assert
    assert starting_value == expected


def test_updating_storage():
    account = accounts[0]
    simple_storage = SimpleStorage.deploy({"from": account})

    expected = 0
    simple_storage.store(expected, {"from": account})

    assert expected == simple_storage.retrieve()
