// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CoOwnershipERC721 is ERC721 {

  
  struct CoOwner {
    address walletAddress;
    uint256 sharePercentage; 
  }

//   {
//      walletAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
//      sharePercentage: 23 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//   }

  mapping(uint256 => CoOwner[]) public coOwners;

  event CoOwnerAdded(uint256 tokenId, address coOwner, uint sharePercentage);

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

  modifier onlyOwnerOrApproved(uint256 tokenId) {
    require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner or approved");
    _;
  }

  function _isApprovedOrOwner(address spender, uint256 tokenId) internal view  returns (bool) {
    address owner = ownerOf(tokenId);
    return (spender == owner || isApprovedForAll(owner, spender) || isCoOwner(spender, tokenId));
  }

  function isCoOwner(address wallet, uint256 tokenId) public view returns (bool) {
    for (uint i = 0; i < coOwners[tokenId].length; i++) {
      if (coOwners[tokenId][i].walletAddress == wallet) {
        return true;
      }
    }
    return false;
  }

  function mintWithCoOwners(address to, uint256 tokenId, address[] memory _address , uint256[] memory _percentages ) public  {
    CoOwner[] memory coownerData ;

    for(uint i = 0 ; i < _address.length; i++){
        coownerData[i] = CoOwner(_address[i], _percentages[i]);
    }
    _mint(to, tokenId);
    for (uint i = 0; i < coownerData.length; i++) {
      require(coownerData[i].sharePercentage > 0 && coownerData[i].sharePercentage <= 100, "Invalid share percentage");
      coOwners[tokenId].push(coownerData[i]);
      emit CoOwnerAdded(tokenId, coownerData[i].walletAddress, coownerData[i].sharePercentage);
    }
  }

  function addCoOwner(uint256 tokenId, address coOwner, uint sharePercentage) public onlyOwnerOrApproved(tokenId) {
    require(sharePercentage > 0 && sharePercentage <= 100, "Invalid share percentage");
    coOwners[tokenId].push(CoOwner(coOwner, sharePercentage));
    emit CoOwnerAdded(tokenId, coOwner, sharePercentage);
  }

  function getCoOwners(uint256 tokenId) public view returns (CoOwner[] memory) {
    return coOwners[tokenId];
  }

  function transferFrom(address from, address to, uint256 tokenId) public virtual override {
    super.transferFrom(from, to, tokenId);
  }

}
