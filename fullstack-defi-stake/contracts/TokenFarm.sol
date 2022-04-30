// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title Token Farm Contract
 * @author DJ Evan
 * @notice Controls logic for the defi
 * @dev available functions: stakeTokens, unStakeTokens, issueTokens, addAllowedTokens, getValue
 */
contract TokenFarm is Ownable {
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokenStaked;
    mapping(address => address) public tokenPriceFeedMapping;

    address[] public stakers;
    address[] public allowedTokens;

    IERC20 public crewmateToken;

    constructor(address _crewmateTokenAddress) {
        crewmateToken = IERC20(_crewmateTokenAddress);
    }

    /**
     * @notice set price feed for this contract
     * @dev only owner may call this function
     */
    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    /**
     * @notice send stakers token reward based on TVL
     * @dev only owner may call this function
     */
    function issueTokens() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 userTotalValue = getUserTotalValue(recipient);
            crewmateToken.transfer(recipient, userTotalValue);
        }
    }

    /**
     * @notice get all user's value locked
     * @param _user selected user address
     * @return uint256 user's TVL
     */
    function getUserTotalValue(address _user) public view returns (uint256) {
        require(uniqueTokenStaked[_user] > 0, "No token staked");

        uint256 totalValue = 0;
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            totalValue =
                totalValue +
                getSingleTokenValue(_user, allowedTokens[i]);
        }

        return totalValue;
    }

    /**
     * @notice get value of each user's token
     * @dev converts token value to USD
     * @dev token's price * user's staking balance
     * @param _user selected user address
     * @param _token token address
     * @return uint256 the converted token amount
     */
    function getSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        if (uniqueTokenStaked[_user] <= 0) return 0;

        (uint256 price, uint256 decimals) = getTokenValue(_token);

        return ((stakingBalance[_token][_user] * price) / (10**decimals));
    }

    /**
     * @notice get token price
     * @dev gather price feed from chainlink
     * @param _token token address
     * @return uint256 price feed, decimals
     */
    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());

        return (uint256(price), decimals);
    }

    /**
     * @notice stake token to the contract
     * @dev only for certain tokens
     * @param _amount how much token wanted to be staked
     * @param _token token address
     */
    function stakeTokens(uint256 _amount, address _token) public {
        require(_amount > 0, "Amount must be more than 0");
        require(
            tokenIsAllowed(_token),
            "This token currently maynot be staked"
        );
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        updateUniqueTokenStaked(msg.sender, _token);
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;

        if (uniqueTokenStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    /**
     * @notice transfer the staked balance back to the owner
     * @param _token token address
     */
    function unstakeTokens(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];

        require(balance > 0, "Staking balance cannot be zero");

        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokenStaked[msg.sender] = uniqueTokenStaked[msg.sender] - 1;
    }

    /**
     * @notice tracks each user staked tokens
     * @param _user selected user address
     * @param _token token address
     */
    function updateUniqueTokenStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokenStaked[_user] = uniqueTokenStaked[_user] + 1;
        }
    }

    /**
     * @notice allow token to be staked
     * @param _token token address
     * @dev only owner may call this function
     */
    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    /**
     * @notice check is token allowed to stake
     * @param _token token address
     * @return boolean
     */
    function tokenIsAllowed(address _token) public returns (bool) {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (allowedTokens[i] == _token) return true;
        }

        return false;
    }
}
