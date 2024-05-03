// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./interfaces/IRegistry.sol";
import "./lib/MinimalProxyStore.sol";
import "./Account.sol";

/**
 * @title A registry for token bound accounts
 * @dev Determines the address for each token bound account and performs deployment of accounts
 * @author Jayden Windle (jaydenwindle)
 */
contract AccountRegistry is IRegistry {
    /**
     * @dev Address of the account implementation
     */
    address public immutable implementation;

    // Mapping For marketplace
    mapping(address => mapping (address=> uint256)) public accountToTokenId;
    mapping(address => mapping (uint256=> address)) public tokenIdToAccount;

    mapping(address => address) public accountToContractAddress;

    /**
     * @dev Emitted whenever new Address Created
     
     */
    event AddressCreated(address indexed newAddress);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    
    /**
     * @dev Deploys the account for an ERC721 token. Will revert if account has already been deployed
     *
     * @param tokenCollection the contract address of the ERC721 token which will control the deployed account
     * @param tokenId the token ID of the ERC721 token which will control the deployed account
     * @return The address of the deployed account
     */
    function createAccount(
        address tokenCollection,
        uint256 tokenId
    ) external returns (address) {
        return _createAccount(block.chainid, tokenCollection, tokenId);
    }

    /**
     * @dev Gets the address of the account for an ERC721 token. If account is
     * not yet deployed, returns the address it will be deployed to
     *
     * @param chainId the chainid of the network the ERC721 token exists on
     * @param tokenCollection the address of the ERC721 token contract
     * @param tokenId the tokenId of the ERC721 token that controls the account
     * @return The account address
     */
    function account(
        uint256 chainId,
        address tokenCollection,
        uint256 tokenId
    ) external view returns (address) {
        return _account(chainId, tokenCollection, tokenId);
    }


    //  TO get contract address or token id of a token bound address
    function getContractAndtokenId(address _tokenBoundAddress) external view returns(uint256 _tokenId, address _contractAddress) {
        address contractAddress = accountToContractAddress[_tokenBoundAddress];
        uint256 tokenId = accountToTokenId[contractAddress][_tokenBoundAddress];
        return (tokenId , contractAddress);
    }

    /**
     * @dev Gets the address of the account for an ERC721 token. If account is
     * not yet deployed, returns the address it will be deployed to
     *
     * @param tokenCollection the address of the ERC721 token contract
     * @param tokenId the tokenId of the ERC721 token that controls the account
     * @return The account address
     */
    function account(
        address tokenCollection,
        uint256 tokenId
    ) external view returns (address) {
        return _account(block.chainid, tokenCollection, tokenId);
    }

    function _createAccount(
        uint256 chainId,
        address tokenCollection,
        uint256 tokenId
    ) internal returns (address) {
        bytes memory encodedTokenData = abi.encode(
            chainId,
            tokenCollection,
            tokenId
        );
        bytes32 salt = keccak256(encodedTokenData);
        address accountProxy = MinimalProxyStore.cloneDeterministic(
            implementation,
            encodedTokenData,
            salt
        );

        accountToTokenId[tokenCollection][accountProxy] = tokenId;
        tokenIdToAccount[tokenCollection][tokenId] = accountProxy;
        accountToContractAddress[accountProxy] = tokenCollection;

        emit AccountCreated(accountProxy, tokenCollection, tokenId);

        return accountProxy;
    }

    function _account(
        uint256 chainId,
        address tokenCollection,
        uint256 tokenId
    ) internal view returns (address) {
        bytes memory encodedTokenData = abi.encode(
            chainId,
            tokenCollection,
            tokenId
        );
        bytes32 salt = keccak256(encodedTokenData);

        address accountProxy = MinimalProxyStore.predictDeterministicAddress(
            implementation,
            encodedTokenData,
            salt
        );

        return accountProxy;
    }
}
