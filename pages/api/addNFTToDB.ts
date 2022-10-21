//TODO pendding
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body.data;
    try {
      let ownerUser = await prisma.user.findUnique({
        where: { walletAddress: body.ownerWalletAddress },
      });
      if (!ownerUser) {
        ownerUser = await prisma.user.create({
          data: { walletAddress: body.ownerWalletAddress },
        });
      }
      let owner = await prisma.owner.findUnique({
        where: { walletAddress: body.ownerWalletAddress },
      });
      if (!owner) {
        owner = await prisma.owner.create({
          data: {
            walletAddress: body.ownerWalletAddress,
            userId: ownerUser.id,
          },
        });
      }
      let creatorUser = await prisma.user.findUnique({
        where: { walletAddress: body.creatorWalletAddress },
      });
      if (!creatorUser) {
        creatorUser = await prisma.user.create({
          data: { walletAddress: body.creatorWalletAddress },
        });
      }
      let collection = await prisma.collection.findUnique({
        //TODO need to ask (when block chain nft put listed what is collection that we put)
        where: { collectionAddress: body.nftData.collection },
      });
      if (!collection) {
        collection = await prisma.collection.create({
          data: {
            creatorId: ownerUser.id,
            collectionName: "undefine",
            collectionAddress: body.nftData.collection,
          },
        });
      }
      await prisma.nFT.create({
        data: {
          collectionId: collection.id,
          tokenID: body.tokenID,
          uri: body.uri,
          ownerId: owner.id,
          signature: body.signature,
        },
      });

      await prisma.$disconnect();
      res.status(201).json({ message: "Successfully add", success: true });
    } catch {
      await prisma.$disconnect();
      res.status(400).json({ message: "Bad request", success: false });
    }
  } else {
    res.status(405).json({ message: "Method not alloed", success: false });
  }
};
export default handler;
