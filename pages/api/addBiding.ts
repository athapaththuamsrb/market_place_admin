//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { nftId, price, endDate, walletAddress, method } = req.body.data;

    try {
      let user = await prisma.user.findUnique({
        where: {
          walletAddress: walletAddress,
        },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            walletAddress: walletAddress,
          },
        });
      }
      const nft = await prisma.nFT.findUnique({
        where: { id: nftId },
      });
      if (!nft || nft.isMinted) throw new Error("nft id is not exist");

      const activity = await prisma.activity.findMany({
        where: { nftId: nftId, isExpired: false },
      });
      if (!activity) throw new Error("activity is not exist");

      if (
        activity[0].listingtype !== method ||
        (method !== "FIXED_PRICE" && method !== "TIMED_AUCTION")
      )
        throw new Error("listingtype is not exist");

      switch (method) {
        case "FIXED_PRICE":
          await prisma.bidding.create({
            data: {
              activityId: activity[0].id,
              userId: user.id,
              listingtype: "OFFER",
              price: price,
              endDate: endDate,
            },
          });
          break;
        case "TIMED_AUCTION":
          await prisma.bidding.create({
            data: {
              activityId: activity[0].id,
              userId: user.id,
              listingtype: "TIMED_AUCTION",
              price: price,
              endDate: endDate,
            },
          });
          break;
        default:
          throw new Error("listingtype is not exist");
      }
      res.status(201).json({
        message: "Successfully get",
        success: true,
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
