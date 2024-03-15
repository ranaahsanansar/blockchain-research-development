
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.16;

abstract contract NftGenericts {
  struct NftGenetics {
    uint256 breedingPrice;
    string geneticsUri;
    string tokenUri;
  }

  mapping(uint256 => NftGenetics) public nftGenetics;


  function setNftGenetics(uint256 tokenId, NftGenetics memory genetics) internal {
    nftGenetics[tokenId] = genetics;
  }

  function getNftGenetics(uint256 tokenId) external view returns (NftGenetics memory) {
    return nftGenetics[tokenId];
  }
}