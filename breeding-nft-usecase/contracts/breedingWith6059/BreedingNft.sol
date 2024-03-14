// SPDX-License-Identifier: CC0-1.0

pragma solidity ^0.8.16;

import "erc6059-research/NestableToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//Minimal public implementation of IRMRKNestable for testing.
contract BreedingNfts is NestableToken , Ownable {

uint256 private _nextTokenId;

    struct Parents {
        uint256 intrestedToken;
        uint256 partnerToken;
    }

    mapping(uint256 => Parents) public parentsRecord;

    constructor(address initialOwner) NestableToken() Ownable(initialOwner) {
        _nextTokenId = 1;
    }

    function mint(address to) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        parentsRecord[tokenId] = Parents(0, 0 );
        _mint(to, tokenId);
    }

    function breedNft(uint256 intrestedToken , uint256 patnerToken, address intrestedTokenContractAddress ) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _nestMint(intrestedTokenContractAddress, tokenId, intrestedToken, "");
        parentsRecord[tokenId] = Parents(intrestedToken, patnerToken );
    }

    function parentsOf(uint256 tokenId) external view returns (Parents memory _parent) {
        return parentsRecord[tokenId];
    }

    // function nestMint(
    //     address to,
    //     uint256 tokenId,
    //     uint256 destinationId
    // ) external onlyOwner {
    //     _nestMint(to, tokenId, destinationId, "");
    // }

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
