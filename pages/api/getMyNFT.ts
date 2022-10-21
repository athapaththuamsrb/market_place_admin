//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NFT_card } from "./../../src/interfaces";
import axios from "axios";
import { ethers } from "ethers";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (ethers.utils.isAddress(req.body.data.address)) {
      const userData = {
        walletAddress: req.body.data.address,
      };
      try {
        let user = await prisma.user.findUnique({
          where: userData,
        });
        if (!user) {
          user = await prisma.user.create({
            data: userData,
          });
        }
        let owner = await prisma.owner.findUnique({
          where: userData,
        });
        if (!owner) {
          owner = await prisma.owner.create({
            data: { ...userData, userId: user.id },
          });
        }
        const createdNFTCard: NFT_card[] = [];
        const collectedNFTCard: NFT_card[] = [];
        const nfts = await prisma.nFT.findMany();
        if (nfts.length !== 0) {
          for await (const nft of nfts) {
            const ipfsData = await axios.get(nft.uri);

            if (ipfsData.data.creator === userData.walletAddress) {
              const creatorData = { walletAddress: ipfsData.data.creator };
              let userCreator = await prisma.user.findUnique({
                where: creatorData,
              });
              if (!userCreator) {
                userCreator = await prisma.user.create({
                  data: creatorData,
                });
              }
              let ownerCreator = await prisma.owner.findUnique({
                where: creatorData,
              });
              if (!ownerCreator) {
                ownerCreator = await prisma.owner.create({
                  data: { ...creatorData, userId: userCreator.id },
                });
              }
              const activity = await prisma.activity.findFirst({
                where: {
                  nftId: nft.id,
                  isExpired: false,
                },
              });
              let list: NFT_card;
              if (activity) {
                list = {
                  id: nft.id,
                  price: activity.sellingprice,
                  image: ipfsData.data.image,
                  name: ipfsData.data.name,
                  listed: true,
                  category: ipfsData.data.category,
                  ownerId: nft.ownerId,
                  ownerWalletAddress: ownerCreator.walletAddress,
                };
              } else {
                list = {
                  id: nft.id,
                  price: "0",
                  image: ipfsData.data.image,
                  name: ipfsData.data.name,
                  listed: false,
                  category: ipfsData.data.category,
                  ownerId: nft.ownerId,
                  ownerWalletAddress: ownerCreator.walletAddress,
                };
              }
              createdNFTCard.push(list);
            } else if (nft.ownerId === owner.id) {
              const activity = await prisma.activity.findFirst({
                where: {
                  nftId: nft.id,
                  isExpired: false,
                },
              });
              let list: NFT_card;
              if (activity) {
                list = {
                  id: nft.id,
                  price: activity.sellingprice,
                  image: ipfsData.data.image,
                  name: ipfsData.data.name,
                  listed: true,
                  category: ipfsData.data.category,
                  ownerId: owner.id,
                  ownerWalletAddress: owner.walletAddress,
                };
              } else {
                list = {
                  id: nft.id,
                  price: "0",
                  image: ipfsData.data.image,
                  name: ipfsData.data.name,
                  listed: false,
                  category: ipfsData.data.category,
                  ownerId: owner.id,
                  ownerWalletAddress: owner.walletAddress,
                };
              }
              collectedNFTCard.push(list);
            }
          }
        }
        const { data } = await axios.get(
          `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTs?owner=${userData.walletAddress}`
        );
        if (data.ownedNfts.length !== 0) {
          for await (const nft of data.ownedNfts) {
            const lazyNfts = await prisma.nFT.findMany({
              where: {
                uri: nft.tokenUri.raw,
              },
            });
            if (lazyNfts.length !== 0) {
              continue;
            }
            const ipfsData = await axios.get(nft.tokenUri.raw);
            const { data: collectionMetaData } = await axios.get(
              `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getContractMetadata?contractAddress=${ipfsData.data.collection}`
            );
            let nftCreater = await prisma.user.findUnique({
              where: { walletAddress: ipfsData.data.creator },
            });
            if (!nftCreater) {
              nftCreater = await prisma.user.create({
                data: { walletAddress: ipfsData.data.creator },
              });
            }
            let collection = await prisma.collection.findUnique({
              where: {
                collectionAddress: collectionMetaData.address,
              },
            });
            if (!collection) {
              collection = await prisma.collection.create({
                data: {
                  creatorId: nftCreater.id,
                  collectionCategory: ipfsData.data.category,
                  collectionName: collectionMetaData.contractMetadata.name,
                  collectionAddress: collectionMetaData.address,
                  collectionDescription: "This is new to here",
                },
              });
            }
            const list: NFT_card = {
              id: nft.tokenUri.raw.split("/")[4],
              price: "0",
              image: ipfsData.data.image,
              name: ipfsData.data.name,
              listed: false,
              category: ipfsData.data.category,
              ownerId: owner.id,
              ownerWalletAddress: owner.walletAddress,
            };
            collectedNFTCard.push(list);
          }
        }
        res.status(201).json({
          message: "Successfully received",
          success: true,
          data: [collectedNFTCard, createdNFTCard],
        });
      } catch (error) {
        await prisma.$disconnect();
        res
          .status(400)
          .json({ message: "Bad request", success: false, data: [] });
      }
    } else {
      res
        .status(401)
        .json({ message: "Unauthorized", success: false, data: [] });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
