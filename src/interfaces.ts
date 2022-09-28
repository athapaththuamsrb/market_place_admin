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
