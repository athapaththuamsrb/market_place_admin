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
  signature: string | undefined;
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
  royality: number;
  walletAddress: string;
  creatorWalletAddress: string;
};
export type NFT_card = {
  id: string;
  price: string;
  image: string;
  name: string;
  listed: boolean;
  category: string;
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
  Date: Date;
  Total: number;
  Created: number;
  Volume: number;
  Status: string;
  Type: string;
  reportType: string;
  reportedBy: string;
  reportedDate: Date;
};

export type Collection = {
  id: string;
  collectionName: string;
  collectionID: string;
  category: string;
  ownerId: string;
  createdDate: Date;
  NFTcount: Number;
  floorPrize: Number;
  totalPrize: Number;
  status: string;
  reportType: string;
  reportedBy: string;
  reportedDate: Date;
};

export type Collection_Card = {
  id: string;
  collectionName: string;
  featuredImage: string;
};
export type Collection_Item = {
  collectionAddress: string;
  collectionName: string;
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
