// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.16;

abstract contract Genetics {
    uint256 ageLimit;
    struct NftGenetics {
        uint256 breedingPrice;
        uint256 dateOfBirth;
        string tokenUri;
    }

    mapping(uint256 => NftGenetics) internal nftGenetics;

    function _setAgeLimit(uint256 _ageLimit) internal {
        ageLimit = _ageLimit;
    }

    function _setNftGenetics(
        uint256 tokenId,
        NftGenetics memory genetics
    ) internal {
        nftGenetics[tokenId] = genetics;
    }

    function getNftGenetics(
        uint256 tokenId
    ) external view returns (NftGenetics memory) {
        return nftGenetics[tokenId];
    }

    function _setBreedingPrice(uint256 _price, uint256 tokenId) internal {
        nftGenetics[tokenId].breedingPrice = _price;
    }

    function _checkBreedingStatus(
        uint256 tokenId
    ) internal view returns (bool) {
        if (nftGenetics[tokenId].dateOfBirth + ageLimit <= block.timestamp) {
            return true;
        } else {
            return false;
        }
    }

    function _getBreedingPrice(
        uint256 tokenId
    ) internal view returns (uint256) {
        return nftGenetics[tokenId].breedingPrice;
    }
}
