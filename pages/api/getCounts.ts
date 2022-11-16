import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { CountData } from "../../src/interfaces";
import { count } from "console";
const prisma = new PrismaClient();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const Users: CountData[] = [];
      const activeUser = await prisma.user.count({
        where: { status: "ACTIVE" },
      });
      Users.push({
        status: "Active Users",
        count: activeUser,
      });

      const reportedUser = await prisma.user.count({
        where: { status: "REPORTED" },
      });
      Users.push({
        status: "Reported Users",
        count: reportedUser,
      });

      const blockedUser = await prisma.user.count({
        where: { status: "BLOCKED" },
      });
      Users.push({
        status: "Blocked Users",
        count: blockedUser,
      });

      const Collections: CountData[] = [];
      const activeCollection = await prisma.collection.count({
        where: { status: "ACTIVE" },
      });
      Collections.push({
        status: "Active collections",
        count: activeCollection,
      });

      const reportedCollection = await prisma.collection.count({
        where: { status: "REPORTED" },
      });
      Collections.push({
        status: "Reported collections",
        count: reportedCollection,
      });

      const blockedCollection = await prisma.collection.count({
        where: { status: "BLOCKED" },
      });
      Collections.push({
        status: "Blocked collections",
        count: blockedCollection,
      });

      const NFTs: CountData[] = [];
      const activeNFT = await prisma.nFT.count({
        where: { status: "ACTIVE" },
      });
      NFTs.push({
        status: "Active NFTs",
        count: activeNFT,
      });

      const reportedNFT = await prisma.nFT.count({
        where: { status: "REPORTED" },
      });
      NFTs.push({
        status: "Reported NFTs",
        count: reportedNFT,
      });

      const blockedNFT = await prisma.nFT.count({
        where: { status: "BLOCKED" },
      });
      NFTs.push({
        status: "Blocked NFTs",
        count: blockedNFT,
      });

      res.status(201).json({
        message: "success",
        success: true,
        data: [Users, Collections, NFTs],
      });
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      res
        .status(401)
        .json({ message: "Unauthorized", success: false, data: [] });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
