// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

/**  
@title Smart Contract for Lottery
@author DJ Evan
*/
contract Lottery is VRFConsumerBase, Ownable {
    address payable[] public players;
    uint256 public usdEntryFee;
    AggregatorV3Interface internal ethUsdPriceFeed;
    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }
    LOTTERY_STATE public lottery_state;
    uint256 public fee;
    bytes32 public keyhash;

    constructor(
        address _priceFeedAddress,
        address _vrfCoordinator,
        address _link,
        uint256 _fee,
        bytes32 _keyhash
    ) public VRFConsumerBase(_vrfCoordinator, _link) {
        usdEntryFee = 50 * (10**18);
        ethUsdPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        lottery_state = LOTTERY_STATE.CLOSED;
        fee = _fee;
        keyhash = _keyhash;
    }

    /** 
    @notice assign player's address to players array
    @notice Require at least $50
    */
    function enter() public payable {
        require(lottery_state == LOTTERY_STATE.OPEN);
        require(
            msg.value >= getEntranceFee(),
            "At least $50 required to participate"
        );
        players.push(msg.sender);
    }

    /** 
    @notice get the entrance fee in ETH
    @dev 18 decimals for converting ETH to USD
    @return uint256 costToEnter
    */
    function getEntranceFee() public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        uint256 adjustedPrice = uint256(price) * 10**10;
        uint256 costToEnter = (usdEntryFee * 10**18) / adjustedPrice;

        return costToEnter;
    }

    /**
    @notice start the lottery
    */
    function startLottery() public onlyOwner {
        require(
            lottery_state == LOTTERY_STATE.CLOSED,
            "Can't start a new lottery yet"
        );
        lottery_state = LOTTERY_STATE.OPEN;
    }

    /** 
    @notice pick lottery winner
    @dev pseudorandomness, do not use this!
    */
    function endLottery() public onlyOwner {
        lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
        bytes32 requestId = requestRandomness(keyhash, fee);

        // uint256(
        //     keccak256(
        //         abi.encodePacked(
        //             nonce, // predictable (aka, transaction number)
        //             msg.sender, // predictable
        //             block.difficulty, // can be manipulated by miners
        //             block.timestamp // predictable
        //         )
        //     )
        // ) % players.length;
    }
}
