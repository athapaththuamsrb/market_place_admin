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
  offerPrice: string;
  tokenID: number;
  uri: string;
  signature: string;
  offerSignature: string | null;
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
  ownerUsername: string;
  ownerUserID: string;
  creatorUsername: string;
  creatorUserID: string;
  collectionName: string;
  collectionID: string;
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
  userName: string;
  bannerImage: string;
  profileImage: string;
};

export type User = {
  id: string;
  User_ID: string;
  Name: string;
  //Date: Date;
  //Total: number;
  Owned: number;
  Collections: number;
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
  ownerWalletAddress: string;
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
  reportedOwner: string | undefined; // owner id of reported nft
  reportType: string; //nft, user or collection
  reporter: string | undefined; // who reported
  reporterId: string; // reported person's ID
  reason: string;
  DateTime: Date;
  STATUS: string;
};
export type Session = {
  walletAddress: string;
  type: string;
};

export type Activity = {
  id: string;
  event: string;
  price: string;
  from: string;
  fromID: string;
  to: string;
  toID: string;
  date: string;
};

export type Offer = {
  id: string;
  price: string;
  floor_diff: string;
  expiration: string;
  from: string;
  fromID: string;
  isExpired: boolean;
  state: "ACCEPTED" | "REJECTED" | "PENDING";
  isPaid: boolean;
};

export type OfferToAccept = {
  id: string;
  price: string;
  nftId: string;
  nftName: string;
  nftUrl: string;
  expiration: string;
  owner: string;
  isExpired: boolean;
  state: "ACCEPTED" | "REJECTED" | "PENDING";
  isPaid: boolean;
  tokenID: number;
  uri: string;
  creator: string;
  category: string;
  collection: string;
  royality: string;
  activityType: string;
  saleNum: number;
};

export type CountData = {
  status: string;
  count: number;
};
