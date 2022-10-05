import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NFT_card } from "./../../src/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const lazyNfts = await prisma.nFT.findMany({
        where: {
          sold: false,
          listed: true,
          isDelete: false,
        },
      });

      let nfts = [];
      for await (const lazyNft of lazyNfts) {
        const owner = await prisma.owner.findUnique({
          where: {
            id: lazyNft.ownerId,
          },
        });
        if (owner) {
          const nft: NFT_card = {
            id: lazyNft.id,
            price: lazyNft.price,
            image: lazyNft.image,
            name: lazyNft.name,
            listed: lazyNft.listed,
            category: lazyNft.category,
            ownerWalletAddress: owner.walletAddress,
          };
          nfts.push(nft);
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
