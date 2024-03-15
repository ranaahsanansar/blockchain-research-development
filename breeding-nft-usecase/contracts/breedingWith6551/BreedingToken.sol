// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftGenetics.sol";
import "./OyoCoin.sol";

contract BreedingToken is ERC721, Genetics, Ownable {
    uint256 private _nextTokenId;
    address coinContractAddress;

    constructor(
        address initialOwner,
        address coinAddress
    ) ERC721("Elysium World", "EWT") Ownable(initialOwner)  {
        coinContractAddress = coinAddress;
    }

   

    function updateCoinAddress(address newAddress) public onlyOwner {
        coinContractAddress = newAddress;
    }

    function safeMint(address to , string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setNftGenetics(tokenId , NftGenetics(0, block.timestamp, uri));
    }

    function setOrUpdateBreedingPrice(uint256 price , uint256 tokenId) external {
        require(ownerOf(tokenId) == _msgSender(), "Only Owner can set the price");
        _setBreedingPrice(price , tokenId);
    }

    function breedTokens(uint256 intrestedToken, uint256 partnerToken, string memory uriStorage ) public onlyOwner returns(bool){
        require(_checkBreedingStatus( partnerToken) == true , "Partner is underage");
        require(_checkBreedingStatus( intrestedToken) == true , "Intrested token is underage");
        bool transferStatus = OyoCoin(coinContractAddress).transferFrom(ownerOf(intrestedToken) , ownerOf(partnerToken) , _getBreedingPrice(partnerToken));
        if(transferStatus == true){
            uint256 tokenId = _nextTokenId++;
            _safeMint(ownerOf(intrestedToken), tokenId);
        _setNftGenetics(tokenId , NftGenetics(0, block.timestamp, uriStorage));
        }
        return true; 
    }


}
