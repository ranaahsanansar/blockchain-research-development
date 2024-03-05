// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@thirdweb-dev/contracts/extension/Initializable.sol";
import "@thirdweb-dev/contracts/extension/Upgradeable.sol";

contract Number is Upgradeable , Initializable {
    uint256 public number;

    address public deployer;

    function initialize(uint256 _number) public initializer {
        require(_number > 0 , "Only one Time");
        number = _number;
    }

    function double() public {
        number = number * 2;
    }

    function _authorizeUpgrade(address newImplementation) internal override {
        require(msg.sender == deployer, "Unauthorized");
        require(newImplementation != address(0), "Cannot upgrade to invalid address");
    }
}
