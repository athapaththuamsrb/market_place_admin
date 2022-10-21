//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import { NFT_card } from "../../src/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id } = req.body.data;
    try {
      const collection = await prisma.collection.findUnique({ where: { id } });
      if (collection) {
        const nfts = await prisma.nFT.findMany({
          where: { collectionId: collection.id },
        });
        const finslNFT: NFT_card[] = [];
        if (nfts.length !== 0) {
          for await (const nft of nfts) {
            const ipfsData = await axios.get(nft.uri);
            const activity = await prisma.activity.findFirst({
              where: {
                nftId: nft.id,
                isExpired: false,
              },
            });
            const owner = await prisma.owner.findUnique({
              where: { id: nft.ownerId },
            });
            let list: NFT_card;
            if (owner) {
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
              finslNFT.push(list);
            } else {
              res
                .status(401)
                .json({ message: "Unauthorized", success: false, data: [] });
            }
          }
        }
        res.status(201).json({
          message: "Successfully get",
          success: true,
          data: [collection, finslNFT],
        });
      } else {
        throw new Error("Collection is not exit");
      }
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "Collection is not exit", success: false, data: [] });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
