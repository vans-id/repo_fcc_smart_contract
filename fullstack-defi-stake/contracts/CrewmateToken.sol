// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title CrewmateToken Contract
 * @author DJ Evan
 * @notice Token Reward for defi
 */
contract CrewmateToken is ERC20 {
    constructor() ERC20("Crewmate Token", "CREW") {
        _mint(msg.sender, 1_000_000 * (10**18));
    }
}
