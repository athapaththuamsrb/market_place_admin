// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Collection.sol";

contract NFTCollection is Collection {

    constructor(string memory _name,address _marketplace) Collection(_name, "Collection", _marketplace){
        
    }
}