//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Collection_Card } from "../../src/interfaces";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const results = await prisma.collection.findMany();
      let collections: Collection_Card[] = [];
      if (results) {
        for (const result of results) {
          collections.push({
            id: result.id,
            collectionName: result.collectionName,
            featuredImage: result.featuredImage,
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
    res.status(401).json({ message: "Unauthorized", success: false, data: [] });
  }
};
export default handler;
