//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import { Collection_Card } from "../../src/interfaces";
import authToken from "../../services/auth.token";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const token = req.body.data.token;
    await authToken.userAuthToken(token).then(async (address) => {
      if (ethers.utils.isAddress(address!) && typeof address == "string") {
        const userData = {
          walletAddress: address,
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
          let collections: Collection_Card[] = [];
          if (results) {
            for (const result of results) {
              if (result.status === "BLOCKED") {
                continue;
              }
              collections.push({
                id: result.id,
                collectionName: result.collectionName,
                featuredImage: result.featuredImage,
                logoImage: result.logoImage,
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
        res
          .status(401)
          .json({ message: "Unauthorized", success: false, data: [] });
      }
    });
  } else {
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: [] });
  }
};
export default handler;
