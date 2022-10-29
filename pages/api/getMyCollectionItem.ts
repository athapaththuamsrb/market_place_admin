//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Collection_Item } from "../../src/interfaces";
import authToken from "../../services/auth.token";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const token = req.body.data.authTokens;
    const userData = {
      walletAddress: req.body.data.address,
    };
    if (await authToken.userAuthToken(token)) {
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
            if (result.status === "BLOCKED") {
              continue;
            }
            collections.push({
              collectionAddress: result.collectionAddress,
              collectionName: result.collectionName,
              category: result.collectionCategory,
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
        .status(401)
        .json({ message: "Token not found", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
