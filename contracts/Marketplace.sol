// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

import "@openzeppelin/contracts/utils/Address.sol";

import "hardhat/console.sol";

import "./NFT.sol";

contract Marketplace is ReentrancyGuard, EIP712 {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 

    struct SignedNFTData {
        uint256 tokenID;
        uint256 price;
        string uri;
        address creator;
        string category;
        address collection;
        uint256 royality;
    }
    struct MintData {
        uint256 tokenID;
        uint256 price;
        string uri;
        address creator;
        string category;
        address collection;
        uint256 royality;
        address owner;
    }
    struct Item {
        uint itemId;
        address nftCollection;
        uint tokenId;
        uint price;
        address payable buyer;
        bool sold;
        string category;
    }


    mapping(uint => Item) public items;


    event Bought(
        uint itemId,
        string indexed category,
        uint tokenId,
        address nftCollection,
        uint price,
        address indexed creator,
        address indexed buyer
    );

    constructor(uint _feePercent) EIP712("Lazy Marketplace", "1.0") {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function lazyMintNFT(
      SignedNFTData calldata nft, bytes calldata signature
    ) public payable returns (uint256) {
        // console.log("tokenID",nft.tokenID);
        // console.log("price",nft.price);
        // console.log("uri",nft.uri);
        // console.log("creator",nft.creator);
        // console.log("category",nft.category);
        // console.log("collection",nft.collection);
        // console.log("royality",nft.royality);
        // console.logBytes(signature);
        require(msg.value == nft.price, 'SimonDevNFT: Message value != price');
        address signer = _validateSignature(_hashLazyMint(nft), signature);
        console.log(signer == nft.creator);
        require(signer == nft.creator, 'invalid signature');
        NFT(nft.collection).safeMint(msg.sender, nft.uri);//TODO actual minting happening
        Address.sendValue(payable(nft.creator), msg.value);//TODO pay for creator
        return nft.tokenID;
    }
    function mintNFT(
      MintData calldata nft, bytes calldata signature
    ) public payable returns (uint256) {
        require(msg.value == nft.price, 'SimonDevNFT: Message value != price');
        address signer = _validateSignature(_hashMint(nft), signature);//TODO current owner 
        require(signer == nft.owner, 'invalid signature');//TODO  check the current owner and walletaddress are equal
        NFT(nft.collection).safeMint(msg.sender, nft.uri);//TODO actual minting happening        
        Address.sendValue(payable(nft.owner), msg.value*(100-nft.royality)/100);//TODO pay for creator
        Address.sendValue(payable(nft.creator), msg.value*nft.royality/100);
        
        
        
        return nft.tokenID;
    }
    function _hashLazyMint(
      SignedNFTData calldata nft
    ) internal view returns (bytes32) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("SignedNFTData(uint256 tokenID,uint256 price,string uri,address creator,string category,address collection,uint256 royality)"),
                    nft.tokenID, nft.price, keccak256(bytes(nft.uri)), nft.creator,keccak256(bytes(nft.category)), nft.collection,nft.royality
        )));
        return digest;
    }
    function _hashMint(
      MintData calldata nft
    ) internal view returns (bytes32) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("SignedNFTData(uint256 tokenID,uint256 price,string uri,address creator,string category,address collection,uint256 royality)"),
                    nft.tokenID, nft.price, keccak256(bytes(nft.uri)), nft.creator,keccak256(bytes(nft.category)), nft.collection,nft.royality
        )));
        return digest;
    }
    function _validateSignature(bytes32 digest, bytes memory signature) internal view returns (address) {
        address signer = ECDSA.recover(digest, signature);
        console.log("signer output",signer);
        return signer;
    }
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}
