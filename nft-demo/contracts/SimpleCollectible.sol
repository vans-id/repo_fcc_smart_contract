// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleCollectible is ERC721 {
    uint256 public tokenCounter;

    constructor() public ERC721("Doggie", "DOG") {
        tokenCounter = 0;
    }

    /**
     * @notice create a new collectible
     * @param tokenURI memory where the image saved
     * @return newTokenId the newest token ID
     */
    function createCollectible(string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter = tokenCounter + 1;

        return newTokenId;
    }
}
