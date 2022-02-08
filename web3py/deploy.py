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
w3 = Web3(Web3.HTTPProvider("HTTP://127.0.0.1:7545"))
chain_id = 5777
my_address = "0x2F42cF5670E53A56D6C298534F801eF6dCa30430"
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
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
print(signed_txn)
