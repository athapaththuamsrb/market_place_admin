//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Collection_Item } from "../../src/interfaces";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
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
      const results = await prisma.collection.findMany({
        where: { creatorId: user.id },
      });
      let collections: Collection_Item[] = [];
      if (results) {
        for (const result of results) {
          collections.push({
            collectionAddress: result.collectionAddress,
            collectionName: result.collectionName,
          });
        }
      }
      res.status(201).json({
        message: "Successfully get",
        success: true,
        data: collections,
      });
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "User is not exit", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
