// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./NFT.sol";

contract NFTCollection is NFT {

    constructor(string memory _name,address _marketplace) NFT(_name, "Collection", _marketplace){
        
    }
}