import os
from solcx import compile_standard, install_solc
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

with open("./SimpleStorage.sol", "r") as file:
    simple_storage_file = file.read()

install_solc("0.6.0")
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"SimpleStorage.sol": {"content": simple_storage_file}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"]
                }
            }
        },
    },
    solc_version="0.6.0",
)

with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)

# get bytecode
bytecode = compiled_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["evm"][
    "bytecode"
]["object"]

# get abi
abi = compiled_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["abi"]

# connect to ganache
# w3 = Web3(Web3.HTTPProvider("HTTP://127.0.0.1:8545"))
# chain_id = 1337
# my_address = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"
# private_key = os.getenv("PRIVATE_KEY")

# connect to Rinkeby
w3 = Web3(
    Web3.HTTPProvider("https://rinkeby.infura.io/v3/0380aa7b52be4573a4d36764d8a3cf34")
)
chain_id = 4
my_address = "0xE43411b1a61259e5104c9808a5c63b8FcC973B31"
private_key = os.getenv("PRIVATE_KEY")

# create contract
SimpleStorage = w3.eth.contract(abi=abi, bytecode=bytecode)

# get the latest transaction
nonce = w3.eth.getTransactionCount(my_address)

# 1. build a transaction
# 2. sign a transaction
# 3. send a transaction
# {"chainId": chain_id, "from": my_address, "nonce": nonce}

transaction = SimpleStorage.constructor().buildTransaction(
    {
        "from": my_address,
        "nonce": nonce,
        "chainId": chain_id,
        "gas": 1728712,
        "gasPrice": w3.eth.gas_price,
    }
)
signed_txn = w3.eth.account.sign_transaction(transaction, private_key)

# print(signed_txn)

# send signed transaction
print("Deploying contract...")
tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print("Deployed!")


# working with contract -> need contract address, abi
simple_storage = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

# call -> Don't make a state change, not changing blockchian
# transact -> Make state change, interacts with the block

# initial value of fav number
print(simple_storage.functions.retrieve().call())

print("Updating contract...")

store_transaction = simple_storage.functions.store(15).buildTransaction(
    {
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce + 1,
        "gasPrice": w3.eth.gas_price,
    }
)
signed_store_txn = w3.eth.account.sign_transaction(
    store_transaction, private_key=private_key
)
send_store_tx = w3.eth.send_raw_transaction(signed_store_txn.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(send_store_tx)

print("Updated!")

print(simple_storage.functions.retrieve().call())
