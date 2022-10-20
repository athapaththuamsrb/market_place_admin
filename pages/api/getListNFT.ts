//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NFT_card } from "./../../src/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const nfts = await prisma.nFT.findMany({
        where: {
          isMinted: false,
        },
      });

      let finalNfts = [];
      for await (const nft of nfts) {
        const owner = await prisma.owner.findUnique({
          where: {
            id: nft.ownerId,
          },
        });
        const activity = await prisma.activity.findFirst({
          where: { nftId: nft.id, isExpired: false },
        });
        if (owner && activity) {
          const ipfsData = await axios.get(nft.uri);
          const nft_card: NFT_card = {
            id: nft.id,
            price: activity.sellingprice,
            image: ipfsData.data.image,
            name: ipfsData.data.name,
            listed: true,
            category: ipfsData.data.category,
            ownerWalletAddress: owner.walletAddress,
          };
          finalNfts.push(nft_card);
        }
      }
      await prisma.$disconnect();
      res
        .status(201)
        .json({ message: "Successfully get", success: true, data: nfts });
    } catch (err) {
      await prisma.$disconnect();
      console.log(err);
      res
        .status(400)
        .json({ message: "Bad request", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
