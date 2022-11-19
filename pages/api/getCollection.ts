//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import { Collection, Collection_Profile, NFT_Card } from "../../src/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id } = req.body.data;
    try {
      const collection = await prisma.collection.findUnique({ where: { id } });
      if (collection) {
        if (collection.status === "BLOCKED") {
          throw new Error("This collection not accecpted");
        }
        const user1 = await prisma.user.findUnique({
          where: { id: collection.creatorId },
        });
        const collectionData: Collection_Profile = {
          id: collection.id,
          collectionName: collection.collectionName,
          category: collection.collectionCategory,
          ownerId: collection.creatorId,
          NFTcount: collection.nftCount,
          floorPrice: collection.floorPrice,
          totalVolume: collection.totalVolume,
          bannerImage: collection.bannerImage,
          logoImage: collection.logoImage,
          ownerWalletAddress: user1?.walletAddress!,
        };
        const nfts = await prisma.nFT.findMany({
          where: { collectionId: collection.id, NOT: { status: "BLOCKED" } },
        });
        const finslNFT: NFT_Card[] = [];
        if (nfts.length !== 0) {
          for await (const nft of nfts) {
            const ipfsData = await axios.get(nft.uri);
            if (nft.status === "BLOCKED") {
              continue;
            }
            const activity = await prisma.activity.findFirst({
              where: {
                nftId: nft.id,
                isExpired: false,
              },
            });
            const owner = await prisma.owner.findUnique({
              where: { id: nft.ownerId },
            });
            let list: NFT_Card;
            if (owner) {
              if (activity && !nft.isMinted) {
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
              } else if (!activity && !nft.isMinted) {
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
              } else if (nft.isMinted) {
                list = {
                  id: nft.uri.split("/")[4],
                  price: "0",
                  image: ipfsData.data.image,
                  name: ipfsData.data.name,
                  listed: false,
                  category: ipfsData.data.category,
                  ownerId: nft.ownerId,
                  ownerWalletAddress: owner.walletAddress,
                };
              } else {
                throw new Error("nft wrong");
              }
              finslNFT.push(list);
            } else {
              res
                .status(401)
                .json({ message: "Unauthorized", success: false, data: {} });
            }
          }
        }
        await prisma.$disconnect();
        res.status(201).json({
          message: "Successfully get",
          success: true,
          data: { collectionData: collectionData, nftList: finslNFT },
        });
      } else {
        throw new Error("Collection is not exit");
      }
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "Collection is not exit", success: false, data: {} });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: {} });
  }
};
export default handler;
