// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Box {
    uint256 private value;

    /**
     * @notice Emitted when the stored value changes
     */
    event ValueChanged(uint256 newValue);

    /**
     * @notice Stores a new value in the contract
     */
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    /**
     * @notice Reads the last stored value
     */
    function retrieve() public view returns (uint256) {
        return value;
    }
}
