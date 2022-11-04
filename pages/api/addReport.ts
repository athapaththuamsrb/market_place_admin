import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { reportedId, reportType, reporterWalletAddress, reason } =
      req.body.data;
    try {
      let user = await prisma.user.findUnique({
        where: {
          walletAddress: reporterWalletAddress,
        },
      });
      if (!user) throw new Error("User does not exist");

      const report = await prisma.report.create({
        data: {
          reportedId: reportedId,
          reportType: reportType,
          reporterId: user.id,
          reason: reason,
          STATUS: "REPORTED",
        },
      });
      if (report) {
        console.log(report);
        switch (reportType) {
          //TODO - NFTs not present in DB
          case "NFT":
            await prisma.nFT.update({
              where: {
                id: reportedId,
              },
              data: {
                status: "REPORTED",
              },
            });
            break;
          case "Collection":
            await prisma.collection.update({
              where: {
                id: reportedId,
              },
              data: {
                status: "REPORTED",
              },
            });
            break;
          case "USER":
            await prisma.user.update({
              where: {
                id: reportedId,
              },
              data: {
                status: "REPORTED",
              },
            });

            break;
          default:
            throw new Error("Report Type does not exist!");
        }
      } else {
        throw new Error("Report creation error!");
      }
      res.status(201).json({
        message: "Successful!",
        success: true,
      });
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "User does not exit", success: false, data: [] });
    }
  } else {
    res.status(401).json({ message: "Unauthorized", success: false, data: [] });
  }
};
export default handler;
