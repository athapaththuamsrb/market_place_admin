import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { User } from "../../src/interfaces";
import axios from "axios";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const user = await prisma.user.findMany({});
      let results: User[] = [];
      for (const user_data of user) {
        const owner = await prisma.owner.findFirst({
          where: {
            userId: user_data.id,
          },
        });
        const collection_count = await prisma.collection.count({
          where: {
            creatorId: user_data.id,
            NOT: {
              status: "BLOCKED",
            },
          },
        });

        var collected_count: number = 0;
        collected_count = await prisma.nFT.count({
          where: {
            ownerId: owner?.id,
          },
        });

        results.push({
          id: user_data.id,
          User_ID: user_data.walletAddress,
          Name: user_data.userName,
          //Total: created_count + collected_count,
          Owned: collected_count,
          Collections: collection_count,
          Status: user_data.status,
          Type: user_data.type,
          reportType: "",
          reportedBy: "",
        });
      }
      res.status(201).json({
        message: "Successfully received",
        success: true,
        data: results,
      });
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      res.status(401).json({ message: error, success: false, data: [] });
    }
    //res.status(200).json({ message: "success", success: true, data: [] });
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
