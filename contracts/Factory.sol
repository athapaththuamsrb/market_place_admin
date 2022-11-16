pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT
import "./Collection.sol";
contract Factory {

    Collection[] public deployedCollection;
    address private marketplace;

    constructor(address _marketplace) {
        marketplace=_marketplace;
    }
    function createNewCollection(string memory _name) public payable returns (Collection){
        Collection collection = new Collection(_name,"Collection",marketplace);
        deployedCollection.push(collection);
        return collection;
    }
    
}   