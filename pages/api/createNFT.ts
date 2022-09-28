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
      let creator = await prisma.creator.findUnique({
        where: userData,
      });
      if (!creator) {
        creator = await prisma.creator.create({
          data: { ...userData, userId: user.id },
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
      try {
        const newEntry = await prisma.nFT.create({
          data: {
            category: body.nftData.category,
            collection: body.nftData.collection,
            creatorId: creator.id,
            ownerId: owner.id,
            price: "0",
            tokenID: body.nftData.tokenID,
            uri: body.nftData.uri,
            signature: body.signature,
            description: body.description,
            image: body.image,
            name: body.name,
          },
        });
        await prisma.$disconnect();
        res.status(201).json({ message: "successfully add", success: true });
      } catch (error) {
        await prisma.$disconnect();
        res
          .status(400)
          .json({ message: "Bad request adding nft", success: false });
      }
    } catch {
      await prisma.$disconnect();
      res.status(400).json({ message: "Bad request", success: false });
    }
  } else {
    await prisma.$disconnect();
    res.status(405).json({ message: "Method not alloed", success: false });
  }
};
export default handler;
