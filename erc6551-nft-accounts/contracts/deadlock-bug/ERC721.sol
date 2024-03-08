// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

// Modifications ---------------- Start 
// Modifi ERC721 contract and make transferFrom function to internal visibility
// also comment transferFrom function in Interface of ERC721
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// Modifications ---------------- End 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// contract AhsanToken is ERC721, ERC721URIStorage, Ownable {
//     uint256 private _nextTokenId;

//     // Modifications ---------------- Start 
//     address private _registery;

//     mapping(uint256 => address) private _nftWallets;
//     // Modifications ---------------- End

//     event NftWallets(
//         address indexed newAddress,
//         uint256 indexed id
//     );

//     // Modifications ---------------- Start 


//     // Modifications ---------------- End 

//     constructor(address initialOwner)
//         ERC721("AhsanToken", "AST")
//         Ownable(initialOwner)
//     {}

//     function safeMint(address to, string memory uri) public onlyOwner {
//         uint256 tokenId = _nextTokenId++;
//         _safeMint(to, tokenId);
//         _setTokenURI(tokenId, uri);
//     }

//     // The following functions are overrides required by Solidity.

//     function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (string memory)
//     {
//         return super.tokenURI(tokenId);
//     }

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }

//     // Modifications ---------------- Start 

//     function isContract(address _addr) private view returns (bool) {
//     bytes32 codehash;
//     assembly {
//         codehash := extcodehash(_addr)
//     }
//     return codehash != 0x0;
//     }


//     function initializeRegistery(address _registeryImplementation) public onlyOwner {
//         _registery = _registeryImplementation;
//     }

//     function asingWalletToNft(uint256 _tokenId, address _newWalletAddress) public {
//         require(msg.sender == _registery, "Only Official Registery can assign wallet to NFT");
//         require(_nftWallets[_tokenId] != address(0) , "NFT Already have a wallet");
//         _nftWallets[_tokenId] = _newWalletAddress;

//         emit NftWallets(_newWalletAddress , _tokenId);
//     }

//     function _newSafeTransfer(address from, address to, uint256 tokenId) public  {
//         if(_nftWallets[tokenId] == to){
//             revert("Nft can't own it's own ownership");
//         }
        
//         transferFrom(from , to , tokenId);
//     }

//     // Modifications ---------------- End
// }
