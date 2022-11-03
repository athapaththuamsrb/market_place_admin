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
        const allCollections = await prisma.collection.findMany({
          where: { creatorId: user_data.id },
        });
        var collection_count: number = 0;
        if (allCollections) {
          for (const result of allCollections) {
            if (result.status === "BLOCKED") {
              continue;
            } else {
              collection_count = collection_count + 1;
            }
          }
        }

        var created_count: number = 0;
        var collected_count: number = 0;
        const nfts = await prisma.nFT.findMany();
        for await (const nft of nfts) {
          const ipfsData = await axios.get(nft.uri);
          if (ipfsData.data.creator === user_data.walletAddress) {
            created_count += 1;
          }
          if (nft.ownerId === user_data.id) {
            collected_count += 1;
          }
        }

        results.push({
          id: user_data.id,
          User_ID: user_data.walletAddress,
          Name: user_data.userName,
          Total: created_count + collected_count,
          Created: created_count,
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
    res.status(200).json({ message: "success", success: true, data: [] });
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
