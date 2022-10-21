pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT
import "./NFTCollection.sol";
contract Factory {

    NFTCollection[] public deployedCollection;
    address private marketplace;

    constructor(address _marketplace) {
        marketplace=_marketplace;
    }
    function createNewCollection(string memory _name) public payable returns ( NFTCollection){
        NFTCollection collection = new NFTCollection(_name,marketplace);
        deployedCollection.push(collection);
        return collection;
    }
    
}   