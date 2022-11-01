import { GetAccountResult } from "@wagmi/core";
import { BaseProvider } from "@ethersproject/providers";
import { BigNumber } from "ethers";

export interface NFTData {
  tokenID: number;
  uri: string;
  price: number;
  creator: string;
  name: string;
}

export type NFT = {
  tokenID: number;
  uri: string;
  price: string;
  creator: string | undefined;
  category: string;
  collection: string;
};

export type SalesOrder = {
  nftData: NFT;
  sold: boolean;
  name: string;
  description: string;
  image: string;
  royality: number;
};
export type NFT_load = {
  id: string;
  category: string;
  collection: string;
  price: string;
  tokenID: number;
  uri: string;
  signature: string;
  sold: boolean;
  description: string;
  image: string;
  name: string;
  listed: boolean;
  listingtype: string;
  endDate: string;
  royality: number;
  walletAddress: string;
  creatorWalletAddress: string;
};
export type NFT_Card = {
  id: string;
  price: string;
  image: string;
  name: string;
  listed: boolean;
  category: string;
  ownerId: string;
  ownerWalletAddress: string;
};
export type CreateFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  collection: string;
  image: string;
};

export type Profile = {
  walletAddress: string;
  type: string;
  userName: string;
  bannerImage: string;
  profileImage: string;
};

export type User = {
  id: string;
  User_ID: string;
  Name: string;
  //Date: Date;
  Total: number;
  Created: number;
  Volume: number;
  Status: string;
  Type: string;
  reportType: string;
  reportedBy: string;
  //reportedDate: Date;
};

export type Collection = {
  collectionName: string;
  collectionID: string;
  category: string;
  ownerId: string;
  createdDate: Date;
  NFTcount: Number;
  floorPrice: string;
  totalVolume: string;
  status: string;
  reportType: string;
  reportedBy: string;
  reportedDate: Date;
};
export type Collection_Profile = {
  id: string;
  collectionName: string;
  category: string;
  ownerId: string;
  NFTcount: Number;
  floorPrice: string;
  totalVolume: string;
  bannerImage: string;
  logoImage: string;
};

export type Collection_Card = {
  id: string;
  collectionName: string;
  featuredImage: string;
  logoImage: string;
  category: string;
};
export type Collection_Item = {
  collectionAddress: string;
  collectionName: string;
  category: string;
};
export type NFT_Report = {
  id: string;
  name: string;
  nftID: string;
  collection: string;
  creator: string;
  creatorID: string;
  owner: string;
  ownerId: string;
  createdDate: string;
  status: string;
  reportType: string;
  reportedBy: string;
  reportedDate: Date;
};

export type Report = {
  id: string;
  reportedId: string; // id of nft, user or collection
  reportType: string; //nft, user or collection
  reporter: string | undefined; // who reported
  reporterId: string; // reported person's ID
  reason: string;
  DateTime: Date;
  STATUS: string;
};
