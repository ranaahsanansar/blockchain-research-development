// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftGenetics.sol";

contract BreedingToken is ERC721, NftGenetics, Ownable {
    uint256 private _nextTokenId;

    constructor(
        address initialOwner
    ) ERC721("MyToken", "MTK") Ownable(initialOwner) {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function setNftGenetics(
        uint256 tokenId,
        NftGenetics memory genetics
    ) public onlyOwner {
        _setNftGenetics(tokenId, genetics);
    }
}
