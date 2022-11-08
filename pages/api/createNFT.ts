//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body;
    const userData = {
      walletAddress: body.nftData.creator,
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
      let collection = await prisma.collection.findFirst({
        where: {
          collectionAddress: body.nftData.collection,
          creatorId: user.id,
        },
      });
      if (collection) {
        await prisma.nFT.create({
          data: {
            collectionId: collection.id,
            tokenID: body.nftData.tokenID,
            uri: body.nftData.uri,
            ownerId: owner.id,
            // signature: body.signature,
          },
        });
        await prisma.collection.update({
          where: {
            collectionAddress: body.nftData.collection,
          },
          data: {
            nftCount: collection.nftCount + 1,
          },
        });
      } else {
        throw new Error("Collection address is not exit");
      }
      await prisma.$disconnect();
      res.status(201).json({ message: "Successfully added", success: true });
    } catch {
      await prisma.$disconnect();
      res.status(400).json({ message: "Bad request", success: false });
    }
  } else {
    await prisma.$disconnect();
    res.status(405).json({ message: "Method not allowed", success: false });
  }
};
export default handler;
