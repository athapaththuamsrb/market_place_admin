import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body.data;
    console.log(body);
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
      ////
      let creatorUser = await prisma.user.findUnique({
        where: { walletAddress: body.creatorWalletAddress },
      });
      if (!creatorUser) {
        creatorUser = await prisma.user.create({
          data: { walletAddress: body.creatorWalletAddress },
        });
      }
      let creator = await prisma.creator.findUnique({
        where: { walletAddress: body.creatorWalletAddress },
      });
      if (!creator) {
        creator = await prisma.creator.create({
          data: {
            walletAddress: body.creatorWalletAddress,
            userId: creatorUser.id,
          },
        });
      }
      /////

      await prisma.nFT.create({
        data: {
          category: body.category,
          collection: body.collection,
          creatorId: creator.id,
          ownerId: owner.id,
          price: body.price,
          tokenID: body.tokenID,
          uri: body.uri,
          signature: body.signature,
          description: body.description,
          image: body.image,
          name: body.name,
          listed: true,
          royality: body.royality,
          sale_way: body.saleWay,
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
