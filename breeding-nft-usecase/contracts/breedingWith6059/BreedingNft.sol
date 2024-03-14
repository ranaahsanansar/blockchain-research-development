// SPDX-License-Identifier: CC0-1.0

pragma solidity ^0.8.16;

import "erc6059-research/NestableToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc6059-research/NftGenericts.sol";

//Minimal public implementation of IRMRKNestable for testing.
contract BreedingNfts is NestableToken , NftGenericts {
    constructor(address initialOwner) NestableToken() {
        Ownable(initialOwner)
    }

    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId);
    }

    function nestMint(
        address to,
        uint256 tokenId,
        uint256 destinationId
    ) external onlyOwner {
        _nestMint(to, tokenId, destinationId, "");
    }

    // Utility transfers:

    function transfer(address to, uint256 tokenId) public virtual {
        transferFrom(_msgSender(), to, tokenId);
    }

    function nestTransfer(
        address to,
        uint256 tokenId,
        uint256 destinationId
    ) public virtual {
        nestTransferFrom(_msgSender(), to, tokenId, destinationId, "");
    }
}
